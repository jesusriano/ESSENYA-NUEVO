import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Check, Sparkles, Send, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { MASSAGE_SERVICES, ADD_ONS, COVERAGE_ZONES } from '../../constants/data';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialDuration?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialDuration = 90
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || MASSAGE_SERVICES[0].id
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(initialDuration);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [date, setDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(COVERAGE_ZONES[0].id);
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

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

  const timeOptions = [
    '09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM', '08:00 PM'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] shadow-2xl overflow-hidden border border-subtle max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#2D2926] p-5 text-[#FDFBF7] flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#C5A059] bg-[#2D2926] text-[#C5A059] flex items-center justify-center font-serif text-lg font-light italic">
              E
            </div>
            <div>
              <h3 className="font-serif text-lg font-light italic text-white leading-tight">
                Reserva de Masaje
              </h3>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-widest">
                Paso {step} de 3 — {step === 1 ? 'Elección de Servicio' : step === 2 ? 'Fecha, Hora y Ubicación' : 'Confirmación y Resumen'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 border border-[#C5A059] bg-[#2D2926] text-[#C5A059] flex items-center justify-center mx-auto text-2xl">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-light text-[#2D2926]">
                ¡Acceso al <i className="font-normal text-[#C5A059]">Portal Cliente</i>!
              </h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Hemos preparado la información para tu servicio. Puedes continuar o gestionar tu reserva directamente en nuestro Portal Cliente.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <a
                  href="https://www.essenya.app/cliente"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3 bg-[#C5A059] text-[#120E0D] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D8B46E] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Ir al Portal Cliente
                </a>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#2D2926] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SERVICE & DURATION */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                      01. Selecciona el Tipo de Masaje:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MASSAGE_SERVICES.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setSelectedServiceId(s.id)}
                          className={`p-3.5 border cursor-pointer transition-all ${
                            selectedServiceId === s.id
                              ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-xs'
                              : 'bg-white text-[#2D2926] border-subtle hover:bg-[#F9F6F2]'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="font-serif font-light text-sm">{s.title}</h5>
                            {s.tag && (
                              <span className="text-[9px] bg-[#C5A059] text-white font-bold uppercase tracking-widest px-2 py-0.5 shrink-0">
                                {s.tag}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                            selectedServiceId === s.id ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {s.shortDescription}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                      02. Selecciona la Duración:
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[60, 90, 120].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSelectedDuration(dur)}
                          className={`p-3 border text-center transition-all ${
                            selectedDuration === dur
                              ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs'
                              : 'bg-white text-[#2D2926] border-subtle hover:bg-[#F9F6F2]'
                          }`}
                        >
                          <span className="block font-bold text-sm uppercase tracking-wider">{dur} min</span>
                          <span className={`block text-[10px] font-mono mt-0.5 uppercase tracking-widest ${selectedDuration === dur ? 'text-white' : 'text-[#C5A059]'}`}>
                            Sesión
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                      03. Opcional — Complementa tu Experiencia (Add-ons):
                    </label>
                    <div className="space-y-2">
                      {ADD_ONS.map((addon) => {
                        const isSelected = selectedAddOns.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddOn(addon.id)}
                            className={`p-3 border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#2D2926] text-white border-[#2D2926]'
                                : 'bg-white text-[#2D2926] border-subtle hover:bg-[#F9F6F2]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 border flex items-center justify-center text-[10px] ${
                                  isSelected ? 'bg-[#C5A059] text-white border-[#C5A059]' : 'border-subtle bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <p className="font-semibold text-xs uppercase tracking-wider">{addon.name}</p>
                                <p className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{addon.description}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-mono uppercase tracking-wider shrink-0 ml-2 ${isSelected ? 'text-[#C5A059]' : 'text-gray-400'}`}>
                              Complemento
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DATE, TIME & LOCATION */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> Fecha Deseada:
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> Horario Preferido:
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] font-semibold focus:outline-none"
                      >
                        {timeOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> Zona / Alcaldía en CDMX:
                    </label>
                    <select
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] font-semibold focus:outline-none uppercase tracking-wider"
                    >
                      {COVERAGE_ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.areaGroup})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">
                      Colonia / Residencia Especifica:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Polanco III Sección, Av. Horacio 1200, Apto 4B"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">
                        Tu Nombre Completo:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. María Fernanda Morales"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">
                        Teléfono de Contacto:
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej. 55 1234 5678"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">
                      Notas Especiales / Indicaciones:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Anota si hay estacionamiento para la terapeuta o si requieres factura."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: SUMMARY & FINAL ACTION */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-[#F9F6F2] p-5 border border-subtle space-y-3">
                    <h4 className="font-serif font-light text-base text-[#2D2926] border-b border-subtle pb-2">
                      Resumen de tu Experiencia ESSENYA
                    </h4>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Servicio:</span>
                      <span className="font-bold text-[#2D2926] uppercase">{currentService.title} ({selectedDuration} min)</span>
                    </div>
                    {selectedAddOns.length > 0 && (
                      <div className="flex justify-between items-start text-xs text-gray-500">
                        <span>Complementos:</span>
                        <span className="text-right font-medium text-[#2D2926]">
                          {selectedAddOns.map((id) => ADD_ONS.find((a) => a.id === id)?.name).join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Fecha y Hora:</span>
                      <span className="font-bold text-[#2D2926] uppercase">{date} a las {timeSlot}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Ubicación:</span>
                      <span className="font-bold text-[#2D2926] uppercase">{COVERAGE_ZONES.find((z) => z.id === selectedZoneId)?.name}</span>
                    </div>
                    {clientName && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Nombre:</span>
                        <span className="font-bold text-[#2D2926] uppercase">{clientName}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-subtle flex justify-between items-center text-xs font-bold text-[#2D2926]">
                      <span className="uppercase text-[10px] tracking-wider text-gray-500">Confirmación de Cita:</span>
                      <span className="text-xs text-[#C5A059] font-mono uppercase tracking-widest">Sin costo de envío en CDMX</span>
                    </div>
                  </div>

                  <div className="bg-[#2D2926] text-white p-4 border border-white/10 text-xs flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#C5A059] uppercase tracking-wider text-[10px]">Garantía de Confort & Seguridad</p>
                      <p className="mt-0.5 leading-relaxed text-gray-300">
                        No realizas ningún pago por adelantado para solicitar disponibilidad. Pagas directamente a la terapeuta o por transferencia al finalizar tu sesión.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="p-4 bg-white border-t border-subtle flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="px-4 py-2.5 border border-subtle bg-[#F9F6F2] hover:bg-[#EFEADF] text-[#2D2926] text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Regresar
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as 2 | 3)}
                className="px-6 py-2.5 bg-[#2D2926] hover:bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 shadow-md"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <a
                href="https://www.essenya.app/cliente"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsSuccess(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#E3C27E] hover:from-[#D8B46E] hover:to-[#F0D597] text-[#120E0D] text-[10px] font-bold uppercase tracking-[0.15em] transition-all shadow-md flex items-center gap-2 transform active:scale-95 rounded-sm"
              >
                <User className="w-4 h-4 text-[#120E0D]" /> Portal Cliente (Completar Cita)
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
