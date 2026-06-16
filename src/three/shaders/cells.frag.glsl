// Campo celular — fragmento.
// Dibuja cada partícula como una célula luminosa con núcleo y halo dorado.
precision highp float;

uniform vec3 uColorCore;   // núcleo (salvia)
uniform vec3 uColorGlow;   // halo (champagne)
uniform vec3 uColorNude;   // nude para mezcla cálida
uniform float uOpacity;

varying float vGlow;
varying float vDepth;
varying float vSeed;

void main() {
  // Coordenada radial del punto.
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // Descarta fuera del círculo (célula redonda).
  if (d > 0.5) discard;

  // Núcleo brillante + caída suave (membrana).
  float core = smoothstep(0.5, 0.0, d);
  float membrane = smoothstep(0.5, 0.18, d);

  // Mezcla de color: núcleo salvia → halo champagne según encendido.
  vec3 col = mix(uColorCore, uColorGlow, vGlow);
  col = mix(col, uColorNude, 0.25 * (1.0 - vGlow));

  // Brillo del núcleo cuando la célula está "regenerándose".
  float intensity = membrane * (0.4 + vGlow * 1.2);
  intensity += core * vGlow * 0.8;

  // Atenuación por profundidad (las lejanas se difuminan).
  float depthFade = clamp(1.0 - vDepth * 0.02, 0.15, 1.0);

  float alpha = intensity * uOpacity * depthFade;

  gl_FragColor = vec4(col * (1.0 + vGlow * 0.5), alpha);

  #include <colorspace_fragment>
}
