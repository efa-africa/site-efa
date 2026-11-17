/* Atelier guidé · Les bons du Trésor, de A à Z (17 nov. 2026)
   Exemple réel vérifié : avis d'appel d'offres de la Côte d'Ivoire du 20 octobre 2026 (BCEAO / UMOA-Titres) :
   BAT 364 jours, nominal 1 000 000 F, intérêts précomptés, échéance 19 oct. 2027 ; OAT 3, 5, 7 ans à 5,20 %, 5,45 %, 5,70 %,
   nominal 10 000 F, intérêts annuels. Exercice 960 000 → 1 000 000 : fictif. Résultat : « Ma lecture d'une émission ». */
window.ATELIER = {
  id: "bons-du-tresor",
  titre: "Les bons du Trésor, de A à Z",
  h1: "Un prêt à l’État dont vous savez lire le montant, la durée et les conditions.",
  voix: "auto",
  question: {
    t: "L’État veut emprunter pour un an. Vous voulez placer pour un an. Que vous propose un bon du Trésor ?",
    r: [
      ["a", "Un taux garanti, puisque c’est l’État.", "L’émetteur compte, mais il ne remplace pas la lecture des conditions : prix payé, date, sortie, frais. On les lit ensemble.", false],
      ["b", "Un prêt à l’État, selon les conditions d’une émission précise.", "Exactement. Cet atelier vous apprend à lire une émission réelle et à savoir si elle convient à votre projet.", true]
    ]
  },
  chapitres: [
    { t: "Comment ça marche", acq: "Je sais ce qu’est un bon et pourquoi on ne paie pas le nominal", desc: "Un titre de dette d’un État. Des intérêts précomptés : on paie moins, on reçoit le nominal.", e: [
      { t: "Un bon du Trésor, c’est un prêt à un État", c: "Un bon du Trésor est un titre de dette émis par un État. En l’achetant, vous lui prêtez de l’argent selon les conditions d’une émission précise. La date de remboursement est connue d’avance. Exemple réel : le 20 octobre 2026, la Côte d’Ivoire proposait un bon de 364 jours, à 1 000 000 F de valeur nominale, remboursé le 19 octobre 2027, avec des intérêts précomptés.",
        f: ["« Précomptés » : les intérêts sont déduits au départ. On paie moins que la valeur nominale, et on reçoit la valeur nominale à l’échéance.", "Pour ce bon, l’avis ne fixait pas de taux : il résulte des offres. On ne peut donc pas lui attribuer un rendement sans le résultat de l’opération.", "La même opération proposait des obligations à 3, 5 et 7 ans."],
        w: { consignes: 1, quiz: [
          ["Un bon a une valeur nominale de 1 000 000 F. Combien payez-vous ?", ["1 000 000 F","Moins, si les intérêts sont précomptés : le prix dépend du résultat de l’émission"], 1, "La valeur nominale est ce que vous recevez à l’échéance, pas forcément ce que vous décaissez."]
        ] },
        p: "Je sais que la valeur nominale n’est pas le prix payé." },
      { t: "Pourquoi ne payez-vous pas le montant remboursé ?", c: "Exercice fictif, sans lien avec une émission réelle : un bon de 1 000 000 F de nominal, remboursé dans environ un an, s’achète 960 000 F. L’investisseur gagne 40 000 F bruts si le remboursement se fait comme prévu, soit environ 4,17 % des 960 000 F payés, avant frais et fiscalité éventuelle.",
        w: { k: "Votre calcul", c3: 1, champs: [ {id:"bt_nom", l:"Valeur nominale (F)"}, {id:"bt_prix", l:"Prix payé (F)"}, {id:"bt_frais", l:"Frais de l’intermédiaire (F)", ph:"0"} ],
          v: function(D,H){ var n=H.N(D.bt_nom), p=H.N(D.bt_prix), f=H.N(D.bt_frais); if(!n||!p) return ''; var g=n-p-f, r=g/(p+f)*100; return '<div class="gros"><small>Gain sur la période · rapporté à ce que vous payez</small><b>'+(g>=0?'':'−')+H.F(Math.abs(g))+' · '+r.toFixed(2).replace('.',',')+' %</b><p>Si le titre est conservé jusqu’au remboursement, et avant fiscalité éventuelle.</p></div>'; } },
        p: "Je calcule mon gain à partir du prix réellement payé." }
    ]},
    { t: "Y accéder", acq: "Je sais quel montant il faut et par qui passer", desc: "Regarder la valeur nominale de l’émission visée. Passer par une banque ou une SGI.", e: [
      { t: "Peut-on acheter un bon avec 50 000 F ?", c: "Regardez d’abord la valeur nominale unitaire de l’émission visée. Dans l’émission ivoirienne du 20 octobre 2026, elle était de 1 000 000 F pour le bon et de 10 000 F pour les obligations. Cela ne rend pas leurs durées, leurs prix ou leurs rendements équivalents.",
        f: ["Ne concluez pas que « tous les titres publics commencent à 10 000 F ».", "Ne concluez pas non plus que « tous les bons exigent un million ».", "Regardez le titre précis, ses conditions et les frais de l’intermédiaire."],
        w: { consignes: 1, quiz: [
          ["Avec 50 000 F, pouvez-vous acheter le bon de 364 jours du 20 octobre 2026 ?", ["Oui, je prends une fraction","Non, son nominal unitaire est de 1 000 000 F"], 1, "Un titre s’achète par unités entières de sa valeur nominale. Les obligations de la même opération, à 10 000 F, sont une autre question, avec d’autres durées."]
        ] },
        p: "Je regarde la valeur nominale du titre précis." },
      { t: "Comment un particulier y accède-t-il ?", c: "Lors d’une adjudication, les offres sont déposées par les établissements admis à participer directement, sur la plateforme de la BCEAO. Un particulier passe par une banque ou une SGI de l’Union. Il lui demande si le titre est accessible, à quelles conditions, pour quel montant et avec quels frais. Les modalités peuvent différer pour une émission par syndication.",
        w: { puces: { id:"bt_inter", k:"Ce que je demande à ma banque ou à ma SGI", m:1, l:["Ce titre m’est-il accessible ?","Pour quel montant minimum ?","Quels frais ?","Quel relevé prouvera que je détiens le titre ?","Que faire si j’ai besoin de l’argent avant l’échéance ?"] },
          v: function(D){ var n=(D.bt_inter||[]).length; return n===5?'<div class="verdict v-ok">Vos cinq questions sont prêtes. Voir un avis d’émission ne veut pas dire pouvoir y souscrire seul, au montant choisi.</div>':''; } },
        p: "Je sais quoi demander à mon intermédiaire." }
    ]},
    { t: "Choisir et lire une émission", acq: "Je lis un avis d’émission et je décide pour mon projet", desc: "Bon ou obligation selon la durée. La fiche de lecture d’une émission.", e: [
      { t: "Bon ou obligation du Trésor ?", c: "Point commun : vous prêtez à un État selon les termes d’un titre. Différence pratique : la durée et la façon d’être payé. Le 20 octobre 2026, le bon ivoirien durait 364 jours, intérêts précomptés. Les obligations duraient 3, 5 et 7 ans, avec des taux nominaux de 5,20 %, 5,45 % et 5,70 %, et des intérêts versés chaque année.",
        f: ["Les taux des obligations ne sont pas le taux du bon.", "Ils ne disent pas, à eux seuls, ce qu’obtiendrait quelqu’un qui achète puis revend avant l’échéance.", "Le rendement calculé jusqu’au remboursement ne décrit pas une sortie anticipée : il faudra trouver un acheteur, au prix du moment.", "UMOA-Titres propose un simulateur pour étudier le prix et le rendement d’un bon identifié."],
        w: { consignes: 1, quiz: [
          ["Koffi paiera une formation dans un an. Que regarde-t-il d’abord ?", ["L’obligation à 7 ans, au taux le plus élevé","Un titre dont l’échéance arrive avant sa formation, comme un bon d’environ un an"], 1, "La durée vient avant le taux. Une obligation à 7 ans l’obligerait à revendre avant l’échéance, à un prix inconnu."]
        ] },
        p: "Je choisis la durée avant le taux." },
      { t: "L’exercice EFA : lisez une émission", c: "Ouvrez l’avis d’une émission de bons du Trésor, sur le site de la BCEAO ou d’UMOA-Titres, et remplissez la fiche. Le bon du Trésor cesse d’être un nom qui inspire confiance : il devient un prêt dont vous savez lire le montant, la durée et les conditions.",
        w: { champs: [ {id:"bt_etat", l:"État émetteur", type:"txt"}, {id:"bt_duree", l:"Durée et date de remboursement", type:"txt"}, {id:"bt_vn", l:"Valeur nominale d’un bon", type:"txt"}, {id:"bt_res", l:"Prix ou résultat de l’opération à vérifier", type:"txt"}, {id:"bt_remu", l:"Rémunération et mode de calcul", type:"txt"}, {id:"bt_int", l:"Intermédiaire et frais", type:"txt"}, {id:"bt_sortie", l:"Possibilité de sortir avant l’échéance", type:"txt"}, {id:"bt_phrase", l:"Ce bon correspond, ou ne correspond pas, à mon projet de… parce que j’aurai besoin de mon argent le…", type:"area"} ],
          v: function(D){ return D.bt_phrase?'<div class="verdict v-ok">Votre lecture est enregistrée dans votre fiche.</div>':''; } },
        p: "J’ai lu une émission réelle et décidé pour mon projet." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Ma lecture d’une émission »", titre: "Le bon du Trésor devient un prêt que vous savez lire",
    fiche: [
      ["Mon calcul", function(D,H){ var n=H.N(D.bt_nom), p=H.N(D.bt_prix), f=H.N(D.bt_frais); return n&&p?H.F(n-p-f)+' de gain, '+((n-p-f)/(p+f)*100).toFixed(2).replace('.',',')+' %':''; }],
      ["Émetteur", function(D){ return D.bt_etat||''; }],
      ["Durée et remboursement", function(D){ return D.bt_duree||''; }],
      ["Valeur nominale", function(D){ return D.bt_vn||''; }],
      ["Rémunération", function(D){ return D.bt_remu||''; }],
      ["Intermédiaire et frais", function(D){ return D.bt_int||''; }],
      ["Sortie anticipée", function(D){ return D.bt_sortie||''; }],
      ["Ma décision", function(D){ return D.bt_phrase||''; }]
    ],
    suite: { t: "Investir dans les placements à revenu fixe", p: "Vous savez lire un bon. L’atelier suivant compare obligations, dépôts à terme et fonds obligataires.", lien: "atelier-revenu-fixe.html", b: "Ouvrir l’atelier" }
  }
};
