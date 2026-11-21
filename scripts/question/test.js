// Contrôle du catalogue : node scripts/question/test.js
// 1. chacune des questions du catalogue doit se retrouver elle-même ; 2. des formulations libres doivent retrouver la bonne fiche.
const fs = require('fs'), path = require('path');
process.chdir(path.join(__dirname, '..', '..'));
global.window = {}; require('../../clone/prochain-pas.js'); const P = window.EFA_PROCHAIN_PAS;
const CAT = JSON.parse(fs.readFileSync('data/questions/catalogue.json', 'utf8'));
let ko = 0;
for (const f of CAT.questions) { const r = P.rapprocher(f.q, CAT); if (!r || r.n !== f.n) { ko++; console.log('NON RETROUVÉE', f.n, f.q, '→', r && r.n); } }
const LIBRE = `mon salaire finit avant la fin du mois pourquoi|2
comment bien répartir mon salaire quand il arrive|9
je n'arrive pas à garder de l'argent, je commence par quoi|15
comment épargner quand j'ai un petit salaire|16
j'ai reçu une prime, je fais quoi avec|22
que faire avec 1 million de fcfa|23
que faire de l'argent de ma tontine quand c'est mon tour|27
comment je sors de mes dettes|31
quelle dette rembourser en premier|32
combien me coûte mon crédit au total|33
dois-je prêter de l'argent à un proche|40
avec 100 000 F quel business je peux lancer|47
quel business marche dans mon quartier|53
comment avoir mes premiers clients|56
mon business est rentable ou pas|59
combien vaut mon entreprise|64
comment commencer à investir|66
quelle SGI choisir pour ouvrir mon compte|70
quels frais pour acheter et vendre une action|71
c'est quoi un dividende et quand il est versé|74
dois-je vendre une action qui a baissé|79
investir d'un coup ou chaque mois|81
est-ce qu'on peut perdre tout son argent en bourse|85
comment devenir riche avec mon revenu d'aujourd'hui|86
acheter une maison ou continuer à louer|92
créer un business ou investir en bourse|91
il est trop tard pour devenir riche à 35 ans|99`.split('\n').map(l => l.split('|'));
let ok = 0, autre = 0, rien = 0;
for (const [q, n] of LIBRE) { const r = P.rapprocher(q, CAT); if (r && r.n === +n) ok++; else if (r) { autre++; console.log('AUTRE FICHE', q, '→', r.n, r.q, '(attendu', n + ')'); } else { rien++; console.log('PAS DE FICHE', q, '(attendu', n + ', le moteur général prend le relais :', (P.comprendre(q) || {}).id, ')'); } }
console.log(`Catalogue : ${CAT.questions.length - ko}/${CAT.questions.length} questions retrouvées. Formulations libres : ${ok}/${LIBRE.length} sur la bonne fiche, ${autre} sur une autre, ${rien} sans fiche.`);
process.exit(ko ? 1 : 0);
