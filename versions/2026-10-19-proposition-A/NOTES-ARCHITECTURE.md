# Architecture du site efa.africa · 19 octobre 2026

## Menu (identique mobile et ordinateur)
Diagnostic (bouton corail) · Cercle & Spirale (cercle-spirale.html) · Études & Outils (methode.html#etudes) · Guides (#guides) · À propos (auteur.html)

## Pages
- index.html : comprendre puis s'orienter
- diagnostic.html : diagnostic (inchangé à ce stade)
- cercle-spirale.html (nouvelle) : onglets « Avec mon argent » (#argent, objectif projet #projet) et « Avec mon groupe » (#groupe) ; gouvernance propriété / contrôle / sortie avant les usages ; projection 10 ans et 1 000 groupes
- methode.html : Études, Simulateurs (détail rentrée par rentrée, renvoie vers Cercle & Spirale), BRVM, Actualités, Méthode
- auteur.html : À propos
- merci-guide.html (nouvelle, noindex) : page de redirection Brevo après double confirmation ; compte guide-confirme, puis guide-ouvert au clic
- confidentialite.html

## Accueil, dans l'ordre
Bandeau mission · Promesse + bouton diagnostic + « email demandé seulement à la fin » + lien secondaire · Trois besoins (budget → diagnostic ; grosse rentrée → cercle-spirale#argent ; projet → cercle-spirale#projet) · Le cercle (simulateur) · La spirale (chiffres) · Concrètement (avec la carte « À qui appartient la réserve ? ») · Enquête · Guide (email principal, questionnaire secondaire) · Catalogue des guides · Trois leçons · Bandeau mission · Livre · Fondateur · Contact · Semaine EFA · Pied de page

## Rappel flottant de l'enquête
Une fois par visite, 12 s, après la section Spirale ; jamais au-dessus du simulateur, de Concrètement, de l'enquête, du guide, du livre, du contact ni du pied de page, ni pendant une saisie.

## Consentement guide / newsletter
Interrupteur NL_SEPAREE dans index.html (false). À passer à true après : (1) création d'une liste « Guide EFA » et d'un attribut booléen NEWSLETTER dans Brevo ; (2) ajout du champ NEWSLETTER (facultatif) au formulaire « Guide stabilité financière (site) » et choix de la liste Guide EFA ; (3) test. La case newsletter est alors décochée par défaut.

## Mesure (GoatCounter, aucune donnée personnelle)
diag-* (diagnostic) · sim-individuel-fin · sim-groupe-fin · besoin-budget / besoin-rentree / besoin-projet · concret-groupe · guide-demande · guide-confirme · guide-ouvert · guide-questionnaire · enquete-section / enquete-rappel / enquete-etudes

## Reste à faire
Phase 3 : diagnostic → action prioritaire → ressource, reprise et effacement. Phase 4 : liens de suite entre contenus, tribunes cliquables sur auteur.html, test des trois scénarios.
