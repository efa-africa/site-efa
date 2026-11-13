/* Atelier guidé · Avant de confier son argent ou d'investir (parcours Analyser une entreprise, 5/5) */
function acP(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR')+' %'; }
function acVan(D,H){ var I=H.N(D.ac_inv), r=H.N(D.ac_tx)/100, v=-I, cum=-I, del=0;
  for(var i=1;i<=5;i++){ var f=H.N(D['ac_f'+i]); v+=f/Math.pow(1+r,i); if(!del&&cum+f>=0&&f>0) del=i-1+(-cum)/f; cum+=f; }
  return {I:I, van:v, del:del, tot:cum+I}; }
window.ATELIER = {
  id: "avant-de-confier-ou-d-investir",
  titre: "Avant de confier son argent ou d’investir",
  h1: "Microfinance, banque, projet : lisez les chiffres avant de signer.",
  voix: "auto",
  question: {
    t: "Une microfinance de votre quartier offre 10 % par an sur l’épargne. La banque voisine offre 3 %. Que regardez-vous d’abord ?",
    r: [
      ["a", "Le taux : 10 %, c’est plus de trois fois mieux.", "Le taux est le prix du risque. Une institution qui paie beaucoup plus que les autres doit trouver cet argent quelque part. Avant le taux, vérifiez qu’elle est autorisée, et que ses emprunteurs remboursent.", false],
      ["b", "Son agrément, puis la qualité de ses prêts.", "Exactement. Vous allez apprendre à lire les chiffres clés d’une microfinance et d’une banque, puis à juger un projet d’investissement et les risques venus de l’extérieur.", true]
    ]
  },
  chapitres: [
    { t: "Lire une microfinance", acq: "Je sais lire la santé d’une microfinance", desc: "Agrément, prêts en retard, autonomie.", e: [
      { t: "Avant les chiffres : l’agrément", f: ["Une microfinance doit être agréée : la Banque centrale des États de l’Afrique de l’Ouest (BCEAO) publie la liste des institutions autorisées dans chaque pays de l’Union.", "Si elle n’y figure pas, aucun chiffre ne compte : votre épargne n’est pas protégée par les règles de la profession.", "Demandez ensuite ses derniers comptes et son rapport annuel. Une institution sérieuse les communique."], c: "Un taux d’épargne très au-dessus du marché, une promesse de crédit immédiat contre un dépôt, une institution introuvable dans la liste : trois signaux d’alerte.",
        w: { consignes: 1, puces: { id:"ac_agr", k:"L’institution que je regarde…", l:["Figure sur la liste des institutions agréées","N’y figure pas","Je n’ai pas encore vérifié"] },
          v: function(D){ return D.ac_agr==='N’y figure pas'?'<div class="verdict v-ko">N’y déposez pas d’argent. Vérifiez auprès de la BCEAO ou du ministère des Finances de votre pays : il peut s’agir d’une structure illégale.</div>':D.ac_agr==='Je n’ai pas encore vérifié'?'<div class="verdict v-mid">Commencez par là : c’est la vérification qui compte le plus, et elle prend cinq minutes.</div>':D.ac_agr?'<div class="verdict v-ok">Bonne base. Les chiffres qui suivent disent maintenant si elle est solide.</div>':''; } },
        p: "J’ai vérifié l’agrément." },
      { t: "Les prêts en retard", c: "Le chiffre le plus important d’une microfinance : la part de ses prêts dont un remboursement a plus de 30 jours de retard. Attention, on compte tout ce qui reste dû sur ces prêts, pas seulement l’échéance impayée : c’est le « portefeuille à risque à 30 jours ».",
        w: { ex: "Microfinance fictive : 2 000 000 000 F de prêts en cours, dont 110 000 000 F sur des prêts avec un retard de plus de 30 jours. Portefeuille à risque : 5,5 %. Elle a mis de côté 90 000 000 F pour les pertes probables : elle couvre 82 % de ces prêts en retard.", k: "Les chiffres de son rapport annuel", champs: [ {id:"ac_enc", l:"Total des prêts en cours (F)", ph:"2 000 000 000"}, {id:"ac_r30", l:"Dont prêts avec plus de 30 jours de retard (F)", ph:"110 000 000"}, {id:"ac_prov", l:"Provisions pour pertes (F)", ph:"90 000 000"} ],
          v: function(D,H){ var e=H.N(D.ac_enc), r=H.N(D.ac_r30), p=H.N(D.ac_prov); if(!e||!D.ac_r30) return ''; var par=r/e*100, cv=r?p/r*100:0;
            var h='<div class="gros"><small>Portefeuille à risque à 30 jours</small><b>'+acP(par)+'</b><p>'+(p?'Couverture par les provisions : '+acP(cv)+'.':'')+'</p></div>';
            return h+(par>10?'<div class="verdict v-ko">Plus de 10 % des prêts sont en retard sérieux : les pertes risquent d’entamer les fonds de l’institution, donc l’argent des déposants.</div>':par>5?'<div class="verdict v-mid">Entre 5 et 10 % : une zone de vigilance. Regardez si le chiffre monte ou baisse d’une année sur l’autre, et s’il est bien couvert par des provisions.</div>':'<div class="verdict v-ok">Moins de 5 % : les emprunteurs remboursent bien. C’est un repère courant de bonne qualité, à vérifier dans le temps.</div>'); } },
        p: "J’ai calculé la part des prêts en retard." },
      { t: "Vit-elle de ses propres revenus ?", c: "Une microfinance solide couvre ses charges (intérêts payés, frais de fonctionnement, pertes sur prêts) avec ses propres revenus, sans dons ni subventions. Comptez les revenus hors subventions.",
        w: { k: "Son compte de résultat", champs: [ {id:"ac_rev", l:"Revenus des prêts, hors dons et subventions (F)", ph:"480 000 000"}, {id:"ac_chg", l:"Charges totales : intérêts payés, fonctionnement, pertes (F)", ph:"450 000 000"} ],
          v: function(D,H){ var r=H.N(D.ac_rev), c=H.N(D.ac_chg); if(!r||!c) return ''; var x=r/c*100;
            return '<div class="gros"><small>Autonomie</small><b>'+acP(x)+'</b><p>Ses revenus propres couvrent '+acP(x)+' de ses charges.</p></div>'+(x<100?'<div class="verdict v-ko">Elle ne couvre pas ses charges par ses propres revenus : elle dépend de dons, de subventions ou de nouveaux dépôts.</div>':x<110?'<div class="verdict v-mid">Elle couvre ses charges, de justesse. Une hausse des retards suffirait à la mettre en perte.</div>':'<div class="verdict v-ok">Elle vit de son activité, avec une marge. C’est un signe de solidité durable.</div>'); } },
        p: "J’ai vérifié son autonomie." }
    ]},
    { t: "Lire une banque", acq: "Je lis les quatre chiffres clés d’une banque", desc: "Créances douteuses, couverture, coût de fonctionnement, rentabilité.", e: [
      { t: "Une entreprise pas comme les autres", f: ["Une banque travaille surtout avec l’argent des autres : les dépôts. Ses propres fonds ne représentent souvent qu’une petite part de son bilan.", "Son métier : prêter plus cher qu’elle n’emprunte, en évitant que les emprunteurs ne remboursent pas.", "Ses comptes sont publics, et ses règles de prudence sont fixées par les autorités bancaires."], c: "Quatre chiffres suffisent pour une première lecture : la part de prêts douteux, leur couverture, ce que coûte son fonctionnement, et ce qu’elle rapporte à ses actionnaires.",
        p: "Je sais ce qui distingue une banque." },
      { t: "Mes quatre chiffres", c: "Prenez les chiffres d’une banque dans son rapport annuel.",
        w: { ex: "Banque fictive : prêts bruts 900 milliards F, dont 54 milliards douteux, provisionnés à 38 milliards ; revenus nets de l’activité (on dit « produit net bancaire ») 95 milliards, frais de fonctionnement 52 milliards ; bénéfice 22 milliards pour 160 milliards de fonds propres.", k: "En milliards de F", champs: [ {id:"ac_bp", l:"Prêts bruts", ph:"900"}, {id:"ac_bd", l:"Dont prêts douteux", ph:"54"}, {id:"ac_bpr", l:"Provisions sur ces prêts", ph:"38"}, {id:"ac_pnb", l:"Produit net bancaire", ph:"95"}, {id:"ac_fg", l:"Frais de fonctionnement", ph:"52"}, {id:"ac_rn", l:"Bénéfice", ph:"22"}, {id:"ac_fp", l:"Fonds propres", ph:"160"} ],
          v: function(D,H){ var bp=H.N(D.ac_bp), bd=H.N(D.ac_bd); if(!bp||!D.ac_bd) return ''; var td=bd/bp*100, cv=bd?H.N(D.ac_bpr)/bd*100:0, ce=H.N(D.ac_pnb)?H.N(D.ac_fg)/H.N(D.ac_pnb)*100:0, roe=H.N(D.ac_fp)?H.N(D.ac_rn)/H.N(D.ac_fp)*100:0, M=[];
            if(td>10) M.push('Plus de 10 % de prêts douteux : qualité de portefeuille faible.'); if(cv&&cv<50) M.push('Moins de la moitié des prêts douteux est provisionnée : des pertes peuvent encore apparaître.'); if(ce>70) M.push('Le fonctionnement absorbe plus de 70 % des revenus : la banque est peu efficace.');
            return '<div class="gros"><small>Lecture rapide</small><b>'+acP(td)+' de prêts douteux</b><p>Couverture : '+acP(cv)+(ce?' · coût de fonctionnement : '+acP(ce)+' des revenus':'')+(roe?' · rentabilité des fonds propres : '+acP(roe):'')+'.</p></div>'+(M.length?'<div class="verdict v-mid">'+M.join(' ')+'</div>':'<div class="verdict v-ok">Ces quatre chiffres ne montrent pas de signal d’alerte. Comparez-les à ceux d’autres banques du pays, et sur plusieurs années.</div>'); } },
        p: "J’ai lu les quatre chiffres." }
    ]},
    { t: "Juger un projet", acq: "Je sais si un projet rapporte plus qu’il ne coûte", desc: "Délai de récupération et valeur d’aujourd’hui.", e: [
      { t: "Deux questions", f: ["En combien de temps je récupère ma mise ? C’est le délai de récupération.", "Ce que rapporte le projet vaut-il mieux que de placer l’argent ailleurs ? 100 000 F dans trois ans valent moins que 100 000 F aujourd’hui, car aujourd’hui on peut les placer.", "On ramène donc chaque gain futur à sa valeur d’aujourd’hui, avec le taux que l’on obtiendrait ailleurs, plus une marge pour le risque."], c: "Si la somme des gains ramenés à aujourd’hui dépasse la mise, le projet crée de la valeur. Sinon, mieux vaut placer l’argent.",
        p: "Je connais les deux questions." },
      { t: "Mon projet, année par année", c: "Indiquez la mise et l’argent net que le projet rapportera chaque année (ventes moins toutes ses charges). Pour le taux, partez de ce que rapporte un placement sûr, et ajoutez une marge pour le risque.",
        w: { ex: "Un congélateur et une vitrine pour vendre des boissons fraîches (fictif) : mise 1 500 000 F ; gains nets 500 000, 550 000, 550 000, 500 000 puis 400 000 F ; taux 12 %. Récupération en 2,8 ans ; valeur créée aujourd’hui : environ 320 000 F.", k: "Votre projet", c3: 1, champs: [ {id:"ac_inv", l:"Mise de départ (F)", ph:"1 500 000"}, {id:"ac_tx", l:"Taux de comparaison (%)", ph:"12"}, {id:"ac_f1", l:"Année 1 (F)", ph:"500 000"}, {id:"ac_f2", l:"Année 2 (F)", ph:"550 000"}, {id:"ac_f3", l:"Année 3 (F)", ph:"550 000"}, {id:"ac_f4", l:"Année 4 (F)", ph:"500 000"}, {id:"ac_f5", l:"Année 5 (F)", ph:"400 000"} ],
          v: function(D,H){ if(!D.ac_inv||!D.ac_f1) return ''; var R=acVan(D,H);
            var h='<div class="gros"><small>Valeur créée, ramenée à aujourd’hui</small><b>'+H.F(R.van)+'</b><p>Gains cumulés : '+H.F(R.tot)+' · '+(R.del?'mise récupérée en '+(Math.round(R.del*10)/10).toLocaleString('fr-FR')+' ans':'mise non récupérée en 5 ans')+'.</p></div>';
            return h+(R.van<0?'<div class="verdict v-ko">Le projet rapporte moins que le placement de comparaison. Il ne vaut la peine que s’il apporte autre chose (emploi pour un proche, savoir-faire), et en le sachant.</div>':R.del>3.5?'<div class="verdict v-mid">Le projet crée de la valeur, mais la mise met longtemps à revenir. Tout retard dans les premières années pèsera lourd.</div>':'<div class="verdict v-ok">Le projet crée de la valeur et la mise revient assez vite. Testez maintenant un scénario prudent : gains de la première année divisés par deux.</div>'); } },
        p: "J’ai jugé mon projet." }
    ]},
    { t: "Les risques venus de dehors", acq: "Je mesure l’effet du dollar et de l’inflation", desc: "Ce qui ne dépend pas de vous, mais se calcule.", e: [
      { t: "Le dollar dans mes coûts", c: "Le franc CFA est lié à l’euro, mais pas au dollar. Riz, carburant, téléphones, pièces détachées s’achètent souvent en dollars : quand le dollar monte, vos coûts montent, même si vous payez en francs.",
        w: { ex: "Un vendeur d’accessoires de téléphone (fictif) : 1 200 000 F d’achats par mois, dont 80 % suivent le dollar ; il gagne 300 000 F par mois. Si le dollar monte de 10 % et qu’il ne répercute que la moitié sur ses prix, son gain baisse de 48 000 F, soit 16 %.", k: "Votre exposition", champs: [ {id:"ac_achm", l:"Achats du mois (F)", ph:"1 200 000"}, {id:"ac_usd", l:"Part qui suit le dollar (%)", ph:"80"}, {id:"ac_gain", l:"Ce que vous gagnez par mois (F)", ph:"300 000"}, {id:"ac_hausse", l:"Hausse du dollar à tester (%)", ph:"10"}, {id:"ac_rep", l:"Part de la hausse que vous répercutez sur vos prix (%)", ph:"50"} ],
          v: function(D,H){ var a=H.N(D.ac_achm), u=H.N(D.ac_usd)/100, g=H.N(D.ac_gain), hs=H.N(D.ac_hausse)/100, rp=H.N(D.ac_rep)/100; if(!a||!g||!D.ac_hausse) return ''; var perte=a*u*hs*(1-rp), pct=perte/g*100;
            return '<div class="gros"><small>Effet sur votre gain mensuel</small><b>−'+H.F(perte)+'</b><p>Soit '+acP(pct)+' de ce que vous gagnez.</p></div>'+(pct>30?'<div class="verdict v-ko">Une hausse du dollar emporterait une grosse part de votre gain. Pistes : acheter en plusieurs fois, garder un stock de sécurité avant les hausses annoncées, revoir vos prix plus souvent.</div>':pct>10?'<div class="verdict v-mid">L’effet est sensible. Suivez le cours du dollar et prévoyez une révision de vos prix.</div>':'<div class="verdict v-ok">Votre exposition reste limitée. Refaites ce calcul si vos achats importés augmentent.</div>'); } },
        p: "J’ai mesuré mon exposition au dollar." },
      { t: "L’inflation dans mes chiffres", c: "Si vos ventes montent de 8 % alors que les prix ont monté de 5 %, vous ne vendez pas 8 % de plus : vous vendez à peu près 3 % de plus. Le calcul juste : (1 + croissance) ÷ (1 + inflation) − 1.",
        w: { k: "Vos chiffres", champs: [ {id:"ac_cr", l:"Hausse de vos ventes sur un an (%)", ph:"8"}, {id:"ac_inf", l:"Hausse des prix sur un an (%)", ph:"5"} ],
          v: function(D,H){ if(!D.ac_cr||!D.ac_inf) return ''; var r=((1+H.N(D.ac_cr)/100)/(1+H.N(D.ac_inf)/100)-1)*100;
            return '<div class="gros"><small>Croissance réelle</small><b>'+acP(r)+'</b><p>Une fois la hausse des prix retirée.</p></div>'+(r<0?'<div class="verdict v-ko">En réalité, votre activité recule : vos ventes montent moins vite que les prix.</div>':'<div class="verdict v-ok">C’est votre vraie croissance. Utilisez ce chiffre, pas l’autre, pour juger votre année.</div>'); } },
        p: "J’ai calculé ma croissance réelle." },
      { t: "Ma décision", c: "Écrivez ce que vous retenez : l’institution ou le projet que vous examinez, ce que disent les chiffres, et ce que vous décidez.",
        w: { consignes: 1, champs: [ {id:"ac_dec", l:"Ce que je décide, et pourquoi", type:"area", ph:"Je…"} ] },
        p: "Ma décision est écrite." }
    ]}
  ],
  fin: {
    k: "Ma fiche « avant de confier ou d’investir »", titre: "Vous lisez les chiffres avant de signer",
    fiche: [
      ["Agrément vérifié", function(D){ return D.ac_agr||''; }],
      ["Prêts en retard de la microfinance", function(D,H){ var e=H.N(D.ac_enc); return e&&D.ac_r30?acP(H.N(D.ac_r30)/e*100):''; }],
      ["Prêts douteux de la banque", function(D,H){ var b=H.N(D.ac_bp); return b&&D.ac_bd?acP(H.N(D.ac_bd)/b*100):''; }],
      ["Valeur créée par mon projet", function(D,H){ return D.ac_inv&&D.ac_f1?H.F(acVan(D,H).van):''; }],
      ["Effet d’une hausse du dollar", function(D,H){ var a=H.N(D.ac_achm), g=H.N(D.ac_gain); return a&&g&&D.ac_hausse?'−'+H.F(a*H.N(D.ac_usd)/100*H.N(D.ac_hausse)/100*(1-H.N(D.ac_rep)/100))+' par mois':''; }],
      ["Ma décision", function(D){ return D.ac_dec||''; }]
    ],
    suite: { t: "Lire une société cotée", p: "Vous savez lire les chiffres d’une activité, d’une microfinance et d’une banque. Pour aller plus loin, appliquez la même lecture aux sociétés de la Bourse régionale. EFA fait de l’éducation financière, pas du conseil en placement.", lien: "atelier-lire-societe-cotee.html", b: "Ouvrir l’atelier" }
  }
};
