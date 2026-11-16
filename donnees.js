/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "16/11/2026",
    source: "BRVM, cours de clôture du 16/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 515.94, 512.85, -0.6],
      ["BRVM 30", 249.28, 247.92, -0.55],
      ["BRVM Prestige", 191.6, 190.89, -0.37],
      ["BRVM Principal", 364.34, 359.75, -1.26]
    ],
    secteurs: [
      ["Consommation de base", 260.9, -1.79],
      ["Consommation discrétionnaire", 168.44, 0.8],
      ["Énergie", 163.29, -2.24],
      ["Industriels", 203.8, 0.51],
      ["Services financiers", 234.94, -1.05],
      ["Services publics", 220.7, -3.27],
      ["Télécommunications", 140.22, 0.49]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3165,-1.71], ["BBGC","Bridge Bank Group","CI",9400,-0.53],
      ["BICB","BIIC Bénin","BJ",8005,0.69], ["BICC","BICI Côte d'Ivoire","CI",32695,-0.32],
      ["BNBC","Bernabé","CI",1770,2.61], ["BOAB","Bank of Africa Bénin","BJ",9200,-2.13],
      ["BOABF","Bank of Africa Burkina","BF",7900,-0.63], ["BOAC","Bank of Africa CI","CI",11500,-4.09],
      ["BOAM","Bank of Africa Mali","ML",5595,-1.93], ["BOAN","Bank of Africa Niger","NE",4850,-1.52],
      ["BOAS","Bank of Africa Sénégal","SN",8350,0.12], ["CABC","Sicable","CI",2850,-2.06],
      ["CBIBF","Coris Bank International","BF",31495,-1.55], ["CFAC","CFAO Motors","CI",1285,1.98],
      ["CIEC","CIE","CI",4900,-3.92], ["ECOC","Ecobank CI","CI",15345,-1.0],
      ["ETIT","Ecobank Transnational","TG",59,0.0], ["FTSC","Filtisac","CI",1695,-0.29],
      ["LNBB","Loterie nationale du Bénin","BJ",3800,0.0], ["NEIC","NEI-CEDA","CI",1975,0.51],
      ["NSBC","NSIA Banque CI","CI",16600,-2.38], ["NTLC","Nestlé CI","CI",13095,-0.42],
      ["ONTBF","Onatel Burkina","BF",2900,0.0], ["ORGT","Oragroup","TG",2550,-2.49],
      ["PALC","Palm CI","CI",7600,-0.59], ["PRSC","Tractafric Motors","CI",3750,-1.06],
      ["SAFC","Safca","CI",3600,-1.37], ["SCRC","Sucrivoire","CI",1545,-0.64],
      ["SDCC","SODE CI","CI",12200,-1.61], ["SDSC","Africa Global Logistics","CI",2780,0.0],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",39450,1.54],
      ["SHEC","Vivo Energy CI","CI",2110,-2.76], ["SIBC","Société Ivoirienne de Banque","CI",8515,-4.22],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1685,-0.88],
      ["SLBC","Solibra","CI",42290,-1.54], ["SMBC","SMB","CI",17605,-2.19],
      ["SOGC","SOGB","CI",7500,-4.46], ["SPHC","SAPH","CI",7800,-2.38],
      ["STAC","Setao","CI",2090,7.46], ["STBC","Sitab","CI",21300,-0.7],
      ["TTLC","TotalEnergies Marketing CI","CI",3000,-3.23], ["TTLS","TotalEnergies Marketing Sénégal","SN",3695,-0.14],
      ["UNLC","Unilever CI","CI",45000,-3.23], ["UNXC","Uniwax","CI",1875,-0.79]
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
