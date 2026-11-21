/* EFA · « Une question. Un prochain pas. »
   Comprend une question écrite librement et propose l'outil EFA qui fait avancer.
   Tout se passe dans le navigateur : la question n'est envoyée nulle part. */
(function () {
  'use strict';

  // Chaque intention : mots repérés, résumé de ce qu'EFA a compris, outil principal, puis compléments.
  var INTENTS = [
    { id: 'lancer', mots: ['lancer', 'lance', 'business', 'commerce', 'activite', 'entreprendre', 'entreprise a creer', 'ouvrir un', 'ouvrir une', 'boutique', 'maquis', 'elevage', 'idee', 'projet', 'vendre', 'creer', 'investir dans une activite', 'quoi faire avec'],
      compris: function (m) { return m ? 'Vous avez <b>' + m.txt + '</b> et vous voulez lancer une activité.' : 'Vous voulez lancer une activité.'; },
      outil: { nom: 'Déclic', sur: 'Trouver mon idée de business', url: function (m) { return 'generateur-de-projet.html' + (m ? '?budget=' + m.v : ''); },
        pourquoi: function (m) { return 'Déclic part de votre budget' + (m ? ' (' + m.txt + ')' : '') + ' pour proposer des activités à tester, avec le premier pas, ce qu’il faut vérifier avant et le piège courant.'; }, cta: 'Trouver mes pistes' },
      aussi: [{ nom: 'Voir clair', t: 'Avant d’engager cette somme', d: 'Vérifiez combien vous pouvez réellement mettre sans toucher à votre réserve de sécurité.', url: 'atelier-ou-passe-mon-argent.html' }],
      autre: { nom: 'Ma BRVM', d: 'Et si cette somme allait plutôt à la Bourse ?', url: function (m) { return 'ma-brvm.html' + (m ? '?m=' + m.v : ''); } } },

    { id: 'bourse', mots: ['brvm', 'bourse', 'action', 'actions', 'sgi', 'dividende', 'dividendes', 'titres', 'cotee', 'cotees', 'sonatel', 'orange ci', 'portefeuille'],
      compris: function (m) { return m ? 'Vous pensez placer <b>' + m.txt + '</b> à la Bourse (BRVM).' : 'Vous vous intéressez à la Bourse (BRVM).'; },
      outil: { nom: 'Ma BRVM', sur: 'Et si j’avais investi ?', url: function (m) { return 'ma-brvm.html' + (m ? '?m=' + m.v : ''); },
        pourquoi: function () { return 'Ma BRVM reconstitue ce qu’aurait donné un achat passé, dividendes et frais compris, et le compare à tout le marché. Le meilleur moyen de comprendre avant d’acheter.'; }, cta: 'Explorer Ma BRVM' },
      aussi: [{ nom: 'Acheter des actions', t: 'Pour passer à l’acte', d: 'Ouvrir un compte chez une SGI, les frais, les questions à poser.', url: 'acheter-des-actions.html' }],
      autre: { nom: 'Voir clair', d: 'Combien puis-je placer sans me mettre en difficulté ?', url: function () { return 'atelier-ou-passe-mon-argent.html'; } } },

    { id: 'voirclair', mots: ['ou passe', 'ou va mon argent', 'depense', 'depenses', 'fin du mois', 'fin de mois', 'budget', 'salaire', 'economiser', 'je n arrive pas', 'rien ne reste', 'gerer mon argent', 'mon argent part'],
      compris: function () { return 'Vous voulez savoir où passe votre argent et ce qu’il vous reste.'; },
      outil: { nom: 'Voir clair', sur: 'Comprendre mon argent', url: function () { return 'atelier-ou-passe-mon-argent.html'; },
        pourquoi: function () { return 'Voir clair met en face ce qui entre, ce qui sort et ce qui reste, poste par poste. C’est le point de départ de toute autre décision.'; }, cta: 'Comprendre mon mois' },
      aussi: [{ nom: 'Mon budget à zéro', t: 'Pour tenir dans la durée', d: 'Donner un rôle à chaque franc avant le début du mois.', url: 'atelier-budget-zero.html' }],
      autre: { nom: 'Déclic', d: 'Et si je lançais une activité en plus ?', url: function () { return 'generateur-de-projet.html'; } } },

    { id: 'placer', mots: ['placer', 'placement', 'faire fructifier', 'rapporter', 'interet', 'interets', 'depot a terme', 'obligation', 'obligations', 'emprunt d etat', 'bons du tresor', 'compte epargne', 'epargne', 'epargner'],
      compris: function (m) { return m ? 'Vous voulez faire travailler <b>' + m.txt + '</b>.' : 'Vous voulez faire travailler votre épargne.'; },
      outil: { nom: 'Dépôt à terme ou emprunt d’État', sur: 'Comparer ce que rapporte mon épargne', url: function () { return 'dat-emprunts-etat.html#calcul'; },
        pourquoi: function () { return 'Le simulateur compare, sur la même durée, un dépôt à terme et un emprunt d’État : ce que vous touchez vraiment, après impôts.'; }, cta: 'Comparer' },
      aussi: [{ nom: 'Où garder sa réserve', t: 'D’abord la sécurité', d: 'L’argent des imprévus ne se place pas comme le reste.', url: 'ou-garder-sa-reserve.html#calcul' }],
      autre: { nom: 'Ma BRVM', d: 'Et à la Bourse, qu’aurait donné cette somme ?', url: function (m) { return 'ma-brvm.html' + (m ? '?m=' + m.v : ''); } } },

    { id: 'credit', mots: ['credit', 'pret', 'emprunter', 'emprunt', 'mensualite', 'taux', 'banque me prete', 'financement', 'microcredit', 'avance sur salaire'],
      compris: function (m) { return m ? 'Vous envisagez un crédit de <b>' + m.txt + '</b>.' : 'Vous envisagez un crédit.'; },
      outil: { nom: 'Le coût total d’un crédit', sur: 'Ce que je rembourse vraiment', url: function () { return 'cout-total-credit.html#calcul'; },
        pourquoi: function () { return 'Le taux affiché ne dit pas tout : frais de dossier, assurance, durée. Le calcul donne ce que le crédit vous coûtera au total.'; }, cta: 'Calculer le coût' },
      aussi: [{ nom: 'Ma banque va-t-elle me prêter ?', t: 'Avant de déposer le dossier', d: 'Ce que la banque regarde, et comment le préparer.', url: 'atelier-ma-banque-va-t-elle-me-preter.html' }],
      autre: { nom: 'Voir clair', d: 'La mensualité tient-elle dans mon mois ?', url: function () { return 'atelier-ou-passe-mon-argent.html'; } } },

    { id: 'dette', mots: ['dette', 'dettes', 'rembourser', 'endette', 'surendette', 'je dois', 'arrieres', 'impaye', 'retard de paiement'],
      compris: function () { return 'Vous avez des dettes à remettre en ordre.'; },
      outil: { nom: 'Renégocier une dette', sur: 'Sortir de l’étau', url: function () { return 'renegocier-une-dette.html#calcul'; },
        pourquoi: function () { return 'Lister ce que vous devez, calculer ce que vous pouvez vraiment payer chaque mois, puis proposer un échéancier réaliste.'; }, cta: 'Commencer' },
      aussi: [{ nom: 'Voir clair', t: 'Pour savoir ce qui reste', d: 'Ce que vous pouvez consacrer chaque mois aux remboursements.', url: 'atelier-ou-passe-mon-argent.html' }],
      autre: null },

    { id: 'tontine', mots: ['tontine', 'cotiser', 'cotisation', 'cotisations', 'tour de tontine', 'association'],
      compris: function () { return 'Vous vous posez une question sur une tontine.'; },
      outil: { nom: 'L’école de la tontine', sur: 'Cotiser sans se faire avoir', url: function () { return 'ecole-de-la-tontine.html'; },
        pourquoi: function () { return 'Comment marche une tontine, qui gagne selon son tour, et les règles qui protègent les membres.'; }, cta: 'Comprendre la tontine' },
      aussi: [{ nom: 'Avant de cotiser', t: 'Les questions à poser', d: 'Vérifier la tontine avant d’y mettre de l’argent.', url: 'avant-de-cotiser.html' }],
      autre: null },

    { id: 'retraite', mots: ['retraite', 'vieux jours', 'pension', 'cnps', 'ipres', 'arreter de travailler'],
      compris: function () { return 'Vous pensez à votre retraite.'; },
      outil: { nom: 'Préparer ma retraite', sur: 'Combien il me faudra', url: function () { return 'preparer-ma-retraite.html'; },
        pourquoi: function () { return 'Estimer ce que vous toucherez, ce qui manquera, et combien mettre de côté chaque mois dès maintenant.'; }, cta: 'Faire le calcul' },
      aussi: [], autre: { nom: 'Ma BRVM', d: 'Ce qu’aurait donné une épargne placée à la Bourse.', url: function () { return 'ma-brvm.html'; } } },

    { id: 'diaspora', mots: ['etranger', 'diaspora', 'france', 'europe', 'envoyer de l argent', 'envoyer au pays', 'depuis l exterieur', 'transfert'],
      compris: function () { return 'Vous êtes à l’étranger et vous voulez agir au pays.'; },
      outil: { nom: 'Cotiser depuis l’étranger', sur: 'Mon argent au pays', url: function () { return 'cotiser-depuis-l-etranger.html#calcul'; },
        pourquoi: function () { return 'Les frais d’envoi, le change et les bons réflexes pour que votre argent arrive et serve à ce que vous avez décidé.'; }, cta: 'Commencer' },
      aussi: [{ nom: 'Déclic', t: 'Un projet au pays ?', d: 'Des activités à lancer selon votre budget.', url: 'generateur-de-projet.html' }], autre: null },

    { id: 'valo', mots: ['valeur de mon entreprise', 'combien vaut', 'valoriser', 'vendre mon entreprise', 'investisseur', 'lever des fonds', 'associe'],
      compris: function () { return 'Vous voulez savoir ce que vaut votre entreprise.'; },
      outil: { nom: 'Valo', sur: 'Ce que vaut mon entreprise', url: function () { return 'valoriser-mon-entreprise.html'; },
        pourquoi: function () { return 'Une fourchette de valeur à partir de vos chiffres, et ce qu’un investisseur regardera.'; }, cta: 'Estimer' },
      aussi: [], autre: null },

    { id: 'reserve', mots: ['imprevu', 'imprevus', 'urgence', 'reserve', 'mettre de cote', 'coup dur', 'securite'],
      compris: function () { return 'Vous voulez vous protéger des imprévus.'; },
      outil: { nom: 'Où garder sa réserve', sur: 'L’argent des coups durs', url: function () { return 'ou-garder-sa-reserve.html#calcul'; },
        pourquoi: function () { return 'Combien garder de côté, et où, pour qu’il soit disponible le jour où vous en avez besoin.'; }, cta: 'Calculer ma réserve' },
      aussi: [{ nom: 'Voir clair', t: 'Pour trouver la somme', d: 'Ce que vous pouvez mettre de côté chaque mois.', url: 'atelier-ou-passe-mon-argent.html' }], autre: null },

    { id: 'apprendre', mots: ['apprendre', 'formation', 'former', 'cours', 'atelier', 'comprendre la finance', 'debuter', 'debutant', 'par ou commencer'],
      compris: function () { return 'Vous voulez apprendre à votre rythme.'; },
      outil: { nom: 'Les ateliers EFA', sur: 'Apprendre à mon rythme', url: function () { return 'ateliers.html'; },
        pourquoi: function () { return 'Des ateliers courts, avec des situations d’ici et des exercices concrets, classés par thème.'; }, cta: 'Voir les ateliers' },
      aussi: [{ nom: 'Mon diagnostic', t: 'Si je ne sais pas par où commencer', d: 'Une minute pour savoir où vous en êtes.', url: 'diagnostic.html' }], autre: null }
  ];

  function plat(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, ' ').replace(/\s+/g, ' ').trim(); }

  // Montant : « 500 000 F », « 500000 », « 500k », « 2 millions », « 1,5 M »
  function montant(q) {
    var s = plat(q).replace(/(\d)[\s.](?=\d{3}\b)/g, '$1');
    var m = s.match(/(\d+(?:[.,]\d+)?)\s*(millions?|million|m\b|k\b|mille)?\s*(f\b|fcfa|francs?|cfa)?/);
    if (!m) return null;
    var v = parseFloat(m[1].replace(',', '.')), u = m[2] || '';
    if (/^m/.test(u)) v *= 1e6; else if (u === 'k' || u === 'mille') v *= 1e3;
    if (!(v >= 1000)) return null;
    v = Math.round(v);
    return { v: v, txt: String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' F' };
  }

  function comprendre(q) {
    var p = ' ' + plat(q) + ' ', best = null;
    INTENTS.forEach(function (it, rang) {
      var sc = 0;
      it.mots.forEach(function (w) { if (p.indexOf(' ' + w) >= 0) sc += w.indexOf(' ') > 0 ? 2 : 1; });
      if (sc && (!best || sc > best.sc)) best = { it: it, sc: sc };
    });
    return best ? best.it : null;
  }

  window.EFA_PROCHAIN_PAS = { comprendre: comprendre, montant: montant, INTENTS: INTENTS };
})();
