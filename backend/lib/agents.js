/**
 * Agents IA d'un espace (formule Premium).
 *
 *  - Agent Campagnes : exécute les programmes définis par l'administrateur
 *    (newsletter, promotion, relance…) au jour et à l'heure choisis. Il rédige le
 *    message selon la consigne, puis lance la campagne SMS / e-mail.
 *  - Agent Messages : répond aux messages des clients (formulaire de la boutique
 *    ou e-mails transférés), automatiquement ou après validation.
 *  - Agent Alertes : prévient par SMS l'administrateur et le vendeur dès qu'une
 *    vente est faite ou qu'une commande est en cours.
 *
 * La rédaction passe par Claude quand ANTHROPIC_API_KEY est défini ; sinon les
 * agents utilisent des modèles de messages fixes.
 */
const { nanoid } = require("nanoid");
const db = require("../db");
const ia = require("./ia");
const abo = require("./abonnements");
const marketing = require("./marketing");
const { envoyerSms } = require("./sms");
const { envoyerEmail, echapper } = require("./email");
const { lireBoutique } = require("../routes/parametres");
const { prixEffectif, promoActive, remisePourcent } = require("./prix");
const { lignesCommande, totalCommande } = require("./commandes");

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const fmt = (n) => nf.format(Math.round(n || 0)).replace(/[  ]/g, " ") + " FCFA";
const actifs = () => abo.etat(db.espaceCourant().id).agents;

/* ------------------------------------------------------------ réglages et journal */
const DEFAUTS = {
  alertes_actif: "1", alertes_evenements: "vente,commande_en_ligne,paiement,livraison", alertes_admin: "1", alertes_vendeur: "1", alertes_numeros: "",
  messages_actif: "1", messages_mode: "validation", // validation | auto
};
function lireReglages() {
  const r = { ...DEFAUTS };
  for (const l of db.prepare("SELECT cle, valeur FROM parametres WHERE cle LIKE 'agent_%'").all()) if (l.cle.slice(6) in DEFAUTS) r[l.cle.slice(6)] = l.valeur ?? "";
  return r;
}
function ecrireReglages(v) {
  const maj = db.prepare("INSERT INTO parametres (cle, valeur) VALUES (?, ?) ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur");
  for (const k of Object.keys(DEFAUTS)) if (v[k] !== undefined) maj.run("agent_" + k, String(v[k]).slice(0, 300));
  return lireReglages();
}
function journal(agent, titre, detail = null, statut = "ok") {
  db.prepare("INSERT INTO agents_journal (id, agent, titre, detail, statut, cree_le) VALUES (?, ?, ?, ?, ?, ?)")
    .run(nanoid(), agent, String(titre).slice(0, 160), detail ? String(detail).slice(0, 600) : null, statut, new Date().toISOString());
}

/* ------------------------------------------------------------ ce que l'agent sait de la boutique */
function ficheBoutique() {
  const b = lireBoutique();
  const produits = db.prepare("SELECT * FROM packs WHERE supprime = 0 AND actif = 1 AND stock > 0 ORDER BY cree_le DESC LIMIT 25").all();
  return {
    nom: b.nom,
    texte: [
      `Boutique : ${b.nom}${b.slogan ? " — " + b.slogan : ""}`,
      b.adresse && `Adresse : ${b.adresse}`,
      b.telephone && `Téléphone : ${b.telephone}`,
      `Livraison : ${b.zone_livraison || "à domicile"} — frais ${fmt(b.frais_livraison)}${Number(b.livraison_gratuite_des) > 0 ? `, offerte dès ${fmt(b.livraison_gratuite_des)}` : ""}`,
      "Paiement : à la livraison ou par Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave).",
      "Produits disponibles :",
      ...produits.map((p) => `- ${p.nom} : ${fmt(prixEffectif(p))}${promoActive(p) ? ` (promotion -${remisePourcent(p)} %, au lieu de ${fmt(p.prix)})` : ""}${p.pieces_par_lot > 1 ? `, lot de ${p.pieces_par_lot}` : ""}`),
    ].filter(Boolean).join("\n"),
  };
}

