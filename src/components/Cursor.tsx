import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';
import './Cursor.css';

/**
 * Cursor personalizado con halo dorado. Crece sobre elementos interactivos.
 * Solo se activa en dispositivos con puntero fino (desktop).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    document.body.classList.add('has-custom-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * (reduced ? 1 : 0.18);
      ringPos.y += (pos.y - ringPos.y) * (reduced ? 1 : 0.18);
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest('a, button, [role="slider"], input, textarea, select, label');
      ring.current?.classList.toggle('is-active', !!interactive);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
