/* La bibliothèque EFA : les fiches de lecture, au format statut.
   Chaque fiche : le livre en une phrase, 5 idées reformulées, ce qui marche ici, ce qui ne marche pas tel quel,
   ce qu'EFA en retient et nuance, une décision, un quiz de 3 questions, le module de l'école qui va avec.
   Rédigées par EFA avec l'aide de l'intelligence artificielle et vérifiées par l'équipe : idées reformulées, jamais le texte des livres.
   Quiz : [question, [3 réponses], indice de la bonne réponse, explication]. */
window.EFA_LIVRES = [
  {
    id: "babylone", n: 1, titre: "L’Homme le plus riche de Babylone", auteur: "George S. Clason", annee: 1926, theme: "Épargner", c1: "#1B2B4A", c2: "#B8860B",
    accroche: "Une pièce sur dix, pour vous d’abord.",
    phrase: "Gardez une part de tout ce que vous gagnez, <em>avant</em> tout le reste.",
    phraseSuite: "Puis faites travailler cette part, prudemment. Le livre le raconte en paraboles : Arkad, un scribe devenu l’homme le plus riche de Babylone, explique à ses amis comment il y est arrivé.",
    idees: [
      ["Une pièce sur dix est pour vous.", "Sur chaque somme reçue, mettez de côté au moins un dixième, <b>le jour même</b>. Pas ce qui reste à la fin du mois : ce qu’on garde en premier.", ["Salaire de Koffi", "250 000 F", "Gardé le jour de la paie", "25 000 F", "En un an", "300 000 F"]],
      ["Nos « besoins » grandissent avec nos revenus.", "Gagner plus ne suffit pas : les dépenses suivent. Le livre invite à distinguer ce qui est nécessaire de ce qui fait seulement envie, et à vivre avec les neuf dixièmes."],
      ["L’argent gardé doit travailler.", "Une somme qui dort ne grandit pas. Placée, elle rapporte, et ce qu’elle rapporte rapporte à son tour. C’est la spirale : <b>l’argent qui reste, et qui grandit.</b>"],
      ["Protégez d’abord ce que vous avez gardé.", "Jeune, Arkad confie ses premières économies à un fabricant de briques parti acheter des bijoux : il revient avec du verre. La leçon : <b>ne placez pas là où vous ne comprenez pas</b>."],
      ["Augmentez votre capacité à gagner.", "Apprendre, se perfectionner, devenir meilleur dans son métier : le revenu suit souvent les compétences. Le livre conseille aussi de se loger sans se ruiner et de préparer ses vieux jours."]
    ],
    marche: [["Garder le jour de la paie.", "Une poche à part (un compte, une enveloppe, un second portefeuille mobile) où le dixième part tout de suite."], ["La discipline de la tontine.", "Une cotisation fixe, à date fixe : c’est déjà « une pièce sur dix », tenue par le groupe."], ["Se méfier des placements miracles.", "La leçon des faux bijoux vaut pour les promesses de gains rapides qui circulent sur les réseaux."]],
    pasIci: [["Les revenus irréguliers.", "Le livre suppose une paie régulière. Commerçant ou indépendant : calculez votre dixième sur le mois faible."], ["La famille.", "Le livre ignore les demandes des proches. Ici, elles se budgètent, sinon elles mangent le dixième."], ["« Faites travailler votre argent ».", "Pas avant d’avoir une réserve de sécurité et remboursé le crédit cher."]],
    garde: "<b>La règle simple</b> : se payer en premier, tous les mois, même peu. La régularité compte plus que le montant.",
    nuance: "Le livre ne parle ni du coût du crédit, ni de la hausse des prix, ni des frais. Ses histoires de fortune restent des paraboles : <b>il ne dit pas où placer votre argent aujourd’hui.</b>",
    decision: ["Choisissez votre « pièce sur dix ».", "Un montant, même petit, et une date : le jour où l’argent arrive. Si un dixième est trop, commencez par un vingtième, puis montez."],
    modules: [["P4", "Ma réserve de sécurité"], ["P2", "Un budget qui tient"]],
    quiz: [
      ["Selon le livre, quelle part garder sur chaque somme reçue ?", ["Ce qui reste à la fin du mois", "Au moins un dixième, mis de côté en premier", "La moitié"], 1, "Une pièce sur dix, le jour même : on se paie en premier."],
      ["Avec un revenu irrégulier, le dixième se calcule sur…", ["Le meilleur mois", "Le mois faible", "La moyenne de l’année"], 1, "Sur le mois faible : les bons mois renforcent la réserve."],
      ["Avant de « faire travailler » son argent, EFA conseille…", ["D’avoir une réserve et pas de crédit cher", "D’emprunter pour placer plus", "De suivre les conseils des réseaux"], 0, "Placer l’argent dont on aura besoin, ou en devant un crédit cher, fait perdre plus qu’il ne rapporte."]
    ]
  },
  {
    id: "pere-riche", n: 2, titre: "Père riche, père pauvre", auteur: "Robert T. Kiyosaki", annee: 1997, theme: "Actifs et passifs", c1: "#3A1F5C", c2: "#DA3C1B",
    accroche: "Ce qui vous rapporte, ce qui vous coûte.",
    phrase: "Ce n’est pas ce que vous gagnez qui compte, c’est <em>ce qui vous rapporte</em>.",
    phraseSuite: "L’auteur oppose deux figures : son père, diplômé et salarié, et le père d’un ami, entrepreneur. L’un travaille pour l’argent, l’autre fait travailler l’argent pour lui.",
    idees: [
      ["Un actif met de l’argent dans votre poche.", "Un passif en retire. La boutique louée, le champ qui produit : actifs. La voiture achetée à crédit pour paraître : passif, même si on la croit « à soi »."],
      ["On croit acheter un actif, on achète un passif.", "Pour l’auteur, la maison où l’on vit coûte chaque mois (entretien, crédit, impôts) : il la range parmi les passifs. C’est son idée la plus discutée."],
      ["Apprenez à lire les chiffres.", "Revenus, dépenses, actifs, passifs : l’auteur veut que chacun sache lire son propre bilan, comme une entreprise."],
      ["Travaillez pour apprendre, pas seulement pour gagner.", "Vendre, gérer, négocier : les compétences comptent plus que le premier salaire."],
      ["Payez-vous en premier.", "Comme à Babylone : une part de chaque revenu va d’abord aux actifs, avant les dépenses."]
    ],
    marche: [["Trier ce qui rapporte et ce qui coûte.", "Un moto-taxi qui roule pour vous, un terrain loué : la question « est-ce que ça me rapporte chaque mois ? » est utile ici aussi."], ["Parler d’argent en famille.", "Le livre montre que l’éducation financière se transmet à la maison."], ["Se former.", "Une compétence de plus (comptabilité, vente, numérique) est souvent le meilleur placement."]],
    pasIci: [["« La dette est un levier ».", "Avec des crédits chers, emprunter pour investir fait souvent perdre. Le coût total d’un crédit se calcule avant."], ["Quitter son salaire pour entreprendre.", "Sans réserve de sécurité, c’est jouer la stabilité de toute la famille."], ["L’immobilier facile.", "Titre foncier, litiges, terrains vendus deux fois : l’immobilier demande ici des vérifications que le livre ignore."]],
    garde: "<b>La question à se poser</b> avant chaque achat important : est-ce que cela me rapportera, ou me coûtera, chaque mois ?",
    nuance: "Des critiques ont mis en doute l’existence du « père riche » et plusieurs affirmations ne sont pas vérifiables. L’auteur vend aussi des formations. <b>Prenez les idées, pas les promesses.</b>",
    decision: ["Faites la liste de vos actifs et de vos passifs.", "Ce qui vous rapporte chaque mois d’un côté, ce qui vous coûte de l’autre. Une ligne par bien ou par dette."],
    modules: [["M17", "Épargner ou investir"], ["P6", "Reprendre la main sur mes dettes"]],
    quiz: [
      ["Pour l’auteur, un actif, c’est…", ["Tout ce que l’on possède", "Ce qui met de l’argent dans votre poche", "Ce qui a coûté cher"], 1, "Un actif rapporte ; un passif coûte, même si vous le possédez."],
      ["Une voiture achetée à crédit pour se déplacer le week-end est plutôt…", ["Un actif", "Un passif", "Une épargne"], 1, "Elle coûte chaque mois (crédit, carburant, entretien) sans rien rapporter."],
      ["Avant d’emprunter pour investir, EFA conseille de…", ["Calculer le coût total du crédit et avoir une réserve", "Emprunter le plus possible", "Suivre l’avis d’un vendeur de formation"], 0, "Le coût du crédit doit être inférieur à ce que l’investissement rapporte, et la réserve protège en cas d’échec."]
    ]
  },
  {
    id: "psychologie", n: 3, titre: "La psychologie de l’argent", auteur: "Morgan Housel", annee: 2020, theme: "Comportement", c1: "#0E3B3A", c2: "#3CCB7F",
    accroche: "Le comportement compte plus que le savoir.",
    phrase: "Bien gérer son argent dépend moins de <em>ce qu’on sait</em> que de la façon dont on se comporte.",
    phraseSuite: "En une vingtaine de courts chapitres, l’auteur montre que nos décisions d’argent viennent de notre histoire, de nos peurs et de notre entourage, plus que des calculs.",
    idees: [
      ["Chacun a son histoire avec l’argent.", "Ce qu’on a vécu (la pénurie, une faillite, un héritage) façonne nos choix. Ce qui paraît absurde chez l’autre est souvent logique pour lui."],
      ["Savoir s’arrêter : « assez ».", "Le danger vient quand on ne sait plus quand on a assez, et qu’on risque ce qu’on a pour ce qu’on n’a pas besoin."],
      ["Le temps fait le gros du travail.", "Une épargne modeste, tenue longtemps, dépasse souvent une grosse somme placée trop tard. La patience est un avantage."],
      ["La richesse, c’est ce qu’on ne voit pas.", "L’argent non dépensé ne se montre pas. Celui qui affiche n’est pas forcément celui qui possède."],
      ["Prévoyez une marge pour l’imprévu.", "Les plans échouent toujours un peu : une marge de sécurité permet de rester debout quand ça arrive."]
    ],
    marche: [["La marge de sécurité.", "C’est exactement la réserve de précaution : elle évite de s’endetter au premier coup dur."], ["Résister à la pression sociale.", "Cérémonies, apparences : « assez » aide à dire non sans honte."], ["La patience.", "Une cotisation régulière, même petite, est la base de toute spirale."]],
    pasIci: [["Les exemples de Bourse américaine.", "Le livre s’appuie sur des décennies de marché américain. La BRVM est plus petite et moins liquide : on ne transpose pas les chiffres."], ["Épargner « sans but ».", "Conseil utile quand on a un surplus. Avec un revenu juste, il faut d’abord un budget et une réserve."], ["La monnaie et les prix.", "Le livre parle peu de la hausse des prix et des frais, qui grignotent l’épargne ici aussi."]],
    garde: "<b>Une marge pour l’imprévu</b> et la patience : deux comportements simples qui protègent plus qu’un bon placement.",
    nuance: "C’est un livre d’idées, pas un manuel : <b>il ne dit pas quoi faire de votre argent</b>, il aide à comprendre pourquoi on fait ce qu’on fait.",
    decision: ["Écrivez votre « assez ».", "La somme qui, chaque mois, vous suffirait pour vivre tranquille. C’est votre repère face aux tentations et aux pressions."],
    modules: [["P4", "Ma réserve de sécurité"], ["P1", "Où passe mon argent ?"]],
    quiz: [
      ["Pour l’auteur, bien gérer son argent dépend surtout…", ["De ses diplômes", "De son comportement", "De la chance"], 1, "Nos réactions (peur, envie, impatience) pèsent plus que nos connaissances."],
      ["« La richesse, c’est ce qu’on ne voit pas » veut dire…", ["L’argent non dépensé ne se montre pas", "Il faut cacher son argent", "Les riches ne dépensent rien"], 0, "Ce qu’on affiche a été dépensé ; ce qui reste ne se voit pas."],
      ["La marge de sécurité, à l’école EFA, c’est…", ["La réserve de précaution", "Un crédit de secours", "La tontine"], 0, "La réserve permet de traverser un imprévu sans s’endetter."]
    ]
  },
  {
    id: "habitudes", n: 4, titre: "Un rien peut tout changer", auteur: "James Clear", annee: 2018, theme: "Habitudes", c1: "#4A2A12", c2: "#F2B84B",
    accroche: "1 % par jour, et le système fait le reste.",
    phrase: "On ne s’élève pas au niveau de ses objectifs : on retombe au niveau de <em>ses systèmes</em>, c’est-à-dire de ses habitudes.",
    phraseSuite: "Titre original : Atomic Habits. Ce n’est pas un livre sur l’argent, mais sa méthode s’applique parfaitement à l’épargne et au budget.",
    idees: [
      ["Les petits progrès s’additionnent.", "S’améliorer un peu chaque jour paraît invisible, puis devient énorme. 500 F gardés par jour, c’est 182 500 F par an."],
      ["Un système plutôt qu’un objectif.", "« Économiser un million » est un objectif ; « garder 10 % le jour de la paie » est un système. C’est le système qui produit le résultat."],
      ["Rendez la bonne habitude évidente.", "Un rappel le jour de la paie, une enveloppe visible : ce qu’on voit, on le fait."],
      ["Rendez-la facile.", "Moins il y a d’étapes, plus l’habitude tient. Le virement automatique est l’habitude la plus facile."],
      ["Changez d’identité.", "Pas « j’essaie d’épargner » mais « je suis quelqu’un qui garde une part ». Chaque petit geste le prouve."]
    ],
    marche: [["L’automatisme.", "Un virement programmé vers une poche d’épargne, ou une cotisation fixe : l’habitude se fait sans volonté."], ["Le suivi en dix secondes.", "Noter chaque soir un seul poste de dépense, pendant une semaine : simple et révélateur."], ["Le groupe.", "La tontine et le club rendent l’habitude sociale : on tient pour les autres."]],
    pasIci: [["« Il suffit de 1 % ».", "Quand le revenu ne couvre pas l’essentiel, l’habitude ne suffit pas : il faut d’abord revoir le budget ou augmenter les revenus."], ["Les applications et objets connectés.", "Le livre suppose des outils et un quotidien stable ; ici, une enveloppe et un cahier font l’affaire."], ["Les imprévus familiaux.", "Une habitude casse au premier coup dur s’il n’y a pas de réserve : prévoyez la reprise."]],
    garde: "<b>Commencer petit et automatiser</b> : la meilleure façon de tenir une épargne dans la durée.",
    nuance: "Le livre parle d’habitudes en général. <b>Il ne remplace pas un budget</b> : l’habitude dit comment tenir, le budget dit combien.",
    decision: ["Choisissez une habitude de deux minutes.", "Par exemple : chaque jour de paie, envoyer 5 % vers une poche à part, avant toute autre dépense."],
    modules: [["P2", "Un budget qui tient"], ["P1", "Où passe mon argent ?"]],
    quiz: [
      ["Selon le livre, qu’est-ce qui produit le résultat ?", ["L’objectif", "Le système, c’est-à-dire les habitudes", "La motivation"], 1, "L’objectif donne la direction ; le système de petites habitudes fait avancer."],
      ["Pour rendre l’épargne facile, le mieux est…", ["D’y penser chaque soir", "D’automatiser un virement le jour de la paie", "D’attendre la fin du mois"], 1, "Moins il y a d’effort, plus l’habitude tient."],
      ["500 F gardés chaque jour représentent environ, en un an…", ["50 000 F", "182 500 F", "500 000 F"], 1, "500 × 365 = 182 500 F."]
    ]
  },
  {
    id: "esprit-millionnaire", n: 5, titre: "Les secrets d’un esprit millionnaire", auteur: "T. Harv Eker", annee: 2005, theme: "Croyances", c1: "#2B1B3D", c2: "#EC6243",
    accroche: "Vos croyances sur l’argent, et vos pots.",
    phrase: "Notre rapport à l’argent suit un <em>« plan » intérieur</em> hérité de notre enfance.",
    phraseSuite: "L’auteur, formateur en développement personnel, invite à examiner ce qu’on a appris sur l’argent, puis propose de répartir chaque revenu en plusieurs pots.",
    idees: [
      ["On reproduit ce qu’on a entendu.", "« L’argent ne fait pas le bonheur », « les riches sont malhonnêtes » : ces phrases entendues jeune guident nos choix sans qu’on le sache."],
      ["Penser à long terme.", "Préférer ce qui construit (apprendre, garder) à ce qui fait plaisir tout de suite."],
      ["Gérer ce qu’on a déjà.", "Pour l’auteur, on ne reçoit pas plus tant qu’on ne gère pas bien le peu qu’on a. Commencer petit, mais commencer."],
      ["Répartir en pots.", "Chaque revenu est divisé en plusieurs pots : le nécessaire, la liberté financière, l’épargne longue, la formation, le plaisir, le don."],
      ["Recevoir et demander.", "Savoir négocier son salaire ou ses prix fait aussi partie de la gestion de l’argent."]
    ],
    marche: [["Les pots.", "C’est la méthode EFA « Séparer les poches » : l’argent de chaque usage dans sa poche, avant de compter."], ["Le pot « don ».", "La solidarité devient une ligne prévue, pas une fuite qui surprend."], ["Examiner ses croyances.", "Ce que la famille dit de l’argent mérite d’être regardé, sans jugement."]],
    pasIci: [["Les pourcentages fixes.", "Avec un revenu juste, consacrer seulement un peu plus de la moitié au nécessaire est irréaliste. Les pots s’adaptent à votre budget."], ["La pensée positive.", "Changer ses pensées ne paie pas le loyer : il faut un plan chiffré."], ["Les séminaires.", "Le livre renvoie à des formations payantes. Rien n’oblige à payer pour appliquer les pots."]],
    garde: "<b>Les pots</b> : une façon simple et visuelle de séparer les usages de l’argent dès qu’il arrive.",
    nuance: "Le ton est celui du développement personnel, avec des promesses fortes. <b>Gardez la méthode, laissez les slogans.</b>",
    decision: ["Créez trois poches cette semaine.", "Le nécessaire, la réserve, la solidarité. Trois enveloppes, ou trois portefeuilles, et une règle de répartition."],
    modules: [["P2", "Un budget qui tient"], ["P3", "Aider mes proches sans me perdre"]],
    quiz: [
      ["Le « plan financier intérieur », c’est…", ["Un tableau Excel", "Nos croyances sur l’argent, souvent héritées", "Un plan de retraite"], 1, "Ce que l’on a entendu jeune guide nos décisions d’argent."],
      ["La méthode des pots ressemble, à l’école EFA, à…", ["Séparer les poches", "La Bourse", "Le crédit"], 0, "Chaque usage de l’argent dans sa poche, dès qu’il arrive."],
      ["Avec un revenu juste, les pourcentages du livre…", ["S’appliquent tels quels", "S’adaptent à votre budget", "Ne servent à rien"], 1, "On garde l’idée des pots ; les proportions suivent votre réalité."]
    ]
  },
  {
    id: "investisseur-intelligent", n: 6, titre: "L’investisseur intelligent", auteur: "Benjamin Graham", annee: 1949, theme: "Investir", c1: "#0B2A4A", c2: "#6DB8F2",
    accroche: "Investir n’est pas spéculer.",
    phrase: "Investir, c’est protéger son capital et viser un rendement raisonnable ; <em>le reste est spéculation</em>.",
    phraseSuite: "Le grand classique de la Bourse, par le professeur qui a formé Warren Buffett. Long et technique, mais ses principes tiennent en quelques idées.",
    idees: [
      ["Investir ou spéculer.", "L’investisseur étudie l’entreprise et protège son capital. Le spéculateur parie sur un prix qui monte."],
      ["Monsieur Marché.", "Le marché est comme un associé lunatique qui propose chaque jour un prix, tantôt trop haut, tantôt trop bas. Rien n’oblige à suivre son humeur."],
      ["La marge de sécurité.", "Acheter nettement en dessous de ce que vaut l’entreprise laisse de la place à l’erreur."],
      ["Défensif ou entreprenant.", "L’investisseur défensif veut peu d’efforts et de risques ; l’entreprenant y consacre du temps. Chacun choisit sa voie."],
      ["Diversifier.", "Ne pas tout mettre sur un seul titre ni un seul secteur."]
    ],
    marche: [["Lire avant d’acheter.", "Résultats, dette, dividendes : les sociétés cotées à la BRVM publient leurs comptes."], ["Ignorer les rumeurs.", "Un titre qui monte sur les réseaux n’est pas une raison d’acheter : c’est Monsieur Marché qui s’agite."], ["Le long terme.", "Les dividendes réguliers de certaines sociétés de la BRVM se lisent sur plusieurs années, pas sur une séance."]],
    pasIci: [["Un marché étroit.", "La BRVM compte peu de sociétés et certains titres s’échangent rarement : acheter et revendre peut prendre du temps."], ["Des exemples anciens.", "Le livre s’appuie sur le marché américain du siècle dernier ; les chiffres ne se transposent pas."], ["Commencer par la Bourse.", "Avant la Bourse : une réserve de sécurité et pas de crédit cher."]],
    garde: "<b>La marge de sécurité et Monsieur Marché</b> : deux idées qui évitent la plupart des pertes des débutants.",
    nuance: "Livre exigeant, écrit pour un autre marché et une autre époque. <b>EFA n’y voit pas une liste de titres à acheter</b> : c’est une façon de penser.",
    decision: ["Écrivez votre règle avant votre premier ordre.", "Combien, sur quelle durée, et ce que vous ferez si le cours baisse de 20 %. Une phrase, relue avant chaque achat."],
    modules: [["P8", "La BRVM"], ["M17", "Épargner ou investir"]],
    quiz: [
      ["Pour l’auteur, la différence entre investir et spéculer tient à…", ["La somme engagée", "L’étude de l’entreprise et la protection du capital", "La vitesse"], 1, "L’investisseur analyse et protège ; le spéculateur parie sur le prix."],
      ["« Monsieur Marché », c’est…", ["Le directeur de la Bourse", "Un associé lunatique dont on n’est pas obligé de suivre l’humeur", "Un courtier"], 1, "Le prix du jour peut être trop haut ou trop bas : on décide selon la valeur, pas l’humeur."],
      ["La marge de sécurité consiste à…", ["Acheter nettement sous la valeur estimée", "Garder un crédit de côté", "Acheter un seul titre"], 0, "Acheter moins cher que la valeur laisse de la place à l’erreur."]
    ]
  },
  {
    id: "reflechissez", n: 7, titre: "Réfléchissez et devenez riche", auteur: "Napoleon Hill", annee: 1937, theme: "Objectifs", c1: "#3B2A0E", c2: "#F2D27A",
    accroche: "Un objectif écrit, une date, un groupe.",
    phrase: "Un désir précis, <em>écrit et daté</em>, suivi d’un plan et de persévérance.",
    phraseSuite: "L’un des livres de développement personnel les plus vendus au monde. L’auteur dit avoir étudié des centaines de personnes qui ont réussi.",
    idees: [
      ["Un désir précis.", "Pas « avoir plus d’argent », mais une somme exacte, pour un but exact."],
      ["Écrit, avec une date.", "L’objectif écrit et daté devient un engagement qu’on relit."],
      ["Un plan, même imparfait.", "Mieux vaut un plan à corriger que pas de plan du tout."],
      ["Le groupe de réflexion.", "S’entourer de quelques personnes qui avancent dans la même direction et partagent leurs idées."],
      ["La persévérance.", "La plupart abandonnent juste avant d’y arriver : la constance fait la différence."]
    ],
    marche: [["L’objectif chiffré.", "« 300 000 F de réserve d’ici décembre » se suit ; « épargner plus » ne se suit pas."], ["Le groupe.", "La tontine, le club d’investissement ou un groupe WhatsApp d’épargne jouent ce rôle de soutien."], ["La constance.", "Une petite cotisation tenue douze mois vaut mieux qu’un grand effort abandonné en mars."]],
    pasIci: [["« Penser suffit ».", "Le livre attribue beaucoup au pouvoir de la pensée. Sans budget ni revenu, l’objectif reste un vœu."], ["Les histoires de réussite.", "Elles ne sont pas vérifiables et passent sous silence ceux qui ont échoué en suivant la même voie."], ["La richesse comme but unique.", "EFA vise d’abord la stabilité : une réserve, peu de dettes, des projets financés."]],
    garde: "<b>L’objectif écrit, chiffré et daté</b>, partagé avec un groupe qui vous tient.",
    nuance: "Méthode non prouvée, ton parfois proche de la magie. <b>On garde l’objectif et le groupe, pas la promesse de richesse.</b>",
    decision: ["Écrivez un objectif d’argent, chiffré et daté.", "Par exemple : « 150 000 F de réserve au 31 mars ». Collez-le où vous le verrez chaque jour."],
    modules: [["M21", "Du groupe au club d’investissement"], ["P4", "Ma réserve de sécurité"]],
    quiz: [
      ["Selon le livre, un bon objectif est…", ["Vague, pour rester libre", "Précis, écrit et daté", "Secret"], 1, "Une somme exacte, une date, écrites : l’objectif devient un engagement."],
      ["Le « groupe de réflexion » ressemble ici à…", ["La tontine ou le club d’investissement", "La banque", "Le marché"], 0, "Un groupe qui avance dans la même direction aide à tenir."],
      ["Ce qu’EFA ne retient pas du livre :", ["L’objectif écrit", "La persévérance", "L’idée que penser suffit à devenir riche"], 2, "Sans budget ni revenu, la pensée ne suffit pas."]
    ]
  },
  {
    id: "quadrant", n: 8, titre: "Le quadrant du cashflow", auteur: "Robert T. Kiyosaki", annee: 1998, theme: "Revenus", c1: "#13324A", c2: "#DA3C1B",
    accroche: "Employé, indépendant, propriétaire, investisseur.",
    phrase: "On gagne sa vie dans <em>quatre cases</em> : employé, indépendant, propriétaire d’entreprise, investisseur.",
    phraseSuite: "La suite de « Père riche, père pauvre ». L’auteur classe les sources de revenus et pousse à passer des cases de gauche à celles de droite.",
    idees: [
      ["E : employé.", "On échange son temps contre un salaire. Sécurité, mais revenu limité par les heures."],
      ["S : indépendant.", "On travaille pour soi : commerce, métier, profession libérale. Plus de liberté, mais si on s’arrête, le revenu s’arrête."],
      ["B : propriétaire d’entreprise.", "Une organisation qui fonctionne sans vous au quotidien."],
      ["I : investisseur.", "L’argent placé produit le revenu."],
      ["Changer de case s’apprend.", "Passer de gauche à droite demande des compétences, du temps et souvent des échecs."]
    ],
    marche: [["Cumuler les cases.", "Beaucoup sont déjà E et S à la fois : un salaire et une activité à côté. C’est une force, si les deux caisses sont séparées."], ["La question du temps.", "« Si je m’arrête un mois, que devient mon revenu ? » éclaire la fragilité d’une activité."], ["Se former.", "Gérer, déléguer, compter : les compétences de la case B s’apprennent petit à petit."]],
    pasIci: [["Mépriser le salaire.", "Un salaire régulier est une base précieuse, surtout pour constituer une réserve."], ["Le capital de départ.", "Passer en B ou en I demande un capital et l’accès au crédit, plus difficiles ici."], ["L’investisseur « facile ».", "Le livre minimise les risques. Investir sans réserve ni connaissance, c’est spéculer."]],
    garde: "<b>Savoir dans quelle case on gagne sa vie</b>, et séparer la caisse de l’activité de celle du foyer.",
    nuance: "Le livre valorise surtout l’entrepreneuriat et l’investissement, avec peu de chiffres et beaucoup d’affirmations. <b>Toutes les cases ont leur place.</b>",
    decision: ["Classez vos revenus dans les quatre cases.", "Puis demandez-vous : que se passe-t-il si je m’arrête un mois ? La réponse dit quelle réserve il vous faut."],
    modules: [["M9", "Revenu irrégulier et activité"], ["P4", "Ma réserve de sécurité"]],
    quiz: [
      ["Dans le livre, la case S désigne…", ["Les salariés", "Les indépendants", "Les investisseurs"], 1, "S : celui qui travaille pour lui-même, commerce ou métier."],
      ["Un salarié qui tient une boutique le week-end est dans…", ["Une seule case", "Deux cases à la fois, E et S", "Aucune case"], 1, "Il cumule un salaire (E) et une activité (S)."],
      ["Pour EFA, avant de passer dans la case I, il faut…", ["Une réserve et des connaissances", "Quitter son emploi", "Un crédit"], 0, "Sans réserve ni connaissance, investir revient à spéculer."]
    ]
  },
  {
    id: "nudge", n: 9, titre: "Nudge", auteur: "Richard Thaler et Cass Sunstein", annee: 2008, theme: "Décider", c1: "#1A3A2A", c2: "#6DB8F2",
    accroche: "Le bon choix, rendu facile.",
    phrase: "La façon dont un choix est présenté <em>change ce qu’on choisit</em>.",
    phraseSuite: "Un économiste (prix Nobel 2017) et un juriste montrent comment de petits « coups de pouce » orientent nos décisions, sans rien interdire.",
    idees: [
      ["L’architecture du choix.", "L’ordre des plats à la cantine, la case déjà cochée : la présentation oriente la décision."],
      ["La force de l’option par défaut.", "Quand l’épargne est automatique sauf refus, beaucoup plus de gens épargnent."],
      ["Nous ne sommes pas des calculateurs parfaits.", "Inertie, oubli, tentation : nous avons besoin d’aide pour faire ce que nous voulons vraiment."],
      ["S’engager à l’avance.", "Décider aujourd’hui pour son « moi » de demain : épargner une part des hausses de salaire futures, par exemple."],
      ["Pousser sans contraindre.", "Le coup de pouce laisse toujours la liberté de choisir autrement."]
    ],
    marche: [["Se mettre en mode « défaut ».", "Un ordre permanent le jour de la paie : l’épargne se fait seule, sauf si vous l’arrêtez."], ["L’engagement social.", "La tontine est un « nudge » collectif : on cotise parce que le groupe attend."], ["Retirer la tentation.", "Garder la réserve ailleurs que dans le portefeuille de tous les jours."]],
    pasIci: [["Les systèmes d’entreprise.", "Le livre s’appuie sur des plans d’épargne d’employeurs et d’États qui existent peu ici : il faut se créer ses propres défauts."], ["Les coups de pouce des vendeurs.", "Les mêmes techniques servent à faire acheter : promotions, crédit « en un clic »."], ["Le revenu en espèces.", "Payé en liquide, l’automatisme demande un geste : l’enveloppe du jour de paie."]],
    garde: "<b>Faire de l’épargne l’option par défaut</b> : décider une fois, puis laisser le système travailler.",
    nuance: "Le livre parle surtout de politiques publiques et de pays riches. <b>Ici, c’est à chacun de construire ses propres coups de pouce.</b>",
    decision: ["Programmez un « défaut » d’épargne.", "Un ordre permanent, une cotisation fixe ou une enveloppe le jour de la paie : décidez-le une fois, pour tous les mois."],
    modules: [["P4", "Ma réserve de sécurité"], ["M15", "Où garder son argent"]],
    quiz: [
      ["Une « option par défaut », c’est…", ["Ce qui arrive si l’on ne fait rien", "Une erreur", "Un crédit"], 0, "Quand l’épargne se fait sauf refus, la plupart épargnent."],
      ["La tontine peut être vue comme…", ["Un coup de pouce collectif à épargner", "Un placement en Bourse", "Une assurance"], 0, "On cotise parce que le groupe attend : l’engagement aide."],
      ["Les vendeurs utilisent aussi ces techniques pour…", ["Vous faire épargner", "Vous faire acheter", "Rien"], 1, "Promotions et crédit en un clic sont des coups de pouce… à dépenser."]
    ]
  },
  {
    id: "systeme", n: 10, titre: "Système 1 / Système 2", auteur: "Daniel Kahneman", annee: 2011, theme: "Biais", c1: "#2A0E2E", c2: "#F09680",
    accroche: "Penser vite, penser lentement.",
    phrase: "Nous avons <em>deux vitesses de pensée</em> : l’une rapide et intuitive, l’autre lente et réfléchie.",
    phraseSuite: "Titre original : Thinking, Fast and Slow. Le psychologue, prix Nobel d’économie 2002, explique les erreurs que nous faisons tous, surtout avec l’argent.",
    idees: [
      ["Système 1, système 2.", "Le premier décide en un éclair, le second calcule. Pour l’argent, le premier décide souvent à la place du second."],
      ["Perdre fait plus mal que gagner.", "Perdre 10 000 F nous touche plus que gagner 10 000 F ne nous réjouit. On garde trop longtemps ce qui perd."],
      ["L’ancrage.", "Le premier prix entendu sert de repère : un « prix barré » rend une promotion plus attirante qu’elle ne l’est."],
      ["Le cadrage.", "« Seulement 2 000 F par jour » paraît moins cher que « 730 000 F par an », pour la même somme."],
      ["L’excès de confiance.", "Nous surestimons notre capacité à prévoir, surtout quand nous avons déjà gagné une fois."]
    ],
    marche: [["Ralentir avant de payer.", "Une nuit de réflexion avant tout achat important laisse le système 2 décider."], ["Recalculer sur l’année.", "« Par jour » ou « par semaine » : multipliez pour voir le vrai prix."], ["Repérer l’urgence.", "Les arnaques jouent sur le système 1 : « offre valable une heure », « envoyez vite »."]],
    pasIci: [["Les expériences de laboratoire.", "Beaucoup d’études ont été faites avec des étudiants américains : les tendances sont universelles, les chiffres moins."], ["Un livre long et dense.", "Les idées sont fortes, mais la lecture est exigeante : la fiche suffit pour commencer."], ["Connaître ses biais ne suffit pas.", "Même averti, on se trompe : il faut des règles (attendre, recalculer), pas seulement de la lucidité."]],
    garde: "<b>Deux réflexes</b> : attendre une nuit avant un gros achat, et tout recalculer sur l’année.",
    nuance: "Certaines études citées ont depuis été discutées par les chercheurs. <b>Les grandes idées restent solides</b>, les détails moins.",
    decision: ["Adoptez la règle des 24 heures.", "Au-dessus d’un montant que vous fixez (par exemple 20 000 F), aucun achat le jour même."],
    modules: [["M16", "Consommer et acheter"], ["P14", "Se protéger, protéger sa famille"]],
    quiz: [
      ["« Seulement 2 000 F par jour », sur un an, cela fait environ…", ["73 000 F", "730 000 F", "7 300 000 F"], 1, "2 000 × 365 = 730 000 F : le cadrage « par jour » cache le vrai prix."],
      ["L’aversion aux pertes veut dire que…", ["Perdre fait plus mal que gagner ne fait plaisir", "On n’aime pas gagner", "On perd toujours"], 0, "C’est pourquoi on garde trop longtemps ce qui perd."],
      ["Face à une offre « valable une heure », le bon réflexe est…", ["Payer vite", "Prendre le temps : l’urgence est un signal d’alerte", "Demander un crédit"], 1, "L’urgence fait décider le système 1 : c’est la base de nombreuses arnaques."]
    ]
  }
];
