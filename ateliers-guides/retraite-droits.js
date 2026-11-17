/* Atelier guidé · Préparer ma retraite : droits, besoins et décisions (17 nov. 2026)
   Côte d'Ivoire : CNPS (salariés du privé, indépendants), CGRAE (fonctionnaires). Niveau débutant.
   Résultat : la fiche « Mon premier plan de retraite ». Les règles se vérifient selon le statut de chacun. */
window.ATELIER = {
  id: "retraite-droits",
  titre: "Préparer ma retraite : droits, besoins et décisions",
  h1: "Ce que votre pension pourrait couvrir, et un plan pour la différence.",
  voix: "auto",
  question: {
    t: "Vous cotisez pour la retraite depuis des années. Savez-vous ce que vous avez déjà acquis ?",
    r: [
      ["a", "Oui, la retenue est sur ma fiche de paie.", "La retenue prouve que vous cotisez, pas ce que vous recevrez. Le chapitre 2 vous montre comment vérifier vos années et vos salaires.", false],
      ["b", "Non, je ne l’ai jamais vérifié.", "Vous n’êtes pas seul. On commence par votre budget de retraite, puis on vérifie vos droits, pas à pas.", true]
    ]
  },
  chapitres: [
    { t: "Mon budget de retraite", acq: "J’ai estimé mon budget de retraite", desc: "Partir de sa vie, pas d’un pourcentage de son salaire.", e: [
      { t: "Quelles dépenses s’arrêtent vraiment ?", c: "« À la retraite, je dépenserai moins. » C’est vrai pour certaines dépenses. D’autres continuent, et certaines augmentent.",
        f: ["Disparaissent souvent : transport quotidien, repas près du bureau, vêtements de travail.", "Continuent : logement, alimentation, aide à la famille.", "Peuvent augmenter : santé, temps libre, soutien aux proches."],
        w: { consignes: 1, quiz: [
          ["« Il me faudra 70 % de mon salaire, c’est la règle. »", ["C’est une règle sûre","Je pars de mes propres dépenses"], 1, "Un pourcentage universel ne connaît ni votre loyer, ni votre famille, ni votre santé."]
        ] },
        p: "Je sais que mon budget de retraite part de ma vie." },
      { t: "Mon premier budget de retraite", c: "Partez de vos dépenses d’aujourd’hui. Retirez ce qui disparaîtra, ajoutez ce qui augmentera. Le résultat s’exprime en argent d’aujourd’hui : c’est une première photo, à corriger avec le temps.",
        w: { ex: "Une personne dépense 500 000 F par mois. Elle ne paiera plus 40 000 F de trajets, mais prévoit 30 000 F de plus pour d’autres besoins. Son premier budget de retraite : 500 000 − 40 000 + 30 000 = 490 000 F par mois.", k: "Vos chiffres, par mois", c3: 1, champs: [ {id:"rd_auj", l:"Mes dépenses d’aujourd’hui (F)"}, {id:"rd_moins", l:"Ce qui disparaîtra (F)"}, {id:"rd_plus", l:"Ce qui augmentera (F)"} ],
          v: function(D,H){ var a=H.N(D.rd_auj); if(!a) return ''; var b=a-H.N(D.rd_moins)+H.N(D.rd_plus); return '<div class="gros"><small>Mon budget mensuel de retraite estimé</small><b>'+H.F(b)+'</b><p>En argent d’aujourd’hui. Les prix auront bougé d’ici là : vous reprendrez ce chiffre chaque année.</p></div>'; } },
        p: "Mon budget mensuel de retraite est estimé." }
    ]},
    { t: "Mes droits", acq: "Je sais quels droits vérifier, et où", desc: "CNPS, CGRAE, indépendants : connaître son régime et son dossier.", e: [
      { t: "Une retenue n’est pas une pension", c: "Voir « retraite » sur sa fiche de paie ne dit pas combien on recevra. Pour un salarié du privé en Côte d’Ivoire, la CNPS fixe les conditions de la pension.",
        f: ["Avoir 60 ans.", "Avoir au moins 15 ans d’activité salariée cotisée, chez un ou plusieurs employeurs déclarés à la CNPS.", "Avoir cessé toute activité salariée.", "Le montant dépend de la carrière et des salaires sur lesquels on a cotisé. Avec moins de 15 ans, on reçoit en général un versement unique plutôt qu’une pension mensuelle : renseignez-vous auprès de la CNPS."],
        w: { consignes: 1, quiz: [
          ["Un ancien employeur ne m’a peut-être pas déclaré.", ["Je verrai à 60 ans","Je vérifie maintenant, tant que les documents et les personnes sont faciles à retrouver"], 1, "Une année travaillée dont la cotisation n’apparaît pas se règle bien plus facilement aujourd’hui que dans vingt ans."]
        ] },
        p: "Je connais les conditions de la pension CNPS." },
      { t: "Mon dossier", c: "Avant de calculer, vérifiez votre parcours : tous vos employeurs vous ont-ils déclaré ? Vos périodes de travail figurent-elles dans votre dossier ? Les salaires retenus correspondent-ils à vos justificatifs ?",
        w: { puces: { id:"rd_dos", k:"Ce que j’ai déjà rassemblé", m:1, l:["Mon numéro d’immatriculation","La liste de mes périodes d’emploi","Mes bulletins de paie ou attestations","Un relevé de ma situation"] },
          champs: [ {id:"rd_ok", l:"Mes années de travail vérifiées", type:"txt", ph:"2012-2019 chez…"}, {id:"rd_av", l:"Mes périodes à vérifier", type:"txt", ph:"2019-2021, contrat sans bulletin"} ],
          v: function(D){ var n=(D.rd_dos||[]).length; if(!n) return ''; return n>=3?'<div class="verdict v-ok">'+n+' pièces sur 4 : vous pouvez demander votre situation à votre caisse.</div>':'<div class="verdict v-mid">'+n+' pièce'+(n>1?'s':'')+' sur 4. Rassemblez le reste avant votre démarche.</div>'; } },
        p: "Mon dossier est en cours de vérification." },
      { t: "De quelle retraite parle-t-on ?", c: "Deux personnes peuvent avoir travaillé trente ans en Côte d’Ivoire et dépendre de caisses différentes. Vous n’avez pas à connaître toutes les règles : identifiez la vôtre et demandez un état de vos droits.",
        f: ["Salarié du privé : la CNPS.", "Fonctionnaire : la CGRAE. L’âge de départ dépend notamment de la catégorie et du grade.", "Public puis privé, ou l’inverse : faites vérifier vos périodes auprès des deux caisses, qui se coordonnent.", "Travailleur indépendant : la CNPS propose un régime pour les indépendants, avec ses propres conditions."],
        w: { consignes: 1, puces: { id:"rd_reg", k:"Mon parcours, dans l’ordre", m:1, l:["Emploi privé","Fonction publique","Activité indépendante","Périodes sans cotisation connue"] },
          champs: [ {id:"rd_caisse", l:"Ma ou mes caisses de retraite", type:"txt", ph:"CNPS, CGRAE"}, {id:"rd_dem", l:"Ma première démarche", type:"txt", ph:"demander mon relevé de carrière"} ],
          v: function(D){ var r=D.rd_reg||[]; if(!r.length) return ''; var c=[]; if(r.indexOf('Emploi privé')>=0||r.indexOf('Activité indépendante')>=0) c.push('la CNPS'); if(r.indexOf('Fonction publique')>=0) c.push('la CGRAE'); var h=c.length?'<div class="verdict v-ok">À vérifier auprès de '+c.join(' et de ')+'.</div>':''; if(r.indexOf('Périodes sans cotisation connue')>=0) h+='<div class="verdict v-mid">Vos périodes sans cotisation connue sont à éclaircir en premier.</div>'; return h; } },
        p: "Je sais auprès de quelle caisse vérifier mes droits." }
    ]},
    { t: "La différence à préparer", acq: "Je connais la différence à financer", desc: "Ce que la pension couvrirait, ce qui manque, ce qu’un petit versement construit.", e: [
      { t: "Combien manque-t-il ?", c: "Mettez deux chiffres dans la même unité : votre budget mensuel de retraite et une estimation de pension que vous avez fait vérifier. Si vous ne la connaissez pas encore, laissez la case vide : la prochaine étape est de la documenter.",
        w: { ex: "Besoin estimé : 500 000 F par mois. Hypothèse de pension : 300 000 F. Différence : 200 000 F par mois, soit 2 400 000 F par an.", k: "Vos chiffres, par mois", c3: 1, champs: [ {id:"rd_besoin", l:"Mon besoin mensuel (F)"}, {id:"rd_pens", l:"Ma pension estimée et vérifiée (F)"} ],
          v: function(D,H){ var b=H.N(D.rd_besoin)||(H.N(D.rd_auj)?H.N(D.rd_auj)-H.N(D.rd_moins)+H.N(D.rd_plus):0), p=H.N(D.rd_pens); if(!b) return ''; if(!p) return '<div class="verdict v-mid">Besoin : '+H.F(b)+' par mois. Pension pas encore connue : votre prochaine étape est de demander votre situation à votre caisse.</div>'; var d=b-p; if(d<=0) return '<div class="verdict v-ok">Votre pension estimée couvrirait votre besoin. Gardez une réserve, et vérifiez ce chiffre chaque année.</div>'; return '<div class="gros"><small>La différence à préparer</small><b>'+H.F(d)+' par mois</b><p>Soit '+H.F(d*12)+' par an, en argent d’aujourd’hui. Une pension supposée n’est pas un droit acquis : faites-la vérifier.</p></div>'; } },
        p: "La différence à préparer est écrite." },
      { t: "Un petit versement, que construit-il ?", c: "25 000 F par mois pendant 20 ans, c’est 25 000 × 12 × 20 = 6 000 000 F de versements, sans aucun rendement. Investis, le résultat dépendra des gains ou des pertes, des frais et de la hausse des prix.",
        f: ["La bonne conclusion n’est pas « cela ne sert à rien ».", "C’est : quel rôle peut jouer cette somme, et comment augmenter mon effort peu à peu ?", "Revenus irréguliers : un petit versement fixe, et un supplément les bons mois."],
        w: { consignes: 1, k: "Votre versement soutenable", c3: 1, champs: [ {id:"rd_vers", l:"Ce que je peux tenir chaque mois, 12 mois de suite (F)"}, {id:"rd_ans", l:"Pendant combien d’années ?", ph:"20"}, {id:"rd_rev", l:"Je réexaminerai ce montant le…", type:"txt", ph:"1er janvier"} ],
          v: function(D,H){ var v=H.N(D.rd_vers), a=H.N(D.rd_ans)||20; if(!v) return ''; return '<div class="gros"><small>Vos versements, sans aucun rendement</small><b>'+H.F(v*12*a)+'</b><p>'+H.F(v*12)+' par an pendant '+a+' ans. Le résultat réel dépendra des gains, des pertes, des frais et des prix.</p></div>'; } },
        p: "Mon premier versement soutenable est fixé." },
      { t: "Avant de choisir un placement", c: "Trois questions avant de signer. Sur le marché régional, l’AMF-UMOA recommande de vérifier l’agrément de l’intermédiaire et de lire les documents avant de souscrire.",
        w: { puces: { id:"rd_chk", k:"Je vérifie…", m:1, l:["Quand je pourrais avoir besoin de cet argent","Quelle baisse temporaire je peux supporter","Qui détient et contrôle le placement","L’agrément de l’intermédiaire","Les frais et les conditions de sortie"] },
          v: function(D){ var n=(D.rd_chk||[]).length; if(!n) return ''; return n>=4?'<div class="verdict v-ok">'+n+' vérifications sur 5 : vous choisirez en connaissance de cause.</div>':'<div class="verdict v-mid">'+n+' sur 5. Ajoutez-en avant de signer.</div>'; } },
        p: "Ma liste de vérifications est prête." }
    ]},
    { t: "Mon plan dans le temps", acq: "Mon plan de retraite est écrit", desc: "Un point chaque année, et après chaque changement de vie.", e: [
      { t: "Ma retraite change quand ma vie change", c: "Un plan écrit à 30 ans ne reste pas intact jusqu’à 60 ans : changement d’emploi, enfants, crédit, aide aux proches, période sans cotisation. Faites un point régulier sur trois choses.",
        f: ["Mes droits : mes périodes de travail et de cotisation sont-elles bien enregistrées ?", "Ma vie : mon budget futur correspond-il encore à mes projets et à mes obligations ?", "Mon argent : ce que je garde pour le long terme est-il toujours adapté à mon horizon et aux pertes que je peux supporter ?"],
        w: { consignes: 1, champs: [ {id:"rd_point", l:"Mon point annuel aura lieu le…", type:"txt", ph:"jour de mon anniversaire, 1er janvier"}, {id:"rd_phrase", l:"Mon plan, en une phrase", type:"area", ph:"Je vérifie mes droits auprès de…, je mets de côté… par mois, et je refais le point chaque…"} ],
          v: function(D){ return D.rd_phrase?'<div class="verdict v-ok">Votre plan est écrit. Revenez-y chaque année et après chaque changement important.</div>':''; } },
        p: "Mon point annuel est fixé." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Mon premier plan de retraite »", titre: "Votre retraite devient une suite de décisions claires",
    fiche: [
      ["Mon ou mes régimes", function(D){ return D.rd_caisse||(D.rd_reg||[]).join(', '); }],
      ["Ma prochaine démarche", function(D){ return D.rd_dem||''; }],
      ["Périodes à vérifier", function(D){ return D.rd_av||''; }],
      ["Budget mensuel de retraite estimé", function(D,H){ var a=H.N(D.rd_auj); return a?H.F(a-H.N(D.rd_moins)+H.N(D.rd_plus))+' (argent d’aujourd’hui)':''; }],
      ["Différence à financer", function(D,H){ var b=H.N(D.rd_besoin)||(H.N(D.rd_auj)?H.N(D.rd_auj)-H.N(D.rd_moins)+H.N(D.rd_plus):0), p=H.N(D.rd_pens); if(!b) return ''; if(!p) return 'Pension à documenter'; return b>p?H.F(b-p)+' par mois':'Couverte par la pension estimée'; }],
      ["Mon versement soutenable", function(D,H){ var v=H.N(D.rd_vers); return v?H.F(v)+' par mois'+(D.rd_rev?' · révision le '+D.rd_rev:''):''; }],
      ["Mon point annuel", function(D){ return D.rd_point||''; }],
      ["Mon plan", function(D){ return D.rd_phrase||''; }]
    ],
    suite: { t: "DAT, OPCVM, FCPE : les placements expliqués", p: "Votre versement est fixé. L’atelier suivant compare les placements selon votre horizon, pour choisir où le mettre.", lien: "atelier-placements-expliques.html", b: "Ouvrir l’atelier" }
  }
};
