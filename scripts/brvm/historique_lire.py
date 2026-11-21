#!/usr/bin/env python3
"""Lit le texte des bulletins officiels de la cote (branche brvm-historique-brut)
et fabrique l'historique EFA :
  data/brvm/historique/actions_AAAA.csv  (même format que data/brvm/actions.csv)
  data/brvm/historique/indices_AAAA.csv  (même format que data/brvm/indices.csv)

Les séances déjà présentes dans la base quotidienne (actions.csv / indices.csv) ne sont pas
reprises : la base quotidienne fait foi.

Usage : python scripts/brvm/historique_lire.py --brut chemin/vers/brut
"""
import argparse, csv, json, os, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from collecte import CHAMPS_ACTIONS, CHAMPS_INDICES, DOSSIER, nombre, variation_depuis_31_decembre  # noqa: E402

SECT = r"(?:AGR|AUT|CB|CD|DIS|ENE|FIN|IND|SP|SPU|TEL|TRA)"
LIGNE_ACTION = re.compile(r"^(?:\s+(?:" + SECT + r"\s+)?|" + SECT + r"\s+)([A-Z][A-Z0-9]{2,6})\s{2,}(.*)$")
PRINCIPAUX = {"COMPOSITE": "BRVM - COMPOSITE", "30": "BRVM-30", "PRESTIGE": "BRVM - PRESTIGE"}
TABLE_INDICES = re.compile(r"^\s*((?:B?RVM)\s*[-–²\x03]+\s*[A-Z ]+?|BRVM-[A-Z]+)\s*(?:\(\*+\))?\s{2,}(\d+)\s{2,}([\d\s,.]+[.,]\d+)\s{2,}(-?[\d\s,.]*[.,]\d+)\s*%")


def num(t):
    """Nombres des bulletins français (« 11 450 », « 1,59 ») et anglais (« 11,450 », « 1.59 »)."""
    if t is None:
        return None
    t = t.replace("\xa0", " ").replace("%", "").strip()
    if re.fullmatch(r"-?\d{1,3}(,\d{3})+(\.\d+)?", t):
        t = t.replace(",", "")
    try:
        return nombre(t)
    except (ValueError, TypeError):
        return None


ANGLAIS = {"CONSUMER DISCRETIONARY": "CONSOMMATION DISCRETIONNAIRE", "CONSUMER STAPLES": "CONSOMMATION DE BASE",
           "ENERGY": "ENERGIE", "FINANCIALS": "SERVICES FINANCIERS", "INDUSTRIALS": "INDUSTRIELS", "UTILITIES": "SERVICES PUBLICS",
           "FINANCIAL SERVICES": "FINANCES", "INDUSTRY": "INDUSTRIE", "OTHER SECTORS": "AUTRES SECTEURS",
           "TRANSPORTATION": "TRANSPORT", "PUBLIC SERVICES PUBLICS": "SERVICES PUBLICS", "PUBLIC SERVICES": "SERVICES PUBLICS"}


def nom_indice(brut):
    n = re.sub(r"\s+", " ", brut.replace("\x03", " ").strip())
    if n.startswith("RVM"):
        n = "B" + n
    for en, fr in ANGLAIS.items():
        n = re.sub(r"\b%s\b" % en, fr, n)
    if "TOTAL RETURN" in n:
        return "BRVM – COMPOSITE TOTAL RETURN"
    if n.replace(" ", "") in ("BRVM-PRESTIGE", "BRVM-PRINCIPAL"):
        return "BRVM - " + n.replace(" ", "").split("-")[1]
    return re.sub(r"^BRVM\s*[-–²]+\s*", "BRVM - ", n)


def lire_actions(texte, jour):
    out, vus = [], set()
    for l in texte.split("\n"):
        m = LIGNE_ACTION.match(l)
        if not m or m.group(1) == "TOTAL":
            continue
        t = re.split(r"\s{2,}", m.group(2).strip())
        if len(t) < 6:
            continue
        t = [x for x in t if not (x.startswith("(") and len(x) <= 12)]
        nom, reste = t[0], t[1:]
        i_var = next((i for i, x in enumerate(reste) if x.endswith("%")), None)
        if i_var is None or i_var < 3:
            continue
        prec = num(reste[0])
        ouv, clo = reste[i_var - 2], reste[i_var - 1]
        if prec is None or m.group(1) in vus:
            continue
        if clo in ("SP", "NC") or ouv in ("SP", "NC"):
            volume, ouverture, cloture = 0, 0, prec
        else:
            volume = num(reste[i_var + 1]) if len(reste) > i_var + 1 else 0
            ouverture, cloture = num(ouv) or 0, num(clo)
        if cloture is None:
            continue
        vus.add(m.group(1))
        out.append({"date_seance": jour, "symbole": m.group(1), "nom": nom, "volume": volume or 0,
                    "cours_veille": prec, "cours_ouverture": ouverture, "cours_cloture": cloture,
                    "variation_pct": num(reste[i_var])})
    return out


