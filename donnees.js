/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "23/10/2026",
    source: "BRVM, cours de clôture du 23/10/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 521.99, 529.14, 1.37],
      ["BRVM 30", 252.87, 256.35, 1.38],
      ["BRVM Prestige", 193.5, 196.59, 1.6],
      ["BRVM Principal", 367.18, 369.06, 0.51]
    ],
    secteurs: [
      ["Consommation de base", 261.3, 0.67],
      ["Consommation discrétionnaire", 182.26, 0.54],
      ["Énergie", 155.2, -0.41],
      ["Industriels", 212.64, 0.8],
      ["Services financiers", 241.8, 0.63],
      ["Services publics", 220.73, 1.36],
      ["Télécommunications", 147.08, 2.7]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3100,0.65], ["BBGC","Bridge Bank Group","CI",10000,2.04],
      ["BICB","BIIC Bénin","BJ",8590,1.06], ["BICC","BICI Côte d'Ivoire","CI",31100,0.97],
      ["BNBC","Bernabé","CI",1750,-2.23], ["BOAB","Bank of Africa Bénin","BJ",9000,-0.28],
      ["BOABF","Bank of Africa Burkina","BF",7670,-0.52], ["BOAC","Bank of Africa CI","CI",11200,-0.18],
      ["BOAM","Bank of Africa Mali","ML",5500,-3.42], ["BOAN","Bank of Africa Niger","NE",4850,3.19],
      ["BOAS","Bank of Africa Sénégal","SN",8150,0.0], ["CABC","Sicable","CI",2995,0.34],
      ["CBIBF","Coris Bank International","BF",30900,0.0], ["CFAC","CFAO Motors","CI",1435,0.0],
      ["CIEC","CIE","CI",4885,-0.41], ["ECOC","Ecobank CI","CI",16380,2.7],
      ["ETIT","Ecobank Transnational","TG",64,0.0], ["FTSC","Filtisac","CI",1795,-0.28],
      ["LNBB","Loterie nationale du Bénin","BJ",4000,2.56], ["NEIC","NEI-CEDA","CI",2135,0.23],
      ["NSBC","NSIA Banque CI","CI",20700,0.0], ["NTLC","Nestlé CI","CI",13900,-4.34],
      ["ONTBF","Onatel Burkina","BF",3075,-0.49], ["ORAC","Orange CI","CI",20200,0.55],
      ["ORGT","Oragroup","TG",2770,-1.07], ["PALC","Palm CI","CI",7200,-4.0],
      ["PRSC","Tractafric Motors","CI",3800,-1.04], ["SAFC","Safca","CI",3875,1.44],
      ["SCRC","Sucrivoire","CI",2375,3.26], ["SDCC","SODE CI","CI",12300,6.03],
      ["SDSC","Africa Global Logistics","CI",3000,1.69], ["SEMC","Eviosys Packaging Siem","CI",1495,0.0],
      ["SGBC","Société Générale CI","CI",38950,0.13], ["SHEC","Vivo Energy CI","CI",2180,-0.46],
      ["SIBC","Société Ivoirienne de Banque","CI",8795,2.21], ["SICC","Sicor","CI",8400,0.0],
      ["SIVC","Erium","CI",1700,0.0], ["SLBC","Solibra","CI",38605,-1.01],
      ["SMBC","SMB","CI",14810,2.88], ["SNTS","Sonatel","SN",43850,4.4],
      ["SOGC","SOGB","CI",7600,0.0], ["SPHC","SAPH","CI",8000,4.99],
      ["STAC","Setao","CI",1900,-1.81], ["STBC","Sitab","CI",21200,-0.47],
      ["TTLC","TotalEnergies Marketing CI","CI",2895,-0.17], ["TTLS","TotalEnergies Marketing Sénégal","SN",3550,-3.79],
      ["UNLC","Unilever CI","CI",48360,7.47], ["UNXC","Uniwax","CI",2100,2.44]
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
