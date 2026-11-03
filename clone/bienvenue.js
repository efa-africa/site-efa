/* EFA · Accueil audio d'Élysée Johnson : joué une seule fois, au premier clic sur « Trouver mon point de départ ».
   Bandeau discret avec pause et fermeture ; le parcours continue normalement pendant l'écoute. */
(function () {
  var CLE = 'efa_bienvenue_ecoutee', B = document.getElementById('hero-cta');
  if (!B) return;
  function deja() { try { return localStorage.getItem(CLE) === '1'; } catch (e) { return false; } }
  function noter() { try { localStorage.setItem(CLE, '1'); } catch (e) {} }
  var css = '.bv{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translate(-50%,140%);z-index:90;display:flex;align-items:center;gap:12px;width:min(440px,calc(100% - 32px));box-sizing:border-box;background:#fff;color:#0B1220;border-radius:16px;padding:10px 12px;box-shadow:0 18px 44px rgba(11,18,32,.22);font-family:"Source Sans 3",system-ui,sans-serif;transition:transform .35s ease}' +
    '.bv.on{transform:translate(-50%,0)}.bv img{flex:none;width:46px;height:46px;border-radius:50%;object-fit:cover}' +
    '.bv-t{flex:1;min-width:0}.bv-t b{display:block;font-size:15px;font-weight:800}.bv-t span{display:block;font-size:13px;color:#4E5566}' +
    '.bv-bar{height:3px;background:#E3ECF5;border-radius:3px;margin-top:6px;overflow:hidden}.bv-bar i{display:block;height:100%;width:0;background:#DA3C1B}' +
    '.bv button{flex:none;width:40px;height:40px;border:0;border-radius:50%;cursor:pointer;font:700 16px/1 "Source Sans 3",sans-serif}' +
    '.bv .bv-p{background:#DA3C1B;color:#fff}.bv .bv-x{background:#EEF5FC;color:#0B1220}' +
    '.bv button:focus-visible{outline:3px solid #2188D6;outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.bv{transition:none}}';
  var a = null, box = null;
  function fermer() { if (a) a.pause(); if (box) { box.classList.remove('on'); setTimeout(function () { box && box.remove(); box = null; }, 400); } }
  function lancer() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div'); box.className = 'bv'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Message d’accueil d’Élysée Johnson');
    box.innerHTML = '<img src="clone/assets/elysee-portrait-carre.jpg" alt=""><div class="bv-t"><b>Élysée vous accueille</b><span>Bienvenue chez EFA · 23 s</span><div class="bv-bar"><i></i></div></div>' +
      '<button type="button" class="bv-p" aria-label="Mettre en pause">❚❚</button><button type="button" class="bv-x" aria-label="Fermer le message">✕</button>';
    document.body.appendChild(box);
    var p = box.querySelector('.bv-p'), bar = box.querySelector('.bv-bar i');
    a = new Audio('clone/assets/bienvenue-elysee-2.mp3'); a.preload = 'auto';
    a.addEventListener('timeupdate', function () { if (a.duration) bar.style.width = (a.currentTime / a.duration * 100) + '%'; });
    a.addEventListener('ended', function () { setTimeout(fermer, 600); });
    p.onclick = function () { if (a.paused) { a.play(); p.textContent = '❚❚'; p.setAttribute('aria-label', 'Mettre en pause'); } else { a.pause(); p.textContent = '▶'; p.setAttribute('aria-label', 'Reprendre'); } };
    box.querySelector('.bv-x').onclick = fermer;
    requestAnimationFrame(function () { box.classList.add('on'); });
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () { p.textContent = '▶'; p.setAttribute('aria-label', 'Écouter'); });
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'accueil-audio-bienvenue', title: 'accueil-audio-bienvenue', event: true }); } catch (e) {}
  }
  B.addEventListener('click', function () { if (deja()) return; noter(); lancer(); });
})();
