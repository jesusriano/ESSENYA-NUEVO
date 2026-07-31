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
      <span className="absolute inline-flex h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#25D366] opacity-75 animate-ping" />

      {/* Onda 2: Outer Soft Glow Wave */}
      <span className="absolute inline-flex h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#25D366]/30 animate-pulse" />

      {/* Botón Circular con Únicamente el Logo de WhatsApp Crisp & Parpadeando */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110 border-2 border-white/40">
        <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-md animate-pulse" />
      </div>
    </a>
  );
};
