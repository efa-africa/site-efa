/* EFA · Point de départ : jamais plus de trois choix à l'écran.
   Quand une question en propose plus de trois, on en met deux en avant (choisis par EFA),
   les autres restent accessibles derrière « Autre chose ». */
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
    var plus = document.createElement('button');
    plus.type = 'button'; plus.className = 'pdd-plus';
    plus.innerHTML = '<b>Autre chose</b><span>' + (b.length - 2) + ' autres possibilités</span>';
    plus.addEventListener('click', function () {
      b.forEach(function (x) { x.hidden = false; }); plus.remove();
      var p = b.filter(function (x) { return avant.indexOf(x) < 0; })[0]; if (p) p.focus();
    });
    c.appendChild(plus);
  }
  function tout() { document.querySelectorAll('.pdd-choix').forEach(reduire); }
  function go() { tout(); new MutationObserver(tout).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
