/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "29/10/2026",
    source: "BRVM, cours de clôture du 29/10/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 528.34, 528.25, -0.02],
      ["BRVM 30", 256.25, 256.07, -0.07],
      ["BRVM Prestige", 196.62, 195.93, -0.35],
      ["BRVM Principal", 368.26, 371.79, 0.96]
    ],
    secteurs: [
      ["Consommation de base", 258.64, 0.76],
      ["Consommation discrétionnaire", 181.48, 0.55],
      ["Énergie", 157.25, 0.33],
      ["Industriels", 208.78, -0.47],
      ["Services financiers", 243.7, 0.91],
      ["Services publics", 239.37, 4.67],
      ["Télécommunications", 144.86, -1.64]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3280,-0.3], ["BBGC","Bridge Bank Group","CI",9880,-0.2],
      ["BICB","BIIC Bénin","BJ",8440,0.0], ["BICC","BICI Côte d'Ivoire","CI",32150,0.47],
      ["BNBC","Bernabé","CI",1985,7.3], ["BOAB","Bank of Africa Bénin","BJ",9300,-0.85],
      ["BOABF","Bank of Africa Burkina","BF",8000,0.63], ["BOAC","Bank of Africa CI","CI",12100,1.34],
      ["BOAM","Bank of Africa Mali","ML",5750,0.97], ["BOAN","Bank of Africa Niger","NE",5300,4.02],
      ["BOAS","Bank of Africa Sénégal","SN",8300,1.1], ["CABC","Sicable","CI",2925,-2.34],
      ["CBIBF","Coris Bank International","BF",31900,-0.93], ["CFAC","CFAO Motors","CI",1395,-0.36],
      ["CIEC","CIE","CI",5400,5.88], ["ECOC","Ecobank CI","CI",15950,-0.31],
      ["ETIT","Ecobank Transnational","TG",64,4.92], ["FTSC","Filtisac","CI",1770,-1.67],
      ["LNBB","Loterie nationale du Bénin","BJ",3975,0.0], ["NEIC","NEI-CEDA","CI",2300,2.68],
      ["NSBC","NSIA Banque CI","CI",18650,-1.84], ["NTLC","Nestlé CI","CI",13190,-0.11],
      ["ONTBF","Onatel Burkina","BF",3060,0.0], ["ORGT","Oragroup","TG",2700,0.75],
      ["PALC","Palm CI","CI",7500,0.0], ["PRSC","Tractafric Motors","CI",3800,0.0],
      ["SAFC","Safca","CI",3770,-0.13], ["SCRC","Sucrivoire","CI",2230,-2.62],
      ["SDCC","SODE CI","CI",12700,1.6], ["SDSC","Africa Global Logistics","CI",2960,0.0],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",39990,2.67],
      ["SHEC","Vivo Energy CI","CI",2115,0.0], ["SIBC","Société Ivoirienne de Banque","CI",8800,0.0],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1685,0.9],
      ["SLBC","Solibra","CI",39000,0.75], ["SMBC","SMB","CI",14595,-0.03],
      ["SOGC","SOGB","CI",7600,1.27], ["SPHC","SAPH","CI",8150,1.75],
      ["STAC","Setao","CI",1745,-2.51], ["STBC","Sitab","CI",21300,0.24],
      ["TTLC","TotalEnergies Marketing CI","CI",3025,1.0], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,0.0],
      ["UNLC","Unilever CI","CI",46000,1.77], ["UNXC","Uniwax","CI",2100,5.0]
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
