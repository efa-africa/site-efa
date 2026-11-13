/* Atelier guidé · Mon commerce n'a pas de comptabilité (parcours Analyser une entreprise, 4/5) */
function csP(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR')+' %'; }
function csPat(D,H){
  var a=['cs_stk','cs_cai','cs_mm','cs_cre','cs_mat'].reduce(function(s,k){return s+H.N(D[k]);},0);
  var d=['cs_fou','cs_imf','cs_pro','cs_ton'].reduce(function(s,k){return s+H.N(D[k]);},0);
  return {a:a, d:d, n:a-d};
}
window.ATELIER = {
  id: "commerce-sans-comptabilite",
  titre: "Mon commerce n’a pas de comptabilité",
  h1: "Pas de comptable ? Vos chiffres existent quand même.",
  voix: "auto",
  question: {
    t: "Mariam tient un maquis depuis 5 ans, sans aucun cahier. Elle veut savoir si elle gagne de l’argent. Par où commencer ?",
    r: [
      ["a", "Elle doit d’abord payer un comptable.", "Un comptable aide, mais Mariam peut déjà beaucoup avec ce qu’elle a : ses relevés mobile money, ses achats, son stock compté un soir. Vous allez voir comment.", false],
      ["b", "Elle peut reconstituer ses chiffres avec ce qu’elle a déjà.", "Exactement. Ventes, stock, dettes, bénéfice : tout se reconstruit, par recoupement. Vous allez le faire pour votre activité.", true]
    ]
  },
  chapitres: [
    { t: "Séparer la maison et l’activité", acq: "Je sépare l’argent de l’activité de celui de la maison", desc: "La règle qui rend tout le reste possible.", e: [
      { t: "La première règle", f: ["Tant que la caisse de l’activité paie aussi le marché, l’école et les funérailles, personne ne peut dire si l’activité gagne.", "Un compte ou un numéro mobile money réservé à l’activité suffit pour commencer.", "Vous vous versez un montant fixe par semaine ou par mois, comme un salaire : le reste appartient à l’activité."], c: "Sans cette séparation, les meilleurs calculs restent faux. Avec elle, les chiffres se mettent à parler en quelques semaines.",
        w: { consignes: 1, puces: { id:"cs_sep", k:"Aujourd’hui, l’argent de mon activité…", l:["Est séparé","Est en partie séparé","Est mélangé avec la maison"] },
          v: function(D){ return D.cs_sep==='Est mélangé avec la maison'?'<div class="verdict v-mid">C’est le cas le plus courant. Les chiffres de cet atelier seront des estimations : notez-le, et commencez la séparation dès ce mois-ci.</div>':D.cs_sep?'<div class="verdict v-ok">Bonne base : vos relevés de compte et de mobile money vont servir de preuve.</div>':''; } },
        p: "J’ai fait le point sur la séparation." }
    ]},
    { t: "Retrouver mes ventes", acq: "J’estime mes ventes par deux chemins", desc: "Le recoupement, plutôt que la mémoire.", e: [
      { t: "Trois sources", f: ["Ce qui entre : relevés mobile money et bancaires, plus les ventes en espèces d’une semaine type notées sur un cahier.", "Ce qui est acheté : les achats de marchandises sont plus faciles à retrouver (factures, reçus, relevés du grossiste).", "La marge habituelle : sur un produit, vous savez souvent à combien vous l’achetez et à combien vous le revendez."], c: "On ne cherche pas le chiffre exact, mais deux estimations qui se confirment. Si elles s’écartent beaucoup, l’une des deux est fausse.",
        p: "Je connais les trois sources." },
      { t: "Mes deux estimations", c: "Estimez vos ventes mensuelles par vos encaissements, puis par vos achats et votre marge habituelle.",
        w: { ex: "Mariam (fictif) : mobile money 900 000 F par mois, espèces d’une semaine type 150 000 F (soit 650 000 F par mois). Achats 1 100 000 F par mois ; elle revend en moyenne 40 % au-dessus du prix d’achat, soit 1 540 000 F. Les deux chemins donnent 1,55 et 1,54 million : ils se confirment.", k: "Vos chiffres d’un mois · ils restent sur votre téléphone, EFA ne les garde pas.", champs: [ {id:"cs_mmv", l:"Encaissements mobile money et banque du mois (F)", ph:"900 000"}, {id:"cs_esp", l:"Ventes en espèces d’une semaine type (F)", ph:"150 000"}, {id:"cs_ach", l:"Achats de marchandises du mois (F)", ph:"1 100 000"}, {id:"cs_mg", l:"Vous revendez en moyenne … % au-dessus du prix d’achat", ph:"40"} ],
          v: function(D,H){ var e1=H.N(D.cs_mmv)+H.N(D.cs_esp)*52/12, e2=H.N(D.cs_ach)*(1+H.N(D.cs_mg)/100); if(!D.cs_mmv||!D.cs_ach) return ''; var ec=Math.abs(e1-e2)/Math.max(e1,e2)*100;
            var h='<div class="gros"><small>Vos ventes du mois, estimées</small><b>'+H.F((e1+e2)/2)+'</b><p>Par les encaissements : '+H.F(e1)+' · par les achats et la marge : '+H.F(e2)+' · écart : '+csP(ec)+'.</p></div>';
            return h+(ec>20?'<div class="verdict v-ko">Plus de 20 % d’écart. Pistes : des ventes à crédit pas encore payées, du stock qui s’accumule, des achats payés pour la maison, ou une marge plus faible que vous ne pensez (pertes, cadeaux, casse).</div>':ec>10?'<div class="verdict v-mid">Écart moyen : vos estimations se tiennent, mais une source mérite d’être vérifiée sur un mois de plus.</div>':'<div class="verdict v-ok">Vos deux chemins se confirment. Vous tenez une estimation crédible de vos ventes.</div>'); } },
        p: "J’ai recoupé mes ventes." }
    ]},
    { t: "Ce que j’ai, ce que je dois", acq: "Je connais la valeur nette de mon activité", desc: "Le patrimoine de l’activité, dettes cachées comprises.", e: [
      { t: "Mon inventaire d’un soir", c: "Comptez une fois, un soir de fermeture : stock au prix d’achat, caisse, mobile money, clients qui vous doivent, matériel. Puis listez tout ce que vous devez, y compris les dettes qu’on oublie : un proche qui a avancé de l’argent, un tour de tontine déjà reçu mais pas encore remboursé par vos cotisations.",
        w: { ex: "Mariam (fictif) : stock 600 000 F, caisse 80 000 F, mobile money 120 000 F, clients 50 000 F, matériel 900 000 F. Dettes : grossiste 250 000 F, microfinance 400 000 F, un frère 150 000 F, tontine (tour reçu, 4 cotisations restantes de 50 000 F) 200 000 F.", k: "Ce que possède l’activité", champs: [ {id:"cs_stk", l:"Stock, au prix d’achat (F)", ph:"600 000"}, {id:"cs_cai", l:"Caisse (F)", ph:"80 000"}, {id:"cs_mm", l:"Mobile money et banque (F)", ph:"120 000"}, {id:"cs_cre", l:"Clients qui vous doivent (F)", ph:"50 000"}, {id:"cs_mat", l:"Matériel, au prix où vous pourriez le revendre (F)", ph:"900 000"} ] },
        p: "J’ai fait mon inventaire." },
      { t: "Ce que je dois", c: "Une dette oubliée fausse tout : c’est l’erreur la plus fréquente quand on reconstitue des comptes.",
        w: { k: "Ce que doit l’activité", champs: [ {id:"cs_fou", l:"Fournisseurs (F)", ph:"250 000"}, {id:"cs_imf", l:"Microfinance et banque, restant dû (F)", ph:"400 000"}, {id:"cs_pro", l:"Proches qui ont avancé de l’argent (F)", ph:"150 000"}, {id:"cs_ton", l:"Tontine : cotisations restant à payer après un tour reçu (F)", ph:"200 000"} ],
          v: function(D,H){ var P=csPat(D,H); if(!P.a) return '';
            var h='<div class="gros"><small>Valeur nette de votre activité</small><b>'+H.F(P.n)+'</b><p>Ce qu’elle possède '+H.F(P.a)+' − ce qu’elle doit '+H.F(P.d)+'.</p></div>';
            return h+(P.n<0?'<div class="verdict v-ko">L’activité doit plus qu’elle ne possède. Elle tient grâce aux crédits et aux avances : c’est le signal qu’il faut regarder ses marges de près.</div>':'<div class="verdict v-ok">Votre activité vaut '+H.F(P.n)+' net. Refaites cet inventaire dans 6 mois, au même moment : la différence vous dira ce qu’elle a vraiment gagné.</div>'); } },
        p: "J’ai listé mes dettes." }
    ]},
    { t: "Mon vrai bénéfice", acq: "J’estime mon bénéfice et je le vérifie", desc: "Le calcul du mois, et la preuve par l’inventaire.", e: [
      { t: "Le bénéfice d’un mois", c: "Ventes estimées, moins le coût de ce qui est vendu, moins les charges (loyer, électricité, gaz, salaires, transport, taxes). Ce que vous prenez pour la maison n’est pas une charge : c’est ce que vous prélevez sur le bénéfice.",
        w: { ex: "Mariam (fictif) : ventes 1 545 000 F ; coût de ce qui est vendu environ 1 100 000 F ; charges 260 000 F. Bénéfice : environ 180 000 F. Elle prélève 200 000 F par mois pour la maison : elle prend plus que ce que le maquis gagne.", k: "Votre mois", champs: [ {id:"cs_chg", l:"Charges du mois, hors marchandises (F)", ph:"260 000"}, {id:"cs_prel", l:"Ce que vous prenez pour la maison chaque mois (F)", ph:"200 000"} ],
          v: function(D,H){ var e1=H.N(D.cs_mmv)+H.N(D.cs_esp)*52/12, e2=H.N(D.cs_ach)*(1+H.N(D.cs_mg)/100); if(!D.cs_ach||!D.cs_chg) return ''; var v=(e1+e2)/2, cout=v/(1+H.N(D.cs_mg)/100), b=v-cout-H.N(D.cs_chg), pr=H.N(D.cs_prel);
            var h='<div class="gros"><small>Bénéfice estimé du mois</small><b>'+H.F(b)+'</b><p>Ventes '+H.F(v)+' − coût de ce qui est vendu '+H.F(cout)+' − charges '+H.F(H.N(D.cs_chg))+(pr?' · prélèvement maison : '+H.F(pr):'')+'.</p></div>';
            return h+(b<0?'<div class="verdict v-ko">L’activité perd de l’argent chaque mois. Les prix, la marge ou une charge sont à revoir en priorité.</div>':pr>b?'<div class="verdict v-mid">Vous prélevez plus que l’activité ne gagne : '+H.F(pr-b)+' par mois sortent du stock, de la caisse ou des dettes. C’est souvent ainsi qu’une activité qui marche finit par s’essouffler.</div>':'<div class="verdict v-ok">L’activité gagne plus que ce que vous prélevez : la différence peut renforcer le stock, rembourser, ou constituer une réserve.</div>'); } },
        p: "J’ai estimé mon bénéfice." },
      { t: "La preuve par l’inventaire", c: "Le test le plus fiable : comparez deux inventaires à quelques mois d’écart. Si la valeur nette a monté, l’activité a gagné au moins cette différence, en plus de ce que vous avez prélevé.",
        w: { quiz: [ ["Votre valeur nette a baissé en 6 mois alors que vous pensiez gagner", ["Les inventaires sont faux","Vous prélevez plus que vous ne gagnez, ou la marge est plus faible"], 1, "Un écart entre bénéfice supposé et inventaire révèle presque toujours un prélèvement sous-estimé ou une marge surestimée."], ["Votre stock a beaucoup monté, la caisse a baissé", ["L’activité perd de l’argent","L’argent a pu passer de la caisse au stock"], 1, "Ce n’est pas forcément une perte : regardez si ce stock se vend."], ["Un proche vous a avancé de l’argent, vous ne l’avez pas noté", ["Ça ne change rien","Votre valeur nette est surestimée"], 1, "Toute dette oubliée gonfle la valeur nette. Le financeur, lui, la découvrira."] ] },
        p: "Je sais vérifier mon bénéfice." }
    ]},
    { t: "Mes habitudes", acq: "Je tiens mes chiffres en dix minutes par jour", desc: "Le minimum qui suffit.", e: [
      { t: "Le minimum, chaque jour", f: ["Le soir : les ventes en espèces du jour, sur une ligne.", "À chaque achat : garder le reçu, ou noter montant et fournisseur.", "Une fois par mois : relevé mobile money, inventaire rapide des articles chers, et votre prélèvement."], c: "Dix minutes par jour suffisent pour savoir, chaque mois, ce que l’activité gagne. C’est aussi ce qui rend un dossier de crédit possible.",
        w: { consignes: 1, champs: [ {id:"cs_hab", l:"À partir de demain, je note chaque soir…", type:"area", ph:"Mes ventes en espèces…"} ] },
        p: "Mon habitude est choisie." }
    ]}
  ],
  fin: {
    k: "Ma fiche « mes chiffres sans comptable »", titre: "Vous avez reconstitué les chiffres de votre activité",
    fiche: [
      ["Ventes du mois, estimées", function(D,H){ if(!D.cs_mmv||!D.cs_ach) return ''; var e1=H.N(D.cs_mmv)+H.N(D.cs_esp)*52/12, e2=H.N(D.cs_ach)*(1+H.N(D.cs_mg)/100); return H.F((e1+e2)/2); }],
      ["Valeur nette de l’activité", function(D,H){ var P=csPat(D,H); return P.a?H.F(P.n):''; }],
      ["Bénéfice estimé du mois", function(D,H){ if(!D.cs_ach||!D.cs_chg) return ''; var e1=H.N(D.cs_mmv)+H.N(D.cs_esp)*52/12, e2=H.N(D.cs_ach)*(1+H.N(D.cs_mg)/100), v=(e1+e2)/2; return H.F(v-v/(1+H.N(D.cs_mg)/100)-H.N(D.cs_chg)); }],
      ["Prélèvement pour la maison", function(D,H){ return H.N(D.cs_prel)?H.F(H.N(D.cs_prel))+' par mois':''; }],
      ["Mon habitude", function(D){ return D.cs_hab||''; }]
    ],
    suite: { t: "Avant de confier son argent ou d’investir", p: "Vous savez lire les chiffres de votre activité. Le dernier atelier applique la même méthode à une microfinance, à une banque et à un projet d’investissement.", lien: "atelier-avant-de-confier-ou-d-investir.html", b: "Atelier suivant" }
  }
};
