import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';

interface Props {
  to: number;
  duration?: number;
  suffix?: string;
}

/** Cuenta desde 0 hasta `to` cuando entra en viewport. */
export function AnimatedNumber({ to, duration = 1.8, suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setValue(Math.round(eased * to));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          animate();
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, reduced]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
