/* MC Studio — fonds animés réutilisables.
   Usage : <section data-bg="flow|topo|halftone|waves|aurora|video|image" data-theme="dark|paper|lime" data-src="...">
   Les canvas ne s'animent que lorsqu'ils sont visibles. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const THEMES = {
    dark:  { bg: [.027, .031, .039], fg: [.937, .933, .906], acc: [.84, 1, .22] },
    paper: { bg: [.937, .933, .906], fg: [.027, .031, .039], acc: [.62, .78, .05] },
    lime:  { bg: [.84, 1, .22],      fg: [.027, .031, .039], acc: [.027, .031, .039] },
  };
  // Accent de la page (variable CSS --lime redéfinie par page)
  const hex = getComputedStyle(document.body).getPropertyValue('--lime').trim() || '#d6ff38';
  const ACC = hex.length === 7 ? [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255) : [.84, 1, .22];
  THEMES.dark.acc = ACC; THEMES.lime.bg = ACC;
  const MODES = { flow: 0, topo: 1, halftone: 2 };
  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = -(e.clientY / innerHeight * 2 - 1); }, { passive: true });

  const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uMode;
uniform vec3 uBg; uniform vec3 uFg; uniform vec3 uAcc;
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x), u.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy/uRes;
  vec2 p = (gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 mp = uMouse*vec2(.5*uRes.x/uRes.y,.5);
  float t = uTime;
  vec3 col;
  if (uMode < .5) {
    vec2 q = vec2(fbm(p*1.4+t*.05), fbm(p*1.4+vec2(5.2,1.3)-t*.04));
    vec2 r = vec2(fbm(p*1.4+3.5*q+vec2(1.7,9.2)+mp*.4+t*.07), fbm(p*1.4+3.5*q+vec2(8.3,2.8)-t*.05));
    float f = fbm(p*1.4+3.5*r);
    col = mix(uBg, mix(uBg,uFg,.18), smoothstep(.25,.75,f));
    col = mix(col, uAcc, smoothstep(.6,.88,f)*.6);
    col = mix(col, uFg, smoothstep(.82,.98,f)*.25);
  } else if (uMode < 1.5) {
    float f = fbm(p*1.6+vec2(t*.04,-t*.03));
    f += .22*exp(-length(p-mp)*2.5);
    float k = f*16.;
    float lv = floor(k);
    float e = min(fract(k),1.-fract(k));
    float line = 1.-smoothstep(.0,.07,e);
    float major = step(mod(lv,5.),.5);
    col = mix(uBg, mix(uBg,uFg,.28), line);
    col = mix(col, uAcc, line*major*.9);
  } else {
    vec2 g = p*34.;
    vec2 id = floor(g); vec2 gv = fract(g)-.5;
    float n = fbm(id*.045+vec2(t*.12,t*.05));
    float w = .5+.5*sin(id.x*.18+id.y*.12-t*1.1);
    float near = exp(-length(id/34.-mp)*3.);
    float r = .04+.27*smoothstep(.3,.9,n*w*1.5+near*.6);
    float d = smoothstep(r,r-.06,length(gv));
    vec3 dc = mix(mix(uBg,uFg,.22), uAcc, step(.78,n*w*1.5+near*.5)*.85);
    col = mix(uBg, dc, d);
  }
  col *= 1.-.25*pow(length(uv-.5)*1.25,2.);
  gl_FragColor = vec4(col,1.);
}`;
  const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

  const layers = [];

  function glLayer(host, mode, theme) {
    const c = document.createElement('canvas'); c.className = 'bg-layer';
    host.prepend(c);
    const gl = c.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) { host.classList.add('bg-fallback'); c.remove(); return; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr); gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(pr, n);
    const th = THEMES[theme] || THEMES.dark;
    gl.uniform1f(U('uMode'), MODES[mode]);
    gl.uniform3fv(U('uBg'), th.bg); gl.uniform3fv(U('uFg'), th.fg); gl.uniform3fv(U('uAcc'), th.acc);
    const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse');
    const scale = mode === 'flow' ? .5 : Math.min(devicePixelRatio, 1.5) * .85;
    const m = { x: 0, y: 0 };
    const resize = () => { c.width = Math.max(1, c.clientWidth * scale | 0); c.height = Math.max(1, c.clientHeight * scale | 0); gl.viewport(0, 0, c.width, c.height); gl.uniform2f(uRes, c.width, c.height); };
    resize();
    const draw = t => {
      const r = host.getBoundingClientRect();
      // souris relative à la section
      const tx = ((mouse.x + 1) / 2 * innerWidth - r.left) / r.width * 2 - 1, ty = -(((-mouse.y + 1) / 2 * innerHeight - r.top) / r.height * 2 - 1);
      m.x += (tx - m.x) * .05; m.y += (ty - m.y) * .05;
      gl.uniform1f(uTime, t); gl.uniform2f(uMouse, m.x, m.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    layers.push({ host, resize, draw, visible: false });
  }

  function wavesLayer(host, theme) {
    const c = document.createElement('canvas'); c.className = 'bg-layer';
    host.prepend(c);
    const ctx = c.getContext('2d');
    const th = THEMES[theme] || THEMES.dark;
    const rgb = (a, al) => `rgba(${a.map(v => v * 255 | 0).join(',')},${al})`;
    let w, h, dpr;
    const resize = () => { dpr = Math.min(devicePixelRatio, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const m = { x: .5, y: .5 };
    const draw = t => {
      const r = host.getBoundingClientRect();
      const tx = ((mouse.x + 1) / 2 * innerWidth - r.left) / r.width, ty = ((-mouse.y + 1) / 2 * innerHeight - r.top) / r.height;
      m.x += (tx - m.x) * .06; m.y += (ty - m.y) * .06;
      ctx.fillStyle = rgb(th.bg, 1); ctx.fillRect(0, 0, w, h);
      const lines = 34, step = 14;
      for (let i = 0; i < lines; i++) {
        const base = h * (.12 + .76 * i / (lines - 1));
        const hot = i % 7 === 3;
        ctx.beginPath();
        for (let x = 0; x <= w + step; x += step) {
          const nx = x / w;
          const dx = nx - m.x, dy = base / h - m.y;
          const bump = Math.exp(-(dx * dx * 18 + dy * dy * 40)) * 70;
          const y = base + Math.sin(nx * 6 + t * .7 + i * .35) * 10 + Math.sin(nx * 13 - t * 1.1 + i) * 4 - bump;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = hot ? rgb(th.acc, .9) : rgb(th.fg, .16);
        ctx.lineWidth = hot ? 1.5 : 1;
        ctx.stroke();
      }
    };
    layers.push({ host, resize, draw, visible: false });
  }

  document.querySelectorAll('[data-bg]').forEach(host => {
    const type = host.dataset.bg, theme = host.dataset.theme || 'dark';
    host.classList.add('has-bg');
    if (type in MODES) glLayer(host, type, theme);
    else if (type === 'waves') wavesLayer(host, theme);
    else if (type === 'aurora') host.insertAdjacentHTML('afterbegin', '<div class="bg-layer bg-aurora" aria-hidden="true"><i></i><i></i><i></i></div>');
    else if (type === 'video') host.insertAdjacentHTML('afterbegin', `<video class="bg-layer bg-media" src="${host.dataset.src}" muted loop playsinline autoplay preload="metadata" ${host.dataset.poster ? `poster="${host.dataset.poster}"` : ''}></video><div class="bg-layer bg-shade"></div>`);
    else if (type === 'image') host.insertAdjacentHTML('afterbegin', `<div class="bg-layer bg-kenburns"><img src="${host.dataset.src}" alt=""></div><div class="bg-layer bg-shade"></div>`);
  });

  if (!layers.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => { const l = layers.find(l => l.host === e.target); if (l) l.visible = e.isIntersecting; }), { rootMargin: '100px' });
  layers.forEach(l => io.observe(l.host));
  addEventListener('resize', () => layers.forEach(l => l.resize()));
  const t0 = performance.now();
  const loop = now => {
    const t = (now - t0) / 1000;
    layers.forEach(l => { if (l.visible) l.draw(reduce ? 4 : t); });
    if (!reduce) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  if (reduce) setTimeout(() => layers.forEach(l => l.draw(4)), 300);
})();
