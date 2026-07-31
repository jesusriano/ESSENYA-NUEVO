import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, Clock, ShieldCheck, Phone, ArrowRight } from 'lucide-react';
import { COVERAGE_ZONES } from '../../constants/data';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export const CoverageSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(COVERAGE_ZONES[0].id);

  const activeZone = COVERAGE_ZONES.find((z) => z.id === selectedZoneId) || COVERAGE_ZONES[0];

  const filteredZones = COVERAGE_ZONES.filter((z) => {
    const term = searchTerm.toLowerCase();
    return (
      z.name.toLowerCase().includes(term) ||
      z.popularNeighborhoods.some((n) => n.toLowerCase().includes(term)) ||
      z.zipCodes.some((code) => code.includes(term))
    );
  });

  return (
    <section id="cobertura" className="py-20 bg-[#FDFBF7] relative border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Cobertura Residencial CDMX
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2D2926]">
            Llegamos a las <i className="font-normal text-[#C5A059]">Mejores Zonas</i>
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
            Servicio puntual de spa y masaje profesional directo a tu residencia o espacio privado en las mejores zonas de la Ciudad de México.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
            <input
              type="text"
              placeholder="Busca colonia, zona o C.P. (Polanco, Roma, 11000, Santa Fe)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-subtle bg-white text-xs text-[#2D2926] uppercase tracking-wider font-semibold focus:outline-none"
            />
          </div>
          {searchTerm && (
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 text-center">
              Se encontraron {filteredZones.length} zona(s) coincidentes.
            </p>
          )}
        </div>

        {/* Zones Grid & Interactive Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Zone Buttons */}
          <div className="lg:col-span-5 space-y-3">
            {filteredZones.length > 0 ? (
              filteredZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZoneId(z.id)}
                  className={`w-full p-4 border text-left transition-all flex items-center justify-between ${
                    selectedZoneId === z.id
                      ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-xs'
                      : 'bg-white text-[#2D2926] border-subtle hover:bg-[#F9F6F2]'
                  }`}
                >
                  <div>
                    <h4 className="font-serif font-light text-base">{z.name}</h4>
                    <p className={`text-[10px] uppercase tracking-wider mt-0.5 ${selectedZoneId === z.id ? 'text-[#C5A059]' : 'text-gray-500'}`}>
                      {z.areaGroup} • Llegada {z.estimatedArrival}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${selectedZoneId === z.id ? 'text-[#C5A059]' : 'text-gray-400'}`} />
                </button>
              ))
            ) : (
              <div className="bg-[#F9F6F2] p-6 border border-subtle text-center space-y-3">
                <p className="text-xs text-[#2D2926]">
                  ¿No encuentras tu colonia en la lista? Probablemente sí llegamos.
                </p>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D2926] text-white text-[10px] font-bold uppercase tracking-widest"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  WhatsApp Directo
                </a>
              </div>
            )}
          </div>

          {/* Right Selected Zone Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-subtle shadow-md space-y-6">
            
            <div className="border-b border-subtle pb-4 flex flex-wrap justify-between items-baseline gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em] block">
                  Detalles de Cobertura
                </span>
                <h3 className="font-serif text-2xl font-light text-[#2D2926] mt-1">
                  {activeZone.name}
                </h3>
              </div>
              <span className="bg-[#F9F6F2] text-[#2D2926] font-bold text-[10px] uppercase tracking-widest px-3.5 py-1.5 border border-subtle">
                {activeZone.areaGroup}
              </span>
            </div>

            <div className="space-y-4 text-xs text-[#2D2926]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-medium">Tiempo medio de llegada:</span>
                <span className="font-bold text-[#2D2926] uppercase">{activeZone.estimatedArrival}</span>
              </div>

              <div>
                <span className="font-bold text-[10px] uppercase tracking-widest text-[#C5A059] block mb-2">
                  Colonias y Fraccionamientos Frecuentes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeZone.popularNeighborhoods.map((n, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F9F6F2] text-[#2D2926] px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border border-subtle flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#C5A059]" />
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-[10px] uppercase tracking-widest text-[#C5A059] block mb-1">
                  Códigos Postales Principales:
                </span>
                <p className="text-xs text-gray-500 font-mono">
                  {activeZone.zipCodes.join(', ')}
                </p>
              </div>

              <div className="bg-[#F9F6F2] p-4 border border-subtle flex items-center justify-between text-xs text-[#2D2926]">
                <span>Cargo por traslado en esta zona:</span>
                <span className="font-bold text-[#C5A059] text-xs uppercase tracking-wider">¡INCLUIDO!</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppUrl({ zoneName: activeZone.name })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#2D2926] hover:bg-[#C5A059] text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C5A059]" />
                Reservar en {activeZone.name}
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
