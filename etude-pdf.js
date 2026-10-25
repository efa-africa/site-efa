/* Rapport PDF des études EFA contre une adresse email.
   Tout élément portant data-etude-pdf ouvre la fenêtre. Après l'envoi du formulaire (liste Brevo « Newsletter EFA »,
   double confirmation), le lien de téléchargement s'affiche. Rien ici n'est secret. */
(function () {
  var CFG = window.EFA_ETUDE = {
    pdf: "etudes/EFA-Etude-La-tontine-en-chiffres-23-10-26.pdf",
    titre: "La tontine en chiffres",
    sous: "Afrique de l'Ouest et centrale : l'épargne en groupe dans 19 pays, d'après le Global Findex 2025",
    couverture: "etudes/tontine-en-chiffres-couverture.jpg",
    enquete: "https://forms.gle/Sczi5p58q9ijuKqp9",
    brevo: "https://b46b1615.sibforms.com/serve/MUIFAKh7190-xVONttcMGx9z5uLhlcS3Knrj0HOrhpnsbgPHCoa1GSLsbsCmk1lvMWF8o_An6q6BYBz85koQiVVRpHhage71-PdxWrT1OFhCY5iidi-UIq-C34WPbWb-FGUjhGa5kXw3NytB242VM_LTd9sbakiFejMRUqseZNiyuN8LB_U_cvRkJ7v0E1SyaD-_RVTlQfAI7JLVRw==",
    cle: "efa_etude1_email"
  };
  function compte(ev) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: ev, title: ev, event: true }); } catch (e) {} }
  function deja() { try { return localStorage.getItem(CFG.cle) === "1"; } catch (e) { return false; } }
  function noter() { try { localStorage.setItem(CFG.cle, "1"); } catch (e) {} }

  var css = "" +
    "#ep-ov{position:fixed;inset:0;z-index:10000;background:rgba(7,12,22,.72);display:flex;align-items:center;justify-content:center;padding:16px}" +
    "#ep-ov[hidden]{display:none!important}" +
    "#ep-box{background:#F5EFE2;color:#0B1220;border-radius:18px;max-width:520px;width:100%;max-height:calc(100svh - 32px);overflow:auto;padding:26px 24px 22px;font-family:'Source Sans 3','Source Sans Pro',system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.5;position:relative}" +
    "#ep-box h2{font-family:'Libre Baskerville',Baskerville,Georgia,serif;font-weight:700;font-size:24px;line-height:1.2;margin:4px 0 6px}" +
    "#ep-box .k{font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:800;color:#E44828;margin:0}" +
    "#ep-box p{margin:0 0 12px}" +
    "#ep-box .cov{display:flex;gap:14px;align-items:center;margin:4px 0 14px}" +
    "#ep-box .cov img{width:132px;height:auto;border-radius:6px;box-shadow:0 6px 18px rgba(11,18,32,.25);flex:none}" +
    "#ep-box .cov span{font-size:14px;color:#3A4357}" +
    "#ep-box form{display:grid;gap:10px}" +
    "#ep-box input[type=email],#ep-box input[type=text]{font:inherit;padding:12px 14px;border-radius:10px;border:2px solid #D8CDB8;background:#fff;color:#0B1220;width:100%}" +
    "#ep-box input:focus-visible,#ep-box button:focus-visible,#ep-box a:focus-visible{outline:3px solid #2188D6;outline-offset:2px}" +
    "#ep-box label.ck{display:flex;gap:10px;align-items:flex-start;font-size:14px;color:#3A4357}" +
    "#ep-box label.ck input{margin-top:4px;flex:none;width:18px;height:18px}" +
    "#ep-box .go{font-family:inherit;font-weight:800;font-size:16px;background:#DA3C1B;color:#fff;border:0;border-radius:999px;padding:13px 18px;cursor:pointer}" +
    "#ep-box .go[disabled]{opacity:.6}" +
    "#ep-box .dl{display:inline-flex;align-items:center;justify-content:center;background:#0B1220;color:#fff;text-decoration:none;font-weight:800;border-radius:999px;padding:13px 20px;margin:4px 0 12px}" +
    "#ep-box .msg{font-size:14px;min-height:1em;margin:0}" +
    "#ep-box .alt{font-size:14px;color:#3A4357;border-top:1px solid #D8CDB8;padding-top:12px;margin:12px 0 0}" +
    "#ep-box .alt a,#ep-box .msg a{color:#0B1220;font-weight:700}" +
    "#ep-x{position:absolute;top:10px;right:12px;background:transparent;border:0;font-size:26px;line-height:1;cursor:pointer;color:#0B1220;padding:6px}" +
    ".ep-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}" +
    "@media (max-width:440px){#ep-box .cov img{width:96px}}";

  var ov, box, lastFocus;
  function build() {
    if (ov) return;
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    ov = document.createElement("div"); ov.id = "ep-ov"; ov.hidden = true;
    ov.innerHTML =
      '<div id="ep-box" role="dialog" aria-modal="true" aria-labelledby="ep-t">' +
      '<button type="button" id="ep-x" aria-label="Fermer">×</button>' +
      '<p class="k">EFA Études · rapport gratuit</p>' +
      '<h2 id="ep-t">' + CFG.titre + '</h2>' +
      '<div class="cov"><img src="' + CFG.couverture + '" alt="Couverture du rapport ' + CFG.titre + '" width="1280" height="720"><span>' + CFG.sous + '. 42 pages, 19 fiches pays.</span></div>' +
      '<div id="ep-f">' +
      '<p>Laissez votre email&nbsp;: le rapport complet en PDF s’affiche aussitôt.</p>' +
      '<form id="ep-form" novalidate>' +
      '<input type="text" id="ep-prenom" autocomplete="given-name" placeholder="Prénom (facultatif)" aria-label="Prénom">' +
      '<input type="email" id="ep-email" autocomplete="email" placeholder="Adresse email" aria-label="Adresse email" required>' +
      '<input class="ep-hp" type="text" name="email_address_check" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<label class="ck" for="ep-ok"><input type="checkbox" id="ep-ok" required><span>J’accepte de recevoir le rapport et «&nbsp;L’argent de la semaine&nbsp;», la lettre EFA du mardi. Désinscription en un clic. <a href="confidentialite.html">Vos données</a></span></label>' +
      '<button class="go" type="submit">Recevoir le rapport (PDF)</button>' +
      '<p class="msg" id="ep-msg" role="status" aria-live="polite"></p>' +
      '</form></div>' +
      '<div id="ep-ok-z" hidden>' +
      '<p><b>Merci, votre rapport est prêt.</b></p>' +
      '<a class="dl" id="ep-dl" href="' + CFG.pdf + '" target="_blank" rel="noopener">Ouvrir le rapport PDF</a>' +
      '<p id="ep-conf">Un email de confirmation va arriver (regardez aussi Promotions et Spam)&nbsp;: confirmez pour recevoir la lettre du mardi et les prochaines études.</p>' +
      '</div>' +
      '<p class="alt">L’étude se poursuit avec vous&nbsp;: <a href="' + CFG.enquete + '" target="_blank" rel="noopener" data-ep-enq>répondez à l’enquête «&nbsp;L’argent de la tontine&nbsp;»</a> (tontine ou pas, 3 minutes).</p>' +
      '</div>';
    document.body.appendChild(ov);
    box = document.getElementById("ep-box");
    document.getElementById("ep-x").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function (e) { if (!ov.hidden && e.key === "Escape") close(); });
    document.getElementById("ep-dl").addEventListener("click", function () { compte("etude1-pdf-ouvert"); });
    box.querySelector("[data-ep-enq]").addEventListener("click", function () { compte("etude1-enquete"); });
    var f = document.getElementById("ep-form"), m = document.getElementById("ep-msg"), b = f.querySelector(".go");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = document.getElementById("ep-email").value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { m.textContent = "Saisissez une adresse email valide."; return; }
      if (!document.getElementById("ep-ok").checked) { m.textContent = "Cochez la case pour recevoir le rapport."; return; }
      if (f.email_address_check.value) return;
      var d = new FormData();
      d.append("EMAIL", em); d.append("PRENOM", document.getElementById("ep-prenom").value.trim());
      d.append("email_address_check", ""); d.append("locale", "fr");
      b.disabled = true; m.textContent = "Envoi en cours…"; compte("etude1-email");
      fetch(CFG.brevo, { method: "POST", body: d, mode: "no-cors" }).then(function () {
        noter(); f.reset(); m.textContent = ""; show(true);
      }).catch(function () {
        m.textContent = "L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez.";
      }).then(function () { b.disabled = false; });
    });
  }
  function show(ok) {
    document.getElementById("ep-f").hidden = ok;
    document.getElementById("ep-ok-z").hidden = !ok;
    if (ok) document.getElementById("ep-conf").hidden = false;
    (ok ? document.getElementById("ep-dl") : document.getElementById("ep-email")).focus();
  }
  function open() {
    build(); lastFocus = document.activeElement; ov.hidden = false;
    document.documentElement.style.overflow = "hidden";
    compte("etude1-fenetre");
    if (deja()) { document.getElementById("ep-f").hidden = true; document.getElementById("ep-ok-z").hidden = false; document.getElementById("ep-conf").hidden = true; document.getElementById("ep-dl").focus(); }
    else show(false);
  }
  function close() { ov.hidden = true; document.documentElement.style.overflow = ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-etude-pdf]");
    if (!t) return; e.preventDefault(); open();
  });
  window.efaEtudePdf = open;
})();
