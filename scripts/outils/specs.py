# -*- coding: utf-8 -*-
"""Les outils EFA du 21 novembre 2026 et la carte des 100 outils.

PAGES : les huit outils construits (page, clé JS, textes, formulaire). Le calcul est dans clone/outils-efa.js.
CENT  : les 100 outils du plan, chacun avec sa place sur EFA : une page à lui, ou un outil existant qui le contient.
Fabriqué par scripts/accueil/build.py (même gabarit, menu et pied du site).
"""

def champ(i, lib, ph='0', aide=''):
    return '<label class="ot-ch"><span>%s</span><input id="%s" inputmode="decimal" placeholder="%s">%s</label>' % (lib, i, ph, '<small>%s</small>' % aide if aide else '')

PAGES = [
 dict(f='mon-vrai-reste', js='reste', k='Voir son argent', t='Mon vrai reste', h=('Mon vrai reste.', 'Ce qu’il me reste vraiment.'),
      d='Combien me reste-t-il après toutes mes obligations ? Calculez votre vrai reste du mois en FCFA, voyez où partent vos charges et testez un mois difficile.',
      s='Vos revenus, moins tout ce que vous devez payer quoi qu’il arrive. Le chiffre sur lequel tout se construit, dès 1 min.',
      form='''<form id="re-form" class="ot-form" novalidate>
<fieldset><legend>Ce qui rentre ce mois-ci</legend><div id="re-rev"></div><button type="button" class="ot-plus" id="re-rev-plus">+ Ajouter un revenu</button></fieldset>
<fieldset><legend>Ce que je dois payer quoi qu’il arrive</legend><div id="re-obl"></div><button type="button" class="ot-plus" id="re-obl-plus">+ Ajouter une obligation</button></fieldset>
<button class="ot-go" type="submit">Voir mon vrai reste</button></form><div id="re-res" class="ot-res" aria-live="polite"></div>'''),
 dict(f='mes-dettes', js='dettes', k='Reprendre la main sur ses dettes', t='Mes dettes classées', h=('Mes dettes classées.', 'Dans quel ordre en sortir.'),
      d='Listez vos dettes et voyez dans quel ordre les rembourser : méthode avalanche ou boule de neige, durée, intérêts, et l’effet d’un versement en plus.',
      s='Toutes vos dettes au même endroit, l’ordre pour en sortir, et la date où vous serez libre.',
      form='''<form id="de-form" class="ot-form" novalidate>
<fieldset><legend>Mes dettes</legend><div id="de-l"></div><button type="button" class="ot-plus" id="de-plus">+ Ajouter une dette</button></fieldset>
<fieldset><legend>Si je fais un effort</legend>''' + champ('de-extra', 'Je peux ajouter par mois (FCFA)', '0', 'En plus des mensualités. Même 5 000 F changent la durée.') + '''</fieldset>
<button class="ot-go" type="submit">Classer mes dettes</button></form><div id="de-res" class="ot-res" aria-live="polite"></div>'''),
 dict(f='puis-je-aider', js='aider', k='Famille et proches', t='Puis-je aider ce mois-ci ?', h=('Puis-je aider', 'ce mois-ci ?'),
      d='Un proche vous demande de l’argent : calculez ce que vous pouvez donner sans déséquilibrer votre budget, et trouvez les mots pour le dire.',
      s='Chiffrer une aide sans se mettre en difficulté, et savoir quoi répondre.',
      form='''<form id="ai-form" class="ot-form" novalidate>
<fieldset><legend>La demande</legend>''' + champ('ai-demande', 'On me demande (FCFA)') + '''</fieldset>
<fieldset><legend>Mon mois</legend>''' + champ('ai-reste', 'Mon vrai reste ce mois-ci (FCFA)', '0', 'Revenus moins obligations. <a href="mon-vrai-reste.html">Le calculer</a>') + '<p class="ot-repris" id="ai-repris" hidden>Repris de votre calcul « Mon vrai reste ».</p>' + champ('ai-epargne', 'Ce que je veux mettre de côté ce mois-ci (FCFA)') + champ('ai-deja', 'Ce que j’ai déjà donné ce mois-ci (FCFA)') + '''</fieldset>
<fieldset><legend>Ma sécurité</legend>''' + champ('ai-reserve', 'Ma réserve aujourd’hui (FCFA)') + champ('ai-depenses', 'Mes dépenses indispensables d’un mois (FCFA)') + '''</fieldset>
<button class="ot-go" type="submit">Voir ce que je peux donner</button></form><div id="ai-res" class="ot-res" aria-live="polite"></div>'''),
 dict(f='mon-idee-test', js='idee', k='Gagner plus et entreprendre', t='Mon idée vaut-elle un test ?', h=('Mon idée vaut-elle', 'un test ?'),
      d='Avant d’investir dans un business, vérifiez que des clients existent : grille de preuves, marge par vente, test de la semaine et plan des 30 premiers jours.',
      s='Vérifier que des clients paient avant de dépenser davantage. Et repartir avec le test à faire cette semaine.',
      form='''<form id="id-form" class="ot-form" novalidate>
<fieldset><legend>Mon idée</legend><label class="ot-ch ot-large"><span>Ce que je vends, et à qui</span><input id="id-idee" placeholder="Ex. jus de fruits frais livrés aux bureaux du Plateau"></label>''' + champ('id-prix', 'Prix de vente d’une unité (FCFA)') + champ('id-cout', 'Ce que me coûte une unité (FCFA)') + champ('id-budget', 'Ce que j’engage dans le test (FCFA)') + '''</fieldset>
<fieldset><legend>Mes preuves</legend><div id="id-q" class="ot-coches"></div></fieldset>
<button class="ot-go" type="submit">Voir si mon idée mérite un test</button></form><div id="id-res" class="ot-res" aria-live="polite"></div>'''),
 dict(f='mon-patrimoine', js='patrimoine', k='Construire sa richesse', t='Mon patrimoine, aujourd’hui et dans dix ans', h=('Mon patrimoine.', 'Aujourd’hui, et dans dix ans.'),
      d='Ce que je possède moins ce que je dois : calculez votre patrimoine en FCFA, projetez-le à dix ans selon ce que vous mettez de côté, et voyez quand vous atteindrez votre objectif.',
      s='Ce que vous possédez, moins ce que vous devez. Puis où cela vous mène, selon ce que vous mettez de côté.',
      form='''<form id="pa-form" class="ot-form" novalidate>
<fieldset><legend>Ce que je possède</legend><div id="pa-act"></div><button type="button" class="ot-plus" id="pa-act-plus">+ Ajouter un bien</button></fieldset>
<fieldset><legend>Ce que je dois</legend><div id="pa-pas"></div><button type="button" class="ot-plus" id="pa-pas-plus">+ Ajouter une dette</button></fieldset>
<fieldset><legend>Ma trajectoire</legend>''' + champ('pa-mois', 'Je mets de côté chaque mois (FCFA)') + champ('pa-cible', 'Mon objectif (FCFA), si j’en ai un', 'Ex. 10 000 000') +
 '''<details class="ot-hyp"><summary>Les hypothèses de rendement (modifiables)</summary><div class="ot-hyp-in"><label class="ot-ch"><span>Si rien ne rapporte (% par an)</span><input id="pa-t1" inputmode="decimal" value="0"></label><label class="ot-ch"><span>Hypothèse prudente (% par an)</span><input id="pa-t2" inputmode="decimal" value="5"></label><label class="ot-ch"><span>Hypothèse haute (% par an)</span><input id="pa-t3" inputmode="decimal" value="10"></label></div><p class="ot-note">Ce sont des hypothèses pour tester des trajectoires, pas des rendements promis.</p></details></fieldset>
<button class="ot-go" type="submit">Voir mon patrimoine</button></form><div id="pa-res" class="ot-res" aria-live="polite"></div>'''),
 dict(f='promesse-credible', js='promesse', k='Décider et éviter les pièges', t='Cette promesse est-elle crédible ?', h=('Cette promesse', 'est-elle crédible ?'),
      d='On vous promet 30 % par mois ? Convertissez le gain annoncé sur un an, comparez-le aux vrais placements et repérez les signaux d’alerte avant de confier votre argent.',
      s='Un gain annoncé, ramené à un an et comparé aux vrais placements. Avec les signaux qui ne trompent pas.',
      form='''<form id="pr-form" class="ot-form" novalidate>
<fieldset><legend>Ce qu’on me promet</legend><label class="ot-ch"><span>Gain promis (%)</span><input id="pr-taux" inputmode="decimal" placeholder="Ex. 30"></label><label class="ot-ch"><span>Par</span><select id="pr-per"><option value="jour">jour</option><option value="semaine">semaine</option><option value="mois" selected>mois</option><option value="an">an</option></select></label>''' + champ('pr-montant', 'Somme que je compte confier (FCFA)', '100 000') + '''</fieldset>
<fieldset><legend>Ce que j’ai remarqué</legend><div id="pr-f" class="ot-coches"></div></fieldset>
<button class="ot-go" type="submit">Examiner cette promesse</button></form><div id="pr-res" class="ot-res" aria-live="polite"></div>'''),
 dict(f='journal-decisions', js='journal', k='Décider', t='Mon journal de décisions', h=('Mon journal', 'de décisions.'),
      d='Notez vos décisions d’argent, pourquoi vous les prenez et ce que vous en attendez. EFA vous les représente à la date de revue pour voir ce qui s’est vraiment passé.',
      s='Noter une décision, sa raison et ce qu’on en attend. Puis y revenir : c’est ainsi qu’on décide mieux.',
      form='''<form id="jo-form" class="ot-form" novalidate>
<fieldset><legend>Une décision</legend><label class="ot-ch ot-large"><span>Ce que je décide</span><input id="jo-quoi" placeholder="Ex. je refuse le crédit pour la moto et j’épargne six mois"></label><p class="ot-err" id="jo-err" hidden>Écrivez la décision en une phrase.</p>
<label class="ot-ch"><span>Sujet</span><select id="jo-cat"><option>Budget</option><option>Épargne</option><option>Crédit et dettes</option><option>Famille</option><option>Activité</option><option>Placement</option><option>Achat important</option></select></label>''' + champ('jo-montant', 'Montant en jeu (FCFA)', 'Facultatif') +
 '''<label class="ot-ch ot-large"><span>Pourquoi je la prends</span><textarea id="jo-pourquoi" rows="2" placeholder="La raison, avec mes chiffres"></textarea></label>
<label class="ot-ch ot-large"><span>Ce que j’en attends</span><textarea id="jo-attendu" rows="2" placeholder="Ce qui devrait se passer si j’ai raison"></textarea></label>
<label class="ot-ch"><span>Je la revois le</span><input id="jo-revue" type="date"></label></fieldset>
<p class="ot-avant"><b>Avant de valider, trois questions.</b> Que se passe-t-il si cela tourne mal ? Qu’en dirait quelqu’un qui n’a rien à y gagner ? Puis-je revenir en arrière ?</p>
<button class="ot-go" type="submit">Noter cette décision</button></form><div id="jo-res" class="ot-res" aria-live="polite"></div>'''),
 dict(f='mon-annee', js='annee', k='Progresser', t='Mon année EFA', h=('Mon année EFA.', 'Le chemin parcouru.'),
      d='Votre année d’argent en un regard : ce qu’il vous reste, ce que vous devez, ce que vous possédez, les décisions prises et les outils utilisés.',
      s='Ce que vous avez mesuré, décidé et construit cette année, gardé sur ce téléphone.',
      form='<div id="an-res" class="ot-res" aria-live="polite"></div>'),
]

