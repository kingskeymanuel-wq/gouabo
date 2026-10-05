/**
 * Agent Réseaux sociaux (formule Premium).
 *
 * Chaque jour, à l'heure choisie par l'administrateur, l'agent choisit un produit de la
 * boutique, rédige le texte de la publicité (avec l'IA si elle est branchée, sinon un modèle)
 * et prépare la publication. Elle est :
 *   - publiée automatiquement sur la page Facebook si la boutique a connecté sa page
 *     (identifiant de page + jeton d'accès de page, API officielle de Meta) ;
 *   - sinon présentée « prête à publier » : texte à copier, affiche à télécharger, lien vers la page.
 *
 * L'agent ne contacte jamais des inconnus sur Facebook ou Instagram : la prospection par
 * messages automatiques est interdite par Meta et ferait bloquer le compte de la boutique.
 */
const { nanoid } = require("nanoid");
const db = require("../db");
const ia = require("./ia");
const { lireBoutique } = require("../routes/parametres");
const { prixEffectif, promoActive, remisePourcent } = require("./prix");

const DEFAUTS = { actif: "0", heure: "9", facebook: "", instagram: "", fb_page_id: "" };
const CLE_JETON = "social_fb_token"; // secret : jamais renvoyé à l'interface

const lire = (cle) => db.prepare("SELECT valeur FROM parametres WHERE cle = ?").get(cle)?.valeur ?? null;
const ecrire = (cle, valeur) => db.prepare("INSERT INTO parametres (cle, valeur) VALUES (?, ?) ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur").run(cle, String(valeur));

function lireReglages() {
  const r = {};
  for (const k of Object.keys(DEFAUTS)) r[k] = lire("social_" + k) ?? DEFAUTS[k];
  r.fb_connecte = Boolean(r.fb_page_id && lire(CLE_JETON));
  return r;
}

/** Lien d'une page : adresse https du bon réseau uniquement. Renvoie "" si vide, null si invalide. */
function lienValide(valeur, domaines) {
  const v = String(valeur || "").trim();
  if (!v) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : "https://" + v);
    const hote = u.hostname.replace(/^(www|m|web)\./, "");
    return u.protocol === "https:" && domaines.includes(hote) ? u.href.slice(0, 300) : null;
  } catch { return null; }
}

function ecrireReglages(v) {
  if (v.facebook !== undefined) {
    const l = lienValide(v.facebook, ["facebook.com", "fb.com", "fb.me"]);
    if (l === null) return { erreur: "Lien Facebook invalide : collez l'adresse de votre page (facebook.com/…)" };
    ecrire("social_facebook", l);
  }
  if (v.instagram !== undefined) {
    const l = lienValide(v.instagram, ["instagram.com", "instagr.am"]);
    if (l === null) return { erreur: "Lien Instagram invalide : collez l'adresse de votre compte (instagram.com/…)" };
    ecrire("social_instagram", l);
  }
  if (v.actif !== undefined) ecrire("social_actif", v.actif && v.actif !== "0" ? "1" : "0");
  if (v.heure !== undefined) ecrire("social_heure", String(Math.min(23, Math.max(0, Math.round(Number(v.heure) || 0)))));
  if (v.fb_page_id !== undefined) {
    const id = String(v.fb_page_id || "").trim();
    if (id && !/^\d{5,25}$/.test(id)) return { erreur: "L'identifiant de page Facebook est un nombre (visible dans les paramètres de la page)" };
    ecrire("social_fb_page_id", id);
  }
  if (v.fb_token) ecrire(CLE_JETON, String(v.fb_token).trim().slice(0, 600));
  if (v.fb_deconnecter) { ecrire(CLE_JETON, ""); ecrire("social_fb_page_id", ""); }
  return { reglages: lireReglages() };
}

/** Adresse publique du site (liens et images des publications). */
const baseSite = () => String(process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || "").replace(/\/$/, "");
const lienBoutique = () => (baseSite() ? `${baseSite()}/#/boutique/${db.espaceCourant().slug}` : "");
const imagePublique = (image) => (!image ? "" : /^https:\/\//.test(image) ? image : image.startsWith("/") && baseSite() ? baseSite() + image : "");

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const fcfa = (n) => nf.format(Math.round(n || 0)).replace(/[  ]/g, " ") + " FCFA";
const motCle = (s) => "#" + String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, " ").trim().split(" ").map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join("").slice(0, 28);

/** Produit du jour : une promotion en cours d'abord, puis celui dont on a parlé il y a le plus longtemps. */
function choisirProduit() {
  const packs = db.prepare("SELECT * FROM packs WHERE supprime = 0 AND actif = 1 AND stock > 0 AND image IS NOT NULL AND image <> ''").all();
  if (!packs.length) return null;
  const derniere = new Map(db.prepare("SELECT pack_id, MAX(cree_le) AS d FROM agents_publications GROUP BY pack_id").all().map((r) => [r.pack_id, r.d]));
  return packs.sort((a, b) => (derniere.get(a.id) || "").localeCompare(derniere.get(b.id) || "") || Number(promoActive(b)) - Number(promoActive(a)) || b.stock - a.stock)[0];
}

