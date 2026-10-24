#!/usr/bin/env python3
"""Refonte École EFA (24/10/2026) : les parcours deviennent les modules de l'école.

Entrée : les données en ligne (parcours-efa.js, exportées en JSON par node).
Sortie : parcours-efa.js réécrit.
  - 8 modules au cycle Fondations, 3 au cycle Patrimoine ;
  - P7 fusionné dans P5, P11 et P12 dans P2 (table `fusions` pour les anciens liens) ;
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
FUSIONS = {'P7': 'P5', 'P11': 'P2', 'P12': 'P2'}


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
         etapes=[e('P2', 4, True), e('P2', 0, True), e('P2', 1, True), e('P11', 1, True),
                 e('P2', 6, False), e('P11', 6, False), e('P12', 0, False), e('P12', 5, False), e('P2', 2, False), e('P2', 3, False), e('P2', 5, False), e('P11', 5, False)]),
    dict(id='P5', module=3, titre='Ma tontine, du cercle à la spirale', duree='1 h',
         objectif='Savoir ce que fait vraiment sa tontine et décider de l’usage du prochain tour avant de le recevoir.',
         fiche=dict(titre='Mon plan pour le prochain tour', desc='La date, le montant, et ce que vous en ferez, écrit avant de recevoir.', lien='tontine-decider-avant-de-recevoir.html?src=parcours'),
         etapes=[e('P5', 6, True), e('P5', 0, True), e('P5', 1, True), e('P5', 8, True),
                 e('P5', 7, False), e('P5', 2, False), e('P7', 0, False), e('P7', 1, False), e('P5', 5, False), e('P5', 4, False), e('P5', 9, False), e('P5', 10, False), e('P7', 4, False)]),
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
PATRIMOINE = [
    dict(id='P8', module=19, titre='La BRVM', duree='3 h',
         fiche=dict(titre='Suis-je prêt ? et mon plan écrit', desc='Les quatre vérifications avant d’investir, puis votre plan, sans aucun titre recommandé.', lien='bourse-essentiel.html?src=parcours#A5'),
         etapes=[e('P8', i, True) for i in (0, 1, 2, 3, 4, 5)] + [e('P8', i, False) for i in (6, 10, 11, 12, 13, 14, 15)]),
    dict(id='P13', module=20, titre='Terrain et maison', fiche=dict(titre='Mes vérifications avant de verser', desc='La liste cochée des papiers à vérifier et le budget du projet.', lien='acheter-un-terrain.html?src=parcours')),
    dict(id='P9', module=22, titre='Retraite et liberté financière', fiche=dict(titre='Mon plan retraite', desc='Votre horizon, l’effort par rentrée et la date de révision.', lien='preparer-ma-retraite.html?src=parcours')),
]


def construire(m, cycle):
    p = copy.deepcopy(SRC[m['id']])
    for k in ('titre', 'duree', 'objectif', 'etapes'):
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


parcours = [construire(m, 'fondations') for m in MODULES] + [construire(m, 'patrimoine') for m in PATRIMOINE]
for p in parcours: p['suite'] = remap(p['suite'], p['id'])
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
      "   Les parcours sont les modules de l'école : cycle Fondations (modules 1 à 8) et cycle Patrimoine.\n"
      "   fusions = anciens parcours réunis dans un autre (P7 → P5, P11 et P12 → P2), pour les anciens liens.\n"
      "   fiche = ce que la personne garde à la fin du module. Régénérer avec scripts/parcours/refonte_ecole.py. */\n"
      "window.EFA_PARCOURS = " + json.dumps(P0, ensure_ascii=False, separators=(',', ':')) + ";\n"
      "/* Les 100 questions. p = parcours (module) vers lequel la question mène. */\n"
      "window.EFA_QUESTIONS = " + json.dumps(Q, ensure_ascii=False, separators=(',', ':')) + ";\n")
(RACINE / 'parcours-efa.js').write_text(js, encoding='utf-8')
for p in parcours:
    print(p['nom'], p['cycle'], p['titre'], '|', sum(s['ess'] for s in p['etapes']), 'essentielles,', sum(not s['ess'] for s in p['etapes']), 'en plus | fiche :', p['fiche']['titre'])
