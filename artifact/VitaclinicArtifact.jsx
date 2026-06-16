/**
 * ───────────────────────────────────────────────────────────────────────────
 *  VITACLINIC · Web inmersiva 3D — VERSIÓN ARTIFACT (un solo archivo)
 * ───────────────────────────────────────────────────────────────────────────
 *  Pensado para pegar en un Artifact de claude.ai (React).
 *  Solo usa librerías soportadas: react, three, @react-three/fiber.
 *  - Shaders GLSL inline (sin archivos .glsl).
 *  - Sin GSAP/Lenis/postprocessing: scroll suave nativo + IntersectionObserver.
 *  - Sin imágenes externas: el visor antes/después usa marcadores con CSS.
 *
 *  CÓMO USAR EN CLAUDE.AI:
 *  1) Abre claude.ai y pide "crea un Artifact de React".
 *  2) Pega TODO este archivo como el componente.
 *  3) El componente exportado por defecto es <VitaclinicImmersive/>.
 *
 *  Todo el contenido editable está en el objeto CONTENT (más abajo).
 * ───────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ───────────────────────────  CONTENIDO EDITABLE  ─────────────────────────── */
const CONTENT = {
  brand: {
    name: 'Vitaclinic',
    years: 36,
    whatsapp: '56912345678', // formato internacional, sin "+"
    whatsappMsg: 'Hola Vitaclinic, quisiera agendar una evaluación dermatológica.',
    phone: '+56 9 1234 5678',
    email: 'contacto@vitaclinic.cl',
    address: 'Torre Marriott · Av. Kennedy 5741, Las Condes',
    mapsUrl: 'https://maps.google.com/?q=Torre+Marriott+Av+Kennedy+Las+Condes',
  },
  hero: {
    eyebrow: 'Dermatología · Medicina estética regenerativa',
    title: '36 años cuidando\ntu piel y tu tiempo',
    subtitle:
      'Pioneros en Chile en rejuvenecimiento con células madre y terapia celular. Convertimos ciencia de vanguardia en resultados naturales, sin transformarte.',
    ctaPrimary: 'Agendar evaluación',
    ctaSecondary: 'Conocer la clínica',
    scrollHint: 'Desliza para descubrir',
  },
  trajectory: {
    eyebrow: 'Trayectoria',
    title: 'Una autoridad que nace de la longevidad médica',
    intro:
      'Más de tres décadas perfeccionando la regeneración de la piel. Nuestra confianza no se construyó con marketing, sino con ciencia, especialistas y resultados verificables.',
    milestones: [
      { year: '1990', title: 'Fundación', text: 'Nace Vitaclinic con una visión dermatológica de precisión en Las Condes.' },
      { year: '2004', title: 'Era láser', text: 'Plataformas láser de alta gama para rejuvenecimiento y tratamiento cutáneo.' },
      { year: '2012', title: 'Terapia celular', text: 'Pioneros en Chile en aplicar células madre al rejuvenecimiento natural.' },
      { year: '2024', title: 'Medicina regenerativa', text: 'Protocolos de longevidad celular personalizados con respaldo científico.' },
    ],
    team: [
      { name: 'Dra. [Nombre Apellido]', role: 'Directora médica · Dermatología', detail: 'Especialista en medicina regenerativa y rejuvenecimiento celular.' },
      { name: 'Dr. [Nombre Apellido]', role: 'Medicina estética', detail: 'Experto en armonización facial y resultados naturales.' },
      { name: 'Dra. [Nombre Apellido]', role: 'Terapia celular', detail: 'Investigación clínica en células madre y longevidad de la piel.' },
    ],
  },
  treatments: {
    eyebrow: 'Tratamientos por objetivo',
    title: 'Lo que quieres lograr, con respaldo médico',
    intro: 'Cada protocolo parte de un diagnóstico real de tu piel. El objetivo nunca es transformarte: es regenerar lo que ya eres.',
    items: [
      { name: 'Rejuvenecimiento natural', objective: 'Recuperar firmeza y luminosidad', text: 'Protocolos que estimulan la regeneración de tu piel para un resultado fresco, sin rastros de "operado".', tags: ['Firmeza', 'Luminosidad', 'Colágeno'] },
      { name: 'Terapia celular', objective: 'Regenerar desde la dermis', text: 'Células madre y factores de crecimiento aplicados con criterio médico para una renovación profunda.', tags: ['Células madre', 'Regeneración', 'Longevidad'] },
      { name: 'Láser de precisión', objective: 'Textura, manchas y poros', text: 'Plataformas láser de alta gama que tratan la superficie con precisión clínica y mínima recuperación.', tags: ['Textura', 'Manchas', 'Precisión'] },
    ],
  },
  technology: {
    eyebrow: 'Tecnología exclusiva',
    title: 'Ciencia celular que solo encuentras aquí',
    intro: 'Fuimos los primeros en Chile en llevar la terapia celular al rejuvenecimiento. Esa ventaja se traduce en protocolos que pocos pueden ofrecer.',
    features: [
      { title: 'Rejuvenecimiento con células madre', text: 'Terapia regenerativa que potencia la renovación natural de la piel desde su capa más profunda.' },
      { title: 'Medicina de longevidad cutánea', text: 'Estrategias personalizadas para envejecer bien: preservar tu identidad y tu vitalidad.' },
      { title: 'Diagnóstico de precisión', text: 'Evaluación médica detallada antes de cualquier procedimiento. Nada estándar, todo a tu medida.' },
    ],
  },
  results: {
    eyebrow: 'Resultados',
    title: 'Naturalidad que se nota, cambios que no gritan',
    intro: 'Desliza para comparar. Resultados orientados a preservar tu identidad. Reemplaza los marcadores por tus casos reales (con consentimiento).',
    caseLabel: 'Rejuvenecimiento facial · 8 semanas',
    testimonials: [
      { quote: 'Me veo descansada, como yo misma pero mejor. Nadie nota que me hice algo, solo que me veo bien.', author: 'Paciente, 52 años' },
      { quote: 'La confianza de un equipo médico con décadas de experiencia. Eso no se improvisa.', author: 'Paciente, 47 años' },
    ],
  },
  booking: {
    eyebrow: 'Agenda',
    title: 'Tu evaluación comienza con una conversación',
    intro: 'Cuéntanos qué te gustaría mejorar. Te proponemos un plan con respaldo médico, pensado para que sigas siendo tú.',
    interests: ['Rejuvenecimiento natural', 'Terapia celular', 'Láser de precisión', 'Aún no lo sé'],
  },
  nav: [
    { label: 'Trayectoria', href: '#trayectoria' },
    { label: 'Tratamientos', href: '#tratamientos' },
    { label: 'Tecnología', href: '#tecnologia' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Agenda', href: '#agenda' },
  ],
};

const COLORS = {
  pearl: '#F7F5F2',
  sage: '#6E8B7A',
  champagne: '#C8A86B',
  charcoal: '#1C2024',
  nude: '#E8D7CC',
};

/* ───────────────  Estado global ligero (scroll/mouse sin re-render)  ─────────────── */
const G = { scroll: 0, mouseX: 0, mouseY: 0 };

/* ─────────────────────────────  SHADERS (inline)  ───────────────────────────── */
const CELL_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uMouse;
  uniform float uPR;
  uniform float uSize;
  attribute vec3 aSeed;
  attribute float aScale;
  attribute float aPhase;
  varying float vGlow;
  void main() {
    vec3 pos = aSeed;
    float t = uTime * 0.25;
    // Deriva orgánica (flujo celular) con funciones trigonométricas.
    pos.x += sin(t + aPhase * 6.283 + aSeed.y) * 0.5;
    pos.y += cos(t * 0.9 + aPhase * 6.283 + aSeed.x) * 0.5;
    pos.z += sin(t * 0.7 + aPhase * 3.0) * 0.3;
    // El scroll reorganiza las células en capas (regeneración → piel).
    float org = smoothstep(0.0, 1.0, uScroll);
    pos.y = mix(pos.y, pos.y * 0.5 + sin(pos.x * 2.0 + aPhase) * 0.4, org);
    // Pulso de encendido celular.
    float pulse = sin(uTime * 1.6 + aPhase * 6.283);
    vGlow = smoothstep(0.2, 1.0, pulse);
    // Parallax por mouse.
    pos.xy += uMouse * 0.4 * (0.4 + aScale);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (1.0 + vGlow * 0.6) * uPR * (300.0 / -mv.z);
  }
`;

const CELL_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uCore;
  uniform vec3 uGlow;
  uniform vec3 uNude;
  uniform float uOpacity;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float membrane = smoothstep(0.5, 0.18, d);
    vec3 col = mix(uCore, uGlow, vGlow);
    col = mix(col, uNude, 0.25 * (1.0 - vGlow));
    float intensity = membrane * (0.4 + vGlow * 1.2) + core * vGlow * 0.8;
    gl_FragColor = vec4(col * (1.0 + vGlow * 0.5), intensity * uOpacity);
  }
`;

/* ─────────────────────────────  CAMPO CELULAR 3D  ───────────────────────────── */
function CellField({ count, pr }) {
  const { points, mat } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const seeds = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.5) * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      const z = r * Math.cos(phi) * 0.8 - 1.0;
      seeds.set([x, y, z], i * 3);
      positions.set([x, y, z], i * 3);
      scales[i] = 0.5 + Math.random() * 1.4;
      phases[i] = Math.random();
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: CELL_VERT,
      fragmentShader: CELL_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uPR: { value: pr },
        uSize: { value: 26 },
        uOpacity: { value: 0.9 },
        uCore: { value: new THREE.Color(COLORS.sage) },
        uGlow: { value: new THREE.Color(COLORS.champagne) },
        uNude: { value: new THREE.Color(COLORS.nude) },
      },
    });
    const pts = new THREE.Points(geo, material);
    pts.frustumCulled = false;
    return { points: pts, mat: material };
  }, [count, pr]);

  const sm = useRef(new THREE.Vector2());
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uScroll.value = G.scroll;
    sm.current.x += (G.mouseX - sm.current.x) * 0.05;
    sm.current.y += (G.mouseY - sm.current.y) * 0.05;
    mat.uniforms.uMouse.value.copy(sm.current);
  });

  return <primitive object={points} />;
}

