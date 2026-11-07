/* EFA · Témoignages (7 nov. 2026)
   - Encadrés de taille fixe, deux rangées visibles (6 sur ordinateur, 4 sur tablette, 3 sur téléphone).
   - À l'arrivée sur la section : les encadrés scintillent l'un après l'autre.
   - Puis, toutes les 6 s, en alternance : deux encadrés échangent leur place (chaises musicales),
     ou un encadré s'efface et laisse sa place au témoignage suivant (apparition).
   - Flèches « précédents / suivants » : on fait défiler soi-même ; la rotation automatique se met en pause un moment.
   Pause au survol, au toucher et au clavier ; pas d'animation si l'utilisateur préfère moins de mouvement. */
(function () {
  var G = document.querySelector('.tm-grille'); if (!G) return;
  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAUSE = 6000, FONDU = 600, GLISSE = 1400, pause = false, visible = false, t = null, dernier = -1, mode = 0, attendre = 0;
  var tous = [].slice.call(G.children);
  /* Mélange léger au chargement : le premier témoignage reste en tête */
  var reste = tous.slice(1);
  for (var i = reste.length - 1; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)), x = reste[i]; reste[i] = reste[k]; reste[k] = x; }
  tous = [tous[0]].concat(reste); tous.forEach(function (e) { G.appendChild(e); });
  function L() { return [].slice.call(G.children); }
  function colonnes() { return getComputedStyle(G).gridTemplateColumns.split(' ').filter(Boolean).length || 1; }
  function nb() { return Math.min(tous.length, colonnes() * (colonnes() === 1 ? 3 : 2)); }
  function disposer() { var n = nb(); L().forEach(function (e, j) { e.hidden = j >= n; }); }
  function vus() { return L().filter(function (e) { return !e.hidden; }); }
  function r(e) { return e.getBoundingClientRect(); }

  /* Apparition : un encadré s'efface, le suivant prend sa place */
  function apparition() {
    var V = vus(), H = L().filter(function (e) { return e.hidden; });
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
  /* Chaises musicales : deux encadrés visibles échangent leur place en glissant */
  function chaises() {
    var V = vus(); if (V.length < 2) return apparition();
    var a = V[Math.floor(Math.random() * V.length)], b;
    do { b = V[Math.floor(Math.random() * V.length)]; } while (b === a);
    var avant = new Map(); V.forEach(function (e) { avant.set(e, r(e)); });
    var m = document.createElement('i'); G.insertBefore(m, a); G.insertBefore(a, b); G.insertBefore(b, m); G.removeChild(m);
    V.forEach(function (e) {
      var p = avant.get(e), n = r(e), dx = p.left - n.left, dy = p.top - n.top;
      if (!dx && !dy) return;
      e.style.transition = 'none'; e.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        e.style.transition = 'transform ' + GLISSE + 'ms cubic-bezier(.45,0,.2,1)'; e.style.transform = '';
        setTimeout(function () { e.style.transition = ''; }, GLISSE + 50);
      }); });
    });
  }
  function tour() {
    if (pause || !visible || document.hidden || Date.now() < attendre) return;
    (mode++ % 2 ? chaises : apparition)();
  }
  /* Scintillement à l'arrivée, en partant d'en haut à gauche */
  function scintiller() {
    vus().filter(function (e) { return e.classList.contains('tm-c'); }).forEach(function (e, j) {
      setTimeout(function () { e.classList.remove('tm-scint'); void e.offsetWidth; e.classList.add('tm-scint'); setTimeout(function () { e.classList.remove('tm-scint'); }, 1100); }, j * 260);
    });
  }
  /* Défilement manuel : on montre le groupe suivant ou précédent, en fondu */
  function page(sens) {
    var n = nb(), A = L(); if (A.length <= n) return;
    attendre = Date.now() + 15000;
    var V = vus(); V.forEach(function (e) { e.classList.add('tm-sort'); });
    setTimeout(function () {
      A = L();
      if (sens > 0) A.slice(0, n).forEach(function (e) { G.appendChild(e); });
      else A.slice(-n).reverse().forEach(function (e) { G.insertBefore(e, G.firstChild); });
      L().forEach(function (e, j) { e.hidden = j >= n; if (!e.hidden) e.classList.add('tm-sort'); });
      void G.offsetWidth;
      vus().forEach(function (e) { e.classList.remove('tm-sort'); });
      if (!calme) scintiller();
    }, calme ? 0 : FONDU);
  }
  var nav = document.createElement('div'); nav.className = 'tm-nav';
  nav.innerHTML = '<button type="button" class="tm-fl" data-s="-1" aria-label="Témoignages précédents">←</button>'
    + '<span class="tm-nav-t">' + tous.filter(function (e) { return e.classList.contains('tm-c'); }).length + ' témoignages</span>'
    + '<button type="button" class="tm-fl" data-s="1" aria-label="Témoignages suivants">→</button>';
  G.parentNode.insertBefore(nav, G.nextSibling);
  nav.addEventListener('click', function (e) { var b = e.target.closest('.tm-fl'); if (b) page(+b.dataset.s); });
  /* Le grand guillemet corail sert aussi de flèche « suivants » */
  G.addEventListener('click', function (e) { if (e.target.closest('.tm-g')) page(1); });
  /* Glisser du doigt sur téléphone */
  var x0 = null;
  G.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  G.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) page(dx < 0 ? 1 : -1); }, { passive: true });

  disposer();
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(disposer, 200); });
  if (calme) return;
  ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { G.addEventListener(ev, function () { pause = true; }, { passive: true }); });
  ['mouseleave', 'focusout'].forEach(function (ev) { G.addEventListener(ev, function () { pause = false; }); });
  G.addEventListener('touchend', function () { setTimeout(function () { pause = false; }, 4000); }, { passive: true });
  var arrive = 0;
  function arrivee() {
    var mtn = Date.now(); if (mtn - arrive < 15000) return; arrive = mtn;
    scintiller();
    clearInterval(t); clearTimeout(window._tmT);
    window._tmT = setTimeout(function () { tour(); t = setInterval(tour, PAUSE); }, 2500);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) arrivee(); }, { threshold: .15 }).observe(G); else { visible = true; arrivee(); }
})();
