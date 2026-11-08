/* EFA · Accueil audio d'Élysée Johnson, en petit bandeau (4 nov. 2026).
   Rien ne bloque l'entrée : sous « Trouver mon chemin », un petit bandeau propose « ▶ Écouter · 22 s ».
   Le visiteur peut lire, avancer ou fermer le bandeau ; il ne revient plus une fois le message écouté ou fermé. L'adresse « ?hall » le remet à zéro. */
(function () {
  var CLE = 'efa_bienvenue_ecoutee', VUE = 'efa_bienvenue_vue', SRC = 'clone/assets/bienvenue-elysee-3.mp3';
  var B = document.getElementById('hero-cta'); if (!B) return;
  try { if (/[?&]hall\b/.test(location.search)) { localStorage.removeItem(CLE); localStorage.removeItem(VUE); } } catch (e) {}
  function lire(k) { try { return localStorage.getItem(k) === '1'; } catch (e) { return false; } }
  function noter(k) { try { localStorage.setItem(k, '1'); } catch (e) {} }
  if (lire(CLE) || lire(VUE)) return;
  var a = new Audio(); a.preload = 'none'; a.src = SRC;
  var css = '.bv{position:relative;z-index:2;margin-top:14px;display:flex;align-items:center;gap:10px;width:max-content;max-width:100%;box-sizing:border-box;background:rgba(255,255,255,.96);color:#0B1220;border-radius:999px;padding:5px 6px 5px 5px;box-shadow:0 8px 24px rgba(11,18,32,.18);font-family:"Source Sans 3",system-ui,sans-serif;opacity:0;transition:opacity .4s ease}' +
    '.bv.on{opacity:1}' +
    '.bv img{flex:none;width:36px;height:36px;border-radius:50%;object-fit:cover}' +
    '.bv-t{flex:1;min-width:0;line-height:1.2;overflow:hidden}.bv-t b{display:block;font-size:13.5px;font-weight:800;line-height:1.2}.bv-t small{display:block;font-size:12.5px;color:#4E5566}' +
    '.bv-bar{height:3px;width:110px;background:#E3ECF5;border-radius:3px;margin-top:5px;overflow:hidden}.bv-bar i{display:block;height:100%;width:0;background:#DA3C1B;transition:width .25s linear}' +
    '.bv button{flex:none;min-height:38px;border:0;border-radius:999px;cursor:pointer;font:800 14px "Source Sans 3",sans-serif;padding:8px 14px;background:#DA3C1B;color:#fff;white-space:nowrap}' +
    '.bv .bv-x{background:none;color:#5F6676;font-size:20px;line-height:1;padding:6px 8px;min-width:34px}' +
    '.bv button:focus-visible{outline:3px solid #2188D6;outline-offset:2px}.bv [hidden]{display:none!important}' +
    '@media (prefers-reduced-motion:reduce){.bv{transition:none}}';
  var box, enCours = false;
  function fermer(definitif) {
    if (definitif) noter(VUE);
    a.pause(); enCours = false;
    if (box) { box.classList.remove('on'); setTimeout(function () { box && box.remove(); box = null; }, 320); }
  }
  function jouer() {
    noter(CLE); enCours = true;
    var bt = box.querySelector('.bv-e'), bar = box.querySelector('.bv-bar');
    bt.textContent = '❚❚'; bt.setAttribute('aria-label', 'Mettre en pause'); bt.classList.remove('bv-e'); bt.classList.add('bv-p');
    bar.hidden = false;
    try { a.currentTime = 0; } catch (x) {}
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () { bt.textContent = '▶'; });
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'accueil-audio-bienvenue', title: 'accueil-audio-bienvenue', event: true }); } catch (e) {}
  }
  function montrer() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div'); box.className = 'bv'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Message d’accueil d’Élysée Johnson');
    box.innerHTML = '<img loading="lazy" decoding="async" src="clone/assets/elysee-portrait-carre.jpg" alt="">' +
      '<span class="bv-t"><b>Élysée vous accueille</b><small>Message de 22 s</small><span class="bv-bar" hidden><i></i></span></span>' +
      '<button type="button" class="bv-e">▶ Écouter</button><button type="button" class="bv-x" aria-label="Fermer">×</button>';
    B.insertAdjacentElement('afterend', box);
    box.querySelector('.bv-x').onclick = function () { fermer(true); };
    var bt = box.querySelector('button');
    bt.onclick = function () {
      if (bt.classList.contains('bv-e')) return jouer();
      if (a.paused) { a.play(); bt.textContent = '❚❚'; enCours = true; } else { a.pause(); bt.textContent = '▶'; enCours = false; }
    };
    a.ontimeupdate = function () { var i = box && box.querySelector('.bv-bar i'); if (a.duration && i) i.style.width = (a.currentTime / a.duration * 100) + '%'; };
    a.onended = function () { var i = box && box.querySelector('.bv-bar i'); if (i) i.style.width = '100%'; setTimeout(function () { fermer(true); }, 800); };
    requestAnimationFrame(function () { box.classList.add('on'); });
  }
  addEventListener('keydown', function (e) { if (box && e.key === 'Escape') fermer(true); });
  if (document.readyState === 'complete') setTimeout(montrer, 900); else addEventListener('load', function () { setTimeout(montrer, 900); });
})();
