/* Atelier guidé · Investir dans une activité : est-ce que ça rapporte ? */
function iaCalc(D,H){
  var N=H.N, cap=["ia_equ","ia_ame","ia_pap","ia_stk","ia_fdr"].reduce(function(s,k){return s+N(D[k]);},0),
      pv=N(D.ia_pv), q=N(D.ia_qte), cu=N(D.ia_cu), pu=pv-cu, mb=pu*q,
      cf=["ia_loy","ia_emp","ia_tra","ia_ele","ia_tax","ia_ent"].reduce(function(s,k){return s+N(D[k]);},0),
      sal=N(D.ia_sal), mat=N(D.ia_mat), vie=N(D.ia_vie), am=(mat&&vie)?mat/vie:0,
      mm=mb-cf, net=mm-sal-am, fixes=cf+sal+am,
      seuil=(pu>0&&fixes>0)?Math.ceil(fixes/pu):0,
      delai=(cap>0&&net>0)?Math.ceil(cap/net):0,
      net30=Math.round(pu*q*0.7)-fixes;
  return {cap:cap,pv:pv,q:q,cu:cu,pu:pu,ca:pv*q,mb:mb,cf:cf,sal:sal,am:am,mm:mm,net:net,fixes:fixes,seuil:seuil,delai:delai,net30:net30,u:(D.ia_u||'').trim()||'unités'};
}
window.ATELIER = {
  id: "investir-activite",
  titre: "Investir dans une activité : est-ce que ça rapporte ?",
  h1: "Ce qu’une activité vend n’est pas ce qu’elle rapporte.",
  voix: "auto",
  question: {
    t: "Votre activité vend pour 300 000 F par mois. Est-ce qu’elle rapporte ?",
    r: [
      ["a", "Oui, 300 000 F par mois, c’est bien.", "C’est le réflexe de beaucoup d’entre nous. Mais 300 000 F de ventes peuvent cacher une perte, une fois le stock, le loyer et l’usure payés. On va faire le calcul complet.", false],
      ["b", "Je ne sais pas encore : il faut retirer tous les coûts.", "Exactement. Ce qui compte, c’est ce qui reste. C’est ce que vous allez calculer, ligne par ligne.", true]
    ]
  },
  chapitres: [
    { t: "Le capital complet", acq: "Je connais mon capital de départ", desc: "Tout ce qu’il faut payer avant la première vente, et de quoi tenir trois mois.", e: [
      { t: "Ce qu’on oublie", c: "On pense à la moto ou au congélateur. On oublie souvent les papiers, le stock et les mois lents du début.",
        w: { quiz: [
          ["Le stock de départ de la boutique", ["Fait partie du capital","Se paie avec les ventes"], 0, "Sans stock, rien à vendre le premier jour : il faut l’avoir avant d’ouvrir."],
          ["Trois mois de charges, le temps que les clients arrivent", ["On verra plus tard","Fait partie du capital"], 1, "Les premiers mois sont lents. Ce fonds de roulement évite de fermer trop tôt."],
          ["Les papiers : registre, autorisations, assurance", ["Fait partie du capital","C’est facultatif"], 0, "Ils coûtent, et ils se paient avant de démarrer."]
        ] },
        p: "Je sais ce que contient un capital complet." },
      { t: "Mon activité", c: "Une boutique, une moto-taxi ou des poulets ne se calculent pas pareil. Dites-moi d’abord de quoi on parle.",
        w: { puces: [
          { id:"ia_typ", k:"L’activité", l:["Boutique","Taxi ou moto-taxi","Élevage","Champ","Couture","Restauration","Location de matériel","Autre"] },
          { id:"ia_sit", k:"Votre situation", l:["Je veux me lancer","J’ai déjà l’activité"] }
        ] },
        p: "J’ai choisi l’activité que je vais calculer." },
      { t: "Mon capital de départ", c: "Mettez tout, même les petites sommes. Si l’activité existe déjà, écrivez ce qu’elle vous a coûté au départ.",
        w: { ex: "La boutique d’Awa (chiffres à vérifier sur le terrain) : étagères et congélateur 400 000 F, aménagement 250 000 F, papiers 60 000 F, stock 600 000 F, trois mois de charges 300 000 F. Capital complet : 1 610 000 F.", k: "Votre capital, en F", c3: 1,
          champs: [ {id:"ia_equ", l:"Équipement"}, {id:"ia_ame", l:"Aménagement"}, {id:"ia_pap", l:"Papiers et autorisations"}, {id:"ia_stk", l:"Stock de départ"}, {id:"ia_fdr", l:"Fonds pour tenir 3 mois"} ],
          v: function(D,H){ var R=iaCalc(D,H); if(!R.cap) return ''; return '<div class="gros"><small>Votre capital de départ complet</small><b>'+H.F(R.cap)+'</b><p>'+(H.N(D.ia_fdr)?'C’est votre mise. On va voir en combien de mois elle revient.':'Ajoutez le fonds pour tenir trois mois : c’est lui qui évite de fermer trop tôt.')+'</p></div>'; } },
        p: "Mon capital de départ complet est écrit." }
    ]},
    { t: "Recettes et charges", acq: "Je connais ma marge par mois", desc: "Ce qui rentre, ce qui sort, et ce qui reste chaque mois.", e: [
      { t: "Ce que je vends", c: "Choisissez une unité simple : un poulet, un plat, une journée de versement. Puis son prix, son coût et combien vous en vendez par mois.",
        w: { ex: "Fatou élève des poulets de chair (exemple à vérifier sur le terrain). Elle vend un poulet 3 500 F, il lui coûte 2 500 F (poussin, aliment, vaccins), et elle en vend 200 par mois : 1 000 F gagnés par poulet, 200 000 F par mois avant les charges.",
          champs: [ {id:"ia_u", l:"Mon unité, au pluriel", type:"txt", ph:"poulets, plats, jours…"}, {id:"ia_pv", l:"Prix de vente d’une unité (F)"}, {id:"ia_cu", l:"Coût d’achat d’une unité (F)"}, {id:"ia_qte", l:"Unités vendues par mois"} ],
          v: function(D,H){ var R=iaCalc(D,H); if(!R.pv||!R.q) return ''; if(R.pu<=0) return '<div class="verdict v-ko">Chaque vente vous coûte plus qu’elle ne rapporte. Revoyez le prix ou le coût d’achat avant d’aller plus loin.</div>'; return '<div class="gros"><small>Ce qui reste après les achats</small><b>'+H.F(R.mb)+' par mois</b><p>Ventes : '+H.F(R.ca)+'. Vous gardez '+H.F(R.pu)+' par unité vendue.</p></div>'; } },
        p: "Mon prix, mon coût et mes quantités sont écrits." },
      { t: "Mes charges du mois", c: "Ces charges tombent chaque mois, que vous vendiez beaucoup ou peu. Oubliez-en une et la marge paraît plus belle qu’elle n’est.",
        w: { ex: "Pour Fatou : aide au poulailler 40 000 F, transport 15 000 F, eau et électricité 10 000 F. Charges : 65 000 F. Il reste 200 000 − 65 000 = 135 000 F par mois.", k: "Vos charges fixes du mois, en F", c3: 1,
          champs: [ {id:"ia_loy", l:"Loyer"}, {id:"ia_emp", l:"Salaire d’un employé"}, {id:"ia_tra", l:"Transport"}, {id:"ia_ele", l:"Électricité et eau"}, {id:"ia_tax", l:"Taxes et assurance"}, {id:"ia_ent", l:"Entretien"} ],
          v: function(D,H){ var R=iaCalc(D,H); if(!R.cf) return ''; if(!R.mb) return '<div class="gros"><small>Vos charges fixes</small><b>'+H.F(R.cf)+' par mois</b><p>Remplissez l’écran précédent pour voir votre marge.</p></div>'; return '<div class="gros"><small>Votre marge mensuelle</small><b>'+H.F(R.mm)+'</b><p>'+H.F(R.mb)+' après achats, moins '+H.F(R.cf)+' de charges.'+(R.mm<=0?' Les charges mangent tout : il faut agir avant d’investir plus.':'')+'</p></div>'; } },
        p: "Ma marge mensuelle est calculée." }
    ]},
    { t: "Mon salaire et l’usure", acq: "Je connais ma marge réelle", desc: "Se payer, et mettre de côté pour remplacer le matériel.", e: [
      { t: "Me verser un salaire", c: "Si vous travaillez dans l’activité, votre temps a un prix. Sinon, vous croyez gagner alors que vous travaillez gratuitement.",
        w: { ex: "Fatou se verse 60 000 F par mois. Sa marge passe de 135 000 F à 75 000 F. Koffi, qui confie sa moto à un conducteur, ne se verse rien : il ne travaille pas dedans.",
          champs: [ {id:"ia_sal", l:"Ce que je me verse chaque mois (F)"} ],
          v: function(D,H){ var R=iaCalc(D,H); if(!R.mb) return ''; var x=R.mm-R.sal; return '<div class="gros"><small>Marge après votre salaire</small><b>'+H.F(x)+' par mois</b><p>'+(R.sal?'Votre travail est payé. Ce qui reste, c’est ce que l’activité rapporte vraiment.':'Si vous travaillez dans l’activité, écrivez un salaire, même modeste.')+'</p></div>'; } },
        p: "Mon salaire est fixé." },
      { t: "Le matériel s’use", c: "Une moto, un congélateur, une machine à coudre s’usent. Chaque mois, mettez de côté de quoi les remplacer : c’est l’amortissement.",
        w: { ex: "Le poulailler et les mangeoires de Fatou valent 600 000 F et durent environ 60 mois. Elle met de côté 600 000 ÷ 60 = 10 000 F par mois. Sa marge réelle : 65 000 F.",
          champs: [ {id:"ia_mat", l:"Valeur du matériel à remplacer un jour (F)"}, {id:"ia_vie", l:"Durée de vie en mois", ph:"36"} ],
          v: function(D,H){ var R=iaCalc(D,H); if(!R.mb) return ''; return '<div class="gros"><small>Votre marge réelle, après salaire et usure</small><b>'+H.F(R.net)+' par mois</b><p>'+(R.am?'Dont '+H.F(R.am)+' à mettre de côté chaque mois pour le matériel. ':'')+(R.net<=0?'En l’état, l’activité ne paie pas tout ce qu’elle coûte.':'C’est ce chiffre qui compte pour décider.')+'</p></div>'; } },
        p: "Ma marge réelle est calculée." }
    ]},
    { t: "Seuil et délai", acq: "Je sais quand elle devient rentable", desc: "Combien vendre pour ne rien perdre, et quand la mise revient.", e: [
      { t: "Mon seuil de rentabilité", c: "Le seuil, c’est ce qu’il faut vendre chaque mois pour payer les charges, votre salaire et l’usure. En dessous, l’activité perd de l’argent.",
        w: { ex: "Fatou doit couvrir 65 000 + 60 000 + 10 000 = 135 000 F par mois. Elle gagne 1 000 F par poulet : son seuil est de 135 poulets par mois. Elle en vend 200.",
          quiz: [ ["Fatou vend 120 poulets ce mois-ci", ["Elle perd de l’argent","Elle gagne moins, c’est tout"], 0, "Sous le seuil, les ventes ne couvrent plus tout ce qu’elle doit payer."] ],
          v: function(D,H){ var R=iaCalc(D,H); if(!R.seuil) return ''; var ok=R.q>=R.seuil; return '<div class="gros"><small>Votre seuil de rentabilité</small><b>'+R.seuil.toLocaleString('fr-FR')+' '+H.esc(R.u)+' par mois</b><p>'+(R.q?(ok?'Vous en vendez '+R.q.toLocaleString('fr-FR')+' : vous êtes au-dessus.':'Vous en vendez '+R.q.toLocaleString('fr-FR')+' : vous êtes en dessous.'):'')+'</p></div>'; } },
        p: "Je connais mon seuil de rentabilité." },
      { t: "Récupérer ma mise", c: "Divisez le capital par la marge réelle : vous savez en combien de mois votre argent revient. Après, l’activité travaille pour vous.",
        w: { ex: "Koffi a mis 850 000 F dans une moto-taxi (moto, papiers, casques, réserve pour les réparations). Le conducteur lui verse 5 000 F par jour, 26 jours par mois. Après entretien, assurance et usure, il garde environ 77 000 F par mois : sa mise revient en 12 mois environ. Chiffres à vérifier sur le terrain.",
          puces: { id:"ia_dmax", k:"Le délai que vous acceptez", l:["12 mois","24 mois","36 mois"] },
          v: function(D,H){ var R=iaCalc(D,H); if(!R.cap||!R.mb) return ''; if(!R.delai) return '<div class="verdict v-ko">Avec une marge réelle nulle ou négative, la mise ne revient jamais. Il faut d’abord changer un chiffre : prix, quantité ou charges.</div>'; var m=H.N(D.ia_dmax), ok=!m||R.delai<=m; return '<div class="gros"><small>Votre mise revient en</small><b>'+R.delai+' mois environ</b><p>'+H.F(R.cap)+' ÷ '+H.F(R.net)+' par mois.'+(m?(ok?' C’est dans le délai que vous acceptez.':' C’est plus long que les '+m+' mois que vous acceptez.'):'')+'</p></div>'; } },
        p: "Je connais le délai pour récupérer ma mise." },
      { t: "Et si les ventes baissent de 30 % ?", c: "Une mauvaise saison, un concurrent, une panne : les ventes baissent un jour. Une activité solide tient encore debout.",
        w: { ex: "Si Fatou ne vend plus que 140 poulets, il lui reste 140 000 F pour couvrir 135 000 F : elle tient, mais de justesse.",
          puces: { id:"ia_plan", k:"Ce que vous feriez", m:1, l:["Baisser une charge","Acheter moins de stock","Revoir mon prix","Puiser dans le fonds de 3 mois","Trouver d’autres clients"] },
          v: function(D,H){ var R=iaCalc(D,H); if(!R.mb) return ''; var c=R.net30>0?'v-ok':R.net30>-R.fixes*0.2?'v-mid':'v-ko'; return '<div class="verdict '+c+'">Avec 30 % de ventes en moins, votre marge réelle serait de '+H.F(R.net30)+' par mois. '+(R.net30>0?'L’activité tient le choc.':R.net30>-R.fixes*0.2?'Elle passe juste sous l’eau : votre plan ci-dessous doit être prêt.':'Elle perd beaucoup : prévoyez une réserve et un plan avant d’investir.')+'</div>'; } },
        p: "Je sais ce que je ferais si les ventes baissaient." }
    ]},
    { t: "Décider et piloter", acq: "Je décide et je pilote", desc: "Un verdict, deux caisses séparées, des comptes chaque mois.", e: [
      { t: "Le verdict", c: "On rassemble tout : marge réelle, délai, résistance à la baisse. Le verdict ne décide pas à votre place, il vous montre où vous en êtes.",
        w: { v: function(D,H){ var R=iaCalc(D,H); if(!R.cap||!R.mb) return '<div class="verdict v-mid">Remplissez le capital (chapitre 1) et les ventes (chapitre 2) pour voir votre verdict.</div>';
            var c,t; if(R.net<=0){ c='v-ko'; t='En l’état, l’activité ne paie pas ce qu’elle coûte. Changez un chiffre avant d’y mettre de l’argent.'; }
            else if(R.net30<=0||R.delai>36){ c='v-mid'; t='Elle rapporte, mais elle est fragile : '+(R.net30<=0?'une baisse des ventes la met en perte':'la mise revient lentement')+'. À ajuster avant de vous engager plus.'; }
            else { c='v-ok'; t='Elle rapporte, résiste à une baisse de 30 % et rend votre mise en '+R.delai+' mois environ.'; }
            return '<div class="gros"><small>Votre marge réelle</small><b>'+H.F(R.net)+' par mois</b><p>Capital : '+H.F(R.cap)+(R.delai?' · mise récupérée en '+R.delai+' mois environ':'')+(R.seuil?' · seuil : '+R.seuil.toLocaleString('fr-FR')+' '+H.esc(R.u):'')+'</p></div><div class="verdict '+c+'">'+t+'</div>'; } },
        p: "J’ai lu le verdict de mon activité." },
      { t: "Deux caisses, un cahier", f: ["Un compte ou un porte-monnaie mobile money réservé à l’activité.", "Je me verse mon salaire à date fixe, et rien de plus.", "J’écris chaque jour les recettes et les dépenses dans un cahier."], c: "Quand la caisse de l’activité paie aussi la maison, on ne sait plus si l’activité rapporte. Séparer, c’est voir clair.",
        w: { consignes: 1, quiz: [
          ["Je prends 20 000 F dans la caisse pour le marché de la maison", ["C’est l’argent de l’activité","C’est mon argent"], 0, "Tant qu’il n’est pas versé comme salaire, il appartient à l’activité."],
          ["Mon salaire du mois, versé sur mon compte personnel", ["C’est l’argent de l’activité","C’est mon argent"], 1, "Oui : une fois versé, il est à vous, pour la maison."]
        ] },
        p: "Ma caisse d’activité est séparée de l’argent de la maison." },
      { t: "Confier et décider", f: ["Un contrat écrit : ce qu’on me verse, quand, et qui paie l’entretien.", "Des comptes chaque mois, avec les reçus.", "Ce qui se passe en cas de panne, d’accident ou de vol.", "Une visite régulière, même quand tout va bien."], c: "Confier sa moto ou sa boutique à quelqu’un, c’est possible. Avec un contrat écrit et des comptes chaque mois, la confiance tient plus longtemps.",
        w: { consignes: 1,
          puces: { id:"ia_dec", k:"Votre décision", l:["J’y vais","J’ajuste d’abord","Je renonce pour l’instant"] },
          champs: [ {id:"ia_dtxt", l:"Ma décision écrite", type:"area", ph:"Je lance la boutique en mars si je réunis 1 610 000 F. Je me verse 60 000 F par mois. Je fais les comptes le 1er de chaque mois."} ] },
        p: "Ma décision est écrite." }
    ]}
  ],
  fin: {
    k: "Ma fiche investissement", titre: "Votre décision repose sur des chiffres",
    fiche: [
      ["Activité", function(D){ return [D.ia_typ||'', D.ia_sit||''].filter(Boolean).join(' · '); }],
      ["Capital de départ complet", function(D,H){ var R=iaCalc(D,H); return R.cap?H.F(R.cap):''; }],
      ["Marge mensuelle (avant salaire)", function(D,H){ var R=iaCalc(D,H); return R.mb?H.F(R.mm)+' par mois':''; }],
      ["Marge réelle (après salaire et usure)", function(D,H){ var R=iaCalc(D,H); return R.mb?H.F(R.net)+' par mois':''; }],
      ["Seuil de rentabilité", function(D,H){ var R=iaCalc(D,H); return R.seuil?R.seuil.toLocaleString('fr-FR')+' '+R.u+' par mois':''; }],
      ["Délai pour récupérer la mise", function(D,H){ var R=iaCalc(D,H); return R.delai?R.delai+' mois environ':''; }],
      ["Si les ventes baissent de 30 %", function(D,H){ var R=iaCalc(D,H); return R.mb?H.F(R.net30)+' par mois':''; }],
      ["Ma décision", function(D){ return [D.ia_dec||'', (D.ia_dtxt||'').trim()].filter(Boolean).join(' : '); }]
    ],
    suite: { t: "De la tontine au club d’investissement", p: "Votre activité est calculée ? La leçon suivante montre comment investir à plusieurs, avec des règles écrites, comme une tontine qui grandit.", lien: "club-investissement.html", b: "Lire la leçon" }
  }
};
