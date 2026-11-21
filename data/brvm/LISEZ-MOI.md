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

## Opérations sur titres (fractionnements, actions gratuites)

`operations.json` : liste sourcée des opérations qui changent le nombre d'actions (Solibra 2024 et Sonatel 2026 : 10 pour 1 ; Bank of Africa et SIB 2024 : actions gratuites ; Safca 2026 : augmentation de capital avec droit préférentiel), plus les dividendes exceptionnels (Filtisac 2025) à ne pas confondre avec un fractionnement.
Les bases brutes gardent les cours publiés à l'époque. `marches.py` (courbes, performances) et `semaine.py` (synthèses) ajustent les cours et volumes antérieurs, pour qu'un détenteur de 10 Sonatel devenues 100 ne voie pas une perte fictive de 90 %.
Si `marches.py` affiche « ALERTE : saut de cours non déclaré », il faut ajouter l'opération, avec sa source, dans `operations.json`.

## Cours de la veille

La colonne « cours veille » de brvm.org n'est pas fiable. Depuis le 21 novembre 2026, `collecte.py` déduit le cours de la veille de la clôture et de la variation officielle du jour, comme le bulletin officiel ; la base `actions.csv` a été corrigée de la même façon et les synthèses hebdomadaires recalculées.

## Tout ce que contiennent les bulletins officiels (depuis 2024)

- `dividendes.json` : dividendes nets par action, dates de détachement et de paiement.
- `evenements_bulletins.json` : opérations en cours (paiements, fractionnements, premières cotations), avis BRVM et DC/BR (intérêts, remboursements, suspensions), communiqués des sociétés (états financiers, rapports d'activité, convocations d'assemblées, notations).
- `historique/obligations_AAAA.csv` : obligations cotées par séance (cours, coupon couru, périodicité et montant du coupon, prochaine échéance, amortissement).
- `historique/opcvm_AAAA.csv` : FCP et SICAV par séance (société de gestion, dépositaire, catégorie, valeurs liquidatives, performance depuis l'origine). Le nom de la société de gestion peut être incomplet quand il est écrit sur deux lignes dans le bulletin.
Mis à jour chaque samedi par le robot « Historique BRVM ».

## Ma BRVM (ma-brvm.html)

Outil « Ma BRVM · Et si j'avais investi ? » (remplace simulateur-bourse.html, qui redirige) : cinq onglets (Si j'avais investi…, Quand êtes-vous entré ?, Comparer, Mon portefeuille, Décryptages), code dans `clone/ma-brvm.js`. Il lit `data/marches/` ; `jour.json` contient aussi `total_return` (BRVM Composite Total Return, publié depuis le 2 janvier 2026). Le portefeuille reste dans le navigateur du visiteur. Sonatel et Orange CI figurent dans les classements et les décryptages, comme les autres sociétés (décision du 21 novembre 2026).
