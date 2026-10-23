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
