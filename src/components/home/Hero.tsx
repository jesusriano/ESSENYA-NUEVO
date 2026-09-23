import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import slide1 from '../../assets/images/hero_spa_slide_bright1_1785445052332.jpg';
import slide2 from '../../assets/images/hero_spa_slide_bright2_1785445064253.jpg';
import slide3 from '../../assets/images/portable_massage_table_1_1785444270806.jpg';
import slide4 from '../../assets/images/couple_massage_spa_1785442759347.jpg';
import slide5 from '../../assets/images/neutral_scented_oils_1_1785444292576.jpg';

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
    headlineHighlight: 'Camilla y Blancos Sterilizados',
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

export const Hero: React.FC<HeroProps> = ({ onOpenBookingModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const currentSlide = CAROUSEL_SLIDES[currentIndex];

  return (
    <section
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#120E0D] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Carousel Images with Lightened Overlays for +50% Clarity */}
      <div className="absolute inset-0 z-0">
        {CAROUSEL_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.headlineHighlight}
              className="w-full h-full object-cover object-center transform transition-transform duration-10000 ease-linear scale-105"
            />
            {/* Overlays adjusted to be 20% lighter per user request */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#120E0D] via-[#120E0D]/20 to-transparent"></div>
            <div className="absolute inset-0 bg-black/5"></div>
          </div>
        ))}
      </div>

      {/* Manual Navigation Controls (Prev / Next Buttons) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Anterior imagen"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 bg-black/40 hover:bg-[#C5A059] text-white hover:text-black rounded-full border border-white/20 backdrop-blur-md transition-all transform hover:scale-110 shadow-2xl"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Siguiente imagen"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 bg-black/40 hover:bg-[#C5A059] text-white hover:text-black rounded-full border border-white/20 backdrop-blur-md transition-all transform hover:scale-110 shadow-2xl"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Hero Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center justify-center">
        
        {/* Eyebrow tag */}
        <div className="inline-flex items-center justify-center mb-3 bg-[#120E0D]/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#C5A059]/40 shadow-lg animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] mr-2" />
          <span className="text-[#C5A059] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold">
            {currentSlide.tagline}
          </span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.08] tracking-tight my-3 drop-shadow-md">
          Masajes <br />
          <span className="text-[#C5A059] font-normal italic drop-shadow">Profesionales</span> <br />
          a Domicilio
        </h1>

        {/* Dynamic Slide Headline & Subtitle */}
        <div className="bg-[#120E0D]/75 backdrop-blur-md p-4 sm:p-6 border border-[#C5A059]/30 rounded-lg max-w-2xl my-4 shadow-2xl transition-all duration-300">
          <h2 className="text-base sm:text-lg font-serif italic text-[#C5A059] mb-1 font-medium">
            "{currentSlide.headlineHighlight}"
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
            {currentSlide.caption}
          </p>
        </div>

        {/* CTA Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full sm:w-auto">
          {/* Portal Cliente Button */}
          <a
            href="https://www.essenya.app/cliente"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#120E0D]/80 hover:bg-[#C5A059]/20 text-white hover:text-[#C5A059] font-semibold text-[11px] sm:text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 rounded-full border border-[#C5A059]/60 hover:border-[#C5A059] backdrop-blur-md"
          >
            <User className="w-4 h-4 text-[#C5A059]" />
            <span>Portal Cliente</span>
          </a>

          {/* Reservar Ahora Button */}
          <a
            href="https://www.essenya.app/cliente"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#C5A059] hover:bg-[#D8B46E] text-[#120E0D] font-bold text-[11px] sm:text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 rounded-full"
          >
            <Calendar className="w-3.5 h-3.5 text-[#120E0D]" />
            <span>Reservar Ahora</span>
          </a>

          {/* Secondary Outlined Link */}
          <Link
            to="/servicios"
            className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-white/5 text-white border border-white/40 hover:border-white font-semibold text-[11px] sm:text-xs uppercase tracking-widest transition-all flex items-center justify-center rounded-full backdrop-blur-sm"
          >
            Ver Servicios
          </Link>
        </div>

        {/* Bottom Carousel Dot Indicators */}
        <div className="flex items-center justify-center gap-2.5 mt-8 z-20">
          {CAROUSEL_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir a diapositiva ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-[#C5A059] shadow-lg'
                  : 'w-2.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Bottom Badges / Stats */}
        <div className="mt-8 pt-6 border-t border-white/10 w-full max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] sm:text-[11px] text-[#C5A059] font-mono tracking-[0.18em] font-medium uppercase bg-black/30 backdrop-blur-sm py-2 px-4 rounded-full border border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#C5A059]">★</span>
            <span>TERAPEUTAS CERTIFICADAS</span>
          </div>
          <span className="hidden sm:inline-block text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#C5A059]">★</span>
            <span>+1,200 SESIONES EN CDMX</span>
          </div>
        </div>

      </div>
    </section>
  );
};
