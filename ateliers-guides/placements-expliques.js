/* Atelier guidé · DAT, OPCVM, FCPE : les placements expliqués */
window.ATELIER = {
  id: "placements-expliques",
  titre: "DAT, OPCVM, FCPE : les placements expliqués",
  h1: "Votre réserve est prête. Faites travailler le reste, sans vous perdre.",
  voix: "auto",
  question: {
    t: "Vous avez 1 000 000 F de côté, en plus de votre réserve. Que faites-vous en premier ?",
    r: [
      ["a", "Je le place là où le rendement est le plus élevé.", "C’est le réflexe le plus courant. Mais un rendement élevé va avec plus de risque ou moins de disponibilité. On commence par savoir quand vous aurez besoin de cet argent. C’est le chapitre 1.", false],
      ["b", "Je fixe d’abord quand j’aurai besoin de cet argent.", "C’est le bon point de départ : l’horizon décide du placement, pas l’inverse. C’est le chapitre 1.", true]
    ]
  },
  chapitres: [
    { t: "Avant de placer", acq: "Je sais ce que je peux placer", desc: "Réserve en place, somme à immobiliser, horizon fixé.", e: [
      { t: "La réserve d’abord", c: "On ne place que l’argent dont on n’a pas besoin demain. La réserve de sécurité reste à part, disponible.",
        w: { quiz: [
          ["Je n’ai pas encore de réserve, mais un ami me parle d’un bon placement.", ["Je place tout de suite","Je construis d’abord ma réserve"], 1, "Sans réserve, la première urgence vous obligera à retirer au mauvais moment, parfois avec une pénalité ou une perte."],
          ["Ma réserve couvre mes mois essentiels. Il me reste de l’épargne en plus.", ["Je peux réfléchir à placer ce surplus","Je dois tout garder en réserve"], 0, "Exactement : la réserve protège, le surplus peut travailler."],
          ["Je paie les frais d’école dans quatre mois.", ["Cet argent peut être placé longtemps","Cet argent doit rester disponible"], 1, "Une dépense proche et connue n’est pas de l’argent à immobiliser."]
        ] },
        p: "Je sais que ma réserve passe avant tout placement." },
      { t: "Ce que je peux immobiliser", c: "Partez de votre épargne totale. Retirez la réserve, puis ce que vous dépenserez dans l’année. Le reste peut être placé.",
        w: { ex: "Koffi a 2 500 000 F d’épargne. Sa réserve fait 900 000 F et il prévoit 400 000 F pour la rentrée et des funérailles. Il peut placer 2 500 000 − 900 000 − 400 000 = 1 200 000 F.", k: "Vos chiffres", c3: 1, champs: [ {id:"pl_tot", l:"Mon épargne totale (F)"}, {id:"pl_res", l:"Ma réserve de sécurité (F)"}, {id:"pl_proj", l:"Dépenses prévues dans l’année (F)"} ],
          v: function(D,H){ var t=H.N(D.pl_tot); if(!t) return ''; var s=t-H.N(D.pl_res)-H.N(D.pl_proj); if(s<=0) return '<div class="verdict v-mid">Pour l’instant, tout votre argent a déjà un rôle. Ce n’est pas un échec : on renforce d’abord la réserve, puis on reviendra placer.</div>'; return '<div class="gros"><small>Ce que vous pouvez placer</small><b>'+H.F(s)+'</b><p>C’est la somme de travail pour la suite de l’atelier.</p></div>'; } },
        p: "Ma somme à placer est écrite." },
      { t: "Mon horizon", c: "L’horizon, c’est le moment où vous aurez besoin de cet argent. Plus il est loin, plus vous pouvez accepter que la valeur bouge en chemin.",
        w: { champs: [ {id:"pl_but", l:"Cet argent servira à…", type:"txt", large:1, ph:"terrain, commerce, études des enfants, retraite"} ],
          puces: { id:"pl_hor", k:"Quand en aurez-vous besoin ?", l:["Moins d’un an","1 à 3 ans","3 à 5 ans","Plus de 5 ans"] },
          v: function(D){ var R={"Moins d’un an":["v-mid","Horizon court : on cherche d’abord la disponibilité et la sécurité. Le rendement passe après."],"1 à 3 ans":["v-ok","Horizon moyen : des placements sûrs à échéance fixe ont toute leur place."],"3 à 5 ans":["v-ok","Horizon assez long : une petite part peut accepter des variations."],"Plus de 5 ans":["v-ok","Horizon long : le temps permet d’absorber les baisses. Les placements de marché deviennent envisageables."]}[D.pl_hor]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "Mon horizon est fixé." }
    ]},
    { t: "Le triangle", acq: "Je connais le triangle rendement, risque, disponibilité", desc: "Aucun placement ne gagne sur les trois tableaux.", e: [
      { t: "Trois sommets", f: ["Rendement : ce que le placement rapporte, en intérêts, en coupons ou en hausse de valeur.", "Risque : la possibilité de récupérer moins que prévu, ou de voir la valeur baisser en chemin.", "Disponibilité : le temps et le coût pour récupérer votre argent."], c: "Un placement peut être bon sur deux sommets, rarement sur les trois. Celui qui promet les trois mérite votre méfiance.",
        w: { consignes: 1, quiz: [
          ["On vous promet un gros rendement, sans aucun risque, retirable à tout moment.", ["C’est une belle occasion","C’est un signal d’alerte"], 1, "Les trois à la fois, cela n’existe pas. C’est le profil typique d’une arnaque."],
          ["Un placement bloqué deux ans rapporte un peu plus qu’un compte d’épargne.", ["C’est logique","C’est suspect"], 0, "Vous renoncez à la disponibilité : il est normal d’être payé un peu plus pour cela."]
        ] },
        p: "Je connais les trois sommets du triangle." },
      { t: "Ce que la hausse des prix mange", c: "Un placement qui rapporte moins que la hausse des prix vous fait perdre du pouvoir d’achat. Les taux ci-dessous sont des exemples : mettez les vôtres.",
        w: { ex: "Affoué place 1 000 000 F à 4 % par an (exemple). Si les prix montent de 2 % (ordre de grandeur), elle gagne 40 000 F, mais seulement environ 20 000 F en pouvoir d’achat.", k: "Votre essai", c3: 1, champs: [ {id:"pl_m", l:"Montant placé (F)"}, {id:"pl_t", l:"Taux annuel, exemple (%)", ph:"4"}, {id:"pl_i", l:"Hausse des prix, exemple (%)", ph:"2"} ],
          v: function(D,H){ var m=H.N(D.pl_m), t=H.N(D.pl_t), i=H.N(D.pl_i); if(!m||!t) return ''; var g=m*t/100, r=m*(t-i)/100; return '<div class="gros"><small>Sur un an, avant frais et impôts</small><b>'+H.F(g)+' d’intérêts</b><p>'+(r>0?'Environ '+H.F(r)+' de gain réel une fois la hausse des prix retirée.':'Votre pouvoir d’achat baisse d’environ '+H.F(-r)+' : le placement ne suit pas les prix.')+'</p></div>'; } },
        p: "J’ai calculé mon gain réel sur un exemple." }
    ]},
    { t: "Sans risque de marché", acq: "Je connais les placements sans risque de marché", desc: "Compte d’épargne, dépôt à terme, emprunts d’État.", e: [
      { t: "Trois placements à valeur connue", f: ["Compte d’épargne : disponible, rémunéré modestement, dans une banque ou une microfinance agréée.", "Dépôt à terme (DAT) : une somme bloquée pour une durée fixée, à un taux fixé dès le départ.", "Emprunt d’État par appel public à l’épargne : vous prêtez à un État de la zone, il vous verse des intérêts réguliers, puis rembourse à l’échéance."], c: "Leur valeur ne monte et ne descend pas avec la Bourse. Ce n’est pas zéro risque : on dépend de la solidité de l’établissement ou de l’État.",
        w: { consignes: 1, quiz: [
          ["Je casse mon DAT avant l’échéance.", ["Je garde tous les intérêts prévus","Je peux perdre une partie des intérêts"], 1, "La sortie anticipée est souvent pénalisée. Lisez cette clause avant de signer."],
          ["Je revends mon obligation d’État avant l’échéance.", ["Le prix peut être différent du prix payé","Je récupère toujours exactement ma mise"], 0, "Avant l’échéance, le prix dépend de l’offre et de la demande. Gardée jusqu’au bout, elle est remboursée comme prévu."]
        ] },
        p: "Je connais les trois placements sans risque de marché." },
      { t: "Mon DAT en chiffres", c: "Un DAT, c’est simple à calculer. Ce qui compte : que sa durée tienne dans votre horizon.",
        w: { ex: "Fatou bloque 500 000 F sur 12 mois à 4 % par an (exemple). Elle reçoit environ 500 000 × 4 % = 20 000 F d’intérêts à l’échéance, avant impôts.", k: "Votre DAT", c3: 1, champs: [ {id:"pl_dm", l:"Montant (F)"}, {id:"pl_dd", l:"Durée (mois)", ph:"12"}, {id:"pl_dt", l:"Taux annuel, exemple (%)", ph:"4"} ],
          v: function(D,H){ var m=H.N(D.pl_dm), d=H.N(D.pl_dd), t=H.N(D.pl_dt); if(!m||!d||!t) return ''; var g=m*t/100*d/12, lim={"Moins d’un an":12,"1 à 3 ans":36,"3 à 5 ans":60,"Plus de 5 ans":999}[D.pl_hor]; var h='<div class="gros"><small>Intérêts estimés, avant impôts</small><b>'+H.F(g)+'</b><p>Vous récupérez environ '+H.F(m+g)+' dans '+d+' mois.</p></div>'; if(lim&&d>lim) h+='<div class="verdict v-ko">Cette durée dépasse votre horizon : l’argent serait bloqué quand vous en aurez besoin.</div>'; else if(lim) h+='<div class="verdict v-ok">Cette durée tient dans votre horizon.</div>'; return h; } },
        p: "J’ai calculé un DAT avec mes chiffres." }
    ]},
    { t: "Les placements de marché", acq: "Je comprends les OPCVM, le FCPE et la Bourse", desc: "Placements collectifs, actions et obligations : la valeur bouge.", e: [
      { t: "Un panier géré pour vous", c: "Un OPCVM met en commun l’argent de nombreux épargnants. Vous achetez des parts, et leur valeur suit celle du panier.",
        w: { ex: "Moussa met 300 000 F dans un fonds dont la part vaut 10 000 F (exemple) : il a 30 parts. Si la part passe à 10 600 F, il a 318 000 F. Si elle baisse à 9 500 F, il a 285 000 F.", k: "Votre essai", c3: 1, champs: [ {id:"pl_om", l:"Montant investi (F)"}, {id:"pl_o0", l:"Valeur de la part à l’achat (F)"}, {id:"pl_o1", l:"Valeur de la part plus tard (F)"} ],
          v: function(D,H){ var m=H.N(D.pl_om), a=H.N(D.pl_o0), b=H.N(D.pl_o1); if(!m||!a) return ''; var n=m/a; if(!b) return '<div class="gros"><small>Vos parts</small><b>'+(Math.round(n*100)/100).toLocaleString('fr-FR')+' parts</b></div>'; var v=n*b, e=v-m; return '<div class="gros"><small>Votre placement vaut maintenant</small><b>'+H.F(v)+'</b><p>'+(e>=0?'Soit '+H.F(e)+' de plus, avant frais.':'Soit '+H.F(-e)+' de moins. Ce n’est une perte que si vous vendez maintenant.')+'</p></div>'; } },
        p: "Je sais calculer la valeur de mes parts." },
      { t: "FCP, SICAV, FCPE", c: "Dans la zone UEMOA, les OPCVM sont gérés par une société de gestion (SGO) et agréés par le régulateur, l’AMF-UMOA.",
        w: { quiz: [
          ["Avec une SICAV, je deviens…", ["actionnaire de la société d’investissement","prêteur de la société de gestion"], 0, "Une SICAV est une société : vos parts sont des actions. Un FCP, lui, est une copropriété de titres."],
          ["Un FCPE est proposé…", ["par mon employeur, à ses salariés","par n’importe quel vendeur au marché"], 0, "C’est l’épargne salariale : l’entreprise propose le fonds, parfois avec un abondement et des règles de blocage."],
          ["Un OPCVM monétaire et un OPCVM actions…", ["ont le même risque","n’ont pas le même risque"], 1, "Le monétaire bouge peu. Le fonds actions peut monter ou baisser fortement : il demande un horizon plus long."]
        ] },
        p: "Je fais la différence entre FCP, SICAV et FCPE." },
      { t: "Actions et obligations à la Bourse", f: ["J’ouvre un compte-titres auprès d’une SGI, seule habilitée à passer mes ordres à la Bourse régionale (BRVM).", "Une action est une part d’entreprise : elle peut verser un dividende, et son cours monte ou baisse.", "Une obligation est un prêt : elle verse des intérêts, puis rembourse à l’échéance.", "Je n’y mets que l’argent que je peux laisser plus de cinq ans."], c: "La Bourse n’est pas un jeu de chance : c’est un marché où le temps travaille pour vous, à condition de ne pas avoir besoin de vendre demain.",
        p: "Je sais comment on accède à la Bourse régionale (BRVM)." }
    ]},
    { t: "Mon choix", acq: "J’ai écrit mon choix de principe", desc: "Le bon placement selon l’horizon, et les pièges à éviter.", e: [
      { t: "Le placement selon l’horizon", c: "Moins d’un an : disponible. Un à trois ans : sûr, à échéance fixe. Plus de cinq ans : une part sur les marchés devient possible.",
        w: { puces: { id:"pl_type", k:"Pour votre somme, vous penchez vers…", l:["Compte d’épargne","Dépôt à terme (DAT)","Emprunt d’État","OPCVM monétaire ou obligataire","OPCVM actions ou diversifié","Actions à la Bourse (BRVM)"] },
          v: function(D){ if(!D.pl_type) return ''; var H4=["Moins d’un an","1 à 3 ans","3 à 5 ans","Plus de 5 ans"], h=H4.indexOf(D.pl_hor); if(h<0) return '<div class="verdict v-mid">Fixez d’abord votre horizon (chapitre 1) pour vérifier la cohérence.</div>'; var min={"Compte d’épargne":0,"Dépôt à terme (DAT)":0,"Emprunt d’État":2,"OPCVM monétaire ou obligataire":1,"OPCVM actions ou diversifié":3,"Actions à la Bourse (BRVM)":3}[D.pl_type]; if(h>=min) return '<div class="verdict v-ok">Cohérent avec votre horizon ('+D.pl_hor.toLowerCase()+').</div>'; if(h===min-1) return '<div class="verdict v-mid">Possible, mais un peu juste pour votre horizon. Gardez-y une petite part seulement.</div>'; return '<div class="verdict v-ko">Trop risqué ou trop bloqué pour votre horizon. Vous pourriez devoir sortir au mauvais moment.</div>'; } },
        p: "J’ai vérifié que mon choix colle à mon horizon." },
      { t: "Repérer les arnaques", c: "Une arnaque se reconnaît à trois signes : un rendement garanti trop élevé, une structure non agréée, et la pression pour décider vite.",
        w: { quiz: [
          ["« 10 % par mois, garanti. »", ["Je me méfie","Je saisis l’occasion"], 0, "Un rendement garanti aussi élevé n’existe pas dans un placement sérieux."],
          ["« Il ne reste que deux places, il faut payer ce soir. »", ["C’est de la pression","C’est une chance"], 0, "Un vrai placement vous laisse le temps de lire et de réfléchir."],
          ["« Notre société n’a pas besoin d’agrément. »", ["C’est rassurant","C’est un signal d’alerte"], 1, "Les placements proposés au public doivent passer par des structures agréées, contrôlées par le régulateur."]
        ] },
        p: "Je sais reconnaître une arnaque." },
      { t: "Avant de signer", c: "Quelques vérifications suffisent à éviter la plupart des mauvaises surprises. Cochez ce que vous ferez.",
        w: { puces: { id:"pl_chk", k:"Je vérifie…", m:1, l:["L’agrément de la structure","Le nom de la SGO ou de la SGI","Les frais d’entrée et de gestion","La durée recommandée","Les conditions de sortie","Ce qui se passe si la valeur baisse"] },
          v: function(D){ var n=(D.pl_chk||[]).length; if(!n) return ''; return n>=5?'<div class="verdict v-ok">'+n+' vérifications sur 6 : vous signez en connaissance de cause.</div>':'<div class="verdict v-mid">'+n+' vérifications sur 6. Ajoutez-en encore quelques-unes avant de signer.</div>'; } },
        p: "Ma liste de vérifications est prête." },
      { t: "Mon choix de principe", c: "Répartissez votre somme en trois parts : disponible, sans risque de marché, sur les marchés. C’est un principe, pas un conseil d’achat.",
        w: { ex: "Ibrahim place 1 200 000 F pour un terrain dans 4 ans : 20 % disponible, 60 % en DAT ou emprunt d’État, 20 % en OPCVM. Soit 240 000 F, 720 000 F et 240 000 F.", k: "Votre répartition (%)", c3: 1, champs: [ {id:"pl_rd", l:"Disponible (%)"}, {id:"pl_rs", l:"Sans risque de marché (%)"}, {id:"pl_rm", l:"Sur les marchés (%)"}, {id:"pl_phrase", l:"Mon choix de principe, en une phrase", type:"area", ph:"Je garde… disponible, je place… à échéance fixe, et je ne mets sur les marchés que…"} ],
          v: function(D,H){ var a=H.N(D.pl_rd), b=H.N(D.pl_rs), c=H.N(D.pl_rm), t=a+b+c; if(!t) return ''; if(Math.abs(t-100)>0.5) return '<div class="verdict v-mid">Votre total fait '+t+' %. Ajustez pour arriver à 100 %.</div>'; var s=H.N(D.pl_tot)-H.N(D.pl_res)-H.N(D.pl_proj); if(s<=0) return '<div class="verdict v-ok">Répartition complète : 100 %.</div>'; return '<div class="gros"><small>Sur '+H.F(s)+'</small><b>'+H.F(s*a/100)+' · '+H.F(s*b/100)+' · '+H.F(s*c/100)+'</b><p>Disponible · sans risque de marché · sur les marchés.</p></div>'; } },
        p: "Mon choix de principe est écrit." }
    ]}
  ],
  fin: {
    k: "Ma fiche placements", titre: "Votre choix de principe est posé",
    fiche: [
      ["Somme à placer", function(D,H){ var t=H.N(D.pl_tot); if(!t) return ''; var s=t-H.N(D.pl_res)-H.N(D.pl_proj); return s>0?H.F(s):'Réserve à renforcer d’abord'; }],
      ["Cet argent servira à", function(D){ return D.pl_but||''; }],
      ["Mon horizon", function(D){ return D.pl_hor||''; }],
      ["Gain réel estimé sur un an", function(D,H){ var m=H.N(D.pl_m), t=H.N(D.pl_t); if(!m||!t) return ''; return H.F(m*(t-H.N(D.pl_i))/100)+' (exemple)'; }],
      ["Placement envisagé", function(D){ return D.pl_type||''; }],
      ["Ma répartition", function(D,H){ var a=H.N(D.pl_rd), b=H.N(D.pl_rs), c=H.N(D.pl_rm); return (a+b+c)?a+' % disponible · '+b+' % sans risque de marché · '+c+' % marchés':''; }],
      ["Je vérifie avant de signer", function(D){ return (D.pl_chk||[]).join(', '); }],
      ["Mon choix de principe", function(D){ return D.pl_phrase||''; }]
    ],
    suite: { t: "Mes premiers pas en Bourse", p: "Vous avez une part pour le long terme ? Le cours suivant vous apprend à lire le marché de la Bourse régionale (BRVM), pas à pas.", lien: "premiers-pas-bourse.html", b: "Ouvrir le cours" }
  }
};
