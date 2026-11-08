# -*- coding: utf-8 -*-
"""
EFA · Feed de la semaine — kit de production
  python3 feed.py briefs [AAAA-MM-JJ]   → texte des images à générer pour la semaine du lundi donné (défaut : lundi de la semaine prochaine)
  python3 feed.py build  [AAAA-MM-JJ]   → dossier + zip du feed de la semaine (affiches, carrousels, 9:16, plan et textes)
Dépend : Playwright (Chromium), Pillow, numpy, opencv (cv2), scipy.
Les images générées par Élysée sont lues dans entrants/<lundi>/ (voir briefs). Sans image : affiche typographique de repli.
"""
import os, sys, json, re, shutil, datetime as dt, zipfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(ROOT)
CAL = json.load(open(os.path.join(ROOT, "calendrier.json"), encoding="utf-8"))
FONTS = os.path.join(ROOT, "fonts")
PORTRAIT = os.path.join(SITE, "clone", "assets", "elysee-portrait.jpg")
OISEAU = os.path.join(SITE, "clone", "assets", "efa-oiseau.png")

W, H = 1080, 1350
NUIT, BG, CY, RED, BLEUC, PAN = "#0B1220", "#071a33", "#4FC3F7", "#E5462E", "#F1F7FA", "#0f2a48"
JOURS = {"lun": "Lundi", "mar": "Mardi", "mer": "Mercredi", "jeu": "Jeudi", "ven": "Vendredi", "sam": "Samedi", "dim": "Dimanche"}
OFF = {"lun": 0, "mar": 1, "mer": 2, "jeu": 3, "ven": 4, "sam": 5, "dim": 6}
HEURE = {"lun": "12 h 30", "mar": "12 h 30", "mer": "19 h 00", "jeu": "12 h 30", "ven": "12 h 30", "sam": "10 h 00", "dim": "20 h 00"}

CSS = f"""
@font-face{{font-family:A;src:url('file://{FONTS}/Anton.ttf')}}
@font-face{{font-family:SS;src:url('file://{FONTS}/SourceSans3.ttf');font-weight:200 900}}
@font-face{{font-family:SS;src:url('file://{FONTS}/SourceSans3-Italic.ttf');font-weight:200 900;font-style:italic}}
@font-face{{font-family:LB;src:url('file://{FONTS}/LibreBaskerville.ttf');font-weight:400 700}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{W}px;height:{H}px;overflow:hidden;background:{BG}}}
body{{font-family:SS,sans-serif;-webkit-font-smoothing:antialiased}}
.abs{{position:absolute}}
.cle{{font-weight:800;font-size:40px;color:{CY};line-height:1;white-space:nowrap}}
.titre{{font-family:A;line-height:1.2;color:#fff;letter-spacing:.005em;text-transform:uppercase;text-shadow:0 2px 6px rgba(0,0,0,.35)}}
.sous{{font-weight:700;font-size:44px;line-height:1.15;color:#fff;letter-spacing:-.01em;width:520px}}
.sig{{font-style:italic;font-size:38px;color:#fff}}
.trait{{position:absolute;left:589px;top:650px;width:415px;height:22px;background:#19C3F0;border-radius:11px 4px 11px 4px;transform:rotate(-1.5deg)}}
.logo{{position:absolute;left:770px;top:1176px;display:flex;align-items:center;gap:18px;white-space:nowrap}}
.logo img{{width:112px;height:112px}}
.logo i{{display:block;width:2px;height:70px;background:rgba(255,255,255,.4)}}
.logo b{{font-family:LB;font-weight:700;font-size:84px;color:#fff;line-height:.85;letter-spacing:-.04em;white-space:nowrap}}
.logo b u{{display:inline-block;width:16px;height:16px;border-radius:50%;background:{RED};margin-left:4px;text-decoration:none}}
.logo small{{display:block;font-weight:800;font-size:26px;color:#fff;margin-top:10px}}
.marque{{font-family:LB;font-weight:700;letter-spacing:-.045em;line-height:.95}}
.marque u{{text-decoration:none;color:{RED}}}
.carte{{background:#fff;border-radius:18px}}
"""

