#!/usr/bin/env python3
"""EFA · Site premium (ex-Clone) : habille toutes les pages du site efa.africa, à leur adresse d'origine.

Usage (depuis la racine du dépôt) :  python3 scripts/clone/habiller.py
Le script est sans effet de bord cumulatif : on peut le relancer après chaque nouvelle page (EFA News, leçon…).

Depuis la bascule du 30 octobre 2026 :
- L'accueil efa.africa (index.html) et les pages Ateliers (coaching.html), Marchés (marches.html) et
  Études et prospective (etudes-prospective.html) sont fabriqués à partir de leurs modèles clone/_*.html.
  Modifier les modèles, jamais les pages fabriquées.
- Toutes les autres pages (racine et news/) reçoivent, sur place, l'en-tête, le pied et l'habillage blanc et bleu
  (clone/habillage.css, clone/habillage.js, et clone/pages/<page>.css|js quand ils existent).
  L'ancien habillage est d'abord retiré : rien ne s'accumule.
- Les anciennes adresses /clone/… redirigent vers les adresses du site.
- L'ancienne page d'accueil est gardée, hors index, sous accueil-v1.html.
Les feuilles de style, scripts et images du design restent dans clone/ (clone/assets, clone/styles.css…).
"""
import os, re, sys, glob, shutil

RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(RACINE)
CLONE = 'clone'
VERSION = '20261101i'
SITE = 'https://efa.africa/'
VISUELS = {
    'tontine.html': 'etudes-terrain.webp', 'epargner.html': 'q2.webp',
    'preparer-ma-retraite.html': 'coach-patrimoine.webp', 'construire-son-budget.html': 'budget.webp',
    'methode.html': 'etudes-publiees.webp',
}
# modèle (dans clone/) → page fabriquée à la racine ; indexée ou non
MODELES = {'_index.html': ('index.html', True), '_coaching.html': ('coaching.html', True),
           '_marches-labo.html': ('marches-labo.html', False), '_etudes-prospective.html': ('etudes-prospective.html', False),
           '_ely.html': ('ely.html', True), '_musee.html': ('musee.html', True), '_acteurs.html': ('acteurs.html', True)}
FABRIQUEES = {v[0] for v in MODELES.values()}
EXCLUES = FABRIQUEES | {'accueil-v1.html'}

# ---------------------------------------------------------------- pages à habiller
pages = sorted(f for f in glob.glob('*.html') if f not in EXCLUES) + sorted(glob.glob('news/*.html'))
modele_accueil = open(os.path.join(CLONE, '_index.html'), encoding='utf8').read()

# ---------------------------------------------------------------- rubrique de chaque page (onglet actif)
RUBRIQUES = [('benefices', 'Apprendre et former'), ('pilier-progresser', 'Être coaché'), ('pilier-agir', 'Se lancer'),
             ('pilier-media', 'EFA News'), ('etudes', 'Études et prospective'), ('apropos', 'À propos')]
LIEN_RUBRIQUE = {'pilier-media': 'news.html', 'etudes': 'etudes-prospective.html', 'apropos': 'auteur.html#auteur'}
SECTION_DE = {'portes': 'benefices', 'benefices': 'benefices', 'calculateur': 'benefices',
              'pilier-progresser': 'pilier-progresser', 'pilier-agir': 'pilier-agir',
              'pilier-media': 'pilier-media', 'etudes-prospective': 'etudes-prospective'}
connues = set(pages)
rubrique = {}
blocs = list(re.finditer(r'<section[^>]*\bid="([^"]+)"', modele_accueil))
for k, m in enumerate(blocs):
    fin = blocs[k + 1].start() if k + 1 < len(blocs) else len(modele_accueil)
    sec = SECTION_DE.get(m.group(1))
    if sec:
        for h in re.findall(r'href="(?:\.\./|\./)?([^"#?:]+)', modele_accueil[m.start():fin]):
            if h in connues:
                rubrique.setdefault(h, sec)
