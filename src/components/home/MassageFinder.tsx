import React, { useState } from 'react';
import { Calculator, Clock, Sparkles, Check, Send, Calendar, ShieldCheck, Flame } from 'lucide-react';
import { MASSAGE_SERVICES, ADD_ONS, COVERAGE_ZONES } from '../../constants/data';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

interface MassageFinderProps {
  onOpenBookingModalWithService: (serviceId: string, duration: number) => void;
}

export const MassageFinder: React.FC<MassageFinderProps> = ({
  onOpenBookingModalWithService
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(MASSAGE_SERVICES[0].id);
  const [selectedDuration, setSelectedDuration] = useState<number>(90);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(COVERAGE_ZONES[0].id);

  const currentService = MASSAGE_SERVICES.find((s) => s.id === selectedServiceId) || MASSAGE_SERVICES[0];
  const priceObj = currentService.prices.find((p) => p.durationMinutes === selectedDuration) || currentService.prices[0];

  const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
    const item = ADD_ONS.find((a) => a.id === addOnId);
    return sum + (item ? item.price : 0);
  }, 0);

  const grandTotal = priceObj.priceMXN + addOnsTotal;

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a !== id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };

  const handleDirectWhatsApp = () => {
    const zoneObj = COVERAGE_ZONES.find((z) => z.id === selectedZoneId);
    const addOnNames = selectedAddOns.map((id) => ADD_ONS.find((a) => a.id === id)?.name || id);

    const url = buildWhatsAppUrl({
      serviceName: currentService.title,
      durationMinutes: selectedDuration,
      addOnNames,
      totalPriceMXN: grandTotal,
      zoneName: zoneObj?.name
    });

    window.open(url, '_blank');
  };

  return (
    <section id="calculador" className="py-20 bg-[#FDFBF7] relative overflow-hidden border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Cotizador Transparente
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2D2926]">
            Calcula la Inversión de tu <i className="font-normal text-[#C5A059]">Experiencia</i>
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
            Sin tarifas ocultas ni cargos sorpresa. Todo nuestro equipamiento, lencería de lujo y transporte dentro de CDMX ya están incluidos.
          </p>
        </div>

        {/* Interactive Box Container */}
        <div className="bg-white shadow-lg border border-subtle overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Controls Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-8">
            
            {/* Step 1: Massage Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-3">
                01. Elige la Técnica o Especialidad:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MASSAGE_SERVICES.map((serv) => (
                  <button
                    key={serv.id}
                    type="button"
                    onClick={() => setSelectedServiceId(serv.id)}
                    className={`p-3.5 border text-left transition-all ${
                      selectedServiceId === serv.id
                        ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-xs'
                        : 'bg-[#F9F6F2] text-[#2D2926] border-subtle hover:bg-[#EFEADF]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-light text-sm">{serv.title}</span>
                      {selectedServiceId === serv.id && (
                        <Check className="w-4 h-4 text-[#C5A059]" />
                      )}
                    </div>
                    <span className={`block text-[10px] mt-1 line-clamp-1 ${
                      selectedServiceId === serv.id ? 'text-[#C5A059]' : 'text-gray-500'
                    }`}>
                      {serv.shortDescription}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Duration Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-3">
                02. Selecciona la Duración de tu Sesión:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[60, 90, 120].map((dur) => {
                  const price = currentService.prices.find((p) => p.durationMinutes === dur)?.priceMXN || 0;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur)}
                      className={`p-4 border text-center transition-all ${
                        selectedDuration === dur
                          ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
                          : 'bg-[#F9F6F2] text-[#2D2926] border-subtle hover:bg-[#EFEADF]'
                      }`}
                    >
                      <span className="block font-bold text-base uppercase tracking-wider">{dur} Minutos</span>
                      <span className={`block text-xs font-semibold mt-1 ${
                        selectedDuration === dur ? 'text-white/90' : 'text-[#C5A059]'
                      }`}>
                        ${price.toLocaleString('es-MX')} MXN
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add-ons */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-3">
                03. Añade Complementos de Lujo (Add-ons):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ADD_ONS.map((addon) => {
                  const isSelected = selectedAddOns.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-3 border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#2D2926] text-white border-[#2D2926]'
                          : 'bg-[#F9F6F2] text-[#2D2926] border-subtle hover:bg-[#EFEADF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 border flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-[#C5A059] text-white border-[#C5A059]' : 'bg-white border-subtle'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wider text-[11px]">{addon.name}</span>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ml-2 ${isSelected ? 'text-[#C5A059]' : 'text-gray-500'}`}>
                        +${addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Zone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                04. Ubicación en Ciudad de México:
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full p-3.5 border border-subtle bg-[#F9F6F2] text-xs text-[#2D2926] uppercase tracking-wider font-semibold focus:outline-none"
              >
                {COVERAGE_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} — Llegada estimada {z.estimatedArrival}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-[#2D2926] text-[#FDFBF7] p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10">
            
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.2em] block">
                    Resumen Cotizado
                  </span>
                  <h3 className="font-serif text-xl font-light italic text-white mt-0.5">
                    {currentService.title}
                  </h3>
                </div>
                <span className="bg-white/10 text-[#C5A059] px-3 py-1 text-[10px] uppercase font-bold tracking-widest border border-[#C5A059]/30">
                  {selectedDuration} min
                </span>
              </div>

              <div className="space-y-3 text-xs text-gray-300">
                <div className="flex justify-between items-center">
                  <span>Masaje base ({selectedDuration} min):</span>
                  <span className="font-bold text-white">${priceObj.priceMXN.toLocaleString('es-MX')} MXN</span>
                </div>

                {selectedAddOns.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px] block">Complementos seleccionados:</span>
                    {selectedAddOns.map((id) => {
                      const item = ADD_ONS.find((a) => a.id === id);
                      return (
                        <div key={id} className="flex justify-between items-center text-[11px] text-gray-300">
                          <span>• {item?.name}</span>
                          <span>+${item?.price} MXN</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span>Zona de servicio:</span>
                  <span className="text-white font-medium">{COVERAGE_ZONES.find((z) => z.id === selectedZoneId)?.name}</span>
                </div>

                <div className="flex justify-between items-center text-gray-400">
                  <span>Camilla, Lencería & Aromaterapia:</span>
                  <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">¡INCLUIDO!</span>
                </div>
              </div>

              {/* Total Card */}
              <div className="bg-white/5 p-5 border border-white/10 space-y-1 text-center">
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.2em]">
                  Inversión Total Estimada
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-light italic text-white">
                  ${grandTotal.toLocaleString('es-MX')} <span className="text-xs font-sans font-normal text-gray-400">MXN</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider pt-1">
                  Pagas al finalizar tu sesión (Efectivo, SPEI o Tarjeta)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-3">
              <button
                onClick={() => onOpenBookingModalWithService(selectedServiceId, selectedDuration)}
                className="w-full py-3.5 px-6 bg-[#C5A059] hover:bg-white hover:text-[#2D2926] text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Reservar Configuración
              </button>

              <button
                onClick={handleDirectWhatsApp}
                className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-white/10"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                WhatsApp Directo
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
