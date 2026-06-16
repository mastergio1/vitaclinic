// Campo celular — vértice.
// Cada instancia es una "célula" que flota, deriva y se regenera con el scroll.
#include "./lib/noise.glsl";

uniform float uTime;
uniform float uScroll;       // 0..1 progreso global
uniform float uVelocity;     // velocidad de scroll suavizada
uniform vec2  uMouse;        // parallax -1..1
uniform float uPixelRatio;
uniform float uSize;

attribute vec3 aSeed;        // semilla por instancia (posición base + fase)
attribute float aScale;      // escala individual
attribute float aPhase;      // desfase temporal para la regeneración

varying float vGlow;         // intensidad de "encendido" celular
varying float vDepth;        // profundidad para tinte
varying float vSeed;

void main() {
  vSeed = aPhase;

  vec3 pos = aSeed;

  // Deriva orgánica con ruido fractal (flujo sutil tipo fluido biológico).
  float t = uTime * 0.12;
  vec3 flow;
  flow.x = fbm(pos * 0.35 + vec3(t, 0.0, 0.0));
  flow.y = fbm(pos * 0.35 + vec3(0.0, t, 10.0));
  flow.z = fbm(pos * 0.35 + vec3(5.0, 0.0, t));
  pos += flow * 0.9;

  // El scroll reorganiza las células: de un campo disperso a capas ordenadas
  // (metáfora de regeneración celular → capas de piel).
  float organize = smoothstep(0.0, 1.0, uScroll);
  vec3 layered = pos;
  layered.y = pos.y * (1.0 - organize * 0.55) + sin(pos.x * 2.0 + aPhase) * organize * 0.4;
  pos = mix(pos, layered, organize);

  // Pulso de regeneración: las células laten y se "encienden" por fases.
  float pulse = sin(uTime * 1.6 + aPhase * 6.2831);
  vGlow = smoothstep(0.2, 1.0, pulse) ;

  // El scroll acelera la regeneración → más brillo en zonas activas.
  vGlow = clamp(vGlow + abs(uVelocity) * 6.0, 0.0, 1.0);

  // Parallax suave según mouse.
  pos.xy += uMouse * 0.4 * (0.4 + aScale);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vDepth = -mvPosition.z;

  gl_Position = projectionMatrix * mvPosition;

  // Tamaño con atenuación por distancia + DPR.
  float size = uSize * aScale * (1.0 + vGlow * 0.6);
  gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
}
