/* Atelier guidé · Construire son portefeuille à la Bourse (BRVM) */
function cpLignes(D,H){
  var L=[]; for(var i=1;i<=5;i++){ var m=H.N(D['cp_m'+i]); if(m>0) L.push({n:(D['cp_n'+i]||('Ligne '+i)), s:(D['cp_s'+i]||'').trim(), m:m}); }
  var tot=L.reduce(function(a,x){return a+x.m;},0);
  L.forEach(function(x){ x.p=tot?x.m/tot*100:0; });
  var S={}; L.forEach(function(x){ var k=(x.s||'Secteur non précisé').toLowerCase(); S[k]=(S[k]||0)+x.p; });
  return {L:L, tot:tot, S:S};
}
function cpPct(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR')+' %'; }
function cpFrais(D,H){
  var cap=cpLignes(D,H).tot||H.N(D.cp_cap), n=cpLignes(D,H).L.length||H.N(D.cp_nb)||0;
  var ct=H.N(D.cp_court), gd=H.N(D.cp_garde), tc=H.N(D.cp_tenue), mn=H.N(D.cp_min);
  if(!cap) return null;
  var achat=Math.max(cap*ct/100, mn*n), garde=cap*gd/100, an1=achat+garde+tc;
  return {cap:cap, achat:achat, garde:garde, tenue:tc, an1:an1, pct:an1/cap*100, rec:garde+tc};
}
window.ATELIER = {
  id: "construire-son-portefeuille",
  titre: "Construire son portefeuille à la Bourse",
  h1: "Vous avez acheté des actions. Avez-vous un portefeuille ?",
  voix: "auto",
  question: {
    t: "Vous avez 300 000 F à placer à la Bourse (BRVM). Par quoi commencez-vous ?",
    r: [
      ["a", "Je cherche la meilleure action du moment.", "C’est le réflexe le plus courant. Mais même la meilleure société peut traverser une mauvaise année. Un portefeuille se décide avant de choisir un titre : c’est ce que vous allez faire ici.", false],
      ["b", "J’écris mes règles : durée, nombre de lignes, plafond par ligne.", "Exactement. Les règles d’abord, les titres ensuite. Vous allez écrire les vôtres, puis vérifier vos lignes et vos frais, chiffres en main.", true]
    ]
  },
  chapitres: [
    { t: "Mon point de départ", acq: "Je sais quel argent je place", desc: "La durée, la réserve et le montant, avant tout titre.", e: [
      { t: "Une collection ou un portefeuille ?", f: ["Une collection d’achats : des titres pris un par un, au fil des nouvelles et des conseils.", "Un portefeuille : des lignes choisies pour un objectif, avec un poids décidé à l’avance pour chacune.", "La différence se voit le jour où un titre chute : dans un portefeuille, aucune ligne ne peut tout emporter."], c: "On ne construit pas un portefeuille en choisissant des actions. On le construit en décidant d’abord des règles.",
        p: "Je fais la différence entre une collection d’achats et un portefeuille." },
      { t: "L’argent que je peux laisser", c: "La Bourse monte et baisse. Seul l’argent dont vous n’aurez pas besoin avant plusieurs années peut y attendre une mauvaise période.",
        w: { ex: "Awa (exemple fictif) a 400 000 F de côté. Elle garde 100 000 F de réserve pour les imprévus et place 300 000 F, qu’elle peut laisser 5 ans.", k: "Votre situation · vos chiffres restent sur votre téléphone, EFA ne les garde pas. Vous pouvez mettre des chiffres fictifs, proches de votre réalité.", champs: [ {id:"cp_cap", l:"Montant à placer (F)", ph:"300 000"}, {id:"cp_res", l:"Réserve gardée à part (F)", ph:"100 000"}, {id:"cp_dur", l:"Durée sans y toucher (années)", ph:"5"} ],
          v: function(D,H){ var c=H.N(D.cp_cap), r=H.N(D.cp_res), d=H.N(D.cp_dur); if(!c||!D.cp_dur) return '';
            if(d<2) return '<div class="verdict v-ko">Moins de 2 ans : une baisse n’aurait pas le temps de se rattraper. Cet argent a plutôt sa place sur un support sans risque de perte. Vous pouvez continuer l’atelier pour apprendre la méthode.</div>';
            if(!r) return '<div class="verdict v-mid">Vous n’avez pas indiqué de réserve. Sans réserve à part, un imprévu peut vous obliger à vendre au mauvais moment. Constituez-la d’abord.</div>';
            if(d<5) return '<div class="verdict v-mid">Entre 2 et 5 ans : c’est possible, avec prudence. Gardez des lignes faciles à revendre et des poids raisonnables.</div>';
            return '<div class="verdict v-ok">5 ans ou plus, avec une réserve à part : vous placez le bon argent. Les règles viennent ensuite.</div>'; } },
        p: "J’ai écrit mon montant, ma réserve et ma durée." },
      { t: "Ce que j’attends de ce portefeuille", c: "Un portefeuille peut faire grandir le capital, verser des revenus, ou limiter les chutes. On ne peut pas tout demander à la fois : choisissez votre priorité.",
        w: { puces: { id:"cp_obj", k:"Ma priorité", l:["Faire grandir mon capital","Recevoir des dividendes réguliers","Limiter les baisses avant tout"] },
          v: function(D){ var R={"Faire grandir mon capital":["v-ok","Priorité à la croissance : il faut du temps, et accepter des années en baisse sans vendre."],"Recevoir des dividendes réguliers":["v-ok","Priorité aux revenus : regardez si le bénéfice couvre le dividende, année après année. Un dividende n’est jamais garanti."],"Limiter les baisses avant tout":["v-mid","Priorité à la prudence : des poids égaux, des secteurs différents, et peut-être une part hors actions. Aucune action n’est sans risque."]}[D.cp_obj]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai choisi ma priorité." }
    ]},
    { t: "Mes règles", acq: "J’écris mes règles avant d’acheter", desc: "Nombre de lignes, plafond par ligne, secteurs.", e: [
      { t: "Trois règles simples", f: ["Un plafond par ligne : aucune action ne dépasse une part fixée de mon portefeuille.", "Plusieurs secteurs : une banque, un opérateur de télécoms et une plantation ne souffrent pas des mêmes chocs.", "Un nombre de lignes que je peux suivre : mieux vaut 4 sociétés que je lis vraiment que 12 que je ne regarde plus."], c: "Ces règles ne garantissent aucun gain. Elles servent à une chose : qu’une seule mauvaise nouvelle ne décide pas de tout votre argent.",
        p: "Je connais les trois règles." },
      { t: "Mes règles chiffrées", c: "Écrivez vos règles maintenant, à froid. Elles serviront le jour où un titre montera très vite, ou chutera.",
        w: { ex: "Awa (fictif), 300 000 F : 4 lignes, 30 % au plus par ligne, 3 secteurs au moins.", k: "Mes règles", champs: [ {id:"cp_nb", l:"Nombre de lignes", ph:"4"}, {id:"cp_max", l:"Plafond par ligne (%)", ph:"30"}, {id:"cp_sec", l:"Nombre de secteurs au moins", ph:"3"} ],
          v: function(D,H){ var n=H.N(D.cp_nb), mx=H.N(D.cp_max), s=H.N(D.cp_sec), c=H.N(D.cp_cap); if(!n||!mx) return ''; var M=[];
            if(n*mx<100) return '<div class="verdict v-ko">'+n+' lignes à '+mx+' % au plus ne font pas 100 %. Augmentez le nombre de lignes ou le plafond.</div>';
            if(n<3) M.push('Moins de 3 lignes : une seule société pèse très lourd.');
            if(mx>35) M.push('Au-delà de 35 % sur une ligne, une chute de ce titre se voit sur tout le portefeuille.');
            if(s&&s>n) M.push('Vous demandez plus de secteurs que de lignes.');
            if(c&&n&&c/n<25000) M.push('Cela fait moins de 25 000 F par ligne : regardez bien les frais au chapitre 4, ils pèsent lourd sur les petits montants.');
            if(n>8) M.push('Plus de 8 lignes : aurez-vous le temps de lire les comptes de chacune ?');
            return M.length?'<div class="verdict v-mid">'+M.join(' ')+'</div>':'<div class="verdict v-ok">Vos règles tiennent ensemble. Gardez-les sous les yeux : elles valent pour les jours de hausse comme pour les jours de baisse.</div>'; } },
        p: "Mes trois règles sont écrites." },
      { t: "Vrai ou faux ?", c: "Trois idées reçues sur la diversification.",
        w: { quiz: [ ["Vingt lignes protègent forcément mieux que six", ["Vrai","Faux"], 1, "Au-delà de quelques lignes bien réparties, le gain de protection devient faible, et le suivi devient difficile."], ["Trois banques de trois pays, c’est un portefeuille diversifié", ["Vrai","Faux"], 1, "Ce sont trois lignes, mais un seul secteur : un choc sur les banques les touche toutes."], ["La diversification protège d’une baisse de tout le marché", ["Vrai","Faux"], 1, "Elle réduit le risque propre à une société ou à un secteur. Quand tout le marché baisse, tout le portefeuille baisse."] ] },
        p: "J’ai répondu aux trois questions." }
    ]},
    { t: "Mes lignes", acq: "Je vérifie le poids de chaque ligne", desc: "Vos lignes, leurs poids, vos règles respectées ou non.", e: [
      { t: "Mes lignes et leurs poids", c: "Inscrivez les lignes que vous avez, ou celles que vous étudiez. EFA ne dit jamais quel titre acheter : l’atelier vérifie seulement vos poids.",
        w: { ex: "Awa (sociétés fictives) : Télécom du Golfe, télécoms, 90 000 F · Banque du Sahel, banque, 75 000 F · Brasserie Ivoire, consommation, 75 000 F · Plantations du Sud, agro-industrie, 60 000 F.", k: "Jusqu’à 5 lignes : nom, secteur, montant en F", champs: [
            {id:"cp_n1", l:"Ligne 1 · nom de la société", type:"txt", ph:"Nom", large:1}, {id:"cp_s1", l:"Secteur", type:"txt", ph:"Télécoms"}, {id:"cp_m1", l:"Montant (F)"},
            {id:"cp_n2", l:"Ligne 2 · nom de la société", type:"txt", ph:"Nom", large:1}, {id:"cp_s2", l:"Secteur", type:"txt", ph:"Banque"}, {id:"cp_m2", l:"Montant (F)"},
            {id:"cp_n3", l:"Ligne 3 · nom de la société", type:"txt", ph:"Nom", large:1}, {id:"cp_s3", l:"Secteur", type:"txt", ph:"Consommation"}, {id:"cp_m3", l:"Montant (F)"},
            {id:"cp_n4", l:"Ligne 4 · nom de la société", type:"txt", ph:"Nom", large:1}, {id:"cp_s4", l:"Secteur", type:"txt", ph:"Agro-industrie"}, {id:"cp_m4", l:"Montant (F)"},
            {id:"cp_n5", l:"Ligne 5 · nom de la société", type:"txt", ph:"Nom", large:1}, {id:"cp_s5", l:"Secteur", type:"txt", ph:"Industrie"}, {id:"cp_m5", l:"Montant (F)"} ],
          v: function(D,H){ var R=cpLignes(D,H); if(!R.L.length) return ''; var mx=H.N(D.cp_max)||35, ms=H.N(D.cp_sec)||0;
            var gros=R.L.slice().sort(function(a,b){return b.p-a.p;})[0], ks=Object.keys(R.S), sm=ks.sort(function(a,b){return R.S[b]-R.S[a];})[0];
            var h='<div class="gros"><small>Total placé</small><b>'+H.F(R.tot)+'</b><p>'+R.L.map(function(x){return H.esc(x.n)+' : '+cpPct(x.p);}).join(' · ')+'</p></div>', M=[];
            if(gros.p>mx+0.5) M.push(H.esc(gros.n)+' pèse '+cpPct(gros.p)+', au-dessus de votre plafond de '+mx+' %.');
            if(R.S[sm]>50&&ks.length>1) M.push('Le secteur « '+H.esc(sm)+' » pèse '+cpPct(R.S[sm])+' : plus de la moitié de votre argent dépend de lui.');
            if(ks.length===1&&R.L.length>1) M.push('Toutes vos lignes sont dans le même secteur.');
            if(ms&&ks.length<ms) M.push('Vous avez '+ks.length+' secteur'+(ks.length>1?'s':'')+', votre règle en demande '+ms+'.');
            if(R.L.length===1) M.push('Une seule ligne : c’est un pari sur une société, pas encore un portefeuille.');
            return h+(M.length?'<div class="verdict '+(M.length>1?'v-ko':'v-mid')+'">'+M.join(' ')+'</div>':'<div class="verdict v-ok">Vos lignes respectent vos règles. Cela ne dit rien de la qualité de chaque société : lisez leurs comptes une par une.</div>'); } },
        p: "Mes lignes et leurs poids sont écrits." },
      { t: "Puis-je revendre ?", c: "À la Bourse régionale, certains titres s’échangent tous les jours, d’autres très peu. Un titre peu échangé peut être difficile à vendre au prix affiché.",
        f: ["Regardez le volume échangé chaque jour dans le Bulletin officiel de la cote, pas seulement le cours.", "Passez un ordre « à cours limité » : vous fixez votre prix, l’ordre attend s’il n’est pas atteint.", "La Bourse régionale négocie en continu de 9 h 45 à 14 h (temps universel), entre un prix d’ouverture et un prix de clôture : votre ordre peut être servi en plusieurs fois."],
        w: { consignes: 1, puces: { id:"cp_liq", k:"Parmi mes lignes, les titres peu échangés pèsent…", l:["Aucune ligne","Moins d’un quart","Plus d’un quart","Je ne sais pas"] },
          v: function(D){ var R={"Aucune ligne":["v-ok","Vous pourrez revendre sans trop attendre. Vérifiez-le de temps en temps : les volumes changent."],"Moins d’un quart":["v-ok","C’est raisonnable, si vous n’aurez pas besoin de cet argent en urgence."],"Plus d’un quart":["v-mid","Une part importante de votre argent peut être longue à revendre. Assurez-vous que votre réserve couvre vos imprévus."],"Je ne sais pas":["v-mid","Ouvrez le Bulletin officiel de la cote sur le site de la Bourse régionale et regardez le volume de chacun de vos titres sur plusieurs jours."]}[D.cp_liq]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai vérifié si mes titres s’échangent assez." }
    ]},
    { t: "Le coût réel", acq: "Je compte mes frais et l’impôt", desc: "Courtage, garde, tenue de compte, impôt sur les dividendes.", e: [
      { t: "Quatre coûts à connaître", f: ["Le courtage : un pourcentage prélevé à chaque achat et à chaque vente, parfois avec un minimum par ordre.", "Les droits de garde et la tenue de compte : payés chaque année, que vos titres montent ou baissent.", "L’impôt sur les dividendes : il est retenu avant le versement. Son taux dépend du pays et du titre : demandez-le à votre SGI."], c: "Un gain se calcule toujours après frais et après impôt. Sur un petit portefeuille, les frais peuvent peser autant qu’une année de dividendes.",
        p: "Je connais les coûts d’un portefeuille." },
      { t: "Mes frais la première année", c: "Prenez la grille de tarifs de votre société de Bourse (SGI). Repères du relevé EFA de novembre 2026, à confirmer auprès de chaque SGI : courtage le plus souvent de 1 %, droits de garde de 0,25 à 0,5 % par an, tenue de compte de 0 F à 2 500 F par trimestre.",
        w: { ex: "Awa (fictif), 300 000 F en 4 lignes : courtage 1 %, soit 3 000 F ; garde 0,5 %, soit 1 500 F ; tenue de compte 10 000 F par an. Total : 14 500 F, soit 4,8 % de son argent la première année.", k: "Les tarifs de votre SGI", champs: [ {id:"cp_court", l:"Courtage (%)", ph:"1"}, {id:"cp_min", l:"Minimum par ordre (F), s’il existe", ph:"0"}, {id:"cp_garde", l:"Droits de garde (% par an)", ph:"0,5"}, {id:"cp_tenue", l:"Tenue de compte (F par an)", ph:"10 000"} ],
          v: function(D,H){ var R=cpFrais(D,H); if(!R||(!D.cp_court&&!D.cp_garde&&!D.cp_tenue)) return '';
            var h='<div class="gros"><small>Frais de la première année</small><b>'+H.F(R.an1)+'</b><p>Soit '+cpPct(R.pct)+' de vos '+H.F(R.cap)+'. Courtage à l’achat : '+H.F(R.achat)+' · garde : '+H.F(R.garde)+' · tenue de compte : '+H.F(R.tenue)+'. Ensuite, chaque année : '+H.F(R.rec)+', sans compter vos nouveaux ordres ni les taxes sur les frais.</p></div>';
            var v=R.pct>4?['v-ko','Plus de 4 % de frais la première année : il faudra une bonne année rien que pour revenir à zéro. Comparez les SGI, réduisez le nombre d’ordres, ou regardez les fonds communs de placement (FCP), qui regroupent l’argent de nombreux épargnants.']:R.pct>2?['v-mid','Entre 2 et 4 % : c’est courant sur un petit portefeuille. Les frais fixes pèsent moins quand le montant grandit ; comparez tout de même les SGI.']:['v-ok','Moins de 2 % la première année : vos frais restent mesurés. Vérifiez-les chaque année sur votre relevé.'];
            return h+'<div class="verdict '+v[0]+'">'+v[1]+'</div>'; } },
        p: "J’ai calculé mes frais de la première année." },
      { t: "Ce qu’un dividende me laisse vraiment", c: "Un rendement affiché est un rendement brut. Ce qui arrive sur votre compte vient après l’impôt, et vos frais annuels s’en déduisent.",
        w: { ex: "Awa (fictif) reçoit 18 000 F de dividendes bruts sur ses 300 000 F, soit 6 %. Avec une retenue de 10 % (hypothèse), il reste 16 200 F. Moins 11 500 F de frais annuels : 4 700 F, soit 1,6 %.", k: "Votre estimation · un dividende n’est jamais garanti", champs: [ {id:"cp_div", l:"Dividendes bruts attendus sur un an (F)", ph:"18 000"}, {id:"cp_imp", l:"Retenue sur dividendes (%), selon votre SGI", ph:"10"} ],
          v: function(D,H){ var d=H.N(D.cp_div), t=H.N(D.cp_imp), R=cpFrais(D,H); if(!d||!R) return ''; var net=d*(1-t/100), reste=net-R.rec;
            var h='<div class="gros"><small>Ce qu’il reste après impôt et frais annuels</small><b>'+H.F(reste)+'</b><p>Brut : '+H.F(d)+' ('+cpPct(d/R.cap*100)+') · après retenue : '+H.F(net)+' · frais annuels : '+H.F(R.rec)+' · reste : '+cpPct(reste/R.cap*100)+' de votre argent.</p></div>';
            return h+(reste<=0?'<div class="verdict v-ko">Vos frais annuels dépassent vos dividendes nets. Les dividendes seuls ne paient pas ce portefeuille : il dépend de la hausse des cours, qui n’est jamais acquise.</div>':reste/R.cap<0.02?'<div class="verdict v-mid">Il reste moins de 2 % par an. Comparez avec ce que rapporte un placement sans risque de perte, avant de décider.</div>':'<div class="verdict v-ok">Vos dividendes couvrent vos frais annuels. Refaites ce calcul chaque année avec les montants réellement reçus.</div>'); } },
        p: "J’ai calculé ce qu’il me reste après impôt et frais." }
    ]},
    { t: "Mon suivi", acq: "Je sais quand agir, et quand ne rien faire", desc: "Le rythme de revue, le rééquilibrage, la règle de vente.", e: [
      { t: "Regarder moins, regarder mieux", f: ["Un rendez-vous fixe : une fois par trimestre, ou à chaque publication de comptes, suffit pour la plupart des épargnants.", "Compter les dividendes : la performance, c’est la variation des cours plus les dividendes reçus, moins les frais.", "Une baisse à l’écran n’est une perte que si l’on vend. Mais une société dont les comptes se dégradent mérite une vraie relecture."], c: "Suivre son portefeuille ne veut pas dire le regarder chaque jour. Chaque ordre coûte : l’agitation se paie.",
        w: { consignes: 1, puces: { id:"cp_rev", k:"Je fais le point sur mon portefeuille…", l:["Chaque trimestre","Deux fois par an","Une fois par an"] } },
        p: "J’ai choisi mon rythme de revue." },
      { t: "Quand un titre prend trop de place", c: "Un titre qui monte beaucoup finit par peser plus que votre plafond. Rééquilibrer, c’est revenir à vos règles : en vendant un peu, ou en plaçant votre nouvel argent ailleurs.",
        w: { ex: "Awa (fictif) : sa ligne télécoms a monté et pèse 38 % au lieu de 30 %. Plutôt que de vendre, elle place ses 50 000 F suivants sur ses trois autres lignes : moins d’ordres, moins de frais.", k: "Ma règle de rééquilibrage", champs: [ {id:"cp_seuil", l:"Je réagis si une ligne dépasse (%)", ph:"35"} ], puces: { id:"cp_reeq", k:"Je rééquilibre d’abord…", l:["Avec mon nouvel argent","En vendant une partie du titre"] },
          v: function(D,H){ var s=H.N(D.cp_seuil), mx=H.N(D.cp_max); if(!s&&!D.cp_reeq) return ''; var M=[];
            if(s&&mx&&s<mx) M.push('Votre seuil ('+s+' %) est sous votre plafond ('+mx+' %) : vous seriez en alerte dès le premier jour.');
            if(s&&mx&&s>mx+15) M.push('Votre seuil est très au-dessus de votre plafond : la règle risque de ne jamais servir.');
            if(D.cp_reeq==='En vendant une partie du titre') M.push('Vendre entraîne des frais de courtage : gardez cette solution pour les grands écarts.');
            return M.length?'<div class="verdict v-mid">'+M.join(' ')+'</div>':'<div class="verdict v-ok">Règle claire. Laissez les petits écarts de quelques points : les corriger coûterait plus que cela ne rapporte.</div>'; } },
        p: "Ma règle de rééquilibrage est écrite." },
      { t: "Ma règle de vente", c: "On vend pour trois raisons : l’objectif est atteint, la société a changé, ou une ligne a pris trop de place. Jamais sur un conseil reçu sans vérifier, ni parce que l’écran est rouge.",
        w: { quiz: [ ["Mon titre perd 12 % en un mois, les comptes n’ont pas changé", ["Je vends tout de suite","Je relis mes raisons d’achat"], 1, "Si vos raisons tiennent toujours, la baisse seule ne suffit pas à vendre."], ["La société annonce deux années de pertes et suspend son dividende", ["Je relis mes raisons d’achat","J’attends sans rien regarder"], 0, "Les faits ont changé : votre raison d’achat tient-elle encore ?"], ["Un inconnu promet sur un groupe WhatsApp qu’un titre va doubler", ["J’achète vite","Je vérifie les comptes, ou je passe"], 1, "Une promesse de gain rapide est le premier signal d’alerte. Le conseil en placement est un métier réglementé."] ], ex: "Awa (fictif) : « Je vends si la société perd de l’argent deux années de suite, ou si une ligne dépasse 40 % malgré mon nouvel argent. »", consignes: 1, champs: [ {id:"cp_vente", l:"Je vends si…", type:"area", ph:"Je vends si…"} ] },
        p: "Ma règle de vente est écrite." }
    ]}
  ],
  fin: {
    k: "Ma politique de portefeuille", titre: "Vous avez vos règles, écrites de votre main",
    fiche: [
      ["Argent placé, réserve, durée", function(D,H){ if(!H.N(D.cp_cap)) return ''; return H.F(H.N(D.cp_cap))+(H.N(D.cp_res)?' · réserve '+H.F(H.N(D.cp_res)):'')+(D.cp_dur?' · '+H.esc(D.cp_dur)+' ans':''); }],
      ["Ma priorité", function(D){ return D.cp_obj||''; }],
      ["Mes règles", function(D,H){ if(!H.N(D.cp_nb)) return ''; return H.N(D.cp_nb)+' lignes · '+H.N(D.cp_max)+' % au plus par ligne'+(H.N(D.cp_sec)?' · '+H.N(D.cp_sec)+' secteurs au moins':''); }],
      ["Mes lignes", function(D,H){ var R=cpLignes(D,H); return R.L.map(function(x){ return x.n+' '+cpPct(x.p); }).join(' · '); }],
      ["Frais de la première année", function(D,H){ var R=cpFrais(D,H); if(!R||!R.an1) return ''; return H.F(R.an1)+' · '+cpPct(R.pct); }],
      ["Dividendes après impôt et frais", function(D,H){ var d=H.N(D.cp_div), R=cpFrais(D,H); if(!d||!R) return ''; return H.F(d*(1-H.N(D.cp_imp)/100)-R.rec)+' par an (estimation)'; }],
      ["Mon suivi", function(D,H){ return [D.cp_rev, H.N(D.cp_seuil)?'alerte au-delà de '+H.N(D.cp_seuil)+' %':'', D.cp_reeq].filter(Boolean).join(' · '); }],
      ["Ma règle de vente", function(D){ return D.cp_vente||''; }]
    ],
    suite: { t: "Lire une société cotée", p: "Vos règles sont écrites. Pour choisir chaque ligne, apprenez à lire les comptes d’une société. Le choix du titre reste le vôtre : EFA fait de l’éducation financière, pas du conseil en placement, qui est une activité réglementée.", lien: "atelier-lire-societe-cotee.html", b: "Ouvrir l’atelier" }
  }
};
