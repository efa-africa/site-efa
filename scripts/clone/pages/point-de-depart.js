/* EFA · Point de départ : deux choix, puis « Autre chose ».
   Quand une question en propose plus de trois, on en met deux en avant (choisis par EFA) ;
   « Autre chose » en montre deux de plus, puis « Voir plus », deux par deux, jusqu'au bout. */
(function () {
  var D = { moi: 1, investir: 1, budget: 1, tontine: 1, salaries: 1, etudiants: 1, brvm: 1, economie: 1 };
  function reduire(c) {
    if (c.hasAttribute('data-deux')) return;
    var b = [].slice.call(c.querySelectorAll(':scope > button[data-v]'));
    if (b.length <= 3) return;
    c.setAttribute('data-deux', '');
    var avant = b.filter(function (x) { return D[x.getAttribute('data-v')]; }).slice(0, 2);
    if (avant.length < 2) avant = b.slice(0, 2);
    b.forEach(function (x) { if (avant.indexOf(x) < 0) x.hidden = true; });
    avant.forEach(function (x) { c.insertBefore(x, c.firstChild); });
    avant[1] && c.insertBefore(avant[0], avant[1]);
    // « Autre chose » montre deux choix de plus, puis « Voir plus », deux par deux, jusqu'au bout
    var plus = document.createElement('button');
    plus.type = 'button'; plus.className = 'pdd-plus';
    function libelle(premier) {
      var n = b.filter(function (x) { return x.hidden; }).length;
      plus.innerHTML = '<b>' + (premier ? 'Autre chose' : 'Voir plus') + '</b><span>' + n + ' autre' + (n > 1 ? 's' : '') + ' possibilité' + (n > 1 ? 's' : '') + '</span>';
    }
    libelle(true);
    plus.addEventListener('click', function () {
      var caches = b.filter(function (x) { return x.hidden; }), suite = caches.slice(0, 2);
      suite.forEach(function (x) { x.hidden = false; c.insertBefore(x, plus); });
      if (suite[0]) suite[0].focus();
      if (caches.length <= 2) plus.remove(); else libelle(false);
    });
    c.appendChild(plus);
  }
  function tout() { document.querySelectorAll('.pdd-choix').forEach(reduire); }
  function go() { tout(); new MutationObserver(tout).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
