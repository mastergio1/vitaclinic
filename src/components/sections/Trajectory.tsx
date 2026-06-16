import { trajectory } from '../../data/content';
import { Reveal } from '../Reveal';

export function Trajectory() {
  return (
    <section className="section" id="trayectoria">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow" y={14}>
            {trajectory.eyebrow}
          </Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>
            {trajectory.title}
          </Reveal>
          <Reveal as="p" className="section__intro" delay={0.1}>
            {trajectory.intro}
          </Reveal>
        </div>

        <Reveal className="timeline" y={40}>
          {trajectory.milestones.map((m) => (
            <div className="timeline__item" key={m.year}>
              <div className="timeline__year">{m.year}</div>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </Reveal>

        <div className="team">
          {trajectory.team.map((person, i) => (
            <Reveal className="team__card" key={person.name} delay={i * 0.08} y={30}>
              <div className="team__photo">
                {/* Reemplaza la imagen en /public/team/. Mientras no exista,
                    se muestra un marcador elegante. */}
                <img
                  src={person.photo}
                  alt={person.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="sr-only">{person.name}</span>
              </div>
              <div className="team__body">
                <h3>{person.name}</h3>
                <p className="team__role">{person.role}</p>
                <p className="team__detail">{person.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
