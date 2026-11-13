/* efa. abonnement · accès par prénom, nom et code à 6 chiffres (13 nov. 2026)
   Le site ne connaît que des empreintes (data/acces-formules.json) : ni les noms, ni les codes.
   L'accès actif est gardé sur l'appareil : localStorage « efa_formule » = {f, fin, n, at}. */
(function () {
  var CLE = 'efa_formule', SEL = 'efa-abonnement-2026|';
  var NOMS = { essentiel: 'Essentiel', integral: 'Intégral', cercle: 'Cercle', privilege: 'Privilège' };
  var ATELIERS = [
    ['Mes premiers pas en Bourse', 'premiers-pas-bourse.html'], ['Mon premier ordre à la Bourse (BRVM)', 'coach-bourse.html'],
    ['Lire une société cotée comme un investisseur', 'atelier-lire-societe-cotee.html'], ['Construire son portefeuille à la Bourse', 'atelier-construire-son-portefeuille.html'],
    ['Un portefeuille qui paie mes factures', 'atelier-portefeuille-factures.html'],
    ['Mon activité gagne-t-elle vraiment de l’argent ?', 'atelier-activite-gagne-t-elle.html'], ['Où est passé l’argent de mon activité ?', 'atelier-ou-est-l-argent-de-mon-activite.html'],
    ['Ma banque va-t-elle me prêter ?', 'atelier-ma-banque-va-t-elle-me-preter.html'], ['Mon commerce n’a pas de comptabilité', 'atelier-commerce-sans-comptabilite.html'],
    ['Avant de confier son argent ou d’investir', 'atelier-avant-de-confier-ou-d-investir.html'], ['Investir dans une activité : est-ce que ça rapporte ?', 'atelier-investir-activite.html'],
    ['Lire un business plan comme un financeur', 'atelier-lire-business-plan.html'],
    ['Le crédit est-il fait pour moi ?', 'atelier-credit-fait-pour-moi.html'], ['Bien choisir sa microfinance', 'atelier-choisir-sa-microfinance.html'],
    ['Bien utiliser mon crédit', 'atelier-bien-utiliser-mon-credit.html'], ['Rembourser sans se noyer', 'atelier-rembourser-sans-se-noyer.html'],
    ['Éviter le surendettement', 'atelier-eviter-le-surendettement.html'], ['Quand le crédit va mal', 'atelier-quand-le-credit-va-mal.html'],
    ['Grandir avec le crédit', 'atelier-grandir-avec-le-credit.html'],
    ['Financer les études de mon enfant', 'atelier-etudes-enfant.html'], ['DAT, OPCVM, FCPE : les placements expliqués', 'atelier-placements-expliques.html'],
    ['Assurance-vie : comprendre ce que je signe', 'atelier-assurance-vie.html'], ['Recevoir une grosse somme', 'atelier-grosse-somme.html'],
    ['Préparer sa retraite sans pension', 'atelier-retraite-sans-pension.html'], ['Ma tontine devient une spirale', 'atelier-tontine-spirale.html']
  ];
  function lire() { try { var o = JSON.parse(localStorage.getItem(CLE) || 'null'); return o && o.f && o.fin ? o : null; } catch (e) { return null; } }
  function ecrire(o) { try { if (o) localStorage.setItem(CLE, JSON.stringify(o)); else localStorage.removeItem(CLE); } catch (e) {} }
  function actif() { var o = lire(); return o && new Date() <= new Date(o.fin + 'T23:59:59') ? o : null; }
  function norme(p, n) { return (p + ' ' + n).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function hex(b) { return [].map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function empreinte(p, n, code, iter) {
    var e = new TextEncoder();
    return crypto.subtle.importKey('raw', e.encode(code), 'PBKDF2', false, ['deriveBits']).then(function (k) {
      return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: e.encode(SEL + norme(p, n)), iterations: iter }, k, 128);
    }).then(hex);
  }
  function activer(prenom, nom, code) {
    code = String(code || '').replace(/\D/g, '');
    if (!prenom.trim() || !nom.trim()) return Promise.reject('Indiquez votre prénom et votre nom, comme vous nous les avez donnés.');
    if (code.length !== 6) return Promise.reject('Votre code compte 6 chiffres.');
    if (!(window.crypto && crypto.subtle)) return Promise.reject('Ce navigateur ne permet pas de vérifier le code. Essayez avec Chrome ou Safari à jour.');
    return fetch('data/acces-formules.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
      return empreinte(prenom, nom, code, d.iter || 120000).then(function (h) {
        var a = (d.acces || []).filter(function (x) { return x.h === h; })[0];
        if (!a) throw 'Ce code ne correspond pas à ce prénom et à ce nom. Vérifiez l’orthographe et les 6 chiffres.';
        var auj = new Date();
        if (auj > new Date(a.fin + 'T23:59:59')) throw 'Cet accès est terminé depuis le ' + date(a.fin) + '. Vous pouvez le renouveler quand vous voulez.';
        if (a.deb && auj < new Date(a.deb + 'T00:00:00')) throw 'Cet accès commence le ' + date(a.deb) + '.';
        var prec = lire(), o = { f: a.f, fin: a.fin, n: prenom.trim(), h: h, at: prec && prec.h === h ? prec.at : null };
        ecrire(o); return o;
      });
    }, function () { throw 'La vérification n’a pas abouti. Vérifiez votre connexion et réessayez.'; });
  }
  function date(s) { try { return new Date(s + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return s; } }
  function choisir(url) { var o = actif(); if (o && o.f === 'essentiel' && !o.at) { o.at = url; ecrire(o); } return o; }
  window.EFA_FORMULE = { actif: actif, activer: activer, quitter: function () { ecrire(null); }, choisir: choisir, NOMS: NOMS, ATELIERS: ATELIERS, date: date };

  /* Espace membre de la page efa. abonnement */
  var z = document.getElementById('ab-acces'); if (!z) return;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rendre() {
    var o = actif();
    if (!o) {
      z.innerHTML = '<form class="ab-form" id="ab-code-form" novalidate><label>Mon prénom<input name="prenom" autocomplete="given-name" required></label><label>Mon nom<input name="nom" autocomplete="family-name" required></label><label>Mon code à 6 chiffres<input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="000000" required style="font-size:22px;letter-spacing:.3em;font-weight:700"></label><p class="ab-form-ko" id="ab-code-ko" hidden></p><button class="ab-button" type="submit">Ouvrir mon accès <span aria-hidden="true">→</span></button><p class="ab-note">Votre code vous est remis par EFA après vérification de votre paiement.</p></form>';
      var f = document.getElementById('ab-code-form'), ko = document.getElementById('ab-code-ko');
      f.addEventListener('submit', function (e) { e.preventDefault(); ko.hidden = true; var b = f.querySelector('button'); b.disabled = true;
        activer(f.prenom.value, f.nom.value, f.code.value).then(function () { rendre(); try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'abonnement-acces-ouvert', title: 'Accès ouvert', event: true }); } catch (x) {} },
          function (m) { b.disabled = false; ko.textContent = typeof m === 'string' ? m : 'La vérification n’a pas abouti. Réessayez.'; ko.hidden = false; }); });
      return;
    }
    var h = '<div class="ab-form-ok" role="status"><b>Bienvenue, ' + esc(o.n) + '.</b><br>Formule ' + NOMS[o.f] + ', ouverte jusqu’au ' + date(o.fin) + '.</div>';
    if (o.f === 'essentiel' && !o.at) {
      h += '<form class="ab-form" id="ab-choix"><label>Je choisis mon atelier<select name="at">' + ATELIERS.map(function (a) { return '<option value="' + a[1] + '">' + esc(a[0]) + '</option>'; }).join('') + '</select></label><button class="ab-button" type="submit">Confirmer ce choix <span aria-hidden="true">→</span></button><p class="ab-note">Ce choix vaut pour toute la période : prenez le temps de lire les titres.</p></form>';
    } else {
      var L = o.f === 'essentiel' ? ATELIERS.filter(function (a) { return a[1] === o.at; }) : ATELIERS;
      h += '<div class="ab-form"><p style="margin:0;font-weight:800;color:var(--navy)">' + (o.f === 'essentiel' ? 'Mon atelier' : 'Mes ' + L.length + ' ateliers et cours') + '</p><ul class="ab-liste">' + L.map(function (a) { return '<li><a href="' + a[1] + '">' + esc(a[0]) + ' <span aria-hidden="true">→</span></a></li>'; }).join('') + '</ul>'
        + (o.f === 'cercle' || o.f === 'privilege' ? '<p class="ab-note" style="font-size:15px">Votre question du mois' + (o.f === 'privilege' ? ' et votre rendez-vous de 30 minutes' : '') + ' : écrivez à <a href="mailto:contact@efa.africa" style="text-decoration:underline">contact@efa.africa</a> avec votre prénom, votre nom et votre formule.</p>' : '')
        + '<p class="ab-note"><button type="button" id="ab-quitter" style="all:unset;cursor:pointer;text-decoration:underline">Fermer mon accès sur cet appareil</button></p></div>';
    }
    z.innerHTML = h;
    var c = document.getElementById('ab-choix'); if (c) c.addEventListener('submit', function (e) { e.preventDefault(); choisir(c.at.value); rendre(); });
    var q = document.getElementById('ab-quitter'); if (q) q.addEventListener('click', function () { ecrire(null); rendre(); });
  }
  rendre();
})();
