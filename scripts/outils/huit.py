# Les 8 outils EFA (décidé le 21 novembre 2026) : une grande décision = un outil.
# Chaque outil enchaîne, en étapes, des outils qui existaient déjà : rien n'est supprimé, aucune adresse ne change.
# Les 100 entrées de specs.CENT sont toutes rangées : 81 dans un des 8 outils, 19 « autour » (commencer, apprendre, suivre, organisations).
# Une étape : (page, nom, ce qu'on y fait, [numéros des 100], section facultative).

HUIT = [
 dict(id='voir-clair', f='voir-clair', nom='Voir clair', q='Où va mon argent, et combien me reste-t-il ?', ic='wallet',
      s='Retrouvez où est passé votre argent, ce qu’il vous reste vraiment, puis donnez une mission à chaque franc.',
      etapes=[
       ('ou-est-passe-mon-argent.html', 'Où est passé mon argent ?', 'Retrouver où est allé l’argent du mois, poche par poche.', [1, 6, 10]),
       ('mon-vrai-reste.html', 'Mon vrai reste', 'Ce qu’il reste après toutes les obligations, et si le mois tourne mal.', [2, 18, 19]),
       ('outil-budget.html', 'Mon budget à zéro', 'Donner une mission à chaque franc dès qu’il arrive.', [3, 5]),
       ('separer-les-poches.html', 'Séparer les poches', 'Quotidien, sécurité, projets ; seul, à deux ou en famille.', [4, 34, 35]),
       ('engagements-et-exceptions.html', 'Mes échéances', 'Ce qui part avant que vous choisissiez.', [9, 29]),
       ('budget-mobile-money.html', 'Mon mois mobile money', 'Transferts, retraits et frais additionnés.', [7]),
       ('construire-son-budget.html', 'Mon revenu variable', 'Un budget qui tient les bons et les mauvais mois.', [8])],
      plus=['atelier-ou-passe-mon-argent.html', 'atelier-budget-zero.html', 'atelier-budget-qui-tient.html', 'atelier-mobile-money-frais.html']),
 dict(id='ma-reserve', f='ma-reserve', nom='Ma réserve', q='Combien mettre de côté, et où le garder ?', ic='epargne',
      s='Trouvez le montant que vous pouvez garder à chaque rentrée, le palier de sécurité à atteindre et l’endroit où le placer.',
      etapes=[
       ('epargner.html', 'Combien mettre de côté ?', 'Un montant soutenable à chaque rentrée, même avec peu.', [12]),
       ('ou-garder-sa-reserve.html#calcul', 'Ma réserve', 'Le premier palier de sécurité, et où le garder.', [11, 17]),
       ('cercle-spirale.html', 'Ma grosse rentrée', 'Répartir une prime, un héritage ou un tour de tontine.', [14]),
       ('dat-emprunts-etat.html#calcul', 'Faire travailler ma réserve', 'Dépôt à terme ou emprunt d’État : ce que vous touchez vraiment.', []),
       ('atelier-reserve-securite.html', 'Le défi 30 jours', 'Une action d’épargne simple, suivie chaque semaine.', [20])],
      plus=['atelier-epargner-ne-suffit-pas.html', 'atelier-grosse-somme.html', 'atelier-court-terme.html', 'atelier-choisir-sa-microfinance.html']),
 dict(id='mes-dettes', f='mes-dettes-et-credits', nom='Mes dettes', q='Emprunter, rembourser, renégocier : que faire ?', ic='credit',
      s='Rassemblez vos dettes, voyez ce qu’un crédit coûte vraiment et choisissez l’ordre pour en sortir.',
      etapes=[
       ('mes-dettes.html', 'Mes dettes classées', 'Toutes vos dettes, et l’ordre pour les rembourser.', [21, 22, 25]),
       ('cout-total-credit.html#calcul', 'Le vrai coût d’un crédit', 'Tout ce qui sera payé, et si la mensualité tient.', [23, 24]),
       ('decider.html', 'Crédit ou épargne ?', 'Deux chemins pour financer un achat.', [27]),
       ('consommer-et-acheter.html', 'Mon crédit chez le commerçant', 'Le prix total d’un paiement échelonné.', [28]),
       ('renegocier-une-dette.html', 'Renégocier ma dette', 'Les chiffres et les questions à présenter.', [26])],
      plus=['atelier-sortir-dettes.html', 'atelier-cout-reel-de-mon-credit.html', 'atelier-quand-le-credit-va-mal.html', 'atelier-eviter-le-surendettement.html']),
 dict(id='famille-tontine', f='famille-et-tontine', nom='Famille et tontine', q='Aider, prêter, cotiser : jusqu’où ?', ic='famille',
      s='Aidez vos proches sans vous mettre en difficulté, et faites de votre tontine une décision, pas une habitude.',
      etapes=[
       ('puis-je-aider.html', 'Puis-je aider ce mois-ci ?', 'Chiffrer une aide sans déséquilibrer son budget.', [31, 33], 'Ma famille'),
       ('preter-a-un-proche.html', 'Prêter à un proche', 'Montant, échéance, et si l’on ne vous rembourse pas.', [32, 30]),
       ('etudes-enfants-heritage.html', 'Les études des enfants', 'Un objectif et les versements nécessaires.', [39]),
       ('papiers-famille.html', 'Les papiers de ma famille', 'Ce que vos proches doivent pouvoir retrouver.', [40]),
       ('avant-de-cotiser.html', 'Avant d’entrer dans une tontine', 'Les règles du groupe passées en revue.', [37], 'Ma tontine'),
       ('tontine-formations.html', 'Notre tontine en clair', 'Cotisations, ordre des tours et engagements.', [36]),
       ('choisir-son-rang-tontine.html', 'Mon rang dans la tontine', 'Ce que chaque tour vous laisse réellement.', [15]),
       ('tontine-decider-avant-de-recevoir.html', 'Mon prochain tour', 'Décider de l’usage avant de recevoir.', [16]),
       ('atelier-tontine-spirale.html', 'La tontine devient une spirale', 'Ce qui se passe si une part reste au groupe.', [38]),
       ('club-investissement.html', 'Notre club d’investissement', 'De la tontine au club : cotisations et règles.', [95])],
      plus=['atelier-preter-ou-donner.html', 'atelier-etudes-enfant.html', 'atelier-deces-parent.html', 'atelier-tontine-bourse.html']),
 dict(id='declic', f='batir-mon-activite', nom='Déclic', q='Quelle activité lancer, et tient-elle ?', ic='bulb',
      s='Trouvez une idée à partir de votre budget, testez-la, vérifiez qu’elle gagne de l’argent et sachez ce que vaut votre entreprise.',
      etapes=[
       ('generateur-de-projet.html', 'Déclic : mon idée de business', 'Des activités à tester selon votre budget, votre temps et votre lieu.', [41]),
       ('valoriser-mon-entreprise.html', 'valo. : combien vaut mon entreprise ?', 'Une fourchette de valeur à partir de vos chiffres.', []),
       ('avec-100000-je-lance-quoi.html', 'Avec 100 000 F, je lance quoi ?', 'Des exemples concrets pour un petit budget.', []),
       ('mon-idee-test.html', 'Mon idée vaut-elle un test ?', 'Un premier client et un plan de 30 jours.', [42, 43, 50]),
       ('mon-business-plan-tient-il.html', 'Mon business plan tient-il ?', 'Démarrage, seuil de rentabilité, hypothèse fragile.', [44, 47]),
       ('atelier-activite-gagne-t-elle.html', 'Mon activité gagne-t-elle ?', 'Le prix de vente et l’argent qui reste vraiment.', [45, 46]),
       ('atelier-ou-est-l-argent-de-mon-activite.html', 'Ma trésorerie', 'Quand l’argent entre, et quand il sort.', [48]),
       ('salaire-fixe-activite.html', 'Mon salaire d’entrepreneur', 'Se payer sans vider la caisse.', [49]),
       ('projets-a-suivre.html', 'Projets à suivre', 'Présenter son projet et trouver des soutiens.', [])],
      plus=['mon-espace-business-plan.html', 'atelier-lire-business-plan.html', 'atelier-commerce-sans-comptabilite.html', 'atelier-investir-activite.html']),
 dict(id='ma-brvm', f='ma-bourse', nom='Ma BRVM', q='Investir à la Bourse (BRVM) : suis-je prêt, et comment ?', ic='bars',
      s='Vérifiez que vous êtes prêt, rejouez le passé, entraînez-vous sans argent réel, puis passez votre premier ordre.',
      etapes=[
       ('questions-avant-d-investir.html', 'Suis-je prêt à investir ?', 'Réserve, dettes et horizon passés en revue.', [51]),
       ('ma-brvm.html', 'Ma BRVM : et si j’avais investi ?', 'Rejouer un achat, comparer, simuler un achat chaque mois.', [52, 53, 54, 55, 56, 59, 76]),
       ('traders.html', 'EFA Traders : m’entraîner', 'Une première année à la Bourse, sans argent réel.', [87]),
       ('jeu-portefeuille-baisse.html', 'Une baisse de 30 % : que faire ?', 'Cinq décisions face à la baisse.', [60]),
       ('etude-frais-bourse.html', 'Mes frais de SGI', 'Ce que coûte un aller-retour en actions.', [57]),
       ('sgi-comparer.html', 'Choisir ma SGI', 'Comparer les SGI avant d’ouvrir un compte.', []),
       ('coach-bourse.html', 'Mon premier ordre', 'Du compte à l’achat, pas à pas.', [58])],
      plus=['marches.html', 'personnalite.html', 'societes.html', 'ecole-de-la-bourse.html']),
 dict(id='ma-richesse', f='ma-richesse', nom='Ma richesse', q='Comment faire grandir mon patrimoine ?', ic='terrain',
      s='Partez de ce que vous avez, voyez où vous mène votre rythme d’épargne et préparez les grandes étapes : maison, terrain, retraite.',
      etapes=[
       ('mon-patrimoine.html', 'Mon patrimoine', 'Aujourd’hui, dans dix ans, le premier million, de 1 à 10 millions.', [61, 62, 63, 64, 13], 'Mon patrimoine'),
       ('liberte-financiere.html', 'Ma liberté financière', 'Combien il vous faut pour être libre.', [65]),
       ('investir-gagner-plus.html', 'Mes sources de revenus', 'Celles qui existent et celles à construire.', [66]),
       ('preparer-ma-retraite.html', 'Ma retraite', 'L’écart entre vos ressources futures et vos besoins.', [70]),
       ('atelier-acheter-construire-attendre.html', 'Louer ou acheter ?', 'Comparer sur la durée que vous choisissez.', [67], 'Mon logement'),
       ('acheter-un-terrain.html', 'Mon terrain sans surprise', 'Budget, papiers et vérifications.', [69]),
       ('budget-chantier.html', 'Ma maison par étapes', 'Épargne, apport, mensualité et coût total.', [68])],
      plus=['investir.html', 'atelier-strategie-investissement.html', 'atelier-acheter-un-lot.html', 'atelier-placer-selon-horizon.html']),
 dict(id='avant-de-signer', f='avant-de-signer', nom='Avant de signer', q='Cette offre est-elle sûre pour mon argent ?', ic='placement',
      s='Avant de verser un franc : la promesse tient-elle, l’acteur est-il fiable, pourrez-vous récupérer votre argent ?',
      etapes=[
       ('promesse-credible.html', 'Cette promesse est-elle crédible ?', 'Examiner un rendement annoncé, et la sortie.', [71, 79]),
       ('arnaques.html', 'Avant de confier mon argent', 'Les signaux d’alerte : acteur, documents, frais.', [72]),
       ('atelier-avant-de-confier-ou-d-investir.html', 'Les mots cachés du contrat', 'Frais, pénalités, garanties et conditions.', [78]),
       ('bourse-projets.html', 'Cette offre me convient-elle ?', 'La comparer à votre objectif et à votre horizon.', [73]),
       ('decider.html', 'Une décision, trois scénarios', 'Acheter maintenant ou attendre ; favorable, central, défavorable.', [74, 75]),
       ('journal-decisions.html', 'Mon deuxième avis', 'Une grille de questions avant de vous engager.', [77])],
      plus=['se-proteger-des-arnaques.html', 'atelier-faux-conseiller.html', 'atelier-rendement-garanti.html', 'atelier-crypto-reseaux.html']),
]

