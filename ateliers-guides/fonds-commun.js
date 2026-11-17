/* Atelier guidé · Comment fonctionne un fonds commun de placement ? (17 nov. 2026)
   FCP / OPC de l'UMOA. Capitalisation BRVM fin 2025 : bilan 2025 de la BRVM (24 781 Md F au total).
   Valeurs de part : exemples, pas des performances réelles. Résultat : « Ma fiche de comparaison de fonds ». */
window.ATELIER = {
  id: "fonds-commun",
  titre: "Comment fonctionne un fonds commun de placement ?",
  h1: "Confier la sélection à des professionnels, sans fermer les yeux.",
  voix: "auto",
  question: {
    t: "Un fonds est « géré par des professionnels ». Votre résultat est-il garanti ?",
    r: [
      ["a", "Oui, des experts s’en occupent.", "Des professionnels choisissent les titres, mais la valeur de vos parts peut baisser. On voit pourquoi, et ce qu’il faut vérifier.", false],
      ["b", "Non : il faut savoir ce que le fonds achète et comment en sortir.", "Exactement. Cet atelier vous donne les six questions qui changent votre choix.", true]
    ]
  },
  chapitres: [
    { t: "Plusieurs épargnants, un portefeuille", acq: "Je sais ce que je possède dans un fonds et ce que valent mes parts", desc: "Des parts d’un ensemble, pas une action précise. La valeur liquidative bouge.", e: [
      { t: "Plusieurs épargnants, un portefeuille", c: "Imaginez 1 000 personnes qui versent chacune 20 000 F : ensemble, 20 millions de F. Le fonds investit cette somme selon une politique annoncée : obligations, actions, ou un mélange. Chacun détient des parts du fonds, c’est-à-dire une fraction de l’ensemble.",
        f: ["Dans l’UMOA, les fonds communs de placement (FCP) font partie des organismes de placement collectif.", "La gestion collective donne accès à un portefeuille diversifié.", "Avant de souscrire, il faut lire le prospectus : frais, risques, conditions de rachat."],
        w: { consignes: 1, quiz: [
          ["Le fonds détient des actions d’une grande banque. En êtes-vous actionnaire ?", ["Oui, directement","Non, je possède des parts du fonds, qui détient ces actions"], 1, "Vous possédez une fraction de l’ensemble, gérée selon les règles du fonds. Vous ne choisissez pas, et ne détenez pas, une action précise."]
        ] },
        p: "Je sais que je détiens des parts d’un ensemble." },
      { t: "Que valent vos parts ?", c: "Awa investit 100 000 F. Ce jour-là, une part vaut 10 000 F : elle obtient 10 parts, avant frais d’entrée. Si la part monte à 10 800 F, ses parts valent 108 000 F. Si elle descend à 9 200 F, elles valent 92 000 F. Cette valeur de part s’appelle la valeur liquidative.",
        w: { ex: "Les chiffres d’Awa illustrent le mécanisme : ce ne sont pas les performances d’un fonds réel. Une hausse affichée de 8 000 F n’est pas forcément 8 000 F encaissés après frais.", k: "Votre exercice", champs: [ {id:"fc_mise", l:"Somme investie (F)"}, {id:"fc_vl0", l:"Valeur d’une part à l’achat (F)"}, {id:"fc_fe", l:"Frais d’entrée (%)", ph:"0"}, {id:"fc_vl1", l:"Valeur d’une part plus tard (F)"} ],
          v: function(D,H){ var m=H.N(D.fc_mise), v0=H.N(D.fc_vl0); if(!m||!v0) return ''; var net=m*(1-H.N(D.fc_fe)/100), parts=net/v0, v1=H.N(D.fc_vl1); var pt=parts.toFixed(2).replace('.',',').replace(/,00$/,'');
            if(!v1) return '<div class="gros"><small>Parts obtenues</small><b>'+pt+' parts</b><p>Ajoutez une valeur de part future pour voir la variation.</p></div>';
            var val=Math.round(parts*v1), e=val-m; return '<div class="gros"><small>'+pt+' parts · valeur et variation par rapport à votre mise</small><b>'+H.F(val)+' · '+(e>=0?'+':'−')+H.F(Math.abs(e))+'</b><p>Avant d’éventuels frais de sortie. Demandez ce que vous recevriez réellement en cas de rachat.</p></div>'; } },
        p: "Je calcule la valeur de mes parts, frais compris." }
    ]},
    { t: "Le risque et la sortie", acq: "Je sais ce qui fait bouger un fonds et quand je récupère mon argent", desc: "Un fonds obligataire n’est pas stable par nature. Le rachat suit un calendrier.", e: [
      { t: "« Le fonds détient des obligations » : sa part reste-t-elle stable ?", c: "Pas nécessairement. Le prix des obligations peut varier avant leur remboursement, si les taux changent ou si un émetteur va moins bien. Un fonds actions ne devient pas insensible à une baisse générale de la Bourse. Fin 2025, la BRVM pesait environ 24 781 milliards de F, actions et obligations réunies : c’est l’échelle du marché, pas la composition d’un fonds.",
        f: ["Deux fonds « obligataires » peuvent détenir des titres de durées différentes.", "Deux fonds « actions » peuvent investir dans des secteurs différents.", "La question à poser : dans quoi ce fonds a-t-il le droit de placer mon argent ?", "Un fonds vous fait gagner du temps contre des frais. Regardez toujours ses résultats après frais."],
        w: { consignes: 1, quiz: [
          ["La diversification d’un fonds efface-t-elle le risque de baisse ?", ["Oui, avec assez de titres","Non, plusieurs titres peuvent baisser ensemble"], 1, "Diversifier réduit la dépendance à un seul titre. Lors d’une baisse générale, la plupart des titres peuvent reculer en même temps."]
        ] },
        p: "Je regarde ce que le fonds a le droit d’acheter, pas son nom." },
      { t: "Pouvez-vous récupérer l’argent quand vous voulez ?", c: "Fatou place une somme dans un fonds alors qu’elle doit payer une formation dans trois mois. Au moment du rachat, elle découvre un calendrier, et une valeur de part en baisse. Elle avait confondu deux idées : pouvoir demander le rachat, et récupérer immédiatement exactement la somme investie.",
        w: { k: "Mon projet et les règles du fonds", champs: [ {id:"fc_besoin", l:"J’aurai besoin de cet argent dans (jours)"}, {id:"fc_delai", l:"Délai de rachat annoncé par le fonds (jours)"}, {id:"fc_fs", l:"Frais de sortie annoncés", type:"txt", ph:"0 %, 1 %…"} ],
          v: function(D,H){ var b=H.N(D.fc_besoin), d=H.N(D.fc_delai); if(!b||!d) return ''; return d<b?'<div class="verdict v-ok">Le délai de rachat est compatible avec votre date. Reste un risque : la valeur de la part peut avoir baissé ce jour-là.</div>':'<div class="verdict v-ko">Le rachat prendrait trop de temps pour votre date. Gardez cette somme disponible ailleurs.</div>'; } },
        p: "Je compare le délai de rachat à la date de mon besoin." }
    ]},
    { t: "Choisir un fonds", acq: "Je compare un fonds avec mes six questions et je décide", desc: "Objectif, contenu, historique, frais, rachat, agrément. Un bon produit pour le bon projet.", e: [
      { t: "Les six questions qui changent votre choix", c: "Posez-les au distributeur et cherchez les réponses dans les documents du fonds. L’AMF-UMOA informe les épargnants sur les placements collectifs et recommande de vérifier l’agrément des intervenants.",
        w: { puces: { id:"fc_q", k:"Pour le fonds que j’étudie, j’ai la réponse à…", m:1, l:["1. Son objectif : revenu, croissance, préservation relative du capital","2. Ce qu’il peut acheter, et dans quelles proportions","3. L’évolution de la part, sur quelle période, après frais","4. Les frais d’entrée, de gestion et de sortie","5. Quand et à quelle valeur je récupère mon argent","6. Qui le gère, sous quel agrément, et ses derniers rapports"] },
          v: function(D){ var n=(D.fc_q||[]).length; if(!n) return ''; return n===6?'<div class="verdict v-ok">Vous avez les six réponses. Vous pouvez comparer ce fonds à votre projet.</div>':'<div class="verdict v-ko">'+n+' réponse'+(n>1?'s':'')+' sur 6. Demandez les autres avant de souscrire.</div>'; } },
        p: "J’ai mes six questions pour n’importe quel fonds." },
      { t: "Votre décision", c: "Vous avez 200 000 F. Vous en aurez besoin dans quatre mois pour une dépense certaine. Un fonds affiche de bons résultats passés. Allez-vous y placer toute la somme ? Un bon produit peut être un mauvais choix pour le mauvais projet.",
        w: { quiz: [
          ["Par quoi commencez-vous ?", ["Par ses résultats passés","Par la date de ma dépense, le délai de rachat et la baisse possible de la part"], 1, "Les résultats passés ne disent rien de la valeur de la part dans quatre mois. Votre date, elle, est certaine."]
        ],
          champs: [ {id:"fc_nom", l:"Le fonds que j’étudie", type:"txt"}, {id:"fc_inv", l:"Il investit principalement dans…", type:"txt"}, {id:"fc_rach", l:"Je peux récupérer mes parts selon…", type:"txt"}, {id:"fc_frais", l:"Ses frais sont…", type:"txt"}, {id:"fc_obj", l:"Je l’envisage pour un objectif de…", type:"txt"} ],
          v: function(D){ return D.fc_obj?'<div class="verdict v-ok">Votre fiche de fonds est remplie. Elle est enregistrée dans votre cahier.</div>':''; } },
        p: "Ma fiche de comparaison de fonds est remplie." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Ma comparaison de fonds »", titre: "Vous savez ce qu’un fonds fait de votre argent, et comment en sortir",
    fiche: [
      ["Le fonds étudié", function(D){ return D.fc_nom||''; }],
      ["Il investit dans", function(D){ return D.fc_inv||''; }],
      ["Rachat", function(D){ return [D.fc_rach, D.fc_delai?'délai '+D.fc_delai+' jours':'', D.fc_fs?'frais de sortie '+D.fc_fs:''].filter(Boolean).join(' · '); }],
      ["Frais", function(D){ return D.fc_frais||''; }],
      ["Questions résolues", function(D){ var n=(D.fc_q||[]).length; return n?n+' sur 6':''; }],
      ["Mon objectif", function(D){ return D.fc_obj||''; }]
    ],
    suite: { t: "Construire sa stratégie d’investissement", p: "Vous savez lire un fonds. L’atelier suivant donne une mission à chaque somme, pour savoir quelle place lui donner.", lien: "atelier-strategie-investissement.html", b: "Ouvrir l’atelier" }
  }
};
