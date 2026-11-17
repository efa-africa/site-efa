/* Atelier guidé · Comprendre l'économie pour mieux investir (17 nov. 2026)
   Neuf situations : une situation, ce qu'il faut comprendre, une décision à prendre.
   Niveau intermédiaire. Résultat : la fiche « Ce que je surveille avant d'investir ». */
window.ATELIER = {
  id: "economie-pour-investir",
  titre: "Comprendre l’économie pour mieux investir",
  h1: "Inflation, taux, croissance, cacao : ce que l’actualité change vraiment à vos placements.",
  voix: "auto",
  question: {
    t: "La BCEAO annonce une baisse de son taux. Un ami vous dit : « Les actions vont monter, achète maintenant. » Que faites-vous ?",
    r: [
      ["a", "J’achète vite, avant que les cours montent.", "C’est le réflexe le plus fréquent. Mais entre une annonce de taux et le cours d’une action, il manque plusieurs étapes. On les suit ensemble au chapitre 2.", false],
      ["b", "Je cherche d’abord ce que cette annonce change pour l’entreprise.", "C’est la bonne question : qui emprunte, à quelles conditions, pour faire quoi. C’est tout l’objet de cet atelier.", true]
    ]
  },
  chapitres: [
    { t: "Ce que mon argent achète", acq: "Je raisonne en pouvoir d’achat", desc: "Le montant affiché, l’inflation, la date à laquelle j’aurai besoin de l’argent.", e: [
      { t: "Plus d’argent, pas forcément plus riche", c: "Vous placez 100 000 F. Un an plus tard, vous avez 105 000 F. Vous avez gagné 5 000 F. Mais si les prix de ce que vous achetez ont monté pendant la même période, votre argent n’achète pas 5 % de choses en plus.",
        f: ["Le montant affiché : ce que dit votre relevé.", "Le pouvoir d’achat : ce que cet argent permet d’acheter.", "L’inflation : la hausse générale des prix. Elle ne décrit pas exactement votre panier : loyer, transport ou courses peuvent bouger autrement pour vous."],
        w: { consignes: 1, quiz: [
          ["Mon placement rapporte 5 % et les prix montent de 3 %.", ["Je suis 5 % plus riche","Mon gain réel est plus proche de 2 %, avant frais et impôts"], 1, "Le gain réel, c’est ce qui reste une fois la hausse des prix retirée, puis les frais et les impôts éventuels."],
          ["Un placement promet plus que tous les autres.", ["C’est forcément le meilleur","Le rendement plus élevé vient souvent avec plus de risque ou moins de disponibilité"], 1, "Rendement, risque et disponibilité vont ensemble. On ne regarde jamais le rendement seul."]
        ] },
        p: "Je fais la différence entre le montant affiché et le pouvoir d’achat." },
      { t: "Ma prochaine dépense importante", c: "Avant de comparer des placements, écrivez la date et le montant dont vous aurez besoin. Une dépense proche ne supporte pas une baisse au mauvais moment.",
        w: { ex: "Aya doit payer une formation de 350 000 F dans 12 mois. Elle ne cherche pas le placement le plus rémunérateur : elle cherche une solution dont elle connaît la valeur à cette date.", k: "Votre dépense", c3: 1, champs: [ {id:"ec_dep", l:"Montant de ma prochaine dépense importante (F)"}, {id:"ec_mois", l:"Dans combien de mois ?", ph:"12"}, {id:"ec_quoi", l:"Pour quoi ?", type:"txt", ph:"formation, loyer, rentrée, terrain"} ],
          v: function(D,H){ var m=H.N(D.ec_dep), n=H.N(D.ec_mois); if(!m||!n) return ''; if(n<=24) return '<div class="verdict v-mid">'+H.F(m)+' dans '+n+' mois : cet argent a une date proche. Il doit rester accessible, à une valeur que vous connaissez.</div>'; return '<div class="verdict v-ok">'+H.F(m)+' dans '+n+' mois : vous avez du temps. Vous pourrez accepter que la valeur bouge en chemin, si vous comprenez le risque.</div>'; } },
        p: "Ma prochaine dépense importante a un montant et une date." }
    ]},
    { t: "Les taux", acq: "Je suis le chemin d’une annonce de taux", desc: "BCEAO, crédit, entreprises, obligations.", e: [
      { t: "La BCEAO baisse ses taux. Et après ?", c: "Entre « la banque centrale baisse son taux » et « les actions vont monter », il manque plusieurs étapes.",
        f: ["La BCEAO fixe notamment les taux auxquels elle prête aux banques.", "Une baisse peut détendre les conditions de financement, sans rien garantir.", "Le taux de votre crédit dépend aussi de votre dossier, de la banque, des frais et du risque.", "Une entreprise ne devient pas plus rentable parce qu’un taux baisse : tout dépend de sa dette et de son activité."],
        w: { consignes: 1, quiz: [
          ["Une entreprise très endettée, quand le coût du crédit baisse…", ["peut voir ses charges financières diminuer","n’est jamais concernée"], 0, "Ses intérêts peuvent baisser à mesure qu’elle renouvelle ses emprunts. Encore faut-il le vérifier dans ses comptes."],
          ["Une entreprise qui a beaucoup de trésorerie et peu de dette…", ["réagit exactement comme la précédente","est moins sensible au coût du crédit"], 1, "Elle emprunte peu : la baisse des taux la touche autrement, parfois à peine."]
        ] },
        p: "Je sais qu’une annonce de taux est un signal, pas une décision." },
      { t: "Où je chercherai la réponse", c: "Avant d’acheter une action après une annonce de taux, cherchez la dette et les charges financières de l’entreprise dans ses comptes. Si vous ne savez pas encore les lire, votre prochaine action est d’apprendre à les repérer.",
        w: { champs: [ {id:"ec_ent", l:"L’entreprise qui m’intéresse", type:"txt", ph:"une société cotée à la BRVM"} ],
          puces: { id:"ec_ou", k:"Je chercherai sa dette et ses charges financières dans…", l:["Son rapport annuel","Ses états financiers publiés","Le communiqué de résultats","Je dois d’abord apprendre à les lire"] },
          v: function(D){ if(!D.ec_ou) return ''; if(D.ec_ou==='Je dois d’abord apprendre à les lire') return '<div class="verdict v-mid">C’est une bonne réponse : l’atelier « Lire une société cotée » vous apprend à trouver ces lignes.</div>'; return '<div class="verdict v-ok">Noté'+(D.ec_ent?' pour '+D.ec_ent:'')+'. Vous vérifierez avant d’agir.</div>'; } },
        p: "Je sais où chercher la dette d’une entreprise." },
      { t: "Quand les taux montent, l’obligation baisse", c: "Vous avez une obligation qui verse un intérêt fixé à l’avance. De nouvelles obligations arrivent avec un taux plus intéressant. Pour que la vôtre reste attractive, son prix de revente peut baisser.",
        f: ["Gardée jusqu’à l’échéance, et si l’émetteur paie, vous recevez les montants prévus au contrat.", "Vendue avant, son prix dépend du marché du moment. Il peut être inférieur à ce que vous avez payé.", "La vraie question : pouvez-vous attendre l’échéance ?"],
        w: { consignes: 1, quiz: [
          ["J’ai besoin de mon argent dans 18 mois. On me propose une obligation à 7 ans.", ["Je compare seulement les taux","Je demande d’abord comment la revendre, à quel prix et avec quels frais"], 1, "Si vous devez vendre avant l’échéance, c’est le prix du marché qui compte, pas le taux affiché."],
          ["Le mot « obligation » veut dire…", ["que ma mise est garantie en toutes circonstances","que c’est un prêt, avec un émetteur qui doit pouvoir payer"], 1, "Il faut regarder la solidité de l’émetteur, la durée et les frais."]
        ] },
        p: "Je sais pourquoi le prix d’une obligation bouge avec les taux." },
      { t: "Mon échéance face à celle du placement", c: "Comparez deux dates : celle où vous aurez besoin de l’argent, celle où le placement arrive à échéance.",
        w: { k: "Vos deux dates", c3: 1, champs: [ {id:"ec_besoin", l:"J’aurai besoin de cet argent dans (mois)"}, {id:"ec_ech", l:"Le placement arrive à échéance dans (mois)"} ],
          v: function(D,H){ var b=H.N(D.ec_besoin), e=H.N(D.ec_ech); if(!b||!e) return ''; if(e<=b) return '<div class="verdict v-ok">L’échéance arrive avant votre besoin : vous n’aurez pas à revendre au prix du moment.</div>'; return '<div class="verdict v-ko">Le placement dure '+(e-b)+' mois de plus que votre besoin. Il faudrait le revendre avant terme, au prix du marché. Demandez à quel prix et avec quels frais.</div>'; } },
        p: "J’ai comparé mon échéance et celle du placement." }
    ]},
    { t: "Croissance et matières premières", acq: "Je relie une tendance à une entreprise précise", desc: "La croissance du pays, le cacao, le pétrole.", e: [
      { t: "Le pays grandit. Mon action doit-elle monter ?", c: "La croissance d’un pays peut créer des occasions. Elle ne se répartit pas également entre les entreprises.",
        f: ["Une société peut gagner des clients et perdre de l’argent si ses coûts montent plus vite que ses ventes.", "Une autre peut être très rentable sans profiter du secteur qui tire la croissance.", "Si les investisseurs attendent déjà beaucoup de croissance, cette attente est peut-être déjà dans le cours."],
        w: { consignes: 1, champs: [ {id:"ec_tend", l:"La tendance que j’observe", type:"txt", ph:"routes, commerces, électricité, téléphonie"}, {id:"ec_tent", l:"L’entreprise qui pourrait en profiter", type:"txt"}, {id:"ec_tpq", l:"Parce que…", type:"area", ph:"nouveaux clients, volumes, prix, investissements"}, {id:"ec_tver", l:"Je vérifierai avec…", type:"txt", ph:"ses ventes et son bénéfice des deux dernières années"} ],
          v: function(D){ if(!D.ec_tent||!D.ec_tpq) return ''; return '<div class="verdict v-ok">Votre lien est écrit. Il reste à vérifier que le bénéfice suit les ventes.</div>'; } },
        p: "J’ai écrit un lien concret entre une tendance et une entreprise." },
      { t: "Le cacao monte. Qui gagne ?", c: "Un producteur, un transformateur, un exportateur, un fabricant de chocolat et un consommateur n’achètent ni ne vendent la même chose. La même hausse améliore les recettes de l’un et renchérit les coûts de l’autre.",
        f: ["Les contrats, les stocks, les prix fixés à l’avance et le moment de la vente changent encore le résultat.", "C’est vrai aussi du pétrole : une hausse aide certains producteurs et pèse sur ceux qui l’achètent.", "Suivez qui paie la matière première, qui la vend, et qui peut changer ses propres prix."],
        w: { consignes: 1, quiz: [
          ["Le prix du cacao monte. Pour un fabricant de chocolat…", ["c’est forcément une bonne nouvelle","c’est d’abord un coût qui augmente"], 1, "Il achète le cacao : sa marge dépend de sa capacité à répercuter la hausse sur ses prix."],
          ["Le prix du pétrole monte. Pour une entreprise de transport…", ["ses coûts de carburant peuvent augmenter","elle gagne plus, comme les producteurs"], 0, "Elle achète du carburant : la hausse pèse sur ses coûts."]
        ] },
        p: "Je sais qu’une même hausse fait des gagnants et des perdants." },
      { t: "Achat, vente, ou les deux ?", c: "Prenez une nouvelle sur le cacao ou le pétrole. Avant de chercher une action à acheter, écrivez deux noms : celui qui pourrait profiter de la hausse, celui dont les coûts pourraient augmenter.",
        w: { champs: [ {id:"ec_mpn", l:"La matière première", type:"txt", ph:"cacao, pétrole, caoutchouc, coton"}, {id:"ec_mpg", l:"Qui pourrait en profiter", type:"txt"}, {id:"ec_mpp", l:"Dont les coûts pourraient augmenter", type:"txt"} ],
          puces: { id:"ec_mpr", k:"Pour l’entreprise que je suis, cette matière première est surtout…", l:["Un achat","Une vente","Les deux"] },
          v: function(D){ var R={"Un achat":"Une hausse est d’abord un coût : regardez si elle peut monter ses prix.","Une vente":"Une hausse peut améliorer ses recettes : regardez ses contrats et ses stocks.","Les deux":"L’effet dépend de l’écart entre ce qu’elle achète et ce qu’elle vend : c’est sa marge qui compte."}[D.ec_mpr]; return R?'<div class="verdict v-ok">'+R+'</div>':''; } },
        p: "J’ai placé une entreprise du bon côté de la hausse." }
    ]},
    { t: "Lire une annonce", acq: "Je lis un communiqué avant de réagir", desc: "Ventes et bénéfice, résultats et attentes.", e: [
      { t: "Vendre plus, gagner moins", c: "Les ventes ne sont que le début de l’histoire. Il faut encore payer ce qui a permis de produire, de transporter, de financer et de vendre. Si les coûts ou les marges évoluent mal, le bénéfice peut baisser malgré des ventes en hausse.",
        f: ["Les volumes ont-ils augmenté ?", "Les prix ont-ils changé ?", "Que devient la marge ?", "Que reste-t-il après les charges ?"],
        w: { consignes: 1, ex: "Exemple fictif : une raffinerie vend 10 % de produits en plus. Mais l’écart entre le prix du pétrole brut qu’elle achète et le prix des carburants qu’elle vend s’est réduit. Son bénéfice net recule fortement.", k: "Votre lecture", c3: 1, champs: [ {id:"ec_lent", l:"L’entreprise", type:"txt"}, {id:"ec_lv", l:"Évolution des ventes (%)", ph:"10"}, {id:"ec_lb", l:"Évolution du bénéfice net (%)", ph:"-30"} ],
          v: function(D,H){ if(D.ec_lv===undefined||D.ec_lv===''||D.ec_lb===undefined||D.ec_lb==='') return ''; var v=H.N(D.ec_lv), b=H.N(D.ec_lb); if(v>0&&b<0) return '<div class="verdict v-mid">Ventes en hausse, bénéfice en baisse : cherchez du côté de la marge, des coûts ou de la dette.</div>'; if(v<0&&b>0) return '<div class="verdict v-mid">Ventes en baisse, bénéfice en hausse : l’entreprise a peut-être réduit ses coûts, ou vendu un actif. Vérifiez si cela peut durer.</div>'; return '<div class="verdict v-ok">Ventes et bénéfice vont dans le même sens. Regardez maintenant de combien la marge a bougé.</div>'; } },
        p: "Je regarde le bénéfice, pas seulement les ventes." },
      { t: "La bonne nouvelle que le marché attendait", c: "Une entreprise publie de bons résultats, et son action baisse le jour même. Les investisseurs achètent aussi des attentes : si beaucoup espéraient mieux, un bon résultat peut décevoir.",
        f: ["Ce que l’entreprise a réellement publié.", "Ce qui était attendu.", "Le prix payé pour détenir l’action.", "« L’entreprise est bonne » et « son action est intéressante à ce prix » sont deux questions différentes."],
        w: { consignes: 1, quiz: [
          ["L’action baisse après de bons résultats.", ["Les résultats sont donc mauvais","Je lis le communiqué avant de conclure"], 1, "Résistez aux deux automatismes : « elle baisse, donc c’est mauvais » et « elle baisse, donc c’est une affaire »."]
        ], champs: [ {id:"ec_avant", l:"Ce que je savais avant l’annonce", type:"area"}, {id:"ec_appris", l:"Ce que j’ai appris en lisant le communiqué", type:"area"} ] },
        p: "Je lis l’annonce avant de réagir au cours." }
    ]},
    { t: "Mon tableau de bord", acq: "J’ai mon tableau de bord personnel", desc: "Mon argent classé par échéance, et cinq questions avant d’agir.", e: [
      { t: "Mon argent n’avance pas au rythme de l’économie", c: "Votre dépense a une date. L’économie, elle, n’a pas promis de vous donner raison avant cette date. Classez d’abord votre argent selon son échéance, avant de comparer des produits.",
        w: { ex: "Koffi a 1 500 000 F : 400 000 F pour le loyer et la rentrée dans l’année, 600 000 F de réserve, et 500 000 F qu’il peut laisser plusieurs années.", k: "Votre classement", c3: 1, champs: [ {id:"ec_c1", l:"À utiliser dans les 12 mois (F)"}, {id:"ec_c2", l:"Ma réserve pour les imprévus (F)"}, {id:"ec_c3", l:"Ce que je peux laisser investi longtemps (F)"} ],
          v: function(D,H){ var a=H.N(D.ec_c1), b=H.N(D.ec_c2), c=H.N(D.ec_c3), t=a+b+c; if(!t) return ''; return '<div class="gros"><small>Sur '+H.F(t)+'</small><b>'+Math.round(c/t*100)+' % de long terme</b><p>'+H.F(a)+' bientôt · '+H.F(b)+' en réserve · '+H.F(c)+' pour le long terme. Seule la dernière part peut supporter que la valeur baisse en chemin.</p></div>'; } },
        p: "Mon argent est classé selon son échéance." },
      { t: "Cinq questions avant d’agir", c: "Un tableau de bord ne prédit pas demain. Il vous aide à voir ce qui a changé depuis votre dernière décision. Choisissez une entreprise ou un placement que vous suivez, et répondez en une ligne.",
        w: { consignes: 1, champs: [ {id:"ec_q0", l:"L’entreprise ou le placement que je suis", type:"txt"}, {id:"ec_q1", l:"1. Les prix des dépenses qui comptent pour moi changent-ils ?", type:"txt"}, {id:"ec_q2", l:"2. Les conditions de crédit changent-elles, pour moi ou pour cette entreprise ?", type:"txt"}, {id:"ec_q3", l:"3. Ses ventes et son bénéfice progressent-ils ensemble ?", type:"txt"}, {id:"ec_q4", l:"4. À quel prix le marché me propose-t-il d’en devenir actionnaire ?", type:"txt"}, {id:"ec_q5", l:"5. Quand aurai-je besoin de récupérer mon argent ?", type:"txt"} ],
          v: function(D){ var n=['ec_q1','ec_q2','ec_q3','ec_q4','ec_q5'].filter(function(k){ return D[k]; }).length; if(!n) return ''; return n===5?'<div class="verdict v-ok">Vos cinq réponses sont écrites. Revenez-y avant chaque décision.</div>':'<div class="verdict v-mid">'+n+' réponses sur 5. Pour celles qui manquent, écrivez où vous irez chercher l’information avant d’agir.</div>'; } },
        f: ["Le contexte économique : les publications de la BCEAO.", "Les résultats et les cours : les entreprises cotées et la BRVM.", "Les acteurs et les documents du marché : l’AMF-UMOA."],
        p: "Mes cinq questions sont écrites." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Ce que je surveille avant d’investir »", titre: "Vous lisez l’actualité avec vos propres questions",
    fiche: [
      ["Ma prochaine dépense importante", function(D,H){ var m=H.N(D.ec_dep); return m?H.F(m)+(D.ec_mois?' dans '+D.ec_mois+' mois':'')+(D.ec_quoi?' · '+D.ec_quoi:''):''; }],
      ["Où je chercherai la dette de l’entreprise", function(D){ return (D.ec_ent?D.ec_ent+' · ':'')+(D.ec_ou||''); }],
      ["La tendance que je suis", function(D){ return D.ec_tent?(D.ec_tend?D.ec_tend+' → ':'')+D.ec_tent+(D.ec_tver?' · je vérifierai avec '+D.ec_tver:''):''; }],
      ["Matière première", function(D){ return D.ec_mpn?D.ec_mpn+(D.ec_mpr?' · '+D.ec_mpr.toLowerCase():''):''; }],
      ["Mon argent par échéance", function(D,H){ var a=H.N(D.ec_c1), b=H.N(D.ec_c2), c=H.N(D.ec_c3); return (a+b+c)?H.F(a)+' bientôt · '+H.F(b)+' en réserve · '+H.F(c)+' long terme':''; }],
      ["Ce que je suis", function(D){ return D.ec_q0||''; }],
      ["Mes cinq réponses", function(D){ return ['ec_q1','ec_q2','ec_q3','ec_q4','ec_q5'].map(function(k,i){ return D[k]?(i+1)+'. '+D[k]:''; }).filter(Boolean).join(' · '); }]
    ],
    suite: { t: "Lire une société cotée", p: "Vous savez quelles questions poser. L’atelier suivant vous apprend à trouver les réponses dans les comptes d’une entreprise cotée à la Bourse régionale (BRVM).", lien: "atelier-lire-societe-cotee.html", b: "Ouvrir l’atelier" }
  }
};
