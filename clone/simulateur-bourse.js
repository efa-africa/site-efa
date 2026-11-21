/* EFA · Marchés : « Et si j'avais investi ? »
   Reconstitue le résultat d'un achat passé : cours ajustés (fractionnements, actions gratuites),
   dividendes détachés, frais d'achat, de vente et de garde paramétrables, comparaison au BRVM Composite.
   Données : data/marches/ (societes.json, fiches/CODE.json, jour.json). Aucun chiffre saisi n'est envoyé ni conservé. */
(function () {
  var MK = null;
  var $ = function (id) { return document.getElementById(id); };
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  function f0(x) { return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function fF(x) { return f0(x) + ' F'; }
  function pc(x) { return (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toFixed(1).replace('.', ',') + ' %'; }
  function dt(d) { var p = d.split('-'); return (+p[2] === 1 ? '1er' : +p[2]) + ' ' + MOIS[+p[1] - 1] + ' ' + p[0]; }
  function num(v) { var x = parseFloat(String(v).replace(/\s| /g, '').replace(',', '.')); return isNaN(x) ? null : x; }
  var SOC = [], INDICE = null, FICHES = {};

  function charger() {
    return Promise.all([MK.json('data/marches/societes.json'), MK.json('data/marches/jour.json')]).then(function (r) {
      SOC = r[0].societes.slice().sort(function (a, b) { return MK.titre(a).localeCompare(MK.titre(b), 'fr'); });
      INDICE = (r[1].indices || []).filter(function (i) { return i.nom === 'BRVM - COMPOSITE'; })[0];
      var sel = $('si-titre');
      sel.innerHTML = '<option value="IDX">BRVM Composite (tout le marché)</option>' + SOC.map(function (s) { return '<option value="' + MK.esc(s.code) + '">' + MK.esc(MK.titre(s)) + ' (' + MK.esc(s.code) + ')</option>'; }).join('');
      var q = new URLSearchParams(location.search).get('c');
      sel.value = q && SOC.some(function (s) { return s.code === q; }) ? q : 'SNTS';
      var d = $('si-date'), S = INDICE.serie;
      d.min = S[0][0]; d.max = S[S.length - 2][0];
      var unAn = new Date(S[S.length - 1][0]); unAn.setFullYear(unAn.getFullYear() - 1);
      d.value = unAn.toISOString().slice(0, 10);
      $('si-seance').textContent = 'Historique du ' + dt(S[0][0]) + ' au ' + dt(S[S.length - 1][0]) + ' · cours de clôture officiels';
    });
  }

  function fiche(code) {
    if (FICHES[code]) return Promise.resolve(FICHES[code]);
    return MK.json('data/marches/fiches/' + code + '.json').then(function (f) { FICHES[code] = f; return f; });
  }

  function premierApres(serie, d0) { for (var i = 0; i < serie.length; i++) if (serie[i][0] >= d0) return i; return -1; }

  function calculer() {
    var code = $('si-titre').value, M = num($('si-montant').value), d0 = $('si-date').value;
    var fa = (num($('si-fa').value) || 0) / 100, fv = (num($('si-fv').value) || 0) / 100, g = (num($('si-garde').value) || 0) / 100;
    var out = $('si-res');
    if (!M || M < 1000) { out.innerHTML = '<p class="si-err">Indiquez un montant d’au moins 1 000 F.</p>'; return; }
    if (!d0) { out.innerHTML = '<p class="si-err">Choisissez une date d’achat.</p>'; return; }
    var I = INDICE.serie, i0 = premierApres(I, d0);
    if (i0 < 0 || i0 >= I.length - 1) { out.innerHTML = '<p class="si-err">Choisissez une date avant la dernière séance.</p>'; return; }
    var idx = I.slice(i0), jIdx = idx[0][0], jFin = idx[idx.length - 1][0];
    var annees = (new Date(jFin) - new Date(jIdx)) / (365.25 * 864e5);
    var marche = (idx[idx.length - 1][1] / idx[0][1] - 1) * 100;
    if (code === 'IDX') { rendreIndice(M, fa, fv, g, idx, annees, marche); return; }
    out.innerHTML = '<p class="si-attente">Calcul en cours…</p>';
    fiche(code).then(function (f) {
      var H = f.historique.map(function (x) { return [x[0], x[1]]; }), k0 = premierApres(H, d0);
      if (k0 < 0 || k0 >= H.length - 1) { out.innerHTML = '<p class="si-err">Pas de cours pour cette société à partir de cette date.</p>'; return; }
      var h = H.slice(k0), jAchat = h[0][0], P0 = h[0][1], P1 = h[h.length - 1][1];
      // Opérations survenues après l'achat : le cours de l'époque et le nombre d'actions de l'époque
      var ops = (f.ajustements || []).filter(function (a) { return a.ajuste !== false && a.date > jAchat; });
      var K = ops.reduce(function (p, a) { return p * a.facteur; }, 1);
      var prixEpoque = P0 * K;
      var nEpoque = Math.floor(M / (prixEpoque * (1 + fa)));
      if (nEpoque < 1) { out.innerHTML = '<p class="si-err">Avec ' + fF(M) + ', on ne peut pas acheter une seule action ' + MK.esc(MK.titre(f)) + ' le ' + dt(jAchat) + ' (cours : ' + fF(prixEpoque) + '). Augmentez le montant.</p>'; return; }
      var nAuj = nEpoque * K, cout = nEpoque * prixEpoque, fraisA = cout * fa, reste = M - cout - fraisA;
      var divs = (f.dividendes || []).filter(function (d) { return d.detachement > jAchat && d.detachement <= jFin; });
      var totDiv = divs.reduce(function (s, d) { return s + d.montant * nAuj; }, 0);
      var V1 = nAuj * P1, fraisV = V1 * fv, garde = (cout + V1) / 2 * g * annees;
      var final = V1 - fraisV - garde + totDiv + reste, res = final - M;
      var seuil = (M - reste) / nAuj; // prix de revente qui rembourse l'achat et ses frais
      rendre({ nom: MK.titre(f), code: code, M: M, jAchat: jAchat, jFin: jFin, prixEpoque: prixEpoque, P1: P1, nEpoque: nEpoque, nAuj: nAuj, ops: ops,
        cout: cout, fraisA: fraisA, reste: reste, divs: divs, totDiv: totDiv, V1: V1, fraisV: fraisV, garde: garde, final: final, res: res, annees: annees, marche: marche,
        courbe: h.map(function (x) { var dv = 0; divs.forEach(function (d) { if (d.detachement <= x[0]) dv += d.montant * nAuj; }); return [x[0], nAuj * x[1] + dv + reste]; }),
        idx: idx, seuil: seuil });
    }).catch(function () { out.innerHTML = '<p class="si-err">Les cours de cette société ne se chargent pas. Réessayez dans un instant.</p>'; });
  }

  function courbe(pts, ref, M) {
    // Deux courbes : la valeur du placement (bleu nuit) et le même montant suivant le BRVM Composite (cyan)
    var w = 640, h = 180, n = pts.length;
    var map = {}; ref.forEach(function (x) { map[x[0]] = x[1]; });
    var base = ref[0][1], r = pts.map(function (x) { return map[x[0]] != null ? M * map[x[0]] / base : null; });
    var vals = pts.map(function (x) { return x[1]; }).concat(r.filter(function (x) { return x != null; }));
    var mn = Math.min.apply(null, vals.concat([M])), mx = Math.max.apply(null, vals.concat([M])), rg = mx - mn || 1;
    function y(v) { return (h - 8 - (v - mn) / rg * (h - 16)).toFixed(1); }
    function x(i) { return (i / (n - 1) * w).toFixed(1); }
    var d1 = pts.map(function (p, i) { return (i ? 'L' : 'M') + x(i) + ' ' + y(p[1]); }).join(' ');
    var d2 = '', on = false; r.forEach(function (v, i) { if (v == null) return; d2 += (on ? 'L' : 'M') + x(i) + ' ' + y(v); on = true; });
    var yM = y(M);
    return '<svg class="si-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Valeur du placement et du marché, du ' + dt(pts[0][0]) + ' au ' + dt(pts[n - 1][0]) + '">' +
      '<line x1="0" x2="' + w + '" y1="' + yM + '" y2="' + yM + '" stroke="#c9d6e3" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>' +
      '<path d="' + d2 + '" fill="none" stroke="#21a4c2" stroke-width="2" vector-effect="non-scaling-stroke"/>' +
      '<path d="' + d1 + '" fill="none" stroke="#0b1220" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>' +
      '<div class="si-axe"><span>' + dt(pts[0][0]) + '</span><span>' + dt(pts[n - 1][0]) + '</span></div>' +
      '<p class="si-leg"><i style="background:#0b1220"></i>Votre placement (cours + dividendes, avant frais de vente et de garde) <i style="background:#21a4c2"></i>Le même montant dans tout le marché (BRVM Composite) <i class="si-tir"></i>Montant de départ</p>' +
      '<p class="si-pas">Un point par séance, du ' + dt(pts[0][0]) + ' au ' + dt(pts[n - 1][0]) + ' (' + n + ' séances).</p>';
  }

  function ligne(lib, val, cls) { return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + lib + '</td><td>' + val + '</td></tr>'; }

  function rendre(R) {
    var gain = R.res >= 0, pRes = R.res / R.M * 100;
    var opTxt = R.ops.length ? ' Après ' + R.ops.map(function (a) { return (a.type === 'attribution gratuite' ? 'les actions gratuites du ' : a.type && a.type.indexOf('droit') >= 0 ? 'l’augmentation de capital du ' : 'le fractionnement du ') + dt(a.date); }).join(' et ') + ', elles sont devenues <b>' + f0(R.nAuj) + ' actions</b>.' : '';
    var h = '<div class="si-verdict ' + (gain ? 'si-up' : 'si-dn') + '"><p class="si-k">Résultat net, frais compris</p><p class="si-big">' + (gain ? '+' : '−') + fF(Math.abs(R.res)) + ' <span>' + pc(pRes) + '</span></p>' +
      '<p>Avec <b>' + fF(R.M) + '</b> le ' + dt(R.jAchat) + ', vous auriez acheté <b>' + f0(R.nEpoque) + ' action' + (R.nEpoque > 1 ? 's' : '') + ' ' + MK.esc(R.nom) + '</b> à ' + fF(R.prixEpoque) + '.' + opTxt +
      ' Le ' + dt(R.jFin) + ', il vous resterait <b>' + fF(R.final) + '</b>.</p>' +
      '<p class="si-comp">Sur la même période, tout le marché (BRVM Composite) a fait <b>' + pc(R.marche) + '</b>, hors dividendes et hors frais.</p></div>';
    h += '<div class="si-cols"><div class="si-detail"><h3>Le détail</h3><table class="si-t"><tbody>' +
      ligne('Achat de ' + f0(R.nEpoque) + ' action' + (R.nEpoque > 1 ? 's' : ''), '−' + fF(R.cout)) +
      ligne('Frais d’achat', '−' + fF(R.fraisA)) +
      ligne('Reste non investi', fF(R.reste)) +
      ligne('Dividendes encaissés (' + R.divs.length + ')', '+' + fF(R.totDiv)) +
      ligne('Valeur des actions le ' + dt(R.jFin), fF(R.V1)) +
      ligne('Frais de vente', '−' + fF(R.fraisV)) +
      ligne('Droits de garde (' + R.annees.toFixed(1).replace('.', ',') + ' an' + (R.annees >= 2 ? 's' : '') + ')', '−' + fF(R.garde)) +
      ligne('Il vous resterait', fF(R.final), 'si-tot') + '</tbody></table>' +
      (R.divs.length ? '<p class="si-note">Dividendes nets par action, détachés le ' + R.divs.map(function (d) { return dt(d.detachement) + ' (' + String(d.montant).replace('.', ',') + ' F' + (d.detachement_estime ? ', date estimée' : '') + ')'; }).join(', ') + '.</p>' : '<p class="si-note">Aucun dividende détaché sur la période.</p>') +
      '<p class="si-note">Pour rentrer dans ses frais d’achat, il fallait revendre au moins ' + fF(R.seuil) + ' par action (cours d’aujourd’hui : ' + fF(R.P1) + ').</p></div>' +
      '<div class="si-graph"><h3>Mois après mois</h3>' + courbe(R.courbe, R.idx, R.M) + '</div></div>';
    h += lecon(R);
    $('si-res').innerHTML = h;
    MK.compte('simulateur-bourse-' + R.code);
    $('si-res').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function rendreIndice(M, fa, fv, g, idx, annees, marche) {
    var net = M * (1 - fa) * (1 + marche / 100), final = net * (1 - fv) - (M + net) / 2 * g * annees, res = final - M;
    $('si-res').innerHTML = '<div class="si-verdict ' + (res >= 0 ? 'si-up' : 'si-dn') + '"><p class="si-k">Résultat net, frais compris</p><p class="si-big">' + (res >= 0 ? '+' : '−') + fF(Math.abs(res)) + ' <span>' + pc(res / M * 100) + '</span></p>' +
      '<p>Si <b>' + fF(M) + '</b> avaient suivi tout le marché (BRVM Composite) depuis le ' + dt(idx[0][0]) + ', il vous resterait <b>' + fF(final) + '</b> le ' + dt(idx[idx.length - 1][0]) + '. L’indice a fait <b>' + pc(marche) + '</b> sur la période, hors dividendes.</p>' +
      '<p class="si-comp">On ne peut pas acheter l’indice directement à la Bourse (BRVM) : c’est un repère. Pour s’en approcher, il faut répartir son argent entre plusieurs sociétés, ou passer par un fonds.</p></div>' +
      '<div class="si-graph"><h3>Mois après mois</h3>' + courbe(idx.map(function (x) { return [x[0], M * x[1] / idx[0][1]]; }), idx, M) + '</div>';
  }

  function lecon(R) {
    // La leçon EFA : ce que ce résultat apprend, et la prochaine décision
    var poidsDiv = R.res > 0 && R.totDiv > 0 ? R.totDiv / (R.res + R.fraisA + R.fraisV + R.garde) * 100 : 0;
    var fr = R.fraisA + R.fraisV + R.garde, l = [];
    if (R.totDiv > 0) l.push('Les dividendes ont rapporté <b>' + fF(R.totDiv) + '</b>' + (poidsDiv >= 10 ? ', soit ' + Math.round(poidsDiv) + ' % du gain avant frais' : '') + '. À la Bourse (BRVM), une partie du résultat vient des revenus versés, pas seulement de la hausse du cours.');
    l.push('Les frais ont coûté <b>' + fF(fr) + '</b>, soit ' + pc(fr / R.M * 100).replace('+', '') + ' du montant. Sur un petit montant, la garde et le courtage pèsent lourd : comparez les grilles des SGI avant d’ouvrir un compte.');
    if (R.res >= 0 && R.res / R.M * 100 < R.marche) l.push('Votre choix a fait moins bien que tout le marché. Répartir son argent sur plusieurs sociétés évite de tout miser sur une seule.');
    if (R.res < 0) l.push('Une baisse sur la période ne dit pas tout : regardez pourquoi le cours a reculé (résultats, dividende détaché, marché) avant de décider de vendre ou d’attendre.');
    return '<div class="si-lecon"><p class="si-k">Ce que ce résultat vous apprend</p><ul>' + l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '<a class="si-cta" href="questions-a-poser-a-sa-sgi.html">Avant d’acheter : les questions à poser à sa SGI →</a></div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    MK = window.EFA_MK;
    if (!MK) return;
    charger().then(function () {
      $('si-form').addEventListener('submit', function (e) { e.preventDefault(); calculer(); });
      calculer();
    }).catch(function () { $('si-res').innerHTML = '<p class="si-err">Les données de la Bourse ne se chargent pas. Réessayez dans un instant.</p>'; });
  });
})();
