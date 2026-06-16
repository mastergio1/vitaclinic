# Vitaclinic · Web inmersiva 3D

Experiencia web de scroll narrativo con **3D real** para Vitaclinic — 36 años de
dermatología y medicina estética regenerativa, pioneros en Chile en
rejuvenecimiento con células madre y terapia celular.

La metáfora central: **células madre como partículas luminosas** que se
regeneran y reorganizan con el scroll, sobre una superficie tipo **piel/seda**
que "rejuvenece" progresivamente. Estética de **spa médico de lujo**: limpio,
luminoso, preciso y atemporal.

## Stack

- **React + Vite + TypeScript**
- **Three.js** + **React Three Fiber** + **@react-three/drei**
- **Shaders GLSL** (campo celular, piel/seda, visor antes/después)
- **@react-three/postprocessing** — Bloom + Depth of Field + Vignette
- **GSAP + ScrollTrigger** + **Lenis** (scroll suave y reveals)
- `vite-plugin-glsl` para importar `.glsl`

## Ejecutar

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # build de producción en /dist
npm run preview  # previsualizar el build
```

> Requiere Node 18+ (probado en Node 22).

## Estructura

```
vitaclinic/
├── index.html                 # metadatos SEO, tipografías
├── vite.config.ts             # React + glsl + manualChunks
├── public/
│   ├── favicon.svg
│   ├── team/                  # ← fotos del equipo médico
│   └── results/               # ← fotos antes/después
└── src/
    ├── main.tsx
    ├── App.tsx                # ensambla escena + secciones
    ├── data/content.ts        # ★ TODO el contenido editable
    ├── styles/
    │   ├── variables.css      # paleta y tipografía de marca
    │   └── global.css
    ├── lib/
    │   ├── SmoothScroll.tsx   # Lenis + ScrollTrigger
    │   ├── globalState.ts     # scroll/mouse → Three.js (sin re-render)
    │   ├── quality.ts         # perfil de calidad adaptativo (mobile-first)
    │   └── useReducedMotion.ts
    ├── three/
    │   ├── Scene.tsx          # canvas de fondo (lazy-init)
    │   ├── CellField.tsx      # partículas celulares (1 draw call)
    │   ├── SkinSurface.tsx    # superficie piel/seda
    │   ├── BeforeAfter.tsx    # visor antes/después en 3D
    │   ├── Effects.tsx        # Bloom + DoF + Vignette
    │   └── shaders/
    │       ├── lib/noise.glsl # simplex noise + fbm (compartido)
    │       ├── cells.vert/frag.glsl
    │       ├── skin.vert/frag.glsl
    │       └── beforeafter.vert/frag.glsl
    └── components/
        ├── Cursor.tsx         # cursor con halo dorado
        ├── Nav.tsx
        ├── Reveal.tsx         # aparición con GSAP ScrollTrigger
        ├── AnimatedNumber.tsx # contador (36 años)
        ├── WhatsAppButton.tsx # CTA flotante
        └── sections/
            ├── Hero.tsx
            ├── Trajectory.tsx
            ├── Treatments.tsx
            ├── Technology.tsx
            ├── Results.tsx
            └── Booking.tsx
```

## Dónde reemplazar contenido

Casi todo se edita en **un solo archivo**: [`src/data/content.ts`](src/data/content.ts).

| Quieres cambiar…            | Edita en `content.ts`                         |
| --------------------------- | --------------------------------------------- |
| Nombre, claim, años         | `brand`, `hero`                               |
| WhatsApp / teléfono / email | `brand.whatsapp`, `brand.phoneDisplay`, `brand.email` |
| Dirección y Google Maps     | `brand.address`                               |
| Línea de tiempo             | `trajectory.milestones`                       |
| Equipo médico (+ fotos)     | `trajectory.team` (fotos en `/public/team/`)  |
| Tratamientos                | `treatments.items`                            |
| Tecnología exclusiva        | `technology.features`                         |
| Casos antes/después         | `results.cases` (fotos en `/public/results/`) |
| Testimonios                 | `results.testimonials`                        |
| Formulario / agenda         | `booking`                                     |

### Fotos

- **Equipo** → `/public/team/` (4:5, ~800×1000px). Ver `public/team/README.md`.
- **Antes/después** → `/public/results/` (4:5). Ver `public/results/README.md`.
  Usa siempre **consentimiento informado** del paciente.

Mientras no existan las imágenes, se muestran marcadores elegantes
automáticamente (el sitio nunca se "rompe").

### Formulario de agenda

`Booking.tsx` abre WhatsApp con los datos prellenados (sin backend). Para
conectar un CRM/Formspree/endpoint propio, reemplaza el `handleSubmit`.

## Dirección de arte

| Color            | Hex       | Uso                          |
| ---------------- | --------- | ---------------------------- |
| Blanco perla     | `#F7F5F2` | Fondo                        |
| Verde salvia     | `#6E8B7A` | Acento clínico, núcleo celular |
| Dorado champagne | `#C8A86B` | Reflejos, halos, CTA         |
| Carbón profundo  | `#1C2024` | Texto, sección de agenda     |
| Nude rosado      | `#E8D7CC` | Dermis, calidez              |

Tipografía: **Cormorant Garamond** (serif, titulares) + **Inter** (cuerpo).

## Rendimiento y accesibilidad

- **Mobile-first**: `src/lib/quality.ts` reduce partículas, DPR y postproceso
  en celular y gama baja.
- **`prefers-reduced-motion`**: desactiva scroll suave, postproceso y muestra un
  **fallback 2D** elegante en lugar del canvas.
- Canvas con **lazy-init** (`requestIdleCallback`) para priorizar el LCP.
- Partículas con **un solo draw call** (atributos por instancia en GLSL).
- Visor antes/después con **code-splitting** y montaje solo en viewport.
- DPR adaptativo, `frameloop` bajo demanda con movimiento reducido.

## Notas

- Cifras internas (años, "100%", testimonios) son de demostración: ajústalas con
  el material oficial verificado de la clínica.
- Reseñas mayormente positivas con quejas puntuales; seguidores y ubicación
  (Torre Marriott, Av. Kennedy) confirmados; cifras internas no verificadas.
