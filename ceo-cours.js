/* EFA CEO Challenge · La méthode du cas (niveau licence et master, préparation aux entretiens de cabinets de conseil)
   11 chapitres en 3 parties. Même structure que les cours EFA : objectifs, notions, formules, exemples chiffrés,
   « À retenir », exercices corrigés (une explication par erreur fréquente), un cas de transfert, puis un cas.
   Chiffres d'exercice : ordres de grandeur arrondis, à ne pas citer comme statistiques. */
(function (racine) {
  "use strict";
  var PARTIES = [
    { id: "A", titre: "La méthode", sous: "Clarifier, structurer, calculer, conclure" },
    { id: "B", titre: "Les grands types de cas", sous: "Rentabilité, marché, prix, rachat, opérations" },
    { id: "C", titre: "Le terrain africain", sous: "Ce qui change dans l'UEMOA et la CEMAC" }
  ];
  var CH = [
    { id: "m1", partie: "A", titre: "Ce qu'est une étude de cas", duree: "20 min",
      objectifs: ["Connaître le déroulé d'un cas en entretien", "Savoir ce que l'évaluateur observe", "Éviter les erreurs de départ"],
      sections: [
        { t: "Un problème d'entreprise, en 25 minutes", p: ["Un dirigeant fictif a un problème : ses profits baissent, il hésite à entrer sur un marché, il veut racheter un concurrent. Vous jouez le consultant. On n'attend pas « la » bonne réponse, mais une démarche claire et des chiffres justes."] },
        { t: "Le déroulé en quatre temps", liste: [
          "Clarifier : reformuler la question, demander l'objectif et les contraintes (horizon, montant, critère de succès).",
          "Structurer : annoncer comment vous allez découper le problème, en branches qui ne se recoupent pas.",
          "Analyser : demander les données, calculer à voix haute, tirer une conclusion de chaque chiffre.",
          "Recommander : une réponse d'abord, deux ou trois raisons, les risques, la prochaine étape."] },
        { t: "Ce que l'on évalue", liste: ["La structure : votre découpage couvre-t-il tout, sans doublon ?", "Le calcul : exact, rapide, avec les bonnes unités.", "Le jugement : que veut dire ce chiffre pour la décision ?", "La communication : réponse d'abord, phrases courtes."] }
      ],
      retenir: ["Clarifier avant de structurer.", "Chaque chiffre doit servir une conclusion.", "Recommander, c'est répondre à la question posée."],
      exos: [
        { type: "qcm", q: "Le recruteur annonce : « Notre client, un brasseur, voit ses profits baisser. » Que faites-vous d'abord ?", choix: ["Je donne trois causes possibles", "Je reformule et demande l'objectif, la période et l'ampleur de la baisse", "Je propose de baisser les coûts"], bonne: 1,
          fb: ["Trop tôt : vous ne savez pas encore de quoi on parle.", "Juste : clarifier évite de résoudre le mauvais problème.", "Non : c'est une solution avant le diagnostic."] },
        { type: "qcm", transfert: true, q: "À la fin, vous n'avez pas le temps de tout analyser. Que dites-vous ?", choix: ["« Je ne peux pas conclure »", "Une recommandation sur ce que vous savez, en nommant ce qu'il faudrait vérifier ensuite", "Je résume tout ce que j'ai fait"], bonne: 1,
          fb: ["Un dirigeant attend une position, même provisoire.", "Juste : réponse, raisons, risques, prochaine étape.", "Un récit n'est pas une recommandation."] }
      ],
      pratique: { texte: "Commencez par le cas « Kalao Money : les profits s'effondrent ».", lien: "cas:money" } },

    { id: "m2", partie: "A", titre: "Structurer : arbres et découpages MECE", duree: "30 min",
      objectifs: ["Construire un arbre de problème", "Vérifier qu'un découpage est MECE", "Partir d'une hypothèse"],
      sections: [
        { t: "MECE", p: ["Mutuellement exclusif, collectivement exhaustif : chaque élément tombe dans une branche et une seule, et l'ensemble couvre tout. « Prix × volume » est MECE pour un chiffre d'affaires. « Clients, concurrents, marketing » ne l'est pas : le marketing touche les clients."] },
        { t: "L'arbre de problème", p: ["On part de la question, on la découpe en deux à quatre branches, puis chaque branche en sous-branches mesurables. Une bonne branche se mesure avec une donnée que l'on peut demander."], ex: "Profit = Chiffre d'affaires − Coûts. Chiffre d'affaires = Volume × Prix. Coûts = Coûts fixes + Coût variable × Volume." },
        { t: "Partir d'une hypothèse", p: ["Annoncez la piste que vous testez en premier, avec sa raison : « Le marché a baissé ses prix, je pense que notre prix moyen a chuté ; je commence par là. » Si les données vous contredisent, changez de branche."] }
      ],
      retenir: ["MECE : pas de doublon, pas d'oubli.", "Chaque branche doit pouvoir se mesurer.", "Une hypothèse oriente l'analyse, les données la tranchent."],
      exos: [
        { type: "qcm", q: "Les ventes d'un distributeur baissent. Quel découpage est MECE ?", choix: ["Clients, concurrents, prix, marketing", "Nombre de clients × panier moyen", "Abidjan, Bouaké, nouveaux produits"], bonne: 1,
          fb: ["Non : ces branches se recoupent (le prix touche les clients et les concurrents).", "Juste : tout le chiffre d'affaires y passe, sans doublon.", "Non : les nouveaux produits sont aussi vendus à Abidjan et Bouaké."] },
        { type: "qcm", q: "Panier moyen = nombre d'articles × … ?", choix: ["prix moyen par article", "marge", "fréquence de visite"], bonne: 0, fb: ["Juste.", "Non : la marge est un autre calcul.", "Non : la fréquence multiplie le nombre de visites, pas le panier."] },
        { type: "qcm", transfert: true, q: "Une commune veut réduire les embouteillages. Quel premier découpage tient ?", choix: ["Voitures, motos, taxis, bus", "Demande de déplacements (combien, quand) × capacité du réseau (routes, carrefours, transports collectifs)", "Police, mairie, État"], bonne: 1,
          fb: ["Possible mais partiel : il oublie la capacité.", "Juste : l'embouteillage naît d'un écart entre demande et capacité.", "C'est un découpage par acteurs, pas par causes."] }
      ],
      pratique: { texte: "Dans chaque cas, la première étape vous demande votre structure, puis montre la structure modèle.", lien: "cas:money" } },

    { id: "m3", partie: "B", titre: "Le cas de rentabilité", duree: "30 min",
      objectifs: ["Appliquer l'arbre du profit", "Isoler la cause d'une baisse", "Proposer des leviers chiffrés"],
      sections: [
        { t: "L'équation", f: "Profit = Volume × (Prix − Coût variable unitaire) − Coûts fixes", p: ["On compare deux périodes, branche par branche, pour trouver ce qui a bougé. Un volume en hausse peut cacher un prix en chute."] },
        { t: "Méthode", liste: ["Revenus : volume (nombre de clients × achats par client) et prix (prix catalogue, remises, mix de produits).", "Coûts : variables (matières, commissions) et fixes (personnel, loyers, amortissements).", "Trouver la branche qui explique l'essentiel de l'écart, puis demander pourquoi."] }
      ],
      retenir: ["Comparez les branches, pas seulement le total.", "Mix et remises cachent souvent la baisse de prix.", "Un levier se chiffre."],
      exos: [
        { type: "nombre", q: "Volume 2 millions d'unités, prix 500 FCFA, coût variable 350 FCFA, coûts fixes 200 M FCFA. Profit, en millions de FCFA ?", unite: "M FCFA", tol: 0, rep: function () { return (2e6 * (500 - 350) - 200e6) / 1e6; },
          pieges: [{ v: 1000, msg: "C'est le chiffre d'affaires. Il faut retirer les coûts variables et fixes." }, { v: 300, msg: "C'est la marge sur coûts variables. Il reste à retirer les 200 M de coûts fixes." }], corr: "2 000 000 × 150 = 300 M de marge ; − 200 M = 100 M." },
        { type: "nombre", q: "Le prix baisse de 5 %, le reste ne change pas. Nouveau profit, en M FCFA ?", unite: "M FCFA", tol: 0, rep: function () { return (2e6 * (475 - 350) - 200e6) / 1e6; },
          pieges: [{ v: 95, msg: "Vous avez baissé le profit de 5 %. Or toute la baisse de prix se retrouve dans la marge : 25 FCFA par unité." }], corr: "Marge unitaire 125 ; 2 000 000 × 125 = 250 M ; − 200 = 50 M. Une baisse de prix de 5 % divise le profit par deux." },
        { type: "qcm", transfert: true, q: "Pour retrouver 100 M de profit sans toucher au prix, de combien faut-il augmenter le volume ?", choix: ["De 5 %", "De 20 %, soit 400 000 unités", "De 50 %"], bonne: 1, fb: ["Trop peu : il manque 50 M, et chaque unité rapporte 125.", "Juste : 50 M ÷ 125 = 400 000 unités, soit 20 %.", "Trop."] }
      ],
      outil: "profit",
      pratique: { texte: "Le cas « Kalao Money » est un cas de rentabilité : les clients augmentent, le profit chute.", lien: "cas:money" } },

    { id: "m4", partie: "B", titre: "Estimer la taille d'un marché", duree: "30 min",
      objectifs: ["Construire une estimation descendante ou ascendante", "Choisir des hypothèses défendables", "Vérifier l'ordre de grandeur"],
      sections: [
        { t: "Descendante ou ascendante", p: ["Descendante : on part de la population et on applique des proportions. Ascendante : on part d'une unité (un point de vente, un véhicule) et on multiplie. Faire les deux et comparer est le meilleur contrôle."] },
        { t: "Annoncer chaque hypothèse", p: ["Arrondissez, dites d'où vient le chiffre (« un ménage de cinq personnes, c'est un ordre de grandeur courant en ville »), et notez ce qui ferait changer l'estimation."], ex: "Pain à Abidjan (hypothèses) : 6 millions d'habitants ÷ 5 = 1,2 million de ménages ; 40 % achètent 2 baguettes par jour : 960 000 baguettes par jour." },
        { t: "Contrôler", p: ["Rapportez le résultat à quelque chose de connu : par habitant, par point de vente, en part du PIB. Un marché du pain plus grand que celui du riz doit vous alerter."] }
      ],
      outil: "sizing",
      retenir: ["Une estimation = une chaîne d'hypothèses annoncées.", "Arrondir pour calculer vite, sans changer l'ordre de grandeur.", "Toujours contrôler par une deuxième voie."],
      exos: [
        { type: "nombre", q: "Avec les hypothèses de l'exemple, combien de baguettes par jour ?", unite: "baguettes", tol: 0, rep: function () { return 6e6 / 5 * .4 * 2; }, pieges: [{ v: 4800000, msg: "Vous avez appliqué les 40 % à la population, pas aux ménages. On achète le pain par ménage." }], corr: "6 000 000 ÷ 5 × 0,4 × 2 = 960 000 baguettes par jour." },
        { type: "nombre", q: "À 150 FCFA la baguette et 360 jours, valeur annuelle du marché, en milliards de FCFA (une décimale) ?", unite: "Md FCFA", tol: .1, rep: function () { return Math.round(960000 * 150 * 360 / 1e8) / 10; }, corr: "960 000 × 150 = 144 M par jour ; × 360 = 51,8 milliards de FCFA par an." },
        { type: "qcm", transfert: true, q: "Comment vérifier cette estimation par une autre voie ?", choix: ["Refaire le même calcul", "Estimer le nombre de boulangeries et leur production quotidienne", "Demander au recruteur"], bonne: 1, fb: ["Ce n'est pas un contrôle.", "Juste : une estimation ascendante, par l'offre.", "On peut, mais il attend votre démarche."] }
      ],
      pratique: { texte: "Le cas « Motos électriques à Cotonou » commence par une estimation du parc de motos-taxis.", lien: "cas:motos" } },

    { id: "m5", partie: "B", titre: "Entrer sur un nouveau marché", duree: "30 min",
      objectifs: ["Structurer une décision d'entrée", "Comparer les modes d'entrée", "Calculer un délai de récupération simple"],
      sections: [
        { t: "Cinq questions", liste: ["Le marché : taille, croissance, rentabilité.", "La concurrence : qui est en place, avec quelle part et quels atouts (marque, distribution, coûts).", "Nos capacités : qu'avons-nous qui donne un avantage là-bas ?", "Le mode d'entrée : export, partenariat ou licence, acquisition, création.", "L'économie : investissement, profits attendus, délai de récupération, risques."] },
        { t: "Les modes d'entrée", p: ["L'export coûte peu mais se heurte aux droits de douane et à la logistique. La licence ou le partenariat partagent les profits mais vont vite. L'acquisition achète une part de marché et un réseau, au prix fort. La création (greenfield) laisse tout maîtriser, mais prend du temps."], f: "Délai de récupération ≈ Investissement ÷ Profit annuel" }
      ],
      retenir: ["Marché, concurrence, capacités, mode, économie.", "Le mode d'entrée est un arbitrage vitesse, contrôle, risque.", "Face à un leader installé, le réseau de distribution est souvent la vraie barrière."],
      exos: [
        { type: "nombre", q: "Une usine coûte 6 milliards et dégagerait 1,5 milliard de profit par an. Délai de récupération simple, en années ?", unite: "ans", tol: 0, rep: function () { return 4; }, corr: "6 ÷ 1,5 = 4 ans." },
        { type: "qcm", transfert: true, q: "Le leader local détient 70 % du marché et tout le réseau de distribution. Quel mode d'entrée examiner en premier ?", choix: ["Créer une usine et un réseau", "Un partenariat avec un distributeur ou l'acquisition d'un acteur secondaire", "L'export à bas prix"], bonne: 1, fb: ["Long et risqué face à un réseau déjà verrouillé.", "Juste : on achète ou on loue l'accès au client.", "Le leader peut répondre par les prix, et la logistique pèse."] }
      ],
      pratique: { texte: "Le cas « Brasserie du Golfe au Cameroun » applique ce découpage.", lien: "cas:brasserie" } },

    { id: "m6", partie: "B", titre: "Prix, élasticité et concurrence", duree: "30 min",
      objectifs: ["Utiliser une élasticité-prix", "Mesurer l'effet d'une baisse de prix sur le profit", "Choisir une réponse à un concurrent agressif"],
      sections: [
        { t: "L'élasticité", f: "Variation du volume (%) ≈ Élasticité × Variation du prix (%)", p: ["Une élasticité de −1,5 signifie qu'une baisse de prix de 10 % augmente le volume d'environ 15 %. Le chiffre d'affaires peut monter alors que le profit baisse, si la marge unitaire fond."] },
        { t: "Répondre à un concurrent moins cher", liste: ["Aligner le prix : rapide, coûteux.", "Se différencier : qualité, service, délais, crédit aux revendeurs.", "Baisser ses coûts pour pouvoir baisser le prix.", "Segmenter : garder le prix sur les clients fidèles, une offre dédiée pour les autres."] }
      ],
      outil: "elasticite",
      retenir: ["Regardez le profit, pas le chiffre d'affaires.", "Une baisse de prix doit être compensée par beaucoup plus de volume.", "Face à un prix bas, la différenciation et les coûts sont des leviers."],
      exos: [
        { type: "nombre", q: "Prix 1 000, coût variable 700, volume 100 000. Élasticité −1,5. Le prix baisse de 10 %. Nouveau profit sur coûts variables, en M FCFA ?", unite: "M FCFA", tol: 0, rep: function () { return 115000 * 200 / 1e6; },
          pieges: [{ v: 30, msg: "C'est le profit avant la baisse." }, { v: 20, msg: "Vous avez oublié la hausse du volume : +15 %." }], corr: "Volume 115 000 ; marge unitaire 200 ; profit 23 M, contre 30 M avant. Le chiffre d'affaires monte (103,5 M contre 100), le profit baisse." },
        { type: "qcm", transfert: true, q: "Un importateur vend 12 % moins cher. Vos clients sont des quincailliers qui achètent à crédit chez vous. Quel levier ?", choix: ["S'aligner tout de suite", "Valoriser ce que l'importateur n'offre pas : crédit, livraison, disponibilité, puis cibler une baisse de prix", "Ne rien faire"], bonne: 1, fb: ["Cela détruit la marge sans tester d'autre levier.", "Juste : le service a une valeur pour un revendeur.", "Risque de perdre les clients sensibles au prix."] }
      ],
      pratique: { texte: "Le cas « Ciments Wouri face aux importations » vous fait chercher la réponse qui limite la casse.", lien: "cas:ciment" } },

    { id: "m7", partie: "B", titre: "Fusions et acquisitions", duree: "30 min",
      objectifs: ["Valoriser une cible et ses synergies", "Savoir à qui reviennent les synergies", "Lister les risques d'intégration"],
      sections: [
        { t: "Trois valeurs", liste: ["La valeur de la cible seule.", "La valeur des synergies : économies de coûts et revenus supplémentaires, moins le coût d'intégration.", "Le prix payé. Si le prix dépasse la valeur seule, l'acheteur donne une partie des synergies au vendeur."], f: "Valeur des synergies ≈ Synergies annuelles ÷ Taux − Coût d'intégration" },
        { t: "Les risques", p: ["Les synergies de coûts se réalisent mieux que celles de revenus. Les échecs viennent souvent de l'intégration : systèmes informatiques, cultures, départ des meilleurs agents, clients qui partent pendant la transition."] }
      ],
      retenir: ["Prix maximal = valeur seule + synergies nettes.", "Payer toutes les synergies, c'est ne rien gagner.", "Les synergies de revenus sont les plus incertaines."],
      exos: [
        { type: "nombre", q: "Synergies de coûts 300 M par an, taux 12 %, coût d'intégration 400 M. Valeur nette des synergies, en M ?", unite: "M FCFA", tol: 0, rep: function () { return 300 / .12 - 400; }, pieges: [{ v: 2500, msg: "Vous avez oublié le coût d'intégration." }], corr: "300 ÷ 0,12 = 2 500 ; − 400 = 2 100 M." },
        { type: "qcm", transfert: true, q: "Les synergies affichées sont pour moitié des revenus « de ventes croisées ». Que faire dans votre offre ?", choix: ["Les payer entièrement", "Payer surtout les synergies de coûts, conditionner le reste (complément de prix) aux résultats", "Les ignorer"], bonne: 1, fb: ["Risqué : elles sont les moins sûres.", "Juste : un complément de prix lié aux résultats partage le risque.", "Trop prudent : elles ont une valeur probable."] }
      ],
      pratique: { texte: "Le cas « Banque Nyota rachète une microfinance » vous fait fixer un prix d'offre.", lien: "cas:microfinance" } },

    { id: "m8", partie: "B", titre: "Opérations et chaîne de valeur", duree: "25 min",
      objectifs: ["Trouver un goulot d'étranglement", "Chiffrer une perte opérationnelle", "Classer des options par gain et délai"],
      sections: [
        { t: "Le goulot", p: ["Une chaîne va au rythme de son étape la plus lente. Améliorer une autre étape ne sert à rien tant que le goulot n'est pas traité."], ex: "Trois machines à 120, 90 et 150 unités par heure : la ligne produit 90 par heure." },
        { t: "Chiffrer avant de choisir", p: ["Mettez une valeur sur la perte (tonnes perdues × prix), puis comparez les options par gain annuel, investissement, délai de récupération et facilité de mise en œuvre. Commencez souvent par le gain rapide."] }
      ],
      retenir: ["Le goulot fixe le rythme.", "Une perte se chiffre en tonnes × prix.", "Gain rapide d'abord, gros investissement ensuite."],
      exos: [
        { type: "nombre", q: "Machines à 120, 90 et 150 unités/heure, 8 heures par jour. Production journalière ?", unite: "unités", tol: 0, rep: function () { return 720; }, pieges: [{ v: 960, msg: "Vous avez pris la machine de 120. C'est la plus lente qui fixe le rythme." }, { v: 2880, msg: "Les machines sont en série : on ne les additionne pas." }], corr: "La plus lente : 90 × 8 = 720 unités." },
        { type: "nombre", transfert: true, q: "10 000 tonnes récoltées, 30 % perdues avant la vente, prix 200 FCFA le kilo. Valeur perdue chaque année, en M FCFA ?", unite: "M FCFA", tol: 0, rep: function () { return 10000 * .3 * 200 * 1000 / 1e6; }, pieges: [{ v: .6, tol: .01, msg: "Attention aux unités : une tonne = 1 000 kg." }], corr: "3 000 t × 1 000 kg × 200 FCFA = 600 M FCFA." }
      ],
      pratique: { texte: "Le cas « Vergers de Sikasso : les mangues perdues » vous fait classer trois solutions.", lien: "cas:mangues" } },

    { id: "m9", partie: "C", titre: "Ce qui change en Afrique de l'Ouest et du Centre", duree: "25 min",
      objectifs: ["Intégrer l'informel et le mobile money dans un raisonnement", "Tenir compte des zones monétaires et des règles régionales", "Penser distribution et infrastructures"],
      sections: [
        { t: "Le marché tel qu'il est", liste: [
          "L'économie informelle pèse lourd : une partie des ventes et des concurrents n'apparaît dans aucune statistique.",
          "Le mobile money sert à payer, épargner et parfois emprunter : c'est un canal de distribution et une source de données.",
          "La saisonnalité (récoltes, fêtes, rentrée) fait varier fortement les revenus des ménages.",
          "La distribution passe par des milliers de petits points de vente : boutiques de quartier, marchés, revendeurs."] },
        { t: "Les règles régionales", liste: [
          "Deux zones monétaires : le franc CFA de l'UEMOA (XOF, BCEAO) et celui de la CEMAC (XAF, BEAC), tous deux à 655,957 pour un euro, mais non interchangeables.",
          "Des règles communes par zone : marchés financiers régionaux, droit des affaires OHADA, assurance (CIMA).",
          "Des droits de douane et des normes qui changent selon que l'on vend dans sa zone ou en dehors."] },
        { t: "Les infrastructures", p: ["Électricité, routes, ports et connectivité pèsent sur les coûts. Une solution excellente sur le papier échoue si la chaîne du froid ou la route ne suit pas."] }
      ],
      retenir: ["Pensez informel, mobile money, saisonnalité.", "UEMOA et CEMAC : même parité avec l'euro, deux zones distinctes.", "La distribution et l'énergie font souvent la différence."],
      exos: [
        { type: "qcm", q: "Une entreprise d'Abidjan veut vendre au Gabon. Quelle affirmation est juste ?", choix: ["Même monnaie, aucun change à prévoir", "Le Gabon est en CEMAC (XAF) : même parité avec l'euro, mais une autre zone monétaire et douanière", "Il faut passer par le dollar"], bonne: 1, fb: ["Non : XOF et XAF ne s'échangent pas directement comme une seule monnaie.", "Juste.", "Non."] },
        { type: "qcm", transfert: true, q: "Un fabricant veut vendre des lampes solaires en zone rurale. Quel canal examiner en premier ?", choix: ["Les supermarchés", "Les boutiques de village et le paiement par mobile money en plusieurs fois", "Un site internet"], bonne: 1, fb: ["Peu présents en zone rurale.", "Juste : proximité et paiement fractionné.", "Utile ensuite, pas pour toucher le client rural."] }
      ],
      pratique: { texte: "Le cas « Motos électriques à Cotonou » demande de penser énergie, chauffeurs et flottes.", lien: "cas:motos" } },

    { id: "m10", partie: "A", titre: "Calculer vite et lire un graphique", duree: "20 min",
      objectifs: ["Calculer pourcentages et croissances de tête", "Manier les grands nombres en FCFA", "Tirer une conclusion d'un graphique"],
      sections: [
        { t: "Les réflexes", liste: ["10 % de 2,4 milliards = 240 millions ; 15 % = 240 + 120 = 360 millions.", "Croissance annuelle moyenne : la règle de 72 (72 ÷ taux = années pour doubler).", "Écrire les zéros : 1 milliard = 1 000 millions.", "Arrondir pour calculer, dire l'arrondi, revenir au chiffre exact si nécessaire."] },
        { t: "Lire un graphique", p: ["Regardez d'abord le titre, les unités et l'échelle. Puis dites la conclusion en une phrase : « Les ventes progressent, mais les marges reculent depuis deux ans. »"] }
      ],
      retenir: ["Annoncez vos arrondis.", "Les unités avant le calcul.", "Un graphique se résume par sa conclusion."],
      exos: [
        { type: "nombre", q: "15 % de 2,4 milliards de FCFA, en millions ?", unite: "M FCFA", tol: 0, rep: function () { return 360; }, corr: "240 + 120 = 360 M." },
        { type: "nombre", q: "1,2 milliard ÷ 48 millions = ?", unite: "", tol: 0, rep: function () { return 25; }, pieges: [{ v: 2.5, tol: .01, msg: "Attention aux zéros : 1 200 M ÷ 48 M = 25." }], corr: "1 200 ÷ 48 = 25." },
        { type: "nombre", transfert: true, q: "Un marché croît de 12 % par an. En combien d'années double-t-il environ ?", unite: "ans", tol: 0, rep: function () { return 6; }, corr: "72 ÷ 12 = 6 ans." }
      ],
      pratique: { texte: "Tous les cas demandent ces calculs ; faites-les sans calculatrice.", lien: null } },

    { id: "m11", partie: "A", titre: "Synthétiser et recommander", duree: "20 min",
      objectifs: ["Construire une recommandation en pyramide", "Hiérarchiser raisons, risques et prochaines étapes", "Parler à un dirigeant"],
      sections: [
        { t: "La pyramide", p: ["Commencez par la réponse. Puis deux ou trois raisons, chacune appuyée par un chiffre. Puis les risques et la façon de les réduire. Enfin la prochaine étape concrète."], ex: "« Je recommande d'entrer au Cameroun par un partenariat avec un embouteilleur local. Trois raisons : le marché vaut 224 milliards, le leader verrouille la distribution, et le partenariat évite 25 milliards d'investissement. Risque : la dépendance au partenaire, à encadrer par contrat. Prochaine étape : rencontrer deux embouteilleurs d'ici un mois. »" },
        { t: "Ce qu'on évite", liste: ["Raconter son analyse dans l'ordre chronologique.", "Recommander deux choses à la fois sans trancher.", "Oublier le chiffre qui fonde la décision."] }
      ],
      retenir: ["La réponse d'abord.", "Trois raisons au plus, chacune chiffrée.", "Risques et prochaine étape font partie de la réponse."],
      exos: [
        { type: "qcm", q: "Quelle ouverture est la meilleure ?", choix: ["« Nous avons d'abord regardé le marché, puis la concurrence… »", "« Je recommande de ne pas lancer le produit cette année, pour trois raisons. »", "« C'est un cas complexe. »"], bonne: 1, fb: ["C'est un récit, pas une réponse.", "Juste : la réponse, puis l'annonce de la structure.", "Cela n'apporte rien au dirigeant."] },
        { type: "qcm", transfert: true, q: "Votre analyse montre un projet rentable mais risqué. Que recommander ?", choix: ["« C'est rentable mais risqué, à vous de voir »", "Lancer en pilote limité, avec un critère chiffré pour décider de la suite", "Ne rien faire"], bonne: 1, fb: ["Le dirigeant attend une position.", "Juste : une décision qui réduit le risque, avec un critère.", "Trop prudent sans raison chiffrée."] }
      ],
      pratique: { texte: "Chaque cas se termine par votre recommandation et votre phrase de synthèse.", lien: "cas:brasserie" } }
  ];
  /* ordre de lecture : méthode (m1, m2, m10, m11), puis types de cas, puis terrain */
  var ORDRE = ["m1", "m2", "m10", "m11", "m3", "m4", "m5", "m6", "m7", "m8", "m9"];
  CH.sort(function (a, b) { return ORDRE.indexOf(a.id) - ORDRE.indexOf(b.id); });
  var API = { PARTIES: PARTIES, CHAPITRES: CH };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else racine.EFA_CEO_COURS = API;
})(this);
