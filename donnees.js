/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "04/11/2026",
    source: "BRVM, cours de clôture du 04/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 529.41, 528.49, -0.17],
      ["BRVM 30", 256.5, 256.04, -0.18],
      ["BRVM Prestige", 198.02, 198.02, 0.0],
      ["BRVM Principal", 365.44, 365.22, -0.06]
    ],
    secteurs: [
      ["Consommation de base", 259.24, -0.15],
      ["Consommation discrétionnaire", 170.39, -1.29],
      ["Énergie", 164.07, 1.33],
      ["Industriels", 211.17, 0.49],
      ["Services financiers", 240.03, 0.31],
      ["Services publics", 227.49, -1.49],
      ["Télécommunications", 148.05, -0.74]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3280,0.0], ["BBGC","Bridge Bank Group","CI",9700,-0.31],
      ["BICB","BIIC Bénin","BJ",8130,0.18], ["BICC","BICI Côte d'Ivoire","CI",31525,-1.48],
      ["BNBC","Bernabé","CI",1970,1.81], ["BOAB","Bank of Africa Bénin","BJ",9495,1.55],
      ["BOABF","Bank of Africa Burkina","BF",7995,0.0], ["BOAC","Bank of Africa CI","CI",11900,0.0],
      ["BOAM","Bank of Africa Mali","ML",5850,0.0], ["BOAN","Bank of Africa Niger","NE",5100,-0.68],
      ["BOAS","Bank of Africa Sénégal","SN",8375,-0.3], ["CABC","Sicable","CI",2505,0.0],
      ["CBIBF","Coris Bank International","BF",32990,3.06], ["CFAC","CFAO Motors","CI",1260,-2.33],
      ["CIEC","CIE","CI",5100,-1.92], ["ECOC","Ecobank CI","CI",16200,1.89],
      ["ETIT","Ecobank Transnational","TG",59,-1.67], ["FTSC","Filtisac","CI",1670,4.7],
      ["LNBB","Loterie nationale du Bénin","BJ",4000,1.39], ["NEIC","NEI-CEDA","CI",1980,-7.48],
      ["NSBC","NSIA Banque CI","CI",17800,1.71], ["NTLC","Nestlé CI","CI",13400,0.0],
      ["ONTBF","Onatel Burkina","BF",2990,-1.81], ["ORGT","Oragroup","TG",2600,-2.8],
      ["PALC","Palm CI","CI",7500,0.67], ["PRSC","Tractafric Motors","CI",3800,1.33],
      ["SAFC","Safca","CI",3895,-1.27], ["SCRC","Sucrivoire","CI",1885,-7.37],
      ["SDCC","SODE CI","CI",12270,-0.32], ["SDSC","Africa Global Logistics","CI",3025,-0.66],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38900,0.01],
      ["SHEC","Vivo Energy CI","CI",2110,-0.47], ["SIBC","Société Ivoirienne de Banque","CI",8805,0.06],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1700,0.59],
      ["SLBC","Solibra","CI",38700,-0.77], ["SMBC","SMB","CI",17995,6.67],
      ["SOGC","SOGB","CI",7750,-0.64], ["SPHC","SAPH","CI",8000,0.25],
      ["STAC","Setao","CI",2000,5.26], ["STBC","Sitab","CI",21000,1.16],
      ["TTLC","TotalEnergies Marketing CI","CI",3045,0.0], ["TTLS","TotalEnergies Marketing Sénégal","SN",3600,-0.41],
      ["UNLC","Unilever CI","CI",48000,0.0], ["UNXC","Uniwax","CI",2005,-0.99]
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
