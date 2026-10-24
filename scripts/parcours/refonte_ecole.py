#!/usr/bin/env python3
"""Refonte École EFA (24/10/2026) : les parcours deviennent les modules de l'école.

Entrée : les données en ligne (parcours-efa.js, exportées en JSON par node).
Sortie : parcours-efa.js réécrit.
  - 8 modules au cycle Fondations, 3 au cycle Patrimoine ;
  - trois cycles : Fondations (1-8), Maîtrise (9-16), Patrimoine (17-23) ;
  - P11 devient le module 9, P12 le module 10, P7 le module 14 (table `fusions` pour les anciens liens) ;
  - 3 à 5 étapes essentielles par module, le reste en « Pour aller plus loin » ;
  - une fiche de fin (`fiche`) par module : ce que la personne garde le jour même.
Usage : python3 scripts/parcours/refonte_ecole.py donnees.json
"""
import json, sys, copy
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
D = json.load(open(sys.argv[1], encoding='utf-8'))
P0, Q = D['P'], D['Q']
SRC = {p['id']: p for p in P0['parcours']}
FUSIONS = {'P7': 'M14', 'P11': 'M9', 'P12': 'M10'}


def e(pid, i, ess):
    s = copy.deepcopy(SRC[pid]['etapes'][i]); s['ess'] = ess; return s


def nouv(type_, titre, lien, ess=True):
    return {'type': type_, 'titre': titre, 'lien': lien, 'ok': True, 'pilote': False, 'ess': ess}


MODULES = [
    dict(id='P1', module=1, titre='Où passe mon argent ?', duree='45 min',
         objectif='Connaître son flux net du dernier mois et nommer ses trois postes à surveiller.',
         fiche=dict(titre='Mes 3 postes à surveiller', desc='Votre flux net du mois et les trois dépenses à regarder en premier.', lien='ou-est-passe-mon-argent.html?src=parcours'),
         etapes=[nouv('Vidéo', 'Min’Fin 1 · Où est passé votre argent ?', 'minfin.html#ep-1-1'), e('P1', 1, True), e('P1', 0, True),
                 e('P1', 2, False), e('P1', 3, False), e('P1', 4, False), e('P1', 5, False)]),
    dict(id='P2', module=2, titre='Un budget qui tient', duree='1 h',
         objectif='Un budget décidé avant le mois, revenus irréguliers et grosses dépenses compris.',
         fiche=dict(titre='Mon budget du mois', desc='Ce qui entre, ce qui part en premier, ce qui reste à décider, et le calendrier des grosses dépenses.', lien='construire-son-budget.html?src=parcours'),
         etapes=[e('P2', 4, True), e('P2', 0, True), e('P2', 1, True), e('P2', 6, True),
                 e('P2', 2, False), e('P2', 3, False), e('P2', 5, False)]),
    dict(id='P5', module=3, titre='Ma tontine, du cercle à la spirale', duree='1 h',
         objectif='Savoir ce que fait vraiment sa tontine et décider de l’usage du prochain tour avant de le recevoir.',
         fiche=dict(titre='Mon plan pour le prochain tour', desc='La date, le montant, et ce que vous en ferez, écrit avant de recevoir.', lien='tontine-decider-avant-de-recevoir.html?src=parcours'),
         etapes=[e('P5', 6, True), e('P5', 0, True), e('P5', 1, True), e('P5', 8, True),
                 e('P5', 7, False), e('P5', 2, False), e('P5', 3, False), e('P5', 5, False), e('P5', 4, False), e('P5', 9, False), e('P5', 10, False)]),
    dict(id='P4', module=4, titre='Ma réserve de sécurité', duree='45 min',
         objectif='Savoir combien garder à chaque rentrée et où le garder, pour atteindre un mois de dépenses.',
         fiche=dict(titre='Ma réserve', desc='Votre palier visé, le montant gardé à chaque rentrée et l’endroit où le garder.', lien='cercle-spirale.html?src=parcours#argent'),
         etapes=[e('P4', 0, True), e('P4', 1, True), e('P4', 2, True), e('P4', 6, True),
                 e('P4', 3, False), e('P4', 4, False), e('P4', 5, False)]),
    dict(id='P3', module=5, titre='Aider mes proches sans me perdre', duree='45 min',
         objectif='Une enveloppe de solidarité fixée à l’avance et une réponse prête pour la prochaine demande.',
         fiche=dict(titre='Mon enveloppe famille et ma réponse type', desc='Le montant que vous pouvez donner chaque mois et le message à envoyer, prêt ou cadeau.', lien='preter-a-un-proche.html?src=parcours'),
         etapes=[e('P3', 0, True), e('P3', 1, True), e('P3', 2, True),
                 e('P3', 5, False), e('P3', 6, False), e('P3', 3, False), e('P3', 4, False)]),
    dict(id='P6', module=6, titre='Reprendre la main sur mes dettes', duree='45 min',
         objectif='Toutes ses dettes listées, classées par coût, avec un ordre de remboursement.',
         fiche=dict(titre='Mes dettes classées', desc='Chaque dette, son coût total, et l’ordre dans lequel la rembourser.', lien='cout-total-credit.html?src=parcours'),
         etapes=[e('P6', 0, True), e('P6', 4, True), e('P6', 1, True),
                 e('P6', 2, False), e('P6', 3, False)]),
    dict(id='P10', module=7, titre='Mobile money et frais', duree='30 min',
         objectif='Connaître ses frais du mois et une règle simple pour les réduire.',
         fiche=dict(titre='Mes frais du mois', desc='Ce que vos transferts et retraits vous ont coûté, et ce que vous changez.', lien='budget-mobile-money.html?src=parcours'),
         etapes=[e('P10', 0, True), e('P10', 1, True), e('P10', 2, False)]),
    dict(id='P14', module=8, titre='Se protéger, protéger sa famille', duree='45 min',
         objectif='Reconnaître une promesse trop belle, vérifier un acteur, et savoir où sont les papiers de la famille.',
         fiche=dict(titre='Ma liste « acteur agréé » et mes papiers', desc='Les vérifications à faire avant de verser, et l’endroit où se trouvent vos papiers.', lien='papiers-famille.html?src=parcours'),
         etapes=[e('P10', 3, True), e('P14', 4, True), e('P14', 1, True),
                 e('P14', 5, False), e('P14', 6, False), e('P14', 2, False), e('P14', 3, False)]),
]
def neuf(type_, titre, lien=None):
    return {'type': type_, 'titre': titre, 'lien': lien, 'ok': bool(lien), 'pilote': False, 'ess': True}


