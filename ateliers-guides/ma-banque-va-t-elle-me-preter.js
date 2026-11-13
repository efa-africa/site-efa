/* Atelier guidé · Ma banque va-t-elle me prêter ? (parcours Analyser une entreprise, 3/5) */
function mbP(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR')+' %'; }
function mbX(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR'); }
function mbMens(D,H){ var c=H.N(D.mb_mt), t=H.N(D.mb_tx)/1200, n=H.N(D.mb_dur); if(!c||!n) return 0; return t?c*t/(1-Math.pow(1+t,-n)):c/n; }
function mbScore(D){
  var R={"mb_q1":{"Plus de 3 ans":20,"De 1 à 3 ans":12,"Moins d’un an":4},"mb_q2":{"Oui, chaque mois":20,"Un cahier, pas toujours à jour":10,"Non":0},"mb_q3":{"Sur un compte à part":15,"Mélangé avec la maison":3},"mb_q4":{"Jamais":15,"Une ou deux fois":7,"Souvent":0},"mb_q5":{"Plus de 20 %":15,"De 10 à 20 %":9,"Moins de 10 %":2},"mb_q6":{"Oui, plus que le crédit":15,"En partie":8,"Non":0}};
  var s=0,n=0; for(var k in R){ if(D[k]){ s+=R[k][D[k]]||0; n++; } } return {s:s,n:n};
}
window.ATELIER = {
  id: "ma-banque-va-t-elle-me-preter",
  titre: "Ma banque va-t-elle me prêter ?",
  h1: "Avant de demander un crédit, lisez votre dossier comme un banquier.",
  voix: "auto",
  question: {
    t: "Koffi demande 3 millions pour agrandir son atelier de couture. Sur quoi le banquier va-t-il d’abord se décider ?",
    r: [
      ["a", "Sur la beauté du projet et l’envie de Koffi.", "Le projet compte, mais il ne rembourse pas. Le banquier regarde d’abord ce que l’activité produit déjà, ce qu’elle doit, et ce qui se passe si tout ne va pas comme prévu.", false],
      ["b", "Sur la capacité de l’atelier à rembourser, même un mauvais mois.", "Exactement. Vous allez calculer ce que regarde un financeur : vos ratios, votre mensualité, votre marge de sécurité, et votre note.", true]
    ]
  },
  chapitres: [
    { t: "Le regard du financeur", acq: "Je connais les questions d’un banquier", desc: "Cinq questions avant tout chiffre.", e: [
      { t: "Cinq questions", f: ["L’activité existe-t-elle vraiment, depuis quand, et que vend-elle ?", "Gagne-t-elle de l’argent, et produit-elle de quoi rembourser ?", "Que doit-elle déjà, et à qui ?", "Que se passe-t-il si les ventes baissent ?", "Que met le porteur de projet lui-même, et quelle garantie existe ?"], c: "Un banquier ne prête pas sur un rêve, ni même sur un bénéfice : il prête sur une capacité à rembourser qu’il peut vérifier.",
        p: "Je connais les cinq questions." },
      { t: "Ce qu’il vérifie", c: "Pour chaque affirmation, le financeur cherche une preuve.",
        w: { quiz: [ ["« Je vends 2 millions par mois »", ["Il me croit sur parole","Il demande relevés et cahier de ventes"], 1, "Relevés bancaires et mobile money, factures, cahier de caisse : ce qui se vérifie compte, le reste non."], ["« Je n’ai pas d’autres dettes »", ["Il me croit sur parole","Il consulte les fichiers de crédit"], 1, "Les crédits auprès des banques et des microfinances sont déclarés. Une dette oubliée détruit la confiance."], ["« Mon projet va doubler mes ventes »", ["C’est la base de la décision","C’est un bonus, pas la base"], 1, "Le financeur décide d’abord sur ce qui existe. La croissance promise est un plus, s’il la juge réaliste."] ] },
        p: "Je sais ce qui sera vérifié." }
    ]},
    { t: "Mes ratios", acq: "Je calcule les ratios qu’un banquier regarde", desc: "Ce que vous avez mis, ce que vous devez, en combien d’années.", e: [
      { t: "Trois chiffres décisifs", c: "Mettez les chiffres de votre dernier bilan. Les repères donnés sont des ordres de grandeur courants, pas des règles : chaque banque a les siennes.",
        w: { ex: "L’atelier de Koffi (fictif) : total de ce que possède l’activité 6 000 000 F, dont 2 100 000 F apportés ou laissés par Koffi ; crédits en cours 1 800 000 F ; argent produit par l’activité 1 200 000 F par an.", k: "Vos chiffres · ils restent sur votre téléphone, EFA ne les garde pas. Vous pouvez mettre des chiffres fictifs, proches de votre réalité.", champs: [ {id:"mb_tot", l:"Total de ce que possède l’activité (F)", ph:"6 000 000"}, {id:"mb_cp", l:"Ce que vous y avez mis + bénéfices laissés (F)", ph:"2 100 000"}, {id:"mb_df", l:"Crédits en cours, restant dû (F)", ph:"1 800 000"}, {id:"mb_caf", l:"Argent produit par l’activité par an (F)", ph:"1 200 000"} ],
          v: function(D,H){ var t=H.N(D.mb_tot), cp=H.N(D.mb_cp), df=H.N(D.mb_df), caf=H.N(D.mb_caf); if(!t||!D.mb_cp) return '';
            var a=cp/t*100, e=cp?df/cp:0, y=caf?df/caf:0, M=[], ko=0;
            var h='<div class="gros"><small>Vos trois ratios</small><b>'+mbP(a)+'</b><p>Part de l’activité financée par vous : '+mbP(a)+' · crédits ÷ votre part : '+mbX(e)+' fois'+(caf?' · années pour rembourser avec l’argent produit : '+mbX(y)+' ans':'')+'.</p></div>';
            if(a<20){M.push('Moins de 20 % financés par vous : le banquier se demande ce que vous risquez vous-même.');ko++;}
            if(e>1.5){M.push('Vos crédits dépassent nettement votre propre part : un nouveau crédit sera difficile sans apport.');ko++;}
            if(caf&&y>4){M.push('Plus de 4 ans pour rembourser vos crédits actuels avec l’argent produit : l’activité est déjà chargée.');ko++;}
            return h+(M.length?'<div class="verdict '+(ko>1?'v-ko':'v-mid')+'">'+M.join(' ')+'</div>':'<div class="verdict v-ok">Vos trois ratios sont dans des zones que les financeurs considèrent généralement comme saines. Reste la question de la mensualité.</div>'); } },
        p: "J’ai calculé mes trois ratios." }
    ]},
    { t: "Ma mensualité", acq: "Je sais si je peux payer la mensualité, même un mauvais mois", desc: "Le crédit demandé, sa mensualité, la marge de sécurité.", e: [
      { t: "Combien je paierai chaque mois", c: "Demandez toujours le taux, la durée et tous les frais (dossier, assurance). Le calcul ci-dessous donne la mensualité hors frais : le coût réel est plus élevé.",
        w: { ex: "Koffi (fictif) : 3 000 000 F à 14 % par an sur 24 mois. Mensualité : environ 144 000 F, soit 3 460 000 F remboursés au total.", k: "Le crédit envisagé", champs: [ {id:"mb_mt", l:"Montant demandé (F)", ph:"3 000 000"}, {id:"mb_tx", l:"Taux annuel (%)", ph:"14"}, {id:"mb_dur", l:"Durée (mois)", ph:"24"} ],
          v: function(D,H){ var m=mbMens(D,H); if(!m) return ''; var n=H.N(D.mb_dur), c=H.N(D.mb_mt);
            return '<div class="gros"><small>Mensualité, hors frais et assurance</small><b>'+H.F(m)+'</b><p>Total remboursé : '+H.F(m*n)+', dont '+H.F(m*n-c)+' d’intérêts.</p></div>'; } },
        p: "J’ai calculé ma mensualité." },
      { t: "Le test du mauvais mois", c: "Un financeur prudent vérifie que l’activité paie la mensualité même si les ventes baissent. Mettez l’argent que l’activité dégage un mois normal, avant remboursements, et ce que vous remboursez déjà.",
        w: { ex: "Koffi (fictif) : il dégage 260 000 F un mois normal et rembourse déjà 50 000 F. Avec 144 000 F en plus, il couvre ses échéances 1,3 fois ; un mois à −20 %, il reste juste au-dessus.", k: "Un mois normal", champs: [ {id:"mb_dispo", l:"Argent dégagé par l’activité un mois normal, avant remboursements (F)", ph:"260 000"}, {id:"mb_deja", l:"Mensualités que vous payez déjà (F)", ph:"50 000"}, {id:"mb_choc", l:"Baisse des ventes à tester (%)", ph:"20"} ],
          v: function(D,H){ var m=mbMens(D,H), d=H.N(D.mb_dispo), ex=H.N(D.mb_deja), ch=H.N(D.mb_choc)/100; if(!m||!d) return ''; var tot=m+ex, cv=d/tot, cv2=d*(1-ch)/tot;
            var h='<div class="gros"><small>Couverture de vos échéances</small><b>'+mbX(cv)+' fois</b><p>Échéances totales : '+H.F(tot)+' par mois. '+(ch?'Avec des ventes à −'+Math.round(ch*100)+' % : '+mbX(cv2)+' fois (estimation simple, qui suppose que l’argent dégagé baisse comme les ventes).':'')+'</p></div>';
            return h+(cv<1?'<div class="verdict v-ko">L’activité ne dégage pas de quoi payer toutes les échéances. Réduisez le montant, allongez la durée, ou attendez que l’activité produise plus.</div>':(cv<1.25||(ch&&cv2<1))?'<div class="verdict v-mid">Vous payez, mais sans marge : un mois difficile, et l’échéance se paie avec l’argent de la maison ou du stock. Beaucoup de financeurs demandent au moins 1,25 fois.</div>':'<div class="verdict v-ok">Vous couvrez vos échéances avec une marge, même dans le scénario difficile testé. C’est l’argument le plus fort de votre dossier.</div>'); } },
        p: "J’ai fait le test du mauvais mois." }
    ]},
    { t: "Ma note", acq: "Je connais mes points forts et mes points faibles", desc: "Une grille simple, comme celle d’un comité de crédit.", e: [
      { t: "Ma grille", c: "Les financeurs notent les dossiers sur une grille. Celle-ci est simplifiée et pédagogique : elle ne remplace pas la décision d’une banque, mais elle montre ce qui pèse.",
        w: { puces: [ { id:"mb_q1", k:"Mon activité existe depuis…", l:["Plus de 3 ans","De 1 à 3 ans","Moins d’un an"] }, { id:"mb_q2", k:"Je tiens mes comptes…", l:["Oui, chaque mois","Un cahier, pas toujours à jour","Non"] }, { id:"mb_q3", k:"L’argent de l’activité est…", l:["Sur un compte à part","Mélangé avec la maison"] }, { id:"mb_q4", k:"J’ai déjà payé une échéance en retard…", l:["Jamais","Une ou deux fois","Souvent"] }, { id:"mb_q5", k:"Mon apport dans le projet représente…", l:["Plus de 20 %","De 10 à 20 %","Moins de 10 %"] }, { id:"mb_q6", k:"J’ai une garantie (bien, caution, dépôt)…", l:["Oui, plus que le crédit","En partie","Non"] } ],
          v: function(D){ var S=mbScore(D); if(S.n<6) return S.n?'<p class="w-k">Encore '+(6-S.n)+' question'+(6-S.n>1?'s':'')+'.</p>':'';
            var c=S.s>=75?['v-ok','Dossier solide : vos points forts parlent pour vous. Préparez les preuves de chacun.']:S.s>=50?['v-mid','Dossier possible, avec des points à renforcer. Commencez par celui qui vous a coûté le plus de points.']:['v-ko','Dossier fragile aujourd’hui. Mieux vaut travailler 6 mois sur les comptes et l’apport que d’essuyer un refus.'];
            return '<div class="gros"><small>Votre note pédagogique</small><b>'+S.s+' / 100</b></div><div class="verdict '+c[0]+'">'+c[1]+'</div>'; } },
        p: "J’ai rempli ma grille." }
    ]},
    { t: "Mon dossier", acq: "Mon dossier tient en une page", desc: "Les pièces, et trois phrases qui convainquent.", e: [
      { t: "Les pièces à préparer", f: ["Ce qui prouve l’activité : pièce d’identité, registre de commerce s’il existe, photos, contrats, factures.", "Ce qui prouve les chiffres : 6 à 12 mois de relevés bancaires et mobile money, cahier de ventes, derniers comptes.", "Ce qui décrit le projet : devis du matériel, plan de trésorerie, montant de votre apport."], c: "Un dossier complet dès le premier rendez-vous fait gagner des semaines, et montre que vous savez gérer.",
        w: { consignes: 1, puces: { id:"mb_pieces", k:"Mes pièces sont…", l:["Toutes prêtes","En partie prêtes","À rassembler"] } },
        p: "J’ai fait le point sur mes pièces." },
      { t: "Trois phrases", c: "Un banquier lit d’abord la conclusion. Écrivez trois phrases : ce que vous demandez et pourquoi ; comment vous remboursez ; ce qui se passe si ça va moins bien.",
        w: { ex: "Koffi (fictif) : « Je demande 3 millions sur 24 mois pour deux machines, qui doublent ma capacité de production. Mon atelier dégage 260 000 F par mois, soit 1,3 fois mes échéances. Si mes ventes baissent de 20 %, je couvre encore mes échéances, et mon apport de 600 000 F reste dans le projet. »", champs: [ {id:"mb_resume", l:"Mes trois phrases", type:"area", ph:"Je demande…"} ] },
        p: "Mes trois phrases sont écrites." }
    ]}
  ],
  fin: {
    k: "Ma fiche « dossier de crédit »", titre: "Vous voyez votre dossier comme un financeur",
    fiche: [
      ["Part financée par moi", function(D,H){ var t=H.N(D.mb_tot); return t&&D.mb_cp?mbP(H.N(D.mb_cp)/t*100):''; }],
      ["Crédit envisagé", function(D,H){ var m=mbMens(D,H); return m?H.F(H.N(D.mb_mt))+' · '+H.N(D.mb_dur)+' mois · mensualité '+H.F(m):''; }],
      ["Couverture des échéances", function(D,H){ var m=mbMens(D,H), d=H.N(D.mb_dispo); return m&&d?mbX(d/(m+H.N(D.mb_deja)))+' fois':''; }],
      ["Ma note pédagogique", function(D){ var S=mbScore(D); return S.n===6?S.s+' / 100':''; }],
      ["Mes pièces", function(D){ return D.mb_pieces||''; }],
      ["Mes trois phrases", function(D){ return D.mb_resume||''; }]
    ],
    suite: { t: "Mon commerce n’a pas de comptabilité", p: "Pas de comptes, pas de dossier ? Le prochain atelier vous apprend à reconstituer les chiffres de votre activité à partir de ce que vous avez déjà.", lien: "atelier-commerce-sans-comptabilite.html", b: "Atelier suivant" }
  }
};
