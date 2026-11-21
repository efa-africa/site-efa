/* EFA · « Une question. Un prochain pas. »
   1. comprendre(question) : reconnaît le besoin et recommande l'outil EFA qui fait avancer.
   2. chercher(question, index) : retrouve les contenus du site (data/tout-efa.json) qui en parlent.
   Tout se passe dans le navigateur : la question n'est envoyée nulle part. */
(function () {
  'use strict';
  function A(nom, t, d, url) { return { nom: nom, t: t, d: d, url: url }; }
  var VOIR = A('Voir clair', 'Avant d’engager cette somme', 'Vérifiez combien vous pouvez vraiment mettre sans toucher à votre réserve.', 'ou-est-passe-mon-argent.html');
  var DIAG = A('Mon diagnostic', 'Pour faire le point', 'Six minutes pour savoir où vous en êtes : budget, épargne, dettes, tontines.', 'diagnostic.html');

  /* Une intention : id, mots repérés (une expression de plusieurs mots pèse plus), phrase « ce que j'ai compris »,
     outil [nom, promesse, adresse, pourquoi, bouton], compléments. « {m} » = le montant lu dans la question. */
  var I = [
    { id: 'richesse', mots: ['devenir riche', 'riche', 'richesse', 'm enrichir', 'fortune', 'millionnaire', 'construire ma richesse', 'sortir du salaire', 'ne plus dependre de mon salaire', 'batir quelque chose', 'faire grandir mon patrimoine', 'construire mon patrimoine', 'reussir financierement'],
      c: function (m) { return (m ? 'Vous avez <b>' + m.txt + '</b> et vous' : 'Vous') + ' voulez devenir riche : sortir des limites du salaire, bâtir quelque chose à vous, voir votre patrimoine grandir.'; },
      o: ['Voir clair', 'Combien puis-je dégager chaque mois ?', 'ou-est-passe-mon-argent.html', 'Tout commence par la somme que vous pouvez mettre de côté chaque mois sans vous mettre en difficulté : c’est elle qui nourrit un business, un placement ou les deux.', 'Trouver ma capacité à construire'],
      a: [A('Déclic', 'Bâtir quelque chose à moi', 'Quel business puis-je lancer avec ce que j’ai ?', function (m) { return 'generateur-de-projet.html' + (m ? '?budget=' + m.v : ''); }),
          A('Ma BRVM', 'Faire travailler mon argent', 'Si j’avais investi, combien aurais-je aujourd’hui ?', function (m) { return 'ma-brvm.html' + (m ? '?m=' + m.v : ''); }),
          A('Apprendre, seul ou accompagné', 'Tenir dans la durée', 'Quel chemin suivre, et comment tenir assez longtemps pour obtenir des résultats.', 'apprendre.html'),
          A('Ma liberté financière', 'Le chiffre à viser', 'Combien me faut-il pour vivre de mes revenus ?', 'liberte-financiere.html')] },
    { id: 'businessplan', mots: ['business plan', 'plan d affaires', 'mon plan', 'previsionnel', 'etude de marche'], c: 'Vous voulez savoir si votre business plan tient la route.',
      o: ['Mon business plan tient-il la route ?', 'Tester mon projet avant de me lancer', 'mon-business-plan-tient-il.html', 'Vous entrez vos chiffres ; l’outil cherche l’hypothèse qui ferait tout tomber, avant que la réalité s’en charge.', 'Tester mon plan'],
      a: [A('Lire un business plan', 'L’atelier', 'Ce qu’un banquier ou un associé regarde en premier.', 'atelier-lire-business-plan.html'), A('Déclic', 'Pas encore d’idée arrêtée ?', 'Des activités à tester selon votre budget.', 'generateur-de-projet.html')] },
    { id: 'rentable', mots: ['rentable', 'rentabilite', 'gagne t elle', 'benefice', 'benefices', 'marge', 'me payer', 'salaire fixe', 'mon activite gagne', 'ma boutique', 'mon commerce', 'comptabilite', 'caisse'], c: 'Vous avez déjà une activité et vous voulez savoir ce qu’elle gagne vraiment.',
      o: ['Mon activité gagne-t-elle de l’argent ?', 'Voir ce que mon activité rapporte', 'atelier-activite-gagne-t-elle.html', 'Séparer ce qui entre de ce qui reste : beaucoup d’activités tournent sans rien laisser à leur propriétaire.', 'Faire le calcul'],
      a: [A('Séparer les poches', 'Le réflexe de base', 'Mon argent, celui de l’activité, celui de la famille.', 'separer-les-poches.html'), A('Me verser un salaire fixe', 'Pour tenir dans la durée', 'Se payer sans vider la caisse.', 'salaire-fixe-activite.html')] },
    { id: 'valo', mots: ['combien vaut', 'valeur de mon entreprise', 'valoriser', 'vendre mon entreprise', 'ceder', 'investisseur', 'lever des fonds', 'associe', 'parts'], c: 'Vous voulez savoir ce que vaut votre entreprise.',
      o: ['Valo', 'Ce que vaut mon entreprise', 'valoriser-mon-entreprise.html', 'Une fourchette de valeur à partir de vos chiffres, et ce qu’un investisseur regardera.', 'Estimer'], a: [] },
    { id: 'lancer', mots: ['lancer', 'lance', 'business', 'commerce', 'vendre quoi', 'activite', 'entreprendre', 'ouvrir un commerce', 'ouvrir une boutique', 'ouvrir un maquis', 'ouvrir un salon', 'ouvrir un restaurant', 'boutique', 'maquis', 'elevage', 'idee', 'projet', 'vendre', 'creer', 'quoi faire avec', 'me mettre a mon compte', 'revenu complementaire', 'gagner plus', 'cote du travail'],
      c: function (m) { return m ? 'Vous avez <b>' + m.txt + '</b> et vous voulez lancer une activité.' : 'Vous voulez lancer une activité.'; },
      o: ['Déclic', 'Trouver mon idée de business', function (m) { return 'generateur-de-projet.html' + (m ? '?budget=' + m.v : ''); }, 'Déclic part de votre budget{m} pour proposer des activités à tester, avec le premier pas, ce qu’il faut vérifier avant et le piège courant.', 'Trouver mes pistes'],
      a: [VOIR, A('Ma BRVM', 'Une autre décision ?', 'Et si cette somme allait plutôt à la Bourse ?', function (m) { return 'ma-brvm.html' + (m ? '?m=' + m.v : ''); })] },
    { id: 'arnaque', mots: ['arnaque', 'arnaques', 'arnaquer', 'escroc', 'escroquerie', 'par mois garanti', 'garanti', 'doubler', 'on m a propose', 'trop beau', 'pyramide', 'ponzi', 'mlm', 'qnet', 'crypto', 'bitcoin', 'forex', 'trading', 'faux conseiller', 'par semaine', '% par mois', 'pour cent par mois', 'confiance'], c: 'On vous propose un placement et vous voulez savoir si c’est sérieux.',
      o: ['Avant de confier votre argent', 'Reconnaître les signaux d’alerte', 'arnaques.html', 'Les signaux qui doivent vous arrêter : rendement garanti, urgence, recrutement, absence d’agrément. À vérifier avant de verser un franc.', 'Vérifier l’offre'],
      a: [A('Les arnaques', 'Le guide', 'Les schémas les plus courants et comment s’en protéger.', 'se-proteger-des-arnaques.html'), A('10 questions avant d’investir', 'À poser à celui qui propose', 'Les questions qui font fuir les vendeurs de rêve.', 'questions-avant-d-investir.html')] },
    { id: 'actu', mots: ['nouvelles', 'actualite', 'actualites', 'actu', 'news', 'infos', 'information du jour', 'seance', 'cours du jour', 'marche aujourd hui', 'qu est ce qui se passe', 'bceao'], c: 'Vous voulez suivre l’actualité de l’argent.',
      o: ['EFA News', 'L’actu qui vous concerne', 'news.html', 'Chaque actualité est expliquée : le fait, les chiffres, ce que cela change pour votre argent.', 'Lire l’actu'],
      a: [A('Le marché aujourd’hui', 'Pour la Bourse (BRVM)', 'Indices, hausses, baisses et volumes de la dernière séance.', 'marches.html'), A('La semaine à la Bourse', 'Chaque samedi', 'Le résumé de la semaine.', 'semaine-bourse.html')] },
    { id: 'sgi', mots: ['sgi', 'ouvrir un compte titres', 'compte titres', 'courtier', 'acheter des actions', 'comment acheter', 'comment investir a la brvm', 'passer un ordre', 'premier ordre', 'frais de bourse'], c: 'Vous voulez passer à l’acte à la Bourse (BRVM).',
      o: ['Acheter des actions', 'Passer par une SGI', 'acheter-des-actions.html', 'Pour acheter des actions, il faut un compte chez une SGI : comment l’ouvrir, les frais, les étapes.', 'Voir les étapes'],
      a: [A('Les SGI', 'Les comparer', 'La liste des SGI de la Bourse (BRVM).', 'sgi.html'), A('10 questions à poser à sa SGI', 'Avant de signer', 'Frais, délais, accès à votre compte.', 'questions-a-poser-a-sa-sgi.html'), A('Ma BRVM', 'Avant d’acheter', 'Ce qu’aurait donné un achat passé.', 'ma-brvm.html')] },
    { id: 'fcp', mots: ['fcp', 'opcvm', 'sicav', 'fonds commun', 'fcpe', 'fonds de placement'], c: 'Vous vous intéressez aux fonds de placement.',
      o: ['OPCVM et FCPE expliqués', 'Investir par un fonds', 'opcvm-fcpe.html', 'Un fonds achète pour vous un panier de titres : comment ça marche, ce que ça coûte, à qui le confier.', 'Comprendre les fonds'],
      a: [A('Toutes les façons d’investir', 'Pour comparer', 'Bourse, obligations, immobilier, assurance.', 'investir.html')] },
    { id: 'analyse', mots: ['per', 'ratio', 'ratios', 'comptes d une societe', 'lire les comptes', 'etats financiers', 'bilan', 'resultat net', 'analyser une societe', 'analyser une action', 'quelle action', 'societes cotees'], c: 'Vous voulez analyser une société cotée.',
      o: ['Les sociétés cotées', 'La fiche de chaque société', 'societes.html', 'Pour chaque société de la Bourse (BRVM) : cours, dividendes, ratios et résultats publiés.', 'Voir les sociétés'],
      a: [A('Lire une société cotée', 'L’atelier', 'Lire une société comme un investisseur.', 'atelier-lire-societe-cotee.html'), A('Ma BRVM', 'Comparer', 'Deux ou trois actions sur la même période.', 'ma-brvm.html#comparer')] },
    { id: 'grossesomme', mots: ['prime', '13e mois', 'treizieme mois', 'grosse somme', 'j ai recu', 'je viens de recevoir', 'gratification', 'rappel de salaire', 'indemnite', 'j ai touche', 'j ai gagne'],
      c: function (m) { return m ? 'Vous venez de recevoir <b>' + m.txt + '</b>.' : 'Une somme importante vient d’arriver.'; },
      o: ['Combien garder quand l’argent arrive ?', 'Décider avant de dépenser', 'cercle-spirale.html', 'Le calculateur répartit la somme : ce qui part, ce qui se garde, ce qui peut travailler.', 'Répartir la somme'],
      a: [A('Une grosse somme arrive', 'L’atelier', 'Le plan en trois temps.', 'atelier-grosse-somme.html'), A('Toutes les façons d’investir', 'Ensuite', 'Où placer ce qui reste.', 'investir.html')] },
    { id: 'bourse', mots: ['brvm', 'bourse', 'action', 'actions', 'dividende', 'dividendes', 'titres', 'cotee', 'cotees', 'sonatel', 'orange ci', 'ecobank', 'portefeuille', 'si j avais investi', 'indice'],
      c: function (m) { return m ? 'Vous pensez placer <b>' + m.txt + '</b> à la Bourse (BRVM).' : 'Vous vous intéressez à la Bourse (BRVM).'; },
      o: ['Ma BRVM', 'Et si j’avais investi ?', function (m) { return 'ma-brvm.html' + (m ? '?m=' + m.v : ''); }, 'Ma BRVM reconstitue ce qu’aurait donné un achat passé, dividendes et frais compris, et le compare à tout le marché. Le meilleur moyen de comprendre avant d’acheter.', 'Explorer Ma BRVM'],
      a: [A('Investir à la BRVM : par où commencer ?', 'Si vous débutez', 'Les étapes, dans l’ordre.', 'bourse.html'), A('Acheter des actions', 'Pour passer à l’acte', 'Ouvrir un compte chez une SGI, les frais.', 'acheter-des-actions.html')] },
    { id: 'obligations', mots: ['obligation', 'obligations', 'bons du tresor', 'bon du tresor', 'emprunt d etat', 'emprunt obligataire', 'depot a terme', 'compte a terme', 'taux d interet du placement', 'sans risque'], c: 'Vous cherchez un placement à revenu fixe.',
      o: ['DAT et emprunts d’État', 'Comparer ce que rapporte mon épargne', 'dat-emprunts-etat.html#calcul', 'Le simulateur compare, sur la même durée, un dépôt à terme et un emprunt d’État : ce que vous touchez vraiment.', 'Comparer'],
      a: [A('Bons du Trésor', 'L’atelier', 'Prêter à l’État, pas à pas.', 'atelier-bons-du-tresor.html')] },
    { id: 'assurance', mots: ['assurance', 'assurance vie', 'assureur', 'prevoyance', 'capitalisation'], c: 'Vous vous posez une question sur l’assurance.',
      o: ['Assurance-vie et épargne', 'Ce que couvre vraiment un contrat', 'investir-assurance-epargne.html', 'Ce qu’un contrat promet, ce qu’il coûte et les questions à poser avant de signer.', 'Comprendre'],
      a: [A('Assurance-vie', 'L’atelier', 'Lire un contrat ligne par ligne.', 'atelier-assurance-vie.html')] },
    { id: 'terrain', mots: ['terrain', 'maison', 'construire', 'chantier', 'immobilier', 'lot', 'acd', 'titre foncier', 'parcelle', 'batir', 'logement', 'louer ou acheter', 'appartement'], c: 'Vous avez un projet de terrain ou de maison.',
      o: ['Acheter un terrain', 'Sans se faire avoir', 'acheter-un-terrain.html', 'Les papiers à vérifier, les personnes à voir et l’ordre des paiements, avant de verser le premier franc.', 'Vérifier avant d’acheter'],
      a: [A('Le budget du chantier', 'Construire par étapes', 'Découper le chantier pour ne pas s’arrêter aux fondations.', 'budget-chantier.html'), A('Terrain et immobilier', 'Comme placement', 'Ce que rapporte vraiment la pierre.', 'investir-terrain-immobilier.html')] },
    { id: 'deces', mots: ['deces', 'decede', 'decedee', 'mort', 'heritage', 'heriter', 'succession', 'veuve', 'veuf', 'testament', 'funerailles'], c: 'Vous faites face à un décès ou à une succession.',
      o: ['Après le décès d’un proche', 'Les premières décisions d’argent', 'apres-un-deces.html', 'Ce qu’il faut faire dans les premiers jours, ce qui peut attendre, et les papiers à réunir.', 'Voir les étapes'],
      a: [A('Les papiers que ma famille doit retrouver', 'Pour préparer', 'La liste à tenir à jour.', 'papiers-famille.html'), A('Les études des enfants et l’héritage', 'Pour transmettre', 'Protéger ceux qui restent.', 'etudes-enfants-heritage.html')] },
    { id: 'etudes', mots: ['etudes de', 'scolarite', 'rentree', 'frais de scolarite', 'ecole de mes enfants', 'universite de', 'payer l ecole', 'etudes des enfants', 'etudes de mes enfants'], c: 'Vous voulez financer les études de vos enfants.',
      o: ['Les études des enfants et l’héritage', 'Préparer sans s’endetter', 'etudes-enfants-heritage.html', 'Combien prévoir, quand commencer et où mettre cet argent pour qu’il soit là le jour venu.', 'Préparer'],
      a: [A('La tontine pour la rentrée', 'Avantages et limites', 'Quand la tontine aide, quand elle piège.', 'tontine-rentree.html'), A('Les études de mon enfant', 'L’atelier', 'Le plan chiffré.', 'atelier-etudes-enfant.html')] },
    { id: 'enfant', mots: ['enfant', 'bebe', 'naissance', 'enceinte', 'accouchement', 'grossesse'], c: 'Un enfant arrive et vous voulez vous organiser.',
      o: ['Avant l’arrivée d’un enfant', 'Organiser son argent', 'arrivee-enfant.html', 'Les dépenses à prévoir, celles qu’on oublie, et comment les étaler.', 'M’organiser'], a: [VOIR] },
    { id: 'preter', mots: ['me demande', 'preter a', 'pret a ma', 'pret a mon', 'ma soeur', 'mon frere', 'un ami', 'un proche', 'un parent', 'cousin', 'me doit', 'ne me rembourse', 'avance de l argent a'], c: 'Un proche vous demande de l’argent.',
      o: ['Prêter à un proche', 'Décider sans se fâcher', 'preter-a-un-proche.html', 'Une méthode pour décider : combien, à quelles conditions, et comment le dire.', 'Décider'],
      a: [A('Dois-je prêter 300 000 F à ma sœur ?', 'Un cas concret', 'La décision, étape par étape.', 'question-preter-a-ma-soeur.html'), A('La solidarité, assurance de la famille', 'Pour comprendre', 'Ce que l’on donne, ce que l’on reçoit.', 'solidarite-assureur-de-la-famille.html')] },
    { id: 'famille', mots: ['je donne trop', 'ma famille', 'la famille', 'aide aux proches', 'charges familiales', 'solidarite', 'parents au village', 'tout le monde compte sur moi'], c: 'Le soutien à votre famille pèse sur votre budget.',
      o: ['La solidarité, assurance de la famille', 'Aider sans s’épuiser', 'solidarite-assureur-de-la-famille.html', 'Pourquoi on donne, ce que cela coûte, et comment fixer une enveloppe tenable.', 'Comprendre'],
      a: [A('Les engagements et les exceptions', 'Dans le budget', 'Ce qui part avant même que vous ne décidiez.', 'engagements-et-exceptions.html'), A('Prêter à un proche', 'Quand on vous demande', 'Une méthode pour décider.', 'preter-a-un-proche.html')] },
    { id: 'mobilemoney', mots: ['mobile money', 'wave', 'orange money', 'momo', 'moov money', 'petites depenses', 'je perds le fil', 'frais de retrait'], c: 'Vous voulez garder le fil de votre argent en mobile money.',
      o: ['Budget et mobile money', 'Ne plus perdre le fil', 'budget-mobile-money.html', 'Pourquoi le mobile money disperse le budget, et cinq règles pour reprendre la main.', 'Reprendre la main'], a: [VOIR] },
    { id: 'inflation', mots: ['inflation', 'vie chere', 'tout augmente', 'les prix', 'prix augmentent', 'cherte', 'credit chez le commercant', 'payer en plusieurs fois'], c: 'Vous sentez les prix monter.',
      o: ['Consommer et acheter', 'Inflation, crédit chez le commerçant', 'consommer-et-acheter.html', 'Ce que l’inflation fait à votre argent et les réflexes pour acheter au bon prix.', 'Comprendre'],
      a: [A('L’inflation', 'L’atelier', 'Protéger son pouvoir d’achat.', 'atelier-inflation.html'), A('EFA News', 'Les chiffres du moment', 'L’actualité des prix.', 'news.html')] },
    { id: 'dette', mots: ['dette', 'dettes', 'rembourser', 'endette', 'surendette', 'je dois', 'arrieres', 'impaye', 'retard de paiement', 'creancier', 'huissier', 'negocier avec ma banque', 'negocier'], c: 'Vous avez des dettes à remettre en ordre.',
      o: ['Renégocier une dette', 'Sortir de l’étau', 'renegocier-une-dette.html', 'Lister ce que vous devez, calculer ce que vous pouvez payer chaque mois, puis proposer un échéancier réaliste.', 'Commencer'],
      a: [A('Voir clair', 'Pour savoir ce qui reste', 'Ce que vous pouvez consacrer aux remboursements.', 'ou-est-passe-mon-argent.html'), A('Éviter le surendettement', 'L’atelier', 'Les signaux avant qu’il soit trop tard.', 'atelier-eviter-le-surendettement.html')] },
    { id: 'credit', mots: ['credit', 'pret', 'emprunter', 'emprunt', 'mensualite', 'taux', 'banque me prete', 'financement', 'microcredit', 'avance sur salaire', 'decouvert', 'microfinance'],
      c: function (m) { return m ? 'Vous envisagez un crédit de <b>' + m.txt + '</b>.' : 'Vous envisagez un crédit.'; },
      o: ['Le coût total d’un crédit', 'Ce que je rembourse vraiment', 'cout-total-credit.html#calcul', 'Le taux affiché ne dit pas tout : frais de dossier, assurance, durée. Le calcul donne ce que le crédit vous coûtera au total.', 'Calculer le coût'],
      a: [A('Ma banque va-t-elle me prêter ?', 'Avant de déposer le dossier', 'Ce que la banque regarde.', 'atelier-ma-banque-va-t-elle-me-preter.html'), A('Voir clair', 'La mensualité tient-elle ?', 'Ce qui reste dans votre mois.', 'ou-est-passe-mon-argent.html')] },
    { id: 'tontine', mots: ['tontine', 'tontines', 'cotiser', 'cotisation', 'cotisations', 'tour de tontine', 'mon tour', 'ramasser'], c: 'Vous vous posez une question sur une tontine.',
      o: ['L’école de la tontine', 'Cotiser sans se faire avoir', 'ecole-de-la-tontine.html', 'Comment marche une tontine, qui gagne selon son tour, et les règles qui protègent les membres.', 'Comprendre la tontine'],
      a: [A('Avant de cotiser', '12 questions à poser', 'Vérifier la tontine avant d’y mettre de l’argent.', 'avant-de-cotiser.html'), A('Combien vaut mon rang ?', 'Le calcul', 'Premier ou dernier : ce que ça change.', 'choisir-son-rang-tontine.html'), A('Que faire de sa tontine ?', 'Avant de recevoir', 'Décider à l’avance.', 'tontine-decider-avant-de-recevoir.html')] },
    { id: 'retraite', mots: ['retraite', 'vieux jours', 'pension', 'cnps', 'ipres', 'crrae', 'quand je serai vieux'], c: 'Vous pensez à votre retraite.',
      o: ['Préparer ma retraite', 'Combien il me faudra', 'preparer-ma-retraite.html', 'Estimer ce que vous toucherez, ce qui manquera, et combien mettre de côté dès maintenant.', 'Faire le calcul'],
      a: [A('Ma liberté financière', 'Voir plus loin', 'Combien faut-il pour vivre de ses revenus ?', 'liberte-financiere.html')] },
    { id: 'liberte', mots: ['libre financierement', 'liberte financiere', 'independance financiere', 'rentier', 'arreter de travailler', 'vivre de mes revenus', 'revenus passifs'], c: 'Vous visez la liberté financière.',
      o: ['Ma liberté financière', 'Combien me faut-il ?', 'liberte-financiere.html', 'Le calcul du capital qui paie vos dépenses, et le chemin pour y arriver.', 'Faire le calcul'],
      a: [A('Toutes les façons d’investir', 'Les moyens', 'Bourse, obligations, immobilier, activité.', 'investir.html')] },
    { id: 'diaspora', mots: ['etranger', 'diaspora', 'en france', 'en europe', 'au canada', 'aux etats unis', 'envoyer de l argent', 'envoyer au pays', 'depuis l exterieur', 'transfert', 'au pays'], c: 'Vous êtes à l’étranger et vous voulez agir au pays.',
      o: ['Cotiser depuis l’étranger', 'Mon argent au pays', 'cotiser-depuis-l-etranger.html', 'Les frais d’envoi, le change et les bons réflexes pour que votre argent serve à ce que vous avez décidé.', 'Commencer'],
      a: [A('Acheter un terrain', 'Un projet au pays ?', 'Les papiers à vérifier à distance.', 'acheter-un-terrain.html'), A('Déclic', 'Une activité au pays ?', 'Des idées selon votre budget.', 'generateur-de-projet.html')] },
    { id: 'reserve', mots: ['imprevu', 'imprevus', 'urgence', 'reserve', 'coup dur', 'securite', 'ou garder', 'ou mettre mon argent', 'compte epargne', 'livret', 'compte bancaire', 'ouvrir un compte', 'quelle banque'], c: 'Vous voulez mettre votre argent à l’abri des imprévus.',
      o: ['Où garder sa réserve', 'Banque, microfinance ou mobile money', 'ou-garder-sa-reserve.html#calcul', 'Combien garder de côté, et où, pour qu’il soit disponible le jour où vous en avez besoin.', 'Calculer ma réserve'],
      a: [A('Combien garder quand l’argent arrive ?', 'Le calculateur', 'La part à mettre de côté à chaque rentrée.', 'cercle-spirale.html')] },
    { id: 'epargner', mots: ['epargner', 'epargne', 'mettre de cote', 'economiser', 'economies', 'garder de l argent'],
      c: function (m) { return m ? 'Vous gagnez ou disposez de <b>' + m.txt + '</b> et vous voulez épargner.' : 'Vous voulez réussir à épargner.'; },
      o: ['Épargner : par où commencer', 'Mettre de côté, même un peu', 'epargner.html', 'Les méthodes qui marchent avec des revenus irréguliers et une famille à soutenir.', 'Commencer'],
      a: [A('Voir clair', 'Trouver la somme', 'Ce que vous pouvez mettre de côté chaque mois.', 'ou-est-passe-mon-argent.html'), A('Où garder sa réserve', 'Ensuite', 'Le bon endroit pour cet argent.', 'ou-garder-sa-reserve.html')] },
    { id: 'placer', mots: ['placer', 'placement', 'placements', 'fructifier', 'rapporter', 'investir', 'investissement', 'faire travailler', 'rendement', 'interets'],
      c: function (m) { return m ? 'Vous voulez faire travailler <b>' + m.txt + '</b>.' : 'Vous voulez faire travailler votre argent.'; },
      o: ['Toutes les façons d’investir', 'Choisir où placer', 'investir.html', 'Bourse, obligations, immobilier, assurance, activité : ce que chacun rapporte, ce qu’il risque, à partir de combien.', 'Comparer les placements'],
      a: [A('DAT et emprunts d’État', 'Le plus simple', 'Comparer ce que rapporte une épargne bloquée.', 'dat-emprunts-etat.html#calcul'), A('Ma BRVM', 'À la Bourse', 'Ce qu’aurait donné cette somme.', function (m) { return 'ma-brvm.html' + (m ? '?m=' + m.v : ''); })] },
    { id: 'voirclair', mots: ['ou passe', 'ou va mon argent', 'ou est passe', 'depense', 'depenses', 'fin du mois', 'fin de mois', 'budget', 'salaire', 'je n arrive pas', 'rien ne reste', 'gerer mon argent', 'mon argent part', 'fauche', 'gerer mes sous', 'mes sous', 'gerer mon salaire', 'joindre les deux bouts', 'ne reste rien', 'il ne reste', 'finit le', 'avant la fin'], c: 'Vous voulez savoir où passe votre argent et ce qu’il vous reste.',
      o: ['Voir clair', 'Où est passé mon argent ?', 'ou-est-passe-mon-argent.html', 'Cinq questions pour repérer où part votre argent, puis le bilan avec vos chiffres. C’est le point de départ de toute autre décision.', 'Comprendre mon mois'],
      a: [A('Mon budget à zéro', 'L’outil suivant', 'Donner une mission à chaque franc.', 'outil-budget.html'), A('Où est passé mon argent ?', 'Pour aller plus loin : l’atelier', 'Trouver les fuites et décider où va l’argent.', 'atelier-ou-passe-mon-argent.html')] },
    { id: 'etudiant', mots: ['etudiant', 'etudiante', 'etudiants', 'mon ecole', 'campus', 'bourse d etudes', 'jeune diplome', 'premier salaire', 'premier emploi'], c: 'Vous êtes étudiant ou vous débutez dans la vie active.',
      o: ['Pass Étudiant', 'EFA pour les étudiants', 'etudiants.html', 'L’accès gratuit aux parcours EFA, demandé par votre école.', 'Voir le Pass'], a: [A('Finances personnelles', 'L’atelier pour démarrer', 'Les bases, dès le premier revenu.', 'atelier-finances-personnelles.html')] },
    { id: 'organisation', mots: ['employes', 'salaries', 'mes equipes', 'collaborateurs', 'rh', 'ressources humaines', 'mon organisation', 'notre entreprise', 'mutuelle', 'ong', 'former mon personnel', 'comite d entreprise', 'partenariat', 'publicite'], c: 'Vous cherchez un programme pour une organisation.',
      o: ['Pour les organisations', 'Former vos équipes à l’argent', 'organisations.html', 'Des programmes d’éducation financière pour les salariés, les membres ou les étudiants de votre organisation.', 'Voir les programmes'],
      a: [A('Composer mon programme', 'Sur mesure', 'Choisir les modules.', 'programme-organisation.html'), A('Espaces partenaires', 'Annoncer sur EFA', 'Présenter votre offre à nos lecteurs.', 'partenaires.html')] },
    { id: 'certificat', mots: ['certificat', 'certificats', 'attestation', 'cefa', 'certification', 'diplomant'], c: 'Vous voulez valider vos acquis.',
      o: ['Le certificat CEFA', 'Valider mon parcours', 'certificat-cefa.html', 'Le certificat EFA atteste que vous avez suivi les parcours et réussi les épreuves.', 'Voir le certificat'], a: [A('L’école EFA', 'Les parcours', 'Fondations, Maîtrise, Patrimoine.', 'parcours.html')] },
    { id: 'abonnement', mots: ['abonner', 'abonnement', 'combien coute', 'tarif', 'tarifs', 'prix d efa', 'payant', 'gratuit', 'cle d acces', 'code d acces', 'payer efa', 'formule'], c: 'Vous voulez connaître les formules EFA.',
      o: ['L’abonnement EFA', 'Les formules et les prix', 'abonnement.html', 'Ce qui est gratuit, ce qui est inclus dans chaque formule, et comment payer.', 'Voir les formules'], a: [A('J’ai un code', 'Mon organisation m’a inscrit', 'Rejoindre le programme.', 'rejoindre.html')] },
    { id: 'elysee', mots: ['elysee', 'rendez vous', 'coach', 'coaching', 'parler a quelqu un', 'conseiller', 'etre accompagne', 'accompagnement', 'vous contacter', 'contact', 'vous ecrire', 'qui etes vous', 'fondateur'], c: 'Vous voulez échanger avec Élysée Johnson ou l’équipe.',
      o: ['Rendez-vous avec Élysée', 'Échanger directement', 'rendez-vous.html', 'Prendre rendez-vous, écrire à l’équipe, ou présenter le besoin de votre organisation.', 'Prendre contact'],
      a: [A('Ateliers avec Élysée Johnson', 'Être coaché', 'Les ateliers animés par Élysée.', 'ateliers-elysee.html'), A('À propos', 'Qui sommes-nous', 'EFA et son fondateur.', 'auteur.html')] },
    { id: 'lire', mots: ['livre', 'livres', 'lire', 'lecture', 'bibliotheque', 'podcast', 'ecouter', 'video', 'serie', 'tribune'], c: 'Vous voulez lire ou écouter sur l’argent.',
      o: ['La bibliothèque EFA', 'Les livres qui comptent', 'bibliotheque.html', 'Les livres résumés par EFA, avec ce qu’il faut en retenir pour nos réalités.', 'Ouvrir la bibliothèque'],
      a: [A('Le podcast EFA', 'À écouter', 'Des épisodes de quelques minutes.', 'podcast.html'), A('Les tribunes d’Élysée Johnson', 'À lire', 'Les prises de position.', 'tribunes.html')] },
    { id: 'etudesefa', mots: ['etude efa', 'vos etudes', 'prospective', '2075', 'statistiques', 'chiffres de la tontine', 'enquete', 'recherche sur'], c: 'Vous cherchez les études et la prospective d’EFA.',
      o: ['Études et prospective', 'Les données d’EFA', 'etudes-prospective.html', 'Les études d’EFA sur la tontine et l’argent en Afrique, et la revue Africa 2075.', 'Voir les études'], a: [A('Africa 2075', 'La prospective', 'Les frontières de croissance.', 'africa-2075.html')] },
    { id: 'apprendre', g: 1, mots: ['apprendre', 'formation', 'formations', 'me former', 'cours', 'atelier', 'ateliers', 'comprendre la finance', 'education financiere', 'debuter', 'debutant', 'les bases'], c: 'Vous voulez apprendre à votre rythme.',
      o: ['Apprendre', 'Seul ou accompagné', 'apprendre.html', 'Deux façons d’avancer : seul, avec l’école EFA, les cours gratuits et la bibliothèque ; ou accompagné, avec les ateliers et le coaching.', 'Choisir ma façon d’apprendre'],
      a: [A('L’école EFA', 'Apprendre seul', 'Le parcours complet, du diagnostic au patrimoine.', 'parcours.html'), A('Les ateliers EFA', 'Être accompagné', 'Des ateliers courts, par thème.', 'ateliers.html'), DIAG] },
    { id: 'diagnostic', g: 1, mots: ['par ou commencer', 'je ne sais pas', 'ou j en suis', 'faire le point', 'diagnostic', 'perdu', 'aide moi', 'aidez moi', 'conseil', 'que faire'], c: 'Vous ne savez pas par où commencer.',
      o: ['Mon diagnostic', 'Savoir où j’en suis', 'diagnostic.html', 'Six minutes sur votre budget, votre épargne, vos dettes, vos tontines et ce que vous donnez à vos proches. À la fin : votre prochain pas.', 'Faire mon diagnostic'],
      a: [A('Voir clair', 'Le premier outil', 'Où passe votre argent, en cinq questions.', 'ou-est-passe-mon-argent.html')] }
  ];

  /*REPONSES*/ var REP = {
 "richesse": "Vous voulez devenir riche. Commençons par ce que vous avez, puis construisons ce qui peut grandir. La richesse ne vient pas d’un coup de chance : elle vient d’un écart régulier entre ce que vous gagnez et ce que vous dépensez, placé dans ce qui prend de la valeur, une activité à vous, des placements, des compétences. Trois étapes, dans l’ordre : dégager une somme chaque mois, la protéger, puis la faire travailler.",
 "businessplan": "Un business plan ne tient que si ses trois chiffres tiennent : combien de clients par jour, à quel prix, pour quel coût. Divisez par deux vos ventes prévues : si le projet survit, il est solide ; sinon, c’est cette hypothèse qu’il faut tester sur le terrain avant de dépenser. Un plan qui résiste à ce test est une base pour bâtir, et pour convaincre un associé ou une banque.",
 "rentable": "Le chiffre d’affaires n’est pas un gain. Ce que l’activité gagne, c’est ce qui reste après les achats, le loyer, le transport, les salaires et votre propre paie. Tant que la caisse de l’activité et votre poche sont mélangées, il est impossible de le savoir. Une activité dont vous connaissez le vrai gain est une activité que vous pouvez faire grandir.",
 "valo": "Une entreprise vaut ce qu’elle peut rapporter demain, pas ce qu’elle a coûté. On l’estime à partir du bénéfice régulier, de ce qu’elle possède et de ce qu’elle doit. Trois années de chiffres propres pèsent plus que n’importe quel discours. Connaître cette valeur, c’est savoir ce que vous êtes en train de bâtir.",
 "lancer": "Ne mettez pas toute la somme d’un coup. Gardez d’abord de quoi vivre trois mois, puis testez l’idée en petit, sur quelques semaines : c’est le marché qui dit si elle marche, pas le calcul. Une bonne idée est celle que vous savez déjà vendre à quelqu’un de précis. Les grandes entreprises d’ici ont commencé par un premier client : la vôtre aussi peut grandir.",
 "arnaque": "Trois signaux suffisent pour s’arrêter : un rendement garanti, une urgence à verser, un gain qui dépend des personnes que vous faites entrer. Aucun placement sérieux ne promet un pourcentage fixe par mois. Demandez l’agrément et vérifiez-le vous-même auprès du régulateur.",
 "actu": "Une actualité ne vaut que par ce qu’elle change pour vous : vos prix, votre crédit, votre épargne. EFA News reprend chaque fait avec ses chiffres, le mécanisme derrière, et la question à vous poser. Qui comprend l’actualité de l’argent voit venir les occasions avant les autres.",
 "sgi": "On n’achète pas une action directement à la Bourse (BRVM) : il faut un compte chez une SGI, la société agréée qui passe vos ordres. Comparez trois choses avant de choisir : les frais par ordre, les droits de garde par an, et la facilité à suivre votre compte. Ce compte est votre porte d’entrée pour devenir copropriétaire des grandes entreprises de la région.",
 "fcp": "Un fonds (FCP ou SICAV) réunit l’argent de plusieurs épargnants ; un gérant achète pour eux des actions ou des obligations. Vous y gagnez la diversification et le temps ; vous payez des frais de gestion chaque année. Regardez la composition du fonds, ses frais et sa durée conseillée. C’est une façon simple de mettre son épargne au travail dès les premiers milliers de francs.",
 "analyse": "Avant le cours, regardez l’entreprise : gagne-t-elle de l’argent chaque année, que distribue-t-elle, est-elle endettée ? Le PER compare le prix au bénéfice ; le rendement compare le dividende au prix. Un ratio seul ne dit rien : comparez-le aux sociétés du même secteur. Savoir lire une société, c’est choisir en propriétaire, pas en parieur.",
 "grossesomme": "Quand une somme arrive, la décision se prend avant, pas après. Une règle simple : une part pour ce que vous devez, une part mise à l’abri tout de suite, une part pour vous faire plaisir sans remords. Ce qui n’a pas de mission disparaît en quelques semaines. Bien répartie, une somme qui arrive devient le premier étage de votre patrimoine.",
 "bourse": "Acheter une action, c’est devenir copropriétaire d’une entreprise : vous gagnez si son cours monte et si elle verse des dividendes, vous perdez si elle recule. Le résultat dépend beaucoup de la date d’achat et de la durée. N’y mettez que l’argent dont vous n’aurez pas besoin avant plusieurs années. Sur la durée, c’est l’un des moyens de faire grandir un patrimoine avec les entreprises d’Afrique.",
 "obligations": "Avec une obligation ou un dépôt à terme, vous prêtez votre argent pour une durée fixée, contre un intérêt connu à l’avance. Le rendement est plus bas que l’espoir d’une action, mais plus prévisible. Vérifiez la durée de blocage, l’impôt sur les intérêts et ce qui se passe si vous sortez avant le terme. C’est le socle tranquille d’un patrimoine : l’argent qui travaille pendant que vous bâtissez ailleurs.",
 "assurance": "Une assurance ne se juge pas à sa prime mais à ce qu’elle paie vraiment, à qui et dans quel délai. Lisez les exclusions avant le reste. Pour l’assurance-vie, demandez les frais sur chaque versement et la valeur de rachat après un, trois et huit ans. Bien choisie, elle protège ce que vous êtes en train de construire.",
 "terrain": "On ne paie pas un terrain avant d’avoir vérifié trois choses : qui en est le propriétaire sur les papiers, si le lot existe bien au plan officiel, et s’il n’a pas déjà été vendu. Faites vérifier par un professionnel indépendant du vendeur, et payez par étapes, contre un écrit à chaque fois. Un terrain acheté dans les règles est un patrimoine que l’on transmet.",
 "deces": "Dans les premiers jours, ne signez rien et ne partagez rien dans l’urgence. Réunissez d’abord les papiers : acte de décès, pièces du défunt, comptes, contrats, titres de propriété. Les banques, l’employeur et les caisses de retraite ont chacun une démarche ; la liste des héritiers se règle ensuite, par écrit.",
 "etudes": "Les études se préparent comme une dépense certaine, pas comme une surprise de septembre. Divisez la somme de l’année par douze et mettez-la de côté chaque mois, sur un compte séparé. Plus l’échéance est lointaine, plus une épargne placée peut vous aider ; à moins de deux ans, gardez cet argent disponible. C’est un investissement : celui qui fait grandir la génération suivante.",
 "enfant": "Un enfant change trois lignes du budget : la santé, la garde et, plus tard, l’école. Chiffrez les dépenses des six premiers mois avant la naissance, mettez la somme de côté petit à petit, et vérifiez ce que couvrent votre assurance et votre employeur. S’organiser maintenant, c’est déjà bâtir pour lui.",
 "preter": "Ne prêtez que ce que vous pouvez vous permettre de ne jamais revoir. Dites un montant, une date et une façon de rembourser, et écrivez-les : ce n’est pas un manque de confiance, c’est ce qui protège la relation. Vous avez aussi le droit de donner moins, ou de dire non.",
 "famille": "Aider les siens n’est pas une faute de gestion, c’est une charge à prévoir comme le loyer. Fixez une enveloppe mensuelle pour la famille, annoncez-la, et tenez-vous-y : ce qui épuise, ce sont les demandes sans limite, pas la solidarité.",
 "mobilemoney": "Le mobile money rend chaque petite dépense invisible : 500 F ici, 1 000 F là, et le mois s’évapore. Gardez un compte pour les dépenses et un autre où l’argent ne sort pas, et regardez l’historique une fois par semaine : c’est votre relevé. Chaque franc que vous voyez passer est un franc que vous pouvez mettre au travail.",
 "inflation": "Quand les prix montent, le même billet achète moins : c’est l’inflation. Un argent qui dort perd donc de la valeur sans que le solde bouge. La réponse n’est pas de dépenser plus vite, mais de savoir quelles dépenses augmentent et de faire travailler l’épargne qui peut attendre. L’argent qui travaille est celui qui garde sa valeur, et qui en gagne.",
 "dette": "Commencez par tout écrire : à qui, combien, pour quand, à quel coût. Payez d’abord ce qui coûte le plus cher ou menace le plus. Parlez à vos créanciers avant l’échéance, avec une proposition chiffrée : un échéancier tenu vaut mieux qu’une promesse intenable.",
 "credit": "Le prix d’un crédit n’est pas son taux, c’est le total que vous aurez remboursé à la fin : intérêts, frais de dossier, assurance. Comparez deux offres sur ce total et sur la mensualité. Un crédit se justifie pour ce qui rapporte ou dure plus longtemps que le remboursement. Bien utilisé, un crédit est un levier pour bâtir plus vite ; mal utilisé, un poids.",
 "tontine": "Une tontine est une épargne forcée et un crédit entre membres : les premiers à recevoir empruntent aux autres, les derniers leur prêtent. Elle tient par la confiance et par des règles claires : qui garde l’argent, que se passe-t-il si quelqu’un ne cotise plus, dans quel ordre on reçoit. Bien tenue, une tontine peut devenir le premier capital d’un projet, et même un club d’investissement.",
 "retraite": "La pension ne remplacera qu’une partie de votre revenu. Estimez-la dès maintenant, comparez-la à vos dépenses futures, et comblez l’écart par une épargne régulière : plus vous commencez tôt, moins l’effort mensuel est lourd. Ce que vous mettez de côté aujourd’hui est le patrimoine qui travaillera pour vous demain.",
 "liberte": "Être libre financièrement, c’est avoir des revenus qui paient vos dépenses sans dépendre de votre salaire. Le chiffre à connaître est donc celui de vos dépenses annuelles. On y arrive par étapes : une réserve, puis une épargne régulière, puis des placements et des activités qui rapportent. C’est un objectif à votre portée, à condition de commencer.",
 "diaspora": "L’argent envoyé au pays perd de la valeur à chaque étape : frais d’envoi, change, et parfois un autre usage que celui prévu. Comparez les frais, envoyez directement à celui qui doit être payé quand c’est possible, et pour tout projet, exigez des justificatifs et un tiers de confiance sur place. Bien organisé, l’argent de la diaspora ne fait pas que soutenir : il bâtit.",
 "reserve": "La réserve de sécurité est l’argent des coups durs : visez d’abord un mois de dépenses, puis trois. Elle doit être disponible en quelques jours et séparée de l’argent du quotidien. Elle ne se place pas en Bourse : son rôle est d’être là, pas de rapporter. C’est elle qui vous permettra d’oser un projet ou un placement sans mettre votre famille en danger.",
 "epargner": "On n’épargne pas ce qui reste, on met de côté dès que l’argent arrive. Commencez petit, même 5 % du revenu, mais à chaque rentrée et sur un compte séparé. Le montant compte moins que la régularité. Cette habitude est la première pierre de tout patrimoine.",
 "placer": "Avant de placer, répondez à trois questions : quand aurez-vous besoin de cet argent, combien pouvez-vous supporter de le voir baisser, et comprenez-vous comment il rapporte ? L’argent utile avant deux ans reste disponible ; le reste peut être réparti entre plusieurs placements, jamais un seul. C’est ainsi qu’une épargne devient un patrimoine.",
 "voirclair": "L’argent ne disparaît pas, il part dans des postes que l’on ne regarde pas : petites dépenses quotidiennes, aide aux proches, engagements oubliés. Notez tout pendant un mois, classez en quatre ou cinq postes, et vous verrez où agir. C’est le premier pas de toute décision. Ce que vous dégagerez est la matière première de tout ce que vous voulez bâtir.",
 "etudiant": "Le premier revenu est le meilleur moment pour prendre les bons réflexes : mettre de côté dès que l’argent arrive, noter ses dépenses, et ne pas s’endetter pour paraître. De petites sommes épargnées tôt pèsent lourd plus tard. Vous avez l’atout le plus précieux pour devenir riche : le temps.",
 "organisation": "Un salarié inquiet pour son argent travaille moins bien et s’endette auprès de son employeur. Un programme d’éducation financière en entreprise porte sur le budget, le crédit, l’épargne et la retraite, avec des cas concrets. Une équipe à l’aise avec son argent construit, pour elle et pour l’entreprise.",
 "certificat": "Le certificat EFA atteste d’un parcours suivi et d’épreuves réussies : la preuve que vous savez appliquer les notions à des cas réels.",
 "abonnement": "Sur EFA, on commence gratuitement : outils, guides, actualité. Les formules d’abonnement ouvrent l’accès aux ateliers ; le détail et les prix sont sur la page.",
 "elysee": "Élysée Johnson a fondé EFA après un parcours en banque d’investissement, en conseil et en capital-investissement. Vous pouvez suivre ses ateliers, lui écrire, ou demander un rendez-vous.",
 "lire": "Un bon livre sur l’argent change une habitude, pas seulement une idée. EFA résume les ouvrages qui comptent et en tire ce qui s’applique à nos réalités.",
 "etudesefa": "EFA publie ses propres études sur la tontine, l’épargne et la Bourse en Afrique, avec leurs sources, et une revue de prospective, Africa 2075.",
 "apprendre": "La finance s’apprend comme une langue : un peu chaque jour, sur des situations réelles. Commencez par ce qui vous concerne aujourd’hui, pas par la théorie. Ce que vous apprenez aujourd’hui est ce que vous saurez faire grandir demain.",
 "diagnostic": "Avant de chercher le bon placement ou la bonne idée, il faut savoir d’où l’on part : ce qui entre, ce qui sort, ce que l’on doit, ce que l’on a de côté. Le diagnostic pose ces questions dans l’ordre et vous dit par quoi commencer. Savoir d’où l’on part, c’est déjà commencer à bâtir."
};

  function plat(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`\-]/g, ' ').replace(/[?!.,;:«»"()]/g, ' ').replace(/\s+/g, ' ').trim(); }

  // Montant : « 500 000 F », « 500000 », « 500k », « 2 millions », « 1,5 M »
  function montant(q) {
    var s = plat(String(q).replace(/[.,](?=\d{3}\b)/g, '')).replace(/(\d) (?=\d{3}\b)/g, '$1');
    var m = s.match(/(\d+(?:[.,]\d+)?) ?(millions?|m\b|k\b|mille)? ?(f\b|fcfa|francs?|cfa)?/);
    if (!m) return null;
    var v = parseFloat(m[1].replace(',', '.')), u = m[2] || '';
    if (/^m(illion)?/.test(u) && u !== 'mille') v *= 1e6; else if (u === 'k' || u === 'mille') v *= 1e3;
    if (!(v >= 1000)) return null;
    v = Math.round(v);
    return { v: v, txt: String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' F' };
  }

  function comprendre(q) {
    var p = ' ' + plat(q) + ' ', best = null;
    I.forEach(function (it) {
      var sc = 0;
      it.mots.forEach(function (w) { if (p.indexOf(' ' + w + ' ') >= 0 || (w.length > 4 && p.indexOf(' ' + w) >= 0)) sc += w.indexOf(' ') > 0 ? 3 : 1; });
      if (it.g) sc *= 0.3; // besoin général : ne l'emporte que si rien de plus précis n'est reconnu
      if (sc && (!best || sc > best.sc)) best = { it: it, sc: sc };
    });
    return best ? best.it : null;
  }

  /* Recherche dans l'index de tout le site */
  var VIDES = {}; 'le la les un une des de du d et ou a au aux en dans sur pour par avec sans que qui quoi est ce c je j ai mon ma mes me m se son sa ses il elle on nous vous ne pas plus tres comment combien pourquoi quel quelle quels quelles faire fais veux veut peux peut dois doit suis etre avoir ca cela si y l qu est-ce bien bon mois annee an ans jour serieux vraiment faut entrer'.split(' ').forEach(function (w) { VIDES[w] = 1; });
  function racine(w) { return w.length > 4 ? w.replace(/(es|s|x|er|ez|ee)$/, '') : w; }
  function mots(q) { return plat(q).split(' ').filter(function (w) { return w.length > 2 && !VIDES[w] && !/^\d+$/.test(w); }).map(racine); }
  function chercher(q, IDX, n) {
    var W = mots(q); if (!W.length) return [];
    var R = [];
    IDX.forEach(function (f) {
      if (!f._t) { f._t = ' ' + plat(f.t) + ' '; f._d = ' ' + plat(f.d) + ' ' + plat(f.h) + ' '; f._p = plat(f.p.replace(/\.html$/, '')); }
      var sc = 0, n1 = 0;
      W.forEach(function (w) {
        var a = f._t.indexOf(' ' + w) >= 0, b = f._p.indexOf(w) >= 0, c = f._d.indexOf(' ' + w) >= 0;
        if (a || b || c) n1++;
        sc += (a ? 5 : 0) + (b ? 3 : 0) + (c ? 1.5 : 0);
      });
      if (!sc) return;
      sc *= (0.5 + n1 / W.length);
      if (f.f === 'actu') sc *= 0.4; else if (f.f === 'atelier') sc *= 0.85;
      R.push({ f: f, sc: sc });
    });
    R.sort(function (a, b) { return b.sc - a.sc; });
    return R.slice(0, n || 6).map(function (x) { return x.f; });
  }

  /* Écran de réponse */
  var GENRE = { atelier: 'Atelier', actu: 'EFA News', argent: 'Mon argent', activite: 'Mon activité', bourse: 'Bourse (BRVM)', tontine: 'Tontine', famille: 'Famille et moments de vie', former: 'Me former', media: 'Études et média', espaces: 'Espaces', efa: 'EFA' };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function url(u, m) { return typeof u === 'function' ? u(m) : u; }
  function page() {
    var q = (new URLSearchParams(location.search).get('q') || '').trim(), box = document.getElementById('pp-rep'), inp = document.getElementById('pp-q');
    inp.value = q; if (TAILLE) TAILLE(); else setTimeout(function () { inp.dispatchEvent(new Event('input')); }, 50);
    var it = q ? comprendre(q) : null, m = q ? montant(q) : null, h = '', deja = {};
    if (it) {
      var c = typeof it.c === 'function' ? it.c(m) : it.c, o = it.o, pq = o[3].replace('{m}', m ? ' (' + m.txt + ')' : '');
      deja[url(o[2], null).split(/[?#]/)[0]] = 1;
      h += '<div class="pp-compris"><p class="pp-k">Voici ce que j’ai compris</p><p>' + c + '</p></div>';
      if (REP[it.id]) h += '<div class="pp-bref"><p class="pp-k">La réponse en bref</p><p>' + REP[it.id] + '</p></div>';
      h += '<div class="pp-reco"><div><p class="pp-k">Pour l’appliquer à votre cas</p><h2>' + esc(o[0]) + '</h2><p class="pp-sur">' + esc(o[1]) + '</p><p>' + pq + '</p></div><a class="pp-cta" href="' + url(o[2], m) + '">' + esc(o[4]) + ' →</a></div>';
      if (it.a.length) h += '<div class="pp-deux">' + it.a.map(function (a) { deja[url(a.url, null).split(/[?#]/)[0]] = 1; return '<a class="pp-carte" href="' + url(a.url, m) + '"><p class="pp-k">' + esc(a.t) + '</p><h3>' + esc(a.nom) + '</h3><p>' + esc(a.d) + '</p><span class="pp-lien">Ouvrir →</span></a>'; }).join('') + '</div>';
    } else {
      h += '<div class="pp-compris"><p class="pp-k">' + (q ? 'Je n’ai pas trouvé d’outil dédié' : 'Posez votre question') + '</p><p>' + (q ? 'Pour « ' + esc(q) + ' », voici ce qu’EFA a de plus proche. Vous pouvez aussi reformuler.' : 'Écrivez ce que vous cherchez à faire avec votre argent.') + '</p></div>';
    }
    h += '<div id="pp-trouve"></div>';
    h += '<div class="pp-autres"><h3>' + (it ? 'Ce n’est pas tout à fait ça ?' : 'Les demandes les plus fréquentes') + '</h3><div class="pp-chips">' +
      ['voirclair', 'lancer', 'bourse', 'epargner', 'credit', 'tontine', 'terrain', 'arnaque'].filter(function (id) { return !it || it.id !== id; }).map(function (id) { var x = I.filter(function (z) { return z.id === id; })[0]; return '<a href="' + url(x.o[2], null) + '">' + esc(x.o[1]) + '</a>'; }).join('') + '</div></div>';
    h += '<p class="pp-ely">Vous ne savez pas par où commencer ? <a href="diagnostic.html">Faites votre diagnostic</a> (6 min). Besoin d’en parler ? <a href="ely.html">Posez votre question à Ely</a>, le guide d’EFA. Ou parcourez <a href="index.html#tout-efa">tout EFA, par besoin</a>.</p>';
    box.innerHTML = h;
    if (!q) return;
    fetch('data/tout-efa.json').then(function (r) { return r.json(); }).then(function (IDX) {
      var R = chercher(q, IDX, 9).filter(function (f) { return !deja[f.p]; }).slice(0, 6);
      if (!R.length) return;
      document.getElementById('pp-trouve').innerHTML = '<div class="pp-trouve"><h3>' + (it ? 'Dans tout EFA, sur votre question' : 'Ce qu’EFA a sur votre question') + '</h3><div class="pp-res">' +
        R.map(function (f) { return '<a class="pp-r" href="' + f.p + '"><small>' + esc(GENRE[f.f] || '') + '</small><b>' + esc(f.t) + '</b>' + (f.d ? '<span>' + esc(f.d.length > 120 ? f.d.slice(0, 118) + '…' : f.d) + '</span>' : '') + '</a>'; }).join('') + '</div></div>';
    }).catch(function () {});
  }

  /* Zone de question : elle grandit avec le texte, « Entrée » envoie la question */
  function zone() {
    var z = document.getElementById('pp-q'); if (!z || z.tagName !== 'TEXTAREA') return;
    function taille() { z.style.setProperty('height', 'auto', 'important'); z.style.setProperty('height', (z.scrollHeight + 2) + 'px', 'important'); }
    z.addEventListener('input', taille);
    z.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (z.form.requestSubmit) z.form.requestSubmit(); else z.form.submit(); } });
    window.addEventListener('resize', taille); setTimeout(taille, 0); setTimeout(taille, 400);
    return taille;
  }
  var TAILLE = null;
  if (typeof document === 'undefined') { /* contrôle hors navigateur */ } else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { TAILLE = zone(); }); else TAILLE = zone();

  window.EFA_PROCHAIN_PAS = { REP: REP, comprendre: comprendre, montant: montant, chercher: chercher, page: page, INTENTS: I };
})();
