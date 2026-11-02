/* Atelier guidé · Sortir de mes dettes */
window.ATELIER = {
  id: "sortir-dettes",
  titre: "Sortir de mes dettes",
  h1: "Une dette se rembourse mieux quand on la regarde en face.",
  voix: false,
  question: {
    t: "Vous avez trois dettes et un peu d’argent en plus ce mois-ci. Laquelle remboursez-vous en premier ?",
    r: [
      ["a", "La plus grosse.", "La plus grosse n’est pas toujours la plus coûteuse. On regarde d’abord ce que chaque dette vous coûte. C’est le chapitre 2.", false],
      ["b", "Celle qui a le taux le plus élevé.", "C’est le réflexe qui coûte le moins cher : chaque franc remboursé sur la dette la plus chère vous rapporte son taux. C’est le chapitre 2.", true],
      ["c", "Celle du proche qui insiste le plus.", "On comprend la pression. Mais la relation se protège mieux avec un plan écrit qu’avec des paiements au hasard. C’est le chapitre 4.", false],
      ["d", "Aucune : je garde l’argent pour plus tard.", "Une petite réserve est utile. Mais garder de l’argent qui ne rapporte rien pendant qu’une dette coûte cher, c’est payer deux fois.", false]
    ]
  },
  chapitres: [
    { t: "Tout voir", acq: "Je vois toutes mes dettes", desc: "Les dettes officielles, les dettes invisibles, et leur poids sur votre mois.", e: [
      { t: "La liste complète", c: "On ne sort pas d’une dette qu’on n’a pas écrite. Écrivez-les toutes, même celles qui font honte.",
        w: { k: "Vos dettes, avec ce qu’il reste à payer", c3: 1, champs: [ {id:"d1_n", l:"Dette 1 : à qui", type:"txt", ph:"banque, boutique, proche"}, {id:"d1_r", l:"Reste dû (F)"}, {id:"d1_m", l:"Par mois (F)"}, {id:"d2_n", l:"Dette 2 : à qui", type:"txt"}, {id:"d2_r", l:"Reste dû (F)"}, {id:"d2_m", l:"Par mois (F)"}, {id:"d3_n", l:"Dette 3 : à qui", type:"txt"}, {id:"d3_r", l:"Reste dû (F)"}, {id:"d3_m", l:"Par mois (F)"} ],
          v: function(D,H){ var r=H.N(D.d1_r)+H.N(D.d2_r)+H.N(D.d3_r), m=H.N(D.d1_m)+H.N(D.d2_m)+H.N(D.d3_m); return r?'<div class="gros"><small>Total restant dû</small><b>'+H.F(r)+'</b><p>'+H.F(m)+' à payer chaque mois.</p></div>':''; } },
        p: "Toutes mes dettes sont écrites." },
      { t: "Les dettes invisibles", c: "Si vous avez reçu votre tour de tontine au début du cycle, vous devez encore les cotisations suivantes : c’est une dette, même si personne ne l’appelle ainsi.",
        w: { puces: { id:"di_l", k:"Ce que vous devez aussi", m:1, l:["Avance sur salaire","Crédit chez le boutiquier","Prêt d’un proche","Tours de tontine encore dus","Facture en retard","Rien de tout cela"] } },
        p: "J’ai ajouté mes dettes invisibles à ma liste." },
      { t: "Le poids sur mon mois", c: "Repère EFA : quand les remboursements dépassent un tiers du revenu, le moindre imprévu fait déborder le mois.",
        w: { champs: [ {id:"dp_rev", l:"Votre revenu du mois (F)"} ],
          v: function(D,H){ var r=H.N(D.dp_rev), m=H.N(D.d1_m)+H.N(D.d2_m)+H.N(D.d3_m); if(!r||!m) return ''; var p=Math.round(m/r*100); return '<div class="verdict '+(p>33?'v-ko':p>20?'v-mid':'v-ok')+'">'+p+' % de votre revenu part en remboursements.'+(p>33?' C’est au-dessus du repère : on n’ajoute plus aucune dette.':' Vous gardez une marge.')+'</div>'; } },
        p: "Je connais le poids de mes dettes sur mon mois." }
    ]},
    { t: "Classer", acq: "Je sais laquelle attaquer", desc: "Le vrai coût de chaque dette, puis l’ordre de remboursement.", e: [
      { t: "Le vrai coût d’une dette", c: "Demandez toujours le taux annuel, tous frais compris. Un « petit intérêt par mois » peut cacher un taux annuel très élevé.",
        w: { quiz: [ ["Un prêt à 5 % par mois, c’est environ…", ["5 % par an","60 % par an"], 1, "5 % par mois, douze fois, cela fait au moins 60 % par an."], ["Les frais de dossier font-ils partie du coût ?", ["Oui","Non"], 0, "Oui. C’est pour cela qu’on compare le coût total, pas seulement le taux affiché."] ] },
        p: "Je connais le coût de chacune de mes dettes." },
      { t: "Ma méthode", c: "Les deux méthodes marchent. La meilleure est celle que vous tiendrez.",
        w: { puces: { id:"me_c", k:"Choisissez votre méthode", l:["La plus chère d’abord","La plus petite d’abord"] },
          v: function(D){ return D.me_c==="La plus chère d’abord"?'<div class="verdict v-ok">Vous payez le moins d’intérêts possible. Gardez le minimum sur les autres dettes, et mettez tout le reste sur la plus chère.</div>':D.me_c?'<div class="verdict v-ok">Vous soldez vite une première dette : cette victoire donne l’élan pour la suivante. Gardez le minimum sur les autres.</div>':''; } },
        p: "J’ai choisi ma méthode." },
      { t: "Les dettes qui ne pardonnent pas", f: ["Le loyer : un retard peut coûter le logement.", "L’école : un retard peut coûter l’année d’un enfant.", "Un fournisseur dont dépend votre activité.", "Une dette garantie par un bien que vous ne voulez pas perdre."], c: "Certaines dettes se paient d’abord, même si elles ne sont pas les plus chères. Leur retard coûte plus que des intérêts.",
        p: "J’ai repéré les dettes à ne jamais laisser en retard." }
    ]},
    { t: "Arrêter de creuser", acq: "Je n’ajoute plus de dette", desc: "Comprendre pourquoi on emprunte, et se donner une règle simple.", e: [
      { t: "Pourquoi j’emprunte", c: "On n’emprunte presque jamais par plaisir. On emprunte parce qu’un trou revient chaque mois. C’est ce trou qu’il faut boucher.",
        w: { puces: { id:"pq_l", k:"La raison la plus fréquente", l:["Fin de mois trop courte","Urgence de santé","Demande de la famille","Événement : mariage, funérailles","Commerce ou projet"] } },
        p: "Je connais la raison de mes emprunts." },
      { t: "La règle des quarante-huit heures", f: ["Avant tout nouvel emprunt, j’attends quarante-huit heures.", "Je cherche une autre solution : reporter, vendre, demander un délai.", "Si j’emprunte quand même, j’écris quand et comment je rembourse."], c: "Deux jours suffisent souvent pour qu’une urgence redevienne une simple envie.",
        p: "J’adopte la règle des quarante-huit heures." },
      { t: "Une petite réserve d’abord", c: "Sans un petit coussin, le prochain imprévu devient une nouvelle dette. Construisez une petite réserve en même temps que vous remboursez.",
        w: { champs: [ {id:"pr_m", l:"Ma première réserve (F)", ph:"50 000"} ] },
        p: "Le montant de ma petite réserve est fixé." }
    ]},
    { t: "Renégocier", acq: "Je sais négocier", desc: "Préparer l’échange, proposer un plan, garder la relation.", e: [
      { t: "Préparer l’échange", c: "On négocie mieux avec un chiffre précis. Arrivez avec une proposition, pas avec une excuse.",
        w: { champs: [ {id:"rn_q", l:"Avec qui je négocie", type:"txt"}, {id:"rn_m", l:"Mensualité que je peux tenir (F)"} ] },
        p: "Ma proposition est prête." },
      { t: "Les mots pour le dire", f: ["Je reconnais la dette et le retard.", "J’explique en une phrase ce qui a changé.", "Je propose un montant et une date, que je peux tenir.", "Je demande une confirmation écrite."], c: "Un créancier préfère un paiement régulier et certain à une promesse qu’on ne tient pas.",
        p: "Je sais comment présenter ma demande." },
      { t: "Avec un proche", c: "Avec un proche, la dette pèse sur la relation. Écrire le plan, même sur un simple message, protège les deux.",
        w: { champs: [ {id:"rp_t", l:"Mon message au proche", type:"area", ph:"Je te dois… Je te propose de rembourser… chaque…"}] },
        p: "Mon message est écrit." }
    ]},
    { t: "Mon plan de sortie", acq: "J’ai une date de sortie", desc: "Un montant en plus chaque mois, et une date à fêter.", e: [
      { t: "Ma date de sortie", c: "Une date transforme un poids en objectif. Le calcul ci-dessous ne compte pas les intérêts : la vraie date sera un peu plus loin.",
        w: { champs: [ {id:"ps_r", l:"Reste dû sur la dette ciblée (F)"}, {id:"ps_m", l:"Mensualité actuelle (F)"}, {id:"ps_x", l:"Ce que j’ajoute chaque mois (F)"} ],
          v: function(D,H){ var r=H.N(D.ps_r), m=H.N(D.ps_m)+H.N(D.ps_x); if(!r||!m) return ''; var n=Math.ceil(r/m), d=new Date(); d.setMonth(d.getMonth()+n); D.ps_date=d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}); return '<div class="gros"><small>Dette soldée vers</small><b>'+D.ps_date+'</b><p>Environ '+n+' mois, sans compter les intérêts.</p></div>'; } },
        p: "Ma date de sortie est écrite." },
      { t: "Après chaque dette soldée", f: ["Je garde la même somme chaque mois.", "Je la reporte entière sur la dette suivante.", "Quand tout est soldé, cette somme devient mon épargne."], c: "Chaque dette soldée libère une mensualité. Ne la laissez pas disparaître : elle accélère tout le reste.",
        p: "Je sais quoi faire de chaque mensualité libérée." }
    ]}
  ],
  fin: {
    k: "Mon plan de sortie des dettes", titre: "Vous avez un plan",
    fiche: [
      ["Total restant dû", function(D,H){ var r=H.N(D.d1_r)+H.N(D.d2_r)+H.N(D.d3_r); return r?H.F(r):''; }],
      ["Remboursements par mois", function(D,H){ var m=H.N(D.d1_m)+H.N(D.d2_m)+H.N(D.d3_m); return m?H.F(m):''; }],
      ["Dettes invisibles", function(D){ return (D.di_l||[]).join(', '); }],
      ["Ma méthode", function(D){ return D.me_c||''; }],
      ["Pourquoi j’emprunte", function(D){ return D.pq_l||''; }],
      ["Ma petite réserve", function(D,H){ return H.N(D.pr_m)?H.F(H.N(D.pr_m)):''; }],
      ["Ma proposition", function(D,H){ return D.rn_q?D.rn_q+(H.N(D.rn_m)?' · '+H.F(H.N(D.rn_m))+' par mois':''):''; }],
      ["Ma date de sortie", function(D){ return D.ps_date||''; }]
    ],
    suite: { t: "Construire mon budget", p: "L’outil pour répartir chaque mois entre dépenses, remboursements et épargne, et voir ce qui reste. Gratuit.", lien: "construire-son-budget.html", b: "Ouvrir l’outil" }
  }
};
