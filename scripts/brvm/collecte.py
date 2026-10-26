#!/usr/bin/env python3
"""Robot de collecte BRVM d'EFA.

Chaque jour ouvré après la clôture :
  1. lit les pages publiques de brvm.org (cours des actions, indices) ;
  2. ajoute la séance aux bases data/brvm/actions.csv et data/brvm/indices.csv
     (une séance n'est jamais enregistrée deux fois) ;
  3. archive les pages brutes (data/brvm/archives/AAAA-MM-JJ/*.html.gz) ;
  4. met à jour le bloc « brvm » de donnees.js, qui alimente la barre EFA · BRVM du site.

Garde-fous : rien n'est écrit si la séance est encore ouverte, si la date est
introuvable ou si les tableaux sont incomplets. En cas d'échec, le script sort
en erreur pour que GitHub signale l'échec.

Usage : python scripts/brvm/collecte.py [--fichiers actions.html indices.html]
"""
import argparse, csv, datetime as dt, gzip, json, os, re, sys, unicodedata
from pathlib import Path

from bs4 import BeautifulSoup

RACINE = Path(__file__).resolve().parents[2]
DOSSIER = RACINE / "data" / "brvm"
URL_ACTIONS = "https://www.brvm.org/fr/cours-actions/0"
URL_INDICES = "https://www.brvm.org/fr/indices"

MOIS = {"janvier":1,"fevrier":2,"mars":3,"avril":4,"mai":5,"juin":6,"juillet":7,
        "aout":8,"septembre":9,"octobre":10,"novembre":11,"decembre":12}

# Libellés EFA des indices sectoriels (comme sur le site)
SECTEURS = {
    "CONSOMMATION DE BASE": "Consommation de base",
    "CONSOMMATION DISCRETIONNAIRE": "Consommation discrétionnaire",
    "ENERGIE": "Énergie",
    "INDUSTRIELS": "Industriels",
    "SERVICES FINANCIERS": "Services financiers",
    "SERVICES PUBLICS": "Services publics",
    "TELECOMMUNICATIONS": "Télécommunications",
}
INDICES_PRINCIPAUX = [("COMPOSITE", "BRVM Composite"), ("30", "BRVM 30"),
                      ("PRESTIGE", "BRVM Prestige"), ("PRINCIPAL", "BRVM Principal")]

CHAMPS_ACTIONS = ["date_seance", "symbole", "nom", "volume", "cours_veille",
                  "cours_ouverture", "cours_cloture", "variation_pct"]
CHAMPS_INDICES = ["date_seance", "categorie", "indice", "cloture_veille", "cloture",
                  "variation_pct", "variation_annuelle_pct"]


def sans_accents(t):
    return "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")


def nombre(t):
    """« 3 080 » → 3080 ; « -2,38 » → -2.38 ; vide → None."""
    t = (t or "").replace("\xa0", "").replace(" ", "").replace(" ", "").replace("%", "")
    t = t.replace("–", "-").replace("−", "-").replace(",", ".")
    if t in ("", "-", "--"):
        return None
    v = float(t)
    return int(v) if v.is_integer() and "." not in t else v


def date_seance(soup):
    """Date de la séance, lue dans « Dernière mise à jour : Jeudi, 22 octobre, 2026 - 21:02 »."""
    texte = sans_accents(soup.get_text(" ", strip=True)).lower()
    m = re.search(r"derniere mise a jour\s*:?\s*\w+,?\s*(\d{1,2})\s+([a-z]+),?\s*(\d{4})", texte)
    if not m or m.group(2) not in MOIS:
        raise SystemExit("ERREUR : date de séance introuvable sur la page.")
    return dt.date(int(m.group(3)), MOIS[m.group(2)], int(m.group(1)))


def seance_ouverte(soup):
    texte = sans_accents(soup.get_text(" ", strip=True)).lower()
    return "seance ouverte" in texte and "seance fermee" not in texte


def tableaux(soup):
    """Liste de (en-têtes normalisés, lignes de cellules texte)."""
    res = []
    for t in soup.find_all("table"):
        lignes = [[c.get_text(" ", strip=True) for c in tr.find_all(["th", "td"])] for tr in t.find_all("tr")]
        lignes = [l for l in lignes if any(l)]
        if not lignes:
            continue
        entetes = [sans_accents(x).lower() for x in lignes[0]]
        res.append((entetes, lignes[1:]))
    return res


