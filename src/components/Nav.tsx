import { useEffect, useState } from 'react';
import { brand, nav } from '../data/content';
import './Nav.css';

/** Barra de navegación translúcida que se condensa al hacer scroll. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__brand serif" aria-label={`${brand.name} inicio`}>
          {brand.name}
          <span className="nav__brand-mark" aria-hidden="true" />
        </a>

        <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Principal">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#agenda" className="nav__cta" onClick={() => setOpen(false)}>
            Agendar
          </a>
        </nav>

        <button
          className={`nav__burger ${open ? 'is-open' : ''}`}
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
