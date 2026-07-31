import React from 'react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Atención y Reservas por WhatsApp"
      title="Atención y Reservas por WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center"
    >
      {/* Onda 1: Expanding Radar Ping */}
      <span className="absolute inline-flex h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#25D366] opacity-30 animate-ping" />

      {/* Botón Circular Elegante */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#120E0D]/90 hover:bg-[#25D366]/20 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all duration-300 transform group-hover:scale-110 border border-[#25D366] backdrop-blur-md">
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#25D366] drop-shadow-md" />
      </div>
    </a>
  );
};
