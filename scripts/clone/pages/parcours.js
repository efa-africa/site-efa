/* EFA · Clone · L'école, version premium.
   Copié dans clone/pages/ par scripts/clone/habiller.py ; chargé seulement par la copie du Clone.
   La page du site public n'est pas touchée : on réorganise ici la copie, sans changer ses données ni ses scripts.
   Ordre : promesse et action · prochaine étape (si l'on revient) · trois cycles puis le CEFA ·
   ce que l'on fabrique · modules · certificats · ressources · façon d'avancer · ambassadeurs. */
(function () {
  var racine = new URL(document.baseURI).pathname.replace(/[^\/]*$/, '');
  var A = racine + 'clone/assets/';
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var CY = {
    fondations: { img: 'cycle-fondations.webp', n: 'I', t: 'Fondations', b: 'Savoir où passe son argent, tenir un mois, commencer une réserve, protéger sa famille.', m: '8 modules' },
    maitrise: { img: 'cycle-maitrise.webp', n: 'II', t: 'Maîtrise', b: 'Un mois de réserve, des dettes ordonnées, l’année entière prévue, la solidarité organisée.', m: '8 modules' },
    patrimoine: { img: 'cycle-patrimoine.webp', n: 'III', t: 'Patrimoine', b: 'Les placements de la zone, la BRVM, un projet, la retraite et la transmission.', m: '7 modules' }
  };
  function avance(cy) {
    var e = document.getElementById('cycle-' + cy);
    var m = e && (e.textContent || '').match(/(\d+)\s*sur\s*(\d+)\s*validés/);
    return m ? { f: +m[1], t: +m[2] } : null;
  }

  function construire() {
    var hero = $('main .hero'), col = hero && $('.col', hero);
    if (!hero || hero.hasAttribute('data-premium')) return;
    hero.setAttribute('data-premium', '');
    var reprise = $('#reprise'), lien = reprise && $('a.bouton', reprise);
    var revient = !!(lien && reprise && !reprise.hidden && /^\s*Reprendre/.test(lien.textContent));
    var demo = $('.demo-l a', hero);

    /* 1. Premier écran : promesse, action, grande photo */
    var h = el('div', 'ec-hero');
    h.innerHTML =
      '<div class="ec-hero-txt"><p class="ec-k">L’école EFA</p>' +
      '<h1>Votre argent s’apprend.<em>Votre avenir se construit.</em></h1>' +
      '<p class="ec-lead">Du premier budget aux premières décisions patrimoniales, avancez avec des exercices concrets et des outils adaptés à votre quotidien.</p>' +
      '<div class="ec-actions"><a class="ec-cta" href="' + (lien ? lien.getAttribute('href') : '#cycle-fondations') + '">' +
      (revient ? 'Reprendre mon module' : 'Commencer mon parcours') + ' <span aria-hidden="true">→</span></a>' +
      (demo ? '<a class="ec-demo" href="' + demo.getAttribute('href') + '">▶ Voir la démo · 2 min</a>' : '') + '</div>' +
      '<p class="ec-note">Gratuit · à votre rythme · parcours en pilote</p></div>' +
      '<figure class="ec-hero-img"><img src="' + A + 'q1.webp" alt="" decoding="async" fetchpriority="high"></figure>';
    hero.insertBefore(h, hero.firstChild);
    if (col) col.classList.add('ec-ancien');

    /* 2. Prochaine étape : seulement pour qui revient */
    var suite = el('section', 'ec-bloc ec-reprise-bloc');
    if (revient) { reprise.classList.add('ec-reprise'); suite.appendChild(reprise); }
    hero.parentNode.insertBefore(suite, hero.nextSibling);

    /* 3. Trois cycles, puis le CEFA */
    var cyc = el('section', 'ec-bloc ec-cycles');
    cyc.setAttribute('aria-labelledby', 'ec-cycles-t');
    var cartes = '';
    Object.keys(CY).forEach(function (k) {
      var c = CY[k], p = avance(k), pct = p && p.t ? Math.round(100 * p.f / p.t) : 0;
      cartes += '<a class="ec-cy ec-cy-' + k + '" href="#cycle-' + k + '" data-cy-go="' + k + '"' + (k === 'patrimoine' ? ' data-clair="garder"' : '') + '>' +
        '<span class="ec-cy-img"><img src="' + A + c.img + '" alt="" decoding="async"></span>' +
        '<span class="ec-cy-corps"><span class="ec-cy-n">Cycle ' + c.n + '</span><b>' + c.t + '</b><span class="ec-cy-b">' + c.b + '</span>' +
        '<span class="ec-cy-pied"><span>' + c.m + (p && p.f ? ' · ' + p.f + ' validé' + (p.f > 1 ? 's' : '') : '') + '</span><span class="ec-cy-go">Voir le cycle →</span></span>' +
        (p && p.f ? '<span class="ec-cy-barre" role="img" aria-label="' + pct + ' % du cycle validé"><i style="width:' + pct + '%"></i></span>' : '') +
        '</span></a>';
    });
    cyc.innerHTML = '<div class="ec-tete"><p class="ec-k">Le parcours</p><h2 id="ec-cycles-t">Trois cycles, <em>à votre rythme.</em></h2></div>' +
      '<div class="ec-cy-grille">' + cartes + '</div>' +
      '<a class="ec-cefa" href="certificat-cefa.html"><span class="ec-cefa-img"><img src="' + A + 'cycle-cefa.webp" alt="" decoding="async"></span>' +
      '<span class="ec-cefa-txt"><span class="ec-k">L’aboutissement</span><b>Le certificat CEFA ★</b>' +
      '<span>Un certificat local à la fin de chaque cycle, puis le CEFA qui les réunit : vos connaissances vérifiées, appliquées à votre situation.</span>' +
      '<span class="ec-cefa-go">Découvrir le certificat →</span></span></a>';
    suite.parentNode.insertBefore(cyc, suite.nextSibling);
    var route = $('ol.route'); if (route) route.classList.add('ec-ancien');
    var autres = $('details.apres-route');

    /* 4. Ce que l'on fabrique : captures des vrais outils de l'école */
    var fab = el('section', 'ec-bloc ec-fab');
    fab.innerHTML = '<div class="ec-tete"><p class="ec-k">Ce que vous construisez</p><h2>Vous repartez avec plus <em>que des notions.</em></h2>' +
      '<p class="ec-lead">Un budget construit. Une réserve préparée. Des décisions mieux posées. Chaque module se termine par une fiche que vous gardez.</p></div>' +
      '<div class="ec-fab-grille">' +
      fiche('ecole-fiche-budget.webp', 'Ma fiche budget', 'Un budget construit', 'Votre fiche « Mon budget, en bref » : vos chiffres, votre méthode, trois gestes.', 'construire-son-budget.html') +
      fiche('ecole-fiche-reserve.webp', 'Ma réserve', 'Une réserve préparée', 'Ce que vous gardez à chaque rentrée, et en combien de rentrées votre projet est financé.', 'cercle-spirale.html#argent') +
      fiche('ecole-fiche-decisions.webp', 'Simulateur de décisions', 'Des décisions mieux posées', 'Cinq situations à trancher : le prix de chaque choix, et votre réponse prête à envoyer.', 'decider.html') +
      '</div>';
    cyc.parentNode.insertBefore(fab, cyc.nextSibling);
    function fiche(img, outil, t, d, h) {
      return '<a class="ec-fiche" href="' + h + '"><span class="ec-fiche-img"><span class="ec-fiche-barre" aria-hidden="true"><i></i><i></i><i></i><em>' + outil + '</em></span>' +
        '<span class="ec-fiche-ecran"><img src="' + A + img + '" alt="Capture de l’outil : ' + t.toLowerCase() + '" decoding="async" loading="lazy"></span></span>' +
        '<span class="ec-fiche-num"></span><b>' + t + '</b><span class="ec-fiche-d">' + d + '</span><span class="ec-fiche-go">Essayer l’outil →</span></a>';
    }

    /* 5. Modules, puis certificats et ressources ; « Autres façons de commencer » rejoint les ressources */
    var tous = $('#tous'), certs = $('#certificats'), boite = $('#boite'), prog = $('#programmes'), chemin = $('#chemin'), profil = $('#profil'), conseil = $('#conseil');
    var apres = fab;
    [tous, certs, boite, prog].forEach(function (s) { if (s) { apres.parentNode.insertBefore(s, apres.nextSibling); apres = s; } });
    if (autres && prog) { autres.classList.add('ec-autres'); prog.appendChild(autres); }
    /* La façon d'avancer et le profil passent après les ressources */
    [chemin, profil, conseil].forEach(function (s) { if (s) { apres.parentNode.insertBefore(s, apres.nextSibling); apres = s; } });
    if (tous) {
      tous.classList.add('ec-modules');
      var intro = $('.intro', tous);
      var ih = intro && $('h2', intro), ik = intro && $('.kick,.surtitre,.etiquette', intro);
      if (ih) ih.innerHTML = 'Les modules, <em>cycle par cycle.</em>';
      if (ik) ik.textContent = 'Les modules';
      if (intro && !$('.ec-pilote', tous)) intro.appendChild(el('p', 'ec-pilote', 'Parcours en pilote : modules relus par l’équipe EFA, relecture par un expert extérieur en cours.'));
      // en-tête visuel de chaque cycle
      ['fondations', 'maitrise', 'patrimoine'].forEach(function (k) {
        var d = document.getElementById('cycle-' + k), s = d && $('summary', d);
        if (s && !$('.ec-cy-vignette', s)) {
          var v = el('span', 'ec-cy-vignette'); v.innerHTML = '<img src="' + A + CY[k].img + '" alt="" loading="lazy" decoding="async">';
          s.insertBefore(v, s.firstChild);
          d.classList.add('ec-cycle-' + k);
          if (k === 'patrimoine') {
            d.setAttribute('data-clair', 'garder'); s.setAttribute('data-clair', 'garder');
            s.querySelectorAll('*').forEach(function (x) { x.setAttribute('data-clair', 'garder'); });
          }
        }
      });
      // modules : numéro « 01 — », titre, résultat, durée, action
      tous.querySelectorAll('details.parcours > summary').forEach(function (s) {
        var num = $('.num', s), et = $('.p-tete .etiquette', s);
        if (num && /^\d+$/.test(num.textContent.trim())) num.textContent = ('0' + num.textContent.trim()).slice(-2);
        if (et && !s.hasAttribute('data-ec')) { s.setAttribute('data-ec', ''); et.textContent = et.textContent.replace(/^Module\s+\d+\s*·\s*/, ''); }
        var go = $('.p-go', s); if (go) go.textContent = go.textContent.replace('›', '→');
      });
    }

    /* 6. Ambassadeurs : transmettre */
    var amb = $('#ambassadeur'), c = amb && $('.amb-c', amb);
    if (c && !$('.ec-amb', amb)) {
      var a = $('a.amb-a', c);
      var bloc = el('div', 'ec-amb');
      bloc.innerHTML = '<figure class="ec-amb-img"><img src="' + A + 'benefice-collectif.webp" alt="" loading="lazy" decoding="async"></figure>' +
        '<div class="ec-amb-txt"><p class="ec-k">Ambassadeurs</p><h2 id="amb-t2">Vous apprenez. <em>Vous pouvez aussi transmettre.</em></h2>' +
        '<p>Faites découvrir l’éducation financière à votre communauté avec les supports de l’école EFA.</p>' +
        '<a class="ec-cta" href="' + (a ? a.getAttribute('href') : 'rendez-vous.html?sujet=ambassadeur#contact') + '">Échanger avec EFA <span aria-hidden="true">→</span></a>' +
        '<small>Un premier échange, sans engagement.</small></div>';
      c.classList.add('ec-ancien');
      amb.appendChild(bloc);
      amb.setAttribute('aria-labelledby', 'amb-t2');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construire); else construire();
})();
