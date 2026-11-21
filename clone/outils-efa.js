/* Outils EFA (21 nov. 2026) : Mon vrai reste, Mes dettes classées, Puis-je aider ce mois-ci ?, Mon idée vaut-elle un test ?,
   Mon patrimoine, Cette promesse est-elle crédible ?, Mon journal de décisions, Mon année EFA.
   Chaque outil part d'une question, prend les chiffres de la personne et rend une décision ou une fiche à garder.
   Rien n'est envoyé à EFA : tout reste dans ce navigateur (localStorage). */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  function num(v) { var x = parseFloat(String(v == null ? '' : v).replace(/[\s  ]/g, '').replace(',', '.')); return isNaN(x) ? 0 : x; }
  function f0(x) { return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace('-', '−'); }
  function fF(x) { return f0(x) + ' F'; }
  function pc(x, d) { if (Math.abs(x) >= 1000) return f0(x) + '\u00a0%'; return (Math.round(x * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toString().replace('.', ',') + ' %'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lire(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function oter(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function auj() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dateFr(d) { if (!d) return ''; var p = d.split('-'); return (+p[2] === 1 ? '1er' : +p[2]) + ' ' + MOIS[+p[1] - 1] + ' ' + p[0]; }
  function duree(m) { if (m < 12) return m + ' mois'; var a = Math.floor(m / 12), r = m % 12; return a + ' an' + (a > 1 ? 's' : '') + (r ? ' et ' + r + ' mois' : ''); }
  // Un relevé par mois, 36 au plus : c'est ce qui nourrit « Mon année EFA ».
  function releve(S, v) { S.hist = S.hist || []; var m = auj().slice(0, 7), i = -1; S.hist.forEach(function (h, k) { if (h.m === m) i = k; }); var e = { m: m, d: auj() }; for (var x in v) e[x] = v[x]; if (i >= 0) S.hist[i] = e; else S.hist.push(e); if (S.hist.length > 36) S.hist = S.hist.slice(-36); }
  function compte(n) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'outil-' + n, title: n, event: true }); } catch (e) {} }
  function barre(lib, part, val, c) { return '<div class="ot-br"><span>' + lib + '</span><div class="ot-piste"><i class="' + (c || '') + '" style="width:' + Math.max(0, Math.min(100, part)).toFixed(1) + '%"></i></div><b>' + val + '</b></div>'; }
  function carte(k, v, p, c) { return '<div class="ot-c ' + (c || '') + '"><p class="ot-k">' + k + '</p><p class="ot-v">' + v + '</p>' + (p ? '<p>' + p + '</p>' : '') + '</div>'; }
  function garde(cle) { return '<p class="ot-garde">Vos chiffres restent sur ce téléphone : rien n’est envoyé à EFA. <button type="button" class="ot-lien" data-effacer="' + cle + '">Tout effacer</button></p>'; }
  function milliers(el) { el.addEventListener('blur', function () { var v = num(el.value); el.value = v ? f0(v) : ''; }); }

  /* Lignes libellé + montant(s), que l'on peut ajouter ou retirer */
  function lignes(box, cols, rows, onchange) {
    function ligne(r) {
      var d = document.createElement('div'); d.className = 'ot-l ot-l' + cols.length;
      d.innerHTML = cols.map(function (c, i) { return '<label><span>' + c.t + '</span><input data-c="' + c.k + '"' + (c.txt ? '' : ' inputmode="decimal"') + ' placeholder="' + (c.ph || '') + '" value="' + esc(r && r[c.k] != null && r[c.k] !== '' ? (c.txt || c.brut ? r[c.k] : (num(r[c.k]) ? f0(num(r[c.k])) : '')) : '') + '"' + (i === 0 ? ' class="ot-nom"' : '') + '></label>'; }).join('') + '<button type="button" class="ot-x" aria-label="Retirer cette ligne">×</button>';
      d.querySelector('.ot-x').addEventListener('click', function () { d.remove(); onchange && onchange(); });
      [].forEach.call(d.querySelectorAll('input'), function (el) { var c = cols.filter(function (x) { return x.k === el.dataset.c; })[0]; if (!c.txt && !c.brut) milliers(el); el.addEventListener('change', function () { onchange && onchange(); }); });
      box.appendChild(d);
    }
    box.innerHTML = ''; (rows && rows.length ? rows : [{}]).forEach(ligne);
    return {
      ajouter: function (r) { ligne(r || {}); var L = box.querySelectorAll('.ot-nom'); L[L.length - 1].focus(); },
      lire: function () { return [].map.call(box.querySelectorAll('.ot-l'), function (d) { var o = {}; [].forEach.call(d.querySelectorAll('input'), function (el) { var c = cols.filter(function (x) { return x.k === el.dataset.c; })[0]; o[c.k] = c.txt ? el.value.trim() : num(el.value); }); return o; }); }
    };
  }
  function lecon(titre, items, liens) {
    return '<div class="ot-lecon"><p class="ot-k">' + titre + '</p><ul>' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      (liens ? '<p class="ot-boutons">' + liens.map(function (l, i) { return '<a class="ot-b' + (i ? ' ot-b2' : '') + '" href="' + l[0] + '">' + l[1] + '</a>'; }).join('') + '</p>' : '') + '</div>';
  }

  var OUTILS = {};

  /* ============ 1. MON VRAI RESTE ============ */
  OUTILS.reste = function () {
    var K = 'efa_reste_v1', S = lire(K) || {};
    var REV = [{ n: 'Salaire ou revenu principal' }, { n: 'Activité à côté' }], OBL = ['Loyer', 'Transport', 'Nourriture', 'Eau, électricité, téléphone', 'Scolarité', 'Remboursements de crédit', 'Cotisation de tontine', 'Part de la famille'].map(function (n) { return { n: n }; });
    var R = lignes($('re-rev'), [{ k: 'n', t: 'Ce qui rentre', txt: 1, ph: 'Ex. salaire' }, { k: 'm', t: 'Montant du mois (FCFA)', ph: '0' }], S.rev || REV, calc);
    var O = lignes($('re-obl'), [{ k: 'n', t: 'Ce que je dois payer', txt: 1, ph: 'Ex. loyer' }, { k: 'm', t: 'Montant du mois (FCFA)', ph: '0' }], S.obl || OBL, calc);
    $('re-rev-plus').addEventListener('click', function () { R.ajouter(); }); $('re-obl-plus').addEventListener('click', function () { O.ajouter(); });
    $('re-form').addEventListener('submit', function (e) { e.preventDefault(); calc(true); });
    function calc(defiler) {
      var rev = R.lire().filter(function (x) { return x.m > 0; }), obl = O.lire().filter(function (x) { return x.m > 0; }), out = $('re-res');
      var tr = rev.reduce(function (s, x) { return s + x.m; }, 0), to = obl.reduce(function (s, x) { return s + x.m; }, 0), reste = tr - to;
      if (!tr) { out.innerHTML = '<p class="ot-vide">Indiquez au moins un revenu pour voir votre vrai reste.</p>'; return; }
      S.rev = R.lire(); S.obl = O.lire(); S.reste = reste; S.revenu = tr; S.d = auj(); releve(S, { revenu: tr, obligations: to, reste: reste }); ecrire(K, S);
      var part = to / tr * 100, tri = obl.slice().sort(function (a, b) { return b.m - a.m; }), jour = reste / 30;
      var niveau = reste <= 0 ? 'r' : part > 90 ? 'o' : 'v';
      var msg = reste < 0 ? 'Vos obligations dépassent vos revenus de <b>' + fF(-reste) + '</b>.' : reste === 0 ? '<b>Tout votre revenu est déjà engagé</b> : une fois vos obligations payées, il ne vous reste rien.' : 'Une fois vos obligations payées, il vous reste <b>' + fF(reste) + '</b> ce mois-ci, soit environ ' + fF(jour) + ' par jour.';
      var choc = tr * 0.7 - to;
      var h = '<p class="ot-message">' + msg + '</p><div class="ot-trois">' +
        carte('Ce qui rentre', fF(tr), rev.length + ' source' + (rev.length > 1 ? 's' : '') + ' de revenu.', 'ot-t1') +
        carte('Ce que je dois payer', fF(to), pc(part) + ' de mes revenus sont engagés d’avance.', part > 90 ? 'ot-t3' : 'ot-t5') +
        carte('Mon vrai reste', (reste < 0 ? '−' : '') + fF(Math.abs(reste)), reste < 0 ? 'Il manque cette somme chaque mois.' : reste === 0 ? 'Aucune marge : le moindre imprévu devient une dette.' : 'C’est sur cette somme que tout se construit.', reste <= 0 ? 'ot-t3' : 'ot-t2') + '</div>' +
        '<div class="ot-bloc"><h3>Où partent mes obligations</h3><div class="ot-barres">' + tri.map(function (x) { return barre(esc(x.n || 'Sans nom'), x.m / tri[0].m * 100, fF(x.m), x.m / tr > 0.3 ? 'ot-i-r' : ''); }).join('') + '</div>' +
        (tri[0] && tri[0].m / tr > 0.3 ? '<p class="ot-note">« ' + esc(tri[0].n) + ' » prend à lui seul ' + pc(tri[0].m / tr * 100) + ' de vos revenus : c’est là qu’un changement pèse le plus.</p>' : '') + '</div>' +
        '<div class="ot-bloc" id="mois-difficile"><h3>Et si mon revenu baissait de 30 % ?</h3><p>Avec ' + fF(tr * 0.7) + ' de revenus et les mêmes obligations, votre reste serait de <b class="' + (choc < 0 ? 'ot-rouge' : 'ot-vert') + '">' + (choc < 0 ? '−' : '') + fF(Math.abs(choc)) + '</b>.</p>' +
        (choc < 0 ? '<p>Pour tenir ce mois-là, classez dès maintenant vos obligations : celles à <b>maintenir</b> coûte que coûte (loyer, nourriture, scolarité), celles à <b>renégocier</b> (crédit, tontine), celles à <b>réduire</b> (téléphone, part de la famille). Il vous faudrait une réserve d’au moins ' + fF(-choc) + ' par mois difficile.</p>' : '<p>Vous tiendriez un mois difficile sans emprunter. C’est une vraie force : protégez-la avec une réserve.</p>') + '</div>';
      var cap = reste > 0 ? Math.round(reste * 0.5 / 1000) * 1000 : 0;
      h += niveau === 'r' ? lecon('Ce que cela aide à décider', ['<b>Ne comblez pas l’écart par une nouvelle dette.</b> Elle ajouterait une obligation de plus le mois prochain.', '<b>Regardez les lignes renégociables</b> : crédit, tontine, abonnements, part de la famille.', '<b>Cherchez le franc de plus</b>, même petit : un revenu d’appoint réduit l’écart plus vite qu’une privation.'], [['mes-dettes.html', 'Classer mes dettes'], ['renegocier-une-dette.html', 'Préparer une renégociation'], ['generateur-de-projet.html', 'Trouver un revenu de plus']])
        : lecon('Ce que cela aide à décider', ['<b>Donnez une destination à ce reste</b> avant de le dépenser : ' + (cap ? 'mettre de côté ' + fF(cap) + ' dès le jour de paie en laisse autant pour vivre.' : 'même une petite somme mise de côté compte.'), '<b>C’est votre capacité à bâtir</b> : réserve d’abord, puis une activité ou un placement.', '<b>Refaites ce calcul chaque mois</b> : EFA garde vos relevés pour vous montrer le chemin parcouru.'], [['ou-garder-sa-reserve.html#calcul', 'Calculer ma réserve'], ['puis-je-aider.html', 'Puis-je aider ce mois-ci ?'], ['ma-brvm.html#mensuel', 'Investir chaque mois']]);
      out.innerHTML = h + garde(K); compte('reste');
      if (defiler === true) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (S.rev) calc();
  };

  /* ============ 2. MES DETTES CLASSÉES ============ */
  function simuler(D, extra, ordre) {
    var L = D.map(function (d) { return { n: d.n, s: d.s, m: d.m, t: d.t / 100 / 12 }; }), mois = 0, interets = 0, soldees = [], bloque = false;
    while (L.some(function (d) { return d.s > 0.5; }) && mois < 600) {
      mois++;
      var dispo = extra;
      L.forEach(function (d) { if (d.s <= 0.5) { dispo += ordre ? d.m : 0; return; } var i = d.s * d.t; interets += i; d.s += i; var p = Math.min(d.m, d.s); d.s -= p; });
      if (ordre) {
        var cibles = L.filter(function (d) { return d.s > 0.5; }).sort(ordre);
        for (var k = 0; k < cibles.length && dispo > 0.5; k++) { var p = Math.min(dispo, cibles[k].s); cibles[k].s -= p; dispo -= p; }
      }
      L.forEach(function (d) { if (d.s <= 0.5 && soldees.indexOf(d.n) < 0) soldees.push(d.n); });
    }
    if (mois >= 600) bloque = true;
    return { mois: mois, interets: interets, ordre: soldees, bloque: bloque };
  }
  OUTILS.dettes = function () {
    var K = 'efa_dettes_v1', S = lire(K) || {};
    var D = lignes($('de-l'), [{ k: 'n', t: 'La dette', txt: 1, ph: 'Ex. crédit moto' }, { k: 's', t: 'Reste à rembourser (FCFA)', ph: '0' }, { k: 'm', t: 'Je paie par mois (FCFA)', ph: '0' }, { k: 't', t: 'Taux par an (%), si connu', brut: 1, ph: '0' }], S.l || [{}, {}], null);
    $('de-plus').addEventListener('click', function () { D.ajouter(); });
    if (S.extra) $('de-extra').value = f0(S.extra); milliers($('de-extra'));
    $('de-form').addEventListener('submit', function (e) { e.preventDefault(); calc(true); });
    function calc(defiler) {
      var L = D.lire().filter(function (x) { return x.s > 0; }).map(function (x, i) { return { n: x.n || 'Dette ' + (i + 1), s: x.s, m: x.m, t: Math.max(0, Math.min(num(x.t), 300)) }; }), extra = num($('de-extra').value), out = $('de-res');
      if (!L.length) { out.innerHTML = '<p class="ot-vide">Indiquez au moins une dette, avec ce qu’il reste à rembourser et ce que vous payez par mois.</p>'; return; }
      var sansM = L.filter(function (d) { return d.m <= 0; });
      if (sansM.length) { out.innerHTML = '<p class="ot-err">Indiquez ce que vous payez chaque mois pour « ' + esc(sansM[0].n) + ' », même une petite somme : sans paiement, une dette ne se rembourse pas.</p>'; return; }
      var tot = L.reduce(function (s, d) { return s + d.s; }, 0), mens = L.reduce(function (s, d) { return s + d.m; }, 0);
      var noyees = L.filter(function (d) { return d.t > 0 && d.m <= d.s * d.t / 100 / 12; });
      var base = simuler(L, 0, null), av = simuler(L, extra, function (a, b) { return b.t - a.t || a.s - b.s; }), bn = simuler(L, extra, function (a, b) { return a.s - b.s || b.t - a.t; });
      S.l = D.lire(); S.extra = extra; S.total = tot; S.d = auj(); releve(S, { total: tot, mensualites: mens }); ecrire(K, S);
      var memes = av.ordre.join('|') === bn.ordre.join('|'), gain = base.bloque ? null : base.mois - Math.min(av.mois, bn.mois), eco = base.interets - Math.min(av.interets, bn.interets);
      var h = '<p class="ot-message">Vous devez <b>' + fF(tot) + '</b> en ' + L.length + ' dette' + (L.length > 1 ? 's' : '') + ', et vous payez <b>' + fF(mens) + '</b> par mois.' + (av.bloque ? '' : ' En vous y prenant dans le bon ordre, vous êtes libre dans <b>' + duree(Math.min(av.mois, bn.mois)) + '</b>.') + '</p>';
      if (noyees.length) h += '<p class="ot-err"><b>Attention :</b> pour « ' + noyees.map(function (d) { return esc(d.n); }).join(' », « ') + ' », votre paiement mensuel ne couvre même pas les intérêts. Cette dette grossit chaque mois : c’est la première à renégocier.</p>';
      h += '<div class="ot-trois">' + carte('Total de mes dettes', fF(tot), L.length + ' ligne' + (L.length > 1 ? 's' : '') + '.', 'ot-t3') + carte('Je paie par mois', fF(mens + extra), extra ? 'dont ' + fF(extra) + ' en plus des mensualités.' : 'Mensualités actuelles.', 'ot-t1') +
        carte('Libre dans', av.bloque ? 'Trop long' : duree(Math.min(av.mois, bn.mois)), av.bloque ? 'À ce rythme, les intérêts l’emportent.' : (gain > 0 ? 'soit ' + duree(gain) + ' de moins qu’en payant seulement les mensualités.' : 'avec la méthode ci-dessous.'), 'ot-t2') + '</div>';
      function bloc(t, sous, r, c) {
        return '<div class="ot-bloc ' + c + '"><h3>' + t + '</h3><p>' + sous + '</p><p class="ot-note">Ordre dans lequel vos dettes s’éteignent :</p><ol class="ot-ordre">' + r.ordre.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ol>' + (r.bloque ? '<p class="ot-rouge">Remboursement trop long à ce rythme.</p>' : '<p><b>' + duree(r.mois) + '</b> · ' + fF(r.interets) + ' d’intérêts au total.</p>') + '</div>';
      }
      h += '<div class="ot-deux">' + bloc('Méthode avalanche', 'La dette la plus chère d’abord. Chaque dette soldée libère sa mensualité pour la suivante.', av, 'ot-t5') + bloc('Méthode boule de neige', 'La plus petite d’abord, pour voir vite une dette disparaître et garder l’élan.', bn, 'ot-t4') + '</div>';
      h += '<p>' + (memes ? 'Dans votre cas, les deux méthodes donnent le même ordre : suivez-le sans hésiter.' : (av.interets < bn.interets - 1 ? 'L’avalanche vous fait économiser <b>' + fF(bn.interets - av.interets) + '</b> d’intérêts par rapport à la boule de neige. ' : 'Les deux méthodes coûtent presque la même chose. ') + 'Choisissez celle que vous tiendrez : une méthode suivie vaut mieux qu’une méthode parfaite abandonnée.') + '</p>';
      if (!base.bloque && eco > 1) h += '<p class="ot-note">En payant seulement les mensualités, sans reporter l’argent libéré : ' + duree(base.mois) + ' et ' + fF(base.interets) + ' d’intérêts. L’ordre choisi vous fait économiser ' + fF(eco) + '.</p>';
      if (!extra) h += '<p class="ot-note">Essayez d’ajouter une petite somme dans « Je peux ajouter par mois » : vous verrez combien de mois elle vous fait gagner.</p>';
      h += lecon('Ce que cela aide à décider', ['<b>Une seule cible à la fois.</b> Le minimum partout, tout le surplus sur une seule dette.', '<b>Aucune nouvelle dette</b> pendant le remboursement, sauf urgence vitale.', '<b>Parlez à vos prêteurs avant le premier impayé</b> : un allongement ou un report se négocie.'], [['renegocier-une-dette.html', 'Préparer une renégociation'], ['cout-total-credit.html#calcul', 'Le vrai coût d’un crédit'], ['mon-vrai-reste.html', 'Mon vrai reste']]);
      out.innerHTML = h + garde(K); compte('dettes');
      if (defiler === true) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (S.l) calc();
  };

  /* ============ 3. PUIS-JE AIDER CE MOIS-CI ? ============ */
  OUTILS.aider = function () {
    var K = 'efa_aider_v1', S = lire(K) || {}, RE = lire('efa_reste_v1');
    ['ai-reste', 'ai-epargne', 'ai-deja', 'ai-demande', 'ai-reserve', 'ai-depenses'].forEach(function (id) { var el = $(id); milliers(el); var k = id.slice(3); if (S[k]) el.value = f0(S[k]); });
    if (!S.reste && RE && RE.reste > 0) { $('ai-reste').value = f0(RE.reste); $('ai-repris').hidden = false; }
    $('ai-form').addEventListener('submit', function (e) { e.preventDefault(); calc(true); });
    function calc(defiler) {
      var v = {}; ['reste', 'epargne', 'deja', 'demande', 'reserve', 'depenses'].forEach(function (k) { v[k] = num($('ai-' + k).value); });
      var out = $('ai-res');
      if (!v.demande) { out.innerHTML = '<p class="ot-vide">Indiquez la somme que l’on vous demande.</p>'; return; }
      var dispo = Math.max(0, v.reste - v.epargne - v.deja), fragile = v.depenses > 0 && v.reserve < v.depenses;
      for (var k in v) S[k] = v[k]; S.d = auj(); ecrire(K, S);
      var niv = dispo >= v.demande ? 'oui' : dispo > 0 ? 'partie' : 'non', arr = function (x) { return Math.floor(x / 1000) * 1000; };
      var h = '<p class="ot-message">' + (niv === 'oui' ? '<b>Oui, vous pouvez aider</b> de ' + fF(v.demande) + ' ce mois-ci sans toucher à vos obligations ni à votre épargne.' : niv === 'partie' ? 'Vous pouvez donner <b>' + fF(arr(dispo) || dispo) + '</b> sans vous mettre en difficulté. Pas les ' + fF(v.demande) + ' demandés.' : '<b>Pas ce mois-ci</b> sans vous fragiliser : votre marge est déjà engagée.') + '</p>' +
        '<div class="ot-trois">' + carte('Mon vrai reste', fF(v.reste), 'après mes obligations du mois.', 'ot-t1') + carte('Déjà engagé', fF(v.epargne + v.deja), 'mon épargne du mois et ce que j’ai déjà donné.', 'ot-t5') + carte('Ce que je peux donner', fF(dispo), niv === 'oui' ? 'La demande tient dans cette somme.' : 'La demande est de ' + fF(v.demande) + '.', niv === 'oui' ? 'ot-t2' : 'ot-t3') + '</div>';
      if (fragile) h += '<p class="ot-err">Votre réserve (' + fF(v.reserve) + ') ne couvre pas un mois de dépenses indispensables (' + fF(v.depenses) + '). N’y touchez pas pour aider : c’est elle qui vous évite de demander à votre tour.</p>';
      var dire = niv === 'oui' ? '« Je peux te donner ' + fF(v.demande) + ' ce mois-ci. »' : niv === 'partie' ? '« Je ne peux pas te donner ' + fF(v.demande) + ' ce mois-ci. Je peux te donner ' + fF(arr(dispo) || dispo) + ' maintenant' + (v.demande - dispo > 0 ? ', et voir le mois prochain pour le reste' : '') + '. »' : '« Ce mois-ci, mon enveloppe pour la famille est épuisée. Je ne peux pas donner d’argent, mais dis-moi ce dont tu as besoin : je peux peut-être aider autrement. »';
      h += '<div class="ot-bloc ot-t6"><h3>Une façon de le dire</h3><p class="ot-dire">' + dire + '</p><p class="ot-note">Dites clairement si c’est un don ou un prêt. Ne donnez que ce que vous êtes prêt à ne jamais revoir.</p></div>';
      h += lecon('Ce que cela aide à décider', ['<b>Fixez une enveloppe famille</b> chaque mois, comme une charge : vous aidez sans vous justifier ni vous épuiser.', '<b>Aider autrement</b> est aussi aider : une course, un contact, un paiement direct à l’école ou à la pharmacie.', '<b>Celui qui s’épuise ne peut plus aider personne.</b> Protéger votre réserve, c’est protéger les vôtres.'], [['preter-a-un-proche.html', 'Prêter à un proche'], ['mon-vrai-reste.html', 'Calculer mon vrai reste'], ['solidarite-assureur-de-la-famille.html', 'La solidarité familiale']]);
      out.innerHTML = h + garde(K); compte('aider');
      if (defiler === true) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (S.demande) calc();
  };

  /* ============ 4. MON IDÉE VAUT-ELLE UN TEST ? ============ */
  OUTILS.idee = function () {
    var K = 'efa_idee_v1', S = lire(K) || {};
    var Q = [['vendu', 'J’ai déjà vendu ce produit ou ce service au moins une fois, même à un proche.', 3], ['payeurs', 'Au moins cinq personnes m’ont dit le prix qu’elles seraient prêtes à payer.', 2], ['concurrents', 'Je connais trois concurrents et leurs prix.', 2],
      ['clients', 'Je sais où trouver mes dix premiers clients, et comment leur parler.', 2], ['local', 'Je peux tester sans louer de local ni acheter de gros matériel.', 2], ['temps', 'Je peux y consacrer au moins cinq heures par semaine.', 1], ['perte', 'Si le test échoue, la somme engagée ne met pas mon budget en danger.', 2]];
    $('id-q').innerHTML = Q.map(function (q) { return '<label class="ot-coche"><input type="checkbox" id="id-' + q[0] + '"' + (S.q && S.q[q[0]] ? ' checked' : '') + '><span>' + q[1] + '</span></label>'; }).join('');
    if (S.idee) $('id-idee').value = S.idee; ['id-prix', 'id-cout', 'id-budget'].forEach(function (id) { milliers($(id)); var k = id.slice(3); if (S[k]) $(id).value = f0(S[k]); });
    $('id-form').addEventListener('submit', function (e) { e.preventDefault(); calc(true); });
    function calc(defiler) {
      var idee = $('id-idee').value.trim(), prix = num($('id-prix').value), cout = num($('id-cout').value), budget = num($('id-budget').value), out = $('id-res'), rep = {}, pts = 0, max = 0;
      Q.forEach(function (q) { rep[q[0]] = $('id-' + q[0]).checked; max += q[2]; if (rep[q[0]]) pts += q[2]; });
      if (!idee) { out.innerHTML = '<p class="ot-vide">Décrivez votre idée en une phrase : ce que vous vendez, et à qui.</p>'; return; }
      var marge = prix - cout, mOK = prix > 0 && marge > 0; max += 3; if (mOK) pts += 3;
      S = { idee: idee, prix: prix, cout: cout, budget: budget, q: rep, pts: pts, d: auj() }; ecrire(K, S);
      var niv = !mOK && prix > 0 ? 'r' : pts >= 12 ? 'v' : pts >= 7 ? 'o' : 'r';
      var manque = Q.filter(function (q) { return !rep[q[0]]; });
      var h = '<p class="ot-message">' + (niv === 'v' ? '<b>Oui, cette idée mérite un test.</b> Vous avez déjà l’essentiel : des signes que des clients paient.' : niv === 'o' ? '<b>Presque.</b> L’idée tient debout, mais il vous manque encore des preuves avant d’y mettre de l’argent.' : (!mOK && prix > 0 ? '<b>Pas encore : à ce prix, chaque vente vous coûte de l’argent.</b> Revoyez le prix ou le coût avant tout.' : '<b>Pas encore.</b> Pour l’instant c’est une intuition : allez chercher des preuves avant de dépenser.')) + '</p>' +
        '<div class="ot-trois">' + carte('Preuves réunies', pts + ' sur ' + max, 'Chaque case cochée est une preuve, pas une opinion.', niv === 'v' ? 'ot-t2' : niv === 'o' ? 'ot-t5' : 'ot-t3') +
        carte('Ce qui reste par vente', prix ? (marge < 0 ? '−' : '') + fF(Math.abs(marge)) : '—', prix ? 'Prix ' + fF(prix) + ', coût ' + fF(cout) + '. Avant loyer, transport et votre propre paie.' : 'Indiquez un prix et un coût.', mOK ? 'ot-t2' : 'ot-t3') +
        carte('Ventes pour rentrer dans la mise', budget && mOK ? f0(Math.ceil(budget / marge)) : '—', budget && mOK ? 'ventes pour récupérer les ' + fF(budget) + ' du test.' : 'Indiquez la somme que vous engagez dans le test.', 'ot-t1') + '</div>';
      var test = !rep.vendu ? 'Vendez une fois. Proposez « ' + esc(idee) + ' » à dix personnes cette semaine et obtenez trois commandes avec un acompte.' : !rep.payeurs ? 'Demandez à cinq acheteurs possibles quel prix ils paieraient, puis proposez-leur ce prix tout de suite.' : !rep.concurrents ? 'Allez voir trois concurrents : leurs prix, leurs clients, ce qui manque chez eux.' : !rep.clients ? 'Écrivez la liste de vos dix premiers clients, avec leur nom, et contactez-en trois avant dimanche.' : 'Passez de une à dix ventes en gardant le même prix : si la demande suit, vous avez un début d’activité.';
      h += '<div class="ot-bloc ot-t6"><h3>Votre test de cette semaine</h3><p class="ot-dire">' + test + '</p><p class="ot-note">Les compliments ne prouvent rien. Un paiement, si.</p></div>';
      if (manque.length) h += '<div class="ot-bloc"><h3>Ce qu’il reste à prouver</h3><ul class="ot-liste">' + manque.map(function (q) { return '<li>' + q[1] + '</li>'; }).join('') + '</ul></div>';
      h += '<div class="ot-bloc"><h3>Mon plan des 30 premiers jours</h3><ol class="ot-ordre"><li><b>Semaine 1.</b> Le test ci-dessus : des ventes réelles, en petit.</li><li><b>Semaine 2.</b> Noter chaque vente : prix, coût, temps passé, ce que le client a dit.</li><li><b>Semaine 3.</b> Corriger une seule chose : le prix, le produit ou la façon de le proposer.</li><li><b>Semaine 4.</b> Décider avec les chiffres : continuer, changer ou arrêter.</li></ol></div>';
      h += lecon('Ce que cela aide à décider', ['<b>On vend avant d’investir.</b> Si personne n’achète en petit, personne n’achètera en grand.', '<b>Le loyer est la charge qui ferme les jeunes activités.</b> Louez quand vos ventes le justifient.', '<b>EFA ne promet aucune marge</b> : ce sont vos ventes réelles qui la diront.'], [['mon-business-plan-tient-il.html', 'Tester mon business plan'], ['generateur-de-projet.html', 'Chercher une autre idée'], ['atelier-activite-gagne-t-elle.html', 'Mon activité gagne-t-elle ?']]);
      out.innerHTML = h + garde(K); compte('idee');
      if (defiler === true) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (S.idee) calc();
  };

  /* ============ 5. MON PATRIMOINE, AUJOURD'HUI ET DANS DIX ANS ============ */
  OUTILS.patrimoine = function () {
    var K = 'efa_patrimoine_v1', S = lire(K) || {};
    var A0 = [{ n: 'Argent sur mes comptes et mobile money' }, { n: 'Tontine déjà cotisée, à recevoir' }, { n: 'Placements (actions, obligations, fonds)' }, { n: 'Terrain, maison' }, { n: 'Mon activité (stock, matériel)' }];
    var A = lignes($('pa-act'), [{ k: 'n', t: 'Ce que je possède', txt: 1, ph: 'Ex. terrain' }, { k: 'm', t: 'Valeur aujourd’hui (FCFA)', ph: '0' }], S.act || A0, null);
    var P = lignes($('pa-pas'), [{ k: 'n', t: 'Ce que je dois', txt: 1, ph: 'Ex. crédit' }, { k: 'm', t: 'Reste à rembourser (FCFA)', ph: '0' }], S.pas || [{ n: 'Crédits' }, { n: 'Dettes envers des proches' }], null);
    $('pa-act-plus').addEventListener('click', function () { A.ajouter(); }); $('pa-pas-plus').addEventListener('click', function () { P.ajouter(); });
    ['pa-mois', 'pa-cible'].forEach(function (id) { milliers($(id)); }); if (S.mois) $('pa-mois').value = f0(S.mois); if (S.cible) $('pa-cible').value = f0(S.cible);
    ['pa-t1', 'pa-t2', 'pa-t3'].forEach(function (id, i) { if (S.taux) $(id).value = String(S.taux[i]).replace('.', ','); });
    $('pa-form').addEventListener('submit', function (e) { e.preventDefault(); calc(true); });
    function proj(net, mois, taux, ans) { var r = taux / 100 / 12, v = net; for (var i = 0; i < ans * 12; i++) v = v * (1 + r) + mois; return v; }
    function atteindre(net, mois, taux, cible) { if (net >= cible) return 0; var r = taux / 100 / 12, v = net; for (var i = 1; i <= 720; i++) { v = v * (1 + r) + mois; if (v >= cible) return i; } return null; }
    function calc(defiler) {
      var act = A.lire().filter(function (x) { return x.m > 0; }), pas = P.lire().filter(function (x) { return x.m > 0; }), out = $('pa-res');
      var ta = act.reduce(function (s, x) { return s + x.m; }, 0), tp = pas.reduce(function (s, x) { return s + x.m; }, 0), net = ta - tp, mois = num($('pa-mois').value), cible = num($('pa-cible').value);
      var T = ['pa-t1', 'pa-t2', 'pa-t3'].map(function (id) { return Math.max(0, Math.min(num($(id).value), 30)); });
      if (!ta && !tp && !mois) { out.innerHTML = '<p class="ot-vide">Indiquez ce que vous possédez, ce que vous devez, ou ce que vous mettez de côté chaque mois.</p>'; return; }
      S.act = A.lire(); S.pas = P.lire(); S.mois = mois; S.cible = cible; S.taux = T; S.net = net; S.d = auj(); releve(S, { net: net, actifs: ta, dettes: tp }); ecrire(K, S);
      var tri = act.slice().sort(function (a, b) { return b.m - a.m; }), prec = (S.hist || []).filter(function (h) { return h.m < auj().slice(0, 7); }).slice(-1)[0];
      var h = '<p class="ot-message">Votre patrimoine aujourd’hui : <b>' + (net < 0 ? '−' : '') + fF(Math.abs(net)) + '</b>.' + (prec ? ' Il était de ' + (prec.net < 0 ? '−' : '') + fF(Math.abs(prec.net)) + ' en ' + MOIS[+prec.m.slice(5) - 1] + ' ' + prec.m.slice(0, 4) + '.' : '') + '</p>' +
        '<div class="ot-trois">' + carte('Ce que je possède', fF(ta), act.length + ' ligne' + (act.length > 1 ? 's' : '') + '.', 'ot-t1') + carte('Ce que je dois', fF(tp), ta ? pc(tp / ta * 100) + ' de ce que je possède.' : 'Aucun actif saisi.', tp > ta ? 'ot-t3' : 'ot-t5') + carte('Mon patrimoine', (net < 0 ? '−' : '') + fF(Math.abs(net)), net < 0 ? 'Vous devez plus que vous ne possédez : la première marche est de réduire les dettes.' : 'Ce qui est à vous, dettes déduites.', net < 0 ? 'ot-t3' : 'ot-t2') + '</div>';
      if (tri.length) h += '<div class="ot-bloc"><h3>De quoi il est fait</h3><div class="ot-barres">' + tri.map(function (x) { return barre(esc(x.n || 'Sans nom'), x.m / tri[0].m * 100, pc(x.m / ta * 100)); }).join('') + '</div>' + (tri[0].m / ta > 0.7 && tri.length > 1 ? '<p class="ot-note">« ' + esc(tri[0].n) + ' » représente ' + pc(tri[0].m / ta * 100) + ' de vos avoirs : un patrimoine posé sur une seule chose dépend entièrement d’elle.</p>' : '') + '</div>';
      var noms = ['Si rien ne rapporte', 'Hypothèse prudente', 'Hypothèse haute'];
      h += '<div class="ot-bloc" id="dans-dix-ans"><h3>Dans dix ans, en mettant ' + fF(mois) + ' de côté chaque mois</h3><div class="ot-defile"><table class="ot-t"><thead><tr><th>Hypothèse</th><th>Dans 1 an</th><th>Dans 5 ans</th><th>Dans 10 ans</th></tr></thead><tbody>' +
        T.map(function (t, i) { return '<tr><td>' + noms[i] + '<small>' + String(t).replace('.', ',') + ' % par an</small></td><td>' + fF(proj(net, mois, t, 1)) + '</td><td>' + fF(proj(net, mois, t, 5)) + '</td><td><b>' + fF(proj(net, mois, t, 10)) + '</b></td></tr>'; }).join('') + '</tbody></table></div>' +
        '<p class="ot-note">Ce sont des hypothèses, pas des promesses : vous pouvez les modifier. En dix ans, vous aurez versé ' + fF(mois * 120) + ' ; le reste vient de ce que l’argent placé rapporte. Hausse des prix non déduite.</p></div>';
      if (cible > 0) {
        h += '<div class="ot-bloc ot-t6" id="objectif"><h3>Pour atteindre ' + fF(cible) + '</h3><div class="ot-barres">' + T.map(function (t, i) { var m = atteindre(net, mois, t, cible); return barre(noms[i], m == null ? 100 : Math.min(100, m / 360 * 100), m == null ? 'plus de 60 ans' : m === 0 ? 'déjà atteint' : duree(m), m == null ? 'ot-i-r' : ''); }).join('') + '</div>';
        var m0 = atteindre(net, mois, T[1], cible), m2 = atteindre(net, mois * 2, T[1], cible);
        if (m0 && m2 && mois > 0) h += '<p>Doubler votre versement mensuel (' + fF(mois * 2) + ') ramènerait la durée de ' + duree(m0) + ' à <b>' + duree(m2) + '</b> dans l’hypothèse prudente. Ce que vous mettez de côté pèse plus que le rendement, surtout au début.</p>';
        else if (!mois) h += '<p>Sans versement mensuel, tout repose sur le rendement. Indiquez une somme mise de côté chaque mois pour voir la différence.</p>';
        h += '</div>';
      }
      h += lecon('Ce que cela aide à décider', ['<b>Un patrimoine se bâtit par couches</b> : une réserve, la fin des dettes chères, puis des biens qui rapportent ou prennent de la valeur.', '<b>Le levier le plus sûr est le versement mensuel</b> : vous le décidez, contrairement au rendement.', '<b>Refaites le point tous les trois mois</b> : EFA garde vos relevés et vous montre la courbe.'], [['mon-vrai-reste.html', 'Trouver ce que je peux mettre de côté'], ['ma-brvm.html#mensuel', 'Investir chaque mois'], ['liberte-financiere.html', 'Ma liberté financière']]);
      out.innerHTML = h + garde(K); compte('patrimoine');
      if (defiler === true) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (S.act) calc();
  };

  /* ============ 6. CETTE PROMESSE EST-ELLE CRÉDIBLE ? ============ */
  OUTILS.promesse = function () {
    var K = 'efa_promesse_v1', S = lire(K) || {};
    var F = [['garanti', 'Le gain est présenté comme garanti ou « sans risque ».', 2], ['urgence', 'On me presse de décider vite : places limitées, offre qui se termine.', 2], ['recruter', 'On me demande de faire entrer d’autres personnes, ou on me paie pour cela.', 3], ['origine', 'Personne ne m’explique clairement d’où vient l’argent des gains.', 2],
      ['agrement', 'Je n’ai pas pu vérifier un agrément auprès du régulateur (AMF-UMOA, BCEAO, ministère).', 2], ['retrait', 'Récupérer mon argent est compliqué, payant, ou impossible avant une date.', 2], ['particulier', 'Je dois payer sur le compte ou le mobile money d’un particulier, ou en cryptomonnaie.', 2]];
    $('pr-f').innerHTML = F.map(function (f) { return '<label class="ot-coche"><input type="checkbox" id="pr-' + f[0] + '"' + (S.f && S.f[f[0]] ? ' checked' : '') + '><span>' + f[1] + '</span></label>'; }).join('');
    if (S.taux) $('pr-taux').value = String(S.taux).replace('.', ','); if (S.per) $('pr-per').value = S.per; milliers($('pr-montant')); if (S.montant) $('pr-montant').value = f0(S.montant);
    $('pr-form').addEventListener('submit', function (e) { e.preventDefault(); calc(true); });
    function calc(defiler) {
      var taux = num($('pr-taux').value), per = $('pr-per').value, M = num($('pr-montant').value) || 100000, out = $('pr-res'), rep = {}, pts = 0, n = { jour: 365, semaine: 52, mois: 12, an: 1 }[per];
      F.forEach(function (f) { rep[f[0]] = $('pr-' + f[0]).checked; if (rep[f[0]]) pts += f[2]; });
      if (!taux && !pts) { out.innerHTML = '<p class="ot-vide">Indiquez le gain promis, ou cochez les signaux que vous avez remarqués.</p>'; return; }
      var an = taux ? (Math.pow(1 + taux / 100, n) - 1) * 100 : 0, simple = taux * n, fin = M * (1 + an / 100);
      S = { taux: taux, per: per, montant: M, f: rep, d: auj() }; ecrire(K, S);
      var niv = an > 100 || pts >= 5 || rep.recruter ? 'r' : an > 20 || pts >= 2 ? 'o' : 'v';
      var grand = function (x) { return x > 1e15 ? 'un nombre à plus de 15 chiffres' : fF(x); };
      var h = '<p class="ot-message">' + (niv === 'r' ? '<b>Cette promesse n’est pas crédible.</b> Tout indique qu’il faut s’en tenir éloigné.' : niv === 'o' ? '<b>Prudence.</b> Cette promesse dépasse ce qu’un placement sérieux peut offrir sans risque important.' : '<b>Rien d’anormal dans ce que vous avez saisi.</b> Cela ne remplace pas la vérification de l’agrément et du contrat.') + '</p>';
      if (taux) h += '<div class="ot-trois">' + carte('Promis', String(taux).replace('.', ',') + ' % par ' + per, 'Ce qu’on vous annonce.', 'ot-t1') +
        carte('Sur un an', an > 100000 ? 'plus de 100 000 %' : pc(an, an < 100 ? 1 : 0), per === 'an' ? 'C’est le taux annoncé.' : 'en replaçant les gains à chaque ' + per + ' (' + pc(simple) + ' sans les replacer).', an > 20 ? 'ot-t3' : 'ot-t2') +
        carte(fF(M) + ' deviendraient', grand(fin), 'en un an, si la promesse était tenue.', an > 100 ? 'ot-t3' : 'ot-t5') + '</div>' +
        '<div class="ot-bloc"><h3>Pour comparer</h3><div class="ot-barres">' + barre('Dépôt à terme, emprunt d’État', 6 / Math.max(an, 30) * 100, 'environ 5 à 7 % par an') + barre('Bourse (BRVM) depuis 2023', 25 / Math.max(an, 30) * 100, 'environ 25 % par an, avec des baisses', 'ot-i-b') + barre('Ce qu’on vous promet', 100 * an / Math.max(an, 30), an > 100000 ? 'plus de 100 000 % par an' : pc(an) + ' par an', an > 25 ? 'ot-i-r' : '') + '</div>' +
        '<p class="ot-note">La Bourse (BRVM) vient de vivre quatre années exceptionnelles, et aucune n’était garantie. Un gain supérieur, régulier et sans risque n’existe pas : quand il est payé, c’est avec l’argent des nouveaux entrants.</p></div>';
      var coches = F.filter(function (f) { return rep[f[0]]; });
      if (coches.length) h += '<div class="ot-bloc ot-t3"><h3>' + coches.length + (coches.length > 1 ? ' signaux' : ' signal') + ' d’alerte</h3><ul class="ot-liste">' + coches.map(function (f) { return '<li>' + f[1] + '</li>'; }).join('') + '</ul>' + (rep.recruter ? '<p><b>Être payé pour recruter est la marque d’un système pyramidal</b> : les gains des premiers viennent des versements des suivants, jusqu’à l’arrêt.</p>' : '') + '</div>';
      h += '<div class="ot-bloc ot-t6"><h3>Trois questions à poser avant de confier un franc</h3><ol class="ot-ordre"><li>Quel est votre numéro d’agrément, et auprès de quelle autorité puis-je le vérifier ?</li><li>D’où vient précisément l’argent qui me sera versé ?</li><li>Comment, en combien de temps et à quel coût puis-je récupérer mon argent ?</li></ol><p class="ot-note">Un acteur sérieux répond par écrit et ne vous presse jamais.</p></div>';
      h += lecon('Ce que cela aide à décider', ['<b>Plus le gain promis est élevé, plus le risque l’est.</b> « Élevé et garanti » ensemble, c’est le signal le plus sûr d’une arnaque.', '<b>Vérifiez l’agrément vous-même</b>, sur le site du régulateur, pas sur un document qu’on vous montre.', '<b>Ne décidez jamais le jour même.</b> Parlez-en à quelqu’un qui n’a rien à y gagner.'], [['arnaques.html', 'Avant de confier mon argent'], ['atelier-rendement-garanti.html', 'Rendement garanti : que vérifier ?'], ['investir.html', 'Les vrais placements']]);
      out.innerHTML = h + garde(K); compte('promesse');
      if (defiler === true) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (S.taux || S.f) calc();
  };

  /* ============ 7. MON JOURNAL DE DÉCISIONS ============ */
  OUTILS.journal = function () {
    var K = 'efa_journal_v1', S = lire(K) || { l: [] };
    milliers($('jo-montant')); var d = new Date(); d.setDate(d.getDate() + 90); $('jo-revue').value = d.toISOString().slice(0, 10); $('jo-revue').min = auj();
    $('jo-form').addEventListener('submit', function (e) {
      e.preventDefault(); var t = $('jo-quoi').value.trim();
      if (!t) { $('jo-err').hidden = false; $('jo-quoi').focus(); return; } $('jo-err').hidden = true;
      S.l.unshift({ id: Date.now(), d: auj(), quoi: t, cat: $('jo-cat').value, montant: num($('jo-montant').value), pourquoi: $('jo-pourquoi').value.trim(), attendu: $('jo-attendu').value.trim(), revue: $('jo-revue').value });
      ecrire(K, S); $('jo-quoi').value = $('jo-pourquoi').value = $('jo-attendu').value = $('jo-montant').value = ''; rendre(); $('jo-res').scrollIntoView({ behavior: 'smooth', block: 'start' }); compte('journal');
    });
    function rendre() {
      var out = $('jo-res'), L = S.l, a = auj();
      if (!L.length) { out.innerHTML = '<div class="ot-bloc ot-t1"><h3>Votre journal est vide</h3><p>Notez ici votre prochaine décision d’argent, même petite : un achat important, un prêt, un placement, un refus. EFA vous la représentera à la date de revue pour voir ce qui s’est vraiment passé.</p></div>'; return; }
      var dues = L.filter(function (x) { return !x.res && x.revue && x.revue <= a; }), revues = L.filter(function (x) { return x.res; }), bonnes = revues.filter(function (x) { return x.verdict === 'bonne'; }).length;
      var h = '<div class="ot-trois">' + carte('Décisions notées', L.length, 'depuis le ' + dateFr(L[L.length - 1].d) + '.', 'ot-t1') + carte('À revoir maintenant', dues.length, dues.length ? 'La date de revue est arrivée.' : 'Rien à revoir pour l’instant.', dues.length ? 'ot-t3' : 'ot-t5') + carte('Revues', revues.length, revues.length ? bonnes + ' que vous referiez à l’identique.' : 'La revue est ce qui fait progresser.', 'ot-t2') + '</div>';
      h += L.map(function (x) {
        var due = !x.res && x.revue && x.revue <= a;
        return '<article class="ot-bloc ot-entree' + (due ? ' ot-t3' : x.res ? ' ot-t2' : '') + '"><p class="ot-k">' + esc(x.cat) + ' · ' + dateFr(x.d) + (x.montant ? ' · ' + fF(x.montant) : '') + '</p><h3>' + esc(x.quoi) + '</h3>' +
          (x.pourquoi ? '<p><b>Pourquoi :</b> ' + esc(x.pourquoi) + '</p>' : '') + (x.attendu ? '<p><b>Ce que j’en attends :</b> ' + esc(x.attendu) + '</p>' : '') +
          (x.res ? '<p><b>Ce qui s’est passé</b> (' + dateFr(x.dres) + ') : ' + esc(x.res) + '</p><p class="ot-verdict">' + (x.verdict === 'bonne' ? 'Je la referais à l’identique.' : x.verdict === 'autrement' ? 'Je la referais autrement.' : 'Je ne la referais pas.') + '</p>'
            : (due ? '<div class="ot-revue"><label><span>Qu’est-il arrivé ?</span><textarea rows="2" data-res="' + x.id + '" placeholder="Ce qui s’est vraiment passé"></textarea></label><p class="ot-boutons"><button type="button" class="ot-b" data-verdict="bonne" data-id="' + x.id + '">Je la referais</button><button type="button" class="ot-b ot-b2" data-verdict="autrement" data-id="' + x.id + '">Autrement</button><button type="button" class="ot-b ot-b2" data-verdict="non" data-id="' + x.id + '">Je ne la referais pas</button></p></div>'
              : '<p class="ot-note">À revoir le ' + dateFr(x.revue) + '. <button type="button" class="ot-lien" data-tot="' + x.id + '">Revoir maintenant</button></p>')) +
          '<p class="ot-note"><button type="button" class="ot-lien" data-suppr="' + x.id + '">Retirer</button></p></article>';
      }).join('');
      out.innerHTML = h + garde(K);
    }
    $('jo-res').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.verdict) { var id = +b.dataset.id, t = $('jo-res').querySelector('[data-res="' + id + '"]'); S.l.forEach(function (x) { if (x.id === id) { x.res = (t && t.value.trim()) || 'Revue faite.'; x.verdict = b.dataset.verdict; x.dres = auj(); } }); ecrire(K, S); rendre(); }
      else if (b.dataset.tot) { S.l.forEach(function (x) { if (x.id === +b.dataset.tot) x.revue = auj(); }); ecrire(K, S); rendre(); }
      else if (b.dataset.suppr) { S.l = S.l.filter(function (x) { return x.id !== +b.dataset.suppr; }); ecrire(K, S); rendre(); }
    });
    rendre();
  };

  /* ============ 8. MON ANNÉE EFA ============ */
  OUTILS.annee = function () {
    var out = $('an-res'), an = String(new Date().getFullYear()), h = '', vide = true;
    function dans(S) { return ((S && S.hist) || []).filter(function (x) { return x.m.slice(0, 4) === an; }); }
    function evol(t, L, k, lien, bon) {
      if (!L.length) return '';
      vide = false; var a = L[0][k], b = L[L.length - 1][k], d = b - a, mieux = bon > 0 ? d >= 0 : d <= 0;
      return '<div class="ot-bloc ' + (L.length > 1 ? (mieux ? 'ot-t2' : 'ot-t3') : 'ot-t1') + '"><h3>' + t + '</h3><p class="ot-v">' + (b < 0 ? '−' : '') + fF(Math.abs(b)) + '</p>' +
        (L.length > 1 ? '<p>' + (d >= 0 ? '+' : '−') + fF(Math.abs(d)) + ' depuis ' + MOIS[+L[0].m.slice(5) - 1] + ' (' + L.length + ' relevés).</p><div class="ot-courbe">' + L.map(function (x) { var mx = Math.max.apply(null, L.map(function (y) { return Math.abs(y[k]); })) || 1; return '<i title="' + x.m + '" style="height:' + Math.max(6, Math.abs(x[k]) / mx * 100).toFixed(0) + '%"></i>'; }).join('') + '</div>' : '<p>Premier relevé en ' + MOIS[+L[0].m.slice(5) - 1] + '. Refaites le calcul le mois prochain pour voir le chemin.</p>') +
        '<p class="ot-note"><a href="' + lien + '">Mettre à jour</a></p></div>';
    }
    var RE = lire('efa_reste_v1'), DE = lire('efa_dettes_v1'), PA = lire('efa_patrimoine_v1'), JO = lire('efa_journal_v1');
    var blocs = evol('Mon vrai reste', dans(RE), 'reste', 'mon-vrai-reste.html', 1) + evol('Mes dettes', dans(DE), 'total', 'mes-dettes.html', -1) + evol('Mon patrimoine', dans(PA), 'net', 'mon-patrimoine.html', 1);
    var J = ((JO && JO.l) || []).filter(function (x) { return x.d.slice(0, 4) === an; }), rev = J.filter(function (x) { return x.res; });
    if (J.length) { vide = false; blocs += '<div class="ot-bloc ot-t4"><h3>Mes décisions</h3><p class="ot-v">' + J.length + '</p><p>' + rev.length + ' revue' + (rev.length > 1 ? 's' : '') + ', dont ' + rev.filter(function (x) { return x.verdict === 'bonne'; }).length + ' que vous referiez à l’identique.</p><ul class="ot-liste">' + J.slice(0, 4).map(function (x) { return '<li>' + esc(x.quoi) + '</li>'; }).join('') + '</ul><p class="ot-note"><a href="journal-decisions.html">Ouvrir mon journal</a></p></div>'; }
    var AUTRES = [['efa_oepma_v2', 'Voir clair · où est passé mon argent ?', 'ou-est-passe-mon-argent.html'], ['efa_diag_resume', 'Mon diagnostic financier', 'diagnostic.html'], ['efa_budget_v1', 'Mon budget en FCFA', 'construire-son-budget.html'], ['efa_gen_v2', 'Déclic · mon projet', 'generateur-de-projet.html'], ['efa_bp_v1', 'Mon business plan', 'mon-business-plan-tient-il.html'], ['efa-ma-brvm-portefeuille', 'Ma BRVM · mon portefeuille', 'ma-brvm.html#portefeuille'], ['efa_idee_v1', 'Mon idée vaut-elle un test ?', 'mon-idee-test.html'], ['efa_aider_v1', 'Puis-je aider ce mois-ci ?', 'puis-je-aider.html'], ['efa_promesse_v1', 'Cette promesse est-elle crédible ?', 'promesse-credible.html'], ['efa_retraite_v1', 'Préparer ma retraite', 'preparer-ma-retraite.html'], ['efa_terrain_v1', 'Acheter un terrain', 'acheter-un-terrain.html']];
    var faits = AUTRES.filter(function (a) { var v = null; try { v = localStorage.getItem(a[0]); } catch (e) {} return v && v !== '[]' && v !== 'null'; });
    if (faits.length) vide = false;
    if (vide) {
      out.innerHTML = '<div class="ot-bloc ot-t1"><h3>Votre année commence ici</h3><p>Cette page se remplit toute seule à mesure que vous utilisez les outils d’EFA sur ce téléphone. Vous y verrez, mois après mois : ce qui vous reste, ce que vous devez, ce que vous possédez, et les décisions que vous avez prises.</p><p class="ot-boutons"><a class="ot-b" href="mon-vrai-reste.html">Commencer par mon vrai reste</a><a class="ot-b ot-b2" href="mon-patrimoine.html">Mon patrimoine</a><a class="ot-b ot-b2" href="journal-decisions.html">Mon journal</a></p></div>'; return;
    }
    h = '<p class="ot-message">Votre année ' + an + ' avec EFA : <b>' + (dans(RE).length + dans(DE).length + dans(PA).length) + ' relevé' + (dans(RE).length + dans(DE).length + dans(PA).length > 1 ? 's' : '') + '</b>, ' + J.length + ' décision' + (J.length > 1 ? 's' : '') + ' notée' + (J.length > 1 ? 's' : '') + ', ' + faits.length + ' outil' + (faits.length > 1 ? 's' : '') + ' utilisé' + (faits.length > 1 ? 's' : '') + '.</p><div class="ot-deux">' + blocs + '</div>';
    if (faits.length) h += '<div class="ot-bloc"><h3>Les outils que j’ai utilisés</h3><div class="ot-puces">' + faits.map(function (a) { return '<a href="' + a[2] + '">' + a[1] + '</a>'; }).join('') + '</div></div>';
    var manque = [[RE, 'mon-vrai-reste.html', 'Calculer mon vrai reste'], [PA, 'mon-patrimoine.html', 'Faire le point sur mon patrimoine'], [JO && JO.l && JO.l.length, 'journal-decisions.html', 'Noter une première décision']].filter(function (x) { return !x[0]; });
    if (manque.length) h += '<div class="ot-bloc ot-t6"><h3>Pour compléter votre année</h3><p class="ot-boutons">' + manque.map(function (x, i) { return '<a class="ot-b' + (i ? ' ot-b2' : '') + '" href="' + x[1] + '">' + x[2] + '</a>'; }).join('') + '</p></div>';
    out.innerHTML = h + '<p class="ot-garde">Cette page lit ce qui est gardé sur ce téléphone. Rien n’est envoyé à EFA. Pour retrouver vos ateliers et vos fiches : <a href="mon-efa.html">Mon EFA</a>.</p>'; compte('annee');
  };

  if (typeof document !== 'undefined') document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-effacer]'); if (!b) return;
    if (b.dataset.sur !== '1') { b.dataset.sur = '1'; b.textContent = 'Confirmer : tout effacer'; return; }
    oter(b.dataset.effacer); location.reload();
  });
  function go() { var r = document.querySelector('[data-outil-efa]'); if (r && OUTILS[r.dataset.outilEfa]) OUTILS[r.dataset.outilEfa](); }
  if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go(); }
  if (typeof window !== 'undefined') window.EFA_OUTILS = { simuler: simuler };
})();
