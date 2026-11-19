import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Reveal } from '../common/Reveal';

import massageTableImg from '../../assets/images/portable_massage_table_1_1785444270806.webp';
import towelsSheetsImg from '../../assets/images/towels_and_sheets_1_1785444281810.webp';
import oilsImg from '../../assets/images/neutral_scented_oils_1_1785444292576.webp';

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]';

const ITEMS = [
  {
    title: 'Camilla Portátil de Masaje',
    text: 'Mesa de masaje profesional acolchada, fácil de instalar en cualquier espacio para tu máxima comodidad.',
  },
  {
    title: 'Toallas y Sábanas',
    text: 'Sábanas y toallas impecables, suaves al tacto y totalmente esterilizadas para una experiencia higiénica y confortable.',
  },
  {
    title: 'Aceites Neutros y de Olor',
    text: 'Selección de aceites neutros e hipoalergénicos para pieles delicadas, así como esencias aromáticas para aromaterapia.',
  },
];

/** Foto del collage con una etiqueta discreta que la liga con la lista. */
const CollagePhoto: React.FC<{ src: string; alt: string; label: string; className: string; delay: number }> = ({
  src,
  alt,
  label,
  className,
  delay,
}) => (
  <Reveal delay={delay} className={className}>
    <figure className="group relative h-full w-full overflow-hidden rounded-3xl ring-1 ring-[#C5A059]/25">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A0807]/75 to-transparent" />
      <figcaption className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-[#120E0D]/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
        {label}
      </figcaption>
    </figure>
  </Reveal>
);

export const EquipmentSection: React.FC = () => (
  <section className="relative overflow-hidden border-y border-white/10 bg-[#2D2926] px-4 py-24 text-[#FDFBF7] sm:px-6 lg:px-8">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.14),transparent_65%)]"
    />

    <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
      {/* Texto y lista numerada */}
      <div className="space-y-10">
        <Reveal className="space-y-4">
          <span className="block text-[11px] font-bold uppercase tracking-widest-xl text-[#C5A059]">
            Tu Espacio Convertido en Spa
          </span>
          <h2 className="font-serif text-4xl font-light text-white sm:text-5xl">
            Llevamos Todo el <i className="font-normal text-[#C5A059]">Equipo Necesario</i>
          </h2>
          <div className="my-3 h-[1px] w-12 bg-[#C5A059]" />
          <p className="max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Tú no necesitas preparar nada. Nuestras terapeutas llegan a tu domicilio con camilla profesional, blancos
            esterilizados y aceites de primera calidad.
          </p>
        </Reveal>

        <ol className="divide-y divide-white/10 border-y border-white/10">
          {ITEMS.map((item, i) => (
            <li key={item.title} className="py-6">
              <Reveal delay={0.1 * i} className="flex gap-5">
                <span className="mt-1 font-mono text-sm tracking-widest text-[#C5A059]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-light text-white sm:text-2xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-300">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <Link
            to="/nosotros"
            className={`inline-flex items-center gap-2.5 rounded-full bg-[#C5A059] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#120E0D] shadow-md transition-[background-color,border-color,color] hover:bg-[#D8B46E] ${FOCUS_RING}`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Conoce Más Sobre Terapeutas &amp; Protocolos</span>
          </Link>
        </Reveal>
      </div>

      {/* Collage de fotos: una alta, una angosta y una franja ancha */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -bottom-4 -left-4 hidden h-full w-full rounded-3xl border border-[#C5A059]/30 sm:block"
        />
        <div className="relative grid h-[460px] grid-cols-6 grid-rows-6 gap-3 sm:h-[560px] sm:gap-4">
          <CollagePhoto
            src={massageTableImg}
            alt="Camilla Portátil de Masaje"
            label="Camilla"
            className="col-span-4 row-span-4"
            delay={0}
          />
          <CollagePhoto
            src={towelsSheetsImg}
            alt="Toallas y Sábanas"
            label="Blancos"
            className="col-span-2 row-span-4"
            delay={0.12}
          />
          <CollagePhoto
            src={oilsImg}
            alt="Aceites Neutros y de Olor"
            label="Aceites"
            className="col-span-6 row-span-2"
            delay={0.24}
          />
        </div>
      </div>
    </div>
  </section>
);
