/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "18/11/2026",
    source: "BRVM, cours de clôture du 18/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 502.68, 500.95, -0.34],
      ["BRVM 30", 243.13, 243.09, -0.02],
      ["BRVM Prestige", 188.19, 187.78, -0.22],
      ["BRVM Principal", 350.14, 348.27, -0.53]
    ],
    secteurs: [
      ["Consommation de base", 254.33, 0.29],
      ["Consommation discrétionnaire", 163.22, -1.31],
      ["Énergie", 158.82, -0.32],
      ["Industriels", 198.05, 1.5],
      ["Services financiers", 228.94, -0.69],
      ["Services publics", 206.53, -0.43],
      ["Télécommunications", 137.88, -0.14]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3120,0.65], ["BBGC","Bridge Bank Group","CI",8700,-3.33],
      ["BICB","BIIC Bénin","BJ",7995,0.44], ["BICC","BICI Côte d'Ivoire","CI",31200,-3.11],
      ["BNBC","Bernabé","CI",1770,0.0], ["BOAB","Bank of Africa Bénin","BJ",9050,-0.55],
      ["BOABF","Bank of Africa Burkina","BF",7790,-0.32], ["BOAC","Bank of Africa CI","CI",11395,0.84],
      ["BOAM","Bank of Africa Mali","ML",5385,-0.28], ["BOAN","Bank of Africa Niger","NE",4200,-6.46],
      ["BOAS","Bank of Africa Sénégal","SN",8145,4.42], ["CABC","Sicable","CI",2750,-0.36],
      ["CBIBF","Coris Bank International","BF",30800,-0.66], ["CFAC","CFAO Motors","CI",1245,-1.19],
      ["CIEC","CIE","CI",4450,-3.26], ["ECOC","Ecobank CI","CI",14990,-0.07],
      ["ETIT","Ecobank Transnational","TG",57,-1.72], ["FTSC","Filtisac","CI",1670,-1.18],
      ["LNBB","Loterie nationale du Bénin","BJ",3800,0.0], ["NEIC","NEI-CEDA","CI",1900,0.0],
      ["NSBC","NSIA Banque CI","CI",15800,-0.6], ["NTLC","Nestlé CI","CI",12500,-3.85],
      ["ONTBF","Onatel Burkina","BF",2900,0.0], ["ORGT","Oragroup","TG",2585,1.37],
      ["PALC","Palm CI","CI",7555,0.73], ["PRSC","Tractafric Motors","CI",3500,-6.17],
      ["SAFC","Safca","CI",3505,-2.5], ["SCRC","Sucrivoire","CI",1385,-4.48],
      ["SDCC","SODE CI","CI",12260,6.61], ["SDSC","Africa Global Logistics","CI",2700,4.65],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38950,-0.01],
      ["SHEC","Vivo Energy CI","CI",1900,-6.4], ["SIBC","Société Ivoirienne de Banque","CI",8400,-1.18],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1650,-1.79],
      ["SLBC","Solibra","CI",41900,6.09], ["SMBC","SMB","CI",17250,4.86],
      ["SOGC","SOGB","CI",7500,0.0], ["SPHC","SAPH","CI",7795,1.23],
      ["STAC","Setao","CI",1935,-7.19], ["STBC","Sitab","CI",21450,1.71],
      ["TTLC","TotalEnergies Marketing CI","CI",3000,0.0], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,0.14],
      ["UNLC","Unilever CI","CI",40980,-7.49], ["UNXC","Uniwax","CI",1735,-2.8]
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
