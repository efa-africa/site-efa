/* Atelier guidé · Prêter à un proche, ou donner ? */
window.ATELIER = {
  id: "preter-ou-donner",
  titre: "Prêter à un proche, ou donner ?",
  h1: "Aider les siens, sans se mettre en danger.",
  voix: "auto",
  question: {
    t: "Votre cousin vous demande 200 000 F pour demain. Que faites-vous d’abord ?",
    r: [
      ["a", "J’envoie la somme tout de suite : c’est la famille.", "C’est le réflexe du cœur, et il vous honore. Prendre un moment pour vérifier ce que vous pouvez sortir, c’est ce qui vous permettra d’aider encore demain.", false],
      ["b", "Je comprends la demande et je vérifie ce que je peux sortir.", "C’est exactement la démarche de cet atelier : aider de bon cœur, avec une somme que vous pouvez vraiment donner ou prêter.", true]
    ]
  },
  chapitres: [
    { t: "Comprendre la demande", acq: "Je comprends la demande", desc: "Urgence, projet ou besoin qui revient : qui, combien, pour quand.", e: [
      { t: "Faut-il répondre aujourd’hui ?", c: "Toutes les demandes ne se ressemblent pas. Une urgence n’attend pas ; un projet laisse le temps d’en parler.",
        w: { quiz: [ ["Votre tante est hospitalisée et la clinique demande une avance.", ["Il faut répondre aujourd’hui","On peut prendre le temps"], 0, "C’est une urgence : la réponse compte aujourd’hui, même si elle est partielle."], ["Votre neveu veut acheter une moto pour faire du taxi.", ["Il faut répondre aujourd’hui","On peut prendre le temps"], 1, "C’est un projet. On peut en parler calmement, voir le plan et les autres appuis."], ["Un proche vous demande de l’aide pour la fin du mois, pour la troisième fois cette année.", ["Il faut répondre aujourd’hui","On peut prendre le temps"], 1, "Quand un besoin revient, une aide ponctuelle ne suffit pas. Le moment est bon pour en parler ensemble, avec douceur."] ] },
        p: "Je sais reconnaître le type de demande." },
      { t: "Qui, combien, pour quand", c: "Avant de répondre, posez la demande par écrit. Une demande claire rend la réponse plus simple, pour vous comme pour votre proche.",
        w: { ex: "Moussa, le petit frère de Fatou, demande 150 000 F pour la scolarité, avant lundi. C’est une urgence, avec une date.", champs: [ {id:"pd_qui", type:"txt", l:"Qui demande ?", ph:"Mon cousin Koffi"}, {id:"pd_mt", l:"Combien (F)"}, {id:"pd_quand", type:"txt", l:"Pour quand ?", ph:"Avant samedi"} ],
          puces: { id:"pd_type", k:"Le type de demande", l:["Urgence","Projet","Besoin qui revient"] },
          v: function(D,H){ var m=H.N(D.pd_mt); if(!m&&!D.pd_qui) return ''; return '<div class="gros"><small>La demande</small><b>'+(m?H.F(m):'Montant à préciser')+'</b><p>'+(D.pd_qui?H.esc(D.pd_qui):'Un proche')+(D.pd_quand?' · '+H.esc(D.pd_quand):'')+(D.pd_type?' · '+H.esc(D.pd_type):'')+'</p></div>'; } },
        p: "La demande est écrite : qui, combien, pour quand." }
    ]},
    { t: "Ce que je peux sortir", acq: "Je connais ce que je peux sortir", desc: "L’enveloppe solidarité du mois, et la réserve qu’on ne touche pas.", e: [
      { t: "Mon enveloppe solidarité", c: "La solidarité a sa place dans le budget, comme le loyer. Une enveloppe fixée à l’avance permet de donner sans tout désorganiser.",
        w: { ex: "Awa gagne 250 000 F par mois. Elle prévoit 25 000 F pour la famille. Ce mois-ci, elle en a déjà donné 10 000 F : il lui reste 15 000 F.", champs: [ {id:"pd_rev", l:"Mon revenu du mois (F)"}, {id:"pd_env", l:"Mon enveloppe solidarité (F)"}, {id:"pd_deja", l:"Déjà donné ce mois (F)"} ],
          v: function(D,H){ var e=H.N(D.pd_env), r=H.N(D.pd_rev), d=H.N(D.pd_deja); if(!e) return ''; var reste=Math.max(0,e-d); return '<div class="gros"><small>Reste dans l’enveloppe ce mois-ci</small><b>'+H.F(reste)+'</b><p>'+(r?'Votre enveloppe représente '+Math.round(e/r*100)+' % de votre revenu.':'')+'</p></div>'; } },
        p: "Mon enveloppe solidarité est écrite." },
      { t: "Ma réserve intouchable", c: "La réserve des urgences de votre maison ne se prête pas. Elle protège aussi votre famille : sans elle, c’est vous qui deviendriez l’urgence.",
        w: { ex: "Koffi a 300 000 F d’épargne, dont 200 000 F de réserve pour sa maison. Il peut puiser au plus dans 100 000 F, en plus de son enveloppe.", champs: [ {id:"pd_epa", l:"Mon épargne disponible (F)"}, {id:"pd_res", l:"Ma réserve intouchable (F)"} ],
          v: function(D,H){ var reste=Math.max(0,H.N(D.pd_env)-H.N(D.pd_deja)), dispo=Math.max(0,H.N(D.pd_epa)-H.N(D.pd_res)), max=reste+dispo, m=H.N(D.pd_mt); if(!H.N(D.pd_env)&&!H.N(D.pd_epa)) return ''; D.pd_max=max;
            var h='<div class="gros"><small>Ce que je peux sortir sans me mettre en danger</small><b>'+H.F(max)+'</b><p>Enveloppe : '+H.F(reste)+' · Épargne hors réserve : '+H.F(dispo)+'</p></div>';
            if(m) h+=max>=m?'<div class="verdict v-ok">Vous pouvez couvrir la demande sans toucher à votre réserve.</div>':max>0?'<div class="verdict v-mid">Vous pouvez aider pour '+H.F(max)+' sur '+H.F(m)+'. Une aide partielle reste une vraie aide.</div>':'<div class="verdict v-ko">Ce mois-ci, rien ne peut sortir sans toucher à votre réserve. Le chapitre 5 vous aide à le dire, et à aider autrement.</div>';
            return h; } },
        p: "Je connais ce que je peux sortir." }
    ]},
    { t: "Prêter ou donner", acq: "Je sais choisir entre prêter et donner", desc: "La règle du « jamais revu », et le don d’une partie.", e: [
      { t: "La règle d’or", f: ["Je ne prête que ce que je peux accepter de ne jamais revoir.", "Si ne pas revoir cet argent me mettrait en difficulté, je donne une partie plutôt que de prêter le tout.", "Je dis clairement ce qui est un don et ce qui est un prêt."], c: "Beaucoup de prêts en famille ne reviennent pas, souvent sans mauvaise intention. Mieux vaut le prévoir que d’en vouloir à quelqu’un.",
        p: "Je connais la règle d’or." },
      { t: "Le test du jamais revu", c: "Imaginez que cet argent ne revienne jamais. Votre réponse honnête dit s’il vaut mieux prêter, ou donner moins.",
        w: { puces: { id:"pd_jr", k:"Si cet argent ne revenait jamais…", l:["Cela ne me gênerait pas","Ce serait difficile","Je serais en difficulté"] },
          v: function(D){ var R={"Cela ne me gênerait pas":["v-ok","Vous pouvez prêter cette somme, ou la donner. Le lien reste protégé dans les deux cas."],"Ce serait difficile":["v-mid","Prêtez une somme plus petite, ou donnez une partie. Vous n’attendrez rien, et vous ne serez pas déçu."],"Je serais en difficulté":["v-ko","Ne prêtez pas cette somme. Donnez ce que vous pouvez vraiment donner, même peu, et aidez autrement."]}[D.pd_jr]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai fait le test du jamais revu." },
      { t: "Donner une partie", c: "Donner moins, sans rien attendre, vaut souvent mieux que prêter tout et attendre longtemps. Personne ne doit rien à personne.",
        w: { ex: "Ibrahim ne peut pas prêter 200 000 F. Il donne 50 000 F, sans rien attendre. Son cousin complète ailleurs, et la relation reste légère.", champs: [ {id:"pd_don", l:"Ce que je donne (F)"}, {id:"pd_pret", l:"Ce que je prête (F)"} ],
          v: function(D,H){ var g=H.N(D.pd_don), p=H.N(D.pd_pret), t=g+p, m=H.N(D.pd_mt), max=Math.max(0,H.N(D.pd_env)-H.N(D.pd_deja))+Math.max(0,H.N(D.pd_epa)-H.N(D.pd_res));
            D.pd_dec=g&&p?'Je donne une partie et je prête une partie':g?'Je donne':p?'Je prête':''; if(!t) return '';
            var h='<div class="gros"><small>Mon aide</small><b>'+H.F(t)+'</b><p>'+(g?'Don : '+H.F(g):'')+(g&&p?' · ':'')+(p?'Prêt : '+H.F(p):'')+(m?' · Demande : '+H.F(m):'')+'</p></div>';
            if(max&&t>max) h+='<div class="verdict v-ko">C’est plus que ce que vous pouvez sortir ('+H.F(max)+'). Réduisez, pour ne pas toucher à votre réserve.</div>';
            else if(p&&D.pd_jr==="Je serais en difficulté") h+='<div class="verdict v-mid">Le test du jamais revu vous déconseille de prêter. Pensez à transformer une partie en don plus petit.</div>';
            else h+='<div class="verdict v-ok">Votre aide tient dans ce que vous pouvez sortir.</div>';
            return h; } },
        p: "Ma décision est prise : ce que je donne, ce que je prête." }
    ]},
    { t: "Si je prête", acq: "Je sais prêter sans abîmer la relation", desc: "Un petit écrit, un échéancier, un témoin, un rappel aimable.", e: [
      { t: "Un petit écrit", f: ["La date, le montant, et le nom de chacun.", "Comment et quand l’argent revient.", "Les deux signatures, et celle d’un témoin."], c: "Un écrit n’est pas de la méfiance. C’est une mémoire commune, qui protège les deux.",
        w: { consignes: 1, champs: [ {id:"pd_tem", type:"txt", l:"Mon témoin", ph:"Tonton Ibrahim"} ] },
        p: "Je sais ce que contient mon petit écrit, et qui sera témoin." },
      { t: "L’échéancier", c: "Un remboursement réaliste, petit et régulier, revient plus souvent qu’une grosse somme promise « dès que possible ».",
        w: { ex: "Fatou prête 120 000 F à sa cousine Affoué. Affoué rend 20 000 F par mois, à partir du 5 du mois prochain : c’est fini en 6 mois.", champs: [ {id:"pd_ech", l:"Remboursement par mois (F)"}, {id:"pd_deb", type:"txt", l:"Premier remboursement le", ph:"5 décembre"} ],
          v: function(D,H){ var p=H.N(D.pd_pret), e=H.N(D.pd_ech); if(!p) return D.pd_don||D.pd_jr?'<div class="verdict v-ok">Vous ne prêtez pas : pas d’échéancier à prévoir.</div>':''; if(!e) return ''; var n=Math.ceil(p/e); return '<div class="gros"><small>Remboursement complet</small><b>en '+n+' mois</b><p>'+H.F(e)+' par mois'+(D.pd_deb?', à partir du '+H.esc(D.pd_deb):'')+'.</p></div>'+(n>12?'<div class="verdict v-mid">Plus d’un an : c’est long. Un don d’une partie allégerait le prêt.</div>':''); } },
        p: "Mon échéancier est écrit." },
      { t: "Le rappel sans fâcher", c: "Un rappel gentil, envoyé la veille, évite les silences gênés. Laissez toujours une porte ouverte si le mois est difficile.",
        w: { ex: "« Bonjour Affoué, j’espère que tout va bien chez vous. Petit rappel amical pour les 20 000 F du 5. Si c’est difficile ce mois-ci, dis-le-moi, on s’arrange. »", champs: [ {id:"pd_rap", type:"area", l:"Mon message de rappel", ph:"Bonjour …, j’espère que tout va bien. Petit rappel amical pour …"} ] },
        p: "Mon message de rappel est prêt." }
    ]},
    { t: "Les bons mots", acq: "Je sais répondre avec les bons mots", desc: "Dire non ou oui en partie, et aider autrement.", e: [
      { t: "Aider autrement", c: "L’argent n’est pas la seule aide. Votre temps, vos contacts et votre présence comptent aussi.",
        w: { puces: { id:"pd_aut", k:"Ce que je peux proposer", m:1, l:["Accompagner à l’hôpital ou à l’école","Chercher ensemble une autre solution","Parler à la famille pour une cotisation","Partager un contact de travail","Prêter un objet ou rendre un service","Aider à faire un budget"] } },
        p: "J’ai choisi comment aider autrement." },
      { t: "Les mots qui gardent le lien", c: "On peut dire non, ou oui en partie, sans blesser. Parlez de vous et de ce que vous pouvez, pas de l’autre.",
        w: { quiz: [ ["« Tu demandes toujours de l’argent. »", ["Je l’écris","Je ne l’écris pas"], 1, "Le reproche ferme la porte. Parlez de ce que vous pouvez faire, pas de l’autre."], ["« Je ne peux pas tout, mais je peux t’envoyer 30 000 F, de bon cœur. »", ["Je l’écris","Je ne l’écris pas"], 0, "Clair, chaleureux, et vous tenez ce que vous promettez."], ["« Ce mois-ci, je ne peux pas. Je préfère te le dire que promettre sans tenir. »", ["Je l’écris","Je ne l’écris pas"], 0, "Un non franc et respectueux protège mieux le lien qu’un oui qu’on ne pourra pas tenir."] ] },
        p: "Je sais quels mots garder." },
      { t: "Mon message prêt à envoyer", c: "Voici un message construit avec vos réponses. Ajustez-le avec vos mots, puis envoyez-le quand vous êtes prêt.",
        w: { ex: "« Bonjour Moussa, j’ai bien pensé à ta demande. Je ne peux pas tout, mais je t’envoie 50 000 F : c’est un don, tu ne me dois rien. Je peux aussi t’accompagner à l’école lundi. Je suis de cœur avec toi. »", champs: [ {id:"pd_msg", type:"area", l:"Mon message final", ph:"Copiez ici le message proposé, puis mettez-y vos mots."} ],
          v: function(D,H){ var g=H.N(D.pd_don), p=H.N(D.pd_pret), e=H.N(D.pd_ech), m=H.N(D.pd_mt), a=D.pd_aut||[]; if(!D.pd_qui&&!g&&!p&&!a.length) return '';
            var nom=String(D.pd_qui||'').replace(/[,.;:]/g,' ').trim().split(/\s+/).filter(function(w){return /^[A-ZÀ-Ý]/.test(w)&&!/^(Mon|Ma|Mes|Le|La|Les)$/.test(w);}).pop()||'', s='Bonjour'+(nom?' '+nom:'')+', j’ai bien pensé à ta demande. ';
            if(g&&m&&g>=m&&!p) s+='Je t’envoie '+H.F(g)+' : c’est un don, tu ne me dois rien. ';
            else if(g) s+='Je ne peux pas tout, mais je t’envoie '+H.F(g)+' : c’est un don, tu ne me dois rien. ';
            if(p) s+=(g?'Je peux aussi te prêter ':'Je peux te prêter ')+H.F(p)+(e?', remboursés '+H.F(e)+' par mois'+(D.pd_deb?' à partir du '+D.pd_deb:''):'')+'. On le note sur un petit papier'+(D.pd_tem?', avec '+D.pd_tem+' comme témoin':'')+'. ';
            if(!g&&!p) s+='Ce mois-ci, je ne peux pas t’aider avec de l’argent, et je préfère te le dire franchement plutôt que de promettre ce que je ne pourrai pas tenir. ';
            if(a.length) s+='Je peux t’aider autrement : '+a[0].charAt(0).toLowerCase()+a[0].slice(1)+'. ';
            s+='Je suis de cœur avec toi.';
            return '<div class="gros"><small>Votre message proposé</small><p>'+H.esc(s)+'</p></div>'; } },
        p: "Mon message est prêt à envoyer." }
    ]}
  ],
  fin: {
    k: "Ma fiche prêter ou donner", titre: "Vous savez aider sans vous mettre en danger",
    fiche: [
      ["La demande", function(D,H){ var m=H.N(D.pd_mt); return [D.pd_qui||'', m?H.F(m):'', D.pd_quand||''].filter(Boolean).join(' · '); }],
      ["Type de demande", function(D){ return D.pd_type||''; }],
      ["Ce que je peux sortir", function(D,H){ if(!H.N(D.pd_env)&&!H.N(D.pd_epa)) return ''; return H.F(Math.max(0,H.N(D.pd_env)-H.N(D.pd_deja))+Math.max(0,H.N(D.pd_epa)-H.N(D.pd_res))); }],
      ["Ma réserve intouchable", function(D,H){ return H.N(D.pd_res)?H.F(H.N(D.pd_res)):''; }],
      ["Test du jamais revu", function(D){ return D.pd_jr||''; }],
      ["Ma décision", function(D,H){ var g=H.N(D.pd_don), p=H.N(D.pd_pret); return [g?'Don de '+H.F(g):'', p?'Prêt de '+H.F(p):''].filter(Boolean).join(' · '); }],
      ["Échéancier et témoin", function(D,H){ var e=H.N(D.pd_ech); return [e?H.F(e)+' par mois':'', D.pd_deb?'dès le '+D.pd_deb:'', D.pd_tem?'témoin : '+D.pd_tem:''].filter(Boolean).join(' · '); }],
      ["Aider autrement", function(D){ return (D.pd_aut||[]).join(', '); }]
    ],
    suite: { t: "Ma réserve de sécurité", p: "Votre réserve intouchable a un montant ? Cet atelier vous aide à la construire pas à pas, pour aider les vôtres sans jamais vous mettre en danger.", lien: "atelier-reserve-securite.html", b: "Ouvrir l’atelier" }
  }
};
