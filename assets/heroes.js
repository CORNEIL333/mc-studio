/* MC Studio — animations des en-têtes : orbite des expertises (Services), titre qui s'écrit (Studio) */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Orbite : les pastilles tournent sur deux ellipses ---------- */
  const stage = document.querySelector('.h-orbit');
  if (stage) {
    const items = [...stage.querySelectorAll('.orbiter')];
    const place = t => {
      const w = stage.clientWidth, h = stage.clientHeight;
      items.forEach((el, i) => {
        const outer = i % 2 === 0;
        const rx = Math.min(outer ? 590 : 440, w * (outer ? .46 : .36));
        const ry = Math.min(outer ? 300 : 225, h * (outer ? .36 : .27));
        const a = (i / items.length) * Math.PI * 2 + t * (outer ? .00012 : -.00016);
        el.style.transform = `translate(${(Math.cos(a) * rx).toFixed(1)}px, ${(Math.sin(a) * ry).toFixed(1)}px)`;
        el.style.zIndex = 1;
        el.style.opacity = Math.abs(Math.cos(a)) > .45 ? 1 : .35;
      });
    };
    if (reduce) place(0);
    else { const loop = t => { place(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  }

  /* ---------- Titre qui s'écrit tout seul ---------- */
  document.querySelectorAll('[data-typer]').forEach(el => {
    const words = el.dataset.typer.split('|');
    if (reduce) { el.textContent = words[0]; return; }
    let w = 0, i = 0, del = false;
    const step = () => {
      const word = words[w];
      i += del ? -1 : 1;
      el.textContent = word.slice(0, i);
      let wait = del ? 45 : 90;
      if (!del && i === word.length) { del = true; wait = 1700; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 300; }
      setTimeout(step, wait);
    };
    step();
  });
})();
