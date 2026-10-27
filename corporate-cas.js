/* EFA Corporate Finance · Cas pratiques interactifs
   Chaque cas : une entreprise fictive, des données, des curseurs, des résultats recalculés en direct,
   des écrans guidés (question, action, correction), puis une décision justifiée qui entre au journal.
   Montants en millions de FCFA. Impôt fictif de 25 %. */
(function (racine) {
  "use strict";
  var T = 0.25;
  function van(r, f) { return f.reduce(function (a, x, t) { return a + x / Math.pow(1 + r, t); }, 0); }
  function tri(f) { var lo = -0.99, hi = 2; if (van(hi, f) > 0) return null; for (var k = 0; k < 200; k++) { var m = (lo + hi) / 2; if (van(m, f) > 0) lo = m; else hi = m; } return (lo + hi) / 2; }
  function recup(f) { var c = 0; for (var t = 0; t < f.length; t++) { var av = c; c += f[t]; if (t > 0 && c >= 0 && av < 0) return t - 1 + (-av) / f[t]; } return null; }

  var CAS = [
    /* ───────── 1 · Analyse financière et crédit ───────── */
    { id: "pret", titre: "Prêter à Ciments Bakar ?", entreprise: "Ciments Bakar", secteur: "Industrie · cimenterie", duree: "15 min", chapitres: ["f1", "f2", "f3"],
      role: "Vous êtes analyste crédit dans une banque.",
      situation: "Ciments Bakar demande un prêt pour moderniser un four. Votre banque exige deux ratios après le prêt : dette nette ÷ EBE au plus 3, et couverture des intérêts au moins 2.",
      comptes: {
        resultat: [["Chiffre d'affaires", 12000], ["Achats consommés", -6600], ["Services extérieurs", -1200], ["Impôts et taxes", -200], ["Charges de personnel", -1600], ["EBE", 2400, 1], ["Dotations aux amortissements", -900], ["Résultat d'exploitation", 1500, 1], ["Charges financières", -500], ["Impôt (25 %)", -250], ["Résultat net", 750, 1]],
        actif: [["Immobilisations nettes", 9000], ["Stocks", 1500], ["Créances clients", 3000], ["Trésorerie", 500], ["Total actif", 14000, 1]],
        passif: [["Capitaux propres", 6000], ["Dettes financières", 5000], ["Fournisseurs", 2500], ["Autres dettes d'exploitation", 500], ["Total passif", 14000, 1]] },
      entrees: [{ id: "m", lab: "Montant du prêt", min: 0, max: 4000, pas: 100, v: 1000, u: "M" }, { id: "r", lab: "Taux du prêt", min: 6, max: 14, pas: .5, v: 9, u: "%" }],
      calc: function (x) {
        var dn = 5000 - 500 + x.m, int = 500 + x.m * x.r / 100;
        return { dnebe: dn / 2400, couv: 1500 / int, rn: (1500 - int) * (1 - T), dn: dn, int: int, ok: dn / 2400 <= 3 && 1500 / int >= 2 };
      },
      sorties: [["dn", "Dette nette après prêt", "M"], ["dnebe", "Dette nette ÷ EBE (max 3)", "x1"], ["int", "Charges financières", "M"], ["couv", "Couverture des intérêts (min 2)", "x1"], ["rn", "Résultat net après prêt", "M"], ["ok", "Critères de la banque", "ok"]],
      etapes: [
        { t: "info", texte: "Commencez par lire le compte de résultat et le bilan, à gauche. Repérez l'EBE, le résultat d'exploitation et la dette." },
        { t: "nombre", q: "Quelle est la dette nette actuelle de Ciments Bakar, en M ?", rep: function () { return 4500; }, tol: 0, unite: "M", corr: "Dettes financières 5 000 − trésorerie 500 = 4 500 M.", pieges: [{ v: 5000, msg: "C'est la dette brute. On retire la trésorerie disponible." }] },
        { t: "nombre", q: "Dette nette ÷ EBE aujourd'hui (une décimale) ?", rep: function () { return 1.9; }, tol: .05, unite: "", corr: "4 500 ÷ 2 400 = 1,9. L'entreprise a de la marge par rapport au plafond de 3." },
        { t: "action", consigne: "Réglez le prêt demandé : 2 000 M à 9 %.", test: function (x) { return x.m === 2000 && x.r === 9; } },
        { t: "nombre", q: "Couverture des intérêts après ce prêt (une décimale) ?", rep: function () { return Math.round(1500 / (500 + 180) * 10) / 10; }, tol: .05, unite: "", corr: "Intérêts : 500 + 2 000 × 9 % = 680 M. Couverture : 1 500 ÷ 680 = 2,2. Au-dessus de 2, mais de peu.", pieges: [{ v: 3, msg: "C'est la couverture avant le prêt. Les nouveaux intérêts s'ajoutent : 180 M." }] },
        { t: "action", consigne: "Trouvez le montant maximal que la banque peut prêter à 9 % sans enfreindre ses deux critères (par pas de 100 M).", test: function (x, o) { return x.r === 9 && o.ok && !(function () { var m = x.m + 100, dn = 4500 + m, int = 500 + m * .09; return dn / 2400 <= 3 && 1500 / int >= 2; })(); } },
        { t: "qcm", q: "Quel critère limite le prêt ?", choix: ["Dette nette ÷ EBE", "La couverture des intérêts"], bonne: 0, fb: ["Juste : à 2 700 M, dette nette ÷ EBE atteint 3,0 alors que la couverture vaut encore 2,04.", "Pas ici : la couverture tolérerait jusqu'à 2 777 M, mais dette nette ÷ EBE dépasse 3 dès 2 800 M."] }
      ],
      decision: { q: "Votre recommandation au comité de crédit", choix: [
        { t: "Prêter 2 000 M à 9 %, sans condition", retour: "Possible : les deux critères passent. Mais la couverture de 2,2 laisse peu de marge si les ventes de ciment baissent. Un comité vous demandera ce qui se passe si l'EBE recule de 15 %." },
        { t: "Prêter 2 000 M avec un ratio à respecter chaque année et une garantie sur le four", retour: "Solide : vous prêtez, et vous vous protégez si la situation se dégrade. C'est la réponse la plus fréquente en pratique." },
        { t: "Refuser", retour: "Défendable si vous doutez des ventes, mais les ratios actuels ne le justifient pas : vous perdez un bon client." }] } },

    /* ───────── 2 · Décision d'investissement ───────── */
    { id: "invest", titre: "Investir dans une usine de cajou ?", entreprise: "Agro Djeli", secteur: "Agriculture · transformation", duree: "20 min", chapitres: ["f6", "f7", "f8"],
      role: "Vous êtes directeur financier d'Agro Djeli.",
      situation: "Une unité de transformation de noix de cajou coûterait 800 M, amortis sur 5 ans, plus 100 M de BFR au démarrage, récupérés à la fin. Coûts fixes : 150 M par an. L'entreprise exige 12 % de rendement.",
      comptes: null,
      entrees: [{ id: "q", lab: "Volume vendu", min: 500, max: 3000, pas: 100, v: 2000, u: "t/an" }, { id: "p", lab: "Prix de vente", min: .6, max: 1.2, pas: .05, v: .9, u: "M/t" }, { id: "c", lab: "Coût variable", min: .4, max: .8, pas: .05, v: .6, u: "M/t" }, { id: "k", lab: "Taux exigé", min: 8, max: 16, pas: .5, v: 12, u: "%" }],
      calc: function (x) {
        var ebe = x.q * (x.p - x.c) - 150, am = 160, flux = (ebe - am) * (1 - T) + am;
        var f = [-900, flux, flux, flux, flux, flux + 100], v = van(x.k / 100, f);
        return { ebe: ebe, flux: flux, van: v, tri: tri(f), recup: recup(f), pm: x.p > x.c ? 150 / (x.p - x.c) : null, f: f };
      },
      sorties: [["ebe", "EBE annuel", "M"], ["flux", "Flux annuel après impôt", "M"], ["van", "VAN", "Msigne"], ["tri", "TRI", "pct"], ["recup", "Délai de récupération", "ans"], ["pm", "Point mort (EBE = 0)", "t"]],
      etapes: [
        { t: "info", texte: "Les curseurs fixent vos hypothèses. À droite, le flux annuel est calculé ainsi : (EBE − amortissement) × (1 − 25 %) + amortissement. L'investissement de départ est 800 + 100 de BFR." },
        { t: "nombre", q: "Avec les hypothèses de départ (2 000 t à 0,9 M, coût 0,6 M), quel est l'EBE annuel, en M ?", rep: function () { return 450; }, tol: 0, unite: "M", corr: "2 000 × (0,9 − 0,6) − 150 = 600 − 150 = 450 M.", pieges: [{ v: 600, msg: "C'est la marge sur coûts variables. Il reste à retirer les 150 M de coûts fixes." }] },
        { t: "nombre", q: "Et le flux annuel après impôt, en M (une décimale) ?", rep: function () { return 377.5; }, tol: .05, unite: "M", corr: "(450 − 160) × 0,75 + 160 = 217,5 + 160 = 377,5 M.", pieges: [{ v: 337.5, msg: "Vous avez taxé tout l'EBE : l'amortissement réduit l'impôt." }, { v: 217.5, msg: "C'est le résultat net. Ajoutez l'amortissement, qui n'est pas décaissé." }] },
        { t: "qcm", q: "La VAN est positive d'environ 518 M. Qu'est-ce que cela signifie ?", choix: ["Le projet rapporte 518 M de bénéfice", "Il rapporte plus que 12 % ; la richesse créée vaut 518 M d'aujourd'hui", "Il sera remboursé en 518 jours"], bonne: 1, fb: ["Non : la VAN n'est pas un bénéfice comptable.", "Juste : au-delà de la rémunération exigée de 12 %.", "Non."] },
        { t: "action", consigne: "Baissez le volume jusqu'à ce que la VAN soit proche de zéro (entre −40 et +40 M).", test: function (x, o) { return Math.abs(o.van) <= 40; } },
        { t: "qcm", q: "Remettez 2 000 t, puis baissez le prix de 15 % (à environ 0,75 M). Que devient le projet ?", choix: ["Il reste créateur de valeur", "Sa VAN devient négative : le prix est l'hypothèse critique", "Rien ne change"], bonne: 1, fb: ["Regardez la VAN : elle passe sous zéro.", "Juste : 15 % de prix en moins retire la moitié de la marge unitaire.", "Non."] }
      ],
      decision: { q: "Votre recommandation à la direction générale", choix: [
        { t: "Investir tel quel", retour: "La VAN centrale est positive, mais le projet devient perdant si le prix baisse de 15 %. Sans protection, c'est un pari sur les cours du cajou." },
        { t: "Investir en sécurisant une partie des ventes par des contrats à prix fixé avec des acheteurs", retour: "Bon réflexe : vous gardez la création de valeur et réduisez l'hypothèse la plus risquée. C'est le lien avec les contrats à terme." },
        { t: "Reporter d'un an pour mieux connaître le marché", retour: "Défendable si l'incertitude sur le prix est forte, mais attendre a un coût : un an de flux perdu et un concurrent qui peut s'installer." }] } },

    /* ───────── 3 · Structure de financement ───────── */
    { id: "financement", titre: "Financer 10 magasins : dette ou capital ?", entreprise: "Distrib Kanaga", secteur: "Distribution", duree: "15 min", chapitres: ["f9", "f10", "f11"],
      role: "Vous conseillez le conseil d'administration.",
      situation: "Distrib Kanaga a 4 000 M de capitaux propres et 1 000 M de dette à 8 %. Ouvrir 10 magasins coûte 2 000 M et porterait le résultat d'exploitation à 1 600 M. La nouvelle dette coûterait 9 %. La banque exige une dette au plus égale à 60 % des capitaux propres.",
      comptes: null,
      entrees: [{ id: "d", lab: "Part financée par dette", min: 0, max: 100, pas: 10, v: 50, u: "%" }, { id: "re", lab: "Résultat d'exploitation", min: 400, max: 2000, pas: 100, v: 1600, u: "M" }],
      calc: function (x) {
        var nd = 2000 * x.d / 100, D = 1000 + nd, E = 4000 + 2000 - nd, int = 80 + nd * .09, rn = (x.re - int) * (1 - T);
        var ku = .12, kd = (80 + nd * .09) / D, ke = ku + (ku - kd) * (1 - T) * D / E, V = D + E;
        return { D: D, E: E, de: D / E, int: int, roe: rn / E, couv: x.re / int, ke: ke, cmpc: E / V * ke + D / V * kd * (1 - T), ok: D / E <= .6 };
      },
      sorties: [["D", "Dette totale", "M"], ["E", "Capitaux propres", "M"], ["de", "Dette ÷ capitaux propres (max 0,60)", "x2"], ["roe", "ROE", "pct"], ["couv", "Couverture des intérêts", "x1"], ["ke", "Coût des fonds propres", "pct"], ["cmpc", "CMPC", "pct"], ["ok", "Critère de la banque", "ok"]],
      etapes: [
        { t: "info", texte: "Le curseur répartit les 2 000 M entre dette nouvelle et augmentation de capital. Le coût des fonds propres monte avec la dette : les actionnaires portent plus de risque." },
        { t: "action", consigne: "Financez tout par augmentation de capital (0 % de dette).", test: function (x) { return x.d === 0 && x.re === 1600; } },
        { t: "nombre", q: "ROE dans ce cas, en % ?", rep: function () { return 19; }, tol: .05, unite: "%", corr: "Intérêts 80 M. Résultat net : (1 600 − 80) × 0,75 = 1 140. Capitaux propres 6 000. ROE : 19 %." },
        { t: "action", consigne: "Trouvez la part de dette la plus élevée que la banque accepte.", test: function (x, o) { return o.ok && x.d + 10 <= 100 && !(function () { var nd = 2000 * (x.d + 10) / 100; return (1000 + nd) / (6000 - nd) <= .6; })(); } },
        { t: "qcm", q: "À 80 % de dette, le ROE monte. Ramenez le résultat d'exploitation à 500 M (très mauvaise année). Comparez avec 0 % de dette. Que constatez-vous ?", choix: ["Le ROE reste supérieur au cas sans dette", "Le ROE baisse plus fort qu'avec 0 % de dette : le levier joue à l'envers", "La couverture des intérêts ne bouge pas"], bonne: 1, fb: ["Comparez avec 0 % de dette à 500 M : le ROE est plus bas avec la dette.", "Juste : la rentabilité des actifs passe sous le coût de la dette, et les intérêts restent dus.", "Non : elle chute à 2,2."] }
      ],
      decision: { q: "Votre proposition au conseil", choix: [
        { t: "100 % augmentation de capital", retour: "Prudent : couverture très confortable, mais ROE plus faible et dilution des associés actuels." },
        { t: "Environ moitié dette, moitié capital", retour: "Équilibré : vous profitez du levier tout en gardant une marge en cas de mauvaise année. Souvent le meilleur compromis pour un distributeur." },
        { t: "Le maximum autorisé par la banque (80 %)", retour: "ROE maximal en année normale, mais vous êtes au plafond du critère : la moindre baisse de résultat vous met en défaut." }] } },

    /* ───────── 4 · BFR et trésorerie ───────── */
    { id: "bfr", titre: "La grosse commande", entreprise: "Grossiste Siakam", secteur: "Commerce de gros", duree: "15 min", chapitres: ["f4"],
      role: "Vous êtes la gérante.",
      situation: "Un supermarché propose 60 M de commandes par mois, avec une marge brute de 20 %. Il paie à 90 jours. Vos fournisseurs veulent être payés à 30 jours et il faut 30 jours de stock. Vous avez 80 M de trésorerie et la banque accorde au plus 50 M de découvert, à 12 %.",
      comptes: null,
      entrees: [{ id: "dc", lab: "Délai de paiement du client", min: 0, max: 120, pas: 15, v: 90, u: "jours" }, { id: "df", lab: "Délai accordé par vos fournisseurs", min: 0, max: 90, pas: 15, v: 30, u: "jours" }, { id: "ds", lab: "Stock nécessaire", min: 0, max: 60, pas: 15, v: 30, u: "jours" }],
      calc: function (x) {
        var ca = 60, ach = 48, b = ca * x.dc / 30 + ach * x.ds / 30 - ach * x.df / 30, besoin = Math.max(0, b - 80), cout = Math.min(besoin, 50) * .12;
        return { bfr: b, besoin: besoin, decouvert: besoin <= 50, marge: ca * 12 * .2, cout: cout, net: ca * 12 * .2 - cout };
      },
      sorties: [["bfr", "BFR créé par la commande", "M"], ["besoin", "Au-delà de votre trésorerie", "M"], ["decouvert", "Finançable par le découvert (max 50)", "ok"], ["marge", "Marge brute annuelle", "M"], ["cout", "Coût annuel du découvert", "M"]],
      etapes: [
        { t: "info", texte: "Chaque mois, vous achetez 48 M pour vendre 60 M. Le BFR additionnel = ventes × délai client + achats × stock − achats × délai fournisseur, en mois." },
        { t: "nombre", q: "Avec les conditions proposées, quel BFR la commande crée-t-elle, en M ?", rep: function () { return 180; }, tol: 0, unite: "M", corr: "60 × 3 + 48 × 1 − 48 × 1 = 180 M.", pieges: [{ v: 60, msg: "Vous avez compté un seul mois de ventes. Le client paie à 90 jours : trois mois de ventes sont en attente." }] },
        { t: "qcm", q: "Pouvez-vous financer ces 180 M ?", choix: ["Oui, avec la trésorerie et le découvert", "Non : 80 + 50 = 130 M au maximum", "Oui, la marge de 20 % suffit"], bonne: 1, fb: ["Faites le calcul : il manque 50 M.", "Juste : une commande rentable peut mettre l'entreprise en cessation de paiement.", "Non : la marge arrive après les décaissements."] },
        { t: "action", consigne: "Négociez des délais qui rendent la commande finançable (BFR au plus 130 M).", test: function (x, o) { return o.bfr <= 130; } }
      ],
      decision: { q: "Votre réponse au supermarché", choix: [
        { t: "Accepter à 90 jours", retour: "Risqué : il vous manque environ 50 M dès le troisième mois. Sans solution, c'est le découvert dépassé." },
        { t: "Accepter si le client paie à 45 jours, ou verse un acompte", retour: "La bonne négociation : la commande reste rentable et finançable. Vous pouvez aussi proposer l'affacturage de ses factures." },
        { t: "Refuser", retour: "Vous protégez la trésorerie, mais renoncez à 144 M de marge annuelle. Négocier les délais est souvent possible." }] } },

    /* ───────── 5 · Valorisation et acquisition ───────── */
    { id: "valo", titre: "Valoriser Boulangeries Kanga pour un rachat", entreprise: "Boulangeries Kanga", secteur: "Agroalimentaire", duree: "20 min", chapitres: ["f12", "f13"],
      role: "Vous conseillez un fonds qui veut racheter l'entreprise.",
      situation: "EBE de 600 M, flux disponible attendu l'an prochain de 300 M, dette nette de 800 M. Des boulangeries industrielles comparables se négocient entre 6 et 8 fois leur EBE.",
      comptes: null,
      entrees: [{ id: "g1", lab: "Croissance des flux sur 5 ans", min: 0, max: 12, pas: 1, v: 6, u: "%" }, { id: "gt", lab: "Croissance à long terme", min: 0, max: 5, pas: .5, v: 3, u: "%" }, { id: "w", lab: "CMPC", min: 9, max: 16, pas: .5, v: 12, u: "%" }],
      calc: function (x) {
        var w = x.w / 100, g1 = x.g1 / 100, gt = x.gt / 100, ev = 0, fcf = 300;
        for (var t = 1; t <= 5; t++) { if (t > 1) fcf *= 1 + g1; ev += fcf / Math.pow(1 + w, t); }
        var vt = fcf * (1 + gt) / (w - gt), ev2 = ev + vt / Math.pow(1 + w, 5);
        return { ev: ev2, eq: ev2 - 800, vtpart: vt / Math.pow(1 + w, 5) / ev2, m6: 600 * 6 - 800, m8: 600 * 8 - 800 };
      },
      sorties: [["ev", "Valeur d'entreprise (DCF)", "M"], ["eq", "Valeur des fonds propres (DCF)", "M"], ["vtpart", "Part de la valeur terminale", "pct"], ["m6", "Fonds propres à 6 × EBE", "M"], ["m8", "Fonds propres à 8 × EBE", "M"]],
      etapes: [
        { t: "info", texte: "Deux méthodes, deux fourchettes. Le DCF actualise 5 années de flux puis une valeur terminale. Les multiples appliquent la valeur de comparables." },
        { t: "nombre", q: "Par les multiples, au milieu de la fourchette (7 × EBE), combien valent les fonds propres, en M ?", rep: function () { return 600 * 7 - 800; }, tol: 0, unite: "M", corr: "600 × 7 = 4 200 de valeur d'entreprise ; − 800 de dette nette = 3 400 M.", pieges: [{ v: 4200, msg: "C'est la valeur d'entreprise. Le vendeur garde la dette à rembourser : retirez-la." }] },
        { t: "qcm", q: "Regardez la part de la valeur terminale dans le DCF. Qu'en déduire ?", choix: ["Elle est faible, le DCF est très fiable", "Elle pèse plus de la moitié : la valeur dépend surtout des hypothèses de long terme", "Elle n'a pas d'importance"], bonne: 1, fb: ["Regardez le chiffre : plus de 60 %.", "Juste : c'est pourquoi on teste le CMPC et la croissance à long terme.", "Si : c'est l'essentiel de la valeur."] },
        { t: "action", consigne: "Testez un scénario prudent : CMPC à 14 % et croissance à long terme à 2 %.", test: function (x) { return x.w === 14 && x.gt === 2; } }
      ],
      decision: { q: "Votre prix d'offre pour 100 % des actions", choix: [
        { t: "2 800 M (bas des multiples, proche du DCF central)", retour: "Cohérent avec les deux méthodes : le DCF central donne environ 2 860 M. Le vendeur poussera vers le haut ; vous savez jusqu'où les flux le justifient." },
        { t: "3 400 M (milieu des multiples)", retour: "Au-dessus du DCF central : vous payez déjà une partie de la croissance espérée. Défendable seulement si vous avez chiffré des améliorations de gestion." },
        { t: "4 200 M (au-dessus de la fourchette)", retour: "Vous payez bien plus que ce que justifient les flux, sauf synergies chiffrées. C'est ainsi qu'un acquéreur détruit de la valeur." }
] } }
  ];

  var API = { CAS: CAS, van: van, tri: tri, recup: recup };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else racine.EFA_CF_CAS = API;
})(this);
