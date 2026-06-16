import { treatments } from '../../data/content';
import { Reveal } from '../Reveal';

export function Treatments() {
  return (
    <section className="section" id="tratamientos">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow" y={14}>
            {treatments.eyebrow}
          </Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>
            {treatments.title}
          </Reveal>
          <Reveal as="p" className="section__intro" delay={0.1}>
            {treatments.intro}
          </Reveal>
        </div>

        <div className="treatments__grid">
          {treatments.items.map((t, i) => (
            <Reveal className="treatment-card" key={t.id} delay={i * 0.08} y={34}>
              {/* Capas de piel que se separan al hover */}
              <div className="treatment-card__layers" aria-hidden="true">
                <span className="treatment-card__layer" />
                <span className="treatment-card__layer" />
                <span className="treatment-card__layer" />
              </div>

              <p className="treatment-card__obj">{t.objective}</p>
              <h3>{t.name}</h3>
              <p>{t.text}</p>
              <div className="treatment-card__tags">
                {t.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