/* ─────────────────────────────  RIG DE CÁMARA  ───────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  useFrame(() => {
    target.current.set(G.mouseX * 0.5, G.mouseY * 0.3 + 0.2, 6 - G.scroll * 1.2);
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0, -1);
  });
  return null;
}

/* ─────────────────────────────  ESCENA DE FONDO  ───────────────────────────── */
function Scene() {
  const [ready, setReady] = useState(false);
  const mobile = typeof window !== 'undefined' && window.innerWidth < 820;
  const count = mobile ? 700 : 1600;
  const pr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, mobile ? 1.6 : 2);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(id);
  }, []);
  if (!ready) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} aria-hidden="true">
      <Canvas
        dpr={[1, pr]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.2, 6], fov: 45, near: 0.1, far: 50 }}
      >
        <color attach="background" args={[COLORS.pearl]} />
        <fog attach="fog" args={[COLORS.pearl, 7, 16]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} color={'#FFF6E8'} />
        <CameraRig />
        <CellField count={count} pr={pr} />
      </Canvas>
    </div>
  );
}

/* ─────────────────────────────  HOOK DE REVELADO  ───────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'none';
          obs.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, style, className, id, as = 'div' }) {
  const ref = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: `opacity .9s cubic-bezier(.22,1,.36,1) ${delay}s, transform .9s cubic-bezier(.22,1,.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────  CONTADOR ANIMADO  ───────────────────────────── */
