/* EFA · PLAN D'ACTION ET CAHIER — socle commun
   Utilisé par outils.html (onglets Plan d'action et Mon cahier) et par ou-est-passe-mon-argent.html.

   - SUJETS   : les problèmes proposés dans « Plan d'action ». Chaque sujet liste ses méthodes, ses défis et ses parcours.
   - MODULES  : les méthodes. dispo:false = annoncée « bientôt ».
   - POSTES   : ce qu'on peut suivre pendant un défi.
   - PISTES   : correspondance entre les pistes de « Où est passé mon argent ? » et le plan.
   - cahier   : lecture et écriture du cahier. Il reste sur l'appareil : rien n'est envoyé à EFA.
     Par défaut, le temps de la navigation (sessionStorage) ; sur ce téléphone si la personne le choisit (localStorage). */
(function (root) {
  "use strict";

  var POSTES = [
    ["transport", "Transport", "Taxi, woro-woro, gbaka, moto, carburant"],
    ["petits", "Petits achats du quotidien", "Eau, pain, grignotage, petites courses"],
    ["repas", "Repas pris dehors", "Midi au maquis, café, boissons"],
    ["telephone", "Crédit et forfaits téléphone", "Recharges, pass internet"],
    ["frais_mm", "Frais de mobile money", "Frais d’envoi et de retrait"],
    ["aides", "Aides et dons aux proches", "Famille, amis, cérémonies, cotisations"],
    ["confie", "Argent reçu pour quelqu’un d’autre", "Sommes à remettre ou à utiliser pour un proche"],
    ["activite", "Dépenses de mon activité", "Achats et frais de votre commerce ou métier"],
    ["autre", "Un autre poste", "Celui que vous voulez éclaircir"]
  ];

  var MODULES = {
    traces: {
      titre: "Retrouver ses traces", dispo: true,
      resume: "Où chercher, comment noter, ne pas compter deux fois, et voir ce que pèsent les petites sommes.",
      etapes: [
        ["Chercher là où l’argent laisse une trace", "L’historique de votre application de mobile money ou les SMS de confirmation, le relevé de banque, les reçus, le cahier de caisse. Pour les espèces, refaites la journée de la veille, du matin au soir."],
        ["Un seul poste à la fois", "Chercher tout en même temps décourage. Choisissez un poste, par exemple le transport, et ne suivez que lui pendant une semaine."],
        ["Une estimation vaut mieux qu’un oubli", "Si vous ne retrouvez pas le montant exact, notez votre meilleure estimation. Un chiffre approché suffit pour voir la tendance."],
        ["Ne pas compter deux fois", "Un retrait d’espèces n’est pas une dépense : la dépense, c’est ce que vous payez ensuite avec ces espèces. Un transfert de votre mobile money vers votre propre compte n’en est pas une non plus."],
        ["Faire la multiplication", "500 FCFA par jour, c’est environ 15 000 FCFA par mois et 182 500 FCFA par an. Les petites sommes ne sont petites qu’une par une."]
      ],
      cas: "Awa pensait dépenser 7 000 FCFA par semaine en transport. Pendant sept jours, elle a noté chaque trajet le soir, en dix secondes. Total : 10 500 FCFA. L’écart, 3 500 FCFA par semaine, représente environ 15 000 FCFA par mois. Elle n’a rien changé la première semaine ; la deuxième, elle s’est fixé un plafond de 9 000 FCFA."
    },
    poches: { titre: "Séparer les poches", dispo: false, resume: "Mon argent, celui de mon activité, celui qu’on m’a confié : les distinguer avant de compter." },
    proches: { titre: "Aider, prêter ou contribuer", dispo: false, resume: "Donner un nom à chaque somme envoyée aux proches, pour savoir ce qui reviendra et ce qui ne reviendra pas." },
    engagements: { titre: "Les engagements", dispo: false, resume: "La tontine, les dettes et les retenues sur salaire : ce qui part avant même que vous ne choisissiez." },
    exceptions: { titre: "Les exceptions", dispo: false, resume: "Imprévus, cérémonies, argent déplacé : les isoler pour ne pas fausser le reste." }
  };

  var DEFIS = {
    "poste-7j": {
      titre: "Sept jours sur un poste",
      resume: "Choisir un poste, estimer, puis noter un seul chiffre chaque soir pendant sept jours. Le huitième jour : le bilan et un plafond.",
      duree: "10 secondes par jour"
    },
    "plafond-7j": {
      titre: "Sept jours sous un plafond",
      resume: "Après l’observation, tenir le plafond choisi sur le même poste pendant une semaine.",
      duree: "10 secondes par jour"
    }
  };

  var P = function (id, titre, url) { return {id: id, titre: titre, url: url}; };
  var PARCOURS = {
    budget: P("construire-son-budget", "Construire son budget", "construire-son-budget.html?src=plan"),
    mm: P("budget-mobile-money", "Budget et mobile money", "budget-mobile-money.html?src=plan"),
    preter: P("preter-a-un-proche", "Prêter à un proche", "preter-a-un-proche.html?src=plan"),
    retraite: P("preparer-ma-retraite", "Préparer ma retraite", "preparer-ma-retraite.html?src=plan"),
    spirale: P("cercle-spirale", "Le simulateur Cercle & Spirale", "cercle-spirale.html#argent")
  };

  var SUJETS = [
    {slug: "ou-passe-mon-argent", titre: "Je ne sais pas où passe mon argent",
     intro: "L’argent rentre, et à la fin du mois il n’en reste rien, sans savoir vraiment pourquoi. On commence par repérer où chercher, puis on observe un poste pendant une semaine.",
     diagnostic: {titre: "Où est passé mon argent ?", url: "ou-est-passe-mon-argent.html?src=plan", texte: "Cinq questions, sans relevé, pour savoir où chercher en premier."},
     modules: ["traces", "poches", "engagements", "exceptions"], defis: ["poste-7j", "plafond-7j"], parcours: ["mm", "budget"], poste: ""},
    {slug: "proches", titre: "Les demandes de mes proches désorganisent mon budget",
     intro: "Une aide ici, un prêt là, une cérémonie : chaque demande se comprend, mais leur total déborde. On mesure d’abord, puis on prépare sa réponse.",
     diagnostic: {titre: "Où est passé mon argent ?", url: "ou-est-passe-mon-argent.html?src=plan", texte: "Pour voir si les aides font partie des sommes difficiles à retrouver."},
     modules: ["proches"], defis: ["poste-7j"], parcours: ["preter", "budget"], poste: "aides"},
    {slug: "mobile-money", titre: "Mon mobile money m’échappe",
     intro: "Petits transferts, frais, plusieurs portefeuilles : le mobile money disperse l’argent sans qu’on le voie partir.",
     diagnostic: {titre: "Où est passé mon argent ?", url: "ou-est-passe-mon-argent.html?src=plan", texte: "Pour repérer les mouvements que vous retrouvez mal."},
     modules: ["traces"], defis: ["poste-7j"], parcours: ["mm"], poste: "frais_mm"},
    {slug: "budget", titre: "Je veux un budget qui tienne",
     intro: "Un budget qui tienne compte des obligations sociales et des revenus qui changent d’un mois à l’autre. Une semaine d’observation d’abord : on construit mieux sur des chiffres vus.",
     diagnostic: {titre: "Mon diagnostic financier complet", url: "diagnostic.html?src=plan", texte: "Six dimensions pour savoir où porter l’effort."},
     modules: ["traces"], defis: ["poste-7j"], parcours: ["budget"], poste: ""},
    {slug: "grosse-somme", titre: "Je vais recevoir une grosse somme",
     intro: "Le tour de tontine, une prime, un rappel : une grosse rentrée se dépense vite si sa répartition n’est pas prévue avant qu’elle arrive.",
     diagnostic: null,
     modules: ["exceptions"], defis: [], parcours: ["spirale"], poste: "", bientot: "Le parcours « Gérer une grosse rentrée » est en préparation."},
    {slug: "retraite", titre: "Je veux préparer ma retraite",
     intro: "Savoir où vous en êtes, ce qu’il vous faudra et ce qui manque, avec vos ressources : pension, famille, biens.",
     diagnostic: {titre: "Préparer ma retraite", url: "preparer-ma-retraite.html?src=plan", texte: "Six questions sans montant, puis une estimation facultative."},
     modules: [], defis: [], parcours: [], poste: ""}
  ];

  // Pistes de « Où est passé mon argent ? » → sujet, méthode, parcours, poste du défi (vide = défi sans poste imposé, null = pas de défi)
  var PISTES = {
    A: {sujet: "ou-passe-mon-argent", module: "poches", parcours: null, poste: "confie"},
    B: {sujet: "ou-passe-mon-argent", module: "poches", parcours: null, poste: "activite"},
    C: {sujet: "ou-passe-mon-argent", module: "traces", parcours: "budget", poste: "petits"},
    D: {sujet: "mobile-money", module: "traces", parcours: "mm", poste: "frais_mm"},
    E: {sujet: "proches", module: "proches", parcours: "preter", poste: "aides"},
    F: {sujet: "ou-passe-mon-argent", module: "engagements", parcours: "spirale", poste: null},
    G: {sujet: "ou-passe-mon-argent", module: "exceptions", parcours: null, poste: null},
    H: {sujet: "ou-passe-mon-argent", module: "engagements", parcours: null, poste: null},
    I: {sujet: "ou-passe-mon-argent", module: "exceptions", parcours: "budget", poste: null},
    J: {sujet: "budget", module: "traces", parcours: "budget", poste: ""},
    K: {sujet: "proches", module: "poches", parcours: "preter", poste: null},
    L: {sujet: "ou-passe-mon-argent", module: "poches", parcours: null, poste: null},
    M: {sujet: "ou-passe-mon-argent", module: "traces", parcours: null, poste: ""}
  };

  /* ---------- Le cahier ---------- */
  var CKEY = "efa_cahier_v1";
  function vide() { return {version: 1, garder: false, cree: aujourdhui(), pistes: null, sujets: [], semaines: []}; }
  function lire() {
    var t = null;
    try { t = localStorage.getItem(CKEY); } catch (e) {}
    if (!t) { try { t = sessionStorage.getItem(CKEY); } catch (e) {} }
    if (!t) return null;
    try { var c = JSON.parse(t); if (c && c.version === 1) { c.sujets = c.sujets || []; c.semaines = c.semaines || []; return c; } } catch (e) {}
    return null;
  }
  function ecrire(c) {
    try {
      var t = JSON.stringify(c); sessionStorage.setItem(CKEY, t);
      if (c.garder) localStorage.setItem(CKEY, t); else localStorage.removeItem(CKEY);
    } catch (e) {}
    return c;
  }
  function effacer() { try { localStorage.removeItem(CKEY); sessionStorage.removeItem(CKEY); } catch (e) {} }
  function ouvrir() { return lire() || vide(); }
  function ajouterSujet(c, slug) { if (slug && c.sujets.indexOf(slug) < 0) c.sujets.push(slug); return c; }
  // Pistes venues du diagnostic : titres et actions seulement, aucune réponse ni aucun montant
  function ajouterPistes(liste, source) {
    var c = ouvrir();
    c.pistes = {source: source || "oepma", date: aujourdhui(), liste: (liste || []).slice(0, 3).map(function (p) { return {id: p.id, titre: p.titre, action: p.action}; })};
    c.pistes.liste.forEach(function (p) { var m = PISTES[p.id]; if (m) ajouterSujet(c, m.sujet); });
    return ecrire(c);
  }

  /* ---------- Dates et calculs des défis ---------- */
  function iso(d) { var m = d.getMonth() + 1, j = d.getDate(); return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (j < 10 ? "0" : "") + j; }
  function aujourdhui() { return iso(new Date()); }
  function versDate(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function ajouterJours(s, n) { var d = versDate(s); d.setDate(d.getDate() + n); return iso(d); }
  // Numéro du jour de défi pour une date (1 = jour de départ)
  function numeroJour(debut, ref) { return Math.round((versDate(ref || aujourdhui()) - versDate(debut)) / 86400000) + 1; }

  function nouvelleSemaine(type, poste, libre, estimation, plafond, debut) {
    return {id: "s" + Date.now().toString(36), type: type, poste: poste, libre: libre || "", estimation: estimation == null ? null : estimation,
            plafond: plafond == null ? null : plafond, debut: debut || aujourdhui(), jours: [null, null, null, null, null, null, null], fini: false, bilan: null};
  }
  function semaineEnCours(c) { var s = c.semaines[c.semaines.length - 1]; return s && !s.fini ? s : null; }
  function terminees(c) { return c.semaines.filter(function (s) { return s.fini; }).length; }
  function remplis(s) { return s.jours.filter(function (x) { return x != null; }).length; }
  // Le bilan s'ouvre quand les sept jours sont notés, ou après le septième jour avec au moins quatre jours notés
  function etat(s, ref) {
    var n = remplis(s), j = numeroJour(s.debut, ref);
    if (n === 7) return "bilan";
    if (j > 7) return n >= 4 ? "bilan" : "incomplet";
    return "encours";
  }
  function arrondi500(x) { return Math.max(0, Math.round(x / 500) * 500); }
  function calculBilan(s) {
    var v = s.jours.filter(function (x) { return x != null; }), n = v.length;
    var total = v.reduce(function (a, b) { return a + b; }, 0), moy = n ? total / n : 0;
    var semaine = n === 7 ? total : moy * 7;
    var r = {jours: n, total: total, semaine: Math.round(semaine), mois: Math.round(moy * 365 / 12), an: Math.round(moy * 365)};
    if (s.type === "poste-7j" && s.estimation != null) {
      var d = semaine - s.estimation, rel = s.estimation > 0 ? d / s.estimation : (semaine > 0 ? 1 : 0);
      r.ecart = Math.round(d); r.ecartRel = rel; r.sens = Math.abs(rel) <= 0.1 ? "proche" : (d > 0 ? "plus_haut" : "plus_bas");
    }
    if (s.type === "plafond-7j" && s.plafond != null) { r.tenu = semaine <= s.plafond; r.marge = Math.round(s.plafond - semaine); }
    r.plafondSuggere = s.type === "plafond-7j" ? (r.tenu ? arrondi500(Math.min(s.plafond, semaine)) : s.plafond) : arrondi500(semaine * 0.9);
    return r;
  }
  function libPoste(s) { if (s.poste === "autre" && s.libre) return s.libre; var p = POSTES.filter(function (x) { return x[0] === s.poste; })[0]; return p ? p[1] : "Mon poste"; }

  var API = {POSTES: POSTES, MODULES: MODULES, DEFIS: DEFIS, PARCOURS: PARCOURS, SUJETS: SUJETS, PISTES: PISTES,
    sujet: function (slug) { return SUJETS.filter(function (s) { return s.slug === slug; })[0] || null; },
    cahier: {CLE: CKEY, vide: vide, lire: lire, ouvrir: ouvrir, ecrire: ecrire, effacer: effacer, ajouterSujet: ajouterSujet, ajouterPistes: ajouterPistes,
      nouvelleSemaine: nouvelleSemaine, semaineEnCours: semaineEnCours, terminees: terminees, remplis: remplis, etat: etat, calculBilan: calculBilan, libPoste: libPoste},
    dates: {aujourdhui: aujourdhui, ajouterJours: ajouterJours, numeroJour: numeroJour, versDate: versDate}};
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.EFA_PLAN = API;
})(this);
