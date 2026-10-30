#!/usr/bin/env python3
"""EFA · Clone : recopie les pages de la V1 dans /clone avec l'en-tête, le pied et l'habillage du Clone.

Usage (depuis la racine du dépôt) :  python3 scripts/clone/habiller.py

- Source unique : les pages de la V1 à la racine (et news/). Elles ne sont pas modifiées.
- Les copies de /clone sont régénérées à chaque passage : ne pas les éditer à la main.
- Chaque copie reçoit <base> vers la racine (scripts, images et données de la V1 fonctionnent tels quels),
  noindex, l'en-tête et le pied du Clone, clone/habillage.css et clone/habillage.js.
- Les liens des pages du Clone (accueil, coaching…) qui visaient ../page.html visent désormais la copie.
"""
import os, re, sys, glob, html as H

RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(RACINE)
CLONE = 'clone'
VERSION = '20261030i'
# Lot 4 : visuel du bandeau d'ouverture des pages clés (photos du Clone)
VISUELS = {
    'tontine.html': 'etudes-terrain.webp', 'epargner.html': 'q2.webp', 'outils.html': 'q1.webp',
    'news.html': 'carte-proches-900.webp', 'parcours.html': 'benefice-collectif.webp',
    'preparer-ma-retraite.html': 'coach-patrimoine.webp', 'construire-son-budget.html': 'budget.webp',
    'methode.html': 'etudes-publiees.webp', 'auteur.html': 'elysee-portrait.jpg',
}
MANIFESTE = os.path.join(CLONE, 'v1-pages.txt')
PAGES_CLONE = ['index.html', 'coaching.html', 'marches.html', 'etudes-prospective.html', 'v0.html']
EXCLUES = {'index.html'}  # l'accueil V1 est remplacé par l'accueil du Clone

# ---------------------------------------------------------------- pages à recopier
sources = sorted(f for f in glob.glob('*.html') if f not in EXCLUES)
sources += sorted(glob.glob('news/*.html'))
conflits = [f for f in sources if f in PAGES_CLONE]
if conflits:
    sys.exit('Conflit de nom avec une page du Clone : %s' % conflits)
connues = set(sources)

# ---------------------------------------------------------------- nettoyage de la génération précédente
if os.path.exists(MANIFESTE):
    for ligne in open(MANIFESTE, encoding='utf8'):
        p = os.path.join(CLONE, ligne.strip())
        if ligne.strip() and os.path.isfile(p) and ligne.strip() not in PAGES_CLONE:
            os.remove(p)

# ---------------------------------------------------------------- rubrique de chaque page (pour l'onglet actif)
accueil = open(os.path.join(CLONE, 'index.html'), encoding='utf8').read()
RUBRIQUES = [('benefices', 'Apprendre'), ('pilier-progresser', 'S’entraîner'), ('pilier-agir', 'Se lancer'),
             ('pilier-media', 'Le média'), ('etudes-prospective', 'Études')]
SECTION_DE = {'portes': 'benefices', 'benefices': 'benefices', 'calculateur': 'benefices',
              'pilier-progresser': 'pilier-progresser', 'pilier-agir': 'pilier-agir',
              'pilier-media': 'pilier-media', 'etudes-prospective': 'etudes-prospective'}
rubrique = {}
blocs = list(re.finditer(r'<section[^>]*\bid="([^"]+)"', accueil))
for k, m in enumerate(blocs):
    fin = blocs[k + 1].start() if k + 1 < len(blocs) else len(accueil)
    sec = SECTION_DE.get(m.group(1))
    if not sec:
        continue
    for h in re.findall(r'href="(?:\.\./)?([^"#?:]+)', accueil[m.start():fin]):
        if h in connues:
            rubrique.setdefault(h, sec)
for f in sources:
    if f.startswith('news/'):
        rubrique.setdefault(f, 'pilier-media')

