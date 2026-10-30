/* EFA · Clone · comportement des pages V1 recopiées dans /clone.
   Fichier généré par scripts/clone/habiller.py : modifier ce modèle puis relancer le script.
   - garde la navigation dans /clone : un lien vers une page V1 qui existe aussi dans /clone y reste ;
   - répare les ancres (#…) que la balise <base> ferait sinon partir vers l'accueil ;
   - menu et en-tête du Clone (ouverture, fermeture, passage en blanc au défilement). */
(function () {
  var PAGES = ["acheter-un-terrain.html","admin-ecole.html","africa-2075-dossier-1.html","africa-2075-fondateur.html","africa-2075-n1.html","africa-2075-n2.html","apres-un-deces.html","arrivee-enfant.html","auteur.html","avant-de-cotiser.html","balade-economie.html","bibliotheque-babylone.html","bibliotheque.html","bourse-essentiel.html","bourse-marche.html","bourse-pro.html","bourse-projets.html","budget-chantier.html","budget-mobile-money.html","cadres.html","ceo.html","cercle-spirale.html","certificat-cefa.html","certificat-maitrise.html","certificat-patrimoine.html","certificat-pilote.html","choisir-son-rang-tontine.html","club-investissement.html","comite.html","confidentialite.html","consommer-et-acheter.html","construire-son-budget.html","corporate.html","cotiser-depuis-l-etranger.html","cout-total-credit.html","dat-emprunts-etat.html","decider.html","demo.html","diagnostic.html","dirigeants.html","ecole-bourse.html","ecole-de-la-bourse.html","ecole-de-la-tontine.html","ely.html","engagements-et-exceptions.html","enquete.html","epargner.html","espace-organisation.html","etude-tontine-en-chiffres.html","etudes-enfants-heritage.html","liberte-financiere.html","merci-guide.html","methode.html","minfin.html","news.html","news/2026-10-12-afrique-croissance-inflation.html","news/2026-10-12-senegal-dette.html","news/2026-10-13-airtel-money-bourse.html","news/2026-10-13-dangote-benefice-9-mois.html","news/2026-10-13-guinee-bissau-obligation.html","news/2026-10-13-moodys-afrique-perspective.html","news/2026-10-13-rwanda-inflation.html","news/2026-10-13-tchad-fmi.html","news/2026-10-14-ghana-creances-en-souffrance.html","news/2026-10-14-niger-prix-en-baisse.html","news/2026-10-14-senegal-excedent-commercial.html","news/2026-10-14-shelter-afrique-obligation-logement.html","news/2026-10-16-cameroun-mobile-money-interets.html","news/2026-10-16-cote-divoire-budget-2027.html","news/2026-10-17-ethiopie-papss-monnaies-locales.html","news/2026-10-17-senegal-emprunt-prime-de-duree.html","news/2026-10-18-bceao-prix-de-l-argent.html","news/2026-10-18-senegal-budget-interets-dette.html","news/2026-10-19-kenya-pipeline-premier-dividende.html","news/2026-10-19-ouganda-taux-12-pourcent.html","news/2026-10-23-gabon-audit-dette.html","news/2026-10-23-senegal-obligation-49-centimes.html","news/2026-10-24-cemac-microfinances-fragiles.html","news/2026-10-24-opay-introduction-bourse.html","opcvm-fcpe.html","organisations.html","ou-est-passe-mon-argent.html","ou-garder-sa-reserve.html","outils.html","papiers-famille.html","parcours.html","patrimoine.html","point-de-depart.html","premiers-pas-brvm.html","preparer-ma-retraite.html","preter-a-un-proche.html","programme-organisation.html","question-preter-a-ma-soeur.html","questions-a-poser-a-sa-sgi.html","quiz.html","rejoindre.html","rendez-vous.html","renegocier-une-dette.html","salaire-fixe-activite.html","separer-les-poches.html","solidarite-assureur-de-la-famille.html","tableau-ely.html","tontine-1.html","tontine-decider-avant-de-recevoir.html","tontine-formations.html","tontine-rentree.html","tontine.html","traders.html","tribunes.html"];
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
