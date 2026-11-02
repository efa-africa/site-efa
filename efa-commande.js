/* EFA · Commande d'un document personnel (business plan, analyse complète) avec code d'accès.
   EFACommande.ouvrir(conteneur, {produit, detail, prix, prixNormal, champs, retour})
   - Le code est tiré au hasard dans le navigateur (100 bits, alphabet sans 0/O/1/I) : aucune logique de génération.
   - Il s'affiche tout de suite, se garde sur le téléphone et part avec la commande vers EFA (Web3Forms).
   - Envoi automatique par email : renseigner EFA_CONFIG.BREVO_CODE_URL (formulaire Brevo + automatisation
     qui envoie le modèle « Votre code EFA » à l'ajout dans la liste). Vide = pas d'email automatique.
   - WhatsApp : le bouton ouvre la conversation avec le numéro saisi, message prérempli avec le code. */
(function () {
  "use strict";
  var CLE = "426191fb-4812-4de4-b602-5857464c5916", A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", K = "efa_bp_codes";
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function F(n) { return Math.round(n).toLocaleString("fr-FR").replace(/[\s ]/g, " ") + " F"; }
  function code() { var o = new Uint8Array(20); crypto.getRandomValues(o); var s = ""; for (var i = 0; i < 20; i++) s += A[o[i] % 32]; return "BP-" + s.match(/.{4}/g).join("-"); }
  function garder(c, t) { try { var L = JSON.parse(localStorage.getItem(K) || "[]") || []; var n = c.replace(/[^A-Z0-9]/g, ""); L = L.filter(function (x) { return x.c !== n; }); L.unshift({ c: n, t: t, attente: 1, d: Date.now() }); localStorage.setItem(K, JSON.stringify(L.slice(0, 10))); } catch (e) {} }
  function prixBloc(o) {
    css();
    return '<div class="cm-prix"><div><span class="cm-promo">' + (o.etiquette || 'Prix de lancement') + '</span><b>' + esc(o.produit) + '</b>' + (o.detail ? '<small>' + esc(o.detail) + '</small>' : '') + '</div><div class="cm-montants"><s>' + F(o.prixNormal) + '</s><strong>' + (o.prix ? F(o.prix) : 'Offert') + '</strong></div></div>';
  }
  function css() {
    if (document.getElementById("cm-css")) return;
    var st = document.createElement("style"); st.id = "cm-css";
    st.textContent = ".cm-prix{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#0B1220;color:#fff;border-radius:12px;padding:14px 16px;margin:12px 0}.cm-prix b{display:block;font-size:16px;color:#fff}.cm-prix small{display:block;font-size:13.5px;color:#C9D1DE}.cm-promo{display:inline-block;white-space:nowrap;background:#DA3C1B;color:#fff;font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:3px 10px;margin-bottom:6px}.cm-montants{text-align:right;white-space:nowrap}.cm-montants s{display:block;color:#F09680;font-size:16px;font-weight:700;text-decoration-thickness:2px}.cm-montants strong{display:block;font-family:'Libre Baskerville',Georgia,serif;font-size:28px;color:#fff!important;line-height:1.1}"
      + ".cm-f label{display:block;margin-top:10px;font-size:14px;font-weight:700;color:#4E5566}.cm-f input,.cm-f textarea{display:block;width:100%;box-sizing:border-box;margin-top:4px;font:inherit;font-size:16px;padding:10px 12px;border:1px solid #C3D6E0;border-radius:10px;background:#fff;color:#0B1220}.cm-ou{text-align:center;font-size:13px;font-weight:800;color:#7A8293;margin:8px 0 -2px;text-transform:uppercase;letter-spacing:.1em}.cm-err{color:#A3260F;font-weight:700;font-size:14px;margin:8px 0 0}.cm-go{display:block;width:100%;margin-top:14px;min-height:52px;border:0;border-radius:8px;background:#DA3C1B;color:#fff!important;font:800 17px 'Source Sans 3',system-ui,sans-serif;cursor:pointer}.cm-go:disabled{opacity:.6}.cm-note{font-size:13.5px;color:#5F6676;margin:10px 0 0}"
      + ".cm-code{background:#fff;border:2px dashed #DA3C1B;border-radius:12px;padding:14px;text-align:center;margin:12px 0}.cm-code small{display:block;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#B8341A}.cm-code b{display:block;font:800 clamp(17px,4.6vw,22px)/1.3 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.04em;color:#0B1220;margin:6px 0;word-break:break-all}.cm-act{display:grid;gap:8px;margin-top:10px}.cm-act a,.cm-act button{display:flex;align-items:center;justify-content:center;min-height:48px;border:0;border-radius:8px;font:800 15.5px 'Source Sans 3',system-ui,sans-serif;text-decoration:none;cursor:pointer}.cm-wa{background:#1E8E57;color:#fff!important}.cm-cp{background:#F1F7FA;color:#0B1220!important}.cm-es{background:#0B1220;color:#fff!important}";
    document.head.appendChild(st);
  }
  function ouvrir(box, o) {
    css();
    box.innerHTML = prixBloc(o)
      + '<form class="cm-f" novalidate><label>Prénom et nom<input name="nom" autocomplete="name"></label>'
      + '<label>Mon email<input name="email" type="email" autocomplete="email" placeholder="vous@exemple.com"></label><p class="cm-ou">ou</p>'
      + '<label>Mon numéro WhatsApp<input name="whatsapp" inputmode="tel" autocomplete="tel" placeholder="+225 07 00 00 00 00"></label>'
      + (o.champs || []).map(function (c) { return '<label>' + esc(c[1]) + '<input name="' + c[0] + '" placeholder="' + esc(c[2] || "") + '"></label>'; }).join("")
      + '<p class="cm-err" hidden></p><button type="submit" class="cm-go">Recevoir mon code</button>'
      + '<p class="cm-note">Votre code s’affiche tout de suite' + ((window.EFA_CONFIG || {}).BREVO_CODE_URL ? ' et part aussi par email' : '') + '. Le paiement se fait par mobile money, après un premier échange avec EFA. Rien n’est prélevé maintenant.</p></form>';
    var f = box.querySelector("form"), err = box.querySelector(".cm-err");
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var v = { nom: f.nom.value.trim(), email: f.email.value.trim(), whatsapp: f.whatsapp.value.trim() };
      (o.champs || []).forEach(function (c) { v[c[0]] = f[c[0]].value.trim(); });
      var mailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email), waOk = v.whatsapp.replace(/\D/g, "").length >= 8;
      if (!mailOk && !waOk) { err.hidden = false; err.textContent = "Laissez votre email ou votre numéro WhatsApp : c’est là que vous recevez votre code."; return; }
      var c = code(), btn = f.querySelector(".cm-go"); btn.disabled = true; btn.textContent = "Création de votre code…";
      garder(c, o.produit + (o.titre ? " · " + o.titre : ""));
      if (o.brouillon) { try { var Bz = JSON.parse(localStorage.getItem("efa_bp_brouillons") || "{}") || {}; Bz[c.replace(/[^A-Z0-9]/g, "")] = o.brouillon(c, v); localStorage.setItem("efa_bp_brouillons", JSON.stringify(Bz)); } catch (e) {} }
      var data = { access_key: CLE, subject: "efa.africa · Commande · " + o.produit + (o.titre ? " · " + o.titre : "") + " · " + c, from_name: "Commandes · efa.africa", code: c, produit: o.produit, titre: o.titre || "", prix_lancement: String(o.prix), prix_normal: String(o.prixNormal), page: location.pathname, a_faire: "Contacter le client, encaisser par mobile money, produire le document, le publier avec CE code : python3 scripts/plans/publier_plan.py plan.json --code " + c };
      for (var k in v) data[k] = v[k]; for (var k2 in (o.extra || {})) data[k2] = o.extra[k2]; if (mailOk) data.replyto = v.email;
      var envois = [fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) }).then(function (r) { return r.json(); }).then(function (r) { return !!r.success; }).catch(function () { return false; })];
      var B = (window.EFA_CONFIG || {}).BREVO_CODE_URL;
      if (B && mailOk) { var d = new FormData(); d.append("EMAIL", v.email); d.append("EFA_CODE_BP", c); d.append("EFA_COMMANDE", o.produit + (o.titre ? " · " + o.titre : "")); d.append("email_address_check", ""); d.append("locale", "fr"); envois.push(fetch(B, { method: "POST", mode: "no-cors", body: d }).then(function () { return true; }).catch(function () { return false; })); }
      Promise.all(envois).then(function (r) {
        if (!r[0]) { btn.disabled = false; btn.textContent = "Recevoir mon code"; err.hidden = false; err.textContent = "L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez."; return; }
        try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "commande-" + (o.cle || "document"), title: "Commande " + o.produit, event: true }); } catch (e) {}
        var msg = "Mon code EFA pour « " + o.produit + (o.titre ? " · " + o.titre : "") + " » : " + c + "\nMon espace : https://efa.africa/mon-espace-business-plan.html";
        var wa = waOk ? "https://wa.me/" + v.whatsapp.replace(/\D/g, "").replace(/^00/, "") + "?text=" + encodeURIComponent(msg) : "";
        box.innerHTML = '<p style="margin:0;font-weight:700;color:#0B1220">Merci' + (v.nom ? ", " + esc(v.nom.split(" ")[0]) : "") + '. Votre commande est enregistrée.</p>'
          + '<div class="cm-code"><small>Votre code personnel</small><b>' + c + '</b><span style="font-size:14px;color:#4E5566">Gardez-le : il est la seule clé de votre document.</span></div>'
          + '<p class="cm-note" style="margin-top:0">' + (B && mailOk ? "Il vient aussi de partir par email à " + esc(v.email) + ". " : "") + (o.brouillon ? '<b>La version 1 de votre plan est déjà dans votre espace.</b> ' : '') + 'EFA vous contacte' + (waOk ? " sur WhatsApp" : " par email") + (o.prix ? ' pour le paiement de ' + F(o.prix) : ' pour préparer votre document, offert avec votre clé') + '. Votre document arrive dans votre espace, avec ce code.</p>'
          + '<div class="cm-act">' + (wa ? '<a class="cm-wa" href="' + wa + '" target="_blank" rel="noopener">Garder mon code dans WhatsApp</a>' : '') + '<button type="button" class="cm-cp">Copier mon code</button><a class="cm-es" href="mon-espace-business-plan.html">Ouvrir mon espace</a></div>';
        box.querySelector(".cm-cp").onclick = function () { var b = this; (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).then(function () { b.textContent = "Code copié ✓"; }).catch(function () { b.textContent = c; }); };
        if (o.retour) o.retour(c);
      });
    };
  }
  function FC(n) { return n >= 1e6 ? (Math.round(n / 1e5) / 10).toString().replace(".", ",") + " M F" : F(n); }
  function sansInsec(t) { return String(t).replace(/[  ]/g, " "); }
  /* Version 1 d'un business plan, disponible tout de suite dans l'espace : construite à partir de l'idée du catalogue et du budget. */
  function version1(x, o) {
    var b = o.budget || (x[4] || x[3]), d = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), tk = sansInsec((x[3] ? FC(x[3]) : "0 F") + " à " + FC(x[4] || x[3])), bud = o.budget ? sansInsec(F(b)) : "à préciser";
    return { version1: 1, titre: x[1], porteur: o.nom || "", lieu: o.pays || "", budget: bud,
      versions: [{ v: 1, date: d, note: "Version de départ, à partir de votre idée et de votre budget." }], legende: true, resume: x[8],
      chapitres: [
        { t: "Le client et son problème", blocs: [{ p: "**Votre client principal :** " + (o.client || "à préciser avec vous.") }, { liste: ["Qui achète, et à quelle fréquence ?", "Combien paie-t-il aujourd’hui pour une solution proche ?", "Où le trouver : quartier, bureau, marché, réseau ?"] }] },
        { t: "L’offre et le prix test", blocs: [{ p: x[8] }, { encart: "Commencez par une offre courte et un seul prix. On élargit quand les ventes sont régulières." }] },
        { t: "Le test terrain", blocs: [{ p: "**Votre premier test :** " + x[9] }, { encart: "Votre but : obtenir une réaction réelle d’un client ou d’un fournisseur avant de dépenser tout le budget." }] },
        { t: "Les dépenses de départ", blocs: [{ chiffres: [{ l: "Votre budget", v: bud, o: "vous" }, { l: "Ticket de départ observé pour cette activité", v: tk, o: "efa" }] }, { verrou: "Le détail poste par poste arrive dans votre espace" }] },
        { t: "Les coûts de chaque mois", blocs: [{ verrou: "Calculés par EFA avec vos réponses" }] },
        { t: "Les hypothèses de ventes", blocs: [{ verrou: "Trois niveaux de ventes, à partir de votre test" }] },
        { t: "La trésorerie en trois scénarios", blocs: [{ verrou: "Prudent, central, favorable : mois par mois" }] },
        { t: "Les risques", blocs: [{ liste: ["**À vérifier :** " + x[10], "**Le piège courant :** " + x[11]] }] },
        { t: "Les 30 premiers jours", blocs: [{ tableau: { tete: ["Semaine", "Action"], lignes: [["1", "Préparer le test : " + x[9]], ["2", "Faire le test et noter chaque réaction, chaque vente."], ["3", "Vérifier : " + x[10]], ["4", "Faire le point avec EFA : ce que le test a montré, et la suite."]] } }] },
        { t: "Ce qu’il reste à vérifier", blocs: [{ liste: [x[10], "Les autorisations et formalités applicables à votre activité, auprès de la mairie ou de la chambre de commerce.", "Les prix réels chez deux fournisseurs."] }, { encart: "Ce plan est un outil de travail : il ne vaut ni étude de marché, ni accord de financement. Il s’enrichit ici, avec ce même code." }] }
      ], suivi: [{ date: d, texte: "Commande reçue. EFA vous contacte pour compléter les chapitres chiffrés." }] };
  }
  window.EFACommande = { ouvrir: ouvrir, prixBloc: prixBloc, F: F, version1: version1 };
})();
