/**
 * Abonnements des espaces vendeurs (GOUABO).
 *
 *   Essentiel : portail vendeur complet, sans agents IA — 1 mois d'essai gratuit, puis 10 000 FCFA les 2 mois.
 *   Premium   : portail + agents IA et automatisation complète — 1 mois gratuit, puis 15 000 FCFA les 3 mois.
 *
 * À l'inscription, tout espace démarre par l'essai gratuit (sans agents). Le vendeur
 * déclare ensuite son paiement (transfert Mobile Money) ; le propriétaire de la
 * plateforme peut l'annuler dans son portail. Chaque paiement ouvre la durée du pack (duree_jours).
 * Sans essai ni abonnement en cours, l'espace est verrouillé et ses produits ne
 * sont plus affichés.
 */
const { nanoid } = require("nanoid");
const db = require("../db");

const JOUR = 864e5;
const DEFAUTS = {
  tarif_essentiel: "10000", tarif_premium: "15000", essai_jours: "30",
  duree_essentiel: "60", duree_premium: "90", // jours ouverts par un paiement
  momo_orange: "", momo_mtn: "", momo_moov: "", momo_wave: "", momo_titulaire: "GOUABO", contact_whatsapp: "",
};
const CLES = Object.keys(DEFAUTS);

function reglages() {
  const r = {};
  for (const k of CLES) r[k] = db.reglages.lire("abo_" + k) ?? DEFAUTS[k];
  return r;
}
function ecrireReglages(v) {
  for (const k of CLES) if (v[k] !== undefined) db.reglages.ecrire("abo_" + k, String(v[k] ?? "").trim().slice(0, 120));
  return reglages();
}

/** « 2 mois », « 3 mois »… ou un nombre de jours quand ce n'est pas un compte rond. */
const libelleDuree = (jours) => (jours % 30 === 0 ? `${jours / 30} mois` : `${jours} jours`);
function formules() {
  const r = reglages();
  const essai = Math.max(0, Number(r.essai_jours) || 0);
  const duree = (v, defaut) => Math.min(3660, Math.max(1, Math.round(Number(v) || defaut)));
  const pack = (cle, nom, tarif, jours, agents) => ({ cle, nom, prix: Math.max(0, Number(tarif) || 0), essai_jours: essai, duree_jours: jours, duree_libelle: libelleDuree(jours), agents });
  return {
    essentiel: pack("essentiel", "Essentiel", r.tarif_essentiel, duree(r.duree_essentiel, 60), false),
    premium: pack("premium", "Premium", r.tarif_premium, duree(r.duree_premium, 90), true),
  };
}
const dureeDe = (formule) => formules()[formuleValide(formule)].duree_jours;
const formuleValide = (f) => (f === "premium" ? "premium" : "essentiel");

const lire = (boutiqueId) => db.plateforme.prepare("SELECT * FROM abonnements WHERE boutique_id = ?").get(boutiqueId);

/** Crée l'abonnement d'un nouvel espace : essai gratuit, formule souhaitée notée. */
function creer(boutiqueId, formuleDemandee = "essentiel", { jours } = {}) {
  if (lire(boutiqueId)) return lire(boutiqueId);
  const maintenant = new Date();
  const essai = jours ?? formules().essentiel.essai_jours;
  db.plateforme.prepare(
    "INSERT INTO abonnements (boutique_id, formule, statut, essai_fin, echeance, formule_demandee, cree_le, maj_le) VALUES (?, 'essentiel', 'essai', ?, NULL, ?, ?, ?)"
  ).run(boutiqueId, new Date(maintenant.getTime() + essai * JOUR).toISOString(), formuleValide(formuleDemandee), maintenant.toISOString(), maintenant.toISOString());
  return lire(boutiqueId);
}

/** État effectif de l'abonnement (un essai ou un abonnement arrivé à terme est « expiré »). */
function etat(boutiqueId) {
  const a = lire(boutiqueId) || creer(boutiqueId);
  const maintenant = Date.now();
  // Pack payé pendant l'essai : il démarre tout seul à la fin de l'essai, pour la durée payée
  if (a.statut === "essai" && a.echeance && new Date(a.essai_fin).getTime() <= maintenant && new Date(a.echeance).getTime() > maintenant) {
    db.plateforme.prepare("UPDATE abonnements SET statut = 'actif', formule = ?, maj_le = ? WHERE boutique_id = ?").run(formuleValide(a.formule_demandee), new Date().toISOString(), boutiqueId);
    return etat(boutiqueId);
  }
  let statut = a.statut;
  const fin = statut === "essai" ? a.essai_fin : statut === "actif" ? a.echeance : null;
  if (fin && new Date(fin).getTime() < maintenant) statut = "expire";
  const acces = statut === "essai" || statut === "actif";
  const payeEnEssai = statut === "essai" && Boolean(a.echeance);
  const premiumPaye = acces && statut === "actif" && a.formule === "premium";
  const decouverte = statut === "essai"; // premier mois gratuit : quelques agents offerts pour découvrir l'automatisation
  return {
    // A payé : abonné en cours, ou en essai avec un pack déjà réglé qui démarrera à la fin de l'essai
    paye: statut === "actif" || payeEnEssai,
    pack_prevu: payeEnEssai ? formuleValide(a.formule_demandee) : null, pack_debut: payeEnEssai ? a.essai_fin : null,
    formule: a.formule, statut, formule_demandee: a.formule_demandee,
    essai_fin: a.essai_fin, echeance: a.echeance,
    jours_restants: fin && acces ? Math.max(0, Math.ceil((new Date(fin).getTime() - maintenant) / JOUR)) : 0,
    acces,
    // Agents IA : pack Premium payé, ou découverte pendant le premier mois gratuit (campagnes e-mail / SMS, publicité Facebook / Instagram)
    agents: premiumPaye || decouverte,
    agents_decouverte: decouverte,
    // Réservés au pack Premium payé : studio photo publicitaire et comptes vendeurs
    studio: premiumPaye,
    vendeurs: premiumPaye,
  };
}

