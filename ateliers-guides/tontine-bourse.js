/* Atelier guidé · Ma tontine devient un club d'investissement (17 nov. 2026)
   La « tontine de Bourse » : un groupe cotise chaque mois et investit ensemble à la BRVM, par une SGI.
   Aucune forme juridique imposée ici : la structure acceptée pour un compte-titres collectif se vérifie auprès de la SGI.
   Montants : exercices. Résultat : « La charte de notre club ». */
window.ATELIER = {
  id: "tontine-bourse",
  titre: "Ma tontine devient un club d’investissement",
  h1: "Cotiser ensemble, chaque mois, pour investir à la Bourse.",
  voix: "auto",
  question: {
    t: "Dans une tontine, chacun reçoit la cagnotte à son tour. Dans un club d’investissement, que devient l’argent ?",
    r: [
      ["a", "Il est redistribué à un membre chaque mois, comme avant.", "C’est la différence clé : dans un club, l’argent ne tourne pas, il reste investi. Chacun possède une part de ce que le groupe détient. On le voit au chapitre 1.", false],
      ["b", "Il reste investi, et chacun possède une part du portefeuille du groupe.", "Exactement. Cet atelier vous donne les règles, le compte et le calcul de la part de chacun, pour transformer votre tontine en club.", true]
    ]
  },
  chapitres: [
    { t: "De la tontine au club", acq: "Je sais ce qui change quand une tontine devient un club", desc: "L’argent ne tourne plus, il travaille. La discipline de la tontine reste.", e: [
      { t: "Ce qui change, ce qui reste", c: "La tontine a déjà ce qui manque à beaucoup d’investisseurs : la régularité et la confiance du groupe. Le club d’investissement garde cette discipline, mais change la destination de l’argent : au lieu de remettre la cagnotte à un membre, le groupe achète ensemble des titres à la BRVM.",
        f: ["Ce qui reste : une cotisation fixe, un jour fixe, la pression bienveillante du groupe.", "Ce qui change : personne ne « ramasse » ; chacun détient des parts du portefeuille commun.", "La valeur des parts monte et descend avec la Bourse : on peut récupérer moins que ce qu’on a versé.", "Ce n’est pas une réserve d’urgence : chaque membre garde la sienne à côté."],
        w: { consignes: 1, quiz: [
          ["Un membre a besoin d’argent pour une urgence le mois prochain. Le club est-il la bonne solution ?", ["Oui, c’est son tour de recevoir","Non : le club est investi à long terme, l’urgence se paie avec la réserve personnelle"], 1, "Vendre des titres en urgence, peut-être en baisse, pénalise le membre et tout le groupe. Le club n’a pas de « tour »."]
        ] },
        p: "Je sais que le club investit au lieu de redistribuer." },
      { t: "Ce que le groupe peut réunir", c: "Dix membres qui cotisent 20 000 F par mois réunissent 200 000 F par mois, soit 2 400 000 F en un an, sans compter aucun rendement. Seul, chacun aurait 240 000 F : ensemble, le groupe peut acheter plus tôt, répartir sur plusieurs titres et partager les frais.",
        w: { k: "Votre groupe", c3: 1, champs: [ {id:"tb_n", l:"Nombre de membres"}, {id:"tb_c", l:"Cotisation par membre et par mois (F)"}, {id:"tb_m", l:"Durée (mois)"} ],
          v: function(D,H){ var n=H.N(D.tb_n), c=H.N(D.tb_c), m=H.N(D.tb_m)||12; if(!n||!c) return ''; return '<div class="gros"><small>Versé par le groupe en '+m+' mois, sans rendement</small><b>'+H.F(n*c*m)+'</b><p>Soit '+H.F(n*c)+' à investir chaque mois. Chaque membre aura versé '+H.F(c*m)+'.</p></div>'; } },
        p: "Je sais ce que mon groupe peut réunir." }
    ]},
    { t: "Les règles du club", acq: "Mon club a des règles écrites, avant le premier franc", desc: "Une charte écrite évite la plupart des conflits. Deux signatures pour chaque ordre.", e: [
      { t: "Écrire la charte avant le premier franc", c: "Dans une tontine, beaucoup de règles restent orales. Dans un club qui investit, ce n’est plus possible : il faut savoir qui décide, comment on entre, comment on sort, et ce que vaut la part de chacun. Écrivez-les, faites-les signer par chaque membre.",
        w: { puces: { id:"tb_regles", k:"Notre charte prévoit…", m:1, l:["Le montant et le jour de la cotisation","Ce qui arrive en cas de retard","Comment on décide d’un achat ou d’une vente (vote, majorité)","Qui passe les ordres, avec deux signatures","Comment un membre entre, et à quel prix","Comment un membre sort, et à quelle valeur","Ce qu’on fait des dividendes (réinvestis ou partagés)","Comment chacun voit les relevés du compte"] },
          v: function(D){ var n=(D.tb_regles||[]).length; if(!n) return ''; return n===8?'<div class="verdict v-ok">Votre charte couvre l’essentiel. Faites-la signer par chaque membre et gardez-en une copie chacun.</div>':'<div class="verdict v-ko">'+(8-n)+' règle'+(8-n>1?'s':'')+' encore à écrire. Ce sont souvent celles-là qui créent les disputes.</div>'; } },
        p: "Les règles de notre club sont écrites." },
      { t: "Qui décide, qui signe", c: "Le risque n°1 d’un club n’est pas la Bourse : c’est l’argent du groupe entre les mains d’une seule personne. Un président ou un trésorier ne doit jamais pouvoir acheter, vendre ou retirer seul.",
        f: ["Chaque ordre et chaque retrait : deux signatures au moins.", "Les relevés de la SGI sont partagés avec tous les membres, chaque mois ou chaque trimestre.", "Un registre tient les cotisations de chacun, visible par tous.", "Les rôles tournent, par exemple chaque année."],
        w: { consignes: 1, quiz: [
          ["Le trésorier propose de garder les cotisations sur son compte personnel « pour aller plus vite ». Que répondez-vous ?", ["D’accord, il est de confiance","Non : l’argent du club reste sur un compte au nom du club, avec deux signatures"], 1, "La confiance n’est pas une règle. Un compte au nom du club protège tout le monde, trésorier compris."]
        ] },
        p: "Aucun membre ne peut agir seul sur l’argent du club." }
    ]},
    { t: "Investir ensemble à la BRVM", acq: "Je sais ouvrir le compte du club et calculer la part de chacun", desc: "Un compte-titres par une SGI agréée. La valeur de la part, le calcul qui évite les disputes.", e: [
      { t: "Le compte du club, par une SGI", c: "À la BRVM, on achète et on vend par une SGI agréée. Pour un groupe, la SGI demandera une structure : association déclarée, société ou autre forme qu’elle accepte. Les règles varient d’une SGI à l’autre : demandez-les avant de choisir.",
        w: { puces: { id:"tb_sgi", k:"Ce que nous demandons à la SGI", m:1, l:["Quelle forme juridique accepte-t-elle pour un groupe ?","Quels documents pour ouvrir le compte ?","Quel montant minimum ?","Quels frais : ouverture, garde, courtage ?","Peut-on exiger deux signatures pour chaque ordre ?","À quelle fréquence recevons-nous les relevés ?"] },
          v: function(D){ var n=(D.tb_sgi||[]).length; return n===6?'<div class="verdict v-ok">Vos six questions sont prêtes. Comparez au moins deux SGI. Vérifiez l’agrément sur le site de l’AMF-UMOA.</div>':''; } },
        p: "Nous savons quoi demander à la SGI." },
      { t: "La valeur de la part : le calcul qui évite les disputes", c: "Les membres ne versent pas tous au même moment, et la Bourse bouge. Pour être juste, le club compte en parts. Chaque mois : valeur de la part = valeur totale du compte ÷ nombre de parts. Une cotisation achète des parts à la valeur du jour ; un membre qui sort reçoit ses parts × la valeur du jour, moins les frais.",
        w: { ex: "Le compte vaut 2 600 000 F pour 2 400 parts : la part vaut 2 600 000 ÷ 2 400 ≈ 1 083 F. Un membre qui détient 240 parts possède environ 260 000 F.", k: "Votre calcul", c3: 1, champs: [ {id:"tb_val", l:"Valeur totale du compte (F)"}, {id:"tb_parts", l:"Nombre total de parts"}, {id:"tb_mes", l:"Mes parts"} ],
          v: function(D,H){ var v=H.N(D.tb_val), p=H.N(D.tb_parts), m=H.N(D.tb_mes); if(!v||!p) return ''; var vp=v/p; return '<div class="gros"><small>Valeur d’une part'+(m?' · ma part du club':'')+'</small><b>'+H.F(Math.round(vp))+(m?' · '+H.F(Math.round(vp*m)):'')+'</b><p>'+(m?'Ce que vous recevriez en sortant aujourd’hui, avant frais.':'Ajoutez vos parts pour voir ce qui vous revient.')+'</p></div>'; } },
        p: "Je sais calculer la valeur de la part et ce qui revient à chacun." }
    ]},
    { t: "Faire vivre le club", acq: "J’ai la charte de notre club, prête à signer", desc: "Les moments difficiles se prévoient : baisse, départ, retard. Puis votre charte.", e: [
      { t: "Quand la Bourse baisse, quand un membre part", c: "Un jour, le portefeuille baissera, et un membre voudra partir. Si la règle est écrite, c’est un calcul, pas une dispute.",
        f: ["Le membre qui sort reçoit ses parts × la valeur du jour, même si elle a baissé.", "Le club peut fixer un préavis (par exemple deux mois) pour vendre sans précipitation.", "Un retard de cotisation suit la règle prévue : rattrapage, pénalité, ou parts achetées plus tard.", "Les décisions d’achat et de vente se prennent pour le long terme, pas sur une rumeur."],
        w: { consignes: 1, quiz: [
          ["Le portefeuille a baissé de 15 %. Un membre veut récupérer tout ce qu’il a versé. Que dit la règle ?", ["On lui rend ce qu’il a versé","Il reçoit ses parts à la valeur du jour, comme prévu dans la charte"], 1, "Lui rendre ses versements ferait payer la baisse aux membres qui restent. La valeur de la part protège tout le monde."]
        ] },
        p: "Je sais comment le club traite une baisse et un départ." },
      { t: "La charte de notre club", c: "Rassemblez vos décisions sur une page. Faites-la relire et signer par chaque membre avant le premier versement.",
        w: { champs: [ {id:"tb_nom", l:"Nom du club", type:"txt", ph:"Club Spirale de Yopougon"}, {id:"tb_jour", l:"Cotisation : montant et jour", type:"txt", ph:"20 000 F, le 5 de chaque mois"}, {id:"tb_inv", l:"Ce que nous achetons et comment nous décidons", type:"area", ph:"Actions de la BRVM, décision à la majorité des deux tiers, pas plus de 30 % sur une seule société"}, {id:"tb_sign", l:"Qui signe les ordres (deux personnes)", type:"txt"}, {id:"tb_div", l:"Les dividendes", type:"txt", ph:"réinvestis pendant les 3 premières années"}, {id:"tb_sortie", l:"Sortie d’un membre", type:"txt", ph:"préavis de 2 mois, parts à la valeur du jour"} ],
          v: function(D){ return D.tb_sortie&&D.tb_sign?'<div class="verdict v-ok">Votre charte est prête. Elle figure dans votre fiche : imprimez-la ou partagez-la au groupe.</div>':''; } },
        p: "La charte de notre club est écrite." }
    ]}
  ],
  fin: {
    k: "Ma fiche « La charte de notre club »", titre: "Votre tontine a la discipline. Votre club a maintenant les règles.",
    fiche: [
      ["Le club", function(D){ return D.tb_nom||''; }],
      ["Membres et versements", function(D,H){ var n=H.N(D.tb_n), c=H.N(D.tb_c); return n&&c?n+' membres × '+H.F(c)+' = '+H.F(n*c)+' par mois':''; }],
      ["Cotisation", function(D){ return D.tb_jour||''; }],
      ["Investissement et décisions", function(D){ return D.tb_inv||''; }],
      ["Signatures", function(D){ return D.tb_sign||''; }],
      ["Dividendes", function(D){ return D.tb_div||''; }],
      ["Sortie d’un membre", function(D){ return D.tb_sortie||''; }],
      ["Règles écrites", function(D){ var n=(D.tb_regles||[]).length; return n?n+' sur 8':''; }]
    ],
    suite: { t: "Mes premiers pas en Bourse", p: "Votre club est organisé. Le cours suivant apprend à chaque membre à lire le marché et à choisir une SGI.", lien: "premiers-pas-bourse.html", b: "Ouvrir le cours" }
  }
};
