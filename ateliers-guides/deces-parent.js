/* Atelier guidé · Se préparer au décès d’un parent, sans s’endetter */
window.ATELIER = {
  id: "deces-parent",
  titre: "Se préparer au décès d’un parent, sans s’endetter",
  h1: "Honorer ses parents, le jour venu, sans s’endetter.",
  voix: "auto",
  question: {
    t: "Les funérailles d’un parent : quand vaut-il mieux en parler en famille ?",
    r: [
      ["a", "Quand le moment viendra.", "C’est la pudeur de beaucoup de familles, et elle se comprend. Mais le jour venu, tout se décide dans la peine et dans l’urgence. En parler avant, c’est se donner le temps de bien faire.", false],
      ["b", "Maintenant, pendant que tout va bien.", "Oui. Parler tôt, c’est un geste d’amour : on connaît les souhaits de ses parents, on s’organise entre frères et sœurs, et personne ne porte seul la charge.", true]
    ]
  },
  chapitres: [
    { t: "En parler", acq: "Je sais ouvrir la conversation", desc: "Pourquoi en parler avant, avec quels mots, et en respectant les souhaits de vos parents.", e: [
      { t: "Pourquoi en parler avant ?", c: "Parler des funérailles ne les attire pas. Cela évite que l’aîné paie seul, ou que la famille s’endette dans l’urgence.",
        w: { quiz: [ ["Parler des funérailles avec ses parents, c’est leur manquer de respect.", ["C’est vrai","Ce n’est pas forcément vrai"], 1, "Avec douceur et au bon moment, c’est au contraire une façon de les honorer : leurs souhaits seront respectés."], ["Sans préparation, la charge tombe souvent sur une seule personne.", ["C’est vrai","Ce n’est pas forcément vrai"], 0, "Souvent l’aîné, ou celui qui a un salaire. Une caisse partagée répartit l’effort."] ] },
        p: "Je sais pourquoi il vaut mieux en parler avant." },
      { t: "Ouvrir la conversation", f: ["« Papa, maman, je voudrais que tout se passe comme vous le souhaitez, le jour venu. Vous m’en parleriez ? »", "« Entre frères et sœurs, je propose qu’on s’organise dès maintenant, pour que personne ne porte tout seul. »", "« On n’est pas pressés. Je voulais juste ouvrir la porte, on en reparlera quand vous voudrez. »"], c: "Choisissez un moment calme, une fête de famille passée ou un dimanche. Commencez par les frères et sœurs, ou par vos parents : selon votre famille.",
        w: { consignes: 1, champs: [ {id:"dp_phrase", type:"area", l:"Ma phrase pour ouvrir la conversation", ph:"Maman, je voudrais qu’on parle de ce que tu souhaites, pour plus tard…"} ] },
        p: "Ma phrase pour ouvrir la conversation est écrite." },
      { t: "Respecter leurs souhaits", c: "Ce sont leurs funérailles. Notez ce qu’ils souhaitent, même en quelques mots : c’est ce qui guidera la famille.",
        w: { puces: { id:"dp_sou", k:"Ce que vous savez déjà de leurs souhaits", m:1, l:["Le lieu de repos","La cérémonie religieuse ou coutumière","Les personnes à prévenir","Ce qu’ils ne veulent pas","Une assurance ou une cotisation existante"] },
          champs: [ {id:"dp_sou_n", type:"area", l:"Leurs souhaits, en quelques mots", ph:"Repos au village, messe à la paroisse, prévenir l’association des ressortissants…"} ] },
        p: "Les souhaits que je connais sont notés." }
    ]},
    { t: "Estimer le budget", acq: "Je connais l’ordre de grandeur du budget", desc: "Les postes un par un, et ce que la famille élargie apportera vraiment.", e: [
      { t: "Les postes, un par un", c: "Ces montants varient beaucoup selon la ville, le village et les traditions. Mettez vos propres estimations : on cherche un ordre de grandeur, pas un chiffre exact.",
        w: { ex: "Une famille a estimé, pour ses parents : morgue 150 000 F, cercueil 250 000 F, transport 200 000 F, veillée 300 000 F, cérémonie 200 000 F, réception 600 000 F, habits 150 000 F, frais administratifs 50 000 F. Total : 1 900 000 F. Ce n’est qu’un exemple.", k: "Vos estimations (F)", c3: 1,
          champs: [ {id:"dp_mor", l:"Morgue"}, {id:"dp_cer", l:"Cercueil"}, {id:"dp_tra", l:"Transport"}, {id:"dp_vei", l:"Veillée"}, {id:"dp_cmo", l:"Cérémonie"}, {id:"dp_rec", l:"Réception"}, {id:"dp_hab", l:"Habits"}, {id:"dp_adm", l:"Frais administratifs"} ],
          v: function(D,H){ var t=["dp_mor","dp_cer","dp_tra","dp_vei","dp_cmo","dp_rec","dp_hab","dp_adm"].reduce(function(s,k){return s+H.N(D[k]);},0); D.dp_tot=t; if(!t) return ''; var r=H.N(D.dp_rec); return '<div class="gros"><small>Budget estimé des funérailles</small><b>'+H.F(t)+'</b><p>'+(r?'Dont réception : '+H.F(r)+', soit '+Math.round(r/t*100)+' % du total.':'Un ordre de grandeur, à revoir avec la famille.')+'</p></div>'; } },
        p: "Mon budget estimé est écrit." },
      { t: "Promesse ou argent sûr ?", c: "Le jour venu, beaucoup de proches aident. Mais une promesse n’est pas encore de l’argent : on la compte avec prudence.",
        w: { quiz: [ ["Un oncle a dit : « Je m’occuperai du cercueil. »", ["Je compte la somme en entier","Je la compte avec prudence"], 1, "Sa parole est sincère, mais sa situation peut changer d’ici là. Prévoyez une solution si elle ne vient pas."], ["L’association des ressortissants verse une somme fixée par ses règles écrites, et vos parents sont à jour.", ["Je compte la somme en entier","Je la compte avec prudence"], 0, "Des règles écrites et des cotisations à jour : c’est une aide sur laquelle on peut compter. Vérifiez le montant auprès du bureau."] ] },
        p: "Je sais distinguer une promesse d’un argent sûr." },
      { t: "Ce que la famille élargie apportera", c: "Notez seulement ce qui est probable. Mieux vaut une bonne surprise le jour venu qu’un trou à combler par une dette.",
        w: { ex: "Pour un budget de 1 900 000 F, la famille de Koffi compte 400 000 F de la famille élargie et 300 000 F de l’association. Reste à réunir entre frères et sœurs : 1 200 000 F.", champs: [ {id:"dp_fam", l:"Famille élargie, ce qui est probable (F)"}, {id:"dp_cot", l:"Cotisations, mutuelle ou association (F)"} ],
          v: function(D,H){ var t=H.N(D.dp_tot)||["dp_mor","dp_cer","dp_tra","dp_vei","dp_cmo","dp_rec","dp_hab","dp_adm"].reduce(function(s,k){return s+H.N(D[k]);},0); if(!t) return '<div class="verdict v-mid">Remplissez d’abord le budget à l’écran précédent.</div>'; var a=H.N(D.dp_fam)+H.N(D.dp_cot), r=Math.max(0,t-a), r2=Math.max(0,t-a/2); D.dp_reste=r; return '<div class="gros"><small>Reste à réunir entre frères et sœurs</small><b>'+H.F(r)+'</b><p>Si l’aide extérieure n’arrivait qu’à moitié, il faudrait '+H.F(r2)+'.</p></div>'; } },
        p: "Je connais la somme à réunir entre frères et sœurs." }
    ]},
    { t: "La caisse familiale", acq: "Notre caisse familiale a ses règles", desc: "Chacun selon ses moyens, un compte séparé, et des règles écrites.", e: [
      { t: "Chacun selon ses moyens", c: "Chacun verse ce qu’il peut, sans comparaison ni reproche. Ce qui compte, c’est la régularité.",
        w: { ex: "Awa et ses quatre frères et sœurs versent 50 000, 40 000, 25 000, 20 000 et 15 000 F. Soit 150 000 F par mois : 1 200 000 F réunis en 8 mois.", champs: [ {id:"dp_nb", l:"Frères et sœurs qui participent (vous compris)"}, {id:"dp_vm", l:"Total versé chaque mois par tous (F)"}, {id:"dp_dej", l:"Déjà réuni (F)"} ],
          v: function(D,H){ var b=H.N(D.dp_reste)||H.N(D.dp_tot), v=H.N(D.dp_vm), n=H.N(D.dp_nb), d=H.N(D.dp_dej); if(!b||!v) return ''; var m=Math.max(0,Math.ceil((b-d)/v)); D.dp_mois=m; return '<div class="gros"><small>Objectif de la caisse : '+H.F(b)+'</small><b>'+(m?'atteint dans '+m+' mois':'déjà atteint')+'</b><p>'+(n?'En moyenne '+H.F(v/n)+' par personne et par mois.':'')+'</p></div>'; } },
        p: "Le versement de chacun est convenu." },
      { t: "Où garder l’argent", c: "L’argent de la famille ne doit pas se mélanger avec celui d’une seule personne. C’est ce qui préserve la confiance.",
        w: { puces: { id:"dp_ou", k:"Où gardez-vous la caisse ?", l:["Compte séparé à deux signataires","Compte personnel de l’aîné","Mobile money d’un seul membre","À la maison","Prêté en attendant"] },
          v: function(D){ var R={"Compte séparé à deux signataires":["v-ok","Le meilleur choix : l’argent est à part, et aucun retrait ne se fait seul."],"Compte personnel de l’aîné":["v-mid","La confiance est là, mais l’argent se mélange. Ouvrez un compte séparé, avec un second signataire."],"Mobile money d’un seul membre":["v-mid","Pratique pour collecter. Transférez régulièrement vers un compte séparé à deux signataires."],"À la maison":["v-ko","Exposé au vol, au feu, et aux petits emprunts. À éviter."],"Prêté en attendant":["v-ko","Non : l’argent doit être disponible le jour où la famille en a besoin."]}[D.dp_ou]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "Nous avons choisi où garder la caisse." },
      { t: "Les règles écrites", c: "Trois réponses écrites évitent la plupart des disputes. Rédigez-les ensemble, puis partagez-les dans le groupe de la famille.",
        w: { champs: [ {id:"dp_r_dec", type:"area", l:"Qui décide d’un retrait ?", ph:"Deux signataires, après accord du groupe."}, {id:"dp_r_imp", type:"area", l:"Que faire si quelqu’un ne verse pas ?", ph:"On en parle en privé ; il peut verser moins, mais il prévient."}, {id:"dp_r_res", type:"area", l:"À quoi sert l’argent si on n’en a pas besoin ?", ph:"Il reste la caisse de la famille : santé des parents, puis projet commun."} ] },
        p: "Nos règles sont écrites." }
    ]},
    { t: "Assurance obsèques et prévoyance", acq: "Je sais quelles questions poser", desc: "Ce que couvre une assurance obsèques, ses limites, et les autres formes d’entraide.", e: [
      { t: "Ce que c’est", f: ["Une cotisation régulière, et un capital versé à la famille au décès de la personne assurée.", "Des limites : un délai de carence au début du contrat, un âge maximum pour souscrire, des frais.", "Une compagnie agréée dans le cadre de la CIMA, la réglementation commune des assurances de la région."], c: "L’assurance obsèques complète la caisse familiale. Elle ne la remplace pas : lisez toujours les conditions.",
        w: { consignes: 1, quiz: [ ["Un contrat signé il y a un mois paie toujours le capital.", ["Oui, dès la signature","Pas forcément"], 1, "Souvent, un délai de carence s’applique au début : pendant ce délai, le capital n’est pas versé, sauf cas prévus au contrat."], ["On peut assurer un parent à n’importe quel âge.", ["Oui","Pas forcément"], 1, "Les contrats fixent souvent un âge limite pour souscrire. Renseignez-vous tôt."] ] },
        p: "Je sais ce que couvre une assurance obsèques." },
      { t: "Les questions à poser", c: "Avant de signer, posez ces questions et demandez les réponses par écrit. Pensez aussi aux mutuelles et aux associations de ressortissants.",
        w: { puces: [ { id:"dp_qs", k:"Les questions que je poserai", m:1, l:["La compagnie est-elle agréée ?","Quel est le délai de carence ?","Quel est l’âge limite ?","Quel capital, et en combien de jours ?","Quels frais, et que se passe-t-il si j’arrête ?","Qui est le bénéficiaire ?"] }, { id:"dp_piste", k:"La piste que vous étudierez", l:["Assurance obsèques","Mutuelle ou association de ressortissants","La caisse familiale seule"] } ],
          v: function(D){ var n=(D.dp_qs||[]).length; if(!n&&!D.dp_piste) return ''; return '<div class="verdict '+(n>=5?'v-ok':'v-mid')+'">'+n+' question'+(n>1?'s':'')+' sur 6 prête'+(n>1?'s':'')+'.'+(n<5?' Ajoutez les autres : chacune peut changer la valeur du contrat.':' Vous êtes prêt à comparer.')+'</div>'; } },
        p: "Mes questions sont prêtes." }
    ]},
    { t: "Les papiers et l’après", acq: "Je sais où sont les papiers", desc: "Les papiers rassemblés, un plafond pour la réception, le parent survivant protégé.", e: [
      { t: "Les papiers des parents", c: "Le jour venu, chercher un papier coûte du temps et parfois de l’argent. Rassemblez-les dès maintenant, avec vos parents.",
        w: { puces: { id:"dp_pap", k:"Ce qui est déjà rassemblé", m:1, l:["Actes d’état civil","Pièces d’identité","Relevés de comptes et mobile money","Contrats d’assurance","Papiers de retraite","Papiers du terrain ou de la maison","Liste des dettes et créances","Cartes de mutuelle ou d’association"] },
          champs: [ {id:"dp_garde", type:"txt", large:1, l:"Qui sait où ils sont rangés ?", ph:"Maman et moi : dans la mallette de l’armoire"} ],
          v: function(D){ var n=(D.dp_pap||[]).length; if(!n) return ''; return '<div class="gros"><small>Papiers rassemblés</small><b>'+n+' sur 8</b><p>'+(n<8?'Complétez les autres pas à pas, avec vos parents.':'Tout est réuni. Gardez une copie en lieu sûr.')+'</p></div>'; } },
        p: "Les papiers sont rassemblés, et quelqu’un sait où ils sont." },
      { t: "Un plafond pour la réception", c: "La réception honore le défunt et ceux qui viennent. Fixer son plafond à l’avance, ensemble, évite de s’endetter sous la pression du moment.",
        w: { ex: "La famille d’Ibrahim a fixé la réception à 500 000 F. Le jour venu, quand on a proposé plus, la réponse était déjà décidée par tous.", champs: [ {id:"dp_plaf", l:"Plafond de la réception (F)"} ],
          v: function(D,H){ var p=H.N(D.dp_plaf), r=H.N(D.dp_rec); if(!p) return ''; if(!r) return '<div class="gros"><small>Plafond de la réception</small><b>'+H.F(p)+'</b></div>'; return p>=r?'<div class="verdict v-ok">Votre plafond couvre la réception prévue au budget ('+H.F(r)+'). Tenez-vous-y le jour venu.</div>':'<div class="verdict v-mid">Votre plafond est sous la réception prévue au budget ('+H.F(r)+'). Ajustez l’un ou l’autre, pour que les deux disent la même chose.</div>'; } },
        p: "Le plafond de la réception est fixé." },
      { t: "Protéger le parent survivant", f: ["Personne ne prend ses biens, sa maison ou ses papiers pendant le deuil.", "On vérifie ses revenus : pension de réversion, loyers, aide des enfants.", "Une personne de confiance l’accompagne dans les démarches."], c: "Après les funérailles, le parent qui reste a besoin de calme et de sécurité. C’est aussi cela, honorer celui qui est parti.",
        w: { consignes: 1, champs: [ {id:"dp_surv", type:"area", l:"Ce que nous ferons pour le parent survivant", ph:"Je l’accompagne pour la pension ; mon frère verse 30 000 F par mois…"} ] },
        p: "Ce que nous ferons pour le parent survivant est écrit." }
    ]}
  ],
  fin: {
    k: "Ma fiche prévoyance familiale", titre: "Votre famille est prête, avec sérénité",
    fiche: [
      ["Budget estimé des funérailles", function(D,H){ var t=["dp_mor","dp_cer","dp_tra","dp_vei","dp_cmo","dp_rec","dp_hab","dp_adm"].reduce(function(s,k){return s+H.N(D[k]);},0); return t?H.F(t)+' (ordre de grandeur)':''; }],
      ["À réunir entre frères et sœurs", function(D,H){ return H.N(D.dp_reste)?H.F(H.N(D.dp_reste)):''; }],
      ["Caisse familiale", function(D,H){ var v=H.N(D.dp_vm), n=H.N(D.dp_nb); return v?H.F(v)+' par mois'+(n?', '+n+' participants':''):''; }],
      ["Objectif atteint dans", function(D,H){ var b=H.N(D.dp_reste)||H.N(D.dp_tot), v=H.N(D.dp_vm); if(!b||!v) return ''; var m=Math.max(0,Math.ceil((b-H.N(D.dp_dej))/v)); return m?m+' mois':'déjà atteint'; }],
      ["Où l’argent est gardé", function(D){ return D.dp_ou||''; }],
      ["Plafond de la réception", function(D,H){ return H.N(D.dp_plaf)?H.F(H.N(D.dp_plaf)):''; }],
      ["Papiers rassemblés", function(D){ var n=(D.dp_pap||[]).length; return n?n+' sur 8':''; }],
      ["Ma phrase pour en parler", function(D){ return D.dp_phrase||''; }]
    ],
    suite: { t: "Après le décès d’un proche", p: "Le jour venu, cette leçon vous guide dans les démarches et les décisions d’argent des premières semaines, pas à pas.", lien: "apres-un-deces.html", b: "Lire la leçon" }
  }
};
