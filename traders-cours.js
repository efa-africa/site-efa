/* EFA Traders · Le cours de finance de marché (niveau étudiant, premier cycle)
   14 chapitres en 5 parties. Chaque chapitre : objectifs, notions avec formules et exemples en FCFA,
   un outil interactif quand il aide, « À retenir », exercices corrigés (une explication par erreur fréquente),
   un cas de transfert, puis la pratique dans le simulateur.
   Les réponses numériques sont calculées par le code (pas recopiées à la main). Montants fictifs. */
(function (racine) {
  "use strict";
  function r2(x) { return Math.round(x * 100) / 100; }
  function vf(c, t, n) { return c * Math.pow(1 + t, n); }
  function prixOblig(nom, coupon, taux, n) { var p = 0; for (var k = 1; k <= n; k++) p += nom * coupon / Math.pow(1 + taux, k); return p + nom / Math.pow(1 + taux, n); }

  var PARTIES = [
    { id: "A", titre: "Les bases", sous: "Ce qu'est un marché, ce que vaut le temps" },
    { id: "B", titre: "Les titres", sous: "Actions, obligations, fonds" },
    { id: "C", titre: "Risque et portefeuille", sous: "Mesurer, répartir, comparer" },
    { id: "D", titre: "Le marché en pratique", sous: "Ordres, carnet, devises" },
    { id: "E", titre: "Aller plus loin", sous: "Valoriser, dériver, se méfier" }
  ];

  var CH = [
    /* ───────── A · Les bases ───────── */
    { id: "c1", partie: "A", titre: "Marchés financiers et acteurs", duree: "20 min",
      objectifs: ["Distinguer marché primaire et marché secondaire", "Savoir qui fait quoi sur un marché boursier de l'UEMOA", "Comprendre ce que l'on achète vraiment en Bourse"],
      sections: [
        { t: "À quoi sert un marché financier", p: ["Un marché financier relie ceux qui ont besoin d'argent (entreprises, États) à ceux qui en ont à placer (ménages, caisses de retraite, assureurs).", "L'entreprise obtient des fonds pour investir ; l'investisseur obtient un titre : une part de l'entreprise (action) ou une créance sur elle (obligation)."] },
        { t: "Primaire et secondaire", p: ["Sur le marché primaire, le titre est créé et vendu pour la première fois : l'argent va à l'émetteur. C'est le cas d'une introduction en Bourse ou d'un emprunt obligataire.", "Sur le marché secondaire, les investisseurs s'échangent des titres qui existent déjà. L'entreprise ne reçoit rien : le prix se forme entre acheteurs et vendeurs. La Bourse est surtout un marché secondaire : elle rend les titres revendables."] },
        { t: "Les acteurs dans l'UEMOA", liste: [
          "La BRVM (Bourse régionale des valeurs mobilières), à Abidjan, commune aux huit pays de l'UEMOA : elle organise la cotation.",
          "Les SGI (sociétés de gestion et d'intermédiation) : seules habilitées à transmettre vos ordres. Vous passez toujours par une SGI agréée.",
          "Le DC/BR (Dépositaire central / Banque de règlement) : il tient les titres et règle les échanges entre SGI.",
          "L'AMF-UMOA (Autorité des marchés financiers de l'UMOA) : elle agrée les intermédiaires et surveille le marché.",
          "UMOA-Titres : elle organise les émissions de titres publics des États de l'Union (bons et obligations du Trésor)."] }
      ],
      retenir: ["Primaire : l'argent va à l'émetteur. Secondaire : il va au vendeur.", "On n'achète jamais une action « à la Bourse » directement : on passe par une SGI agréée.", "Le régulateur ne garantit pas les gains : il vérifie les règles."],
      exos: [
        { type: "qcm", q: "Kalao Télécom vend 2 millions d'actions nouvelles pour financer des antennes. Sur quel marché ?", choix: ["Marché primaire", "Marché secondaire"], bonne: 0,
          fb: ["Juste : les actions sont créées et l'argent va à Kalao Télécom.", "Non : sur le secondaire, des titres existants changent de main et l'entreprise ne reçoit rien. Ici, les actions sont nouvelles."] },
        { type: "qcm", q: "Vous achetez 50 actions Kalao Télécom à la BRVM à un autre investisseur. Que reçoit l'entreprise ?", choix: ["Le montant de votre achat", "Rien : l'argent va au vendeur", "Les frais de votre SGI"], bonne: 1,
          fb: ["Non : c'est le vendeur qui encaisse. L'entreprise a reçu l'argent une seule fois, à l'émission.", "Juste : sur le marché secondaire, l'argent passe de l'acheteur au vendeur.", "Non : les frais rémunèrent l'intermédiaire, pas l'entreprise."] },
        { type: "qcm", transfert: true, q: "Quelqu'un vous propose d'« acheter des actions de la BRVM » par simple transfert mobile money, sans SGI. Qu'en pensez-vous ?", choix: ["C'est un raccourci pratique", "C'est un signal d'alerte : on passe par une SGI agréée", "C'est normal pour de petits montants"], bonne: 1,
          fb: ["Non : aucun circuit officiel ne fonctionne ainsi.", "Juste : vérifiez que l'intermédiaire figure parmi les SGI agréées par l'AMF-UMOA.", "Non : le montant ne change pas la règle."] }
      ],
      pratique: { texte: "Ouvrez le marché libre et regardez une séance : chaque échange que vous voyez a lieu sur le marché secondaire.", lien: "li:libre-actions" } },

    { id: "c2", partie: "A", titre: "La valeur du temps : intérêts et actualisation", duree: "25 min",
      objectifs: ["Calculer une valeur future à intérêts composés", "Ramener un montant futur à sa valeur d'aujourd'hui", "Comparer des sommes reçues à des dates différentes"],
      sections: [
        { t: "Intérêts simples et composés", p: ["Avec des intérêts simples, on gagne chaque année un pourcentage du capital de départ seulement.", "Avec des intérêts composés, les intérêts gagnés produisent à leur tour des intérêts. L'écart grandit avec le temps."], f: "Valeur future = Capital × (1 + taux)^années", ex: "1 000 000 FCFA à 6 % pendant 2 ans : 1 000 000 × 1,06 × 1,06 = 1 123 600 FCFA. En simple, on aurait 1 120 000 FCFA." },
        { t: "Actualiser", p: ["Actualiser, c'est faire le chemin inverse : combien vaut aujourd'hui une somme promise plus tard ? Une somme future vaut moins qu'une somme présente, parce qu'on aurait pu placer l'argent entre-temps."], f: "Valeur actuelle = Montant futur ÷ (1 + taux)^années", ex: "1 123 600 FCFA dans 2 ans, au taux de 6 %, valent 1 000 000 FCFA aujourd'hui." },
        { t: "La règle de 72", p: ["Pour estimer en combien d'années un capital double à intérêts composés, divisez 72 par le taux en pour cent. C'est une approximation, correcte pour des taux de 2 à 15 %."] }
      ],
      outil: "interets",
      retenir: ["Le temps a un prix : le taux d'intérêt.", "Composés : les intérêts produisent des intérêts.", "Pour comparer deux montants, ramenez-les à la même date."],
      exos: [
        { type: "nombre", q: "1 000 000 FCFA placés 5 ans à 6 % par an, intérêts composés. Valeur finale, en FCFA (arrondi à l'unité) ?", unite: "FCFA", tol: 1, rep: function () { return Math.round(vf(1e6, .06, 5)); },
          pieges: [{ v: 1300000, msg: "Vous avez calculé des intérêts simples (60 000 × 5). Ici, chaque année, les intérêts s'ajoutent au capital et rapportent à leur tour." }, { v: 1060000, msg: "C'est la valeur après un an seulement. Il faut appliquer 1,06 cinq fois." }],
          corr: "1 000 000 × 1,06⁵ = 1 000 000 × 1,338226 = 1 338 226 FCFA." },
        { type: "nombre", q: "On vous promet 1 000 000 FCFA dans 3 ans. Avec un taux de 8 %, combien cela vaut-il aujourd'hui (arrondi à l'unité) ?", unite: "FCFA", tol: 1, rep: function () { return Math.round(1e6 / Math.pow(1.08, 3)); },
          pieges: [{ v: 760000, tol: 1000, msg: "Vous avez retiré 3 × 8 % : c'est une actualisation « simple ». Il faut diviser par 1,08 trois fois." }, { v: 1259712, tol: 1, msg: "Vous avez capitalisé (× 1,08³) au lieu d'actualiser (÷ 1,08³)." }],
          corr: "1 000 000 ÷ 1,08³ = 1 000 000 ÷ 1,259712 = 793 832 FCFA." },
        { type: "nombre", transfert: true, q: "Avec la règle de 72, en combien d'années un placement à 9 % double-t-il ?", unite: "ans", tol: 0, rep: function () { return 8; },
          pieges: [{ v: 11.1, tol: .2, msg: "Vous avez divisé 100 par 9. La règle utilise 72, qui tient compte des intérêts composés." }],
          corr: "72 ÷ 9 = 8 ans. Le calcul exact donne 8,04 ans." }
      ],
      pratique: { texte: "Gardez cette idée en tête dans le simulateur : un gain de 2 % en dix séances n'a pas la même valeur qu'un gain de 2 % en un an.", lien: null } },

    /* ───────── B · Les titres ───────── */
    { id: "c3", partie: "B", titre: "Les actions : rendement, dividende, PER", duree: "30 min",
      objectifs: ["Calculer le rendement total d'une action, dividende compris", "Lire un rendement du dividende et un PER", "Ne pas confondre une action bon marché et une action peu chère"],
      sections: [
        { t: "Ce que rapporte une action", p: ["Une action rapporte de deux façons : la variation de son cours (plus-value ou moins-value) et le dividende, la part du bénéfice que l'entreprise distribue. Ni l'un ni l'autre n'est garanti."], f: "Rendement total = (Cours final − Cours initial + Dividendes) ÷ Cours initial", ex: "Achat à 8 000, revente à 8 400, dividende de 320 : (400 + 320) ÷ 8 000 = 9 %." },
        { t: "Le rendement du dividende", p: ["Il rapporte le dividende annuel au cours de l'action. Un rendement très élevé peut annoncer un dividende qui va baisser, ou un cours qui a chuté."], f: "Rendement du dividende = Dividende annuel ÷ Cours" },
        { t: "Le PER (price earnings ratio)", p: ["Le PER compare le prix de l'action au bénéfice par action (BPA). Un PER de 10 signifie qu'on paie 10 années de bénéfice actuel.", "Un PER bas n'est pas forcément une affaire : le marché attend peut-être une baisse des bénéfices. On le compare à des entreprises du même secteur."], f: "PER = Cours ÷ Bénéfice par action" }
      ],
      retenir: ["Rendement total = cours + dividendes.", "Un dividende élevé n'est pas un gain garanti.", "Un PER se compare dans un même secteur, jamais seul."],
      exos: [
        { type: "nombre", q: "Vous achetez une action à 10 000 FCFA. Un an après, elle cote 10 800 FCFA et a versé 400 FCFA de dividende. Rendement total, en % ?", unite: "%", tol: .05, rep: function () { return 12; },
          pieges: [{ v: 8, msg: "Vous avez oublié le dividende : il fait partie du rendement de l'actionnaire." }, { v: 4, msg: "C'est le rendement du dividende seul. Il faut y ajouter la hausse du cours." }],
          corr: "(10 800 − 10 000 + 400) ÷ 10 000 = 1 200 ÷ 10 000 = 12 %." },
        { type: "nombre", q: "Une action cote 12 500 FCFA. Son bénéfice par action est de 1 250 FCFA. Quel est son PER ?", unite: "", tol: 0, rep: function () { return 10; },
          pieges: [{ v: .1, tol: .001, msg: "Vous avez divisé le bénéfice par le cours : c'est l'inverse du PER (le rendement bénéficiaire, 10 %)." }],
          corr: "12 500 ÷ 1 250 = 10. On paie 10 années de bénéfice actuel." },
        { type: "qcm", transfert: true, q: "Banque A : PER 6. Banque B : PER 11. Qu'en conclure ?", choix: ["A est forcément une meilleure affaire", "Le marché paie plus cher les bénéfices de B : il faut chercher pourquoi", "B est surévaluée"], bonne: 1,
          fb: ["Non : un PER bas peut refléter des craintes (impayés, bénéfices en baisse).", "Juste : un écart de PER est une question, pas une réponse. Croissance, risque, qualité des bénéfices l'expliquent.", "Pas forcément : B peut avoir des bénéfices plus sûrs ou en croissance."] }
      ],
      pratique: { texte: "Dans le scénario « Mauvaise nouvelle », lisez la fiche de chaque entreprise avant d'acheter : bénéfice, risques, puis observez ce que fait le cours après l'événement.", lien: "sc:nouvelle" } },

    { id: "c4", partie: "B", titre: "Les obligations : coupon, prix et taux", duree: "35 min",
      objectifs: ["Calculer le coupon d'une obligation", "Calculer le prix d'une obligation à partir du taux du marché", "Comprendre pourquoi le prix baisse quand les taux montent"],
      sections: [
        { t: "Une obligation, c'est un prêt", p: ["L'investisseur prête à un État ou à une entreprise. En échange, il reçoit chaque année un coupon (des intérêts), puis le remboursement du nominal à l'échéance.", "Dans l'UEMOA, les États empruntent beaucoup ainsi : obligations par appel public à l'épargne, cotées ensuite à la BRVM, ou titres émis par adjudication via UMOA-Titres."], f: "Coupon = Nominal × Taux du coupon", ex: "Nominal 10 000 FCFA, coupon 6 % : 600 FCFA par an." },
        { t: "Le prix d'une obligation", p: ["Le prix est la valeur actuelle de tout ce qu'elle va verser, actualisée au taux que le marché exige aujourd'hui pour ce type de prêt."], f: "Prix = Σ Coupon ÷ (1 + taux)^k + Nominal ÷ (1 + taux)^n", ex: "Si le taux du marché égale le taux du coupon, le prix égale le nominal : on dit que l'obligation cote au pair." },
        { t: "Pourquoi le prix baisse quand les taux montent", p: ["Si de nouvelles obligations paient 7 %, personne ne paiera 10 000 FCFA pour une ancienne qui paie 6 %. Son prix baisse jusqu'à offrir, elle aussi, environ 7 % à l'acheteur.", "Plus l'échéance est lointaine, plus le prix réagit fort à une variation de taux."] },
        { t: "Le risque de crédit", p: ["Si l'emprunteur risque de ne pas rembourser, les investisseurs exigent un taux plus élevé. L'écart avec un emprunteur jugé sûr s'appelle la prime de risque (ou spread de crédit)."] }
      ],
      outil: "obligation",
      retenir: ["Coupon = nominal × taux du coupon.", "Prix et taux varient en sens inverse.", "Plus l'échéance est longue, plus le prix est sensible aux taux."],
      exos: [
        { type: "nombre", q: "Obligation : nominal 10 000 FCFA, coupon 6 %, échéance 3 ans. Le taux du marché passe à 7 %. Nouveau prix, en FCFA (arrondi à l'unité) ?", unite: "FCFA", tol: 2, rep: function () { return Math.round(prixOblig(10000, .06, .07, 3)); },
          pieges: [{ v: 10000, msg: "C'est le prix au pair, quand le taux du marché égale le coupon. Ici le marché exige 7 % : le prix doit baisser." }, { v: 9900, tol: 5, msg: "Vous avez retiré 1 % du nominal. Il faut actualiser chaque flux à 7 % : 600, 600, puis 10 600." }],
          corr: "600 ÷ 1,07 + 600 ÷ 1,07² + 10 600 ÷ 1,07³ = 560,75 + 524,06 + 8 652,76 = 9 738 FCFA (9 737,57)." },
        { type: "qcm", q: "Les taux du marché baissent de 6 % à 5 %. Votre obligation à coupon 6 %…", choix: ["perd de la valeur", "prend de la valeur", "ne change pas tant que l'émetteur paie"], bonne: 1,
          fb: ["Non : c'est l'inverse. Son coupon de 6 % devient plus attractif que les nouvelles émissions.", "Juste : elle paie plus que le marché, son prix monte au-dessus du nominal.", "Non : son prix sur le marché change, même si les coupons restent identiques."] },
        { type: "qcm", transfert: true, q: "Deux États émettent à 5 ans. L'un paie 6,25 %, l'autre 7,5 %. Que traduit l'écart ?", choix: ["Une erreur de cotation", "Une prime de risque plus élevée exigée pour le second", "Un meilleur placement, sans contrepartie"], bonne: 1,
          fb: ["Non : l'écart est voulu par les investisseurs.", "Juste : un taux plus élevé rémunère un risque perçu plus élevé.", "Non : un rendement plus élevé a presque toujours une contrepartie en risque."] }
      ],
      pratique: { texte: "Utilisez l'outil de ce chapitre : faites varier le taux de 4 % à 9 % pour une échéance de 2 ans, puis de 10 ans. Comparez les écarts de prix.", lien: null } },

    { id: "c5", partie: "B", titre: "Fonds, OPCVM et frais", duree: "20 min",
      objectifs: ["Savoir ce qu'est un OPCVM (FCP, SICAV)", "Mesurer l'effet des frais sur longue durée", "Lire une valeur liquidative"],
      sections: [
        { t: "Investir à plusieurs", p: ["Un OPCVM (organisme de placement collectif) réunit l'argent de nombreux épargnants et l'investit pour eux en actions, obligations ou placements monétaires. Il prend la forme d'un FCP (fonds commun de placement) ou d'une SICAV.", "Dans l'UEMOA, ils sont agréés par l'AMF-UMOA. La valeur d'une part s'appelle la valeur liquidative : actif du fonds ÷ nombre de parts."], f: "Valeur liquidative = (Actifs − Dettes du fonds) ÷ Nombre de parts" },
        { t: "Ce que coûtent les frais", p: ["Des frais de gestion de 2 % par an semblent faibles. Ils s'appliquent pourtant chaque année sur tout le capital, et l'écart se compose avec le temps.", "Comparez toujours les fonds après frais : droits d'entrée, frais de gestion annuels, droits de sortie."] }
      ],
      outil: "interets",
      retenir: ["Un fonds diversifie à votre place, mais ne supprime pas le risque.", "Les frais annuels se composent comme des intérêts, à l'envers.", "Comparez les rendements nets de frais."],
      exos: [
        { type: "nombre", q: "Un fonds détient 1 250 000 000 FCFA d'actifs, n'a pas de dettes, et compte 250 000 parts. Valeur liquidative d'une part ?", unite: "FCFA", tol: 0, rep: function () { return 5000; },
          corr: "1 250 000 000 ÷ 250 000 = 5 000 FCFA par part." },
        { type: "nombre", q: "1 000 000 FCFA sur 10 ans. Rendement brut 8 % par an ; avec 2 % de frais annuels, il reste 6 %. Combien les frais coûtent-ils au bout de 10 ans (arrondi à l'unité) ?", unite: "FCFA", tol: 2, rep: function () { return Math.round(vf(1e6, .08, 10) - vf(1e6, .06, 10)); },
          pieges: [{ v: 200000, tol: 1000, msg: "Vous avez compté 2 % de 1 000 000 pendant 10 ans. Les frais s'appliquent chaque année à un capital qui grandit, et l'écart se compose." }],
          corr: "À 8 % : 1 000 000 × 1,08¹⁰ = 2 158 925. À 6 % : 1 000 000 × 1,06¹⁰ = 1 790 848. Écart : 368 077 FCFA, plus du tiers du capital de départ." },
        { type: "qcm", transfert: true, q: "Fonds A : 9 % brut, 2,5 % de frais. Fonds B : 8 % brut, 0,8 % de frais. Lequel rapporte le plus, à risque comparable ?", choix: ["A", "B"], bonne: 1,
          fb: ["Non : A rapporte 6,5 % net, B 7,2 % net.", "Juste : 8 − 0,8 = 7,2 % contre 9 − 2,5 = 6,5 %."] }
      ],
      pratique: { texte: "Le scénario « Frais répétés » montre le même mécanisme à court terme : chaque ordre coûte, et le coût s'additionne.", lien: "sc:frais" } },

    /* ───────── C · Risque et portefeuille ───────── */
    { id: "c6", partie: "C", titre: "Rendement et risque : moyenne, volatilité, baisse maximale", duree: "35 min",
      objectifs: ["Calculer un rendement moyen et une volatilité", "Distinguer moyenne arithmétique et rendement composé", "Lire une baisse maximale et un ratio de Sharpe"],
      sections: [
        { t: "Mesurer le rendement", p: ["La moyenne arithmétique des rendements annuels résume une série, mais surestime ce que l'on a vraiment gagné quand les rendements varient. Le rendement composé (géométrique) dit à quel taux constant le capital aurait grandi."], f: "Rendement composé = (Π (1 + rᵢ))^(1/n) − 1", ex: "+50 % puis −50 % : moyenne 0 %, mais 100 → 150 → 75. Le rendement composé est de −13,4 % par an." },
        { t: "Mesurer le risque", p: ["La volatilité est l'écart-type des rendements : elle dit de combien ils s'écartent, en moyenne, de leur moyenne. Plus elle est grande, plus le résultat d'une année est incertain.", "La baisse maximale mesure la plus forte chute depuis un sommet. C'est souvent ce que l'épargnant ressent vraiment."], f: "Volatilité σ = √( Σ (rᵢ − moyenne)² ÷ n )" },
        { t: "Rapporter le rendement au risque", p: ["Le ratio de Sharpe divise le rendement obtenu au-dessus d'un placement sans risque par la volatilité. Il permet de comparer deux placements qui n'ont pas le même risque."], f: "Sharpe = (Rendement − Taux sans risque) ÷ Volatilité" }
      ],
      retenir: ["Moyenne arithmétique ≥ rendement composé.", "Volatilité : l'incertitude. Baisse maximale : la douleur.", "Comparez des rendements à risque égal."],
      exos: [
        { type: "nombre", q: "Rendements annuels d'une action : +10 %, −5 %, +15 %, 0 %. Rendement moyen arithmétique, en % ?", unite: "%", tol: .05, rep: function () { return 5; }, corr: "(10 − 5 + 15 + 0) ÷ 4 = 20 ÷ 4 = 5 %." },
        { type: "nombre", q: "Même série. Volatilité (écart-type sur les 4 années), en %, une décimale ?", unite: "%", tol: .1, rep: function () { return Math.round(Math.sqrt(62.5) * 10) / 10; },
          pieges: [{ v: 62.5, tol: .1, msg: "62,5 est la variance. La volatilité est sa racine carrée." }, { v: 9.1, tol: .1, msg: "Vous avez divisé par 3 (écart-type d'échantillon). Ici, on demande l'écart-type sur les 4 années, en divisant par 4." }],
          corr: "Écarts à la moyenne : 5, −10, 10, −5. Carrés : 25, 100, 100, 25. Moyenne : 62,5. Racine : 7,9 %." },
        { type: "nombre", q: "Un placement a rapporté 8 % avec une volatilité de 10 %. Le placement sans risque rapporte 3 %. Ratio de Sharpe ?", unite: "", tol: .01, rep: function () { return .5; }, pieges: [{ v: .8, msg: "Vous n'avez pas retiré le taux sans risque : seul le rendement en plus du sans risque rémunère le risque pris." }], corr: "(8 − 3) ÷ 10 = 0,5." },
        { type: "nombre", transfert: true, q: "Un portefeuille passe de 1 000 000 à 1 300 000, puis tombe à 1 040 000. Baisse maximale, en % ?", unite: "%", tol: .05, rep: function () { return 20; },
          pieges: [{ v: 4, msg: "Vous avez comparé au point de départ. La baisse maximale se mesure depuis le sommet atteint, 1 300 000." }, { v: 26, tol: .1, msg: "Vous avez divisé la chute par le point bas. On divise par le sommet." }],
          corr: "(1 300 000 − 1 040 000) ÷ 1 300 000 = 20 %. Le portefeuille est pourtant en gain de 4 % depuis le départ." }
      ],
      pratique: { texte: "Terminez le scénario « Hausse puis retournement », puis lisez votre baisse maximale dans le bilan.", lien: "sc:retournement" } },

    { id: "c7", partie: "C", titre: "Diversification et corrélation", duree: "35 min",
      objectifs: ["Calculer le rendement d'un portefeuille", "Comprendre le rôle de la corrélation dans le risque", "Distinguer risque propre et risque de marché"],
      sections: [
        { t: "Le rendement d'un portefeuille", p: ["C'est la moyenne des rendements de ses lignes, pondérée par leur poids."], f: "R = w₁ × R₁ + w₂ × R₂", ex: "60 % à 10 % et 40 % à 5 % : 0,6 × 10 + 0,4 × 5 = 8 %." },
        { t: "Le risque d'un portefeuille", p: ["Le risque, lui, n'est pas une simple moyenne : il dépend de la façon dont les actifs bougent ensemble, mesurée par la corrélation (de −1 à +1).", "Corrélation +1 : ils montent et baissent ensemble, la diversification ne réduit rien. Corrélation 0 : leurs écarts se compensent en partie. Corrélation −1 : ils se compensent entièrement."], f: "σ² = w₁²σ₁² + w₂²σ₂² + 2 w₁ w₂ ρ σ₁ σ₂" },
        { t: "Ce que la diversification ne supprime pas", p: ["En ajoutant des titres, on réduit le risque propre à chaque entreprise (une mauvaise récolte, un client perdu). Le risque de marché, commun à tous (taux, crise, inflation), demeure."] }
      ],
      outil: "portefeuille",
      retenir: ["Le rendement se moyenne, pas le risque.", "Moins les actifs sont corrélés, plus la diversification réduit le risque.", "Le risque de marché ne se diversifie pas."],
      exos: [
        { type: "nombre", q: "Portefeuille : 60 % d'une action à 10 % de rendement attendu, 40 % d'une action à 5 %. Rendement attendu, en % ?", unite: "%", tol: .05, rep: function () { return 8; }, pieges: [{ v: 7.5, msg: "Vous avez fait la moyenne simple. Chaque rendement doit être pondéré par son poids." }], corr: "0,6 × 10 + 0,4 × 5 = 6 + 2 = 8 %." },
        { type: "nombre", q: "50 % dans A et 50 % dans B, chacun avec 20 % de volatilité. Corrélation nulle. Volatilité du portefeuille, en %, une décimale ?", unite: "%", tol: .1, rep: function () { return Math.round(Math.sqrt(.25 * .04 + .25 * .04) * 1000) / 10; },
          pieges: [{ v: 20, msg: "C'est le cas d'une corrélation de +1. Avec une corrélation nulle, les écarts se compensent en partie." }, { v: 10, msg: "Vous avez additionné les volatilités pondérées sans passer par les variances. On additionne les carrés, puis on prend la racine." }],
          corr: "σ² = 0,25 × 0,04 + 0,25 × 0,04 = 0,02. σ = √0,02 = 14,1 %." },
        { type: "qcm", transfert: true, q: "Vous détenez six banques de six pays de l'UEMOA. Êtes-vous bien diversifié ?", choix: ["Oui : six pays, six titres", "En partie : un même choc (taux, impayés) peut toucher tout le secteur", "Non, il faut au moins vingt titres"], bonne: 1,
          fb: ["Pas vraiment : des banques réagissent souvent aux mêmes causes ; leurs cours sont corrélés.", "Juste : la diversification par secteur compte autant que le nombre de titres.", "Non : le nombre seul ne suffit pas ; c'est la corrélation qui compte."] }
      ],
      pratique: { texte: "Dans « Secteurs divergents », construisez deux portefeuilles : l'un concentré, l'autre réparti sur trois secteurs. Comparez leur baisse maximale.", lien: "sc:secteurs" } },

    { id: "c8", partie: "C", titre: "Indices et comparaison à une référence", duree: "20 min",
      objectifs: ["Comprendre comment se calcule un indice pondéré", "Comparer une performance à une référence", "Éviter les comparaisons trompeuses"],
      sections: [
        { t: "Un indice résume un marché", p: ["Un indice boursier suit la valeur d'un panier de titres. Le BRVM Composite reprend l'ensemble des actions cotées, pondérées par leur capitalisation (cours × nombre d'actions) : une grande société pèse plus qu'une petite."], f: "Variation de l'indice = Σ poids × variation de chaque titre" },
        { t: "Se comparer à une référence", p: ["Un rendement seul ne dit pas grand-chose. +6 % est un bon résultat si le marché a fait +2 %, médiocre s'il a fait +15 %. On compare donc à une référence choisie à l'avance, dans la même devise, sur la même période, frais compris."] }
      ],
      retenir: ["Indice pondéré : les grosses capitalisations pèsent plus.", "Une performance se juge face à une référence fixée à l'avance.", "Même période, même devise, mêmes frais."],
      exos: [
        { type: "nombre", q: "Un indice contient deux sociétés : A pèse 600 milliards de capitalisation, B 400 milliards. A monte de 10 %, B baisse de 5 %. Variation de l'indice, en % ?", unite: "%", tol: .05, rep: function () { return 4; }, pieges: [{ v: 2.5, msg: "Vous avez fait la moyenne simple. Dans un indice pondéré, A compte pour 60 % et B pour 40 %." }], corr: "0,6 × 10 + 0,4 × (−5) = 6 − 2 = 4 %." },
        { type: "qcm", transfert: true, q: "Un conseiller affiche +25 % sur trois ans pour son fonds, sans référence. Que demander ?", choix: ["Rien, c'est un bon chiffre", "La performance de l'indice sur la même période, et les frais", "La performance de la meilleure année"], bonne: 1,
          fb: ["Non : sans référence, +25 % peut être un mauvais résultat.", "Juste : même période, frais déduits, et une référence connue avant.", "Non : choisir la meilleure année est justement une façon de tromper."] }
      ],
      pratique: { texte: "Dans votre bilan de fin de session, comparez votre résultat à celui d'un portefeuille réparti également entre toutes les entreprises.", lien: "sc:secteurs" } },

    /* ───────── D · Le marché en pratique ───────── */
    { id: "c9", partie: "D", titre: "Les ordres et le carnet d'ordres", duree: "35 min",
      objectifs: ["Lire un carnet d'ordres et une fourchette", "Calculer le prix moyen d'un ordre au marché", "Choisir entre ordre au marché, à cours limité et stop"],
      sections: [
        { t: "Le carnet d'ordres", p: ["À chaque instant, le marché affiche les meilleures offres d'achat (à gauche) et de vente (à droite), avec les quantités. L'écart entre le meilleur prix vendeur et le meilleur prix acheteur s'appelle la fourchette."], carnet: true },
        { t: "Trois types d'ordres", liste: [
          "Au marché : exécuté tout de suite, aux prix disponibles. Certitude d'exécution, pas de certitude de prix.",
          "À cours limité : vous fixez un prix maximum (achat) ou minimum (vente). Certitude de prix, pas de certitude d'exécution ; l'ordre peut attendre puis expirer.",
          "Stop : il se déclenche quand le cours atteint un seuil, souvent pour limiter une perte. Le prix final peut être moins bon que le seuil si le cours saute."] },
        { t: "La liquidité", p: ["Un titre est liquide quand on peut en acheter ou vendre beaucoup sans faire bouger le prix. Sur un titre peu échangé, un gros ordre au marché « mange » plusieurs niveaux du carnet et paie de plus en plus cher."] }
      ],
      retenir: ["Au marché : exécuté, prix incertain.", "Limité : prix maîtrisé, exécution incertaine.", "Stop : déclenché au seuil, prix final incertain."],
      exos: [
        { type: "nombre", q: "Carnet ci-dessus. Vous passez un ordre d'achat au marché de 300 titres. Coût total, hors frais, en FCFA ?", unite: "FCFA", tol: 0, rep: function () { return 200 * 5050 + 100 * 5100; },
          pieges: [{ v: 1515000, msg: "Vous avez tout acheté au meilleur prix vendeur (5 050). Il n'y a que 200 titres à ce prix : les 100 suivants se paient 5 100." }, { v: 1500000, msg: "Vous avez pris le prix acheteur (5 000). Pour acheter, on prend les offres des vendeurs." }],
          corr: "200 × 5 050 + 100 × 5 100 = 1 010 000 + 510 000 = 1 520 000 FCFA, soit 5 066,67 FCFA en moyenne par titre." },
        { type: "nombre", q: "Toujours ce carnet : quelle est la fourchette, en FCFA ?", unite: "FCFA", tol: 0, rep: function () { return 50; }, corr: "Meilleur vendeur 5 050 − meilleur acheteur 5 000 = 50 FCFA, soit 1 % du prix." },
        { type: "qcm", transfert: true, q: "Vous voulez acheter un titre peu échangé, sans payer plus de 5 000 FCFA. Quel ordre ?", choix: ["Au marché", "À cours limité à 5 000", "Stop à 5 000"], bonne: 1,
          fb: ["Risqué : sur un titre peu liquide, l'ordre au marché peut s'exécuter bien plus haut.", "Juste : vous ne paierez jamais plus de 5 000, quitte à ne pas être servi.", "Non : un stop achat se déclenche quand le cours monte jusqu'au seuil, il ne plafonne pas le prix."] }
      ],
      pratique: { texte: "Dans le marché libre, passez un ordre à cours limité sous le cours actuel, avancez de quelques séances et regardez s'il est exécuté ou s'il expire. Puis placez un stop sous votre prix d'achat.", lien: "li:libre-actions" } },

    { id: "c10", partie: "D", titre: "Le marché des changes", duree: "30 min",
      objectifs: ["Lire une paire de devises et un cours croisé", "Calculer le coût du spread", "Mesurer un risque de change pour un investisseur en FCFA"],
      sections: [
        { t: "Lire une cotation", p: ["EUR/USD = 1,1000 signifie qu'un euro vaut 1,10 dollar. EUR est la devise de base, USD la devise de cotation. On achète au cours vendeur (ask), on revend au cours acheteur (bid)."] },
        { t: "Le franc CFA", p: ["Le franc CFA de l'UEMOA a une parité fixe avec l'euro : 1 EUR = 655,957 FCFA. Face au dollar, il varie donc comme l'euro. On en déduit un cours croisé."], f: "USD/XOF = EUR/XOF ÷ EUR/USD", ex: "Avec EUR/USD à 1,10 : 655,957 ÷ 1,10 = 596,32 FCFA pour un dollar." },
        { t: "Le risque de change", p: ["Un investisseur en FCFA qui détient un actif en dollars gagne ou perd aussi sur la devise. Si l'actif monte de 5 % en dollars mais que le dollar baisse de 5 % face au FCFA, le gain en FCFA est presque nul."], f: "(1 + rendement en FCFA) = (1 + rendement en devise) × (1 + variation de la devise)" }
      ],
      retenir: ["Base / cotation : on achète la base.", "Le spread est un coût même sans variation.", "Un actif étranger porte deux risques : le sien et celui de la devise."],
      exos: [
        { type: "nombre", q: "EUR/USD = 1,10. Combien de FCFA vaut un dollar (deux décimales) ?", unite: "FCFA", tol: .01, rep: function () { return r2(655.957 / 1.1); },
          pieges: [{ v: 721.55, tol: .02, msg: "Vous avez multiplié par 1,10. Un dollar vaut moins qu'un euro : il faut diviser." }],
          corr: "655,957 ÷ 1,10 = 596,32 FCFA." },
        { type: "nombre", q: "Un investisseur en FCFA achète une action américaine. Elle monte de 10 % en dollars, mais le dollar baisse de 8 % face au FCFA. Rendement en FCFA, en %, une décimale ?", unite: "%", tol: .05, rep: function () { return r2((1.1 * .92 - 1) * 100); },
          pieges: [{ v: 2, msg: "Vous avez soustrait les pourcentages. Les effets se multiplient : 1,10 × 0,92." }],
          corr: "1,10 × 0,92 = 1,012, soit +1,2 % en FCFA." },
        { type: "nombre", transfert: true, q: "GBP/USD : bid 1,2700, ask 1,2703. Achat puis revente immédiate de 10 000 livres : perte en USD ?", unite: "USD", tol: .005, rep: function () { return 3; }, corr: "10 000 × 0,0003 = 3 USD. Le spread se paie à chaque aller-retour." }
      ],
      pratique: { texte: "Dans le scénario « Change défavorable », lisez bid, ask et spread avant chaque ordre.", lien: "sc:change" } },

    /* ───────── E · Aller plus loin ───────── */
    { id: "c11", partie: "E", titre: "Valoriser une action : dividendes et flux actualisés", duree: "30 min",
      objectifs: ["Appliquer le modèle de Gordon-Shapiro", "Comprendre la sensibilité d'une valeur à ses hypothèses", "Distinguer valeur estimée et prix de marché"],
      sections: [
        { t: "Une action vaut ce qu'elle rapportera", p: ["En théorie, une action vaut la valeur actuelle de tous les dividendes futurs. Si le dividende croît à un taux constant g, et que l'investisseur exige un rendement k, on obtient une formule simple."], f: "Valeur = D₁ ÷ (k − g)", ex: "Dividende attendu 500 FCFA, rendement exigé 10 %, croissance 4 % : 500 ÷ 0,06 = 8 333 FCFA." },
        { t: "Des hypothèses très sensibles", p: ["Si l'on suppose 5 % de croissance au lieu de 4 %, la valeur passe à 10 000 FCFA. Un petit changement d'hypothèse change beaucoup le résultat : une valorisation est une fourchette, pas un chiffre exact."] },
        { t: "Valeur et prix", p: ["Le prix est ce que le marché paie aujourd'hui. La valeur est votre estimation. Un écart entre les deux n'est une opportunité que si vos hypothèses sont meilleures que celles du marché, ce qui est rare."] }
      ],
      retenir: ["Valeur = D₁ ÷ (k − g), si g < k.", "Une valorisation dépend fortement de ses hypothèses.", "Prix et valeur ne se confondent pas."],
      exos: [
        { type: "nombre", q: "Dividende attendu l'an prochain : 600 FCFA. Rendement exigé : 12 %. Croissance perpétuelle : 4 %. Valeur de l'action, en FCFA ?", unite: "FCFA", tol: 1, rep: function () { return 7500; },
          pieges: [{ v: 5000, msg: "Vous avez divisé par 12 % sans retirer la croissance : c'est le cas d'un dividende qui ne croît jamais." }, { v: 3750, tol: 1, msg: "Vous avez divisé par 16 % (k + g). La formule soustrait la croissance : k − g." }],
          corr: "600 ÷ (0,12 − 0,04) = 600 ÷ 0,08 = 7 500 FCFA." },
        { type: "nombre", transfert: true, q: "Même action, mais la croissance retenue passe à 6 %. Nouvelle valeur, en FCFA ?", unite: "FCFA", tol: 1, rep: function () { return 10000; }, corr: "600 ÷ 0,06 = 10 000 FCFA : +33 % pour deux points de croissance en plus." }
      ],
      pratique: { texte: "Avant d'acheter dans un scénario, écrivez dans votre justification la valeur que vous estimez et pourquoi. Relisez-la dans « Mes décisions ».", lien: "sc:concentre" } },

    { id: "c12", partie: "E", titre: "Introduction aux produits dérivés", duree: "35 min",
      objectifs: ["Lire le profil de gain d'un contrat à terme", "Calculer le gain d'une option d'achat et de vente à l'échéance", "Comprendre pourquoi le levier amplifie les pertes"],
      sections: [
        { t: "Le contrat à terme", p: ["Deux parties s'engagent aujourd'hui sur un prix pour une transaction future. Un exportateur de cacao peut ainsi fixer le prix de sa récolte : il renonce à une hausse, mais se protège d'une baisse."] },
        { t: "Les options", p: ["Une option d'achat (call) donne le droit, pas l'obligation, d'acheter à un prix fixé (le prix d'exercice). Une option de vente (put) donne le droit de vendre. On paie une prime pour ce droit."], f: "Gain d'un call à l'échéance = max(Cours − Prix d'exercice, 0) − Prime" },
        { t: "Le levier", p: ["Avec une petite mise (la prime ou un dépôt de garantie), on s'expose à un montant bien plus grand. Les gains sont amplifiés, les pertes aussi : on peut perdre toute la prime, et sur certains produits plus que sa mise.", "Dans EFA Traders, ces produits sont étudiés en théorie seulement : aucune position à levier n'est possible."] }
      ],
      outil: "option",
      retenir: ["Un contrat à terme fixe un prix futur : il protège et prive à la fois.", "Une option est un droit qui se paie : la prime.", "Le levier amplifie les pertes autant que les gains."],
      exos: [
        { type: "nombre", q: "Call : prix d'exercice 5 000 FCFA, prime 200 FCFA. À l'échéance, l'action vaut 5 600 FCFA. Gain net par action ?", unite: "FCFA", tol: 0, rep: function () { return 400; }, pieges: [{ v: 600, msg: "Vous avez oublié la prime payée au départ." }], corr: "max(5 600 − 5 000, 0) − 200 = 600 − 200 = 400 FCFA." },
        { type: "nombre", q: "Même call, mais l'action finit à 4 700 FCFA. Gain net par action ?", unite: "FCFA", tol: 0, rep: function () { return -200; }, pieges: [{ v: -300, msg: "On n'exerce pas une option qui ne rapporte rien : la perte s'arrête à la prime." }], corr: "max(4 700 − 5 000, 0) − 200 = 0 − 200 = −200 FCFA. La perte est limitée à la prime." },
        { type: "nombre", transfert: true, q: "Put : prix d'exercice 5 000 FCFA, prime 150 FCFA. L'action finit à 4 600 FCFA. Gain net par action ?", unite: "FCFA", tol: 0, rep: function () { return 250; }, corr: "max(5 000 − 4 600, 0) − 150 = 400 − 150 = 250 FCFA." }
      ],
      pratique: { texte: "Faites varier le cours final dans l'outil de ce chapitre et repérez le point mort : le cours à partir duquel l'option devient gagnante.", lien: null } },

    { id: "c13", partie: "E", titre: "Finance comportementale : nos biais", duree: "20 min",
      objectifs: ["Reconnaître cinq biais fréquents", "Relire ses propres décisions pour les repérer", "Mettre en place des règles qui les limitent"],
      sections: [
        { t: "Cinq biais à connaître", liste: [
          "Aversion à la perte : une perte fait environ deux fois plus mal qu'un gain du même montant ne fait plaisir. On garde trop longtemps les titres perdants.",
          "Ancrage : on s'accroche à un prix de référence, souvent son prix d'achat, qui n'a aucun sens pour le marché.",
          "Excès de confiance : on surestime ce que l'on sait, et on passe trop d'ordres.",
          "Effet de troupeau : on achète parce que tout le monde achète, souvent après la hausse.",
          "Biais de confirmation : on ne retient que les informations qui donnent raison."] },
        { t: "Des règles plutôt que de la volonté", p: ["Les biais ne disparaissent pas en les connaissant. On les limite par des règles écrites à l'avance : part maximale par titre, raison écrite avant chaque ordre, relecture après coup. C'est le rôle du journal d'EFA Traders."] }
      ],
      retenir: ["Votre prix d'achat n'intéresse que vous.", "Écrivez votre raison avant l'ordre, relisez-la après.", "Une règle écrite résiste mieux qu'une bonne intention."],
      exos: [
        { type: "qcm", q: "« J'attends qu'elle remonte à mon prix d'achat pour vendre. » Quel biais ?", choix: ["Effet de troupeau", "Ancrage et aversion à la perte", "Excès de confiance"], bonne: 1,
          fb: ["Non : le troupeau, c'est suivre les autres.", "Juste : le prix d'achat sert d'ancre, et vendre à perte fait mal.", "Pas principalement : ici, c'est la référence au prix d'achat qui guide."] },
        { type: "qcm", q: "Une valeur a monté 15 séances de suite, tout le monde en parle, vous achetez. Quel biais guette ?", choix: ["Effet de troupeau", "Aversion à la perte"], bonne: 0,
          fb: ["Juste : acheter parce que les autres achètent, souvent tard.", "Non : il n'y a pas encore de perte ici."] },
        { type: "qcm", transfert: true, q: "Quelle règle limite le mieux l'excès de confiance ?", choix: ["Passer plus d'ordres pour apprendre plus vite", "Écrire avant chaque ordre ce que l'on sait vraiment et ce que l'on suppose", "Suivre son intuition"], bonne: 1,
          fb: ["Non : multiplier les ordres augmente surtout les frais.", "Juste : séparer le connu du supposé oblige à mesurer sa certitude.", "Non : c'est justement l'intuition qui surestime."] }
      ],
      pratique: { texte: "Rejouez « Hausse puis retournement » et, dans « Mes décisions », repérez quel biais a guidé chacun de vos ordres.", lien: "sc:retournement" } },

    { id: "c14", partie: "E", titre: "Règles, éthique et arnaques", duree: "20 min",
      objectifs: ["Connaître les abus de marché interdits", "Reconnaître les signaux d'une arnaque à l'investissement", "Savoir vérifier un intermédiaire"],
      sections: [
        { t: "Les abus de marché", liste: [
          "Délit d'initié : utiliser une information non publique pour acheter ou vendre.",
          "Manipulation de cours : faire monter ou baisser artificiellement un prix (achats concertés, fausses rumeurs).",
          "Diffusion de fausses informations pour influencer le marché."] },
        { t: "Les signaux d'arnaque", liste: [
          "Un rendement élevé « garanti » ou « sans risque ».",
          "Une urgence : « il ne reste que quelques places ».",
          "Des gains payés par l'argent des nouveaux entrants (schéma de Ponzi).",
          "Un intermédiaire qui n'est pas agréé, ou un paiement sur un compte personnel.",
          "Des « comptes de trading » avec un fort effet de levier proposés sur les réseaux sociaux."] },
        { t: "Vérifier avant de verser", p: ["Demandez le nom exact de la société et vérifiez son agrément auprès du régulateur (l'AMF-UMOA pour les SGI et les OPCVM de l'Union). Aucun intermédiaire sérieux ne promet un rendement garanti sur des actions."] }
      ],
      retenir: ["Rendement garanti + urgence = alerte.", "Vérifiez l'agrément avant tout versement.", "Une information privilégiée ne s'utilise pas."],
      exos: [
        { type: "qcm", q: "On vous propose 10 % par mois, garantis, si vous recrutez deux personnes. C'est…", choix: ["Un placement à haut rendement", "Un schéma pyramidal : les gains viennent des nouveaux entrants", "Une tontine moderne"], bonne: 1,
          fb: ["Non : aucun placement réel ne garantit 10 % par mois.", "Juste : il s'effondre dès que les entrées ralentissent.", "Non : une tontine ne promet pas de rendement et ne dépend pas du recrutement."] },
        { type: "qcm", q: "Un ami qui travaille chez Ciments Bakar vous dit, avant l'annonce, qu'un gros contrat va être signé. Vous achetez. C'est…", choix: ["Une bonne recherche d'information", "Un délit d'initié", "Autorisé si le montant est petit"], bonne: 1,
          fb: ["Non : l'information n'est pas publique.", "Juste : utiliser une information privilégiée est interdit, quel que soit le montant.", "Non : le montant ne change rien."] },
        { type: "qcm", transfert: true, q: "Première chose à faire avant de confier de l'argent à un intermédiaire ?", choix: ["Lire les avis sur les réseaux sociaux", "Vérifier son agrément auprès du régulateur", "Demander les gains d'un ami"], bonne: 1,
          fb: ["Insuffisant : les avis se fabriquent.", "Juste : c'est la seule vérification qui compte en premier.", "Non : un gain passé ne prouve rien, surtout dans un schéma pyramidal."] }
      ],
      pratique: { texte: "Relisez le glossaire d'EFA Traders : « Effet de levier » et « Vente à découvert » y sont décrits, et désactivés dans le simulateur.", lien: null } }
  ];

  /* Carnet d'ordres de l'exemple (chapitre 9) */
  var CARNET = { achat: [[5000, 150], [4950, 400], [4900, 600]], vente: [[5050, 200], [5100, 300], [5150, 500]] };

  var API = { PARTIES: PARTIES, CHAPITRES: CH, CARNET: CARNET, prixOblig: prixOblig, vf: vf };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else racine.EFA_TR_COURS = API;
})(this);
