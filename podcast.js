/* LE PODCAST EFA · catalogue lu par podcast.html.
   Seul fichier à modifier pour publier un épisode.

   statut  : "publie"  → l'épisode se lit sur la page (audio, YouTube ou Spotify ci-dessous)
             "bientot" → en couleur, badge « Bientôt disponible », bouton « Me prévenir »
             "avenir"  → grisé, « Prochainement »
   audio   : chemin d'un fichier .mp3 publié sur le site (ex. "podcast/ep1.mp3"), lu directement sur la page
   youtube : identifiant de la vidéo YouTube (11 caractères après « v= » ou « youtu.be/ »)
   spotify : lien complet de l'épisode sur Spotify (facultatif)
   image   : visuel 1080 × 350 de l'épisode */
window.PODCAST = {
  nom: "Le podcast EFA",
  accroche: "L’argent, raconté en quelques minutes.",
  communaute: "https://chat.whatsapp.com/Dm1l569bAwlAa1honQiV3a",
  youtube: "https://www.youtube.com/@efaeducationfinanciereafrique",
  saisons: [
    {
      n: 1,
      titre: "Saison 1",
      episodes: [
        {
          n: 1,
          titre: "Cinq leçons d’un géant de la gestion d’actifs",
          resume: "Le dirigeant d’Invesco, l’un des plus grands gestionnaires d’actifs au monde, s’est livré dans un long entretien. Élysée Johnson en retient cinq leçons et les traduit pour nos poches : épargne, patience, risque, et ce qu’on peut appliquer avec quelques milliers de francs.",
          duree: "Dès 5 min",
          image: "podcast/ep1.jpg",
          statut: "publie",
          date: "2026-11-13",
          audio: "",
          youtube: "UP0kAKS8v4g",
          spotify: ""
        },
        {
          n: 2,
          titre: "Prochainement",
          resume: "Le deuxième épisode est en préparation.",
          duree: "",
          image: "podcast/ep2.jpg",
          statut: "avenir",
          date: "",
          audio: "",
          youtube: "",
          spotify: ""
        }
      ]
    }
  ]
};
