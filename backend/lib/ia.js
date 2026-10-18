/**
 * Rédaction par IA, au choix du propriétaire :
 *   - local     : IA installée sur le serveur (Ollama) — gratuite, privée, sans compte ; plus lente (processeur)
 *   - groq      : Groq (modèles ouverts, quota gratuit) — clé à créer sur console.groq.com
 *   - gemini    : Google Gemini (quota gratuit) — clé à créer sur aistudio.google.com
 *   - anthropic : Claude (SDK officiel Anthropic) — payant à l'usage, la meilleure qualité
 * Sans fournisseur réglé, les agents utilisent leurs modèles de messages : `rediger()` renvoie alors null.
 * Les clés restent sur le serveur et ne sont jamais renvoyées.
 */
const db = require("../db");
const reglages = db.reglages; // réglages de la plateforme (portail propriétaire / MANU dev)
const { Anthropic, RateLimitError, AuthenticationError, APIConnectionError, APIError } = require("@anthropic-ai/sdk");

const MODELE = "claude-opus-5-5";
const FOURNISSEURS = {
  local: { nom: "IA locale (gratuite, sur votre serveur)", modele: "qwen2.5:3b", gratuit: true },
  groq: { nom: "Groq (gratuit avec quota)", modele: "llama-3.3-70b-versatile", gratuit: true, url: "https://api.groq.com/openai/v1/chat/completions" },
  gemini: { nom: "Google Gemini (gratuit avec quota)", modele: "gemini-2.5-flash", gratuit: true, url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" },
  anthropic: { nom: "Claude (payant, meilleure qualité)", modele: MODELE, gratuit: false },
};
const lire = (k) => reglages.lire(k) || "";
function fournisseur() {
  const f = lire("ia_fournisseur");
  if (FOURNISSEURS[f]) return f;
  return process.env.ANTHROPIC_API_KEY || lire("ia_cle") ? "anthropic" : ""; // anciennes installations
}
const cleAnthropic = () => process.env.ANTHROPIC_API_KEY || lire("ia_cle");
const modele = () => lire("ia_modele") || FOURNISSEURS[fournisseur()]?.modele || MODELE;
const urlLocale = () => (lire("ia_url") || process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");
function estConfiguree() {
  const f = fournisseur();
  if (f === "anthropic") return Boolean(cleAnthropic());
  if (f === "groq" || f === "gemini") return Boolean(lire("ia_cle_libre"));
  return f === "local";
}
let client = null, cleClient = "", derniereErreur = null;

/** État affiché au propriétaire : les clés elles-mêmes ne sont jamais renvoyées. */
function etat() {
  const f = fournisseur(), k = f === "anthropic" ? cleAnthropic() : f ? lire("ia_cle_libre") : "";
  return { configuree: estConfiguree(), fournisseur: f || null, nom: FOURNISSEURS[f]?.nom || null, gratuit: Boolean(FOURNISSEURS[f]?.gratuit), modele: f ? modele() : null,
    fin: k ? k.slice(-4) : null, source: process.env.ANTHROPIC_API_KEY && f === "anthropic" ? "serveur" : f ? "application" : null, derniere_erreur: derniereErreur,
    fournisseurs: Object.fromEntries(Object.entries(FOURNISSEURS).map(([c, v]) => [c, { nom: v.nom, gratuit: v.gratuit, modele: v.modele }])) };
}
/** Ancien réglage : une clé Anthropic seule. */
function enregistrerCle(valeur) { reglages.ecrire("ia_cle", String(valeur || "").trim().slice(0, 300)); if (valeur) reglages.ecrire("ia_fournisseur", "anthropic"); client = null; derniereErreur = null; }
/** Réglage complet : { fournisseur, cle?, modele?, url? }. Clé vide = garder l'ancienne. */
function regler(c) {
  const f = String(c.fournisseur ?? "");
  if (f && !FOURNISSEURS[f]) return { erreur: "Fournisseur d'IA inconnu." };
  const cle = String(c.cle || "").trim();
  if (f === "anthropic" && cle && !/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(cle)) return { erreur: "Cette clé n'a pas le format d'une clé Anthropic (elle commence par sk-ant-)." };
  if ((f === "groq" || f === "gemini") && cle && !/^[A-Za-z0-9_.-]{20,300}$/.test(cle)) return { erreur: "Cette clé n'a pas un format valide." };
  if ((f === "groq" || f === "gemini") && !cle && !lire("ia_cle_libre")) return { erreur: "Collez la clé API du fournisseur." };
  const mod = String(c.modele || "").trim();
  if (mod && !/^[A-Za-z0-9._:\/-]{2,80}$/.test(mod)) return { erreur: "Nom de modèle invalide." };
  const url = String(c.url || "").trim();
  if (url && !/^https?:\/\/[A-Za-z0-9.-]+(:\d+)?\/?$/.test(url)) return { erreur: "Adresse de l'IA locale invalide (ex : http://127.0.0.1:11434)." };
  reglages.ecrire("ia_fournisseur", f);
  reglages.ecrire("ia_modele", mod);
  reglages.ecrire("ia_url", url);
  if (cle) reglages.ecrire(f === "anthropic" ? "ia_cle" : "ia_cle_libre", cle);
  client = null; derniereErreur = null;
  return { ok: true };
}

async function viaAnthropic({ systeme, demande, maxTokens }) {
  const k = cleAnthropic();
  if (!client || cleClient !== k) { client = new Anthropic({ apiKey: k }); cleClient = k; }
  try {
    const reponse = await client.beta.messages.create({
      model: modele(), max_tokens: maxTokens,
      output_config: { effort: "low" }, // textes courts et simples
      betas: ["server-side-fallback-2026-07-01"], fallbacks: "default",
      system: systeme, messages: [{ role: "user", content: demande }],
    });
    if (reponse.stop_reason === "refusal") throw new Error("L'IA a décliné cette demande");
    return reponse.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  } catch (e) {
    if (e instanceof AuthenticationError) throw new Error("Clé IA refusée par Anthropic");
    if (e instanceof RateLimitError) throw new Error("Limite d'appels à l'IA atteinte, réessayez plus tard");
    if (e instanceof APIConnectionError) throw new Error("Connexion à l'IA impossible");
    if (e instanceof APIError) throw new Error(`Erreur de l'IA (${e.status})`);
    throw e;
  }
}
async function viaLocale({ systeme, demande, maxTokens }) {
  let r;
  try {
    r = await fetch(`${urlLocale()}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(180000),
      body: JSON.stringify({ model: modele(), stream: false, messages: [{ role: "system", content: systeme }, { role: "user", content: demande }], options: { num_predict: Math.min(maxTokens, 800), temperature: 0.7 } }) });
  } catch { throw new Error("IA locale injoignable (est-elle installée et démarrée sur le serveur ?)"); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error ? "IA locale : " + j.error : `IA locale : erreur ${r.status}`);
  return String(j.message?.content || "").trim();
}
async function viaCompatible({ systeme, demande, maxTokens }) {
  const f = FOURNISSEURS[fournisseur()];
  const r = await fetch(f.url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + lire("ia_cle_libre") }, signal: AbortSignal.timeout(60000),
    body: JSON.stringify({ model: modele(), max_tokens: Math.min(maxTokens, 2000), temperature: 0.7, messages: [{ role: "system", content: systeme }, { role: "user", content: demande }] }) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 || r.status === 403) throw new Error("Clé IA refusée par " + (fournisseur() === "groq" ? "Groq" : "Google"));
  if (r.status === 429) throw new Error("Quota gratuit atteint pour le moment, réessayez plus tard");
  if (!r.ok) throw new Error(`Erreur de l'IA (${r.status}${j.error?.message ? " : " + String(j.error.message).slice(0, 120) : ""})`);
  return String(j.choices?.[0]?.message?.content || "").trim();
}

/** Demande un texte court. Renvoie le texte, ou null si aucune IA n'est réglée ; lève une erreur lisible sinon. */
async function rediger({ systeme, demande, maxTokens = 2000 }) {
  if (!estConfiguree()) return null;
  const f = fournisseur();
  try {
    const texte = f === "anthropic" ? await viaAnthropic({ systeme, demande, maxTokens }) : f === "local" ? await viaLocale({ systeme, demande, maxTokens }) : await viaCompatible({ systeme, demande, maxTokens });
    if (!texte) throw new Error("Réponse vide de l'IA");
    derniereErreur = null;
    return texte;
  } catch (e) {
    derniereErreur = { message: e.message, le: new Date().toISOString() };
    throw e;
  }
}


module.exports = { rediger, estConfiguree, etat, enregistrerCle, regler, MODELE, FOURNISSEURS };
