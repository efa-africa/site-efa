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
  var ENTETE = "<header class=\"header clone-head\" id=\"clone-haut\"><div class=\"container head-inner\"><a class=\"efa-brand\" href=\"/\" aria-label=\"EFA — Accueil\"><img class=\"efa-brand__bird\" src=\"clone/assets/efa-oiseau.png\" width=\"48\" height=\"48\" alt=\"\"><span class=\"efa-brand__word\" aria-hidden=\"true\">efa<span class=\"efa-brand__dot\"></span></span></a><nav class=\"desktop-nav\" aria-label=\"Navigation principale\"><a href=\"index.html#benefices\">Apprendre et former</a><a href=\"index.html#pilier-progresser\">Être coaché</a><a href=\"index.html#pilier-agir\">Se lancer</a><a href=\"news.html\">EFA News</a><a href=\"etudes-prospective.html\">Études et prospective</a><a href=\"auteur.html#auteur\">À propos</a></nav><button class=\"menu-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"clone-menu\" aria-label=\"Ouvrir le menu\"><span></span><span></span></button></div><nav id=\"clone-menu\" class=\"menu-panel\" aria-label=\"Menu\"><a href=\"index.html#benefices\">Apprendre et former <span>↗</span></a><a class=\"menu-sous\" href=\"outils.html\">Outils et simulateurs <span>↗</span></a><a href=\"index.html#pilier-progresser\">Être coaché <span>↗</span></a><a href=\"index.html#pilier-agir\">Se lancer <span>↗</span></a><a class=\"menu-sous\" href=\"marches.html\">Marchés : la Bourse du jour <span>↗</span></a><a href=\"news.html\">EFA News <span>↗</span></a><a class=\"menu-sous\" href=\"decryptage.html\">Décryptage <span>↗</span></a><a href=\"etudes-prospective.html\">Études et prospective <span>↗</span></a><a href=\"auteur.html#auteur\">À propos <span>↗</span></a><a class=\"menu-cle\" href=\"organisations.html\">Pour les organisations <span>↗</span></a><a href=\"rendez-vous.html#contact\">Nous contacter <span>↗</span></a></nav></header>", PIED = "<section class=\"efa-pourvous\" data-garde aria-label=\"C’est fait pour vous\" style=\"background:#EEF5FC;padding:44px 20px;text-align:center;font-family:'Source Sans 3',system-ui,sans-serif\"><p style=\"margin:0;font:700 clamp(30px,4.4vw,46px)/1.12 'Libre Baskerville',Georgia,serif;color:#0B1220\">C’est fait pour vous.</p><p style=\"margin:8px 0 0;font:400 clamp(18px,2vw,22px)/1.4 'Libre Baskerville',Georgia,serif;font-style:italic;color:#1B71B2\">La finance, avec nos réalités africaines.</p><p style=\"margin:20px auto 0;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:820px\"><span style=\"background:#fff;border-radius:999px;padding:8px 16px;font-weight:700;font-size:15.5px;color:#0B1220\">C’est pensé pour nous</span><span style=\"background:#fff;border-radius:999px;padding:8px 16px;font-weight:700;font-size:15.5px;color:#0B1220\">On commence dès 1 min</span><span style=\"background:#fff;border-radius:999px;padding:8px 16px;font-weight:700;font-size:15.5px;color:#0B1220\">On n’est pas seul</span><span style=\"background:#fff;border-radius:999px;padding:8px 16px;font-weight:700;font-size:15.5px;color:#0B1220\">Tout au même endroit</span></p></section>\n<footer class=\"efa-foot clone-foot\">\n  <div class=\"ef-in\">\n    <div class=\"ef-top\">\n      <div class=\"ef-brand\">\n        <a class=\"ef-logo\" href=\"index.html\"><img src=\"logo-efa-96.png\" alt=\"\" width=\"40\" height=\"40\"><span>Éducation Financière Afrique</span></a>\n        <p class=\"ef-mis\">EFA aide chacun à passer du <span class=\"mc\">cercle</span>, l’argent qui tourne, à la <span class=\"ms\">spirale</span>, l’argent qui reste.</p>\n        \n      </div>\n      <nav class=\"ef-cols ef-cols-5\" aria-label=\"Plan du site\">\n        <div><h2><a class=\"ef-h\" href=\"index.html#benefices\">Apprendre</a></h2><ul>\n          <li><a href=\"index.html#seul\">J’apprends seul</a></li>\n          <li><a href=\"index.html#organisation\">Nous apprenons ensemble</a></li>\n          <li><a href=\"musee.html\">Le musée de l’économie</a></li>\n          <li><a href=\"outils.html\">Outils et simulateurs</a></li>\n          <li><a href=\"diagnostic.html\">Faire le point</a></li>\n          <li><a href=\"app/\">L’appli EFA</a></li>\n        </ul></div>\n        <div><h2><a class=\"ef-h\" href=\"index.html#pilier-progresser\">Être coaché</a></h2><ul>\n          <li><a href=\"index.html#pilier-progresser\">Choisir son atelier</a></li>\n          <li><a href=\"coaching.html\">Tous les ateliers</a></li>\n          <li><a href=\"index.html#certificats\">Certificats</a></li>\n          <li><a href=\"index.html#espaces\">Cadres, patrimoine, dirigeants</a></li>\n        </ul></div>\n        <div><h2><a class=\"ef-h\" href=\"index.html#pilier-agir\">Se lancer</a></h2><ul>\n          <li><a href=\"index.html#marches\">Investir à la Bourse (BRVM)</a></li>\n          <li><a href=\"marches.html\">Marchés : la Bourse du jour</a></li><li><a href=\"sgi.html\">Choisir sa SGI</a></li>\n          <li><a href=\"index.html#avant-de-signer\">Les questions à poser</a></li>\n          <li><a href=\"index.html#solutions\">D’autres acteurs, demain</a></li>\n        </ul></div>\n        <div><h2><a class=\"ef-h\" href=\"news.html\">Le média</a></h2><ul>\n          <li><a href=\"news.html\">EFA News</a></li>\n          <li><a href=\"decryptage.html\">Décryptage</a></li>\n          <li><a href=\"tribunes.html\">La tribune d’Élysée Johnson</a></li>\n          <li><a href=\"index.html#etudes-prospective\">Études et prospective</a></li>\n          <li><a href=\"africa-2075-fondateur.html\">Africa 2075</a></li>\n        </ul></div>\n        <div><h2><a class=\"ef-h\" href=\"auteur.html#auteur\">EFA</a></h2><ul>\n          <li><a href=\"auteur.html#auteur\">EFA et son fondateur</a></li>\n          <li><a href=\"organisations.html\">Pour les organisations</a></li>\n          <li><a href=\"rendez-vous.html\">Contact</a></li>\n          <li><a href=\"index.html#guide\">La lettre du mardi</a></li>\n          <li><a href=\"https://chat.whatsapp.com/Dm1l569bAwlAa1honQiV3a\" target=\"_blank\" rel=\"noopener\">EFA Community</a></li>\n        </ul>\n        <p class=\"ef-soc\"><a href=\"https://www.tiktok.com/@efa.afrique\" target=\"_blank\" rel=\"noopener\">TikTok</a> · <a href=\"https://www.facebook.com/share/19sTpHPsGP/\" target=\"_blank\" rel=\"noopener\">Facebook</a> · <a href=\"https://www.youtube.com/@efaeducationfinanciereafrique\" target=\"_blank\" rel=\"noopener\">YouTube</a> · <a href=\"https://educationfinanciereafrique.substack.com\" target=\"_blank\" rel=\"noopener\">Substack</a></p></div>\n      </nav>\n    </div>\n    <div class=\"ef-bot\">\n      <span>© 2026 Éducation Financière Afrique</span>\n      <span>Éducation financière, pas conseil en placement. Aucun produit financier à vendre.</span>\n      <a href=\"confidentialite.html\">Confidentialité</a>\n      <a href=\"mailto:newsletter@efa.africa\">newsletter@efa.africa</a>\n    </div>\n  </div>\n</footer>";
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
  function hors(el) { return el.closest && el.closest('#clone-haut,.clone-foot,[data-v1-cache],#musee,[data-photo],[data-garde]'); }
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

  /* ---------------- Articles : sommaire, barre de lecture, chiffres mis en valeur ---------------- */
  function articles() {
    var art = document.querySelector('article'); if (!art || art.closest('#clone-haut,.clone-foot')) return;
    // chiffres dans le texte : un nombre suivi d'une unité, dans un passage en gras
    var UNITE = /\d[\d\s  .,]*\s?(%|FCFA|F\b|Md|milliard|million|\$|€|ans\b|mois\b|jours?\b|fois\b|x\b|×)/i;
    art.querySelectorAll('p strong, p b, li strong, li b').forEach(function (e) {
      if (e.closest('.chiffres,.retenir,.reponse,.verif,.vc,.encadre,.box,[data-clair]')) return;
      if (UNITE.test(e.textContent) && e.textContent.length < 60) e.classList.add('a-num');
    });
    // sommaire : les sections titrées (surtitre .bk + h2), s'il n'y en a pas déjà un
    if (!document.querySelector('.toc,.a75-som,.a-som')) {
      var secs = [].slice.call(art.querySelectorAll('section[id]')).filter(function (x) { return x.querySelector('h2') && !/^(sources|liees|qui)$/.test(x.id); });
      if (secs.length >= 3) {
        var nav = document.createElement('nav'); nav.className = 'a-som'; nav.setAttribute('aria-label', 'Sommaire');
        nav.innerHTML = '<span>Dans cet article</span>' + secs.slice(0, 8).map(function (x, k) {
          var bk = x.querySelector('.bk'), t = (bk && bk.textContent.trim()) || x.querySelector('h2').textContent.trim();
          return '<a href="#' + x.id + '"><i>' + (k + 1) + '</i>' + t.replace(/\s+/g, ' ').slice(0, 38) + '</a>';
        }).join('');
        var avant = secs[0];
        avant.parentNode.insertBefore(nav, avant);
      }
    }
    // barre de lecture
    if (!document.querySelector('.a75-lecture,.a-lecture') && art.offsetHeight > innerHeight * 1.6) {
      var b = document.createElement('div'); b.className = 'a-lecture'; b.setAttribute('aria-hidden', 'true'); b.innerHTML = '<i></i>';
      document.body.appendChild(b);
      var i = b.firstChild;
      var maj = function () { var r = art.getBoundingClientRect(), h = r.height - innerHeight; i.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, Math.max(0, -r.top / h)) : 0) + ')'; };
      addEventListener('scroll', maj, { passive: true }); maj();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', articles); else articles();
})();

