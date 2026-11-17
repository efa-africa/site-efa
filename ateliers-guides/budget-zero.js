/* Atelier guidé · Mon budget à zéro (17 nov. 2026)
   Méthode du budget à base zéro adaptée à nos réalités (FCFA, tontine, aide aux proches, mobile money).
   Repères EFA indicatifs. L'atelier mène à l'outil outil-budget.html, qui génère le PDF d'orientations. */
window.ATELIER = {
  id: "budget-zero",
  titre: "Mon budget à zéro : une mission pour chaque franc",
  h1: "Avant le début du mois, chaque franc reçoit un travail.",
  voix: "auto",
  question: {
    t: "Le 20 du mois, il ne vous reste presque rien. Que s’est-il passé ?",
    r: [
      ["a", "Je n’ai pas assez gagné.", "C’est parfois vrai. Mais souvent, l’argent part sans décision : les francs sans mission disparaissent en petits achats. On commence par leur en donner une.", false],
      ["b", "L’argent est parti sans que je décide où.", "C’est le cas le plus fréquent. Le budget à zéro répond exactement à cela : décider avant, plutôt que constater après.", true]
    ]
  },
  chapitres: [
    { t: "Le principe", acq: "Je sais ce qu’est un budget à zéro et je lis la différence", desc: "Ce qui entre moins ce qui est prévu égale zéro. Rouge, zéro ou vert.", e: [
      { t: "Chaque franc reçoit une mission", c: "Un budget à zéro ne veut pas dire qu’il ne reste rien sur votre compte. Il veut dire qu’avant le début du mois, chaque franc qui entre a reçu un travail : une dépense, une épargne, un remboursement, une aide. Ce qui entre moins ce qui est prévu = zéro.",
        f: ["Partez de ce que vous recevez vraiment : le salaire net, pas le brut, plus vos autres rentrées.", "Payez-vous d’abord : la réserve et l’épargne passent avant les dépenses, pas après.", "Puis les essentiels, les engagements (dettes, tontine), la famille, la vie courante.", "Votre premier outil pour construire est votre revenu : un budget vous dit ce qu’il peut faire."],
        w: { consignes: 1, quiz: [
          ["Budget à zéro : il ne doit rien rester sur mon compte à la fin du mois ?", ["Oui, je dois tout dépenser","Non : chaque franc a une mission, y compris l’épargne"], 1, "L’épargne et la réserve sont des missions. Un budget à zéro peut très bien faire grossir votre compte."]
        ] },
        p: "Je sais que chaque franc doit recevoir une mission." },
      { t: "La différence : rouge, zéro ou vert", c: "Une fois tout inscrit, regardez la différence entre ce qui entre et ce qui est prévu. Rouge : vous prévoyez plus que ce qui entre. Zéro : chaque franc a une mission. Vert : des francs attendent encore une mission, et sans décision, ils disparaîtront.",
        w: { k: "Votre mois, en gros", c3: 1, champs: [ {id:"bz_in", l:"Ce qui entre (F)"}, {id:"bz_out", l:"Ce que vous prévoyez de dépenser, épargner et rembourser (F)"} ],
          v: function(D,H){ var i=H.N(D.bz_in), o=H.N(D.bz_out); if(!i) return ''; var d=i-o; return d<0?'<div class="verdict v-ko">Rouge : '+H.F(-d)+' de plus que ce qui entre. Réduisez d’abord la vie courante, puis revoyez les engagements.</div>':d>0?'<div class="verdict v-ok">Vert : '+H.F(d)+' attendent une mission. Donnez-la avant le début du mois : réserve, dette chère, projet.</div>':'<div class="verdict v-ok">Zéro : chaque franc a une mission. Reste à le tenir.</div>'; } },
        p: "Je sais lire ma différence et quoi faire dans chaque cas." }
    ]},
    { t: "Les repères", acq: "Je compare mes postes à des repères, sans en faire des règles", desc: "Quatre priorités quand l’argent manque. Des repères pour le logement, les dettes, l’épargne.", e: [
      { t: "Quand l’argent manque : protéger quatre choses", c: "Certains mois, tout ne passera pas. Avant les dettes, avant les envies, protégez ce qui vous permet de vivre et de continuer à gagner votre vie.",
        f: ["Manger.", "Se loger, avec l’eau et l’électricité.", "Se déplacer pour travailler.", "Se soigner.", "Ensuite seulement : les dettes, en prévenant vos créanciers avant le retard, puis le reste."],
        w: { consignes: 1, quiz: [
          ["Ce mois-ci, il manque 40 000 F. Votre transport pour aller travailler ou une mensualité de téléphone à crédit : que protégez-vous d’abord ?", ["La mensualité, pour ne pas être en retard","Le transport, qui vous permet de gagner votre vie ; vous prévenez le créancier"], 1, "Sans transport, c’est le revenu lui-même qui est menacé. Un créancier prévenu à temps accepte plus souvent un report."]
        ] },
        p: "Je sais quoi protéger d’abord quand l’argent manque." },
      { t: "Les repères EFA", c: "Des repères aident à voir ce qui déborde. Ce sont des points de comparaison, pas des règles : un loyer à 30 % peut se justifier si vous n’avez pas de transport. Mais si plusieurs repères sont dépassés, il est temps d’agir.",
        f: ["Moi d’abord (épargne, réserve) : au moins 10 % de ce qui entre.", "Logement : 25 % ou moins.", "Transport : 15 % ou moins.", "Dettes : moins d’un tiers de ce qui entre.", "Aide aux proches : une enveloppe fixe décidée en début de mois, souvent 10 à 15 %.", "Loisirs et divers : 10 % ou moins."],
        w: { consignes: 1, k: "Vos deux postes les plus lourds", c3: 1, champs: [ {id:"bz_rev", l:"Ce qui entre (F)"}, {id:"bz_log", l:"Logement (F)"}, {id:"bz_det", l:"Dettes (F)"} ],
          v: function(D,H){ var r=H.N(D.bz_rev); if(!r) return ''; var l=Math.round(H.N(D.bz_log)/r*100), d=Math.round(H.N(D.bz_det)/r*100); return '<div class="gros"><small>Logement · dettes</small><b>'+l+' % · '+d+' %</b><p>'+(l>30?'Le logement dépasse nettement le repère. ':'')+(d>=33?'Les dettes dépassent un tiers : pas de nouveau crédit. ':'')+(l<=30&&d<33?'Vos deux postes les plus lourds restent dans les repères.':'')+'</p></div>'; } },
        p: "Je connais les repères et où je me situe." }
    ]},
    { t: "Construire mon budget", acq: "J’ai construit mon budget à zéro et téléchargé mes orientations", desc: "Les francs sans mission, la réserve cible, puis l’outil et le PDF.", e: [
      { t: "Que faire des francs sans mission ?", c: "Quand la différence est verte, ne laissez pas l’argent dormir sans but. Un ordre simple : d’abord la réserve pour les imprévus, jusqu’à trois mois de dépenses essentielles ; puis rembourser plus vite la dette la plus chère ; puis un projet daté ou un investissement.",
        w: { k: "Votre réserve cible", c3: 1, champs: [ {id:"bz_ess", l:"Vos dépenses essentielles par mois (F)"}, {id:"bz_vers", l:"Ce que vous pouvez verser par mois à la réserve (F)"} ],
          puces: { id:"bz_ordre", k:"Mes francs sans mission iront d’abord à…", l:["Ma réserve","Ma dette la plus chère","Un projet daté"] },
          v: function(D,H){ var e=H.N(D.bz_ess), v=H.N(D.bz_vers); if(!e) return ''; var c=e*3; return '<div class="gros"><small>Réserve cible : trois mois d’essentiels</small><b>'+H.F(c)+'</b><p>'+(v?'À '+H.F(v)+' par mois, environ '+Math.ceil(c/v)+' mois pour l’atteindre.':'Indiquez ce que vous pouvez verser chaque mois.')+'</p></div>'; } },
        p: "Je sais où vont mes francs sans mission." },
      { t: "Construisez votre budget avec l’outil EFA", c: "L’outil « Mon budget à zéro » reprend tout ce que vous venez de voir : ce qui entre, cinq familles de dépenses (moi d’abord, essentiels, engagements, famille, vie courante), la différence en direct, les repères et des orientations personnalisées. À la fin, vous téléchargez votre budget et vos orientations en PDF, sur deux pages.",
        f: ["Ouvrez l’outil avec le bouton à la fin de cet atelier.", "Entrez vos chiffres du mois. Une ligne inconnue ? Estimez-la, vous la corrigerez.", "Ramenez la différence à zéro.", "Téléchargez votre PDF et gardez-le : vous le comparerez au réel en fin de mois."],
        w: { consignes: 1, puces: { id:"bz_pret", k:"Je suis prêt à construire mon budget", l:["Oui, j’ouvre l’outil","Je le ferai en fin de mois, avec mes relevés"] },
          v: function(D){ return D.bz_pret?'<div class="verdict v-ok">L’outil vous attend à la fin de l’atelier : « Ouvrir l’outil ».</div>':''; } },
        p: "Je sais comment construire mon budget et obtenir mon PDF." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Mon budget à zéro »", titre: "Avant le début du mois, chaque franc a un travail",
    fiche: [
      ["Ma différence", function(D,H){ var i=H.N(D.bz_in), o=H.N(D.bz_out); return i?H.F(i-o):''; }],
      ["Logement et dettes", function(D,H){ var r=H.N(D.bz_rev); return r?Math.round(H.N(D.bz_log)/r*100)+' % et '+Math.round(H.N(D.bz_det)/r*100)+' %':''; }],
      ["Ma réserve cible", function(D,H){ var e=H.N(D.bz_ess); return e?H.F(e*3):''; }],
      ["Mes francs sans mission vont à", function(D){ return D.bz_ordre||''; }]
    ],
    suite: { t: "L’outil « Mon budget à zéro »", p: "Construisez votre budget complet, voyez vos repères et téléchargez vos orientations en PDF.", lien: "outil-budget.html", b: "Ouvrir l’outil" }
  }
};
