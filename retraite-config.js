/* « Préparer ma retraite » · paramètres EFA
   Les hypothèses sont pédagogiques et modifiables ici, sans toucher au code.
   Aucune règle légale de pension n'est codée : les informations par pays ne s'affichent
   qu'après vérification par EFA, avec leur source et leur date. */
window.RETRAITE_CONFIG = {
  // Rendement réel annuel (inflation déduite) de chaque scénario. Jamais une promesse.
  SCENARIOS: [
    {id: "prudent", t: "Prudent", r: 0},
    {id: "intermediaire", t: "Intermédiaire", r: 0.01},
    {id: "favorable", t: "Favorable", r: 0.02}
  ],
  // Parité fixe du franc CFA avec l'euro. Le dollar est toujours saisi par l'utilisateur.
  EUR_FCFA: 655.957,
  // Durées de retraite proposées, en années
  DUREES: [15, 20, 25],
  // Âges proposés en raccourci : ce ne sont pas des âges légaux
  AGES_ARRET: [55, 60, 62, 65],
  /* Paramètres par pays : à remplir uniquement après vérification.
     Format : { CI: { nom: "Côte d’Ivoire", caisses: [{ nom: "…", lien: "https://…", releve: "comment demander un relevé de carrière" }],
                      source: "https://…", verifie_le: "AAAA-MM-JJ" } }
     Tant qu'un pays n'est pas vérifié, rien ne s'affiche pour lui. */
  PAYS: {}
};
