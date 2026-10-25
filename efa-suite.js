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
    var p = (location.pathname.split("/").pop() || "index.html");
    var st = document.createElement("style");
    st.textContent = ".efa-nav{position:relative;z-index:50;align-self:stretch;width:100%;max-width:100vw;box-sizing:border-box;flex:none;background:#0B1220;color:#fff;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif;border-bottom:1px solid #1F2C45}"
      + ".efa-nav-in{max-width:min(1120px,100vw);box-sizing:border-box;margin:0 auto;display:flex;align-items:center;gap:4px 6px;padding:6px max(12px,env(safe-area-inset-left,0px));overflow-x:auto;scrollbar-width:none;white-space:nowrap}"
      + ".efa-nav-in::-webkit-scrollbar{display:none}"
      + ".efa-nav a{color:#E8EDF5;text-decoration:none;font-size:14px;font-weight:700;padding:7px 10px;border-radius:8px;flex:0 0 auto}"
      + ".efa-nav a:hover{background:rgba(255,255,255,.1)}"
      + ".efa-nav a.efa-nav-logo{display:flex;align-items:center;gap:8px;padding:4px 8px 4px 0;font-size:11px;letter-spacing:.16em}"
      + ".efa-nav a.efa-nav-logo img{width:26px;height:26px}"
      + ".efa-nav a.efa-nav-p{background:#E44828;color:#fff}"
      + ".efa-nav a[aria-current]{box-shadow:inset 0 -2px 0 #E44828}"
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

  var EXCLUS = ["parcours.html", "diagnostic.html", "confidentialite.html", "merci-guide.html", "rendez-vous.html",
    "organisations.html", "programme-organisation.html", "rejoindre.html", "espace-organisation.html", "admin-ecole.html", "auteur.html", "ely.html", "index.html", "tableau-ely.html"];
  var page = (location.pathname.split("/").pop() || "index.html");
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
    + ".efa-suite .es-barre i{display:block;height:100%;background:#E44828;border-radius:999px}"
    + ".efa-suite .es-prog{font-size:13px;color:#8E98AA;margin-top:6px}"
    + ".efa-suite .es-acts{display:flex;flex-direction:column;align-items:flex-start;gap:12px}"
    + ".efa-suite .es-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:12px 22px;border-radius:8px;border:0;background:#E44828;color:#fff;font:800 16px/1.2 inherit;font-family:inherit;text-decoration:none;cursor:pointer}"
    + ".efa-suite .es-lien{color:#fff;font-weight:700;font-size:15px;text-decoration:underline;text-decoration-color:#E44828;text-decoration-thickness:2px;text-underline-offset:5px;background:none;border:0;padding:0;cursor:pointer;font-family:inherit;text-align:left}"
    + ".efa-suite .es-fait{display:inline-flex;align-items:center;gap:8px;font-size:15px;color:#C9D1DE;cursor:pointer}"
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
    + ".efa-suite .es-pb.wa{background:#E44828}"
    + ".efa-suite .es-merci{grid-column:1/-1;background:#E44828;color:#fff;border-radius:12px;padding:16px 18px;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}"
    + ".efa-suite .es-merci p{margin:0;flex:1 1 260px;color:#fff;font-size:16px}"
    + ".efa-suite .es-merci .es-pb{background:#fff;color:#0B1220}"
    + ".efa-suite .es-autres{font-size:13px;color:#8E98AA}.efa-suite .es-autres summary{cursor:pointer}"
    + ".efa-ctx{background:#111B2F;color:#E8EDF5;font-family:\"Source Sans 3\",\"Source Sans Pro\",system-ui,sans-serif;font-size:14.5px;padding:10px max(16px,env(safe-area-inset-left,0px));display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;justify-content:space-between}"
    + ".efa-ctx b{color:#fff}.efa-ctx a{color:#fff;font-weight:800;text-decoration:underline;text-decoration-color:#E44828;text-decoration-thickness:2px;text-underline-offset:4px}"
    + ".efa-ctx .ctx-acts{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}"
    + ".efa-ctx button.ctx-fait{font:800 14.5px \"Source Sans 3\",system-ui,sans-serif;min-height:40px;padding:8px 14px;border-radius:8px;border:0;cursor:pointer;background:#E44828;color:#fff}"
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
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var box = document.createElement("aside");
    box.className = "efa-suite"; box.setAttribute("aria-label", "Et ensuite ?");
    box.innerHTML = '<div class="es-in">' + html + LIGNE + "</div>";
    var pied = document.querySelector("footer.efa-foot") || document.querySelector("footer");
    if (pied && pied.parentNode) pied.parentNode.insertBefore(box, pied); else document.body.appendChild(box);
    return box;
  }

  charger(function () {
    var D = window.EFA_PARCOURS; if (!D) return;
    var P = {}; D.parcours.forEach(function (p) { P[p.id] = p; }); var FU = D.fusions || {}; Object.keys(FU).forEach(function (k) { if (P[FU[k]]) P[k] = P[FU[k]]; });
    var etat = lire(); etat.faits = etat.faits || {};
    var q = new URLSearchParams(location.search), voulu = q.get("parcours");

    // Même page, plusieurs étapes (certificat-pilote.html?m=6) : le paramètre m désigne la bonne étape
    var mq = q.get("m");
    function ici_(s) { return s.lien && !/^https?:/.test(s.lien) && base(s.lien) === page && (!mq || !/[?&]m=/.test(s.lien) || new RegExp("[?&]m=" + mq + "(&|#|$)").test(s.lien)); }
    var candidats = CARREFOURS.indexOf(page) >= 0 ? [] : D.parcours.filter(function (p) { return p.etapes.some(ici_); });

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
    // Arrivée depuis un module : rappeler où l'on est, avec un retour direct
    if (voulu && voulu === p.id && p.etapes[ici[0]] && p.etapes[ici[0]].ess) {
      var ctx = document.createElement("div"); ctx.className = "efa-ctx"; ctx.setAttribute("role", "note");
      ctx.innerHTML = "<span>Vous êtes dans le <b>" + esc(nomCourt(p.id)) + " · " + esc(p.titre) + "</b>, étape " + rang + " sur " + nbEss + ".</span>"
        + '<span class="ctx-acts"><button type="button" class="ctx-fait" aria-pressed="false"></button><a class="ctx-suiv" hidden' + (hrefSuiv ? ' href="' + esc(hrefSuiv) + '"' + ext : ' href="parcours.html#' + p.id + '"') + '>' + (hrefSuiv ? "Étape suivante →" : "Retour au module →") + '</a><a href="parcours.html#' + p.id + '" data-goatcounter-click="retour-module-' + p.id + '">Revenir au module</a></span>';
      var hd = document.querySelector("header");
      if (hd && hd.parentNode) hd.parentNode.insertBefore(ctx, hd.nextSibling); else document.body.insertBefore(ctx, document.body.firstChild);
      mesure("ressource-ouverte-" + p.id + "-" + rang);
    }
    var cb = box.querySelector("#es-fait");
    // En haut de la page : « Marquer comme fait », puis « Étape suivante », sans descendre en bas de la page
    var bf = document.querySelector(".efa-ctx .ctx-fait"), bs = document.querySelector(".efa-ctx .ctx-suiv");
    function haut() { if (!bf) return; bf.setAttribute("aria-pressed", cb.checked ? "true" : "false"); bf.textContent = cb.checked ? "✓ Étape faite" : "Marquer comme fait"; if (bs) bs.hidden = !cb.checked; }
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
  });
})();
