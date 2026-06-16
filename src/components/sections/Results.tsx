import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { results } from '../../data/content';
import { Reveal } from '../Reveal';

// El visor 3D se carga de forma diferida (code-splitting) para no penalizar
// la carga inicial; además solo se monta cuando entra en viewport.
const BeforeAfter = lazy(() =>
  import('../../three/BeforeAfter').then((m) => ({ default: m.BeforeAfter })),
);

function InViewMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return <div ref={ref}>{show ? children : null}</div>;
}

export function Results() {
  const featured = results.cases[0];

  return (
    <section className="section" id="resultados">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow" y={14}>
            {results.eyebrow}
          </Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>
            {results.title}
          </Reveal>
          <Reveal as="p" className="section__intro" delay={0.1}>
            {results.intro}
          </Reveal>
        </div>

        <div className="results__layout">
          <Reveal y={30}>
            <InViewMount>
              <Suspense fallback={<div className="ba-viewer" aria-busy="true" />}>
                <BeforeAfter before={featured.before} after={featured.after} />
              </Suspense>
            </InViewMount>
            <p
              style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: 'var(--step--1)',
                color: 'var(--charcoal-40)',
                letterSpacing: '0.06em',
              }}
            >
              {featured.label}
            </p>
          </Reveal>

          <Reveal className="testimonials" delay={0.1} y={30}>
            {results.testimonials.map((t) => (
              <figure className="testimonial" key={t.author}>
                <p>“{t.quote}”</p>
                <cite>{t.author}</cite>
              </figure>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
