/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "09/11/2026",
    source: "BRVM, cours de clôture du 09/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 520.74, 521.88, 0.22],
      ["BRVM 30", 251.79, 252.36, 0.23],
      ["BRVM Prestige", 194.71, 194.97, 0.13],
      ["BRVM Principal", 365.22, 363.2, -0.55]
    ],
    secteurs: [
      ["Consommation de base", 260.22, 0.26],
      ["Consommation discrétionnaire", 171.53, 1.67],
      ["Énergie", 164.33, -1.18],
      ["Industriels", 200.9, -3.63],
      ["Services financiers", 237.91, -0.92],
      ["Services publics", 222.82, -3.92],
      ["Télécommunications", 144.77, 2.0]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3400,0.0], ["BBGC","Bridge Bank Group","CI",9550,0.0],
      ["BICB","BIIC Bénin","BJ",7980,-1.48], ["BICC","BICI Côte d'Ivoire","CI",32900,2.81],
      ["BNBC","Bernabé","CI",1795,-5.28], ["BOAB","Bank of Africa Bénin","BJ",9360,-0.43],
      ["BOABF","Bank of Africa Burkina","BF",7900,-0.75], ["BOAC","Bank of Africa CI","CI",11970,-0.21],
      ["BOAM","Bank of Africa Mali","ML",5695,-3.31], ["BOAN","Bank of Africa Niger","NE",5000,0.0],
      ["BOAS","Bank of Africa Sénégal","SN",8280,-0.84], ["CABC","Sicable","CI",2700,-3.23],
      ["CBIBF","Coris Bank International","BF",32200,-1.15], ["CFAC","CFAO Motors","CI",1295,3.19],
      ["CIEC","CIE","CI",4950,-4.81], ["ECOC","Ecobank CI","CI",15510,-3.33],
      ["ETIT","Ecobank Transnational","TG",59,-1.67], ["FTSC","Filtisac","CI",1695,-1.17],
      ["LNBB","Loterie nationale du Bénin","BJ",3935,0.0], ["NEIC","NEI-CEDA","CI",1980,7.03],
      ["NSBC","NSIA Banque CI","CI",17380,-0.71], ["NTLC","Nestlé CI","CI",13150,0.0],
      ["ONTBF","Onatel Burkina","BF",2990,-1.32], ["ORGT","Oragroup","TG",2650,0.0],
      ["PALC","Palm CI","CI",7600,-5.0], ["PRSC","Tractafric Motors","CI",3615,-0.14],
      ["SAFC","Safca","CI",3710,-1.07], ["SCRC","Sucrivoire","CI",1595,-7.27],
      ["SDCC","SODE CI","CI",12300,-1.6], ["SDSC","Africa Global Logistics","CI",2730,-6.83],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",39000,-1.25],
      ["SHEC","Vivo Energy CI","CI",2120,-3.64], ["SIBC","Société Ivoirienne de Banque","CI",8800,0.06],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1800,6.51],
      ["SLBC","Solibra","CI",40000,2.25], ["SMBC","SMB","CI",17945,0.22],
      ["SOGC","SOGB","CI",7650,0.0], ["SPHC","SAPH","CI",8000,0.0],
      ["STAC","Setao","CI",1995,2.31], ["STBC","Sitab","CI",21200,0.02],
      ["TTLC","TotalEnergies Marketing CI","CI",3030,-0.33], ["TTLS","TotalEnergies Marketing Sénégal","SN",3650,-1.35],
      ["UNLC","Unilever CI","CI",47500,0.0], ["UNXC","Uniwax","CI",1995,-1.24]
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
