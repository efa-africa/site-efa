/* EFA · La voix d'Élysée sur les pages (accueil et outils).
   EFAVoix.pastille(src, libellé, durée) → un bouton « Écouter Élysée » prêt à insérer.
   Config de page : window.EFA_VOIX = { pendant:{src, ancre, place}, fin:{src, quand, ancre, place} }
   - pendant : pastille insérée près de l'ancre (place : before | after | prepend | append).
   - fin : quand la fonction quand() devient vraie, une pastille « Élysée a un mot pour vous » apparaît ;
     elle se lance d'elle-même si le visiteur a déjà écouté Élysée sur cette page.
   Rien ne se joue sans un geste du visiteur. Une seule voix à la fois. */
(function () {
  "use strict";
  if (window.EFAVoix) return;
  var courant = null, ecoute = false;
  function css() {
    if (document.getElementById("ve-css")) return;
    var s = document.createElement("style"); s.id = "ve-css";
    s.textContent = ".ve{display:inline-flex;align-items:center;gap:10px;border:0;border-radius:999px;background:#fff;color:#0B1220;padding:5px 14px 5px 5px;font:700 15px/1.2 'Source Sans 3',system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(11,18,32,.14);position:relative;overflow:hidden;min-height:44px;text-align:left}"
      + ".ve img{width:34px;height:34px;border-radius:50%;object-fit:cover;flex:none}.ve .ve-i{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#e5462e;color:#fff;font-size:11px;flex:none}"
      + ".ve small{display:block;font-weight:600;font-size:12px;color:#587086}.ve .ve-b{position:absolute;left:0;bottom:0;height:3px;background:#e5462e;width:0}"
      + ".ve.joue .ve-i{background:#0B1220}.ve-sombre{background:rgba(255,255,255,.12);color:#fff;box-shadow:none}.ve-sombre small{color:#c4d6e6}"
      + ".ve-fin{animation:ve-p 1.6s ease-in-out 4}@keyframes ve-p{50%{box-shadow:0 0 0 8px rgba(229,70,46,.25)}}@media(prefers-reduced-motion:reduce){.ve-fin{animation:none}}";
    document.head.appendChild(s);
  }
  function racine() { return /\/(app|clone)\//.test(location.pathname) ? "../" : ""; }
  function pastille(src, lib, duree, opt) {
    css(); opt = opt || {};
    var b = document.createElement("button"); b.type = "button"; b.className = "ve" + (opt.sombre ? " ve-sombre" : "") + (opt.fin ? " ve-fin" : "");
    b.setAttribute("aria-label", (lib || "Écouter Élysée") + ", " + (duree || "") + " secondes");
    b.innerHTML = '<img loading="lazy" decoding="async" src="' + racine() + 'clone/assets/elysee-portrait-carre.jpg" alt=""><span><span class="ve-l">' + (lib || "Écouter Élysée") + '</span><small>' + (duree ? duree + " s · " : "") + 'vous pouvez couper à tout moment</small></span><span class="ve-i" aria-hidden="true">▶</span><span class="ve-b"></span>';
    var a = null;
    b.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      if (!a) { a = new Audio(racine() + src); a.preload = "auto";
        a.addEventListener("timeupdate", function () { if (a.duration) b.querySelector(".ve-b").style.width = (a.currentTime / a.duration * 100) + "%"; });
        a.addEventListener("ended", function () { b.classList.remove("joue"); b.querySelector(".ve-i").textContent = "▶"; b.querySelector(".ve-b").style.width = "0"; });
      }
      if (a.paused) { if (courant && courant !== a) { courant.pause(); document.querySelectorAll(".ve.joue").forEach(function (x) { x.classList.remove("joue"); x.querySelector(".ve-i").textContent = "▶"; }); }
        courant = a; ecoute = true; a.play().catch(function () {}); b.classList.add("joue"); b.querySelector(".ve-i").textContent = "❚❚";
        try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "voix-" + src.split("/").pop().replace(".mp3", ""), title: "Voix Élysée", event: true }); } catch (x) {}
      } else { a.pause(); b.classList.remove("joue"); b.querySelector(".ve-i").textContent = "▶"; }
    });
    b._jouer = function () { b.click(); };
    return b;
  }
  function placer(el, ancre, place) {
    var n = typeof ancre === "string" ? document.querySelector(ancre) : ancre; if (!n) return false;
    var w = document.createElement("div"); w.className = "ve-w"; w.style.margin = "12px 0"; w.appendChild(el);
    if (place === "before") n.parentNode.insertBefore(w, n); else if (place === "prepend") n.insertBefore(w, n.firstChild); else if (place === "append") n.appendChild(w); else n.parentNode.insertBefore(w, n.nextSibling);
    return true;
  }
  function demarrer() {
    var C = window.EFA_VOIX; if (!C) return;
    if (C.pendant) placer(pastille(C.pendant.src, C.pendant.lib || "Écouter Élysée", C.pendant.duree, C.pendant), C.pendant.ancre, C.pendant.place);
    if (C.fin) {
      var fait = false, t = null;
      var test = function () {
        if (fait) return; var ok = false; try { ok = C.fin.quand(); } catch (e) {} if (!ok) return;
        fait = true; var p = pastille(C.fin.src, C.fin.lib || "Élysée a un mot pour vous", C.fin.duree, { fin: true });
        var anc = typeof C.fin.ancre === "function" ? C.fin.ancre() : C.fin.ancre;
        if (placer(p, anc, C.fin.place) && ecoute) setTimeout(function () { p._jouer(); }, 600);
      };
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(test, 250); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
      test();
    }
  }
  window.EFAVoix = { pastille: pastille, placer: placer };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();