def lire_actions(soup, jour):
    for entetes, lignes in tableaux(soup):
        if entetes and entetes[0].startswith("symbole") and any("cloture" in e for e in entetes):
            out = []
            for l in lignes:
                if len(l) < 7 or not re.fullmatch(r"[A-Z]{3,6}", l[0].strip()):
                    continue
                out.append({"date_seance": jour.isoformat(), "symbole": l[0].strip(), "nom": l[1].strip(),
                            "volume": nombre(l[2]), "cours_veille": nombre(l[3]),
                            "cours_ouverture": nombre(l[4]), "cours_cloture": nombre(l[5]),
                            "variation_pct": nombre(l[6])})
            return out
    return []


def lire_indices(soup, jour):
    out = []
    for entetes, lignes in tableaux(soup):
        if not entetes or not any(k in e for e in entetes for k in ("cloture", "closing", "fermeture")):
            continue
        for l in lignes:
            if len(l) < 4:
                continue
            nom = sans_accents(l[0]).upper().replace("–", "-")
            if "BRVM" not in nom:
                continue
            categorie = "total_return" if "TOTAL RETURN" in nom else (
                "sectoriel" if any(s in nom for s in SECTEURS) else "principal")
            out.append({"date_seance": jour.isoformat(), "categorie": categorie, "indice": l[0].strip(),
                        "cloture_veille": nombre(l[1]), "cloture": nombre(l[2]),
                        "variation_pct": nombre(l[3]),
                        "variation_annuelle_pct": nombre(l[4]) if len(l) > 4 else None})
    return out


def deja_enregistree(fichier, jour):
    if not fichier.exists():
        return False
    with fichier.open(encoding="utf-8") as f:
        return any(r["date_seance"] == jour.isoformat() for r in csv.DictReader(f))


def ajouter(fichier, champs, lignes):
    neuf = not fichier.exists()
    with fichier.open("a", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=champs)
        if neuf:
            w.writeheader()
        w.writerows(lignes)


def js(v):
    return json.dumps(v, ensure_ascii=False)


def maj_donnees_js(jour, actions, indices):
    """Réécrit uniquement le bloc « brvm: { … } » de donnees.js."""
    chemin = RACINE / "donnees.js"
    src = chemin.read_text(encoding="utf-8")
    debut = src.index("  brvm: {")
    fin = src.index("\n  pays:", debut)
    ancien = src[debut:fin]
    # Noms et pays déjà soignés à la main sur le site : on les garde.
    connus = {m[0]: (m[1], m[2]) for m in re.findall(r'\["([A-Z]+)","([^"]+)","([A-Z]{2})"', ancien)}
    d = jour.strftime("%d/%m/%Y")
    principaux = []
    for cle, libelle in INDICES_PRINCIPAUX:
        for i in indices:
            n = sans_accents(i["indice"]).upper()
            if i["categorie"] == "principal" and re.search(r"\b" + cle + r"\b", n):
                principaux.append([libelle, i["cloture_veille"], i["cloture"], i["variation_pct"]])
                break
    secteurs = []
    for i in indices:
        if i["categorie"] != "sectoriel":
            continue
        n = sans_accents(i["indice"]).upper()
        for cle, libelle in SECTEURS.items():
            if cle in n:
                secteurs.append([libelle, i["cloture"], i["variation_pct"]])
    secteurs.sort(key=lambda s: sans_accents(s[0]))
    lignes = []
    for a in sorted(actions, key=lambda a: a["symbole"]):
        if a["symbole"] in ("SNTS", "ORAC"):  # règles éditoriales d'EFA : jamais publiées sur le site
            continue
        nom, pays = connus.get(a["symbole"], (a["nom"].title(), ""))
        lignes.append("[" + ",".join(js(x) for x in [a["symbole"], nom, pays, a["cours_cloture"], a["variation_pct"]]) + "]")
    actions_js = ",\n      ".join(", ".join(lignes[i:i + 2]) for i in range(0, len(lignes), 2))
    bloc = (
        "  brvm: {\n"
        f'    seance: "{d}",\n'
        f'    source: "BRVM, cours de clôture du {d}",\n'
        "    capitalisation: null,\n"
        "    // [nom, clôture précédente, clôture, variation % du jour]\n"
        "    indices: [\n      " + ",\n      ".join(js(x) for x in principaux) + "\n    ],\n"
        "    secteurs: [\n      " + ",\n      ".join(js(x) for x in secteurs) + "\n    ],\n"
        "    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]\n"
        "    actions: [\n      " + actions_js + "\n    ]\n"
        "  },\n"
    )
    chemin.write_text(src[:debut] + bloc + src[fin:], encoding="utf-8")


