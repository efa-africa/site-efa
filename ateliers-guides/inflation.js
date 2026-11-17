/* Atelier guidé · Investir et entreprendre quand les prix montent (17 nov. 2026)
   Inflation UEMOA : 3,5 % en 2024, 0,0 % en 2025 (BCEAO, rapport annuel sur les prix 2025). Chiffres mensuels 2026 non cités :
   les publications divergent. Personnages et montants : exercices. Résultat : « Le chiffre que je suis chaque mois ». */
window.ATELIER = {
  id: "inflation",
  titre: "Investir et entreprendre quand les prix montent",
  h1: "Ce qui entre, ce que ça coûte, et ce qui reste vraiment.",
  voix: "auto",
  question: {
    t: "Votre activité vend davantage. Pourtant, à la fin du mois, il vous reste moins. Comment est-ce possible ?",
    r: [
      ["a", "C’est impossible : si je vends plus, je gagne plus.", "C’est le piège. Quand vos coûts montent plus vite que vos prix, vous encaissez plus et il vous reste moins. Le chapitre 1 le montre avec un plat à 1 000 F.", false],
      ["b", "Mes coûts ont peut-être monté plus vite que mes prix.", "Exactement. Cet atelier vous apprend à le voir à temps, pour votre activité comme pour votre épargne.", true]
    ]
  },
  chapitres: [
    { t: "Le piège de la marge", acq: "Je vois quand mes coûts montent plus vite que mes prix", desc: "Le chiffre d’affaires peut monter pendant que la marge baisse. L’inflation générale n’est pas la vôtre.", e: [
      { t: "Vendre plus cher, et gagner moins", c: "Aminata vend des plats à Abidjan. Chaque portion lui rapporte 1 000 F et lui coûte 800 F : il lui reste 200 F. Ingrédients, emballage, transport augmentent : son coût passe à 920 F, soit +15 %. Elle ne relève son prix qu’à 1 050 F, soit +5 %, pour garder ses clients. Il ne lui reste plus que 130 F par portion.",
        w: { ex: "Avant : 1 000 − 800 = 200 F. Après : 1 050 − 920 = 130 F. Elle encaisse plus par plat, mais sa marge a reculé de 35 %.", k: "Votre produit, par unité", champs: [ {id:"in_p0", l:"Prix de vente avant (F)"}, {id:"in_c0", l:"Coût avant (F)"}, {id:"in_p1", l:"Prix de vente aujourd’hui (F)"}, {id:"in_c1", l:"Coût aujourd’hui (F)"} ],
          v: function(D,H){ var p0=H.N(D.in_p0), c0=H.N(D.in_c0), p1=H.N(D.in_p1), c1=H.N(D.in_c1); if(!p0||!c0) return ''; var m0=p0-c0; if(!p1||!c1) return '<div class="gros"><small>Ce qui restait par unité</small><b>'+H.F(m0)+'</b><p>Ajoutez vos chiffres d’aujourd’hui.</p></div>';
            var m1=p1-c1, v=m0?Math.round((m1-m0)/Math.abs(m0)*100):0;
            return '<div class="gros"><small>Ce qui reste par unité · avant → aujourd’hui</small><b>'+H.F(m0)+' → '+H.F(m1)+'</b><p>'+(m1<m0?'Votre marge a reculé de '+Math.abs(v)+' %, même si votre prix a monté. ':'Votre marge tient. ')+'Avant les autres charges de l’activité.</p></div>'; } },
        p: "Je calcule ma marge par produit, pas seulement ce qui entre." },
      { t: "Quel chiffre d’inflation regarder ?", c: "L’inflation mesure l’évolution moyenne d’un panier de prix à la consommation. Tous les prix ne montent pas au même rythme : le panier d’une famille, les achats d’une restauratrice et les coûts d’une usine sont différents. Dans l’UEMOA, selon la BCEAO, l’inflation moyenne est passée de 3,5 % en 2024 à 0,0 % en 2025.",
        f: ["0,0 % en 2025 ne veut pas dire que les prix sont revenus à leur niveau d’avant. Cela veut dire qu’en moyenne, ils ont cessé d’augmenter par rapport à 2024.", "Une inflation générale faible peut coexister avec une forte hausse de l’ingrédient que vous utilisez chaque jour.", "Pour une activité, le chiffre décisif reste celui de vos propres coûts."],
        w: { consignes: 1, quiz: [
          ["L’inflation moyenne est de 2 %. L’huile que vous achetez a pris 15 %. Quel chiffre guide vos prix ?", ["Les 2 % de l’inflation moyenne","Les 15 % de mon huile, et mes autres coûts"], 1, "La moyenne nationale décrit un panier de consommation. Votre marge dépend de vos achats à vous."]
        ] },
        p: "Je suis mes propres coûts, pas seulement l’inflation moyenne." }
    ]},
    { t: "Mon épargne et les prix", acq: "Je calcule ce que mon placement rapporte en pouvoir d’achat", desc: "Plus de francs ne veut pas toujours dire plus de pouvoir d’achat.", e: [
      { t: "Votre argent gagne-t-il en pouvoir d’achat ?", c: "Serge place 1 000 000 F pendant un an et obtient, dans notre exercice, 6 % après frais : il finit avec 1 060 000 F. Pour savoir s’il peut acheter davantage qu’avant, il compare ce gain à la hausse des prix sur la même période.",
        w: { ex: "Avec 6 % de gain et 3,5 % de hausse des prix (hypothèse d’exercice), le gain de pouvoir d’achat est d’environ 2,4 % : 1,06 ÷ 1,035 − 1. Avec 7 % de hausse des prix, Serge aurait plus de francs, mais pourrait acheter un peu moins qu’au départ.", k: "Votre calcul", c3: 1, champs: [ {id:"in_m", l:"Somme placée (F)"}, {id:"in_r", l:"Rendement après frais (%)"}, {id:"in_i", l:"Hausse des prix (%)"} ],
          v: function(D,H){ var m=H.N(D.in_m), r=H.N(D.in_r), i=H.N(D.in_i); if(!m||!D.in_r||!D.in_i) return ''; var reel=((1+r/100)/(1+i/100)-1)*100, fin=m*(1+r/100), pa=Math.round(fin/(1+i/100));
            return '<div class="gros"><small>Gain en pouvoir d’achat</small><b>'+(reel>=0?'+':'')+reel.toFixed(1).replace('.',',')+' %</b><p>Vous aurez '+H.F(Math.round(fin))+', qui achèteront autant que '+H.F(pa)+' d’aujourd’hui.'+(reel<0?' Vous avez plus de francs, mais vous pouvez acheter moins.':'')+'</p></div>'; } },
        p: "Je compare mon rendement après frais à la hausse des prix." },
      { t: "Une action protège-t-elle de l’inflation ?", c: "Un placement dont la valeur bouge pose une question de plus : son gain futur n’est pas connu d’avance. On ne peut pas dire qu’une action « protège de l’inflation » simplement parce que l’entreprise peut augmenter ses prix. Encore faut-il qu’elle garde ses clients, maîtrise ses coûts et ne soit pas achetée trop cher.",
        f: ["Quel résultat puis-je espérer après frais ?", "Que vaudrait ce résultat si les prix montaient ?", "Quand aurai-je besoin de récupérer mon argent ?"],
        w: { consignes: 1, quiz: [
          ["Les ventes d’une société cotée montent de 10 % avec l’inflation. Son action est-elle une bonne affaire ?", ["Oui, ses ventes suivent les prix","Je ne sais pas encore : il faut regarder ses coûts, sa marge, ses bénéfices et le prix de l’action"], 1, "Comme pour Aminata, des ventes en hausse peuvent cacher une marge qui baisse. Et une bonne entreprise peut être payée trop cher."]
        ] },
        p: "Je ne confonds pas ventes en hausse et bénéfices en hausse." }
    ]},
    { t: "Trois décisions", acq: "Je sais quoi suivre chaque mois quand les prix montent", desc: "Suivre sa marge, comprendre ses coûts, protéger sa trésorerie. Puis un chiffre à suivre.", e: [
      { t: "Trois décisions pour celui qui entreprend", c: "Aminata cesse de regarder seulement l’argent qui entre dans sa caisse. Augmenter tous ses prix d’un même pourcentage n’est pas toujours la bonne réponse.",
        f: ["Suivre sa marge par produit : chaque mois, le prix de vente et le coût réel des plats les plus vendus. Elle voit lequel rapporte encore et lequel travaille presque à perte.", "Comprendre quels coûts bougent : si l’huile monte, acheter autrement, réduire les pertes, revoir une recette. Si le transport monte, revoir ses tournées.", "Protéger sa trésorerie : un stock plus important peut aider si son prix risque de monter, mais il immobilise de l’argent et peut se perdre. Elle calcule ce qu’elle peut vraiment financer avant de commander."],
        w: { consignes: 1, puces: { id:"in_dec", k:"Ce que je mets en place", m:1, l:["Je note ma marge par produit chaque mois","Je repère mes trois coûts qui bougent le plus","Je calcule le stock que je peux financer","Je compare mes placements à la hausse des prix"] },
          v: function(D){ var n=(D.in_dec||[]).length; return n?'<div class="verdict v-ok">'+n+' habitude'+(n>1?'s':'')+' choisie'+(n>1?'s':'')+'. Elles figurent dans votre fiche.</div>':''; } },
        p: "J’ai choisi ce que je suis chaque mois." },
      { t: "Le chiffre que je dois suivre", c: "Choisissez une dépense importante ou un produit que vous vendez. Notez son prix aujourd’hui et il y a un an. Quand les prix montent, le bon réflexe n’est ni de laisser tout son argent immobile, ni d’investir à tout prix : c’est de distinguer ce qui entre, ce que cela coûte et ce qui reste en pouvoir d’achat.",
        w: { champs: [ {id:"in_obj", l:"La dépense ou le produit", type:"txt", ph:"Sac de riz de 25 kg, mon plat garba…"}, {id:"in_a0", l:"Son prix il y a un an (F)"}, {id:"in_a1", l:"Son prix aujourd’hui (F)"}, {id:"in_phrase", l:"Le chiffre que je dois désormais suivre chaque mois est… parce que…", type:"area"} ],
          v: function(D,H){ var a=H.N(D.in_a0), b=H.N(D.in_a1); var h=''; if(a&&b){ var v=Math.round((b-a)/a*1000)/10; h='<div class="gros"><small>Variation sur un an</small><b>'+(v>=0?'+':'')+String(v).replace('.',',')+' %</b><p>Comparez ce chiffre à vos prix de vente, ou au rendement de votre épargne.</p></div>'; } return h+(D.in_phrase?'<div class="verdict v-ok">Votre décision est écrite dans votre fiche.</div>':''); } },
        p: "Mon chiffre à suivre est écrit." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Le chiffre que je suis chaque mois »", titre: "Vous distinguez ce qui entre, ce que cela coûte et ce qui reste",
    fiche: [
      ["Ma marge par unité", function(D,H){ var p0=H.N(D.in_p0), c0=H.N(D.in_c0), p1=H.N(D.in_p1), c1=H.N(D.in_c1); return p0&&c0&&p1&&c1?H.F(p0-c0)+' → '+H.F(p1-c1):''; }],
      ["Mon gain en pouvoir d’achat", function(D,H){ var r=H.N(D.in_r), i=H.N(D.in_i); return D.in_r&&D.in_i?(((1+r/100)/(1+i/100)-1)*100).toFixed(1).replace('.',',')+' %':''; }],
      ["Mes habitudes", function(D){ return (D.in_dec||[]).join(' · '); }],
      ["Prix suivi", function(D,H){ var a=H.N(D.in_a0), b=H.N(D.in_a1); return D.in_obj?D.in_obj+(a&&b?' : '+H.F(a)+' → '+H.F(b):''):''; }],
      ["Ma décision", function(D){ return D.in_phrase||''; }]
    ],
    suite: { t: "Où est passé l’argent de mon activité ?", p: "Vous suivez votre marge. L’atelier suivant sépare la caisse de l’activité et celle de la maison.", lien: "atelier-ou-est-l-argent-de-mon-activite.html", b: "Ouvrir l’atelier" }
  }
};
