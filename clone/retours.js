/* EFA · « Ils l'ont fait » : retours d'expérience réels, publiés après relecture et accord.
   Usage : <section id="ils-lont-fait" data-univers="bourse|terrain|epargne|gagner|arnaques"></section>
   Les retours publiés viennent de data/retours.json ; le formulaire envoie les nouveaux à valider. */
(function () {
  var Z = document.getElementById('ils-lont-fait'); if (!Z) return;
  var U = Z.getAttribute('data-univers') || '', NOMS = { bourse: 'la Bourse', terrain: 'le terrain ou l’immobilier', epargne: 'l’épargne ou l’assurance', gagner: 'une activité', arnaques: 'une offre douteuse évitée' };
  var CLE = '426191fb-4812-4de4-b602-5857464c5916';
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mail() { try { return localStorage.getItem('efa_email_v1') || (JSON.parse(localStorage.getItem('efa_ateliers_v1') || '{}').mail) || ''; } catch (x) { return ''; } }
  function carte(r) {
    var av = r.photo ? '<img src="' + e(r.photo) + '" alt="">' : '<span>' + e((r.prenom || '?').charAt(0)) + '</span>';
    return '<article class="ilf-c"><p class="ilf-t">' + e(r.titre) + '</p><p class="ilf-r">' + e(r.recit) + '</p>' +
      (r.depart || r.resultat ? '<dl class="ilf-ch">' + (r.depart ? '<div><dt>Au départ</dt><dd>' + e(r.depart) + '</dd></div>' : '') + (r.resultat ? '<div><dt>Aujourd’hui</dt><dd>' + e(r.resultat) + '</dd></div>' : '') + '</dl>' : '') +
      (r.conseil ? '<p class="ilf-k"><b>Son conseil :</b> ' + e(r.conseil) + '</p>' : '') +
      '<p class="ilf-q"><span class="ilf-av">' + av + '</span><span><b>' + e(r.prenom) + '</b>' + e(r.ville ? ' · ' + r.ville : '') + (r.date ? '<small>Raconté en ' + e(r.date) + '</small>' : '') + '</span></p></article>';
  }
  Z.innerHTML = '<p class="bk">Retours d’expérience</p><h2>Ils l’ont fait</h2><div class="ilf-l" aria-live="polite"><p class="ilf-vide">Chargement…</p></div>' +
    '<details class="ilf-f"><summary>Vous l’avez fait&nbsp;? Racontez-nous</summary><form novalidate>' +
    '<p class="ilf-i">Votre expérience aide ceux qui hésitent. Après relecture, nous vous envoyons un code de 2 crédits.</p>' +
    '<label>Ce que vous avez fait<input name="titre" placeholder="ex. Mon premier ordre à la Bourse, une bande de poulets…" maxlength="120"></label>' +
    '<label>Votre histoire, en quelques phrases<textarea name="recit" rows="4" placeholder="Avant… J’ai… Ce qui a changé…" maxlength="1200"></textarea></label>' +
    '<div class="ilf-2"><label>Au départ (montant, situation)<input name="depart" placeholder="ex. 150 000 F" maxlength="80"></label><label>Aujourd’hui (ce que ça rapporte)<input name="resultat" placeholder="ex. 35 000 F par mois" maxlength="80"></label></div>' +
    '<label>La difficulté rencontrée<input name="difficulte" maxlength="200"></label>' +
    '<label>Votre conseil à quelqu’un qui hésite<input name="conseil" maxlength="200"></label>' +
    '<div class="ilf-2"><label>Prénom<input name="prenom" autocomplete="given-name" maxlength="40"></label><label>Ville<input name="ville" maxlength="40"></label></div>' +
    '<label>Votre email (pour vos crédits, jamais publié)<input name="email" type="email" autocomplete="email" value="' + e(mail()) + '"></label>' +
    '<label class="ilf-ck"><input type="checkbox" name="publication"> J’accepte qu’EFA publie mon prénom, ma ville et mon histoire.</label>' +
    '<label class="ilf-ck"><input type="checkbox" name="photo"> Je veux bien envoyer une vraie photo de moi (nous vous écrirons).</label>' +
    '<button type="submit">Envoyer mon retour</button><p class="ilf-m" role="status"></p></form></details>';
  var L = Z.querySelector('.ilf-l');
  fetch('data/retours.json?v=' + Date.now().toString().slice(0, 7)).then(function (r) { return r.json(); }).then(function (d) {
    var R = (d.retours || []).filter(function (r) { return !U || r.univers === U; });
    L.innerHTML = R.length ? R.map(carte).join('') : '<p class="ilf-vide">Les premiers retours sur ' + e(NOMS[U] || 'ce sujet') + ' arrivent. Vous l’avez fait&nbsp;? Soyez le premier à raconter.</p>';
  }).catch(function () { L.innerHTML = '<p class="ilf-vide">Vous l’avez fait&nbsp;? Soyez le premier à raconter.</p>'; });
  var F = Z.querySelector('form'), M = Z.querySelector('.ilf-m');
  F.addEventListener('submit', function (ev) {
    ev.preventDefault(); var v = {}; [].forEach.call(F.elements, function (x) { if (x.name) v[x.name] = x.type === 'checkbox' ? (x.checked ? 'oui' : 'non') : x.value.trim(); });
    if ((v.recit || '').length < 40) { M.textContent = 'Racontez en au moins deux phrases.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email || '')) { M.textContent = 'Indiquez votre email : c’est là que nous envoyons vos crédits.'; return; }
    try { localStorage.setItem('efa_email_v1', v.email); var Ms = JSON.parse(localStorage.getItem('efa_missions_v1') || '{}') || {}; Ms.attente = Ms.attente || {}; Ms.attente.temoignage = new Date().toISOString().slice(0, 10); localStorage.setItem('efa_missions_v1', JSON.stringify(Ms)); } catch (x) {}
    try { fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.assign({ access_key: CLE, subject: 'efa.africa · Retour d’expérience à valider · ' + (NOMS[U] || U) + ' · +2 crédits', from_name: 'Ils l’ont fait · efa.africa', replyto: v.email, univers: U, page: location.pathname, a_faire: 'Relire. Si publication = oui : ajouter dans data/retours.json et envoyer un code de 2 crédits.' }, v)) }); } catch (x) {}
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'retour-experience-' + U, title: 'Retour d’expérience envoyé', event: true }); } catch (x) {}
    F.innerHTML = '<p class="ilf-ok">Merci&nbsp;! Nous relisons votre retour et vous écrivons à ' + e(v.email) + ' avec votre code de 2 crédits.</p>';
  });
})();
