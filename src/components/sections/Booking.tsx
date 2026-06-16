import { useState, type FormEvent } from 'react';
import { booking, brand } from '../../data/content';
import { Reveal } from '../Reveal';

export function Booking() {
  const [sent, setSent] = useState(false);
  const labels = booking.formLabels;

  const waHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(brand.whatsappMessage)}`;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Demo: sin backend. Reemplaza por tu endpoint / formspree / CRM.
    // Como conversión inmediata, ofrecemos abrir WhatsApp con los datos.
    const form = e.currentTarget;
    const data = new FormData(form);
    const msg = `Hola Vitaclinic, soy ${data.get('name') || ''}. Me interesa: ${
      data.get('interest') || ''
    }. ${data.get('message') || ''}`.trim();
    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
    form.reset();
  };

  return (
    <section className="section" id="agenda">
      <div className="booking section" style={{ paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}>
        <div className="booking__layout">
          <div>
            <Reveal as="p" className="eyebrow" y={14}>
              {booking.eyebrow}
            </Reveal>
            <Reveal as="h2" className="booking__title" delay={0.05}>
              {booking.title}
            </Reveal>
            <Reveal as="p" className="booking__intro" delay={0.1}>
              {booking.intro}
            </Reveal>

            <Reveal className="booking__info" delay={0.16}>
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <span className="ic" /> {booking.ctaPrimary}
              </a>
              <a href={`tel:${brand.phoneDisplay.replace(/\s/g, '')}`}>
                <span className="ic" /> {brand.phoneDisplay}
              </a>
              <a href={brand.address.mapsUrl} target="_blank" rel="noopener noreferrer">
                <span className="ic" /> {brand.address.line1}, {brand.address.line2} ·{' '}
                {brand.address.city}
              </a>
              <a href={`mailto:${brand.email}`}>
                <span className="ic" /> {brand.email}
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={30}>
            {sent ? (
              <div className="form__success" role="status">
                {labels.success}
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                  <div className="field">
                    <label htmlFor="bk-name">{labels.name}</label>
                    <input id="bk-name" name="name" type="text" required autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-phone">{labels.phone}</label>
                    <input id="bk-phone" name="phone" type="tel" autoComplete="tel" />
                  </div>
                </div>

                <div className="form__row">
                  <div className="field">
                    <label htmlFor="bk-email">{labels.email}</label>
                    <input id="bk-email" name="email" type="email" autoComplete="email" />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-interest">{labels.interest}</label>
                    <select id="bk-interest" name="interest" defaultValue="">
                      <option value="" disabled>
                        —
                      </option>
                      {booking.interests.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="bk-msg">{labels.message}</label>
                  <textarea id="bk-msg" name="message" rows={3} />
                </div>

                <button className="btn btn--primary" type="submit">
                  {labels.submit}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
