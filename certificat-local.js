/* EFA · Certificats locaux (Maîtrise, Patrimoine) et certificat CEFA ★ — moteur commun.
   Page : <body data-cycle="maitrise|patrimoine|cefa">, données window.EFA_CERTIF (modules, questions) pour un cycle.
   Règles publiées : quiz de chaque module réussi (4 sur 5), puis examen final de 24 questions, 30 min,
   au moins 17 bonnes réponses, 3 tentatives puis 24 h d'attente. Tout reste dans ce navigateur. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var CYCLE = document.body.getAttribute("data-cycle");
  var CLES = { fondations: "efa-certificat-fondations-pilote", maitrise: "efa-certificat-maitrise-pilote", patrimoine: "efa-certificat-patrimoine-pilote", cefa: "efa-certificat-cefa" };
  var NOMS = { fondations: "Fondations", maitrise: "Maîtrise", patrimoine: "Patrimoine" };
  var PAGES = { fondations: "certificat-pilote.html", maitrise: "certificat-maitrise.html", patrimoine: "certificat-patrimoine.html" };
  var PREFIXE = { maitrise: "EFA-M", patrimoine: "EFA-P", cefa: "CEFA" };
  var EXAMEN = { nb: 24, minutes: 30, seuil: 17, essais: 3, quiz: 5, seuilQuiz: 4 };
  var SIGNATURE = "Élysée Johnson · Président d’EFA";

  function lireCle(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function ecrireCle(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function melange(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function dateFr(iso) { try { return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return iso; } }
  function mesure(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function numero(p) { return p + "-" + new Date().getFullYear() + "-" + ("00000" + Math.floor(Math.random() * 1e6)).slice(-6); }
  var vue = $("vue");
  function haut() { try { window.scrollTo({ top: vue.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); } catch (e) {} }

  // ------------------------------------------------------------------ certificat (image et page)
  function certificatHtml(o) {
    return '<article class="cert" aria-label="' + esc(o.titreLong) + '">'
      + '<div class="cert-h"><img src="certificat-pilote/logo-efa.png" alt="" width="44" height="44"><span>EFA · Éducation Financière Afrique</span><em>Pilote 2026</em></div>'
      + '<p class="cert-sur">' + esc(o.sur) + '</p><h2 class="cert-t">' + esc(o.titre) + '</h2>'
      + '<p class="cert-a">est attribué à</p><p class="cert-nom">' + esc(o.nom) + '</p>'
      + '<p class="cert-txt">' + o.texte + '</p>'
      + (o.liste ? '<ul class="cert-l">' + o.liste.map(function (x) { return '<li><b>' + esc(x[0]) + '</b>' + esc(x[1]) + '</li>'; }).join("") + '</ul>' : '')
      + '<div class="cert-b"><div><small>Date</small><b>' + esc(dateFr(o.date)) + '</b></div><div><small>Numéro</small><b>' + esc(o.numero) + '</b></div><div class="sig"><i></i><small>' + esc(SIGNATURE) + '</small></div></div>'
      + '<p class="cert-p">EFA aide chacun à passer du <b class="ce">cercle</b>, l’argent qui tourne, à la <b class="sp">spirale</b>, l’argent qui reste. · Délivré pendant le pilote des certificats EFA.</p>'
      + '</article>'
      + '<div class="cert-acts"><button type="button" class="bt bt-p" id="c-png">Télécharger le certificat</button><button type="button" class="bt" id="c-print">Imprimer</button><button type="button" class="bt" id="c-wa">Partager sur WhatsApp</button><button type="button" class="bt bt-l" id="c-nom">Modifier le nom</button></div><div id="apercu"></div>';
  }
  function brancherCertif(o, changerNom) {
    $("c-print").onclick = function () { try { window.print(); } catch (e) {} };
    $("c-nom").onclick = changerNom;
    $("c-wa").onclick = function () { window.open("https://wa.me/?text=" + encodeURIComponent("J’ai obtenu le " + o.titreLong + " d’EFA, l’école de la finance personnelle. Et vous ? https://efa.africa/parcours?src=certificat"), "_blank", "noopener"); };
    $("c-png").onclick = function () { image(o); };
  }
  function image(o) {
    var W = 3508, H = 2480, cv = document.createElement("canvas"); cv.width = W; cv.height = H; var g = cv.getContext("2d");
    var lg = new Image(); lg.src = "certificat-pilote/logo-efa.png";
    var pret = Promise.all([document.fonts.load('700 80px "Libre Baskerville"'), document.fonts.load('800 30px "Source Sans 3"'), new Promise(function (ok) { lg.complete ? ok() : (lg.onload = ok, lg.onerror = ok); })]).catch(function () {});
    Promise.race([pret, new Promise(function (ok) { setTimeout(ok, 2500); })]).then(function () {
      var X = 320, fond = o.fond || "#F5EFE2", encre = o.encre || "#0B1220";
      g.fillStyle = fond; g.fillRect(0, 0, W, H); g.textBaseline = "alphabetic"; g.textAlign = "left";
      try { if (lg.naturalWidth) g.drawImage(lg, X, 250, 190, 190); } catch (e) {}
      g.fillStyle = encre; g.font = '800 44px "Source Sans 3"'; g.fillText("EFA · ÉDUCATION FINANCIÈRE AFRIQUE", X + 240, 362);
      g.fillStyle = "#F2B84B"; g.fillRect(W - X - 380, 305, 380, 92); g.fillStyle = "#0B1220"; g.font = '800 36px "Source Sans 3"'; g.fillText("PILOTE 2026", W - X - 330, 364);
      g.fillStyle = o.accent || "#E44828"; g.font = '800 46px "Source Sans 3"'; g.fillText(o.sur.toUpperCase(), X, 830);
      g.fillStyle = encre; g.font = '700 190px "Libre Baskerville"'; g.fillText(o.titre, X, 1030, W - 2 * X);
      g.fillStyle = o.encre2 || "#4E5566"; g.font = '400 56px "Source Sans 3"'; g.fillText("est attribué à", X, 1150);
      g.fillStyle = encre; g.font = '700 140px "Libre Baskerville"'; g.fillText(o.nom, X, 1320, W - 2 * X);
      g.fillStyle = o.encre2 || "#4E5566"; g.font = '400 52px "Source Sans 3"';
      var mots = o.texteBrut.split(" "), ligne = "", y = 1440; mots.forEach(function (m) { var t = ligne ? ligne + " " + m : m; if (g.measureText(t).width > W - 2 * X) { g.fillText(ligne, X, y); y += 72; ligne = m; } else ligne = t; }); g.fillText(ligne, X, y);
      if (o.liste) { g.font = '700 40px "Source Sans 3"'; o.liste.forEach(function (m, k) { var x = X + (k % 4) * 720, yy = y + 120 + Math.floor(k / 4) * 66; g.fillStyle = o.accent || "#E44828"; g.fillText(m[0], x, yy); g.fillStyle = encre; g.fillText(m[1].length > 26 ? m[1].slice(0, 25) + "…" : m[1], x + 70, yy); }); }
      g.fillStyle = o.encre2 || "#4E5566"; g.fillRect(X, 1930, W - 2 * X, 3);
      g.font = '700 34px "Source Sans 3"'; g.fillText("DATE", X, 2010); g.fillText("NUMÉRO", X + 1000, 2010);
      g.fillStyle = encre; g.font = '700 56px "Libre Baskerville"'; g.fillText(dateFr(o.date), X, 2090); g.fillText(o.numero, X + 1000, 2090);
      g.fillRect(X + 2000, 2050, W - 2 * X - 2000, 4); g.fillStyle = o.encre2 || "#4E5566"; g.font = '700 34px "Source Sans 3"'; g.fillText(SIGNATURE.toUpperCase(), X + 2000, 2110);
      g.font = '700 36px "Source Sans 3"'; g.fillText("EFA aide chacun à passer du cercle, l’argent qui tourne, à la spirale, l’argent qui reste.", X, 2330);
      var url; try { url = cv.toDataURL("image/png"); } catch (e) { return; }
      $("apercu").innerHTML = '<p class="note">Image prête. Si le téléchargement ne démarre pas, appuyez longuement sur l’image pour l’enregistrer.</p><img alt="' + esc(o.titreLong) + '" src="' + url + '">';
      var a = document.createElement("a"); a.href = url; a.download = (o.fichier || "certificat-efa") + "-" + o.numero + ".png"; document.body.appendChild(a); a.click(); a.remove();
      mesure("certificat-png-" + CYCLE);
    });
  }
  function demanderNom(defaut, ok) {
    vue.innerHTML = '<section class="carte"><p class="sur">Votre certificat</p><h2>Quel nom inscrire sur votre certificat&nbsp;?</h2><p>Votre prénom et votre nom, tels que vous voulez les voir apparaître.</p>'
      + '<label class="champ">Prénom et nom<input id="nom" autocomplete="name" placeholder="ex. Aya Kouassi" value="' + esc(defaut || "") + '"></label>'
      + '<button type="button" class="bt bt-p" id="nom-ok">Créer mon certificat</button></section>';
    var c = $("nom"), b = $("nom-ok"); c.focus();
    b.onclick = function () { var v = c.value.trim().replace(/\s+/g, " "); if (v.length < 3) { c.focus(); return; } ok(v); };
    c.onkeydown = function (e) { if (e.key === "Enter") b.click(); };
  }

  // ------------------------------------------------------------------ CEFA
  if (CYCLE === "cefa") {
    var trois = ["fondations", "maitrise", "patrimoine"].map(function (c) { var e = lireCle(CLES[c]) || {}; return { c: c, r: e.reussite || null }; });
    var tous = trois.every(function (t) { return t.r; });
    var ce = lireCle(CLES.cefa) || {};
    function cefa() {
      if (!tous) {
        vue.innerHTML = '<section class="carte"><p class="sur">Où vous en êtes</p><h2>' + trois.filter(function (t) { return t.r; }).length + ' certificat' + (trois.filter(function (t) { return t.r; }).length > 1 ? 's' : '') + ' loca' + (trois.filter(function (t) { return t.r; }).length > 1 ? 'ux' : 'l') + ' sur 3</h2>'
          + '<ul class="etat3">' + trois.map(function (t, k) { return '<li class="c-' + t.c + '"><b>' + ["I", "II", "III"][k] + '</b><span>Certificat local ' + NOMS[t.c] + '</span>' + (t.r ? '<em class="ok">Obtenu · ' + esc(t.r.numero) + '</em>' : '<a class="bt" href="' + PAGES[t.c] + '">Le préparer</a>') + '</li>'; }).join("") + '</ul>'
          + '<p class="note">Le certificat CEFA ★ se délivre dès que les trois certificats locaux sont obtenus sur ce téléphone.</p></section>';
        return;
      }
      if (!ce.numero) { ce = { numero: numero(PREFIXE.cefa), date: new Date().toISOString(), nom: (trois[0].r.nom || trois[1].r.nom || trois[2].r.nom || "") }; ecrireCle(CLES.cefa, ce); mesure("cefa-obtenu"); }
      if (!ce.nom) return demanderNom("", function (v) { ce.nom = v; ecrireCle(CLES.cefa, ce); cefa(); });
      var o = { titreLong: "certificat CEFA ★", sur: "Certificat EFA complet · CEFA ★", titre: "CEFA ★", nom: ce.nom, date: ce.date, numero: ce.numero, fichier: "certificat-cefa",
        texte: "pour avoir obtenu les trois certificats locaux de l’école EFA, Fondations, Maîtrise et Patrimoine. Il ouvre le rôle de <b>Passeur EFA</b>&nbsp;: transmettre à son tour, dans sa tontine, son entreprise ou sa famille.",
        texteBrut: "pour avoir obtenu les trois certificats locaux de l’école EFA, Fondations, Maîtrise et Patrimoine. Il ouvre le rôle de Passeur EFA : transmettre à son tour.",
        liste: trois.map(function (t, k) { return [["I", "II", "III"][k], NOMS[t.c] + " · " + t.r.numero]; }), fond: "#0B1220", encre: "#FFFFFF", encre2: "#C9D1DE", accent: "#F09680" };
      vue.innerHTML = certificatHtml(o); vue.querySelector(".cert").classList.add("cert-cefa");
      brancherCertif(o, function () { ce.nom = ""; ecrireCle(CLES.cefa, ce); cefa(); });
    }
    cefa(); return;
  }

  // ------------------------------------------------------------------ cycle (Maîtrise, Patrimoine)
  var D = window.EFA_CERTIF; if (!D) return;
  var M = D.modules, CLE = CLES[CYCLE];
  var etat = lireCle(CLE) || {}; etat.valides = etat.valides || {}; etat.tentatives = etat.tentatives || []; etat.reussite = etat.reussite || null;
  function sauver() { ecrireCle(CLE, etat); }
  function nbValides() { return M.filter(function (m) { return etat.valides[m.num]; }).length; }
  function echecs() { var t = Date.now(); return etat.tentatives.filter(function (a) { return !a.ok && t - a.t < 864e5; }); }
  // Une seule progression : un quiz réussi coche l'étape « Quiz du module » dans l'école
  function cocherEcole(num) {
    var P = window.EFA_PARCOURS; if (!P) return;
    var st = lireCle("efa_parcours_v1") || {}; st.faits = st.faits || {};
    P.parcours.forEach(function (p) { if (p.module !== num) return; p.etapes.forEach(function (s, i) { if (s.lien && s.lien.split("?")[0] === PAGES[CYCLE]) st.faits[p.id + "." + i] = 1; }); st.actif = p.id; });
    ecrireCle("efa_parcours_v1", st);
  }
  function idModule(num) { var P = window.EFA_PARCOURS, r = null; if (P) P.parcours.forEach(function (p) { if (p.module === num) r = p.id; }); return r; }

  function sommaire() {
    arreter(); var v = nbValides(), n = M.length, ech = echecs(), bloque = !etat.reussite && ech.length >= EXAMEN.essais;
    vue.innerHTML = (etat.reussite ? '<section class="carte ok"><p class="sur">Certificat obtenu</p><h2>Votre certificat local ' + esc(NOMS[CYCLE]) + '</h2><p>Examen réussi le ' + esc(dateFr(etat.reussite.date)) + ' avec ' + etat.reussite.score + ' / 24.</p><div class="acts"><button type="button" class="bt bt-p" id="voir">Voir mon certificat</button><a class="bt" href="certificat-cefa.html">Vers le certificat CEFA ★</a></div></section>' : '')
      + '<section class="carte"><p class="sur">Étape 1 · Les quiz des modules</p><h2>' + v + ' quiz réussi' + (v > 1 ? 's' : '') + ' sur ' + n + '</h2><p>Revoyez chaque module dans l’école, puis passez son quiz&nbsp;: 5 questions, une explication après chaque réponse, 4 bonnes réponses pour le réussir. Pas de limite d’essais.</p>'
      + '<ol class="mods">' + M.map(function (m) { var ok = etat.valides[m.num], id = idModule(m.num);
          return '<li class="' + (ok ? 'ok' : '') + '"><b class="n">' + m.num + '</b><span class="t">' + esc(m.court) + (ok ? '<em>Quiz réussi</em>' : '') + '</span><span class="a">' + (id ? '<a class="lien" href="parcours.html#' + id + '">Revoir le module</a>' : '') + '<button type="button" class="bt' + (ok ? '' : ' bt-p') + '" data-quiz="' + m.num + '">' + (ok ? 'Refaire le quiz' : 'Passer le quiz') + '</button></span></li>'; }).join("") + '</ol></section>'
      + '<section class="carte"><p class="sur">Étape 2 · L’examen final</p><h2>24 questions, 30 minutes</h2><p>Au moins <b>17 bonnes réponses</b> pour réussir. <b>3 tentatives</b>, puis 24 heures d’attente. Pas de correction pendant l’examen&nbsp;: le résultat s’affiche à la fin, module par module.</p>'
      + (etat.reussite ? '<p class="note">Vous avez déjà réussi l’examen.</p>' : v < n ? '<p class="note">L’examen s’ouvre quand les ' + n + ' quiz sont réussis. Il en reste ' + (n - v) + '.</p>' : bloque ? '<p class="note">Vous avez utilisé vos trois tentatives. Nouvel essai possible dans ' + Math.ceil((Math.min.apply(null, ech.map(function (a) { return a.t; })) + 864e5 - Date.now()) / 36e5) + ' h.</p>' : '<p class="note">Tentatives restantes&nbsp;: ' + (EXAMEN.essais - ech.length) + '.</p>')
      + '<button type="button" class="bt bt-p" id="exam"' + (etat.reussite || v < n || bloque ? ' disabled' : '') + '>Commencer l’examen</button></section>';
    vue.querySelectorAll("[data-quiz]").forEach(function (b) { b.onclick = function () { quiz(+b.getAttribute("data-quiz")); }; });
    if ($("exam")) $("exam").onclick = debut;
    if ($("voir")) $("voir").onclick = certificat;
  }

  // Quiz d'un module : 5 questions tirées parmi celles du module, explication après chaque réponse
  function quiz(num) {
    var m = M.filter(function (x) { return x.num === num; })[0]; if (!m) return sommaire();
    var qs = melange(m.questions).slice(0, EXAMEN.quiz).map(function (q) { return { q: q, ordre: melange([0, 1, 2]) }; }), k = 0, bons = 0;
    mesure("quiz-" + CYCLE + "-" + num + "-debut");
    function une() {
      var it = qs[k];
      vue.innerHTML = '<section class="carte"><p class="sur">Module ' + m.num + ' · ' + esc(m.court) + ' · question ' + (k + 1) + ' sur ' + qs.length + '</p><div class="barre"><i style="width:' + Math.round(k / qs.length * 100) + '%"></i></div>'
        + '<h2 class="enonce">' + esc(it.q.e) + '</h2><div class="opts">' + it.ordre.map(function (o, p) { return '<button type="button" class="opt" data-k="' + o + '"><b>' + "ABC"[p] + '</b><span>' + esc(it.q.o[o]) + '</span></button>'; }).join("") + '</div>'
        + '<div id="fb" role="status" aria-live="polite"></div><div class="acts"><button type="button" class="bt bt-l" id="retour">Sommaire</button></div></section>';
      $("retour").onclick = sommaire;
      vue.querySelectorAll(".opt").forEach(function (b) {
        b.onclick = function () {
          if (vue.querySelector(".opt[disabled]")) return;
          var ch = +b.getAttribute("data-k"), ok = ch === it.q.b; if (ok) bons++;
          vue.querySelectorAll(".opt").forEach(function (c) { c.disabled = true; var kk = +c.getAttribute("data-k"); if (kk === it.q.b) c.classList.add("juste"); else if (c === b) c.classList.add("faux"); }); if (window.EFA_SONS) EFA_SONS.joue(+b.getAttribute("data-k") === it.q.b ? "bon" : "faux");
          $("fb").innerHTML = '<p class="fb ' + (ok ? 'oui' : 'non') + '"><b>' + (ok ? 'Juste.' : 'Pas tout à fait.') + '</b> ' + esc(it.q.x) + '</p><button type="button" class="bt bt-p" id="suite">' + (k + 1 < qs.length ? 'Question suivante' : 'Voir mon résultat') + '</button>';
          $("suite").onclick = function () { k++; if (k < qs.length) une(); else fin(); };
          $("suite").focus();
        };
      });
    }
    function fin() {
      var ok = bons >= EXAMEN.seuilQuiz;
      if (ok) { etat.valides[m.num] = true; sauver(); cocherEcole(m.num); mesure("quiz-" + CYCLE + "-" + num + "-reussi"); }
      var id = idModule(m.num);
      vue.innerHTML = '<section class="carte ' + (ok ? 'ok' : '') + '"><p class="sur">Module ' + m.num + ' · résultat du quiz</p><h2>' + bons + ' / ' + qs.length + (ok ? ' · quiz réussi' : '') + '</h2>'
        + '<p>' + (ok ? 'L’étape « Quiz du module » est cochée dans l’école. Pour valider le module, gardez aussi sa fiche.' : 'Il faut 4 bonnes réponses. Revoyez le module, puis recommencez : les questions changent.') + '</p>'
        + '<div class="acts">' + (ok ? '' : '<button type="button" class="bt bt-p" id="re">Recommencer le quiz</button>') + (id ? '<a class="bt' + (ok ? ' bt-p' : '') + '" href="parcours.html#' + id + '">Revenir au module</a>' : '') + '<button type="button" class="bt bt-l" id="som">Sommaire du certificat</button></div></section>';
      if ($("re")) $("re").onclick = function () { quiz(num); };
      $("som").onclick = sommaire; haut();
    }
    une(); haut();
  }

  // Examen final : 24 questions réparties sur les modules, 30 minutes
  var ex = null, chrono = null;
  function arreter() { if (chrono) { clearInterval(chrono); chrono = null; } }
  function mmss(r) { var s = Math.max(0, Math.ceil(r / 1000)); return Math.floor(s / 60) + ":" + ("0" + s % 60).slice(-2); }
  function debut() {
    var par = Math.floor(EXAMEN.nb / M.length), qs = [], reste = [];
    M.forEach(function (m) { var t = melange(m.questions); t.slice(0, par).forEach(function (q) { qs.push({ q: q, m: m.num, ordre: melange([0, 1, 2]) }); }); t.slice(par).forEach(function (q) { reste.push({ q: q, m: m.num, ordre: melange([0, 1, 2]) }); }); });
    melange(reste).slice(0, EXAMEN.nb - qs.length).forEach(function (x) { qs.push(x); });
    ex = { qs: melange(qs), rep: {}, k: 0, fin: Date.now() + EXAMEN.minutes * 6e4 };
    chrono = setInterval(function () { var r = ex.fin - Date.now(); if (r <= 0) { finExamen(true); return; } var t = $("chrono"); if (t) t.textContent = mmss(r); }, 1000);
    mesure("examen-" + CYCLE + "-debut"); question();
  }
  function question() {
    var k = ex.k, it = ex.qs[k], n = ex.qs.length, nr = Object.keys(ex.rep).length, m = M.filter(function (x) { return x.num === it.m; })[0];
    vue.innerHTML = '<section class="carte"><div class="ex-h"><p class="sur">Examen · question ' + (k + 1) + ' sur ' + n + ' · module ' + m.num + '</p><span class="chrono" id="chrono">' + mmss(ex.fin - Date.now()) + '</span></div>'
      + '<div class="pastilles">' + ex.qs.map(function (x, j) { return '<button type="button" class="pa' + (ex.rep[j] !== undefined ? ' r' : '') + (j === k ? ' ici' : '') + '" data-j="' + j + '" aria-label="Question ' + (j + 1) + '"></button>'; }).join("") + '</div>'
      + '<h2 class="enonce">' + esc(it.q.e) + '</h2><div class="opts">' + it.ordre.map(function (o, p) { return '<button type="button" class="opt' + (ex.rep[k] === o ? ' choisi' : '') + '" data-k="' + o + '"><b>' + "ABC"[p] + '</b><span>' + esc(it.q.o[o]) + '</span></button>'; }).join("") + '</div>'
      + '<div class="acts"><button type="button" class="bt" id="prec"' + (k === 0 ? ' disabled' : '') + '>Précédente</button>' + (k < n - 1 ? '<button type="button" class="bt bt-p" id="suiv">Question suivante</button>' : '') + '<button type="button" class="bt' + (k === n - 1 ? ' bt-p' : ' bt-l') + '" id="fin">' + (nr < n ? 'Terminer (' + (n - nr) + ' sans réponse)' : 'Terminer l’examen') + '</button></div></section>';
    vue.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { ex.rep[k] = +b.getAttribute("data-k"); question(); }; });
    vue.querySelectorAll(".pa").forEach(function (b) { b.onclick = function () { ex.k = +b.getAttribute("data-j"); question(); }; });
    if ($("prec")) $("prec").onclick = function () { ex.k--; question(); };
    if ($("suiv")) $("suiv").onclick = function () { ex.k++; question(); };
    $("fin").onclick = function () { finExamen(false); };
  }
  function finExamen(temps) { if (window.EFA_SONS) EFA_SONS.joue("fin");
    arreter(); var s = 0, parM = {}, nbM = {};
    ex.qs.forEach(function (it, j) { var ok = ex.rep[j] === it.q.b; if (ok) s++; parM[it.m] = (parM[it.m] || 0) + (ok ? 1 : 0); nbM[it.m] = (nbM[it.m] || 0) + 1; });
    var ok = s >= EXAMEN.seuil;
    etat.tentatives.push({ t: Date.now(), score: s, ok: ok });
    if (ok) etat.reussite = { score: s, pct: Math.round(s / ex.qs.length * 100), date: new Date().toISOString(), numero: numero(PREFIXE[CYCLE]), nom: "" };
    sauver(); mesure("examen-" + CYCLE + "-" + (ok ? "reussi" : "echoue"));
    var faibles = M.filter(function (m) { return (parM[m.num] || 0) < Math.ceil((nbM[m.num] || 0) * 0.6); });
    vue.innerHTML = '<section class="carte ' + (ok ? 'ok' : '') + '"><p class="sur">' + (temps ? 'Temps écoulé · ' : '') + 'Résultat de l’examen</p><h2>' + s + ' / ' + ex.qs.length + (ok ? ' · examen réussi' : '') + '</h2>'
      + '<table class="tab">' + M.map(function (m) { return '<tr><td>' + m.num + '. ' + esc(m.court) + '</td><td>' + (parM[m.num] || 0) + ' / ' + (nbM[m.num] || 0) + '</td></tr>'; }).join("") + '</table>'
      + '<p>' + (ok ? 'Votre certificat local ' + esc(NOMS[CYCLE]) + ' vous attend.' : 'Il faut 17 bonnes réponses. ' + (faibles.length ? 'Revoyez en priorité ' + (faibles.length > 1 ? 'les modules ' : 'le module ') + faibles.map(function (m) { return m.num; }).join(", ") + '. ' : '') + 'Tentatives restantes : ' + Math.max(0, EXAMEN.essais - echecs().length) + '.') + '</p>'
      + '<div class="acts">' + (ok ? '<button type="button" class="bt bt-p" id="obt">Obtenir mon certificat</button>' : '') + '<button type="button" class="bt' + (ok ? ' bt-l' : ' bt-p') + '" id="som">Sommaire du certificat</button></div></section>';
    if ($("obt")) $("obt").onclick = certificat; $("som").onclick = sommaire; haut();
  }
  function certificat() {
    var r = etat.reussite; if (!r) return sommaire();
    if (!r.nom) { var autre = ["fondations", "maitrise", "patrimoine"].map(function (c) { var e = lireCle(CLES[c]); return e && e.reussite && e.reussite.nom; }).filter(Boolean)[0];
      return demanderNom(autre, function (v) { r.nom = v; sauver(); certificat(); }); }
    var o = { titreLong: "certificat local " + NOMS[CYCLE], sur: "Certificat local EFA · Cycle " + D.num, titre: NOMS[CYCLE], nom: r.nom, date: r.date, numero: r.numero, fichier: "certificat-efa-" + CYCLE,
      texte: "pour avoir réussi les quiz des " + M.length + " modules du cycle " + esc(NOMS[CYCLE]) + " de l’école EFA et l’examen final avec un score de <b>" + r.pct + "&nbsp;%</b>.",
      texteBrut: "pour avoir réussi les quiz des " + M.length + " modules du cycle " + NOMS[CYCLE] + " de l’école EFA et l’examen final avec un score de " + r.pct + " %.",
      liste: M.map(function (m) { return [String(m.num), m.court]; }), accent: D.accent || "#E44828", fond: D.fond, encre: D.encre, encre2: D.encre2 };
    vue.innerHTML = certificatHtml(o) + '<p style="margin-top:16px"><a class="lien" href="certificat-cefa.html">Voir où j’en suis pour le certificat CEFA ★</a></p>';
    vue.querySelector(".cert").classList.add("cert-" + CYCLE);
    brancherCertif(o, function () { r.nom = ""; sauver(); certificat(); });
    haut();
  }
  // Ouverture directe d'un quiz depuis l'école : certificat-maitrise.html?m=9
  var mq = +(new URLSearchParams(location.search).get("m") || 0);
  if (mq && M.some(function (m) { return m.num === mq; })) quiz(mq); else sommaire();
})();
