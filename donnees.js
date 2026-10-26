/* Données EFA partagées par l'accueil et l'onglet Études.
   Pour mettre à jour la Bourse : remplacer la date, les indices et la liste des actions
   par les chiffres de clôture publiés sur brvm.org (Cours des actions et Indices). */
window.EFA_DATA = {

  brvm: {
    seance: "26/10/2026",
    source: "BRVM, cours de clôture du 26/10/2026",
    capitalisation: null,
    // [nom, clôture précédente, clôture, variation % du jour]
    indices: [
      ["BRVM Composite", 529.14, 534.74, 1.06],
      ["BRVM 30", 256.35, 259.82, 1.35],
      ["BRVM Prestige", 196.59, 199.94, 1.7],
      ["BRVM Principal", 369.06, 365.2, -1.05]
    ],
    secteurs: [
      ["Consommation de base", 258.58, -1.04],
      ["Consommation discrétionnaire", 176.82, -2.98],
      ["Énergie", 155.72, 0.34],
      ["Industriels", 212.49, -0.07],
      ["Services financiers", 240.1, -0.7],
      ["Services publics", 218.17, -1.16],
      ["Télécommunications", 153.33, 4.25]
    ],
    // [symbole, nom, pays, cours de clôture FCFA, variation % du jour]
    actions: [
      ["ABJC","Servair Abidjan","CI",3210,3.55], ["BBGC","Bridge Bank Group","CI",9945,-0.55],
      ["BICB","BIIC Bénin","BJ",8520,-0.81], ["BICC","BICI Côte d'Ivoire","CI",31200,0.32],
      ["BNBC","Bernabé","CI",1725,-1.43], ["BOAB","Bank of Africa Bénin","BJ",9070,0.78],
      ["BOABF","Bank of Africa Burkina","BF",7660,-0.13], ["BOAC","Bank of Africa CI","CI",11220,0.18],
      ["BOAM","Bank of Africa Mali","ML",5800,5.45], ["BOAN","Bank of Africa Niger","NE",5050,4.12],
      ["BOAS","Bank of Africa Sénégal","SN",8155,0.06], ["CABC","Sicable","CI",2985,-0.33],
      ["CBIBF","Coris Bank International","BF",30900,0.0], ["CFAC","CFAO Motors","CI",1350,-5.92],
      ["CIEC","CIE","CI",4885,0.0], ["ECOC","Ecobank CI","CI",16250,-0.79],
      ["ETIT","Ecobank Transnational","TG",63,-1.56], ["FTSC","Filtisac","CI",1795,0.0],
      ["LNBB","Loterie nationale du Bénin","BJ",3995,-0.12], ["NEIC","NEI-CEDA","CI",2110,-1.17],
      ["NSBC","NSIA Banque CI","CI",19150,-7.49], ["NTLC","Nestlé CI","CI",13900,0.0],
      ["ONTBF","Onatel Burkina","BF",3060,-0.49], ["ORGT","Oragroup","TG",2765,-0.18],
      ["PALC","Palm CI","CI",7500,4.17], ["PRSC","Tractafric Motors","CI",3800,0.0],
      ["SAFC","Safca","CI",3810,-1.68], ["SCRC","Sucrivoire","CI",2400,1.05],
      ["SDCC","SODE CI","CI",11805,-4.02], ["SDSC","Africa Global Logistics","CI",3000,0.0],
      ["SEMC","Eviosys Packaging Siem","CI",1495,0.0], ["SGBC","Société Générale CI","CI",38945,-0.01],
      ["SHEC","Vivo Energy CI","CI",2175,-0.23], ["SIBC","Société Ivoirienne de Banque","CI",8700,-1.08],
      ["SICC","Sicor","CI",8400,0.0], ["SIVC","Erium","CI",1700,0.0],
      ["SLBC","Solibra","CI",38605,0.0], ["SMBC","SMB","CI",14800,-0.07],
      ["SOGC","SOGB","CI",7600,0.0], ["SPHC","SAPH","CI",8000,0.0],
      ["STAC","Setao","CI",1890,-0.53], ["STBC","Sitab","CI",21200,0.0],
      ["TTLC","TotalEnergies Marketing CI","CI",2905,0.35], ["TTLS","TotalEnergies Marketing Sénégal","SN",3600,1.41],
      ["UNLC","Unilever CI","CI",45200,-6.53], ["UNXC","Uniwax","CI",2100,0.0]
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
