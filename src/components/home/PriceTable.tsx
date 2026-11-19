import { motion } from 'motion/react';
import { MASSAGE_SERVICES, ADD_ONS } from '../../constants/data';
import type { MassageService } from '../../types';

const RESERVA_URL = 'https://www.essenya.app/cliente';

const priceOf = (service: MassageService, duration: number): number | null =>
  service.prices.find((p) => p.durationMinutes === duration)?.priceMXN ?? null;

const formatMXN = (value: number | null): string =>
  value === null ? '—' : `$${value.toLocaleString('es-MX')}`;

export function PriceTable() {
  return (
    <section
      aria-labelledby="precios-titulo"
      className="bg-[#120F0D] text-white py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-3"
        >
          <span className="text-[#C5A059] text-[11px] uppercase tracking-[0.25em] font-bold block">
            Precios
          </span>
          <h2 id="precios-titulo" className="font-serif text-3xl sm:text-4xl font-light">
            Precios <i className="font-normal text-[#C5A059]">claros</i>, sin sorpresas
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Cada sesión incluye camilla, toallas, sábanas y aceites. El precio depende de la duración que elija.
          </p>
        </motion.div>

        {/* Escritorio: tabla */}
        <div className="hidden md:block overflow-hidden border border-[#C5A059]/30">
          <table className="w-full text-left">
            <caption className="sr-only">Precios por masaje y duración de la sesión</caption>
            <thead className="bg-[#1A1614] text-[#C5A059] text-[11px] uppercase tracking-widest">
              <tr>
                <th scope="col" className="p-5 font-bold">Masaje</th>
                <th scope="col" className="p-5 font-bold text-right">60 min</th>
                <th scope="col" className="p-5 font-bold text-right">90 min</th>
                <th scope="col" className="p-5 font-bold text-right">120 min</th>
                <th scope="col" className="p-5"><span className="sr-only">Reservar</span></th>
              </tr>
            </thead>
            <tbody>
              {MASSAGE_SERVICES.map((service) => (
                <tr key={service.id} className="border-t border-[#C5A059]/15 hover:bg-white/5 transition-colors">
                  <th scope="row" className="p-5 font-serif font-light text-lg text-white">
                    {service.title}
                  </th>
                  <td className="p-5 text-right text-gray-200">{formatMXN(priceOf(service, 60))}</td>
                  <td className="p-5 text-right text-gray-200">{formatMXN(priceOf(service, 90))}</td>
                  <td className="p-5 text-right text-gray-200">{formatMXN(priceOf(service, 120))}</td>
                  <td className="p-5 text-right">
                    <a
                      href={RESERVA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-[#C5A059] text-black hover:bg-[#D8B46E] text-[10px] uppercase font-bold tracking-widest transition-colors"
                    >
                      Reservar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Móvil: tarjetas */}
        <ul className="md:hidden grid gap-4">
          {MASSAGE_SERVICES.map((service) => (
            <li key={service.id} className="border border-[#C5A059]/30 p-5 bg-[#1A1614]">
              <h3 className="font-serif text-xl font-light text-white mb-3">{service.title}</h3>
              <dl className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-[#C5A059]">60 min</dt>
                  <dd className="text-gray-100">{formatMXN(priceOf(service, 60))}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-[#C5A059]">90 min</dt>
                  <dd className="text-gray-100">{formatMXN(priceOf(service, 90))}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-[#C5A059]">120 min</dt>
                  <dd className="text-gray-100">{formatMXN(priceOf(service, 120))}</dd>
                </div>
              </dl>
              <a
                href={RESERVA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-3 bg-[#C5A059] text-black text-[10px] uppercase font-bold tracking-widest"
              >
                Reservar
              </a>
            </li>
          ))}
        </ul>

        {/* Complementos */}
        <div className="mt-20">
          <div className="text-center mb-10 space-y-2">
            <span className="text-[#C5A059] text-[11px] uppercase tracking-[0.25em] font-bold block">
              Complementos
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light">
              Agrégale <i className="font-normal text-[#C5A059]">un extra</i> a tu sesión
            </h3>
            <p className="text-xs text-gray-400">Los complementos se agregan a un masaje; no se reservan por separado.</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ADD_ONS.map((addon) => (
              <li key={addon.id} className="border border-[#C5A059]/25 p-5 bg-[#1A1614] flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-serif text-base text-white leading-snug">{addon.name}</h4>
                  <span className="shrink-0 text-[#C5A059] font-bold text-sm">+{formatMXN(addon.price)}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{addon.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}