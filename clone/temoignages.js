/* EFA · Témoignages : encadrés de taille fixe. Deux rangées visibles (6 sur ordinateur, 4 sur tablette, 3 sur téléphone) ;
   toutes les 6 s, un encadré s'efface et laisse sa place au témoignage suivant, en fondu.
   Pause au survol, au toucher et au clavier ; aucune rotation si l'utilisateur préfère moins d'animations. */
(function () {
  var G = document.querySelector('.tm-grille'); if (!G) return;
  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAUSE = 6000, FONDU = 600, pause = false, visible = false, t = null, dernier = -1;
  var tous = [].slice.call(G.children);
  /* Mélange léger au chargement : le premier témoignage reste en tête, les autres changent d'ordre */
  var reste = tous.slice(1);
  for (var i = reste.length - 1; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)), x = reste[i]; reste[i] = reste[k]; reste[k] = x; }
  tous = [tous[0]].concat(reste); tous.forEach(function (e) { G.appendChild(e); });
  function colonnes() { return getComputedStyle(G).gridTemplateColumns.split(' ').filter(Boolean).length || 1; }
  function nb() { return Math.min(tous.length, colonnes() * (colonnes() === 1 ? 3 : 2)); }
  function disposer() {
    var n = nb(), vus = 0;
    [].slice.call(G.children).forEach(function (e) { e.hidden = vus >= n; if (!e.hidden) vus++; });
  }
  function tour() {
    if (pause || !visible || document.hidden) return;
    var L = [].slice.call(G.children), V = L.filter(function (e) { return !e.hidden; }), H = L.filter(function (e) { return e.hidden; });
    if (!H.length || !V.length) return;
    var choix = V.length > 1 ? V.filter(function (e, j) { return j !== dernier; }) : V;
    var sort = choix[Math.floor(Math.random() * choix.length)], entre = H[0];
    dernier = V.indexOf(sort);
    sort.classList.add('tm-sort');
    setTimeout(function () {
      entre.classList.add('tm-sort'); G.insertBefore(entre, sort); entre.hidden = false;
      sort.hidden = true; sort.classList.remove('tm-sort'); G.appendChild(sort);
      void entre.offsetWidth; entre.classList.remove('tm-sort');
    }, FONDU);
  }
  disposer();
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(disposer, 200); });
  if (calme) return;
  ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { G.addEventListener(ev, function () { pause = true; }, { passive: true }); });
  ['mouseleave', 'focusout'].forEach(function (ev) { G.addEventListener(ev, function () { pause = false; }); });
  G.addEventListener('touchend', function () { setTimeout(function () { pause = false; }, 4000); }, { passive: true });
  function lancer() { if (!t) t = setInterval(tour, PAUSE); }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) lancer(); }, { threshold: .08 }).observe(G); else { visible = true; lancer(); }
})();
