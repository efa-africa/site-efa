#!/usr/bin/env python3
"""Lit dans le dernier bulletin officiel de la cote, pour chaque action : dernier dividende net, date de paiement,
rendement net et PER (ratio cours / bénéfice), tels que publiés par la BRVM.

Sortie : data/brvm/ratios.json
Usage : python scripts/brvm/ratios_lire.py --brut <dossier brut>
"""
import argparse, json, os, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from historique_lire import LIGNE_ACTION, num  # noqa: E402
from historique_titres import date_courte  # noqa: E402

SORTIE = Path(__file__).resolve().parents[2] / "data" / "brvm" / "ratios.json"


def lire(texte):
    res = {}
    for l in texte.split("\n"):
        m = LIGNE_ACTION.match(l)
        if not m or m.group(1) == "TOTAL" or m.group(1) in res:
            continue
        t = [x for x in re.split(r"\s{2,}", m.group(2).strip()) if not (x.startswith("(") and len(x) <= 12)]
        t = [y for x in t for y in (re.split(r" (?=\d{1,2}-[A-Za-zéû]+\.?-\d{2}$)", x))]
        i_d = next((i for i in range(len(t) - 1, 0, -1) if re.fullmatch(r"\d{1,2}-[A-Za-zéû]+\.?-\d{2}", t[i])), None)
        if i_d is None:
            if t and "," in t[-1] and not t[-1].endswith("%") and num(t[-1]):
                res[m.group(1)] = {"dividende_net": None, "date_paiement": None, "rendement_net_pct": None, "per": num(t[-1])}
            continue
        apres = t[i_d + 1:]
        rdt = next((x for x in apres if x.endswith("%")), None)
        per = apres[-1] if apres and not apres[-1].endswith("%") else None
        res[m.group(1)] = {"dividende_net": num(t[i_d - 1]), "date_paiement": date_courte(t[i_d]),
                           "rendement_net_pct": num(rdt.replace("%", "")) if rdt else None,
                           "per": num(per) if per else None}
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brut", required=True)
    a = ap.parse_args()
    fichiers = sorted(f for f in os.listdir(a.brut) if re.fullmatch(r"\d{4}-\d{2}-\d{2}\.txt", f))
    for f in reversed(fichiers):
        r = lire(open(os.path.join(a.brut, f), encoding="utf-8").read())
        if len(r) >= 30:
            json.dump({"_note": "Dernier dividende net, date de paiement, rendement net et PER publiés par la BRVM dans le bulletin officiel de la cote. "
                                "PER absent = bénéfice négatif ou non communiqué.",
                       "source": "BRVM, bulletin officiel de la cote", "bulletin_du": f[:10], "titres": r},
                      SORTIE.open("w", encoding="utf-8"), ensure_ascii=False, indent=1)
            print("ratios", f[:10], len(r), "titres ·", sum(1 for x in r.values() if x["per"]), "avec PER")
            return
    print("aucun bulletin lisible")


if __name__ == "__main__":
    main()
