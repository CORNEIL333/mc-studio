/* MC Studio — scènes 3D des en-têtes (Three.js embarqué, window.THREE)
   <canvas data-scene="waves">  : houle de particules lumineuses (Services)
   <canvas data-scene="chrome"> : objets en chrome liquide qui flottent (Produits) */
(() => {
  const THREE = window.THREE;
  const canvases = [...document.querySelectorAll('canvas[data-scene]')];
  if (!THREE || !canvases.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = new THREE.Vector2(), target = new THREE.Vector2();
  addEventListener('pointermove', e => target.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1)), { passive: true });
  const css = n => getComputedStyle(document.body).getPropertyValue(n).trim();
  const accent = new THREE.Color(css('--lime') || '#d6ff38');

  canvases.forEach(canvas => {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
    catch (_) { canvas.remove(); return; }
    const mobile = innerWidth < 760;
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    let update = () => {};

    /* ---------- Houle de particules ---------- */
    if (canvas.dataset.scene === 'waves') {
      const cols = mobile ? 110 : 190, rows = mobile ? 70 : 110;
      const geo = new THREE.PlaneGeometry(26, 15, cols - 1, rows - 1);
      geo.rotateX(-Math.PI / 2);
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uA: { value: new THREE.Color('#5b8cff') }, uB: { value: accent }, uPx: { value: renderer.getPixelRatio() } },
        vertexShader: `
          uniform float uTime; uniform vec2 uMouse; uniform float uPx;
          varying float vH; varying float vFade;
          void main(){
            vec3 p = position;
            float w = sin(p.x*.55 + uTime*.9)*.55 + sin(p.z*.8 - uTime*.7)*.45 + sin((p.x+p.z)*.35 + uTime*.5)*.6;
            vec2 m = vec2(uMouse.x*11., -uMouse.y*6.5);
            float d = distance(p.xz, m);
            w += exp(-d*d*.08)*2.2*sin(d*1.6 - uTime*3.);
            p.y = w;
            vH = w;
            vec4 mv = modelViewMatrix*vec4(p,1.);
            vFade = smoothstep(-26., -6., mv.z);
            gl_PointSize = (2.2 + w*.9) * uPx * (9. / -mv.z);
            gl_Position = projectionMatrix*mv;
          }`,
        fragmentShader: `
          uniform vec3 uA; uniform vec3 uB; varying float vH; varying float vFade;
          void main(){
            float r = length(gl_PointCoord-.5); if(r>.5) discard;
            vec3 c = mix(uA, uB, smoothstep(-.4, 1.6, vH));
            gl_FragColor = vec4(c, (1.-r*2.) * (.35 + .65*smoothstep(-1.,1.8,vH)) * vFade);
          }`
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      camera.position.set(0, 4.2, 9.5); camera.lookAt(0, -.6, -2);
      update = t => {
        mat.uniforms.uTime.value = t;
        mat.uniforms.uMouse.value.copy(mouse);
        pts.rotation.y = mouse.x * .08;
        camera.position.y = 4.2 + mouse.y * .5;
        camera.lookAt(0, -.6, -2);
      };
    }

    /* ---------- Objets en chrome liquide ---------- */
    if (canvas.dataset.scene === 'chrome') {
      const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uAcc: { value: accent } },
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vV = -mv.xyz; vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform float uTime; uniform vec3 uAcc; varying vec3 vN; varying vec3 vV;
          void main(){
            vec3 n = normalize(vN), v = normalize(vV), r = reflect(-v, n);
            float bands = .5 + .5*sin(r.y*8. + r.x*2.5 + uTime*.6);
            vec3 c = mix(vec3(.02,.025,.03), vec3(.86,.88,.84), smoothstep(.2,.85,bands));
            c += smoothstep(.9,1.,bands)*.4;
            float fres = pow(1.-max(dot(n,v),0.), 2.4);
            c = mix(c, uAcc, fres*.85);
            gl_FragColor = vec4(c,1.);
          }`
      });
      const shapes = [
        [new THREE.TorusKnotGeometry(1, .34, 220, 32), [1.9, .6, 0], 1.05],
        [new THREE.IcosahedronGeometry(1, 0), [-1.4, 1.5, -1.5], .8],
        [new THREE.TorusGeometry(.8, .3, 48, 120), [-.4, -1.6, .4], .9],
        [new THREE.CapsuleGeometry(.45, 1, 12, 32), [3.4, -1.7, -1], .85],
        [new THREE.OctahedronGeometry(.6, 0), [.2, 2.3, -2.5], .7],
      ].map(([g, p, s], i) => { const m = new THREE.Mesh(g, mat); m.position.set(...p); m.scale.setScalar(s); m.userData = { base: new THREE.Vector3(...p), sp: .3 + i * .12, ph: i * 1.7 }; scene.add(m); return m; });
      const group = new THREE.Group(); shapes.forEach(m => group.add(m)); scene.add(group);
      camera.position.set(0, 0, 9);
      update = t => {
        mat.uniforms.uTime.value = t;
        shapes.forEach(m => {
          const u = m.userData;
          m.rotation.x = t * u.sp * .6 + u.ph; m.rotation.y = t * u.sp + u.ph;
          m.position.y = u.base.y + Math.sin(t * .8 + u.ph) * .25;
        });
        group.rotation.y = mouse.x * .35; group.rotation.x = -mouse.y * .2;
        group.position.x = innerWidth > 960 ? 2.2 : 0;
      };
    }

    const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    addEventListener('resize', resize); resize();
    let visible = true;
    new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      if (!visible) return;
      mouse.lerp(target, .05);
      update(reduce ? 2 : clock.getElapsedTime());
      renderer.render(scene, camera);
    });
    if (window.gsap) gsap.from(canvas, { opacity: 0, duration: 2, ease: 'power2.out', delay: .4 });
  });
})();
