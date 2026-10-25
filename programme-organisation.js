/* EFA · Composer le programme d’une organisation (configurateur 100 % en ligne).
   Étapes : 1 organisation et public, 2 sujets, 3 rythme et format, 4 arbitrages, 5 programme.
   Le programme est encodé dans l’adresse (?p=…) : l’organisation le rouvre, le partage, et ses participants
   le suivent (&vue=participant). Aucune donnée n’est envoyée à EFA ; seuls des événements agrégés sont comptés. */
(function () {
  "use strict";
  var D = window.EFA_PARCOURS; if (!D) return;
  var $ = function (id) { return document.getElementById(id); };
  var P = {}; D.parcours.forEach(function (p) { P[p.id] = p; });
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function mesure(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function minutes(p) { var d = p.duree || "", h = /(\d+)\s*h\s*(\d+)?/.exec(d), m = /(\d+)\s*min/.exec(d); return h ? (+h[1]) * 60 + (+(h[2] || 0)) : m ? +m[1] : 45; }
  function duree(min) { var h = Math.floor(min / 60), m = min % 60; return h ? h + " h" + (m ? " " + (m < 10 ? "0" : "") + m : "") : m + " min"; }
  var FONDATIONS = D.parcours.filter(function (p) { return p.cycle === "fondations"; }).map(function (p) { return p.id; });

  var TYPES = [["entreprise", "Entreprise"], ["cooperative", "Coopérative, groupement, tontine"], ["ecole", "École, université"], ["association", "Association, ONG, fondation"], ["institution", "Banque, microfinance, assurance"], ["autre", "Autre"]];
  var PUBLICS = [
    ["salaries", "Salariés", "Un salaire chaque mois, des charges familiales"],
    ["commercants", "Commerçants, agents, indépendants", "Des revenus qui varient d’un mois à l’autre"],
    ["jeunes", "Jeunes, étudiants, premiers emplois", "Un premier budget, le téléphone comme banque"],
    ["groupes", "Membres de tontines ou de groupes", "Cotiser, recevoir son tour, épargner ensemble"],
    ["diaspora", "Diaspora", "Soutenir la famille, construire au pays"]
  ];
  var SUJETS = [
    ["budget", "Savoir où passe l’argent et tenir un budget", ["P1", "P2"]],
    ["reserve", "Constituer une réserve de sécurité", ["P4", "M15"]],
    ["tontine", "Comprendre et mieux utiliser la tontine", ["P5"]],
    ["famille", "Aider ses proches sans se mettre en difficulté", ["P3", "M12"]],
    ["dettes", "Sortir des dettes, lire le coût d’un crédit", ["P6", "M11"]],
    ["mm", "Mobile money, frais et arnaques", ["P10", "P14"]],
    ["activite", "Revenus irréguliers et petite activité", ["M9"]],
    ["annee", "Prévoir les grosses dépenses et les primes", ["M10", "M14"]],
    ["conso", "Consommer, acheter à crédit, négocier", ["M16"]],
    ["protection", "Protéger sa famille et transmettre", ["M13", "M23"]],
    ["placer", "Épargner, placer, comprendre la BRVM", ["M17", "M18", "P8"]],
    ["logement", "Terrain et maison", ["P13"]],
    ["retraite", "Préparer sa retraite", ["P9"]],
    ["club", "Investir à plusieurs", ["M21"]]
  ];
  var CONSEILS = { salaries: ["budget", "reserve", "dettes", "annee", "retraite"], commercants: ["activite", "mm", "reserve", "tontine"], jeunes: ["budget", "mm", "conso", "reserve"], groupes: ["tontine", "reserve", "club"], diaspora: ["famille", "logement", "placer", "retraite"] };
  var FORMATS = [["0", "100 % en ligne", "Vos participants suivent le programme seuls, sur téléphone."], ["1", "En ligne + 1 session EFA", "Une session de lancement pour donner envie et répondre aux questions."], ["2", "En ligne + 2 sessions EFA", "Un lancement, puis un bilan pour challenger les décisions prises."]];
  var INVESTIR = ["M17", "M18", "P8", "M21", "P13", "P9"];

  var S = { nom: "", type: "entreprise", taille: "", publics: [], sujets: [], semaines: 8, min: 45, format: "1", certif: "oui", arb: {}, extra: [], retire: [] };
  var etape = 1;

  /* ---------- encodage du programme dans l’adresse ---------- */
  function encoder(o) { try { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); } catch (e) { return ""; } }
  function decoder(t) { try { t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "="; return JSON.parse(decodeURIComponent(escape(atob(t)))); } catch (e) { return null; } }

  /* ---------- calcul du programme ---------- */
  function modulesChoisis() {
    var ids = [];
    S.sujets.forEach(function (s) { SUJETS.forEach(function (x) { if (x[0] === s) x[2].forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); }); });
    S.extra.forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    ids = ids.filter(function (id) { return S.retire.indexOf(id) < 0 && P[id]; });
    return ids.sort(function (a, b) { return P[a].module - P[b].module; });
  }
  function total(ids) { return ids.reduce(function (t, id) { return t + minutes(P[id]); }, 0); }
  function arbitrages() {
    var A = [], cap = S.semaines * S.min, ex = S.extra; S.extra = [];
    var ids = modulesChoisis(); S.extra = ex; // socle et certificat : jugés sur la sélection de départ, pour que le choix reste visible
    var inv = ids.some(function (id) { return INVESTIR.indexOf(id) >= 0; }), socle = ["P4", "P6"].filter(function (id) { return ids.indexOf(id) < 0; });
    if (inv && socle.length) A.push({ id: "socle", t: "Avant d’investir, le socle", p: "Vous avez choisi des sujets de placement ou de projet. L’école conseille de commencer par la réserve de sécurité et les dettes : placer de l’argent dont on aura besoin, ou en devant un crédit cher, fait perdre plus qu’il ne rapporte.",
      o: [["ajouter", "Ajouter le socle (module" + (socle.length > 1 ? "s " : " ") + socle.map(function (id) { return P[id].module; }).join(" et ") + ", + " + duree(total(socle)) + ")", "Recommandé"], ["sans", "Garder le programme sans le socle", ""]] });
    var fManq = FONDATIONS.filter(function (id) { return ids.indexOf(id) < 0; });
    if (S.certif === "oui" && fManq.length && fManq.length < FONDATIONS.length) A.push({ id: "certif", t: "Viser le certificat local Fondations", p: "Le certificat local Fondations demande les 8 modules du cycle I, puis un examen en ligne. Votre sélection en contient " + (FONDATIONS.length - fManq.length) + ".",
      o: [["completer", "Compléter les " + fManq.length + " modules manquants (+ " + duree(total(fManq)) + ")", "Pour le certificat"], ["attest", "Rester sur votre sélection : une attestation de réalisation par module", ""]] });
    if (S.certif === "oui" && fManq.length === FONDATIONS.length) A.push({ id: "certif", t: "Viser un certificat", p: "Aucun module du cycle Fondations n’est dans votre sélection. Le certificat local Fondations demande ses 8 modules et un examen.",
      o: [["completer", "Ajouter le cycle Fondations complet (+ " + duree(total(fManq)) + ")", "Pour le certificat"], ["attest", "Rester sur votre sélection : une attestation de réalisation par module", ""]] });
    var t = total(modulesChoisis());
    if (t > cap) {
      var sem = Math.ceil(t / S.min), mn = Math.ceil(t / S.semaines / 15) * 15;
      A.push({ id: "charge", t: "Le temps disponible", p: "Votre sélection demande environ " + duree(t) + ", pour " + duree(cap) + " disponibles (" + S.semaines + " semaines × " + S.min + " min).",
        o: [["allonger", "Allonger le programme à " + sem + " semaines", ""], ["rythme", "Passer à " + mn + " min par semaine", ""], ["prioriser", "Garder seulement ce qui tient en " + S.semaines + " semaines, dans l’ordre des sujets choisis", ""]] });
    } else if (t < cap * 0.4 && ids.length) {
      A.push({ id: "marge", t: "Il vous reste du temps", p: "Votre sélection demande environ " + duree(t) + " sur " + duree(cap) + " disponibles.",
        o: [["raccourcir", "Raccourcir le programme à " + Math.max(1, Math.ceil(t / S.min)) + " semaines", ""], ["garder", "Garder " + S.semaines + " semaines : plus de temps pour les outils et les défis", ""]] });
    }
    return A;
  }
  function appliquer() {
    S.extra = []; S.retire = [];
    var ids = modulesChoisis();
    if (S.arb.socle === "ajouter") ["P4", "P6"].forEach(function (id) { if (S.extra.indexOf(id) < 0) S.extra.push(id); });
    if (S.arb.certif === "completer") FONDATIONS.forEach(function (id) { if (S.extra.indexOf(id) < 0) S.extra.push(id); });
    ids = modulesChoisis();
    var t = total(ids), cap = S.semaines * S.min;
    var r = { semaines: S.semaines, min: S.min };
    if (t > cap) {
      if (S.arb.charge === "allonger") r.semaines = Math.ceil(t / S.min);
      else if (S.arb.charge === "rythme") r.min = Math.ceil(t / S.semaines / 15) * 15;
      else if (S.arb.charge === "prioriser") {
        // ordre de priorité : socle et certificat d’abord, puis les sujets dans l’ordre choisi
        var ordre = S.extra.slice(); S.sujets.forEach(function (s) { SUJETS.forEach(function (x) { if (x[0] === s) x[2].forEach(function (id) { if (ordre.indexOf(id) < 0) ordre.push(id); }); }); });
        var garde = [], c = 0; ordre.forEach(function (id) { var m = minutes(P[id]); if (c + m <= cap) { garde.push(id); c += m; } });
        S.retire = ids.filter(function (id) { return garde.indexOf(id) < 0; });
      }
    } else if (t < cap * 0.4 && S.arb.marge === "raccourcir") r.semaines = Math.max(1, Math.ceil(t / S.min));
    return { ids: modulesChoisis(), semaines: r.semaines, min: r.min };
  }
  function planifier(g) {
    // range les modules semaine par semaine, dans l’ordre de l’école, sans dépasser le temps hebdomadaire
    var sem = [], cur = { n: 1, mods: [], t: 0 };
    g.ids.forEach(function (id) {
      var m = minutes(P[id]);
      if (cur.mods.length && cur.t + m > g.min) { sem.push(cur); cur = { n: cur.n + (cur.span || 1), mods: [], t: 0 }; }
      cur.mods.push(id); cur.t += m;
      if (cur.t > g.min) cur.span = Math.ceil(cur.t / g.min);
    });
    if (cur.mods.length) sem.push(cur);
    return sem;
  }
  function programme() {
    var g = appliquer();
    return { v: 1, n: S.nom.slice(0, 60), ty: S.type, ta: S.taille, pu: S.publics, m: g.ids, s: g.semaines, mi: g.min, f: S.format, c: S.certif === "oui" && FONDATIONS.every(function (id) { return g.ids.indexOf(id) >= 0; }) ? "F" : "" };
  }

  /* ---------- écrans de composition ---------- */
  var NOMS = ["Votre organisation", "Les sujets", "Rythme et format", "Arbitrages", "Votre programme"];
  function pastilles() { $("etapes").innerHTML = NOMS.map(function (n, k) { return '<li class="' + (k + 1 === etape ? "ici" : k + 1 < etape ? "fait" : "") + '">' + (k + 1) + " · " + n + "</li>"; }).join(""); }
  function bouton(id, label, pressed, sous, em, rond) { return '<button type="button" class="ch' + (rond ? " rond" : "") + '" data-v="' + id + '" aria-pressed="' + (pressed ? "true" : "false") + '"><b>' + esc(label) + "</b>" + (sous ? "<small>" + esc(sous) + "</small>" : "") + (em ? "<em>" + esc(em) + "</em>" : "") + "</button>"; }
  function aller(n) { etape = n; pastilles(); [null, e1, e2, e3, e4, e5][n](); try { window.scrollTo({ top: $("etapes").getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" }); } catch (e) {} mesure("orga-programme-etape-" + n); }

  function e1() {
    $("vue").innerHTML = '<section class="carte"><p class="sur">Étape 1 sur 5</p><h2>Votre organisation et votre public</h2>'
      + '<div class="grille2"><label class="champ">Nom de l’organisation <small style="font-weight:400;color:var(--ink3)">facultatif, il apparaîtra sur le programme</small><input id="o-nom" maxlength="60" autocomplete="organization" value="' + esc(S.nom) + '" placeholder="ex. Coopérative des femmes de Yopougon"></label>'
      + '<label class="champ">Type d’organisation<select id="o-type">' + TYPES.map(function (t) { return '<option value="' + t[0] + '"' + (S.type === t[0] ? " selected" : "") + ">" + t[1] + "</option>"; }).join("") + "</select></label>"
      + '<label class="champ">Nombre de participants<select id="o-taille">' + ["", "moins de 20", "20 à 100", "100 à 500", "plus de 500"].map(function (t) { return '<option value="' + t + '"' + (S.taille === t ? " selected" : "") + ">" + (t || "À préciser") + "</option>"; }).join("") + "</select></label></div>"
      + '<p class="aide"><b>Qui va suivre le programme&nbsp;?</b> Choisissez un ou plusieurs publics : nous vous conseillerons des sujets.</p>'
      + '<div class="choix" id="o-pub">' + PUBLICS.map(function (p) { return bouton(p[0], p[1], S.publics.indexOf(p[0]) >= 0, p[2]); }).join("") + "</div>"
      + '<div class="acts"><button type="button" class="bt bt-p" id="suiv">Choisir les sujets</button></div></section>';
    $("o-pub").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; var v = b.dataset.v, i = S.publics.indexOf(v); if (i >= 0) S.publics.splice(i, 1); else S.publics.push(v); b.setAttribute("aria-pressed", i < 0); };
    $("suiv").onclick = function () { S.nom = $("o-nom").value.trim(); S.type = $("o-type").value; S.taille = $("o-taille").value; aller(2); };
  }
  function e2() {
    var cons = []; S.publics.forEach(function (p) { (CONSEILS[p] || []).forEach(function (s) { if (cons.indexOf(s) < 0) cons.push(s); }); });
    $("vue").innerHTML = '<section class="carte"><p class="sur">Étape 2 sur 5</p><h2>Que doivent-ils apprendre&nbsp;?</h2><p class="aide">Choisissez les sujets utiles à votre public. ' + (cons.length ? "Les sujets marqués « Conseillé » correspondent au public choisi." : "") + '</p>'
      + '<div class="choix" id="s-l">' + SUJETS.map(function (s) { return bouton(s[0], s[1], S.sujets.indexOf(s[0]) >= 0, s[2].map(function (id) { return "Module " + P[id].module; }).join(" · "), cons.indexOf(s[0]) >= 0 ? "Conseillé" : ""); }).join("") + "</div>"
      + '<p class="aide" id="s-n"></p>'
      + '<div class="acts">' + (cons.length ? '<button type="button" class="bt" id="s-cons">Prendre les sujets conseillés</button>' : "") + '<button type="button" class="bt bt-p" id="suiv">Rythme et format</button><button type="button" class="bt bt-l" id="prec">Retour</button></div></section>';
    function maj() { var ids = modulesChoisis(); $("s-n").innerHTML = ids.length ? "<b>" + ids.length + " module" + (ids.length > 1 ? "s" : "") + "</b>, environ " + duree(total(ids)) + " de leçons et d’outils." : "Choisissez au moins un sujet."; $("suiv").disabled = !ids.length; }
    $("s-l").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; var v = b.dataset.v, i = S.sujets.indexOf(v); if (i >= 0) S.sujets.splice(i, 1); else S.sujets.push(v); b.setAttribute("aria-pressed", i < 0); maj(); };
    if ($("s-cons")) $("s-cons").onclick = function () { cons.forEach(function (s) { if (S.sujets.indexOf(s) < 0) S.sujets.push(s); }); e2(); };
    $("suiv").onclick = function () { aller(3); }; $("prec").onclick = function () { aller(1); }; maj();
  }
  function e3() {
    $("vue").innerHTML = '<section class="carte"><p class="sur">Étape 3 sur 5</p><h2>Le rythme et le format</h2>'
      + '<div class="grille2"><label class="champ">Durée du programme<select id="r-sem">' + [2, 4, 6, 8, 10, 12, 16].map(function (n) { return '<option value="' + n + '"' + (S.semaines === n ? " selected" : "") + ">" + n + " semaines</option>"; }).join("") + "</select></label>"
      + '<label class="champ">Temps par semaine et par participant<select id="r-min">' + [30, 45, 60, 90, 120].map(function (n) { return '<option value="' + n + '"' + (S.min === n ? " selected" : "") + ">" + duree(n) + "</option>"; }).join("") + "</select></label></div>"
      + '<p class="aide"><b>Le format</b></p><div class="choix" id="r-f">' + FORMATS.map(function (f) { return bouton(f[0], f[1], S.format === f[0], f[2], "", true); }).join("") + "</div>"
      + '<p class="aide"><b>Un certificat&nbsp;?</b></p><div class="choix" id="r-c">' + bouton("oui", "Oui, viser un certificat", S.certif === "oui", "Certificat local, avec un examen en ligne", "", true) + bouton("non", "Non, des attestations suffisent", S.certif === "non", "Une attestation de réalisation par module", "", true) + "</div>"
      + '<div class="acts"><button type="button" class="bt bt-p" id="suiv">Voir les arbitrages</button><button type="button" class="bt bt-l" id="prec">Retour</button></div></section>';
    function radio(id, cle) { $(id).onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; S[cle] = b.dataset.v; $(id).querySelectorAll(".ch").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); }; }
    radio("r-f", "format"); radio("r-c", "certif");
    $("suiv").onclick = function () { S.semaines = +$("r-sem").value; S.min = +$("r-min").value; S.arb = {}; aller(4); }; $("prec").onclick = function () { aller(2); };
  }
  function e4() {
    appliquer(); var A = arbitrages();
    $("vue").innerHTML = '<section class="carte"><p class="sur">Étape 4 sur 5</p><h2>' + (A.length ? "Nos propositions : à vous de trancher" : "Rien à arbitrer") + '</h2>'
      + (A.length ? '<p class="aide">Votre sélection appelle ' + A.length + ' décision' + (A.length > 1 ? "s" : "") + '. Choisissez une option pour chacune.</p>' : '<p class="ok-l">Votre sélection tient dans le temps prévu et ne demande aucun ajout.</p>')
      + A.map(function (a) { return '<div class="arb"><h3>' + esc(a.t) + "</h3><p>" + esc(a.p) + '</p><div class="opts choix" data-arb="' + a.id + '">' + a.o.map(function (o) { return bouton(o[0], o[1], S.arb[a.id] === o[0], "", o[2], true); }).join("") + "</div></div>"; }).join("")
      + '<div class="acts"><button type="button" class="bt bt-p" id="suiv"' + (A.every(function (a) { return S.arb[a.id]; }) ? "" : " disabled") + '>Construire mon programme</button><button type="button" class="bt bt-l" id="prec">Retour</button></div></section>';
    $("vue").querySelectorAll("[data-arb]").forEach(function (box) {
      box.onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; S.arb[box.dataset.arb] = b.dataset.v; box.querySelectorAll(".ch").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); mesure("orga-arbitrage-" + box.dataset.arb + "-" + b.dataset.v);
        // un choix peut en faire apparaître un autre (ex. compléter les Fondations augmente la durée)
        var avant = A.map(function (a) { return a.id; }).join(); appliquer(); var apres = arbitragesApres().map(function (a) { return a.id; }).join();
        if (avant !== apres) { e4(); return; }
        $("suiv").disabled = !A.every(function (a) { return S.arb[a.id]; }); };
    });
    $("suiv").onclick = function () { aller(5); }; $("prec").onclick = function () { aller(3); };
  }
  function arbitragesApres() { return arbitrages(); }

  /* ---------- le programme (organisation ou participant) ---------- */
  function rendre(pr, participant) {
    var g = { ids: pr.m.filter(function (id) { return P[id]; }), semaines: pr.s, min: pr.mi }, sem = planifier(g), t = total(g.ids), f = FORMATS.filter(function (x) { return x[0] === pr.f; })[0] || FORMATS[0];
    var lien = location.origin + location.pathname + "?p=" + encoder(pr), lienP = lien + "&vue=participant";
    var st = {}; try { st = JSON.parse(localStorage.getItem("efa_parcours_v1") || "{}") || {}; } catch (e) {} var faits = st.faits || {};
    function prog(id) { var p = P[id], n = 0, d = 0; p.etapes.forEach(function (s, i) { if (s.ess && s.ok) { d++; if (faits[id + "." + i]) n++; } }); return d ? n + "/" + d : ""; }
    var dern = sem.length ? sem[sem.length - 1].n + (sem[sem.length - 1].span || 1) - 1 : 0;
    var h = '<section class="carte">' + (participant ? '<p class="sur">Votre programme</p>' : '<p class="sur">Étape 5 sur 5 · Votre programme</p>')
      + "<h2>" + (pr.n ? "Programme d’éducation financière · " + esc(pr.n) : "Votre programme d’éducation financière") + "</h2>"
      + '<div class="resume"><div><small>Modules</small><b>' + g.ids.length + '</b></div><div><small>Durée</small><b>' + Math.max(dern, pr.s) + ' semaines</b></div><div><small>Par semaine</small><b>' + duree(pr.mi) + '</b></div><div><small>Format</small><b>' + esc(f[1].replace("En ligne + ", "+ ")) + "</b></div></div>"
      + (pr.c === "F" ? '<p class="ok-l">Ce programme couvre le cycle Fondations : chaque participant peut passer l’examen en ligne et obtenir le certificat local Fondations.</p>' : '<p class="aide">Chaque module terminé, avec sa fiche gardée, donne une attestation de réalisation au participant.</p>');
    sem.forEach(function (s, k) {
      var titre = s.span > 1 ? "Semaines " + s.n + " à " + (s.n + s.span - 1) : "Semaine " + s.n;
      h += '<div class="sem"><h3>' + titre + "<small>" + duree(s.t) + "</small></h3><div>";
      if (k === 0 && pr.f !== "0") h += '<div class="session"><b>Session EFA de lancement</b><span>En présentiel ou en visio : le programme, les premières questions, le module de départ fait ensemble.</span></div>';
      s.mods.forEach(function (id) { var p = P[id], pg = participant ? prog(id) : ""; h += '<a class="mod c-' + p.cycle + '" href="parcours.html?src=programme#' + id + '"><span class="n">' + p.module + "</span><div><b>" + esc(p.titre) + "</b><span>" + esc(p.objectif) + " Fiche à garder : " + esc(p.fiche ? p.fiche.titre : "") + ".</span></div><span class=\"d\">" + (pg ? pg + " étapes" : esc(duree(minutes(p)))) + "</span></a>"; });
      if (k === sem.length - 1 && pr.f === "2") h += '<div class="session"><b>Session EFA de bilan</b><span>Ce que chacun a décidé, ce qui a marché, les questions restées ouvertes.</span></div>';
      h += "</div></div>";
    });
    if (pr.c === "F") h += '<div class="sem"><h3>Pour finir<small>30 min</small></h3><div><a class="mod" href="certificat-pilote.html?src=programme"><span class="n">★</span><div><b>Examen du certificat local Fondations</b><span>24 questions, 30 minutes, 17 bonnes réponses pour réussir. En ligne, sur téléphone.</span></div><span class="d">30 min</span></a></div></div>';
    h += "</section>";
    if (participant) {
      h += '<section class="carte"><h2>Comment suivre ce programme</h2><ul class="limites"><li>Ouvrez chaque module dans l’ordre : il vous guide étape par étape, avec vidéos, leçons et outils.</li><li>Votre progression reste sur votre téléphone. Pour la garder, utilisez « Ma progression » en bas de la page de l’école.</li><li>Une question&nbsp;? <a href="ely.html">Posez-la à Ely</a>, le guide de l’école, ou gardez-la pour la session EFA.</li></ul><div class="acts"><a class="bt bt-p" href="parcours.html?src=programme#' + (g.ids[0] || "") + '">Commencer le premier module</a></div></section>';
    } else {
      h += '<section class="carte no-print"><h2>Et maintenant</h2>'
        + '<div class="acts"><button type="button" class="bt bt-p" id="a-part">Copier le lien pour les participants</button><button type="button" class="bt" id="a-wa">Envoyer par WhatsApp</button><button type="button" class="bt" id="a-print">Imprimer ou enregistrer en PDF</button></div>'
        + '<p class="aide" id="a-msg" role="status"></p>'
        + '<div class="acts"><a class="bt bt-n" id="a-ses" href="rendez-vous.html?sujet=organisation&amp;programme=' + encodeURIComponent(lien) + '#contact">' + (pr.f === "0" ? "Ajouter une session avec EFA" : pr.f === "2" ? "Réserver les sessions avec EFA" : "Réserver la session avec EFA") + '</a><button type="button" class="bt bt-l" id="a-mod">Modifier le programme</button><button type="button" class="bt bt-l" id="a-lien">Copier le lien de cette page</button></div>'
        + '</section>'
        + '<section class="carte"><h2>Ce qu’il faut savoir</h2><ul class="limites">'
        + "<li><b>Gratuit pendant le pilote</b> : les modules et la composition du programme. Les sessions avec EFA se conviennent ensemble.</li>"
        + "<li><b>Suivi</b> : chaque participant voit sa progression sur son téléphone. Il n’existe pas encore de tableau de bord pour l’organisation ; en session, nous faisons le point avec vous.</li>"
        + "<li><b>Contenus en pilote</b> : les modules et les certificats sont en ligne et relus progressivement par l’équipe pédagogique d’EFA.</li>"
        + "<li><b>Éducation, pas conseil</b> : EFA ne vend aucun produit financier et ne recommande aucun établissement.</li></ul></section>";
    }
    $("vue").innerHTML = h;
    if (participant) return;
    function copier(t, m) { var ok = function () { $("a-msg").textContent = m; }; try { navigator.clipboard.writeText(t).then(ok, function () { window.prompt("Copiez ce lien :", t); }); } catch (e) { window.prompt("Copiez ce lien :", t); } }
    $("a-part").onclick = function () { copier(lienP, "Lien copié : envoyez-le à vos participants (email, WhatsApp, intranet)."); mesure("orga-programme-lien-participants"); };
    $("a-lien").onclick = function () { copier(lien, "Lien copié : il rouvre ce programme tel quel."); };
    $("a-wa").onclick = function () { window.open("https://wa.me/?text=" + encodeURIComponent((pr.n ? pr.n + " : " : "") + "votre programme d’éducation financière avec EFA, à suivre sur téléphone : " + lienP), "_blank", "noopener"); mesure("orga-programme-whatsapp"); };
    $("a-print").onclick = function () { try { window.print(); } catch (e) {} };
    $("a-ses").onclick = function () { mesure("orga-programme-session"); };
    $("a-mod").onclick = function () { history.replaceState(null, "", location.pathname); aller(1); };
  }
  function e5() {
    var pr = programme();
    history.replaceState(null, "", location.pathname + "?p=" + encoder(pr));
    mesure("orga-programme-construit");
    rendre(pr, false);
  }

  /* ---------- ouverture ---------- */
  var q = new URLSearchParams(location.search), code = q.get("p"), pr = code && decoder(code);
  if (pr && pr.m) {
    var participant = q.get("vue") === "participant";
    S.nom = pr.n || ""; S.type = pr.ty || "entreprise"; S.taille = pr.ta || ""; S.publics = pr.pu || []; S.semaines = pr.s; S.min = pr.mi; S.format = pr.f; S.certif = pr.c ? "oui" : "non";
    if (participant) {
      $("etapes").hidden = true; $("h-sur").textContent = "Programme d’éducation financière"; $("h-t").textContent = pr.n ? "Votre programme avec " + pr.n : "Votre programme d’éducation financière";
      $("h-c").textContent = "Un programme composé pour vous, à suivre sur votre téléphone, module après module. Chaque module part d’une situation concrète et se termine par une fiche que vous gardez.";
      $("h-p").hidden = true; $("fil").textContent = "Mon programme"; mesure("orga-programme-participant");
    } else { etape = 5; pastilles(); }
    rendre(pr, participant);
  } else { pastilles(); e1(); }
})();
