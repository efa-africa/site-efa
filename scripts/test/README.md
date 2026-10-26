# Site de test EFA (bac à sable)

Les nouvelles versions du site ne partent plus directement en ligne.
Elles passent d'abord par un **site de test**, une copie complète de la plateforme que l'équipe peut ouvrir, cliquer et tester.

## Les deux sites

| | Site public | Site de test |
|---|---|---|
| Adresse | https://efa.africa | https://efa-test.pages.dev (après le branchement ci-dessous) |
| Branche GitHub | `main` | `test` |
| Hébergement | GitHub Pages | Cloudflare Pages |
| Google | référencé | jamais référencé (noindex) |
| Repère visuel | aucun | bandeau jaune « VERSION DE TEST » en bas de chaque page |

## Le circuit d'une nouvelle version

1. Toute nouvelle version est publiée sur la branche `test`.
2. Le site de test se met à jour tout seul en une à deux minutes.
3. L'équipe de test vérifie sur téléphone et sur ordinateur.
4. Élysée donne son feu vert : la branche `test` est fusionnée dans `main`, et la version part sur efa.africa.

Une correction urgente peut aller directement sur `main`, sur décision d'Élysée uniquement ; elle est ensuite reportée sur `test`.

## Brancher le site de test (une seule fois, environ 5 minutes)

Dans le compte Cloudflare d'EFA (celui qui héberge déjà le Worker « ely ») :

1. **Workers & Pages** › **Créer** › onglet **Pages** › **Connecter à Git**.
2. Autoriser GitHub, puis choisir le dépôt **efa-africa/site-efa**.
3. Paramètres :
   - Nom du projet : `efa-test` (donne l'adresse efa-test.pages.dev)
   - Branche de production : **`test`**
   - Préréglage du framework : **Aucun**
   - Commande de compilation : `bash scripts/test/preparer.sh`
   - Répertoire de sortie : `_test`
4. **Enregistrer et déployer.**

Facultatif : une adresse `test.efa.africa` peut être ajoutée dans Pages › Domaines personnalisés (un enregistrement CNAME à créer chez GoDaddy).

## À savoir

- Le site de test utilise les mêmes services que le site public (formulaires Brevo, comptes de l'école, Ely). Pour les essais de formulaires, utiliser des adresses de l'équipe.
- Les liens partagés depuis le site de test ne sont jamais indexés par Google.
- Tous les déploiements, de test et de production, sont visibles dans Cloudflare Pages (historique et retour arrière en un clic).
