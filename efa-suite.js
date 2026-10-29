/* EFA · « Et ensuite ? » : la suite de chaque contenu, d'après les parcours d'apprentissage.
   Chargé par efa-appli.js sur toutes les pages (ou directement : <script src="efa-suite.js" defer></script>).
   - La page fait partie d'un parcours : affiche l'étape suivante, la progression et un bouton « J'ai fait cette étape ».
   - Sinon : propose de choisir un parcours.
   Parcours suivi : ?parcours=P5 dans l'adresse, sinon le dernier parcours ouvert, sinon le premier qui contient la page.
   Progression gardée sur l'appareil (localStorage « efa_parcours_v1 », la même que parcours.html). Rien n'est envoyé. */
(function () {
  "use strict";
  try { if (window.self !== window.top) return; } catch (e) { return; }
  if (window.__efaSuite) return; window.__efaSuite = 1;

  /* ---------- Barre de navigation commune ----------
     Les pages plein écran (formations, certificats, Ely, diagnostic…) n'ont pas le menu du site :
     on y ajoute une barre fine pour aller partout sans repasser par l'accueil. */
  function barreNav() {
    var deja = document.querySelector('header a[href="methode.html"], .mainnav a[href="methode.html"], nav a[href="methode.html"]');
    if (deja || document.querySelector(".efa-nav")) return;
    var p = (location.pathname.split("/").pop() || "index").replace(/^([^.]+)$/, "$1.html");
    var st = document.createElement("style");
    st.textContent = ".efa-nav{position:relative;z-index:50;align-self:stretch;width:100%;max-width:100vw;box-sizing:border-box;flex:none;background:#0B1220;color:#fff;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif;border-bottom:1px solid #1F2C45}"
      + ".efa-nav-in{max-width:min(1120px,100vw);box-sizing:border-box;margin:0 auto;display:flex;align-items:center;gap:4px 6px;padding:6px max(12px,env(safe-area-inset-left,0px));overflow-x:auto;scrollbar-width:none;white-space:nowrap}"
      + ".efa-nav-in::-webkit-scrollbar{display:none}"
      + ".efa-nav a{color:#E8EDF5;text-decoration:none;font-size:14px;font-weight:700;padding:7px 10px;border-radius:8px;flex:0 0 auto}"
      + ".efa-nav a:hover{background:rgba(255,255,255,.1)}"
      + ".efa-nav a.efa-nav-logo{display:flex;align-items:center;gap:8px;padding:4px 8px 4px 0;font-size:11px;letter-spacing:.16em}"
      + ".efa-nav a.efa-nav-logo img{width:26px;height:26px}"
      + ".efa-nav a.efa-nav-p{background:#DA3C1B;color:#fff}"
      + ".efa-nav a[aria-current]{background:rgba(255,255,255,.16)}"
      + "@media (max-width:640px){.efa-nav a.efa-nav-logo span{display:none}.efa-nav a{font-size:13.5px;padding:7px 8px}}"
      + "@media print{.efa-nav{display:none}}";
    document.head.appendChild(st);
    var L = [["parcours.html", "L’école", "efa-nav-p"], ["methode.html", "Études & prospective"], ["organisations.html", "Pour les organisations"], ["auteur.html", "À propos"]];
    var n = document.createElement("nav"); n.className = "efa-nav"; n.setAttribute("aria-label", "Navigation du site");
    n.innerHTML = '<div class="efa-nav-in"><a class="efa-nav-logo" href="index.html" aria-label="Accueil EFA"><img src="logo-efa-96.png" alt="" width="26" height="26"><span>ACCUEIL</span></a>'
      + L.map(function (x) { return '<a href="' + x[0] + '"' + (x[2] ? ' class="' + x[2] + '"' : '') + (p === x[0] ? ' aria-current="page"' : '') + ">" + x[1] + "</a>"; }).join("") + "</div>";
    document.body.insertBefore(n, document.body.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", barreNav); else barreNav();

  /* ---------- Mentions obligatoires en bas de page ----------
     Chaque page dit, si elle ne le dit pas déjà : contenus faits avec l'aide de l'IA et vérifiés, personnages fictifs,
     éducation et non conseil. */
  function mentions() {
    var pg = (location.pathname.split("/").pop() || "index").replace(/^([^.]+)$/, "$1.html");
    if (["admin-ecole.html", "espace-organisation.html", "tableau-ely.html"].indexOf(pg) >= 0 || document.querySelector(".efa-mentions")) return;
    var t = (document.body.innerText || "").toLowerCase(), m = [];
    /* La mention de l'IA ne figure que sur la page Méthode ; ailleurs, seulement les personnages fictifs. */
    if (pg === "methode.html") { if (t.indexOf("intelligence artificielle") < 0) m.push("Contenus pédagogiques réalisés avec l’aide de l’intelligence artificielle et relus par l’équipe EFA. Les personnages et leurs montants sont fictifs."); }
    else if (t.indexOf("fictif") < 0) m.push("Les personnages et leurs montants sont fictifs.");
    if (!/pas (un )?conseil|ni conseil|aucun conseil|éducation, pas conseil|pas de conseil/.test(t)) m.push("EFA fait de l’éducation financière : ni conseil en investissement, ni vente de produits financiers.");
    if (!m.length) return;
    var st = document.createElement("style");
    st.textContent = ".efa-mentions{max-width:1120px;margin:0 auto;padding:14px max(16px,env(safe-area-inset-left,0px));font:400 13px/1.5 'Source Sans 3','Source Sans Pro',system-ui,sans-serif;color:#5F6676;text-align:center}.efa-foot .efa-mentions{color:#8E98AA;padding-inline:0;text-align:left}";
    document.head.appendChild(st);
    var p = document.createElement("p"); p.className = "efa-mentions"; p.textContent = m.join(" ");
    var bas = document.querySelector(".efa-foot .ef-bot");
    if (bas) bas.parentNode.insertBefore(p, bas); else document.body.appendChild(p);
  }
  if (document.readyState === "complete") setTimeout(mentions, 0); else window.addEventListener("load", function () { setTimeout(mentions, 300); });

  /* ---------- Partage : « Si ça vous a aidé, partagez » ----------
     Tout bouton [data-efa-partager] du site déclenche le partage (attributs facultatifs :
     data-efa-partager="whatsapp|facebook|copier", data-titre, data-url). */
  function urlPartage(u) {
    var c = document.querySelector('link[rel="canonical"]');
    var b = u || (c && c.href) || (location.origin + location.pathname);
    b = b.split("#")[0].replace(/[?&]parcours=P\d+/, "");
    return b + (b.indexOf("?") < 0 ? "?" : "&") + "src=partage";
  }
  function titrePartage(t) { return (t || document.title || "EFA").replace(/\s*·\s*EFA\s*$/, ""); }
  function texteMessage(t) { return "Ça m’a aidé à mieux gérer mon argent, je vous le partage : « " + titrePartage(t) + " » · EFA, Éducation Financière Afrique"; }
  function compter(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function partager(mode, t, u, bouton) {
    var url = urlPartage(u), texte = texteMessage(t);
    compter("partage-" + (mode || "auto"));
    if ((!mode || mode === "auto") && navigator.share) {
      navigator.share({ title: titrePartage(t), text: texte, url: url }).catch(function () {});
      return;
    }
    if (mode === "facebook") { window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), "_blank", "noopener"); return; }
    if (mode === "copier") {
      var ok = function () { if (bouton) { var o = bouton.textContent; bouton.textContent = "Lien copié"; setTimeout(function () { bouton.textContent = o; }, 2000); } };
      try { navigator.clipboard.writeText(url).then(ok, function () { window.prompt("Copiez ce lien :", url); }); } catch (e) { window.prompt("Copiez ce lien :", url); }
      return;
    }
    window.open("https://wa.me/?text=" + encodeURIComponent(texte + " " + url), "_blank", "noopener");
  }
  window.efaPartager = partager;
  // Pied de page de toutes les pages : « Partager EFA »
  function piedPartage() {
    var bas = document.querySelector(".efa-foot .ef-bot");
    if (!bas || bas.querySelector("[data-efa-partager]")) return;
    var b = document.createElement("a"); b.href = "#"; b.textContent = "Partager EFA à un proche";
    b.setAttribute("data-efa-partager", "whatsapp"); b.setAttribute("data-url", "https://efa.africa/"); b.setAttribute("data-titre", "EFA, l’argent s’apprend");
    b.style.color = "#F09680"; b.style.fontWeight = "700";
    bas.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", piedPartage); else piedPartage();
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-efa-partager]"); if (!b) return;
    e.preventDefault();
    partager(b.getAttribute("data-efa-partager"), b.getAttribute("data-titre"), b.getAttribute("data-url"), b);
  });

  /* ---------- Précédent / Suivant, en haut de chaque écran ----------
     Précédent : la page d'où l'on vient sur le site (mémorisée pendant la visite), sinon l'accueil.
     Suivant : l'étape suivante dans un module ; sinon la suite qu'EFA veut proposer (table SUIVANT, à modifier librement). */
  var SUIVANT = {
    "index.html": ["parcours.html", "L’école"],
    "auteur.html": ["parcours.html", "L’école"],
    "outils.html": ["parcours.html", "L’école"],
    "diagnostic.html": ["parcours.html", "L’école"],
    "methode.html": ["etude-tontine-en-chiffres.html?src=suivant", "La dernière étude"],
    "news.html": ["methode.html", "Études & prospective"],
    "organisations.html": ["programme-organisation.html", "Composer un programme"],
    "rendez-vous.html": ["index.html", "Accueil"],
    "rejoindre.html": ["parcours.html", "L’école"],
    "espace-organisation.html": ["programme-organisation.html", "Composer un programme"],
    "bourse-marche.html": ["traders.html", "EFA Traders, le simulateur"],
    "traders.html": ["bourse-essentiel.html", "L’École de la Bourse"]
  };
  var SANS_FIL = ["admin-ecole.html", "tableau-ely.html", "ely.html", "index.html"]; // l'accueil est le point de départ : ses deux portes suffisent
  var FIL = "efa_fil";
  function court(t) { t = String(t || "").replace(/\s*·\s*EFA.*$/, "").replace(/\s*\|.*$/, "").trim(); return t.length > 34 ? t.slice(0, 32).replace(/\s+\S*$/, "") + "…" : t; }
  function filSuivant(href, label) {
    var a = document.querySelector(".efa-fil .fil-s"); if (!a || !href) return;
    a.href = href; a.innerHTML = '<b class="fp">Poursuivre&nbsp;: </b><span>' + esc(label) + "</span> →"; a.hidden = false;
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
  }
  window.EFA_FIL = { suivant: filSuivant };
  function filNav() {
    var pg = (location.pathname.split("/").pop() || "index").replace(/^([^.]+)$/, "$1.html");
    if (SANS_FIL.indexOf(pg) >= 0 || document.querySelector(".efa-fil")) return;
    var cur = location.pathname + location.search, S = [];
    try { S = JSON.parse(sessionStorage.getItem(FIL) || "[]") || []; } catch (e) {}
    if (S.length && S[S.length - 1].u === cur) { /* rechargement */ }
    else if (S.length > 1 && S[S.length - 2].u === cur) S.pop(); // retour en arrière
    else S.push({ u: cur, t: ({ "index.html": "Accueil", "parcours.html": "L’école", "methode.html": "Études & prospective", "organisations.html": "Pour les organisations", "outils.html": "Mes outils", "auteur.html": "À propos" })[pg] || court((document.querySelector("h1") || {}).textContent || document.title) });
    S = S.slice(-30); try { sessionStorage.setItem(FIL, JSON.stringify(S)); } catch (e) {}
    var prev = S.length > 1 ? S[S.length - 2] : (pg !== "index.html" ? { u: "index.html", t: "Accueil" } : null);
    var st = document.createElement("style");
    st.textContent = ".efa-fil{background:#F5EFE2;border-bottom:1px solid #E2D8C4;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif;align-self:stretch;width:100%;box-sizing:border-box}"
      + ".efa-fil-in{max-width:1120px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:6px max(12px,env(safe-area-inset-left,0px))}"
      + ".efa-fil-place{width:100%;max-width:100%;min-width:0;align-self:stretch}.efa-fil{max-width:100%;overflow:hidden}.efa-fil-in{min-width:0}.efa-fil-in>a{flex:0 1 auto;min-width:0}"
      + ".efa-fil a{display:inline-block;line-height:26px;min-height:38px;padding:6px 12px;border-radius:8px;font-size:14.5px;font-weight:800;text-decoration:none;color:#0B1220;max-width:48%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
      + ".efa-fil a.fil-p{background:#0B1220;color:#fff}.efa-fil a.fil-s{background:#DA3C1B;color:#fff;margin-left:auto}.efa-fil a[hidden]{display:none}"
      + ".efa-fil a span{font-weight:600;opacity:.85}.efa-fil a .fp{font-weight:800}"
      + "@media (max-width:520px){.efa-fil a.fil-s .fp{display:none}.efa-fil a.fil-s span{opacity:1;font-weight:800}}"
      + "@media (max-width:520px){.efa-fil a{font-size:14px;padding:6px 12px}.efa-fil a.fil-p span{display:none}.efa-fil a.fil-s{max-width:calc(100% - 104px)}}"
      + ".efa-fil.flot{position:fixed;left:0;right:0;z-index:45;background:rgba(245,239,226,.96);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 6px 18px rgba(11,18,32,.12);animation:efaFil .18s ease-out}"
      + ".efa-fil.flot .efa-fil-in{padding-top:4px;padding-bottom:4px}.efa-fil.flot a{min-height:34px;line-height:22px;padding:6px 12px}"
      + "@keyframes efaFil{from{transform:translateY(-8px);opacity:0}to{transform:none;opacity:1}}"
      + "@media (prefers-reduced-motion:reduce){.efa-fil.flot{animation:none}}"
      + "@media print{.efa-fil{display:none}}";
    document.head.appendChild(st);
    var f = document.createElement("nav"); f.className = "efa-fil"; f.setAttribute("aria-label", "Revenir et poursuivre");
    f.innerHTML = '<div class="efa-fil-in">' + (prev ? '<a class="fil-p" href="' + esc(prev.u) + '" data-goatcounter-click="fil-precedent">← Revenir<span>&nbsp;: ' + esc(prev.t || "") + "</span></a>" : "") + '<a class="fil-s" hidden data-goatcounter-click="fil-suivant"></a></div>';
    var p0 = f.querySelector(".fil-p");
    if (p0) p0.addEventListener("click", function (e) {
      // Retour réel quand on vient de la page précédente du site : la page reprend où on l'avait laissée
      try { if (S.length > 1 && document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) { e.preventDefault(); history.back(); } } catch (x) {}
    });
    var hd = document.querySelector(".efa-nav") || document.querySelector("header"), mn = document.querySelector("main");
    if (hd && getComputedStyle(hd).position === "fixed" && mn) {
      // En-tête fixe (accueil, organisations, rendez-vous) : la barre se place sous lui, en tête du contenu
      var bas = hd.getBoundingClientRect().bottom, tk = document.getElementById("tk");
      if (tk && getComputedStyle(tk).position === "fixed") bas = Math.max(bas, tk.getBoundingClientRect().bottom);
      f.style.marginTop = Math.round(bas) + "px"; mn.insertBefore(f, mn.firstChild);
      var pt = parseFloat(getComputedStyle(mn).paddingTop) || 0; if (pt >= bas) f.style.marginTop = "0px";
    } else if (hd && hd.parentNode) hd.parentNode.insertBefore(f, hd.nextSibling); else document.body.insertBefore(f, document.body.firstChild);
    // Toujours visible : quand la barre sort de l'écran, elle se fixe en haut, juste sous l'en-tête s'il reste affiché
    var ph = document.createElement("div"); ph.className = "efa-fil-place"; f.parentNode.insertBefore(ph, f); ph.appendChild(f);
    var entete = function () { if (!hd || hd === f) return 0; var cs = getComputedStyle(hd); if (cs.position !== "fixed" && cs.position !== "sticky") return 0; var r = hd.getBoundingClientRect(); return r.bottom > 0 && r.top <= 0.5 ? r.bottom : 0; };
    var flotte = false, att = false;
    var maj = function () {
      att = false; var hb = entete(), r = ph.getBoundingClientRect(), doit = r.top < hb - 0.5;
      if (doit !== flotte) {
        flotte = doit;
        if (doit) { ph.style.height = r.height + "px"; f.classList.add("flot"); }
        else { f.classList.remove("flot"); f.style.top = ""; ph.style.height = ""; }
      }
      if (flotte) { f.style.top = Math.round(hb) + "px"; document.documentElement.style.setProperty("--efa-fil-h", f.offsetHeight + "px"); }
      else document.documentElement.style.setProperty("--efa-fil-h", "0px");
    };
    var demande = function () { if (!att) { att = true; requestAnimationFrame(maj); } };
    window.addEventListener("scroll", demande, { passive: true }); window.addEventListener("resize", demande); maj();
    // Suivant par défaut : la table SUIVANT, sinon reprendre le module en cours, sinon L'école
    var et = {}; try { et = JSON.parse(localStorage.getItem("efa_parcours_v1") || "{}") || {}; } catch (e) {}
    // Arrivée depuis « Trouver mon point de départ » : la suite logique est de revenir à ses recommandations
    var depuisDepart = false;
    try {
      if (/[?&]src=depart/.test(location.search) || /point-de-depart(\.html)?([?#]|$)/.test(document.referrer || "")) sessionStorage.setItem("efa_depart", "1");
      depuisDepart = sessionStorage.getItem("efa_depart") === "1" && !!localStorage.getItem("efa_objectif");
    } catch (e) {}
    var MOTEUR = window.ECOLE && window.ECOLE.modules && window.ECOLE.cle;
    function repriseSecondaire() {
      // L’ancienne activité de L’école reste accessible, mais en bas de page, sans détourner du parcours en cours
      if (!et.actif || document.querySelector(".efa-reprise")) return;
      try { if (localStorage.getItem("efa_objectif")) return; } catch (e) {} // un objectif en cours passe avant l’ancienne activité
      var zone = document.querySelector("main") || document.body, d = document.createElement("p");
      d.className = "efa-reprise";
      d.innerHTML = 'Votre activité précédente dans L’école&nbsp;: <a href="parcours.html#' + esc(et.actif) + '" data-goatcounter-click="fil-reprise-secondaire">reprendre le module ' + esc(String(et.actif).replace(/^P/, "")) + "</a>";
      var s2 = document.createElement("style");
      s2.textContent = ".efa-reprise{max-width:1120px;margin:28px auto 8px;padding:0 max(16px,env(safe-area-inset-left,0px));font:400 14.5px/1.45 'Source Sans 3',system-ui,sans-serif;color:inherit;opacity:.78}.efa-reprise a{color:inherit;font-weight:700;text-decoration:underline;text-underline-offset:3px}";
      document.head.appendChild(s2); zone.appendChild(d);
    }
    function suiteMoteur() {
      var E = window.ECOLE, ec = { m: {} }; try { ec = JSON.parse(localStorage.getItem(E.cle) || "{}") || { m: {} }; } catch (e) {}
      var M = ec.m || {}, h = location.hash.slice(1), L = E.modules, k0 = 0;
      for (var k = 0; k < L.length; k++) if (L[k].id === h) k0 = k;
      // Le module en cours s’il n’est pas fini, sinon le premier module non validé de cette formation
      var cible = null;
      if (h && M[h] && !M[h].valide) cible = null; // on y est déjà : on propose la suite
      for (var j = 0; j < L.length && !cible; j++) { var x = L[(k0 + (h ? 1 : 0) + j) % L.length]; if (x.id !== h && !(M[x.id] && M[x.id].valide)) cible = x; }
      if (cible) filSuivant(pg + "#" + cible.id, "Continuer la formation");
      else filSuivant(pg, "Continuer la formation");
    }
    if (depuisDepart && pg !== "point-de-depart.html") { filSuivant("point-de-depart.html", "Mes recommandations"); repriseSecondaire(); }
    else if (MOTEUR) {
      suiteMoteur(); repriseSecondaire();
      window.addEventListener("efa-ici", suiteMoteur); window.addEventListener("hashchange", suiteMoteur);
    }
    else if (SUIVANT[pg]) filSuivant(SUIVANT[pg][0], SUIVANT[pg][1]);
    else if (pg === "parcours.html") filSuivant("parcours.html#" + (et.actif || "P1"), et.actif ? "Reprendre mon module" : "Module 1");
    else if (["point-de-depart.html", "traders.html", "ceo.html", "corporate.html", "demo.html"].indexOf(pg) >= 0) { /* orientation et laboratoires : pas de reprise d’une autre activité */ }
    else if (et.actif && pg !== "programme-organisation.html") filSuivant("parcours.html#" + et.actif, "Reprendre mon module");
    else if (pg !== "programme-organisation.html") filSuivant("parcours.html", "L’école");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", filNav); else filNav();

  var EXCLUS = ["point-de-depart.html", "parcours.html", "diagnostic.html", "confidentialite.html", "merci-guide.html", "rendez-vous.html",
    "organisations.html", "programme-organisation.html", "rejoindre.html", "espace-organisation.html", "admin-ecole.html", "auteur.html", "ely.html", "index.html", "tableau-ely.html"];
  var page = (location.pathname.split("/").pop() || "index").replace(/^([^.]+)$/, "$1.html");
  if (EXCLUS.indexOf(page) >= 0) return;
  // Publications (études, prospective, actualités) : pas de bloc de progression, sauf arrivée depuis un module (?parcours=)
  var PUBLICATIONS = ["methode.html", "news.html", "tribunes.html", "etude-tontine-en-chiffres.html", "africa-2075-fondateur.html", "africa-2075-n1.html", "africa-2075-n2.html", "africa-2075-dossier-1.html"];
  if (PUBLICATIONS.indexOf(page) >= 0 && !/[?&]parcours=/.test(location.search)) return;
  var CARREFOURS = ["outils.html"]; // pages qui regroupent plusieurs outils : carte générique
  var KEY = "efa_parcours_v1";

  function charger(cb) {
    if (window.EFA_PARCOURS) return cb();
    var s = document.createElement("script");
    s.src = "parcours-efa.js?v=2026102512"; s.onload = cb; s.onerror = function () {};
    document.head.appendChild(s);
  }
  function lire() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function base(l) { return (l || "").split("#")[0].split("?")[0] || "index.html"; }
  function nomCourt(id) { var D = window.EFA_PARCOURS, p = null; if (D) { id = (D.fusions || {})[id] || id; D.parcours.forEach(function (x) { if (x.id === id) p = x; }); } return p && p.nom ? p.nom : "Parcours " + id.slice(1); }
  function lienEtape(s, pid) {
    if (!s.lien) return null;
    if (/^https?:/.test(s.lien)) return s.lien;
    var h = s.lien.split("#"), b = h[0], a = h[1] ? "#" + h.slice(1).join("#") : "";
    return b + (b.indexOf("?") < 0 ? "?" : "&") + "parcours=" + pid + a;
  }
  function mesure(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }

  var CSS = ".efa-suite{background:#0B1220;color:#E8EDF5;font-family:\"Source Sans 3\",\"Source Sans Pro\",system-ui,-apple-system,\"Segoe UI\",Arial,sans-serif;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}"
    + ".efa-suite .es-in{max-width:1040px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:24px 40px;align-items:center}"
    + "@media (max-width:760px){.efa-suite .es-in{grid-template-columns:minmax(0,1fr)}}"
    + ".efa-suite .es-sur{display:block;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#F09680}"
    + ".efa-suite h2{font-family:\"Libre Baskerville\",Baskerville,Georgia,\"Times New Roman\",serif;font-weight:700;line-height:1.15;text-transform:none;letter-spacing:-.005em;font-size:clamp(22px,3vw,32px);color:#fff;margin:10px 0 0;text-wrap:balance}"
    + ".efa-suite p{margin:10px 0 0;color:#C9D1DE;font-size:16px;line-height:1.55;max-width:40em}"
    + ".efa-suite .es-barre{height:6px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:16px;max-width:420px}"
    + ".efa-suite .es-barre i{display:block;height:100%;background:#DA3C1B;border-radius:999px}"
    + ".efa-suite .es-prog{font-size:13px;color:#8E98AA;margin-top:6px}"
    + ".efa-suite .es-acts{display:flex;flex-direction:column;align-items:flex-start;gap:12px}"
    + ".efa-suite .es-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:12px 22px;border-radius:8px;border:0;background:#DA3C1B;color:#fff;font:800 16px/1.2 inherit;font-family:inherit;text-decoration:none;cursor:pointer}"
    + ".efa-suite .es-lien{display:inline-flex;align-items:center;min-height:44px;color:#fff;font-weight:700;font-size:15px;text-decoration:underline;text-decoration-color:#E44828;text-decoration-thickness:2px;text-underline-offset:5px;background:none;border:0;padding:0;cursor:pointer;font-family:inherit;text-align:left}"
    + ".efa-suite .es-fait{display:inline-flex;align-items:center;gap:8px;font-size:15px;color:#C9D1DE;cursor:pointer;min-height:44px}"
    + ".efa-suite .es-fait input{width:20px;height:20px;accent-color:#3CCB7F;margin:0}"
    + ".efa-suite .es-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}"
    + ".efa-suite .es-chip{font-size:14px;color:#fff;text-decoration:none;background:#111B2F;border-radius:999px;padding:6px 12px}"
    + ".efa-suite .es-chip b{color:#F09680}"
    + ".efa-suite a:focus-visible,.efa-suite button:focus-visible,.efa-suite input:focus-visible{outline:3px solid #6DB8F2;outline-offset:2px}"
    + ".efa-suite .es-partage{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;padding-top:20px;border-top:1px solid rgba(255,255,255,.12)}"
    + ".efa-suite .es-partage p{margin:0;flex:1 1 260px;font-size:15px;color:#E8EDF5}"
    + ".efa-suite .es-partage p b{color:#fff}"
    + ".efa-suite .es-pb{display:inline-flex;align-items:center;min-height:40px;padding:8px 14px;border-radius:999px;border:0;background:#111B2F;color:#fff;font:700 14px/1.2 inherit;font-family:inherit;cursor:pointer;text-decoration:none}"
    + ".efa-suite .es-pb:hover{background:#1F2C45}"
    + ".efa-suite .es-pb.wa{background:#DA3C1B}"
    + ".efa-suite .es-merci{grid-column:1/-1;background:#DA3C1B;color:#fff;border-radius:12px;padding:16px 18px;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}"
    + ".efa-suite .es-merci p{margin:0;flex:1 1 260px;color:#fff;font-size:16px}"
    + ".efa-suite .es-merci .es-pb{background:#fff;color:#0B1220}"
    + ".efa-suite .es-autres{font-size:13px;color:#8E98AA}.efa-suite .es-autres summary{cursor:pointer;min-height:40px;display:flex;align-items:center}.efa-suite .es-autres a.es-lien{display:inline-block;padding:10px 0}"
    + ".efa-ctx{background:#111B2F;color:#E8EDF5;font-family:\"Source Sans 3\",\"Source Sans Pro\",system-ui,sans-serif;font-size:14.5px;padding:10px max(16px,env(safe-area-inset-left,0px));display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;justify-content:space-between}"
    + ".efa-ctx b{color:#fff}.efa-ctx a{color:#fff;font-weight:800;text-decoration:underline;text-decoration-color:#E44828;text-decoration-thickness:2px;text-underline-offset:4px}"
    + ".efa-ctx .ctx-acts{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}"
    + ".efa-ctx button.ctx-fait{font:800 14.5px \"Source Sans 3\",system-ui,sans-serif;min-height:40px;padding:8px 14px;border-radius:8px;border:0;cursor:pointer;background:#DA3C1B;color:#fff}"
    + ".efa-ctx button.ctx-fait[aria-pressed=true]{background:#3CCB7F;color:#0B1220}"
    + ".efa-ctx a.ctx-suiv{background:#F5EFE2;color:#0B1220;text-decoration:none;padding:8px 14px;border-radius:8px}"
    + "@media print{.efa-suite,.efa-ctx{display:none}}";

  var LIGNE = '<div class="es-partage"><p><b>Ça vous a aidé ?</b> Partagez-le à quelqu’un qui en a besoin : c’est comme ça qu’EFA grandit.</p>'
    + '<button type="button" class="es-pb wa" data-efa-partager="whatsapp">WhatsApp</button>'
    + '<button type="button" class="es-pb" data-efa-partager="facebook">Facebook</button>'
    + '<button type="button" class="es-pb" data-efa-partager="copier">Copier le lien</button>'
    + (navigator.share ? '<button type="button" class="es-pb" data-efa-partager="auto">Autre…</button>' : "")
    + "</div>";
  function placer(html) {
    if (!document.getElementById("efa-suite-css")) { var st = document.createElement("style"); st.id = "efa-suite-css"; st.textContent = CSS; document.head.appendChild(st); }
    var box = document.createElement("aside");
    box.className = "efa-suite"; box.setAttribute("aria-label", "Et ensuite ?");
    box.innerHTML = '<div class="es-in">' + html + LIGNE + "</div>";
    var pied = document.querySelector("footer.efa-foot") || document.querySelector("footer");
    if (pied && pied.parentNode) pied.parentNode.insertBefore(box, pied); else document.body.appendChild(box);
    return box;
  }

  /* La ressource affichée peut changer sans recharger la page (simulateur : D1, D2…) : on recalcule la suite */
  var rendu = false;
  function rendre() {
    var D = window.EFA_PARCOURS; if (!D) return;
    if (rendu) { Array.prototype.forEach.call(document.querySelectorAll(".efa-suite,.efa-ctx"), function (n) { n.parentNode.removeChild(n); }); }
    rendu = true;
    var P = {}; D.parcours.forEach(function (p) { P[p.id] = p; }); var FU = D.fusions || {}; Object.keys(FU).forEach(function (k) { if (P[FU[k]]) P[k] = P[FU[k]]; });
    var etat = lire(); etat.faits = etat.faits || {};
    var q = new URLSearchParams(location.search), voulu = q.get("parcours");

    // Même page, plusieurs étapes (certificat-pilote.html?m=6) : le paramètre m désigne la bonne étape
    var mq = q.get("m");
    // Une étape qui vise une ancre (decider.html#D1) ne correspond qu'à cette ancre quand la page en affiche une
    var hc = location.hash.slice(1);
    function ancre(s) { return (s.lien.split("#")[1] || ""); }
    function ici_(s) { return s.lien && !/^https?:/.test(s.lien) && base(s.lien) === page && (!mq || !/[?&]m=/.test(s.lien) || new RegExp("[?&]m=" + mq + "(&|#|$)").test(s.lien)) && (!hc || !ancre(s) || ancre(s) === hc); }
    var candidats = CARREFOURS.indexOf(page) >= 0 ? [] : D.parcours.filter(function (p) { return p.etapes.some(ici_); });
    if (hc) candidats.sort(function (a, b) { var x = a.etapes.some(function (s) { return ici_(s) && ancre(s) === hc; }), y = b.etapes.some(function (s) { return ici_(s) && ancre(s) === hc; }); return (y ? 1 : 0) - (x ? 1 : 0); });

    // Page hors parcours : proposer d'en choisir un
    if (!candidats.length) {
      placer('<div><span class="es-sur">Et ensuite ?</span><h2>' + (page === "outils.html" ? "Apprenez pas à pas, jusqu’à un résultat." : "Passez de la lecture à l’action.") + '</h2>'
        + '<p>L’école EFA&nbsp;: trois cycles de modules gratuits, qui partent de votre situation et se terminent par une fiche que vous gardez&nbsp;: un budget qui tient, une réserve, une tontine décidée.</p></div>'
        + '<div class="es-acts"><a class="es-btn" href="parcours.html" data-goatcounter-click="suite-generique">Entrer dans l’école</a><a class="es-lien" href="diagnostic.html?src=suite">Ou faire mon diagnostic, 6 min</a></div>');
      return;
    }

    var p = (voulu && P[voulu] && candidats.indexOf(P[voulu]) >= 0) ? P[voulu]
      : (etat.actif && P[etat.actif] && candidats.indexOf(P[etat.actif]) >= 0) ? P[etat.actif]
      : (candidats.filter(function (c) { return c.id !== "P0"; })[0] || candidats[0]);
    if (voulu && voulu === p.id) { etat.actif = p.id; ecrire(etat); }

    // Hors d'un module (arrivée directe, depuis le point de départ ou l'accueil) : pas de progression étrangère à ce que la personne fait
    var dansModule = !!(voulu && voulu === p.id);
    try {
      if (dansModule) sessionStorage.setItem("efa_module", p.id);
      else dansModule = sessionStorage.getItem("efa_module") === p.id || /\/parcours(\.html)?([?#]|$)/.test(document.referrer || "");
    } catch (e) {}
    if (!dansModule) {
      placer('<div><span class="es-sur">Aller plus loin</span><h2>' + esc(p.titre) + '</h2>'
        + '<p>Le module de l’école EFA qui reprend cette méthode pas à pas, avec un cas, un calcul et une fiche à garder. ' + esc(p.objectif) + '</p></div>'
        + '<div class="es-acts"><a class="es-btn" href="parcours.html?src=suite#' + esc(p.id) + '" data-goatcounter-click="suite-decouvrir-' + p.id + '">Découvrir le module</a>'
        + '<a class="es-lien" href="outils.html#cahier">Mon cahier</a></div>');
      return;
    }

    var ici = []; p.etapes.forEach(function (s, i) { if (ici_(s)) ici.push(i); });
    var dernier = ici[ici.length - 1];
    var suivante = null, iSuiv = -1;
    for (var i = dernier + 1; i < p.etapes.length; i++) { if (p.etapes[i].ok && p.etapes[i].lien) { suivante = p.etapes[i]; iSuiv = i; break; } }
    var dispo = p.etapes.filter(function (s) { return s.ok && s.ess; }).length;
    var nbEss = p.etapes.filter(function (s) { return s.ess; }).length;
    function nbFaits() { var n = 0; p.etapes.forEach(function (s, k) { if (s.ok && s.ess && etat.faits[p.id + "." + k]) n++; }); return n; }
    var faitIci = ici.every(function (k) { return etat.faits[p.id + "." + k]; });
    var rang = p.etapes.filter(function (s, k) { return s.ess && k <= ici[0]; }).length || ici[0] + 1;

    var gauche = '<div><span class="es-sur">' + esc(nomCourt(p.id)) + " · " + esc(p.titre) + "</span>";
    if (suivante) {
      gauche += '<h2>Étape suivante : ' + esc(suivante.titre) + "</h2>"
        + "<p>" + (p.etapes[ici[0]].ess ? "Vous êtes à l’étape " + rang + " sur " + nbEss + "." : "Une ressource pour aller plus loin.") + " À l’arrivée : " + esc(p.objectif.charAt(0).toLowerCase() + p.objectif.slice(1)) + "</p>";
    } else {
      gauche += "<h2>Dernière étape en ligne de ce module.</h2>"
        + "<p>Pour savoir que c’est acquis : " + esc(p.preuve.charAt(0).toLowerCase() + p.preuve.slice(1)) + "</p>"
        + '<div class="es-chips">' + p.suite.map(function (id) { return '<a class="es-chip" href="parcours.html#' + id + '"><b>' + (P[id] && P[id].module ? P[id].module : id.slice(1)) + "</b> " + esc(P[id].titre) + "</a>"; }).join("") + "</div>";
    }
    gauche += '<div class="es-barre" aria-hidden="true"><i style="width:' + (dispo ? Math.round(nbFaits() / dispo * 100) : 0) + '%"></i></div><div class="es-prog" id="es-prog">' + nbFaits() + " sur " + dispo + " étapes essentielles faites</div></div>";

    var hrefSuiv = suivante ? lienEtape(suivante, p.id) : null, ext = hrefSuiv && /^https?:/.test(hrefSuiv) ? ' target="_blank" rel="noopener"' : "";
    var droite = '<div class="es-acts">'
      + '<label class="es-fait" for="es-fait"><input type="checkbox" id="es-fait"' + (faitIci ? " checked" : "") + "> J’ai fait cette étape</label>"
      + (suivante ? '<a class="es-btn" href="' + esc(hrefSuiv) + '"' + ext + ' data-goatcounter-click="suite-' + p.id + '">Étape suivante</a>'
                  : '<a class="es-btn" href="parcours.html#' + esc(p.suite[0] || p.id) + '">Module suivant</a>')
      + '<a class="es-lien" href="parcours.html#' + p.id + '">Revenir au module</a>'
      + (candidats.length > 1 && !voulu ? '<details class="es-autres"><summary>Autres usages de cette ressource</summary>' + candidats.filter(function (c) { return c !== p; }).map(function (c) { return '<a class="es-lien" style="font-size:13px" href="?parcours=' + c.id + location.hash + '">' + esc(nomCourt(c.id)) + " · " + esc(c.titre) + "</a>"; }).join("<br>") + "</details>" : "")
      + "</div>";

    var box = placer(gauche + droite);
    if (window.EFA_FIL) { if (hrefSuiv) window.EFA_FIL.suivant(hrefSuiv, "Étape suivante"); else window.EFA_FIL.suivant("parcours.html#" + p.id, "Retour au module"); }
    // Arrivée depuis un module : rappeler où l'on est, avec un retour direct
    if (voulu && voulu === p.id && p.etapes[ici[0]] && p.etapes[ici[0]].ess) {
      var ctx = document.createElement("div"); ctx.className = "efa-ctx"; ctx.setAttribute("role", "note");
      ctx.innerHTML = "<span>Vous êtes dans le <b>" + esc(nomCourt(p.id)) + " · " + esc(p.titre) + "</b>, étape " + rang + " sur " + nbEss + ".</span>"
        + '<span class="ctx-acts"><button type="button" class="ctx-fait" aria-pressed="false"></button><a class="ctx-suiv" hidden' + (hrefSuiv ? ' href="' + esc(hrefSuiv) + '"' + ext : ' href="parcours.html#' + p.id + '"') + '>' + (hrefSuiv ? "Étape suivante →" : "Retour au module →") + '</a><a href="parcours.html#' + p.id + '" data-goatcounter-click="retour-module-' + p.id + '">Revenir au module</a></span>';
      var hd = document.querySelector(".efa-fil") || document.querySelector("header");
      if (hd && hd.parentNode) hd.parentNode.insertBefore(ctx, hd.nextSibling); else document.body.insertBefore(ctx, document.body.firstChild);
      mesure("ressource-ouverte-" + p.id + "-" + rang);
    }
    var cb = box.querySelector("#es-fait");
    // En haut de la page : « Marquer comme fait », puis « Étape suivante », sans descendre en bas de la page
    var bf = document.querySelector(".efa-ctx .ctx-fait"), bs = document.querySelector(".efa-ctx .ctx-suiv");
    function haut() { if (!bf) return; bf.setAttribute("aria-pressed", cb.checked ? "true" : "false"); bf.textContent = cb.checked ? "✓ Étape faite" : "Marquer comme fait"; }
    if (bf) bf.onclick = function () { cb.checked = !cb.checked; cb.dispatchEvent(new Event("change")); };
    haut();
    cb.addEventListener("change", haut);
    cb.addEventListener("change", function () {
      etat = lire(); etat.faits = etat.faits || {};
      ici.forEach(function (k) { if (p.etapes[k].ok) { if (cb.checked) etat.faits[p.id + "." + k] = 1; else delete etat.faits[p.id + "." + k]; } });
      etat.actif = p.id; ecrire(etat);
      var n = nbFaits(); box.querySelector("#es-prog").textContent = n + " sur " + dispo + " étapes essentielles faites";
      box.querySelector(".es-barre i").style.width = (dispo ? Math.round(n / dispo * 100) : 0) + "%";
      if (cb.checked) {
        mesure("suite-fait-" + p.id + "-" + rang);
        var jour = new Date().toISOString().slice(0, 10), dejaVu = null;
        try { dejaVu = localStorage.getItem("efa_partage_rappel"); } catch (e) {}
        if (dejaVu !== jour && !box.querySelector(".es-merci")) {
          try { localStorage.setItem("efa_partage_rappel", jour); } catch (e) {}
          var m = document.createElement("div"); m.className = "es-merci"; m.setAttribute("role", "status");
          m.innerHTML = "<p>Bravo, une étape de plus. Si elle vous a été utile, envoyez-la à un proche : un partage aide plus qu’on ne croit.</p>"
            + '<button type="button" class="es-pb" data-efa-partager="whatsapp">Partager sur WhatsApp</button>';
          box.querySelector(".es-in").insertBefore(m, box.querySelector(".es-partage"));
        }
      }
    });
  }
  charger(rendre);
  window.addEventListener("efa-ici", function () { if (window.EFA_PARCOURS) rendre(); });
  window.addEventListener("hashchange", function () { if (window.EFA_PARCOURS && rendu) rendre(); });
})();

/* EFA Patrimoine : charte vert profond et or sur tout le parcours (classe « efa-vert » sur <html>) */
(function(){
  if(document.getElementById("efa-vert-css"))return;
  var st=document.createElement("style");st.id="efa-vert-css";
  st.textContent="html.efa-vert .top,html.efa-vert .efa-nav{background:#0F2E2A;border-bottom-color:#163E38}"
    +"html.efa-vert .nav a.nav-cta,html.efa-vert .efa-nav a.efa-nav-p{background:#C9A35C;color:#0F2E2A}"
    +"@media (max-width:900px){html.efa-vert .nav{background:#0F2E2A}html.efa-vert .nav a.nav-cta{background:none;color:#E2C893}}"
    +"html.efa-vert .efa-fil{background:#F6F1E6;border-bottom-color:#E4DCC9}"
    +"html.efa-vert .efa-fil a.fil-p{background:#0F2E2A;color:#fff}"
    +"html.efa-vert .efa-fil a.fil-s{background:#C9A35C;color:#0F2E2A}"
    +"html.efa-vert .efa-suite .es-btn,html.efa-vert .efa-suite .es-pb.wa,html.efa-vert .efa-suite .es-merci,html.efa-vert .efa-ctx button.ctx-fait{background:#C9A35C;color:#0F2E2A}"
    +"html.efa-vert .efa-suite .es-barre i{background:#C9A35C}"
    +"html.efa-vert .efa-suite .es-lien,html.efa-vert .efa-ctx a{text-decoration-color:#C9A35C}"
    +"html.efa-vert footer.efa-foot{background:#0B231F;border-top-color:rgba(201,163,92,.25)}html.efa-vert .efa-foot .ef-cta{background:#C9A35C;color:#0F2E2A}";
  (document.head||document.documentElement).appendChild(st);
})();
