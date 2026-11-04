/* EFA · Mesure des gestes clés (statistiques du site, sans donnée personnelle).
   Chaque geste est compté une fois par page vue, comme un « événement » dans les statistiques :
   accueil-trouver-mon-chemin, accueil-audio-ecoute, generateur-analyse, generateur-idee-soumise,
   atelier-decouvrir, rendez-vous-reserver, diagnostic-resultat-demande, whatsapp-partage,
   et email-laisse-<formulaire> quand un formulaire du site est bien envoyé.
   Pour ajouter un geste : un attribut data-geste="nom-du-geste" sur le bouton ou le lien. */
(function () {
  var vus = {};
  function compter(nom, titre) {
    if (!nom || vus[nom]) return; vus[nom] = 1;
    var essais = 0;
    (function go() {
      if (window.goatcounter && window.goatcounter.count) {
        try { window.goatcounter.count({ path: nom, title: titre || nom, event: true }); } catch (e) {}
      } else if (essais++ < 20) setTimeout(go, 500);
    })();
  }
  window.EFA_GESTE = compter;
  var GESTES = [
    ['#hero-cta', 'accueil-trouver-mon-chemin', 'Accueil : Trouver mon chemin'],
    ['.bv-e', 'accueil-audio-ecoute', 'Accueil : écoute du message d’Élysée'],
    ['#lancer', 'generateur-analyse', 'Générateur : analyse lancée'],
    ['#propre-go', 'generateur-idee-soumise', 'Générateur : ouverture de « Soumettre mon idée »'],
    ['.ae-cta, .at-c-btn', 'atelier-decouvrir', 'Ateliers : « Découvrir l’atelier »'],
    ['#rv-go', 'rendez-vous-reserver', 'Rendez-vous avec Élysée : « Réserver »'],
    ['#fgate [type=submit]', 'diagnostic-resultat-demande', 'Diagnostic : résultat demandé'],
    ['a[href*="wa.me/"], a[href*="api.whatsapp.com"]', 'whatsapp-partage', 'Partage sur WhatsApp']
  ];
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var d = t.closest('[data-geste]'); if (d) compter(d.getAttribute('data-geste'));
    for (var i = 0; i < GESTES.length; i++) if (t.closest(GESTES[i][0])) compter(GESTES[i][1], GESTES[i][2]);
  }, true);
  /* Formulaires envoyés avec succès */
  function slug(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'formulaire'; }
  if (window.fetch) {
    var f0 = window.fetch;
    window.fetch = function (url, o) {
      var p = f0.apply(this, arguments);
      try {
        if (String(url).indexOf('api.web3forms.com') > -1 && o && typeof o.body === 'string') {
          var sujet = (JSON.parse(o.body).subject || '').replace(/^efa\.africa\s*·\s*/i, '').split('·')[0];
          p.then(function (r) { if (r && r.ok) compter('email-laisse-' + slug(sujet), 'Formulaire envoyé : ' + sujet.trim()); }, function () {});
        }
      } catch (e) {}
      return p;
    };
  }
})();
