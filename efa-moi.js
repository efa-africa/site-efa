/* EFA · Pastille « Mon EFA » dans l'en-tête, dès qu'il y a quelque chose à retrouver (progression, objectif, fiche, accès).
   Chargé par efa-appli.js, clone/habillage.js et clone/script.js : une seule pastille par page. */
(function () {
  if (window.EFA_MOI) return; window.EFA_MOI = 1;
  try {
    if (window.self !== window.top) return;
    var page = (location.pathname.split("/").pop() || "index.html").replace(/^([^.]+)$/, "$1.html");
    if (/^(admin|espace-organisation|tableau)/.test(page)) return;
    var a = false;
    try {
      for (var i = 0; i < localStorage.length && !a; i++) {
        var k = localStorage.key(i);
        if (/^(efa_parcours_v1|efa_objectif|efa_suivi_v1|efa_cahier_v1|efa_compte|efa_formule|efa_ateliers_v1|efa_point_v1|efa_jeu_baisse_v1|efa-bourse-v1|efa-pp-v1)$|^efa-at-|^efa-certificat-/.test(k)) a = true;
      }
    } catch (e) {}
    if (!a && page !== "mon-efa.html") return;
    function poser() {
      var t = document.querySelector("#clone-haut .menu-toggle, #haut .menu-toggle");
      if (!t || document.getElementById("efa-moi")) return !!t;
      var st = document.createElement("style");
      st.textContent = "#efa-moi{margin-left:auto;margin-right:10px;display:inline-flex;flex-shrink:0;align-items:center;min-height:40px;padding:8px 14px;border-radius:999px;background:#0B1220;color:#fff!important;font:800 14px/1 'Source Sans 3',system-ui,sans-serif;text-decoration:none;white-space:nowrap}"
        + "#efa-moi.serre{padding:7px 10px;margin-right:6px;font-size:13px}#efa-moi.retour{background:#E6F2FC;color:#0B1220!important}#efa-moi.retour:hover{background:#D3E7F7}#efa-moi:hover{background:#1B71B2}@media (max-width:380px){#efa-moi{padding:8px 11px;font-size:13px}}";
      document.head.appendChild(st);
      var l = document.createElement("a"); l.id = "efa-moi"; l.href = "mon-efa.html"; l.textContent = "Mon EFA";
      l.setAttribute("data-goatcounter-click", "entete-mon-efa");
      if (page === "mon-efa.html") {
        /* Déjà dans Mon EFA : la pastille ramène à la page d'où l'on vient (ou à l'accueil) */
        var ref = "", meme = false;
        try { var u = new URL(document.referrer); meme = u.origin === location.origin && !/mon-efa(\.html)?$/.test(u.pathname); ref = meme ? u.pathname + u.search + u.hash : ""; } catch (e) {}
        l.textContent = "← Retour"; l.href = ref || "index.html"; l.className = "retour";
        l.setAttribute("aria-label", meme ? "Revenir à la page précédente" : "Revenir à l’accueil");
        l.setAttribute("data-goatcounter-click", "mon-efa-retour");
        l.addEventListener("click", function (ev) { if (meme && history.length > 1) { ev.preventDefault(); history.back(); } });
      }
      t.parentNode.insertBefore(l, t);
      /* Téléphone étroit : si le bouton du menu sort de l'écran, on resserre, puis on retire ce qui est en trop à côté (le solde de crédits est aussi dans Mon EFA) */
      function ajuster() {
        var depasse = function () { return t.getBoundingClientRect().right > (window.innerWidth || 9999) - 2; };
        if (!depasse()) return;
        l.classList.add("serre");
        if (!depasse()) return;
        [].forEach.call(t.parentNode.children, function (e) { if (e !== l && e !== t && !e.matches(".efa-brand,.desktop-nav,nav") && depasse()) e.style.setProperty("display", "none", "important"); });
      }
      ajuster(); setTimeout(ajuster, 800); setTimeout(ajuster, 2500);
      return true;
    }
    if (!poser()) { var n = 0, iv = setInterval(function () { if (poser() || ++n > 20) clearInterval(iv); }, 250); }
  } catch (e) {}
})();
