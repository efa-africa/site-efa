#!/usr/bin/env python3
"""EFA · efa. abonnement : crée un accès (prénom + nom + code à 6 chiffres) pour une formule.

Usage :  python3 scripts/formules/creer_acces.py "Prénom" "Nom" essentiel|integral|cercle|privilege [jours=30] [début=AAAA-MM-JJ]
Le code est tiré au hasard et affiché une seule fois : il n'est écrit nulle part.
Le site ne reçoit que l'empreinte (data/acces-formules.json) : ni le nom, ni le code.
Pour retirer un accès : supprimer sa ligne dans data/acces-formules.json (repérée par sa date et sa formule).
"""
import sys, json, hashlib, secrets, unicodedata, re, datetime, os
ITER, SEL = 120000, 'efa-abonnement-2026|'
FORMULES = ('essentiel', 'integral', 'cercle', 'privilege')
def norme(prenom, nom):
    s = unicodedata.normalize('NFD', (prenom + ' ' + nom).lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()
def empreinte(prenom, nom, code):
    return hashlib.pbkdf2_hmac('sha256', code.encode(), (SEL + norme(prenom, nom)).encode(), ITER, 16).hex()
if __name__ == '__main__':
    if len(sys.argv) < 4 or sys.argv[3] not in FORMULES: sys.exit(__doc__)
    prenom, nom, f = sys.argv[1], sys.argv[2], sys.argv[3]
    jours = int(sys.argv[4]) if len(sys.argv) > 4 else 30
    deb = datetime.date.fromisoformat(sys.argv[5]) if len(sys.argv) > 5 else datetime.date.today()
    fin = deb + datetime.timedelta(days=jours)
    chemin = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data', 'acces-formules.json')
    d = json.load(open(chemin, encoding='utf8')) if os.path.exists(chemin) else {'iter': ITER, 'acces': []}
    deja = {a['h'] for a in d['acces']}
    while True:
        code = '%06d' % secrets.randbelow(1000000)
        h = empreinte(prenom, nom, code)
        if h not in deja: break
    d['acces'].append({'h': h, 'f': f, 'deb': deb.isoformat(), 'fin': fin.isoformat()})
    d['maj'] = datetime.date.today().isoformat()
    json.dump(d, open(chemin, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print('%s %s · %s · code %s · du %s au %s' % (prenom, nom, f, code, deb.isoformat(), fin.isoformat()))
