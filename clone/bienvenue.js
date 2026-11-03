/* EFA · Accueil audio d'Élysée Johnson.
   Au premier clic sur « Trouver mon point de départ », la page reste sur l'accueil : une carte « Élysée vous accueille »
   s'ouvre au centre et le message démarre aussitôt. À la fin (ou sur « Continuer »), le parcours reprend normalement.
   Joué une seule fois ; l'adresse « ?hall » le remet à zéro. */
(function () {
  var CLE = 'efa_bienvenue_ecoutee', SRC = 'clone/assets/bienvenue-elysee-3.mp3';
  var B = document.getElementById('hero-cta'); if (!B) return;
  try { if (/[?&]hall\b/.test(location.search)) localStorage.removeItem(CLE); } catch (e) {}
  function deja() { try { return localStorage.getItem(CLE) === '1'; } catch (e) { return false; } }
  function noter() { try { localStorage.setItem(CLE, '1'); } catch (e) {} }
  if (deja()) return;
  /* Le son est préparé dès l'arrivée, pour démarrer au premier toucher. */
  var a = new Audio(); a.preload = 'auto'; a.src = SRC; try { a.load(); } catch (e) {}
  var css = '.bv-fond{position:fixed;inset:0;z-index:95;background:rgba(11,18,32,.38);opacity:0;transition:opacity .3s}' +
    '.bv-fond.on{opacity:1}' +
    '.bv{position:fixed;left:50%;top:50%;z-index:96;transform:translate(-50%,-46%);opacity:0;width:min(420px,calc(100% - 32px));box-sizing:border-box;background:#fff;color:#0B1220;border-radius:20px;padding:24px 22px 20px;box-shadow:0 24px 60px rgba(11,18,32,.28);font-family:"Source Sans 3",system-ui,sans-serif;text-align:center;transition:transform .35s ease,opacity .35s ease}' +
    '.bv.on{transform:translate(-50%,-50%);opacity:1}' +
    '.bv img{display:block;width:96px;height:96px;border-radius:50%;object-fit:cover;margin:0 auto 12px;box-shadow:0 0 0 4px #EEF5FC}' +
    '.bv-k{margin:0;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#B8341A}' +
    '.bv h2{margin:6px 0 4px;font:700 26px/1.15 "Libre Baskerville",Georgia,serif;color:#0B1220}' +
    '.bv-s{margin:0;font-size:15px;color:#4E5566}' +
    '.bv-bar{height:4px;background:#E3ECF5;border-radius:4px;margin:16px 0 14px;overflow:hidden}.bv-bar i{display:block;height:100%;width:0;background:#DA3C1B;transition:width .25s linear}' +
    '.bv-r{display:flex;gap:10px;justify-content:center}' +
    '.bv button{min-height:44px;border:0;border-radius:8px;cursor:pointer;font:800 15px "Source Sans 3",sans-serif;padding:10px 16px}' +
    '.bv .bv-p{background:#EEF5FC;color:#0B1220;min-width:104px}.bv .bv-c{background:#DA3C1B;color:#fff}' +
    '.bv button:focus-visible{outline:3px solid #2188D6;outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.bv,.bv-fond{transition:none}}';
  var ouvert = false;
  function suite() {
    if (!ouvert) return; ouvert = false; a.pause();
    var box = document.querySelector('.bv'), f = document.querySelector('.bv-fond');
    if (box) box.classList.remove('on'); if (f) f.classList.remove('on');
    setTimeout(function () { box && box.remove(); f && f.remove(); B.click(); }, 320);
  }
  function ouvrir() {
    ouvert = true;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var f = document.createElement('div'); f.className = 'bv-fond'; f.onclick = suite; document.body.appendChild(f);
    var box = document.createElement('div'); box.className = 'bv'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Message d’accueil d’Élysée Johnson');
    box.innerHTML = '<img src="clone/assets/elysee-portrait-carre.jpg" alt="Élysée Johnson"><p class="bv-k">Bienvenue chez EFA</p><h2>Élysée vous accueille</h2><p class="bv-s">22 secondes, vous pouvez continuer à tout moment.</p>' +
      '<div class="bv-bar"><i></i></div><div class="bv-r"><button type="button" class="bv-p">❚❚ Pause</button><button type="button" class="bv-c">Continuer →</button></div>';
    document.body.appendChild(box);
    var p = box.querySelector('.bv-p'), bar = box.querySelector('.bv-bar i');
    p.onclick = function () { if (a.paused) { a.play(); p.textContent = '❚❚ Pause'; } else { a.pause(); p.textContent = '▶ Écouter'; } };
    box.querySelector('.bv-c').onclick = suite;
    a.ontimeupdate = function () { if (a.duration) bar.style.width = (a.currentTime / a.duration * 100) + '%'; };
    a.onended = function () { bar.style.width = '100%'; setTimeout(suite, 700); };
    requestAnimationFrame(function () { f.classList.add('on'); box.classList.add('on'); });
    box.querySelector('.bv-c').focus({ preventScroll: true });
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: 'accueil-audio-bienvenue', title: 'accueil-audio-bienvenue', event: true }); } catch (e) {}
  }
  /* Capté avant tout autre script : on lance le son dans le geste même, puis on garde la page sur l'accueil. */
  window.addEventListener('click', function (e) {
    if (deja() || !e.target.closest || e.target.closest('#hero-cta') !== B) return;
    e.preventDefault(); e.stopImmediatePropagation();
    noter();
    try { a.currentTime = 0; } catch (x) {}
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () { var p = document.querySelector('.bv-p'); if (p) p.textContent = '▶ Écouter'; });
    ouvrir();
  }, true);
  addEventListener('keydown', function (e) { if (ouvert && e.key === 'Escape') suite(); });
})();