/* ------------------------------------------------------------ agent Campagnes */
const TYPES = {
  newsletter: { nom: "Newsletter", modele: "nouveautes", consigne: "Présente les nouveautés de la boutique et donne envie de les découvrir." },
  promotion: { nom: "Promotion", modele: "promotion", consigne: "Annonce les promotions en cours, avec les prix, et incite à en profiter vite." },
  bonne_semaine: { nom: "Message de la semaine", modele: "bonne_semaine", consigne: "Souhaite une bonne semaine aux clients et rappelle chaleureusement la boutique." },
  relance: { nom: "Relance des clients", modele: "bonne_semaine", consigne: "Relance gentiment les clients qui n'ont pas acheté récemment en leur donnant une bonne raison de revenir." },
};

/**
 * Rédige le message d'une campagne. Renvoie { message, ia }.
 * Le message contient {prenom} et {lien}, remplacés pour chaque client à l'envoi.
 */
async function redigerCampagne({ type = "newsletter", consigne = "", canaux = ["sms"] }) {
  const t = TYPES[type] || TYPES.newsletter;
  const secours = { message: marketing.MODELES[t.modele], ia: false };
  if (!ia.estConfiguree()) return secours;
  const f = ficheBoutique();
  const court = canaux.includes("sms");
  try {
    const texte = await ia.rediger({
      systeme: `Tu rédiges les messages marketing d'une boutique en Côte d'Ivoire, envoyés à ses clients qui ont accepté de les recevoir. Tu écris en français simple, chaleureux et direct, sans majuscules abusives et sans promesse que la boutique ne peut pas tenir. Tu n'inventes ni produit, ni prix, ni remise : tu n'utilises que les informations fournies. Tu réponds uniquement par le texte du message, sans guillemets ni commentaire.`,
      demande: `${f.texte}\n\nType de message : ${t.nom}.\nConsigne de l'administrateur : ${consigne.trim() || t.consigne}\n\nContraintes :\n- Commence par « Bonjour {prenom} » (garde exactement {prenom} : il sera remplacé par le prénom de chaque client).\n- Termine en invitant à visiter la boutique avec exactement {lien} (il sera remplacé par l'adresse de la boutique).\n- ${court ? "Longueur : 280 caractères au maximum, car le message part aussi par SMS." : "Longueur : 3 à 5 phrases."}\n- Un seul paragraphe, sans liste ni émoji.`,
    });
    const message = texte.replace(/\s+/g, " ").trim();
    return { message: /\{lien\}/.test(message) ? message : `${message} {lien}`, ia: true };
  } catch (e) {
    console.error("Agent campagnes : rédaction par IA impossible —", e.message);
    return secours;
  }
}

/** Exécute un programme : rédaction puis envoi de la campagne. */
async function executerProgramme(p) {
  const canaux = String(p.canaux || "sms").split(",").filter((c) => ["sms", "email"].includes(c));
  const { message, ia: parIa } = await redigerCampagne({ type: p.type, consigne: p.consigne || "", canaux });
  const type = (TYPES[p.type] || TYPES.newsletter).modele;
  const id = marketing.lancerCampagne({ titre: p.nom, type, message, canaux, audience: p.audience || "tous", automatique: true });
  const c = db.prepare("SELECT nb_destinataires FROM campagnes WHERE id = ?").get(id);
  journal("campagnes", `Programme « ${p.nom} » exécuté`, `${c.nb_destinataires} destinataire(s) : ${message}`);
  return { campagne_id: id, message, ia: parIa, destinataires: c.nb_destinataires };
}

/** Clé de période : un programme ne s'exécute qu'une fois par jour / semaine / mois. */
function periode(p, d) {
  const jour = d.toISOString().slice(0, 10);
  if (p.frequence === "quotidien") return jour;
  if (p.frequence === "mensuel") return jour.slice(0, 7);
  return marketing.semaine(d);
}
function estDu(p, d = new Date()) {
  if (!p.actif || d.getUTCHours() < Number(p.heure)) return false; // heure d'Abidjan = UTC
  if (p.frequence === "hebdomadaire" && d.getUTCDay() !== Number(p.jour)) return false;
  if (p.frequence === "mensuel" && d.getUTCDate() !== Number(p.jour)) return false;
  return p.dernier !== periode(p, d);
}
/** À appeler régulièrement dans chaque espace : lance les programmes arrivés à l'heure. */
function verifierProgrammes() {
  if (!actifs()) return;
  const maintenant = new Date();
  for (const p of db.prepare("SELECT * FROM agents_programmes WHERE actif = 1").all()) {
    if (!estDu(p, maintenant)) continue;
    db.prepare("UPDATE agents_programmes SET dernier = ?, derniere_execution = ? WHERE id = ?").run(periode(p, maintenant), maintenant.toISOString(), p.id);
    executerProgramme(p).catch((e) => journal("campagnes", `Programme « ${p.nom} » en échec`, e.message, "erreur"));
  }
}