/* Signature du fondateur sur les pages où sa voix compte (tribunes, méthode, école, cercle et spirale) */
(function () {
  var P = /(?:^|\/)(methode|parcours|cercle-spirale)(?:\.html)?$/;
  function signer() {
    if (!P.test(location.pathname.replace(/\/$/, '')) || document.querySelector('.efa-sig')) return;
    var h = [].slice.call(document.querySelectorAll('main h1, #contenu h1, h1')).filter(function (x) { return x.offsetHeight && !x.closest('header,#clone-haut,[data-v1-cache],.ec-fab'); })[0];
    if (!h) return;
    var apres = h, n = h.nextElementSibling;
    if (n && n.tagName === 'P') apres = n;
    var d = document.createElement('p'); d.className = 'efa-sig';
    d.innerHTML = '<a href="auteur.html#auteur"><img src="clone/assets/elysee-portrait.jpg" alt="" width="34" height="34" loading="lazy">Une idée d’Élysée Johnson, fondateur d’EFA</a>';
    apres.insertAdjacentElement('afterend', d);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(signer, 50); }); else setTimeout(signer, 50);
})();

/* EFA · Tout objet qui mène quelque part est cliquable en entier (31/10/2026).
   Une carte (image + titre + texte) qui ne contient qu'un seul lien : un clic n'importe où sur la carte suit ce lien.
   Les cartes avec plusieurs liens, un bouton, une case ou un formulaire ne sont pas touchées. */
