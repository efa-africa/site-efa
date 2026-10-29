# -*- coding: utf-8 -*-
# EFA News V1 · générateur : news.html (accueil éditorial), news/<id>.html (une page par article),
# news/news-data.json (données publiées), entrées du sitemap.
# Usage : python3 build_news.py <dossier du site> [date du jour AAAA-MM-JJ]
import sys, os, re, json, html, unicodedata, datetime
SITE = sys.argv[1]
# Source unique : news/news-data.json (tous les articles, quel que soit leur statut)
_SRC = json.load(open(os.path.join(SITE, "news", "news-data.json"), encoding="utf-8"))
CATEGORIES = list(_SRC["categories"].items())
ARTICLES = []
for _a in _SRC["articles"]:
    _b = dict(_a)
    _b.setdefault("une", False); _b.setdefault("corrections", []); _b.setdefault("auteur", "Rédaction EFA")
    _b["chiffres"] = [(c["valeur"], c["libelle"], c["periode"], bool(c.get("calcul_efa"))) for c in _a["chiffres"]]
    _b["actions"] = [(x["type"], x["titre"], x["description"], x["url"]) for x in _a["actions"]]
    _b["sources"] = [(x["titre"], x["organisme"], x["date"], x["url"], x["consulte_le"]) for x in _a["sources"]]
    _b["types"] = [x.get("type", "media") for x in _a["sources"]]
    _b["verif"] = _a.get("verif")
    _b["mot"] = (_a["mot"]["terme"], _a["mot"]["definition"])
    _b["corrections"] = [(x["date"], x["texte"]) for x in _a.get("corrections", [])]
    ARTICLES.append(_b)
_IDS = [a["id"] for a in ARTICLES]
assert len(_IDS) == len(set(_IDS)), "identifiant en double dans news-data.json"
AUJ = sys.argv[2] if len(sys.argv) > 2 else datetime.date.today().isoformat()
BASEURL = "https://efa.africa/"
V = "2026102701"
CAT = dict(CATEGORIES)
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

def date_fr(iso):
    y, m, d = iso.split("-")
    j = int(d)
    return ("1er" if j == 1 else str(j)) + " " + MOIS[int(m) - 1] + " " + y

def typo(s):
    s = s.replace("'", "’")
    s = html.escape(s, quote=False)
    s = re.sub(r" ([:;?!»])", r"&nbsp;\1", s)
    s = s.replace("« ", "«&nbsp;")
    for _ in range(3):
        s = re.sub(r"(\d) (\d{3})(?!\d)", r"\1&nbsp;\2", s)
    s = re.sub(r"(\d) (%|Md|M|FCFA|\$|€|KES|DTS|centimes|francs|points|ans|jours|mois|millions|milliards|pays|sur)\b", r"\1&nbsp;\2", s)
    s = re.sub(r"(\d) (%|\$)", r"\1&nbsp;\2", s)
    s = re.sub(r"([≈+−→]) (?=\d)", r"\1&nbsp;", s)
    s = re.sub(r"(\d) ([≈+−→×÷=]) ", r"\1&nbsp;\2 ", s)
    return s

