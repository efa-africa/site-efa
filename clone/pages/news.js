/* EFA · À propos : sur téléphone, l'en-tête photo suit la règle des entrées immersives (photo seule + « Découvrir »). */
(function () {
  if (document.querySelector('script[src*="immersif.js"]')) return;
  var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'clone/immersif.css?v=20261031g'; document.head.appendChild(l);
  var s = document.createElement('script'); s.src = 'clone/immersif.js?v=20261031g'; s.defer = true; document.head.appendChild(s);
})();
