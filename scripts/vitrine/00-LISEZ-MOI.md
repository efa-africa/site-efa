# Vitrine des SGI et EFA Invest · mise en service

Pages (noindex, non reliées au site tant que la validation réglementaire n'est pas faite) :
`sgi.html` · `sgi-comparer.html` · `invest.html` · `merci-invest.html`. Code commun : `clone/vitrine.js`, `clone/vitrine.css`.

Données : `data/sgi.json` (fiches, `"demo": true` = SGI fictives et bandeau « démonstration ») et `data/places.json` (places payées, période).
Pour passer aux vraies données : remplacer les fiches, retirer `"demo": true`, mettre `places.json` à jour.

Comptage : exécuter `01-supabase-vitrine.sql`, déployer `02-worker-vitrine.js` (secrets `SUPABASE_SERVICE_KEY`, `ADMIN_KEY`, variables `SUPABASE_URL`, `SITE_ORIGIN`), puis mettre l'adresse du Worker dans `efa-config.js` → `VITRINE_URL`. Tant que `VITRINE_URL` est vide, rien n'est envoyé.

Liste d'attente : créer dans Brevo la liste « EFA Invest · liste d'attente » et le formulaire « EFA Invest attente (site) » (double confirmation, page de confirmation `merci-invest.html`, champs EMAIL, PRENOM, EFA_PAYS, EFA_SOURCE, NEWSLETTER, OPT_IN), puis coller son adresse « action » dans `efa-config.js` → `INVEST_BREVO_URL`. Tant qu'elle est vide, chaque inscription arrive par e-mail (Web3Forms).

Mise en ligne (§ 12) : retirer les lignes `Disallow` de `robots.txt`, retirer `noindex` des pages `sgi.html` et `sgi-comparer.html`, ajouter les deux tuiles en fin de « Se lancer » sur l'accueil, compléter `confidentialite.html` (§ 10).
