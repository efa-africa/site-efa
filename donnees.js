/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "27/10/2026",
    source: "BRVM, cours de clôture du 27/10/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 534.74, 532.09, -0.5],
      ["BRVM 30", 259.82, 258.19, -0.63],
      ["BRVM Prestige", 199.94, 198.86, -0.54],
      ["BRVM Principal", 365.2, 366.92, 0.47]
    ],
    secteurs: [
      ["Consommation de base", 258.59, 0.0],
      ["Consommation discrétionnaire", 180.36, 2.0],
      ["Énergie", 156.32, 0.39],
      ["Industriels", 202.87, -4.53],
      ["Services financiers", 241.02, 0.38],
      ["Services publics", 234.49, 7.48],
      ["Télécommunications", 150.14, -2.08]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3200,-0.31], ["BBGC","Bridge Bank Group","CI",9995,0.5],
      ["BICB","BIIC Bénin","BJ",8540,0.23], ["BICC","BICI Côte d'Ivoire","CI",31985,2.52],
      ["BNBC","Bernabé","CI",1725,0.0], ["BOAB","Bank of Africa Bénin","BJ",9300,2.54],
      ["BOABF","Bank of Africa Burkina","BF",8100,5.74], ["BOAC","Bank of Africa CI","CI",11290,0.62],
      ["BOAM","Bank of Africa Mali","ML",5700,-1.72], ["BOAN","Bank of Africa Niger","NE",5000,-0.99],
      ["BOAS","Bank of Africa Sénégal","SN",8195,0.49], ["CABC","Sicable","CI",2985,0.0],
      ["CBIBF","Coris Bank International","BF",31305,1.31], ["CFAC","CFAO Motors","CI",1415,4.81],
      ["CIEC","CIE","CI",5250,7.47], ["ECOC","Ecobank CI","CI",16250,0.0],
      ["ETIT","Ecobank Transnational","TG",61,-3.17], ["FTSC","Filtisac","CI",1725,-3.9],
      ["LNBB","Loterie nationale du Bénin","BJ",3945,-1.25], ["NEIC","NEI-CEDA","CI",2100,-0.47],
      ["NSBC","NSIA Banque CI","CI",19000,-0.78], ["NTLC","Nestlé CI","CI",13695,-1.47],
      ["ONTBF","Onatel Burkina","BF",3050,-0.33], ["ORGT","Oragroup","TG",2715,-1.81],
      ["PALC","Palm CI","CI",7500,0.0], ["PRSC","Tractafric Motors","CI",3790,-0.26],
      ["SAFC","Safca","CI",3810,0.0], ["SCRC","Sucrivoire","CI",2220,-7.5],
      ["SDCC","SODE CI","CI",12690,7.5], ["SDSC","Africa Global Logistics","CI",2810,-6.33],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38950,0.01],
      ["SHEC","Vivo Energy CI","CI",2130,-2.07], ["SIBC","Société Ivoirienne de Banque","CI",8890,2.18],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1670,-1.76],
      ["SLBC","Solibra","CI",38705,0.26], ["SMBC","SMB","CI",14500,-2.03],
      ["SOGC","SOGB","CI",7900,3.95], ["SPHC","SAPH","CI",8000,0.0],
      ["STAC","Setao","CI",1795,-5.03], ["STBC","Sitab","CI",21200,0.0],
      ["TTLC","TotalEnergies Marketing CI","CI",2995,3.1], ["TTLS","TotalEnergies Marketing Sénégal","SN",3650,1.39],
      ["UNLC","Unilever CI","CI",45200,0.0], ["UNXC","Uniwax","CI",2060,-1.9]
    ]
  },

  pays: {CI:"Côte d'Ivoire",SN:"Sénégal",BF:"Burkina Faso",BJ:"Bénin",ML:"Mali",NE:"Niger",TG:"Togo"},

  // Chiffres clés des études EFA (bandeau)
  etudes: [
    ["Tontines qui redistribuent tout", "71 %"],
    ["Rien de durable après le dernier tour", "47 %"],
    ["Durable si le tour finance une activité", "65 %"],
    ["… s'il couvre les dépenses courantes", "29 %"],
    ["Tontines rotatives", "83 %"],
    ["Règles orales", "43 %"],
    ["Réserve collective citée comme motivation", "2 %"],
    ["Répondants · participants", "251 · 160"]
  ],

  // Veille EFA News : chiffres vérifiés, avec leur source
  veille: [
    {code:"MMCM", pays:"Cameroun", rubrique:"Paiements", date:"15/10/2026",
     titre:"Le mobile money rapporte… aux opérateurs",
     chiffre:"21,5 Md FCFA", legende:"d'intérêts perçus en 2025 par les deux principaux opérateurs sur l'argent des clients placé en banque",
     points:[["1er opérateur",11.6],["2e opérateur",9.9]], unite:"Md FCFA",
     note:"La règle CEMAC réserve ces intérêts à l'opérateur et interdit d'en verser au client. Le mobile money sert à payer, pas à épargner.",
     source:"Rapport CNEF 2025 (données COBAC), via Investir au Cameroun, 15/10/2026"},
    {code:"BUCI", pays:"Côte d'Ivoire", rubrique:"Finances publiques", date:"14/10/2026",
     titre:"Le projet de budget 2027",
     chiffre:"18 466,1 Md FCFA", legende:"projet de loi de finances 2027, +6,4 % sur 2026",
     points:[["Budget 2026",17350.2],["Projet 2027",18466.1]], unite:"Md FCFA",
     note:"Déficit visé : 3,5 % du PIB (3,8 % en 2026). C'est un projet : les montants peuvent changer au vote.",
     source:"Conseil des ministres du 14/10/2026, AIP, Sika Finance"},
    {code:"INNG", pays:"Nigeria", rubrique:"Vie chère", date:"15/10/2026",
     titre:"Les prix ralentissent, sauf au marché",
     chiffre:"19,59 %", legende:"inflation alimentaire sur un an en septembre 2026",
     points:[["Inflation globale",14.63],["Sous-jacente",12.95],["Alimentaire",19.59]], unite:"%",
     note:"La moyenne cache le panier : une famille qui dépense surtout pour se nourrir subit une inflation plus forte.",
     source:"NBS, IPC de septembre 2026, via Daily Trust, 15/10/2026"},
    {code:"EBGA", pays:"Gabon", rubrique:"Dette", date:"15/10/2026",
     titre:"Emprunter en dollars coûte cher",
     chiffre:"9,375 %", legende:"taux de l'eurobond de 580 M$ sur 8 ans émis le 14 octobre",
     points:[["Juillet 2026",920],["Octobre 2026",580]], unite:"M$",
     note:"Environ 54,4 M$ d'intérêts par an sur ce seul emprunt. 1,5 Md$ empruntés à l'international en 2026.",
     source:"Ministère de l'Économie du Gabon, via Agence Ecofin, 15/10/2026"}
  ]
};

/* Règles éditoriales : certaines sociétés ne figurent dans aucun contenu d'EFA (cote, palmarès, bandeaux).
   Le filtre s'applique ici, à la source, pour toutes les pages qui lisent ces données. */
(function () {
  var EXCLUS = ["SNTS", "ORAC"], b = window.EFA_DATA && window.EFA_DATA.brvm;
  if (!b) return;
  Object.keys(b).forEach(function (k) {
    if (Array.isArray(b[k])) b[k] = b[k].filter(function (l) { return !(Array.isArray(l) && EXCLUS.indexOf(l[0]) >= 0); });
  });
})();