MAITRISE = [
    dict(id='M9', base='P11', module=9, titre='Revenu irrégulier et activité', duree='1 h',
         objectif='Séparer l’argent de l’activité du sien et se verser un salaire fixe.',
         fiche=dict(titre='Ma règle de salaire fixe', desc='Ce que l’activité vous verse chaque mois, et ce qu’elle garde.', lien='salaire-fixe-activite.html?src=parcours'),
         etapes=[e('P11', 1, True), e('P11', 6, True), e('P11', 0, True), e('P11', 3, False), e('P11', 2, False), e('P11', 4, False), e('P11', 5, False)]),
    dict(id='M10', base='P12', module=10, titre='Le calendrier de l’année', duree='45 min',
         objectif='Prévoir la rentrée, les fêtes et les funérailles sur douze mois.',
         fiche=dict(titre='Mon calendrier des grosses dépenses', desc='Les grosses dépenses de l’année et ce que vous mettez de côté chaque mois.', lien='tontine-rentree.html?src=parcours'),
         etapes=[e('P12', 0, True), e('P12', 2, True), e('P12', 5, True), e('P12', 1, False), e('P12', 3, False)]),
    dict(id='M11', base='P6', module=11, titre='Sortir de la dette', duree='45 min',
         probleme='Je rembourse, mais je n’en vois pas la fin', depart='« Je rembourse chaque mois sans savoir quand j’en aurai fini. »',
         objectif='Lire le vrai coût d’un crédit, choisir l’ordre de remboursement et préparer une renégociation.',
         fiche=dict(titre='Mon ordre de remboursement', desc='Vos dettes, de la plus chère à la moins chère, et la date de fin visée.', lien='cout-total-credit.html?src=parcours'),
         etapes=[e('P6', 4, True), e('P6', 2, True), e('P6', 1, False), neuf('Leçon', 'Renégocier une dette : quoi demander, à qui')]),
    dict(id='M12', base='P3', module=12, titre='La solidarité organisée', duree='45 min',
         probleme='Toute la famille compte sur moi', depart='« Je suis celui ou celle que l’on appelle quand il y a un besoin. »',
         objectif='Un budget famille sur l’année, une façon de dire non, et des envois organisés.',
         fiche=dict(titre='Mon budget famille sur l’année', desc='Ce que vous donnez, à qui, et la part qui reste à vous.', lien='solidarite-assureur-de-la-famille.html?src=parcours'),
         etapes=[e('P3', 6, True), neuf('Cas', 'Ma sœur me demande de l’argent : prêter ou donner ?', 'question-preter-a-ma-soeur.html'), e('P9', 3, True)]),
    dict(id='M13', base='P14', module=13, titre='Protéger sa famille', duree='45 min',
         objectif='Savoir quoi décider à l’arrivée d’un enfant ou après un décès, et ce qu’une assurance couvre.',
         fiche=dict(titre='Mes décisions pour la famille', desc='Ce qui change à l’arrivée d’un enfant, et les premières décisions après un décès.', lien='arrivee-enfant.html?src=parcours'),
         etapes=[e('P14', 5, True), e('P14', 6, True), e('P14', 0, True), e('P14', 2, False)]),
    dict(id='M14', base='P7', module=14, titre='Recevoir une grosse somme', duree='45 min',
         objectif='Décider avant de recevoir une prime, un tour de tontine ou un héritage.',
         fiche=dict(titre='Ma décision avant de recevoir', desc='La somme attendue, et ce que vous en ferez, écrit avant qu’elle arrive.', lien='tontine-decider-avant-de-recevoir.html?src=parcours'),
         etapes=[e('P7', 0, True), e('P7', 3, True), e('P7', 1, True), e('P7', 2, False), e('P7', 4, False)]),
    dict(id='M15', base='P4', module=15, titre='Où garder son argent', duree='30 min',
         probleme='Je ne sais pas où garder mon argent', depart='« Espèces, mobile money, banque, microfinance : je ne sais pas ce qui est le plus sûr. »',
         objectif='Comparer les risques et les frais, et choisir un endroit pour chaque somme.',
         fiche=dict(titre='Mon choix d’endroit', desc='Où va votre réserve, où va l’argent du mois, et pourquoi.', lien='ou-garder-sa-reserve.html?src=parcours'),
         etapes=[e('P4', 6, True), e('P10', 1, True), e('P4', 1, False)]),
    dict(id='M16', base='P2', module=16, titre='Consommer et acheter', duree='30 min',
         probleme='Les prix montent et j’achète à crédit', depart='« Tout augmente, et j’achète souvent à crédit chez le commerçant. »',
         objectif='Comprendre l’inflation, le vrai prix d’un achat à crédit, et négocier.',
         fiche=dict(titre='Mes achats à négocier', desc='Ce que vous achetez à crédit et ce que cela vous coûte vraiment.', lien='cout-total-credit.html?src=parcours'),
         etapes=[neuf('Leçon', 'L’inflation : pourquoi tout augmente'), neuf('Méthode guidée', 'Acheter à crédit chez le commerçant : le vrai prix'), neuf('Leçon', 'Négocier un prix')]),
]
PATRIMOINE = [
    dict(id='M17', base='P4', module=17, titre='Épargner ou investir', duree='45 min',
         probleme='Épargner, investir : quelle différence ?', depart='« Je mets de côté, mais je ne sais pas si je dois investir. »',
         objectif='Distinguer épargne et placement, risque et rendement, et savoir si l’on est prêt.',
         fiche=dict(titre='Ce que devient ma part gardée', desc='Ce que devient une petite part gardée à chaque rentrée, avec et sans placement.', lien='cercle-spirale.html?src=parcours#argent'),
         etapes=[e('P4', 1, True), e('P8', 0, True), e('P8', 13, True), e('P4', 2, False)]),
    dict(id='M18', base='P9', module=18, titre='Les placements de l’UEMOA', duree='45 min',
         probleme='Je ne connais pas les placements de chez nous', depart='« DAT, emprunts d’État, OPCVM : je ne sais pas ce que c’est. »',
         objectif='Comprendre les placements de la zone, leurs risques et leurs frais.',
         fiche=dict(titre='Les placements que je comprends', desc='Les placements de la zone, ce qu’ils rapportent et ce qu’ils risquent, sans aucun produit recommandé.', lien='opcvm-fcpe.html?src=parcours'),
         etapes=[e('P9', 4, True), e('P8', 10, True), neuf('Leçon', 'DAT et emprunts d’État : comment ça marche')]),
    dict(id='P8', module=19, titre='La BRVM', duree='3 h',
         fiche=dict(titre='Suis-je prêt ? et mon plan écrit', desc='Les quatre vérifications avant d’investir, puis votre plan, sans aucun titre recommandé.', lien='bourse-essentiel.html?src=parcours#A5'),
         etapes=[e('P8', i, True) for i in (0, 1, 2, 3, 4, 5)] + [e('P8', i, False) for i in (6, 11, 12, 14)]),
    dict(id='P13', module=20, titre='Terrain et maison', fiche=dict(titre='Mes vérifications avant de verser', desc='La liste cochée des papiers à vérifier et le budget du projet.', lien='acheter-un-terrain.html?src=parcours')),
    dict(id='M21', base='P8', module=21, titre='Du groupe au club d’investissement', duree='45 min',
         probleme='Notre tontine pourrait-elle investir ?', depart='« Notre groupe cotise depuis longtemps ; on se demande s’il pourrait investir ensemble. »',
         objectif='Savoir faire d’un groupe un club : règles, registre, risques.',
         fiche=dict(titre='Les règles de notre club', desc='Les règles, le registre et les décisions à prendre avant le premier placement.', lien='club-investissement.html?src=parcours'),
         etapes=[e('P8', 15, True), e('P5', 0, False), e('P8', 10, False)]),
    dict(id='P9', module=22, titre='Retraite et liberté financière', fiche=dict(titre='Mon plan retraite', desc='Votre horizon, l’effort par rentrée et la date de révision.', lien='preparer-ma-retraite.html?src=parcours'),
         etapes=[e('P9', 0, True), e('P9', 2, True), e('P9', 1, False), e('P9', 3, False)]),
    dict(id='M23', base='P14', module=23, titre='Transmettre', duree='45 min',
         probleme='Je veux que ma famille sache quoi faire', depart='« Si je disparais, ma famille ne saurait pas où sont les choses. »',
         objectif='Préparer les études des enfants, l’héritage, et ce que la famille doit savoir.',
         fiche=dict(titre='Ce que ma famille doit savoir', desc='Où sont vos papiers, vos comptes, et à qui s’adresser.', lien='papiers-famille.html?src=parcours'),
         etapes=[e('P14', 4, True), e('P14', 6, True), neuf('Leçon', 'Les études des enfants et l’héritage')]),
]


