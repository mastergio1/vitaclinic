import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CellField } from './CellField';
import { SkinSurface } from './SkinSurface';
import { Effects } from './Effects';
import { globalState } from '../lib/globalState';
import { detectQuality, type QualityProfile } from '../lib/quality';
import { useReducedMotion } from '../lib/useReducedMotion';

/** Cámara con parallax suave según mouse y leve travelling con el scroll. */
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    if (reduced) return;
    const x = globalState.mouseX * 0.5;
    const y = globalState.mouseY * 0.3 + 0.2;
    const z = 6 - globalState.scroll * 1.2; // leve acercamiento al avanzar
    target.current.set(x, y, z);
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0, -1);
  });
  return null;
}

/** Luz clínica alta-key con un toque dorado. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.9} color={'#F7F5F2'} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color={'#FFF6E8'} />
      <pointLight position={[-4, -2, 3]} intensity={0.5} color={'#C8A86B'} />
    </>
  );
}

/**
 * Canvas de fondo fijo. Lazy-init: solo monta cuando el documento está listo,
 * para no bloquear el primer render del contenido.
 */
export function Scene() {
  const reduced = useReducedMotion();
  const [quality, setQuality] = useState<QualityProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setQuality(detectQuality());
    // Lazy-init del canvas tras el primer paint para priorizar contenido/LCP.
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const id = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 600 })
      : window.setTimeout(() => setReady(true), 250);
    return () => {
      if (hasIdle) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  if (!quality || !ready) return null;

  const pixelRatio = Math.min(quality.dpr[1], window.devicePixelRatio || 1);
  const usePost = quality.postprocessing && !reduced;

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={quality.dpr}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0.2, 6], fov: 45, near: 0.1, far: 50 }}
        // Pausa el render cuando el canvas no está visible (ahorro de batería).
        frameloop={reduced ? 'demand' : 'always'}
      >
        <color attach="background" args={['#F7F5F2']} />
        <fog attach="fog" args={['#F7F5F2', 7, 16]} />
        <Lights />
        <CameraRig reduced={reduced} />
        <Suspense fallback={null}>
          <SkinSurface segments={quality.skinSegments} reduced={reduced} />
          <CellField count={quality.particleCount} pixelRatio={pixelRatio} reduced={reduced} />
        </Suspense>
        {usePost && <Effects mobile={quality.isMobile} />}
      </Canvas>
    </div>
  );
}
