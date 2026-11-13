/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "13/11/2026",
    source: "BRVM, cours de clôture du 13/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 518.96, 515.94, -0.58],
      ["BRVM 30", 251.33, 249.28, -0.82],
      ["BRVM Prestige", 193.5, 191.6, -0.98],
      ["BRVM Principal", 362.74, 364.34, 0.44]
    ],
    secteurs: [
      ["Consommation de base", 265.65, -0.12],
      ["Consommation discrétionnaire", 167.1, -0.61],
      ["Énergie", 167.04, 1.56],
      ["Industriels", 202.76, -1.04],
      ["Services financiers", 237.43, 0.41],
      ["Services publics", 228.16, 1.2],
      ["Télécommunications", 139.53, -2.16]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3220,-2.28], ["BBGC","Bridge Bank Group","CI",9450,3.85],
      ["BICB","BIIC Bénin","BJ",7950,0.0], ["BICC","BICI Côte d'Ivoire","CI",32800,3.45],
      ["BNBC","Bernabé","CI",1725,0.0], ["BOAB","Bank of Africa Bénin","BJ",9400,-1.05],
      ["BOABF","Bank of Africa Burkina","BF",7950,-0.62], ["BOAC","Bank of Africa CI","CI",11990,0.0],
      ["BOAM","Bank of Africa Mali","ML",5705,0.0], ["BOAN","Bank of Africa Niger","NE",4925,-1.01],
      ["BOAS","Bank of Africa Sénégal","SN",8340,1.71], ["CABC","Sicable","CI",2910,-0.17],
      ["CBIBF","Coris Bank International","BF",31990,-0.03], ["CFAC","CFAO Motors","CI",1260,0.0],
      ["CIEC","CIE","CI",5100,2.0], ["ECOC","Ecobank CI","CI",15500,-0.67],
      ["ETIT","Ecobank Transnational","TG",59,0.0], ["FTSC","Filtisac","CI",1700,0.0],
      ["LNBB","Loterie nationale du Bénin","BJ",3800,-3.43], ["NEIC","NEI-CEDA","CI",1965,-0.76],
      ["NSBC","NSIA Banque CI","CI",17005,-0.56], ["NTLC","Nestlé CI","CI",13150,0.04],
      ["ONTBF","Onatel Burkina","BF",2900,0.0], ["ORGT","Oragroup","TG",2615,2.15],
      ["PALC","Palm CI","CI",7645,0.0], ["PRSC","Tractafric Motors","CI",3790,2.43],
      ["SAFC","Safca","CI",3650,-0.95], ["SCRC","Sucrivoire","CI",1555,-2.81],
      ["SDCC","SODE CI","CI",12400,-0.8], ["SDSC","Africa Global Logistics","CI",2780,-0.71],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38850,-0.1],
      ["SHEC","Vivo Energy CI","CI",2170,6.9], ["SIBC","Société Ivoirienne de Banque","CI",8890,1.02],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1700,0.0],
      ["SLBC","Solibra","CI",42950,0.01], ["SMBC","SMB","CI",18000,0.0],
      ["SOGC","SOGB","CI",7850,-0.44], ["SPHC","SAPH","CI",7990,-0.12],
      ["STAC","Setao","CI",1945,-6.27], ["STBC","Sitab","CI",21450,0.94],
      ["TTLC","TotalEnergies Marketing CI","CI",3100,0.16], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,0.0],
      ["UNLC","Unilever CI","CI",46500,-1.06], ["UNXC","Uniwax","CI",1890,0.0]
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
