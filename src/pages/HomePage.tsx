import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Clock, MapPin, Heart, HelpCircle, Gift } from 'lucide-react';
import { AnimatedImage } from "../components/common/AnimatedImage";
import { Hero } from '../components/home/Hero';
import { Testimonials } from '../components/home/Testimonials';
import { BookingModal } from '../components/modals/BookingModal';
import { ServiceDetailModal } from '../components/modals/ServiceDetailModal';
import { MASSAGE_SERVICES, COVERAGE_ZONES } from '../constants/data';
import { MassageService } from '../types';

import massageTableImg from '../assets/images/portable_massage_table_1_1785444270806.jpg';
import towelsSheetsImg from '../assets/images/towels_and_sheets_1_1785444281810.jpg';
import oilsImg from '../assets/images/neutral_scented_oils_1_1785444292576.jpg';

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

      {/* 2. Featured Services Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Experiencia Terapéutica
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2D2926]">
            Nuestros Masajes a <i className="font-normal text-[#C5A059]">Domicilio</i>
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Llevamos todo el equipo profesional hasta tu residencia. Descubre una selección de nuestras terapias más solicitadas en la Ciudad de México.
          </p>
        </div>

        {/* 3 Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="bg-gradient-to-b from-[#1A1614] via-[#120F0D] to-[#0A0807] border-2 border-[#C5A059]/80 hover:border-[#C5A059] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.7)] transition-all flex flex-col group relative"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent z-10" />
              <div className="relative h-64 bg-black">
                <AnimatedImage
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full"
                  imageRounded="rounded-none"
                  containerRounded="rounded-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0807] via-transparent to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm text-[#C5A059] border border-[#C5A059] text-[9px] uppercase tracking-widest font-bold px-3 py-1 shadow-md">
                    {service.tag}
                  </span>
                </AnimatedImage>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-light text-white mb-2 group-hover:text-[#C5A059] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#C5A059]/30 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedServiceDetail(service)}
                    className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] hover:text-white transition-colors flex items-center gap-1"
                  >
                    Ver detalles <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleOpenBookingModalWithService(service.id)}
                    className="px-4 py-2 bg-[#C5A059] text-black hover:bg-[#D8B46E] text-[10px] uppercase font-bold tracking-widest transition-colors rounded-sm"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/servicios"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#2D2926] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-md group"
          >
            <span>Ver Menú Completo de Servicios (8 Opciónes)</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:text-white transition-colors" />
          </Link>
        </div>
      </section>

      {/* 3. The Experience Preview / Equipment */}
      <section className="bg-[#2D2926] text-[#FDFBF7] py-20 px-4 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
              Tu Espacio Convertido en Spa
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">
              Llevamos Todo el <i className="font-normal text-[#C5A059]">Equipo Necesario</i>
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Tú no necesitas preparar nada. Nuestras terapeutas llegan a tu domicilio con camilla profesional, blancos esterilizados y aceites de primera calidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#0A0807] p-6 border-2 border-[#C5A059]/30 hover:border-[#C5A059]/70 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent z-10" />
              <AnimatedImage
                src={massageTableImg}
                alt="Camilla Portátil de Masaje"
                className="w-full h-48"
                imageClassName="opacity-90 group-hover:opacity-100"
              />
              <div className="relative z-10 space-y-2">
                <h3 className="font-serif text-lg font-light text-white group-hover:text-[#C5A059] transition-colors">Camilla Portátil de Masaje</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Mesa de masaje profesional acolchada, fácil de instalar en cualquier espacio para tu máxima comodidad.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#0A0807] p-6 border-2 border-[#C5A059]/30 hover:border-[#C5A059]/70 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent z-10" />
              <AnimatedImage
                src={towelsSheetsImg}
                alt="Toallas y Sábanas"
                className="w-full h-48"
                imageClassName="opacity-90 group-hover:opacity-100"
              />
              <div className="relative z-10 space-y-2">
                <h3 className="font-serif text-lg font-light text-white group-hover:text-[#C5A059] transition-colors">Toallas y Sábanas</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Sábanas y toallas impecables, suaves al tacto y totalmente esterilizadas para una experiencia higiénica y confortable.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#0A0807] p-6 border-2 border-[#C5A059]/30 hover:border-[#C5A059]/70 shadow-[0_4px_20px_rgba(0,0,0,0.6)] space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent z-10" />
              <AnimatedImage
                src={oilsImg}
                alt="Aceites Neutros y de Olor"
                className="w-full h-48"
                imageClassName="opacity-90 group-hover:opacity-100"
              />
              <div className="relative z-10 space-y-2">
                <h3 className="font-serif text-lg font-light text-white group-hover:text-[#C5A059] transition-colors">Aceites Neutros y de Olor</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Selección de aceites neutros e hipoalergénicos para pieles delicadas, así como esencias aromáticas para aromaterapia.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/nosotros"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A059] hover:bg-[#D8B46E] text-[#120E0D] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Conoce Más Sobre Terapeutas & Protocolos</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Coverage Summary Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
              Zonas de Cobertura CDMX
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2D2926]">
              Atención a Domicilio en las <i className="font-normal text-[#C5A059]">Principales Colonias</i>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Llegamos puntualmente a casas, departamentos y condominios residenciales en las mejores zonas de la Ciudad de México y área metropolitana.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#2D2926]">
              {COVERAGE_ZONES.map((zone) => (
                <div key={zone.id} className="flex items-center gap-2 bg-white p-3 border border-[#E5D2A0]">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span className="font-semibold text-[11px] uppercase tracking-wider">{zone.name}</span>
                </div>
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
          </div>

          <div className="bg-gradient-to-b from-[#1A1614] via-[#120F0D] to-[#0A0807] p-8 border-2 border-[#C5A059]/80 shadow-[0_0_25px_rgba(197,160,89,0.15)] text-white space-y-6 relative overflow-hidden">
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
                  <p className="text-gray-300">Coordinación directa por WhatsApp con asignación de terapeuta confirmada.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenBookingModal}
              className="w-full py-3.5 bg-gradient-to-r from-[#C5A059] to-[#E3C27E] hover:from-[#D8B46E] hover:to-[#F0D597] text-[#120E0D] text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg rounded-sm cursor-pointer"
            >
              Agendar Cita en Mi Colonia
            </button>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <Testimonials />

      {/* 6. Page Navigation Cards Banner (FAQ, Gift Cards, Contact) */}
      <section className="bg-black py-16 px-4 sm:px-6 lg:px-8 border-t border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* FAQ Card */}
          <div className="bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#0A0807] p-8 border-2 border-[#C5A059] shadow-[0_0_25px_rgba(197,160,89,0.25)] space-y-4 hover:border-[#E3C27E] transition-all flex flex-col justify-between relative overflow-hidden group rounded-sm">
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
          </div>

          {/* Gift Card */}
          <div className="bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#0A0807] p-8 border-2 border-[#C5A059] shadow-[0_0_25px_rgba(197,160,89,0.25)] space-y-4 hover:border-[#E3C27E] transition-all flex flex-col justify-between relative overflow-hidden group rounded-sm">
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
          </div>

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
