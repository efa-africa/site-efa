# -*- coding: utf-8 -*-
"""EFA · Onglet Marchés : fabrique les fichiers légers lus par les pages (data/marches/).
Lancé après chaque collecte (workflow « Collecte BRVM »). Aucun cours en séance : seulement des clôtures.
Contrôles : sources présentes, texte_efa vide sur les titres bloqués (SNTS, ORAC), au moins 40 titres par séance."""
import csv, json, os, re, sys, datetime, collections

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

def calendrier(jour, cotees):
    """Calendrier à partir des bulletins officiels : opérations annoncées, dividendes, publications et avis.
    Chaque élément : date, catégorie, société (symbole si coté), texte, date à laquelle le bulletin l'a annoncé."""
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from etats_financiers_lire import trouver_symbole, symboles, ALIAS
    noms = symboles()
    try:
        EVB = json.load(open(D('data', 'brvm', 'evenements_bulletins.json'), encoding='utf-8'))['evenements']
        DIVS = json.load(open(D('data', 'brvm', 'dividendes.json'), encoding='utf-8'))['dividendes']
    except Exception:
        return {}
    def cat(t):
        b = t.lower()
        if 'dividende' in b: return 'dividende'
        if 'convocation' in b or 'assemblée' in b or 'assemblee' in b: return 'assemblee'
        if re.search(r'etats? financiers|états financiers|rapport d.activit|rapport annuel|trimestre|semestre|résultats|resultats', b): return 'resultats'
        if re.search(r'intérêts|interets|remboursement|obligat|bond|\.o\d|emprunt', b): return 'obligation'
        if 'première cotation' in b or 'premiere cotation' in b or 'introduction' in b: return 'cotation'
        if 'fractionnement' in b or 'regroupement' in b or 'attribution' in b or 'capital' in b: return 'operation'
        return 'autre'
    cache = {}
    def sym(*textes):
        for t in textes:
            if not t: continue
            if t not in cache:
                q = t.split(' - ')[-1] if ' - ' in t else t
                c = trouver_symbole(q, noms, ALIAS) or trouver_symbole(t, noms, ALIAS)
                cache[t] = c if c in cotees else None
            if cache[t]: return cache[t]
        return None
    out = []
    for e in EVB:
        texte = e.get('texte') or ' - '.join(x for x in (e.get('nature'), e.get('objet')) if x)
        if re.fullmatch(r'\d{8}', e.get('emetteur', '')):   # colonnes décalées dans le bulletin
            texte = ' - '.join(x for x in (e.get('numero'), e.get('nature')) if x)
        c = cat(texte)
        if e['type'] == 'avis' and c in ('autre',) and e.get('emetteur') == 'AMF-UMOA':
            c = 'autre'
        s = sym(e.get('objet'), e.get('emetteur'), texte) if c != 'obligation' else None
        out.append({'d': e.get('date_annoncee') or e['vu_le'], 'annonce': e['vu_le'], 'prevu': bool(e.get('date_annoncee')), 'cat': c,
                    'code': s, 'emetteur': e.get('emetteur') if not re.fullmatch(r'\d{8}', e.get('emetteur', '')) else '', 'texte': re.sub(r'\s+', ' ', texte).strip()})
    dv = [{'code': x['code'], 'montant': x['montant_net'], 'paiement': x['date_paiement'], 'detachement': x.get('date_detachement'), 'annonce': x.get('vu_le')}
          for x in DIVS if x.get('date_paiement') and x['date_paiement'] >= str(int(jour[:4]) - 2) and x['code'] in cotees]
    dv.sort(key=lambda x: x['paiement'], reverse=True)
    out.sort(key=lambda x: (x['d'], x['annonce']), reverse=True)
    return {'maj': jour, 'a_venir': sorted([x for x in out if x['prevu'] and x['d'] > jour], key=lambda x: x['d']),
            'evenements_bulletins': [x for x in out if x['annonce'] >= str(int(jour[:4]) - 1)][:1500], 'dividendes': dv,
            'source_bulletins': 'BRVM, bulletins officiels de la cote (opérations en cours, avis, communiqués)'}


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
    def ajuster(code, date, k, type_op=None):
        for d in par_titre[code]:
            if d < date:
                par_titre[code][d]['c'] = round(par_titre[code][d]['c'] / k, 2); par_titre[code][d]['v'] = int(round(par_titre[code][d]['v'] * k))
        AJUST[code].append({'date': date, 'facteur': k, 'type': type_op or ('fractionnement' if k >= 1 else 'regroupement')})
    # 1. Opérations déclarées (data/brvm/operations.json, sourcées au bulletin officiel) : elles font foi.
    OPS = json.load(open(D('data', 'brvm', 'operations.json'), encoding='utf-8'))['operations']
    declarees = set()
    for op in OPS:
        if op['code'] in par_titre:
            declarees.add((op['code'], op['date']))
            if op.get('ajuster', True) is False:
                AJUST[op['code']].append({'date': op['date'], 'facteur': 1, 'type': op['type'], 'ajuste': False})
                continue
            ajuster(op['code'], op['date'], float(op['rapport']), op['type'])
            print('Opération %s du %s : rapport %s (%s)' % (op['code'], op['date'], op['rapport'], op['source']))
    # 2. Contrôle : un saut de cours que la variation officielle du jour n'explique pas, sans opération déclarée,
    #    est ajusté par prudence et signalé, pour qu'on le déclare avec sa source.
    for code, serie in par_titre.items():
        ds = sorted(serie)
        for a, b in zip(ds, ds[1:]):
            p = serie[b]['p']
            if p is None or p <= -100 or not serie[a]['c']: continue
            f = serie[a]['c'] / (serie[b]['c'] / (1 + p / 100))
            if 0.55 < f < 1.8: continue
            if (code, b) in declarees: continue
            k = float(round(f)) if f > 1 else 1 / round(1 / f)
            ajuster(code, b, k)
            print('ALERTE : saut de cours non déclaré %s au %s (facteur %s) : ajouter l’opération dans data/brvm/operations.json' % (code, b, k))
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

    # Dividendes (data/brvm/dividendes.json) : montants ramenés à une action d'aujourd'hui (fractionnements, actions gratuites).
    DIV = collections.defaultdict(list)
    try:
        for e in json.load(open(D('data', 'brvm', 'dividendes.json'), encoding='utf-8'))['dividendes']:
            det = e.get('date_detachement') or e['date_paiement']
            if det < premiere or not e.get('montant_net'): continue
            k = 1.0
            for op in OPS:
                if op['code'] == e['code'] and op.get('ajuster', True) is not False and op['date'] > det:
                    k *= float(op['rapport'])
            DIV[e['code']].append({'detachement': det, 'detachement_estime': not e.get('date_detachement'), 'paiement': e['date_paiement'],
                                   'montant_publie': e['montant_net'], 'montant': round(e['montant_net'] / k, 2)})
    except (OSError, ValueError, KeyError):
        pass

    def avec_dividendes(serie, code, d0):
        # Performance « dividendes compris » : (cours final + dividendes détachés depuis) / cours de départ
        dates = sorted(serie); avant = [d for d in dates if d <= d0]
        if not avant: return None
        c0, c1 = serie[avant[-1]]['c'], serie[dates[-1]]['c']
        dv = sum(x['montant'] for x in DIV.get(code, []) if avant[-1] < x['detachement'] <= dates[-1])
        return round(((c1 + dv) / c0 - 1) * 100, 2) if c0 else None

    # Ratios publiés par la BRVM (dernier bulletin officiel) et chiffres clés des publications des sociétés
    try:
        RAT = json.load(open(D('data', 'brvm', 'ratios.json'), encoding='utf-8'))
    except Exception:
        RAT = {'titres': {}}
    RES = collections.defaultdict(list)
    try:
        for p in json.load(open(D('data', 'brvm', 'etats_financiers.json'), encoding='utf-8'))['publications']:
            if p.get('symbole'):
                RES[p['symbole']].append(p)
    except Exception:
        pass
    MULT = {'FCFA': 1, 'milliers FCFA': 1e3, 'millions FCFA': 1e6, '': 1}

    def resultats(code):
        """Exercices annuels (n et n-1 de chaque publication ; la plus récente l'emporte), semestres, et documents.
        Les chiffres lus sur un scan (lecture optique) ne sont pas affichés : seul le document est listé."""
        ex, sem, docs = {}, [], []
        for p in sorted(RES.get(code, []), key=lambda x: x.get('date_publication', '')):
            docs.append({'titre': p['document'], 'date': p.get('date_publication'), 'pdf': (p.get('pdf') or [None])[0], 'type': p['type']})
            if p.get('texte_ocr') or not p.get('chiffres'):
                continue
            m = re.search(r'(\d{4})', p.get('periode') or '')
            if not m:
                continue
            an, k = int(m.group(1)), MULT.get(p.get('unite', ''), 1)
            val = lambda v: round(v * k) if v is not None else None
            if (p.get('periode') or '').lower().startswith('exercice'):
                for a, cle in ((an, 'n'), (an - 1, 'n_1')):
                    e = ex.setdefault(a, {})
                    for c, v in p['chiffres'].items():
                        if v.get(cle) is not None and (cle == 'n' or c not in e):
                            e[c] = val(v[cle])
                    if cle == 'n':
                        e['_source'] = {'titre': p['document'], 'date': p.get('date_publication'), 'pdf': (p.get('pdf') or [None])[0]}
            elif 'semestre' in (p.get('periode') or '').lower():
                sem.append({'periode': p['periode'], 'chiffres': {c: val(v['n']) for c, v in p['chiffres'].items()},
                            'precedent': {c: val(v['n_1']) for c, v in p['chiffres'].items()}, 'date': p.get('date_publication'), 'pdf': (p.get('pdf') or [None])[0]})
        return {'exercices': [dict(annee=a, **ex[a]) for a in sorted(ex)][-6:], 'semestres': sem[-2:], 'documents': list(reversed(docs))[:12]}

    os.makedirs(os.path.join(SORTIE, 'fiches'), exist_ok=True)
    liste = []
    for code in sorted(par_titre):
        serie = par_titre[code]; dates = sorted(serie)
        if dates[-1] < (dj - datetime.timedelta(days=30)).isoformat():
            continue   # titre qui n'est plus coté (radié ou retiré) : on le garde dans la base, pas dans la liste
        s = REF.get(code, {'code': code, 'nom': code})
        perf = {}
        for k, d0 in reperes.items():
            perf[k] = depuis(serie, d0) if d0 >= premiere else None   # pas de période plus longue que l'historique disponible
        perf_div = {k: (avec_dividendes(serie, code, reperes[k]) if reperes[k] >= premiere else None) for k in ('ytd', 'a1')}
        dern = serie[dates[-1]]
        cap = None
        na = (s.get('nombre_actions') or {}).get('valeur') if s.get('nombre_actions') else None
        if na: cap = round(dern['c'] * na)
        item = {'code': code, 'nom': s.get('nom'), 'nom_court': s.get('nom_court'), 'pays': s.get('pays'), 'secteur': s.get('secteur'),
                'date': dates[-1], 'cours': dern['c'], 'var_jour': dern['p'], 'volume': dern['v'], 'valeur_echangee': round(dern['c'] * dern['v']),
                'perf': perf, 'perf_div': perf_div, 'capitalisation': cap,
                'per': (RAT['titres'].get(code) or {}).get('per'), 'rendement': (RAT['titres'].get(code) or {}).get('rendement_net_pct'), 'mini': [serie[d]['c'] for d in dates[-63:]], 'mini_du': dates[-63:][0] if dates else None, 'mini_d': dates[-63:]}
        liste.append(item)
        fiche = dict(item)
        fiche.update({'identite': {k: s.get(k) for k in ('date_introduction', 'nombre_actions', 'flottant_pct', 'site')},
                      'texte_efa': None if s.get('texte_efa_bloque') else s.get('texte_efa'),
                      'texte_bloque': bool(s.get('texte_efa_bloque')),
                      'ajustements': AJUST.get(code, []),
                      'dividendes': DIV.get(code, []),
                      'ratios': dict(RAT['titres'].get(code) or {}, bulletin_du=RAT.get('bulletin_du')) if RAT['titres'].get(code) else None,
                      'resultats': resultats(code),
                      'historique': [[d, serie[d]['c'], serie[d]['v']] for d in dates],
                      'source': 's-brvm-cote'})
        json.dump(fiche, open(os.path.join(SORTIE, 'fiches', code + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    json.dump({'date': jour, 'premiere_seance': premiere, 'societes': liste}, open(os.path.join(SORTIE, 'societes.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

    # Indices
    ind = lire_csv(D('data', 'brvm', 'indices.csv'))
    if os.path.isdir(hdir):
        deja = {r['date_seance'] for r in ind}
        for f in sorted(os.listdir(hdir)):
            if f.startswith('indices_') and f.endswith('.csv'):
                ind += [r for r in lire_csv(os.path.join(hdir, f)) if r['date_seance'] not in deja]
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
    secteurs = [bloc(n) for n in series if cat[n] == 'sectoriel' and max(x[0] for x in series[n]) == jour]
    # Composite « total return » (dividendes réinvestis), publié depuis le 2 janvier 2026 : repère de « Ma BRVM ».
    tr = [n for n in series if cat[n] == 'total_return']
    total_return = bloc(tr[0]) if tr else None
    vals = [x for x in liste if x['date'] == jour and x['var_jour'] is not None]
    jour_json = {'date': jour, 'genere_le': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'indices': principaux, 'secteurs': secteurs, 'total_return': total_return,
                 'hausses': [x['code'] for x in sorted(vals, key=lambda x: -x['var_jour'])[:5]],
                 'baisses': [x['code'] for x in sorted(vals, key=lambda x: x['var_jour'])[:5]],
                 'volumes': [x['code'] for x in sorted(vals, key=lambda x: -x['valeur_echangee'])[:5]],
                 'sources': ['s-brvm-cote', 's-brvm-indices']}
    json.dump(jour_json, open(os.path.join(SORTIE, 'jour.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    ev = json.load(open(D('data', 'brvm', 'evenements.json'), encoding='utf-8'))
    for e in ev.get('evenements', []):
        if e.get('source') not in sources: erreur('événement %s : source absente' % e.get('id'))
    ev.update(calendrier(jour, {x['code']: x for x in liste}))
    json.dump(ev, open(os.path.join(SORTIE, 'calendrier.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('Marchés · séance du %s · %d titres · %d indices' % (jour, len(liste), len(principaux) + len(secteurs)))
    # Repères de décision de « Ma BRVM » (data/marches/reperes.json), recalculés à chaque séance.
    try:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import reperes
        reperes.main()
    except Exception as e:
        print('Repères Ma BRVM non recalculés : %s' % e)

if __name__ == '__main__':
    main()
