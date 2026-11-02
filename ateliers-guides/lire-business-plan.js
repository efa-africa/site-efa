/* Atelier guidé · Lire un business plan comme un financeur */
function lbNb(x){ return (Math.round(x*10)/10).toLocaleString('fr-FR'); }
function lbMarge(D,H){
  var ve=H.N(D.lb_ve), ac=H.N(D.lb_ac), pe=H.N(D.lb_pe), tr=H.N(D.lb_tr), sa=H.N(D.lb_sa), au=H.N(D.lb_au), ba=H.N(D.lb_ba);
  if(!ve) return null;
  var perte=ve*Math.min(Math.max(pe,0),100)/100;
  return { brute:ve-ac, perte:perte, net:ve-perte-ac-tr-sa-au, ba:ba };
}
function lbRatio(D,H){
  var fi=H.N(D.lb_fi), p1=H.N(D.lb_p1), h=H.N(D.lb_h);
  if(!fi||!p1) return null;
  return { r:p1/fi, g:h?p1/h:0, h:h };
}
function lbTreso(D,H){
  var fi=H.N(D.lb_fi), dm=H.N(D.lb_dm), pm=H.N(D.lb_pm), u=H.N(D.lb_u1)+H.N(D.lb_u2)+H.N(D.lb_u3);
  if(!fi||!dm) return null;
  return { mois:fi/dm, pm:pm, u:u, fi:fi };
}
function lbGrille(D){
  var o=0, a=0, n=0, k;
  for(k=1;k<=6;k++){ var v=D['lb_g'+k]; if(v==="Oui") o++; else if(v==="À vérifier") a++; else if(v==="Non") n++; }
  var t=o+a+n, verdict='';
  if(t===6) verdict=(n===0&&o>=4)?"Finançable":(n>=3||o<=1)?"Pas encore":"À retravailler";
  return { o:o, a:a, n:n, t:t, verdict:verdict };
}
window.ATELIER = {
  id: "lire-business-plan",
  titre: "Lire un business plan comme un financeur",
  h1: "Un plan qui convainc répond à six questions.",
  voix: "auto",
  question: {
    t: "On vous présente un projet qui annonce 500 000 F de bénéfice par mois. Que demandez-vous d’abord ?",
    r: [
      ["a", "Combien je gagnerai si je participe.", "C’est la question que beaucoup se posent en premier, et elle est légitime. Mais un financeur commence ailleurs : il veut savoir d’où vient ce bénéfice. Cet atelier vous apprend à le vérifier.", false],
      ["b", "Ce qui est déjà prouvé : les ventes réelles.", "Exactement. Un financeur part de ce qui existe déjà. Vous allez apprendre à lire tout le plan avec ce réflexe, question après question.", true]
    ]
  },
  chapitres: [
    { t: "Lire comme un financeur", acq: "Je connais les six questions du financeur", desc: "Ce qu’un banquier ou un investisseur cherche, et les deux dossiers qui nous serviront d’exemple.", e: [
      { t: "Les six questions", c: "Un banquier ne lit pas un business plan de la première à la dernière page. Il cherche des réponses à six questions, toujours les mêmes.",
        f: ["Qu’est-ce qui est déjà prouvé ? Des ventes, des clients, des chiffres réels, pas des intentions.", "La marge est-elle nette ? Après les pertes, le transport, le stockage, les salaires, les impôts et l’usure.", "Les projections suivent-elles l’historique ? Pas de saut sans moyens nouveaux.", "Combien faut-il, pour quoi faire, jusqu’à quand ? Montant, usage des fonds, trésorerie jusqu’au point mort.", "Le projet se concentre-t-il ? Une activité principale prouvée plutôt que dix annoncées.", "L’équipe est-elle à l’échelle ? Les bonnes compétences, un organigramme à la taille du projet."],
        p: "Je connais les six questions." },
      { t: "Deux dossiers sur la table", c: "Deux projets inventés vont nous suivre tout l’atelier. Chacun a des forces réelles et des points à renforcer.",
        f: ["Marché-Express, application de petites annonces : des utilisateurs actifs mesurés chaque mois, un modèle de revenus déjà éprouvé ailleurs, un financement chiffré en deux tranches, un point mort annoncé dans trois ans. Mais le détail des revenus n’est pas fourni.", "VivriPro, négoce de produits vivriers : demande 60 millions de F et annonce plus d’un milliard de chiffre d’affaires dès l’an 1, dix activités, un organigramme de grand groupe pour 25 salariés. Sa force : un tableau précis par produit, avec fournisseurs, clients et durées de rotation."],
        w: { consignes:1, puces: { id:"lb_role", k:"Votre place devant un business plan", l:["Je présente mon projet","On me présente un projet","Je vais m’associer"] } },
        p: "J’ai lu les deux dossiers et situé ma place." },
      { t: "Le plan que vous allez lire", c: "Choisissez un vrai dossier : le vôtre, celui d’un proche, ou un projet présenté à votre tontine. Vous le lirez avec la grille jusqu’au bout.",
        w: { ex: "Fatou prépare un dossier pour son atelier de couture. Elle demande 4 500 000 F pour deux machines et trois mois de stock de tissu.", k: "Le business plan que vous lisez", champs: [ {id:"lb_nom", l:"Nom du projet", type:"txt", ph:"Atelier de couture de Fatou"}, {id:"lb_fi", l:"Financement demandé (F)", ph:"4 500 000"}, {id:"lb_act", l:"L’activité en une phrase", type:"txt", large:1, ph:"Coudre et vendre des tenues de cérémonie à Yopougon"} ] },
        p: "Le projet que je vais lire est écrit." }
    ]},
    { t: "Preuves et marge", acq: "Je sais distinguer une preuve d’une promesse", desc: "Ce qui est déjà prouvé, et la marge qui reste vraiment.", e: [
      { t: "Qu’est-ce qui est déjà prouvé ?", c: "Une intention se lit au futur. Une preuve se lit au passé : ce qui a été vendu, à qui, et combien.",
        w: { quiz: [ ["Marché-Express : 12 000 utilisateurs actifs ce mois-ci, 8 % de plus que le mois dernier", ["Preuve","Intention"], 0, "Ce sont des chiffres mesurés, mois après mois."], ["VivriPro : « Nous visons 500 clients grossistes »", ["Preuve","Intention"], 1, "C’est un objectif. Il devient une preuve quand les premiers clients ont acheté."], ["Un carnet de commandes signées par trois cantines scolaires", ["Preuve","Intention"], 0, "Un engagement écrit d’un client vaut beaucoup plus qu’une estimation."] ],
          puces: { id:"lb_pv", k:"Ce que votre plan prouve déjà", m:1, l:["Des ventes réelles","Des clients qui reviennent","Des commandes ou contrats signés","Des chiffres tenus dans un cahier ou des relevés","Rien encore : ce sont des intentions"] },
          v: function(D){ var L=(D.lb_pv||[]), rien=L.indexOf("Rien encore : ce sont des intentions")>=0, n=L.length-(rien?1:0); if(!L.length) return ''; if(!n) return '<div class="verdict v-mid">Pas encore de preuve. Commencez petit, vendez, notez tout : quelques mois de ventes réelles valent plus qu’une belle projection.</div>'; return '<div class="verdict '+(n>=2?'v-ok':'v-mid')+'">'+(n>=2?n+' preuves : mettez-les en première page du plan, c’est ce que le financeur lira d’abord.':'Une preuve, c’est un début. Cherchez la deuxième : un client qui revient, un relevé, une commande écrite.')+'</div>'; } },
        p: "J’ai listé ce que mon plan prouve déjà." },
      { t: "Marge brute ou bénéfice ?", c: "La marge brute, c’est ce qui reste après l’achat. Le bénéfice, c’est ce qui reste après tout le reste.",
        w: { quiz: [ ["VivriPro achète un panier de tomates 10 000 F, le revend 15 000 F et écrit « bénéfice : 5 000 F »", ["C’est un bénéfice","C’est une marge brute"], 1, "Il faut encore retirer les tomates abîmées, le transport, le stockage, les salaires et les impôts."], ["Marché-Express annonce ses revenus futurs sans dire d’où ils viennent", ["On peut juger sa marge","On ne peut pas encore la juger"], 1, "Commissions, publicité, abonnements ? Sans ce détail, la marge reste une question ouverte."], ["Un camion de livraison qui s’use un peu chaque année", ["C’est une charge","Ce n’est pas une charge"], 0, "L’usure coûte chaque année, même si aucun argent ne sort ce jour-là. Il faudra remplacer le camion."] ] },
        p: "Je sais distinguer une marge brute d’un bénéfice." },
      { t: "Calculer la marge nette", c: "Reprenez les chiffres d’un mois de votre plan. On retire tout, puis on compare au bénéfice annoncé.",
        w: { ex: "VivriPro vend 1 500 000 F de tomates achetées 1 000 000 F et annonce 500 000 F de bénéfice. Avec 20 % de pertes, 80 000 F de transport et 100 000 F de salaires, il reste 20 000 F.", k: "Un mois de votre plan (F)", c3: 1, champs: [ {id:"lb_ve", l:"Ventes"}, {id:"lb_ac", l:"Achats"}, {id:"lb_pe", l:"Pertes (% des ventes)", ph:"10"}, {id:"lb_tr", l:"Transport"}, {id:"lb_sa", l:"Salaires"}, {id:"lb_au", l:"Stockage, impôts, usure"}, {id:"lb_ba", l:"Bénéfice annoncé"} ],
          v: function(D,H){ var m=lbMarge(D,H); if(!m) return ''; var h='<div class="gros"><small>Marge nette estimée par mois</small><b>'+H.F(m.net)+'</b><p>Marge brute : '+H.F(m.brute)+' · pertes : '+H.F(m.perte)+'</p></div>';
            if(m.ba){ if(m.net<=0) h+='<div class="verdict v-ko">Une fois tout compté, le bénéfice annoncé de '+H.F(m.ba)+' disparaît. Le plan doit montrer la marge nette, puis dire comment l’améliorer.</div>'; else if(m.net<m.ba*0.8) h+='<div class="verdict v-mid">Le bénéfice annoncé dépasse la marge nette de '+H.F(m.ba-m.net)+'. Corrigez ce chiffre : un financeur le recalculera.</div>'; else h+='<div class="verdict v-ok">Le bénéfice annoncé tient après toutes les charges. C’est un point fort du plan.</div>'; }
            else h+='<div class="verdict '+(m.net>0?'v-ok':'v-ko')+'">'+(m.net>0?'Marge nette positive : c’est ce chiffre qu’il faut écrire dans le plan.':'Marge nette négative : revoyez les prix, les pertes ou les charges avant de chercher un financement.')+'</div>';
            return h; } },
        p: "Ma marge nette est calculée." }
    ]},
    { t: "Projections et argent", acq: "Je sais tester les chiffres de l’avenir", desc: "Une projection qui suit l’historique, un financement qui tient jusqu’au point mort.", e: [
      { t: "Les projections suivent-elles l’historique ?", c: "Un chiffre d’affaires qui saute d’un coup doit s’expliquer : nouvelles machines, nouveaux clients, nouvelle équipe. Sans moyens nouveaux, pas de saut.",
        w: { ex: "VivriPro demande 60 000 000 F et annonce 1 100 000 000 F de chiffre d’affaires dès l’an 1 : chaque franc prêté devrait produire plus de 18 F de ventes la première année.", k: "Le chiffre d’affaires de votre plan (F)", champs: [ {id:"lb_h", l:"Dernière année réelle (0 si aucune)"}, {id:"lb_p1", l:"Annoncé pour l’an 1"} ],
          v: function(D,H){ var R=lbRatio(D,H); if(!R) return H.N(D.lb_p1)&&!H.N(D.lb_fi)?'<div class="verdict v-mid">Indiquez le financement demandé au chapitre 1 pour voir le ratio.</div>':''; var h='<div class="gros"><small>Chiffre d’affaires an 1 / financement demandé</small><b>'+lbNb(R.r)+' fois</b><p>Ordre de grandeur, à lire selon le métier : un négoce qui tourne vite peut aller plus haut qu’un atelier.</p></div>';
            h+='<div class="verdict '+(R.r<=3?'v-ok':R.r<=10?'v-mid':'v-ko')+'">'+(R.r<=3?'Ratio raisonnable. Il reste à le justifier par les ventes passées.':R.r<=10?'Ambitieux : chaque franc prêté doit produire '+lbNb(R.r)+' F de ventes dès l’an 1. Montrez la rotation qui le permet.':'Très ambitieux : '+lbNb(R.r)+' F de ventes par franc prêté. Sans historique qui le montre, le financeur décrochera.')+'</div>';
            if(R.h) h+='<div class="verdict '+(R.g>2?'v-mid':'v-ok')+'">'+(R.g>2?'L’an 1 annonce '+lbNb(R.g)+' fois le chiffre de l’an dernier. Quels moyens nouveaux expliquent ce saut ? Écrivez-les.':'La projection prolonge l’historique : c’est rassurant.')+'</div>';
            else h+='<div class="verdict v-mid">Aucun historique : tout repose sur des hypothèses. Quelques mois de ventes réelles changeraient la lecture.</div>';
            return h; } },
        p: "J’ai comparé la projection à l’historique." },
      { t: "Combien, pour quoi, jusqu’à quand ?", c: "Un financeur veut voir où va chaque franc, et combien de mois il fait vivre le projet avant le point mort.",
        w: { ex: "Marché-Express demande 90 000 000 F en deux tranches. Il dépense 3 000 000 F par mois : le financement couvre 30 mois. Le point mort est annoncé à 36 mois : il faudra une deuxième levée, et le plan le dit.", k: "L’usage des fonds et le rythme des dépenses", c3: 1, champs: [ {id:"lb_u1", l:"Équipement (F)"}, {id:"lb_u2", l:"Stock et marchandises (F)"}, {id:"lb_u3", l:"Fonds de roulement (F)"}, {id:"lb_dm", l:"Dépenses par mois (F)"}, {id:"lb_pm", l:"Mois avant le point mort", ph:"12"} ],
          v: function(D,H){ var T=lbTreso(D,H); if(!T) return ''; var mois=Math.floor(T.mois), h='<div class="gros"><small>Le financement couvre</small><b>'+mois+' mois de dépenses</b>'+(T.pm?'<p>Point mort annoncé : '+T.pm+' mois.</p>':'')+'</div>';
            if(T.pm){ if(T.mois>=T.pm+3) h+='<div class="verdict v-ok">Le financement tient jusqu’au point mort, avec une marge de sécurité.</div>'; else if(T.mois>=T.pm) h+='<div class="verdict v-mid">C’est juste : aucun retard n’est permis. Prévoyez quelques mois de marge.</div>'; else h+='<div class="verdict v-ko">Il manque environ '+Math.ceil(T.pm-T.mois)+' mois avant le point mort. Écrivez la deuxième levée ou réduisez les dépenses.</div>'; }
            if(T.u){ var d=T.fi-T.u; if(Math.abs(d)>T.fi*0.05) h+='<div class="verdict v-mid">'+(d>0?H.F(d)+' de la demande n’ont pas encore d’usage écrit.':'Les usages dépassent la demande de '+H.F(-d)+'.')+'</div>'; else h+='<div class="verdict v-ok">Chaque franc demandé a un usage écrit.</div>'; }
            return h; } },
        p: "L’usage des fonds et la durée couverte sont écrits." }
    ]},
    { t: "Le cap et l’équipe", acq: "Je sais juger le cap et l’équipe", desc: "Une activité principale, et une équipe à la taille du projet.", e: [
      { t: "Le projet se concentre-t-il ?", c: "Dix activités, ce sont dix métiers à apprendre en même temps. Un financeur préfère une activité prouvée, les autres viendront plus tard.",
        w: { ex: "VivriPro annonce négoce, transformation, transport, export, élevage, restauration et quatre autres activités. Son tableau par produit montre pourtant qu’il connaît déjà très bien le négoce.", k: "Le cap de votre plan", champs: [ {id:"lb_ap", l:"Activité principale", type:"txt", ph:"Négoce de tomates et d’oignons"}, {id:"lb_na", l:"Nombre d’activités annoncées", ph:"1"}, {id:"lb_pa", l:"Part des ventes réelles de l’activité principale (%)", ph:"80"} ],
          v: function(D,H){ var na=H.N(D.lb_na), pa=H.N(D.lb_pa); if(!na) return ''; var h='<div class="verdict '+(na<=2?'v-ok':na<=4?'v-mid':'v-ko')+'">'+(na<=2?'Le plan se concentre : c’est ce qu’un financeur veut voir.':na<=4?na+' activités : gardez la principale au centre, présentez les autres comme des étapes.':na+' activités annoncées : choisissez celle qui est prouvée, et faites des autres une suite.')+'</div>';
            if(pa) h+='<div class="verdict '+(pa>=60?'v-ok':'v-mid')+'">'+(pa>=60?'L’activité principale porte déjà '+pa+' % des ventes : mettez-la en avant.':'L’activité principale ne pèse que '+pa+' % des ventes. Est-ce vraiment elle, la principale ?')+'</div>';
            return h; } },
        p: "L’activité principale de mon plan est nommée." },
      { t: "L’équipe est-elle à l’échelle ?", c: "Un financeur prête à des personnes. Il cherche les bonnes compétences, une organisation à la taille du projet, et des affirmations qu’il peut vérifier.",
        w: { puces: { id:"lb_eq", k:"Compétences présentes dans l’équipe, nommées dans le plan", m:1, l:["Vente et clients","Achats et logistique","Finance et comptabilité","Savoir-faire du métier","Gestion d’équipe"] },
          quiz: [ ["« Notre projet créera des millions d’emplois indirects »", ["Ça convainc","Ça inquiète"], 1, "Un chiffre impossible à vérifier fait douter du reste. Mieux vaut « 12 emplois directs en an 2 »."], ["Huit directions dans l’organigramme pour 25 salariés", ["Proportionné","Trop lourd pour la taille"], 1, "Pour 25 personnes, un responsable par grande fonction suffit. L’organigramme grandira avec le projet."], ["Une associée qui a tenu un commerce de vivriers pendant des années", ["Un atout","Un détail"], 0, "L’expérience du métier rassure. Mettez-la en avant, avec ce qu’elle a déjà vendu."] ],
          v: function(D){ var n=(D.lb_eq||[]).length; if(!n) return ''; return '<div class="gros"><small>Compétences clés couvertes</small><b>'+n+' sur 5</b></div><div class="verdict '+(n>=4?'v-ok':n>=2?'v-mid':'v-ko')+'">'+(n>=4?'L’équipe couvre l’essentiel. Écrivez qui fait quoi, nom par nom.':n>=2?'Il manque des compétences : nommez qui les apportera (associé, recrutement, prestataire).':'L’équipe est encore incomplète. Un financeur voudra savoir qui tient la vente, les achats et les comptes.')+'</div>'; } },
        p: "J’ai vérifié les compétences de l’équipe." }
    ]},
    { t: "Mon verdict", acq: "Je rends un verdict écrit", desc: "La grille appliquée aux deux cas, puis au business plan que vous lisez.", e: [
      { t: "Les deux dossiers, notés", c: "Appliquons la grille aux deux cas. Aucun n’est parfait : chacun a quelque chose à renforcer.",
        w: { ex: "Marché-Express : 4 oui, 2 à vérifier (détail des revenus, équipe non décrite), 0 non. VivriPro : 0 oui, 2 à vérifier (preuves, usage des fonds), 4 non. Sa base est pourtant réelle : son tableau par produit.", quiz: [ ["Quel dossier montre une traction mesurée ?", ["Marché-Express","VivriPro"], 0, "Des utilisateurs actifs, suivis chaque mois : c’est sa première force."], ["Quel dossier connaît le mieux ses produits, fournisseurs et délais de rotation ?", ["Marché-Express","VivriPro"], 1, "C’est la vraie force de VivriPro. Bâti autour de ce tableau, le plan deviendrait solide."], ["Que doit corriger VivriPro en premier ?", ["Sa marge nette et sa projection","Son tableau par produit"], 0, "Le tableau est bon. Ce sont les chiffres annoncés qu’il faut ramener à la réalité."] ] },
        p: "J’ai comparé les deux dossiers avec la grille." },
      { t: "Ma grille de six questions", c: "Répondez pour le plan que vous lisez. « À vérifier » n’est pas un échec : c’est une question précise à poser au porteur.",
        w: { puces: [ {id:"lb_g1", k:"1. Qu’est-ce qui est déjà prouvé ?", l:["Oui","À vérifier","Non"]}, {id:"lb_g2", k:"2. La marge est-elle nette ?", l:["Oui","À vérifier","Non"]}, {id:"lb_g3", k:"3. Les projections suivent-elles l’historique ?", l:["Oui","À vérifier","Non"]}, {id:"lb_g4", k:"4. Le financement est-il chiffré, détaillé et suffisant ?", l:["Oui","À vérifier","Non"]}, {id:"lb_g5", k:"5. Le projet se concentre-t-il ?", l:["Oui","À vérifier","Non"]}, {id:"lb_g6", k:"6. L’équipe est-elle à l’échelle ?", l:["Oui","À vérifier","Non"]} ],
          v: function(D){ var G=lbGrille(D); if(!G.t) return ''; var h='<div class="gros"><small>Ma grille · '+G.t+' question'+(G.t>1?'s':'')+' sur 6</small><b>'+G.o+' oui · '+G.a+' à vérifier · '+G.n+' non</b></div>'; if(!G.verdict) return h;
            var R={"Finançable":["v-ok","Finançable : le plan répond aux questions d’un financeur. Ce n’est pas une promesse d’accord, mais le dossier peut être présenté."],"À retravailler":["v-mid","À retravailler : la base existe. Reprenez les « à vérifier » et les « non » un par un avant de présenter le dossier."],"Pas encore":["v-ko","Pas encore : le projet a besoin de preuves et de chiffres plus solides. Commencez par la question 1, tout le reste en découle."]}[G.verdict];
            return h+'<div class="verdict '+R[0]+'">'+R[1]+'</div>'; } },
        p: "Ma grille est remplie." },
      { t: "Mon verdict écrit", c: "Un verdict écrit se relit, se partage et se compare. Trois phrases suffisent : ce qui tient, ce qui manque, ce qu’on renforce d’abord.",
        w: { ex: "« Marché-Express a une vraie traction et un financement bien découpé. Il manque le détail des revenus. Avant d’investir, je demande les revenus mois par mois. »", champs: [ {id:"lb_vd", l:"Mon verdict en trois phrases", type:"area", ph:"Ce qui tient : … Ce qui manque : … Avant de financer, je demande : …"}, {id:"lb_fx", l:"La première chose à renforcer", type:"txt", large:1, ph:"Montrer six mois de ventes réelles"} ] },
        p: "Mon verdict est écrit." }
    ]}
  ],
  fin: {
    k: "Ma fiche de lecture", titre: "Votre lecture est faite, et écrite",
    fiche: [
      ["Projet lu", function(D,H){ var n=D.lb_nom||'', f=H.N(D.lb_fi); return n+(n&&f?' · ':'')+(f?H.F(f)+' demandés':''); }],
      ["Marge nette par mois", function(D,H){ var m=lbMarge(D,H); return m?H.F(m.net)+(m.ba?' (annoncé : '+H.F(m.ba)+')':''):''; }],
      ["Chiffre d’affaires an 1 / financement", function(D,H){ var R=lbRatio(D,H); return R?lbNb(R.r)+' fois':''; }],
      ["Mois de dépenses couverts", function(D,H){ var T=lbTreso(D,H); return T?Math.floor(T.mois)+' mois'+(T.pm?' (point mort : '+T.pm+' mois)':''):''; }],
      ["Activité principale", function(D,H){ var a=D.lb_ap||'', n=H.N(D.lb_na); return a+(a&&n?' · ':'')+(n?n+' activité'+(n>1?'s':'')+' annoncée'+(n>1?'s':''):''); }],
      ["Ma grille", function(D){ var G=lbGrille(D); return G.t?G.o+' oui · '+G.a+' à vérifier · '+G.n+' non'+(G.verdict?' · '+G.verdict:''):''; }],
      ["Mon verdict", function(D){ return D.lb_vd||''; }],
      ["Ce que je renforce d’abord", function(D){ return D.lb_fx||''; }]
    ],
    suite: { t: "Mon business plan tient-il la route ?", p: "Votre lecture est faite ? L’outil suivant teste les chiffres de votre plan : marge, trésorerie, point mort.", lien: "mon-business-plan-tient-il.html", b: "Tester mes chiffres" }
  }
};