/** Texte de la publicité. Renvoie { texte, ia }. */
async function redigerLegende(pack) {
  const b = lireBoutique();
  const prix = fcfa(prixEffectif(pack));
  const promo = promoActive(pack) ? ` Promotion : -${remisePourcent(pack)} % (au lieu de ${fcfa(pack.prix)}).` : "";
  const lien = lienBoutique();
  const mots = [motCle(b.nom), pack.categorie && motCle(pack.categorie), "#Abidjan", "#CoteDIvoire", "#LivraisonADomicile"].filter((m) => m && m.length > 1).join(" ");
  const secours = `${pack.nom} — ${prix}.${promo}\n${pack.description ? pack.description.trim() + "\n" : ""}Livraison ${b.zone_livraison || "à domicile"}, paiement à la livraison ou par Mobile Money.\n${lien ? "Commandez ici : " + lien + "\n" : ""}${mots}`;
  if (!ia.estConfiguree()) return { texte: secours, ia: false };
  try {
    const t = await ia.rediger({
      systeme: "Tu rédiges les publications Facebook et Instagram d'une boutique en Côte d'Ivoire. Ton chaleureux, direct et vendeur, en français simple. Tu n'inventes ni prix, ni remise, ni caractéristique : tu n'utilises que les informations fournies. Tu réponds uniquement par le texte de la publication.",
      demande: `Boutique : ${b.nom}${b.slogan ? " — " + b.slogan : ""}\nProduit : ${pack.nom}\nPrix : ${prix}.${promo}\nDescription : ${pack.description || "(aucune)"}\nLivraison : ${b.zone_livraison || "à domicile"} ; paiement à la livraison ou par Mobile Money.\n${lien ? "Lien pour commander : " + lien : ""}\n\nÉcris une publication de 3 à 5 lignes courtes : une accroche, le produit et son prix, puis un appel à commander${lien ? " avec le lien" : ""}. Termine par ces mots-clés, sur une ligne : ${mots}. Au plus deux émojis.`,
      maxTokens: 1500,
    });
    return { texte: t.trim(), ia: true };
  } catch (e) {
    console.error("Agent réseaux sociaux : rédaction par IA impossible —", e.message);
    return { texte: secours, ia: false };
  }
}

/** Publication d'une photo sur la page Facebook connectée (API Graph de Meta). */
async function publierFacebook(pub, pack) {
  const r = lireReglages(), jeton = lire(CLE_JETON);
  if (!r.fb_page_id || !jeton) return { statut: "non_connecte" };
  const image = imagePublique(pack.image);
  const corps = new URLSearchParams(image ? { url: image, caption: pub.texte, access_token: jeton } : { message: pub.texte, access_token: jeton });
  try {
    const rep = await fetch(`https://graph.facebook.com/v21.0/${r.fb_page_id}/${image ? "photos" : "feed"}`, { method: "POST", body: corps, signal: AbortSignal.timeout(20000) });
    const j = await rep.json().catch(() => ({}));
    if (!rep.ok || j.error) return { statut: "echec", detail: String(j.error?.message || "Erreur " + rep.status).slice(0, 200) };
    return { statut: "publie", detail: String(j.post_id || j.id || "") };
  } catch (e) {
    return { statut: "echec", detail: "Facebook injoignable" };
  }
}

const jourCourant = () => new Date().toISOString().slice(0, 10);
const publications = () => db.prepare(
  `SELECT p.*, k.nom AS produit, k.image, k.prix, k.prix_promo, k.promo_fin FROM agents_publications p LEFT JOIN packs k ON k.id = p.pack_id ORDER BY p.cree_le DESC LIMIT 14`
).all().map((p) => ({ ...p, prix_affiche: p.prix != null ? prixEffectif(p) : null }));

/** Prépare la publication du jour (et la publie sur Facebook si la page est connectée). */
async function preparer({ journal } = {}) {
  const pack = choisirProduit();
  if (!pack) throw new Error("Aucun produit en stock avec une photo : ajoutez une photo à vos produits");
  const { texte, ia: parIa } = await redigerLegende(pack);
  const id = nanoid();
  db.prepare("INSERT INTO agents_publications (id, pack_id, jour, texte, statut, cree_le) VALUES (?, ?, ?, ?, 'pret', ?)").run(id, pack.id, jourCourant(), texte, new Date().toISOString());
  const pub = db.prepare("SELECT * FROM agents_publications WHERE id = ?").get(id);
  const fb = await publierFacebook(pub, pack);
  if (fb.statut !== "non_connecte") db.prepare("UPDATE agents_publications SET statut = ?, detail = ? WHERE id = ?").run(fb.statut === "publie" ? "publie" : "pret", fb.statut === "publie" ? "Publiée sur Facebook" : "Facebook : " + fb.detail, id);
  journal?.("social", fb.statut === "publie" ? `Publicité publiée sur Facebook : ${pack.nom}` : `Publicité du jour prête : ${pack.nom}`, fb.statut === "echec" ? "Publication automatique impossible (" + fb.detail + ") : publiez-la à la main." : parIa ? "Texte rédigé par l'IA" : null, fb.statut === "echec" ? "alerte" : "ok");
  return db.prepare("SELECT * FROM agents_publications WHERE id = ?").get(id);
}

/** À appeler régulièrement dans chaque espace Premium : une publication par jour, à l'heure choisie. */
function estDue(maintenant = new Date()) {
  const r = lireReglages();
  if (r.actif !== "1" || maintenant.getUTCHours() < Number(r.heure)) return false; // heure d'Abidjan = UTC
  return !db.prepare("SELECT 1 FROM agents_publications WHERE jour = ?").get(jourCourant());
}

module.exports = { lireReglages, ecrireReglages, publications, preparer, estDue, choisirProduit, redigerLegende, lienBoutique };
