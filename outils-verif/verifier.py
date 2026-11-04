#!/usr/bin/env python3
"""EFA · Vérification du matin. Usage (racine du dépôt) : python3 outils-verif/verifier.py
Contrôle, sans rien publier :
  1. EFA News : date de la dernière publication, et le générateur outils-news/build_news.py tourne sans erreur (dans une copie).
  2. Modèles des pages fabriquées : à jour par rapport aux pages (scripts/clone/synchro-modeles.py, qui peut les resynchroniser).
  3. Fichiers de données JSON du site lisibles.
  4. Pages clés : chargées dans un navigateur, sans erreur JavaScript ni fichier du site introuvable.
Affiche un rapport ; code de sortie 1 s'il y a au moins un problème.
"""
import os, sys, json, glob, shutil, subprocess, tempfile, datetime, threading, http.server, functools, socketserver
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(RACINE)
pb, ok = [], []
auj = datetime.date.today()

# 1. EFA News
try:
    d = json.load(open('news/news-data.json', encoding='utf8'))
    pubs = sorted({a.get('publication', '') for a in d['articles'] if a.get('statut') in ('publié', 'corrigé')})
    der = pubs[-1] if pubs else ''
    ecart = (auj - datetime.date.fromisoformat(der)).days if der else 99
    (ok if ecart <= 1 else pb).append('EFA News : dernière publication le %s (il y a %d jour%s)' % (der, ecart, 's' if ecart > 1 else ''))
    tmp = tempfile.mkdtemp()
    for f in filter(None, subprocess.check_output(['git', 'ls-files', '-z']).decode().split('\0')):
        if os.path.isfile(f): dst = os.path.join(tmp, f); os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy2(f, dst)
    r = subprocess.run([sys.executable, 'outils-news/build_news.py', '.', auj.isoformat()], cwd=tmp, capture_output=True, text=True)
    shutil.rmtree(tmp, ignore_errors=True)
    if r.returncode: pb.append('EFA News : le générateur échoue → ' + (r.stderr.strip().splitlines() or ['?'])[-1][:200])
    else: ok.append('EFA News : le générateur fonctionne')
except Exception as e:
    pb.append('EFA News : lecture impossible (%s)' % e)

# 2. Modèles
r = subprocess.run([sys.executable, 'scripts/clone/synchro-modeles.py'], capture_output=True, text=True)
msg = (r.stdout + r.stderr).strip().splitlines()[-1] if (r.stdout + r.stderr).strip() else '?'
(pb if r.returncode else ok).append('Modèles des pages : ' + msg)

# 3. JSON
for f in ['news/news-data.json', 'ambassadeurs-semaine.json'] + glob.glob('*.json') + glob.glob('data/*.json'):
    if not os.path.isfile(f): continue
    try: json.load(open(f, encoding='utf8'))
    except Exception as e: pb.append('Fichier %s illisible : %s' % (f, e))

# 4. Pages clés dans un navigateur
PAGES = ['index.html', 'coaching.html', 'generateur-de-projet.html', 'news.html', 'investir.html', 'ambassadeurs.html',
         'diagnostic.html', 'outils.html', 'marches.html', 'acteurs.html']
try:
    der_art = sorted(glob.glob('news/20*.html'))[-1]; PAGES.append(der_art)
except IndexError: pass
class S(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(S, directory=RACINE)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        for pg in PAGES:
            if not os.path.exists(pg): pb.append('Page absente : ' + pg); continue
            ctx = b.new_context(viewport={'width': 390, 'height': 844}); page = ctx.new_page()
            errs, manq = [], []
            page.route('**/*', lambda rt: rt.fulfill(body='') if any(h in rt.request.url for h in ('goatcounter', 'zgo.at', 'workers.dev', 'fonts.g', 'web3forms')) else rt.continue_())
            page.on('pageerror', lambda e: errs.append(str(e)[:160]))
            page.on('response', lambda r: manq.append(r.url.split(str(port))[-1]) if r.status == 404 and str(port) in r.url else None)
            try: page.goto('http://127.0.0.1:%d/%s' % (port, pg), wait_until='load', timeout=30000); page.wait_for_timeout(1500)
            except Exception as e: errs.append('chargement : ' + str(e)[:120])
            if errs: pb.append('%s : erreur JavaScript → %s' % (pg, errs[0]))
            if manq: pb.append('%s : fichier introuvable → %s' % (pg, ', '.join(sorted(set(manq))[:4])))
            ctx.close()
        b.close()
    ok.append('Pages clés : %d contrôlées' % len(PAGES))
except Exception as e:
    pb.append('Contrôle des pages impossible : %s' % e)
srv.shutdown()

print('VÉRIFICATION EFA · %s' % auj.isoformat())
for x in pb: print('PROBLÈME · ' + x)
for x in ok: print('ok · ' + x)
sys.exit(1 if pb else 0)