(function () {
  if (window.__efaCartes) return; window.__efaCartes = 1;
  var CARTES = 'article,.a-door,[class*="card"],[class*="carte"],.res,.produit,.pv-carte,.ac-acteur,.ac-fiche,.ac-atelier,.aef-atelier,.vt-bloc,.fondateur,.lieu2,.porte-corps .res,.mef-news,.etape,.tuile,[class*="tile"]';
  var INTER = 'a[href],button,input,select,textarea,label,summary,details,form,[role=button],[contenteditable],video,audio,iframe,dialog';
  function lien(c) {
    if (!c || c.closest('a[href]') || c.querySelector('button,input,select,textarea,form,summary,dialog')) return null;
    var L = [].slice.call(c.querySelectorAll('a[href]')).filter(function (a) { return a.offsetParent !== null || a.getClientRects().length; });
    var h = {}; L.forEach(function (a) { h[a.href] = a; });
    var k = Object.keys(h); return k.length === 1 ? h[k[0]] : null;
  }
  function carte(el) { var c = el.closest && el.closest(CARTES); while (c) { if (lien(c)) return c; var p = c.parentElement && c.parentElement.closest(CARTES); c = p; } return null; }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.target.closest(INTER)) return;
    var s = window.getSelection && String(window.getSelection()); if (s && s.length > 2) return;
    var c = carte(e.target); if (!c) return;
    var a = lien(c); if (!a) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey) { window.open(a.href, '_blank', 'noopener'); return; }
    a.click();
  });
  /* Quand un bloc s'ouvre (détails, liste dépliée), on fait défiler pour que la suite soit visible */
  document.addEventListener('toggle', function (e) {
    var d = e.target; if (!d || d.tagName !== 'DETAILS' || !d.open) return;
    setTimeout(function () {
      var sm = d.querySelector('summary'), r = d.getBoundingClientRect(), hd = document.querySelector('header'), hh = hd && getComputedStyle(hd).position !== 'static' ? hd.offsetHeight : 0;
      var bas = sm ? sm.getBoundingClientRect().bottom : r.top;
      if (bas > innerHeight * 0.62 || r.top < hh) scrollTo({ top: scrollY + (bas > innerHeight * 0.62 && sm ? sm.getBoundingClientRect().bottom - innerHeight * 0.35 : r.top - hh - 16), behavior: 'smooth' });
    }, 60);
  }, true);
  function marquer() { document.querySelectorAll(CARTES).forEach(function (c) { if (!c.classList.contains('efa-clic') && lien(c)) c.classList.add('efa-clic'); }); }
  var st = document.createElement('style'); st.textContent = '.efa-clic{cursor:pointer}.efa-clic:hover a[href]{text-decoration-thickness:2px}'; document.head.appendChild(st);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', marquer); else marquer();
  setTimeout(marquer, 1500);
  if ('MutationObserver' in window) { var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(marquer, 200); }).observe(document.documentElement, { childList: true, subtree: true }); }
})();