def attr(s):
    return html.escape(s.replace("'", "’"), quote=True)

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[’'`]", " ", s)

PUB = [a for a in ARTICLES if a["statut"] in ("publié", "corrigé")]
PUB.sort(key=lambda a: (a["publication"], a["id"]), reverse=True)
UNE = next((a for a in PUB if a["une"]), PUB[0])

def texte_complet(a):
    t = [a["titre"], a["resume"], a["fait"], a["change"], a["question"], a["mot"][0], a["mot"][1], a["retenir"]]
    t += a["mecanisme"] + a["limites"] + [c[0] + " " + c[1] for c in a["chiffres"]]
    return " ".join(t)

def lecture(a):
    n = len(texte_complet(a).split()) + sum(len(s[0].split()) for s in a["sources"])
    return max(2, round(n / 180))

# ------------------------------------------------------------------ gabarit commun
base = open(os.path.join(SITE, "question-preter-a-ma-soeur.html"), encoding="utf-8").read()
css0 = base[base.index("<style>"):base.index("/* 1 ·")] + "</style>"
header = base[base.index('<header class="top">'):base.index("</header>") + 9]
footer = base[base.index('<footer class="efa-foot">'):base.index("</footer>") + 9]

def reloc(fragment, pre):
    if not pre:
        return fragment
    def f(m):
        u = m.group(2)
        if re.match(r"(https?:|#|mailto:|tel:|/|data:|javascript:)", u):
            return m.group(0)
        return m.group(1) + pre + u + '"'
    return re.sub(r'((?:href|src)=")([^"]*)"', f, fragment)

CSS = """<style>
.intro{padding-block:26px 36px}
.intro .kick{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.pill-news{display:inline-block;background:#DA3C1B;color:#fff;font-weight:800;letter-spacing:.14em;font-size:12px;padding:5px 10px;border-radius:4px}
.intro h1{max-width:22ch}
.chapo{margin-top:14px;font-size:clamp(18px,2vw,21px);line-height:1.5;color:#E8EDF5;max-width:46ch}
.dates{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 0;padding:0}
.dates div{background:#111B2F;border-radius:10px;padding:8px 12px;min-width:0}
.dates dt{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#AEB6C6}
.dates dd{margin:2px 0 0;font-weight:700;color:#fff;font-size:15px}
.partage{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.bt{display:inline-flex;align-items:center;justify-content:center;gap:8px;text-align:center;min-height:46px;padding:12px 18px;border-radius:8px;border:0;background:var(--corail);color:#fff;text-decoration:none;font:800 16px/1.2 var(--f-body);cursor:pointer}
.bt.s{background:var(--nuit);color:#fff}
.bt.l{background:transparent;color:var(--nuit);box-shadow:inset 0 0 0 1.5px var(--nuit)}
.intro .bt.l{color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.7)}
.bt:focus-visible{outline:3px solid var(--soft-bleu);outline-offset:3px}
.flash{min-height:1.4em;font-size:14px;color:#C9D1DE;margin-top:8px}
.ancien{margin-top:22px;background:var(--papier);border-radius:12px;padding:14px 16px;font-size:15.5px;color:var(--ink)}
.ancien b{color:var(--nuit)}
.art section{padding-top:38px;scroll-margin-top:76px}
.art h2{font-size:clamp(24px,3.2vw,34px)}
.art p{margin-top:12px;color:var(--ink)}
.bk{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#B8341A}
.fait{font-size:clamp(18px,1.9vw,20px);line-height:1.55}
.chiffres{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px}
.ch{background:var(--papier);border-radius:14px;padding:16px;min-width:0;display:flex;flex-direction:column;gap:6px}
.ch b{font-family:var(--f-display);font-weight:700;font-size:clamp(22px,2.6vw,28px);line-height:1.1;color:var(--nuit);overflow-wrap:break-word}
.ch:first-child{background:var(--nuit)}
.ch:first-child b{color:#fff}.ch:first-child span{color:#E8EDF5}.ch:first-child small{color:#AEB6C6}
.ch span{font-size:15px;color:var(--ink);line-height:1.4}
.ch small{font-size:13px;color:var(--ink3)}
.calc{align-self:flex-start;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:var(--creme);color:#B8341A;border-radius:999px;padding:3px 9px;margin-top:auto}
.ch:first-child .calc{background:#111B2F;color:#F09680}
@media (max-width:760px){.chiffres{grid-template-columns:minmax(0,1fr)}}
.etapes{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:10px;counter-reset:e}
.etapes li{counter-increment:e;background:var(--papier);border-radius:14px;padding:14px 16px 14px 58px;position:relative;color:var(--ink)}
.etapes li::before{content:counter(e);position:absolute;left:16px;top:12px;width:30px;height:30px;border-radius:50%;background:var(--corail);color:#fff;font:800 15px/30px var(--f-body);text-align:center}
.mot{margin-top:14px;background:var(--papier);border-radius:14px;padding:16px 18px}
.mot p{margin:0}.mot p+p{margin-top:6px}
.mot .t{font-family:var(--f-display);font-weight:700;font-size:19px;color:var(--nuit)}
.art .retenir,.retenir{margin-top:16px;background:var(--nuit);color:#fff;border-radius:14px;padding:18px 20px;font-family:var(--f-display);font-size:clamp(19px,2.1vw,22px);line-height:1.35}
.retenir small{display:block;font-family:var(--f-body);font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#F09680;margin-bottom:6px}
.limites{margin-top:14px;background:var(--papier);border-radius:14px;padding:16px 18px 16px 38px;color:var(--ink)}
.limites li{margin:6px 0}
.question{margin-top:16px;background:var(--corail);color:#fff;border-radius:14px;padding:22px}
.question small{display:block;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#fff}
.question p{color:#fff;font-family:var(--f-display);font-weight:700;font-size:clamp(21px,2.6vw,27px);line-height:1.3;margin-top:8px}
.actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}
.act{background:var(--papier);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:6px;min-width:0}
.act small{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#B8341A}
.act h3{font-size:clamp(19px,1.8vw,22px);line-height:1.2}
.act p{margin:0;color:var(--ink2);font-size:15.5px}
.act .bt{margin-top:auto;align-self:stretch}
.act:first-child{background:var(--nuit)}
.act:first-child h3{color:#fff}.act:first-child p{color:#C9D1DE}.act:first-child small{color:#F09680}
@media (max-width:760px){.actions{grid-template-columns:minmax(0,1fr)}}
.sources{margin:14px 0 0;padding-left:22px;color:var(--ink)}
.sources li{margin:10px 0;line-height:1.45}
.sources a{color:var(--bleu);font-weight:700;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}
.sources span{display:block;font-size:14px;color:var(--ink3)}
.sources .st{display:block;width:max-content;max-width:100%;font-style:normal;font-size:11.5px;font-weight:800;letter-spacing:.04em;border-radius:999px;padding:2px 9px;margin:0 0 4px}
.sources .st.p{background:#DDEDF8;color:#0F4E80}.sources .st.m{background:#EFE8DA;color:#4E5566}
.verif{margin-top:14px;background:var(--papier);border-radius:14px;padding:18px;display:grid;gap:10px}
.verif .vq{margin:0;font-family:var(--f-display);font-weight:700;font-size:clamp(18px,2vw,21px);line-height:1.35;color:var(--nuit)}
.verif .vc{display:grid;gap:8px}
.verif button{font:600 16px var(--f-body);text-align:left;background:#fff;color:var(--nuit);border:1.5px solid var(--line);border-radius:10px;padding:12px 14px;min-height:46px;cursor:pointer}
.verif button:hover{border-color:var(--nuit)}.verif button[disabled]{cursor:default}
.verif button.ok{background:#E3F4EA;border-color:#1F8A52}.verif button.ko{background:#FBE7E2;border-color:#B3261E}
.verif .vr{margin:0;font-weight:800}.verif .vr.ok{color:#1F8A52}.verif .vr.ko{color:#B3261E}.verif .vx{margin:0;color:var(--ink2)}
.maj{margin-top:14px;background:var(--papier);border-radius:14px;padding:14px 18px}
.maj p{margin:4px 0 0;font-size:15px}
.signature{margin-top:26px;font-size:14.5px;color:var(--ink2);max-width:64ch}
.liees{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:16px}
@media (max-width:860px){.liees{grid-template-columns:minmax(0,1fr)}}
.retour-bas{margin-block:34px 48px;display:flex;flex-wrap:wrap;gap:10px}
/* cartes */
.carte-n{background:var(--papier);border-radius:14px;min-width:0;position:relative;display:flex;flex-direction:column}
.carte-n a.lien{display:flex;flex-direction:column;gap:8px;padding:18px;text-decoration:none;color:inherit;height:100%}
.carte-n a.lien:hover h3{text-decoration:underline;text-decoration-color:var(--corail);text-decoration-thickness:2px;text-underline-offset:4px}
.meta-n{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;font-size:13px;color:var(--ink3)}
.rub{background:var(--nuit);color:#fff;font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:11px;padding:4px 8px;border-radius:4px}
.carte-n h3{font-size:clamp(19px,1.7vw,22px);line-height:1.2;color:var(--nuit)}
.carte-n p{margin:0;color:var(--ink2);font-size:15.5px;line-height:1.45}
.pied-n{margin-top:auto;padding-top:6px;display:flex;flex-wrap:wrap;gap:6px 12px;font-size:13px;color:var(--ink3);font-weight:600}
.pourquoi{background:var(--creme);color:#8A3A12;border-radius:999px;padding:2px 9px;font-weight:700}
[hidden]{display:none!important}
mark{background:#FCE3D9;color:inherit;border-radius:3px;padding:0 2px}
</style>"""

CSS_HOME = """<style>
.lead{margin-top:14px;font-size:clamp(17px,2vw,20px);line-height:1.5;color:#C9D1DE;max-width:56ch}
.une{margin-top:28px;background:var(--papier);border-radius:18px;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);overflow:hidden}
.une .txt{padding:26px 24px;display:flex;flex-direction:column;gap:10px;min-width:0}
.une .lbl{font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#B8341A}
.une h2{font-size:clamp(26px,3.4vw,38px)}
.une h2 a{text-decoration:none;color:var(--nuit)}
.une p{color:var(--ink);font-size:clamp(17px,1.8vw,19px)}
.une .bt{align-self:flex-start;margin-top:6px}
.une .fig{background:var(--nuit);color:#fff;padding:26px 24px;display:flex;flex-direction:column;justify-content:center;gap:8px;min-width:0}
.une .fig b{font-family:var(--f-display);font-size:clamp(40px,6vw,72px);line-height:1;color:#fff}
.une .fig span{color:#E8EDF5;font-size:16px;max-width:30ch}
.une .fig small{color:#AEB6C6;font-size:13px}
@media (max-width:860px){.une{grid-template-columns:minmax(0,1fr)}.une .fig{order:-1;padding:20px 22px}.une .fig b{font-size:clamp(36px,11vw,56px)}}
.outils-n{margin-top:34px;scroll-margin-top:70px}
.outils-n h2{font-size:clamp(24px,3.2vw,34px)}
.cherche{margin-top:14px;display:flex;gap:8px;align-items:stretch}
.cherche label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.cherche input{flex:1;min-width:0;min-height:52px;border-radius:10px;border:1.5px solid #CDBF9F;background:#fff;padding:12px 14px;font:400 17px var(--f-body);color:var(--nuit)}
.cherche input:focus{outline:3px solid var(--bleu);outline-offset:1px;border-color:var(--bleu)}
.cherche input::-webkit-search-cancel-button{display:none}
.cherche .bt{min-height:52px}
.filtres{display:flex;gap:8px;margin-top:12px;overflow-x:auto;padding-bottom:6px;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
.filtres button{flex:0 0 auto;min-height:44px;padding:10px 16px;border-radius:999px;border:0;background:var(--papier);color:var(--nuit);font:700 15px var(--f-body);cursor:pointer;box-shadow:inset 0 0 0 1.5px #D9CDB5}
.filtres button[aria-pressed="true"]{background:var(--nuit);color:#fff;box-shadow:none}
.filtres button:focus-visible{outline:3px solid var(--bleu);outline-offset:2px}
.etat{margin-top:14px;font-size:15px;color:var(--ink2);min-height:1.5em}
.etat b{color:var(--nuit)}
.etat button{background:none;border:0;padding:0;font:700 15px var(--f-body);color:var(--bleu);text-decoration:underline;cursor:pointer;margin-left:6px}
.grille{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px}
@media (max-width:980px){.grille{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.grille{grid-template-columns:minmax(0,1fr)}}
.plus{display:flex;justify-content:center;margin-top:18px}
.vide{margin-top:12px;background:var(--papier);border-radius:14px;padding:22px}
.vide h3{font-size:21px}.vide p{margin-top:8px;color:var(--ink2)}
.methode-n{margin-block:44px 8px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.methode-n div{background:var(--papier);border-radius:14px;padding:16px;min-width:0}
.methode-n b{display:block;font-family:var(--f-display);font-size:18px;line-height:1.2;color:var(--nuit)}
.methode-n p{margin-top:6px;font-size:15px;color:var(--ink2)}
@media (max-width:860px){.methode-n{grid-template-columns:minmax(0,1fr)}}
.lettre{margin-block:28px 52px;background:var(--corail);color:#fff;border-radius:14px;padding:22px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between}
.lettre p{color:#fff;max-width:52ch;font-size:17px}.lettre b{font-family:var(--f-display);font-size:21px;display:block}
.lettre .bt{background:var(--nuit)}
</style>"""

def head(titre, desc, canon, pre, og_type="website", image=None, extra=""):
    # canon se terminant par news.html : la page homonyme du dossier news/ garde son .html
    img = image or BASEURL + "og-image.png"
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<script>/* Adresses sans « .html » */(function(){{try{{var p=location.pathname;if(/\\/news\\.html$/.test(p))return;var n=p.replace(/\\/index\\.html$/,"/").replace(/\\.html$/,"");if(n!==p&&history.replaceState)history.replaceState(history.state,"",n+location.search+location.hash);}}catch(e){{}}}})();</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" href="{pre}logo-efa-96.png">
<link rel="apple-touch-icon" href="{pre}apple-touch-icon.png">
<meta name="theme-color" content="#0B1220">
<title>{titre}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="Éducation Financière Afrique">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{titre}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="author" content="Rédaction EFA · Éducation Financière Afrique">
{extra}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap">
<link rel="stylesheet" href="{pre}footer.css?v=2026102602">
"""

JS_MENU = """<script>
function efaCompte(ev){try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:ev,title:ev,event:true});}catch(e){}}
(function(){var b=document.getElementById('menu'),n=document.getElementById('nav');if(!b)return;b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'Fermer':'Menu';});})();
</script>"""

def tail(pre):
    return f"""{reloc(footer, pre)}
{JS_MENU}
<script data-goatcounter="https://efa-africa.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script src="{pre}efa-appli.js?v=2026102902" defer></script>
</body>
</html>
"""

def carte(a, pre, h="h3"):
    return (f'<article class="carte-n"><a class="lien" href="{pre}news/{a["id"]}.html">'
            f'<p class="meta-n"><span class="rub">{typo(a["rubrique"])}</span><time datetime="{a["publication"]}">{date_fr(a["publication"])}</time></p>'
            f'<{h}>{typo(a["titre"])}</{h}><p>{typo(a["resume"])}</p>'
            f'<p class="pied-n"><span>{lecture(a)} min de lecture</span><span>{typo(CAT[a["categorie"]])}</span></p></a></article>')

CALC = '<span class="calc">Calcul EFA</span>'
LIB_BOUTON = {"Leçon": "Lire la leçon", "Calcul": "Faire le calcul", "Outil": "Ouvrir l’outil", "Exercice": "Faire l’exercice"}

# ------------------------------------------------------------------ page article
def page_article(a):
    pre = ""
    url = f"{BASEURL}news/{a['id']}"
    img = f"{BASEURL}news/og/{a['id']}.png"
    titre_page = a["titre"].replace("'", "’") + " · EFA News"
    desc = attr(a["resume"])
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "NewsArticle", "@id": url + "#article", "headline": a["titre"].replace("'", "’"),
         "description": a["resume"].replace("'", "’"), "inLanguage": "fr", "url": url, "mainEntityOfPage": url,
         "image": [img], "datePublished": a["publication"] + "T07:00:00+00:00", "dateModified": a["maj"] + "T07:00:00+00:00",
         "articleSection": CAT[a["categorie"]], "keywords": ", ".join(a["pays"] + a["entites"] + a["notions"]),
         "about": [{"@type": "Thing", "name": n} for n in a["notions"][:4]],
         "contentLocation": [{"@type": "Place", "name": p} for p in a["pays"][:4]],
         "isAccessibleForFree": True,
         "author": {"@type": "Organization", "name": "Rédaction EFA", "url": BASEURL},
         "publisher": {"@type": "Organization", "name": "Éducation Financière Afrique", "url": BASEURL,
                       "logo": {"@type": "ImageObject", "url": BASEURL + "logo-efa-96.png"}},
         "citation": [s[3] for s in a["sources"]]},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": BASEURL},
            {"@type": "ListItem", "position": 2, "name": "EFA News", "item": BASEURL + "news.html"},
            {"@type": "ListItem", "position": 3, "name": a["titre"].replace("'", "’"), "item": url}]}]}
    extra = (f'<meta property="article:published_time" content="{a["publication"]}T07:00:00+00:00">\n'
             f'<meta property="article:modified_time" content="{a["maj"]}T07:00:00+00:00">\n'
             f'<meta property="article:section" content="{CAT[a["categorie"]]}">\n')
    out = head(attr(titre_page), desc, url, pre, "article", img, '<base href="../">\n' + extra)
    out += '<script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False, indent=1) + "\n</script>\n"
    out += reloc(css0, pre) + "\n" + CSS + "\n</head>\n<body>\n\n" + reloc(header, pre) + "\n\n<main>\n"

    maj = "" if a["maj"] == a["publication"] else f'<div><dt>Mis à jour</dt><dd><time datetime="{a["maj"]}">{date_fr(a["maj"])}</time></dd></div>'
    wa = "https://wa.me/?text=" + html.escape(re.sub(r"\s", "%20", a["titre"].replace("'", "’") + " " + url))
    out += f"""<section class="intro">
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <a href="news.html" data-retour>EFA News</a> › <a href="news.html?c={a['categorie']}">{typo(CAT[a['categorie']])}</a></nav>
    <p class="kick"><span class="pill-news">EFA | NEWS</span><span>{typo(a['rubrique'])}</span></p>
    <h1>{typo(a['titre'])}</h1>
    <p class="chapo">{typo(a['resume'])}</p>
    <dl class="dates">
      <div><dt>Date du fait</dt><dd>{typo(a['evenement_label'])}</dd></div>
      <div><dt>Publié par EFA</dt><dd><time datetime="{a['publication']}">{date_fr(a['publication'])}</time></dd></div>
      {maj}
      <div><dt>Lecture</dt><dd>{lecture(a)} min</dd></div>
    </dl>
    <div class="partage">
      <button type="button" class="bt" data-partager>Partager</button>
      <a class="bt l" href="{wa}" target="_blank" rel="noopener" data-goatcounter-click="news-whatsapp-{a['id']}">WhatsApp</a>
      <a class="bt l" href="news.html" data-retour>← Toutes les actualités</a>
    </div>
    <p class="flash" id="flash" role="status" aria-live="polite"></p>
  </div>