for f in pages:
    if f.startswith('news/'):
        rubrique.setdefault(f, 'pilier-media')
rubrique['coaching.html'] = 'pilier-progresser'

# ---------------------------------------------------------------- liens : modèle (clone/) → racine du site
FICHIERS_CLONE = {os.path.basename(f) for f in glob.glob(os.path.join(CLONE, '*')) if os.path.isfile(f)}

def lien_racine(h):
    """Lien écrit dans un modèle de clone/ → lien relatif à la racine du site."""
    if re.match(r'^(https?:|mailto:|tel:|data:|javascript:|//)', h):
        return h
    if h.startswith('#'):
        return 'index.html' + h
    if h.startswith('./'):
        h = h[2:]
    if h.startswith('../'):
        return re.sub(r'^(\.\./)+', '', h)
    chemin = re.split(r'[#?]', h)[0]
    if chemin.startswith('assets/') or chemin.startswith('pages/'):
        return 'clone/' + h
    if chemin in FICHIERS_CLONE and not chemin.endswith('.html'):
        return 'clone/' + h
    if chemin.startswith('_') and chemin in MODELES:
        return MODELES[chemin][0] + h[len(chemin):]
    return h

def modele_vers_racine(s, garder_dieses):
    """Réécrit un modèle de clone/ pour qu'il fonctionne à la racine."""
    def attr(m):
        v = m.group(3)
        if garder_dieses and v.startswith('#'):
            return m.group(0)
        return '%s%s"%s"' % (m.group(1), m.group(2), lien_racine(v))
    s = re.sub(r'(\b(?:href|src|poster|data-src)\s*)(=)"([^"]*)"', attr, s)
    s = re.sub(r'\bsrcset="([^"]*)"', lambda m: 'srcset="%s"' % ', '.join(
        ' '.join([lien_racine(x.strip().split(' ')[0])] + x.strip().split(' ')[1:]) for x in m.group(1).split(',')), s)
    # chemins écrits dans les styles et les scripts de la page
    s = re.sub(r'''(url\(\s*['"]?|['"])assets/''', r'\1clone/assets/', s)
    s = re.sub(r'''(['"])\.\./([a-z0-9][^'"]*)''', r'\1\2', s)
    return s

menu = re.search(r'<nav id="menu" class="menu-panel"[^>]*>(.*?)</nav>', modele_accueil, re.S).group(1)
menu = re.sub(r'href="([^"]+)"', lambda m: 'href="%s"' % lien_racine(m.group(1)), menu)

def entete(page):
    actif = rubrique.get(page)
    if actif == 'etudes-prospective' or (page or '').startswith(('etude', 'africa-2075', 'enquete')): actif = 'etudes'
    if page in ('auteur.html', 'methode.html', 'rendez-vous.html'): actif = 'apropos'
    onglets = ''.join('<a href="%s"%s>%s</a>' % (LIEN_RUBRIQUE.get(i, 'index.html#' + i), ' aria-current="page"' if i == actif else '', t)
                      for i, t in RUBRIQUES)
    return ('<header class="header clone-head" id="clone-haut"><div class="container head-inner">'
            '<a class="efa-brand" href="/" aria-label="EFA — Accueil">'
            '<img class="efa-brand__bird" src="clone/assets/efa-oiseau.png" width="48" height="48" alt="">'
            '<span class="efa-brand__word" aria-hidden="true">efa<span class="efa-brand__dot"></span></span></a>'
            '<nav class="desktop-nav" aria-label="Navigation principale">%s</nav>'
            '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="clone-menu" '
            'aria-label="Ouvrir le menu"><span></span><span></span></button></div>'
            '<nav id="clone-menu" class="menu-panel" aria-label="Menu">%s</nav></header>') % (onglets, menu)

