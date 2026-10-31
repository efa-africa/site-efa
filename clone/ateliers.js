/* EFA · Choisir son atelier : catalogue des 20 ateliers, réservation et clé de test */
(function () {
  var D = window.EFA_ATELIERS; if (!D) return;
  var CLE = 'efa_ateliers_v1';
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || '{}') || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {} }
  var etat = lire(); etat.ok = etat.ok || {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function carte(a, n) {
    var ok = etat.ok[a.id];
    return '<article class="at-c' + (ok ? ' debloque' : '') + '" id="' + esc(a.alias || ('atelier-' + a.id)) + '" data-id="' + esc(a.id) + '">' +
      '<span class="at-c-img at-c-affiche"><img src="clone/assets/ateliers/atelier-' + (n < 10 ? '0' : '') + n + '.webp?v=2" alt="Affiche de l’atelier « ' + esc(a.t) + ' »" width="864" height="1080" loading="lazy" decoding="async"></span>' +
      '<div class="at-c-corps"><span class="at-c-type">' + (a.c ? 'Avec Élysée Johnson · 3 séances · 8 places' : 'Enregistré · à votre rythme') + '</span>' +
      '<h3 class="at-c-titre">' + esc(a.t) + '</h3><p class="at-c-pour"><b>Pour qui :</b> ' + esc(a.pour) + '</p>' +
      '<p class="at-c-rep"><span>Vous repartez avec</span>' + esc(a.rep) + '</p>' +
      '<div class="at-c-pied"><b>' + D.prix(a) + '</b><button type="button" class="at-c-btn">' + (ok ? 'Accès débloqué ✓' : a.gratuit ? 'Commencer gratuitement' : 'Débloquer gratuitement') + '</button></div></div></article>';
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
  function fait(m) {
    return 'C’est fait. Nous vous envoyons ' + (cour.c ? 'les dates des séances' : 'l’accès à l’atelier') + (m ? ' à ' + m : '') + '.';
  }
  function majDlg() {
    var ok = !!etat.ok[cour.id];
    document.querySelector('.at-dlg-p').innerHTML = '<b>' + D.prix(cour) + '</b>';
    fm.hidden = ok; document.querySelector('.at-dlg-cle').hidden = ok || !!cour.gratuit;
    msg.className = ok ? 'ok' : ''; msg.textContent = ok ? fait(etat.mail || '') : '';
  }
  function ouvrir(id) {
    cour = D.liste.filter(function (a) { return a.id === id; })[0]; if (!cour) return;
    document.getElementById('at-dlg-k').textContent = cour.c ? 'Avec Élysée Johnson · coaching en petit groupe' : 'Atelier enregistré';
    document.getElementById('at-dlg-t').textContent = cour.t;
    champ.value = ''; cm.value = (A && A.mail()) || ''; majDlg();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    if (!etat.ok[cour.id]) setTimeout(function () { cm.focus(); }, 50);
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
    etat.mail = m; debloquer('email');
    A.envoyer(m, 'Atelier débloqué · ' + cour.t, cour.id + (cour.c ? ' · coaching' : ' · enregistré'));
  });
  function valider() {
    var v = champ.value.trim().toUpperCase().replace(/\s+/g, '');
    if (!D.cleValide(v)) { msg.textContent = 'Ce code n’est pas reconnu. Vérifiez les lettres et les tirets.'; msg.className = 'ko'; return; }
    debloquer(v);
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'atelier-cle-' + cour.id, title: 'Clé atelier', event: true }); } catch (x) {}
  }
  document.getElementById('at-cle-ok').addEventListener('click', valider);
  champ.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); valider(); } });
  // onglets
  document.querySelectorAll('.at-onglets a').forEach(function (a) {
    a.addEventListener('click', function () { document.querySelectorAll('.at-onglets a').forEach(function (x) { x.classList.toggle('on', x === a); }); });
  });
})();
