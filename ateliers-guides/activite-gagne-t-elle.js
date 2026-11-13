/* Atelier guidé · Mon activité gagne-t-elle vraiment de l'argent ? (parcours Analyser une entreprise, 1/5) */
function agP(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR')+' %'; }
function agC(D,H){
  var ca=H.N(D.ag_ca), ach=H.N(D.ag_ach), sto=H.N(D.ag_sto), ext=H.N(D.ag_ext), per=H.N(D.ag_per), tax=H.N(D.ag_tax), amo=H.N(D.ag_amo), int=H.N(D.ag_int), imp=H.N(D.ag_imp);
  var cons=ach-sto, marge=ca-cons, va=marge-ext, ebe=va-per-tax, rex=ebe-amo, rn=rex-int-imp;
  return {ca:ca, cons:cons, marge:marge, va:va, ebe:ebe, rex:rex, rn:rn, amo:amo, caf:rn+amo};
}
window.ATELIER = {
  id: "activite-gagne-t-elle",
  titre: "Mon activité gagne-t-elle vraiment de l’argent ?",
  h1: "Vous vendez beaucoup. Mais que gagnez-vous vraiment ?",
  voix: "auto",
  question: {
    t: "Tonton Bamba vend pour 3 millions de F par mois dans sa quincaillerie. Combien gagne-t-il ?",
    r: [
      ["a", "À peu près 3 millions, puisque c’est ce qui rentre.", "C’est la confusion la plus fréquente : ce qui rentre n’est pas ce qui reste. Une grande partie de ces 3 millions repart en achats, en loyer, en salaires. Vous allez voir combien il reste vraiment.", false],
      ["b", "On ne peut pas savoir sans connaître ses coûts.", "Exactement. Le chiffre de ventes dit l’activité, pas le gain. Vous allez descendre, étage par étage, des ventes jusqu’au bénéfice, avec vos propres chiffres.", true]
    ]
  },
  chapitres: [
    { t: "Ventes et bénéfice", acq: "Je distingue ce qui rentre de ce qui reste", desc: "Le chiffre d’affaires, la marge, et ce qui les sépare.", e: [
      { t: "Ce qui rentre n’est pas ce qui reste", f: ["Le chiffre d’affaires : tout ce que vous avez vendu sur la période, payé ou pas encore.", "Le bénéfice : ce qui reste quand toutes les dépenses de l’activité sont payées.", "Entre les deux, il y a des étages. Chaque étage répond à une question différente."], c: "Une activité peut vendre beaucoup et ne rien gagner. Une autre peut vendre peu et bien gagner. Seul le calcul étage par étage le dit.",
        p: "Je sais que le chiffre d’affaires n’est pas le bénéfice." },
      { t: "Étage 1 : la marge sur ce que je revends", c: "La marge, c’est ce que vous gagnez sur les produits eux-mêmes : vos ventes moins le coût de ce que vous avez vendu. Attention : on compte ce qui est sorti du stock, pas tout ce qui a été acheté.",
        w: { ex: "Tonton Bamba (exemple fictif), sur un an : ventes 36 000 000 F ; achats 27 000 000 F ; son stock a augmenté de 1 000 000 F (il a acheté plus qu’il n’a vendu). Coût de ce qui est vendu : 26 000 000 F. Marge : 10 000 000 F, soit 27,8 % des ventes.", k: "Vos chiffres sur une année · ils restent sur votre téléphone, EFA ne les garde pas. Vous pouvez mettre des chiffres fictifs, proches de votre réalité.", champs: [ {id:"ag_ca", l:"Ventes de l’année (F)", ph:"36 000 000"}, {id:"ag_ach", l:"Achats de marchandises (F)", ph:"27 000 000"}, {id:"ag_sto", l:"Hausse du stock sur l’année (F, négatif s’il a baissé)", ph:"1 000 000"} ],
          v: function(D,H){ var R=agC(D,H); if(!R.ca||!D.ag_ach) return ''; var t=R.marge/R.ca*100;
            var h='<div class="gros"><small>Marge sur marchandises</small><b>'+H.F(R.marge)+'</b><p>Soit '+agP(t)+' de vos ventes. Coût de ce qui est vendu : '+H.F(R.cons)+'.</p></div>';
            return h+(R.marge<=0?'<div class="verdict v-ko">Vous revendez à perte, ou votre stock est mal compté. Avant tout le reste, vérifiez vos prix de vente et votre inventaire.</div>':t<15?'<div class="verdict v-mid">Une marge fine : chaque franc de loyer ou de salaire doit être tenu de près. C’est courant dans le commerce de gros, plus risqué au détail.</div>':'<div class="verdict v-ok">Votre marge laisse de la place pour payer les charges. Reste à voir ce qu’elles en prennent.</div>'); } },
        p: "J’ai calculé ma marge." },
      { t: "Le piège du stock", c: "Acheter beaucoup en fin d’année fait baisser la marge si l’on oublie le stock, et la gonfle si l’on compte un stock qui n’existe plus.",
        w: { quiz: [ ["Vous avez acheté 2 millions de marchandises encore en rayon au 31 décembre. Elles comptent dans le coût de l’année ?", ["Oui, je les ai payées","Non, elles sont encore en stock"], 1, "Elles seront un coût le jour où vous les vendrez. Cette année, elles restent un stock : un bien que vous possédez."], ["Votre inventaire compte des produits abîmés qui ne se vendront pas", ["Je les garde au prix d’achat","Je les retire ou je baisse leur valeur"], 1, "Un stock invendable gonfle la marge sur le papier. Mieux vaut le constater tôt."], ["Vous ne faites jamais d’inventaire", ["Ma marge est fiable quand même","Ma marge est une estimation"], 1, "Sans comptage du stock, la marge n’est qu’une estimation. Un inventaire par an, au même moment, change tout."] ] },
        p: "Je sais pourquoi le stock compte." }
    ]},
    { t: "De la marge au bénéfice", acq: "Je descends les étages jusqu’au bénéfice", desc: "Charges, salaires, usure du matériel, intérêts, impôt.", e: [
      { t: "Les étages, un par un", f: ["Ce que l’activité produit : la marge moins ce qu’on paie à l’extérieur (loyer, transport, électricité, téléphone, réparations).", "Ce que le métier dégage : ce qui précède, moins les salaires et les taxes. C’est le meilleur indicateur de la santé du métier lui-même.", "Le bénéfice : ce qui précède, moins l’usure du matériel, les intérêts des crédits et l’impôt."], c: "Chaque étage enlève une catégorie de coûts. Si un étage devient négatif, vous savez exactement où chercher.",
        p: "Je connais les étages." },
      { t: "Mes étages, avec mes chiffres", c: "L’usure du matériel (on dit « amortissement ») se compte même si vous ne sortez pas d’argent cette année : une moto de livraison de 900 000 F qui dure 3 ans coûte 300 000 F par an.",
        w: { ex: "Tonton Bamba (fictif) : charges extérieures 3 600 000 F, salaires 3 000 000 F, taxes 400 000 F, usure du matériel 500 000 F, intérêts 300 000 F, impôt 450 000 F.", k: "Vos charges de l’année", champs: [ {id:"ag_ext", l:"Charges extérieures : loyer, transport, électricité… (F)", ph:"3 600 000"}, {id:"ag_per", l:"Salaires, y compris le vôtre si vous en prenez un (F)", ph:"3 000 000"}, {id:"ag_tax", l:"Taxes et patente (F)", ph:"400 000"}, {id:"ag_amo", l:"Usure du matériel (F par an)", ph:"500 000"}, {id:"ag_int", l:"Intérêts des crédits (F)", ph:"300 000"}, {id:"ag_imp", l:"Impôt sur le bénéfice (F)", ph:"450 000"} ],
          v: function(D,H){ var R=agC(D,H); if(!R.ca||!D.ag_ext) return '';
            var L=[['Marge',R.marge],['Ce que l’activité produit',R.va],['Ce que le métier dégage',R.ebe],['Résultat du métier',R.rex],['Bénéfice',R.rn]];
            var h='<div class="gros"><small>Bénéfice de l’année</small><b>'+H.F(R.rn)+'</b><p>'+L.map(function(x){return x[0]+' : '+H.F(x[1])+' ('+agP(x[1]/R.ca*100)+')';}).join(' · ')+'</p></div>';
            var neg=L.filter(function(x){return x[1]<0;})[0];
            return h+(neg?'<div class="verdict v-ko">L’étage « '+neg[0]+' » devient négatif. C’est là qu’il faut chercher : les coûts de cet étage dépassent ce que l’étage du dessus apporte.</div>':R.rn/R.ca<0.03?'<div class="verdict v-mid">Le bénéfice reste mince : moins de 3 F gagnés pour 100 F vendus. Une petite hausse de coût suffirait à le faire disparaître.</div>':'<div class="verdict v-ok">Chaque étage reste positif. Gardez ce calcul : il servira à le comparer d’une année sur l’autre.</div>'); } },
        p: "J’ai calculé mon bénéfice étage par étage." },
      { t: "Mon salaire dans le calcul", c: "Beaucoup d’entrepreneurs ne comptent pas leur propre travail. Le bénéfice paraît bon, mais il paie en réalité leur salaire.",
        w: { puces: { id:"ag_sal", k:"Dans mes salaires, le mien…", l:["Est compté","N’est pas compté"] },
          v: function(D,H){ if(D.ag_sal!=='N’est pas compté') return D.ag_sal?'<div class="verdict v-ok">Bien : votre bénéfice est ce qui reste après avoir payé votre travail.</div>':''; var R=agC(D,H);
            return '<div class="verdict v-mid">Votre bénéfice de '+H.F(R.rn||0)+' paie d’abord votre travail. Retirez ce qu’il faudrait payer quelqu’un pour faire votre travail : ce qui reste est le vrai gain de l’activité.</div>'; } },
        p: "J’ai vérifié que mon travail est compté." }
    ]},
    { t: "L’argent que l’activité produit", acq: "Je sais combien l’activité produit pour rembourser et investir", desc: "Le bénéfice n’est pas l’argent disponible.", e: [
      { t: "Bénéfice et argent produit", f: ["L’usure du matériel est un coût, mais aucun billet ne sort cette année : l’argent reste dans l’activité.", "L’argent produit par l’activité = bénéfice + usure du matériel. C’est ce qui peut rembourser les crédits, payer le nouveau matériel ou être prélevé.", "Un banquier regarde ce chiffre avant le bénéfice : c’est lui qui rembourse."], c: "On l’appelle aussi « capacité d’autofinancement ». Le nom importe peu : retenez que c’est la source de tout remboursement.",
        w: { consignes: 1, k:"Repris de l’écran précédent", v: function(D,H){ var R=agC(D,H); if(!R.ca||!D.ag_ext) return '<div class="verdict v-mid">Remplissez d’abord vos charges au chapitre précédent.</div>';
            return '<div class="gros"><small>Argent produit par l’activité sur l’année</small><b>'+H.F(R.caf)+'</b><p>Bénéfice '+H.F(R.rn)+' + usure du matériel '+H.F(R.amo)+'. Soit '+agP(R.caf/R.ca*100)+' de vos ventes.</p></div>'; } },
        p: "Je connais l’argent que mon activité produit." },
      { t: "Peut-il rembourser ?", c: "Comparez l’argent produit à ce que vous devez rembourser chaque année en capital. Un banquier veut voir de la marge entre les deux.",
        w: { ex: "Tonton Bamba (fictif) : il produit 2 250 000 F par an et rembourse 1 200 000 F de capital. Il lui reste 1 050 000 F pour investir ou se payer : il couvre 1,9 fois ses remboursements.", k: "Vos remboursements", champs: [ {id:"ag_remb", l:"Capital remboursé par an, tous crédits (F)", ph:"1 200 000"}, {id:"ag_prel", l:"Ce que vous prélevez pour la maison par an, hors salaire compté (F)", ph:"0"} ],
          v: function(D,H){ var R=agC(D,H), rb=H.N(D.ag_remb), pr=H.N(D.ag_prel); if(!R.ca||!D.ag_remb) return ''; var reste=R.caf-rb-pr, cv=rb?R.caf/rb:0;
            var h='<div class="gros"><small>Ce qui reste après remboursements et prélèvements</small><b>'+H.F(reste)+'</b><p>Argent produit '+H.F(R.caf)+(rb?' · couvre '+(Math.round(cv*10)/10).toLocaleString('fr-FR')+' fois les remboursements':'')+'.</p></div>';
            return h+(reste<0?'<div class="verdict v-ko">L’activité ne produit pas assez pour rembourser et pour ce que vous prélevez. La différence sort de la trésorerie, jusqu’au jour où elle manque.</div>':cv&&cv<1.3?'<div class="verdict v-mid">Vous couvrez vos remboursements de justesse. Un mauvais mois, et l’échéance devient difficile.</div>':'<div class="verdict v-ok">L’activité produit de quoi rembourser avec une marge. C’est ce qu’un financeur veut voir.</div>'); } },
        p: "J’ai comparé l’argent produit à mes remboursements." },
      { t: "Vrai ou faux ?", w: { quiz: [ ["Un bénéfice élevé veut dire beaucoup d’argent en caisse", ["Vrai","Faux"], 1, "Le bénéfice peut être bloqué dans le stock ou chez les clients qui paient à crédit. C’est l’objet de l’atelier suivant."], ["L’usure du matériel ne compte pas, puisqu’on ne paie rien cette année", ["Vrai","Faux"], 1, "Elle compte : le jour où il faudra remplacer la moto, l’argent devra être là."], ["Prélever plus que ce que l’activité produit finit par vider la caisse", ["Vrai","Faux"], 0, "Ce qui sort sans être produit vient de la trésorerie, des fournisseurs ou de nouveaux crédits."] ] },
        p: "J’ai répondu aux trois questions." }
    ]},
    { t: "Mon point mort", acq: "Je connais le niveau de ventes qui couvre mes charges", desc: "Charges fixes, charges qui suivent les ventes, seuil.", e: [
      { t: "Deux sortes de charges", f: ["Celles qui suivent les ventes : marchandises, emballages, commissions, transport par livraison.", "Celles qui tombent quoi qu’il arrive : loyer, salaires fixes, abonnements, remboursements, patente.", "Le point mort : le niveau de ventes où la marge couvre juste les charges fixes. En dessous, vous perdez de l’argent."], c: "Connaître son point mort, c’est savoir chaque mois à partir de quel jour on travaille pour soi.",
        p: "Je sais distinguer les deux sortes de charges." },
      { t: "Mon point mort", c: "Le calcul : charges fixes ÷ part de chaque vente qui reste après les charges qui suivent les ventes.",
        w: { ex: "Tonton Bamba (fictif) : ventes 3 000 000 F par mois ; charges qui suivent les ventes 2 250 000 F (il garde 25 F sur 100 F vendus) ; charges fixes 600 000 F. Point mort : 600 000 ÷ 0,25 = 2 400 000 F de ventes, atteint vers le 24e jour du mois.", k: "Vos chiffres d’un mois normal", champs: [ {id:"ag_vm", l:"Ventes du mois (F)", ph:"3 000 000"}, {id:"ag_cv", l:"Charges qui suivent les ventes (F)", ph:"2 250 000"}, {id:"ag_cf", l:"Charges fixes du mois (F)", ph:"600 000"} ],
          v: function(D,H){ var v=H.N(D.ag_vm), cv=H.N(D.ag_cv), cf=H.N(D.ag_cf); if(!v||!D.ag_cv||!D.ag_cf) return ''; var t=(v-cv)/v;
            if(t<=0) return '<div class="verdict v-ko">Vos charges qui suivent les ventes dépassent vos ventes : chaque vente vous fait perdre de l’argent. Revoyez vos prix avant tout.</div>';
            var pm=cf/t, j=Math.min(31,Math.ceil(pm/v*30)), res=v-cv-cf, ms=(v-pm)/v*100, choc=res?((v*0.9*t-cf)-res)/Math.abs(res)*100:0;
            var h='<div class="gros"><small>Votre point mort mensuel</small><b>'+H.F(pm)+'</b><p>Il reste '+agP(t*100)+' de chaque vente pour payer les charges fixes. '+(pm<=v?'Atteint vers le '+j+'<sup>e</sup> jour du mois. Marge de sécurité : '+agP(ms)+'. Si vos ventes baissent de 10 %, votre résultat du mois varie de '+agP(choc)+'.':'Vos ventes actuelles ne l’atteignent pas.')+'</p></div>';
            return h+(pm>v?'<div class="verdict v-ko">Vous êtes sous votre point mort : vous perdez '+H.F(-res)+' par mois. Il faut vendre plus, garder plus par vente, ou baisser les charges fixes.</div>':ms<15?'<div class="verdict v-mid">Vous êtes juste au-dessus : une mauvaise semaine suffit à passer en perte. C’est le moment de travailler les charges fixes.</div>':'<div class="verdict v-ok">Vous dépassez votre point mort avec de la marge. Surveillez-le à chaque nouvelle charge fixe : un loyer plus cher le déplace.</div>'); } },
        p: "J’ai calculé mon point mort." },
      { t: "Mon plan d’action", c: "Trois leviers déplacent le point mort. Choisissez celui que vous allez travailler en premier, et écrivez votre première action.",
        w: { puces: { id:"ag_lev", k:"Mon premier levier", l:["Garder plus sur chaque vente (prix, achats)","Baisser une charge fixe","Vendre plus sans ajouter de charge fixe"] }, champs: [ {id:"ag_act", l:"Ma première action, cette semaine", type:"area", ph:"Je renégocie…"} ] },
        p: "J’ai choisi mon levier et ma première action." }
    ]}
  ],
  fin: {
    k: "Ma fiche « ce que gagne mon activité »", titre: "Vous savez ce que votre activité gagne vraiment",
    fiche: [
      ["Ventes de l’année", function(D,H){ return H.N(D.ag_ca)?H.F(H.N(D.ag_ca)):''; }],
      ["Marge sur marchandises", function(D,H){ var R=agC(D,H); return R.ca&&D.ag_ach?H.F(R.marge)+' · '+agP(R.marge/R.ca*100):''; }],
      ["Ce que le métier dégage", function(D,H){ var R=agC(D,H); return R.ca&&D.ag_ext?H.F(R.ebe):''; }],
      ["Bénéfice", function(D,H){ var R=agC(D,H); return R.ca&&D.ag_ext?H.F(R.rn):''; }],
      ["Argent produit par l’activité", function(D,H){ var R=agC(D,H); return R.ca&&D.ag_ext?H.F(R.caf):''; }],
      ["Point mort mensuel", function(D,H){ var v=H.N(D.ag_vm), cv=H.N(D.ag_cv), cf=H.N(D.ag_cf); return v&&v>cv&&cf?H.F(cf/((v-cv)/v)):''; }],
      ["Mon levier et ma première action", function(D){ return [D.ag_lev, D.ag_act].filter(Boolean).join(' · '); }]
    ],
    suite: { t: "Où est passé l’argent de mon activité ?", p: "Vous savez ce que gagne votre activité. Le prochain atelier montre où cet argent se loge : stock, clients, fournisseurs, trésorerie.", lien: "atelier-ou-est-l-argent-de-mon-activite.html", b: "Atelier suivant" }
  }
};
