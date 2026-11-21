#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Repères de décision de « Ma BRVM » : un fichier léger, data/marches/reperes.json.

Pour chaque société : gain sur le cours et dividendes compris depuis le début de l'historique,
part des dividendes, régularité du dividende, pire baisse, part des années glissantes gagnantes,
montant échangé par jour (médiane, pour écarter les volumes aberrants), comparaison à l'indice.
Pour le marché : les mêmes repères sur le BRVM Composite, les meilleures séances, la saison des dividendes.

Ce sont des faits passés, calculés sur les cours officiels. Aucun classement d'achat.
Lancé à la fin de marches.py ; peut aussi tourner seul :  python scripts/brvm/reperes.py [--bilan]
"""
import json, os, sys, statistics

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(os.path.dirname(ICI))
M = os.path.join(RACINE, 'data', 'marches')
AN = 250  # séances dans une année de Bourse


def fenetres(prix, n):
    """Toutes les périodes de n séances : part gagnante, pire, médiane (en %)."""
    r = [(prix[i + n] / prix[i] - 1) * 100 for i in range(len(prix) - n)]
    if not r: return None
    return {'n': len(r), 'gagnant': round(100 * sum(1 for x in r if x > 0) / len(r), 1),
            'pire': round(min(r), 1), 'mediane': round(statistics.median(r), 1), 'meilleur': round(max(r), 1)}


def baisse_max(serie):
    pic, dpic, pire = serie[0][1], serie[0][0], (0, None, None)
    for d, p in serie:
        if p > pic: pic, dpic = p, d
        b = p / pic - 1
        if b < pire[0]: pire = (b, dpic, d)
    return {'pct': round(pire[0] * 100, 1), 'du': pire[1], 'au': pire[2]}


def societe(f, indice):
    H = [(x[0], x[1], x[2] if len(x) > 2 else None) for x in f['historique'] if x[1]]
    if len(H) < 30: return None
    S = [(d, p) for d, p, _ in H]
    prix = [p for _, p in S]
    d0, p0, d1, p1 = S[0][0], S[0][1], S[-1][0], S[-1][1]
    divs = [x for x in (f.get('dividendes') or []) if x.get('montant') and d0 < x['detachement'] <= d1]
    par_an = {}
    for x in divs:
        a = x['detachement'][:4]
        par_an[a] = round(par_an.get(a, 0) + x['montant'], 2)
    tot_div = sum(x['montant'] for x in divs)
    ans = sorted(par_an)
    hausse3 = all(a in par_an for a in ('2023', '2024', '2025', '2026')) and par_an['2023'] < par_an['2024'] < par_an['2025'] < par_an['2026']
    # échanges : médiane de (volume × cours) sur la dernière année de Bourse
    val = [p * v for _, p, v in H[-AN:] if v is not None and 0 <= v < 1e10]
    i0 = next((i for i, x in enumerate(indice) if x[0] >= d0), None)
    idx = (indice[-1][1] / indice[i0][1] - 1) * 100 if i0 is not None else None
    fa = fenetres(prix, AN)
    return {
        'code': f['code'], 'depuis': d0, 'complet': d0 <= '2023-01-05',
        'prix': round((p1 / p0 - 1) * 100, 1), 'total': round(((p1 + tot_div) / p0 - 1) * 100, 1),
        'div_pts': round(tot_div / p0 * 100, 1), 'div_ans': len(ans), 'div_par_an': par_an, 'div_hausse3': hausse3,
        'rend_achat': round(par_an.get(d1[:4], 0) / p0 * 100, 1) if par_an.get(d1[:4]) else None,
        'baisse': baisse_max(S), 'an': fa, 'liq': round(statistics.median(val)) if val else None,
        'indice': round(idx, 1) if idx is not None else None,
    }


def calculer():
    jour = json.load(open(os.path.join(M, 'jour.json'), encoding='utf-8'))
    compo = next(i for i in jour['indices'] if i['nom'] == 'BRVM - COMPOSITE')
    I = [(d, v) for d, v in compo['serie']]
    niv = [v for _, v in I]
    socs = json.load(open(os.path.join(M, 'societes.json'), encoding='utf-8'))['societes']
    R, detach = [], [0] * 12
    for s in socs:
        p = os.path.join(M, 'fiches', s['code'] + '.json')
        if not os.path.exists(p): continue
        f = json.load(open(p, encoding='utf-8'))
        r = societe(f, I)
        if r: R.append(r)
        for x in f.get('dividendes') or []:
            if x.get('montant') and I[0][0] <= x['detachement'] <= I[-1][0]: detach[int(x['detachement'][5:7]) - 1] += 1
    var = sorted(((niv[i] / niv[i - 1] - 1, I[i][0]) for i in range(1, len(niv))), reverse=True)
    def sans(n):
        ecart = {d for _, d in var[:n]}
        v = 1.0
        for i in range(1, len(niv)):
            if I[i][0] not in ecart: v *= niv[i] / niv[i - 1]
        return round((v - 1) * 100, 1)
    liq = sorted((r['liq'] or 0 for r in R), reverse=True)
    marche = {
        'du': I[0][0], 'au': I[-1][0], 'seances': len(I), 'perf': round((niv[-1] / niv[0] - 1) * 100, 1),
        'durees': {str(n): fenetres(niv, n) for n in (21, 125, 250, 500, 750)},
        'sans_meilleures': {str(n): sans(n) for n in (5, 10, 20)},
        'seances_hausse': round(100 * sum(1 for x, _ in var if x > 0) / len(var), 1),
        'meilleure': round(var[0][0] * 100, 1), 'pire': round(var[-1][0] * 100, 1),
        'baisse': baisse_max(I), 'detachements_par_mois': detach,
        'liq_mediane': round(statistics.median(liq)) if liq else None,
        'liq_top5_part': round(100 * sum(liq[:5]) / sum(liq), 1) if sum(liq) else None,
    }
    return {'date': jour['date'], 'marche': marche, 'societes': R}


def main():
    D = calculer()
    json.dump(D, open(os.path.join(M, 'reperes.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('Repères Ma BRVM · %d sociétés · %d séances' % (len(D['societes']), D['marche']['seances']))
    return D


if __name__ == '__main__':
    D = main()
    if '--bilan' in sys.argv:
        m, R = D['marche'], D['societes']
        C = [r for r in R if r['complet']]
        print(json.dumps(m, ensure_ascii=False))
        print('complets', len(C), 'médiane prix', statistics.median(r['prix'] for r in C), 'total', statistics.median(r['total'] for r in C),
              'div_pts', statistics.median(r['div_pts'] for r in C))
        print('battent indice (total)', sum(1 for r in C if r['total'] > r['indice']), '(prix)', sum(1 for r in C if r['prix'] > r['indice']), 'négatifs total', [r['code'] for r in C if r['total'] < 0])
        print('top total', [(r['code'], r['total'], r['prix']) for r in sorted(C, key=lambda r: -r['total'])[:6]])
        print('flop total', [(r['code'], r['total'], r['prix']) for r in sorted(C, key=lambda r: r['total'])[:6]])
        print('div 4/4', sum(1 for r in R if r['div_ans'] >= 4), 'jamais', sorted(r['code'] for r in R if r['div_ans'] == 0), 'hausse3', sorted(r['code'] for r in R if r['div_hausse3']))
        print('toujours gagnant 1 an', sorted(r['code'] for r in R if r['an'] and r['an']['gagnant'] == 100))
        print('an gagnant médiane', statistics.median(r['an']['gagnant'] for r in R if r['an']), 'pire médiane', statistics.median(r['an']['pire'] for r in R if r['an']))
        print('baisse médiane', statistics.median(r['baisse']['pct'] for r in R), '>30', sum(1 for r in R if r['baisse']['pct'] < -30), '>50', sum(1 for r in R if r['baisse']['pct'] < -50), 'sur', len(R))
        print('liq top', [(r['code'], round(r['liq'] / 1e6, 1)) for r in sorted(R, key=lambda r: -(r['liq'] or 0))[:6]], 'bas', [(r['code'], round((r['liq'] or 0) / 1e6, 2)) for r in sorted(R, key=lambda r: (r['liq'] or 0))[:5]])
        print('rend achat', [(r['code'], r['rend_achat']) for r in sorted(C, key=lambda r: -(r['rend_achat'] or 0))[:6]])
        print('div pts top', [(r['code'], r['div_pts']) for r in sorted(C, key=lambda r: -r['div_pts'])[:5]])
        for c in ('ONTBF', 'UNLC', 'ORGT', 'SNTS', 'BOAC', 'FTSC'):
            print([ (r['code'], r['prix'], r['total'], r['baisse'], r['liq']) for r in R if r['code'] == c])
