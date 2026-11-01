/* Réglages du diagnostic EFA (site v2). Seul fichier à modifier pour changer la clé, la version ou le formulaire Brevo.
   Rien ici n'est secret : tout visiteur peut lire ce fichier. Ne jamais y mettre de clé d'API. */
window.EFA_CONFIG = {
  // Version du questionnaire, enregistrée avec chaque diagnostic (dans EFA_DETAIL).
  VERSION: "1.0",

  // Clé d'accès au parcours 1 « Assainir ». Elle filtre, elle ne verrouille pas.
  CLE_P1: "EFA-ASSAINIR",

  // Adresse publique, utilisée par le bouton de partage. Vide = adresse de la page en cours.
  LIEN_PUBLIC: "",

  SUBSTACK: "https://educationfinanciereafrique.substack.com",
  GUIDE: "index.html#guide",

  // true = une première synthèse s'affiche avant l'email (situation, point d'appui, priorité) ; false = l'email est demandé avant tout résultat.
  APERCU: true,

  // Adresse pour les demandes de suppression.
  CONTACT: "newsletter@efa.africa",

  // Formulaire Brevo « Diagnostic EFA test 2 » (liste #3). Vide = mode local, rien n'est envoyé.
  // Champs du formulaire : EMAIL, EFA_PROFIL, EFA_SCORE, EFA_REPONSES, et EFA_DETAIL (bloc à ajouter sur ordinateur).
  BREVO_URL: "https://b46b1615.sibforms.com/serve/MUIFACVKrrzAejdFTf7fjSmbEWmeEpDLlvJv6fz5rNzzcpOjiGf1s2QIrACyH5qzal4L1gaT2UkJ0IuXg3-Pt0x2BV66Oh771_vK-04Dxoi4_p4nYnErjNXdJb5_T5taqweO2TL8Fdh7na8Gjz368F2mnWogvfcnrkqc2xUXMaUKl_Mx-EFCPOp8M-OWNyOL05--VBO8midcFSCv_w==",

  // Vitrine des SGI : adresse du Worker « vitrine » (comptage anonyme des vues et des clics). Vide = rien n'est envoyé.
  VITRINE_URL: "https://vitrine.elysees-johnson.workers.dev",
  // Cloudflare Turnstile (anti-robot du bouton « Contacter la SGI »). Vide = pas de contrôle.
  TURNSTILE_SITEKEY: ""
};