def typo_fr(s):
    for a, b in ((" ?", " ?"), (" :", " :"), (" !", " !"), ("« ", "« "), (" »", " »")):
        s = s.replace(a, b)
    return re.sub(r"(?<=[A-Za-zÀ-ÿ])'(?=[A-Za-zÀ-ÿ])", "’", s)

def logo_html():
    return f'<div class="logo"><img src="file://{OISEAU}"><i></i><div><b>efa<u></u></b><small>efa.africa</small></div></div>'

def page(body, extra=""):
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}{extra}</style></head><body>{typo_fr(body)}</body></html>"

_TMP = os.path.join(ROOT, "sortie", "_page.html")
def show(pg, html):
    os.makedirs(os.path.dirname(_TMP), exist_ok=True); open(_TMP, "w", encoding="utf-8").write(html)
    pg.goto("file://" + _TMP); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(60)

def fit_title(pg, html_fn, maxw, maxh, start=96, floor=60):
    fs = start
    while True:
        show(pg, html_fn(fs))
        box = pg.locator("#t").bounding_box()
        if (box["width"] <= maxw and box["height"] <= maxh) or fs <= floor:
            return fs
        fs -= 4

# ------------------------------------------------------------------ gabarits
def g_portrait(pg, p):
    """Fond bleu nuit, portrait officiel à gauche, texte à droite (série « portrait »)."""
    pw, ph = 667, 1000
    base = f"""<div class="abs" style="inset:0;background:radial-gradient(ellipse 900px 1100px at 20% 35%,#0c2a52 0,{BG} 60%)"></div>
<div class="abs" style="left:-138px;top:31px;width:{pw}px;height:{ph}px;overflow:hidden"><img src="file://{PORTRAIT}" style="width:{pw}px;height:{ph}px;display:block"></div>
<div class="abs" style="left:520px;top:0;width:260px;height:{H}px;background:linear-gradient(to right,{BG}00,{BG} 80%)"></div>
<div class="abs" style="left:0;right:0;bottom:0;height:120px;background:linear-gradient(to bottom,{BG}00,{BG})"></div>
<div class="trait"></div>{logo_html()}
<div class="abs sig" style="left:768px;top:1053px">Élysée Johnson</div>"""
    def html(fs):
        return page(base + f"""<div id="t" class="abs" style="left:548px;top:0;width:548px"><div class="cle">{p['cle']}</div>
<div class="titre" style="font-size:{fs}px;margin-top:10px">{p['titre']}</div></div>""")
    fs = fit_title(pg, html, 548, 445)
    show(pg, html(fs))
    th = pg.locator("#t").bounding_box()["height"]
    body = base + f"""<div class="abs" style="left:548px;top:{628-th:.0f}px;width:548px"><div class="cle">{p['cle']}</div>
<div class="titre" style="font-size:{fs}px;margin-top:10px">{p['titre']}</div></div>
<div class="abs sous" style="left:548px;top:716px">{p['secondaire']}</div>"""
    show(pg, page(body))

def g_typo(pg, p):
    """Famille de marques : fond bleu clair, mot-marque en Libre Baskerville + point rouge, titre, texte."""
    mot = p["cle"]
    body = f"""<div class="abs" style="inset:0;background:{BLEUC}"></div>
<div class="abs" style="left:80px;top:150px"><div class="marque" style="font-size:150px;color:{NUIT}">{mot}<u>.</u></div></div>
<div class="abs" style="left:80px;top:400px;width:920px;font-family:LB;font-weight:700;font-size:88px;line-height:1.12;color:{NUIT};letter-spacing:-.01em;text-wrap:balance">{p['titre']}</div>
<div id="s" class="abs" style="left:80px;top:{{top}}px;width:900px;font-weight:600;font-size:46px;line-height:1.35;color:#2A3142">{p['secondaire']}</div>
<div class="abs" style="left:80px;top:1130px;display:flex;align-items:center;gap:16px">
<img src="file://{OISEAU}" style="width:72px;height:72px"><span style="font-family:LB;font-weight:700;font-size:60px;color:{NUIT};letter-spacing:-.04em;line-height:1">efa<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:{RED};margin-left:3px"></span></span>
<span style="margin-left:auto;font-weight:800;font-size:28px;color:{NUIT}">efa.africa</span></div>
<div class="abs" style="left:800px;top:1130px;width:200px;text-align:right;font-weight:800;font-size:28px;color:{NUIT};line-height:72px">efa.africa</div>"""
    show(pg, page(body.replace("{top}", "0").replace('<span style="margin-left:auto;font-weight:800;font-size:28px;color:' + NUIT + '">efa.africa</span>', "")))
    # mesurer la hauteur du titre pour poser le texte secondaire dessous
    h = pg.evaluate("(()=>{const d=[...document.querySelectorAll('div')].find(x=>x.style.top==='400px');return d.getBoundingClientRect().height})()")
    show(pg, page(body.replace("{top}", str(int(400 + h + 40))).replace('<span style="margin-left:auto;font-weight:800;font-size:28px;color:' + NUIT + '">efa.africa</span>', "")))

