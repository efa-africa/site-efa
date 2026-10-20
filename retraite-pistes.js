/* « Préparer ma retraite » · partie 1, REPÉRER · moteur de pistes EFA (parcours 1.0)
   Déterministe et testable : chaque piste vient d'une réponse déclarée. Aucun montant, aucun score, aucun produit.
   Ordre de priorité :
   1 proche de l'échéance (O), aucune préparation (A)
   2 pension inconnue ou incomplète (B), aucune pension (C) — exclusives
   3 situations de la question 6 : logement (I), personnes à charge (J), dettes (K), santé (L), plusieurs pays (M)
   4 sources fragiles : épargne absorbée (D), soutien familial (E), bien sans revenu (F), activité seule (G),
     biens productifs (H), revenus irréguliers (N)
   5 régularité en place (P), sinon point de départ (Q)
   À priorité égale : ordre des lettres. Au plus trois pistes. */
(function (root) {
  var VERSION = "1.0";

  var QUESTIONS = [
    {id: "horizon", multi: false, q: "Dans combien de temps pensez-vous arrêter ou réduire votre activité ?", o: [
      ["plus20", "Dans plus de 20 ans"],
      ["10_20", "Entre 10 et 20 ans"],
      ["5_10", "Entre 5 et 10 ans"],
      ["moins5", "Dans moins de 5 ans"],
      ["arrete", "J’ai déjà arrêté ou réduit mon activité"],
      ["nsp", "Je ne sais pas"]]},
    {id: "revenus", multi: true, excl: ["nsp"], q: "Comment gagnez-vous surtout votre argent aujourd’hui ?", o: [
      ["prive", "Salarié déclaré, du privé"],
      ["etat", "Agent de l’État ou d’une collectivité"],
      ["compte", "Commerce, artisanat ou activité à mon compte"],
      ["agri", "Agriculture, élevage ou pêche"],
      ["location", "Revenus de location ou d’un bien"],
      ["proches", "Argent envoyé par des proches"],
      ["nsp", "Je ne sais pas comment le décrire"]]},
    {id: "pension", multi: false, q: "Aurez-vous une pension de retraite ?", o: [
      ["connu", "Oui, et je connais à peu près son montant"],
      ["inconnu", "Oui, mais je ne connais pas son montant"],
      ["partiel", "Peut-être", "J’ai cotisé à certaines périodes seulement"],
      ["non", "Non, je ne cotise à aucune caisse"],
      ["nsp", "Je ne sais pas"]]},
    {id: "appuis", multi: true, excl: ["pas_pense"], q: "Sur quoi comptez-vous pour vivre plus tard ?", o: [
      ["pension", "Ma pension"],
      ["epargne", "Une épargne que je constitue"],
      ["bien", "Une maison, un terrain ou un bien qui pourra rapporter"],
      ["activite", "Continuer une activité, même réduite"],
      ["famille", "Le soutien de mes enfants ou de ma famille"],
      ["tontine", "Une tontine, une mutuelle ou un groupe d’épargne"],
      ["productifs", "Du bétail, des plantations ou des stocks"],
      ["pas_pense", "Je n’y ai pas encore pensé"]]},
    {id: "epargne", multi: false, q: "Mettez-vous déjà de l’argent de côté pour plus tard ?", o: [
      ["regulier", "Oui, régulièrement"],
      ["parfois", "Oui, de temps en temps"],
      ["urgences", "J’en mets de côté, mais il sert toujours aux urgences"],
      ["non", "Non, pas pour le moment"],
      ["nsp", "Je ne sais pas"]]},
    {id: "situations", multi: true, excl: ["aucune", "nsp"], q: "Y a-t-il une situation à prendre en compte ?", o: [
      ["loyer", "Je loue mon logement et devrai le payer à la retraite"],
      ["charges", "Des personnes dépendront encore de moi", "Enfants, parents, proches"],
      ["dettes", "J’ai des dettes qui dureront longtemps"],
      ["sante", "Ma santé ou celle d’un proche pourra coûter cher"],
      ["pays", "J’ai travaillé ou je vis dans plusieurs pays"],
      ["irregulier", "Mes revenus sont irréguliers ou saisonniers"],
      ["aucune", "Aucune de ces situations"],
      ["nsp", "Je ne sais pas"]]}
  ];

  var LIB = {};
  QUESTIONS.forEach(function (Q) { LIB[Q.id] = {}; Q.o.forEach(function (o) { LIB[Q.id][o[0]] = o[1]; }); });

  // Réponses exclusives : choisir une réponse exclusive efface les autres, et inversement
  function basculer(Q, liste, v) {
    liste = (liste || []).slice();
    var i = liste.indexOf(v);
    if (i >= 0) { liste.splice(i, 1); return liste; }
    var ex = Q.excl || [];
    if (ex.indexOf(v) >= 0) return [v];
    return liste.filter(function (x) { return ex.indexOf(x) < 0; }).concat([v]);
  }

  var HORIZON = {
    plus20: "Le temps joue pour vous : de petites sommes régulières comptent beaucoup.",
    "10_20": "Il vous reste du temps, mais chaque année compte.",
    "5_10": "L’échéance approche : il est utile de chiffrer maintenant.",
    moins5: "Priorité à la sécurité de ce que vous avez déjà et à vos droits.",
    arrete: "L’enjeu est de faire durer vos ressources."
  };
  var HORIZON_TITRE = {
    plus20: "Il vous reste plus de 20 ans pour préparer.",
    "10_20": "Il vous reste environ 10 à 20 ans pour préparer.",
    "5_10": "Il vous reste environ 5 à 10 ans pour préparer.",
    moins5: "Il vous reste moins de 5 ans pour préparer.",
    arrete: "Votre activité est déjà arrêtée ou réduite."
  };

  // zoom : thème d'approfondissement ; "estimer" : lien vers l'estimation chiffrée
  var PISTES = {
    A: {p: 1, t: "Commencez par une petite somme régulière", a: "Choisissez un montant que vous pouvez mettre de côté chaque mois sans y toucher, même petit, et un endroit séparé de l’argent du quotidien.", lien: "estimer"},
    B: {p: 2, t: "Connaissez votre future pension", a: "Demandez votre relevé de carrière à votre caisse, ou rassemblez vos bulletins de salaire. Notez les années qui manquent.", lien: "pension"},
    C: {p: 2, t: "Construisez votre propre revenu de retraite", a: "Listez ce qui pourra vous rapporter de l’argent sans travailler à plein temps : épargne, loyer, activité réduite, part d’une affaire.", lien: "estimer"},
    D: {p: 4, t: "Séparez l’épargne retraite des urgences", a: "Gardez d’abord une réserve pour les imprévus, puis une seconde épargne que vous ne touchez pas avant la retraite.", lien: "estimer"},
    E: {p: 4, t: "Ne reposez pas sur une seule source", a: "Notez ce que vous attendez de vos proches et ce qui se passerait s’ils ne pouvaient pas le donner. Ajoutez une source qui dépend de vous.", lien: "famille"},
    F: {p: 4, t: "Vérifiez ce que votre bien pourra rapporter", a: "Pour chaque bien, notez s’il pourra être loué, vendu ou s’il servira de logement. Vérifiez que les papiers sont à votre nom.", lien: "bien"},
    G: {p: 4, t: "Préparez une activité qui demande moins de force", a: "Pensez à ce que vous pourrez encore faire à 65 ou 70 ans, et à qui pourrait reprendre une partie du travail.", lien: "activite"},
    H: {p: 4, t: "Tenez compte des risques de vos biens productifs", a: "Notez ce que ces biens rapportent chaque année et ce qui pourrait les faire perdre : maladie, sécheresse, vol, prix.", lien: "productifs"},
    I: {p: 3, t: "Prévoyez le logement de vos vieux jours", a: "Notez le loyer que vous paierez probablement à la retraite. C’est souvent la plus grosse dépense à prévoir.", lien: "estimer"},
    J: {p: 3, t: "Comptez les personnes qui dépendront de vous", a: "Listez qui vous aiderez encore à la retraite et pour combien de temps : scolarité, parents âgés, proches.", lien: "famille"},
    K: {p: 3, t: "Visez à finir vos dettes avant la retraite", a: "Notez la date de la dernière échéance de chaque dette et comparez-la à la date où vous comptez arrêter.", lien: "estimer"},
    L: {p: 3, t: "Prévoyez les frais de santé", a: "Vérifiez si vous serez couvert par une assurance ou une mutuelle après l’arrêt du travail, et ce qui restera à votre charge.", lien: "sante"},
    M: {p: 3, t: "Rassemblez vos droits dans chaque pays", a: "Listez les pays et les années travaillées, et les caisses concernées. Certains pays ont des accords pour tenir compte des années passées ailleurs : renseignez-vous auprès de chaque caisse.", lien: "pays"},
    N: {p: 4, t: "Épargnez au rythme de vos rentrées", a: "Fixez un pourcentage à mettre de côté à chaque grosse rentrée — récolte, tontine, gros paiement — plutôt qu’un montant mensuel.", lien: "estimer"},
    O: {p: 1, t: "Mettez à l’abri ce que vous avez déjà", a: "Listez vos ressources et évitez les engagements risqués ou les prêts importants aux proches dans les années qui viennent.", lien: "estimer"},
    P: {p: 5, t: "Vérifiez si votre effort suffit", a: "Passez à l’estimation : quelques chiffres suffisent pour savoir si votre épargne actuelle couvre votre besoin.", lien: "estimer"},
    Q: {p: 5, t: "Imaginez une journée de votre retraite", a: "Où vivrez-vous ? Qui vivra avec vous ? Que paierez-vous chaque mois ? Notez trois dépenses que vous aurez forcément.", lien: "estimer"}
  };

  function a(liste, v) { return (liste || []).indexOf(v) >= 0; }
  function low(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  /* r : {horizon, revenus[], pension, appuis[], epargne, situations[]} */
  function pistes(r) {
    r = r || {};
    var ap = r.appuis || [], rv = r.revenus || [], st = r.situations || [], L = [];
    function add(id, why) { L.push({id: id, priorite: PISTES[id].p, titre: PISTES[id].t, action: PISTES[id].a, lien: PISTES[id].lien, justification: why}); }

    if (r.horizon === "moins5" || r.horizon === "arrete") add("O", "Vous indiquez : « " + low(LIB.horizon[r.horizon]) + " ».");
    if (a(ap, "pas_pense") && r.epargne === "non") add("A", "Vous n’y avez pas encore pensé et vous ne mettez rien de côté pour le moment.");
    if (r.pension === "inconnu" || r.pension === "partiel") add("B", r.pension === "inconnu" ? "Vous indiquez avoir cotisé, sans connaître le montant de votre pension." : "Vous indiquez n’avoir cotisé qu’à certaines périodes.");
    if (r.pension === "non") add("C", "Vous indiquez ne cotiser à aucune caisse de retraite.");
    if (a(st, "loyer")) add("I", "Vous louez votre logement et devrez le payer à la retraite.");
    if (a(st, "charges")) add("J", "Des personnes dépendront encore de vous.");
    if (a(st, "dettes")) add("K", "Vous avez des dettes qui dureront longtemps.");
    if (a(st, "sante")) add("L", "Vous prévoyez des frais de santé importants.");
    if (a(st, "pays")) add("M", "Vous avez travaillé ou vivez dans plusieurs pays.");
    if (r.epargne === "urgences") add("D", "Vous indiquez que votre épargne sert toujours aux imprévus.");
    var autres = ap.filter(function (x) { return x !== "famille" && x !== "pas_pense"; });
    if (a(ap, "famille") && autres.length <= 1) add("E", autres.length ? "Vous comptez surtout sur vos proches, avec une seule autre source." : "Vous comptez surtout sur le soutien de vos proches.");
    if (a(ap, "bien") && !a(rv, "location")) add("F", "Vous comptez sur un bien qui ne vous rapporte pas encore de revenu.");
    if (a(ap, "activite") && r.pension === "nsp") add("G", "Vous comptez continuer une activité et ne savez pas si vous aurez une pension.");
    if (a(ap, "productifs")) add("H", "Vous comptez sur du bétail, des plantations ou des stocks.");
    if (a(st, "irregulier") || a(rv, "agri")) add("N", a(st, "irregulier") ? "Vos revenus sont irréguliers ou saisonniers." : "Vos revenus viennent de l’agriculture, de l’élevage ou de la pêche.");

    var fort = L.some(function (p) { return p.priorite <= 3; });
    if (r.epargne === "regulier" && !fort) add("P", "Vous mettez déjà de l’argent de côté régulièrement.");
    L.sort(function (x, y) { return x.priorite - y.priorite || (x.id < y.id ? -1 : 1); });
    L = L.slice(0, 3);
    if (!L.length) add("Q", "Vos réponses ne permettent pas encore de cibler un point précis : c’est un bon point de départ.");

    var ctx = [];
    if (a(st, "irregulier") || a(rv, "agri")) ctx.push("Une retraite se prépare aussi par grosses rentrées, pas seulement chaque mois.");
    if (a(st, "pays")) ctx.push("Vos montants peuvent être en euros ou en dollars : l’estimation se fait en francs CFA, au taux que vous choisissez.");

    return {version: VERSION, horizon_titre: HORIZON_TITRE[r.horizon] || "", horizon: HORIZON[r.horizon] || "", pistes: L, premiere_action: L[0].action, contextes: ctx};
  }

  var ZOOMS = {
    pension: {t: "votre pension", titre: "Ma pension"},
    bien: {t: "votre bien", titre: "Mon bien"},
    famille: {t: "le soutien de votre famille", titre: "Ma famille"},
    activite: {t: "votre activité", titre: "Mon activité"},
    productifs: {t: "vos biens productifs", titre: "Mes biens productifs"},
    sante: {t: "vos frais de santé", titre: "Ma santé"},
    pays: {t: "vos droits dans plusieurs pays", titre: "Plusieurs pays"}
  };

  var api = {VERSION: VERSION, QUESTIONS: QUESTIONS, LIB: LIB, PISTES: PISTES, HORIZON: HORIZON, ZOOMS: ZOOMS, basculer: basculer, pistes: pistes};
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.RETRAITE_PISTES = api;
})(this);
