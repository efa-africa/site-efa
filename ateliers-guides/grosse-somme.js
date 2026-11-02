/* Atelier guidé · Recevoir une grosse somme : décider avant de la recevoir */
window.ATELIER = {
  id: "grosse-somme",
  titre: "Recevoir une grosse somme",
  h1: "Une grosse somme arrive. Décidez avant qu’elle ne reparte.",
  voix: "auto",
  question: {
    t: "Votre prime de 500 000 F arrive vendredi. Quand décidez-vous de ce que vous en faites ?",
    r: [
      ["a", "Quand elle sera sur mon compte.", "C’est ce que font la plupart d’entre nous. Mais le jour J, les envies et les demandes arrivent en même temps que l’argent. Cet atelier vous fait décider avant.", false],
      ["b", "Avant qu’elle arrive.", "Exactement. Une somme déjà répartie se protège bien mieux. C’est ce que vous allez faire, part par part.", true]
    ]
  },
  chapitres: [
    { t: "Pourquoi décider avant", acq: "Je sais pourquoi décider avant", desc: "L’argent sans plan part vite, et les demandes arrivent avec lui.", e: [
      { t: "L’argent sans plan", c: "Une somme qui arrive sans plan se dépense en petits morceaux. Au bout de quelques semaines, on ne sait plus où elle est passée.",
        w: { quiz: [
          ["Koffi reçoit son 13e mois sans rien avoir prévu. Un mois plus tard, il lui reste…", ["Presque tout","Souvent peu de chose"], 1, "Sans plan, chaque petite dépense paraît raisonnable. Mises bout à bout, elles vident la somme."],
          ["Fatou a écrit sa répartition une semaine avant son tour de tontine. Le jour J…", ["Elle exécute son plan","Elle décide sous la pression"], 0, "La décision est déjà prise : il ne reste qu’à faire les virements."]
        ] },
        p: "Je sais pourquoi une somme sans plan part vite." },
      { t: "Les sollicitations", c: "Quand une somme arrive, cela se sait. Les demandes sont normales : on leur prépare une réponse avant, au calme.",
        w: { puces: { id:"gs_sol", k:"Qui risque de vous solliciter ?", m:1, l:["Famille proche","Famille élargie","Amis","Collègues","Vendeurs et commerçants","Moi-même : mes envies"] },
          v: function(D){ var n=(D.gs_sol||[]).length; if(!n) return ''; return '<div class="verdict v-mid">'+n+' source'+(n>1?'s':'')+' de sollicitation repérée'+(n>1?'s':'')+'. Chacune aura sa réponse, décidée à l’avance : c’est le rôle de la part famille et de la part plaisir.</div>'; } },
        p: "J’ai repéré qui risque de me solliciter." }
    ]},
    { t: "Le montant et la date", acq: "Je connais mon montant net et ma date", desc: "Ce qui arrive vraiment sur le compte, et quand.", e: [
      { t: "Ce qui arrive vraiment", c: "On ne répartit pas le montant annoncé. On répartit ce qui arrive réellement, une fois les retenues et les avances enlevées.",
        w: { ex: "Awa attend une prime annoncée à 800 000 F. Retenues et frais : 120 000 F. Elle avait déjà pris une avance de 100 000 F. Ce qu’elle recevra vraiment : 580 000 F.",
          champs: [ {id:"gs_brut", l:"Montant annoncé (F)"}, {id:"gs_ret", l:"Retenues et frais : impôts, cotisations, retrait (F)"}, {id:"gs_av", l:"Déjà pris ou promis d’avance (F)"} ],
          v: function(D,H){ var b=H.N(D.gs_brut), r=H.N(D.gs_ret), a=H.N(D.gs_av); if(!b) return ''; var n=Math.max(0,b-r-a); D.gs_net=n; var e=b-n; return '<div class="gros"><small>Ce que vous recevrez vraiment</small><b>'+H.F(n)+'</b><p>'+(e?H.F(e)+' de moins que le montant annoncé. C’est ce net qu’on va répartir.':'C’est ce montant qu’on va répartir.')+'</p></div>'; } },
        p: "Mon montant net réellement reçu est écrit." },
      { t: "Quoi et quand", c: "Connaître la date, c’est savoir combien de temps vous avez pour décider. Ce temps-là est précieux.",
        w: { puces: { id:"gs_type", k:"Ce qui arrive", l:["Une prime","Un tour de tontine","Un 13e mois","Un rappel de salaire","Un héritage","Autre rentrée"] },
          champs: [ {id:"gs_date", l:"Date prévue de réception", type:"txt", ph:"vendredi 28 novembre", large:1} ],
          v: function(D,H){ if(!D.gs_type&&!D.gs_date) return ''; var n=H.N(D.gs_net); return '<div class="gros"><small>'+H.esc(D.gs_type||'Votre rentrée')+(D.gs_date?' · '+H.esc(D.gs_date):'')+'</small><b>'+(n?H.F(n)+' à répartir':'Montant net à préciser')+'</b><p>'+(D.gs_date?'Vous avez jusqu’à cette date pour décider. Pas plus tard.':'Ajoutez la date : elle fixe votre délai pour décider.')+'</p></div>'; } },
        p: "Je sais ce qui arrive, et quand." }
    ]},
    { t: "La répartition en parts", acq: "Je sais répartir en parts", desc: "Dettes chères, réserve, projet, famille, plaisir : en montants.", e: [
      { t: "Dans quel ordre ?", c: "Une dette chère coûte plus que presque tout ce qu’une somme peut rapporter. On la solde d’abord, puis on sécurise.",
        w: { quiz: [
          ["Moussa a un prêt qui lui coûte cher chaque mois, et une envie de nouveau téléphone.", ["D’abord le prêt","D’abord le téléphone"], 0, "Chaque mois de dette chère grignote son revenu. Le téléphone peut attendre la part plaisir."],
          ["Affoué n’a aucune réserve. Elle veut tout mettre dans son projet de commerce.", ["Tout dans le projet","D’abord une réserve"], 1, "Sans réserve, le premier coup dur obligera à reprendre l’argent du projet, ou à emprunter."]
        ] },
        p: "Je connais l’ordre : dettes chères, puis réserve." },
      { t: "Les deux premières parts", c: "Les dettes chères, puis ce qui manque à votre réserve de sécurité. Ce qui reste ensuite, vous le répartissez librement.",
        w: { ex: "Moussa reçoit 1 200 000 F net. Il solde un prêt cher de 300 000 F, puis complète sa réserve avec 250 000 F. Il lui reste 650 000 F à répartir.",
          champs: [ {id:"gs_det", l:"Dettes chères à solder (F)"}, {id:"gs_res", l:"Ce qui manque à ma réserve (F)"} ],
          v: function(D,H){ var n=H.N(D.gs_net), d=H.N(D.gs_det), r=H.N(D.gs_res); if(!n) return '<div class="verdict v-mid">Indiquez d’abord votre montant net au chapitre 2.</div>'; if(!d&&!r) return ''; var x=n-d-r; if(x<0) return '<div class="verdict v-ko">Ces deux parts dépassent votre net de '+H.F(-x)+'. Soldez la dette la plus chère en premier, et complétez la réserve ensuite, mois après mois.</div>'; return '<div class="gros"><small>Après dettes et réserve</small><b>'+H.F(x)+' à répartir</b><p>'+H.F(d+r)+' déjà affectés à votre sécurité.</p></div>'; } },
        p: "Mes deux premières parts sont chiffrées." },
      { t: "Projet, famille, plaisir", c: "Une part pour un projet, c’est ce qui fait passer du cercle à la spirale : le tour de tontine ne repart pas en entier, une partie reste et grandit.",
        w: { ex: "Sur ses 650 000 F, Moussa met 350 000 F pour son terrain, 200 000 F pour la famille et 100 000 F pour se faire plaisir. Tout est affecté avant le jour J.",
          c3: 1, champs: [ {id:"gs_pro", l:"Projet (F)"}, {id:"gs_fam", l:"Famille (F)"}, {id:"gs_pla", l:"Plaisir (F)"} ],
          v: function(D,H){ var n=H.N(D.gs_net), P=[["Dettes chères",H.N(D.gs_det)],["Réserve",H.N(D.gs_res)],["Projet",H.N(D.gs_pro)],["Famille",H.N(D.gs_fam)],["Plaisir",H.N(D.gs_pla)]]; var t=P.reduce(function(s,x){return s+x[1];},0); D.gs_garde=H.N(D.gs_res)+H.N(D.gs_pro); if(!t) return ''; var l=P.map(function(x){ return x[0]+' : '+H.F(x[1])+(n?' ('+Math.round(x[1]/n*100)+' %)':''); }).join('<br>'); var h='<div class="gros"><small>Votre répartition</small><b>'+H.F(t)+(n?' sur '+H.F(n):'')+'</b><p>'+l+'<br>Part gardée (réserve + projet) : '+H.F(D.gs_garde)+'</p></div>'; if(!n) return h; var e=n-t; return h+(e===0?'<div class="verdict v-ok">Chaque franc a sa part. Votre somme est décidée avant d’arriver.</div>':e>0?'<div class="verdict v-mid">'+H.F(e)+' sans destination. Donnez-leur une part, sinon ils partiront au hasard.</div>':'<div class="verdict v-ko">Vous dépassez votre net de '+H.F(-e)+'. Réduisez une part, en commençant par le plaisir ou la famille.</div>'); } },
        p: "Ma répartition est écrite, en montants." }
    ]},
    { t: "Protéger la part gardée", acq: "Je protège la part gardée", desc: "Un endroit séparé, un délai avant toute grosse dépense, de la discrétion.", e: [
      { t: "Un endroit séparé", c: "La part gardée ne reste pas sur le compte du quotidien. Ce qui est à portée de main finit par être dépensé.",
        w: { puces: { id:"gs_ou", k:"Où mettrez-vous la part gardée ?", l:["Un compte d’épargne séparé","Un dépôt à terme (DAT)","Un porte-monnaie mobile money séparé","Une caisse ou microfinance agréée","Mon compte courant","À la maison"] },
          v: function(D){ var R={"Un compte d’épargne séparé":["v-ok","Séparé et disponible : un bon choix pour la réserve comme pour le projet."],"Un dépôt à terme (DAT)":["v-ok","L’argent est bloqué jusqu’à l’échéance : une vraie protection pour la part projet. Gardez la réserve ailleurs, disponible."],"Un porte-monnaie mobile money séparé":["v-mid","Pratique, mais très facile à dépenser. Réservez-le à de petits montants, jamais utilisé pour le quotidien."],"Une caisse ou microfinance agréée":["v-ok","Bon choix si l’établissement est agréé et si vous connaissez les conditions de retrait."],"Mon compte courant":["v-ko","C’est là que la somme se mélange au quotidien et fond. Ouvrez un compte séparé."],"À la maison":["v-ko","Trop tentant, et exposé au vol ou au feu. À éviter pour une grosse somme."]}[D.gs_ou]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai choisi où mettre ma part gardée." },
      { t: "La règle des 30 jours", f: ["Toute grosse dépense non prévue dans ma répartition attend 30 jours.", "J’écris l’idée et la date du jour, puis je n’y touche plus.", "Après 30 jours, si l’envie est toujours là et que le plan tient, je décide."], c: "Une grosse somme donne des idées. Le délai de 30 jours laisse passer l’enthousiasme, pas les bons projets.",
        p: "J’applique la règle des 30 jours." },
      { t: "La discrétion", c: "Être discret, ce n’est pas cacher. C’est ne pas donner un montant que chacun voudra se partager.",
        w: { quiz: [
          ["Annoncer le montant exact de son héritage à toute la famille", ["Ça protège","Ça expose"], 1, "Chacun fait alors ses propres calculs. Mieux vaut parler de ce que vous avez prévu pour la famille."],
          ["Dire : « J’ai prévu une part pour la famille, le reste est déjà engagé. »", ["Ça protège","Ça expose"], 0, "C’est vrai, c’est respectueux, et cela ferme la porte aux surenchères."]
        ] },
        p: "Je sais ce que je dis et ce que je garde pour moi." }
    ]},
    { t: "Le jour J et après", acq: "Je sais vivre le jour J et après", desc: "Une checklist, une phrase pour la famille, un point à 3 mois.", e: [
      { t: "La checklist du jour J", c: "Le jour J, on n’improvise pas : on exécute. Le plus tôt possible, avant que l’argent ne se mélange.",
        w: { puces: { id:"gs_jj", k:"Ce que je ferai le jour J", m:1, l:["Je vérifie le montant reçu","Je solde les dettes chères","Je verse la part gardée à part","Je remets la part famille prévue","Je ne retire que la part plaisir","J’écris ce que j’ai fait"] },
          v: function(D){ var n=(D.gs_jj||[]).length; if(!n) return ''; return n>=6?'<div class="verdict v-ok">6 actions sur 6 : votre jour J est prêt.</div>':'<div class="verdict v-mid">'+n+' action'+(n>1?'s':'')+' sur 6. Celles qui manquent sont souvent celles par où l’argent s’échappe.</div>'; } },
        p: "Ma checklist du jour J est prête." },
      { t: "Ce que je dis à la famille", c: "Aider fait partie de nos valeurs. Une part famille décidée à l’avance vous permet de donner sans vous mettre en danger.",
        w: { ex: "Ibrahim : « J’ai reçu mon rappel. J’ai prévu une part pour aider la famille, elle est là. Le reste sert à solder mes dettes et à construire mon projet. »",
          champs: [ {id:"gs_fa", l:"Ma phrase pour la famille", type:"area", ph:"J’ai prévu une part pour la famille : … Le reste est déjà engagé."} ] },
        p: "Ma phrase pour la famille est prête." },
      { t: "Le point à 3 mois", c: "Trois mois après, on vérifie que la part gardée est toujours là. C’est le vrai résultat de l’atelier.",
        w: { champs: [ {id:"gs_rdv", l:"Date de mon point à 3 mois", type:"txt", ph:"fin février", large:1} ],
          v: function(D,H){ var g=H.N(D.gs_garde); if(!g&&!D.gs_rdv) return ''; return '<div class="gros"><small>'+(D.gs_rdv?'Mon point ('+H.esc(D.gs_rdv)+') : je vérifie':'À mon point à 3 mois, je vérifie')+'</small><b>'+(g?H.F(g)+' toujours là':'Ma part gardée toujours là')+'</b><p>Si une partie a été prise, je l’écris et je reprends le plan dès le mois suivant.</p></div>'; } },
        p: "Mon point à 3 mois est noté." }
    ]}
  ],
  fin: {
    k: "Ma fiche grosse somme", titre: "Votre somme est décidée avant d’arriver",
    fiche: [
      ["Ce qui arrive", function(D){ return [D.gs_type||'', D.gs_date||''].filter(Boolean).join(' · '); }],
      ["Net réellement reçu", function(D,H){ return H.N(D.gs_net)?H.F(H.N(D.gs_net)):''; }],
      ["Dettes chères et réserve", function(D,H){ var d=H.N(D.gs_det), r=H.N(D.gs_res); return d||r?'Dettes : '+H.F(d)+' · Réserve : '+H.F(r):''; }],
      ["Projet, famille, plaisir", function(D,H){ var p=H.N(D.gs_pro), f=H.N(D.gs_fam), l=H.N(D.gs_pla); return p||f||l?'Projet : '+H.F(p)+' · Famille : '+H.F(f)+' · Plaisir : '+H.F(l):''; }],
      ["Part gardée", function(D,H){ var g=H.N(D.gs_res)+H.N(D.gs_pro); return g?H.F(g):''; }],
      ["Où je la garde", function(D){ return D.gs_ou||''; }],
      ["Ma phrase pour la famille", function(D){ return D.gs_fa||''; }],
      ["Mon point à 3 mois", function(D){ return D.gs_rdv||''; }]
    ],
    suite: { t: "Ma tontine devient une spirale", p: "Votre part gardée est protégée ? L’atelier suivant montre comment un tour de tontine peut, chaque cycle, laisser un capital qui grandit.", lien: "atelier-tontine-spirale.html", b: "Ouvrir l’atelier" }
  }
};
