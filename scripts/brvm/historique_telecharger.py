#!/usr/bin/env python3
"""Télécharge les bulletins officiels de la cote (BOC) de la BRVM sur une période
et en garde le texte (pdftotext -layout) pour reconstituer l'historique EFA.

Usage : python scripts/brvm/historique_telecharger.py --debut 2026-01-02 --fin 2026-10-22 --sortie brut
Sortie : brut/AAAA-MM-JJ.txt + brut/index.json (url d'origine par séance, séances introuvables).
"""
import argparse, datetime as dt, json, os, subprocess, tempfile, time
import requests

BASE = "https://www.brvm.org/sites/default/files/"
MODELES = ["boc_{d}_2.pdf", "boc_{d}_1.pdf", "boc_{d}.pdf", "boc_{d}_3.pdf",
           "boc_eng_{d}_2.pdf", "boc_eng_{d}_1.pdf", "boc_eng_{d}.pdf"]
ENTETES = {"User-Agent": "EFA-robot-BRVM"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--debut", required=True)
    ap.add_argument("--fin", required=True)
    ap.add_argument("--sortie", default="brut")
    a = ap.parse_args()
    os.makedirs(a.sortie, exist_ok=True)
    fidx = os.path.join(a.sortie, "index.json")
    index = json.load(open(fidx)) if os.path.exists(fidx) else {"seances": {}, "introuvables": []}
    d, fin = dt.date.fromisoformat(a.debut), dt.date.fromisoformat(a.fin)
    s = requests.Session()
    s.headers.update(ENTETES)
    while d <= fin:
        if d.weekday() < 5 and d.isoformat() not in index["seances"]:
            trouve = None
            for m in MODELES:
                url = BASE + m.format(d=d.strftime("%Y%m%d"))
                try:
                    r = s.get(url, timeout=60)
                except requests.RequestException as e:
                    print("erreur", url, e)
                    time.sleep(3)
                    continue
                if r.status_code == 200 and r.content[:4] == b"%PDF":
                    trouve = (url, r.content)
                    break
                time.sleep(0.4)
            if trouve:
                with tempfile.NamedTemporaryFile(suffix=".pdf") as t:
                    t.write(trouve[1])
                    t.flush()
                    txt = subprocess.run(["pdftotext", "-layout", t.name, "-"], capture_output=True, text=True).stdout
                open(os.path.join(a.sortie, d.isoformat() + ".txt"), "w", encoding="utf-8").write(txt)
                index["seances"][d.isoformat()] = trouve[0]
                if d.isoformat() in index["introuvables"]:
                    index["introuvables"].remove(d.isoformat())
                print("ok", d, trouve[0])
            else:
                if d.isoformat() not in index["introuvables"]:
                    index["introuvables"].append(d.isoformat())
                print("absent", d)
            json.dump(index, open(fidx, "w"), indent=1, ensure_ascii=False)
        d += dt.timedelta(days=1)
    print("séances trouvées :", len(index["seances"]), "· introuvables :", len(index["introuvables"]))


if __name__ == "__main__":
    main()
