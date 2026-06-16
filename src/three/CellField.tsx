import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalState } from '../lib/globalState';
import vertexShader from './shaders/cells.vert.glsl';
import fragmentShader from './shaders/cells.frag.glsl';

interface Props {
  count: number;
  pixelRatio: number;
  reduced: boolean;
}

/**
 * Campo de "células madre" como partículas GLSL.
 * Usa atributos por instancia (semilla, escala, fase) y un único draw call.
 */
export function CellField({ count, pixelRatio, reduced }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const seeds = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const positions = new Float32Array(count * 3); // requerido por three

    // Distribución en un volumen elipsoidal suave alrededor de cámara.
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

    const uni = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: pixelRatio },
      uSize: { value: 26 },
      uOpacity: { value: 0.9 },
      uColorCore: { value: new THREE.Color('#6E8B7A') },
      uColorGlow: { value: new THREE.Color('#C8A86B') },
      uColorNude: { value: new THREE.Color('#E8D7CC') },
    };

    return { geometry: geo, uniforms: uni };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const smoothMouse = useRef(new THREE.Vector2());
  const smoothVel = useRef(0);

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value += reduced ? delta * 0.25 : delta;
    u.uScroll.value = globalState.scroll;

    // Suavizado de mouse y velocidad para movimientos elegantes.
    smoothMouse.current.x += (globalState.mouseX - smoothMouse.current.x) * 0.05;
    smoothMouse.current.y += (globalState.mouseY - smoothMouse.current.y) * 0.05;
    u.uMouse.value.copy(smoothMouse.current);

    const targetVel = reduced ? 0 : globalState.scrollVelocity;
    smoothVel.current += (targetVel - smoothVel.current) * 0.1;
    u.uVelocity.value = smoothVel.current;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
