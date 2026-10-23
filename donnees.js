/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "22/10/2026",
    source: "BRVM, cours de clôture du 22/10/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 520.27, 521.99, 0.33],
      ["BRVM 30", 252.04, 252.87, 0.33],
      ["BRVM Prestige", 192.83, 193.50, 0.35],
      ["BRVM Principal", 366.64, 367.18, 0.15]
    ],
    secteurs: [
      ["Consommation de base", 259.57, 0.09],
      ["Consommation discrétionnaire", 181.29, -0.93],
      ["Énergie", 155.84, 0.19],
      ["Industriels", 210.96, 0.08],
      ["Services financiers", 240.28, 0.22],
      ["Services publics", 217.76, -1.39],
      ["Télécommunications", 143.22, 0.74]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3080,2.67],["BBGC","Bridge Bank Group","CI",9800,2.08],
      ["BICB","BIIC Bénin","BJ",8500,0.00],["BICC","BICI Côte d'Ivoire","CI",30800,0.00],
      ["BNBC","Bernabé","CI",1790,4.07],["BOAB","Bank of Africa Bénin","BJ",9025,-0.72],
      ["BOABF","Bank of Africa Burkina","BF",7710,-1.22],["BOAC","Bank of Africa CI","CI",11220,-0.27],
      ["BOAM","Bank of Africa Mali","ML",5695,0.00],["BOAN","Bank of Africa Niger","NE",4700,-1.67],
      ["BOAS","Bank of Africa Sénégal","SN",8150,1.12],["CABC","Sicable","CI",2985,-0.17],
      ["CBIBF","Coris Bank International","BF",30900,-0.32],["CFAC","CFAO Motors","CI",1435,-0.35],
      ["CIEC","CIE","CI",4905,-1.90],["ECOC","Ecobank CI","CI",15950,0.31],
      ["ETIT","Ecobank Transnational","TG",64,1.59],["FTSC","Filtisac","CI",1800,0.00],
      ["LNBB","Loterie nationale du Bénin","BJ",3900,-2.38],["NEIC","NEI-CEDA","CI",2130,0.00],
      ["NSBC","NSIA Banque CI","CI",20700,0.10],["NTLC","Nestlé CI","CI",14530,0.00],
      ["ONTBF","Onatel Burkina","BF",3090,0.16],["ORAC","Orange CI","CI",20090,0.95],
      ["ORGT","Oragroup","TG",2800,0.72],["PALC","Palm CI","CI",7500,0.00],
      ["PRSC","Tractafric Motors","CI",3840,-7.47],["SAFC","Safca","CI",3820,-1.80],
      ["SCRC","Sucrivoire","CI",2300,6.98],["SDCC","SODE CI","CI",11600,-0.04],
      ["SDSC","Africa Global Logistics","CI",2950,0.00],["SEMC","Eviosys Packaging Siem","CI",1495,0.00],
      ["SGBC","Société Générale CI","CI",38900,-0.26],["SHEC","Vivo Energy CI","CI",2190,1.39],
      ["SIBC","Société Ivoirienne de Banque","CI",8605,0.06],["SICC","Sicor","CI",8400,0.00],
      ["SIVC","Erium","CI",1700,5.59],["SLBC","Solibra","CI",39000,0.03],
      ["SMBC","SMB","CI",14395,-0.76],["SNTS","Sonatel","SN",42000,0.61],
      ["SOGC","SOGB","CI",7600,-1.94],["SPHC","SAPH","CI",7620,0.26],
      ["STAC","Setao","CI",1935,-2.03],["STBC","Sitab","CI",21300,0.71],
      ["TTLC","TotalEnergies Marketing CI","CI",2900,0.17],["TTLS","TotalEnergies Marketing Sénégal","SN",3690,-0.27],
      ["UNLC","Unilever CI","CI",45000,-0.24],["UNXC","Uniwax","CI",2050,0.00]
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
