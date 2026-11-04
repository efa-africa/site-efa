/* EFA · Pages Investir : les listes d'ateliers et d'outils au gabarit des ateliers (coaching.html), deux à la fois */
(function () {
  var U = window.EFA_UNIV, D = window.EFA_ATELIERS; if (!U) return;
  var L = D ? D.liste : [], ENR = (D && D.ENR) || {};
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nrm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function trouve(x) {
    var t = nrm(x[3]);
    for (var i = 0; i < L.length; i++) {
      var a = L[i], at = nrm(a.t);
      if ((x[0] && (a.lien === x[0])) || at === t || at.indexOf(t) === 0 || t.indexOf(at) === 0) return a;
    }
    return null;
  }
  function cr(n) { return n + ' crédit' + (n > 1 ? 's' : ''); }
  function carte(x, k) {
    var a = trouve(x), bientot = !x[0] && !(a && a.lien), n = (k < 9 ? '0' : '') + (k + 1), h, img, lab, dur, titre, pb, fin = '', plus = '', st, cta, gratuit;
    if (a) {
      var E = ENR[a.id] || [''];
      img = E[1] || a.img; lab = E[0] || x[2]; titre = a.t; pb = a.pour; gratuit = !!a.gratuit;
      dur = a.cours ? 'Cours · 5 étapes, 31 exercices' : a.c ? 'Avec Élysée Johnson · réponse personnelle' : 'Vidéo · exercice · fiche';
      fin = '<div class="ae-fin"><strong>À la fin</strong>' + esc(a.rep) + '</div>';
      if (a.c && !a.cours) plus = '<p class="ae-plus"><b>En plus :</b> une question ou un cas que vous envoyez par écrit, auquel Élysée Johnson répond personnellement sous 72 h, et votre fiche validée par Élysée Johnson. <i class="ae-plaf">20 cas par mois au plus.</i></p>';
      h = a.lien || ('coaching.html#' + (a.alias || ('atelier-' + a.id)));
      st = (a.cours && !bientot) ? 'Offert avec vos 3 crédits' : a.gratuit ? 'Gratuit' : cr(D.cout(a));
      cta = bientot ? 'Réserver ma place' : 'Découvrir ' + (a.cours ? 'le cours' : 'l’atelier');
      if (a.cours) gratuit = true;
    } else {
      var outil = x[2] !== 'Atelier' && x[2] !== 'Cours';
      img = x[1]; lab = x[2]; titre = x[3]; pb = x[4]; gratuit = x[5] !== 'prix';
      dur = outil ? x[2] + ' · gratuit' : 'Vidéo · exercice · fiche';
      h = x[0] || 'coaching.html';
      st = gratuit ? 'Gratuit' : cr(Math.ceil(x[6] / 10000));
      cta = bientot ? 'Voir les ateliers' : outil ? 'Commencer' : 'Découvrir l’atelier';
    }
    return '<li class="ae-it" data-pg="' + Math.floor(k / 2) + '"' + (k > 1 ? ' hidden' : '') + '><a class="ae-c' + (bientot ? ' ae-bt' : '') + '" href="' + esc(h) + '">' +
      '<span class="ae-vis"><img src="clone/assets/' + esc(img) + '" alt="" loading="lazy" decoding="async"><span class="ae-dur">' + esc(dur) + '</span></span>' +
      '<span class="ae-corps"><span class="ae-meta"><span>' + n + ' / ' + esc(lab) + '</span>' + (gratuit && !bientot ? '<span class="ae-free">' + (a && a.cours ? 'Offert avec vos 3 crédits' : 'Gratuit') + '</span>' : '') + '</span>' +
      '<span class="ae-t">' + esc(titre) + '</span><span class="ae-pb">' + esc(pb) + '</span>' + fin + plus +
      '<span class="ae-pied"><span class="ae-st"><span class="ae-etat' + (bientot ? ' venir' : '') + '">' + (bientot ? 'À venir' : 'Disponible') + '</span>' + esc(st) + '</span><span class="at-c-btn ae-cta">' + esc(cta) + ' <span aria-hidden="true">→</span></span></span></span></a></li>';
  }
  [].forEach.call(document.querySelectorAll('.iv-grille[data-l]'), function (g) {
    var X = U[g.dataset.l] || []; g.classList.add('ae-grille'); g.setAttribute('data-garde', '');
    g.innerHTML = X.map(carte).join('');
    if (X.length > 2) {
      var np = Math.ceil(X.length / 2), b = document.createElement('button'); b.type = 'button'; b.className = 'ae-autre'; b.dataset.p = '0';
      var mot = g.dataset.l === 'g' ? 'contenus' : 'ateliers';
      b.textContent = 'Voir deux autres ' + mot + ' →';
      b.onclick = function () { var pg = (+b.dataset.p + 1) % np; b.dataset.p = pg; g.querySelectorAll('.ae-it').forEach(function (x) { x.hidden = +x.dataset.pg !== pg; }); b.textContent = pg === np - 1 ? 'Revenir au début →' : 'Voir deux autres ' + mot + ' →'; try { g.parentNode.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} };
      g.parentNode.insertBefore(b, g.nextSibling);
    }
  });
})();
