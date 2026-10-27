// Critères de recette EFA Traders (cahier des charges, §29) : node scripts/test/traders.test.js
const M = require("../../traders-moteur.js");
let ok = 0, ko = 0;
function t(nom, cond, info) { if (cond) { ok++; console.log("✓ " + nom); } else { ko++; console.log("✗ " + nom, info === undefined ? "" : info); } }
const B = (o, c) => ({ o, h: Math.max(o, c), l: Math.min(o, c), c, v: 1000 });
function marcheManuel(prix) { return { series: { AAA: prix.map(p => Array.isArray(p) ? B(p[0], p[1]) : B(p, p)) }, debut: 0, fin: prix.length - 1 }; }
const sc = { id: "test", version: 1, univers: "actions", capital: 1000000, fraisBp: 20 };
const J = { categorie: "tester une hypothèse" };

// 1-2 Achat 100 × 5000, frais 0,20 % → 501 000 ; revente 5500 → +47 900, capital 1 047 900
let m = marcheManuel([5000, 5000, 5500, 5500]);
let s = M.nouvelleSession(sc, m, { execution: "immediat" });
M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 100, justification: J });
t("Achat 100 à 5 000, frais 0,20 % : débit 501 000", s.ordres[0].execution.total === 501000 && s.liquidites === 499000);
M.avancer(s, m); M.avancer(s, m);
M.soumettre(s, m, { actif: "AAA", sens: "vente", qte: 100, justification: J });
const v = s.ordres[1].execution;
t("Revente à 5 500 : produit net 548 900, résultat 47 900", v.total === 548900 && v.resultat === 47900, v);
t("Capital final 1 047 900", s.liquidites === 1047900 && M.valeur(s, m, s.seance) === 1047900);

// 3 Vente supérieure à la position
s = M.nouvelleSession(sc, m, { execution: "immediat" });
M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 10, justification: J });
let avant = JSON.stringify([s.liquidites, s.positions]);
let r = M.soumettre(s, m, { actif: "AAA", sens: "vente", qte: 11, justification: J });
t("Vente supérieure à la position : rejet sans modification", !r.ok && r.code === "QUANTITE" && JSON.stringify([s.liquidites, s.positions]) === avant);

// 4 Achat trop important
r = M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 200, justification: J });
t("Achat trop important : rejet, solde jamais négatif", !r.ok && r.code === "LIQUIDITES" && s.liquidites >= 0);

// 5 Double soumission identique
s = M.nouvelleSession(sc, m, {});
M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 5, justification: J, cle: "k1" });
r = M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 5, justification: J, cle: "k1" });
t("Double soumission : un seul ordre", s.ordres.length === 1 && r.doublon);

// 6 Deux achats concurrents ne dépassent pas les liquidités (réservation des ordres en attente)
s = M.nouvelleSession(sc, m, {});
let a = M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 150, justification: J, cle: "onglet1" });
let b = M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 150, justification: J, cle: "onglet2" });
M.avancer(s, m);
t("Deux achats simultanés : aucun dépassement", a.ok && !b.ok && s.liquidites >= 0, [a.ok, b.ok, s.liquidites]);
// … et à l'exécution, si l'ouverture monte, nouvelle vérification
m = marcheManuel([5000, [9000, 9000]]);
s = M.nouvelleSession(sc, m, {});
M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 199, justification: J });
M.avancer(s, m);
t("Liquidités revérifiées à l'exécution : rejet expliqué, pas de réduction silencieuse", s.ordres[0].etat === "rejeté" && s.liquidites === 1000000 && /insuffisantes/.test(s.ordres[0].motif));

