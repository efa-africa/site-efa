/* EFA · « Garder ma fiche » : ce que la personne garde à la fin d'un calcul.
   Chargé par efa-appli.js sur toutes les pages. S'affiche sous le premier résultat (.res[aria-live]) dès qu'il apparaît.
   La fiche reprend le résultat affiché ; la personne y ajoute sa décision, puis la garde :
   dans Mon cahier (localStorage « efa_parcours_v1 », clé fiches), par copie, WhatsApp ou email. Rien n'est envoyé à EFA. */
(function () {
  "use strict";
  try { if (window.self !== window.top) return; } catch (e) { return; }
  if (window.__efaFiche) return; window.__efaFiche = 1;
  var page = (location.pathname.split("/").pop() || "index.html");
  // Pages qui ont déjà leur propre fiche, ou qui ne sont pas des outils de calcul
  var EXCLUS = ["index.html", "outils.html", "parcours.html", "diagnostic.html", "construire-son-budget.html",
    "preter-a-un-proche.html", "budget-mobile-money.html", "ou-est-passe-mon-argent.html", "preparer-ma-retraite.html", "ely.html"];
  if (EXCLUS.indexOf(page) >= 0) return;
  var KEY = "efa_parcours_v1";

  function lire() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } }
  function compter(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function jour(d) { return d.toISOString().slice(0, 10); }
  function dans30() { var d = new Date(); d.setDate(d.getDate() + 30); return jour(d); }
  function dateFr() { try { return new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return jour(new Date()); } }

  // Le module dont cette page est la fiche de fin (données des parcours, si chargées)
  function module() {
    var D = window.EFA_PARCOURS; if (!D) return null;
    var q = new URLSearchParams(location.search).get("parcours"), r = null;
    D.parcours.forEach(function (p) {
      if (!p.fiche) return;
      var f = p.fiche.lien.split("?")[0].split("#")[0];
      if (f === page && (!r || p.id === q)) r = p;
    });
    return r;
  }
  function titrePage() {
    var h = document.querySelector("h1"); var t = h ? h.textContent : document.title;
    return t.replace(/\s+/g, " ").replace(/\s*·\s*EFA\s*$/, "").trim();
  }
  function texteResultat(el) {
    var t = (el.innerText || el.textContent || "").replace(/\t+/g, " : ").replace(/[ ]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{2,}/g, "\n").replace(/^ ?: /gm, "").trim();
    return t.length > 900 ? t.slice(0, 900).replace(/\s+\S*$/, "") + "…" : t;
  }

  var CSS = ".efa-fiche{background:#0B1220;color:#E8EDF5;border-radius:14px;padding:20px 20px 18px;margin:18px 0 6px;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif}"
    + ".efa-fiche .ff-sur{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#F09680;margin:0 0 6px}"
    + ".efa-fiche h2{font-family:'Libre Baskerville',Georgia,serif;font-weight:700;font-size:clamp(20px,2.4vw,24px);line-height:1.18;margin:0 0 6px;color:#fff}"
    + ".efa-fiche p{margin:0 0 12px;font-size:15px;line-height:1.5;color:#C9D1DE}"
    + ".efa-fiche label{display:block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#C9D1DE;margin:0 0 6px}"
    + ".efa-fiche textarea{box-sizing:border-box;width:100%;min-height:150px;border:0;border-radius:8px;padding:12px;font:inherit;font-size:15px;line-height:1.45;background:#FFFDF8;color:#2A3142;resize:vertical}"
    + ".efa-fiche textarea:focus{outline:3px solid #6DB8F2;outline-offset:2px}"
    + ".efa-fiche .ff-acts{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}"
    + ".efa-fiche button{font:inherit;font-size:15px;font-weight:800;min-height:44px;padding:10px 16px;border-radius:8px;border:0;cursor:pointer;background:#F5EFE2;color:#0B1220}"
    + ".efa-fiche button.ff-p{background:#E44828;color:#fff}"
    + ".efa-fiche .ff-ok{min-height:1.4em;margin:10px 0 0;font-weight:700;color:#3CCB7F}"
    + ".efa-fiche .ff-ok a{color:#6DB8F2;font-weight:700}"
    + "@media (max-width:480px){.efa-fiche .ff-acts button{flex:1 1 calc(50% - 10px)}}";

  var boite = null, zone = null, modif = false, res = null, M = null;

  function contenu() {
    var titre = M ? M.fiche.titre : "Ma fiche · " + titrePage();
    var l = ["Ma fiche EFA · " + (M ? M.fiche.titre : titrePage()), dateFr(), "", texteResultat(res), "", "Ma décision : ", "", "Calcul fait sur " + location.origin.replace(/^https?:\/\//, "") + "/" + page + " · éducation financière, pas conseil en placement."];
    return l.join("\n");
  }
  function message(t) { var o = boite.querySelector(".ff-ok"); o.innerHTML = t; }
  function garder() {
    var st = lire(), t = zone.value.trim().slice(0, 1500), d = jour(new Date());
    st.fiches = st.fiches || {};
    st.fiches[page] = { titre: M ? M.fiche.titre : titrePage(), t: t, d: d, url: page + (M ? "?parcours=" + M.id : "") };
    if (M) {
      st.preuves = st.preuves || {};
      var anc = st.preuves[M.id];
      st.preuves[M.id] = { t: t.slice(0, 600), d: d, r: anc && anc.r ? anc.r : dans30(), bilan: anc ? anc.bilan : null };
    }
    if (ecrire(st)) { message('Fiche gardée sur ce téléphone. <a href="outils.html#cahier">Ouvrir Mon cahier</a>'); compter("fiche-garder-" + page); }
    else message("Ce navigateur ne permet pas de garder la fiche : copiez-la ou envoyez-la-vous.");
  }
  function copier() {
    var t = zone.value, ok = function () { message("Fiche copiée : collez-la dans vos notes."); compter("fiche-copier-" + page); };
    try { navigator.clipboard.writeText(t).then(ok, function () { zone.select(); document.execCommand("copy"); ok(); }); }
    catch (e) { zone.select(); try { document.execCommand("copy"); ok(); } catch (x) {} }
  }
  function construire() {
    if (boite || !res) return;
    M = module();
    var s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);
    boite = document.createElement("section"); boite.className = "efa-fiche"; boite.setAttribute("aria-label", "Garder ma fiche");
    boite.innerHTML = '<p class="ff-sur">Garder ma fiche</p><h2></h2><p>Votre résultat est repris ci-dessous. Ajoutez votre décision, puis gardez la fiche : elle reste sur ce téléphone, rien n’est envoyé à EFA.</p>'
      + '<label for="ff-t">Ma fiche</label><textarea id="ff-t" rows="8" maxlength="1500"></textarea>'
      + '<div class="ff-acts"><button type="button" class="ff-p" data-ff="garder">Garder dans Mon cahier</button><button type="button" data-ff="whatsapp">Envoyer par WhatsApp</button><button type="button" data-ff="copier">Copier</button><button type="button" data-ff="email">M’envoyer par email</button></div>'
      + '<p class="ff-ok" role="status" aria-live="polite"></p>';
    boite.querySelector("h2").textContent = M ? M.fiche.titre : "Ce que vous retenez de ce calcul";
    zone = boite.querySelector("textarea");
    zone.addEventListener("input", function () { modif = true; });
    var anc = (lire().fiches || {})[page];
    if (anc && anc.t) { zone.value = anc.t; modif = true; } else zone.value = contenu();
    res.parentNode.insertBefore(boite, res.nextSibling);
    boite.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-ff]"); if (!b) return;
      var a = b.getAttribute("data-ff");
      if (a === "garder") garder();
      else if (a === "copier") copier();
      else if (a === "whatsapp") { compter("fiche-whatsapp-" + page); window.open("https://wa.me/?text=" + encodeURIComponent(zone.value), "_blank", "noopener"); }
      else if (a === "email") { compter("fiche-email-" + page); location.href = "mailto:?subject=" + encodeURIComponent("Ma fiche EFA · " + (M ? M.fiche.titre : titrePage())) + "&body=" + encodeURIComponent(zone.value); }
    });
  }
  function rafraichir() { if (boite && !modif) zone.value = contenu(); }
  function visible(el) { return !el.hidden && el.offsetParent !== null && (el.textContent || "").trim().length > 0; }

  function demarrer() {
    var cands = Array.prototype.slice.call(document.querySelectorAll(".res[aria-live], [data-efa-resultat]"));
    if (!cands.length) return;
    function verifier() {
      if (!res) { for (var i = 0; i < cands.length; i++) if (visible(cands[i])) { res = cands[i]; break; } }
      if (res && !boite) construire(); else if (res) rafraichir();
    }
    var t = null;
    var mo = new MutationObserver(function (muts) {
      if (muts.every(function (m) { return boite && boite.contains(m.target); })) return;
      clearTimeout(t); t = setTimeout(verifier, 150);
    });
    cands.forEach(function (c) { mo.observe(c, { attributes: true, attributeFilter: ["hidden", "class", "style"], childList: true, subtree: true, characterData: true }); });
    verifier();
  }
  // Les données des parcours servent à nommer la fiche du module ; on les charge si la page ne l'a pas fait.
  function charger(cb) {
    if (window.EFA_PARCOURS) return cb();
    var s = document.createElement("script"); s.src = "parcours-efa.js?v=2026102502"; s.onload = cb; s.onerror = cb; document.head.appendChild(s);
  }
  function go() { charger(demarrer); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
