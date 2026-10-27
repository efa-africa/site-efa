/* EFA · École de la Bourse · moteur des écrans d'apprentissage
   Utilisé par bourse-essentiel.html (parcours A) et bourse-pro.html (parcours B).
   La page définit window.ECOLE = {cle, titre, label, modules:[…], accueil:{…}} avant de charger ce fichier.
   Écrans d'un module : {t:'info'|'choix'|'perso', sur, h, p:[…], illu:{c,html}|{photo,leg}, opts:[[lettre,texte,'ok'|'ko'|'mo',explication]], rendu(ctx), apres(ctx)}
   Quiz : [[question, [[lettre,texte],…], bonne lettre, explication], …] — validé à 3 sur 5.
   Adresse : #A1, #B3… ouvre un module ; sans ancre, le sommaire. Progression gardée sur l'appareil, rien n'est envoyé. */
(function () {
  "use strict";
  var EC = window.ECOLE, $ = function (i) { return document.getElementById(i); };
  var NB = " ";
  function typo(s) {
    return String(s).replace(/ ([:;?!»%])/g, "&nbsp;$1").replace(/« /g, "«&nbsp;").replace(/([≈+−]) (?=\d)/g, "$1&nbsp;")
      .replace(/(\d) (?=\d{3}\b)/g, "$1&nbsp;").replace(/(\d) h (\d)/g, "$1&nbsp;h&nbsp;$2").replace(/(\d) h\b/g, "$1&nbsp;h").replace(/(\d) (F|FCFA|Md|ans?|mois|jours?|titres?|actions?|séances?|points?)\b/g, "$1&nbsp;$2");
  }
  var F = function (n) { return (n < 0 ? "− " : "") + Math.abs(Math.round(n)).toLocaleString("fr-FR").replace(/[   ]/g, NB) + NB + "F"; };
  var PC = function (x, d) { d = d == null ? 1 : d; return (x < 0 ? "−" + NB : "") + (Math.round(Math.abs(x) * Math.pow(10, d)) / Math.pow(10, d)).toString().replace(".", ",") + NB + "%"; };
  var N = function (id) { var t = String(($(id) || {}).value || "").replace(/[^\d]/g, ""); return t === "" ? null : +t; };
  function compte(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  EC.outils = { F: F, PC: PC, N: N, typo: typo, compte: compte };

  /* ---------- État ---------- */
  var etat = { m: {} };
  try { var s = localStorage.getItem(EC.cle); if (s) etat = JSON.parse(s); } catch (e) {}
  if (!etat.m) etat.m = {};
  function sauver() { try { localStorage.setItem(EC.cle, JSON.stringify(etat)); } catch (e) {} }
  function st(id) { return etat.m[id] || (etat.m[id] = { i: 0, r: {}, q: {} }); }
  function mod(id) { return EC.modules.filter(function (m) { return m.id === id; })[0]; }

  /* ---------- Écrans d'un module ---------- */
  function ecrans(M) {
    var L = M.ecrans.slice();
    (M.quiz || []).forEach(function (q, k) { L.push({ t: "quiz", k: k }); });
    L.push({ t: "fin" });
    return L;
  }
  function illu(I) {
    if (!I) return "";
    if (I.photo) return '<figure class="illu photo"><img src="certificat-pilote/' + I.photo + '" alt=""><figcaption class="legende">' + typo(I.leg || "") + "</figcaption></figure>";
    return '<div class="illu ' + (I.c || "nuit") + (I.accueil ? " accueil" : "") + '">' + typo(I.html) + "</div>";
  }
  function paras(p) { return (p || []).map(function (x) { return '<p class="p">' + typo(x) + "</p>"; }).join(""); }
  function melange(liste, graine) {
    var L = liste.slice(), x = 0;
    for (var c = 0; c < graine.length; c++) x = (x * 31 + graine.charCodeAt(c)) % 2147483647;
    for (var i = L.length - 1; i > 0; i--) { x = (x * 16807) % 2147483647; var j = x % (i + 1), t = L[i]; L[i] = L[j]; L[j] = t; }
    return L;
  }
  function opts(cle, liste, rep, bonne, graine) {
    var h = '<div class="opts">';
    if (graine) liste = melange(liste, graine);
    liste.forEach(function (o, n) {
      var cl = "";
      if (rep) { if (bonne) cl = o[0] === bonne ? " ok" : (o[0] === rep ? " ko" : ""); else cl = o[0] === rep ? " " + o[2] : ""; }
      h += '<button class="opt' + cl + '" type="button" data-cle="' + cle + '" data-v="' + o[0] + '"' + (rep ? " disabled" : "") + '><span class="l">' + (graine ? "ABCDE".charAt(n) : o[0]) + '</span><span class="t">' + typo(o[1]) + "</span></button>";
    });
    return h + "</div>";
  }
  function rendreEcran(M, E, idx) {
    var S = st(M.id), ctx = { M: M, S: S, etat: etat, sauver: sauver, refaire: function () { aller(M.id, S.i); } };
    if (E.t === "info") return illu(E.illu) + '<div class="texte"><p class="sur">' + typo(E.sur || "") + '</p><h2 class="h">' + typo(E.h) + "</h2>" + paras(E.p) + (E.plus ? typo(E.plus) : "") + "</div>";
    if (E.t === "choix") {
      var cle = "e" + idx, rep = S.r[cle], o = rep && E.opts.filter(function (x) { return x[0] === rep; })[0];
      return illu(E.illu) + '<div class="texte"><p class="sur">' + typo(E.sur || "Décider") + '</p><div class="q"><p class="enonce">' + typo(E.h) + "</p>" + opts(cle, E.opts, rep) + (o ? '<p class="explic">' + typo(o[3]) + "</p>" : "") + "</div></div>";
    }
    if (E.t === "perso") { var h = E.rendu(ctx); if (E.apres) setTimeout(function () { E.apres(ctx); }, 0); return h; }
    if (E.t === "quiz") {
      var q = M.quiz[E.k], cq = "q" + E.k, rq = S.q[cq];
      return '<div class="illu nuit"><span class="tabtitre">Quiz · ' + typo(M.court) + '</span><div class="score">' + (E.k + 1) + ' / ' + M.quiz.length + '</div><span class="mot">Trois bonnes réponses sur cinq valident le module.</span></div>' +
        '<div class="texte"><p class="qnum">Question ' + (E.k + 1) + "</p><div class=\"q\"><p class=\"enonce\">" + typo(q[0]) + "</p>" + opts(cq, q[1], rq, q[2], M.id + "-" + E.k) +
        (rq ? '<p class="explic"><b>' + (rq === q[2] ? "Juste." : "Pas tout à fait.") + "</b> " + typo(q[3]) + "</p>" : "") + "</div></div>";
    }
    if (E.t === "fin") {
      var nq = (M.quiz || []).length, sc = (M.quiz || []).filter(function (q, k) { return S.q["q" + k] === q[2]; }).length, ok = nq ? sc >= 3 : true;
      if (ok && !S.valide) { S.valide = true; S.score = sc; sauver(); compte("ecole-" + M.id + "-valide"); }
      var k = EC.modules.indexOf(M), suiv = EC.modules[k + 1];
      return '<div class="illu ' + (ok ? "bleu" : "nuit") + '">' + (nq ? '<span class="tabtitre">Votre score</span><div class="score">' + sc + " / " + nq + '</div><span class="mot">' + (ok ? "Module validé" : "Trois bonnes réponses sont nécessaires") + "</span>" : '<span class="tabtitre">Projet</span><div class="grand">Terminé</div>') + "</div>" +
        '<div class="texte"><p class="sur">' + typo(M.court) + '</p><h2 class="h">' + (ok ? "Ce qu’il faut garder" : "Encore un essai") + '</h2><div class="aplat">' + typo(M.retenir) + "</div>" +
        '<div class="liens">' + (ok ? "" : '<a href="#' + M.id + '" data-refaire="' + M.id + '">Refaire le quiz <span>→</span></a>') +
        (suiv ? '<a href="#' + suiv.id + '">Module suivant&nbsp;: ' + typo(suiv.titre) + " <span>→</span></a>" : (EC.final ? typo(EC.final) : "")) +
        '<a href="#">Retour au sommaire <span>→</span></a></div></div>';
    }
    return "";
  }

  /* ---------- Sommaire ---------- */
  function sommaire() {
    var A = EC.accueil, faits = EC.modules.filter(function (m) { return st(m.id).valide; }).length;
    var tu = EC.modules.map(function (m) {
      var S = st(m.id), e = S.valide ? ((m.quiz || []).length ? "Validé · " + S.score + "/5" : "Terminé") : (S.i ? "En cours" : m.duree);
      return '<button class="tuile-m' + (S.valide ? " fait" : "") + '" type="button" data-mod="' + m.id + '"><span class="n">' + m.id + '</span><span class="tt">' + typo(m.titre) + '</span><span class="e">' + typo(e) + "</span></button>";
    }).join("");
    return '<div class="illu nuit accueil"><img class="logo" src="certificat-pilote/logo-efa.png" alt=""><span class="tabtitre">' + typo(A.sur) + '</span><div class="grand">' + typo(A.titre) + '</div><span class="mot">' + faits + " module" + (faits > 1 ? "s" : "") + " validé" + (faits > 1 ? "s" : "") + " sur " + EC.modules.length + "</span>" +
      (Object.keys(etat.m).length ? '<button class="raz" id="raz" type="button">Recommencer le parcours</button>' : "") + "</div>" +
      '<div class="texte"><p class="sur">' + typo(A.kick) + '</p><h2 class="h hs">' + typo(A.h) + "</h2>" + paras(A.p) + '<div class="tuiles-m">' + tu + "</div>" + (A.plus ? typo(A.plus) : "") + "</div>";
  }

  /* ---------- Navigation ---------- */
  var corps = $("corps"), prog = $("progres"), cur = null;
  function bloque(M, E, idx) {
    var S = st(M.id);
    if (E.t === "choix") return !S.r["e" + idx];
    if (E.t === "quiz") return !S.q["q" + E.k];
    if (E.t === "perso" && E.bloque) return E.bloque({ M: M, S: S });
    return false;
  }
  function aller(id, i, focus) {
    var M = id && mod(id);
    if (!M) {
      cur = null; corps.innerHTML = sommaire(); prog.innerHTML = ""; prog.hidden = true;
      $("titre").textContent = EC.titre; $("compteur").textContent = ""; $("duree").textContent = "";
      $("som").hidden = true; $("prec").hidden = true;
      var prem = EC.modules.filter(function (m) { return !st(m.id).valide; })[0] || EC.modules[0];
      $("suiv").textContent = (st(prem.id).i ? "Reprendre " : "Commencer ") + prem.id; $("suiv").setAttribute("aria-disabled", "false"); $("suiv").dataset.vers = prem.id;
      var r = $("raz"); if (r) r.addEventListener("click", function () { etat = { m: {} }; sauver(); aller(null); });
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
      return;
    }
    var L = ecrans(M), S = st(M.id);
    S.i = Math.max(0, Math.min(i == null ? S.i : i, L.length - 1)); sauver(); cur = M;
    if (location.hash !== "#" + M.id) history.replaceState(null, "", "#" + M.id);
    corps.innerHTML = rendreEcran(M, L[S.i], S.i);
    prog.hidden = false;
    if (prog.children.length !== L.length || prog.dataset.m !== M.id) {
      prog.innerHTML = ""; prog.dataset.m = M.id; prog.style.gridTemplateColumns = "repeat(" + L.length + ",1fr)";
      L.forEach(function (e, k) { var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Écran " + (k + 1)); b.addEventListener("click", function () { if (k <= accessible(M)) aller(M.id, k, true); }); prog.appendChild(b); });
    }
    [].forEach.call(prog.children, function (b, k) { b.classList.toggle("fait", k <= S.i); b.setAttribute("aria-current", k === S.i ? "step" : "false"); });
    $("titre").textContent = EC.label + " · " + M.id + " · " + M.court;
    $("compteur").textContent = (S.i + 1) + " / " + L.length;
    $("duree").textContent = M.duree;
    $("som").hidden = false; $("prec").hidden = false;
    $("prec").setAttribute("aria-disabled", S.i === 0 ? "true" : "false");
    var fin = S.i === L.length - 1, bl = bloque(M, L[S.i], S.i);
    var suiv = EC.modules[EC.modules.indexOf(M) + 1];
    $("suiv").textContent = fin ? (suiv ? "Module " + suiv.id : "Sommaire") : "Suivant";
    $("suiv").dataset.vers = "";
    $("suiv").setAttribute("aria-disabled", bl ? "true" : "false");
    $("suiv").title = bl ? "Répondez pour continuer" : "";
    if (bl) consigne(L[S.i]);
    if (focus) {
      var t = corps.querySelector(".h,.enonce"); if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
      var c = document.querySelector(".cadre"); if (c && c.getBoundingClientRect().top < 0) c.scrollIntoView({ block: "start" });
    }
  }
  /* Consigne visible quand une réponse est attendue : on ne reste jamais devant un bouton grisé sans savoir quoi faire */
  function consigne(E) {
    var t = E.t === "perso" ? (E.consigne || "Choisissez une réponse <span class=\"c-l\">dans la zone de gauche</span><span class=\"c-p\">ci-dessus</span>, puis touchez Suivant.") : "Choisissez une réponse ci-dessous, puis touchez Suivant.";
    var d = document.createElement("p"); d.className = "consigne"; d.setAttribute("role", "status");
    d.innerHTML = '<b aria-hidden="true">À vous</b> ' + t;
    var x = corps.querySelector(".texte .q") || corps.querySelector(".texte");
    if (x) { var h = x.querySelector(".enonce") || x.querySelector(".h"); if (h && h.nextSibling) h.parentNode.insertBefore(d, h.nextSibling); else x.appendChild(d); }
  }
  function rappelConsigne() {
    var d = corps.querySelector(".consigne"); if (!d) return;
    d.classList.remove("flash"); void d.offsetWidth; d.classList.add("flash");
    var cible = corps.querySelector(".opt:not([disabled]), .act-l button, .rep-types button, .illu input, .illu button");
    if (cible) { cible.classList.add("vise"); setTimeout(function () { cible.classList.remove("vise"); }, 1600); if (cible.scrollIntoView) cible.scrollIntoView({ block: "nearest" }); }
  }
  function accessible(M) { var L = ecrans(M); for (var k = 0; k < L.length; k++) if (bloque(M, L[k], k)) return k; return L.length - 1; }

  corps.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-mod]"); if (t) { compte("ecole-" + t.dataset.mod + "-ouvre"); aller(t.dataset.mod, null, true); return; }
    var rf = ev.target.closest("[data-refaire]");
    if (rf) { ev.preventDefault(); var M0 = mod(rf.dataset.refaire), S0 = st(M0.id); S0.q = {}; sauver(); aller(M0.id, M0.ecrans.length, true); return; }
    var a = ev.target.closest('a[href^="#"]');
    if (a) { ev.preventDefault(); var h = a.getAttribute("href").slice(1); aller(h || null, null, true); return; }
    var b = ev.target.closest(".opt"); if (!b || b.disabled || !cur) return;
    var S = st(cur.id), c = b.dataset.cle;
    if (c.charAt(0) === "q") { S.q[c] = b.dataset.v; var qq = (cur.quiz || [])[+c.slice(1)]; if (qq && window.EFA_SONS) EFA_SONS.joue(b.dataset.v === qq[2] ? "bon" : "faux"); } else S.r[c] = b.dataset.v;
    sauver(); compte("ecole-" + cur.id + "-" + c + "-" + b.dataset.v);
    aller(cur.id, S.i);
    var x = corps.querySelector(".explic"); if (x && x.scrollIntoView) x.scrollIntoView({ block: "nearest" });
  });
  $("prec").addEventListener("click", function () { if (cur && st(cur.id).i > 0) aller(cur.id, st(cur.id).i - 1, true); });
  $("som").addEventListener("click", function () { aller(null); });
  $("suiv").addEventListener("click", function () {
    if (!cur) { aller(this.dataset.vers, null, true); return; }
    var L = ecrans(cur), S = st(cur.id);
    if (bloque(cur, L[S.i], S.i)) { rappelConsigne(); return; }
    if (S.i === L.length - 1) { var n = EC.modules[EC.modules.indexOf(cur) + 1]; aller(n ? n.id : null, n ? 0 : null, true); return; }
    aller(cur.id, S.i + 1, true);
  });
  document.addEventListener("keydown", function (e) { if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (e.key === "ArrowRight") $("suiv").click(); if (e.key === "ArrowLeft") $("prec").click(); });
  window.addEventListener("hashchange", function () { var h = location.hash.slice(1); if (h && mod(h) && (!cur || cur.id !== h)) aller(h, null, true); });
  var h0 = location.hash.slice(1);
  aller(mod(h0) ? h0 : null);
  compte("ecole-" + EC.cle + "-ouverture");
})();