function modifier(boutiqueId, champs) {
  const a = lire(boutiqueId) || creer(boutiqueId);
  const n = { ...a, ...champs, maj_le: new Date().toISOString() };
  db.plateforme.prepare("UPDATE abonnements SET formule = ?, statut = ?, essai_fin = ?, echeance = ?, formule_demandee = ?, maj_le = ? WHERE boutique_id = ?")
    .run(n.formule, n.statut, n.essai_fin, n.echeance, n.formule_demandee, n.maj_le, boutiqueId);
  return etat(boutiqueId);
}

/** Active (ou renouvelle) une formule pour la durée du pack à partir d'aujourd'hui, ou de l'échéance en cours si elle est plus lointaine. */
function activer(boutiqueId, formule, jours = dureeDe(formule)) {
  const a = lire(boutiqueId) || creer(boutiqueId);
  const base = a.statut === "actif" && a.formule === formuleValide(formule) && a.echeance && new Date(a.echeance) > new Date() ? new Date(a.echeance).getTime() : Date.now();
  return modifier(boutiqueId, { formule: formuleValide(formule), statut: "actif", echeance: new Date(base + jours * JOUR).toISOString(), formule_demandee: formuleValide(formule) });
}

/**
 * Prend en compte un paiement, sans validation manuelle :
 *  - pendant l'essai gratuit, le pack payé démarre à la fin de l'essai ;
 *  - sinon il démarre tout de suite, ou prolonge l'abonnement en cours à partir de son échéance.
 */
function payer(boutiqueId, formule, jours = dureeDe(formule)) {
  const a = lire(boutiqueId) || creer(boutiqueId);
  const f = formuleValide(formule);
  if (a.statut === "essai" && new Date(a.essai_fin).getTime() > Date.now()) {
    const base = a.echeance && a.formule_demandee === f ? new Date(a.echeance).getTime() : new Date(a.essai_fin).getTime();
    return modifier(boutiqueId, { echeance: new Date(base + jours * JOUR).toISOString(), formule_demandee: f });
  }
  return activer(boutiqueId, f, jours);
}

/* ---------- Paiement en ligne (CinetPay) : colonnes ajoutées à la table des paiements ---------- */
for (const col of ["merchant_id TEXT", "transaction_id TEXT", "notify_token TEXT", "payment_url TEXT"]) {
  try { db.plateforme.exec("ALTER TABLE paiements_abonnement ADD COLUMN " + col); } catch { /* colonne déjà présente */ }
}

/** Paiement en ligne lancé : en attente de la confirmation de CinetPay. */
function ouvrirPaiementEnLigne(boutiqueId, { formule, auteur, telephone, merchantId }) {
  const f = formules()[formuleValide(formule)];
  const id = nanoid();
  db.plateforme.prepare(
    `INSERT INTO paiements_abonnement (id, boutique_id, formule, montant, operateur, telephone, reference, statut, auteur, cree_le, merchant_id)
     VALUES (?, ?, ?, ?, 'CinetPay', ?, ?, 'en_cours', ?, ?, ?)`
  ).run(id, boutiqueId, f.cle, f.prix, String(telephone || "").slice(0, 30), merchantId, String(auteur || "").slice(0, 80), new Date().toISOString(), merchantId);
  return lirePaiement(id);
}
const completerPaiementEnLigne = (id, { transactionId, notifyToken, paymentUrl }) => db.plateforme.prepare("UPDATE paiements_abonnement SET transaction_id = ?, notify_token = ?, payment_url = ? WHERE id = ?").run(transactionId || null, notifyToken || null, paymentUrl || null, id);
const paiementParMarchand = (merchantId) => db.plateforme.prepare("SELECT * FROM paiements_abonnement WHERE merchant_id = ?").get(String(merchantId));
const paiementsEnCours = (boutiqueId) => db.plateforme.prepare("SELECT * FROM paiements_abonnement WHERE boutique_id = ? AND statut = 'en_cours' ORDER BY cree_le DESC").all(boutiqueId);