</section>
<div class="wrap">
<article class="art col" data-pub="{a['publication']}">
  <p class="ancien" id="ancien" hidden></p>
"""
    out += f'  <section id="fait"><p class="bk">Le fait</p><h2>Que s’est-il passé&nbsp;?</h2><p class="fait">{typo(a["fait"])}</p></section>\n'
    ch = "".join(f'<div class="ch"><b>{typo(v)}</b><span>{typo(l)}</span><small>{typo(p)}</small>{CALC if c else ""}</div>' for v, l, p, c in a["chiffres"])
    out += f'  <section id="chiffre"><p class="bk">Le chiffre</p><h2>Ce qu’il faut regarder</h2><div class="chiffres">{ch}</div></section>\n'
    et = "".join(f"<li>{typo(e)}</li>" for e in a["mecanisme"])
    out += (f'  <section id="mecanisme"><p class="bk">Le mécanisme</p><h2>Comment cela fonctionne</h2><ol class="etapes">{et}</ol>'
            f'<div class="mot"><p class="t">{typo(a["mot"][0])}</p><p>{typo(a["mot"][1])}</p></div></section>\n')
    out += (f'  <section id="consequences"><p class="bk">Ce que cela peut changer</p><h2>Pour qui, et comment</h2><p>{typo(a["change"])}</p>'
            f'<p class="retenir"><small>À retenir</small>{typo(a["retenir"])}</p></section>\n')
    li = "".join(f"<li>{typo(l)}</li>" for l in a["limites"])
    out += f'  <section id="limites"><p class="bk">Ce qu’on ne sait pas encore</p><h2>Les limites de cette information</h2><ul class="limites">{li}</ul></section>\n'
    out += f'  <section id="question"><div class="question"><small>La question EFA</small><p>{typo(a["question"])}</p></div></section>\n'
    vf = a.get("verif")
    if vf:
        bts = "".join(f'<button type="button" data-i="{i}">{typo(c)}</button>' for i, c in enumerate(vf["choix"]))
        out += (f'  <section id="verifier"><p class="bk">Vérifiez votre lecture</p><div class="verif" data-bonne="{vf["bonne"]}" data-id="{a["id"]}">'
                f'<p class="vq">{typo(vf["q"])}</p><div class="vc">{bts}</div><p class="vr" hidden></p><p class="vx" hidden>{typo(vf["explication"])}</p></div></section>\n')
    acts = ""
    for i, (t, ti, d, u) in enumerate(a["actions"]):
        lib = "Comprendre avec EFA" if i == 0 else LIB_BOUTON.get(t, "Ouvrir")
        cls = "bt" if i == 0 else "bt s"
        acts += (f'<div class="act"><small>{typo(t)}</small><h3>{typo(ti)}</h3><p>{typo(d)}</p>'
                 f'<a class="{cls}" href="{u}" data-goatcounter-click="news-ecole-{a["id"]}-{i+1}">{lib} →</a></div>')
    out += f'  <section id="action"><p class="bk">Passer à l’action</p><h2>Pour comprendre, faites le calcul</h2><div class="actions">{acts}</div></section>\n'
    so = ""
    GROUPES = {"Agence Ecofin": "Ecofin", "Ecofin Agency": "Ecofin", "MyJoyOnline": "Multimedia Group", "Adom Online": "Multimedia Group"}
    def groupe(org):
        return "Reuters" if org.startswith("Reuters") else GROUPES.get(org, org)
    for (ti, org, d, u, cons), ty in zip(a["sources"], a["types"]):
        badge = '<em class="st p">Document primaire consulté</em>' if ty == "primaire" else '<em class="st m">Information rapportée par un média</em>'
        so += (f'<li>{badge}<a href="{html.escape(u)}" target="_blank" rel="noopener">{typo(ti)}</a>'
               f'<span>{typo(org)} · {typo(d)} · consulté le {date_fr(cons)}</span></li>')
    gm = [groupe(o) for (t_, o, *_), ty in zip(a["sources"], a["types"]) if ty != "primaire"]
    meme = sorted({x for x in gm if gm.count(x) > 1})
    grp_note = (" Plusieurs sources appartiennent au même groupe de presse (" + ", ".join(meme) + ") : elles comptent pour une seule confirmation.") if meme else ""
    calc_note = " Les chiffres marqués «&nbsp;Calcul EFA&nbsp;» sont calculés par la rédaction à partir de ces sources." if any(c[3] for c in a["chiffres"]) else ""
    out += f'  <section id="sources"><p class="bk">Sources</p><h2>Les documents consultés</h2><ol class="sources">{so}</ol><p class="note">Les liens ouvrent le site de chaque source.{calc_note}{grp_note}</p>'
    if a["corrections"]:
        mj = "".join(f'<p><b><time datetime="{d}">{date_fr(d)}</time></b>&nbsp;: {typo(t)}</p>' for d, t in a["corrections"])
        out += f'<div class="maj"><p class="bk">Mises à jour</p>{mj}</div>'
    out += "</section>\n"
    out += (f'  <p class="signature">{typo(a["auteur"])}. Éducation financière, pas conseil en placement. '
            f'Une erreur, un chiffre à corriger&nbsp;? Écrivez à newsletter@efa.africa&nbsp;: la correction sera indiquée sur cette page.</p>\n')
    # à lire aussi
    autres = [b for b in PUB if b["id"] != a["id"]]
    def score(b):
        return (b["categorie"] == a["categorie"]) * 3 + len(set(b["pays"]) & set(a["pays"])) + len(set(b["notions"]) & set(a["notions"])) * 2
    autres.sort(key=lambda b: (score(b), b["publication"]), reverse=True)
    lie = "".join(carte(b, pre) for b in autres[:3])
    out += f'  <section id="liees"><p class="bk">À lire aussi</p><h2>Sur le même sujet</h2><div class="liees">{lie}</div></section>\n'
    out += '  <div class="retour-bas"><a class="bt s" href="news.html" data-retour>← Toutes les actualités</a><a class="bt l" href="parcours.html">L’école EFA</a></div>\n'
    out += "</article>\n</div>\n</main>\n\n"
    out += """<script>