def g_scene(pg, p, img):
    """Image générée (personnage) en plein fond, texte à droite sur voile bleu nuit."""
    body = f"""<div class="abs" style="inset:0;background:url('file://{img}') 30% 50%/cover"></div>
<div class="abs" style="left:420px;top:0;width:660px;height:{H}px;background:linear-gradient(to right,{BG}00,{BG}e6 300px,{BG} 520px)"></div>
<div class="abs" style="left:0;right:0;bottom:0;height:160px;background:linear-gradient(to bottom,{BG}00,{BG})"></div>
<div class="trait"></div>{logo_html()}"""
    def html(fs):
        return page(body + f"""<div id="t" class="abs" style="left:548px;top:0;width:548px"><div class="cle">{p['cle']}</div>
<div class="titre" style="font-size:{fs}px;margin-top:10px">{p['titre']}</div></div>""")
    fs = fit_title(pg, html, 548, 445)
    show(pg, html(fs))
    th = pg.locator("#t").bounding_box()["height"]
    show(pg, page(body + f"""<div class="abs" style="left:548px;top:{628-th:.0f}px;width:548px"><div class="cle">{p['cle']}</div>
<div class="titre" style="font-size:{fs}px;margin-top:10px">{p['titre']}</div></div>
<div class="abs sous" style="left:548px;top:716px">{p['secondaire']}</div>"""))

def g_planche(pg, img, texte, i, n, couverture=False, titre=""):
    """Planche de carrousel : image en haut, carte blanche de texte en bas, compteur et logo."""
    haut = f"""<div class="abs" style="inset:0;background:{BLEUC}"></div>
<div class="abs" style="left:0;top:0;width:{W}px;height:860px;background:url('file://{img}') 50% 30%/cover"></div>
<div class="abs" style="left:0;top:700px;width:{W}px;height:160px;background:linear-gradient(to bottom,{BLEUC}00,{BLEUC})"></div>"""
    if couverture:
        txt = f"""<div class="abs" style="left:80px;top:860px;width:920px"><div style="font-weight:800;font-size:22px;letter-spacing:.22em;text-transform:uppercase;color:#B8341A">EFA Déclic · une piste à tester</div>
<div style="font-family:LB;font-weight:700;font-size:64px;line-height:1.12;color:{NUIT};margin-top:14px;text-wrap:balance">{titre}</div></div>"""
    else:
        txt = f"""<div class="abs carte" style="left:80px;top:880px;width:920px;padding:36px 40px;font-weight:600;font-size:40px;line-height:1.35;color:#2A3142">{texte}</div>"""
    pied = f"""<div class="abs" style="left:80px;top:1250px;display:flex;align-items:center;gap:14px"><img src="file://{OISEAU}" style="width:52px;height:52px"><span style="font-family:LB;font-weight:700;font-size:42px;color:{NUIT};letter-spacing:-.04em">efa<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:{RED};margin-left:2px"></span></span></div>
<div class="abs" style="right:80px;top:1262px;font-weight:800;font-size:26px;color:#5F6676">{i}/{n}</div>"""
    show(pg, page(haut + txt + pied))

