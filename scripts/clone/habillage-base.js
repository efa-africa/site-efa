/* EFA · Clone · comportement des pages V1 recopiées dans /clone.
   Fichier généré par scripts/clone/habiller.py : modifier ce modèle puis relancer le script.
   - garde la navigation dans /clone : un lien vers une page V1 qui existe aussi dans /clone y reste ;
   - répare les ancres (#…) que la balise <base> ferait sinon partir vers l'accueil ;
   - menu et en-tête du Clone (ouverture, fermeture, passage en blanc au défilement). */
(function () {
  var PAGES = /*PAGES*/[];
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
    if (r === null || r.indexOf('clone/') === 0) return;
    if (r === '' || r === 'index.html') a.setAttribute('href', racine + 'clone/index.html' + u.search + u.hash);
    else if (connues[r]) a.setAttribute('href', racine + 'clone/' + r + u.search + u.hash);
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

  function demarrer() {
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
})();
