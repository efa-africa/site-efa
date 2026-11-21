#!/usr/bin/env python3
"""Lit les chiffres clés dans le texte des états financiers (branche brvm-etats-financiers-brut).

1. Sociétés au plan comptable SYSCOHADA : lignes repérées par leur code (XB chiffre d'affaires, XD EBE, XE résultat
   d'exploitation, XI résultat net, CP capitaux propres, DD dettes financières, DZ total du bilan).
2. Banques (plan comptable bancaire), assurances et présentations libres : repérage par libellé
   (produit net bancaire, résultat net, total du bilan…).
Chaque valeur est donnée pour l'exercice (n) et l'exercice précédent (n_1), telle qu'écrite dans le document,
avec l'unité lue (FCFA, milliers, millions) et la méthode (code ou libellé) : le libellé est moins sûr.

Sortie : data/brvm/etats_financiers.json
Usage : python scripts/brvm/etats_financiers_lire.py --ef <dossier ef>
"""
import argparse, csv, glob, json, os, re, unicodedata
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
CODES = {"XB": "chiffre_affaires", "XD": "excedent_brut_exploitation", "XE": "resultat_exploitation",
         "XI": "resultat_net", "CP": "capitaux_propres", "DD": "dettes_financieres", "DZ": "total_bilan"}
TOUS_CODES = r"(?:A[A-Z]|B[A-Z]|C[A-Z]|D[A-Z]|X[A-I]|R[A-S]|T[A-S]|F[A-Q]|Z[A-H])"
LIBELLES = [
    ("chiffre_affaires", r"chiffre d.affaires"),
    ("produit_net_bancaire", r"produit net bancaire"),
    ("resultat_net", r"r[ée]sultat net|b[ée]n[ée]fice net|r[ée]sultat de l.exercice"),
    ("capitaux_propres", r"(total )?capitaux propres"),
    ("excedent_brut_exploitation", r"exc[ée]dent brut d.exploitation"),
    ("resultat_exploitation", r"r[ée]sultat d.exploitation"),
    ("total_bilan", r"total (du )?bilan|total (g[ée]n[ée]ral )?(de l.)?actif\b|total g[ée]n[ée]ral"),
    ("credits_clientele", r"cr[ée]ances sur la client[èe]le|cr[ée]dits [àa] la client[èe]le"),
    ("depots_clientele", r"dettes [àa] l.[ée]gard de la client[èe]le|d[ée]p[ôo]ts de la client[èe]le"),
]
MONTANT = re.compile(r"^\(?-?\d{1,3}(?: \d{3})*(?:,\d+)?\)?$")


def montant(t):
    neg = t.startswith("(") or t.startswith("-")
    v = t.strip("()-").replace(" ", "")
    x = float(v.replace(",", ".")) if "," in v else int(v)
    return -x if neg else x


def montants(segment):
    return [montant(x) for x in re.split(r"\s{2,}", segment.strip()) if MONTANT.match(x)]


def unite(texte):
    t = texte[:20000].lower()
    if re.search(r"en millions|millions de (f|francs)|\(en mfcfa|en m fcfa|mfcfa", t):
        return "millions FCFA"
    if re.search(r"en milliers|milliers de (f|francs)|kfcfa", t):
        return "milliers FCFA"
    return "FCFA"


def lire(texte):
    res = {}
    for l in texte.split("\n"):
        for m in re.finditer(r"(?:^|\s)(" + TOUS_CODES + r")\s", l):
            code = m.group(1)
            if code not in CODES or CODES[code] in res:
                continue
            suite = l[m.end():]
            n = re.search(r"\s" + TOUS_CODES + r"\s+[A-Z]{3,}", suite)  # colonne voisine (passif à droite de l'actif)
            vals = montants(suite[:n.start()] if n else suite)
            if len(vals) >= 2:
                res[CODES[code]] = {"n": vals[-2], "n_1": vals[-1], "methode": "code SYSCOHADA " + code}
            elif len(vals) == 1:
                res[CODES[code]] = {"n": vals[0], "n_1": None, "methode": "code SYSCOHADA " + code}
    for l in texte.split("\n"):
        bas = l.lower()
        for cle, motif in LIBELLES:
            if cle in res:
                continue
            m = re.match(r"\s*(?:[A-Z]{2}\s+)?(?:" + motif + r")", bas)  # libellé en début de ligne
            if not m:
                continue
            reste = l[m.end():]
            d = re.search(r"\s{2,}[(\-]?\d", reste)  # le libellé peut continuer (« de l'ensemble consolidé ») : chiffres après 2 espaces
            if not d or re.search(r"\d", reste[:d.start()]):
                continue
            suite = re.split(r"\s[A-Za-zÀ-ÿ]{2,}", reste[d.start():], maxsplit=1)[0]  # s'arrête à la colonne de texte suivante
            if re.match(r"\s*\d{1,2}(\.\d+)?\s{2,}", suite) and len(montants(suite)) >= 3:
                suite = re.sub(r"^\s*\d{1,2}(\.\d+)?", "", suite)   # numéro de note
            vals = montants(suite)
            if len(vals) >= 2:
                res[cle] = {"n": vals[0], "n_1": vals[1], "methode": "libellé"}
    return res


