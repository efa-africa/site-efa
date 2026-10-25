# EFA · L'appli 1.0 (25 oct. 2026)

L'appli reprend l'expérience du site efa.africa, dans sa charte (crème, Libre Baskerville, Source Sans 3, bleu nuit pour la navigation et les couvertures).

## Les cinq onglets
1. **Mes outils** : simulateurs et aides à la décision du site (Faire le point · Décider · S'organiser), « Commencé » quand l'outil a déjà servi ; **Mon cahier** (défi, pistes, plans d'action, fiches gardées, notes) ; **Défis et actions** (défi de 7 jours du cahier, notable depuis l'appli ; décisions suivies à 7 et 30 jours ; plan d'action ; challenges de l'appli).
2. **L'école** : 3 cycles, 23 modules, étapes à cocher, reprise du module en cours, deux écoles (tontine, Bourse), attestations et certificats, programmes selon l'objectif, leçons de 5 minutes avec Koffi.
3. **Questions** : la promesse de l'accueil, « Qu'est-ce qui vous préoccupe ? », la recherche dans les questions (chacune mène à son module), Min'Fin regardable dans l'appli.
4. **Études** : La tontine en chiffres, L'argent de la tontine, Africa 2075, EFA News, la séance BRVM, les Tribunes.
5. **Plus** : Ely, le Dico (34 mots), À propos, organisations, contact, communauté, progression et données.

## Données
- Lues directement sur le site (../parcours-efa.js, ../plan-efa.js, ../minfin.js, ../dico.js, ../tribunes.js, ../donnees.js) : toute mise à jour du site apparaît dans l'appli, sans republier l'appli.
- Mêmes enregistrements que le site sur le téléphone : efa_parcours_v1 (école), efa_cahier_v1 (cahier), efa_suivi_v1 (décisions suivies), états des outils.
- Hors connexion : tout est mis en cache à la première ouverture.

## Lecteur intégré
Les pages du site s'ouvrent dans l'appli sans l'en-tête, le pied de page, le bandeau ni la bulle Ely ; le bouton retour revient d'abord en arrière dans la page. Les liens vers un module de l'école ouvrent l'écran du module ; ceux vers l'appli reviennent à Mes outils.

## Mise en ligne
Remplacer le contenu du dossier `app/` du dépôt site-efa par les fichiers du zip. Facultatif : supprimer les anciennes polices big-shoulders-*.woff2 et manrope-*.woff2.
