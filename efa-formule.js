/* efa. abonnement · accès par prénom, nom et code à 6 chiffres (13 nov. 2026)
   Le site ne connaît que des empreintes (data/acces-formules.json) : ni les noms, ni les codes.
   L'accès actif est gardé sur l'appareil : localStorage « efa_formule » = {f, fin, n, at}. */
(function () {
  var CLE = 'efa_formule', SEL = 'efa-abonnement-2026|';
  var NOMS = { essentiel: 'Essentiel', integral: 'Intégral', cercle: 'Proximité', privilege: 'Privilège' };
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
    ['Préparer sa retraite sans pension', 'atelier-retraite-sans-pension.html'], ['Ma tontine devient une spirale', 'atelier-tontine-spirale.html'],
    ['Sortir de mes dettes', 'atelier-sortir-dettes.html'], ['Mobile money et frais', 'atelier-mobile-money-frais.html'], ['Prêter à un proche, ou donner ?', 'atelier-preter-ou-donner.html']
  ];
  var GROUPES = [
    ['bourse', 'Bourse', 'clone/assets/ateliers/atelier-01.webp', 0, 5],
    ['entreprise', 'Mon activité', 'clone/assets/benefice-entreprise.webp', 5, 12],
    ['credit', 'Emprunter', 'clone/assets/coach-entreprise.webp', 12, 19],
    ['epargne', 'Épargner, protéger', 'clone/assets/accueil-apprendre-famille.webp', 19, 24],
    ['quotidien', 'Au quotidien', 'clone/assets/ateliers/atelier-04.webp', 24, 28]
  ];
  var AVEC = { 'coach-bourse.html': 1, 'atelier-lire-societe-cotee.html': 1, 'atelier-tontine-spirale.html': 1 };
  function groupe(l) { for (var i = 0; i < GROUPES.length; i++) for (var j = GROUPES[i][3]; j < GROUPES[i][4]; j++) if (ATELIERS[j][1] === l) return GROUPES[i]; return GROUPES[0]; }
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
  /* Service efa-abonnement (serveur/05-worker-efa-abonnement.js). Tant qu'il ne répond pas, le site vérifie avec ses empreintes locales. */
  var API = 'https://efa-abonnement.elysees-johnson.workers.dev';
  function appel(chemin, corps, jeton) {
    var ctl = window.AbortController ? new AbortController() : null, t = ctl && setTimeout(function () { ctl.abort(); }, 7000);
    return fetch(API + chemin, { method: 'POST', headers: jeton ? { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jeton } : { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps || {}), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(t); return r.json().then(function (j) { return { s: r.status, j: j || {} }; }, function () { return { s: r.status, j: {} }; }); }, function () { clearTimeout(t); return { s: 0, j: {} }; });
  }
  function activer(prenom, nom, code) {
    var c6 = String(code || '').replace(/\D/g, '');
    if (!prenom.trim() || !nom.trim() || c6.length !== 6) return activerLocal(prenom, nom, code);
    return appel('/entrer', { prenom: prenom, nom: nom, code: c6 }).then(function (r) {
      if (r.s === 200 && r.j.jeton) { var o = { f: r.j.f, fin: r.j.fin, n: r.j.n || prenom.trim(), j: r.j.jeton, at: r.j.at || null }; ecrire(o); return o; }
      if ((r.s === 403 || r.s === 429) && r.j.erreur) throw r.j.erreur;   /* accès connu du service : fermé, terminé ou trop d'essais */
      return activerLocal(prenom, nom, code);                             /* service absent ou nom inconnu de lui */
    });
  }
  function activerLocal(prenom, nom, code) {
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
  function choisir(url) {
    var o = actif(); if (!o || o.f !== 'essentiel' || o.at) return Promise.resolve(o);
    if (!o.j) { o.at = url; ecrire(o); return Promise.resolve(o); }
    return appel('/choisir', { at: url }, o.j).then(function (r) {
      if (r.s === 200 || r.s === 409) { o.at = r.j.at || url; ecrire(o); return o; }
      throw r.j.erreur || 'Le choix n’a pas été enregistré. Vérifiez votre connexion et réessayez.';
    });
  }
  /* À chaque visite : l'accès est-il toujours ouvert, prolongé, fermé ? */
  function rafraichir() {
    var o = lire(); if (!o || !o.j) return Promise.resolve(false);
    return appel('/moi', {}, o.j).then(function (r) {
      if (r.s === 200 && r.j.f) { var av = JSON.stringify(o); o.f = r.j.f; o.fin = r.j.fin; o.at = r.j.at || null; if (r.j.n) o.n = r.j.n; ecrire(o); return JSON.stringify(o) !== av; }
      if (r.s === 401) { ecrire(null); return true; }
      return false;
    });
  }
  function quitter() { var o = lire(); if (o && o.j) appel('/sortir', {}, o.j); ecrire(null); }
  window.EFA_FORMULE = { actif: actif, activer: activer, quitter: quitter, choisir: choisir, rafraichir: rafraichir, NOMS: NOMS, ATELIERS: ATELIERS, date: date };

  /* Espace membre de la page efa. abonnement */
  var z = document.getElementById('ab-acces'); if (!z) return;
  function bandeau() {
    var t = document.getElementById('ab-bandeau-t'), a = document.getElementById('ab-bandeau-a'); if (!t || !a) return;
    var o = actif();
    t.textContent = o ? 'Bienvenue, ' + o.n + ' · formule ' + NOMS[o.f] + ' jusqu’au ' + date(o.fin) : 'Déjà abonné ?';
    a.innerHTML = (o ? 'Mes ateliers' : 'Entrer mon code') + ' <span aria-hidden="true">→</span>'; a.setAttribute('href', o && document.getElementById('ab-espace') ? '#ab-espace' : '#acces');
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rendre() {
    var o = actif();
    if (!o) {
      z.innerHTML = '<form class="ab-form" id="ab-code-form" novalidate><label>Mon prénom<input name="prenom" autocomplete="given-name" required></label><label>Mon nom<input name="nom" autocomplete="family-name" required></label><label>Mon code à 6 chiffres<input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="000000" required style="font-size:22px;letter-spacing:.3em;font-weight:700"></label><p class="ab-form-ko" id="ab-code-ko" hidden></p><button class="ab-button" type="submit">Ouvrir mon accès <span aria-hidden="true">→</span></button><p class="ab-note">Votre code vous est remis par EFA après vérification de votre paiement.</p></form>';
      bandeau(); var f = document.getElementById('ab-code-form'), ko = document.getElementById('ab-code-ko');
      f.addEventListener('submit', function (e) { e.preventDefault(); ko.hidden = true; var b = f.querySelector('button'); b.disabled = true;
        activer(f.prenom.value, f.nom.value, f.code.value).then(function () { rendre(); var es = document.getElementById('ab-espace'); if (es) setTimeout(function () { es.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'abonnement-acces-ouvert', title: 'Accès ouvert', event: true }); } catch (x) {} },
          function (m) { b.disabled = false; ko.textContent = typeof m === 'string' ? m : 'La vérification n’a pas abouti. Réessayez.'; ko.hidden = false; }); });
      return;
    }
    espace(o);
  }

  function jours(o) { return Math.max(1, Math.ceil((new Date(o.fin + 'T23:59:59') - new Date()) / 864e5)); }
  function dernier() { try { return localStorage.getItem('efa_dernier_atelier') || ''; } catch (e) { return ''; } }
  function tuile(a) {
    return '<a class="es-t" href="' + a[1] + '"><span class="es-t-t">' + esc(a[0]) + '</span>'
      + (AVEC[a[1]] ? '<span class="es-t-m">Avec Élysée Johnson</span>' : '') + '<span class="es-t-f" aria-hidden="true">→</span></a>';
  }
  function espace(o) {
    var e = document.getElementById('ab-espace') || z, haut = e !== z, perso = o.f === 'cercle' || o.f === 'privilege';
    document.documentElement.classList.add('ab-membre');
    var L = o.f === 'essentiel' ? ATELIERS.filter(function (a) { return a[1] === o.at; }) : ATELIERS;
    var d = dernier(), reprise = L.filter(function (a) { return a[1] === d; })[0], premier = reprise || L[0];
    var h = '<div class="es-h"><div class="es-w"><p class="es-sur">Mon espace · efa<span>.</span> abonnement</p><h2>Bonjour, ' + esc(o.n) + '.</h2>'
      + '<p class="es-info"><span><b>Formule ' + NOMS[o.f] + '</b>, ouverte jusqu’au ' + date(o.fin) + '</span> <span class="es-j">' + jours(o) + ' jour' + (jours(o) > 1 ? 's' : '') + ' restant' + (jours(o) > 1 ? 's' : '') + '</span></p></div></div>';
    h += '<div class="es-w es-corps">';
    if (o.f === 'essentiel' && !o.at) {
      h += '<div class="es-c es-choix"><h3>Choisissez votre atelier</h3><p>Votre formule Essentiel ouvre un atelier, au choix, pour toute la période.</p>'
        + '<form id="ab-choix"><select name="at" aria-label="Mon atelier">' + GROUPES.map(function (g) { return '<optgroup label="' + g[1] + '">' + ATELIERS.slice(g[3], g[4]).map(function (a) { return '<option value="' + a[1] + '">' + esc(a[0]) + '</option>'; }).join('') + '</optgroup>'; }).join('')
        + '</select><button class="ab-button" type="submit">Confirmer ce choix <span aria-hidden="true">→</span></button></form><p class="es-n">Ce choix ne peut plus être changé pendant la période.</p></div>';
    } else {
      h += '<div class="es-actions">'
        + '<a class="es-c es-go" href="' + premier[1] + '"><img src="' + groupe(premier[1])[2] + '" alt="" loading="lazy"><span><small>' + (reprise ? 'Reprendre' : o.f === 'essentiel' ? 'Mon atelier' : 'Commencer par') + '</small><b>' + esc(premier[0]) + '</b><em>Ouvrir l’atelier →</em></span></a>'
        + (perso ? '<div class="es-c es-q"><small>Ma question du mois</small><b>Un cas, une décision ? Posez-la à Élysée.</b><p>Réponse écrite personnelle sous 72 h ouvrées' + (o.f === 'privilege' ? '. Indiquez aussi vos disponibilités pour votre rendez-vous de 30 minutes.' : '.') + '</p><button type="button" class="es-b" id="es-q-ouvrir">Poser ma question</button></div>'
          : o.f === 'integral' ? '<div class="es-c es-q"><small>Besoin d’un regard personnel ?</small><b>La formule Proximité ajoute une question par mois, avec réponse d’Élysée.</b><a class="es-b" href="#formules">Voir Proximité</a></div>' : '')
        + '</div>';
      if (perso) h += '<form class="es-c es-qf" id="es-qf" hidden><h3>Ma question à Élysée</h3><label for="es-qt">Décrivez votre situation et votre question. Chiffres fictifs acceptés.</label><textarea id="es-qt" rows="6" maxlength="3000" required></textarea>'
        + '<label for="es-qm">Où vous répondre (WhatsApp ou email)</label><input id="es-qm" autocomplete="email" required><button class="ab-button" type="submit">Envoyer ma question <span aria-hidden="true">→</span></button><p class="es-ko" id="es-qko" role="alert" hidden></p></form>';
      if (L.length > 1) {
        h += '<div class="es-cat"><h3>Mes ' + L.length + ' ateliers</h3><div class="es-chips" role="tablist">' + '<button type="button" class="es-chip" aria-pressed="true" data-g="">Tous</button>'
          + GROUPES.map(function (g) { return '<button type="button" class="es-chip" aria-pressed="false" data-g="' + g[0] + '">' + g[1] + ' <span>' + (g[4] - g[3]) + '</span></button>'; }).join('') + '</div>'
          + GROUPES.map(function (g) { return '<section class="es-g" data-g="' + g[0] + '"><div class="es-gh"><img src="' + g[2] + '" alt="" loading="lazy"><h4>' + g[1] + '</h4><span>' + (g[4] - g[3]) + ' ateliers</span></div><div class="es-grille">' + ATELIERS.slice(g[3], g[4]).map(tuile).join('') + '</div></section>'; }).join('')
          + '</div>';
      }
    }
    h += '<p class="es-n es-fin">Votre accès reste ouvert sur cet appareil jusqu’à la fin de la période. <button type="button" id="ab-quitter">Fermer mon accès sur cet appareil</button></p></div>';
    e.innerHTML = h; e.hidden = false;
    if (haut) z.innerHTML = '<div class="ab-form-ok" role="status"><b>Votre accès est ouvert.</b><br><a href="#ab-espace" style="color:#fff;text-decoration:underline">Retour à mon espace ↑</a></div>';
    bandeau();
    var c = document.getElementById('ab-choix');
    if (c) c.addEventListener('submit', function (ev) { ev.preventDefault(); var bt = c.querySelector('button'); bt.disabled = true; choisir(c.at.value).then(rendre, function (m) { bt.disabled = false; var k = c.querySelector('.es-ko') || c.appendChild(document.createElement('p')); k.className = 'es-ko'; k.setAttribute('role', 'alert'); k.textContent = typeof m === 'string' ? m : 'Réessayez.'; }); });
    [].forEach.call(e.querySelectorAll('.es-chip'), function (bt) { bt.addEventListener('click', function () {
      var g = bt.getAttribute('data-g');
      [].forEach.call(e.querySelectorAll('.es-chip'), function (x) { x.setAttribute('aria-pressed', x === bt ? 'true' : 'false'); });
      [].forEach.call(e.querySelectorAll('.es-g'), function (x) { x.hidden = !!g && x.getAttribute('data-g') !== g; });
    }); });
    var qo = document.getElementById('es-q-ouvrir'), qf = document.getElementById('es-qf');
    if (qo && qf) {
      qo.addEventListener('click', function () { qf.hidden = false; qf.scrollIntoView({ behavior: 'smooth', block: 'start' }); setTimeout(function () { document.getElementById('es-qt').focus(); }, 400); });
      qf.addEventListener('submit', function (ev) {
        ev.preventDefault(); var t = document.getElementById('es-qt').value.trim(), m = document.getElementById('es-qm').value.trim(), ko = document.getElementById('es-qko'), bt = qf.querySelector('button');
        if (t.length < 20) { ko.textContent = 'Décrivez votre question en quelques phrases.'; ko.hidden = false; return; }
        if (m.length < 6) { ko.textContent = 'Indiquez votre WhatsApp ou votre email pour la réponse.'; ko.hidden = false; return; }
        ko.hidden = true; bt.disabled = true;
        fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: '426191fb-4812-4de4-b602-5857464c5916',
          subject: 'efa. abonnement · question ' + NOMS[o.f] + ' · ' + o.n, from_name: 'efa.africa · abonnement', Formule: NOMS[o.f] + ' (jusqu’au ' + date(o.fin) + ')', Abonné: o.n, 'Répondre à': m, Question: t, Délai: 'Réponse écrite sous 72 h ouvrées' }) })
          .then(function (r) { return r.json(); }).then(function (dd) { if (!dd.success) throw 0; qf.outerHTML = '<div class="ab-form-ok" role="status"><b>Question envoyée.</b><br>Élysée vous répond par écrit sous 72 h ouvrées, à l’adresse indiquée.</div>'; },
            function () { bt.disabled = false; ko.textContent = 'L’envoi n’a pas abouti. Réessayez, ou écrivez à contact@efa.africa.'; ko.hidden = false; });
      });
    }
    var q = document.getElementById('ab-quitter'); if (q) q.addEventListener('click', function () { quitter(); document.documentElement.classList.remove('ab-membre'); e.hidden = haut; if (haut) e.innerHTML = ''; rendre(); });
  }
  rendre();
  rafraichir().then(function (change) { if (change) rendre(); });
})();