def construire(m, cycle):
    p = copy.deepcopy(SRC[m.get('base', m['id'])]); p['id'] = m['id']
    for k in ('titre', 'duree', 'objectif', 'etapes', 'probleme', 'depart'):
        if k in m: p[k] = m[k]
    p['cycle'] = cycle; p['module'] = m['module']; p['nom'] = 'Module %d' % m['module']; p['fiche'] = m['fiche']
    p['preuve'] = 'Votre fiche « %s », gardée dans Mon cahier ou envoyée par WhatsApp.' % m['fiche']['titre']
    return p


def remap(ids, soi=None):
    out = []
    for i in ids:
        i = FUSIONS.get(i, i)
        if i != soi and i not in out: out.append(i)
    return out


parcours = ([construire(m, 'fondations') for m in MODULES] + [construire(m, 'maitrise') for m in MAITRISE]
            + [construire(m, 'patrimoine') for m in PATRIMOINE])
for k, p in enumerate(parcours):
    if 'base' in [x for x in MODULES + MAITRISE + PATRIMOINE if x['id'] == p['id']][0] or p['cycle'] != 'fondations':
        nxt = parcours[k + 1]['id'] if k + 1 < len(parcours) and parcours[k + 1]['cycle'] == p['cycle'] else None
        p['suite'] = [nxt] if nxt else []
    else:
        p['suite'] = remap(p['suite'], p['id'])
