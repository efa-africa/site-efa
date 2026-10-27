/* Contenu pédagogique de l'application EFA — version 1.0 (21 oct. 2026).
   Source éditoriale unique : ce fichier peut être modifié sans toucher au code de l'application.
   Tous les montants sont des exemples fictifs en FCFA. */
window.EFA_CONTENU = {
  version: "1.0",
  mission: "EFA aide chacun à passer du cercle, l’argent qui tourne, à la spirale, l’argent qui reste.",

  personnages: {
    koffi: { nom: "Koffi", role: "salarié à Abidjan, il apprend à suivre son argent" },
    bamba: { nom: "Tonton Bamba", role: "le mentor de Koffi" },
    affoue: { nom: "Tantie Affoué", role: "la tante de Koffi, elle organise des tontines depuis vingt ans" }
  },

  intentions: [
    { id: "comprendre", label: "Comprendre mon argent", parcours: "p1" },
    { id: "budget", label: "Organiser mon budget", parcours: "p2" },
    { id: "proches", label: "Gérer les demandes des proches", parcours: "p3" },
    { id: "projet", label: "Préparer un projet", parcours: "p2" }
  ],

  rythmes: [
    { id: "quotidien", label: "Un peu chaque jour", detail: "5 minutes, 5 jours sur 7" },
    { id: "hebdo3", label: "Trois fois par semaine", detail: "environ 10 minutes" },
    { id: "hebdo1", label: "Une fois par semaine", detail: "une séance de 15 à 20 minutes" }
  ],

  parcours: [
    /* ───────────────────────── PARCOURS 1 ───────────────────────── */
    {
      id: "p1",
      titre: "Où passe mon argent ?",
      couleur: "bleu",
      probleme: "Le salaire arrive, et quelques jours plus tard il n’en reste presque rien. On ne sait pas vraiment où il est passé.",
      competence: "Distinguer ce qui entre, ce qui sort et ce qui reste, puis retrouver ses dépenses réelles.",
      objectifs: [
        "Calculer un flux net : entrées moins sorties sur une même période",
        "Faire la différence entre un flux et un stock",
        "Repérer les petites sorties qu’on oublie",
        "Observer un poste de dépenses pendant sept jours sans se juger"
      ],
      pointDeDepart: "Sans calculer, dites en une phrase combien il vous reste en général à la fin du mois.",
      challenge: "c_poste7",
      suite: "p2",
      lecons: [
        {
          id: "p1l1", titre: "Ce qui entre, ce qui sort", duree: 5, dico: "flux",
          situation: { perso: "koffi", texte: "Koffi gagne 450 000 FCFA par mois. Il loue aussi une chambre à 100 000 FCFA et fait quelques livraisons le week-end. « Je gagne bien, il devrait me rester quelque chose », pense-t-il. Le 28, son compte est presque vide." },
          explication: [
            "Pour savoir ce qui vous reste, il faut mettre face à face ce qui entre et ce qui sort, sur la même période. Un mois, par exemple.",
            "Ce résultat s’appelle le flux net : entrées moins sorties. S’il est positif, il vous reste quelque chose. S’il est négatif, quelque chose paie la différence : votre épargne ou une dette.",
            "Ce qui entre impressionne. Ce qui reste construit."
          ],
          exemple: "Entrées de Koffi : salaire 450 000 + loyer perçu 100 000 + livraisons 50 000. Sorties : logement 150 000, nourriture 120 000, crédit 100 000, famille 80 000, transport 60 000, autres 50 000.",
          exercices: [
            { type: "calc", q: "Quel est le flux net de Koffi sur le mois, en FCFA ?", reponse: 40000, tolerance: 0,
              explication: "Entrées : 450 000 + 100 000 + 50 000 = 600 000. Sorties : 150 000 + 120 000 + 100 000 + 80 000 + 60 000 + 50 000 = 560 000. Flux net : 600 000 − 560 000 = 40 000 FCFA." },
            { type: "qcm", q: "Le mois suivant, Koffi a 600 000 d’entrées et 630 000 de sorties. Que se passe-t-il ?",
              options: ["Rien, il a toujours 600 000 d’entrées", "Son flux net est de − 30 000 : son épargne ou une dette paie la différence", "Son flux net est de + 30 000"],
              correct: 1,
              explication: "600 000 − 630 000 = − 30 000. Ces 30 000 FCFA ne sortent pas de nulle part : ils viennent de l’épargne ou d’un emprunt. Répété plusieurs mois, un flux négatif réduit ce que vous possédez." }
          ],
          application: { type: "observe", prompt: "Sans chercher la précision, notez vos principales entrées du mois dernier. Une estimation suffit." },
          action: { objectif: "Connaître mon flux net du mois", etape: "Lister mes entrées et mes sorties du mois dernier, même approximativement", ressource: "Leçon « Ce qui entre, ce qui sort »" },
          retenir: "Flux net = entrées − sorties, sur la même période."
        },
        {
          id: "p1l2", titre: "Le flux et le stock", duree: 5, dico: "stock",
          situation: { perso: "bamba", texte: "Tonton Bamba demande à Koffi : « Tu gagnes combien ? » Koffi répond fièrement. « Et tu as combien ? » Koffi ne sait pas quoi dire. Ce n’est pas la même question." },
          explication: [
            "Un flux, c’est ce qui passe pendant une période : un salaire par mois, un loyer par mois. Un stock, c’est ce qui est là à une date précise : votre épargne le 31, un terrain, une dette en cours.",
            "Pensez à un réservoir. Ce qui entre et ce qui sort sont des flux. Le niveau de l’eau, c’est le stock. Le niveau ne monte que si ce qui entre dépasse ce qui sort.",
            "Ce que vous possédez moins ce que vous devez donne votre patrimoine net. Un bon salaire est un flux ; votre richesse est un stock."
          ],
          exemple: "Le 1er, Koffi a 40 000 FCFA sur son compte. Pendant le mois, il reçoit 300 000 et dépense 280 000.",
          exercices: [
            { type: "calc", q: "Combien Koffi a-t-il sur son compte le 31, en FCFA ?", reponse: 60000, tolerance: 0,
              explication: "Stock de départ 40 000 + entrées 300 000 − sorties 280 000 = 60 000 FCFA. Le salaire a circulé ; le stock a grandi de 20 000." },
            { type: "classer", q: "Flux ou stock ? Classez chaque élément.", categories: ["Flux", "Stock"],
              items: [
                { t: "Le salaire du mois", c: 0 },
                { t: "L’épargne disponible aujourd’hui", c: 1 },
                { t: "Le crédit qu’il reste à rembourser", c: 1 },
                { t: "Le loyer payé chaque mois", c: 0 },
                { t: "La moto de livraison", c: 1 }
              ],
              explication: "Un flux se mesure sur une durée (par mois). Un stock se mesure à une date (aujourd’hui). Une dette en cours est un stock que l’on doit ; une moto, un stock que l’on possède." }
          ],
          application: { type: "appris", prompt: "Citez un de vos stocks (une épargne, un bien, des marchandises, une dette). Pas besoin de montant : le type suffit." },
          action: { objectif: "Faire la photo de mes stocks", etape: "Lister ce que je possède et ce que je dois à une date choisie", ressource: "Dico : Stock" },
          retenir: "Le flux dit ce qui passe. Le stock dit ce qui reste."
        },
        {
          id: "p1l3", titre: "Les petites sorties qu’on oublie", duree: 6, dico: "frais",
          situation: { perso: "koffi", texte: "Koffi additionne ses grosses dépenses : loyer, crédit, nourriture. Il lui manque pourtant 35 000 FCFA. En relisant ses messages de mobile money, il trouve des dizaines de petites lignes." },
          explication: [
            "Les grosses dépenses se retiennent. Les petites passent inaperçues : frais de transfert, crédit téléphone, transport du quotidien, petites dépenses au bord de la route.",
            "Dans un transfert mobile money, il y a deux choses : le montant envoyé, qui arrive chez le destinataire, et les frais, qui disparaissent. Les frais sont une vraie sortie, même s’ils sont petits.",
            "Un jour où rien n’a été noté n’est pas un jour sans dépense. C’est une information manquante. Il faut le dire ainsi."
          ],
          exemple: "Koffi envoie 20 000 FCFA à sa sœur. Son compte baisse de 20 200 FCFA.",
          exercices: [
            { type: "classer", q: "Dans l’envoi de Koffi et ses autres opérations, classez chaque ligne.", categories: ["Transfert", "Frais"],
              items: [
                { t: "Les 20 000 envoyés à sa sœur", c: 0 },
                { t: "Les 200 de différence", c: 1 },
                { t: "Le coût de retrait au guichet", c: 1 },
                { t: "Le paiement du loyer par téléphone", c: 0 }
              ],
              explication: "Le transfert arrive chez quelqu’un. Les frais, eux, ne reviennent à personne de votre entourage : ce sont des sorties sèches, à compter dans vos dépenses." },
            { type: "qcm", q: "Koffi n’a rien noté mardi. Que doit-il inscrire pour mardi ?",
              options: ["0 FCFA de dépenses", "Information manquante", "La moyenne des autres jours, sans le préciser"],
              correct: 1,
              explication: "Inscrire 0 ferait croire qu’il n’a rien dépensé. Une moyenne peut aider, mais seulement si elle est signalée comme une estimation. Le plus honnête : « non renseigné »." }
          ],
          application: { type: "observe", prompt: "Relisez vos derniers messages de mobile money. Combien de frais avez-vous payés cette semaine ? Une estimation suffit." },
          action: { objectif: "Repérer mes frais de mobile money", etape: "Relire les messages de la semaine et noter les frais à part", ressource: "Challenge « Repérer les frais de mobile money »" },
          retenir: "Les petites sorties répétées font de grandes sommes. Un jour non noté n’est pas un jour à zéro."
        },
        {
          id: "p1l4", titre: "Observer sept jours, sans se juger", duree: 6, dico: "flux",
          situation: { perso: "bamba", texte: "Koffi veut tout noter, tout de suite, tout le temps. Tonton Bamba sourit : « Commence par un seul poste. Le transport, par exemple. Sept jours. Et ne te gronde pas. »" },
          explication: [
            "Observer n’est pas encore changer. On regarde d’abord, on décide ensuite.",
            "La méthode EFA en cinq étapes : choisir un poste, noter les sorties chaque jour, préciser si le montant est exact ou estimé, faire le total, interpréter.",
            "S’il manque des jours, on calcule sur les jours notés et on le dit. On peut ensuite proposer une estimation pour la semaine entière, à condition de l’annoncer comme telle."
          ],
          exemple: "Koffi a noté son transport 5 jours sur 7. Total des jours notés : 21 000 FCFA. Deux jours sont manquants.",
          exercices: [
            { type: "calc", q: "Quelle est la dépense moyenne de transport par jour noté, en FCFA ?", reponse: 4200, tolerance: 0,
              explication: "21 000 ÷ 5 jours notés = 4 200 FCFA par jour noté. On divise par les jours notés, pas par 7." },
            { type: "qcm", q: "Quelle phrase résume honnêtement la semaine de Koffi ?",
              options: [
                "« J’ai dépensé 21 000 FCFA de transport cette semaine. »",
                "« 21 000 FCFA sur 5 jours notés ; si les 2 jours manquants ressemblaient aux autres, la semaine serait autour de 29 400 FCFA (estimation). »",
                "« J’ai dépensé 29 400 FCFA de transport cette semaine. »"
              ],
              correct: 1,
              explication: "La première oublie deux jours. La troisième présente une estimation comme un fait. La deuxième dit ce qui est connu, puis signale l’extrapolation : 4 200 × 7 = 29 400." }
          ],
          application: { type: "decide", prompt: "Quel poste allez-vous observer pendant sept jours ? (transport, nourriture, crédit téléphone, sorties…)" },
          action: { objectif: "Observer un poste pendant 7 jours", etape: "Lancer le challenge et noter le premier jour ce soir", ressource: "Challenge « Suivre un poste de dépenses »" },
          retenir: "D’abord observer, ensuite décider. Dire ce qu’on sait, signaler ce qu’on estime."
        }
      ]
    },

    /* ───────────────────────── PARCOURS 2 ───────────────────────── */
    {
      id: "p2",
      titre: "Construire mon budget",
      couleur: "nuit",
      probleme: "On décide de ses dépenses au fil des jours, au gré des urgences. À la fin du mois, il n’y a plus de marge pour l’imprévu ni pour l’épargne.",
      competence: "Organiser revenus, engagements et besoins avant le mois, puis comparer le prévu au réel.",
      objectifs: [
        "Comprendre qu’un budget est une décision prise à l’avance",
        "Ranger ses dépenses en engagements, besoins courants et choix libres",
        "Bâtir un budget quand les revenus sont irréguliers",
        "Mesurer l’écart entre le prévu et le réel, puis ajuster"
      ],
      pointDeDepart: "Avez-vous déjà fait un budget ? Qu’est-ce qui a marché, ou pas ?",
      challenge: "c_budget",
      suite: "p3",
      lecons: [
        {
          id: "p2l1", titre: "Un budget, c’est décider avant", duree: 5, dico: "budget",
          situation: { perso: "koffi", texte: "Le mois dernier, Koffi a tout noté. Bonne nouvelle : il sait où est passé son argent. Mauvaise nouvelle : il l’a su trop tard. « Et si je décidais avant ? » demande-t-il à Tonton Bamba." },
          explication: [
            "Suivre ses dépenses, c’est regarder en arrière. Faire un budget, c’est décider à l’avance ce que chaque franc devra faire.",
            "Un budget tient en trois colonnes : le prévu, le réel, l’écart. On remplit le prévu au début du mois, le réel au fil des jours, l’écart à la fin.",
            "Un budget n’est pas une punition. C’est un plan qu’on a le droit d’ajuster."
          ],
          exemple: null,
          exercices: [
            { type: "qcm", q: "Quand faut-il remplir la colonne « prévu » ?",
              options: ["À la fin du mois, en recopiant ce qui a été dépensé", "Avant le début du mois, ou dès l’arrivée du revenu", "Seulement quand il reste de l’argent"],
              correct: 1,
              explication: "Le prévu se décide avant de dépenser. Recopier le réel dans le prévu enlève tout l’intérêt de la comparaison." },
            { type: "qcm", q: "Koffi a prévu 40 000 de transport et dépensé 52 000. Que signifie cet écart ?",
              options: ["Son budget a échoué, il faut abandonner", "Une information : son estimation était trop basse ou un imprévu est arrivé", "Il doit réduire la nourriture de 12 000 sans réfléchir"],
              correct: 1,
              explication: "Un écart n’est pas une faute. Il dit soit que la prévision était trop optimiste, soit qu’un événement l’a déplacée. On cherche la cause, puis on ajuste le mois suivant." }
          ],
          application: { type: "appris", prompt: "En une phrase : qu’est-ce qui vous a empêché, jusqu’ici, de décider de vos dépenses à l’avance ?" },
          action: { objectif: "Préparer un budget avant le prochain revenu", etape: "Choisir la date à laquelle je remplirai mon prévu", ressource: "Leçon « Un budget, c’est décider avant »" },
          retenir: "Un budget se décide avant, se suit pendant, se relit après."
        },
        {
          id: "p2l2", titre: "Engagements, besoins, choix libres", duree: 6, dico: "budget",
          situation: { perso: "bamba", texte: "Koffi range toutes ses dépenses dans la même colonne. Tonton Bamba trace trois cases sur une feuille : « Ce que tu as promis. Ce dont tu as besoin. Ce que tu choisis. »" },
          explication: [
            "Les engagements ont un montant et une date fixés à l’avance : loyer, remboursement de crédit, cotisation de tontine, scolarité. On les prévoit en premier.",
            "Les besoins courants reviennent toujours mais varient : nourriture, transport, santé. On les estime à partir de l’observation.",
            "Les choix libres sont ce qu’on peut ajuster : sorties, habits, cadeaux. Et l’épargne ? On la place parmi les engagements, envers soi-même : on se paie en premier."
          ],
          exemple: null,
          exercices: [
            { type: "classer", q: "Rangez chaque dépense de Koffi.", categories: ["Engagement", "Besoin courant", "Choix libre"],
              items: [
                { t: "Loyer de 150 000 le 5 du mois", c: 0 },
                { t: "Cotisation de tontine de 25 000 le 10", c: 0 },
                { t: "Marché de la semaine", c: 1 },
                { t: "Transport pour aller au travail", c: 1 },
                { t: "Nouvelle paire de baskets", c: 2 },
                { t: "Sortie au maquis entre amis", c: 2 }
              ],
              explication: "Le loyer et la tontine ont une date et un montant promis : ce sont des engagements. Le marché et le transport reviennent toujours : besoins courants. Les baskets et la sortie se décident librement." },
            { type: "qcm", q: "Pourquoi placer l’épargne avec les engagements plutôt qu’à la fin ?",
              options: ["Parce que ce qui reste en fin de mois est rarement épargné", "Parce que l’épargne est obligatoire par la loi", "Parce que c’est plus joli dans le tableau"],
              correct: 0,
              explication: "Attendre qu’il reste quelque chose revient souvent à ne rien mettre de côté. En la traitant comme une promesse envers soi-même, on la protège." }
          ],
          application: { type: "observe", prompt: "Listez vos engagements du mois (montant et date si vous les connaissez). Les montants sont facultatifs." },
          action: { objectif: "Lister mes engagements", etape: "Écrire chaque engagement avec sa date", ressource: "Leçon « Engagements, besoins, choix libres »" },
          retenir: "D’abord les promesses, ensuite les besoins, enfin les choix. L’épargne est une promesse envers soi."
        },
        {
          id: "p2l3", titre: "Quand les revenus varient", duree: 6, dico: "budget",
          situation: { perso: "affoue", texte: "Tantie Affoué vend au marché. Certains mois sont bons, d’autres beaucoup moins. « Un budget, c’est pour les salariés », dit-elle. Koffi n’en est pas si sûr." },
          explication: [
            "Quand les revenus varient, on ne bâtit pas son budget sur un bon mois. On le bâtit sur un mois faible : ce qui rentre presque à coup sûr.",
            "Les mois meilleurs, le supplément a une destination décidée à l’avance : réserve pour les mois creux, épargne, projet.",
            "Pour une activité, séparez l’argent du commerce et l’argent de la maison. La caisse du commerce n’est pas un salaire."
          ],
          exemple: "Ventes nettes de Tantie Affoué ces trois derniers mois : 180 000, 240 000 et 150 000 FCFA.",
          exercices: [
            { type: "calc", q: "Sur quel montant mensuel Tantie Affoué devrait-elle construire son budget, en FCFA ?", reponse: 150000, tolerance: 0,
              explication: "On part du mois le plus faible : 150 000 FCFA. Si les mois suivants sont meilleurs, le surplus ira d’abord à la réserve pour les mois creux." },
            { type: "qcm", q: "Ce mois-ci, elle encaisse 240 000. Que faire des 90 000 au-dessus de sa base ?",
              options: ["Les dépenser, le mois est bon", "Suivre la répartition décidée à l’avance : réserve des mois creux d’abord", "Les prêter à la première personne qui demande"],
              correct: 1,
              explication: "Le surplus d’un bon mois finance les mois faibles. Sans répartition décidée à l’avance, il disparaît comme le reste." },
            { type: "classer", q: "À qui appartient cet argent ?", categories: ["Argent personnel", "Argent d’activité", "Argent confié"],
              items: [
                { t: "La recette du jour, avant de racheter la marchandise", c: 1 },
                { t: "La cagnotte de la tontine qu’elle garde ce mois-ci", c: 2 },
                { t: "Ce qu’elle se verse pour la maison", c: 0 }
              ],
              explication: "La recette sert d’abord à faire tourner le commerce. La cagnotte de la tontine appartient au groupe. Seul ce qu’elle se verse pour la maison est à elle." }
          ],
          application: { type: "decide", prompt: "Si vos revenus varient, quel serait votre « mois faible » de référence ? Si votre revenu est fixe, notez-le simplement." },
          action: { objectif: "Fixer ma base de budget", etape: "Retrouver mes revenus des trois derniers mois et retenir le plus bas", ressource: "Leçon « Quand les revenus varient »" },
          retenir: "Budget sur le mois faible, surplus avec une destination. Argent de la maison, de l’activité, confié : trois poches."
        },
        {
          id: "p2l4", titre: "Comparer le prévu et le réel", duree: 5, dico: "budget",
          situation: { perso: "koffi", texte: "Fin du mois. Koffi a son prévu et son réel. Il voudrait se féliciter ou se gronder. Tonton Bamba l’arrête : « Calcule d’abord. Ensuite seulement, explique. »" },
          explication: [
            "Écart = réel − prévu. Un écart positif veut dire qu’on a dépensé plus que prévu sur ce poste ; négatif, moins.",
            "Pour chaque écart important, une question suffit : prévision trop basse, imprévu, ou décision du moment ?",
            "Ajuster, c’est corriger le prévu du mois suivant. Ce n’est pas forcément dépenser moins : parfois, la prévision était irréaliste."
          ],
          exemple: "Prévu de Koffi : transport 40 000, nourriture 120 000, sorties 30 000. Réel : transport 52 000, nourriture 110 000, sorties 30 000.",
          exercices: [
            { type: "calc", q: "Quel est l’écart total entre le réel et le prévu, en FCFA ?", reponse: 2000, tolerance: 0,
              explication: "Transport + 12 000, nourriture − 10 000, sorties 0. Total : + 2 000 FCFA. Le total est presque juste, mais deux postes ont bougé : c’est poste par poste qu’on apprend." },
            { type: "qcm", q: "Le transport dépasse de 12 000 parce que les prix ont augmenté. Quel ajustement est raisonnable ?",
              options: ["Garder 40 000 et culpabiliser chaque mois", "Prévoir 52 000 le mois prochain et chercher où compenser", "Supprimer le poste transport"],
              correct: 1,
              explication: "Si la cause est durable, la prévision doit suivre la réalité. On cherche ensuite un poste qui peut céder un peu, ici peut-être la nourriture qui a coûté moins que prévu." }
          ],
          application: { type: "bilan", prompt: "Quel est le poste où votre réel s’éloigne le plus de ce que vous imaginiez ? Pourquoi, selon vous ?" },
          action: { objectif: "Comparer mon budget au réel", etape: "Remplir le prévu maintenant et le réel en fin de mois", ressource: "Challenge « Comparer son budget au réel »" },
          retenir: "Écart = réel − prévu. Comprendre la cause avant d’ajuster."
        }
      ]
    },

    /* ───────────────────────── PARCOURS 3 ───────────────────────── */
    {
      id: "p3",
      titre: "Aider mes proches avec des limites claires",
      court: "Aider mes proches",
      couleur: "corail",
      probleme: "Les demandes arrivent sans prévenir : scolarité, santé, cérémonie, prêt qui ne revient pas. On aime aider, mais le mois s’effondre.",
      competence: "Distinguer aide, prêt et engagement, décider d’une enveloppe, et répondre sans rompre le lien.",
      objectifs: [
        "Nommer clairement ce qu’on donne : aide, prêt ou engagement",
        "Savoir quand un prêt est raisonnable",
        "Décider d’une enveloppe de solidarité avant les demandes",
        "Formuler une réponse qui respecte ses limites et la personne"
      ],
      pointDeDepart: "Pensez à la dernière demande d’aide que vous avez reçue. Qu’avez-vous ressenti ?",
      challenge: "c_reponse",
      suite: "p1",
      lecons: [
        {
          id: "p3l1", titre: "Aide, prêt ou engagement ?", duree: 5, dico: "enveloppe",
          situation: { perso: "koffi", texte: "Un cousin appelle Koffi : « Avance-moi 50 000, je te rends à la fin du mois. » Trois mois plus tard, personne n’en parle. Pour le cousin, c’était une aide. Pour Koffi, c’était un prêt." },
          explication: [
            "Une aide est donnée sans retour attendu. Un prêt doit revenir : montant et date sont convenus. Un engagement est une participation régulière promise, comme la scolarité d’un neveu chaque trimestre.",
            "Beaucoup de malentendus viennent d’un mot non dit. Nommer ce qu’on donne, au moment où on le donne, protège l’argent et la relation.",
            "Une idée EFA : dans nos familles, l’aîné ou celui qui a « réussi » est souvent un assureur non déclaré. Rendre ce rôle visible aide à le tenir sans s’épuiser."
          ],
          exemple: null,
          exercices: [
            { type: "classer", q: "Aide, prêt ou engagement ?", categories: ["Aide", "Prêt", "Engagement"],
              items: [
                { t: "30 000 pour les obsèques d’un oncle, sans retour attendu", c: 0 },
                { t: "50 000 à rendre le 30, convenus par écrit", c: 1 },
                { t: "La scolarité de sa nièce, chaque trimestre", c: 2 },
                { t: "Une contribution unique au mariage d’un ami", c: 0 }
              ],
              explication: "Ce qui distingue le prêt : un retour convenu. Ce qui distingue l’engagement : la répétition promise. Le reste est de l’aide, et elle a toute sa valeur." },
            { type: "qcm", q: "Qu’est-ce qui aurait évité le malentendu entre Koffi et son cousin ?",
              options: ["Refuser toute demande", "Dire clairement « c’est un prêt, à rendre le 30 » au moment de donner", "Attendre que le cousin y pense"],
              correct: 1,
              explication: "Le mot posé au départ change tout. Sans date ni mot, chacun garde sa propre version." }
          ],
          application: { type: "observe", prompt: "Parmi l’argent donné ces derniers mois, qu’est-ce qui était de l’aide, du prêt, de l’engagement ? Pas besoin de montant." },
          action: { objectif: "Nommer ce que je donne", etape: "Pour la prochaine demande, dire si c’est une aide, un prêt ou un engagement", ressource: "Leçon « Aide, prêt ou engagement ? »" },
          retenir: "Aide : sans retour. Prêt : retour convenu. Engagement : répétition promise. Le nommer protège le lien."
        },
        {
          id: "p3l2", titre: "Prêt ou cadeau ?", duree: 5, dico: "enveloppe",
          situation: { perso: "affoue", texte: "Tantie Affoué l’a appris avec les années : « Quand je prête à la famille, je me demande d’abord si je pourrais vivre sans revoir cet argent. »" },
          explication: [
            "Prêter à un proche, c’est accepter un risque. Le remboursement peut tarder, ou ne jamais venir, sans mauvaise intention.",
            "Une règle simple : ne prêtez que ce que vous pourriez donner. Si vous ne pouvez pas vous en passer, proposez une aide plus petite plutôt qu’un prêt plus grand.",
            "Si c’est un prêt, convenez d’un montant, d’une date, et notez-le. Ce n’est pas de la méfiance, c’est de la clarté."
          ],
          exemple: "Koffi a 60 000 FCFA d’épargne. Son ami lui demande un prêt de 50 000 FCFA.",
          exercices: [
            { type: "qcm", q: "Quelle est la réponse la plus prudente pour Koffi ?",
              options: [
                "Prêter les 50 000 : un ami rembourse toujours",
                "Proposer une somme qu’il peut perdre sans mettre son mois en danger, et la nommer clairement",
                "Emprunter ailleurs pour prêter à son ami"
              ],
              correct: 1,
              explication: "Prêter 50 000 sur 60 000 vide presque sa réserve. Emprunter pour prêter double le risque. Une somme qu’il peut perdre, nommée clairement, protège Koffi et l’ami." },
            { type: "qcm", q: "Pourquoi noter un prêt, même entre proches ?",
              options: ["Pour pouvoir le réclamer devant tout le monde", "Pour que chacun garde la même version du montant et de la date", "Ce n’est pas utile entre proches"],
              correct: 1,
              explication: "La mémoire varie avec le temps. Une note partagée, même un simple message, évite que chacun se souvienne d’un montant différent." }
          ],
          application: { type: "decide", prompt: "Quel montant pourriez-vous prêter ce mois-ci sans vous mettre en difficulté s’il ne revenait pas ? Facultatif." },
          action: { objectif: "Fixer ma limite de prêt", etape: "Décider du montant maximal que je peux prêter ce mois-ci", ressource: "Leçon « Prêt ou cadeau ? »" },
          retenir: "Ne prêtez que ce que vous pourriez donner. Un prêt se nomme et se note."
        },
        {
          id: "p3l3", titre: "L’enveloppe solidarité", duree: 6, dico: "enveloppe",
          situation: { perso: "koffi", texte: "Ce mois-ci, Koffi a reçu cinq demandes. Il a dit oui aux trois premières, et non aux deux suivantes, qui étaient peut-être les plus urgentes." },
          explication: [
            "Décider au cas par cas, c’est laisser l’ordre d’arrivée décider à votre place.",
            "L’enveloppe solidarité est une somme fixée au début du mois, réservée aux proches. Elle a sa place dans le budget, comme un engagement.",
            "Quand l’enveloppe est vide, la réponse devient simple : « ce mois-ci, ma part est déjà donnée ; je peux regarder le mois prochain ». Et quand une urgence grave arrive, on décide en sachant ce qu’elle coûte au reste."
          ],
          exemple: "Koffi gagne 300 000 FCFA par mois et décide d’une enveloppe de 10 %.",
          exercices: [
            { type: "calc", q: "Combien contient l’enveloppe solidarité de Koffi chaque mois, en FCFA ?", reponse: 30000, tolerance: 0,
              explication: "10 % de 300 000 = 30 000 FCFA. Le pourcentage est un choix personnel : l’important est de le décider avant les demandes." },
            { type: "qcm", q: "L’enveloppe est vide le 15. Un cousin demande 10 000 pour une cotisation. Que peut faire Koffi ?",
              options: [
                "Puiser dans le loyer sans rien changer",
                "Expliquer que sa part du mois est donnée et proposer le mois prochain, ou décider consciemment de réduire un autre poste",
                "Ne plus jamais répondre à ce cousin"
              ],
              correct: 1,
              explication: "L’enveloppe n’interdit rien, elle rend le choix visible. Si Koffi donne quand même, il sait quel poste paiera la différence." }
          ],
          application: { type: "decide", prompt: "Quel pourcentage ou quel montant donneriez-vous à votre enveloppe solidarité ? Facultatif." },
          action: { objectif: "Créer mon enveloppe solidarité", etape: "Fixer le montant au début du prochain mois et l’inscrire au budget", ressource: "Leçon « L’enveloppe solidarité »" },
          retenir: "Décider avant les demandes, pas pendant. L’enveloppe rend chaque choix visible."
        },
        {
          id: "p3l4", titre: "Répondre sans se fâcher", duree: 6, dico: "enveloppe",
          situation: { perso: "affoue", texte: "Un neveu écrit à Tantie Affoué pour une somme qu’elle n’a pas. Elle ne veut ni mentir, ni le vexer, ni se mettre en difficulté." },
          explication: [
            "Une réponse respectueuse tient en trois temps : reconnaître la demande, dire ce qu’on peut, proposer une suite.",
            "Dire ce qu’on peut n’est pas se justifier. Pas besoin d’exposer tout son budget.",
            "Une alternative compte : une plus petite somme, une date, un coup de main non financier, une mise en relation."
          ],
          exemple: null,
          exercices: [
            { type: "qcm", q: "Quelle réponse suit les trois temps ?",
              options: [
                "« Je n’ai rien, arrête de me demander. »",
                "« J’ai bien reçu ton message et je comprends que c’est important. Ce mois-ci, je peux t’envoyer 10 000. Pour le reste, on en reparle le 5 ? »",
                "« Oui bien sûr », puis ne plus répondre."
              ],
              correct: 1,
              explication: "Elle reconnaît la demande, dit ce qui est possible et propose une suite datée. La première ferme le lien ; la troisième crée une promesse impossible à tenir." },
            { type: "classer", q: "À quel temps de la réponse correspond chaque phrase ?", categories: ["Reconnaître", "Dire ce que je peux", "Proposer une suite"],
              items: [
                { t: "« Je vois que la rentrée te met en difficulté. »", c: 0 },
                { t: "« Je peux payer les fournitures, pas l’inscription. »", c: 1 },
                { t: "« Rappelle-moi le 5, je verrai avec ma paie. »", c: 2 }
              ],
              explication: "Chaque temps a son rôle : montrer qu’on a entendu, poser sa limite, garder la porte ouverte." }
          ],
          application: { type: "decide", prompt: "Écrivez, en trois phrases, la réponse que vous aimeriez savoir donner à la prochaine demande." },
          action: { objectif: "Préparer ma réponse type", etape: "Rédiger une réponse en trois temps et la garder dans mon téléphone", ressource: "Challenge « Préparer une réponse à une demande d’aide »" },
          retenir: "Reconnaître, dire ce que je peux, proposer une suite."
        }
      ]
    }
  ],

  challenges: [
    {
      id: "c_poste7", parcours: "p1", type: "journal", titre: "Suivre un poste de dépenses", duree: "7 jours", jours: 7,
      objectif: "Retrouver et interpréter le total réel d’un poste de dépenses.",
      action: "Chaque soir, noter ce que vous avez dépensé sur le poste choisi.",
      frequence: "Une saisie par jour, 30 secondes",
      critere: "Au moins 5 jours renseignés sur 7, puis un bilan écrit.",
      champs: [{ k: "montant", label: "Dépense du jour (FCFA)" }],
      poste: true,
      bilan: ["Le total vous surprend-il ?", "Qu’avez-vous appris sur ce poste ?", "Que voulez-vous essayer ensuite ?"]
    },
    {
      id: "c_frais7", parcours: "p1", type: "journal", titre: "Repérer les frais de mobile money", duree: "7 jours", jours: 7,
      objectif: "Distinguer ce qu’on transfère de ce qu’on paie en frais.",
      action: "Chaque soir, relire les messages du jour et noter transferts et frais séparément.",
      frequence: "Une saisie par jour",
      critere: "Au moins 5 jours renseignés sur 7, puis un bilan écrit.",
      champs: [{ k: "transfert", label: "Transferts envoyés (FCFA)" }, { k: "frais", label: "Frais payés (FCFA)" }],
      bilan: ["Combien de frais sur la semaine ?", "Quelle opération coûte le plus cher ?", "Que pourriez-vous faire autrement ?"]
    },
    {
      id: "c_budget", parcours: "p2", type: "etapes", titre: "Comparer son budget au réel", duree: "Un mois",
      objectif: "Identifier les écarts entre le prévu et le réel, et ajuster.",
      action: "Remplir le prévu au début du mois, le réel au fil des semaines, puis faire le bilan.",
      frequence: "Une saisie par semaine",
      critere: "Prévu rempli, réel rempli, bilan écrit.",
      etapes: ["Lister mes engagements avec leurs dates", "Estimer mes besoins courants", "Fixer mon épargne et mes choix libres", "Noter le réel de la semaine 1", "Noter le réel de la semaine 2", "Noter le réel des semaines 3 et 4", "Calculer les écarts poste par poste"],
      bilan: ["Quel poste s’éloigne le plus du prévu ?", "Quelle en est la cause ?", "Quel ajustement pour le mois prochain ?"]
    },
    {
      id: "c_reponse", parcours: "p3", type: "etapes", titre: "Préparer une réponse à une demande d’aide", duree: "Une séance",
      objectif: "Formuler une réponse adaptée à ses limites.",
      action: "Choisir une demande réelle ou probable et rédiger une réponse en trois temps.",
      frequence: "Une séance de 10 minutes",
      critere: "Une réponse rédigée et un bilan écrit.",
      etapes: ["Choisir une demande (réelle ou probable)", "Nommer : aide, prêt ou engagement ?", "Vérifier mon enveloppe ou ma limite", "Écrire la phrase « je reconnais »", "Écrire la phrase « je peux »", "Écrire la phrase « je propose »"],
      bilan: ["Comment vous sentez-vous avec cette réponse ?", "Qu’est-ce qui a été le plus difficile ?", "Quand pensez-vous l’utiliser ?"]
    }
  ],

  dico: [
    { id: "flux", mot: "Flux", def: "Ce qui passe pendant une période : un salaire par mois, un loyer par mois. Flux net = entrées − sorties.", ex: "600 000 d’entrées − 560 000 de sorties = 40 000 FCFA de flux net sur le mois.", num: "Dico n° 004" },
    { id: "stock", mot: "Stock", def: "Ce que vous possédez, ou ce que vous devez, à une date précise.", ex: "40 000 le 1er + 300 000 − 280 000 = 60 000 FCFA le 31.", num: "Dico n° 005" },
    { id: "patrimoine", mot: "Patrimoine net", def: "Ce que vous possédez moins ce que vous devez, à une date donnée.", ex: "Possédé − dû = patrimoine net.", num: "Dico n° 003" },
    { id: "budget", mot: "Budget", def: "Un plan décidé à l’avance pour dire ce que chaque franc devra faire, puis comparé au réel.", ex: "Écart = réel − prévu.", num: "" },
    { id: "frais", mot: "Frais", def: "Ce que coûte une opération, en plus du montant transféré. Une sortie qui ne revient à personne de votre entourage.", ex: "Envoyer 20 000 et voir son solde baisser de 20 200 : 200 FCFA de frais.", num: "" },
    { id: "enveloppe", mot: "Enveloppe", def: "Une somme fixée à l’avance pour un usage précis. Quand elle est vide, le choix suivant devient visible.", ex: "Enveloppe solidarité de 10 % sur 300 000 = 30 000 FCFA par mois.", num: "" },
    { id: "epargne", mot: "Épargne", def: "La part du revenu qui n’est pas dépensée et qui reste disponible. Elle augmente votre stock.", ex: "Se payer en premier : placer l’épargne avec les engagements.", num: "" },
    { id: "tontine", mot: "Tontine", def: "Un groupe où chacun cotise régulièrement et reçoit à son tour la somme collectée.", ex: "10 cotisations de 100 000, un tour reçu de 1 000 000 : flux net de 0 sur la période.", num: "" }
  ],

  explorer: [
    { titre: "Le site efa.africa", detail: "La plateforme d’éducation financière EFA", url: "https://efa.africa/" , mode: "app" },
    { titre: "Diagnostic approfondi", detail: "Six dimensions, un profil, une priorité", url: "https://efa.africa/diagnostic", cat: "Outils" , mode: "app" },
    { titre: "Où est passé mon argent ?", detail: "L’outil pour retrouver ses dépenses du mois", url: "https://efa.africa/ou-est-passe-mon-argent", cat: "Outils" , mode: "app" },
    { titre: "Mes outils", detail: "Tous les simulateurs EFA", url: "https://efa.africa/outils", cat: "Outils" , mode: "app" },
    { titre: "Le cercle et la spirale", detail: "L’idée au cœur d’EFA", url: "https://efa.africa/cercle-spirale", cat: "Méthode" , mode: "app" },
    { titre: "Études et méthode", detail: "Méthode, sources et limites", url: "https://efa.africa/methode#etudes", cat: "Méthode" , mode: "app" },
    { titre: "Guide « Construire sa stabilité financière »", detail: "Gratuit, contre quelques réponses", url: "https://forms.gle/5CsRvJYxoFArJbNa8", cat: "Guides" , mode: "app" },
    { titre: "Enquête « L’argent de la tontine »", detail: "Aidez-nous à documenter la tontine", url: "https://forms.gle/Sczi5p58q9ijuKqp9", cat: "Études" , mode: "app" },
    { titre: "EFA sur YouTube", detail: "Min’Fin, Dico et vidéos", url: "https://www.youtube.com/@efaeducationfinanciereafrique", cat: "Vidéos" , mode: "ext", appli: "YouTube" },
    { titre: "EFA sur TikTok", detail: "Le Dico, Min’Fin, Instant’Fin, La Tribune", url: "https://www.tiktok.com/@efa.afrique", cat: "Vidéos" , mode: "ext", appli: "TikTok" },
    { titre: "Les Tribunes d’Élysée Johnson", detail: "Une idée forte chaque samedi", url: "https://educationfinanciereafrique.substack.com", cat: "Tribunes" , mode: "tribunes" },
    { titre: "EFA Community", detail: "Le groupe WhatsApp, rendez-vous le jeudi à 19 h", url: "https://chat.whatsapp.com/Dm1l569bAwlAa1honQiV3a", cat: "Communauté" , mode: "ext", appli: "WhatsApp" },
    { titre: "À propos de l’auteur", detail: "Élysée Johnson", url: "https://efa.africa/auteur", cat: "Méthode" , mode: "app" }
  ],

  diagnostic: {
    version: "orientation-1.0",
    questions: [
      { id: "q1", q: "À la fin du mois, savez-vous combien il vous reste ?", options: ["Oui, à peu près", "Pas vraiment", "Je n’en ai aucune idée"] },
      { id: "q2", q: "Décidez-vous de vos dépenses avant le début du mois ?", options: ["Oui, j’ai un budget", "Parfois, dans ma tête", "Non, au fil des jours"] },
      { id: "q3", q: "Les demandes d’aide de vos proches pèsent-elles sur votre mois ?", options: ["Rarement", "Assez souvent", "Très souvent"] },
      { id: "q4", q: "Vos revenus sont-ils réguliers ?", options: ["Oui, un montant fixe", "Ils varient d’un mois à l’autre", "Je n’ai pas de revenu en ce moment"] },
      { id: "q5", q: "Qu’est-ce qui vous préoccupe le plus aujourd’hui ?", options: ["Je ne sais pas où passe mon argent", "Je n’arrive pas à tenir un plan", "Je donne plus que je ne peux", "Je prépare un projet"] }
    ]
  }
};

