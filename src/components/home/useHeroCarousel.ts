import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';

/** Intervalo del autoplay (aprobado: 7 s). */
export const HERO_INTERVAL_MS = 7000;
/** Duración del crossfade entre fotografías. */
export const HERO_FADE_MS = 1200;

const SWIPE_MIN_PX = 48;
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

export interface HeroLayer {
  /** Identificador único de activación (permite reiniciar animaciones al volver a una diapositiva). */
  id: number;
  slide: number;
}

export type HeroTextPhase = 'idle' | 'out' | 'in';

const readReduced = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(REDUCED_QUERY).matches;

/**
 * Lógica del carrusel del Hero: autoplay, pausa, teclado, swipe y capas del crossfade.
 *
 * Reglas:
 * - Autoplay cada 7 s. Con "reducir movimiento" empieza detenido.
 * - Se detiene con el mouse encima, con foco de teclado dentro, con la pestaña oculta
 *   y cuando el Hero sale de pantalla.
 * - Cualquier navegación manual lo detiene hasta que el usuario pulse Play.
 */
export function useHeroCarousel(
  count: number,
  imageAt: (index: number) => string,
  /** Se llama justo antes de cambiar el texto (permite medir el layout previo y suavizar el reacomodo). */
  onBeforeTextSwap?: () => void,
) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const indexRef = useRef(0);
  const layerSeq = useRef(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const beforeSwapRef = useRef(onBeforeTextSwap);
  beforeSwapRef.current = onBeforeTextSwap;

  const [index, setIndex] = useState(0);
  const [layers, setLayers] = useState<HeroLayer[]>([{ id: 0, slide: 0 }]);
  const [userStopped, setUserStopped] = useState<boolean>(readReduced);
  const [frozen, setFrozen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const [textPhase, setTextPhase] = useState<HeroTextPhase>('idle');

  const goTo = useCallback(
    (target: number, manual: boolean) => {
      const next = ((target % count) + count) % count;
      if (manual) {
        setUserStopped(true);
        setFrozen(false);
      }
      if (next === indexRef.current) return;
      indexRef.current = next;
      const id = ++layerSeq.current;
      setIndex(next);
      // Hasta 3 capas: la nueva se funde encima de lo que haya en pantalla.
      setLayers((prev) => [...prev.slice(-2), { id, slide: next }]);
    },
    [count],
  );

  const next = useCallback(() => goTo(indexRef.current + 1, true), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1, true), [goTo]);
  const goToManual = useCallback((i: number) => goTo(i, true), [goTo]);

  const pause = useCallback(() => {
    setUserStopped(true);
    setFrozen(true);
  }, []);
  const play = useCallback(() => {
    setUserStopped(false);
    setFrozen(false);
  }, []);
  const togglePlayback = useCallback(() => {
    if (userStopped) play();
    else pause();
  }, [userStopped, play, pause]);

  // Autoplay: se reinicia (7 s) con cada cambio de diapositiva o de estado.
  const running = !userStopped && !hovering && !keyboardFocus && inView && tabVisible;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => goTo(indexRef.current + 1, false), HERO_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [running, index, goTo]);

  // Si el usuario activa "reducir movimiento" con la página abierta, el autoplay se detiene.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(REDUCED_QUERY);
    const onChange = () => {
      if (mq.matches) setUserStopped(true);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pestaña oculta.
  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Hero fuera de pantalla.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Retira las capas inferiores cuando la superior ya terminó de fundirse.
  useEffect(() => {
    if (layers.length < 2) return;
    const id = window.setTimeout(() => setLayers((l) => l.slice(-1)), HERO_FADE_MS + 60);
    return () => window.clearTimeout(id);
  }, [layers]);

  // Cambio de texto independiente de la imagen: sale, se intercambia y entra.
  useEffect(() => {
    if (index === textIndex) {
      setTextPhase('idle');
      return;
    }
    setTextPhase('out');
    const swap = window.setTimeout(
      () => {
        beforeSwapRef.current?.();
        setTextIndex(index);
        setTextPhase('in');
      },
      readReduced() ? 100 : 300,
    );
    return () => window.clearTimeout(swap);
    // Solo debe reaccionar a un cambio de diapositiva.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (textPhase !== 'in') return;
    const id = window.setTimeout(() => setTextPhase('idle'), readReduced() ? 160 : 520);
    return () => window.clearTimeout(id);
  }, [textPhase, textIndex]);

  // Red de seguridad: el texto nunca debe quedarse oculto.
  useEffect(() => {
    if (textPhase !== 'out') return;
    const id = window.setTimeout(() => {
      setTextIndex(indexRef.current);
      setTextPhase('idle');
    }, 1500);
    return () => window.clearTimeout(id);
  }, [textPhase]);

  // Precarga de las fotografías vecinas, después del primer pintado (no compite con el LCP).
  useEffect(() => {
    const id = window.setTimeout(() => {
      [index + 1, index - 1].forEach((n) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = imageAt(((n % count) + count) % count);
      });
    }, 800);
    return () => window.clearTimeout(id);
  }, [index, count, imageAt]);

  // --- Manejadores del contenedor ---------------------------------------------------

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setHovering(true);
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setHovering(false);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    if ((e.target as HTMLElement).closest('a,button')) {
      swipeStart.current = null;
      return;
    }
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goTo(indexRef.current + (dx < 0 ? 1 : -1), true);
    }
  };
  const onPointerCancel = () => {
    swipeStart.current = null;
  };

  // Flechas ← → solo cuando el foco está en los controles del carrusel (no en los enlaces).
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (!(e.target as HTMLElement).closest('[data-hero-control]')) return;
    e.preventDefault();
    goTo(indexRef.current + (e.key === 'ArrowRight' ? 1 : -1), true);
  };

  const onFocus = (e: React.FocusEvent) => {
    try {
      if ((e.target as HTMLElement).matches(':focus-visible')) setKeyboardFocus(true);
    } catch {
      /* navegadores sin :focus-visible */
    }
  };
  const onBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKeyboardFocus(false);
  };

  return {
    sectionRef,
    index,
    layers,
    textIndex,
    textPhase,
    playing: !userStopped,
    frozen,
    next,
    prev,
    goTo: goToManual,
    togglePlayback,
    sectionHandlers: {
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onKeyDown,
      onFocus,
      onBlur,
    },
  };
}
