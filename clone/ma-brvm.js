/* EFA · Ma BRVM : cinq outils pour explorer la Bourse (BRVM) avec ses propres chiffres.
   1. Si j'avais investi…   2. Quand êtes-vous entré ?   3. Comparateur   4. Mon portefeuille   5. Décryptages
   Données : data/marches/ (societes.json, jour.json, fiches/CODE.json), produites par scripts/brvm/marches.py
   à partir des cours de clôture officiels. Cours ajustés des fractionnements et des actions gratuites ;
   dividendes nets par action ramenés au nombre d'actions d'aujourd'hui.
   Rien de ce que saisit le visiteur n'est envoyé : le portefeuille reste dans son navigateur. */
(function () {
  'use strict';
  var MK = null;
  var $ = function (id) { return document.getElementById(id); };
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var MC = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  var COUL = ['#0B1220', '#DA3C1B', '#1B71B2'];
  var HORS_DECRYPTAGE = {}; // décision d'Élysée (21/11/2026) : Sonatel et Orange CI figurent dans les classements et décryptages de Ma BRVM
  var SOC = [], CODES = {}, COMPO = null, TR = null, FICHES = {}, DERNIER = '';

  /* ---------- Petits outils ---------- */
  function f0(x) { return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace('-', '−'); }
  function fF(x) { return f0(x) + ' F'; }
  function sF(x) { return (x > 0 ? '+' : x < 0 ? '−' : '') + f0(Math.abs(x)) + ' F'; }
  function pc(x, d) { if (x == null || isNaN(x)) return '—'; return (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toFixed(d == null ? 1 : d).replace('.', ',') + ' %'; }
  function pts(x) { if (x == null || isNaN(x)) return '—'; var a = Math.abs(x); return (x > 0 ? '+' : x < 0 ? '−' : '') + a.toFixed(1).replace('.', ',') + ' point' + (a >= 2 ? 's' : ''); }
  function cl(x) { return x > 0 ? 'mb-up' : x < 0 ? 'mb-dn' : ''; }
  function dt(d) { if (!d) return ''; var p = d.split('-'); return (+p[2] === 1 ? '1er' : +p[2]) + ' ' + MOIS[+p[1] - 1] + ' ' + p[0]; }
  function dc(d) { var p = d.split('-'); return +p[2] + ' ' + MC[+p[1] - 1] + ' ' + p[0]; }
  function num(v) { var x = parseFloat(String(v == null ? '' : v).replace(/[\s  ]/g, '').replace(',', '.')); return isNaN(x) ? null : x; }
  function esc(s) { return MK.esc(s); }
  function nom(code) { return CODES[code] ? MK.titre(CODES[code]) : code; }
  function premierApres(serie, d0) { for (var i = 0; i < serie.length; i++) if (serie[i][0] >= d0) return i; return -1; }
  function dernierAvant(serie, d1) { for (var i = serie.length - 1; i >= 0; i--) if (serie[i][0] <= d1) return i; return -1; }
  function decale(d, mois) { var x = new Date(d + 'T12:00:00Z'); x.setUTCMonth(x.getUTCMonth() + mois); return x.toISOString().slice(0, 10); }
  function fiche(code) {
    if (FICHES[code]) return Promise.resolve(FICHES[code]);
    return MK.json('data/marches/fiches/' + code + '.json').then(function (f) { FICHES[code] = f; return f; });
  }
  function serieCours(f) { return f.historique.map(function (x) { return [x[0], x[1]]; }); }
  function opsTexte(ops) {
    return ops.map(function (a) {
      var t = a.type || '';
      var q = t.indexOf('fraction') >= 0 ? 'le fractionnement ' + (a.facteur >= 2 ? a.facteur + ' pour 1 ' : '') : t.indexOf('gratuite') >= 0 ? 'les actions gratuites ' : t.indexOf('droit') >= 0 || t.indexOf('capital') >= 0 ? 'l’augmentation de capital ' : 'l’opération ';
      return q + 'du ' + dt(a.date);
    }).join(' et ');
  }
  function options(sel, avecIndice, valeur) {
    sel.innerHTML = (avecIndice ? '<option value="IDX">BRVM Composite (tout le marché)</option>' : '') +
      SOC.map(function (s) { return '<option value="' + esc(s.code) + '">' + esc(MK.titre(s)) + ' (' + esc(s.code) + ')</option>'; }).join('');
    if (valeur) sel.value = valeur;
  }
  function valeurIndice(serie, d) { var i = dernierAvant(serie, d); return i < 0 ? null : serie[i][1]; }
  function perfIndice(serie, d0, d1) {
    var i0 = premierApres(serie, d0), i1 = dernierAvant(serie, d1);
    if (i0 < 0 || i1 < 0 || i1 <= i0) return null;
    return (serie[i1][1] / serie[i0][1] - 1) * 100;
  }
  /* Baisse maximale : le pire recul entre un plus haut et un plus bas qui le suit */
  function baisseMax(serie) {
    var haut = serie[0], pire = 0, de = null, a = null;
    for (var i = 1; i < serie.length; i++) {
      if (serie[i][1] > haut[1]) haut = serie[i];
      var b = (serie[i][1] / haut[1] - 1) * 100;
      if (b < pire) { pire = b; de = haut[0]; a = serie[i][0]; }
    }
    return { pct: pire, de: de, a: a };
  }

  /* ---------- « EFA analyse » : quelques secondes visibles avant le résultat ---------- */
  // etapes : [[libellé, détail chiffré]] ; chaque étape s'affiche, se coche, puis la suivante démarre.
  function analyse(out, etapes, fin) {
    var rapide = false; try { rapide = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var pas = rapide ? 220 : 620, n = etapes.length;
    out.innerHTML = '<div class="mb-analyse" role="status" aria-live="polite"><div class="mb-an-tete"><span class="mb-roue" aria-hidden="true"></span><div><p class="mb-k">EFA analyse</p><p class="mb-an-t">Reconstitution de l’opération, séance par séance…</p></div></div>' +
      '<div class="mb-barre"><i style="width:0"></i></div><ol class="mb-etapes">' + etapes.map(function (e) { return '<li><span class="mb-coche" aria-hidden="true"></span><b>' + e[0] + '</b><small>' + (e[1] || '') + '</small></li>'; }).join('') + '</ol></div>';
    var L = out.querySelectorAll('.mb-etapes li'), barre = out.querySelector('.mb-barre i'), i = 0;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    (function suivant() {
      if (i > 0) L[i - 1].className = 'mb-fait';
      if (i < n) { L[i].className = 'mb-encours'; barre.style.width = Math.round((i + 1) / n * 100) + '%'; i++; setTimeout(suivant, pas + Math.random() * 180); }
      else setTimeout(fin, rapide ? 100 : 350);
    })();
  }

  /* ---------- Courbes (SVG, sans bibliothèque) ---------- */
  // series : [{nom, coul, pts:[[date, valeur]], tirets}] ; opts : {ref (ligne horizontale), marque (date), h}
  function courbe(series, opts) {
    opts = opts || {};
    var w = 720, h = opts.h || 230, pg = 54, ph = 10, pb = 10;
    var dates = {}; series.forEach(function (s) { s.pts.forEach(function (p) { dates[p[0]] = 1; }); });
    var D = Object.keys(dates).sort(), n = D.length; if (n < 2) return '';
    var pos = {}; D.forEach(function (d, i) { pos[d] = i; });
    var vals = []; series.forEach(function (s) { s.pts.forEach(function (p) { if (p[1] != null) vals.push(p[1]); }); });
    if (opts.ref != null) vals.push(opts.ref);
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), rg = (mx - mn) || 1; mn -= rg * .04; mx += rg * .04; rg = mx - mn;
    function X(i) { return (pg + i / (n - 1) * (w - pg - 8)).toFixed(1); }
    function Y(v) { return (ph + (1 - (v - mn) / rg) * (h - ph - pb)).toFixed(1); }
    var g = '';
    [mn + rg * .08, mn + rg / 2, mx - rg * .08].forEach(function (v) {
      g += '<line x1="' + pg + '" x2="' + w + '" y1="' + Y(v) + '" y2="' + Y(v) + '" class="mb-grille"/><text x="' + (pg - 8) + '" y="' + (+Y(v) + 4) + '" class="mb-ax" text-anchor="end">' + (opts.fmt ? opts.fmt(v) : f0(v)) + '</text>';
    });
    if (opts.ref != null) g += '<line x1="' + pg + '" x2="' + w + '" y1="' + Y(opts.ref) + '" y2="' + Y(opts.ref) + '" class="mb-ref"/>';
    if (opts.marque && pos[opts.marque] != null) g += '<line x1="' + X(pos[opts.marque]) + '" x2="' + X(pos[opts.marque]) + '" y1="' + ph + '" y2="' + (h - pb) + '" class="mb-marque"/>';
    series.forEach(function (s) {
      var d = '', on = false;
      s.pts.forEach(function (p) { if (p[1] == null) return; d += (on ? 'L' : 'M') + X(pos[p[0]]) + ' ' + Y(p[1]); on = true; });
      g += '<path d="' + d + '" fill="none" stroke="' + s.coul + '" stroke-width="' + (s.fin ? 1.6 : 2.4) + '"' + (s.tirets ? ' stroke-dasharray="5 4"' : '') + ' stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';
    });
    (opts.points || []).forEach(function (p) {
      if (pos[p.d] == null) return;
      g += '<circle cx="' + X(pos[p.d]) + '" cy="' + Y(p.v) + '" r="5.5" fill="' + p.coul + '" stroke="#fff" stroke-width="2"/>';
    });
    var leg = series.map(function (s) { return '<span><i style="border-top:3px ' + (s.tirets ? 'dashed' : 'solid') + ' ' + s.coul + '"></i>' + esc(s.nom) + '</span>'; }).join('') +
      (opts.ref != null && opts.refNom ? '<span><i class="mb-i-ref"></i>' + esc(opts.refNom) + '</span>' : '');
    return '<div class="mb-courbe"><svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.label || 'Courbe') + '">' + g + '</svg>' +
      '<div class="mb-axe"><span>' + dc(D[0]) + '</span><span>' + dc(D[n - 1]) + '</span></div><p class="mb-leg">' + leg + '</p></div>';
  }

  /* ---------- Chargement ---------- */
  function charger() {
    return Promise.all([MK.json('data/marches/societes.json'), MK.json('data/marches/jour.json')]).then(function (r) {
      SOC = r[0].societes.slice().sort(function (a, b) { return MK.titre(a).localeCompare(MK.titre(b), 'fr'); });
      SOC.forEach(function (s) { CODES[s.code] = s; });
      var j = r[1];
      COMPO = (j.indices || []).filter(function (i) { return i.nom === 'BRVM - COMPOSITE'; })[0];
      TR = j.total_return && j.total_return.serie && j.total_return.serie.length ? j.total_return : null;
      DERNIER = COMPO.serie[COMPO.serie.length - 1][0];
      $('mb-seance').innerHTML = 'Cours de clôture officiels du ' + dt(COMPO.serie[0][0]) + ' au <b>' + dt(DERNIER) + '</b> · ' + SOC.length + ' sociétés cotées';
    });
  }

  /* =========================================================
     1. SI J'AVAIS INVESTI…
     ========================================================= */
  function initInvesti(q) {
    var sel = $('si-titre'); options(sel, true, q.c && (CODES[q.c] || q.c === 'IDX') ? q.c : 'SGBC');
    var S = COMPO.serie, d = $('si-date'), d1 = $('si-fin');
    d.min = d1.min = S[0][0]; d.max = d1.max = DERNIER;
    d.value = q.d && q.d >= S[0][0] && q.d < DERNIER ? q.d : decale(DERNIER, -12);
    d1.value = q.f && q.f > d.value && q.f <= DERNIER ? q.f : DERNIER;
    if (q.m && num(q.m)) $('si-montant').value = f0(num(q.m));
    $('si-form').addEventListener('submit', function (e) { e.preventDefault(); calculer(true); });
    [sel, d, d1].forEach(function (el) { el.addEventListener('change', function () { calculer(false); }); });
    calculer(false);
  }

  function calculer(defiler) {
    var code = $('si-titre').value, M = num($('si-montant').value), d0 = $('si-date').value, dFin = $('si-fin').value || DERNIER;
    var fa = (num($('si-fa').value) || 0) / 100, fv = (num($('si-fv').value) || 0) / 100, g = (num($('si-garde').value) || 0) / 100;
    var out = $('si-res');
    if (!M || M < 1000) { out.innerHTML = '<p class="mb-err">Indiquez un montant d’au moins 1 000 F.</p>'; return; }
    if (!d0 || !dFin || dFin <= d0) { out.innerHTML = '<p class="mb-err">La date de revente doit venir après la date d’achat.</p>'; return; }
    var I = COMPO.serie, i0 = premierApres(I, d0), i1 = dernierAvant(I, dFin);
    if (i0 < 0 || i1 <= i0) { out.innerHTML = '<p class="mb-err">Choisissez des dates entre le ' + dt(I[0][0]) + ' et le ' + dt(DERNIER) + '.</p>'; return; }
    var idx = I.slice(i0, i1 + 1);
    if (code === 'IDX') {
      if (!defiler) { rendreIndice(M, fa, fv, g, idx); return; }
      analyse(out, [['Lecture de l’indice', 'BRVM Composite, ' + f0(idx.length) + ' séances du ' + dc(idx[0][0]) + ' au ' + dc(idx[idx.length - 1][0])],
        ['Frais d’achat, de vente et de garde', 'appliqués au montant de ' + fF(M)], ['Dividendes réinvestis', TR && TR.serie[0][0] <= idx[0][0] ? 'Composite Total Return' : 'indice publié seulement depuis le 2 janvier 2026'],
        ['Pire passage', pc(baisseMax(idx).pct)]], function () { rendreIndice(M, fa, fv, g, idx); });
      return;
    }
    out.innerHTML = '<p class="mb-attente">Calcul en cours…</p>';
    fiche(code).then(function (f) {
      var H = serieCours(f), k0 = premierApres(H, d0), k1 = dernierAvant(H, dFin);
      if (k0 < 0 || k1 <= k0) { out.innerHTML = '<p class="mb-err">Pas de cours pour ' + esc(MK.titre(f)) + ' sur cette période. Cette société est peut-être entrée en Bourse plus tard.</p>'; return; }
      var h = H.slice(k0, k1 + 1), jAchat = h[0][0], jFin = h[h.length - 1][0], P0 = h[0][1], P1 = h[h.length - 1][1];
      var annees = (new Date(jFin) - new Date(jAchat)) / (365.25 * 864e5);
      // Opérations sur titres : le cours affiché à l'époque = cours ajusté × facteur des opérations postérieures
      var opsApres = (f.ajustements || []).filter(function (a) { return a.ajuste !== false && a.date > jAchat; });
      var opsPeriode = opsApres.filter(function (a) { return a.date <= jFin; });
      var K = opsApres.reduce(function (p, a) { return p * a.facteur; }, 1), Kfin = opsApres.filter(function (a) { return a.date > jFin; }).reduce(function (p, a) { return p * a.facteur; }, 1);
      var prixEpoque = P0 * K;
      var nEpoque = Math.floor(M / (prixEpoque * (1 + fa)));
      if (nEpoque < 1) { out.innerHTML = '<p class="mb-err">Avec ' + fF(M) + ', on ne pouvait pas acheter une seule action ' + esc(MK.titre(f)) + ' le ' + dt(jAchat) + ' (cours : ' + fF(prixEpoque) + '). Augmentez le montant.</p>'; return; }
      var nAdj = nEpoque * K, nFin = nAdj / Kfin, cout = nEpoque * prixEpoque, fraisA = cout * fa, reste = M - cout - fraisA;
      var divs = (f.dividendes || []).filter(function (d) { return d.detachement > jAchat && d.detachement <= jFin; });
      var totDiv = divs.reduce(function (s, d) { return s + d.montant * nAdj; }, 0);
      var V1 = nAdj * P1, fraisV = V1 * fv, garde = (cout + V1) / 2 * g * annees;
      var final = V1 - fraisV - garde + totDiv + reste, res = final - M;
      var prixSeul = (P1 / P0 - 1) * 100;
      var marche = (idx[idx.length - 1][1] / idx[0][1] - 1) * 100;
      var tr = TR ? (TR.serie[0][0] <= jAchat ? perfIndice(TR.serie, jAchat, jFin) : null) : null;
      var bm = baisseMax(h);
      var courbeV = h.map(function (x) { var dv = 0; divs.forEach(function (d) { if (d.detachement <= x[0]) dv += d.montant * nAdj; }); return [x[0], nAdj * x[1] + dv + reste]; });
      var RR = { f: f, code: code, nom: MK.titre(f), M: M, jAchat: jAchat, jFin: jFin, prixEpoque: prixEpoque, P1: P1, P1epoque: P1 * Kfin, nEpoque: nEpoque, nFin: nFin, ops: opsPeriode,
        cout: cout, fraisA: fraisA, reste: reste, divs: divs, totDiv: totDiv, V1: V1, fraisV: fraisV, garde: garde, final: final, res: res, annees: annees,
        prixSeul: prixSeul, marche: marche, tr: tr, bm: bm, courbe: courbeV, idx: idx, seuil: (M - reste) / nAdj };
      if (!defiler) { rendre(RR); return; }
      analyse(out, [
        ['Lecture des cours officiels', f0(h.length) + ' séances de ' + esc(MK.titre(f)) + ', du ' + dc(jAchat) + ' au ' + dc(jFin)],
        ['Opérations sur titres', opsPeriode.length ? opsTexte(opsPeriode) + ' : cours ajustés' : 'aucun fractionnement ni action gratuite sur la période'],
        ['Achat reconstitué', f0(nEpoque) + ' action' + (nEpoque > 1 ? 's' : '') + ' à ' + fF(prixEpoque) + ', frais d’achat compris'],
        ['Dividendes détachés', divs.length ? divs.length + ' versement' + (divs.length > 1 ? 's' : '') + ', ' + fF(totDiv) + ' encaissés' : 'aucun dividende sur la période'],
        ['Frais de vente et de garde', fF(fraisV + garde) + ' sur ' + annees.toFixed(1).replace('.', ',') + ' an' + (annees >= 2 ? 's' : '')],
        ['Pire passage', pc(bm.pct) + ' entre un plus haut et un plus bas'],
        ['Comparaison avec le marché', 'BRVM Composite sur ' + f0(idx.length) + ' séances' + (tr != null ? ', et Composite Total Return' : '')]
      ], function () { rendre(RR); });
    }).catch(function () { out.innerHTML = '<p class="mb-err">Les cours de cette société ne se chargent pas. Réessayez dans un instant.</p>'; });
  }

  function cartes(R, pRes) {
    var face = pRes - R.marche;
    return '<div class="mb-trois">' +
      '<div class="mb-carte mb-c-nuit"><p class="mb-k">Valeur finale</p><p class="mb-chiffre">' + fF(R.final) + '</p><p>le ' + dt(R.jFin) + ', pour ' + fF(R.M) + ' placés le ' + dt(R.jAchat) + '.</p></div>' +
      '<div class="mb-carte ' + (R.res >= 0 ? 'mb-c-up' : 'mb-c-dn') + '"><p class="mb-k">Écart</p><p class="mb-chiffre">' + sF(R.res) + '</p><p>' + pc(pRes) + ' : dividendes encaissés, frais déduits.</p></div>' +
      '<div class="mb-carte mb-c-creme"><p class="mb-k">Face au marché</p><p class="mb-chiffre ' + cl(face) + '">' + pts(face) + '</p><p>Le BRVM Composite a fait <b>' + pc(R.marche) + '</b> (cours seuls)' +
      (R.tr != null ? ' et <b>' + pc(R.tr) + '</b> dividendes réinvestis (Composite Total Return)' : '') + '.</p></div></div>';
  }

  function rendre(R) {
    var pRes = R.res / R.M * 100;
    var opTxt = R.ops.length ? ' Avec ' + opsTexte(R.ops) + ', elles sont devenues <b>' + f0(R.nFin) + ' actions</b> : le cours a baissé d’autant, la valeur de votre placement, non.' : '';
    var h = cartes(R, pRes);
    h += '<div class="mb-recit"><p>Avec <b>' + fF(R.M) + '</b> le ' + dt(R.jAchat) + ', vous auriez acheté <b>' + f0(R.nEpoque) + ' action' + (R.nEpoque > 1 ? 's' : '') + ' ' + esc(R.nom) + '</b> à ' + fF(R.prixEpoque) + '.' + opTxt +
      ' Le ' + dt(R.jFin) + ', l’action vaut ' + fF(R.P1epoque) + '.</p>' +
      '<div class="mb-deux"><div><p class="mb-k">Évolution du prix</p><p class="mb-moyen ' + cl(R.prixSeul) + '">' + pc(R.prixSeul) + '</p><p class="mb-note">Le cours seul, ajusté des opérations sur titres. C’est ce que montrent la plupart des graphiques.</p></div>' +
      '<div><p class="mb-k">Rendement obtenu</p><p class="mb-moyen ' + cl(pRes) + '">' + pc(pRes) + '</p><p class="mb-note">Ce qui reste vraiment dans votre poche : cours, plus ' + R.divs.length + ' dividende' + (R.divs.length > 1 ? 's' : '') + ', moins les frais.</p></div></div></div>';
    h += '<div class="mb-cols"><div class="mb-bloc"><h3>Mois après mois</h3>' +
      courbe([{ nom: 'Votre placement (cours + dividendes)', coul: COUL[0], pts: R.courbe },
              { nom: 'Le même montant dans le BRVM Composite', coul: '#1B71B2', tirets: true, pts: R.idx.map(function (x) { return [x[0], R.M * x[1] / R.idx[0][1]]; }) }],
        { ref: R.M, refNom: 'Montant de départ', label: 'Valeur du placement comparée au marché', fmt: function (v) { return f0(v / 1000) + ' k'; } }) +
      '<p class="mb-note">Pire passage : ' + pc(R.bm.pct) + (R.bm.de ? ' entre le ' + dt(R.bm.de) + ' et le ' + dt(R.bm.a) : '') + '. Il fallait le traverser pour obtenir ce résultat.</p></div>' +
      '<div class="mb-bloc"><h3>Le détail</h3><table class="mb-t"><tbody>' +
      tr('Achat de ' + f0(R.nEpoque) + ' action' + (R.nEpoque > 1 ? 's' : ''), '−' + fF(R.cout)) + tr('Frais d’achat', '−' + fF(R.fraisA)) + tr('Reste non investi', fF(R.reste)) +
      tr('Dividendes encaissés (' + R.divs.length + ')', '+' + fF(R.totDiv)) + tr('Valeur des actions le ' + dc(R.jFin), fF(R.V1)) + tr('Frais de vente', '−' + fF(R.fraisV)) +
      tr('Droits de garde (' + R.annees.toFixed(1).replace('.', ',') + ' an' + (R.annees >= 2 ? 's' : '') + ')', '−' + fF(R.garde)) + tr('Il vous resterait', fF(R.final), 'mb-tot') + '</tbody></table>' +
      (R.divs.length ? '<p class="mb-note">Dividendes nets détachés le ' + R.divs.map(function (d) { return dc(d.detachement) + (d.detachement_estime ? ' (date estimée)' : ''); }).join(', ') + '.</p>' : '<p class="mb-note">Aucun dividende détaché sur la période.</p>') +
      '<p class="mb-note">Pour rentrer dans ses frais, il fallait revendre au moins ' + fF(R.seuil * (R.P1epoque / R.P1)) + ' par action.</p></div></div>';
    h += lecon(R, pRes) + '<div id="si-top" class="mb-top"></div>' + partage(R);
    $('si-res').innerHTML = h;
    meilleures(R.jAchat, R.jFin, R.code, R.M);
    var b = $('si-copier'); if (b) b.addEventListener('click', copier);
    MK.compte('ma-brvm-investi-' + R.code);
  }
  function tr(lib, val, c) { return '<tr' + (c ? ' class="' + c + '"' : '') + '><td>' + lib + '</td><td>' + val + '</td></tr>'; }

  function rendreIndice(M, fa, fv, g, idx) {
    var annees = (new Date(idx[idx.length - 1][0]) - new Date(idx[0][0])) / (365.25 * 864e5);
    var marche = (idx[idx.length - 1][1] / idx[0][1] - 1) * 100;
    var net = M * (1 - fa) * (1 + marche / 100), final = net * (1 - fv) - (M + net) / 2 * g * annees, res = final - M;
    var tr = TR && TR.serie[0][0] <= idx[0][0] ? perfIndice(TR.serie, idx[0][0], idx[idx.length - 1][0]) : null;
    $('si-res').innerHTML = '<div class="mb-trois">' +
      '<div class="mb-carte mb-c-nuit"><p class="mb-k">Valeur finale</p><p class="mb-chiffre">' + fF(final) + '</p><p>le ' + dt(idx[idx.length - 1][0]) + ', frais déduits, hors dividendes.</p></div>' +
      '<div class="mb-carte ' + (res >= 0 ? 'mb-c-up' : 'mb-c-dn') + '"><p class="mb-k">Écart</p><p class="mb-chiffre">' + sF(res) + '</p><p>' + pc(res / M * 100) + ' après frais.</p></div>' +
      '<div class="mb-carte mb-c-creme"><p class="mb-k">L’indice</p><p class="mb-chiffre">' + pc(marche) + '</p><p>' + (tr != null ? 'Dividendes réinvestis : <b>' + pc(tr) + '</b> (Composite Total Return).' : 'Hors dividendes : le Composite Total Return n’est publié que depuis le 2 janvier 2026.') + '</p></div></div>' +
      '<div class="mb-recit"><p>On ne peut pas acheter l’indice directement à la Bourse (BRVM) : c’est un repère. Pour s’en approcher, il faut répartir son argent entre plusieurs sociétés, ou passer par un fonds (FCP).</p></div>' +
      '<div class="mb-bloc">' + courbe([{ nom: 'BRVM Composite', coul: '#1B71B2', pts: idx.map(function (x) { return [x[0], M * x[1] / idx[0][1]]; }) }], { ref: M, refNom: 'Montant de départ', label: 'Évolution du BRVM Composite', fmt: function (v) { return f0(v / 1000) + ' k'; } }) + '</div><div id="si-top" class="mb-top"></div>';
    meilleures(idx[0][0], idx[idx.length - 1][0], 'IDX', M, marche);
  }

  /* Sur la même période : les meilleures performances du marché (dividendes compris) */
  function meilleures(d0, d1, choix, M, marcheIdx) {
    var box = $('si-top'); if (!box) return;
    box.innerHTML = '<p class="mb-attente">EFA classe les ' + SOC.length + ' sociétés cotées sur la même période…</p>';
    var codes = SOC.map(function (s) { return s.code; }).filter(function (c) { return !HORS_DECRYPTAGE[c]; });
    var limite = decale(d0, 0); var tard = new Date(d0 + 'T12:00:00Z'); tard.setUTCDate(tard.getUTCDate() + 10); tard = tard.toISOString().slice(0, 10);
    Promise.all(codes.map(function (c) { return fiche(c).catch(function () { return null; }); })).then(function (FS) {
      if (!$('si-top') || $('si-top') !== box) return;
      var L = [];
      FS.forEach(function (f) {
        if (!f) return;
        var H = f.historique, i0 = premierApres(H, d0), i1 = dernierAvant(H, d1);
        if (i0 < 0 || i1 <= i0 || H[i0][0] > tard) return;
        var p0 = H[i0][1], p1 = H[i1][1];
        var dv = (f.dividendes || []).filter(function (x) { return x.detachement > H[i0][0] && x.detachement <= H[i1][0]; }).reduce(function (s, x) { return s + x.montant; }, 0);
        L.push({ f: f, prix: (p1 / p0 - 1) * 100, tot: ((p1 + dv) / p0 - 1) * 100, dv: dv > 0 });
      });
      if (!L.length) { box.innerHTML = ''; return; }
      L.sort(function (a, b) { return b.tot - a.tot; });
      var rang = -1; L.forEach(function (x, i) { if (x.f.code === choix) rang = i; });
      var marche = marcheIdx != null ? marcheIdx : perfIndice(COMPO.serie, d0, d1), battent = L.filter(function (x) { return x.tot > marche; }).length;
      var top = L.slice(0, 5);
      box.innerHTML = '<div class="mb-bloc"><p class="mb-k">Sur la même période</p><h3>Les meilleures performances du marché</h3>' +
        '<p class="mb-note">Du ' + dt(d0) + ' au ' + dt(d1) + ', dividendes compris, avant frais. ' + L.length + ' sociétés cotées sur toute la période.</p>' +
        '<ol class="mb-podium">' + top.map(function (x, i) {
          var moi = x.f.code === choix;
          return '<li' + (moi ? ' class="mb-moi"' : '') + '><span class="mb-rang">' + (i + 1) + '</span><span class="mb-nom"><b>' + esc(MK.titre(x.f)) + '</b><small>cours ' + pc(x.prix) + (x.dv ? ', plus dividendes' : '') + (moi ? ' · votre choix' : '') + '</small></span><span class="mb-perf ' + cl(x.tot) + '">' + pc(x.tot) + '</span>' +
            '<button type="button" class="mb-lien" data-aller="investi" data-code="' + esc(x.f.code) + '" data-date="' + d0 + '" data-fin="' + d1 + '">avec ' + (M ? f0(M) + ' F' : 'mon montant') + '</button></li>';
        }).join('') + '</ol>' +
        '<p class="mb-situ">' + (rang >= 0 ? (rang < 5 ? 'Votre choix est dans le haut du classement : ' : 'Votre choix arrive ') + '<b>' + (rang + 1) + '<sup>e</sup> sur ' + L.length + '</b>. ' : '') +
        'Le BRVM Composite a fait ' + pc(marche) + ' (cours seuls) ; <b>' + battent + ' société' + (battent > 1 ? 's' : '') + ' sur ' + L.length + '</b> ont fait mieux, dividendes compris.</p>' +
        '<p class="mb-note">Ce classement regarde le passé : les meilleures d’une période sont rarement les mêmes à la suivante. Il sert à comparer, pas à choisir.</p></div>';
    });
  }

  function lecon(R, pRes) {
    var fr = R.fraisA + R.fraisV + R.garde, l = [];
    if (R.totDiv > 0) l.push('Les dividendes ont rapporté <b>' + fF(R.totDiv) + '</b>. À la Bourse (BRVM), une bonne part du résultat vient des revenus versés, pas seulement de la hausse du cours.');
    l.push('Les frais ont coûté <b>' + fF(fr) + '</b>, soit ' + pc(fr / R.M * 100).replace('+', '') + ' du montant. Sur un petit montant, courtage et garde pèsent lourd : comparez les grilles des SGI.');
    if (pRes < R.marche) l.push('Ce choix a fait moins bien que tout le marché. Répartir son argent sur plusieurs sociétés évite de tout miser sur une seule.');
    else l.push('Ce choix a fait mieux que le marché sur cette période. Changez la date d’achat : le résultat peut s’inverser, c’est l’objet de l’outil « Quand êtes-vous entré ? ».');
    if (R.ops.length) l.push('Un fractionnement ou des actions gratuites font baisser le cours sans appauvrir l’actionnaire : il a plus d’actions. Une courbe non ajustée ferait croire à une chute.');
    return '<div class="mb-lecon"><p class="mb-k">Ce que ce résultat vous apprend</p><ul>' + l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '<p class="mb-boutons"><button type="button" class="mb-b mb-b-clair" data-aller="entree" data-code="' + esc(R.code) + '">Changer la date d’entrée sur la courbe</button> <a class="mb-b" href="questions-a-poser-a-sa-sgi.html">Les questions à poser à sa SGI</a></p></div>';
  }

  function partage(R) {
    var u = location.origin + location.pathname + '?outil=investi&c=' + encodeURIComponent(R.code) + '&d=' + R.jAchat + '&f=' + R.jFin + '&m=' + Math.round(R.M);
    return '<p class="mb-partage"><span>Partager ce calcul :</span> <input id="si-lien" readonly value="' + esc(u) + '" aria-label="Lien du calcul"> <button type="button" id="si-copier" class="mb-b mb-b-clair">Copier le lien</button></p>';
  }
  function copier() {
    var i = $('si-lien'), b = $('si-copier');
    function ok() { b.textContent = 'Lien copié'; }
    try { navigator.clipboard.writeText(i.value).then(ok, function () { i.select(); }); } catch (e) { i.select(); }
  }

  /* =========================================================
     2. QUAND ÊTES-VOUS ENTRÉ ?
     ========================================================= */
  var EN = { f: null, h: null };
  function initEntree(code) {
    var sel = $('en-titre'); if (!sel.options.length) options(sel, false, 'SGBC');
    if (code && CODES[code]) sel.value = code;
    if (!sel.dataset.ok) {
      sel.dataset.ok = 1;
      sel.addEventListener('change', function () { chargerEntree(); });
      $('en-per').addEventListener('change', function () { chargerEntree(); });
      $('en-curseur').addEventListener('input', function () { dessinerEntree(); });
    }
    chargerEntree();
  }
  function chargerEntree() {
    var code = $('en-titre').value, mois = +$('en-per').value;
    $('en-res').innerHTML = '<p class="mb-attente">Chargement…</p>';
    fiche(code).then(function (f) {
      var H = serieCours(f), d0 = mois ? decale(DERNIER, -mois) : H[0][0];
      var k = Math.max(0, premierApres(H, d0));
      EN.f = f; EN.h = H.slice(k);
      var c = $('en-curseur'); c.max = EN.h.length - 2; c.value = Math.round((EN.h.length - 2) / 3);
      dessinerEntree();
    });
  }
  function resultatDepuis(f, h, i) {
    var d = h[i][0], fin = h[h.length - 1];
    var divs = (f.dividendes || []).filter(function (x) { return x.detachement > d && x.detachement <= fin[0]; });
    var dv = divs.reduce(function (s, x) { return s + x.montant; }, 0);
    return { d: d, p: h[i][1], prix: (fin[1] / h[i][1] - 1) * 100, total: ((fin[1] + dv) / h[i][1] - 1) * 100, nd: divs.length };
  }
  function dessinerEntree() {
    var f = EN.f, h = EN.h; if (!f || !h || h.length < 3) { $('en-res').innerHTML = '<p class="mb-err">Pas assez de séances sur cette période.</p>'; return; }
    var i = +$('en-curseur').value, moi = resultatDepuis(f, h, i);
    var hi = 0, lo = 0; for (var k = 0; k < h.length - 1; k++) { if (h[k][1] > h[hi][1]) hi = k; if (h[k][1] < h[lo][1]) lo = k; }
    var A = resultatDepuis(f, h, hi), B = resultatDepuis(f, h, lo), fin = h[h.length - 1];
    var mar = perfIndice(COMPO.serie, moi.d, fin[0]);
    $('en-date').textContent = 'Achat le ' + dt(moi.d) + ' à ' + fF(moi.p);
    var g = courbe([{ nom: MK.titre(f) + ' (cours ajusté)', coul: COUL[0], pts: h }],
      { marque: moi.d, label: 'Cours de ' + MK.titre(f), points: [{ d: moi.d, v: moi.p, coul: '#1B71B2' }, { d: A.d, v: A.p, coul: '#DA3C1B' }, { d: B.d, v: B.p, coul: '#1e7a4c' }] });
    $('en-res').innerHTML = g +
      '<div class="mb-trois">' +
      '<div class="mb-carte mb-c-creme"><p class="mb-k"><i class="mb-pt" style="background:#1B71B2"></i>Vous</p><p class="mb-chiffre ' + cl(moi.total) + '">' + pc(moi.total) + '</p><p>Entré le ' + dc(moi.d) + '. Cours seul : ' + pc(moi.prix) + ' ; avec ' + moi.nd + ' dividende' + (moi.nd > 1 ? 's' : '') + '. Le marché : ' + pc(mar) + '.</p></div>' +
      '<div class="mb-carte mb-c-creme"><p class="mb-k"><i class="mb-pt" style="background:#DA3C1B"></i>Koffi, entré au plus haut</p><p class="mb-chiffre ' + cl(A.total) + '">' + pc(A.total) + '</p><p>Le ' + dc(A.d) + ' à ' + fF(A.p) + '. « La Bourse, ça ne marche pas. »</p></div>' +
      '<div class="mb-carte mb-c-creme"><p class="mb-k"><i class="mb-pt" style="background:#1e7a4c"></i>Affoué, entrée au plus bas</p><p class="mb-chiffre ' + cl(B.total) + '">' + pc(B.total) + '</p><p>Le ' + dc(B.d) + ' à ' + fF(B.p) + '. « La Bourse, c’est facile. »</p></div></div>' +
      '<div class="mb-lecon"><p class="mb-k">Même action, deux histoires opposées</p><ul><li>Koffi et Affoué ont acheté la même société. Seule la date les sépare : <b>' + pc(B.total - A.total).replace('+', '') + '</b> d’écart.</li>' +
      '<li>Personne ne sait à l’avance quel jour sera le plus haut ou le plus bas. Acheter en plusieurs fois, par exemple chaque mois, évite de tout jouer sur une seule date.</li>' +
      '<li>Avant de juger une action sur le récit de quelqu’un, demandez-lui : « Tu es entré quand ? »</li></ul>' +
      '<p class="mb-boutons"><button type="button" class="mb-b" data-aller="investi" data-code="' + esc(f.code) + '" data-date="' + moi.d + '">Calculer avec mon montant, à cette date</button></p></div>';
  }

  /* =========================================================
     3. COMPARATEUR D'ACTIONS
     ========================================================= */
  function initComparer() {
    ['co-a', 'co-b', 'co-c'].forEach(function (id, i) {
      var s = $(id); if (s.options.length) return;
      s.innerHTML = (i === 2 ? '<option value="">(aucune)</option>' : '') + SOC.map(function (x) { return '<option value="' + esc(x.code) + '">' + esc(MK.titre(x)) + '</option>'; }).join('');
      s.value = ['SGBC', 'PALC', ''][i];
      s.addEventListener('change', comparer);
    });
    if (!$('co-per').dataset.ok) { $('co-per').dataset.ok = 1; $('co-per').addEventListener('change', comparer); }
    comparer();
  }
  function comparer() {
    var codes = ['co-a', 'co-b', 'co-c'].map(function (id) { return $(id).value; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; });
    var per = $('co-per').value, d0 = per === 'tout' ? COMPO.serie[0][0] : per.length === 4 ? per + '-01-01' : decale(DERNIER, -(+per));
    var out = $('co-res'); out.innerHTML = '<p class="mb-attente">Chargement…</p>';
    Promise.all(codes.map(fiche)).then(function (FS) {
      var I = COMPO.serie.slice(Math.max(0, premierApres(COMPO.serie, d0)));
      var base = I[0][0];
      var series = [], lignes = [];
      FS.forEach(function (f, k) {
        var H = serieCours(f), i0 = premierApres(H, base); if (i0 < 0) return;
        var h = H.slice(i0), p0 = h[0][1], fin = h[h.length - 1];
        var divs = (f.dividendes || []).filter(function (x) { return x.detachement > h[0][0] && x.detachement <= fin[0]; });
        var dv = divs.reduce(function (s, x) { return s + x.montant; }, 0);
        var prix = (fin[1] / p0 - 1) * 100, tot = ((fin[1] + dv) / p0 - 1) * 100, bm = baisseMax(h);
        var sans = h.filter(function (x, j) { return j && x[1] === h[j - 1][1]; }).length;
        series.push({ nom: MK.titre(f), coul: COUL[k], pts: h.map(function (x) { return [x[0], x[1] / p0 * 100]; }) });
        lignes.push({ f: f, prix: prix, tot: tot, bm: bm, dv: dv, nd: divs.length, debut: h[0][0], sans: sans / h.length * 100 });
      });
      var marche = (I[I.length - 1][1] / I[0][1] - 1) * 100;
      series.push({ nom: 'BRVM Composite', coul: '#7A8293', tirets: true, fin: true, pts: I.map(function (x) { return [x[0], x[1] / I[0][1] * 100]; }) });
      var t = '<div class="mb-defile"><table class="mb-t mb-comp"><thead><tr><th>Société</th><th>Cours</th><th>Avec dividendes</th><th>Face au marché</th><th>Pire baisse</th><th>Séances sans variation</th></tr></thead><tbody>' +
        lignes.map(function (L, k) {
          return '<tr><td><i class="mb-pt" style="background:' + COUL[k] + '"></i><a class="mb-lien" href="societe.html?c=' + esc(L.f.code) + '">' + esc(MK.titre(L.f)) + '</a>' + (L.debut > base ? '<small> depuis le ' + dc(L.debut) + '</small>' : '') + '</td><td class="' + cl(L.prix) + '">' + pc(L.prix) + '</td><td class="' + cl(L.tot) + '">' + pc(L.tot) + '<small> ' + L.nd + ' div.</small></td><td class="' + cl(L.tot - marche) + '">' + pts(L.tot - marche) + '</td><td class="mb-dn">' + pc(L.bm.pct) + '</td><td>' + Math.round(L.sans) + ' %</td></tr>';
        }).join('') + '<tr class="mb-tot"><td>BRVM Composite</td><td class="' + cl(marche) + '">' + pc(marche) + '</td><td>' + (TR && TR.serie[0][0] <= base ? pc(perfIndice(TR.serie, base, DERNIER)) : '—') + '</td><td>—</td><td class="mb-dn">' + pc(baisseMax(I).pct) + '</td><td>—</td></tr></tbody></table></div>';
      out.innerHTML = courbe(series, { ref: 100, refNom: 'Base 100 au départ', label: 'Parcours comparés, base 100', fmt: function (v) { return Math.round(v); } }) + t +
        '<p class="mb-note">Base 100 : chaque courbe part de 100 le ' + dt(base) + ' ; 130 veut dire +30 %. « Pire baisse » : le plus fort recul entre un plus haut et le plus bas qui a suivi. « Séances sans variation » : une action qui bouge peu d’une séance à l’autre est souvent peu échangée, donc plus difficile à revendre vite.</p>' +
        '<div class="mb-lecon"><p class="mb-k">Comment lire ce comparatif</p><ul><li>Regardez la pire baisse autant que la hausse : c’est ce qu’il aurait fallu supporter sans vendre.</li><li>Une action qui verse de gros dividendes peut sembler stagner sur le graphique et rapporter beaucoup : comparez la colonne « Avec dividendes ».</li><li>Le passé ne dit rien de l’avenir : ce tableau aide à poser des questions, pas à choisir à votre place.</li></ul></div>';
      MK.compte('ma-brvm-comparer');
    });
  }

  /* =========================================================
     4. MON PORTEFEUILLE BRVM (reste dans le navigateur)
     ========================================================= */
  var CLE = 'efa-ma-brvm-portefeuille';
  function lirePf() { try { var x = JSON.parse(localStorage.getItem(CLE) || '[]'); return Array.isArray(x) ? x : []; } catch (e) { return []; } }
  function ecrirePf(L) { try { localStorage.setItem(CLE, JSON.stringify(L)); } catch (e) {} }
  var PF = null;
  function initPortefeuille() {
    if (PF) return calculerPf();
    PF = lirePf(); if (!PF.length) PF = [{ c: 'SGBC', q: '', p: '', d: '' }];
    $('pf-ajout').addEventListener('click', function () { lirePfForm(); PF.push({ c: 'PALC', q: '', p: '', d: '' }); ligne(); });
    $('pf-vider').addEventListener('click', function () { PF = [{ c: 'SGBC', q: '', p: '', d: '' }]; ecrirePf([]); ligne(); });
    $('pf-form').addEventListener('submit', function (e) { e.preventDefault(); lirePfForm(); ecrirePf(PF); calculerPf(true); });
    ligne();
  }
  function ligne() {
    var opts = SOC.map(function (x) { return '<option value="' + esc(x.code) + '">' + esc(MK.titre(x)) + '</option>'; }).join('');
    $('pf-lignes').innerHTML = PF.map(function (r, i) {
      return '<div class="mb-pf-l" data-i="' + i + '"><label class="mb-l"><span>Société</span><select class="pf-c">' + opts + '</select></label>' +
        '<label class="mb-l"><span>Nombre d’actions</span><input class="pf-q" inputmode="numeric" value="' + esc(r.q) + '" placeholder="10"></label>' +
        '<label class="mb-l"><span>Prix d’achat par action (F)</span><input class="pf-p" inputmode="decimal" value="' + esc(r.p) + '" placeholder="frais compris"></label>' +
        '<label class="mb-l"><span>Date d’achat (facultatif)</span><input class="pf-d" type="date" value="' + esc(r.d) + '" min="' + COMPO.serie[0][0] + '" max="' + DERNIER + '"></label>' +
        '<button type="button" class="mb-x" aria-label="Retirer cette ligne">×</button></div>';
    }).join('');
    Array.prototype.forEach.call($('pf-lignes').querySelectorAll('.mb-pf-l'), function (el, i) {
      el.querySelector('.pf-c').value = PF[i].c;
      el.querySelector('.mb-x').addEventListener('click', function () { lirePfForm(); PF.splice(i, 1); if (!PF.length) PF.push({ c: 'SGBC', q: '', p: '', d: '' }); ligne(); });
    });
    calculerPf();
  }
  function lirePfForm() {
    PF = Array.prototype.map.call($('pf-lignes').querySelectorAll('.mb-pf-l'), function (el) {
      return { c: el.querySelector('.pf-c').value, q: el.querySelector('.pf-q').value.trim(), p: el.querySelector('.pf-p').value.trim(), d: el.querySelector('.pf-d').value };
    });
  }
  function calculerPf(anime) {
    var L = PF.filter(function (r) { return num(r.q) > 0 && num(r.p) > 0; });
    var out = $('pf-res');
    if (!L.length) { out.innerHTML = '<p class="mb-note">Saisissez au moins une ligne (société, nombre d’actions, prix d’achat), puis « Calculer ».</p>'; return; }
    Promise.all(L.map(function (r) { return fiche(r.c); })).then(function (FS) {
      if (anime) {
        var nd = L.filter(function (r) { return r.d; }).length;
        return analyse(out, [['Lecture de vos lignes', L.length + ' société' + (L.length > 1 ? 's' : '') + ', ' + f0(L.reduce(function (s, r) { return s + num(r.q); }, 0)) + ' actions'],
          ['Derniers cours de clôture', 'séance du ' + dc(DERNIER)], ['Opérations sur titres', 'fractionnements et actions gratuites depuis vos dates d’achat'],
          ['Dividendes encaissés', nd ? nd + ' ligne' + (nd > 1 ? 's' : '') + ' datée' + (nd > 1 ? 's' : '') : 'ajoutez vos dates d’achat pour les compter'],
          ['Comparaison avec le marché', 'BRVM Composite aux mêmes dates']], function () { calculerPf(false); });
      }
      var tot = { achat: 0, val: 0, div: 0, marche: 0, marcheBase: 0 }, avert = [], rows = '';
      L.forEach(function (r, k) {
        var f = FS[k], H = f.historique, P1 = H[H.length - 1][1], q = num(r.q), p = num(r.p), K = 1, ops = [];
        if (r.d) { ops = (f.ajustements || []).filter(function (a) { return a.ajuste !== false && a.date > r.d; }); K = ops.reduce(function (s, a) { return s * a.facteur; }, 1); }
        var qAuj = q * K, achat = q * p, val = qAuj * P1, dv = 0, nd = 0;
        if (r.d) (f.dividendes || []).forEach(function (d) { if (d.detachement > r.d && d.detachement <= DERNIER) { dv += d.montant * qAuj; nd++; } });
        var res = val - achat, m = r.d ? perfIndice(COMPO.serie, r.d, DERNIER) : null;
        if (ops.length) avert.push(esc(MK.titre(f)) + ' : ' + f0(q) + ' actions achetées avant ' + opsTexte(ops) + ' sont devenues ' + f0(qAuj) + '.');
        if (!r.d) avert.push(esc(MK.titre(f)) + ' : sans date d’achat, EFA ne peut ni compter les dividendes ni comparer au marché.');
        tot.achat += achat; tot.val += val; tot.div += dv; if (m != null) { tot.marche += achat * (1 + m / 100); tot.marcheBase += achat; }
        rows += '<tr><td>' + esc(MK.titre(f)) + '<small> ' + f0(qAuj) + ' × ' + fF(P1) + '</small></td><td>' + fF(achat) + '</td><td>' + fF(val) + '</td><td class="' + cl(res) + '">' + sF(res) + '<small> ' + pc(res / achat * 100) + '</small></td><td>' + (r.d ? fF(dv) + '<small> ' + nd + ' div.</small>' : '—') + '</td><td>' + (m != null ? pts((val + dv) / achat * 100 - 100 - m) : '—') + '</td></tr>';
      });
      var res = tot.val + tot.div - tot.achat;
      var mPct = tot.marcheBase ? (tot.marche / tot.marcheBase - 1) * 100 : null;
      out.innerHTML = '<div class="mb-trois">' +
        '<div class="mb-carte mb-c-nuit"><p class="mb-k">Valeur aujourd’hui</p><p class="mb-chiffre">' + fF(tot.val) + '</p><p>au cours de clôture du ' + dt(DERNIER) + ', avant frais de vente.</p></div>' +
        '<div class="mb-carte ' + (res >= 0 ? 'mb-c-up' : 'mb-c-dn') + '"><p class="mb-k">Mon résultat</p><p class="mb-chiffre">' + sF(res) + '</p><p>' + pc(res / tot.achat * 100) + ', dont ' + fF(tot.div) + ' de dividendes encaissés.</p></div>' +
        '<div class="mb-carte mb-c-creme"><p class="mb-k">Face au marché</p><p class="mb-chiffre ' + (mPct != null ? cl(res / tot.achat * 100 - mPct) : '') + '">' + (mPct != null ? pts(res / tot.achat * 100 - mPct) : '—') + '</p><p>' + (mPct != null ? 'Le même argent dans le BRVM Composite, aux mêmes dates, aurait fait ' + pc(mPct) + ' (cours seuls).' : 'Ajoutez vos dates d’achat pour comparer au marché.') + '</p></div></div>' +
        '<div class="mb-defile"><table class="mb-t mb-comp"><thead><tr><th>Ligne</th><th>Payé</th><th>Vaut</th><th>Plus ou moins-value</th><th>Dividendes</th><th>Face au marché</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        (avert.length ? '<ul class="mb-note mb-avert">' + avert.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') +
        '<p class="mb-note">Vos lignes restent dans ce navigateur : EFA ne les reçoit pas. Le prix d’achat est celui de votre avis d’opéré, frais compris, au nombre d’actions de l’époque.</p>';
      MK.compte('ma-brvm-portefeuille');
    });
  }

  /* =========================================================
     5. DÉCRYPTAGES : fortes hausses et fortes baisses
     ========================================================= */
  var DEC = null;
  function initDecryptages() {
    if (DEC) return;
    DEC = 1;
    var out = $('de-res'); out.innerHTML = '<p class="mb-attente">EFA relit les séances des douze derniers mois…</p>';
    var codes = SOC.map(function (s) { return s.code; }).filter(function (c) { return !HORS_DECRYPTAGE[c]; });
    Promise.all(codes.map(function (c) { return fiche(c).catch(function () { return null; }); })).then(function (FS) {
      var d0 = decale(DERNIER, -12), jours = [], an = [];
      FS.forEach(function (f) {
        if (!f) return;
        var H = f.historique, i0 = premierApres(H, d0); if (i0 < 1) i0 = 1;
        var divJ = {}; (f.dividendes || []).forEach(function (d) { divJ[d.detachement] = d.montant; });
        for (var i = i0; i < H.length; i++) {
          var v = (H[i][1] / H[i - 1][1] - 1) * 100;
          if (Math.abs(v) >= 5) jours.push({ f: f, d: H[i][0], v: v, p: H[i][1], p0: H[i - 1][1], div: divJ[H[i][0]], vol: H[i][2] });
        }
        var a = H[premierApres(H, d0) < 0 ? 0 : premierApres(H, d0)], z = H[H.length - 1];
        var dv = (f.dividendes || []).filter(function (x) { return x.detachement > a[0]; }).reduce(function (s, x) { return s + x.montant; }, 0);
        an.push({ f: f, prix: (z[1] / a[1] - 1) * 100, tot: ((z[1] + dv) / a[1] - 1) * 100, d: a[0], bm: baisseMax(H.slice(premierApres(H, d0))) });
      });
      jours.sort(function (a, b) { return Math.abs(b.v) - Math.abs(a.v); });
      var hausses = jours.filter(function (x) { return x.v > 0; }).slice(0, 6), baisses = jours.filter(function (x) { return x.v < 0; }).slice(0, 6);
      an.sort(function (a, b) { return b.tot - a.tot; });
      function carteJour(x) {
        var pourquoi = x.div && x.v < 0 ? 'Jour de détachement du dividende (' + String(x.div).replace('.', ',') + ' F par action) : le cours baisse d’environ ce montant, l’actionnaire le reçoit en argent. Ce n’est pas une perte.' :
          x.v > 0 ? 'Une hausse aussi forte en une séance suit souvent une annonce : résultats, dividende, opération. Avec peu d’échanges, quelques ordres suffisent à faire bouger le cours.' :
          'Avant de paniquer : regardez s’il y a eu une annonce, et combien de titres ont changé de mains ce jour-là.';
        return '<article class="mb-dec"><p class="mb-k">' + dc(x.d) + '</p><h3>' + esc(MK.titre(x.f)) + ' <span class="' + cl(x.v) + '">' + pc(x.v) + '</span></h3><p class="mb-note">De ' + fF(x.p0) + ' à ' + fF(x.p) + ' · ' + f0(x.vol || 0) + ' titres échangés</p><p>' + pourquoi + '</p>' +
          '<button type="button" class="mb-b mb-b-clair" data-aller="investi" data-code="' + esc(x.f.code) + '" data-date="' + x.d + '">Et si j’avais acheté ce jour-là ?</button></article>';
      }
      function carteAn(x, rang) {
        return '<li><b>' + esc(MK.titre(x.f)) + '</b> <span class="' + cl(x.tot) + '">' + pc(x.tot) + '</span><small> cours ' + pc(x.prix) + ' · pire baisse ' + pc(x.bm.pct) + '</small> <button type="button" class="mb-lien" data-aller="investi" data-code="' + esc(x.f.code) + '" data-date="' + x.d + '">calculer</button></li>';
      }
      out.innerHTML = '<h3 class="mb-h3">Les plus fortes hausses en une séance</h3><div class="mb-decs">' + hausses.map(carteJour).join('') + '</div>' +
        '<h3 class="mb-h3">Les plus fortes baisses en une séance</h3><div class="mb-decs">' + baisses.map(carteJour).join('') + '</div>' +
        '<div class="mb-cols"><div class="mb-bloc"><h3>Sur douze mois : en tête</h3><ol class="mb-classe">' + an.slice(0, 5).map(carteAn).join('') + '</ol></div>' +
        '<div class="mb-bloc"><h3>Sur douze mois : en queue</h3><ol class="mb-classe">' + an.slice(-5).reverse().map(carteAn).join('') + '</ol></div></div>' +
        '<p class="mb-note">Performances dividendes compris, du ' + dt(d0) + ' au ' + dt(DERNIER) + '. Séances retenues : variation d’au moins 5 % ; à la Bourse (BRVM), une action ne peut en principe pas bouger de plus de 7,5 % par séance. Ces cas servent à comprendre, pas à choisir une action.</p>';
      MK.compte('ma-brvm-decryptages');
    });
  }

  /* ---------- Onglets ---------- */
  var INIT = { investi: function () {}, entree: function () { initEntree(); }, comparer: initComparer, portefeuille: initPortefeuille, decryptages: initDecryptages };
  function ouvrir(outil, opts) {
    if (!INIT[outil]) outil = 'investi';
    Array.prototype.forEach.call(document.querySelectorAll('.mb-onglet'), function (b) { b.setAttribute('aria-selected', b.dataset.outil === outil ? 'true' : 'false'); });
    Array.prototype.forEach.call(document.querySelectorAll('.mb-outil[id]'), function (s) { s.hidden = s.id !== 'o-' + outil; });
    opts = opts || {};
    if (outil === 'entree') initEntree(opts.code);
    else if (outil === 'investi' && opts.code) {
      $('si-titre').value = opts.code; if (opts.date) $('si-date').value = opts.date; $('si-fin').value = opts.fin || DERNIER; calculer(false);
    } else INIT[outil]();
    try { history.replaceState(null, '', '#' + outil); } catch (e) {}
    if (opts.defiler !== false) $('mb-outils').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    MK = window.EFA_MK; if (!MK) return;
    var Q = new URLSearchParams(location.search), q = { c: Q.get('c'), d: Q.get('d'), f: Q.get('f'), m: Q.get('m') };
    charger().then(function () {
      initInvesti(q);
      document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-outil]');
        if (b && b.classList.contains('mb-onglet')) { ouvrir(b.dataset.outil, { defiler: false }); return; }
        var a = e.target.closest('[data-aller]');
        if (a) { e.preventDefault(); ouvrir(a.dataset.aller, { code: a.dataset.code, date: a.dataset.date, fin: a.dataset.fin }); }
      });
      var depart = Q.get('outil') || (location.hash || '').slice(1);
      if (depart && depart !== 'investi' && INIT[depart]) ouvrir(depart, { defiler: false });
    }).catch(function () { $('si-res').innerHTML = '<p class="mb-err">Les données de la Bourse ne se chargent pas. Réessayez dans un instant.</p>'; });
  });
})();
