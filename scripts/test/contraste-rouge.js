// Contrôle : aucun texte sombre ou bleu sur un fond rouge (règle d’Élysée, 21 nov. 2026 : sur du rouge, le texte est blanc).
// Lancer : python3 -m http.server 8765 (à la racine), puis node scripts/test/contraste-rouge.js
const { chromium } = require('playwright');
const P = ['index.html','prochain-pas.html?q=comment%20sortir%20de%20mes%20dettes','prochain-pas.html?q=seuil%20de%20rentabilit%C3%A9','prochain-pas.html?q=je%20veux%20investir','questions.html','cent-outils.html','apprendre.html','ma-brvm.html','mon-vrai-reste.html','mes-dettes.html','puis-je-aider.html','mon-idee-test.html','mon-patrimoine.html','promesse-credible.html','journal-decisions.html','mon-annee.html','bvmac.html','mon-efa.html','news.html','news/2026-11-21-plus-forte-baisse-depuis-2023.html','ou-est-passe-mon-argent.html','generateur-de-projet.html','diagnostic.html','cout-total-credit.html','epargner.html','ateliers.html','outils.html','bourse.html','marches.html','abonnement.html'];
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } }); let tot = 0;
  for (const u of P) { await p.goto('http://localhost:8765/' + u); await p.waitForTimeout(1300);
    const R = await p.evaluate(() => { const out = []; const rgb = s => (s.match(/\d+(\.\d+)?/g) || []).map(Number);
      for (const el of document.querySelectorAll('a,button,span,p,b,div,summary,label')) { const c = getComputedStyle(el); const bg = rgb(c.backgroundColor); if (bg.length < 3 || (bg[3] !== undefined && bg[3] < 0.9)) continue;
        if (!(bg[0] > 185 && bg[1] < 105 && bg[2] < 95)) continue; const r = el.getBoundingClientRect(); if (r.width < 20 || r.height < 12) continue;
        const txt = [...el.querySelectorAll('*'), el].filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
        for (const x of txt) { const f = rgb(getComputedStyle(x).color); const lum = (0.299 * f[0] + 0.587 * f[1] + 0.114 * f[2]); if (lum < 200) { out.push((x.className || x.tagName).toString().slice(0, 40) + ' « ' + x.textContent.trim().slice(0, 40) + ' » ' + getComputedStyle(x).color); break; } } }
      return [...new Set(out)]; });
    if (R.length) { tot += R.length; console.log(u.slice(0, 50), '\n   ' + R.slice(0, 6).join('\n   ')); } }
  console.log('Textes sombres sur fond rouge :', tot); await b.close(); })();
