/* Atelier guidé · Épargner ne suffit pas : que faire de l'argent qui reste ? (17 nov. 2026)
   Inflation UEMOA : 3,5 % en 2024, 0,0 % en 2025 (BCEAO). BRVM Composite : +0,46 % en 2022, +25,26 % en 2025 (BRVM).
   Personnages et montants : exercices. Résultat : « Trois montants, trois dates, une prochaine action ». */
window.ATELIER = {
  id: "epargner-ne-suffit-pas",
  titre: "Épargner ne suffit pas : que faire de l’argent qui reste ?",
  h1: "Décider ce que votre épargne doit rendre possible.",
  voix: "auto",
  question: {
    t: "Vous mettez 25 000 F de côté chaque mois. Au bout d’un an, vous avez 300 000 F. Et ensuite ?",
    r: [
      ["a", "Je cherche le meilleur placement pour les 300 000 F.", "Pas si vite : une partie a peut-être déjà une mission, une dépense proche ou un imprévu. On commence par là.", false],
      ["b", "Je regarde d’abord à quoi doit servir chaque partie.", "C’est la bonne décision. Cet atelier vous aide à donner trois missions à votre argent.", true]
    ]
  },
  chapitres: [
    { t: "Épargner, puis décider", acq: "Je sépare ce qui doit rester disponible de ce qui peut travailler", desc: "Épargner répond à une question, investir en pose une autre. Une somme, une mission.", e: [
      { t: "Épargner répond à une question. Investir en pose une autre.", c: "Mettre 300 000 F de côté, c’est déjà un accomplissement : vous avez réussi à ne pas tout dépenser. Épargner, c’est ne pas consommer aujourd’hui une part de son argent. Investir, c’est engager une somme dans un actif ou un projet en espérant un résultat futur, avec des conditions et des risques.",
        f: ["Les deux gestes se suivent souvent, mais n’ont pas la même fonction.", "Une somme gardée sans objectif ne dit pas combien garder disponible, combien utiliser bientôt, combien placer plus longtemps.", "Investir n’est pas seulement acheter une action : une formation utile ou un outil pour son activité peut aussi être un investissement."],
        w: { consignes: 1, quiz: [
          ["Awa paiera 180 000 F de formation dans six mois. Elle place tout dans un actif dont le prix peut baisser. Où est l’erreur ?", ["Avoir investi","Avoir donné à la même somme deux missions incompatibles"], 1, "Si le prix baisse au moment de la formation, elle devra vendre au mauvais moment pour une dépense qu’elle connaissait déjà."]
        ] },
        p: "Je sais qu’épargner et investir n’ont pas la même fonction." },
      { t: "Une somme, plusieurs missions", c: "Awa a 300 000 F. Elle paiera 180 000 F de formation dans six mois et veut garder 100 000 F pour les imprévus. Il ne reste que 20 000 F à étudier pour un placement plus long.",
        w: { ex: "300 000 − 180 000 (formation) − 100 000 (réserve) = 20 000 F à étudier séparément. Les 280 000 F ont déjà un travail.", k: "Votre épargne", c3: 1, champs: [ {id:"es_tot", l:"Ce que j’ai de côté (F)"}, {id:"es_12", l:"Dépenses prévues dans les 12 mois (F)"}, {id:"es_res", l:"Ma réserve pour imprévus (F)"} ],
          v: function(D,H){ var t=H.N(D.es_tot); if(!t) return ''; var r=t-H.N(D.es_12)-H.N(D.es_res); return r>0?'<div class="gros"><small>Ce qui peut travailler plus longtemps</small><b>'+H.F(r)+'</b><p>Le reste a déjà une mission. Cette somme-là fera l’objet d’une décision à part.</p></div>':'<div class="verdict v-ko">Tout votre argent a déjà une mission. La prochaine étape : compléter la réserve, pas investir.</div>'; } },
        p: "Je sais quelle part de mon épargne peut travailler plus longtemps." }
    ]},
    { t: "Le temps et les prix", acq: "Je mesure la perte de pouvoir d’achat et la force de la régularité", desc: "L’argent immobile peut perdre en pouvoir d’achat. Sur dix ans, la régularité construit la somme.", e: [
      { t: "L’argent immobile peut perdre du pouvoir d’achat", c: "Une dépense coûte 100 000 F aujourd’hui. Si son prix monte de 4 % en un an (exemple d’exercice), il faudra 104 000 F. Avec 100 000 F gardés, vous n’avez perdu aucun billet, mais une partie de ce qu’ils achètent. Dans l’UEMOA, selon la BCEAO, l’inflation moyenne a été de 3,5 % en 2024 et de 0,0 % en 2025.",
        f: ["Les chiffres changent selon la période, et votre panier peut évoluer autrement que la moyenne.", "Cela ne veut pas dire que toute votre réserve doit être investie.", "La disponibilité a aussi une valeur : payer une urgence sans vendre un placement au mauvais moment."],
        w: { consignes: 1, k: "Votre calcul", c3: 1, champs: [ {id:"es_m", l:"Somme gardée (F)"}, {id:"es_i", l:"Hausse des prix sur un an (%)"} ],
          v: function(D,H){ var m=H.N(D.es_m), i=parseFloat(String(D.es_i||'').replace(',','.')); if(!m||!i) return ''; var b=Math.round(m*(1+i/100)), p=Math.round(m/(1+i/100)); return '<div class="gros"><small>Dans un an, il faudra</small><b>'+H.F(b)+'</b><p>Vos '+H.F(m)+' n’achèteront plus que l’équivalent de '+H.F(p)+' d’aujourd’hui.</p></div>'; } },
        p: "Je sais que garder n’est pas gratuit, et que la disponibilité a une valeur." },
      { t: "Sur dix ans, la régularité construit la somme de départ", c: "Serge met 25 000 F de côté chaque mois. En dix ans, s’il tient ce rythme, ses versements font 25 000 × 12 × 10 = 3 000 000 F. Ce chiffre ne suppose aucun rendement. S’il investit une partie, le résultat dépendra des actifs, des dates d’achat, des frais et du marché : le BRVM Composite a gagné 25,26 % en 2025, mais seulement 0,46 % en 2022.",
        w: { k: "Votre rythme", c3: 1, champs: [ {id:"es_v", l:"Je peux mettre de côté chaque mois (F)"}, {id:"es_a", l:"Pendant (années)"} ],
          quiz: [ ["Une simulation à 10 % par an donne 5 millions. Que vaut ce chiffre ?", ["La somme que j’obtiendrai","Un scénario pour comparer, jamais une promesse"], 1, "On ne transforme pas la performance d’une bonne année en rendement promis pour les dix suivantes. Votre discipline porte sur le montant versé et la durée."] ],
          v: function(D,H){ var v=H.N(D.es_v), a=H.N(D.es_a); if(!v||!a) return ''; return '<div class="gros"><small>Vos versements, sans aucun rendement</small><b>'+H.F(v*12*a)+'</b><p>'+(v*12*a)/v+' versements de '+H.F(v)+'. Ce chiffre est certain si vous les faites tous.</p></div>'; } },
        p: "Je connais la somme que ma régularité construit." }
    ]},
    { t: "Trois missions", acq: "J’ai trois montants, trois dates et une prochaine action", desc: "Disponible, projet daté, long terme. Puis une seule action.", e: [
      { t: "Quand l’épargne seule suffit-elle ?", c: "« Épargner ne suffit pas » invite à donner une direction à son argent. Ce n’est pas une règle qui obligerait à investir chaque franc. L’épargne disponible est exactement ce qu’il faut pour le loyer du mois prochain, une dépense médicale imprévue ou du matériel à acheter dans quatre mois.",
        f: ["Ce qui doit rester disponible : dépenses proches et imprévus.", "Ce qui finance un projet daté : formation, équipement, logement…", "Ce qui peut travailler plus longtemps : la somme que vous pouvez engager sans compromettre les deux premières."],
        w: { consignes: 1, quiz: [
          ["Koffi achètera du matériel dans quatre mois. Faut-il placer cet argent sur un actif qui varie ?", ["Oui, pour le faire fructifier","Non, il doit rester disponible à la date prévue"], 1, "Placer une somme proche sur un actif qui varie ne rend pas la situation plus solide."]
        ] },
        p: "Je connais les trois missions de mon argent." },
      { t: "Votre décision EFA", c: "Prenez la somme que vous avez de côté, même petite. Donnez à chaque partie un montant, une date et une mission. Ce qui compte n’est pas seulement de faire rester l’argent, c’est de décider ce qu’il doit rendre possible.",
        w: { champs: [ {id:"es_d1", l:"Disponible : montant et date", type:"txt", ph:"120 000 F, toujours"}, {id:"es_d2", l:"Projet daté : montant, date, projet", type:"txt", ph:"180 000 F, mars 2027, formation"}, {id:"es_d3", l:"Long terme : montant", type:"txt", ph:"20 000 F, à étudier"} ],
          puces: { id:"es_act", k:"Ma prochaine action", l:["Compléter ma réserve","Financer mon projet proche","Étudier un investissement précis"] },
          v: function(D,H){ return D.es_act?'<div class="verdict v-ok">'+H.esc(D.es_act)+' : c’est votre prochaine action. Elle est dans votre fiche.</div>':''; } },
        p: "Trois montants, trois dates, une prochaine action." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Les trois missions de mon argent »", titre: "Votre épargne a une direction",
    fiche: [
      ["Ce qui peut travailler plus longtemps", function(D,H){ var t=H.N(D.es_tot); if(!t) return ''; var r=t-H.N(D.es_12)-H.N(D.es_res); return r>0?H.F(r):'Rien pour l’instant : réserve d’abord'; }],
      ["Mes versements sur la durée", function(D,H){ var v=H.N(D.es_v), a=H.N(D.es_a); return v&&a?H.F(v*12*a)+' en '+a+' ans':''; }],
      ["Disponible", function(D){ return D.es_d1||''; }],
      ["Projet daté", function(D){ return D.es_d2||''; }],
      ["Long terme", function(D){ return D.es_d3||''; }],
      ["Ma prochaine action", function(D){ return D.es_act||''; }]
    ],
    suite: { t: "Où placer une somme dont j’aurai besoin dans 6 mois, 2 ans ou 5 ans ?", p: "Chaque somme a sa date. L’atelier suivant vous montre où la placer selon cette date.", lien: "atelier-placer-selon-horizon.html", b: "Ouvrir l’atelier" }
  }
};