# ---------------------------------------------------------------- en-tête et pied du Clone, adaptés à <base> = racine
def lien_depuis_clone(h):
    """Lien écrit dans une page de /clone (relatif à clone/) → lien relatif à la racine du site."""
    if re.match(r'^(https?:|mailto:|tel:)', h):
        return h
    if h.startswith('#'):
        return 'clone/index.html' + h
    if h.startswith('./'):
        return 'clone/' + h[2:]
    if h.startswith('../'):
        cible = h[3:]
        chemin = re.split(r'[#?]', cible)[0]
        return ('clone/' + cible) if chemin in connues else cible
    return 'clone/' + h

menu = re.search(r'<nav id="menu" class="menu-panel"[^>]*>(.*?)</nav>', accueil, re.S).group(1)
menu = re.sub(r'href="([^"]+)"', lambda m: 'href="%s"' % lien_depuis_clone(m.group(1)), menu)

def entete(page):
    actif = rubrique.get(page)
    onglets = ''.join(
        '<a href="clone/index.html#%s"%s>%s</a>' % (i, ' aria-current="page"' if i == actif else '', t)
        for i, t in RUBRIQUES)
    return ('<header class="header clone-head" id="clone-haut"><div class="container head-inner">'
            '<a class="brand" href="clone/index.html" aria-label="EFA, accueil du Clone">'
            '<img src="clone/assets/efa-mark.png" alt=""><span>EFA<span class="brand-dot">.</span>'
            '<small>ÉDUCATION FINANCIÈRE AFRIQUE</small></span></a>'
            '<nav class="desktop-nav" aria-label="Navigation principale">%s</nav>'
            '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="clone-menu" '
            'aria-label="Ouvrir le menu"><span></span><span></span></button></div>'
            '<nav id="clone-menu" class="menu-panel" aria-label="Menu">%s</nav></header>') % (onglets, menu)

pied = re.search(r'<footer class="efa-foot">.*?</footer>', accueil, re.S).group(0)
pied = pied.replace('<footer class="efa-foot">', '<footer class="efa-foot clone-foot">', 1)
pied = re.sub(r'href="([^"]+)"', lambda m: 'href="%s"' % lien_depuis_clone(m.group(1)), pied)
pied = re.sub(r'src="\.\./', 'src="', pied)

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
            dedans = ['%s{%s}' % (','.join(garder(s)), b) for s, b in corps
                      if not isinstance(b, list) and garder(s)]
            if dedans:
                out.append('%s{%s}' % (sel, ''.join(dedans)))
        elif garder(sel):
            out.append('%s{%s}' % (','.join(garder(sel)), corps))
    return '\n'.join(out)

base_css = open('scripts/clone/habillage-base.css', encoding='utf8').read()
open(os.path.join(CLONE, 'habillage.css'), 'w', encoding='utf8').write(
    base_css.replace('/*SHELL*/', regles_coquille()))
base_js = open('scripts/clone/habillage-base.js', encoding='utf8').read()
liste = '[' + ','.join('"%s"' % p for p in sorted(connues)) + ']'
open(os.path.join(CLONE, 'habillage.js'), 'w', encoding='utf8').write(base_js.replace('/*PAGES*/[]', liste))

