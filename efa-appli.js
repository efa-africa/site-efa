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
