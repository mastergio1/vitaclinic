// Superficie tipo piel/seda — fragmento.
// Gradiente cálido nude→perla con reflejos dorados champagne y revelado de capas.
precision highp float;

uniform float uTime;
uniform float uScroll;
uniform vec3 uColorDeep;   // dermis (nude rosado)
uniform vec3 uColorSurface;// epidermis (perla)
uniform vec3 uColorSheen;  // reflejo (champagne)

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

void main() {
  // Gradiente base epidermis → dermis según UV vertical.
  float layer = smoothstep(0.0, 1.0, vUv.y);

  // El scroll "rejuvenece": revela una capa más luminosa y uniforme.
  float renew = smoothstep(0.0, 1.0, uScroll);
  vec3 base = mix(uColorDeep, uColorSurface, layer);
  base = mix(base, uColorSurface, renew * 0.4);

  // Reflejo de seda dependiente de la elevación (sheen dorado sutil).
  float sheen = smoothstep(0.02, 0.16, vElevation);
  base = mix(base, uColorSheen, sheen * 0.35);

  // Banda de luz que viaja (travelling de luz suave).
  float sweep = sin(vUv.x * 3.1416 - uTime * 0.25 + uScroll * 3.0) * 0.5 + 0.5;
  base += uColorSheen * pow(sweep, 6.0) * 0.12;

  // Iluminación alta-key muy suave.
  float light = clamp(dot(vNormal, normalize(vec3(0.3, 0.5, 1.0))), 0.0, 1.0);
  base *= 0.85 + light * 0.25;

  // Viñeta de borde para fundir con el fondo perla.
  float edge = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.65, vUv.x) *
               smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
  float alpha = mix(0.0, 0.9, edge);

  gl_FragColor = vec4(base, alpha);

  #include <colorspace_fragment>
}
