/* Atelier guidé · Construire sa stratégie d'investissement (17 nov. 2026)
   Passer de « quel titre acheter ? » à « quelle mission pour mon argent, avec quelles règles, sur quelle durée ? ».
   Niveau intermédiaire. Montants et personnages : exemples pédagogiques. Résultat : « Ma stratégie sur une page ». */
window.ATELIER = {
  id: "strategie-investissement",
  titre: "Construire sa stratégie d’investissement",
  h1: "Une mission pour chaque somme, et vos règles sur une page.",
  voix: "auto",
  question: {
    t: "Vous avez 500 000 F sur votre compte. Par quoi commencez-vous ?",
    r: [
      ["a", "Je cherche quelle action acheter.", "C’est le réflexe le plus fréquent. Mais une partie de cette somme a peut-être déjà une mission : loyer, imprévu, projet proche. Le chapitre 1 commence par là.", false],
      ["b", "Je regarde d’abord à quoi doit servir cet argent, et quand.", "C’est le point de départ d’une stratégie. Vous allez donner une mission à chaque somme, puis écrire vos règles.", true]
    ]
  },
  chapitres: [
    { t: "Une mission pour chaque somme", acq: "J’ai séparé l’argent que je peux investir", desc: "Le solde de votre compte n’est pas la somme à investir. Chaque projet a sa date.", e: [
      { t: "Avant de choisir un titre, donnez une mission à votre argent", c: "Koffi a 500 000 F et pense à une action qui monte. Mais une partie de cet argent doit peut-être payer le loyer, une dépense familiale ou un projet de l’an prochain. La placer sur un actif qui peut baisser l’obligerait à vendre au mauvais moment.",
        w: { ex: "Sur 500 000 F, Koffi garde 200 000 F pour la vie courante et 150 000 F de réserve pour les imprévus. Il peut investir 150 000 F.", k: "Votre répartition", c3: 1, champs: [ {id:"st_total", l:"Ce que j’ai aujourd’hui (F)"}, {id:"st_vie", l:"Pour la vie courante (F)"}, {id:"st_res", l:"Ma réserve pour les imprévus (F)"} ],
          v: function(D,H){ var t=H.N(D.st_total); if(!t) return ''; var i=t-H.N(D.st_vie)-H.N(D.st_res); return i>0?'<div class="gros"><small>Ce que je peux investir sans toucher à mes besoins proches</small><b>'+H.F(i)+'</b><p>Pas besoin d’un montant impressionnant. Il faut surtout être honnête sur ce que vous pourrez laisser investi.</p></div>':'<div class="verdict v-ko">Rien ne reste à investir pour l’instant. Construire votre réserve est déjà une étape de votre stratégie.</div>'; } },
        p: "Je sais quelle somme je peux investir." },
      { t: "Trois horizons, trois façons de décider", c: "Fatou épargne pour une rentrée dans huit mois, un projet professionnel dans trois ans et sa retraite dans vingt ans. Si elle mélange ces sommes, une baisse de marché devient tout de suite un problème de scolarité.",
        f: ["Court terme : l’essentiel est d’avoir la somme prévue au moment prévu.", "Moyen terme : des placements compatibles avec la date du projet, avec une marge si le calendrier change.", "Long terme : on peut accepter plus de variations, parce qu’on n’a pas besoin de retirer l’argent au premier mouvement."],
        w: { consignes: 1, k: "Mes trois prochains projets, avec leur date", champs: [ {id:"st_p1", l:"Projet le plus proche", type:"txt", ph:"Rentrée, dans 8 mois"}, {id:"st_p2", l:"Projet suivant", type:"txt", ph:"Atelier de couture, dans 3 ans"}, {id:"st_p3", l:"Projet lointain", type:"txt", ph:"Retraite, dans 20 ans"} ],
          quiz: [ ["Lequel de ces projets ne peut pas attendre une reprise du marché ?", ["Le plus lointain","Le plus proche"], 1, "Si le marché baisse juste avant votre date, le projet proche n’a pas le temps d’attendre. Son argent doit rester disponible."] ] },
        p: "Chaque projet a sa date et son dossier." }
    ]},
    { t: "La baisse que je peux traverser", acq: "J’ai testé mon plan face à une forte baisse", desc: "Pouvoir attendre, et tenir sa décision pendant une baisse : deux questions différentes.", e: [
      { t: "Quelle baisse pouvez-vous traverser ?", c: "Mariam se dit investisseuse de long terme. Puis son portefeuille fictif passe de 1 000 000 F à 700 000 F, alors qu’elle doit bientôt payer 400 000 F de formation. Testez votre plan avant d’investir : imaginez une baisse de 30 %, sans supposer un rebond rapide.",
        w: { k: "Votre test", champs: [ {id:"st_inv", l:"Somme que j’envisage d’investir (F)"}, {id:"st_b12", l:"Ce dont j’aurai besoin dans les 12 prochains mois, pris sur cette somme (F)"} ],
          puces: { id:"st_reac", k:"Après une baisse de 30 %, je ferais plutôt…", l:["J’attends, je n’ai pas besoin de cet argent","Je vends une partie pour une dépense prévue","Je constate que la somme est trop importante pour moi"] },
          v: function(D,H){ var i=H.N(D.st_inv); if(!i) return ''; var a=Math.round(i*0.7), b=H.N(D.st_b12);
            return '<div class="gros"><small>Valeur après une baisse de 30 %</small><b>'+H.F(a)+'</b><p>'+(b?(b>=a?'Votre besoin de '+H.F(b)+' ne serait plus couvert. Cet argent n’a pas sa place dans un placement qui peut baisser.':'Vous pourriez payer '+H.F(b)+' en vendant au mauvais moment. Mieux vaut garder cette somme à part, disponible.'):'Ce test ne prédit pas la prochaine baisse. Il montre si votre plan tient avec votre vie réelle.')+'</p></div>'; } },
        p: "Je sais quelle somme doit rester disponible même si le marché baisse." }
    ]},
    { t: "Construire mon portefeuille", acq: "Mon portefeuille est organisé par missions et ses risques sont répartis", desc: "Les familles d’actifs avant les noms. Compter ses risques, pas ses titres.", e: [
      { t: "Choisissez les familles d’actifs avant les noms", c: "Serge suit trois sociétés à la BRVM chaque jour. Il n’a pas encore décidé quelle place donner aux actions dans l’ensemble de son argent. Il dessine d’abord son portefeuille par missions, puis seulement il choisit les produits.",
        f: ["Les sommes pour les besoins proches ont une mission : rester disponibles.", "Les titres de dette suivent des règles de paiement et de remboursement, avec leurs propres risques.", "Les actions sont une part d’entreprise : leur valeur et les dividendes éventuels dépendent de son activité et du marché.", "Les fonds donnent accès à un ensemble d’actifs, selon des règles de gestion.", "Il n’existe pas de pourcentage valable pour tout le monde : tout dépend de la date à laquelle l’argent servira."],
        w: { consignes: 1, k: "Le rôle de chaque partie de mon portefeuille", champs: [ {id:"st_r1", l:"Ce que je dois pouvoir mobiliser", type:"txt", ph:"Réserve d’imprévus, 3 mois de dépenses"}, {id:"st_r2", l:"Ce qui sert un projet daté", type:"txt", ph:"Projet dans 3 ans"}, {id:"st_r3", l:"Ce qui est investi à long terme", type:"txt", ph:"Retraite, études des enfants"} ],
          v: function(D){ return D.st_r1&&D.st_r3?'<div class="verdict v-ok">Votre portefeuille a ses pièces. Les noms des titres viendront ensuite, pièce par pièce.</div>':''; } },
        p: "Le rôle de chaque partie de mon portefeuille est écrit." },
      { t: "Cinq lignes ne font pas toujours une diversification", c: "Koffi détient cinq actions et se dit diversifié. Mariam regarde sa liste : les cinq sociétés sont du même secteur et pourraient souffrir du même événement. Diversifier, c’est examiner ce qui peut faire baisser vos placements ensemble.",
        f: ["Qu’est-ce qui fait gagner ou perdre ce placement ?", "Ce risque est-il déjà présent ailleurs dans mon portefeuille ?", "S’il se réalise, quelle part de mon argent sera touchée ?", "Lors d’un choc important, plusieurs actifs peuvent baisser en même temps. Diversifier réduit une dépendance excessive. Cela ne promet pas d’éviter toute perte."],
        w: { consignes: 1, quiz: [ ["Trois fonds qui détiennent presque les mêmes actifs, est-ce diversifié ?", ["Oui, ce sont trois produits","Non, c’est le même risque trois fois"], 1, "La bonne question n’est pas combien de titres j’ai, mais à combien de risques différents mon argent est exposé."] ],
          champs: [ {id:"st_div", l:"Deux de mes placements dépendent-ils du même secteur, de la même entreprise ou de la même source de revenus ?", type:"area", ph:"Oui : mes deux actions sont des banques…"} ] },
        p: "Je compte mes risques, pas seulement mes lignes." }
    ]},
    { t: "Ma stratégie sur une page", acq: "J’ai écrit mes règles et ma première décision", desc: "Des règles écrites avant que le marché ne décide pour vous. Un bilan daté.", e: [
      { t: "Écrivez vos règles avant que le marché ne décide pour vous", c: "Une action monte vite : Serge veut acheter. Une autre baisse : il veut vendre. Il écrit ses règles avant le prochain ordre. Elles ne l’empêchent pas de changer d’avis : elles lui demandent d’expliquer ce qui a changé. L’AMF-UMOA recommande aussi de lire les documents avant de souscrire, puis les avis d’opéré et les relevés.",
        w: { k: "Mes cinq règles", champs: [ {id:"st_g1", l:"1. Pourquoi j’investis : projet, somme, durée", type:"area"}, {id:"st_g2", l:"2. Ce que j’achète : les familles que je comprends, et leur place", type:"area"}, {id:"st_g3", l:"3. Ce que je vérifie avant d’acheter : prix, frais, documents, risque principal", type:"area"}, {id:"st_g4", l:"4. Quand je fais le point", type:"txt", ph:"tous les 6 mois, et à chaque changement important"}, {id:"st_g5", l:"5. Pourquoi je pourrais vendre", type:"area", ph:"mon projet arrive, mes besoins changent, les raisons de l’achat ne tiennent plus"} ],
          v: function(D){ var n=['st_g1','st_g2','st_g3','st_g4','st_g5'].filter(function(k){return D[k];}).length; if(!n) return ''; return n===5?'<div class="verdict v-ok">Vos cinq règles sont écrites. Si l’une reste vague, précisez-la assez pour l’utiliser le jour où le marché bouge.</div>':'<div class="verdict v-ko">'+n+' règle'+(n>1?'s':'')+' sur 5. Complétez les autres avant votre prochain achat.</div>'; } },
        p: "Mes cinq règles tiennent sur une page." },
      { t: "Votre stratégie tient-elle sur une page ?", c: "Fatou connaît son objectif, sa date, sa somme, les baisses qu’elle peut traverser et les placements qu’elle comprend. Sa stratégie n’est pas une promesse de performance : c’est une méthode pour décider selon ses priorités, et réviser quand les faits changent. Au bilan, elle vérifie aussi ses versements, ses frais et ce qu’elle détient vraiment.",
        w: { champs: [ {id:"st_obj", l:"Mon objectif principal", type:"txt", ph:"Ouvrir mon atelier en 2029"}, {id:"st_vers", l:"Les versements que je peux tenir (F par mois)"}, {id:"st_bilan", l:"La date de mon prochain bilan", type:"txt", ph:"15 mai 2027"} ],
          puces: { id:"st_dec", k:"Ma première décision", l:["J’investis selon cette fiche","Je modifie le montant envisagé","J’attends d’avoir clarifié un point"] },
          v: function(D,H){ return D.st_dec?'<div class="verdict v-ok">'+H.esc(D.st_dec)+'. Votre fiche est datée : relisez-la au bilan pour comprendre vos choix.</div>':''; } },
        p: "Ma fiche de stratégie est datée, avec une première décision." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Ma stratégie sur une page »", titre: "Votre argent a une mission, des règles et une date de bilan",
    fiche: [
      ["Mon objectif", function(D){ return D.st_obj||''; }],
      ["Somme que je peux investir", function(D,H){ var t=H.N(D.st_total); if(!t) return ''; var i=t-H.N(D.st_vie)-H.N(D.st_res); return i>0?H.F(i):'À construire d’abord : ma réserve'; }],
      ["Mes projets datés", function(D){ return [D.st_p1,D.st_p2,D.st_p3].filter(Boolean).join(' · '); }],
      ["Réserve à garder disponible (12 mois)", function(D,H){ var b=H.N(D.st_b12); return b?H.F(b):''; }],
      ["Rôle de chaque partie", function(D){ return [D.st_r1,D.st_r2,D.st_r3].filter(Boolean).join(' · '); }],
      ["Mes versements", function(D,H){ var v=H.N(D.st_vers); return v?H.F(v)+' par mois':''; }],
      ["Quand je fais le point", function(D){ return D.st_g4||''; }],
      ["Pourquoi je pourrais vendre", function(D){ return D.st_g5||''; }],
      ["Mon prochain bilan", function(D){ return D.st_bilan||''; }],
      ["Ma première décision", function(D){ return D.st_dec||''; }]
    ],
    suite: { t: "Jouer : mon portefeuille face à la baisse", p: "Votre stratégie est écrite. Mettez-la à l’épreuve d’une vraie baisse, sans risquer un franc.", lien: "jeu-portefeuille-baisse.html", b: "Lancer le jeu" }
  }
};
