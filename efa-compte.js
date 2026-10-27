/* EFA · Compte participant d'un programme d'organisation.
   Chargé sur toutes les pages par efa-appli.js. Sans compte, ne fait rien.
   Avec un compte (rejoint avec le code de son organisation), envoie seulement la progression :
   étapes cochées, modules dont la fiche est gardée, numéros de certificat. Jamais les montants ni le contenu des fiches. */
(function () {
  "use strict";
  if (window.EFA_ECOLE) return;
  var API = "https://efa-ecole.elysees-johnson.workers.dev";
  var CLE = "efa_compte";
  // Programme ouvert à tous : « Communauté EFA » (code public, créé dans admin-ecole). Vide = inscriptions pas encore ouvertes.
  var CODE_COMMUNAUTE = "EFA-7XFE-5KZ7";
  function lire(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function ecrire(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function appel(chemin, corps, cle, methode) {
    var o = { method: methode || (corps ? "POST" : "GET"), headers: { "Content-Type": "application/json" }, keepalive: true };
    if (cle) o.headers.Authorization = "Bearer " + cle;
    if (corps) o.body = JSON.stringify(corps);
    return fetch(API + chemin, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.erreur || "Service indisponible."); e.statut = r.status; throw e; } return j; });
    }, function () { var e = new Error("Connexion impossible. Vérifiez votre réseau, puis réessayez."); e.statut = 0; throw e; });
  }

  // Progression à envoyer : rien d'autre que des repères d'étapes
  function progression() {
    var st = lire("efa_parcours_v1") || {}, D = window.EFA_PARCOURS, fiches = Object.keys(st.preuves || {});
    if (D && st.fiches) D.parcours.forEach(function (p) { if (p.fiche && st.fiches[p.fiche.lien.split("?")[0].split("#")[0]] && fiches.indexOf(p.id) < 0) fiches.push(p.id); });
    var certs = {};
    [["fondations", "efa-certificat-fondations-pilote"], ["maitrise", "efa-certificat-maitrise-pilote"], ["patrimoine", "efa-certificat-patrimoine-pilote"]].forEach(function (x) { var e = lire(x[1]); if (e && e.reussite && e.reussite.numero) certs[x[0]] = e.reussite.numero; });
    var ce = lire("efa-certificat-cefa"); if (ce && ce.numero) certs.cefa = ce.numero;
    // Bilan de cohorte : des totaux et des identifiants de simulations, jamais un texte ni un montant
    var valides = function (k) { var e = lire(k) || {}, m = e.m || {}; return Object.keys(m).filter(function (x) { return m[x] && m[x].valide; }); };
    var su = window.EFA_SUIVI ? window.EFA_SUIVI.bilan() : null;
    var bilan = { decisions: valides("efa_decider_v1"), bourse: valides("efa_bourse_essentiel_v1").concat(valides("efa_bourse_pro_v1")), suivi: su ? { planifies: su.planifies, essaye: su.essaye, partiel: su.partiel, pas: su.pas } : null, point: (function () { var pt = lire("efa_point_v1") || {}, o = {}; ["j0", "j30", "j90"].forEach(function (k) { if (/^[01]{3}$/.test(pt[k] || "")) o[k] = pt[k]; }); return Object.keys(o).length ? o : null; })() };
    return { faits: st.faits || {}, fiches: fiches, certificats: certs, bilan: bilan };
  }
  // Après une connexion sur un autre appareil : on récupère les étapes déjà faites
  function fusionner(pa) {
    if (!pa) return;
    var st = lire("efa_parcours_v1") || {}; st.faits = st.faits || {}; st.preuves = st.preuves || {};
    Object.keys(pa.faits || {}).forEach(function (k) { st.faits[k] = 1; });
    (pa.fiches || []).forEach(function (m) { if (!st.preuves[m]) st.preuves[m] = { t: "Fiche gardée sur un autre appareil.", d: new Date().toISOString().slice(0, 10) }; });
    ecrire("efa_parcours_v1", st);
  }
  var dernier = null;
  function synchroniser(force) {
    var c = lire(CLE); if (!c || !c.cle) return Promise.resolve(null);
    var p = progression(), sig = JSON.stringify(p);
    try { if (!force && sessionStorage.getItem("efa_compte_sync") === sig) return Promise.resolve(null); } catch (e) {}
    if (!force && dernier === sig) return Promise.resolve(null);
    dernier = sig;
    return appel("/moi/sync", p, c.cle).then(function (j) {
      try { sessionStorage.setItem("efa_compte_sync", sig); } catch (e) {}
      c.vu = new Date().toISOString(); c.programme = j.programme || c.programme; ecrire(CLE, c); return j;
    }, function (e) { if (e.statut === 401) { c.retire = true; ecrire(CLE, c); } dernier = null; return null; });
  }

  window.EFA_ECOLE = {
    API: API, CODE_COMMUNAUTE: CODE_COMMUNAUTE, appel: appel, progression: progression, synchroniser: synchroniser,
    compte: function () { return lire(CLE); },
    rejoindre: function (code, nom, email) {
      return appel("/rejoindre", { code: code, nom: nom, email: email || "", accord: true }).then(function (j) {
        ecrire(CLE, { cle: j.cle_personnelle, nom: j.participant.nom, programme: j.programme, depuis: new Date().toISOString() });
        return synchroniser(true).then(function () { return j; });
      });
    },
    connecter: function (cle) {
      cle = String(cle || "").trim().toUpperCase();
      return appel("/moi", { connexion: true }, cle).then(function (j) {
        ecrire(CLE, { cle: cle, nom: j.participant.nom, programme: j.programme, depuis: new Date().toISOString() });
        fusionner(j.participant);
        return synchroniser(true).then(function () { return j; });
      });
    },
    deconnecter: function () { ecrire(CLE, null); try { sessionStorage.removeItem("efa_compte_sync"); } catch (e) {} },
    lienProgramme: function (c) {
      c = c || lire(CLE); if (!c || !c.programme) return "parcours.html";
      var p = c.programme.programme || {}, o = { v: 1, n: c.programme.nom, m: p.m, s: p.s, mi: p.mi, f: p.f, c: p.c };
      try { return "programme-organisation.html?p=" + btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") + "&vue=participant"; } catch (e) { return "parcours.html"; }
    }
  };

  // Rappel discret sur l'école et le programme : « Connecté au programme de … »
  function rappel() {
    var c = lire(CLE), page = location.pathname.split("/").pop() || "index.html";
    if (!c || !c.programme || ["parcours.html", "programme-organisation.html"].indexOf(page) < 0 || document.getElementById("efa-compte-r")) return;
    if (page === "programme-organisation.html" && !/vue=participant/.test(location.search)) return;
    var d = document.createElement("div"); d.id = "efa-compte-r";
    d.setAttribute("style", "background:#E3F5EA;color:#0B1220;font:600 14.5px/1.4 'Source Sans 3',system-ui,sans-serif;padding:10px max(16px,env(safe-area-inset-left,0px));display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;justify-content:center");
    d.innerHTML = (c.retire ? "Votre compte n’est plus actif. Contactez votre organisation." : "Connecté au programme <b>" + String(c.programme.nom).replace(/[<>&]/g, "") + "</b> · " + String(c.nom).replace(/[<>&]/g, "") + " · votre progression est enregistrée")
      + (page === "parcours.html" ? ' <a href="' + window.EFA_ECOLE.lienProgramme(c) + '" style="font-weight:800;color:#0B1220">Mon programme →</a>' : ' <a href="rejoindre.html" style="font-weight:800;color:#0B1220">Mon compte →</a>');
    var h = document.querySelector("header"); if (h && h.parentNode) h.parentNode.insertBefore(d, h.nextSibling); else document.body.insertBefore(d, document.body.firstChild);
  }

  // Sur L'école, sans compte : proposer le compte gratuit de la Communauté EFA
  function invitation() {
    var page = location.pathname.split("/").pop() || "index.html";
    if (!CODE_COMMUNAUTE || page !== "parcours.html" || lire(CLE) || document.getElementById("efa-compte-i")) return;
    var ref = document.querySelector(".ch-diag"); if (!ref) return;
    var p = document.createElement("p"); p.id = "efa-compte-i"; p.className = "ch-diag";
    p.innerHTML = '<a class="lien-souligne" href="rejoindre.html?communaute" data-goatcounter-click="ecole-compte-communaute">Créer mon compte gratuit : ma progression sur tous mes téléphones</a>';
    ref.parentNode.insertBefore(p, ref.nextSibling);
  }
  function demarrer() {
    rappel(); invitation();
    if (!lire(CLE)) return;
    setTimeout(function () { synchroniser(false); }, 2500);
    setInterval(function () { synchroniser(false); }, 60000);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") synchroniser(false); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();
