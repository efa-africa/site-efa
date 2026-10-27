/* EFA · L'appli : fonctionnement hors connexion. Changer VERSION à chaque mise en ligne.
   Les données de l'école, du cahier, de Min'Fin, du Dico, des Tribunes et des études viennent du site (../*.js) :
   elles sont mises en cache pour rester disponibles sans connexion, et rafraîchies à chaque ouverture en ligne. */
var VERSION = "efa-app-1.8";
var FICHIERS = ["./", "./index.html", "./content.js", "./manifest.webmanifest", "./confidentialite.html",
  "./koffi.jpg", "./bamba.jpg", "./affoue.jpg", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./fonts.css",
  "./libre-baskerville-latin-400-normal.woff2", "./libre-baskerville-latin-700-normal.woff2", "./libre-baskerville-latin-400-italic.woff2",
  "./source-sans-3-latin-400-normal.woff2", "./source-sans-3-latin-600-normal.woff2", "./source-sans-3-latin-700-normal.woff2", "./source-sans-3-latin-800-normal.woff2",
  "../accueil-visuel.webp", "../accueil/carte-argent-900.webp", "../accueil/carte-bourse-900.webp", "../accueil/carte-proches-900.webp", "../accueil/carte-tontine-900.webp",
  "../parcours-efa.js", "../plan-efa.js", "../minfin.js", "../minfin/ep-1.jpg", "../minfin/ep-2.jpg", "../minfin/ep-3.jpg", "../minfin/ep-4.jpg", "../minfin/ep-5.jpg", "../dico.js", "../tribunes.js", "../donnees.js"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return Promise.all(FICHIERS.map(function (f) { return c.add(new Request(f, { cache: "reload" })).catch(function () {}); }));
  }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
/* Réseau d'abord (contenus toujours à jour), cache ensuite. La page de l'appli ne sert de secours qu'aux navigations. */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r && r.ok) { var copie = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copie); }); }
    return r;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (r) {
      if (r) return r;
      if (e.request.mode === "navigate") return caches.match("./index.html");
      return new Response("", { status: 504, statusText: "Hors connexion" });
    });
  }));
});
