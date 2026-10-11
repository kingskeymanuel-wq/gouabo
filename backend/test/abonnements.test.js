/* Tests des abonnements et des paiements de packs (lib/abonnements.js).
   Lancer : npm test — une base vide est créée dans un dossier temporaire, la vraie n'est pas touchée. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const DOSSIER = fs.mkdtempSync(path.join(os.tmpdir(), "gouabo-test-"));
process.env.DB_PATH = path.join(DOSSIER, "test.db");
process.env.DONNEES_TEST = "0";

const db = require("../db");
const abo = require("../lib/abonnements");

const JOUR = 864e5;
const hier = () => new Date(Date.now() - JOUR).toISOString();
const joursJusqua = (iso) => Math.round((new Date(iso).getTime() - Date.now()) / JOUR);
let n = 0;
/** Nouvel espace en essai gratuit. */
function espace(formule) {
  const b = db.creerBoutique("Boutique test " + ++n);
  abo.creer(b.id, formule);
  return b.id;
}
const payerPar = (id, formule) => abo.declarerPaiement(id, { formule, operateur: "Wave", telephone: "0700000000", reference: "REF-" + ++n, auteur: "Test" });

after(() => { try { fs.rmSync(DOSSIER, { recursive: true, force: true }); } catch { /* fichiers encore ouverts (Windows) */ } });

test("tarifs par défaut : Essentiel 10 000 les 2 mois, Premium 15 000 les 3 mois, 1 mois d'essai", () => {
  const f = abo.formules();
  assert.deepEqual([f.essentiel.prix, f.essentiel.duree_jours, f.essentiel.essai_jours], [10000, 60, 30]);
  assert.deepEqual([f.premium.prix, f.premium.duree_jours, f.premium.agents], [15000, 90, true]);
});

test("un nouvel espace démarre en essai gratuit de 30 jours, agents en découverte, sans vendeurs ni studio", () => {
  const e = abo.etat(espace());
  assert.equal(e.statut, "essai");
  assert.equal(e.acces, true);
  assert.equal(e.paye, false);
  assert.equal(e.jours_restants, 30);
  assert.equal(e.agents, true);
  assert.equal(e.agents_decouverte, true);
  assert.equal(e.vendeurs, false);
  assert.equal(e.studio, false);
});

test("essai terminé sans paiement : l'espace est expiré et verrouillé", () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  const e = abo.etat(id);
  assert.equal(e.statut, "expire");
  assert.equal(e.acces, false);
  assert.equal(e.agents, false);
});

test("paiement pendant l'essai : l'essai continue, le pack démarrera à la fin de l'essai pour sa durée", () => {
  const id = espace();
  const p = payerPar(id, "essentiel");
  assert.equal(p.statut, "valide");
  assert.equal(p.montant, 10000);
  const e = abo.etat(id);
  assert.equal(e.statut, "essai");
  assert.equal(e.paye, true);
  assert.equal(e.pack_prevu, "essentiel");
  assert.equal(joursJusqua(e.echeance), 30 + 60);
});

test("à la fin de l'essai, le pack payé devient actif tout seul ; Essentiel n'a ni agents ni vendeurs", () => {
  const id = espace();
  payerPar(id, "essentiel");
  abo.modifier(id, { essai_fin: hier() });
  const e = abo.etat(id);
  assert.equal(e.statut, "actif");
  assert.equal(e.formule, "essentiel");
  assert.equal(e.acces, true);
  assert.equal(e.agents, false);
  assert.equal(e.vendeurs, false);
});

test("paiement Premium après expiration : accès immédiat pour 90 jours, avec agents, studio et vendeurs", () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  payerPar(id, "premium");
  const e = abo.etat(id);
  assert.equal(e.statut, "actif");
  assert.equal(e.formule, "premium");
  assert.equal(e.jours_restants, 90);
  assert.deepEqual([e.agents, e.studio, e.vendeurs], [true, true, true]);
});

test("un renouvellement prolonge l'abonnement à partir de son échéance", () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  payerPar(id, "premium");
  payerPar(id, "premium");
  assert.equal(abo.etat(id).jours_restants, 180);
});

test("abonnement arrivé à échéance : l'espace est verrouillé", () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  payerPar(id, "essentiel");
  abo.modifier(id, { echeance: hier() });
  const e = abo.etat(id);
  assert.equal(e.statut, "expire");
  assert.equal(e.acces, false);
});

test("paiement annulé pendant l'essai : le pack prévu est retiré, l'essai reste", () => {
  const id = espace();
  const p = payerPar(id, "premium");
  const annule = abo.annulerPaiement(p.id, "Non reçu");
  assert.equal(annule.statut, "refuse");
  const e = abo.etat(id);
  assert.equal(e.statut, "essai");
  assert.equal(e.paye, false);
  assert.equal(e.echeance, null);
});

test("paiement annulé sur un abonnement actif : la durée du pack est retirée, donc l'accès tombe", async () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  const p = payerPar(id, "essentiel");
  abo.annulerPaiement(p.id);
  await new Promise((r) => setTimeout(r, 5)); // l'échéance retombe à l'instant du paiement : on laisse passer cet instant
  assert.equal(abo.etat(id).acces, false);
});

test("un paiement déjà annulé ne peut pas être annulé deux fois", () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  const p1 = payerPar(id, "premium");
  payerPar(id, "premium"); // 180 jours
  abo.annulerPaiement(p1.id);
  abo.annulerPaiement(p1.id);
  assert.equal(abo.etat(id).jours_restants, 90);
});

test("paiement en ligne : rien n'est accordé avant la confirmation, puis le pack est pris en compte une seule fois", () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  const p = abo.ouvrirPaiementEnLigne(id, { formule: "premium", auteur: "Test", telephone: "0700000000", merchantId: "M-" + ++n });
  assert.equal(p.statut, "en_cours");
  assert.equal(abo.etat(id).acces, false);
  assert.equal(abo.conclurePaiementEnLigne(p.id, { reussi: true, transactionId: "TX-1", statut: "SUCCESS" }).statut, "valide");
  abo.conclurePaiementEnLigne(p.id, { reussi: true, transactionId: "TX-1", statut: "SUCCESS" }); // notification reçue deux fois
  const e = abo.etat(id);
  assert.equal(e.statut, "actif");
  assert.equal(e.jours_restants, 90);
});

test("paiement en ligne échoué : marqué échoué, aucun accès accordé", () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  const p = abo.ouvrirPaiementEnLigne(id, { formule: "essentiel", auteur: "Test", telephone: "0700000000", merchantId: "M-" + ++n });
  assert.equal(abo.conclurePaiementEnLigne(p.id, { reussi: false, statut: "FAILED" }).statut, "echoue");
  assert.equal(abo.etat(id).acces, false);
});

test("un espace suspendu par le propriétaire n'a plus accès, même payé", () => {
  const id = espace();
  abo.modifier(id, { essai_fin: hier() });
  payerPar(id, "premium");
  abo.modifier(id, { statut: "suspendu" });
  const e = abo.etat(id);
  assert.equal(e.statut, "suspendu");
  assert.equal(e.acces, false);
});
