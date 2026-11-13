/* Atelier guidé · Où est passé l'argent de mon activité ? (parcours Analyser une entreprise, 2/5) */
function oaP(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR')+' %'; }
function oaJ(x){ return Math.round(x).toLocaleString('fr-FR')+' jours'; }
function oaB(D,H){
  var cp=H.N(D.oa_cp), dl=H.N(D.oa_dl), im=H.N(D.oa_im);
  var st=H.N(D.oa_st), cl=H.N(D.oa_cl), fo=H.N(D.oa_fo), ds=H.N(D.oa_ds);
  var fr=cp+dl-im, bfr=st+cl-fo-ds; return {fr:fr, bfr:bfr, tn:fr-bfr, st:st, cl:cl, fo:fo};
}
function oaD(D,H){
  var ca=H.N(D.oa_ca), ach=H.N(D.oa_ach), B=oaB(D,H);
  return {ca:ca, ach:ach, js:ach?B.st/ach*360:0, jc:ca?B.cl/ca*360:0, jf:ach?B.fo/ach*360:0};
}
window.ATELIER = {
  id: "ou-est-l-argent-de-mon-activite",
  titre: "Où est passé l’argent de mon activité ?",
  h1: "Votre activité gagne de l’argent. Pourquoi la caisse est-elle vide ?",
  voix: "auto",
  question: {
    t: "Tantie Affoué fait un bénéfice depuis un an dans sa boutique de pagnes. Pourtant, elle n’arrive pas à payer son fournisseur à temps. Pourquoi ?",
    r: [
      ["a", "Elle dépense trop pour la maison.", "C’est possible, mais ce n’est pas la seule explication, ni la plus fréquente. Le bénéfice peut être bloqué ailleurs : dans le stock, ou chez les clientes qui paient plus tard.", false],
      ["b", "Son argent est bloqué dans le stock et chez ses clientes.", "Exactement. Un bénéfice n’est pas une somme en caisse. Vous allez voir où se loge l’argent de votre activité, en jours et en francs.", true]
    ]
  },
  chapitres: [
    { t: "Ce que j’ai, qui l’a financé", acq: "Je lis un bilan en deux colonnes", desc: "Ce que possède l’activité, et d’où vient l’argent.", e: [
      { t: "Deux colonnes, un équilibre", f: ["À gauche, ce que l’activité possède : matériel, stock, argent dû par les clients, caisse et mobile money.", "À droite, d’où vient l’argent : ce que vous y avez mis, les bénéfices laissés dedans, les crédits, ce que vous devez aux fournisseurs.", "Les deux colonnes ont toujours le même total : tout ce que l’activité possède a été financé par quelqu’un."], c: "Le bilan est une photo à une date. Il ne dit pas ce qui s’est passé dans l’année, mais où en est l’activité ce jour-là.",
        p: "Je sais lire les deux colonnes." },
      { t: "Chaque chose à sa place", c: "Classez ces éléments : l’activité les possède-t-elle, ou est-ce une source de financement ?",
        w: { quiz: [ ["Le congélateur de la boutique", ["Ce que l’activité possède","D’où vient l’argent"], 0, "C’est un bien durable : il reste plusieurs années dans l’activité."], ["Les pagnes vendus à une cliente qui paiera à la fin du mois", ["Ce que l’activité possède","D’où vient l’argent"], 0, "C’est une créance : de l’argent qui vous est dû, donc un bien de l’activité."], ["La facture du grossiste à régler dans 30 jours", ["Ce que l’activité possède","D’où vient l’argent"], 1, "Le grossiste finance votre stock pendant 30 jours : c’est une dette, donc une source de financement."], ["Le crédit de la microfinance", ["Ce que l’activité possède","D’où vient l’argent"], 1, "C’est une dette : elle a financé une partie de ce que l’activité possède."] ] },
        p: "J’ai classé les quatre éléments." },
      { t: "Long et court", c: "Dans chaque colonne, on sépare ce qui reste longtemps de ce qui tourne vite. Le matériel reste des années ; le stock et les clients tournent en quelques semaines. Votre apport et un crédit sur 3 ans restent ; la dette fournisseur se renouvelle chaque mois.",
        f: ["Ce qui reste longtemps doit être financé par de l’argent qui reste longtemps.", "Acheter un véhicule avec l’argent qui devait payer le fournisseur : c’est la première cause des caisses vides.", "La suite de l’atelier mesure ces équilibres avec vos chiffres."], w: { consignes: 1 },
        p: "Je fais la différence entre long et court." }
    ]},
    { t: "Mon fonds de roulement", acq: "Je sais si mon argent long couvre mes biens durables", desc: "Ce qui reste de l’argent long après le matériel.", e: [
      { t: "L’argent long qui reste", c: "Le fonds de roulement, c’est l’argent qui reste longtemps dans l’activité (votre apport, les bénéfices laissés, les crédits à plus d’un an) moins ce qu’il a servi à acheter de durable (matériel, aménagement, véhicule). S’il est positif, il finance une partie du quotidien.",
        w: { ex: "Tantie Affoué (fictif) : apport et bénéfices laissés 2 500 000 F ; crédit à 2 ans 1 000 000 F ; matériel et aménagement 1 800 000 F. Fonds de roulement : 1 700 000 F.", k: "Votre bilan · vos chiffres restent sur votre téléphone, EFA ne les garde pas. Vous pouvez mettre des chiffres fictifs, proches de votre réalité.", champs: [ {id:"oa_cp", l:"Votre apport + bénéfices laissés dans l’activité (F)", ph:"2 500 000"}, {id:"oa_dl", l:"Crédits remboursables sur plus d’un an (F restant dû)", ph:"1 000 000"}, {id:"oa_im", l:"Matériel, aménagement, véhicule (F, valeur actuelle)", ph:"1 800 000"} ],
          v: function(D,H){ if(!D.oa_cp||!D.oa_im) return ''; var B=oaB(D,H);
            var h='<div class="gros"><small>Votre fonds de roulement</small><b>'+H.F(B.fr)+'</b><p>Argent long '+H.F(H.N(D.oa_cp)+H.N(D.oa_dl))+' − biens durables '+H.F(H.N(D.oa_im))+'.</p></div>';
            return h+(B.fr<0?'<div class="verdict v-ko">Vos biens durables ont été payés en partie avec de l’argent court (fournisseurs, découvert, argent du mois). C’est fragile : la moindre échéance peut bloquer.</div>':'<div class="verdict v-ok">Votre argent long couvre vos biens durables, et il en reste '+H.F(B.fr)+' pour le quotidien. Reste à savoir si cela suffit : c’est le chapitre suivant.</div>'); } },
        p: "J’ai calculé mon fonds de roulement." }
    ]},
    { t: "L’argent bloqué", acq: "Je mesure l’argent bloqué dans le quotidien", desc: "Stock + clients − fournisseurs.", e: [
      { t: "Le besoin du quotidien", f: ["Le stock : de l’argent posé en rayon, qui attend un acheteur.", "Les clients qui paient plus tard : de l’argent déjà gagné, mais pas encore encaissé.", "Les fournisseurs qui vous font crédit : ils financent une partie des deux premiers."], c: "Stock + clients − fournisseurs (et autres dettes du quotidien) : c’est l’argent que le quotidien de l’activité immobilise en permanence. On l’appelle « besoin en fonds de roulement ».",
        p: "Je sais ce que bloque le quotidien." },
      { t: "Mon argent bloqué et ma trésorerie", c: "Comparez le besoin du quotidien à votre fonds de roulement : la différence, c’est votre trésorerie. Si le besoin dépasse le fonds de roulement, il manque de l’argent, et c’est le découvert ou le retard de paiement qui comble.",
        w: { ex: "Tantie Affoué (fictif) : stock 2 400 000 F ; clientes à crédit 900 000 F ; grossiste 1 100 000 F ; autres dettes du mois 200 000 F. Besoin : 2 000 000 F. Avec 1 700 000 F de fonds de roulement, il manque 300 000 F.", k: "Votre quotidien, à la même date", champs: [ {id:"oa_st", l:"Stock (F, au prix d’achat)", ph:"2 400 000"}, {id:"oa_cl", l:"Clients qui vous doivent (F)", ph:"900 000"}, {id:"oa_fo", l:"Ce que vous devez aux fournisseurs (F)", ph:"1 100 000"}, {id:"oa_ds", l:"Autres dettes du mois : taxes, loyer, salaires (F)", ph:"200 000"} ],
          v: function(D,H){ if(!D.oa_st||!D.oa_cp) return ''; var B=oaB(D,H);
            var h='<div class="gros"><small>Votre trésorerie</small><b>'+H.F(B.tn)+'</b><p>Fonds de roulement '+H.F(B.fr)+' − argent bloqué dans le quotidien '+H.F(B.bfr)+'.</p></div>';
            return h+(B.tn<0?'<div class="verdict v-ko">Votre quotidien bloque plus d’argent que votre fonds de roulement n’en apporte. La différence vient du découvert, des retards de paiement ou de la caisse de la maison. Les leviers sont au chapitre suivant.</div>':B.tn<B.bfr*0.1?'<div class="verdict v-mid">Votre trésorerie est positive, mais juste. Une grosse commande ou une cliente qui paie en retard suffit à la faire passer sous zéro.</div>':'<div class="verdict v-ok">Votre argent long couvre le quotidien, et il reste de la trésorerie. Surveillez-la au rythme de vos ventes : elle bouge avec le stock.</div>'); } },
        p: "J’ai calculé ma trésorerie." },
      { t: "Le piège de la croissance", c: "Quand les ventes montent, le stock et les crédits clients montent aussi. Une activité qui grandit vite peut manquer d’argent alors qu’elle gagne de plus en plus.",
        w: { quiz: [ ["Vos ventes doublent, vous gardez les mêmes délais. Votre argent bloqué…", ["Reste le même","Double à peu près"], 1, "Plus de ventes, c’est plus de stock et plus de clients qui doivent de l’argent : il faut financer cette croissance."], ["Une cliente fidèle achète beaucoup, mais paie à 60 jours", ["C’est seulement une bonne nouvelle","Il faut financer ses 60 jours"], 1, "Elle gonfle vos ventes et votre bénéfice, mais aussi votre argent bloqué."], ["Vous achetez un gros lot pour avoir une remise", ["Ma trésorerie ne change pas","Ma trésorerie baisse jusqu’à la revente"], 1, "La remise est un gain, mais l’argent reste en rayon plus longtemps. Comparez les deux avant de décider."] ] },
        p: "Je connais le piège de la croissance." }
    ]},
    { t: "Les leviers, en jours", acq: "Je sais où gagner de la trésorerie", desc: "Jours de stock, de clients, de fournisseurs.", e: [
      { t: "Mes délais en jours", c: "En jours, les chiffres parlent mieux : combien de jours un produit reste en rayon, combien de jours une cliente met à payer, combien de jours le fournisseur vous laisse.",
        w: { ex: "Tantie Affoué (fictif) : ventes de l’année 14 400 000 F, achats 10 800 000 F. Stock : 80 jours d’achats. Clientes : 22 jours de ventes. Grossiste : 37 jours d’achats.", k: "Vos chiffres de l’année", champs: [ {id:"oa_ca", l:"Ventes de l’année (F)", ph:"14 400 000"}, {id:"oa_ach", l:"Achats de marchandises de l’année (F)", ph:"10 800 000"} ],
          v: function(D,H){ var J=oaD(D,H); if(!J.ca||!J.ach||!D.oa_st) return '';
            var h='<div class="gros"><small>Vos délais</small><b>'+oaJ(J.js+J.jc-J.jf)+'</b><p>C’est le temps entre le jour où vous payez le fournisseur et celui où la cliente vous paie. Stock : '+oaJ(J.js)+' · clients : '+oaJ(J.jc)+' · fournisseurs : '+oaJ(J.jf)+'.</p></div>';
            var M=[]; if(J.js>60) M.push('Votre stock dort plus de deux mois : quels articles ne tournent pas ?'); if(J.jc>30) M.push('Vos clients paient en plus d’un mois : le crédit client vous coûte de la trésorerie.'); if(J.jf<15) M.push('Vos fournisseurs vous laissent peu de temps : c’est un point à négocier.');
            return h+(M.length?'<div class="verdict v-mid">'+M.join(' ')+'</div>':'<div class="verdict v-ok">Vos délais sont tenus. Gardez ce calcul pour le refaire chaque trimestre.</div>'); } },
        p: "J’ai calculé mes délais." },
      { t: "Ce que rapporte chaque jour gagné", c: "Chaque jour de stock en moins, chaque jour de paiement client en moins, chaque jour de délai fournisseur en plus libère de l’argent.",
        w: { k: "Vos objectifs, en jours", champs: [ {id:"oa_gs", l:"Jours de stock en moins", ph:"15"}, {id:"oa_gc", l:"Jours de paiement client en moins", ph:"7"}, {id:"oa_gf", l:"Jours de délai fournisseur en plus", ph:"8"} ],
          v: function(D,H){ var J=oaD(D,H); if(!J.ca||!J.ach) return '<div class="verdict v-mid">Remplissez d’abord vos ventes et vos achats à l’écran précédent.</div>'; var g=H.N(D.oa_gs)*J.ach/360+H.N(D.oa_gc)*J.ca/360+H.N(D.oa_gf)*J.ach/360; if(!g) return '';
            return '<div class="gros"><small>Trésorerie libérée</small><b>'+H.F(g)+'</b><p>Sans vendre un franc de plus, ni emprunter. Mobile money à la livraison, petites commandes plus fréquentes, paiement fournisseur négocié : chaque levier se chiffre.</p></div><div class="verdict v-ok">Choisissez un seul levier à tenir ce mois-ci. Un délai tenu vaut mieux que trois délais promis.</div>'; } },
        p: "J’ai chiffré mes leviers." }
    ]},
    { t: "Mon plan sur trois mois", acq: "Je vois venir les mois difficiles", desc: "Entrées, sorties, le point le plus bas.", e: [
      { t: "Prévoir, mois par mois", c: "Un plan de trésorerie, c’est une simple liste : ce qui va rentrer et ce qui va sortir, mois par mois. Il ne sert pas à deviner l’avenir, mais à voir le trou avant d’y tomber : rentrée scolaire, fêtes, échéance de crédit, gros réassort.",
        w: { ex: "Tantie Affoué (fictif) : en caisse 300 000 F. Septembre : 1 400 000 F d’entrées, 1 700 000 F de sorties (réassort de rentrée). Octobre : 1 300 000 F, 1 200 000 F. Novembre : 1 600 000 F, 1 300 000 F.", k: "Vos trois prochains mois", c3: 1, champs: [ {id:"oa_t0", l:"En caisse et sur mobile money aujourd’hui (F)", ph:"300 000"}, {id:"oa_e1", l:"Mois 1 : entrées (F)", ph:"1 400 000"}, {id:"oa_s1", l:"Mois 1 : sorties (F)", ph:"1 700 000"}, {id:"oa_e2", l:"Mois 2 : entrées (F)", ph:"1 300 000"}, {id:"oa_s2", l:"Mois 2 : sorties (F)", ph:"1 200 000"}, {id:"oa_e3", l:"Mois 3 : entrées (F)", ph:"1 600 000"}, {id:"oa_s3", l:"Mois 3 : sorties (F)", ph:"1 300 000"} ],
          v: function(D,H){ if(!D.oa_e1) return ''; var t=H.N(D.oa_t0), L=[], mn=Infinity, im=0;
            for(var i=1;i<=3;i++){ t+=H.N(D['oa_e'+i])-H.N(D['oa_s'+i]); L.push(t); if(t<mn){mn=t;im=i;} }
            var h='<div class="gros"><small>Votre point le plus bas</small><b>'+H.F(mn)+'</b><p>Fin du mois '+im+'. Fin de chaque mois : '+L.map(function(x,j){return 'mois '+(j+1)+' '+H.F(x);}).join(' · ')+'.</p></div>';
            return h+(mn<0?'<div class="verdict v-ko">Il vous manquera '+H.F(-mn)+' fin du mois '+im+'. Vous le savez maintenant : décalez un achat, relancez les clients, ou négociez avec le fournisseur avant ce mois-là.</div>':mn<H.N(D.oa_min)||mn===0?'<div class="verdict v-mid">Votre caisse tombe très bas fin du mois '+im+' : le moindre imprévu la ferait passer sous zéro. Préparez ce mois-là dès maintenant.</div>':'<div class="verdict v-ok">Votre trésorerie reste positive sur les trois mois. Refaites ce plan chaque mois, en ajoutant un nouveau mois.</div>'); } },
        p: "J’ai fait mon plan de trésorerie." },
      { t: "Ma règle de trésorerie", c: "Écrivez votre règle : le montant que vous gardez toujours en caisse, et ce que vous faites quand le plan montre un trou.",
        w: { consignes: 1, champs: [ {id:"oa_min", l:"Je garde toujours en caisse au moins (F)", ph:"200 000"}, {id:"oa_regle", l:"Quand mon plan montre un trou, je…", type:"area", ph:"Je décale…"} ] },
        p: "Ma règle de trésorerie est écrite." }
    ]}
  ],
  fin: {
    k: "Ma fiche « où est mon argent »", titre: "Vous savez où se loge l’argent de votre activité",
    fiche: [
      ["Fonds de roulement", function(D,H){ return D.oa_cp&&D.oa_im?H.F(oaB(D,H).fr):''; }],
      ["Argent bloqué dans le quotidien", function(D,H){ return D.oa_st?H.F(oaB(D,H).bfr):''; }],
      ["Trésorerie", function(D,H){ return D.oa_st&&D.oa_cp?H.F(oaB(D,H).tn):''; }],
      ["Délais", function(D,H){ var J=oaD(D,H); return J.ca&&J.ach&&D.oa_st?'stock '+oaJ(J.js)+' · clients '+oaJ(J.jc)+' · fournisseurs '+oaJ(J.jf):''; }],
      ["Point le plus bas sur trois mois", function(D,H){ if(!D.oa_e1) return ''; var t=H.N(D.oa_t0), mn=Infinity; for(var i=1;i<=3;i++){ t+=H.N(D['oa_e'+i])-H.N(D['oa_s'+i]); mn=Math.min(mn,t);} return H.F(mn); }],
      ["Ma règle de trésorerie", function(D,H){ return [H.N(D.oa_min)?'minimum en caisse '+H.F(H.N(D.oa_min)):'', D.oa_regle].filter(Boolean).join(' · '); }]
    ],
    suite: { t: "Ma banque va-t-elle me prêter ?", p: "Vous savez ce que gagne votre activité et où se loge son argent. Le prochain atelier vous fait voir votre dossier avec les yeux d’un financeur.", lien: "atelier-ma-banque-va-t-elle-me-preter.html", b: "Atelier suivant" }
  }
};
