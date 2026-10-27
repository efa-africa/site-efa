/* EFA · rappel de confidentialité à côté de chaque saisie de chiffres.
   Partout où l'on demande un montant, une phrase courte rappelle que les chiffres restent
   sur le téléphone et qu'on peut saisir des montants fictifs, proches de la réalité.
   Placé une fois par bloc de saisie, y compris dans les écrans affichés plus tard. */
(function () {
  if (window.EFA_CHIFFRES) return; window.EFA_CHIFFRES = true;
  var page = (location.pathname.split("/").pop() || "index").replace(/^([^.]+)$/, "$1.html");
  if (/^(traders|admin-ecole|programme-organisation|espace-organisation|rejoindre|tableau-ely)\.html$/.test(page)) return;
  var TXT = page === "diagnostic.html"
    ? "<b>Vos montants restent sur votre téléphone.</b> EFA ne les garde pas. Si vous demandez votre résultat par email, seuls vos scores et des pourcentages sont transmis, jamais vos montants. Vous pouvez aussi mettre des chiffres fictifs, proches de votre réalité."
    : "<b>Vos chiffres restent sur votre téléphone.</b> EFA ne les garde pas. Vous pouvez aussi mettre des chiffres fictifs, proches de votre réalité.";
  var css = document.createElement("style");
  css.textContent = ".efa-local{display:flex;gap:10px;align-items:flex-start;margin:10px 0 12px;padding:10px 14px;border-radius:10px;background:rgba(127,127,127,.13);font:400 14px/1.45 'Source Sans 3','Source Sans Pro',system-ui,sans-serif;color:inherit;text-align:left;max-width:62ch;grid-column:1/-1}" +
    ".efa-local b{font-weight:800}.efa-local svg{flex:none;width:16px;height:16px;margin-top:2px;opacity:.85}";
  document.head.appendChild(css);
  var ICONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var SEL = 'input[inputmode="numeric"],input[inputmode="decimal"],input[type="number"]';
  function bloc(inp) {
    var ordre = ["form", ".exo", "section", ".texte", ".calc", ".champs", ".champs3", ".grille2", "fieldset"];
    for (var k = 0; k < ordre.length; k++) { var x = inp.closest(ordre[k]); if (x && x !== document.body) return x; }
    return inp.parentElement;
  }
  function poser(root) {
    var vus = [];
    (root.querySelectorAll ? root : document).querySelectorAll(SEL).forEach(function (inp) {
      if (inp.closest("[data-sans-note-chiffres]") || inp.type === "hidden") return;
      var b = bloc(inp); if (!b || vus.indexOf(b) >= 0) return; vus.push(b);
      if (b.querySelector(".efa-local") || b.closest(".efa-local-fait")) return;
      var t = (b.textContent || "").toLowerCase();
      if (/(ne les garde pas|restent sur (ce|votre) téléphone|reste sur ce téléphone)/.test(t) && b.querySelector(".efa-local")) return;
      var n = document.createElement("p"); n.className = "efa-local"; n.innerHTML = ICONE + "<span>" + TXT + "</span>";
      /* avant la première étiquette ou le premier champ du bloc */
      var lab = inp.closest("label") || inp;
      var avant = lab; while (avant.parentElement && avant.parentElement !== b) avant = avant.parentElement;
      if (avant.parentElement === b) b.insertBefore(n, avant); else b.insertBefore(n, b.firstChild);
      b.classList.add("efa-local-fait");
    });
  }
  function go() {
    poser(document);
    if (window.MutationObserver) {
      var t = null;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { poser(document); }, 60); })
        .observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
