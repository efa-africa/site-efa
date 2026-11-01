/* EFA · Tout objet qui mène quelque part est cliquable en entier (31/10/2026).
   Une carte (image + titre + texte) qui ne contient qu'un seul lien : un clic n'importe où sur la carte suit ce lien.
   Les cartes avec plusieurs liens, un bouton, une case ou un formulaire ne sont pas touchées. */
(function () {
  if (window.__efaCartes) return; window.__efaCartes = 1;
  var CARTES = 'article,.a-door,[class*="card"],[class*="carte"],.res,.produit,.pv-carte,.ac-acteur,.ac-fiche,.ac-atelier,.aef-atelier,.vt-bloc,.fondateur,.lieu2,.porte-corps .res,.mef-news,.etape,.tuile,[class*="tile"]';
  var INTER = 'a[href],button,input,select,textarea,label,summary,details,form,[role=button],[contenteditable],video,audio,iframe,dialog';
  function lien(c) {
    if (!c || c.closest('a[href]') || c.querySelector('button,input,select,textarea,form,summary,dialog')) return null;
    var L = [].slice.call(c.querySelectorAll('a[href]')).filter(function (a) { return a.offsetParent !== null || a.getClientRects().length; });
    var h = {}; L.forEach(function (a) { h[a.href] = a; });
    var k = Object.keys(h); return k.length === 1 ? h[k[0]] : null;
  }
  function carte(el) { var c = el.closest && el.closest(CARTES); while (c) { if (lien(c)) return c; var p = c.parentElement && c.parentElement.closest(CARTES); c = p; } return null; }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.target.closest(INTER)) return;
    var s = window.getSelection && String(window.getSelection()); if (s && s.length > 2) return;
    var c = carte(e.target); if (!c) return;
    var a = lien(c); if (!a) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey) { window.open(a.href, '_blank', 'noopener'); return; }
    a.click();
  });
  /* Quand un bloc s'ouvre (détails, liste dépliée), on fait défiler pour que la suite soit visible */
  document.addEventListener('toggle', function (e) {
    var d = e.target; if (!d || d.tagName !== 'DETAILS' || !d.open) return;
    setTimeout(function () {
      var sm = d.querySelector('summary'), r = d.getBoundingClientRect(), hd = document.querySelector('header'), hh = hd && getComputedStyle(hd).position !== 'static' ? hd.offsetHeight : 0;
      var bas = sm ? sm.getBoundingClientRect().bottom : r.top;
      if (bas > innerHeight * 0.62 || r.top < hh) scrollTo({ top: scrollY + (bas > innerHeight * 0.62 && sm ? sm.getBoundingClientRect().bottom - innerHeight * 0.35 : r.top - hh - 16), behavior: 'smooth' });
    }, 60);
  }, true);
  function marquer() { document.querySelectorAll(CARTES).forEach(function (c) { if (!c.classList.contains('efa-clic') && lien(c)) c.classList.add('efa-clic'); }); }
  var st = document.createElement('style'); st.textContent = '.efa-clic{cursor:pointer}.efa-clic:hover a[href]{text-decoration-thickness:2px}'; document.head.appendChild(st);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', marquer); else marquer();
  setTimeout(marquer, 1500);
  if ('MutationObserver' in window) { var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(marquer, 200); }).observe(document.documentElement, { childList: true, subtree: true }); }
})();

