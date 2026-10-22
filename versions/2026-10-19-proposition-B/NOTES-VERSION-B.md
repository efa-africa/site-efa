# Site efa.africa · version B (19 octobre 2026)

Parcours : comprendre une idée → l'appliquer à sa situation → choisir une première action → revenir.
Versions conservées dans le projet : claude/site/versions/2026-10-19-en-ligne/ (en ligne au 19 oct., 07:31) et claude/site/versions/2026-10-19-proposition-A/ (première architecture). Version B : claude/site/versions/2026-10-19-proposition-B/ et claude/site/v2/.

## Accueil (index.html), dans l'ordre
1. Bandeau mission, puis promesse « L'argent s'apprend » : bouton « Faire mon diagnostic gratuit · 6 min », lien « Comprendre le cercle et la spirale », mention « première synthèse tout de suite, email ensuite ».
2. Votre besoin, « Qu'est-ce qui vous préoccupe ? » : je ne sais pas où passe mon argent → diagnostic ; je vais recevoir une grosse somme → cercle-spirale.html#argent ; aide aux proches → leçon « Prêt ou cadeau ? » (#preter) ; comprendre ma tontine → cercle-spirale.html#groupe.
3. Démonstration courte : l'exemple de Koffi (300 000 FCFA, 10 % gardés, modifiable), puis « Une part reste » avec les nuances (l'argent dépensé a pu être utile ; ce qui est gardé n'est pas un rendement), puis « Vous voyez ce qui pourrait rester. Voyons maintenant ce que votre situation permet. » → diagnostic, ou « Comprendre la spirale collective ».
4. Guide (email en chemin principal, questionnaire en repli) et catalogue des guides.
5. Études et méthode : l'enquête (71 %, 47 %), « Lire l'étude complète », « Notre méthode », invitation à répondre.
6. Bandeau mission, fondateur avec les tontines laboratoires (sans CDC ni 1000Dreamers).
7. Publications récentes (trois leçons) et un seul rendez-vous : « L'argent de la semaine », chaque mardi ; EFA Community le jeudi en lien discret. Le bloc « Une semaine avec EFA » est retiré de l'accueil.
8. Livre, contact, pied de page.
« Concrètement, quoi ? » (10 membres → 20 millions → 20 milliards) quitte l'accueil pour cercle-spirale.html#groupe.

## Spirale collective (cercle-spirale.html#groupe)
1 Fonctionnement (exemple 10 membres) → 2 Simulation → 3 Droits des membres (d'où vient la réserve, à qui elle appartient) → 4 Gouvernance (qui décide, comment c'est suivi, quand un membre sort) → 5 Usages possibles et risques → projection 10 ans et 1 000 groupes.

## Diagnostic (diagnostic.html)
- Après les questions : première synthèse sans email (situation, point d'appui, priorité ; la première action est annoncée). Réglage APERCU dans efa-config.js (true par défaut ; false = email avant tout résultat).
- Résultat complet en 4 blocs : 1 situation (score, palier), 2 point d'appui, 3 priorité, 4 première action cette semaine avec un bouton vers la fiche, la leçon ou le calcul correspondant ; le guide complet en complément. Le détail des six dimensions est replié. Les cartes « Payant · bientôt » sont retirées. Ajout de « Effacer mes données de cet appareil ».

## Liens à publier selon la publication d'origine
- Min'Fin sur les dépenses : https://efa.africa/diagnostic.html?src=minfin
- Min'Fin sur les prêts aux proches : https://efa.africa/#preter
- Tribune sur la tontine : https://efa.africa/cercle-spirale.html?src=tribune#groupe
- Publication sur le guide : https://efa.africa/#guide
- Résultat d'enquête : https://efa.africa/methode.html#etudes
- Présentation d'Élysée Johnson : https://efa.africa/auteur.html
- Invitation à participer : https://forms.gle/Sczi5p58q9ijuKqp9
- Presse et partenaires : https://efa.africa/auteur.html (réalisations, méthode, contact)

## Réglages Brevo à faire
- Formulaire « Guide stabilité financière (site) » : redirection après confirmation vers https://efa.africa/merci-guide.html.
- Séparation guide / newsletter (interrupteur NL_SEPAREE dans index.html, désactivé) : liste « Guide EFA » et champ NEWSLETTER à créer.