def telecharger(url):
    import requests
    r = requests.get(url, timeout=60, headers={"User-Agent": "EFA-collecte-BRVM/1.0 (+https://efa.africa)"})
    r.raise_for_status()
    return r.text


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--fichiers", nargs=2, metavar=("ACTIONS", "INDICES"),
                   help="pages déjà enregistrées (tests), au lieu de brvm.org")
    p.add_argument("--sans-site", action="store_true", help="ne pas toucher à donnees.js")
    p.add_argument("--verifier", action="store_true", help="lire et contrôler sans rien écrire (même séance ouverte)")
    a = p.parse_args()

    if a.fichiers:
        html_a, html_i = (Path(f).read_text(encoding="utf-8") for f in a.fichiers)
    else:
        html_a, html_i = telecharger(URL_ACTIONS), telecharger(URL_INDICES)
    sa, si = BeautifulSoup(html_a, "html.parser"), BeautifulSoup(html_i, "html.parser")

    if a.verifier:
        d = DOSSIER / "_verification"
        d.mkdir(parents=True, exist_ok=True)
        (d / "actions.html").write_text(html_a, encoding="utf-8")
        (d / "indices.html").write_text(html_i, encoding="utf-8")
        try:
            jour = date_seance(sa)
            act, ind = lire_actions(sa, jour), lire_indices(si, jour)
            rapport = f"ouverte={seance_ouverte(sa)} date={jour} actions={len(act)} indices={len(ind)}\n"
            rapport += "\n".join(map(str, act[:3] + ind[:8]))
        except SystemExit as e:
            rapport = str(e)
        rapport += "\nTABLEAUX: " + repr([(e, len(l)) for e, l in tableaux(sa)] + [(e, len(l)) for e, l in tableaux(si)])
        (d / "rapport.txt").write_text(rapport, encoding="utf-8")
        print(rapport)
        return
    if seance_ouverte(sa):
        print("Séance encore ouverte : rien n'est enregistré.")
        return
    jour = date_seance(sa)
    actions, indices = lire_actions(sa, jour), lire_indices(si, jour)

    # Contrôles de cohérence avant toute écriture
    if len(actions) < 40:
        raise SystemExit(f"ERREUR : {len(actions)} actions lues (au moins 40 attendues).")
    if not any("COMPOSITE" in sans_accents(i["indice"]).upper() and i["categorie"] == "principal" for i in indices):
        raise SystemExit("ERREUR : BRVM Composite introuvable.")
    if sum(a_["cours_cloture"] is None for a_ in actions) > 5:
        raise SystemExit("ERREUR : trop de cours de clôture vides.")
    try:
        if date_seance(si) != jour:
            print(f"Attention : la page des indices n'est pas datée du {jour} ; indices non enregistrés.")
            indices = []
    except SystemExit:
        pass

    DOSSIER.mkdir(parents=True, exist_ok=True)
    f_act, f_ind = DOSSIER / "actions.csv", DOSSIER / "indices.csv"
    if deja_enregistree(f_act, jour):
        print(f"Séance du {jour} déjà enregistrée.")
        return
    ajouter(f_act, CHAMPS_ACTIONS, actions)
    if indices:
        ajouter(f_ind, CHAMPS_INDICES, indices)

    arch = DOSSIER / "archives" / jour.isoformat()
    arch.mkdir(parents=True, exist_ok=True)
    for nom, html in (("actions", html_a), ("indices", html_i)):
        with gzip.open(arch / f"{nom}.html.gz", "wt", encoding="utf-8") as g:
            g.write(html)

    if not a.sans_site and indices:
        maj_donnees_js(jour, actions, indices)
    print(f"Séance du {jour} enregistrée : {len(actions)} actions, {len(indices)} indices.")
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a") as g:
            g.write(f"seance={jour.isoformat()}\n")


if __name__ == "__main__":
    main()
