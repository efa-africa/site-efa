/* Atelier guidé · Ma tontine devient une spirale */
window.ATELIER = {
  id: "tontine-spirale",
  titre: "Ma tontine devient une spirale",
  h1: "Votre tontine sait réunir de l’argent. Apprenez-lui à en garder.",
  voix: false,
  question: {
    t: "Votre tontine réunit un million chaque mois. À la fin du cycle, que reste-t-il au groupe ?",
    r: [
      ["a", "Un million.", "Non : chaque million a été remis à un membre. L’argent a circulé, mais rien n’est resté en commun. C’est le chapitre 1.", false],
      ["b", "Rien en commun.", "Exactement. La tontine fait circuler l’argent, mais elle ne garde rien. C’est le cercle. Cet atelier en fait une spirale.", true],
      ["c", "Les intérêts.", "Dans une tontine classique, personne ne verse d’intérêts : le dernier prête son argent aux autres, gratuitement. C’est le chapitre 1.", false],
      ["d", "Ça dépend du rang.", "Le rang change qui emprunte et qui prête. Mais pour le groupe, à la fin, il ne reste rien. C’est le chapitre 1.", false]
    ]
  },
  chapitres: [
    { t: "Comprendre ma tontine", acq: "Je comprends ce que fait ma tontine", desc: "Un décalage de trésorerie, des emprunteurs et des prêteurs.", e: [
      { t: "Un décalage de trésorerie", c: "La tontine n’est pas de l’épargne : c’est un décalage de trésorerie. Vous recevez votre propre argent, plus tôt ou plus tard.",
        w: { quiz: [ ["Je cotise 100 000 F pendant 10 mois et je reçois 1 000 000 F. Ai-je gagné de l’argent ?", ["Oui","Non"], 1, "Vous récupérez exactement ce que vous avez versé. La tontine change le moment, pas le montant."] ] },
        p: "Je sais que la tontine décale mon argent dans le temps." },
      { t: "Qui emprunte, qui prête ?", c: "Le premier à recevoir emprunte au groupe. Le dernier est le banquier du groupe : il prête son argent aux autres pendant tout le cycle, sans intérêts.",
        w: { puces: { id:"ts_rang", k:"Dans votre tontine, vous êtes plutôt", l:["Parmi les premiers","Au milieu","Parmi les derniers"] },
          v: function(D){ return D.ts_rang==="Parmi les premiers"?'<div class="verdict v-mid">Vous empruntez au groupe : vous devrez encore les tours suivants.</div>':D.ts_rang==="Parmi les derniers"?'<div class="verdict v-mid">Vous prêtez au groupe, sans intérêts : c’est vous qui portez le risque.</div>':D.ts_rang?'<div class="verdict v-ok">Vous empruntez puis prêtez, à peu près à égalité.</div>':''; } },
        p: "Je sais si j’emprunte ou si je prête dans ma tontine." },
      { t: "Ce qui reste à la fin", c: "Grâce à la confiance, la tontine fait circuler l’argent. Mais l’argent qui circule sans réserve ne construit pas de capital.",
        w: { champs: [ {id:"ts_cot", l:"Cotisation par membre (F)", ph:"100 000"}, {id:"ts_n", l:"Nombre de membres", ph:"10"} ],
          v: function(D,H){ var c=H.N(D.ts_cot), n=H.N(D.ts_n); if(!c||!n) return ''; return '<div class="gros"><small>Argent mis en circulation sur un cycle</small><b>'+H.F(c*n*n)+'</b><p>Et ce qui reste en commun à la fin : 0 F.</p></div>'; } },
        p: "J’ai mesuré ce qui circule et ce qui reste." }
    ]},
    { t: "La confiance", acq: "Je mesure la solidité du groupe", desc: "Les règles écrites et le risque de défaut.", e: [
      { t: "Les règles écrites", c: "La confiance précède le capital. Et la confiance tient mieux quand les règles sont écrites et connues de tous.",
        w: { puces: { id:"ts_reg", k:"Ce que votre groupe a déjà", m:1, l:["Liste des membres et des rangs","Date et montant des cotisations","Règle en cas de retard","Règle en cas de défaut","Un responsable désigné","Un cahier ou un relevé"] },
          v: function(D){ var n=(D.ts_reg||[]).length; return n?'<div class="verdict '+(n>=5?'v-ok':'v-mid')+'">'+n+' règle'+(n>1?'s':'')+' sur 6.'+(n<5?' Les règles manquantes sont à écrire avant d’ajouter une réserve.':' Votre groupe est prêt pour une réserve.')+'</div>':''; } },
        p: "J’ai fait le point sur les règles de mon groupe." },
      { t: "Le risque de défaut", c: "Quand un membre ne paie plus, ce sont les derniers qui perdent. Une réserve commune protège tout le monde.",
        w: { quiz: [ ["Un membre qui a déjà reçu son tour disparaît. Qui perd ?", ["Les premiers","Les derniers"], 1, "Les derniers ne recevront pas la totalité de leur tour."] ] },
        p: "Je comprends qui porte le risque." }
    ]},
    { t: "La réserve", acq: "Je propose une réserve", desc: "Deux façons de garder une part de chaque tour.", e: [
      { t: "Deux méthodes", f: ["Ajouter une part à la cotisation : par exemple 110 000 F au lieu de 100 000 F, dont 10 000 F vont à la réserve.", "Ou garder une part de chaque tour : celui qui reçoit touche 80 %, et 20 % restent en réserve."], c: "La réserve fait la spirale. Elle se décide avant le cycle, jamais pendant.",
        w: { puces: { id:"ts_meth", k:"La méthode que vous proposerez", l:["Cotisation majorée","Part de chaque tour"] } },
        p: "J’ai choisi ma méthode." },
      { t: "Ce que la réserve représente", c: "Regardez le chiffre : ce n’est plus seulement de l’argent qui tourne, c’est un capital qui appartient au groupe.",
        w: { champs: [ {id:"ts_pct", l:"Part en réserve (%)", ph:"10"} ],
          v: function(D,H){ var c=H.N(D.ts_cot), n=H.N(D.ts_n), p=H.N(D.ts_pct); if(!c||!n||!p) return '<div class="verdict v-mid">Indiquez la cotisation et le nombre de membres au chapitre 1, puis la part en réserve.</div>'; D.ts_res=Math.round(c*n*n*p/100); return '<div class="gros"><small>Réserve du groupe après un cycle</small><b>'+H.F(D.ts_res)+'</b><p>'+p+' % de '+H.F(c*n*n)+' mis en circulation.</p></div>'; } },
        p: "Je connais le montant de la réserve sur un cycle." }
    ]},
    { t: "Faire travailler la réserve", acq: "Je sais où placer la réserve", desc: "Un compte au nom du groupe, des règles d’usage claires.", e: [
      { t: "Où la placer", f: ["Sur un compte au nom du groupe, jamais sur le compte d’un seul membre.", "Avec deux signatures pour tout retrait.", "Dans un établissement agréé : banque, caisse ou microfinance.", "Plus tard, une partie dans un placement de long terme, décidé ensemble."], c: "La réserve appartient au groupe. Elle ne doit jamais dépendre d’une seule personne.",
        p: "Je sais où placer la réserve." },
      { t: "À quoi elle sert", c: "Écrivez à l’avance à quoi sert la réserve. Une règle claire évite les disputes le jour où quelqu’un en a besoin.",
        w: { puces: { id:"ts_us", k:"Les usages que vous proposerez", m:1, l:["Couvrir un membre en défaut","Urgence grave d’un membre","Prêt remboursable aux membres","Investir ensemble plus tard"] } },
        p: "Les usages de la réserve sont choisis." }
    ]},
    { t: "Convaincre le groupe", acq: "Je convaincs mon groupe", desc: "Le message, les objections, le premier cycle.", e: [
      { t: "Mon message au groupe", c: "Parlez de ce que le groupe y gagne, pas de théorie : protéger les derniers, et construire quelque chose ensemble.",
        w: { champs: [ {id:"ts_msg", l:"Mon message", type:"area", ph:"Notre tontine réunit… chaque mois. À la fin, il ne nous reste rien en commun. Je propose…"} ] },
        p: "Mon message est écrit." },
      { t: "Les objections", f: ["« On reçoit moins » : vous recevez la même chose, une part arrive plus tard, et elle vous protège.", "« Qui garde l’argent ? » : un compte au nom du groupe, deux signatures.", "« On n’a pas confiance » : alors on commence petit, avec 5 % sur un seul cycle."], c: "Chaque objection est une bonne question. Une réponse claire la transforme en accord.",
        p: "Je suis prêt à répondre aux objections." },
      { t: "Le premier cycle spirale", c: "Commencez petit. Un premier cycle réussi convainc mieux que tous les discours.",
        w: { champs: [ {id:"ts_date", l:"Quand je le propose au groupe", type:"txt", ph:"à la prochaine réunion"} ] },
        p: "La date de ma proposition est fixée." }
    ]}
  ],
  fin: {
    k: "Ma fiche « tontine spirale »", titre: "Votre tontine peut devenir une spirale",
    fiche: [
      ["Mon rang", function(D){ return D.ts_rang||''; }],
      ["Argent en circulation par cycle", function(D,H){ var c=H.N(D.ts_cot), n=H.N(D.ts_n); return c&&n?H.F(c*n*n):''; }],
      ["Règles déjà en place", function(D){ var n=(D.ts_reg||[]).length; return n?n+' sur 6':''; }],
      ["Ma méthode", function(D){ return D.ts_meth||''; }],
      ["Réserve après un cycle", function(D,H){ return H.N(D.ts_res)?H.F(H.N(D.ts_res)):''; }],
      ["Usages de la réserve", function(D){ return (D.ts_us||[]).join(', '); }],
      ["Ma proposition au groupe", function(D){ return D.ts_date||''; }]
    ],
    suite: { t: "Avant de cotiser", p: "Les douze questions à poser avant d’entrer dans une tontine, ou d’en lancer une. Gratuit.", lien: "avant-de-cotiser.html", b: "Lire les douze questions" }
  }
};
