/* EFA · Clone · L'école : les cycles en cartes illustrées (Fondations, Maîtrise, Patrimoine, CEFA).
   Copié dans clone/pages/ par scripts/clone/habiller.py. Ne touche pas la page du site public. */
(function () {
  var racine = new URL(document.baseURI).pathname.replace(/[^\/]*$/, '');
  var C = {
    fondations: { img: 'cycle-fondations.webp', n: 'I', t: 'Fondations', s: '8 modules · Voir et tenir', d: 'Savoir où passe son argent, tenir un mois, commencer une réserve, protéger sa famille.', cta: 'Voir le cycle' },
    maitrise: { img: 'cycle-maitrise.webp', n: 'II', t: 'Maîtrise', s: '8 modules · Organiser', d: 'Un mois de réserve, des dettes ordonnées, l’année entière prévue, la solidarité organisée.', cta: 'Voir le cycle' },
    patrimoine: { img: 'cycle-patrimoine.webp', n: 'III', t: 'Patrimoine', s: '7 modules · Préparer la suite', d: 'Comprendre les placements de la zone, la BRVM, préparer un projet, sa retraite et la transmission.', cta: 'Voir le cycle', vert: 1 },
    cefa: { img: 'cycle-cefa.webp', n: '★', t: 'Certificat CEFA', s: 'Réunir les trois cycles', d: 'Des attestations, des certificats locaux, puis le CEFA.', cta: 'Découvrir le parcours' }
  };
  function avance(cy) {
    var e = document.getElementById('cycle-' + cy);
    var m = e && (e.textContent || '').match(/(\d+)\s*sur\s*(\d+)\s*validés/);
    return m ? Math.round(100 * (+m[1]) / Math.max(1, +m[2])) : null;
  }
  function construire() {
    var ol = document.querySelector('ol.route');
    if (!ol || ol.hasAttribute('data-cartes')) return;
    ol.setAttribute('data-cartes', '');
    ol.querySelectorAll('li.r-fl').forEach(function (li) { li.remove(); });
    ol.querySelectorAll('li > a').forEach(function (a) {
      var k = a.getAttribute('data-cy-go') || (/certificat-cefa/.test(a.getAttribute('href')) ? 'cefa' : null), c = C[k];
      if (!c) return;
      var p = k === 'cefa' ? null : avance(k);
      a.className = 'cy-carte' + (c.vert ? ' cy-vert' : '');
      if (c.vert) a.setAttribute('data-clair', 'garder');
      a.innerHTML =
        '<span class="cy-img"><img src="' + racine + 'clone/assets/' + c.img + '" alt="" decoding="async"></span>' +
        '<span class="cy-corps"><span class="cy-n">' + c.n + '</span><b class="cy-titre">' + c.t + '</b><span class="cy-sous">' + c.s + '</span>' +
        '<span class="cy-desc">' + c.d + '</span>' +
        (p === null ? '' : '<span class="cy-barre" role="img" aria-label="' + p + ' % du cycle validé"><i style="width:' + Math.max(p, 0) + '%"></i></span>') +
        '<span class="cy-cta">' + c.cta + ' <span aria-hidden="true">→</span></span></span>';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construire); else construire();
  // la progression s'affiche après le calcul de la page
  window.addEventListener('load', function () {
    ['fondations', 'maitrise', 'patrimoine'].forEach(function (k) {
      var p = avance(k), a = document.querySelector('ol.route a[data-cy-go="' + k + '"] .cy-barre i');
      if (a && p !== null) { a.style.width = p + '%'; a.parentNode.setAttribute('aria-label', p + ' % du cycle validé'); }
    });
  });
})();
