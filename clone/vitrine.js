/* EFA · Vitrine des SGI et comparateur (spécifications du 31/10/2026).
   Données : data/sgi.json et data/places.json. Comptage facturable : Worker « vitrine » (EFA_CONFIG.VITRINE_URL).
   Aucune donnée personnelle n'est collectée ni transmise aux SGI. */
(function () {
  var NOMS = { CI: 'Côte d’Ivoire', SN: 'Sénégal', BJ: 'Bénin', BF: 'Burkina Faso', ML: 'Mali', NE: 'Niger', TG: 'Togo', GW: 'Guinée-Bissau', Diaspora: 'Diaspora' };
  var NC = '<span class="vt-nc">Non communiqué</span>';
  var CFG = window.EFA_CONFIG || {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function v(x) { return x === null || x === undefined || x === '' ? NC : esc(x); }
  function ouiNon(x) { return x == null ? NC : ({ oui: 'Oui', non: 'Non', partielle: 'En partie' })[x] || esc(x); }
  function fcfa(n) { return n == null ? NC : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'; }
  function dateFr(d) { if (!d) return ''; var m = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'], p = d.split('-'); return (+p[2] === 1 ? '1er' : +p[2]) + ' ' + m[+p[1] - 1] + ' ' + p[0]; }
  function compte(ev) { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  /* Session de visite : identifiant aléatoire, sans lien avec une personne */
  function session() { var s = null; try { s = sessionStorage.getItem('efa_vt_s'); if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('efa_vt_s', s); } } catch (e) { s = s || 'x' + Math.random().toString(36).slice(2); } return s; }
  function evenement(type, sgi, pos, payee, canal) {
    if (!CFG.VITRINE_URL) return;
    try { var b = JSON.stringify({ type: type, sgi: sgi, position: pos || null, payee: !!payee, canal: canal || null, session: session() });
      if (navigator.sendBeacon) navigator.sendBeacon(CFG.VITRINE_URL.replace(/\/$/, '') + '/evenement', new Blob([b], { type: 'application/json' }));
      else fetch(CFG.VITRINE_URL.replace(/\/$/, '') + '/evenement', { method: 'POST', body: b, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    } catch (e) {}
  }
  /* Mélange Fisher-Yates avec une graine par visite */
  function graine() { var g = null; try { g = sessionStorage.getItem('efa_vt_g'); if (!g) { g = String(Math.floor(Math.random() * 2147483647)); sessionStorage.setItem('efa_vt_g', g); } } catch (e) {} return +(g || Math.floor(Math.random() * 2147483647)); }
  function melange(a, s) { a = a.slice(); var x = s || 1; function r() { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; } for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  /* Fiche complète (v1.2 § 4.1) : calculée, jamais saisie */
  function ficheComplete(s) {
    var f = s.frais || {}, a = s.acces || {}, sv = s.service || {}, nn = function (x) { return x !== null && x !== undefined && x !== ''; };
    if (!(nn(s.agrement) && s.pays_couverts && s.pays_couverts.length && nn(f.courtage) && nn(f.droits_garde) && nn(f.tenue_compte) && nn(f.source) && nn(a.minimum_ouverture_fcfa) && nn(a.ouverture_distance) && nn(a.delai_ouverture) && sv.canaux && sv.canaux.length && s.relue === true && s.relue_le)) return false;
    var d = new Date(s.relue_le + 'T00:00:00'); d.setFullYear(d.getFullYear() + 1); return d >= new Date();
  }
  function charger() { return Promise.all([fetch('data/sgi.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) { d.sgi.forEach(function (x) { x.fiche_complete = ficheComplete(x); }); return d; }), fetch('data/places.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).catch(function () { return null; })]); }

  /* ---------- « Contacter la SGI » : adresse e-mail, puis coordonnées (régime A, spécifications v1.1 § 3.5) ---------- */
  var dlg, PAYS_L = ['Côte d’Ivoire','Sénégal','Bénin','Burkina Faso','Mali','Niger','Togo','Guinée-Bissau','Diaspora','Autre'];
  function tel1(x) { return String(x).split(/[\/;,]/)[0].replace(/\(0*\+?(\d+)\)/, '+$1').replace(/^00/, '+').replace(/[^\d+]/g, ''); }
  function canaux(s, payee) {
    var c = s.contact || {}, rel = payee ? 'noopener sponsored' : 'noopener', L = [];
    if (s.site) L.push(['formulaire', 'Site', s.site]);
    if (c.formulaire) L.push(['formulaire', 'Formulaire en ligne', c.formulaire]);
    if (c.whatsapp) L.push(['whatsapp', 'WhatsApp', 'https://wa.me/' + tel1(c.whatsapp).replace('+', '')]);
    if (c.telephone) L.push(['tel', 'Appeler', 'tel:' + tel1(c.telephone)]);
    if (c.email) L.push(['email', 'E-mail', 'mailto:' + c.email]);
    return '<div class="vt-canaux">' + L.map(function (x) { return '<a href="' + esc(x[2]) + '" target="_blank" rel="' + rel + '" data-canal="' + x[0] + '">' + x[1] + '</a>'; }).join('') + '</div>'
      + (c.telephone ? '<p class="vt-agence">Téléphone : ' + esc(c.telephone) + '</p>' : '')
      + (c.agence ? '<p class="vt-agence">Agence : ' + esc(c.agence) + '</p>' : '');
  }
  function relation(s, pos, payee) {
    compte('sgi-relation-ouvrir');
    if (!dlg) { dlg = document.createElement('dialog'); dlg.className = 'vt-dlg vt'; document.body.appendChild(dlg); dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); }
    var nom = esc(s.nom);
    dlg.innerHTML = '<div class="vt-dlg-in"><button type="button" class="vt-fermer" aria-label="Fermer">×</button><h2>Contacter ' + nom + '</h2>'
      + '<p>Indiquez votre adresse e-mail&nbsp;: nous vous envoyons les coordonnées de ' + nom + ' et notre guide «&nbsp;7 questions à poser avant d’ouvrir un compte&nbsp;». EFA ne transmet pas votre adresse à la SGI&nbsp;: c’est vous qui la contactez.</p>'
      + '<form class="vt-form" novalidate><input type="email" name="email" required placeholder="E-mail" autocomplete="email" aria-label="E-mail">'
      + '<input type="text" name="prenom" placeholder="Prénom (facultatif)" autocomplete="given-name" aria-label="Prénom">'
      + '<select name="pays" aria-label="Pays"><option value="">Pays (facultatif)</option>' + PAYS_L.map(function (p) { return '<option>' + p + '</option>'; }).join('') + '</select>'
      + '<label class="c"><input type="checkbox" name="consentement" required> J’accepte qu’EFA utilise mon adresse pour m’envoyer ces informations et pour compter, de façon anonyme, les demandes faites à chaque SGI.</label>'
      + '<label class="c"><input type="checkbox" name="newsletter"> Je souhaite aussi recevoir la lettre d’EFA.</label>'
      + '<input type="text" name="site_web" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">'
      + (CFG.TURNSTILE_SITEKEY ? '<div class="cf-turnstile" data-sitekey="' + esc(CFG.TURNSTILE_SITEKEY) + '"></div>' : '')
      + '<button type="submit" class="vt-b">Recevoir les coordonnées</button><p class="vt-ok" role="status" aria-live="polite"></p></form></div>';
    var f = dlg.querySelector('form'), m = f.querySelector('.vt-ok');
    dlg.querySelector('.vt-fermer').onclick = function () { dlg.close(); };
    if (CFG.TURNSTILE_SITEKEY && !window.turnstile) { var ts = document.createElement('script'); ts.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'; ts.async = true; document.head.appendChild(ts); }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = f.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { m.style.color = '#b3261e'; m.textContent = 'Indiquez une adresse e-mail valide.'; f.email.focus(); return; }
      if (!f.consentement.checked) { m.style.color = '#b3261e'; m.textContent = 'Cochez la case d’accord pour recevoir les coordonnées.'; return; }
      if (f.site_web.value) return;
      var btn = f.querySelector('button[type=submit]'); btn.disabled = true; m.style.color = ''; m.textContent = 'Envoi…';
      var corps = { email: em, prenom: f.prenom.value.trim().slice(0, 60), pays: f.pays.value, sgi: s.id, position: pos || null, payee: !!payee, newsletter: f.newsletter.checked, consentement: true, session: session() };
      var tk = f.querySelector('[name="cf-turnstile-response"]'); if (tk) corps.turnstile = tk.value;
      var envoi = CFG.VITRINE_URL
        ? fetch(CFG.VITRINE_URL.replace(/\/$/, '') + '/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return { mail: true }; }); })
        : fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: '426191fb-4812-4de4-b602-5857464c5916', subject: 'efa.africa · Vitrine SGI · demande de coordonnées : ' + s.nom, from_name: 'Vitrine SGI', email: em, prenom: corps.prenom, pays: corps.pays, sgi: s.nom, newsletter: corps.newsletter ? 'oui' : 'non', consentement: 'oui' }) }).then(function () { return { mail: false }; });
      envoi.then(function (r) {
        try { localStorage.setItem('efa_vt_email', em); } catch (x) {}
        dlg.querySelector('.vt-dlg-in').innerHTML = '<button type="button" class="vt-fermer" aria-label="Fermer">×</button><h2>' + nom + '</h2>'
          + '<p>' + (r.mail ? 'C’est envoyé. Vous retrouverez ces informations dans votre boîte de réception.' : 'C’est noté. Voici les coordonnées de ' + nom + '.') + '</p>'
          + canaux(s, payee)
          + '<p><a class="vt-lien" href="sgi.html" data-autre>Contacter une autre SGI</a> · <a class="vt-lien" href="questions-a-poser-a-sa-sgi.html">Les questions à poser</a></p>';
        dlg.querySelector('.vt-fermer').onclick = function () { dlg.close(); };
        var au = dlg.querySelector('[data-autre]'); if (au) au.addEventListener('click', function (ev) { if (/sgi\.html/.test(location.pathname)) { ev.preventDefault(); dlg.close(); } });
        dlg.querySelectorAll('[data-canal]').forEach(function (a) { a.addEventListener('click', function () { evenement('clic_canal', s.id, pos, payee, a.dataset.canal); }); });
        if (!CFG.VITRINE_URL) evenement('demande_contact', s.id, pos, payee);
      }, function (er) { btn.disabled = false; m.style.color = '#b3261e'; m.textContent = (er && er.message) || 'L’envoi n’a pas abouti. Réessayez dans un instant.'; });
    });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    try { var mem = localStorage.getItem('efa_vt_email'); if (mem) f.email.value = mem; } catch (x) {}
    setTimeout(function () { f.email.focus(); }, 50);
  }
  window.EFA_VT = { ficheComplete: ficheComplete, relation: relation, charger: charger, esc: esc, v: v, ouiNon: ouiNon, fcfa: fcfa, dateFr: dateFr, NOMS: NOMS, compte: compte, evenement: evenement };

  /* ---------- Vitrine ---------- */
  var Z = document.getElementById('vt-liste'); if (!Z) return;
  compte('sgi-page');
  charger().then(function (r) {
    var D = r[0], PL = r[1], tous = D.sgi, par = {}; tous.forEach(function (s) { par[s.id] = s; });
    if (D.demo) document.getElementById('vt-demo').hidden = false;
    document.querySelectorAll('[data-maj]').forEach(function (x) { x.textContent = dateFr(D.maj); });
    var auj = new Date().toISOString().slice(0, 10), enPeriode = PL && PL.periode && PL.periode.debut && auj >= PL.periode.debut && auj <= PL.periode.fin;
    var etiquette = PL && PL.type === 'annonce' ? 'Annonce' : 'Partenaire fondateur';
    var ordreRest = melange(tous.map(function (s) { return s.id; }), graine());
    var choix = [], fP = document.getElementById('vt-pays'), fD = document.getElementById('vt-dist'), bC = document.getElementById('vt-cmp');
    function majCmp() { bC.textContent = 'Comparer (' + choix.length + ')'; bC.disabled = choix.length < 2; }
    bC.onclick = function () { if (choix.length >= 2) { compte('sgi-comparer-ouvrir'); location.href = 'sgi-comparer.html?ids=' + choix.join(','); } };
    function carte(s, pos, payee) {
      var nom = esc(s.nom), ini = (function () { var p = s.nom.match(/\(([^)]+)\)/); if (p) return p[1].replace(/\s.*$/, '').slice(0, 4).toUpperCase(); return s.nom.replace(/^SGI\s+/i, '').split(/[\s&'-]+/).filter(function (w) { return w && /^[A-ZÉ0-9]/.test(w) && !/^(SA|de|et|la|le)$/i.test(w); }).map(function (w) { return w[0]; }).join('').slice(0, 3).toUpperCase(); })();
      var f = s.frais || {}, a = s.acces || {}, sv = s.service || {}, c = s.contact || {};
      var h = '<article class="vt-carte" data-id="' + esc(s.id) + '">'
        + (payee || s.fiche_complete ? '<div class="vt-etqs">' + (payee ? '<span class="vt-etq" data-garde>' + etiquette + '</span>' : '') + (s.fiche_complete ? '<span class="vt-etq vt-etq-ok">Fiche complète</span>' : '') + '</div>' : '')
        + '<div class="vt-id">' + (s.logo && s.logo_autorise !== false ? '<img class="vt-logo" src="' + esc(s.logo) + '" alt="" loading="lazy" data-ini="' + esc(ini) + '">' : '<span class="vt-logo-v" data-garde aria-hidden="true">' + esc(ini) + '</span>') + '<h3>' + nom + '</h3></div>'
        + '<p class="vt-agr"><span>Agréée AMF-UMOA · n° ' + (s.agrement ? esc(s.agrement) : NC) + '</span><span class="vt-pays">' + (s.pays_couverts || []).map(function (p) { return '<i title="' + esc(NOMS[p] || p) + '">' + esc(p === 'Diaspora' ? 'Diaspora' : p) + '</i>'; }).join('') + '</span></p>'
        + '<div class="vt-reperes"><div><small>Minimum d’ouverture</small><b>' + fcfa(a.minimum_ouverture_fcfa) + '</b></div><div><small>Ouverture à distance</small><b>' + ouiNon(a.ouverture_distance) + '</b></div><div><small>Courtage</small><b>' + v(f.courtage) + '</b></div></div>'
        + '<div class="vt-fiche" id="fiche-' + esc(s.id) + '" hidden>' + (s.presentation ? '<section class="vt-pres"><h4>Présentation</h4><p>' + esc(s.presentation) + '</p></section>' : '')
        + '<section><h4>Frais</h4><dl><div><dt>Courtage</dt><dd>' + v(f.courtage) + '</dd></div><div><dt>Droits de garde</dt><dd>' + v(f.droits_garde) + '</dd></div><div><dt>Tenue de compte</dt><dd>' + v(f.tenue_compte) + '</dd></div><div><dt>Source</dt><dd>' + v(f.source) + '</dd></div></dl></section>'
        + '<section><h4>Accès</h4><dl><div><dt>Minimum</dt><dd>' + fcfa(a.minimum_ouverture_fcfa) + '</dd></div><div><dt>Ouverture à distance</dt><dd>' + ouiNon(a.ouverture_distance) + '</dd></div><div><dt>Délai</dt><dd>' + v(a.delai_ouverture) + '</dd></div></dl></section>'
        + '<section><h4>Service</h4><dl><div><dt>Application</dt><dd>' + ouiNon(sv.application) + '</dd></div><div><dt>Canaux</dt><dd>' + (sv.canaux && sv.canaux.length ? esc(sv.canaux.join(', ')) : NC) + '</dd></div><div><dt>Horaires</dt><dd>' + v(sv.horaires) + '</dd></div></dl></section>'
        + '<section><h4>Contact</h4><p class="vt-cache">Téléphone, e-mail, site et adresse de l’agence : touchez «&nbsp;Contacter la SGI&nbsp;».</p></section>'
        + '<p class="vt-relue">' + (s.relue && s.relue_le ? 'Fiche relue par la SGI le ' + dateFr(s.relue_le) + '.' : 'Fiche établie à partir d’informations publiques, non relue par la SGI.') + '</p></div>'
        + '<div class="vt-act"><button type="button" class="vt-voir" aria-expanded="false" aria-controls="fiche-' + esc(s.id) + '">Voir la fiche</button>'
        + '<label><input type="checkbox" class="vt-coche"' + (choix.indexOf(s.id) > -1 ? ' checked' : '') + '> Comparer <span class="sr" style="position:absolute;left:-9999px">' + nom + '</span></label>'
        + (s.fiche_complete ? '' : '<p class="vt-incomplet"' + (choix.indexOf(s.id) > -1 ? '' : ' hidden') + '>Fiche incomplète : certaines lignes de la comparaison seront «&nbsp;Non communiqué&nbsp;».</p>')
        + '<button type="button" class="vt-rel">Contacter la SGI</button></div></article>';
      return h;
    }
    var vus = {};
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { var el = e.target; if (e.isIntersecting) { el._t = setTimeout(function () { if (!vus[el.dataset.id]) { vus[el.dataset.id] = 1; evenement('vue_carte', el.dataset.id, +el.dataset.pos, el.dataset.payee === '1'); } }, 1000); } else clearTimeout(el._t); });
    }, { threshold: .5 }) : null;
    var ordreC = melange(tous.filter(function (x) { return x.fiche_complete; }).map(function (x) { return x.id; }), graine());
    var ordreP = melange(tous.filter(function (x) { return !x.fiche_complete; }).map(function (x) { return x.id; }), graine() + 7);
    function rendre() {
      var pays = fP.value, dist = fD.checked, mini = +(document.getElementById('vt-min') || {}).value || 0, app = (document.getElementById('vt-app') || {}).checked, fc = (document.getElementById('vt-complete') || {}).checked;
      function ok(s) { var a = s.acces || {}, m = a.minimum_ouverture_fcfa; return (!pays || (s.pays_couverts || []).indexOf(pays) > -1) && (!dist || a.ouverture_distance === 'oui') && (!mini || (m != null && m < mini)) && (!app || (s.service && s.service.application === 'oui')) && (!fc || s.fiche_complete); }
      var tete = [];
      if (enPeriode) (PL.places || []).slice().sort(function (a, b) { return a.rang - b.rang; }).slice(0, 3).forEach(function (p) { var s = p.sgi && par[p.sgi]; if (s && ok(s) && s.qualite_ok && s.fiche_complete && tete.indexOf(s.id) < 0) tete.push(s.id); });
      var compl = ordreC.filter(function (id) { return tete.indexOf(id) < 0 && ok(par[id]); });
      var part = ordreP.filter(function (id) { return ok(par[id]); });
      var s1 = tete.concat(compl), pos = 0, h = '';
      if (s1.length) h += '<section class="vt-sec" aria-labelledby="vt-s1"><h2 id="vt-s1">Les SGI qui se présentent en détail</h2><div class="vt-grille">' + s1.map(function (id, i) { pos++; return carte(par[id], pos, i < tete.length); }).join('') + '</div></section>';
      if (part.length) h += '<section class="vt-sec" aria-labelledby="vt-s2"><h2 id="vt-s2">Les autres SGI agréées</h2><div class="vt-grille">' + part.map(function (id) { pos++; return carte(par[id], pos, false); }).join('') + '</div></section>';
      Z.innerHTML = h || '<p class="vt-chapo">Aucune SGI ne correspond à ces filtres.</p>';
      Z.querySelectorAll('.vt-carte').forEach(function (el, i) {
        var s = par[el.dataset.id], payee = i < tete.length; el.dataset.pos = i + 1; el.dataset.payee = payee ? '1' : '0';
        if (io) io.observe(el);
        var lg = el.querySelector('img.vt-logo'); if (lg) { var rp = function () { var sp = document.createElement('span'); sp.className = 'vt-logo-v'; sp.setAttribute('aria-hidden', 'true'); sp.setAttribute('data-garde', ''); sp.textContent = lg.dataset.ini; lg.replaceWith(sp); }; if (lg.complete && !lg.naturalWidth) rp(); else lg.onerror = rp; }
        el.querySelector('.vt-voir').onclick = function () { var f = el.querySelector('.vt-fiche'), o = f.hidden; f.hidden = !o; this.setAttribute('aria-expanded', o ? 'true' : 'false'); this.textContent = o ? 'Masquer la fiche' : 'Voir la fiche'; if (o) { compte('sgi-fiche'); evenement('vue_fiche', s.id, i + 1, payee); } };
        el.querySelector('.vt-coche').onchange = function () { var k = choix.indexOf(s.id), et = document.getElementById('vt-etat'), inc = el.querySelector('.vt-incomplet'); if (this.checked) { if (choix.length >= 4) { this.checked = false; if (et) et.textContent = 'Vous pouvez comparer 4 SGI au plus.'; return; } if (k < 0) choix.push(s.id); evenement('ajout_comparer', s.id, i + 1, payee); } else if (k > -1) choix.splice(k, 1); if (inc) inc.hidden = !this.checked; if (et) et.textContent = ''; majCmp(); };
        el.querySelector('.vt-rel').onclick = function () { relation(s, i + 1, payee); };
      });
      majCmp();
    }
    fP.onchange = function () { compte('sgi-filtre-pays'); rendre(); }; fD.onchange = rendre;
    ['vt-min', 'vt-app', 'vt-complete'].forEach(function (k) { var x = document.getElementById(k); if (x) x.onchange = rendre; });
    var nb = document.getElementById('vt-nb'); if (nb) nb.textContent = tous.length;
    rendre();
    (function () { var m = /^#sgi-(.+)$/.exec(location.hash); if (!m) return; var el = Z.querySelector('.vt-carte[data-id="' + m[1].replace(/"/g, '') + '"]'); if (!el) return; var b = el.querySelector('.vt-voir'); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60); })();
    var lo = document.querySelector('a[href="#ordre"]'); if (lo) lo.addEventListener('click', function () { compte('sgi-ordre-lire'); });
  }).catch(function () { Z.innerHTML = '<p class="vt-chapo">La liste n’a pas pu être chargée. Réessayez dans un instant.</p>'; });
})();
