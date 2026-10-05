/**
 * Portail du propriétaire de la plateforme (extérieur aux espaces vendeurs).
 * Il valide les paiements déclarés, donne ou retire l'accès aux formules,
 * prolonge, suspend, et fixe les tarifs et les numéros de paiement.
 *
 *   POST  /api/proprietaire/connexion              { code } → { jeton }
 *   GET   /api/proprietaire/tableau                espaces, paiements, statistiques, réglages
 *   POST  /api/proprietaire/paiements/:id/valider  { note? }  → active la formule pour un mois
 *   POST  /api/proprietaire/paiements/:id/refuser  { note? }
 *   PATCH /api/proprietaire/espaces/:id            { formule?, statut?, prolonger_jours?, activer? }
 *   PUT   /api/proprietaire/reglages               tarifs, durée d'essai, numéros Mobile Money
 *   PUT   /api/proprietaire/ia                     { cle } clé de l'API Claude des agents IA ("" pour la retirer)
 *
 * Accès : variable PROPRIETAIRE_CODE. Si elle est absente, un code aléatoire est
 * généré au démarrage et affiché dans le journal du serveur (jamais de code par défaut).
 */
const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { SECRET } = require("../middleware/auth");
const abo = require("../lib/abonnements");
const { lireBoutique } = require("./parametres");
const ia = require("../lib/ia");
const { smsConfigure, emailConfigure } = require("../lib/marketing");
const router = express.Router();

let CODE = process.env.PROPRIETAIRE_CODE || "";
if (CODE.length < 8) {
  if (CODE) console.warn("⚠️  PROPRIETAIRE_CODE trop court (8 caractères minimum) : code temporaire généré.");
  CODE = crypto.randomBytes(9).toString("base64url");
  console.log(`   Portail propriétaire : code temporaire ${CODE} (définissez PROPRIETAIRE_CODE pour le fixer)`);
}

// Le propriétaire entre avec le code de l'hébergement (PROPRIETAIRE_CODE), puis peut créer son propre
// mot de passe dans le portail. Le code de l'hébergement reste valable comme accès de secours.
const CLE_MDP = "proprietaire_mdp";
router.post("/connexion", (req, res) => {
  const saisi = String(req.body.code || "").trim();
  const a = Buffer.from(saisi), b = Buffer.from(CODE);
  const parCode = a.length === b.length && crypto.timingSafeEqual(a, b);
  const empreinte = db.reglages.lire(CLE_MDP);
  const parMdp = Boolean(empreinte) && saisi.length > 0 && bcrypt.compareSync(saisi, empreinte);
  if (!parCode && !parMdp) return res.status(401).json({ erreur: "Code ou mot de passe incorrect" });
  res.json({ jeton: jwt.sign({ role: "proprietaire" }, SECRET, { expiresIn: "12h" }) });
});

router.use((req, res, next) => {
  const h = req.headers.authorization || "";
  try {
    if (jwt.verify(h.startsWith("Bearer ") ? h.slice(7) : "", SECRET).role !== "proprietaire") throw new Error();
    next();
  } catch {
    res.status(401).json({ erreur: "Connexion propriétaire requise" });
  }
});

function ficheEspace(b) {
  return db.dansEspace(b.id, () => {
    const admin = db.prepare("SELECT nom, telephone FROM utilisateurs WHERE role = 'admin' ORDER BY cree_le LIMIT 1").get();
    const ventes = db.prepare(
      "SELECT COUNT(DISTINCT v.commande_id) AS n, COALESCE(SUM(v.quantite * v.prix_unitaire), 0) AS ca FROM ventes v LEFT JOIN commandes c ON c.id = v.commande_id WHERE COALESCE(c.statut, '') <> 'annulee'"
    ).get();
    return {
      id: b.id, slug: b.slug, cree_le: b.cree_le, nom: lireBoutique().nom,
      administrateur: admin || null,
      vendeurs: db.prepare("SELECT COUNT(*) AS n FROM utilisateurs WHERE role = 'vendeur'").get().n,
      produits: db.prepare("SELECT COUNT(*) AS n FROM packs WHERE supprime = 0").get().n,
      commandes: ventes.n, chiffre_affaires: ventes.ca,
      abonnement: abo.etat(b.id),
    };
  });
}

