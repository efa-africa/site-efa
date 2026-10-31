/* EFA · Vitrine des SGI et comparateur (spécifications du 31/10/2026).
   Données : data/sgi.json et data/places.json. Comptage facturable : Worker « vitrine » (EFA_CONFIG.VITRINE_URL).
   Aucune donnée personnelle n'est collectée ni transmise aux SGI. */
(function () {
  var NOMS = { CI: 'Côte d’Ivoire', SN: 'Sénégal', BJ: 'Bénin', BF: 'Burkina Faso', ML: 'Mali', NE: 'Niger', TG: 'Togo', GW: 'Guinée-Bissau', Diaspora: 'Diaspora' };
  var NC = '<span class="vt-nc">Non communiqué</span>';
  var CFG = window.EFA_CONFIG || {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function v(x) { return x === null || x === undefined || x === '' ? NC : esc(x); }
  function ouiNon(x) { return x == null ? NC : ({ oui: 'Oui', non: 'Non', partielle: 'En partie' })[x] || esc(x); }
  function fcfa(n) { return n == null ? NC : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'; }
  function dateFr(d) { if (!d) return ''; var m = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'], p = d.split('-'); return (+p[2] === 1 ? '1er' : +p[2]) + ' ' + m[+p[1] - 1] + ' ' + p[0]; }
  function compte(ev) { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  /* Session de visite : identifiant aléatoire, sans lien avec une personne */
  function session() { var s = null; try { s = sessionStorage.getItem('efa_vt_s'); if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('efa_vt_s', s); } } catch (e) { s = s || 'x' + Math.random().toString(36).slice(2); } return s; }
  function evenement(type, sgi, pos, payee, canal) {
    if (!CFG.VITRINE_URL) return;
    try { var b = JSON.stringify({ type: type, sgi: sgi, position: pos || null, payee: !!payee, canal: canal || null, session: session() });
      if (navigator.sendBeacon) navigator.sendBeacon(CFG.VITRINE_URL.replace(/\/$/, '') + '/evenement', new Blob([b], { type: 'application/json' }));
      else fetch(CFG.VITRINE_URL.replace(/\/$/, '') + '/evenement', { method: 'POST', body: b, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    } catch (e) {}
  }
  /* Mélange Fisher-Yates avec une graine par visite */
  function graine() { var g = null; try { g = sessionStorage.getItem('efa_vt_g'); if (!g) { g = String(Math.floor(Math.random() * 2147483647)); sessionStorage.setItem('efa_vt_g', g); } } catch (e) {} return +(g || Math.floor(Math.random() * 2147483647)); }
  function melange(a, s) { a = a.slice(); var x = s || 1; function r() { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; } for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function charger() { return Promise.all([fetch('data/sgi.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }), fetch('data/places.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).catch(function () { return null; })]); }

  /* ---------- Fenêtre « Entrer en relation » (régime A) ---------- */
  var dlg;
  function relation(s, pos, payee) {
    compte('sgi-relation-ouvrir');
    if (!dlg) { dlg = document.createElement('dialog'); dlg.className = 'vt-dlg vt'; document.body.appendChild(dlg); dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); }
    var c = s.contact || {}, rel = payee ? 'noopener sponsored' : 'noopener', L = [];
    function tel(x) { return String(x).replace(/[^\d+]/g, ''); }
    if (c.formulaire) L.push(['formulaire', 'Formulaire en ligne', c.formulaire]);
    if (c.whatsapp) L.push(['whatsapp', 'WhatsApp', 'https://wa.me/' + tel(c.whatsapp).replace('+', '')]);
    if (c.telephone) L.push(['tel', 'Appeler', 'tel:' + tel(c.telephone)]);
    if (c.email) L.push(['email', 'E-mail', 'mailto:' + c.email]);
    dlg.innerHTML = '<div class="vt-dlg-in"><button type="button" class="vt-fermer" aria-label="Fermer">×</button><h2>Contacter ' + esc(s.nom) + '</h2>'
      + '<p>Vous allez quitter EFA pour contacter directement ' + esc(s.nom) + '. EFA ne transmet aucune information vous concernant.</p>'
      + '<div class="vt-canaux">' + L.map(function (x) { return '<a href="' + esc(x[2]) + '" target="_blank" rel="' + rel + '" data-canal="' + x[0] + '">' + x[1] + '</a>'; }).join('') + '</div>'
      + (c.agence ? '<p class="vt-agence">Agence : ' + esc(c.agence) + '</p>' : '')
      + (!L.length && !c.agence ? '<p>Aucun moyen de contact communiqué pour le moment.</p>' : '')
      + '<p><a class="vt-lien" href="questions-a-poser-a-sa-sgi.html">Les questions à poser avant d’ouvrir un compte</a></p></div>';
    dlg.querySelector('.vt-fermer').onclick = function () { dlg.close(); };
    dlg.querySelectorAll('[data-canal]').forEach(function (a) { a.addEventListener('click', function () { evenement('clic_canal', s.id, pos, payee, a.dataset.canal); }); });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  window.EFA_VT = { relation: relation, charger: charger, esc: esc, v: v, ouiNon: ouiNon, fcfa: fcfa, dateFr: dateFr, NOMS: NOMS, compte: compte, evenement: evenement };

  /* ---------- Vitrine ---------- */
  var Z = document.getElementById('vt-liste'); if (!Z) return;
  compte('sgi-page');
  charger().then(function (r) {
    var D = r[0], PL = r[1], tous = D.sgi, par = {}; tous.forEach(function (s) { par[s.id] = s; });
    if (D.demo) document.getElementById('vt-demo').hidden = false;
    document.querySelectorAll('[data-maj]').forEach(function (x) { x.textContent = dateFr(D.maj); });
    var auj = new Date().toISOString().slice(0, 10), enPeriode = PL && PL.periode && auj >= PL.periode.debut && auj <= PL.periode.fin;
    var etiquette = PL && PL.type === 'annonce' ? 'Annonce' : 'Partenaire fondateur';
    var ordreRest = melange(tous.map(function (s) { return s.id; }), graine());
    var choix = [], fP = document.getElementById('vt-pays'), fD = document.getElementById('vt-dist'), bC = document.getElementById('vt-cmp');
    function majCmp() { bC.textContent = 'Comparer (' + choix.length + ')'; bC.disabled = choix.length < 2; }
    bC.onclick = function () { if (choix.length >= 2) { compte('sgi-comparer-ouvrir'); location.href = 'sgi-comparer.html?ids=' + choix.join(','); } };
    function carte(s, pos, payee) {
      var nom = esc(s.nom), ini = s.nom.replace(/^SGI\s+/i, '').split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      var f = s.frais || {}, a = s.acces || {}, sv = s.service || {}, c = s.contact || {};
      var h = '<article class="vt-carte" data-id="' + esc(s.id) + '">'
        + (payee ? '<div class="vt-etqs"><span class="vt-etq">' + etiquette + '</span></div>' : '')
        + '<div class="vt-id">' + (s.logo ? '<img class="vt-logo" src="' + esc(s.logo) + '" alt="">' : '<span class="vt-logo-v" aria-hidden="true">' + esc(ini) + '</span>') + '<h3>' + nom + '</h3></div>'
        + '<p class="vt-agr"><span>Agréée AMF-UMOA · n° ' + (s.agrement ? esc(s.agrement) : NC) + '</span><span class="vt-pays">' + (s.pays_couverts || []).map(function (p) { return '<i title="' + esc(NOMS[p] || p) + '">' + esc(p === 'Diaspora' ? 'Diaspora' : p) + '</i>'; }).join('') + '</span></p>'
        + '<div class="vt-reperes"><div><small>Minimum d’ouverture</small><b>' + fcfa(a.minimum_ouverture_fcfa) + '</b></div><div><small>Ouverture à distance</small><b>' + ouiNon(a.ouverture_distance) + '</b></div><div><small>Courtage</small><b>' + v(f.courtage) + '</b></div></div>'
        + '<div class="vt-fiche" id="fiche-' + esc(s.id) + '" hidden>'
        + '<section><h4>Frais</h4><dl><div><dt>Courtage</dt><dd>' + v(f.courtage) + '</dd></div><div><dt>Droits de garde</dt><dd>' + v(f.droits_garde) + '</dd></div><div><dt>Tenue de compte</dt><dd>' + v(f.tenue_compte) + '</dd></div><div><dt>Source</dt><dd>' + v(f.source) + '</dd></div></dl></section>'
        + '<section><h4>Accès</h4><dl><div><dt>Minimum</dt><dd>' + fcfa(a.minimum_ouverture_fcfa) + '</dd></div><div><dt>Ouverture à distance</dt><dd>' + ouiNon(a.ouverture_distance) + '</dd></div><div><dt>Délai</dt><dd>' + v(a.delai_ouverture) + '</dd></div></dl></section>'
        + '<section><h4>Service</h4><dl><div><dt>Application</dt><dd>' + ouiNon(sv.application) + '</dd></div><div><dt>Canaux</dt><dd>' + (sv.canaux && sv.canaux.length ? esc(sv.canaux.join(', ')) : NC) + '</dd></div><div><dt>Horaires</dt><dd>' + v(sv.horaires) + '</dd></div></dl></section>'
        + '<section><h4>Contact</h4><dl><div><dt>Téléphone</dt><dd>' + v(c.telephone) + '</dd></div><div><dt>WhatsApp</dt><dd>' + v(c.whatsapp) + '</dd></div><div><dt>E-mail</dt><dd>' + v(c.email) + '</dd></div><div><dt>Agence</dt><dd>' + v(c.agence) + '</dd></div></dl></section>'
        + '<p class="vt-relue">' + (s.relue && s.relue_le ? 'Fiche relue par la SGI le ' + dateFr(s.relue_le) + '.' : 'Fiche établie à partir d’informations publiques, non relue par la SGI.') + '</p></div>'
        + '<div class="vt-act"><button type="button" class="vt-voir" aria-expanded="false" aria-controls="fiche-' + esc(s.id) + '">Voir la fiche</button>'
        + '<label><input type="checkbox" class="vt-coche"' + (choix.indexOf(s.id) > -1 ? ' checked' : '') + '> Comparer <span class="sr" style="position:absolute;left:-9999px">' + nom + '</span></label>'
        + '<button type="button" class="vt-rel">Entrer en relation</button></div></article>';
      return h;
    }
    var vus = {};
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { var el = e.target; if (e.isIntersecting) { el._t = setTimeout(function () { if (!vus[el.dataset.id]) { vus[el.dataset.id] = 1; evenement('vue_carte', el.dataset.id, +el.dataset.pos, el.dataset.payee === '1'); } }, 1000); } else clearTimeout(el._t); });
    }, { threshold: .5 }) : null;
    function rendre() {
      var pays = fP.value, dist = fD.checked;
      function ok(s) { return (!pays || (s.pays_couverts || []).indexOf(pays) > -1) && (!dist || s.acces && s.acces.ouverture_distance === 'oui'); }
      var tete = [];
      if (enPeriode) (PL.places || []).slice().sort(function (a, b) { return a.rang - b.rang; }).slice(0, 3).forEach(function (p) { var s = p.sgi && par[p.sgi]; if (s && ok(s) && s.qualite_ok && tete.indexOf(s.id) < 0) tete.push(s.id); });
      var reste = ordreRest.filter(function (id) { return tete.indexOf(id) < 0 && ok(par[id]); });
      var ordre = tete.concat(reste);
      Z.innerHTML = ordre.length ? ordre.map(function (id, i) { return carte(par[id], i + 1, i < tete.length); }).join('') : '<p class="vt-chapo">Aucune SGI ne correspond à ces filtres.</p>';
      Z.querySelectorAll('.vt-carte').forEach(function (el, i) {
        var s = par[el.dataset.id], payee = i < tete.length; el.dataset.pos = i + 1; el.dataset.payee = payee ? '1' : '0';
        if (io) io.observe(el);
        el.querySelector('.vt-voir').onclick = function () { var f = el.querySelector('.vt-fiche'), o = f.hidden; f.hidden = !o; this.setAttribute('aria-expanded', o ? 'true' : 'false'); this.textContent = o ? 'Masquer la fiche' : 'Voir la fiche'; if (o) { compte('sgi-fiche'); evenement('vue_fiche', s.id, i + 1, payee); } };
        el.querySelector('.vt-coche').onchange = function () { var k = choix.indexOf(s.id); if (this.checked) { if (choix.length >= 4) { this.checked = false; var et = document.getElementById('vt-etat'); if (et) et.textContent = 'Vous pouvez comparer 4 SGI au plus.'; return; } if (k < 0) choix.push(s.id); evenement('ajout_comparer', s.id, i + 1, payee); } else if (k > -1) choix.splice(k, 1); var et2 = document.getElementById('vt-etat'); if (et2) et2.textContent = ''; majCmp(); };
        el.querySelector('.vt-rel').onclick = function () { relation(s, i + 1, payee); };
      });
      majCmp();
    }
    fP.onchange = function () { compte('sgi-filtre-pays'); rendre(); }; fD.onchange = rendre;
    rendre();
    var lo = document.querySelector('a[href="#ordre"]'); if (lo) lo.addEventListener('click', function () { compte('sgi-ordre-lire'); });
  }).catch(function () { Z.innerHTML = '<p class="vt-chapo">La liste n’a pas pu être chargée. Réessayez dans un instant.</p>'; });
})();
