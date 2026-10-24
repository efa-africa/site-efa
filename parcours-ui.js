/* EFA · briques communes « Mes questions » : questions fréquentes, les 100 questions, liste des problèmes et trois questions d'orientation.
   EFAParcoursUI.questions(el, opts) : quatre questions fréquentes, « M’aider à choisir en 3 questions », « Voir toutes les questions » (nécessite EFA_QUESTIONS)
   Utilisé par parcours.html et par l'onglet « Mon parcours » de outils.html. Nécessite parcours-efa.js.
   EFAParcoursUI.problemes(el, opts)  opts.choisir(id) : appelé au clic ; sinon lien vers parcours.html#id
   EFAParcoursUI.quiz(form, res, opts) opts.resultat(liste) : appelé avec ["P3","P1","P4"] ; opts.lien(id) : adresse d'un parcours */
(function () {
  "use strict";
  var D = window.EFA_PARCOURS; if (!D) return;
  var P = {}; D.parcours.forEach(function (p) { P[p.id] = p; }); var FU = D.fusions || {}; Object.keys(FU).forEach(function (k) { if (P[FU[k]]) P[k] = P[FU[k]]; });
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function nomCourt(id) { return P[id] && P[id].nom ? P[id].nom : "Parcours " + id.slice(1); }
  function mesure(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }

  var CSS = ".efa-pb-liste{display:grid;grid-template-columns:minmax(0,1fr);gap:8px}"
    + ".efa-pb{all:unset;box-sizing:border-box;cursor:pointer;background:#FFFDF8;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;min-width:0;font-family:\"Source Sans 3\",\"Source Sans Pro\",system-ui,sans-serif;text-decoration:none}"
    + ".efa-pb:hover{background:#fff}.efa-pb:focus-visible{outline:3px solid #2188D6;outline-offset:2px}"
    + ".efa-pb .t{flex:1;display:flex;flex-direction:column;gap:3px;min-width:0}"
    + ".efa-pb q{font-family:\"Libre Baskerville\",Baskerville,Georgia,serif;font-weight:700;font-size:17px;line-height:1.25;color:#0B1220;quotes:\"«\\00a0\" \"\\00a0»\"}"
    + ".efa-pb .v{font-size:13.5px;font-weight:700;color:#E44828}"
    + ".efa-pb .f{font-size:20px;color:#7A8293}"
    + ".efa-quiz{background:#0B1220;color:#E8EDF5;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:18px}"
    + ".efa-quiz .qh{display:flex;flex-direction:column;gap:6px}"
    + ".efa-quiz .qh b{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#F09680}"
    + ".efa-quiz .qh strong{font-family:\"Libre Baskerville\",Baskerville,Georgia,serif;font-size:clamp(20px,2.2vw,24px);line-height:1.15;color:#fff}"
    + ".efa-quiz .qh span{font-size:14px;color:#C9D1DE}"
    + ".efa-quiz fieldset{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;min-width:0}"
    + ".efa-quiz legend{font-weight:700;font-size:16px;color:#fff;margin-bottom:4px;padding:0}"
    + ".efa-quiz legend i{font-style:normal;color:#F09680;margin-right:6px}"
    + ".efa-quiz .o{display:flex;flex-wrap:wrap;gap:6px}"
    + ".efa-quiz label{display:inline-flex;align-items:center;gap:7px;background:#111B2F;color:#E8EDF5;border-radius:999px;padding:8px 14px;min-height:40px;cursor:pointer;font-size:15px}"
    + ".efa-quiz input{accent-color:#E44828;width:17px;height:17px;margin:0}"
    + ".efa-quiz label:has(input:checked){background:#E44828;color:#fff}"
    + ".efa-quiz .err{color:#F09680;font-weight:700;font-size:14px;margin:0}"
    + ".efa-quiz .go{align-self:flex-start;display:inline-flex;align-items:center;min-height:46px;padding:12px 22px;border-radius:8px;border:0;background:#E44828;color:#fff;font:800 16px/1.2 inherit;font-family:inherit;cursor:pointer}"
    + ".efa-quiz-res{background:#FFFDF8;color:#2A3142;border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:10px}"
    + ".efa-quiz-res strong{font-family:\"Libre Baskerville\",Baskerville,Georgia,serif;font-size:19px;line-height:1.2;color:#0B1220}"
    + ".efa-quiz-res ol{margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:4px}"
    + ".efa-quiz-res a{color:#0B1220;font-weight:700;text-decoration:underline;text-decoration-color:#E44828;text-decoration-thickness:2px;text-underline-offset:4px}"
    + ".efa-quiz-res .go{background:#E44828;color:#fff;text-decoration:none}"
    + ".efa-quiz-res small{font-size:13.5px;color:#4E5566}"
    + ".efa-qs{display:flex;flex-direction:column;gap:14px;min-width:0}"
    + ".efa-qs .qs-t{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#E44828;margin:0}"
    + ".efa-qs .qs-freq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}"
    + "@media (max-width:640px){.efa-qs .qs-freq{grid-template-columns:minmax(0,1fr)}}"
    + ".efa-q{display:flex;flex-direction:column;justify-content:space-between;gap:10px;background:#FFFDF8;border-radius:14px;padding:16px 18px;text-decoration:none;min-width:0;color:#0B1220}"
    + ".efa-q:hover{background:#fff}.efa-q:focus-visible,.efa-qs button:focus-visible,.efa-qs input:focus-visible{outline:3px solid #2188D6;outline-offset:2px}"
    + ".efa-q q{font-family:\"Libre Baskerville\",Baskerville,Georgia,serif;font-weight:700;font-size:18px;line-height:1.25;quotes:\"«\\00a0\" \"\\00a0»\"}"
    + ".efa-q .v{font-size:14px;font-weight:700;color:#E44828}"
    + ".efa-qs .qs-acts{display:flex;flex-wrap:wrap;gap:10px}"
    + ".efa-qs .qs-b{display:inline-flex;align-items:center;min-height:46px;padding:12px 20px;border-radius:8px;border:0;font:800 16px/1.2 \"Source Sans 3\",\"Source Sans Pro\",system-ui,sans-serif;cursor:pointer;background:#0B1220;color:#fff;text-decoration:none}"
    + ".efa-qs .qs-b.clair{background:#FFFDF8;color:#0B1220}"
    + ".efa-qs .qs-b[aria-expanded=true]{background:#E44828;color:#fff}"
    + ".efa-qs .qs-toutes{display:flex;flex-direction:column;gap:12px}"
    + ".efa-qs .qs-cherche{display:flex;flex-direction:column;gap:6px}"
    + ".efa-qs .qs-cherche label{font-weight:700;font-size:15px;color:#0B1220}"
    + ".efa-qs .qs-cherche input{box-sizing:border-box;width:100%;min-height:46px;padding:10px 14px;border-radius:8px;border:1px solid #E2D8C4;background:#fff;font:400 17px \"Source Sans 3\",system-ui,sans-serif;color:#2A3142}"
    + ".efa-qs .qs-n{font-size:14px;color:#4E5566;margin:0}"
    + ".efa-qs .qs-th{background:#FFFDF8;border-radius:14px;padding:4px 16px}"
    + ".efa-qs .qs-th summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 0;font-family:\"Libre Baskerville\",Baskerville,Georgia,serif;font-weight:700;font-size:18px;line-height:1.2;color:#0B1220}"
    + ".efa-qs .qs-th summary::-webkit-details-marker{display:none}"
    + ".efa-qs .qs-th summary span{font-family:\"Source Sans 3\",system-ui,sans-serif;font-size:14px;font-weight:700;color:#7A8293;white-space:nowrap}"
    + ".efa-qs .qs-th ul{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column}"
    + ".efa-qs .qs-th li{border-top:1px solid #E2D8C4}"
    + ".efa-qs .qs-th li a{display:flex;flex-direction:column;gap:2px;padding:10px 0;text-decoration:none;color:#2A3142;font-size:16.5px;line-height:1.35}"
    + ".efa-qs .qs-th li a:hover b{text-decoration:underline;text-decoration-color:#E44828;text-decoration-thickness:2px;text-underline-offset:4px}"
    + ".efa-qs .qs-th li b{font-weight:600;color:#0B1220}"
    + ".efa-qs .qs-th li small{font-size:13.5px;font-weight:700;color:#E44828}"
    + ".efa-qs .qs-th li .pr{display:inline-block;margin-left:6px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:#2188D6;border-radius:999px;padding:2px 8px;vertical-align:2px}"
    + ".efa-qs .qs-vide{background:#FFFDF8;border-radius:14px;padding:16px 18px;margin:0}"
    + ".efa-qs .qs-pied{font-size:15px;margin:0}.efa-qs .qs-pied a{color:#0B1220;font-weight:700;text-decoration:underline;text-decoration-color:#E44828;text-decoration-thickness:2px;text-underline-offset:4px}";
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  var QS = [
    { id: "q1", t: "À la fin du mois, savez-vous où est passé votre argent ?", o: [["oui", "Oui, à peu près"], ["non", "Non, pas vraiment"]] },
    { id: "q2", t: "Avez-vous de côté au moins un mois de dépenses, hors tontine ?", o: [["oui", "Oui"], ["non", "Non"], ["nsp", "Je ne sais pas"]] },
    { id: "q3", t: "Qu’est-ce qui pèse le plus en ce moment ?", o: [["P3", "Les demandes de mes proches"], ["P6", "Mes dettes"], ["P5", "Ma tontine"], ["M14", "Une grosse somme qui arrive"], ["P2", "Tenir mon budget"], ["P10", "Les frais et les arnaques"], ["M9", "Mon activité, mon commerce"], ["M10", "La rentrée, les fêtes, les funérailles"], ["P13", "Construire ma maison"], ["P14", "Protéger ma famille d’un coup dur"], ["P8", "Faire fructifier mon argent"], ["P9", "Préparer ma retraite"]] }
  ];
  function orienter(r1, r2, r3) {
    var L = [], a = function (id) { if (L.indexOf(id) < 0) L.push(id); };
    if (["P3", "P6", "P5", "P10", "M9", "M10", "M14"].indexOf(r3) >= 0) a(r3);
    if (r1 === "non") a("P1");
    if (r3 === "P2") a("P2");
    if (r2 !== "oui") a("P4");
    if (r3 === "P14") { a("P4"); a("P14"); }
    if (r3 === "P8" || r3 === "P9" || r3 === "P13") a(r3);
    if (r1 === "non") a("P2");
    ["P2", "P4", "P8"].forEach(function (id) { if (L.length < 3) a(id); });
    return L.slice(0, 3);
  }


  function norm(x) { return String(x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, " "); }
  var QD = window.EFA_QUESTIONS;
  function lienQ(q) { return q.p === "quiz" ? null : "parcours.html#" + q.p; }
  function questions(el, opts) {
    opts = opts || {}; if (!QD) return;
    var lien = opts.lien || function (id) { return "parcours.html#" + id; };
    var TOUTES = []; QD.themes.forEach(function (t) { t.questions.forEach(function (q) { TOUTES.push(q); }); });
    var PAR = {}; TOUTES.forEach(function (q) { PAR[q.n] = q; });
    var uid = "qs" + Math.random().toString(36).slice(2, 7);
    function vers(q) { return q.p === "quiz" ? "Trois questions pour choisir mon parcours" : nomCourt(q.p) + " · " + (P[q.p] ? P[q.p].titre : ""); }
    function carte(q) {
      var h = q.p === "quiz" ? "#" + uid + "-quiz" : lien(q.p);
      return '<a class="efa-q" href="' + esc(h) + '" data-q="' + q.n + '"' + (q.p === "quiz" ? ' data-qs="quiz"' : "") + '><q>' + esc(q.q) + '</q><span class="v">' + esc(vers(q)) + ' →</span></a>';
    }
    function ligne(q) {
      var h = q.p === "quiz" ? "#" + uid + "-quiz" : lien(q.p), pr = QD.prioritaires.indexOf(q.n) >= 0;
      return '<li><a href="' + esc(h) + '" data-q="' + q.n + '"' + (q.p === "quiz" ? ' data-qs="quiz"' : "") + '><b>' + esc(q.q) + (pr ? '<span class="pr">Pour commencer</span>' : "") + '</b><small>' + esc(vers(q)) + ' →</small></a></li>';
    }
    el.className = (el.className ? el.className + " " : "") + "efa-qs";
    el.innerHTML = '<p class="qs-t">Les questions qu’on nous pose le plus</p>'
      + '<div class="qs-freq">' + QD.frequentes.map(function (n) { return carte(PAR[n]); }).join("") + '</div>'
      + '<div class="qs-acts"><button type="button" class="qs-b" data-qs="quiz" aria-expanded="false" aria-controls="' + uid + '-quiz">M’aider à choisir en 3 questions</button>'
      + '<button type="button" class="qs-b clair" data-qs="toutes" aria-expanded="false" aria-controls="' + uid + '-toutes">Voir toutes les questions (' + TOUTES.length + ')</button></div>'
      + '<div id="' + uid + '-quiz" hidden><form></form><div role="status" hidden></div></div>'
      + '<div class="qs-toutes" id="' + uid + '-toutes" hidden>'
      + '<div class="qs-cherche"><label for="' + uid + '-c">Chercher parmi les questions</label><input id="' + uid + '-c" type="search" autocomplete="off" enterkeyhint="search" placeholder="Par exemple : tontine, loyer, crédit, assurance…"></div>'
      + '<p class="qs-n" role="status" aria-live="polite"></p><div class="qs-liste"></div>'
      + '<p class="qs-vide" hidden>Aucune question ne ressemble à la vôtre. Essayez un autre mot, <a href="#' + uid + '-quiz" data-qs="quiz">répondez aux 3 questions</a> ou <a href="ely.html?src=questions">posez-la à Ely</a>.</p>'
      + '</div>'
      + (opts.pied === false ? "" : '<p class="qs-pied"><a href="parcours.html#tous">Voir les ' + D.parcours.length + ' modules en détail →</a></p>');
    var boxQ = el.querySelector("#" + uid + "-quiz"), boxT = el.querySelector("#" + uid + "-toutes");
    var bQ = el.querySelector('.qs-b[data-qs="quiz"]'), bT = el.querySelector('.qs-b[data-qs="toutes"]');
    var quizPret = false;
    function ouvrirQuiz(force) {
      var ouvre = force || boxQ.hidden; boxQ.hidden = !ouvre; bQ.setAttribute("aria-expanded", String(ouvre));
      if (ouvre && !quizPret) { quizPret = true; EFAParcoursUI.quiz(boxQ.querySelector("form"), boxQ.querySelector("[role=status]"), opts.quiz || {}); }
      if (ouvre) { mesure("questions-quiz"); boxQ.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    }
    var inp = el.querySelector("#" + uid + "-c"), liste = el.querySelector(".qs-liste"), nb = el.querySelector(".qs-n"), vide = el.querySelector(".qs-vide");
    function rendre() {
      var m = norm(inp.value).split(/\s+/).filter(function (w) { return w.length > 1; }), total = 0;
      liste.innerHTML = QD.themes.map(function (t, i) {
        var qs = t.questions.filter(function (q) {
          if (!m.length) return true;
          var h = norm(q.q + " " + t.nom + " " + (P[q.p] ? P[q.p].titre + " " + P[q.p].probleme : ""));
          return m.every(function (w) { return h.indexOf(w) >= 0; });
        });
        total += qs.length; if (!qs.length) return "";
        return '<details class="qs-th"' + (m.length || i === 0 ? " open" : "") + '><summary>' + esc(t.nom) + '<span>' + qs.length + ' question' + (qs.length > 1 ? "s" : "") + '</span></summary><ul>' + qs.map(ligne).join("") + '</ul></details>';
      }).join("");
      nb.textContent = m.length ? total + " question" + (total > 1 ? "s" : "") + " pour « " + inp.value.trim() + " »" : "100 questions en 10 thèmes. Chacune mène au parcours qui y répond.";
      vide.hidden = total > 0;
    }
    var tmr; inp.addEventListener("input", function () { clearTimeout(tmr); tmr = setTimeout(function () { rendre(); if (inp.value.trim().length > 2) mesure("questions-recherche"); }, 180); });
    function ouvrirToutes(force) {
      var ouvre = force || boxT.hidden; boxT.hidden = !ouvre; bT.setAttribute("aria-expanded", String(ouvre));
      if (ouvre) { if (!liste.innerHTML) rendre(); mesure("questions-toutes"); }
    }
    el.addEventListener("click", function (e) {
      var a = e.target.closest("[data-qs],[data-q]"); if (!a) return;
      var k = a.getAttribute("data-qs");
      if (k === "quiz") { e.preventDefault(); ouvrirQuiz(a.tagName !== "BUTTON"); return; }
      if (k === "toutes") { e.preventDefault(); ouvrirToutes(false); return; }
      var n = +a.getAttribute("data-q"), q = PAR[n];
      if (q) { mesure("question-" + n); if (opts.choisir && q.p !== "quiz") { e.preventDefault(); opts.choisir(q.p, q); } }
    });
    return { quiz: function () { ouvrirQuiz(true); }, toutes: function (mot) { ouvrirToutes(true); if (mot != null) { inp.value = mot; rendre(); } } };
  }
  window.EFAParcoursUI = {
    nomCourt: nomCourt,
    questions: questions,
    problemes: function (el, opts) {
      opts = opts || {};
      var liste = D.parcours.filter(function (p) { return p.id !== "P0"; });
      el.className = (el.className ? el.className + " " : "") + "efa-pb-liste";
      el.innerHTML = liste.map(function (p) {
        var inner = '<span class="t"><q>' + esc(p.probleme) + '</q><span class="v">' + esc(nomCourt(p.id)) + " · " + esc(p.titre) + '</span></span><span class="f" aria-hidden="true">→</span>';
        return opts.choisir ? '<button class="efa-pb" type="button" data-pb="' + p.id + '">' + inner + "</button>"
                            : '<a class="efa-pb" href="parcours.html#' + p.id + '" data-goatcounter-click="probleme-' + p.id + '">' + inner + "</a>";
      }).join("");
      if (opts.choisir) el.addEventListener("click", function (e) { var b = e.target.closest("[data-pb]"); if (b) { mesure("probleme-" + b.getAttribute("data-pb")); opts.choisir(b.getAttribute("data-pb")); } });
    },
    quiz: function (form, res, opts) {
      opts = opts || {};
      var lien = opts.lien || function (id, L) { return "parcours.html?reco=" + L.join(",") + "#" + id; };
      form.className = (form.className ? form.className + " " : "") + "efa-quiz";
      form.setAttribute("novalidate", "");
      form.innerHTML = '<div class="qh"><b>Je ne sais pas</b><strong>Trois questions pour trouver mon parcours</strong><span>Moins d’une minute. Rien n’est envoyé.</span></div>'
        + QS.map(function (q, i) {
          return '<fieldset><legend><i>' + (i + 1) + "</i>" + esc(q.t) + '</legend><div class="o">' + q.o.map(function (o) { return '<label><input type="radio" name="' + q.id + '" value="' + o[0] + '"> ' + esc(o[1]) + "</label>"; }).join("") + "</div></fieldset>";
        }).join("")
        + '<p class="err" hidden>Répondez aux trois questions.</p><button class="go" type="submit">Voir mon parcours</button>';
      function val(n) { var x = form.querySelector('input[name="' + n + '"]:checked'); return x ? x.value : null; }
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var r1 = val("q1"), r2 = val("q2"), r3 = val("q3");
        form.querySelector(".err").hidden = !!(r1 && r2 && r3);
        if (!(r1 && r2 && r3)) return;
        var L = orienter(r1, r2, r3);
        res.hidden = false; res.className = (res.className.indexOf("efa-quiz-res") < 0 ? res.className + " " : res.className) + "efa-quiz-res";
        res.innerHTML = "<strong>Commencez par : « " + esc(P[L[0]].probleme) + " »</strong><ol>"
          + L.map(function (id) { return '<li><a href="' + esc(lien(id, L)) + '" data-pb-ouvrir="' + id + '">' + esc(nomCourt(id)) + " · " + esc(P[id].titre) + "</a></li>"; }).join("")
          + '</ol><a class="go" style="align-self:flex-start;display:inline-flex;align-items:center;min-height:44px;padding:10px 20px;border-radius:8px;font-weight:800" href="' + esc(lien(L[0], L)) + '" data-pb-ouvrir="' + L[0] + '">Ouvrir ce parcours</a>'
          + '<small>Un doute ? <a href="diagnostic.html?src=parcours-quiz">Le diagnostic gratuit (6 min)</a> creuse votre situation et vous donne votre profil.</small>';
        try { var s = JSON.parse(localStorage.getItem("efa_parcours_v1") || "{}") || {}; s.quiz = L; localStorage.setItem("efa_parcours_v1", JSON.stringify(s)); } catch (x) {}
        mesure("quiz-" + L[0]);
        if (opts.resultat) opts.resultat(L);
        res.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      if (opts.ouvrir) res.addEventListener("click", function (e) { var a = e.target.closest("[data-pb-ouvrir]"); if (a) { e.preventDefault(); opts.ouvrir(a.getAttribute("data-pb-ouvrir")); } });
    }
  };
})();
