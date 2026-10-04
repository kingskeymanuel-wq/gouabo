/**
 * Rédaction par IA (Claude, SDK officiel Anthropic).
 * Clé : variable ANTHROPIC_API_KEY, sinon celle enregistrée dans le portail
 * propriétaire. Sans clé, les agents fonctionnent avec des modèles de messages
 * fixes (aucun appel n'est fait) : `rediger()` renvoie alors null.
 */
const db = require("../db");
const { Anthropic, RateLimitError, AuthenticationError, APIConnectionError, APIError } = require("@anthropic-ai/sdk");

const MODELE = "claude-opus-5-5";
const CLE_REGLAGE = "ia_cle";
const cle = () => process.env.ANTHROPIC_API_KEY || db.reglages.lire(CLE_REGLAGE) || "";
const estConfiguree = () => Boolean(cle());
/** État pour le portail propriétaire : la clé elle-même n'est jamais renvoyée. */
function etat() {
  const k = cle();
  return { configuree: Boolean(k), source: process.env.ANTHROPIC_API_KEY ? "serveur" : k ? "portail" : null, fin: k ? k.slice(-4) : null, derniere_erreur: derniereErreur };
}
function enregistrerCle(valeur) { db.reglages.ecrire(CLE_REGLAGE, String(valeur || "").trim().slice(0, 300)); client = null; derniereErreur = null; }
let client = null, cleClient = "", derniereErreur = null;

/**
 * Demande un texte court à Claude. Renvoie le texte, ou null si l'IA n'est pas
 * configurée. Lève une erreur lisible si l'appel échoue (l'appelant retombe
 * alors sur un modèle de message fixe).
 */
async function rediger({ systeme, demande, maxTokens = 4000 }) {
  if (!estConfiguree()) return null;
  const k = cle();
  if (!client || cleClient !== k) { client = new Anthropic({ apiKey: k }); cleClient = k; }
  try {
    const reponse = await client.beta.messages.create({
      model: MODELE,
      max_tokens: maxTokens,
      // Textes courts et simples : effort faible. (Sur ce modèle, le défaut est « medium ».)
      output_config: { effort: "low" },
      // Si le modèle décline une demande, l'API la rejoue sur un modèle de repli
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: systeme,
      messages: [{ role: "user", content: demande }],
    });
    if (reponse.stop_reason === "refusal") throw new Error("L'IA a décliné cette demande");
    const texte = reponse.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    if (!texte) throw new Error("Réponse vide de l'IA");
    derniereErreur = null;
    return texte;
  } catch (e) {
    // Visible uniquement dans le portail propriétaire
    derniereErreur = { message: e instanceof AuthenticationError ? "Clé refusée par Anthropic" : e instanceof RateLimitError ? "Limite d'appels ou crédit épuisé" : e.message, le: new Date().toISOString() };
    if (e instanceof AuthenticationError) throw new Error("Clé ANTHROPIC_API_KEY refusée");
    if (e instanceof RateLimitError) throw new Error("Limite d'appels à l'IA atteinte, réessayez plus tard");
    if (e instanceof APIConnectionError) throw new Error("Connexion à l'IA impossible");
    if (e instanceof APIError) throw new Error(`Erreur de l'IA (${e.status})`);
    throw e;
  }
}

module.exports = { rediger, estConfiguree, etat, enregistrerCle, MODELE };
