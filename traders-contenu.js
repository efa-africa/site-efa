/* EFA Traders · contenus : entreprises fictives, devises, scénarios, tutoriels, glossaire, diagnostic.
   Toutes les entreprises sont fictives. Les événements sont inventés pour l'exercice.
   Version des scénarios : toute correction crée une nouvelle version (ne jamais modifier une version publiée). */
(function (racine) {
  "use strict";

  var ACTIFS = {
    KLT: { type: "action", nom: "Kalao Télécom", secteur: "Télécommunications", depart: 4250, volume: 6000,
      activite: "Opérateur mobile et mobile money dans trois pays fictifs.",
      infos: ["Chiffre d'affaires : 412 milliards FCFA", "Résultat net : 58 milliards FCFA", "Dividende versé chaque année depuis 6 ans"],
      risques: ["Guerre des prix entre opérateurs", "Nouvelles taxes sur les transactions mobiles"],
      regimes: [{ tendance: 0.04, volat: 1.2 }] },
    BNY: { type: "action", nom: "Banque Nyota", secteur: "Banque", depart: 7800, volume: 3500,
      activite: "Banque de détail et crédit aux PME.",
      infos: ["Total de bilan : 2 100 milliards FCFA", "Résultat net : 41 milliards FCFA", "Créances douteuses : 7 % des crédits"],
      risques: ["Hausse des impayés", "Variation des taux directeurs"],
      regimes: [{ tendance: 0.03, volat: 1.0 }] },
    SOL: { type: "action", nom: "Énergie Soleya", secteur: "Énergie", depart: 2150, volume: 9000,
      activite: "Production d'électricité solaire et thermique.",
      infos: ["Capacité installée : 640 MW", "Résultat net : 9 milliards FCFA", "Endettement élevé pour financer les centrales"],
      risques: ["Retards de paiement de l'État client", "Coût du carburant des centrales thermiques"],
      regimes: [{ tendance: 0.02, volat: 1.6 }] },
    CBK: { type: "action", nom: "Ciments Bakar", secteur: "Industrie", depart: 12500, volume: 1800,
      activite: "Cimenterie et matériaux de construction.",
      infos: ["Production : 2,4 millions de tonnes", "Résultat net : 22 milliards FCFA", "Trois grands clients font 40 % des ventes"],
      risques: ["Arrêt de grands chantiers publics", "Prix de l'énergie"],
      regimes: [{ tendance: 0.03, volat: 1.3 }] },
    AGD: { type: "action", nom: "Agro Djeli", secteur: "Agriculture", depart: 1640, volume: 11000,
      activite: "Achat, transformation et export de cacao et d'anacarde.",
      infos: ["Volumes traités : 180 000 tonnes", "Résultat net : 6 milliards FCFA", "Résultats très liés à la saison des pluies"],
      risques: ["Mauvaise récolte", "Baisse des cours mondiaux"],
      regimes: [{ tendance: 0.02, volat: 2.0 }] },
    KNG: { type: "action", nom: "Distrib Kanaga", secteur: "Distribution", depart: 3600, volume: 5000,
      activite: "Supermarchés et grossiste alimentaire.",
      infos: ["86 magasins", "Résultat net : 11 milliards FCFA", "Marge faible, volumes élevés"],
      risques: ["Inflation qui réduit le pouvoir d'achat", "Concurrence des marchés de quartier"],
      regimes: [{ tendance: 0.03, volat: 1.1 }] },
    EURUSD: { type: "devise", nom: "Euro / Dollar", base: "EUR", cotation: "USD", depart: 11000,
      regimes: [{ tendance: 0, volat: 0.45 }] },
    GBPUSD: { type: "devise", nom: "Livre sterling / Dollar", base: "GBP", cotation: "USD", depart: 12700,
      regimes: [{ tendance: 0, volat: 0.55 }] }
  };

  var SCENARIOS = [
    { id: "hesitant", version: 1, titre: "Marché hésitant", niveau: "Débutant", duree: "15 min",
      competence: "Distinguer observation et anticipation",
      situation: "Deux valeurs montent et baissent sans direction durable. Rien ne dit ce qui viendra ensuite.",
      consigne: "Décidez si vous investissez, combien, ou si vous attendez. Justifiez chaque décision.",
      univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 40, actifs: ["KLT", "BNY"],
      regimes: { KLT: [{ tendance: 0, volat: 1.5 }], BNY: [{ tendance: 0, volat: 1.2 }] },
      evenements: [
        { seance: 10, actif: "KLT", titre: "Kalao Télécom confirme ses objectifs annuels", texte: "Rien de nouveau : l'entreprise répète ce qu'elle avait annoncé.", choc: 0 },
        { seance: 24, actif: "BNY", titre: "Banque Nyota : résultats trimestriels conformes aux attentes", texte: "Les chiffres correspondent à ce que le marché attendait.", choc: 0.5 }
      ],
      transfert: "Sur un marché sans direction claire, qu'est-ce qui distingue une observation (« le cours a monté 3 jours ») d'une anticipation (« il va continuer ») ?" },
    { id: "retournement", version: 1, titre: "Hausse puis retournement", niveau: "Débutant", duree: "15 min",
      competence: "Comprendre le risque d'extrapolation",
      situation: "Énergie Soleya monte régulièrement depuis plusieurs semaines. Tout le monde en parle.",
      consigne: "Décidez d'entrer, de rester ou de sortir. Notez ce que vous pensez au moment de chaque décision.",
      univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 40, actifs: ["SOL", "KNG"],
      regimes: { SOL: [{ jusqua: -12, tendance: 0, volat: 1.1 }, { jusqua: 18, tendance: 0.75, volat: 1.3 }, { tendance: -0.95, volat: 1.9 }] },
      evenements: [
        { seance: 6, actif: "SOL", titre: "Énergie Soleya inaugure une nouvelle centrale", texte: "La presse salue le projet. Le cours a déjà beaucoup monté.", choc: 1.0 },
        { seance: 18, actif: "SOL", titre: "L'État client annonce des retards de paiement", texte: "Une partie des factures d'électricité sera payée avec six mois de retard.", choc: -6 }
      ],
      transfert: "Une valeur a monté 10 séances de suite. Quelles informations vous manquent pour savoir si la hausse va durer ?" },
    { id: "nouvelle", version: 1, titre: "Mauvaise nouvelle", niveau: "Intermédiaire", duree: "15 min",
      competence: "Mesurer l'exposition",
      situation: "Vous pouvez répartir votre capital entre une banque et une société agricole. Une information inattendue va tomber.",
      consigne: "Avant chaque achat, calculez la part de votre capital exposée à chaque entreprise.",
      univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 35, actifs: ["AGD", "BNY"],
      evenements: [
        { seance: 9, actif: "AGD", titre: "Pluies insuffisantes : Agro Djeli revoit sa récolte en baisse", texte: "L'entreprise prévoit 25 % de volumes en moins cette saison.", choc: -14 },
        { seance: 20, actif: "AGD", titre: "Agro Djeli obtient un contrat d'export", texte: "Le contrat compense une partie des volumes perdus.", choc: 2 }
      ],
      transfert: "Si 70 % de votre capital était dans une seule entreprise et qu'elle perdait 20 %, combien perdrait votre portefeuille ?" },
    { id: "frais", version: 1, titre: "Frais répétés", niveau: "Débutant", duree: "10 min",
      competence: "Comprendre le coût de l'activité",
      situation: "Frais fictifs de 0,50 % par ordre. Vous pouvez acheter et vendre aussi souvent que vous voulez.",
      consigne: "Comparez à la fin vos frais cumulés et votre résultat. Que se serait-il passé avec moins d'ordres ?",
      univers: "actions", capital: 1000000, fraisBp: 50, historique: 30, seances: 30, actifs: ["KLT", "KNG"],
      regimes: { KLT: [{ tendance: 0.02, volat: 1.4 }], KNG: [{ tendance: 0.02, volat: 1.2 }] },
      evenements: [],
      transfert: "Avec 0,50 % de frais à l'achat et à la vente, de combien un titre doit-il monter pour couvrir un aller-retour ?" },
    { id: "concentre", version: 1, titre: "Portefeuille concentré", niveau: "Intermédiaire", duree: "15 min",
      competence: "Comprendre la concentration",
      situation: "Ciments Bakar a de très bons résultats. Il est tentant d'y mettre presque tout son capital.",
      consigne: "Construisez votre portefeuille parmi quatre valeurs, puis observez ce qu'il traverse.",
      univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 35, actifs: ["CBK", "KLT", "BNY", "KNG"],
      regimes: { CBK: [{ jusqua: 14, tendance: 0.3, volat: 1.1 }, { tendance: -0.1, volat: 1.6 }] },
      evenements: [
        { seance: 5, actif: "CBK", titre: "Ciments Bakar : bénéfice record", texte: "Le bénéfice progresse de 30 % sur un an.", choc: 1.5 },
        { seance: 14, actif: "CBK", titre: "Arrêt d'un grand chantier public", texte: "Le premier client de Ciments Bakar suspend un chantier pour un an.", choc: -16 }
      ],
      transfert: "Pourquoi un bénéfice record ne protège-t-il pas une entreprise d'une baisse forte et rapide de son cours ?" },
    { id: "secteurs", version: 1, titre: "Secteurs divergents", niveau: "Intermédiaire", duree: "20 min",
      competence: "Explorer la diversification",
      situation: "Six entreprises de six secteurs. Elles ne réagissent pas aux mêmes événements.",
      consigne: "Comparez au moins deux répartitions. Diversifier ne garantit pas un bénéfice : observez ce que cela change.",
      univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 40, actifs: ["KLT", "BNY", "SOL", "CBK", "AGD", "KNG"],
      regimes: { KLT: [{ tendance: 0.15, volat: 1.2 }], SOL: [{ tendance: -0.12, volat: 1.6 }], AGD: [{ tendance: 0.05, volat: 2.2 }], KNG: [{ tendance: 0.08, volat: 1.0 }], CBK: [{ tendance: -0.02, volat: 1.2 }] },
      evenements: [
        { seance: 12, actif: "AGD", titre: "Bonne saison des pluies annoncée", texte: "Les prévisions de récolte sont relevées.", choc: 4 },
        { seance: 22, actif: "SOL", titre: "Hausse du prix du carburant des centrales", texte: "Les coûts d'Énergie Soleya vont augmenter.", choc: -5 },
        { seance: 30, actif: "KNG", titre: "L'inflation ralentit", texte: "Les ménages retrouvent un peu de pouvoir d'achat.", choc: 1.5 }
      ],
      transfert: "Deux entreprises différentes peuvent-elles baisser en même temps ? Donnez un exemple de cause commune." },
    { id: "change", version: 1, titre: "Change défavorable", niveau: "Débutant", duree: "15 min",
      competence: "Comprendre la cotation et la perte de change",
      situation: "Compte de 10 000 USD fictifs. Vous pouvez acheter des euros ou des livres sterling, puis les revendre.",
      consigne: "Avant chaque achat, lisez le cours acheteur (bid), le cours vendeur (ask) et l'écart (spread).",
      univers: "forex", capital: 1000000, spread: { EURUSD: 2, GBPUSD: 3 }, historique: 30, seances: 35, actifs: ["EURUSD", "GBPUSD"],
      regimes: { EURUSD: [{ jusqua: 8, tendance: 0.02, volat: 0.4 }, { tendance: -0.12, volat: 0.5 }] },
      evenements: [
        { seance: 8, actif: "EURUSD", titre: "Scénario fictif : la banque centrale de la zone euro surprend", texte: "Dans ce scénario, elle baisse ses taux plus que prévu. Cet événement est inventé pour l'exercice.", choc: -0.5 }
      ],
      transfert: "Si vous achetez des euros puis que l'euro baisse face au dollar, que perdez-vous, et dans quelle devise le mesurez-vous ?" }
  ];

  /* Marchés des tutoriels : exécution pédagogique au prix affiché, sans événement */
  var TUTO_MARCHES = {
    actions: { id: "tuto-actions", version: 1, titre: "Marché d'entraînement", univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 30, execution: "immediat", actifs: ["KLT", "BNY", "SOL", "CBK", "AGD", "KNG"], evenements: [] },
    info: { id: "tuto-info", version: 1, titre: "Marché d'entraînement · information", univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 20, execution: "ouverture", actifs: ["AGD", "BNY"],
      evenements: [{ seance: 2, actif: "AGD", titre: "Rumeur : un concurrent d'Agro Djeli serait en difficulté", texte: "Information non confirmée, relayée sur les réseaux sociaux.", choc: 1 }] },
    forex: { id: "tuto-forex", version: 1, titre: "Change d'entraînement", univers: "forex", capital: 1000000, spread: { EURUSD: 2, GBPUSD: 3 }, historique: 30, seances: 20, execution: "immediat", actifs: ["EURUSD", "GBPUSD"], evenements: [] }
  };

  /* Outils pour les tests des tutoriels */
  function dernierOrdre(st, f) { var o = st.ordres.filter(f || function () { return true; }); return o[o.length - 1]; }
  function executes(st) { return st.ordres.filter(function (o) { return o.etat === "exécuté"; }); }
  function maxAchetable(prix, budget, bp) { var q = Math.floor(budget / prix); while (q > 0 && q * prix + Math.round(q * prix * bp / 10000) > budget) q--; return q; }

  /* Types d'étapes : info · action (test sur l'état) · qcm · nombre · texte. Chaque tutoriel finit par un transfert. */
  var TUTORIELS = [
    { id: "t1", titre: "Lire un cours", marche: "actions", competence: "Identifier prix, devise et séance", duree: "5 min",
      etapes: [
        { t: "info", texte: "Le graphique montre le cours de Kalao Télécom, séance après séance. Le cours est le dernier prix auquel des actions ont été échangées. Il est exprimé en FCFA. En haut, vous lisez la séance simulée : ce n'est pas la date d'aujourd'hui." },
        { t: "action", consigne: "Touchez (ou survolez) une séance du graphique pour afficher ses valeurs.", test: function (st, c) { return !!c.ui.selection; } },
        { t: "nombre", question: function (c) { return "Quel est le cours de clôture de Kalao Télécom à la dernière séance affichée (en FCFA) ?"; }, reponse: function (c) { return c.dernier("KLT").c; }, tol: 0, unite: "FCFA",
          correction: function (c) { return "La clôture de la dernière séance est " + c.F(c.dernier("KLT").c) + ". C'est la valeur indiquée sous le titre du graphique, à côté du symbole KLT."; } },
        { t: "qcm", question: "Le cours affiché vous indique…", choix: ["Le prix auquel vous achèterez à coup sûr demain", "Le dernier prix d'échange connu", "La valeur réelle de l'entreprise"], bonne: 1,
          correction: "C'est le dernier prix d'échange. Le prix suivant peut être différent, et il ne dit pas à lui seul ce que vaut l'entreprise." },
        { t: "nombre", transfert: true, question: "Une action cote 4 250 FCFA. Combien coûtent 10 actions, avant frais ?", reponse: function () { return 42500; }, tol: 0, unite: "FCFA",
          correction: "10 × 4 250 = 42 500 FCFA. Les frais s'ajoutent ensuite." }
      ] },
    { id: "t2", titre: "Comprendre une variation", marche: "actions", competence: "Calculer une hausse ou une baisse", duree: "6 min",
      etapes: [
        { t: "info", texte: "Une variation se calcule toujours depuis le point de départ : (arrivée − départ) ÷ départ. De 5 000 à 5 400 : 400 ÷ 5 000 = +8 %." },
        { t: "nombre", question: "Le cours passe de 5 400 à 5 000 FCFA. Quelle est la variation, en % ? (avec le signe, par exemple −3,5)", reponse: function () { return -7.41; }, tol: 0.02, unite: "%",
          correction: "(5 000 − 5 400) ÷ 5 400 = −7,41 %. La base est 5 400, le point de départ, pas 5 000. C'est pourquoi +8 % puis −7,41 % ramènent au même prix." },
        { t: "action", consigne: "Avancez d'une séance avec le bouton « + 1 séance ».", test: function (st, c) { return st.seance > c.depart.seance; } },
        { t: "nombre", question: function (c) { return "Variation de Kalao Télécom entre l'avant-dernière et la dernière clôture, en % (deux décimales) ?"; },
          reponse: function (c) { var v = c.visibles("KLT"), a = v[v.length - 2].c, b = v[v.length - 1].c; return Math.round((b - a) / a * 10000) / 100; }, tol: 0.02, unite: "%",
          correction: function (c) { var v = c.visibles("KLT"), a = v[v.length - 2].c, b = v[v.length - 1].c; return "(" + c.F(b) + " − " + c.F(a) + ") ÷ " + c.F(a) + " = " + c.P((b - a) / a) + "."; } },
        { t: "nombre", transfert: true, question: "Une action perd 50 %. De combien doit-elle monter (en %) pour revenir à son prix de départ ?", reponse: function () { return 100; }, tol: 0, unite: "%",
          correction: "Après −50 %, 10 000 devient 5 000. Pour revenir à 10 000, il faut +5 000 sur une base de 5 000, soit +100 %. Les pertes se rattrapent plus difficilement qu'elles ne se font." }
      ] },
    { id: "t3", titre: "Lire une bougie", marche: "actions", competence: "Repérer ouverture, clôture et extrêmes", duree: "6 min",
      etapes: [
        { t: "info", texte: "Une bougie résume une séance : l'ouverture (Open), le plus haut (High), le plus bas (Low) et la clôture (Close). Le corps va de l'ouverture à la clôture ; les mèches montent au plus haut et descendent au plus bas. Ici, le corps est vert avec ▲ si la séance finit en hausse, rouge avec ▼ si elle finit en baisse." },
        { t: "action", consigne: "Passez le graphique en « Bougies ».", test: function (st, c) { return c.ui.vue === "bougies"; } },
        { t: "action", consigne: "Touchez une bougie pour lire ses quatre valeurs.", test: function (st, c) { return c.ui.vue === "bougies" && !!c.ui.selection; } },
        { t: "nombre", question: "Pour la dernière séance de Kalao Télécom : écart entre le plus haut et le plus bas, en FCFA ?", reponse: function (c) { var b = c.dernier("KLT"); return b.h - b.l; }, tol: 0, unite: "FCFA",
          correction: function (c) { var b = c.dernier("KLT"); return "Plus haut " + c.F(b.h) + " − plus bas " + c.F(b.l) + " = " + c.F(b.h - b.l) + ". C'est l'amplitude de la séance."; } },
        { t: "qcm", transfert: true, question: "Une bougie a une longue mèche basse et une clôture proche du plus haut. Que s'est-il passé pendant la séance ?", choix: ["Le cours n'est jamais descendu", "Le cours est descendu bas, puis est remonté avant la clôture", "La séance annonce une hausse demain"], bonne: 1,
          correction: "La mèche basse montre que le cours est allé bas pendant la séance ; la clôture haute montre qu'il est remonté. Cela décrit la séance, cela ne prédit pas la suivante." }
      ] },
    { id: "t4", titre: "Acheter avec un budget limité", marche: "actions", competence: "Vérifier quantité, coût et liquidités", duree: "6 min",
      etapes: [
        { t: "info", texte: "Vous décidez de ne pas engager plus de 200 000 FCFA sur Kalao Télécom. Les frais fictifs sont de 0,20 % du montant, et ils comptent dans le budget." },
        { t: "nombre", question: function (c) { return "Au cours de " + c.F(c.dernier("KLT").c) + ", combien d'actions Kalao Télécom au maximum pour 200 000 FCFA, frais compris ?"; },
          reponse: function (c) { return maxAchetable(c.dernier("KLT").c, 200000, 20); }, tol: 0, unite: "actions",
          correction: function (c) { var p = c.dernier("KLT").c, q = maxAchetable(p, 200000, 20), b = q * p, f = Math.round(b * 0.002); return q + " actions : " + c.F(b) + " + " + c.F(f) + " de frais = " + c.F(b + f) + ". Une action de plus dépasserait le budget."; } },
        { t: "action", consigne: "Dans « Décider », achetez cette quantité de Kalao Télécom. Vérifiez le ticket avant de confirmer.",
          test: function (st, c) { var o = dernierOrdre(st, function (x) { return x.etat === "exécuté" && x.actif === "KLT" && x.sens === "achat"; }); return !!o && o.execution.total <= 200000; },
          aide: "Le total du ticket doit rester sous 200 000 FCFA." },
        { t: "qcm", transfert: true, question: "Avec 50 000 FCFA et une action à 12 500 FCFA (frais 0,20 %), combien d'actions pouvez-vous acheter ?", choix: ["4", "3", "5"], bonne: 1,
          correction: "4 actions coûtent 50 000 + 100 de frais = 50 100 FCFA : c'est trop. 3 actions coûtent 37 575 FCFA." }
      ] },
    { id: "t5", titre: "Comprendre les frais", marche: "actions", competence: "Comparer résultat brut et résultat net", duree: "8 min",
      etapes: [
        { t: "info", texte: "Objectif : distinguer la hausse d'un titre et votre bénéfice net. Capital : 1 million de FCFA fictifs. Frais : 0,20 % à l'achat et à la vente." },
        { t: "action", consigne: "Achetez 100 actions Kalao Télécom.", test: function (st) { return executes(st).some(function (o) { return o.actif === "KLT" && o.sens === "achat" && o.qte >= 100; }); } },
        { t: "qcm", question: "Le cours n'a pas bougé, mais votre résultat total est négatif. Pourquoi ?", choix: ["Le cours a baissé en secret", "Les frais d'achat ont été payés : la valeur de vos actions ne les inclut pas", "C'est une erreur de calcul"], bonne: 1,
          correction: "Vous avez payé le prix des actions plus les frais. Les actions valent leur prix, sans les frais. L'écart est le coût de votre décision." },
        { t: "action", consigne: "Avancez de 5 séances, puis vendez toutes vos actions Kalao Télécom.", test: function (st) { return executes(st).some(function (o) { return o.actif === "KLT" && o.sens === "vente"; }) && !st.positions.KLT; } },
        { t: "nombre", question: "Quel est le résultat réalisé net de cette vente, en FCFA ? (regardez le journal)", reponse: function (c) { var o = dernierOrdre(c.st, function (x) { return x.etat === "exécuté" && x.actif === "KLT" && x.sens === "vente"; }); return o ? o.execution.resultat : 0; }, tol: 0, unite: "FCFA",
          correction: function (c) { var o = dernierOrdre(c.st, function (x) { return x.etat === "exécuté" && x.actif === "KLT" && x.sens === "vente"; }); if (!o) return ""; var e = o.execution; return "Produit de la vente " + c.F(e.brut) + " − frais " + c.F(e.frais) + " − coût d'achat frais inclus " + c.F(e.coutAffecte) + " = " + c.F(e.resultat) + "."; } },
        { t: "nombre", transfert: true, question: "Avec 0,20 % de frais à l'achat et à la vente, quelle hausse minimale du cours (en %, deux décimales) couvre les frais ?", reponse: function () { return 0.4; }, tol: 0.02, unite: "%",
          correction: "Il faut couvrir environ 0,20 % + 0,20 % = 0,40 % (précisément 0,4008 %). En dessous, l'aller-retour perd de l'argent même si le cours a monté." }
      ] },
    { id: "t6", titre: "Gain latent et gain réalisé", marche: "actions", competence: "Acheter, observer puis vendre", duree: "7 min",
      etapes: [
        { t: "action", consigne: "Achetez des actions Banque Nyota (la quantité de votre choix).", test: function (st) { return !!st.positions.BNY; } },
        { t: "action", consigne: "Avancez de 3 séances et regardez la ligne « Résultat latent » du portefeuille.", test: function (st, c) { return st.seance >= c.depart.seance + 3 && !!st.positions.BNY; } },
        { t: "qcm", question: "Un gain latent de +12 000 FCFA est-il acquis ?", choix: ["Oui, il est sur mon compte", "Non, il peut augmenter ou disparaître tant que je n'ai pas vendu", "Oui, si l'entreprise est solide"], bonne: 1,
          correction: "Latent veut dire « non réalisé » : il dépend du prochain cours. Il devient réalisé seulement à la vente, après frais." },
        { t: "action", consigne: "Vendez toutes vos actions Banque Nyota.", test: function (st) { return !st.positions.BNY && executes(st).some(function (o) { return o.actif === "BNY" && o.sens === "vente"; }); } },
        { t: "qcm", transfert: true, question: "Vous avez 30 000 FCFA de gain latent, puis le cours chute et vous vendez avec 5 000 FCFA de perte. Qu'avez-vous gagné ?", choix: ["30 000 FCFA", "Rien : le résultat réalisé est une perte de 5 000 FCFA", "25 000 FCFA"], bonne: 1,
          correction: "Le gain latent n'a jamais été encaissé. Seul compte le résultat réalisé à la vente." }
      ] },
    { id: "t7", titre: "Mesurer son exposition", marche: "actions", competence: "Calculer la part du capital engagée", duree: "6 min",
      etapes: [
        { t: "info", texte: "L'exposition est la part de votre portefeuille placée sur un actif : valeur de la position ÷ valeur totale du portefeuille." },
        { t: "action", consigne: "Achetez pour environ 300 000 FCFA d'Énergie Soleya.", test: function (st, c) { return !!st.positions.SOL && c.valeurPos("SOL") >= 200000; } },
        { t: "nombre", question: "Quelle part de votre portefeuille est exposée à Énergie Soleya, en % (arrondi à l'unité) ?", reponse: function (c) { return Math.round(c.valeurPos("SOL") / c.valeurTotale() * 100); }, tol: 1, unite: "%",
          correction: function (c) { return c.F(c.valeurPos("SOL")) + " ÷ " + c.F(c.valeurTotale()) + " = " + Math.round(c.valeurPos("SOL") / c.valeurTotale() * 100) + " %."; } },
        { t: "nombre", transfert: true, question: function (c) { return "Si Énergie Soleya perdait 20 %, combien perdrait votre portefeuille, en % (arrondi à l'unité) ?"; }, reponse: function (c) { return Math.round(c.valeurPos("SOL") / c.valeurTotale() * 20); }, tol: 1, unite: "%",
          correction: "Perte du portefeuille ≈ exposition × baisse de l'actif. Avec 30 % d'exposition, une baisse de 20 % coûte environ 6 % du portefeuille." }
      ] },
    { id: "t8", titre: "Explorer la diversification", marche: "actions", competence: "Comparer deux allocations", duree: "8 min",
      etapes: [
        { t: "qcm", question: "Portefeuille A : 100 % dans une entreprise. Portefeuille B : un tiers dans trois entreprises de secteurs différents. Laquelle de ces phrases est juste ?", choix: ["B gagne toujours plus que A", "B dépend moins d'un seul événement que A", "B ne peut pas perdre"], bonne: 1,
          correction: "Répartir réduit la dépendance à une seule entreprise. Cela ne garantit ni un gain, ni un meilleur résultat que A." },
        { t: "action", consigne: "Détenez au moins trois entreprises de secteurs différents.", test: function (st) { return Object.keys(st.positions).length >= 3; } },
        { t: "action", consigne: "Avancez de 5 séances et regardez la répartition et le résultat de chaque ligne.", test: function (st, c) { return st.seance >= c.depart.seance + 5 && Object.keys(st.positions).length >= 2; } },
        { t: "qcm", transfert: true, question: "Pourquoi deux entreprises de secteurs différents peuvent-elles baisser le même jour ?", choix: ["C'est impossible", "Une cause commune peut toucher tout le marché : hausse des taux, crise, inflation", "Seulement si elles ont le même dirigeant"], bonne: 1,
          correction: "Certains risques touchent tout le marché. La diversification réduit le risque propre à une entreprise, pas celui de tout le marché." }
      ] },
    { id: "t9", titre: "Réagir à une information", marche: "info", competence: "Expliquer une décision ou une attente", duree: "8 min",
      etapes: [
        { t: "info", texte: "Une information va être publiée. Attendre est une décision possible. Ici, l'ordre est exécuté à l'ouverture de la séance suivante, à un prix que vous ne connaissez pas encore." },
        { t: "action", consigne: "Avancez jusqu'à ce qu'une information apparaisse dans « Événements ».", test: function (st, c) { return c.evenementsVus().length > 0; } },
        { t: "qcm", question: "L'information est une rumeur non confirmée. Que sait-on vraiment ?", choix: ["Que le cours va monter", "Qu'une rumeur circule, sans confirmation", "Que le concurrent va faire faillite"], bonne: 1,
          correction: "On sait seulement qu'une rumeur circule. Une décision fondée sur une rumeur doit le dire, et en mesurer le risque." },
        { t: "texte", question: "Qu'avez-vous décidé (acheter, vendre, attendre) et pourquoi, avec ce que vous savez vraiment ?", correction: "Il n'y a pas une seule bonne réponse. Une bonne justification distingue ce qui est confirmé de ce qui est supposé, et dit combien vous acceptez d'exposer." },
        { t: "qcm", transfert: true, question: "Une bonne nouvelle est publiée et le cours baisse. Est-ce possible ?", choix: ["Non, jamais", "Oui : la nouvelle était peut-être déjà attendue, ou jugée insuffisante", "Seulement en cas d'erreur"], bonne: 1,
          correction: "Le cours reflète ce que les acheteurs et vendeurs attendaient déjà. Une bonne nouvelle n'entraîne pas toujours une hausse." }
      ] },
    { id: "t10", titre: "Comprendre une paire de devises", marche: "forex", competence: "Identifier base et cotation", duree: "6 min",
      etapes: [
        { t: "info", texte: "EUR/USD : EUR est la devise achetée ou vendue (la base). USD est la devise utilisée pour exprimer son prix (la cotation). Un cours de 1,1000 signifie qu'un euro vaut 1,10 dollar." },
        { t: "qcm", question: "Dans GBP/USD, quelle est la devise de base ?", choix: ["USD", "GBP"], bonne: 1, correction: "La base est la première devise : GBP, la livre sterling. Le cours dit combien de dollars vaut une livre." },
        { t: "nombre", question: "Au cours de 1,1000, combien de dollars faut-il pour 500 euros (hors écart) ?", reponse: function () { return 550; }, tol: 0, unite: "USD", correction: "500 × 1,1000 = 550 USD." },
        { t: "action", consigne: "Achetez 1 000 euros avec vos dollars.", test: function (st) { return executes(st).some(function (o) { return o.actif === "EURUSD" && o.sens === "achat"; }); } },
        { t: "nombre", transfert: true, question: "Le franc CFA est arrimé à l'euro : 1 euro = 655,957 FCFA. Combien de FCFA pour 100 euros (arrondi à l'unité) ?", reponse: function () { return 65596; }, tol: 1, unite: "FCFA",
          correction: "100 × 655,957 = 65 595,7, soit 65 596 FCFA. Ce cours est fixe ; EUR/USD, lui, bouge chaque jour." }
      ] },
    { id: "t11", titre: "Comprendre le spread", marche: "forex", competence: "Comparer achat et revente immédiate", duree: "6 min",
      etapes: [
        { t: "info", texte: "Vous achetez au cours vendeur (ask), vous revendez au cours acheteur (bid). L'ask est toujours un peu plus haut que le bid : l'écart s'appelle le spread." },
        { t: "action", consigne: "Achetez 1 000 euros.", test: function (st) { return executes(st).some(function (o) { return o.actif === "EURUSD" && o.sens === "achat" && o.qte >= 1000; }); } },
        { t: "action", consigne: "Revendez aussitôt ces 1 000 euros, sans avancer le temps.", test: function (st) { return executes(st).some(function (o) { return o.actif === "EURUSD" && o.sens === "vente"; }); } },
        { t: "nombre", question: "Quel est votre résultat sur cet aller-retour, en USD (avec le signe, deux décimales) ?", reponse: function (c) { var v = dernierOrdre(c.st, function (x) { return x.etat === "exécuté" && x.sens === "vente"; }); return v ? v.execution.resultat / 100 : 0; }, tol: 0.005, unite: "USD",
          correction: "Le marché n'a pas bougé, et pourtant le résultat est négatif : c'est le spread. 1 000 € × 0,0002 = 0,20 USD." },
        { t: "nombre", transfert: true, question: "GBP/USD : bid 1,2700, ask 1,2703. Achat puis revente immédiate de 2 000 livres : perte en USD ?", reponse: function () { return 0.6; }, tol: 0.005, unite: "USD",
          correction: "2 000 × 0,0003 = 0,60 USD. Plus vous faites d'allers-retours, plus le spread s'additionne." }
      ] },
    { id: "t12", titre: "Analyser ses décisions", marche: "actions", competence: "Produire un bilan argumenté", duree: "10 min",
      etapes: [
        { t: "info", texte: "Une bonne décision peut perdre de l'argent, et une mauvaise décision peut en gagner. On juge une décision avec ce que l'on savait au moment de la prendre." },
        { t: "qcm", question: "Vous avez acheté sur une rumeur et gagné 40 000 FCFA. Votre décision était-elle bonne ?", choix: ["Oui, puisque j'ai gagné", "Pas forcément : il faut juger le raisonnement et le risque pris, pas seulement le résultat", "Non, puisque c'était une rumeur"], bonne: 1,
          correction: "Le résultat ne suffit pas. Il faut regarder ce que vous saviez, ce que vous avez exposé, et si votre justification tenait." },
        { t: "action", consigne: "Terminez au moins un scénario, puis, dans « Mes décisions », ajoutez « ce que je comprends après » à l'une de vos décisions.", test: function (st, c) { return c.reflexions() > 0; },
          aide: "Ouvrez « Simuler », choisissez un scénario, prenez au moins une décision, puis revenez ici." },
        { t: "texte", transfert: true, question: "Dans un autre scénario, que feriez-vous différemment, et pourquoi ?", correction: "Une bonne réponse nomme une règle que vous appliquerez (par exemple : « jamais plus de 30 % sur une entreprise ») et la relie à ce que vous avez observé." }
      ] }
  ];

  var GLOSSAIRE = [
    ["Action", "Part du capital d'une entreprise. La détenir donne droit à une part des bénéfices distribués (dividendes) et au vote en assemblée."],
    ["Cours", "Dernier prix auquel un actif a été échangé. Il change à chaque échange."],
    ["Séance", "Période pendant laquelle le marché est ouvert. Ici, le temps est simulé : une séance avance quand vous le décidez."],
    ["Bougie (OHLC)", "Résumé d'une séance : ouverture (Open), plus haut (High), plus bas (Low), clôture (Close)."],
    ["Variation", "(Arrivée − départ) ÷ départ. Toujours calculée depuis le point de départ."],
    ["Ordre au marché", "Ordre exécuté au prix disponible. Ici : à l'ouverture de la séance suivante, sauf en exécution pédagogique au prix affiché."],
    ["Frais", "Ce que coûte chaque ordre. Ici, un pourcentage fictif fixé par le scénario, pas le tarif d'une SGI réelle."],
    ["Liquidités", "L'argent non investi, disponible pour acheter."],
    ["Position", "Ce que vous détenez sur un actif : quantité et coût de revient."],
    ["Coût de revient", "Ce qu'une position vous a coûté, frais d'achat inclus. Calculé au coût moyen pondéré."],
    ["Résultat latent", "Gain ou perte si vous vendiez maintenant, avant frais de vente. Pas encore acquis."],
    ["Résultat réalisé", "Gain ou perte constaté à la vente, frais inclus."],
    ["Exposition", "Part de votre portefeuille placée sur un actif ou un secteur."],
    ["Diversification", "Répartir son capital entre plusieurs actifs pour ne pas dépendre d'un seul. Réduit un risque, ne garantit pas un gain."],
    ["Concentration", "Forte part du capital sur un seul actif : un seul événement peut alors peser lourd."],
    ["Baisse maximale", "Plus forte chute du portefeuille depuis un sommet atteint auparavant, en %."],
    ["Paire de devises", "Deux devises cotées l'une contre l'autre, par exemple EUR/USD."],
    ["Devise de base", "Première devise de la paire : celle que l'on achète ou vend."],
    ["Devise de cotation", "Seconde devise de la paire : celle dans laquelle le prix est exprimé."],
    ["Bid / Ask", "Bid : cours auquel vous pouvez vendre. Ask : cours auquel vous pouvez acheter. L'ask est plus haut."],
    ["Spread", "Écart entre l'ask et le bid. C'est un coût, même si le marché ne bouge pas."],
    ["Effet de levier", "Investir plus que ce que l'on possède en empruntant. Il amplifie les gains et les pertes. Non disponible ici."],
    ["Vente à découvert", "Vendre un actif que l'on ne détient pas. Désactivée dans EFA Traders."]
  ];

  var DIAGNOSTIC = [
    { q: "Un prix passe de 2 000 à 2 500 FCFA. Quelle est la variation ?", choix: ["+20 %", "+25 %", "+500 %"], bonne: 1, tuto: "t2" },
    { q: "Vous avez 1 000 000 FCFA et achetez pour 400 000 FCFA d'actions. Combien vous reste-t-il à investir ?", choix: ["1 000 000 FCFA", "600 000 FCFA", "400 000 FCFA"], bonne: 1, tuto: "t4" },
    { q: "Vos actions affichent +50 000 FCFA, mais vous ne les avez pas vendues. Ce gain…", choix: ["est acquis", "peut encore disparaître", "est déjà sur votre compte"], bonne: 1, tuto: "t6" },
    { q: "Vous achetez et revendez au même prix, avec des frais. Votre résultat est…", choix: ["nul", "négatif", "positif"], bonne: 1, tuto: "t5" },
    { q: "Quel portefeuille dépend le plus d'un seul événement ?", choix: ["90 % dans une entreprise", "30 % dans trois entreprises de secteurs différents", "Tout en liquidités"], bonne: 0, tuto: "t7" }
  ];

  var OBJECTIFS = [
    { id: "marches", t: "Comprendre les marchés", tuto: "t1" },
    { id: "actions", t: "Découvrir les actions", tuto: "t4" },
    { id: "devises", t: "Comprendre les devises", tuto: "t10" },
    { id: "cours", t: "Pratiquer dans le cadre d'un cours", tuto: "t1" },
    { id: "libre", t: "Explorer librement", tuto: null }
  ];

  var JUSTIFS = ["Tester une hypothèse", "Rééquilibrer", "Réduire l'exposition", "Prendre un bénéfice", "Limiter une perte", "Réagir à une information", "Autre"];

  var API = { ACTIFS: ACTIFS, SCENARIOS: SCENARIOS, TUTO_MARCHES: TUTO_MARCHES, TUTORIELS: TUTORIELS, GLOSSAIRE: GLOSSAIRE, DIAGNOSTIC: DIAGNOSTIC, OBJECTIFS: OBJECTIFS, JUSTIFS: JUSTIFS, maxAchetable: maxAchetable };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else racine.EFA_TR_C = API;
})(this);
