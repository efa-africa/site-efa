/* Atelier guidé · Ethereum, Solana et TON : qu'achetez-vous vraiment ? (17 nov. 2026)
   Éducation, pas recommandation. Aucun cours de crypto cité (trop volatil). Actifs A/B et exemples : fictifs.
   Mise en garde des autorités de l'UMOA sur les fausses plateformes. Résultat : « Ma fiche avant toute crypto ». */
window.ATELIER = {
  id: "crypto-reseaux",
  titre: "Ethereum, Solana et TON : qu’achetez-vous vraiment ?",
  h1: "Un réseau utile, un actif, un prix : trois questions différentes.",
  voix: "auto",
  question: {
    t: "« J’ai acheté une crypto parce qu’elle coûtait moins cher que l’ETH. Elle a donc plus de chances de monter. » Vrai ?",
    r: [
      ["a", "Oui, une petite crypto a plus de place pour grimper.", "C’est l’erreur la plus fréquente. Le prix d’une unité ne dit presque rien : il dépend du nombre d’unités. On le calcule au chapitre 1.", false],
      ["b", "Non, le prix d’une unité ne dit pas si c’est cher.", "Exactement. Cet atelier vous apprend à regarder l’usage, la valeur totale et les risques, avant tout achat.", true]
    ]
  },
  chapitres: [
    { t: "Ce que vous achetez", acq: "Je sais à quoi sert un actif et je compare des valeurs totales", desc: "Trois réseaux, trois actifs. Un petit prix n’est pas un bon prix.", e: [
      { t: "Trois réseaux, trois actifs", c: "Ethereum, Solana et TON sont des réseaux sur lesquels on effectue des transactions et on utilise des applications. Chacun a un actif qui sert à son fonctionnement.",
        f: ["Ethereum, actif ETH : payer les frais de transaction (le « gas », qui varie avec la demande) et participer à la sécurisation du réseau.", "Solana, actif SOL : payer les frais de transaction et participer à la sécurisation du réseau.", "TON, son actif natif : payer les transactions et l’exécution de certaines applications.", "Ces usages expliquent pourquoi l’actif existe. Ils ne prouvent pas que son prix montera."],
        w: { consignes: 1, quiz: [
          ["Un réseau est très utilisé. Le prix de son actif va-t-il forcément monter ?", ["Oui, l’usage fait le prix","Non, l’usage explique l’actif, il ne garantit pas son prix"], 1, "Une technologie utile peut continuer de se développer pendant que le prix de son actif baisse."]
        ] },
        p: "Je sais à quoi sert l’actif, et que cela ne garantit pas son prix." },
      { t: "Une crypto à « petit prix » n’est pas forcément bon marché", c: "Awa compare deux actifs fictifs. A coûte 1 000 000 F l’unité, il en existe 100 000. B coûte 1 000 F l’unité, il en existe 1 milliard. B paraît bien moins cher. Pourtant, la valeur de toutes ses unités est de 1 000 milliards de F, contre 100 milliards pour A.",
        w: { ex: "Valeur totale = prix d’une unité × nombre d’unités. Attention aussi aux unités pas encore en circulation, et aux règles de leur émission future.", k: "Comparez deux actifs", champs: [ {id:"cr_pa", l:"Actif A : prix d’une unité (F)"}, {id:"cr_na", l:"Actif A : nombre d’unités"}, {id:"cr_pb", l:"Actif B : prix d’une unité (F)"}, {id:"cr_nb", l:"Actif B : nombre d’unités"} ],
          v: function(D,H){ var a=H.N(D.cr_pa)*H.N(D.cr_na), b=H.N(D.cr_pb)*H.N(D.cr_nb); if(!a||!b) return ''; var M=function(x){ return x>=1e9?H.F(Math.round(x/1e9)).replace(/ ?F$/,'')+' milliards de F':H.F(x); };
            return '<div class="gros"><small>Valeur totale · A · B</small><b>'+M(a)+' · '+M(b)+'</b><p>'+(b>a?'L’actif au plus petit prix est le plus cher au total : '+Math.round(b/a)+' fois A.':a>b?'A vaut '+Math.round(a/b)+' fois B au total.':'Même valeur totale.')+' La bonne question : quelle part de cette valeur totale j’achète, et qu’est-ce qui peut la changer ?</p></div>'; } },
        p: "Je compare des valeurs totales, pas des prix d’unité." }
    ]},
    { t: "Usage, récompenses et risques", acq: "Je mesure ce qu’il me resterait en FCFA et je repère les risques hors graphique", desc: "Une application populaire ne garantit pas son jeton. Une récompense en crypto n’est pas un revenu en FCFA.", e: [
      { t: "Une application populaire ne garantit pas la valeur de son jeton", c: "TON attire par ses applications, notamment autour de Telegram. Solana et Ethereum hébergent aussi beaucoup d’applications. Il reste une étape : comment l’usage du réseau se traduit-il, ou non, en demande durable pour son actif ?",
        f: ["Une application peut être très utilisée sans que ses utilisateurs achètent ou gardent beaucoup de l’actif.", "Des transactions nombreuses ne justifient pas n’importe quel prix d’achat.", "Regardez séparément : le produit, l’activité réelle, l’actif, et le prix demandé."],
        w: { consignes: 1, quiz: [
          ["Une appli a 10 millions d’utilisateurs. Que vérifiez-vous d’abord ?", ["Rien, c’est la preuve que l’actif va monter","Si ces utilisateurs ont réellement besoin d’acheter et de garder l’actif"], 1, "L’usage d’une application et la demande pour l’actif du réseau sont deux choses différentes."]
        ] },
        p: "Je sépare le produit, l’usage, l’actif et son prix." },
      { t: "« Je peux recevoir des récompenses » : et mon capital ?", c: "Ethereum et Solana permettent le « staking » : selon la façon de participer, un détenteur peut recevoir des récompenses. Mais une récompense en crypto n’est pas un revenu garanti en FCFA. Frais, conditions techniques, validateur et prix de l’actif comptent.",
        w: { ex: "Exemple fictif : 100 000 F investis. Les récompenses ajoutent 5 % d’unités, le prix de l’unité baisse de 30 % : 100 000 × 1,05 × 0,70 = 73 500 F. Plus d’unités, mais 26 500 F de perdus, avant frais.", k: "Votre calcul", c3: 1, champs: [ {id:"cr_m", l:"Somme investie (F)"}, {id:"cr_rec", l:"Récompenses, en % d’unités"}, {id:"cr_px", l:"Variation du prix (%), signe moins si baisse", type:"txt", ph:"-30"} ],
          v: function(D,H){ var m=H.N(D.cr_m); if(!m||!D.cr_px) return ''; var r=parseFloat(String(D.cr_rec||0).replace(',','.'))||0, p=parseFloat(String(D.cr_px).replace(',','.'))||0, f=Math.round(m*(1+r/100)*(1+p/100)), e=f-m;
            return '<div class="gros"><small>Ce qu’il vous resterait en FCFA, avant frais</small><b>'+H.F(f)+' · '+(e>=0?'+':'−')+H.F(Math.abs(e))+'</b><p>Le rendement affiché en unités ne dit pas ce qui vous restera dans votre monnaie.</p></div>'; } },
        p: "Je calcule ce qu’il me resterait en FCFA, pas en unités." },
      { t: "Le risque n’est pas seulement sur le graphique", c: "Serge pense pouvoir supporter une forte baisse. Il oublie le reste : où acheter ? Qui garde les clés d’accès ? Comment vérifier qu’une application ou une offre de rendement est authentique ? Comment récupérer ses fonds ? Les autorités de l’UMOA mettent en garde contre les levées de fonds trompeuses et les fausses plateformes liées aux cryptomonnaies.",
        f: ["Ce risque existe quelle que soit la qualité technique d’Ethereum, de Solana ou de TON.", "Deux questions à séparer : ce réseau peut-il être utile ? Cet achat, sur cette plateforme, à ce prix, convient-il à mon argent ?", "Un rendement « garanti » en crypto est un signal d’alarme."],
        w: { consignes: 1, quiz: [
          ["Un contact WhatsApp vous propose 10 % par mois en « staking TON ». Que faites-vous ?", ["J’essaie avec une petite somme","Je refuse : un rendement garanti élevé, par un contact non vérifié, est le schéma classique de l’arnaque"], 1, "Personne ne peut garantir un tel rendement. Voyez l’atelier « On vous promet un rendement garanti »."]
        ] },
        p: "Je vérifie la plateforme et la garde des clés, pas seulement le prix." }
    ]},
    { t: "Ma décision", acq: "J’ai rempli ma fiche avant toute crypto, ou décidé de ne pas investir", desc: "Il n’est pas nécessaire de posséder une crypto pour apprendre à l’analyser.", e: [
      { t: "Votre décision EFA", c: "Vous envisagez de consacrer 100 000 F à l’un de ces actifs. Avant tout achat, remplissez la fiche. La première compétence : distinguer un réseau intéressant, un actif utile et un prix d’achat raisonnable.",
        w: { champs: [ {id:"cr_res", l:"Le réseau étudié", type:"txt", ph:"Ethereum, Solana, TON…"}, {id:"cr_pb2", l:"Quel problème ce réseau cherche-t-il à résoudre ?", type:"area"}, {id:"cr_usage", l:"À quoi sert concrètement son actif ?", type:"txt"}, {id:"cr_donnees", l:"Quelles données montrent un usage réel ?", type:"txt"}, {id:"cr_emission", l:"Combien d’unités circulent, quelles règles d’émission ?", type:"txt"}, {id:"cr_garde", l:"Où et comment je conserverais l’actif", type:"txt"} ],
          puces: [ { id:"cr_dispo", k:"Cette somme peut-elle rester indisponible pour mes besoins essentiels ?", l:["Oui","Non"] }, { id:"cr_dec", k:"Ma décision", l:["Avant d’investir, il me manque encore des réponses","Je choisis de ne pas investir"] } ],
          v: function(D,H){ var h=''; var m=100000; h+='<div class="gros"><small>Votre position de 100 000 F après une baisse de 40 %</small><b>'+H.F(60000)+'</b><p>Pouvez-vous voir cette somme fondre de 40 000 F sans toucher à vos besoins ?</p></div>'; if(D.cr_dispo==='Non') h+='<div class="verdict v-ko">Cette somme a déjà une mission. Elle n’a pas sa place dans un actif aussi variable.</div>'; if(D.cr_dec) h+='<div class="verdict v-ok">'+H.esc(D.cr_dec)+'. C’est une décision, et elle est dans votre fiche.</div>'; return h; } },
        p: "Ma fiche est remplie, avec une décision." }
    ]}
  ],
  fin: {
    k: "Ma fiche « Avant toute crypto »", titre: "Un réseau intéressant, un actif utile et un prix raisonnable sont trois choses différentes",
    fiche: [
      ["Réseau étudié", function(D){ return D.cr_res||''; }],
      ["Le problème qu’il résout", function(D){ return D.cr_pb2||''; }],
      ["Usage de l’actif", function(D){ return D.cr_usage||''; }],
      ["Unités et émission", function(D){ return D.cr_emission||''; }],
      ["Conservation", function(D){ return D.cr_garde||''; }],
      ["Somme disponible sans risque pour mes besoins", function(D){ return D.cr_dispo||''; }],
      ["Ma décision", function(D){ return D.cr_dec||''; }]
    ],
    suite: { t: "On vous promet un rendement garanti : que vérifier avant de payer ?", p: "Les fausses offres de crypto sont fréquentes. L’atelier suivant vous apprend à les reconnaître avant de payer.", lien: "atelier-rendement-garanti.html", b: "Ouvrir l’atelier" }
  }
};
