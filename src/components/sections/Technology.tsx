import { technology } from '../../data/content';
import { Reveal } from '../Reveal';

export function Technology() {
  return (
    <section className="section tech" id="tecnologia">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow" y={14}>
            {technology.eyebrow}
          </Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>
            {technology.title}
          </Reveal>
          <Reveal as="p" className="section__intro" delay={0.1}>
            {technology.intro}
          </Reveal>
        </div>

        <div className="tech__grid">
          {technology.features.map((f, i) => (
            <Reveal className="tech__feature" key={f.title} delay={i * 0.08} y={30}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
