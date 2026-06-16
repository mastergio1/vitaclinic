import { useEffect, useRef, type ReactNode, type ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Retardo en cascada (segundos). */
  delay?: number;
  /** Desplazamiento vertical inicial (px). */
  y?: number;
  id?: string;
}

/**
 * Anima la aparición del contenido al entrar en viewport.
 * Respeta prefers-reduced-motion (aparece sin transición).
 */
export function Reveal({ children, as, className, delay = 0, y = 28, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const Tag = (as ?? 'div') as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    });

    return () => ctx.revert();
  }, [delay, y, reduced]);

  return (
    <Tag ref={ref} className={className} id={id} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
