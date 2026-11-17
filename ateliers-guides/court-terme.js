/* Atelier guidé · Placements à court terme : moins de risque, mais pour quel objectif ? (17 nov. 2026)
   Offres A/B et taux : exercices. Aucun chiffre d'inflation mensuel 2026 cité (publications divergentes).
   Résultat : « Ma comparaison de deux offres de court terme ». */
window.ATELIER = {
  id: "court-terme",
  titre: "Placements à court terme : moins de risque, mais pour quel objectif ?",
  h1: "Faire travailler un argent qui attend, sans manquer la date.",
  voix: "auto",
  question: {
    t: "Vous devez payer 600 000 F de frais scolaires dans huit mois. Que faites-vous de cette somme d’ici là ?",
    r: [
      ["a", "Je cherche le taux le plus élevé.", "Le taux compte, mais la date de la rentrée compte plus. Si l’argent n’est pas là à temps, quelques milliers de francs ne compenseront pas le problème.", false],
      ["b", "Je cherche ce qui sera disponible avant la rentrée, puis je compare.", "C’est la bonne mission : être là dans huit mois. Cet atelier vous apprend à comparer les offres dans cet ordre.", true]
    ]
  },
  chapitres: [
    { t: "Court, par rapport à quoi ?", acq: "Je compare un placement à la date de mon besoin", desc: "« Court terme » se mesure à votre projet, pas à la publicité.", e: [
      { t: "« Court terme » veut dire court par rapport à votre projet", c: "Un placement de douze mois paraît court sur une publicité. Il est trop long pour Koffi si la rentrée arrive dans huit mois et qu’aucune sortie satisfaisante n’est prévue avant l’échéance. Il écrit deux dates, le jour où il place et le jour où il dépensera, et ajoute une marge pour les démarches de retrait.",
        f: ["Loyer du mois prochain : dans quelques semaines. La somme est-elle immédiatement accessible ?", "Frais scolaires : dans huit mois. Sera-t-elle disponible avant la rentrée ?", "Projet professionnel : dans trois ans. Quelles options conviennent à cette durée ?"],
        w: { consignes: 1, k: "Vos dates", champs: [ {id:"ct_besoin", l:"J’aurai besoin de l’argent dans (mois)"}, {id:"ct_marge", l:"Marge pour les démarches (mois)", ph:"1"}, {id:"ct_duree", l:"Durée du placement proposé (mois)"} ],
          v: function(D,H){ var b=H.N(D.ct_besoin), m=H.N(D.ct_marge), d=H.N(D.ct_duree); if(!b||!d) return ''; var lim=b-m; return d<=lim?'<div class="verdict v-ok">Le placement se termine '+(lim-d)+' mois avant votre limite. Il est compatible avec votre date.</div>':'<div class="verdict v-ko">Le placement dure '+(d-lim)+' mois de trop. Sauf sortie anticipée claire et peu coûteuse, il ne convient pas à cette somme.</div>'; } },
        p: "Je mesure la durée d’un placement à la date de mon besoin." },
      { t: "Risque réduit ne veut pas dire risque absent", c: "Un dépôt à terme, un bon du Trésor et une part de fonds ne fonctionnent pas de la même façon. Une offre fictive rapporte 3 % en un an après frais : 18 000 F sur 600 000 F. Utile, mais inutile pour Koffi s’il ne peut récupérer l’argent qu’après la rentrée.",
        w: { puces: { id:"ct_risques", k:"Pour l’offre que j’étudie, je connais…", m:1, l:["Le risque de remboursement : qui doit me rendre l’argent ?","Le risque de sortie : puis-je récupérer plus tôt, à quel coût ?","Le risque de prix : si je dois vendre un titre, combien en tirer ?","Le risque de pouvoir d’achat : les prix auront-ils monté ?"] },
          v: function(D){ var n=(D.ct_risques||[]).length; if(!n) return ''; return n===4?'<div class="verdict v-ok">Vous connaissez les quatre risques. Le taux n’est qu’une partie de la réponse.</div>':'<div class="verdict v-ko">'+(4-n)+' risque'+(4-n>1?'s':'')+' encore inconnu'+(4-n>1?'s':'')+'. Demandez avant de signer.</div>'; } },
        p: "Je connais les quatre risques d’un placement « sans risque »." }
    ]},
    { t: "Ce que coûte la tranquillité", acq: "Je calcule le gain réel et le prix de la souplesse", desc: "Des francs gagnés, et ce qu’ils permettent d’acheter. La souplesse a un prix.", e: [
      { t: "Combien reste-t-il après la hausse des prix ?", c: "Hypothèse d’exercice : un placement rapporte 3 % sur un an, et les prix augmentent de 2 % sur la même année. Le gain de pouvoir d’achat est d’environ 1 %. Cela ne rend pas le placement inutile : cela distingue les francs gagnés de ce qu’ils achèteront.",
        w: { k: "Votre calcul", c3: 1, champs: [ {id:"ct_m", l:"Somme placée (F)"}, {id:"ct_r", l:"Rendement après frais (%)"}, {id:"ct_i", l:"Hausse des prix (%)"} ],
          v: function(D,H){ var m=H.N(D.ct_m), r=parseFloat(String(D.ct_r||'').replace(',','.')), i=parseFloat(String(D.ct_i||'').replace(',','.')); if(!m||isNaN(r)||isNaN(i)) return ''; var g=Math.round(m*r/100), re=((1+r/100)/(1+i/100)-1)*100; return '<div class="gros"><small>Gain en francs · en pouvoir d’achat</small><b>'+H.F(g)+' · '+(re>=0?'+':'')+re.toFixed(1).replace('.',',')+' %</b><p>Votre propre panier de dépenses peut évoluer autrement que la moyenne.</p></div>'; } },
        p: "Je distingue les francs gagnés de ce qu’ils achèteront." },
      { t: "Le coût caché de la tranquillité", c: "Koffi trouve deux solutions compatibles avec la rentrée. A est facilement accessible et rapporte 8 000 F dans l’exemple. B est moins souple et pourrait rapporter 18 000 F. Les 10 000 F d’écart sont le prix de la souplesse. Il ne s’agit pas d’être « trop prudent » : il s’agit de savoir ce qu’on achète avec le rendement auquel on renonce.",
        w: { k: "Vos deux solutions", c3: 1, champs: [ {id:"ct_ga", l:"Gain de la solution souple (F)"}, {id:"ct_gb", l:"Gain de la solution moins souple (F)"} ],
          puces: { id:"ct_cal", k:"La date ou le montant de ma dépense peut-il changer ?", l:["Oui, ça peut bouger","Non, c’est certain et ma réserve est constituée"] },
          v: function(D,H){ var a=H.N(D.ct_ga), b=H.N(D.ct_gb); if(!a&&!b) return ''; var h='<div class="gros"><small>Le prix de la souplesse</small><b>'+H.F(Math.abs(b-a))+'</b></div>'; if(D.ct_cal) h+='<div class="verdict v-ok">'+(D.ct_cal.indexOf('Oui')===0?'La souplesse vaut sans doute cet écart pour vous.':'Avec un calendrier certain et une réserve en place, la solution moins souple peut se défendre.')+'</div>'; return h; } },
        p: "Je sais ce que me coûte la souplesse, et si elle vaut ce prix." }
    ]},
    { t: "Comparer et décider", acq: "J’ai comparé deux offres et écrit ma décision", desc: "Cinq questions par offre. Éliminer ce dont on ne comprend pas la sortie.", e: [
      { t: "Offre A", c: "Pour comparer deux placements de court terme, Koffi ne relève plus seulement leur taux. Remplissez la fiche pour une première offre.",
        w: { k: "Offre A", champs: [ {id:"ct_a_qui", l:"Qui détient ou doit rembourser mon argent ?", type:"txt"}, {id:"ct_a_dep", l:"Somme à verser au départ", type:"txt"}, {id:"ct_a_date", l:"Date à laquelle je récupère mon argent", type:"txt"}, {id:"ct_a_tot", l:"Si j’en ai besoin plus tôt", type:"txt"}, {id:"ct_a_net", l:"Ce que je recevrai après frais", type:"txt"} ] },
        p: "L’offre A est décrite." },
      { t: "Offre B, et ma décision", c: "Même grille pour l’offre B. Éliminez toute offre dont vous ne comprenez pas les conditions de sortie. Un placement de court terme a réussi sa mission quand il vous aide à tenir votre échéance.",
        w: { k: "Offre B", champs: [ {id:"ct_b_qui", l:"Qui détient ou doit rembourser mon argent ?", type:"txt"}, {id:"ct_b_dep", l:"Somme à verser au départ", type:"txt"}, {id:"ct_b_date", l:"Date à laquelle je récupère mon argent", type:"txt"}, {id:"ct_b_tot", l:"Si j’en ai besoin plus tôt", type:"txt"}, {id:"ct_b_net", l:"Ce que je recevrai après frais", type:"txt"}, {id:"ct_phrase", l:"Cet argent servira à… le… Pour cette somme, je privilégie… parce que…", type:"area"} ],
          v: function(D){ return D.ct_phrase?'<div class="verdict v-ok">Votre décision est écrite dans votre fiche.</div>':''; } },
        p: "Ma décision est écrite, avec sa date." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Mon argent qui attend »", titre: "Le rendement compte, la disponibilité aussi",
    fiche: [
      ["Mon besoin", function(D,H){ var b=H.N(D.ct_besoin); return b?'dans '+b+' mois':''; }],
      ["Gain réel", function(D,H){ var r=parseFloat(String(D.ct_r||'').replace(',','.')), i=parseFloat(String(D.ct_i||'').replace(',','.')); return isNaN(r)||isNaN(i)?'':(((1+r/100)/(1+i/100)-1)*100).toFixed(1).replace('.',',')+' % en pouvoir d’achat'; }],
      ["Prix de la souplesse", function(D,H){ var a=H.N(D.ct_ga), b=H.N(D.ct_gb); return a||b?H.F(Math.abs(b-a)):''; }],
      ["Offre A", function(D){ return [D.ct_a_qui,D.ct_a_date,D.ct_a_net].filter(Boolean).join(' · '); }],
      ["Offre B", function(D){ return [D.ct_b_qui,D.ct_b_date,D.ct_b_net].filter(Boolean).join(' · '); }],
      ["Ma décision", function(D){ return D.ct_phrase||''; }]
    ],
    suite: { t: "Les bons du Trésor, de A à Z", p: "Le bon du Trésor est une des options de court terme. L’atelier suivant vous apprend à lire une émission.", lien: "atelier-bons-du-tresor.html", b: "Ouvrir l’atelier" }
  }
};