/* EFA · Bandeau « Promotion d'ouverture » sur toutes les pages (sous l'en-tête). */
(function () {
  if (window.__efaPromo) return; window.__efaPromo = 1;
  function poser() {
    if (document.querySelector('.efa-promo')) return;
    try { if (sessionStorage.getItem('efa_promo_ferme')) return; } catch (e) {}
    var h = document.getElementById('clone-haut') || document.getElementById('haut') || document.querySelector('body > header');
    if (!h) return;
    var st = document.createElement('style');
    st.textContent = '.efa-promo{position:relative;z-index:4;background:#F5EFE2;font-family:"Source Sans 3","Source Sans Pro",system-ui,sans-serif;color:#0B1220}'
      + '.efa-promo::before{content:"";display:block;height:4px;background:linear-gradient(90deg,#E44828 0 33.3%,#F2B84B 33.3% 66.6%,#3CCB7F 66.6%)}'
      + '.efa-promo-in{max-width:1180px;margin:0 auto;padding:9px max(16px,env(safe-area-inset-left,0px));display:flex;align-items:center;gap:10px;flex-wrap:wrap}'
      + '.efa-promo .p-r,.efa-promo .p-j{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:4px 10px}'
      + '.efa-promo .p-r{background:#E44828;color:#fff}.efa-promo .p-j{background:#F2B84B;color:#0B1220}'
      + '.efa-promo .p-t{font-size:15px;font-weight:600;flex:1 1 220px}'
      + '.efa-promo .p-v{display:inline-block;background:#1E8E57;color:#fff;font-size:14px;font-weight:800;border-radius:8px;padding:8px 14px;text-decoration:none;white-space:nowrap}'
      + '.efa-promo .p-v:hover{background:#17764A}'
      + '.efa-promo .p-x{all:unset;cursor:pointer;font-size:20px;line-height:1;color:#4E5566;padding:4px 6px}'
      + '.efa-promo .p-court{display:none}'
      + '@media(max-width:620px){.efa-promo .p-long{display:none}.efa-promo .p-court{display:inline}.efa-promo .p-r{order:1}.efa-promo .p-j{order:2}.efa-promo .p-x{order:3;margin-left:auto}.efa-promo .p-t{font-size:14px;flex:1 1 55%;order:4}.efa-promo .p-v{order:5;padding:7px 11px;font-size:13px}.efa-promo-in{gap:6px 8px;padding-top:7px;padding-bottom:9px}.efa-promo .p-r,.efa-promo .p-j{font-size:10px;padding:3px 8px}}';
    document.head.appendChild(st);
    var surCoaching = /\/coaching(\.html)?$/.test(location.pathname);
    var b = document.createElement('div'); b.className = 'efa-promo'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Promotion d’ouverture');
    b.innerHTML = '<div class="efa-promo-in"><span class="p-r">Promotion</span><span class="p-j">Ouverture</span>'
      + '<span class="p-t"><span class="p-long">Promotion d’ouverture : grattez votre carte chaque jour, et recevez 3 crédits offerts avec votre email.</span><span class="p-court">Une carte à gratter par jour</span></span>'
      + '<a class="p-v" href="' + (surCoaching ? '#gratter' : 'coaching.html#gratter') + '" data-goatcounter-click="promo-bandeau">Gratter ma carte →</a>'
      + '<button class="p-x" type="button" aria-label="Fermer le bandeau">×</button></div>';
    var fil = document.getElementById('fil'), main = document.querySelector('main');
    if (fil && fil.nextElementSibling) { var apres = fil.nextElementSibling; apres.parentNode.insertBefore(b, apres.nextSibling); }
    else if (getComputedStyle(h).position === 'fixed' && main) main.insertBefore(b, main.firstChild);
    else h.parentNode.insertBefore(b, h.nextSibling);
    b.querySelector('.p-x').addEventListener('click', function () { b.remove(); try { sessionStorage.setItem('efa_promo_ferme', '1'); } catch (e) {} });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poser); else poser();
})();