pied = re.search(r'<footer class="efa-foot">.*?</footer>', modele_accueil, re.S).group(0)
pied = pied.replace('<footer class="efa-foot">', '<footer class="efa-foot clone-foot">', 1)
BANDEAU = open('scripts/clone/bandeau-pourvous.html', encoding='utf8').read()
pied = BANDEAU + pied
pied = re.sub(r'href="([^"]+)"', lambda m: 'href="%s"' % lien_racine(m.group(1)), pied)
pied = re.sub(r'src="([^"]+)"', lambda m: 'src="%s"' % lien_racine(m.group(1)), pied)

# ---------------------------------------------------------------- CSS et JS de l'habillage
def regles_coquille():
    css = open(os.path.join(CLONE, 'styles.css'), encoding='utf8').read()
    css = css[css.find(':root'):]
    def lire(s):
        i, out = 0, []
        while i < len(s):
            j = s.find('{', i)
            if j < 0:
                break
            sel = s[i:j].strip()
            if sel.startswith('@media') or sel.startswith('@supports'):
                d, k = 1, j + 1
                while d:
                    d += s[k] == '{'
                    d -= s[k] == '}'
                    k += 1
                out.append((sel, lire(s[j + 1:k - 1])))
                i = k
            else:
                k = s.find('}', j)
                out.append((sel, s[j + 1:k]))
                i = k + 1
        return out
    cles = ('.header', '.head-inner', '.brand', '.desktop-nav', '.menu-toggle', '.menu-panel',
            '.efa-foot', '.ef-', '.skip', '.container')
    def garder(sel):
        sel = re.sub(r'/\*.*?\*/', '', sel, flags=re.S)
        return ['html[data-clone] ' + p.strip() for p in sel.split(',') if any(c in p for c in cles)]
    out = []
    for sel, corps in lire(css):
        if isinstance(corps, list):
            dedans = ['%s{%s}' % (','.join(garder(s)), b) for s, b in corps if not isinstance(b, list) and garder(s)]
            if dedans:
                out.append('%s{%s}' % (sel, ''.join(dedans)))
        elif garder(sel):
            out.append('%s{%s}' % (','.join(garder(sel)), corps))
    return '\n'.join(out)

base_css = open('scripts/clone/habillage-base.css', encoding='utf8').read()
signature = open(os.path.join(CLONE, 'efa-logo.css'), encoding='utf8').read().replace('url(', 'url(')
open(os.path.join(CLONE, 'habillage.css'), 'w', encoding='utf8').write(base_css.replace('/*SHELL*/', regles_coquille()) + '\n/* Signature efa. (clone/efa-logo.css) */\n' + signature)
import json
base_js = open('scripts/clone/habillage-base.js', encoding='utf8').read()
js = base_js.replace('/*PAGES*/[]', '[]')
js = js.replace('/*ENTETE*/""', json.dumps(entete(None), ensure_ascii=False)).replace('/*PIED*/""', json.dumps(pied, ensure_ascii=False))
js += '\n' + open('scripts/clone/cartes.js', encoding='utf8').read()
open(os.path.join(CLONE, 'habillage.js'), 'w', encoding='utf8').write(js)
shutil.copy('scripts/clone/cartes.js', os.path.join(CLONE, 'cartes.js'))
os.makedirs(os.path.join(CLONE, 'pages'), exist_ok=True)
for f in glob.glob('scripts/clone/pages/*'):
    shutil.copy(f, os.path.join(CLONE, 'pages', os.path.basename(f)))

