/* MC Studio — génération des blocs à partir du catalogue (assets/data.js).
   S'exécute avant site.js pour que les animations s'appliquent au contenu généré. */
(() => {
  const { products, offers, fmt, url, find, WA } = window.MC;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const enc = encodeURIComponent;

  // Photo réaliste si présente dans public/photos/, sinon visuel de secours
  const pic = (it, extra = '') => `<img src="${it.photo}" data-fallback="${it.art}" alt="" loading="lazy" ${extra} onerror="this.onerror=null;this.src=this.dataset.fallback">`;
  const priceTxt = it => `${it.unit === 'dès' ? 'dès ' : ''}${fmt(it.price)} FCFA${it.unit === '/ mois' ? ' / mois' : ''}`;
  const priceHTML = it => `<div class="price">${it.unit === 'dès' ? '<span class="mono">dès</span>' : ''}<strong>${fmt(it.price)}</strong><span class="mono">FCFA${it.unit === '/ mois' ? ' / mois' : ['kit', 'audit'].includes(it.unit) ? ' · ' + it.unit : ''}</span></div>`;
  const lines = name => { const w = name.split(' '); const a = w.slice(0, Math.ceil(w.length / 2)).join(' '), b = w.slice(Math.ceil(w.length / 2)).join(' '); return `<span class="line"><span>${esc(a)}</span></span>${b ? `<span class="line"><span>${esc(b)}</span></span>` : ''}`; };
  const contact = it => `contact.html?offre=${enc(it.name)}`;

  const pcard = it => `
    <a class="pcard" href="${url(it)}">
      <div class="pcard__media">${pic(it)}<span class="tag">${esc(it.cat)}</span></div>
      <div class="pcard__body">
        <span class="mono" style="color:var(--muted)">${esc(it.delay)}</span>
        <h3>${esc(it.name)}</h3>
        <p>${esc(it.tagline || it.short)}</p>
        <div class="pcard__foot"><div><span class="mono" style="color:var(--muted)">${it.unit === 'dès' ? 'À partir de' : 'Prix'}</span><br><strong>${fmt(it.price)}</strong> <span class="mono">FCFA${it.unit === '/ mois' ? '/mois' : ''}</span></div><span class="pcard__go">↗</span></div>
      </div>
    </a>`;

  const ocard = (o, i) => `
    <article class="ocard${o.featured ? ' is-featured' : ''}" data-cat="${o.kind}|${o.cat}" data-reveal>
      <div class="ocard__top">${o.featured ? '<span class="tag tag--lime">Le plus choisi</span>' : `<span class="mono">${String(i + 1).padStart(2, '0')} · ${esc(o.cat)}</span>`}<span class="ocard__icon">${o.icon}</span></div>
      <h3>${esc(o.name)}</h3><p>${esc(o.short)}</p>
      <ul class="ocard__list">${o.includes.slice(0, 4).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="ocard__price">${priceHTML(o)}<span class="mono" style="opacity:.55">${esc(o.delay)}</span></div>
      <a class="ocard__cta" href="${url(o)}"><span>Voir le détail</span><span>→</span></a>
    </article>`;

  const accItem = ([q, a], cat) => `
    <div class="acc"${cat ? ` data-cat="${cat}"` : ''}>
      <button class="acc__head" aria-expanded="false"><h3>${esc(q)}</h3><i class="acc__plus"></i></button>
      <div class="acc__body"><div class="acc__inner">${esc(a)}</div></div>
    </div>`;

  const GENERAL_FAQ = [
    ['Comment se passe le paiement ?', 'Un acompte de 50 % au démarrage, le solde à la livraison. Paiement par Orange Money, MTN MoMo, virement ou espèces. Les projets supérieurs à 1 million FCFA peuvent être échelonnés.'],
    ['Les prix peuvent-ils être ajustés ?', 'Oui. Chaque prix correspond à un périmètre précis ; nous l\'adaptons à votre besoin réel et vous envoyons un devis détaillé avant tout engagement.'],
    ['Travaillez-vous en dehors de Douala ?', 'Oui, partout au Cameroun et à distance. Seuls les shootings et tournages nécessitent un déplacement, chiffré à part hors Douala.'],
  ];
  const ALWAYS = ['Un interlocuteur dédié du début à la fin', 'Un planning validé avant production', 'Des points de validation à chaque étape', 'Les fichiers finaux vous appartiennent', '30 jours de suivi après livraison'];

  /* ---------- Listes ---------- */
  $$('[data-render="products"]').forEach(el => {
    let list = products;
    if (el.dataset.exclude) list = list.filter(p => p.slug !== el.dataset.exclude);
    if (el.dataset.limit) list = list.slice(0, +el.dataset.limit);
    el.insertAdjacentHTML('beforeend', list.map(pcard).join(''));
  });
  $$('[data-render="offers"]').forEach(el => el.insertAdjacentHTML('beforeend', offers.map(ocard).join('')));

  /* ---------- Comparateur ---------- */
  const HAS = {
    'brand-kit': ['identite', 'contenu', 'sources'], 'site-express': ['site', 'sources', 'support'], 'content-factory': ['contenu', 'video', 'rapport'],
    'shop-pro': ['site', 'paiement', 'sources', 'support'], 'motion-film': ['video', 'sources'], 'launch-360': ['identite', 'site', 'contenu', 'video', 'sources', 'support', 'rapport'],
  };
  const ROWS = [['identite', 'Identité de marque'], ['site', 'Site web'], ['paiement', 'Paiement en ligne'], ['contenu', 'Contenus réseaux'], ['video', 'Vidéo'], ['rapport', 'Rapport de performance'], ['sources', 'Fichiers sources'], ['support', 'Support après lancement']];
  $$('[data-render="compare"]').forEach(el => {
    el.innerHTML = `<table>
      <thead><tr><th></th>${products.map(p => `<th><a href="${url(p)}">${esc(p.name)}</a><small>${priceTxt(p)}</small></th>`).join('')}</tr></thead>
      <tbody>
        <tr><th>Délai</th>${products.map(p => `<td>${esc(p.delay)}</td>`).join('')}</tr>
        <tr><th>Idéal pour</th>${products.map(p => `<td>${esc(p.who[0])}</td>`).join('')}</tr>
        ${ROWS.map(([k, l]) => `<tr><th>${l}</th>${products.map(p => HAS[p.slug].includes(k) ? '<td class="yes">●</td>' : '<td class="no">—</td>').join('')}</tr>`).join('')}
        <tr><th></th>${products.map(p => `<td><a class="link-arrow" href="${url(p)}">Détail <b>↗</b></a></td>`).join('')}</tr>
      </tbody></table>`;
  });

  /* ---------- Quiz « Trouver mon offre » ---------- */
  const GOALS = [
    ['launch', 'Lancer ma marque ou mon activité', ['identite-contenu', 'lancement-business', 'brand-kit', 'launch-360']],
    ['social', 'Être plus visible sur les réseaux', ['community-starter', 'impact-social-pro', 'content-factory']],
    ['site', 'Avoir un site web professionnel', ['site-vitrine', 'site-express']],
    ['sell', 'Vendre en ligne', ['boutique-premium', 'shop-pro']],
    ['video', 'Créer une vidéo qui marque', ['motion-reels', 'motion-film']],
    ['unsure', 'Je ne sais pas par où commencer', ['audit-strategie']],
  ];
  const BUDGETS = [['Moins de 150 000 FCFA', 150000], ['150 000 – 400 000 FCFA', 400000], ['400 000 – 1 000 000 FCFA', 1000000], ['Plus de 1 000 000 FCFA', Infinity]];
  const DELAYS = [['Le plus vite possible', 'urgent'], ['Dans le mois', 'month'], ['Je prends le temps de bien faire', 'calm']];
  $$('[data-render="quiz"]').forEach(el => {
    const q = (n, title, opts) => `<div class="quiz__q${n === 0 ? ' is-on' : ''}" data-step="${n}"><span class="mono" style="color:var(--muted)">Question ${n + 1} / 3</span><h3>${title}</h3><div class="quiz__opts">${opts.map(([v, l, hint]) => `<button class="quiz__opt" data-v="${v}"><span>${l}</span><span>${hint || '→'}</span></button>`).join('')}</div></div>`;
    el.innerHTML = `<div class="quiz__progress"><i></i></div>
      ${q(0, 'Quel est votre objectif principal ?', GOALS.map(([v, l]) => [v, l]))}
      ${q(1, 'Quel budget envisagez-vous ?', BUDGETS.map(([l, v], i) => [i, l]))}
      ${q(2, 'Quand voulez-vous être prêt ?', DELAYS.map(([l, v]) => [v, l]))}
      <div class="quiz__result"></div>
      <button class="quiz__back mono" hidden>← Recommencer</button>`;
    const ans = [];
    const bar = $('.quiz__progress i', el), back = $('.quiz__back', el), res = $('.quiz__result', el);
    const show = n => { $$('.quiz__q', el).forEach(x => x.classList.toggle('is-on', +x.dataset.step === n)); bar.style.width = (n / 3 * 100) + '%'; };
    $$('.quiz__opt', el).forEach(b => b.addEventListener('click', () => {
      const step = +b.closest('.quiz__q').dataset.step;
      $$('.quiz__opt', b.parentElement).forEach(x => x.classList.toggle('is-picked', x === b));
      ans[step] = b.dataset.v;
      setTimeout(() => step < 2 ? show(step + 1) : finish(), 260);
    }));
    function finish() {
      const [goal, bIdx, delay] = ans;
      const max = BUDGETS[+bIdx][1];
      let cands = GOALS.find(g => g[0] === goal)[2].map(find);
      if (goal === 'site' && delay === 'urgent') cands = [find('site-express'), find('site-vitrine')];
      const fit = cands.filter(c => c.price <= max).sort((a, b) => b.price - a.price);
      const pick = fit[0] || [...cands].sort((a, b) => a.price - b.price)[0];
      const alt = cands.find(c => c !== pick);
      $$('.quiz__q', el).forEach(x => x.classList.remove('is-on'));
      bar.style.width = '100%';
      res.innerHTML = `<span class="eyebrow">Notre recommandation</span>
        <h3 class="d-4">${fit.length ? 'Voici ce qui vous correspond le mieux.' : 'Le plus proche de votre budget.'}</h3>
        ${pcard(pick)}
        ${!fit.length ? '<p class="lead" style="font-size:15px">Ce choix dépasse un peu votre budget : nous pouvons réduire le périmètre ou échelonner le paiement.</p>' : ''}
        <div class="btn-row"><a class="btn" href="${contact(pick)}"><span>En parler avec nous</span><span>→</span></a>${alt ? `<a class="link-arrow" href="${url(alt)}">Voir aussi : ${esc(alt.name)} <b>↗</b></a>` : ''}</div>`;
      res.classList.add('is-on'); back.hidden = false;
    }
    back.addEventListener('click', () => { ans.length = 0; res.classList.remove('is-on'); back.hidden = true; $$('.quiz__opt', el).forEach(x => x.classList.remove('is-picked')); show(0); });
  });

  /* ---------- Fiche détaillée ---------- */
  const detail = $('[data-render="detail"]');
  if (detail) {
    const isProduct = detail.dataset.kind === 'produit';
    const q = new URLSearchParams(location.search);
    const list = isProduct ? products : offers;
    const it = list.find(x => x.slug === q.get(isProduct ? 'p' : 'o')) || list[0];
    it.type = isProduct ? 'produit' : 'offre';
    document.title = `${it.name} — MC Studio`;
    const md = $('meta[name="description"]'); if (md) md.content = `${it.name} : ${it.tagline || it.short} ${priceTxt(it)}, ${it.delay}.`;
    const others = list.filter(x => x !== it).sort((a, b) => (b.cat === it.cat) - (a.cat === it.cat)).slice(0, 3);
    const upgrade = !isProduct && it.upgrade ? find(it.upgrade) : null;

    const hero = `
      <section class="dhero" data-bg="${it.bg}">
        <nav class="dhero__crumbs mono" aria-label="Fil d'Ariane"><a href="index.html">Accueil</a><span>/</span><a href="${isProduct ? 'produits' : 'offres'}.html">${isProduct ? 'Produits' : 'Offres'}</a><span>/</span><span>${esc(it.name)}</span></nav>
        <div>
          <div class="dhero__icon" aria-hidden="true">${it.icon}</div>
          <span class="tag" style="margin-bottom:18px">${isProduct ? 'Produit signature' : 'Offre'} · ${esc(it.cat)}</span>
          <h1 class="d-2" data-split style="margin-top:18px">${lines(it.name)}</h1>
          <p class="dhero__tagline" data-reveal>${esc(it.tagline || it.short)}</p>
        </div>
        <aside class="dhero__card" data-reveal>
          <div class="dhero__media">${pic({ ...it, photo: it.cover || it.photo })}</div>
          ${priceHTML(it)}
          <dl class="facts mono">
            <div><dt>Délai</dt><dd>${esc(it.delay)}</dd></div>
            <div><dt>Catégorie</dt><dd>${esc(it.cat)}</dd></div>
            <div><dt>Paiement</dt><dd>${it.unit === '/ mois' ? 'Mensuel' : '50 % / 50 %'}</dd></div>
          </dl>
          <div class="btn-row"><a class="btn" href="${contact(it)}"><span>${isProduct ? 'Commander' : 'Choisir cette offre'}</span><span>→</span></a><a class="link-arrow" href="#details" data-scroll>Le détail <b>↓</b></a></div>
        </aside>
      </section>`;

    const common = `
      <section class="faq">
        <div class="faq__side"><span class="eyebrow">FAQ</span><h2 class="d-3" data-split><span class="line"><span>Vos</span></span><span class="line"><span><em>questions.</em></span></span></h2>
          <p class="lead">Une autre question ? Toutes les réponses sont dans notre FAQ, ou écrivez-nous directement.</p>
          <div class="btn-row"><a class="btn btn--ghost" href="faq.html"><span>Toute la FAQ</span></a><a class="link-arrow" href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp <b>↗</b></a></div></div>
        <div>${[...(it.faq || []), ...GENERAL_FAQ].map(f => accItem(f)).join('')}</div>
      </section>
      <section class="sec paper">
        <div class="sec-head"><span class="eyebrow">À découvrir aussi</span><h2 class="d-3" data-split><span class="line"><span>D'autres</span></span><span class="line"><span><em>${isProduct ? 'produits' : 'offres'}.</em></span></span></h2>
          <a class="link-arrow" href="${isProduct ? 'produits' : 'offres'}.html" style="justify-self:end">Tout voir <b>↗</b></a></div>
        <div class="pgrid">${others.map(o => pcard({ ...o, type: it.type })).join('')}</div>
      </section>
      <div class="buybar"><b>${esc(it.name)}</b><span class="mono" style="color:var(--muted)">${priceTxt(it)}</span><a class="btn" href="${contact(it)}"><span>${isProduct ? 'Commander' : 'Choisir'}</span><span>→</span></a></div>`;

    if (isProduct) {
      detail.innerHTML = hero + `
        <div class="kpis">${it.kpis.map(([n, l]) => `<div data-reveal><b>${esc(n)}</b><span class="mono">${esc(l)}</span></div>`).join('')}</div>
        <section class="sec" id="details">
          <div class="sec-head"><span class="eyebrow">Le produit</span><h2 class="d-3" data-split><span class="line"><span>En bref,</span></span><span class="line"><span><em>ça change quoi ?</em></span></span></h2><p class="lead" data-reveal>${esc(it.pitch)}</p></div>
          <div class="split" data-reveal><div class="split__a"><span class="mono">Le problème</span><p>${esc(it.problem)}</p></div><div class="split__b"><span class="mono">Notre réponse</span><p>${esc(it.solution)}</p></div></div>
        </section>
        <section class="sec paper">
          <div class="sec-head"><span class="eyebrow">Pour qui ?</span><h2 class="d-3" data-split><span class="line"><span>Pensé pour</span></span><span class="line"><span><em>vous si…</em></span></span></h2></div>
          <div class="who">${it.who.map((w, i) => `<div data-reveal><b>0${i + 1}</b><p>${esc(w)}</p></div>`).join('')}</div>
        </section>
        <section class="sec">
          <div class="sec-head"><span class="eyebrow">Livrables</span><h2 class="d-3" data-split><span class="line"><span>Ce que vous</span></span><span class="line"><span><em>recevez.</em></span></span></h2><p class="lead" data-reveal>Tout est listé, rien n'est caché : voici précisément ce qui est livré.</p></div>
          <div class="deliv">${it.deliverables.map(([t, d], i) => `<article data-reveal><span class="mono">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('')}</div>
        </section>
        <section class="sec paper">
          <div class="sec-head"><span class="eyebrow">Déroulé · ${esc(it.delay)}</span><h2 class="d-3" data-split><span class="line"><span>Étape par</span></span><span class="line"><span><em>étape.</em></span></span></h2></div>
          <div class="timeline"><div class="timeline__line"><i></i></div>${it.timeline.map(([w, t, d]) => `<div class="tstep" data-reveal><span class="mono">${esc(w)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
        </section>
        <section class="sec"><div class="two">
          <div><span class="eyebrow">Options</span><h2 class="d-3" data-split style="margin:20px 0 36px"><span class="line"><span>À la <em>carte.</em></span></span></h2>
            <div class="opts opts--pick" data-quote data-base="${it.price}" data-name="${esc(it.name)}" data-monthly="${it.unit === '/ mois' ? 1 : 0}">${it.options.map(([l, p]) => `<label data-reveal><input type="checkbox" value="${p}" data-label="${esc(l)}"><i aria-hidden="true"></i><span>${esc(l)}</span><b>+ ${fmt(p)} FCFA</b></label>`).join('')}</div>
            <div class="quote" data-reveal><div><span class="mono">Votre estimation</span><div class="price"><strong data-total>${fmt(it.price)}</strong><span class="mono">FCFA${it.unit === '/ mois' ? ' / mois' : ''}</span></div><span class="mono" data-detail style="color:var(--muted)">${esc(it.name)} seul</span></div>
              <a class="btn" data-quote-send href="${contact(it)}"><span>Recevoir ce devis</span><span>→</span></a></div></div>
          <div><span class="eyebrow">Toujours inclus</span><h2 class="d-3" data-split style="margin:20px 0 36px"><span class="line"><span>Sans <em>surprise.</em></span></span></h2>
            <ul class="included">${ALWAYS.map(a => `<li data-reveal>${a}</li>`).join('')}</ul></div>
        </div></section>` + common;
      // Devis interactif : base + options cochées
      const q = $('[data-quote]', detail);
      if (q) {
        const base = +q.dataset.base, total = $('[data-total]', detail), det = $('[data-detail]', detail), send = $('[data-quote-send]', detail);
        const update = () => {
          const picked = $$('input:checked', q);
          const sum = base + picked.reduce((a, i) => a + +i.value, 0);
          total.textContent = fmt(sum);
          det.textContent = picked.length ? `${q.dataset.name} + ${picked.length} option${picked.length > 1 ? 's' : ''}` : `${q.dataset.name} seul`;
          const subject = [q.dataset.name, ...picked.map(i => i.dataset.label)].join(' + ') + ` — estimation ${fmt(sum)} FCFA${q.dataset.monthly === '1' ? ' / mois' : ''}`;
          send.href = 'contact.html?offre=' + enc(subject);
          const bb = $('.buybar'); if (bb) { $('.mono', bb).textContent = `${fmt(sum)} FCFA${q.dataset.monthly === '1' ? ' / mois' : ''}${picked.length ? ' · options incluses' : ''}`; $('.btn', bb).href = send.href; }
        };
        q.addEventListener('change', update);
      }
    } else {
      detail.innerHTML = hero + `
        <section class="sec" id="details">
          <div class="sec-head"><span class="eyebrow">L'offre</span><h2 class="d-3" data-split><span class="line"><span>Ce qui est</span></span><span class="line"><span><em>inclus.</em></span></span></h2><p class="lead" data-reveal>${esc(it.for)}</p></div>
          <div class="two"><ul class="included">${it.includes.map(x => `<li data-reveal>${esc(x)}</li>`).join('')}</ul>
            <div class="split" style="grid-template-columns:1fr" data-reveal><div class="split__b"><span class="mono">Toujours inclus</span><p>${ALWAYS.slice(0, 3).join(' · ')}.</p></div></div></div>
        </section>
        <section class="sec paper">
          <div class="sec-head"><span class="eyebrow">Comment ça marche ?</span><h2 class="d-3" data-split><span class="line"><span>De votre besoin</span></span><span class="line"><span><em>à la livraison.</em></span></span></h2></div>
          <div class="timeline"><div class="timeline__line"><i></i></div>
            <div class="tstep" data-reveal><span class="mono">Étape 01</span><h3>Choisir</h3><p>Vous choisissez cette offre et nous échangeons sur votre besoin.</p></div>
            <div class="tstep" data-reveal><span class="mono">Étape 02</span><h3>Ajuster</h3><p>Nous adaptons les livrables et le rythme, puis vous recevez un devis.</p></div>
            <div class="tstep" data-reveal><span class="mono">Étape 03</span><h3>Créer</h3><p>Vous suivez la production à travers des validations simples.</p></div>
            <div class="tstep" data-reveal><span class="mono">Étape 04</span><h3>Livrer</h3><p>Formats prêts à publier et 30 jours de suivi après livraison.</p></div>
          </div>
        </section>
        ${upgrade ? `<section class="sec"><div class="sec-head"><span class="eyebrow">Besoin de plus ?</span><h2 class="d-3" data-split><span class="line"><span>Passez à la</span></span><span class="line"><span><em>vitesse supérieure.</em></span></span></h2><p class="lead" data-reveal>Si votre projet dépasse le cadre de cette offre, ${esc(upgrade.name)} va plus loin.</p></div><div class="pgrid">${pcard(upgrade)}</div></section>` : ''}` + common;
    }
  }
})();
