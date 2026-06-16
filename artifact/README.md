# Vitaclinic — versión Artifact (para claude.ai / "Claude design")

`VitaclinicArtifact.jsx` es la web inmersiva 3D condensada en **un solo archivo**,
lista para el entorno de Artifacts de claude.ai.

## Diferencias con el proyecto completo

| Proyecto completo (repo)        | Versión Artifact (este archivo)             |
| ------------------------------- | ------------------------------------------- |
| Multi-archivo (React + Vite)    | **Un solo componente** `.jsx`               |
| Shaders en archivos `.glsl`     | **Shaders inline** (strings)                |
| GSAP + ScrollTrigger + Lenis    | Scroll suave nativo + IntersectionObserver  |
| @react-three/postprocessing     | Glow vía blending aditivo en el shader      |
| @react-three/drei               | Solo `three` + `@react-three/fiber`         |
| Imágenes en `/public`           | Marcadores con CSS (sin archivos externos)  |

Mantiene: campo celular 3D reactivo al scroll, cursor con halo dorado,
6 secciones, visor antes/después, contadores animados, CTA WhatsApp,
paleta y tipografía de marca, y soporte de `prefers-reduced-motion`.

## Cómo usarlo en claude.ai ("Claude design")

1. Abre **claude.ai** y empieza un chat nuevo.
2. Escribe algo como: _"Crea un Artifact de React con este componente"_ y
   **pega todo el contenido** de `VitaclinicArtifact.jsx`.
3. Claude abrirá el panel de Artifact y lo previsualizará. El componente
   exportado por defecto es `VitaclinicImmersive`.
4. Itera el diseño pidiéndole cambios en lenguaje natural.

> Las librerías `react`, `three` y `@react-three/fiber` están disponibles en
> los Artifacts de React de claude.ai, así que no requiere instalación.

## Editar contenido

Todo el texto, WhatsApp, dirección, equipo, tratamientos y testimonios están en
el objeto `CONTENT` al inicio del archivo. Los colores de marca, en `COLORS`.

## Notas

- Si el sandbox bloquea Google Fonts, los titulares caen a `Georgia` (serif) sin
  romper el diseño.
- Cifras y testimonios son de demostración: ajústalos con material oficial.
