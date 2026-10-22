/* EFA · mention de l'appli EFA Compagnon sur le site efa.africa.
   À inclure en bas de chaque page, juste avant </body> :
     <script src="efa-appli.js" defer></script>
   - Menu du haut : ajoute « L'appli » en dernière position.
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


    // 3. Menu du haut : « L'appli » en dernière position, dans le style des autres liens
    var nav = document.querySelector("header nav") || document.querySelector("nav.nav") || document.getElementById("nav");
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

/* ===== Bouton « Parler à Ely » — à coller à la fin de efa-appli.js ===== */
(function () {
  if (/\/ely(\.html)?$/.test(location.pathname)) return;           // pas sur la page d'Ely
  function poser() {
    if (document.getElementById("efa-ely-bouton")) return;
    var css = document.createElement("style");
    css.textContent =
      "#efa-ely-bouton{position:fixed;z-index:9999;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));" +
      "display:flex;align-items:center;gap:10px;padding:6px 16px 6px 6px;border-radius:999px;background:#0B1220;color:#fff;" +
      "font:700 15px/1 Manrope,system-ui,-apple-system,sans-serif;text-decoration:none;border:1px solid #22304D;box-shadow:0 8px 24px rgba(0,0,0,.35)}" +
      "#efa-ely-bouton img{width:40px;height:40px;border-radius:50%;display:block}" +
      "#efa-ely-bouton i{position:absolute;left:36px;bottom:8px;width:10px;height:10px;border-radius:50%;background:#3CCB7F;border:2px solid #0B1220}" +
      "#efa-ely-bouton:hover{border-color:#2188D6}#efa-ely-bouton:focus-visible{outline:2px solid #2188D6;outline-offset:2px}" +
      "@media (max-width:480px){#efa-ely-bouton span{display:none}#efa-ely-bouton{padding:5px}}";
    document.head.appendChild(css);
    var a = document.createElement("a");
    a.id = "efa-ely-bouton"; a.href = "/ely.html"; a.setAttribute("aria-label", "Parler à Ely, le guide EFA");
    a.innerHTML = '<img alt="" src="data:image/jpeg;base64,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"><i></i><span>Parler à Ely</span>';
    document.body.appendChild(a);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poser); else poser();
})();
