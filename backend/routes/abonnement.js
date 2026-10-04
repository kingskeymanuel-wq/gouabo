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
const router = express.Router();

const OPERATEURS = [["momo_orange", "Orange Money"], ["momo_mtn", "MTN MoMo"], ["momo_moov", "Moov Money"], ["momo_wave", "Wave"]];

function instructions() {
  const r = abo.reglages();
  return {
    operateurs: OPERATEURS.filter(([k]) => r[k]).map(([k, mode]) => ({ mode, numero: r[k], titulaire: r.momo_titulaire })),
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

router.post("/paiement", adminOnly, (req, res) => {
  const id = db.espaceCourant().id;
  const reference = String(req.body.reference || "").trim();
  const telephone = String(req.body.telephone || "").trim();
  if (!["essentiel", "premium"].includes(req.body.formule)) return res.status(400).json({ erreur: "Choisissez une formule" });
  if (telephone.replace(/\D/g, "").length < 8) return res.status(400).json({ erreur: "Indiquez le numéro qui a envoyé le paiement" });
  if (reference.length < 4) return res.status(400).json({ erreur: "Indiquez l'ID de transaction reçu par SMS" });
  if (abo.paiementsDe(id).some((p) => p.statut === "valide" && p.reference === reference)) return res.status(409).json({ erreur: "Ce paiement a déjà été enregistré" });
  const p = abo.declarerPaiement(id, { formule: req.body.formule, operateur: req.body.operateur, telephone, reference, auteur: req.user.nom });
  res.status(201).json({ paiement: p, abonnement: abo.etat(id) });
});

module.exports = router;
module.exports.instructions = instructions;
