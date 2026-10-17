/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "16/10/2026",
    source: "BRVM, cours de clôture du 16/10/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 537.67, 532.61, -0.94],
      ["BRVM 30", 260.32, 257.54, -1.07],
      ["BRVM Prestige", 200.13, 196.95, -1.59],
      ["BRVM Principal", 373.12, 373.67, 0.15]
    ],
    secteurs: [
      ["Consommation de base", 258.76, -1.01],
      ["Consommation discrétionnaire", 185.05, 3.05],
      ["Énergie", 161.21, 0.67],
      ["Industriels", 209.32, -3.19],
      ["Services financiers", 243.32, -0.07],
      ["Services publics", 253.27, -2.03],
      ["Télécommunications", 147.46, -2.16]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3000,-3.23],["BBGC","Bridge Bank Group","CI",10390,-1.00],
      ["BICB","BIIC Bénin","BJ",8400,0.00],["BICC","BICI Côte d'Ivoire","CI",32400,4.21],
      ["BNBC","Bernabé","CI",1805,1.69],["BOAB","Bank of Africa Bénin","BJ",9000,-2.23],
      ["BOABF","Bank of Africa Burkina","BF",8010,0.00],["BOAC","Bank of Africa CI","CI",11395,0.13],
      ["BOAM","Bank of Africa Mali","ML",5700,0.00],["BOAN","Bank of Africa Niger","NE",4700,0.53],
      ["BOAS","Bank of Africa Sénégal","SN",8150,0.06],["CABC","Sicable","CI",3000,-1.64],
      ["CBIBF","Coris Bank International","BF",31500,1.61],["CFAC","CFAO Motors","CI",1450,7.41],
      ["CIEC","CIE","CI",5800,-2.52],["ECOC","Ecobank CI","CI",15900,-0.62],
      ["ETIT","Ecobank Transnational","TG",65,0.00],["FTSC","Filtisac","CI",1800,0.00],
      ["LNBB","Loterie nationale du Bénin","BJ",4000,-1.96],["NEIC","NEI-CEDA","CI",2105,-1.64],
      ["NSBC","NSIA Banque CI","CI",20510,-1.39],["NTLC","Nestlé CI","CI",14700,-5.16],
      ["ONTBF","Onatel Burkina","BF",2995,3.28],["ORAC","Orange CI","CI",20600,-4.19],
      ["ORGT","Oragroup","TG",2780,-1.07],["PALC","Palm CI","CI",7600,-1.04],
      ["PRSC","Tractafric Motors","CI",4290,0.94],["SAFC","Safca","CI",3900,0.00],
      ["SCRC","Sucrivoire","CI",2270,-3.20],["SDCC","SODE CI","CI",12900,-0.65],
      ["SDSC","Africa Global Logistics","CI",2870,-6.36],["SEMC","Eviosys Packaging Siem","CI",1495,0.00],
      ["SGBC","Société Générale CI","CI",39005,0.03],["SHEC","Vivo Energy CI","CI",2190,0.00],
      ["SIBC","Société Ivoirienne de Banque","CI",8725,-1.97],["SICC","Sicor","CI",8400,0.00],
      ["SIVC","Erium","CI",1790,0.00],["SLBC","Solibra","CI",38500,0.03],
      ["SMBC","SMB","CI",15395,-0.68],["SNTS","Sonatel","SN",43500,-0.91],
      ["SOGC","SOGB","CI",7415,-3.70],["SPHC","SAPH","CI",7600,-2.56],
      ["STAC","Setao","CI",2030,6.56],["STBC","Sitab","CI",21350,0.71],
      ["TTLC","TotalEnergies Marketing CI","CI",3100,3.33],["TTLS","TotalEnergies Marketing Sénégal","SN",3650,-1.35],
      ["UNLC","Unilever CI","CI",45000,1.33],["UNXC","Uniwax","CI",2145,-1.61]
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
     chiffre:"21,5 Md FCFA", legende:"d'intérêts perçus en 2025 par Orange Money et MTN MoMo sur l'argent des clients placé en banque",
     points:[["Orange Money",9.9],["MTN MoMo",11.6]], unite:"Md FCFA",
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
