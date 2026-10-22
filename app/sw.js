/* EFA Compagnon : fonctionnement hors connexion. Changer VERSION à chaque mise en ligne. */
var VERSION = "efa-app-0.7";
var FICHIERS = ["./", "./index.html", "./content.js", "./manifest.webmanifest", "./confidentialite.html", "./koffi.jpg", "./bamba.jpg", "./affoue.jpg", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./fonts.css", "./big-shoulders-display-latin-600-normal.woff2", "./big-shoulders-display-latin-800-normal.woff2", "./big-shoulders-display-latin-900-normal.woff2", "./manrope-latin-400-normal.woff2", "./manrope-latin-500-normal.woff2", "./manrope-latin-600-normal.woff2", "./manrope-latin-700-normal.woff2", "./manrope-latin-800-normal.woff2"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FICHIERS.map(function (f) { return new Request(f, { cache: "reload" }); })).catch(function () {}); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
/* Réseau d'abord pour le contenu (mises à jour sans republier l'application), cache ensuite. */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var copie = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copie); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match("./index.html"); }); }));
});