/* EFA · Bandeau « Promotion d'ouverture » sur toutes les pages (sous l'en-tête). */
(function () {
  if (window.__efaPromo) return; window.__efaPromo = 1;
  function poser() {
    if (document.querySelector('.efa-promo')) return;
    try { if (sessionStorage.getItem('efa_promo_ferme')) return; } catch (e) {}
    var h = document.getElementById('clone-haut') || document.getElementById('haut') || document.querySelector('body > header');
    if (!h) return;
    var st = document.createElement('style');
    st.textContent = '.efa-promo{position:relative;z-index:4;background:#F5EFE2;font-family:"Source Sans 3","Source Sans Pro",system-ui,sans-serif;color:#0B1220}'
      + '.efa-promo::before{content:"";display:block;height:4px;background:linear-gradient(90deg,#E44828 0 33.3%,#F2B84B 33.3% 66.6%,#3CCB7F 66.6%)}'
      + '.efa-promo-in{max-width:1180px;margin:0 auto;padding:9px max(16px,env(safe-area-inset-left,0px));display:flex;align-items:center;gap:10px;flex-wrap:wrap}'
      + '.efa-promo .p-r,.efa-promo .p-j{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:4px 10px}'
      + '.efa-promo .p-r{background:#E44828;color:#fff}.efa-promo .p-j{background:#F2B84B;color:#0B1220}'
      + '.efa-promo .p-t{font-size:15px;font-weight:600;flex:1 1 220px}'
      + '.efa-promo .p-v{display:inline-block;background:#1E8E57;color:#fff;font-size:14px;font-weight:800;border-radius:8px;padding:8px 14px;text-decoration:none;white-space:nowrap}'
      + '.efa-promo .p-v:hover{background:#17764A}'
      + '.efa-promo .p-x{all:unset;cursor:pointer;font-size:20px;line-height:1;color:#4E5566;padding:4px 6px}'
      + '.efa-promo .p-court{display:none}'
      + '@media(max-width:620px){.efa-promo .p-long{display:none}.efa-promo .p-court{display:inline}.efa-promo .p-r{order:1}.efa-promo .p-j{order:2}.efa-promo .p-x{order:3;margin-left:auto}.efa-promo .p-t{font-size:14px;flex:1 1 55%;order:4}.efa-promo .p-v{order:5;padding:7px 11px;font-size:13px}.efa-promo-in{gap:6px 8px;padding-top:7px;padding-bottom:9px}.efa-promo .p-r,.efa-promo .p-j{font-size:10px;padding:3px 8px}}';
    document.head.appendChild(st);
    var surCoaching = /\/coaching(\.html)?$/.test(location.pathname);
    var b = document.createElement('div'); b.className = 'efa-promo'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Promotion d’ouverture');
    b.innerHTML = '<div class="efa-promo-in"><span class="p-r">Promotion</span><span class="p-j">Ouverture</span>'
      + '<span class="p-t"><span class="p-long">Promotion d’ouverture : grattez votre carte chaque jour, et recevez 3 crédits offerts avec votre email.</span><span class="p-court">Une carte à gratter par jour</span></span>'
      + '<a class="p-v" href="' + (surCoaching ? '#gratter' : 'coaching.html#gratter') + '" data-goatcounter-click="promo-bandeau">Gratter ma carte →</a>'
      + '<button class="p-x" type="button" aria-label="Fermer le bandeau">×</button></div>';
    var fil = document.getElementById('fil'), main = document.querySelector('main');
    if (fil && fil.nextElementSibling) { var apres = fil.nextElementSibling; apres.parentNode.insertBefore(b, apres.nextSibling); }
    else if (getComputedStyle(h).position === 'fixed' && main) main.insertBefore(b, main.firstChild);
    else h.parentNode.insertBefore(b, h.nextSibling);
    b.querySelector('.p-x').addEventListener('click', function () { b.remove(); try { sessionStorage.setItem('efa_promo_ferme', '1'); } catch (e) {} });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poser); else poser();
})();

