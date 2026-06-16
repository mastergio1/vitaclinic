// Visor antes/después — fragmento.
// Transiciona entre dos texturas con una línea divisoria y un borde dorado luminoso.
precision highp float;

uniform sampler2D uBefore;
uniform sampler2D uAfter;
uniform float uSplit;     // posición del divisor 0..1
uniform float uTime;
uniform vec3 uLine;       // color de la línea (champagne)
uniform float uReveal;    // 0..1 aparición al entrar en viewport

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec4 before = texture2D(uBefore, uv);
  vec4 after = texture2D(uAfter, uv);

  // Mezcla nítida con un pequeño antialias en el borde del divisor.
  float edge = smoothstep(uSplit - 0.0015, uSplit + 0.0015, uv.x);
  vec4 color = mix(before, after, edge);

  // Línea divisoria luminosa con leve pulso.
  float lineWidth = 0.0022 + 0.0015 * (sin(uTime * 2.0) * 0.5 + 0.5);
  float line = smoothstep(lineWidth, 0.0, abs(uv.x - uSplit));
  color.rgb = mix(color.rgb, uLine, line);

  // Tinte cálido sutil del lado "después" (renovado).
  color.rgb = mix(color.rgb, color.rgb * vec3(1.04, 1.0, 0.97), edge * 0.4);

  // Aparición tipo cortina al entrar en viewport.
  float reveal = smoothstep(uReveal, uReveal - 0.25, 1.0 - uv.y);
  color.a *= clamp(uReveal * 1.2, 0.0, 1.0);

  gl_FragColor = color;

  #include <colorspace_fragment>
}
