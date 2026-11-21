/* Espaces EFA : les produits d'EFA mis en avant au bon moment, selon le sujet lu (20 nov. 2026).
   Trois formats ici :
   - l'éphémère : une bulle en bas d'un article ou d'un guide, à 40 % de lecture, qui disparaît seule après 8 s (une fois par visite) ;
   - l'intercalaire : un plein écran entre deux chapitres d'un atelier, que l'on passe après 3 s (une fois par atelier) ;
   - le résultat : une carte sous le résultat d'un outil, avec la suite logique.
   La carte intégrée des listes d'ateliers est écrite par scripts/ateliers/page-catalogue.py.
   Règles : jamais pendant un exercice ou une saisie, toujours fermable, jamais la page sur laquelle on est déjà. */
(function () {
  if (window.EFA_ANNONCES) return;
  var PAGE = (location.pathname.split('/').pop() || 'index.html').replace(/\?.*$/, '');
  if (!/\.html$/.test(PAGE)) PAGE += '.html';
  var SANS = /^(index|abonnement|partenaires|question|ateliers(-[a-z]+)?|admin.*|mon-efa|rejoindre|organisations|rendez-vous|programme-organisation|etudiants|demo|ely|minfin|lettre|merci.*|paiement.*|connexion.*|ma-brvm|accueil-v3|prochain-pas)\.html$/;

  /* Le catalogue des produits EFA */
  var P = {
    abo:        { k: 'efa. abonnement', t: 'Tous les ateliers, pendant 30 jours', p: 'Dès 10 000 F : apprenez à votre rythme, avec des exercices sur votre situation.', c: 'Voir les formules', u: 'abonnement.html', i: 'theme-budget-900.webp' },
    budgetzero: { k: 'Atelier', t: 'Mon budget à zéro', p: 'Donnez une mission à chaque franc, et repartez avec votre budget en PDF.', c: 'Découvrir l’atelier', u: 'atelier-budget-zero.html', i: 'budget-couple.webp' },
    outilbudget:{ k: 'Outil gratuit', t: 'Construire mon budget en 10 minutes', p: 'Chaque franc reçoit une mission, et vous gardez votre budget en PDF.', c: 'Ouvrir l’outil', u: 'outil-budget.html', i: 'budget-entree.webp' },
    diag:       { k: 'Gratuit · 3 minutes', t: 'Par où commencer avec votre argent ?', p: 'Le diagnostic vous indique votre priorité, et les contenus qui vont avec.', c: 'Faire mon diagnostic', u: 'diagnostic.html', i: 'theme-placer-900.webp' },
    coach:      { k: 'Parcours accompagné', t: 'Mon premier ordre à la Bourse', p: 'Ouvrir son compte et passer son premier ordre, pas à pas, sans rester seul.', c: 'Découvrir le parcours', u: 'coach-bourse.html', i: 'theme-bourse-900.webp' },
    action:     { k: 'Atelier', t: 'Acheter sa première action à la BRVM', p: 'Choisir une société, passer l’ordre, savoir combien ça coûte.', c: 'Découvrir l’atelier', u: 'atelier-premiere-action.html', i: 'bourse-portefeuille-releve.webp' },
    dividendes: { k: 'Atelier', t: 'Investir pour les dividendes', p: 'Le calendrier, l’impôt, et ce que rapporte vraiment une action.', c: 'Découvrir l’atelier', u: 'atelier-investir-dividendes.html', i: 'theme-bourse-900.webp' },
    declic:     { k: 'Gratuit · dès 1 minute', t: 'Trouver mon idée de business, à partir de mon budget', p: 'Déclic vous propose des idées adaptées à votre budget, avec le premier pas et le piège à éviter.', c: 'Essayer Déclic', u: 'generateur-de-projet.html', i: 'theme-activite-900.webp' },
    retraite:   { k: 'Outil gratuit', t: 'Préparer ma retraite : où en êtes-vous ?', p: 'Ce qu’il vous manquera chaque mois, et combien mettre de côté.', c: 'Faire le calcul', u: 'preparer-ma-retraite.html', i: 'atelier-pilier-famille.webp' },
    elysee:     { k: 'Atelier accompagné', t: 'Un atelier avec Élysée Johnson', p: 'En petit groupe, sur votre situation : retraite, patrimoine, famille, entreprise.', c: 'Choisir mon atelier', u: 'ateliers-elysee.html', i: 'theme-placer-900.webp' },
    credit:     { k: 'Atelier', t: 'Ce que mon crédit coûte vraiment', p: 'Le taux, les frais, l’assurance : le vrai prix avant de signer.', c: 'Découvrir l’atelier', u: 'atelier-cout-reel-de-mon-credit.html', i: 'theme-credit-900.webp' },
    dettes:     { k: 'Atelier', t: 'Sortir de mes dettes', p: 'Faire la liste, choisir l’ordre, négocier : un plan qui tient.', c: 'Découvrir l’atelier', u: 'atelier-sortir-dettes.html', i: 'theme-credit-900.webp' },
    tontine:    { k: 'Atelier', t: 'Ma tontine devient un club d’investissement', p: 'Garder le groupe, et faire travailler l’argent ensemble à la Bourse.', c: 'Découvrir l’atelier', u: 'atelier-tontine-bourse.html', i: 'tontine-bourse-900.webp' },
    lot:        { k: 'Atelier gratuit', t: 'Acheter un lot sans se faire avoir', p: 'Les papiers à vérifier, dans l’ordre, avant de payer.', c: 'Découvrir l’atelier', u: 'atelier-acheter-un-lot.html', i: 'univers-terrain.webp' },
    placer:     { k: 'Atelier', t: 'Placer selon mon horizon', p: 'Un placement pour chaque projet, selon la date où vous en aurez besoin.', c: 'Découvrir l’atelier', u: 'atelier-placer-selon-horizon.html', i: 'theme-placer-900.webp' },
    question:   { k: 'Gratuit', t: 'Une question d’argent ? Posez-la', p: 'Nous vous montrons les contenus qui y répondent, et les ateliers pour aller au bout.', c: 'Poser ma question', u: 'question.html', i: 'theme-arnaques-900.webp' },
    activite:   { k: 'Atelier', t: 'Mon activité gagne-t-elle vraiment de l’argent ?', p: 'Séparer la caisse de la maison, et calculer ce qui reste vraiment.', c: 'Découvrir l’atelier', u: 'atelier-activite-gagne-t-elle.html', i: 'theme-activite-900.webp' }
  };
  var THEMES = {
    budget: ['budgetzero', 'outilbudget', 'diag', 'abo'], credit: ['dettes', 'credit', 'diag', 'abo'], bourse: ['coach', 'action', 'dividendes', 'abo'],
    placer: ['placer', 'elysee', 'abo'], famille: ['retraite', 'elysee', 'abo'], activite: ['declic', 'activite', 'abo'], terrain: ['lot', 'abo'],
    tontine: ['tontine', 'abo'], arnaques: ['question', 'diag'], defaut: ['diag', 'declic', 'abo', 'question']
  };
  var REG = [[/tontine|club|cotis/, 'tontine'], [/arnaque|escroquer|rendement-garanti|faux-conseiller|vente-en-reseau|avant-de-confier|crypto/, 'arnaques'],
    [/terrain|lot\b|chantier|immobilier|logement|construire/, 'terrain'], [/retraite|famille|enfant|deces|heritage|assurance|papiers|solidarite|cotiser/, 'famille'],
    [/activite|business|commerce|entreprise|declic|projet|salaire-fixe|lance|valoriser|dirigeant/, 'activite'],
    [/credit|dette|preter|pret|emprunt|surendettement|renegocier|microfinance/, 'credit'],
    [/bourse|brvm|action|dividende|sgi|societe|portefeuille|marche|ordre|frais-bourse/, 'bourse'],
    [/placement|placer|opcvm|fcpe|dat|tresor|obligation|liberte|epargner|reserve/, 'placer'],
    [/budget|depense|mobile-money|argent|consommer|engagements|poches/, 'budget']];
  function nz(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function themeDe(s) { s = nz(s); for (var i = 0; i < REG.length; i++) if (REG[i][0].test(s)) return REG[i][1]; return 'defaut'; }
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function abonne() { try { var o = JSON.parse(lire('efa_formule') || 'null'); return !!(o && o.fin && new Date() <= new Date(o.fin + 'T23:59:59')); } catch (e) { return false; } }
  function choisir(th) {
    var L = (THEMES[th] || THEMES.defaut).filter(function (id) { var a = P[id]; return a && a.u !== PAGE && !(id === 'abo' && abonne()); });
    if (!L.length) return null;
    var n = +(lire('efa_ann_tour') || 0); ecrire('efa_ann_tour', String(n + 1));
    return P[L[n % Math.min(L.length, 2)]];   /* on alterne entre les deux produits les plus proches du sujet */
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function compter(nom) { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'espace-efa-' + nom, title: 'Espace EFA', event: true }); } catch (e) {} }

  var CSS = '.ea-toast{position:fixed;left:max(12px,env(safe-area-inset-left,0px));right:max(12px,env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:9000;max-width:460px;margin:0 auto;background:#0B1220!important;border-radius:16px;box-shadow:0 18px 44px -10px rgba(11,18,32,.65);padding:14px 40px 16px 14px;display:flex;gap:12px;align-items:center;font-family:"Source Sans 3",system-ui,sans-serif;color:#E8EDF5!important;transform:translateY(140%);opacity:0;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .45s}'
    + '.ea-toast.on{transform:none;opacity:1}.ea-toast img{width:40px;height:40px;flex:0 0 40px;border-radius:10px}'
    + '.ea-toast p{margin:0;font-size:15px;line-height:1.35}.ea-toast b{display:block;color:#FFFFFF!important;font-family:"Libre Baskerville",Georgia,serif;font-size:15.5px;line-height:1.25}'
    + '.ea-toast a.ea-cta{display:inline-block;margin-top:8px;background:#DA3C1B!important;color:#fff!important;font-weight:800;font-size:14.5px;border-radius:8px;padding:8px 12px;text-decoration:none!important}.ea-toast .ea-k{color:#F09680!important}.ea-k{display:block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7A8293!important;margin-bottom:2px}'
    + '.ea-x{position:absolute;top:6px;right:6px;width:32px;height:32px;border:0;background:transparent!important;color:#C9D1DE!important;font-size:22px;line-height:1;cursor:pointer}'
    + '.ea-t{position:absolute;left:14px;right:14px;bottom:6px;height:3px;border-radius:9px;background:#1F2C45!important;overflow:hidden}.ea-t i{display:block;height:3px;width:100%;background:#6DB8F2!important;transform-origin:left;transition:transform 8s linear}'
    + '.ea-voile{position:fixed;inset:0;z-index:9500;background:rgba(6,12,22,.62)!important;display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-left,0px));opacity:0;transition:opacity .3s}.ea-voile.on{opacity:1}'
    + '.ea-int{position:relative;width:100%;max-width:420px;background:#0B1220!important;border-radius:20px;overflow:hidden;color:#E8EDF5!important;font-family:"Source Sans 3",system-ui,sans-serif;transform:translateY(18px);transition:transform .35s}.ea-voile.on .ea-int{transform:none}'
    + '.ea-int img{display:block;width:100%!important;height:190px!important;object-fit:cover}.ea-int .ea-b{padding:18px 20px 20px}'
    + '.ea-int .ea-k{color:#8E98AA!important}.ea-int h2{font-family:"Libre Baskerville",Georgia,serif;font-weight:700;font-size:22px;line-height:1.18;color:#fff!important;margin:6px 0 0}'
    + '.ea-int p{margin:8px 0 0;font-size:15.5px;color:#C9D1DE!important;line-height:1.45}.ea-acts{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}'
    + '.ea-go{background:#DA3C1B!important;color:#fff!important;font-weight:800;border-radius:10px;padding:12px 16px;text-decoration:none!important}'
    + '.ea-pass{position:absolute;top:10px;right:10px;border:0;border-radius:999px;background:rgba(11,18,32,.72)!important;color:#fff!important;font:700 13.5px "Source Sans 3",system-ui,sans-serif;padding:7px 12px;cursor:pointer}.ea-pass[disabled]{opacity:.75;cursor:default}'
    + '.ea-suite{border:0;background:#1F2C45!important;color:#fff!important;font:700 15px "Source Sans 3",system-ui,sans-serif;border-radius:10px;padding:12px 16px;cursor:pointer}'
    + '.ea-res{display:flex;gap:12px;align-items:center;background:#0B1220!important;border-radius:14px;padding:14px 16px;margin:18px 0 0;font-family:"Source Sans 3",system-ui,sans-serif;color:#C9D1DE!important;text-decoration:none!important}.ea-res .ea-k{color:#F09680!important}'
    + '.ea-res b{display:block;font-family:"Libre Baskerville",Georgia,serif;font-size:17px;color:#FFFFFF!important;line-height:1.25}.ea-res span.t{flex:1;font-size:15px;line-height:1.4}.ea-res .f{font-size:22px;font-weight:800;color:#F09680!important}'
    + '.ea-pub{display:block;margin-top:8px;font-size:12.5px;font-weight:700;color:#F09680!important;text-decoration:underline!important;text-underline-offset:3px}'
    + '.ea-pubb{display:block;background:#DA3C1B!important;color:#fff!important;text-align:center;font:800 14.5px "Source Sans 3",system-ui,sans-serif;padding:12px 14px;text-decoration:none!important}'
    + '.ea-pubr{display:block;margin:8px 0 0;background:#DA3C1B!important;color:#fff!important;border-radius:10px;text-align:center;font:800 14px "Source Sans 3",system-ui,sans-serif;padding:10px 12px;text-decoration:none!important}';
  function style() { if (document.getElementById('ea-css')) return; var s = document.createElement('style'); s.id = 'ea-css'; s.textContent = CSS; document.head.appendChild(s); }

  /* 1. L'éphémère */
  function ephemere() {
    if (window.ATELIER || SANS.test(PAGE) || OUTILS[PAGE] || document.querySelector('form input:not([type=hidden]):focus')) return;
    try { if (sessionStorage.getItem('efa_eph')) return; } catch (e) {}
    var a = choisir(themeDe(PAGE + ' ' + document.title)); if (!a) return;
    var vu = false;
    function montrer() {
      if (vu) return; vu = true; window.removeEventListener('scroll', surScroll);
      if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      try { sessionStorage.setItem('efa_eph', '1'); } catch (e) {}
      bulle(a, 'ephemere');
    }
    function surScroll() { var h = document.documentElement, p = (h.scrollTop + innerHeight) / h.scrollHeight; if (p >= 0.4 && h.scrollTop > 200) montrer(); }
    window.addEventListener('scroll', surScroll, { passive: true });
    if (document.documentElement.scrollHeight < innerHeight * 1.6) setTimeout(montrer, 20000);
  }

  function bulle(a, src) {
    style();
    var lab = a.lab || 'EFA vous propose';
    var d = document.createElement('aside'); d.className = 'ea-toast'; d.setAttribute('data-garde', ''); d.setAttribute('aria-label', lab);
    d.innerHTML = '<img src="' + esc(a.logo || 'clone/assets/efa-oiseau.png') + '" alt=""><p><span class="ea-k">' + esc(lab) + ' · ' + esc(a.k) + '</span><b>' + esc(a.t) + '</b><a class="ea-cta" href="' + esc(a.u) + '?src=' + src + '">' + esc(a.c) + '</a>' + (a.lab ? '' : '<a class="ea-pub" href="partenaires.html?src=ephemere#contact">' + 'Espace publicitaire · Intéressé ? Contactez-nous →' + '</a>') + '</p><button type="button" class="ea-x" aria-label="Fermer">×</button><span class="ea-t"><i></i></span>';
    document.body.appendChild(d);
    var tm, barre = d.querySelector('.ea-t i');
    function fermer() { clearTimeout(tm); d.classList.remove('on'); setTimeout(function () { d.remove(); }, 500); }
    function lancer() { barre.style.transition = 'transform 8s linear'; barre.style.transform = 'scaleX(0)'; tm = setTimeout(fermer, 8000); }
    function pause() { clearTimeout(tm); var w = getComputedStyle(barre).transform; barre.style.transition = 'none'; barre.style.transform = w; }
    d.querySelector('.ea-x').onclick = fermer;
    d.addEventListener('mouseenter', pause); d.addEventListener('touchstart', pause, { passive: true });
    d.querySelector('a.ea-cta').addEventListener('click', function () { compter(src + '-clic'); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); lancer(); }); });
    compter(src + '-vu');
  }

  /* 2. L'intercalaire entre deux chapitres d'un atelier */
  function intercalaire(idAtelier, th, suite, force) {
    var cle = 'efa_inter_' + idAtelier;
    if (!force && lire(cle)) return suite();
    var a = force || choisir(th || themeDe(idAtelier)); if (!a) return suite();
    if (!force) ecrire(cle, '1'); style();
    var lab = a.lab || 'EFA vous propose';
    var v = document.createElement('div'); v.className = 'ea-voile'; v.setAttribute('data-garde', ''); v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', lab);
    v.innerHTML = '<div class="ea-int"><img src="clone/assets/' + esc(a.i) + '" alt=""><button type="button" class="ea-pass" disabled>Passer dans 3</button><div class="ea-b"><span class="ea-k">' + esc(lab) + ' · ' + esc(a.k) + '</span><h2>' + esc(a.t) + '</h2><p>' + esc(a.p) + '</p><div class="ea-acts"><a class="ea-go" href="' + esc(a.u) + '?src=intercalaire" target="_blank" rel="noopener">' + esc(a.c) + '</a><button type="button" class="ea-suite">Continuer l’atelier</button></div></div>' + (a.lab ? '' : '<a class="ea-pubb" href="partenaires.html?src=intercalaire#contact" target="_blank" rel="noopener">' + 'Espace publicitaire · Intéressé ? Contactez-nous →' + '</a>') + '</div>';
    document.body.appendChild(v);
    var b = v.querySelector('.ea-pass'), n = 3;
    function fin() { v.classList.remove('on'); setTimeout(function () { v.remove(); }, 300); document.removeEventListener('keydown', esc2); suite(); }
    function esc2(e) { if (e.key === 'Escape' && !b.disabled) fin(); }
    var it = setInterval(function () { n--; if (n > 0) b.textContent = 'Passer dans ' + n; else { clearInterval(it); b.disabled = false; b.textContent = 'Passer ›'; } }, 1000);
    b.onclick = function () { if (!b.disabled) fin(); };
    v.querySelector('.ea-suite').onclick = function () { clearInterval(it); fin(); };
    v.querySelector('.ea-go').addEventListener('click', function () { compter('intercalaire-clic'); });
    document.addEventListener('keydown', esc2);
    requestAnimationFrame(function () { v.classList.add('on'); });
    compter('intercalaire-vu');
  }

  /* 3. Sous le résultat d'un outil : la suite logique */
  /* seulement des zones de résultat, jamais une zone de saisie */
  var OUTILS = { 'outil-budget.html': ['#resultat', 'budgetzero'], 'cout-total-credit.html': ['#c-out', 'credit'], 'valoriser-mon-entreprise.html': ['#res', 'activite'] };
  function resultat() {
    var o = OUTILS[PAGE]; if (!o) return;
    var a = P[o[1]]; if (!a || (o[1] === 'abo' && abonne())) return;
    var z = document.querySelector(o[0]); if (!z || !('IntersectionObserver' in window)) return;
    var fait = false;
    var io = new IntersectionObserver(function (E) {
      E.forEach(function (e) {
        if (fait || !e.isIntersecting || (z.textContent || '').trim().length < 60) return;
        fait = true; io.disconnect(); style();
        var c = document.createElement('a'); c.className = 'ea-res'; c.href = a.u + '?src=resultat'; c.setAttribute('data-garde', '');
        c.innerHTML = '<img src="clone/assets/efa-oiseau.png" alt="" width="36" height="36" style="width:36px;height:36px;flex:0 0 36px"><span class="t"><span class="ea-k">EFA vous propose · ' + esc(a.k) + '</span><b>' + esc(a.t) + '</b>' + esc(a.p) + '</span><span class="f">→</span>';
        c.addEventListener('click', function () { compter('resultat-clic'); });
        z.appendChild(c);
        var pb = document.createElement('a'); pb.className = 'ea-pubr'; pb.href = 'partenaires.html?src=resultat#contact'; pb.setAttribute('data-garde', ''); pb.textContent = 'Espace publicitaire · Intéressé ? Contactez-nous →'; z.appendChild(pb);
      });
    }, { threshold: 0.35 });
    io.observe(z);
  }

  window.EFA_ANNONCES = { intercalaire: intercalaire, bulle: bulle, themeDe: themeDe, produits: P,
    /* démonstration des formats (page Espaces partenaires) */
    demo: function (type, a) { if (type === 'intercalaire') intercalaire('demo', '', function () {}, a); else bulle(a, 'demo'); } };
  function demarrer() { ephemere(); resultat(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
