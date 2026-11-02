/* Atelier guidé · Ma réserve de sécurité */
window.ATELIER = {
  id: "reserve-securite",
  titre: "Ma réserve de sécurité",
  h1: "Le premier coup dur ne doit pas devenir une dette.",
  voix: false,
  question: {
    t: "Une urgence de santé vous coûte 150 000 F demain. Où prenez-vous l’argent ?",
    r: [
      ["a", "J’emprunte à un proche.", "C’est souvent ce qui arrive. Mais chaque urgence devient alors une dette et une gêne. La réserve sert à ne plus en arriver là.", false],
      ["b", "Dans une réserve prévue pour cela.", "C’est le but de cet atelier : avoir cette somme de côté, disponible, sans demander à personne.", true],
      ["c", "Je prends ma tontine en avance.", "Possible, mais vous devrez les tours suivants : c’est une dette déguisée. La réserve, elle, ne coûte rien.", false],
      ["d", "Je vends ce que j’ai.", "Vendre dans l’urgence, c’est souvent vendre à perte. La réserve vous évite de vendre au mauvais moment.", false]
    ]
  },
  chapitres: [
    { t: "À quoi elle sert", acq: "Je sais à quoi elle sert", desc: "Ce qu’est une réserve, et ce qu’elle n’est pas.", e: [
      { t: "Réserve, épargne ou tontine ?", c: "La réserve ne sert qu’aux urgences. Elle ne finance ni un projet, ni une envie. C’est ce qui la rend solide.",
        w: { quiz: [ ["L’argent de la tontine que je recevrai en mars", ["C’est ma réserve","Ce n’est pas ma réserve"], 1, "Il arrive à une date fixée par le groupe, pas le jour de l’urgence."], ["L’argent mis de côté pour acheter un terrain", ["C’est ma réserve","Ce n’est pas ma réserve"], 1, "Un projet a sa propre épargne. Sinon, la première urgence mange le projet."], ["Une somme disponible tout de suite, gardée pour les coups durs", ["C’est ma réserve","Ce n’est pas ma réserve"], 0, "Exactement : disponible, et réservée aux urgences."] ] },
        p: "Je sais distinguer ma réserve du reste." },
      { t: "Les coups durs d’ici", c: "Les urgences ne préviennent pas. Mais on sait lesquelles reviennent le plus souvent autour de nous.",
        w: { puces: { id:"cd_l", k:"Ceux qui vous concernent", m:1, l:["Santé","Perte de revenu","Funérailles","Panne ou accident","Urgence d’un proche","Réparation du logement"] } },
        p: "J’ai repéré les coups durs les plus probables pour moi." }
    ]},
    { t: "Combien", acq: "Je connais mon montant", desc: "Vos dépenses essentielles, multipliées par le bon nombre de mois.", e: [
      { t: "Mes dépenses essentielles", c: "On ne compte que l’essentiel : ce qu’il faut pour vivre si le revenu s’arrêtait.",
        w: { ex: "Awa dépense 180 000 F par mois pour l’essentiel. Sa réserve minimale est de 3 × 180 000 = 540 000 F.", k: "Vos dépenses essentielles d’un mois", c3: 1, champs: [ {id:"r_log", l:"Logement"}, {id:"r_nou", l:"Nourriture"}, {id:"r_tra", l:"Transport"}, {id:"r_eco", l:"École"}, {id:"r_san", l:"Santé"}, {id:"r_sol", l:"Solidarité"} ],
          v: function(D,H){ var t=["r_log","r_nou","r_tra","r_eco","r_san","r_sol"].reduce(function(s,k){return s+H.N(D[k]);},0); D.r_mois=t; return t?'<div class="gros"><small>Vos dépenses essentielles</small><b>'+H.F(t)+' par mois</b></div>':''; } },
        p: "Mes dépenses essentielles sont écrites." },
      { t: "Combien de mois pour moi ?", c: "Repère EFA : trois mois quand le revenu est stable, six mois quand il est irrégulier ou quand toute la famille dépend de vous.",
        w: { puces: { id:"r_prof", k:"Votre situation", l:["Revenu stable","Revenu irrégulier","Seul revenu du foyer"] },
          v: function(D,H){ var m=H.N(D.r_mois); if(!m||!D.r_prof) return ''; var k=D.r_prof==="Revenu stable"?3:6; D.r_cible=m*k; return '<div class="gros"><small>Votre réserve cible ('+k+' mois)</small><b>'+H.F(m*k)+'</b><p>C’est l’objectif final. On va l’atteindre par paliers.</p></div>'; } },
        p: "Je connais le montant de ma réserve." }
    ]},
    { t: "Où la garder", acq: "Je sais où la garder", desc: "Disponible, sûre et séparée de l’argent du quotidien.", e: [
      { t: "Les trois règles", f: ["Disponible : je peux la retirer en quelques jours, sans pénalité lourde.", "Sûre : dans un établissement agréé, pas dans un placement qui peut baisser.", "Séparée : sur un compte ou un porte-monnaie que je ne touche pas pour le quotidien."], c: "Une réserve mélangée avec l’argent du mois finit toujours par être dépensée.",
        p: "Je connais les trois règles." },
      { t: "Comparer les endroits", c: "Il n’y a pas d’endroit parfait. Il y a celui qui respecte les trois règles pour vous.",
        w: { puces: { id:"r_ou", k:"Où pensez-vous la garder ?", l:["Compte d’épargne","Dépôt à terme","Mobile money séparé","Caisse ou microfinance agréée","À la maison","En Bourse"] },
          v: function(D){ var R={"Compte d’épargne":["v-ok","Disponible, sûr et séparé : un très bon choix."],"Dépôt à terme":["v-mid","Sûr, mais l’argent est bloqué jusqu’à l’échéance. Gardez au moins un mois de réserve ailleurs."],"Mobile money séparé":["v-mid","Disponible et pratique. Gardez-le sur un porte-monnaie que vous n’utilisez pas au quotidien."],"Caisse ou microfinance agréée":["v-ok","Bon choix si l’établissement est agréé et si le retrait est rapide."],"À la maison":["v-ko","Trop facile à dépenser, et exposé au vol ou au feu. À éviter pour la plus grosse partie."],"En Bourse":["v-ko","Non : une action peut baisser juste le jour où vous avez besoin de l’argent."]}[D.r_ou]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai choisi où garder ma réserve." }
    ]},
    { t: "La construire", acq: "Je la construis pas à pas", desc: "Un premier palier, un versement fixe, des coups d’accélérateur.", e: [
      { t: "Un premier palier", c: "Viser six mois d’un coup décourage. Le premier palier, c’est un mois de dépenses essentielles.",
        w: { champs: [ {id:"r_dej", l:"Déjà de côté (F)"}, {id:"r_vers", l:"Ce que je verse chaque mois (F)"} ],
          v: function(D,H){ var m=H.N(D.r_mois), v=H.N(D.r_vers), d=H.N(D.r_dej); if(!m||!v) return ''; var p1=Math.max(0,Math.ceil((m-d)/v)), c=H.N(D.r_cible), pc=c?Math.max(0,Math.ceil((c-d)/v)):0; return '<div class="gros"><small>Premier palier (1 mois)</small><b>'+(p1?'dans '+p1+' mois':'atteint')+'</b><p>'+(c?'Réserve complète dans environ '+pc+' mois.':'')+'</p></div>'; } },
        p: "Mon palier et mon versement sont fixés." },
      { t: "Le jour de la paie", f: ["Je programme le versement le jour de la paie, avant les autres dépenses.", "Je l’envoie sur le compte séparé de la réserve.", "Je ne change pas le montant sans l’avoir décidé à l’avance."], c: "Ce qui n’est pas versé le jour de la paie ne le sera pas à la fin du mois.",
        p: "Mon versement automatique est prévu." },
      { t: "Accélérer", c: "Une prime, un tour de tontine, un remboursement reçu : décidez à l’avance quelle part va à la réserve.",
        w: { champs: [ {id:"r_acc", l:"Part de chaque rentrée exceptionnelle qui va à la réserve (%)", ph:"30"} ] },
        p: "Je sais ce que je verse quand une somme exceptionnelle arrive." }
    ]},
    { t: "La protéger", acq: "Je la protège", desc: "Savoir quand l’utiliser, la reconstituer, et dire non.", e: [
      { t: "Urgence ou envie ?", c: "Une urgence ne peut pas attendre et n’était pas prévue. Tout le reste attend.",
        w: { quiz: [ ["Une hospitalisation", ["Urgence","Peut attendre"], 0, "C’est exactement son rôle."], ["Une promotion sur un téléphone", ["Urgence","Peut attendre"], 1, "Une bonne affaire n’est pas une urgence."], ["La rentrée scolaire", ["Urgence","Peut attendre"], 1, "Elle revient chaque année : elle a sa propre épargne, pas la réserve."] ] },
        p: "Je sais quand utiliser ma réserve." },
      { t: "Après l’urgence", f: ["J’écris ce que j’ai pris et pourquoi.", "Je reprends mes versements dès le mois suivant.", "Je reviens au montant cible avant tout nouveau projet."], c: "Utiliser la réserve n’est pas un échec. C’est la preuve qu’elle sert. Ensuite, on la reconstitue.",
        p: "Je sais comment la reconstituer." },
      { t: "Dire non sans fâcher", c: "Votre réserve protège aussi votre famille : sans elle, c’est vous qui deviendriez l’urgence.",
        w: { champs: [ {id:"r_non", l:"Ma phrase quand on me demande ma réserve", type:"area", ph:"Cet argent est réservé aux urgences de la maison. Je peux t’aider autrement : …"} ] },
        p: "Ma phrase est prête." }
    ]}
  ],
  fin: {
    k: "Ma fiche réserve de sécurité", titre: "Votre réserve a un plan",
    fiche: [
      ["Dépenses essentielles", function(D,H){ return H.N(D.r_mois)?H.F(H.N(D.r_mois))+' par mois':''; }],
      ["Ma situation", function(D){ return D.r_prof||''; }],
      ["Réserve cible", function(D,H){ return H.N(D.r_cible)?H.F(H.N(D.r_cible)):''; }],
      ["Où je la garde", function(D){ return D.r_ou||''; }],
      ["Versement mensuel", function(D,H){ return H.N(D.r_vers)?H.F(H.N(D.r_vers)):''; }],
      ["Part des rentrées exceptionnelles", function(D,H){ return H.N(D.r_acc)?H.N(D.r_acc)+' %':''; }],
      ["Coups durs repérés", function(D){ return (D.cd_l||[]).join(', '); }]
    ],
    suite: { t: "Mes premiers pas en Bourse", p: "Votre réserve est en place ? Le cours suivant vérifie le reste de votre situation, puis vous apprend à lire le marché.", lien: "premiers-pas-bourse.html", b: "Ouvrir le cours" }
  }
};
