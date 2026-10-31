/* EFA · Onglet Marchés : outils communs (navigation, chiffres, courbes SVG légères) et rendu des pages.
   Données : data/marches/ (fabriquées par scripts/brvm/marches.py après chaque séance). Aucun cours en séance. */
(function () {
  var MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  var PAYS = { CI: 'Côte d’Ivoire', SN: 'Sénégal', BJ: 'Bénin', BF: 'Burkina Faso', ML: 'Mali', NE: 'Niger', TG: 'Togo', GW: 'Guinée-Bissau' };
  var DRAP = { CI: '🇨🇮', SN: '🇸🇳', BJ: '🇧🇯', BF: '🇧🇫', ML: '🇲🇱', NE: '🇳🇪', TG: '🇹🇬', GW: '🇬🇼' };
  var SECT = ['Consommation de base', 'Consommation discrétionnaire', 'Énergie', 'Industriels', 'Services financiers', 'Services publics', 'Télécommunications'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nb(x, d) { if (x == null || isNaN(x)) return '<span class="mk-nc">Non communiqué</span>'; var p = (+x).toFixed(d || 0).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] ? ',' + p[1] : ''); }
  function vr(x) { if (x == null || isNaN(x)) return '<span class="mk-nc">Non communiqué</span>'; var c = x > 0 ? 'mk-up' : x < 0 ? 'mk-dn' : 'mk-eq'; return '<span class="mk-var ' + c + '">' + (x > 0 ? '+' : x < 0 ? '−' : '') + nb(Math.abs(x), 2) + ' %</span>'; }
  function date(d, long) { if (!d) return ''; var p = d.split('-'); return (+p[2] === 1 ? '1er' : +p[2]) + ' ' + (long ? ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'][+p[1] - 1] : MOIS[+p[1] - 1]) + ' ' + p[0]; }
  var ACC = [[/Cote D[’']Ivoire/g, 'Côte d’Ivoire'], [/\bSenegal\b/g, 'Sénégal'], [/\bBenin\b/g, 'Bénin'], [/\bSociete\b/g, 'Société'], [/\bGenerale\b/g, 'Générale'], [/\bIvoirienne\b/g, 'Ivoirienne'], [/\bTotalenergies\b/g, 'TotalEnergies'], [/\bCie\b/g, 'CIE'], [/\bSode\b/g, 'SODE'], [/\bSogb\b/g, 'SOGB'], [/\bSaph\b/g, 'SAPH'], [/\bSmb\b/g, 'SMB'], [/\bSitab\b/g, 'SITAB'], [/\bSetao\b/g, 'SETAO'], [/\bSafca\b/g, 'SAFCA'], [/\bSicor\b/g, 'SICOR'], [/\bCfao\b/g, 'CFAO'], [/\bBici\b/g, 'BICI'], [/\bNsia\b/g, 'NSIA'], [/\bOnatel\b/g, 'ONATEL'], [/\bNei-Ceda\b/g, 'NEI-CEDA'], [/\bSiem\b/g, 'SIEM'], [/\bUniwax\b/g, 'Uniwax']];
  function titre(s) { if (s.nom_court) return s.nom_court; var t = String(s.nom || s.code).toLowerCase().replace(/(^|[\s'’(-])([a-zà-ÿ])/g, function (m, a, b) { return a + b.toUpperCase(); }).replace(/\b(De|Du|Des|Et|La|Le|Pour|L’)\b/g, function (m) { return m.toLowerCase(); }); ACC.forEach(function (r) { t = t.replace(r[0], r[1]); }); return t.replace(/^./, function (c) { return c.toUpperCase(); }); }
  function compte(ev) { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function json(p) { return fetch(p, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw r; return r.json(); }); }
  /* Courbe : bleu nuit 2 px, zone à 6 % */
  /* Repère d'une date sur l'axe : jj/mm (et l'année si la courbe change d'année) */
  function jm(d, an) { var p = d.split('-'); return p[2] + '/' + p[1] + (an ? '/' + p[0].slice(2) : ''); }
  function reperes(n, max) { if (n <= max) { var t = []; for (var i = 0; i < n; i++) t.push(i); return t; } var r = [], pas = (n - 1) / (max - 1); for (var k = 0; k < max; k++) r.push(Math.round(k * pas)); return r; }
  /* Courbe : bleu nuit 2 px, zone à 6 %, avec l'axe des dates (un repère par séance, ou espacés si la période est longue) */
  function spark(vals, w, h, label, dates) {
    if (!vals || vals.length < 2) return '<svg class="mk-spark" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Historique insuffisant pour une courbe"><text x="0" y="' + (h - 6) + '" font-size="11" fill="#7a8293">Historique en cours de constitution</text></svg>';
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), r = mx - mn || 1, n = vals.length;
    var pts = vals.map(function (v, i) { return [(i / (n - 1)) * w, h - 3 - ((v - mn) / r) * (h - 6)]; });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var R = dates && dates.length === n ? reperes(n, n <= 7 ? 7 : (w > 260 ? 7 : 5)) : [], an = dates && dates.length && dates[0].slice(0, 4) !== dates[n - 1].slice(0, 4);
    var grille = R.map(function (i) { var x = (i / (n - 1)) * w; return '<line x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="0" y2="' + h + '" stroke="#dfe6ee" stroke-width="1" vector-effect="non-scaling-stroke"/>'; }).join('');
    var svg = '<svg class="mk-spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="' + esc(label || '') + '">' + grille + '<path d="' + d + ' L' + w + ' ' + h + ' L0 ' + h + ' Z" fill="rgba(11,18,32,.06)"/><path d="' + d + '" fill="none" stroke="#0b1220" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';
    if (!R.length) return svg;
    return '<div class="mk-sp">' + svg + '<div class="mk-axe" aria-hidden="true">' + R.map(function (i, k) { var pc = (i / (n - 1)) * 100; return '<span class="' + (k === 0 ? 'g' : k === R.length - 1 ? 'd' : '') + '" style="left:' + pc.toFixed(2) + '%">' + jm(dates[i], an) + '</span>'; }).join('') + '</div></div>';
  }
  /* Période d'une courbe, en clair */
  function court(d) { var p = d.split('-'); return (+p[2] === 1 ? '1er' : +p[2]) + ' ' + MOIS[+p[1] - 1]; }
  function periode(d1, d2, n) { if (!d1 || !d2) return ''; var a = d1.slice(0, 4) === d2.slice(0, 4) ? court(d1) : date(d1); return 'Du ' + a + ' au ' + date(d2) + (n ? ' · ' + n + ' séance' + (n > 1 ? 's' : '') : ''); }
  /* Couleur des tuiles de secteur : 5 paliers de −3 % à +3 % */
  var PAL = [[-1e9, -1.5, '#f2c4c0'], [-1.5, -0.25, '#f8e1de'], [-0.25, 0.25, '#eef1f5'], [0.25, 1.5, '#d8f2e3'], [1.5, 1e9, '#b4e8cb']];
  function teinte(x) { for (var i = 0; i < PAL.length; i++) if (x >= PAL[i][0] && x < PAL[i][1]) return PAL[i][2]; return '#eef1f5'; }
  function legende() { return '<div class="mk-legende" aria-hidden="true"><span>−3 %</span>' + PAL.map(function (p) { return '<i style="background:' + p[2] + '"></i>'; }).join('') + '<span>+3 %</span></div>'; }
  window.EFA_MK = { periode: periode, esc: esc, nb: nb, vr: vr, date: date, titre: titre, spark: spark, compte: compte, json: json, PAYS: PAYS, DRAP: DRAP, SECT: SECT, teinte: teinte, legende: legende };

  /* Bandeau de séance */
  function seance(d) {
    var el = document.getElementById('mk-seance'); if (!el) return;
    var auj = new Date(), iso = auj.toISOString().slice(0, 10), h = auj.getUTCHours();
    var msg = 'Séance du <b>' + date(d, true) + '</b> · cours de clôture officiels';
    if (d < iso && auj.getUTCDay() > 0 && auj.getUTCDay() < 6 && h < 19) msg = 'Les cours du jour seront publiés après la clôture. Voici ceux du <b>' + date(d, true) + '</b>.';
    else if (d < iso) msg += ' · dernière séance disponible';
    el.innerHTML = msg;
  }

  /* ---------- Page « Aujourd'hui » ---------- */
  var J = document.getElementById('mk-jour');
  if (J) {
    compte('marches-page');
    Promise.all([json('data/marches/jour.json'), json('data/marches/societes.json')]).then(function (r) {
      var j = r[0], S = {}; r[1].societes.forEach(function (s) { S[s.code] = s; }); seance(j.date);
      document.getElementById('mk-indices').innerHTML = j.indices.map(function (i) {
        return '<div class="mk-carte" role="group" aria-label="' + esc(i.nom) + '"><span class="mk-ind-nom">' + esc(i.nom.replace('BRVM - ', 'BRVM ').replace('BRVM-30', 'BRVM 30')) + '</span><strong class="mk-ind-niv">' + nb(i.niveau, 2) + '</strong>'
          + '<div class="mk-ligne"><span>Jour ' + vr(i.var_jour) + '</span><span>Depuis le 1er janvier ' + vr(i.var_ytd) + '</span></div>' + spark(i.serie.map(function (x) { return x[1]; }), 300, 56, 'Évolution de ' + i.nom, i.serie.map(function (x) { return x[0]; })) + (function () { var v = i.serie.map(function (x) { return x[1]; }); return '<p class="mk-per">' + periode(i.serie[0][0], i.serie[i.serie.length - 1][0], i.serie.length) + ' · un point par séance (clôture)<br>Plus haut ' + nb(Math.max.apply(null, v), 2) + ' · plus bas ' + nb(Math.min.apply(null, v), 2) + '</p>'; })() + '</div>';
      }).join('');
      document.getElementById('mk-secteurs').innerHTML = j.secteurs.map(function (s) {
        var n = ({ 'CONSOMMATION DE BASE': 'Consommation de base', 'CONSOMMATION DISCRETIONNAIRE': 'Consommation discrétionnaire', 'ENERGIE': 'Énergie', 'INDUSTRIELS': 'Industriels', 'SERVICES FINANCIERS': 'Services financiers', 'SERVICES PUBLICS': 'Services publics', 'TELECOMMUNICATIONS': 'Télécommunications' })[s.nom.replace('BRVM - ', '')] || s.nom;
        return '<button type="button" class="mk-tuile" style="background:' + teinte(s.var_jour) + '" data-s="' + esc(n) + '"><b>' + esc(n) + '</b><span>' + vr(s.var_jour) + '</span></button>';
      }).join('') ;
      document.getElementById('mk-legende').innerHTML = legende();
      document.querySelectorAll('.mk-tuile').forEach(function (b) { b.onclick = function () { compte('marches-secteur'); location.href = 'societes.html?secteur=' + encodeURIComponent(b.dataset.s); }; });
      function liste(codes, champ) { return '<ol>' + codes.map(function (c) { var s = S[c]; return '<li><a href="societe.html?c=' + c + '"><b>' + esc(titre(s)) + '</b>' + (champ === 'valeur' ? '<span>' + nb(s.valeur_echangee / 1e6, 1) + ' M FCFA</span>' : vr(s.var_jour)) + '</a></li>'; }).join('') + '</ol>'; }
      document.getElementById('mk-hausses').insertAdjacentHTML('beforeend', liste(j.hausses));
      document.getElementById('mk-baisses').insertAdjacentHTML('beforeend', liste(j.baisses));
      document.getElementById('mk-volumes').insertAdjacentHTML('beforeend', liste(j.volumes, 'valeur'));
    }).catch(function () { J.insertAdjacentHTML('afterbegin', '<p class="mk-sous">Les données de la séance n’ont pas pu être chargées. Réessayez dans un instant.</p>'); });
  }

  /* ---------- Annuaire ---------- */
  var A = document.getElementById('mk-annuaire');
  if (A) {
    compte('societes-page');
    json('data/marches/societes.json').then(function (d) {
      seance(d.date);
      var L = d.societes, q = document.getElementById('mk-q'), fp = document.getElementById('mk-pays'), fs = document.getElementById('mk-sect'), tri = document.getElementById('mk-tri'), vue = document.getElementById('mk-vue'), tab = false;
      fp.innerHTML = '<option value="">Tous les pays</option>' + Object.keys(PAYS).filter(function (k) { return L.some(function (s) { return s.pays === k; }); }).map(function (k) { return '<option value="' + k + '">' + PAYS[k] + '</option>'; }).join('');
      fs.innerHTML = '<option value="">Tous les secteurs</option>' + SECT.map(function (s) { return '<option>' + s + '</option>'; }).join('');
      var u = new URLSearchParams(location.search); if (u.get('secteur')) fs.value = u.get('secteur'); if (u.get('pays')) fp.value = u.get('pays');
      var LIB = { nom: 'nom', jour: 'variation du jour', a1: 'variation sur 1 an (calcul EFA)', cap: 'capitalisation (calcul EFA)' };
      function rendre() {
        var t = (q.value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        var R = L.filter(function (s) { var h = (s.nom + ' ' + s.code + ' ' + (s.nom_court || '')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); return (!t || h.indexOf(t) > -1) && (!fp.value || s.pays === fp.value) && (!fs.value || s.secteur === fs.value); });
        var k = tri.value;
        R.sort(function (a, b) { if (k === 'nom') return titre(a).localeCompare(titre(b), 'fr'); var va = k === 'jour' ? a.var_jour : k === 'a1' ? a.perf.a1 : a.capitalisation, vb = k === 'jour' ? b.var_jour : k === 'a1' ? b.perf.a1 : b.capitalisation; if (va == null) return 1; if (vb == null) return -1; return vb - va; });
        document.getElementById('mk-tri-lib').textContent = 'Trié par : ' + LIB[k] + ' · ' + R.length + ' société' + (R.length > 1 ? 's' : '') + ' · Courbes : un point par séance (cours de clôture), sur les 3 derniers mois ou depuis le début de l’historique d’EFA s’il est plus court.';
        A.innerHTML = !R.length ? '<p class="mk-sous">Aucune société ne correspond.' + (fs.value ? ' Le secteur de chaque société est en cours de saisie.' : '') + '</p>' : tab
          ? '<table class="mk-tab"><thead><tr><th>Société</th><th>Code</th><th>Cours</th><th>Jour</th><th>1 an</th><th>Capitalisation</th></tr></thead><tbody>' + R.map(function (s) { return '<tr><td><a class="mk-lien" href="societe.html?c=' + s.code + '">' + esc(titre(s)) + '</a></td><td>' + s.code + '</td><td>' + nb(s.cours) + '</td><td>' + vr(s.var_jour) + '</td><td>' + vr(s.perf.a1) + '</td><td>' + (s.capitalisation ? nb(s.capitalisation / 1e9, 1) + ' Md' : '<span class="mk-nc">Non communiqué</span>') + '</td></tr>'; }).join('') + '</tbody></table>'
          : '<div class="mk-soc">' + R.map(function (s) { return '<a href="societe.html?c=' + s.code + '"><div class="mk-soc-h"><b>' + esc(titre(s)) + '</b><span class="mk-code">' + s.code + '</span></div><div class="mk-ligne"><span>' + (DRAP[s.pays] || '') + ' ' + esc(PAYS[s.pays] || '') + '</span><span>' + (s.secteur ? esc(s.secteur) : '<span class="mk-nc">Secteur à compléter</span>') + '</span></div><div class="mk-soc-c"><strong>' + nb(s.cours) + ' FCFA</strong>' + vr(s.var_jour) + '</div>' + spark(s.mini, 240, 38, 'Cours de ' + titre(s) + ', ' + periode(s.mini_du, s.date, s.mini.length), s.mini_d) + '<span class="mk-per">' + periode(s.mini_du, s.date, s.mini.length) + ' · un point par séance</span></a>'; }).join('') + '</div>';
      }
      [q, fp, fs, tri].forEach(function (x) { x.addEventListener('input', function () { if (x !== q) compte(x === tri ? 'societes-tri' : 'societes-filtre'); rendre(); }); });
      vue.onclick = function () { tab = !tab; vue.textContent = tab ? 'Vue cartes' : 'Vue tableau'; rendre(); };
      rendre();
    });
  }

  /* ---------- Fiche société ---------- */
  var F = document.getElementById('mk-fiche');
  if (F) {
    var code = (new URLSearchParams(location.search).get('c') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!code) { location.href = 'societes.html'; return; }
    compte('fiche-' + code);
    json('data/marches/fiches/' + code + '.json').then(function (s) {
      seance(s.date); document.title = titre(s) + ' (' + s.code + ') · Marchés · EFA';
      document.getElementById('mk-nom').textContent = titre(s);
      document.getElementById('mk-meta').innerHTML = s.code + ' · ' + (DRAP[s.pays] || '') + ' ' + esc(PAYS[s.pays] || '') + ' · ' + (s.secteur ? esc(s.secteur) : '<span class="mk-nc">secteur à compléter</span>');
      document.getElementById('mk-cours').innerHTML = '<span class="mk-cours">' + nb(s.cours) + ' FCFA</span><div class="mk-ligne"><span>' + vr(s.var_jour) + '</span><span>clôture du ' + date(s.date, true) + '</span></div>';
      var H = s.historique, J0 = new Date(s.date), per = [['1M', 30], ['6M', 182], ['1A', 365], ['5A', 1826], ['Tout', 1e6]];
      var dispo = per.filter(function (p, i) { if (p[0] === 'Tout') return true; var lim = new Date(J0 - p[1] * 864e5).toISOString().slice(0, 10); return H.length && H[0][0] <= lim; });
      if (!dispo.some(function (p) { return p[0] !== 'Tout'; })) dispo = [['Tout', 1e6]];
      var P = document.getElementById('mk-periodes'), G = document.getElementById('mk-g'), bulle = document.getElementById('mk-bulle');
      function trace(p) {
        var lim = p[1] > 1e5 ? '0000' : new Date(J0 - p[1] * 864e5).toISOString().slice(0, 10), pts = H.filter(function (x) { return x[0] >= lim; });
        if (pts.length < 2) { G.innerHTML = '<text x="10" y="40" font-size="14" fill="#7a8293">L’historique est en cours de constitution : la courbe s’affichera après quelques séances.</text>'; return; }
        var W = Math.max(300, Math.round(G.getBoundingClientRect().width) || 800), Hh = 260, hv = 50, mn = Math.min.apply(null, pts.map(function (x) { return x[1]; })), mx = Math.max.apply(null, pts.map(function (x) { return x[1]; })), r = mx - mn || 1, vm = Math.max.apply(null, pts.map(function (x) { return x[2]; })) || 1;
        var X = function (i) { return (i / (pts.length - 1)) * W; }, Y = function (v) { return 14 + (1 - (v - mn) / r) * (Hh - hv - 34); };
        var d = pts.map(function (x, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(x[1]).toFixed(1); }).join(' ');
        var g = [mn, mn + r / 2, mx].map(function (v) { return '<text x="' + (W - 4) + '" y="' + (Y(v) - 4) + '" text-anchor="end" font-size="11" fill="#7a8293">' + nb(v) + '</text><line x1="0" x2="' + W + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#eef2f6"/>'; }).join('');
        var bars = pts.map(function (x, i) { var bh = (x[2] / vm) * (hv - 6); return '<rect x="' + (X(i) - 1.5) + '" y="' + (Hh - bh) + '" width="3" height="' + bh + '" fill="#c9d3df"/>'; }).join('');
        var cap = document.getElementById('mk-percap'); if (!cap) { cap = document.createElement('p'); cap.id = 'mk-percap'; cap.className = 'mk-per'; G.parentNode.insertBefore(cap, G.nextSibling); }
        cap.innerHTML = (s.ajustements && s.ajustements.length ? '<span class="mk-aj">Cours antérieurs ajustés : ' + s.ajustements.map(function (a) { return a.facteur >= 1 ? 'fractionnement du ' + date(a.date, true) + ' (1 action ancienne = ' + nb(a.facteur) + ' nouvelles)' : 'regroupement du ' + date(a.date, true); }).join(', ') + '.</span>' : '') + '<span class="mk-d">' + date(pts[0][0]) + '</span><span class="mk-pa">Période affichée : ' + periode(pts[0][0], pts[pts.length - 1][0], pts.length) + ' · un point par séance (cours de clôture en FCFA), barres grises : volumes échangés</span><span class="mk-d">' + date(pts[pts.length - 1][0]) + '</span>';
        var an = pts[0][0].slice(0, 4) !== pts[pts.length - 1][0].slice(0, 4), RR = reperes(pts.length, W > 600 ? 9 : 5);
        var axe = '<line x1="0" x2="' + W + '" y1="' + Hh + '" y2="' + Hh + '" stroke="#c9d3df"/>' + RR.map(function (i, k) { var x = X(i), a = k === 0 ? 'start' : k === RR.length - 1 ? 'end' : 'middle'; return '<line x1="' + x + '" x2="' + x + '" y1="' + Hh + '" y2="' + (Hh + 5) + '" stroke="#8e9bb0"/><line x1="' + x + '" x2="' + x + '" y1="0" y2="' + Hh + '" stroke="#eef2f6"/><text x="' + x + '" y="' + (Hh + 19) + '" text-anchor="' + a + '" font-size="12" fill="#5f6676">' + jm(pts[i][0], an) + '</text>'; }).join('');
        G.setAttribute('viewBox', '0 0 ' + W + ' ' + (Hh + 24));
        G.setAttribute('aria-label', 'Cours de ' + titre(s) + ' du ' + date(pts[0][0], true) + ' au ' + date(pts[pts.length - 1][0], true) + ' : de ' + nb(pts[0][1]) + ' à ' + nb(pts[pts.length - 1][1]) + ' FCFA');
        G.innerHTML = axe + g + bars + '<path d="' + d + ' L' + W + ' ' + (Hh - hv) + ' L0 ' + (Hh - hv) + ' Z" fill="rgba(11,18,32,.06)"/><path d="' + d + '" fill="none" stroke="#0b1220" stroke-width="2"/><line id="mk-cur" y1="0" y2="' + Hh + '" stroke="#da3c1b" stroke-width="1" opacity="0"/>';
        function bouge(e) { var b = G.getBoundingClientRect(), x = ((e.touches ? e.touches[0].clientX : e.clientX) - b.left) / b.width, i = Math.max(0, Math.min(pts.length - 1, Math.round(x * (pts.length - 1)))), c = document.getElementById('mk-cur'); c.setAttribute('x1', X(i)); c.setAttribute('x2', X(i)); c.setAttribute('opacity', 1); bulle.innerHTML = date(pts[i][0], true) + ' · <b>' + nb(pts[i][1]) + ' FCFA</b> · ' + vr((pts[i][1] / pts[0][1] - 1) * 100) + ' depuis le début de la période'; }
        G.onpointermove = bouge; G.ontouchmove = bouge; G.onpointerleave = function () { bulle.innerHTML = ''; var c = document.getElementById('mk-cur'); if (c) c.setAttribute('opacity', 0); };
      }
      P.innerHTML = dispo.map(function (p, i) { return '<button type="button" aria-pressed="' + (i === dispo.length - 1 ? 'true' : 'false') + '" data-i="' + i + '">' + ({ '1M': '1 mois', '6M': '6 mois', '1A': '1 an', '5A': '5 ans', 'Tout': 'Depuis le ' + court(H[0][0]) })[p[0]] + '</button>'; }).join('');
      P.querySelectorAll('button').forEach(function (b) { b.onclick = function () { P.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); compte('fiche-periode'); trace(dispo[+b.dataset.i]); }; });
      trace(dispo[dispo.length - 1]);
      var pf = s.perf; document.getElementById('mk-perf').innerHTML = [['1 semaine', pf.s1], ['1 mois', pf.m1], ['Depuis le 1er janvier', pf.ytd], ['1 an', pf.a1], ['5 ans', pf.a5]].map(function (x) { return '<div><span class="mk-et">' + x[0] + '</span><b>' + vr(x[1]) + '</b></div>'; }).join('');
      var id = s.identite || {}, va = function (o) { return o && o.valeur != null ? o.valeur : null; };
      document.getElementById('mk-ident').innerHTML = [['Introduction en Bourse', id.date_introduction ? date(id.date_introduction, true) : null], ['Nombre d’actions', va(id.nombre_actions) != null ? nb(va(id.nombre_actions)) : null], ['Flottant', va(id.flottant_pct) != null ? nb(va(id.flottant_pct), 2) + ' %' : null], ['Capitalisation (calcul EFA)', s.capitalisation ? nb(s.capitalisation / 1e9, 1) + ' Md FCFA' : null], ['Site de la société', id.site ? '<a class="mk-lien" href="' + esc(id.site) + '" target="_blank" rel="noopener">Ouvrir</a>' : null]].map(function (x) { return '<div><span class="mk-et">' + x[0] + '</span><b>' + (x[1] == null ? '<span class="mk-nc">Non communiqué</span>' : x[1]) + '</b></div>'; }).join('');
      var bref = document.getElementById('mk-bref'); if (s.texte_efa && !s.texte_bloque) bref.innerHTML = '<h2>En bref</h2><p class="mk-sous">' + esc(s.texte_efa) + '</p>'; else bref.remove();
    }).catch(function () { F.innerHTML = '<p class="mk-sous">Cette société est introuvable. <a class="mk-lien" href="societes.html">Voir toutes les sociétés</a></p>'; });
  }
})();
