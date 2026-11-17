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

test("un vendeur ne voit que les contacts qu'il a importés", async () => {
  await appel("POST", "/importer", { contacts: [{ nom: "Client du vendeur", telephone: "0101010101" }] }, "vendeur");
  const v = await appel("GET", "/prospection", null, "vendeur");
  assert.equal(v.data.repertoire, 1);
  assert.equal(v.data.du_jour[0].nom, "Client du vendeur");
  const a = await appel("GET", "/prospection");
  assert.equal(a.data.repertoire, 3, "l'administrateur voit tout le répertoire");
});
