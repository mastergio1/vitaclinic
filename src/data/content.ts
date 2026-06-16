/**
 * ───────────────────────────────────────────────────────────────────────────
 *  CONTENIDO EDITABLE — Vitaclinic
 * ───────────────────────────────────────────────────────────────────────────
 *  Este archivo centraliza TODOS los textos, links, fotos y datos.
 *  Para actualizar el sitio normalmente NO necesitas tocar componentes:
 *  reemplaza los valores aquí.
 *
 *  · Fotos antes/después → coloca tus imágenes en /public/results/ y
 *    referencia la ruta (ej: "/results/caso-01-antes.jpg").
 *  · Fotos del equipo → /public/team/.
 *  · WhatsApp → usa formato internacional sin "+", sin espacios.
 *  Nota: cifras internas no verificadas; ajusta según material oficial.
 * ───────────────────────────────────────────────────────────────────────────
 */

export const brand = {
  name: 'Vitaclinic',
  tagline: '36 años cuidando tu piel y tu tiempo',
  yearsFounded: 1990,
  yearsExperience: 36,
  // WhatsApp en formato internacional (Chile: 56 + número). Reemplaza por el real.
  whatsapp: '56912345678',
  whatsappMessage: 'Hola Vitaclinic, quisiera agendar una evaluación dermatológica.',
  phoneDisplay: '+56 9 1234 5678',
  email: 'contacto@vitaclinic.cl',
  instagram: 'https://instagram.com/vitaclinic',
  address: {
    line1: 'Torre Marriott',
    line2: 'Av. Presidente Kennedy 5741',
    city: 'Las Condes, Santiago',
    mapsUrl: 'https://maps.google.com/?q=Torre+Marriott+Av+Kennedy+Las+Condes',
  },
};

export const hero = {
  eyebrow: 'Dermatología · Medicina estética regenerativa',
  // El título admite saltos manuales con "\n".
  title: '36 años cuidando\ntu piel y tu tiempo',
  subtitle:
    'Pioneros en Chile en rejuvenecimiento con células madre y terapia celular. Convertimos ciencia de vanguardia en resultados naturales, sin transformarte.',
  ctaPrimary: 'Agendar evaluación',
  ctaSecondary: 'Conocer la clínica',
  scrollHint: 'Desliza para descubrir',
};

export const trajectory = {
  eyebrow: 'Trayectoria',
  title: 'Una autoridad que nace de la longevidad médica',
  intro:
    'Más de tres décadas perfeccionando la regeneración de la piel. Nuestra confianza no se construyó con marketing, sino con ciencia, especialistas y resultados verificables.',
  milestones: [
    {
      year: '1990',
      title: 'Fundación',
      text: 'Nace Vitaclinic con una visión dermatológica de precisión en el corazón de Las Condes.',
    },
    {
      year: '2004',
      title: 'Era láser',
      text: 'Incorporamos plataformas láser de alta gama para rejuvenecimiento y tratamiento cutáneo.',
    },
    {
      year: '2012',
      title: 'Terapia celular',
      text: 'Pioneros en Chile en aplicar células madre y terapia celular al rejuvenecimiento natural.',
    },
    {
      year: '2024',
      title: 'Medicina regenerativa',
      text: 'Integramos protocolos de longevidad celular personalizados, con respaldo científico.',
    },
  ],
  team: [
    {
      name: 'Dra. [Nombre Apellido]',
      role: 'Directora médica · Dermatología',
      detail: 'Especialista en medicina regenerativa y rejuvenecimiento celular.',
      photo: '/team/medico-01.jpg', // reemplaza
    },
    {
      name: 'Dr. [Nombre Apellido]',
      role: 'Medicina estética',
      detail: 'Experto en armonización facial y resultados naturales.',
      photo: '/team/medico-02.jpg',
    },
    {
      name: 'Dra. [Nombre Apellido]',
      role: 'Terapia celular',
      detail: 'Investigación clínica en células madre y longevidad de la piel.',
      photo: '/team/medico-03.jpg',
    },
  ],
};

