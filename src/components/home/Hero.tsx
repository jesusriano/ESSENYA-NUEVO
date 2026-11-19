import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Pause, Play, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHeroCarousel } from './useHeroCarousel';

import slide1 from '../../assets/images/hero_spa_slide_bright1_1785445052332.webp';
import slide2 from '../../assets/images/hero_spa_slide_bright2_1785445064253.webp';
import slide3 from '../../assets/images/portable_massage_table_1_1785444270806.webp';
import slide4 from '../../assets/images/couple_massage_spa_1785442759347.webp';
import slide5 from '../../assets/images/neutral_scented_oils_1_1785444292576.webp';

interface HeroProps {
  onOpenBookingModal: () => void;
}

interface SlideItem {
  id: number;
  image: string;
  tagline: string;
  headlineHighlight: string;
  caption: string;
}

const CAROUSEL_SLIDES: SlideItem[] = [
  {
    id: 1,
    image: slide1,
    tagline: 'BIENESTAR EXCLUSIVO · A DOMICILIO',
    headlineHighlight: 'Lujo y Confort en Tu Hogar',
    caption: 'Creamos una atmósfera de spa de alto nivel en tu hogar con todo el equipo profesional incluido.',
  },
  {
    id: 2,
    image: slide2,
    tagline: 'TERAPEUTAS CERTIFICADAS CDMX',
    headlineHighlight: 'Técnicas Especializadas',
    caption: 'Atención personalizada con masajes descontracturantes, relajantes, deportivos y drenaje linfático.',
  },
  {
    id: 3,
    image: slide3,
    tagline: 'EQUIPO COMPLETO E HIGIÉNICO',
    headlineHighlight: 'Camilla y Blancos Esterilizados',
    caption: 'Llevamos camilla portátil, sábanas de algodón y toallas impecables listas para tu sesión.',
  },
  {
    id: 4,
    image: slide4,
    tagline: 'EXPERIENCIAS EN PAREJA & EVENTOS',
    headlineHighlight: 'Momentos Únicos de Relajación',
    caption: 'Ideal para compartir en pareja, aniversarios o consentirse en casa con doble terapeuta simultánea.',
  },
  {
    id: 5,
    image: slide5,
    tagline: 'AROMATERAPIA & ACEITES BOTÁNICOS',
    headlineHighlight: 'Esencias Neutras y Aromáticas',
    caption: 'Utilizamos aceites hipoalergénicos e infusiones botánicas naturales de rápida absorción.',
  },
];

const imageAt = (i: number): string => CAROUSEL_SLIDES[i].image;

/** Variables CSS de la secuencia de entrada (retardo, duración y desplazamiento). */
const motionVars = (delay: number, dur?: number, dy?: number): React.CSSProperties =>
  ({
    '--hero-delay': `${delay}ms`,
    ...(dur !== undefined ? { '--hero-dur': `${dur}ms` } : {}),
    ...(dy !== undefined ? { '--hero-dy': `${dy}px` } : {}),
  }) as React.CSSProperties;

/** Anillo de foco visible solo con teclado (no cambia el aspecto con mouse o toque). */
const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]';

/** Línea del título con máscara: no altera el flujo ni el espaciado (el recorte no ocupa espacio). */
const LINE_MASK = 'block [clip-path:inset(-0.2em_-1em)]';

const ARROW_BASE =
  'group absolute top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#C5A059] text-white hover:text-black rounded-full border border-white/20 backdrop-blur-md transition-[background-color,border-color,color,scale] hover:scale-110 shadow-2xl';

/**
 * Flechas del carrusel. Dos ubicaciones con el mismo estilo:
 * - "edge": a los costados de la sección, a media altura (tablet y escritorio, igual que siempre).
 * - "compact": solo en móvil (< 640 px). A esa altura el panel de texto ocupa todo el ancho y las
 *   flechas lo tapaban, así que flanquean el titular, donde la foto está libre.
 * Solo una de las dos es visible a la vez (la otra queda en display:none, fuera del orden de Tab).
 */
const ArrowButton: React.FC<{ dir: 'prev' | 'next'; variant: 'edge' | 'compact'; onClick: () => void }> = ({
  dir,
  variant,
  onClick,
}) => {
  const isPrev = dir === 'prev';
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  const position =
    variant === 'edge'
      ? `hidden sm:block p-3.5 ${isPrev ? 'left-6' : 'right-6'}`
      : `sm:hidden p-2.5 max-[319px]:p-1.5 ${isPrev ? '-left-1' : '-right-1'}`;
  return (
    <button
      type="button"
      data-hero-control
      onClick={onClick}
      aria-label={isPrev ? 'Anterior imagen' : 'Siguiente imagen'}
      className={`${ARROW_BASE} ${position} ${FOCUS_RING}`}
    >
      <Icon
        className={`${variant === 'edge' ? 'w-6 h-6' : 'w-5 h-5'} transition-transform ${
          isPrev ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'
        }`}
      />
    </button>
  );
};

