/* EFA · mention de l'appli EFA Compagnon sur le site efa.africa.
   À inclure en bas de chaque page, juste avant </body> :
     <script src="efa-appli.js" defer></script>
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
    pied: "L’appli EFA"
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
      var zone = footer.querySelector(".wrap") || footer;
      var a = document.createElement("a");
      a.className = "efa-appli-pied";
      a.href = APP;
      a.setAttribute("data-goatcounter-click", "appli-pied");
      a.textContent = TEXTE.pied;
      zone.appendChild(a);
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
