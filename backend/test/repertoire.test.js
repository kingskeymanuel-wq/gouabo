/* Répertoire du propriétaire et agent Prospection (routes/clients.js : /importer, /prospection, /:id/invite).
   Lancer : npm test — base vide dans un dossier temporaire. */
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");

const DOSSIER = fs.mkdtempSync(path.join(os.tmpdir(), "gouabo-repertoire-"));
process.env.DB_PATH = path.join(DOSSIER, "test.db");
process.env.DONNEES_TEST = "0";
process.env.PUBLIC_URL = "https://boutique.test";

const db = require("../db");
let serveur, base, boutique;
const UTILISATEURS = { admin: { id: "admin-1", role: "admin" }, vendeur: { id: "vendeur-1", role: "vendeur" } };

before(async () => {
  boutique = db.creerBoutique("Boutique Répertoire");
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => { req.user = UTILISATEURS[req.get("x-qui") || "admin"]; db.dansEspace(boutique.id, next); });
  app.use("/api/clients", require("../routes/clients"));
  await new Promise((ok) => { serveur = app.listen(0, ok); });
  base = `http://127.0.0.1:${serveur.address().port}/api/clients`;
});
after(() => { serveur?.close(); try { fs.rmSync(DOSSIER, { recursive: true, force: true }); } catch { /* Windows */ } });

const appel = async (methode, chemin, corps, qui = "admin") => {
  const r = await fetch(base + chemin, { method: methode, headers: { "Content-Type": "application/json", "x-qui": qui }, body: corps ? JSON.stringify(corps) : undefined });
  return { status: r.status, data: await r.json().catch(() => null) };
};

test("rythme : réglé par le propriétaire, refusé s'il est incohérent", async () => {
  assert.equal((await appel("PUT", "/repertoire/rythme", { jours: [], debut: 9, fin: 18, par_jour: 10 })).status, 400);
  assert.equal((await appel("PUT", "/repertoire/rythme", { jours: [1], debut: 18, fin: 9, par_jour: 10 })).status, 400);
  // Pour les tests suivants : tous les jours, toute la journée
  const r = await appel("PUT", "/repertoire/rythme", { jours: [1, 2, 3, 4, 5, 6, 7], debut: 0, fin: 24, par_jour: 10 });
  assert.equal(r.status, 200);
  assert.equal(r.data.fenetre.ouverte, true);
});

test("import : doublons et numéros invalides écartés", async () => {
  const r = await appel("POST", "/importer", { contacts: [
    { nom: "Awa Koné", telephone: "+225 07 11 22 33 44" },
    { nom: "Awa bis", telephone: "0711223344" },
    { nom: "Sans numéro", telephone: "12" },
    { nom: "", telephone: "0505060708" },
  ] });
  assert.equal(r.status, 200);
  assert.deepEqual(r.data, { ajoutes: 2, deja: 1, invalides: 1 });
});

test("prospection : invitations du jour avec le lien de la boutique, sans prénom quand il n'y a qu'un numéro", async () => {
  const r = await appel("GET", "/prospection?par_jour=5");
  assert.equal(r.data.repertoire, 2);
  assert.equal(r.data.du_jour.length, 2);
  const awa = r.data.du_jour.find((c) => c.nom === "Awa Koné");
  assert.match(awa.message, /^Bonjour Awa 👋 C'est .+\. Notre boutique est en ligne/);
  assert.ok(awa.message.includes(`https://boutique.test/#/boutique/${boutique.slug}`));
  const numero = r.data.du_jour.find((c) => c.nom === "0505060708");
  assert.match(numero.message, /^Bonjour 👋/);
});

test("une invitation envoyée sort de la file ; le quota du jour est respecté", async () => {
  const avant = await appel("GET", "/prospection?par_jour=1");
  assert.equal(avant.data.du_jour.length, 1);
  assert.equal((await appel("POST", `/${avant.data.du_jour[0].id}/invite`)).status, 200);
  const apres = await appel("GET", "/prospection?par_jour=1");
  assert.equal(apres.data.invites_aujourdhui, 1);
  assert.equal(apres.data.du_jour.length, 0, "quota de 1 par jour atteint");
  assert.equal(apres.data.invites, 1);
  assert.equal(apres.data.restants, 1);
});

test("en dehors des jours choisis, l'agent ne prépare aucune invitation et dit quand il reprend", async () => {
  // Un seul jour autorisé : demain, à l'heure d'Abidjan (1 = lundi … 7 = dimanche)
  const aujourdhuiAbidjan = new Date(new Date().toLocaleDateString("fr-CA", { timeZone: "Africa/Abidjan" }) + "T12:00:00Z").getUTCDay();
  const demain = (aujourdhuiAbidjan % 7) + 1;
  try {
    await appel("PUT", "/repertoire/rythme", { jours: [demain], debut: 9, fin: 18, par_jour: 10 });
    const r = await appel("GET", "/prospection");
    assert.equal(r.data.fenetre.ouverte, false);
    assert.equal(r.data.du_jour.length, 0);
    assert.match(r.data.fenetre.reprise, /demain à 9 h/);
  } finally {
    await appel("PUT", "/repertoire/rythme", { jours: [1, 2, 3, 4, 5, 6, 7], debut: 0, fin: 24, par_jour: 10 });
  }
});

test("répertoire Google : facultatif (case d'accord obligatoire), et indisponible tant que Google n'est pas réglé", async () => {
  const etat = await appel("GET", "/repertoire");
  assert.equal(etat.data.google, false);
  assert.equal((await appel("POST", "/repertoire/google", { email: "a@gmail.com" })).status, 400, "sans accord");
  const sansReglage = await appel("POST", "/repertoire/google", { email: "a@gmail.com", accord: true });
  assert.equal(sansReglage.status, 400);
  assert.match(sansReglage.data.erreur, /pas encore disponible/);
  // Avec un réglage Google : l'adresse de la page d'autorisation est donnée, l'accord est enregistré
  process.env.GOOGLE_CLIENT_ID = "id-essai"; process.env.GOOGLE_CLIENT_SECRET = "secret-essai";
  try {
    const ok = await appel("POST", "/repertoire/google", { email: "awa@gmail.com", accord: true });
    assert.equal(ok.status, 200);
    assert.match(ok.data.url, /^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth\?/);
    assert.match(ok.data.url, /contacts\.readonly/);
    assert.match(ok.data.url, /login_hint=awa%40gmail\.com/);
    assert.equal((await appel("GET", "/repertoire")).data.accord.email, "awa@gmail.com");
    assert.equal((await appel("DELETE", "/repertoire/accord")).status, 200);
    assert.equal((await appel("GET", "/repertoire")).data.accord, null);
  } finally { delete process.env.GOOGLE_CLIENT_ID; delete process.env.GOOGLE_CLIENT_SECRET; }
});

test("un vendeur ne voit que les contacts qu'il a importés", async () => {
  await appel("POST", "/importer", { contacts: [{ nom: "Client du vendeur", telephone: "0101010101" }] }, "vendeur");
  const v = await appel("GET", "/prospection", null, "vendeur");
  assert.equal(v.data.repertoire, 1);
  assert.equal(v.data.du_jour[0].nom, "Client du vendeur");
  const a = await appel("GET", "/prospection");
  assert.equal(a.data.repertoire, 3, "l'administrateur voit tout le répertoire");
});
