/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "06/11/2026",
    source: "BRVM, cours de clôture du 06/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 520.2, 520.74, 0.1],
      ["BRVM 30", 251.61, 251.79, 0.07],
      ["BRVM Prestige", 193.88, 194.71, 0.43],
      ["BRVM Principal", 364.26, 365.22, 0.26]
    ],
    secteurs: [
      ["Consommation de base", 259.54, 0.31],
      ["Consommation discrétionnaire", 168.71, 0.75],
      ["Énergie", 166.3, 1.25],
      ["Industriels", 208.47, 3.52],
      ["Services financiers", 240.12, 0.67],
      ["Services publics", 231.9, -0.9],
      ["Télécommunications", 141.93, -0.84]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3400,0.15], ["BBGC","Bridge Bank Group","CI",9550,-0.52],
      ["BICB","BIIC Bénin","BJ",8100,0.0], ["BICC","BICI Côte d'Ivoire","CI",32000,0.02],
      ["BNBC","Bernabé","CI",1895,-3.81], ["BOAB","Bank of Africa Bénin","BJ",9400,-1.0],
      ["BOABF","Bank of Africa Burkina","BF",7960,-0.5], ["BOAC","Bank of Africa CI","CI",11995,0.29],
      ["BOAM","Bank of Africa Mali","ML",5890,0.0], ["BOAN","Bank of Africa Niger","NE",5000,0.0],
      ["BOAS","Bank of Africa Sénégal","SN",8350,-0.36], ["CABC","Sicable","CI",2790,4.1],
      ["CBIBF","Coris Bank International","BF",32575,0.0], ["CFAC","CFAO Motors","CI",1255,0.4],
      ["CIEC","CIE","CI",5200,-1.89], ["ECOC","Ecobank CI","CI",16045,3.45],
      ["ETIT","Ecobank Transnational","TG",60,1.69], ["FTSC","Filtisac","CI",1715,2.08],
      ["LNBB","Loterie nationale du Bénin","BJ",3935,3.96], ["NEIC","NEI-CEDA","CI",1850,0.82],
      ["NSBC","NSIA Banque CI","CI",17505,-0.23], ["NTLC","Nestlé CI","CI",13150,0.38],
      ["ONTBF","Onatel Burkina","BF",3030,1.34], ["ORGT","Oragroup","TG",2650,1.73],
      ["PALC","Palm CI","CI",8000,7.31], ["PRSC","Tractafric Motors","CI",3620,-0.96],
      ["SAFC","Safca","CI",3750,-1.32], ["SCRC","Sucrivoire","CI",1720,-7.03],
      ["SDCC","SODE CI","CI",12500,1.75], ["SDSC","Africa Global Logistics","CI",2930,4.64],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",39495,0.75],
      ["SHEC","Vivo Energy CI","CI",2200,3.77], ["SIBC","Société Ivoirienne de Banque","CI",8795,1.09],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1690,-0.59],
      ["SLBC","Solibra","CI",39120,0.05], ["SMBC","SMB","CI",17905,0.03],
      ["SOGC","SOGB","CI",7650,-0.65], ["SPHC","SAPH","CI",8000,0.0],
      ["STAC","Setao","CI",1950,5.41], ["STBC","Sitab","CI",21195,0.21],
      ["TTLC","TotalEnergies Marketing CI","CI",3040,1.16], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,0.0],
      ["UNLC","Unilever CI","CI",47500,0.0], ["UNXC","Uniwax","CI",2020,0.25]
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
