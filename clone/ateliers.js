/* EFA · Choisir son atelier : catalogue des 20 ateliers, réservation et clé de test */
(function () {
  var D = window.EFA_ATELIERS; if (!D) return;
  var CLE = 'efa_ateliers_v1';
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || '{}') || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {} }
  var etat = lire(); etat.ok = etat.ok || {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function bouton(a, ok) {
    if (ok) return 'Accès débloqué ✓';
    var c = D.cout(a); return c ? 'Ouvrir avec ' + c + ' crédit' + (c > 1 ? 's' : '') : 'Commencer gratuitement';
  }
  function carte(a, n) {
    var ok = etat.ok[a.id];
    return '<article class="at-c' + (ok ? ' debloque' : '') + '" id="' + esc(a.alias || ('atelier-' + a.id)) + '" data-id="' + esc(a.id) + '">' +
      '<span class="at-c-img at-c-affiche"><img src="clone/assets/ateliers/' + (a.aff || ('atelier-' + (n < 10 ? '0' : '') + n + '.webp?v=3')) + '" alt="Affiche de l’atelier « ' + esc(a.t) + ' »" width="864" height="1080" loading="lazy" decoding="async"></span>' +
      '<div class="at-c-corps"><span class="at-c-type">' + (a.cours ? 'Cours à votre rythme · 5 étapes, 31 exercices' : a.c ? 'Avec Élysée Johnson · atelier approfondi' : 'Enregistré · à votre rythme') + '</span>' +
      '<h3 class="at-c-titre">' + esc(a.t) + '</h3><p class="at-c-pour"><b>Pour qui :</b> ' + esc(a.pour) + '</p>' +
      '<p class="at-c-rep"><span>Vous repartez avec</span>' + esc(a.rep) + '</p>' +
      '<div class="at-c-pied"><span class="at-c-prix">' + (a.gratuit ? '<b>' + D.prix(a) + '</b>' : '<span class="promo-pastille">Phase de test</span><b><s>' + D.prix(a) + '</s></b><small>' + D.cout(a) + ' crédit' + (D.cout(a) > 1 ? 's' : '') + '</small>') + '</span><button type="button" class="at-c-btn">' + bouton(a, ok) + '</button></div></div></article>';
  }
  var n = 0;
  document.querySelectorAll('.at-cat').forEach(function (c) {
    var ty = c.getAttribute('data-type'), t = ty === '1';
    c.innerHTML = D.liste.filter(function (a) { return ty === 'cours' ? !!a.cours : !a.cours && !!a.c === t; }).map(function (a) { if (!a.cours) n++; return carte(a, n); }).join('');
  });
  // ancienne adresse #atelier-xxx : défiler jusqu'à la carte
  if (location.hash) { var t0 = document.getElementById(location.hash.slice(1)); if (t0) setTimeout(function () { t0.scrollIntoView({ block: 'start' }); t0.classList.add('vise'); }, 60); }

  var dlg = document.getElementById('at-dlg'), cour = null;
  var champ = document.getElementById('at-cle'), msg = document.getElementById('at-cle-msg');
  var fm = document.getElementById('at-mail-f'), cm = document.getElementById('at-mail'), A = window.EFA_ACCES;
  var $ = function (i) { return document.getElementById(i); };
  function majDlg() {
    var ok = !!etat.ok[cour.id], m = D.acces(cour);
    $('at-dlg-prix').textContent = D.prix(cour);
    var prixC = D.cout(cour), reste = credits(), avisMode = !ok && prixC > reste;
    $('at-dlg-offre').textContent = prixC ? 'Phase de test : ' + prixC + ' crédit' + (prixC > 1 ? 's' : '') : '';
    $('at-mail-ok').textContent = prixC ? 'Ouvrir avec ' + prixC + ' crédit' + (prixC > 1 ? 's' : '') : 'Débloquer';
    $('at-credits').textContent = prixC ? 'Votre solde : ' + pl(reste) + (prixC <= reste ? ' · après ouverture : ' + pl(reste - prixC) : '') : '';
    fm.hidden = ok || avisMode;
    $('at-avis').hidden = !avisMode; if (avisMode) remplirAvis();
    $('at-dlg-contact').hidden = true;
    $('at-dlg-contact').href = 'rendez-vous.html?sujet=code-atelier&atelier=' + encodeURIComponent(cour.id) + '&t=' + encodeURIComponent(cour.t) + '#contact';
    $('at-dlg-cle').hidden = ok || m === 'gratuit';
    var go = $('at-dlg-go'); go.hidden = !(ok && cour.lien); if (cour.lien) go.href = cour.lien;
    var suite = cour.lien ? '' : ' Votre place est réservée : nous vous envoyons le lien par email dès l’ouverture de la prochaine session.';
    if (ok) { msg.className = 'ok'; msg.innerHTML = (etat.ok[cour.id] === 'email' ? 'C’est fait. ' + (cour.cours ? 'Le cours' : 'L’atelier') + ' est débloqué.' : (cour.cours ? 'Cours' : 'Atelier') + ' débloqué avec le code promo <b>' + etat.ok[cour.id] + '</b>.') + suite; }
    else { msg.className = ''; msg.textContent = ''; }
  }
  function pl(n) { return n + ' crédit' + (n > 1 ? 's' : ''); }
  function credits() { return D.CREDITS_OFFERTS + (etat.bonus || 0) - (etat.depense != null ? etat.depense : (etat.codes || 0)); }
  function soldeAffiche() { var z = document.getElementById('at-solde'); if (z) z.textContent = pl(Math.max(0, credits())); }
  function testes() { return D.liste.filter(function (a) { return etat.ok[a.id] && !(etat.avis || {})[a.id]; }); }
  function remplirAvis(vise) {
    var s = $('at-avis-c'), L = testes(); s.innerHTML = '';
    L.forEach(function (a) { var o = document.createElement('option'); o.value = a.id; o.textContent = a.t; if (a.id === vise) o.selected = true; s.appendChild(o); });
    var manque = cour ? D.cout(cour) - credits() : 0;
    $('at-avis-t').textContent = L.length ? (manque > 0 ? 'Il vous manque ' + pl(manque) + '. Chaque avis sur un contenu testé vous rapporte 1 crédit.' : 'Votre avis améliore le contenu et vous rapporte 1 crédit.') : (manque > 0 ? 'Il vous manque ' + pl(manque) + '. Ouvrez d’abord un contenu à 1 crédit ou gratuit, testez-le, puis donnez votre avis : chaque avis rapporte 1 crédit.' : 'Testez d’abord un contenu, puis revenez donner votre avis.');
    $('at-avis').querySelectorAll('select,fieldset,textarea,input,button,label').forEach(function (x) { x.hidden = !L.length; });
  }
  function ouvrir(id) {
    cour = D.liste.filter(function (a) { return a.id === id; })[0]; if (!cour) return;
    $('at-dlg-k').textContent = cour.cours ? 'Cours à votre rythme' : cour.c ? 'Avec Élysée Johnson · atelier approfondi' : 'Atelier enregistré';
    $('at-dlg-t').textContent = cour.t;
    champ.value = ''; cm.value = (A && A.mail()) || ''; majDlg();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.at-c-btn'); if (!b) return;
    ouvrir(b.closest('.at-c').getAttribute('data-id'));
  });
  function debloquer(v) {
    etat.ok[cour.id] = v; ecrire(etat); majDlg();
    var c = document.querySelector('.at-c[data-id="' + cour.id + '"]');
    if (c) { c.classList.add('debloque'); c.querySelector('.at-c-btn').textContent = 'Accès débloqué ✓'; }
  }
  var WEB3 = '426191fb-4812-4de4-b602-5857464c5916';
  function notifier(objet, champs) {
    try { fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.assign({ access_key: WEB3, subject: 'efa.africa · ' + objet, from_name: 'Site efa.africa', page: location.pathname }, champs)) }); } catch (x) {}
  }
  fm.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = cm.value.trim();
    if (m && (!A || !A.valide(m))) { msg.textContent = 'Cette adresse email ne semble pas valide. Corrigez-la ou laissez le champ vide.'; msg.className = 'ko'; cm.focus(); return; }
    if (m) etat.mail = m;
    if (cour.gratuit) { debloquer('email'); if (m) A.envoyer(m, 'Atelier gratuit · ' + cour.t, cour.id); else notifier('Atelier gratuit débloqué · ' + cour.t, { atelier: cour.id }); return; }
    var c = D.cout(cour); if (c > credits()) { majDlg(); return; }
    if (etat.depense == null) etat.depense = etat.codes || 0;
    var k = D.nouvelleCle(); etat.depense += c; debloquer(k); soldeAffiche();
    msg.innerHTML = (cour.cours ? 'Le cours' : 'L’atelier') + ' est ouvert avec ' + pl(c) + '. Il vous reste ' + pl(credits()) + '.' + (m ? ' Votre code d’accès <b>' + k + '</b> part à ' + m.replace(/[<>&]/g, '') + '.' : ' Votre code d’accès : <b>' + k + '</b>.') + (cour.lien ? '' : ' Votre place est réservée : le lien suit dès l’ouverture de la prochaine session.');
    if (m) A.envoyer(m, 'Ouvert avec ' + pl(c) + ' · ' + cour.t, cour.id + ' · ' + D.prix(cour) + ' · code ' + k);
    else notifier('Ouvert avec ' + pl(c) + ' · ' + cour.t, { atelier: cour.id, code: k });
  });
  $('at-avis').addEventListener('submit', function (e) {
    e.preventDefault();
    var id = $('at-avis-c').value, n = (document.querySelector('#at-avis input[name=note]:checked') || {}).value, t = $('at-avis-txt').value.trim();
    if (!id) { msg.className = 'ko'; msg.textContent = 'Testez d’abord un contenu débloqué.'; return; }
    if (!n) { msg.className = 'ko'; msg.textContent = 'Choisissez une note de 1 à 5.'; return; }
    if (t.length < 40) { msg.className = 'ko'; msg.textContent = 'Écrivez une ou deux phrases : ce qui vous a servi, ce qui vous a manqué.'; $('at-avis-txt').focus(); return; }
    var a = D.liste.filter(function (x) { return x.id === id; })[0] || { t: id };
    etat.avis = etat.avis || {}; etat.avis[id] = +n; etat.bonus = (etat.bonus || 0) + 1; ecrire(etat); soldeAffiche();
    notifier('Avis · ' + a.t + ' · ' + n + '/5', { contenu: id, note: n, avis: t, citation_autorisee: $('at-avis-pub').checked ? 'oui' : 'non', prenom: $('at-avis-prenom').value.trim(), email: etat.mail || '' });
    $('at-avis').reset();
    if (cour && !etat.ok[cour.id]) { majDlg(); msg.className = 'ok'; msg.textContent = 'Merci pour votre avis : +1 crédit. Votre solde : ' + pl(credits()) + '.'; }
    else { $('at-avis').hidden = true; msg.className = 'ok'; msg.textContent = 'Merci pour votre avis : +1 crédit. Votre solde : ' + pl(credits()) + '.'; }
  });
  // Donner son avis depuis un cours : coaching.html?avis=<id>#avis
  var pa = (location.search.match(/[?&]avis=([a-z0-9-]+)/) || [])[1];
  if (/#avis$/.test(location.hash) || pa) setTimeout(function () {
    cour = D.liste.filter(function (a) { return a.id === pa; })[0] || testes()[0] || D.liste[0];
    ouvrir(cour.id); fm.hidden = true; $('at-avis').hidden = false; remplirAvis(pa); $('at-dlg-go').hidden = true; msg.textContent = '';
  }, 120);
  function valider() {
    var v = champ.value.trim().toUpperCase().replace(/\s+/g, '');
    if (!D.cleValide(v)) { msg.textContent = 'Ce code promo n’est pas reconnu. Vérifiez les lettres et les tirets.'; msg.className = 'ko'; return; }
    debloquer(v);
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'atelier-cle-' + cour.id, title: 'Clé atelier', event: true }); } catch (x) {}
  }
  $('at-cle-ok').addEventListener('click', valider);
  champ.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); valider(); } });
  soldeAffiche();
  // Prochains ateliers : liste + email
  var pf = $('at-prochains');
  if (pf) {
    var sel = $('at-pr-choix');
    D.liste.forEach(function (a) { var o = document.createElement('option'); o.value = a.id; o.textContent = a.t; sel.appendChild(o); });
    if (A && A.mail()) $('at-pr-mail').value = A.mail();
    pf.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = $('at-pr-mail').value.trim(), g = $('at-pr-msg'), t = sel.value ? sel.options[sel.selectedIndex].text : 'Tous les prochains ateliers';
      if (!A || !A.valide(m)) { g.textContent = 'Saisissez une adresse email valide.'; g.className = 'ko'; return; }
      A.envoyer(m, 'Prochains ateliers · ' + t, sel.value || 'tous');
      g.className = 'ok'; g.textContent = 'C’est noté. Nous vous écrivons au prochain lancement.';
    });
  }
  // onglets
  document.querySelectorAll('.at-onglets a').forEach(function (a) {
    a.addEventListener('click', function () { document.querySelectorAll('.at-onglets a').forEach(function (x) { x.classList.toggle('on', x === a); }); });
  });
})();
