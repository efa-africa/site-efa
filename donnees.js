/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "11/11/2026",
    source: "BRVM, cours de clôture du 11/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 512.81, 517.17, 0.85],
      ["BRVM 30", 247.47, 250.13, 1.07],
      ["BRVM Prestige", 191.6, 192.47, 0.45],
      ["BRVM Principal", 360.46, 361.64, 0.33]
    ],
    secteurs: [
      ["Consommation de base", 259.72, 0.27],
      ["Consommation discrétionnaire", 167.59, -1.35],
      ["Énergie", 164.11, -0.42],
      ["Industriels", 205.97, 0.82],
      ["Services financiers", 236.37, -0.1],
      ["Services publics", 222.25, -0.82],
      ["Télécommunications", 142.52, 2.55]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3300,-2.94], ["BBGC","Bridge Bank Group","CI",9465,-0.16],
      ["BICB","BIIC Bénin","BJ",8090,2.93], ["BICC","BICI Côte d'Ivoire","CI",31700,-3.35],
      ["BNBC","Bernabé","CI",1795,0.0], ["BOAB","Bank of Africa Bénin","BJ",9410,2.28],
      ["BOABF","Bank of Africa Burkina","BF",7900,2.6], ["BOAC","Bank of Africa CI","CI",11940,0.0],
      ["BOAM","Bank of Africa Mali","ML",5700,0.0], ["BOAN","Bank of Africa Niger","NE",4920,-1.4],
      ["BOAS","Bank of Africa Sénégal","SN",8140,-1.21], ["CABC","Sicable","CI",2910,7.18],
      ["CBIBF","Coris Bank International","BF",32000,3.23], ["CFAC","CFAO Motors","CI",1260,0.0],
      ["CIEC","CIE","CI",4900,-1.01], ["ECOC","Ecobank CI","CI",15550,-1.86],
      ["ETIT","Ecobank Transnational","TG",60,0.0], ["FTSC","Filtisac","CI",1690,4.0],
      ["LNBB","Loterie nationale du Bénin","BJ",3900,-1.02], ["NEIC","NEI-CEDA","CI",1965,-0.76],
      ["NSBC","NSIA Banque CI","CI",17010,-1.39], ["NTLC","Nestlé CI","CI",13130,1.0],
      ["ONTBF","Onatel Burkina","BF",2900,-3.17], ["ORGT","Oragroup","TG",2550,1.8],
      ["PALC","Palm CI","CI",7590,-0.07], ["PRSC","Tractafric Motors","CI",3535,-6.97],
      ["SAFC","Safca","CI",3695,0.96], ["SCRC","Sucrivoire","CI",1635,-0.91],
      ["SDCC","SODE CI","CI",12500,-0.36], ["SDSC","Africa Global Logistics","CI",2830,-0.53],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38600,-0.77],
      ["SHEC","Vivo Energy CI","CI",2100,-0.94], ["SIBC","Société Ivoirienne de Banque","CI",8605,-2.22],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1750,2.94],
      ["SLBC","Solibra","CI",40000,0.0], ["SMBC","SMB","CI",17940,-0.06],
      ["SOGC","SOGB","CI",7650,0.66], ["SPHC","SAPH","CI",8000,0.76],
      ["STAC","Setao","CI",2040,2.0], ["STBC","Sitab","CI",21200,0.24],
      ["TTLC","TotalEnergies Marketing CI","CI",3015,-0.5], ["TTLS","TotalEnergies Marketing Sénégal","SN",3695,-0.14],
      ["UNLC","Unilever CI","CI",47000,0.0], ["UNXC","Uniwax","CI",1920,-3.52]
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
