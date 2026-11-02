/* Atelier guidé · Où placer une somme selon mon horizon */
(function(){
var MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
/* Horizon en mois, calculé depuis le mois et l’année de besoin */
function hz(D,H){ var m=H.N(D.ph_mm), a=H.N(D.ph_aa); if(!m||!a||m<1||m>12) return null; var d=new Date(); return (a-d.getFullYear())*12+(m-1-d.getMonth()); }
function cat(h){ return h==null||h<1?'':h<12?'court':h<36?'moyen':h<60?'entre':'long'; }
var CAT={court:"moins d’un an : la disponibilité d’abord",moyen:"de 1 à 3 ans : des placements à échéance connue",entre:"de 3 à 5 ans : surtout à échéance connue, une petite part peut varier",long:"plus de 5 ans : on peut accepter des variations"};
/* Somme au terme : montant moins frais d’entrée, intérêts composés chaque année, impôt sur les intérêts */
function terme(D,H,t,fr){ var M=H.N(D.ph_mt), h=hz(D,H); if(!M||!h||h<1) return null; var b=M*(1-fr/100), br=b*(Math.pow(1+t/100,h/12)-1), n=br*(1-H.N(D.ph_imp)/100); return {M:M,h:h,b:b,br:br,n:n,tot:b+n}; }
var PL={
  "Compte d’épargne":["Retrait en quelques jours, souvent moins.","Très faible dans un établissement agréé.","Faibles en général : vérifiez les frais de tenue de compte.",0],
  "Dépôt à terme":["Bloqué jusqu’à l’échéance que vous choisissez.","Faible dans un établissement agréé. Le taux est connu à la signature.","Pénalité, ou intérêts perdus, si vous sortez avant l’échéance.",0],
  "Emprunt d’État":["Échéance connue. Revendre avant est possible, mais au prix du moment.","Faible si vous le gardez jusqu’à l’échéance.","Frais de l’intermédiaire agréé à l’achat, parfois des frais de garde.",0],
  "OPCVM monétaire":["Retrait en quelques jours, en général.","Faible : la valeur bouge peu, mais elle n’est pas garantie.","Frais de gestion chaque année, parfois des frais d’entrée ou de sortie.",1],
  "OPCVM obligataire":["Retrait en quelques jours, au prix du jour.","Moyen : la valeur peut baisser pendant plusieurs mois.","Frais de gestion chaque année, souvent des frais d’entrée.",1],
  "Actions à la Bourse (BRVM)":["Vente en quelques jours, mais au prix du moment.","Élevé : une action peut perdre une grande part de sa valeur, parfois longtemps.","Frais de courtage à l’achat et à la vente, droits de garde.",1]
};
var NOMS=Object.keys(PL);
var VERD={
  court:{"Compte d’épargne":["v-ok","Adapté : l’argent reste disponible et sûr jusqu’à votre date."],"Dépôt à terme":["v-mid","Seulement si l’échéance tombe avant votre date. Sinon, la sortie anticipée vous coûtera."],"Emprunt d’État":["v-mid","Seulement si son échéance tombe avant votre date. Sinon, il faudra revendre au prix du moment."],"OPCVM monétaire":["v-ok","Adapté si le retrait est rapide et les frais de sortie faibles. Vérifiez-les par écrit."],"OPCVM obligataire":["v-ko","Risqué sur moins d’un an : sa valeur peut baisser juste avant votre date."],"Actions à la Bourse (BRVM)":["v-ko","Non : sur moins d’un an, une baisse peut tomber le mois où vous avez besoin de l’argent."]},
  moyen:{"Compte d’épargne":["v-ok","Sûr et disponible. Le rendement est modeste, mais votre projet est protégé."],"Dépôt à terme":["v-ok","Bon réflexe : choisissez une échéance qui tombe juste avant votre date."],"Emprunt d’État":["v-ok","Adapté si son échéance tombe avant votre date et si vous le gardez jusqu’au bout."],"OPCVM monétaire":["v-ok","Adapté : peu de variations et un retrait rapide. Comparez les frais."],"OPCVM obligataire":["v-mid","Possible, mais une baisse peut tomber avant votre date. Prévoyez d’en sortir quelques mois avant."],"Actions à la Bourse (BRVM)":["v-ko","Trop risqué pour un argent dont vous avez besoin dans moins de trois ans."]},
  entre:{"Compte d’épargne":["v-mid","Sûr, mais sur trois à cinq ans l’inflation grignote une bonne part du gain."],"Dépôt à terme":["v-ok","Adapté : taux connu, échéance calée sur votre date."],"Emprunt d’État":["v-ok","Adapté : échéance connue, à garder jusqu’au bout."],"OPCVM monétaire":["v-mid","Sûr et disponible, mais le rendement peut rester faible sur cette durée."],"OPCVM obligataire":["v-mid","Possible si vous acceptez de petites baisses. Sortez-en au moins un an avant la date."],"Actions à la Bourse (BRVM)":["v-mid","Une petite part seulement, à sécuriser au moins un an avant votre date."]},
  long:{"Compte d’épargne":["v-mid","Sûr, mais sur plus de cinq ans, l’inflation peut manger presque tout le gain."],"Dépôt à terme":["v-ok","Adapté, et vous pouvez renouveler l’échéance."],"Emprunt d’État":["v-ok","Adapté : échéance connue, revenus réguliers."],"OPCVM monétaire":["v-mid","Sûr, mais peu rémunérateur sur une longue durée."],"OPCVM obligataire":["v-ok","Adapté si vous acceptez des variations en cours de route."],"Actions à la Bourse (BRVM)":["v-ok","Possible pour une part : sur plus de cinq ans, on peut accepter des variations. Sécurisez l’argent dans les deux dernières années."]}
};

window.ATELIER = {
  id: "placer-selon-horizon",
  titre: "Où placer une somme dont j’aurai besoin dans 6 mois, 2 ans ou 5 ans ?",
  h1: "Votre argent peut travailler, sans mettre votre projet en danger.",
  voix: "auto",
  question: {
    t: "Vous avez 800 000 F pour la rentrée, dans 8 mois. Un ami vous conseille des actions « qui montent fort ». Que faites-vous ?",
    r: [
      ["a", "J’achète : cela peut rapporter plus.", "C’est tentant, et c’est vrai que cela peut monter. Mais cela peut aussi baisser juste avant la rentrée. Cet atelier vous montre comment choisir selon la date.", false],
      ["b", "Je garde l’argent disponible et sûr jusqu’à la rentrée.", "C’est la règle de l’horizon : quand la date est proche, la disponibilité passe avant le rendement. On va voir ce que cela donne pour votre cas.", true]
    ]
  },
  chapitres: [
    { t: "Mon projet et ma date", acq: "Je connais mon horizon", desc: "Le projet, le montant, la date, et votre réserve à part.", e: [
      { t: "Mon projet", c: "Une somme pour un projet a déjà une mission. On la place pour la protéger, pas pour jouer avec.",
        w: { puces: { id:"ph_proj", k:"Pour quel projet ?", l:["Rentrée scolaire","Mariage","Apport pour un terrain ou un logement","Voyage","Matériel ou stock","Autre projet daté"] } },
        p: "Mon projet est choisi." },
      { t: "Le montant et la date", c: "Ce qui compte, c’est le mois où vous aurez besoin de l’argent. De là vient votre horizon.",
        w: { ex: "Moussa a 1 500 000 F pour l’apport d’un terrain. Il en aura besoin dans 26 mois : son horizon est de 1 à 3 ans.", c3: 1, champs: [ {id:"ph_mt", l:"Montant à placer (F)"}, {id:"ph_mm", l:"Mois du besoin (1 à 12)", ph:"9"}, {id:"ph_aa", l:"Année du besoin", ph:"2028"} ],
          v: function(D,H){ var h=hz(D,H); if(h==null) return ''; if(h<1) return '<div class="verdict v-mid">Cette date est déjà là. L’argent doit rester disponible, sans placement.</div>'; return '<div class="gros"><small>Votre horizon</small><b>'+h+' mois</b><p>Horizon : '+CAT[cat(h)]+'.'+(H.N(D.ph_mt)?' Montant : '+H.F(H.N(D.ph_mt))+'.':'')+'</p></div>'; } },
        p: "Mon montant et ma date sont écrits." },
      { t: "Ma réserve est à part", c: "Si un coup dur arrive, c’est la réserve qui paie, pas le projet. Sinon, le placement sera cassé en route.",
        w: { puces: { id:"ph_res", k:"Votre réserve de sécurité", l:["Elle existe déjà, ailleurs","Elle est en cours","Pas encore"] },
          v: function(D){ var R={"Elle existe déjà, ailleurs":["v-ok","Parfait : cette somme peut être placée pour son projet, et seulement pour lui."],"Elle est en cours":["v-mid","Continuez à la construire. Gardez une partie du projet bien disponible en attendant."],"Pas encore":["v-ko","Sans réserve, le premier coup dur viendra puiser ici. Commencez par un premier palier de réserve, à part."]}[D.ph_res]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "Je sais où en est ma réserve de sécurité." }
    ]},
    { t: "La règle de l’horizon", acq: "Je connais la règle de l’horizon", desc: "Plus la date est proche, plus l’argent doit être disponible.", e: [
      { t: "Trois horizons, trois réflexes", f: ["Moins d’un an : la disponibilité d’abord. L’argent doit pouvoir sortir vite, sans perte.", "De 1 à 3 ans : des placements à échéance connue, qui tombent avant votre date.", "Plus de 5 ans : on peut accepter des variations, et on sécurise à l’approche de la date."], c: "Ce n’est pas le placement qui est bon ou mauvais. C’est le placement face à votre date.",
        p: "Je connais les trois horizons." },
      { t: "À vous de jouer", c: "Trois situations d’ici. Pour chacune, quel est le bon réflexe ?",
        w: { quiz: [ ["Awa paie le mariage de sa sœur dans 5 mois", ["Disponibilité d’abord","Accepter des variations"], 0, "Cinq mois, c’est court : une baisse n’aurait pas le temps de se rattraper."], ["Koffi veut un apport dans 2 ans", ["Placement à échéance connue","Tout en actions"], 0, "Une échéance qui tombe avant la date protège le projet."], ["Fatou prépare les études de son fils dans 8 ans", ["On peut accepter des variations","Tout doit rester disponible"], 0, "Sur huit ans, une baisse a le temps de se rattraper. Elle sécurisera à l’approche."] ] },
        p: "J’ai répondu aux trois situations." },
      { t: "Ma date est-elle souple ?", c: "Une date fixe, comme une rentrée, ne pardonne pas. Une date qui peut glisser laisse un peu plus de marge.",
        w: { puces: { id:"ph_soup", k:"Votre date", l:["Elle est fixe","Elle peut glisser de quelques mois"] },
          v: function(D,H){ var h=hz(D,H), c=cat(h); if(!c||!D.ph_soup) return ''; var f=D.ph_soup==="Elle est fixe"; return '<div class="verdict '+(f&&c==='court'?'v-mid':'v-ok')+'">Votre horizon : '+h+' mois, soit '+CAT[c]+'. '+(f?'Date fixe : restez du côté prudent de la règle.':'Date souple : vous avez un peu de marge, sans changer de règle.')+'</div>'; } },
        p: "Je connais ma case dans la règle." }
    ]},
    { t: "Comparer sur votre cas", acq: "Je compare sur mon cas", desc: "Disponibilité, risque, frais, et la somme au terme.", e: [
      { t: "Six placements à la loupe", c: "Pour chaque placement, trois questions : quand puis-je récupérer l’argent, peut-il baisser, combien il me coûte.",
        w: { puces: { id:"ph_vu", k:"Touchez un placement pour le voir", l:NOMS },
          v: function(D,H){ var p=PL[D.ph_vu]; if(!p) return ''; var c=cat(hz(D,H)), V=c&&VERD[c][D.ph_vu]; return '<div class="gros"><small>'+H.esc(D.ph_vu)+'</small><p><strong>Disponibilité :</strong> '+p[0]+'<br><strong>Risque :</strong> '+p[1]+'<br><strong>Frais :</strong> '+p[2]+'</p></div>'+(V?'<div class="verdict '+V[0]+'">Pour votre horizon : '+V[1]+'</div>':''); } },
        p: "J’ai regardé les placements qui m’intéressent." },
      { t: "Ma somme au terme", c: "Demandez le taux par écrit, puis faites le calcul vous-même. Les chiffres ci-dessous ne sont que des exemples.",
        w: { ex: "Koffi place 1 200 000 F pendant 24 mois. Avec un taux d’exemple de 5 % par an, il gagne environ 123 000 F d’intérêts. Avec un impôt d’exemple de 10 %, il garde environ 110 700 F.", c3: 1, champs: [ {id:"ph_t", l:"Taux annoncé par an (%)", ph:"5"}, {id:"ph_imp", l:"Impôt sur les intérêts (%)", ph:"10"}, {id:"ph_fr", l:"Frais d’entrée (%)", ph:"0"} ],
          v: function(D,H){ var t=H.N(D.ph_t); if(!t) return ''; var r=terme(D,H,t,H.N(D.ph_fr)); if(!r) return ''; return '<div class="gros"><small>Au terme, dans '+r.h+' mois (estimation)</small><b>'+H.F(r.tot)+'</b><p>Intérêts nets : environ '+H.F(r.n)+' sur '+H.F(r.M)+' placés.'+(PL[D.ph_vu]&&PL[D.ph_vu][3]?' Attention : pour ce type de placement, le taux n’est pas garanti, la somme peut être plus basse.':'')+'</p></div>'; } },
        p: "Ma somme estimée au terme est calculée." },
      { t: "Et avec une autre offre ?", c: "Un taux un peu plus haut avec des frais plus lourds peut rapporter moins. Comparez sur votre durée.",
        w: { ex: "Sur 24 mois, 6 % avec 2 % de frais d’entrée rapporte moins que 5 % sans frais, sur la même somme.", champs: [ {id:"ph_t2", l:"Taux de l’autre offre (%)", ph:"6"}, {id:"ph_fr2", l:"Ses frais d’entrée (%)", ph:"2"} ],
          v: function(D,H){ var t1=H.N(D.ph_t), t2=H.N(D.ph_t2); if(!t1||!t2) return ''; var a=terme(D,H,t1,H.N(D.ph_fr)), b=terme(D,H,t2,H.N(D.ph_fr2)); if(!a||!b) return ''; var d=b.tot-a.tot; return '<div class="gros"><small>Autre offre, au terme</small><b>'+H.F(b.tot)+'</b><p>'+(Math.abs(d)<1?'Même résultat que la première offre.':d>0?'Environ '+H.F(d)+' de plus que la première offre.':'Environ '+H.F(-d)+' de moins que la première offre, malgré son taux.')+'</p></div>'; } },
        p: "J’ai comparé deux offres sur ma durée." }
    ]},
    { t: "Les pièges", acq: "Je repère les pièges", desc: "Argent bloqué, frais cachés, baisse au mauvais moment, inflation.", e: [
      { t: "Vrai ou piège ?", c: "Les pertes viennent rarement du placement lui-même. Elles viennent d’un mauvais calage avec la date.",
        w: { quiz: [ ["Un dépôt à terme de 3 ans pour un mariage dans 18 mois", ["Bon calage","Piège"], 1, "L’argent serait bloqué au-delà de la date. Sortir avant coûte souvent une pénalité."], ["Un placement « garanti » à 30 % par an, sans risque", ["Bonne affaire","Arnaque probable"], 1, "Un rendement garanti trop beau est le signe le plus courant d’une arnaque."], ["Garder des actions jusqu’à la veille de la rentrée", ["Prudent","Risqué"], 1, "Une baisse peut tomber juste avant la date. On sécurise bien avant."] ] },
        p: "J’ai repéré les trois pièges." },
      { t: "L’inflation qui grignote", c: "Si les prix montent plus vite que votre placement, votre somme achète moins au terme. Faites le test avec un ordre de grandeur.",
        w: { ex: "Si les prix montent de 3 % par an et que votre placement rapporte 2 % net, vous perdez un peu de pouvoir d’achat chaque année.", champs: [ {id:"ph_inf", l:"Hausse des prix par an (%, ordre de grandeur)", ph:"3"} ],
          v: function(D,H){ var t=H.N(D.ph_t), i=H.N(D.ph_inf); if(!t||!i) return ''; var r=terme(D,H,t,H.N(D.ph_fr)); if(!r) return ''; var reel=r.tot/Math.pow(1+i/100,r.h/12), ok=reel>=r.M; return '<div class="gros"><small>Votre somme au terme, en prix d’aujourd’hui</small><b>'+H.F(reel)+'</b><p>'+(ok?'Votre placement fait au moins aussi bien que la hausse des prix.':'Votre placement ne suit pas la hausse des prix : au terme, votre somme achètera moins qu’aujourd’hui.')+'</p></div>'; } },
        p: "J’ai mesuré l’effet de l’inflation." },
      { t: "Avant de signer", f: ["L’échéance tombe avant ma date, jamais après.", "J’ai les frais de sortie anticipée par écrit.", "L’établissement est agréé : je l’ai vérifié.", "Si le placement peut baisser, je sais quand je le sécurise."], c: "Quatre vérifications, et vous signez l’esprit tranquille.",
        p: "Je connais mes vérifications avant de signer." }
    ]},
    { t: "Décider", acq: "Je décide et j’écris mon choix", desc: "Un verdict pour votre horizon, puis votre choix écrit.", e: [
      { t: "Mon verdict", c: "Choisissez le placement que vous envisagez. Le verdict tient compte de votre horizon.",
        w: { puces: [ { id:"ph_choix", k:"Le placement que j’envisage", l:NOMS }, { id:"ph_ech", k:"Comment je le répartis", l:["Tout au même endroit","En deux parts"] } ],
          v: function(D,H){ var c=cat(hz(D,H)); if(!c) return D.ph_choix?'<div class="verdict v-mid">Écrivez d’abord votre date au chapitre 1 : le verdict en dépend.</div>':''; var V=VERD[c][D.ph_choix]; if(!V) return ''; return '<div class="verdict '+V[0]+'">'+V[1]+'</div>'+(D.ph_ech==="En deux parts"?'<p class="exemple"><b>Exemple :</b> une part disponible pour les dépenses qui arrivent avant la date (acompte, réservation), le reste à échéance connue.</p>':''); } },
        p: "J’ai un verdict pour mon placement." },
      { t: "Mon choix écrit", c: "Un choix écrit résiste mieux aux conseils de dernière minute. Fixez aussi une date pour le revoir.",
        w: { champs: [ {id:"ph_ecrit", l:"Mon choix, en une phrase", type:"area", ph:"Je place 800 000 F sur un compte d’épargne séparé jusqu’à la rentrée de septembre."}, {id:"ph_revue", l:"Je le revois le", type:"txt", ph:"1er mars"} ] },
        p: "Mon choix et ma date de revue sont écrits." }
    ]}
  ],
  fin: {
    k: "Ma fiche placement selon l’horizon", titre: "Votre somme a un plan jusqu’à sa date",
    fiche: [
      ["Mon projet", function(D){ return D.ph_proj||''; }],
      ["Montant", function(D,H){ return H.N(D.ph_mt)?H.F(H.N(D.ph_mt)):''; }],
      ["Date et horizon", function(D,H){ var h=hz(D,H); return h!=null&&h>0?MOIS[H.N(D.ph_mm)-1]+' '+H.N(D.ph_aa)+', dans '+h+' mois':''; }],
      ["Réserve de sécurité", function(D){ return D.ph_res||''; }],
      ["Placement choisi", function(D){ return D.ph_choix?D.ph_choix+(D.ph_ech?' · '+D.ph_ech.toLowerCase():''):''; }],
      ["Somme estimée au terme", function(D,H){ var t=H.N(D.ph_t), r=t?terme(D,H,t,H.N(D.ph_fr)):null; return r?'environ '+H.F(r.tot)+' (taux saisi : '+t+' %)':''; }],
      ["Mon choix écrit", function(D){ return D.ph_ecrit||''; }],
      ["Date de revue", function(D){ return D.ph_revue||''; }]
    ],
    suite: { t: "Les placements expliqués", p: "Votre choix est écrit ? Cet atelier détaille chaque placement : comment il fonctionne, ce qu’il coûte, et les questions à poser avant de signer.", lien: "atelier-placements-expliques.html", b: "Ouvrir l’atelier" }
  }
};
})();