/** Alertes réservées à ce portail : fins de souscription (agents IA d'abord) et état technique du service. */
function alertes(espaces) {
  const l = [];
  const etatIa = ia.etat();
  if (!etatIa.configuree) l.push({ niveau: "important", type: "service", titre: "Clé IA non renseignée", detail: "Les agents des packs Premium envoient des modèles de messages standards. Ajoutez la clé dans « Service des agents IA »." });
  else if (etatIa.derniere_erreur) l.push({ niveau: "important", type: "service", titre: "Dernier appel à l'IA en échec", detail: etatIa.derniere_erreur.message });
  if (!smsConfigure()) l.push({ niveau: "info", type: "service", titre: "Aucun fournisseur SMS", detail: "Les SMS (alertes de vente, campagnes) sont simulés : préparés et journalisés, pas envoyés." });
  if (!emailConfigure()) l.push({ niveau: "info", type: "service", titre: "Aucun serveur e-mail", detail: "Les e-mails (newsletters, réponses aux clients) sont simulés." });
  for (const e of espaces) {
    const a = e.abonnement, premium = a.formule === "premium";
    if (a.statut === "actif" && a.jours_restants <= 7) l.push({ niveau: a.jours_restants <= 3 ? "important" : "info", type: premium ? "agents" : "abonnement", espace: e.id, jours: a.jours_restants,
      titre: premium ? `${e.nom} : agents IA arrêtés dans ${a.jours_restants} jour(s)` : `${e.nom} : pack Essentiel à renouveler dans ${a.jours_restants} jour(s)`,
      detail: `Fin de souscription le ${new Date(a.echeance).toLocaleDateString("fr-FR")}${e.administrateur ? " · " + e.administrateur.nom + " " + e.administrateur.telephone : ""}` });
    if (a.statut === "expire" && a.echeance) l.push({ niveau: "important", type: premium ? "agents" : "abonnement", espace: e.id, jours: 0,
      titre: premium ? `${e.nom} : souscription Premium terminée, agents IA arrêtés` : `${e.nom} : souscription terminée, espace verrouillé`,
      detail: `Terminée le ${new Date(a.echeance).toLocaleDateString("fr-FR")}${e.administrateur ? " · " + e.administrateur.nom + " " + e.administrateur.telephone : ""}` });
    if (a.statut === "essai" && !a.paye && a.jours_restants <= 7) l.push({ niveau: "info", type: "abonnement", espace: e.id, jours: a.jours_restants,
      titre: `${e.nom} : essai gratuit terminé dans ${a.jours_restants} jour(s)`, detail: `Pack souhaité : ${a.formule_demandee === "premium" ? "Premium" : "Essentiel"}${e.administrateur ? " · " + e.administrateur.telephone : ""}` });
  }
  const rang = { agents: 0, abonnement: 1, service: 2 };
  return l.sort((x, y) => rang[x.type] - rang[y.type] || (x.jours ?? 0) - (y.jours ?? 0));
}

router.get("/tableau", (req, res) => {
  const espaces = db.listerBoutiques().map((b) => { try { return ficheEspace(b); } catch { return null; } }).filter(Boolean);
  const noms = new Map(espaces.map((e) => [e.id, e.nom]));
  const paiements = abo.tousLesPaiements().map((p) => ({ ...p, boutique: noms.get(p.boutique_id) || "Espace supprimé" }));
  const compte = (f) => espaces.filter(f).length;
  res.json({
    reglages: abo.reglages(),
    formules: abo.formules(),
    service: { ia: ia.etat(), sms: smsConfigure(), email: emailConfigure(), detourage: Boolean(process.env.REMOVE_BG_API_KEY || db.reglages.lire("detourage_cle")) },
    mot_de_passe_cree: Boolean(db.reglages.lire(CLE_MDP)),
    alertes: alertes(espaces),
    espaces,
    paiements,
    stats: {
      espaces: espaces.length,
      essai: compte((e) => e.abonnement.statut === "essai"),
      actifs: compte((e) => e.abonnement.statut === "actif"),
      premium: compte((e) => e.abonnement.statut === "actif" && e.abonnement.formule === "premium"),
      expires: compte((e) => e.abonnement.statut === "expire"),
      suspendus: compte((e) => e.abonnement.statut === "suspendu"),
      a_valider: paiements.filter((p) => p.statut === "declare").length,
      payes: compte((e) => e.abonnement.paye),
      non_payes: compte((e) => !e.abonnement.paye),
      encaisse: paiements.filter((p) => p.statut === "valide").reduce((s, p) => s + p.montant, 0),
    },
  });
});

