/* EFA · À LA UNE · ce que l'accueil de l'appli met en avant.
   Seul fichier à modifier pour changer les nouveautés et les outils poussés : l'appli le lit à chaque ouverture.
   - nouveautes : du plus récent au plus ancien. date au format AAAA-MM-JJ. url = page du site (sans « https://efa.africa/ »).
   - outils     : les outils que l'on veut pousser en ce moment, dans l'ordre.
   Les derniers articles d'EFA News, le dernier épisode de Min'Fin et la dernière Tribune s'ajoutent tout seuls. */
window.EFA_A_LA_UNE = {
  nouveautes: [
    { date: "2026-10-29", k: "Nouveau", titre: "Le musée de l’économie", texte: "Dix mille ans d’économie africaine en douze salles, de la vallée du Nil à la Bourse de Lagos.", url: "balade-economie.html?src=appli#musee" },
    { date: "2026-10-29", k: "Nouveau", titre: "Mon cahier, au même endroit", texte: "Votre école, vos défis, vos décisions suivies, vos fiches et vos notes : tout se retrouve dans « Mon cahier ».", vue: "moncahier" },
    { date: "2026-10-28", k: "Bibliothèque", titre: "Les capitaines d’industrie", texte: "Douze bâtisseurs africains, leur idée maîtresse et ce qu’on en retient pour son argent.", url: "bibliotheque.html?src=appli#capitaines" },
    { date: "2026-10-28", k: "Organisations", titre: "Un programme pour vos membres", texte: "Entreprises, écoles, communautés : composez un parcours à vos couleurs et suivez la progression.", url: "organisations.html?src=appli" }
  ],
  outils: [
    { titre: "Où est passé mon argent ?", texte: "Cinq questions, vos pistes en trois minutes", url: "ou-est-passe-mon-argent.html?src=appli#questions" },
    { titre: "Prêter à un proche", texte: "Décider avant de dire oui", url: "preter-a-un-proche.html?src=appli&entree=cas" },
    { titre: "Avant de cotiser", texte: "Les douze questions à poser à sa tontine", url: "avant-de-cotiser.html?src=appli" },
    { titre: "Une année en Bourse", texte: "La BRVM en simulation, sans risquer un franc", url: "ecole-bourse.html?src=appli" },
    { titre: "Préparer ma retraite", texte: "Où en êtes-vous, en six questions", url: "preparer-ma-retraite.html?src=appli" }
  ]
};
