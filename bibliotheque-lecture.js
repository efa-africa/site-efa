/* La bibliothèque EFA : lecteur des fiches au format statut (plein écran, comme la démo de l'école).
   Toucher à droite : écran suivant ; à gauche : écran précédent ; glisser du doigt ; flèches du clavier.
   Musique douce composée pour EFA (demo-musique.mp3), qui démarre au premier toucher et se coupe d'un geste.
   Données : window.EFA_LIVRES (bibliotheque-livres.js). Ouvrir : EFA_BIBLIO.ouvrir("babylone") ou bibliotheque.html?livre=babylone */
(function () {
  "use strict";
  var L = window.EFA_LIVRES || [];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function compte(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function lu(id, v) { try { var o = JSON.parse(localStorage.getItem("efa_biblio") || "{}") || {}; if (v != null) { o[id] = Math.max(o[id] || 0, v); localStorage.setItem("efa_biblio", JSON.stringify(o)); } return id ? o[id] : o; } catch (e) { return id ? 0 : {}; } }

  /* ---------- Musique (même principe que la démo) ---------- */
  var MUS = (function () {
    var au = null, on = false;
    return {
      start: function () { if (!au) { au = new Audio("demo-musique.mp3"); au.loop = true; au.preload = "auto"; au.volume = 0.6; } on = true; var p = au.play(); if (p && p.catch) p.catch(function () { on = false; majSon(); }); },
      stop: function () { on = false; if (au) au.pause(); },
      actif: function () { return on; }
    };
  })();
  var coupe = false;
  try { coupe = localStorage.getItem("efa_biblio_son") === "off"; } catch (e) {}

  var CSS = ".efb{position:fixed;inset:0;z-index:10000;background:#0B1220;color:#E8EDF5;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif;display:flex;flex-direction:column;-webkit-text-size-adjust:100%;user-select:none;-webkit-user-select:none}"
    + ".efb *{box-sizing:border-box}.efb h1,.efb h2{font-family:'Libre Baskerville',Baskerville,Georgia,serif;font-weight:700;line-height:1.14;margin:0;text-wrap:balance;color:#fff}.efb p{margin:0}"
    + ".efb .bars{display:flex;gap:4px;padding:calc(12px + env(safe-area-inset-top,0px)) 16px 0}.efb .bars i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.22);overflow:hidden}.efb .bars i b{display:block;height:100%;width:0;background:#fff;transition:width .35s}.efb .bars i.done b{width:100%}"
    + ".efb .head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px}.efb .brand{display:flex;align-items:center;gap:10px;color:#fff;font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;min-width:0}.efb .brand img{width:30px;height:30px}"
    + ".efb .ctl{display:flex;gap:8px}.efb .ctl button{min-width:44px;min-height:40px;border:0;border-radius:999px;background:rgba(255,255,255,.1);color:#fff;font:700 14px 'Source Sans 3',system-ui,sans-serif;padding:0 14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}"
    + ".efb .ctl .son[aria-pressed=false]{background:#DA3C1B}.efb .ctl .son[aria-pressed=false] .w{opacity:.35}"
    + ".efb .stage{position:relative;flex:1;overflow:hidden}"
    + ".efb .scene{position:absolute;inset:0;display:flex;justify-content:center;align-items:center;padding:12px 22px 96px;text-align:center;opacity:0;visibility:hidden;transition:opacity .35s;overflow:auto}.efb .scene.on{opacity:1;visibility:visible}"
    + ".efb .in{width:100%;max-width:620px;display:grid;gap:18px;justify-items:center;margin:auto}"
    + ".efb .k{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#F09680}.efb .big{font-size:clamp(28px,6.6vw,50px)}.efb .big em{font-style:normal;color:#EC6243}.efb .mid{font-size:clamp(23px,4.8vw,36px)}"
    + ".efb .lead{font-size:clamp(17px,2.3vw,20px);line-height:1.5;color:#C9D1DE;max-width:540px}.efb .lead b{color:#fff}"
    + ".efb .num{font-family:'Libre Baskerville',Georgia,serif;font-weight:700;font-size:clamp(56px,14vw,96px);line-height:1;color:#EC6243}"
    + ".efb .livre{display:block;width:min(46vw,190px);height:auto;aspect-ratio:2/3;object-fit:cover;border-radius:6px 12px 12px 6px;box-shadow:0 18px 40px rgba(0,0,0,.45);background:#F5EFE2}"
    + ".efb .livre b{font-family:'Libre Baskerville',Georgia,serif;font-size:clamp(15px,3.4vw,19px);line-height:1.25;color:#fff}.efb .livre small{font-size:12px;color:#E8EDF5;opacity:.85;letter-spacing:.06em}.efb .livre i{display:block;width:40px;height:40px;margin:0 auto;border-radius:50%}"
    + ".efb .carte{background:#111B2F;border-radius:14px;padding:16px 18px;text-align:left;width:100%;max-width:540px;font-size:16.5px;line-height:1.5;color:#C9D1DE}.efb .carte b{color:#fff}"
    + ".efb .carte.clair{background:#F5EFE2;color:#2A3142}.efb .carte.clair b{color:#0B1220}.efb .carte .lbl{display:block;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#F09680;margin-bottom:6px}.efb .carte.clair .lbl{color:#B8341A}"
    + ".efb .liste{display:grid;gap:10px;width:100%;max-width:540px;text-align:left}.efb .liste div{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;background:#111B2F;border-radius:12px;padding:12px 14px;font-size:16px;line-height:1.45;color:#C9D1DE}.efb .liste div b{color:#fff}"
    + ".efb .liste .ok::before{content:'✓';color:#3CCB7F;font-weight:800;font-size:18px}.efb .liste .ko::before{content:'✕';color:#EC6243;font-weight:800;font-size:18px}"
    + ".efb .koffi{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;max-width:540px}.efb .koffi div{background:#111B2F;border-radius:12px;padding:12px 8px;text-align:center}.efb .koffi small{display:block;font-size:12px;font-weight:700;color:#C9D1DE;text-transform:uppercase;letter-spacing:.05em}.efb .koffi b{display:block;font-family:'Libre Baskerville',Georgia,serif;font-size:clamp(17px,4.4vw,24px);color:#fff;margin-top:4px}.efb .koffi .g{background:#DA3C1B}.efb .koffi .g small{color:#fff}"
    + ".efb .opts{display:grid;gap:10px;width:100%;max-width:520px}.efb .opt{all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:12px;align-items:center;text-align:left;background:#111B2F;border-radius:14px;padding:14px 16px;min-height:56px;font-size:17px;font-weight:700;color:#fff}"
    + ".efb .opt .l{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.1);font-weight:800;font-size:14px}.efb .opt.ok{background:#3CCB7F;color:#0B1220}.efb .opt.ko{background:#DA3C1B}.efb .opt[disabled]{cursor:default}.efb .opt:focus-visible{outline:3px solid #6DB8F2;outline-offset:2px}"
    + ".efb .exp{background:#F5EFE2;color:#2A3142;border-radius:14px;padding:12px 16px;text-align:left;font-size:16px;line-height:1.5;width:100%;max-width:520px}.efb .exp b{color:#0B1220}"
    + ".efb .cta{display:grid;gap:10px;width:100%;max-width:420px}.efb .btn{display:flex;align-items:center;justify-content:center;text-align:center;min-height:54px;padding:12px 22px;border-radius:12px;font:800 17px 'Source Sans 3',system-ui,sans-serif;text-decoration:none;border:0;cursor:pointer}"
    + ".efb .btn-main{background:#DA3C1B;color:#fff}.efb .btn-clair{background:#F5EFE2;color:#0B1220}.efb .btn-ghost{background:transparent;color:#fff;text-decoration:underline;text-underline-offset:5px;min-height:44px}"
    + ".efb .mention{font-size:13px;line-height:1.5;color:#8E98AA;max-width:540px}"
    + ".efb .efb-nav{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;padding:12px 16px calc(14px + env(safe-area-inset-bottom,0px));background:linear-gradient(to top,#0B1220 60%,rgba(11,18,32,0));z-index:4;pointer-events:none}.efb .efb-nav button{pointer-events:auto}"
    + ".efb .efb-nav button{min-height:48px;border:0;border-radius:12px;font:800 16px 'Source Sans 3',system-ui,sans-serif;padding:0 18px;cursor:pointer}.efb .efb-nav .p{background:rgba(255,255,255,.1);color:#fff}.efb .efb-nav .s{background:#DA3C1B;color:#fff;flex:1;max-width:260px;margin-left:auto}.efb .efb-nav button[disabled]{opacity:.35;cursor:default}"
    + ".efb .efb-nav .astuce{font-size:13px;color:#8E98AA}"
    + ".efb .scene.on .up{animation:efbUp .5s both}.efb .scene.on .d1{animation-delay:.15s}.efb .scene.on .d2{animation-delay:.35s}.efb .scene.on .d3{animation-delay:.55s}.efb .scene.on .d4{animation-delay:.75s}"
    + "@keyframes efbUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.efb .scene.on .up{animation:none}}"
    + "@media (max-width:400px){.efb .brand span{display:none}.efb .ctl button{padding:0 12px}.efb .efb-nav .astuce{display:none}}";

  var el, B, S, i, qi, bonnes;
  function majSon() {
    var b = el && el.querySelector(".son"); if (!b) return; var o = MUS.actif();
    b.setAttribute("aria-pressed", String(o)); b.setAttribute("aria-label", o ? "Couper la musique" : "Activer la musique"); b.querySelector("span").textContent = o ? "Son" : "Son coupé";
  }
  function ideeHtml(x, k, court) {
    var h = '<p class="k up">' + (court ? "L’idée clé" : "Idée " + (k + 1) + " sur 5") + '</p><h2 class="mid up d1">' + x[0] + '</h2><p class="lead up d2">' + x[1] + "</p>";
    if (x[2]) h += '<div class="koffi up d3"><div><small>' + x[2][0] + "</small><b>" + x[2][1] + '</b></div><div class="g"><small>' + x[2][2] + "</small><b>" + x[2][3] + "</b></div><div><small>" + x[2][4] + "</small><b>" + x[2][5] + "</b></div></div>";
    return h;
  }
  // court : l'essentiel en 4 écrans (la phrase, l'idée clé, ce qui ne marche pas ici, la décision) ; sinon la fiche complète
  function scenes(b, court) {
    var s = [];
    s.push('<p class="k up">La bibliothèque EFA · n° ' + b.n + '</p><img class="livre up d1" src="bibliotheque/couv-' + b.id + '-400.webp" srcset="bibliotheque/couv-' + b.id + '-400.webp 400w, bibliotheque/couv-' + b.id + '-800.webp 800w" sizes="190px" width="400" height="600" alt="' + esc(b.titre + ", " + b.auteur) + '"><h1 class="mid up d2">Les idées essentielles, en format statut</h1><p class="lead up d3">Ce qu’il dit, ce qui marche chez nous, ce qui ne marche pas. Et une décision à prendre cette semaine.</p>');
    s.push('<p class="k up">Le livre en une phrase</p><h2 class="big up d1">' + b.phrase + '</h2><p class="lead up d2">' + b.phraseSuite + "</p>");
    b.idees.forEach(function (x, k) { s.push(ideeHtml(x, k)); });
    s.push('<p class="k up">Ce qui marche ici</p><div class="liste">' + b.marche.map(function (x, k) { return '<div class="ok up d' + (k + 1) + '"><span><b>' + x[0] + "</b> " + x[1] + "</span></div>"; }).join("") + "</div>");
    s.push('<p class="k up">Ce qui ne marche pas tel quel</p><div class="liste">' + b.pasIci.map(function (x, k) { return '<div class="ko up d' + (k + 1) + '"><span><b>' + x[0] + "</b> " + x[1] + "</span></div>"; }).join("") + "</div>");
    s.push('<p class="k up">Ce qu’EFA en retient, et n’en retient pas</p><div class="carte clair up d1"><span class="lbl">On garde</span>' + b.garde + '</div><div class="carte up d2"><span class="lbl">On nuance</span>' + b.nuance + "</div>");
    var deci = '<p class="k up">Votre décision cette semaine</p><h2 class="mid up d1">' + b.decision[0] + '</h2><p class="lead up d2">' + b.decision[1] + '</p><div class="cta up d3"><a class="btn btn-main" href="parcours.html?src=bibliotheque#' + b.modules[0][0] + '">Passer à l’action : « ' + esc(b.modules[0][1]) + ' »</a></div>';
    if (court) return [s[1], ideeHtml(b.idees[0], 0, true), s[s.length - 2], deci + '<div class="cta up d4"><button type="button" class="btn btn-clair" data-b="complet">Voir la fiche complète · ' + (b.idees.length + 8) + ' écrans</button></div>'];
    s.push(deci);
    s.push('<div class="quiz" style="display:grid;gap:18px;justify-items:center;width:100%"></div>');
    var autre = L.filter(function (x) { return x.id !== b.id; })[b.n % (L.length - 1)];
    s.push('<p class="k up">Et maintenant</p><h2 class="mid up d1">Passez du livre à vos chiffres.</h2><div class="cta up d2">'
      + b.modules.map(function (m, k) { return '<a class="btn ' + (k ? "btn-clair" : "btn-main") + '" href="parcours.html?src=bibliotheque#' + m[0] + '">' + (k ? "Ou " : "Ouvrir le module ") + "« " + esc(m[1]) + " »</a>"; }).join("")
      + (autre ? '<button type="button" class="btn btn-ghost" data-b="livre" data-id="' + autre.id + '">Fiche suivante : ' + esc(autre.titre) + "</button>" : "")
      + '<button type="button" class="btn btn-ghost" data-b="biblio">Toute la bibliothèque</button></div>'
      + '<p class="mention up d3">Fiche de lecture rédigée par EFA avec l’aide de l’intelligence artificielle et vérifiée par l’équipe : idées reformulées, sans reproduction du texte. Le livre est disponible en librairie et en ligne. Les personnages et montants d’exemple sont fictifs. Éducation financière, pas conseil en placement.</p>');
    return s;
  }
  function quiz() {
    var z = el.querySelector(".scene.on .quiz"); if (!z) return; var Q = B.quiz, suiv = el.querySelector(".efb-nav .s");
    if (qi >= Q.length) { z.innerHTML = '<p class="k">Votre score</p><div class="num">' + bonnes + ' / 3</div><h2 class="mid">' + (bonnes === 3 ? "Vous avez tout retenu." : "Une relecture, et c’est acquis.") + "</h2>"; suiv.disabled = false; lu(B.id, bonnes + 1); compte("biblio-" + B.id + "-quiz-" + bonnes); return; }
    var q = Q[qi]; suiv.disabled = true;
    z.innerHTML = '<p class="k">Quiz · question ' + (qi + 1) + ' sur 3</p><h2 class="mid">' + q[0] + '</h2><div class="opts">' + q[1].map(function (r, k) { return '<button type="button" class="opt" data-r="' + k + '"><span class="l">' + "ABC"[k] + "</span><span>" + r + "</span></button>"; }).join("") + "</div>";
  }
  function repondre(k) {
    var z = el.querySelector(".scene.on .quiz"), q = B.quiz[qi]; if (!z || z.querySelector(".exp")) return;
    var bon = k === q[2]; if (bon) bonnes++;
    z.querySelectorAll(".opt").forEach(function (o, j) { o.disabled = true; if (j === q[2]) o.classList.add("ok"); else if (j === k) o.classList.add("ko"); });
    var d = document.createElement("div"); d.style.cssText = "display:grid;gap:10px;width:100%;justify-items:center";
    d.innerHTML = '<p class="exp"><b>' + (bon ? "Bonne réponse." : "Pas tout à fait.") + "</b> " + q[3] + '</p><div class="cta"><button type="button" class="btn btn-clair" data-b="qsuite">' + (qi < 2 ? "Question suivante" : "Voir mon score") + "</button></div>";
    z.appendChild(d);
  }
  function aller(n) {
    if (n < 0 || n >= S.length) return; i = n;
    el.querySelectorAll(".scene").forEach(function (s, k) { s.classList.toggle("on", k === i); if (k === i) s.scrollTop = 0; });
    el.querySelectorAll(".bars i").forEach(function (b, k) { b.classList.toggle("done", k <= i); });
    var p = el.querySelector(".efb-nav .p"), s = el.querySelector(".efb-nav .s");
    p.disabled = i === 0; s.hidden = i === S.length - 1; s.disabled = false;
    if (el.querySelector(".scene.on .quiz")) { if (qi === 0 && bonnes === 0 && !el.querySelector(".scene.on .quiz").innerHTML) quiz(); else if (qi < B.quiz.length) s.disabled = true; }
    if (i === S.length - 1) lu(B.id, Math.max(lu(B.id) || 0, 1));
    compte("biblio-" + B.id + "-ecran-" + (i + 1));
  }
  function suivant() { var s = el.querySelector(".efb-nav .s"); if (!s.disabled && !s.hidden) aller(i + 1); }
  function ouvrir(id, complet) {
    B = L.filter(function (x) { return x.id === id; })[0]; if (!B) return; var court = !complet;
    if (!document.getElementById("efb-css")) { var st = document.createElement("style"); st.id = "efb-css"; st.textContent = CSS; document.head.appendChild(st); }
    S = scenes(B, court); i = 0; qi = 0; bonnes = 0;
    if (el && el.parentNode) el.parentNode.removeChild(el);
    el = document.createElement("div"); el.className = "efb"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Fiche de lecture : " + B.titre);
    el.innerHTML = '<div class="bars" aria-hidden="true">' + S.map(function () { return "<i><b></b></i>"; }).join("") + "</div>"
      + '<div class="head"><span class="brand"><img src="logo-efa-96.png" alt="" width="30" height="30"><span>La bibliothèque EFA</span></span><div class="ctl">'
      + '<button type="button" class="son" aria-pressed="false" aria-label="Activer la musique"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path class="w" d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg><span>Son</span></button>'
      + '<button type="button" data-b="partager" aria-label="Partager cette fiche">Partager</button><button type="button" data-b="fermer">Fermer</button></div></div>'
      + '<div class="stage">' + S.map(function (h, k) { return '<section class="scene" aria-label="Écran ' + (k + 1) + '"><div class="in">' + h + "</div></section>"; }).join("")
      + '<div class="efb-nav"><button type="button" class="p" aria-label="Écran précédent">←</button><span class="astuce">Touchez l’écran pour avancer</span><button type="button" class="s">Suivant →</button></div></div>';
    document.body.appendChild(el); document.documentElement.style.overflow = "hidden";
    try { history.replaceState(null, "", location.pathname + "?livre=" + B.id + (court ? "" : "&fiche=complete")); } catch (e) {}
    var stage = el.querySelector(".stage");
    // Toucher : à gauche (un tiers) pour revenir, ailleurs pour avancer ; jamais sur un bouton ou un lien
    stage.addEventListener("click", function (e) {
      var t = e.target.closest("button, a, .opt, .exp, .carte");
      if (t) {
        if (t.classList.contains("opt") && !t.disabled) return repondre(+t.getAttribute("data-r"));
        var a = t.getAttribute && t.getAttribute("data-b");
        if (a === "qsuite") { qi++; quiz(); }
        else if (a === "livre") ouvrir(t.getAttribute("data-id"), true);
        else if (a === "complet") { compte("biblio-" + B.id + "-complet"); ouvrir(B.id, true); }
        else if (a === "biblio") fermer();
        else if (t.classList.contains("p")) aller(i - 1);
        else if (t.classList.contains("s")) suivant();
        if (t.classList.contains("carte") || t.classList.contains("exp")) { /* lecture : on laisse le toucher avancer */ } else return;
      }
      var r = stage.getBoundingClientRect(); if (e.clientX - r.left < r.width / 3) aller(i - 1); else suivant();
    });
    var x0 = null;
    stage.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) < 60) return; if (dx < 0) suivant(); else aller(i - 1); }, { passive: true });
    el.querySelector(".head").addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.classList.contains("son")) { if (MUS.actif()) { MUS.stop(); coupe = true; } else { MUS.start(); coupe = false; } try { localStorage.setItem("efa_biblio_son", coupe ? "off" : "on"); } catch (x) {} majSon(); compte("biblio-son-" + (coupe ? "off" : "on")); return; }
      var a = t.getAttribute("data-b");
      if (a === "fermer") fermer();
      if (a === "partager") {
        var u = location.origin + location.pathname + "?livre=" + B.id + "&src=partage", tx = "« " + B.titre + " » : les idées essentielles, version Afrique. Ce qui marche chez nous, ce qui ne marche pas. ";
        compte("biblio-" + B.id + "-partage");
        if (navigator.share) navigator.share({ title: "La bibliothèque EFA", text: tx, url: u }).catch(function () {});
        else window.open("https://wa.me/?text=" + encodeURIComponent(tx + u), "_blank", "noopener");
      }
    });
    // La musique démarre au premier toucher (les navigateurs l'exigent), sauf si elle a été coupée
    var premier = function (e) { if (!coupe && !MUS.actif() && !(e.target.closest && e.target.closest(".son"))) { MUS.start(); majSon(); } el.removeEventListener("pointerdown", premier, true); };
    el.addEventListener("pointerdown", premier, true);
    if (!coupe) { MUS.start(); }
    majSon(); aller(0); compte("biblio-" + B.id + (court ? "-court" : "-complet"));
  }
  function fermer() {
    MUS.stop(); if (el && el.parentNode) el.parentNode.removeChild(el); el = null; document.documentElement.style.overflow = "";
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    if (window.EFA_BIBLIO.apresFermer) window.EFA_BIBLIO.apresFermer();
  }
  document.addEventListener("keydown", function (e) { if (!el) return; if (e.key === "ArrowRight") suivant(); if (e.key === "ArrowLeft") aller(i - 1); if (e.key === "Escape") fermer(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden && el) { MUS.stop(); majSon(); } });
  window.EFA_BIBLIO = { ouvrir: ouvrir, fermer: fermer, lu: lu };
})();
