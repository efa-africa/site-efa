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
    exceptions: { titre: "Les exceptions", dispo: false, resume: "Imprévus, cérémonies, argent déplacé : les isoler pour ne pas fausser le reste." },
    "bourse-pret": {
      titre: "Suis-je prêt à investir ?", dispo: true,
      resume: "Quatre vérifications avant de placer le moindre franc en Bourse.",
      etapes: [
        ["Une réserve de sécurité d’abord", "Environ trois mois de dépenses essentielles, mis de côté en dehors de la Bourse. Sans elle, le premier imprévu vous obligerait à vendre, peut-être à perte."],
        ["Pas de dette chère en cours", "Rembourser un crédit à 20 % rapporte plus sûrement qu’une action. Soldez d’abord les dettes les plus chères."],
        ["Un argent qui peut attendre cinq ans", "Un cours peut baisser longtemps. N’investissez en actions que ce dont vous n’aurez pas besoin avant cinq ans au moins."],
        ["Savoir expliquer ce que l’on achète", "Une action ou une obligation, ce que fait l’entreprise, et ce qui peut faire baisser son prix. Si vous ne savez pas l’expliquer en une phrase, attendez."]
      ]
    },
    "bourse-10": {
      titre: "10 choses à savoir avant d’investir en Bourse", dispo: true,
      resume: "Ce qu’est une action, une obligation, un dividende, et pourquoi les frais, la liquidité et les promesses comptent.",
      etapes: [
        ["Une Bourse est d’abord un marché d’occasion", "Vous achetez le plus souvent à un autre investisseur, pas à l’entreprise. Le prix se fixe entre acheteurs et vendeurs, séance après séance."],
        ["Une action fait de vous un copropriétaire", "Vous partagez la réussite et les difficultés de l’entreprise. Propriétaire, pas créancier : rien ne vous est dû."],
        ["Une obligation, c’est un prêt", "Vous prêtez à un État ou à une entreprise, pour une durée et à un taux connus d’avance. La BRVM cote des actions et des obligations."],
        ["On gagne de deux façons, sans garantie", "Le dividende, si l’assemblée générale le vote, et la plus-value, si vous revendez plus cher. Un dividende récompense l’année passée, il ne promet rien pour la suivante."],
        ["Un cours peut baisser longtemps", "La Bourse se juge sur des années, pas sur une séance."],
        ["On passe par un intermédiaire agréé", "À la BRVM, une SGI agréée par l’AMF-UMOA passe vos ordres et conserve vos titres. Pas d’agrément, pas d’argent."],
        ["Les frais mangent les petits ordres", "Avec 1,2 % de courtage à l’achat et à la vente, 50 000 FCFA coûtent environ 1 200 FCFA aller-retour : il faut une hausse d’environ 2,4 % pour rentrer dans ses frais."],
        ["Certains titres s’échangent peu", "C’est la liquidité. Préférez l’ordre à cours limité : vous fixez le prix maximum que vous acceptez de payer."],
        ["Ne pas tout mettre sur une seule société", "Répartir sur plusieurs sociétés et secteurs limite le choc. Avec un petit budget, un fonds commun de placement (FCP) le fait pour vous."],
        ["Un rendement garanti, c’est un signal d’alarme", "« Doublez votre argent en trois mois » est la marque des arnaques. Plus la promesse est belle, plus il faut vérifier l’agrément."]
      ],
      cas: "Awa a 300 000 FCFA de côté et une collègue lui conseille « l’action qui a pris 30 % ». Avant d’acheter, elle vérifie : sa réserve de trois mois est faite, elle n’a pas de crédit, cet argent peut attendre. Elle lit les comptes de la société : le bénéfice baisse. Elle choisit de commencer avec 100 000 FCFA dans un fonds commun de placement, et note dans son cahier pourquoi."
    },
    "bourse-ordre": {
      titre: "Six étapes jusqu’au premier ordre", dispo: true,
      resume: "Choisir sa SGI, ouvrir un compte-titres, l’alimenter, passer un ordre à cours limité, puis suivre sans s’affoler.",
      etapes: [
        ["Choisir une SGI agréée", "Vérifiez l’agrément sur amf-umoa.org. Comparez le courtage, les frais de tenue de compte et de retrait, et le dépôt minimum, qui va de zéro à plus de 150 000 FCFA selon les SGI."],
        ["Ouvrir un compte-titres", "Pièce d’identité, justificatif de domicile, formulaire et questionnaire de profil. Certaines SGI le font en ligne."],
        ["Alimenter le compte", "Par virement, et chez certaines SGI par mobile money. Sur un petit montant, les frais pèsent plus lourd."],
        ["Passer un ordre à cours limité", "Le titre, la quantité et le prix maximum. Sur un titre peu échangé, l’ordre peut prendre plusieurs jours."],
        ["Tenir un cahier", "Pour chaque achat : la date, le prix, les frais et la raison de votre choix, en une phrase."],
        ["Suivre sans réagir à chaque séance", "Les dividendes arrivent après un impôt retenu à la source. Lisez les comptes de vos sociétés deux fois par an."]
      ]
    },
    "bourse-seance": {
      titre: "Lire une séance de la BRVM", dispo: true,
      resume: "L’indice, la variation avec le volume, et jamais une séance seule. Puis les chiffres du jour.",
      etapes: [
        ["L’indice d’abord", "Le BRVM Composite résume l’évolution de toutes les actions cotées à la Bourse régionale d’Abidjan, commune aux huit pays de l’UEMOA. Il dit l’humeur du marché, pas celle de votre société."],
        ["La variation, avec le volume", "Une hausse de 7 % sur quelques dizaines de titres échangés n’a pas le même sens qu’une hausse sur des milliers."],
        ["Jamais une séance seule", "Comparez sur plusieurs mois, et rapportez toujours le cours à ce que l’entreprise gagne. Les chiffres de la dernière séance sont dans l’onglet BRVM d’Études & actualité (methode.html#brvm)."]
      ]
    }
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
    spirale: P("cercle-spirale", "Le simulateur Cercle & Spirale", "cercle-spirale.html#argent"),
    brvm: P("premiers-pas-brvm", "Premiers pas à la BRVM", "premiers-pas-brvm.html?src=plan")
  };

  var SUJETS = [
    {slug: "ou-passe-mon-argent", titre: "Je ne sais pas où passe mon argent",
     intro: "L’argent rentre, et à la fin du mois il n’en reste rien, sans savoir vraiment pourquoi. On commence par repérer où chercher, puis on observe un poste pendant une semaine.",
     diagnostic: {titre: "Où est passé mon argent ?", url: "ou-est-passe-mon-argent.html?src=plan", texte: "Cinq questions, sans relevé, pour savoir où chercher en premier."},
     modules: ["traces", "poches", "engagements", "exceptions"], defis: ["poste-7j", "plafond-7j"], parcours: ["mm", "budget"], poste: ""},
    {slug: "investir-brvm", titre: "Je veux investir à la BRVM",
     intro: "Acheter des actions à la Bourse d’Abidjan commence avant la Bourse : une réserve de sécurité, pas de dette chère, de l’argent qui peut attendre. Puis dix choses à comprendre avant le premier ordre.",
     diagnostic: {titre: "Mon diagnostic financier complet", url: "diagnostic.html?src=brvm", texte: "Pour vérifier que votre réserve et vos dettes permettent d’investir."},
     modules: ["bourse-pret", "bourse-10", "bourse-ordre", "bourse-seance"], defis: [], parcours: ["brvm"], poste: ""},
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