/* EFA · Portefeuille de crédits dans l'en-tête (solde de la phase de test). */
(function () {
  if (window.__efaPorte) return; window.__efaPorte = 1;
  function solde() {
    var e = {}, m = '';
    try { e = JSON.parse(localStorage.getItem('efa_ateliers_v1') || '{}') || {}; m = localStorage.getItem('efa_email_v1') || ''; } catch (x) {}
    if (!(e.mail || m)) return null;
    return Math.max(0, 3 + (e.jeu || 0) + (e.bonus || 0) - (e.dep10 || 0));
  }
  function poser() {
    var h = document.getElementById('clone-haut') || document.getElementById('haut'); if (!h) return;
    var tg = h.querySelector('.menu-toggle'), inn = h.querySelector('.head-inner'); if (!inn) return;
    var st = document.createElement('style');
    st.textContent = '.efa-porte{display:inline-flex;align-items:center;gap:7px;margin-left:auto;margin-right:12px;padding:6px 12px 6px 6px;border-radius:999px;background:#fff;box-shadow:0 0 0 1.5px #E2D8C4,0 4px 12px rgba(11,18,32,.08);font:800 14px/1 "Source Sans 3","Source Sans Pro",system-ui,sans-serif;color:#0B1220;text-decoration:none;white-space:nowrap;flex:0 0 auto}'
      + '.efa-porte i{width:24px;height:24px;border-radius:50%;background:conic-gradient(#E44828 0 33%,#F2B84B 0 66%,#3CCB7F 0);display:grid;place-items:center;font-style:normal}'
      + '.efa-porte i::after{content:"";width:12px;height:12px;border-radius:50%;background:#fff}'
      + '.efa-porte b{color:#1E8E57;font-size:16px}.efa-porte span{color:#4E5566;font-weight:700}'
      + '.efa-porte:hover{box-shadow:0 0 0 1.5px #1E8E57,0 4px 12px rgba(11,18,32,.1)}'
      + '.efa-porte:focus-visible{outline:3px solid #2188D6;outline-offset:2px}'
      + '@media(max-width:420px){.efa-porte{padding:5px 10px 5px 5px;margin-right:8px;font-size:13px}}@media(max-width:350px){.efa-porte span{display:none}}';
    document.head.appendChild(st);
    var a = document.createElement('a'); a.className = 'efa-porte';
    a.href = /\/coaching(\.html)?$/.test(location.pathname) ? '#choisir' : 'coaching.html#choisir';
    a.setAttribute('data-goatcounter-click', 'porte-credits');
    if (tg) inn.insertBefore(a, tg); else inn.appendChild(a);
    function maj() {
      var s = solde();
      a.innerHTML = '<i aria-hidden="true"></i>' + (s === null ? '<b>3</b><span>crédits offerts</span>' : '<b>' + s + '</b><span>crédit' + (s > 1 ? 's' : '') + '</span>');
      a.setAttribute('aria-label', s === null ? 'Portefeuille : 3 crédits offerts avec votre email' : 'Mon solde : ' + s + ' crédit' + (s > 1 ? 's' : ''));
    }
    maj(); window.addEventListener('storage', maj); window.addEventListener('efa-credits', maj);
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', function (e) { e.preventDefault(); ouvrirPorte(); });
  }
  /* Fenêtre « Mon portefeuille » : solde, promotion en cours, achat de crédits (bientôt). Aucun champ de paiement n'est actif. */
  var dlg = null, pack = 3, moyen = 'om';
  var MOYENS = [['om', 'Orange Money', '#FF7900'], ['wave', 'Wave', '#1DC8F2'], ['mtn', 'MTN MoMo', '#FFCB05'], ['carte', 'Carte bancaire', '#1A1F71']];
  function fc(n) { return n.toLocaleString('fr-FR').replace(/ /g, ' ') + ' FCFA'; }
  function ouvrirPorte() {
    if (!dlg) {
      var st = document.createElement('style');
      st.textContent = '.pf{border:0;padding:0;border-radius:18px;width:min(460px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;font-family:"Source Sans 3","Source Sans Pro",system-ui,sans-serif;color:#2A3142;background:#FFFDF8}'
        + '.pf::backdrop{background:rgba(11,18,32,.55)}'
        + '.pf-t{background:#0B1220;color:#fff;padding:18px 20px;position:relative}.pf-t small{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#C9D1DE}'
        + '.pf-t b{display:block;font:700 34px/1.1 "Libre Baskerville",Georgia,serif;margin-top:6px}.pf-t b span{font:700 16px "Source Sans 3",system-ui,sans-serif;color:#3CCB7F;margin-left:6px}'
        + '.pf-x{position:absolute;right:12px;top:10px;border:0;background:none;color:#fff;font-size:26px;cursor:pointer;line-height:1;padding:4px 8px}'
        + '.pf-c{padding:16px 20px 20px}'
        + '.pf-promo{border-radius:12px;background:#FFF3D6;padding:12px 14px;font-size:15px}.pf-promo b{color:#5A3D00}'
        + '.pf-promo p{margin:4px 0 0}.pf-promo a{color:#1B71B2;font-weight:800}'
        + '.pf-h{display:flex;align-items:center;gap:8px;margin:18px 0 8px;font:700 20px/1.2 "Libre Baskerville",Georgia,serif;color:#0B1220}'
        + '.pf-bt{font:800 11px/1 "Source Sans 3",system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;background:#F2B84B;color:#0B1220;border-radius:999px;padding:4px 9px}'
        + '.pf-packs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}'
        + '.pf-packs button,.pf-moy button{border:0;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1.5px #E2D8C4;cursor:pointer;font:inherit;color:#0B1220}'
        + '.pf-packs button{padding:10px 4px;text-align:center}.pf-packs b{display:block;font-size:20px}.pf-packs span{font-size:10.5px;font-weight:700;color:#4E5566;white-space:nowrap}'
        + '.pf-packs button[aria-pressed="true"],.pf-moy button[aria-pressed="true"]{box-shadow:inset 0 0 0 2.5px #1E8E57;background:#F2FBF6}'
        + '.pf-moy{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:12px}'
        + '.pf-moy button{display:flex;align-items:center;gap:8px;min-height:46px;padding:0 10px;font-weight:800;font-size:15px;text-align:left}'
        + '.pf-moy i{flex:0 0 16px;height:16px;border-radius:50%}'
        + '.pf-f{margin-top:12px;border-radius:12px;background:#F7F4EC;padding:12px}'
        + '.pf-f label{display:block;font-size:13px;font-weight:700;color:#4E5566;margin:8px 0 4px}.pf-f label:first-child{margin-top:0}'
        + '.pf-f input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:11px 12px;border:1px solid #D9D2C2;border-radius:9px;background:#EFEBE1;color:#7A8293}'
        + '.pf-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
        + '.pf-logos{display:flex;gap:6px;margin-bottom:6px}.pf-logos span{font:800 12px/1 "Source Sans 3",system-ui,sans-serif;padding:5px 8px;border-radius:5px;color:#fff}'
        + '.pf-payer{display:block;width:100%;margin-top:12px;min-height:48px;border:0;border-radius:9px;background:#C9CED8;color:#4E5566;font:800 16px "Source Sans 3",system-ui,sans-serif;cursor:not-allowed}'
        + '.pf-note{font-size:13px;color:#7A8293;margin:8px 0 0}'
        + '.pf-prev{display:block;width:100%;margin-top:10px;min-height:46px;border:0;border-radius:9px;background:#1E8E57;color:#fff;font:800 15px "Source Sans 3",system-ui,sans-serif;cursor:pointer}'
        + '.pf-ok{margin:10px 0 0;font-weight:700;color:#14532D}';
      document.head.appendChild(st);
      dlg = document.createElement('dialog'); dlg.className = 'pf'; dlg.setAttribute('data-garde', ''); dlg.setAttribute('aria-label', 'Mon portefeuille de crédits');
      document.body.appendChild(dlg);
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg || e.target.closest('.pf-x')) { dlg.close(); return; }
        var p = e.target.closest('[data-pack]'); if (p) { pack = +p.dataset.pack; rendre(); return; }
        var m = e.target.closest('[data-moy]'); if (m) { moyen = m.dataset.moy; rendre(); return; }
        if (e.target.closest('.pf-prev') && !e.target.closest('.pf-r')) prevenir();
      });
    }
    rendre(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function rendre() {
    var s = solde(), sur = /\/coaching(\.html)?$/.test(location.pathname) ? '' : 'coaching.html', M = MOYENS.filter(function (x) { return x[0] === moyen; })[0];
    var champs = moyen === 'carte'
      ? '<div class="pf-logos"><span style="background:#1A1F71">VISA</span><span style="background:#EB001B">Mastercard</span></div><label>Numéro de carte</label><input disabled placeholder="1234 5678 9012 3456" autocomplete="off"><div class="pf-2"><div><label>Expiration</label><input disabled placeholder="MM / AA" autocomplete="off"></div><div><label>Code de sécurité</label><input disabled placeholder="CVC" autocomplete="off"></div></div><label>Nom sur la carte</label><input disabled placeholder="Prénom Nom" autocomplete="off">'
      : '<label>Numéro ' + M[1] + '</label><input disabled placeholder="07 00 00 00 00" autocomplete="off"><p class="pf-note">Vous confirmerez le paiement sur votre téléphone, avec votre code ' + M[1] + '.</p>';
    dlg.innerHTML = '<div class="pf-t"><button type="button" class="pf-x" aria-label="Fermer">×</button><small>Mon portefeuille</small><b>' + (s === null ? '0' : s) + '<span>crédit' + (s > 1 ? 's' : '') + '</span></b></div>'
      + '<div class="pf-c"><div class="pf-promo"><b>Promotion d’ouverture : vos crédits sont offerts.</b><p>' + (s === null ? '3 crédits avec votre email, ' : '') + 'une carte à gratter par jour, +1 crédit par avis. <a href="' + sur + '#gratter">Gratter ma carte</a> · <a href="' + sur + '#choisir">Utiliser mes crédits</a></p></div>'
      + '<p class="pf-h">Acheter des crédits <span class="pf-bt">Bientôt</span></p>'
      + '<div class="pf-packs">' + [1, 3, 5, 10].map(function (n) { return '<button type="button" data-pack="' + n + '" aria-pressed="' + (n === pack) + '"><b>' + n + '</b><span>' + fc(n * 10000) + '</span></button>'; }).join('') + '</div>'
      + '<div class="pf-moy">' + MOYENS.map(function (x) { return '<button type="button" data-moy="' + x[0] + '" aria-pressed="' + (x[0] === moyen) + '"><i style="background:' + x[2] + '"></i>' + x[1] + '</button>'; }).join('') + '</div>'
      + '<div class="pf-f">' + champs + '<button type="button" class="pf-payer" disabled>Payer ' + fc(pack * 10000) + ' · bientôt</button></div>'
      + '<p class="pf-note">Le paiement par mobile money et par carte arrive bientôt. 1 crédit = 10 000 FCFA.</p>'
      + '<button type="button" class="pf-prev">Me prévenir à l’ouverture du paiement</button><div class="pf-r" role="status"></div></div>';
  }
  function prevenir() {
    var M = MOYENS.filter(function (x) { return x[0] === moyen; })[0], m = '';
    try { m = localStorage.getItem('efa_email_v1') || (JSON.parse(localStorage.getItem('efa_ateliers_v1') || '{}').mail) || ''; } catch (x) {}
    var r = dlg.querySelector('.pf-r');
    if (!m) {
      r.innerHTML = '<form class="pf-f" novalidate><label for="pf-m">Votre email</label><input id="pf-m" type="email" autocomplete="email" style="background:#fff;color:#0B1220"><button type="submit" class="pf-prev">Me prévenir</button></form>';
      r.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); var v = r.querySelector('#pf-m').value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return; try { localStorage.setItem('efa_email_v1', v); } catch (x) {} envoyer(v, M); });
      return;
    }
    envoyer(m, M);
  }
  function envoyer(m, M) {
    try { fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: '426191fb-4812-4de4-b602-5857464c5916', subject: 'efa.africa · Achat de crédits demandé · ' + M[1], from_name: 'Portefeuille efa.africa', email: m, replyto: m, credits: pack, montant: pack * 10000 + ' FCFA', moyen: M[1], page: location.pathname }) }); } catch (x) {}
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'achat-credits-' + M[0], title: 'Achat de crédits demandé', event: true }); } catch (x) {}
    dlg.querySelector('.pf-r').innerHTML = '<p class="pf-ok">C’est noté : nous vous écrivons dès que le paiement ' + M[1] + ' est ouvert.</p>';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poser); else poser();
})();
