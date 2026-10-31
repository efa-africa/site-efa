# Vitrine des SGI et EFA Invest · mise en service

Pages (noindex, non reliées au site tant que la validation réglementaire n'est pas faite) :
`sgi.html` · `sgi-comparer.html` · `invest.html` · `merci-invest.html`. Code commun : `clone/vitrine.js`, `clone/vitrine.css`.

Données : `data/sgi.json` (34 SGI relevées sur brvm.org le 31/10/2026 ; frais, agrément et présentation à compléter par EFA) et `data/places.json` (aucune place payée tant qu'aucun contrat n'est signé : `periode` à `null`).
Logos : déposer `img/sgi/[id].png` (240 px). Sans fichier, un monogramme s'affiche. Les logos ne sont jamais chargés depuis brvm.org.

Comptage : exécuter `01-supabase-vitrine.sql`, déployer `02-worker-vitrine.js` (secrets `SUPABASE_SERVICE_KEY`, `ADMIN_KEY`, variables `SUPABASE_URL`, `SITE_ORIGIN`), puis mettre l'adresse du Worker dans `efa-config.js` → `VITRINE_URL`. Tant que `VITRINE_URL` est vide, rien n'est envoyé.

Liste d'attente : créer dans Brevo la liste « EFA Invest · liste d'attente » et le formulaire « EFA Invest attente (site) » (double confirmation, page de confirmation `merci-invest.html`, champs EMAIL, PRENOM, EFA_PAYS, EFA_SOURCE, NEWSLETTER, OPT_IN), puis coller son adresse « action » dans `efa-config.js` → `INVEST_BREVO_URL`. Tant qu'elle est vide, chaque inscription arrive par e-mail (Web3Forms).

Mise en ligne (§ 12) : retirer les lignes `Disallow` de `robots.txt`, retirer `noindex` des pages `sgi.html` et `sgi-comparer.html`, ajouter les deux tuiles en fin de « Se lancer » sur l'accueil, compléter `confidentialite.html` (§ 10).

« Contacter la SGI » (v1.1 § 3.5) : le visiteur laisse son adresse, le Worker (`POST /contact`) lui envoie les coordonnées par Brevo (modèle `03-modele-brevo-coordonnees-sgi.html`, à créer dans Brevo sous le nom « EFA · Coordonnées SGI » et dont l'id va dans `BREVO_TEMPLATE_ID`), crée le contact dans la liste « Vitrine SGI · demandes » avec `EFA_SGI_DEMANDEES` (attribut texte à créer), et compte la demande sans l'adresse.
Tant que `VITRINE_URL` est vide : les coordonnées s'affichent tout de suite et la demande arrive par e-mail à EFA (Web3Forms), sans e-mail au visiteur.
Anti-robot : facultatif, `TURNSTILE_SITEKEY` dans `efa-config.js` et secret `TURNSTILE_SECRET` dans le Worker.
