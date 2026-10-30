/* EFA · Africa 2075, article fondateur : l'essentiel d'abord, les chiffres en avant, une lecture guidée.
   Le texte de l'article n'est pas modifié : on ajoute un résumé chiffré, un sommaire, une barre de lecture,
   et l'on met en scène les chiffres déjà présents. */
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function construire() {
    var prose = $('.prose'), col = prose && prose.closest('.col');
    if (!prose || document.querySelector('.a75-essentiel')) return;

    // titres de section : des ancres pour le sommaire
    var h2s = [].slice.call(document.querySelectorAll('.col h2'));
    var cibles = [
      ['Les chiffres', /géants de 2075/], ['Trois forces', /Trois forces/], ['Six chantiers', /six chantiers/],
      ['Puissance et richesse', /Puissance ne veut pas/], ['La revue', /Ce que sera Africa 2075/]
    ];
    var som = [];
    cibles.forEach(function (c, k) {
      var h = h2s.filter(function (x) { return c[1].test(x.textContent); })[0]; if (!h) return;
      var bloc = h.closest('figure,section') || h;
      if (!bloc.id) bloc.id = 'a75-s' + (k + 1);
      som.push('<a href="#' + bloc.id + '"><i>' + (k + 1) + '</i>' + c[0] + '</a>');
    });

    // 1. L'essentiel en 30 secondes
    var ess = el('section', 'a75-essentiel');
    ess.setAttribute('aria-labelledby', 'a75-ess-t');
    ess.innerHTML =
      '<p class="a75-k">L’essentiel en 30 secondes</p><h2 id="a75-ess-t">Quatre chiffres, une thèse.</h2>' +
      '<div class="a75-chiffres">' +
      '<div><b>5<sup>e</sup></b><span>Le Nigeria, cinquième économie du monde en 2075 selon Goldman Sachs.</span></div>' +
      '<div><b>33 000<small> Md $</small></b><span>Quatre pays africains réunis en 2075 : plus de la moitié de la Chine.</span></div>' +
      '<div><b>1 sur 2</b><span>Près d’un jeune de moins de 25 ans sur deux dans le monde serait africain (ONU).</span></div>' +
      '<div><b>+81 %</b><span>D’échanges entre pays africains grâce au marché commun (Banque mondiale).</span></div>' +
      '</div>' +
      '<p class="a75-these"><b>La thèse :</b> prise comme un seul espace économique, l’Afrique peut devenir la première puissance économique du monde en 2075. Pas une prophétie : six chantiers, dont le premier est l’argent de chacun.</p>' +
      '<nav class="a75-som" aria-label="Sommaire">' + som.join('') + '</nav>';
    col.insertBefore(ess, col.firstChild);

    // 2. Trois forces : le chiffre de chaque force en grand
    var F = [['19 %', 'de la population mondiale aujourd’hui'], ['450 Md $', 'de revenus en plus d’ici 2035'], ['54', 'économies à relier entre elles']];
    document.querySelectorAll('.forces .force').forEach(function (f, k) {
      if (!F[k] || f.querySelector('.a75-fc')) return;
      f.insertAdjacentHTML('afterbegin', '<p class="a75-fc"><b>' + F[k][0] + '</b><span>' + F[k][1] + '</span></p>');
    });

    // 3. La conviction en exergue
    [].slice.call(prose.parentNode.querySelectorAll('.prose p')).forEach(function (p) {
      if (/C’est ma conviction/.test(p.textContent) && !p.classList.contains('a75-exergue')) p.classList.add('a75-exergue');
    });

    // 4. Barre de lecture
    var barre = el('div', 'a75-lecture'); barre.setAttribute('aria-hidden', 'true'); barre.innerHTML = '<i></i>';
    document.body.appendChild(barre);
    var i = barre.firstChild;
    function maj() {
      var r = col.getBoundingClientRect(), h = r.height - innerHeight, p = h > 0 ? Math.min(1, Math.max(0, -r.top / h)) : 0;
      i.style.transform = 'scaleX(' + p + ')';
    }
    addEventListener('scroll', maj, { passive: true }); maj();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construire); else construire();
})();
