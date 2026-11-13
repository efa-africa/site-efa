# efa. abonnement · guide d'installation du service de codes

Version 1.0 · 13 novembre 2026 · environ 15 minutes, sur ordinateur.

Le site est déjà prêt : la page `abonnement.html` interroge le service dès qu'il existe, et la page `admin-abonnement.html` vous sert à créer les codes. Il manque seulement le service lui-même. Tant qu'il n'est pas installé, rien ne change pour les visiteurs.

Fichiers, dans le dépôt GitHub `efa-africa/site-efa`, dossier `serveur/` :
- `04-supabase-abonnement.sql` : la table des accès ;
- `05-worker-efa-abonnement.js` : le nouveau Worker « efa-abonnement ».

On réutilise le projet Supabase de l'école. On ne touche ni au Worker « efa-ecole » ni au Worker « ely ».

## 1. Supabase (3 min)

1. supabase.com, puis le projet EFA, puis **SQL Editor**, puis **New query**.
2. Collez tout le contenu de `04-supabase-abonnement.sql`, puis **Run**. Résultat attendu : « Success. No rows returned ».

## 2. Cloudflare (10 min)

1. dash.cloudflare.com, puis **Workers & Pages**, puis **Create**, puis **Create Worker**. Nommez-le exactement **efa-abonnement**, puis **Deploy**.
2. **Edit code** : remplacez tout le code par le contenu de `05-worker-efa-abonnement.js`, puis **Deploy**.
3. **Settings**, puis **Variables and Secrets**. Ajoutez les trois mêmes valeurs que pour « efa-ecole » :

| Nom | Type | Valeur |
| --- | --- | --- |
| `SUPABASE_URL` | Texte | l'adresse du projet Supabase |
| `SUPABASE_SERVICE_KEY` | Secret | la clé service_role |
| `ADMIN_KEY` | Secret | votre clé maîtresse (la même que pour l'école convient) |

4. Vérifiez l'adresse du Worker : elle doit être `https://efa-abonnement.elysees-johnson.workers.dev`. Ouvrez-la : la réponse attendue est `{"service":"efa. abonnement","version":"1.0","base":true}`. Si `base` vaut `false`, une des deux valeurs Supabase manque.

## 3. Premier essai (2 min)

1. Ouvrez `efa.africa/admin-abonnement`, entrez votre clé maîtresse.
2. Créez un accès à votre nom, formule Essentiel, 30 jours. Le code à 6 chiffres s'affiche une seule fois, avec un message prêt à envoyer.
3. Ouvrez `efa.africa/abonnement`, descendez à « J'ai déjà mon code », entrez prénom, nom, code.
4. Revenez à la page d'administration : l'accès affiche « 1 connexion ».

## Au quotidien

1. Le paiement arrive (Orange Money, Wave).
2. `efa.africa/admin-abonnement` : prénom, nom, formule, durée. **Créer**.
3. **Copier le message**, l'envoyer à la personne par WhatsApp.

Dans la liste : **+ 30 jours** (renouvellement), **Nouveau code** (code oublié : l'ancien ne marche plus), **Rouvrir le choix d'atelier** (Essentiel), **Fermer**.

## Ce que le service garantit, et ce qu'il ne fait pas encore

- Le code n'est stocké nulle part : seule son empreinte l'est. Après 5 codes faux pour un même nom, 15 minutes d'attente.
- Un accès fermé ou terminé se coupe sur le téléphone de la personne à sa visite suivante. Trois appareils au plus par accès.
- Le choix d'atelier de la formule Essentiel est gardé par le service, plus par le téléphone.
- Limite connue : les pages des ateliers restent des pages publiques du site. Quelqu'un qui connaît l'adresse exacte d'un atelier peut encore l'ouvrir sans code. Le vrai verrou des contenus est l'étape suivante.
- Les quatre codes d'essai du 13 novembre (fichier `data/acces-formules.json`) continuent de marcher jusqu'au 13 décembre 2026. À supprimer une fois le service en place.
