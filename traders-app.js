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
    ui.ticket = { sens: "achat", qte: "", cat: "", texte: "", type: "marché", prix: "", valid: "5" }; ui.confirme = false;
    ui.actif = st2.ui && st2.ui.actif || scenarioDe(cle).actifs[0];
    ui.selection = null;
    sauver();
  }

  /* ---------- Interface ---------- */
  var ui = { vue: "ligne", fenetre: 30, pct: false, volumes: true, trades: true, actif: null, selection: null, onglet: "marche", lecture: null, ticket: { sens: "achat", qte: "", cat: "", texte: "" }, confirme: false };
  var RUB = [["decouvrir", "Découvrir"], ["cours", "Le cours"], ["parcours", "Mes parcours"], ["simuler", "Simuler"], ["decisions", "Mes décisions"], ["bilan", "Mon bilan"], ["groupe", "Mon groupe"], ["glossaire", "Glossaire"]];
  var vue = $("#tr-vue");

  function route() {
    var h = (location.hash || "").replace("#", "") || (D.active ? "simuler" : "decouvrir"), chap = null;
    if (/^cours-c\d+$/.test(h)) { chap = h.slice(6); h = "cours"; }
    if (!RUB.some(function (r) { return r[0] === h; })) h = "decouvrir";
    stopLecture();
    var an = $("#tr-annonce"); if (an) an.classList.remove("on");
    $$(".tr-rub a").forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + h ? "page" : "false"); });
    if (chap) { vChapitre(chap); vue.focus({ preventScroll: true }); window.scrollTo({ top: Math.max(0, $("#tr").getBoundingClientRect().top + window.scrollY - 84) }); return; }
    ({ decouvrir: vDecouvrir, cours: vCours, parcours: vParcours, simuler: vSimuler, decisions: vDecisions, bilan: vBilan, groupe: vGroupe, glossaire: vGlossaire })[h]();
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
      '<div class="tr-cta"><button class="bouton bouton-principal" data-go="tu:t1">Ma première simulation guidée</button><a class="bouton bouton-clair" href="#cours">Le cours de finance de marché</a></div>' +
      '<p class="tr-note">Pour la finance d’entreprise (comptes, VAN, financement, valorisation) : <a href="corporate.html?src=traders">EFA Corporate Finance</a>.</p>' +
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
    st.ordres.forEach(function (o) {
      if (o.etat !== "en attente" || o.actif !== ui.actif || !o.type || o.type === "marché") return;
      var pv = o.type === "limite" ? o.limite : o.seuil; if (forex() && o.sens === "achat") pv -= (st.spread[o.actif] || 0);
      var y = Y(val(pv)); if (y < ph || y > H - pb) return;
      g += '<g class="attente"><line x1="' + pg + '" x2="' + (W - pd) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (W - pd - 4) + '" y="' + (y - 5) + '" text-anchor="end">' + (o.type === "limite" ? "Limite " : "Stop ") + (o.sens === "achat" ? "achat" : "vente") + "</text></g>";
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
      (st.execution === "immediat" ? '<p class="tr-type">Type : <b>ordre au marché</b>, exécuté au cours affiché</p>' :
        '<p class="tr-lab">Type d’ordre</p><div class="seg large" role="group" aria-label="Type d’ordre"><button type="button" data-type="marché">Au marché</button><button type="button" data-type="limite">Limité</button><button type="button" data-type="stop">Stop</button></div>' +
        '<div class="tr-px2" id="k-pxz"><label><span id="k-pxl">Prix limite</span><input id="k-px" inputmode="decimal" autocomplete="off"></label><label>Validité<select id="k-val"><option value="1">1 séance</option><option value="5">5 séances</option><option value="10">10 séances</option><option value="20">20 séances</option></select></label></div>' +
        '<p class="tr-note" id="k-tyn"></p>') +
      '<dl class="tr-est" id="k-est"></dl>' +
      '<label>Pourquoi cette décision&nbsp;?<select id="k-cat"><option value="">Choisir une raison</option>' + C.JUSTIFS.map(function (j) { return "<option>" + esc(j) + "</option>"; }).join("") + "</select></label>" +
      '<label>En une phrase (facultatif)<textarea id="k-txt" maxlength="280" rows="2" placeholder="Ce que je pense au moment de décider"></textarea></label>' +
      '<p class="tr-err" id="k-err" role="alert"></p>' +
      '<div class="tr-cta"><button class="bouton bouton-principal" id="k-ok" type="submit">Vérifier l’ordre</button><button class="bouton bouton-clair" id="k-att" type="button">Attendre</button></div>' +
      '<p class="tr-note">Attendre est une décision. Notez-la avec sa raison : elle entre dans votre journal.</p>';
    var t = ui.ticket;
    $("#k-actif").value = ui.actif; $("#k-qte").value = t.qte; $("#k-cat").value = t.cat; $("#k-txt").value = t.texte;
    t.type = t.type || "marché"; t.prix = t.prix || ""; t.valid = t.valid || "5";
    if ($("#k-px")) { $("#k-px").value = t.prix; $("#k-val").value = t.valid;
      $$("[data-type]", f).forEach(function (b) { b.onclick = function () { t.type = b.dataset.type; if (!t.prix) { var c0 = M.coursRef(st, marche(), ui.actif, t.sens); t.prix = fx ? M.taux(c0) : String(c0); $("#k-px").value = t.prix; } ui.confirme = false; majTicket(); }; });
      $("#k-px").oninput = function () { t.prix = this.value; ui.confirme = false; majTicket(); };
      $("#k-val").onchange = function () { t.valid = this.value; }; }
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
      var o = ordreDuTicket();
      if (!ui.confirme) {
        if (!(o.qte > 0)) { $("#k-err").textContent = M.MESSAGES.QTE_INVALIDE; return; }
        if (!o.justification.categorie) { $("#k-err").textContent = M.MESSAGES.JUSTIF; return; }
        if (o.type !== "marché" && !((o.limite || o.seuil) > 0)) { $("#k-err").textContent = M.MESSAGES.PRIX; return; }
        ui.confirme = true; ui.cle = "o" + Date.now() + Math.random().toString(36).slice(2, 7); majTicket(); return;
      }
      o.cle = ui.cle;
      var r = M.soumettre(st, marche(), o);
      if (!r.ok) { $("#k-err").textContent = r.texte; ui.confirme = false; majTicket(); return; }
      suivi("ordre-" + o.sens);
      t.qte = ""; t.cat = ""; t.texte = ""; t.prix = ""; t.type = "marché"; ui.confirme = false;
      ticket(); sauver(); majTout();
      annonce(r.ordre.etat === "exécuté" ? "Ordre exécuté au cours affiché." : r.ordre.type === "marché" ? "Ordre enregistré : il sera exécuté à l’ouverture de la prochaine séance." : "Ordre " + (r.ordre.type === "limite" ? "à cours limité" : "stop") + " enregistré : il attend que le marché atteigne votre prix, " + r.ordre.validite + " séance(s) au plus.");
    };
  }
  function lirePrix(v) { var x = parseFloat(String(v || "").replace(/\s/g, "").replace(",", ".")); if (!(x > 0)) return 0; return forex() ? Math.round(x * 10000) : Math.round(x); }
  function ordreDuTicket() {
    var t = ui.ticket, st = session(), type = st.execution === "immediat" ? "marché" : (t.type || "marché");
    var o = { actif: ui.actif, sens: t.sens, qte: parseInt(t.qte, 10) || 0, type: type, justification: { categorie: t.cat, texte: t.texte } };
    if (type === "limite") o.limite = lirePrix(t.prix); if (type === "stop") o.seuil = lirePrix(t.prix);
    if (type !== "marché") o.validite = parseInt(t.valid, 10) || 5;
    return o;
  }
  function majTicket() {
    var f = $("#tr-ticket"); if (!f || !session()) return;
    var st = session(), t = ui.ticket, fx = forex();
    $$("[data-sens]", f).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.sens === t.sens); });
    if ($("#k-actif").value !== ui.actif) $("#k-actif").value = ui.actif;
    if ($("#k-pxz")) {
      var ty = t.type || "marché";
      $$("[data-type]", f).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.type === ty); });
      $("#k-pxz").hidden = ty === "marché";
      $("#k-pxl").textContent = ty === "stop" ? "Seuil de déclenchement" + (fx ? "" : " (FCFA)") : "Prix limite" + (fx ? "" : " (FCFA)");
      $("#k-tyn").textContent = ty === "marché" ? "Exécuté à l’ouverture de la prochaine séance, au prix d’alors." : ty === "limite" ? (t.sens === "achat" ? "Vous ne paierez jamais plus que ce prix. Si le marché ne l’atteint pas, l’ordre expire." : "Vous ne vendrez jamais moins cher que ce prix. Si le marché ne l’atteint pas, l’ordre expire.") : (t.sens === "vente" ? "Si le cours descend jusqu’au seuil, vous vendez. Le prix final peut être moins bon que le seuil." : "Si le cours monte jusqu’au seuil, vous achetez. Le prix final peut être moins bon que le seuil.");
    }
    var q = parseInt(t.qte, 10) || 0, pos = st.positions[ui.actif];
    var px = M.coursRef(st, marche(), ui.actif, "achat");
    var r = $("#k-rapide");
    if (t.sens === "vente") r.innerHTML = pos ? '<button type="button" data-q="' + pos.qte + '">Tout (' + pos.qte.toLocaleString("fr-FR") + ")</button>" + (pos.qte > 1 ? '<button type="button" data-q="' + Math.floor(pos.qte / 2) + '">La moitié</button>' : "") : '<span class="tr-vide">Vous ne détenez pas cet actif.</span>';
    else r.innerHTML = [10, 25, 50].map(function (p) { var budget = Math.floor(st.liquidites * p / 100); var qq = fx ? Math.floor(budget * 100 / px) : C.maxAchetable(px, budget, st.fraisBp); return qq > 0 ? '<button type="button" data-q="' + qq + '">≈ ' + p + " % des liquidités</button>" : ""; }).join("");
    $$("[data-q]", r).forEach(function (b) { b.onclick = function () { t.qte = b.dataset.q; $("#k-qte").value = t.qte; ui.confirme = false; majTicket(); }; });
    var est = $("#k-est");
    if (q > 0) {
      var oo = ordreDuTicket(), e = (oo.type !== "marché" && !((oo.limite || oo.seuil) > 0)) ? null : M.estimer(st, marche(), oo);
      if (!e) { est.innerHTML = '<dd class="tr-vide">Indiquez votre prix pour voir l’estimation.</dd>'; } else
      est.innerHTML = "<dt>" + (oo.type === "limite" ? "Prix limite" : oo.type === "stop" ? "Seuil de déclenchement" : "Cours de référence" + (fx ? (t.sens === "achat" ? " (ask)" : " (bid)") : "")) + "</dt><dd>" + cours(e.prix) + (fx ? "" : " FCFA") + "</dd>" +
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
    $("#tr-att").innerHTML = '<h3 class="tr-h3">Ordres en attente</h3>' + (att.length ? att.map(function (o) { var ty = o.type === "limite" ? " · limité à " + cours(o.limite) : o.type === "stop" ? " · stop à " + cours(o.seuil) : " · au marché"; var reste = o.type && o.type !== "marché" ? " · encore " + Math.max(1, o.seanceSoumission + o.validite - st.seance) + " séance(s)" : ""; return '<div class="tr-ordre"><span>' + (o.sens === "achat" ? "Achat" : "Vente") + " de " + o.qte.toLocaleString("fr-FR") + " " + o.actif + ty + reste + '</span><button type="button" class="lien-souligne" data-annuler="' + o.id + '">Annuler</button></div>'; }).join("") + '<p class="tr-note">Au marché : exécutés à l’ouverture suivante. Limités et stops : quand le marché atteint leur prix, sinon ils expirent.</p>' : '<p class="tr-vide">Aucun.</p>');
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
      h += '<article class="carte tr-dec"><p class="etiquette">Séance ' + (o.seanceSoumission - st.debut) + " · soumis le " + new Date(o.soumisLe).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) + '</p><h3 class="titre-tuile">' + (o.sens === "achat" ? "Achat" : "Vente") + " de " + o.qte.toLocaleString("fr-FR") + " " + o.actif + ' <span class="pastille ' + (o.etat === "exécuté" ? "ok" : o.etat === "rejeté" ? "ko" : o.etat === "expiré" ? "moyen" : "cours") + '">' + o.etat + "</span></h3>" +
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
    if (K) comp += '<section class="tr-bloc"><p class="surtitre">Le cours</p><h2>Chapitres travaillés</h2><div class="tr-comps">' + K.CHAPITRES.map(function (c, i) { var e = etatCh(c); return '<a class="tr-cp" href="#cours-' + c.id + '"><span class="pastille ' + (e.s === "fait" ? (e.j >= Math.ceil(c.exos.length * .7) ? "ok" : "moyen") : e.s === "cours" ? "cours" : "") + '">' + (e.s === "fait" ? "Fait · " + e.j + "/" + c.exos.length : e.s === "cours" ? "Commencé" : "À faire") + "</span><b>" + (i + 1) + ". " + esc(c.titre) + "</b><small>" + esc(c.objectifs[0]) + "</small></a>"; }).join("") + "</div></section>";
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

  /* ================= Le cours ================= */
  var K = window.EFA_TR_COURS;
  function progCh(id) { D.cours = D.cours || {}; return D.cours[id] || (D.cours[id] = { rep: {} }); }
  function etatCh(c) {
    var p = (D.cours || {})[c.id]; if (!p) return { s: "", n: 0 };
    var n = Object.keys(p.rep || {}).length, j = Object.keys(p.rep || {}).filter(function (k) { return p.rep[k].juste; }).length;
    if (n >= c.exos.length) return { s: "fait", n: n, j: j };
    return { s: p.lu ? "cours" : "", n: n, j: j };
  }
  function numCh(c) { return K.CHAPITRES.indexOf(c) + 1; }
  function vCours() {
    if (!K) { vue.innerHTML = '<p class="tr-vide">Le cours n’a pas pu se charger.</p>'; return; }
    var faits = K.CHAPITRES.filter(function (c) { return etatCh(c).s === "fait"; }).length;
    var suite = K.CHAPITRES.filter(function (c) { return etatCh(c).s !== "fait"; })[0];
    var h = '<section class="tr-bloc"><div class="tr-ph"><div class="tr-ph-t"><p class="surtitre">Le cours</p><h2>La finance de marché, du premier chapitre à la pratique</h2>' +
      '<p class="lead">Quatorze chapitres, niveau premier cycle universitaire. Chacun donne les notions, les formules et des exemples en FCFA, puis des exercices corrigés et un passage au simulateur.</p></div>' +
      '<div class="tr-suite"><p class="etiquette">Votre progression</p><p class="tr-suite-n"><b>' + faits + "</b> / " + K.CHAPITRES.length + ' chapitres</p><div class="tr-barre" aria-hidden="true"><i style="width:' + (faits / K.CHAPITRES.length * 100) + '%"></i></div>' +
      (suite ? '<a class="bouton bouton-principal" href="#cours-' + suite.id + '">' + (faits ? "Continuer" : "Commencer") + " : chapitre " + numCh(suite) + "</a>" : '<a class="bouton bouton-principal" href="#bilan">Voir mon bilan</a>') + "</div></div>";
    h += '<div class="tr-chaps">';
    K.PARTIES.forEach(function (pa, pi) {
      var chs = K.CHAPITRES.filter(function (c) { return c.partie === pa.id; });
      h += '<section class="tr-chap"><header><span class="tr-chap-n">' + pa.id + '</span><div><h3>' + esc(pa.titre) + "</h3><p>" + esc(pa.sous) + '</p></div></header><ol class="tr-liste">';
      chs.forEach(function (c) {
        var e = etatCh(c);
        h += '<li><a class="tr-ligne ' + (e.s === "fait" ? "fait" : e.s === "cours" ? "cours" : suite === c ? "suivant" : "") + '" href="#cours-' + c.id + '"><span class="tr-pt">' + (e.s === "fait" ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : numCh(c)) + '</span><span class="tr-lt"><b>' + esc(c.titre) + "</b><small>" + esc(c.objectifs[0]) + '</small></span><span class="tr-lm">' + (e.s === "fait" ? '<span class="pastille ' + (e.j >= Math.ceil(c.exos.length * .7) ? "ok" : "moyen") + '">' + e.j + "/" + c.exos.length + "</span>" : '<span class="tr-duree">' + c.duree + "</span>") + '</span><span class="tr-chev"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></span></a></li>';
      });
      h += "</ol></section>";
    });
    h += '</div><p class="tr-note">Pour un enseignant : le programme, les durées et les compétences de chaque chapitre sont dans « Mon groupe », prêts à imprimer.</p></section>';
    vue.innerHTML = h;
  }

  function fmt(n, d) { return Number(n).toLocaleString("fr-FR", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).replace(/ | /g, " "); }
  function vChapitre(id) {
    var c = K && K.CHAPITRES.filter(function (x) { return x.id === id; })[0];
    if (!c) return vCours();
    var p = progCh(c.id); p.lu = true; sauver();
    var i = K.CHAPITRES.indexOf(c), prev = K.CHAPITRES[i - 1], next = K.CHAPITRES[i + 1], pa = K.PARTIES.filter(function (x) { return x.id === c.partie; })[0];
    var h = '<article class="tr-chapitre"><p class="tr-fil"><a href="#cours">Le cours</a> · Partie ' + pa.id + " · " + esc(pa.titre) + '</p>' +
      '<p class="etiquette">Chapitre ' + (i + 1) + " sur " + K.CHAPITRES.length + " · " + c.duree + '</p><h2>' + esc(c.titre) + "</h2>" +
      '<div class="tr-obj"><p class="etiquette">À la fin du chapitre, vous saurez</p><ul>' + c.objectifs.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul></div>";
    c.sections.forEach(function (sct) {
      h += '<section class="tr-sec"><h3>' + esc(sct.t) + "</h3>" + (sct.p || []).map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") +
        (sct.liste ? "<ul>" + sct.liste.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") +
        (sct.f ? '<p class="tr-f">' + esc(sct.f) + "</p>" : "") + (sct.ex ? '<p class="tr-ex"><b>Exemple.</b> ' + esc(sct.ex) + "</p>" : "") +
        (sct.carnet ? carnetHTML() : "") + "</section>";
    });
    if (c.outil) h += '<section class="tr-outil" id="tr-outil" data-outil="' + c.outil + '"></section>';
    h += '<div class="tr-ret"><p class="etiquette">À retenir</p><ul>' + c.retenir.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    h += '<section class="tr-exos"><h3>Exercices</h3><p class="tr-note">La correction s’affiche après votre réponse. Le dernier exercice est un cas différent : il vérifie que vous savez appliquer.</p>';
    c.exos.forEach(function (e, k) { h += '<div class="tr-exo" data-k="' + k + '"></div>'; });
    h += "</section>";
    if (c.pratique) h += '<div class="tr-prat"><div><p class="etiquette">En pratique</p><p>' + esc(c.pratique.texte) + "</p></div>" + (c.pratique.lien ? '<button class="bouton bouton-sombre" data-go="' + c.pratique.lien + '">Ouvrir le simulateur</button>' : "") + "</div>";
    h += '<nav class="tr-chnav">' + (prev ? '<a class="bouton bouton-clair" href="#cours-' + prev.id + '">← ' + esc(prev.titre) + "</a>" : '<a class="bouton bouton-clair" href="#cours">← Le cours</a>') + '<button class="lien-souligne" id="tr-print" type="button">Imprimer ce chapitre</button>' + (next ? '<a class="bouton bouton-principal" href="#cours-' + next.id + '">' + esc(next.titre) + " →</a>" : '<a class="bouton bouton-principal" href="#cours">Retour au cours</a>') + "</nav>";
    h += '<p class="tr-note"> Exemples et montants fictifs. Éducation financière, pas conseil en placement.</p></article>';
    vue.innerHTML = h;
    $$(".tr-exo", vue).forEach(function (z) { exo(c, +z.dataset.k, z); });
    $$("[data-go]", vue).forEach(function (b) { b.onclick = function () { lancer(b.dataset.go); }; });
    $("#tr-print").onclick = function () { window.print(); };
    if (c.outil) outil(c.outil, $("#tr-outil"));
  }
  function carnetHTML() {
    var A = K.CARNET.achat, V = K.CARNET.vente;
    return '<div class="tr-carnet" role="table" aria-label="Carnet d’ordres"><div class="tc-h"><span>Acheteurs</span><span>Vendeurs</span></div>' +
      A.map(function (a, i) { var v = V[i]; return '<div class="tc-r"><span><b>' + fmt(a[0]) + "</b> · " + fmt(a[1]) + " titres</span><span><b>" + fmt(v[0]) + "</b> · " + fmt(v[1]) + " titres</span></div>"; }).join("") +
      '<p class="tr-note">Meilleur acheteur 5 000, meilleur vendeur 5 050 : la fourchette est de 50 FCFA.</p></div>';
  }
  function exo(c, k, z) {
    var e = c.exos[k], p = progCh(c.id), r = p.rep[k];
    var h = '<p class="etiquette">' + (e.transfert ? "Transfert · un autre cas" : "Exercice " + (k + 1)) + '</p><p class="tr-qq">' + esc(e.q) + "</p>";
    if (e.type === "qcm") h += '<div class="tr-choix">' + e.choix.map(function (x, i) { return '<button type="button" class="choix' + (r ? (i === e.bonne ? " juste" : i === r.v ? " faux" : "") : "") + '" data-i="' + i + '"' + (r ? " disabled" : "") + ">" + esc(x) + "</button>"; }).join("") + "</div>";
    else h += '<form class="tr-num"><input inputmode="decimal" autocomplete="off" aria-label="Votre réponse"' + (r ? ' value="' + esc(r.v) + '" disabled' : "") + '><span>' + esc(e.unite || "") + "</span>" + (r ? "" : '<button class="bouton bouton-sombre">Valider</button>') + "</form>";
    if (r) h += '<div class="tr-corr ' + (r.juste ? "ok" : "ko") + '"><b>' + (r.juste ? "Juste." : "Pas tout à fait.") + "</b> " + esc(r.msg) + (e.type === "nombre" ? '<br><span class="tr-cs">' + esc(e.corr) + "</span>" : "") + '</div><button type="button" class="lien-souligne tr-re">Refaire cet exercice</button>';
    z.innerHTML = h;
    $$(".choix", z).forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; p.rep[k] = { v: i, juste: i === e.bonne, msg: e.fb[i] }; sauver(); suivi("cours-" + c.id + "-" + k); exo(c, k, z); }; });
    var f = $("form", z);
    if (f && !r) f.onsubmit = function (ev) {
      ev.preventDefault();
      var raw = $("input", f).value.replace(/\s/g, "").replace(",", ".").replace("−", "-");
      if (raw === "" || isNaN(+raw)) { $("input", f).focus(); return; }
      var v = +raw, rep = e.rep(), juste = Math.abs(v - rep) <= (e.tol || 0) + 1e-9, msg = "";
      if (juste) msg = "Bonne réponse.";
      else { var pg = (e.pieges || []).filter(function (x) { return Math.abs(v - x.v) <= (x.tol != null ? x.tol : Math.max(.01, Math.abs(x.v) * .002)); })[0]; msg = pg ? pg.msg : "Reprenez la formule du chapitre pas à pas, puis comparez avec la correction."; }
      p.rep[k] = { v: $("input", f).value, juste: juste, msg: msg }; sauver(); suivi("cours-" + c.id + "-" + k); exo(c, k, z);
    };
    var re = $(".tr-re", z); if (re) re.onclick = function () { delete p.rep[k]; sauver(); exo(c, k, z); };
  }

  /* Outils interactifs des chapitres */
  function curseur(id, lab, min, max, pas, v, suff) { return '<label class="tr-cur"><span>' + lab + ' <b id="' + id + '-v"></b>' + (suff || "") + '</span><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + pas + '" value="' + v + '"></label>'; }
  function courbeSVG(pts, opt) {
    var W = 520, H = 200, pl = 56, pr = 12, pt = 12, pb = 28;
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; }).concat(opt.ys || []);
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), m = (y1 - y0) * .08 || 1; y0 -= m; y1 += m;
    var X = function (x) { return pl + (W - pl - pr) * (x - x0) / (x1 - x0); }, Y = function (y) { return pt + (H - pt - pb) * (1 - (y - y0) / (y1 - y0)); };
    var g = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(opt.titre) + '">';
    [0, .5, 1].forEach(function (f) { var y = y0 + (y1 - y0) * f; g += '<line class="gr" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(y) + '" y2="' + Y(y) + '"/><text class="ax" x="' + (pl - 6) + '" y="' + (Y(y) + 4) + '" text-anchor="end">' + fmt(y, opt.dy || 0) + "</text>"; });
    if (opt.zero && y0 < 0 && y1 > 0) g += '<line class="z" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(0) + '" y2="' + Y(0) + '"/>';
    (opt.series || [pts]).forEach(function (s, i) { g += '<path class="l' + i + '" d="' + s.map(function (p, j) { return (j ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join("") + '"/>'; });
    if (opt.pt) g += '<circle class="pt" cx="' + X(opt.pt[0]) + '" cy="' + Y(opt.pt[1]) + '" r="5"/>';
    g += '<text class="ax" x="' + pl + '" y="' + (H - 8) + '">' + esc(opt.gx) + '</text><text class="ax" x="' + (W - pr) + '" y="' + (H - 8) + '" text-anchor="end">' + esc(opt.dx) + "</text></svg>";
    return g;
  }
  function outil(type, z) {
    if (type === "interets") {
      z.innerHTML = '<p class="etiquette">Outil · intérêts composés</p><div class="tr-curs">' + curseur("oi-c", "Capital", 100000, 5000000, 100000, 1000000, " FCFA") + curseur("oi-t", "Taux annuel", 1, 15, .5, 6, " %") + curseur("oi-n", "Durée", 1, 30, 1, 10, " ans") + '</div><div class="tr-out" id="oi-o"></div><div class="tr-gr" id="oi-g"></div>';
      var f = function () {
        var C0 = +$("#oi-c").value, t = +$("#oi-t").value / 100, n = +$("#oi-n").value;
        $("#oi-c-v").textContent = fmt(C0); $("#oi-t-v").textContent = fmt(t * 100, 1); $("#oi-n-v").textContent = n;
        var comp = C0 * Math.pow(1 + t, n), simp = C0 * (1 + t * n);
        $("#oi-o").innerHTML = "<div><span>Intérêts composés</span><b>" + fmt(comp) + " FCFA</b></div><div><span>Intérêts simples</span><b>" + fmt(simp) + " FCFA</b></div><div><span>Écart dû à la composition</span><b>" + fmt(comp - simp) + " FCFA</b></div><div><span>Doublement (règle de 72)</span><b>≈ " + fmt(72 / (t * 100), 1) + " ans</b></div>";
        var a = [], b = []; for (var k = 0; k <= n; k++) { a.push([k, C0 * Math.pow(1 + t, k)]); b.push([k, C0 * (1 + t * k)]); }
        $("#oi-g").innerHTML = courbeSVG(a, { series: [a, b], titre: "Capital au fil des années", gx: "Année 0", dx: "Année " + n }) + '<p class="tr-leg"><i class="l0"></i>Composés <i class="l1"></i>Simples</p>';
      };
      $$("input", z).forEach(function (x) { x.oninput = f; }); f();
    }
    if (type === "obligation") {
      z.innerHTML = '<p class="etiquette">Outil · prix d’une obligation</p><div class="tr-curs">' + curseur("ob-c", "Coupon", 2, 10, .25, 6, " %") + curseur("ob-n", "Échéance", 1, 15, 1, 5, " ans") + curseur("ob-t", "Taux du marché", 2, 12, .25, 7, " %") + '</div><div class="tr-out" id="ob-o"></div><div class="tr-gr" id="ob-g"></div>';
      var g2 = function () {
        var cp = +$("#ob-c").value / 100, n = +$("#ob-n").value, t = +$("#ob-t").value / 100;
        $("#ob-c-v").textContent = fmt(cp * 100, 2); $("#ob-n-v").textContent = n; $("#ob-t-v").textContent = fmt(t * 100, 2);
        var P = K.prixOblig(10000, cp, t, n);
        $("#ob-o").innerHTML = "<div><span>Coupon annuel</span><b>" + fmt(10000 * cp) + " FCFA</b></div><div><span>Prix pour 10 000 de nominal</span><b>" + fmt(P) + " FCFA</b></div><div><span>Écart au pair</span><b>" + (P >= 10000 ? "+" : "−") + fmt(Math.abs(P - 10000)) + " FCFA (" + fmt((P / 10000 - 1) * 100, 1) + " %)</b></div>";
        var pts = []; for (var x = 2; x <= 12.001; x += .25) pts.push([x, K.prixOblig(10000, cp, x / 100, n)]);
        $("#ob-g").innerHTML = courbeSVG(pts, { titre: "Prix selon le taux du marché", pt: [t * 100, P], gx: "Taux 2 %", dx: "Taux 12 %" }) + '<p class="tr-leg">Plus la courbe est pentue, plus le prix réagit aux taux. Allongez l’échéance pour le voir.</p>';
      };
      $$("input", z).forEach(function (x) { x.oninput = g2; }); g2();
    }
    if (type === "portefeuille") {
      z.innerHTML = '<p class="etiquette">Outil · deux actifs, une corrélation</p><p class="tr-note">A : rendement attendu 10 %, volatilité 25 %. B : rendement attendu 6 %, volatilité 15 %.</p><div class="tr-curs">' + curseur("pf-w", "Part de A", 0, 100, 5, 50, " %") + curseur("pf-r", "Corrélation", -1, 1, .1, .2, "") + '</div><div class="tr-out" id="pf-o"></div><div class="tr-gr" id="pf-g"></div>';
      var g3 = function () {
        var w = +$("#pf-w").value / 100, rho = +$("#pf-r").value, sa = .25, sb = .15;
        $("#pf-w-v").textContent = Math.round(w * 100); $("#pf-r-v").textContent = fmt(rho, 1);
        var vol = function (x) { return Math.sqrt(x * x * sa * sa + (1 - x) * (1 - x) * sb * sb + 2 * x * (1 - x) * rho * sa * sb); };
        var R = w * .10 + (1 - w) * .06, V = vol(w);
        $("#pf-o").innerHTML = "<div><span>Rendement attendu</span><b>" + fmt(R * 100, 1) + " %</b></div><div><span>Volatilité</span><b>" + fmt(V * 100, 1) + " %</b></div><div><span>Moyenne pondérée des volatilités</span><b>" + fmt((w * sa + (1 - w) * sb) * 100, 1) + " %</b></div><div><span>Gain de diversification</span><b>" + fmt((w * sa + (1 - w) * sb - V) * 100, 1) + " point(s)</b></div>";
        var pts = []; for (var x = 0; x <= 1.0001; x += .05) pts.push([x * 100, vol(x) * 100]);
        $("#pf-g").innerHTML = courbeSVG(pts, { titre: "Volatilité selon la part de A", pt: [w * 100, V * 100], gx: "0 % de A", dx: "100 % de A", dy: 0 }) + '<p class="tr-leg">Volatilité du portefeuille (%) selon la part de A. Baissez la corrélation : le creux s’approfondit.</p>';
      };
      $$("input", z).forEach(function (x) { x.oninput = g3; }); g3();
    }
    if (type === "option") {
      z.innerHTML = '<p class="etiquette">Outil · gain d’une option à l’échéance</p><div class="seg" role="group" aria-label="Type d’option"><button type="button" data-op="call" aria-pressed="true">Call (achat)</button><button type="button" data-op="put" aria-pressed="false">Put (vente)</button></div><div class="tr-curs">' + curseur("op-k", "Prix d’exercice", 4000, 6000, 100, 5000, " FCFA") + curseur("op-p", "Prime", 50, 600, 10, 200, " FCFA") + curseur("op-s", "Cours final", 3500, 6500, 50, 5600, " FCFA") + '</div><div class="tr-out" id="op-o"></div><div class="tr-gr" id="op-g"></div>';
      var typ = "call";
      var g4 = function () {
        var K0 = +$("#op-k").value, pr = +$("#op-p").value, S = +$("#op-s").value;
        $("#op-k-v").textContent = fmt(K0); $("#op-p-v").textContent = fmt(pr); $("#op-s-v").textContent = fmt(S);
        var gain = function (x) { return (typ === "call" ? Math.max(x - K0, 0) : Math.max(K0 - x, 0)) - pr; };
        var pm = typ === "call" ? K0 + pr : K0 - pr;
        $("#op-o").innerHTML = "<div><span>Gain net par action</span><b class=\"" + (gain(S) >= 0 ? "hausse" : "baisse") + "\">" + (gain(S) >= 0 ? "+" : "−") + fmt(Math.abs(gain(S))) + " FCFA</b></div><div><span>Perte maximale</span><b>la prime, " + fmt(pr) + " FCFA</b></div><div><span>Point mort</span><b>" + fmt(pm) + " FCFA</b></div>";
        var pts = []; for (var x = 3500; x <= 6500; x += 50) pts.push([x, gain(x)]);
        $("#op-g").innerHTML = courbeSVG(pts, { titre: "Gain selon le cours final", pt: [S, gain(S)], zero: true, gx: "3 500 FCFA", dx: "6 500 FCFA" }) + '<p class="tr-leg">Gain net par action selon le cours à l’échéance. Sous zéro, la perte s’arrête à la prime.</p>';
      };
      $$("input", z).forEach(function (x) { x.oninput = g4; });
      $$("[data-op]", z).forEach(function (b) { b.onclick = function () { typ = b.dataset.op; $$("[data-op]", z).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); g4(); }; });
      g4();
    }
  }

  /* ================= Mon groupe ================= */
  function vGroupe() {
    vue.innerHTML = '<section class="tr-bloc"><p class="surtitre">Mon groupe</p><h2>Pratiquer avec un formateur</h2>' +
      '<p class="lead">Un enseignant ou un animateur choisit le scénario, l’échéance et les notions, puis suit la progression du groupe. Chaque participant a son propre marché : vos ordres ne changent pas les cours des autres.</p>' +
      '<div class="tr-scs"><div class="carte"><h3 class="titre-tuile">Vous avez un code de groupe</h3><form id="tr-gf" class="tr-num"><input id="tr-gc" placeholder="EFA-XXXX-XXXX" autocomplete="off" aria-label="Code du groupe"><button class="bouton bouton-sombre">Rejoindre</button></form><p class="tr-note" id="tr-gm" role="status"></p></div>' +
      '<div class="carte"><h3 class="titre-tuile">Vous êtes formateur ou organisation</h3><p>Groupes, exercices assignés et tableau de bord du formateur arrivent avec les comptes EFA Traders. Écrivez-nous pour préparer une cohorte pilote.</p><a class="bouton bouton-principal" href="organisations.html?src=traders">Former un groupe</a></div></div>' +
      '<p class="tr-note">Les réponses individuelles des autres membres ne sont jamais visibles. Le formateur ne peut pas modifier vos décisions.</p></section>' +
      (K ? '<section class="tr-bloc" id="tr-classe"><div class="tr-ent"><div><p class="surtitre">Utiliser en classe</p><h2>Le programme du cours</h2></div><button class="lien-souligne" type="button" id="tr-pp">Imprimer le programme</button></div><p class="lead">Quatorze chapitres pour un premier cycle : environ ' + Math.round(K.CHAPITRES.reduce(function (a, c) { return a + parseInt(c.duree, 10); }, 0) / 60 * 10) / 10 + ' h de cours, plus la pratique au simulateur. Chaque chapitre se termine par un cas de transfert et un lien vers un scénario.</p><div class="tr-table gauche"><table><thead><tr><th>Ch.</th><th>Chapitre</th><th>Durée</th><th>Compétences</th><th>Pratique</th></tr></thead><tbody>' +
        K.CHAPITRES.map(function (c, i) { var pr = c.pratique && c.pratique.lien ? (c.pratique.lien.indexOf("sc:") === 0 ? "Scénario « " + (C.SCENARIOS.filter(function (x) { return x.id === c.pratique.lien.slice(3); })[0] || {}).titre + " »" : "Marché libre") : "Outil du chapitre"; return "<tr><td>" + (i + 1) + '</td><td><a href="#cours-' + c.id + '">' + esc(c.titre) + "</a></td><td>" + c.duree + "</td><td>" + c.objectifs.map(esc).join("<br>") + "</td><td>" + esc(pr) + "</td></tr>"; }).join("") + "</tbody></table></div></section>" : "");
    $("#tr-gf").onsubmit = function (e) { e.preventDefault(); var v = $("#tr-gc").value.trim().toUpperCase(); $("#tr-gm").textContent = v ? "Les groupes EFA Traders ouvrent avec les comptes. Gardez ce code : votre formateur vous dira quand l’utiliser. En attendant, suivez les tutoriels : votre progression est gardée sur cet appareil." : "Saisissez le code donné par votre formateur."; if (v) { D.groupe = v; sauver(); } };
    if (D.groupe) $("#tr-gc").value = D.groupe;
    var pp = $("#tr-pp"); if (pp) pp.onclick = function () { document.body.classList.add("imp-classe"); window.print(); setTimeout(function () { document.body.classList.remove("imp-classe"); }, 500); };
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