// 7 Vente partielle, 8 fermeture complète
m = marcheManuel([1000, 1000, 1200, 1200]);
s = M.nouvelleSession(sc, m, { execution: "immediat" });
M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 3, justification: J });   // 3000 + 6 = 3006
M.soumettre(s, m, { actif: "AAA", sens: "vente", qte: 1, justification: J });   // affecte 1002
t("Vente partielle : coût affecté 1 002, reste 2 titres pour 2 004", s.ordres[1].execution.coutAffecte === 1002 && s.positions.AAA.qte === 2 && s.positions.AAA.cout === 2004);
m = marcheManuel([1000, 1000]);
s = M.nouvelleSession(sc, m, { execution: "immediat" });
M.soumettre(s, m, { actif: "AAA", sens: "achat", qte: 7, justification: J });   // 7000 + 14 = 7014
M.soumettre(s, m, { actif: "AAA", sens: "vente", qte: 3, justification: J });
M.soumettre(s, m, { actif: "AAA", sens: "vente", qte: 4, justification: J });
const affs = s.ordres.slice(1).map(o => o.execution.coutAffecte);
t("Fermeture complète : coûts affectés = coût total, aucun reliquat", affs[0] + affs[1] === 7014 && !s.positions.AAA, affs);
t("Rapprochement liquidités et positions depuis l'historique", M.rapprocher(s));

// 9 Forex : achat puis revente immédiate = −0,20 USD
const fx = { id: "fx", version: 1, univers: "forex", capital: 1000000, spread: { EURUSD: 2 } };
const mf = { series: { EURUSD: [{ o: 11000, h: 11000, l: 11000, c: 11000, v: 0 }] }, debut: 0, fin: 0 };
s = M.nouvelleSession(fx, mf, { execution: "immediat" });
M.soumettre(s, mf, { actif: "EURUSD", sens: "achat", qte: 1000, justification: J });
t("Forex : achat de 1 000 EUR à l'ask 1,1002 = 1 100,20 USD", s.ordres[0].execution.total === 110020, s.ordres[0].execution);
M.soumettre(s, mf, { actif: "EURUSD", sens: "vente", qte: 1000, justification: J });
t("Forex : revente au bid 1,1000 = 1 100,00 USD, résultat −0,20 USD", s.ordres[1].execution.total === 110000 && s.liquidites - 1000000 === -20);

// 10 Variation en pourcentage depuis la bonne base
t("Variation : de 5 000 à 5 500 = +10 %, de 5 500 à 5 000 = −9,09 %", M.pct((5500 - 5000) / 5000) === "+10,00 %" && M.pct((5000 - 5500) / 5500) === "−9,09 %");

// 11 +5 séances = 5 × 1 séance ; 12 reproductibilité ; OHLC
const C = { AAA: { type: "action", depart: 5000, volume: 3000, regimes: [{ tendance: 0.05, volat: 1.6 }] } };
const S2 = { id: "repro", version: 1, univers: "actions", capital: 1000000, fraisBp: 20, historique: 30, seances: 40, actifs: ["AAA"], evenements: [{ seance: 12, actif: "AAA", choc: -9 }] };
const m1 = M.construireMarche(S2, C), m2 = M.construireMarche(S2, C);
t("Même scénario, même version : même marché", JSON.stringify(m1) === JSON.stringify(m2));
t("Bougies cohérentes (High ≥ max(O,C), Low ≤ min(O,C))", M.verifierOHLC(m1.series.AAA).ok);
let x = M.nouvelleSession(S2, m1, {}), y = M.nouvelleSession(S2, m1, {});
M.soumettre(x, m1, { actif: "AAA", sens: "achat", qte: 20, justification: J }); M.soumettre(y, m1, { actif: "AAA", sens: "achat", qte: 20, justification: J });
M.avancerN(x, m1, 5); for (let i = 0; i < 5; i++) M.avancer(y, m1);
t("Avance de 5 séances = 5 avances d'une séance", JSON.stringify([x.liquidites, x.positions, x.valorisations]) === JSON.stringify([y.liquidites, y.positions, y.valorisations]));

// 13 Futur inaccessible
t("Consultation du futur impossible", M.visibles(x, m1, "AAA").length === x.seance + 1);

// 14 Changement d'actif : pas d'effet (l'estimation ne modifie rien)
avant = JSON.stringify(x);
M.estimer(x, m1, { actif: "AAA", sens: "achat", qte: 3 });
t("Estimer / changer d'actif ne modifie ni liquidités ni temps", JSON.stringify(x) === avant);

// 15 Baisse maximale sur un jeu connu : 100 → 120 → 90 → 130 → 104 : pire = 25 %
t("Baisse maximale : 25 % sur 100, 120, 90, 130, 104", Math.abs(M.baisseMax([100, 120, 90, 130, 104]).taux - 0.25) < 1e-12);

