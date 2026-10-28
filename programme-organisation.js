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
  // Les cycles complets : point de départ du choix (I Fondations, II Maîtrise, III Patrimoine)
  var CYCLES = [["fondations", "I", "Fondations", "voir et tenir", "F"], ["maitrise", "II", "Maîtrise", "organiser", "M"], ["patrimoine", "III", "Patrimoine", "faire travailler", "P"]].map(function (c) {
    return { id: c[0], n: c[1], nom: c[2], but: c[3], l: c[4], ids: D.parcours.filter(function (p) { return p.cycle === c[0]; }).map(function (p) { return p.id; }) };
  });
  function cyclesComplets(ids) { return CYCLES.filter(function (c) { return c.ids.length && c.ids.every(function (id) { return ids.indexOf(id) >= 0; }); }); }

  var TYPES = [["entreprise", "Entreprise"], ["cooperative", "Coopérative, groupement, tontine"], ["ecole", "École, université"], ["association", "Association, ONG, fondation"], ["institution", "Banque, microfinance, assurance"], ["communaute", "Communauté, influenceur, leader"], ["autre", "Autre"]];
  var PUBLICS = [
    ["salaries", "Salariés", "Un salaire chaque mois, des charges familiales"],
    ["commercants", "Commerçants, agents, indépendants", "Des revenus qui varient d’un mois à l’autre"],
    ["jeunes", "Jeunes, étudiants, premiers emplois", "Un premier budget, le téléphone comme banque"],
    ["groupes", "Membres de tontines ou de groupes", "Cotiser, recevoir son tour, épargner ensemble"],
    ["diaspora", "Diaspora", "Soutenir la famille, construire au pays"],
    ["cadres", "Cadres et dirigeants", "Revenus élevés, patrimoine à structurer, décisions qui engagent"],
    ["communaute", "Ma communauté, mes abonnés", "Des personnes qui me suivent et me font confiance"]
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
  var CONSEILS = { communaute: ["budget", "reserve", "tontine", "placer"], cadres: ["annee", "famille", "placer", "logement", "retraite", "protection"], salaries: ["budget", "reserve", "dettes", "annee", "retraite"], commercants: ["activite", "mm", "reserve", "tontine"], jeunes: ["budget", "mm", "conso", "reserve"], groupes: ["tontine", "reserve", "club"], diaspora: ["famille", "logement", "placer", "retraite"] };
  var FORMATS = [["0", "100 % en ligne", "Vos participants suivent le programme seuls, sur téléphone."], ["1", "En ligne + 1 session EFA", "Une session de lancement pour donner envie et répondre aux questions."], ["2", "En ligne + 2 sessions EFA", "Un lancement, puis un bilan pour challenger les décisions prises."]];
  var INVESTIR = ["M17", "M18", "P8", "M21", "P13", "P9"];

  var S = { nom: "", type: "entreprise", taille: "", publics: [], enjeux: [], niv: {}, source: null, cycles: [], sujets: [], semaines: 8, min: 45, format: "1", certif: "oui", arb: {}, extra: [], retire: [] };
  /* Ce que l'organisation observe chez ses membres (ressources humaines, responsables de groupe).
     Chaque enjeu pèse sur des sujets : 3 = sujet central, 2 = utile, 1 = complément. */
  var ENJEUX = [
    ["Fin de mois", [
      ["avance", "Demandes d’avance sur salaire fréquentes", { budget: 3, dettes: 2, reserve: 2 }],
      ["court", "Des personnes à court d’argent avant la fin du mois", { budget: 3, reserve: 1, mm: 1 }],
      ["dettes", "Prêts entre collègues, usuriers, ardoises chez les commerçants", { dettes: 3, conso: 2, famille: 1 }],
      ["retenues", "Retenues ou saisies sur salaire pour rembourser un crédit", { dettes: 3, budget: 1 }],
      ["irregulier", "Revenus variables : commissions, commerce, primes au rendement", { activite: 3, reserve: 2, budget: 1 }]]],
    ["Imprévus et famille", [
      ["urgences", "Demandes d’aide exceptionnelle : maladie, décès, accident", { reserve: 3, protection: 2, famille: 1 }],
      ["proches", "Charges familiales lourdes, sollicitations des proches", { famille: 3, budget: 1 }],
      ["pics", "Pics de difficulté à la rentrée scolaire, aux fêtes, aux funérailles", { annee: 3, reserve: 1 }],
      ["tontines", "Beaucoup cotisent à des tontines ou à des groupes d’épargne", { tontine: 3, reserve: 1 }],
      ["arnaques", "Fraudes, arnaques ou frais de mobile money signalés", { mm: 3 }]]],
    ["Projets et avenir", [
      ["retraite", "Des départs à la retraite à préparer dans les 5 à 10 ans", { retraite: 3, placer: 1, logement: 1 }],
      ["primes", "Primes, 13e mois ou intéressement versés, vite dépensés", { annee: 3, placer: 2, reserve: 1 }],
      ["epargne", "Une épargne salariale ou un fonds proposé, mais peu compris", { placer: 3, retraite: 1 }],
      ["logement", "Des projets de terrain ou de maison, parfois mal sécurisés", { logement: 3, dettes: 1 }],
      ["jeunes", "Beaucoup de jeunes recrues : premier salaire, premier budget", { budget: 2, mm: 2, conso: 1 }]]]
  ];
  var NIVEAUX = { 1: "Peu de personnes", 2: "Une partie", 3: "Beaucoup" }, FACTEUR = { 1: 0.5, 2: 1, 3: 1.5 };
  var EN = {}; ENJEUX.forEach(function (g) { g[1].forEach(function (x) { EN[x[0]] = x; }); });
  // Sujets recommandés : poids des enjeux cochés, plus un point pour le public choisi ; les raisons suivent chaque sujet
  function recommandation() {
    var sc = {}, pourquoi = {};
    (S.enjeux || []).forEach(function (k) { var x = EN[k]; if (!x) return; var n = S.niv[k] || 2, f = FACTEUR[n];
      Object.keys(x[2]).forEach(function (s) { sc[s] = (sc[s] || 0) + x[2][s] * f; if (x[2][s] >= 2) (pourquoi[s] = pourquoi[s] || []).push({ t: x[1], n: n }); }); });
    Object.keys(pourquoi).forEach(function (s) { pourquoi[s].sort(function (a, b) { return b.n - a.n; }); pourquoi[s] = pourquoi[s].map(function (w) { return w.t + " (" + NIVEAUX[w.n].toLowerCase() + ")"; }); });
    S.publics.forEach(function (p) { (CONSEILS[p] || []).forEach(function (s) { sc[s] = (sc[s] || 0) + 1; }); });
    var liste = Object.keys(sc).filter(function (s) { return sc[s] >= 2 || !(S.enjeux || []).length; }).sort(function (a, b) { return sc[b] - sc[a]; });
    return { sujets: liste.slice(0, 6), score: sc, pourquoi: pourquoi };
  }
  var etape = 1;

  /* ---------- encodage du programme dans l’adresse ---------- */
  function encoder(o) { try { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); } catch (e) { return ""; } }
  function decoder(t) { try { t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "="; return JSON.parse(decodeURIComponent(escape(atob(t)))); } catch (e) { return null; } }

  /* ---------- calcul du programme ---------- */
  function modulesChoisis() {
    var ids = [];
    (S.cycles || []).forEach(function (c) { CYCLES.forEach(function (x) { if (x.id === c) x.ids.forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); }); });
    S.sujets.forEach(function (s) { SUJETS.forEach(function (x) { if (x[0] === s) x[2].forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); }); });
    S.extra.forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    ids = ids.filter(function (id) { return S.retire.indexOf(id) < 0 && P[id]; });
    return ids.sort(function (a, b) { return P[a].module - P[b].module; });
  }
  function besoin(ids, min) { var sem = planifier({ ids: ids, min: min, semaines: 0 }), d = sem[sem.length - 1]; return d ? d.n + (d.span || 1) - 1 : 0; }
  function total(ids) { return ids.reduce(function (t, id) { return t + minutes(P[id]); }, 0); }
  function arbitrages() {
    var A = [], cap = S.semaines * S.min, ex = S.extra; S.extra = [];
    var ids = modulesChoisis(); S.extra = ex; // socle et certificat : jugés sur la sélection de départ, pour que le choix reste visible
    var inv = ids.some(function (id) { return INVESTIR.indexOf(id) >= 0; }), socle = ["P4", "P6"].filter(function (id) { return ids.indexOf(id) < 0; });
    if (inv && socle.length) A.push({ id: "socle", t: "Avant d’investir, le socle", p: "Vous avez choisi des sujets de placement ou de projet. L’école conseille de commencer par la réserve de sécurité et les dettes : placer de l’argent dont on aura besoin, ou en devant un crédit cher, fait perdre plus qu’il ne rapporte.",
      o: [["ajouter", "Ajouter le socle (module" + (socle.length > 1 ? "s " : " ") + socle.map(function (id) { return P[id].module; }).join(" et ") + ", + " + duree(total(socle)) + ")", "Recommandé"], ["sans", "Garder le programme sans le socle", ""]] });
    var fManq = cyclesComplets(ids).length ? [] : FONDATIONS.filter(function (id) { return ids.indexOf(id) < 0; });
    if (S.certif === "oui" && fManq.length && fManq.length < FONDATIONS.length) A.push({ id: "certif", t: "Viser le certificat local Fondations", p: "Le certificat local Fondations demande les 8 modules du cycle I, puis un examen en ligne. Votre sélection en contient " + (FONDATIONS.length - fManq.length) + ".",
      o: [["completer", "Compléter les " + fManq.length + " modules manquants (+ " + duree(total(fManq)) + ")", "Pour le certificat"], ["attest", "Rester sur votre sélection : une attestation de réalisation par module", ""]] });
    if (S.certif === "oui" && fManq.length === FONDATIONS.length) A.push({ id: "certif", t: "Viser un certificat", p: "Aucun module du cycle Fondations n’est dans votre sélection. Le certificat local Fondations demande ses 8 modules et un examen.",
      o: [["completer", "Ajouter le cycle Fondations complet (+ " + duree(total(fManq)) + ")", "Pour le certificat"], ["attest", "Rester sur votre sélection : une attestation de réalisation par module", ""]] });
    var t = total(modulesChoisis());
    if (t > cap) {
      var sem = besoin(modulesChoisis(), S.min), mn = Math.ceil(t / S.semaines / 15) * 15;
      A.push({ id: "charge", t: "Le temps disponible", p: "Votre sélection demande environ " + duree(t) + ", pour " + duree(cap) + " disponibles (" + S.semaines + " semaines × " + S.min + " min).",
        o: [["allonger", "Allonger le programme à " + sem + " semaines", ""]].concat(mn <= 120 ? [["rythme", "Passer à " + duree(mn) + " par semaine", ""]] : []).concat([["prioriser", "Garder seulement ce qui tient en " + S.semaines + " semaines, dans l’ordre des sujets choisis", ""]]) });
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
      if (S.arb.charge === "allonger") r.semaines = besoin(ids, S.min);
      else if (S.arb.charge === "rythme") r.min = Math.ceil(t / S.semaines / 15) * 15;
      else if (S.arb.charge === "prioriser") {
        // ordre de priorité : socle et certificat d’abord, puis les sujets dans l’ordre choisi
        var ordre = S.extra.slice(); (S.cycles || []).forEach(function (c) { CYCLES.forEach(function (x) { if (x.id === c) x.ids.forEach(function (id) { if (ordre.indexOf(id) < 0) ordre.push(id); }); }); }); S.sujets.forEach(function (s) { SUJETS.forEach(function (x) { if (x[0] === s) x[2].forEach(function (id) { if (ordre.indexOf(id) < 0) ordre.push(id); }); }); });
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
    // Semaines restantes : réparties entre les blocs, pour la mise en pratique (le calendrier va jusqu’à la dernière semaine choisie)
    var fin = sem.length ? sem[sem.length - 1].n + (sem[sem.length - 1].span || 1) - 1 : 0, reste = (g.semaines || 0) - fin;
    if (sem.length && reste > 0) {
      var base = Math.floor(reste / sem.length), plus = reste % sem.length, n = 1;
      sem.forEach(function (s, k) { s.pratique = base + (k < plus ? 1 : 0); s.n = n; s.span = (s.span || 1) + s.pratique; n += s.span; });
    }
    return sem;
  }
  function programme() {
    var g = appliquer();
    return { v: 1, n: S.nom.slice(0, 60), ty: S.type, ta: S.taille, pu: S.publics, en: S.enjeux.slice(0, 15).map(function (k) { return k + ":" + (S.niv[k] || 2); }), m: g.ids, s: g.semaines, mi: g.min, ob: S.ob || "", f: S.format, c: S.certif === "oui" ? cyclesComplets(g.ids).map(function (c) { return c.l; }).join("") : "" };
  }

  /* ---------- écrans de composition ---------- */
  var NOMS = ["Votre organisation", "Cycles et sujets", "Rythme et format", "Arbitrages", "Votre programme"];
  function pastilles() { $("etapes").innerHTML = NOMS.map(function (n, k) { return '<li class="' + (k + 1 === etape ? "ici" : k + 1 < etape ? "fait" : "") + '">' + (k + 1) + " · " + n + "</li>"; }).join(""); }
  function bouton(id, label, pressed, sous, em, rond) { return '<button type="button" class="ch' + (rond ? " rond" : "") + '" data-v="' + id + '" aria-pressed="' + (pressed ? "true" : "false") + '"><b>' + esc(label) + "</b>" + (sous ? "<small>" + esc(sous) + "</small>" : "") + (em ? "<em>" + esc(em) + "</em>" : "") + "</button>"; }
  function aller(n) { etape = n; if ($("etapes") && n !== 2) $("etapes").hidden = false; pastilles(); [null, e1, e2, e3, e4, e5][n](); try { window.scrollTo({ top: $("etapes").getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" }); } catch (e) {} mesure("orga-programme-etape-" + n); }

  /* L'enquête anonyme (facultative) : l'organisation crée un lien, ses salariés répondent en 3 minutes,
     les résultats (à partir de 5 réponses) cochent les situations et leur importance. */
  var API = "https://efa-ecole.elysees-johnson.workers.dev";
  function mesEnquetes() { try { return JSON.parse(localStorage.getItem("efa_enquetes") || "[]") || []; } catch (e) { return []; } }
  function enqueteHtml() {
    var L = mesEnquetes();
    return '<div class="enq"><p class="sur">Facultatif</p><h3>Vous n’êtes pas sûr ? Demandez-leur.</h3>'
      + '<p>Une enquête anonyme de 3 minutes, à envoyer à vos salariés ou à vos membres : 15 situations, oui ou non. Ni nom, ni email, ni montant. Dès 5 réponses, les résultats cochent les situations et leur importance à votre place.</p><p class="aide"><b>Ce qui se passe ensuite :</b> vous obtenez aussitôt un lien à envoyer (WhatsApp, email) et un lien privé pour lire vos résultats.</p>'
      + '<div class="acts"><button type="button" class="bt bt-n" id="enq-c">Créer une enquête anonyme</button><a class="bt bt-l" href="enquete.html?apercu=1" target="_blank" rel="noopener">Voir les questions</a></div><p class="aide" id="enq-m" role="status" aria-live="polite"></p><div id="enq-r"></div>'
      + (L.length ? '<p class="aide"><b>Vos enquêtes sur ce téléphone :</b> ' + L.map(function (x) { return '<a href="enquete.html?resultats=' + encodeURIComponent(x.cle) + '">' + esc(x.nom) + ' · résultats</a>'; }).join(" · ") + '</p>' : '')
      + '</div>';
  }
  function brancherEnquete() {
    var b = $("enq-c"); if (!b) return;
    b.onclick = function () {
      var nom = ($("o-nom").value || "").trim(), m = $("enq-m");
      if (nom.length < 2) { m.textContent = "Indiquez d’abord le nom de l’organisation, en haut de cette page : il est montré aux personnes interrogées."; $("o-nom").focus(); return; }
      b.disabled = true; m.textContent = "Création de l’enquête…";
      fetch(API + "/enquete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nom: nom }) }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.erreur || "Service indisponible."); return j; }); })
        .then(function (j) {
          var L = mesEnquetes(); L.unshift({ nom: j.nom, code: j.code, cle: j.cle, d: new Date().toISOString().slice(0, 10) }); try { localStorage.setItem("efa_enquetes", JSON.stringify(L.slice(0, 10))); } catch (e) {}
          var lien = location.origin + "/enquete.html?e=" + j.code, res = location.origin + "/enquete.html?resultats=" + encodeURIComponent(j.cle);
          var msg = "Bonjour,\n\nPour préparer un programme d’éducation financière adapté, " + j.nom + " vous propose une enquête anonyme de 3 minutes : 15 questions, oui ou non. Ni nom, ni email, ni montant ne sont demandés.\n\n" + lien + "\n\nMerci !";
          m.textContent = ""; mesure("orga-enquete-creee");
          $("enq-r").innerHTML = '<div class="enq-ok"><p><b>Le lien à envoyer</b> (WhatsApp, email, affichage)</p><div class="lien">' + esc(lien) + '</div><div class="acts"><a class="bt bt-p" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(msg) + '">Envoyer par WhatsApp</a><button type="button" class="bt" id="enq-cop">Copier le message</button></div>'
            + '<p><b>Le lien de vos résultats</b> : gardez-le pour vous, il n’est montré qu’une fois. Il est aussi gardé sur ce téléphone.</p><div class="lien">' + esc(res) + '</div><div class="acts"><a class="bt bt-n" href="' + esc(res) + '">Voir les résultats</a></div>'
            + '<p class="aide">Les résultats s’affichent dès 5 réponses. Vous pouvez continuer à composer votre programme maintenant, puis l’ajuster avec l’enquête.</p></div>';
          $("enq-cop").onclick = function () { try { navigator.clipboard.writeText(msg).then(function () { $("enq-m").textContent = "Message copié."; }); } catch (e) {} };
        }, function (e) { b.disabled = false; m.textContent = (/Route inconnue/.test(e.message) ? "La création d’enquêtes n’est pas encore ouverte : elle arrive dans les prochains jours." : e.message) + " Vous pouvez composer votre programme dès maintenant, sans enquête."; mesure("orga-enquete-erreur"); });
    };
  }
  function e1() {
    $("vue").innerHTML = '<section class="carte"><p class="sur">Étape 1 sur 5</p><h2>Votre organisation et votre public</h2>'
      + '<div class="grille2"><label class="champ">Nom de l’organisation <small style="font-weight:400;color:var(--ink3)">facultatif, il apparaîtra sur le programme</small><input id="o-nom" maxlength="60" autocomplete="organization" value="' + esc(S.nom) + '" placeholder="ex. Coopérative des femmes de Yopougon"></label>'
      + '<label class="champ">Type d’organisation<select id="o-type">' + TYPES.map(function (t) { return '<option value="' + t[0] + '"' + (S.type === t[0] ? " selected" : "") + ">" + t[1] + "</option>"; }).join("") + "</select></label>"
      + '<label class="champ">Nombre de participants <small style="font-weight:400;color:var(--ink3)">indicatif : le nombre exact de places est fixé avec EFA</small><select id="o-taille">' + ["", "moins de 20", "20 à 100", "100 à 500", "500 à 2 000", "2 000 à 10 000", "plus de 10 000"].map(function (t) { return '<option value="' + t + '"' + (S.taille === t ? " selected" : "") + ">" + (t || "À préciser") + "</option>"; }).join("") + "</select></label></div>"
      + '<p class="aide"><b>Qui va suivre le programme&nbsp;?</b> Choisissez un ou plusieurs publics : nous vous conseillerons des sujets.</p>'
      + '<div class="choix" id="o-pub">' + PUBLICS.map(function (p) { return bouton(p[0], p[1], S.publics.indexOf(p[0]) >= 0, p[2]); }).join("") + "</div>"
      + '<p class="aide" style="margin-top:22px"><b>Ce que vous observez&nbsp;?</b> Cochez les situations que vous rencontrez chez vos salariés ou vos membres. Nous en déduirons les sujets prioritaires. Rien n’est envoyé à EFA.</p>'
      + (S.source ? '<p class="ok-l">Situations reprises de votre enquête : ' + esc(S.source) + '. Vous pouvez les ajuster.</p>' : '')
      + ENJEUX.map(function (g) { return '<p class="en-g">' + esc(g[0]) + '</p><div class="choix en-l">' + g[1].map(function (x) { var on = S.enjeux.indexOf(x[0]) >= 0;
          return '<div class="en-i">' + bouton(x[0], x[1], on, "", "") + (on ? '<div class="niv" role="group" aria-label="Combien de personnes sont concernées ?">' + [1, 2, 3].map(function (n) { return '<button type="button" data-n="' + n + '" data-k="' + x[0] + '" aria-pressed="' + ((S.niv[x[0]] || 2) === n) + '">' + NIVEAUX[n] + '</button>'; }).join("") + '</div>' : '') + '</div>'; }).join("") + "</div>"; }).join("")
      + enqueteHtml()
      + '<p class="aide" id="en-n"></p>'
      + '<div class="acts"><button type="button" class="bt bt-p" id="suiv">Voir les sujets recommandés</button></div></section>';
    function majEn() { var n = S.enjeux.length; $("en-n").innerHTML = n ? "<b>" + n + " situation" + (n > 1 ? "s" : "") + " cochée" + (n > 1 ? "s" : "") + ".</b> L’étape suivante vous propose les sujets qui y répondent." : "Aucune situation cochée : nous vous conseillerons d’après le public seulement."; }
    Array.prototype.forEach.call(document.querySelectorAll(".en-l"), function (box) { box.onclick = function (e) {
      var n = e.target.closest("[data-n]"); if (n) { S.niv[n.dataset.k] = +n.dataset.n; n.parentNode.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === n); }); return; }
      var b = e.target.closest(".ch"); if (!b) return; var v = b.dataset.v, i = S.enjeux.indexOf(v); if (i >= 0) S.enjeux.splice(i, 1); else { S.enjeux.push(v); if (!S.niv[v]) S.niv[v] = 2; }
      garderSaisie(); var y = window.scrollY; e1(); window.scrollTo(0, y); }; });
    brancherEnquete();
    majEn();
    $("o-pub").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; var v = b.dataset.v, i = S.publics.indexOf(v); if (i >= 0) S.publics.splice(i, 1); else S.publics.push(v); b.setAttribute("aria-pressed", i < 0); };
    function garderSaisie() { S.nom = $("o-nom").value.trim(); S.type = $("o-type").value; S.taille = $("o-taille").value; }
    $("suiv").onclick = function () { S.nom = $("o-nom").value.trim(); S.type = $("o-type").value; S.taille = $("o-taille").value; S.enjeux.forEach(function (k) { mesure("orga-enjeu-" + k); }); aller(2); };
  }
  function e2() {
    var R = recommandation(), cons = R.sujets, NOMSUJ = {}; SUJETS.forEach(function (x) { NOMSUJ[x[0]] = x; });
    var tous = CYCLES.every(function (c) { return S.cycles.indexOf(c.id) >= 0; });
    if (S.mode === "labo") return eLabo();
    if ($("etapes")) $("etapes").hidden = false;
    $("vue").innerHTML = '<section class="carte"><p class="sur">Étape 2 sur 5</p><h2>Que doivent-ils apprendre&nbsp;?</h2>'
      + '<p class="aide"><b>Ce que vous préparez</b></p><div class="choix" id="m-l">' + bouton("perso", "Un programme de finances personnelles", S.mode !== "labo", "Budget, réserve, dettes, tontine… les 23 modules de l’école", "", true) + bouton("labo", "Une séance de laboratoire", S.mode === "labo", "Finance d’entreprise et stratégie : des cas à résoudre en groupe", "", true) + "</div>"

      + (S.enjeux.length && cons.length ? '<div class="reco"><p class="sur">Notre recommandation</p><h3>Vos ' + cons.length + ' sujets prioritaires</h3><ol>' + cons.map(function (k) { var x = NOMSUJ[k], w = R.pourquoi[k] || []; return x ? '<li><b>' + esc(x[1]) + '</b>' + (w.length ? '<small>Parce que : ' + esc(w.slice(0, 2).join(" ; ").toLowerCase()) + '</small>' : '') + '</li>' : ''; }).join("") + '</ol>'
        + (cons.indexOf("retraite") >= 0 || cons.indexOf("placer") >= 0 ? '<p class="aide">Placer ou préparer la retraite suppose une réserve et des dettes maîtrisées : l’étape des arbitrages vous proposera ce socle.</p>' : '')
        + (cons.every(function (k) { return S.sujets.indexOf(k) >= 0; })
          ? '<p class="reco-ok" id="s-conf"><b>✓ Ces ' + cons.length + ' sujets sont dans votre programme.</b> Ils sont cochés plus bas, dans « Des sujets précis ». <a href="#s-l" id="s-voir">Les voir ↓</a></p>'
          : '<div class="acts"><button type="button" class="bt bt-p" id="s-reco">Prendre ces sujets</button></div>') + '</div>' : '')
      + '<p class="aide"><b>Un cycle complet</b> : tous ses modules, et son certificat local à la fin.</p>'
      + '<div class="choix" id="c-l">' + CYCLES.map(function (c) { return bouton(c.id, "Cycle " + c.n + " · " + c.nom, S.cycles.indexOf(c.id) >= 0, c.ids.length + " modules · " + c.but + " · environ " + duree(total(c.ids)) + " avec les exercices et les outils", "Certificat local " + c.nom); }).join("")
      + bouton("tous", "Les trois cycles", tous, "23 modules · tout le parcours de l’école", "Certificat CEFA ★") + "</div>"
      + '<p class="aide" style="margin-top:22px"><b>Ou des sujets précis</b>, à ajouter ou à la place : choisissez ceux utiles à votre public. ' + (cons.length ? "Les sujets marqués « Conseillé » répondent aux situations cochées et au public choisi." : "") + '</p>'
      + '<div class="choix" id="s-l">' + SUJETS.map(function (s) { return bouton(s[0], s[1], S.sujets.indexOf(s[0]) >= 0, s[2].map(function (id) { return "Module " + P[id].module; }).join(" · "), cons.indexOf(s[0]) >= 0 ? "Conseillé" : ""); }).join("") + "</div>"
      + '<p class="aide" id="s-n"></p>'
      + '<div class="acts">' + (cons.length ? '<button type="button" class="bt" id="s-cons">Prendre les sujets conseillés</button>' : "") + '<button type="button" class="bt bt-p" id="suiv">Rythme et format</button><button type="button" class="bt bt-l" id="prec">Retour</button></div></section>';
    $("c-l").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; var v = b.dataset.v;
      if (v === "tous") S.cycles = tous ? [] : CYCLES.map(function (c) { return c.id; });
      else { var i = S.cycles.indexOf(v); if (i >= 0) S.cycles.splice(i, 1); else S.cycles.push(v); }
      e2(); };
    function maj() { var ids = modulesChoisis(); $("s-n").innerHTML = ids.length ? "<b>" + ids.length + " module" + (ids.length > 1 ? "s" : "") + "</b>, environ " + duree(total(ids)) + " de leçons et d’outils." : "Choisissez au moins un sujet."; $("suiv").disabled = !ids.length; }
    $("s-l").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; var v = b.dataset.v, i = S.sujets.indexOf(v); if (i >= 0) S.sujets.splice(i, 1); else S.sujets.push(v); b.setAttribute("aria-pressed", i < 0); maj(); };
    function prendre(b, ev) {
      var n = 0; cons.forEach(function (k) { if (S.sujets.indexOf(k) < 0) { S.sujets.push(k); n++; } });
      b.classList.add("bt-ok"); b.disabled = true; b.textContent = "✓ Sujets ajoutés";
      if (ev) mesure(ev);
      setTimeout(function () { S.recoPrise = cons.length; e2(); }, 450);
    }
    if ($("s-reco")) $("s-reco").onclick = function () { prendre(this, "orga-reco-prise"); };
    if ($("s-cons")) $("s-cons").onclick = function () { prendre(this); };
    if (S.recoPrise) {
      var k = S.recoPrise; S.recoPrise = 0;
      var l = $("s-l"), conf = $("s-conf");
      if (conf) { conf.hidden = false; }
      l.querySelectorAll('.ch[aria-pressed="true"]').forEach(function (x) { x.classList.add("vient"); });
      setTimeout(function () { var y = l.getBoundingClientRect().top + window.scrollY - 140; window.scrollTo({ top: y, behavior: "smooth" }); }, 900);
      setTimeout(function () { l.querySelectorAll(".vient").forEach(function (x) { x.classList.remove("vient"); }); }, 3200);
    }
    if ($("s-voir")) $("s-voir").onclick = function (e) { e.preventDefault(); var y = $("s-l").getBoundingClientRect().top + window.scrollY - 140; window.scrollTo({ top: y, behavior: "smooth" }); };
    brancherMode();
    $("suiv").onclick = function () { aller(3); }; $("prec").onclick = function () { aller(1); }; maj();
  }

  /* Séance de laboratoire : un ou plusieurs cas des laboratoires EFA, pour une séance en groupe */
  function casLabo() {
    var L = [];
    ((window.EFA_CEO_CAS && window.EFA_CEO_CAS.CAS) || window.EFA_CEO_CAS || []).forEach(function (c) { L.push({ id: "ceo-" + c.id, lab: "EFA CEO Challenge · stratégie", titre: c.titre, sec: c.secteur || "", d: parseInt(c.duree, 10) || 20, url: "ceo.html#cas-" + c.id }); });
    ((window.EFA_CF_CAS && window.EFA_CF_CAS.CAS) || window.EFA_CF_CAS || []).forEach(function (c) { L.push({ id: "cf-" + c.id, lab: "EFA Corporate Finance · finance d’entreprise", titre: c.titre, sec: c.secteur || "", d: parseInt(c.duree, 10) || 15, url: "corporate.html#cas-" + c.id }); });
    return L;
  }
  function brancherMode() {
    if (!$("m-l")) return;
    $("m-l").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; S.mode = b.dataset.v; mesure("orga-mode-" + S.mode); e2(); };
  }
  function eLabo() {
    if ($("etapes")) $("etapes").hidden = true;
    var L = casLabo(); S.cas = S.cas || [];
    var groupes = {}; L.forEach(function (c) { (groupes[c.lab] = groupes[c.lab] || []).push(c); });
    $("vue").innerHTML = '<section class="carte"><p class="sur">Étape 2 sur 3 · séance de laboratoire</p><h2>Quels cas votre groupe va-t-il résoudre&nbsp;?</h2>'
      + '<p class="aide"><b>Ce que vous préparez</b></p><div class="choix" id="m-l">' + bouton("perso", "Un programme de finances personnelles", S.mode !== "labo", "Budget, réserve, dettes, tontine… les 23 modules de l’école", "", true) + bouton("labo", "Une séance de laboratoire", S.mode === "labo", "Finance d’entreprise et stratégie : des cas à résoudre en groupe", "", true) + "</div>"
      + '<p class="aide">Entreprises fictives, contextes UEMOA et CEMAC. Chaque cas se joue en ligne : données, curseurs, questions guidées, puis une décision à justifier. Choisissez un à trois cas.</p>'
      + Object.keys(groupes).map(function (g) { return '<p class="aide" style="margin-top:18px"><b>' + esc(g) + '</b></p><div class="choix" id="cas-' + (g.indexOf("CEO") >= 0 ? "ceo" : "cf") + '">' + groupes[g].map(function (c) { return bouton(c.id, c.titre, S.cas.indexOf(c.id) >= 0, c.sec + " · " + c.d + " min", ""); }).join("") + "</div>"; }).join("")
      + '<div class="grille2" style="margin-top:18px"><label class="champ">Durée de la séance<select id="l-dur">' + [[60, "1 heure"], [90, "1 h 30"], [120, "2 heures"], [180, "Une demi-journée"]].map(function (x) { return '<option value="' + x[0] + '"' + ((S.ldur || 90) === x[0] ? " selected" : "") + ">" + x[1] + "</option>"; }).join("") + '</select></label>'
      + '<label class="champ">Format<select id="l-fmt"><option value="salle"' + (S.lfmt !== "distance" ? " selected" : "") + '>En salle, sur les téléphones</option><option value="distance"' + (S.lfmt === "distance" ? " selected" : "") + '>À distance</option></select></label></div>'
      + '<p class="aide" id="l-n"></p>'
      + '<div class="acts"><button type="button" class="bt bt-p" id="suiv">Voir ma séance</button><button type="button" class="bt bt-l" id="prec">Retour</button></div></section>';
    brancherMode();
    function maj() { var n = S.cas.length, t = L.filter(function (c) { return S.cas.indexOf(c.id) >= 0; }).reduce(function (a, c) { return a + c.d; }, 0);
      $("l-n").innerHTML = n ? "<b>" + n + " cas</b>, environ " + duree(t) + " de travail sur les cas." + (n >= 3 ? " C’est le maximum pour une séance." : "") : "Choisissez au moins un cas."; $("suiv").disabled = !n; }
    ["cas-ceo", "cas-cf"].forEach(function (id) { if ($(id)) $(id).onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; var v = b.dataset.v, i = S.cas.indexOf(v);
      if (i >= 0) S.cas.splice(i, 1); else if (S.cas.length < 3) S.cas.push(v); else return; b.setAttribute("aria-pressed", i < 0); maj(); }; });
    $("suiv").onclick = function () { S.ldur = +$("l-dur").value; S.lfmt = $("l-fmt").value; mesure("orga-labo-seance"); laboFin(); };
    $("prec").onclick = function () { aller(1); }; maj();
  }
  function laboFin() {
    var L = casLabo().filter(function (c) { return S.cas.indexOf(c.id) >= 0; }), base = location.origin + location.pathname.replace(/[^\/]*$/, "");
    var travail = L.reduce(function (a, c) { return a + c.d; }, 0), debat = Math.max(10, Math.floor((S.ldur - 25 - travail) / Math.max(1, L.length)));
    var t = 0, lignes = [["Accueil et cadrage", 10, "Présenter l’entreprise du premier cas, la décision à prendre et les règles : chiffres fictifs, aucun conseil de placement."]];
    L.forEach(function (c, k) { lignes.push(["Cas " + (k + 1) + " · " + c.titre, c.d, "En binômes, sur téléphone : lire les données, régler les curseurs, répondre aux questions guidées, puis décider."]);
      lignes.push(["Mise en commun", debat, "Chaque binôme présente sa décision et ses deux meilleurs arguments. Comparer les décisions, pas les personnes."]); });
    lignes.push(["Conclusion", 15, "Ce que le groupe retient, et le cas à refaire seul avant la prochaine séance."]);
    var nom = S.nom || "votre groupe", msg = "Séance de laboratoire EFA · " + nom + "\n\nOuvrez ces cas sur votre téléphone :\n" + L.map(function (c) { return "· " + c.titre + " : " + base + c.url; }).join("\n") + "\n\nEntreprises fictives, chiffres d’exercice. Aucun compte n’est nécessaire.";
    var h = '<section class="carte"><p class="sur">Étape 3 sur 3 · votre séance</p><h2>Séance de laboratoire' + (S.nom ? " · " + esc(S.nom) : "") + '</h2>'
      + '<p class="aide">' + esc(duree(S.ldur)) + ' · ' + (S.lfmt === "distance" ? "à distance" : "en salle, sur les téléphones") + ' · ' + L.length + ' cas · aucun compte à créer pour les participants.</p>'
      + '<ol class="suite">' + lignes.map(function (x) { t += x[1]; return '<li><b>' + esc(x[0]) + ' · ' + x[1] + ' min</b><span>' + esc(x[2]) + '</span></li>'; }).join("") + '</ol>'
      + (t > S.ldur ? '<p class="aide"><b>Attention&nbsp;:</b> ce déroulé dure environ ' + esc(duree(t)) + ', plus que la séance. Retirez un cas ou allongez la séance.</p>' : '')
      + '<p class="aide" style="margin-top:16px"><b>Les liens à donner aux participants</b></p><ul class="aide">' + L.map(function (c) { return '<li><a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.titre) + '</a> · ' + esc(c.lab) + '</li>'; }).join("") + '</ul>'
      + '<div class="acts"><button type="button" class="bt bt-p" id="l-wa">Envoyer par WhatsApp</button><button type="button" class="bt" id="l-cop">Copier le message</button><button type="button" class="bt bt-l" id="l-mod">Modifier la séance</button></div>'
      + '<p class="aide" id="l-msg" role="status" aria-live="polite"></p>'
      + '<p class="aide">Pour un suivi des participants et un certificat, composez plutôt un <button type="button" class="bt bt-l" id="l-perso">programme de finances personnelles</button>.</p></section>';
    $("vue").innerHTML = h;
    $("l-wa").onclick = function () { mesure("orga-labo-whatsapp"); window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank"); };
    $("l-cop").onclick = function () { try { navigator.clipboard.writeText(msg).then(function () { $("l-msg").textContent = "Message copié."; }, function () { $("l-msg").textContent = msg; }); } catch (e) { $("l-msg").textContent = msg; } };
    $("l-mod").onclick = function () { eLabo(); };
    $("l-perso").onclick = function () { S.mode = "perso"; e2(); };
    try { window.scrollTo({ top: $("etapes").getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" }); } catch (e) {}
  }
  function e3() {
    $("vue").innerHTML = '<section class="carte"><p class="sur">Étape 3 sur 5</p><h2>Le rythme et le format</h2>'
      + '<div class="grille2"><label class="champ">Durée du programme<select id="r-sem">' + [2, 4, 6, 8, 10, 12, 16].map(function (n) { return '<option value="' + n + '"' + (S.semaines === n ? " selected" : "") + ">" + n + " semaines</option>"; }).join("") + "</select></label>"
      + '<label class="champ">Temps par semaine et par participant<select id="r-min">' + [30, 45, 60, 90, 120].map(function (n) { return '<option value="' + n + '"' + (S.min === n ? " selected" : "") + ">" + duree(n) + "</option>"; }).join("") + "</select></label></div>"
      + '<p class="aide">Ce temps couvre les leçons et les outils en ligne. Les sessions EFA s’y ajoutent : 1 h la semaine du lancement, et 1 h la semaine du bilan avec le format à deux sessions.</p>'
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
        if (avant !== apres || box.dataset.arb === "socle" || box.dataset.arb === "certif") { var y = window.scrollY; e4(); window.scrollTo(0, y); return; } // les durées proposées se recalculent
        $("suiv").disabled = !A.every(function (a) { return S.arb[a.id]; }); };
    });
    $("suiv").onclick = function () {
      // Jamais de programme vide : si les arbitrages ne laissent aucun module, on le dit et on reste ici
      if (!appliquer().ids.length) { var m = $("vue").querySelector(".vide-msg") || document.createElement("p"); m.className = "aide vide-msg"; m.style.color = "#B3261E"; m.style.fontWeight = "700"; m.textContent = "Avec ces choix, aucun module ne tient dans le temps prévu. Choisissez « Allonger » ou « Passer à … min par semaine », ou revenez au rythme."; this.parentNode.after(m); return; }
      aller(5); }; $("prec").onclick = function () { aller(3); };
  }
  function arbitragesApres() { return arbitrages(); }


  function enTete() {
    var c = S.type === "communaute";
    try {
      $("h-sur").textContent = c ? "Pour les communautés · En ligne, en 5 minutes" : "Pour les organisations · En ligne, en 5 minutes";
      $("h-t").textContent = c ? "Composez le parcours de votre communauté, à vos couleurs" : "Composez le programme d’éducation financière de votre organisation";
      $("h-c").textContent = c ? "Influenceur, leader de communauté ou partenaire EFA : vous choisissez ce que votre communauté apprend, vous ajoutez votre photo et votre logo, et vous partagez un code. Vos membres s’inscrivent en une minute et vous suivez leur avancement, jamais leurs montants." : "Vous choisissez ce que votre public doit apprendre ; nous vous proposons les arbitrages ; vous repartez avec un programme semaine par semaine que vos participants suivent sur leur téléphone. EFA peut ensuite venir animer une session pour répondre aux questions, challenger et faciliter.";
    } catch (e) {}
  }
  /* Réduit une image choisie sur le téléphone : carré ou contenu, 320 px au plus, WebP */
  function reduire(f, carre, cb) {
    if (!f || !/^image\//.test(f.type)) return cb("");
    var fr = new FileReader(); fr.onload = function () { var im = new Image(); im.onload = function () {
      var M = 320, w = im.width, h = im.height, sx = 0, sy = 0, sw = w, sh = h;
      if (carre) { var k = Math.min(w, h); sx = (w - k) / 2; sy = Math.max(0, (h - k) / 2 - k * 0.1); sw = sh = k; }
      var r = Math.min(1, M / Math.max(sw, sh)), cv = document.createElement("canvas"); cv.width = Math.round(sw * r); cv.height = Math.round(sh * r);
      var cx = cv.getContext("2d"); if (!carre) { cx.fillStyle = "#FFFFFF"; cx.fillRect(0, 0, cv.width, cv.height); } cx.drawImage(im, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
      var d = cv.toDataURL("image/webp", 0.82); if (d.indexOf("data:image/webp") !== 0) d = cv.toDataURL("image/jpeg", 0.82); cb(d.length <= 115000 ? d : "");
    }; im.onerror = function () { cb(""); }; im.src = fr.result; }; fr.readAsDataURL(f);
  }
  var MQ = { photo: "", logo: "" };

  /* ---------- Chemin principal : recevoir une recommandation en quatre réponses ---------- */
  var OBJ = [["budget", "Tenir jusqu’à la fin du mois", "budget"], ["dettes", "Réduire les dettes et les avances", "dettes"], ["reserve", "Faire face aux imprévus", "reserve"],
    ["famille", "Aider ses proches sans se fragiliser", "famille"], ["annee", "Bien utiliser primes et 13e mois", "annee"], ["placer", "Épargner et placer", "placer"], ["retraite", "Préparer la retraite", "retraite"], ["tontine", "Mieux utiliser la tontine", "tontine"]];
  var R0 = { pub: null, obj: null, taille: "", min: 45, sem: 8 };
  function eRapide() {
    $("etapes").hidden = true;
    var pubs = PUBLICS.filter(function (p) { return p[0] !== "cadres"; });
    if (!R0.pub && S.publics.length) R0.pub = S.publics[0];
    var comm = S.type === "communaute";
    $("vue").innerHTML = '<section class="carte"><p class="sur">Recevoir une recommandation · 2 minutes</p><h2>Quatre réponses, un programme prêt à ajuster</h2>'
      + '<p class="aide"><b>Vous préparez ce programme pour…</b></p><div class="choix" id="r-qui">' + bouton("organisation", "Une organisation", !comm, "Entreprise, école, coopérative, ONG, institution") + bouton("communaute", "Ma communauté", comm, "Influenceur, leader de communauté, partenaire EFA : votre nom, votre photo, votre logo") + "</div>"
      + '<p class="aide"><b>1. Qui va suivre le programme&nbsp;?</b></p><div class="choix" id="r-pub">' + PUBLICS.map(function (p) { return bouton(p[0], p[1], R0.pub === p[0], p[2]); }).join("") + "</div>"
      + '<p class="aide" style="margin-top:20px"><b>2. L’objectif prioritaire</b></p><div class="choix" id="r-obj">' + OBJ.map(function (o) { return bouton(o[0], o[1], R0.obj === o[0]); }).join("") + "</div>"
      + '<div class="grille2" style="margin-top:20px"><label class="champ">3. Nombre de participants<select id="r-taille">' + ["", "moins de 20", "20 à 100", "100 à 500", "500 à 2 000", "2 000 à 10 000", "plus de 10 000"].map(function (t) { return '<option value="' + t + '"' + (R0.taille === t ? " selected" : "") + ">" + (t || "Je ne sais pas encore") + "</option>"; }).join("") + "</select></label>"
      + '<label class="champ">4. Temps disponible par participant<select id="r-temps">' + [["30-6", "30 min par semaine, 6 semaines"], ["45-8", "45 min par semaine, 8 semaines"], ["60-8", "1 h par semaine, 8 semaines"], ["60-12", "1 h par semaine, 12 semaines"]].map(function (t) { return '<option value="' + t[0] + '"' + (t[0] === R0.min + "-" + R0.sem ? " selected" : "") + ">" + t[1] + "</option>"; }).join("") + "</select></label></div>"
      + '<p class="aide" id="r-msg" role="status" style="color:#F09680"></p>'
      + '<div class="acts"><button type="button" class="bt bt-p" id="r-go">Voir le programme recommandé</button><button type="button" class="bt" id="r-libre">Composer librement</button></div>'
      + '<p class="aide">Vous pourrez ensuite ajuster les modules, le rythme et le format, ou demander une proposition à EFA.</p></section>';
    $("r-pub").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; R0.pub = b.dataset.v; Array.prototype.forEach.call(this.querySelectorAll(".ch"), function (x) { x.setAttribute("aria-pressed", x === b); }); };
    $("r-qui").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; S.type = b.dataset.v === "communaute" ? "communaute" : (S.type === "communaute" ? "entreprise" : S.type); if (S.type === "communaute" && !R0.pub) R0.pub = "communaute"; enTete(); eRapide(); };
    $("r-obj").onclick = function (e) { var b = e.target.closest(".ch"); if (!b) return; R0.obj = b.dataset.v; Array.prototype.forEach.call(this.querySelectorAll(".ch"), function (x) { x.setAttribute("aria-pressed", x === b); }); };
    $("r-libre").onclick = function () { mesure("orga-composer-librement"); $("etapes").hidden = false; aller(1); };
    $("r-go").onclick = function () {
      if (!R0.pub) { $("r-msg").textContent = "Choisissez le public."; return; }
      if (!R0.obj) { $("r-msg").textContent = "Choisissez l’objectif prioritaire."; return; }
      R0.taille = $("r-taille").value; var t = $("r-temps").value.split("-"); R0.min = +t[0]; R0.sem = +t[1];
      var o = OBJ.filter(function (x) { return x[0] === R0.obj; })[0], suj = [o[2]];
      (CONSEILS[R0.pub] || []).forEach(function (x) { if (suj.indexOf(x) < 0 && suj.length < 3) suj.push(x); });
      S.publics = [R0.pub]; S.taille = R0.taille; S.sujets = suj; S.cycles = []; S.enjeux = []; S.semaines = R0.sem; S.min = R0.min; S.format = "1"; S.certif = "non";
      S.arb = { socle: "ajouter", charge: "prioriser", marge: "garder" }; S.ob = o[2];
      mesure("orga-recommandation-" + R0.pub + "-" + R0.obj); $("etapes").hidden = false; etape = 5; pastilles(); e5();
      try { var cu = $("curriculum"); window.scrollTo({ top: cu.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" }); } catch (e) {}
    };
  }

  /* ---------- le programme (organisation ou participant) ---------- */
  function rendre(pr, participant) {
    var g = { ids: pr.m.filter(function (id) { return P[id]; }), semaines: pr.s, min: pr.mi }, sem = planifier(g), t = total(g.ids), f = FORMATS.filter(function (x) { return x[0] === pr.f; })[0] || FORMATS[0];
    var lien = location.origin + location.pathname + "?p=" + encoder(pr);
    var st = {}; try { st = JSON.parse(localStorage.getItem("efa_parcours_v1") || "{}") || {}; } catch (e) {} var faits = st.faits || {};
    function prog(id) { var p = P[id], n = 0, d = 0; p.etapes.forEach(function (s, i) { if (s.ess && s.ok) { d++; if (faits[id + "." + i]) n++; } }); return d ? n + "/" + d : ""; }
    var dern = sem.length ? sem[sem.length - 1].n + (sem[sem.length - 1].span || 1) - 1 : 0;
    var h = '<section class="carte" id="curriculum">' + (participant ? '<p class="sur">Votre programme</p>' : '<p class="sur">Le programme à vérifier</p>')
      + "<h2>" + (pr.n ? "Programme d’éducation financière · " + esc(pr.n) : "Votre programme d’éducation financière") + "</h2>"
      + '<div class="resume"><div><small>Modules</small><b>' + g.ids.length + '</b></div><div><small>Durée</small><b>' + Math.max(dern, pr.s) + ' semaines</b></div><div><small>Par semaine</small><b>' + duree(pr.mi) + '</b></div><div><small>Format</small><b>' + esc(f[1].replace("En ligne + ", "+ ")) + "</b></div></div>"
      + (pr.c ? '<p class="ok-l">Ce programme couvre ' + CYCLES.filter(function (c) { return pr.c.indexOf(c.l) >= 0; }).map(function (c) { return "le cycle " + c.nom; }).join(", ").replace(/, ([^,]*)$/, " et $1") + ' : chaque participant peut passer l’examen en ligne et obtenir le certificat local correspondant' + (pr.c.length === 3 ? ', puis le certificat CEFA ★' : '') + '.</p>' : '<p class="aide">Chaque module terminé, avec sa fiche gardée, donne une attestation de réalisation au participant.</p>');
    var enj = (pr.en || []).map(function (x) { var p = String(x).split(":"); return { k: p[0], n: +p[1] || 2 }; }).filter(function (x) { return EN[x.k]; }).sort(function (a, b) { return b.n - a.n; });
    if (enj.length && !participant) h += '<div class="pourquoi"><p class="sur">Les situations de départ</p><ul>' + enj.map(function (x) { return '<li>' + esc(EN[x.k][1]) + ' <small>· ' + NIVEAUX[x.n].toLowerCase() + '</small></li>'; }).join("") + '</ul><p class="aide">Trois mois après la fin, le point « Mon point » de chaque participant (oui ou non : savoir où passe son argent, un mois de côté, pas de dette chère) montre ce qui a changé. Les totaux apparaissent dans votre tableau de bord.</p></div>';
    if (!participant && g.ids.length) {
      var fiches = g.ids.map(function (id) { return P[id].fiche && P[id].fiche.titre; }).filter(Boolean);
      var ob = pr.ob && SUJETS.filter(function (x) { return x[0] === pr.ob; })[0], idsOb = ob ? ob[2].filter(function (id) { return g.ids.indexOf(id) >= 0; }) : [], pEx = P[idsOb[0] || g.ids[0]];
      h += '<div class="enbref"><p class="sur">En bref</p><dl>'
        + '<div><dt>Résultat attendu</dt><dd>' + (ob ? '<b>' + esc(ob[1]) + '.</b> ' : '') + esc((idsOb.length ? idsOb : g.ids.slice(0, 2)).map(function (id) { return P[id].objectif.replace(/\.$/, ""); }).join(" ; ")) + '.</dd></div>'
        + '<div><dt>Charge par participant</dt><dd>' + duree(pr.mi) + ' par semaine pendant ' + Math.max(dern, pr.s) + ' semaines, sur téléphone, à son rythme.</dd></div>'
        + '<div><dt>Exemple d’activité</dt><dd>Module ' + pEx.module + ' · ' + esc(pEx.titre) + (pEx.fiche && pEx.fiche.desc ? ' : ' + esc(pEx.fiche.desc) : '') + '</dd></div>'
        + '<div><dt>Livrables</dt><dd>' + (fiches.length ? 'Une fiche gardée par module (' + esc(fiches.slice(0, 2).join(", ")) + (fiches.length > 2 ? "…" : "") + '), et une attestation par module terminé.' : 'Une attestation par module terminé.') + '</dd></div>'
        + '<div><dt>Suivi</dt><dd>Vous voyez les inscriptions, les connexions et l’avancement de chacun. Vous ne voyez jamais ses montants, ses fiches ni ses réponses financières.</dd></div>'
        + '<div><dt>Ce qui est gratuit</dt><dd>Les modules, les outils et la composition du programme. Les sessions animées par EFA se préparent sur proposition.</dd></div>'
        + '</dl></div>';
    }
    sem.forEach(function (s, k) {
      var titre = s.span > 1 ? "Semaines " + s.n + (s.span === 2 ? " et " : " à ") + (s.n + s.span - 1) : "Semaine " + s.n;
      var ses = (k === 0 && pr.f !== "0" ? 60 : 0) + (k === sem.length - 1 && pr.f === "2" ? 60 : 0);
      h += '<div class="sem"><h3>' + titre + "<small>" + duree(s.t + ses) + (ses ? " · dont " + duree(ses) + " de session" + (ses > 60 ? "s" : "") : "") + (s.span > 1 ? " · sur " + s.span + " semaines" : "") + "</small></h3><div>";
      if (k === 0 && pr.f !== "0") h += '<div class="session"><b>Session EFA de lancement · 1 h</b><span>En présentiel ou en visio : le programme, les premières questions, le module de départ fait ensemble.</span></div>';
      s.mods.forEach(function (id) { var p = P[id], pg = participant ? prog(id) : ""; h += '<a class="mod c-' + p.cycle + '" href="parcours.html?src=programme#' + id + '"><span class="n">' + p.module + "</span><div><b>" + esc(p.titre) + "</b><span>" + esc(p.objectif) + " Fiche à garder : " + esc(p.fiche ? p.fiche.titre : "") + ".</span></div><span class=\"d\">" + (pg ? pg + " étapes" : esc(duree(minutes(p)))) + "</span></a>"; });
      if (s.pratique) { var d0 = s.n + s.span - s.pratique, d1 = s.n + s.span - 1; h += '<div class="session prat"><b>' + (s.pratique > 1 ? "Semaines " + d0 + (s.pratique === 2 ? " et " : " à ") + d1 : "Semaine " + d0) + ' · mise en pratique</b><span>Pas de nouveau module : chacun applique sa fiche, refait l’outil avec ses vrais chiffres et vérifie la décision prise. C’est le temps de reprendre une étape manquée.</span></div>'; }
      if (k === sem.length - 1 && pr.f === "2") h += '<div class="session"><b>Session EFA de bilan · 1 h</b><span>Ce que chacun a décidé, ce qui a marché, les questions restées ouvertes.</span></div>';
      h += "</div></div>";
    });
    var EX = CYCLES.filter(function (c) { return (pr.c || "").indexOf(c.l) >= 0; });
    if (EX.length) h += '<div class="sem"><h3>Pour finir<small>' + duree(30 * EX.length) + ' · semaine ' + Math.max(dern, pr.s) + '</small></h3><div>' + EX.map(function (c) { return '<a class="mod" href="' + (c.id === "fondations" ? "certificat-pilote.html" : "certificat-" + c.id + ".html") + '?src=programme"><span class="n">' + c.n + '</span><div><b>Examen du certificat local ' + c.nom + '</b><span>24 questions, 30 minutes, 17 bonnes réponses pour réussir. En ligne, sur téléphone.</span></div><span class="d">30 min</span></a>'; }).join("")
      + (EX.length === 3 ? '<a class="mod" href="certificat-cefa.html?src=programme"><span class="n">★</span><div><b>Certificat CEFA ★</b><span>Délivré avec les trois certificats locaux : il couvre tout le parcours de l’école.</span></div><span class="d"></span></a>' : '') + '</div></div>';
    h += "</section>";
    if (participant) {
      h += '<section class="carte"><h2>Comment suivre ce programme</h2><ul class="limites"><li>Ouvrez chaque module dans l’ordre : il vous guide étape par étape, avec vidéos, leçons et outils.</li><li>Votre organisation vous a donné un code&nbsp;? <a href="rejoindre.html">Créez votre compte</a> : votre progression est enregistrée et vous la retrouvez sur n’importe quel téléphone.</li><li><b>Ce que voit votre organisation</b>, par ses responsables du programme : votre nom, vos visites, les étapes faites, les modules terminés et votre certificat. <b>Jamais</b> vos montants, le contenu de vos fiches ni vos réponses aux quiz. Sans compte, rien n’est transmis.</li><li>Une question&nbsp;? <a href="ely.html">Posez-la à Ely</a>, le guide de l’école, ou gardez-la pour la session EFA.</li></ul><div class="acts"><a class="bt bt-p" href="parcours.html?src=programme#' + (g.ids[0] || "") + '">Commencer le premier module</a></div></section>';
    } else {
      var BV = '<section class="bienvenue no-print" aria-label="Le mot du président"><img src="elysee-portrait.jpg" alt="Élysée Johnson, fondateur et président d’EFA" width="606" height="909"><div><p class="sur">Bienvenue</p><h2>Vous avez fait le bon choix</h2>'
        + '<p>Former ' + (pr.ty === "communaute" ? (pr.n ? 'la communauté ' + esc(pr.n) : 'votre communauté') : (pr.n ? 'les équipes de ' + esc(pr.n) : 'vos équipes')) + ' à leurs finances, c’est leur donner de la sérénité et de la marge de manœuvre. EFA se tient à vos côtés pour mener ce chantier jusqu’au bout.</p>'
        + '<p>Je suis Élysée Johnson et je vous accompagnerai tout au long de ce programme, du lancement jusqu’au bilan.</p><p class="sig">Élysée Johnson<small>Fondateur et président d’EFA</small></p></div></section>';
      h += BV + '<section class="carte no-print" id="suite"><p class="sur">Étape 5 sur 5 · Votre programme est prêt</p><h2>Gardez-le ou ajustez-le, puis lancez-le</h2><ol class="suite">'
        + '<li><b><span class="n">1</span>Gardez ou ajustez le programme</b><span>Les modules, les semaines et les sessions sont détaillés ci-dessus. Un changement&nbsp;? Modifiez-le avant de créer vos accès.</span><div class="acts"><a href="#curriculum">Revoir le programme ↑</a><button type="button" class="bt bt-l" id="a-mod">Modifier le programme</button></div></li>'
        + '<li class="go" id="acces"><b><span class="n">2</span>Créez vos accès, tout de suite</b><span>Vous recevez à l’instant la clé de votre tableau de bord, réservée aux responsables du programme, et le code d’inscription de vos participants. Gratuit pendant le pilote.</span>'
        + '<div class="g2"><label class="champ">' + (pr.ty === "communaute" ? "Nom de la communauté" : "Organisation") + '<input id="x-org" maxlength="80" autocomplete="organization" value="' + esc(pr.n || "") + '"></label><label class="champ">Nombre de places<input id="x-places" type="number" min="1" max="500" value="' + ({ "moins de 20": 20, "20 à 100": 100 }[pr.ta] || (pr.ta ? 500 : 50)) + '"></label>'
        + '<label class="champ">Responsable du programme<input id="x-nom" maxlength="80" autocomplete="name" placeholder="Prénom et nom"></label><label class="champ">Fonction <small style="font-weight:400;color:#AEB6C6">facultatif</small><input id="x-fct" maxlength="80" placeholder="ex. DRH, chargée de formation"></label>'
        + '<label class="champ">Email du responsable<input id="x-mail" type="email" maxlength="120" autocomplete="email"></label></div>'
        + '<details class="marque"' + (pr.ty === "communaute" ? " open" : "") + '><summary>' + (pr.ty === "communaute" ? "Votre marque : photo, logo, message" : "Ajouter votre logo et un mot d’accueil (facultatif)") + '</summary>'
        + '<p class="aide">Vos membres voient votre photo, votre logo et votre message quand ils rejoignent le parcours.</p>'
        + '<div class="g2"><label class="champ">Porteur du parcours<input id="x-por" maxlength="80" placeholder="ex. votre nom, ou celui du leader"></label><label class="champ">Rôle<select id="x-role">' + ["Leader de communauté", "Influenceur EFA", "Partenaire EFA", "Responsable du programme"].map(function (r) { return "<option" + ((pr.ty === "communaute" ? "Leader de communauté" : "Responsable du programme") === r ? " selected" : "") + ">" + r + "</option>"; }).join("") + '</select></label>'
        + '<label class="champ">Photo du porteur<input id="x-photo" type="file" accept="image/*"><small style="font-weight:400;color:#AEB6C6">Un visage, recadré en rond</small></label><label class="champ">Logo de la communauté<input id="x-logo" type="file" accept="image/*"><small style="font-weight:400;color:#AEB6C6">PNG ou JPG, fond clair</small></label></div>'
        + '<div class="mq-ap" id="mq-ap"></div>'
        + '<label class="champ">Mot d’accueil <small style="font-weight:400;color:#AEB6C6">240 caractères au plus</small><textarea id="x-msg" maxlength="240" rows="3" placeholder="ex. Bienvenue dans la communauté ! Ensemble, on apprend à faire rester l’argent."></textarea></label></details>'
        + '<label class="ok-case"><input type="checkbox" id="a-ok"><span>J’ai vérifié les modules, les semaines et les sessions</span></label>'
        + '<label class="ok-case"><input type="checkbox" id="a-acc"><span>Je suis habilité à ouvrir ce programme pour mon organisation. Les responsables désignés verront le nom, les visites et l’avancement des participants inscrits avec notre code, jamais leurs montants, leurs fiches ni leurs réponses (<a href="confidentialite.html#programme" style="color:#6DB8F2">confidentialité</a>).</span></label>'
        + '<div class="acts"><button type="button" class="bt bt-p" id="a-ses" aria-disabled="true">Créer mes accès maintenant</button></div><p class="aide" id="a-msg" role="status" style="color:#F09680"></p>'
        + '<span>Plus de 500 places, une session à fixer, un devis ou une autre demande&nbsp;? <a href="rendez-vous.html?sujet=organisation&amp;programme=' + encodeURIComponent(lien) + '#contact" style="color:#6DB8F2">Écrire à EFA</a> (facultatif).</span></li>'
        + '<li><b><span class="n">3</span>Invitez vos participants</b><span>Depuis votre <a href="espace-organisation.html">tableau de bord</a> : le message d’invitation, avec le code, est prêt à envoyer par email ou WhatsApp. Sans ce code, la progression de vos participants ne peut pas être suivie.</span></li></ol>'
        + '<details class="valid"><summary>Faire valider le programme en interne avant de créer les accès</summary><p class="aide">Pour un directeur, la RH ou le bureau de la coopérative : le lien rouvre ce programme tel quel.</p><div class="acts"><button type="button" class="bt" id="a-print">Imprimer ou enregistrer en PDF</button><button type="button" class="bt" id="a-lien">Copier le lien du programme</button><button type="button" class="bt" id="a-wa">Envoyer par WhatsApp</button></div><p class="aide" id="a-msg2" role="status"></p></details>'
        + '</section>';
      h += '<section class="carte"><h2>Ce qu’il faut savoir</h2><ul class="limites">'
        + "<li><b>Gratuit pendant le pilote</b> : les modules et la composition du programme. Les sessions avec EFA se conviennent ensemble.</li>"
        + "<li><b>Suivi</b> : avec les accès remis par EFA, chaque participant a son compte et votre organisation a son <a href=\"espace-organisation.html\">tableau de bord</a> : inscriptions, connexions, progression, modules terminés, certificats.</li>"
        + "<li><b>Contenus en pilote</b> : chaque module est relu par l’équipe EFA ; son statut et la date de sa version sont affichés dans L’école. La relecture par des experts extérieurs se poursuit.</li>"
        + "<li><b>Éducation, pas conseil</b> : EFA ne vend aucun produit financier et ne recommande aucun établissement.</li></ul></section>";
    }
    $("vue").innerHTML = h;
    if (participant) return;
    function copier(t, m) { var ok = function () { $("a-msg2").textContent = m; }; try { navigator.clipboard.writeText(t).then(ok, function () { window.prompt("Copiez ce lien :", t); }); } catch (e) { window.prompt("Copiez ce lien :", t); } }
    $("a-lien").onclick = function () { copier(lien, "Lien copié : il rouvre ce programme tel quel, pour le faire valider."); mesure("orga-programme-lien-validation"); };
    $("a-wa").onclick = function () { window.open("https://wa.me/?text=" + encodeURIComponent("Projet de programme d’éducation financière avec EFA" + (pr.n ? " pour " + pr.n : "") + ", à valider : " + lien), "_blank", "noopener"); mesure("orga-programme-whatsapp"); };
    $("a-print").onclick = function () { try { window.print(); } catch (e) {} };
    function pret() { $("a-ses").setAttribute("aria-disabled", $("a-ok").checked && $("a-acc").checked ? "false" : "true"); }
    $("a-ok").onchange = pret; $("a-acc").onchange = pret;
    $("a-ses").onclick = function () { creerAcces(pr, lien); };
    function apercuMq() { var org = $("x-org").value.trim(), por = $("x-por").value.trim(); $("mq-ap").innerHTML = (MQ.photo || MQ.logo) ? (MQ.logo ? '<img class="mq-logo" src="' + MQ.logo + '" alt="">' : '') + (MQ.photo ? '<img class="mq-photo" src="' + MQ.photo + '" alt="">' : '') + '<span><b>' + esc(org || "Votre communauté") + '</b>' + esc(por ? " · " + por : "") + '</span>' : ''; }
    $("x-photo").onchange = function () { reduire(this.files[0], true, function (d) { MQ.photo = d; apercuMq(); }); };
    $("x-logo").onchange = function () { reduire(this.files[0], false, function (d) { MQ.logo = d; apercuMq(); }); };
    $("a-mod").onclick = function () { history.replaceState(null, "", location.pathname); aller(1); };
  }
  // Création des accès par l'organisation : le Worker efa-ecole renvoie la clé d'organisation (montrée une seule fois) et le code
  function creerAcces(pr, lien) {
    var m = function (t) { $("a-msg").innerHTML = t; };
    var org = $("x-org").value.trim(), nom = $("x-nom").value.trim(), fct = $("x-fct").value.trim(), mail = $("x-mail").value.trim(), places = +$("x-places").value || 50;
    if (!pr.m || !pr.m.length) return m("Ce programme ne contient aucun module : modifiez-le avant de créer les accès.");
    if (!$("a-ok").checked) return m("Cochez d’abord la première case : vérifiez les modules, les semaines et les sessions ci-dessous.");
    if (org.length < 2) return m("Indiquez le nom de l’organisation.");
    if (nom.length < 2) return m("Indiquez le nom du responsable du programme.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(mail)) return m("Indiquez une adresse email valide.");
    if (!$("a-acc").checked) return m("Cochez la seconde case pour ouvrir le programme.");
    var E = window.EFA_ECOLE; if (!E) return m("Le service se charge : réessayez dans quelques secondes.");
    var b = $("a-ses"); b.disabled = true; m("Création de vos accès…");
    var prog = { n: org, m: pr.m, s: pr.s, mi: pr.mi, f: pr.f, c: pr.c };
    var por = $("x-por") ? $("x-por").value.trim() : "", msgA = $("x-msg") ? $("x-msg").value.trim() : "";
    if (pr.ty === "communaute" || por || msgA || MQ.photo || MQ.logo) prog.mq = { t: pr.ty === "communaute" ? "communaute" : "organisation", nom: org, porteur: por, role: $("x-role") ? $("x-role").value : "", msg: msgA, photo: MQ.photo, logo: MQ.logo };
    E.appel("/organisations", { nom: org, programme: prog, places: places, accord: true, responsable: { nom: nom, fonction: fct, email: mail } }).then(function (r) {
      mesure("orga-acces-crees");
      try { sessionStorage.setItem("efa_cle_orga", r.cle_organisation); } catch (e) {}
      var inv = pr.ty === "communaute" ? "Bonjour ! Le parcours d’éducation financière de " + org + " est ouvert sur EFA. Inscrivez-vous en 1 minute sur votre téléphone : " + location.origin + "/rejoindre.html?code=" + r.code + " (code : " + r.code + "). Ce que je vois : votre nom et votre avancement. Jamais vos montants, vos fiches ni vos réponses." : "Bonjour, notre programme d’éducation financière avec EFA est ouvert. Créez votre compte en 1 minute sur votre téléphone : " + location.origin + "/rejoindre.html?code=" + r.code + " (code : " + r.code + "). Ce que voit l’organisation : votre nom, vos visites et votre avancement. Jamais vos montants, vos fiches ni vos réponses.";
      var li = $("acces"); li.className = "acces-ok";
      li.innerHTML = '<b><span class="n">2</span>Vos accès sont créés · ' + esc(r.programme.nom) + '</b>'
        + '<p class="alerte-cle"><b>Notez votre clé maintenant : elle ne sera plus affichée.</b> Gardez-la pour les responsables du programme. EFA ne peut pas la retrouver ; en cas de perte, une nouvelle clé se demande à EFA.</p>'
        + '<span><b>Clé du tableau de bord</b> (confidentielle)</span><div class="cle">' + esc(r.cle_organisation) + '</div>'
        + '<span><b>Code des participants</b> · ' + r.programme.places + ' places, ouvert jusqu’au ' + new Date(r.programme.expire_le).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) + '</span><div class="cle">' + esc(r.code) + '</div>'
        + (pr.f !== "0" ? '<span>Votre programme prévoit ' + (pr.f === "2" ? "deux sessions" : "une session") + ' avec EFA : nous écrivons à ' + esc(mail) + ' pour fixer la date.</span>' : '')
        + (r.places_demandees > r.programme.places ? '<span>Vous avez demandé ' + r.places_demandees + ' places : EFA vous écrit pour ouvrir les suivantes.</span>' : '')
        + '<div class="acts"><button type="button" class="bt" id="k-cop">Copier ma clé</button><button type="button" class="bt" id="k-mail">M’envoyer ma clé par email</button><a class="bt bt-p" href="espace-organisation.html">Ouvrir mon tableau de bord</a></div><p class="aide" id="k-msg" role="status"></p>';
      var cop = function (t, x) { try { navigator.clipboard.writeText(t).then(function () { $("k-msg").textContent = x; }, function () { window.prompt("Copiez :", t); }); } catch (e) { window.prompt("Copiez :", t); } };
      $("k-cop").onclick = function () { cop(r.cle_organisation, "Clé copiée : gardez-la dans un endroit sûr."); };
      $("k-mail").onclick = function () { location.href = "mailto:" + encodeURIComponent(mail) + "?subject=" + encodeURIComponent("Accès EFA · " + r.programme.nom) + "&body=" + encodeURIComponent("Tableau de bord : " + location.origin + "/espace-organisation.html\nClé d’organisation (confidentielle) : " + r.cle_organisation + "\n\nCode des participants : " + r.code + "\nLien d’inscription : " + location.origin + "/rejoindre.html?code=" + r.code + "\n\nMessage d’invitation à envoyer :\n" + inv); };
      // EFA est prévenu (sans la clé) : nom, responsable, programme, places
      try { fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ access_key: "426191fb-4812-4de4-b602-5857464c5916", subject: "efa.africa · Nouveau programme d’organisation : " + org, from_name: "Site efa.africa", name: nom, email: mail, replyto: mail,
        message: "Organisation : " + org + "\nResponsable : " + nom + (fct ? " (" + fct + ")" : "") + " · " + mail + "\nPlaces : " + r.programme.places + (r.places_demandees > r.programme.places ? " (demandé : " + r.places_demandees + ")" : "") + "\nCode participants : " + r.code + "\nFormat : " + ((FORMATS.filter(function (x) { return x[0] === pr.f; })[0] || FORMATS[0])[1]) + "\nProgramme : " + lien }) }); } catch (e) {}
    }, function (e) { b.disabled = false; m(esc(e.message) + ' Vous pouvez aussi <a href="rendez-vous.html?sujet=organisation&amp;programme=' + encodeURIComponent(lien) + '#contact" style="color:#6DB8F2">écrire à EFA</a>.'); });
  }
  function e5() {
    var pr = programme();
    history.replaceState(null, "", location.pathname + "?p=" + encoder(pr));
    mesure("orga-programme-construit");
    rendre(pr, false);
  }

  /* ---------- ouverture ---------- */
  var q = new URLSearchParams(location.search), code = q.get("p"), pr = code && decoder(code);
  if (q.get("type") === "communaute" || (pr && pr.ty === "communaute")) { S.type = "communaute"; if (!q.get("public") && !(pr && pr.pu && pr.pu.length)) S.publics = ["communaute"]; }
  if (pr && pr.m) {
    var participant = q.get("vue") === "participant";
    S.nom = pr.n || ""; S.type = pr.ty || "entreprise"; S.taille = pr.ta || ""; S.publics = pr.pu || []; S.semaines = pr.s; S.min = pr.mi; S.format = pr.f; S.certif = pr.c ? "oui" : "non";
    S.cycles = cyclesComplets(pr.m).map(function (c) { return c.id; });
    S.enjeux = []; S.niv = {}; (pr.en || []).forEach(function (x) { var p = String(x).split(":"); if (EN[p[0]]) { S.enjeux.push(p[0]); S.niv[p[0]] = +p[1] || 2; } });
    var horsC = pr.m.filter(function (id) { return !CYCLES.some(function (c) { return S.cycles.indexOf(c.id) >= 0 && c.ids.indexOf(id) >= 0; }); });
    S.sujets = SUJETS.filter(function (x) { return x[2].some(function (id) { return horsC.indexOf(id) >= 0; }); }).map(function (x) { return x[0]; });
    if (participant) {
      $("etapes").hidden = true; $("h-sur").textContent = "Programme d’éducation financière"; $("h-t").textContent = pr.n ? "Votre programme avec " + pr.n : "Votre programme d’éducation financière";
      $("h-c").textContent = "Un programme composé pour vous, à suivre sur votre téléphone, module après module. Chaque module part d’une situation concrète et se termine par une fiche que vous gardez.";
      $("h-p").hidden = true; $("fil").textContent = "Mon programme"; document.documentElement.classList.remove("vue-p"); mesure("orga-programme-participant");
    } else { etape = 5; pastilles(); }
    rendre(pr, participant);
  } else {
    var ty = q.get("type"); if (ty && TYPES.some(function (t) { return t[0] === ty; })) S.type = ty;
    if (q.get("mode") === "labo") S.mode = "labo";
    var pu = q.get("public"); if (pu) pu.split(",").forEach(function (x) { if (PUBLICS.some(function (p) { return p[0] === x; }) && S.publics.indexOf(x) < 0) S.publics.push(x); });
    if (ty || pu) mesure("orga-programme-depuis-" + (ty || "public"));
    var en = q.get("en");
    if (en) { en.split(",").forEach(function (x) { var p = x.split("."); if (EN[p[0]] && S.enjeux.indexOf(p[0]) < 0) { S.enjeux.push(p[0]); S.niv[p[0]] = Math.min(3, Math.max(1, +p[1] || 2)); } });
      S.nom = (q.get("n") || "").slice(0, 60); S.source = (q.get("rep") ? q.get("rep") + " réponses" : "réponses anonymes"); mesure("orga-programme-depuis-enquete"); }
    pastilles(); enTete(); if (S.mode === "labo" || en || q.get("libre")) e1(); else eRapide();
  }
})();
