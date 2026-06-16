import { hero, brand } from '../../data/content';
import { AnimatedNumber } from '../AnimatedNumber';
import { Reveal } from '../Reveal';
import './sections.css';

export function Hero() {
  const waHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(brand.whatsappMessage)}`;

  return (
    <section className="hero section" id="top">
      <div className="container hero__content">
        <Reveal as="p" className="eyebrow" y={16}>
          {hero.eyebrow}
        </Reveal>

        <Reveal as="h1" className="hero__title" delay={0.05}>
          {hero.title}
        </Reveal>

        <Reveal as="p" className="hero__subtitle" delay={0.12}>
          {hero.subtitle}
        </Reveal>

        <Reveal className="hero__actions" delay={0.2}>
          <a className="btn btn--primary" href={waHref} target="_blank" rel="noopener noreferrer">
            {hero.ctaPrimary}
          </a>
          <a className="btn btn--ghost" href="#trayectoria">
            {hero.ctaSecondary}
          </a>
        </Reveal>

        <Reveal className="hero__stats" delay={0.28}>
          <div className="hero__stat">
            <div className="num">
              <AnimatedNumber to={brand.yearsExperience} />
            </div>
            <div className="lab">Años de trayectoria</div>
          </div>
          <div className="hero__stat">
            <div className="num">
              1<sup style={{ fontSize: '0.5em', color: 'var(--champagne)' }}>os</sup>
            </div>
            <div className="lab">En terapia celular en Chile</div>
          </div>
          <div className="hero__stat">
            <div className="num">
              <AnimatedNumber to={100} suffix="%" />
            </div>
            <div className="lab">Enfoque en naturalidad</div>
          </div>
        </Reveal>
      </div>

      <a className="hero__scroll" href="#trayectoria" aria-label={hero.scrollHint}>
        <span className="hero__scroll-line" />
        {hero.scrollHint}
      </a>
    </section>
  );
}
