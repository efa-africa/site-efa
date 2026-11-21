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

## Historique depuis le 1er janvier 2026

`historique/actions_2026.csv` et `historique/indices_2026.csv` : séances du 2 janvier au 22 octobre 2026, reconstituées à partir des bulletins officiels de la cote (BOC) de la BRVM.
`historique/actions_2025-12-31.csv` : clôture du 31 décembre 2025 (cours précédent de la séance du 2 janvier), pour les performances depuis le 1er janvier.
Texte des bulletins : branche `brvm-historique-brut` (robot « Historique BRVM », lancement manuel). Lecture : `python scripts/brvm/historique_lire.py --brut <dossier brut>`.
Séances sans bulletin trouvé : 16, 19 et 20 mars, 6 avril, 1er, 14, 25 et 27 mai, 10 juin, 7 et 25 août 2026 (jours fériés pour la plupart).
