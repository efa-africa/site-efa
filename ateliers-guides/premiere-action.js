/* Atelier guidé · Acheter sa première action à la BRVM (17 nov. 2026)
   Chiffres de marché datés et vérifiés (bilan BRVM 2025 ; séance du 16 nov. 2026 d'après nos données de marché).
   Calculs des personnages : exercices. Résultat : la fiche « Mon analyse avant d'acheter ». */
window.ATELIER = {
  id: "premiere-action",
  titre: "Acheter sa première action à la BRVM",
  h1: "Savoir ce que vous achetez, à quel prix, et avec quel argent.",
  voix: "auto",
  question: {
    t: "Une action a gagné 20 % cette année. Est-ce une raison de l’acheter ?",
    r: [
      ["a", "Oui, elle a fait ses preuves.", "La hausse passée dit ce qui s’est passé, pas ce qui va se passer. Elle peut même rendre le prix moins intéressant. On regarde d’abord ce que vous achetez.", false],
      ["b", "Pas forcément : il faut savoir ce que vaut l’entreprise à ce prix.", "C’est la bonne question. Cet atelier vous apprend à la poser, puis à préparer votre premier ordre sans vous précipiter.", true]
    ]
  },
  chapitres: [
    { t: "Ce que j’achète", acq: "Je sais ce qu’est une action et je calcule un gain ou une perte", desc: "Une part d’entreprise. Le prix et le dividende sont deux choses distinctes.", e: [
      { t: "Une action, c’est une part d’entreprise", c: "En achetant une action, vous devenez propriétaire d’une petite part de l’entreprise. Si elle se développe et que d’autres veulent ses actions, le prix peut monter. Si elle distribue une partie de ses bénéfices, vous pouvez recevoir un dividende. Aucun des deux n’est automatique.",
        f: ["Le prix peut baisser. L’entreprise peut gagner moins, ou décider de ne pas verser de dividende.", "À la BRVM, vous pouvez investir dans une cinquantaine de sociétés présentes dans les huit pays de l’UEMOA.", "En 2025, l’indice BRVM Composite a progressé de 25,26 %. Cela décrit le marché dans son ensemble, pas chaque action."],
        w: { consignes: 1, quiz: [
          ["Le BRVM Composite a gagné 25,26 % en 2025. Qu’en conclure ?", ["Chaque action a gagné environ 25 %","Le marché a monté dans son ensemble, certaines actions ont pu baisser"], 1, "Un indice est une moyenne pondérée. Il ne dit rien du résultat d’une action précise, ni d’un achat fait aujourd’hui."]
        ] },
        p: "Je sais qu’une action est une part d’entreprise, sans résultat garanti." },
      { t: "Le calcul que tout débutant doit savoir faire", c: "Awa achète 10 actions à 8 000 F : elle paie 80 000 F, plus les frais de son intermédiaire. Si le cours passe à 9 000 F, ses actions valent 90 000 F : c’est une plus-value potentielle, encaissée seulement si elle vend à ce prix. S’il tombe à 6 500 F, elles valent 65 000 F. Le dividende, lui, se compte à part.",
        w: { ex: "10 actions achetées 8 000 F, cours à 6 500 F, dividende de 400 F par action : valeur 65 000 F, soit −15 000 F sur le prix, et 4 000 F de dividende. On peut recevoir un dividende alors que le cours baisse.", k: "Votre exercice", champs: [ {id:"pa_n", l:"Nombre d’actions"}, {id:"pa_achat", l:"Prix d’achat par action (F)"}, {id:"pa_cours", l:"Cours actuel ou imaginé (F)"}, {id:"pa_div", l:"Dividende par action (F)"} ],
          v: function(D,H){ var n=H.N(D.pa_n), a=H.N(D.pa_achat), c=H.N(D.pa_cours), d=H.N(D.pa_div); if(!n||!a) return ''; var paye=n*a; if(!c) return '<div class="gros"><small>Vous payez, hors frais</small><b>'+H.F(paye)+'</b><p>Ajoutez un cours pour voir la variation.</p></div>'; var v=n*c, e=v-paye;
            return '<div class="gros"><small>Valeur de vos actions · variation hors frais</small><b>'+H.F(v)+' · '+(e>=0?'+':'−')+H.F(Math.abs(e))+'</b><p>'+(e>=0?'Plus-value potentielle : vous ne l’encaissez que si vous vendez à ce prix et trouvez un acheteur.':'Moins-value potentielle : elle devient une perte réelle si vous vendez à ce prix.')+(d?' Dividende à part : '+H.F(n*d)+', selon les conditions de distribution.':'')+'</p></div>'; } },
        p: "Je calcule la hausse et la baisse possibles avant de décider." }
    ]},
    { t: "Le prix fait partie de la décision", acq: "Je sais si je paie cher les bénéfices d’une entreprise", desc: "Une bonne entreprise peut être une mauvaise affaire à un prix trop élevé.", e: [
      { t: "Une bonne entreprise peut être une mauvaise affaire", c: "Serge aime une entreprise dont les produits sont partout. Il en conclut que son action est forcément intéressante. Il lui manque une question : combien paie-t-il pour sa part des bénéfices ? Ce rapport s’appelle le PER : le cours divisé par le bénéfice par action.",
        w: { ex: "Une entreprise fictive gagne 500 F par action. À 5 000 F, l’investisseur paie dix fois ce bénéfice annuel. À 10 000 F, sans bénéfice supplémentaire, il le paie vingt fois.", k: "Votre calcul", c3: 1, champs: [ {id:"pa_bpa", l:"Bénéfice par action sur un an (F)"}, {id:"pa_px", l:"Cours de l’action (F)"} ],
          v: function(D,H){ var b=H.N(D.pa_bpa), p=H.N(D.pa_px); if(!b||!p) return ''; var r=(p/b).toFixed(1).replace('.',','); return '<div class="gros"><small>PER</small><b>'+r+' fois le bénéfice</b><p>Vous payez '+r+' années du bénéfice actuel. Ce n’est qu’un point de départ : le PER ne dit rien des dettes, des projets ni de la régularité des résultats.</p></div>'; } },
        p: "Je regarde le prix payé pour les bénéfices, pas seulement l’entreprise." },
      { t: "Le marché monte. Votre action peut baisser.", c: "Au 16 novembre 2026, le BRVM Composite clôturait à 512,85 points, en baisse de 0,60 % sur la séance. Cette photo datée ne dit pas si une entreprise précise mérite votre argent. Une journée, un mois et une année racontent des histoires différentes.",
        f: ["Quand une publication dit qu’une action « s’envole », demandez : depuis quelle date ?", "Regardez ensuite les derniers résultats de l’entreprise.", "Le prix et les bénéfices avancent-ils au même rythme ?"],
        w: { consignes: 1, quiz: [
          ["Une action a doublé en un an, mais son bénéfice n’a pas bougé. Que s’est-il passé ?", ["L’entreprise vaut deux fois plus","Vous payez deux fois plus cher le même bénéfice"], 1, "Si le prix monte sans les bénéfices, le PER double. L’action peut encore avoir de bonnes perspectives, mais elle laisse moins de place à l’erreur."]
        ] },
        p: "Je demande toujours : depuis quand, et avec quels résultats ?" }
    ]},
    { t: "De l’idée à l’achat", acq: "Je prépare mon premier ordre et ma fiche d’analyse", desc: "Une SGI agréée, une grille de frais, un prix limite. Puis une fiche avant d’acheter.", e: [
      { t: "Comment passer de l’idée à l’achat ?", c: "Sur le marché régional, l’achat et la vente passent par un intermédiaire autorisé, notamment une Société de Gestion et d’Intermédiation (SGI). Elle reçoit votre ordre et vous envoie un avis d’opéré une fois l’opération exécutée. Sur une valeur peu échangée, le dernier cours ne garantit pas que vous pourrez acheter toute la quantité voulue à ce prix.",
        w: { puces: { id:"pa_ordre", k:"Avant mon premier ordre, je sais…", m:1, l:["Que ma SGI est agréée","Sa grille de frais","Quelle action j’achète","Combien de titres","Le prix maximum que j’accepte","Les offres et volumes disponibles"] },
          v: function(D){ var n=(D.pa_ordre||[]).length; if(!n) return ''; return n===6?'<div class="verdict v-ok">Vous êtes prêt à rédiger votre ordre, sans précipitation.</div>':'<div class="verdict v-ko">Encore '+(6-n)+' point'+(6-n>1?'s':'')+' à éclaircir avant de passer l’ordre.</div>'; } },
        p: "Je connais ma SGI, ses frais et mon prix maximum." },
      { t: "Votre première décision", c: "Choisissez une entreprise cotée que vous connaissez. Sans acheter encore, remplissez la fiche. Le premier progrès en Bourse n’est pas d’acheter vite : c’est de pouvoir expliquer ce que vous achetez, à quel prix et avec quel argent.",
        w: { champs: [ {id:"pa_soc", l:"L’entreprise", type:"txt", ph:"Nom de la société"}, {id:"pa_vend", l:"Que vend-elle ?", type:"txt"}, {id:"pa_date", l:"Son dernier cours date de quand ?", type:"txt"}, {id:"pa_bene", l:"Que disent ses derniers bénéfices publiés ?", type:"area"}, {id:"pa_just", l:"Son prix actuel me paraît-il justifié ? Pourquoi ?", type:"area"}, {id:"pa_perte", l:"Ce que je peux perdre sans toucher à un besoin proche (F)"}, {id:"pa_frais", l:"Les frais de ma SGI", type:"txt"}, {id:"pa_phrase", l:"Je veux étudier cette action parce que… Il me manque encore… Je déciderai après avoir vérifié…", type:"area"} ],
          v: function(D){ return D.pa_phrase?'<div class="verdict v-ok">Votre analyse est écrite. Elle est enregistrée dans votre fiche.</div>':''; } },
        p: "Ma fiche d’analyse est remplie, avant tout achat." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Mon analyse avant d’acheter »", titre: "Vous savez expliquer ce que vous achetez, à quel prix et avec quel argent",
    fiche: [
      ["L’entreprise étudiée", function(D){ return D.pa_soc?D.pa_soc+(D.pa_vend?' · '+D.pa_vend:''):''; }],
      ["Dernier cours vu le", function(D){ return D.pa_date||''; }],
      ["PER calculé", function(D,H){ var b=H.N(D.pa_bpa), p=H.N(D.pa_px); return b&&p?(p/b).toFixed(1).replace('.',',')+' fois le bénéfice':''; }],
      ["Prix justifié ?", function(D){ return D.pa_just||''; }],
      ["Perte que je peux supporter", function(D,H){ var p=H.N(D.pa_perte); return p?H.F(p):''; }],
      ["Frais de ma SGI", function(D){ return D.pa_frais||''; }],
      ["Ma décision", function(D){ return D.pa_phrase||''; }]
    ],
    suite: { t: "Lire une société cotée", p: "Votre fiche est prête. L’atelier suivant vous apprend à lire les comptes d’une société cotée pour la compléter.", lien: "atelier-lire-societe-cotee.html", b: "Ouvrir l’atelier" }
  }
};
