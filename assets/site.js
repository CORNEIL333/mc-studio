/* MC Studio — interactions partagées par toutes les pages du prototype */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const page = document.body.dataset.page || 'home';
  const nav = document.body.dataset.nav || page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover)').matches;
  const WA = '237679278776';

  /* ---------- Chrome commun : nav, menu, curseur, transition, footer ---------- */
  const links = [['studio', 'Studio'], ['services', 'Services'], ['produits', 'Produits'], ['offres', 'Offres'], ['realisations', 'Projets'], ['motion', 'Motion']];
  const logo = '<img src="public/brand/mc-logo.svg" alt="MC Studio" width="56" height="45">';
  const act = k => (k === nav ? ' is-active' : '');
  const roll = t => `<span class="roll"><span>${t}</span><span>${t}</span></span>`;
  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip mono" href="#top">Aller au contenu</a>
    <div class="progress" aria-hidden="true"><i></i></div>
    ${page !== 'contact' ? `<a class="wa-float" href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="Écrire sur WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-4.4A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8.5 9.5c.3 2.6 2.4 4.8 5 5.2l1.2-1.3 1.8.8-.4 1.6c-3.9.4-8-3.5-7.8-7.5l1.6-.4.8 1.8-1.2 1.3"/></svg><span>WhatsApp</span></a>` : ''}
    <div class="transition" aria-hidden="true"><b>MC</b><span class="mono">Creative engineering</span></div>
    <div class="preview" aria-hidden="true"></div>
    <header class="nav"><div class="nav__bar"></div>
      <a href="index.html" class="logo" aria-label="MC Studio, accueil">${logo}</a>
      <nav class="nav__links mono" aria-label="Principale">${links.map(([k, l]) => `<a class="${act(k)}" href="${k}.html">${roll(l)}</a>`).join('')}</nav>
      <div class="nav__right">
        <span class="nav__clock mono">Douala <span data-clock>--:--</span></span>
        <a class="btn" href="contact.html"><span>Démarrer un projet</span><span>→</span></a>
        <button class="burger" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
      </div>
    </header>
    <div class="menu" aria-hidden="true">
      ${[['index', 'Accueil'], ...links, ['prestige', 'Offre fin d’année'], ['faq', 'FAQ'], ['contact', 'Contact']].map(([k, l], i) => `<a class="menu__link${act(k === 'index' ? 'home' : k)}" href="${k}.html"><span class="mono">${String(i + 1).padStart(2, '0')}</span><b>${l}</b></a>`).join('')}
      <div class="menu__foot mono"><a href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp ↗</a><span>+237 656 95 97 08</span></div>
    </div>`);

  const sitemap = `
    <footer class="sitemap">
      <div class="sitemap__brand"><a href="index.html" class="logo">${logo}</a>
        <p>Studio de creative engineering au Cameroun : branding, contenus, sites web et motion design pour les marques qui veulent compter.</p></div>
      <div><h4 class="mono">Explorer</h4><ul><li><a href="studio.html">Le studio</a></li><li><a href="services.html">Services</a></li><li><a href="realisations.html">Projets</a></li><li><a href="motion.html">Motion</a></li></ul></div>
      <div><h4 class="mono">Acheter</h4><ul><li><a href="produits.html">Produits signature</a></li><li><a href="offres.html">Offres & packs</a></li><li><a href="offres.html#quiz">Trouver mon offre</a></li><li><a href="prestige.html">✦ Pack Prestige Salons</a></li></ul></div>
      <div><h4 class="mono">Aide</h4><ul><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact</a></li><li><a href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="mailto:miguelcorneil441@gmail.com">E-mail</a></li></ul></div>
      <div class="sitemap__word" aria-hidden="true">MC Studio ✦ MC Studio</div>
      <div class="sitemap__legal mono"><span>© 2026 MC Studio — Cameroun</span><span>Prix en FCFA, indicatifs, confirmés sur devis</span><a href="#top" data-scroll>Haut de page ↑</a></div>
    </footer>`;
  if (page !== 'contact') {
    $('main').insertAdjacentHTML('beforeend', `
      <section class="cta" data-bg="halftone" data-theme="lime">
        <span class="eyebrow" style="color:var(--ink)">Contact · Réponse sous 24 h</span>
        <h2 class="cta__title" data-split><span class="line"><span>Parlons.</span></span></h2>
        <div class="cta__row">
          <p>Un projet de marque, de site ou de vidéo ? Décrivez votre besoin, vous recevrez une première direction claire et un devis détaillé.</p>
          <a class="magnetic" href="contact.html"><span>Démarrer →</span></a>
        </div>
      </section>`);
  }
  $('main').insertAdjacentHTML('afterend', sitemap);

  // Badge promo de fin d'année (masquable, mémorisé par visiteur)
  let promoHidden = false;
  try { promoHidden = localStorage.getItem('mc-promo-prestige') === 'off'; } catch (_) {}
  if (page !== 'prestige' && !promoHidden) {
    document.body.insertAdjacentHTML('beforeend', `<div class="promo-pill"><a class="pc" href="prestige.html" aria-label="Offre de fin d'année : Pack Prestige salons et spas, précommande"><span class="pc-tape" aria-hidden="true"></span><span class="pc-ransom" aria-hidden="true"><i>P</i><i>r</i><i>O</i><i>M</i><i>o</i></span><span class="pc-note" aria-hidden="true">Pack Prestige<br>salons &amp; spas →</span><span class="pc-stamp" aria-hidden="true">fin<br>d'année</span></a><button type="button" class="pc-close" aria-label="Masquer l'offre">×</button></div>`);
    $('.promo-pill .pc-close').addEventListener('click', () => { $('.promo-pill').remove(); try { localStorage.setItem('mc-promo-prestige', 'off'); } catch (_) {} });
  }

  // Horloge
  const tick = () => $$('[data-clock]').forEach(c => c.textContent = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Africa/Douala', hour: '2-digit', minute: '2-digit' }).format(new Date()));
  tick(); setInterval(tick, 10000);

  /* ---------- Fonctionnalités indépendantes de GSAP ---------- */
  const form = $('#brief');
  if (form) {
    const q = new URLSearchParams(location.search);
    const subject = q.get('offre') || q.get('projet');
    if (subject) { const s = $('.subject'); s.classList.add('is-on'); s.querySelector('b').textContent = subject; }
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const msg = `Bonjour Miguel, je souhaite discuter de : ${subject || d.get('project')}.\nMon budget : ${d.get('budget')}.\nMon délai : ${d.get('delay')}.\nJe m'appelle ${d.get('name')}.\nMon contact : ${d.get('contact')}.\nMessage : ${d.get('message') || 'À préciser ensemble'}.`;
      const waUrl = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`; window.open(waUrl, '_blank');
      window.MCLeads?.save({ kind: 'contact', name: d.get('name'), contact: d.get('contact'), subject: subject || d.get('project'), budget: d.get('budget'), delay: d.get('delay'), message: d.get('message'), website: d.get('website') });
      const sent = $('.sent'); sent.innerHTML = `Votre demande est prête. <a class="link-arrow" href="${waUrl}" target="_blank" rel="noopener">Ouvrir WhatsApp <b>↗</b></a>`; sent.classList.add('is-on');
    });
  }

  // Formulaire de précommande (page produit phare) → WhatsApp + CRM
  const pre = $('#precommande');
  if (pre) pre.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(pre);
    const services = d.getAll('services');
    const msg = `Bonjour MC Studio, je souhaite précommander le Pack Intégral Digitalisation Prestige.\nÉtablissement : ${d.get('company')} (${d.get('type')}).\nVille / quartier : ${d.get('city')}.\nNombre de salons : ${d.get('salons')} · Employés : ${d.get('staff')}.\nPrestations : ${services.join(', ') || 'à préciser'}.\nJe m'appelle ${d.get('name')}, contact : ${d.get('contact')}.\n${d.get('message') ? 'Message : ' + d.get('message') : 'Je souhaite planifier la démo gratuite de 15 minutes.'}`;
    const waUrl = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`; window.open(waUrl, '_blank');
    window.MCLeads?.save({ kind: 'precommande', name: d.get('name'), contact: d.get('contact'), company: d.get('company'), city: d.get('city'), subject: 'Pack Intégral Digitalisation Prestige', message: d.get('message'), website: d.get('website'),
      details: { type: d.get('type'), salons: d.get('salons'), employes: d.get('staff'), prestations: services } });
    const ps = $('.pre-sent'); ps.innerHTML = `✓ Merci ! Votre précommande est prête. <a href="${waUrl}" target="_blank" rel="noopener" style="font-weight:700;text-decoration:underline">Envoyer sur WhatsApp ↗</a> — nous vous recontactons sous 24 h pour la démo.`; ps.classList.add('is-on');
  });

  // Filtres génériques : <div class="filters" data-target="#id"> + éléments [data-cat="a|b"]
  $$('.filters[data-target]').forEach(group => {
    const target = $(group.dataset.target);
    $$('.filter', group).forEach(f => f.addEventListener('click', () => {
      $$('.filter', group).forEach(x => x.classList.toggle('is-active', x === f));
      const cat = f.dataset.filter;
      const items = $$('[data-cat]', target);
      const show = items.filter(c => cat === 'all' || c.dataset.cat.split('|').includes(cat));
      items.forEach(c => c.classList.toggle('is-hidden', !show.includes(c)));
      if (window.gsap && !reduce) gsap.fromTo(show, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .05, ease: 'expo.out', overwrite: true });
      window.ScrollTrigger?.refresh();
    }));
  });

  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) {
    $$('.loader, .transition').forEach(el => el.remove());
    $$('.page-hero__media, .film__media, .reveal__frame').forEach(el => el.style.clipPath = 'none');
    $$('.word').forEach(el => el.style.opacity = 1);
    $$('.acc__head').forEach(h => h.addEventListener('click', () => { const b = h.nextElementSibling; const o = b.style.height !== 'auto'; b.style.height = o ? 'auto' : '0'; h.parentElement.classList.toggle('is-open', o); }));
    document.body.classList.remove('loading');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: !reduce });
  lenis.stop();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-scroll], a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href'); if (!id || !id.startsWith('#') || id === '#') return;
    e.preventDefault(); lenis.scrollTo(id === '#top' ? 0 : id, { duration: 1.6, offset: -20 });
  });

  /* ---------- Nav : fond au défilement, masquée en descendant ---------- */
  const navEl = $('.nav');
  let lastY = 0;
  const prog = $('.progress i');
  lenis.on('scroll', ({ scroll, limit }) => {
    prog.style.transform = `scaleX(${limit ? scroll / limit : 0})`;
    navEl.classList.toggle('is-solid', scroll > 60);
    if (!document.body.classList.contains('menu-open')) navEl.classList.toggle('is-hidden', scroll > lastY && scroll > 400);
    lastY = scroll;
  });

  /* ---------- Découpage du texte ---------- */
  const splitText = (root, cls, byWord) => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType !== 3) return walk(n);
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return;
        if (!w.trim()) return frag.appendChild(document.createTextNode(' '));
        const s = document.createElement('span');
        if (byWord) { s.className = cls; s.textContent = w; }
        else {
          s.className = 'wd';
          [...w].forEach(c => { const ch = document.createElement('span'); ch.className = cls; ch.textContent = c; s.appendChild(ch); });
        }
        frag.appendChild(s);
      });
      n.replaceWith(frag);
    });
    walk(root);
  };
  $$('[data-split] .line > span').forEach(el => splitText(el, 'char', false));
  $$('[data-words]').forEach(el => splitText(el, 'word', true));
  if (!reduce) gsap.set('[data-split] .char', { yPercent: 115 });

  $$('.hero__title .char').forEach(c => {
    c.addEventListener('mouseenter', () => { c.style.fontVariationSettings = '"wdth" 100'; c.style.color = 'var(--lime)'; });
    c.addEventListener('mouseleave', () => { c.style.fontVariationSettings = ''; c.style.color = ''; });
  });

  /* ---------- Menu mobile ---------- */
  const burger = $('.burger'), menu = $('.menu');
  const menuTl = gsap.timeline({ paused: true })
    .set(menu, { visibility: 'visible' })
    .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'expo.inOut' })
    .from('.menu__link b', { yPercent: 110, duration: .8, stagger: .04, ease: 'expo.out' }, '-=.35');
  burger.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    navEl.classList.remove('is-hidden');
    burger.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
    open ? (lenis.stop(), menuTl.timeScale(1).play()) : (lenis.start(), menuTl.timeScale(1.6).reverse());
  });

  /* ---------- Transitions entre pages ---------- */
  const transition = $('.transition');
  const isInternal = a => a.href && a.origin === location.origin && !a.target && /\.html([?#]|$)/.test(a.getAttribute('href')) && !a.hasAttribute('download');
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || !isInternal(a) || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
    e.preventDefault();
    lenis.stop();
    gsap.timeline({ onComplete: () => location.href = a.href })
      .set(transition, { yPercent: 100, display: 'flex' })
      .to(transition, { yPercent: 0, duration: reduce ? .2 : .75, ease: 'expo.inOut' });
  });
  addEventListener('pageshow', e => { if (e.persisted) { gsap.set(transition, { display: 'none' }); lenis.start(); } });

  /* ---------- Entrée de page ---------- */
  const loader = $('.loader');
  let firstVisit = false;
  try { firstVisit = page === 'home' && !sessionStorage.getItem('mc-seen'); sessionStorage.setItem('mc-seen', '1'); } catch (_) {}
  const enter = gsap.timeline();
  if (loader && firstVisit) {
    gsap.set(transition, { display: 'none' });
    const count = $('.loader__count'), n = { v: 0 };
    enter.to(n, { v: 100, duration: reduce ? .3 : 2, ease: 'power2.inOut', onUpdate: () => count.textContent = String(Math.round(n.v)).padStart(3, '0') })
      .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' });
  } else {
    loader?.remove();
    enter.to(transition, { yPercent: -100, duration: reduce ? .2 : 1, ease: 'expo.inOut', delay: .1 });
  }
  enter.add(() => {
    document.body.classList.remove('loading'); lenis.start(); ready();
    if (location.hash.length > 1 && $(location.hash)) setTimeout(() => lenis.scrollTo(location.hash, { duration: 1.4, offset: -20 }), 300);
  }, '-=.55').add(() => { loader?.remove(); gsap.set(transition, { display: 'none' }); });

  /* ---------- Cartes flottantes des compositions (parallaxe souris) ---------- */
  const floats = $$('[data-float]').map(el => ({ el, d: +el.dataset.float, x: 0, y: 0 }));
  if (floats.length && fine && !reduce) {
    const m = { x: 0, y: 0 };
    addEventListener('pointermove', e => { m.x = e.clientX / innerWidth - .5; m.y = e.clientY / innerHeight - .5; }, { passive: true });
    gsap.ticker.add(() => floats.forEach(f => { f.x += (m.x * f.d - f.x) * .07; f.y += (m.y * f.d - f.y) * .07; f.el.style.translate = `${f.x.toFixed(1)}px ${f.y.toFixed(1)}px`; }));
  }

  /* ---------- Boutons aimantés ---------- */
  $$('.magnetic').forEach(b => {
    const ease = 'elastic.out(1,.4)';
    const xt = gsap.quickTo(b, 'x', { duration: .6, ease }), yt = gsap.quickTo(b, 'y', { duration: .6, ease });
    const inner = b.querySelector('span');
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      xt(x * .4); yt(y * .4); gsap.to(inner, { x: x * .2, y: y * .2, duration: .4 });
    });
    b.addEventListener('pointerleave', () => { xt(0); yt(0); gsap.to(inner, { x: 0, y: 0, duration: .6, ease }); });
  });

  /* ---------- Aperçu image qui suit le curseur ---------- */
  if (fine && $('[data-img]')) {
    const pv = $('.preview');
    const px = gsap.quickTo(pv, 'x', { duration: .6, ease: 'power3' }), py = gsap.quickTo(pv, 'y', { duration: .6, ease: 'power3' });
    let last = null;
    addEventListener('pointermove', e => { px(e.clientX); py(e.clientY); });
    $$('[data-img]').forEach(s => {
      s.addEventListener('mouseenter', () => {
        if (last !== s.dataset.img) {
          const img = new Image(); img.alt = '';
          img.onerror = () => { if (s.dataset.fallback && img.src.indexOf(s.dataset.fallback) < 0) img.src = s.dataset.fallback; };
          img.src = s.dataset.img; pv.appendChild(img);
          gsap.fromTo(img, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .6, ease: 'expo.out', onComplete: () => { while (pv.children.length > 1) pv.firstChild.remove(); } });
          last = s.dataset.img;
        }
        gsap.to(pv, { opacity: 1, scale: 1, rotate: gsap.utils.random(-6, 6), duration: .5, ease: 'expo.out' });
      });
      s.addEventListener('mouseleave', () => gsap.to(pv, { opacity: 0, scale: .6, duration: .4, ease: 'power3.in' }));
    });
  }

  /* ---------- Accordéons ---------- */
  $$('.acc').forEach(item => {
    const head = $('.acc__head', item), body = $('.acc__body', item);
    head.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      $$('.acc.is-open', item.parentElement).forEach(o => { if (o !== item) { o.classList.remove('is-open'); $('.acc__head', o).setAttribute('aria-expanded', false); gsap.to($('.acc__body', o), { height: 0, duration: .7, ease: 'expo.inOut' }); } });
      item.classList.toggle('is-open', open); head.setAttribute('aria-expanded', open);
      gsap.to(body, { height: open ? 'auto' : 0, duration: .8, ease: 'expo.inOut', onComplete: () => ScrollTrigger.refresh() });
    });
  });

  /* ---------- Modale projet ---------- */
  const modal = $('.modal');
  if (modal) {
    const mTl = gsap.timeline({ paused: true })
      .set(modal, { visibility: 'visible' })
      .to('.modal__bg', { opacity: 1, duration: .4 })
      .fromTo('.modal__panel', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out' }, '<');
    let opener = null;
    const close = () => { mTl.timeScale(1.8).reverse(); lenis.start(); opener?.focus(); };
    $$('.grid .card').forEach(c => c.addEventListener('click', () => {
      opener = c;
      const src = $('img', c);
      const mi = $('.modal__media img'); mi.dataset.fallback = src.dataset.fallback || ''; mi.onerror = () => { mi.onerror = null; mi.src = mi.dataset.fallback; }; mi.src = src.currentSrc || src.src;
      $('.modal__cat').textContent = c.dataset.cat;
      $('.modal__title').textContent = $('h3', c).textContent;
      $('.modal__desc').textContent = c.dataset.desc;
      $('.modal__cta').href = 'contact.html?projet=' + encodeURIComponent($('h3', c).textContent);
      const demoBtn = $('.modal__demo');
      if (demoBtn) {
        if (c.dataset.demo) {
          demoBtn.href = c.dataset.demo;
          demoBtn.style.display = 'inline-flex';
          const txt = $('span', demoBtn);
          if (txt) txt.textContent = c.dataset.demoLabel || 'Tester la démo en direct';
          demoBtn.target = '_blank';
          demoBtn.rel = 'noopener';
        } else {
          demoBtn.style.display = 'none';
        }
      }
      lenis.stop(); mTl.timeScale(1).play(); $('.modal__close').focus();
    }));
    $('.modal__close').addEventListener('click', close);
    $('.modal__bg').addEventListener('click', close);
    addEventListener('keydown', e => { if (e.key === 'Escape' && mTl.progress() > 0) close(); });
  }

  /* ---------- Animations au défilement (après l'entrée) ---------- */
  function ready() {
    $$('[data-split]').forEach(el => {
      const chars = $$('.char', el); if (reduce || !chars.length) return;
      gsap.to(chars, { yPercent: 0, duration: 1.2, stagger: Math.min(.03, 1 / chars.length), ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });

    // Barre d'achat des fiches
    const buybar = $('.buybar');
    if (buybar) ScrollTrigger.create({ trigger: '.dhero', start: 'bottom 40%', endTrigger: '.cta', end: 'top bottom', onToggle: s => { buybar.classList.toggle('is-on', s.isActive); document.body.classList.toggle('has-buybar', s.isActive); } });

    // Compteurs
    $$('[data-count]').forEach(el => {
      const o = { v: 0 }, pad = el.dataset.pad ? +el.dataset.pad : 2;
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(o, { v: +el.dataset.count, duration: reduce ? .01 : 1.6, ease: 'power3.out', onUpdate: () => el.textContent = String(Math.round(o.v)).padStart(pad, '0') }) });
    });

    // Vidéos : lecture seulement à l'écran
    $$('video').forEach(v => ScrollTrigger.create({ trigger: v.closest('section') || v, start: 'top bottom', end: 'bottom top', onToggle: s => s.isActive ? v.play().catch(() => {}) : v.pause() }));

    if (reduce) { $$('.word').forEach(w => w.style.opacity = 1); document.dispatchEvent(new Event('mc:ready')); return; }

    if ($('[data-reveal]')) gsap.set('[data-reveal]', { opacity: 0 });
    if ($('[data-reveal]')) ScrollTrigger.batch('[data-reveal]', { start: 'top 92%', once: true, onEnter: els => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: .07, ease: 'expo.out' }) });

    $$('[data-words]').forEach(el => gsap.to($$('.word', el), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } }));

    $$('[data-parallax]').forEach(el => gsap.fromTo(el, { yPercent: -(+el.dataset.parallax) }, { yPercent: +el.dataset.parallax, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    $$('.page-hero__media').forEach(el => gsap.to(el, { clipPath: 'inset(0% 0 0 0 round 10px)', duration: 1.4, ease: 'expo.inOut', delay: .2 }));
    $$('.film__media').forEach(el => gsap.to(el, { clipPath: 'inset(0% 0% 0% 0% round 10px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 30%', scrub: true } }));
    $$('.reveal__frame').forEach(el => gsap.to(el, { clipPath: 'inset(0% 0% 0% 0% round 10px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 10%', scrub: true } }));
    $$('.timeline__line i').forEach(el => gsap.to(el, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el.closest('.timeline'), start: 'top 80%', end: 'bottom 60%', scrub: true } }));

    if ($('.hero__content')) {
      gsap.from('.hero__meta > *', { opacity: 0, y: 20, duration: 1, stagger: .1, ease: 'power3.out', delay: .4 });
      gsap.to('.hero__content', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // Grandes images de fond : léger zoom au défilement
    $$('.vidsec .bg-media, .page-hero .bg-kenburns').forEach(el => gsap.fromTo(el, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // Bandeaux et rangées liés à la vitesse de défilement
    $$('.sectors__row').forEach(r => r.innerHTML += r.innerHTML);
    const tracks = [...$$('.marquee__track'), ...$$('.sectors__row')].map((t, i) => ({ t, x: 0, dir: t.closest('[data-reverse]') || (t.classList.contains('sectors__row') && i % 2) ? 1 : -1 }));
    if (tracks.length) {
      let boost = 0;
      tracks.forEach(s => { if (s.dir > 0) s.x = -s.t.scrollWidth / 2; });
      gsap.ticker.add(() => {
        boost *= .92;
        tracks.forEach(s => {
          const half = s.t.scrollWidth / 2;
          s.x += s.dir * (.9 + boost);
          if (s.x <= -half) s.x += half; if (s.x > 0) s.x -= half;
          gsap.set(s.t, { x: s.x });
        });
      });
      lenis.on('scroll', ({ velocity }) => { boost = Math.min(Math.abs(velocity) * .8, 30); });
    }

    $$('.sitemap__word').forEach(el => gsap.fromTo(el, { xPercent: 0 }, { xPercent: -25, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // Inclinaison 3D des cartes
    if (fine) $$('.ocard, .path').forEach(o => {
      o.addEventListener('pointermove', e => {
        const r = o.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        gsap.to(o, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 900, duration: .5, ease: 'power3' });
      });
      o.addEventListener('pointerleave', () => gsap.to(o, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1,.5)' }));
    });

    // Défilement horizontal épinglé
    gsap.matchMedia().add('(min-width: 761px)', () => {
      $$('.hscroll').forEach(sec => {
        const t = $('.hscroll__track', sec); if (!t) return;
        const dist = () => Math.max(0, t.scrollWidth - innerWidth);
        const tween = gsap.to(t, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
        $$('.pcard__media img, .card__media img', t).forEach(img => gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('a'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }));
      });
    });

    document.dispatchEvent(new Event('mc:ready'));
    ScrollTrigger.refresh();
  }
  addEventListener('load', () => ScrollTrigger.refresh());
})();
