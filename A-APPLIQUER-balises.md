# Référencement efa.africa : modifications à appliquer (22 oct. 2026)

À déposer dans le dépôt GitHub `efa-africa/site-efa` (branche main). Pour chaque page, **remplacer** les lignes `<title>` et `<meta name="description">` existantes et **ajouter** les lignes marquées « ajouter » dans le `<head>`.

---

## 1. Nouveaux fichiers (racine du dépôt)

- `tontine.html` : page pilier « tontine / la tontine n'est pas une épargne »
- `robots.txt` : nouveau (n'existait pas)
- `sitemap.xml` : remplace l'actuel (ajoute tontine.html et ely.html, retire confidentialite.html qui est en noindex)

## 2. Accueil `index.html`

```html
<title>Éducation financière en Afrique : apprendre à gérer son argent · EFA</title>
<meta name="description" content="Éducation Financière Afrique (EFA) : budget en FCFA, épargne, tontine, mobile money, famille. Des outils gratuits et des leçons pour gérer son argent avec les réalités d’ici, de la Côte d’Ivoire à toute l’Afrique.">
<link rel="canonical" href="https://efa.africa/">  <!-- ajouter -->
```

Ajouter avant `</head>` :

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://efa.africa/#organisation",
      "name": "Éducation Financière Afrique",
      "alternateName": ["EFA", "EFA Africa", "efa.africa"],
      "url": "https://efa.africa/",
      "logo": "https://efa.africa/logo-efa.png",
      "slogan": "L’argent s’apprend.",
      "description": "Plateforme d’éducation financière en Afrique : budget, épargne, tontine, mobile money.",
      "founder": {"@type": "Person", "@id": "https://efa.africa/auteur.html#elysee", "name": "Élysée Johnson"},
      "areaServed": [{"@type": "Place", "name": "Afrique"}, {"@type": "Country", "name": "Côte d’Ivoire"}],
      "knowsAbout": ["éducation financière", "budget", "épargne", "tontine", "mobile money", "finance africaine", "FCFA"],
      "sameAs": [
        "https://www.tiktok.com/@efa.afrique",
        "https://www.youtube.com/@efaeducationfinanciereafrique",
        "https://substack.com/@educationfinanciereafrique"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://efa.africa/#site",
      "url": "https://efa.africa/",
      "name": "Éducation Financière Afrique",
      "alternateName": "EFA",
      "inLanguage": "fr",
      "publisher": {"@id": "https://efa.africa/#organisation"}
    }
  ]
}
</script>
```

Ajouter l'URL de la page Facebook EFA dans `sameAs` (l'adresse publique de la page, pas le lien de partage).

**Maillage :** dans la section « Qu'est-ce qui vous préoccupe ? », ajouter une carte « La tontine : ce qu'elle est vraiment » → `tontine.html`. Ajouter aussi `<a href="tontine.html">La tontine</a>` dans le pied de page de **toutes** les pages.

## 3. `ou-est-passe-mon-argent.html`

```html
<title>Où est passé mon argent ? Outil gratuit pour faire le point sur son budget · EFA</title>
<meta name="description" content="Votre salaire disparaît avant la fin du mois ? Cinq questions pour repérer où part votre argent, puis le bilan avec vos chiffres en FCFA. Gratuit, sans inscription.">
<link rel="canonical" href="https://efa.africa/ou-est-passe-mon-argent.html">  <!-- ajouter -->
```

**Important :** le H1 et le texte sont générés en JavaScript, Google en voit peu. Ajouter juste après `<main>` un bloc statique :

```html
<h1>Où est passé mon argent ?</h1>
<p>Le salaire arrive, et à la fin du mois il ne reste rien. Cet outil gratuit d’Éducation Financière Afrique vous aide à repérer où part votre argent : dépenses du quotidien, famille, tontine, mobile money, crédits. Cinq questions pour savoir où chercher, puis le bilan avec vos chiffres en FCFA.</p>
```

(Le script peut ensuite masquer ce bloc s'il réaffiche son propre titre.)

## 4. `outils.html`

```html
<title>Outils gratuits d’éducation financière : budget, épargne, diagnostic · EFA</title>
<meta name="description" content="Les outils gratuits d’Éducation Financière Afrique : Où est passé mon argent ?, diagnostic financier, calculateur d’épargne, retraite, prêter à un proche. Avec vos chiffres en FCFA.">
<link rel="canonical" href="https://efa.africa/outils.html">  <!-- ajouter -->
```

## 5. `cercle-spirale.html`

```html
<title>Combien garder quand l’argent arrive ? Calculateur d’épargne et de tontine · EFA</title>
<meta name="description" content="Calculez votre spirale : quelle part garder d’une grosse rentrée, et la réserve d’une tontine tour par tour. Passer de l’argent qui tourne à l’argent qui reste. Exemples en FCFA.">
<link rel="canonical" href="https://efa.africa/cercle-spirale.html">  <!-- ajouter -->
```

## 6. `diagnostic.html`

```html
<title>Diagnostic financier gratuit : où en êtes-vous avec votre argent ? · EFA</title>
<meta name="description" content="Un diagnostic financier gratuit en six minutes, pensé pour l’Afrique : budget, épargne, dettes, tontines et ce que vous donnez à vos proches. Votre profil, vos forces, vos priorités.">
<link rel="canonical" href="https://efa.africa/diagnostic.html">  <!-- ajouter -->
<meta property="og:url" content="https://efa.africa/diagnostic.html">  <!-- ajouter -->
```

Corriger : `og:image` → `https://efa.africa/og-image.png` (pointe encore vers efa-africa.github.io).
Ajouter un H1 statique : `<h1>Mon diagnostic financier gratuit</h1>` + une phrase d'introduction.

## 7. `methode.html`

```html
<title>Études sur la tontine et l’argent en Afrique, BRVM et méthode · EFA</title>
<meta name="description" content="Les études d’Éducation Financière Afrique sur la tontine et l’argent en Afrique, un simulateur de tontine, la BRVM expliquée et l’actualité économique, avec leurs sources.">
<link rel="canonical" href="https://efa.africa/methode.html">  <!-- ajouter -->
<meta property="og:url" content="https://efa.africa/methode.html">  <!-- ajouter -->
```

**Cinq H1** (un par onglet) : garder un seul `<h1>Études &amp; méthode d’EFA</h1>` en haut, passer les titres d'onglets en `<h2>`.

## 8. `auteur.html`

Déjà la meilleure page (canonical + JSON-LD Person). Seul point : **deux H1** → passer « Éducation Financière Afrique » en `<p>` ou `<h2>`. Ajouter `"@id": "https://efa.africa/auteur.html#elysee"` dans son JSON-LD Person pour le relier à l'Organisation.

## 9. Pages non présentes dans le projet

`preter-a-un-proche.html`, `preparer-ma-retraite.html`, `tribunes.html`, `ely.html` : appliquer le même schéma (title avec le mot-clé + « · EFA », description de 140–160 caractères avec FCFA/Afrique, canonical, og:url, un seul H1 statique).

Mots-clés cibles : « prêter de l’argent à un proche », « préparer sa retraite en Côte d’Ivoire », « finance africaine tribune ».

## 10. Après le dépôt (Search Console, déjà vérifiée)

1. Sitemaps → renvoyer `sitemap.xml`.
2. Inspection d'URL → `https://efa.africa/tontine.html` → « Demander l'indexation ». Idem pour l'accueil et ou-est-passe-mon-argent.
3. bing.com/webmasters → « Importer depuis Google Search Console ».
4. Tester : search.google.com/test/rich-results sur tontine.html (FAQ, fil d'Ariane, article).
