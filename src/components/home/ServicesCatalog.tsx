import React, { useState } from 'react';
import { Sparkles, Clock, Flame, ArrowRight, Eye, Calendar, Heart } from 'lucide-react';
import { AnimatedImage } from "../common/AnimatedImage";
import { MASSAGE_SERVICES } from '../../constants/data';
import { MassageService } from '../../types';

interface ServicesCatalogProps {
  onSelectServiceDetail: (service: MassageService) => void;
  onOpenBookingModalWithService: (serviceId: string) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  onSelectServiceDetail,
  onOpenBookingModalWithService
}) => {
  const [activeTab, setActiveTab] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos los Masajes' },
    { id: 'relajante', label: 'Relajantes' },
    { id: 'terapeutico', label: 'Terapéuticos & Deep Tissue' },
    { id: 'especial', label: 'Rituales Especiales' },
    { id: 'parejas', label: 'Parejas' },
    { id: 'prenatal', label: 'Prenatal' },
  ];

  const filteredServices = activeTab === 'todos'
    ? MASSAGE_SERVICES
    : MASSAGE_SERVICES.filter((s) => s.category === activeTab);

  return (
    <section id="servicios" className="py-20 bg-[#FDFBF7] relative border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Catálogo Exclusivo ESSENYA
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2D2926]">
            Masajes Diseñados para tu <i className="font-normal text-[#C5A059]">Bienestar</i>
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
            Cada sesión es ejecutada por terapeutas certificadas con aceites orgánicos tibios, música personalizada y técnicas comprobadas de alivio y relajación.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-widest font-semibold transition-all ${
                activeTab === cat.id
                  ? 'bg-[#2D2926] text-white shadow-xs'
                  : 'bg-[#F9F6F2] text-[#2D2926] hover:bg-[#EFEADF] border border-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => {
            const formatIndex = (index + 1).toString().padStart(2, '0');
            return (
              <div
                key={service.id}
                className="bg-white border border-subtle overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-56">
                    <AnimatedImage
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full"
                      imageClassName="transition-all duration-500"
                      imageRounded="rounded-none"
                      containerRounded="rounded-none"
                      maskClassName="bg-[#FDFBF7]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/70 via-transparent to-transparent"></div>
                      
                      {service.tag && (
                        <span className="absolute top-4 left-4 bg-[#C5A059] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                          {service.tag}
                        </span>
                      )}

                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-white text-xs">
                        <span className="flex items-center gap-1 bg-black/60 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#FDFBF7]">
                          <Clock className="w-3 h-3 text-[#C5A059]" /> 60 / 90 / 120 min
                        </span>
                        <span className="bg-[#C5A059]/90 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1">
                          A Domicilio
                        </span>
                      </div>
                    </AnimatedImage>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] opacity-40 font-mono text-[#2D2926] block">{formatIndex}</span>
                        <h3 className="font-serif font-light text-xl text-[#2D2926] leading-snug group-hover:text-[#C5A059] transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-[#C5A059] shrink-0 mt-1">
                        <Flame className="w-4 h-4" />
                        <span className="text-[11px] font-bold">{service.intensity}/5</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>

                    {/* Benefits Preview */}
                    <div className="pt-3 border-t border-subtle space-y-1">
                      {service.benefits.slice(0, 2).map((b, idx) => (
                        <p key={idx} className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#C5A059] shrink-0"></span>
                          <span className="truncate">{b}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectServiceDetail(service)}
                      className="w-full py-2.5 px-3 border border-subtle bg-[#F9F6F2] hover:bg-[#EFEADF] text-[#2D2926] text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                      Detalle
                    </button>
                    <button
                      onClick={() => onOpenBookingModalWithService(service.id)}
                      className="w-full py-2.5 px-3 bg-[#2D2926] hover:bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      Reservar
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
