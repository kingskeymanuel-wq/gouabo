/* Rapatrie sur le site les polices (Google Fonts) et les photos d'illustration (Unsplash) des interfaces,
   pour ne plus dépendre de sites extérieurs à l'affichage. À relancer seulement si l'on change de police
   ou de photo : node outils/rapatrier-polices-et-photos.js
   Polices sous licence libre (SIL Open Font License) ; photos sous licence Unsplash. */
const fs = require("fs");
const path = require("path");

const RACINE = path.join(__dirname, "..", "..");
const POLICES = path.join(RACINE, "partage", "polices");
const PHOTOS = path.join(RACINE, "partage", "photos");
const CSS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap";
const NAVIGATEUR = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
// identifiant Unsplash → tailles utilisées (voir photo() dans boutique.jsx, l'écran de connexion et admin/styles.css)
const IMAGES = {
  "1687422808311-a776f467a468": [[640, 760, 75]],
  "1758519291037-db9ec86cda69": [[520, 420, 75]],
  "1773858441067-de99ed159a95": [[520, 420, 75]],
  "1687422808384-c896d0efd4ab": [[640, 520, 75], [420, 420, 75]],
  "1676119451563-0c4a1a37e019": [[640, 520, 75]],
  "1739303987830-ca19742b19bc": [[640, 520, 75]],
  "1687422809654-579d81c29d32": [[1100, 1500, 70]],
};

const telecharger = async (url, fichier) => {
  const r = await fetch(url, { headers: { "User-Agent": NAVIGATEUR } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  fs.writeFileSync(fichier, Buffer.from(await r.arrayBuffer()));
};

(async () => {
  fs.mkdirSync(POLICES, { recursive: true });
  fs.mkdirSync(PHOTOS, { recursive: true });

  // Polices : alphabets latin et latin étendu seulement ; les polices à graisse variable tiennent en un fichier
  const css = await (await fetch(CSS, { headers: { "User-Agent": NAVIGATEUR } })).text();
  const fichiers = new Map(); // adresse d'origine → { nom, famille, alphabet, graisses, plage }
  for (const m of css.matchAll(/\/\* ([a-z-]+) \*\/\s*@font-face \{([^}]+)\}/g)) {
    const [, alphabet, bloc] = m;
    if (alphabet !== "latin" && alphabet !== "latin-ext") continue;
    const famille = /font-family: '([^']+)'/.exec(bloc)[1];
    const graisse = Number(/font-weight: (\d+)/.exec(bloc)[1]);
    const url = /url\(([^)]+)\)/.exec(bloc)[1];
    const plage = /unicode-range: ([^;]+);/.exec(bloc)[1];
    const f = fichiers.get(url) || { famille, alphabet, graisses: [], plage };
    f.graisses.push(graisse);
    fichiers.set(url, f);
  }
  let feuille = "/* Polices du site, servies par GOUABO (fichier produit par backend/outils/rapatrier-polices-et-photos.js) */\n";
  for (const [url, f] of fichiers) {
    const min = Math.min(...f.graisses), max = Math.max(...f.graisses);
    const nom = `${f.famille.toLowerCase().replace(/\s+/g, "-")}-${f.alphabet}${min === max ? "-" + min : ""}.woff2`;
    await telecharger(url, path.join(POLICES, nom));
    feuille += `@font-face { font-family: '${f.famille}'; font-style: normal; font-weight: ${min === max ? min : `${min} ${max}`}; font-display: swap; src: url(/partage/polices/${nom}) format('woff2'); unicode-range: ${f.plage}; }\n`;
    console.log("police", nom);
  }
  fs.writeFileSync(path.join(POLICES, "polices.css"), feuille);

  for (const [id, tailles] of Object.entries(IMAGES)) {
    for (const [l, h, q] of tailles) {
      const nom = `${id}-${l}x${h}.jpg`;
      await telecharger(`https://images.unsplash.com/photo-${id}?w=${l}&h=${h}&fit=crop&crop=faces&q=${q}&fm=jpg`, path.join(PHOTOS, nom));
      console.log("photo", nom, Math.round(fs.statSync(path.join(PHOTOS, nom)).size / 1024) + " Ko");
    }
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
