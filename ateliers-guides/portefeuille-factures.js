/* Atelier guidé · Un portefeuille qui paie mes factures : la stratégie des dividendes */
window.ATELIER = {
  id: "portefeuille-factures",
  titre: "Un portefeuille qui paie mes factures : la stratégie des dividendes",
  h1: "Que vos actions finissent par payer une partie de vos factures.",
  voix: "auto",
  question: {
    t: "Vous voulez que la Bourse (BRVM) paie une partie de vos factures. Par quoi commencez-vous ?",
    r: [
      ["a", "Je cherche l’action qui verse le plus gros dividende.", "C’est le réflexe de beaucoup. Mais un dividende très élevé peut baisser, et une seule société, c’est fragile. On commence plutôt par vos factures.", false],
      ["b", "Je chiffre mes factures, puis le capital à construire.", "Exactement. Un montant clair, un capital, un versement, une durée : c’est le plan que vous allez écrire ici.", true]
    ]
  },
  chapitres: [
    { t: "Mes charges annuelles", acq: "Je connais les charges à couvrir", desc: "Les factures de l’année, leur total et la part que le portefeuille paiera.", e: [
      { t: "Ce que paie un dividende", c: "Une société qui fait des bénéfices peut en reverser une partie à ses actionnaires : c’est le dividende. Il tombe en général une fois par an.",
        w: { quiz: [
          ["Awa a des actions. Le dividende qu’elle reçoit, c’est…", ["Une part du bénéfice reversée par la société","Un intérêt garanti, comme un dépôt"], 0, "Le dividende dépend des bénéfices et de la décision de la société. Rien n’est garanti."],
          ["Pour que des dividendes paient des factures, il faut d’abord…", ["Un capital suffisant, construit avec le temps","Acheter une seule action et attendre"], 0, "Quelques actions versent quelques milliers de francs. Payer des factures demande un capital construit pas à pas."]
        ] },
        p: "Je sais ce qu’est un dividende et ce qu’il peut payer." },
      { t: "Mes factures de l’année", c: "On liste les charges qui reviennent chaque année. Comptez le total sur douze mois, pas par mois.",
        w: { ex: "Fatou paie par an 60 000 F d’eau, 120 000 F d’électricité, 150 000 F de rentrée et 90 000 F d’assurance : 420 000 F de charges annuelles.", k: "Vos charges sur une année (F)", c3: 1, champs: [ {id:"pf_eau", l:"Eau"}, {id:"pf_ele", l:"Électricité"}, {id:"pf_ren", l:"Rentrée scolaire"}, {id:"pf_ass", l:"Assurance"}, {id:"pf_tel", l:"Internet et téléphone"}, {id:"pf_aut", l:"Autres charges annuelles"} ],
          v: function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0); if(!t) return ''; return '<div class="gros"><small>Vos charges annuelles</small><b>'+H.F(t)+' par an</b><p>Soit environ '+H.F(t/12)+' par mois.</p></div>'; } },
        p: "Mes charges annuelles sont écrites." },
      { t: "La part que je vise", c: "Inutile de tout viser d’un coup. Une première part couverte, c’est déjà un vrai soulagement.",
        w: { puces: { id:"pf_part", k:"Quelle part de ces charges voulez-vous faire payer par vos dividendes ?", l:["Un quart","La moitié","Les trois quarts","Toutes"] },
          v: function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0), q={"Un quart":.25,"La moitié":.5,"Les trois quarts":.75,"Toutes":1}[D.pf_part]; if(!t||!q) return ''; return '<div class="gros"><small>Montant visé par an</small><b>'+H.F(t*q)+'</b><p>C’est ce que vos dividendes, après impôt, devront vous verser chaque année.</p></div>'; } },
        p: "Je connais le montant de charges que je vise." }
    ]},
    { t: "Le capital nécessaire", acq: "Je connais le capital à construire", desc: "Le rendement en dividendes, l’impôt, et le capital qui en découle.", e: [
      { t: "Le rendement en dividendes", c: "Le rendement, c’est le dividende de l’année divisé par le prix de l’action. Un rendement très élevé attire, mais il pose des questions.",
        w: { quiz: [
          ["Une action vaut 10 000 F et verse 700 F de dividende dans l’année. Son rendement est de…", ["7 %","70 %"], 0, "700 ÷ 10 000 = 0,07, soit 7 %. Ce chiffre change avec le prix de l’action et avec le dividende."],
          ["Une action affiche un rendement de 15 %, bien au-dessus des autres. Vous pensez…", ["C’est forcément la meilleure affaire","Il faut comprendre pourquoi : le dividende peut baisser"], 1, "Un rendement anormalement haut vient parfois d’un prix qui a chuté, ou d’un dividende qui ne durera pas."]
        ] },
        p: "Je sais calculer un rendement en dividendes." },
      { t: "Mon capital cible", c: "Capital nécessaire = charges visées ÷ rendement net d’impôt. Les taux sont les vôtres : saisissez des exemples prudents.",
        w: { ex: "300 000 F de charges à 7 % de rendement : 300 000 ÷ 0,07 = environ 4,3 millions de F. Si un impôt est retenu sur le dividende, il faut un peu plus.", champs: [ {id:"pf_rdt", l:"Rendement en dividendes (%, exemple)", ph:"7"}, {id:"pf_imp", l:"Impôt retenu à la source (%, exemple)", ph:"10"} ],
          v: function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0), q={"Un quart":.25,"La moitié":.5,"Les trois quarts":.75,"Toutes":1}[D.pf_part]||1, vise=t*q, r=H.N(D.pf_rdt), i=Math.min(Math.max(H.N(D.pf_imp),0),99), net=r*(1-i/100)/100; if(!r) return ''; if(!vise) return '<div class="verdict v-mid">Rendement net d’impôt : '+(Math.round(net*1000)/10).toLocaleString('fr-FR')+' %. Remplissez vos charges au chapitre 1 pour voir votre capital.</div>'; return '<div class="gros"><small>Capital nécessaire</small><b>'+H.F(vise/net)+'</b><p>Pour recevoir '+H.F(vise)+' par an après impôt, avec un rendement net de '+(Math.round(net*1000)/10).toLocaleString('fr-FR')+' %. C’est un ordre de grandeur, pas une promesse.</p></div>'; } },
        p: "Mon capital cible est écrit." }
    ]},
    { t: "Construire pas à pas", acq: "Je sais en combien d’années j’y arrive", desc: "Un versement chaque mois, les dividendes réinvestis, une durée calculée.", e: [
      { t: "Mon versement et ma durée", c: "Chaque année, le capital grandit de son rendement, plus vos douze versements. On calcule combien d’années il faut.",
        w: { ex: "Koffi vise 4,3 millions de F. Il part de zéro, verse 30 000 F par mois et compte sur 7 % par an : il y arrive en 9 ans environ.", champs: [ {id:"pf_dej", l:"Déjà investi en actions (F)"}, {id:"pf_vers", l:"Versement mensuel (F)"}, {id:"pf_cro", l:"Croissance annuelle, dividendes réinvestis (%, exemple)", ph:"7"} ],
          v: function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0), q={"Un quart":.25,"La moitié":.5,"Les trois quarts":.75,"Toutes":1}[D.pf_part]||1, r0=H.N(D.pf_rdt), i=Math.min(Math.max(H.N(D.pf_imp),0),99), net=r0*(1-i/100)/100; if(!t||!net) return '<div class="verdict v-mid">Remplissez d’abord vos charges et votre rendement : le capital cible sert de ligne d’arrivée.</div>'; var cap=t*q/net, v=H.N(D.pf_vers), c=H.N(D.pf_dej), r=(H.N(D.pf_cro)||r0)/100, n=0; if(c>=cap) return '<div class="verdict v-ok">Votre capital actuel atteint déjà la cible. Il reste à vérifier la répartition et le calendrier.</div>'; if(!v) return ''; while(c<cap&&n<40){ c=c*(1+r)+12*v; n++; } if(c<cap) return '<div class="verdict v-ko">Plus de 40 ans à ce rythme. Augmentez le versement, ou visez d’abord une part plus petite de vos charges.</div>'; return '<div class="gros"><small>Capital cible de '+H.F(cap)+'</small><b>atteint en '+n+' an'+(n>1?'s':'')+' environ</b><p>Avec '+H.F(v)+' par mois et '+(Math.round(r*1000)/10).toLocaleString('fr-FR')+' % par an, en exemple. Le réel sera différent : on refait le calcul chaque année.</p></div>'; } },
        p: "Mon versement mensuel et ma durée sont fixés." },
      { t: "Réinvestir au début", c: "Au début, les dividendes sont petits. Les réinvestir, c’est acheter de nouvelles actions qui verseront à leur tour.",
        w: { puces: { id:"pf_reinv", k:"Pendant la phase de construction, vos dividendes…", l:["Je les réinvestis tous","J’en réinvestis une partie","Je les dépense déjà"] },
          v: function(D){ var R={"Je les réinvestis tous":["v-ok","C’est le moteur du calcul précédent : chaque dividende réinvesti travaille à son tour."],"J’en réinvestis une partie":["v-mid","Possible. Votre durée sera un peu plus longue que celle calculée : décidez la part à l’avance."],"Je les dépense déjà":["v-ko","Le capital grandira seulement de vos versements. La durée s’allonge nettement : gardez cette option pour plus tard."]}[D.pf_reinv]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai décidé quoi faire de mes dividendes au début." },
      { t: "Tenir le versement", f: ["Je programme mon versement le jour de la paie, avant les autres dépenses.", "Je l’envoie sur mon compte titres auprès de ma SGI, puis j’achète à intervalles réguliers.", "Quand mon revenu monte ou qu’une prime arrive (13e mois, tour de tontine), j’augmente le versement."], c: "Ce qui est versé chaque mois, sans y penser, construit le capital. Ce qui attend la fin du mois ne part jamais.",
        p: "Mon versement régulier est prévu." }
    ]},
    { t: "Le calendrier", acq: "Je mets mes dividendes face à mes dépenses", desc: "Quand tombent les factures, quand tombent les dividendes, et la poche tampon.", e: [
      { t: "Mes mois de dépenses", c: "À la Bourse (BRVM), beaucoup de dividendes sont versés au deuxième et au troisième trimestre, après les assemblées générales. Vos factures, elles, tombent quand elles veulent.",
        w: { puces: { id:"pf_mois", k:"Les mois où tombent vos grosses charges", m:1, l:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"] },
          v: function(D){ var L=D.pf_mois||[], F=["Avril","Mai","Juin","Juillet","Août","Septembre"], o=L.filter(function(m){return F.indexOf(m)<0;}); if(!L.length) return ''; if(!o.length) return '<div class="verdict v-ok">Vos grosses charges tombent d’avril à septembre, la période où beaucoup de dividendes arrivent. Le calendrier vous est favorable.</div>'; return '<div class="verdict v-mid">'+o.length+' de vos '+L.length+' mois de dépenses tombent hors d’avril à septembre ('+o.join(', ')+'). Pour ceux-là, il faudra garder de côté une partie des dividendes reçus avant.</div>'; } },
        p: "J’ai mis mes mois de dépenses face aux mois de dividendes." },
      { t: "Ma poche tampon", c: "Les dividendes de l’été paient aussi les factures de janvier. Il suffit de les mettre de côté dès qu’ils arrivent, sur un compte à part.",
        w: { ex: "Fatou reçoit ses dividendes en juin et juillet. Sa rentrée tombe en octobre et son assurance en janvier : elle met de côté environ 240 000 F dès l’été.", champs: [ {id:"pf_tamp", l:"Où je garde ma poche tampon", type:"txt", ph:"Compte d’épargne séparé"} ],
          v: function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0), q={"Un quart":.25,"La moitié":.5,"Les trois quarts":.75,"Toutes":1}[D.pf_part]||1, L=D.pf_mois||[], F=["Avril","Mai","Juin","Juillet","Août","Septembre"], o=L.filter(function(m){return F.indexOf(m)<0;}).length; if(!t||!L.length) return ''; if(!o) return '<div class="verdict v-ok">Pas de poche tampon indispensable : vos charges tombent pendant la période des dividendes. Gardez quand même une petite marge.</div>'; return '<div class="gros"><small>Poche tampon, ordre de grandeur</small><b>'+H.F(t*q*o/L.length)+'</b><p>La part de vos dividendes à garder de côté pour les factures qui tombent hors d’avril à septembre.</p></div>'; } },
        p: "Ma poche tampon est prévue." }
    ]},
    { t: "Rester prudent", acq: "J’ai écrit mes règles de prudence", desc: "Aucun dividende n’est garanti : on répartit, on vérifie, on écrit ses règles.", e: [
      { t: "Ce qui peut arriver", c: "Un dividende n’est jamais garanti. Une mauvaise année, la société peut le réduire ou ne rien verser.",
        w: { quiz: [
          ["Une société a versé un dividende l’an dernier. Cette année…", ["Elle le versera forcément","Il peut baisser ou disparaître"], 1, "Le dividende dépend des bénéfices et de l’assemblée générale. Le passé ne garantit rien."],
          ["Avant de construire ce portefeuille, il faut…", ["Avoir sa réserve de sécurité","Investir d’abord, la réserve viendra après"], 0, "La réserve d’abord : sinon, la première urgence vous force à vendre au mauvais moment."],
          ["Pour des dividendes plus réguliers, mieux vaut…", ["Tout mettre sur le rendement le plus élevé","Répartir sur plusieurs sociétés et secteurs"], 1, "Si une société coupe son dividende, les autres continuent de verser."]
        ] },
        p: "Je sais qu’un dividende peut baisser." },
      { t: "Répartir et compter les frais", c: "Plusieurs sociétés, plusieurs secteurs, et pas trop sur une seule. Les frais de la SGI comptent aussi : demandez-les par écrit.",
        w: { ex: "Moussa répartit son portefeuille sur 8 sociétés de 4 secteurs différents, sans dépasser 20 % sur une seule.", c3: 1, champs: [ {id:"pf_nsoc", l:"Nombre de sociétés visé"}, {id:"pf_nsec", l:"Nombre de secteurs visé"}, {id:"pf_max", l:"Part maximale sur une société (%)", ph:"20"}, {id:"pf_frais", l:"Frais de la SGI par achat (%, exemple)", ph:"1"} ],
          v: function(D,H){ var s=H.N(D.pf_nsoc), e=H.N(D.pf_nsec), m=H.N(D.pf_max), f=H.N(D.pf_frais), v=H.N(D.pf_vers), h=''; if(s||e||m){ var ok=s>=5&&e>=3&&(!m||m<=25); h+='<div class="verdict '+(ok?'v-ok':'v-mid')+'">'+(ok?'Une répartition solide : si une société réduit son dividende, les autres continuent.':'Repère EFA : au moins 5 sociétés, 3 secteurs, et pas plus d’un quart sur une seule. Ajustez si vous le pouvez.')+'</div>'; } if(f&&v) h+='<div class="gros"><small>Frais sur vos versements, exemple</small><b>'+H.F(12*v*f/100)+' par an</b><p>Sur '+H.F(12*v)+' versés dans l’année. Regrouper ses achats limite les frais fixes.</p></div>'; return h; } },
        p: "Ma règle de répartition est fixée." },
      { t: "Mes règles écrites", c: "Des règles écrites au calme vous protègent les jours où le marché fait peur. Une revue par an suffit.",
        w: { puces: { id:"pf_revue", k:"Le mois de ma revue annuelle", l:["Janvier","Avril","Juillet","Octobre"] }, champs: [ {id:"pf_regles", l:"Mes règles de prudence", type:"area", ph:"Réserve d’abord. Au moins 5 sociétés. Pas plus d’un quart sur une seule. Je réinvestis tant que la cible n’est pas atteinte. Je ne vends pas sur un coup de peur."} ] },
        p: "Mes règles de prudence sont écrites." }
    ]}
  ],
  fin: {
    k: "Ma fiche portefeuille dividendes", titre: "Vos factures ont un plan",
    fiche: [
      ["Charges annuelles", function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0); return t?H.F(t)+' par an':''; }],
      ["Montant visé", function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0), q={"Un quart":.25,"La moitié":.5,"Les trois quarts":.75,"Toutes":1}[D.pf_part]; return t&&q?H.F(t*q)+' par an ('+D.pf_part.toLowerCase()+' des charges)':''; }],
      ["Capital nécessaire", function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0), q={"Un quart":.25,"La moitié":.5,"Les trois quarts":.75,"Toutes":1}[D.pf_part]||1, r=H.N(D.pf_rdt), i=Math.min(Math.max(H.N(D.pf_imp),0),99), net=r*(1-i/100)/100; return t&&net?H.F(t*q/net)+' (rendement exemple '+r+' %, impôt '+i+' %)':''; }],
      ["Versement mensuel", function(D,H){ return H.N(D.pf_vers)?H.F(H.N(D.pf_vers))+' par mois':''; }],
      ["Durée estimée", function(D,H){ var t=["pf_eau","pf_ele","pf_ren","pf_ass","pf_tel","pf_aut"].reduce(function(s,k){return s+H.N(D[k]);},0), q={"Un quart":.25,"La moitié":.5,"Les trois quarts":.75,"Toutes":1}[D.pf_part]||1, r0=H.N(D.pf_rdt), i=Math.min(Math.max(H.N(D.pf_imp),0),99), net=r0*(1-i/100)/100, v=H.N(D.pf_vers), c=H.N(D.pf_dej), r=(H.N(D.pf_cro)||r0)/100, n=0; if(!t||!net) return ''; var cap=t*q/net; if(c>=cap) return 'Cible déjà atteinte'; if(!v) return ''; while(c<cap&&n<40){ c=c*(1+r)+12*v; n++; } return c<cap?'Plus de 40 ans à ce rythme':'Environ '+n+' an'+(n>1?'s':''); }],
      ["Mois de dépenses", function(D){ return (D.pf_mois||[]).join(', '); }],
      ["Poche tampon", function(D){ return D.pf_tamp||''; }],
      ["Mes règles", function(D){ return (D.pf_regles||'')+(D.pf_revue?(D.pf_regles?' · ':'')+'Revue chaque année en '+D.pf_revue.toLowerCase():''); }]
    ],
    suite: { t: "Lire une société cotée", p: "Votre plan est écrit. L’atelier suivant vous apprend à lire les comptes d’une société et l’histoire de son dividende, avant tout achat.", lien: "atelier-lire-societe-cotee.html", b: "Ouvrir l’atelier" }
  }
};