# ---------------------------------------------------------------- transformation d'une page
def habiller(s, page):
    if '</head>' not in s:
        # balises implicites (ex. ely.html) : on les écrit pour pouvoir insérer l'habillage
        m = re.search(r'</style>\s*(?=<(header|div|main|section|nav)\b)', s)
        if m:
            s = s[:m.end()] + '</head>\n<body>\n' + s[m.end():]
            s = s.replace('</html>', '</body>\n</html>', 1) if '</html>' in s else s + '\n</body>\n'
    profondeur = page.count('/')
    base = '../' * (profondeur + 1)
    s = re.sub(r'<base\b[^>]*>\s*', '', s)
    s = re.sub(r'<head([^>]*)>', lambda m: '<head%s>\n<base href="%s">' % (m.group(1), base), s, count=1)
    s = re.sub(r'<html\b', '<html data-clone', s, count=1)
    if page in VISUELS:
        s = s.replace('<html data-clone', '<html data-clone data-clone-visuel="clone/assets/%s"' % VISUELS[page], 1)
    # pas de comptage d'audience sur les copies de travail
    s = re.sub(r'<script[^>]*data-goatcounter[^>]*>\s*</script>\s*', '', s)
    if re.search(r'<meta[^>]+name="robots"', s):
        s = re.sub(r'(<meta[^>]+name="robots"[^>]+content=")[^"]*"', r'\1noindex, nofollow"', s)
    else:
        s = s.replace('</head>', '<meta name="robots" content="noindex, nofollow">\n</head>', 1)
    s = s.replace('</head>', '<link rel="stylesheet" href="clone/habillage.css?v=%s">\n</head>' % VERSION, 1)
    coquille = re.search(r'<header class="top"', s) is not None
    if not coquille and re.search(r'<body[^>]*>\s*<header>', s) and '<footer class="efa-foot">' in s:
        # page simple (confidentialité) : son en-tête devient la coquille du Clone
        s = re.sub(r'(<body[^>]*>\s*)<header>', r'\1<header class="top">', s, count=1)
        coquille = True
    redirection = re.search(r'http-equiv="refresh"|location\.replace\(', s) is not None and len(s) < 3000
    if not coquille and not redirection:
        # pages plein écran (parcours, démo, appli Ely…) : en-tête du Clone, sans pied
        s = s.replace('<html data-clone', '<html data-clone data-clone-plein', 1)
        if re.search(r'<body\b', s):
            s = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + '\n' + entete(page), s, count=1)
        else:
            s = s.replace('</head>', '</head>\n' + entete(page), 1)
    if coquille:
        s = re.sub(r'<header class="top"', '<header data-v1-cache class="top"', s, count=1)
        s = s.replace('<html data-clone', '<html data-clone data-clone-coquille', 1)
        s = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + '\n' + entete(page), s, count=1)
        pieds = list(re.finditer(r'<footer\b[^>]*>.*?</footer>', s, re.S))
        if pieds:
            p = pieds[-1]
            ancien = re.sub(r'<footer\b', '<footer data-v1-cache', p.group(0), count=1)
            s = s[:p.start()] + ancien + '\n' + pied + s[p.end():]
        else:
            s = s.replace('</body>', pied + '\n</body>', 1)
    balise_js = '<script src="clone/habillage.js?v=%s" defer></script>\n' % VERSION
    if '</body>' in s:
        s = s.replace('</body>', balise_js + '</body>', 1)
    else:
        s = s.replace('</html>', balise_js + '</html>', 1)
    # pages de redirection : rester dans /clone
    def redir(m):
        cible = m.group(2)
        return m.group(1) + ('clone/' + cible if re.split(r'[#?]', cible)[0] in connues else cible)
    s = re.sub(r'(http-equiv="refresh" content="\d+;\s*url=)([^"]+)', redir, s)
    s = re.sub(r"(location\.replace\(')([^']+)", redir, s)
    return s, coquille

ecrites, avec_coquille = [], 0
for page in sources:
    s = open(page, encoding='utf8').read()
    s, c = habiller(s, page)
    avec_coquille += c
    cible = os.path.join(CLONE, page)
    os.makedirs(os.path.dirname(cible), exist_ok=True)
    open(cible, 'w', encoding='utf8').write(s)
    ecrites.append(page)
open(MANIFESTE, 'w', encoding='utf8').write('\n'.join(ecrites) + '\n')

# ---------------------------------------------------------------- les pages du Clone pointent vers les copies
def vers_copie(m):
    cible = m.group(1)
    chemin = re.split(r'[#?]', cible)[0]
    return 'href="%s"' % cible if chemin in connues else m.group(0)
for p in PAGES_CLONE:
    f = os.path.join(CLONE, p)
    if os.path.exists(f):
        s = open(f, encoding='utf8').read()
        n = re.sub(r'href="\.\./([^"]+)"', vers_copie, s)
        # liens écrits dans les données des bandeaux défilants : "h": "../page.html"
        n = re.sub(r'"h": "\.\./([^"]+)"',
                   lambda m: '"h": "%s"' % m.group(1) if re.split(r'[#?]', m.group(1))[0] in connues else m.group(0), n)
        if n != s:
            open(f, 'w', encoding='utf8').write(n)

print('%d pages recopiées dans /%s, dont %d avec l’en-tête et le pied du Clone.' % (len(ecrites), CLONE, avec_coquille))
