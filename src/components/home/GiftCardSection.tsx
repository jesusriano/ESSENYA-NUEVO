import React, { useState } from 'react';
import { CheckCircle2, Gift, User } from 'lucide-react';
import { MASSAGE_SERVICES, WHATSAPP_NUMBER } from '../../constants/data';
import { formatMXN } from '../common/PriceList';
import { Reveal } from '../common/Reveal';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]';

interface Selection {
  serviceId: string;
  minutes: number;
}

export const GiftCardSection: React.FC = () => {
  const [selection, setSelection] = useState<Selection>({
    serviceId: MASSAGE_SERVICES[0].id,
    minutes: MASSAGE_SERVICES[0].prices[0].durationMinutes,
  });
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');

  const service = MASSAGE_SERVICES.find((s) => s.id === selection.serviceId) ?? MASSAGE_SERVICES[0];
  const price = service.prices.find((p) => p.durationMinutes === selection.minutes) ?? service.prices[0];

  // Mensaje listo para enviar por WhatsApp con el regalo elegido.
  const whatsappText = [
    `Hola ESSENYA, quiero regalar un ${service.title} de ${price.durationMinutes} minutos (${formatMXN(price.priceMXN)}).`,
    recipientName.trim() ? `Para: ${recipientName.trim()}` : '',
    message.trim() ? `Dedicatoria: ${message.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section id="regalos" className="relative border-b border-subtle bg-[#FDFBF7] py-20">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* 01. Elegir masaje y duración: se toca el precio y queda elegido ambos */}
        <div>
          <Reveal className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
            <span className="block text-[11px] font-bold uppercase tracking-widest-xl text-[#C5A059]">
              01. Elige el masaje y la duración
            </span>
            <h2 className="font-serif text-3xl font-light text-[#2D2926] sm:text-4xl">
              ¿Qué masaje quieres <i className="font-normal text-[#C5A059]">regalar</i>?
            </h2>
            <div className="mx-auto my-3 h-[1px] w-12 bg-[#C5A059]" />
            <p className="text-sm leading-relaxed text-gray-600">
              Cada masaje tiene tres duraciones. Toca el precio del que quieras regalar.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {MASSAGE_SERVICES.map((s, i) => {
              const active = s.id === selection.serviceId;
              return (
                <Reveal key={s.id} delay={(i % 3) * 0.08} y={20} className={`h-full ${i === MASSAGE_SERVICES.length - 1 && MASSAGE_SERVICES.length % 3 === 1 ? 'lg:col-start-2' : ''}`}>
                  <article
                    className={`flex h-full flex-col gap-4 rounded-3xl bg-white p-5 shadow-[0_10px_40px_-26px_rgba(45,41,38,0.45)] ring-1 transition-all duration-300 sm:p-6 ${
                      active ? 'ring-2 ring-[#C5A059]' : 'ring-black/5 hover:ring-[#C5A059]/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={s.image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className={`h-16 w-16 shrink-0 rounded-2xl ${s.imageFit === 'contain' ? 'object-contain bg-[#120E0D]' : 'object-cover'}`}
                      />
                      <h3 className="font-serif text-xl font-light leading-snug text-[#2D2926]">{s.title}</h3>
                    </div>
                    <div
                      role="group"
                      aria-label={`Duración y precio de ${s.title}`}
                      className="mt-auto grid grid-cols-3 gap-2"
                    >
                      {s.prices.map((p) => {
                        const on = active && p.durationMinutes === selection.minutes;
                        return (
                          <button
                            key={p.durationMinutes}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setSelection({ serviceId: s.id, minutes: p.durationMinutes })}
                            className={`rounded-2xl border px-2 py-3 text-center transition-[background-color,border-color,color] ${FOCUS_RING} ${
                              on
                                ? 'border-[#2D2926] bg-[#2D2926] text-white'
                                : 'border-[#2D2926]/10 bg-[#F9F6F2] text-[#2D2926] hover:border-[#C5A059]'
                            }`}
                          >
                            <span
                              className={`block font-mono text-[10px] uppercase tracking-[0.14em] ${
                                on ? 'text-[#E3C27E]' : 'text-[#8A6A24]'
                              }`}
                            >
                              {p.durationMinutes} min
                            </span>
                            <span className="mt-0.5 block font-serif text-lg leading-tight">
                              {formatMXN(p.priceMXN)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* 02 y 03. Personalizar el regalo */}
        <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-white/10 bg-[#2D2926] p-8 text-[#FDFBF7] shadow-xl sm:p-12 lg:grid-cols-12">
          {/* Información */}
          <div className="space-y-6 lg:col-span-6">
            <span className="block text-[11px] font-bold uppercase tracking-widest-xl text-[#C5A059]">
              Regala Experiencias Inolvidables
            </span>

            <h2 className="font-serif text-3xl font-light leading-tight text-white sm:text-5xl">
              Tarjetas de Regalo <i className="font-normal text-[#C5A059]">Essenya</i>
            </h2>

            <p className="text-sm leading-relaxed text-gray-300">
              El regalo perfecto para cumpleaños, aniversarios, reconocimientos corporativos o simplemente para consentir a quien más quieres en su espacio.
            </p>

            <div className="space-y-3 text-xs text-gray-300">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C5A059]" aria-hidden="true" />
                <span>Certificado digital personalizado en PDF o tarjeta impresa de lujo.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C5A059]" aria-hidden="true" />
                <span>Vigencia extendida de 12 meses sin cargos ocultos.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C5A059]" aria-hidden="true" />
                <span>Válido para cualquier tipo de masaje en Polanco, Lomas, Condesa y CDMX.</span>
              </p>
            </div>
          </div>

          {/* Personalizador */}
          <div className="space-y-6 rounded-3xl bg-white p-6 text-[#2D2926] shadow-md sm:p-8 lg:col-span-6">
            <h3 className="border-b border-subtle pb-3 font-serif text-xl font-light italic text-[#2D2926]">
              Personaliza tu Tarjeta
            </h3>

            {/* Resumen del regalo elegido */}
            <div
              className="flex items-center justify-between gap-4 rounded-2xl bg-[#F9F6F2] p-4"
              aria-live="polite"
            >
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 shrink-0 text-[#C5A059]" aria-hidden="true" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                    Tu regalo
                  </span>
                  <span className="block font-serif text-base leading-snug">
                    {service.title} · {price.durationMinutes} min
                  </span>
                </div>
              </div>
              <span className="font-serif text-2xl text-[#2D2926]">{formatMXN(price.priceMXN)}</span>
            </div>

            <div>
              <label
                htmlFor="gift-recipient"
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]"
              >
                02. Destinatario:
              </label>
              <input
                id="gift-recipient"
                type="text"
                placeholder="Ej. Sofía Mendoza"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className={`w-full rounded-xl border border-subtle bg-[#F9F6F2] p-3 text-xs text-[#2D2926] ${FOCUS_RING}`}
              />
            </div>

            <div>
              <label
                htmlFor="gift-message"
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]"
              >
                03. Dedicatoria Especial:
              </label>
              <textarea
                id="gift-message"
                rows={2}
                placeholder="Ej. ¡Feliz Cumpleaños! Disfruta mucho tu momento de relajación."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full rounded-xl border border-subtle bg-[#F9F6F2] p-3 text-xs text-[#2D2926] ${FOCUS_RING}`}
              />
            </div>

            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-2 rounded-full bg-[#C5A059] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#120E0D] shadow-md transition-colors hover:bg-[#D8B46E] ${FOCUS_RING}`}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Pedir este regalo por WhatsApp
              </a>
              <a
                href="https://www.essenya.app/cliente"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-2 rounded-full border border-[#2D2926]/20 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D2926] transition-colors hover:border-[#C5A059] hover:text-[#8A6A24] ${FOCUS_RING}`}
              >
                <User className="h-4 w-4 text-[#C5A059]" aria-hidden="true" />
                Portal Cliente (Solicitar Regalo)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
