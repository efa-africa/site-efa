/* EFA · Reprise et sauvegarde, communes au site et à l'appli (même téléphone, mêmes enregistrements).
   - EFA_REPRISE.etape()   : la prochaine chose à faire, d'après le cahier, les décisions suivies, l'appli, l'école et l'objectif.
   - EFA_REPRISE.appli()   : ce qui a été fait dans l'appli (notes, challenges, actions), pour l'afficher dans le cahier du site.
   - EFA_SAUVEGARDE        : une seule sauvegarde pour tout EFA (école, cahier, défis, décisions suivies, outils, appli),
                             et sa restauration, y compris des anciennes sauvegardes de l'école et de l'appli.
   Tout reste sur le téléphone : ce fichier ne fait aucun envoi. */
(function () {
  "use strict";
  if (window.EFA_REPRISE) return;
  function lire(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  /* Liens : depuis l'appli (dossier app/), les pages du site sont un niveau au-dessus */
  var BASE = /\/app(\/|$)/.test(location.pathname) ? "../" : "";

  function appli() {
    var s = lire("efa_app_v1");
    if (!s || s.demo) return null;
    var notes = (s.cahier || []).filter(function (e) { return e && e.texte; });
    var ch = Object.keys(s.challenges || {}).filter(function (id) { var c = s.challenges[id]; return c && (c.statut === "en_cours" || c.statut === "pause"); });
    var actions = (s.actions || []).filter(function (a) { return a && (a.statut === "a_commencer" || a.statut === "en_cours" || a.statut === "reportee"); });
    if (!notes.length && !ch.length && !actions.length) return null;
    return { notes: notes, challenges: ch, actions: actions };
  }

  function etape() {
    try {
      var C = lire("efa_cahier_v1"), O = lire("efa_objectif"), P = lire("efa_parcours_v1"), S = lire("efa_suivi_v1"), A = appli();
      var auj = iso(new Date()), now = Date.now();
      /* 1. Le défi de sept jours en cours */
      var sem = C && C.semaines && C.semaines.filter(function (x) { return !x.fini; }).pop();
      if (sem && sem.debut) {
        var a = sem.debut.split("-"), n = Math.round((new Date(auj.replace(/-/g, "/")) - new Date(+a[0], +a[1] - 1, +a[2])) / 864e5) + 1, J = sem.jours || [], faits = J.filter(function (x) { return x != null; }).length;
        if (n > 7 || faits >= 7) return { t: "Votre défi de sept jours est terminé : faites le bilan et choisissez la suite.", b: "Faire mon bilan", h: BASE + "outils.html#cahier", k: "bilan" };
        if (n >= 1 && J[n - 1] == null) return { t: "Jour " + n + " sur 7 : notez votre dépense du jour.", b: "Noter ma dépense du jour", h: BASE + "outils.html#cahier", k: "defi" };
        return { t: "Jour " + Math.max(1, n) + " sur 7 : c’est noté pour aujourd’hui.", b: "Voir mon défi", h: BASE + "outils.html#cahier", k: "defi-ok" };
      }
      /* 2. Une décision suivie dont le point à 7 ou 30 jours est dû */
      var it = S && S.items && S.items.filter(function (x) { if (x.report && x.report > now) return false; return (!x.r7 && now >= x.j7) || (x.r7 && !x.r30 && now >= x.j30); })[0];
      if (it) return { t: "Faites le point sur votre décision : « " + (it.action || it.titre) + " ».", b: "Faire le point", h: BASE + "outils.html#cahier", k: "suivi" };
      /* 3. Les pistes du diagnostic, sans défi lancé */
      if (C && C.pistes && C.pistes.liste && C.pistes.liste.length) return { t: "Votre prochaine action : choisir un poste à suivre pendant sept jours.", b: "Choisir mon poste", h: BASE + "outils.html#cahier/nouveau", k: "poste" };
      /* 4. Un challenge commencé dans l'appli */
      if (A && A.challenges.length) return { t: "Vous avez un challenge en cours dans l’appli.", b: "Continuer mon challenge", h: BASE + "app/", k: "challenge" };
      /* 5. L'objectif choisi au point de départ */
      if (O && O.p && O.q2) return { t: "Votre première étape : " + (O.nextT || "votre point de départ") + ".", b: "Commencer", h: O.next || BASE + "point-de-depart.html?src=reprise", k: "objectif", o: O };
      /* 6. Le module en cours dans l'école */
      if (P && P.actif && P.faits && Object.keys(P.faits).some(function (k) { return k.indexOf(P.actif + ".") === 0; })) return { t: "Vous en étiez à votre module en cours.", b: "Reprendre mon module", h: BASE + "parcours.html?src=reprise#" + P.actif, k: "module" };
    } catch (x) {}
    return null;
  }

  /* ---------- Sauvegarde ---------- */
  /* Exclus : les clés d'accès (compte personnel, organisation), qui ne doivent pas circuler dans un fichier, et les réglages passagers. */
  var EXCLUS = /^(efa_compte|efa_compte_sync|efa_cle_orga|efa_compte_plus_tard|efa_appli_install|efa_musee_retour|efa_son|efa_musee_son|efa_biblio_son|efa_partage_rappel|efa_vu)$/;
  function cles() {
    var out = [];
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf("efa_") === 0 && !EXCLUS.test(k)) out.push(k); } } catch (e) {}
    return out.sort();
  }
  function exporter() {
    var o = { efa: "sauvegarde", v: 2, date: new Date().toISOString(), cles: {} };
    cles().forEach(function (k) { try { o.cles[k] = localStorage.getItem(k); } catch (e) {} });
    /* le cahier peut n'être que dans la session si la personne n'a pas choisi de le garder */
    try { if (!o.cles.efa_cahier_v1) { var t = sessionStorage.getItem("efa_cahier_v1"); if (t) o.cles.efa_cahier_v1 = t; } } catch (e) {}
    return o;
  }
  function resume(o) {
    o = o || exporter(); var K = o.cles || {}, r = [];
    function j(k) { try { return JSON.parse(K[k] || "null"); } catch (e) { return null; } }
    var P = j("efa_parcours_v1"), C = j("efa_cahier_v1"), S = j("efa_suivi_v1"), A = j("efa_app_v1");
    if (P && P.faits) r.push(Object.keys(P.faits).length + " étape" + (Object.keys(P.faits).length > 1 ? "s" : "") + " de l’école");
    if (P && P.fiches && Object.keys(P.fiches).length) r.push(Object.keys(P.fiches).length + " fiche" + (Object.keys(P.fiches).length > 1 ? "s" : ""));
    if (C) r.push("le cahier" + (C.semaines && C.semaines.length ? " (" + C.semaines.length + " défi" + (C.semaines.length > 1 ? "s" : "") + ")" : ""));
    if (S && S.items && S.items.length) r.push(S.items.length + " décision" + (S.items.length > 1 ? "s" : "") + " suivie" + (S.items.length > 1 ? "s" : ""));
    if (A && !A.demo && A.cahier && A.cahier.length) r.push(A.cahier.length + " note" + (A.cahier.length > 1 ? "s" : "") + " de l’appli");
    var autres = Object.keys(K).filter(function (k) { return !/^efa_(parcours_v1|cahier_v1|suivi_v1|app_v1)$/.test(k); }).length;
    if (autres) r.push(autres + " outil" + (autres > 1 ? "s" : "") + " et réglage" + (autres > 1 ? "s" : ""));
    return r;
  }
  function telecharger() {
    var o = exporter(), b = new Blob([JSON.stringify(o)], { type: "application/json" }), a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = "mon-efa-" + iso(new Date()) + ".json"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    return resume(o);
  }
  /* Restaure une sauvegarde (texte ou objet). Accepte aussi les anciennes sauvegardes de l'école ({faits…}) et de l'appli ({v:1, profil…}). */
  function restaurer(x) {
    var o = typeof x === "string" ? JSON.parse(x) : x;
    if (!o || typeof o !== "object") throw new Error("format");
    var K = {};
    if (o.efa === "sauvegarde" && o.cles && typeof o.cles === "object") K = o.cles;
    else if (o.faits || o.fiches || o.preuves) K = { efa_parcours_v1: JSON.stringify(o) };
    else if (o.v === 1 && o.profil) K = { efa_app_v1: JSON.stringify(o) };
    else throw new Error("format");
    var n = 0;
    Object.keys(K).forEach(function (k) {
      if (k.indexOf("efa_") !== 0 || EXCLUS.test(k) || typeof K[k] !== "string" || K[k].length > 2e6) return;
      try { JSON.parse(K[k]); } catch (e) { if (!/^[\w\s.,:;\-]*$/.test(K[k])) return; }
      try { localStorage.setItem(k, K[k]); n++; } catch (e) {}
    });
    try { if (K.efa_cahier_v1) sessionStorage.setItem("efa_cahier_v1", K.efa_cahier_v1); } catch (e) {}
    if (!n) throw new Error("vide");
    return resume({ cles: K });
  }

  function cohorte() {
  /* Cohorte de 30 jours : chaque étape est comptée une seule fois par téléphone, avec la semaine de départ (ex. « s44 »).
       Départ · première leçon ou fiche · action choisie · retour à 7 jours · retour à 30 jours · action déclarée réalisée.
       Aucune donnée personnelle : seulement des compteurs anonymes dans GoatCounter. */
    try {
      var L = function (k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (x) { return null; } };
      var c = L("efa_cohorte") || {}, t = Date.now(), P = L("efa_parcours_v1") || {}, C = L("efa_cahier_v1"), S = L("efa_suivi_v1"), A = L("efa_app_v1");
      var lecon = !!localStorage.getItem("efa_premiere_fiche") || Object.keys(P.faits || {}).length > 0 || !!(A && A.lecons && Object.keys(A.lecons).length);
      var action = !!(S && S.items && S.items.length) || !!(C && C.semaines && C.semaines.length) || !!(A && A.challenges && Object.keys(A.challenges).length);
      var engage = lecon || action || !!localStorage.getItem("efa_objectif") || !!C;
      if (engage) {
        if (!c.p) { c.p = t; var d = new Date(t), j = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), n = j.getUTCDay() || 7; j.setUTCDate(j.getUTCDate() + 4 - n); c.s = "s" + Math.ceil(((j - Date.UTC(j.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7); c.f = {}; }
        var fait = (S && S.items || []).some(function (x) { return x.r7 === "oui" || x.r30 === "oui"; }) || !!(C && C.semaines && C.semaines.some(function (x) { return x.fini; }));
        var etapes = [["1-depart", true], ["2-premiere-lecon", lecon], ["3-action-choisie", action], ["4-retour-j7", t - c.p >= 7 * 864e5], ["5-retour-j30", t - c.p >= 30 * 864e5], ["6-action-realisee", fait]];
        var aEnvoyer = etapes.filter(function (e) { return e[1] && !c.f[e[0]]; }).map(function (e) { c.f[e[0]] = t; return "cohorte-" + e[0] + "-" + c.s; });
        localStorage.setItem("efa_cohorte", JSON.stringify(c));
        if (aEnvoyer.length) setTimeout(function () { aEnvoyer.forEach(function (ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }); }, 3000);
      }
    } catch (e) {}
  }
  try { cohorte(); } catch (e) {}
  window.EFA_REPRISE = { etape: etape, appli: appli };
  window.EFA_SAUVEGARDE = { exporter: exporter, telecharger: telecharger, restaurer: restaurer, resume: resume };
  if (!window.EFA_ETAPE) window.EFA_ETAPE = etape;
})();
