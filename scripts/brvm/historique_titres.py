#!/usr/bin/env python3
"""Lit dans les bulletins officiels de la cote (texte, branche brvm-historique-brut) :
  - les obligations cotées : cours, coupon couru, périodicité et montant du coupon, prochaine échéance, amortissement ;
  - les OPCVM (FCP, SICAV) : société de gestion, dépositaire, catégorie, valeur d'origine, valeurs liquidatives.

Sorties (une ligne par titre ou fonds et par séance) :
  data/brvm/historique/obligations_AAAA.csv
  data/brvm/historique/opcvm_AAAA.csv
Usage : python scripts/brvm/historique_titres.py --brut <dossier brut>
"""
import argparse, csv, os, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from historique_lire import num  # noqa: E402

DOSSIER = Path(__file__).resolve().parents[2] / "data" / "brvm" / "historique"
MOIS = {"janv": 1, "févr": 2, "fevr": 2, "mars": 3, "avr": 4, "mai": 5, "juin": 6, "juil": 7, "août": 8, "aout": 8, "sept": 9, "oct": 10, "nov": 11, "déc": 12, "dec": 12,
        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, "jul": 7, "aug": 8, "sep": 9}
OBLIG = re.compile(r"^\s*([A-Z][A-Z0-9]{1,8}\.[A-Z]{1,3}\d{1,3}[A-Z]?)\s{2,}(.*)$")
CH_O = ["date_seance", "symbole", "titre", "valeur_nominale", "cours_precedent", "cours_jour", "cours_reference", "volume", "valeur",
        "coupon_couru", "periodicite", "coupon_net", "prochaine_echeance", "amortissement"]
CH_F = ["date_seance", "societe_gestion", "depositaire", "opcvm", "categorie", "valeur_origine", "vl_precedente", "date_vl_precedente",
        "vl", "date_vl", "date_creation", "perf_origine_pct", "perf_precedente_pct"]


def date_courte(t):
    m = re.fullmatch(r"(\d{1,2})[- ]([A-Za-zéû]+)\.?[- ](\d{2})", t.strip())
    if not m:
        return t.strip()
    mo = MOIS.get(m.group(2).lower()[:4].rstrip(".")) or MOIS.get(m.group(2).lower()[:3])
    return "20%s-%02d-%02d" % (m.group(3), mo, int(m.group(1))) if mo else t.strip()


def date_fr(t):
    m = re.fullmatch(r"(\d{2})/(\d{2})/(\d{2,4})", t.strip())
    if not m:
        return ""
    a = m.group(3) if len(m.group(3)) == 4 else "20" + m.group(3)
    return "%s-%s-%s" % (a, m.group(2), m.group(1))


def lire_obligations(texte, jour):
    out, vus = [], set()
    for l in texte.split("\n"):
        m = OBLIG.match(l)
        if not m or m.group(1) in vus:
            continue
        t = [x for x in re.split(r"\s{2,}", m.group(2).strip()) if not (x.startswith("(") and len(x) <= 6)]
        i_per = next((i for i, x in enumerate(t) if x in ("A", "S", "T", "M", "B")), None)
        if i_per is None or i_per < 4:
            continue
        titre, avant = t[0], t[1:i_per]
        apres = t[i_per + 1:]
        if len(avant) < 4:
            continue
        nominal, prec, jour_c, ref = avant[0], avant[1], avant[2], avant[3]
        reste = avant[4:]
        couru = reste[-1] if reste else ""
        vol, val = (reste[0], reste[1]) if len(reste) >= 3 else ("", "")
        coupon = apres[0] if apres else ""
        ech = date_courte(apres[1]) if len(apres) > 1 else ""
        amort = apres[2] if len(apres) > 2 else ""
        vus.add(m.group(1))
        out.append({"date_seance": jour, "symbole": m.group(1), "titre": titre.replace("''", "'"), "valeur_nominale": num(nominal),
                    "cours_precedent": num(prec), "cours_jour": num(jour_c) if jour_c not in ("NC", "NT") else "", "cours_reference": num(ref),
                    "volume": num(vol) or "", "valeur": num(val) or "", "coupon_couru": num(couru), "periodicite": t[i_per],
                    "coupon_net": num(coupon), "prochaine_echeance": ech, "amortissement": amort})
    return out