// 16 Sauvegarde : l'état sérialisé redonne exactement la même session
const z = JSON.parse(JSON.stringify(x));
M.avancer(z, m1); M.avancer(x, m1);
t("Actualisation : l'état sauvegardé reprend à l'identique", JSON.stringify(z) === JSON.stringify(x));

// 17 Ordres à cours limité et stop
const Bx = (o, h, l, c) => ({ o, h, l, c, v: 1000 });
let ml = { series: { AAA: [Bx(5000,5000,5000,5000), Bx(5100,5150,4900,5000), Bx(5000,5050,4980,5020), Bx(5200,5250,5150,5200)] }, debut: 0, fin: 3 };
s = M.nouvelleSession(sc, ml, {});
M.soumettre(s, ml, { actif: "AAA", sens: "achat", qte: 10, type: "limite", limite: 4950, validite: 1, justification: J });
M.avancer(s, ml);
t("Limite achat 4 950 : ouverture 5 100, plus bas 4 900 → exécuté à 4 950", s.ordres[0].etat === "exécuté" && s.ordres[0].execution.prix === 4950);
s = M.nouvelleSession(sc, ml, {});
M.soumettre(s, ml, { actif: "AAA", sens: "achat", qte: 10, type: "limite", limite: 5200, justification: J });
M.avancer(s, ml);
t("Limite achat 5 200 : ouverture 5 100 déjà sous la limite → exécuté à 5 100", s.ordres[0].execution.prix === 5100);
s = M.nouvelleSession(sc, ml, {});
M.soumettre(s, ml, { actif: "AAA", sens: "achat", qte: 10, type: "limite", limite: 4800, validite: 2, justification: J });
M.avancer(s, ml); const att = s.ordres[0].etat; M.avancer(s, ml);
t("Limite non atteinte : en attente, puis expirée après sa validité", att === "en attente" && s.ordres[0].etat === "expiré" && s.liquidites === 1000000);
s = M.nouvelleSession(sc, ml, { execution: "ouverture" });
M.soumettre(s, ml, { actif: "AAA", sens: "achat", qte: 10, justification: J }); M.avancer(s, ml);
M.soumettre(s, ml, { actif: "AAA", sens: "vente", qte: 10, type: "stop", seuil: 4990, justification: J }); M.avancer(s, ml);
t("Stop vente 4 990 : plus bas 4 980 → exécuté au seuil", s.ordres[1].etat === "exécuté" && s.ordres[1].execution.prix === 4990);
let mg = { series: { AAA: [Bx(5000,5000,5000,5000), Bx(4600,4700,4550,4650)] }, debut: 0, fin: 1 };
s = M.nouvelleSession(sc, mg, { execution: "immediat" });
M.soumettre(s, mg, { actif: "AAA", sens: "achat", qte: 10, justification: J });
s.execution = "ouverture";
M.soumettre(s, mg, { actif: "AAA", sens: "vente", qte: 10, type: "stop", seuil: 4900, justification: J }); M.avancer(s, mg);
t("Stop vente 4 900 et ouverture à 4 600 : exécuté à 4 600, moins bon que le seuil", s.ordres[1].execution.prix === 4600);
s = M.nouvelleSession(sc, mg, { execution: "immediat" });
r = M.soumettre(s, mg, { actif: "AAA", sens: "achat", qte: 1, type: "limite", limite: 4000, justification: J });
t("Exécution au cours affiché : ordre limite refusé avec explication", !r.ok && r.code === "TYPE");
s = M.nouvelleSession(sc, ml, {});
a = M.soumettre(s, ml, { actif: "AAA", sens: "achat", qte: 150, type: "limite", limite: 5000, justification: J });
b = M.soumettre(s, ml, { actif: "AAA", sens: "achat", qte: 100, justification: J });
t("Un ordre limite réserve ses liquidités : pas de double dépense", a.ok && !b.ok && b.code === "LIQUIDITES");

console.log(`\n${ok} réussis, ${ko} échoués`);
process.exit(ko ? 1 : 0);
