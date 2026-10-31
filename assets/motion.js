/* MC Studio — page Motion : collage animé (bords déchirés, timecode, parallaxe, animations « image par image ») */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Bords de papier déchiré ---------- */
  const tornPolygon = () => {
    const j = () => (Math.random() * 2.4).toFixed(2), pts = [], step = 3.5;
    for (let x = 0; x <= 100; x += step) pts.push(`${x}% ${j()}%`);
    for (let y = 0; y <= 100; y += step) pts.push(`${100 - j()}% ${y}%`);
    for (let x = 100; x >= 0; x -= step) pts.push(`${x}% ${100 - j()}%`);
    for (let y = 100; y >= 0; y -= step) pts.push(`${j()}% ${y}%`);
    return `polygon(${pts.join(',')})`;
  };
  $$('[data-torn]').forEach(el => {
    // Le ruban adhésif doit dépasser du papier : on déchire seulement le contenu
    if ($('.tape', el)) {
      const inner = document.createElement('div'); inner.className = 'torn-inner';
      [...el.childNodes].filter(n => !(n.classList && n.classList.contains('tape'))).forEach(n => inner.appendChild(n));
      el.appendChild(inner); inner.style.clipPath = tornPolygon();
    } else el.style.clipPath = tornPolygon();
  });

  /* ---------- Timecode 24 i/s ---------- */
  const tc = $('[data-timecode]');
  if (tc) {
    const t0 = performance.now(), p = n => String(n).padStart(2, '0');
    const tick = now => {
      const f = Math.floor((now - t0) / 1000 * 24);
      tc.textContent = `${p(Math.floor(f / 86400))}:${p(Math.floor(f / 1440) % 60)}:${p(Math.floor(f / 24) % 60)}:${p(f % 24)}`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Parallaxe souris (propriété translate, compatible avec le tremblement CSS) ---------- */
  const layers = $$('[data-depth]').map(el => ({ el, d: +el.dataset.depth, x: 0, y: 0 }));
  if (layers.length && !reduce && matchMedia('(hover: hover)').matches) {
    const m = { x: 0, y: 0 };
    addEventListener('pointermove', e => { m.x = e.clientX / innerWidth - .5; m.y = e.clientY / innerHeight - .5; }, { passive: true });
    const loop = () => {
      layers.forEach(l => { l.x += (m.x * l.d - l.x) * .08; l.y += (m.y * l.d - l.y) * .08; l.el.style.translate = `${l.x.toFixed(1)}px ${l.y.toFixed(1)}px`; });
      requestAnimationFrame(loop);
    };
    loop();
  }

  if (reduce || !window.gsap) return;

  /* ---------- Animations, lancées une fois la page affichée ---------- */
  document.addEventListener('mc:ready', () => {
    const stop = n => `steps(${n})`;
    const reveal = (targets, vars, trigger) => gsap.from(targets, { opacity: 0, duration: .7, stagger: .09, ease: stop(5), clearProps: 'transform,opacity,top', ...vars,
      scrollTrigger: trigger ? { trigger, start: 'top 82%', once: true } : undefined });

    // Héros : les lettres tombent sur la table, les photos se posent
    gsap.set('.rl', { position: 'relative' });
    gsap.from('.rl', { top: -140, opacity: 0, duration: .55, stagger: .09, ease: stop(5) });
    gsap.from('.mo-strip', { opacity: 0, scaleX: .2, duration: .5, delay: .6, ease: stop(4), clearProps: 'all' });
    gsap.from('.mo-cut, .mo-hero .sticker', { opacity: 0, scale: 1.4, duration: .45, stagger: .12, delay: .5, ease: stop(4), clearProps: 'scale,opacity' });
    gsap.from('.mo-note, .mo-hero .btn-row', { opacity: 0, y: 20, duration: .6, stagger: .1, delay: .9, ease: stop(4), clearProps: 'all' });
    $$('[data-draw]').forEach(p => { const len = p.getTotalLength(); gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.2, delay: 1.4, ease: stop(12) }); });

    // Manifeste : les mots se collent un par un
    reveal('.mo-w', { y: 30, rotation: () => gsap.utils.random(-14, 14), stagger: .05, ease: stop(3) }, '.mo-manifesto__text');

    // Showreel : polaroids jetés sur la table
    reveal('.polaroid', { y: 120, rotation: () => gsap.utils.random(-18, 18), duration: .8, stagger: .15, ease: stop(6) }, '.mo-reel__grid');

    // Typo cinétique : les lettres éparpillées s'assemblent au défilement
    const kin = $('.mo-kinetic');
    if (kin) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: kin, start: 'top top', end: 'bottom bottom', scrub: .6 } });
      $$('.kl:not(.kl--sp)', kin).forEach(l => tl.from(l, { x: gsap.utils.random(-45, 45) + 'vw', y: gsap.utils.random(-40, 40) + 'vh', rotation: gsap.utils.random(-120, 120), scale: gsap.utils.random(.3, 1.8), ease: 'none' }, 0));
      $$('.mo-kinetic__scrap', kin).forEach((s, i) => tl.fromTo(s, { rotation: i % 2 ? -25 : 25, scale: .6 }, { rotation: i % 2 ? 12 : -10, scale: 1.1, ease: 'none' }, 0));
      tl.to('.mo-kinetic__caption', { opacity: 0, ease: 'none' }, .6);
    }

    // Formats & tickets
    reveal('.fmt', { y: 80, rotation: () => gsap.utils.random(-10, 10) }, '.mo-formats__grid');
    reveal('.durations span', { scale: 0, stagger: .06, ease: stop(3), clearProps: 'scale,opacity' }, '.durations');
    reveal('.ticket', { x: (i) => i ? 120 : -120, duration: .8, ease: stop(6) }, '.mo-tickets');
  });
})();