OCR_LIBELLES = [
    ("chiffre_affaires", "CHIFFREDAFFAIRES"), ("produit_net_bancaire", "PRODUITNETBANCAIRE"),
    ("resultat_net", "RESULTATNET"), ("resultat_net", "BENEFICENET"), ("resultat_net", "RESULTATDELEXERCICE"),
    ("total_bilan", "TOTALDELACTIF"), ("total_bilan", "TOTALACTIF"), ("total_bilan", "TOTALBILAN"),
    ("resultat_exploitation", "RESULTATDEXPLOITATION"), ("excedent_brut_exploitation", "EXCEDENTBRUTDEXPLOITATION"),
    ("credits_clientele", "CREANCESSURLACLIENTELE"), ("depots_clientele", "DETTESALEGARDDELACLIENTELE"),
    ("capitaux_propres", "TOTALCAPITAUXPROPRES"),
]


def deux_nombres(t):
    """Sépare « 136 292268 335] 38 786 306 752 » en deux montants : d'abord sur les filets du tableau (] |),
    sinon en lisant le second montant par la droite (groupes de 3 chiffres)."""
    segs = [x for x in re.split(r"[\]|\[]", t) if re.search(r"\d", x)]
    nombres = []
    for x in segs:
        x = re.sub(r"[^\d\- ]", " ", x).strip()
        if x:
            nombres.append(x)
    if len(nombres) >= 2:
        try:
            return [int(re.sub(r"[^\d]", "", n)) * (-1 if n.lstrip().startswith("-") else 1) for n in nombres[:2]], True
        except ValueError:
            return [], False
    if not nombres:
        return [], False
    g = nombres[0].split()
    droite = []
    while g and len(g[-1]) == 3:
        droite.insert(0, g.pop())
    if g and 1 <= len(g[-1]) <= 3:
        droite.insert(0, g.pop())
    if not g or not droite:
        return [], False
    f = lambda xs: int(re.sub(r"\D", "", "".join(xs))) * (-1 if xs[0].startswith("-") else 1)
    try:
        return [f(g), f(droite)], False
    except ValueError:
        return [], False


def lire_ocr(texte, res):
    lignes = []
    for l in texte.split("\n"):
        l2 = re.sub(r"^[\s\[|(]*\d{0,2}\s*[\[|(]?\s*", "", l)
        m = re.search(r"\d", l2)
        if not m:
            continue
        lettres = re.sub(r"[^A-Z]", "", unicodedata.normalize("NFKD", l2[:m.start()]).encode("ascii", "ignore").decode().upper())
        lignes.append((lettres, l2[m.start():]))
    for cle, lib in OCR_LIBELLES:  # ordre de priorité : RESULTATNET avant RESULTATDELEXERCICE
        if cle in res:
            continue
        for lettres, chiffres in lignes:
            i = lettres.find(lib)
            if i < 0 or i > 2 or len(lettres) > i + len(lib) + 6:
                continue
            vals, sur = deux_nombres(chiffres)
            if len(vals) == 2:
                res[cle] = {"n": vals[0], "n_1": vals[1], "methode": "lecture optique" + ("" if sur else " (colonnes déduites)")}
                break
    return res


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().upper()
    return re.sub(r"[^A-Z0-9 ]", " ", s).split()


def symboles():
    noms = {}
    for f in glob.glob(str(RACINE / "data/brvm/historique/actions_20*.csv")):
        for r in csv.DictReader(open(f, encoding="utf-8")):
            noms.setdefault(r["symbole"], set()).add(r["nom"])
    return noms


def trouver_symbole(societe, noms, alias):
    s = " ".join(norm(societe))
    for k in sorted(alias, key=len, reverse=True):  # « SONATEL » avant « ONATEL »
        if (" " + k.strip() + " ") in (" " + s + " ") or (len(k.strip()) > 6 and k.strip() in s):
            return alias[k]
    mots = set(norm(societe)) - {"CI", "SA", "BF", "SN", "ML", "NG", "BN", "TG", "DE", "LA", "DU"}
    meilleur, score = None, 0
    for sym, ens in noms.items():
        for n in ens:
            m = set(norm(n)) - {"CI", "SA", "BF", "SN", "ML", "NG", "BN", "TG", "DE", "LA", "DU"}
            if not m:
                continue
            sc = len(mots & m) / len(m)
            pays = set(norm(societe)) & {"CI", "BF", "SN", "ML", "NG", "BN", "TG"}
            if pays and not pays & set(norm(n)) and sym.startswith("BOA"):
                sc -= 0.5
            if sc > score:
                meilleur, score = sym, sc
    return meilleur if score >= 0.6 else None


