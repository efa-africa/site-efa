# Base de relevés BRVM d'EFA

Alimentée automatiquement chaque jour ouvré par le robot « Collecte BRVM » (`.github/workflows/brvm-collecte.yml`).

- `actions.csv` : une ligne par titre et par séance (volume, cours veille, ouverture, clôture, variation %).
- `indices.csv` : indices principaux, sectoriels et total return, par séance.
- `archives/AAAA-MM-JJ/` : pages brvm.org d'origine (compressées), pour vérifier chaque chiffre.
- `syntheses/AAAA-MM-JJ.md` : synthèse de la semaine, produite chaque samedi.

Source : BRVM, cours de clôture officiels publiés sur brvm.org. Usage pédagogique ;
ne constitue pas un conseil en investissement. Sonatel est exclue des contenus publiés par EFA,
pas de la base.

Relance manuelle : onglet Actions du dépôt → « Collecte BRVM » → Run workflow.
Synthèse sur une autre période : `python scripts/brvm/semaine.py --fin AAAA-MM-JJ --jours 30`.

## Onglet Marchés

`scripts/brvm/marches.py` (lancé après chaque collecte) fabrique `data/marches/` : `jour.json`, `societes.json`, `fiches/[CODE].json`, `calendrier.json`.
Référentiel à compléter par EFA : `data/brvm/societes.json` (secteur, nombre d’actions, flottant, date d’introduction, site, texte_efa), avec une source dans `data/brvm/sources.json`. `texte_efa` est bloqué pour SNTS et ORAC : la génération échoue s’il est rempli. Calendrier : `data/brvm/evenements.json`. Historique antérieur : `data/brvm/historique/actions_AAAA.csv` (même format que actions.csv).

## Historique depuis le 2 janvier 2024

`historique/actions_AAAA.csv` et `historique/indices_AAAA.csv` (2024, 2025, 2026 jusqu'au 22 octobre) : séances reconstituées à partir des bulletins officiels de la cote (BOC) de la BRVM ; la base quotidienne prend le relais à partir du 23 octobre 2026.
`historique/actions_2023-12-31.csv` : clôture du 31 décembre 2023 (cours précédent de la séance du 2 janvier 2024).
Indices sectoriels : anciens secteurs jusqu'à fin 2025 (Agriculture, Distribution, Finances, Industrie, Transport, Autres secteurs, « Services publics (ancien) »), nouveaux secteurs à partir de 2025 (base 100 au 2 janvier 2025).
Texte des bulletins : branche `brvm-historique-brut` (robot « Historique BRVM », lancement manuel). Lecture : `python scripts/brvm/historique_lire.py --brut <dossier brut>`.
Contrôles : BRVM Composite 2024 +28,90 %, 2025 +25,26 % (chiffres officiels retrouvés) ; raccord exact entre années et avec la base quotidienne.
Jours ouvrés sans bulletin trouvé : 12 en 2024, 13 en 2025, 11 en 2026, fériés pour la plupart (liste dans `brut/index.json` de la branche).
