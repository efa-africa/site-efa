# EFA News · publier un article

Source unique : `news/news-data.json`. Tout le reste est généré.

1. Ajouter l'article en tête de la liste `articles` (même structure que les autres).
   - `statut` : `publié` (en ligne), `à vérifier` ou `brouillon` (pas en ligne), `corrigé` (en ligne, avec une entrée dans `corrections`).
   - `une` : `true` sur un seul article (choix de la rédaction).
   - `categorie` : finance, economie, brvm, banques-centrales, paiements, vie-quotidienne.
   - `chiffres` : 3 au plus, `calcul_efa: true` si le chiffre est calculé par EFA.
   - `actions` : 2 liens vers une leçon ou un outil du site (URL relative, ex. `cout-total-credit.html#calcul`).
   - `sources` : titre, organisme, date, URL ouverte et vérifiée, date de consultation.
     Citer d'abord la source d'origine (communiqué du FMI, de la BCEAO, de la Bourse, du Trésor, de l'institut statistique) plutôt que le média qui l'a reprise. Les médias qui vendent les mêmes services qu'EFA (formation à la Bourse, ex. Sika Finance) ne sont jamais liés : s'ils sont la seule source d'un chiffre, on les nomme avec `url` vide (cité sans lien).
     Ajouter `type` : `primaire` (document de l'émetteur, de la banque centrale, de l'État, de l'institut statistique) ou `media` (information rapportée par la presse). Deux médias du même groupe ne font qu'une confirmation : le générateur le signale.
   - `verif` : une question de compréhension, `{q, choix: [3 réponses], bonne: indice, explication}`. Elle vérifie que le lecteur a compris une limite ou un mécanisme de l'article (pas une opinion).
2. `python3 outils-news/build_news.py . AAAA-MM-JJ` : régénère news.html, news/<id>.html et le sitemap.
   Puis **obligatoirement** `python3 scripts/clone/habiller.py --news` : remet l'en-tête, le menu et le pied du site sur les pages EFA News (sans toucher au reste du site). Sans cette étape, les pages News perdent le menu du site.
3. `node outils-news/og.js .` puis relancer l'étape 2 (build puis habiller --news) : crée les images de partage manquantes.
