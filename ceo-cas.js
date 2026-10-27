/* EFA CEO Challenge · Études de cas de stratégie
   Entreprises fictives, contextes UEMOA et CEMAC. Tous les chiffres sont des hypothèses d'exercice.
   Schéma d'un cas : pièces (tableaux à lire), entrées (curseurs ou cases à cocher), calc(x) recalculé en direct,
   sorties, étapes guidées (texte, info, nombre, qcm, action), puis une recommandation justifiée. */
(function (racine) {
  "use strict";
  var CAS = [
    /* ───────── 1 · Rentabilité ───────── */
    { id: "money", titre: "Kalao Money : les profits s'effondrent", entreprise: "Kalao Money", secteur: "Mobile money · Côte d'Ivoire", type: "Rentabilité", duree: "20 min", chapitres: ["m2", "m3", "m10"],
      role: "Vous êtes consultant, appelé par la directrice générale.",
      situation: "Kalao Money a gagné 600 000 clients en un an, et pourtant son profit est passé de 13 milliards de FCFA à une perte. La directrice veut comprendre pourquoi, et savoir quoi faire.",
      pieces: [
        { titre: "Pièce 1 · Indicateurs de Kalao Money", entete: ["", "Année N−1", "Année N"], lignes: [
          ["Clients actifs", "2,0 millions", "2,6 millions"], ["Transactions par client et par mois", "10", "10"], ["Montant moyen d'une transaction", "20 000 FCFA", "20 000 FCFA"],
          ["Commission moyenne prélevée", "1,0 %", "0,6 %"], ["Commission versée à l'agent, par transaction", "70 FCFA", "70 FCFA"], ["Coûts fixes (réseau, personnel, marketing)", "18 Md FCFA", "20 Md FCFA"]] },
        { titre: "Pièce 2 · Le marché", note: "Un nouvel entrant propose depuis 14 mois des transferts gratuits entre particuliers. Kalao a répondu en baissant ses tarifs sur tous les services. Les paiements chez les commerçants et les factures représentent encore moins de 10 % des transactions de Kalao." }],
      entrees: [{ id: "cl", lab: "Clients actifs", min: 2, max: 3.5, pas: .1, v: 2.6, u: "millions" }, { id: "r", lab: "Commission moyenne", min: .3, max: 1.2, pas: .05, v: .6, u: "%" },
        { id: "ag", lab: "Commission de l'agent", min: 40, max: 90, pas: 5, v: 70, u: "FCFA par transaction" }, { id: "cf", lab: "Coûts fixes", min: 16, max: 24, pas: .5, v: 20, u: "Md FCFA" }],
      calc: function (x) {
        var tx = x.cl * 1e6 * 120, rt = 20000 * x.r / 100;
        return { tx: tx / 1e6, rt: rt, rev: tx * rt / 1e9, prof: tx * (rt - x.ag) / 1e9 - x.cf, d: tx * (rt - x.ag) / 1e9 - x.cf - 13.2 };
      },
      sorties: [["tx", "Transactions par an", "n", "millions"], ["rt", "Revenu par transaction", "n", "FCFA"], ["rev", "Revenus", "d1", "Md FCFA"], ["prof", "Profit", "s1", "Md FCFA"], ["d", "Écart avec N−1 (13,2 Md)", "s1", "Md FCFA"]],
      etapes: [
        { t: "texte", q: "Avant de lire les chiffres : comment découperiez-vous la baisse du profit ? Écrivez votre structure en quelques lignes.",
          modele: ["Profit = revenus − coûts.", "Revenus = clients × transactions par client × montant moyen × commission prélevée.", "Coûts variables = commission versée aux agents, par transaction.", "Coûts fixes = réseau, personnel, marketing.", "Hypothèse de départ : un concurrent gratuit a fait baisser notre commission moyenne ; je commence par le revenu par transaction."] },
        { t: "info", texte: "Lisez la pièce 1, à gauche. Les curseurs sont réglés sur l'année N. Vous pourrez les faire varier pour tester vos idées." },
        { t: "nombre", q: "Quels étaient les revenus de l'année N−1, en milliards de FCFA ?", unite: "Md FCFA", tol: 0, rep: function () { return 48; },
          pieges: [{ v: 4, msg: "C'est un mois de revenus. Multipliez par 12." }, { v: 4.8, tol: .01, msg: "Il manque un zéro : 2 millions × 120 transactions × 200 FCFA = 48 milliards." }],
          corr: "2 millions × 10 × 12 = 240 millions de transactions ; × 20 000 × 1 % = 200 FCFA chacune ; 48 milliards de FCFA." },
        { t: "nombre", q: "Quel est le profit de l'année N, en milliards (une décimale, avec le signe) ?", unite: "Md FCFA", tol: .05, rep: function () { return -4.4; },
          pieges: [{ v: 15.6, msg: "C'est la marge sur les agents. Retirez les 20 milliards de coûts fixes." }, { v: 4.4, msg: "Le signe compte : c'est une perte." }],
          corr: "312 millions de transactions × (120 − 70) FCFA = 15,6 Md ; − 20 Md de coûts fixes = − 4,4 Md." },
        { t: "qcm", q: "Qu'est-ce qui explique l'essentiel de la chute de 17,6 milliards ?", choix: ["La hausse des coûts fixes", "La baisse de la commission moyenne, de 200 à 120 FCFA par transaction", "Les nouveaux clients, moins actifs"], bonne: 1,
          fb: ["Elle pèse 2 milliards seulement.", "Juste : aux volumes de N, 80 FCFA de moins sur 312 millions de transactions, c'est 25 milliards de revenus perdus. Les nouveaux clients en ont rapporté une partie.", "La pièce 1 montre que les nouveaux clients font autant de transactions que les anciens."],
          corr: "Décomposition : +600 000 clients rapportent 72 millions de transactions × 130 FCFA = +9,4 Md ; la baisse de commission coûte 312 millions × 80 = −25 Md ; les coûts fixes −2 Md." },
        { t: "action", consigne: "Aux volumes de l'année N (2,6 millions de clients, agent à 70 FCFA, coûts fixes à 20 Md), trouvez la commission moyenne la plus basse qui évite la perte.",
          test: function (x, o) { return Math.round(x.cl * 10) === 26 && x.ag === 70 && x.cf === 20 && o.prof >= 0 && Math.round(x.r * 100) === 70; } },
        { t: "qcm", q: "Remonter tous les tarifs à 0,7 % vous fait-il gagner la partie ?", choix: ["Oui, le problème est réglé", "Non : face à un concurrent gratuit sur les transferts, il faut gagner ailleurs (paiements marchands, factures, épargne, crédit) et revoir la commission des agents sur les transferts", "Il faut fermer des agences"], bonne: 1,
          fb: ["Les clients sensibles au prix des transferts risquent de partir chez le concurrent.", "Juste : on ne gagne pas une guerre des prix contre un acteur qui a choisi la gratuité ; on change la source de revenus.", "Kalao fonctionne par agents, pas par agences : les coûts fixes ne sont pas la cause."] }
      ],
      decision: { q: "Votre recommandation à la directrice générale", choix: [
        { t: "Remonter la commission moyenne à 0,7 % sur tous les services", retour: "Cela efface la perte sur le papier, à volumes constants. Mais la pièce 2 montre que le concurrent est gratuit sur les transferts : vous risquez de perdre des clients, et le calcul ne tiendra pas." },
        { t: "Aligner le prix des transferts, mais développer les paiements marchands, les factures et l'épargne, et renégocier la commission des agents", retour: "La réponse la plus solide : vous acceptez la règle du marché sur les transferts et vous allez chercher la marge là où le concurrent n'est pas. Prochaine étape : chiffrer le potentiel des paiements chez les commerçants." },
        { t: "Rendre les transferts gratuits pour reprendre la main", retour: "Risqué : sans autre source de revenus, la perte se creuse. Défendable seulement avec un plan de revenus très précis et un actionnaire prêt à financer les pertes." }] } },

    /* ───────── 2 · Taille de marché et entrée ───────── */
    { id: "brasserie", titre: "Brasserie du Golfe : entrer au Cameroun ?", entreprise: "Brasserie du Golfe", secteur: "Boissons · Togo vers Cameroun", type: "Entrée sur un marché", duree: "25 min", chapitres: ["m4", "m5", "m9", "m11"],
      role: "Vous êtes consultant pour le conseil d'administration.",
      situation: "Brasserie du Golfe, basée à Lomé, veut s'implanter au Cameroun, en zone CEMAC. Le conseil vous demande : le marché vaut-il l'effort, et par quelle porte entrer ?",
      pieces: [
        { titre: "Pièce 1 · Hypothèses de marché (à défendre)", entete: ["Hypothèse", "Valeur"], lignes: [["Population", "28 millions"], ["Part des adultes", "50 %"], ["Part des adultes qui boivent de la bière", "40 %"], ["Consommation par buveur", "40 litres par an"], ["Prix moyen au litre", "1 000 FCFA"]] },
        { titre: "Pièce 2 · La concurrence", entete: ["Acteur", "Part de marché", "Atout"], lignes: [["Leader local", "70 %", "40 000 points de vente, marques anciennes"], ["N° 2", "15 %", "Prix bas"], ["N° 3", "5 %", "Usine récente, sous-utilisée"], ["Importations et artisanal", "10 %", "—"]] },
        { titre: "Pièce 3 · Trois façons d'entrer", entete: ["Mode", "Investissement", "Part visée", "Gain par litre", "Délai"], lignes: [["Construire une usine", "25 Md", "8 %", "120 FCFA de marge", "3 ans"], ["Partenariat avec un embouteilleur", "2 Md de marketing", "6 %", "60 FCFA de redevance", "6 mois"], ["Racheter le n° 3", "18 Md", "5 % puis 8 %", "110 FCFA de marge", "1 an"]], note: "Exporter depuis Lomé ferait payer des droits de douane à l'entrée de la CEMAC : la bière est lourde et la marge fine." }],
      entrees: [{ id: "pop", lab: "Population", min: 20, max: 35, pas: 1, v: 28, u: "millions" }, { id: "ad", lab: "Part des adultes", min: 40, max: 60, pas: 1, v: 50, u: "%" }, { id: "co", lab: "Part qui boit de la bière", min: 20, max: 60, pas: 1, v: 40, u: "%" },
        { id: "l", lab: "Litres par buveur et par an", min: 20, max: 80, pas: 1, v: 40, u: "L" }, { id: "px", lab: "Prix au litre", min: 800, max: 1200, pas: 50, v: 1000, u: "FCFA" },
        { id: "pm", lab: "Notre part de marché (usine)", min: 2, max: 15, pas: 1, v: 5, u: "%" }, { id: "mg", lab: "Notre marge par litre (usine)", min: 60, max: 200, pas: 10, v: 100, u: "FCFA" }],
      calc: function (x) {
        var vol = x.pop * x.ad / 100 * x.co / 100 * x.l, val = vol * x.px / 1000, nous = vol * x.pm / 100, prof = nous * x.mg / 1000, pp = vol * .06 * 60 / 1000;
        return { vol: vol, val: val, nous: nous, prof: prof, recU: prof > 0 ? 25 / prof : null, pp: pp, recP: pp > 0 ? 2 / pp : null };
      },
      sorties: [["vol", "Marché en volume", "n", "millions de litres"], ["val", "Marché en valeur", "n", "Md FCFA"], ["nous", "Nos volumes (usine)", "d1", "millions de litres"], ["prof", "Profit annuel (usine)", "d2", "Md FCFA"], ["recU", "Délai de récupération (usine, 25 Md)", "d1", "ans"], ["pp", "Redevances annuelles (partenariat)", "d2", "Md FCFA"], ["recP", "Délai de récupération (partenariat, 2 Md)", "d1", "ans"]],
      etapes: [
        { t: "texte", q: "Quelle structure proposez-vous pour répondre au conseil ?", modele: ["1. Le marché : taille, croissance, rentabilité.", "2. La concurrence : qui tient le marché, et par quoi (distribution, marques, prix).", "3. Nos capacités : ce que nous apportons de différent.", "4. Le mode d'entrée : usine, partenariat, rachat, export.", "5. L'économie : investissement, profit, délai de récupération, risques (change entre XOF et XAF, douane, réaction du leader)."] },
        { t: "nombre", q: "Avec les hypothèses de la pièce 1, combien de litres de bière par an au Cameroun, en millions ?", unite: "millions de litres", tol: 0, rep: function () { return 224; },
          pieges: [{ v: 560, msg: "Vous avez oublié la part de buveurs : 40 % des adultes." }, { v: 448, msg: "Vous avez oublié la part des adultes : 50 %." }], corr: "28 × 50 % × 40 % = 5,6 millions de buveurs ; × 40 litres = 224 millions de litres." },
        { t: "nombre", q: "Et en valeur, en milliards de FCFA ?", unite: "Md FCFA", tol: 0, rep: function () { return 224; }, corr: "224 millions de litres × 1 000 FCFA = 224 milliards de FCFA." },
        { t: "action", consigne: "Réglez le scénario « usine » de la pièce 3 : 8 % de part de marché et 120 FCFA de marge par litre.", test: function (x) { return x.pm === 8 && x.mg === 120; } },
        { t: "nombre", q: "Délai de récupération de l'usine, en années (une décimale) ?", unite: "ans", tol: .1, rep: function () { return 11.6; }, pieges: [{ v: 3, msg: "Trois ans, c'est le temps de construction, pas de récupération." }], corr: "224 × 8 % = 17,9 millions de litres × 120 FCFA = 2,15 Md par an ; 25 ÷ 2,15 = 11,6 ans, sans compter les 3 ans de construction." },
        { t: "nombre", q: "Délai de récupération du partenariat, en années (une décimale) ?", unite: "ans", tol: .1, rep: function () { return 2.5; }, corr: "224 × 6 % × 60 FCFA = 0,81 Md par an ; 2 ÷ 0,81 = 2,5 ans." },
        { t: "qcm", q: "Quel est le principal risque du partenariat ?", choix: ["Le change entre XOF et XAF", "La dépendance à l'embouteilleur : il garde le client, et peut changer d'avis", "La qualité de la bière"], bonne: 1,
          fb: ["XOF et XAF ont la même parité fixe avec l'euro : le risque de change est faible, même si la conversion a un coût.", "Juste : on l'encadre par contrat (durée, exclusivité, objectifs de volume, option de rachat).", "Contrôlable par un cahier des charges et des audits."] }
      ],
      decision: { q: "Votre recommandation au conseil d'administration", choix: [
        { t: "Construire une usine pour maîtriser toute la chaîne", retour: "Ambitieux, mais près de 12 ans pour récupérer 25 milliards, après 3 ans de travaux, face à un leader qui tient 40 000 points de vente : peu de conseils l'accepteraient sans preuve que la marque prend." },
        { t: "Entrer par un partenariat avec un embouteilleur, avec une option de rachat et des objectifs de volume", retour: "La réponse la plus défendable : récupération en 2 à 3 ans, accès immédiat à la distribution, et l'option de passer à l'usine ou au rachat si la marque prend." },
        { t: "Racheter le n° 3 pour aller vite", retour: "Défendable si son usine est vraiment sous-utilisée : vous achetez de la capacité et des points de vente. Mais 18 milliards pour 5 % de part, il faut vérifier les comptes et le réseau avant d'offrir." },
        { t: "Ne pas entrer", retour: "Défendable si la priorité est la zone UEMOA. Mais 224 milliards de marché, c'est beaucoup à laisser sans même un test." }] } },

    /* ───────── 3 · Estimation et nouveau modèle ───────── */
    { id: "motos", titre: "Motos électriques à Cotonou", entreprise: "Zem'Volt", secteur: "Mobilité · Bénin", type: "Taille de marché · lancement", duree: "20 min", chapitres: ["m4", "m9", "m10"],
      role: "Vous êtes consultant pour une jeune entreprise et ses investisseurs.",
      situation: "Zem'Volt veut équiper les conducteurs de motos-taxis de Cotonou de motos électriques, avec des stations où l'on échange une batterie vide contre une pleine. Les investisseurs demandent : combien de stations, quel prix, quel profit ?",
      pieces: [
        { titre: "Pièce 1 · Hypothèses de départ", entete: ["Hypothèse", "Valeur"], lignes: [["Habitants du Grand Cotonou", "2,5 millions"], ["Trajets en moto-taxi par habitant et par jour", "0,8"], ["Courses par moto et par jour", "25"], ["Part des motos converties la première année", "5 %"]] },
        { titre: "Pièce 2 · Économie d'un conducteur", note: "Aujourd'hui, un conducteur dépense environ 3 000 FCFA d'essence par jour. Avec une moto électrique, il fait 2 échanges de batterie par jour. Il ne changera que s'il économise au moins 500 FCFA par jour." },
        { titre: "Pièce 3 · Une station", entete: ["Poste", "Valeur"], lignes: [["Investissement (bâtiment, chargeurs, stock de batteries)", "40 M FCFA"], ["Frais fixes par an (loyer, gardiens, maintenance)", "12 M FCFA"], ["Capacité", "200 échanges par jour"], ["Coût d'un échange (électricité, usure de la batterie)", "550 FCFA"]] }],
      entrees: [{ id: "pop", lab: "Habitants", min: 1.5, max: 3.5, pas: .1, v: 2.5, u: "millions" }, { id: "tr", lab: "Trajets par habitant et par jour", min: .3, max: 1.5, pas: .1, v: .8, u: "" }, { id: "cm", lab: "Courses par moto et par jour", min: 15, max: 40, pas: 1, v: 25, u: "" },
        { id: "pc", lab: "Motos converties", min: 1, max: 20, pas: 1, v: 5, u: "%" }, { id: "e", lab: "Échanges par moto et par jour", min: 1, max: 3, pas: .5, v: 2, u: "" }, { id: "p", lab: "Prix d'un échange", min: 600, max: 1500, pas: 50, v: 1000, u: "FCFA" }, { id: "c", lab: "Coût d'un échange", min: 300, max: 900, pas: 25, v: 550, u: "FCFA" }],
      calc: function (x) {
        var parc = x.pop * 1e6 * x.tr / x.cm, conv = parc * x.pc / 100, ech = conv * x.e, st = Math.ceil(ech / 200 - 1e-9), marge = ech * (x.p - x.c) * 360 / 1e6, prof = marge - st * 12, capex = st * 40;
        return { parc: parc, conv: conv, ech: ech, st: st, prof: prof, capex: capex, rec: prof > 0 ? capex / prof : null, eco: 3000 - x.e * x.p };
      },
      sorties: [["parc", "Motos-taxis dans la ville", "n", ""], ["conv", "Motos converties", "n", ""], ["ech", "Échanges par jour", "n", ""], ["st", "Stations nécessaires", "n", ""], ["eco", "Économie du conducteur par jour", "s0", "FCFA"], ["prof", "Profit annuel de Zem'Volt", "s0", "M FCFA"], ["capex", "Investissement", "n", "M FCFA"], ["rec", "Délai de récupération", "d1", "ans"]],
      etapes: [
        { t: "texte", q: "Comment structurez-vous la réponse aux investisseurs ?", modele: ["1. La taille du marché : nombre de motos-taxis, part convertible.", "2. L'économie du conducteur : gagne-t-il à changer ? Peut-il financer la moto ?", "3. L'économie de Zem'Volt : marge par échange, stations, frais fixes, investissement.", "4. Les risques : coupures d'électricité, financement des motos, règles municipales, concurrents."] },
        { t: "nombre", q: "Combien de motos-taxis circulent à Cotonou selon ces hypothèses ?", unite: "motos", tol: 0, rep: function () { return 80000; },
          pieges: [{ v: 2000000, msg: "C'est le nombre de trajets par jour. Chaque moto en fait 25." }], corr: "2,5 millions × 0,8 = 2 millions de trajets par jour ; ÷ 25 courses par moto = 80 000 motos." },
        { t: "nombre", q: "Combien de stations faut-il, avec 5 % de motos converties et 2 échanges par jour ?", unite: "stations", tol: 0, rep: function () { return 40; }, corr: "4 000 motos × 2 = 8 000 échanges par jour ; ÷ 200 par station = 40 stations." },
        { t: "nombre", q: "Profit annuel de Zem'Volt au prix de 1 000 FCFA, en millions (sur 360 jours) ?", unite: "M FCFA", tol: 0, rep: function () { return 816; },
          pieges: [{ v: 1296, msg: "C'est la marge sur les échanges. Retirez les frais fixes de 40 stations : 480 M." }], corr: "8 000 × (1 000 − 550) × 360 = 1 296 M ; − 40 × 12 = 480 M ; profit 816 M. Investissement 1 600 M : récupéré en 2 ans environ." },
        { t: "action", consigne: "Trouvez le prix d'échange le plus élevé qui laisse au conducteur au moins 500 FCFA d'économie par jour (2 échanges par jour).", test: function (x, o) { return x.e === 2 && x.p === 1250 && o.eco >= 500; } },
        { t: "nombre", q: "À ce prix, quel est le profit annuel, en millions ?", unite: "M FCFA", tol: 0, rep: function () { return 1536; }, corr: "8 000 × (1 250 − 550) × 360 = 2 016 M ; − 480 = 1 536 M. Mais un conducteur qui n'économise que 500 FCFA changera-t-il ?" },
        { t: "qcm", q: "Quel est le risque principal du lancement ?", choix: ["Le prix de l'électricité", "Les conducteurs n'ont pas l'argent pour acheter une moto électrique", "Le nombre de stations"], bonne: 1,
          fb: ["Il compte, mais la marge par échange l'absorbe en partie.", "Juste : sans financement de la moto (location-vente payée chaque jour par mobile money), personne ne change, même avec une économie.", "Il se règle avec le rythme du déploiement."] }
      ],
      decision: { q: "Votre recommandation aux investisseurs", choix: [
        { t: "Déployer 40 stations dès la première année", retour: "Les chiffres le permettent sur le papier, mais 1,6 milliard avant d'avoir prouvé que les conducteurs changent, c'est beaucoup de risque." },
        { t: "Un pilote de 10 stations dans deux quartiers, avec location-vente des motos, et un critère : 800 conducteurs actifs en 6 mois", retour: "La réponse la plus solide : vous testez la vraie inconnue (l'adoption) pour un quart de l'investissement, avec un critère chiffré pour décider la suite." },
        { t: "Ne pas lancer", retour: "Défendable si l'électricité est trop instable dans les quartiers visés. Sinon, le marché de 80 000 motos justifie au moins un test." }] } },

    /* ───────── 4 · Prix et concurrence ───────── */
    { id: "ciment", titre: "Ciments Wouri face aux importations", entreprise: "Ciments Wouri", secteur: "Industrie · Cameroun", type: "Prix et concurrence", duree: "20 min", chapitres: ["m6", "m3", "m9"],
      role: "Vous êtes consultant auprès du directeur général.",
      situation: "Ciments Wouri, à Douala, voit arriver un ciment importé 12 % moins cher. Ses quincailliers commencent à changer de fournisseur. Le directeur hésite : baisser ses prix, ou faire autre chose ?",
      pieces: [
        { titre: "Pièce 1 · Ciments Wouri avant les importations", entete: ["Indicateur", "Valeur"], lignes: [["Volumes vendus", "1,2 million de tonnes"], ["Prix moyen", "90 000 FCFA la tonne"], ["Coût variable", "60 000 FCFA la tonne"], ["Coûts fixes", "20 Md FCFA par an"]] },
        { titre: "Pièce 2 · Ce que disent les études clients (hypothèses)", entete: ["Levier", "Effet estimé"], lignes: [["Ne rien faire", "25 % des volumes partent chez l'importateur"], ["Baisser le prix", "Chaque point de baisse ramène environ 2 points de volume ; à −12 %, plus aucune perte"], ["Livraison et crédit à 30 jours pour les quincailliers", "Chaque 1 000 FCFA dépensés par tonne garde 3 points de volume"], ["Programme de coûts (combustible, clinker)", "Jusqu'à 6 000 FCFA d'économie par tonne, en 18 mois"]] }],
      entrees: [{ id: "bp", lab: "Baisse de prix", min: 0, max: 12, pas: 1, v: 0, u: "%" }, { id: "sv", lab: "Service aux quincailliers", min: 0, max: 4000, pas: 500, v: 0, u: "FCFA par tonne" }, { id: "ec", lab: "Économies de coûts", min: 0, max: 6000, pas: 500, v: 0, u: "FCFA par tonne" }],
      calc: function (x) {
        var perte = Math.max(0, 25 - 25 * x.bp / 12 - 3 * x.sv / 1000), V = 1.2 * (1 - perte / 100), P = 90000 * (1 - x.bp / 100), m = P - (60000 - x.ec) - x.sv;
        return { perte: perte, V: V, P: P, m: m, ca: V * P / 1000, prof: V * m / 1000 - 20, d: V * m / 1000 - 36 };
      },
      sorties: [["perte", "Volumes perdus", "d1", "%"], ["V", "Volumes vendus", "d2", "Mt"], ["P", "Prix moyen", "n", "FCFA/t"], ["m", "Marge par tonne", "n", "FCFA"], ["ca", "Chiffre d'affaires", "d1", "Md FCFA"], ["prof", "Profit", "s1", "Md FCFA"], ["d", "Écart avec avant (16 Md)", "s1", "Md FCFA"]],
      etapes: [
        { t: "texte", q: "Comment structurez-vous le problème ?", modele: ["1. La menace : à quel prix, quelle qualité, quelles quantités l'importateur peut-il livrer, et combien de temps ?", "2. Nos clients : qui part (grands chantiers, quincailliers), et pourquoi (prix, crédit, livraison).", "3. Nos options : prix, service, coûts, segmentation des clients.", "4. L'économie de chaque option : profit, et ce qu'elle déclenche chez l'importateur."] },
        { t: "nombre", q: "Quel était le profit avant l'arrivée des importations, en milliards ?", unite: "Md FCFA", tol: 0, rep: function () { return 16; }, pieges: [{ v: 36, msg: "C'est la marge sur coûts variables. Retirez les 20 milliards de coûts fixes." }], corr: "1,2 Mt × 30 000 FCFA = 36 Md ; − 20 Md = 16 Md." },
        { t: "nombre", q: "Profit si Ciments Wouri ne fait rien, en milliards ?", unite: "Md FCFA", tol: 0, rep: function () { return 7; }, corr: "0,9 Mt × 30 000 = 27 Md ; − 20 = 7 Md. Le profit est divisé par plus de deux." },
        { t: "nombre", q: "Profit si Ciments Wouri s'aligne sur l'importateur (−12 %), en milliards (une décimale) ?", unite: "Md FCFA", tol: .05, rep: function () { return 3; },
          pieges: [{ v: 16, msg: "Les volumes sont sauvés, mais pas la marge : elle tombe à 19 200 FCFA par tonne." }], corr: "Prix 79 200, marge 19 200 ; 1,2 Mt × 19 200 = 23,0 Md ; − 20 = 3,0 Md. S'aligner coûte plus cher que ne rien faire." },
        { t: "action", consigne: "Combinez les trois leviers pour atteindre au moins 10 milliards de profit.", test: function (x, o) { return o.prof >= 10; } },
        { t: "qcm", q: "Les économies de coûts prendront 18 mois. Que faire pendant ce temps ?", choix: ["Tout miser sur la baisse de prix", "Garder le prix pour les quincailliers fidèles en leur offrant livraison et crédit, et réserver une baisse ciblée aux grands chantiers", "Attendre les économies"], bonne: 1,
          fb: ["La pièce 2 montre que c'est le levier le plus coûteux.", "Juste : on segmente, on protège la marge là où le service compte, on se bat sur le prix seulement où il le faut.", "En 18 mois, l'importateur aura pris vos meilleurs clients."] }
      ],
      decision: { q: "Votre recommandation au directeur général", choix: [
        { t: "S'aligner sur le prix de l'importateur", retour: "Le calcul le montre : 3 milliards de profit, contre 7 sans rien faire. On ne gagne pas une guerre des prix avec une marge plus faible." },
        { t: "Offrir livraison et crédit aux quincailliers, baisser le prix seulement sur les grands chantiers, et lancer le programme de coûts", retour: "La réponse la plus solide : chaque levier est chiffré, la marge est protégée, et la baisse des coûts prépare une réponse durable." },
        { t: "Demander une protection douanière à l'État", retour: "Un complément possible si l'importateur vend sous son prix de revient, mais il faut des preuves, et la décision prend du temps. Ce n'est pas une stratégie à elle seule." }] } },

    /* ───────── 5 · Fusion et acquisition ───────── */
    { id: "microfinance", titre: "Banque Nyota rachète une microfinance", entreprise: "Banque Nyota", secteur: "Banque · Burkina Faso", type: "Fusion et acquisition", duree: "20 min", chapitres: ["m7", "m10", "m11"],
      role: "Vous conseillez le comité de direction de Banque Nyota.",
      situation: "Banque Nyota veut toucher les petits commerçants et les agriculteurs. L'actionnaire de Wendé Microfinance accepte de vendre, et demande 16 milliards de FCFA. Faut-il payer ce prix ?",
      pieces: [
        { titre: "Pièce 1 · Wendé Microfinance", entete: ["Indicateur", "Valeur"], lignes: [["Clients", "120 000"], ["Points de service", "38"], ["Encours de crédit", "45 Md FCFA"], ["Crédits en retard de plus de 90 jours", "6 %"], ["Résultat net annuel", "1,2 Md FCFA"]] },
        { titre: "Pièce 2 · Comparables et synergies (estimations de l'équipe)", entete: ["Élément", "Valeur"], lignes: [["Microfinances cédées récemment", "7 à 9 fois le résultat net"], ["Synergies de coûts (informatique commune, refinancement moins cher)", "0,6 Md par an"], ["Synergies de revenus (comptes, cartes, transferts)", "0,8 Md par an"], ["Coût d'intégration", "1,5 Md, une fois"], ["Taux de rendement exigé", "15 %"]], note: "Le changement d'actionnaire doit être autorisé par les autorités de supervision. Comptez plusieurs mois." }],
      entrees: [{ id: "mu", lab: "Multiple du résultat net", min: 6, max: 10, pas: .5, v: 8, u: "fois" }, { id: "sc", lab: "Synergies de coûts", min: 0, max: 1.2, pas: .1, v: .6, u: "Md par an" }, { id: "sr", lab: "Synergies de revenus", min: 0, max: 1.5, pas: .1, v: .8, u: "Md par an" },
        { id: "pr", lab: "Probabilité de réaliser les revenus", min: 0, max: 100, pas: 10, v: 50, u: "%" }, { id: "ci", lab: "Coût d'intégration", min: .5, max: 3, pas: .1, v: 1.5, u: "Md" }, { id: "px", lab: "Prix offert", min: 8, max: 18, pas: .2, v: 16, u: "Md" }],
      calc: function (x) {
        var seule = 1.2 * x.mu, syn = x.sc / .15 + x.sr / .15 * x.pr / 100 - x.ci, max = seule + syn;
        return { seule: seule, syn: syn, max: max, cree: max - x.px, cede: syn > 0 ? (x.px - seule) / syn * 100 : null };
      },
      sorties: [["seule", "Valeur de Wendé seule", "d1", "Md"], ["syn", "Synergies nettes", "d2", "Md"], ["max", "Prix maximal", "d1", "Md"], ["cree", "Valeur créée pour Nyota", "s1", "Md"], ["cede", "Part des synergies donnée au vendeur", "n", "%"]],
      etapes: [
        { t: "texte", q: "Quelle structure pour décider du prix ?", modele: ["1. Que vaut Wendé seule ? (résultat, qualité du portefeuille de crédits, comparables)", "2. Que valent les synergies ? (coûts, revenus, moins le coût d'intégration, avec leur probabilité)", "3. Quel prix maximal, et quelle offre ?", "4. Les risques : crédits en retard, départ des agents de crédit, autorisation des autorités, systèmes informatiques."] },
        { t: "nombre", q: "Valeur de Wendé seule à 8 fois le résultat, en milliards ?", unite: "Md", tol: .05, rep: function () { return 9.6; }, corr: "1,2 × 8 = 9,6 Md." },
        { t: "nombre", q: "Synergies nettes avec 50 % de chances de réaliser les revenus, en milliards (une décimale) ?", unite: "Md", tol: .05, rep: function () { return 5.2; },
          pieges: [{ v: 7.8, tol: .06, msg: "Vous comptez les synergies de revenus comme certaines. Pondérez-les par 50 %." }, { v: 6.7, tol: .06, msg: "Vous avez oublié le coût d'intégration : 1,5 Md." }], corr: "Coûts : 0,6 ÷ 0,15 = 4,0. Revenus : 0,8 ÷ 0,15 × 50 % = 2,7. Moins 1,5 : 5,2 Md." },
        { t: "qcm", q: "Le vendeur demande 16 milliards. Le prix maximal est d'environ 14,8. Que faire ?", choix: ["Accepter : c'est proche", "Ne pas payer 16 : Nyota perdrait 1,2 milliard de valeur", "Payer 16 et compter sur des synergies plus fortes"], bonne: 1,
          fb: ["« Proche » au-dessus du prix maximal, c'est détruire de la valeur.", "Juste : au-delà de 14,8, Nyota donne au vendeur plus que toutes les synergies.", "C'est la façon la plus courante de rater une acquisition."] },
        { t: "action", consigne: "Avec les hypothèses de base, réglez un prix offert qui laisse au moins 2 milliards de valeur créée pour Nyota, sans descendre sous la valeur de Wendé seule.", test: function (x, o) { return o.cree >= 2 && x.px >= o.seule - 1e-9 && x.mu === 8 && Math.round(x.pr) === 50; } },
        { t: "qcm", q: "Le vendeur refuse votre offre. Comment débloquer la négociation sans payer trop ?", choix: ["Monter à 16", "Un prix ferme proche de votre offre, plus un complément versé dans 3 ans si les revenus croisés sont atteints", "Rompre tout de suite"], bonne: 1,
          fb: ["Vous perdez la valeur créée.", "Juste : le complément de prix (earn-out) fait porter au vendeur une partie du risque sur les synergies les plus incertaines.", "Possible, mais il reste une solution qui protège les deux parties."] }
      ],
      decision: { q: "Votre recommandation au comité de direction", choix: [
        { t: "Payer les 16 milliards demandés", retour: "Au-dessus du prix maximal de 14,8 : Nyota paierait au vendeur plus que les synergies qu'elle espère. Peu de comités l'accepteraient sans une raison stratégique forte et chiffrée." },
        { t: "Offrir environ 12,5 milliards, plus un complément lié aux revenus croisés dans 3 ans", retour: "La réponse la plus solide : vous gardez la valeur créée, vous partagez le risque des synergies incertaines, et le vendeur peut atteindre son prix si les résultats suivent." },
        { t: "Renoncer et ouvrir ses propres points de service", retour: "Défendable si la négociation échoue. Mais construire 38 points et 120 000 clients prend des années, et l'équipe de terrain de Wendé est ce que vous achetez." }] } },

    /* ───────── 6 · Opérations ───────── */
    { id: "mangues", titre: "Vergers de Sikasso : les mangues perdues", entreprise: "Vergers de Sikasso", secteur: "Agriculture · Mali", type: "Opérations", duree: "20 min", chapitres: ["m8", "m9", "m10"],
      role: "Vous conseillez la coopérative et son bailleur.",
      situation: "La coopérative récolte 10 000 tonnes de mangues par an, mais une grande partie pourrit avant la vente. Un bailleur propose de financer une solution. Laquelle choisir, et dans quel ordre ?",
      pieces: [
        { titre: "Pièce 1 · La coopérative aujourd'hui", entete: ["Indicateur", "Valeur"], lignes: [["Récolte", "10 000 tonnes par an"], ["Pertes avant la vente", "40 %"], ["Prix de vente des mangues fraîches", "150 FCFA le kilo"]] },
        { titre: "Pièce 2 · Trois solutions", entete: ["Option", "Investissement", "Coût par an", "Effet"], lignes: [["A · Caisses, tri et collecte en 48 h", "—", "60 M", "−10 points de pertes"], ["B · Chambre froide et camion frigorifique", "900 M", "120 M", "Pertes ramenées à 15 % (12 % avec A)"], ["C · Unité de séchage", "400 M", "150 M", "Sèche jusqu'à 2 000 t de mangues qui seraient perdues ; 10 kg frais pour 1 kg séché, vendu 2 000 FCFA"]] }],
      entrees: [{ id: "L", lab: "Pertes actuelles", min: 20, max: 50, pas: 1, v: 40, u: "%" }, { id: "pf", lab: "Prix du kilo frais", min: 100, max: 300, pas: 10, v: 150, u: "FCFA" },
        { id: "a", lab: "Option A · caisses, tri et collecte", bool: true, v: 0 }, { id: "b", lab: "Option B · chaîne du froid", bool: true, v: 0 }, { id: "c", lab: "Option C · unité de séchage", bool: true, v: 0 }],
      calc: function (x) {
        var Lp = x.L; if (x.a) Lp = Math.max(5, Lp - 10); if (x.b) Lp = Math.min(Lp, x.a ? 12 : 15);
        var perdu = 10000 * Lp / 100, seche = x.c ? Math.min(2000, perdu) : 0, frais = 10000 - perdu;
        var ca = frais * x.pf / 1000 + seche / 10 * 2, couts = x.a * 60 + x.b * 120 + x.c * 150, capex = x.b * 900 + x.c * 400, base = 10000 * (1 - x.L / 100) * x.pf / 1000, gain = ca - couts - base;
        return { frais: frais, perdu: perdu - seche, seche: seche, ca: ca, gain: gain, capex: capex, rec: capex > 0 ? (gain > 0 ? capex / gain : null) : (gain > 0 ? 0 : null), vp: (perdu - seche) * x.pf / 1000 };
      },
      sorties: [["frais", "Vendues fraîches", "n", "t"], ["seche", "Séchées (mangues fraîches)", "n", "t"], ["perdu", "Encore perdues", "n", "t"], ["vp", "Valeur encore perdue", "n", "M FCFA"], ["ca", "Chiffre d'affaires", "n", "M FCFA"], ["gain", "Gain net par an, par rapport à aujourd'hui", "s0", "M FCFA"], ["capex", "Investissement", "n", "M FCFA"], ["rec", "Délai de récupération", "d1", "ans"]],
      etapes: [
        { t: "texte", q: "Comment structurez-vous le problème des pertes ?", modele: ["1. Où se perdent les mangues : récolte, transport, stockage, attente au marché.", "2. Les solutions, en trois familles : perdre moins (caisses, tri, froid), vendre plus vite, transformer ce qui serait perdu (séchage, jus).", "3. Pour chaque solution : gain par an, investissement, délai de récupération, facilité de mise en œuvre.", "4. L'ordre : gains rapides d'abord, investissements lourds ensuite."] },
        { t: "nombre", q: "Quelle valeur la coopérative perd-elle chaque année, en millions de FCFA ?", unite: "M FCFA", tol: 0, rep: function () { return 600; }, pieges: [{ v: .6, tol: .01, msg: "Attention aux unités : une tonne, c'est 1 000 kilos." }], corr: "4 000 tonnes × 1 000 kg × 150 FCFA = 600 M FCFA." },
        { t: "action", consigne: "Activez seulement l'option A.", test: function (x) { return x.a === 1 && !x.b && !x.c && x.L === 40 && x.pf === 150; } },
        { t: "nombre", q: "Gain net annuel de l'option A, en millions ?", unite: "M FCFA", tol: 0, rep: function () { return 90; }, pieges: [{ v: 150, msg: "C'est le gain brut. Retirez les 60 M de coût annuel." }], corr: "1 000 tonnes sauvées × 150 = 150 M ; − 60 M = 90 M par an, sans investissement." },
        { t: "action", consigne: "Activez seulement l'option C.", test: function (x) { return x.c === 1 && !x.a && !x.b && x.L === 40 && x.pf === 150; } },
        { t: "nombre", q: "Délai de récupération de l'option C, en années (une décimale) ?", unite: "ans", tol: .1, rep: function () { return 1.6; }, corr: "2 000 t séchées donnent 200 t × 2 000 FCFA = 400 M ; − 150 M = 250 M par an ; 400 ÷ 250 = 1,6 an." },
        { t: "qcm", q: "Dans quel ordre recommandez-vous les solutions ?", choix: ["B d'abord : c'est elle qui réduit le plus les pertes", "A tout de suite (sans investissement), C pour la prochaine saison, B seulement avec un contrat d'achat qui paie le froid", "Les trois en même temps"], bonne: 1,
          fb: ["B réduit le plus les pertes, mais récupère son coût en 3,5 ans et il faut une électricité fiable.", "Juste : gain rapide, puis l'investissement au meilleur rendement, puis le plus lourd quand un client le justifie.", "Avec A et B, il reste moins de mangues à sécher : les solutions se recouvrent, testez-le avec les cases."] }
      ],
      decision: { q: "Votre recommandation au bailleur", choix: [
        { t: "Financer la chaîne du froid (B)", retour: "Elle réduit le plus les pertes, mais c'est la plus chère et la plus lente à rembourser. À réserver au jour où un acheteur (export, supermarché) paie pour des mangues fraîches de qualité." },
        { t: "A tout de suite, puis l'unité de séchage (C) pour la prochaine saison", retour: "La réponse la plus solide : 90 M par an sans investissement, puis 400 M remboursés en moins de 2 ans. Testez A et C ensemble : le gain dépasse 300 M par an." },
        { t: "Les trois solutions ensemble", retour: "Elles se recouvrent : avec A et B, il reste trop peu de mangues perdues pour faire tourner le séchoir. L'ensemble coûte 1,3 milliard pour un gain qui n'est pas la somme des trois." }] } }
  ];

  var API = { CAS: CAS };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else racine.EFA_CEO_CAS = API;
})(this);
