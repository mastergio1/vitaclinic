/**
 * Estado global ligero (sin re-render de React) para comunicar
 * scroll y mouse al loop de Three.js. Se actualiza por eventos y
 * se lee dentro de useFrame.
 */
export const globalState = {
  /** Progreso de scroll normalizado 0..1 sobre todo el documento. */
  scroll: 0,
  /** Velocidad de scroll suavizada (para reaccionar al "flujo"). */
  scrollVelocity: 0,
  /** Posición del mouse normalizada -1..1 (para parallax). */
  mouseX: 0,
  mouseY: 0,
  /** Índice de sección activa (0..n). */
  section: 0,
};

let lastScroll = 0;

export function initGlobalListeners(): () => void {
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY || window.pageYOffset;
    const s = max > 0 ? y / max : 0;
    globalState.scrollVelocity = s - lastScroll;
    lastScroll = s;
    globalState.scroll = s;
  };

  const onPointer = (e: PointerEvent) => {
    globalState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    globalState.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  onScroll();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointer);
  };
}