P0['cycles'] = [
    dict(id='fondations', num='I', nom='Fondations', sous='Voir et tenir', modules='1 à 8',
         gain='Savoir où passe son argent, tenir un mois, commencer une réserve, protéger sa famille.',
         duree='8 modules · environ 6 h, plus 30 jours de suivi', certificat='Certificat local Fondations', statut='ouvert',
         validation='Chaque module validé donne une attestation. Les 8 attestations, puis l’examen final (17 bonnes réponses sur 24), donnent le certificat local.'),
    dict(id='maitrise', num='II', nom='Maîtrise', sous='Organiser sa vie d’argent', modules='9 à 16',
         gain='Un mois de réserve, des dettes ordonnées, l’année entière prévue, la solidarité organisée.',
         duree='8 modules · environ 5 h, plus 2 mois de suivi', certificat='Certificat local Maîtrise', statut='libre',
         validation='Attestation par module. Projet de fin de cycle : « Mon plan sur 12 mois ». Examen et certificat à l’ouverture du cycle.'),
    dict(id='patrimoine', num='III', nom='Patrimoine', sous='Faire travailler son argent', modules='17 à 23',
         gain='Comprendre les placements de la zone, la BRVM, préparer un projet, sa retraite et la transmission.',
         duree='7 modules · environ 6 h, plus 3 mois de suivi', certificat='Certificat local Patrimoine', statut='libre',
         validation='Attestation par module. Projet de fin de cycle : un plan patrimonial à 10 ans. Examen et certificat à l’ouverture du cycle.'),
]
P0['parcours'] = parcours
P0['version'] = '2.0'; P0['date'] = '2026-10-24'
P0['fusions'] = FUSIONS
for x in P0['profils']: x['parcours'] = remap(x['parcours'])
for g in P0['programmes']: g['sequence'] = remap(g['sequence'])
for t in Q['themes']:
    for q in t['questions']:
        if q['p'] in FUSIONS: q['p'] = FUSIONS[q['p']]

