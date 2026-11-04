#!/usr/bin/env python3
"""EFA · Logo « efa. » en verre dépoli, centré en bas des photos et illustrations du site.
Une capture d'écran ou une image réutilisée garde la trace d'EFA, sans gêner la lecture.
Usage (racine du dépôt) : python3 scripts/filigrane.py              → toutes les images concernées
                          python3 scripts/filigrane.py fichier.webp  → une ou plusieurs images
Chaque image n'est marquée qu'une fois (liste dans scripts/filigrane-fait.json).
Exclus : logos, portraits, avatars, icônes, globe, affiches d'ateliers (déjà signées), images de partage, livres.
"""
import os, re, sys, json, glob, hashlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageStat
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(R)
FAIT = 'scripts/filigrane-fait.json'
DOSSIERS = ['clone/assets', 'illus', 'accueil']
EXCLU = re.compile(r'(logo|oiseau|efa-mark|portrait|temoin|avatar|icon|favicon|apple-touch|og-|og_|^ely\.|^por-|qr|sticker|autocollant|signature|visage|profil|globe)', re.I)
LB = 'scripts/fonts/LibreBaskerville-700.ttf'
fait = json.load(open(FAIT)) if os.path.exists(FAIT) else {}
_o = Image.open('clone/assets/efa-oiseau.png').convert('RGBA')
BLANC = (255, 255, 255)

def empreinte(f): return hashlib.sha1(open(f, 'rb').read()).hexdigest()

def oiseau_blanc(h):
    o = _o.resize((h, h), Image.LANCZOS); r, g, b, a = o.split()
    clair = ImageChops.darker(ImageChops.darker(r, g), b).point(lambda v: 255 if v > 170 else 0)
    return ImageChops.multiply(clair, a).point(lambda v: int(v * .55))

def glace(im):
    W, H = im.size; h = int(min(H * .17, W * .11))
    font = ImageFont.truetype(LB, int(h * 1.18))
    bx = ImageDraw.Draw(im).textbbox((0, 0), 'efa', font=font); tw = bx[2] - bx[0]
    pw = int(h * .2); gap = int(h * .28); x0 = (W - (h + gap + tw + pw)) // 2; y0 = H - int(H * .045) - h
    def masque(dessin):
        m = Image.new('L', im.size, 0); dessin(ImageDraw.Draw(m)); return m
    def liseré(m): return ImageChops.subtract(m.filter(ImageFilter.MaxFilter(3)), m.filter(ImageFilter.MinFilter(3)))
    flou = im.filter(ImageFilter.GaussianBlur(max(5, W // 110)))
    zone = im.crop((max(0, x0), y0, min(W, x0 + h + gap + tw + pw), y0 + h)).convert('L')
    clair = ImageStat.Stat(zone).mean[0] > 150   # fond clair : verre teinté nuit
    TEINTE = (11, 18, 32) if clair else BLANC
    m = masque(lambda d: d.text((x0 + h + gap - bx[0], y0 + h - bx[3] + int(h * .02)), 'efa', font=font, fill=255))
    out = Image.composite(Image.blend(flou, Image.new('RGB', im.size, TEINTE), .30 if not clair else .22), im, m.point(lambda v: int(v * .50)))
    out = Image.composite(Image.new('RGB', im.size, TEINTE), out, liseré(m).point(lambda v: int(v * (.28 if not clair else .22))))
    c = masque(lambda d: d.ellipse((x0, y0, x0 + h, y0 + h), fill=255))
    out = Image.composite(Image.blend(flou, Image.new('RGB', im.size, (33, 100, 190)), .55), out, c.point(lambda v: int(v * .42)))
    out = Image.composite(Image.new('RGB', im.size, BLANC), out, liseré(c).point(lambda v: int(v * .25)))
    out.paste(Image.new('RGB', (h, h), BLANC), (x0, y0), oiseau_blanc(h))
    r = int(pw * .42); cx = x0 + h + gap + tw + pw // 2 + int(h * .02); cy = y0 + h - r - int(h * .03)
    p = masque(lambda d: d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255))
    return Image.composite(Image.new('RGB', im.size, (228, 72, 40)), out, p.point(lambda v: int(v * .55)))

def marquer(f):
    src = Image.open(f); rgba = src.convert('RGBA'); alpha = rgba.split()[3]
    out = glace(rgba.convert('RGB'))
    if alpha.getextrema()[0] < 250: out = out.convert('RGBA'); out.putalpha(alpha)
    low = f.lower()
    if low.endswith('.png'): out.save(f, 'PNG', optimize=True)
    elif low.endswith(('.jpg', '.jpeg')): out.convert('RGB').save(f, 'JPEG', quality=88)
    else: out.save(f, 'WEBP', quality=86)
    fait[f] = empreinte(f)

if __name__ == '__main__':
    cibles = sys.argv[1:] or [f for d in DOSSIERS for f in sorted(glob.glob(d + '/*')) if f.lower().endswith(('.webp', '.jpg', '.jpeg', '.png'))]
    n = 0
    for f in cibles:
        if EXCLU.search(os.path.basename(f)): continue
        if f in fait and fait[f] == empreinte(f): continue
        try: w, h = Image.open(f).size
        except Exception: continue
        if min(w, h) < 400: continue
        marquer(f); n += 1
    json.dump(fait, open(FAIT, 'w'), indent=0, sort_keys=True)
    print('%d image(s) marquée(s)' % n)
