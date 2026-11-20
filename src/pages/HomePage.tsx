import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Clock, MapPin, Heart, HelpCircle, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { Hero } from '../components/home/Hero';
import { FeaturedServices } from '../components/home/FeaturedServices';
import { EquipmentSection } from '../components/home/EquipmentSection';
import { BookingModal } from '../components/modals/BookingModal';
import { ServiceDetailModal } from '../components/modals/ServiceDetailModal';
import { MASSAGE_SERVICES, COVERAGE_ZONES } from '../constants/data';
import { MassageService } from '../types';

export const HomePage: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [preselectedDuration, setPreselectedDuration] = useState<number>(90);

  const [selectedServiceDetail, setSelectedServiceDetail] = useState<MassageService | null>(null);

  const featuredServices = MASSAGE_SERVICES.slice(0, 3); // Relajante, Descontracturante, Piedras Calientes/Pareja

  const handleOpenBookingModal = () => {
    setPreselectedServiceId(undefined);
    setIsBookingOpen(true);
  };

  const handleOpenBookingModalWithService = (serviceId: string, duration = 90) => {
    setPreselectedServiceId(serviceId);
    setPreselectedDuration(duration);
    setIsBookingOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      {/* 1. Hero Section */}
      <Hero onOpenBookingModal={handleOpenBookingModal} />

      {/* 2. Servicios destacados */}
      <FeaturedServices
        services={featuredServices}
        total={MASSAGE_SERVICES.length}
        onSelectDetail={(service) => setSelectedServiceDetail(service)}
      />

      {/* 3. Equipo que llevamos */}
      <EquipmentSection />

      {/* 4. Coverage Summary Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
              Zonas de Cobertura CDMX
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2D2926]">
              Atención a Domicilio en las <i className="font-normal text-[#C5A059]">Principales Colonias</i>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Tenemos cobertura en la Ciudad de México y su área metropolitana: llegamos puntualmente a casas, departamentos y condominios residenciales, incluyendo Atizapán de Zaragoza, Interlomas y Santa Fe.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#2D2926]">
              {COVERAGE_ZONES.map((zone, idx) => (
                <motion.div 
                  key={zone.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex items-center gap-2 bg-white p-3 border border-[#E5D2A0]"
                >
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span className="font-semibold text-[11px] uppercase tracking-wider">{zone.name}</span>
                </motion.div>
              ))}
            </div>

            <div>
              <Link
                to="/cobertura"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D2926] hover:bg-[#C5A059] text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                <span>Consultar Mapa Interactivo y Cobertura</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-[#1A1614] via-[#120F0D] to-[#0A0807] p-8 border-2 border-[#C5A059]/80 shadow-[0_0_25px_rgba(197,160,89,0.15)] text-white space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
            <h3 className="font-serif text-2xl font-light text-[#C5A059]">
              Horarios & Reserva Fácil
            </h3>
            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Lunes a Domingo:</p>
                  <p className="text-gray-300">Primer servicio 9:00 AM · Último servicio 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider">Confirmación Inmediata:</p>
                  <p className="text-gray-300">Coordinación directa a través de nuestro portal de clientes con asignación de terapeuta confirmada.</p>
                </div>
              </div>
            </div>

            <a
              href="https://www.essenya.app/cliente"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-gradient-to-r from-[#C5A059] to-[#E3C27E] hover:from-[#D8B46E] hover:to-[#F0D597] text-[#120E0D] text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg rounded-sm cursor-pointer text-center inline-block"
            >
              Agendar Cita en Mi Colonia
            </a>
          </motion.div>
        </div>
      </section>

      {/* 6. Page Navigation Cards Banner (FAQ, Gift Cards, Contact) */}
      <section className="bg-black py-16 px-4 sm:px-6 lg:px-8 border-t border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* FAQ Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#0A0807] p-8 border-2 border-[#C5A059] shadow-[0_0_25px_rgba(197,160,89,0.25)] space-y-4 hover:border-[#E3C27E] transition-all flex flex-col justify-between relative overflow-hidden group rounded-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059] to-[#C5A059]/20"></div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#C5A059] text-[10px] uppercase font-bold tracking-widest">
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                <span>¿Tienes Dudas sobre el Servicio?</span>
              </div>
              <h3 className="font-serif text-2xl font-light text-white group-hover:text-[#C5A059] transition-colors">
                Preguntas Frecuentes
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Conoce los detalles sobre cómo preparar tu espacio, nuestras formas de pago, políticas de cancelación y protocolos sanitarios.
              </p>
            </div>
            <div>
              <Link
                to="/preguntas"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C5A059] hover:text-white transition-colors pt-2"
              >
                <span>Ir al Centro de Ayuda & FAQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Gift Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#0A0807] p-8 border-2 border-[#C5A059] shadow-[0_0_25px_rgba(197,160,89,0.25)] space-y-4 hover:border-[#E3C27E] transition-all flex flex-col justify-between relative overflow-hidden group rounded-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059] to-[#C5A059]/20"></div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#C5A059] text-[10px] uppercase font-bold tracking-widest">
                <Gift className="w-4 h-4 text-[#C5A059]" />
                <span>Obsequios de Paz & Salud</span>
              </div>
              <h3 className="font-serif text-2xl font-light text-white group-hover:text-[#C5A059] transition-colors">
                Tarjetas de Regalo
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Sorprende a esa persona especial con una experiencia inolvidable de spa en su propio hogar. Certificados válidos por 12 meses.
              </p>
            </div>
            <div>
              <Link
                to="/regalos"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C5A059] hover:text-white transition-colors pt-2"
              >
                <span>Comprar Tarjeta de Regalo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialServiceId={preselectedServiceId}
        initialDuration={preselectedDuration}
      />

      <ServiceDetailModal
        service={selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
        onSelectBooking={(serviceId) => handleOpenBookingModalWithService(serviceId)}
      />
    </main>
  );
};
