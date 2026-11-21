#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Le catalogue des questions d'EFA : la source qui permet à la zone de question de composer une réponse.

Une question = une fiche : thème, réponse en bref, l'outil pour l'appliquer à son cas, une ou deux pages à lire.
La page prochain-pas.html rapproche ce que le visiteur écrit de la fiche la plus proche, puis compose l'écran :
ce que j'ai compris → la réponse en bref → l'outil → à lire → questions voisines → le reste d'EFA.
Ajouter une question, c'est ajouter une ligne ici. Aucune page à écrire.

  python3 scripts/question/catalogue.py     écrit data/questions/catalogue.json (et refuse une page qui n'existe pas)
"""
import json, os, re, sys

RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Les outils : clé → (page, nom, promesse en une ligne, bouton)
O = {
 'voirclair': ('ou-est-passe-mon-argent.html', 'Voir clair', 'Où est passé mon argent ?', 'Voir où va mon argent'),
 'budget': ('outil-budget.html', 'Mon budget à zéro', 'Une mission pour chaque franc', 'Faire mon budget'),
 'mobile': ('budget-mobile-money.html', 'Budget et mobile money', 'Ce que mes transferts et retraits me coûtent', 'Compter mes frais'),
 'poches': ('separer-les-poches.html', 'Séparer les poches', 'L’argent de la maison, de l’activité, des projets', 'Séparer mes poches'),
 'epargner': ('epargner.html', 'Épargner', 'Trouver la somme que je peux mettre de côté', 'Trouver ma capacité d’épargne'),
 'reserve': ('ou-garder-sa-reserve.html#calcul', 'Ma réserve de sécurité', 'Combien garder, et où', 'Calculer ma réserve'),
 'somme': ('cercle-spirale.html', 'Quand l’argent arrive', 'Combien garder, combien faire grandir', 'Répartir cette somme'),
 'tontine': ('tontine-decider-avant-de-recevoir.html', 'Que faire de sa tontine ?', 'Décider avant de recevoir', 'Préparer mon tour'),
 'tontine-avant': ('avant-de-cotiser.html', 'Avant de cotiser', 'Les questions à poser à une tontine', 'Vérifier ma tontine'),
 'etudes': ('etudes-enfants-heritage.html', 'Les études des enfants', 'Financer sans se mettre en difficulté', 'Préparer les études'),
 'retraite': ('preparer-ma-retraite.html', 'Préparer ma retraite', 'Ce que j’aurai, ce qu’il me faudra', 'Simuler ma retraite'),
 'famille': ('solidarite-assureur-de-la-famille.html', 'La solidarité familiale', 'Aider sans s’épuiser', 'Fixer ma part pour la famille'),
 'papiers': ('papiers-famille.html', 'Les papiers de la famille', 'Ce que les miens doivent pouvoir retrouver', 'Mettre mes papiers en ordre'),
 'dette': ('renegocier-une-dette.html', 'Renégocier une dette', 'Quoi demander, à qui', 'Préparer ma renégociation'),
 'credit': ('cout-total-credit.html#calcul', 'Le coût total d’un crédit', 'Ce que je rembourse vraiment', 'Calculer le coût'),
 'preter': ('preter-a-un-proche.html', 'Prêter à un proche', 'Prêter, donner ou refuser', 'Décider pour ce prêt'),
 'declic': ('generateur-de-projet.html', 'Déclic', 'Trouver mon idée de business', 'Trouver mon idée'),
 'plan': ('mon-business-plan-tient-il.html', 'Mon business plan tient-il ?', 'Tester mon projet avant de dépenser', 'Tester mon projet'),
 'rentable': ('atelier-activite-gagne-t-elle.html', 'Mon activité gagne-t-elle ?', 'Ce qui reste vraiment', 'Calculer mon vrai gain'),
 'caisse': ('atelier-ou-est-l-argent-de-mon-activite.html', 'Où est l’argent de mon activité ?', 'Retrouver ce que la caisse a avalé', 'Retrouver mon argent'),
 'salaire': ('salaire-fixe-activite.html', 'Me verser un salaire', 'Un salaire fixe depuis mon activité', 'Fixer mon salaire'),
 'valeur': ('valoriser-mon-entreprise.html', 'Combien vaut mon entreprise ?', 'Une estimation dès 1 min', 'Estimer mon entreprise'),
 'banque': ('atelier-ma-banque-va-t-elle-me-preter.html', 'Ma banque va-t-elle me prêter ?', 'Ce que le banquier regarde', 'Préparer mon dossier'),
 'investir': ('investir.html', 'Toutes les façons d’investir', 'Du dépôt à terme à la Bourse', 'Comparer les placements'),
 'horizon': ('bourse-projets.html', 'J’investis pour quel projet ?', 'Le bon placement selon la date', 'Choisir selon ma date'),
 'mabrvm': ('ma-brvm.html', 'Ma BRVM', 'Et si j’avais investi ?', 'Faire la simulation'),
 'mensuel': ('ma-brvm.html#mensuel', 'Ma BRVM · Investir chaque mois', 'Un petit montant, régulièrement', 'Simuler mon versement'),
 'duree': ('ma-brvm.html#duree', 'Ma BRVM · Combien de temps garder ?', 'Mes chances selon la durée', 'Voir selon ma durée'),
 'dividendes': ('ma-brvm.html#dividendes', 'Ma BRVM · Mes dividendes', 'Mon revenu, année par année', 'Voir les dividendes'),
 'fiche': ('ma-brvm.html?outil=fiche', 'Ma BRVM · Fiche décision', 'Sept repères par société', 'Ouvrir une fiche'),
 'criteres': ('ma-brvm.html#criteres', 'Ma BRVM · Trier par critères', 'De 48 titres à une courte liste', 'Trier les sociétés'),
 'portefeuille': ('ma-brvm.html#portefeuille', 'Ma BRVM · Mon portefeuille', 'Mon résultat, sa solidité', 'Suivre mon portefeuille'),
 'acheter': ('acheter-des-actions.html', 'Acheter des actions', 'Le chemin, étape par étape', 'Voir comment acheter'),
 'sgi': ('sgi-comparer.html', 'Comparer des SGI', 'Frais, services, accès', 'Comparer les SGI'),
 'frais': ('etude-frais-bourse.html', 'Les frais en Bourse', 'Ce que coûte un aller-retour', 'Calculer mes frais'),
 'premiers': ('premiers-pas-bourse.html', 'Mes premiers pas en Bourse', 'Comprendre avant d’acheter', 'Faire mes premiers pas'),
 'societe': ('atelier-lire-societe-cotee.html', 'Lire une société cotée', 'Les chiffres qui comptent', 'Apprendre à lire une société'),
 'baisse': ('jeu-portefeuille-baisse.html', 'Mon portefeuille face à la baisse', 'Que ferais-je si ça baissait ?', 'Me tester'),
 'obligations': ('dat-emprunts-etat.html#calcul', 'DAT et emprunts d’État', 'Ce que rapporte un placement à revenu fixe', 'Faire le calcul'),
 'promesse': ('atelier-rendement-garanti.html', 'Rendement garanti : que vérifier ?', 'Les questions qui démasquent', 'Vérifier cette promesse'),
 'terrain': ('acheter-un-terrain.html', 'Acheter un terrain', 'Sans se faire avoir', 'Vérifier avant d’acheter'),
 'chantier': ('budget-chantier.html', 'Construire par étapes', 'Le budget du chantier', 'Bâtir mon budget chantier'),
 'attendre': ('atelier-acheter-construire-attendre.html', 'Acheter, construire ou attendre', 'Comparer les trois chemins', 'Comparer mes options'),
 'liberte': ('liberte-financiere.html', 'Ma liberté financière', 'Le montant qui me rend libre', 'Calculer mon chiffre'),
 'reste': ('mon-vrai-reste.html', 'Mon vrai reste', 'Ce qu’il me reste après mes obligations', 'Calculer mon vrai reste'),
 'dettes': ('mes-dettes.html', 'Mes dettes classées', 'Dans quel ordre en sortir', 'Classer mes dettes'),
 'aider': ('puis-je-aider.html', 'Puis-je aider ce mois-ci ?', 'Aider sans se mettre en difficulté', 'Voir ce que je peux donner'),
 'idee': ('mon-idee-test.html', 'Mon idée vaut-elle un test ?', 'Des clients avant des dépenses', 'Tester mon idée'),
 'patrimoine': ('mon-patrimoine.html', 'Mon patrimoine', 'Aujourd’hui, et dans dix ans', 'Voir mon patrimoine'),
 'promesse2': ('promesse-credible.html', 'Cette promesse est-elle crédible ?', 'Un gain annoncé, ramené à un an', 'Examiner cette promesse'),
 'diagnostic': ('diagnostic.html', 'Mon diagnostic financier', 'Savoir d’où je pars', 'Faire mon diagnostic'),
}

T1, T2, T3, T4, T5, T6 = ('Mon argent au quotidien', 'Épargner et se protéger', 'Dettes et crédit', 'Gagner plus et lancer une activité',
                          'Investir et comprendre la Bourse (BRVM)', 'Construire sa richesse et son patrimoine')

# (thème, question, outil, [pages à lire], réponse en bref)
Q = [
(T1, "Où passe mon argent chaque mois ?", 'voirclair', ['atelier-ou-passe-mon-argent', 'outil-budget'],
 "On ne le sait pas tant qu’on ne l’a pas noté. Pendant un mois, classez chaque sortie en trois familles : ce qui est obligatoire, ce qui est choisi, ce qui part pour les autres. Le plus souvent, ce ne sont pas les grosses dépenses qui surprennent, mais l’addition des petites. Voir clair est le premier geste de celui qui veut bâtir."),
(T1, "Pourquoi mon salaire finit-il avant la fin du mois ?", 'voirclair', ['atelier-budget-qui-tient', 'engagements-et-exceptions'],
 "Rarement parce qu’il est trop petit, presque toujours parce qu’il n’a pas de plan le jour où il arrive. Les charges fixes, les imprévus et la famille se servent d’abord ; vous prenez ce qui reste. Inversez l’ordre : décidez de la répartition avant le premier retrait."),
(T1, "Je gagne 300 000 F par mois : comment mieux gérer ?", 'budget', ['construire-son-budget', 'atelier-budget-zero'],
 "Donnez une mission à chaque franc avant de le dépenser : charges, famille, épargne, plaisir. Avec 300 000 F, viser 30 000 F mis de côté dès le jour de paie change déjà la trajectoire en un an. Le bon budget n’est pas le plus strict, c’est celui que vous tenez."),
(T1, "Combien me reste-t-il vraiment après mes charges ?", 'reste', ['outil-budget', 'engagements-et-exceptions'],
 "Ce qui reste, c’est le revenu moins les engagements que vous ne pouvez pas éviter : loyer, transport, scolarité, crédit, part de la famille. Ce chiffre est votre vraie marge de manœuvre, et c’est sur lui que se construit tout le reste : épargne, projet, investissement."),
(T1, "Comment faire un budget quand je ne connais pas toutes mes dépenses ?", 'budget', ['atelier-ou-passe-mon-argent', 'construire-son-budget'],
 "Commencez par ce que vous connaissez : les charges fixes. Pour le reste, fixez une enveloppe par semaine et notez seulement quand elle est vide. Au bout de deux mois, vous connaîtrez vos vrais chiffres. Un budget approximatif tenu vaut mieux qu’un budget parfait abandonné."),
(T1, "Comment gérer un revenu qui change chaque mois ?", 'budget', ['salaire-fixe-activite', 'atelier-reserve-securite'],
 "Calez votre train de vie sur votre plus mauvais mois, pas sur le meilleur. Les bons mois, versez le surplus dans une réserve qui complète les mois faibles : vous vous fabriquez ainsi un salaire régulier. La régularité se construit, même quand le revenu ne l’est pas."),
(T1, "Comment arrêter les petites dépenses qui vident mon compte ?", 'voirclair', ['budget-mobile-money', 'atelier-budget-qui-tient'],
 "On ne les supprime pas, on les plafonne. Donnez-vous une somme par semaine pour ces dépenses, retirée ou isolée sur un compte à part : quand elle est finie, c’est fini. Ce qui fuit sans qu’on le voie cesse de fuir dès qu’on lui donne une limite."),
(T1, "Combien me coûtent mes transferts et retraits mobile money ?", 'mobile', ['atelier-mobile-money-frais'],
 "Souvent plus qu’on ne croit, parce que les frais sont petits et répétés. Additionnez-les sur un mois : dix retraits et quelques envois peuvent représenter plusieurs milliers de francs. Regrouper ses retraits et payer directement quand c’est possible réduit la note sans rien changer à votre vie."),
(T1, "Comment répartir mon salaire dès qu’il arrive ?", 'budget', ['separer-les-poches', 'atelier-budget-zero'],
 "Le jour même, dans cet ordre : d’abord vous (épargne), puis les charges fixes, puis la part de la famille, enfin ce qui reste pour vivre. Séparer ces poches sur des comptes ou des porte-monnaie différents rend la règle facile à tenir."),
(T1, "Que faire quand mes dépenses dépassent mes revenus ?", 'reste', ['atelier-eviter-le-surendettement', 'renegocier-une-dette'],
 "D’abord arrêter de combler l’écart par de nouvelles dettes. Ensuite trier : ce qui est vital, ce qui peut attendre, ce qui peut se renégocier. Enfin chercher le franc de plus, même petit. On sort de cette situation par étapes, et la première est de mesurer l’écart exact."),
(T1, "Dois-je réduire mes dépenses ou chercher à gagner plus ?", 'voirclair', ['investir-gagner-plus', 'generateur-de-projet'],
 "Les deux, mais dans l’ordre. Réduire a une limite ; gagner plus n’en a pas. Commencez par dégager une petite marge en dépensant mieux, puis utilisez-la pour bâtir un revenu de plus : c’est cette marge qui finance le premier pas d’une activité."),
(T1, "Comment garder de l’argent pour moi quand j’aide ma famille ?", 'aider', ['atelier-preter-ou-donner', 'separer-les-poches'],
 "En décidant à l’avance de la part de la famille, comme une charge fixe, plutôt qu’en répondant à chaque demande. Une enveloppe mensuelle connue protège à la fois les vôtres et votre avenir : celui qui s’épuise ne peut plus aider personne."),
(T1, "Combien puis-je donner à mes proches sans me mettre en difficulté ?", 'aider', ['atelier-preter-ou-donner', 'preter-a-un-proche'],
 "Ce que vous pouvez donner sans toucher à vos charges, à votre réserve ni à votre épargne. Fixez ce montant une fois, par mois, et tenez-vous-y. La bonne règle : ne donnez que ce que vous êtes prêt à ne jamais revoir."),
(T1, "Comment gérer mon argent quand je reçois plusieurs revenus ?", 'poches', ['outil-budget', 'salaire-fixe-activite'],
 "Faites-les tous arriver au même endroit, puis répartissez à partir de là. Plusieurs revenus dispersés donnent l’impression de gagner peu ; réunis, ils montrent votre vraie capacité. Gardez à part l’argent d’une activité : il n’est pas encore le vôtre."),
(T1, "Je n’arrive jamais à garder d’argent : par quoi commencer ?", 'epargner', ['atelier-reserve-securite', 'ou-est-passe-mon-argent'],
 "Par un montant si petit qu’il ne peut pas échouer, mis de côté le jour où l’argent arrive, sur un compte que vous ne voyez pas tous les jours. L’habitude compte plus que la somme. Quand elle est installée, on augmente."),

(T2, "Comment épargner avec un petit salaire ?", 'epargner', ['atelier-reserve-securite', 'tontine'],
 "En épargnant d’abord, pas avec ce qui reste. Même 5 000 F mis de côté le jour de paie valent mieux que 50 000 F promis pour plus tard. Une tontine bien choisie ou un virement automatique aident à tenir. La richesse commence par cet écart régulier."),
(T2, "Combien devrais-je mettre de côté chaque mois ?", 'epargner', ['ou-garder-sa-reserve', 'liberte-financiere'],
 "Autant que vous pouvez tenir tous les mois sans exception. Un repère courant est un dixième du revenu, mais commencez plus bas s’il le faut et augmentez à chaque hausse de revenu. Le bon montant est celui que vous ne reprenez pas le 20 du mois."),
(T2, "Faut-il épargner avant de rembourser mes dettes ?", 'dettes', ['atelier-sortir-dettes', 'atelier-reserve-securite'],
 "Constituez d’abord une petite réserve, l’équivalent de quelques semaines de dépenses, pour ne pas emprunter au premier imprévu. Ensuite, attaquez la dette la plus chère. Épargner à faible rendement pendant qu’une dette coûte cher revient à perdre de l’argent."),
(T2, "Où garder mon épargne : banque, mobile money ou tontine ?", 'reserve', ['epargner', 'tontine'],
 "Selon ce à quoi elle sert. La réserve d’urgence doit être disponible et à l’abri : compte d’épargne ou porte-monnaie séparé. L’argent d’un projet daté peut passer par une tontine sérieuse ou un dépôt à terme. Jamais tout au même endroit, jamais mélangé à l’argent du quotidien."),
(T2, "Combien faut-il avoir pour faire face à une urgence ?", 'reserve', ['atelier-reserve-securite'],
 "Visez d’abord un mois de dépenses indispensables, puis trois. Avec un revenu irrégulier ou des personnes à charge, allez vers six. Cette réserve ne rapporte presque rien et c’est normal : son rôle est de vous éviter d’emprunter ou de vendre au mauvais moment."),
(T2, "Comment constituer une réserve de sécurité ?", 'reserve', ['atelier-reserve-securite', 'epargner'],
 "Par petits versements automatiques, sur un compte à part, sans carte ni accès facile. Fixez une cible simple, un mois de dépenses, et fêtez-la avant de viser plus. Chaque rentrée exceptionnelle peut en déposer une part."),
(T2, "J’ai reçu une prime : qu’en faire ?", 'somme', ['atelier-grosse-somme', 'ou-garder-sa-reserve'],
 "Attendez quelques jours avant de décider. Puis partagez-la en trois : une part pour solder ce qui coûte cher ou compléter votre réserve, une part pour faire grandir, une petite part pour vous faire plaisir. Une prime bien répartie fait avancer plusieurs projets à la fois."),
(T2, "Que faire avec 1 million de francs CFA ?", 'somme', ['investir', 'generateur-de-projet'],
 "Tout dépend de ce qui existe déjà autour. Sans réserve ni dette réglée, commencez par là. Ensuite, un million peut lancer une petite activité testée, ou être placé selon la date à laquelle vous en aurez besoin. La seule mauvaise réponse est de le laisser fondre dans le quotidien."),
(T2, "Comment éviter de dépenser une grosse somme trop vite ?", 'somme', ['atelier-grosse-somme', 'tontine-decider-avant-de-recevoir'],
 "Décidez de son usage avant qu’elle n’arrive, et mettez-la hors de portée le jour même : compte séparé, dépôt à terme, part confiée à un projet précis. L’argent sans destination trouve toujours preneur, souvent quelqu’un d’autre que vous."),
(T2, "Est-ce une bonne idée de garder tout mon argent sur mon compte courant ?", 'reserve', ['investir', 'dat-emprunts-etat'],
 "Pour l’argent du mois, oui. Pour le reste, non : il ne rapporte rien, perd de la valeur avec la hausse des prix et reste trop facile à dépenser. Gardez sur le compte courant ce qui sert à vivre, isolez la réserve, et faites travailler ce dont vous n’avez pas besoin avant longtemps."),
(T2, "Ma tontine m’aide-t-elle réellement à épargner ?", 'tontine-avant', ['choisir-son-rang-tontine', 'etude-tontine-en-chiffres'],
 "Oui si elle vous oblige à mettre de côté ce que vous n’auriez pas gardé seul. Elle ne rapporte pas d’intérêt et votre rang change tout : recevoir tôt, c’est un crédit ; recevoir tard, c’est une épargne. Sa force est la discipline du groupe, à condition qu’il soit sérieux."),
(T2, "Que faire de l’argent quand vient mon tour de tontine ?", 'tontine', ['cercle-spirale', 'atelier-tontine-spirale'],
 "Le décider avant de le recevoir. L’argent d’un tour est une somme rare : affectez-la à ce qui dure, une dette soldée, un stock, un terrain en cours de paiement, un placement, et gardez-en une part pour continuer à cotiser. C’est ainsi qu’une tontine devient une marche de plus."),
(T2, "Comment épargner pour les études de mes enfants ?", 'etudes', ['atelier-etudes-enfant', 'dat-emprunts-etat'],
 "En partant de la date et du coût : combien, dans combien d’années. Divisez, et versez chaque mois sur un support séparé. Plus vous commencez tôt, plus le montant mensuel est léger. Pour une échéance proche, privilégiez un placement sûr ; pour une échéance lointaine, une part peut viser plus haut."),
(T2, "Comment préparer ma retraite si je travaille à mon compte ?", 'retraite', ['atelier-retraite-sans-pension', 'atelier-retraite-droits'],
 "Personne ne cotisera à votre place : il faut vous fabriquer votre propre pension. Versez chaque mois une part fixe de votre revenu dans des placements de long terme, et renseignez-vous sur l’assurance volontaire de votre caisse de retraite. Commencer tôt est votre meilleur atout."),
(T2, "Comment protéger ma famille si mes revenus s’arrêtent ?", 'papiers', ['atelier-reserve-securite', 'investir-assurance-epargne'],
 "Par trois protections : une réserve de plusieurs mois, une assurance adaptée (décès, invalidité, santé), et des papiers en ordre que vos proches savent retrouver. Aucune ne coûte beaucoup quand on s’y prend tôt, et ensemble elles évitent qu’un coup dur ne devienne une chute."),

(T3, "Comment sortir de mes dettes ?", 'dettes', ['atelier-sortir-dettes', 'atelier-rembourser-sans-se-noyer'],
 "Listez-les toutes, avec ce qu’elles coûtent. Cessez d’en ajouter. Payez le minimum partout et concentrez chaque franc disponible sur une seule, la plus chère ou la plus petite, jusqu’à la solder, puis passez à la suivante. On en sort, et chaque dette éteinte libère de la force pour la suivante."),
(T3, "Quelle dette dois-je rembourser en premier ?", 'dettes', ['atelier-sortir-dettes', 'cout-total-credit'],
 "Celle qui coûte le plus cher, en taux et en pénalités : chaque mois gagné sur elle est de l’argent économisé. Si vous avez besoin d’élan, commencez par la plus petite pour la voir disparaître vite. Dans tous les cas, ne laissez aucune dette sans paiement minimum."),
(T3, "Mon crédit me coûte combien au total ?", 'credit', ['atelier-cout-reel-de-mon-credit'],
 "Plus que le taux affiché. Additionnez tout ce que vous verserez : mensualités, frais de dossier, assurance, puis retirez la somme reçue. La différence est le vrai prix de votre crédit. C’est ce chiffre, pas le taux, qui permet de comparer deux offres."),
(T3, "Est-ce que je peux vraiment me permettre cette mensualité ?", 'reste', ['atelier-credit-fait-pour-moi', 'atelier-eviter-le-surendettement'],
 "Oui si, une fois toutes vos mensualités payées, il vous reste de quoi vivre et épargner sans compter sur une rentrée incertaine. Un repère prudent : l’ensemble de vos remboursements ne devrait pas dépasser un tiers de votre revenu. Testez aussi un mauvais mois."),
(T3, "Dois-je prendre un crédit pour lancer un business ?", 'plan', ['atelier-grandir-avec-le-credit', 'atelier-ma-banque-va-t-elle-me-preter'],
 "Pas pour tester une idée : on teste avec son propre argent, en petit. Le crédit sert à faire grandir ce qui a déjà prouvé qu’il vend, quand le gain attendu dépasse nettement son coût. Emprunter pour une activité qui n’a pas encore de clients, c’est payer des mensualités sur un espoir."),
(T3, "Est-ce une bonne idée d’emprunter pour acheter un terrain ?", 'credit', ['acheter-un-terrain', 'atelier-acheter-construire-attendre'],
 "Cela peut l’être si le terrain est juridiquement sûr et si la mensualité tient dans votre budget pendant toute la durée. Un terrain ne rapporte rien pendant que le crédit court : vérifiez d’abord les papiers, puis le coût total, puis ce qu’il vous reste pour vivre."),
(T3, "Comment renégocier un crédit que je n’arrive plus à rembourser ?", 'dette', ['atelier-quand-le-credit-va-mal', 'atelier-rembourser-sans-se-noyer'],
 "Allez voir le prêteur avant le premier impayé, avec vos chiffres. Demandez un allongement de la durée, un report d’échéances ou un regroupement. Un prêteur préfère un client qui rembourse plus lentement à un client qui ne rembourse plus. Le silence est toujours la pire stratégie."),
(T3, "Puis-je emprunter alors que je cotise déjà à une tontine ?", 'credit', ['avant-de-cotiser', 'atelier-eviter-le-surendettement'],
 "Oui, mais comptez la cotisation comme une mensualité : c’est un engagement fixe. Additionnez tontine et crédit, et vérifiez qu’ensemble ils laissent de quoi vivre. Si votre tour arrive bientôt, il peut parfois remplacer le crédit et vous éviter des intérêts."),
(T3, "Comment savoir si une offre de crédit est trop chère ?", 'credit', ['atelier-cout-reel-de-mon-credit', 'atelier-choisir-sa-microfinance'],
 "Comparez le coût total, pas la mensualité. Demandez le taux effectif global, les frais de dossier, l’assurance et les pénalités, puis faites le même calcul pour deux autres prêteurs. Une mensualité basse sur une longue durée cache souvent le crédit le plus cher."),
(T3, "Dois-je prêter de l’argent à un proche ?", 'preter', ['atelier-preter-ou-donner', 'question-preter-a-ma-soeur'],
 "Ne prêtez que ce que vous pouvez perdre sans vous mettre en difficulté, et dites clairement si c’est un prêt ou un don. Un montant, une date, un écrit simple protègent l’argent et surtout la relation. Parfois, donner une somme plus petite est la meilleure réponse."),
(T3, "Comment dire non à une demande d’argent de ma famille ?", 'aider', ['atelier-preter-ou-donner', 'preter-a-un-proche'],
 "En disant oui à autre chose. « Je ne peux pas te donner cette somme, mais voici ce que je peux faire » : un montant plus petit, une aide en nature, un délai. Un budget d’entraide fixé à l’avance vous permet de refuser sans vous justifier : l’enveloppe du mois est simplement épuisée."),
(T3, "Mon ami ne me rembourse pas : que faire ?", 'preter', ['atelier-preter-ou-donner'],
 "Parlez-en vite, sans attendre que la gêne s’installe. Proposez un échéancier adapté à ses moyens, même petit, et mettez-le par écrit. Si rien ne vient, décidez si vous transformez ce prêt en don pour préserver la relation, et retenez la leçon pour la prochaine demande."),
(T3, "Vaut-il mieux acheter à crédit ou attendre et épargner ?", 'attendre', ['consommer-et-acheter', 'cout-total-credit'],
 "Pour ce qui perd de la valeur, téléphone, meuble, fête : attendre et épargner, car le crédit vous le fait payer plus cher. Pour ce qui rapporte ou prend de la valeur, outil de travail, formation, logement : le crédit peut se défendre si son coût reste inférieur à ce qu’il permet de gagner."),
(T3, "Comment éviter que mes crédits absorbent mon salaire ?", 'credit', ['atelier-eviter-le-surendettement', 'atelier-bien-utiliser-mon-credit'],
 "Fixez-vous un plafond : pas plus d’un tiers du revenu en remboursements, tontines comprises. Ne prenez jamais un crédit pour en rembourser un autre sans avoir fait le calcul du coût total. Et soldez un crédit avant d’en ouvrir un nouveau."),
(T3, "Une dette peut-elle m’aider à devenir plus riche ?", 'credit', ['atelier-grandir-avec-le-credit', 'atelier-credit-fait-pour-moi'],
 "Oui, quand elle finance quelque chose qui rapporte plus qu’elle ne coûte : un stock qui tourne, un outil de production, un bien loué. Non, quand elle finance la consommation. La même dette enrichit ou appauvrit selon ce qu’elle achète : faites toujours le calcul avant de signer."),

(T4, "Comment gagner plus que mon salaire ?", 'declic', ['investir-gagner-plus', 'salaire-fixe-activite'],
 "Par trois chemins qui se combinent : faire valoir vos compétences pour un meilleur revenu, lancer une activité à côté, et faire travailler votre épargne. Commencez par celui qui demande le moins de capital : une activité testée en petit, avec ce que vous savez déjà faire."),
(T4, "Avec 100 000 F, quel business puis-je lancer ?", 'declic', ['avec-100000-je-lance-quoi', 'mon-business-plan-tient-il'],
 "Avec 100 000 F, on ne loue pas un local : on vend un service ou on revend un produit, depuis chez soi ou sur commande. L’objectif du premier mois n’est pas de gagner gros mais de vérifier que des clients paient. Ce qui se vend en petit peut ensuite grandir."),
(T4, "Avec 500 000 F, qu’est-ce que je peux lancer à Abidjan ?", 'declic', ['avec-100000-je-lance-quoi', 'mon-business-plan-tient-il'],
 "Avec 500 000 F, plusieurs activités de commerce, de service ou de petite transformation deviennent possibles, à condition de garder une part pour tenir les premiers mois. Choisissez selon votre quartier et ce que vous savez faire, et testez la demande avant d’acheter le matériel."),
(T4, "Avec 1 million de francs CFA, dans quoi investir pour gagner de l’argent ?", 'investir', ['generateur-de-projet', 'ma-brvm'],
 "Deux familles de réponses : une activité que vous faites tourner, ou des placements qui travaillent sans vous. La première peut rapporter plus mais demande votre temps ; la seconde demande de la patience. Rien n’interdit de partager la somme. Dans tous les cas, gardez votre réserve à part."),
(T4, "Quelle activité puis-je commencer tout en gardant mon emploi ?", 'declic', ['salaire-fixe-activite', 'investir-gagner-plus'],
 "Une activité qui se fait le soir, le week-end ou sur commande, sans stock lourd : service, revente, production à la demande, activité confiée à un proche de confiance avec des règles claires. Votre salaire finance le test ; votre emploi vous laisse le temps de bâtir sans pression."),
(T4, "Comment trouver une idée de business adaptée à mes compétences ?", 'declic', ['mon-business-plan-tient-il', 'atelier-investir-activite'],
 "Croisez trois listes : ce que vous savez faire, ce que les gens autour de vous paient déjà, ce que votre budget permet. La bonne idée est rarement nouvelle : c’est un besoin existant, mieux servi. Déclic fait ce croisement pour vous."),
(T4, "Comment savoir si mon idée de business intéresse vraiment des clients ?", 'idee', ['generateur-de-projet', 'atelier-lire-business-plan'],
 "En vendant avant d’investir. Proposez le produit à dix personnes, prenez des commandes, demandez un acompte. Les compliments ne prouvent rien ; un paiement, si. Si personne n’achète en petit, personne n’achètera en grand, et vous l’aurez appris sans vous ruiner."),
(T4, "Quel business peut fonctionner dans mon quartier ?", 'declic', ['mon-business-plan-tient-il', 'avec-100000-je-lance-quoi'],
 "Celui qui répond à un besoin que vos voisins satisfont mal ou loin. Observez pendant une semaine : ce qui manque, ce qui fait la queue, ce pour quoi on se déplace. Comptez aussi les concurrents : trois vendeurs de la même chose sur la même rue, c’est une marge divisée par trois."),
(T4, "Combien faut-il pour démarrer une activité de restauration ?", 'plan', ['generateur-de-projet', 'atelier-activite-gagne-t-elle'],
 "Le montant varie beaucoup selon le format : vente à emporter depuis chez soi, kiosque ou salle. Chiffrez quatre postes : matériel, premier stock, emplacement, et deux à trois mois de fonctionnement d’avance. C’est ce dernier poste qu’on oublie, et c’est lui qui fait fermer."),
(T4, "Puis-je lancer une activité sans louer de local ?", 'declic', ['avec-100000-je-lance-quoi', 'mon-business-plan-tient-il'],
 "Oui, et c’est souvent la meilleure façon de commencer : vente sur commande, livraison, service à domicile, vente en ligne ou par WhatsApp. Le loyer est la charge qui tue les jeunes activités. Louez quand vos ventes le justifient, pas avant."),
(T4, "Comment obtenir mes premiers clients ?", 'idee', ['generateur-de-projet', 'atelier-investir-activite'],
 "Par votre entourage et par la preuve. Servez très bien cinq personnes, demandez-leur de vous recommander, montrez le résultat en photo. Un premier client satisfait en amène d’autres mieux qu’une publicité. Fixez-vous un nombre de contacts par jour : la vente est d’abord une régularité."),
(T4, "Comment fixer mes prix pour gagner réellement de l’argent ?", 'rentable', ['atelier-ou-est-l-argent-de-mon-activite', 'mon-business-plan-tient-il'],
 "Partez de tout ce que coûte une vente : achat, transport, emballage, part du loyer, et votre propre temps. Ajoutez la marge dont l’activité a besoin pour durer, puis comparez au prix du marché. Si le prix du marché ne couvre pas vos coûts, ce n’est pas le prix qu’il faut changer mais le modèle."),
(T4, "Je vends beaucoup, mais où passe l’argent de mon activité ?", 'caisse', ['atelier-activite-gagne-t-elle', 'atelier-commerce-sans-comptabilite'],
 "Dans trois endroits, en général : le stock qui dort, les clients qui n’ont pas payé, et vos prélèvements personnels dans la caisse. Vendre beaucoup n’est pas gagner. Notez pendant un mois ce qui entre, ce qui sort et pourquoi : vous verrez aussitôt lequel des trois avale votre gain."),
(T4, "Mon business est-il rentable ?", 'rentable', ['atelier-ou-est-l-argent-de-mon-activite', 'mon-business-plan-tient-il'],
 "Il l’est si, après avoir payé les achats, les charges et un salaire pour vous, il reste quelque chose. Beaucoup d’activités « marchent » parce que leur patron ne se paie pas. Faites le calcul avec votre salaire dedans : c’est le seul qui dit la vérité."),
(T4, "Quel salaire puis-je me verser à partir de mon activité ?", 'salaire', ['atelier-activite-gagne-t-elle', 'separer-les-poches'],
 "Un montant fixe, calé sur ce que l’activité gagne dans un mois ordinaire, pas dans un bon mois. Versez-le à date fixe, comme à un employé, et ne touchez plus à la caisse. C’est ce qui transforme un commerce en entreprise, et ce qui rassure un banquier."),
(T4, "Comment séparer l’argent du business de l’argent de la maison ?", 'poches', ['salaire-fixe-activite', 'atelier-commerce-sans-comptabilite'],
 "Deux comptes ou deux porte-monnaie, sans exception, et un seul passage de l’un à l’autre : votre salaire. Toute dépense de la maison payée par la caisse fausse vos chiffres et vous empêche de savoir si l’activité gagne. C’est la règle la plus simple et la plus rentable."),
(T4, "Dois-je réinvestir mes bénéfices ou me payer ?", 'salaire', ['atelier-activite-gagne-t-elle', 'atelier-grandir-avec-le-credit'],
 "Les deux, selon une règle fixée à l’avance. Payez-vous d’abord un salaire raisonnable, sinon vous vous servirez dans la caisse. Sur ce qui reste, gardez une réserve pour l’activité et réinvestissez dans ce qui a déjà prouvé qu’il rapporte : plus de stock qui tourne, pas plus de décor."),
(T4, "Comment financer la croissance de mon activité ?", 'banque', ['atelier-grandir-avec-le-credit', 'club-investissement'],
 "Dans cet ordre : les bénéfices réinvestis, les avances de clients et délais de fournisseurs, puis le crédit ou un associé. Pour convaincre l’extérieur, il faut des chiffres : ventes, marge, salaire que vous vous versez. Une activité dont les comptes sont lisibles trouve de l’argent."),
(T4, "Mon entreprise vaut combien ?", 'valeur', ['atelier-activite-gagne-t-elle', 'atelier-lire-business-plan'],
 "Elle vaut ce qu’elle peut rapporter demain à quelqu’un d’autre que vous. On l’estime à partir de son bénéfice régulier, de ses actifs et de ce que se vendent des activités comparables. Une entreprise qui tourne sans son patron vaut beaucoup plus qu’une entreprise qui dépend de lui."),
(T4, "Comment passer d’un petit commerce à une vraie entreprise ?", 'salaire', ['atelier-commerce-sans-comptabilite', 'valoriser-mon-entreprise'],
 "En faisant quatre choses qu’un petit commerce ne fait pas : séparer la caisse de la poche, se verser un salaire, tenir des chiffres simples, et confier des tâches à d’autres. Le jour où l’activité tourne une semaine sans vous, vous avez une entreprise."),

(T5, "Comment commencer à investir ?", 'investir', ['questions-avant-d-investir', 'premiers-pas-bourse'],
 "Par trois préalables : une réserve de sécurité, pas de dette chère, et une somme dont vous n’aurez pas besoin avant plusieurs années. Ensuite, commencez petit et régulier, sur un placement que vous comprenez. On apprend à investir en investissant peu, pas en attendant d’avoir beaucoup."),
(T5, "Faut-il être riche pour investir ?", 'mensuel', ['investir', 'premiers-pas-bourse'],
 "Non. On n’investit pas parce qu’on est riche, on le devient en investissant régulièrement. À la Bourse (BRVM), certaines actions coûtent quelques milliers de francs, et un fonds commun de placement est accessible avec de petites sommes. Ce qui compte, c’est la régularité et la durée."),
(T5, "Avec 50 000 F, puis-je investir à la BRVM ?", 'mensuel', ['acheter-des-actions', 'etude-frais-bourse'],
 "Oui. Plusieurs actions de la Bourse (BRVM) valent moins de 50 000 F, et il n’y a pas de minimum légal. Vérifiez les frais de votre SGI : sur un petit ordre, ils pèsent proportionnellement plus. Un fonds commun de placement peut aussi être une porte d’entrée pour de petits montants."),
(T5, "Comment acheter ma première action à la BRVM ?", 'acheter', ['atelier-premiere-action', 'coach-bourse'],
 "En quatre étapes : ouvrir un compte-titres chez une SGI, y déposer de l’argent, choisir une société que vous comprenez, puis passer un ordre d’achat à un prix que vous fixez. La SGI exécute l’ordre à la Bourse (BRVM) et les titres arrivent sur votre compte."),
(T5, "Quelle SGI choisir pour ouvrir un compte ?", 'sgi', ['questions-a-poser-a-sa-sgi', 'sgi'],
 "Comparez sur quatre points : les frais de courtage et de garde, le montant minimum, la possibilité de passer ses ordres en ligne, et la qualité de la réponse quand vous posez une question. Toutes sont agréées par le régulateur ; la bonne est celle qui correspond à votre façon d’investir."),
(T5, "Quels frais vais-je payer pour acheter et vendre une action ?", 'frais', ['questions-a-poser-a-sa-sgi', 'acheter-des-actions'],
 "À chaque ordre, une commission de courtage, des commissions pour la Bourse et le dépositaire, et une taxe ; chaque année, des droits de garde. Un aller-retour coûte en général quelques pour cent du montant. C’est une raison de plus d’acheter pour garder, pas pour revendre vite."),
(T5, "Quelle est la différence entre une action et une obligation ?", 'premiers', ['obligations', 'atelier-placements-expliques'],
 "Une action est une part d’entreprise : vous partagez ses bénéfices et ses risques, sans garantie. Une obligation est un prêt que vous faites à une entreprise ou à un État : vous recevez des intérêts connus et votre capital à l’échéance. L’une vise la croissance, l’autre le revenu régulier."),
(T5, "Comment choisir une entreprise en Bourse ?", 'fiche', ['atelier-lire-societe-cotee', 'ma-brvm.html#criteres'],
 "En comprenant d’abord ce qu’elle vend et comment elle gagne de l’argent. Regardez ensuite si ses bénéfices sont réguliers, si elle verse un dividende, si elle est peu endettée et si son action s’échange facilement. Une société qu’on ne sait pas expliquer en deux phrases n’est pas encore pour soi."),
(T5, "Qu’est-ce qu’un dividende et quand est-il versé ?", 'dividendes', ['atelier-investir-dividendes', 'news/2026-11-21-dividende-regularite-dix-societes'],
 "C’est la part du bénéfice qu’une société verse en argent à ses actionnaires, en général une fois par an. À la Bourse (BRVM), l’essentiel tombe entre mai et septembre, après les assemblées générales. Il n’est jamais garanti : il dépend des résultats de l’année."),
(T5, "Peut-on vivre de ses dividendes ?", 'dividendes', ['atelier-investir-dividendes', 'atelier-portefeuille-factures'],
 "Oui, mais il faut un capital important et des années de patience. Divisez le revenu annuel souhaité par le rendement moyen de vos actions : vous obtenez le capital nécessaire. C’est un objectif de long terme, qui se construit en réinvestissant ses dividendes pendant longtemps."),
(T5, "Si j’avais investi 1 million à la BRVM il y a un an, combien aurais-je aujourd’hui ?", 'mabrvm', ['news/2026-11-21-moins-d-une-action-sur-deux-bat-l-indice'],
 "Cela dépend entièrement de l’action et de la date : sur un an, les résultats vont d’une perte à un doublement. Ma BRVM refait le calcul exact pour chaque société, dividendes et frais compris, et le compare à l’ensemble du marché."),
(T5, "Quelle action a le plus progressé cette année à la BRVM ?", 'mabrvm', ['societes', 'news/2026-11-21-liquidite-cinq-societes-45-pourcent'],
 "Le palmarès change chaque semaine, et la plus forte hausse n’est pas toujours celle qu’on a pu acheter : certaines actions s’échangent très peu. Ma BRVM affiche les meilleures performances sur la période de votre choix, avec la liquidité de chaque titre."),
(T5, "Pourquoi une action baisse alors que l’entreprise gagne de l’argent ?", 'societe', ['bourse-marche', 'atelier-economie-pour-investir'],
 "Parce que le cours reflète ce que les investisseurs attendent, pas seulement ce qui est déjà gagné. Un bon résultat inférieur aux attentes, un dividende détaché, des ventes de quelques gros porteurs ou peu d’acheteurs ce jour-là suffisent à faire baisser un titre sain."),
(T5, "Dois-je vendre une action qui a beaucoup baissé ?", 'baisse', ['news/2026-11-21-plus-forte-baisse-depuis-2023', 'atelier-lire-societe-cotee'],
 "La baisse seule ne répond pas. Posez-vous deux questions : la raison pour laquelle j’ai acheté tient-elle toujours, et ai-je besoin de cet argent bientôt ? Si l’entreprise reste solide et votre horizon long, vendre transforme une baisse passagère en perte définitive."),
(T5, "Comment suivre mon portefeuille sans regarder les cours tous les jours ?", 'portefeuille', ['atelier-construire-son-portefeuille', 'semaine-bourse'],
 "Fixez un rendez-vous, une fois par mois ou par trimestre, et tenez-vous-y. Regardez alors trois choses : votre résultat dividendes compris, l’écart avec le marché, et le poids de votre plus grosse ligne. Plus on regarde souvent, plus on voit du rouge, et plus on décide mal."),
(T5, "Est-il préférable d’investir d’un coup ou chaque mois ?", 'mensuel', ['news/2026-11-21-50000-f-par-mois-depuis-2023', 'news/2026-11-21-vingt-seances-la-moitie-de-la-hausse'],
 "Si vous avez la somme, l’investir d’un coup la fait travailler plus longtemps ; l’étaler vous protège d’un mauvais point d’entrée. Si vous épargnez sur votre revenu, la question ne se pose pas : investir chaque mois est votre méthode, et elle achète aussi pendant les baisses."),
(T5, "Comment comparer la Bourse, une tontine et un dépôt à terme ?", 'investir', ['atelier-placements-expliques', 'atelier-tontine-bourse'],
 "Sur trois critères : ce que cela rapporte, ce que vous risquez, et quand vous récupérez votre argent. La tontine discipline mais ne rapporte pas d’intérêt ; le dépôt à terme rapporte peu, sans surprise ; la Bourse peut rapporter davantage, avec des baisses en chemin. Ils ne servent pas le même projet."),
(T5, "Quel placement choisir pour un projet dans deux ans ?", 'horizon', ['atelier-placer-selon-horizon', 'atelier-court-terme'],
 "Un placement dont la valeur ne peut pas baisser au moment où vous en aurez besoin : dépôt à terme, bons du Trésor, compte d’épargne. Deux ans, c’est trop court pour les actions, qui peuvent perdre un tiers de leur valeur en quelques mois. La date du projet choisit le placement."),
(T5, "Comment reconnaître une fausse promesse de rendement ?", 'promesse2', ['se-proteger-des-arnaques', 'atelier-faux-conseiller'],
 "À quatre signes : un gain élevé et garanti, l’urgence à décider, l’impossibilité d’expliquer d’où vient l’argent, et la demande de recruter d’autres personnes. Vérifiez toujours l’agrément auprès du régulateur. Un placement sérieux n’a jamais besoin que vous vous dépêchiez."),
(T5, "Peut-on perdre tout son argent en Bourse ?", 'duree', ['news/2026-11-21-17-actions-ont-perdu-la-moitie', 'news/2026-11-21-un-titre-ou-cinq-diversifier'],
 "Sur une seule action, une très forte perte est possible si l’entreprise s’effondre. Sur un portefeuille réparti entre plusieurs sociétés solides, tout perdre est très improbable ; des baisses de 20 à 40 % en chemin, en revanche, arrivent. D’où deux règles : diversifier, et ne placer que l’argent de long terme."),

(T6, "Comment devenir riche avec le revenu que j’ai aujourd’hui ?", 'voirclair', ['epargner', 'generateur-de-projet', 'ma-brvm'],
 "En créant un écart régulier entre ce que vous gagnez et ce que vous dépensez, puis en plaçant cet écart dans ce qui prend de la valeur : une activité à vous, des placements, vos compétences. Trois étapes, dans l’ordre : dégager une somme chaque mois, la protéger, la faire travailler."),
(T6, "Par quoi commencer pour construire mon patrimoine ?", 'patrimoine', ['ou-est-passe-mon-argent', 'investir'],
 "Par savoir d’où vous partez : ce que vous possédez, ce que vous devez, ce que vous pouvez mettre de côté. Ensuite, dans l’ordre : une réserve, la fin des dettes chères, puis des actifs qui rapportent ou prennent de la valeur. Un patrimoine se bâtit par couches, la base d’abord."),
(T6, "Combien dois-je gagner pour devenir financièrement libre ?", 'liberte', ['atelier-portefeuille-factures', 'preparer-ma-retraite'],
 "La liberté ne dépend pas de ce que vous gagnez mais de ce que vos actifs vous rapportent sans votre travail. Elle commence le jour où ces revenus couvrent vos dépenses. Calculez ce que vous dépensez par an : c’est ce montant que votre patrimoine devra produire."),
(T6, "Comment faire travailler mon argent au lieu de seulement travailler pour lui ?", 'patrimoine', ['atelier-epargner-ne-suffit-pas', 'ma-brvm'],
 "En achetant des choses qui rapportent pendant que vous dormez : parts d’entreprises, placements à revenu fixe, un bien loué, une activité qui tourne avec une équipe. Chaque franc placé est un employé qui travaille pour vous. Le premier est le plus dur à embaucher."),
(T6, "Est-ce que l’épargne seule peut me rendre riche ?", 'investir', ['atelier-epargner-ne-suffit-pas', 'epargner'],
 "Non. L’épargne protège et prépare, mais de l’argent qui dort perd de la valeur avec la hausse des prix. C’est l’épargne investie, dans une activité ou des placements, qui fait grandir un patrimoine. Épargner est la première marche, pas l’escalier."),
(T6, "Vaut-il mieux créer un business ou investir en Bourse ?", 'investir', ['generateur-de-projet', 'ma-brvm'],
 "Ils ne demandent pas la même chose. Un business peut rapporter beaucoup, mais il prend votre temps et dépend de vous. La Bourse demande moins de temps, plus de patience, et vous associe à des entreprises déjà établies. Beaucoup de patrimoines solides combinent les deux : l’un nourrit l’autre."),
(T6, "Dois-je acheter une maison ou continuer à louer ?", 'attendre', ['budget-chantier', 'investir-terrain-immobilier'],
 "Comparez sur dix ans le coût total de chaque chemin : loyers d’un côté ; terrain, construction, crédit et entretien de l’autre. Acheter n’est pas toujours gagnant si cela bloque toute votre épargne. La bonne réponse dépend de votre stabilité, de votre budget et du temps que vous resterez."),
(T6, "Quand puis-je me permettre d’acheter un terrain ?", 'terrain', ['atelier-acheter-un-lot', 'atelier-acheter-construire-attendre'],
 "Quand vous pouvez le payer sans toucher à votre réserve et sans mensualité qui étouffe votre budget, et quand les papiers sont vérifiés. Un terrain payé au prix de toutes vos économies vous laisse sans défense au premier imprévu. Le bon moment est celui où l’achat ne vous fragilise pas."),
(T6, "Comment financer une maison sans étouffer mon budget ?", 'chantier', ['atelier-acheter-construire-attendre', 'cout-total-credit'],
 "En construisant par étapes, chacune payée avant de commencer la suivante, ou avec un crédit dont la mensualité laisse de la place pour vivre et épargner. Chiffrez le chantier entier avant le premier sac de ciment : c’est la maison inachevée, pas la maison modeste, qui coûte le plus cher."),
(T6, "Comment transformer une grosse rentrée d’argent en patrimoine durable ?", 'somme', ['atelier-grosse-somme', 'investir'],
 "En la mettant à l’abri le jour même, puis en prenant le temps de décider. Soldez ce qui coûte cher, complétez votre réserve, puis répartissez le reste sur plusieurs actifs qui rapportent ou prennent de la valeur. Une somme rare doit acheter des choses qui durent plus longtemps qu’elle."),
(T6, "Comment construire plusieurs sources de revenus ?", 'declic', ['investir-gagner-plus', 'ma-brvm.html#dividendes'],
 "Une à la fois. Stabilisez d’abord votre revenu principal, puis ajoutez une activité à côté, puis des revenus de placement : dividendes, intérêts, loyers. Chaque source nouvelle est financée par la précédente. Vouloir tout lancer en même temps est le plus sûr moyen de n’en réussir aucune."),
(T6, "Combien de temps faudrait-il pour atteindre 10 millions de francs CFA ?", 'patrimoine', ['ma-brvm.html#mensuel', 'epargner'],
 "Cela dépend de deux choses : ce que vous versez chaque mois et ce que votre argent rapporte. Avec 50 000 F par mois sans aucun rendement, il faut près de 17 ans ; chaque point de rendement et chaque hausse du versement raccourcissent nettement la durée. Le calcul se fait en une minute."),
(T6, "Comment transmettre ce que je construis à mes enfants ?", 'papiers', ['etudes-enfants-heritage', 'apres-un-deces'],
 "En mettant de l’ordre de votre vivant : des biens à votre nom avec des titres clairs, des papiers que vos proches savent retrouver, et des volontés exprimées par écrit, avec l’aide d’un notaire. On transmet aussi un savoir : des enfants qui comprennent l’argent conservent ce qu’ils reçoivent."),
(T6, "Je pars de zéro à 35 ans : est-il trop tard pour devenir riche ?", 'patrimoine', ['ou-est-passe-mon-argent', 'ma-brvm.html#mensuel'],
 "Non. À 35 ans, vous avez devant vous vingt-cinq à trente ans de revenus, et l’expérience que vous n’aviez pas à 20 ans. Ce qui compte n’est pas la date de départ mais la régularité à partir d’aujourd’hui. Commencez par mesurer où vous en êtes, puis par un premier versement."),
(T6, "J’ai de l’ambition, mais pas de plan : quel est mon premier pas ?", 'diagnostic', ['ou-est-passe-mon-argent', 'apprendre'],
 "Savoir d’où vous partez. L’ambition sans chiffres tourne en rond ; avec vos chiffres, elle devient un plan. Faites le point sur vos revenus, vos dépenses, vos dettes et ce que vous pouvez dégager chaque mois : le premier pas se voit tout seul une fois la situation posée."),
]


def main():
    idx = json.load(open(os.path.join(RACINE, 'data', 'tout-efa.json'), encoding='utf-8'))
    T = {f['p']: f['t'] for f in idx}
    def existe(u):
        p = re.split(r'[?#]', u)[0]
        return p in T or os.path.exists(os.path.join(RACINE, p))
    err = []
    for k, (u, *_r) in O.items():
        if not existe(u): err.append('outil %s : %s' % (k, u))
    out = []
    for n, (th, q, o, lire, r) in enumerate(Q, 1):
        if o not in O: err.append('question %d : outil inconnu %s' % (n, o))
        L = []
        for p in lire:
            u = p if '.html' in p else p + '.html'
            if not existe(u): err.append('question %d : page absente %s' % (n, u)); continue
            L.append({'u': u, 't': T.get(re.split(r'[?#]', u)[0], '')})
        out.append({'n': n, 'th': th, 'q': q, 'o': o, 'l': L, 'r': r})
    if err:
        print('\n'.join(err)); sys.exit(1)
    themes = []
    for x in out:
        if x['th'] not in themes: themes.append(x['th'])
    d = {'themes': themes, 'outils': {k: {'u': v[0], 'nom': v[1], 'sur': v[2], 'cta': v[3]} for k, v in O.items()}, 'questions': out}
    os.makedirs(os.path.join(RACINE, 'data', 'questions'), exist_ok=True)
    json.dump(d, open(os.path.join(RACINE, 'data', 'questions', 'catalogue.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('Catalogue : %d questions, %d thèmes, %d outils' % (len(out), len(themes), len(O)))
    return d


if __name__ == '__main__':
    main()