ALIAS = {"BANQUE INTERNATIONALE POUR L INDUSTRIE ET LE COMMERCE DU BENIN": "BICB", "BOA BURKINA": "BOABF", "BOA SN": "BOAS", "BOLLORE": "SDSC", "LNB": "LNBB", "AFRICA GLOBAL": "SDSC", "AFRICA GLOGAL": "SDSC", "TRACTAFRIC": "PRSC", "ERIUM": "SIVC", "AIR LIQUIDE": "SIVC",
         "CORIS BANK": "CBIBF", "ONATEL": "ONTBF", "SONATEL": "SNTS", "BOA BF": "BOABF", "BOA CI": "BOAC", "BOA SENEGAL": "BOAS",
         "BOA S ": "BOAS", "BOA MALI": "BOAM", "BOA ML": "BOAM", "BOA NIGER": "BOAN", "BOA NG": "BOAN", "BOA BENIN": "BOAB", "BOA BN": "BOAB",
         "ECOBANK TRANSNATIONAL": "ETIT", "ETI ": "ETIT", "ECOBANK CI": "ECOC", "ECOBANK COTE": "ECOC", "SOCIETE GENERALE COTE": "SGBC",
         "SGB CI": "SGBC", "SGCI": "SGBC", "BICICI": "BICC", "BICI": "BICC", "BIIC": "BICB", "NSIA BANQUE": "NSBC", "ORANGE COTE": "ORAC", "ORANGE CI": "ORAC",
         "ORAGROUP": "ORGT", "SIB ": "SIBC", "SOCIETE IVOIRIENNE DE BANQUE": "SIBC", "VIVO ENERGY": "SHEC", "TOTALENERGIES MARKETING SENEGAL": "TTLS",
         "TOTAL SENEGAL": "TTLS", "TOTALENERGIES MARKETING COTE": "TTLC", "TOTAL CI": "TTLC", "SONOCO": "SEMC", "EVIOSYS": "SEMC", "SIEM": "SEMC",
         "LOTERIE NATIONALE": "LNBB", "LONAB": "LNBB", "BRIDGE BANK": "BBGC", "SUCRIVOIRE": "SCRC", "SODECI": "SDCC", "SODE CI": "SDCC",
         "SERVAIR": "ABJC", "BERNABE": "BNBC", "SICABLE": "CABC", "CFAO": "CFAC", "NEI CEDA": "NEIC", "PALMCI": "PALC", "PALM CI": "PALC",
         "SETAO": "STAC", "SITAB": "STBC", "SOLIBRA": "SLBC", "SMB": "SMBC", "SOGB": "SOGC", "SAPH": "SPHC", "SAFCA": "SAFC", "SICOR": "SICC",
         "UNILEVER": "UNLC", "UNIWAX": "UNXC", "NESTLE": "NTLC", "FILTISAC": "FTSC", "CIE ": "CIEC", "COMPAGNIE IVOIRIENNE D ELECTRICITE": "CIEC"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ef", required=True)
    a = ap.parse_args()
    idx = json.load(open(os.path.join(a.ef, "index.json"), encoding="utf-8"))["publications"]
    noms = symboles()
    out, stats = [], {"publications": len(idx), "avec_texte": 0, "avec_chiffres": 0, "sans_symbole": set()}
    for pid, e in sorted(idx.items(), key=lambda x: x[1].get("date_publication", ""), reverse=True):
        f = os.path.join(a.ef, "pdf_texte", pid + ".txt")
        txt = open(f, encoding="utf-8").read() if os.path.exists(f) else ""
        if txt.strip():
            stats["avec_texte"] += 1
        chiffres = lire(txt) if txt else {}
        if txt and e.get("ocr"):
            chiffres = lire_ocr(txt, chiffres)
        if chiffres:
            stats["avec_chiffres"] += 1
        m = re.search(r"/(\d{4})(\d{2})(\d{2})_", (e.get("pdf") or [""])[0])
        if m:
            e["date_publication"] = "-".join(m.groups())  # date du fichier déposé sur brvm.org
        sym = trouver_symbole(e["societe"], noms, ALIAS)
        if not sym:
            stats["sans_symbole"].add(e["societe"])
        out.append({"id": pid, "symbole": sym, "societe": e["societe"], "type": e["type"], "document": e["document"],
                    "periode": e.get("periode", ""), "date_publication": e.get("date_publication", ""),
                    "pdf": e.get("pdf", []), "texte_ocr": bool(e.get("ocr")), "unite": unite(txt) if txt else "",
                    "chiffres": chiffres})
    stats["sans_symbole"] = sorted(stats["sans_symbole"])
    json.dump({"_note": "Chiffres lus automatiquement dans les publications des sociétés (brvm.org). n = exercice ou période publiée, "
                        "n_1 = période précédente. methode « libellé » ou texte_ocr = à vérifier sur le PDF avant publication.",
               "source": "BRVM, publications des sociétés cotées", "stats": stats, "publications": out},
              (RACINE / "data/brvm/etats_financiers.json").open("w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(stats, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
