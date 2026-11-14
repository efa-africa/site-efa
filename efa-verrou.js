/* EFA · Verrou des ateliers payants (13 nov. 2026)
   Une page d'atelier payant s'ouvre si l'une de ces conditions est remplie :
     - l'atelier a été ouvert sur cet appareil (crédits, code promo EFA-…) : efa_ateliers_v1.ok[id] ;
     - une formule efa. abonnement active : Intégral, Proximité, Privilège = tous ; Essentiel = l'atelier choisi ;
     - un accès équipe (EFAT-…) : tous ; un Pass Étudiant (EFAE-…) : tous sauf les ateliers avec Élysée Johnson.
   Sinon le contenu est masqué et la page propose : les crédits (3 offerts avec l'email), ou efa. abonnement.
   Les ateliers gratuits ne chargent pas ce fichier. */
(function () {
  /* fichier : [id, prix FCFA, titre, avec Élysée Johnson] */
  var P = {
    'premiers-pas-bourse': ['premiers-pas-bourse', 30000, 'Mes premiers pas en Bourse'],
    'coach-bourse': ['premier-ordre-brvm', 50000, 'Mon premier ordre à la Bourse (BRVM)', 1],
    'atelier-lire-societe-cotee': ['lire-societe-cotee', 50000, 'Lire une société cotée comme un investisseur', 1],
    'atelier-tontine-spirale': ['tontine-spirale', 50000, 'Ma tontine devient une spirale', 1],
    'atelier-sortir-dettes': ['sortir-dettes', 20000, 'Sortir de mes dettes : lister, classer, renégocier'],
    'atelier-mobile-money-frais': ['mobile-money-frais', 20000, 'Mobile money et frais : ce que coûtent les petits transferts'],
    'atelier-preter-ou-donner': ['preter-ou-donner', 20000, 'Prêter à un proche, ou donner ?'],
    'atelier-grosse-somme': ['grosse-somme', 20000, 'Recevoir une grosse somme'],
    'atelier-placements-expliques': ['placements-expliques', 20000, 'DAT, OPCVM, FCPE : les placements expliqués'],
    'atelier-retraite-sans-pension': ['retraite-sans-pension', 20000, 'Préparer sa retraite sans pension'],
    'atelier-etudes-enfant': ['etudes-enfant', 15000, 'Financer les études de mon enfant'],
    'atelier-assurance-vie': ['assurance-vie', 15000, 'Assurance-vie : comprendre ce que je signe'],
    'atelier-construire-son-portefeuille': ['construire-son-portefeuille', 30000, 'Construire son portefeuille à la Bourse'],
    'atelier-portefeuille-factures': ['portefeuille-factures', 30000, 'Un portefeuille qui paie mes factures'],
    'atelier-investir-activite': ['investir-activite', 15000, 'Investir dans une activité : est-ce que ça rapporte ?'],
    'atelier-lire-business-plan': ['lire-business-plan', 15000, 'Lire un business plan comme un financeur'],
    'atelier-activite-gagne-t-elle': ['activite-gagne-t-elle', 15000, 'Mon activité gagne-t-elle vraiment de l’argent ?'],
    'atelier-ou-est-l-argent-de-mon-activite': ['ou-est-l-argent-de-mon-activite', 15000, 'Où est passé l’argent de mon activité ?'],
    'atelier-ma-banque-va-t-elle-me-preter': ['ma-banque-va-t-elle-me-preter', 15000, 'Ma banque va-t-elle me prêter ?'],
    'atelier-commerce-sans-comptabilite': ['commerce-sans-comptabilite', 15000, 'Mon commerce n’a pas de comptabilité'],
    'atelier-avant-de-confier-ou-d-investir': ['avant-de-confier-ou-d-investir', 15000, 'Avant de confier son argent ou d’investir'],
    'atelier-credit-fait-pour-moi': ['credit-fait-pour-moi', 15000, 'Le crédit est-il fait pour moi ?'],
    'atelier-choisir-sa-microfinance': ['choisir-sa-microfinance', 15000, 'Bien choisir sa microfinance'],
    'atelier-bien-utiliser-mon-credit': ['bien-utiliser-mon-credit', 30000, 'Bien utiliser mon crédit'],
    'atelier-rembourser-sans-se-noyer': ['rembourser-sans-se-noyer', 15000, 'Rembourser sans se noyer'],
    'atelier-eviter-le-surendettement': ['eviter-le-surendettement', 15000, 'Éviter le surendettement'],
    'atelier-quand-le-credit-va-mal': ['quand-le-credit-va-mal', 30000, 'Quand le crédit va mal'],
    'atelier-grandir-avec-le-credit': ['grandir-avec-le-credit', 30000, 'Grandir avec le crédit']
  };
  var nom = (location.pathname.split('/').pop() || '').replace(/\.html$/, ''), A = P[nom];
  window.EFA_VERROU = { pages: P };
  if (!A) return;
  var fichier = nom + '.html', ID = A[0], COUT = Math.ceil(A[1] / 10000), CLE = 'efa_ateliers_v1', OFFERTS = 3;
  var html = document.documentElement;
  function lireJ(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lireS(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function etat() { var o = lireJ(CLE) || {}; o.ok = o.ok || {}; return o; }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {} }
  function formule() { var o = lireJ('efa_formule'); return o && o.f && o.fin ? o : null; }
  function active(o) { return o && new Date() <= new Date(o.fin + 'T23:59:59'); }
  function parFormule() { var o = formule(); return active(o) && (o.f !== 'essentiel' || o.at === fichier); }
  function dejaOuvert() { var v = etat().ok[ID]; return !!v && v !== 'formule' && v !== 'équipe' && v !== 'école'; }

  function noterVisite() { try { localStorage.setItem('efa_dernier_atelier', fichier); } catch (e) {} }
  if (dejaOuvert() || parFormule()) { noterVisite(); verifierFormule(); return; }
  html.classList.add('efa-verrou');
  var st = document.createElement('style');
  st.textContent = 'html.efa-verrou body>*:not(#clone-haut):not(#efa-verrou):not(script):not(style){display:none!important}'
    + '#efa-verrou{font-family:"Source Sans 3","Source Sans Pro",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;background:#F5EFE2;color:#2A3142;padding:40px max(16px,env(safe-area-inset-left,0px)) 64px max(16px,env(safe-area-inset-right,0px));min-height:70vh}'
    + '#efa-verrou .v-in{max-width:620px;margin:0 auto;display:grid;gap:18px}'
    + '#efa-verrou .v-sur{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#B8341A;margin:0}'
    + '#efa-verrou h1{font-family:"Libre Baskerville",Baskerville,Georgia,serif;font-weight:700;font-size:clamp(28px,5.5vw,40px);line-height:1.12;color:#0B1220;margin:0;text-wrap:balance}'
    + '#efa-verrou p{margin:0;font-size:17px;line-height:1.55}#efa-verrou .v-c{background:#FFFDF8;border-radius:14px;padding:22px;display:grid;gap:12px}'
    + '#efa-verrou h2{font-family:"Libre Baskerville",Baskerville,Georgia,serif;font-weight:700;font-size:21px;line-height:1.2;color:#0B1220;margin:0}'
    + '#efa-verrou .v-b{display:inline-flex;align-items:center;justify-content:center;font:inherit;font-size:16px;font-weight:800;min-height:46px;padding:12px 22px;border-radius:8px;border:0;background:#DA3C1B;color:#fff;text-decoration:none;cursor:pointer}'
    + '#efa-verrou .v-b{background:#DA3C1B!important;color:#fff!important}#efa-verrou .v-b.s{background:#0B1220!important}#efa-verrou{background:#F5EFE2!important}#efa-verrou .v-b[disabled]{opacity:.55}'
    + '#efa-verrou input{font:inherit;font-size:17px;padding:11px 12px;border:1px solid #E2D8C4;border-radius:8px;background:#fff;color:#2A3142;width:100%;min-height:46px;box-sizing:border-box}'
    + '#efa-verrou form{display:grid;gap:10px}#efa-verrou .v-n{font-size:14px;color:#5F6676}#efa-verrou .v-ko{background:#B3261E;color:#fff;padding:10px 12px;border-radius:2px;font-weight:600}'
    + '#efa-verrou a.v-l{font-weight:700;color:#0B1220;text-decoration:underline;text-decoration-color:#DA3C1B;text-decoration-thickness:2px;text-underline-offset:5px}'
    + '#efa-verrou details summary{cursor:pointer;font-weight:700;color:#0B1220}#efa-verrou details form{margin-top:10px}';
  (document.head || html).appendChild(st);

  function charger(src) { return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); }); }
  function ouvrir() { noterVisite(); html.classList.remove('efa-verrou'); var g = document.getElementById('efa-verrou'); if (g) g.remove(); try { window.scrollTo(0, 0); } catch (e) {} }
  function pret(f) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', f); else f(); }

  pret(function () {
    charger('clone/ateliers-data.js?v=20261114b').then(decider, function () { montrer(null); });
  });

  function decider() {
    var D = window.EFA_ATELIERS;
    var eq = lireS('efa_equipe'), ec = lireS('efa_ecole');
    if (D && eq && D.equipeValide(eq)) return ouvrir();
    if (D && ec && !A[3] && D.ecoleValide(ec)) return ouvrir();
    montrer(D);
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pl(n) { return n + ' crédit' + (n > 1 ? 's' : ''); }
  function fcfa(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' F'; }
  function mail() { var e = etat(); return e.mail || lireS('efa_email_v1'); }
  function mpts() { var m = lireJ('efa_missions_v1'); return (m && m.pts) || 0; }
  function credits() { var e = etat(); return (mail() ? OFFERTS + (e.jeu || 0) + mpts() : 0) + (e.bonus || 0) - (e.dep10 || 0); }
  function noter(objet, detail, m) {
    try { fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: '426191fb-4812-4de4-b602-5857464c5916', subject: 'efa.africa · ' + objet, from_name: 'Site efa.africa', email: m, replyto: m, acces: objet, detail: detail || '', page: location.pathname }) }); } catch (e) {}
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'verrou-' + objet.replace(/[^a-z0-9]+/gi, '-').toLowerCase(), title: 'Verrou atelier', event: true }); } catch (e) {}
  }
  function date(s) { try { return new Date(s + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return s; } }

  function montrer(D) {
    var g = document.getElementById('efa-verrou');
    if (!g) { g = document.createElement('section'); g.id = 'efa-verrou'; g.setAttribute('aria-labelledby', 'v-t');
      var h = document.getElementById('clone-haut'); if (h && h.parentNode === document.body) h.after(g); else document.body.insertBefore(g, document.body.firstChild); }
    var m = mail(), c = credits(), fo = formule();
    /* Choix 1 : les crédits */
    var c1;
    if (!m) c1 = '<p>Activez vos ' + pl(OFFERTS) + ' offerts avec votre email' + (COUT <= OFFERTS ? ' : ils suffisent pour ouvrir cet atelier.' : '.') + '</p>'
      + '<form id="v-mail" novalidate><label class="v-n" for="v-m">Votre email</label><input id="v-m" type="email" autocomplete="email" inputmode="email" placeholder="vous@exemple.com">'
      + '<button class="v-b" type="submit">' + (COUT <= OFFERTS ? 'Ouvrir avec mes crédits offerts' : 'Activer mes ' + pl(OFFERTS) + ' offerts') + '</button></form>';
    else if (c >= COUT) c1 = '<p>Votre solde : <b>' + pl(c) + '</b>. Après ouverture, il vous restera ' + pl(c - COUT) + '.</p><button class="v-b" type="button" id="v-ouvrir">Ouvrir avec ' + pl(COUT) + '</button>';
    else c1 = '<p>Votre solde : <b>' + pl(Math.max(0, c)) + '</b>. Il vous manque ' + pl(COUT - Math.max(0, c)) + '.</p><p><a class="v-l" href="coaching.html#at-solde">Gagner des crédits : un avis, une mission</a></p>';
    /* Choix 2 : efa. abonnement */
    var c2;
    if (active(fo) && fo.f === 'essentiel' && !fo.at) c2 = '<p>Votre formule Essentiel est ouverte jusqu’au ' + date(fo.fin) + ' et vous n’avez pas encore choisi votre atelier.</p><button class="v-b s" type="button" id="v-choisir">En faire mon atelier Essentiel</button><p class="v-n">Ce choix vaut pour toute la période.</p>';
    else if (active(fo) && fo.f === 'essentiel') c2 = '<p>Votre formule Essentiel ouvre déjà un autre atelier. Pour tous les ouvrir, passez à Intégral.</p><a class="v-b s" href="abonnement.html">Voir les formules</a>';
    else if (fo && !active(fo)) c2 = '<p>Votre formule s’est terminée le ' + date(fo.fin) + '.</p><a class="v-b s" href="abonnement.html">Renouveler ma formule</a>';
    else c2 = '<p>Cet atelier et tous les autres, pour 30 jours. Essentiel dès 10 000 F : un atelier de votre choix.</p><a class="v-b s" href="abonnement.html">Voir les formules</a><p class="v-n">Déjà abonné ? <a class="v-l" href="abonnement.html#acces">Entrer mon code à 6 chiffres</a></p>';
    g.innerHTML = '<div class="v-in"><p class="v-sur">Atelier · ' + fcfa(A[1]) + ' · ' + pl(COUT) + '</p><h1 id="v-t">' + esc(A[2]) + '</h1>'
      + '<p>Cet atelier fait partie de l’école EFA. Deux façons de l’ouvrir :</p>'
      + '<div class="v-c"><h2>Avec mes crédits</h2>' + c1 + '</div>'
      + '<div class="v-c"><h2>Avec efa<span style="color:#DA3C1B">.</span> abonnement</h2>' + c2 + '</div>'
      + (D ? '<details><summary>J’ai un code d’accès</summary><form id="v-code" novalidate><label class="v-n" for="v-k">Code promo, accès équipe ou Pass Étudiant</label><input id="v-k" autocomplete="off" autocapitalize="characters" placeholder="EFA-XXXX-XXXX"><button class="v-b s" type="submit">Valider</button></form></details>' : '')
      + '<p class="v-ko" id="v-ko" role="alert" hidden></p></div>';
    var ko = document.getElementById('v-ko');
    function erreur(t) { ko.textContent = t; ko.hidden = false; }
    var fm = document.getElementById('v-mail');
    if (fm) fm.addEventListener('submit', function (e) {
      e.preventDefault(); var v = document.getElementById('v-m').value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v)) return erreur('Indiquez une adresse email valide.');
      var o = etat(); o.mail = v; ecrire(o); try { localStorage.setItem('efa_email_v1', v); } catch (x) {}
      var par = lireS('efa_parrain'); noter('Inscription phase de test · ' + OFFERTS + ' crédits' + (par ? ' · parrain ' + par : ''), ID, v);
      if (credits() >= COUT && D) payer(D); else montrer(D);
    });
    var bo = document.getElementById('v-ouvrir'); if (bo) bo.addEventListener('click', function () { if (D) payer(D); else erreur('Rechargez la page et réessayez.'); });
    var bc = document.getElementById('v-choisir');
    if (bc) bc.addEventListener('click', function () {
      bc.disabled = true;
      (window.EFA_FORMULE ? Promise.resolve() : charger('efa-formule.js?v=20261113f')).then(function () { return window.EFA_FORMULE.choisir(fichier); })
        .then(function (o) { if (o && o.at === fichier) ouvrir(); else { bc.disabled = false; erreur('Le choix n’a pas été enregistré. Réessayez.'); } },
          function (t) { bc.disabled = false; erreur(typeof t === 'string' ? t : 'Le choix n’a pas été enregistré. Vérifiez votre connexion et réessayez.'); });
    });
    var fc = document.getElementById('v-code');
    if (fc) fc.addEventListener('submit', function (e) {
      e.preventDefault(); var v = document.getElementById('v-k').value.trim().toUpperCase().replace(/\s+/g, '');
      if (/^\d{6}$/.test(v)) { location.href = 'abonnement.html#acces'; return; }
      if (D.equipeValide(v)) { try { localStorage.setItem('efa_equipe', v); } catch (x) {} return ouvrir(); }
      if (D.ecoleValide(v)) { if (A[3]) return erreur('Le Pass Étudiant ouvre les ateliers enregistrés et les cours, pas les ateliers avec Élysée Johnson.'); try { localStorage.setItem('efa_ecole', v); } catch (x) {} return ouvrir(); }
      if (D.cleValide(v)) { var o = etat(); o.ok[ID] = v; ecrire(o); noter('Code promo · ' + A[2], ID + ' · ' + v, mail()); return ouvrir(); }
      erreur('Ce code n’est pas reconnu. Vérifiez les lettres et les tirets.');
    });
  }

  function payer(D) {
    if (credits() < COUT) return montrer(D);
    var o = etat(), k = D.nouvelleCle(); o.dep10 = (o.dep10 || 0) + COUT; o.ok[ID] = k; ecrire(o);
    noter('Ouvert avec ' + pl(COUT) + ' · ' + A[2], ID + ' · ' + fcfa(A[1]) + ' · code ' + k, mail());
    ouvrir();
  }

  /* Accès par formule : on vérifie auprès du service qu'il est toujours ouvert. Fermé ou terminé : la page se referme. */
  function verifierFormule() {
    var o = formule(); if (!o || !o.j || dejaOuvert()) return;
    pret(function () {
      charger('efa-formule.js?v=20261113f').then(function () { return window.EFA_FORMULE.rafraichir(); }).then(function () { if (!parFormule() && !dejaOuvert()) location.reload(); }, function () {});
    });
  }
})();
