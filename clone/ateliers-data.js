/* EFA · Les 20 ateliers payants et les clés gratuites de la période de test.
   Partagé par la page « Choisir son atelier » (coaching.html) et la page interne des clés (ateliers-cles.html).

   Clés de test : EFA-XXXX-YYYY. YYYY est calculé à partir de XXXX (somme de contrôle) :
   une clé tapée au hasard ne passe pas, mais ce n'est pas une sécurité forte (le calcul est dans ce fichier).
   Pendant le test, c'est suffisant ; le paiement en ligne remplacera les clés. */
window.EFA_ATELIERS = (function () {
  var PRIX = 50000, FIN_TEST = '2026-12-31';
  var A = [
    // Cours à votre rythme (hors catalogue des vingt ateliers)
    { id: 'premiers-pas-bourse', cours: 1, prix: 15000, lien: 'premiers-pas-bourse.html', aff: 'cours-premiers-pas.webp', t: 'Mes premiers pas en Bourse', c: 0, img: 'sgi-entree.webp', pour: 'Vous voulez investir à la Bourse (BRVM) et partez de zéro.', rep: 'Votre réserve et votre horizon écrits, le marché compris, une entreprise lue, et votre SGI choisie.' },
    // Ateliers approfondis avec Élysée Johnson
    { id: 'premier-ordre-brvm', prix: 50000, lien: 'coach-bourse.html', t: 'Mon premier ordre à la Bourse (BRVM)', c: 1, img: 'carte-bourse-900.webp', pour: 'Vous voulez investir à la Bourse (BRVM) et ne savez pas par où commencer.', rep: 'Votre compte-titres ouvert, votre SGI choisie, votre premier ordre préparé.' },
    { id: 'lire-societe-cotee', prix: 50000, t: 'Lire une société cotée comme un investisseur', c: 1, img: 'marches-entree.webp', pour: 'Vous suivez Sonatel, Orange CI ou la SGBCI sans savoir lire leurs chiffres.', rep: 'Une méthode pour lire résultats, dividende et cours, appliquée à trois sociétés.' },
    { id: 'ipo-emprunts-etat', prix: 40000, t: 'Introductions en Bourse et emprunts d’État : y aller ou pas ?', c: 1, img: 'efa-news.webp', pour: 'Une offre publique arrive (introduction en Bourse, emprunt obligataire) et vous hésitez.', rep: 'Une grille de décision, appliquée aux offres du moment.' },
    { id: 'tontine-spirale', prix: 40000, t: 'Ma tontine devient une spirale', c: 1, img: 'etudes-terrain.webp', alias: 'atelier-tontine', pour: 'Vous organisez une tontine ou vous en êtes membre.', rep: 'La part gardée à chaque tour, fixée, et la réserve du groupe lancée.' },
    { id: 'club-investissement', prix: 50000, t: 'Du club de tontine au club d’investissement', c: 1, img: 'tontine.webp', pour: 'Votre groupe veut faire travailler son argent ensemble.', rep: 'Des statuts, des règles et un premier placement collectif préparé.' },
    { id: 'pilier-famille', prix: 40000, t: 'Pilier de famille sans m’épuiser', c: 1, img: 'carte-proches-900.webp', pour: 'La famille compte sur vous et votre budget n’y résiste pas.', rep: 'Une enveloppe famille budgétée et les mots pour dire non sans rompre.' },
    { id: 'patrimoine-10-ans', prix: 200000, t: 'Mon patrimoine sur 10 ans', c: 1, img: 'benefice-patrimoine.webp', alias: 'atelier-patrimoine', pour: 'Vous avez des revenus ou des biens et voulez un cap : terrain, maison, placements, retraite.', rep: 'Un plan écrit sur dix ans et la liste des points à vérifier.' },
    { id: 'dirigeant-entreprise-maison', prix: 100000, t: 'Dirigeant : séparer l’entreprise et la maison', c: 1, img: 'coach-entreprise.webp', alias: 'atelier-entreprise', pour: 'Vous dirigez une activité et la caisse se mêle à la maison.', rep: 'Votre salaire fixé, un tableau de trésorerie et un dossier de financement esquissé.' },
    { id: 'cadres-train-de-vie', prix: 50000, t: 'Cadres : de bons revenus, mais rien qui reste', c: 1, img: 'q1.webp', pour: 'Votre salaire augmente, votre épargne non.', rep: 'Votre train de vie chiffré et la règle « je me paie d’abord » mise en place.' },
    { id: 'diaspora-investir', prix: 200000, t: 'Diaspora : investir au pays sans se faire avoir', c: 1, img: 'acteurs.webp', pour: 'Vous vivez à l’étranger et envoyez de l’argent pour des projets au pays.', rep: 'Vos envois budgétés, votre chantier ou terrain sécurisé, vos papiers en ordre.' },
    // Ateliers enregistrés : vidéo et exercices, à votre rythme, une fiche à garder
    { id: 'ou-passe-mon-argent', gratuit: 1, t: 'Où est passé mon argent ? Trente jours pour reprendre la main', c: 0, img: 'coach-budget.webp', alias: 'atelier-budget', pour: 'Le mois file et il ne reste rien.', rep: 'Vos dépenses réelles repérées et trois postes à corriger.' },
    { id: 'budget-qui-tient', gratuit: 1, t: 'Mon budget en FCFA qui tient, même avec un revenu irrégulier', c: 0, img: 'budget.webp', pour: 'Salaire, commerce ou missions : votre revenu varie.', rep: 'Un budget en trois poches et une caisse tampon.' },
    { id: 'reserve-securite', gratuit: 1, t: 'Ma réserve de sécurité : combien, où la garder', c: 0, img: 'q2.webp', pour: 'Le moindre imprévu vous met en difficulté.', rep: 'Le montant de votre réserve et l’endroit où la placer : banque, microfinance ou mobile money.' },
    { id: 'sortir-dettes', prix: 15000, t: 'Sortir de mes dettes : lister, classer, renégocier', c: 0, img: 'q3.webp', pour: 'Les mensualités s’accumulent.', rep: 'Vos dettes classées par coût et un ordre de remboursement.' },
    { id: 'mobile-money-frais', prix: 15000, t: 'Mobile money et frais : ce que coûtent les petits transferts', c: 0, img: 'simulation.webp', pour: 'Vous payez tout par mobile money.', rep: 'Vos frais du mois chiffrés et une règle simple pour les réduire.' },
    { id: 'preter-ou-donner', prix: 15000, t: 'Prêter à un proche, ou donner ?', c: 0, img: 'benefice-collectif.webp', pour: 'Un proche vous demande de l’argent.', rep: 'Une méthode pour décider et le message prêt à envoyer.' },
    { id: 'grosse-somme', prix: 40000, t: 'Recevoir une grosse somme : décider avant de la recevoir', c: 0, img: 'q4.webp', pour: 'Une prime, un tour de tontine ou un 13e mois arrive.', rep: 'La part gardée décidée avant le jour J.' },
    { id: 'terrain-sans-se-faire-avoir', prix: 40000, t: 'Acheter un terrain sans se faire avoir', c: 0, img: 'globe.webp', pour: 'Vous voulez acheter un terrain.', rep: 'Les papiers à vérifier, étape par étape, jusqu’au titre foncier.' },
    { id: 'placements-expliques', prix: 15000, t: 'DAT, OPCVM, FCPE : les placements expliqués', c: 0, img: 'efa-etudes.webp', pour: 'Votre réserve est prête et vous voulez la faire travailler.', rep: 'Les placements de la zone comparés : rendement, risque, disponibilité.' },
    { id: 'retraite-sans-pension', prix: 40000, t: 'Préparer sa retraite quand on n’a pas de pension', c: 0, img: 'coach-patrimoine.webp', pour: 'Vous travaillez à votre compte ou votre pension sera faible.', rep: 'Le montant à mettre de côté chaque mois et le plan pour y arriver.' }
  ];
  var ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function controle(x) {
    var h = 2166136261;
    var s = 'efa-ateliers-pilote-2026|' + x;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var o = '';
    for (var k = 0; k < 4; k++) { o += ALPHA[h % ALPHA.length]; h = Math.floor(h / ALPHA.length) ^ (k * 7919); }
    return o;
  }
  function nouvelleCle() {
    var x = '', a = new Uint32Array(4);
    try { crypto.getRandomValues(a); } catch (e) { for (var j = 0; j < 4; j++) a[j] = Math.random() * 1e9; }
    for (var i = 0; i < 4; i++) x += ALPHA[a[i] % ALPHA.length];
    return 'EFA-' + x + '-' + controle(x);
  }
  function cleValide(c) {
    var m = String(c || '').trim().toUpperCase().replace(/\s+/g, '').match(/^EFA-([A-Z2-9]{4})-([A-Z2-9]{4})$/);
    if (!m) return false;
    if (new Date() > new Date(FIN_TEST + 'T23:59:59')) return false;
    return controle(m[1]) === m[2];
  }
  // Prix affichés. Pour le lancement, l'accès est offert : clé générée avec un email (jusqu'à 50 000 FCFA), sur demande au-delà.
  function fcfa(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') + ' FCFA'; }
  function prix(a) { return a && a.gratuit ? 'Gratuit' : fcfa(a.prix || PRIX); }
  function acces(a) { return a.gratuit ? 'gratuit' : (a.prix || PRIX) >= 100000 ? 'contact' : 'cle'; }
  return { liste: A, prix: prix, acces: acces, PRIX: PRIX, FIN_TEST: FIN_TEST, nouvelleCle: nouvelleCle, cleValide: cleValide };
})();
