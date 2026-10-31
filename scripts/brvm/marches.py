# -*- coding: utf-8 -*-
"""EFA · Onglet Marchés : fabrique les fichiers légers lus par les pages (data/marches/).
Lancé après chaque collecte (workflow « Collecte BRVM »). Aucun cours en séance : seulement des clôtures.
Contrôles : sources présentes, texte_efa vide sur les titres bloqués (SNTS, ORAC), au moins 40 titres par séance."""
import csv, json, os, sys, datetime, collections

RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = lambda *p: os.path.join(RACINE, *p)
SORTIE = D('data', 'marches')

def lire_csv(p):
    with open(p, encoding='utf-8') as f:
        return list(csv.DictReader(f))

def nombre(x):
    try: return float(str(x).replace(',', '.'))
    except Exception: return None

def erreur(msg):
    print('ERREUR · ' + msg, file=sys.stderr); sys.exit(1)

def main():
    ref = json.load(open(D('data', 'brvm', 'societes.json'), encoding='utf-8'))
    sources = {s['id'] for s in json.load(open(D('data', 'brvm', 'sources.json'), encoding='utf-8'))['sources']}
    # Contrôles du référentiel
    for s in ref['societes']:
        if s.get('texte_efa_bloque') and s.get('texte_efa'):
            erreur('texte_efa renseigné sur un titre bloqué : %s' % s['code'])
        for k in ('nombre_actions', 'flottant_pct'):
            v = s.get(k)
            if v is not None and v.get('source') not in sources:
                erreur('%s · %s : source absente de sources.json' % (s['code'], k))
    REF = {s['code']: s for s in ref['societes']}

    # Historique : base EFA + historique extrait des bulletins (data/brvm/historique/actions_AAAA.csv)
    lignes = lire_csv(D('data', 'brvm', 'actions.csv'))
    hdir = D('data', 'brvm', 'historique')
    if os.path.isdir(hdir):
        for f in sorted(os.listdir(hdir)):
            if f.startswith('actions_') and f.endswith('.csv'):
                lignes += lire_csv(os.path.join(hdir, f))
    par_titre = collections.defaultdict(dict)
    for r in lignes:
        c = nombre(r['cours_cloture'])
        if c is None: continue
        par_titre[r['symbole']][r['date_seance']] = {'c': c, 'v': int(nombre(r['volume']) or 0), 'p': nombre(r['variation_pct'])}
    # Fractionnements et regroupements d'actions : la variation officielle du jour se calcule sur un cours de veille ajusté.
    # Si la clôture précédente ne correspond pas à ce cours ajusté (écart de plus de 1,8 fois), on ajuste tout l'historique antérieur,
    # pour que courbes et performances restent comparables.
    AJUST = collections.defaultdict(list)
    for code, serie in par_titre.items():
        ds = sorted(serie)
        for a, b in zip(ds, ds[1:]):
            p = serie[b]['p']
            if p is None or p <= -100 or not serie[a]['c']: continue
            f = serie[a]['c'] / (serie[b]['c'] / (1 + p / 100))
            if 0.55 < f < 1.8: continue
            k = float(round(f)) if f > 1 else 1 / round(1 / f)
            for d in ds:
                if d <= a:
                    serie[d]['c'] = round(serie[d]['c'] / k, 2); serie[d]['v'] = int(round(serie[d]['v'] * k))
            AJUST[code].append({'date': b, 'facteur': k})
            print('Ajustement %s au %s : facteur %s' % (code, b, k))
    seances = sorted({d for t in par_titre.values() for d in t})
    if not seances: erreur('aucune séance')
    jour = seances[-1]
    du_jour = {k: v[jour] for k, v in par_titre.items() if jour in v}
    if len(du_jour) < 40: erreur('séance du %s : %d titres seulement (40 attendus)' % (jour, len(du_jour)))

    def depuis(serie, d0):
        """Variation en % entre la dernière clôture connue à la date d0 (ou juste avant) et la dernière clôture."""
        dates = sorted(serie)
        avant = [d for d in dates if d <= d0]
        if not avant: return None
        c0, c1 = serie[avant[-1]]['c'], serie[dates[-1]]['c']
        return round((c1 / c0 - 1) * 100, 2) if c0 else None

    dj = datetime.date.fromisoformat(jour)
    reperes = {'s1': (dj - datetime.timedelta(days=7)).isoformat(), 'm1': (dj - datetime.timedelta(days=30)).isoformat(),
               'ytd': '%d-12-31' % (dj.year - 1), 'a1': (dj - datetime.timedelta(days=365)).isoformat(), 'a5': (dj - datetime.timedelta(days=5 * 365)).isoformat()}
    premiere = seances[0]

    os.makedirs(os.path.join(SORTIE, 'fiches'), exist_ok=True)
    liste = []
    for code in sorted(par_titre):
        serie = par_titre[code]; dates = sorted(serie)
        s = REF.get(code, {'code': code, 'nom': code})
        perf = {}
        for k, d0 in reperes.items():
            perf[k] = depuis(serie, d0) if d0 >= premiere else None   # pas de période plus longue que l'historique disponible
        dern = serie[dates[-1]]
        cap = None
        na = (s.get('nombre_actions') or {}).get('valeur') if s.get('nombre_actions') else None
        if na: cap = round(dern['c'] * na)
        item = {'code': code, 'nom': s.get('nom'), 'nom_court': s.get('nom_court'), 'pays': s.get('pays'), 'secteur': s.get('secteur'),
                'date': dates[-1], 'cours': dern['c'], 'var_jour': dern['p'], 'volume': dern['v'], 'valeur_echangee': round(dern['c'] * dern['v']),
                'perf': perf, 'capitalisation': cap, 'mini': [serie[d]['c'] for d in dates[-63:]], 'mini_du': dates[-63:][0] if dates else None}
        liste.append(item)
        fiche = dict(item)
        fiche.update({'identite': {k: s.get(k) for k in ('date_introduction', 'nombre_actions', 'flottant_pct', 'site')},
                      'texte_efa': None if s.get('texte_efa_bloque') else s.get('texte_efa'),
                      'texte_bloque': bool(s.get('texte_efa_bloque')),
                      'ajustements': AJUST.get(code, []),
                      'historique': [[d, serie[d]['c'], serie[d]['v']] for d in dates],
                      'source': 's-brvm-cote'})
        json.dump(fiche, open(os.path.join(SORTIE, 'fiches', code + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    json.dump({'date': jour, 'premiere_seance': premiere, 'societes': liste}, open(os.path.join(SORTIE, 'societes.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

    # Indices
    ind = lire_csv(D('data', 'brvm', 'indices.csv'))
    series = collections.defaultdict(list); cat = {}
    for r in ind:
        series[r['indice']].append([r['date_seance'], nombre(r['cloture']), nombre(r['variation_pct']), nombre(r['variation_annuelle_pct'])])
        cat[r['indice']] = r['categorie']
    # Variation depuis le 31 décembre : calculée à partir des clôtures de fin d'année du bulletin officiel (references.json).
    # La colonne « Variation 31 décembre » de brvm.org/fr/indices ne correspond pas au bulletin officiel : on ne l'utilise pas.
    try:
        REF = json.load(open(D('data', 'brvm', 'references.json'), encoding='utf-8'))
        BASE = REF['cloture_31_decembre_%d' % (int(jour[:4]) - 1)]
    except Exception:
        BASE = {}
    def bloc(n):
        s = sorted(series[n]); d = s[-1]
        b = BASE.get(n)
        ytd = round((d[1] / b - 1) * 100, 2) if b and d[1] else None
        return {'nom': n, 'niveau': d[1], 'var_jour': d[2], 'var_ytd': ytd, 'date': d[0], 'serie': [[x[0], x[1]] for x in s]}
    principaux = [bloc(n) for n in ('BRVM - COMPOSITE', 'BRVM-30', 'BRVM - PRESTIGE') if n in series]
    secteurs = [bloc(n) for n in series if cat[n] == 'sectoriel']
    vals = [x for x in liste if x['date'] == jour and x['var_jour'] is not None]
    jour_json = {'date': jour, 'genere_le': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'indices': principaux, 'secteurs': secteurs,
                 'hausses': [x['code'] for x in sorted(vals, key=lambda x: -x['var_jour'])[:5]],
                 'baisses': [x['code'] for x in sorted(vals, key=lambda x: x['var_jour'])[:5]],
                 'volumes': [x['code'] for x in sorted(vals, key=lambda x: -x['valeur_echangee'])[:5]],
                 'sources': ['s-brvm-cote', 's-brvm-indices']}
    json.dump(jour_json, open(os.path.join(SORTIE, 'jour.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    ev = json.load(open(D('data', 'brvm', 'evenements.json'), encoding='utf-8'))
    for e in ev.get('evenements', []):
        if e.get('source') not in sources: erreur('événement %s : source absente' % e.get('id'))
    json.dump(ev, open(os.path.join(SORTIE, 'calendrier.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('Marchés · séance du %s · %d titres · %d indices' % (jour, len(liste), len(principaux) + len(secteurs)))

if __name__ == '__main__':
    main()
