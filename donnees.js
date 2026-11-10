/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "10/11/2026",
    source: "BRVM, cours de clôture du 10/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 521.88, 512.81, -1.74],
      ["BRVM 30", 252.36, 247.47, -1.94],
      ["BRVM Prestige", 194.97, 191.6, -1.73],
      ["BRVM Principal", 363.2, 360.46, -0.75]
    ],
    secteurs: [
      ["Consommation de base", 259.03, -0.46],
      ["Consommation discrétionnaire", 169.89, -0.96],
      ["Énergie", 164.8, 0.29],
      ["Industriels", 204.3, 1.69],
      ["Services financiers", 236.61, -0.55],
      ["Services publics", 224.09, 0.57],
      ["Télécommunications", 138.98, -4.0]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3400,0.0], ["BBGC","Bridge Bank Group","CI",9480,-0.73],
      ["BICB","BIIC Bénin","BJ",7860,-1.5], ["BICC","BICI Côte d'Ivoire","CI",32800,-0.3],
      ["BNBC","Bernabé","CI",1795,0.0], ["BOAB","Bank of Africa Bénin","BJ",9200,-1.71],
      ["BOABF","Bank of Africa Burkina","BF",7700,-2.53], ["BOAC","Bank of Africa CI","CI",11940,-0.25],
      ["BOAM","Bank of Africa Mali","ML",5700,0.09], ["BOAN","Bank of Africa Niger","NE",4990,-0.2],
      ["BOAS","Bank of Africa Sénégal","SN",8240,-0.48], ["CABC","Sicable","CI",2715,0.56],
      ["CBIBF","Coris Bank International","BF",31000,-3.73], ["CFAC","CFAO Motors","CI",1260,-2.7],
      ["CIEC","CIE","CI",4950,0.0], ["ECOC","Ecobank CI","CI",15845,2.16],
      ["ETIT","Ecobank Transnational","TG",60,1.69], ["FTSC","Filtisac","CI",1625,-4.13],
      ["LNBB","Loterie nationale du Bénin","BJ",3940,0.13], ["NEIC","NEI-CEDA","CI",1980,0.0],
      ["NSBC","NSIA Banque CI","CI",17250,-0.75], ["NTLC","Nestlé CI","CI",13000,-1.14],
      ["ONTBF","Onatel Burkina","BF",2995,0.17], ["ORGT","Oragroup","TG",2505,-5.47],
      ["PALC","Palm CI","CI",7595,-0.07], ["PRSC","Tractafric Motors","CI",3800,5.12],
      ["SAFC","Safca","CI",3660,-1.35], ["SCRC","Sucrivoire","CI",1650,3.45],
      ["SDCC","SODE CI","CI",12545,1.99], ["SDSC","Africa Global Logistics","CI",2845,4.21],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38900,-0.26],
      ["SHEC","Vivo Energy CI","CI",2120,0.0], ["SIBC","Société Ivoirienne de Banque","CI",8800,0.0],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1700,-5.56],
      ["SLBC","Solibra","CI",40000,0.0], ["SMBC","SMB","CI",17950,0.03],
      ["SOGC","SOGB","CI",7600,-0.65], ["SPHC","SAPH","CI",7940,-0.75],
      ["STAC","Setao","CI",2000,0.25], ["STBC","Sitab","CI",21150,-0.24],
      ["TTLC","TotalEnergies Marketing CI","CI",3030,0.0], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,1.37],
      ["UNLC","Unilever CI","CI",47000,-1.05], ["UNXC","Uniwax","CI",1990,-0.25]
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
