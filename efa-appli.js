-/* EFA · mention de l'appli EFA Compagnon sur le site efa.africa.
   À inclure en bas de chaque page, juste avant </body> :
     <script src="efa-appli.js" defer></script>
   - Menu du haut : plus de lien « L'appli » (retiré le 23/10/2026).
   - Section « Comprendre · Agir… » au-dessus du pied de page : ajoute une colonne « L'appli ».
   - Pied de page : ajoute un lien « L'appli EFA » sur toutes les pages qui l'incluent.
   - Pages d'outils et diagnostic : ajoute une carte « Suivre ma progression dans l'appli » avant le pied de page.
   - Rien ne s'affiche quand la page est ouverte depuis l'appli elle-même (dans son lecteur intégré).
   Aucun traceur, aucune donnée envoyée. Pour changer le texte : modifier TEXTE ci-dessous. */
(function () {
  try { if (window.self !== window.top) return; } catch (e) { return; }

  var APP = "/app/";
  var TEXTE = {
    titre: "Allez plus loin avec l’appli EFA",
    corps: "Des leçons de 5 minutes avec Koffi, votre cahier, vos challenges de 7 jours et votre progression, au même endroit. Gratuite, sans compte : vos réponses restent sur votre téléphone.",
    bouton: "Ouvrir l’appli",
    aide: "Sur Android : dans Chrome, menu ⋮ puis « Ajouter à l’écran d’accueil ».",
    pied: "L’appli EFA",
    menu: "L’appli",
    colonne: "L’appli",
    liens: ["Ouvrir l’appli EFA", "Leçons de 5 minutes avec Koffi", "Suivre ma progression"]
  };
  // Pages qui reçoivent la carte (nom du fichier, sans le dossier)
  var PAGES_CARTE = ["outils.html", "diagnostic.html", "ou-est-passe-mon-argent.html", "preparer-ma-retraite.html", "preter-a-un-proche.html", "construire-son-budget.html", "budget-mobile-money.html", "cercle-spirale.html"];

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  var css = "" +
    ".efa-appli{max-width:1080px;margin:40px auto;padding:0 16px;box-sizing:border-box}" +
    ".efa-appli__c{display:flex;gap:20px;align-items:center;background:#0B1220;color:#F5EFE2;border-radius:24px;padding:24px;box-sizing:border-box}" +
    ".efa-appli__img{flex:0 0 auto;width:88px;height:88px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 4px #3FD69A}" +
    ".efa-appli__k{margin:0 0 4px;font-size:12px;font-weight:800;line-height:1.2;letter-spacing:.14em;text-transform:uppercase;color:#6DB8F2}" +
    ".efa-appli__t{margin:0 0 8px;font-size:clamp(20px,3.2vw,26px);line-height:1.2;font-weight:800;color:#F5EFE2}" +
    ".efa-appli__p{margin:0 0 14px;font-size:16px;line-height:1.55;color:#C9CFDA}" +
    ".efa-appli__b{display:inline-block;background:#F5EFE2;color:#0B1220;text-decoration:none;font-weight:800;padding:12px 22px;border-radius:999px}" +
    ".efa-appli__b:hover{background:#fff}" +
    ".efa-appli__a{margin:10px 0 0;font-size:13px;color:#8A93A6}" +
    ".efa-appli-pied{font-weight:700}" +
    "@media (max-width:560px){.efa-appli__c{flex-direction:column;align-items:flex-start;padding:20px}.efa-appli__img{width:72px;height:72px}}";

  function ajouter() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var footer = document.querySelector("footer");

    // 1. Lien dans le pied de page (toutes les pages), à côté des autres liens
    if (footer && !footer.querySelector(".efa-appli-pied")) {
      var zone = footer.querySelector(".wrap, .in") || footer;
      var a = document.createElement("a");
      a.className = "efa-appli-pied";
      a.href = APP;
      a.setAttribute("data-goatcounter-click", "appli-pied");
      a.textContent = TEXTE.pied;
      zone.appendChild(a);
    }


    // 3. Menu du haut : « L'appli » retiré du menu le 23/10/2026 (décision d'Élysée). L'appli reste accessible par le pied de page.
    var nav = null;
    if (nav && !nav.querySelector('a[href="' + APP + '"]')) {
      var liens = [].slice.call(nav.querySelectorAll("a"));
      var modele = liens.filter(function (x) { return !/cta/.test(x.className); }).pop() || liens.pop();
      var m = modele ? modele.cloneNode(false) : document.createElement("a");
      m.removeAttribute("aria-current"); m.removeAttribute("id");
      m.href = APP; m.textContent = TEXTE.menu;
      m.setAttribute("data-goatcounter-click", "appli-menu");
      (modele && modele.parentNode !== nav ? modele.parentNode : nav).appendChild(m);
    }

    // 4. Section de liens « Comprendre · Agir · … » (au-dessus du pied de page) : colonne « L'appli » en dernier
    var MOTS = /^(comprendre|agir|apprendre|outils|s’informer|s'informer|ressources)$/i;
    var titres = [].slice.call(document.querySelectorAll("h2,h3,h4,h5,h6,strong,b,p,span,dt,small,div")).filter(function (el) {
      return el.childElementCount === 0 && MOTS.test((el.textContent || "").trim());
    });
    if (titres.length && !document.querySelector(".efa-appli-col")) {
      var col = titres[0];
      while (col.parentElement && !col.querySelector("a")) col = col.parentElement;
      var rang = col.parentElement;
      if (rang && rang.children.length >= 2) {
        var dern = rang.lastElementChild, c = dern.cloneNode(true);
        c.classList.add("efa-appli-col");
        var t = [].slice.call(c.querySelectorAll("*")).filter(function (el) { return el.childElementCount === 0 && el.tagName !== "A" && (el.textContent || "").trim(); })[0];
        var la = [].slice.call(c.querySelectorAll("a"));
        if (t && la.indexOf(t) < 0) t.textContent = TEXTE.colonne;
        var items = TEXTE.liens;
        la.forEach(function (x, i) {
          if (i < items.length) { x.textContent = items[i]; x.href = APP; x.removeAttribute("target"); x.setAttribute("data-goatcounter-click", "appli-colonne"); }
          else { var li = x.closest("li"); (li && c.contains(li) ? li : x).remove(); }
        });
        rang.appendChild(c);
      }
    }

    // 2. Carte sur les pages d'outils et de diagnostic
    if (PAGES_CARTE.indexOf(page) >= 0 && !document.querySelector(".efa-appli")) {
      var s = document.createElement("section");
      s.className = "efa-appli";
      s.setAttribute("aria-label", "L'appli EFA");
      s.innerHTML = '<div class="efa-appli__c">' +
        '<img class="efa-appli__img" src="' + APP + 'koffi.jpg" alt="Koffi, personnage EFA" width="88" height="88" loading="lazy">' +
        '<div><p class="efa-appli__k">L’appli EFA Compagnon</p>' +
        '<h2 class="efa-appli__t">' + TEXTE.titre + '</h2>' +
        '<p class="efa-appli__p">' + TEXTE.corps + '</p>' +
        '<a class="efa-appli__b" href="' + APP + '" data-goatcounter-click="appli-carte-' + page.replace(".html", "") + '">' + TEXTE.bouton + '</a>' +
        '<p class="efa-appli__a">' + TEXTE.aide + '</p></div></div>';
      if (footer && footer.parentNode) footer.parentNode.insertBefore(s, footer);
      else document.body.appendChild(s);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ajouter);
  else ajouter();
})();

/* ===== Bouton « Posez une question à Ely » ===== */
;(function () {
  if (/\/ely(\.html)?$/.test(location.pathname)) return;           // pas sur la page d'Ely
  function poser() {
    if (document.getElementById("efa-ely")) return;
    var css = document.createElement("style");
    css.textContent =
      "#efa-ely{position:fixed;z-index:9999;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;align-items:flex-end;gap:6px;font-family:Manrope,system-ui,-apple-system,sans-serif}" +
      "#efa-ely a{text-decoration:none;color:inherit}" +
      "#efa-ely .bulle{position:relative;background:#F5EFE2;color:#0B1220;border-radius:18px 18px 6px 18px;padding:8px 30px 8px 12px;box-shadow:0 8px 22px rgba(0,0,0,.35);max-width:170px}" +
      "#efa-ely .bulle small{display:block;font-size:11px;font-weight:600;color:#5B5648;margin-bottom:2px}" +
      "#efa-ely .bulle b{display:block;font-size:13px;font-weight:800;line-height:1.2}" +
      "#efa-ely .fermer{position:absolute;top:4px;right:4px;width:24px;height:24px;border:0;border-radius:50%;background:transparent;color:#5B5648;font-size:18px;line-height:1;cursor:pointer}" +
      "#efa-ely .visage{position:relative;display:block;width:84px;height:84px;border-radius:50%;border:3px solid #E44828;box-shadow:0 8px 22px rgba(0,0,0,.45);background:#0B1220}" +
      "#efa-ely .visage img{width:100%;height:100%;border-radius:50%;display:block;object-fit:cover}" +
      "#efa-ely .visage i{position:absolute;right:5px;bottom:5px;width:13px;height:13px;border-radius:50%;background:#3CCB7F;border:2px solid #0B1220}" +
      "#efa-ely .visage::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:3px solid #E44828;animation:efaEly 2.4s ease-out infinite}" +
      "@keyframes efaEly{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.35);opacity:0}}" +
      "@media (prefers-reduced-motion:reduce){#efa-ely .visage::after{animation:none;opacity:0}}" +
      "#efa-ely a:focus-visible{outline:3px solid #2188D6;outline-offset:3px;border-radius:20px}" +
      "@media (max-width:480px){#efa-ely .visage{width:70px;height:70px}#efa-ely .bulle{max-width:160px}#efa-ely .bulle b{font-size:12.5px}}";
    document.head.appendChild(css);
    var bloc = document.createElement("div");
    bloc.id = "efa-ely";
    var ferme = false;
    try { ferme = localStorage.getItem("efa-ely-bulle") === "fermee"; } catch (e) {}
    bloc.innerHTML =
      (ferme ? "" : '<div class="bulle"><a href="/ely.html"><small>Une question sur l’argent ?</small><b>Posez une question à Ely</b></a><button class="fermer" type="button" aria-label="Masquer le message">×</button></div>') +
      '<a class="visage" href="/ely.html" aria-label="Posez une question à Ely, le guide EFA"><img alt="" src="data:image/jpeg;base64,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"><i></i></a>';
    document.body.appendChild(bloc);
    var x = bloc.querySelector(".fermer");
    if (x) x.addEventListener("click", function () {
      var b = bloc.querySelector(".bulle"); if (b) b.remove();
      try { localStorage.setItem("efa-ely-bulle", "fermee"); } catch (e) {}
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poser); else poser();
})();
