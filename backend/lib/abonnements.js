/**
 * Abonnements des espaces vendeurs (GOUABO).
 *
 *   Essentiel : portail vendeur complet, sans agents IA — 1 mois d'essai gratuit, puis payant.
 *   Premium   : portail + agents IA et automatisation complète.
 *
 * À l'inscription, tout espace démarre par l'essai gratuit (sans agents). Le vendeur
 * déclare ensuite son paiement (transfert Mobile Money) ; le propriétaire de la
 * plateforme le valide dans son portail, ce qui active la formule pour un mois (30 jours).
 * Sans essai ni abonnement en cours, l'espace est verrouillé et ses produits ne
 * sont plus affichés.
 */
const { nanoid } = require("nanoid");
const db = require("../db");

const JOUR = 864e5;
const DEFAUTS = {
  tarif_essentiel: "20000", tarif_premium: "35000", essai_jours: "30",
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

function formules() {
  const r = reglages();
  return {
    essentiel: { cle: "essentiel", nom: "Essentiel", prix: Math.max(0, Number(r.tarif_essentiel) || 0), essai_jours: Math.max(0, Number(r.essai_jours) || 0), agents: false },
    premium: { cle: "premium", nom: "Premium", prix: Math.max(0, Number(r.tarif_premium) || 0), essai_jours: 0, agents: true },
  };
}
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
  let statut = a.statut;
  const fin = statut === "essai" ? a.essai_fin : statut === "actif" ? a.echeance : null;
  if (fin && new Date(fin).getTime() < maintenant) statut = "expire";
  const acces = statut === "essai" || statut === "actif";
  return {
    formule: a.formule, statut, formule_demandee: a.formule_demandee,
    essai_fin: a.essai_fin, echeance: a.echeance,
    jours_restants: fin && acces ? Math.max(0, Math.ceil((new Date(fin).getTime() - maintenant) / JOUR)) : 0,
    acces,
    // Les agents IA sont réservés à la formule Premium payée
    agents: acces && statut === "actif" && a.formule === "premium",
  };
}

function modifier(boutiqueId, champs) {
  const a = lire(boutiqueId) || creer(boutiqueId);
  const n = { ...a, ...champs, maj_le: new Date().toISOString() };
  db.plateforme.prepare("UPDATE abonnements SET formule = ?, statut = ?, essai_fin = ?, echeance = ?, formule_demandee = ?, maj_le = ? WHERE boutique_id = ?")
    .run(n.formule, n.statut, n.essai_fin, n.echeance, n.formule_demandee, n.maj_le, boutiqueId);
  return etat(boutiqueId);
}

/** Active (ou renouvelle) une formule pour un mois à partir d'aujourd'hui, ou de l'échéance en cours si elle est plus lointaine. */
function activer(boutiqueId, formule, jours = 30) {
  const a = lire(boutiqueId) || creer(boutiqueId);
  const base = a.statut === "actif" && a.formule === formuleValide(formule) && a.echeance && new Date(a.echeance) > new Date() ? new Date(a.echeance).getTime() : Date.now();
  return modifier(boutiqueId, { formule: formuleValide(formule), statut: "actif", echeance: new Date(base + jours * JOUR).toISOString(), formule_demandee: formuleValide(formule) });
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
     VALUES (?, ?, ?, ?, ?, ?, ?, 'declare', ?, ?)`
  ).run(id, boutiqueId, f.cle, f.prix, String(operateur || "").slice(0, 40), String(telephone || "").slice(0, 30), String(reference || "").slice(0, 60), String(auteur || "").slice(0, 80), new Date().toISOString());
  modifier(boutiqueId, { formule_demandee: f.cle });
  return lirePaiement(id);
}

/** Décision du propriétaire sur un paiement déclaré. La validation active la formule pour un mois (30 jours). */
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

module.exports = { formules, reglages, ecrireReglages, creer, etat, modifier, activer, paiementsDe, tousLesPaiements, lirePaiement, declarerPaiement, traiterPaiement, abonnementRequis, premiumRequis, formuleValide };
