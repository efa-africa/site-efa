/* « Préparer ma retraite » · moteur de calcul EFA (méthode 1.0)
   Tout est exprimé en francs d'aujourd'hui (valeurs réelles) : inflation et rendement ne sont pas mélangés.
   Un champ vide n'est pas zéro ; « je ne sais pas » reste inconnu ; un montant estimé est signalé.
   Aucune pension légale n'est calculée ici. */
(function (root) {
  var VERSION = "1.0";

  /* Un montant saisi : {m: nombre|null, p: "" | "exact" | "estime" | "inconnu" | "rien"} */
  function lire(a) {
    if (!a || typeof a !== "object") return {etat: "vide", v: null};
    if (a.p === "rien") return {etat: "zero", v: 0};
    if (a.p === "inconnu") return {etat: "inconnu", v: null};
    if (a.m !== null && a.m !== undefined && !isNaN(a.m)) return {etat: a.p === "estime" ? "estime" : "exact", v: +a.m};
    return {etat: "vide", v: null};
  }

  function facteur(E) {
    if (E.devise_saisie === "EUR") return E.taux_eur || 655.957;
    if (E.devise_saisie === "USD") return E.taux_usd > 0 ? E.taux_usd : null;
    return 1;
  }

  var POSTES = [
    {id: "logement", t: "Logement"},
    {id: "alimentation", t: "Alimentation"},
    {id: "sante", t: "Santé"},
    {id: "transport", t: "Transport"},
    {id: "proches", t: "Aides aux proches"},
    {id: "ceremonies", t: "Cérémonies et contributions", annuel: true},
    {id: "autre", t: "Autres dépenses"}
  ];
  var RESSOURCES = [
    {id: "pension", t: "Pension"},
    {id: "loyers", t: "Loyers ou revenus d’un bien"},
    {id: "activite", t: "Activité réduite"},
    {id: "productifs", t: "Bétail, plantations ou stocks", annuel: true, facultatif: true},
    {id: "proches", t: "Soutien des proches", incertain: true},
    {id: "autre", t: "Autre revenu"}
  ];
  var CAPITAL = [
    {id: "epargne_retraite", t: "Épargne réservée à la retraite"},
    {id: "biens_a_vendre", t: "Biens que vous prévoyez de vendre"}
  ];

  function tauxMensuel(r) { return r ? Math.pow(1 + r, 1 / 12) - 1 : 0; }

  // Capital nécessaire pour verser G par mois pendant k mois
  function capitalNecessaire(G, k, rm) { if (G <= 0 || k <= 0) return 0; return rm === 0 ? G * k : G * (1 - Math.pow(1 + rm, -k)) / rm; }
  // Effort mensuel pendant n mois pour passer de K0 à C
  function effortMensuel(C, K0, n, rm) {
    var K0n = rm === 0 ? K0 : K0 * Math.pow(1 + rm, n);
    if (C <= K0n) return {effort: 0, K0n: K0n};
    if (n <= 0) return {effort: null, K0n: K0n};
    return {effort: rm === 0 ? (C - K0n) / n : (C - K0n) * rm / (Math.pow(1 + rm, n) - 1), K0n: K0n};
  }
  // Mois couverts par K0 en prélevant G par mois (déjà à l'arrêt), plafonné à k
  function moisCouverts(K0, G, k, rm) {
    if (G <= 0) return null;
    if (K0 <= 0) return 0;
    var m;
    if (rm === 0) m = K0 / G;
    else { var x = K0 * rm / G; m = x >= 1 ? Infinity : -Math.log(1 - x) / Math.log(1 + rm); }
    return Math.min(m, k);
  }

  /* E : état de l'estimation. o : {r, plusTard, moinsBesoin, plusRevenu, proches (true|false|undefined)} */
  function estimer(E, o) {
    o = o || {};
    var out = {version: VERSION, manque: [], inconnus: [], estimes: [], vides: [], partiel: false};
    var f = facteur(E);
    if (f === null) out.manque.push("taux");
    var A = E.age_actuel, R = E.age_arret, D = E.duree_retraite;
    if (!(A > 0)) out.manque.push("age_actuel");
    if (!(R > 0)) out.manque.push("age_arret");
    if (!(D > 0)) out.manque.push("duree_retraite");
    if (R > 0 && o.plusTard) R = R + o.plusTard;

    function suivre(lib, x) {
      if (x.etat === "inconnu") out.inconnus.push(lib);
      else if (x.etat === "estime") out.estimes.push(lib);
      else if (x.etat === "vide") out.vides.push(lib);
    }

    // Besoin mensuel
    var B = null, b = E.besoin || {};
    if (b.mode === "guide") {
      var tot = 0, un = false;
      POSTES.forEach(function (p) {
        var x = lire((b.postes || {})[p.id]); suivre("Besoin · " + p.t, x);
        if (x.v !== null) { tot += p.annuel ? x.v / 12 : x.v; un = true; }
      });
      B = un ? tot : null;
    } else {
      var xb = lire(b.total); suivre("Besoin mensuel", xb); B = xb.v;
    }
    if (B === null) out.manque.push("besoin");

    // Revenus réguliers prévus
    var res = E.ressources || {}, P = 0, detail = [], inclure = o.proches !== undefined ? o.proches : !!(res.proches && res.proches.inclure);
    var prochesV = 0;
    RESSOURCES.forEach(function (r) {
      if (r.facultatif && res[r.id] === undefined) return; // ressource non proposée à l'utilisateur
      var x = lire(res[r.id]);
      suivre(r.t, x);
      var v = x.v === null ? null : (r.annuel ? x.v / 12 : x.v);
      if (r.id === "proches") { prochesV = v || 0; if (!inclure) { if (v) detail.push({id: r.id, t: r.t, v: v * (f || 1), exclu: true}); return; } }
      if (v !== null) { P += v; if (v) detail.push({id: r.id, t: r.t, v: v * (f || 1), etat: x.etat}); }
    });
    if (o.plusRevenu) P += o.plusRevenu / (f || 1);

    // Capital déjà disponible
    var cap = E.capital || {}, K0 = 0;
    CAPITAL.forEach(function (c) { var x = lire(cap[c.id]); suivre(c.t, x); if (x.v !== null) K0 += x.v; });

    out.partiel = out.inconnus.length > 0 || (out.vides.length > 0 && b.mode !== "guide") || out.vides.filter(function (l) { return l.indexOf("Besoin") !== 0; }).length > 0;
    if (out.manque.length) { out.ok = false; out.partiel = true; return out; }

    // Conversion unique vers le FCFA
    B = B * f; P = P * f; K0 = K0 * f; prochesV = prochesV * f;
    if (o.moinsBesoin) B = Math.max(0, B - o.moinsBesoin);
    if (o.capital !== undefined && o.capital !== null) K0 = o.capital;

    var r = o.r || 0, rm = tauxMensuel(r);
    var n = Math.max(0, Math.round((R - A) * 12)), k = Math.round(D * 12);
    var G = Math.max(0, B - P);
    var C = capitalNecessaire(G, k, rm);
    var deja = R <= A;
    var e = effortMensuel(C, K0, n, rm);
    out.ok = true;
    out.B = B; out.P = P; out.G = G; out.surplus = Math.max(0, P - B); out.K0 = K0; out.K0n = e.K0n; out.C = C;
    out.n = n; out.k = k; out.r = r; out.rm = rm; out.deja = deja; out.R = R; out.A = A; out.D = D;
    out.detail = detail; out.inclureProches = inclure; out.prochesMontant = prochesV;
    out.effort = deja ? null : e.effort;
    out.moisCouverts = deja ? moisCouverts(K0, G, k, rm) : null;
    out.cas = G <= 0 ? "couvert" : (C <= e.K0n ? "capital" : (deja ? "deja" : "effort"));
    return out;
  }

  // Effort exprimé par grosse rentrée (revenus irréguliers)
  function parRentree(effort, nbParAn, montantRentree) {
    if (!(effort >= 0) || !(nbParAn > 0)) return null;
    var v = effort * 12 / nbParAn;
    return {v: v, pct: montantRentree > 0 ? v / montantRentree : null};
  }

  // Arrondi d'affichage : centaine sous le million, millier au-delà
  function arrondi(x) { if (x === null || x === undefined || isNaN(x)) return x; var a = Math.abs(x) < 1e6 ? 100 : 1000; return Math.round(x / a) * a; }

  var api = {VERSION: VERSION, POSTES: POSTES, RESSOURCES: RESSOURCES, CAPITAL: CAPITAL, lire: lire, facteur: facteur, tauxMensuel: tauxMensuel,
    capitalNecessaire: capitalNecessaire, effortMensuel: effortMensuel, moisCouverts: moisCouverts, estimer: estimer, parRentree: parRentree, arrondi: arrondi};
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.RETRAITE_CALC = api;
})(this);
