/* « Où est passé mon argent ? » · moteur de calcul EFA (méthode 1.1)
   1.1 : une catégorie non renseignée rend le rapprochement partiel tant que l'utilisateur ne l'a pas confirmée ; ajout du zoom thématique.
   Fonctions pures : aucune donnée n'est envoyée, tout est recalculé à partir des saisies.
   Spécifications : claude/site/specifications (sections 4 à 8 et addendum 12 à 22). */
(function (root) {
  var VERSION = "1.1";

  // Catégories. sens : E = entrée, O = sortie. g = regroupement du bloc C. si = condition d'affichage.
  var CATS = [
    {id:"rev", sens:"E", t:"Revenus encaissés", ex:"Salaire net, rémunération, revenu personnel tiré de votre activité"},
    {id:"act_perso", sens:"E", t:"Argent tiré de l'activité pour mon usage personnel", ex:"Ce que vous avez effectivement pris dans la caisse de l'activité pour vous", si:"act_sep"},
    {id:"act_enc", sens:"E", t:"Encaissements de l'activité", ex:"Ventes, paiements de clients reçus dans la caisse mélangée", si:"act_mel"},
    {id:"aides_rec", sens:"E", t:"Aides et dons reçus", ex:"Soutien familial, transfert de la diaspora"},
    {id:"emprunt", sens:"E", t:"Emprunts reçus", ex:"Banque, microfinance, crédit mobile, proches, avance sur salaire"},
    {id:"ton_recu", sens:"E", t:"Cagnotte de tontine reçue", ex:"Le montant réellement encaissé. Si une cotisation a été retenue avant versement, notez le net reçu.", si:"tontine"},
    {id:"remb_recu", sens:"E", t:"Remboursements reçus", ex:"Prêt remboursé par un proche, achat remboursé"},
    {id:"vente", sens:"E", t:"Vente d'un bien", ex:"Téléphone, véhicule, autre bien personnel"},
    {id:"retrait_ext", sens:"E", t:"Retrait d'une épargne non suivie", ex:"Argent venu d'un compte ou d'un support que vous ne suivez pas ici"},
    {id:"autre_e", sens:"E", t:"Autres entrées", ex:"À préciser"},

    {id:"alim", sens:"O", g:"vie", t:"Alimentation et maison", ex:"Marché, achats quotidiens, provisions, gaz, charbon, eau, électricité"},
    {id:"depl", sens:"O", g:"vie", t:"Déplacements", ex:"Bus, taxi collectif, moto-taxi, carburant, transport interurbain"},
    {id:"tel", sens:"O", g:"vie", t:"Téléphone et services numériques", ex:"Crédit téléphonique, forfaits Internet, abonnements"},
    {id:"loge", sens:"O", g:"vie", t:"Logement", ex:"Loyer, avance de loyer, caution, contribution au logement familial. Une caution récupérable : notez-la en détail, avec son libellé."},
    {id:"sante", sens:"O", g:"vie", t:"Santé et scolarité", ex:"Consultation, médicaments, frais scolaires, fournitures, transport scolaire"},
    {id:"achats", sens:"O", g:"vie", t:"Achats personnels et loisirs", ex:"Vêtements, sorties, abonnements, autres achats"},
    {id:"sol_prev", sens:"O", g:"vie", sol:1, t:"Aides aux proches, prévues", ex:"Parents, enfants, frères et sœurs, soutien au village : ce que vous donnez habituellement"},
    {id:"sol_exc", sens:"O", g:"vie", sol:1, exc:1, t:"Aides aux proches, exceptionnelles ou urgentes", ex:"Soins d'un proche, demande imprévue"},
    {id:"even", sens:"O", g:"vie", sol:1, t:"Événements et contributions", ex:"Funérailles, mariage, naissance, fêtes, association, communauté religieuse"},
    {id:"dette", sens:"O", g:"dette", t:"Dettes remboursées", ex:"Échéances réellement payées : banque, microfinance, crédit mobile, proches. Une échéance déjà retenue sur votre salaire ne se note pas ici."},
    {id:"ton_cot", sens:"O", g:"tontine", t:"Cotisations de tontine versées", ex:"Ce que vous avez réellement versé pendant la période", si:"tontine"},
    {id:"ton_frais", sens:"O", g:"tontine", t:"Frais ou pénalités de tontine", ex:"Frais de gestion, amendes de retard", si:"tontine"},
    {id:"ton_autre", sens:"O", g:"tontine", t:"Autres versements au groupe, dont réserve commune", ex:"Part gardée par le groupe, caisse de solidarité", si:"tontine"},
    {id:"epargne_ext", sens:"O", g:"epargne", t:"Épargne et placements hors des poches suivies", ex:"Versement vers un compte d'épargne, un placement ou un support que vous ne suivez pas ici"},
    {id:"biens", sens:"O", g:"epargne", t:"Biens ou activité", ex:"Équipement, achat de stock, apport à une activité"},
    {id:"act_pay", sens:"O", g:"autre", t:"Paiements de l'activité", ex:"Marchandises, matières premières, transport de marchandises, payés depuis la caisse mélangée", si:"act_mel"},
    {id:"pret", sens:"O", g:"pret", t:"Prêts accordés", ex:"Argent prêté, à récupérer"},
    {id:"frais", sens:"O", g:"autre", t:"Frais financiers", ex:"Frais de transfert ou de retrait mobile money, tenue de compte, collecte d'épargne"},
    {id:"nonclasse", sens:"O", g:"autre", t:"Mouvements non classés", ex:"Sorties de la caisse mélangée que vous ne savez pas encore classer", si:"act_mel"},
    {id:"autre_o", sens:"O", g:"autre", t:"Autres sorties", ex:"À préciser"}
  ];
  var GROUPES = [
    {g:"vie", t:"Dépenses de vie et aides"}, {g:"dette", t:"Remboursements de dettes"},
    {g:"tontine", t:"Cotisations et versements de tontine"}, {g:"epargne", t:"Épargne, placements et achats de biens"},
    {g:"pret", t:"Prêts accordés"}, {g:"autre", t:"Autres sorties"}
  ];
  var POCHES = [
    {id:"especes", t:"Espèces", neg:false, si:"especes"},
    {id:"banque", t:"Banque ou microfinance", neg:true, si:"banque"},
    {id:"mm", t:"Mobile money", neg:false, si:"mm"},
    {id:"epargne", t:"Épargne liquide personnelle", neg:false, si:"epargne"}
  ];

  // Une valeur saisie : {m: nombre ou null, p: "" | "exact" | "estime" | "inconnu" | "rien"}
  // Vide ("" sans montant) ≠ zéro. « Rien » = 0. « Je ne sais pas » = inconnu.
  function val(a) {
    if (!a) return {v: undefined, est: false};
    if (a.p === "rien") return {v: 0, est: false};
    if (a.p === "inconnu") return {v: null, est: false};
    if (a.m === null || a.m === undefined || a.m === "" || isNaN(a.m)) return {v: undefined, est: false};
    return {v: +a.m, est: a.p === "estime"};
  }
  // Total d'une catégorie : soit le total simple, soit la somme des lignes. Jamais les deux.
  function totalCat(c) {
    if (!c) return {v: undefined, est: false, n: 0};
    if (c.mode === "detail") {
      var lignes = (c.lignes || []).filter(function (l) { return l && (l.m !== null && l.m !== undefined && l.m !== "" || l.p === "inconnu"); });
      if (!lignes.length) return {v: undefined, est: false, n: 0};
      var s = 0, est = false, inc = false;
      lignes.forEach(function (l) {
        if (l.p === "inconnu") { inc = true; return; }
        var n = Math.max(1, Math.round(+l.n || 1));
        s += (+l.m) * n; if (n > 1 || l.p === "estime") est = true;
      });
      return inc ? {v: null, est: est, n: lignes.length} : {v: s, est: est, n: lignes.length};
    }
    var x = val(c); x.n = 0; return x;
  }
  function actives(etat) {
    var pr = etat.pratiques || {}, act = etat.activite || "";
    return CATS.filter(function (c) {
      if (!c.si) return true;
      if (c.si === "tontine") return !!pr.tontine;
      if (c.si === "act_sep") return !!pr.activite && act === "separer";
      if (c.si === "act_mel") return !!pr.activite && act === "melange";
      return true;
    });
  }
  function pochesActives(etat) {
    var pr = etat.pratiques || {};
    var l = POCHES.filter(function (p) { return p.id === "epargne" ? !!etat.inclureEpargne : !!pr[p.si]; });
    if (!l.length) l = POCHES.filter(function (p) { return p.id === "especes"; });
    return l;
  }
  function somme(list) {
    var s = 0, inc = [], vide = [], est = 0;
    list.forEach(function (x) {
      if (x.r.v === null) inc.push(x.id); else if (x.r.v === undefined) vide.push(x.id); else { s += x.r.v; if (x.r.est) est++; }
    });
    return {s: s, inc: inc, vide: vide, est: est};
  }
  function solde(etat, quand) {
    var ps = pochesActives(etat), sp = etat.soldes || {};
    var parts = ps.map(function (p) { return {id: p.id, r: val((sp[p.id] || {})[quand])}; });
    var r = somme(parts);
    var conf = etat.confie && etat.confie.oui ? val(etat.confie[quand]) : {v: 0};
    var connu = r.inc.length === 0 && r.vide.length === 0 && conf.v !== null && conf.v !== undefined;
    return {v: connu ? r.s - (conf.v || 0) : null, brut: r.s, inc: r.inc.concat(r.vide), est: r.est + (conf.est ? 1 : 0)};
  }

  function bilan(etat) {
    var cats = actives(etat), mv = etat.mouv || {};
    var lignes = cats.map(function (c) { return {id: c.id, c: c, r: totalCat(mv[c.id])}; });
    var E = somme(lignes.filter(function (x) { return x.c.sens === "E"; }));
    var O = somme(lignes.filter(function (x) { return x.c.sens === "O"; }));
    var S0 = solde(etat, "debut"), S1 = solde(etat, "fin");
    var nbEst = E.est + O.est + S0.est + S1.est;
    var soldesConnus = S0.v !== null && S1.v !== null;
    var attendu = S0.v !== null ? S0.v + E.s - O.s : null;
    var ecart = soldesConnus ? Math.round(attendu - S1.v) : null;
    var dest = lignes.filter(function (x) { return x.c.sens === "O" && x.r.v > 0; })
      .map(function (x) { return {id: x.id, t: x.c.t, g: x.c.g, v: x.r.v, est: x.r.est, pct: O.s > 0 ? x.r.v / O.s : null}; })
      .sort(function (a, b) { return b.v - a.v; });
    var groupes = GROUPES.map(function (G) {
      var v = dest.filter(function (d) { return d.g === G.g; }).reduce(function (a, d) { return a + d.v; }, 0);
      return {g: G.g, t: G.t, v: v};
    }).filter(function (G) { return G.v > 0; });
    var solTot = 0, solExc = 0;
    lignes.forEach(function (x) { if (x.c.sol && x.r.v > 0) { solTot += x.r.v; if (x.c.exc) solExc += x.r.v; } });
    var inconnus = E.inc.concat(O.inc), vides = E.vide.concat(O.vide);
    var statut = !soldesConnus ? "partiel" : (inconnus.length || vides.length ? "partiel-flux" : (nbEst ? "estimatif" : "complet"));

    // Messages selon le contexte déclaré (addendum, section 21)
    var pr = etat.pratiques || {}, msgs = [];
    var g = function (id) { var x = lignes.filter(function (l) { return l.id === id; })[0]; return x && x.r.v > 0 ? x.r.v : 0; };
    var courte = ["derniere_rentree", "sept_jours"].indexOf((etat.periode || {}).type) >= 0;
    if (courte || etat.rentrees === "saisonnieres") msgs.push("Ce résultat décrit uniquement la période choisie. Il ne représente pas nécessairement un mois habituel.");
    if (pr.especes && nbEst >= 3) msgs.push("Pendant sept jours, notez vos paiements en espèces pour préciser cette partie du bilan.");
    if (etat.rentrees === "saisonnieres") msgs.push("Cette rentrée peut couvrir plusieurs mois. Votre solde actuel n'est pas entièrement disponible pour des dépenses immédiates.");
    if (g("ton_recu") > 0) msgs.push("Une partie des entrées provient de votre tontine. Vérifiez les cotisations qui restent à verser après votre tour.");
    if (g("sol_exc") > 0) msgs.push("Cette période comprend un événement exceptionnel : comparez-la avec prudence à un mois habituel.");
    if (pr.activite && etat.activite === "melange") msgs.push("Ce bilan décrit une caisse mêlant activité et dépenses personnelles. Il ne permet pas de calculer votre bénéfice. Commencez par distinguer les mouvements de l'activité des dépenses du foyer.");
    if (etat.confie && etat.confie.oui) msgs.push("Vérifiez la part qui vous appartient avant d'interpréter votre solde personnel.");

    // Première action (bloc E), par ordre de priorité
    var action;
    if (!soldesConnus) action = {k: "soldes", t: "Retrouvez vos soldes avant d'interpréter l'écart.", d: "Regardez le solde de chaque poche, à la même date : espèces comptées, application mobile money, relevé bancaire."};
    else if (ecart > 0) action = {k: "ecart_pos", t: "Vérifiez les espèces, les frais et les sorties oubliées.", d: "Les petites dépenses en espèces et les frais de transfert sont souvent les montants qui manquent."};
    else if (ecart < 0) action = {k: "ecart_neg", t: "Vérifiez les entrées oubliées et les sorties comptées deux fois.", d: "Un retrait suivi d'achats ne se compte qu'une fois : on note les achats, pas le retrait."};
    else if (nbEst >= 4) action = {k: "releve", t: "Tenez un relevé simple pendant sept jours.", d: "Notez chaque paiement, même petit, puis refaites ce bilan avec des montants exacts."};
    else action = {k: "coherent", t: "Choisissez une catégorie à examiner, et préparez la période suivante.", d: "Vos montants se rapprochent. Gardez ces chiffres comme point de départ pour la prochaine période."};

    return {version: VERSION, S0: S0.v, S1: S1.v, E: E.s, O: O.s, attendu: attendu, ecart: ecart, statut: statut,
      dest: dest, groupes: groupes, solidarite: {total: solTot, exceptionnel: solExc},
      qualite: {estimes: nbEst, inconnus: inconnus, vides: vides, soldesManquants: S0.inc.concat(S1.inc)},
      messages: msgs, action: action};
  }

  // Zoom thématique : uniquement les catégories du thème, sans écart global ni conclusion sur l'ensemble.
  function zoom(etat, ids) {
    var mv = (etat && etat.mouv) || {}, cats = CATS.filter(function (c) { return ids.indexOf(c.id) >= 0; });
    var l = cats.map(function (c) { return {id: c.id, t: c.t, sens: c.sens, r: totalCat(mv[c.id])}; });
    var sorties = l.filter(function (x) { return x.sens === "O"; }), entrees = l.filter(function (x) { return x.sens === "E"; });
    var tot = function (L) { return L.reduce(function (a, x) { return a + (x.r.v > 0 ? x.r.v : 0); }, 0); };
    var tS = tot(sorties);
    return {total_sorties: tS, total_entrees: tot(entrees),
      repartition: sorties.filter(function (x) { return x.r.v > 0; }).map(function (x) { return {id: x.id, t: x.t, v: x.r.v, est: x.r.est, pct: tS > 0 ? x.r.v / tS : null}; }).sort(function (a, b) { return b.v - a.v; }),
      entrees: entrees.filter(function (x) { return x.r.v > 0; }).map(function (x) { return {id: x.id, t: x.t, v: x.r.v, est: x.r.est}; }),
      estimes: l.filter(function (x) { return x.r.est; }).map(function (x) { return x.t; }),
      inconnus: l.filter(function (x) { return x.r.v === null; }).map(function (x) { return x.t; }),
      vides: l.filter(function (x) { return x.r.v === undefined; }).map(function (x) { return x.t; })};
  }

  var API = {VERSION: VERSION, CATS: CATS, GROUPES: GROUPES, POCHES: POCHES, val: val, totalCat: totalCat, actives: actives, pochesActives: pochesActives, bilan: bilan, zoom: zoom};
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.OEPMA = API;
})(this);
