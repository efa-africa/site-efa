#!/usr/bin/env python3
"""EFA · Filigrane « efa.africa » sur les photos et illustrations du site.

Pose, en bas à droite, l'oiseau EFA et « efa.africa » en petit, sans gêner la lecture :
une capture d'écran ou une image réutilisée garde la trace d'EFA.
Usage (racine du dépôt) : python3 scripts/filigrane.py            → toutes les images concernées
                          python3 scripts/filigrane.py fichier.webp  → une ou plusieurs images
Chaque image n'est marquée qu'une fois (liste dans scripts/filigrane-fait.json).
Exclus : logos, portraits, avatars, icônes, images de partage, couvertures de livres.
"""
import os, re, sys, json, glob, hashlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(R)
FAIT = 'scripts/filigrane-fait.json'
DOSSIERS = ['clone/assets', 'illus', 'accueil']  # ateliers/ : affiches déjà signées efa.africa
EXCLU = re.compile(r'(logo|oiseau|portrait|temoin|avatar|icon|favicon|apple-touch|og-|og_|elysee|qr|sticker|autocollant|signature|visage|profil|globe)', re.I)
POLICE = 'scripts/fonts/SourceSans3-800.ttf'
fait = json.load(open(FAIT)) if os.path.exists(FAIT) else {}
oiseau = Image.open('clone/assets/efa-oiseau.png').convert('RGBA')

def empreinte(f): return hashlib.sha1(open(f, 'rb').read()).hexdigest()

def marquer(f):
    im = Image.open(f); im = im.convert('RGBA'); im0_alpha = im.getextrema()[3][0] < 250; W, H = im.size
    h = max(16, round(min(W, H) * 0.034)); m = max(10, round(min(W, H) * 0.028))
    font = ImageFont.truetype(POLICE, round(h * .78)); txt = 'efa.africa'
    tw = ImageDraw.Draw(im).textlength(txt, font=font)
    calque = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(calque)
    x0 = W - m - h - round(h * .35) - tw; y0 = H - m - h
    # halo sombre très léger pour rester lisible sur fond clair, sans encadré
    ombre = Image.new('RGBA', im.size, (0, 0, 0, 0)); do = ImageDraw.Draw(ombre)
    do.text((x0 + h + round(h * .35), y0 + round(h * .08)), txt, font=font, fill=(7, 12, 22, 150))
    ombre = ombre.filter(ImageFilter.GaussianBlur(max(1, h // 8)))
    calque = Image.alpha_composite(calque, ombre); d = ImageDraw.Draw(calque)
    d.text((x0 + h + round(h * .35), y0 + round(h * .08)), txt, font=font, fill=(255, 255, 255, 215))
    ois = oiseau.resize((h, h), Image.LANCZOS); a = ois.split()[3].point(lambda v: int(v * .9)); ois.putalpha(a)
    calque.alpha_composite(ois, (int(x0), int(y0)))
    out = Image.alpha_composite(im, calque)
    if im0_alpha: out.save(f, 'WEBP' if f.lower().endswith('.webp') else 'PNG', **({'quality':84} if f.lower().endswith('.webp') else {'optimize':True}))
    elif f.lower().endswith('.png'): out.save(f, 'PNG', optimize=True)
    elif f.lower().endswith(('.jpg', '.jpeg')): out.convert('RGB').save(f, 'JPEG', quality=88)
    else: out.convert('RGB').save(f, 'WEBP', quality=84)
    fait[f] = empreinte(f)

cibles = sys.argv[1:] or [f for d in DOSSIERS for f in sorted(glob.glob(d + '/*')) if f.lower().endswith(('.webp', '.jpg', '.jpeg', '.png'))]
n = 0
for f in cibles:
    if EXCLU.search(os.path.basename(f)): continue
    if f in fait and fait[f] == empreinte(f): continue
    try:
        w, h = Image.open(f).size
    except Exception: continue
    if min(w, h) < 400: continue
    marquer(f); n += 1
json.dump(fait, open(FAIT, 'w'), indent=0, sort_keys=True)
print('%d image(s) marquée(s)' % n)