# ---------------------------------------------------------------- retirer l'habillage précédent
def deshabiller(s):
    s = re.sub(r'<header class="header clone-head" id="clone-haut">.*?</header>\n?', '', s, flags=re.S)
    s = re.sub(r'<section class="efa-pourvous".*?</section>\n?', '', s, flags=re.S)
    s = re.sub(r'\n?<footer class="efa-foot clone-foot">.*?</footer>', '', s, flags=re.S)
    s = re.sub(r'<link rel="stylesheet" href="clone/(?:habillage|pages/[^"]+)\.css[^"]*">\n?', '', s)
    s = re.sub(r'<script src="clone/(?:habillage|pages/[^"]+)\.js[^"]*" defer></script>\n?', '', s)
    s = re.sub(r'(<html\b[^>]*?)\s+data-clone(?:-[a-z]+)?(?:="[^"]*")?', r'\1', s)
    while re.search(r'<html\b[^>]*\sdata-clone', s):
        s = re.sub(r'(<html\b[^>]*?)\s+data-clone(?:-[a-z]+)?(?:="[^"]*")?', r'\1', s)
    s = s.replace(' data-v1-cache', '').replace('data-v1-cache ', '')
    return s

# ---------------------------------------------------------------- habiller une page sur place
ICONE = '<link rel="icon" type="image/png" href="clone/assets/efa-oiseau.png">'
def icone(s):
    """Une seule icône d'onglet : l'oiseau de la signature (les autres déclarations sont retirées)."""
    s = re.sub(r'<link rel="(?:shortcut )?icon"[^>]*>\n?', '', s)
    s2 = re.sub(r'(<meta charset="?utf-8"?\s*/?>)', lambda m: m.group(1) + ICONE, s, count=1, flags=re.I)
    return s2 if ICONE in s2 else s2.replace('</head>', ICONE + '\n</head>', 1)

def habiller(s, page):
    s = deshabiller(s)
    s = icone(s)
    if '</head>' not in s:
        m = re.search(r'</style>\s*(?=<(header|div|main|section|nav)\b)', s)
        if m:
            s = s[:m.end()] + '</head>\n<body>\n' + s[m.end():]
            s = s.replace('</html>', '</body>\n</html>', 1) if '</html>' in s else s + '\n</body>\n'
    redirection = re.search(r'http-equiv="refresh"|location\.replace\(', s) is not None and len(s) < 3000
    if redirection:
        return s, 0
    attrs = ' data-clone'
    if page in VISUELS:
        attrs += ' data-clone-visuel="clone/assets/%s"' % VISUELS[page]
    coquille = re.search(r'<header class="top"', s) is not None
    if not coquille and re.search(r'<body[^>]*>\s*<header>', s) and '<footer class="efa-foot">' in s:
        s = re.sub(r'(<body[^>]*>\s*)<header>', r'\1<header class="top">', s, count=1)
        coquille = True
    if coquille:
        attrs += ' data-clone-coquille'
        s = re.sub(r'<header class="top"', '<header data-v1-cache class="top"', s, count=1)
        s = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + '\n' + entete(page), s, count=1)
        pieds = list(re.finditer(r'<footer\b[^>]*>.*?</footer>', s, re.S))
        if pieds:
            p = pieds[-1]
            ancien = re.sub(r'<footer\b', '<footer data-v1-cache', p.group(0), count=1)
            s = s[:p.start()] + ancien + '\n' + pied + s[p.end():]
        else:
            s = s.replace('</body>', pied + '\n</body>', 1)
    else:
        attrs += ' data-clone-plein'
        if '</main>' in s: s = s.replace('</main>', '</main>\n' + BANDEAU, 1)
        if re.search(r'<body\b', s):
            s = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + '\n' + entete(page), s, count=1)
        else:
            s = s.replace('</head>', '</head>\n' + entete(page), 1)
    s = re.sub(r'<html\b', '<html' + attrs, s, count=1)
    s = s.replace('</head>', '<link rel="stylesheet" href="clone/habillage.css?v=%s">\n</head>' % VERSION, 1)
    balise_js = '<script src="clone/habillage.js?v=%s" defer></script>\n' % VERSION
    nom = os.path.splitext(page)[0]
    if os.path.exists('scripts/clone/pages/%s.css' % nom):
        s = s.replace('</head>', '<link rel="stylesheet" href="clone/pages/%s.css?v=%s">\n</head>' % (nom, VERSION), 1)
    if os.path.exists('scripts/clone/pages/%s.js' % nom):
        balise_js = '<script src="clone/pages/%s.js?v=%s" defer></script>\n' % (nom, VERSION) + balise_js
    s = s.replace('</body>', balise_js + '</body>', 1) if '</body>' in s else s.replace('</html>', balise_js + '</html>', 1)
    return s, coquille

