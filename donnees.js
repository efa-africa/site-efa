/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "28/10/2026",
    source: "BRVM, cours de clôture du 28/10/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 532.09, 528.34, -0.7],
      ["BRVM 30", 258.19, 256.25, -0.75],
      ["BRVM Prestige", 198.86, 196.62, -1.13],
      ["BRVM Principal", 366.92, 368.26, 0.37]
    ],
    secteurs: [
      ["Consommation de base", 256.69, -0.73],
      ["Consommation discrétionnaire", 180.48, 0.07],
      ["Énergie", 156.73, 0.26],
      ["Industriels", 209.76, 3.4],
      ["Services financiers", 241.5, 0.2],
      ["Services publics", 228.68, -2.48],
      ["Télécommunications", 147.27, -1.91]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3290,2.81], ["BBGC","Bridge Bank Group","CI",9900,-0.95],
      ["BICB","BIIC Bénin","BJ",8440,-1.17], ["BICC","BICI Côte d'Ivoire","CI",32000,0.05],
      ["BNBC","Bernabé","CI",1850,7.25], ["BOAB","Bank of Africa Bénin","BJ",9380,0.86],
      ["BOABF","Bank of Africa Burkina","BF",7950,-1.85], ["BOAC","Bank of Africa CI","CI",11940,5.76],
      ["BOAM","Bank of Africa Mali","ML",5695,-0.09], ["BOAN","Bank of Africa Niger","NE",5095,1.9],
      ["BOAS","Bank of Africa Sénégal","SN",8210,0.18], ["CABC","Sicable","CI",2995,0.34],
      ["CBIBF","Coris Bank International","BF",32200,2.86], ["CFAC","CFAO Motors","CI",1400,-1.06],
      ["CIEC","CIE","CI",5100,-2.86], ["ECOC","Ecobank CI","CI",16000,-1.54],
      ["ETIT","Ecobank Transnational","TG",61,0.0], ["FTSC","Filtisac","CI",1800,4.35],
      ["LNBB","Loterie nationale du Bénin","BJ",3975,0.76], ["NEIC","NEI-CEDA","CI",2240,6.67],
      ["NSBC","NSIA Banque CI","CI",19000,0.0], ["NTLC","Nestlé CI","CI",13205,-3.58],
      ["ONTBF","Onatel Burkina","BF",3060,0.33], ["ORGT","Oragroup","TG",2680,-1.29],
      ["PALC","Palm CI","CI",7500,0.0], ["PRSC","Tractafric Motors","CI",3800,0.26],
      ["SAFC","Safca","CI",3775,-0.92], ["SCRC","Sucrivoire","CI",2290,3.15],
      ["SDCC","SODE CI","CI",12500,-1.5], ["SDSC","Africa Global Logistics","CI",2960,5.34],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38950,0.0],
      ["SHEC","Vivo Energy CI","CI",2115,-0.7], ["SIBC","Société Ivoirienne de Banque","CI",8800,-1.01],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1670,0.0],
      ["SLBC","Solibra","CI",38710,0.01], ["SMBC","SMB","CI",14600,0.69],
      ["SOGC","SOGB","CI",7505,-5.0], ["SPHC","SAPH","CI",8010,0.12],
      ["STAC","Setao","CI",1790,-0.28], ["STBC","Sitab","CI",21250,0.24],
      ["TTLC","TotalEnergies Marketing CI","CI",2995,0.0], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,1.37],
      ["UNLC","Unilever CI","CI",45200,0.0], ["UNXC","Uniwax","CI",2000,-2.91]
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
