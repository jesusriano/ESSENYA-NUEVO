import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALCALDIAS_COBERTURA, coloniasDeAlcaldia, zoneIdDeAlcaldia, leerDireccionWeb, guardarDireccionWeb } from '../../constants/direcciones';

import { X, Calendar, Clock, MapPin, User, Check, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { MASSAGE_SERVICES, ADD_ONS, COVERAGE_ZONES } from '../../constants/data';
import { BOOKING_EVENT, BookingRequest } from '../../utils/booking';
import { buildWhatsAppUrl, formatBookingDate } from '../../utils/whatsapp';
import { decorateUrl } from '../../utils/attribution';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

const PORTAL_URL = 'https://www.essenya.app/cliente';
const MIN_BOOKING_HOURS = 5;
const MIN_CANCELLATION_HOURS = 4;

const TIME_OPTIONS = [
  '09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM', '08:00 PM'
];

const formatMXN = (n: number) => `$${n.toLocaleString('es-MX')}`;

/** Fecha local en formato AAAA-MM-DD (toISOString usa UTC y de noche cambia de día). */
const toLocalISO = (d: Date): string => {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

// Convierte fecha y horario ("06:00 PM") en una fecha real
const parseBookingDateTime = (dateStr: string, slotStr: string): Date => {
  const [time, modifier] = slotStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

const getHoursUntilBooking = (dateStr: string, slotStr: string): number => {
  if (!dateStr || !slotStr) return 0;
  return (parseBookingDateTime(dateStr, slotStr).getTime() - Date.now()) / (1000 * 60 * 60);
};

const isSlotValid = (dateStr: string, slotStr: string): boolean =>
  getHoursUntilBooking(dateStr, slotStr) >= MIN_BOOKING_HOURS;

const getCancellationDeadline = (dateStr: string, slotStr: string): string => {
  if (!dateStr || !slotStr) return '';
  const deadline = new Date(parseBookingDateTime(dateStr, slotStr).getTime() - MIN_CANCELLATION_HOURS * 60 * 60 * 1000);
  return deadline.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

/** Los extras de 15 y 30 min del mismo tipo no se pueden juntar: se elige uno u otro. */
const addOnGroup = (id: string) => id.replace(/-(15|30)$/, '');

type Channel = 'whatsapp' | 'portal';

interface BookingFlowProps {
  request: BookingRequest;
  onClose: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ request, onClose }) => {
  const todayStr = useMemo(() => toLocalISO(new Date()), []);

  // Primer día y horario que cumple las 5 horas de anticipación
  const initialValues = useMemo(() => {
    const validToday = TIME_OPTIONS.find((slot) => isSlotValid(todayStr, slot));
    if (validToday) return { date: todayStr, timeSlot: validToday };
    return { date: toLocalISO(new Date(Date.now() + 86400000)), timeSlot: TIME_OPTIONS[0] };
  }, [todayStr]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    MASSAGE_SERVICES.some((s) => s.id === request.serviceId) ? (request.serviceId as string) : MASSAGE_SERVICES[0].id
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(
    [60, 90, 120].includes(request.duration ?? 0) ? (request.duration as number) : 90
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(
    (request.addOnIds ?? []).filter((id) => ADD_ONS.some((a) => a.id === id))
  );
  const [date, setDate] = useState<string>(initialValues.date);
  const [timeSlot, setTimeSlot] = useState<string>(initialValues.timeSlot);
  // Dirección: primero alcaldía, luego colonia de esa alcaldía y la calle. Se recuerda la última usada.
  const [direccionInicial] = useState(() => leerDireccionWeb());
  const [alcaldia, setAlcaldia] = useState<string>(() => {
    if (ALCALDIAS_COBERTURA.some((a) => a.alcaldia === direccionInicial.alcaldia)) return direccionInicial.alcaldia;
    return ALCALDIAS_COBERTURA.find((a) => a.zoneId === request.zoneId)?.alcaldia ?? ALCALDIAS_COBERTURA[0].alcaldia;
  });
  const [colonia, setColonia] = useState<string>(direccionInicial.colonia);
  const [escribiendoColonia, setEscribiendoColonia] = useState<boolean>(
    () => direccionInicial.colonia !== '' && !coloniasDeAlcaldia(alcaldia).includes(direccionInicial.colonia)
  );
  const [calle, setCalle] = useState<string>(direccionInicial.calle);
  const selectedZoneId = zoneIdDeAlcaldia(alcaldia);
  const neighborhood = [calle.trim(), colonia.trim() ? `Col. ${colonia.trim()}` : '', alcaldia].filter(Boolean).join(', ');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [acceptedPolicies, setAcceptedPolicies] = useState<boolean>(true);
  const [sentVia, setSentVia] = useState<Channel | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Al cambiar de paso, el contenido vuelve al inicio (si no, el paso 3 arrancaba a media pantalla)
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step, sentVia]);

  // Cerrar con Escape y evitar que la página de atrás se desplace
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const currentService = MASSAGE_SERVICES.find((s) => s.id === selectedServiceId) || MASSAGE_SERVICES[0];
  const priceFor = (duration: number) =>
    (currentService.prices.find((p) => p.durationMinutes === duration) || currentService.prices[0]).priceMXN;
  const servicePrice = priceFor(selectedDuration);
  const chosenAddOns = selectedAddOns
    .map((id) => ADD_ONS.find((a) => a.id === id))
    .filter((a): a is (typeof ADD_ONS)[number] => Boolean(a));
  const grandTotal = servicePrice + chosenAddOns.reduce((sum, a) => sum + a.price, 0);
  const currentZone = COVERAGE_ZONES.find((z) => z.id === selectedZoneId) || COVERAGE_ZONES[0];

  const cambiarAlcaldia = (nueva: string) => {
    setAlcaldia(nueva);
    setColonia('');
    setEscribiendoColonia(false);
  };

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a !== id));
    } else {
      setSelectedAddOns([...selectedAddOns.filter((a) => addOnGroup(a) !== addOnGroup(id)), id]);
    }
  };

  const hoursDiff = getHoursUntilBooking(date, timeSlot);
  const isSelectedSlotAllowed = hoursDiff >= MIN_BOOKING_HOURS;
  const cancellationLimitText = getCancellationDeadline(date, timeSlot);
  const validSlotsCount = TIME_OPTIONS.filter((t) => isSlotValid(date, t)).length;

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (!isSlotValid(newDate, timeSlot)) {
      const firstValid = TIME_OPTIONS.find((t) => isSlotValid(newDate, t));
      if (firstValid) setTimeSlot(firstValid);
    }
  };

  // --- Lo que se envía: el mismo resumen por WhatsApp o hacia el portal ---
  const whatsappUrl = buildWhatsAppUrl({
    serviceName: currentService.title,
    durationMinutes: selectedDuration,
    servicePriceMXN: servicePrice,
    addOns: chosenAddOns.map((a) => ({ name: a.name, price: a.price })),
    totalPriceMXN: grandTotal,
    date,
    timeSlot,
    zoneName: currentZone.name,
    neighborhood: neighborhood.trim(),
    clientName: clientName.trim(),
    clientPhone: clientPhone.trim(),
    notes: notes.trim(),
  });

  const portalUrl = decorateUrl(PORTAL_URL, {
    ess_servicio: currentService.id,
    ess_duracion: String(selectedDuration),
    ess_extras: selectedAddOns.join(','),
    ess_fecha: date,
    // Hora en 24 h (HH:mm) y zona por nombre: es el formato que lee el portal. Nunca se envían nombre, teléfono ni dirección.
    ess_hora: (() => {
      const t = parseBookingDateTime(date, timeSlot);
      return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
    })(),
    ess_zona: currentZone.name,
  });

  const goNext = () => {
    if (step === 2) {
      if (!clientName.trim() || !clientPhone.trim() || !calle.trim() || !colonia.trim()) {
        setErrorMsg('Por favor ingresa tu Nombre, Teléfono, Colonia y Calle para continuar.');
        return;
      }
      if (clientPhone.replace(/\D/g, '').length < 10) {
        setErrorMsg('Escribe tu teléfono a 10 dígitos para poder confirmarte la cita.');
        return;
      }
      if (getHoursUntilBooking(date, timeSlot) < MIN_BOOKING_HOURS) {
        setErrorMsg(`Política de reserva: se requiere un mínimo de ${MIN_BOOKING_HOURS} horas de antelación. Selecciona un horario o fecha posterior.`);
        return;
      }
    }
    guardarDireccionWeb({ alcaldia, colonia: colonia.trim(), calle: calle.trim() });
    setErrorMsg('');
    setStep((step + 1) as 2 | 3);
  };

  /** Antes de enviar por cualquier canal se exige aceptar las políticas. */
  const guardSend = (channel: Channel) => (e: React.MouseEvent) => {
    if (!acceptedPolicies) {
      e.preventDefault();
      setErrorMsg('Debes marcar la casilla aceptando la política de reserva (mínimo 5 horas) y cancelación (mínimo 4 horas antes).');
      return;
    }
    setErrorMsg('');
    setSentVia(channel);
  };

  const stepTitle = step === 1 ? 'Elección de Servicio' : step === 2 ? 'Fecha, Hora y Ubicación' : 'Resumen y Envío';

  const errorBox = errorMsg && (
    <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs flex items-center justify-between rounded-sm">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
        <span>{errorMsg}</span>
      </div>
      <button type="button" aria-label="Cerrar aviso" onClick={() => setErrorMsg('')} className="text-red-900 font-bold ml-2">×</button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2D2926]/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Reserva de masaje"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div data-service={currentService.id} className="relative w-full max-w-2xl bg-[#FDFBF7] shadow-2xl overflow-hidden border border-subtle max-h-[92vh] flex flex-col">

        {/* Encabezado */}
        <div className="bg-[#2D2926] p-5 text-[#FDFBF7] flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#C5A059] bg-[#2D2926] text-[#C5A059] flex items-center justify-center font-serif text-lg font-light italic">E</div>
            <div>
              <h3 className="font-serif text-lg font-light italic text-white leading-tight">Reserva de Masaje</h3>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-widest">
                {sentVia ? 'Solicitud lista' : `Paso ${step} de 3 — ${stepTitle}`}
              </p>
            </div>
          </div>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="p-2 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div ref={bodyRef} className="p-6 overflow-y-auto space-y-6 flex-1">
          {sentVia ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 border border-[#C5A059] bg-[#2D2926] text-[#C5A059] flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              {sentVia === 'whatsapp' ? (
                <>
                  <h4 className="font-serif text-2xl font-light text-[#2D2926]">
                    Abrimos <i className="font-normal text-[#C5A059]">WhatsApp</i> con tu solicitud
                  </h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Ya va escrita con tu masaje, duración, extras, total, fecha, zona y tus datos.
                    <strong> Solo presiona “Enviar” en WhatsApp</strong> para que la recibamos y te confirmemos la terapeuta.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1FB457] transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" /> Abrir WhatsApp de nuevo
                  </a>
                </>
              ) : (
                <>
                  <h4 className="font-serif text-2xl font-light text-[#2D2926]">
                    Continúa en el <i className="font-normal text-[#C5A059]">Portal Cliente</i>
                  </h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Se abrió el Portal Cliente en otra pestaña para que completes tu reserva. Si no se abrió, toca el botón.
                  </p>
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A059] text-[#120E0D] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D8B46E] transition-colors"
                  >
                    <User className="w-4 h-4" /> Ir al Portal Cliente
                  </a>
                </>
              )}
              <div>
                <button type="button" onClick={onClose} className="mt-2 px-6 py-2.5 bg-[#2D2926] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors">
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* PASO 1: masaje, duración y extras (con precios) */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                      01. Selecciona el Tipo de Masaje:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MASSAGE_SERVICES.map((s) => {
                        const active = selectedServiceId === s.id;
                        const price = (s.prices.find((p) => p.durationMinutes === selectedDuration) || s.prices[0]).priceMXN;
                        return (
                          <button
                            type="button"
                            key={s.id}
                            aria-pressed={active}
                            onClick={() => setSelectedServiceId(s.id)}
                            className={`text-left p-3.5 border transition-all ${
                              active ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-xs' : 'bg-white text-[#2D2926] border-subtle hover:bg-[#F9F6F2]'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h5 className="font-serif font-light text-sm">{s.title}</h5>
                              <span className={`text-xs font-bold shrink-0 ${active ? 'text-[#E3C27E]' : 'text-[#8A6A24]'}`}>{formatMXN(price)}</span>
                            </div>
                            <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${active ? 'text-gray-300' : 'text-gray-500'}`}>
                              {s.shortDescription}
                            </p>
                          </button>
                        );
                      })}
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
                          aria-pressed={selectedDuration === dur}
                          onClick={() => setSelectedDuration(dur)}
                          className={`p-3 border text-center transition-all ${
                            selectedDuration === dur ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-xs' : 'bg-white text-[#2D2926] border-subtle hover:bg-[#F9F6F2]'
                          }`}
                        >
                          <span className="block font-bold text-sm uppercase tracking-wider">{dur} min</span>
                          <span className={`block text-xs font-bold mt-0.5 ${selectedDuration === dur ? 'text-white' : 'text-[#8A6A24]'}`}>
                            {formatMXN(priceFor(dur))}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                      03. Opcional — Agrega un Extra:
                    </label>
                    <div className="space-y-2">
                      {ADD_ONS.map((addon) => {
                        const isSelected = selectedAddOns.includes(addon.id);
                        return (
                          <button
                            type="button"
                            key={addon.id}
                            aria-pressed={isSelected}
                            onClick={() => toggleAddOn(addon.id)}
                            className={`w-full text-left p-3 border flex items-center justify-between transition-all ${
                              isSelected ? 'bg-[#2D2926] text-white border-[#2D2926]' : 'bg-white text-[#2D2926] border-subtle hover:bg-[#F9F6F2]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 border flex items-center justify-center ${isSelected ? 'bg-[#C5A059] text-white border-[#C5A059]' : 'border-subtle bg-white'}`}>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <p className="font-semibold text-xs uppercase tracking-wider">{addon.name}</p>
                                <p className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{addon.description}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-bold shrink-0 ml-2 ${isSelected ? 'text-[#E3C27E]' : 'text-[#8A6A24]'}`}>+{formatMXN(addon.price)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: fecha, hora, ubicación y datos */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-[#C5A059]/10 border border-[#C5A059]/40 p-3.5 text-xs text-[#2D2926] space-y-2 rounded-sm">
                    <p className="font-bold uppercase tracking-wider text-[10px] text-[#C5A059] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Políticas Obligatorias de Servicio
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-relaxed">
                      <div className="bg-white/90 p-2.5 border border-[#C5A059]/20 rounded-sm">
                        <span className="font-bold text-[#2D2926] block flex items-center gap-1"><Clock className="w-3 h-3 text-[#C5A059]" /> Reserva Mínima:</span>
                        Al menos <strong>5 horas de antelación</strong> para garantizar asignación de terapeuta certificada y sanitización de camilla.
                      </div>
                      <div className="bg-white/90 p-2.5 border border-[#C5A059]/20 rounded-sm">
                        <span className="font-bold text-[#2D2926] block flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#C5A059]" /> Cancelación Flexible:</span>
                        Sin costo hasta <strong>4 horas antes</strong> del servicio. Cancelaciones con menos de 4 horas causan cargo de traslado.
                      </div>
                    </div>
                  </div>

                  {errorBox}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> Fecha Deseada:
                      </label>
                      <input type="date" min={todayStr} value={date} onChange={(e) => handleDateChange(e.target.value)} className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] font-semibold focus:outline-none" />
                      {validSlotsCount === 0 && (
                        <p className="text-[10px] text-amber-700 mt-1 font-medium">⚠️ Ya no hay horarios disponibles con 5 hrs de anticipación para este día. Elige una fecha posterior.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> Horario Preferido:
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className={`w-full p-3 border text-xs font-semibold focus:outline-none ${isSelectedSlotAllowed ? 'border-subtle bg-white text-[#2D2926]' : 'border-amber-400 bg-amber-50 text-amber-900'}`}
                      >
                        {TIME_OPTIONS.map((t) => {
                          const valid = isSlotValid(date, t);
                          return <option key={t} value={t} disabled={!valid}>{t} {!valid ? '(No disponible — mín. 5 hrs antelación)' : ''}</option>;
                        })}
                      </select>
                    </div>
                  </div>

                  {isSelectedSlotAllowed ? (
                    <div className="p-3 bg-emerald-50/90 border border-emerald-300/80 text-emerald-900 text-xs rounded-sm space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Horario válido: reservando con {hoursDiff.toFixed(1)} horas de antelación</span>
                      </div>
                      <p className="text-[10px] text-emerald-800">• Cancelación sin costo hasta el <strong>{cancellationLimitText}</strong> (4 horas antes del servicio).</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-sm space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-800">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Horario fuera de política (requiere mínimo 5 horas de antelación)</span>
                      </div>
                      <p className="text-[10px] text-amber-700">El horario seleccionado está a solo {Math.max(0, hoursDiff).toFixed(1)} horas. Selecciona un horario con mayor margen o el día de mañana.</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> Alcaldía / Municipio:
                    </label>
                    <select id="booking-alcaldia" name="address-level2" autoComplete="address-level2" value={alcaldia} onChange={(e) => cambiarAlcaldia(e.target.value)} className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none font-semibold">
                      {ALCALDIAS_COBERTURA.map((a) => (
                        <option key={a.alcaldia} value={a.alcaldia}>{a.alcaldia}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking-colonia" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">Colonia:</label>
                    <select id="booking-colonia" value={escribiendoColonia ? '__otra__' : colonia} onChange={(e) => {
                      if (e.target.value === '__otra__') { setEscribiendoColonia(true); setColonia(''); }
                      else { setEscribiendoColonia(false); setColonia(e.target.value); }
                    }} className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none">
                      <option value="">Elige una colonia</option>
                      {coloniasDeAlcaldia(alcaldia).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="__otra__">Mi colonia no aparece</option>
                    </select>
                    {escribiendoColonia && (
                      <input type="text" name="address-level3" autoComplete="address-level3" placeholder="Escribe tu colonia" value={colonia} onChange={(e) => setColonia(e.target.value)} className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none mt-2" />
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-calle" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">Calle, número y referencias:</label>
                    <input id="booking-calle" type="text" name="address-line1" autoComplete="address-line1" placeholder="Ej. Av. Horacio 1200, Apto 4B" value={calle} onChange={(e) => setCalle(e.target.value)} className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">Tu Nombre Completo:</label>
                      <input type="text" autoComplete="name" placeholder="Ej. María Fernanda Morales" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">Teléfono de Contacto:</label>
                      <input type="tel" autoComplete="tel" inputMode="tel" placeholder="Ej. 55 1234 5678" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">Notas Especiales / Indicaciones:</label>
                    <textarea rows={2} placeholder="Anota si hay estacionamiento para la terapeuta o si requieres factura." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-3 border border-subtle bg-white text-xs text-[#2D2926] focus:outline-none" />
                  </div>
                </div>
              )}

              {/* PASO 3: resumen con precios y las dos formas de enviar */}
              {step === 3 && (
                <div className="space-y-5">
                  {errorBox}

                  <div className="bg-[#F9F6F2] p-5 border border-subtle space-y-3">
                    <h4 className="font-serif font-light text-base text-[#2D2926] border-b border-subtle pb-2">Resumen de tu Experiencia ESSENYA</h4>

                    <div className="flex justify-between items-start gap-3 text-xs">
                      <span className="text-[#2D2926] font-semibold">{currentService.title} · {selectedDuration} min</span>
                      <span className="font-bold text-[#2D2926] shrink-0">{formatMXN(servicePrice)}</span>
                    </div>
                    {chosenAddOns.map((a) => (
                      <div key={a.id} className="flex justify-between items-start gap-3 text-xs">
                        <span className="text-gray-600">{a.name}</span>
                        <span className="font-bold text-[#2D2926] shrink-0">{formatMXN(a.price)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-subtle flex justify-between items-center">
                      <span className="uppercase text-[10px] tracking-wider text-gray-500 font-bold">Total estimado</span>
                      <span className="font-serif text-xl text-[#2D2926]">{formatMXN(grandTotal)} <span className="text-[10px] font-sans text-gray-500">MXN</span></span>
                    </div>

                    <div className="pt-3 border-t border-subtle space-y-1.5 text-xs">
                      <div className="flex justify-between gap-3"><span className="text-gray-500">Fecha y horario:</span><span className="font-bold text-[#2D2926] text-right">{formatBookingDate(date)} · {timeSlot}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">Ubicación:</span><span className="font-bold text-[#2D2926] text-right">{currentZone.name} — {neighborhood}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">Cliente:</span><span className="font-bold text-[#2D2926] text-right">{clientName} ({clientPhone})</span></div>
                      {currentZone.estimatedArrival && (
                        <div className="flex justify-between gap-3"><span className="text-gray-500">Traslado:</span><span className="font-bold text-emerald-800 text-right">Sin costo en esta zona</span></div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 border border-[#C5A059]/40 space-y-2.5 rounded-sm">
                    <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-[#C5A059]" />
                      <span>Política de Cancelación (Mínimo 4 Horas Antes)</span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      • <strong>Cancelación gratuita:</strong> hasta el <strong>{cancellationLimitText}</strong> (4 horas antes del servicio) para cancelar o reprogramar sin costo.<br />
                      • <strong>Cancelación tardía o inasistencia:</strong> con menos de 4 horas causa cargo administrativo de honorarios de la terapeuta asignada.
                    </p>
                    <label className="flex items-start gap-2.5 pt-2 border-t border-[#C5A059]/20 cursor-pointer select-none">
                      <input type="checkbox" checked={acceptedPolicies} onChange={(e) => setAcceptedPolicies(e.target.checked)} className="mt-0.5 accent-[#C5A059] w-4 h-4 rounded cursor-pointer" />
                      <span className="text-[11px] text-[#2D2926] font-medium leading-snug">
                        Entiendo y acepto la política de <strong>reserva con mínimo 5 horas de anticipación</strong> y <strong>cancelación sin costo con al menos 4 horas de anticipación</strong>.
                      </span>
                    </label>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">¿Cómo quieres enviar tu solicitud?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track="reserva_whatsapp"
                        data-track-label="Reserva por WhatsApp"
                        onClick={guardSend('whatsapp')}
                        className="flex flex-col items-center justify-center gap-1 px-4 py-4 bg-[#25D366] hover:bg-[#1FB457] text-white text-center transition-colors shadow-md"
                      >
                        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]"><WhatsAppIcon className="w-4 h-4" /> Enviar por WhatsApp</span>
                        <span className="text-[10px] opacity-90 normal-case tracking-normal">Va todo escrito: masaje, total, fecha y tus datos</span>
                      </a>
                      <a
                        href={portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={guardSend('portal')}
                        className="flex flex-col items-center justify-center gap-1 px-4 py-4 bg-[#2D2926] hover:bg-[#C5A059] hover:text-[#120E0D] text-white text-center transition-colors shadow-md"
                      >
                        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]"><User className="w-4 h-4 text-[#C5A059]" /> Ir al Portal Cliente</span>
                        <span className="text-[10px] opacity-80 normal-case tracking-normal">Completa y paga tu reserva en el portal</span>
                      </a>
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

        {/* Pie: total a la vista y navegación */}
        {!sentVia && (
          <div className="p-4 bg-white border-t border-subtle flex items-center justify-between gap-3 shrink-0">
            {step > 1 ? (
              <button type="button" onClick={() => { setErrorMsg(''); setStep((step - 1) as 1 | 2); }} className="px-4 py-2.5 border border-subtle bg-[#F9F6F2] hover:bg-[#EFEADF] text-[#2D2926] text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Regresar
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-4">
              <div className="text-right leading-tight">
                <span className="block text-[9px] uppercase tracking-widest text-gray-500">Total estimado</span>
                <span className="font-serif text-lg text-[#2D2926]">{formatMXN(grandTotal)}</span>
              </div>
              {step < 3 && (
                <button type="button" onClick={goNext} className="px-6 py-2.5 bg-[#2D2926] hover:bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 shadow-md">
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Único modal de reserva del sitio. Se abre con abrirReserva() desde cualquier botón "Reservar"
 * y, al abrirse, parte con lo que el cliente ya haya elegido (masaje, duración, extras, zona).
 */
export const BookingModal: React.FC = () => {
  const [session, setSession] = useState<{ request: BookingRequest; id: number } | null>(null);

  useEffect(() => {
    const open = (e: Event) => setSession({ request: (e as CustomEvent<BookingRequest>).detail ?? {}, id: Date.now() });
    window.addEventListener(BOOKING_EVENT, open);
    return () => window.removeEventListener(BOOKING_EVENT, open);
  }, []);

  if (!session) return null;
  return <BookingFlow key={session.id} request={session.request} onClose={() => setSession(null)} />;
};
