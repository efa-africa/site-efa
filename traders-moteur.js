/* EFA Traders · moteur de simulation (version démonstration, calculs dans le navigateur)
   Règles :
   - Montants en entiers : FCFA (XOF) pour les actions, centimes de dollar pour le change.
   - Cours de change en dix-millièmes (1,1002 → 11002).
   - Arrondi des frais : au FCFA le plus proche (0,5 vers le haut).
   - Coût moyen pondéré, frais d'achat inclus ; vente partielle au prorata, reliquat à la dernière vente.
   - Ordre au marché soumis après la clôture de S : exécuté à l'ouverture de S+1 (mode « ouverture »),
     ou au cours affiché (mode « immédiat », libellé « exécution pédagogique au prix affiché »).
   Aucune donnée réelle : séries synthétiques reproductibles (même scénario + même version = même marché). */
(function (racine) {
  "use strict";

  /* ---------- Hasard reproductible ---------- */
  function hasard(graine) {
    var a = graine >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function grainede(txt) { var h = 2166136261; for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  /* Pas de cotation des actions fictives (convention pédagogique, pas une règle de la BRVM) */
  function pas(prix) { return prix < 1000 ? 1 : prix < 10000 ? 5 : 25; }
  function arrondiPas(prix) { var p = pas(prix); return Math.max(p, Math.round(prix / p) * p); }

  /* ---------- Génération des séries ----------
     regimes : [{ jusqua: n° de séance (exclu), tendance: % par séance, volat: % par séance }]
     chocs   : { n° séance: variation % appliquée à l'ouverture } (issus des événements) */
  function serie(def, nb, graineTxt) {
    var r = hasard(grainede(graineTxt + "|" + def.symbole));
    var forex = def.type === "devise";
    var p = def.depart, out = [];
    for (var s = 0; s < nb; s++) {
      var rg = def.regimes[def.regimes.length - 1];
      for (var k = 0; k < def.regimes.length; k++) if (s < def.regimes[k].jusqua) { rg = def.regimes[k]; break; }
      var choc = (def.chocs && def.chocs[s]) || 0;
      var o = s === 0 ? p : p * (1 + (gauss(r) * rg.volat * 0.25 + choc) / 100);
      var c = o * Math.exp((rg.tendance + gauss(r) * rg.volat) / 100);
      var h = Math.max(o, c) * (1 + Math.abs(gauss(r)) * rg.volat * 0.45 / 100);
      var l = Math.min(o, c) * (1 - Math.abs(gauss(r)) * rg.volat * 0.45 / 100);
      var b;
      if (forex) {
        o = Math.round(o); c = Math.round(c); h = Math.round(h); l = Math.round(l);
        b = { o: o, h: Math.max(h, o, c), l: Math.min(l, o, c), c: c, v: 0 };
      } else {
        o = arrondiPas(o); c = arrondiPas(c); h = arrondiPas(h); l = arrondiPas(l);
        var vb = def.volume || 4000;
        b = { o: o, h: Math.max(h, o, c), l: Math.min(l, o, c), c: c, v: Math.round(vb * (0.55 + r() * 0.9) * (1 + Math.abs(choc) / 4)) };
      }
      out.push(b); p = b.c;
    }
    return out;
  }

  function verifierOHLC(barres) {
    for (var i = 0; i < barres.length; i++) {
      var b = barres[i];
      if (!(b.h >= Math.max(b.o, b.c) && b.l <= Math.min(b.o, b.c) && b.h >= b.l && b.l > 0)) return { ok: false, seance: i };
    }
    return { ok: true };
  }

  /* Construit le marché d'un scénario : séries + événements, identiques à chaque appel */
  function construireMarche(sc, actifsDef) {
    var nb = sc.historique + sc.seances, series = {};
    sc.actifs.forEach(function (sym) {
      var base = actifsDef[sym], reg = (sc.regimes && sc.regimes[sym]) || base.regimes;
      var chocs = {};
      (sc.evenements || []).forEach(function (e) { if (e.actif === sym && e.choc) chocs[sc.historique + e.seance] = (chocs[sc.historique + e.seance] || 0) + e.choc; });
      var def = { symbole: sym, type: base.type, depart: (sc.depart && sc.depart[sym]) || base.depart, volume: base.volume,
        regimes: reg.map(function (x) { return { jusqua: x.jusqua === undefined ? Infinity : x.jusqua + (x.absolu ? 0 : sc.historique), tendance: x.tendance, volat: x.volat }; }),
        chocs: chocs };
      series[sym] = serie(def, nb, sc.id + "@" + sc.version);
    });
    return { series: series, debut: sc.historique - 1, fin: nb - 1 };
  }

  /* ---------- Session ---------- */
  function nouvelleSession(sc, marche, opts) {
    opts = opts || {};
    var forex = sc.univers === "forex";
    var capital = opts.capital || sc.capital;
    var st = {
      v: 1, scenario: sc.id, version: sc.version, univers: sc.univers, devise: forex ? "USD" : "XOF",
      mode: opts.mode || "libre", execution: opts.execution || sc.execution || "ouverture",
      fraisBp: sc.fraisBp || 0, spread: sc.spread || {},
      capital: capital, seance: marche.debut, debut: marche.debut, fin: marche.fin,
      liquidites: capital, positions: {}, ordres: [], executions: [], mouvements: [], valorisations: [],
      fraisCumules: 0, realise: 0, cles: {}, prochainId: 1, termine: false, versionSession: 1, cree: Date.now()
    };
    st.valorisations.push({ seance: st.seance, moment: "clôture", valeur: capital });
    return st;
  }

  /* Cours vus par l'apprenant : rien après la séance courante */
  function visibles(st, marche, sym) { return marche.series[sym].slice(0, st.seance + 1); }
  function barre(marche, sym, s) { return marche.series[sym][s]; }

  function fraisDe(st, brut) { return st.univers === "forex" ? 0 : Math.round(brut * st.fraisBp / 10000); }

  /* Montant en devise du compte. Actions : FCFA. Forex : centimes = quantité × cours(1e-4) / 100 */
  function montant(st, qte, prix) { return st.univers === "forex" ? Math.round(qte * prix / 100) : qte * prix; }

  function coursRef(st, marche, sym, sens) {
    var b = barre(marche, sym, st.seance);
    if (st.univers === "forex") return sens === "achat" ? b.c + (st.spread[sym] || 0) : b.c;
    return b.c;
  }

  /* Estimation affichée dans le ticket (avant confirmation) */
  function estimer(st, marche, o) {
    var p = coursRef(st, marche, o.actif, o.sens), brut = montant(st, o.qte, p), f = fraisDe(st, brut);
    var pos = st.positions[o.actif] || { qte: 0, cout: 0 };
    return {
      prix: p, brut: brut, frais: f, total: o.sens === "achat" ? brut + f : brut - f,
      liquiditesApres: o.sens === "achat" ? st.liquidites - brut - f : st.liquidites + brut - f,
      qteApres: o.sens === "achat" ? pos.qte + o.qte : pos.qte - o.qte,
      execution: st.execution === "immediat" ? "au cours affiché" : "à l'ouverture de la prochaine séance, prix final inconnu"
    };
  }

  function erreur(code, texte) { return { ok: false, code: code, texte: texte }; }

  var MESSAGES = {
    LIQUIDITES: "Liquidités insuffisantes : l'achat, frais compris, dépasse ce que vous avez.",
    QUANTITE: "Quantité détenue insuffisante : on ne vend que ce que l'on possède (vente à découvert désactivée).",
    QTE_INVALIDE: "La quantité doit être un nombre entier positif.",
    TERMINEE: "Session terminée : plus aucun ordre possible.",
    DEJA: "Action déjà traitée : cet ordre est déjà enregistré.",
    JUSTIF: "Choisissez la raison de votre décision.",
    MARCHE: "Marché indisponible pour cet actif."
  };

  /* Soumission. cle = clé d'idempotence (un double clic ne crée pas deux ordres) */
  function soumettre(st, marche, o) {
    if (o.cle && st.cles[o.cle]) { var ex = st.ordres.filter(function (x) { return x.id === st.cles[o.cle]; })[0]; return { ok: true, ordre: ex, doublon: true }; }
    if (st.termine) return erreur("TERMINEE", MESSAGES.TERMINEE);
    if (!marche.series[o.actif]) return erreur("MARCHE", MESSAGES.MARCHE);
    if (!(o.qte > 0) || Math.floor(o.qte) !== o.qte) return erreur("QTE_INVALIDE", MESSAGES.QTE_INVALIDE);
    if (!o.justification || !o.justification.categorie) return erreur("JUSTIF", MESSAGES.JUSTIF);
    var est = estimer(st, marche, o);
    var reservee = st.ordres.filter(function (x) { return x.etat === "en attente" && x.actif === o.actif && x.sens === "vente"; }).reduce(function (a, x) { return a + x.qte; }, 0);
    var engage = st.ordres.filter(function (x) { return x.etat === "en attente" && x.sens === "achat"; }).reduce(function (a, x) { return a + x.estimation.total; }, 0);
    if (o.sens === "vente" && o.qte + reservee > ((st.positions[o.actif] || {}).qte || 0)) return erreur("QUANTITE", MESSAGES.QUANTITE);
    if (o.sens === "achat" && est.total + engage > st.liquidites) return erreur("LIQUIDITES", MESSAGES.LIQUIDITES);
    var ordre = {
      id: st.prochainId++, actif: o.actif, sens: o.sens, qte: o.qte, type: "marché",
      seanceSoumission: st.seance, soumisLe: o.date || Date.now(), estimation: est,
      justification: { categorie: o.justification.categorie, texte: (o.justification.texte || "").slice(0, 280) },
      etat: "en attente", execution: null, reflexion: null
    };
    st.ordres.push(ordre);
    if (o.cle) st.cles[o.cle] = ordre.id;
    st.versionSession++;
    if (st.execution === "immediat") executer(st, ordre, est.prix, st.seance, "cours affiché");
    return { ok: true, ordre: ordre };
  }

  /* Exécution à un prix donné : contrôle de nouveau liquidités et quantités */
  function executer(st, ordre, prix, seance, moment) {
    var brut = montant(st, ordre.qte, prix), f = fraisDe(st, brut);
    var pos = st.positions[ordre.actif] || (st.positions[ordre.actif] = { qte: 0, cout: 0 });
    if (ordre.sens === "achat") {
      if (brut + f > st.liquidites) { ordre.etat = "rejeté"; ordre.motif = MESSAGES.LIQUIDITES; ordre.code = "LIQUIDITES"; return false; }
      st.liquidites -= brut + f;
      pos.qte += ordre.qte; pos.cout += brut + f;
      st.mouvements.push({ seance: seance, sens: "débit", montant: brut + f, motif: "achat", ordre: ordre.id });
      ordre.execution = { prix: prix, brut: brut, frais: f, total: brut + f, seance: seance, moment: moment };
    } else {
      if (ordre.qte > pos.qte) { ordre.etat = "rejeté"; ordre.motif = MESSAGES.QUANTITE; ordre.code = "QUANTITE"; return false; }
      var affecte = ordre.qte === pos.qte ? pos.cout : Math.round(pos.cout * ordre.qte / pos.qte);
      var net = brut - f;
      st.liquidites += net;
      pos.qte -= ordre.qte; pos.cout -= affecte;
      if (pos.qte === 0) pos.cout = 0;
      st.realise += net - affecte;
      st.mouvements.push({ seance: seance, sens: "crédit", montant: net, motif: "vente", ordre: ordre.id });
      ordre.execution = { prix: prix, brut: brut, frais: f, total: net, coutAffecte: affecte, resultat: net - affecte, seance: seance, moment: moment };
    }
    if (pos.qte === 0) delete st.positions[ordre.actif];
    st.fraisCumules += f;
    ordre.etat = "exécuté";
    st.executions.push({ ordre: ordre.id, actif: ordre.actif, sens: ordre.sens, qte: ordre.qte, prix: prix, frais: f, seance: seance });
    return true;
  }

  function annuler(st, id) {
    var o = st.ordres.filter(function (x) { return x.id === id; })[0];
    if (!o || o.etat !== "en attente") return erreur("ETAT", "Seul un ordre en attente peut être annulé.");
    o.etat = "annulé"; st.versionSession++; return { ok: true };
  }

  /* Valeur : liquidités + positions au dernier cours disponible (bid pour le change) */
  function valeur(st, marche, s, cle) {
    var v = st.liquidites;
    Object.keys(st.positions).forEach(function (sym) { v += montant(st, st.positions[sym].qte, barre(marche, sym, s)[cle || "c"]); });
    return v;
  }

  /* Avance d'une séance : publication, exécution à l'ouverture, valorisation */
  function avancer(st, marche) {
    if (st.termine) return erreur("TERMINEE", MESSAGES.TERMINEE);
    if (st.seance >= st.fin) { st.termine = true; return erreur("TERMINEE", "Dernière séance atteinte : la session est terminée."); }
    st.seance += 1;
    var execs = 0;
    st.ordres.forEach(function (o) {
      if (o.etat !== "en attente") return;
      var b = barre(marche, o.actif, st.seance);
      var prix = st.univers === "forex" && o.sens === "achat" ? b.o + (st.spread[o.actif] || 0) : b.o;
      executer(st, o, prix, st.seance, "ouverture");
      execs++;
    });
    if (execs) st.valorisations.push({ seance: st.seance, moment: "après exécution", valeur: valeur(st, marche, st.seance, "o") });
    st.valorisations.push({ seance: st.seance, moment: "clôture", valeur: valeur(st, marche, st.seance, "c") });
    st.versionSession++;
    if (st.seance >= st.fin) st.termine = true;
    return { ok: true, executions: execs };
  }
  function avancerN(st, marche, n) { var r; for (var i = 0; i < n; i++) { r = avancer(st, marche); if (!r.ok || st.termine) break; } return r; }

  function baisseMax(valeurs) {
    var sommet = -Infinity, pire = 0, date = null;
    valeurs.forEach(function (v, i) { if (v > sommet) sommet = v; var b = sommet > 0 ? (sommet - v) / sommet : 0; if (b > pire) { pire = b; date = i; } });
    return { taux: pire, indice: date };
  }

  function reflechir(st, id, texte) {
    var o = st.ordres.filter(function (x) { return x.id === id; })[0];
    if (!o) return erreur("ORDRE", "Ordre introuvable.");
    o.reflexion = { texte: String(texte).slice(0, 400), le: Date.now(), seance: st.seance };
    return { ok: true };
  }

  /* Bilan de session */
  function bilan(st, marche) {
    var v = valeur(st, marche, st.seance, "c");
    var vals = st.valorisations.map(function (x) { return x.valeur; });
    var expoMax = 0;
    st.valorisations.forEach(function (x) { if (x.valeur > 0) { var expo = 1 - liquiditesA(st, x) / x.valeur; if (expo > expoMax) expoMax = expo; } });
    var latent = 0, rep = {};
    Object.keys(st.positions).forEach(function (sym) {
      var mv = montant(st, st.positions[sym].qte, barre(marche, sym, st.seance).c);
      latent += mv - st.positions[sym].cout; rep[sym] = mv;
    });
    return {
      capital: st.capital, valeur: v, resultat: v - st.capital, rendement: (v - st.capital) / st.capital,
      realise: st.realise, latent: latent, frais: st.fraisCumules, baisseMax: baisseMax(vals).taux,
      exposition: v > 0 ? 1 - st.liquidites / v : 0, expositionMax: expoMax, repartition: rep,
      ordres: st.ordres.length, executes: st.ordres.filter(function (o) { return o.etat === "exécuté"; }).length,
      seances: st.seance - st.debut
    };
  }
  /* liquidités à une valorisation donnée : reconstituées par les mouvements jusqu'à cette séance */
  function liquiditesA(st, val) {
    var l = st.capital;
    st.mouvements.forEach(function (m) { if (m.seance < val.seance || (m.seance === val.seance)) l += m.sens === "crédit" ? m.montant : -m.montant; });
    return l;
  }

  /* Rapprochement : les liquidités et positions se reconstituent depuis l'historique */
  function rapprocher(st) {
    var l = st.capital, pos = {};
    st.mouvements.forEach(function (m) { l += m.sens === "crédit" ? m.montant : -m.montant; });
    st.executions.forEach(function (e) { pos[e.actif] = (pos[e.actif] || 0) + (e.sens === "achat" ? e.qte : -e.qte); });
    var okPos = Object.keys(pos).every(function (k) { return pos[k] === ((st.positions[k] || {}).qte || 0); });
    return l === st.liquidites && okPos;
  }

  /* Formats */
  function fcfa(n) { return (n < 0 ? "− " : "") + Math.abs(Math.round(n)).toLocaleString("fr-FR").replace(/ | /g, " ") + " FCFA"; }
  function usd(c) { var a = Math.abs(c); return (c < 0 ? "− " : "") + Math.floor(a / 100).toLocaleString("fr-FR").replace(/ | /g, " ") + "," + String(a % 100).padStart(2, "0") + " USD"; }
  function taux(p) { return (p / 10000).toFixed(4).replace(".", ","); }
  function pct(x, d) { return (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x * 100).toFixed(d === undefined ? 2 : d).replace(".", ",") + " %"; }

  var API = {
    hasard: hasard, serie: serie, verifierOHLC: verifierOHLC, construireMarche: construireMarche,
    nouvelleSession: nouvelleSession, visibles: visibles, estimer: estimer, soumettre: soumettre, executer: executer,
    annuler: annuler, avancer: avancer, avancerN: avancerN, valeur: valeur, baisseMax: baisseMax, reflechir: reflechir,
    bilan: bilan, rapprocher: rapprocher, coursRef: coursRef, montant: montant, MESSAGES: MESSAGES,
    fcfa: fcfa, usd: usd, taux: taux, pct: pct, arrondiPas: arrondiPas
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else racine.EFA_TR = API;
})(this);