def lire_opcvm(texte, jour):
    out = []
    lignes = texte.split("\n")
    dans, soc, dep, groupe, p_dep = False, "", "", [], None
    for l in lignes:
        if "OPCVM: FONDS COMMUNS" in l or "MUTUAL FUNDS" in l.upper():
            dans = True
            continue
        if "Sociétés de gestion" in l or "Management companies" in l or "Asset managers" in l:
            p_dep = max(l.find("Dépositaire"), l.find("Custodian"))
            p_dep = p_dep if p_dep > 0 else None
            continue
        if not dans:
            continue
        if l.startswith("OPCVM : Organisme") or re.match(r"^\s*Légende|^\s*Legend", l):
            dans = False
            continue
        m = re.search(r"\b((?:FCP|FCPE|FCPR|SICAV|FCTC|FONDS|OBLIG|FCPCT)\b.*?)\s{2,}([A-Z]{1,5})\s{2,}([\d ]+)\s{2,}(.*)$", l)
        if not m:
            continue
        debut = l[:m.start(1)]
        cols = [x for x in re.split(r"\s{2,}", debut.strip()) if x]
        if not l.startswith(" ") and len(cols) >= 2:
            soc, dep, groupe = cols[0], cols[1], []
        elif not l.startswith(" ") and len(cols) == 1:
            # suite du nom de la société de gestion (« AFRICABOURSE ASSET » / « MANAGEMENT »)
            soc = soc + " " + cols[0]
            for x in groupe:
                x["societe_gestion"] = soc.strip()
        r = re.split(r"\s{2,}", m.group(4).strip())
        vp, dvp = (r[0], r[1]) if len(r) > 1 else ("", "")
        va, dva = (r[2], r[3]) if len(r) > 3 else ("", "")
        cr = r[4] if len(r) > 4 else ""
        po = r[5] if len(r) > 5 else ""
        pp = r[6] if len(r) > 6 else ""
        ligne = {"date_seance": jour, "societe_gestion": soc.strip(), "depositaire": dep, "opcvm": re.sub(r"\s+", " ", m.group(1)).strip(),
                    "categorie": m.group(2), "valeur_origine": num(m.group(3)), "vl_precedente": num(vp) if vp != "ND" else "",
                    "date_vl_precedente": date_fr(dvp), "vl": num(va) if va not in ("ND", "") else "", "date_vl": date_fr(dva),
                    "date_creation": date_fr(cr), "perf_origine_pct": num(po.replace("%", "")) if po not in ("-", "") else "",
                    "perf_precedente_pct": num(pp.replace("%", "")) if pp not in ("-", "") else ""}
        out.append(ligne)
        groupe.append(ligne)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brut", required=True)
    a = ap.parse_args()
    par = {}
    n = {"obligations": 0, "opcvm": 0, "seances": 0}
    for f in sorted(os.listdir(a.brut)):
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}\.txt", f):
            continue
        jour = f[:10]
        t = open(os.path.join(a.brut, f), encoding="utf-8").read()
        d = par.setdefault(jour[:4], {"o": [], "f": []})
        o, fo = lire_obligations(t, jour), lire_opcvm(t, jour)
        d["o"] += o
        d["f"] += fo
        n["obligations"] += len(o); n["opcvm"] += len(fo); n["seances"] += 1
    DOSSIER.mkdir(exist_ok=True)
    for annee, d in par.items():
        for nom, ch, lignes in (("obligations", CH_O, d["o"]), ("opcvm", CH_F, d["f"])):
            with (DOSSIER / ("%s_%s.csv" % (nom, annee))).open("w", encoding="utf-8", newline="") as fo:
                w = csv.DictWriter(fo, fieldnames=ch)
                w.writeheader()
                w.writerows(lignes)
    print(n)


if __name__ == "__main__":
    main()
