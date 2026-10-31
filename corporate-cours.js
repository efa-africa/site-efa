/* EFA Corporate Finance · Le cours (niveau licence)
   14 chapitres en 4 parties. Même structure que le cours d'EFA Traders : objectifs, notions, formules,
   exemples en millions de FCFA, outil interactif, « À retenir », exercices corrigés (une explication par
   erreur fréquente), un cas de transfert, puis un cas pratique. Réponses calculées par le code.
   Référentiel comptable : SYSCOHADA révisé (OHADA). Entreprises et montants fictifs ; impôt fictif de 25 %. */
(function (racine) {
  "use strict";
  function r2(x) { return Math.round(x * 100) / 100; }
  function van(taux, flux) { return flux.reduce(function (a, f, t) { return a + f / Math.pow(1 + taux, t); }, 0); }
  function tri(flux) { var lo = -0.99, hi = 1; for (var k = 0; k < 200; k++) { var m = (lo + hi) / 2; if (van(m, flux) > 0) lo = m; else hi = m; } return (lo + hi) / 2; }
  function annuite(c, t, n) { return c * t / (1 - Math.pow(1 + t, -n)); }

  var PARTIES = [
    { id: "A", titre: "Lire l'entreprise", sous: "Comptes, soldes, ratios, trésorerie" },
    { id: "B", titre: "Décider d'investir", sous: "Actualiser, VAN, TRI, risque" },
    { id: "C", titre: "Financer", sous: "Sources, coût du capital, levier, dividendes" },
    { id: "D", titre: "Valoriser et gouverner", sous: "Valeur d'entreprise, création de valeur" }
  ];

  var CH = [
    /* ───────── A · Lire l'entreprise ───────── */
    { id: "f1", partie: "A", titre: "Les états financiers", duree: "30 min",
      objectifs: ["Lire un bilan et un compte de résultat", "Distinguer un flux (l'année) d'un stock (une date)", "Situer le SYSCOHADA révisé et ses états"],
      sections: [
        { t: "Trois documents, trois questions", liste: [
          "Le bilan : ce que l'entreprise possède (actif) et comment c'est financé (passif : capitaux propres et dettes), à une date donnée.",
          "Le compte de résultat : ce qu'elle a gagné et dépensé pendant l'année, et donc son résultat.",
          "Le tableau des flux de trésorerie : d'où vient et où va l'argent réellement encaissé et décaissé."] },
        { t: "L'égalité du bilan", p: ["L'actif est toujours égal au passif : tout ce que l'entreprise détient a été financé par quelqu'un, les associés ou les prêteurs."], f: "Actif = Capitaux propres + Dettes", ex: "Ciments Bakar : 14 000 millions d'actif = 6 000 de capitaux propres + 5 000 de dettes financières + 3 000 de dettes d'exploitation." },
        { t: "Le SYSCOHADA révisé", p: ["Dans les 17 pays de l'OHADA, dont ceux de l'UEMOA, les entreprises tiennent leurs comptes selon le SYSCOHADA révisé, en vigueur depuis 2018. Il fixe le plan de comptes et la présentation : bilan, compte de résultat, tableau des flux de trésorerie et notes annexes."] },
        { t: "Résultat n'est pas trésorerie", p: ["Une vente est comptée au chiffre d'affaires dès qu'elle est facturée, même si le client paie dans trois mois. Une entreprise peut donc être bénéficiaire et manquer de trésorerie."] }
      ],
      retenir: ["Bilan : une photo à une date. Compte de résultat : un film sur l'année.", "Actif = capitaux propres + dettes, toujours.", "Un bénéfice n'est pas de l'argent en caisse."],
      exos: [
        { type: "nombre", q: "Une PME a 800 M d'immobilisations, 250 M de stocks, 300 M de créances clients et 50 M de trésorerie. Ses dettes totales s'élèvent à 900 M. Montant de ses capitaux propres, en millions ?", unite: "M FCFA", tol: 0, rep: function () { return 800 + 250 + 300 + 50 - 900; },
          pieges: [{ v: 1400, msg: "C'est le total de l'actif. Les capitaux propres sont ce qui reste une fois les dettes retirées." }], corr: "Actif total : 800 + 250 + 300 + 50 = 1 400 M. Capitaux propres : 1 400 − 900 = 500 M." },
        { type: "qcm", q: "Le chiffre d'affaires de l'année se lit…", choix: ["au bilan", "au compte de résultat", "dans le tableau des flux de trésorerie"], bonne: 1,
          fb: ["Non : le bilan donne des montants à une date, pas les ventes de l'année.", "Juste : le chiffre d'affaires est un flux de l'année.", "Non : ce tableau montre les encaissements, pas les ventes facturées."] },
        { type: "qcm", transfert: true, q: "Une entreprise affiche un bénéfice record mais ne peut pas payer ses salaires. Est-ce possible ?", choix: ["Non, c'est une erreur comptable", "Oui : ses clients ne l'ont pas encore payée, ou elle a beaucoup investi", "Seulement en cas de fraude"], bonne: 1,
          fb: ["Non : c'est fréquent et cohérent.", "Juste : le résultat compte les ventes facturées ; la trésorerie, l'argent encaissé.", "Non : il suffit de délais de paiement longs."] }
      ],
      pratique: { texte: "Ouvrez le cas « Prêter à Ciments Bakar » et lisez son bilan et son compte de résultat avant toute décision.", lien: "cas:pret" } },

    { id: "f2", partie: "A", titre: "Du chiffre d'affaires au résultat : les soldes de gestion", duree: "30 min",
      objectifs: ["Calculer la valeur ajoutée, l'EBE et le résultat d'exploitation", "Calculer la capacité d'autofinancement (CAF)", "Savoir ce que mesure chaque solde"],
      sections: [
        { t: "Les soldes intermédiaires de gestion", p: ["Le compte de résultat se lit en cascade. Chaque solde isole une étape de la création de richesse."], liste: [
          "Valeur ajoutée = production et ventes − consommations venant des tiers (achats, services extérieurs).",
          "Excédent brut d'exploitation (EBE) = valeur ajoutée − impôts et taxes − charges de personnel. C'est ce que l'activité dégage avant amortissements, intérêts et impôt.",
          "Résultat d'exploitation = EBE − dotations aux amortissements (et provisions).",
          "Résultat des activités ordinaires = résultat d'exploitation + résultat financier.",
          "Résultat net = après éléments hors activités ordinaires et impôt sur le résultat."] },
        { t: "La capacité d'autofinancement", p: ["Les amortissements sont des charges qui ne se décaissent pas. La CAF mesure ce que l'activité laisse réellement pour investir, rembourser ou distribuer."], f: "CAF ≈ Résultat net + Dotations aux amortissements et provisions", ex: "Ciments Bakar : résultat net 750 + dotations 900 = CAF de 1 650 millions." }
      ],
      retenir: ["L'EBE mesure la performance du métier, avant financement et impôt.", "Le résultat d'exploitation retire l'usure des équipements.", "La CAF ajoute au résultat ce qui n'a pas été décaissé."],
      exos: [
        { type: "nombre", q: "Chiffre d'affaires 12 000 M ; achats 6 600 ; services extérieurs 1 200 ; impôts et taxes 200 ; personnel 1 600. EBE, en millions ?", unite: "M FCFA", tol: 0, rep: function () { return 12000 - 6600 - 1200 - 200 - 1600; },
          pieges: [{ v: 4200, msg: "C'est la valeur ajoutée. Pour l'EBE, il faut encore retirer impôts et taxes et charges de personnel." }], corr: "Valeur ajoutée : 12 000 − 6 600 − 1 200 = 4 200. EBE : 4 200 − 200 − 1 600 = 2 400 M, soit 20 % du chiffre d'affaires." },
        { type: "nombre", q: "Même entreprise : dotations aux amortissements 900, charges financières 500, impôt de 25 % sur le résultat des activités ordinaires. Résultat net, en millions ?", unite: "M FCFA", tol: 0, rep: function () { return (2400 - 900 - 500) * 0.75; },
          pieges: [{ v: 1000, msg: "C'est le résultat avant impôt. Il reste à retirer 25 %." }, { v: 1125, msg: "Vous avez oublié les charges financières avant l'impôt." }], corr: "Résultat d'exploitation : 2 400 − 900 = 1 500. Après charges financières : 1 000. Impôt 250. Résultat net : 750 M." },
        { type: "nombre", transfert: true, q: "Résultat net 750 M et dotations aux amortissements 900 M : quelle CAF, en millions ?", unite: "M FCFA", tol: 0, rep: function () { return 1650; }, pieges: [{ v: 750, msg: "Le résultat net sous-estime l'argent dégagé : les 900 M d'amortissements n'ont pas été décaissés." }], corr: "750 + 900 = 1 650 M." }
      ],
      pratique: { texte: "Dans le cas « Prêter à Ciments Bakar », retrouvez l'EBE et la CAF à partir du compte de résultat.", lien: "cas:pret" } },

    { id: "f3", partie: "A", titre: "L'analyse par les ratios", duree: "35 min",
      objectifs: ["Calculer marges, rentabilité des capitaux propres et rentabilité économique", "Mesurer l'endettement et la capacité à payer ses intérêts", "Interpréter un ratio par comparaison"],
      sections: [
        { t: "Rentabilité", liste: [
          "Marge d'EBE = EBE ÷ chiffre d'affaires.",
          "Marge nette = résultat net ÷ chiffre d'affaires.",
          "Rentabilité des capitaux propres (ROE) = résultat net ÷ capitaux propres : ce que gagnent les associés.",
          "Rentabilité économique (ROCE) = résultat d'exploitation après impôt ÷ capitaux investis (capitaux propres + dette nette)."] },
        { t: "Solvabilité et liquidité", liste: [
          "Dette nette = dettes financières − trésorerie.",
          "Dette nette ÷ EBE : en combien d'années l'EBE rembourserait la dette. Les banques regardent souvent un plafond autour de 3.",
          "Couverture des intérêts = résultat d'exploitation ÷ charges financières.",
          "Liquidité générale = actif courant ÷ passif courant."] },
        { t: "Un ratio seul ne dit rien", p: ["On compare un ratio à celui des années précédentes et à celui d'entreprises du même secteur. Une marge de 5 % est faible pour un opérateur télécom, normale pour un distributeur."] }
      ],
      retenir: ["Rentabilité, solvabilité, liquidité : trois questions différentes.", "Dette nette ÷ EBE et couverture des intérêts : les deux ratios du banquier.", "Toujours comparer : dans le temps et dans le secteur."],
      exos: [
        { type: "nombre", q: "Résultat net 750 M, capitaux propres 6 000 M. ROE, en % ?", unite: "%", tol: .05, rep: function () { return 12.5; }, pieges: [{ v: 5.36, tol: .05, msg: "Vous avez divisé par le total de l'actif (14 000). Le ROE rapporte le résultat aux seuls capitaux propres." }], corr: "750 ÷ 6 000 = 12,5 %." },
        { type: "nombre", q: "Dettes financières 5 000 M, trésorerie 500 M, EBE 2 400 M. Dette nette ÷ EBE (une décimale) ?", unite: "", tol: .05, rep: function () { return Math.round((5000 - 500) / 2400 * 10) / 10; },
          pieges: [{ v: 2.1, tol: .05, msg: "Vous avez pris la dette brute. On retire la trésorerie disponible : dette nette = 4 500." }], corr: "(5 000 − 500) ÷ 2 400 = 1,9 année d'EBE." },
        { type: "nombre", q: "Résultat d'exploitation 1 500 M, charges financières 500 M. Couverture des intérêts ?", unite: "fois", tol: 0, rep: function () { return 3; }, corr: "1 500 ÷ 500 = 3 : l'exploitation couvre trois fois les intérêts." },
        { type: "qcm", transfert: true, q: "Distributeur A : marge nette 3 %. Cimentier B : marge nette 6 %. B est-il mieux géré ?", choix: ["Oui, sa marge est double", "On ne peut pas conclure : les secteurs n'ont pas les mêmes marges", "Non, A vend sûrement plus"], bonne: 1,
          fb: ["Non : un distributeur vit de volumes avec des marges faibles ; un cimentier immobilise beaucoup de capital.", "Juste : on compare dans un même secteur, et on regarde aussi la rentabilité des capitaux investis.", "Non : on ne peut pas le déduire non plus."] }
      ],
      pratique: { texte: "Dans le cas « Prêter à Ciments Bakar », faites varier le montant du prêt et regardez dette nette ÷ EBE et couverture des intérêts.", lien: "cas:pret" } },

    { id: "f4", partie: "A", titre: "Fonds de roulement, BFR et trésorerie", duree: "35 min",
      objectifs: ["Calculer le fonds de roulement et le besoin en fonds de roulement", "Exprimer un délai clients en jours", "Expliquer la trésorerie par l'équation FR − BFR"],
      sections: [
        { t: "Le besoin en fonds de roulement", p: ["L'exploitation immobilise de l'argent : les stocks attendent d'être vendus, les clients paient plus tard. Les fournisseurs, eux, financent une partie en se faisant payer après."], f: "BFR = Stocks + Créances clients − Dettes fournisseurs − Autres dettes d'exploitation", ex: "Ciments Bakar : 1 500 + 3 000 − 2 500 − 500 = 1 500 M, soit 45 jours de chiffre d'affaires." },
        { t: "Le fonds de roulement", p: ["C'est l'excédent des ressources durables (capitaux propres et dettes à long terme) sur les immobilisations. Il sert à financer le BFR."], f: "FR = Capitaux propres + Dettes financières − Immobilisations nettes" },
        { t: "L'équation de la trésorerie", f: "Trésorerie nette = FR − BFR", p: ["Si le BFR grandit plus vite que le fonds de roulement, la trésorerie fond, même avec des bénéfices. C'est le piège de la croissance."] },
        { t: "Les délais en jours", f: "Délai clients = Créances clients ÷ Chiffre d'affaires × 360", p: ["On calcule de même un délai fournisseurs (sur les achats) et une durée de stockage."] }
      ],
      retenir: ["BFR : ce que l'exploitation immobilise.", "Trésorerie nette = FR − BFR.", "Croître vite peut vider la caisse : le BFR grandit avec les ventes."],
      exos: [
        { type: "nombre", q: "Capitaux propres 6 000, dettes financières 5 000, immobilisations nettes 9 000 (en M). Fonds de roulement ?", unite: "M FCFA", tol: 0, rep: function () { return 2000; }, corr: "6 000 + 5 000 − 9 000 = 2 000 M." },
        { type: "nombre", q: "Créances clients 3 000 M, chiffre d'affaires 12 000 M. Délai clients, en jours (année de 360 jours) ?", unite: "jours", tol: 0, rep: function () { return 90; }, pieges: [{ v: 25, msg: "Vous avez donné un pourcentage (25 %). Multipliez par 360 pour l'exprimer en jours de ventes." }], corr: "3 000 ÷ 12 000 × 360 = 90 jours." },
        { type: "nombre", transfert: true, q: "Une entreprise double son chiffre d'affaires. Son BFR, de 45 jours de CA, passe donc de 1 500 à 3 000 M. Son fonds de roulement reste à 2 000 M. Trésorerie nette ?", unite: "M FCFA", tol: 0, rep: function () { return -1000; }, pieges: [{ v: 500, msg: "C'est la situation avant la croissance. Le BFR a doublé, pas le fonds de roulement." }], corr: "2 000 − 3 000 = −1 000 M : la croissance se finance à découvert si rien n'est fait." }
      ],
      outil: "bfr",
      pratique: { texte: "Le cas « La grosse commande » met ce mécanisme en scène : un client important, mais qui paie à 90 jours.", lien: "cas:bfr" } },

    /* ───────── B · Décider d'investir ───────── */
    { id: "f5", partie: "B", titre: "Actualisation, annuités et emprunts", duree: "30 min",
      objectifs: ["Actualiser une série de flux", "Calculer l'annuité constante d'un emprunt", "Construire un tableau d'amortissement"],
      sections: [
        { t: "Actualiser une série", f: "Valeur actuelle = Σ Fₜ ÷ (1 + r)ᵗ", p: ["Chaque flux futur est ramené à aujourd'hui avec le taux exigé. Un flux lointain pèse moins qu'un flux proche."] },
        { t: "L'annuité constante", p: ["Un emprunt remboursé par annuités constantes paie chaque année la même somme : d'abord surtout des intérêts, puis surtout du capital."], f: "Annuité = Capital × r ÷ (1 − (1 + r)⁻ⁿ)", ex: "100 M sur 5 ans à 9 % : 25,71 M par an. Total payé 128,55 M, dont 28,55 M d'intérêts." }
      ],
      outil: "annuite",
      retenir: ["Actualiser, c'est comparer des sommes à la même date.", "Annuité constante : la part d'intérêts baisse, la part de capital monte.", "Coût total d'un emprunt = somme des annuités − capital."],
      exos: [
        { type: "nombre", q: "Emprunt de 100 M sur 5 ans à 9 %, annuités constantes. Montant de l'annuité, en M (deux décimales) ?", unite: "M FCFA", tol: .01, rep: function () { return r2(annuite(100, .09, 5)); },
          pieges: [{ v: 29, tol: .01, msg: "Vous avez ajouté 9 M d'intérêts à 20 M de capital chaque année : ce sont des intérêts sur le capital initial, pas sur le capital restant dû." }, { v: 20, msg: "C'est le seul remboursement de capital. Il faut ajouter les intérêts." }],
          corr: "100 × 0,09 ÷ (1 − 1,09⁻⁵) = 9 ÷ 0,35007 = 25,71 M." },
        { type: "nombre", q: "Même emprunt : intérêts payés la première année, en M ?", unite: "M FCFA", tol: 0, rep: function () { return 9; }, corr: "100 × 9 % = 9 M. Le reste de l'annuité, 16,71 M, rembourse du capital." },
        { type: "nombre", transfert: true, q: "Coût total des intérêts de cet emprunt sur 5 ans, en M (deux décimales) ?", unite: "M FCFA", tol: .02, rep: function () { return r2(annuite(100, .09, 5) * 5 - 100); }, pieges: [{ v: 45, msg: "5 × 9 M suppose que l'on doit 100 M pendant 5 ans. Or le capital restant dû diminue chaque année." }], corr: "5 × 25,71 − 100 = 28,55 M." }
      ],
      pratique: { texte: "Faites varier la durée dans l'outil : à taux égal, allonger l'emprunt baisse l'annuité mais augmente le coût total.", lien: null } },

    { id: "f6", partie: "B", titre: "VAN, TRI et délai de récupération", duree: "35 min",
      objectifs: ["Calculer la valeur actuelle nette d'un projet", "Interpréter un taux de rentabilité interne", "Connaître les limites du délai de récupération"],
      sections: [
        { t: "La valeur actuelle nette", p: ["On actualise tous les flux du projet, investissement compris, au taux exigé par les financeurs. Si la VAN est positive, le projet rapporte plus que ce taux : il crée de la valeur."], f: "VAN = −I₀ + Σ Fₜ ÷ (1 + r)ᵗ" },
        { t: "Le taux de rentabilité interne", p: ["Le TRI est le taux qui annule la VAN. On compare le TRI au taux exigé : TRI > taux exigé ⇔ VAN > 0, pour un projet classique (une dépense, puis des recettes)."] },
        { t: "Le délai de récupération", p: ["Il dit en combien d'années les flux remboursent l'investissement. Simple à lire, il ignore ce qui vient après et, dans sa version simple, la valeur du temps. Il complète la VAN, il ne la remplace pas."] }
      ],
      outil: "van",
      retenir: ["VAN > 0 : le projet crée de la valeur au taux exigé.", "TRI : le taux qui annule la VAN.", "Le délai de récupération mesure un risque de liquidité, pas la rentabilité."],
      exos: [
        { type: "nombre", q: "Projet : −1 000 M aujourd'hui, puis +400 M par an pendant 3 ans. Taux exigé 10 %. VAN, en M (arrondie à l'unité) ?", unite: "M FCFA", tol: 1, rep: function () { return Math.round(van(.10, [-1000, 400, 400, 400])); },
          pieges: [{ v: 200, msg: "Vous avez additionné les flux sans les actualiser. 400 M dans trois ans valent moins de 400 M aujourd'hui." }], corr: "400 ÷ 1,1 + 400 ÷ 1,21 + 400 ÷ 1,331 = 994,74. VAN : −5 M. Le projet détruit légèrement de la valeur à 10 %." },
        { type: "qcm", q: "Ce projet a un TRI d'environ 9,7 %. Que conclure avec un taux exigé de 10 % ?", choix: ["L'accepter : 9,7 % est un bon rendement", "Le refuser : il rapporte moins que ce qu'exigent les financeurs", "Impossible à dire"], bonne: 1,
          fb: ["Non : il ne couvre pas le coût de l'argent qui le finance.", "Juste : TRI < taux exigé, cohérent avec une VAN négative.", "Si : TRI et VAN donnent la même réponse ici."] },
        { type: "nombre", transfert: true, q: "Même projet. Délai de récupération simple, en années (une décimale) ?", unite: "ans", tol: .05, rep: function () { return 2.5; }, corr: "Après 2 ans : 800 M récupérés. Il manque 200 M, soit la moitié de l'année 3 : 2,5 ans. Le projet se récupère vite, et pourtant sa VAN est négative." }
      ],
      pratique: { texte: "Dans le cas « Investir dans une usine de cajou », trouvez le volume pour lequel la VAN s'annule.", lien: "cas:invest" } },

    { id: "f7", partie: "B", titre: "Construire les flux d'un projet", duree: "35 min",
      objectifs: ["Calculer un flux de trésorerie d'exploitation après impôt", "Intégrer l'économie d'impôt des amortissements", "Ajouter la variation de BFR et la valeur résiduelle"],
      sections: [
        { t: "Ne retenir que ce qui change", p: ["On ne compte que les flux différentiels : ce que le projet ajoute ou retire par rapport à ne rien faire. Les frais d'études déjà payés n'entrent pas : ils sont dépensés quoi qu'on décide."] },
        { t: "Le flux d'exploitation", f: "Flux = (EBE − Amortissement) × (1 − t) + Amortissement", p: ["L'amortissement n'est pas décaissé, mais il réduit l'impôt. Cette économie d'impôt fait partie des flux."], ex: "EBE 500, amortissement 200, impôt 25 % : (500 − 200) × 0,75 + 200 = 425 M." },
        { t: "BFR et valeur résiduelle", p: ["Un projet qui augmente les ventes augmente le BFR : c'est une dépense au départ, récupérée en fin de projet. On ajoute enfin la valeur de revente des équipements, nette d'impôt."] }
      ],
      retenir: ["Flux différentiels seulement, sans les coûts déjà engagés.", "L'amortissement compte par l'impôt qu'il fait économiser.", "Le BFR se finance au début et se récupère à la fin."],
      exos: [
        { type: "nombre", q: "EBE annuel 500 M, amortissement 200 M, impôt 25 %. Flux de trésorerie d'exploitation, en M ?", unite: "M FCFA", tol: 0, rep: function () { return 425; },
          pieges: [{ v: 375, msg: "Vous avez appliqué l'impôt à tout l'EBE. L'amortissement réduit la base imposable." }, { v: 225, msg: "C'est le résultat net. Il faut y rajouter l'amortissement, qui n'est pas décaissé." }], corr: "(500 − 200) × 0,75 + 200 = 225 + 200 = 425 M." },
        { type: "nombre", q: "Un amortissement de 200 M par an fait économiser combien d'impôt, à 25 % ?", unite: "M FCFA", tol: 0, rep: function () { return 50; }, corr: "200 × 25 % = 50 M par an." },
        { type: "qcm", transfert: true, q: "Une étude de marché de 30 M a déjà été payée. Faut-il l'inclure dans la VAN du projet ?", choix: ["Oui, c'est une dépense du projet", "Non : elle est payée quelle que soit la décision", "Seulement si le projet est accepté"], bonne: 1,
          fb: ["Non : on ne compte que ce que la décision change.", "Juste : c'est un coût irrécupérable.", "Non : même alors, elle ne change pas avec la décision."] }
      ],
      pratique: { texte: "Le cas « Investir dans une usine de cajou » calcule chaque flux devant vous : EBE, impôt, amortissement, BFR.", lien: "cas:invest" } },

    { id: "f8", partie: "B", titre: "Le risque d'un projet : sensibilité, scénarios, point mort", duree: "30 min",
      objectifs: ["Calculer un point mort", "Mener une analyse de sensibilité", "Pondérer des scénarios"],
      sections: [
        { t: "Le point mort", p: ["C'est le volume à partir duquel l'entreprise couvre ses coûts fixes."], f: "Point mort (quantité) = Coûts fixes ÷ (Prix − Coût variable unitaire)", ex: "Coûts fixes 300 M, prix 1 M par tonne, coût variable 0,6 M : 750 tonnes." },
        { t: "Sensibilité", p: ["On fait varier une hypothèse à la fois (prix, volume, coût, taux) et on regarde la VAN. Celle qui la fait le plus bouger mérite le plus d'attention."] },
        { t: "Scénarios", p: ["On décrit quelques avenirs cohérents (pessimiste, central, optimiste), avec une probabilité chacun. La VAN espérée résume, mais il faut regarder aussi le pire cas : l'entreprise y survit-elle ?"], f: "VAN espérée = Σ pᵢ × VANᵢ" }
      ],
      retenir: ["Point mort = coûts fixes ÷ marge unitaire.", "Une hypothèse à la fois pour voir ce qui compte.", "Regardez la VAN espérée et le pire scénario."],
      exos: [
        { type: "nombre", q: "Coûts fixes 300 M, prix de vente 1 M par tonne, coût variable 0,6 M par tonne. Point mort, en tonnes ?", unite: "tonnes", tol: 0, rep: function () { return 750; }, pieges: [{ v: 300, msg: "Vous avez divisé par le prix. Chaque tonne ne contribue que de sa marge : 0,4 M." }, { v: 500, msg: "Vous avez divisé par le coût variable. Il faut diviser par la marge unitaire, prix − coût variable." }], corr: "300 ÷ (1 − 0,6) = 750 tonnes." },
        { type: "nombre", q: "Scénarios : pessimiste (30 %) VAN −200 M ; central (50 %) +300 M ; optimiste (20 %) +800 M. VAN espérée ?", unite: "M FCFA", tol: 0, rep: function () { return 0.3 * -200 + 0.5 * 300 + 0.2 * 800; }, corr: "0,3 × (−200) + 0,5 × 300 + 0,2 × 800 = −60 + 150 + 160 = 250 M." },
        { type: "qcm", transfert: true, q: "Un projet a une VAN espérée positive, mais dans le scénario pessimiste l'entreprise ne pourrait plus rembourser sa dette. Que faire ?", choix: ["L'accepter : la moyenne est positive", "Le revoir : réduire le risque (taille, financement, contrats) avant de décider", "Le refuser sans discussion"], bonne: 1,
          fb: ["Risqué : une moyenne ne protège pas d'une faillite.", "Juste : on cherche à rendre le pire cas supportable.", "Pas forcément : il peut être rendu acceptable."] }
      ],
      pratique: { texte: "Dans le cas « Investir dans une usine de cajou », baissez le prix de 15 % et observez la VAN.", lien: "cas:invest" } },

    /* ───────── C · Financer ───────── */
    { id: "f9", partie: "C", titre: "Les sources de financement dans l'UEMOA", duree: "25 min",
      objectifs: ["Connaître les grandes sources de financement d'une entreprise", "Distinguer financement interne et externe", "Choisir une source adaptée à un besoin"],
      sections: [
        { t: "Financement interne", p: ["L'autofinancement (la CAF non distribuée) est la source la plus simple : pas de prêteur, pas de nouvel associé. Il est limité par la rentabilité de l'entreprise."] },
        { t: "Financement externe", liste: [
          "Le crédit bancaire, à court terme (découvert, escompte) ou à moyen et long terme (investissement).",
          "Le crédit-bail : on loue un équipement avec option d'achat, sans l'acheter d'emblée.",
          "L'emprunt obligataire, pour les plus grandes entreprises, par appel public à l'épargne, puis cotation à la Bourse (BRVM).",
          "L'augmentation de capital : de nouveaux associés, éventuellement par introduction en Bourse.",
          "Le capital-investissement : des fonds qui entrent au capital de PME pour quelques années.",
          "La microfinance, pour les très petites entreprises."] },
        { t: "Adapter la ressource au besoin", p: ["Un besoin durable (une usine) se finance par des ressources durables (capitaux propres, dette longue). Financer une usine avec un découvert, c'est s'exposer à devoir rembourser avant d'avoir gagné de quoi le faire."] }
      ],
      retenir: ["Autofinancement d'abord, quand c'est possible.", "Besoin long, ressource longue.", "Fonds propres : pas d'échéance, mais des associés à rémunérer."],
      exos: [
        { type: "qcm", q: "Une entreprise veut acheter des camions sans immobiliser sa trésorerie, en gardant la possibilité de les racheter. Quelle solution ?", choix: ["Découvert bancaire", "Crédit-bail", "Augmentation de capital"], bonne: 1,
          fb: ["Non : un découvert finance des besoins courts.", "Juste : location avec option d'achat.", "Possible, mais lourd pour des camions."] },
        { type: "qcm", q: "Financer la construction d'une usine par un découvert renouvelé chaque année : quel risque principal ?", choix: ["Un coût un peu plus élevé", "Devoir rembourser avant que l'usine produise : un risque de liquidité", "Aucun"], bonne: 1,
          fb: ["Le coût est le moindre problème.", "Juste : la banque peut ne pas renouveler le découvert.", "Non."] },
        { type: "qcm", transfert: true, q: "Une PME rentable mais sans garanties veut doubler sa capacité. Quelle piste examiner en premier ?", choix: ["Un emprunt obligataire à la Bourse (BRVM)", "Un fonds de capital-investissement ou un crédit-bail", "Un découvert"], bonne: 1,
          fb: ["Non : l'obligataire est réservé aux grandes signatures.", "Juste : fonds propres apportés par un investisseur, ou équipement financé par le crédit-bail.", "Non : besoin long."] }
      ],
      pratique: { texte: "Le cas « Financer 10 magasins : dette ou capital ? » vous fait choisir le mélange.", lien: "cas:financement" } },

    { id: "f10", partie: "C", titre: "Le coût du capital : MEDAF et CMPC", duree: "35 min",
      objectifs: ["Estimer le coût des fonds propres avec le MEDAF", "Calculer le coût moyen pondéré du capital", "Utiliser le CMPC comme taux d'actualisation"],
      sections: [
        { t: "Le coût des fonds propres", p: ["Les actionnaires exigent un rendement supérieur au placement sans risque, d'autant plus que l'entreprise est sensible au marché. Le MEDAF (modèle d'évaluation des actifs financiers) le formalise."], f: "kₑ = r_f + β × (r_m − r_f)", ex: "Taux sans risque 6 %, prime de marché 6 %, bêta 1,2 : kₑ = 6 + 1,2 × 6 = 13,2 %." },
        { t: "Le coût moyen pondéré du capital (CMPC)", p: ["On pondère le coût des fonds propres et le coût de la dette après impôt par leurs poids dans le financement. C'est le taux qu'un projet doit dépasser."], f: "CMPC = E/V × kₑ + D/V × k_d × (1 − t)" },
        { t: "Dans l'UEMOA", p: ["Le taux sans risque se lit souvent sur les titres d'État en FCFA. Les bêtas et primes de risque sont difficiles à estimer sur des marchés peu liquides : on raisonne par fourchettes."] }
      ],
      retenir: ["kₑ = taux sans risque + bêta × prime de marché.", "La dette coûte moins, après impôt, mais rend les fonds propres plus risqués.", "Le CMPC est le taux d'actualisation des projets de risque moyen."],
      exos: [
        { type: "nombre", q: "Taux sans risque 6 %, prime de risque du marché 6 %, bêta 1,2. Coût des fonds propres, en % ?", unite: "%", tol: .05, rep: function () { return 13.2; }, pieges: [{ v: 7.2, tol: .05, msg: "Vous avez oublié le taux sans risque : le bêta multiplie la prime, qu'on ajoute au taux sans risque." }], corr: "6 + 1,2 × 6 = 13,2 %." },
        { type: "nombre", q: "60 % de fonds propres à 13,2 %, 40 % de dette à 9 %, impôt 25 %. CMPC, en % (deux décimales) ?", unite: "%", tol: .01, rep: function () { return r2(.6 * 13.2 + .4 * 9 * .75); },
          pieges: [{ v: 11.52, tol: .01, msg: "Vous n'avez pas déduit l'impôt sur le coût de la dette : les intérêts sont déductibles." }], corr: "0,6 × 13,2 + 0,4 × 9 × 0,75 = 7,92 + 2,70 = 10,62 %." },
        { type: "qcm", transfert: true, q: "Un projet de risque moyen a un TRI de 10 %. Le CMPC de l'entreprise est de 10,62 %. Décision ?", choix: ["Accepter", "Refuser ou améliorer le projet", "Accepter si on le finance par la dette, moins chère"], bonne: 1,
          fb: ["Non : il ne couvre pas le coût du capital.", "Juste : TRI < CMPC.", "Non : financer par la dette ne rend pas le projet meilleur ; le risque se reporte sur les actionnaires."] }
      ],
      pratique: { texte: "Le cas « Financer 10 magasins » montre comment le coût des fonds propres monte avec la dette.", lien: "cas:financement" } },

    { id: "f11", partie: "C", titre: "Structure financière et effet de levier", duree: "30 min",
      objectifs: ["Calculer l'effet de levier sur la rentabilité des capitaux propres", "Comprendre qu'il joue dans les deux sens", "Relier endettement, risque et couverture des intérêts"],
      sections: [
        { t: "L'effet de levier", p: ["Si l'entreprise gagne sur ses actifs plus qu'elle ne paie sur sa dette, s'endetter augmente la rentabilité des capitaux propres. Sinon, la dette la réduit."], f: "ROE = ROCE + (ROCE − i) × D/E", ex: "ROCE 10 %, coût de la dette après impôt 6 %, dette égale aux fonds propres : ROE = 10 + 4 × 1 = 14 %." },
        { t: "Le levier dans les deux sens", p: ["Si le ROCE tombe à 4 %, le même endettement donne un ROE de 2 %. La dette amplifie les bonnes et les mauvaises années, et ses intérêts sont dus dans tous les cas."] },
        { t: "Jusqu'où s'endetter", p: ["La limite vient des prêteurs (dette nette ÷ EBE, couverture des intérêts) et du risque de défaut : au-delà d'un certain niveau, le coût de la dette et celui des fonds propres montent ensemble."] }
      ],
      outil: "levier",
      retenir: ["Levier favorable si ROCE > coût de la dette après impôt.", "Il amplifie aussi les pertes.", "La capacité d'endettement se mesure par l'EBE et la couverture des intérêts."],
      exos: [
        { type: "nombre", q: "ROCE 10 %, coût de la dette après impôt 6 %, D/E = 1. ROE, en % ?", unite: "%", tol: .05, rep: function () { return 14; }, corr: "10 + (10 − 6) × 1 = 14 %." },
        { type: "nombre", q: "La conjoncture se retourne : ROCE 4 %, même dette. ROE, en % ?", unite: "%", tol: .05, rep: function () { return 2; }, pieges: [{ v: 6, msg: "Vous avez inversé le signe : quand le ROCE est inférieur au coût de la dette, le levier réduit le ROE." }], corr: "4 + (4 − 6) × 1 = 2 %." },
        { type: "qcm", transfert: true, q: "Une entreprise aux résultats très variables (récoltes) doit-elle beaucoup s'endetter ?", choix: ["Oui, pour profiter du levier", "Plutôt non : ses mauvaises années rendraient les intérêts difficiles à payer", "Indifférent"], bonne: 1,
          fb: ["Le levier amplifierait la variabilité.", "Juste : plus l'activité est volatile, moins la dette est supportable.", "Non : le risque d'exploitation et le risque financier s'additionnent."] }
      ],
      pratique: { texte: "Dans le cas « Financer 10 magasins », poussez la dette à 100 % et regardez la couverture des intérêts.", lien: "cas:financement" } },

    { id: "f12", partie: "C", titre: "La politique de dividende", duree: "20 min",
      objectifs: ["Calculer un taux de distribution et un rendement du dividende", "Relier croissance et réinvestissement", "Arbitrer entre distribuer et réinvestir"],
      sections: [
        { t: "Distribuer ou garder", p: ["Le taux de distribution est la part du résultat versée aux actionnaires. Le reste est réinvesti. Une entreprise devrait garder ses bénéfices quand elle a des projets rentables (VAN > 0), et distribuer sinon."], f: "Croissance soutenable g = Taux de rétention × ROE", ex: "ROE 15 %, rétention 60 % : g = 9 % par an." },
        { t: "Le signal", p: ["Un dividende stable rassure ; une baisse inquiète. Les dirigeants lissent donc souvent les dividendes, au-delà de ce que justifient les résultats d'une année."] }
      ],
      retenir: ["Réinvestir n'a de sens que si les projets rapportent plus que le coût du capital.", "g = rétention × ROE.", "Le dividende est aussi un message."],
      exos: [
        { type: "nombre", q: "ROE 15 %, l'entreprise distribue 40 % de son résultat. Croissance soutenable, en % ?", unite: "%", tol: .05, rep: function () { return 9; }, pieges: [{ v: 6, msg: "Vous avez pris le taux de distribution (40 %). La croissance vient de ce qui est gardé : 60 %." }], corr: "0,6 × 15 = 9 %." },
        { type: "qcm", transfert: true, q: "Une entreprise n'a aucun projet qui rapporte plus que son CMPC. Que faire de son bénéfice ?", choix: ["Le garder en trésorerie", "Le distribuer (dividende ou rachat d'actions)", "Investir quand même"], bonne: 1,
          fb: ["La trésorerie dormante rapporte moins que le coût du capital.", "Juste : les actionnaires peuvent mieux le placer eux-mêmes.", "Non : ce serait détruire de la valeur."] }
      ],
      pratique: { texte: "Dans le cas « Valoriser Boulangeries Kanga », regardez comment la croissance retenue change la valeur.", lien: "cas:valo" } },

    /* ───────── D · Valoriser et gouverner ───────── */
    { id: "f13", partie: "D", titre: "Valoriser une entreprise : flux actualisés et multiples", duree: "40 min",
      objectifs: ["Distinguer valeur d'entreprise et valeur des fonds propres", "Valoriser par les flux de trésorerie disponibles actualisés", "Valoriser par les multiples de comparables"],
      sections: [
        { t: "Valeur d'entreprise et valeur des fonds propres", f: "Valeur des fonds propres = Valeur d'entreprise − Dette nette", p: ["La valeur d'entreprise est celle de l'outil de production, quel que soit son financement. Les actionnaires n'en reçoivent que ce qui reste après les prêteurs."] },
        { t: "Les flux disponibles actualisés (DCF)", p: ["Flux disponible = flux d'exploitation après impôt − investissements − variation de BFR. On actualise ces flux au CMPC, puis on ajoute une valeur terminale."], f: "Valeur terminale = FCF_{n+1} ÷ (CMPC − g)" },
        { t: "Les multiples", p: ["On applique à l'entreprise le multiple observé sur des sociétés comparables, par exemple valeur d'entreprise ÷ EBE. Rapide, cette méthode dépend du choix des comparables, souvent rares sur un petit marché."], ex: "EBE 2 400 M × multiple de 7 = valeur d'entreprise de 16 800 M. Moins une dette nette de 4 500 M : fonds propres de 12 300 M." }
      ],
      retenir: ["VE − dette nette = valeur des fonds propres.", "DCF : la valeur vient des flux futurs, sensible au CMPC et à g.", "Multiples : rapides, mais seulement aussi bons que les comparables."],
      exos: [
        { type: "nombre", q: "EBE 2 400 M, multiple VE/EBE des comparables 7, dette nette 4 500 M. Valeur des fonds propres, en M ?", unite: "M FCFA", tol: 0, rep: function () { return 2400 * 7 - 4500; }, pieges: [{ v: 16800, msg: "C'est la valeur d'entreprise. Les actionnaires reçoivent ce qui reste après la dette nette." }], corr: "2 400 × 7 = 16 800 ; 16 800 − 4 500 = 12 300 M." },
        { type: "nombre", q: "Flux disponible attendu l'an prochain 1 000 M, croissance perpétuelle 3 %, CMPC 11 %. Valeur d'entreprise (rente perpétuelle croissante), en M ?", unite: "M FCFA", tol: 1, rep: function () { return 12500; }, pieges: [{ v: 9090.9, tol: 1, msg: "Vous avez divisé par 11 % sans retirer la croissance." }], corr: "1 000 ÷ (0,11 − 0,03) = 12 500 M." },
        { type: "nombre", transfert: true, q: "Même entreprise, mais le CMPC est de 12 %. Nouvelle valeur d'entreprise, en M (arrondie) ?", unite: "M FCFA", tol: 1, rep: function () { return Math.round(1000 / .09); }, corr: "1 000 ÷ 0,09 = 11 111 M : un point de CMPC en plus retire 11 % de valeur." }
      ],
      pratique: { texte: "Le cas « Valoriser Boulangeries Kanga » vous fait fixer un prix d'offre, entre DCF et multiples.", lien: "cas:valo" } },

    { id: "f14", partie: "D", titre: "Gouvernance et création de valeur", duree: "25 min",
      objectifs: ["Mesurer la création de valeur (ROCE comparé au CMPC)", "Comprendre les conflits d'intérêts entre dirigeants, actionnaires et prêteurs", "Connaître les mécanismes de gouvernance"],
      sections: [
        { t: "Créer de la valeur", p: ["Une entreprise crée de la valeur quand ses capitaux investis rapportent plus que leur coût. Croître sans rentabilité suffisante détruit de la valeur, même si le chiffre d'affaires grimpe."], f: "Valeur créée = (ROCE − CMPC) × Capitaux investis" },
        { t: "Les conflits d'intérêts", p: ["Les dirigeants peuvent préférer la taille à la rentabilité, ou éviter les risques qui menacent leur poste. Les actionnaires peuvent prendre des risques aux dépens des prêteurs. Dans les entreprises familiales, s'ajoutent les relations entre associés de la famille et associés extérieurs."] },
        { t: "Les mécanismes de gouvernance", liste: [
          "Un conseil d'administration avec des administrateurs indépendants.",
          "Des comptes certifiés par un commissaire aux comptes.",
          "Une rémunération des dirigeants liée à la création de valeur, pas seulement à la croissance.",
          "Des clauses dans les contrats de prêt (ratios à respecter)."] }
      ],
      retenir: ["Créer de la valeur : ROCE > CMPC.", "Taille n'est pas valeur.", "La gouvernance aligne les intérêts et contrôle les comptes."],
      exos: [
        { type: "nombre", q: "Capitaux investis 10 000 M, ROCE 12 %, CMPC 10,6 %. Valeur créée sur l'année, en M ?", unite: "M FCFA", tol: 0, rep: function () { return Math.round((12 - 10.6) / 100 * 10000); }, pieges: [{ v: 1200, msg: "C'est le résultat d'exploitation après impôt. La valeur créée retire le coût du capital investi." }], corr: "(12 % − 10,6 %) × 10 000 = 140 M." },
        { type: "qcm", transfert: true, q: "Un dirigeant payé selon la croissance du chiffre d'affaires propose de racheter un concurrent peu rentable. Que surveiller ?", choix: ["Rien : la croissance est toujours bonne", "Que le rachat crée de la valeur (ROCE attendu > CMPC), au-delà de la taille", "Seulement le prix"], bonne: 1,
          fb: ["Non : croître en détruisant de la valeur appauvrit les actionnaires.", "Juste : et revoir une rémunération qui pousse à la taille.", "Le prix compte, mais surtout ce que l'acquisition rapportera."] }
      ],
      pratique: { texte: "Relisez vos décisions dans « Mes décisions » : chacune a-t-elle comparé un rendement au coût du capital ?", lien: null } }
  ];

  var API = { PARTIES: PARTIES, CHAPITRES: CH, van: van, tri: tri, annuite: annuite };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else racine.EFA_CF_COURS = API;
})(this);
