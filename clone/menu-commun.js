/* EFA · Menu commun (même vue « classe » que partout) sur les pages qui ont leur propre en-tête :
   Acteurs, Études et prospective, Marchés labo. Leur bouton menu ouvre ce panneau. */
(function () {
  if (document.getElementById('clone-menu')) return;
  var MENU = "<div class=\"menu-rac\"><a href=\"diagnostic.html\">Faire mon diagnostic</a><a href=\"generateur-de-projet.html\">EFA Déclic</a></div><a href=\"index.html#benefices\">Apprendre et former <span>↗</span></a><a class=\"menu-sous\" href=\"outils.html\">Outils et simulateurs <span>↗</span></a><a href=\"index.html#pilier-progresser\">Être coaché <span>↗</span></a><a href=\"index.html#pilier-agir\">Se lancer <span>↗</span></a><a class=\"menu-sous\" href=\"projets-a-suivre.html\">Projets à suivre <span>↗</span></a><a class=\"menu-sous\" href=\"marches.html\">Marchés : la Bourse du jour <span>↗</span></a><a href=\"news.html\">EFA News <span>↗</span></a><a class=\"menu-sous\" href=\"decryptage.html\">Décryptage <span>↗</span></a><a href=\"etudes-prospective.html\">Études et prospective <span>↗</span></a><a href=\"auteur.html#auteur\">À propos <span>↗</span></a><a class=\"menu-cle\" href=\"organisations.html\">Pour les organisations <span>↗</span></a><a class=\"menu-sous\" href=\"rejoindre.html\">J’ai un code d’organisation <span>↗</span></a><a href=\"rendez-vous.html#contact\">Nous contacter <span>↗</span></a>";
  var b = document.querySelector('.ac-burger, header .menu-button, #menu-button'); if (!b) return;
  var nav = document.getElementById(b.getAttribute('aria-controls') || '');
  var ici = nav ? [].filter.call(nav.querySelectorAll('a[href^="#"]'), function (a) { return a.textContent.trim(); }) : [];
  var st = document.createElement('style');
  st.textContent = '.mc-panel{position:fixed;z-index:120;right:max(16px,calc((100vw - 1360px)/2));top:var(--mc-top,72px);background:#fff;color:#081d33;width:min(420px,calc(100vw - 32px));max-height:calc(100svh - var(--mc-top,72px) - 12px);overflow:auto;padding:18px 28px;border-radius:0 0 20px 20px;box-shadow:0 18px 40px #00152a33;display:none;font-family:"Libre Baskerville",Georgia,serif;box-sizing:border-box}'
    + '.mc-panel.open{display:block}.mc-panel *{box-sizing:border-box}'
    + '.mc-panel a{display:flex;justify-content:space-between;align-items:baseline;padding:17px 0;border-bottom:1px solid #E1E8F0;font-weight:700;font-size:17px;color:#081d33;text-decoration:none}'
    + '.mc-panel a:last-child{border:0}.mc-panel a span{color:#E44828}.mc-panel a:hover{color:#147f9b}'
    + '.mc-panel a.menu-sous{padding:10px 0 12px 18px;font-size:15px;font-weight:600;color:#465062}.mc-panel a.menu-sous span{font-size:13px}'
    + '.mc-panel a.menu-cle{color:#E44828}' + '.mc-panel .menu-rac{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:4px 0 14px;margin-bottom:4px;border-bottom:1px solid #E1E8F0}.mc-panel .menu-rac a{display:block!important;text-align:center;padding:12px 8px!important;border:0!important;border-radius:10px;font:800 14.5px/1.2 "Source Sans 3",system-ui,sans-serif!important;color:#fff!important;background:#DA3C1B;text-decoration:none}.mc-panel .menu-rac a+a{background:#0B1220}.mc-panel .menu-rac a{display:flex!important;align-items:center;justify-content:center}'
    + '.mc-panel .mc-ici{margin:0 0 4px;padding:4px 0 6px;font:800 11px/1.2 "Source Sans 3",system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#147f9b}'
    + '.mc-panel .mc-ici-l{border-bottom:2px solid #E1E8F0;margin-bottom:6px}';
  document.head.appendChild(st);
  var p = document.createElement('nav'); p.className = 'mc-panel'; p.id = 'mc-panel'; p.setAttribute('aria-label', 'Menu');
  var h = '';
  if (ici.length) h += '<p class="mc-ici">Sur cette page</p><div class="mc-ici-l">' + ici.map(function (a) { return '<a class="menu-sous" href="' + a.getAttribute('href') + '">' + a.textContent.replace(/[↗↓→]/g, '').trim() + ' <span>↓</span></a>'; }).join('') + '</div>';
  p.innerHTML = h + MENU; document.body.appendChild(p);
  function haut() { var hd = b.closest('header'); var r = hd ? hd.getBoundingClientRect() : { bottom: 72 }; p.style.setProperty('--mc-top', Math.max(56, Math.round(r.bottom)) + 'px'); }
  function fermer() { p.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Ouvrir le menu'); b.classList.remove('mc-ouvert'); }
  b.setAttribute('aria-controls', 'mc-panel');
  b.addEventListener('click', function (e) {
    e.preventDefault(); e.stopImmediatePropagation(); haut();
    var o = p.classList.toggle('open'); b.setAttribute('aria-expanded', o ? 'true' : 'false'); b.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu');
    if (nav) { nav.classList.remove('open', 'is-open', 'ouvert'); }
  }, true);
  p.addEventListener('click', function (e) { if (e.target.closest('a')) fermer(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
  document.addEventListener('click', function (e) { if (!p.contains(e.target) && !b.contains(e.target)) fermer(); });
})();
