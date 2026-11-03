/* Atelier guidé · Acheter un lot : l'état domanial d'abord
   Extrait d'un entretien au guichet unique du ministère de la Construction (Côte d'Ivoire),
   propos recueillis par Stéphane Trifot. Atelier gratuit. */
window.ATELIER = {
  id: "acheter-un-lot",
  titre: "Acheter un lot",
  h1: "Avant d’acheter un lot, demandez son extrait de naissance.",
  voix: "auto",
  question: {
    t: "Le village vous propose le lot n° 25 d’un nouveau lotissement. Que faites-vous avant de payer ?",
    r: [
      ["a", "Je paie une avance pour bloquer le lot.", "C’est le piège : un autre papier existe peut-être déjà sur ce lot. On vérifie d’abord, on paie ensuite. C’est le chapitre 2.", false],
      ["b", "Je demande l’état domanial du lot au guichet unique.", "Exactement. C’est la première étape, et c’est tout l’objet de cet atelier.", true],
      ["c", "Je me fie au plan du lotisseur.", "Le plan montre le lot, pas ce qui est déjà écrit dessus. Seul l’état domanial le dit. C’est le chapitre 2.", false],
      ["d", "Je demande aux voisins.", "Les voisins savent beaucoup de choses, mais pas ce qui figure dans les registres. C’est le chapitre 2.", false]
    ]
  },
  chapitres: [
    { t: "Le lot qu’on vous propose", acq: "Je sais d’où vient le lot", desc: "Le village, le lotisseur et les références du lot.", e: [
      { t: "D’où vient le lot", c: "La chefferie vous dit : nous avons un lotissement dans telle localité, qui dépend de notre village. Il a été fait avec un aménageur foncier, généralement un lotisseur, qui a ouvert les voies. Le village commercialise maintenant les lots.",
        w: { k: "Notez ce qu’on vous propose", champs: [ {id:"al_lot", l:"Numéro du lot", type:"txt", ph:"25"}, {id:"al_ilot", l:"Îlot", type:"txt", ph:"12"}, {id:"al_loc", l:"Localité ou lotissement", type:"txt", ph:"nom du lotissement"} ] },
        p: "J’ai noté les références du lot." },
      { t: "Un lot proposé n’est pas un lot libre", c: "Au village, on vous montre un lot. Mais ce qui est déjà écrit sur ce lot, seul l’état domanial le dit.",
        w: { quiz: [ ["Le village vous propose le lot 12. Pouvez-vous être sûr qu’il est libre ?", ["Oui, le village le propose","Non, je dois vérifier"], 1, "Un autre papier peut déjà exister sur ce lot. C’est ce que révèle l’état domanial."] ] },
        p: "Je sais qu’il faut vérifier avant de payer." }
    ]},
    { t: "L’état domanial", acq: "Je sais demander l’état domanial", desc: "L’extrait de naissance du terrain.", e: [
      { t: "L’extrait de naissance du terrain", f: ["Où : au guichet unique du ministère de la Construction.", "Avec quoi : les informations reçues au village (lotissement, îlot, numéro de lot).", "Combien : 5 000 F."], c: "L’état domanial est le document qui donne toutes les références du lot. C’est, en quelque sorte, l’extrait de naissance du terrain.",
        p: "Je sais où et comment demander l’état domanial." },
      { t: "Ce qu’il peut révéler", c: "Au guichet unique, on pourra vous dire qu’il existe déjà une lettre d’attribution sur ce lot, ou un ACD (arrêté de concession définitive), au nom de M. Kwaku ou de M. Ouattara, par exemple.",
        w: { quiz: [ ["L’état domanial montre un ACD au nom de M. Ouattara. Pouvez-vous acheter ce lot au village ?", ["Oui","Non, seulement si M. Ouattara me le cède"], 1, "Vous ne pourrez plus avoir de prétention sur ce terrain sans passer par M. Ouattara, s’il accepte de vous le céder."] ] },
        p: "Je sais lire ce que l’état domanial révèle." }
    ]},
    { t: "L’état foncier", acq: "Je sais demander l’état foncier", desc: "Une seconde vérification, à la DGI.", e: [
      { t: "À la Conservation foncière", f: ["Où : à la Conservation foncière, à la Direction générale des impôts (DGI).", "Quoi : l’état foncier du terrain.", "Combien : 3 000 F."], c: "En plus de l’état domanial, vous pouvez demander l’état foncier. Deux vérifications valent mieux qu’une.",
        p: "Je sais où demander l’état foncier." },
      { t: "Mon budget de vérification", c: "Quelques milliers de francs pour vérifier, avant de verser des millions.",
        w: { puces: { id:"al_dem", k:"Ce que je vais demander", m:1, l:["État domanial (guichet unique)","État foncier (DGI)"] },
          v: function(D,H){ var l=D.al_dem||[], t=(l.indexOf("État domanial (guichet unique)")>=0?5000:0)+(l.indexOf("État foncier (DGI)")>=0?3000:0); D.al_cout=t; return t?'<div class="gros"><small>Mon budget de vérification</small><b>'+H.F(t)+'</b><p>Tarifs indiqués lors de l’entretien, à confirmer sur place.</p></div>':''; } },
        p: "Mon budget de vérification est calculé." }
    ]},
    { t: "Un hectare ou plus", acq: "Je sais quoi demander pour une grande superficie", desc: "L’avis de servitude.", e: [
      { t: "Une grande superficie", c: "À partir d’un hectare, la démarche change. Au guichet unique, on ne demande plus l’état domanial, ni l’état foncier à la DGI : on demande un avis de servitude.",
        w: { puces: { id:"al_sup", k:"La superficie du terrain", l:["Moins d’un hectare","Un hectare ou plus"] },
          v: function(D){ return D.al_sup==="Un hectare ou plus"?'<div class="verdict v-mid">Vous demandez un avis de servitude au guichet unique.</div>':D.al_sup?'<div class="verdict v-ok">Vous demandez l’état domanial au guichet unique, et l’état foncier à la DGI.</div>':''; } },
        p: "Je sais quel document demander pour mon terrain." },
      { t: "Ce que dit l’avis de servitude", f: ["Un ouvrage doit être construit sur ce terrain.", "Le terrain est dans un espace vert.", "C’est un espace dédié à l’administration.", "C’est un espace réservé à un équipement."], c: "L’avis de servitude vous dit si le terrain est déjà réservé à autre chose.",
        p: "Je sais ce que l’avis de servitude peut révéler." }
    ]},
    { t: "Avant de payer", acq: "Je vérifie avant de payer", desc: "Ma liste et ma prochaine démarche.", e: [
      { t: "Ma liste", c: "On vérifie d’abord, on paie ensuite.",
        w: { puces: { id:"al_ok", k:"Ce que j’ai déjà fait", m:1, l:["Références du lot notées","État domanial demandé","État foncier demandé","Avis de servitude demandé (un hectare ou plus)"] } },
        p: "J’ai fait le point sur mes vérifications." },
      { t: "Si un autre nom apparaît", c: "Si l’état domanial montre une lettre d’attribution ou un ACD au nom d’une autre personne, c’est avec elle qu’il faut traiter. Pour approfondir et avant de décider, voyez un notaire.",
        w: { champs: [ {id:"al_suite", l:"Ma prochaine démarche", type:"txt", large:1, ph:"aller au guichet unique cette semaine"} ] },
        p: "Ma prochaine démarche est fixée." }
    ]}
  ],
  fin: {
    k: "Ma fiche « acheter un lot »", titre: "Vous savez quoi demander avant de payer",
    fiche: [
      ["Le lot", function(D){ var a=[]; if(D.al_lot) a.push('lot '+D.al_lot); if(D.al_ilot) a.push('îlot '+D.al_ilot); if(D.al_loc) a.push(D.al_loc); return a.join(', '); }],
      ["Superficie", function(D){ return D.al_sup||''; }],
      ["À demander", function(D){ return D.al_sup==="Un hectare ou plus"?'Avis de servitude (guichet unique)':(D.al_dem||[]).join(', '); }],
      ["Budget de vérification", function(D,H){ return H.N(D.al_cout)?H.F(H.N(D.al_cout)):''; }],
      ["Déjà fait", function(D){ return (D.al_ok||[]).join(', '); }],
      ["Ma prochaine démarche", function(D){ return D.al_suite||''; }]
    ],
    suite: { t: "Acheter un terrain sans se faire avoir", p: "Les papiers, du plus fragile au plus solide, et les six vérifications avant de payer. Gratuit.", lien: "acheter-un-terrain.html", b: "Lire la leçon" }
  }
};
