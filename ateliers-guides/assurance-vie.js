/* Atelier guidé · Assurance-vie : comprendre ce que je signe */
window.ATELIER = {
  id: "assurance-vie",
  titre: "Assurance-vie : comprendre ce que je signe",
  h1: "Un contrat d’assurance-vie se lit avant de se signer.",
  voix: "auto",
  /* simulation mensuelle : versement v pendant m mois, frais sur versements fv %, frais de gestion fg % par an, rendement r % par an */
  _sim: function(v,m,fv,fg,r){ var b=0, inv=v*(1-fv/100), k=Math.pow(1+r/100,1/12)*Math.pow(1-fg/100,1/12); for(var i=0;i<m;i++){ b=(b+inv)*k; } return { verse:v*m, investi:inv*m, fraisV:v*m-inv*m, bal:b }; },
  question: {
    t: "Un conseiller vous présente un contrat : « 7 % par an, et vous êtes couvert ». Que faites-vous ?",
    r: [
      ["a", "Je signe : il a l’air sérieux.", "La confiance compte, et beaucoup de conseillers sont sérieux. Mais ce qui vous engage, c’est l’écrit. Cet atelier vous apprend à le lire, pour signer en connaissance de cause.", false],
      ["b", "Je demande par écrit les frais, ce qui est garanti et comment sortir.", "C’est le bon réflexe. On va le transformer en grille : frais, garanties, rendement, sortie, bénéficiaires.", true]
    ]
  },
  chapitres: [
    { t: "Ce qu’est une assurance-vie", acq: "Je sais ce qu’est une assurance-vie", desc: "Épargne, prévoyance ou les deux, sur une longue durée.", e: [
      { t: "Trois familles de contrats", f: ["Épargne : je verse, et je récupère un capital au terme ou quand je sors. Retraite et éducation en font souvent partie.", "Prévoyance décès : si je décède, un capital va à mes bénéficiaires. Si je suis en vie au terme, souvent rien n’est rendu.", "Mixte : un capital au terme si je suis en vie, un capital pour mes proches si je décède avant.", "Dans la zone, la compagnie doit être agréée dans le cadre de la CIMA. La direction des assurances de votre pays peut le confirmer."], c: "Une assurance-vie est un contrat long. On l’ouvre pour des années : mieux vaut savoir ce qu’on achète.",
        p: "Je connais les trois familles de contrats." },
      { t: "Épargne ou prévoyance ?", c: "Le nom commercial ne suffit pas. Ce qui compte, c’est ce que le contrat verse, à qui, et quand.",
        w: { quiz: [ ["Je verse 20 000 F par mois et je récupère un capital à 60 ans", ["Épargne","Prévoyance"], 0, "Le capital vous revient au terme : c’est de l’épargne."], ["Ma famille reçoit 2 000 000 F si je décède, rien si je suis en vie au terme", ["Épargne","Prévoyance"], 1, "C’est une protection pour vos proches, pas une épargne pour vous."], ["Un capital est versé à la famille pour les funérailles", ["Épargne","Prévoyance"], 1, "C’est une prévoyance : elle paie un événement, pas un projet."] ] },
        p: "Je sais distinguer épargne et prévoyance." },
      { t: "Le contrat qu’on me propose", c: "Posons d’abord le contrat sur la table : qui le propose, quel type, combien, et pour combien de temps.",
        w: { ex: "Koffi : son agent lui propose un contrat épargne éducation de 15 ans à 25 000 F par mois. Il versera 25 000 × 12 × 15 = 4 500 000 F.",
          puces: [ { id:"av_qui", k:"Qui vous le propose ?", l:["Un conseiller ou un agent","Mon employeur","Ma banque","Un proche"] }, { id:"av_type", k:"Le type de contrat", l:["Épargne retraite","Épargne éducation","Prévoyance décès","Mixte","Je ne sais pas encore"] } ],
          k: "Les chiffres du contrat", champs: [ {id:"av_vers", l:"Versement mensuel (F)", ph:"25 000"}, {id:"av_duree", l:"Durée du contrat (années)", ph:"15"} ],
          v: function(D,H){ var v=H.N(D.av_vers), a=H.N(D.av_duree); if(!v||!a) return ''; D.av_total=v*12*a; return '<div class="gros"><small>Ce que vous verserez sur la durée</small><b>'+H.F(v*12*a)+'</b><p>'+H.F(v*12)+' par an, pendant '+a+' an'+(a>1?'s':'')+'.</p></div>'; } },
        p: "Le contrat proposé est décrit." }
    ]},
    { t: "Les frais", acq: "Je sais ce que coûtent les frais", desc: "Ce qui est vraiment investi, et ce que les frais prennent sur la durée.", e: [
      { t: "Trois frais à repérer", f: ["Frais sur versements : un pourcentage prélevé sur chaque somme versée, avant qu’elle ne soit placée.", "Frais de gestion : un pourcentage prélevé chaque année sur l’épargne accumulée.", "Frais de rachat : une pénalité si vous sortez avant une date prévue, souvent plus lourde les premières années."], c: "Un petit pourcentage paraît léger. Répété chaque mois pendant des années, il devient une vraie somme.",
        p: "Je connais les trois frais à repérer." },
      { t: "Le calcul des frais", c: "Mettez vos chiffres. Les pourcentages sont ceux du contrat : s’ils ne sont pas écrits, demandez-les.",
        w: { ex: "Koffi verse 25 000 F par mois. Avec 3 % de frais sur versements, 24 250 F sont vraiment placés. Avec 1 % de frais de gestion par an, sur 15 ans et sans compter le rendement, les frais prennent environ 450 000 F. Ces taux sont des exemples.",
          k: "Vos chiffres", champs: [ {id:"av_vers", l:"Versement mensuel (F)", ph:"25 000"}, {id:"av_duree", l:"Durée (années)", ph:"15"}, {id:"av_fv", l:"Frais sur versements (%)", ph:"3"}, {id:"av_fg", l:"Frais de gestion par an (%)", ph:"1"} ],
          v: function(D,H){ var v=H.N(D.av_vers), a=H.N(D.av_duree), fv=H.N(D.av_fv), fg=H.N(D.av_fg); if(!v||!a) return ''; var s=window.ATELIER._sim(v,a*12,fv,fg,0), tot=s.verse-s.bal; D.av_frais=Math.round(tot); return '<div class="gros"><small>Vraiment placé chaque mois</small><b>'+H.F(v*(1-fv/100))+'</b><p>Sur '+a+' an'+(a>1?'s':'')+', sans compter le rendement : '+H.F(s.fraisV)+' de frais sur versements et '+H.F(s.investi-s.bal)+' de frais de gestion, soit environ '+H.F(tot)+' ('+(Math.round(tot/s.verse*1000)/10).toLocaleString('fr-FR')+' % de ce que vous versez).</p></div>'; } },
        p: "Je connais le coût des frais de mon contrat." },
      { t: "Les frais écrits", c: "Un frais annoncé à l’oral s’oublie. Un frais écrit se compare.",
        w: { puces: { id:"av_fecr", k:"Les frais que vous avez vus par écrit", m:1, l:["Frais sur versements","Frais de gestion","Frais de rachat","Aucun frais annoncé"] },
          v: function(D){ var l=D.av_fecr||[]; if(!l.length) return ''; if(l.indexOf("Aucun frais annoncé")>=0) return '<div class="verdict v-ko">Un contrat sans aucun frais est très rare. Demandez la grille des frais par écrit avant de signer.</div>'; var n=["Frais sur versements","Frais de gestion","Frais de rachat"].filter(function(x){return l.indexOf(x)>=0;}).length; return n===3?'<div class="verdict v-ok">Les trois frais sont écrits : vous pouvez comparer.</div>':'<div class="verdict v-mid">Il manque '+(3-n)+' frais par écrit. Demandez-les au conseiller.</div>'; } },
        p: "J’ai vérifié quels frais sont écrits." }
    ]},
    { t: "Le rendement et les garanties", acq: "Je sais ce qui est garanti", desc: "Taux garanti, participation aux bénéfices, capital au terme, garantie décès.", e: [
      { t: "Promis ou constaté ?", c: "Le rendement de l’an dernier est un souvenir, pas une promesse. Seul ce qui est écrit comme garanti engage la compagnie.",
        w: { quiz: [ ["« Notre contrat a rapporté 6 % l’an dernier »", ["C’est promis pour demain","C’est constaté dans le passé"], 1, "Un rendement passé peut baisser. Il n’engage pas la compagnie pour l’avenir."], ["Un taux minimum garanti écrit au contrat", ["C’est un engagement","C’est une estimation"], 0, "S’il est écrit et signé, la compagnie s’y engage. Vérifiez sur quelle durée."], ["La participation aux bénéfices", ["Elle est fixée d’avance","Elle dépend des résultats"], 1, "Elle s’ajoute quand la compagnie gagne. Elle peut varier d’une année à l’autre."] ] },
        p: "Je sais distinguer rendement garanti et rendement annoncé." },
      { t: "Deux scénarios", c: "Comparons ce que deviendrait votre épargne avec le seul taux garanti, et si le rendement annoncé se répétait.",
        w: { ex: "Koffi : 25 000 F par mois sur 15 ans, avec les frais de l’exemple. À 2,5 % par an, il aurait environ 4 900 000 F. À 6 %, environ 6 400 000 F. Ces taux sont des exemples, pas ceux d’un contrat réel.",
          k: "Les taux du contrat", champs: [ {id:"av_tg", l:"Taux minimum garanti par an (%)", ph:"0"}, {id:"av_ra", l:"Rendement annoncé par an (%)", ph:"5"} ],
          v: function(D,H){ var v=H.N(D.av_vers), a=H.N(D.av_duree); if(!v||!a) return '<p class="exemple">Indiquez d’abord votre versement et la durée (chapitre 1).</p>'; var S=window.ATELIER._sim, fv=H.N(D.av_fv), fg=H.N(D.av_fg), g=S(v,a*12,fv,fg,H.N(D.av_tg)), r=S(v,a*12,fv,fg,H.N(D.av_ra)); D.av_capg=Math.round(g.bal); D.av_capa=Math.round(r.bal); return '<div class="gros"><small>Estimation au terme, avec le seul taux garanti</small><b>'+H.F(g.bal)+'</b><p>Si le rendement annoncé se répétait chaque année : environ '+H.F(r.bal)+'. Vous aurez versé '+H.F(g.verse)+'. Seul le premier chiffre s’appuie sur un engagement écrit.</p></div>'; } },
        p: "Je connais mes deux scénarios." },
      { t: "Ce que couvrent les garanties", c: "Deux questions précises : le capital au terme est-il garanti ? Et combien reçoivent mes proches si je décède ?",
        w: { ex: "Fatou a un contrat mixte à 20 000 F par mois. En cas de décès, sa famille reçoit 3 000 000 F, soit plus de 12 années de versements.",
          puces: { id:"av_cgar", k:"Le capital au terme est-il garanti ?", l:["Oui, c’est écrit","Non","Je ne sais pas"] },
          champs: [ {id:"av_cdec", l:"Capital versé à vos proches en cas de décès (F)", ph:"3 000 000"} ],
          v: function(D,H){ var h='', c=H.N(D.av_cdec), v=H.N(D.av_vers); if(c) h+='<div class="gros"><small>En cas de décès, vos proches reçoivent</small><b>'+H.F(c)+'</b><p>'+(v?'Soit environ '+(Math.round(c/(v*12)*10)/10).toLocaleString('fr-FR')+' années de versements.':'')+'</p></div>'; var R={"Oui, c’est écrit":["v-ok","Bien. Notez la page et la phrase exacte du contrat."],"Non":["v-mid","Votre capital peut alors baisser. Demandez dans quels cas."],"Je ne sais pas":["v-ko","C’est la première question à poser par écrit."]}[D.av_cgar]; if(R) h+='<div class="verdict '+R[0]+'">'+R[1]+'</div>'; return h; } },
        p: "Je sais ce que couvrent mes garanties." }
    ]},
    { t: "Sortir du contrat", acq: "Je sais comment sortir du contrat", desc: "Rachat, avance, et ce qui se passe si j’arrête de payer.", e: [
      { t: "Les portes de sortie", f: ["Rachat partiel : je retire une partie de mon épargne, le contrat continue.", "Rachat total : je récupère tout et le contrat s’arrête. Demandez le délai de paiement.", "Pénalités : les premières années, sortir coûte souvent plus cher.", "Avance : la compagnie vous prête sur votre épargne, avec des intérêts, sans fermer le contrat.", "Si j’arrête de payer : réduction (le contrat continue avec un capital plus petit) ou résiliation (il s’arrête)."], c: "Une urgence, une perte d’emploi, des funérailles : la vie peut vous obliger à sortir. Mieux vaut connaître la porte avant d’entrer.",
        p: "Je connais les portes de sortie." },
      { t: "Si je sors tôt", c: "Testez une sortie anticipée : combien auriez-vous versé, et combien récupéreriez-vous ?",
        w: { ex: "Moussa verse 20 000 F par mois et sort au bout de 3 ans. Il a versé 720 000 F. Avec les frais de l’exemple, sans rendement et une pénalité de 5 %, il récupère environ 653 000 F.",
          k: "Votre sortie", champs: [ {id:"av_ran", l:"Je sors au bout de (années)", ph:"3"}, {id:"av_pen", l:"Pénalité de rachat à ce moment (%)", ph:"5"} ],
          puces: { id:"av_arret", k:"Si j’arrête de payer, mon contrat prévoit", l:["Une réduction","Une résiliation","Je ne sais pas"] },
          v: function(D,H){ var v=H.N(D.av_vers), n=H.N(D.av_ran); if(!v||!n) return ''; var s=window.ATELIER._sim(v,n*12,H.N(D.av_fv),H.N(D.av_fg),H.N(D.av_tg)), rec=s.bal*(1-H.N(D.av_pen)/100); D.av_rec=Math.round(rec); return '<div class="gros"><small>Sortie au bout de '+n+' an'+(n>1?'s':'')+', au taux garanti</small><b>environ '+H.F(rec)+'</b><p>Vous auriez versé '+H.F(s.verse)+'. '+(rec<s.verse?'Écart : '+H.F(s.verse-rec)+'.':'Vous récupérez au moins vos versements.')+'</p></div>'+(D.av_arret==="Je ne sais pas"?'<div class="verdict v-mid">Demandez ce qui se passe si vous arrêtez de payer.</div>':''); } },
        p: "Je sais ce que coûte une sortie anticipée." }
    ]},
    { t: "Les bénéficiaires et comparer", acq: "Je sais comparer et désigner", desc: "Une clause bénéficiaire précise, deux contrats comparés, les bonnes questions.", e: [
      { t: "Ma clause bénéficiaire", c: "« Mes enfants » peut prêter à discussion le jour venu. Écrivez des noms, et relisez la clause à chaque grand changement de vie.",
        w: { ex: "Flou : « mes héritiers ». Précis : « Mon épouse Aya Kouassi, née le 4 mai 1988 ; à défaut, mes enfants nés ou à naître, par parts égales. »",
          champs: [ {id:"av_benef", l:"Ma clause bénéficiaire", type:"area", ph:"Mon conjoint … né(e) le … ; à défaut, mes enfants … par parts égales"}, {id:"av_relire", l:"Je la relirai", type:"txt", large:1, ph:"À chaque mariage, naissance ou décès dans la famille"} ] },
        p: "Ma clause bénéficiaire est écrite." },
      { t: "Deux contrats comparés", c: "Mettez deux offres côte à côte, avec le même versement. Le meilleur contrat est celui qui vous laisse le plus, avec des sorties que vous pouvez supporter.",
        w: { k: "Les chiffres écrits de chaque contrat", champs: [ {id:"av_a_fv", l:"A · frais sur versements (%)"}, {id:"av_b_fv", l:"B · frais sur versements (%)"}, {id:"av_a_fg", l:"A · frais de gestion par an (%)"}, {id:"av_b_fg", l:"B · frais de gestion par an (%)"}, {id:"av_a_tg", l:"A · taux garanti par an (%)"}, {id:"av_b_tg", l:"B · taux garanti par an (%)"}, {id:"av_a_pr", l:"A · pénalité de rachat la 1re année (%)"}, {id:"av_b_pr", l:"B · pénalité de rachat la 1re année (%)"} ],
          v: function(D,H){ var k=["av_a_fv","av_b_fv","av_a_fg","av_b_fg","av_a_tg","av_b_tg"]; if(!k.some(function(x){return D[x]!=null&&String(D[x]).trim()!=='';})) return ''; var v=H.N(D.av_vers)||25000, a=H.N(D.av_duree)||15, ex=!(H.N(D.av_vers)&&H.N(D.av_duree)), S=window.ATELIER._sim, A=S(v,a*12,H.N(D.av_a_fv),H.N(D.av_a_fg),H.N(D.av_a_tg)).bal, B=S(v,a*12,H.N(D.av_b_fv),H.N(D.av_b_fg),H.N(D.av_b_tg)).bal, d=Math.abs(A-B), pa=H.N(D.av_a_pr), pb=H.N(D.av_b_pr), m=A>=B?'A':'B';
            var t=d<v?'Les deux contrats se valent sur ces chiffres.':'Le contrat '+m+' laisse environ '+H.F(d)+' de plus au terme.';
            var s=(m==='A'&&pa>pb)||(m==='B'&&pb>pa)?' Mais sa pénalité de sortie est plus lourde : à peser si vous risquez de sortir tôt.':'';
            D.av_verdict=d<v?'Équivalents':'Contrat '+m+' (+'+H.F(d)+')';
            return '<div class="gros"><small>Au terme, au taux garanti'+(ex?' (exemple : 25 000 F par mois sur 15 ans)':'')+'</small><b>A : '+H.F(A)+' · B : '+H.F(B)+'</b></div><div class="verdict '+(s?'v-mid':'v-ok')+'">'+t+s+'</div>'; } },
        p: "J’ai comparé deux contrats." },
      { t: "Mes questions au conseiller", c: "Un bon conseiller aime les questions précises. Demandez les réponses par écrit, et prenez le temps de relire chez vous.",
        w: { puces: { id:"av_qs", k:"Les questions que je poserai", m:1, l:["Quels sont tous les frais, par écrit ?","Qu’est-ce qui est garanti, et jusqu’à quand ?","Combien je récupère si je sors en 1re, 2e, 3e année ?","Que se passe-t-il si j’arrête de payer ?","Existe-t-il un délai de réflexion après la signature, et de combien de jours ?","La compagnie est-elle agréée, et où le vérifier ?"] },
          v: function(D){ var n=(D.av_qs||[]).length; if(!n) return ''; return n>=4?'<div class="verdict v-ok">'+n+' questions prêtes : vous arrivez au rendez-vous avec votre grille.</div>':'<div class="verdict v-mid">'+n+' question'+(n>1?'s':'')+' prête'+(n>1?'s':'')+'. Les frais, les garanties et la sortie sont les plus importantes.</div>'; } },
        p: "Mes questions sont prêtes." }
    ]}
  ],
  fin: {
    k: "Ma fiche assurance-vie", titre: "Vous savez ce que vous signez",
    fiche: [
      ["Contrat proposé", function(D){ return [D.av_type,D.av_qui].filter(Boolean).join(' · '); }],
      ["Versements sur la durée", function(D,H){ var v=H.N(D.av_vers), a=H.N(D.av_duree); return v&&a?H.F(v)+' par mois pendant '+a+' an'+(a>1?'s':'')+', soit '+H.F(v*12*a):''; }],
      ["Coût des frais (sans rendement)", function(D,H){ return H.N(D.av_frais)?'environ '+H.F(H.N(D.av_frais)):''; }],
      ["Estimation au terme (taux garanti)", function(D,H){ return H.N(D.av_capg)?'environ '+H.F(H.N(D.av_capg)):''; }],
      ["Capital garanti au terme", function(D){ return D.av_cgar||''; }],
      ["Garantie décès", function(D,H){ return H.N(D.av_cdec)?H.F(H.N(D.av_cdec)):''; }],
      ["Si je sors tôt", function(D,H){ return H.N(D.av_rec)&&H.N(D.av_ran)?'environ '+H.F(H.N(D.av_rec))+' au bout de '+H.N(D.av_ran)+' an'+(H.N(D.av_ran)>1?'s':''):''; }],
      ["Comparaison de deux contrats", function(D){ return D.av_verdict||''; }]
    ],
    suite: { t: "Préparer sa retraite sans pension", p: "Vous savez lire un contrat ? L’atelier suivant calcule ce dont vous aurez besoin à la retraite, et comment le financer pas à pas.", lien: "atelier-retraite-sans-pension.html", b: "Ouvrir l’atelier" }
  }
};
