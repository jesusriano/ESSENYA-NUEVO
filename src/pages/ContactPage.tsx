import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, ShieldCheck, Check, User, Calendar } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-28 pb-20 min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#2D2926] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Contacto Directo
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white">
            Estamos Listos para <i className="font-normal text-[#C5A059]">Atenderte</i>
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ponte en contacto con nuestro equipo de coordinadoras para dudas, eventos corporativos, masajes en grupo o reservas especiales.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-subtle shadow-sm space-y-6">
              <h3 className="font-serif font-light text-xl text-[#2D2926] border-b border-subtle pb-3 italic">
                Información de Contacto
              </h3>

              <div className="space-y-4 text-xs text-[#2D2926]">
                <a
                  href="https://www.essenya.app/cliente"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[#120E0D] hover:bg-[#120E0D]/90 transition-colors rounded-sm shadow-md border border-[#C5A059]/40 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center group-hover:bg-[#C5A059]/30 transition-colors">
                    <User className="w-5 h-5 text-[#C5A059] shrink-0" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#C5A059] uppercase tracking-widest font-bold">Reserva Directa</span>
                    <span className="font-bold text-sm tracking-wide text-white">Portal Cliente</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3.5 bg-[#F9F6F2] border border-subtle">
                  <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#2D2926] block">Horario de Atención:</span>
                    <span className="text-[11px] text-gray-600">Lunes a Domingo: 9:00 AM – 8:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F9F6F2] border border-subtle">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#2D2926] block">Zonas Principales CDMX:</span>
                    <span className="text-[11px] text-gray-600">Polanco, Lomas, Condesa, Roma, Santa Fe, Interlomas, Coyoacán, Pedregal.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F9F6F2] border border-subtle">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#2D2926] block">Correo Electrónico:</span>
                    <span className="text-[11px] text-gray-600">contacto@essenya.mx</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-white p-8 border border-subtle shadow-md space-y-6">
            <h3 className="font-serif font-light text-2xl text-[#2D2926]">
              Envíanos un Mensaje
            </h3>

            {submitted ? (
              <div className="bg-[#F9F6F2] p-6 border border-subtle text-center space-y-4">
                <Check className="w-8 h-8 text-[#C5A059] mx-auto" />
                <h4 className="font-serif font-light text-lg text-[#2D2926]">¡Mensaje Recibido!</h4>
                <p className="text-xs text-gray-600">
                  Hemos registrado tus datos. También puedes agendar o gestionar tu cita directamente en nuestro Portal Cliente.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href="https://www.essenya.app/cliente"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#C5A059] hover:bg-[#D8B46E] text-[#120E0D] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#120E0D]" />
                    Ir al Portal Cliente
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#2D2926] text-white text-[10px] font-bold uppercase tracking-[0.2em]"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1">
                    Tu Nombre Completo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carmen Rodríguez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-subtle bg-[#F9F6F2] text-xs text-[#2D2926] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1">
                    Teléfono de Contacto:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 55 9876 5432"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-subtle bg-[#F9F6F2] text-xs text-[#2D2926] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1">
                    Colonia / Zona de CDMX:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Lomas Altas, Polanco"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full p-3 border border-subtle bg-[#F9F6F2] text-xs text-[#2D2926] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1">
                    ¿En qué podemos ayudarte?
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Cuéntanos la fecha estimada o el tipo de servicio que requieres..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-subtle bg-[#F9F6F2] text-xs text-[#2D2926] focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-[#2D2926] hover:bg-[#C5A059] text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#C5A059]" />
                    Enviar Consulta
                  </button>

                  <a
                    href="https://www.essenya.app/cliente"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 bg-[#C5A059] hover:bg-[#D8B46E] text-[#120E0D] font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2 rounded-sm"
                  >
                    <User className="w-4 h-4 text-[#120E0D]" />
                    Portal Cliente (Reservar Cita)
                  </a>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </main>
  );
};