/** Résultat confirmé par CinetPay : le pack est pris en compte (une seule fois), ou le paiement est marqué échoué. */
function conclurePaiementEnLigne(id, { reussi, transactionId, statut }) {
  const p = lirePaiement(id);
  if (!p || p.statut !== "en_cours") return p;
  db.plateforme.prepare("UPDATE paiements_abonnement SET statut = ?, reference = COALESCE(?, reference), note = ?, traite_le = ? WHERE id = ?")
    .run(reussi ? "valide" : "echoue", transactionId || null, reussi ? "Confirmé par CinetPay" : "Paiement non abouti (" + statut + ")", new Date().toISOString(), id);
  if (reussi) payer(p.boutique_id, p.formule);
  return lirePaiement(id);
}

/** Le propriétaire annule un paiement qu'il n'a pas reçu : la durée correspondante est retirée. */
function annulerPaiement(id, note = "", jours) {
  const p = lirePaiement(id);
  if (!p || p.statut !== "valide") return p;
  jours = jours ?? dureeDe(p.formule);
  db.plateforme.prepare("UPDATE paiements_abonnement SET statut = 'refuse', note = ?, traite_le = ? WHERE id = ?").run(String(note || "").slice(0, 200) || "Paiement non reçu", new Date().toISOString(), id);
  const a = lire(p.boutique_id);
  if (a?.echeance) {
    const fin = new Date(a.echeance).getTime() - jours * JOUR;
    const plancher = a.statut === "essai" ? new Date(a.essai_fin).getTime() : 0;
    modifier(p.boutique_id, { echeance: fin > plancher ? new Date(fin).toISOString() : a.statut === "essai" ? null : new Date(fin).toISOString() });
  }
  return lirePaiement(id);
}

/* ------------------------------------------------------------ paiements déclarés */
const paiementsDe = (boutiqueId) => db.plateforme.prepare("SELECT * FROM paiements_abonnement WHERE boutique_id = ? ORDER BY cree_le DESC").all(boutiqueId);
const tousLesPaiements = () => db.plateforme.prepare("SELECT * FROM paiements_abonnement ORDER BY cree_le DESC LIMIT 300").all();
const lirePaiement = (id) => db.plateforme.prepare("SELECT * FROM paiements_abonnement WHERE id = ?").get(id);

function declarerPaiement(boutiqueId, { formule, operateur, telephone, reference, auteur }) {
  const f = formules()[formuleValide(formule)];
  const id = nanoid();
  db.plateforme.prepare(
    `INSERT INTO paiements_abonnement (id, boutique_id, formule, montant, operateur, telephone, reference, statut, auteur, cree_le)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'valide', ?, ?)`
  ).run(id, boutiqueId, f.cle, f.prix, String(operateur || "").slice(0, 40), String(telephone || "").slice(0, 30), String(reference || "").slice(0, 60), String(auteur || "").slice(0, 80), new Date().toISOString());
  payer(boutiqueId, f.cle); // pris en compte automatiquement, sans validation du propriétaire
  return lirePaiement(id);
}

/** Décision du propriétaire sur un paiement déclaré. La validation active la formule pour la durée du pack. */
function traiterPaiement(id, valide, note = "") {
  const p = lirePaiement(id);
  if (!p) return null;
  if (p.statut !== "declare") return p;
  db.plateforme.prepare("UPDATE paiements_abonnement SET statut = ?, note = ?, traite_le = ? WHERE id = ?")
    .run(valide ? "valide" : "refuse", String(note || "").slice(0, 200) || null, new Date().toISOString(), id);
  if (valide) activer(p.boutique_id, p.formule);
  return lirePaiement(id);
}

/** Bloque les routes de l'espace quand l'essai ou l'abonnement est terminé (402). */
function abonnementRequis(req, res, next) {
  const e = etat(db.espaceCourant().id);
  if (e.acces) return next();
  res.status(402).json({
    erreur: e.statut === "suspendu" ? "Cet espace a été suspendu. Contactez GOUABO." : "Votre période d'essai ou votre abonnement est terminé. Réglez votre formule pour retrouver l'accès.",
    abonnement: e,
  });
}

/** Réserve une fonction aux espaces Premium payés (agents IA). */
function premiumRequis(req, res, next) {
  if (etat(db.espaceCourant().id).agents) return next();
  res.status(403).json({ erreur: "Les agents IA sont réservés à la formule Premium.", formule_requise: "premium" });
}

/** Studio photo publicitaire : pack Premium payé seulement (pas pendant le mois de découverte). */
function studioRequis(req, res, next) {
  if (etat(db.espaceCourant().id).studio) return next();
  res.status(403).json({ erreur: "Le studio photo est réservé au pack Premium.", formule_requise: "premium" });
}

module.exports = { formules, reglages, ecrireReglages, creer, etat, modifier, activer, paiementsDe, tousLesPaiements, lirePaiement, declarerPaiement, traiterPaiement, payer, annulerPaiement, ouvrirPaiementEnLigne, completerPaiementEnLigne, paiementParMarchand, paiementsEnCours, conclurePaiementEnLigne, abonnementRequis, premiumRequis, studioRequis, formuleValide };
