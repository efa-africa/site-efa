/* Atelier guidé · Acheter, construire ou attendre */
window.ATELIER = {
  id: "acheter-construire-attendre",
  titre: "Acheter, construire ou attendre : que permettent vraiment mes revenus ?",
  h1: "Un toit à vous, au rythme de vos vrais revenus.",
  voix: "auto",
  /* Calculs partagés par les écrans et la fiche (repris à chaque affichage) */
  calc: function(D,H){
    var N=H.N, rev=N(D.ac_rev), chg=N(D.ac_chg), det=N(D.ac_det), pct=N(D.ac_pct)||33;
    var cap=Math.max(0,rev*pct/100-det), reste=rev-chg-det;
    var dispo=Math.max(0,N(D.ac_epa)-N(D.ac_res)-N(D.ac_pro));
    var fp=(N(D.ac_fpct)||10)/100, taux=D.ac_taux==null||D.ac_taux===''?8:N(D.ac_taux), dur=N(D.ac_dur)||15;
    function mens(C,ta,ans){ var n=Math.round(ans*12), t=ta/100/12; if(!C||n<=0) return 0; if(!t) return C/n; return C*t/(1-Math.pow(1+t,-n)); }
    var prix=N(D.ac_prix), frais=prix*fp, credit=Math.max(0,prix+frais-dispo), m1=mens(credit,taux,dur);
    var marge=N(D.ac_marg), tot=N(D.ac_e1)+N(D.ac_e2)+N(D.ac_e3), totM=tot*(1+marge/100), mois2=N(D.ac_mois);
    var reste2=Math.max(0,totM-dispo), ep2=mois2?reste2/mois2:0;
    var vise=N(D.ac_vise), ep3=N(D.ac_ep3), n3=ep3?Math.ceil(Math.max(0,vise-dispo)/ep3):0;
    var b=N(D.ac_baisse)||20, cap20=Math.max(0,rev*(1-b/100)*pct/100-det);
    return {rev:rev,chg:chg,det:det,pct:pct,cap:cap,reste:reste,dispo:dispo,fp:fp,taux:taux,dur:dur,prix:prix,frais:frais,credit:credit,m1:m1,marge:marge,tot:tot,totM:totM,mois2:mois2,reste2:reste2,ep2:ep2,vise:vise,ep3:ep3,n3:n3,b:b,cap20:cap20};
  },
  question: {
    t: "Vous gagnez 500 000 F par mois. Une banque accepte un crédit à 250 000 F par mois. Vous signez ?",
    r: [
      ["a", "Oui : si la banque accepte, c’est que ça passe.", "C’est une réaction très courante. Mais la banque regarde son risque, pas votre quotidien : l’école, la famille, les imprévus. Cet atelier vous fait calculer ce qui tient pour vous.", false],
      ["b", "Pas avant d’avoir fait mes propres calculs.", "Exactement. Vous allez chiffrer ce que vos revenus permettent vraiment, puis comparer trois chemins avant de décider.", true]
    ]
  },
  chapitres: [
    { t: "Ma capacité", acq: "Je connais ma mensualité supportable", desc: "Ce qui entre, ce qui sort, et ce qui reste pour le logement.", e: [
      { t: "Ce qui entre, ce qui sort", c: "On part du revenu net du foyer, celui qui arrive vraiment chaque mois. Puis on enlève ce qui part quoi qu’il arrive.",
        w: { ex: "Koffi et Awa touchent 600 000 F nets à deux. Charges fixes : 280 000 F. Prêt en cours : 50 000 F. Il leur reste 270 000 F.", k: "Votre foyer, chaque mois", c3: 1, champs: [ {id:"ac_rev", l:"Revenu net du foyer (F)"}, {id:"ac_chg", l:"Charges fixes : loyer, école, transport, nourriture (F)"}, {id:"ac_det", l:"Mensualités de dettes en cours (F)"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!R.rev) return ''; return '<div class="gros"><small>Ce qui reste après charges et dettes</small><b>'+H.F(R.reste)+' par mois</b><p>'+(R.reste>0?'C’est la limite haute de ce que le logement peut prendre.':'Les charges dépassent déjà le revenu : on regarde d’abord le budget avant tout projet.')+'</p></div>'; } },
        p: "Mon revenu, mes charges et mes dettes sont écrits." },
      { t: "Le repère du tiers", c: "Beaucoup de banques regardent si toutes vos mensualités restent autour d’un tiers du revenu au plus. C’est un repère courant, pas une loi.",
        w: { quiz: [
          ["Revenu du foyer 450 000 F, aucune dette. Mensualité proposée : 150 000 F.", ["Dans le repère","Au-dessus du repère"], 0, "150 000 F, c’est le tiers de 450 000 F : c’est la limite haute."],
          ["Revenu 450 000 F, déjà 80 000 F de prêt en cours. Nouvelle mensualité : 120 000 F.", ["Dans le repère","Au-dessus du repère"], 1, "Les mensualités s’additionnent : 200 000 F au total, c’est plus que 150 000 F."],
          ["Le tiers du revenu est une règle fixée par la loi.", ["Vrai","Faux"], 1, "C’est un repère courant des banques. Chaque banque applique sa propre politique."] ] },
        p: "Je sais lire le repère du tiers." },
      { t: "Ma mensualité supportable", c: "Votre mensualité supportable, c’est le repère moins les dettes que vous remboursez déjà. Vous pouvez choisir un repère plus prudent.",
        w: { ex: "Koffi et Awa : 600 000 F × 33 % = 198 000 F, moins 50 000 F de prêt en cours. Leur mensualité supportable : environ 148 000 F.", champs: [ {id:"ac_pct", l:"Part du revenu pour toutes les mensualités (%)", ph:"33"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!R.rev) return ''; var h='<div class="gros"><small>Votre mensualité supportable (repère '+R.pct+' %)</small><b>'+H.F(R.cap)+' par mois</b><p>'+(R.cap?'C’est le plafond pour le logement, crédit ou épargne de chantier.':'Vos dettes en cours prennent déjà tout le repère : les solder d’abord vous ouvre des portes.')+'</p></div>'; if(R.cap&&R.reste<R.cap) h+='<div class="verdict v-mid">Attention : après vos charges, il ne vous reste que '+H.F(Math.max(0,R.reste))+'. Retenez plutôt ce montant, ou allégez une charge.</div>'; return h; } },
        p: "Ma mensualité supportable est écrite." }
    ]},
    { t: "Mon apport", acq: "Je connais mon apport net", desc: "Ce que je peux mettre sans toucher ma réserve, et les frais à prévoir.", e: [
      { t: "Ce que je peux vraiment mettre", c: "Votre apport, c’est votre épargne moins la réserve de sécurité et l’argent déjà promis. La réserve ne part jamais dans les briques.",
        w: { ex: "Fatou a 5 000 000 F de côté. Elle garde 1 200 000 F de réserve et doit 300 000 F à sa tontine. Son apport : 3 500 000 F.", c3: 1, champs: [ {id:"ac_epa", l:"Épargne totale (F)"}, {id:"ac_res", l:"Réserve de sécurité à garder (F)"}, {id:"ac_pro", l:"Argent déjà promis ou dû (F)"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!H.N(D.ac_epa)) return ''; return '<div class="gros"><small>Votre apport disponible</small><b>'+H.F(R.dispo)+'</b><p>'+(H.N(D.ac_res)?'Votre réserve reste intacte.':'Vous n’avez pas encore mis de réserve de côté : gardez-en une avant de bâtir l’apport.')+'</p></div>'; } },
        p: "Mon apport disponible est écrit." },
      { t: "Les frais autour du prix", f: ["Les papiers du terrain ou du bien : bornage, géomètre, titre de propriété, selon le cas.", "Le notaire et l’enregistrement de la vente.", "À la banque : frais de dossier, assurance du crédit, garanties."], c: "Le prix affiché n’est jamais le prix final. Les papiers et les frais s’ajoutent, et ils se paient souvent comptant.",
        w: { consignes: 1, ex: "En ordre de grandeur, prévoyez autour de 10 % du prix pour les frais. Le montant exact se vérifie avec le notaire et la banque.", champs: [ {id:"ac_fpct", l:"Frais à prévoir, en % du prix", ph:"10"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!R.dispo) return ''; var lim=R.dispo/R.fp; return '<div class="gros"><small>Votre apport couvre les frais d’un bien jusqu’à environ</small><b>'+H.F(lim)+'</b><p>Au-delà, une partie des frais devra venir du crédit ou d’une épargne en plus.</p></div>'; } },
        p: "Je sais quels frais prévoir en plus du prix." }
    ]},
    { t: "Les trois scénarios", acq: "Je sais chiffrer trois chemins", desc: "Acheter tout fait, construire par étapes, attendre : un écran chacun.", e: [
      { t: "Scénario 1 : acheter tout fait", c: "Crédit = prix + frais − apport. La mensualité dépend du taux et de la durée : demandez-les à votre banque.",
        w: { ex: "Une maison à 25 000 000 F, 2 500 000 F de frais, 4 000 000 F d’apport : 23 500 000 F de crédit. À 8 % sur 15 ans (exemple de taux), environ 224 600 F par mois.", c3: 1, champs: [ {id:"ac_prix", l:"Prix du bien (F)"}, {id:"ac_taux", l:"Taux annuel (%), exemple", ph:"8"}, {id:"ac_dur", l:"Durée (années)", ph:"15"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!R.prix) return ''; var h='<div class="gros"><small>Crédit '+H.F(R.credit)+' · '+String(R.taux).replace('.',',')+' % sur '+R.dur+' ans</small><b>'+H.F(R.m1)+' par mois</b><p>Frais estimés : '+H.F(R.frais)+'. Coût total des intérêts : '+H.F(Math.max(0,R.m1*Math.round(R.dur*12)-R.credit))+'.</p></div>'; if(R.cap) h+=R.m1<=R.cap?'<div class="verdict v-ok">Cette mensualité tient dans votre capacité ('+H.F(R.cap)+').</div>':'<div class="verdict v-ko">Elle dépasse votre capacité de '+H.F(R.m1-R.cap)+' par mois. Un bien moins cher, plus d’apport ou une durée plus longue la feraient baisser.</div>'; return h; } },
        p: "Mon scénario « acheter » est chiffré." },
      { t: "Scénario 2 : construire par étapes", c: "On découpe le projet en étapes. Chaque étape se paie avec l’apport puis avec une épargne mensuelle, sans crédit.",
        w: { ex: "Moussa : terrain et papiers 4 000 000 F, gros œuvre 9 000 000 F, finitions 5 000 000 F. Avec 3 000 000 F d’apport, il reste 15 000 000 F sur 96 mois : environ 156 300 F par mois.", c3: 1, champs: [ {id:"ac_e1", l:"Étape 1 : terrain et papiers (F)"}, {id:"ac_e2", l:"Étape 2 : gros œuvre (F)"}, {id:"ac_e3", l:"Étape 3 : finitions (F)"}, {id:"ac_mois", l:"Durée totale du projet (mois)", ph:"96"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!R.tot) return ''; var h='<div class="gros"><small>Coût total '+H.F(R.totM)+(R.marge?' (marge de '+R.marge+' % comprise)':'')+' · reste à financer '+H.F(R.reste2)+'</small><b>'+(R.mois2?H.F(R.ep2)+' par mois':'Indiquez la durée')+'</b><p>'+(R.mois2?'pendant '+R.mois2+' mois, soit environ '+(Math.round(R.mois2/12*10)/10).toString().replace('.',',')+' ans.':'')+'</p></div>'; if(R.cap&&R.mois2) h+=R.ep2<=R.cap?'<div class="verdict v-ok">Cette épargne tient dans votre capacité.</div>':'<div class="verdict v-ko">Elle dépasse votre capacité. Allongez la durée ou réduisez une étape : avec '+H.F(R.cap)+' par mois, il faudrait environ '+Math.ceil(R.reste2/R.cap)+' mois.</div>'; return h; } },
        p: "Mon scénario « construire » est chiffré." },
      { t: "Scénario 3 : attendre et épargner", c: "Attendre n’est pas renoncer. C’est se donner un apport plus fort pour emprunter moins, ou construire plus vite.",
        w: { ex: "Fatou vise 6 000 000 F d’apport. Elle a 3 500 000 F et épargne 100 000 F par mois : 25 mois d’attente.", champs: [ {id:"ac_vise", l:"Apport visé (F)"}, {id:"ac_ep3", l:"Ce que j’épargne chaque mois (F)"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!R.vise) return ''; if(R.dispo>=R.vise) return '<div class="verdict v-ok">Votre apport atteint déjà ce montant : pas besoin d’attendre pour cet objectif.</div>'; if(!R.ep3) return ''; var h='<div class="gros"><small>Il vous manque '+H.F(R.vise-R.dispo)+'</small><b>'+R.n3+' mois d’attente</b><p>soit environ '+(Math.round(R.n3/12*10)/10).toString().replace('.',',')+' ans à '+H.F(R.ep3)+' par mois.</p></div>'; if(R.cap&&R.ep3>R.cap) h+='<div class="verdict v-mid">Cette épargne dépasse votre capacité : vérifiez qu’elle tient vraiment chaque mois.</div>'; return h; } },
        p: "Mon scénario « attendre » est chiffré." }
    ]},
    { t: "La marge pour les imprévus", acq: "Je prévois une marge pour les imprévus", desc: "Une marge chantier, les risques d’ici, et le test d’une baisse de revenu.", e: [
      { t: "La marge chantier", c: "Un chantier coûte presque toujours plus que prévu. Repère courant : ajoutez 10 à 15 % au budget dès le départ.",
        w: { ex: "Le chantier de Moussa à 18 000 000 F, avec 15 % de marge : 20 700 000 F. Son épargne passe à environ 184 400 F par mois.", champs: [ {id:"ac_marg", l:"Marge chantier (%)", ph:"15"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!R.tot||!R.marge) return ''; return '<div class="gros"><small>Votre budget de chantier avec '+R.marge+' % de marge</small><b>'+H.F(R.totM)+'</b><p>'+(R.mois2?'Épargne nécessaire : '+H.F(R.ep2)+' par mois sur '+R.mois2+' mois.':'Indiquez la durée au scénario 2 pour voir l’épargne mensuelle.')+'</p></div>'; } },
        p: "Ma marge chantier est fixée." },
      { t: "Les imprévus d’ici", c: "Les imprévus ne sont pas des malchances rares. Ce sont des risques connus, qu’on peut nommer à l’avance.",
        w: { puces: { id:"ac_imp", k:"Ceux qui pourraient toucher votre projet", m:1, l:["Hausse du prix du ciment ou du fer","Papiers du terrain plus longs que prévu","Perte ou baisse de revenu","Maladie dans la famille","Funérailles ou urgence d’un proche","Matériaux volés sur le chantier","Rentrée scolaire qui tombe en même temps"] } },
        p: "J’ai repéré les imprévus qui me concernent." },
      { t: "Le test des 20 %", c: "Une mensualité doit tenir les mauvais mois aussi. Si votre revenu baisse de 20 %, que devient votre plan ?",
        w: { ex: "Koffi et Awa : 600 000 F deviennent 480 000 F. Leur capacité passe de 148 000 F à environ 108 000 F.", champs: [ {id:"ac_baisse", l:"Baisse de revenu à tester (%)", ph:"20"} ],
          v: function(D,H){ var R=window.ATELIER.calc(D,H); if(!R.rev) return ''; var h='<div class="gros"><small>Votre capacité si le revenu baisse de '+R.b+' %</small><b>'+H.F(R.cap20)+' par mois</b></div>';
            if(R.m1) h+=R.m1<=R.cap20?'<div class="verdict v-ok">Acheter : la mensualité de '+H.F(R.m1)+' tient encore.</div>':'<div class="verdict v-ko">Acheter : la mensualité de '+H.F(R.m1)+' ne tient plus. Il manquerait '+H.F(R.m1-R.cap20)+' par mois.</div>';
            if(R.ep2) h+=R.ep2<=R.cap20?'<div class="verdict v-ok">Construire : l’épargne de '+H.F(R.ep2)+' tient encore.</div>':'<div class="verdict v-mid">Construire : l’épargne de '+H.F(R.ep2)+' ne tient plus, mais le chantier peut ralentir sans pénalité.</div>';
            return h; } },
        p: "J’ai testé mon plan avec une baisse de revenu." }
    ]},
    { t: "Décider", acq: "J’ai choisi mon chemin", desc: "Comparer les trois scénarios, écrire son choix, fixer les prochaines étapes.", e: [
      { t: "Les trois côte à côte", c: "Regardez les trois chemins avec vos chiffres. Le bon n’est pas le plus rapide : c’est celui qui tient, même les mauvais mois.",
        w: { puces: { id:"ac_choix", k:"Votre choix", l:["Acheter tout fait","Construire par étapes","Attendre et épargner"] },
          v: function(D,H){ var R=window.ATELIER.calc(D,H); function cl(x){ return !R.cap||!x?'v-mid':x<=R.cap20?'v-ok':x<=R.cap?'v-mid':'v-ko'; } function on(n){ return D.ac_choix===n?' <b>· votre choix</b>':''; }
            var L=[];
            L.push('<div class="verdict '+cl(R.m1)+'">Acheter tout fait : '+(R.m1?H.F(R.m1)+' par mois pendant '+R.dur+' ans, '+H.F(R.credit)+' de crédit':'à chiffrer au scénario 1')+'.'+on("Acheter tout fait")+'</div>');
            L.push('<div class="verdict '+cl(R.ep2)+'">Construire par étapes : '+(R.ep2?H.F(R.ep2)+' par mois pendant '+R.mois2+' mois, sans crédit':'à chiffrer au scénario 2')+'.'+on("Construire par étapes")+'</div>');
            L.push('<div class="verdict '+(R.n3?cl(R.ep3):'v-mid')+'">Attendre et épargner : '+(R.n3?R.n3+' mois pour atteindre '+H.F(R.vise)+' d’apport':'à chiffrer au scénario 3')+'.'+on("Attendre et épargner")+'</div>');
            return '<div class="gros"><small>Votre capacité</small><b>'+H.F(R.cap)+' par mois</b><p>'+H.F(R.cap20)+' si le revenu baisse de '+R.b+' %.</p></div>'+L.join(''); } },
        p: "J’ai comparé les trois scénarios." },
      { t: "Mon choix, par écrit", c: "Un choix écrit résiste mieux aux conseils de chacun. Écrivez ce que vous faites, et pourquoi.",
        w: { champs: [ {id:"ac_pq", l:"Mon choix et ma raison", type:"area", ph:"Je construis par étapes, parce que la mensualité du crédit ne tiendrait pas si mon revenu baissait."}, {id:"ac_date", l:"Date de mon prochain point", type:"txt", ph:"fin mars"} ] },
        p: "Mon choix est écrit." },
      { t: "Mes prochaines étapes", f: ["Vérifier les papiers du terrain ou du bien avant de verser le moindre franc.", "Simuler le crédit auprès de deux banques au moins, pour comparer taux, durée et frais.", "Écrire le budget de chantier étape par étape, marge comprise."], c: "Le projet avance par petites actions datées. Choisissez celles que vous lancez ce mois-ci.",
        w: { consignes: 1, puces: { id:"ac_etp", k:"Ce que je lance ce mois-ci", m:1, l:["Vérifier les papiers du terrain","Simuler auprès de deux banques","Écrire le budget de chantier","Ouvrir un compte pour l’apport"] } },
        p: "Mes prochaines étapes sont choisies." }
    ]}
  ],
  fin: {
    k: "Ma fiche logement", titre: "Votre projet de toit a un plan",
    fiche: [
      ["Mensualité supportable", function(D,H){ var R=window.ATELIER.calc(D,H); return R.rev?H.F(R.cap)+' par mois':''; }],
      ["Apport disponible", function(D,H){ var R=window.ATELIER.calc(D,H); return H.N(D.ac_epa)?H.F(R.dispo):''; }],
      ["Acheter tout fait", function(D,H){ var R=window.ATELIER.calc(D,H); return R.m1?H.F(R.m1)+' par mois sur '+R.dur+' ans':''; }],
      ["Construire par étapes", function(D,H){ var R=window.ATELIER.calc(D,H); return R.ep2?H.F(R.ep2)+' par mois sur '+R.mois2+' mois':''; }],
      ["Attendre et épargner", function(D,H){ var R=window.ATELIER.calc(D,H); return R.n3?R.n3+' mois pour '+H.F(R.vise)+' d’apport':''; }],
      ["Capacité après une baisse de revenu", function(D,H){ var R=window.ATELIER.calc(D,H); return R.rev?H.F(R.cap20)+' par mois (−'+R.b+' %)':''; }],
      ["Mon choix", function(D){ return [D.ac_choix||'', D.ac_pq||''].filter(function(x){return x;}).join(' : '); }],
      ["Prochaines étapes", function(D){ return (D.ac_etp||[]).join(', ')+(D.ac_date?(D.ac_etp&&D.ac_etp.length?' · ':'')+'point : '+D.ac_date:''); }]
    ],
    suite: { t: "Acheter un terrain : les papiers à vérifier", p: "Votre chemin est choisi ? Avant de verser le moindre franc, cette leçon vous montre les papiers à demander et à vérifier.", lien: "acheter-un-terrain.html", b: "Lire la leçon" }
  }
};
