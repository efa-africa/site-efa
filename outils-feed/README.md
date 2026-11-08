# outils-feed · le feed EFA de chaque semaine

Deux rendez-vous automatiques :
- **Mercredi 18 h 44 (Abidjan)** : la liste des images à générer pour la semaine suivante (`python3 feed.py briefs`).
- **Dimanche 9 h 41 (Abidjan)** : le dossier et le zip du feed de la semaine qui commence le lendemain (`python3 feed.py build`).

Fichiers :
- `calendrier.json` : les 12 semaines (9 nov. 2026 → 31 janv. 2027), campagne, message, objectifs, publications, personnages et scènes à générer.
- `feed.py` : gabarits (portrait, typographique, scène, carrousel), traitement de peau, dérivé 1080 × 1920, plan et textes.
- `fonts/` : Anton, Source Sans 3, Libre Baskerville (Google Fonts, licence OFL).
- `entrants/<lundi>/` : les images générées par Élysée, nommées comme dans le brief (`mer-carrousel-01.jpg`, `jeu-scene.jpg`, `ven-scene.jpg`).
- `sortie/` : production (non versionnée).

Règles : visage d'Élysée au plus deux fois par semaine (samedi, et un lancement) ; aucune mention de Claude ; Facebook sans lien dans le texte ; « la Bourse (BRVM) » ; des idées, jamais des gains promis.
