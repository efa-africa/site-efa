#!/usr/bin/env python3
"""Lit dans les bulletins officiels de la cote (texte, branche brvm-historique-brut) :
  - « Opérations en cours » : paiements de dividendes, fractionnements, premières cotations, augmentations de capital… ;
  - « Avis » : avis de la BRVM et du dépositaire (DC/BR) : paiements d'intérêts, remboursements, suspensions… ;
  - « Communiqués » : publications des sociétés (états financiers, rapports d'activité, convocations d'assemblées, notations…).
Chaque élément est gardé une fois, avec la première séance où il apparaît.

Sortie : data/brvm/evenements_bulletins.json
Usage : python scripts/brvm/historique_evenements.py --brut <dossier brut>
"""
import argparse, json, os, re
from pathlib import Path

DOSSIER = Path(__file__).resolve().parents[2] / "data" / "brvm"
TITRES = {
    "operations": re.compile(r"^\s*(OPERATIONS EN COURS|UPCOMING OPERATIONS)\s*$"),
    "avis": re.compile(r"^\s*(AVIS|NOTICES)\s*$"),
    "communiques": re.compile(r"^\s*(COMMUNIQUES|RELEASES|PRESS RELEASES)\s*$"),
}
FIN = re.compile(r"^\s*(\d{1,3}|MARCHE DES|EQUITY MARKET|OBLIGATIONS|BONDS|OPCVM|Légende|Legend)\b")
ENTETE = re.compile(r"^\s*(Emetteur|Entité|Issuer|Entity)\s{2,}")


def nettoyer(t):
    return re.sub(r"\s+", " ", t.replace("''", "'")).strip()


def sections(texte):
    """Renvoie {section: [lignes]} pour les trois sections, sur la page où elles se trouvent."""
    out, cur = {}, None
    for l in texte.split("\n"):
        nom = next((k for k, r in TITRES.items() if r.match(l)), None)
        if nom:
            cur = nom
            out.setdefault(cur, [])
            continue
        if cur is None:
            continue
        if FIN.match(l) and not l.startswith("  ") or re.match(r"^\s+\d{1,3}\s*$", l):
            cur = None
            continue
        if ENTETE.match(l):
            continue
        out[cur].append(l)
    return out


def entrees(lignes, colonnes):
    """Regroupe les lignes en entrées : une ligne qui commence en colonne 0 ouvre une entrée ; les lignes suivantes
    complètent la colonne dont elles sont le plus proches (position dans la page)."""
    res, cur, pos = [], None, []
    for l in lignes:
        if not l.strip():
            continue
        morceaux = [(m.start(), m.group(0)) for m in re.finditer(r"\S+(?: \S+)*", l)]
        if not l.startswith(" ") or cur is None:
            if len(morceaux) < 2:
                if cur:
                    cur[-1] += " " + morceaux[0][1]
                continue
            parts = [x[1] for x in morceaux]
            pos = [x[0] for x in morceaux][:colonnes]
            cur = parts[:colonnes - 1] + [" ".join(parts[colonnes - 1:])] if len(parts) >= colonnes else parts + [""] * (colonnes - len(parts))
            pos += [10 ** 6] * (colonnes - len(pos))
            res.append(cur)
        else:
            for x, t in morceaux:
                k = min(range(len(pos)), key=lambda i: abs(pos[i] - x)) if pos else colonnes - 1
                cur[k] += " " + t
    return [[nettoyer(x) for x in e] for e in res]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brut", required=True)
    a = ap.parse_args()
    vus = {}
    for f in sorted(os.listdir(a.brut)):
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}\.txt", f):
            continue
        jour = f[:10]
        sec = sections(open(os.path.join(a.brut, f), encoding="utf-8").read())
        for e in entrees(sec.get("operations", []), 2):
            cle = ("operation", e[0], e[1])
            if cle not in vus:
                vus[cle] = {"type": "operation", "emetteur": e[0], "texte": e[1], "vu_le": jour}
        for nom, typ in (("avis", "avis"), ("communiques", "communique")):
            for e in entrees(sec.get(nom, []), 4):
                cle = (typ, e[0], e[1])
                if cle not in vus:
                    vus[cle] = {"type": typ, "emetteur": e[0], "numero": e[1], "nature": e[2], "objet": e[3], "vu_le": jour}
    evts = sorted(vus.values(), key=lambda x: (x["vu_le"], x["type"], x["emetteur"]))
    # Dates annoncées dans le texte (paiement le 27/10/2026, première cotation le 17 novembre 2026…)
    mois = {m: i + 1 for i, m in enumerate(["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"])}
    for e in evts:
        t = e.get("texte") or e.get("objet") or ""
        m = re.search(r"le (\d{1,2})/(\d{1,2})/(\d{4})", t) or re.search(r"le (\d{1,2})(?:er)? (" + "|".join(mois) + r") (\d{4})", t)
        if m:
            mo = int(m.group(2)) if m.group(2).isdigit() else mois[m.group(2)]
            e["date_annoncee"] = "%s-%02d-%02d" % (m.group(3), mo, int(m.group(1)))
    json.dump({"_note": "Opérations en cours, avis et communiqués lus dans les bulletins officiels de la cote ; vu_le = première séance où l'élément apparaît ; date_annoncee = date lue dans le texte quand il en donne une.",
               "source": "BRVM, bulletins officiels de la cote", "evenements": evts},
              (DOSSIER / "evenements_bulletins.json").open("w", encoding="utf-8"), ensure_ascii=False, indent=1)
    from collections import Counter
    print(len(evts), Counter(e["type"] for e in evts), Counter(e["vu_le"][:4] for e in evts))


if __name__ == "__main__":
    main()