(function(){
  var url=location.href.split('#')[0].split('?')[0], t=document.title;
  var f=document.getElementById('flash');
  function dire(m){if(f){f.textContent=m;setTimeout(function(){f.textContent='';},3500);}}
  function copier(){
    try{navigator.clipboard.writeText(url).then(function(){dire('Lien copié : '+url);},function(){dire(url);});}catch(e){dire(url);}
  }
  var p=document.querySelector('[data-partager]');
  if(p)p.addEventListener('click',function(){
    efaCompte('news-partage');
    if(navigator.share){navigator.share({title:t,url:url}).catch(function(){});}else copier();
  });
  /* revenir à News sans perdre la recherche : on revient en arrière quand on vient de News */
  var ref=document.referrer||'';
  document.querySelectorAll('[data-retour]').forEach(function(a){
    a.addEventListener('click',function(ev){
      if(/\\/news(\\.html)?([?#]|$)/.test(ref)&&ref.indexOf(location.host)>-1&&history.length>1){ev.preventDefault();history.back();}
    });
  });
  /* Vérifiez votre lecture */
  document.querySelectorAll('.verif').forEach(function(v){
    var bonne=+v.dataset.bonne, r=v.querySelector('.vr'), x=v.querySelector('.vx');
    v.querySelectorAll('.vc button').forEach(function(b){b.addEventListener('click',function(){
      var i=+b.dataset.i, ok=i===bonne;
      v.querySelectorAll('.vc button').forEach(function(c){c.disabled=true; if(+c.dataset.i===bonne)c.classList.add('ok');});
      if(!ok)b.classList.add('ko');
      r.textContent=ok?'Juste.':'Pas tout à fait.'; r.className='vr '+(ok?'ok':'ko'); r.hidden=false; x.hidden=false;
      efaCompte('news-verif-'+(ok?'ok':'ko')+'-'+v.dataset.id);
    });});
  });
  /* un article ancien ne doit pas sembler du jour */
  var art=document.querySelector('[data-pub]'),an=document.getElementById('ancien');
  if(art&&an){
    var d=new Date(art.getAttribute('data-pub')+'T00:00:00'),j=Math.floor((Date.now()-d.getTime())/864e5);
    if(j>=14){an.innerHTML='<b>Article publié il y a '+(j>=60?Math.round(j/30)+' mois':Math.round(j/7)+' semaines')+'.</b> Il reste utile pour comprendre le mécanisme, mais les chiffres ont pu changer depuis.';an.hidden=false;}
  }
})();
</script>
"""
    out += tail(pre)
    return out

# ------------------------------------------------------------------ accueil News
def index_json():
    L = []
    for a in PUB:
        L.append({"id": a["id"], "t": a["titre"].replace("'", "’"), "r": a["resume"].replace("'", "’"),
                  "rub": a["rubrique"], "c": a["categorie"], "d": a["publication"], "dl": date_fr(a["publication"]),
                  "min": lecture(a), "p": a["pays"], "e": a["entites"], "n": a["notions"],
                  "x": texte_complet(a).replace("'", "’"), "une": a is UNE})
    return json.dumps(L, ensure_ascii=False, separators=(",", ":"))

def page_home():
    pre = ""
    url = BASEURL + "news.html"  # news/ est aussi un dossier : garder .html
    titre = "EFA News : comprendre ce que l’actualité change pour votre argent · EFA"
    desc = "L’actualité de la finance africaine expliquée : le fait, le chiffre, le mécanisme, ce qu’on ne sait pas encore, les sources, et la leçon EFA pour aller plus loin."
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "CollectionPage", "@id": url, "url": url, "name": "EFA News", "description": desc, "inLanguage": "fr",
         "publisher": {"@type": "Organization", "name": "Éducation Financière Afrique", "url": BASEURL},
         "mainEntity": {"@type": "ItemList", "itemListElement": [
             {"@type": "ListItem", "position": i + 1, "url": f"{BASEURL}news/{a['id']}", "name": a["titre"].replace("'", "’")} for i, a in enumerate(PUB)]}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": BASEURL},
            {"@type": "ListItem", "position": 2, "name": "EFA News", "item": url}]}]}
    ids = json.dumps([a["id"] for a in PUB])
    redir = f"""<script>(function(){{var h=location.hash.slice(1),ok={ids};if(h&&ok.indexOf(h)>-1)location.replace('news/'+h+'.html');}})();</script>\n"""
    out = head(attr(titre), attr(desc), url, pre, extra=redir)
    out += '<script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False, indent=1) + "\n</script>\n"
    out += css0 + "\n" + CSS + "\n" + CSS_HOME + "\n</head>\n<body>\n\n" + header + "\n\n<main>\n"
    u = UNE
    c0 = u["chiffres"][0]
    filtres = '<button type="button" data-c="" aria-pressed="true">Tous</button>' + "".join(
        f'<button type="button" data-c="{k}" aria-pressed="false">{typo(v)}</button>' for k, v in CATEGORIES)
    statiques = "".join(carte(a, pre) for a in PUB if a is not UNE)
    out += f"""<section class="intro">
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › EFA News</nav>
    <p class="kick"><span class="pill-news">EFA | NEWS</span></p>
    <h1>Comprendre ce que l’actualité change pour votre argent</h1>
    <p class="lead">Chaque actualité en huit blocs courts&nbsp;: le fait, le chiffre, le mécanisme, ce que cela peut changer, ce qu’on ne sait pas encore, la question à se poser, la leçon pour aller plus loin et les sources.</p>
  </div>
</section>
<div class="wrap">
  <section class="une" id="une" aria-labelledby="une-t">
    <div class="txt">
      <p class="lbl">À la une · choix de la rédaction</p>
      <p class="meta-n"><span class="rub">{typo(u['rubrique'])}</span><time datetime="{u['publication']}">{date_fr(u['publication'])}</time><span>· {lecture(u)} min de lecture</span></p>
      <h2 id="une-t"><a href="news/{u['id']}.html">{typo(u['titre'])}</a></h2>
      <p>{typo(u['resume'])}</p>
      <a class="bt" href="news/{u['id']}.html" data-goatcounter-click="news-une">Comprendre cette actualité →</a>
    </div>
    <div class="fig" aria-hidden="true"><small>Le chiffre</small><b>{typo(c0[0])}</b><span>{typo(c0[1])}</span></div>
  </section>

  <section class="outils-n" id="articles" aria-labelledby="art-t">
    <h2 id="art-t">Toutes les actualités</h2>
    <form class="cherche" role="search" id="f-cherche">
      <label for="q">Rechercher dans EFA News</label>
      <input type="search" id="q" name="q" placeholder="Rechercher un pays, une entreprise, un sujet…" autocomplete="off" enterkeyhint="search">
      <button type="button" class="bt l" id="q-effacer" hidden>Effacer</button>
    </form>
    <div class="filtres" role="group" aria-label="Filtrer par rubrique">{filtres}</div>
    <p class="etat" id="etat" role="status" aria-live="polite"></p>
    <div class="grille" id="grille">{statiques}</div>
    <div class="vide" id="vide" hidden><h3>Aucun article ne correspond.</h3><p>Essayez un autre mot (un pays, une institution, une notion comme «&nbsp;inflation&nbsp;»), ou retirez le filtre.</p></div>
    <div class="plus"><button type="button" class="bt s" id="plus" hidden>Afficher plus d’articles</button></div>
  </section>

  <section class="methode-n" aria-label="Notre façon de travailler">
    <div><b>Des sources cliquables</b><p>Chaque fait important renvoie au document ou à l’article consulté.</p></div>
    <div><b>Le calcul EFA signalé</b><p>Quand la rédaction calcule un chiffre, c’est écrit.</p></div>
    <div><b>Vérifié avant publication</b><p>Chaque chiffre est recoupé à sa source, avec sa date et ses réserves.</p></div>
    <div><b>Des corrections visibles</b><p>Un chiffre corrigé est daté et signalé sur l’article.</p></div>
  </section>

  <section class="lettre">
    <p><b>La lettre du mardi</b>L’actualité qui compte pour votre argent, une leçon, un outil.</p>
    <a class="bt" href="index.html#guide">Recevoir la lettre</a>
  </section>
</div>
</main>

<script id="news-index" type="application/json">{index_json()}</script>
<script>
(function(){{
  var D=JSON.parse(document.getElementById('news-index').textContent);
  var PAS=9, q=document.getElementById('q'), g=document.getElementById('grille'), etat=document.getElementById('etat'),
      vide=document.getElementById('vide'), plus=document.getElementById('plus'), eff=document.getElementById('q-effacer'),
      une=document.getElementById('une'), boutons=[].slice.call(document.querySelectorAll('.filtres button'));
  var CAT={json.dumps(CAT, ensure_ascii=False)};
  var S={{q:'',c:'',n:PAS}};
  function norm(s){{return (s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[’'`]/g,' ');}}
  function esc(s){{return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}
  D.forEach(function(a){{a._t=norm(a.t);a._r=norm(a.r);a._x=norm(a.x);a._rub=norm(a.rub+' '+CAT[a.c]);
    a._p=a.p.map(norm);a._e=a.e.map(norm);a._n=a.n.map(norm);}});
  function dans(liste,m){{for(var i=0;i<liste.length;i++)if(liste[i].indexOf(m)>-1)return i;return -1;}}
  function raison(a,mots){{
    var m=mots[0],i;
    if((i=dans(a._p,m))>-1)return 'Pays : '+a.p[i];
    if((i=dans(a._e,m))>-1)return 'Institution : '+a.e[i];
    if((i=dans(a._n,m))>-1)return 'Notion : '+a.n[i];
    if(a._t.indexOf(m)>-1)return 'Dans le titre';
    if(a._r.indexOf(m)>-1)return 'Dans le résumé';
    return 'Dans le texte';
  }}
  function ok(a,mots){{
    var tout=a._t+' '+a._r+' '+a._x+' '+a._rub+' '+a._p.join(' ')+' '+a._e.join(' ')+' '+a._n.join(' ');
    for(var i=0;i<mots.length;i++)if(tout.indexOf(mots[i])<0)return false;return true;
  }}
  function surligne(t,mots){{
    var e=esc(t);if(!mots.length)return e;
    var n=norm(t),pos=[];
    mots.forEach(function(m){{var k=n.indexOf(m);if(k>-1)pos.push([k,k+m.length]);}});
    if(!pos.length)return e;
    pos.sort(function(a,b){{return a[0]-b[0];}});
    var o='',d=0;pos.forEach(function(p){{if(p[0]<d)return;o+=esc(t.slice(d,p[0]))+'<mark>'+esc(t.slice(p[0],p[1]))+'</mark>';d=p[1];}});
    return o+esc(t.slice(d));
  }}
  function carte(a,mots){{
    var r=mots.length?'<span class="pourquoi">'+esc(raison(a,mots))+'</span>':'<span>'+esc(CAT[a.c])+'</span>';
    return '<article class="carte-n"><a class="lien" href="news/'+a.id+'.html"><p class="meta-n"><span class="rub">'+esc(a.rub)+'</span><time datetime="'+a.d+'">'+a.dl+'</time></p><h3>'+surligne(a.t,mots)+'</h3><p>'+surligne(a.r,mots)+'</p><p class="pied-n"><span>'+a.min+' min de lecture</span>'+r+'</p></a></article>';
  }}
  function lireURL(){{
    var p=new URLSearchParams(location.search);
    S.q=p.get('q')||'';S.c=CAT[p.get('c')]?p.get('c'):'';S.n=Math.max(PAS,parseInt(p.get('n'),10)||PAS);
  }}
  function ecrireURL(){{
    var p=new URLSearchParams();if(S.q)p.set('q',S.q);if(S.c)p.set('c',S.c);if(S.n>PAS)p.set('n',S.n);
    var s=p.toString();history.replaceState(null,'',location.pathname+(s?'?'+s:'')+location.hash);
  }}
  function rendre(){{
    var mots=norm(S.q).split(/\\s+/).filter(function(m){{return m.length>1;}});
    var actif=mots.length||S.c;
    une.hidden=!!actif;
    var L=D.filter(function(a){{return (!S.c||a.c===S.c)&&(!actif?!a.une:true)&&(!mots.length||ok(a,mots));}});
    var vis=L.slice(0,S.n);
    g.innerHTML=vis.map(function(a){{return carte(a,mots);}}).join('');
    vide.hidden=L.length>0;
    var reste=L.length-vis.length;
    plus.hidden=reste<=0;plus.textContent='Afficher plus d’articles ('+reste+')';
    var txt='<b>'+L.length+'</b> article'+(L.length>1?'s':'');
    if(!actif)txt+=' en plus de l’article à la une';
    if(mots.length)txt+=' pour « '+esc(S.q.trim())+' »';
    if(S.c)txt+=' dans '+esc(CAT[S.c]);
    if(actif)txt+='<button type="button" id="tout">Tout afficher</button>';
    etat.innerHTML=txt;
    var t=document.getElementById('tout');if(t)t.addEventListener('click',function(){{S.q='';S.c='';S.n=PAS;q.value='';maj();q.focus();}});
    boutons.forEach(function(b){{b.setAttribute('aria-pressed',String(b.getAttribute('data-c')===S.c));}});
    eff.hidden=!S.q;
  }}
  function maj(){{ecrireURL();rendre();}}
  var minuteur;
  q.addEventListener('input',function(){{S.q=q.value;S.n=PAS;clearTimeout(minuteur);minuteur=setTimeout(maj,120);}});
  q.addEventListener('change',function(){{if(S.q)efaCompte('news-recherche');}});
  document.getElementById('f-cherche').addEventListener('submit',function(e){{e.preventDefault();S.q=q.value;maj();q.blur();}});
  eff.addEventListener('click',function(){{q.value='';S.q='';S.n=PAS;maj();q.focus();}});
  boutons.forEach(function(b){{b.addEventListener('click',function(){{S.c=b.getAttribute('data-c');S.n=PAS;maj();efaCompte('news-filtre-'+(S.c||'tous'));}});}});
  plus.addEventListener('click',function(){{S.n+=PAS;maj();}});
  window.addEventListener('pageshow',function(){{lireURL();q.value=S.q;rendre();}});
  lireURL();q.value=S.q;rendre();
}})();
</script>
"""
    out += tail(pre)
    return out

# ------------------------------------------------------------------ écriture
os.makedirs(os.path.join(SITE, "news", "og"), exist_ok=True)
for a in PUB:
    open(os.path.join(SITE, "news", a["id"] + ".html"), "w", encoding="utf-8").write(page_article(a))
open(os.path.join(SITE, "news.html"), "w", encoding="utf-8").write(page_home())
# sitemap
sm = open(os.path.join(SITE, "sitemap.xml"), encoding="utf-8").read()
sm = re.sub(r"\s*<url><loc>https://efa\.africa/news/[^<]+</loc>.*?</url>", "", sm)
sm = re.sub(r"(<url><loc>https://efa\.africa/news</loc><lastmod>)[^<]+", r"\g<1>" + AUJ, sm)
add = "".join(f'\n  <url><loc>{BASEURL}news/{a["id"]}</loc><lastmod>{a["maj"]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>' for a in PUB)
sm = sm.replace("</urlset>", add + "\n</urlset>")
open(os.path.join(SITE, "sitemap.xml"), "w", encoding="utf-8").write(sm)

# liste pour les images de partage
json.dump([{"id": a["id"], "rub": a["rubrique"], "t": a["titre"].replace("'", "’"), "v": a["chiffres"][0][0], "l": a["chiffres"][0][1].replace("'", "’"), "d": date_fr(a["publication"])} for a in PUB],
          open(os.path.join(SITE, "outils-news", "og-liste.json"), "w", encoding="utf-8"), ensure_ascii=False)
# image de partage manquante : image générale du site, en attendant og.js
for a in PUB:
    if not os.path.exists(os.path.join(SITE, "news", "og", a["id"] + ".png")):
        for f in [os.path.join(SITE, "news", a["id"] + ".html")]:
            t = open(f, encoding="utf-8").read().replace(f"{BASEURL}news/og/{a['id']}.png", BASEURL + "og-image.png")
            open(f, "w", encoding="utf-8").write(t)
print(len(PUB), "articles publiés ·", len(ARTICLES) - len(PUB), "non publiés · à la une :", UNE["id"])
