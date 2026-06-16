// Superficie tipo piel/seda — vértice.
// Onda sutil que fluye, como tela/piel viva. El scroll "revela las capas".
#include "./lib/noise.glsl";

uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Flujo de seda: dos capas de ruido a distinta frecuencia.
  float t = uTime * 0.08;
  float e1 = fbm(vec3(pos.x * 0.6, pos.y * 0.6, t)) * 0.18;
  float e2 = snoise(vec3(pos.x * 1.8 + t, pos.y * 1.8, t * 0.5)) * 0.05;
  float elevation = e1 + e2;

  // El scroll suaviza la superficie (la piel "rejuvenece": menos rugosidad).
  elevation *= mix(1.0, 0.45, smoothstep(0.0, 1.0, uScroll));

  // Influencia del mouse (toque suave que ondula la seda).
  float md = distance(uv, uMouse * 0.5 + 0.5);
  elevation += smoothstep(0.4, 0.0, md) * 0.06;

  pos.z += elevation;
  vElevation = elevation;

  // Normal aproximada para iluminación sutil.
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
