/**
 * Detección de capacidad del dispositivo para escalar calidad.
 * Mobile-first: en celular reducimos partículas, DPR y postproceso.
 */

export interface QualityProfile {
  isMobile: boolean;
  /** Rango de DPR adaptativo para el canvas [min, max]. */
  dpr: [number, number];
  /** Número de instancias de partículas (células). */
  particleCount: number;
  /** Activar postprocesado (Bloom/DoF/Vignette). */
  postprocessing: boolean;
  /** Subdivisiones de la malla de piel/seda. */
  skinSegments: number;
}

export function detectQuality(): QualityProfile {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      dpr: [1, 1.5],
      particleCount: 1400,
      postprocessing: true,
      skinSegments: 180,
    };
  }

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 820;
  const isMobile = coarse || narrow;

  // Heurística extra: poca memoria o pocos núcleos → baja calidad.
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const lowEnd = mem <= 4 || cores <= 4;

  if (isMobile) {
    return {
      isMobile: true,
      dpr: [1, lowEnd ? 1.3 : 1.8],
      particleCount: lowEnd ? 520 : 820,
      postprocessing: !lowEnd, // en gama baja desactivamos postproceso
      skinSegments: lowEnd ? 90 : 120,
    };
  }

  return {
    isMobile: false,
    dpr: [1, lowEnd ? 1.5 : 2],
    particleCount: lowEnd ? 1200 : 1800,
    postprocessing: true,
    skinSegments: lowEnd ? 140 : 200,
  };
}