function AnimatedNumber({ to, suffix = '', duration = 1.8 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;
    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / (duration * 1000), 1);
        setVal(Math.round((1 - Math.pow(1 - t, 3)) * to));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !started) {
          started = true;
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─────────────────────────  CURSOR CON HALO DORADO  ───────────────────────── */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.body.style.cursor = 'none';
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const rp = { ...pos };
    let raf = 0;
    const move = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px,${pos.y}px)`;
    };
    const over = (e) => {
      const i = e.target.closest('a,button,[role="slider"],input,select,textarea,label');
      if (ring.current) {
        ring.current.style.width = ring.current.style.height = i ? '56px' : '34px';
        ring.current.style.marginLeft = ring.current.style.marginTop = i ? '-28px' : '-17px';
        ring.current.style.background = i ? 'rgba(200,168,107,.1)' : 'transparent';
      }
    };
    const loop = () => {
      rp.x += (pos.x - rp.x) * 0.18;
      rp.y += (pos.y - rp.y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rp.x}px,${rp.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', move);
    addEventListener('pointerover', over);
    raf = requestAnimationFrame(loop);
    return () => {
      document.body.style.cursor = '';
      removeEventListener('pointermove', move);
      removeEventListener('pointerover', over);
      cancelAnimationFrame(raf);
    };
  }, []);
  const base = { position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 90, borderRadius: '50%', willChange: 'transform' };
  return (
    <>
      <div ref={ring} style={{ ...base, width: 34, height: 34, marginLeft: -17, marginTop: -17, border: '1px solid rgba(200,168,107,.6)', boxShadow: '0 0 18px rgba(200,168,107,.35)', transition: 'width .3s,height .3s,margin .3s,background .3s' }} />
      <div ref={dot} style={{ ...base, width: 6, height: 6, marginLeft: -3, marginTop: -3, background: COLORS.champagne, mixBlendMode: 'multiply' }} />
    </>
  );
}

/* ─────────────────────  VISOR ANTES / DESPUÉS (slider CSS)  ───────────────────── */
function BeforeAfter({ label }) {
  const [split, setSplit] = useState(0.5);
  const drag = useRef(false);
  const set = (clientX, el) => {
    const r = el.getBoundingClientRect();
    setSplit(Math.max(0.02, Math.min(0.98, (clientX - r.left) / r.width)));
  };
  return (
    <div>
      <div
        role="slider"
        aria-label="Comparar antes y después"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(split * 100)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setSplit((s) => Math.max(0.02, s - 0.05));
          if (e.key === 'ArrowRight') setSplit((s) => Math.min(0.98, s + 0.05));
        }}
        onPointerDown={(e) => {
          drag.current = true;
          set(e.clientX, e.currentTarget);
        }}
        onPointerMove={(e) => drag.current && set(e.clientX, e.currentTarget)}
        onPointerUp={() => (drag.current = false)}
        onPointerLeave={() => (drag.current = false)}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          margin: '0 auto',
          aspectRatio: '4 / 5',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(28,32,36,.16)',
          touchAction: 'none',
          cursor: 'ew-resize',
          userSelect: 'none',
        }}
      >
        {/* Después (renovado, más luminoso) */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${COLORS.pearl}, ${COLORS.nude} 60%, #D8C2B2)`, display: 'grid', placeItems: 'center', color: 'rgba(28,32,36,.4)', fontFamily: 'Georgia, serif' }}>Después</div>
        {/* Antes (más apagado), recortado por el divisor */}
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - split * 100}% 0 0)`, background: `linear-gradient(160deg, ${COLORS.nude}, #D2BCAC 60%, #B9A292)`, display: 'grid', placeItems: 'center', color: 'rgba(28,32,36,.4)', fontFamily: 'Georgia, serif' }}>Antes</div>
        {/* Divisor */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${split * 100}%`, width: 2, background: COLORS.champagne, transform: 'translateX(-50%)', boxShadow: '0 0 18px rgba(200,168,107,.6)', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 42, height: 42, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: COLORS.pearl, border: `1px solid ${COLORS.champagne}`, boxShadow: '0 6px 18px rgba(28,32,36,.2)', display: 'grid', placeItems: 'center', fontSize: 12, color: COLORS.champagne }}>⟷</div>
        </div>
        <div style={{ position: 'absolute', inset: 'auto 0 0 0', display: 'flex', justifyContent: 'space-between', padding: '1rem 1.1rem', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: COLORS.pearl, pointerEvents: 'none', background: 'linear-gradient(transparent, rgba(28,32,36,.35))' }}>
          <span>Antes</span>
          <span>Después</span>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: 13, color: 'rgba(28,32,36,.4)', letterSpacing: '.06em' }}>{label}</p>
    </div>
  );
}

/* ─────────────────────────  BOTÓN WHATSAPP FLOTANTE  ───────────────────────── */
function WhatsAppButton() {
  const href = `https://wa.me/${CONTENT.brand.whatsapp}?text=${encodeURIComponent(CONTENT.brand.whatsappMsg)}`;
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar por WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 60, display: 'inline-flex', alignItems: 'center', height: 60, padding: '0 18px', borderRadius: 100, background: COLORS.sage, color: COLORS.pearl, boxShadow: '0 12px 30px rgba(28,32,36,.22)', textDecoration: 'none', transition: 'background .3s' }}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.45 13.7c-.26.73-1.53 1.43-2.1 1.48-.57.05-1.11.26-3.75-.78-3.17-1.24-5.24-4.43-5.4-4.64-.16-.21-1.29-1.71-1.29-3.26 0-1.55.81-2.32 1.1-2.63.29-.31.63-.39.84-.39l.59.01c.19.01.44-.07.69.54.26.62.87 2.16.95 2.32.08.16.13.34.03.55-.1.21-.15.34-.31.52l-.47.55c-.16.15-.32.32-.14.63.18.31.81 1.33 1.73 2.15 1.19 1.06 2.19 1.38 2.5 1.54.31.16.5.13.68-.08.18-.21.78-.91.99-1.22.21-.32.42-.26.71-.16.29.1 1.82.85 2.13 1.01.31.16.52.24.6.37.08.13.08.75-.18 1.48z" />
      </svg>
      <span style={{ maxWidth: hover ? 200 : 0, overflow: 'hidden', whiteSpace: 'nowrap', fontSize: 13, letterSpacing: '.04em', opacity: hover ? 1 : 0, marginLeft: hover ? 10 : 0, transition: 'max-width .45s, opacity .35s, margin .45s' }}>Agenda tu evaluación</span>
    </a>
  );
}

