import { useEffect } from 'react';
import { Scene } from './three/Scene';
import { Cursor } from './components/Cursor';
import { Nav } from './components/Nav';
import { WhatsAppButton } from './components/WhatsAppButton';
import { SmoothScroll } from './lib/SmoothScroll';
import { initGlobalListeners } from './lib/globalState';
import { useReducedMotion } from './lib/useReducedMotion';
import { Hero } from './components/sections/Hero';
import { Trajectory } from './components/sections/Trajectory';
import { Treatments } from './components/sections/Treatments';
import { Technology } from './components/sections/Technology';
import { Results } from './components/sections/Results';
import { Booking } from './components/sections/Booking';
import { brand } from './data/content';

export default function App() {
  const reduced = useReducedMotion();

  useEffect(() => initGlobalListeners(), []);

  return (
    <SmoothScroll>
      {/* Fondo 3D inmersivo. Si el usuario pide movimiento reducido,
          mostramos un fondo 2D elegante en su lugar. */}
      {reduced ? <div className="fallback-2d" aria-hidden="true" /> : <Scene />}

      <Cursor />
      <Nav />

      <main>
        <Hero />
        <Trajectory />
        <Treatments />
        <Technology />
        <Results />
        <Booking />
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()} {brand.name} · {brand.address.line1},{' '}
            {brand.address.line2}, {brand.address.city} ·{' '}
            <a href={brand.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </p>
          <p style={{ marginTop: '0.6rem', maxWidth: '60ch', marginInline: 'auto' }}>
            Rejuvenecimiento natural con respaldo médico. Resultados individuales; la información
            no reemplaza una evaluación clínica.
          </p>
        </div>
      </footer>

      <WhatsAppButton />
    </SmoothScroll>
  );
}
