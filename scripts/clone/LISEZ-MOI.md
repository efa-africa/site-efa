# Site efa.africa, version premium (bascule du 30 octobre 2026)

- **Accueil** : `index.html` est fabriqué à partir de `clone/_index.html` (métadonnées et mesure d'audience reprises de l'ancien accueil, gardé hors index sous `accueil-v1.html`).
- **Ateliers, Marchés, Études et prospective** : `coaching.html`, `marches.html`, `etudes-prospective.html` sont fabriqués à partir de `clone/_coaching.html`, `clone/_marches.html`, `clone/_etudes-prospective.html`.
- **Toutes les autres pages** (racine et `news/`) gardent leur adresse et reçoivent sur place l'en-tête, le pied et l'habillage blanc et bleu (`clone/habillage.css|js`, plus `clone/pages/<page>.css|js` quand ils existent : `parcours`, `rendez-vous`).
- **Anciennes adresses `/clone/…`** : redirigent vers l'adresse du site.

## Nouvelle page (EFA News, leçon, outil)
1. Publier la page comme avant.
2. Relancer `python3 scripts/clone/habiller.py` depuis la racine du dépôt, puis committer. Le script peut être relancé sans risque : il retire l'ancien habillage avant de remettre le nouveau.
3. Filet de sécurité : une page qui charge `efa-appli.js` reçoit l'habillage automatiquement, même sans passage du script.

Ne pas modifier à la main `index.html`, `coaching.html`, `marches.html`, `etudes-prospective.html` : modifier le modèle `clone/_*.html`, puis relancer le script.
Les modèles d'habillage sont `scripts/clone/habillage-base.css|js` et `scripts/clone/pages/`.
