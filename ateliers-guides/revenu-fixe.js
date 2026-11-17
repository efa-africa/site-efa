/* Atelier guidé · Investir dans les placements à revenu fixe (17 nov. 2026)
   UMOA : bons et obligations du Trésor, obligations d'entreprises, DAT, fonds obligataires. Niveau intermédiaire.
   Montants et personnages : exemples pédagogiques. Résultat : la fiche « Ma comparaison de deux offres ». */
window.ATELIER = {
  id: "revenu-fixe",
  titre: "Investir dans les placements à revenu fixe",
  h1: "Ce qu’un placement promet vraiment, et quand votre argent revient.",
  voix: "auto",
  question: {
    t: "On vous propose une obligation à 6 % par an. Que vous promet-on ?",
    r: [
      ["a", "Mon argent augmentera de 6 % chaque année, quoi qu’il arrive.", "C’est la lecture la plus courante, et elle est incomplète. Le taux décrit ce que verse le titre, pas forcément ce que vous gagnerez. On le voit dès le chapitre 1.", false],
      ["b", "Je ne sais pas encore : il faut savoir qui paie, à quel prix et quand.", "C’est exactement la bonne question. Cet atelier vous donne une méthode pour y répondre, offre par offre.", true]
    ]
  },
  chapitres: [
    { t: "Ce que je détiens", acq: "Je sais ce que je détiens et ce que je gagne vraiment", desc: "Obligation, dépôt à terme, fonds : trois promesses différentes. Le coupon n’est pas le rendement.", e: [
      { t: "« 6 % par an » : qui vous promet quoi ?", c: "Awa a 300 000 F à placer. Quand on achète une obligation, on prête de l’argent à un émetteur, un État ou une entreprise. En échange, il s’engage à verser des intérêts et à rembourser le capital selon un calendrier prévu.",
        f: ["Obligation : vous prêtez à un émetteur. Lisez le nominal, le taux, les dates de paiement et la date de remboursement.", "Dépôt à terme : vous placez une somme auprès d’un établissement, selon un contrat qui fixe la durée et les conditions.", "Fonds obligataire : vous détenez des parts d’un portefeuille géré pour plusieurs personnes. La valeur de la part peut bouger.", "« Revenu fixe » veut dire que la règle de paiement d’un titre est connue à l’avance. Sa valeur de revente, elle, n’est pas garantie."],
        w: { consignes: 1, quiz: [
          ["Le nom de l’émetteur compte-t-il autant que le taux ?", ["Non, seul le taux compte","Oui, c’est lui qui devra tenir la promesse"], 1, "Un taux n’a de valeur que si celui qui l’a promis peut payer. Le nom de l’émetteur fait partie de l’offre."],
          ["Obligation, dépôt à terme et fonds obligataire donnent-ils les mêmes droits ?", ["Oui, ce sont tous des placements à revenu","Non, ni les mêmes droits ni les mêmes façons de récupérer l’argent"], 1, "Les trois peuvent produire des revenus. Ce que vous détenez, et comment vous sortez, change d’un produit à l’autre."]
        ] },
        p: "Je pose trois questions avant le taux : à qui, quoi, quand." },
      { t: "Le coupon n’est pas votre rendement", c: "Koffi lit : nominal 100 000 F, coupon annuel de 6 %. Cela fait 6 000 F d’intérêts par an. Mais le titre se vend aujourd’hui 105 000 F. Rapporté à ce qu’il paie, le coupon ne fait plus que 5,7 % environ, et il perdra 5 000 F à l’échéance s’il est remboursé 100 000 F.",
        w: { ex: "Nominal 100 000 F, coupon 6 %, prix payé 105 000 F : coupon de 6 000 F par an, soit 5,7 % du prix payé, et 5 000 F d’écart à l’échéance. Ce calcul est fait avant frais et fiscalité.", k: "Vos chiffres", c3: 1, champs: [ {id:"rf_nom", l:"Valeur nominale (F)"}, {id:"rf_taux", l:"Coupon annuel (%)"}, {id:"rf_prix", l:"Prix que je paie (F)"} ],
          v: function(D,H){ var n=H.N(D.rf_nom), t=H.N(D.rf_taux), p=H.N(D.rf_prix); if(!n||!t) return ''; var c=Math.round(n*t/100); if(!p) return '<div class="gros"><small>Coupon par an</small><b>'+H.F(c)+'</b><p>Ajoutez le prix que vous payez pour voir ce que ce coupon représente pour vous.</p></div>';
            var r=(c/p*100).toFixed(1).replace('.',','), e=n-p;
            return '<div class="gros"><small>Coupon par an · rapporté à votre prix</small><b>'+H.F(c)+' · '+r+' %</b><p>'+(e<0?'Vous payez '+H.F(-e)+' au-dessus du nominal : si le titre est remboursé au nominal, cette somme est perdue à l’échéance.':e>0?'Vous payez '+H.F(e)+' sous le nominal : si le titre est remboursé comme prévu, ce gain s’ajoute aux coupons.':'Vous payez le nominal : rapporté au prix, le coupon est égal au taux affiché.')+' Avant frais et fiscalité.</p></div>'; } },
        p: "Je compare les offres avec le prix que je paie, pas avec le taux affiché." }
    ]},
    { t: "Le calendrier et l’émetteur", acq: "Je choisis une durée selon ma date et je sais qui me doit l’argent", desc: "Une échéance se compare à la date de votre besoin. Un taux rémunère une promesse.", e: [
      { t: "Bon ou obligation du Trésor : regardez le calendrier", c: "Les États de l’UMOA émettent des bons et des obligations du Trésor. Chaque émission indique sa durée, son nominal, sa rémunération et son remboursement. Lisez les caractéristiques de l’émission précise : le nom de la famille ne suffit pas.",
        f: ["Une personne qui aura besoin de son argent dans neuf mois cherche une échéance compatible avec cette date.", "Si elle doit vendre avant le remboursement, elle dépendra du prix du moment et de la présence d’un acheteur.", "Une personne qui prépare un projet dans quatre ans peut étudier une durée plus longue."],
        w: { consignes: 1, k: "Ma date et celle du titre", champs: [ {id:"rf_besoin", l:"J’aurai besoin de cet argent dans (mois)"}, {id:"rf_ech", l:"Le titre est remboursé dans (mois)"} ],
          v: function(D,H){ var b=H.N(D.rf_besoin), e=H.N(D.rf_ech); if(!b||!e) return ''; return e<=b?'<div class="verdict v-ok">L’échéance arrive avant votre besoin : vous pouvez garder le titre jusqu’à son remboursement.</div>':'<div class="verdict v-ko">Le titre est remboursé '+(e-b)+' mois après votre besoin. Il faudrait le revendre avant, au prix du moment. Cherchez une durée plus courte, ou gardez cette somme ailleurs.</div>'; } },
        p: "Je commence par ma date, pas par le taux le plus élevé." },
      { t: "Qui vous doit l’argent ?", c: "« C’est une obligation, donc c’est sûr », dit un ami à Mariam. Elle répond : « Une obligation est d’abord une dette. Qui la remboursera ? » Un État, une entreprise et une banque n’ont ni les mêmes recettes ni les mêmes risques.",
        f: ["Entreprise : ce qu’elle vend, comment elle gagne de l’argent, ses dettes actuelles, ce que financera l’emprunt.", "État : les conditions du titre. La dette publique est aussi un engagement à honorer.", "Dépôt à terme : le contrat de l’établissement où l’argent sera placé.", "Sur le marché régional, on passe par un intermédiaire agréé, notamment une SGI. L’AMF-UMOA recommande de vérifier l’agrément et de lire les documents avant de s’engager."],
        w: { consignes: 1, puces: { id:"rf_verif", k:"Pour l’offre que j’étudie, je sais déjà…", m:1, l:["Qui est l’émetteur","Sur quelles ressources il compte me payer","Quel document décrit mes droits","Que mon intermédiaire est agréé"] },
          v: function(D){ var n=(D.rf_verif||[]).length; if(!n) return ''; return n===4?'<div class="verdict v-ok">Vous savez qui fait la promesse et ce qui l’engage. Vous pouvez comparer.</div>':'<div class="verdict v-ko">Il vous manque '+(4-n)+' réponse'+(4-n>1?'s':'')+'. Obtenez-'+(4-n>1?'les':'la')+' avant d’investir.</div>'; } },
        p: "J’identifie celui qui fait la promesse avant d’accepter son taux." }
    ]},
    { t: "Le prix et la sortie", acq: "Je sais ce qui fait bouger un prix et comment je récupère mon argent", desc: "Le coupon fixe ne fixe pas le prix de revente. Récupérer son argent a un délai et un coût.", e: [
      { t: "Votre obligation verse toujours 6 %. Pourquoi son prix baisse-t-il ?", c: "Awa détient une obligation à coupon fixe. Quelques mois plus tard, de nouvelles obligations comparables paient davantage. Pour trouver un acheteur, le prix de l’ancienne peut baisser. Son coupon n’a pas changé : c’est sa valeur sur le marché qui a changé.",
        f: ["Si les taux des nouvelles émissions montent, le prix des anciennes peut baisser. S’ils baissent, il peut monter.", "Si vous gardez le titre jusqu’au remboursement, regardez d’abord les paiements promis et la solidité de l’émetteur.", "Si vous devez vendre avant, vous dépendez aussi du prix du moment. Plus la durée restante est longue, plus ce prix peut bouger."],
        w: { consignes: 1, quiz: [
          ["Vous aurez besoin de votre argent dans six mois, mais le titre est remboursé dans cinq ans. Quelle question devient prioritaire ?", ["Le coupon annoncé","Le prix auquel je pourrai le revendre dans six mois"], 1, "Vous devrez vendre avant l’échéance. C’est donc le prix de revente, inconnu aujourd’hui, qui décidera de votre résultat."]
        ] },
        p: "Je sais que le coupon fixe ne fixe pas le prix de revente." },
      { t: "« Je peux retirer quand je veux » : à quel prix ?", c: "Serge place l’argent de la rentrée scolaire dans un produit à échéance lointaine, pour son taux. Un imprévu arrive. Il découvre la liquidité : pouvoir transformer un placement en argent disponible, dans un délai et à un coût acceptables.",
        f: ["Ai-je le droit de sortir ? Un contrat peut fixer des conditions de retrait anticipé.", "À quel prix ? Un titre vendu avant l’échéance peut valoir plus ou moins que ce que j’ai payé.", "En combien de temps ? Une vente dépend d’un acheteur et des délais de traitement."],
        w: { consignes: 1, k: "Pour un de mes projets", champs: [ {id:"rf_proj", l:"Mon projet", type:"txt", ph:"Rentrée scolaire de septembre"}, {id:"rf_date", l:"Sa date", type:"txt", ph:"septembre 2027"}, {id:"rf_delai", l:"Délai pour sortir du placement", type:"txt", ph:"5 jours ouvrés, ou à l’échéance seulement"}, {id:"rf_cout", l:"Ce que coûterait une sortie anticipée", type:"txt", ph:"pénalité de…, ou vente au prix du marché"} ],
          v: function(D){ return D.rf_proj&&D.rf_delai?'<div class="verdict v-ok">Votre projet a maintenant une date et une sortie connue. Faites la même chose pour chaque somme.</div>':''; } },
        p: "Pour chaque projet, je connais le délai et le coût d’une sortie." }
    ]},
    { t: "Comparer et décider", acq: "Je compare deux offres avec mes besoins et je décide", desc: "Un fonds diversifie sans supprimer le risque. Chaque somme reçoit une tâche.", e: [
      { t: "Un fonds obligataire : plusieurs titres, une valeur qui bouge", c: "Mariam ne veut pas choisir seule entre plusieurs obligations. Un fonds achète différents titres pour ses souscripteurs : si un titre rencontre un problème, tout son argent n’y est pas exposé. Mais la valeur de sa part peut varier, le fonds prend des frais et ses règles fixent quand elle peut sortir. L’AMF-UMOA invite à lire le prospectus avant de souscrire.",
        w: { puces: { id:"rf_fonds", k:"Les cinq informations à obtenir sur un fonds", m:1, l:["Les titres que le fonds peut acheter","La durée qu’il vise","Les frais qu’il facture","Comment évolue la valeur d’une part","Le délai pour récupérer mon argent"] },
          quiz: [
            ["Un fonds obligataire diversifié supprime-t-il le risque de perte ?", ["Oui, puisqu’il détient plusieurs titres","Non, il réduit la dépendance à un seul titre"], 1, "Les prix des obligations détenues peuvent baisser ensemble, et les frais s’appliquent. La diversification réduit un risque, elle ne l’annule pas."]
          ],
          v: function(D){ var n=(D.rf_fonds||[]).length; return n===5?'<div class="verdict v-ok">Vous avez votre liste. Demandez ces cinq réponses avant toute souscription.</div>':''; } },
        p: "Je lis la règle d’un fonds avant d’y entrer." },
      { t: "Comparez deux offres avec vos besoins", c: "Koffi aura besoin de 400 000 F dans un an pour une formation. Il a aussi une somme pour un projet dans quatre ans. Son choix ne consiste pas à trouver le meilleur taux, mais à donner une tâche à chaque somme. Remplissez la fiche pour deux offres réelles ou envisagées.",
        w: { k: "Offre A", champs: [ {id:"rf_a_qui", l:"Qui me doit l’argent ?", type:"txt"}, {id:"rf_a_paie", l:"Combien je paie, frais compris", type:"txt"}, {id:"rf_a_recoit", l:"Ce que je reçois, et quand", type:"txt"}, {id:"rf_a_sortie", l:"Comment sortir plus tôt", type:"txt"}, {id:"rf_a_risque", l:"Ce qui peut réduire mon résultat", type:"txt"} ]},
        p: "L’offre A est décrite." },
      { t: "La deuxième offre, et ma décision", c: "Même grille pour l’offre B. Puis écrivez votre décision. Refuser les deux est aussi une bonne décision si aucune ne convient à votre date.",
        w: { k: "Offre B", champs: [ {id:"rf_b_qui", l:"Qui me doit l’argent ?", type:"txt"}, {id:"rf_b_paie", l:"Combien je paie, frais compris", type:"txt"}, {id:"rf_b_recoit", l:"Ce que je reçois, et quand", type:"txt"}, {id:"rf_b_sortie", l:"Comment sortir plus tôt", type:"txt"}, {id:"rf_b_risque", l:"Ce qui peut réduire mon résultat", type:"txt"}, {id:"rf_quand", l:"Quand ai-je besoin de la somme ?", type:"txt", ph:"dans 12 mois"} ],
          puces: { id:"rf_choix", k:"Ma décision", l:["Je retiens l’offre A","Je retiens l’offre B","Aucune ne convient pour ce projet"] },
          v: function(D,H){ if(!D.rf_choix) return ''; return '<div class="verdict v-ok">'+H.esc(D.rf_choix)+'. Votre comparaison est enregistrée dans votre fiche.</div>'; } },
        p: "Ma décision est écrite, avec ses raisons." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Ma comparaison de deux offres »", titre: "Vous lisez une offre à revenu fixe comme un contrat, pas comme une publicité",
    fiche: [
      ["Mon coupon rapporté au prix", function(D,H){ var n=H.N(D.rf_nom), t=H.N(D.rf_taux), p=H.N(D.rf_prix); return n&&t&&p?(n*t/p).toFixed(1).replace('.',',')+' % du prix payé':''; }],
      ["Ma date de besoin", function(D,H){ return D.rf_quand||(H.N(D.rf_besoin)?'dans '+H.N(D.rf_besoin)+' mois':''); }],
      ["Mon projet et sa sortie", function(D){ return D.rf_proj?D.rf_proj+(D.rf_delai?' · sortie : '+D.rf_delai:''):''; }],
      ["Offre A", function(D){ return [D.rf_a_qui,D.rf_a_paie,D.rf_a_recoit].filter(Boolean).join(' · '); }],
      ["Offre B", function(D){ return [D.rf_b_qui,D.rf_b_paie,D.rf_b_recoit].filter(Boolean).join(' · '); }],
      ["Ma décision", function(D){ return D.rf_choix||''; }]
    ],
    suite: { t: "Construire sa stratégie d’investissement", p: "Vous savez lire une offre. L’atelier suivant donne une mission à chaque somme et vous aide à écrire vos règles sur une page.", lien: "atelier-strategie-investissement.html", b: "Ouvrir l’atelier" }
  }
};
