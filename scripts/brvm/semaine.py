#!/usr/bin/env python3
"""Synthèse de la semaine (ou du mois) à la BRVM, à partir de la base de relevés EFA.

Produit data/brvm/syntheses/AAAA-MM-JJ.md : matière brute pour rédiger « La semaine à la BRVM ».
Sonatel (SNTS) est exclue des palmarès publiés (règle EFA) mais reste dans la base.

Usage : python scripts/brvm/semaine.py [--fin AAAA-MM-JJ] [--jours 7]
"""
import argparse, csv, datetime as dt
from collections import defaultdict
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
DOSSIER = RACINE / "data" / "brvm"
EXCLUS = {"SNTS"}


def lire(f):
    with f.open(encoding="utf-8") as h:
        return list(csv.DictReader(h))


def num(x):
    return float(x) if x not in ("", None) else None


def pct(a, b):
    return (b / a - 1) * 100 if a and b else None


def f2(x, d=2):
    return "n.d." if x is None else f"{x:+.{d}f} %".replace(".", ",")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--fin", default=dt.date.today().isoformat())
    p.add_argument("--jours", type=int, default=7)
    a = p.parse_args()
    fin = dt.date.fromisoformat(a.fin)
    debut = fin - dt.timedelta(days=a.jours - 1)

    act = [r for r in lire(DOSSIER / "actions.csv") if debut.isoformat() <= r["date_seance"] <= fin.isoformat()]
    ind = [r for r in lire(DOSSIER / "indices.csv") if debut.isoformat() <= r["date_seance"] <= fin.isoformat()]
    seances = sorted({r["date_seance"] for r in act})
    if not seances:
        raise SystemExit("Aucune séance sur la période.")
    s0, s1 = seances[0], seances[-1]

    lignes = [f"# La BRVM du {s0} au {s1}", "",
              f"Séances couvertes : {len(seances)} ({', '.join(seances)})", "",
              "Source : BRVM, cours de clôture officiels (brvm.org), relevés EFA.",
              "Contenu pédagogique, ne constitue pas un conseil en investissement.", ""]

    # Indices : variation sur la période = clôture de la dernière séance / clôture veille de la première
    lignes += ["## Indices", "", "| Indice | Début | Fin | Variation période |", "|---|---|---|---|"]
    par_indice = defaultdict(dict)
    for r in ind:
        par_indice[(r["categorie"], r["indice"])][r["date_seance"]] = r
    for cat in ("principal", "sectoriel"):
        for (c, nom), jours in sorted(par_indice.items()):
            if c != cat:
                continue
            j = sorted(jours)
            v0, v1 = num(jours[j[0]]["cloture_veille"]), num(jours[j[-1]]["cloture"])
            lignes.append(f"| {nom} | {v0} | {v1} | {f2(pct(v0, v1))} |")
    lignes.append("")

    # Actions : variation sur la période et volumes cumulés
    par_titre = defaultdict(dict)
    for r in act:
        par_titre[r["symbole"]][r["date_seance"]] = r
    perf = []
    for sym, jours in par_titre.items():
        j = sorted(jours)
        v0, v1 = num(jours[j[0]]["cours_veille"]), num(jours[j[-1]]["cours_cloture"])
        vol = sum(num(jours[d]["volume"]) or 0 for d in j)
        perf.append((sym, jours[j[-1]]["nom"], v0, v1, pct(v0, v1), vol))
    publiables = [x for x in perf if x[0] not in EXCLUS and x[4] is not None]
    publiables.sort(key=lambda x: x[4], reverse=True)

    def tableau(titre, rows):
        out = [f"## {titre}", "", "| Titre | Cours début | Cours fin | Variation | Volume cumulé |", "|---|---|---|---|---|"]
        mille = lambda x: f"{int(x):,}".replace(",", " ")
        out += [f"| {n} ({s}) | {mille(v0)} | {mille(v1)} | {f2(v)} | {mille(vol)} |" for s, n, v0, v1, v, vol in rows]
        return out + [""]

    lignes += tableau("Plus fortes hausses", publiables[:5])
    lignes += tableau("Plus fortes baisses", publiables[::-1][:5])
    lignes += tableau("Titres les plus échangés (volume)", sorted(
        [x for x in perf if x[0] not in EXCLUS and x[4] is not None], key=lambda x: x[5], reverse=True)[:5])
    hausse = sum(1 for x in publiables if x[4] > 0)
    baisse = sum(1 for x in publiables if x[4] < 0)
    lignes += [f"Titres en hausse : {hausse} · en baisse : {baisse} · stables : {len(publiables) - hausse - baisse}",
               "", f"(Sonatel exclue des palmarès : règle EFA.)"]

    sortie = DOSSIER / "syntheses" / f"{s1}.md"
    sortie.parent.mkdir(parents=True, exist_ok=True)
    sortie.write_text("\n".join(lignes) + "\n", encoding="utf-8")
    print(sortie.relative_to(RACINE))


if __name__ == "__main__":
    main()