# Les 100 outils : (numéro, nom, question, page, « dans » si l'outil vit à l'intérieur d'un outil existant)
N = 'Nouveau'
FAMILLES = ['Voir son argent', 'Épargner et encaisser les imprévus', 'Reprendre la main sur ses dettes', 'Famille, proches et tontine', 'Gagner plus et entreprendre',
            'Investir et comprendre les marchés', 'Construire sa richesse', 'Décider et éviter les pièges', 'Apprendre par la pratique', 'Être accompagné et progresser à plusieurs']
CENT = [
 (1, 'Voir clair', 'Où est passé mon argent ce mois-ci ?', 'ou-est-passe-mon-argent.html', ''),
 (2, 'Mon vrai reste', 'Combien reste-t-il après toutes mes obligations ?', 'mon-vrai-reste.html', N),
 (3, 'Mon salaire, ses destinations', 'Répartir le revenu dès son arrivée.', 'outil-budget.html', 'Mon budget à zéro'),
 (4, 'Mes trois poches', 'Séparer quotidien, sécurité et projets.', 'separer-les-poches.html', ''),
 (5, 'Mon budget à zéro', 'Donner une destination à chaque franc disponible.', 'outil-budget.html', ''),
 (6, 'Mes dépenses invisibles', 'Repérer les petites sorties répétées.', 'ou-est-passe-mon-argent.html', 'Voir clair'),
 (7, 'Mon mois mobile money', 'Additionner transferts, retraits et frais.', 'budget-mobile-money.html', ''),
 (8, 'Mon revenu variable', 'Un budget qui tient les bons et les mauvais mois.', 'construire-son-budget.html', 'Faire son budget en FCFA'),
 (9, 'Mes échéances', 'Voir ce qui devra être payé avant la prochaine rentrée.', 'engagements-et-exceptions.html', 'Les engagements et les exceptions'),
 (10, 'Mon bilan de fin de mois', 'Comparer ce qui était prévu à ce qui s’est passé.', 'ou-est-passe-mon-argent.html', 'Voir clair'),
 (11, 'Ma réserve', 'Fixer un premier palier de sécurité en FCFA.', 'ou-garder-sa-reserve.html#calcul', ''),
 (12, 'Combien mettre de côté ?', 'Trouver un montant soutenable à chaque rentrée.', 'epargner.html', ''),
 (13, 'Mon objectif d’épargne', 'Le temps nécessaire pour atteindre une somme.', 'mon-patrimoine.html', 'Mon patrimoine'),
 (14, 'Ma grosse rentrée', 'Répartir une prime, un héritage ou une indemnité.', 'cercle-spirale.html', ''),
 (15, 'Ma tontine, mon résultat', 'Voir ce que chaque tour me laisse réellement.', 'choisir-son-rang-tontine.html', ''),
 (16, 'Mon prochain tour', 'Décider de l’usage de la tontine avant de la recevoir.', 'tontine-decider-avant-de-recevoir.html', ''),
 (17, 'Où garder ma réserve ?', 'Comparer disponibilité, frais et accès.', 'ou-garder-sa-reserve.html', ''),
 (18, 'Mon mois difficile', 'Tester ce qui se passe si le revenu baisse.', 'mon-vrai-reste.html', 'Mon vrai reste'),
 (19, 'Mon plan d’urgence', 'Classer les dépenses à maintenir, reporter ou réduire.', 'mon-vrai-reste.html', 'Mon vrai reste'),
 (20, 'Le défi 30 jours', 'Une action d’épargne simple, suivie chaque semaine.', 'atelier-reserve-securite.html', 'Atelier Ma réserve de sécurité'),
 (21, 'Mes dettes classées', 'Regrouper soldes, échéances et coûts.', 'mes-dettes.html', N),
 (22, 'Boule de neige ou avalanche ?', 'Comparer deux ordres de remboursement.', 'mes-dettes.html', 'Mes dettes classées'),
 (23, 'Le vrai coût de mon crédit', 'Tout ce qui sera payé, frais compris.', 'cout-total-credit.html#calcul', ''),
 (24, 'Puis-je supporter cette mensualité ?', 'La confronter au vrai reste à vivre.', 'cout-total-credit.html', 'Le coût total d’un crédit'),
 (25, 'Rembourser plus tôt', 'L’effet d’un versement supplémentaire.', 'mes-dettes.html', 'Mes dettes classées'),
 (26, 'Renégocier ma dette', 'Préparer les chiffres et les questions à présenter.', 'renegocier-une-dette.html', ''),
 (27, 'Crédit ou épargne ?', 'Comparer deux chemins pour financer un achat.', 'decider.html', 'Simulateur de décisions'),
 (28, 'Mon crédit chez le commerçant', 'Le prix total d’un paiement échelonné.', 'consommer-et-acheter.html', 'Consommer et acheter'),
 (29, 'Mon alerte échéance', 'Les semaines où plusieurs paiements se rencontrent.', 'engagements-et-exceptions.html', 'Les engagements et les exceptions'),
 (30, 'Avant de me porter garant', 'Comprendre ce que je pourrais devoir payer.', 'preter-a-un-proche.html', 'Prêter à un proche'),
 (31, 'Puis-je aider ce mois-ci ?', 'Chiffrer une aide sans déséquilibrer son budget.', 'puis-je-aider.html', N),
 (32, 'Prêter à un proche', 'Montant, échéance et scénario de non-remboursement.', 'preter-a-un-proche.html', ''),
 (33, 'Mon enveloppe famille', 'Prévoir la solidarité dans le budget.', 'puis-je-aider.html', 'Puis-je aider ce mois-ci ?'),
 (34, 'Notre budget de couple', 'Organiser dépenses communes et individuelles.', 'separer-les-poches.html', 'Séparer les poches'),
 (35, 'Qui paie quoi ?', 'Répartir une dépense commune selon des règles choisies.', 'separer-les-poches.html', 'Séparer les poches'),
 (36, 'Notre tontine en clair', 'Cotisations, ordre des tours et engagements.', 'tontine-formations.html', 'Quelle tontine avez-vous devant vous ?'),
 (37, 'Avant d’entrer dans une tontine', 'Passer les règles du groupe en revue.', 'avant-de-cotiser.html', ''),
 (38, 'La tontine devient une spirale', 'Ce qui se passe si une part reste au groupe.', 'atelier-tontine-spirale.html', ''),
 (39, 'Préparer les études des enfants', 'Un objectif et les contributions nécessaires.', 'etudes-enfants-heritage.html', ''),
 (40, 'Les papiers de ma famille', 'La liste des comptes, biens et engagements à retrouver.', 'papiers-famille.html', ''),
 (41, 'Déclic', 'Des pistes d’activité selon budget, temps et lieu.', 'generateur-de-projet.html', ''),
 (42, 'Mon idée vaut-elle un test ?', 'Vérifier l’existence de clients avant d’investir.', 'mon-idee-test.html', N),
 (43, 'Mon premier client', 'Une offre simple à proposer cette semaine.', 'mon-idee-test.html', 'Mon idée vaut-elle un test ?'),
 (44, 'Combien coûte le démarrage ?', 'Lister les dépenses indispensables.', 'mon-business-plan-tient-il.html', 'Mon business plan tient-il ?'),
 (45, 'Mon prix de vente', 'Coûts, marge et prix minimum.', 'atelier-activite-gagne-t-elle.html', 'Mon activité gagne-t-elle ?'),
 (46, 'Mon activité gagne-t-elle vraiment ?', 'Distinguer chiffre d’affaires et argent restant.', 'atelier-activite-gagne-t-elle.html', ''),
 (47, 'Mon seuil de rentabilité', 'Combien vendre pour couvrir les coûts ?', 'mon-business-plan-tient-il.html', 'Mon business plan tient-il ?'),
 (48, 'Ma trésorerie sur 90 jours', 'Quand l’argent entre et quand il sort.', 'atelier-ou-est-l-argent-de-mon-activite.html', 'Où est l’argent de mon activité ?'),
 (49, 'Mon salaire d’entrepreneur', 'Ce que l’activité peut me verser.', 'salaire-fixe-activite.html', ''),
 (50, 'Mon plan des 30 premiers jours', 'Transformer une idée en actions vérifiables.', 'mon-idee-test.html', 'Mon idée vaut-elle un test ?'),
 (51, 'Suis-je prêt à investir ?', 'Le point sur réserve, dettes et horizon.', 'questions-avant-d-investir.html', ''),
 (52, 'Ma BRVM : et si j’avais investi ?', 'Reconstituer une opération passée.', 'ma-brvm.html', ''),
 (53, 'Le jour où je suis entré', 'Ce que change la date d’achat.', 'ma-brvm.html#entree', 'Ma BRVM'),
 (54, 'Comparer trois actions', 'Parcours, dividendes et variations.', 'ma-brvm.html#comparer', 'Ma BRVM'),
 (55, 'Mon portefeuille BRVM', 'Les titres détenus et leur résultat.', 'ma-brvm.html#portefeuille', 'Ma BRVM'),
 (56, 'Cours ou rendement ?', 'Séparer hausse du prix, dividendes et frais.', 'ma-brvm.html#dividendes', 'Ma BRVM'),
 (57, 'Mes frais de SGI', 'Le coût d’achat, de garde et de vente.', 'etude-frais-bourse.html', ''),
 (58, 'Ma première action', 'Les étapes et les questions avant un ordre.', 'coach-bourse.html', ''),
 (59, 'Mon plan d’investissement mensuel', 'Simuler des achats réguliers.', 'ma-brvm.html#mensuel', 'Ma BRVM'),
 (60, 'Une baisse de 30 % : que faire ?', 'Exercice interactif de décision.', 'jeu-portefeuille-baisse.html', ''),
 (61, 'Mon patrimoine aujourd’hui', 'Actifs moins dettes, en un seul tableau.', 'mon-patrimoine.html', N),
 (62, 'Mon patrimoine dans dix ans', 'Tester plusieurs rythmes d’épargne et d’investissement.', 'mon-patrimoine.html', N),
 (63, 'Mon premier million', 'Un chemin selon le montant gardé chaque mois.', 'mon-patrimoine.html', 'Mon patrimoine'),
 (64, 'De 1 à 10 millions', 'Les leviers qui changent réellement la trajectoire.', 'mon-patrimoine.html', 'Mon patrimoine'),
 (65, 'Combien me faut-il pour être libre ?', 'Partir de ses dépenses souhaitées.', 'liberte-financiere.html', ''),
 (66, 'Mes sources de revenus', 'Celles qui existent et celles à construire.', 'investir-gagner-plus.html', 'Investir : gagner plus'),
 (67, 'Louer ou acheter ?', 'Comparer les flux d’argent sur une durée choisie.', 'atelier-acheter-construire-attendre.html', 'Acheter, construire ou attendre'),
 (68, 'Ma maison à 30 millions', 'Épargne, apport, mensualité et coût total.', 'budget-chantier.html', 'Construire par étapes'),
 (69, 'Mon terrain sans surprise', 'Budget, pièces et vérifications.', 'acheter-un-terrain.html', ''),
 (70, 'Ma retraite à ma façon', 'L’écart entre ressources futures et besoins.', 'preparer-ma-retraite.html', ''),
 (71, 'Cette promesse est-elle crédible ?', 'Examiner un rendement annoncé.', 'promesse-credible.html', N),
 (72, 'Avant de confier mon argent', 'Vérifier acteur, documents, frais et sortie.', 'arnaques.html', ''),
 (73, 'Cette offre me convient-elle ?', 'Comparer un produit à son objectif et à son horizon.', 'bourse-projets.html', 'J’investis pour quel projet ?'),
 (74, 'Acheter maintenant ou attendre ?', 'L’effet d’un achat sur le reste à vivre.', 'decider.html', 'Simulateur de décisions'),
 (75, 'Une décision, trois scénarios', 'Favorable, central et défavorable.', 'decider.html', 'Simulateur de décisions'),
 (76, 'Le coût de ne rien faire', 'Ce qu’une décision reportée peut changer.', 'ma-brvm.html#duree', 'Ma BRVM'),
 (77, 'Mon deuxième avis', 'Une grille de questions avant une décision importante.', 'journal-decisions.html', 'Mon journal de décisions'),
 (78, 'Les mots cachés du contrat', 'Frais, pénalités, garanties et conditions.', 'atelier-avant-de-confier-ou-d-investir.html', 'Atelier Avant de confier son argent'),
 (79, 'Puis-je récupérer mon argent ?', 'Les délais et conditions de sortie.', 'promesse-credible.html', 'Cette promesse est-elle crédible ?'),
 (80, 'Mon journal de décisions', 'Pourquoi une décision a été prise, et son résultat.', 'journal-decisions.html', N),
 (81, 'Mon prochain pas', 'Une question, une réponse courte et le bon outil.', 'questions.html', ''),
 (82, 'Mon diagnostic financier', 'Identifier une priorité personnelle.', 'diagnostic.html', ''),
 (83, 'L’école EFA guidée', 'Le module suivant selon la situation.', 'parcours.html', ''),
 (84, 'Une notion, un exemple en FCFA', 'Comprendre un terme par un cas concret.', 'questions.html', 'Les 100 questions'),
 (85, 'Le quiz qui explique l’erreur', 'Apprendre après chaque réponse.', 'quiz.html', ''),
 (86, 'Une année avec Koffi', 'Décider mois après mois dans un scénario.', 'decider.html', 'Simulateur de décisions'),
 (87, 'Ma première année à la BRVM', 'S’exercer sans engager d’argent.', 'traders.html', 'EFA Traders'),
 (88, 'Le défi de la semaine', 'Une action réelle, puis le résultat.', 'quiz.html', 'Le quiz de la semaine'),
 (89, 'Ma fiche à garder', 'Une synthèse personnelle après chaque module.', 'mon-efa.html', 'Mon EFA'),
 (90, 'Mon cahier EFA', 'Outils utilisés, décisions, fiches et progrès.', 'mon-efa.html', ''),
 (91, 'Ma séance préparée', 'Arriver à l’atelier avec sa question et ses chiffres.', 'ateliers-elysee.html', 'Ateliers avec Élysée Johnson'),
 (92, 'Le plan après l’atelier', 'Trois actions, leurs dates et leur suivi.', 'journal-decisions.html', 'Mon journal de décisions'),
 (93, 'Mon rendez-vous à 30 jours', 'Vérifier ce qui a réellement changé.', 'mon-efa.html', 'Mon EFA'),
 (94, 'Notre budget de groupe', 'Un cas en couple, famille ou communauté.', 'programme-organisation.html', 'Le programme de votre organisation'),
 (95, 'Notre club d’investissement', 'Cotisations et règles de décision.', 'club-investissement.html', ''),
 (96, 'EFA pour mon équipe', 'Diagnostic collectif et parcours adapté.', 'organisations.html', ''),
 (97, 'Le tableau de bord de l’école', 'Participation et acquis des étudiants.', 'espace-organisation.html', 'Espace organisation'),
 (98, 'Le mentor du mois', 'Un cas soumis pour une réponse humaine.', 'rendez-vous.html', 'Rendez-vous avec Élysée'),
 (99, 'Mon certificat appliqué', 'Connaissances et fiche personnelle.', 'certificat-cefa.html', ''),
 (100, 'Mon année EFA', 'Les décisions prises, l’argent conservé, les projets lancés.', 'mon-annee.html', N),
]
