/* Statut EFA : carrousel d'article à faire défiler. Touche à droite : suite ; à gauche : retour ; appui long : pause ; glisser ; flèches du clavier. */
(function () {
  function init(el) {
    var D = [].slice.call(el.querySelectorAll('.st-d')), B = [].slice.call(el.querySelectorAll('.st-prog i')), N = el.querySelector('.st-n');
    if (!D.length) return;
    var i = 0, t = null, vu = false, pause = false, DUREE = 7000, auto = true, compte = {};
    try { auto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    el.style.setProperty('--st-duree', DUREE + 'ms');
    function relance() {
      clearTimeout(t); el.classList.remove('st-joue', 'st-pause');
      if (auto && vu && !pause && i < D.length - 1) { void el.offsetWidth; el.classList.add('st-joue'); t = setTimeout(function () { aller(i + 1); }, DUREE); }
    }
    function aller(k) {
      i = Math.max(0, Math.min(D.length - 1, k));
      D.forEach(function (s, j) { s.hidden = j !== i; });
      B.forEach(function (b, j) { b.className = j < i ? 'fait' : j === i ? 'cours' : ''; });
      el.classList.toggle('fonce', D[i].classList.contains('c'));
      if (N) N.textContent = (i + 1) + ' / ' + D.length;
      if (i === D.length - 1 && !compte.fin) { compte.fin = 1; try { window.efaCompte && window.efaCompte('statut-fin'); } catch (e) {} }
      relance();
    }
    var x0 = null, t0 = 0, long = false, tl = null;
    el.addEventListener('pointerdown', function (e) { x0 = e.clientX; t0 = Date.now(); long = false; clearTimeout(tl); tl = setTimeout(function () { long = true; pause = true; clearTimeout(t); el.classList.add('st-pause'); }, 320); });
    function fin(e) {
      clearTimeout(tl); if (x0 == null) return;
      var dx = e.clientX - x0; x0 = null;
      if (long) { pause = false; long = false; el.dataset.saute = '1'; relance(); return; }
      if (Math.abs(dx) > 40) { el.dataset.saute = '1'; aller(i + (dx < 0 ? 1 : -1)); }
    }
    el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', function () { clearTimeout(tl); x0 = null; if (long) { pause = false; long = false; relance(); } });
    el.addEventListener('click', function (e) {
      if (el.dataset.saute) { delete el.dataset.saute; if (e.target.closest('.st-zone')) { e.preventDefault(); return; } }
      var z = e.target.closest('.st-zone'); if (!z) return;
      auto = auto && true; aller(i + (z.classList.contains('st-prec') ? -1 : 1));
    });
    el.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); aller(i + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); aller(i - 1); } });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (r) { vu = r[0].isIntersecting && r[0].intersectionRatio >= .6; relance(); }, { threshold: [0, .6, 1] }).observe(el);
    else vu = true;
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(t); else relance(); });
    aller(0);
  }
  function go() { [].forEach.call(document.querySelectorAll('[data-statut]'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
