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
      + '<span class="p-t"><span class="p-long">Cours et ateliers offerts : gagnez votre code promo avec votre email.</span><span class="p-court">Cours offerts avec un code promo</span></span>'
      + '<a class="p-v" href="' + (surCoaching ? '#premiers-pas' : 'coaching.html#premiers-pas') + '" data-goatcounter-click="promo-bandeau">Gagner mon code →</a>'
      + '<button class="p-x" type="button" aria-label="Fermer le bandeau">×</button></div>';
    var fil = document.getElementById('fil'), main = document.querySelector('main');
    if (fil && fil.nextElementSibling) { var apres = fil.nextElementSibling; apres.parentNode.insertBefore(b, apres.nextSibling); }
    else if (getComputedStyle(h).position === 'fixed' && main) main.insertBefore(b, main.firstChild);
    else h.parentNode.insertBefore(b, h.nextSibling);
    b.querySelector('.p-x').addEventListener('click', function () { b.remove(); try { sessionStorage.setItem('efa_promo_ferme', '1'); } catch (e) {} });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poser); else poser();
})();
