/* Atelier guidé · Lire les états financiers d'une entreprise cotée (17 nov. 2026)
   Fil rouge : une brasserie cotée FICTIVE (chiffres repris d'un exemple de cours, non vérifiés sur une société réelle).
   Exercice final : appliquer la méthode aux états financiers publiés d'une société cotée à la BRVM (ex. SOLIBRA, exercice 2025,
   publiés au BOC du 19 mai 2026). Résultat : « Ma fiche d'analyse d'une entreprise ». */
window.ATELIER = {
  id: "etats-financiers",
  titre: "Lire les états financiers d’une entreprise cotée",
  h1: "Ce qu’une entreprise gagne, possède et encaisse : trois documents.",
  voix: "auto",
  question: {
    t: "Une entreprise annonce 45,8 milliards de F de bénéfice. Les a-t-elle sur son compte en banque ?",
    r: [
      ["a", "Oui, c’est ce qu’elle a gagné.", "Pas forcément. Le bénéfice mesure un résultat sur une année, pas l’argent disponible. Dans notre exemple, la trésorerie n’est que de 22,5 milliards. On voit pourquoi au chapitre 1.", false],
      ["b", "Pas forcément : bénéfice et trésorerie sont deux choses.", "Exactement. Cet atelier vous apprend à ouvrir le bon document pour chaque question.", true]
    ]
  },
  chapitres: [
    { t: "Ce qu’elle gagne", acq: "Je sais quel document ouvrir et je lis une marge", desc: "Compte de résultat, bilan, tableau des flux. Vendre plus ne dit pas combien il reste.", e: [
      { t: "Trois documents, trois questions", c: "Notre fil rouge : une brasserie cotée fictive. En 2025, elle annonce 45,8 milliards de F de bénéfice net. À la clôture, la trésorerie de son bilan n’est que de 22,5 milliards. Ces chiffres diffèrent parce qu’ils ne mesurent pas la même chose : une vente peut être comptée avant d’être encaissée, et l’entreprise a pu acheter des équipements ou rembourser une dette.",
        f: ["L’activité a-t-elle été rentable cette année ? Le compte de résultat.", "Que possède et que doit l’entreprise à la clôture ? Le bilan, une photographie à une date.", "Comment l’argent a-t-il circulé pendant l’année ? Le tableau des flux de trésorerie."],
        w: { consignes: 1, quiz: [
          ["Vous voulez savoir si l’entreprise pourra payer ses fournisseurs le mois prochain. Quel document ouvrez-vous d’abord ?", ["Le compte de résultat","Le bilan et le tableau des flux"], 1, "La rentabilité de l’année ne dit pas l’argent disponible. La trésorerie se lit au bilan, et son évolution dans le tableau des flux."]
        ] },
        p: "Je sais que bénéfice, trésorerie et patrimoine sont trois chiffres différents." },
      { t: "Elle vend plus. Combien lui reste-t-il ?", c: "Notre brasserie fictive passe de 309,7 à 378,1 milliards de F de chiffre d’affaires et autres produits, environ +22 %. Son résultat d’exploitation passe de 34,7 à 65,2 milliards, son bénéfice net de 21,5 à 45,8 milliards. Ses charges financières baissent de 4,3 à 1,9 milliard. Le lecteur des comptes demande : qu’est-ce qui lui a permis de garder plus sur chaque franc ?",
        w: { ex: "Sur 100 F d’activité, le bénéfice net représentait environ 7 F la première année (21,5 ÷ 309,7) et 12 F la seconde (45,8 ÷ 378,1). C’est plus parlant que « bénéfice : +113 % ».", k: "Vos chiffres, en milliards de F", champs: [ {id:"ef_ca0", l:"Chiffre d’affaires, année 1"}, {id:"ef_bn0", l:"Bénéfice net, année 1"}, {id:"ef_ca1", l:"Chiffre d’affaires, année 2"}, {id:"ef_bn1", l:"Bénéfice net, année 2"} ],
          v: function(D,H){ var c0=H.N(D.ef_ca0), b0=H.N(D.ef_bn0), c1=H.N(D.ef_ca1), b1=H.N(D.ef_bn1); if(!c0||!b0) return ''; var m0=b0/c0*100; if(!c1||!b1) return '<div class="gros"><small>Marge nette, année 1</small><b>'+m0.toFixed(1).replace('.',',')+' F sur 100 F</b></div>'; var m1=b1/c1*100;
            return '<div class="gros"><small>Bénéfice net pour 100 F d’activité</small><b>'+m0.toFixed(1).replace('.',',')+' F → '+m1.toFixed(1).replace('.',',')+' F</b><p>Ventes '+(c1>=c0?'+':'')+Math.round((c1/c0-1)*100)+' %, bénéfice '+(b1>=b0?'+':'')+Math.round((b1/b0-1)*100)+' %. '+(m1>m0?'L’entreprise garde plus sur chaque franc : cherchez pourquoi, et si cela peut durer.':'L’entreprise garde moins sur chaque franc : regardez ses coûts.')+'</p></div>'; } },
        p: "Je lis une marge, pas seulement une hausse de bénéfice." }
    ]},
    { t: "Ce qu’elle possède et encaisse", acq: "Je lis un bilan et je vérifie que le bénéfice devient de l’argent", desc: "Un actif n’est pas de l’argent disponible. Les flux disent ce qui a été encaissé et utilisé.", e: [
      { t: "Le bilan : ce qu’elle possède et ce qu’elle doit", c: "À la clôture, le bilan de notre brasserie fictive totalise 339,5 milliards de F à l’actif : usines, stocks, sommes dues par les clients, trésorerie. Le passif explique comment c’est financé : 195,1 milliards de capitaux propres, et des dettes. Les capitaux propres ne sont pas un coffre de billets : c’est une valeur comptable.",
        f: ["Les stocks passent de 80,7 à 82,7 milliards.", "Les créances clients passent de 55,7 à 66,6 milliards : la croissance des ventes peut l’expliquer, mais quand les clients paieront-ils ?", "« Actif : 339,5 milliards » ne veut pas dire « elle peut dépenser 339,5 milliards demain ». Une usine, un stock et une créance ne deviennent pas tout de suite de l’argent."],
        w: { consignes: 1, quiz: [
          ["Les ventes montent de 22 %, les créances clients de 20 %. Que vérifiez-vous ?", ["Rien, c’est normal","Quand les clients paient, et si les retards s’allongent"], 1, "Une hausse des créances peut accompagner la croissance. Elle invite à vérifier que les ventes se transforment bien en argent."]
        ] },
        p: "Je sais qu’un actif n’est pas de l’argent disponible." },
      { t: "Le bénéfice est-il devenu de l’argent ?", c: "Dans le tableau des flux de notre brasserie fictive, la capacité d’autofinancement est de 69,9 milliards de F. Elle a consacré 23,0 milliards à des équipements et versé 20,1 milliards de dividendes. Ces lignes répondent à une question que le bénéfice ne règle pas : qu’a fait l’entreprise des ressources produites ?",
        w: { k: "Classez l’effet sur la trésorerie de l’année", puces: [ { id:"ef_div", k:"Dividendes versés", l:["Fait sortir de l’argent","Fait entrer de l’argent"] }, { id:"ef_inv", k:"Achats d’équipements", l:["Fait sortir de l’argent","Fait entrer de l’argent"] }, { id:"ef_remb", k:"Remboursement de dettes financières", l:["Fait sortir de l’argent","Fait entrer de l’argent"] } ],
          v: function(D){ var k=['ef_div','ef_inv','ef_remb'], n=k.filter(function(x){return D[x];}).length; if(n<3) return ''; var ok=k.every(function(x){return D[x]==='Fait sortir de l’argent';}); return ok?'<div class="verdict v-ok">Juste : les trois font sortir de la trésorerie. Chacun peut être un bon choix ; il faut comprendre comment l’ensemble est financé.</div>':'<div class="verdict v-ko">Relisez : dividendes, équipements et remboursements utilisent tous les trois de la trésorerie.</div>'; } },
        p: "Je sais ce que l’entreprise a fait de l’argent produit." }
    ]},
    { t: "Juger, et ma fiche", acq: "Je pose les bonnes questions et j’analyse une vraie société", desc: "Dette, trésorerie, dividende proposé ou versé. Puis votre fiche sur une société cotée.", e: [
      { t: "Dette, trésorerie et dividende", c: "Dans notre exemple, les dettes financières passent de 51,0 à 46,4 milliards de F, et la trésorerie de 4,7 à 22,5 milliards : deux évolutions favorables, à lire ensemble, sans conclure que l’entreprise n’a plus de contrainte. Les états financiers présentent aussi un projet de dividende d’environ 35 milliards, pas encore approuvé par l’assemblée générale. Un projet n’est pas un paiement reçu.",
        f: ["La distribution a-t-elle été approuvée ?", "Quelle somme revient par action, et à quelle date ?", "Après la distribution, l’entreprise garde-t-elle les moyens de financer son activité ?", "Le total distribué ne dit pas ce que vous recevrez : il faut le dividende par action et votre nombre d’actions."],
        w: { consignes: 1, k: "Votre dividende", c3: 1, champs: [ {id:"ef_dpa", l:"Dividende par action annoncé (F)"}, {id:"ef_nb", l:"Mes actions"} ],
          v: function(D,H){ var d=H.N(D.ef_dpa), n=H.N(D.ef_nb); if(!d||!n) return ''; return '<div class="gros"><small>Dividende brut pour vous, s’il est approuvé et versé</small><b>'+H.F(d*n)+'</b><p>Avant retenues fiscales éventuelles. Je ne confonds plus bénéfice réalisé, dividende proposé et dividende versé.</p></div>'; } },
        p: "Je distingue dividende proposé et dividende versé." },
      { t: "Votre première fiche d’analyse", c: "Appliquez la méthode à une vraie société cotée à la BRVM. Par exemple SOLIBRA : ses états financiers de l’exercice 2025 ont été publiés au Bulletin officiel de la cote le 19 mai 2026. Ouvrez-les, retrouvez vous-même les chiffres, puis remplissez la fiche. Lire les comptes ne donne pas une réponse automatique à « faut-il acheter ? » : il faudrait aussi le prix de l’action, les résultats récents, les perspectives et les frais.",
        w: { champs: [ {id:"ef_soc", l:"La société et son activité", type:"txt"}, {id:"ef_ventes", l:"Évolution de ses ventes sur deux ans", type:"txt"}, {id:"ef_rex", l:"Évolution de son résultat d’exploitation", type:"txt"}, {id:"ef_bn", l:"Évolution de son bénéfice net", type:"txt"}, {id:"ef_bil", l:"Un changement important dans son bilan", type:"txt"}, {id:"ef_treso", l:"Un usage important de sa trésorerie", type:"txt"}, {id:"ef_q", l:"Une question que les comptes ne résolvent pas", type:"txt"}, {id:"ef_phrase", l:"Ce qu’elle a réussi… Le chiffre que je veux surveiller… Ce qu’il me manque avant d’envisager l’action…", type:"area"} ],
          v: function(D){ return D.ef_phrase?'<div class="verdict v-ok">Votre fiche d’entreprise est construite à partir de comptes publiés. Elle est dans votre cahier.</div>':''; } },
        p: "Ma fiche d’analyse est remplie sur une vraie société." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Analyse d’une entreprise »", titre: "Vous posez des questions précises avant de risquer votre argent",
    fiche: [
      ["Société", function(D){ return D.ef_soc||''; }],
      ["Ventes", function(D){ return D.ef_ventes||''; }],
      ["Résultat d’exploitation", function(D){ return D.ef_rex||''; }],
      ["Bénéfice net", function(D){ return D.ef_bn||''; }],
      ["Bilan", function(D){ return D.ef_bil||''; }],
      ["Trésorerie", function(D){ return D.ef_treso||''; }],
      ["Question ouverte", function(D){ return D.ef_q||''; }],
      ["Mon jugement", function(D){ return D.ef_phrase||''; }]
    ],
    suite: { t: "Lire une société cotée comme un investisseur", p: "Vous savez lire les comptes. L’atelier suivant relie résultats, dividende et cours de Bourse.", lien: "atelier-lire-societe-cotee.html", b: "Ouvrir l’atelier" }
  }
};
