import React, { useState } from 'react';
import { ArrowRight, Calendar, Check } from 'lucide-react';
import { MASSAGE_SERVICES } from '../../constants/data';
import { MassageService } from '../../types';
import { Reveal } from '../common/Reveal';
import { PriceList } from '../common/PriceList';

const BOOKING_URL = 'https://www.essenya.app/cliente';
const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]';

interface ServicesCatalogProps {
  onSelectServiceDetail: (service: MassageService) => void;
  onOpenBookingModalWithService: (serviceId: string) => void;
}

const CATEGORIES = [
  { id: 'todos', label: 'Todos los Masajes' },
  { id: 'relajante', label: 'Relajantes' },
  { id: 'terapeutico', label: 'Terapéuticos & Deep Tissue' },
  { id: 'especial', label: 'Rituales Especiales' },
  { id: 'parejas', label: 'Parejas' },
  { id: 'prenatal', label: 'Prenatal' },
];

/** Cinco puntos que indican la intensidad de la presión (1 a 5). */
const Intensity: React.FC<{ level: number }> = ({ level }) => (
  <span
    className="flex shrink-0 items-center gap-1"
    role="img"
    aria-label={`Intensidad ${level} de 5`}
    title={`Intensidad ${level} de 5`}
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`h-1.5 w-1.5 rounded-full ${n <= level ? 'bg-[#C5A059]' : 'bg-[#2D2926]/15'}`} />
    ))}
  </span>
);

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({ onSelectServiceDetail }) => {
  const [activeTab, setActiveTab] = useState<string>('todos');

  const filteredServices =
    activeTab === 'todos' ? MASSAGE_SERVICES : MASSAGE_SERVICES.filter((s) => s.category === activeTab);

  return (
    <section id="servicios" className="relative border-b border-subtle bg-[#FDFBF7] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Introducción (el título principal de la página ya está arriba) */}
        <Reveal className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <span className="block text-[11px] font-bold uppercase tracking-widest-xl text-[#C5A059]">
            Catálogo Exclusivo ESSENYA
          </span>
          <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
            Cada sesión es ejecutada por terapeutas certificadas con aceites orgánicos tibios, música personalizada y
            técnicas comprobadas de alivio y relajación.
          </p>
        </Reveal>

        {/* Filtros */}
        <Reveal delay={0.1} y={12} className="mb-12 flex flex-wrap items-center justify-center gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={activeTab === cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-[background-color,color,box-shadow] ${FOCUS_RING} ${
                activeTab === cat.id
                  ? 'bg-[#2D2926] text-white shadow-md'
                  : 'bg-white text-[#2D2926] ring-1 ring-[#2D2926]/10 hover:ring-[#C5A059] hover:text-[#8A6A24]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </Reveal>

        {/* Tarjetas: todas del mismo alto y con el mismo formato de foto */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filteredServices.map((service, index) => (
            <Reveal key={`${service.id}-${activeTab}`} delay={(index % 3) * 0.1} y={30} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_-22px_rgba(45,41,38,0.4)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(45,41,38,0.5)] hover:ring-[#C5A059]/50">
                {/* Foto */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#120E0D]">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#120E0D]/70 to-transparent" />
                  {service.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#C5A059] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#120E0D] shadow-sm">
                      {service.tag}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-start gap-2 text-white">
                    <span className="rounded-full bg-[#120E0D]/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E3C27E]">
                      A Domicilio
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-2xl font-light leading-snug text-[#2D2926] transition-[background-color,border-color,color] group-hover:text-[#8A6A24]">
                      {service.title}
                    </h3>
                    <div className="mt-2.5">
                      <Intensity level={service.intensity} />
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">{service.shortDescription}</p>

                  <ul className="space-y-1.5">
                    {service.benefits.slice(0, 2).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs leading-snug text-gray-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C5A059]" aria-hidden="true" />
                        <span className="line-clamp-2">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Precios y botones siempre al fondo de la tarjeta */}
                  <PriceList prices={service.prices} className="mt-auto" />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectServiceDetail(service)}
                      className={`group/link inline-flex items-center justify-center gap-2 rounded-full border border-[#2D2926]/15 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2D2926] transition-[background-color,border-color,color] hover:border-[#C5A059] hover:text-[#8A6A24] ${FOCUS_RING}`}
                    >
                      Detalle
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#2D2926] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-[background-color,border-color,color] hover:bg-[#C5A059] hover:text-[#120E0D] ${FOCUS_RING}`}
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#C5A059]" aria-hidden="true" />
                      Reservar
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
