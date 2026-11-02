/* Atelier guidé · Lire une société cotée comme un investisseur */
function lsSignaux(D,H){
  var L=[], ca1=H.N(D.ls_ca1), ca2=H.N(D.ls_ca2), ca3=H.N(D.ls_ca3), rn1=H.N(D.ls_rn1), rn2=H.N(D.ls_rn2), rn3=H.N(D.ls_rn3),
      df=H.N(D.ls_df), df0=H.N(D.ls_df0), fp=H.N(D.ls_fp), nba=H.N(D.ls_nba), div=H.N(D.ls_div);
  var bpa=(rn3&&nba)?rn3*1000000/nba:0;
  if(div&&bpa&&div>bpa) L.push("Dividende supérieur au bénéfice par action");
  if(div&&rn3<0) L.push("Dividende versé malgré une perte");
  if(df&&df0&&df>df0) L.push("Dettes financières en hausse");
  if(df&&fp>0&&df/fp>1) L.push("Dettes supérieures aux fonds propres");
  if(fp<0&&D.ls_fp!=null&&String(D.ls_fp).trim()!=='') L.push("Fonds propres négatifs");
  if(rn1&&rn2&&rn3&&rn3<rn2&&rn2<rn1) L.push("Résultat net en baisse deux ans de suite");
  if(ca1&&ca3&&ca3<ca1) L.push("Chiffre d’affaires en baisse sur 3 ans");
  (D.ls_al||[]).forEach(function(x){ if(L.indexOf(x)<0) L.push(x); });
  return L;
}
window.ATELIER = {
  id: "lire-societe-cotee",
  titre: "Lire une société cotée comme un investisseur",
  h1: "Avant de regarder le cours, lisez les chiffres.",
  voix: "auto",
  question: {
    t: "Une société cotée annonce un gros dividende cette année. Que regardez-vous d’abord ?",
    r: [
      ["a", "Le montant : plus il est gros, mieux c’est.", "C’est le premier réflexe de beaucoup d’entre nous. Mais un dividende peut être payé avec de l’argent que la société n’a pas gagné. Cet atelier vous apprend à le vérifier.", false],
      ["b", "Si son bénéfice couvre ce dividende.", "Exactement. Un dividende solide vient d’un bénéfice solide. Vous allez apprendre à le vérifier vous-même, chiffres en main.", true]
    ]
  },
  chapitres: [
    { t: "Le métier", acq: "Je sais ce que vend la société", desc: "Ce qu’elle vend, à qui, et d’où vient son argent.", e: [
      { t: "Que vend-elle, et à qui ?", c: "Avant les chiffres, une question simple : comment cette société gagne-t-elle son argent ? Si vous ne savez pas l’expliquer en une phrase, commencez par là.",
        w: { ex: "La Société Ivoirienne de Distribution (société fictive) vend des produits alimentaires et ménagers dans ses supermarchés, à des familles d’Abidjan et de l’intérieur. Son argent vient des ventes en magasin, chaque jour.", k: "La société que vous choisissez d’étudier", champs: [ {id:"ls_soc", l:"Nom de la société", type:"txt", ph:"Société Ivoirienne de Distribution", large:1}, {id:"ls_vend", l:"Ce qu’elle vend", type:"txt", ph:"Produits alimentaires et ménagers"}, {id:"ls_cli", l:"À qui elle vend", type:"txt", ph:"Familles, commerçants"} ] },
        p: "J’ai écrit en une phrase ce que vend ma société." },
      { t: "Son secteur", c: "Chaque secteur a ses pièges. Une banque ne se lit pas comme un supermarché, ni une plantation comme un opérateur téléphonique.",
        w: { puces: { id:"ls_sect", k:"Le secteur de votre société", l:["Banque et finance","Télécoms","Distribution","Agro-industrie","Énergie, eau, électricité","Industrie","Transport et logistique"] },
          v: function(D){ var R={"Banque et finance":["v-mid","Une banque se lit autrement : ses dettes sont surtout l’argent déposé par ses clients. Le ratio dette / fonds propres de cet atelier ne s’applique pas tel quel."],"Télécoms":["v-ok","Gros investissements dans les réseaux : regardez si les dettes montent plus vite que les ventes."],"Distribution":["v-ok","Marges souvent faibles : une petite hausse des coûts pèse vite sur le résultat."],"Agro-industrie":["v-ok","Récoltes et cours mondiaux font varier les résultats d’une année à l’autre : lisez toujours sur 3 ans."],"Énergie, eau, électricité":["v-ok","Prix souvent encadrés : revenus réguliers, mais peu de marge de manœuvre."],"Industrie":["v-ok","Usines et machines coûtent cher : surveillez les dettes et la trésorerie."],"Transport et logistique":["v-ok","Sensible au prix du carburant et à l’activité des ports : regardez la régularité du résultat."]}[D.ls_sect]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai choisi le secteur de ma société." }
    ]},
    { t: "Le compte de résultat", acq: "Je lis le compte de résultat", desc: "Trois lignes, sur trois ans, pour voir la tendance.", e: [
      { t: "Trois lignes à repérer", f: ["Le chiffre d’affaires : tout ce que la société a vendu dans l’année.", "Le résultat d’exploitation : ce qui reste du métier, une fois payés achats, salaires et frais.", "Le résultat net : ce qui reste à la fin, après intérêts des dettes et impôts. C’est là que se paie le dividende."], c: "Le compte de résultat raconte une année. On ne retient que trois lignes, de haut en bas.",
        p: "Je sais repérer ces trois lignes dans un rapport annuel." },
      { t: "Sur trois ans", c: "Une seule année ne dit rien. Trois années côte à côte montrent si la société avance, stagne ou recule.",
        w: { ex: "Société Ivoirienne de Distribution (fictive), en millions de F : chiffre d’affaires 40 000, puis 44 000, puis 47 000. Résultat d’exploitation 4 000, 4 600, 4 900. Résultat net 2 500, 2 800, 3 000. Tout monte : la tendance est bonne.", k: "Vos chiffres, en millions de F (année 1 = la plus ancienne)", c3: 1, champs: [ {id:"ls_ca1", l:"Chiffre d’affaires, année 1"}, {id:"ls_ca2", l:"Chiffre d’affaires, année 2"}, {id:"ls_ca3", l:"Chiffre d’affaires, année 3"}, {id:"ls_re1", l:"Résultat d’exploitation, année 1"}, {id:"ls_re2", l:"Résultat d’exploitation, année 2"}, {id:"ls_re3", l:"Résultat d’exploitation, année 3"}, {id:"ls_rn1", l:"Résultat net, année 1"}, {id:"ls_rn2", l:"Résultat net, année 2"}, {id:"ls_rn3", l:"Résultat net, année 3"} ],
          v: function(D,H){ var ca1=H.N(D.ls_ca1), ca3=H.N(D.ls_ca3), re3=H.N(D.ls_re3), rn1=H.N(D.ls_rn1), rn2=H.N(D.ls_rn2), rn3=H.N(D.ls_rn3); if(!ca1||!ca3) return ''; var r1=function(x){return (Math.round(x*10)/10).toLocaleString('fr-FR');};
            var vca=(ca3/ca1-1)*100, h='<div class="gros"><small>Chiffre d’affaires sur 3 ans</small><b>'+(vca>=0?'+':'')+r1(vca)+' %</b><p>'+(re3?'Marge d’exploitation (année 3) : '+r1(re3/ca3*100)+' %. ':'')+(rn3?'Marge nette : '+r1(rn3/ca3*100)+' % des ventes.':'')+'</p></div>';
            var v;
            if(vca<0) v=['v-ko','Les ventes reculent sur 3 ans. Cherchez pourquoi dans le rapport annuel avant d’aller plus loin.'];
            else if(rn1&&rn3&&rn3<rn1) v=['v-mid','Les ventes montent, mais le résultat net baisse : les coûts ou les dettes mangent la croissance. À creuser.'];
            else if(rn1&&rn2&&rn3&&rn2>=rn1&&rn3>=rn2) v=['v-ok','Ventes et résultat net montent ensemble : la tendance est bonne.'];
            else if(rn1&&rn3) v=['v-mid','Le résultat net hésite d’une année à l’autre. Regardez s’il y a eu un événement exceptionnel.'];
            return h+(v?'<div class="verdict '+v[0]+'">'+v[1]+'</div>':''); } },
        p: "Mes chiffres sur 3 ans sont écrits." },
      { t: "Bon signe ou à creuser ?", c: "Un chiffre qui monte n’est pas toujours une bonne nouvelle. Ce qui compte, c’est d’où il vient.",
        w: { quiz: [ ["Le chiffre d’affaires monte, mais le résultat net baisse depuis 2 ans", ["Tout va bien","À creuser"], 1, "Les ventes ne suffisent pas : quelque chose coûte de plus en plus cher."], ["Le résultat net double une seule année grâce à la vente d’un immeuble", ["Bénéfice durable","Bénéfice exceptionnel"], 1, "On ne vend pas un immeuble chaque année. Regardez le résultat d’exploitation : c’est lui qui parle du métier."], ["Le résultat d’exploitation monte trois ans de suite", ["Le métier se porte bien","Cela ne veut rien dire"], 0, "Oui : c’est le cœur de l’activité qui progresse."] ] },
        p: "J’ai répondu aux trois questions." }
    ]},
    { t: "Le bilan", acq: "Je sais lire le bilan", desc: "Ce que la société possède, ce qu’elle doit, ce qu’elle a en caisse.", e: [
      { t: "Une photo, pas un film", f: ["Les fonds propres : l’argent des actionnaires, plus les bénéfices gardés au fil des années.", "Les dettes financières : ce que la société doit aux banques et aux prêteurs.", "La trésorerie : l’argent disponible tout de suite, en caisse et en banque."], c: "Le compte de résultat raconte l’année. Le bilan, c’est une photo prise le dernier jour : ce qu’on possède et ce qu’on doit.",
        p: "Je sais repérer ces trois postes dans le bilan." },
      { t: "Dette et fonds propres", c: "Une société qui doit plus que ce que ses actionnaires ont mis dépend de ses banquiers. Comme une famille qui vit à crédit.",
        w: { ex: "Société Ivoirienne de Distribution (fictive), en millions de F : fonds propres 20 000, dettes financières 8 000 (contre 7 500 l’an dernier), trésorerie 3 000. Dette / fonds propres = 8 000 ÷ 20 000 = 0,4.", k: "Vos chiffres de la dernière année, en millions de F", champs: [ {id:"ls_fp", l:"Fonds propres"}, {id:"ls_df", l:"Dettes financières"}, {id:"ls_df0", l:"Dettes financières, l’année d’avant"}, {id:"ls_tr", l:"Trésorerie"} ],
          v: function(D,H){ var fp=H.N(D.ls_fp), df=H.N(D.ls_df), df0=H.N(D.ls_df0), tr=H.N(D.ls_tr); if(!fp||!D.ls_df) return ''; var M=function(x){return H.F(x).replace(/ F$/,' millions de F');};
            if(fp<0) return '<div class="verdict v-ko">Fonds propres négatifs : les pertes passées ont mangé l’argent des actionnaires. Signal d’alerte sérieux.</div>';
            var r=df/fp, rs=(Math.round(r*100)/100).toLocaleString('fr-FR'), dn=df-tr;
            var h='<div class="gros"><small>Dette / fonds propres</small><b>'+rs+'</b><p>Dette nette (dettes moins trésorerie) : '+(dn>0?M(dn):'aucune, la trésorerie couvre les dettes')+'.'+(df0?' Dettes '+(df>df0?'en hausse':'stables ou en baisse')+' sur un an.':'')+'</p></div>', v;
            if(D.ls_sect==="Banque et finance") v=['v-mid','Pour une banque, ce ratio ne se lit pas ainsi : ses dettes sont surtout des dépôts de clients.'];
            else if(r<=0.5) v=['v-ok','Endettement modéré (repère EFA, ordre de grandeur).'];
            else if(r<=1) v=['v-mid','Endettement notable : regardez si les dettes servent à investir et si le résultat suit.'];
            else v=['v-ko','Les dettes dépassent les fonds propres : la société dépend de ses prêteurs. À surveiller de près.'];
            return h+'<div class="verdict '+v[0]+'">'+v[1]+'</div>'; } },
        p: "Mon ratio dette / fonds propres est calculé." }
    ]},
    { t: "Le cours et ses ratios", acq: "Je calcule les ratios du cours", desc: "Bénéfice par action, P.E.R., rendement, taux de distribution.", e: [
      { t: "Le bénéfice par action", c: "Le cours se lit par action. On ramène donc le résultat net à une action, puis on regarde combien d’années de bénéfice coûte le titre : c’est le P.E.R.",
        w: { ex: "Résultat net de 3 000 millions de F, 10 000 000 d’actions : bénéfice par action = 300 F. Cours de 4 500 F : P.E.R. = 4 500 ÷ 300 = 15. Vous payez 15 années du bénéfice actuel.", champs: [ {id:"ls_nba", l:"Nombre d’actions"}, {id:"ls_cours", l:"Cours de l’action (F)"} ],
          v: function(D,H){ var rn=H.N(D.ls_rn3), n=H.N(D.ls_nba), c=H.N(D.ls_cours); if(!n) return ''; if(!rn) return '<div class="verdict v-mid">Saisissez d’abord le résultat net de l’année 3 (chapitre 2).</div>';
            var bpa=rn*1000000/n, h='<div class="gros"><small>Bénéfice par action</small><b>'+H.F(bpa)+'</b>';
            if(!c) return h+'</div>';
            if(bpa<=0) return h+'</div><div class="verdict v-ko">La société perd de l’argent : le P.E.R. n’a pas de sens cette année.</div>';
            var per=c/bpa; return h+'<p>P.E.R. : '+(Math.round(per*10)/10).toLocaleString('fr-FR')+'. Vous payez environ '+Math.round(per)+' années du bénéfice actuel.</p></div><div class="verdict v-mid">Un P.E.R. ne se juge jamais seul : comparez-le à une société du même secteur (chapitre 5).</div>'; } },
        p: "Mon bénéfice par action et mon P.E.R. sont calculés." },
      { t: "Le dividende", c: "Le rendement dit ce que le dividende rapporte par rapport au cours. Le taux de distribution dit quelle part du bénéfice est versée.",
        w: { ex: "Dividende de 210 F par action, cours de 4 500 F : rendement = 4,7 %. Bénéfice par action de 300 F : taux de distribution = 210 ÷ 300 = 70 %. La société garde 30 % pour investir.", champs: [ {id:"ls_div", l:"Dividende par action (F)"} ],
          v: function(D,H){ var d=H.N(D.ls_div), c=H.N(D.ls_cours), rn=H.N(D.ls_rn3), n=H.N(D.ls_nba); if(!d) return ''; var r1=function(x){return (Math.round(x*10)/10).toLocaleString('fr-FR');};
            var bpa=(rn&&n)?rn*1000000/n:0, h='<div class="gros"><small>Rendement du dividende</small><b>'+(c?r1(d/c*100)+' %':'saisissez le cours')+'</b>'+(bpa>0?'<p>Taux de distribution : '+r1(d/bpa*100)+' % du bénéfice.</p>':'')+'</div>', v;
            if(bpa<=0&&rn) v=['v-ko','Dividende versé alors que la société perd de l’argent : il est payé avec les réserves ou la dette.'];
            else if(!bpa) v=null;
            else if(d>bpa) v=['v-ko','Le dividende dépasse le bénéfice : la société distribue plus qu’elle ne gagne. Cela ne peut pas durer.'];
            else if(d/bpa>0.8) v=['v-mid','Presque tout le bénéfice est versé : peu de marge pour investir ou encaisser une mauvaise année.'];
            else v=['v-ok','Le bénéfice couvre le dividende, avec une part gardée pour l’avenir.'];
            return h+(v?'<div class="verdict '+v[0]+'">'+v[1]+'</div>':''); } },
        p: "Mon rendement et mon taux de distribution sont calculés." },
      { t: "Les pièges des ratios", c: "Un ratio flatteur peut cacher un problème. Le bon réflexe : se demander pourquoi il est si bas, ou si haut.",
        w: { quiz: [ ["Un P.E.R. très bas veut toujours dire que l’action est une bonne affaire", ["Vrai","Faux"], 1, "Le marché attend peut-être une baisse des bénéfices. Un P.E.R. bas pose une question, il ne donne pas une réponse."], ["Un rendement de 12 % attire votre œil. Premier réflexe ?", ["Vérifier que le bénéfice couvre le dividende","Agir vite avant les autres"], 0, "Un rendement très élevé vient souvent d’un cours qui a chuté, ou d’un dividende qui ne durera pas."], ["Le cours monte fortement en un mois", ["La société va forcément mieux","Il faut regarder si les chiffres ont changé"], 1, "Le cours bouge avec l’humeur du marché. Les chiffres, eux, se publient dans les comptes."] ] },
        p: "J’ai répondu aux trois questions." }
    ]},
    { t: "Ma fiche de lecture", acq: "Je repère les signaux d’alerte", desc: "Les signaux à surveiller, la comparaison, les bons documents.", e: [
      { t: "Les signaux d’alerte", c: "Certains signaux se voient dans vos chiffres, d’autres dans la vie du titre. Ajoutez ceux que vous avez remarqués.",
        w: { puces: { id:"ls_al", k:"Ce que vous avez remarqué vous-même", m:1, l:["Peu d’échanges sur le titre","Un résultat exceptionnel gonfle l’année","Comptes publiés en retard","Dirigeants souvent remplacés","Litige ou procès important"] },
          v: function(D,H){ var L=lsSignaux(D,H); if(!H.N(D.ls_ca3)&&!H.N(D.ls_rn3)&&!(D.ls_al||[]).length) return ''; if(!L.length) return '<div class="verdict v-ok">Aucun signal d’alerte dans vos chiffres ni dans vos remarques. Restez attentif aux prochains comptes.</div>';
            return '<div class="gros"><small>Signaux d’alerte repérés</small><b>'+L.length+'</b><p>'+L.join(' · ')+'</p></div><div class="verdict '+(L.length>2?'v-ko':'v-mid')+'">'+(L.length>2?'Plusieurs signaux à la fois : prenez le temps de comprendre chacun avant toute décision.':'Un signal n’est pas une condamnation : c’est une question à poser au rapport annuel.')+'</div>'; } },
        p: "J’ai fait le point sur les signaux d’alerte." },
      { t: "Comparer au voisin", c: "Un chiffre seul ne veut pas dire grand-chose. À côté d’une société du même secteur, il commence à parler.",
        w: { ex: "Comptoir Sahélien (société fictive, même secteur) : P.E.R. de 11, rendement de 6 %, dette / fonds propres de 0,9. La Société Ivoirienne de Distribution coûte plus cher en bénéfice, mais elle est moins endettée.", k: "Une société du même secteur", champs: [ {id:"ls_comp", l:"Nom de la société voisine", type:"txt", large:1}, {id:"ls_cper", l:"Son P.E.R."}, {id:"ls_crend", l:"Son rendement (%)"}, {id:"ls_cdet", l:"Sa dette / fonds propres", ph:"0,9"} ],
          v: function(D,H){ var cp=H.N(D.ls_cper), cr=H.N(D.ls_crend), cd=H.N(D.ls_cdet); if(!cp&&!cr&&!cd) return ''; var r1=function(x){return (Math.round(x*10)/10).toLocaleString('fr-FR');};
            var rn=H.N(D.ls_rn3), n=H.N(D.ls_nba), c=H.N(D.ls_cours), d=H.N(D.ls_div), fp=H.N(D.ls_fp), df=H.N(D.ls_df), bpa=(rn&&n)?rn*1000000/n:0;
            var per=(bpa>0&&c)?c/bpa:0, rd=(d&&c)?d/c*100:0, dt=(fp>0&&D.ls_df)?df/fp:0, L=[], P=[];
            if(cp) L.push('P.E.R. : '+(per?r1(per):'?')+' contre '+r1(cp));
            if(cr) L.push('Rendement : '+(rd?r1(rd)+' %':'?')+' contre '+r1(cr)+' %');
            if(cd) L.push('Dette / fonds propres : '+(dt?r1(dt):'?')+' contre '+r1(cd));
            if(per&&cp) P.push(per>cp?'Votre société coûte plus cher en bénéfice que sa voisine : cherchez ce qui le justifie (croissance, dettes plus faibles…).':'Votre société coûte moins cher en bénéfice que sa voisine : cherchez pourquoi le marché est plus prudent.');
            if(dt&&cd) P.push(dt>cd?'Elle est plus endettée que sa voisine.':'Elle est moins endettée que sa voisine.');
            return '<div class="gros"><small>'+H.esc(D.ls_soc||'Votre société')+' contre '+H.esc(D.ls_comp||'sa voisine')+'</small><p>'+L.join('<br>')+'</p></div>'+(P.length?'<div class="verdict v-mid">'+P.join(' ')+'</div>':''); } },
        p: "J’ai comparé ma société à une voisine du même secteur." },
      { t: "Où trouver les documents", f: ["Le site de la Bourse régionale (BRVM) : cours, volumes échangés, communiqués des sociétés.", "Le Bulletin officiel de la cote, publié chaque jour de Bourse : cours et volumes de tous les titres.", "Le site de la société : rapports annuels et états financiers des dernières années."], c: "Votre fiche ne dit pas « achetez » : EFA ne dit jamais quel titre acheter. Elle vous aide à poser les bonnes questions, avec les bons documents.",
        w: { consignes: 1, ex: "Société Ivoirienne de Distribution (fictive) : ventes en hausse sur 3 ans, dettes modérées, dividende couvert par le bénéfice. Je surveille le faible volume d’échanges.", champs: [ {id:"ls_note", l:"Ma lecture en une phrase", type:"area", ph:"Ventes…, dettes…, dividende… Je surveille…"} ] },
        p: "Ma lecture en une phrase est écrite." }
    ]}
  ],
  fin: {
    k: "Ma fiche de lecture", titre: "Vous savez lire une société cotée",
    fiche: [
      ["Société étudiée", function(D){ return [D.ls_soc,D.ls_sect].filter(Boolean).join(' · '); }],
      ["Ce qu’elle vend, à qui", function(D){ return [D.ls_vend,D.ls_cli].filter(Boolean).join(' · '); }],
      ["Chiffre d’affaires sur 3 ans", function(D,H){ var a=H.N(D.ls_ca1), b=H.N(D.ls_ca3); if(!a||!b) return ''; var v=(b/a-1)*100; return (v>=0?'+':'')+(Math.round(v*10)/10).toLocaleString('fr-FR')+' %'; }],
      ["Dette / fonds propres", function(D,H){ var fp=H.N(D.ls_fp); if(fp<=0||!D.ls_df) return ''; return (Math.round(H.N(D.ls_df)/fp*100)/100).toLocaleString('fr-FR'); }],
      ["Bénéfice par action et P.E.R.", function(D,H){ var rn=H.N(D.ls_rn3), n=H.N(D.ls_nba), c=H.N(D.ls_cours); if(!rn||!n) return ''; var b=rn*1000000/n; return H.F(b)+((c&&b>0)?' · P.E.R. '+(Math.round(c/b*10)/10).toLocaleString('fr-FR'):''); }],
      ["Rendement et distribution", function(D,H){ var d=H.N(D.ls_div), c=H.N(D.ls_cours), rn=H.N(D.ls_rn3), n=H.N(D.ls_nba); if(!d||!c) return ''; var b=(rn&&n)?rn*1000000/n:0; return (Math.round(d/c*1000)/10).toLocaleString('fr-FR')+' %'+(b>0?' · '+Math.round(d/b*100)+' % du bénéfice versé':''); }],
      ["Signaux d’alerte", function(D,H){ var L=lsSignaux(D,H); return L.join(', '); }],
      ["Ma lecture", function(D){ return D.ls_note||''; }]
    ],
    suite: { t: "Mon premier ordre à la Bourse", p: "Vous savez lire une société ? Le coach suivant vous apprend à passer un ordre pas à pas. Le choix du titre reste le vôtre.", lien: "coach-bourse.html", b: "Ouvrir le coach" }
  }
};