# ------------------------------------------------------------------ traitements
def peau(src, dst):
    """Peau réaliste (spécification du 7 nov. 2026) : masque chair YCrCb, médian 5, bilatéral ×2, 28 % de détail, grain fin."""
    import cv2
    im = cv2.imread(src)
    if im is None: shutil.copy(src, dst); return
    ycc = cv2.cvtColor(im, cv2.COLOR_BGR2YCrCb).astype(int); Y, Cr, Cb = ycc[..., 0], ycc[..., 1], ycc[..., 2]
    m = ((((Cr > 137) & (Cb < 125)) | ((Cr > 132) & (Cb < 128) & (Y > 45))) & (Cr < 185) & (Cb > 80) & (Y > 28) & (Y < 215)).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)); m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    m = cv2.GaussianBlur(m, (0, 0), 6).astype(np.float32)[..., None] / 255
    f = im.astype(np.float32); s = cv2.medianBlur(im, 5)
    for _ in range(2): s = cv2.bilateralFilter(s, 9, 24, 5)
    s = s.astype(np.float32); out = s + 0.28 * (f - s) + np.random.default_rng(1).normal(0, 2.4, f.shape[:2]).astype(np.float32)[..., None]
    cv2.imwrite(dst, np.clip(f * (1 - m) + out * m, 0, 255).astype(np.uint8))

