/* EFA · Clone · comportement des pages V1 recopiées dans /clone.
   Fichier généré par scripts/clone/habiller.py : modifier ce modèle puis relancer le script.
   - garde la navigation dans /clone : un lien vers une page V1 qui existe aussi dans /clone y reste ;
   - répare les ancres (#…) que la balise <base> ferait sinon partir vers l'accueil ;
   - menu et en-tête du Clone (ouverture, fermeture, passage en blanc au défilement). */
(function () {
  var PAGES = [];
  var connues = {};
  for (var i = 0; i < PAGES.length; i++) connues[PAGES[i]] = 1;
  var racine = new URL(document.baseURI).pathname.replace(/[^\/]*$/, '');

  function relatif(u) {
    if (u.origin !== location.origin || u.pathname.indexOf(racine) !== 0) return null;
    return u.pathname.slice(racine.length);
  }

  function corriger(a) {
    if (!a || a.hasAttribute('data-clone-ok')) return;
    var h = a.getAttribute('href');
    if (!h || /^(mailto:|tel:|javascript:|data:)/i.test(h)) return;
    if (h.charAt(0) === '#') {
      a.setAttribute('href', location.pathname + location.search + h);
      a.setAttribute('data-clone-ok', '');
      return;
    }
    var u;
    try { u = new URL(h, document.baseURI); } catch (e) { return; }
    var r = relatif(u);
    if (r === null) return;
    // depuis la bascule, les pages vivent à leur adresse : seul un ancien lien /clone/… est ramené à la racine
    if (r.indexOf('clone/') === 0 && /\.html$/.test(r)) a.setAttribute('href', racine + r.slice(6) + u.search + u.hash);
    else return;
    a.setAttribute('data-clone-ok', '');
  }

  function tout(n) {
    if (!n || !n.querySelectorAll) return;
    if (n.tagName === 'A') corriger(n);
    var l = n.querySelectorAll('a[href]');
    for (var i = 0; i < l.length; i++) corriger(l[i]);
  }

  // Un lien créé après coup est corrigé au moment du clic, avant la navigation.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a) corriger(a);
  }, true);

  /* Page publiée après le dernier passage de scripts/clone/habiller.py (par exemple une nouvelle EFA News) :
     efa-appli.js charge cet habillage et l'en-tête et le pied sont posés ici. */
  var ENTETE = "<header class=\"header clone-head\" id=\"clone-haut\"><div class=\"container head-inner\"><a class=\"efa-brand\" href=\"/\" aria-label=\"EFA — Accueil\"><img class=\"efa-brand__bird\" src=\"clone/assets/efa-oiseau.png\" width=\"48\" height=\"48\" alt=\"\"><span class=\"efa-brand__word\" aria-hidden=\"true\">efa<span class=\"efa-brand__dot\"></span></span></a><nav class=\"desktop-nav\" aria-label=\"Navigation principale\"><a href=\"index.html#benefices\">Apprendre</a><a href=\"index.html#pilier-progresser\">S’entraîner</a><a href=\"index.html#pilier-agir\">Se lancer</a><a href=\"index.html#pilier-media\">Le média</a><a href=\"index.html#etudes-prospective\">Études</a></nav><button class=\"menu-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"clone-menu\" aria-label=\"Ouvrir le menu\"><span></span><span></span></button></div><nav id=\"clone-menu\" class=\"menu-panel\" aria-label=\"Menu\"><a class=\"menu-cle\" href=\"point-de-depart.html\">Trouver mon point de départ <span>→</span></a><a href=\"index.html#benefices\">Apprendre <span>↗</span></a><a href=\"index.html#seul\">Apprendre seul <span>↗</span></a><a href=\"index.html#organisation\">Apprendre ensemble <span>↗</span></a><a href=\"index.html#outils\">Outils et simulateurs <span>↗</span></a><a href=\"index.html#pilier-progresser\">S’entraîner <span>↗</span></a><a href=\"index.html#pilier-progresser\">Choisir son atelier <span>↗</span></a><a href=\"index.html#pilier-agir\">Se lancer <span>↗</span></a><a href=\"index.html#marches\">Investir à la BRVM <span>↗</span></a><a href=\"index.html#pilier-media\">Le média <span>↗</span></a><a href=\"index.html#etudes-prospective\">Études et prospective <span>↗</span></a><a class=\"menu-cle\" href=\"organisations.html\">Former mon équipe ou ma communauté <span>↗</span></a><a href=\"methode.html#methode\">Notre méthode <span>↗</span></a><a href=\"index.html#contact\">Nous contacter <span>↗</span></a></nav></header>", PIED = "<footer class=\"efa-foot clone-foot\">\n  <div class=\"ef-in\">\n    <div class=\"ef-top\">\n      <div class=\"ef-brand\">\n        <a class=\"ef-logo\" href=\"index.html\"><img src=\"logo-efa-96.png\" alt=\"\" width=\"40\" height=\"40\"><span>Éducation Financière Afrique</span></a>\n        <p class=\"ef-mis\">EFA aide chacun à passer du <span class=\"mc\">cercle</span>, l’argent qui tourne, à la <span class=\"ms\">spirale</span>, l’argent qui reste.</p>\n        \n      </div>\n      <nav class=\"ef-cols ef-cols-5\" aria-label=\"Plan du site\">\n        <div><h2>Apprendre</h2><ul>\n          <li><a href=\"index.html#seul\">J’apprends seul</a></li>\n          <li><a href=\"index.html#organisation\">Nous apprenons ensemble</a></li>\n          <li><a href=\"index.html#ecoles\">École de la tontine et de la Bourse</a></li>\n          <li><a href=\"index.html#outils\">Outils et simulateurs</a></li>\n          <li><a href=\"diagnostic.html\">Faire le point</a></li>\n          <li><a href=\"app/\">L’appli EFA</a></li>\n        </ul></div>\n        <div><h2>S’entraîner</h2><ul>\n          <li><a href=\"index.html#pilier-progresser\">Choisir son atelier</a></li>\n          <li><a href=\"coaching.html\">Tous les ateliers</a></li>\n          <li><a href=\"index.html#certificats\">Certificats</a></li>\n          <li><a href=\"index.html#espaces\">Cadres, patrimoine, dirigeants</a></li>\n        </ul></div>\n        <div><h2>Se lancer</h2><ul>\n          <li><a href=\"index.html#marches\">Investir à la BRVM</a></li>\n          <li><a href=\"index.html#sgi\">Choisir sa SGI</a></li>\n          <li><a href=\"index.html#avant-de-signer\">Les questions à poser</a></li>\n          <li><a href=\"index.html#solutions\">D’autres acteurs, demain</a></li>\n        </ul></div>\n        <div><h2>Le média</h2><ul>\n          <li><a href=\"news.html\">EFA News</a></li>\n          <li><a href=\"tribunes.html\">Les tribunes</a></li>\n          <li><a href=\"index.html#etudes-prospective\">Études et prospective</a></li>\n          <li><a href=\"africa-2075-fondateur.html\">Africa 2075</a></li>\n        </ul></div>\n        <div><h2>EFA</h2><ul>\n          <li><a href=\"auteur.html#efa\">À propos</a></li>\n          <li><a href=\"organisations.html\">Pour les organisations</a></li>\n          <li><a href=\"rendez-vous.html\">Contact</a></li>\n          <li><a href=\"index.html#guide\">La lettre du mardi</a></li>\n          <li><a href=\"https://chat.whatsapp.com/Dm1l569bAwlAa1honQiV3a\" target=\"_blank\" rel=\"noopener\">EFA Community</a></li>\n        </ul>\n        <p class=\"ef-soc\"><a href=\"https://www.tiktok.com/@efa.afrique\" target=\"_blank\" rel=\"noopener\">TikTok</a> · <a href=\"https://www.facebook.com/share/19sTpHPsGP/\" target=\"_blank\" rel=\"noopener\">Facebook</a> · <a href=\"https://www.youtube.com/@efaeducationfinanciereafrique\" target=\"_blank\" rel=\"noopener\">YouTube</a> · <a href=\"https://educationfinanciereafrique.substack.com\" target=\"_blank\" rel=\"noopener\">Substack</a></p></div>\n      </nav>\n    </div>\n    <div class=\"ef-bot\">\n      <span>© 2026 Éducation Financière Afrique</span>\n      <span>Éducation financière, pas conseil en placement. Aucun produit financier à vendre.</span>\n      <a href=\"confidentialite.html\">Confidentialité</a>\n      <a href=\"mailto:newsletter@efa.africa\">newsletter@efa.africa</a>\n    </div>\n  </div>\n</footer>";
  function poserCoquille() {
    var R = document.documentElement;
    if (!R.hasAttribute('data-clone-auto') || document.getElementById('clone-haut') || !ENTETE) return;
    var vieux = document.querySelector('body > header.top, body > header:first-of-type');
    if (vieux) vieux.setAttribute('data-v1-cache', '');
    document.body.insertAdjacentHTML('afterbegin', ENTETE);
    var pieds = document.querySelectorAll('footer'), dernier = pieds[pieds.length - 1];
    if (vieux && PIED) {
      if (dernier && !dernier.closest('#clone-haut')) { dernier.setAttribute('data-v1-cache', ''); dernier.insertAdjacentHTML('afterend', PIED); }
      else document.body.insertAdjacentHTML('beforeend', PIED);
      R.setAttribute('data-clone-coquille', '');
    } else R.setAttribute('data-clone-plein', '');
  }
  function demarrer() {
    poserCoquille();
    tout(document.body);
    new MutationObserver(function (m) {
      for (var i = 0; i < m.length; i++)
        for (var j = 0; j < m[i].addedNodes.length; j++) tout(m[i].addedNodes[j]);
    }).observe(document.body, { childList: true, subtree: true });

    var tete = document.getElementById('clone-haut');
    var bouton = tete && tete.querySelector('.menu-toggle');
    var panneau = document.getElementById('clone-menu');
    function fermer() {
      if (!panneau) return;
      panneau.classList.remove('open');
      bouton.setAttribute('aria-expanded', 'false');
      bouton.setAttribute('aria-label', 'Ouvrir le menu');
    }
    if (bouton && panneau) {
      bouton.addEventListener('click', function () {
        var ouvert = panneau.classList.toggle('open');
        bouton.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
        bouton.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
      });
      panneau.addEventListener('click', function (e) { if (e.target.closest('a')) fermer(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
      document.addEventListener('click', function (e) { if (!tete.contains(e.target)) fermer(); });
    }
    if (tete) {
      var maj = function () { tete.classList.toggle('scrolled', window.scrollY > 24); };
      window.addEventListener('scroll', maj, { passive: true });
      maj();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();

  /* ---------------- Premium : titre en deux tons et visuel d'ouverture ----------------
     Le titre principal passe en deux tons comme sur l'accueil du Clone (la seconde partie en bleu canard),
     et les pages clés reçoivent une photo du Clone à droite du titre. */
  function titrePrincipal() {
    var l = document.querySelectorAll('h1');
    for (var i = 0; i < l.length; i++) if (l[i].offsetHeight && !l[i].closest('#clone-haut,[data-v1-cache]')) return l[i];
    return null;
  }
  function deuxTons(h) {
    if (!h || h.hasAttribute('data-deux-tons')) return;
    for (var n = h.firstChild; n; n = n.nextSibling) if (n.nodeType !== 3) return; // texte seul
    var t = h.textContent, m = t.match(/^(.{6,}(?:\u00a0:|\s:|\.|,))\s+(.{6,})$/); // dernière coupure : accent court
    if (!m) return;
    h.textContent = '';
    h.appendChild(document.createTextNode(m[1] + ' '));
    var sp = document.createElement('span'); sp.className = 'clone-accent'; sp.textContent = m[2];
    h.appendChild(sp); h.setAttribute('data-deux-tons', '');
  }
  function visuel(h) {
    var src = document.documentElement.getAttribute('data-clone-visuel');
    if (!h || !src || document.querySelector('.clone-visuel')) return;
    // le conteneur du bandeau : premier ancêtre assez large pour deux colonnes
    var chemin = h, hote = h.parentElement, large = window.innerWidth >= 900;
    for (var k = 0; large && k < 4 && hote && hote !== document.body; k++) {
      if (hote.offsetWidth >= 980 || k === 3) break;
      chemin = hote; hote = hote.parentElement;
    }
    if (!hote || (large && hote.offsetWidth < 720)) return;
    var f = document.createElement('figure'); f.className = 'clone-visuel'; f.setAttribute('aria-hidden', 'true');
    var im = document.createElement('img'); im.src = racine + src; im.alt = ''; im.decoding = 'async';
    f.appendChild(im);
    var apres = chemin === h && h.nextElementSibling && /\blead\b/.test(h.nextElementSibling.className) ? h.nextElementSibling : chemin;
    apres.parentNode.insertBefore(f, apres.nextSibling);
    hote.classList.add('clone-hero-grille');
  }
  function premium() {
    var h = titrePrincipal();
    deuxTons(h); visuel(h);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', premium);
  else premium();

  /* ---------------- Blanc et bleu : conversion des fonds sombres ----------------
     Aucun fond noir ni bleu nuit : chaque surface sombre devient claire (bleu très pâle ou blanc),
     puis chaque texte devenu illisible est recoloré (encre, bleu, corail, vert ou ocre selon sa teinte). */
  function rgb(c) {
    var m = c && c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  /* « Sombre » = noir ou bleu nuit. Les aplats vifs de la charte (corail, bleu) restent tels quels. */
  function nuit(c) {
    if (!c) return false;
    var mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b), sat = mx ? (mx - mn) / mx : 0, L = lum(c);
    var chaud = c.r > c.b + 20; // corail, rouge, orange, ocre : jamais assombris ni éclaircis
    return !chaud && (L < .06 || (L < .2 && sat < .55));
  }
  function lum(c) {
    var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b);
  }
  function contraste(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
  function teinte(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d < .12) return -1;
    if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h *= 60; return h < 0 ? h + 360 : h;
  }
  function gradientSombre(img) {
    if (!img || img === 'none' || /url\(/.test(img)) return false;
    var l = img.match(/rgba?\([^)]+\)/g) || [], n = 0, s = 0;
    for (var i = 0; i < l.length; i++) { var c = rgb(l[i]); if (c && c.a > .3) { n++; if (nuit(c)) s++; } }
    return n > 0 && s / n >= .5;
  }
  var EXCLU = /^(IMG|SVG|VIDEO|CANVAS|SCRIPT|STYLE|PICTURE|IFRAME|svg|path|g|circle|rect|line|polyline|polygon|text|tspan|defs|use)$/;
  function hors(el) { return el.closest && el.closest('#clone-haut,.clone-foot,[data-v1-cache]'); }
  function fondEffectif(el) {
    while (el && el.nodeType === 1) {
      if (el.hasAttribute('data-clair-photo')) return { r: 7, g: 12, b: 22, a: 1 };
      var cs0 = getComputedStyle(el);
      if (/url\(/.test(cs0.backgroundImage) || gradientSombre(cs0.backgroundImage)) return { r: 7, g: 12, b: 22, a: 1 };
      var c = rgb(cs0.backgroundColor);
      if (c && c.a > .5) return c;
      el = el.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }
  var surCarte = function (el) { return el.parentElement && el.parentElement.closest('[data-clair]'); };

  function eclaircir(el) {
    if (EXCLU.test(el.tagName) || el.hasAttribute('data-clair') || hors(el)) return;
    var cs = getComputedStyle(el);
    if (/url\(/.test(cs.backgroundImage)) return; // photo de fond : on garde
    var c = rgb(cs.backgroundColor), sombre = (c && c.a > .35 && nuit(c)) || gradientSombre(cs.backgroundImage);
    /* Crème et beige de l'ancienne charte (#F5EFE2, #FFFDF8…) : bleu très pâle ou blanc */
    if (!sombre && c && c.a > .5 && lum(c) > .62 && c.r - c.b > 6 && c.r >= c.g && !el.hasAttribute('data-clair')) {
      var dansSurface = el.parentElement && el.parentElement.closest('[data-clair="creme"]');
      el.style.setProperty('background-color', dansSurface ? '#ffffff' : '#f3f7fb', 'important');
      var bd = rgb(cs.borderTopColor);
      if (bd && parseFloat(cs.borderTopWidth) > 0 && bd.r - bd.b > 6) el.style.setProperty('border-color', '#dbe6f0', 'important');
      el.setAttribute('data-clair', 'creme');
      return;
    }
    if (!sombre) return;
    // bandeau photo ou vidéo (Min'Fin…) : l'image reste, le texte reste blanc
    for (var k = el.firstElementChild; k; k = k.nextElementSibling) {
      var ks = getComputedStyle(k);
      if (ks.position === 'absolute' && (/url\(/.test(ks.backgroundImage) || /^(IMG|VIDEO|PICTURE)$/.test(k.tagName))) {
        el.setAttribute('data-clair-photo', '');
        el.style.setProperty('background-color', '#0a4f92', 'important');
        return;
      }
    }
    var bouton = el.tagName === 'A' || el.tagName === 'BUTTON' || /\b(btn|bouton|cta|chip|pill|tag)\b/.test(el.className || '');
    if (bouton && el.offsetHeight < 90) {
      var fp = el.parentElement ? fondEffectif(el.parentElement) : null;
      if (fp && fp.r > fp.b + 20 && lum(fp) < .35) {
        // bouton sombre posé sur un aplat corail : contour blanc, texte blanc
        el.style.setProperty('background-color', 'transparent', 'important');
        el.style.setProperty('background-image', 'none', 'important');
        el.style.setProperty('border', '1.5px solid rgba(255,255,255,.75)', 'important');
        el.style.setProperty('color', '#fff', 'important');
        el.setAttribute('data-clair', 'bouton');
        return;
      }
      el.style.setProperty('background-color', '#0b63b0', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('border-color', '#0b63b0', 'important');
      el.style.setProperty('color', '#fff', 'important');
      el.setAttribute('data-clair', 'bouton');
      return;
    }
    if (el.parentElement && el.parentElement.closest('[data-clair="bouton"]')) {
      // pastille sombre dans un bouton devenu bleu : pastille blanche, texte bleu
      el.style.setProperty('background-color', '#ffffff', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('border-color', '#ffffff', 'important');
      el.style.setProperty('color', '#0b63b0', 'important');
      el.setAttribute('data-clair', 'pastille');
      return;
    }
    var bleute = c && c.b > c.r + 8;
    var fond = surCarte(el) ? '#ffffff' : (bleute ? '#eef5fc' : '#f4f6f9');
    el.style.setProperty('background-color', fond, 'important');
    el.style.setProperty('background-image', 'none', 'important');
    if (rgb(cs.borderTopColor) && lum(rgb(cs.borderTopColor)) < .2 && parseFloat(cs.borderTopWidth) > 0)
      el.style.setProperty('border-color', '#dbe6f0', 'important');
    el.setAttribute('data-clair', '');
    if (fond === '#ffffff') el.setAttribute('data-clair-carte', '');
  }
  /* Filets beiges de l'ancienne charte (#E2D8C4, #D9CDB5…) : filet bleu-gris */
  function filet(el, cs) {
    var b = rgb(cs.borderTopColor);
    if (b && b.a > .3 && parseFloat(cs.borderTopWidth) > 0 && b.r - b.b > 12 && b.r >= b.g && lum(b) > .45 && lum(b) < .9)
      el.style.setProperty('border-color', '#dbe6f0', 'important');
    var sh = cs.boxShadow;
    if (sh && sh !== 'none' && /rgb\(2[0-5]\d, 2[0-2]\d, 1[6-9]\d\)/.test(sh)) el.style.setProperty('box-shadow', 'none', 'important');
  }
  function recolorer(el) {
    if (!EXCLU.test(el.tagName) && !hors(el)) filet(el, getComputedStyle(el));
    if (EXCLU.test(el.tagName) || hors(el) || el.getAttribute('data-clair') === 'bouton') return;
    var a = false;
    for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) { a = true; break; }
    var cs = getComputedStyle(el);
    if (!a && !/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
      // bordures claires sur fond désormais clair
      var b = rgb(cs.borderTopColor);
      if (b && b.a > .2 && parseFloat(cs.borderTopWidth) > 0 && lum(b) > .75 && el.hasAttribute('data-clair'))
        el.style.setProperty('border-color', '#dbe6f0', 'important');
      return;
    }
    var t = rgb(cs.color); if (!t) return;
    var f = fondEffectif(el);
    var proche = el.closest('[data-clair="bouton"],[data-clair="pastille"]');
    if (proche && proche !== el) {
      if (contraste(t, f) < 3.2) el.style.setProperty('color', proche.getAttribute('data-clair') === 'bouton' ? '#ffffff' : '#0b63b0', 'important');
      return;
    }
    if (el.getAttribute('data-clair') === 'pastille') return;
    if (lum(f) < .2) return; // fond resté sombre (photo, vidéo) : on ne touche pas
    if (contraste(t, f) >= 3.2) return;
    var h = teinte(t), nc;
    if (h < 0) nc = /^H[1-3]$/.test(el.tagName) ? '#071d38' : (lum(t) > .6 ? '#142438' : '#536174');
    else if (h >= 180 && h < 260) nc = '#0b63b0';
    else if (h < 25 || h >= 330) nc = '#d2452f';
    else if (h >= 80 && h < 180) nc = '#1e7a4c';
    else if (h >= 25 && h < 80) nc = '#9a6b00';
    else nc = '#5b3aa8';
    // sur un fond coloré (bleu moyen…), on garde la meilleure des trois : teinte, blanc ou encre
    var cands = [nc, '#ffffff', '#071d38'], meilleur = nc, kmax = 0;
    for (var q = 0; q < cands.length; q++) {
      var kk = contraste(rgb('rgb(' + parseInt(cands[q].slice(1, 3), 16) + ',' + parseInt(cands[q].slice(3, 5), 16) + ',' + parseInt(cands[q].slice(5, 7), 16) + ')'), f);
      if (q === 0 && kk >= 4.5) { kmax = 99; break; }
      if (kk > kmax) { kmax = kk; meilleur = cands[q]; }
    }
    nc = meilleur;
    el.style.setProperty('color', nc, 'important');
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
      var fb = rgb(cs.backgroundColor);
      if (fb && fb.a > .2 && lum(fb) < .3) el.style.setProperty('background-color', '#fff', 'important');
    }
  }
  function convertir(racineEl) {
    if (!racineEl || racineEl.nodeType !== 1) return;
    var l = [racineEl].concat([].slice.call(racineEl.querySelectorAll('*')));
    for (var i = 0; i < l.length; i++) eclaircir(l[i]);
    for (var j = 0; j < l.length; j++) recolorer(l[j]);
  }
  var attente = null, cibles = [];
  function plus_tard(n) {
    cibles.push(n);
    if (attente) return;
    attente = setTimeout(function () {
      attente = null;
      var c = cibles; cibles = [];
      for (var i = 0; i < c.length; i++) if (c[i].isConnected) convertir(c[i]);
    }, 60);
  }
  var lance = false;
  function blancEtBleu() {
    if (lance) return; lance = true;
    try { convertir(document.body); } catch (e) {}
    document.documentElement.setAttribute('data-clair-pret', '');
    new MutationObserver(function (m) {
      for (var i = 0; i < m.length; i++) {
        if (m[i].type === 'attributes') { var el = m[i].target; el.removeAttribute('data-clair'); plus_tard(el); }
        else for (var j = 0; j < m[i].addedNodes.length; j++) { var n = m[i].addedNodes[j]; if (n.nodeType === 1) plus_tard(n); else if (n.parentElement) plus_tard(n.parentElement); }
      }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
  }
  /* Conversion dès que la page est lue : les couleurs ne dépendent pas des images.
     Le contenu ajouté ensuite par les scripts de la page est converti au fil de l'eau. */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', blancEtBleu);
  else blancEtBleu();
})();
