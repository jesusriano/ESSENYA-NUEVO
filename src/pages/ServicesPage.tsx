import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ServicesCatalog } from '../components/home/ServicesCatalog';
import { abrirReserva } from '../utils/booking';
import { ServiceDetailModal } from '../components/modals/ServiceDetailModal';
import { MassageService } from '../types';
import headerImg from '../assets/images/hero_spa_slide_bright2_1785445064253.webp';

export const ServicesPage: React.FC = () => {
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<MassageService | null>(null);

  const handleOpenBookingModalWithService = (serviceId: string) => abrirReserva({ serviceId });

  return (
    <main className="pb-20 min-h-screen bg-[#FDFBF7]">
      {/* Page Header */}
      <div className="relative isolate overflow-hidden bg-[#120E0D] px-4 pb-20 pt-40 text-center text-[#FDFBF7] sm:px-6 sm:pb-28 sm:pt-48 lg:px-8">
        <img
          src={headerImg}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#120E0D]/75 via-[#120E0D]/45 to-[#120E0D]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-4xl space-y-4"
        >
          <span className="block text-[11px] font-bold uppercase tracking-widest-xl text-[#C5A059]">
            Catálogo Terapéutico
          </span>
          <h1 className="font-serif text-4xl font-light text-white sm:text-6xl">
            Menú de Masajes a <i className="font-normal text-[#C5A059]">Domicilio</i>
          </h1>
          <div className="mx-auto my-3 h-[1px] w-12 bg-[#C5A059]"></div>
          <p className="mx-auto max-w-2xl text-sm font-normal leading-relaxed text-gray-200 sm:text-base">
            Explora nuestras técnicas diseñadas por expertos para el alivio del dolor muscular, la reducción de tensión nerviosa, tratamientos prenatal y experiencias inolvidables en pareja.
          </p>
        </motion.div>
      </div>

      {/* Catalogue Component */}
      <ServicesCatalog
        onSelectServiceDetail={(service) => setSelectedServiceDetail(service)}
        onOpenBookingModalWithService={(id) => handleOpenBookingModalWithService(id)}
      />

      {/* Detalle del masaje (el modal de reserva es único y vive en App) */}
      <ServiceDetailModal
        service={selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
        onSelectBooking={(serviceId) => handleOpenBookingModalWithService(serviceId)}
      />
    </main>
  );
};
