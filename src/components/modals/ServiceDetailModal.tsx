import React from 'react';
import { X, CheckCircle2, Sparkles, Clock, Flame, Shield, Calendar, Droplets } from 'lucide-react';
import { MassageService } from '../../types';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { AnimatedImage } from "../common/AnimatedImage";
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface ServiceDetailModalProps {
  service: MassageService | null;
  onClose: () => void;
  onSelectBooking: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onSelectBooking
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FDFBF7] shadow-2xl overflow-hidden border border-subtle max-h-[90vh] flex flex-col">
        
        {/* Banner Image & Close */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <AnimatedImage
            src={service.image}
            alt={service.title}
            className="w-full h-full"
            imageRounded="rounded-none"
            containerRounded="rounded-none"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926] via-[#2D2926]/40 to-transparent"></div>
          </AnimatedImage>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#2D2926]/80 text-white hover:bg-[#C5A059] transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            {service.tag && (
              <span className="inline-block px-3 py-1 bg-[#C5A059] text-white text-[9px] font-bold uppercase tracking-widest">
                {service.tag}
              </span>
            )}
            <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide text-white">
              {service.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#2D2926]">
          
          {/* Duration Options */}
          <div className="bg-[#F9F6F2] p-4 border border-subtle flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block">
                Duración Disponible a Domicilio:
              </span>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                {service.durationOptions.map((dur) => (
                  <span
                    key={dur}
                    className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#2D2926] border border-subtle font-mono uppercase tracking-wider"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    {dur} minutos
                  </span>
                ))}
              </div>
            </div>

            {/* Pressure Level Indicator */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-2 border border-subtle">
              <Flame className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D2926]">Presión:</span>
              <div className="flex gap-1 ml-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-4 ${
                      level <= service.intensity ? 'bg-[#C5A059]' : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="font-serif text-lg font-light italic text-[#2D2926] mb-2">
              Sobre esta Experiencia Terapéutica
            </h3>
            <p className="text-xs leading-relaxed text-gray-600">
              {service.fullDescription}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-serif text-base font-light text-[#2D2926] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              Beneficios Clave
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 bg-white p-2.5 border border-subtle">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Oils */}
          <div>
            <h3 className="font-serif text-base font-light text-[#2D2926] mb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#C5A059]" />
              Aceites & Aromaterapia Incluidos
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.includedOils.map((oil, idx) => (
                <span
                  key={idx}
                  className="bg-[#F9F6F2] text-[#2D2926] px-3 py-1 text-xs font-semibold border border-subtle uppercase tracking-wider text-[10px]"
                >
                  {oil}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Profiles */}
          <div>
            <h3 className="font-serif text-base font-light text-[#2D2926] mb-2">
              Recomendado Especialmente Para:
            </h3>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {service.recommendedFor.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 border border-subtle bg-[#F9F6F2] hover:bg-[#EFEADF] text-[#2D2926] text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Cerrar
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <a
              href={buildWhatsAppUrl({ serviceName: service.title })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#120E0D] hover:bg-[#120E0D]/90 text-white text-[10px] font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 rounded-sm border border-[#25D366]/40"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>Reservar por WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onSelectBooking(service.id);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#2D2926] hover:bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <span>Formulario</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
