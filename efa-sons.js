/* EFA · sons d'interface (bonne réponse, erreur, fin de quiz, changement de scène).
   Sons synthétisés dans le navigateur (Web Audio) : aucun fichier, aucun droit tiers.
   Réglage mémorisé sur l'appareil : localStorage « efa_son » = "off" pour couper.
   API : EFA_SONS.joue("bon" | "faux" | "fin" | "scene" | "clic"), EFA_SONS.actif(), EFA_SONS.regler(true|false). */
(function () {
  if (window.EFA_SONS) return;
  var ctx = null, vu = false;
  function pref() { try { return localStorage.getItem("efa_son") !== "off"; } catch (e) { return true; } }
  function regler(on) { try { localStorage.setItem("efa_son", on ? "on" : "off"); } catch (e) {} majBouton(); }
  function ac() {
    if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { ctx = new C(); } catch (e) { return null; } }
    if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }
  function note(f, t0, d, type, vol) {
    var c = ac(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.16, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.05);
  }
  function souffle(d, vol) {
    var c = ac(); if (!c) return;
    var n = Math.floor(c.sampleRate * d), buf = c.createBuffer(1, n, c.sampleRate), x = buf.getChannelData(0);
    for (var i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
    f.type = "bandpass"; f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(2400, t + d); f.Q.value = 0.8;
    g.gain.setValueAtTime(vol || 0.05, t);
    s.buffer = buf; s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  }
  var SONS = {
    bon: function () { note(659.25, 0, 0.18, "triangle", 0.15); note(987.77, 0.09, 0.32, "triangle", 0.14); },
    faux: function () { note(311.13, 0, 0.2, "sine", 0.13); note(233.08, 0.12, 0.34, "sine", 0.12); },
    fin: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, k) { note(f, k * 0.11, 0.42, "triangle", 0.12); }); },
    scene: function () { souffle(0.32, 0.045); },
    clic: function () { note(880, 0, 0.06, "sine", 0.06); }
  };
  function joue(type) {
    if (!pref() || !SONS[type]) return;
    try { SONS[type](); } catch (e) {}
    if (!vu && type !== "scene") { vu = true; montrer(); }
  }
  /* Petit bouton, montré au premier son de la page, pour couper ou remettre le son */
  var btn = null;
  function majBouton() { if (btn) { var o = pref(); btn.textContent = o ? "🔊 Son activé · couper" : "🔇 Son coupé · activer"; btn.setAttribute("aria-pressed", String(o)); } }
  function montrer() {
    if (document.documentElement.classList.contains("efa-sans-bouton-son")) return;
    if (!btn) {
      var st = document.createElement("style");
      st.textContent = ".efa-son{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:60;border:0;border-radius:999px;background:#0B1220;color:#fff;font:700 13px/1 'Source Sans 3',system-ui,sans-serif;padding:10px 14px;min-height:40px;cursor:pointer;box-shadow:0 6px 18px rgba(11,18,32,.25);transition:opacity .4s}.efa-son.cache{opacity:0;pointer-events:none}";
      document.head.appendChild(st);
      btn = document.createElement("button"); btn.type = "button"; btn.className = "efa-son";
      btn.addEventListener("click", function () { regler(!pref()); if (pref()) SONS.clic(); });
      document.body.appendChild(btn);
    }
    majBouton(); btn.classList.remove("cache");
    clearTimeout(btn._t); btn._t = setTimeout(function () { btn.classList.add("cache"); }, 6000);
  }
  window.EFA_SONS = { joue: joue, actif: pref, regler: regler };
})();
