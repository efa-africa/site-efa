/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "19/11/2026",
    source: "BRVM, cours de clôture du 19/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 500.95, 493.95, -1.4],
      ["BRVM 30", 243.09, 239.43, -1.51],
      ["BRVM Prestige", 187.78, 186.66, -0.6],
      ["BRVM Principal", 348.27, 339.15, -2.62]
    ],
    secteurs: [
      ["Consommation de base", 251.62, -1.07],
      ["Consommation discrétionnaire", 158.85, -2.68],
      ["Énergie", 158.04, -0.49],
      ["Industriels", 194.45, -1.82],
      ["Services financiers", 223.81, -2.24],
      ["Services publics", 194.56, -5.8],
      ["Télécommunications", 137.56, -0.23]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3100,-0.64], ["BBGC","Bridge Bank Group","CI",8500,-2.3],
      ["BICB","BIIC Bénin","BJ",7800,-2.44], ["BICC","BICI Côte d'Ivoire","CI",30800,-1.28],
      ["BNBC","Bernabé","CI",1750,-1.13], ["BOAB","Bank of Africa Bénin","BJ",9045,-0.06],
      ["BOABF","Bank of Africa Burkina","BF",7780,-0.13], ["BOAC","Bank of Africa CI","CI",10900,-4.34],
      ["BOAM","Bank of Africa Mali","ML",5060,-6.04], ["BOAN","Bank of Africa Niger","NE",4150,-1.19],
      ["BOAS","Bank of Africa Sénégal","SN",7700,-5.46], ["CABC","Sicable","CI",2725,-0.91],
      ["CBIBF","Coris Bank International","BF",28850,-6.33], ["CFAC","CFAO Motors","CI",1175,-5.62],
      ["CIEC","CIE","CI",4200,-5.62], ["ECOC","Ecobank CI","CI",14890,-0.67],
      ["ETIT","Ecobank Transnational","TG",57,0.0], ["FTSC","Filtisac","CI",1590,-4.79],
      ["LNBB","Loterie nationale du Bénin","BJ",3900,2.63], ["NEIC","NEI-CEDA","CI",1900,0.0],
      ["NSBC","NSIA Banque CI","CI",15250,-3.48], ["NTLC","Nestlé CI","CI",12900,3.2],
      ["ONTBF","Onatel Burkina","BF",2800,-3.45], ["ORGT","Oragroup","TG",2550,-1.35],
      ["PALC","Palm CI","CI",7445,-1.46], ["PRSC","Tractafric Motors","CI",3500,0.0],
      ["SAFC","Safca","CI",3245,-7.42], ["SCRC","Sucrivoire","CI",1285,-7.22],
      ["SDCC","SODE CI","CI",11500,-6.2], ["SDSC","Africa Global Logistics","CI",2600,-3.7],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38890,-0.15],
      ["SHEC","Vivo Energy CI","CI",1800,-5.26], ["SIBC","Société Ivoirienne de Banque","CI",8100,-3.57],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1645,-0.3],
      ["SLBC","Solibra","CI",40500,-3.34], ["SMBC","SMB","CI",17990,4.29],
      ["SOGC","SOGB","CI",7600,1.33], ["SPHC","SAPH","CI",7545,-3.21],
      ["STAC","Setao","CI",2080,7.49], ["STBC","Sitab","CI",21350,-0.47],
      ["TTLC","TotalEnergies Marketing CI","CI",2990,-0.33], ["TTLS","TotalEnergies Marketing Sénégal","SN",3650,-1.35],
      ["UNLC","Unilever CI","CI",40980,0.0], ["UNXC","Uniwax","CI",1695,-2.31]
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
