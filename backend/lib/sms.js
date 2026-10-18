/**
 * Envoi de SMS (alertes de vente, campagnes, agents).
 *
 * Réglage par le propriétaire de la plateforme (portail propriétaire ou MANU dev), sinon par variables d'environnement.
 * Fournisseurs pris en charge :
 *   - orange        : Orange SMS API (developer.orange.com) — identifiant client + secret, numéro expéditeur
 *   - africastalking: Africa's Talking — nom d'utilisateur + clé API, expéditeur facultatif
 *   - generique     : POST JSON { to, from, text } avec « Authorization: Bearer <clé> » vers l'adresse indiquée
 * Sans réglage, le SMS est simulé (journalisé), pour que tout reste utilisable sans compte.
 */
const db = require("../db");

const BASE_ORANGE = (process.env.ORANGE_SMS_URL || "https://api.orange.com").replace(/\/$/, "");
const BASE_AT = (process.env.AFRICASTALKING_URL || "https://api.africastalking.com").replace(/\/$/, "");

function config() {
  const r = (k) => db.reglages.lire(k) || "";
  if (r("sms_fournisseur")) return { fournisseur: r("sms_fournisseur"), url: r("sms_url"), identifiant: r("sms_identifiant"), cle: r("sms_cle"), expediteur: r("sms_expediteur") || "GOUABO" };
  if (process.env.SMS_PROVIDER_URL && process.env.SMS_PROVIDER_API_KEY) return { fournisseur: "generique", url: process.env.SMS_PROVIDER_URL, cle: process.env.SMS_PROVIDER_API_KEY, expediteur: process.env.SMS_SENDER_ID || "GOUABO" };
  return null;
}
const estConfigure = () => { const c = config(); return Boolean(c && c.cle && (c.fournisseur !== "generique" || c.url) && (c.fournisseur === "generique" || c.identifiant)); };
const international = (tel) => { const d = String(tel || "").replace(/\D/g, ""); return d.length === 10 ? "+225" + d : d.startsWith("00") ? "+" + d.slice(2) : "+" + d; };

let jetonOrange = { valeur: "", fin: 0, id: "" };
async function envoyerOrange(c, a, message) {
  if (!jetonOrange.valeur || jetonOrange.fin < Date.now() + 60000 || jetonOrange.id !== c.identifiant) {
    const r = await fetch(`${BASE_ORANGE}/oauth/v3/token`, { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${c.identifiant}:${c.cle}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: "grant_type=client_credentials", signal: AbortSignal.timeout(15000) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.access_token) throw new Error("Orange SMS : identifiants refusés");
    jetonOrange = { valeur: j.access_token, fin: Date.now() + (Number(j.expires_in) || 3600) * 1000, id: c.identifiant };
  }
  const expediteur = international(c.expediteur);
  const r = await fetch(`${BASE_ORANGE}/smsmessaging/v1/outbound/${encodeURIComponent("tel:" + expediteur)}/requests`, {
    method: "POST", headers: { Authorization: "Bearer " + jetonOrange.valeur, "Content-Type": "application/json" }, signal: AbortSignal.timeout(15000),
    body: JSON.stringify({ outboundSMSMessageRequest: { address: "tel:" + a, senderAddress: "tel:" + expediteur, outboundSMSTextMessage: { message } } }),
  });
  if (!r.ok) throw new Error(`Orange SMS : échec de l'envoi (statut ${r.status})`);
  return r.json().catch(() => ({}));
}
async function envoyerAfricasTalking(c, a, message) {
  const corps = new URLSearchParams({ username: c.identifiant, to: a, message });
  if (c.expediteur && c.identifiant !== "sandbox") corps.set("from", c.expediteur);
  const base = c.identifiant === "sandbox" ? BASE_AT.replace("api.", "api.sandbox.") : BASE_AT;
  const r = await fetch(`${base}/version1/messaging`, { method: "POST", headers: { apiKey: c.cle, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" }, body: corps, signal: AbortSignal.timeout(15000) });
  const j = await r.json().catch(() => ({}));
  const statut = j.SMSMessageData?.Recipients?.[0]?.status;
  if (!r.ok || (statut && statut !== "Success")) throw new Error(`Africa's Talking : ${statut || "échec de l'envoi (statut " + r.status + ")"}`);
  return j;
}

async function envoyerSms(telephone, message) {
  const c = config();
  if (!estConfigure()) { console.log(`[SMS SIMULÉ] Vers ${telephone} : ${message}`); return { simule: true }; }
  const a = international(telephone), texte = String(message).slice(0, 640);
  if (c.fournisseur === "orange") return envoyerOrange(c, a, texte);
  if (c.fournisseur === "africastalking") return envoyerAfricasTalking(c, a, texte);
  const r = await fetch(c.url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${c.cle}` }, body: JSON.stringify({ to: a, from: c.expediteur, text: texte }), signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`Échec de l'envoi du SMS (statut ${r.status})`);
  return r.json().catch(() => ({}));
}

/** Réglage par le propriétaire. Un secret laissé vide garde l'ancien ; fournisseur vide = SMS désactivés. */
function regler(c) {
  const t = (v, max) => String(v ?? "").trim().slice(0, max);
  const fournisseur = ["orange", "africastalking", "generique", ""].includes(c.fournisseur) ? c.fournisseur : null;
  if (fournisseur === null) return { erreur: "Fournisseur SMS inconnu." };
  if (fournisseur === "generique" && !/^https:\/\/\S+$/.test(t(c.url, 300))) return { erreur: "Adresse du fournisseur invalide (https://…)." };
  if (fournisseur === "orange" && String(c.expediteur || "").replace(/\D/g, "").length < 8) return { erreur: "Orange SMS : indiquez le numéro expéditeur de votre contrat (ex : 2250700000000)." };
  db.reglages.ecrire("sms_fournisseur", fournisseur);
  db.reglages.ecrire("sms_url", fournisseur === "generique" ? t(c.url, 300) : "");
  db.reglages.ecrire("sms_identifiant", t(c.identifiant, 120));
  db.reglages.ecrire("sms_expediteur", t(c.expediteur, 20));
  if (c.cle) db.reglages.ecrire("sms_cle", t(c.cle, 300));
  if (!fournisseur) db.reglages.ecrire("sms_cle", "");
  jetonOrange = { valeur: "", fin: 0, id: "" };
  return { ok: true };
}
function etat() { const c = config(); return { configure: estConfigure(), fournisseur: c?.fournisseur || null, identifiant: c?.identifiant || null, expediteur: c?.expediteur || null, source: db.reglages.lire("sms_fournisseur") ? "portail" : c ? "serveur" : null }; }

module.exports = { envoyerSms, estConfigure, regler, etat, international };
