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
    var m = D.acces(a); return m === 'gratuit' ? 'Commencer gratuitement' : m === 'contact' ? 'Demander l’accès' : 'Obtenir ma clé';
  }
  function carte(a, n) {
    var ok = etat.ok[a.id];
    return '<article class="at-c' + (ok ? ' debloque' : '') + '" id="' + esc(a.alias || ('atelier-' + a.id)) + '" data-id="' + esc(a.id) + '">' +
      '<span class="at-c-img at-c-affiche"><img src="clone/assets/ateliers/atelier-' + (n < 10 ? '0' : '') + n + '.webp?v=3" alt="Affiche de l’atelier « ' + esc(a.t) + ' »" width="864" height="1080" loading="lazy" decoding="async"></span>' +
      '<div class="at-c-corps"><span class="at-c-type">' + (a.c ? 'Avec Élysée Johnson · atelier approfondi' : 'Enregistré · à votre rythme') + '</span>' +
      '<h3 class="at-c-titre">' + esc(a.t) + '</h3><p class="at-c-pour"><b>Pour qui :</b> ' + esc(a.pour) + '</p>' +
      '<p class="at-c-rep"><span>Vous repartez avec</span>' + esc(a.rep) + '</p>' +
      '<div class="at-c-pied"><span class="at-c-prix"><b>' + D.prix(a) + '</b>' + (a.gratuit ? '' : '<small>Offert pour le lancement</small>') + '</span><button type="button" class="at-c-btn">' + bouton(a, ok) + '</button></div></div></article>';
  }
  var n = 0;
  document.querySelectorAll('.at-cat').forEach(function (c) {
    var t = c.getAttribute('data-type') === '1';
    c.innerHTML = D.liste.filter(function (a) { return !!a.c === t; }).map(function (a) { n++; return carte(a, n); }).join('');
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
    $('at-dlg-offre').textContent = m === 'gratuit' ? '' : m === 'contact' ? 'Offert pour le lancement, sur demande' : 'Offert pour le lancement';
    $('at-mail-l').textContent = m === 'gratuit' ? 'Votre email suffit' : 'Pas de clé ? Générez-la avec votre email';
    $('at-mail-ok').textContent = m === 'gratuit' ? 'Débloquer' : 'Générer';
    fm.hidden = ok || m === 'contact';
    $('at-dlg-contact').hidden = ok || m !== 'contact';
    $('at-dlg-contact').href = 'rendez-vous.html?sujet=code-atelier&atelier=' + encodeURIComponent(cour.id) + '&t=' + encodeURIComponent(cour.t) + '#contact';
    $('at-dlg-cle').hidden = ok || m === 'gratuit';
    if (ok) { msg.className = 'ok'; msg.innerHTML = etat.ok[cour.id] === 'email' ? 'C’est fait. L’atelier est débloqué.' : 'Atelier débloqué avec la clé <b>' + etat.ok[cour.id] + '</b>.'; }
    else { msg.className = ''; msg.textContent = ''; }
  }
  function ouvrir(id) {
    cour = D.liste.filter(function (a) { return a.id === id; })[0]; if (!cour) return;
    $('at-dlg-k').textContent = cour.c ? 'Avec Élysée Johnson · atelier approfondi' : 'Atelier enregistré';
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
  fm.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = cm.value.trim();
    if (!A || !A.valide(m)) { msg.textContent = 'Saisissez une adresse email valide.'; msg.className = 'ko'; cm.focus(); return; }
    etat.mail = m;
    if (cour.gratuit) { debloquer('email'); A.envoyer(m, 'Atelier gratuit · ' + cour.t, cour.id); return; }
    var k = D.nouvelleCle(); debloquer(k);
    msg.innerHTML = 'Votre clé d’accès : <b>' + k + '</b>. L’atelier est débloqué et nous vous l’envoyons aussi à ' + m.replace(/[<>&]/g, '') + '.';
    A.envoyer(m, 'Clé d’accès générée · ' + cour.t, cour.id + ' · ' + D.prix(cour) + ' · clé ' + k);
  });
  function valider() {
    var v = champ.value.trim().toUpperCase().replace(/\s+/g, '');
    if (!D.cleValide(v)) { msg.textContent = 'Cette clé n’est pas reconnue. Vérifiez les lettres et les tirets.'; msg.className = 'ko'; return; }
    debloquer(v);
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'atelier-cle-' + cour.id, title: 'Clé atelier', event: true }); } catch (x) {}
  }
  $('at-cle-ok').addEventListener('click', valider);
  champ.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); valider(); } });
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
