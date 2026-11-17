/* Atelier guidé · Investir pour les dividendes (17 nov. 2026)
   Faits vérifiés : calendrier BRVM de paiement des dividendes, exercice 2025 :
   SONATEL 1 740 F net/action, ex-dividende 22/05/2026, paiement 26/05/2026 ;
   SOLIBRA 2 127 F BRUT/action (IRVM 12 % personnes physiques ≈ 1 872 F net), ex-dividende 29/07/2026, paiement 30/07/2026.
   Prix d'achat : fictifs. Résultat : « Ma fiche dividende avant d'acheter ». */
window.ATELIER = {
  id: "investir-dividendes",
  titre: "Investir pour les dividendes",
  h1: "Le dividende versé est une information. Le prix payé fait la décision.",
  voix: "auto",
  question: {
    t: "Une action verse 2 127 F de dividende. Est-ce une bonne action à acheter ?",
    r: [
      ["a", "Oui, c’est un gros dividende.", "Il manque l’information qui change tout : combien coûte l’action ? Et ce chiffre est-il brut ou net, passé ou promis ? On le voit tout de suite.", false],
      ["b", "Je ne sais pas encore : il me faut le prix de l’action.", "Exactement. Cet atelier vous apprend à rapporter un dividende au prix, à vérifier qu’il peut durer, et à calculer votre résultat total.", true]
    ]
  },
  chapitres: [
    { t: "Un dividende, et son prix", acq: "Je calcule un rendement du dividende par rapport au prix payé", desc: "Brut ou net, passé ou promis. Le plus gros dividende n’est pas le meilleur rendement.", e: [
      { t: "Ce que montrent les chiffres de la BRVM", c: "Un dividende est une part des ressources qu’une entreprise décide de distribuer à ses actionnaires. Ce n’est ni un intérêt fixe ni un revenu mensuel garanti. Au titre de l’exercice 2025, selon le calendrier de la BRVM, Sonatel a versé 1 740 F nets par action le 26 mai 2026, et SOLIBRA 2 127 F bruts par action le 30 juillet 2026.",
        f: ["Brut ou net : sur les 2 127 F bruts de SOLIBRA, un particulier perçoit environ 1 872 F après l’impôt de 12 % sur les revenus des actions. Comparez toujours des montants de même nature.", "Ces montants sont des faits passés : ils ne disent rien des dividendes des années suivantes.", "Avec 10 actions Sonatel donnant droit à ce paiement : 10 × 1 740 = 17 400 F nets. Pour juger l’investissement, il faut aussi le prix payé et la valeur actuelle des actions."],
        w: { consignes: 1, quiz: [
          ["SOLIBRA verse 2 127 F, Sonatel 1 740 F. Qui verse le plus, net, à un particulier ?", ["SOLIBRA, sans hésiter","Il faut d’abord comparer net à net : environ 1 872 F pour SOLIBRA, 1 740 F pour Sonatel"], 1, "Un montant brut et un montant net ne se comparent pas directement. Et le montant par action ne dit pas encore le rendement."]
        ] },
        p: "Je compare des dividendes de même nature, brut ou net." },
      { t: "Le plus gros dividende n’est pas forcément le meilleur rendement", c: "Prenons des prix d’achat fictifs. Sonatel à 25 000 F : 1 740 ÷ 25 000 = 6,96 %. SOLIBRA à 40 000 F : 1 872 ÷ 40 000 = 4,68 % net. SOLIBRA verse plus de francs par action ; Sonatel offre ici le meilleur rendement par rapport au prix. Si les prix changent, les pourcentages changent aussi.",
        w: { ex: "Rendement du dividende = dividende net par action ÷ prix payé. Ce calcul utilise un dividende déjà versé : il ne promet pas le même montant l’an prochain. Ajoutez les frais d’achat et de garde.", k: "Votre calcul", c3: 1, champs: [ {id:"dv_div", l:"Dividende net par action (F)"}, {id:"dv_prix", l:"Prix d’achat de l’action (F)"}, {id:"dv_nb", l:"Nombre d’actions"} ],
          v: function(D,H){ var d=H.N(D.dv_div), p=H.N(D.dv_prix), n=H.N(D.dv_nb); if(!d||!p) return ''; var r=(d/p*100).toFixed(2).replace('.',','); return '<div class="gros"><small>Rendement du dividende passé</small><b>'+r+' %</b><p>'+(n?'Pour '+n+' actions : '+H.F(d*n)+' de dividende, pour '+H.F(p*n)+' investis, hors frais. ':'')+'Réflexe EFA : « un bon dividende, par rapport à quel prix ? »</p></div>'; } },
        p: "Je rapporte toujours le dividende au prix d’achat." }
    ]},
    { t: "Peut-il durer ?", acq: "Je vérifie que l’entreprise peut continuer à payer", desc: "Un dividende vient des bénéfices et de la trésorerie. Un dividende trop beau peut cacher une chute du cours.", e: [
      { t: "Une entreprise peut-elle continuer à payer ?", c: "Un dividende n’apparaît pas par magie : l’entreprise doit poursuivre son activité, financer ses besoins et décider ce qu’elle distribue. SOLIBRA, par exemple, a vu son bénéfice net plus que doubler en 2025 ; une personne attirée par son dividende doit lire à la fois ce bénéfice et l’usage que l’entreprise fait de son argent.",
        f: ["Les bénéfices progressent-ils grâce à une activité qui tient ?", "L’entreprise garde-t-elle assez de moyens pour investir ?", "A-t-elle déjà dû réduire ou interrompre sa distribution ?", "Un dividende très élevé par rapport au cours peut être une occasion. Il peut aussi refléter une chute du cours, liée à des difficultés que le marché anticipe."],
        w: { consignes: 1, quiz: [
          ["Une action affiche 15 % de rendement du dividende, parce que son cours a chuté de moitié. Que faites-vous ?", ["J’achète, c’est une aubaine","Je cherche d’abord pourquoi le cours a chuté, et si le dividende peut être maintenu"], 1, "Le rendement se calcule avec un dividende passé. Si l’entreprise va mal, le prochain peut être réduit, voire supprimé."]
        ] },
        p: "Je regarde ce qui permettrait de distribuer encore." },
      { t: "Acheter juste avant le paiement : de l’argent gratuit ?", c: "Non. La BRVM publie une date ex-dividende et une date de paiement : pour Sonatel, le 22 et le 26 mai 2026 ; pour SOLIBRA, le 29 et le 30 juillet 2026. Une fois le droit au dividende détaché, le cours peut s’ajuster, et il reste soumis au marché. Les frais d’achat et de vente réduisent encore le résultat.",
        w: { ex: "Résultat total = dividendes reçus + ou − variation du prix des actions − frais. 17 400 F de dividendes ne font pas 17 400 F de gain si la valeur des actions a baissé davantage.", k: "Votre résultat total", c3: 1, champs: [ {id:"dv_recu", l:"Dividendes nets reçus (F)"}, {id:"dv_var", l:"Variation de valeur des actions (F), signe moins si baisse", type:"txt", ph:"-25000"}, {id:"dv_frais", l:"Frais payés (F)"} ],
          v: function(D,H){ var r=H.N(D.dv_recu), v=parseFloat(String(D.dv_var||'0').replace(/\s/g,'').replace(',','.'))||0, f=H.N(D.dv_frais); if(!r&&!v) return ''; var t=r+v-f; return '<div class="gros"><small>Votre résultat total</small><b>'+(t<0?'−':'+')+H.F(Math.abs(t))+'</b><p>'+(t<r?'Le dividende ne dit pas tout : la variation du prix et les frais ont pesé.':'Dividende et prix ont joué dans le même sens.')+'</p></div>'; } },
        p: "Je calcule mon résultat total, pas seulement le dividende." }
    ]},
    { t: "Ma stratégie et ma fiche", acq: "Je sais à quoi servira le dividende et j’ai rempli ma fiche", desc: "Revenu ou réinvestissement. Puis la fiche avant d’acheter.", e: [
      { t: "Que ferez-vous du dividende ?", c: "Mariam veut des revenus pour compléter son budget. Serge investit pour un projet dans quinze ans et réinvestit ses dividendes. Ils peuvent détenir la même action avec deux stratégies différentes. Mariam ne devrait pas bâtir une dépense obligatoire sur un versement incertain. Serge réinvestit en tenant compte du prix des nouveaux achats et des frais.",
        w: { puces: { id:"dv_strat", k:"Mes dividendes serviront à…", l:["Compléter mon budget, sans en faire une dépense obligatoire","Réinvestir pour un projet lointain","Je ne sais pas encore"] },
          v: function(D,H){ return D.dv_strat?'<div class="verdict v-ok">'+(D.dv_strat.indexOf('Compléter')===0?'Gardez une réserve : le montant et la date des prochains dividendes ne sont pas assurés.':D.dv_strat.indexOf('Réinvestir')===0?'Vérifiez à chaque fois le prix d’achat et les frais : réinvestir n’est pas acheter à n’importe quel prix.':'Décidez-le avant d’acheter : cela change les actions qui vous conviennent.')+'</div>':''; } },
        p: "Je sais à quoi serviront mes dividendes." },
      { t: "Votre décision EFA", c: "Choisissez une action qui a versé un dividende et remplissez la fiche avant d’envisager un achat. Investir pour les dividendes, c’est acheter une part d’entreprise capable de créer et de partager de la valeur.",
        w: { champs: [ {id:"dv_soc", l:"L’action", type:"txt"}, {id:"dv_paye", l:"Dividende net par action effectivement payé, et exercice", type:"txt"}, {id:"dv_px", l:"Prix actuel, avec sa date", type:"txt"}, {id:"dv_bn", l:"Évolution récente du bénéfice", type:"txt"}, {id:"dv_fr", l:"Frais estimés pour acheter et conserver", type:"txt"}, {id:"dv_pourquoi", l:"Pourquoi cette action, au-delà du dividende ?", type:"area"}, {id:"dv_phrase", l:"Je m’intéresse à cette entreprise pour… Le dividende passé représente… % du prix observé le… Je dois encore vérifier…", type:"area"} ],
          v: function(D){ return D.dv_phrase?'<div class="verdict v-ok">Votre fiche est dans votre cahier.</div>':''; } },
        p: "Ma fiche dividende est remplie avant tout achat." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Dividende avant d’acheter »", titre: "Le prix payé et la solidité de l’entreprise font la décision",
    fiche: [
      ["Rendement du dividende calculé", function(D,H){ var d=H.N(D.dv_div), p=H.N(D.dv_prix); return d&&p?(d/p*100).toFixed(2).replace('.',',')+' %':''; }],
      ["L’action étudiée", function(D){ return D.dv_soc||''; }],
      ["Dividende payé", function(D){ return D.dv_paye||''; }],
      ["Prix observé", function(D){ return D.dv_px||''; }],
      ["Bénéfice", function(D){ return D.dv_bn||''; }],
      ["Frais", function(D){ return D.dv_fr||''; }],
      ["Ma stratégie", function(D){ return D.dv_strat||''; }],
      ["Ma décision", function(D){ return D.dv_phrase||''; }]
    ],
    suite: { t: "Un portefeuille qui paie mes factures : la stratégie des dividendes", p: "Vous savez juger un dividende. L’atelier suivant construit un portefeuille de dividendes autour de vos dépenses.", lien: "atelier-portefeuille-factures.html", b: "Ouvrir l’atelier" }
  }
};