def lire_indices(texte, jour):
    res = {}
    lignes = texte.split("\n")
    # Bandeau : BRVM COMPOSITE / BRVM 30 / BRVM PRESTIGE puis « Variation Jour »
    for i, l in enumerate(lignes[:400]):
        noms = re.findall(r"BRVM (COMPOSITE|30|PRESTIGE)\s+([\d\s,.]+[.,]\d+)", l)
        if len(noms) == 3:
            pos = []
            for x in lignes[i + 1:i + 7]:
                if re.search(r"annuelle|YTD|Annual", x, re.I):
                    break
                for m in re.finditer(r"(-?\d[\d,.]*)\s*%", x):
                    pos.append((m.start(), m.group(1)))
            pos.sort()
            for k, (n, v) in enumerate(noms):
                res[PRINCIPAUX[n]] = (num(v), num(pos[k][1]) if len(pos) == 3 else None)
            break
    ancien = jour < "2025-01-01"
    for l in lignes:
        if re.search(r"SECTORIELS ANCIENS|OLD SECTOR", l, re.I):
            ancien = True
        elif re.search(r"SECTORIELS NOUVEAUX|NEW SECTOR", l, re.I):
            ancien = False
        m = TABLE_INDICES.match(l)
        if m:
            n = nom_indice(m.group(1))
            if n == "BRVM - CONSOMMATION":
                n = "BRVM - CONSOMMATION DISCRETIONNAIRE"
            if n == "BRVM - SERVICES PUBLICS" and ancien:
                n = "BRVM - SERVICES PUBLICS (ancien)"
            if n not in res:
                res[n] = (num(m.group(3)), num(m.group(4)))
    out = []
    for n, (clo, var) in res.items():
        if clo is None:
            continue
        cat = "total_return" if "TOTAL RETURN" in n else ("principal" if n in PRINCIPAUX.values() or n == "BRVM - PRINCIPAL" else "sectoriel")
        veille = round(clo / (1 + var / 100), 2) if var is not None and var > -100 else None
        out.append({"date_seance": jour, "categorie": cat, "indice": n, "cloture_veille": veille, "cloture": clo,
                    "variation_pct": var, "variation_annuelle_pct": variation_depuis_31_decembre(n, clo, int(jour[:4]))})
    return out


def deja(fichier):
    if not fichier.exists():
        return set()
    return {r["date_seance"] for r in csv.DictReader(fichier.open(encoding="utf-8"))}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brut", required=True)
    a = ap.parse_args()
    base_a, base_i = deja(DOSSIER / "actions.csv"), deja(DOSSIER / "indices.csv")
    par_annee = {}
    rapport = {"seances": 0, "sans_actions": [], "sans_indices": [], "ignorees_base_quotidienne": 0}
    for f in sorted(os.listdir(a.brut)):
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}\.txt", f):
            continue
        jour = f[:10]
        if jour in base_a:
            rapport["ignorees_base_quotidienne"] += 1
            continue
        texte = open(os.path.join(a.brut, f), encoding="utf-8").read()
        act, ind = lire_actions(texte, jour), lire_indices(texte, jour)
        if len(act) < 40:
            rapport["sans_actions"].append("%s (%d titres)" % (jour, len(act)))
            continue
        if not any(x["indice"] == "BRVM - COMPOSITE" for x in ind):
            rapport["sans_indices"].append(jour)
        d = par_annee.setdefault(jour[:4], {"a": [], "i": []})
        d["a"] += act
        if jour not in base_i:
            d["i"] += ind
        rapport["seances"] += 1
    sortie = DOSSIER / "historique"
    sortie.mkdir(exist_ok=True)
    # Variation depuis le 31 décembre : base = dernière clôture de l'année précédente si elle est lue,
    # sinon clôture de la première séance ÷ (1 + variation du jour).
    for annee, d in par_annee.items():
        prec = par_annee.get(str(int(annee) - 1))
        base = {}
        if prec:
            for r in sorted(prec["i"], key=lambda r: r["date_seance"]):
                base[r["indice"]] = r["cloture"]
        prem = {}
        for r in sorted(d["i"], key=lambda r: r["date_seance"]):
            prem.setdefault(r["indice"], r)
        for n, r in prem.items():
            if n not in base and r["cloture"] and r["variation_pct"] is not None:
                base[n] = r["cloture"] / (1 + r["variation_pct"] / 100)
        for r in d["i"]:
            b = base.get(r["indice"])
            ref = variation_depuis_31_decembre(r["indice"], r["cloture"], int(annee))
            r["variation_annuelle_pct"] = ref if ref is not None else (round((r["cloture"] / b - 1) * 100, 2) if b and r["cloture"] else None)
    for annee, d in par_annee.items():
        for nom, champs, lignes in (("actions", CHAMPS_ACTIONS, d["a"]), ("indices", CHAMPS_INDICES, d["i"])):
            with (sortie / ("%s_%s.csv" % (nom, annee))).open("w", encoding="utf-8", newline="") as fo:
                w = csv.DictWriter(fo, fieldnames=champs)
                w.writeheader()
                w.writerows(lignes)
    # Clôture du 31 décembre précédent, quand l'année précédente n'est pas lue :
    # c'est le « cours précédent » de la première séance de l'année.
    for f in sortie.glob("actions_*-12-31.csv"):
        f.unlink()
    for annee, d in par_annee.items():
        if str(int(annee) - 1) in par_annee:
            continue
        prem = min((r["date_seance"] for r in d["a"]), default=None)
        if prem and prem[5:] <= "01-05":
            fin = "%d-12-31" % (int(annee) - 1)
            lignes = [{"date_seance": fin, "symbole": r["symbole"], "nom": r["nom"], "volume": 0, "cours_veille": "",
                       "cours_ouverture": "", "cours_cloture": r["cours_veille"], "variation_pct": ""}
                      for r in d["a"] if r["date_seance"] == prem]
            with (sortie / ("actions_%s.csv" % fin)).open("w", encoding="utf-8", newline="") as fo:
                w = csv.DictWriter(fo, fieldnames=CHAMPS_ACTIONS)
                w.writeheader()
                w.writerows(lignes)
            rapport["cloture_%s" % fin] = len(lignes)
    print(json.dumps(rapport, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
