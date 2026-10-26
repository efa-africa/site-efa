/* EFA Traders · interface (mode démonstration : tout reste sur cet appareil) */
(function () {
  "use strict";
  var M = window.EFA_TR, C = window.EFA_TR_C;
  var CLE = "efa-traders-1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function suivi(n) { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "traders-" + n, event: true }); } catch (e) {} }

  /* ---------- Données locales ---------- */
  var D = lire() || { objectif: null, diag: null, tutos: {}, sessions: {}, active: null, groupe: null };
  function lire() { try { var t = localStorage.getItem(CLE); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
  var etatSauv = "Sauvegardé sur cet appareil";
  function sauver() {
    try { localStorage.setItem(CLE, JSON.stringify(D)); etatSauv = "Sauvegardé sur cet appareil"; }
    catch (e) { etatSauv = "Sauvegarde impossible sur ce navigateur : vos décisions seront perdues en quittant"; }
    var s = $("#tr-sauv"); if (s) s.textContent = etatSauv;
  }

  /* ---------- Scénarios et marchés ---------- */
  var LIBRES = {
    "libre-actions": { id: "libre-actions", version: 1, titre: "Marché libre · actions", univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 60, actifs: ["KLT", "BNY", "SOL", "CBK", "AGD", "KNG"], evenements: [], competence: "Explorer librement", situation: "Six entreprises fictives, sans consigne. Vos décisions ne sont pas évaluées.", consigne: "Explorez. Justifiez quand même vos décisions : c'est ce qui vous fera progresser." },
    "libre-change": { id: "libre-change", version: 1, titre: "Marché libre · change", univers: "forex", capital: 1000000, spread: { EURUSD: 2, GBPUSD: 3 }, historique: 30, seances: 60, actifs: ["EURUSD", "GBPUSD"], evenements: [], competence: "Explorer librement", situation: "Deux paires de devises, compte de 10 000 USD fictifs.", consigne: "Achetez et revendez des devises. Observez l'effet du spread." }
  };
  function scenarioDe(cle) {
    var p = cle.split(":");
    if (p[0] === "sc" || p[0] === "sr") return C.SCENARIOS.filter(function (s) { return s.id === p[1]; })[0];
    if (p[0] === "tu") { var t = tuto(p[1]); return C.TUTO_MARCHES[t.marche]; }
    return LIBRES[p[1]];
  }
  function tuto(id) { return C.TUTORIELS.filter(function (t) { return t.id === id; })[0]; }
  var cacheMarches = {};
  function marcheDe(sc) { var k = sc.id + "@" + sc.version; return cacheMarches[k] || (cacheMarches[k] = M.construireMarche(sc, C.ACTIFS)); }

  function session() { return D.active && D.sessions[D.active]; }
  function sc() { return D.active && scenarioDe(D.active); }
  function marche() { return marcheDe(sc()); }
  function forex() { var s = session(); return s && s.univers === "forex"; }

  function ouvrirSession(cle, opts) {
    if (!D.sessions[cle]) {
      var s = scenarioDe(cle);
      opts = opts || {};
      if (!opts.mode) opts.mode = cle.indexOf("sc:") === 0 ? "exercice" : cle.indexOf("tu:") === 0 ? "tutoriel" : "libre";
      var st = M.nouvelleSession(s, marcheDe(s), opts);
      st.cle = cle; st.attentes = []; st.bilanReponses = {}; st.libelle = s.titre;
      if (cle.indexOf("tu:") === 0) st.tuto = { id: cle.slice(3), etape: 0, reponses: {}, departSeance: st.seance };
      D.sessions[cle] = st;
    }
    D.active = cle;
    var st2 = D.sessions[cle];
    ui.onglet = st2.tuto ? "tutoriel" : "marche";
    ui.ticket = { sens: "achat", qte: "", cat: "", texte: "" }; ui.confirme = false;
    ui.actif = st2.ui && st2.ui.actif || scenarioDe(cle).actifs[0];
    ui.selection = null;
    sauver();
  }

  /* ---------- Interface ---------- */
  var ui = { vue: "ligne", fenetre: 30, pct: false, volumes: true, trades: true, actif: null, selection: null, onglet: "marche", lecture: null, ticket: { sens: "achat", qte: "", cat: "", texte: "" }, confirme: false };
  var RUB = [["decouvrir", "Découvrir"], ["parcours", "Mes parcours"], ["simuler", "Simuler"], ["decisions", "Mes décisions"], ["bilan", "Mon bilan"], ["groupe", "Mon groupe"], ["glossaire", "Glossaire"]];
  var vue = $("#tr-vue");

  function route() {
    var h = (location.hash || "").replace("#", "") || (D.active ? "simuler" : "decouvrir");
    if (!RUB.some(function (r) { return r[0] === h; })) h = "decouvrir";
    stopLecture();
    var an = $("#tr-annonce"); if (an) an.classList.remove("on");
    $$(".tr-rub a").forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + h ? "page" : "false"); });
    ({ decouvrir: vDecouvrir, parcours: vParcours, simuler: vSimuler, decisions: vDecisions, bilan: vBilan, groupe: vGroupe, glossaire: vGlossaire })[h]();
    vue.focus({ preventScroll: true });
  }
  function aller(h) { if (location.hash === "#" + h) route(); else location.hash = h; window.scrollTo({ top: Math.max(0, $("#tr").getBoundingClientRect().top + window.scrollY - 84), behavior: "smooth" }); }

  /* ---------- Formats ---------- */
  function argent(n) { return forex() ? M.usd(n) : M.fcfa(n); }
  function cours(p) { return forex() ? M.taux(p) : M.fcfa(p).replace(" FCFA", ""); }
  function signe(n) { return n > 0 ? "▲ " : n < 0 ? "▼ " : ""; }
  function classe(n) { return n > 0 ? "hausse" : n < 0 ? "baisse" : ""; }

  /* ================= Découvrir ================= */
  function vDecouvrir() {
    var dq = D.diag;
    vue.innerHTML =
      '<section class="tr-bloc tr-intro">' +
      '<div><p class="surtitre">Le laboratoire des décisions</p><h2>Observer, décider, comprendre. Sans argent réel.</h2>' +
      '<p class="lead">Vous regardez un marché, vous formez une hypothèse, vous décidez ou vous attendez, puis vous voyez les conséquences et leur explication.</p>' +
      '<div class="tr-cta"><button class="bouton bouton-principal" data-go="tu:t1">Ma première simulation guidée</button><a class="bouton bouton-clair" href="#parcours">Voir les parcours</a></div>' +
      '<p class="tr-avert">Vous utilisez un capital fictif. Les scénarios servent à apprendre. Les résultats ne permettent pas de prévoir ce que vous gagneriez ou perdriez sur un marché réel.</p></div>' +
      '<ol class="tr-5q"><li>Qu’est-ce que je regarde&nbsp;?</li><li>Que sais-je réellement&nbsp;?</li><li>Quelle décision, et quelle somme j’expose&nbsp;?</li><li>Quelles conséquences&nbsp;?</li><li>Qu’est-ce que j’en apprends&nbsp;?</li></ol></section>' +
      '<section class="tr-bloc"><h3>Votre objectif</h3><div class="tr-puces" role="group" aria-label="Choisir un objectif">' +
      C.OBJECTIFS.map(function (o) { return '<button type="button" class="puce" data-obj="' + o.id + '" aria-pressed="' + (D.objectif === o.id) + '">' + esc(o.t) + "</button>"; }).join("") + "</div>" +
      '<div id="tr-diag"></div></section>';
    $$("[data-go]", vue).forEach(function (b) { b.onclick = function () { lancer(b.dataset.go); }; });
    $$("[data-obj]", vue).forEach(function (b) { b.onclick = function () { D.objectif = b.dataset.obj; sauver(); suivi("objectif-" + D.objectif); $$("[data-obj]", vue).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); diag(0, []); }; });
    if (dq) resultatDiag(); else if (D.objectif) diag(0, []);
  }
  function diag(i, rep) {
    var z = $("#tr-diag");
    if (i >= C.DIAGNOSTIC.length) { D.diag = { reponses: rep, le: Date.now() }; sauver(); suivi("diagnostic"); return resultatDiag(); }
    var q = C.DIAGNOSTIC[i];
    z.innerHTML = '<div class="carte tr-q"><p class="etiquette">Diagnostic · question ' + (i + 1) + " sur " + C.DIAGNOSTIC.length + '</p><p class="tr-qq">' + esc(q.q) + '</p><div class="tr-choix">' +
      q.choix.map(function (c, k) { return '<button type="button" class="choix" data-k="' + k + '">' + esc(c) + "</button>"; }).join("") + "</div></div>";
    $$(".choix", z).forEach(function (b) { b.onclick = function () { diag(i + 1, rep.concat(+b.dataset.k)); }; });
  }
  function resultatDiag() {
    var z = $("#tr-diag"), r = D.diag.reponses, bons = 0, manque = null;
    C.DIAGNOSTIC.forEach(function (q, i) { if (r[i] === q.bonne) bons++; else if (!manque) manque = q.tuto; });
    var obj = C.OBJECTIFS.filter(function (o) { return o.id === D.objectif; })[0];
    var depart = (obj && obj.id === "devises") ? "t10" : manque || (obj && obj.tuto) || "t1";
    var t = tuto(depart);
    z.innerHTML = '<div class="carte tr-res"><p class="etiquette">Votre point de départ</p><p class="chiffre-cle">' + bons + " / " + C.DIAGNOSTIC.length + '</p>' +
      '<p>' + (bons === 5 ? "Les bases sont là. Vous pouvez aller directement aux scénarios, ou commencer par le tutoriel proposé." : "Nous vous proposons de commencer par le tutoriel ci-dessous.") + ' Ce diagnostic oriente : ce n’est pas une note ni une certification.</p>' +
      '<div class="tr-cta"><button class="bouton bouton-principal" data-go="tu:' + depart + '">Commencer « ' + esc(t.titre) + ' »</button><button class="lien-souligne" id="tr-rediag" type="button">Refaire le diagnostic</button></div></div>';
    $("[data-go]", z).onclick = function () { lancer("tu:" + depart); };
    $("#tr-rediag").onclick = function () { D.diag = null; sauver(); diag(0, []); };
  }

  function lancer(cle, opts) { ouvrirSession(cle, opts); suivi("lancer-" + cle.replace(":", "-")); aller("simuler"); }

  /* ================= Mes parcours ================= */
  function statutTuto(id) {
    var p = D.tutos[id];
    if (!p) return ["À faire", ""];
    if (p.reussi) return [p.revu ? "Revu" : "Réussi", "ok"];
    if (p.termine) return ["Terminé", "moyen"];
    return ["En cours", "cours"];
  }
  var CHAPITRES = [
    { t: "Lire le marché", d: "Ce que montre un écran de cotation", ids: ["t1", "t2", "t3"] },
    { t: "Décider et compter", d: "Ce que coûte et rapporte un ordre", ids: ["t4", "t5", "t6", "t7"] },
    { t: "Penser son risque", d: "Exposition, diversification, information", ids: ["t8", "t9"] },
    { t: "Les devises", d: "Paires, cotation et spread", ids: ["t10", "t11"] },
    { t: "Faire le bilan", d: "Juger une décision, pas un résultat", ids: ["t12"] }
  ];
  var ICO = {
    ok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    go: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
  };
  function vParcours() {
    var faits = C.TUTORIELS.filter(function (t) { return (D.tutos[t.id] || {}).termine; }).length;
    var prochain = C.TUTORIELS.filter(function (t) { return !(D.tutos[t.id] || {}).termine; })[0];
    var enCours = prochain && D.sessions["tu:" + prochain.id];
    var h = '<section class="tr-bloc"><div class="tr-ph">' +
      '<div class="tr-ph-t"><p class="surtitre">Mes parcours</p><h2>Douze tutoriels, puis des scénarios</h2><p class="lead">Chaque tutoriel vous fait agir dans le simulateur, puis vous pose une question. La correction vient après votre réponse.</p></div>' +
      '<div class="tr-suite"><p class="etiquette">Votre progression</p><p class="tr-suite-n"><b>' + faits + '</b> / ' + C.TUTORIELS.length + ' tutoriels</p><div class="tr-barre" aria-hidden="true"><i style="width:' + (faits / C.TUTORIELS.length * 100) + '%"></i></div>' +
      (prochain ? '<button class="bouton bouton-principal" data-go="tu:' + prochain.id + '">' + (enCours ? "Reprendre" : faits ? "Continuer" : "Commencer") + " : " + esc(prochain.titre) + "</button>" : '<a class="bouton bouton-principal" href="#bilan">Voir mon bilan</a>') + "</div></div>";
    h += '<div class="tr-chaps">';
    var n = 0;
    CHAPITRES.forEach(function (ch, ci) {
      h += '<section class="tr-chap"><header><span class="tr-chap-n">' + (ci + 1) + '</span><div><h3>' + esc(ch.t) + "</h3><p>" + esc(ch.d) + '</p></div></header><ol class="tr-liste">';
      ch.ids.forEach(function (id) {
        var t = tuto(id), s = statutTuto(id), p = D.tutos[id] || {}; n++;
        var etat = p.termine ? "fait" : D.sessions["tu:" + id] ? "cours" : prochain && prochain.id === id ? "suivant" : "";
        h += '<li><button type="button" class="tr-ligne ' + etat + '" data-go="tu:' + id + '"><span class="tr-pt">' + (p.termine ? ICO.ok : C.TUTORIELS.indexOf(t) + 1) + '</span><span class="tr-lt"><b>' + esc(t.titre) + "</b><small>" + esc(t.competence) + '</small></span><span class="tr-lm">' + (etat === "fait" ? '<span class="pastille ' + s[1] + '">' + s[0] + (p.score ? " · " + p.score : "") + "</span>" : etat === "cours" ? '<span class="pastille cours">En cours</span>' : '<span class="tr-duree">' + t.duree + "</span>") + "</span>" + '<span class="tr-chev">' + ICO.go + "</span></button></li>";
      });
      h += "</ol></section>";
    });
    h += "</div></section>";
    h += '<section class="tr-bloc"><div class="tr-sh"><div><p class="surtitre">Scénarios</p><h2>Des situations à traverser</h2></div><p class="lead">Un capital, un horizon, des informations qui tombent au fil des séances. Premier passage en exercice : on ne revient pas en arrière.</p></div><div class="tr-scs">';
    C.SCENARIOS.forEach(function (s) {
      var st = D.sessions["sc:" + s.id], fx = s.univers === "forex";
      var act = st ? (st.termine ? '<button class="tr-sc-cta" data-bilan="sc:' + s.id + '">Voir mon bilan ' + ICO.go + '</button><button class="lien-souligne" data-rejouer="' + s.id + '">Rejouer en libre</button>' : '<button class="tr-sc-cta" data-go="sc:' + s.id + '">Reprendre · séance ' + (st.seance - st.debut) + " sur " + s.seances + " " + ICO.go + "</button>") : '<button class="tr-sc-cta" data-go="sc:' + s.id + '">Commencer l’exercice ' + ICO.go + "</button>";
      h += '<article class="tr-sc ' + (fx ? "fx" : "") + '"><div class="tr-sc-h"><span>' + (fx ? "Change" : "Actions") + "</span><span>" + esc(s.niveau) + " · " + s.duree + '</span></div><div class="tr-sc-b"><h3>' + esc(s.titre) + "</h3><p>" + esc(s.situation) + '</p><p class="tr-comp"><span>Compétence</span>' + esc(s.competence) + '</p><div class="tr-sc-a">' + act + "</div></div></article>";
    });
    h += '</div></section><section class="tr-bloc"><div class="tr-sh"><div><p class="surtitre">Mode libre</p><h2>Explorer sans consigne</h2></div><p class="lead">Séparé des exercices : ne compte pas dans votre bilan de compétences.</p></div><div class="tr-scs deux">' +
      Object.keys(LIBRES).map(function (k) { var l = LIBRES[k], ex = D.sessions["li:" + k]; return '<article class="tr-sc libre ' + (l.univers === "forex" ? "fx" : "") + '"><div class="tr-sc-h"><span>' + (l.univers === "forex" ? "Change" : "Actions") + '</span><span>Sans limite</span></div><div class="tr-sc-b"><h3>' + esc(l.titre) + "</h3><p>" + esc(l.situation) + '</p><div class="tr-sc-a"><button class="tr-sc-cta" data-go="li:' + k + '">' + (ex ? "Reprendre" : "Ouvrir") + " " + ICO.go + "</button>" + (ex ? '<button class="lien-souligne" data-reinit="li:' + k + '">Réinitialiser</button>' : "") + "</div></div></article>"; }).join("") +
      "</div></section>";
    vue.innerHTML = h;
    $$("[data-go]", vue).forEach(function (b) { b.onclick = function () { lancer(b.dataset.go); }; });
    $$("[data-bilan]", vue).forEach(function (b) { b.onclick = function () { D.active = b.dataset.bilan; sauver(); aller("bilan"); }; });
    $$("[data-reinit]", vue).forEach(function (b) { b.onclick = function () { if (!confirm("Effacer cette session libre ?")) return; delete D.sessions[b.dataset.reinit]; if (D.active === b.dataset.reinit) D.active = null; sauver(); vParcours(); }; });
    $$("[data-rejouer]", vue).forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.rejouer, k = "sr:" + id;
        if (D.sessions[k] && !confirm("Recommencer la session libre de ce scénario ? Vous connaissez déjà son déroulement.")) return;
        delete D.sessions[k];
        lancer(k, { mode: "libre" });
      };
    });
  }

  /* ================= Simuler ================= */
  function vSimuler() {
    var st = session();
    if (!st) {
      vue.innerHTML = '<section class="tr-bloc"><h2>Aucune simulation ouverte</h2><p>Commencez par la simulation guidée ou choisissez un scénario.</p><div class="tr-cta"><button class="bouton bouton-principal" id="tr-g">Ma première simulation guidée</button><a class="bouton bouton-clair" href="#parcours">Voir les parcours</a></div></section>';
      $("#tr-g").onclick = function () { lancer("tu:t1"); };
      return;
    }
    var s = sc(), fx = forex();
    var exec = st.execution === "immediat" ? "Exécution pédagogique au prix affiché" : "Ordre exécuté à l’ouverture de la séance suivante";
    vue.innerHTML =
      '<section class="tr-sim">' +
      '<div class="tr-bandeau"><div><p class="etiquette">' + (st.tuto ? "Tutoriel" : st.mode === "libre" ? "Mode libre" : "Exercice") + " · " + (fx ? "Change au comptant" : "Actions au comptant") + '</p><h2 class="titre-section">' + esc(st.tuto ? tuto(st.tuto.id).titre : s.titre) + '</h2></div>' +
      '<div class="tr-badges"><span class="badge fictif">Capital fictif</span><span class="badge donnees" title="Séries générées par EFA, reproductibles. Aucune donnée réelle.">Simulation synthétique · v' + s.version + '</span><span class="badge" id="tr-seance"></span><span class="badge sauv" id="tr-sauv" role="status">' + esc(etatSauv) + "</span></div></div>" +
      (st.tuto ? "" : '<p class="tr-consigne"><b>Situation.</b> ' + esc(s.situation) + " <b>Consigne.</b> " + esc(s.consigne) + "</p>") +
      '<div class="tr-kpis" id="tr-kpis"></div>' +
      '<nav class="tr-onglets" aria-label="Zones du simulateur">' + [["marche", "Marché"], ["decider", "Décider"], ["portefeuille", "Portefeuille"], ["tutoriel", st.tuto ? "Tutoriel" : "Journal"]].map(function (o) { return '<button type="button" data-ong="' + o[0] + '" aria-pressed="' + (ui.onglet === o[0]) + '">' + o[1] + "</button>"; }).join("") + "</nav>" +
      (st.tuto ? '<p class="tr-tmini" id="tr-tmini" hidden></p>' : "") +
      '<div class="tr-grille" data-onglet="' + ui.onglet + '">' +
      '<div class="tr-z marche"><div class="tr-graph">' +
      '<div class="tr-actifs" role="tablist" aria-label="Actif affiché">' + s.actifs.map(function (a) { return '<button type="button" role="tab" data-actif="' + a + '" aria-selected="' + (a === ui.actif) + '">' + a.replace("USD", "/USD") + "</button>"; }).join("") + "</div>" +
      '<div class="tr-gtete" id="tr-gtete"></div>' +
      '<div class="tr-gopts"><div class="seg" role="group" aria-label="Type de graphique"><button type="button" data-vue="ligne">Courbe</button><button type="button" data-vue="bougies">Bougies</button></div>' +
      '<div class="seg" role="group" aria-label="Séances visibles"><button type="button" data-fen="10">10</button><button type="button" data-fen="30">30</button><button type="button" data-fen="60">60</button></div>' +
      '<label class="ck"><input type="checkbox" id="o-pct"' + (ui.pct ? " checked" : "") + '> En %</label>' + (fx ? "" : '<label class="ck"><input type="checkbox" id="o-vol"' + (ui.volumes ? " checked" : "") + "> Volumes</label>") + '<label class="ck"><input type="checkbox" id="o-tr"' + (ui.trades ? " checked" : "") + "> Mes ordres</label></div>" +
      '<div class="tr-svg" id="tr-svg"></div><p class="tr-lecture" id="tr-lecture" aria-live="polite"></p><p class="tr-alt" id="tr-alt"></p>' +
      '<details class="tr-fiche" id="tr-fiche"></details></div>' +
      '<div class="tr-temps"><button type="button" class="bouton bouton-sombre" id="t-1">+ 1 séance</button><button type="button" class="bouton bouton-sombre" id="t-5">+ 5 séances</button><button type="button" class="bouton bouton-clair" id="t-auto" aria-pressed="false">Lecture auto</button><button type="button" class="lien-souligne" id="t-fin">Terminer la session</button></div>' +
      '<div class="tr-evts" id="tr-evts"></div></div>' +
      '<div class="tr-z decider"><form class="carte tr-ticket" id="tr-ticket" novalidate></form></div>' +
      '<div class="tr-z portefeuille"><div class="carte" id="tr-pf"></div><div class="carte" id="tr-att"></div></div>' +
      '<div class="tr-z tutoriel">' + (st.tuto ? '<div class="carte tr-tuto" id="tr-tuto"></div>' : '<div class="carte" id="tr-jmini"></div>') + "</div>" +
      "</div>" +
      '<p class="tr-note">' + exec + (fx ? " · Achat au cours vendeur (ask), vente au cours acheteur (bid)" : " · Frais fictifs de " + (st.fraisBp / 100).toString().replace(".", ",") + " % par ordre, paramètre d’exercice (pas le tarif d’une SGI)") + " · Fonds disponibles dès l’exécution (convention pédagogique) · Entreprises et événements fictifs.</p>" +
      "</section>";

    $$("[data-ong]", vue).forEach(function (b) { b.onclick = function () { ui.onglet = b.dataset.ong; $(".tr-grille").dataset.onglet = ui.onglet; $$("[data-ong]", vue).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); if (ui.onglet === "marche") dessiner(); majTuto(); }; });
    $$("[data-actif]", vue).forEach(function (b) { b.onclick = function () { ui.actif = b.dataset.actif; ui.selection = null; st.ui = { actif: ui.actif }; $$("[data-actif]", vue).forEach(function (x) { x.setAttribute("aria-selected", x === b); }); majTout(); }; });
    $$("[data-vue]", vue).forEach(function (b) { b.onclick = function () { ui.vue = b.dataset.vue; majOpts(); dessiner(); majTuto(); }; });
    $$("[data-fen]", vue).forEach(function (b) { b.onclick = function () { ui.fenetre = +b.dataset.fen; majOpts(); dessiner(); }; });
    $("#o-pct").onchange = function () { ui.pct = this.checked; dessiner(); };
    if ($("#o-vol")) $("#o-vol").onchange = function () { ui.volumes = this.checked; dessiner(); };
    $("#o-tr").onchange = function () { ui.trades = this.checked; dessiner(); };
    $("#t-1").onclick = function () { avance(1); };
    $("#t-5").onclick = function () { avance(5); };
    $("#t-auto").onclick = function () { if (ui.lecture) stopLecture(); else startLecture(); };
    $("#t-fin").onclick = function () {
      if (st.termine) return aller("bilan");
      if (!confirm("Terminer la session ? Vous ne pourrez plus passer d’ordre.")) return;
      st.termine = true; sauver(); suivi("terminer"); aller("bilan");
    };
    window.onresize = function () { clearTimeout(window.__trR); window.__trR = setTimeout(dessiner, 120); };
    ticket(); majOpts(); majTout();
  }

  function majOpts() {
    $$("[data-vue]", vue).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.vue === ui.vue); });
    $$("[data-fen]", vue).forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.fen === ui.fenetre); });
  }

  function avance(n) {
    var st = session();
    if (st.termine) { annonce("La session est terminée."); return; }
    var r = M.avancerN(st, marche(), n);
    sauver(); majTout();
    var ex = st.ordres.filter(function (o) { return o.execution && o.execution.seance > st.seance - n && o.execution.moment === "ouverture"; });
    var rej = st.ordres.filter(function (o) { return o.etat === "rejeté" && !o.vu; });
    rej.forEach(function (o) { o.vu = true; });
    if (rej.length) annonce("Ordre rejeté : " + rej[0].motif);
    else if (ex.length) annonce(ex.length + " ordre(s) exécuté(s) à l’ouverture.");
    if (st.termine) { stopLecture(); annonce("Dernière séance atteinte. Votre bilan est prêt."); }
    return r;
  }
  function startLecture() {
    var b = $("#t-auto"); if (!b) return;
    ui.lecture = setInterval(function () { if (document.hidden || !session() || session().termine) return stopLecture(); avance(1); }, 1300);
    b.setAttribute("aria-pressed", "true"); b.textContent = "Pause";
  }
  function stopLecture() { if (ui.lecture) clearInterval(ui.lecture); ui.lecture = null; var b = $("#t-auto"); if (b) { b.setAttribute("aria-pressed", "false"); b.textContent = "Lecture auto"; } }
  function annonce(t) { var z = $("#tr-annonce"); z.textContent = t; z.classList.add("on"); clearTimeout(z.__t); z.__t = setTimeout(function () { z.classList.remove("on"); }, 4200); }

  function majTout() {
    var st = session(); if (!st || !$("#tr-kpis")) return;
    var s = sc(), m = marche();
    var k = st.seance - st.debut;
    $("#tr-seance").textContent = "Séance " + k + " sur " + s.seances + (st.termine ? " · terminée" : "");
    var v = M.valeur(st, m, st.seance), res = v - st.capital;
    $("#tr-kpis").innerHTML =
      kpi("Liquidités disponibles", argent(st.liquidites)) + kpi("Valeur du portefeuille", argent(v)) +
      kpi("Résultat total", '<span class="' + classe(res) + '">' + signe(res) + argent(res) + " · " + M.pct(res / st.capital) + "</span>") +
      kpi(forex() ? "Ordres exécutés" : "Frais cumulés", forex() ? String(st.executions.length) : argent(st.fraisCumules));
    ["t-1", "t-5", "t-auto"].forEach(function (id) { $("#" + id).disabled = st.termine; });
    dessiner(); majFiche(); majEvts(); majPf(); majTicket(); majTuto(); majJmini();
  }
  function kpi(l, v) { return '<div class="kpi"><span class="etiquette">' + l + "</span><b>" + v + "</b></div>"; }

  /* ---------- Graphique ---------- */
  function dessiner() {
    var z = $("#tr-svg"); if (!z || !session()) return;
    var st = session(), m = marche(), fx = forex();
    var tout = M.visibles(st, m, ui.actif), n = Math.min(ui.fenetre, tout.length), d = tout.slice(-n), i0 = tout.length - n;
    var W = Math.max(280, z.clientWidth || 600), H = W < 520 ? 260 : 330, pg = 56, pd = 10, ph = 24, vh = (!fx && ui.volumes) ? 46 : 0, pb = 24 + vh;
    var base = d[0].c;
    function val(p) { return ui.pct ? (p - base) / base * 100 : p; }
    var lo = Infinity, hi = -Infinity;
    d.forEach(function (b) { var a = ui.vue === "bougies" ? [b.h, b.l] : [b.c]; a.forEach(function (p) { lo = Math.min(lo, val(p)); hi = Math.max(hi, val(p)); }); });
    var marge = (hi - lo) * 0.08 || Math.abs(hi) * 0.02 || 1; lo -= marge; hi += marge;
    var X = function (i) { return pg + (W - pg - pd) * (n === 1 ? 0.5 : (i + 0.5) / n); };
    var Y = function (v) { return ph + (H - ph - pb) * (1 - (v - lo) / (hi - lo)); };
    var bw = Math.max(2, Math.min(14, (W - pg - pd) / n * 0.6));
    var g = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" role="img" aria-labelledby="tr-alt">';
    var ticks = 4;
    for (var t = 0; t <= ticks; t++) {
      var v = lo + (hi - lo) * t / ticks, y = Y(v);
      g += '<line x1="' + pg + '" x2="' + (W - pd) + '" y1="' + y + '" y2="' + y + '" class="grille"/><text x="' + (pg - 6) + '" y="' + (y + 4) + '" class="axe" text-anchor="end">' + (ui.pct ? (v >= 0 ? "+" : "") + v.toFixed(1).replace(".", ",") + " %" : fx ? (v / 10000).toFixed(4).replace(".", ",") : Math.round(v).toLocaleString("fr-FR")) + "</text>";
    }
    g += '<text x="4" y="10" class="axe unite">' + (ui.pct ? "% depuis le début de la fenêtre" : fx ? "USD pour 1 " + C.ACTIFS[ui.actif].base + " (bid)" : "FCFA") + "</text>";
    if (vh) {
      var vmax = Math.max.apply(null, d.map(function (b) { return b.v; })) || 1;
      d.forEach(function (b, i) { var hh = (vh - 8) * b.v / vmax; g += '<rect class="vol" x="' + (X(i) - bw / 2) + '" y="' + (H - 22 - hh) + '" width="' + bw + '" height="' + hh + '"/>'; });
    }
    if (ui.vue === "bougies") {
      d.forEach(function (b, i) {
        var up = b.c >= b.o, cx = X(i), yo = Y(val(b.o)), yc = Y(val(b.c));
        g += '<line class="meche ' + (up ? "h" : "b") + '" x1="' + cx + '" x2="' + cx + '" y1="' + Y(val(b.h)) + '" y2="' + Y(val(b.l)) + '"/>' +
          '<rect class="corps ' + (up ? "h" : "b") + '" x="' + (cx - bw / 2) + '" y="' + Math.min(yo, yc) + '" width="' + bw + '" height="' + Math.max(1, Math.abs(yc - yo)) + '"/>';
      });
    } else {
      g += '<path class="ligne" d="' + d.map(function (b, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(val(b.c)).toFixed(1); }).join("") + '"/>';
    }
    // événements publiés
    evenementsVus().forEach(function (e) { var i = e.idx - i0; if (i >= 0 && i < n && (e.actif === ui.actif)) g += '<g class="evt"><circle cx="' + X(i) + '" cy="' + (H - pb + 12) + '" r="7"/><text x="' + X(i) + '" y="' + (H - pb + 16) + '" text-anchor="middle">i</text></g>'; });
    if (ui.trades) st.ordres.forEach(function (o) {
      if (o.etat !== "exécuté" || o.actif !== ui.actif) return;
      var i = o.execution.seance - i0; if (i < 0 || i >= n) return;
      var px = forex() && o.sens === "achat" ? o.execution.prix - (st.spread[o.actif] || 0) : o.execution.prix;
      var y = Y(val(px)), a = o.sens === "achat";
      g += '<g class="trade ' + (a ? "a" : "v") + '"><path d="M' + X(i) + " " + (a ? y + 6 : y - 6) + " l-6 " + (a ? 10 : -10) + " h12z\"/><text x=\"" + X(i) + "\" y=\"" + (a ? y + 27 : y - 19) + '" text-anchor="middle">' + (a ? "A" : "V") + "</text></g>";
    });
    var sel = ui.selection != null && ui.selection.actif === ui.actif ? ui.selection.idx - i0 : -1;
    if (sel >= 0 && sel < n) g += '<line class="curseur" x1="' + X(sel) + '" x2="' + X(sel) + '" y1="' + ph + '" y2="' + (H - 22) + '"/>';
    var xs = [0, Math.floor((n - 1) / 2), n - 1];
    xs.forEach(function (i) { g += '<text class="axe" x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle">S. ' + (i0 + i - st.debut) + "</text>"; });
    g += '<rect class="capte" x="' + pg + '" y="0" width="' + (W - pg - pd) + '" height="' + H + '"/></svg>';
    z.innerHTML = g;
    var cap = $(".capte", z);
    function choisir(ev) {
      var r = z.getBoundingClientRect(), x = (ev.clientX - r.left) * (W / r.width);
      var i = Math.max(0, Math.min(n - 1, Math.floor((x - pg) / ((W - pg - pd) / n))));
      ui.selection = { actif: ui.actif, idx: i0 + i };
      dessiner(); majTuto();
    }
    cap.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") choisir(e); });
    cap.addEventListener("pointerdown", choisir);
    // en-tête et lecture
    var der = tout[tout.length - 1], prec = tout[tout.length - 2] || der, varr = (der.c - prec.c) / prec.c;
    var info = C.ACTIFS[ui.actif];
    $("#tr-gtete").innerHTML = '<b>' + esc(info.nom) + (fx ? "" : ' <span class="fictif-m">entreprise fictive</span>') + '</b><span class="tr-px">' + (fx ? "Bid " + M.taux(der.c) + " · Ask " + M.taux(der.c + (st.spread[ui.actif] || 0)) + " · Spread " + M.taux(st.spread[ui.actif] || 0) : cours(der.c) + " FCFA") + ' <span class="' + classe(varr) + '">' + signe(varr) + M.pct(varr) + "</span></span>";
    var b = sel >= 0 && sel < n ? d[sel] : null;
    $("#tr-lecture").innerHTML = b ? "<b>Séance " + (i0 + sel - st.debut) + (i0 + sel <= st.debut ? " (historique)" : "") + "</b> · Ouverture " + cours(b.o) + " · Plus haut " + cours(b.h) + " · Plus bas " + cours(b.l) + " · Clôture " + cours(b.c) + (fx ? "" : " · Volume " + b.v.toLocaleString("fr-FR")) + " · " + (b.c >= b.o ? "▲ séance en hausse" : "▼ séance en baisse")
      : (window.matchMedia("(hover:hover)").matches ? "Survolez" : "Touchez") + " une séance pour lire ses valeurs.";
    var hiP = Math.max.apply(null, d.map(function (x) { return x.h; })), loP = Math.min.apply(null, d.map(function (x) { return x.l; }));
    $("#tr-alt").textContent = "Sur les " + n + " dernières séances, " + info.nom + " passe de " + cours(d[0].c) + " à " + cours(der.c) + (fx ? "" : " FCFA") + " (" + M.pct((der.c - d[0].c) / d[0].c) + "). Plus haut " + cours(hiP) + ", plus bas " + cours(loP) + ".";
  }

  function evenementsVus() {
    var st = session(), s = sc(); if (!st) return [];
    return (s.evenements || []).filter(function (e) { return st.seance >= st.debut + e.seance; }).map(function (e) { return { actif: e.actif, titre: e.titre, texte: e.texte, seance: e.seance, idx: st.debut + e.seance }; });
  }
  function majEvts() {
    var ev = evenementsVus().slice().reverse(), z = $("#tr-evts");
    z.innerHTML = '<h3 class="tr-h3">Événements publiés</h3>' + (ev.length ? ev.map(function (e) { return '<article class="tr-evt"><span class="etiquette">Après la séance ' + e.seance + " · " + e.actif + "</span><b>" + esc(e.titre) + "</b><p>" + esc(e.texte) + "</p></article>"; }).join("") : '<p class="tr-vide">Aucune information publiée pour l’instant. Les événements apparaissent ici au fil des séances, jamais à l’avance.</p>');
  }
  function majFiche() {
    var a = C.ACTIFS[ui.actif], z = $("#tr-fiche");
    if (a.type === "devise") z.innerHTML = "<summary>Comprendre " + a.base + "/" + a.cotation + "</summary><p><b>" + a.base + "</b> est la devise achetée ou vendue (base). <b>" + a.cotation + "</b> est la devise utilisée pour exprimer son prix (cotation). Un cours de " + M.taux(a.depart) + " signifie qu’un " + (a.base === "EUR" ? "euro" : "livre") + " vaut " + (a.depart / 10000).toFixed(2).replace(".", ",") + " dollar.</p><p>Vous achetez à l’ask, vous revendez au bid. Pas d’effet de levier : vous n’achetez qu’avec les dollars que vous avez.</p>";
    else z.innerHTML = "<summary>Fiche · " + esc(a.nom) + " (" + ui.actif + ") · entreprise fictive</summary><p><b>Secteur :</b> " + a.secteur + ". " + esc(a.activite) + "</p><ul>" + a.infos.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul><p><b>Facteurs de risque :</b> " + a.risques.map(esc).join(" ; ") + ".</p><p class=\"tr-note\">Devise de cotation : XOF (franc CFA). Chiffres inventés pour l’exercice.</p>";
  }

  /* ---------- Ticket d'ordre ---------- */
  function ticket() {
    var f = $("#tr-ticket"), st = session(), fx = forex();
    f.innerHTML = '<h3 class="tr-h3">Décider</h3>' +
      '<div class="seg large" role="group" aria-label="Sens"><button type="button" data-sens="achat">Acheter</button><button type="button" data-sens="vente">Vendre</button></div>' +
      '<label>Actif<select id="k-actif">' + sc().actifs.map(function (a) { return '<option value="' + a + '">' + a + " · " + esc(C.ACTIFS[a].nom) + "</option>"; }).join("") + "</select></label>" +
      '<label>Quantité ' + (fx ? "(en " + "devise de base" + ")" : "(nombre d’actions entier)") + '<input id="k-qte" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="0"></label>' +
      '<div class="tr-rapide" id="k-rapide"></div>' +
      '<p class="tr-type">Type : <b>ordre au marché</b></p>' +
      '<dl class="tr-est" id="k-est"></dl>' +
      '<label>Pourquoi cette décision&nbsp;?<select id="k-cat"><option value="">Choisir une raison</option>' + C.JUSTIFS.map(function (j) { return "<option>" + esc(j) + "</option>"; }).join("") + "</select></label>" +
      '<label>En une phrase (facultatif)<textarea id="k-txt" maxlength="280" rows="2" placeholder="Ce que je pense au moment de décider"></textarea></label>' +
      '<p class="tr-err" id="k-err" role="alert"></p>' +
      '<div class="tr-cta"><button class="bouton bouton-principal" id="k-ok" type="submit">Vérifier l’ordre</button><button class="bouton bouton-clair" id="k-att" type="button">Attendre</button></div>' +
      '<p class="tr-note">Attendre est une décision. Notez-la avec sa raison : elle entre dans votre journal.</p>';
    var t = ui.ticket;
    $("#k-actif").value = ui.actif; $("#k-qte").value = t.qte; $("#k-cat").value = t.cat; $("#k-txt").value = t.texte;
    $$("[data-sens]", f).forEach(function (b) { b.onclick = function () { t.sens = b.dataset.sens; ui.confirme = false; majTicket(); }; });
    $("#k-actif").onchange = function () { ui.actif = this.value; ui.selection = null; ui.confirme = false; $$("[data-actif]").forEach(function (x) { x.setAttribute("aria-selected", x.dataset.actif === ui.actif); }); majTout(); };
    $("#k-qte").oninput = function () { t.qte = this.value.replace(/[^\d]/g, ""); if (this.value !== t.qte) this.value = t.qte; ui.confirme = false; majTicket(); };
    $("#k-cat").onchange = function () { t.cat = this.value; $("#k-err").textContent = ""; };
    $("#k-txt").oninput = function () { t.texte = this.value; };
    $("#k-att").onclick = function () {
      if (!t.cat) { $("#k-err").textContent = "Choisissez la raison de votre attente, même « Autre »."; return; }
      st.attentes.push({ seance: st.seance, actif: ui.actif, categorie: t.cat, texte: t.texte, le: Date.now() });
      t.cat = ""; t.texte = ""; $("#k-cat").value = ""; $("#k-txt").value = "";
      sauver(); annonce("Attente notée dans votre journal."); majJmini();
    };
    f.onsubmit = function (e) {
      e.preventDefault();
      var o = { actif: ui.actif, sens: t.sens, qte: parseInt(t.qte, 10) || 0, justification: { categorie: t.cat, texte: t.texte } };
      if (!ui.confirme) {
        if (!(o.qte > 0)) { $("#k-err").textContent = M.MESSAGES.QTE_INVALIDE; return; }
        if (!o.justification.categorie) { $("#k-err").textContent = M.MESSAGES.JUSTIF; return; }
        ui.confirme = true; ui.cle = "o" + Date.now() + Math.random().toString(36).slice(2, 7); majTicket(); return;
      }
      o.cle = ui.cle;
      var r = M.soumettre(st, marche(), o);
      if (!r.ok) { $("#k-err").textContent = r.texte; ui.confirme = false; majTicket(); return; }
      suivi("ordre-" + o.sens);
      t.qte = ""; t.cat = ""; t.texte = ""; ui.confirme = false;
      ticket(); sauver(); majTout();
      annonce(r.ordre.etat === "exécuté" ? "Ordre exécuté au cours affiché." : "Ordre enregistré : il sera exécuté à l’ouverture de la prochaine séance.");
    };
  }
  function majTicket() {
    var f = $("#tr-ticket"); if (!f || !session()) return;
    var st = session(), t = ui.ticket, fx = forex();
    $$("[data-sens]", f).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.sens === t.sens); });
    if ($("#k-actif").value !== ui.actif) $("#k-actif").value = ui.actif;
    var q = parseInt(t.qte, 10) || 0, pos = st.positions[ui.actif];
    var px = M.coursRef(st, marche(), ui.actif, "achat");
    var r = $("#k-rapide");
    if (t.sens === "vente") r.innerHTML = pos ? '<button type="button" data-q="' + pos.qte + '">Tout (' + pos.qte.toLocaleString("fr-FR") + ")</button>" + (pos.qte > 1 ? '<button type="button" data-q="' + Math.floor(pos.qte / 2) + '">La moitié</button>' : "") : '<span class="tr-vide">Vous ne détenez pas cet actif.</span>';
    else r.innerHTML = [10, 25, 50].map(function (p) { var budget = Math.floor(st.liquidites * p / 100); var qq = fx ? Math.floor(budget * 100 / px) : C.maxAchetable(px, budget, st.fraisBp); return qq > 0 ? '<button type="button" data-q="' + qq + '">≈ ' + p + " % des liquidités</button>" : ""; }).join("");
    $$("[data-q]", r).forEach(function (b) { b.onclick = function () { t.qte = b.dataset.q; $("#k-qte").value = t.qte; ui.confirme = false; majTicket(); }; });
    var est = $("#k-est");
    if (q > 0) {
      var e = M.estimer(st, marche(), { actif: ui.actif, sens: t.sens, qte: q });
      est.innerHTML = "<dt>Cours de référence" + (fx ? (t.sens === "achat" ? " (ask)" : " (bid)") : "") + "</dt><dd>" + cours(e.prix) + (fx ? "" : " FCFA") + "</dd>" +
        "<dt>Montant brut</dt><dd>" + argent(e.brut) + "</dd>" + (fx ? "" : "<dt>Frais estimés</dt><dd>" + argent(e.frais) + "</dd>") +
        "<dt>" + (t.sens === "achat" ? "Débit estimé" : "Crédit estimé") + "</dt><dd><b>" + argent(e.total) + "</b></dd>" +
        "<dt>Liquidités après</dt><dd class=\"" + (e.liquiditesApres < 0 ? "baisse" : "") + "\">" + argent(e.liquiditesApres) + "</dd>" +
        "<dt>Détenu après</dt><dd class=\"" + (e.qteApres < 0 ? "baisse" : "") + "\">" + e.qteApres.toLocaleString("fr-FR") + "</dd>" +
        "<dt>Part du portefeuille</dt><dd>" + M.pct(e.brut / Math.max(1, M.valeur(st, marche(), st.seance)), 0).replace("+", "") + "</dd>" +
        '<dd class="tr-exe">Exécution ' + e.execution + ".</dd>";
    } else est.innerHTML = '<dd class="tr-vide">Saisissez une quantité pour voir le coût estimé.</dd>';
    var ok = $("#k-ok");
    ok.textContent = ui.confirme ? "Confirmer " + (t.sens === "achat" ? "l’achat" : "la vente") + " de " + q.toLocaleString("fr-FR") + " " + ui.actif : "Vérifier l’ordre";
    ok.classList.toggle("confirme", !!ui.confirme);
    ok.disabled = st.termine; $("#k-att").disabled = st.termine;
    if (st.termine) $("#k-err").textContent = "Session terminée : plus aucun ordre possible.";
  }

  /* ---------- Portefeuille ---------- */
  function majPf() {
    var st = session(), m = marche(), z = $("#tr-pf"), fx = forex();
    var v = M.valeur(st, m, st.seance), syms = Object.keys(st.positions);
    var h = '<h3 class="tr-h3">Portefeuille</h3>';
    if (!syms.length) h += '<p class="tr-vide">Aucune position. Tout est en liquidités : ' + argent(st.liquidites) + ".</p>";
    else {
      h += '<div class="tr-table"><table><thead><tr><th>Actif</th><th>Qté</th><th>Coût de revient</th><th>Valeur' + (fx ? " (bid)" : "") + '</th><th>Latent</th><th>Part</th></tr></thead><tbody>';
      syms.forEach(function (s) {
        var p = st.positions[s], mv = M.montant(st, p.qte, M.visibles(st, m, s).pop().c), lat = mv - p.cout;
        h += "<tr><td><b>" + s + "</b></td><td>" + p.qte.toLocaleString("fr-FR") + "</td><td>" + argent(p.cout) + "</td><td>" + argent(mv) + '</td><td class="' + classe(lat) + '">' + signe(lat) + argent(lat) + "</td><td>" + Math.round(mv / v * 100) + " %</td></tr>";
      });
      h += "<tr><td><b>Liquidités</b></td><td></td><td></td><td>" + argent(st.liquidites) + "</td><td></td><td>" + Math.round(st.liquidites / v * 100) + " %</td></tr></tbody></table></div>";
      h += '<div class="tr-rep" aria-hidden="true">' + syms.map(function (s, i) { var mv = M.montant(st, st.positions[s].qte, M.visibles(st, m, s).pop().c); return '<i style="width:' + (mv / v * 100) + '%" class="c' + (i % 6) + '" title="' + s + '"></i>'; }).join("") + '<i style="width:' + (st.liquidites / v * 100) + '%" class="liq"></i></div>';
    }
    h += '<dl class="tr-mini"><dt>Résultat réalisé</dt><dd class="' + classe(st.realise) + '">' + signe(st.realise) + argent(st.realise) + "</dd>" + (fx ? "" : "<dt>Frais cumulés</dt><dd>" + argent(st.fraisCumules) + "</dd>") + "</dl>";
    z.innerHTML = h;
    var att = st.ordres.filter(function (o) { return o.etat === "en attente"; });
    $("#tr-att").innerHTML = '<h3 class="tr-h3">Ordres en attente</h3>' + (att.length ? att.map(function (o) { return '<div class="tr-ordre"><span>' + (o.sens === "achat" ? "Achat" : "Vente") + " de " + o.qte.toLocaleString("fr-FR") + " " + o.actif + " · estimé " + argent(o.estimation.total) + '</span><button type="button" class="lien-souligne" data-annuler="' + o.id + '">Annuler</button></div>'; }).join("") + '<p class="tr-note">Ils seront exécutés à l’ouverture de la prochaine séance, au prix d’alors.</p>' : '<p class="tr-vide">Aucun.</p>');
    $$("[data-annuler]").forEach(function (b) { b.onclick = function () { M.annuler(st, +b.dataset.annuler); sauver(); majTout(); }; });
  }
  function majJmini() {
    var z = $("#tr-jmini"); if (!z) return;
    var st = session(), it = journal(st).slice(-6).reverse();
    z.innerHTML = '<h3 class="tr-h3">Dernières décisions</h3>' + (it.length ? it.map(ligneJournal).join("") : '<p class="tr-vide">Aucune décision pour l’instant.</p>') + '<a class="lien-souligne" href="#decisions">Tout le journal</a>';
  }

  /* ---------- Tutoriel ---------- */
  function ctx() {
    var st = session(), m = marche();
    return { st: st, ui: ui, depart: { seance: st.tuto ? st.tuto.departSeance : st.debut },
      dernier: function (s) { return M.visibles(st, m, s).pop(); }, visibles: function (s) { return M.visibles(st, m, s); },
      F: M.fcfa, P: M.pct,
      valeurPos: function (s) { var p = st.positions[s]; return p ? M.montant(st, p.qte, M.visibles(st, m, s).pop().c) : 0; },
      valeurTotale: function () { return M.valeur(st, m, st.seance); },
      evenementsVus: evenementsVus,
      reflexions: function () { var k = 0; Object.keys(D.sessions).forEach(function (x) { if (x.indexOf("tu:") === 0) return; D.sessions[x].ordres.forEach(function (o) { if (o.reflexion) k++; }); }); return k; } };
  }
  function val(f, c) { return typeof f === "function" ? f(c) : f; }
  function majTuto() {
    var z = $("#tr-tuto"), st = session(); if (!z || !st || !st.tuto) return;
    var T = tuto(st.tuto.id), i = st.tuto.etape, c = ctx(), p = D.tutos[T.id] || (D.tutos[T.id] = { decouvert: Date.now() });
    if (p.termine && i === 0) p.revu = true;
    var h = '<p class="etiquette">Tutoriel · étape ' + Math.min(i + 1, T.etapes.length) + " sur " + T.etapes.length + '</p><div class="tr-prog"><i style="width:' + (Math.min(i, T.etapes.length) / T.etapes.length * 100) + '%"></i></div>';
    if (i >= T.etapes.length) {
      var q = T.etapes.filter(function (e) { return e.t === "qcm" || e.t === "nombre"; }), bons = q.filter(function (e, k) { return (st.tuto.reponses[T.etapes.indexOf(e)] || {}).juste; }).length;
      if ($("#tr-tmini")) $("#tr-tmini").hidden = true;
      p.termine = true; p.score = bons + "/" + q.length; p.reussi = bons >= Math.ceil(q.length * 0.7); sauver();
      h += '<h3 class="titre-tuile">Tutoriel terminé</h3><p>' + bons + " bonne(s) réponse(s) sur " + q.length + ". " + (p.reussi ? "Compétence travaillée : " + esc(T.competence) + "." : "Relisez les corrections, puis refaites le tutoriel.") + '</p>';
      var idx = C.TUTORIELS.indexOf(T), suiv = C.TUTORIELS[idx + 1];
      h += '<div class="tr-cta">' + (suiv ? '<button class="bouton bouton-principal" data-go="tu:' + suiv.id + '">Tutoriel suivant : ' + esc(suiv.titre) + "</button>" : '<a class="bouton bouton-principal" href="#parcours">Passer aux scénarios</a>') + '<button class="lien-souligne" id="tu-re">Refaire ce tutoriel</button></div>';
      z.innerHTML = h;
      var g = $("[data-go]", z); if (g) g.onclick = function () { lancer(g.dataset.go); };
      $("#tu-re").onclick = function () { delete D.sessions["tu:" + T.id]; lancer("tu:" + T.id); };
      return;
    }
    var e = T.etapes[i], rep = st.tuto.reponses[i];
    var mini = $("#tr-tmini");
    if (mini) { if (ui.onglet === "tutoriel") mini.hidden = true; else if (e.t === "action" && !e.test(st, c)) { mini.hidden = false; mini.innerHTML = "<span><b>À faire :</b> " + esc(e.consigne) + '</span><button type="button" data-ong-go="tutoriel">Tutoriel</button>'; $("[data-ong-go]", mini).onclick = function () { $('[data-ong="tutoriel"]').click(); }; } else { mini.hidden = false; mini.innerHTML = "<span>Le tutoriel vous attend pour la suite.</span>" + '<button type="button">Tutoriel</button>'; $("button", mini).onclick = function () { $('[data-ong="tutoriel"]').click(); }; } }
    h += (e.transfert ? '<p class="surtitre">Transfert · une autre situation</p>' : "");
    if (e.t === "info") h += "<p>" + esc(e.texte) + '</p><button class="bouton bouton-sombre" id="tu-ok">J’ai compris</button>';
    else if (e.t === "action") {
      var fait = e.test(st, c);
      h += '<p class="tr-act"><b>À faire :</b> ' + esc(e.consigne) + "</p>" + (e.aide ? '<p class="tr-note">' + esc(e.aide) + "</p>" : "") +
        (fait ? '<p class="hausse">✓ Fait.</p><button class="bouton bouton-sombre" id="tu-ok">Continuer</button>' : '<p class="tr-vide">En attente de votre action dans le simulateur.</p>');
    } else if (e.t === "qcm") {
      h += '<p class="tr-qq">' + esc(val(e.question, c)) + '</p><div class="tr-choix">' + e.choix.map(function (x, k) { return '<button type="button" class="choix' + (rep ? (k === e.bonne ? " juste" : k === rep.v ? " faux" : "") : "") + '" data-k="' + k + '"' + (rep ? " disabled" : "") + ">" + esc(x) + "</button>"; }).join("") + "</div>";
    } else if (e.t === "nombre") {
      h += '<p class="tr-qq">' + esc(val(e.question, c)) + '</p><form class="tr-num" id="tu-f"><input id="tu-n" inputmode="decimal" autocomplete="off" aria-label="Votre réponse"' + (rep ? ' value="' + esc(rep.v) + '" disabled' : "") + '><span>' + esc(e.unite || "") + "</span>" + (rep ? "" : '<button class="bouton bouton-sombre">Valider</button>') + "</form>";
    } else if (e.t === "texte") {
      h += '<p class="tr-qq">' + esc(e.question) + '</p><form id="tu-f"><textarea id="tu-t" rows="3" maxlength="400"' + (rep ? " disabled" : "") + ">" + esc(rep ? rep.v : "") + "</textarea>" + (rep ? "" : '<button class="bouton bouton-sombre">Enregistrer</button>') + "</form>";
    }
    if (rep && (e.t === "qcm" || e.t === "nombre" || e.t === "texte")) {
      h += '<div class="tr-corr ' + (e.t === "texte" ? "" : rep.juste ? "ok" : "ko") + '"><b>' + (e.t === "texte" ? "Repère" : rep.juste ? "Juste." : "Pas tout à fait.") + "</b> " + esc(rep.correction || val(e.correction, c)) + '</div><button class="bouton bouton-sombre" id="tu-ok">Continuer</button>';
    }
    z.innerHTML = h;
    var ok = $("#tu-ok", z); if (ok) ok.onclick = function () { st.tuto.etape++; sauver(); majTuto(); };
    $$(".choix", z).forEach(function (b) { b.onclick = function () { var k = +b.dataset.k; st.tuto.reponses[i] = { v: k, juste: k === e.bonne, correction: val(e.correction, c) }; sauver(); majTuto(); }; });
    var f = $("#tu-f", z);
    if (f) f.onsubmit = function (ev) {
      ev.preventDefault();
      if (e.t === "texte") { var tx = $("#tu-t").value.trim(); if (!tx) return; st.tuto.reponses[i] = { v: tx, juste: true }; }
      else {
        var raw = $("#tu-n").value.replace(/\s/g, "").replace(",", ".").replace("−", "-");
        if (raw === "" || isNaN(+raw)) { $("#tu-n").focus(); return; }
        var attendu = e.reponse(c);
        st.tuto.reponses[i] = { v: $("#tu-n").value, juste: Math.abs(+raw - attendu) <= (e.tol || 0) + 1e-9, correction: val(e.correction, c) };
      }
      sauver(); majTuto();
    };
  }

  /* ================= Mes décisions ================= */
  function journal(st) {
    var it = st.ordres.map(function (o) { return { type: "ordre", o: o, seance: o.seanceSoumission, le: o.soumisLe }; })
      .concat((st.attentes || []).map(function (a) { return { type: "attente", a: a, seance: a.seance, le: a.le }; }));
    return it.sort(function (x, y) { return x.le - y.le; });
  }
  function ligneJournal(x) {
    var st = session();
    if (x.type === "attente") return '<div class="tr-j att"><span class="etiquette">Séance ' + (x.seance - st.debut) + " · " + x.a.actif + "</span><b>Attendre</b><small>" + esc(x.a.categorie) + (x.a.texte ? " · « " + esc(x.a.texte) + " »" : "") + "</small></div>";
    var o = x.o;
    return '<div class="tr-j"><span class="etiquette">Séance ' + (o.seanceSoumission - st.debut) + " · " + o.actif + " · " + o.etat + "</span><b>" + (o.sens === "achat" ? "Achat" : "Vente") + " de " + o.qte.toLocaleString("fr-FR") + "</b><small>" + esc(o.justification.categorie) + "</small></div>";
  }
  function choixSession(cb) {
    var cles = Object.keys(D.sessions).filter(function (k) { return k.indexOf("tu:") !== 0 || D.sessions[k].ordres.length; });
    if (!cles.length) return "";
    return '<label class="tr-sel">Session<select id="tr-choix-s">' + cles.map(function (k) { return '<option value="' + k + '"' + (k === D.active ? " selected" : "") + ">" + esc(D.sessions[k].libelle) + (D.sessions[k].mode === "libre" && k.indexOf("sr:") === 0 ? " (libre)" : "") + "</option>"; }).join("") + "</select></label>";
  }
  function brancherChoix(f) { var s = $("#tr-choix-s"); if (s) s.onchange = function () { D.active = this.value; ui.actif = scenarioDe(D.active).actifs[0]; sauver(); f(); }; }

  function vDecisions() {
    var st = session();
    if (!st) { vue.innerHTML = '<section class="tr-bloc"><h2>Mes décisions</h2><p>Votre journal se remplit à chaque ordre et à chaque attente notée.</p><a class="bouton bouton-principal" href="#parcours">Choisir une simulation</a></section>'; return; }
    var it = journal(st).slice().reverse(), m = marche();
    var h = '<section class="tr-bloc"><div class="tr-ent"><div><p class="surtitre">Mes décisions</p><h2>Ce que je pensais avant, ce que je comprends après</h2></div>' + choixSession() + '</div><p class="lead">La raison donnée au moment de décider ne se modifie pas. Ce que vous comprenez après s’ajoute à côté.</p>';
    if (!it.length) h += '<p class="tr-vide">Aucune décision dans cette session.</p>';
    it.forEach(function (x) {
      if (x.type === "attente") { h += '<article class="carte tr-dec"><p class="etiquette">Séance ' + (x.seance - st.debut) + " · " + x.a.actif + '</p><h3 class="titre-tuile">Attendre</h3><p class="tr-avant"><b>Avant :</b> ' + esc(x.a.categorie) + (x.a.texte ? " · « " + esc(x.a.texte) + " »" : "") + "</p></article>"; return; }
      var o = x.o, e = o.execution, fx = forex();
      var resultat = "";
      if (o.etat === "exécuté" && o.sens === "vente") resultat = '<dt>Résultat réalisé net</dt><dd class="' + classe(e.resultat) + '">' + signe(e.resultat) + argent(e.resultat) + "</dd>";
      h += '<article class="carte tr-dec"><p class="etiquette">Séance ' + (o.seanceSoumission - st.debut) + " · soumis le " + new Date(o.soumisLe).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) + '</p><h3 class="titre-tuile">' + (o.sens === "achat" ? "Achat" : "Vente") + " de " + o.qte.toLocaleString("fr-FR") + " " + o.actif + ' <span class="pastille ' + (o.etat === "exécuté" ? "ok" : o.etat === "rejeté" ? "ko" : "cours") + '">' + o.etat + "</span></h3>" +
        '<dl class="tr-est"><dt>Estimation à la soumission</dt><dd>' + cours(o.estimation.prix) + " · " + argent(o.estimation.total) + "</dd>" +
        (e ? "<dt>Exécuté</dt><dd>" + cours(e.prix) + " · séance " + (e.seance - st.debut) + " (" + e.moment + ")" + (fx ? "" : " · frais " + argent(e.frais)) + " · " + argent(e.total) + "</dd>" + resultat : "") +
        (o.etat === "rejeté" ? "<dt>Motif</dt><dd>" + esc(o.motif) + "</dd>" : "") + "</dl>" +
        '<p class="tr-avant"><b>Ce que je pensais avant :</b> ' + esc(o.justification.categorie) + (o.justification.texte ? " · « " + esc(o.justification.texte) + " »" : "") + "</p>" +
        (o.reflexion ? '<p class="tr-apres"><b>Ce que je comprends après</b> (séance ' + (o.reflexion.seance - st.debut) + ") : " + esc(o.reflexion.texte) + "</p>" :
          (o.etat === "exécuté" ? '<form class="tr-refl" data-id="' + o.id + '"><label>Ce que je comprends après<textarea rows="2" maxlength="400" placeholder="Avec le recul, qu’avez-vous appris de cette décision ?"></textarea></label><button class="bouton bouton-sombre">Ajouter</button></form>' : "")) +
        "</article>";
    });
    h += "</section>";
    vue.innerHTML = h; brancherChoix(vDecisions);
    $$(".tr-refl", vue).forEach(function (f) { f.onsubmit = function (e) { e.preventDefault(); var t = $("textarea", f).value.trim(); if (!t) return; M.reflechir(st, +f.dataset.id, t); sauver(); suivi("reflexion"); vDecisions(); }; });
  }

  /* ================= Mon bilan ================= */
  function vBilan() {
    var st = session();
    var comp = '<section class="tr-bloc"><p class="surtitre">Mes compétences</p><h2>Ce que vous avez travaillé</h2><p class="lead">Évalué séparément de vos résultats financiers fictifs.</p><div class="tr-comps">' +
      C.TUTORIELS.map(function (t) { var s = statutTuto(t.id), p = D.tutos[t.id] || {}; return '<div class="tr-cp"><span class="pastille ' + s[1] + '">' + s[0] + "</span><b>" + esc(t.competence) + "</b><small>" + esc(t.titre) + (p.score ? " · " + p.score : "") + "</small></div>"; }).join("") + "</div></section>";
    if (!st) { vue.innerHTML = '<section class="tr-bloc"><h2>Mon bilan</h2><p>Votre bilan apparaît après une première session.</p></section>' + comp; return; }
    var m = marche(), b = M.bilan(st, m), s = sc(), fx = forex();
    var vals = st.valorisations.filter(function (x) { return x.moment === "clôture"; });
    var h = '<section class="tr-bloc"><div class="tr-ent"><div><p class="surtitre">Mon bilan · ' + esc(st.libelle) + '</p><h2>' + (st.termine ? "Session terminée" : "Bilan provisoire") + "</h2></div>" + choixSession() + "</div>" +
      '<div class="tr-bil">' +
      bq("1. Quel capital ai-je utilisé ?", argent(b.capital), "Capital fictif de départ, fixé par le scénario.") +
      bq("2. Quelle part ai-je exposée ?", Math.round(b.exposition * 100) + " % aujourd’hui", "Au plus haut : " + Math.round(b.expositionMax * 100) + " % du portefeuille placé.") +
      bq("3. Quel résultat, après frais ?", '<span class="' + classe(b.resultat) + '">' + signe(b.resultat) + argent(b.resultat) + " (" + M.pct(b.rendement) + ")</span>", "Réalisé " + argent(b.realise) + " · latent " + argent(b.latent) + (fx ? "" : " · frais payés " + argent(b.frais))) +
      bq("4. Quelle baisse ai-je traversée ?", "−" + (b.baisseMax * 100).toFixed(1).replace(".", ",") + " %", "Plus forte baisse du portefeuille depuis un sommet, mesurée à chaque clôture et après chaque exécution.") +
      "</div>" +
      '<div class="carte"><h3 class="tr-h3">Valeur du portefeuille, séance par séance</h3><div id="tr-courbe"></div></div>' +
      '<div class="carte"><h3 class="tr-h3">5. Mes décisions correspondaient-elles à mes justifications&nbsp;?</h3>' + tableDecisions(st, m) + "</div>" +
      '<div class="carte"><h3 class="tr-h3">6. Que ferais-je différemment dans un autre scénario&nbsp;?</h3>' + (s.transfert ? '<p class="tr-qq">' + esc(s.transfert) + "</p>" : "") +
      '<form id="tr-bf"><textarea id="tr-bt" rows="3" maxlength="600">' + esc(st.bilanReponses.diff || "") + '</textarea><button class="bouton bouton-sombre">Enregistrer</button> <span class="tr-note" id="tr-bs"></span></form></div>' +
      '<p class="tr-note">Un bénéfice fictif ne prouve pas une compétence, et une perte fictive ne prouve pas une erreur. Ces chiffres ne prévoient pas ce qui se passerait sur un marché réel.</p></section>' + comp;
    vue.innerHTML = h; brancherChoix(vBilan);
    $("#tr-bf").onsubmit = function (e) { e.preventDefault(); st.bilanReponses.diff = $("#tr-bt").value; sauver(); $("#tr-bs").textContent = "Enregistré."; };
    courbe($("#tr-courbe"), vals, st);
  }
  function bq(q, v, n) { return '<div class="carte tr-bq"><p class="etiquette">' + q + '</p><p class="chiffre-cle">' + v + "</p><p class=\"tr-note\">" + n + "</p></div>"; }
  function tableDecisions(st, m) {
    var o = st.ordres.filter(function (x) { return x.etat === "exécuté"; });
    if (!o.length && !(st.attentes || []).length) return '<p class="tr-vide">Aucune décision exécutée.</p>';
    return '<div class="tr-table gauche"><table><thead><tr><th>Séance</th><th>Décision</th><th>Raison donnée</th><th>Ce qui s’est passé ensuite</th></tr></thead><tbody>' +
      o.map(function (x) {
        var apres = M.visibles(st, m, x.actif).pop().c, e = x.execution, prix = e.prix, d = (apres - prix) / prix;
        var lu = x.sens === "vente" ? "Résultat réalisé " + argent(e.resultat) + " · depuis, le cours a " + (d >= 0 ? "monté" : "baissé") + " de " + M.pct(Math.abs(d)).replace("+", "") : "Depuis l’achat, le cours a " + (d >= 0 ? "monté" : "baissé") + " de " + M.pct(Math.abs(d)).replace("+", "");
        return "<tr><td>" + (e.seance - st.debut) + "</td><td>" + (x.sens === "achat" ? "Achat " : "Vente ") + x.qte.toLocaleString("fr-FR") + " " + x.actif + "</td><td>" + esc(x.justification.categorie) + (x.justification.texte ? "<br><small>« " + esc(x.justification.texte) + " »</small>" : "") + "</td><td>" + lu + "</td></tr>";
      }).join("") + (st.attentes || []).map(function (a) { return "<tr><td>" + (a.seance - st.debut) + "</td><td>Attendre · " + a.actif + "</td><td>" + esc(a.categorie) + "</td><td>—</td></tr>"; }).join("") + "</tbody></table></div><p class=\"tr-note\">Relisez chaque ligne : la raison tenait-elle avec ce que vous saviez à ce moment-là&nbsp;? Ajoutez vos réflexions dans « Mes décisions ».</p>";
  }
  function courbe(z, vals, st) {
    var W = Math.max(280, z.clientWidth || 600), H = 180, p = 50;
    var v = vals.map(function (x) { return x.valeur; }), lo = Math.min.apply(null, v.concat(st.capital)), hi = Math.max.apply(null, v.concat(st.capital)), mg = (hi - lo) * 0.1 || hi * 0.01;
    lo -= mg; hi += mg;
    var X = function (i) { return p + (W - p - 10) * (v.length < 2 ? 0.5 : i / (v.length - 1)); }, Y = function (x) { return 10 + (H - 34) * (1 - (x - lo) / (hi - lo)); };
    var g = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="Valeur du portefeuille : de ' + argent(v[0]) + " à " + argent(v[v.length - 1]) + '">';
    g += '<line class="ref" x1="' + p + '" x2="' + (W - 10) + '" y1="' + Y(st.capital) + '" y2="' + Y(st.capital) + '"/><text class="axe" x="' + (p - 6) + '" y="' + (Y(st.capital) + 4) + '" text-anchor="end">départ</text>';
    g += '<path class="ligne pf" d="' + v.map(function (x, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(x).toFixed(1); }).join("") + '"/>';
    g += '<text class="axe" x="' + p + '" y="' + (H - 6) + '">Séance 0</text><text class="axe" x="' + (W - 10) + '" y="' + (H - 6) + '" text-anchor="end">Séance ' + (v.length - 1) + "</text></svg>";
    z.innerHTML = g;
  }

  /* ================= Mon groupe ================= */
  function vGroupe() {
    vue.innerHTML = '<section class="tr-bloc"><p class="surtitre">Mon groupe</p><h2>Pratiquer avec un formateur</h2>' +
      '<p class="lead">Un enseignant ou un animateur choisit le scénario, l’échéance et les notions, puis suit la progression du groupe. Chaque participant a son propre marché : vos ordres ne changent pas les cours des autres.</p>' +
      '<div class="tr-scs"><div class="carte"><h3 class="titre-tuile">Vous avez un code de groupe</h3><form id="tr-gf" class="tr-num"><input id="tr-gc" placeholder="EFA-XXXX-XXXX" autocomplete="off" aria-label="Code du groupe"><button class="bouton bouton-sombre">Rejoindre</button></form><p class="tr-note" id="tr-gm" role="status"></p></div>' +
      '<div class="carte"><h3 class="titre-tuile">Vous êtes formateur ou organisation</h3><p>Groupes, exercices assignés et tableau de bord du formateur arrivent avec les comptes EFA Traders. Écrivez-nous pour préparer une cohorte pilote.</p><a class="bouton bouton-principal" href="organisations.html?src=traders">Former un groupe</a></div></div>' +
      '<p class="tr-note">Les réponses individuelles des autres membres ne sont jamais visibles. Le formateur ne peut pas modifier vos décisions.</p></section>';
    $("#tr-gf").onsubmit = function (e) { e.preventDefault(); var v = $("#tr-gc").value.trim().toUpperCase(); $("#tr-gm").textContent = v ? "Les groupes EFA Traders ouvrent avec les comptes. Gardez ce code : votre formateur vous dira quand l’utiliser. En attendant, suivez les tutoriels : votre progression est gardée sur cet appareil." : "Saisissez le code donné par votre formateur."; if (v) { D.groupe = v; sauver(); } };
    if (D.groupe) $("#tr-gc").value = D.groupe;
  }

  /* ================= Glossaire ================= */
  function vGlossaire() {
    vue.innerHTML = '<section class="tr-bloc"><p class="surtitre">Glossaire</p><h2>Les mots du marché, simplement</h2><label class="tr-sel">Chercher un mot<input id="tr-gq" type="search" autocomplete="off"></label><dl class="tr-glo" id="tr-gl"></dl></section>';
    function f() { var q = $("#tr-gq").value.trim().toLowerCase(); $("#tr-gl").innerHTML = C.GLOSSAIRE.filter(function (g) { return !q || (g[0] + " " + g[1]).toLowerCase().indexOf(q) >= 0; }).map(function (g) { return "<dt>" + esc(g[0]) + "</dt><dd>" + esc(g[1]) + "</dd>"; }).join("") || '<dd class="tr-vide">Aucun mot trouvé.</dd>'; }
    $("#tr-gq").oninput = f; f();
  }

  /* ---------- Démarrage ---------- */
  document.addEventListener("visibilitychange", function () { if (document.hidden) stopLecture(); });
  window.addEventListener("hashchange", route);
  if (D.active && !D.sessions[D.active]) D.active = null;
  if (D.active) ui.actif = (D.sessions[D.active].ui && D.sessions[D.active].ui.actif) || scenarioDe(D.active).actifs[0];
  route();
  window.EFA_TR_UI = { D: D, ui: ui, lancer: lancer };
})();
