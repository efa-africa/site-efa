# Comptes de l'école pour les organisations · guide d'installation

Version 1.0 · 25 octobre 2026 · environ 20 minutes, sur ordinateur.

Le site est déjà en ligne : la page `admin-ecole.html` (pour vous), le tableau de bord `espace-organisation.html` (pour l'entreprise) et la page `rejoindre.html` (pour les salariés). Il manque seulement le service qui garde les comptes. Tant qu'il n'est pas installé, ces pages affichent « Service en cours d'installation » ou « Connexion impossible ».

Fichiers, dans le dépôt GitHub `efa-africa/site-efa`, dossier `serveur/` :
- `01-supabase-ecole.sql` : les deux tables, côté base de données ;
- `02-worker-efa-ecole.js` : le nouveau Worker « efa-ecole ».

On réutilise le projet Supabase déjà créé pour Ely. On ne touche pas au Worker « ely ».

## 1. Supabase (5 min)

1. supabase.com, puis le projet EFA, puis **SQL Editor**, puis **New query**.
2. Collez tout le contenu de `01-supabase-ecole.sql`, puis **Run**. Le résultat attendu est « Success. No rows returned ».
3. Gardez à portée de main l'adresse du projet (**Project URL**) et la clé **service_role**. Ce sont les mêmes que pour Ely.

## 2. Cloudflare (10 min)

1. dash.cloudflare.com, puis **Workers & Pages**, puis **Create**, puis **Create Worker**. Nommez-le **efa-ecole**, puis **Deploy**.
2. **Edit code** : remplacez tout le code par le contenu de `02-worker-efa-ecole.js`, puis **Deploy**.
3. **Settings**, puis **Variables and Secrets**. Ajoutez :

| Nom | Type | Valeur |
| --- | --- | --- |
| `SUPABASE_URL` | Texte | l'adresse du projet Supabase |
| `SUPABASE_SERVICE_KEY` | Secret | la clé service_role (la même que pour Ely) |
| `ADMIN_KEY` | Secret | votre clé maîtresse : 48 caractères, voir ci-dessous |

Pour la clé maîtresse, ouvrez efa.africa/admin-ecole.html et touchez **Générer une nouvelle clé maîtresse**. Elle est créée sur votre appareil et n'est envoyée nulle part. Collez-la dans `ADMIN_KEY`, puis gardez-la dans un gestionnaire de mots de passe. **Personne d'autre que vous ne doit l'avoir.**

4. L'adresse du Worker doit être **https://efa-ecole.elysees-johnson.workers.dev**. Si Cloudflare en affiche une autre, envoyez-la-moi : je change une ligne dans `efa-compte.js`.

## 3. Vérifier (5 min)

1. Ouvrez https://efa-ecole.elysees-johnson.workers.dev. La page doit afficher `"base":true`.
2. Sur efa.africa/programme-organisation.html, composez un programme de test, puis copiez le lien de la page finale.
3. Sur efa.africa/admin-ecole.html, entrez votre clé maîtresse, collez le lien, puis **Générer la clé et le code**. Notez la clé d'organisation : elle ne sera plus affichée.
4. Sur votre téléphone, ouvrez efa.africa/rejoindre.html?code=… (le code affiché), créez un compte, puis cochez une étape d'un module.
5. Sur efa.africa/espace-organisation.html, entrez la clé d'organisation. Votre nom apparaît avec votre progression.

## Comment ça marche ensuite

| Qui | Avec quoi | Pour quoi faire |
| --- | --- | --- |
| Vous (EFA) | la clé maîtresse | créer un programme, générer la clé de l'organisation et le code des participants, renouveler une clé, fermer un programme |
| L'organisation | sa clé `ORG-…` (160 bits) | voir son tableau de bord : inscrits, connexions, progression, modules terminés, certificats, export CSV, retirer un participant |
| Chaque participant | le code `EFA-XXXX-XXXX`, puis sa clé personnelle `EFA-…` (120 bits) | créer son compte, puis retrouver sa progression sur n'importe quel téléphone |

- Les clés ne sont jamais stockées : la base ne garde que leur empreinte. Une clé perdue se remplace par une nouvelle, avec **Nouvelle clé** dans l'administration.
- Le code des participants est limité par le nombre de places et la date de fin du programme.
- Ce qui est transmis : le nom, l'email s'il est donné, les dates de visite, les étapes cochées, les modules dont la fiche est gardée et les numéros de certificat. **Jamais les montants** saisis dans les outils.

## Points à garder en tête

- **ARTCI** : ce sont des données personnelles (des noms, rattachés à un employeur). La déclaration suppose une structure juridique. C'est à régulariser avec l'immatriculation d'EFA, et un point à mettre dans le contrat avec chaque organisation.
- **Limite connue** : un certificat obtenu sur un téléphone apparaît dans le tableau de bord, mais ne se réaffiche pas sur un autre téléphone. La progression, elle, se retrouve partout.
- **Accès** : deux personnes au plus ont la clé maîtresse et l'accès Supabase.
