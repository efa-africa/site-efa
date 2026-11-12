/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "12/11/2026",
    source: "BRVM, cours de clôture du 12/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 517.17, 518.96, 0.35],
      ["BRVM 30", 250.13, 251.33, 0.48],
      ["BRVM Prestige", 192.47, 193.5, 0.54],
      ["BRVM Principal", 361.64, 362.74, 0.3]
    ],
    secteurs: [
      ["Consommation de base", 265.96, 2.4],
      ["Consommation discrétionnaire", 168.12, 0.32],
      ["Énergie", 164.47, 0.22],
      ["Industriels", 204.9, -0.52],
      ["Services financiers", 236.47, 0.04],
      ["Services publics", 225.46, 1.44],
      ["Télécommunications", 142.61, 0.06]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3295,-0.15], ["BBGC","Bridge Bank Group","CI",9100,-3.86],
      ["BICB","BIIC Bénin","BJ",7950,-1.73], ["BICC","BICI Côte d'Ivoire","CI",31705,0.02],
      ["BNBC","Bernabé","CI",1725,-3.9], ["BOAB","Bank of Africa Bénin","BJ",9500,0.96],
      ["BOABF","Bank of Africa Burkina","BF",8000,1.27], ["BOAC","Bank of Africa CI","CI",11990,0.42],
      ["BOAM","Bank of Africa Mali","ML",5705,0.09], ["BOAN","Bank of Africa Niger","NE",4975,1.12],
      ["BOAS","Bank of Africa Sénégal","SN",8200,0.74], ["CABC","Sicable","CI",2915,0.17],
      ["CBIBF","Coris Bank International","BF",32000,0.0], ["CFAC","CFAO Motors","CI",1260,0.0],
      ["CIEC","CIE","CI",5000,2.04], ["ECOC","Ecobank CI","CI",15605,0.35],
      ["ETIT","Ecobank Transnational","TG",59,-1.67], ["FTSC","Filtisac","CI",1700,0.59],
      ["LNBB","Loterie nationale du Bénin","BJ",3935,0.9], ["NEIC","NEI-CEDA","CI",1980,0.76],
      ["NSBC","NSIA Banque CI","CI",17100,0.53], ["NTLC","Nestlé CI","CI",13145,0.11],
      ["ONTBF","Onatel Burkina","BF",2900,0.0], ["ORGT","Oragroup","TG",2560,0.39],
      ["PALC","Palm CI","CI",7645,0.72], ["PRSC","Tractafric Motors","CI",3700,4.67],
      ["SAFC","Safca","CI",3685,-0.27], ["SCRC","Sucrivoire","CI",1600,-2.14],
      ["SDCC","SODE CI","CI",12500,0.0], ["SDSC","Africa Global Logistics","CI",2800,-1.06],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38890,0.75],
      ["SHEC","Vivo Energy CI","CI",2030,-3.33], ["SIBC","Société Ivoirienne de Banque","CI",8800,2.27],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1700,-2.86],
      ["SLBC","Solibra","CI",42945,7.36], ["SMBC","SMB","CI",18000,0.33],
      ["SOGC","SOGB","CI",7885,3.07], ["SPHC","SAPH","CI",8000,0.0],
      ["STAC","Setao","CI",2075,1.72], ["STBC","Sitab","CI",21250,0.24],
      ["TTLC","TotalEnergies Marketing CI","CI",3095,2.65], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,0.14],
      ["UNLC","Unilever CI","CI",47000,0.0], ["UNXC","Uniwax","CI",1890,-1.56]
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
