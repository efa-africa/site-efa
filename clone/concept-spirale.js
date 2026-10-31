/* EFA · Le Cercle et la Spirale : 12 points (le cercle), une spirale de points bleus qui grossissent,
   et le point corail qui parcourt la spirale du centre vers l'extérieur, puis repart. */
(function () {
  var cv = document.getElementById('cs-cv'); if (!cv) return;
  var c = cv.getContext('2d'), S = cv.width, C = S / 2, R = S * .42, M = 46, TOURS = 2.6;
  var calme = matchMedia('(prefers-reduced-motion: reduce)').matches, t0 = null, DUREE = 7000, PAUSE = 1100;
  function pt(q) { var a = -Math.PI / 2 + q * TOURS * 2 * Math.PI, r = R * (.08 + .82 * Math.pow(q, .8)); return [C + Math.cos(a) * r, C + Math.sin(a) * r]; }
  function dot(x, y, r, col) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = col; c.fill(); }
  function dessiner(q) {
    c.clearRect(0, 0, S, S);
    for (var k = 0; k < 12; k++) { var a = -Math.PI / 2 + k * Math.PI / 6; dot(C + Math.cos(a) * R, C + Math.sin(a) * R, S * .018, '#2A3550'); }
    for (var i = 0; i < M; i++) { var u = i / (M - 1), p = pt(u); dot(p[0], p[1], S * (.006 + .02 * u), u <= q ? '#2188D6' : '#A9D3F5'); }
    var p2 = pt(q), rr = S * (.016 + .014 * q), g = c.createRadialGradient(p2[0], p2[1], 0, p2[0], p2[1], S * .08);
    g.addColorStop(0, 'rgba(240,96,63,.55)'); g.addColorStop(1, 'rgba(240,96,63,0)'); c.fillStyle = g; c.fillRect(0, 0, S, S);
    dot(p2[0], p2[1], rr, '#F0603F');
  }
  var vu = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { vu = e[0].isIntersecting; }).observe(cv);
  function boucle(t) {
    if (t0 === null) t0 = t;
    var d = (t - t0) % (DUREE + PAUSE), q = Math.min(1, d / DUREE);
    q = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
    if (vu) dessiner(q);
    requestAnimationFrame(boucle);
  }
  dessiner(1); if (!calme) requestAnimationFrame(boucle);
})();
