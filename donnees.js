/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "17/11/2026",
    source: "BRVM, cours de clôture du 17/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 512.85, 502.68, -1.98],
      ["BRVM 30", 247.92, 243.13, -1.93],
      ["BRVM Prestige", 190.89, 188.19, -1.41],
      ["BRVM Principal", 359.75, 350.14, -2.67]
    ],
    secteurs: [
      ["Consommation de base", 253.59, -2.8],
      ["Consommation discrétionnaire", 165.39, -1.81],
      ["Énergie", 159.33, -2.43],
      ["Industriels", 195.12, -4.26],
      ["Services financiers", 230.52, -1.88],
      ["Services publics", 207.43, -6.01],
      ["Télécommunications", 138.08, -1.53]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3100,-2.05], ["BBGC","Bridge Bank Group","CI",9000,-4.26],
      ["BICB","BIIC Bénin","BJ",7960,-0.56], ["BICC","BICI Côte d'Ivoire","CI",32200,-1.51],
      ["BNBC","Bernabé","CI",1770,0.0], ["BOAB","Bank of Africa Bénin","BJ",9100,-1.09],
      ["BOABF","Bank of Africa Burkina","BF",7815,-1.08], ["BOAC","Bank of Africa CI","CI",11300,-1.74],
      ["BOAM","Bank of Africa Mali","ML",5400,-3.49], ["BOAN","Bank of Africa Niger","NE",4490,-7.42],
      ["BOAS","Bank of Africa Sénégal","SN",7800,-6.59], ["CABC","Sicable","CI",2760,-3.16],
      ["CBIBF","Coris Bank International","BF",31005,-1.56], ["CFAC","CFAO Motors","CI",1260,-1.95],
      ["CIEC","CIE","CI",4600,-6.12], ["ECOC","Ecobank CI","CI",15000,-2.25],
      ["ETIT","Ecobank Transnational","TG",58,-1.69], ["FTSC","Filtisac","CI",1690,-0.29],
      ["LNBB","Loterie nationale du Bénin","BJ",3800,0.0], ["NEIC","NEI-CEDA","CI",1900,-3.8],
      ["NSBC","NSIA Banque CI","CI",15895,-4.25], ["NTLC","Nestlé CI","CI",13000,-0.73],
      ["ONTBF","Onatel Burkina","BF",2900,0.0], ["ORGT","Oragroup","TG",2550,0.0],
      ["PALC","Palm CI","CI",7500,-1.32], ["PRSC","Tractafric Motors","CI",3730,-0.53],
      ["SAFC","Safca","CI",3595,-0.14], ["SCRC","Sucrivoire","CI",1450,-6.15],
      ["SDCC","SODE CI","CI",11500,-5.74], ["SDSC","Africa Global Logistics","CI",2580,-7.19],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38955,-1.25],
      ["SHEC","Vivo Energy CI","CI",2030,-3.79], ["SIBC","Société Ivoirienne de Banque","CI",8500,-0.18],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1680,-0.3],
      ["SLBC","Solibra","CI",39495,-6.61], ["SMBC","SMB","CI",16450,-6.56],
      ["SOGC","SOGB","CI",7500,0.0], ["SPHC","SAPH","CI",7700,-1.28],
      ["STAC","Setao","CI",2085,-0.24], ["STBC","Sitab","CI",21090,-0.99],
      ["TTLC","TotalEnergies Marketing CI","CI",3000,0.0], ["TTLS","TotalEnergies Marketing Sénégal","SN",3695,0.0],
      ["UNLC","Unilever CI","CI",44300,-1.56], ["UNXC","Uniwax","CI",1785,-4.8]
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