/* ------------------------------------------------------------ agent Alertes (SMS au vendeur et à l'administrateur) */
const EVENEMENTS = {
  vente: "Vente enregistrée en caisse",
  commande_en_ligne: "Nouvelle commande en ligne (vente en cours)",
  paiement: "Paiement encaissé ou confirmé",
  livraison: "Colis livré",
};

/** Prévient l'administrateur et le vendeur concerné. Ne fait rien hors formule Premium. */
function alerter(evenement, commandeId) {
  try {
    if (!actifs()) return;
    const r = lireReglages();
    if (r.alertes_actif !== "1" || !r.alertes_evenements.split(",").includes(evenement)) return;
    const cmd = db.prepare("SELECT * FROM commandes WHERE id = ?").get(commandeId);
    if (!cmd) return;
    const lignes = lignesCommande(cmd);
    const v = lignes[0] || {};
    const noms = new Map(db.prepare("SELECT id, nom FROM packs").all().map((p) => [p.id, p.nom]));
    const articles = lignes.map((l) => `${noms.get(l.pack_id) || "Article"} x${l.quantite}`).join(", ").slice(0, 90);
    const vendeur = v.vendeur_id ? db.prepare("SELECT nom, telephone FROM utilisateurs WHERE id = ?").get(v.vendeur_id) : null;
    const total = fmt(totalCommande(cmd, lignes));
    const ref = cmd.numero_ticket || cmd.numero;
    const texte = {
      vente: `${lireBoutique().nom} : vente ${ref} de ${total} (${articles})${vendeur ? " par " + vendeur.nom.split(" ")[0] : ""}.`,
      commande_en_ligne: `${lireBoutique().nom} : commande en ligne ${ref} en cours, ${total} (${articles}). Client ${cmd.contact_telephone || ""}${cmd.adresse_livraison ? ", " + cmd.adresse_livraison : ""}.`,
      paiement: `${lireBoutique().nom} : paiement de ${total} reçu pour ${ref}.`,
      livraison: `${lireBoutique().nom} : colis ${ref} livré (${total}).`,
    }[evenement];
    const numeros = new Set(String(r.alertes_numeros).split(/[,;\s]+/).filter((n) => n.replace(/\D/g, "").length >= 8));
    if (r.alertes_admin === "1") for (const a of db.prepare("SELECT telephone FROM utilisateurs WHERE role = 'admin' AND actif = 1").all()) numeros.add(a.telephone);
    if (r.alertes_vendeur === "1" && vendeur?.telephone) numeros.add(vendeur.telephone);
    if (!numeros.size) return;
    let simule = false;
    Promise.all([...numeros].map((n) => envoyerSms(n, texte).then((x) => { simule = simule || !!x?.simule; })))
      .then(() => journal("alertes", EVENEMENTS[evenement], `${numeros.size} SMS — ${texte}`))
      .catch((e) => journal("alertes", "Alerte SMS non envoyée", e.message, "erreur"));
  } catch (e) {
    console.error("Agent alertes :", e.message);
  }
}