/* ─────────────────────────────  NAV  ───────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 60);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, background: scrolled ? 'rgba(247,245,242,.8)' : 'transparent', backdropFilter: scrolled ? 'blur(14px)' : 'none', borderBottom: scrolled ? '1px solid rgba(28,32,36,.12)' : '1px solid transparent', transition: 'all .4s' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,4rem)', height: scrolled ? 64 : 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'height .4s' }}>
        <a href="#top" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem,1.1rem+.7vw,1.6rem)', color: COLORS.charcoal, textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
          {CONTENT.brand.name}
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: COLORS.champagne, display: 'inline-block' }} />
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem,2.4vw,2.2rem)' }} className="va-navlinks" data-open={open}>
          {CONTENT.nav.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(28,32,36,.7)', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
          <a href="#agenda" onClick={() => setOpen(false)} style={{ padding: '.55rem 1.2rem', border: `1px solid ${COLORS.champagne}`, borderRadius: 100, color: COLORS.charcoal, textDecoration: 'none', fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Agendar
          </a>
        </nav>
        <button className="va-burger" aria-label="Menú" aria-expanded={open} onClick={() => setOpen((o) => !o)} style={{ display: 'none', flexDirection: 'column', gap: 6, width: 34, height: 34, alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span style={{ width: 22, height: 1.5, background: COLORS.charcoal }} />
          <span style={{ width: 22, height: 1.5, background: COLORS.charcoal }} />
        </button>
      </div>
    </header>
  );
}

/* ─────────────────────────  HELPERS DE LAYOUT  ───────────────────────── */
const Container = ({ children, style }) => <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,4rem)', position: 'relative', zIndex: 10, ...style }}>{children}</div>;
const Eyebrow = ({ children, color }) => <p style={{ fontWeight: 500, fontSize: 13, letterSpacing: '.22em', textTransform: 'uppercase', color: color || COLORS.sage, margin: 0 }}>{children}</p>;
const Btn = ({ children, href, variant = 'primary' }) => {
  const styles = variant === 'primary'
    ? { background: COLORS.charcoal, color: COLORS.pearl, boxShadow: '0 10px 28px rgba(28,32,36,.18)' }
    : { border: '1px solid rgba(28,32,36,.12)', color: COLORS.charcoal };
  return (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '.95rem 1.8rem', borderRadius: 100, fontSize: 'clamp(1rem,.95rem+.25vw,1.15rem)', textDecoration: 'none', transition: 'transform .3s, background .3s', ...styles }}>
      {children}
    </a>
  );
};