n = c = 0
for page in pages:
    s0 = open(page, encoding='utf8').read()
    s, co = habiller(s0, page)
    c += bool(co)
    if s != s0:
        open(page, 'w', encoding='utf8').write(s)
    n += 1

# ---------------------------------------------------------------- pages fabriquées à partir des modèles
v1 = open('accueil-v1.html', encoding='utf8').read() if os.path.exists('accueil-v1.html') else ''
def tete_v1():
    """Les métadonnées de l'ancien accueil (titre, description, partage, données structurées, mesure d'audience)."""
    h = v1[:v1.find('</head>')]
    garder = re.findall(r'<title>.*?</title>|<meta (?:name="description"|property="og:[^"]+"|name="twitter:[^"]+")[^>]*>'
                        r'|<link rel="(?:canonical|apple-touch-icon)"[^>]*>|<script type="application/ld\+json">.*?</script>', h, re.S)
    return '\n'.join(garder)
gc = '<script data-goatcounter="https://efa-africa.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'
for modele, (sortie, indexee) in MODELES.items():
    s = open(os.path.join(CLONE, modele), encoding='utf8').read()
    s = modele_vers_racine(s, garder_dieses=True)
    if 'efa-pourvous' not in s: s = s.replace('<footer class="efa-foot">', BANDEAU + '<footer class="efa-foot">', 1)
    if sortie == 'index.html' and v1:
        s = re.sub(r'<title>.*?</title>', '', s, flags=re.S)
        s = re.sub(r'<meta name="description"[^>]*>', '', s)
        s = s.replace('</head>', tete_v1() + '\n</head>', 1)
    if indexee:
        s = re.sub(r'<meta name="robots"[^>]*>', '', s)
        if 'rel="canonical"' not in s:
            s = s.replace('</head>', '<link rel="canonical" href="%s%s">\n</head>' % (SITE, sortie.replace('.html', '')), 1)
    if 'data-goatcounter' not in s:
        s = s.replace('</body>', gc + '\n</body>', 1)
    open(sortie, 'w', encoding='utf8').write(s)

# l'ancien accueil, gardé pour mémoire, hors index
if v1 and 'noindex' not in v1[:v1.find('</head>')]:
    v1 = v1.replace('</head>', '<meta name="robots" content="noindex, nofollow">\n</head>', 1)
    open('accueil-v1.html', 'w', encoding='utf8').write(v1)

# ---------------------------------------------------------------- anciennes adresses /clone/… → adresses du site
def renvoi(cible, profondeur):
    retour = '../' * profondeur
    return ('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex">'
            '<link rel="canonical" href="%s%s"><title>EFA</title>'
            '<script>location.replace("%s%s"+location.search+location.hash)</script>'
            '<meta http-equiv="refresh" content="0; url=%s%s"></head><body>'
            '<p><a href="%s%s">Éducation Financière Afrique</a></p></body></html>\n') % (
        SITE, cible, retour, cible, retour, cible, retour, cible)
renvois = 0
for page in pages + sorted(FABRIQUEES):
    p = os.path.join(CLONE, page)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    cible = '' if page == 'index.html' else page
    open(p, 'w', encoding='utf8').write(renvoi(cible, page.count('/') + 1))
    renvois += 1
if os.path.exists(os.path.join(CLONE, 'v1-pages.txt')):
    os.remove(os.path.join(CLONE, 'v1-pages.txt'))

print('%d pages habillées sur place (%d avec en-tête et pied), %d pages fabriquées, %d anciennes adresses /clone redirigées.'
      % (n, c, len(MODELES), renvois))
