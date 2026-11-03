/* EFA · Ambassadeurs : reconnaître qui a fait venir un visiteur.
   - Un lien efa.africa/…?ref=prenom (ou ?parrain=code) enregistre l'ambassadeur dans le navigateur du visiteur pendant 60 jours.
   - L'arrivée est comptée dans les statistiques du site (événement « ambassadeur-prenom »).
   - Chaque formulaire envoyé ensuite depuis le site (inscription, rendez-vous, idée, crédits…) porte le champ « ambassadeur ».
   - Le paramètre est retiré de l'adresse affichée. */
(function () {
  var K = 'efa_ambassadeur', JOURS = 60, code = null;
  try {
    var q = new URLSearchParams(location.search), r = (q.get('ref') || q.get('parrain') || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]/g, '').slice(0, 40);
    if (r) {
      localStorage.setItem(K, JSON.stringify({ code: r, le: Date.now() }));
      q.delete('ref'); q.delete('parrain');
      var s = q.toString();
      if (history.replaceState) history.replaceState(history.state, '', location.pathname + (s ? '?' + s : '') + location.hash);
      var essais = 0, compter = function () {
        if (window.goatcounter && window.goatcounter.count) { try { window.goatcounter.count({ path: 'ambassadeur-' + r, title: 'Arrivée par le lien de ' + r, event: true }); } catch (e) {} }
        else if (essais++ < 20) setTimeout(compter, 500);
      };
      compter();
    }
    var m = JSON.parse(localStorage.getItem(K) || 'null');
    if (m && m.code && Date.now() - m.le < JOURS * 864e5) code = m.code; else if (m) localStorage.removeItem(K);
  } catch (e) {}
  window.EFA_AMBASSADEUR = code;
  if (!code || !window.fetch) return;
  var f0 = window.fetch;
  window.fetch = function (url, o) {
    try {
      if (String(url).indexOf('api.web3forms.com') > -1 && o && typeof o.body === 'string') {
        var d = JSON.parse(o.body);
        if (d && typeof d === 'object' && !d.ambassadeur) { d.ambassadeur = code; o = Object.assign({}, o, { body: JSON.stringify(d) }); }
      }
    } catch (e) {}
    return f0.apply(this, [url, o].concat([].slice.call(arguments, 2)));
  };
})();
