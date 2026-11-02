/* Atelier guidé · Mon budget qui tient, même avec un revenu irrégulier */
window.ATELIER = {
  id: "budget-qui-tient",
  titre: "Mon budget qui tient",
  h1: "Votre revenu varie. Votre budget, lui, peut tenir.",
  voix: "auto",
  /* Calculs partagés : six mois de revenu, revenu de référence, poches, caisse tampon */
  _s: function(D,H){ var L=["bq_m1","bq_m2","bq_m3","bq_m4","bq_m5","bq_m6"].map(function(k){return H.N(D[k]);}).filter(function(x){return x>0;}); if(!L.length) return null; var t=L.reduce(function(s,x){return s+x;},0); return {n:L.length,bas:Math.min.apply(null,L),moy:t/L.length,haut:Math.max.apply(null,L)}; },
  _ref: function(D,H){ var r=H.N(D.bq_ref); if(r) return r; var s=window.ATELIER._s(D,H); return s?s.bas:0; },
  _pc: function(D,H){ function g(k,d){ return (D[k]==null||String(D[k]).trim()==='')?d:H.N(D[k]); } return {e:g("bq_pe",60),a:g("bq_pa",20),v:g("bq_pv",20)}; },
  _cible: function(D,H){ var n=H.N(D.bq_tmois); return n?n*window.ATELIER._ref(D,H):0; },
  question: {
    t: "Ces six derniers mois, votre revenu a varié entre 90 000 F et 300 000 F. Sur quel montant bâtissez-vous votre budget ?",
    r: [
      ["a", "Sur ma moyenne, autour de 190 000 F.", "C’est le réflexe de beaucoup. Mais la moyenne n’arrive presque jamais : un mois sur deux, le budget craque. Cet atelier vous montre une base plus solide.", false],
      ["b", "Sur un montant proche du mois bas.", "Exactement. Un budget bâti sur le mois bas tient même les mauvais mois. Ce qui dépasse les bons mois part dans une caisse tampon.", true]
    ]
  },
  chapitres: [
    { t: "Mon revenu réel", acq: "Je connais mon revenu réel", desc: "Six mois de revenus, du plus bas au plus haut.", e: [
      { t: "Six mois, pas un seul", c: "Un seul mois ne dit rien. Six mois montrent votre vrai revenu : le bas, le moyen et le haut.",
        w: { ex: "Moussa, commerçant : 150 000, 320 000, 210 000, 90 000, 260 000 et 230 000 F. Mois bas : 90 000 F. Moyen : 210 000 F. Haut : 320 000 F.", k: "Ce que vous avez reçu chaque mois (F)", c3: 1, champs: [ {id:"bq_m1", l:"Il y a 6 mois"}, {id:"bq_m2", l:"Il y a 5 mois"}, {id:"bq_m3", l:"Il y a 4 mois"}, {id:"bq_m4", l:"Il y a 3 mois"}, {id:"bq_m5", l:"Il y a 2 mois"}, {id:"bq_m6", l:"Le mois dernier"} ],
          v: function(D,H){ var s=window.ATELIER._s(D,H); if(!s) return ''; return '<div class="gros"><small>Votre revenu sur '+s.n+' mois</small><b>de '+H.F(s.bas)+' à '+H.F(s.haut)+'</b><p>Mois moyen : '+H.F(s.moy)+'. L’écart entre le bas et le haut : '+H.F(s.haut-s.bas)+'.</p></div>'; } },
        p: "Mes six derniers mois de revenu sont écrits." },
      { t: "Ce qui fait varier mon revenu", c: "Quand on sait pourquoi le revenu bouge, on voit venir les mois creux.",
        w: { puces: { id:"bq_var", k:"Ce qui fait varier le vôtre", m:1, l:["Saisons de vente","Nombre de missions","Primes et commissions","Clients qui paient en retard","Ventes à crédit","Fêtes et rentrée scolaire","Récoltes"] } },
        p: "J’ai repéré ce qui fait varier mon revenu." }
    ]},
    { t: "Mon revenu de référence", acq: "Je sais sur quoi me payer", desc: "Le budget se bâtit sur le mois bas, pas sur l’espoir.", e: [
      { t: "Le mois bas, pas la moyenne", c: "Le mois bas revient toujours. Un budget bâti dessus ne craque pas quand il arrive.",
        w: { quiz: [ ["Moussa a gagné entre 90 000 F et 320 000 F. Sur quoi bâtir son budget ?", ["Sur son mois moyen, 210 000 F","Sur un montant proche du mois bas"], 1, "Avec la moyenne, un mois sur deux manque. Avec le mois bas, chaque mois est couvert."], ["Un bon mois, ce qui dépasse le budget…", ["C’est un bonus à dépenser","Va dans la caisse tampon pour les mois creux"], 1, "C’est ce qui lisse les mois : les bons paient pour les creux."] ] },
        p: "Je sais pourquoi je me paie sur le mois bas." },
      { t: "Mon revenu de référence", c: "C’est le montant que vous vous versez chaque mois, comme un salaire. Partez de votre mois bas.",
        w: { ex: "Moussa a un mois bas à 90 000 F et un mois moyen à 210 000 F. Il fixe son revenu de référence à 100 000 F.", champs: [ {id:"bq_ref", l:"Mon revenu de référence (F)"} ],
          v: function(D,H){ var A=window.ATELIER, s=A._s(D,H), r=A._ref(D,H); if(!r) return ''; var h='<div class="gros"><small>Votre revenu de référence</small><b>'+H.F(r)+' par mois</b>'+(s&&s.moy>r?'<p>Un mois moyen, environ '+H.F(s.moy-r)+' iront à la caisse tampon.</p>':'')+'</div>'; if(!s) return h; var v=r<=s.bas?['v-ok','Solide : il tient même votre plus mauvais mois.']:r<=s.moy?['v-mid','Possible, mais les mois bas, il faudra compléter avec la caisse tampon. Gardez-le près du mois bas.']:['v-ko','Il dépasse votre mois moyen : ce budget ne tiendra pas. Rapprochez-le de votre mois bas.']; return h+'<div class="verdict '+v[0]+'">'+v[1]+'</div>'; } },
        p: "Mon revenu de référence est fixé." },
      { t: "Me verser un salaire", f: ["Tout ce qui rentre arrive d’abord au même endroit : le compte ou le porte-monnaie de réception.", "Une fois par mois, je me verse mon revenu de référence, comme un salaire.", "Le reste part dans la caisse tampon. Pour un commerce : la caisse de la boutique et l’argent de la maison restent séparés."], c: "Même à son compte, on peut se payer un salaire. C’est ce qui rend le mois prévisible.",
        p: "Je sais comment me verser mon salaire chaque mois." }
    ]},
    { t: "Les trois poches", acq: "Je répartis en trois poches", desc: "Essentiel, avenir, vie : chaque franc a sa place.", e: [
      { t: "Ce qui va où", c: "L’essentiel fait vivre la maison. L’avenir prépare demain. La vie, c’est le plaisir et les sorties, sans culpabilité.",
        w: { quiz: [ ["Le loyer et la nourriture", ["Essentiel","Vie"], 0, "Sans eux, la maison ne tourne pas."], ["La cotisation de tontine pour un terrain", ["Avenir","Vie"], 0, "Elle prépare un projet : c’est l’avenir."], ["Un pagne pour la fête du quartier", ["Essentiel","Vie"], 1, "C’est la poche vie. Elle existe pour cela."] ] },
        p: "Je sais ranger une dépense dans la bonne poche." },
      { t: "Mes pourcentages", c: "Repère indicatif : 60 % pour l’essentiel, 20 % pour l’avenir, 20 % pour la vie. Ajustez-le à votre situation.",
        w: { ex: "Sur un revenu de référence de 100 000 F, Moussa met 60 000 F dans l’essentiel, 20 000 F dans l’avenir et 20 000 F dans la vie.", k: "Vos pourcentages (laissez vide pour garder 60, 20, 20)", c3: 1, champs: [ {id:"bq_pe", l:"Essentiel (%)", ph:"60"}, {id:"bq_pa", l:"Avenir (%)", ph:"20"}, {id:"bq_pv", l:"Vie (%)", ph:"20"} ],
          v: function(D,H){ var A=window.ATELIER, r=A._ref(D,H), p=A._pc(D,H), t=p.e+p.a+p.v; if(t!==100) return '<div class="verdict v-mid">Vos trois poches font '+t+' %. Ajustez-les pour arriver à 100 %.</div>'; if(!r) return '<div class="verdict v-mid">Fixez d’abord votre revenu de référence au chapitre 2.</div>'; return '<div class="gros"><small>Vos trois poches sur '+H.F(r)+'</small><b>'+H.F(r*p.e/100)+' · '+H.F(r*p.a/100)+' · '+H.F(r*p.v/100)+'</b><p>Essentiel · Avenir · Vie</p></div>'; } },
        p: "Mes trois pourcentages sont choisis." },
      { t: "Mon essentiel tient-il ?", c: "On vérifie que la poche essentielle couvre vraiment la maison. Comptez seulement ce qui ne peut pas attendre.",
        w: { ex: "L’essentiel de Moussa coûte 68 000 F, sa poche en prévoit 60 000 F. Il passe à 70 % d’essentiel et 10 % de vie, le temps de réduire une dépense.", k: "Votre essentiel d’un mois (F)", c3: 1, champs: [ {id:"bq_log", l:"Logement"}, {id:"bq_nou", l:"Nourriture"}, {id:"bq_tra", l:"Transport"}, {id:"bq_eco", l:"École"}, {id:"bq_san", l:"Santé"}, {id:"bq_sol", l:"Famille et solidarité"} ],
          v: function(D,H){ var A=window.ATELIER, t=["bq_log","bq_nou","bq_tra","bq_eco","bq_san","bq_sol"].reduce(function(s,k){return s+H.N(D[k]);},0); if(!t) return ''; var r=A._ref(D,H), pe=r*A._pc(D,H).e/100, h='<div class="gros"><small>Votre essentiel réel</small><b>'+H.F(t)+' par mois</b>'+(pe?'<p>Votre poche essentielle prévoit '+H.F(pe)+'.</p>':'')+'</div>'; if(!pe) return h; var v=t<=pe?['v-ok','Votre poche essentielle couvre la maison.']:t<=pe*1.15?['v-mid','Il manque '+H.F(t-pe)+'. Prenez-le sur la poche vie pour l’instant, et cherchez une dépense à alléger.']:['v-ko','Il manque '+H.F(t-pe)+'. Revoyez vos pourcentages ou une grosse dépense : le budget doit d’abord couvrir l’essentiel.']; return h+'<div class="verdict '+v[0]+'">'+v[1]+'</div>'; } },
        p: "J’ai vérifié que mon essentiel tient dans sa poche." }
    ]},
    { t: "La caisse tampon", acq: "Je construis ma caisse tampon", desc: "Combien, où la garder, quand l’alimenter.", e: [
      { t: "Combien dans la caisse ?", c: "La caisse tampon complète votre salaire les mois creux. Repère EFA : de un à trois mois de revenu de référence. Plus le revenu varie, plus on vise haut.",
        w: { puces: { id:"bq_tmois", k:"Combien de mois de revenu de référence ?", l:["1 mois","2 mois","3 mois"] },
          v: function(D,H){ var A=window.ATELIER, c=A._cible(D,H); if(!c) return ''; return '<div class="gros"><small>Votre caisse tampon cible</small><b>'+H.F(c)+'</b><p>Elle ne remplace pas votre réserve de sécurité : la caisse lisse les mois, la réserve paie les urgences.</p></div>'; } },
        p: "Je connais le montant de ma caisse tampon." },
      { t: "Où la garder", c: "Elle doit être disponible vite, mais assez loin pour ne pas être dépensée.",
        w: { puces: { id:"bq_tou", k:"Où pensez-vous la garder ?", l:["Mobile money séparé","Compte d’épargne","Caisse ou microfinance agréée","Dans la caisse de la boutique","À la maison"] },
          v: function(D){ var R={"Mobile money séparé":["v-ok","Pratique et disponible. Gardez un porte-monnaie qui ne sert qu’à cela."],"Compte d’épargne":["v-ok","Disponible et séparé : un bon choix."],"Caisse ou microfinance agréée":["v-ok","Bon choix si l’établissement est agréé et le retrait rapide."],"Dans la caisse de la boutique":["v-ko","Elle se mélangera au fonds de commerce et finira en marchandise. Séparez-la."],"À la maison":["v-ko","Trop facile à dépenser, et exposée au vol. À éviter."]}[D.bq_tou]; return R?'<div class="verdict '+R[0]+'">'+R[1]+'</div>':''; } },
        p: "J’ai choisi où garder ma caisse tampon." },
      { t: "La remplir les bons mois", c: "Un bon mois, vous vous versez votre salaire. Tout le reste va dans la caisse, jusqu’à ce qu’elle soit pleine.",
        w: { ex: "Moussa gagne 260 000 F ce mois-ci. Il se verse 100 000 F. Les 160 000 F restants vont dans la caisse.", champs: [ {id:"bq_tdej", l:"Déjà dans la caisse (F)"}, {id:"bq_bon", l:"Ce que je gagne un bon mois (F)"} ],
          v: function(D,H){ var A=window.ATELIER, r=A._ref(D,H), b=H.N(D.bq_bon), c=A._cible(D,H), d=H.N(D.bq_tdej), s=A._s(D,H); if(!r||!b) return ''; var x=Math.max(0,b-r), h='<div class="gros"><small>Un bon mois, vers la caisse</small><b>'+H.F(x)+'</b>'; if(c){ var m=s?Math.max(0,s.moy-r):x; h+='<p>'+(d>=c?'Votre caisse est déjà pleine : le surplus peut aller à la poche avenir.':m?'À votre rythme moyen ('+H.F(m)+' par mois), caisse pleine dans environ '+Math.ceil((c-d)/m)+' mois.':'')+'</p>'; } h+='</div>'; if(s&&s.bas<r) h+='<div class="verdict v-mid">Un mois bas à '+H.F(s.bas)+', vous prendrez '+H.F(r-s.bas)+' dans la caisse pour vous verser votre salaire.</div>'; return h; } },
        p: "Je sais ce qui va dans ma caisse les bons mois." }
    ]},
    { t: "Tenir chaque semaine", acq: "Je tiens mon budget dans la durée", desc: "Un rituel court, des porte-monnaie séparés, une règle pour les imprévus.", e: [
      { t: "Mon rituel de la semaine", f: ["Le même jour, je regarde ce qui reste dans chaque poche.", "J’ai un mobile money pour l’essentiel et un autre pour la caisse tampon.", "J’écris en une ligne l’imprévu de la semaine et la poche qui l’a payé."], c: "À partir de 1 min par semaine. C’est la régularité qui fait tenir le budget, pas la perfection.",
        w: { consignes: 1, puces: { id:"bq_jour", k:"Le jour de votre rituel", l:["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"] } },
        p: "Le jour de mon rituel est choisi." },
      { t: "Imprévu ou mois creux ?", c: "La caisse tampon complète votre salaire. Elle ne paie pas tout ce qui arrive.",
        w: { quiz: [ ["Ce mois-ci, vous ne gagnez que 70 000 F au lieu de 100 000 F", ["Je complète avec la caisse tampon","Je coupe dans l’essentiel"], 0, "C’est son rôle : lisser le mois creux sans toucher à la maison."], ["Un cousin demande 30 000 F pour la rentrée de son fils", ["Je prends dans la caisse tampon","Je prends dans la poche vie ou la ligne solidarité"], 1, "La caisse sert à vous verser votre salaire. L’aide à la famille a sa ligne à elle."], ["Des funérailles au village, 50 000 F", ["C’est une urgence : la réserve de sécurité","C’est un mois creux : la caisse tampon"], 0, "Une urgence se paie avec la réserve de sécurité. Sans réserve, l’atelier suivant vous aide à la construire."] ] },
        p: "Je sais quelle poche paie quoi." },
      { t: "Ma règle pour la famille", c: "Dire combien vous pouvez donner, c’est protéger la famille autant que vous.",
        w: { ex: "Fatou réserve 10 000 F par mois à la solidarité. Quand c’est épuisé, elle dit : « Ce mois-ci, ma part est déjà donnée. Le mois prochain, je pourrai. »", champs: [ {id:"bq_regle", l:"Ma règle quand on me demande de l’aide", type:"area", ph:"Je donne jusqu’à … F par mois. Au-delà, je réponds : …"} ] },
        p: "Ma règle est écrite." }
    ]}
  ],
  fin: {
    k: "Ma fiche budget qui tient", titre: "Votre budget tient debout",
    fiche: [
      ["Mon revenu sur six mois", function(D,H){ var s=window.ATELIER._s(D,H); return s?'bas '+H.F(s.bas)+' · moyen '+H.F(s.moy)+' · haut '+H.F(s.haut):''; }],
      ["Mon revenu de référence", function(D,H){ var r=window.ATELIER._ref(D,H); return r?H.F(r)+' par mois':''; }],
      ["Mes trois poches", function(D,H){ var A=window.ATELIER, r=A._ref(D,H), p=A._pc(D,H); if(!r||p.e+p.a+p.v!==100) return ''; return 'essentiel '+H.F(r*p.e/100)+' · avenir '+H.F(r*p.a/100)+' · vie '+H.F(r*p.v/100); }],
      ["Mon essentiel réel", function(D,H){ var t=["bq_log","bq_nou","bq_tra","bq_eco","bq_san","bq_sol"].reduce(function(s,k){return s+H.N(D[k]);},0); return t?H.F(t)+' par mois':''; }],
      ["Ma caisse tampon cible", function(D,H){ var c=window.ATELIER._cible(D,H); return c?H.F(c)+' ('+D.bq_tmois+')':''; }],
      ["Où je la garde", function(D){ return D.bq_tou||''; }],
      ["Le jour de mon rituel", function(D){ return D.bq_jour||''; }],
      ["Ma règle pour la famille", function(D){ return D.bq_regle||''; }]
    ],
    suite: { t: "Ma réserve de sécurité", p: "Votre budget tient les mois creux. Construisez maintenant la réserve qui paie les vraies urgences, sans vous endetter.", lien: "atelier-reserve-securite.html", b: "Ouvrir l’atelier" }
  }
};