export const treatments = {
  eyebrow: 'Tratamientos por objetivo',
  title: 'Lo que quieres lograr, con respaldo médico',
  intro:
    'Cada protocolo parte de un diagnóstico real de tu piel. El objetivo nunca es transformarte: es regenerar lo que ya eres.',
  items: [
    {
      id: 'rejuvenecimiento',
      name: 'Rejuvenecimiento natural',
      objective: 'Recuperar firmeza y luminosidad',
      text: 'Protocolos que estimulan la propia regeneración de tu piel para un resultado fresco y sin rastros de "operado".',
      tags: ['Firmeza', 'Luminosidad', 'Colágeno'],
    },
    {
      id: 'celular',
      name: 'Terapia celular',
      objective: 'Regenerar desde la dermis',
      text: 'Células madre y factores de crecimiento aplicados con criterio médico para una renovación profunda y duradera.',
      tags: ['Células madre', 'Regeneración', 'Longevidad'],
    },
    {
      id: 'laser',
      name: 'Láser de precisión',
      objective: 'Textura, manchas y poros',
      text: 'Plataformas láser de alta gama que tratan la superficie con precisión clínica y mínima recuperación.',
      tags: ['Textura', 'Manchas', 'Precisión'],
    },
  ],
};

export const technology = {
  eyebrow: 'Tecnología exclusiva',
  title: 'Ciencia celular que solo encuentras aquí',
  intro:
    'Fuimos los primeros en Chile en llevar la terapia celular al rejuvenecimiento. Esa ventaja se traduce en protocolos que pocos pueden ofrecer.',
  features: [
    {
      title: 'Rejuvenecimiento con células madre',
      text: 'Terapia regenerativa que potencia la renovación natural de la piel desde su capa más profunda.',
    },
    {
      title: 'Medicina de longevidad cutánea',
      text: 'Estrategias personalizadas para envejecer bien: preservar tu identidad y tu vitalidad.',
    },
    {
      title: 'Diagnóstico de precisión',
      text: 'Evaluación médica detallada antes de cualquier procedimiento. Nada estándar, todo a tu medida.',
    },
  ],
};

export const results = {
  eyebrow: 'Resultados',
  title: 'Naturalidad que se nota, cambios que no gritan',
  intro:
    'Desliza para comparar. Resultados reales orientados a preservar tu identidad. Reemplaza estas imágenes por tus casos reales con consentimiento.',
  // Reemplaza por tus fotos reales (con consentimiento informado del paciente).
  cases: [
    {
      id: 'caso-01',
      label: 'Rejuvenecimiento facial · 8 semanas',
      before: '/results/caso-01-antes.jpg',
      after: '/results/caso-01-despues.jpg',
    },
    {
      id: 'caso-02',
      label: 'Terapia celular · 12 semanas',
      before: '/results/caso-02-antes.jpg',
      after: '/results/caso-02-despues.jpg',
    },
  ],
  testimonials: [
    {
      quote:
        'Me veo descansada, como yo misma pero mejor. Nadie nota que me hice algo, solo que me veo bien.',
      author: 'Paciente, 52 años',
    },
    {
      quote: 'La confianza de un equipo médico con décadas de experiencia. Eso no se improvisa.',
      author: 'Paciente, 47 años',
    },
  ],
};

export const booking = {
  eyebrow: 'Agenda',
  title: 'Tu evaluación comienza con una conversación',
  intro:
    'Cuéntanos qué te gustaría mejorar. Te proponemos un plan con respaldo médico, pensado para que sigas siendo tú.',
  ctaPrimary: 'Agendar por WhatsApp',
  formLabels: {
    name: 'Nombre',
    phone: 'Teléfono',
    email: 'Email',
    interest: 'Me interesa',
    message: 'Cuéntanos (opcional)',
    submit: 'Solicitar evaluación',
    success: 'Gracias. Te contactaremos a la brevedad para coordinar tu evaluación.',
  },
  interests: [
    'Rejuvenecimiento natural',
    'Terapia celular',
    'Láser de precisión',
    'Aún no lo sé',
  ],
};

export const nav = {
  links: [
    { label: 'Trayectoria', href: '#trayectoria' },
    { label: 'Tratamientos', href: '#tratamientos' },
    { label: 'Tecnología', href: '#tecnologia' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Agenda', href: '#agenda' },
  ],
};
