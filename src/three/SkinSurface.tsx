import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalState } from '../lib/globalState';
import vertexShader from './shaders/skin.vert.glsl';
import fragmentShader from './shaders/skin.frag.glsl';

interface Props {
  segments: number;
  reduced: boolean;
}

/**
 * Plano tipo "piel/seda" con flujo sutil. Vive al fondo, inclinado,
 * y reacciona al scroll revelando capas más luminosas (rejuvenecimiento).
 */
export function SkinSurface({ segments, reduced }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const smoothMouse = useRef(new THREE.Vector2());

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorDeep: { value: new THREE.Color('#E8D7CC') },
      uColorSurface: { value: new THREE.Color('#F7F5F2') },
      uColorSheen: { value: new THREE.Color('#C8A86B') },
    }),
    [],
  );

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += reduced ? delta * 0.2 : delta;
    m.uniforms.uScroll.value = globalState.scroll;
    smoothMouse.current.x += (globalState.mouseX - smoothMouse.current.x) * 0.04;
    smoothMouse.current.y += (globalState.mouseY - smoothMouse.current.y) * 0.04;
    m.uniforms.uMouse.value.copy(smoothMouse.current);
  });

  return (
    <mesh rotation={[-Math.PI * 0.42, 0, 0]} position={[0, -2.4, -2]}>
      <planeGeometry args={[18, 12, segments, segments]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
