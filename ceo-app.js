/* EFA CEO Challenge · interface (tout reste sur cet appareil) */
(function () {
  "use strict";
  var K = window.EFA_CEO_COURS, CS = window.EFA_CEO_CAS, CLE = "efa-ceo-1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function suivi(n) { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "ceo-" + n, event: true }); } catch (e) {} }
  var D = (function () { try { return JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) { return null; } })() || { cours: {}, cas: {} };
  D.cours = D.cours || {}; D.cas = D.cas || {};
  function sauver() { try { localStorage.setItem(CLE, JSON.stringify(D)); } catch (e) {} }
  var vue = $("#tr-vue"), chrono = null;
  function fmt(n, d) { return Number(n).toLocaleString("fr-FR", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).replace(/ | /g, " "); }
  function haut() { window.scrollTo({ top: Math.max(0, $("#tr").getBoundingClientRect().top + window.scrollY - 84) }); }
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>', CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  var RUB = ["decouvrir", "cours", "cas", "decisions", "glossaire"];
  function route() {
    if (chrono) { clearInterval(chrono); chrono = null; }
    var h = (location.hash || "").replace("#", "") || "decouvrir", sub = null;
    var m = /^(cours|cas)-([a-z0-9]+)$/.exec(h); if (m) { h = m[1]; sub = m[2]; }
    if (RUB.indexOf(h) < 0) h = "decouvrir";
    $$(".tr-rub a").forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + h ? "page" : "false"); });
    if (h === "cours") sub ? vChapitre(sub) : vCours();
    else if (h === "cas") sub ? vCas(sub) : vListeCas();
    else ({ decouvrir: vDecouvrir, decisions: vDecisions, glossaire: vGlossaire })[h]();
    if (sub) haut();
    vue.focus({ preventScroll: true });
  }

  /* ================= Découvrir ================= */
  function vDecouvrir() {
    var mins = K.CHAPITRES.reduce(function (a, c) { return a + parseInt(c.duree, 10); }, 0);
    var h = '<section class="tr-bloc tr-intro"><div><p class="surtitre">Le cabinet de stratégie</p><h2>Un dirigeant a un problème. Vous avez vingt-cinq minutes.</h2>' +
      '<p class="lead">Des études de cas comme en entretien de cabinet de conseil, ancrées en Afrique de l’Ouest et du Centre : un opérateur de mobile money qui perd de l’argent, une brasserie qui hésite à entrer au Cameroun, une cimenterie face aux importations. Vous structurez, vous calculez, vous recommandez.</p>' +
      '<div class="tr-cta"><a class="bouton bouton-principal" href="#cas-money">Premier cas : Kalao Money</a><a class="bouton bouton-clair" href="#cours">La méthode</a></div>' +
      '<p class="tr-avert">Entreprises fictives, pays réels, chiffres d’exercice : ce sont des hypothèses, pas des statistiques. Pour les étudiants en stratégie, en école de commerce ou d’ingénieurs, et pour préparer un entretien.</p></div>' +
      '<ol class="tr-5q"><li>Clarifier la question</li><li>Structurer le problème</li><li>Calculer, de tête</li><li>Recommander, réponse d’abord</li><li>Relire sa décision plus tard</li></ol></section>';
    h += '<section class="tr-bloc"><div class="tr-sh"><div><p class="surtitre">Les cas</p><h2>Six entreprises, six décisions</h2></div><p class="lead">Chaque cas suit le même déroulé qu’un entretien : votre structure d’abord, comparée à une structure modèle, puis les pièces à lire, les calculs, et votre recommandation.</p></div><div class="cf-parts">' +
      CS.CAS.map(function (c) { return '<a class="cf-part" href="#cas-' + c.id + '"><span class="etiquette">' + esc(c.type) + "</span><b>" + esc(c.titre) + "</b><small>" + esc(c.secteur) + " · " + c.duree + "</small></a>"; }).join("") + "</div></section>";
    h += '<section class="tr-bloc"><div class="tr-sh"><div><p class="surtitre">La méthode</p><h2>Trois parties, onze chapitres</h2></div><p class="lead">Environ ' + Math.round(mins / 6) / 10 + ' h de cours, avec des exercices corrigés et trois outils interactifs.</p></div><div class="cf-parts">' +
      K.PARTIES.map(function (p) { var chs = K.CHAPITRES.filter(function (c) { return c.partie === p.id; }); return '<a class="cf-part" href="#cours"><span class="tr-chap-n">' + p.id + "</span><b>" + esc(p.titre) + "</b><small>" + chs.map(function (c) { return esc(c.titre); }).join(" · ") + "</small></a>"; }).join("") + "</div></section>";
    h += '<section class="tr-bloc" id="tr-classe"><div class="tr-ent"><div><p class="surtitre">Pour les enseignants</p><h2>Utiliser en cours</h2></div><button class="lien-souligne" type="button" id="tr-pp">Imprimer le programme</button></div>' +
      '<p class="lead">Un format qui marche bien : les étudiants préparent le cas en binôme (un consultant, un recruteur qui lit les pièces), puis comparent leurs recommandations en groupe. Chaque cas se termine par une grille : structure, calcul, synthèse.</p><div class="tr-table gauche"><table><thead><tr><th>Ch.</th><th>Chapitre</th><th>Durée</th><th>Compétences</th><th>Cas lié</th></tr></thead><tbody>' +
      K.CHAPITRES.map(function (c, i) { var cas = c.pratique && c.pratique.lien ? CS.CAS.filter(function (x) { return "cas:" + x.id === c.pratique.lien; })[0] : null; return "<tr><td>" + (i + 1) + '</td><td><a href="#cours-' + c.id + '">' + esc(c.titre) + "</a></td><td>" + c.duree + "</td><td>" + c.objectifs.map(esc).join("<br>") + "</td><td>" + (cas ? esc(cas.titre) : "Tous les cas") + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<p class="tr-note">Organisations et écoles : <a href="organisations.html?src=ceo">composer un programme pour un groupe</a>. Pour la partie financière (VAN, BFR, valorisation), voir <a href="corporate.html">EFA Corporate Finance</a>.</p></section>';
    vue.innerHTML = h;
    $("#tr-pp").onclick = function () { document.body.classList.add("imp-classe"); window.print(); setTimeout(function () { document.body.classList.remove("imp-classe"); }, 500); };
  }

  /* ================= La méthode (cours) ================= */
  function progCh(id) { return D.cours[id] || (D.cours[id] = { rep: {} }); }
  function etatCh(c) { var p = D.cours[c.id]; if (!p) return { s: "", n: 0, j: 0 }; var n = Object.keys(p.rep || {}).length, j = Object.keys(p.rep || {}).filter(function (k) { return p.rep[k].juste; }).length; return { s: n >= c.exos.length ? "fait" : p.lu ? "cours" : "", n: n, j: j }; }
  function vCours() {
    var faits = K.CHAPITRES.filter(function (c) { return etatCh(c).s === "fait"; }).length, suite = K.CHAPITRES.filter(function (c) { return etatCh(c).s !== "fait"; })[0];
    var h = '<section class="tr-bloc"><div class="tr-ph"><div class="tr-ph-t"><p class="surtitre">La méthode</p><h2>Résoudre une étude de cas</h2><p class="lead">La démarche des entretiens de cabinets de conseil, avec des exemples d’ici : structurer, estimer, calculer de tête, recommander.</p></div>' +
      '<div class="tr-suite"><p class="etiquette">Votre progression</p><p class="tr-suite-n"><b>' + faits + "</b> / " + K.CHAPITRES.length + ' chapitres</p><div class="tr-barre" aria-hidden="true"><i style="width:' + (faits / K.CHAPITRES.length * 100) + '%"></i></div>' +
      (suite ? '<a class="bouton bouton-principal" href="#cours-' + suite.id + '">' + (faits ? "Continuer" : "Commencer") + " : chapitre " + (K.CHAPITRES.indexOf(suite) + 1) + "</a>" : '<a class="bouton bouton-principal" href="#cas">Passer aux cas</a>') + '</div></div><div class="tr-chaps">';
    K.PARTIES.forEach(function (pa) {
      h += '<section class="tr-chap"><header><span class="tr-chap-n">' + pa.id + "</span><div><h3>" + esc(pa.titre) + "</h3><p>" + esc(pa.sous) + '</p></div></header><ol class="tr-liste">';
      K.CHAPITRES.filter(function (c) { return c.partie === pa.id; }).forEach(function (c) {
        var e = etatCh(c);
        h += '<li><a class="tr-ligne ' + (e.s === "fait" ? "fait" : e.s === "cours" ? "cours" : suite === c ? "suivant" : "") + '" href="#cours-' + c.id + '"><span class="tr-pt">' + (e.s === "fait" ? CHECK : K.CHAPITRES.indexOf(c) + 1) + '</span><span class="tr-lt"><b>' + esc(c.titre) + "</b><small>" + esc(c.objectifs[0]) + '</small></span><span class="tr-lm">' + (e.s === "fait" ? '<span class="pastille ' + (e.j >= Math.ceil(c.exos.length * .7) ? "ok" : "moyen") + '">' + e.j + "/" + c.exos.length + "</span>" : '<span class="tr-duree">' + c.duree + "</span>") + '</span><span class="tr-chev">' + CHEV + "</span></a></li>";
      });
      h += "</ol></section>";
    });
    vue.innerHTML = h + "</div></section>";
  }
  function vChapitre(id) {
    var c = K.CHAPITRES.filter(function (x) { return x.id === id; })[0]; if (!c) return vCours();
    var p = progCh(c.id); p.lu = true; sauver();
    var i = K.CHAPITRES.indexOf(c), prev = K.CHAPITRES[i - 1], next = K.CHAPITRES[i + 1], pa = K.PARTIES.filter(function (x) { return x.id === c.partie; })[0];
    var h = '<article class="tr-chapitre"><p class="tr-fil"><a href="#cours">La méthode</a> · Partie ' + pa.id + " · " + esc(pa.titre) + '</p><p class="etiquette">Chapitre ' + (i + 1) + " sur " + K.CHAPITRES.length + " · " + c.duree + "</p><h2>" + esc(c.titre) + "</h2>" +
      '<div class="tr-obj"><p class="etiquette">À la fin du chapitre, vous saurez</p><ul>' + c.objectifs.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul></div>";
    c.sections.forEach(function (s) {
      h += '<section class="tr-sec"><h3>' + esc(s.t) + "</h3>" + (s.p || []).map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") + (s.liste ? "<ul>" + s.liste.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") + (s.f ? '<p class="tr-f">' + esc(s.f) + "</p>" : "") + (s.ex ? '<p class="tr-ex"><b>Exemple.</b> ' + esc(s.ex) + "</p>" : "") + "</section>";
    });
    if (c.outil) h += '<section class="tr-outil" id="tr-outil"></section>';
    h += '<div class="tr-ret"><p class="etiquette">À retenir</p><ul>' + c.retenir.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div><section class="tr-exos"><h3>Exercices</h3><p class="tr-note">La correction s’affiche après votre réponse. Le dernier exercice est un cas différent.</p>' + c.exos.map(function (e, k) { return '<div class="tr-exo" data-k="' + k + '"></div>'; }).join("") + "</section>";
    if (c.pratique) h += '<div class="tr-prat"><div><p class="etiquette">En pratique</p><p>' + esc(c.pratique.texte) + "</p></div>" + (c.pratique.lien ? '<a class="bouton bouton-sombre" href="#cas-' + c.pratique.lien.slice(4) + '">Ouvrir le cas</a>' : '<a class="bouton bouton-sombre" href="#cas">Voir les cas</a>') + "</div>";
    h += '<nav class="tr-chnav">' + (prev ? '<a class="bouton bouton-clair" href="#cours-' + prev.id + '">← ' + esc(prev.titre) + "</a>" : '<a class="bouton bouton-clair" href="#cours">← La méthode</a>') + '<button class="lien-souligne" id="tr-print" type="button">Imprimer ce chapitre</button>' + (next ? '<a class="bouton bouton-principal" href="#cours-' + next.id + '">' + esc(next.titre) + " →</a>" : '<a class="bouton bouton-principal" href="#cas">Passer aux cas</a>') + "</nav>" +
      '<p class="tr-note">Contenu pédagogique réalisé avec l’aide de l’intelligence artificielle et vérifié par l’équipe EFA. Entreprises et chiffres fictifs.</p></article>';
    vue.innerHTML = h;
    $$(".tr-exo", vue).forEach(function (z) { exo(c, +z.dataset.k, z); });
    $("#tr-print").onclick = function () { window.print(); };
    if (c.outil) outil(c.outil, $("#tr-outil"));
  }
  function verif(e, raw) {
    var v = +raw, rep = e.rep(), juste = Math.abs(v - rep) <= (e.tol || 0) + 1e-9;
    if (juste) return { juste: true, msg: "Bonne réponse." };
    var pg = (e.pieges || []).filter(function (x) { return Math.abs(v - x.v) <= (x.tol != null ? x.tol : Math.max(.01, Math.abs(x.v) * .002)); })[0];
    return { juste: false, msg: pg ? pg.msg : "Reprenez le calcul pas à pas, en écrivant les unités, puis comparez avec la correction." };
  }
  function lire(v) { return String(v).replace(/\s/g, "").replace(",", ".").replace("−", "-"); }
  function exo(c, k, z) {
    var e = c.exos[k], p = progCh(c.id), r = p.rep[k];
    var h = '<p class="etiquette">' + (e.transfert ? "Transfert · un autre cas" : "Exercice " + (k + 1)) + '</p><p class="tr-qq">' + esc(e.q) + "</p>";
    if (e.type === "qcm") h += '<div class="tr-choix">' + e.choix.map(function (x, i) { return '<button type="button" class="choix' + (r ? (i === e.bonne ? " juste" : i === r.v ? " faux" : "") : "") + '" data-i="' + i + '"' + (r ? " disabled" : "") + ">" + esc(x) + "</button>"; }).join("") + "</div>";
    else h += '<form class="tr-num"><input inputmode="decimal" autocomplete="off" aria-label="Votre réponse"' + (r ? ' value="' + esc(r.v) + '" disabled' : "") + "><span>" + esc(e.unite || "") + "</span>" + (r ? "" : '<button class="bouton bouton-sombre">Valider</button>') + "</form>";
    if (r) h += '<div class="tr-corr ' + (r.juste ? "ok" : "ko") + '"><b>' + (r.juste ? "Juste." : "Pas tout à fait.") + "</b> " + esc(r.msg) + (e.type === "nombre" ? '<br><span class="tr-cs">' + esc(e.corr) + "</span>" : "") + '</div><button type="button" class="lien-souligne tr-re">Refaire cet exercice</button>';
    z.innerHTML = h;
    $$(".choix", z).forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; p.rep[k] = { v: i, juste: i === e.bonne, msg: e.fb[i] }; sauver(); suivi("cours-" + c.id + "-" + k); exo(c, k, z); }; });
    var f = $("form", z);
    if (f && !r) f.onsubmit = function (ev) { ev.preventDefault(); var raw = lire($("input", f).value); if (raw === "" || isNaN(+raw)) return $("input", f).focus(); var o = verif(e, raw); p.rep[k] = { v: $("input", f).value, juste: o.juste, msg: o.msg }; sauver(); suivi("cours-" + c.id + "-" + k); exo(c, k, z); };
    var re = $(".tr-re", z); if (re) re.onclick = function () { delete p.rep[k]; sauver(); exo(c, k, z); };
  }

  /* Outils des chapitres */
  function curseur(id, lab, min, max, pas, v, suff) { return '<label class="tr-cur"><span>' + lab + ' <b id="' + id + '-v"></b>' + (suff || "") + '</span><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + pas + '" value="' + v + '"></label>'; }
  function courbe(pts, o) {
    var W = 520, H = 200, pl = 56, pr = 12, pt = 12, pb = 28, xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys.concat(o.zero ? [0] : [])), y1 = Math.max.apply(null, ys.concat(o.zero ? [0] : [])), m = (y1 - y0) * .08 || 1; y0 -= m; y1 += m;
    var X = function (x) { return pl + (W - pl - pr) * (x - x0) / (x1 - x0); }, Y = function (y) { return pt + (H - pt - pb) * (1 - (y - y0) / (y1 - y0)); };
    var g = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(o.titre) + '">';
    [0, .5, 1].forEach(function (f) { var y = y0 + (y1 - y0) * f; g += '<line class="gr" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(y) + '" y2="' + Y(y) + '"/><text class="ax" x="' + (pl - 6) + '" y="' + (Y(y) + 4) + '" text-anchor="end">' + fmt(y, o.dy || 0) + "</text>"; });
    if (o.zero && y0 < 0 && y1 > 0) g += '<line class="z" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(0) + '" y2="' + Y(0) + '"/>';
    g += '<path class="l0" d="' + pts.map(function (p, j) { return (j ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join("") + '"/>';
    if (o.pt) g += '<circle class="pt" cx="' + X(o.pt[0]) + '" cy="' + Y(o.pt[1]) + '" r="5"/>';
    return g + '<text class="ax" x="' + pl + '" y="' + (H - 8) + '">' + esc(o.gx) + '</text><text class="ax" x="' + (W - pr) + '" y="' + (H - 8) + '" text-anchor="end">' + esc(o.dx) + "</text></svg>";
  }
  function sortie(l, v) { return "<div><span>" + l + "</span><b>" + v + "</b></div>"; }
  function signe(v, d, u) { return '<span class="' + (v >= 0 ? "hausse" : "baisse") + '">' + (v >= 0 ? "+" : "−") + fmt(Math.abs(v), d) + (u ? " " + u : "") + "</span>"; }
  function outil(type, z) {
    var lier = function (f) { $$("input", z).forEach(function (x) { x.oninput = f; }); f(); };
    if (type === "profit") {
      z.innerHTML = '<p class="etiquette">Outil · l’arbre du profit</p><div class="tr-curs">' + curseur("p-v", "Volume", .5, 5, .1, 2, " million(s) d’unités") + curseur("p-p", "Prix", 300, 800, 5, 500, " FCFA") + curseur("p-c", "Coût variable", 100, 600, 5, 350, " FCFA") + curseur("p-f", "Coûts fixes", 0, 600, 10, 200, " M FCFA") + '</div><div class="tr-out" id="p-o"></div><div class="ceo-arbre" id="p-a"></div>';
      lier(function () {
        var V = +$("#p-v").value, P = +$("#p-p").value, C = +$("#p-c").value, F = +$("#p-f").value, ca = V * P, cv = V * C, pr = ca - cv - F;
        $("#p-v-v").textContent = fmt(V, 1); $("#p-p-v").textContent = fmt(P); $("#p-c-v").textContent = fmt(C); $("#p-f-v").textContent = fmt(F);
        $("#p-o").innerHTML = sortie("Chiffre d’affaires", fmt(ca) + " M") + sortie("Marge sur coûts variables", fmt(ca - cv) + " M") + sortie("Profit", signe(pr, 0, "M")) + sortie("Point mort", P > C ? fmt(F / (P - C), 2) + " M d’unités" : "jamais");
        $("#p-a").innerHTML = '<div class="ceo-n racine">Profit<b>' + fmt(pr) + ' M</b></div><div class="ceo-br"><div class="ceo-n">Chiffre d’affaires<b>' + fmt(ca) + ' M</b><small>Volume × Prix</small></div><div class="ceo-n">Coûts<b>' + fmt(cv + F) + ' M</b><small>Variables ' + fmt(cv) + " + fixes " + fmt(F) + "</small></div></div>";
      });
      z.insertAdjacentHTML("beforeend", '<p class="tr-leg">Baissez le prix de 5 % : la marge unitaire perd 25 FCFA, et le profit se divise par deux. C’est pour cela qu’on regarde toujours le prix en premier.</p>');
    }
    if (type === "sizing") {
      z.innerHTML = '<p class="etiquette">Outil · estimer un marché, de haut en bas</p><div class="tr-curs">' + curseur("s-p", "Population", .5, 10, .1, 6, " million(s)") + curseur("s-m", "Personnes par ménage", 3, 8, .5, 5, "") + curseur("s-a", "Ménages acheteurs", 5, 100, 5, 40, " %") + curseur("s-q", "Unités par ménage et par jour", .5, 5, .5, 2, "") + curseur("s-x", "Prix unitaire", 50, 500, 10, 150, " FCFA") + '</div><div class="ceo-ent" id="s-e"></div><div class="tr-out" id="s-o"></div>';
      lier(function () {
        var P = +$("#s-p").value, m = +$("#s-m").value, a = +$("#s-a").value, q = +$("#s-q").value, x = +$("#s-x").value, men = P * 1e6 / m, ach = men * a / 100, u = ach * q;
        $("#s-p-v").textContent = fmt(P, 1); $("#s-m-v").textContent = fmt(m, 1); $("#s-a-v").textContent = fmt(a); $("#s-q-v").textContent = fmt(q, 1); $("#s-x-v").textContent = fmt(x);
        var et = [["Habitants", P * 1e6], ["Ménages", men], ["Ménages acheteurs", ach], ["Unités par jour", u]], mx = et[0][1];
        $("#s-e").innerHTML = et.map(function (r) { return '<div class="ceo-et"><span>' + r[0] + '</span><i style="width:' + Math.max(2, r[1] / mx * 100) + '%"></i><b>' + fmt(r[1]) + "</b></div>"; }).join("");
        $("#s-o").innerHTML = sortie("Valeur par jour", fmt(u * x / 1e6, 1) + " M FCFA") + sortie("Valeur par an (360 jours)", fmt(u * x * 360 / 1e9, 1) + " Md FCFA") + sortie("Par habitant et par an", fmt(u * x * 360 / (P * 1e6)) + " FCFA");
      });
      z.insertAdjacentHTML("beforeend", '<p class="tr-leg">Le dernier chiffre sert de contrôle : une dépense annuelle par habitant invraisemblable signale une hypothèse fausse.</p>');
    }
    if (type === "elasticite") {
      z.innerHTML = '<p class="etiquette">Outil · élasticité et profit</p><div class="tr-curs">' + curseur("e-p", "Prix actuel", 500, 2000, 50, 1000, " FCFA") + curseur("e-c", "Coût variable", 200, 1500, 50, 700, " FCFA") + curseur("e-e", "Élasticité-prix", -4, -.2, .1, -1.5, "") + curseur("e-d", "Variation de prix", -30, 30, 1, -10, " %") + '</div><div class="tr-out" id="e-o"></div><div class="tr-gr" id="e-g"></div>';
      lier(function () {
        var P = +$("#e-p").value, C = +$("#e-c").value, E = +$("#e-e").value, d = +$("#e-d").value, V = 100000;
        $("#e-p-v").textContent = fmt(P); $("#e-c-v").textContent = fmt(C); $("#e-e-v").textContent = fmt(E, 1); $("#e-d-v").textContent = (d > 0 ? "+" : "") + d;
        function pf(dd) { var v = Math.max(0, V * (1 + E * dd / 100)); return v * (P * (1 + dd / 100) - C) / 1e6; }
        var v1 = Math.max(0, V * (1 + E * d / 100)), p0 = pf(0), p1 = pf(d);
        $("#e-o").innerHTML = sortie("Volume", fmt(V) + " → " + fmt(v1)) + sortie("Chiffre d’affaires", fmt(V * P / 1e6, 1) + " → " + fmt(v1 * P * (1 + d / 100) / 1e6, 1) + " M") + sortie("Profit sur coûts variables", fmt(p0, 1) + " → " + fmt(p1, 1) + " M") + sortie("Écart de profit", signe(p1 - p0, 1, "M"));
        var pts = []; for (var x = -30; x <= 30; x++) pts.push([x, pf(x)]);
        $("#e-g").innerHTML = courbe(pts, { titre: "Profit selon la variation de prix", pt: [d, p1], zero: true, gx: "Prix −30 %", dx: "Prix +30 %", dy: 0 }) + '<p class="tr-leg">Profit sur coûts variables (M FCFA) selon la variation de prix, pour 100 000 unités vendues au départ. Le sommet de la courbe est le prix qui maximise le profit, si l’élasticité est juste.</p>';
      });
    }
  }

  /* ================= Cas ================= */
  function etatCas(c) { var s = D.cas[c.id]; if (!s) return ""; if (s.decision) return "fait"; return "cours"; }
  function vListeCas() {
    var h = '<section class="tr-bloc"><div class="tr-sh"><div><p class="surtitre">Les cas</p><h2>Prenez la place du consultant</h2></div><p class="lead">Chaque cas suit le déroulé d’un entretien : votre structure, les pièces, les calculs, puis votre recommandation, que vous défendez avec un chiffre. Il n’y a pas une seule bonne réponse, mais des raisonnements plus ou moins solides.</p></div><div class="tr-scs">';
    CS.CAS.forEach(function (c) {
      var e = etatCas(c);
      h += '<article class="tr-sc"><div class="tr-sc-h"><span>' + esc(c.type) + "</span><span>" + c.duree + '</span></div><div class="tr-sc-b"><p class="etiquette">' + esc(c.secteur) + "</p><h3>" + esc(c.titre) + "</h3><p>" + esc(c.situation) + '</p><p class="tr-comp"><span>Chapitres utiles</span>' + c.chapitres.map(function (id) { var ch = K.CHAPITRES.filter(function (x) { return x.id === id; })[0]; return ch ? esc(ch.titre) : ""; }).join(" · ") + '</p><div class="tr-sc-a"><a class="tr-sc-cta" href="#cas-' + c.id + '">' + (e === "fait" ? "Revoir ma recommandation" : e === "cours" ? "Reprendre" : "Commencer le cas") + " " + CHEV + "</a>" + (e === "fait" ? '<span class="pastille ok">Recommandé</span>' : "") + "</div></div></article>";
    });
    vue.innerHTML = h + "</div></section>";
  }
  function sCas(c) { var s = D.cas[c.id]; if (!s) { s = D.cas[c.id] = { x: {}, etape: 0, rep: {} }; c.entrees.forEach(function (e) { s.x[e.id] = e.v; }); } return s; }
  function formatSortie(v, f, u) {
    if (v == null) return f === "d1" && u === "ans" ? "non récupéré" : "—";
    u = u ? " " + u : "";
    if (f === "d1" && u === " ans" && v === 0) return "immédiat";
    if (f === "n") return fmt(v) + u;
    if (f === "d1") return fmt(v, 1) + u;
    if (f === "d2") return fmt(v, 2) + u;
    if (f === "s0") return signe(v, 0, u.trim());
    if (f === "s1") return signe(v, 1, u.trim());
    return esc(v);
  }
  function piece(p) {
    return '<div class="ceo-piece"><p class="etiquette">' + esc(p.titre) + "</p>" + (p.lignes ? '<div class="ceo-tab"><table>' + (p.entete ? "<thead><tr>" + p.entete.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("") + "</tr></thead>" : "") + "<tbody>" + p.lignes.map(function (l) { return "<tr>" + l.map(function (x) { return "<td>" + esc(x) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>" : "") + (p.note ? '<p class="ceo-note">' + esc(p.note) + "</p>" : "") + "</div>";
  }
  function vCas(id) {
    var c = CS.CAS.filter(function (x) { return x.id === id; })[0]; if (!c) return vListeCas();
    var s = sCas(c); sauver();
    var h = '<article class="cf-cas"><p class="tr-fil"><a href="#cas">Les cas</a> · ' + esc(c.type) + " · " + esc(c.secteur) + '</p><div class="ceo-tete"><h2 class="titre-section">' + esc(c.titre) + '</h2><button type="button" class="ceo-chrono" id="ceo-ch" aria-live="off">Chrono 25 min</button></div><p class="cf-role"><b>' + esc(c.role) + "</b> " + esc(c.situation) + "</p>" +
      '<div class="cf-grille"><div class="cf-g"><div class="ceo-pieces">' + c.pieces.map(piece).join("") + "</div>" +
      '<div class="tr-outil"><p class="etiquette">Vos hypothèses · faites-les varier</p><div class="tr-curs">' + c.entrees.map(function (e) {
        return e.bool ? '<label class="ceo-case"><input type="checkbox" id="x-' + e.id + '"' + (s.x[e.id] ? " checked" : "") + "><span>" + esc(e.lab) + "</span></label>" : curseur("x-" + e.id, e.lab, e.min, e.max, e.pas, s.x[e.id], " " + e.u);
      }).join("") + '</div><div class="tr-out" id="cf-out"></div></div></div>' +
      '<aside class="cf-d"><div class="carte cf-guide" id="cf-guide"></div></aside></div></article>';
    vue.innerHTML = h;
    c.entrees.forEach(function (e) { var el = $("#x-" + e.id); el.oninput = el.onchange = function () { s.x[e.id] = e.bool ? (el.checked ? 1 : 0) : +el.value; maj(); }; });
    var bch = $("#ceo-ch"); bch.onclick = function () {
      if (chrono) { clearInterval(chrono); chrono = null; bch.textContent = "Chrono 25 min"; bch.classList.remove("on"); return; }
      var t0 = Date.now(); bch.classList.add("on");
      var tic = function () { var r = 1500 - Math.floor((Date.now() - t0) / 1000), a = Math.abs(r); bch.textContent = (r < 0 ? "Dépassé de " : "Reste ") + Math.floor(a / 60) + " min " + ("0" + a % 60).slice(-2); bch.classList.toggle("fin", r < 0); };
      tic(); chrono = setInterval(tic, 1000); suivi("chrono-" + c.id);
    };
    function maj() {
      c.entrees.forEach(function (e) { if (!e.bool) $("#x-" + e.id + "-v").textContent = fmt(s.x[e.id], e.pas < 1 ? (e.pas < .1 ? 2 : (String(e.pas).split(".")[1] || "").length) : 0); });
      var o = c.calc(s.x);
      $("#cf-out").innerHTML = c.sorties.map(function (r) { return sortie(r[1], formatSortie(o[r[0]], r[2], r[3])); }).join("");
      var et = c.etapes[s.etape];
      if (!$("#cf-guide").innerHTML || (et && et.t === "action")) guide(c, s, o);
      sauver();
    }
    maj();
  }
  function grille(c, s) {
    var tx = [], cal = 0, nc = 0;
    c.etapes.forEach(function (e, i) { var r = s.rep[i]; if (!r) return; if (e.t === "texte") tx.push(r.auto); if (e.t === "nombre" || e.t === "qcm") { nc++; if (r.juste) cal++; } });
    var st = tx.length ? tx[0] : null, d = s.decision, chiffre = /\d/.test(d.texte), long = d.texte.length >= 60;
    var lig = function (t, ok, txt) { return '<div class="ceo-gl"><span class="ceo-gi ' + ok + '" aria-hidden="true"></span><b>' + t + "</b><small>" + txt + "</small></div>"; };
    return '<div class="ceo-grille"><p class="etiquette">Votre grille</p>' +
      lig("Structure", st === 0 ? "ok" : st === 1 ? "moyen" : "ko", st === 0 ? "Votre structure couvrait l’essentiel." : st === 1 ? "Votre structure couvrait une partie des branches." : st === 2 ? "Votre structure est à retravailler : relisez le chapitre sur les arbres MECE." : "Non évaluée.") +
      lig("Calcul", nc && cal / nc >= .8 ? "ok" : nc && cal / nc >= .5 ? "moyen" : "ko", cal + " réponse(s) juste(s) sur " + nc + " au premier essai.") +
      lig("Synthèse", chiffre && long ? "ok" : chiffre || long ? "moyen" : "ko", (chiffre ? "Appuyée sur un chiffre" : "Sans chiffre : ajoutez celui qui fonde la décision") + (long ? ", avec une raison développée." : ", trop courte pour convaincre un dirigeant.")) + "</div>";
  }
  function guide(c, s, o) {
    var z = $("#cf-guide"), n = c.etapes.length, i = s.etape, h = '<p class="etiquette">' + (i < n ? "Étape " + (i + 1) + " sur " + n : "Votre recommandation") + '</p><div class="tr-prog"><i style="width:' + Math.min(i, n) / n * 100 + '%"></i></div>';
    if (i < n) {
      var e = c.etapes[i], r = s.rep[i];
      if (e.t === "info") h += "<p>" + esc(e.texte) + '</p><button class="bouton bouton-sombre" id="g-ok">Compris</button>';
      if (e.t === "texte") {
        h += '<p class="tr-qq">' + esc(e.q) + "</p>";
        if (!r || r.auto == null) h += '<label class="cf-lab">Votre structure<textarea id="g-t" rows="6" maxlength="1200" placeholder="1. …&#10;2. …&#10;3. …"' + (r ? " disabled" : "") + ">" + esc(r ? r.texte : s.brouillon || "") + "</textarea></label>" + (r ? "" : '<p class="tr-err" id="g-err" role="alert"></p><button class="bouton bouton-sombre" id="g-tv">Comparer avec la structure modèle</button>');
        if (r) {
          h += '<div class="ceo-modele"><p class="etiquette">Structure modèle</p><ul>' + e.modele.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
          if (r.auto == null) h += '<p class="tr-qq">Votre structure couvrait-elle ces branches ?</p><div class="tr-choix"><button type="button" class="choix" data-a="0">Oui, l’essentiel</button><button type="button" class="choix" data-a="1">En partie</button><button type="button" class="choix" data-a="2">Non</button></div>';
          else h += '<p class="cf-dec"><b>Votre structure :</b></p><p class="ceo-vtx">' + esc(r.texte) + '</p><p class="tr-note">Auto-évaluation : ' + ["l’essentiel y était", "en partie", "à retravailler"][r.auto] + '.</p><button class="bouton bouton-sombre" id="g-ok">Continuer</button>';
        }
      }
      if (e.t === "action") { var fait = e.test(s.x, o); h += '<p class="tr-act"><b>À faire :</b> ' + esc(e.consigne) + "</p>" + (fait ? '<p class="hausse">✓ Fait.</p><button class="bouton bouton-sombre" id="g-ok">Continuer</button>' : '<p class="tr-vide">Utilisez les curseurs.</p>'); }
      if (e.t === "nombre") { h += '<p class="tr-qq">' + esc(e.q) + '</p><form class="tr-num" id="g-f"><input inputmode="decimal" autocomplete="off" aria-label="Votre réponse"' + (r ? ' value="' + esc(r.v) + '" disabled' : "") + "><span>" + esc(e.unite || "") + "</span>" + (r ? "" : '<button class="bouton bouton-sombre">Valider</button>') + "</form>"; }
      if (e.t === "qcm") h += '<p class="tr-qq">' + esc(e.q) + '</p><div class="tr-choix">' + e.choix.map(function (x, k) { return '<button type="button" class="choix' + (r ? (k === e.bonne ? " juste" : k === r.v ? " faux" : "") : "") + '" data-k="' + k + '"' + (r ? " disabled" : "") + ">" + esc(x) + "</button>"; }).join("") + "</div>";
      if (r && (e.t === "nombre" || e.t === "qcm")) h += '<div class="tr-corr ' + (r.juste ? "ok" : "ko") + '"><b>' + (r.juste ? "Juste." : "Pas tout à fait.") + "</b> " + esc(r.msg) + (e.corr ? '<br><span class="tr-cs">' + esc(e.corr) + "</span>" : "") + '</div><button class="bouton bouton-sombre" id="g-ok">Continuer</button>';
    } else {
      var d = s.decision;
      h += '<p class="tr-qq">' + esc(c.decision.q) + "</p>";
      if (!d) h += '<div class="tr-choix">' + c.decision.choix.map(function (x, k) { return '<button type="button" class="choix" data-d="' + k + '" aria-pressed="' + (s.dchoix === k) + '">' + esc(x.t) + "</button>"; }).join("") + '</div><label class="cf-lab">Votre phrase de synthèse : la réponse d’abord, puis la raison chiffrée<textarea id="g-j" rows="4" maxlength="600" placeholder="Je recommande de…, parce que…">' + esc(s.djust || "") + '</textarea></label><p class="tr-err" id="g-err" role="alert"></p><button class="bouton bouton-principal" id="g-dec">Enregistrer ma recommandation</button>';
      else h += '<p class="cf-dec"><b>Vous avez recommandé :</b> ' + esc(c.decision.choix[d.i].t) + '</p><p class="cf-dec"><b>Votre synthèse :</b> « ' + esc(d.texte) + ' »</p><div class="tr-corr"><b>Retour.</b> ' + esc(c.decision.choix[d.i].retour) + "</div>" + grille(c, s) + '<div class="tr-cta"><a class="bouton bouton-sombre" href="#decisions">Mes recommandations</a><a class="lien-souligne" href="#cas">Autre cas</a><button class="lien-souligne" id="g-raz" type="button">Refaire le cas</button></div>';
    }
    z.innerHTML = h;
    var ok = $("#g-ok", z); if (ok) ok.onclick = function () { s.etape++; sauver(); guide(c, s, c.calc(s.x)); };
    var gt = $("#g-t", z); if (gt && !gt.disabled) gt.oninput = function () { s.brouillon = gt.value; sauver(); };
    var tv = $("#g-tv", z); if (tv) tv.onclick = function () { var t = (gt.value || "").trim(); if (t.length < 15) { $("#g-err").textContent = "Écrivez d’abord votre structure, même courte : c’est l’exercice."; return; } s.rep[i] = { texte: t, auto: null }; delete s.brouillon; sauver(); suivi("structure-" + c.id); guide(c, s, o); };
    $$(".choix[data-a]", z).forEach(function (b) { b.onclick = function () { s.rep[i].auto = +b.dataset.a; s.rep[i].juste = +b.dataset.a === 0; sauver(); guide(c, s, o); }; });
    $$(".choix[data-k]", z).forEach(function (b) { b.onclick = function () { var e = c.etapes[i], k = +b.dataset.k; s.rep[i] = { v: k, juste: k === e.bonne, msg: e.fb[k] }; sauver(); guide(c, s, o); }; });
    var f = $("#g-f", z); if (f) f.onsubmit = function (ev) { ev.preventDefault(); var raw = lire($("input", f).value); if (raw === "" || isNaN(+raw)) return; var r = verif(c.etapes[i], raw); s.rep[i] = { v: $("input", f).value, juste: r.juste, msg: r.msg }; sauver(); guide(c, s, o); };
    $$(".choix[data-d]", z).forEach(function (b) { b.onclick = function () { s.dchoix = +b.dataset.d; $$(".choix[data-d]", z).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); }; });
    var j = $("#g-j", z); if (j) j.oninput = function () { s.djust = j.value; sauver(); };
    var dec = $("#g-dec", z); if (dec) dec.onclick = function () {
      if (s.dchoix == null) { $("#g-err").textContent = "Choisissez une recommandation."; return; }
      if (!(s.djust || "").trim()) { $("#g-err").textContent = "Écrivez votre synthèse : c’est elle que l’on juge, pas le choix seul."; return; }
      s.decision = { i: s.dchoix, texte: s.djust.trim(), le: Date.now(), x: JSON.parse(JSON.stringify(s.x)) }; sauver(); suivi("decision-" + c.id); guide(c, s, o);
    };
    var raz = $("#g-raz", z); if (raz) raz.onclick = function () { if (!confirm("Refaire ce cas ? Votre recommandation actuelle sera effacée.")) return; delete D.cas[c.id]; sauver(); vCas(c.id); };
  }

  /* ================= Mes recommandations ================= */
  function vDecisions() {
    var L = CS.CAS.filter(function (c) { return D.cas[c.id] && D.cas[c.id].decision; });
    var h = '<section class="tr-bloc"><p class="surtitre">Mes recommandations</p><h2>Ce que j’ai recommandé, et pourquoi</h2><p class="lead">Votre synthèse reste telle que vous l’avez écrite. Ce que vous comprenez après s’ajoute à côté : c’est ainsi qu’on progresse d’un entretien à l’autre.</p>';
    if (!L.length) h += '<p class="tr-vide">Aucune recommandation pour l’instant.</p><a class="bouton bouton-principal" href="#cas">Choisir un cas</a>';
    L.forEach(function (c) {
      var s = D.cas[c.id], d = s.decision;
      h += '<article class="carte tr-dec"><p class="etiquette">' + esc(c.entreprise) + " · " + new Date(d.le).toLocaleDateString("fr-FR") + '</p><h3 class="titre-tuile">' + esc(c.titre) + '</h3><p class="tr-avant"><b>Recommandation :</b> ' + esc(c.decision.choix[d.i].t) + '</p><p class="tr-avant"><b>Ma synthèse :</b> « ' + esc(d.texte) + ' »</p><p class="tr-note">' + esc(c.decision.choix[d.i].retour) + "</p>" +
        (d.apres ? '<p class="tr-apres"><b>Ce que je comprends après :</b> ' + esc(d.apres) + "</p>" : '<form class="tr-refl" data-id="' + c.id + '"><label>Ce que je comprends après<textarea rows="2" maxlength="400"></textarea></label><button class="bouton bouton-sombre">Ajouter</button></form>') + "</article>";
    });
    vue.innerHTML = h + "</section>";
    $$(".tr-refl", vue).forEach(function (f) { f.onsubmit = function (e) { e.preventDefault(); var t = $("textarea", f).value.trim(); if (!t) return; D.cas[f.dataset.id].decision.apres = t; sauver(); vDecisions(); }; });
  }

  /* ================= Glossaire ================= */
  var GLO = [["Étude de cas", "Exercice d'entretien où l'on résout un problème d'entreprise à voix haute, en 20 à 30 minutes."], ["Clarifier", "Reformuler la question et demander l'objectif, l'horizon et le critère de succès avant d'analyser."],
    ["Arbre de problème", "Découpage d'une question en branches, puis en sous-branches mesurables."], ["MECE", "Mutuellement exclusif, collectivement exhaustif : pas de doublon, pas d'oubli."], ["Hypothèse", "La piste que l'on teste en premier, annoncée avec sa raison ; les données la confirment ou l'écartent."],
    ["Principe de la pyramide", "Présenter la réponse d'abord, puis les raisons, puis les détails."], ["Synthèse", "Recommandation, deux ou trois raisons chiffrées, risques, prochaine étape."],
    ["Marge sur coûts variables", "Chiffre d'affaires moins coûts variables ; elle doit couvrir les coûts fixes."], ["Coûts fixes", "Coûts qui ne varient pas avec le volume à court terme : loyers, personnel, réseau."], ["Point mort", "Volume à partir duquel la marge couvre les coûts fixes."],
    ["Mix", "Répartition des ventes entre produits ou clients ; un changement de mix modifie le prix moyen."], ["Estimation descendante", "Partir de la population et appliquer des proportions successives."], ["Estimation ascendante", "Partir d'une unité (un point de vente, un véhicule) et multiplier."],
    ["Part de marché", "Nos ventes ÷ ventes totales du marché."], ["Barrière à l'entrée", "Ce qui rend l'entrée coûteuse : réseau de distribution, marque, échelle, règles."], ["Création (greenfield)", "Entrer en construisant ses propres installations."],
    ["Licence", "Accord par lequel un partenaire produit ou vend sous votre marque contre une redevance."], ["Coentreprise", "Société créée et détenue à plusieurs, pour partager risques et savoir-faire."], ["Délai de récupération", "Temps nécessaire pour que les profits remboursent l'investissement."],
    ["Élasticité-prix", "Variation du volume en % pour 1 % de variation du prix."], ["Guerre des prix", "Baisses de prix successives entre concurrents, qui réduisent la marge de tous."], ["Différenciation", "Offrir ce que le concurrent n'offre pas : qualité, service, délai, crédit."],
    ["Segmentation", "Traiter différemment des groupes de clients aux besoins différents."], ["Synergies", "Gains attendus d'un rapprochement : économies de coûts, revenus supplémentaires."], ["Complément de prix (earn-out)", "Partie du prix versée plus tard, si des objectifs sont atteints."],
    ["Intégration", "Mise en commun des équipes, des systèmes et des clients après un rachat."], ["Chaîne de valeur", "Suite des étapes qui mènent du produit brut au client."], ["Goulot d'étranglement", "L'étape la plus lente, qui fixe le rythme de toute la chaîne."],
    ["Gain rapide", "Action peu coûteuse et rapide, à lancer en premier."], ["UEMOA", "Union économique et monétaire ouest-africaine : huit pays, franc CFA XOF, banque centrale BCEAO."], ["CEMAC", "Communauté économique et monétaire de l'Afrique centrale : six pays, franc CFA XAF, banque centrale BEAC."],
    ["OHADA", "Organisation pour l'harmonisation en Afrique du droit des affaires : un droit commercial commun à dix-sept pays."], ["Économie informelle", "Activités qui échappent aux registres et aux statistiques officielles."], ["Agent (mobile money)", "Commerçant qui fait les dépôts et retraits d'argent mobile, payé à la commission."]];
  function vGlossaire() {
    vue.innerHTML = '<section class="tr-bloc"><p class="surtitre">Glossaire</p><h2>Les mots de la stratégie</h2><label class="tr-sel">Chercher un mot<input id="tr-gq" type="search" autocomplete="off"></label><dl class="tr-glo" id="tr-gl"></dl></section>';
    function f() { var q = $("#tr-gq").value.trim().toLowerCase(); $("#tr-gl").innerHTML = GLO.filter(function (g) { return !q || (g[0] + " " + g[1]).toLowerCase().indexOf(q) >= 0; }).map(function (g) { return "<dt>" + esc(g[0]) + "</dt><dd>" + esc(g[1]) + "</dd>"; }).join("") || '<dd class="tr-vide">Aucun mot trouvé.</dd>'; }
    $("#tr-gq").oninput = f; f();
  }

  window.addEventListener("hashchange", route);
  route();
  window.EFA_CEO_UI = { D: D };
})();
