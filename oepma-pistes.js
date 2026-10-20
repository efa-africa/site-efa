/* « Où est passé mon argent ? » · partie 1, REPÉRER · moteur de pistes EFA (parcours 2.0)
   Déterministe et testable : chaque piste vient d'une réponse déclarée. Aucun montant, aucun score.
   Ordre de priorité : 1 argent confié · 2 activité et foyer mélangés · 3 difficultés exprimées directement, en question 4 ou « pas les petits » en question 2
   (ordre fixe : petits achats, aides, tontine, dettes, épargne, dépenses exceptionnelles) ·
   4 difficultés déduites d'une combinaison de réponses (historiques et transferts, paiements par un tiers, sommes mélangées) ·
   5 répartition des sorties, puis point de départ. Au plus trois pistes. */
(function (root) {
  var VERSION = "2.0";

  var QUESTIONS = [
    {id: "periode", multi: false, q: "À quelle période pensez-vous ?", o: [
      ["dernier_salaire", "Depuis mon dernier salaire"],
      ["grosse_rentree", "Depuis une grosse rentrée", "Tontine, récolte, paiement…"],
      ["semaines", "Aux dernières semaines"],
      ["mois", "À un mois récent"],
      ["nsp", "Je ne sais pas précisément"]]},
    {id: "difficulte", multi: false, q: "Quand vous cherchez où l’argent est allé, qu’est-ce qui vous manque ?", o: [
      ["petits", "Je me rappelle les gros paiements, mais pas les petits"],
      ["partiel", "Je retrouve certaines opérations, mais pas toutes"],
      ["melange", "Je connais les dépenses, mais j’ai mélangé plusieurs sommes"],
      ["repartition", "Je retrouve les mouvements, mais je veux comprendre leur répartition"],
      ["nsp", "Je ne sais pas par où commencer"]]},
    {id: "moyens", multi: true, excl: ["nsp"], q: "Comment avez-vous surtout payé pendant cette période ?", o: [
      ["especes", "En espèces"],
      ["mm", "Par mobile money"],
      ["banque", "Par banque ou carte"],
      ["tiers", "Quelqu’un a payé pour moi ou avec mon argent"],
      ["nsp", "Je ne sais pas"]]},
    {id: "mouvements", multi: true, excl: ["aucun", "nsp"], q: "Parmi ces mouvements, lesquels avez-vous du mal à retrouver ou à distinguer ?", o: [
      ["petits", "Petits achats du quotidien", "Marché, transport, téléphone…"],
      ["aides", "Aides aux proches, cérémonies et contributions"],
      ["tontine", "Cotisations ou argent reçu d’une tontine"],
      ["dettes", "Remboursements de dettes ou avances"],
      ["epargne", "Argent mis de côté ou transféré entre mes comptes"],
      ["exceptionnels", "Achats importants ou dépenses exceptionnelles"],
      ["aucun", "Aucun en particulier"],
      ["nsp", "Je ne sais pas"]]},
    {id: "contextes", multi: true, excl: ["aucune", "nsp"], q: "Y a-t-il une situation à prendre en compte ?", o: [
      ["activite", "L’argent de mon activité et mon argent personnel sont mélangés"],
      ["confie", "Une partie de l’argent appartenait à quelqu’un d’autre"],
      ["irregulier", "Mes rentrées sont irrégulières ou saisonnières"],
      ["evenement", "Un événement inhabituel a marqué la période"],
      ["aucune", "Aucune de ces situations"],
      ["nsp", "Je ne sais pas"]]}
  ];

  // Bibliothèque. zoom = thème d'approfondissement ciblé (sinon : bilan détaillé).
  var PISTES = {
    A: {t: "Distinguez votre argent de l’argent confié", a: "Listez les sommes reçues pour quelqu’un d’autre et ce qui doit encore être remis ou utilisé pour lui.", zoom: null},
    B: {t: "Séparez les mouvements de l’activité et ceux du foyer", a: "Prenez quelques opérations récentes et indiquez pour chacune : activité, personnel ou à clarifier.", zoom: null},
    C: {t: "Retrouvez les petits achats qui s’additionnent", tEsp: "Retrouvez les petits paiements en espèces", a: "Choisissez sept jours récents et listez les petits paiements, en indiquant ceux dont le montant est estimé.", zoom: "quotidien"},
    D: {t: "Parcourez vos historiques de paiement", a: "Repérez les paiements, les frais et les transferts entre vos propres comptes. Un transfert interne n’est pas une dépense supplémentaire.", zoom: null},
    E: {t: "Distinguez aides, prêts et contributions", a: "Listez les sommes envoyées aux proches en précisant : aide, prêt ou paiement pour quelqu’un.", zoom: "solidarite"},
    F: {t: "Séparez les mouvements de votre tontine", a: "Retrouvez les cotisations versées, la cagnotte réellement reçue et les frais éventuels.", zoom: "tontine"},
    G: {t: "Vérifiez ce qui a été déplacé ou mis de côté", a: "Identifiez les sommes transférées vers vos autres comptes ou vers une épargne. Vérifiez si elles sont toujours présentes.", zoom: "epargne"},
    H: {t: "Retrouvez vos remboursements et retenues", a: "Listez les échéances réellement payées et les retenues déjà prélevées avant réception de votre argent.", zoom: "dettes"},
    I: {t: "Isolez les dépenses inhabituelles", a: "Identifiez les paiements qui ne se répètent pas normalement : équipement, cérémonie, santé, scolarité ou autre événement.", zoom: "exceptionnel"},
    J: {t: "Classez vos sorties par destination", a: "Regroupez vos paiements : vie courante, proches, dettes, tontine, épargne et autres usages.", zoom: null},
    K: {t: "Clarifiez les paiements effectués par quelqu’un d’autre", a: "Distinguez votre argent confié pour un achat, une aide reçue et une avance que vous devrez rembourser.", zoom: null},
    L: {t: "Identifiez à quoi correspondent les sommes mélangées", a: "Notez l’origine des sommes : argent personnel, activité, prêt ou argent confié, selon votre situation.", zoom: null},
    M: {t: "Commencez par une courte période", a: "Choisissez sept jours pour lesquels vous pouvez retrouver quelques paiements. Si vous n’avez aucune trace, commencez un relevé à partir d’aujourd’hui.", zoom: null}
  };
  // Thèmes de zoom : catégories du moteur de bilan concernées.
  var ZOOMS = {
    quotidien: {t: "vos petits achats du quotidien", cats: ["alim", "depl", "tel", "achats"]},
    solidarite: {t: "vos aides et contributions", cats: ["sol_prev", "sol_exc", "even", "pret"]},
    tontine: {t: "votre tontine", cats: ["ton_cot", "ton_recu", "ton_frais", "ton_autre"]},
    epargne: {t: "l’argent mis de côté", cats: ["epargne_ext", "frais"]},
    dettes: {t: "vos remboursements", cats: ["dette", "emprunt"]},
    exceptionnel: {t: "vos dépenses inhabituelles", cats: ["biens", "sante", "even", "autre_o"]}
  };
  var LIB = {};
  QUESTIONS.forEach(function (q) { LIB[q.id] = {}; q.o.forEach(function (o) { LIB[q.id][o[0]] = o[1]; }); });

  // Choix multiple avec réponses exclusives
  function basculer(q, liste, v) {
    liste = (liste || []).slice();
    var i = liste.indexOf(v);
    if (i >= 0) { liste.splice(i, 1); return liste; }
    if ((q.excl || []).indexOf(v) >= 0) return [v];
    return liste.filter(function (x) { return (q.excl || []).indexOf(x) < 0; }).concat([v]);
  }

  function pistes(r) {
    r = r || {};
    var d = r.difficulte || "", m = r.moyens || [], mv = r.mouvements || [], cx = r.contextes || [];
    var has = function (l, v) { return l.indexOf(v) >= 0; };
    var cit = function (q, v) { return "« " + LIB[q][v] + " »"; };
    var out = [], vu = {};
    function add(id, rang, pourquoi, sources) {
      if (vu[id]) return; vu[id] = 1;
      var P = PISTES[id], t = (id === "C" && has(m, "especes")) ? P.tEsp : P.t;
      out.push({id: id, priorite: rang, titre: t, justification: pourquoi, action: P.a, zoom: P.zoom, reponses_sources: sources});
    }
    // 1. Argent confié · 2. Activité mélangée
    if (has(cx, "confie")) add("A", 1, "Vous avez indiqué qu’une partie de l’argent appartenait à quelqu’un d’autre.", ["contextes:confie"]);
    if (has(cx, "activite")) add("B", 2, "Vous avez indiqué que l’argent de votre activité et votre argent personnel sont mélangés.", ["contextes:activite"]);
    // 3. Difficultés choisies en question 4, ordre fixe
    // Petits achats : difficulté exprimée directement, en question 4 ou en question 2 (« pas les petits »)
    if (d === "petits") add("C", 3, "Vous indiquez retrouver les grosses dépenses, mais moins bien les petits achats" + (has(m, "especes") ? ", et payer en espèces." : "."), ["difficulte:petits"].concat(has(mv, "petits") ? ["mouvements:petits"] : [], has(m, "especes") ? ["moyens:especes"] : []));
    if (has(mv, "petits")) add("C", 3, "Vous avez du mal à retrouver les petits achats du quotidien" + (has(m, "especes") ? ", et vous payez en espèces." : "."), ["mouvements:petits"].concat(has(m, "especes") ? ["moyens:especes"] : []));
    if (has(mv, "aides")) add("E", 3, "Vous avez signalé avoir du mal à retrouver les aides, cérémonies et contributions.", ["mouvements:aides"]);
    if (has(mv, "tontine")) add("F", 3, "Vous avez signalé avoir du mal à distinguer les mouvements de votre tontine.", ["mouvements:tontine"]);
    if (has(mv, "dettes")) add("H", 3, "Vous avez signalé avoir du mal à retrouver vos remboursements ou avances.", ["mouvements:dettes"]);
    var histo = d === "partiel" && (has(m, "mm") || has(m, "banque"));
    if (has(mv, "epargne") && !histo) add("G", 3, "Vous avez signalé avoir du mal à retrouver l’argent mis de côté ou transféré.", ["mouvements:epargne"]);
    if (has(mv, "exceptionnels")) add("I", 3, "Vous avez signalé des achats importants ou des dépenses exceptionnelles difficiles à retrouver.", ["mouvements:exceptionnels"]);
    // 4. Difficultés déduites des questions 2 et 3
    if (histo) add("D", 4, "Vous retrouvez certaines opérations mais pas toutes, et vous payez " + (has(m, "mm") && has(m, "banque") ? "par mobile money et par banque" : has(m, "mm") ? "par mobile money" : "par banque ou carte") + (has(mv, "epargne") ? ", avec des transferts entre vos comptes." : "."), ["difficulte:partiel"].concat(has(m, "mm") ? ["moyens:mm"] : [], has(m, "banque") ? ["moyens:banque"] : [], has(mv, "epargne") ? ["mouvements:epargne"] : []));
    if (has(m, "tiers")) add("K", 4, "Vous avez indiqué que quelqu’un a payé pour vous ou avec votre argent.", ["moyens:tiers"]);
    if (d === "melange" && !has(cx, "activite") && !has(cx, "confie")) add("L", 4, "Vous connaissez vos dépenses, mais plusieurs sommes se sont mélangées.", ["difficulte:melange"]);
    // 5. Répartition générale, sinon point de départ
    if (d === "repartition") add("J", 5, "Vous retrouvez vos mouvements et voulez comprendre leur répartition.", ["difficulte:repartition"]);
    if (!out.length) add("M", 5, "Vos réponses ne permettent pas encore de cibler un type de mouvement : le plus simple est de partir d’une courte période.", []);
    out.sort(function (a, b) { return a.priorite - b.priorite; });
    var sel = out.slice(0, 3);
    var ctx = [];
    if (has(cx, "irregulier")) ctx.push("La période choisie peut couvrir des besoins sur plusieurs semaines ou plusieurs mois. Elle ne représente pas nécessairement un mois habituel.");
    if (has(cx, "evenement")) ctx.push("Un événement inhabituel peut modifier la répartition de cette période.");
    return {version: VERSION, pistes: sel, premiere_action: sel[0].action, contextes: ctx};
  }

  // Catégories à ouvrir en premier dans le bilan, selon les réponses
  function categoriesPrioritaires(r) {
    var mv = ((r && r.mouvements) || []).slice(), c = [];
    if (r && r.difficulte === "petits" && mv.indexOf("petits") < 0) mv.push("petits");
    var map = {petits: ["alim", "depl", "tel"], aides: ["sol_prev", "sol_exc", "even"], tontine: ["ton_cot", "ton_frais", "ton_autre"], dettes: ["dette"], epargne: ["epargne_ext", "frais"], exceptionnels: ["biens", "sante"]};
    mv.forEach(function (k) { (map[k] || []).forEach(function (x) { if (c.indexOf(x) < 0) c.push(x); }); });
    return c;
  }

  var API = {VERSION: VERSION, QUESTIONS: QUESTIONS, PISTES: PISTES, ZOOMS: ZOOMS, LIB: LIB, basculer: basculer, pistes: pistes, categoriesPrioritaires: categoriesPrioritaires};
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.OEPMA_PISTES = API;
})(this);
