/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "05/11/2026",
    source: "BRVM, cours de clôture du 05/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 528.49, 520.2, -1.57],
      ["BRVM 30", 256.04, 251.61, -1.73],
      ["BRVM Prestige", 198.02, 193.88, -2.09],
      ["BRVM Principal", 365.22, 364.26, -0.26]
    ],
    secteurs: [
      ["Consommation de base", 258.74, -0.19],
      ["Consommation discrétionnaire", 167.45, -1.73],
      ["Énergie", 164.25, 0.11],
      ["Industriels", 201.39, -4.63],
      ["Services financiers", 238.53, -0.62],
      ["Services publics", 234.0, 2.86],
      ["Télécommunications", 143.13, -3.32]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3395,3.51], ["BBGC","Bridge Bank Group","CI",9600,-1.03],
      ["BICB","BIIC Bénin","BJ",8100,-0.37], ["BICC","BICI Côte d'Ivoire","CI",31995,1.49],
      ["BNBC","Bernabé","CI",1970,0.0], ["BOAB","Bank of Africa Bénin","BJ",9495,0.0],
      ["BOABF","Bank of Africa Burkina","BF",8000,0.06], ["BOAC","Bank of Africa CI","CI",11960,0.5],
      ["BOAM","Bank of Africa Mali","ML",5890,0.68], ["BOAN","Bank of Africa Niger","NE",5000,-1.96],
      ["BOAS","Bank of Africa Sénégal","SN",8380,0.06], ["CABC","Sicable","CI",2680,6.99],
      ["CBIBF","Coris Bank International","BF",32575,-1.26], ["CFAC","CFAO Motors","CI",1250,-0.79],
      ["CIEC","CIE","CI",5300,3.92], ["ECOC","Ecobank CI","CI",15510,-4.26],
      ["ETIT","Ecobank Transnational","TG",59,0.0], ["FTSC","Filtisac","CI",1680,0.6],
      ["LNBB","Loterie nationale du Bénin","BJ",3785,-5.38], ["NEIC","NEI-CEDA","CI",1835,-7.32],
      ["NSBC","NSIA Banque CI","CI",17545,-1.43], ["NTLC","Nestlé CI","CI",13100,-2.24],
      ["ONTBF","Onatel Burkina","BF",2990,0.0], ["ORGT","Oragroup","TG",2605,0.19],
      ["PALC","Palm CI","CI",7455,-0.6], ["PRSC","Tractafric Motors","CI",3655,-3.82],
      ["SAFC","Safca","CI",3800,-2.44], ["SCRC","Sucrivoire","CI",1850,-1.86],
      ["SDCC","SODE CI","CI",12285,0.12], ["SDSC","Africa Global Logistics","CI",2800,-7.44],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",39200,0.77],
      ["SHEC","Vivo Energy CI","CI",2120,0.47], ["SIBC","Société Ivoirienne de Banque","CI",8700,-1.19],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1700,0.0],
      ["SLBC","Solibra","CI",39100,1.03], ["SMBC","SMB","CI",17900,-0.53],
      ["SOGC","SOGB","CI",7700,-0.65], ["SPHC","SAPH","CI",8000,0.0],
      ["STAC","Setao","CI",1850,-7.5], ["STBC","Sitab","CI",21150,0.71],
      ["TTLC","TotalEnergies Marketing CI","CI",3005,-1.31], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,2.78],
      ["UNLC","Unilever CI","CI",47500,-1.04], ["UNXC","Uniwax","CI",2015,0.5]
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
