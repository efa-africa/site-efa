/* EFA · Clone · Contact : « Choisir cet atelier » arrive avec l'atelier déjà indiqué dans le message. */
(function () {
  var N = { budget: 'Reprendre la main sur son mois', tontine: 'Ma tontine, du cercle à la spirale', patrimoine: 'Donner un cap à son patrimoine', entreprise: 'Faire parler les chiffres de l’activité' };
  function go() {
    var q = new URLSearchParams(location.search).get('atelier'), m = document.getElementById('ct-msg'), s = document.getElementById('ct-sujet');
    if (!q || !N[q] || !m) return;
    if (s) s.value = 'Un accompagnement individuel ou en groupe';
    if (!m.value) m.value = 'Bonjour,\n\nJe souhaite participer à l’atelier « ' + N[q] + ' ». Merci de me prévenir quand les dates seront fixées.\n\nMa situation en deux lignes : …\nJe préfère : en ligne / à Abidjan\n';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
