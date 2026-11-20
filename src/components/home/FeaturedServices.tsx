import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { MassageService } from '../../types';
import { Reveal } from '../common/Reveal';
import { PriceList } from '../common/PriceList';

const BOOKING_URL = 'https://www.essenya.app/cliente';
const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]';

interface FeaturedServicesProps {
  services: MassageService[];
  onSelectDetail: (service: MassageService) => void;
  /** Total de masajes del catálogo (para el texto del botón). */
  total: number;
}

interface TileProps {
  service: MassageService;
  onSelectDetail: (service: MassageService) => void;
  featured?: boolean;
  className?: string;
}

/** Tarjeta con la foto de fondo recortada para llenar la tarjeta y el texto encima, sobre un degradado oscuro. */
const CoverTile: React.FC<TileProps> = ({ service, onSelectDetail, featured = false, className = '' }) => (
  <article
    className={`group relative isolate flex overflow-hidden rounded-3xl bg-[#120E0D] ring-1 ring-[#C5A059]/25 transition-all duration-500 hover:-translate-y-1 hover:ring-[#C5A059]/70 hover:shadow-[0_30px_70px_-30px_rgba(18,14,13,0.85)] ${className}`}
  >
    <img
      src={service.image}
      alt={service.title}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0A0807] via-[#0A0807]/70 to-[#0A0807]/10" />

    <div className="flex w-full flex-col justify-between gap-10 p-6 sm:p-8">
      {service.tag ? (
        <span className="self-start rounded-full border border-[#C5A059]/50 bg-[#120E0D]/60 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E3C27E]">
          {service.tag}
        </span>
      ) : (
        <span />
      )}

      <div className="space-y-4">
        <h3
          className={`font-serif font-light leading-tight text-white ${
            featured ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-[1.7rem]'
          }`}
        >
          {service.title}
        </h3>
        <p
          className={`max-w-md leading-relaxed text-white/85 ${
            featured ? 'text-sm sm:text-base line-clamp-4' : 'text-sm line-clamp-3'
          }`}
        >
          {service.shortDescription}
        </p>
        <PriceList prices={service.prices} variant="dark" className={featured ? 'max-w-md' : 'max-w-sm'} />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full bg-[#C5A059] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#120E0D] transition-[background-color,border-color,color] hover:bg-[#D8B46E] ${FOCUS_RING}`}
          >
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            Reservar
          </a>
          <button
            type="button"
            data-track="detalle_servicio" data-track-label={service.title}
            onClick={() => onSelectDetail(service)}
            className={`group/link inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 transition-[background-color,border-color,color] hover:text-[#E3C27E] ${FOCUS_RING}`}
          >
            Ver detalles
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  </article>
);

/** Afiche: se muestra completo (sin recortar) arriba y el texto va debajo, sobre fondo oscuro. */
const PosterTile: React.FC<TileProps> = ({ service, onSelectDetail, featured = false, className = '' }) => (
  <article
    className={`group flex flex-col overflow-hidden rounded-3xl bg-[#120E0D] ring-1 ring-[#C5A059]/25 transition-all duration-500 hover:-translate-y-1 hover:ring-[#C5A059]/70 hover:shadow-[0_30px_70px_-30px_rgba(18,14,13,0.85)] ${className}`}
  >
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#120E0D] p-4 sm:p-6">
      <img
        src={service.image}
        alt={service.title}
        loading="lazy"
        decoding="async"
        className="max-h-full w-auto max-w-full object-contain transition-transform duration-[1400ms] ease-out group-hover:scale-[1.02]"
        style={{ maxHeight: featured ? '460px' : '320px' }}
      />
    </div>
    <div className="space-y-4 border-t border-[#C5A059]/20 bg-[#120E0D] p-6 sm:p-7">
      <h3 className={`font-serif font-light leading-tight text-white ${featured ? 'text-3xl' : 'text-2xl'}`}>
        {service.title}
      </h3>
      <PriceList prices={service.prices} variant="dark" className="max-w-md" />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-full bg-[#C5A059] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#120E0D] transition-colors hover:bg-[#D8B46E] ${FOCUS_RING}`}
        >
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          Reservar
        </a>
        <button
          type="button"
          data-track="detalle_servicio" data-track-label={service.title}
            onClick={() => onSelectDetail(service)}
          className={`group/link inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 transition-colors hover:text-[#E3C27E] ${FOCUS_RING}`}
        >
          Ver detalles
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </div>
  </article>
);

/** Despacha: afiches se muestran completos; el resto, con la foto de fondo recortada. */
const ServiceTile: React.FC<TileProps> = (props) =>
  props.service.imageFit === 'contain' ? <PosterTile {...props} /> : <CoverTile {...props} />;

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({ services, onSelectDetail, total }) => {
  const [main, ...rest] = services;
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      {/* Resplandor dorado muy suave detrás del título (sin blur: es un degradado radial estático) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[60rem] max-w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.16),transparent_68%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
          <span className="block text-[11px] font-bold uppercase tracking-widest-xl text-[#C5A059]">
            Experiencia Terapéutica
          </span>
          <h2 className="font-serif text-4xl font-light text-[#2D2926] sm:text-5xl">
            Nuestros Masajes a <i className="font-normal text-[#C5A059]">Domicilio</i>
          </h2>
          <div className="mx-auto my-3 h-[1px] w-12 bg-[#C5A059]" />
          <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
            Llevamos todo el equipo profesional hasta tu residencia. Descubre una selección de nuestras terapias más
            solicitadas en la Ciudad de México.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {main && (
            <Reveal className="md:col-span-2 lg:col-span-7 lg:row-span-2">
              <ServiceTile
                service={main}
                onSelectDetail={onSelectDetail}
                featured
                className="h-full min-h-[520px] lg:min-h-[640px]"
              />
            </Reveal>
          )}
          {rest.map((service, i) => (
            <Reveal key={service.id} delay={0.12 * (i + 1)} className="lg:col-span-5">
              <ServiceTile service={service} onSelectDetail={onSelectDetail} className="h-full min-h-[400px]" />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center" delay={0.1}>
          <Link
            to="/servicios"
            className={`group inline-flex items-center gap-3 rounded-full bg-[#2D2926] px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-[background-color,border-color,color] hover:bg-[#C5A059] ${FOCUS_RING}`}
          >
            <span>Ver Menú Completo de Servicios ({total} Opciones)</span>
            <ArrowRight
              className="h-4 w-4 text-[#C5A059] transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
