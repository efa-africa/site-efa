/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "20/11/2026",
    source: "BRVM, cours de clôture du 20/11/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 493.95, 492.89, -0.21],
      ["BRVM 30", 239.43, 238.73, -0.29],
      ["BRVM Prestige", 186.66, 186.61, -0.03],
      ["BRVM Principal", 339.15, 337.96, -0.35]
    ],
    secteurs: [
      ["Consommation de base", 254.63, 1.2],
      ["Consommation discrétionnaire", 160.36, 0.95],
      ["Énergie", 158.29, 0.16],
      ["Industriels", 198.7, 2.19],
      ["Services financiers", 221.79, -0.9],
      ["Services publics", 199.96, 2.78],
      ["Télécommunications", 137.33, -0.17]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3000,-3.23], ["BBGC","Bridge Bank Group","CI",8145,-4.18],
      ["BICB","BIIC Bénin","BJ",7500,-3.85], ["BICC","BICI Côte d'Ivoire","CI",31000,0.65],
      ["BNBC","Bernabé","CI",1750,0.0], ["BOAB","Bank of Africa Bénin","BJ",9095,0.55],
      ["BOABF","Bank of Africa Burkina","BF",7700,-1.03], ["BOAC","Bank of Africa CI","CI",10995,0.87],
      ["BOAM","Bank of Africa Mali","ML",5100,0.79], ["BOAN","Bank of Africa Niger","NE",4420,6.51],
      ["BOAS","Bank of Africa Sénégal","SN",7700,0.0], ["CABC","Sicable","CI",2720,-0.18],
      ["CBIBF","Coris Bank International","BF",27505,-4.66], ["CFAC","CFAO Motors","CI",1190,1.28],
      ["CIEC","CIE","CI",4400,4.76], ["ECOC","Ecobank CI","CI",14795,-0.64],
      ["ETIT","Ecobank Transnational","TG",57,0.0], ["FTSC","Filtisac","CI",1600,0.63],
      ["LNBB","Loterie nationale du Bénin","BJ",3900,0.0], ["NEIC","NEI-CEDA","CI",1900,0.0],
      ["NSBC","NSIA Banque CI","CI",15000,-1.64], ["NTLC","Nestlé CI","CI",12800,-0.78],
      ["ONTBF","Onatel Burkina","BF",2805,0.18], ["ORGT","Oragroup","TG",2500,-1.96],
      ["PALC","Palm CI","CI",7440,-0.07], ["PRSC","Tractafric Motors","CI",3720,6.29],
      ["SAFC","Safca","CI",3030,-6.63], ["SCRC","Sucrivoire","CI",1230,-4.28],
      ["SDCC","SODE CI","CI",11300,-1.74], ["SDSC","Africa Global Logistics","CI",2685,3.27],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38795,-0.24],
      ["SHEC","Vivo Energy CI","CI",1850,2.78], ["SIBC","Société Ivoirienne de Banque","CI",8200,1.23],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1600,-2.74],
      ["SLBC","Solibra","CI",40500,0.0], ["SMBC","SMB","CI",17995,0.03],
      ["SOGC","SOGB","CI",7600,0.0], ["SPHC","SAPH","CI",7645,1.33],
      ["STAC","Setao","CI",2180,4.81], ["STBC","Sitab","CI",21325,-0.12],
      ["TTLC","TotalEnergies Marketing CI","CI",2990,0.0], ["TTLS","TotalEnergies Marketing Sénégal","SN",3580,-1.92],
      ["UNLC","Unilever CI","CI",44000,7.37], ["UNXC","Uniwax","CI",1705,0.59]
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
