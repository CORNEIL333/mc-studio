/* MC Studio — sculpture de chrome liquide (WebGL) pour le héros d'accueil */
// Script classique (les modules locaux sont bloqués en file://) qui importe Three.js dynamiquement
(async () => {
// Three.js embarqué localement (assets/vendor/three.min.js) ; repli sur le CDN si absent
const THREE = window.THREE || await import('https://unpkg.com/three@0.160.0/build/three.module.js');

const canvas = document.getElementById('gl');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
catch (e) { document.documentElement.classList.add('no-webgl'); return; }

const mobile = innerWidth < 760;
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.z = 6;

// Simplex 3D noise — Ashima Arts / Stefan Gustavson (MIT)
const noise = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const uniforms = { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uScroll: { value: 0 }, uHover: { value: 0 } };
const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: noise + `
    uniform float uTime; uniform vec2 uMouse; uniform float uScroll; uniform float uHover;
    varying vec3 vView; varying float vD;
    void main(){
      vec3 n = normalize(position);
      float d = snoise(n*1.1 + vec3(uMouse*0.6, uTime*0.22)) * (0.32 + uHover*0.18);
      d += snoise(n*3.2 - uTime*0.35) * 0.07;
      d += snoise(n*6.0 + uTime) * 0.04 * uScroll;
      vec3 p = position + n * d;
      vD = d;
      vec4 mv = modelViewMatrix * vec4(p,1.);
      vView = mv.xyz;
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform float uTime; uniform float uScroll;
    varying vec3 vView; varying float vD;
    void main(){
      vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
      vec3 v = normalize(-vView);
      vec3 r = reflect(-v, n);
      float fres = pow(1. - max(dot(n, v), 0.), 2.6);
      float bands = .5 + .5*sin(r.y*7. + r.x*2. + uTime*.4);
      vec3 base = mix(vec3(.025,.028,.035), vec3(.78,.79,.75), smoothstep(.25,.85,bands));
      base += smoothstep(.86, 1., bands) * .35;
      vec3 lime = vec3(.84, 1., .22);
      vec3 col = mix(base, lime, fres * (.75 + uScroll*.25));
      col += lime * smoothstep(.2, .45, vD) * .25;
      gl_FragColor = vec4(col, 1.);
    }`
});

const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, mobile ? 40 : 90), material);
scene.add(mesh);

// Anneau de particules
const N = 900, arr = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  const a = Math.random() * Math.PI * 2, rad = 2.1 + Math.random() * 0.9, h = (Math.random() - .5) * .25;
  arr.set([Math.cos(a) * rad, h, Math.sin(a) * rad], i * 3);
}
const ptsGeo = new THREE.BufferGeometry();
ptsGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
const pts = new THREE.Points(ptsGeo, new THREE.PointsMaterial({ color: 0xefeee7, size: 0.012, transparent: true, opacity: .6 }));
pts.rotation.x = 0.35;
scene.add(pts);

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.position.z = w < h ? 8.5 : 6;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

const target = new THREE.Vector2(), mouse = new THREE.Vector2();
let hover = 0, hoverT = 0, hoverTimer;
addEventListener('pointermove', e => {
  target.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1));
  hoverT = 1; clearTimeout(hoverTimer); hoverTimer = setTimeout(() => hoverT = 0, 400);
});

let scroll = 0, visible = true;
new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
window.__lenis?.on('scroll', ({ scroll: s }) => scroll = Math.min(s / innerHeight, 1.2));

window.gsap?.from(canvas, { opacity: 0, scale: 1.2, duration: 2.2, ease: 'expo.out', delay: .3 });

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  if (!visible) return;
  const t = clock.getElapsedTime();
  mouse.lerp(target, 0.05);
  hover += (hoverT - hover) * 0.04;
  uniforms.uTime.value = t;
  uniforms.uMouse.value.copy(mouse);
  uniforms.uScroll.value += (scroll - uniforms.uScroll.value) * 0.08;
  uniforms.uHover.value = hover;
  const s = uniforms.uScroll.value;
  mesh.rotation.y = t * 0.12 + mouse.x * 0.5;
  mesh.rotation.x = -mouse.y * 0.35 + s * 0.8;
  const wide = innerWidth > 760;
  mesh.position.set(mouse.x * 0.25 + (wide ? 0.9 : 0), (wide ? 0.05 : 1.25) + mouse.y * 0.15 + s * 1.4, 0);
  mesh.scale.setScalar((wide ? 1 : 0.72) + s * 0.35);
  pts.rotation.y = t * 0.05 + mouse.x * 0.2;
  pts.position.copy(mesh.position);
  renderer.render(scene, camera);
});
})().catch(() => document.documentElement.classList.add('no-webgl'));
