#!/usr/bin/env python3
"""EFA · Remet les modèles clone/_*.html à jour à partir des pages fabriquées (index.html, coaching.html…).

Pourquoi : les pages fabriquées sont souvent modifiées directement. Si les modèles restent anciens,
scripts/clone/habiller.py effacerait ces modifications. Ce script recopie chaque page dans son modèle,
puis vérifie, dans une copie de travail, que habiller.py refabrique exactement les mêmes pages.

Usage (racine du dépôt) : python3 scripts/clone/synchro-modeles.py
Sortie : « modèles à jour » (rien changé), « modèles resynchronisés : … » ou une erreur (code 1).
"""
import os, re, sys, shutil, subprocess, tempfile
RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(RACINE)
MOD = {'_index.html': 'index.html', '_coaching.html': 'coaching.html', '_marches-labo.html': 'marches-labo.html',
       '_etudes-prospective.html': 'etudes-prospective.html', '_ely.html': 'ely.html', '_musee.html': 'musee.html',
       '_acteurs.html': 'acteurs.html'}

def bloc_v1():
    v1 = open('accueil-v1.html', encoding='utf8').read(); h = v1[:v1.find('</head>')]
    return '\n'.join(re.findall(r'<title>.*?</title>|<meta (?:name="description"|property="og:[^"]+"|name="twitter:[^"]+")[^>]*>'
                                r'|<link rel="(?:canonical|apple-touch-icon)"[^>]*>|<script type="application/ld\+json">.*?</script>', h, re.S))

def modele_depuis(page):
    s = open(page, encoding='utf8').read()
    if page == 'index.html':
        b = bloc_v1()
        if b + '\n</head>' not in s:
            sys.exit('index.html : en-tête de l’ancien accueil introuvable, synchronisation arrêtée')
        s = s.replace(b + '\n</head>', '<title>EFA</title></head>', 1)
    return s

nouveaux = {m: modele_depuis(p) for m, p in MOD.items()}
changes = [m for m, s in nouveaux.items() if open(os.path.join('clone', m), encoding='utf8').read() != s]
if not changes:
    print('modèles à jour'); sys.exit(0)

# vérification dans une copie : habiller.py doit refabriquer les pages à l'identique
tmp = tempfile.mkdtemp()
fichiers = subprocess.check_output(['git', 'ls-files', '-z']).decode().split('\0')
for f in filter(None, fichiers):
    d = os.path.join(tmp, f); os.makedirs(os.path.dirname(d), exist_ok=True)
    if os.path.isfile(f): shutil.copy2(f, d)
for p in MOD.values(): shutil.copy2(p, os.path.join(tmp, p))
for m, s in nouveaux.items(): open(os.path.join(tmp, 'clone', m), 'w', encoding='utf8').write(s)
subprocess.check_call([sys.executable, 'scripts/clone/habiller.py'], cwd=tmp, stdout=subprocess.DEVNULL)
ecarts = [p for p in MOD.values() if open(os.path.join(tmp, p), encoding='utf8').read() != open(p, encoding='utf8').read()]
shutil.rmtree(tmp, ignore_errors=True)
if ecarts:
    sys.exit('vérification échouée, modèles non modifiés : ' + ', '.join(ecarts))
for m in changes: open(os.path.join('clone', m), 'w', encoding='utf8').write(nouveaux[m])
print('modèles resynchronisés : ' + ', '.join(changes))