export const Hero: React.FC<HeroProps> = ({ onOpenBookingModal }) => {
  const {
    sectionRef,
    index,
    layers,
    textIndex,
    textPhase,
    playing,
    frozen,
    next,
    prev,
    goTo,
    togglePlayback,
    sectionHandlers,
  } = useHeroCarousel(CAROUSEL_SLIDES.length, imageAt, () => measureBefore());

  // Las descripciones tienen distinta longitud y el bloque está centrado: al cambiar de texto todo se
  // reacomodaría de golpe. Se mide la posición previa y el bloque se desliza (solo transform) hasta la
  // nueva, sin cambiar la composición en reposo.
  const contentRef = useRef<HTMLDivElement>(null);
  const beforeTops = useRef<number[] | null>(null);
  const measureBefore = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    beforeTops.current = Array.from(el.children).map((c) => (c as HTMLElement).getBoundingClientRect().top);
  }, []);
  useLayoutEffect(() => {
    const before = beforeTops.current;
    beforeTops.current = null;
    const el = contentRef.current;
    if (!before || !el || typeof el.animate !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    Array.from(el.children).forEach((child, i) => {
      const node = child as HTMLElement;
      const dy = before[i] - node.getBoundingClientRect().top;
      if (Math.abs(dy) < 0.5) return;
      node.animate(
        [{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }],
        // Curva ease-in-out sinusoidal: su velocidad pico es ~45 % menor que la de una curva "ease" estándar,
        // así el reacomodo se percibe como un deslizamiento continuo y no como un arranque brusco.
        { duration: 520, easing: 'cubic-bezier(0.37, 0, 0.63, 1)' },
      );
    });
  }, [textIndex]);

  const textSlide = CAROUSEL_SLIDES[textIndex];
  const textClass = textPhase === 'out' ? 'hero-text-out' : textPhase === 'in' ? 'hero-text-in' : '';

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carrusel"
      aria-label="Portada de ESSENYA"
      data-frozen={frozen ? 'true' : undefined}
      className="hero-root relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#120E0D] text-white touch-pan-y touch-pinch-zoom"
      {...sectionHandlers}
    >
      {/* Background Carousel Images with Lightened Overlays for +50% Clarity */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {layers.map((layer) => {
          const slide = CAROUSEL_SLIDES[layer.slide];
          const isFirst = layer.id === 0;
          return (
            <div key={layer.id} className={`absolute inset-0${isFirst ? '' : ' hero-layer-in'}`}>
              <img
                src={slide.image}
                alt=""
                loading="eager"
                fetchPriority={isFirst ? 'high' : 'auto'}
                decoding="async"
                className="w-full h-full object-cover object-center scale-105 hero-settle"
              />
              {/* Overlays adjusted to be 20% lighter per user request */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#120E0D] via-[#120E0D]/20 to-transparent"></div>
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          );
        })}
        {/* Velo de entrada: la foto ya está pintada debajo; solo se disipa. Sin interacción. */}
        <div className="hero-veil absolute inset-0 bg-[#120E0D] opacity-0 pointer-events-none" />
      </div>

      {/* Manual Navigation Controls (Prev / Next Buttons) */}
      <ArrowButton dir="prev" variant="edge" onClick={prev} />
      <ArrowButton dir="next" variant="edge" onClick={next} />

      {/* Hero Content Container */}
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center justify-center">

        {/* Eyebrow tag */}
        <div
          className="hero-rise inline-flex items-center justify-center mb-3 bg-[#120E0D]/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#C5A059]/40 shadow-lg"
          style={motionVars(60, 350, 8)}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] mr-2" />
          <span
            className={`text-[#C5A059] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold ${textClass}`}
          >
            {textSlide.tagline}
          </span>
        </div>

        {/* Main Display Headline (en móvil, las flechas lo flanquean sobre la foto) */}
        <div className="relative w-full">
        <ArrowButton dir="prev" variant="compact" onClick={prev} />
        <ArrowButton dir="next" variant="compact" onClick={next} />
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.08] tracking-tight my-3 drop-shadow-md">
          <span className={LINE_MASK}>
            <span className="hero-line-up block" style={motionVars(120)}>Masajes</span>
          </span>{' '}
          <span className={LINE_MASK}>
            <span className="hero-line-up block" style={motionVars(220)}>
              <span className="text-[#C5A059] font-normal italic drop-shadow">Profesionales</span>
            </span>
          </span>{' '}
          <span className={LINE_MASK}>
            <span className="hero-line-up block" style={motionVars(320)}>a Domicilio</span>
          </span>
        </h1>
        </div>

        {/* Dynamic Slide Headline & Subtitle */}
        <div
          role="group"
          aria-roledescription="diapositiva"
          aria-label={`${textIndex + 1} de ${CAROUSEL_SLIDES.length}`}
          aria-live={playing ? 'off' : 'polite'}
          className="hero-rise bg-[#120E0D]/75 backdrop-blur-md p-4 sm:p-6 border border-[#C5A059]/30 rounded-lg max-w-2xl my-4 shadow-2xl transition-all duration-300"
          style={motionVars(400, 450, 12)}
        >
          <h2
            className={`text-base sm:text-lg font-serif italic text-[#C5A059] mb-1 font-medium ${textClass}`}
          >
            "{textSlide.headlineHighlight}"
          </h2>
          <p
            className={`text-xs sm:text-sm text-gray-200 leading-relaxed font-normal ${textClass}`}
            style={motionVars(60)}
          >
            {textSlide.caption}
          </p>
        </div>

        {/* CTA Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full sm:w-auto">
          {/* Portal Cliente Button */}
          <a
            href="https://www.essenya.app/cliente"
            target="_blank"
            rel="noopener noreferrer"
            style={motionVars(520, 400, 12)}
            className={`hero-rise w-full sm:w-auto px-6 py-2.5 bg-[#120E0D]/80 hover:bg-[#C5A059]/20 text-white hover:text-[#C5A059] font-semibold text-[11px] sm:text-xs tracking-widest uppercase transition-[background-color,border-color,color,translate,scale] hover:-translate-y-px active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 rounded-full border border-[#C5A059]/60 hover:border-[#C5A059] backdrop-blur-md ${FOCUS_RING}`}
          >
            <User className="w-4 h-4 text-[#C5A059]" />
            <span>Portal Cliente</span>
          </a>

          {/* Reservar Ahora Button */}
          <a
            href="https://www.essenya.app/cliente"
            target="_blank"
            rel="noopener noreferrer"
            style={motionVars(600, 400, 12)}
            className={`group hero-rise hero-cta w-full sm:w-auto px-6 py-2.5 bg-[#C5A059] hover:bg-[#D8B46E] text-[#120E0D] font-bold text-[11px] sm:text-xs tracking-widest uppercase transition-[background-color,border-color,color,translate,scale] hover:-translate-y-px active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 rounded-full ${FOCUS_RING}`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#120E0D] transition-transform group-hover:translate-x-0.5" />
            <span>Reservar Ahora</span>
          </a>

          {/* Secondary Outlined Link */}
          <Link
            to="/servicios"
            style={motionVars(680, 400, 12)}
            className={`hero-rise w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-white/5 text-white border border-white/40 hover:border-white font-semibold text-[11px] sm:text-xs uppercase tracking-widest transition-[background-color,border-color,color,translate,scale] hover:-translate-y-px active:scale-[0.98] flex items-center justify-center rounded-full backdrop-blur-sm ${FOCUS_RING}`}
          >
            Ver Servicios
          </Link>
        </div>

        {/* Bottom Carousel Dot Indicators (+ pausa discreta, fuera del flujo) */}
        <div
          className="hero-fade relative flex items-center justify-center gap-2.5 mt-8 z-20"
          style={motionVars(800, 300)}
        >
          <button
            type="button"
            data-hero-control
            onClick={togglePlayback}
            aria-label={playing ? 'Pausar carrusel' : 'Reanudar carrusel'}
            className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 w-7 h-7 grid place-items-center rounded-full bg-black/40 hover:bg-[#C5A059] text-white/90 hover:text-black border border-white/20 transition-[background-color,border-color,color] before:absolute before:-inset-2 ${FOCUS_RING}`}
          >
            {playing ? <Pause className="w-3 h-3" aria-hidden="true" /> : <Play className="w-3 h-3" aria-hidden="true" />}
          </button>
          {CAROUSEL_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              data-hero-control
              onClick={() => goTo(idx)}
              aria-label={`Ir a diapositiva ${idx + 1}`}
              aria-current={idx === index ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-[width,background-color,box-shadow] duration-300 ${FOCUS_RING} ${
                idx === index
                  ? 'w-8 bg-[#C5A059] shadow-lg'
                  : 'w-2.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Bottom Badges / Stats */}
        <div
          className="hero-rise mt-8 pt-6 border-t border-white/10 w-full max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] sm:text-[11px] text-[#C5A059] font-mono tracking-[0.18em] font-medium uppercase bg-black/30 backdrop-blur-sm py-2 px-4 rounded-full border border-white/5"
          style={motionVars(900, 400, 8)}
        >
          <div className="flex items-center gap-1.5">
            <span className="hero-glint text-[#C5A059]">★</span>
            <span>TERAPEUTAS CERTIFICADAS</span>
          </div>
        </div>

      </div>
    </section>
  );
};