/* ------------------------------------------------------------ agent Messages (réponses aux clients) */
async function redigerReponse(m) {
  const f = ficheBoutique();
  const prenom = String(m.de_nom || "").trim().split(/\s+/)[0] || "";
  const secours = `Bonjour${prenom ? " " + prenom : ""},\n\nMerci pour votre message. Nous l'avons bien reçu et nous revenons vers vous très rapidement.\n\nCordialement,\n${f.nom}`;
  if (!ia.estConfiguree()) return { reponse: secours, ia: false };
  // Dernière commande de ce client (retrouvé par son téléphone), pour répondre sur son suivi
  let suivi = "";
  const tel = String(m.de_telephone || "").replace(/\D/g, "");
  if (tel.length >= 8) {
    const c = db.prepare("SELECT * FROM commandes ORDER BY maj_le DESC").all().find((x) => String(x.contact_telephone || "").replace(/\D/g, "") === tel);
    if (c) suivi = `\nDernière commande de ce client : ${c.numero}, statut « ${c.statut} »${c.livraison_prevue ? ", livraison prévue le " + c.livraison_prevue : ""}.`;
  }
  try {
    const reponse = await ia.rediger({
      systeme: `Tu es l'assistant du service client d'une boutique en Côte d'Ivoire. Tu réponds par écrit aux messages des clients, en français, avec courtoisie et précision. Tu t'appuies uniquement sur les informations de la boutique fournies : si la réponse n'y figure pas (stock précis, délai particulier, réclamation, remboursement), tu ne l'inventes pas et tu indiques qu'un membre de l'équipe va recontacter le client. Tu ne promets ni remise ni geste commercial. Tu réponds uniquement par le texte de la réponse, prêt à être envoyé, signé du nom de la boutique.`,
      demande: `${f.texte}${suivi}\n\nMessage reçu de ${m.de_nom || "un client"}${m.sujet ? ` (objet : ${m.sujet})` : ""} :\n"""\n${String(m.texte).slice(0, 3000)}\n"""\n\nRédige la réponse (6 phrases au maximum).`,
    });
    return { reponse, ia: true };
  } catch (e) {
    console.error("Agent messages : rédaction par IA impossible —", e.message);
    return { reponse: secours, ia: false };
  }
}

async function envoyerReponse(m, reponse) {
  let simule = false;
  if (/@/.test(m.de_email || "")) {
    const b = lireBoutique();
    const r = await envoyerEmail({
      a: m.de_email, sujet: `Re: ${m.sujet || "Votre message à " + b.nom}`, texte: reponse,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;color:#222;line-height:1.6;white-space:pre-wrap">${echapper(reponse)}</div>`,
    });
    simule = !!r?.simule;
  } else if (String(m.de_telephone || "").replace(/\D/g, "").length >= 8) {
    const r = await envoyerSms(m.de_telephone, reponse.replace(/\s+/g, " ").slice(0, 300));
    simule = !!r?.simule;
  } else {
    throw new Error("Ce message n'a ni e-mail ni téléphone pour répondre");
  }
  db.prepare("UPDATE messages_entrants SET reponse = ?, statut = 'repondu', repondu_le = ? WHERE id = ?").run(reponse, new Date().toISOString(), m.id);
  return { simule };
}

/** Enregistre un message de client et laisse l'agent le traiter (formule Premium). */
function recevoirMessage({ nom, email, telephone, sujet, texte, source = "boutique" }) {
  const id = nanoid();
  db.prepare("INSERT INTO messages_entrants (id, de_nom, de_email, de_telephone, sujet, texte, source, statut, cree_le) VALUES (?, ?, ?, ?, ?, ?, ?, 'nouveau', ?)")
    .run(id, String(nom || "").slice(0, 80), String(email || "").toLowerCase().slice(0, 120), String(telephone || "").slice(0, 30), String(sujet || "").slice(0, 150), String(texte).slice(0, 4000), source, new Date().toISOString());
  const r = lireReglages();
  if (actifs() && r.messages_actif === "1") {
    const m = db.prepare("SELECT * FROM messages_entrants WHERE id = ?").get(id);
    redigerReponse(m).then(async ({ reponse, ia: parIa }) => {
      // Envoi automatique seulement si l'administrateur l'a choisi ET que la réponse vient bien de l'IA
      if (r.messages_mode === "auto" && parIa) {
        const { simule } = await envoyerReponse(m, reponse);
        journal("messages", `Réponse envoyée à ${m.de_nom || m.de_email || m.de_telephone}`, reponse);
      } else {
        db.prepare("UPDATE messages_entrants SET reponse = ?, statut = 'brouillon' WHERE id = ?").run(reponse, id);
        journal("messages", `Réponse préparée pour ${m.de_nom || m.de_email || m.de_telephone}`, "En attente de votre validation");
      }
    }).catch((e) => journal("messages", "Message non traité", e.message, "erreur"));
  }
  return id;
}

module.exports = { TYPES, EVENEMENTS, lireReglages, ecrireReglages, journal, redigerCampagne, executerProgramme, verifierProgrammes, estDu, alerter, redigerReponse, envoyerReponse, recevoirMessage, actifs };

// Toutes les 10 minutes : chaque espace Premium exécute ses programmes arrivés à l'heure
setInterval(() => db.pourChaqueEspace(verifierProgrammes), 10 * 60 * 1000).unref();
setTimeout(() => db.pourChaqueEspace(verifierProgrammes), 20000).unref();
