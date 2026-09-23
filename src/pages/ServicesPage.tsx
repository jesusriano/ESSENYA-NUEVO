import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ServicesCatalog } from '../components/home/ServicesCatalog';
import { BookingModal } from '../components/modals/BookingModal';
import { ServiceDetailModal } from '../components/modals/ServiceDetailModal';
import { MassageService } from '../types';
import { Sparkles, Calendar, ShieldCheck } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<MassageService | null>(null);

  const handleOpenBookingModalWithService = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <main className="pt-28 pb-20 min-h-screen bg-[#FDFBF7]">
      {/* Page Header */}
      <div className="bg-[#2D2926] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-white/10 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-3 relative z-10"
        >
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Catálogo Terapéutico
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white">
            Menú de Masajes a <i className="font-normal text-[#C5A059]">Domicilio</i>
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Explora nuestras técnicas diseñadas por expertos para el alivio del dolor muscular, la reducción de tensión nerviosa, tratamientos prenatal y experiencias inolvidables en pareja.
          </p>
        </motion.div>
      </div>

      {/* Catalogue Component */}
      <ServicesCatalog
        onSelectServiceDetail={(service) => setSelectedServiceDetail(service)}
        onOpenBookingModalWithService={(id) => handleOpenBookingModalWithService(id)}
      />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialServiceId={preselectedServiceId}
      />

      <ServiceDetailModal
        service={selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
        onSelectBooking={(serviceId) => handleOpenBookingModalWithService(serviceId)}
      />
    </main>
  );
};
