/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "30/10/2026",
    source: "BRVM, cours de clôture du 30/10/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 528.25, 534.71, 1.22],
      ["BRVM 30", 256.07, 259.18, 1.21],
      ["BRVM Prestige", 195.93, 198.32, 1.22],
      ["BRVM Principal", 371.79, 372.81, 0.27]
    ],
    secteurs: [
      ["Consommation de base", 264.97, 2.45],
      ["Consommation discrétionnaire", 181.71, 0.13],
      ["Énergie", 158.59, 0.85],
      ["Industriels", 212.9, 1.97],
      ["Services financiers", 241.97, -0.71],
      ["Services publics", 243.36, 1.67],
      ["Télécommunications", 149.57, 3.25]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3350,2.13], ["BBGC","Bridge Bank Group","CI",9850,-0.3],
      ["BICB","BIIC Bénin","BJ",8400,-0.47], ["BICC","BICI Côte d'Ivoire","CI",32150,0.0],
      ["BNBC","Bernabé","CI",2000,0.76], ["BOAB","Bank of Africa Bénin","BJ",9365,0.7],
      ["BOABF","Bank of Africa Burkina","BF",7950,-0.62], ["BOAC","Bank of Africa CI","CI",11700,-3.31],
      ["BOAM","Bank of Africa Mali","ML",5830,1.39], ["BOAN","Bank of Africa Niger","NE",5250,-0.94],
      ["BOAS","Bank of Africa Sénégal","SN",8260,-0.48], ["CABC","Sicable","CI",2920,-0.17],
      ["CBIBF","Coris Bank International","BF",31900,0.0], ["CFAC","CFAO Motors","CI",1400,0.36],
      ["CIEC","CIE","CI",5500,1.85], ["ECOC","Ecobank CI","CI",15880,-0.44],
      ["ETIT","Ecobank Transnational","TG",63,-1.56], ["FTSC","Filtisac","CI",1795,1.41],
      ["LNBB","Loterie nationale du Bénin","BJ",3950,-0.63], ["NEIC","NEI-CEDA","CI",2290,-0.43],
      ["NSBC","NSIA Banque CI","CI",18650,0.0], ["NTLC","Nestlé CI","CI",13400,1.59],
      ["ONTBF","Onatel Burkina","BF",3050,-0.33], ["ORGT","Oragroup","TG",2705,0.19],
      ["PALC","Palm CI","CI",7360,-1.87], ["PRSC","Tractafric Motors","CI",3710,-2.37],
      ["SAFC","Safca","CI",3760,-0.27], ["SCRC","Sucrivoire","CI",2270,1.79],
      ["SDCC","SODE CI","CI",12850,1.18], ["SDSC","Africa Global Logistics","CI",3045,2.87],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",39220,-1.93],
      ["SHEC","Vivo Energy CI","CI",2115,0.0], ["SIBC","Société Ivoirienne de Banque","CI",8805,0.06],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1695,0.59],
      ["SLBC","Solibra","CI",39990,2.54], ["SMBC","SMB","CI",14600,0.03],
      ["SOGC","SOGB","CI",7655,0.72], ["SPHC","SAPH","CI",8300,1.84],
      ["STAC","Setao","CI",1780,2.01], ["STBC","Sitab","CI",21500,0.94],
      ["TTLC","TotalEnergies Marketing CI","CI",3100,2.48], ["TTLS","TotalEnergies Marketing Sénégal","SN",3700,0.0],
      ["UNLC","Unilever CI","CI",49000,6.52], ["UNXC","Uniwax","CI",2120,0.95]
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
