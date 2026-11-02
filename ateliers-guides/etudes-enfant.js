/* Atelier guidé · Financer les études de mon enfant */
window.ATELIER = {
  id: "etudes-enfant",
  titre: "Financer les études de mon enfant",
  h1: "Les études de vos enfants se préparent bien avant la rentrée.",
  voix: "auto",
  /* repères d’âge : primaire 6 à 11 ans, collège 12 à 15, lycée 16 à 18, supérieur à partir de 19 ans */
  _calc: function(D,H){
    var s=String(D.ee_age==null?'':D.ee_age).trim(); if(s==='') return null;
    var a=Math.max(0,Math.floor(H.N(D.ee_age))), h=H.N(D.ee_hau)/100, ns=Math.max(0,Math.round(H.N(D.ee_supn)||3));
    var c={pri:H.N(D.ee_pri),col:H.N(D.ee_col),lyc:H.N(D.ee_lyc),sup:H.N(D.ee_sup)};
    var t0=0, t=0, b=0, fin=19+ns;
    for(var y=Math.max(a,6); y<fin; y++){ var k=y<12?c.pri:y<16?c.col:y<19?c.lyc:c.sup, f=Math.pow(1+h,y-a); t0+=k; t+=k*f; if(y>=19) b+=k*f; }
    return { age:a, ans:Math.max(0,19-a), ns:ns, total0:t0, total:t, besoin:b, saisi:!!(c.pri||c.col||c.lyc||c.sup) };
  },
  /* versement mensuel pour réunir B dans T ans, avec d déjà de côté et un rendement r % par an */
  _mens: function(B,d,T,r){ if(!T||!B) return 0; var n=T*12, g=Math.pow(1+r/100,T), rest=B-d*g; if(rest<=0) return 0; if(!r) return rest/n; var i=Math.pow(1+r/100,1/12)-1; return rest*i/(Math.pow(1+i,n)-1); },
  question: {
    t: "La rentrée de septembre arrive. Comment payez-vous l’inscription et les fournitures ?",
    r: [
      ["a", "Je m’arrange au dernier moment : une avance, un emprunt, ou ma tontine prise plus tôt.", "C’est le cas de beaucoup de familles, et ce n’est pas un manque de sérieux. Mais la rentrée revient chaque année : on peut la préparer mois par mois, puis préparer le supérieur de la même façon.", false],
      ["b", "L’argent est déjà de côté, mis petit à petit pendant l’année.", "C’est le bon réflexe. Cet atelier l’étend à toute la scolarité, jusqu’aux études supérieures, ici ou à l’étranger.", true]
    ]
  },
  chapitres: [
    { t: "Chiffrer", acq: "Je sais combien coûtent les études de mon enfant", desc: "Chaque cycle chiffré, de l’école au supérieur, avec la hausse des frais.", e: [
      { t: "Où en est mon enfant ?", c: "Tout part de l’âge de l’enfant. Il dit combien d’années il reste avant chaque cycle, et surtout avant le supérieur.",
        w: { ex: "Mariam, la fille d’Awa, a 8 ans. Repères : collège vers 12 ans, lycée vers 16 ans, supérieur vers 19 ans. Mariam entre au collège dans 4 ans et dans le supérieur dans 11 ans.", champs: [ {id:"ee_nom", l:"Prénom de l’enfant", type:"txt", ph:"Mariam"}, {id:"ee_age", l:"Son âge aujourd’hui", ph:"8"} ],
          v: function(D,H){ var R=window.ATELIER._calc(D,H); if(!R) return ''; var n=H.esc(D.ee_nom||'Votre enfant'), a=R.age, et=[];
            if(a<12) et.push('collège dans '+(12-Math.max(a,6)+(a<6?6-a:0))+' an'+((12-a)>1?'s':''));
            if(a<16) et.push('lycée dans '+(16-a)+' an'+((16-a)>1?'s':''));
            if(a<19) return '<div class="gros"><small>'+n+', '+a+' an'+(a>1?'s':'')+'</small><b>Supérieur dans '+R.ans+' an'+(R.ans>1?'s':'')+'</b><p>'+(et.length?'Avant cela : '+et.join(', ')+'.':'')+'</p></div>';
            return '<div class="gros"><small>'+n+', '+a+' ans</small><b>Déjà en âge du supérieur</b><p>Le besoin est à financer maintenant : on le chiffre à l’écran suivant.</p></div>'; } },
        p: "J’ai écrit l’âge de mon enfant et les années qui restent." },
      { t: "Le coût de chaque cycle", c: "Comptez une année complète : inscription, scolarité, fournitures, uniformes, transport, cantine. Ce sont vos chiffres, pas une moyenne.",
        w: { ex: "Pour Mariam, Awa compte par an 250 000 F au primaire, 350 000 F au collège, 450 000 F au lycée et 1 500 000 F dans le supérieur, pendant 3 ans. Il reste 8 250 000 F à financer, sans compter la hausse des frais.", k: "Coût d’une année, aux prix d’aujourd’hui (F)", c3: 1, champs: [ {id:"ee_pri", l:"Primaire"}, {id:"ee_col", l:"Collège"}, {id:"ee_lyc", l:"Lycée"}, {id:"ee_sup", l:"Supérieur, par an"}, {id:"ee_supn", l:"Années de supérieur", ph:"3"} ],
          v: function(D,H){ var R=window.ATELIER._calc(D,H); if(!R) return '<div class="verdict v-mid">Indiquez d’abord l’âge de l’enfant à l’écran précédent.</div>'; if(!R.saisi) return ''; return '<div class="gros"><small>Reste à financer, aux prix d’aujourd’hui</small><b>'+H.F(R.total0)+'</b><p>Dont '+H.F(R.besoin && H.N(D.ee_hau) ? R.ns*H.N(D.ee_sup) : R.besoin)+' pour '+R.ns+' an'+(R.ns>1?'s':'')+' de supérieur.</p></div>'; } },
        p: "Le coût annuel de chaque cycle est écrit." },
      { t: "Ici ou à l’étranger, et la hausse des frais", c: "Les frais montent presque chaque année. Le même lycée coûtera plus cher dans 5 ans : il faut le compter dès maintenant.",
        w: { ex: "Une année de lycée à 300 000 F aujourd’hui, avec une hausse d’environ 5 % par an, coûtera environ 383 000 F dans 5 ans.", puces: { id:"ee_lieu", k:"Le supérieur, vous l’imaginez", l:["Ici, dans la zone","À l’étranger"] }, champs: [ {id:"ee_hau", l:"Hausse des frais par an (%)", ph:"5"} ],
          v: function(D,H){ var R=window.ATELIER._calc(D,H); if(!R||!R.saisi) return ''; var h=H.N(D.ee_hau);
            var o='<div class="gros"><small>Total des études restantes'+(h?', avec '+h+' % de hausse par an':'')+'</small><b>'+H.F(R.total)+'</b><p>Besoin pour le supérieur, à payer à partir de '+(R.ans?'dans '+R.ans+' an'+(R.ans>1?'s':''):'maintenant')+' : '+H.F(R.besoin)+'.</p></div>';
            if(D.ee_lieu==="À l’étranger") o+='<div class="verdict v-mid">À l’étranger, vérifiez que votre coût annuel compte aussi le logement, le billet, le visa, l’assurance et les mois de caution.</div>';
            return o; } },
        p: "Je connais le coût total des études et le besoin pour le supérieur." }
    ]},
    { t: "Le montant mensuel", acq: "Je connais mon effort mensuel", desc: "Le versement qui finance le supérieur à temps, pour chaque enfant.", e: [
      { t: "Mon versement chaque mois", c: "Le supérieur est la plus grosse marche. On la divise en mois, de maintenant jusqu’à l’entrée. Le rendement saisi n’est qu’un exemple, jamais une promesse.",
        w: { ex: "Koffi doit réunir 6 000 000 F dans 10 ans pour le supérieur de son fils. Sans rendement : 50 000 F par mois. Avec 4 % par an, pris comme exemple : environ 40 900 F par mois.", champs: [ {id:"ee_dej", l:"Déjà de côté pour cet enfant (F)"}, {id:"ee_rdt", l:"Rendement d’exemple par an (%)", ph:"4"} ],
          v: function(D,H){ var A=window.ATELIER, R=A._calc(D,H); if(!R||!R.besoin) return ''; if(!R.ans) return '<div class="verdict v-mid">L’entrée dans le supérieur, c’est maintenant : le besoin se finance avec l’épargne existante, le budget du mois et une rentrée préparée au chapitre 5.</div>';
            var d=H.N(D.ee_dej), m0=A._mens(R.besoin,d,R.ans,0), m=A._mens(R.besoin,d,R.ans,H.N(D.ee_rdt));
            if(!m0) return '<div class="verdict v-ok">Ce qui est déjà de côté couvre le besoin du supérieur. Protégez-le jusqu’à l’entrée.</div>';
            return '<div class="gros"><small>À mettre de côté chaque mois, pendant '+R.ans+' an'+(R.ans>1?'s':'')+'</small><b>'+H.F(m)+'</b><p>'+(H.N(D.ee_rdt)?'Sans aucun rendement : '+H.F(m0)+' par mois.':'Calcul sans rendement.')+'</p></div>'; } },
        p: "Mon versement mensuel pour le supérieur est calculé." },
      { t: "Plusieurs enfants", c: "Refaites le calcul pour chaque enfant avec son âge, puis additionnez. Ce total doit tenir dans votre budget, sinon il ne tiendra pas longtemps.",
        w: { ex: "Fatou met 35 000 F par mois pour l’aîné et 25 000 F pour la cadette. Total : 60 000 F, soit 15 % de ses 400 000 F de revenu mensuel.", champs: [ {id:"ee_e2", l:"Versement pour un 2e enfant (F)"}, {id:"ee_e3", l:"Versement pour un 3e enfant (F)"}, {id:"ee_rev", l:"Revenu mensuel du foyer (F)"} ],
          v: function(D,H){ var A=window.ATELIER, R=A._calc(D,H), m1=R&&R.ans?A._mens(R.besoin,H.N(D.ee_dej),R.ans,H.N(D.ee_rdt)):0, t=m1+H.N(D.ee_e2)+H.N(D.ee_e3); if(!t) return '';
            var o='<div class="gros"><small>Effort total pour les études</small><b>'+H.F(t)+' par mois</b></div>', rv=H.N(D.ee_rev); if(!rv) return o; var p=Math.round(t/rv*100);
            var V=p<=15?['v-ok','Soit '+p+' % du revenu : un effort qui peut tenir dans la durée.']:p<=25?['v-mid','Soit '+p+' % du revenu : c’est lourd. Commencez par une partie et augmentez à chaque hausse de revenu ou 13e mois.']:['v-ko','Soit '+p+' % du revenu : difficile à tenir. Commencez plus petit, cherchez les bourses d’études et comparez avec un supérieur ici.'];
            return o+'<div class="verdict '+V[0]+'">'+V[1]+'</div>'; } },
        p: "Mon effort total, pour tous mes enfants, est écrit." }
    ]},
    { t: "Les outils selon l’horizon", acq: "Je choisis l’outil selon l’horizon", desc: "Le bon outil dépend des années qui restent avant la dépense.", e: [
      { t: "Trois horizons", f: ["Moins de 3 ans : de l’épargne disponible, ou une tontine dont le tour tombe juste avant la rentrée.", "De 3 à 10 ans : dépôt à terme, emprunts d’État, assurance études.", "Plus de 10 ans : une part peut aller à la Bourse régionale (BRVM), puis on la sécurise en approchant de l’entrée."], c: "Plus la dépense est proche, plus l’argent doit être sûr et disponible. Plus elle est lointaine, plus on peut viser la durée.",
        w: { consignes:1, v: function(D,H){ var R=window.ATELIER._calc(D,H); if(!R) return ''; var T=R.ans, n=H.esc(D.ee_nom||'votre enfant');
            return '<div class="gros"><small>Horizon avant le supérieur de '+n+'</small><b>'+T+' an'+(T>1?'s':'')+'</b><p>'+(T<3?'Moins de 3 ans : priorité à la sécurité et à la disponibilité.':T<=10?'De 3 à 10 ans : des outils sûrs, qui travaillent un peu plus longtemps.':'Plus de 10 ans : une part peut viser le long terme.')+'</p></div>'; } },
        p: "Je connais l’horizon de mon enfant." },
      { t: "Le bon outil au bon moment", c: "Un bon outil au mauvais moment devient un mauvais outil. Trois situations pour s’entraîner.",
        w: { quiz: [ ["L’entrée à l’université est dans 2 ans. Je mets cette épargne en Bourse.", ["Adapté","Pas adapté"], 1, "Sur 2 ans, une baisse peut tomber juste au moment de payer l’inscription."], ["L’enfant a 3 ans. Une part de son épargne va à la Bourse régionale (BRVM), pour longtemps.", ["Adapté","Pas adapté"], 0, "Avec 15 ans devant soi, on peut traverser les baisses. Une part seulement, sécurisée en approchant de l’entrée."], ["Je prends le tour de tontine en août, juste avant la rentrée.", ["Adapté","Pas adapté"], 0, "Bien placée dans le calendrier, la tontine arrive au bon moment, sans emprunt."] ] },
        p: "Je sais associer un outil à un horizon." },
      { t: "Mes outils", c: "Choisissez les outils que vous utiliserez. On vérifie qu’ils correspondent à l’horizon de votre enfant.",
        w: { puces: { id:"ee_out", k:"Les outils que je retiens", m:1, l:["Épargne disponible","Tontine de rentrée","Dépôt à terme","Emprunts d’État","Assurance études","Bourse à long terme"] },
          v: function(D,H){ var L=D.ee_out||[]; if(!L.length) return ''; var R=window.ATELIER._calc(D,H); if(!R) return '<div class="verdict v-mid">Indiquez l’âge de l’enfant au chapitre 1 pour vérifier votre choix.</div>';
            var T=R.ans, b=L.indexOf("Bourse à long terme")>=0, av=L.indexOf("Assurance études")>=0, sur=L.every(function(x){ return x==="Épargne disponible"||x==="Tontine de rentrée"; });
            var V=T<3&&(b||av)?['v-ko','À moins de 3 ans, la Bourse peut baisser juste avant l’entrée, et une assurance études n’a pas le temps de produire. Préférez l’épargne disponible ou une tontine bien placée.']
              :T<=10&&b?['v-mid','Entre 3 et 10 ans, gardez la Bourse pour une petite part, et sécurisez-la dès que l’entrée approche.']
              :T>10&&sur?['v-mid','Sur plus de 10 ans, une épargne seule risque de monter moins vite que les frais. Un outil plus long peut avoir sa place pour une partie.']
              :['v-ok','Vos outils correspondent à un horizon de '+T+' an'+(T>1?'s':'')+'. Gardez toujours l’argent de la prochaine rentrée disponible.'];
            return '<div class="verdict '+V[0]+'">'+V[1]+'</div>'; } },
        p: "J’ai choisi mes outils selon l’horizon." }
    ]},
    { t: "L’assurance études", acq: "Je sais lire une assurance études", desc: "Ce qu’elle promet, ce qu’elle coûte, et les questions à poser.", e: [
      { t: "Ce qu’elle promet", f: ["Je verse chaque mois ou chaque année, et un capital ou une rente est versé pour les études, à une date prévue.", "Des frais sont prélevés : sur chaque versement, chaque année, et en cas de sortie anticipée.", "Le capital peut être garanti, ou seulement estimé : seul ce qui est écrit comme garanti engage la compagnie.", "Souvent, si le parent décède, la compagnie continue le contrat à sa place : c’est la vraie protection de l’enfant.", "La compagnie doit être agréée dans le cadre de la CIMA. La direction des assurances de votre pays peut le confirmer."], c: "Une assurance études, c’est une épargne avec une protection. Elle se juge sur ses frais, son capital garanti et ce qu’elle prévoit si vous n’êtes plus là.",
        p: "Je sais ce que promet une assurance études." },
      { t: "Lire une offre", c: "Comparez ce que vous verserez avec le capital garanti écrit. L’écart vous dit ce que coûtent les frais et la protection.",
        w: { ex: "On propose à Moussa 20 000 F par mois pendant 12 ans, soit 2 880 000 F versés, pour un capital garanti de 3 200 000 F. Il demande ce qui se passe s’il décède, et ce qu’il récupère s’il sort au bout de 3 ans.", champs: [ {id:"ee_av_v", l:"Versement mensuel proposé (F)"}, {id:"ee_av_d", l:"Durée (ans)"}, {id:"ee_av_cap", l:"Capital garanti au terme (F)"} ], puces: { id:"ee_dec", k:"Si le parent décède, le contrat prévoit", l:["Le capital reste versé, sans autre paiement","Ce n’est pas écrit clairement"] },
          v: function(D,H){ var v=H.N(D.ee_av_v), d=H.N(D.ee_av_d), c=H.N(D.ee_av_cap), o=''; if(v&&d){ var t=v*12*d; o='<div class="gros"><small>Total versé sur '+d+' an'+(d>1?'s':'')+'</small><b>'+H.F(t)+'</b>'+(c?'<p>Capital garanti : '+H.F(c)+', soit '+(c>=t?'+':'−')+' '+H.F(Math.abs(c-t))+'.</p>':'')+'</div>';
              if(c) o+=c<t?'<div class="verdict v-ko">Le capital garanti est inférieur à ce que vous versez. Demandez par écrit ce que paient les frais et la garantie décès.</div>':c<t*1.1?'<div class="verdict v-mid">Le capital garanti dépasse à peine vos versements. Sur '+d+' ans, les frais scolaires peuvent monter plus vite.</div>':'<div class="verdict v-ok">Le capital garanti dépasse vos versements. Vérifiez qu’il est bien écrit « garanti », et pas seulement « estimé ».</div>'; }
            if(D.ee_dec==="Ce n’est pas écrit clairement") o+='<div class="verdict v-mid">Demandez que la garantie en cas de décès soit écrite : c’est elle qui protège les études de votre enfant.</div>';
            return o; } },
        p: "J’ai comparé ce que je verse au capital garanti." },
      { t: "Les questions à poser", c: "Un conseiller sérieux répond aux questions précises, et par écrit. Cochez celles que vous poserez avant de signer.",
        w: { puces: { id:"ee_q", k:"Mes questions", m:1, l:["La compagnie est-elle agréée dans le cadre de la CIMA ?","Quels sont tous les frais, en pourcentage ?","Quel capital est garanti, et à quelle date ?","Que se passe-t-il si je décède ou deviens invalide ?","Que récupérer si je sors au bout de 2 ou 3 ans ?","Que se passe-t-il si je saute des versements ?","Y a-t-il un délai pour changer d’avis après la signature ?"] } },
        p: "Ma liste de questions est prête." }
    ]},
    { t: "Mon plan", acq: "Mon plan est écrit", desc: "La rentrée préparée, le relais prévu, les papiers rangés.", e: [
      { t: "La rentrée de septembre", c: "La rentrée a sa propre caisse, séparée de l’épargne du supérieur. La leçon EFA sur la tontine de rentrée détaille l’autre façon de la préparer.",
        w: { ex: "Affoué paie environ 420 000 F à chaque rentrée pour ses deux enfants. Elle verse 35 000 F par mois dans une caisse rentrée, d’octobre à septembre.", champs: [ {id:"ee_ren", l:"Coût d’une rentrée, tous les enfants (F)"}, {id:"ee_rm", l:"Mois avant la prochaine rentrée", ph:"10"} ], puces: { id:"ee_rmode", k:"Je la finance par", l:["Une caisse rentrée mensuelle","Une tontine de rentrée"] },
          v: function(D,H){ var r=H.N(D.ee_ren), m=H.N(D.ee_rm)||12; if(!r) return ''; var o='<div class="gros"><small>Caisse rentrée</small><b>'+H.F(r/m)+' par mois</b><p>Pendant '+m+' mois, pour une rentrée à '+H.F(r)+'.</p></div>';
            if(D.ee_rmode==="Une tontine de rentrée") o+='<div class="verdict v-mid">Vérifiez que votre tour tombe en août ou début septembre, pas après la rentrée.</div>';
            return o; } },
        p: "Ma caisse rentrée est fixée." },
      { t: "Si je ne peux plus payer", c: "Un plan connu de vous seul ne protège pas vos enfants. Écrivez qui prend le relais, dites-le-lui, et rangez les papiers au même endroit.",
        w: { champs: [ {id:"ee_relais", l:"Qui prend le relais si je ne peux plus payer", type:"txt", large:1, ph:"Ma sœur Aya, qui sait où sont les papiers"} ], puces: { id:"ee_pap", k:"Les papiers que je garde ensemble", m:1, l:["Contrat d’assurance études","Relevés d’épargne","Carnet de tontine","Actes de naissance des enfants","Reçus de scolarité","Liste de mes comptes pour mes proches"] } },
        p: "Mon relais est prévu et mes papiers sont rangés." }
    ]}
  ],
  fin: {
    k: "Ma fiche études", titre: "Les études de votre enfant ont un plan",
    fiche: [
      ["Enfant", function(D,H){ var R=window.ATELIER._calc(D,H); return R?(D.ee_nom?D.ee_nom+', ':'')+R.age+' an'+(R.age>1?'s':'')+(R.ans?' · supérieur dans '+R.ans+' an'+(R.ans>1?'s':''):''):''; }],
      ["Coût des études restantes", function(D,H){ var R=window.ATELIER._calc(D,H); return R&&R.total?'environ '+H.F(R.total)+(H.N(D.ee_hau)?' (hausse de '+H.N(D.ee_hau)+' % par an)':''):''; }],
      ["Besoin pour le supérieur", function(D,H){ var R=window.ATELIER._calc(D,H); return R&&R.besoin?'environ '+H.F(R.besoin)+(D.ee_lieu?' · '+D.ee_lieu.toLowerCase():''):''; }],
      ["À mettre de côté chaque mois", function(D,H){ var A=window.ATELIER, R=A._calc(D,H); if(!R||!R.ans||!R.besoin) return ''; var m=A._mens(R.besoin,H.N(D.ee_dej),R.ans,H.N(D.ee_rdt)); return m?H.F(m)+' par mois'+(H.N(D.ee_rdt)?' (rendement d’exemple de '+H.N(D.ee_rdt)+' %)':''):''; }],
      ["Effort total, tous les enfants", function(D,H){ var A=window.ATELIER, R=A._calc(D,H), m=R&&R.ans?A._mens(R.besoin,H.N(D.ee_dej),R.ans,H.N(D.ee_rdt)):0; if(!H.N(D.ee_e2)&&!H.N(D.ee_e3)) return ''; return H.F(m+H.N(D.ee_e2)+H.N(D.ee_e3))+' par mois'; }],
      ["Mes outils", function(D){ return (D.ee_out||[]).join(', '); }],
      ["Rentrée de septembre", function(D,H){ var r=H.N(D.ee_ren); return r?H.F(r/(H.N(D.ee_rm)||12))+' par mois'+(D.ee_rmode?' · '+D.ee_rmode.toLowerCase():''):''; }],
      ["Relais si je ne peux plus payer", function(D){ return D.ee_relais||''; }]
    ],
    suite: { t: "Assurance-vie : comprendre ce que je signe", p: "On vous propose une assurance études ? L’atelier suivant vous apprend à lire le contrat : frais, garanties, sortie et bénéficiaires.", lien: "atelier-assurance-vie.html", b: "Ouvrir l’atelier" }
  }
};