/* ─────────────────────────────  SECCIONES  ───────────────────────────── */
function Hero() {
  const c = CONTENT.hero;
  const wa = `https://wa.me/${CONTENT.brand.whatsapp}?text=${encodeURIComponent(CONTENT.brand.whatsappMsg)}`;
  return (
    <section id="top" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', padding: '8rem 0 4rem', position: 'relative' }}>
      <Container style={{ maxWidth: 820 }}>
        <Reveal><Eyebrow>{c.eyebrow}</Eyebrow></Reveal>
        <Reveal delay={0.05}><h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3.2rem,2.2rem+5vw,7rem)', lineHeight: 1.04, margin: '1.2rem 0 1.6rem', whiteSpace: 'pre-line', color: COLORS.charcoal }}>{c.title}</h1></Reveal>
        <Reveal delay={0.12}><p style={{ fontSize: 'clamp(1.25rem,1.1rem+.7vw,1.6rem)', fontWeight: 300, color: 'rgba(28,32,36,.7)', maxWidth: '56ch', lineHeight: 1.45 }}>{c.subtitle}</p></Reveal>
        <Reveal delay={0.2}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2.4rem' }}>
            <Btn href={wa}>{c.ctaPrimary}</Btn>
            <Btn href="#trayectoria" variant="ghost">{c.ctaSecondary}</Btn>
          </div>
        </Reveal>
        <Reveal delay={0.28}>
          <div style={{ display: 'flex', gap: 'clamp(1.5rem,4vw,3.5rem)', marginTop: '3rem', flexWrap: 'wrap' }}>
            {[
              { n: <AnimatedNumber to={CONTENT.brand.years} />, l: 'Años de trayectoria' },
              { n: <span>1<sup style={{ fontSize: '.5em', color: COLORS.champagne }}>os</sup></span>, l: 'En terapia celular en Chile' },
              { n: <AnimatedNumber to={100} suffix="%" />, l: 'Enfoque en naturalidad' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem,1.8rem+3vw,4.4rem)', lineHeight: 1, color: COLORS.charcoal }}>{s.n}</div>
                <div style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(28,32,36,.4)', marginTop: '.4rem' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
      <a href="#trayectoria" style={{ position: 'absolute', left: 'clamp(1.25rem,5vw,4rem)', bottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '.7rem', fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(28,32,36,.4)', textDecoration: 'none' }}>
        <span className="va-scrollline" style={{ width: 46, height: 1, background: 'rgba(28,32,36,.4)', display: 'inline-block' }} />
        {c.scrollHint}
      </a>
    </section>
  );
}

function SectionHead({ eyebrow, title, intro, color }) {
  return (
    <div style={{ maxWidth: 720, marginBottom: 'clamp(2.5rem,6vw,4.5rem)' }}>
      <Reveal><Eyebrow color={color}>{eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}><h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem,1.8rem+3vw,4.4rem)', lineHeight: 1.04, margin: '.9rem 0 1.2rem', color: color ? COLORS.pearl : COLORS.charcoal }}>{title}</h2></Reveal>
      <Reveal delay={0.1}><p style={{ fontSize: 'clamp(1.25rem,1.1rem+.7vw,1.6rem)', fontWeight: 300, color: color ? 'rgba(247,245,242,.7)' : 'rgba(28,32,36,.7)', lineHeight: 1.5 }}>{intro}</p></Reveal>
    </div>
  );
}

const sectionPad = { padding: 'clamp(5rem,12vh,9rem) 0', position: 'relative', zIndex: 10 };

function Trajectory() {
  const c = CONTENT.trajectory;
  return (
    <section id="trayectoria" style={sectionPad}>
      <Container>
        <SectionHead eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <Reveal>
          <div style={{ display: 'grid', gap: 1, background: 'rgba(28,32,36,.12)', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(28,32,36,.12)', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
            {c.milestones.map((m) => (
              <div key={m.year} style={{ background: COLORS.pearl, padding: '2rem 1.6rem' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.7rem,1.4rem+1.4vw,2.6rem)', lineHeight: 1, color: COLORS.champagne }}>{m.year}</div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem,1.1rem+.7vw,1.6rem)', margin: '.8rem 0 .5rem', color: COLORS.charcoal }}>{m.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(28,32,36,.7)', margin: 0 }}>{m.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <div style={{ display: 'grid', gap: '1.6rem', marginTop: '3.5rem', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {c.team.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div style={{ borderRadius: 18, overflow: 'hidden', background: '#fffdfa', border: '1px solid rgba(28,32,36,.12)' }}>
                <div style={{ aspectRatio: '4 / 5', background: `linear-gradient(160deg, ${COLORS.nude}, rgba(110,139,122,.14))`, display: 'grid', placeItems: 'center', color: 'rgba(28,32,36,.4)', fontSize: 13 }}>Foto del equipo</div>
                <div style={{ padding: '1.3rem 1.4rem 1.6rem' }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem,1.1rem+.7vw,1.6rem)', margin: 0, color: COLORS.charcoal }}>{p.name}</h3>
                  <p style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: COLORS.sage, margin: '.4rem 0 .7rem' }}>{p.role}</p>
                  <p style={{ fontSize: 13, color: 'rgba(28,32,36,.7)', margin: 0 }}>{p.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Treatments() {
  const c = CONTENT.treatments;
  return (
    <section id="tratamientos" style={sectionPad}>
      <Container>
        <SectionHead eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <div style={{ display: 'grid', gap: '1.6rem', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {c.items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="va-card" style={{ position: 'relative', borderRadius: 18, padding: '2rem 1.8rem 2.2rem', background: '#fffdfa', border: '1px solid rgba(28,32,36,.12)', overflow: 'hidden', transition: 'transform .5s, box-shadow .5s' }}>
                <p style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: COLORS.sage, margin: 0 }}>{t.objective}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.7rem,1.4rem+1.4vw,2.6rem)', margin: '.6rem 0 .9rem', color: COLORS.charcoal }}>{t.name}</h3>
                <p style={{ color: 'rgba(28,32,36,.7)', margin: 0 }}>{t.text}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '1.4rem' }}>
                  {t.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: 12, padding: '.35rem .8rem', borderRadius: 100, background: 'rgba(110,139,122,.14)', color: COLORS.sage }}>{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Technology() {
  const c = CONTENT.technology;
  return (
    <section id="tecnologia" style={sectionPad}>
      <Container>
        <SectionHead eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <div style={{ display: 'grid', gap: '1.6rem', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
          {c.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div style={{ padding: '2rem 1.8rem', borderLeft: `2px solid ${COLORS.champagne}`, background: 'linear-gradient(90deg, rgba(200,168,107,.06), transparent)', borderRadius: '0 18px 18px 0' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem,1.1rem+.7vw,1.6rem)', marginBottom: '.7rem', color: COLORS.charcoal }}>{f.title}</h3>
                <p style={{ color: 'rgba(28,32,36,.7)', margin: 0 }}>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Results() {
  const c = CONTENT.results;
  return (
    <section id="resultados" style={sectionPad}>
      <Container>
        <SectionHead eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <div style={{ display: 'grid', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'center', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          <Reveal><BeforeAfter label={c.caseLabel} /></Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gap: '1.4rem' }}>
              {c.testimonials.map((t) => (
                <figure key={t.author} style={{ padding: '1.8rem', borderRadius: 18, background: '#fffdfa', border: '1px solid rgba(28,32,36,.12)', margin: 0 }}>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem,1.1rem+.7vw,1.6rem)', fontStyle: 'italic', lineHeight: 1.35, margin: 0, color: COLORS.charcoal }}>“{t.quote}”</p>
                  <figcaption style={{ marginTop: '1rem', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: COLORS.sage }}>{t.author}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Booking() {
  const c = CONTENT.booking;
  const b = CONTENT.brand;
  const [sent, setSent] = useState(false);
  const wa = `https://wa.me/${b.whatsapp}?text=${encodeURIComponent(b.whatsappMsg)}`;
  const submit = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const msg = `Hola Vitaclinic, soy ${d.get('name') || ''}. Me interesa: ${d.get('interest') || ''}. ${d.get('message') || ''}`.trim();
    window.open(`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
    e.currentTarget.reset();
  };
  const fieldStyle = { fontSize: '1rem', color: COLORS.pearl, background: 'rgba(247,245,242,.06)', border: '1px solid rgba(247,245,242,.18)', borderRadius: 12, padding: '.85rem 1rem', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(247,245,242,.6)', marginBottom: '.4rem', display: 'block' };
  return (
    <section id="agenda" style={sectionPad}>
      <Container>
        <div style={{ background: COLORS.charcoal, color: COLORS.pearl, borderRadius: 'clamp(20px,4vw,40px)', padding: 'clamp(2.5rem,6vw,5rem) clamp(1.5rem,5vw,4rem)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: '60%', height: '120%', background: 'radial-gradient(circle, rgba(200,168,107,.18), transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ display: 'grid', gap: 'clamp(2rem,5vw,4rem)', position: 'relative', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            <div>
              <Reveal><Eyebrow color={COLORS.champagne}>{c.eyebrow}</Eyebrow></Reveal>
              <Reveal delay={0.05}><h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem,1.8rem+3vw,4.4rem)', lineHeight: 1.04, margin: '.8rem 0 1.2rem' }}>{c.title}</h2></Reveal>
              <Reveal delay={0.1}><p style={{ color: 'rgba(247,245,242,.7)', fontSize: 'clamp(1.25rem,1.1rem+.7vw,1.6rem)', fontWeight: 300, maxWidth: '42ch' }}>{c.intro}</p></Reveal>
              <Reveal delay={0.16}>
                <div style={{ marginTop: '2.4rem', display: 'grid', gap: '1.1rem' }}>
                  {[
                    { t: 'Agendar por WhatsApp', h: wa },
                    { t: b.phone, h: `tel:${b.phone.replace(/\s/g, '')}` },
                    { t: b.address, h: b.mapsUrl },
                    { t: b.email, h: `mailto:${b.email}` },
                  ].map((x) => (
                    <a key={x.t} href={x.h} target={x.h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '.7rem', color: 'rgba(247,245,242,.82)', textDecoration: 'none' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.champagne, flex: 'none' }} />
                      {x.t}
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              {sent ? (
                <div role="status" style={{ padding: '1rem 1.2rem', borderRadius: 12, background: 'rgba(110,139,122,.2)', border: `1px solid ${COLORS.sage}`, color: COLORS.pearl }}>
                  Gracias. Te contactaremos a la brevedad para coordinar tu evaluación.
                </div>
              ) : (
                <form onSubmit={submit} style={{ display: 'grid', gap: '1.1rem' }}>
                  <div style={{ display: 'grid', gap: '1.1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <div><label style={labelStyle}>Nombre</label><input name="name" required style={fieldStyle} /></div>
                    <div><label style={labelStyle}>Teléfono</label><input name="phone" type="tel" style={fieldStyle} /></div>
                  </div>
                  <div style={{ display: 'grid', gap: '1.1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <div><label style={labelStyle}>Email</label><input name="email" type="email" style={fieldStyle} /></div>
                    <div>
                      <label style={labelStyle}>Me interesa</label>
                      <select name="interest" defaultValue="" style={{ ...fieldStyle, color: COLORS.pearl }}>
                        <option value="" disabled>—</option>
                        {c.interests.map((o) => <option key={o} value={o} style={{ color: COLORS.charcoal }}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label style={labelStyle}>Cuéntanos (opcional)</label><textarea name="message" rows={3} style={fieldStyle} /></div>
                  <button type="submit" style={{ background: COLORS.champagne, color: COLORS.charcoal, border: 'none', borderRadius: 100, padding: '.95rem 1.8rem', fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', justifySelf: 'start' }}>
                    Solicitar evaluación
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────  ESTILOS GLOBALES  ───────────────────────────── */
function GlobalStyles() {
  useEffect(() => {
    // Tipografías de marca (con fallback a serif del sistema si el sandbox las bloquea).
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);
  return (
    <style>{`
      :root { --serif: 'Cormorant Garamond', Georgia, serif; }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; font-family: 'Inter', -apple-system, sans-serif; font-weight: 300; color: ${COLORS.charcoal}; background: ${COLORS.pearl}; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
      a:focus-visible, button:focus-visible, [role=slider]:focus-visible { outline: 2px solid ${COLORS.champagne}; outline-offset: 3px; }
      ::selection { background: rgba(200,168,107,.16); }
      .va-card:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(28,32,36,.12); }
      .va-scrollline { position: relative; overflow: hidden; }
      .va-scrollline::after { content: ''; position: absolute; inset: 0; width: 40%; background: ${COLORS.champagne}; animation: vaSweep 2.4s cubic-bezier(.22,1,.36,1) infinite; }
      @keyframes vaSweep { 0% { transform: translateX(-120%);} 100% { transform: translateX(260%);} }
      @media (max-width: 820px) {
        .va-burger { display: flex !important; }
        .va-navlinks { position: fixed; top: 64px; left: 0; right: 0; flex-direction: column !important; align-items: flex-start !important; gap: 1.4rem !important; padding: 2rem clamp(1.25rem,5vw,4rem) 2.4rem; background: rgba(247,245,242,.92); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(28,32,36,.12); transform: translateY(-12px); opacity: 0; pointer-events: none; transition: opacity .3s, transform .3s; }
        .va-navlinks[data-open="true"] { opacity: 1; transform: none; pointer-events: auto; }
      }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .va-scrollline::after { animation: none; } }
    `}</style>
  );
}

/* ─────────────────────────────  RAÍZ DE LA APP  ───────────────────────────── */
export default function VitaclinicImmersive() {
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      G.scroll = max > 0 ? scrollY / max : 0;
    };
    const onMove = (e) => {
      G.mouseX = (e.clientX / innerWidth) * 2 - 1;
      G.mouseY = -((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('pointermove', onMove, { passive: true });
    onScroll();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      {reduced ? (
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, background: `radial-gradient(circle at 30% 20%, #fffdf8, ${COLORS.pearl} 55%), radial-gradient(circle at 80% 80%, rgba(200,168,107,.12), transparent 50%)` }} />
      ) : (
        <Scene />
      )}
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Trajectory />
        <Treatments />
        <Technology />
        <Results />
        <Booking />
      </main>
      <footer style={{ padding: '3rem 0 4rem', textAlign: 'center', color: 'rgba(28,32,36,.4)', fontSize: 13, position: 'relative', zIndex: 10 }}>
        <Container>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} {CONTENT.brand.name} · {CONTENT.brand.address}</p>
          <p style={{ marginTop: '.6rem', maxWidth: '60ch', marginLeft: 'auto', marginRight: 'auto' }}>
            Rejuvenecimiento natural con respaldo médico. Resultados individuales; la información no reemplaza una evaluación clínica.
          </p>
        </Container>
      </footer>
      <WhatsAppButton />
    </>
  );
}
