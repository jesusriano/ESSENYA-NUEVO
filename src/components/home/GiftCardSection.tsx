import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle2, Heart, User } from 'lucide-react';

export const GiftCardSection: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(2000);
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');

  const amounts = [1500, 2000, 3000, 5000];

  return (
    <section id="regalos" className="py-20 bg-[#FDFBF7] relative border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#2D2926] p-8 sm:p-12 text-[#FDFBF7] border border-white/10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Info */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
              Regala Experiencias Inolvidables
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
              Tarjetas de Regalo <i className="font-normal text-[#C5A059]">Essenya</i>
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              El regalo perfecto para cumpleaños, aniversarios, reconocimientos corporativos o simplemente para consentir a quien más quieres en su espacio.
            </p>

            <div className="space-y-3 text-xs text-gray-300">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Certificado digital personalizado en PDF o tarjeta impresa de lujo.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Vigencia extendida de 12 meses sin cargos ocultos.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Válido para cualquier tipo de masaje en Polanco, Lomas, Condesa y CDMX.</span>
              </p>
            </div>
          </div>

          {/* Right Customizer Box */}
          <div className="lg:col-span-6 bg-white text-[#2D2926] p-6 sm:p-8 border border-subtle shadow-md space-y-6">
            <h3 className="font-serif text-xl font-light italic text-[#2D2926] border-b border-subtle pb-3">
              Personaliza tu Tarjeta
            </h3>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                01. Selecciona el Monto:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-2.5 px-3 border text-xs font-bold transition-all ${
                      selectedAmount === amt
                        ? 'bg-[#2D2926] text-[#C5A059] border-[#2D2926]'
                        : 'bg-[#F9F6F2] text-[#2D2926] border-subtle hover:bg-[#EFEADF]'
                    }`}
                  >
                    ${amt.toLocaleString('es-MX')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">
                02. Destinatario:
              </label>
              <input
                type="text"
                placeholder="Ej. Sofía Mendoza"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full p-3 border border-subtle bg-[#F9F6F2] text-xs text-[#2D2926] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">
                03. Dedicatoria Especial:
              </label>
              <textarea
                rows={2}
                placeholder="Ej. ¡Feliz Cumpleaños! Disfruta mucho tu momento de relajación."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-subtle bg-[#F9F6F2] text-xs text-[#2D2926] focus:outline-none"
              />
            </div>

            <a
              href="https://www.essenya.app/cliente"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 bg-[#C5A059] hover:bg-[#D8B46E] text-[#120E0D] font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2 rounded-sm"
            >
              <User className="w-4 h-4 text-[#120E0D]" />
              Portal Cliente (Solicitar Regalo)
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
