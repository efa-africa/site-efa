/* EFA Corporate Finance · interface (tout reste sur cet appareil) */
(function () {
  "use strict";
  var K = window.EFA_CF_COURS, CS = window.EFA_CF_CAS, CLE = "efa-corporate-1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function suivi(n) { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "corporate-" + n, event: true }); } catch (e) {} }
  var D = (function () { try { return JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) { return null; } })() || { cours: {}, cas: {} };
  D.cours = D.cours || {}; D.cas = D.cas || {};
  function sauver() { try { localStorage.setItem(CLE, JSON.stringify(D)); } catch (e) {} }
  var vue = $("#tr-vue");
  function fmt(n, d) { return Number(n).toLocaleString("fr-FR", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).replace(/ | /g, " "); }
  function haut() { window.scrollTo({ top: Math.max(0, $("#tr").getBoundingClientRect().top + window.scrollY - 84) }); }

  var RUB = ["decouvrir", "cours", "cas", "decisions", "glossaire"];
  function route() {
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
    var h = '<section class="tr-bloc tr-intro"><div><p class="surtitre">Le laboratoire de l’entreprise</p><h2>Lire une entreprise, décider d’investir, choisir un financement.</h2>' +
      '<p class="lead">Un cours de niveau licence en finance d’entreprise, puis des cas où vous prenez la décision : prêter, investir, s’endetter, accepter une commande, racheter une société. Les chiffres réagissent à chacune de vos hypothèses.</p>' +
      '<div class="tr-cta"><a class="bouton bouton-principal" href="#cas-pret">Premier cas : prêter à Ciments Bakar</a><a class="bouton bouton-clair" href="#cours">Le cours</a></div>' +
      '<p class="tr-avert">Entreprises et montants fictifs, comptes présentés selon la logique du SYSCOHADA révisé, impôt fictif de 25 %. Éducation financière, pas conseil en investissement.</p></div>' +
      '<ol class="tr-5q"><li>Que disent les comptes&nbsp;?</li><li>Ce projet crée-t-il de la valeur&nbsp;?</li><li>Comment le financer&nbsp;?</li><li>Que vaut l’entreprise&nbsp;?</li><li>Qu’ai-je décidé, et pourquoi&nbsp;?</li></ol></section>';
    h += '<section class="tr-bloc"><div class="tr-sh"><div><p class="surtitre">Le programme</p><h2>Quatre parties, quatorze chapitres</h2></div><p class="lead">Environ ' + Math.round(mins / 6) / 10 + ' h de cours et ' + CS.CAS.length + ' cas pratiques d’environ 15 à 20 minutes.</p></div><div class="cf-parts">' +
      K.PARTIES.map(function (p) { var chs = K.CHAPITRES.filter(function (c) { return c.partie === p.id; }); return '<a class="cf-part" href="#cours"><span class="tr-chap-n">' + p.id + "</span><b>" + esc(p.titre) + "</b><small>" + chs.map(function (c) { return esc(c.titre); }).join(" · ") + "</small></a>"; }).join("") + "</div></section>";
    h += '<section class="tr-bloc" id="tr-classe"><div class="tr-ent"><div><p class="surtitre">Pour les enseignants</p><h2>Utiliser en cours</h2></div><button class="lien-souligne" type="button" id="tr-pp">Imprimer le programme</button></div>' +
      '<p class="lead">Chaque chapitre se termine par un cas de transfert et renvoie à un cas pratique. Les étudiants gardent leur progression sur leur appareil ; le suivi de groupe arrivera avec les comptes.</p><div class="tr-table gauche"><table><thead><tr><th>Ch.</th><th>Chapitre</th><th>Durée</th><th>Compétences</th><th>Cas pratique</th></tr></thead><tbody>' +
      K.CHAPITRES.map(function (c, i) { var cas = c.pratique && c.pratique.lien ? CS.CAS.filter(function (x) { return "cas:" + x.id === c.pratique.lien; })[0] : null; return "<tr><td>" + (i + 1) + '</td><td><a href="#cours-' + c.id + '">' + esc(c.titre) + "</a></td><td>" + c.duree + "</td><td>" + c.objectifs.map(esc).join("<br>") + "</td><td>" + (cas ? esc(cas.titre) : "Outil du chapitre") + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<p class="tr-note">Organisations et écoles : <a href="organisations.html?src=corporate">composer un programme pour un groupe</a>.</p></section>';
    vue.innerHTML = h;
    $("#tr-pp").onclick = function () { document.body.classList.add("imp-classe"); window.print(); setTimeout(function () { document.body.classList.remove("imp-classe"); }, 500); };
  }

  /* ================= Le cours ================= */
  function progCh(id) { return D.cours[id] || (D.cours[id] = { rep: {} }); }
  function etatCh(c) { var p = D.cours[c.id]; if (!p) return { s: "", n: 0, j: 0 }; var n = Object.keys(p.rep || {}).length, j = Object.keys(p.rep || {}).filter(function (k) { return p.rep[k].juste; }).length; return { s: n >= c.exos.length ? "fait" : p.lu ? "cours" : "", n: n, j: j }; }
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>', CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  function vCours() {
    var faits = K.CHAPITRES.filter(function (c) { return etatCh(c).s === "fait"; }).length, suite = K.CHAPITRES.filter(function (c) { return etatCh(c).s !== "fait"; })[0];
    var h = '<section class="tr-bloc"><div class="tr-ph"><div class="tr-ph-t"><p class="surtitre">Le cours</p><h2>La finance d’entreprise, niveau licence</h2><p class="lead">Notions, formules, exemples chiffrés en millions de FCFA, exercices corrigés, puis un cas pratique où vous décidez.</p></div>' +
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
    var h = '<article class="tr-chapitre"><p class="tr-fil"><a href="#cours">Le cours</a> · Partie ' + pa.id + " · " + esc(pa.titre) + '</p><p class="etiquette">Chapitre ' + (i + 1) + " sur " + K.CHAPITRES.length + " · " + c.duree + "</p><h2>" + esc(c.titre) + "</h2>" +
      '<div class="tr-obj"><p class="etiquette">À la fin du chapitre, vous saurez</p><ul>' + c.objectifs.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul></div>";
    c.sections.forEach(function (s) {
      h += '<section class="tr-sec"><h3>' + esc(s.t) + "</h3>" + (s.p || []).map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") + (s.liste ? "<ul>" + s.liste.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") + (s.f ? '<p class="tr-f">' + esc(s.f) + "</p>" : "") + (s.ex ? '<p class="tr-ex"><b>Exemple.</b> ' + esc(s.ex) + "</p>" : "") + "</section>";
    });
    if (c.outil) h += '<section class="tr-outil" id="tr-outil"></section>';
    h += '<div class="tr-ret"><p class="etiquette">À retenir</p><ul>' + c.retenir.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div><section class="tr-exos"><h3>Exercices</h3><p class="tr-note">La correction s’affiche après votre réponse. Le dernier exercice est un cas différent.</p>' + c.exos.map(function (e, k) { return '<div class="tr-exo" data-k="' + k + '"></div>'; }).join("") + "</section>";
    if (c.pratique) h += '<div class="tr-prat"><div><p class="etiquette">En pratique</p><p>' + esc(c.pratique.texte) + "</p></div>" + (c.pratique.lien ? '<a class="bouton bouton-sombre" href="#cas-' + c.pratique.lien.slice(4) + '">Ouvrir le cas</a>' : "") + "</div>";
    h += '<nav class="tr-chnav">' + (prev ? '<a class="bouton bouton-clair" href="#cours-' + prev.id + '">← ' + esc(prev.titre) + "</a>" : '<a class="bouton bouton-clair" href="#cours">← Le cours</a>') + '<button class="lien-souligne" id="tr-print" type="button">Imprimer ce chapitre</button>' + (next ? '<a class="bouton bouton-principal" href="#cours-' + next.id + '">' + esc(next.titre) + " →</a>" : '<a class="bouton bouton-principal" href="#cas">Passer aux cas pratiques</a>') + "</nav>" +
      '<p class="tr-note">Contenu pédagogique réalisé avec l’aide de l’intelligence artificielle et vérifié par l’équipe EFA. Entreprises et montants fictifs. Éducation financière, pas conseil.</p></article>';
    vue.innerHTML = h;
    $$(".tr-exo", vue).forEach(function (z) { exo(c, +z.dataset.k, z); });
    $("#tr-print").onclick = function () { window.print(); };
    if (c.outil) outil(c.outil, $("#tr-outil"));
  }
  function verif(e, raw) {
    var v = +raw, rep = e.rep(), juste = Math.abs(v - rep) <= (e.tol || 0) + 1e-9;
    if (juste) return { juste: true, msg: "Bonne réponse." };
    var pg = (e.pieges || []).filter(function (x) { return Math.abs(v - x.v) <= (x.tol != null ? x.tol : Math.max(.01, Math.abs(x.v) * .002)); })[0];
    return { juste: false, msg: pg ? pg.msg : "Reprenez la formule pas à pas, puis comparez avec la correction." };
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
  function outil(type, z) {
    var lier = function (f) { $$("input", z).forEach(function (x) { x.oninput = f; }); f(); };
    if (type === "annuite") {
      z.innerHTML = '<p class="etiquette">Outil · emprunt à annuités constantes</p><div class="tr-curs">' + curseur("a-c", "Capital", 10, 1000, 10, 100, " M") + curseur("a-t", "Taux", 4, 16, .5, 9, " %") + curseur("a-n", "Durée", 1, 15, 1, 5, " ans") + '</div><div class="tr-out" id="a-o"></div><div class="tr-table" id="a-tab"></div>';
      lier(function () {
        var C0 = +$("#a-c").value, t = +$("#a-t").value / 100, n = +$("#a-n").value, a = K.annuite(C0, t, n);
        $("#a-c-v").textContent = fmt(C0); $("#a-t-v").textContent = fmt(t * 100, 1); $("#a-n-v").textContent = n;
        $("#a-o").innerHTML = sortie("Annuité", fmt(a, 2) + " M") + sortie("Total remboursé", fmt(a * n, 2) + " M") + sortie("Coût des intérêts", fmt(a * n - C0, 2) + " M");
        var crd = C0, r = "<table><thead><tr><th>Année</th><th>Intérêts</th><th>Capital remboursé</th><th>Reste dû</th></tr></thead><tbody>";
        for (var k = 1; k <= n; k++) { var it = crd * t, cap = a - it; crd -= cap; r += "<tr><td>" + k + "</td><td>" + fmt(it, 2) + "</td><td>" + fmt(cap, 2) + "</td><td>" + fmt(Math.max(0, crd), 2) + "</td></tr>"; }
        $("#a-tab").innerHTML = r + "</tbody></table>";
      });
    }
    if (type === "van") {
      z.innerHTML = '<p class="etiquette">Outil · VAN et TRI d’un projet</p><div class="tr-curs">' + curseur("v-i", "Investissement", 100, 2000, 50, 1000, " M") + curseur("v-f", "Flux annuel", 50, 800, 10, 400, " M") + curseur("v-n", "Durée", 1, 10, 1, 3, " ans") + curseur("v-k", "Taux exigé", 4, 20, .5, 10, " %") + '</div><div class="tr-out" id="v-o"></div><div class="tr-gr" id="v-g"></div>';
      lier(function () {
        var I = +$("#v-i").value, F = +$("#v-f").value, n = +$("#v-n").value, k = +$("#v-k").value / 100, fl = [-I]; for (var t = 1; t <= n; t++) fl.push(F);
        $("#v-i-v").textContent = fmt(I); $("#v-f-v").textContent = fmt(F); $("#v-n-v").textContent = n; $("#v-k-v").textContent = fmt(k * 100, 1);
        var v = K.van(k, fl), tr = F * n > I ? K.tri(fl) : null;
        $("#v-o").innerHTML = sortie("VAN", '<span class="' + (v >= 0 ? "hausse" : "baisse") + '">' + (v >= 0 ? "+" : "−") + fmt(Math.abs(v)) + " M</span>") + sortie("TRI", tr == null ? "aucun" : fmt(tr * 100, 1) + " %") + sortie("Délai simple", I / F <= n ? fmt(I / F, 1) + " ans" : "non récupéré");
        var pts = []; for (var x = 0; x <= 30.001; x += 1) pts.push([x, K.van(x / 100, fl)]);
        $("#v-g").innerHTML = courbe(pts, { titre: "VAN selon le taux", pt: [k * 100, v], zero: true, gx: "Taux 0 %", dx: "Taux 30 %" }) + '<p class="tr-leg">La VAN baisse quand le taux monte. Elle coupe zéro au TRI.</p>';
      });
    }
    if (type === "levier") {
      z.innerHTML = '<p class="etiquette">Outil · effet de levier</p><div class="tr-curs">' + curseur("l-r", "Rentabilité économique (ROCE)", -4, 20, .5, 10, " %") + curseur("l-i", "Coût de la dette après impôt", 2, 12, .5, 6, " %") + curseur("l-d", "Dette ÷ capitaux propres", 0, 3, .1, 1, "") + '</div><div class="tr-out" id="l-o"></div><div class="tr-gr" id="l-g"></div>';
      lier(function () {
        var R = +$("#l-r").value, i = +$("#l-i").value, d = +$("#l-d").value;
        $("#l-r-v").textContent = fmt(R, 1); $("#l-i-v").textContent = fmt(i, 1); $("#l-d-v").textContent = fmt(d, 1);
        var roe = R + (R - i) * d;
        $("#l-o").innerHTML = sortie("ROE", '<span class="' + (roe >= R ? "hausse" : "baisse") + '">' + fmt(roe, 1) + " %</span>") + sortie("Effet du levier", (roe - R >= 0 ? "+" : "−") + fmt(Math.abs(roe - R), 1) + " point(s)") + sortie("Levier", R >= i ? "favorable" : "défavorable");
        var pts = []; for (var x = -4; x <= 20.001; x += .5) pts.push([x, x + (x - i) * d]);
        $("#l-g").innerHTML = courbe(pts, { titre: "ROE selon le ROCE", pt: [R, roe], zero: true, gx: "ROCE −4 %", dx: "ROCE 20 %", dy: 0 }) + '<p class="tr-leg">ROE (%) selon la rentabilité économique. Plus la dette est forte, plus la droite est pentue : gains et pertes amplifiés.</p>';
      });
    }
    if (type === "bfr") {
      z.innerHTML = '<p class="etiquette">Outil · BFR et trésorerie</p><div class="tr-curs">' + curseur("b-ca", "Chiffre d’affaires annuel", 1000, 30000, 500, 12000, " M") + curseur("b-dc", "Délai clients", 0, 150, 5, 90, " j") + curseur("b-ds", "Stock", 0, 120, 5, 45, " j") + curseur("b-df", "Délai fournisseurs", 0, 150, 5, 75, " j") + curseur("b-fr", "Fonds de roulement", 0, 6000, 100, 2000, " M") + '</div><div class="tr-out" id="b-o"></div>';
      lier(function () {
        var ca = +$("#b-ca").value, dc = +$("#b-dc").value, ds = +$("#b-ds").value, df = +$("#b-df").value, fr = +$("#b-fr").value, ach = ca * .55;
        ["ca", "dc", "ds", "df", "fr"].forEach(function (k) { $("#b-" + k + "-v").textContent = fmt(+$("#b-" + k).value); });
        var b = ca * dc / 360 + ach * ds / 360 - ach * df / 360, tn = fr - b;
        $("#b-o").innerHTML = sortie("BFR", fmt(b) + " M") + sortie("BFR en jours de CA", fmt(b / ca * 360) + " j") + sortie("Trésorerie nette = FR − BFR", '<span class="' + (tn >= 0 ? "hausse" : "baisse") + '">' + (tn >= 0 ? "" : "−") + fmt(Math.abs(tn)) + " M</span>");
      });
      z.insertAdjacentHTML("beforeend", '<p class="tr-leg">Achats supposés égaux à 55 % du chiffre d’affaires. Doublez le chiffre d’affaires sans toucher au fonds de roulement : la trésorerie plonge.</p>');
    }
  }

  /* ================= Cas pratiques ================= */
  function etatCas(c) { var s = D.cas[c.id]; if (!s) return ""; if (s.decision) return "fait"; return "cours"; }
  function vListeCas() {
    var h = '<section class="tr-bloc"><div class="tr-sh"><div><p class="surtitre">Cas pratiques</p><h2>Prenez la décision</h2></div><p class="lead">Chaque cas vous guide écran par écran : lire les chiffres, les faire varier, répondre, puis décider et justifier. Il n’y a pas une seule bonne décision, mais des raisonnements plus ou moins solides.</p></div><div class="tr-scs">';
    CS.CAS.forEach(function (c) {
      var e = etatCas(c);
      h += '<article class="tr-sc"><div class="tr-sc-h"><span>' + esc(c.secteur) + "</span><span>" + c.duree + '</span></div><div class="tr-sc-b"><h3>' + esc(c.titre) + "</h3><p>" + esc(c.situation) + '</p><p class="tr-comp"><span>Chapitres liés</span>' + c.chapitres.map(function (id) { var ch = K.CHAPITRES.filter(function (x) { return x.id === id; })[0]; return ch ? esc(ch.titre) : ""; }).join(" · ") + '</p><div class="tr-sc-a"><a class="tr-sc-cta" href="#cas-' + c.id + '">' + (e === "fait" ? "Revoir ma décision" : e === "cours" ? "Reprendre" : "Commencer le cas") + " " + CHEV + "</a>" + (e === "fait" ? '<span class="pastille ok">Décidé</span>' : "") + "</div></div></article>";
    });
    vue.innerHTML = h + "</div></section>";
  }
  function sCas(c) { var s = D.cas[c.id]; if (!s) { s = D.cas[c.id] = { x: {}, etape: 0, rep: {} }; c.entrees.forEach(function (e) { s.x[e.id] = e.v; }); } return s; }
  function formatSortie(v, f) {
    if (v == null) return "—";
    if (f === "M") return fmt(v) + " M";
    if (f === "Msigne") return '<span class="' + (v >= 0 ? "hausse" : "baisse") + '">' + (v >= 0 ? "+" : "−") + fmt(Math.abs(v)) + " M</span>";
    if (f === "x1") return fmt(v, 1);
    if (f === "x2") return fmt(v, 2);
    if (f === "pct") return fmt(v * 100, 1) + " %";
    if (f === "ans") return fmt(v, 1) + " ans";
    if (f === "t") return fmt(v) + " t";
    if (f === "ok") return v ? '<span class="hausse">✓ Respecté</span>' : '<span class="baisse">✗ Non respecté</span>';
    return esc(v);
  }
  function tableCompte(titre, lignes) { return '<div class="cf-cpt"><p class="etiquette">' + titre + "</p><table>" + lignes.map(function (l) { return '<tr class="' + (l[2] ? "tot" : "") + '"><td>' + esc(l[0]) + "</td><td>" + (l[1] < 0 ? "− " : "") + fmt(Math.abs(l[1])) + "</td></tr>"; }).join("") + "</table></div>"; }
  function vCas(id) {
    var c = CS.CAS.filter(function (x) { return x.id === id; })[0]; if (!c) return vListeCas();
    var s = sCas(c); sauver();
    var h = '<article class="cf-cas"><p class="tr-fil"><a href="#cas">Cas pratiques</a> · ' + esc(c.secteur) + '</p><h2 class="titre-section">' + esc(c.titre) + '</h2><p class="cf-role"><b>' + esc(c.role) + "</b> " + esc(c.situation) + "</p>" +
      '<div class="cf-grille"><div class="cf-g">' +
      (c.comptes ? '<div class="cf-comptes">' + tableCompte("Compte de résultat (M FCFA)", c.comptes.resultat) + tableCompte("Bilan · actif", c.comptes.actif) + tableCompte("Bilan · passif", c.comptes.passif) + "</div>" : "") +
      '<div class="tr-outil"><p class="etiquette">Vos hypothèses</p><div class="tr-curs">' + c.entrees.map(function (e) { return curseur("x-" + e.id, e.lab, e.min, e.max, e.pas, s.x[e.id], " " + e.u); }).join("") + '</div><div class="tr-out" id="cf-out"></div></div></div>' +
      '<aside class="cf-d"><div class="carte cf-guide" id="cf-guide"></div></aside></div></article>';
    vue.innerHTML = h;
    c.entrees.forEach(function (e) { var el = $("#x-" + e.id); el.oninput = function () { s.x[e.id] = +el.value; maj(); }; });
    function maj() {
      c.entrees.forEach(function (e) { $("#x-" + e.id + "-v").textContent = fmt(s.x[e.id], e.pas < 1 ? (e.pas < .1 ? 2 : (String(e.pas).split(".")[1] || "").length) : 0); });
      var o = c.calc(s.x);
      $("#cf-out").innerHTML = c.sorties.map(function (r) { return sortie(r[1], formatSortie(o[r[0]], r[2])); }).join("");
      var et = c.etapes[s.etape];
      if (!$("#cf-guide").innerHTML || (et && et.t === "action")) guide(c, s, o);
      sauver();
    }
    maj();
  }
  function guide(c, s, o) {
    var z = $("#cf-guide"), n = c.etapes.length, i = s.etape, h = '<p class="etiquette">' + (i < n ? "Étape " + (i + 1) + " sur " + n : "Votre décision") + '</p><div class="tr-prog"><i style="width:' + Math.min(i, n) / n * 100 + '%"></i></div>';
    if (i < n) {
      var e = c.etapes[i], r = s.rep[i];
      if (e.t === "info") h += "<p>" + esc(e.texte) + '</p><button class="bouton bouton-sombre" id="g-ok">Compris</button>';
      if (e.t === "action") { var fait = e.test(s.x, o); h += '<p class="tr-act"><b>À faire :</b> ' + esc(e.consigne) + "</p>" + (fait ? '<p class="hausse">✓ Fait.</p><button class="bouton bouton-sombre" id="g-ok">Continuer</button>' : '<p class="tr-vide">Utilisez les curseurs.</p>'); }
      if (e.t === "nombre") { h += '<p class="tr-qq">' + esc(e.q) + '</p><form class="tr-num" id="g-f"><input inputmode="decimal" autocomplete="off" aria-label="Votre réponse"' + (r ? ' value="' + esc(r.v) + '" disabled' : "") + "><span>" + esc(e.unite || "") + "</span>" + (r ? "" : '<button class="bouton bouton-sombre">Valider</button>') + "</form>"; }
      if (e.t === "qcm") h += '<p class="tr-qq">' + esc(e.q) + '</p><div class="tr-choix">' + e.choix.map(function (x, k) { return '<button type="button" class="choix' + (r ? (k === e.bonne ? " juste" : k === r.v ? " faux" : "") : "") + '" data-k="' + k + '"' + (r ? " disabled" : "") + ">" + esc(x) + "</button>"; }).join("") + "</div>";
      if (r) h += '<div class="tr-corr ' + (r.juste ? "ok" : "ko") + '"><b>' + (r.juste ? "Juste." : "Pas tout à fait.") + "</b> " + esc(r.msg) + (e.corr ? '<br><span class="tr-cs">' + esc(e.corr) + "</span>" : "") + '</div><button class="bouton bouton-sombre" id="g-ok">Continuer</button>';
    } else {
      var d = s.decision;
      h += '<p class="tr-qq">' + esc(c.decision.q) + "</p>";
      if (!d) h += '<div class="tr-choix">' + c.decision.choix.map(function (x, k) { return '<button type="button" class="choix" data-d="' + k + '" aria-pressed="' + (s.dchoix === k) + '">' + esc(x.t) + "</button>"; }).join("") + '</div><label class="cf-lab">Votre justification, avec un chiffre du cas<textarea id="g-j" rows="3" maxlength="500">' + esc(s.djust || "") + '</textarea></label><p class="tr-err" id="g-err" role="alert"></p><button class="bouton bouton-principal" id="g-dec">Enregistrer ma décision</button>';
      else h += '<p class="cf-dec"><b>Vous avez choisi :</b> ' + esc(c.decision.choix[d.i].t) + '</p><p class="cf-dec"><b>Votre raison :</b> « ' + esc(d.texte) + ' »</p><div class="tr-corr"><b>Retour.</b> ' + esc(c.decision.choix[d.i].retour) + '</div><div class="tr-cta"><a class="bouton bouton-sombre" href="#decisions">Mes décisions</a><a class="lien-souligne" href="#cas">Autre cas</a><button class="lien-souligne" id="g-raz" type="button">Refaire le cas</button></div>';
    }
    z.innerHTML = h;
    var ok = $("#g-ok", z); if (ok) ok.onclick = function () { s.etape++; sauver(); guide(c, s, c.calc(s.x)); };
    $$(".choix[data-k]", z).forEach(function (b) { b.onclick = function () { var e = c.etapes[i], k = +b.dataset.k; s.rep[i] = { v: k, juste: k === e.bonne, msg: e.fb[k] }; sauver(); guide(c, s, o); }; });
    var f = $("#g-f", z); if (f) f.onsubmit = function (ev) { ev.preventDefault(); var raw = lire($("input", f).value); if (raw === "" || isNaN(+raw)) return; var r = verif(c.etapes[i], raw); s.rep[i] = { v: $("input", f).value, juste: r.juste, msg: r.msg }; sauver(); guide(c, s, o); };
    $$(".choix[data-d]", z).forEach(function (b) { b.onclick = function () { s.dchoix = +b.dataset.d; $$(".choix[data-d]", z).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); }; });
    var j = $("#g-j", z); if (j) j.oninput = function () { s.djust = j.value; sauver(); };
    var dec = $("#g-dec", z); if (dec) dec.onclick = function () {
      if (s.dchoix == null) { $("#g-err").textContent = "Choisissez une recommandation."; return; }
      if (!(s.djust || "").trim()) { $("#g-err").textContent = "Écrivez votre raison : c’est elle que l’on juge, pas le choix seul."; return; }
      s.decision = { i: s.dchoix, texte: s.djust.trim(), le: Date.now(), x: JSON.parse(JSON.stringify(s.x)) }; sauver(); suivi("decision-" + c.id); guide(c, s, o);
    };
    var raz = $("#g-raz", z); if (raz) raz.onclick = function () { if (!confirm("Refaire ce cas ? Votre décision actuelle sera effacée.")) return; delete D.cas[c.id]; sauver(); vCas(c.id); };
  }

  /* ================= Mes décisions ================= */
  function vDecisions() {
    var L = CS.CAS.filter(function (c) { return D.cas[c.id] && D.cas[c.id].decision; });
    var h = '<section class="tr-bloc"><p class="surtitre">Mes décisions</p><h2>Ce que j’ai décidé, et pourquoi</h2><p class="lead">Votre raison reste telle que vous l’avez écrite. Ce que vous comprenez après s’ajoute à côté.</p>';
    if (!L.length) h += '<p class="tr-vide">Aucune décision pour l’instant.</p><a class="bouton bouton-principal" href="#cas">Choisir un cas</a>';
    L.forEach(function (c) {
      var s = D.cas[c.id], d = s.decision;
      h += '<article class="carte tr-dec"><p class="etiquette">' + esc(c.entreprise) + " · " + new Date(d.le).toLocaleDateString("fr-FR") + '</p><h3 class="titre-tuile">' + esc(c.titre) + '</h3><p class="tr-avant"><b>Décision :</b> ' + esc(c.decision.choix[d.i].t) + '</p><p class="tr-avant"><b>Ce que je pensais :</b> « ' + esc(d.texte) + ' »</p><p class="tr-note">' + esc(c.decision.choix[d.i].retour) + "</p>" +
        (d.apres ? '<p class="tr-apres"><b>Ce que je comprends après :</b> ' + esc(d.apres) + "</p>" : '<form class="tr-refl" data-id="' + c.id + '"><label>Ce que je comprends après<textarea rows="2" maxlength="400"></textarea></label><button class="bouton bouton-sombre">Ajouter</button></form>') + "</article>";
    });
    vue.innerHTML = h + "</section>";
    $$(".tr-refl", vue).forEach(function (f) { f.onsubmit = function (e) { e.preventDefault(); var t = $("textarea", f).value.trim(); if (!t) return; D.cas[f.dataset.id].decision.apres = t; sauver(); vDecisions(); }; });
  }

  /* ================= Glossaire ================= */
  var GLO = [["Actif", "Ce que l'entreprise possède ou contrôle : immobilisations, stocks, créances, trésorerie."], ["Passif", "Comment l'actif est financé : capitaux propres et dettes."], ["Capitaux propres", "Ce qui appartient aux associés : apports et bénéfices non distribués."],
    ["SYSCOHADA révisé", "Le référentiel comptable des pays de l'OHADA, en vigueur depuis 2018."], ["Valeur ajoutée", "Production et ventes moins consommations venant des tiers."], ["EBE", "Excédent brut d'exploitation : ce que l'activité dégage avant amortissements, intérêts et impôt."],
    ["Résultat d'exploitation", "EBE moins dotations aux amortissements et provisions."], ["CAF", "Capacité d'autofinancement : résultat net plus charges non décaissées."], ["ROE", "Rentabilité des capitaux propres : résultat net ÷ capitaux propres."],
    ["ROCE", "Rentabilité des capitaux investis : résultat d'exploitation après impôt ÷ (capitaux propres + dette nette)."], ["Dette nette", "Dettes financières moins trésorerie."], ["Couverture des intérêts", "Résultat d'exploitation ÷ charges financières."],
    ["BFR", "Besoin en fonds de roulement : stocks + créances − dettes d'exploitation."], ["Fonds de roulement", "Ressources durables moins immobilisations."], ["VAN", "Valeur actuelle nette : somme des flux actualisés, investissement compris."],
    ["TRI", "Taux de rentabilité interne : le taux qui annule la VAN."], ["Délai de récupération", "Temps nécessaire pour que les flux remboursent l'investissement."], ["Point mort", "Volume à partir duquel les coûts fixes sont couverts."],
    ["Crédit-bail", "Location d'un équipement avec option d'achat."], ["MEDAF", "Modèle qui estime le rendement exigé par les actionnaires : taux sans risque + bêta × prime de marché."], ["Bêta", "Sensibilité d'une action aux mouvements du marché."],
    ["CMPC", "Coût moyen pondéré du capital : coût des fonds propres et de la dette après impôt, pondérés par leur poids."], ["Effet de levier", "Effet de la dette sur la rentabilité des capitaux propres, dans les deux sens."], ["Taux de distribution", "Part du résultat versée en dividendes."],
    ["Valeur d'entreprise", "Valeur de l'outil de production, avant de payer les prêteurs."], ["Flux disponible", "Flux d'exploitation après impôt, moins investissements et variation de BFR."], ["Multiple", "Rapport observé entre la valeur et un agrégat (par exemple valeur d'entreprise ÷ EBE) chez des comparables."],
    ["Création de valeur", "(ROCE − CMPC) × capitaux investis."], ["Covenant", "Clause d'un contrat de prêt : ratios à respecter sous peine de remboursement anticipé."]];
  function vGlossaire() {
    vue.innerHTML = '<section class="tr-bloc"><p class="surtitre">Glossaire</p><h2>Les mots de la finance d’entreprise</h2><label class="tr-sel">Chercher un mot<input id="tr-gq" type="search" autocomplete="off"></label><dl class="tr-glo" id="tr-gl"></dl></section>';
    function f() { var q = $("#tr-gq").value.trim().toLowerCase(); $("#tr-gl").innerHTML = GLO.filter(function (g) { return !q || (g[0] + " " + g[1]).toLowerCase().indexOf(q) >= 0; }).map(function (g) { return "<dt>" + esc(g[0]) + "</dt><dd>" + esc(g[1]) + "</dd>"; }).join("") || '<dd class="tr-vide">Aucun mot trouvé.</dd>'; }
    $("#tr-gq").oninput = f; f();
  }

  window.addEventListener("hashchange", route);
  route();
  window.EFA_CF_UI = { D: D };
})();