/* Bandes dessinées des situations (personnage, expression, bulle) et coups de pouce des calculs.
   Expressions disponibles : neutre, joie, reflexion, surprise, inquietude, determination. */
window.EFA_CONTENU.bd = {
  p1l1: [
    { narr: "Le 2 du mois, jour de paie." },
    { p: "koffi", e: "joie", t: "Salaire, loyer de la chambre, livraisons du week-end… Ce mois-ci, je mets de côté !" },
    { narr: "Le 28." },
    { p: "koffi", e: "surprise", t: "Quoi ? Il ne me reste presque rien ? Mais où est passé tout cet argent ?" }
  ],
  p1l2: [
    { p: "bamba", e: "neutre", t: "Koffi, tu gagnes combien ?" },
    { p: "koffi", e: "joie", t: "450 000 par mois, Tonton !" },
    { p: "bamba", e: "reflexion", t: "Et tu as combien ?" },
    { p: "koffi", e: "inquietude", t: "Euh… Ce n’est pas la même question, hein ?" }
  ],
  p1l3: [
    { p: "koffi", e: "reflexion", t: "Loyer, crédit, marché… J’ai tout compté. Il me manque quand même 35 000." },
    { narr: "Il relit ses messages de mobile money." },
    { p: "koffi", e: "surprise", t: "Frais de retrait, frais de transfert, crédit téléphone… Ça en fait, des petites lignes !" }
  ],
  p1l4: [
    { p: "koffi", e: "determination", t: "À partir de demain, je note tout. Chaque franc, tous les jours !" },
    { p: "bamba", e: "joie", t: "Doucement. Un seul poste, sept jours. Le transport, par exemple." },
    { p: "koffi", e: "reflexion", t: "Et si j’oublie un jour ?" },
    { p: "bamba", e: "neutre", t: "Tu écris « non noté ». Pas zéro. Et tu ne te grondes pas." }
  ],
  p2l1: [
    { p: "koffi", e: "joie", t: "Le mois dernier, j’ai tout noté. Je sais où est passé mon argent !" },
    { p: "koffi", e: "inquietude", t: "Mais je l’ai su trop tard…" },
    { p: "bamba", e: "joie", t: "Alors ce mois-ci, décide avant de dépenser. C’est ça, un budget." }
  ],
  p2l2: [
    { p: "bamba", e: "neutre", t: "Trois cases : ce que tu as promis, ce dont tu as besoin, ce que tu choisis." },
    { p: "koffi", e: "reflexion", t: "Et l’épargne, je la mets où ?" },
    { p: "bamba", e: "determination", t: "Avec les promesses. Une promesse envers toi-même." }
  ],
  p2l3: [
    { p: "affoue", e: "reflexion", t: "Au marché, un mois je vends bien, le suivant beaucoup moins. Le budget, c’est pour les salariés." },
    { p: "koffi", e: "reflexion", t: "Et si tu faisais ton budget sur ton plus petit mois, Tantie ?" },
    { p: "affoue", e: "surprise", t: "Hum… Et le surplus des bons mois, alors ?" }
  ],
  p2l4: [
    { p: "koffi", e: "joie", t: "J’ai mon prévu et mon réel ! Je me félicite ou je me gronde ?" },
    { p: "bamba", e: "neutre", t: "Ni l’un ni l’autre. Calcule d’abord. Ensuite seulement, explique." }
  ],
  p3l1: [
    { narr: "Il y a trois mois." },
    { p: "koffi", e: "neutre", t: "Mon cousin m’a dit : « Avance-moi 50 000, je te rends à la fin du mois. »" },
    { narr: "Aujourd’hui." },
    { p: "koffi", e: "inquietude", t: "Personne n’en parle. Pour lui, c’était une aide. Pour moi, c’était un prêt…" }
  ],
  p3l2: [
    { p: "koffi", e: "reflexion", t: "Mon ami me demande 50 000. J’ai 60 000 d’épargne…" },
    { p: "affoue", e: "determination", t: "Avant de prêter à la famille, je me demande toujours : est-ce que je peux vivre sans revoir cet argent ?" }
  ],
  p3l3: [
    { p: "koffi", e: "inquietude", t: "Cinq demandes ce mois-ci. J’ai dit oui aux trois premières…" },
    { p: "koffi", e: "surprise", t: "Et non aux deux dernières. Elles étaient peut-être les plus urgentes !" },
    { p: "bamba", e: "reflexion", t: "Tu as laissé l’ordre d’arrivée décider à ta place." }
  ],
  p3l4: [
    { p: "affoue", e: "inquietude", t: "Mon neveu me demande une somme que je n’ai pas." },
    { p: "affoue", e: "reflexion", t: "Je ne veux ni mentir, ni le vexer, ni me mettre en difficulté. Comment je lui réponds ?" }
  ]
};
window.EFA_CONTENU.guide = { p2l3: "affoue", p3l2: "affoue", p3l4: "affoue" };
window.EFA_CONTENU.aide = {
  p1l1: { 0: "Additionnez d’abord les entrées, puis les sorties. Ensuite : entrées − sorties." },
  p1l2: { 0: "Ce qu’il y avait au départ + ce qui entre − ce qui sort." },
  p1l4: { 0: "Divisez le total par le nombre de jours notés, pas par 7." },
  p2l3: { 0: "Regardez les trois mois et gardez le plus faible." },
  p2l4: { 0: "Transport : 52 000 − 40 000. Nourriture : 110 000 − 120 000. Sorties : 0. Additionnez les trois écarts." },
  p3l3: { 0: "10 %, c’est diviser par 10." }
};

