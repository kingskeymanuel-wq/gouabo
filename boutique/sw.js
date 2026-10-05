/* GOUABO — service worker : rend l'application installable et affiche une page claire quand il n'y a pas d'Internet.
   Rien n'est gardé en cache à part cette page : les ventes, les stocks et les prix viennent toujours du serveur. */
const CACHE = "gouabo-v1";
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/hors-ligne.html", "/icones/icone-192.png"]))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return; // seules les pages sont concernées
  e.respondWith(fetch(e.request).catch(() => caches.match("/hors-ligne.html")));
});