def tiktok(src, dst):
    im = Image.open(src).convert("RGB"); bg = im.resize((1080, 1920)).filter(ImageFilter.GaussianBlur(40))
    im = im.resize((1080, int(1080 * im.height / im.width))); bg.paste(im, (0, (1920 - im.height) // 2)); bg.save(dst)

# ------------------------------------------------------------------ semaine
def lundi_cible(arg):
    if arg: return arg
    d = dt.date.today(); return (d + dt.timedelta(days=(7 - d.weekday()) % 7 or 7)).isoformat()

def semaine(lundi):
    for s in CAL["semaines"]:
        if s["lundi"] == lundi: return s
    sys.exit(f"Pas de semaine {lundi} dans calendrier.json")

def datefr(lundi, jour):
    d = dt.date.fromisoformat(lundi) + dt.timedelta(days=OFF[jour])
    return f"{JOURS[jour]} {d.day} {['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'][d.month-1]}"

def slug(s): return re.sub(r"[^a-z0-9]+", "-", s.lower().replace("é", "e").replace("è", "e").replace("ê", "e").replace("à", "a").replace("ô", "o").replace("’", "").replace("'", "")).strip("-")

def briefs(lundi):
    s = semaine(lundi); V = CAL["visages"]; out = [f"EFA · IMAGES À GÉNÉRER POUR LA SEMAINE DU {lundi} — « {s['campagne']} »", "",
        "Consigne commune : " + CAL["consignes_images"], "",
        f"Déposer les fichiers dans le dépôt GitHub efa-africa/site-efa, dossier outils-feed/entrants/{lundi}/ (PNG ou JPG, 1080 × 1350 ou plus). Noms exacts ci-dessous.", ""]
    n = 0
    for p in s["posts"]:
        if p["type"] == "carrousel":
            out += [f"CARROUSEL DU {datefr(lundi, p['jour']).upper()} · « {p['titre']} » · personnage : {p['visage']}", "  " + V[p["visage"]]]
            for i, sc in enumerate(p["planches"], 1):
                n += 1; out.append(f"  {p['jour']}-carrousel-{i:02d}.jpg  →  {sc}")
            out.append("")
        elif p["type"] == "scene":
            n += 1; out += [f"AFFICHE DU {datefr(lundi, p['jour']).upper()} · personnage : {p['visage']}", "  " + V[p["visage"]], f"  {p['jour']}-scene.jpg  →  {p['scene']}", ""]
    out += [f"Total : {n} images. Les affiches portrait et typographiques sont produites automatiquement, sans image à fournir.",
            "Si une image manque le dimanche matin, l'affiche est produite en version typographique et signalée."]
    return "\n".join(out)

def build(lundi):
    from playwright.sync_api import sync_playwright
    s = semaine(lundi); L = CAL["regles"]["liens"]; ENT = os.path.join(ROOT, "entrants", lundi)
    if not s["posts"]:
        print("SEMAINE DÉJÀ PRODUITE : " + s.get("note", "rien à produire")); return
    O = os.path.join(ROOT, "sortie", f"EFA-Feed-{lundi}"); shutil.rmtree(O, ignore_errors=True); os.makedirs(O)
    plan = [f"EFA — FEED DE LA SEMAINE DU {lundi}", f"Campagne : « {s['campagne']} »", s["message"], "",
            "OBJECTIFS DE FIN DE SEMAINE : " + " · ".join(f"{k} {v:,}".replace(",", " ") for k, v in s["objectifs"].items()), "",
            "RÈGLES : Facebook sans lien dans le texte (lien en premier commentaire) · TikTok : « efa.africa » en clair · une publication par créneau.", ""]
    manques = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": H})
        for k, p in enumerate(s["posts"], 1):
            d = os.path.join(O, f"{OFF[p['jour']]+1}-{p['jour']}-P{k:02d}-{slug(p.get('titre',''))[:40]}"); os.makedirs(d)
            lien = L[p["lien"]] + f"?src=feed-{lundi}"
            if p["type"] == "carrousel":
                n = len(p["planches"]) + 1
                for i in range(n):
                    src = os.path.join(ENT, f"{p['jour']}-carrousel-{max(i,1):02d}.jpg")
                    if not os.path.exists(src): src = src.replace(".jpg", ".png")
                    if not os.path.exists(src): manques.append(os.path.basename(src)); continue
                    tmp = os.path.join(d, "_peau.jpg"); peau(src, tmp)
                    g_planche(pg, tmp, "" if i == 0 else p["textes"][i-1], i+1, n, couverture=(i == 0), titre=p["titre"])
                    pg.screenshot(path=os.path.join(d, f"{i+1:02d}.png"))
                if os.path.exists(os.path.join(d, "_peau.jpg")): os.remove(os.path.join(d, "_peau.jpg"))
                texte = f"{p['titre']}.\n" + "\n".join(p["textes"]) + "\n\nDes idées, pas des gains promis. C'est pensé pour nous."
            else:
                if p["type"] == "portrait": g_portrait(pg, p)
                elif p["type"] == "scene":
                    src = os.path.join(ENT, f"{p['jour']}-scene.jpg")
                    if not os.path.exists(src): src = src.replace(".jpg", ".png")
                    if os.path.exists(src):
                        tmp = os.path.join(d, "_peau.jpg"); peau(src, tmp); g_scene(pg, p, tmp)
                    else:
                        manques.append(f"{p['jour']}-scene.jpg"); g_typo(pg, p)
                else: g_typo(pg, p)
                f = os.path.join(d, f"EFA-{slug(p['cle'])}-{slug(p['titre'])[:40]}.png"); pg.screenshot(path=f)
                if os.path.exists(os.path.join(d, "_peau.jpg")): os.remove(os.path.join(d, "_peau.jpg"))
                tiktok(f, f.replace(".png", "-1080x1920.png"))
                texte = f"{p['titre']}\n{p['secondaire']}\nGratuit, sans compte, dès 1 min. C'est pensé pour nous."
            plan += ["=" * 70, f"{datefr(lundi, p['jour']).upper()} · {HEURE[p['jour']]} · {p['type'].upper()} · {p['cle'] if 'cle' in p else p['visage']}", f"Dossier : {os.path.basename(d)}", "",
                     "Texte (sans lien) :", texte, "Le lien est en commentaire 👇", "", "Premier commentaire :", f"👉 {lien}", "",
                     "Légende TikTok :", texte.split("\n")[0] + " Sur efa.africa, gratuit. #EFA #educationfinanciere #afrique", ""]
        b.close()
    plan += ["=" * 70, "RENDEZ-VOUS FIXES : newsletter mardi 7 h (test unique sur l'adresse d'Élysée, puis validation) · EFA Community jeudi 19 h · EFA News dimanche 18 h.", ""]
    if manques: plan += ["IMAGES MANQUANTES (affiche typographique utilisée à la place) : " + ", ".join(manques)]
    open(os.path.join(O, "00-PLAN-DE-LA-SEMAINE.txt"), "w", encoding="utf-8").write(typo_fr("\n".join(plan)))
    z = O + ".zip"
    with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
        for r, _, fs in os.walk(O):
            for f in fs: zf.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), os.path.dirname(O)))
    print(z); print("manques:", manques)

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "briefs"; lundi = lundi_cible(sys.argv[2] if len(sys.argv) > 2 else None)
    print(briefs(lundi)) if cmd == "briefs" else build(lundi)