/* Les Tribunes, lues dans l'appli. Même liste que tribunes.js du site : ajouter la nouvelle EN HAUT. */
window.EFA_CONTENU.tribunes = [
  { n: 5, date: "2026-10-17", titre: "Avec nos téléphones, nous pouvons construire des usines", idee: "Après le paiement, le capital\u00a0: le mobile money sait rassembler des millions de petites sommes\u00a0; l’étape suivante est de les orienter vers des actifs productifs.", lien: "https://educationfinanciereafrique.substack.com/p/tribune-5-avec-nos-telephones-nous" },
  { n: 4, date: "2026-10-03", titre: "Que construisez-vous avec tout l’argent qui passe entre vos mains\u00a0?", idee: "Ce qui passe entre nos mains n’est pas ce qui reste\u00a0: on peut gagner beaucoup, longtemps, sans bâtir de patrimoine.", lien: "https://educationfinanciereafrique.substack.com/p/tribune-4-que-construisez-avec" },
  { n: 3, date: "2026-09-26", titre: "Si tout le monde veut être premier, il n’y a plus de tontine", idee: "Le premier reçoit la liquidité du groupe, le dernier lui prête du temps\u00a0: chaque rang a une valeur.", lien: "https://educationfinanciereafrique.substack.com/p/tribune-3-si-tout-le-monde-veut-etre" },
  { n: 2, date: "2026-09-19", titre: "Recevoir un million ne vous enrichit pas d’un million", idee: "Un encaissement n’est pas un enrichissement\u00a0: le même million peut donner quatre bilans différents.", lien: "https://educationfinanciereafrique.substack.com/p/tribune-2-recevoir-un-million-ne" },
  { n: 1, date: "2026-09-12", titre: "La tontine n’est pas de l’épargne", idee: "C’est un décalage de trésorerie\u00a0: la tontine déplace l’argent dans le temps\u00a0; elle ne crée pas de capital par elle-même.", lien: "https://educationfinanciereafrique.substack.com/p/la-tontine-nest-pas-de-lepargne" }
];
