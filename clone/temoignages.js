/* EFA · Témoignages : les encadrés changent lentement de place, comme aux chaises musicales.
   Un échange toutes les 7 s, alternativement vertical puis horizontal, glissé en 2,6 s.
   Pause au survol, au toucher et au clavier ; arrêt complet si l'utilisateur préfère moins d'animations. */
(function () {
  var G = document.querySelector('.tm-grille'); if (!G) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var DUREE = 2600, PAUSE = 7000, sens = 'v', pause = false, visible = false, t = null;
  function items() { return [].slice.call(G.children).filter(function (e) { return e.offsetParent !== null; }); }
  function r(e) { return e.getBoundingClientRect(); }
  function paires(type) {
    var L = items(), P = [];
    for (var i = 0; i < L.length; i++) for (var j = i + 1; j < L.length; j++) {
      var a = r(L[i]), b = r(L[j]);
      if (type === 'v' && Math.abs(a.left - b.left) < 4 && Math.abs(a.bottom - b.top) < 40) P.push([L[i], L[j]]);
      if (type === 'h' && Math.abs(a.left - b.left) > 40 && Math.abs(a.top - b.top) < Math.min(a.height, b.height) * .6) P.push([L[i], L[j]]);
    }
    return P;
  }
  function echanger(a, b) {
    var L = items(), avant = new Map(); L.forEach(function (e) { avant.set(e, r(e)); });
    var ma = document.createElement('i'); G.insertBefore(ma, a); G.insertBefore(a, b); G.insertBefore(b, ma); G.removeChild(ma);
    L.forEach(function (e) {
      var p = avant.get(e), n = r(e), dx = p.left - n.left, dy = p.top - n.top;
      if (!dx && !dy) return;
      e.style.transition = 'none'; e.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        e.style.transition = 'transform ' + DUREE + 'ms cubic-bezier(.45,0,.2,1)'; e.style.transform = '';
      }); });
    });
  }
  function tour() {
    if (pause || !visible || document.hidden) return;
    var P = paires(sens); if (!P.length) P = paires(sens === 'v' ? 'h' : 'v');
    if (P.length) { var p = P[Math.floor(Math.random() * P.length)]; echanger(p[0], p[1]); }
    sens = sens === 'v' ? 'h' : 'v';
  }
  ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { G.addEventListener(ev, function () { pause = true; }, { passive: true }); });
  ['mouseleave', 'focusout'].forEach(function (ev) { G.addEventListener(ev, function () { pause = false; }); });
  G.addEventListener('touchend', function () { setTimeout(function () { pause = false; }, 4000); }, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: .25 }).observe(G); else visible = true;
  t = setInterval(tour, PAUSE);
})();
