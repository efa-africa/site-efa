#!/usr/bin/env python3
"""Collecte les publications financières des sociétés cotées sur brvm.org
(états financiers, rapports trimestriels, rapports annuels) : liste, fiche, PDF, texte.

Usage : python scripts/brvm/etats_financiers_telecharger.py --sortie ef [--types etats-financiers,rapports-trimestriels] [--pages 3]
  --pages N : ne lit que les N premières pages de chaque liste (mise à jour hebdomadaire) ; 0 = toutes.
Sortie : ef/index.json (une entrée par publication) + ef/pdf_texte/<id>.txt (pdftotext -layout).
Un texte vide ou très court signale un PDF scanné (image) : à passer à la reconnaissance de caractères.
"""
import argparse, json, os, re, subprocess, tempfile, time
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

BASE = "https://www.brvm.org"
ENTETES = {"User-Agent": "EFA-robot-BRVM"}
MOIS = {m: i + 1 for i, m in enumerate(["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
                                         "septembre", "octobre", "novembre", "décembre"])}


def get(s, url, essais=3):
    for i in range(essais):
        try:
            r = s.get(url, timeout=90)
            if r.status_code == 200:
                return r
            print("statut", r.status_code, url)
        except requests.RequestException as e:
            print("erreur", url, e)
        time.sleep(3 * (i + 1))
    return None


def liste(s, typ, page):
    r = get(s, "%s/fr/type-document/%s?page=%d" % (BASE, typ, page))
    if not r:
        return None
    soup = BeautifulSoup(r.text, "html.parser")
    out = []
    for a in soup.find_all("a", href=True):
        t = " ".join(a.get_text(" ").split())
        if " : " in t and a["href"].startswith("/fr/") and "type-document" not in a["href"]:
            out.append((t, urljoin(BASE, a["href"])))
    vus, res = set(), []
    for t, u in out:
        if u not in vus:
            vus.add(u)
            res.append((t, u))
    return res


def fiche(s, url):
    r = get(s, url)
    if not r:
        return None, []
    soup = BeautifulSoup(r.text, "html.parser")
    pdfs = sorted({urljoin(BASE, a["href"]) for a in soup.find_all("a", href=True) if a["href"].lower().endswith(".pdf")})
    texte = soup.get_text(" ")
    m = re.search(r"(\d{1,2}) (" + "|".join(MOIS) + r"),? (\d{4})", texte, re.I)
    date = "%s-%02d-%02d" % (m.group(3), MOIS[m.group(2).lower()], int(m.group(1))) if m else ""
    return date, pdfs


def texte_pdf(contenu, e, max_pages=25):
    """Texte du PDF ; si le PDF est un scan (presque pas de texte), reconnaissance de caractères (tesseract, français)."""
    with tempfile.TemporaryDirectory() as d:
        f = os.path.join(d, "doc.pdf")
        open(f, "wb").write(contenu)
        txt = subprocess.run(["pdftotext", "-layout", f, "-"], capture_output=True, text=True).stdout
        if len(txt.strip()) >= 500:
            return txt + "\n\f\n"
        subprocess.run(["pdftoppm", "-r", "200", "-gray", "-l", str(max_pages), "-png", f, os.path.join(d, "p")], capture_output=True)
        pages = sorted(x for x in os.listdir(d) if x.startswith("p") and x.endswith(".png"))
        out = []
        for x in pages:
            r = subprocess.run(["tesseract", os.path.join(d, x), "-", "-l", "fra", "--psm", "6"], capture_output=True, text=True)
            out.append(r.stdout)
        e["ocr"] = True
        return "\n\f\n".join(out) + "\n\f\n"


def decouper(titre):
    soc, _, doc = titre.partition(" : ")
    m = re.search(r"(Exercice|Year|1er semestre|2e semestre|2ème semestre|[1-4](?:er|e|ème) trimestre|T[1-4])\s*(\d{4})", doc, re.I)
    return soc.strip(), doc.strip(), (m.group(0) if m else "")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sortie", default="ef")
    ap.add_argument("--types", default="etats-financiers,rapports-trimestriels,annual-reports")
    ap.add_argument("--pages", type=int, default=0)
    a = ap.parse_args()
    os.makedirs(os.path.join(a.sortie, "pdf_texte"), exist_ok=True)
    fidx = os.path.join(a.sortie, "index.json")
    idx = json.load(open(fidx)) if os.path.exists(fidx) else {"publications": {}}
    pubs = idx["publications"]
    s = requests.Session()
    s.headers.update(ENTETES)
    for typ in a.types.split(","):
        page, nouveaux_type = 0, 0
        while True:
            if a.pages and page >= a.pages:
                break
            items = liste(s, typ, page)
            if not items:
                break
            nouveaux = 0
            for titre, url in items:
                pid = url.rsplit("/", 1)[-1]
                if pid in pubs and pubs[pid].get("pdf") and (pubs[pid]["caracteres"] >= 500 or pubs[pid].get("ocr")):
                    continue
                date, pdfs = fiche(s, url)
                soc, doc, periode = decouper(titre)
                e = {"type": typ, "societe": soc, "document": doc, "periode": periode, "date_publication": date,
                     "fiche": url, "pdf": pdfs, "caracteres": 0}
                m = re.search(r"/(\d{4})(\d{2})(\d{2})_", pdfs[0]) if pdfs else None
                if m:
                    e["date_publication"] = "-".join(m.groups())
                txt = ""
                for p in pdfs[:3]:
                    r = get(s, p)
                    if r and r.content[:4] == b"%PDF":
                        txt += texte_pdf(r.content, e)
                    time.sleep(0.4)
                if txt.strip():
                    open(os.path.join(a.sortie, "pdf_texte", pid + ".txt"), "w", encoding="utf-8").write(txt)
                e["caracteres"] = len(txt.strip())
                pubs[pid] = e
                nouveaux += 1
                print("ok", typ, date, soc, "|", doc, "|", e["caracteres"], "car.")
                time.sleep(0.4)
            nouveaux_type += nouveaux
            json.dump(idx, open(fidx, "w"), ensure_ascii=False, indent=1)
            print("page", typ, page, "·", len(items), "entrées ·", nouveaux, "nouvelles")
            page += 1
        print("type", typ, ":", nouveaux_type, "nouvelles publications")
    scans = sum(1 for e in pubs.values() if e["pdf"] and e["caracteres"] < 500)
    print("publications :", len(pubs), "· PDF scannés (sans texte) :", scans)


if __name__ == "__main__":
    main()