/* EFA · Portefeuille de crédits dans l'en-tête (solde de la phase de test). */
(function () {
  if (window.__efaPorte) return; window.__efaPorte = 1;
  function solde() {
    var e = {}, m = '';
    try { e = JSON.parse(localStorage.getItem('efa_ateliers_v1') || '{}') || {}; m = localStorage.getItem('efa_email_v1') || ''; } catch (x) {}
    if (!(e.mail || m)) return null;
    return Math.max(0, 3 + (e.jeu || 0) + (e.bonus || 0) - (e.dep10 || 0));
  }
  function poser() {
    var h = document.getElementById('clone-haut') || document.getElementById('haut'); if (!h) return;
    var tg = h.querySelector('.menu-toggle'), inn = h.querySelector('.head-inner'); if (!inn) return;
    var st = document.createElement('style');
    st.textContent = '.efa-porte{display:inline-flex;align-items:center;gap:7px;margin-left:auto;margin-right:12px;padding:6px 12px 6px 6px;border-radius:999px;background:#fff;box-shadow:0 0 0 1.5px #E2D8C4,0 4px 12px rgba(11,18,32,.08);font:800 14px/1 "Source Sans 3","Source Sans Pro",system-ui,sans-serif;color:#0B1220;text-decoration:none;white-space:nowrap;flex:0 0 auto}'
      + '.efa-porte i{width:24px;height:24px;border-radius:50%;background:conic-gradient(#E44828 0 33%,#F2B84B 0 66%,#3CCB7F 0);display:grid;place-items:center;font-style:normal}'
      + '.efa-porte i::after{content:"";width:12px;height:12px;border-radius:50%;background:#fff}'
      + '.efa-porte b{color:#1E8E57;font-size:16px}.efa-porte span{color:#4E5566;font-weight:700}'
      + '.efa-porte:hover{box-shadow:0 0 0 1.5px #1E8E57,0 4px 12px rgba(11,18,32,.1)}'
      + '.efa-porte:focus-visible{outline:3px solid #2188D6;outline-offset:2px}'
      + '@media(max-width:420px){.efa-porte{padding:5px 10px 5px 5px;margin-right:8px;font-size:13px}}@media(max-width:350px){.efa-porte span{display:none}}';
    document.head.appendChild(st);
    var a = document.createElement('a'); a.className = 'efa-porte';
    a.href = /\/coaching(\.html)?$/.test(location.pathname) ? '#choisir' : 'coaching.html#choisir';
    a.setAttribute('data-goatcounter-click', 'porte-credits');
    if (tg) inn.insertBefore(a, tg); else inn.appendChild(a);
    function maj() {
      var s = solde();
      a.innerHTML = '<i aria-hidden="true"></i>' + (s === null ? '<b>3</b><span>crédits offerts</span>' : '<b>' + s + '</b><span>crédit' + (s > 1 ? 's' : '') + '</span>');
      a.setAttribute('aria-label', s === null ? 'Portefeuille : 3 crédits offerts avec votre email' : 'Mon solde : ' + s + ' crédit' + (s > 1 ? 's' : ''));
    }
    maj(); window.addEventListener('storage', maj); window.addEventListener('efa-credits', maj);
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', function (e) { e.preventDefault(); ouvrirPorte(); });
  }
  /* Fenêtre « Mon portefeuille » : solde, promotion en cours, achat de crédits (bientôt). Aucun champ de paiement n'est actif. */
  var dlg = null, pack = 3, moyen = 'om';
  var MOYENS = [['om', 'Orange Money', '#FF7900'], ['wave', 'Wave', '#1DC8F2'], ['mtn', 'MTN MoMo', '#FFCB05'], ['carte', 'Carte bancaire', '#1A1F71']];
  function fc(n) { return n.toLocaleString('fr-FR').replace(/ /g, ' ') + ' FCFA'; }
  function ouvrirPorte() {
    if (!dlg) {
      var st = document.createElement('style');
      st.textContent = '.pf{border:0;padding:0;border-radius:18px;width:min(460px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;font-family:"Source Sans 3","Source Sans Pro",system-ui,sans-serif;color:#2A3142;background:#FFFDF8}'
        + '.pf::backdrop{background:rgba(11,18,32,.55)}'
        + '.pf-t{background:#0B1220;color:#fff;padding:18px 20px;position:relative}.pf-t small{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#C9D1DE}'
        + '.pf-t b{display:block;font:700 34px/1.1 "Libre Baskerville",Georgia,serif;margin-top:6px}.pf-t b span{font:700 16px "Source Sans 3",system-ui,sans-serif;color:#3CCB7F;margin-left:6px}'
        + '.pf-x{position:absolute;right:12px;top:10px;border:0;background:none;color:#fff;font-size:26px;cursor:pointer;line-height:1;padding:4px 8px}'
        + '.pf-c{padding:16px 20px 20px}'
        + '.pf-promo{border-radius:12px;background:#FFF3D6;padding:12px 14px;font-size:15px}.pf-promo b{color:#5A3D00}'
        + '.pf-promo p{margin:4px 0 0}.pf-promo a{color:#1B71B2;font-weight:800}'
        + '.pf-h{display:flex;align-items:center;gap:8px;margin:18px 0 8px;font:700 20px/1.2 "Libre Baskerville",Georgia,serif;color:#0B1220}'
        + '.pf-bt{font:800 11px/1 "Source Sans 3",system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;background:#F2B84B;color:#0B1220;border-radius:999px;padding:4px 9px}'
        + '.pf-packs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}'
        + '.pf-packs button,.pf-moy button{border:0;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1.5px #E2D8C4;cursor:pointer;font:inherit;color:#0B1220}'
        + '.pf-packs button{padding:10px 4px;text-align:center}.pf-packs b{display:block;font-size:20px}.pf-packs span{font-size:10.5px;font-weight:700;color:#4E5566;white-space:nowrap}'
        + '.pf-packs button[aria-pressed="true"],.pf-moy button[aria-pressed="true"]{box-shadow:inset 0 0 0 2.5px #1E8E57;background:#F2FBF6}'
        + '.pf-moy{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:12px}'
        + '.pf-moy button{display:flex;align-items:center;gap:8px;min-height:46px;padding:0 10px;font-weight:800;font-size:15px;text-align:left}'
        + '.pf-moy i{flex:0 0 16px;height:16px;border-radius:50%}'
        + '.pf-f{margin-top:12px;border-radius:12px;background:#F7F4EC;padding:12px}'
        + '.pf-f label{display:block;font-size:13px;font-weight:700;color:#4E5566;margin:8px 0 4px}.pf-f label:first-child{margin-top:0}'
        + '.pf-f input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:11px 12px;border:1px solid #D9D2C2;border-radius:9px;background:#EFEBE1;color:#7A8293}'
        + '.pf-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
        + '.pf-logos{display:flex;gap:6px;margin-bottom:6px}.pf-logos span{font:800 12px/1 "Source Sans 3",system-ui,sans-serif;padding:5px 8px;border-radius:5px;color:#fff}'
        + '.pf-payer{display:block;width:100%;margin-top:12px;min-height:48px;border:0;border-radius:9px;background:#C9CED8;color:#4E5566;font:800 16px "Source Sans 3",system-ui,sans-serif;cursor:not-allowed}'
        + '.pf-note{font-size:13px;color:#7A8293;margin:8px 0 0}'
        + '.pf-prev{display:block;width:100%;margin-top:10px;min-height:46px;border:0;border-radius:9px;background:#1E8E57;color:#fff;font:800 15px "Source Sans 3",system-ui,sans-serif;cursor:pointer}'
        + '.pf-ok{margin:10px 0 0;font-weight:700;color:#14532D}';
      document.head.appendChild(st);
      dlg = document.createElement('dialog'); dlg.className = 'pf'; dlg.setAttribute('data-garde', ''); dlg.setAttribute('aria-label', 'Mon portefeuille de crédits');
      document.body.appendChild(dlg);
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg || e.target.closest('.pf-x')) { dlg.close(); return; }
        var p = e.target.closest('[data-pack]'); if (p) { pack = +p.dataset.pack; rendre(); return; }
        var m = e.target.closest('[data-moy]'); if (m) { moyen = m.dataset.moy; rendre(); return; }
        if (e.target.closest('.pf-prev') && !e.target.closest('.pf-r')) prevenir();
      });
    }
    rendre(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function rendre() {
    var s = solde(), sur = /\/coaching(\.html)?$/.test(location.pathname) ? '' : 'coaching.html', M = MOYENS.filter(function (x) { return x[0] === moyen; })[0];
    var champs = moyen === 'carte'
      ? '<div class="pf-logos"><span style="background:#1A1F71">VISA</span><span style="background:#EB001B">Mastercard</span></div><label>Numéro de carte</label><input disabled placeholder="1234 5678 9012 3456" autocomplete="off"><div class="pf-2"><div><label>Expiration</label><input disabled placeholder="MM / AA" autocomplete="off"></div><div><label>Code de sécurité</label><input disabled placeholder="CVC" autocomplete="off"></div></div><label>Nom sur la carte</label><input disabled placeholder="Prénom Nom" autocomplete="off">'
      : '<label>Numéro ' + M[1] + '</label><input disabled placeholder="07 00 00 00 00" autocomplete="off"><p class="pf-note">Vous confirmerez le paiement sur votre téléphone, avec votre code ' + M[1] + '.</p>';
    dlg.innerHTML = '<div class="pf-t"><button type="button" class="pf-x" aria-label="Fermer">×</button><small>Mon portefeuille</small><b>' + (s === null ? '0' : s) + '<span>crédit' + (s > 1 ? 's' : '') + '</span></b></div>'
      + '<div class="pf-c"><div class="pf-promo"><b>Promotion d’ouverture : vos crédits sont offerts.</b><p>' + (s === null ? '3 crédits avec votre email, ' : '') + 'une carte à gratter par jour, +1 crédit par avis. <a href="' + sur + '#gratter">Gratter ma carte</a> · <a href="' + sur + '#choisir">Utiliser mes crédits</a></p></div>'
      + '<p class="pf-h">Acheter des crédits <span class="pf-bt">Bientôt</span></p>'
      + '<div class="pf-packs">' + [1, 3, 5, 10].map(function (n) { return '<button type="button" data-pack="' + n + '" aria-pressed="' + (n === pack) + '"><b>' + n + '</b><span>' + fc(n * 10000) + '</span></button>'; }).join('') + '</div>'
      + '<div class="pf-moy">' + MOYENS.map(function (x) { return '<button type="button" data-moy="' + x[0] + '" aria-pressed="' + (x[0] === moyen) + '"><i style="background:' + x[2] + '"></i>' + x[1] + '</button>'; }).join('') + '</div>'
      + '<div class="pf-f">' + champs + '<button type="button" class="pf-payer" disabled>Payer ' + fc(pack * 10000) + ' · bientôt</button></div>'
      + '<p class="pf-note">Le paiement par mobile money et par carte arrive bientôt. 1 crédit = 10 000 FCFA.</p>'
      + '<button type="button" class="pf-prev">Me prévenir à l’ouverture du paiement</button><div class="pf-r" role="status"></div></div>';
  }
  function prevenir() {
    var M = MOYENS.filter(function (x) { return x[0] === moyen; })[0], m = '';
    try { m = localStorage.getItem('efa_email_v1') || (JSON.parse(localStorage.getItem('efa_ateliers_v1') || '{}').mail) || ''; } catch (x) {}
    var r = dlg.querySelector('.pf-r');
    if (!m) {
      r.innerHTML = '<form class="pf-f" novalidate><label for="pf-m">Votre email</label><input id="pf-m" type="email" autocomplete="email" style="background:#fff;color:#0B1220"><button type="submit" class="pf-prev">Me prévenir</button></form>';
      r.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); var v = r.querySelector('#pf-m').value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return; try { localStorage.setItem('efa_email_v1', v); } catch (x) {} envoyer(v, M); });
      return;
    }
    envoyer(m, M);
  }
  function envoyer(m, M) {
    try { fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: '426191fb-4812-4de4-b602-5857464c5916', subject: 'efa.africa · Achat de crédits demandé · ' + M[1], from_name: 'Portefeuille efa.africa', email: m, replyto: m, credits: pack, montant: pack * 10000 + ' FCFA', moyen: M[1], page: location.pathname }) }); } catch (x) {}
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'achat-credits-' + M[0], title: 'Achat de crédits demandé', event: true }); } catch (x) {}
    dlg.querySelector('.pf-r').innerHTML = '<p class="pf-ok">C’est noté : nous vous écrivons dès que le paiement ' + M[1] + ' est ouvert.</p>';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poser); else poser();
})();
