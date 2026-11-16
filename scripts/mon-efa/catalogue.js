/* EFA · Fabrique data/mon-efa-ateliers.json : pour chaque atelier guidé, son titre, son nombre d'écrans, sa page et son prix.
   Usage (racine du dépôt) : node scripts/mon-efa/catalogue.js  — à relancer après l'ajout d'un atelier. */
const fs = require('fs');
global.window = {};
eval(fs.readFileSync('efa-verrou.js', 'utf8').split('var nom =')[0] + 'window.EFA_VERROU = { pages: P }; })();');
const PAY = window.EFA_VERROU.pages, out = {};
/* Images : celles du catalogue des ateliers, sinon une image proche du thème */
window.EFA_ATELIERS = null; eval(fs.readFileSync('clone/ateliers-data.js', 'utf8'));
const IMGS = {}; (window.EFA_ATELIERS.liste || []).forEach(a => { if (a.img) IMGS[a.id] = a.img.replace(/\?.*$/, ''); });
const THEME = [[/bourse|brvm|portefeuille|societe|placer|placements|ordre/, 'marches-entree-r.webp'], [/credit|dette|surendettement|rembourser|banque|preter-moi/, 'q3.webp'],
  [/activite|commerce|business|investir-activite|factures/, 'coach-entreprise.webp'], [/retraite|etudes-enfant|deces|assurance|transmettre/, 'coach-patrimoine.webp'],
  [/faux|rendement|reseau|confier|arnaque/, 'gen-arnaques.webp'], [/tontine/, 'tontine.webp'], [/microfinance|mobile/, 'simulation-r.webp'],
  [/lot|terrain|construire/, 'univers-terrain.webp'], [/budget|argent|grosse/, 'budget.webp'], [/reserve|epargne/, 'univers-epargne.webp'], [/preter|donner|famille/, 'benefice-collectif.webp']];
function image(id) { if (IMGS[id]) return IMGS[id]; for (const [re, im] of THEME) if (re.test(id)) return im; return 'q1.webp'; }
for (const f of fs.readdirSync('ateliers-guides').filter(x => x.endsWith('.js')).sort()) {
  window.ATELIER = null; eval(fs.readFileSync('ateliers-guides/' + f, 'utf8'));
  const A = window.ATELIER; if (!A || !A.id) continue;
  const page = 'atelier-' + A.id + '.html'; if (!fs.existsSync(page)) continue;
  let n = 0; (A.chapitres || []).forEach(c => n += (c.e || []).length);
  const p = PAY['atelier-' + A.id];
  out[A.id] = { t: A.titre, n, page, prix: p ? p[1] : 0, offerts: p ? (p[4] || 0) : 0, img: image(A.id) };
}
/* Cours écrits à part (même verrou) */
out['premiers-pas-bourse'] = { t: 'Mes premiers pas en Bourse', n: 31, page: 'premiers-pas-bourse.html', prix: 30000, offerts: 2, cle: 'efa-pp-v1', img: image('premiers-pas-bourse') };
out['premier-ordre-brvm'] = { t: 'Mon premier ordre à la Bourse (BRVM)', n: 0, page: 'coach-bourse.html', prix: 50000, offerts: 1, cle: 'efa-coach-brvm-v1', img: image('premier-ordre-brvm') };
fs.writeFileSync('data/mon-efa-ateliers.json', JSON.stringify(out));
for (const k in out) if (!fs.existsSync('clone/assets/' + out[k].img)) console.log('image absente', k, out[k].img);
console.log(Object.keys(out).length, 'ateliers ·', Object.values(out).filter(x => !x.prix).length, 'gratuits');
