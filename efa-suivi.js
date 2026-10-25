/* EFA · Suivi des décisions à 7 et 30 jours
   Chargé sur toutes les pages par efa-appli.js.
   - EFA_SUIVI.planifier({id, titre, action, lien}) : enregistre une action choisie, avec un rappel à 7 jours puis à 30 jours.
   - À chaque visite, si un rappel est dû, une petite carte demande : « Avez-vous essayé ? » puis, si besoin, « Qu'est-ce qui vous a bloqué ? ».
   - Tout reste sur le téléphone (localStorage « efa_suivi_v1 »). Rien n'est envoyé à EFA, sauf un comptage anonyme (GoatCounter)
     et, pour un participant d'un programme d'organisation, des totaux sans texte (voir efa-compte.js : bilan). */
(function () {
  "use strict";
  if (window.EFA_SUIVI) return;
  var CLE = "efa_suivi_v1", JOUR = 864e5;
  var BLOCAGES = [["temps", "Pas eu le temps"], ["argent", "Pas l’argent ce mois-ci"], ["famille", "Une demande de la famille"], ["oubli", "J’ai oublié"], ["comment", "Je ne savais pas comment faire"]];
  function lire() { try { var v = JSON.parse(localStorage.getItem(CLE) || "null"); return v && v.items ? v : { items: [] }; } catch (e) { return { items: [] }; } }
  function ecrire(v) { try { localStorage.setItem(CLE, JSON.stringify(v)); } catch (e) {} }
  function compte(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[<>&"]/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]; }); }
  function jourFr(t) { try { return new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }); } catch (e) { return ""; } }

  function planifier(o) {
    if (!o || !o.id || !o.action) return null;
    var v = lire(), now = Date.now();
    v.items = v.items.filter(function (x) { return x.id !== o.id; });
    var it = { id: String(o.id).slice(0, 40), titre: String(o.titre || "").slice(0, 120), action: String(o.action).slice(0, 200), lien: o.lien || location.pathname.split("/").pop() + location.hash, cree: now, j7: now + 7 * JOUR, j30: now + 30 * JOUR, r7: null, r30: null, b7: null, b30: null, report: 0 };
    v.items.push(it); v.items = v.items.slice(-30); ecrire(v);
    compte("suivi-planifie-" + it.id);
    return it;
  }
  function du(it, now) {
    if (it.report && it.report > now) return null;
    if (!it.r7 && now >= it.j7) return "7";
    if (it.r7 && !it.r30 && now >= it.j30) return "30";
    return null;
  }
  function bilan() { // totaux sans texte, pour le compte d'un programme d'organisation
    var v = lire(), b = { planifies: v.items.length, essaye: 0, partiel: 0, pas: 0 };
    v.items.forEach(function (x) { var r = x.r30 || x.r7; if (r === "oui") b.essaye++; else if (r === "partiel") b.partiel++; else if (r === "non") b.pas++; });
    return b;
  }

  function carte(it, quand) {
    if (document.getElementById("efa-suivi")) return;
    var d = document.createElement("aside"); d.id = "efa-suivi"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Votre suivi EFA");
    var st = document.createElement("style");
    st.textContent = "#efa-suivi{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:min(380px,calc(100vw - 24px));background:#13203A;border:1px solid #2E4366;color:#E8EDF5;border-radius:14px;box-shadow:0 18px 40px rgba(0,0,0,.4);padding:16px 16px 14px;font:400 15px/1.45 'Source Sans 3','Source Sans Pro',system-ui,sans-serif}"
      + "#efa-suivi .k{font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#F09680;margin:0 0 4px}"
      + "#efa-suivi .q{font-family:'Libre Baskerville',Georgia,serif;font-weight:700;font-size:17px;line-height:1.3;color:#fff;margin:0 0 6px}"
      + "#efa-suivi .a{margin:0 0 10px;color:#C9D1DE}#efa-suivi .a b{color:#fff}"
      + "#efa-suivi .b{display:flex;flex-wrap:wrap;gap:8px}#efa-suivi button{font:800 14.5px/1.1 'Source Sans 3',system-ui,sans-serif;border:0;border-radius:8px;padding:10px 13px;cursor:pointer;background:#1A2740;color:#fff}"
      + "#efa-suivi button.p{background:#E44828}#efa-suivi button.l{background:none;color:#9FB0C8;text-decoration:underline;padding:10px 4px}"
      + "#efa-suivi button:focus-visible{outline:2px solid #6DB8F2;outline-offset:2px}#efa-suivi .x{position:absolute;top:6px;right:8px;background:none;color:#9FB0C8;font-size:20px;padding:6px 8px}"
      + "#efa-suivi a{color:#6DB8F2;font-weight:700}";
    d.appendChild(st);
    var corps = document.createElement("div"); d.appendChild(corps);
    function fermer() { d.remove(); }
    function etape1() {
      corps.innerHTML = '<button class="x" type="button" aria-label="Fermer">×</button><p class="k">Votre suivi · ' + quand + ' jours</p><p class="q">Avez-vous pu essayer&nbsp;?</p>'
        + '<p class="a">Le ' + jourFr(it.cree) + ', après « ' + esc(it.titre) + ' », vous aviez choisi&nbsp;: <b>' + esc(it.action) + '</b></p>'
        + '<div class="b"><button class="p" type="button" data-r="oui">Oui</button><button type="button" data-r="partiel">En partie</button><button type="button" data-r="non">Pas encore</button><button class="l" type="button" data-r="plus-tard">Plus tard</button></div>';
    }
    function etape2(r) {
      corps.innerHTML = '<button class="x" type="button" aria-label="Fermer">×</button><p class="k">Votre suivi</p><p class="q">Qu’est-ce qui vous a bloqué&nbsp;?</p><p class="a">Une réponse, pour que nous améliorions les contenus. Elle reste anonyme.</p>'
        + '<div class="b">' + BLOCAGES.map(function (x) { return '<button type="button" data-bl="' + x[0] + '">' + x[1] + '</button>'; }).join("") + '</div>';
      corps.dataset.r = r;
    }
    function merci(r) {
      var t = r === "oui" ? "Bravo. C’est en essayant qu’on change ses habitudes." : "Merci. Un petit pas suffit : réessayez cette semaine, avec une action plus petite si besoin.";
      corps.innerHTML = '<button class="x" type="button" aria-label="Fermer">×</button><p class="k">Votre suivi</p><p class="q">' + t + '</p>'
        + (quand === "7" ? '<p class="a">Nous vous redemanderons le ' + jourFr(it.j30) + '.</p>' : '')
        + '<p class="a"><a href="' + esc(it.lien) + '">Revoir la décision →</a></p>';
      setTimeout(fermer, 9000);
    }
    function enregistrer(r, bl) {
      var v = lire(), x = v.items.filter(function (y) { return y.id === it.id; })[0]; if (!x) return;
      if (quand === "7") { x.r7 = r; x.b7 = bl || null; } else { x.r30 = r; x.b30 = bl || null; }
      x.report = 0; ecrire(v); it = x;
      compte("suivi-j" + quand + "-" + r); if (bl) compte("suivi-blocage-" + bl);
      try { if (window.EFA_ECOLE && window.EFA_ECOLE.synchroniser) window.EFA_ECOLE.synchroniser(true); } catch (e) {}
    }
    corps.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.classList.contains("x")) { reporter(1); fermer(); return; }
      var r = b.getAttribute("data-r"), bl = b.getAttribute("data-bl");
      if (r === "plus-tard") { reporter(2); compte("suivi-plus-tard"); fermer(); return; }
      if (r === "oui") { enregistrer("oui"); merci("oui"); return; }
      if (r) { etape2(r); return; }
      if (bl) { var rr = corps.dataset.r; enregistrer(rr, bl); merci(rr); }
    });
    function reporter(j) { var v = lire(), x = v.items.filter(function (y) { return y.id === it.id; })[0]; if (x) { x.report = Date.now() + j * JOUR; ecrire(v); } }
    etape1(); document.body.appendChild(d);
    compte("suivi-affiche-j" + quand);
  }

  function verifier() {
    var page = location.pathname.split("/").pop() || "index.html";
    if (/^(espace-organisation|admin-ecole|rejoindre)\.html$/.test(page)) return;
    var v = lire(), now = Date.now();
    for (var i = 0; i < v.items.length; i++) { var q = du(v.items[i], now); if (q) { var it = v.items[i]; setTimeout(function () { carte(it, q); }, 4000); return; } }
  }

  window.EFA_SUIVI = { planifier: planifier, liste: function () { return lire().items; }, bilan: bilan, BLOCAGES: BLOCAGES };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", verifier); else verifier();
})();
