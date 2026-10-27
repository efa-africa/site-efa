# EFA News · publier un article

Source unique : `news/news-data.json`. Tout le reste est généré.

1. Ajouter l'article en tête de la liste `articles` (même structure que les autres).
   - `statut` : `publié` (en ligne), `à vérifier` ou `brouillon` (pas en ligne), `corrigé` (en ligne, avec une entrée dans `corrections`).
   - `une` : `true` sur un seul article (choix de la rédaction).
   - `categorie` : finance, economie, brvm, banques-centrales, paiements, vie-quotidienne.
   - `chiffres` : 3 au plus, `calcul_efa: true` si le chiffre est calculé par EFA.
   - `actions` : 2 liens vers une leçon ou un outil du site (URL relative, ex. `cout-total-credit.html#calcul`).
   - `sources` : titre, organisme, date, URL ouverte et vérifiée, date de consultation.
     Ajouter `type` : `primaire` (document de l'émetteur, de la banque centrale, de l'État, de l'institut statistique) ou `media` (information rapportée par la presse). Deux médias du même groupe ne font qu'une confirmation : le générateur le signale.
   - `verif` : une question de compréhension, `{q, choix: [3 réponses], bonne: indice, explication}`. Elle vérifie que le lecteur a compris une limite ou un mécanisme de l'article (pas une opinion).
2. `python3 outils-news/build_news.py . AAAA-MM-JJ` : régénère news.html, news/<id>.html et le sitemap.
3. `node outils-news/og.js .` puis relancer l'étape 2 : crée les images de partage manquantes.