for (const [action, valide] of [["valider", true], ["refuser", false]]) {
  router.post(`/paiements/:id/${action}`, (req, res) => {
    const p = abo.lirePaiement(req.params.id);
    if (!p) return res.status(404).json({ erreur: "Paiement introuvable" });
    if (p.statut !== "declare") return res.status(409).json({ erreur: "Ce paiement a déjà été traité" });
    res.json({ paiement: abo.traiterPaiement(p.id, valide, req.body.note), abonnement: abo.etat(p.boutique_id) });
  });
}

// Paiement que le propriétaire n'a pas reçu : annulé, la durée correspondante est retirée
router.post("/paiements/:id/annuler", (req, res) => {
  const p = abo.lirePaiement(req.params.id);
  if (!p) return res.status(404).json({ erreur: "Paiement introuvable" });
  if (p.statut !== "valide") return res.status(409).json({ erreur: "Ce paiement est déjà annulé" });
  res.json({ paiement: abo.annulerPaiement(p.id, req.body.note), abonnement: abo.etat(p.boutique_id) });
});

// Autorisations données à la main : changement de formule (mise à niveau), prolongation, suspension, réactivation
router.patch("/espaces/:id", (req, res) => {
  const b = db.boutiqueParRef(req.params.id);
  if (!b) return res.status(404).json({ erreur: "Espace introuvable" });
  const actuel = abo.etat(b.id);
  if (req.body.activer) abo.activer(b.id, req.body.activer, Math.min(3660, Math.max(1, Math.round(Number(req.body.jours) || 30))));
  if (req.body.formule && !req.body.activer) abo.modifier(b.id, { formule: abo.formuleValide(req.body.formule) });
  if (req.body.prolonger_jours) {
    const j = Math.min(3660, Math.max(1, Math.round(Number(req.body.prolonger_jours) || 0)));
    const champ = actuel.statut === "actif" ? "echeance" : "essai_fin";
    const base = Math.max(Date.now(), new Date(actuel[champ] || 0).getTime());
    abo.modifier(b.id, { [champ]: new Date(base + j * 864e5).toISOString(), statut: actuel.statut === "actif" ? "actif" : "essai" });
  }
  if (req.body.statut === "suspendu") abo.modifier(b.id, { statut: "suspendu" });
  if (req.body.statut === "reactiver") {
    const a = db.plateforme.prepare("SELECT * FROM abonnements WHERE boutique_id = ?").get(b.id);
    abo.modifier(b.id, { statut: a.echeance ? "actif" : "essai" });
  }
  res.json(ficheEspace(b));
});

router.put("/mot-de-passe", (req, res) => {
  const nouveau = String(req.body.nouveau || "");
  if (nouveau.length < 10) return res.status(400).json({ erreur: "Le mot de passe doit contenir au moins 10 caractères" });
  if (nouveau !== String(req.body.confirmation || "")) return res.status(400).json({ erreur: "Les deux mots de passe ne correspondent pas" });
  db.reglages.ecrire(CLE_MDP, bcrypt.hashSync(nouveau, 12));
  res.json({ mot_de_passe_cree: true });
});

// Clé du service de détourage des photos (remove.bg), utilisée par le studio photo des packs Premium
router.put("/detourage", (req, res) => {
  const cle = String(req.body.cle || "").trim();
  if (cle && !/^[A-Za-z0-9_-]{16,80}$/.test(cle)) return res.status(400).json({ erreur: "Cette clé n'a pas le format attendu" });
  db.reglages.ecrire("detourage_cle", cle);
  res.json({ detourage: Boolean(cle) });
});

router.put("/ia", (req, res) => {
  const cle = String(req.body.cle || "").trim();
  if (cle && !/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(cle)) return res.status(400).json({ erreur: "Cette clé n'a pas le format d'une clé Anthropic (elle commence par sk-ant-)" });
  ia.enregistrerCle(cle);
  res.json(ia.etat());
});

router.put("/reglages", (req, res) => {
  for (const k of ["tarif_essentiel", "tarif_premium", "essai_jours"]) {
    if (req.body[k] !== undefined && !(Number(req.body[k]) >= 0)) return res.status(400).json({ erreur: "Montant ou durée invalide" });
  }
  res.json(abo.ecrireReglages(req.body || {}));
});

module.exports = router;
