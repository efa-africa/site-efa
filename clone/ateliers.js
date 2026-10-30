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
      '<span class="at-c-img"><img src="clone/assets/' + esc(a.img) + '" alt="" loading="lazy" decoding="async"><i>' + (n < 10 ? '0' : '') + n + '</i></span>' +
      '<div class="at-c-corps"><span class="at-c-type">' + (a.c ? 'Coaching · 3 séances · 8 places' : 'Enregistré · à votre rythme') + '</span>' +
      '<h3>' + esc(a.t) + '</h3><p class="at-c-pour"><b>Pour qui :</b> ' + esc(a.pour) + '</p>' +
      '<p class="at-c-rep"><span>Vous repartez avec</span>' + esc(a.rep) + '</p>' +
      '<div class="at-c-pied"><b>' + D.prix() + '</b><button type="button" class="at-c-btn">' + (ok ? 'Accès débloqué ✓' : 'Réserver') + '</button></div></div></article>';
  }
  var n = 0;
  document.querySelectorAll('.at-cat').forEach(function (c) {
    var t = c.getAttribute('data-type') === '1';
    c.innerHTML = D.liste.filter(function (a) { return !!a.c === t; }).map(function (a) { n++; return carte(a, n); }).join('');
  });
  // ancienne adresse #atelier-xxx : défiler jusqu'à la carte
  if (location.hash) { var t0 = document.getElementById(location.hash.slice(1)); if (t0) setTimeout(function () { t0.scrollIntoView({ block: 'start' }); t0.classList.add('vise'); }, 60); }

  var dlg = document.getElementById('at-dlg'), cour = null;
  var champ = document.getElementById('at-cle'), msg = document.getElementById('at-cle-msg'), go = document.getElementById('at-dlg-go');
  function lien(a) {
    return 'rendez-vous.html?sujet=accompagnement&atelier=' + encodeURIComponent(a.id) + '&t=' + encodeURIComponent(a.t) +
      (etat.ok[a.id] ? '&cle=' + encodeURIComponent(etat.ok[a.id]) : '') + '#contact';
  }
  function majDlg() {
    var ok = !!etat.ok[cour.id];
    document.querySelector('.at-dlg-cle div').hidden = ok; document.querySelector('.at-dlg-cle label').hidden = ok;
    document.querySelector('.at-dlg-pay').hidden = ok;
    go.hidden = !ok; go.href = lien(cour);
    msg.textContent = ok ? 'Accès débloqué avec la clé ' + etat.ok[cour.id] + '. Réservez votre place.' : '';
  }
  function ouvrir(id) {
    cour = D.liste.filter(function (a) { return a.id === id; })[0]; if (!cour) return;
    document.getElementById('at-dlg-k').textContent = cour.c ? 'Coaching avec Élysée Johnson' : 'Atelier enregistré';
    document.getElementById('at-dlg-t').textContent = cour.t;
    champ.value = ''; msg.className = ''; majDlg();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.at-c-btn'); if (!b) return;
    ouvrir(b.closest('.at-c').getAttribute('data-id'));
  });
  function valider() {
    var v = champ.value.trim().toUpperCase().replace(/\s+/g, '');
    if (!D.cleValide(v)) { msg.textContent = 'Cette clé n’est pas reconnue, ou la période de test est terminée. Vérifiez les lettres et les tirets.'; msg.className = 'ko'; return; }
    etat.ok[cour.id] = v; ecrire(etat); msg.className = 'ok'; majDlg();
    var c = document.querySelector('.at-c[data-id="' + cour.id + '"]');
    if (c) { c.classList.add('debloque'); c.querySelector('.at-c-btn').textContent = 'Accès débloqué ✓'; }
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'atelier-cle-' + cour.id, title: 'Clé atelier', event: true }); } catch (x) {}
  }
  document.getElementById('at-cle-ok').addEventListener('click', valider);
  champ.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); valider(); } });
  // onglets
  document.querySelectorAll('.at-onglets a').forEach(function (a) {
    a.addEventListener('click', function () { document.querySelectorAll('.at-onglets a').forEach(function (x) { x.classList.toggle('on', x === a); }); });
  });
})();
