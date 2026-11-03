/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "03/11/2026",
    source: "BRVM, cours de clôture du 03/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 525.3, 529.41, 0.78],
      ["BRVM 30", 254.21, 256.5, 0.9],
      ["BRVM Prestige", 195.63, 198.02, 1.22],
      ["BRVM Principal", 366.29, 365.44, -0.23]
    ],
    secteurs: [
      ["Consommation de base", 259.62, 0.62],
      ["Consommation discrétionnaire", 172.62, -0.86],
      ["Énergie", 161.91, 1.52],
      ["Industriels", 210.13, -1.12],
      ["Services financiers", 239.29, -0.04],
      ["Services publics", 230.92, -1.28],
      ["Télécommunications", 149.15, 2.03]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3280,-0.61], ["BBGC","Bridge Bank Group","CI",9730,-0.56],
      ["BICB","BIIC Bénin","BJ",8115,-2.23], ["BICC","BICI Côte d'Ivoire","CI",32000,0.0],
      ["BNBC","Bernabé","CI",1935,-2.27], ["BOAB","Bank of Africa Bénin","BJ",9350,2.75],
      ["BOABF","Bank of Africa Burkina","BF",7995,0.57], ["BOAC","Bank of Africa CI","CI",11900,1.71],
      ["BOAM","Bank of Africa Mali","ML",5850,0.09], ["BOAN","Bank of Africa Niger","NE",5135,-1.15],
      ["BOAS","Bank of Africa Sénégal","SN",8400,2.31], ["CABC","Sicable","CI",2505,-7.39],
      ["CBIBF","Coris Bank International","BF",32010,0.03], ["CFAC","CFAO Motors","CI",1290,-0.77],
      ["CIEC","CIE","CI",5200,-1.79], ["ECOC","Ecobank CI","CI",15900,0.09],
      ["ETIT","Ecobank Transnational","TG",60,-1.64], ["FTSC","Filtisac","CI",1595,-7.27],
      ["LNBB","Loterie nationale du Bénin","BJ",3945,0.25], ["NEIC","NEI-CEDA","CI",2140,-0.23],
      ["NSBC","NSIA Banque CI","CI",17500,-2.75], ["NTLC","Nestlé CI","CI",13400,-0.7],
      ["ONTBF","Onatel Burkina","BF",3045,-0.81], ["ORGT","Oragroup","TG",2675,-0.93],
      ["PALC","Palm CI","CI",7450,0.95], ["PRSC","Tractafric Motors","CI",3750,0.0],
      ["SAFC","Safca","CI",3945,6.62], ["SCRC","Sucrivoire","CI",2035,-7.5],
      ["SDCC","SODE CI","CI",12310,0.08], ["SDSC","Africa Global Logistics","CI",3045,-1.14],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38895,1.01],
      ["SHEC","Vivo Energy CI","CI",2120,0.0], ["SIBC","Société Ivoirienne de Banque","CI",8800,0.0],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1690,-0.59],
      ["SLBC","Solibra","CI",39000,0.01], ["SMBC","SMB","CI",16870,7.49],
      ["SOGC","SOGB","CI",7800,0.32], ["SPHC","SAPH","CI",7980,3.64],
      ["STAC","Setao","CI",1900,7.34], ["STBC","Sitab","CI",20760,2.9],
      ["TTLC","TotalEnergies Marketing CI","CI",3045,1.16], ["TTLS","TotalEnergies Marketing Sénégal","SN",3615,-2.3],
      ["UNLC","Unilever CI","CI",48000,0.0], ["UNXC","Uniwax","CI",2025,-4.26]
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
