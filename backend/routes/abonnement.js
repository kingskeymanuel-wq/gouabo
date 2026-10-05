/**
 * Abonnement de l'espace connecté.
 *   GET  /api/abonnement            état, formules, instructions de paiement, historique
 *   POST /api/abonnement/paiement   (admin) déclare un paiement { formule, operateur, telephone, reference }
 * Ces routes restent accessibles quand l'espace est verrouillé : c'est par elles qu'on le débloque.
 */
const express = require("express");
const db = require("../db");
const { adminOnly } = require("../middleware/auth");
const abo = require("../lib/abonnements");
const crypto = require("crypto");
const cinetpay = require("../lib/cinetpay");
const { urlPublique } = require("../lib/outils");
const router = express.Router();

/** Interroge CinetPay pour un paiement en cours et en tire les conséquences. */
async function verifier(p) {
  const r = await cinetpay.statutPaiement(p.transaction_id || p.merchant_id);
  if (r.reussi || r.echoue) return abo.conclurePaiementEnLigne(p.id, { reussi: r.reussi, transactionId: r.transactionId || p.transaction_id, statut: r.statut });
  return p;
}

/**
 * Notification de CinetPay (route publique) : on l'authentifie par son jeton, puis on redemande
 * le statut à CinetPay plutôt que de croire le contenu reçu.
 */
async function notification(req, res) {
  const { notify_token: recu, merchant_transaction_id: mid } = req.body || {};
  const p = mid ? abo.paiementParMarchand(mid) : null;
  if (!p || !recu || !p.notify_token) return res.status(404).json({ erreur: "Transaction inconnue" });
  const a = Buffer.from(String(recu)), b = Buffer.from(String(p.notify_token));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ erreur: "Notification non authentifiée" });
  try { await verifier(p); res.json({ message: "OK" }); }
  catch (e) { console.error("Notification CinetPay (abonnement) :", e.message); res.status(502).json({ erreur: "Vérification impossible, renvoyez la notification" }); }
}

const OPERATEURS = [["momo_orange", "Orange Money"], ["momo_mtn", "MTN MoMo"], ["momo_moov", "Moov Money"], ["momo_wave", "Wave"]];

function instructions() {
  const r = abo.reglages();
  return {
    operateurs: OPERATEURS.filter(([k]) => r[k]).map(([k, mode]) => ({ mode, numero: r[k], titulaire: r.momo_titulaire })),
    // Paiement en ligne confirmé automatiquement (Orange Money, MTN, Moov, Wave via CinetPay)
    en_ligne: cinetpay.estConfigure(), en_ligne_test: cinetpay.estConfigure() && cinetpay.estBacASable(),
    contact_whatsapp: r.contact_whatsapp,
  };
}

router.get("/", (req, res) => {
  const id = db.espaceCourant().id;
  res.json({
    abonnement: abo.etat(id),
    formules: abo.formules(),
    paiement: instructions(),
    historique: req.user.role === "admin" ? abo.paiementsDe(id) : [],
  });
});

// POST /api/abonnement/paiement/en-ligne { formule, email } → { redirection } vers le portail de paiement sécurisé
router.post("/paiement/en-ligne", adminOnly, async (req, res) => {
  if (!cinetpay.estConfigure()) return res.status(503).json({ erreur: "Le paiement en ligne n'est pas encore activé" });
  if (!["essentiel", "premium"].includes(req.body.formule)) return res.status(400).json({ erreur: "Choisissez une formule" });
  const email = String(req.body.email || req.user.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ erreur: "Indiquez votre adresse e-mail (demandée par le portail de paiement)" });
  const id = db.espaceCourant().id, base = urlPublique(req);
  const merchantId = ("AB" + Date.now().toString(36) + crypto.randomBytes(3).toString("hex")).toUpperCase().slice(0, 30);
  const p = abo.ouvrirPaiementEnLigne(id, { formule: req.body.formule, auteur: req.user.nom, telephone: req.user.telephone, merchantId });
  const [prenom, ...reste] = String(req.user.nom || "Vendeur GOUABO").split(" ");
  const nom = reste.join(" ") || prenom;
  try {
    const init = await cinetpay.initialiserPaiement({
      merchantTransactionId: merchantId, montant: p.montant, designation: `GOUABO — pack ${abo.formules()[p.formule].nom} (${abo.formules()[p.formule].duree_libelle})`,
      email, prenom: prenom.length >= 2 ? prenom : prenom + ".", nom: nom.length >= 2 ? nom : nom + ".", telephone: req.user.telephone,
      successUrl: `${base}/admin/#/abonnement`, failedUrl: `${base}/admin/#/abonnement`, notifyUrl: `${base}/api/abonnement-cinetpay/notification`,
    });
    abo.completerPaiementEnLigne(p.id, init);
    res.status(201).json({ redirection: init.paymentUrl, paiement: abo.lirePaiement(p.id) });
  } catch (e) {
    abo.conclurePaiementEnLigne(p.id, { reussi: false, statut: "INITIALISATION" });
    console.error("CinetPay (abonnement) :", e.message);
    res.status(502).json({ erreur: "Le portail de paiement ne répond pas. Réessayez dans un instant." });
  }
});

// POST /api/abonnement/verifier — au retour du portail de paiement : confirme les paiements en cours
router.post("/verifier", async (req, res) => {
  const id = db.espaceCourant().id;
  if (cinetpay.estConfigure()) for (const p of abo.paiementsEnCours(id).slice(0, 3)) { try { await verifier(p); } catch (e) { console.error("Vérification CinetPay :", e.message); } }
  res.json({ abonnement: abo.etat(id), historique: req.user.role === "admin" ? abo.paiementsDe(id) : [] });
});

router.post("/paiement", adminOnly, (req, res) => {
  // Avec le paiement en ligne, plus de déclaration sur parole : seul un paiement confirmé active le pack
  if (cinetpay.estConfigure()) return res.status(409).json({ erreur: "Payez par le portail de paiement sécurisé" });
  const id = db.espaceCourant().id;
  const reference = String(req.body.reference || "").trim();
  const telephone = String(req.body.telephone || "").trim();
  if (!["essentiel", "premium"].includes(req.body.formule)) return res.status(400).json({ erreur: "Choisissez une formule" });
  if (telephone.replace(/\D/g, "").length < 8) return res.status(400).json({ erreur: "Indiquez le numéro qui a envoyé le paiement" });
  if (reference.length < 4) return res.status(400).json({ erreur: "Indiquez l'ID de transaction reçu par SMS" });
  // Un ID de transaction ne sert qu'une fois, sur toute la plateforme
  if (db.plateforme.prepare("SELECT 1 FROM paiements_abonnement WHERE statut = 'valide' AND lower(reference) = lower(?) LIMIT 1").get(reference)) return res.status(409).json({ erreur: "Ce paiement a déjà été enregistré" });
  const p = abo.declarerPaiement(id, { formule: req.body.formule, operateur: req.body.operateur, telephone, reference, auteur: req.user.nom });
  res.status(201).json({ paiement: p, abonnement: abo.etat(id) });
});

module.exports = router;
module.exports.instructions = instructions;
module.exports.notification = notification;
