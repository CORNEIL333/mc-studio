/* MC Studio — page Pack Prestige (luxe florale) : bulles de cristal, compte à rebours, zoom des chapitres, cockpit animé */
(() => {
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Compte à rebours jusqu'au 31 décembre ---------- */
  const pad = n => String(n).padStart(2, '0');
  const boxes = $$('[data-countdown]');
  const tick = () => boxes.forEach(c => {
    const s = Math.floor(Math.max(0, new Date(c.dataset.countdown) - Date.now()) / 1000);
    c.querySelector('[data-d]').textContent = pad(Math.floor(s / 86400));
    c.querySelector('[data-h]').textContent = pad(Math.floor(s / 3600) % 24);
    c.querySelector('[data-m]').textContent = pad(Math.floor(s / 60) % 60);
    c.querySelector('[data-s]').textContent = pad(s % 60);
  });
  if (boxes.length) { tick(); setInterval(tick, 1000); }

  /* ---------- Bulles de cristal qui montent lentement sur les photos ---------- */
  const scenes = $$('canvas.bubbles').map(cv => {
    const ctx = cv.getContext('2d'), n = +cv.dataset.bubbles || 16;
    let w = 0, h = 0, dpr = 1, visible = false;
    const resize = () => { dpr = Math.min(devicePixelRatio, 2); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); addEventListener('resize', resize);
    const make = (y) => ({ x: Math.random() * w, y: y ?? h + 40, r: 6 + Math.random() * 26, v: .15 + Math.random() * .45, sw: Math.random() * Math.PI * 2 });
    const list = Array.from({ length: n }, () => make(Math.random() * h));
    new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(cv);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      list.forEach(b => {
        if (!reduce) { b.y -= b.v; b.sw += .01; b.x += Math.sin(b.sw) * .3; }
        if (b.y < -60) Object.assign(b, make());
        // Bulle : contour lumineux, cœur transparent, reflet
        const g = ctx.createRadialGradient(b.x - b.r * .35, b.y - b.r * .35, b.r * .1, b.x, b.y, b.r);
        g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.35, 'rgba(255,255,255,.06)'); g.addColorStop(.85, 'rgba(255,240,230,.10)'); g.addColorStop(1, 'rgba(255,255,255,.45)');
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(b.x - b.r * .38, b.y - b.r * .42, b.r * .18, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fill();
      });
    };
    return { draw, get visible() { return visible; } };
  });
  if (scenes.length) {
    const loop = () => { scenes.forEach(s => s.visible && s.draw()); requestAnimationFrame(loop); };
    if (reduce) setTimeout(() => scenes.forEach(s => s.draw()), 500); else requestAnimationFrame(loop);
  }

  /* ---------- Animations au défilement ---------- */
  document.addEventListener('mc:ready', () => {
    if (!window.gsap || reduce) return;
    // Zoom lent des photos de chapitre
    $$('[data-zoom]').forEach(img => gsap.fromTo(img, { yPercent: -8, scale: 1.12 }, { yPercent: 4, scale: 1, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    // Barres du cockpit qui montent
    const bars = $$('.lx-dash__chart i');
    if (bars.length) gsap.from(bars, { scaleY: .05, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.lx-dash', start: 'top 80%', once: true } });
  });
})();
