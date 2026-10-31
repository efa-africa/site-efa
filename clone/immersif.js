/* EFA · Entrées immersives sur téléphone : la photo d'abord, seule, avec un bouton « Découvrir ».
   Le texte et les boutons passent sous la photo. Sur ordinateur, rien ne change. */
(function () {
  var C = [
    { s: '.me', m: '.me picture', v: '.me-voile', t: '.me-txt' },
    { s: '.au-hero', m: '.au-hero-img', v: '.au-hero-voile', t: '.au-hero-txt', all: true },
    { s: '.nw-hero', m: '.nw-hero-img', v: '.nw-hero-voile', t: '.nw-hero-txt' },
    { s: '.at-entree', m: '.at-entree-img', v: '.at-entree-voile', t: '.at-entree-txt' },
    { s: '.tr-entree', m: '.tr-entree-img', v: '.tr-entree-voile', t: '.tr-entree-txt' },
    { s: '.sg-entree', m: '.sg-entree-img', v: '.sg-entree-voile', t: '.sg-entree-txt' },
    { s: '.cover', m: '.cover-image', v: '.cover-shade', t: '.cover-copy', x: '.cover-top,.scroll-prompt' },
    { s: 'section.hero', m: '.hero-image', v: '.hero-overlay', t: '.hero-copy', x: '.hero-meta,.scroll' }
  ];
  function poser() {
    C.forEach(function (c) {
      var S = document.querySelector(c.s); if (!S || S.dataset.imm) return;
      var M = S.querySelector(c.m), T = S.querySelector(c.t); if (!M || !T) return;
      S.dataset.imm = '1'; S.classList.add('imm'); if (c.all) S.classList.add('imm-all');
      M.classList.add('imm-media'); var V = c.v && S.querySelector(c.v); if (V) V.classList.add('imm-voile');
      T.classList.add('imm-txt'); if (!T.id) T.id = 'imm-txt';
      if (c.x) S.querySelectorAll(c.x).forEach(function (e) { e.classList.add('imm-cache'); });
      var B = document.createElement('a'); B.className = 'imm-dec'; B.href = '#' + T.id;
      B.innerHTML = 'Découvrir <span aria-hidden="true">↓</span>';
      B.addEventListener('click', function (e) { e.preventDefault(); var h = document.querySelector('header'), hh = h && getComputedStyle(h).position !== 'static' ? h.offsetHeight : 0; scrollTo({ top: T.getBoundingClientRect().top + scrollY - hh, behavior: 'smooth' }); });
      S.appendChild(B);
      hauteur(S);
    });
  }
  var largeur = innerWidth;
  function hauteur(S) { var top = S.getBoundingClientRect().top + scrollY; S.style.setProperty('--imm-top', Math.round(top) + 'px'); }
  function toutes() { document.querySelectorAll('.imm').forEach(hauteur); }
  addEventListener('resize', function () { if (innerWidth !== largeur) { largeur = innerWidth; toutes(); } });
  addEventListener('orientationchange', function () { setTimeout(toutes, 300); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poser); else poser();
})();
