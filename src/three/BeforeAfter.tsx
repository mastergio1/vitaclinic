import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/beforeafter.vert.glsl';
import fragmentShader from './shaders/beforeafter.frag.glsl';

/**
 * Genera una textura procedural (gradiente piel) como marcador mientras
 * no existan las fotos reales. `tone` desplaza el matiz para diferenciar
 * "antes" (más apagado) de "después" (más luminoso).
 */
function makePlaceholderTexture(label: string, tone: number): THREE.Texture {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = Math.round(size * 1.2);
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, size, c.height);
  if (tone > 0) {
    g.addColorStop(0, '#F7F5F2');
    g.addColorStop(0.6, '#E8D7CC');
    g.addColorStop(1, '#D8C2B2');
  } else {
    g.addColorStop(0, '#E8D7CC');
    g.addColorStop(0.6, '#D2BCAC');
    g.addColorStop(1, '#B9A292');
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, c.height);

  ctx.fillStyle = 'rgba(28,32,36,0.32)';
  ctx.font = '500 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, size / 2, c.height / 2);
  ctx.font = '300 16px sans-serif';
  ctx.fillText('Reemplaza esta imagen', size / 2, c.height / 2 + 34);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Carga una textura; si falla (404), devuelve un marcador procedural. */
function useResilientTexture(url: string, tone: number, label: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (t) => {
        if (!alive) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearFilter;
        setTex(t);
      },
      undefined,
      () => {
        if (alive) setTex(makePlaceholderTexture(label, tone));
      },
    );
    return () => {
      alive = false;
    };
  }, [url, tone, label]);

  return tex;
}

interface PlaneProps {
  before: string;
  after: string;
  split: number;
}

function ComparePlane({ before, after, split }: PlaneProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const reveal = useRef(0);
  const { viewport } = useThree();

  const texBefore = useResilientTexture(before, -1, 'Antes');
  const texAfter = useResilientTexture(after, 1, 'Después');

  const uniforms = useMemo(
    () => ({
      uBefore: { value: null as THREE.Texture | null },
      uAfter: { value: null as THREE.Texture | null },
      uSplit: { value: split },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uLine: { value: new THREE.Color('#C8A86B') },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (texBefore) uniforms.uBefore.value = texBefore;
    if (texAfter) uniforms.uAfter.value = texAfter;
  }, [texBefore, texAfter, uniforms]);

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    m.uniforms.uSplit.value += (split - m.uniforms.uSplit.value) * 0.12;
    reveal.current += (1 - reveal.current) * 0.05;
    m.uniforms.uReveal.value = reveal.current;
  });

  // No renderizar hasta tener ambas texturas.
  if (!texBefore || !texAfter) return null;

  const w = Math.min(viewport.width, viewport.height * 0.8);
  const h = w * 1.2;

  return (
    <mesh scale={[w, h, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}

interface Props {
  before: string;
  after: string;
}

/** Visor antes/después en 3D con slider y transición por shader. */
export function BeforeAfter({ before, after }: Props) {
  const [split, setSplit] = useState(0.5);
  const dragging = useRef(false);

  const updateFromClientX = (clientX: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    setSplit(Math.max(0.02, Math.min(0.98, x)));
  };

  return (
    <div
      className="ba-viewer"
      onPointerDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX, e.currentTarget);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX, e.currentTarget);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
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
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 2.2], fov: 45 }}
      >
        <ComparePlane before={before} after={after} split={split} />
      </Canvas>
      <div className="ba-handle" style={{ left: `${split * 100}%` }} aria-hidden="true">
        <span className="ba-handle-grip" />
      </div>
      <div className="ba-tags" aria-hidden="true">
        <span>Antes</span>
        <span>Después</span>
      </div>
    </div>
  );
}
