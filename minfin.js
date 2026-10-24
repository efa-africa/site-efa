/* MIN'FIN · catalogue de la série, lu par minfin.html.
   Seul fichier à modifier pour ajouter un épisode ou un lien vidéo.

   youtube : identifiant de la vidéo YouTube (les 11 caractères après « shorts/ » ou « v= »).
             Exemple : pour https://youtube.com/shorts/AbCdEfGhIjK, mettre "AbCdEfGhIjK".
             Rempli : la vidéo se lit directement sur la page.
             Vide : le bouton ouvre la chaîne YouTube d'EFA.
   tiktok  : lien complet de la vidéo TikTok (facultatif).
   statut  : "publie" (visible et regardable), "bientot" (affiché « Bientôt »), "reserve" (non affiché). */
window.MINFIN = {
  chaine: "https://www.youtube.com/@efaeducationfinanciereafrique/shorts",
  tiktok: "https://www.tiktok.com/@efa.afrique",
  saisons: [
    {
      n: 1,
      titre: "Le million de Koffi",
      resume: "Koffi est salarié à Abidjan. Il gagne bien sa vie, soutient sa famille, cotise en tontine… et ne sait jamais où passe son argent. Une saison pour comprendre pourquoi l'argent tourne sans rester.",
      episodes: [
        {n: 1, titre: "Où est passé votre argent ?", notion: "L'argent qui file sans qu'on sache où", image: "koffi.jpg", duree: "1 min", statut: "publie", youtube: "TLPBoOPa5L0", tiktok: ""},
        {n: 2, titre: "+200 000 FCFA de salaire. Toujours rien ?", notion: "Quand le train de vie monte aussi vite que le salaire", image: "koffi.jpg", duree: "1 min", statut: "publie", youtube: "MqusG9AAdCI", tiktok: ""},
        {n: 3, titre: "Prêter à un proche : prêt ou cadeau ?", notion: "Ce que coûte vraiment un prêt dans la famille", image: "koffi.jpg", duree: "1 min", statut: "publie", youtube: "", tiktok: ""},
        {n: 4, titre: "1 000 000 de tontine. Trois semaines plus tard ?", notion: "Le tour n'est pas un gain : c'est votre argent, plus une avance du groupe", image: "app/bamba.jpg", duree: "54 s", statut: "bientot", youtube: "", tiktok: ""},
        {n: 5, titre: "Un proche vous demande 50 000. Vous dites oui ?", notion: "Regarder ce qui est déjà engagé avant de dire oui", image: "koffi.jpg", duree: "1 min", statut: "bientot", youtube: "", tiktok: ""},
        {n: 6, titre: "Emprunter pour cotiser ?", notion: "Recevoir le tour n'efface pas la dette", image: "app/bamba.jpg", duree: "46 s", statut: "reserve", youtube: "", tiktok: ""}
      ]
    }
  ],
  personnages: [
    {nom: "Koffi", image: "koffi.jpg", role: "Salarié à Abidjan, l'aîné de la famille. Il cotise en tontine et soutient tout le monde."},
    {nom: "Tonton Bamba", image: "app/bamba.jpg", role: "Son mentor. C'est lui qui donne la règle, toujours en une phrase."},
    {nom: "Tantie Affoué", image: "app/affoue.jpg", role: "Sa tante, commerçante à Abobo. Vingt ans de tontines, jamais une cotisation ratée."}
  ]
};
