/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "02/11/2026",
    source: "BRVM, cours de clôture du 02/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 534.71, 525.3, -1.76],
      ["BRVM 30", 259.18, 254.21, -1.92],
      ["BRVM Prestige", 198.32, 195.63, -1.36],
      ["BRVM Principal", 372.81, 366.29, -1.75]
    ],
    secteurs: [
      ["Consommation de base", 258.03, -2.62],
      ["Consommation discrétionnaire", 174.11, -4.18],
      ["Énergie", 159.49, 0.57],
      ["Industriels", 212.51, -0.18],
      ["Services financiers", 239.38, -1.07],
      ["Services publics", 233.92, -3.88],
      ["Télécommunications", 146.18, -2.27]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3300,-1.49], ["BBGC","Bridge Bank Group","CI",9785,-0.66],
      ["BICB","BIIC Bénin","BJ",8300,-1.19], ["BICC","BICI Côte d'Ivoire","CI",32000,-0.47],
      ["BNBC","Bernabé","CI",1980,-1.0], ["BOAB","Bank of Africa Bénin","BJ",9100,-2.83],
      ["BOABF","Bank of Africa Burkina","BF",7950,0.0], ["BOAC","Bank of Africa CI","CI",11700,0.0],
      ["BOAM","Bank of Africa Mali","ML",5845,0.26], ["BOAN","Bank of Africa Niger","NE",5195,-1.05],
      ["BOAS","Bank of Africa Sénégal","SN",8210,-0.61], ["CABC","Sicable","CI",2705,-7.36],
      ["CBIBF","Coris Bank International","BF",32000,0.31], ["CFAC","CFAO Motors","CI",1300,-7.14],
      ["CIEC","CIE","CI",5295,-3.73], ["ECOC","Ecobank CI","CI",15885,0.03],
      ["ETIT","Ecobank Transnational","TG",61,-3.17], ["FTSC","Filtisac","CI",1720,-4.18],
      ["LNBB","Loterie nationale du Bénin","BJ",3935,-0.38], ["NEIC","NEI-CEDA","CI",2145,-6.33],
      ["NSBC","NSIA Banque CI","CI",17995,-3.51], ["NTLC","Nestlé CI","CI",13495,0.71],
      ["ONTBF","Onatel Burkina","BF",3070,0.66], ["ORGT","Oragroup","TG",2700,-0.18],
      ["PALC","Palm CI","CI",7380,0.27], ["PRSC","Tractafric Motors","CI",3750,1.08],
      ["SAFC","Safca","CI",3700,-1.6], ["SCRC","Sucrivoire","CI",2200,-3.08],
      ["SDCC","SODE CI","CI",12300,-4.28], ["SDSC","Africa Global Logistics","CI",3080,1.15],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38505,-1.82],
      ["SHEC","Vivo Energy CI","CI",2120,0.24], ["SIBC","Société Ivoirienne de Banque","CI",8800,-0.06],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1700,0.29],
      ["SLBC","Solibra","CI",38995,-2.49], ["SMBC","SMB","CI",15695,7.5],
      ["SOGC","SOGB","CI",7775,1.57], ["SPHC","SAPH","CI",7700,-7.23],
      ["STAC","Setao","CI",1770,-0.56], ["STBC","Sitab","CI",20175,-6.16],
      ["TTLC","TotalEnergies Marketing CI","CI",3010,-2.9], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,0.0],
      ["UNLC","Unilever CI","CI",48000,-2.04], ["UNXC","Uniwax","CI",2115,-0.24]
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
