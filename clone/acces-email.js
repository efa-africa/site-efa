/* EFA · Accès gratuit contre un email (ateliers, outil de valorisation).
   L'email est gardé sur l'appareil pour ne pas le redemander, et envoyé à EFA par Web3Forms. */
window.EFA_ACCES = (function () {
  var CLE = 'efa_email_v1', WEB3 = '426191fb-4812-4de4-b602-5857464c5916';
  function mail() { try { return localStorage.getItem(CLE) || ''; } catch (e) { return ''; } }
  function valide(m) { return /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m); }
  function envoyer(m, objet, detail) {
    try { localStorage.setItem(CLE, m); } catch (e) {}
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'acces-email-' + objet.replace(/[^a-z0-9]+/gi, '-').toLowerCase(), title: 'Accès par email', event: true }); } catch (e) {}
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ access_key: WEB3, subject: 'efa.africa · ' + objet, from_name: 'Site efa.africa', email: m, replyto: m, acces: objet, detail: detail || '', page: location.pathname })
    }).then(function (r) { return r.json(); }).catch(function () { return { success: false }; });
  }
  return { mail: mail, valide: valide, envoyer: envoyer };
})();
