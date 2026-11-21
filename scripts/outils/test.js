// Contrôle du simulateur de dettes : node scripts/outils/test.js
global.window = {}; global.document = undefined;
require('../../clone/outils-efa.js'); const S = window.EFA_OUTILS.simuler;
let ko = 0; function ok(n, c) { if (!c) { ko++; console.log('ÉCHEC', n); } }
// 1. sans intérêt : 100 000 à 20 000 par mois = 5 mois, 0 intérêt
let r = S([{ n: 'a', s: 100000, m: 20000, t: 0 }], 0, null); ok('sans intérêt', r.mois === 5 && Math.round(r.interets) === 0);
// 2. une mensualité qui ne couvre pas les intérêts : remboursement bloqué, jamais de boucle infinie
r = S([{ n: 'a', s: 1000000, m: 5000, t: 60 }], 0, null); ok('dette qui grossit', r.bloque && r.mois === 600);
// 3. un versement en plus raccourcit la durée et réduit les intérêts
const D = [{ n: 'moto', s: 600000, m: 50000, t: 18 }, { n: 'cousin', s: 100000, m: 20000, t: 0 }, { n: 'micro', s: 300000, m: 30000, t: 30 }];
const base = S(D, 0, null), av = S(D, 20000, (a, b) => b.t - a.t || a.s - b.s), bn = S(D, 20000, (a, b) => a.s - b.s || b.t - a.t);
ok('effort utile', av.mois < base.mois && av.interets < base.interets);
// 4. l'avalanche ne coûte jamais plus cher que la boule de neige
ok('avalanche ≤ boule de neige', av.interets <= bn.interets + 1);
// 5. toutes les dettes finissent soldées, et les données d'entrée ne sont pas modifiées
ok('tout soldé', av.ordre.length === 3 && bn.ordre.length === 3); ok('entrée intacte', D[0].s === 600000);
console.log(ko ? ko + ' échec(s)' : 'Simulateur de dettes : 7 contrôles passés');
process.exit(ko ? 1 : 0);