ids = {p['id'] for p in parcours}
assert all(q['p'] in ids or q['p'] == 'quiz' for t in Q['themes'] for q in t['questions'])
for p in parcours:
    for s in p['etapes']:
        l = s.get('lien')
        if l and not l.startswith('http'):
            f = l.split('#')[0].split('?')[0] or 'index.html'
            f = f + 'index.html' if f.endswith('/') else f
            assert (RACINE / f).exists(), (p['id'], f)
    if 'fiche' in p:
        assert (RACINE / p['fiche']['lien'].split('?')[0].split('#')[0]).exists(), p['id']

js = ("/* EFA · Parcours d'apprentissage · données publiques (version 2.0, 2026-10-24) — refonte École EFA\n"
      "   Les parcours sont les modules de l'école : Fondations (1 à 8), Maîtrise (9 à 16), Patrimoine (17 à 23).\n"
      "   fusions = anciens numéros devenus des modules (P7 → M14, P11 → M9, P12 → M10), pour les anciens liens.\n"
      "   fiche = ce que la personne garde à la fin du module. Régénérer avec scripts/parcours/refonte_ecole.py. */\n"
      "window.EFA_PARCOURS = " + json.dumps(P0, ensure_ascii=False, separators=(',', ':')) + ";\n"
      "/* Les 100 questions. p = parcours (module) vers lequel la question mène. */\n"
      "window.EFA_QUESTIONS = " + json.dumps(Q, ensure_ascii=False, separators=(',', ':')) + ";\n")
(RACINE / 'parcours-efa.js').write_text(js, encoding='utf-8')
for p in parcours:
    print(p['nom'], p['cycle'], p['titre'], '|', sum(s['ess'] and s['ok'] for s in p['etapes']), 'essentielles,', sum(not s['ess'] for s in p['etapes']), 'en plus | fiche :', p['fiche']['titre'])
