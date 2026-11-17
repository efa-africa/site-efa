/* Atelier guidé · Maîtriser ses finances personnelles : de l'argent qui entre à l'argent qui construit (17 nov. 2026)
   Cas de Serge : exercice. BRVM Composite +25,26 % (2025), +0,46 % (2022), BRVM. Aucun chiffre d'inflation mensuel 2026.
   Résultat : « Ma fiche de sortie datée et une action pour cette semaine ». */
window.ATELIER = {
  id: "finances-personnelles",
  titre: "Maîtriser ses finances personnelles : de l’argent qui entre à l’argent qui construit",
  h1: "Savoir où va votre argent, ce que vous devez, ce que vous gardez, et pourquoi.",
  voix: "auto",
  question: {
    t: "Vous gagnez 500 000 F par mois. À la fin de l’année, 6 millions seront entrés. Combien auront servi vos projets ?",
    r: [
      ["a", "Je ne sais pas vraiment.", "C’est la situation la plus courante, et c’est exactement le point de départ. On commence par voir le trajet de votre argent, sans vous juger.", true],
      ["b", "Je le sais, au franc près.", "Très bien. Cet atelier vous aide à aller plus loin : nommer ce qui reste, reprendre la main sur les dettes, et passer à l’investissement au bon moment.", true]
    ]
  },
  chapitres: [
    { t: "Voir et nommer", acq: "Je connais ma marge réelle et je lui donne une mission", desc: "Ce qui entre, ce qui sort, ce qui reste. Une somme nommée se défend mieux.", e: [
      { t: "Voir ce qui entre et ce qui sort", c: "Serge reçoit 500 000 F par mois. Il veut arrêter de découvrir sa situation le 20 du mois. Pendant un mois, il rassemble ses paiements en espèces, par carte et par mobile money, et les classe selon leur rôle, sans se juger. Ses chiffres sont un cas d’exercice, pas une répartition idéale.",
        w: { ex: "Serge : 500 000 F de revenu ; logement 140 000, alimentation et transport 130 000, aide aux proches 50 000, tontine 30 000, dettes 60 000, autres 65 000. Il reste 25 000 F.", k: "Votre mois (F)", champs: [ {id:"fp_rev", l:"Revenu du mois"}, {id:"fp_log", l:"Logement et charges"}, {id:"fp_ali", l:"Alimentation et transport"}, {id:"fp_aide", l:"Aide aux proches"}, {id:"fp_ton", l:"Tontine"}, {id:"fp_det", l:"Remboursements de dettes"}, {id:"fp_aut", l:"Autres dépenses"} ],
          v: function(D,H){ var r=H.N(D.fp_rev); if(!r) return ''; var s=['fp_log','fp_ali','fp_aide','fp_ton','fp_det','fp_aut'].reduce(function(a,k){return a+H.N(D[k]);},0), m=r-s; return '<div class="gros"><small>Ce qui reste du mois</small><b>'+(m<0?'−':'')+H.F(Math.abs(m))+'</b><p>'+(m<0?'Vous dépensez plus que ce qui entre : c’est la première chose à corriger, avant toute épargne.':'Avant de promettre d’investir, comprenez comment créer et garder cette marge. Une ligne estimée se vérifie le mois prochain.')+'</p></div>'; } },
        p: "Je connais ma marge réelle du mois." },
      { t: "Donner un nom à ce qui reste", c: "Les 25 000 F de Serge disparaissent en petits achats, parce qu’aucune décision ne les attend. Il leur donne une première mission : une réserve accessible. En douze mois, sans aucun rendement, cela fait 300 000 F : pas de quoi tout régler, mais assez pour qu’une dépense soudaine ne devienne pas aussitôt une dette.",
        f: ["Il fixe sa réserve en regardant ses dépenses indispensables, la stabilité de ses revenus et les personnes qui dépendent de lui.", "Il choisit une première étape atteignable, qu’il relèvera plus tard.", "Une somme nommée est plus facile à défendre contre les dépenses improvisées."],
        w: { consignes: 1, champs: [ {id:"fp_garde", l:"Ce que je garde chaque mois (F)"}, {id:"fp_mission", l:"Sa mission : réserve pour… ou projet prévu pour…", type:"txt", ph:"Réserve pour les imprévus de santé"} ],
          v: function(D,H){ var g=H.N(D.fp_garde); if(!g) return ''; return '<div class="gros"><small>En douze mois, sans rendement</small><b>'+H.F(g*12)+'</b><p>'+(D.fp_mission?'Mission : '+H.esc(D.fp_mission)+'.':'Donnez-lui une mission.')+'</p></div>'; } },
        p: "Ma marge a une mission." }
    ]},
    { t: "Dettes et tontine", acq: "J’ai mes dettes sur une page et mon tour de tontine a une destination", desc: "Toutes les mensualités au même endroit. Ne pas compter sa tontine deux fois.", e: [
      { t: "Reprendre la main sur les dettes", c: "Serge rembourse 60 000 F par mois. Avant un nouveau crédit ou un remboursement plus rapide, il relève pour chaque dette le capital restant, le coût total, l’échéance et les conséquences d’un retard. Une dette qui a financé un actif n’est pas « bonne » d’office : même un projet utile devient dangereux si les mensualités étouffent le reste.",
        w: { k: "Mes dettes", champs: [ {id:"fp_d1", l:"Dette 1 : prêteur, mensualité, fin", type:"txt", ph:"Banque, 40 000 F, juin 2027"}, {id:"fp_d2", l:"Dette 2", type:"txt"}, {id:"fp_d3", l:"Dette 3", type:"txt"}, {id:"fp_dtot", l:"Total de mes mensualités (F)"} ],
          v: function(D,H){ var t=H.N(D.fp_dtot), r=H.N(D.fp_rev); if(!t) return ''; return '<div class="gros"><small>Mes mensualités</small><b>'+H.F(t)+(r?' · '+Math.round(t/r*100)+' % du revenu':'')+'</b><p>Ce total entre dans le budget avant de décider combien investir. Première règle : cesser d’ajouter des dettes non prévues.</p></div>'; } },
        p: "Toutes mes mensualités sont sur une page." },
      { t: "Votre tontine dans votre budget", c: "Serge cotise 30 000 F par mois. C’est une sortie réelle. Quand son tour viendra, la somme reçue aura elle aussi une destination. Il ne doit pas la compter deux fois : comme argent déjà de côté, puis comme rentrée future pour un projet. La tontine aide à mobiliser une somme ; elle ne remplace pas une réserve personnelle disponible.",
        w: { champs: [ {id:"fp_tour", l:"Date probable de mon tour", type:"txt", ph:"mars 2027"}, {id:"fp_apres", l:"Ce qu’il me restera à cotiser après mon tour (F)"}, {id:"fp_usage", l:"Mon tour servira à…", type:"txt"}, {id:"fp_due", l:"Date à laquelle cette dépense sera due", type:"txt"} ],
          v: function(D){ return D.fp_usage&&D.fp_due?'<div class="verdict v-ok">Vérifiez que votre tour arrive avant la date de la dépense. Sinon, il faudra une autre solution pour combler l’écart.</div>':''; } },
        p: "Mon tour de tontine a une destination et une date." }
    ]},
    { t: "Construire et tenir", acq: "Je sais quand investir et j’ai une méthode mensuelle", desc: "Investir après la réserve et les dettes. Vingt minutes par mois.", e: [
      { t: "Passer de l’épargne à l’investissement au bon moment", c: "Une fois la réserve engagée et les dettes comprises, Serge regarde l’argent qu’il n’utilisera pas bientôt, et se demande quel objectif il veut financer dans plusieurs années. Le BRVM Composite a gagné 25,26 % en 2025, mais seulement 0,46 % en 2022 : il ne promet pas à son projet le rendement d’une seule année.",
        f: ["Son point de départ n’est pas « quel titre monte aujourd’hui ? ».", "C’est « quand aurai-je besoin de cet argent, et que puis-je accepter de voir varier ? ».", "Il commence par apprendre à lire une entreprise, une obligation ou un fonds.", "Un gain en francs s’apprécie aussi en pouvoir d’achat."],
        w: { consignes: 1, quiz: [
          ["Serge n’a pas encore de réserve et rembourse 60 000 F par mois. Un ami lui conseille une action qui monte. Que fait-il ?", ["Il investit tout de suite, pour ne pas rater la hausse","Il termine d’abord sa réserve et organise ses dettes"], 1, "Sans réserve, la première urgence l’obligerait à vendre au mauvais moment, ou à s’endetter."]
        ] },
        p: "Je sais à quel moment passer à l’investissement." },
      { t: "Garder une méthode vivante", c: "Serge ne veut pas passer ses soirées devant un tableau. Il fixe un rendez-vous de vingt minutes par mois : ce qui est entré et sorti, ce qui reste vraiment, sa réserve, ses dettes et ses projets, puis une action pour le mois suivant. Si un mois est difficile, il ne jette pas son plan : il explique l’écart et ajuste.",
        w: { champs: [ {id:"fp_rdv", l:"Mon rendez-vous mensuel", type:"txt", ph:"le 1er dimanche du mois, 20 minutes"}, {id:"fp_cible", l:"Ma première réserve cible (F)"}, {id:"fp_projet", l:"Mon projet à plus long terme", type:"txt"}, {id:"fp_action", l:"Ma prochaine action, cette semaine", type:"txt", ph:"Ouvrir un compte séparé pour ma réserve"} ],
          v: function(D){ return D.fp_action?'<div class="verdict v-ok">Votre fiche est datée, avec une action assez petite pour être faite cette semaine.</div>':''; } },
        p: "Ma méthode mensuelle et ma prochaine action sont écrites." }
    ]}
  ],
  fin: {
    k: "Ma fiche de sortie « Mes finances, ce mois-ci »", titre: "La maîtrise commence quand vous savez où va votre argent",
    fiche: [
      ["Ce qui entre", function(D,H){ var r=H.N(D.fp_rev); return r?H.F(r):''; }],
      ["Ce qui reste du mois", function(D,H){ var r=H.N(D.fp_rev); if(!r) return ''; return H.F(r-['fp_log','fp_ali','fp_aide','fp_ton','fp_det','fp_aut'].reduce(function(a,k){return a+H.N(D[k]);},0)); }],
      ["Mission de ma marge", function(D){ return D.fp_mission||''; }],
      ["Mes mensualités", function(D,H){ var t=H.N(D.fp_dtot); return t?H.F(t):''; }],
      ["Mon tour de tontine", function(D){ return [D.fp_tour,D.fp_usage].filter(Boolean).join(' · '); }],
      ["Ma réserve cible", function(D,H){ var c=H.N(D.fp_cible); return c?H.F(c):''; }],
      ["Mon projet", function(D){ return D.fp_projet||''; }],
      ["Mon rendez-vous mensuel", function(D){ return D.fp_rdv||''; }],
      ["Cette semaine", function(D){ return D.fp_action||''; }]
    ],
    suite: { t: "Ma réserve de sécurité", p: "Votre première mission, c’est souvent la réserve. L’atelier suivant fixe son montant et l’endroit où la garder.", lien: "atelier-reserve-securite.html", b: "Ouvrir l’atelier" }
  }
};
