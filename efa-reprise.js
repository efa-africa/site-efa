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

  /* ---------- Règles de recommandation ----------
     Des règles simples, lisibles, à partir de ce que la personne a dit elle-même. Ce sont des pistes d'apprentissage,
     jamais un conseil financier personnalisé. Une piste déjà faite est sautée. */
  var PISTES = {
    savoir: { b: "Le module Flux et stock", h: "certificat-pilote.html?m=1&src=reprise", t: "Commencez par la différence entre ce qui passe et ce qui reste : tout le reste s’appuie dessus." },
    habitudes: { b: "Retrouver où passe mon argent", h: "atelier-ou-passe-mon-argent.html?src=reprise", at: "ou-passe-mon-argent", t: "Retrouvez où est parti l’argent du mois : c’est la première habitude à installer." },
    projection: { b: "Calculer mon projet", h: "cercle-spirale.html?src=reprise#projet", t: "Écrivez un objectif avec un montant et une date, puis voyez combien de rentrées il demande." },
    resilience: { b: "Construire ma réserve", h: "atelier-reserve-securite.html?src=reprise", at: "reserve-securite", t: "Séparez une réserve de votre argent courant, palier par palier." },
    rapport: { b: "Mon budget qui tient", h: "atelier-budget-qui-tient.html?src=reprise", at: "budget-qui-tient", t: "Un budget décidé à l’avance vous aide à dire non aux achats non prévus." },
    flux: { b: "Prêter à un proche, ou donner ?", h: "preter-a-un-proche.html?src=reprise", t: "Fixez ce que vous donnez à vos proches avant qu’on vous le demande." },
    dettes: { b: "Reprendre la main sur mes dettes", h: "parcours.html?src=reprise#P6", t: "On commence par la dette chère : la lister, la classer, puis décider laquelle rembourser d’abord." },
    bourse: { b: "Ouvrir la porte Bourse", h: "bourse.html?src=reprise", t: "Cinq étapes pour préparer votre dossier, sans rien acheter : projet, voie, intermédiaire, décision." }
  };
  var NOMS_DIM = { savoir: "le savoir", habitudes: "vos habitudes", projection: "vous projeter", resilience: "votre réserve", rapport: "votre rapport à l’argent", flux: "les flux avec vos proches" };
  function atelierFait(id) { var a = lire("efa-at-" + id); return !!(a && a.D && a.D._vue === "fiche"); }
  function recommandation(O) {
    var ok = function (k) { var p = PISTES[k]; return p && !(p.at && atelierFait(p.at)); };
    var pis = function (k, pourquoi) { var p = PISTES[k]; return { t: p.t, p: pourquoi, b: p.b, h: BASE + p.h, k: "piste-" + k }; };
    /* Mon point : la réponse la plus récente */
    var pt = lire("efa_point_v1"), rep = pt && (pt.j90 || pt.j30 || pt.j0);
    if (rep && /^[01]{3}$/.test(rep)) {
      if (rep[2] === "0" && ok("dettes")) return pis("dettes", "Vous avez indiqué une dette chère en cours.");
      if (rep[1] === "0" && ok("resilience")) return pis("resilience", "Vous avez indiqué ne pas avoir un mois de dépenses de côté.");
      if (rep[0] === "0" && ok("habitudes")) return pis("habitudes", "Vous avez indiqué ne pas savoir où passe votre argent chaque mois.");
    }
    /* Diagnostic : la dimension la plus basse */
    var dg = lire("efa_diag_resume");
    if (dg && dg.faible && ok(dg.faible)) return pis(dg.faible, "Votre diagnostic" + (dg.d ? " du " + jourCourt(dg.d) : "") + " : la priorité est " + (NOMS_DIM[dg.faible] || "à travailler") + ".");
    /* Objectif « investir » sans porte Bourse commencée */
    var B = lire("efa-bourse-v1");
    if (O && (O.p === "investir" || O.q2 === "investir") && !(B && B.der)) return pis("bourse", "Votre objectif : investir en Bourse.");
    return null;
  }
  function jourCourt(d) { var M = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]; var x = new Date(String(d || "").replace(/-/g, "/")); return isNaN(x) ? "" : x.getDate() + " " + M[x.getMonth()]; }

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
      /* 4 bis. Le dernier atelier ouvert, commencé et pas terminé */
      var der = String(localStorage.getItem("efa_dernier_atelier") || ""), mA = der.match(/^atelier-(.+)\.html$/);
      if (mA) { var at = lire("efa-at-" + mA[1]), fa = 0; if (at && at.etat) Object.keys(at.etat).forEach(function (k) { if (/^s\d+$/.test(k) && at.etat[k]) fa++; });
        if (fa > 0 && !(at.D && at.D._vue === "fiche")) return { t: "Reprenez votre atelier là où vous l’avez laissé.", b: "Reprendre mon atelier", h: BASE + der + "?src=reprise", k: "atelier" }; }
      var pp = lire("efa-pp-v1");
      if (der === "premiers-pas-bourse.html" && pp && +pp._pos > 0) return { t: "Reprenez « Mes premiers pas en Bourse » là où vous l’avez laissé.", b: "Reprendre mes premiers pas", h: BASE + "premiers-pas-bourse.html?src=reprise", k: "atelier" };
      /* 4 ter. La porte Bourse commencée, dossier pas encore complet */
      var B = lire("efa-bourse-v1");
      if (B && B.der && B.der !== "accueil" && B.der !== "dossier") { var nf = ["projet", "voie", "comparaison", "decision", "ordre"].filter(function (x) { return B.fiches && B.fiches[x]; }).length;
        if (nf < 5) return { t: "Votre porte Bourse vous attend : " + (nf ? nf + " étape" + (nf > 1 ? "s" : "") + " de votre dossier sur 5." : "reprenez là où vous en étiez."), b: "Reprendre ma porte Bourse", h: BASE + "bourse.html#" + B.der, k: "bourse" }; }
      /* 5. L'objectif choisi au point de départ */
      var pageDe = function (u) { return String(u || "").replace(/^(\.\.\/)+/, "").split("#")[0].split("?")[0]; };
      var objFait = O && O.next && P && P.fiches && Object.keys(P.fiches).some(function (k) { return pageDe(k) === pageDe(O.next) || pageDe(k).replace(/\.html$/, "") === pageDe(O.next).replace(/\.html$/, ""); });
      if (O && O.p && O.q2 && !objFait) return { t: "Votre première étape : " + (O.nextT || "votre point de départ") + ".", b: "Commencer", h: O.next || BASE + "point-de-depart.html?src=reprise", k: "objectif", o: O };
      /* 6. Le module en cours dans l'école */
      if (P && P.actif && P.faits && Object.keys(P.faits).some(function (k) { return k.indexOf(P.actif + ".") === 0; })) return { t: "Vous en étiez à votre module en cours.", b: "Reprendre mon module", h: BASE + "parcours.html?src=reprise#" + P.actif, k: "module" };
      /* 7. Recommandation : ce que la personne a déclaré (Mon point, diagnostic, objectif), quand rien n'est en cours */
      var r = recommandation(O);
      if (r) return r;
      /* 8. La première étape est faite : choisir la suite */
      if (objFait) return { t: "Première étape faite et gardée dans votre cahier. Choisissez la suite.", b: "Choisir la suite", h: BASE + "outils.html#cahier", k: "suite" };
    } catch (x) {}
    return null;
  }

  /* ---------- Sauvegarde ---------- */
  /* Exclus : les clés d'accès (compte personnel, organisation), qui ne doivent pas circuler dans un fichier, et les réglages passagers. */
  var EXCLUS = /^(efa_compte|efa_compte_sync|efa_cle_orga|efa_compte_plus_tard|efa_appli_install|efa_musee_retour|efa_son|efa_musee_son|efa_biblio_son|efa_partage_rappel|efa_vu)$/;
  /* Enregistrements nommés avec un tiret : porte Bourse, ateliers guidés, premiers pas, certificats */
  var AVEC_TIRET = /^efa-(bourse-v1|pp-v1|coach-brvm-v1|at-[a-z0-9-]+|certificat-[a-z-]+)$/;
  function cles() {
    var out = [];
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && (k.indexOf("efa_") === 0 || AVEC_TIRET.test(k)) && !EXCLUS.test(k)) out.push(k); } } catch (e) {}
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
    var ats = Object.keys(K).filter(function (k) { return /^efa-at-/.test(k); }).length + (K["efa-pp-v1"] ? 1 : 0);
    if (ats) r.push(ats + " atelier" + (ats > 1 ? "s" : ""));
    if (K["efa-bourse-v1"]) r.push("la porte Bourse");
    var autres = Object.keys(K).filter(function (k) { return !/^efa_(parcours_v1|cahier_v1|suivi_v1|app_v1)$/.test(k) && !/^efa-(at-|pp-v1|bourse-v1|coach-brvm-v1)/.test(k); }).length;
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
      if ((k.indexOf("efa_") !== 0 && !AVEC_TIRET.test(k)) || EXCLUS.test(k) || typeof K[k] !== "string" || K[k].length > 2e6) return;
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
  window.EFA_REPRISE = { etape: etape, appli: appli, recommandation: recommandation, PISTES: PISTES };
  window.EFA_SAUVEGARDE = { exporter: exporter, telecharger: telecharger, restaurer: restaurer, resume: resume };
  if (!window.EFA_ETAPE) window.EFA_ETAPE = etape;
})();
