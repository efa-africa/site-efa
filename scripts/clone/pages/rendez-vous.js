/* EFA · Contact : « Réserver ma place » / « Choisir cet atelier » arrive avec l'atelier (et la clé de test) déjà indiqués. */
(function () {
  var N = { budget: 'Reprendre la main sur son mois', tontine: 'Ma tontine, du cercle à la spirale', patrimoine: 'Donner un cap à son patrimoine', entreprise: 'Faire parler les chiffres de l’activité' };
  function go() {
    var q = new URLSearchParams(location.search), id = q.get('atelier'), t = q.get('t') || N[id], cle = q.get('cle');
    var m = document.getElementById('ct-msg'), s = document.getElementById('ct-sujet');
    if (!id || !t || !m) return;
    t = String(t).slice(0, 120);
    if (q.get('sujet') === 'code-atelier') return;
    if (s) s.value = 'Un accompagnement individuel ou en groupe';
    if (!m.value) m.value = 'Bonjour,\n\nJe réserve ma place pour l’atelier « ' + t + ' ».' +
      (cle ? '\nClé de test : ' + String(cle).slice(0, 20) : '') +
      '\n\nMa situation en deux lignes : …\nJe préfère : en ligne / à Abidjan\n';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
