/* Atelier guidé · Investir sur un marché émergent : comprendre avant de comparer (17 nov. 2026)
   Chiffres BRVM vérifiés : communiqué « 2025, la consolidation quinquennale » (145,37 → 345,75 ; +99,15 % ; années ;
   titres échangés +109 %, valeur −24 %) et bilan 2025 (capitalisation). Exemples de change : fictifs. */
window.ATELIER = {
  id: "marche-emergent",
  titre: "Investir sur un marché émergent : comprendre avant de comparer",
  h1: "Un marché qui grandit, et votre résultat à vous.",
  voix: "auto",
  question: {
    t: "La BRVM a presque doublé en cinq ans. Si vous aviez investi au départ, auriez-vous forcément doublé votre argent ?",
    r: [
      ["a", "Oui, c’est ce que dit l’indice.", "L’indice décrit le marché dans son ensemble. Votre résultat dépend du moment d’entrée, des titres choisis, des dividendes et des frais. On le voit tout de suite.", false],
      ["b", "Pas forcément : cela dépend de ce que j’aurais acheté, et quand.", "C’est la bonne lecture. Ce chiffre est un point de départ pour enquêter, pas un résultat promis.", true]
    ]
  },
  chapitres: [
    { t: "Comprendre avant de comparer", acq: "Je sais lire la performance d’un marché et ce que j’achète vraiment", desc: "Des années très différentes. On n’achète pas un pays, on achète des titres précis.", e: [
      { t: "La BRVM a presque doublé. Et vous ?", c: "Selon la BRVM, le BRVM Composite est passé de 145,37 points le 1er janvier 2021 à 345,75 points le 31 décembre 2025 : +99,15 %. Mais les années n’ont pas été identiques.",
        f: ["2021 : +39,15 %.", "2022 : +0,46 %.", "2023 : +5,38 %.", "2024 : +28,89 %.", "2025 : +25,26 %.", "Le moment d’entrée, les titres choisis, les dividendes et les frais changent le résultat d’une personne réelle."],
        w: { consignes: 1, quiz: [
          ["Vous êtes entré début 2022 et sorti fin 2023. Qu’avez-vous vécu ?", ["Le doublement du marché","Deux années presque plates : +0,46 % puis +5,38 % pour l’indice"], 1, "Le +99 % sur cinq ans vient surtout de 2021, 2024 et 2025. Votre fenêtre à vous fait votre résultat."]
        ] },
        p: "Je sais qu’un chiffre sur cinq ans cache des années très différentes." },
      { t: "Où va votre argent ?", c: "La BRVM est le marché commun aux huit pays de l’UEMOA : une cinquantaine de sociétés cotées, et environ 13 331 milliards de F de capitalisation pour les actions fin 2025. « Marché émergent » suggère une économie qui grandit, mais ce n’est pas une analyse : vous achetez des titres précis, à un prix précis.",
        f: ["Une entreprise cotée dans un pays peut gagner une grande partie de son argent ailleurs.", "Une entreprise qui importe ses équipements peut vendre plus et gagner moins si le coût des importations monte.", "Une autre peut profiter de la hausse du prix du produit qu’elle exporte."],
        w: { consignes: 1, k: "Pour une entreprise que vous connaissez", champs: [ {id:"me_soc", l:"L’entreprise", type:"txt"}, {id:"me_vend", l:"Où vend-elle ?", type:"txt"}, {id:"me_cout", l:"Où supporte-t-elle ses coûts ?", type:"txt"}, {id:"me_mon", l:"Dans quelle monnaie encaisse-t-elle ?", type:"txt"} ],
          v: function(D){ return D.me_vend&&D.me_cout?'<div class="verdict v-ok">Vous savez à quoi cette entreprise vous expose, au-delà du pays où elle est cotée.</div>':''; } },
        p: "Je regarde où l’entreprise vend, dépense et encaisse." }
    ]},
    { t: "Mesurer juste", acq: "Je compare mon résultat à l’indice correctement et je vérifie la liquidité", desc: "Un indice ne se glisse pas dans votre portefeuille. Pouvoir acheter n’est pas pouvoir revendre vite.", e: [
      { t: "Un indice ne se glisse pas dans votre portefeuille", c: "Koffi voit que le BRVM Composite a gagné 25,26 % en 2025. Il achète trois actions qu’il connaît, et compare un an plus tard. La comparaison est utile s’il se souvient qu’il ne détient pas toutes les actions de l’indice, dans les mêmes proportions.",
        f: ["Ses trois entreprises peuvent monter plus, moins, ou baisser pendant une année de hausse générale.", "Comparez des chiffres construits de la même façon : un indice de cours ne compte pas les dividendes reçus. La BRVM a mis en place un BRVM Composite Total Return, qui les intègre.", "La question utile : qu’ai-je réellement détenu, payé et reçu ?"],
        w: { consignes: 1, quiz: [
          ["Votre portefeuille a fait +18 % dividendes compris, l’indice de cours +25 %. Avez-vous fait moins bien que le marché ?", ["Oui, clairement","Pas forcément : je ne compare pas la même chose"], 1, "Un indice de cours sans dividendes et un portefeuille avec dividendes ne se comparent pas directement. Comparez avec un indice qui intègre les dividendes, ou retirez-les de votre calcul."]
        ] },
        p: "Je compare des chiffres construits de la même façon." },
      { t: "Pouvoir acheter n’est pas toujours pouvoir revendre vite", c: "Si peu de personnes échangent une action, vous pourriez attendre pour acheter ou vendre la quantité voulue, ou accepter un autre prix. En 2025, le nombre de titres échangés à la BRVM a augmenté d’environ 109 %, mais la valeur totale des transactions a reculé d’environ 24 %.",
        f: ["Plus de titres échangés ne veut pas dire plus de francs échangés.", "L’activité de toute la Bourse ne garantit pas un acheteur immédiat pour votre action.", "Avant d’investir, regardez les volumes de la valeur visée, et demandez-vous ce que vous feriez s’il fallait vendre vite."],
        w: { consignes: 1, quiz: [
          ["Le dernier cours d’une action peu échangée est 5 000 F. Pouvez-vous vendre 500 titres demain à ce prix ?", ["Oui, c’est le cours","Pas forcément : il faut des acheteurs pour cette quantité, à ce prix"], 1, "Le dernier cours est le prix de la dernière transaction, souvent sur une petite quantité. Regardez les offres et les volumes."]
        ] },
        p: "Je vérifie la liquidité de la valeur avant d’acheter." }
    ]},
    { t: "Monnaie et méthode", acq: "Je mesure l’effet de change et j’enquête avant d’investir", desc: "Un titre peut monter et rapporter moins une fois converti. Cinq lignes avant de décider.", e: [
      { t: "À quel risque de monnaie êtes-vous exposé ?", c: "Si vous gagnez et dépensez en FCFA, un titre coté en FCFA à la BRVM vous évite une conversion directe. Cela n’efface pas l’effet des prix internationaux sur les entreprises. Si vous investissez sur un marché coté dans une autre monnaie, suivez deux résultats : celui du placement, et celui de la conversion en FCFA.",
        w: { ex: "Exemple fictif : 100 000 F placés dans un actif étranger qui gagne 10 % dans sa monnaie. Si cette monnaie perd 15 % face au FCFA, il reste 100 000 × 1,10 × 0,85 = 93 500 F, avant frais.", k: "Votre calcul", c3: 1, champs: [ {id:"me_m", l:"Somme en FCFA"}, {id:"me_g", l:"Gain de l’actif dans sa monnaie (%)"}, {id:"me_c", l:"Variation de cette monnaie face au FCFA (%), avec un signe moins si elle baisse", ph:"-15", type:"txt"} ],
          v: function(D,H){ var m=H.N(D.me_m); if(!m||!D.me_g||D.me_c===undefined||D.me_c==='') return ''; var g=parseFloat(String(D.me_g).replace(',','.'))||0, c=parseFloat(String(D.me_c).replace(',','.'))||0, f=Math.round(m*(1+g/100)*(1+c/100)), e=f-m;
            return '<div class="gros"><small>Résultat converti en FCFA, avant frais</small><b>'+H.F(f)+' · '+(e>=0?'+':'−')+H.F(Math.abs(e))+'</b><p>'+(e<0&&g>0?'La bonne performance du titre n’a pas suffi à compenser l’effet de change.':'Le change compte autant que le titre : suivez les deux.')+'</p></div>'; } },
        p: "Je calcule mon résultat une fois converti en FCFA." },
      { t: "Une méthode pour examiner un marché nouveau", c: "Awa envisage une action qu’elle ne connaît pas encore. Avant de penser au rendement, elle répond à cinq questions. Sur le marché régional, on passe par un intermédiaire agréé : l’AMF-UMOA recommande de vérifier son agrément et de comprendre les documents avant de s’engager.",
        w: { puces: { id:"me_cinq", k:"J’ai la réponse pour…", m:1, l:["L’entreprise : comment elle gagne son argent, ce que disent ses résultats","Le prix : ce qu’on paie par rapport aux bénéfices et aux perspectives","La monnaie : de cotation, et celle où elle gagne son argent","La liquidité : acheter ou vendre ma quantité dans de bonnes conditions","L’accès : l’intermédiaire, les documents, les frais"] },
          champs: [ {id:"me_act", l:"Ce que je comprends de son activité", type:"area"}, {id:"me_envie", l:"Le chiffre qui me donne envie de l’étudier", type:"txt"}, {id:"me_risque", l:"Le risque que je dois encore examiner", type:"txt"}, {id:"me_manque", l:"La donnée qui me manque avant de décider", type:"txt"} ],
          v: function(D){ return D.me_manque?'<div class="verdict v-ok">Vous avez transformé une envie d’investir « sur un marché prometteur » en enquête sur un investissement réel.</div>':''; } },
        p: "Mon enquête est écrite, sans passer d’ordre." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Mon enquête avant d’investir »", titre: "Votre résultat dépend de ce que vous choisissez, du prix payé et de la sortie",
    fiche: [
      ["L’entreprise étudiée", function(D){ return D.me_soc||''; }],
      ["Où elle vend, dépense, encaisse", function(D){ return [D.me_vend,D.me_cout,D.me_mon].filter(Boolean).join(' · '); }],
      ["Ce que je comprends", function(D){ return D.me_act||''; }],
      ["Ce qui me donne envie", function(D){ return D.me_envie||''; }],
      ["Le risque à examiner", function(D){ return D.me_risque||''; }],
      ["Ce qui me manque", function(D){ return D.me_manque||''; }],
      ["Questions résolues", function(D){ var n=(D.me_cinq||[]).length; return n?n+' sur 5':''; }]
    ],
    suite: { t: "Lire une société cotée", p: "Votre enquête a des trous ? L’atelier suivant vous apprend à lire les résultats d’une société cotée.", lien: "atelier-lire-societe-cotee.html", b: "Ouvrir l’atelier" }
  }
};
