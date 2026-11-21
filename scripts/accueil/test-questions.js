// Contrôle du moteur « prochain pas » : node scripts/accueil/test-questions.js
// Chaque ligne : question | page attendue (outil recommandé). « ? » = toute réponse acceptée si un contenu pertinent est trouvé par la recherche.
const fs = require('fs'), path = require('path');
process.chdir(path.join(__dirname, '..', '..'));
global.window = {}; require('../../clone/prochain-pas.js'); const P = window.EFA_PROCHAIN_PAS;
const IDX = JSON.parse(fs.readFileSync('data/tout-efa.json', 'utf8'));
const T = `J’ai 500 000 F. Qu’est-ce que je peux lancer ?|generateur-de-projet
Où passe mon argent ?|ou-est-passe-mon-argent
Je veux investir à la BRVM|ma-brvm
J’ai une idée de business|generateur-de-projet
Avec 100 000 je lance quoi|generateur-de-projet
je veux ouvrir une boutique de pagnes|generateur-de-projet
Quel commerce faire avec 2 millions|generateur-de-projet
Je cherche un revenu complémentaire|generateur-de-projet
Mon salaire finit le 15 du mois|ou-est-passe-mon-argent
Je n'arrive pas à joindre les deux bouts|ou-est-passe-mon-argent
Comment faire un budget|ou-est-passe-mon-argent
Je gagne 200 000 et il ne reste rien|ou-est-passe-mon-argent
Mes dépenses sont trop élevées|ou-est-passe-mon-argent
Je gagne 150000 par mois comment épargner|epargner
Comment économiser quand on gagne peu|epargner
Je veux mettre de côté chaque mois|epargner
Où garder mon argent en sécurité|ou-garder-sa-reserve
Combien garder pour les imprévus|ou-garder-sa-reserve
J ai 2 millions à placer|investir
Comment faire fructifier 5 millions|investir
Dans quoi investir en Côte d'Ivoire|investir
Quel placement rapporte le plus|investir
C'est quoi une action|ma-brvm
Combien rapporte Sonatel|ma-brvm
Les dividendes de la BRVM|ma-brvm
Et si j'avais investi dans Ecobank il y a un an|ma-brvm
Comment acheter des actions|acheter-des-actions
Quelle SGI choisir|acheter-des-actions
Ouvrir un compte titres|acheter-des-actions
Les FCP c est quoi|opcvm-fcpe
Investir dans un fonds commun de placement|opcvm-fcpe
Acheter des obligations|dat-emprunts-etat
Les bons du Trésor c'est sûr ?|dat-emprunts-etat
Dépôt à terme ou emprunt d'Etat|dat-emprunts-etat
Je veux une assurance vie|investir-assurance-epargne
Je veux un crédit pour une moto|cout-total-credit
La banque me propose un prêt à 12 %|cout-total-credit
Combien va me coûter mon crédit de 3 millions|cout-total-credit
Prendre un microcrédit|cout-total-credit
J'ai trop de dettes|renegocier-une-dette
Je n'arrive plus à rembourser|renegocier-une-dette
Je dois de l'argent à trois personnes|renegocier-une-dette
Ma sœur me demande un prêt|preter-a-un-proche
Un ami veut que je lui prête 200 000|preter-a-un-proche
Mon frère ne me rembourse pas|preter-a-un-proche
Je donne trop à ma famille|solidarite-assureur-de-la-famille
Tout le monde compte sur moi au village|solidarite-assureur-de-la-famille
Ma tontine en Côte d'Ivoire|ecole-de-la-tontine
Faut-il entrer dans une tontine|ecole-de-la-tontine
Je vais ramasser ma tontine le mois prochain|ecole-de-la-tontine
Cotiser 50 000 par mois dans une tontine|ecole-de-la-tontine
Je veux acheter un terrain|acheter-un-terrain
Comment construire ma maison|acheter-un-terrain
Vérifier un ACD|acheter-un-terrain
Investir dans l'immobilier à Abidjan|acheter-un-terrain
Mon père est décédé, que faire|apres-un-deces
héritage|apres-un-deces
Comment régler une succession|apres-un-deces
Payer les études de mes enfants|etudes-enfants-heritage
La rentrée scolaire me ruine|etudes-enfants-heritage
Je vais avoir un enfant|arrivee-enfant
Ma femme est enceinte|arrivee-enfant
On m a proposé un placement à 30% par mois|arnaques
Comment éviter les arnaques|arnaques
La crypto c est bien ?|arnaques
QNET c'est fiable ?|arnaques
On me promet de doubler mon argent|arnaques
Le trading forex ça marche ?|arnaques
Mon business plan est-il solide|mon-business-plan-tient-il
Vérifier mon business plan|mon-business-plan-tient-il
Mon activité gagne-t-elle de l argent|atelier-activite-gagne-t-elle
Ma boutique est-elle rentable|atelier-activite-gagne-t-elle
Comment me payer avec mon commerce|atelier-activite-gagne-t-elle
Combien vaut mon entreprise|valoriser-mon-entreprise
Un investisseur veut entrer dans ma société|valoriser-mon-entreprise
Préparer ma retraite|preparer-ma-retraite
Ma pension CNPS suffira-t-elle|preparer-ma-retraite
Devenir libre financièrement|liberte-financiere
Je veux vivre de mes revenus|liberte-financiere
Je suis en France et je veux investir au pays|cotiser-depuis-l-etranger
Envoyer de l'argent à ma mère depuis le Canada|cotiser-depuis-l-etranger
Mobile money je perds le fil|budget-mobile-money
Wave ou Orange Money|budget-mobile-money
Qu est-ce que l inflation|consommer-et-acheter
Tout augmente au marché|consommer-et-acheter
Je suis étudiant|etudiants
Je viens d'avoir mon premier salaire|etudiants
Former mes employés|organisations
Un programme pour mon organisation|organisations
Je veux un certificat|certificat-cefa
Je veux m abonner|abonnement
Combien coute EFA|abonnement
Parler à Élysée|rendez-vous
Je veux un rendez-vous|rendez-vous
Je veux être accompagné par un coach|rendez-vous
Quelles sont les nouvelles de la BRVM|news
L'actualité économique|news
Je veux lire un livre sur l argent|bibliotheque
Un podcast sur la finance|bibliotheque
Je veux apprendre la finance|ateliers
Quelles formations proposez-vous|ateliers
Je ne sais pas par où commencer|diagnostic
Je suis perdu avec mon argent|diagnostic
Africa 2075|etudes-prospective
bonjour|?`.split('\n').map(l => l.split('|'));
let ok = 0, vide = 0, faux = [];
for (const [q, att] of T) {
  const it = P.comprendre(q), u = it ? (typeof it.o[2] === 'function' ? it.o[2](null) : it.o[2]).split(/[?#.]/)[0] : null;
  const vus = new Set([u, ...(it ? it.a.map(a => (typeof a.url === 'function' ? a.url(null) : a.url).split(/[?#.]/)[0]) : []), ...P.chercher(q, IDX, 6).map(f => f.p.replace('.html', ''))]);
  if (att === '?' || u === att) ok++; else { faux.push(`${q}  →  ${u || 'rien'}  (attendu ${att})${vus.has(att) ? '  [présent dans la page de réponse]' : ''}`); if (!vus.has(att)) vide++; }
}
// Toutes les adresses recommandées existent
let casse = [];
for (const it of P.INTENTS) for (const u of [it.o[2], ...it.a.map(a => a.url)]) { const f = (typeof u === 'function' ? u(null) : u).split(/[?#]/)[0]; if (!fs.existsSync(f)) casse.push(it.id + ' → ' + f); }
console.log(`${T.length} questions · outil attendu en premier : ${ok} (${Math.round(ok / T.length * 100)} %) · attendu absent de toute la page de réponse : ${vide}`);
console.log(faux.join('\n')); if (casse.length) console.log('LIENS CASSÉS :\n' + casse.join('\n'));
