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
    + ".efa-fiche button.ff-p{background:#DA3C1B;color:#fff}"
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
    if (ecrire(st)) { message('Fiche gardée sur ce téléphone. <a href="outils.html#cahier">Ouvrir Mon cahier</a>'); compter("fiche-garder-" + page); proposerCompte(); }
    else message("Ce navigateur ne permet pas de garder la fiche : copiez-la ou envoyez-la-vous.");
  }
  /* Après la première fiche gardée : proposer de garder sa progression (compte Communauté EFA)
     et, sur demande, de recevoir chaque semaine sa prochaine étape (liste Newsletter EFA, double confirmation). */
  var BREVO_NL = "https://b46b1615.sibforms.com/serve/MUIFAKh7190-xVONttcMGx9z5uLhlcS3Knrj0HOrhpnsbgPHCoa1GSLsbsCmk1lvMWF8o_An6q6BYBz85koQiVVRpHhage71-PdxWrT1OFhCY5iidi-UIq-C34WPbWb-FGUjhGa5kXw3NytB242VM_LTd9sbakiFejMRUqseZNiyuN8LB_U_cvRkJ7v0E1SyaD-_RVTlQfAI7JLVRw";
  var CSS_C = ".efa-cpt{background:#FFFDF8;color:#2A3142;border-radius:14px;padding:20px 22px;margin:10px 0 6px;display:flex;flex-direction:column;gap:12px;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif}"
    + ".efa-cpt .c-s{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#B8341A;margin:0}"
    + ".efa-cpt h3{font-family:'Libre Baskerville',Georgia,serif;font-weight:700;font-size:clamp(19px,2.2vw,23px);line-height:1.18;margin:0;color:#0B1220}"
    + ".efa-cpt p{margin:0;font-size:15.5px;line-height:1.5;color:#4E5566}"
    + ".efa-cpt .c-g{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}@media (max-width:520px){.efa-cpt .c-g{grid-template-columns:minmax(0,1fr)}}"
    + ".efa-cpt label.c-f{display:flex;flex-direction:column;gap:4px;font-size:14px;font-weight:700;color:#0B1220}"
    + ".efa-cpt input[type=text],.efa-cpt input[type=email]{font:inherit;font-weight:400;font-size:17px;padding:11px 12px;border-radius:8px;border:0;background:#F5EFE2;color:#0B1220;width:100%;box-sizing:border-box;min-width:0}"
    + ".efa-cpt input:focus-visible,.efa-cpt button:focus-visible{outline:3px solid #1B71B2;outline-offset:2px}"
    + ".efa-cpt label.c-c{display:flex;gap:10px;align-items:flex-start;font-size:15px;color:#2A3142}.efa-cpt label.c-c input{width:20px;height:20px;margin:2px 0 0;accent-color:#DA3C1B;flex:none}"
    + ".efa-cpt .c-a{display:flex;flex-wrap:wrap;gap:10px;align-items:center}"
    + ".efa-cpt button{font:inherit;font-size:15.5px;font-weight:800;min-height:46px;padding:11px 20px;border-radius:8px;border:0;cursor:pointer;background:#DA3C1B;color:#fff}"
    + ".efa-cpt button.c-l{background:none;color:#0B1220;padding:8px 4px;text-decoration:underline;text-decoration-color:#DA3C1B;text-decoration-thickness:2px;text-underline-offset:4px}"
    + ".efa-cpt .c-k{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:clamp(18px,4vw,24px);font-weight:700;letter-spacing:.06em;background:#0B1220;color:#fff;border-radius:10px;padding:14px 16px;word-break:break-all}"
    + ".efa-cpt .c-m{min-height:1.3em;font-weight:700;color:#0B1220}.efa-cpt .c-m.err{color:#B3261E}";
  function plusTard() { try { var d = localStorage.getItem("efa_compte_plus_tard"); return d && d > jour(new Date()); } catch (e) { return false; } }
  function proposerCompte() {
    var E = window.EFA_ECOLE;
    if (!E || !E.rejoindre || !E.CODE_COMMUNAUTE || (E.compte && E.compte()) || plusTard() || document.querySelector(".efa-cpt")) return;
    if (!document.getElementById("efa-cpt-css")) { var st = document.createElement("style"); st.id = "efa-cpt-css"; st.textContent = CSS_C; document.head.appendChild(st); }
    var c = document.createElement("section"); c.className = "efa-cpt"; c.setAttribute("aria-label", "Garder ma progression");
    c.innerHTML = '<p class="c-s">Ne perdez pas ce que vous avez fait</p><h3>Gardez votre progression sur tous vos téléphones</h3>'
      + '<p>Créez votre compte gratuit dans la Communauté EFA : vos étapes et vos modules terminés sont enregistrés. Jamais vos montants, ni le texte de vos fiches.</p>'
      + '<div class="c-g"><label class="c-f" for="c-nom">Prénom<input id="c-nom" type="text" autocomplete="given-name" maxlength="40"></label><label class="c-f" for="c-mail">Email<input id="c-mail" type="email" autocomplete="email" inputmode="email" maxlength="120" placeholder="vous@exemple.com"></label></div>'
      + '<label class="c-c" for="c-nl"><input id="c-nl" type="checkbox"><span>Je veux recevoir la lettre EFA par email : conseils, nouveaux modules et rappels pour avancer. Un email de confirmation va arriver.</span></label>'
      + '<p style="font-size:13.5px">En créant le compte, j’accepte que mon prénom, mon email et ma progression soient conservés par EFA. <a href="confidentialite.html#communaute" style="color:#0B1220;font-weight:700">Vos données</a></p>'
      + '<div class="c-a"><button type="button" data-c="creer">Créer mon compte</button><button type="button" class="c-l" data-c="tard">Plus tard</button></div><p class="c-m" role="status" aria-live="polite"></p>';
    boite.parentNode.insertBefore(c, boite.nextSibling);
    compter("compte-propose-" + page);
    var m = c.querySelector(".c-m");
    c.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-c]"); if (!b) return;
      var a = b.getAttribute("data-c");
      if (a === "tard") { var d = new Date(); d.setDate(d.getDate() + 7); try { localStorage.setItem("efa_compte_plus_tard", jour(d)); } catch (x) {} compter("compte-plus-tard"); c.remove(); return; }
      if (a === "copier") { var k = c.querySelector(".c-k").textContent; try { navigator.clipboard.writeText(k).then(function () { m.textContent = "Clé copiée."; }, function () {}); } catch (x) {} return; }
      if (a === "wa") { window.open("https://wa.me/?text=" + encodeURIComponent("Ma clé EFA (à garder) : " + c.querySelector(".c-k").textContent + " · efa.africa/rejoindre.html"), "_blank", "noopener"); return; }
      if (a !== "creer") return;
      var nom = c.querySelector("#c-nom").value.trim(), mail = c.querySelector("#c-mail").value.trim(), nl = c.querySelector("#c-nl").checked;
      m.className = "c-m";
      if (nom.length < 2) { m.className = "c-m err"; m.textContent = "Indiquez votre prénom."; c.querySelector("#c-nom").focus(); return; }
      if (mail && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(mail)) { m.className = "c-m err"; m.textContent = "Cet email ne semble pas complet."; c.querySelector("#c-mail").focus(); return; }
      if (nl && !mail) { m.className = "c-m err"; m.textContent = "Indiquez votre email pour recevoir la lettre EFA."; c.querySelector("#c-mail").focus(); return; }
      b.disabled = true; m.textContent = "Création du compte…";
      E.rejoindre(E.CODE_COMMUNAUTE, nom, mail).then(function (j) {
        compter("compte-cree-fiche");
        if (nl && mail) {
          var fd = new FormData(); fd.append("EMAIL", mail); fd.append("email_address_check", ""); fd.append("locale", "fr");
          try { fetch(BREVO_NL, { method: "POST", body: fd, mode: "no-cors" }); compter("email-ecole-" + page); } catch (x) {}
        }
        c.innerHTML = '<p class="c-s">Compte créé</p><h3>Notez votre clé personnelle</h3><p>Elle vous permet de retrouver votre progression sur un autre téléphone, depuis « Mon compte ». Elle ne sera plus affichée en entier.</p>'
          + '<div class="c-k"></div><div class="c-a"><button type="button" data-c="wa">Me l’envoyer par WhatsApp</button><button type="button" class="c-l" data-c="copier">Copier</button></div>'
          + (nl && mail ? '<p><b>Dernière étape :</b> confirmez votre email avec le lien que vous venez de recevoir. Sans ce clic, rien ne vous sera envoyé.</p>' : '')
          + '<p class="c-m" role="status" aria-live="polite"></p>';
        c.querySelector(".c-k").textContent = j.cle_personnelle || ""; m = c.querySelector(".c-m");
      }, function (err) { b.disabled = false; m.className = "c-m err"; m.textContent = err.message || "Le compte n’a pas pu être créé. Réessayez dans un instant."; });
    });
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
    var s = document.createElement("script"); s.src = "parcours-efa.js?v=2026102512"; s.onload = cb; s.onerror = cb; document.head.appendChild(s);
  }
  function go() { charger(demarrer); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
