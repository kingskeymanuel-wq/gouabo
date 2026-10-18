/**
 * Envoi d'e-mails (tickets de caisse, campagnes) par SMTP via Nodemailer.
 * Compatible avec tout fournisseur : Gmail (mot de passe d'application),
 * Brevo, Outlook, la messagerie de votre nom de domaine…
 *
 * Réglage par le propriétaire de la plateforme (portail propriétaire ou MANU dev), sinon variables (.env) :
 * SMTP_HOST, SMTP_PORT (587 par défaut), SMTP_USER, SMTP_PASS, SMTP_FROM (ex. « Ma Boutique <contact@maboutique.ci> »).
 * Sans configuration, l'envoi est simulé (journalisé dans la console).
 */
const nodemailer = require("nodemailer");
const db = require("../db");

/** Serveur d'envoi : celui réglé dans le portail, sinon celui des variables d'environnement. */
function config() {
  const r = (k) => db.reglages.lire(k) || "";
  if (r("smtp_hote") && r("smtp_utilisateur") && r("smtp_mdp")) return { hote: r("smtp_hote"), port: Number(r("smtp_port")) || 465, utilisateur: r("smtp_utilisateur"), mdp: r("smtp_mdp"), expediteur: r("smtp_expediteur") || r("smtp_utilisateur") };
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return { hote: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, utilisateur: process.env.SMTP_USER, mdp: process.env.SMTP_PASS, expediteur: process.env.SMTP_FROM || process.env.SMTP_USER };
  return null;
}
const estConfigure = () => Boolean(config());

let transport = null, signature = "";
function obtenirTransport() {
  const c = config(), s = `${c.hote}|${c.port}|${c.utilisateur}|${c.mdp}`;
  if (!transport || signature !== s) {
    transport = nodemailer.createTransport({ host: c.hote, port: c.port, secure: c.port === 465, auth: { user: c.utilisateur, pass: c.mdp }, connectionTimeout: 15000, socketTimeout: 20000 });
    signature = s;
  }
  return transport;
}
/** Réglage par le propriétaire. Mot de passe vide = garder l'ancien ; serveur vide = e-mails désactivés. */
function regler(c) {
  const t = (v, max) => String(v ?? "").trim().slice(0, max);
  const hote = t(c.hote, 120).toLowerCase(), port = Number(c.port) || 465, utilisateur = t(c.utilisateur, 160);
  if (hote && !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(hote)) return { erreur: "Serveur d'envoi invalide (ex : smtp.gmail.com)." };
  if (![25, 465, 587, 2525].includes(port)) return { erreur: "Port invalide (465 ou 587 en général)." };
  if (hote && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(utilisateur)) return { erreur: "L'identifiant est une adresse e-mail." };
  db.reglages.ecrire("smtp_hote", hote); db.reglages.ecrire("smtp_port", String(port)); db.reglages.ecrire("smtp_utilisateur", utilisateur); db.reglages.ecrire("smtp_expediteur", t(c.expediteur, 160));
  if (c.mot_de_passe) db.reglages.ecrire("smtp_mdp", t(c.mot_de_passe, 200));
  if (!hote) db.reglages.ecrire("smtp_mdp", "");
  transport = null;
  return { ok: true };
}
const etat = () => { const c = config(); return { configure: Boolean(c), hote: c?.hote || null, utilisateur: c?.utilisateur || null, source: db.reglages.lire("smtp_hote") ? "portail" : c ? "serveur" : null }; };

/** Envoie un e-mail. Renvoie { simule: true } si aucun serveur SMTP n'est configuré. */
async function envoyerEmail({ a, sujet, texte, html }) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(a || ""))) throw new Error("Adresse e-mail invalide");
  if (!estConfigure()) {
    console.log(`[E-MAIL SIMULÉ] À ${a} — ${sujet}`);
    return { simule: true };
  }
  const info = await obtenirTransport().sendMail({
    from: config().expediteur,
    to: a,
    subject: sujet,
    text: texte,
    html,
  });
  return { id: info.messageId };
}

const echapper = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = { estConfigure, envoyerEmail, echapper, regler, etat };
