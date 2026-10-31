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
