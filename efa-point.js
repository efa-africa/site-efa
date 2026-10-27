/* EFA · Mon point : trois questions en oui ou non, au départ, à 30 jours et à 90 jours.
   C'est la preuve que l'école change quelque chose : on mesure des comportements, jamais des montants.
   Chargé par efa-appli.js. S'affiche dans tout élément [data-efa-point] (Mon cahier, page des parcours).
   Stockage : localStorage « efa_point_v1 » = { debut: "AAAA-MM-JJ", j0: "101", j30: "111", j90: null, d30, d90 }.
   Avec un compte, efa-compte.js transmet seulement ces trois chiffres par étape (voir confidentialite.html). */
(function () {
  "use strict";
  if (window.EFA_POINT) return;
  var KEY = "efa_point_v1";
  var Q = [
    "Je sais où passe mon argent chaque mois.",
    "J’ai au moins un mois de dépenses de côté, hors tontine.",
    "Je n’ai aucune dette chère en cours (avance sur salaire, prêt à fort taux, achat à crédit)."
  ];
  var COURT = ["Je sais où passe mon argent", "Un mois de côté", "Pas de dette chère"];
  function lire() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } }
  function jour(d) { return (d || new Date()).toISOString().slice(0, 10); }
  function plus(iso, n) { var d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return jour(d); }
  function dateFr(iso) { try { return new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long" }); } catch (e) { return iso; } }
  function compter(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }

  // L'étape à demander maintenant, ou null
  function aFaire(s) {
    s = s || lire(); var t = jour();
    if (!s.j0) return "j0";
    if (!s.j30 && plus(s.debut, 30) <= t) return "j30";
    if (!s.j90 && plus(s.debut, 90) <= t) return "j90";
    return null;
  }
  var TITRES = {
    j0: ["Mon point de départ", "Trois questions, oui ou non. On vous les reposera dans 30 jours, puis dans 90 jours : c’est ainsi que vous verrez ce qui a changé. Rien n’est envoyé à EFA."],
    j30: ["Mon point à 30 jours", "Il y a un mois, vous avez répondu à ces trois questions. Et aujourd’hui ?"],
    j90: ["Mon point à 90 jours", "Trois mois après votre point de départ : qu’est-ce qui a changé ?"]
  };
  var CSS = ".efa-pt{background:#FFFDF8;color:#2A3142;border-radius:14px;padding:20px 22px;display:flex;flex-direction:column;gap:12px;font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif;margin:0 0 16px}"
    + ".efa-pt .pt-s{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#B8341A;margin:0}"
    + ".efa-pt h3{font-family:'Libre Baskerville',Georgia,serif;font-weight:700;font-size:clamp(19px,2vw,22px);line-height:1.18;margin:0;color:#0B1220}"
    + ".efa-pt p{margin:0;font-size:15.5px;line-height:1.5;color:#4E5566}"
    + ".efa-pt ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}"
    + ".efa-pt li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 14px;align-items:center;background:#F5EFE2;border-radius:10px;padding:10px 12px}"
    + "@media (max-width:520px){.efa-pt li{grid-template-columns:minmax(0,1fr)}}"
    + ".efa-pt li span{font-size:15.5px;font-weight:600;color:#0B1220}"
    + ".efa-pt .pt-b{display:flex;gap:6px}"
    + ".efa-pt button{font:inherit;font-size:15px;font-weight:800;min-height:42px;min-width:64px;padding:8px 14px;border-radius:8px;border:0;cursor:pointer;background:#FFFDF8;color:#0B1220}"
    + ".efa-pt button[aria-pressed=true]{background:#0B1220;color:#fff}"
    + ".efa-pt button:focus-visible{outline:3px solid #1B71B2;outline-offset:2px}"
    + ".efa-pt .pt-ok{background:#DA3C1B;color:#fff;align-self:flex-start;padding:10px 20px}"
    + ".efa-pt .pt-ok[disabled]{opacity:.45;cursor:default}"
    + ".efa-pt .pt-r{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}"
    + "@media (max-width:620px){.efa-pt .pt-r{grid-template-columns:minmax(0,1fr)}}"
    + ".efa-pt .pt-r div{background:#F5EFE2;border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}"
    + ".efa-pt .pt-r b{font-size:14px;color:#0B1220}.efa-pt .pt-r small{font-size:14px;color:#4E5566}"
    + ".efa-pt .pt-r .mieux small{color:#1D6B43;font-weight:700}";
  var enCours = {};
  function oui(c, i) { return c && c.charAt(i) === "1" ? "oui" : c ? "non" : "—"; }

  function html() {
    var s = lire(), k = aFaire(s);
    if (k) {
      var r = enCours[k] || [null, null, null], tous = r.every(function (x) { return x !== null; });
      return '<section class="efa-pt" aria-label="' + TITRES[k][0] + '"><p class="pt-s">' + (k === "j0" ? "Avant de commencer" : "C’est le moment") + '</p><h3>' + TITRES[k][0] + '</h3><p>' + TITRES[k][1] + '</p><ol>'
        + Q.map(function (q, i) { return '<li><span>' + q + '</span><span class="pt-b" role="group" aria-label="' + COURT[i] + '"><button type="button" data-pt="' + k + '" data-i="' + i + '" data-v="1" aria-pressed="' + (r[i] === 1) + '">Oui</button><button type="button" data-pt="' + k + '" data-i="' + i + '" data-v="0" aria-pressed="' + (r[i] === 0) + '">Non</button></span></li>'; }).join("")
        + '</ol><button type="button" class="pt-ok" data-pt-ok="' + k + '"' + (tous ? "" : " disabled") + '>Enregistrer mon point</button></section>';
    }
    // Tout est à jour : on montre le chemin parcouru
    var der = s.j90 ? "j90" : s.j30 ? "j30" : "j0", proch = !s.j30 ? plus(s.debut, 30) : !s.j90 ? plus(s.debut, 90) : null;
    return '<section class="efa-pt" aria-label="Mon point"><p class="pt-s">Mon point</p><h3>' + (der === "j0" ? "Point de départ noté le " + dateFr(s.debut) : der === "j30" ? "Où vous en êtes à 30 jours" : "Où vous en êtes à 90 jours") + '</h3>'
      + '<div class="pt-r">' + COURT.map(function (c, i) { var a = s.j0.charAt(i), b = (s[der] || "").charAt(i), mieux = der !== "j0" && a === "0" && b === "1"; return '<div class="' + (mieux ? "mieux" : "") + '"><b>' + c + '</b><small>' + (der === "j0" ? oui(s.j0, i) : "Départ : " + oui(s.j0, i) + " · aujourd’hui : " + oui(s[der], i)) + '</small></div>'; }).join("") + '</div>'
      + (proch ? '<p>Prochain point le ' + dateFr(proch) + ' : on vous reposera les trois questions.</p>' : '<p>Vos trois points sont faits. Bravo : gardez ce rythme.</p>') + '</section>';
  }
  function actif() {
    if (lire().j0) return true;
    try { var p = JSON.parse(localStorage.getItem("efa_parcours_v1") || "{}") || {}; return Object.keys(p.faits || {}).length > 0 || Object.keys(p.fiches || {}).length > 0 || Object.keys(p.preuves || {}).length > 0; } catch (e) { return false; }
  }
  function rendre() {
    var els = document.querySelectorAll("[data-efa-point]");
    if (!els.length) return;
    if (!document.getElementById("efa-pt-css")) { var st = document.createElement("style"); st.id = "efa-pt-css"; st.textContent = CSS; document.head.appendChild(st); }
    var h = html(), act = actif();
    // data-efa-point-si="actif" : seulement pour qui a déjà commencé (une étape cochée, une fiche gardée ou un point fait)
    Array.prototype.forEach.call(els, function (el) { el.innerHTML = (el.getAttribute("data-efa-point-si") === "actif" && !act) ? "" : h; el.setAttribute("data-efa-point", "1"); });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-pt],[data-pt-ok]"); if (!b) return;
    if (b.hasAttribute("data-pt")) {
      var k = b.getAttribute("data-pt"), r = enCours[k] = enCours[k] || [null, null, null];
      r[+b.getAttribute("data-i")] = +b.getAttribute("data-v"); rendre(); return;
    }
    var k2 = b.getAttribute("data-pt-ok"), rr = enCours[k2]; if (!rr || rr.some(function (x) { return x === null; })) return;
    var s = lire(); s[k2] = rr.join(""); s["d" + k2.slice(1)] = jour(); if (k2 === "j0") s.debut = jour();
    ecrire(s); delete enCours[k2]; compter("point-" + k2 + "-" + s[k2]); rendre();
    if (window.EFA_ECOLE && window.EFA_ECOLE.synchroniser) try { window.EFA_ECOLE.synchroniser(true); } catch (x) {}
  });
  window.EFA_POINT = { lire: lire, aFaire: aFaire, rendre: rendre };
  // Les vues (Mon cahier) se redessinent : on remplit tout conteneur vide qui apparaît
  function go() {
    rendre();
    try { new MutationObserver(function () { if (document.querySelector('[data-efa-point=""]')) rendre(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