# Ce qui n'est pas un outil de décision mais l'entoure.
AUTOUR = [
 ('Commencer', 'Une question, ou un point complet en quelques minutes.', [81, 82]),
 ('Apprendre', 'L’école, les quiz, les ateliers et le certificat.', [83, 84, 85, 86, 88, 91, 98, 99]),
 ('Suivre mes décisions', 'Dans Mon EFA : ce que vous avez décidé, et ce que cela a donné.', [80, 89, 90, 92, 93, 100]),
 ('Pour les organisations', 'Entreprises, écoles, groupes.', [94, 96, 97]),
]

# Les 100, écrits comme des questions.
QQ = {
 1: 'Où est passé mon argent ce mois-ci ?', 2: 'Combien me reste-t-il après toutes mes obligations ?', 3: 'Comment répartir mon salaire dès qu’il arrive ?',
 4: 'Comment séparer quotidien, sécurité et projets ?', 5: 'Comment donner une mission à chaque franc ?', 6: 'Quelles petites dépenses me vident sans que je le voie ?',
 7: 'Combien me coûte mon mobile money chaque mois ?', 8: 'Comment tenir un budget quand mon revenu varie ?', 9: 'Que devrai-je payer avant ma prochaine rentrée ?',
 10: 'Mon mois s’est-il passé comme prévu ?', 11: 'Quelle réserve de sécurité me faut-il ?', 12: 'Combien mettre de côté à chaque rentrée ?',
 13: 'En combien de temps atteindrai-je ma somme ?', 14: 'Que faire d’une prime, d’un héritage ou d’une indemnité ?', 15: 'Que me laisse réellement chaque tour de tontine ?',
 16: 'Que faire de ma tontine avant de la recevoir ?', 17: 'Où garder ma réserve : banque, microfinance ou mobile money ?', 18: 'Que se passe-t-il si mon revenu baisse ?',
 19: 'Quelles dépenses garder, reporter ou réduire en cas d’urgence ?', 20: 'Comment commencer à épargner en 30 jours ?', 21: 'Où en suis-je avec toutes mes dettes ?',
 22: 'Quelle dette rembourser en premier ?', 23: 'Combien ce crédit me coûtera-t-il au total ?', 24: 'Puis-je supporter cette mensualité ?',
 25: 'Que change un remboursement anticipé ?', 26: 'Comment renégocier ma dette ?', 27: 'Faut-il emprunter ou épargner pour cet achat ?',
 28: 'Combien coûte vraiment un paiement en plusieurs fois ?', 29: 'Quelles semaines mes paiements se cumulent-ils ?', 30: 'Que pourrais-je devoir payer si je me porte garant ?',
 31: 'Puis-je aider un proche ce mois-ci ?', 32: 'Dois-je prêter de l’argent à un proche ?', 33: 'Combien prévoir pour la famille dans mon budget ?',
 34: 'Comment organiser notre budget de couple ?', 35: 'Qui paie quoi dans une dépense commune ?', 36: 'Comment fonctionne vraiment notre tontine ?',
 37: 'Que vérifier avant d’entrer dans une tontine ?', 38: 'Et si une part de la tontine restait au groupe ?', 39: 'Comment préparer les études des enfants ?',
 40: 'Ma famille saurait-elle retrouver mes comptes et mes biens ?', 41: 'Quelle activité lancer avec mon budget ?', 42: 'Mon idée vaut-elle un test ?',
 43: 'Comment trouver mon premier client ?', 44: 'Combien coûte le démarrage ?', 45: 'À quel prix vendre ?',
 46: 'Mon activité gagne-t-elle vraiment de l’argent ?', 47: 'Combien vendre pour couvrir mes coûts ?', 48: 'Quand l’argent de mon activité entre-t-il, et quand sort-il ?',
 49: 'Combien puis-je me verser comme salaire ?', 50: 'Que faire dans les 30 premiers jours ?', 51: 'Suis-je prêt à investir ?',
 52: 'Et si j’avais investi à la Bourse (BRVM) ?', 53: 'Qu’aurait changé une autre date d’achat ?', 54: 'Laquelle de ces trois actions a le mieux tenu ?',
 55: 'Que vaut mon portefeuille aujourd’hui ?', 56: 'Mon gain vient-il du cours ou des dividendes ?', 57: 'Combien coûtent les frais de ma SGI ?',
 58: 'Comment acheter ma première action ?', 59: 'Et si j’investissais un peu chaque mois ?', 60: 'La Bourse baisse de 30 % : que faire ?',
 61: 'Que vaut mon patrimoine aujourd’hui ?', 62: 'Que vaudra mon patrimoine dans dix ans ?', 63: 'Quand aurai-je mon premier million ?',
 64: 'Comment passer de 1 à 10 millions ?', 65: 'Combien me faut-il pour être libre ?', 66: 'Quelles sources de revenus construire ?',
 67: 'Louer ou acheter ?', 68: 'Comment financer une maison à 30 millions ?', 69: 'Que vérifier avant d’acheter un terrain ?',
 70: 'Comment préparer ma retraite ?', 71: 'Cette promesse de rendement est-elle crédible ?', 72: 'Que vérifier avant de confier mon argent ?',
 73: 'Cette offre convient-elle à mon objectif ?', 74: 'Acheter maintenant ou attendre ?', 75: 'Et si cela tournait mal ?',
 76: 'Combien me coûte le fait d’attendre ?', 77: 'Ai-je posé les bonnes questions avant de décider ?', 78: 'Que cachent les petites lignes du contrat ?',
 79: 'Pourrai-je récupérer mon argent, et quand ?', 80: 'Pourquoi ai-je pris cette décision, et qu’a-t-elle donné ?', 81: 'Par où commencer avec ma question ?',
 82: 'Où en suis-je avec mon argent ?', 83: 'Quel module suivre maintenant ?', 84: 'Que veut dire ce mot, en FCFA ?',
 85: 'Où me suis-je trompé, et pourquoi ?', 86: 'Qu’aurais-je décidé à la place de Koffi ?', 87: 'Comment m’exercer à la Bourse sans risquer d’argent ?',
 88: 'Quelle action faire cette semaine ?', 89: 'Que retenir de ce module ?', 90: 'Qu’ai-je appris et décidé jusqu’ici ?',
 91: 'Comment arriver à l’atelier avec ma question et mes chiffres ?', 92: 'Que faire après l’atelier ?', 93: 'Qu’est-ce qui a vraiment changé en 30 jours ?',
 94: 'Comment bâtir un budget à plusieurs ?', 95: 'Comment passer de la tontine au club d’investissement ?', 96: 'Comment former mon équipe à l’argent ?',
 97: 'Où en sont les étudiants de mon école ?', 98: 'Qui peut répondre à mon cas ?', 99: 'Comment valider ce que j’ai appris ?',
 100: 'Qu’ai-je construit cette année ?',
}


def controle(CENT):
    """Chaque numéro des 100 est rangé une fois et une seule ; renvoie {numéro: (outil, étape)}."""
    place, err = {}, []
    for h in HUIT:
        for e in h['etapes']:
            for n in e[3]:
                if n in place: err.append('n° %d rangé deux fois' % n)
                place[n] = (h, e)
    for nom, _, L in AUTOUR:
        for n in L:
            if n in place: err.append('n° %d rangé deux fois' % n)
            place[n] = (None, nom)
    manque = [c[0] for c in CENT if c[0] not in place]
    if manque: err.append('non rangés : %s' % manque)
    if set(QQ) != {c[0] for c in CENT}: err.append('questions manquantes')
    return place, err
