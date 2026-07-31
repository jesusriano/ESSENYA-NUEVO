import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Shield, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { COVERAGE_ZONES } from '../../constants/data';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import essenyaLogo from '../../assets/images/regenerated_image_1785444805870.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2D2926] text-[#FDFBF7] pt-16 pb-0 border-t border-[#C5A059]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={essenyaLogo}
                alt="ESSENYA Logo"
                className="h-16 sm:h-20 w-auto object-contain rounded-sm border border-[#C5A059]/30 shadow-md"
              />
              <div>
                <h3 className="font-serif text-2xl font-light italic tracking-[0.15em] text-[#FDFBF7]">
                  ESSENYA
                </h3>
                <p className="text-[9px] tracking-[0.25em] font-sans font-bold text-[#C5A059] uppercase">
                  SPA DE LUJO A DOMICILIO CDMX
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              Llevamos la serenidad y la excelencia de un spa de primer nivel directamente a la privacidad de tu residencia en la Ciudad de México. Terapeutas certificadas, camilla ergonómica y aceites de primera calidad.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] uppercase tracking-widest text-[#C5A059]">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 border border-white/10">
                <Shield className="w-3.5 h-3.5 text-[#C5A059]" /> Terapeutas Verificadas
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> Lunes a Domingo 8am - 10pm
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-light italic text-[#C5A059] mb-4 tracking-wider border-b border-white/10 pb-2">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider text-gray-300">
              <li>
                <Link to="/" className="hover:text-[#C5A059] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="hover:text-[#C5A059] transition-colors">
                  Catálogo de Masajes
                </Link>
              </li>
              <li>
                <a href="/#calculador" className="hover:text-[#C5A059] transition-colors">
                  Cotizador Personalizado
                </a>
              </li>
              <li>
                <Link to="/cobertura" className="hover:text-[#C5A059] transition-colors">
                  Zonas de Cobertura CDMX
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="hover:text-[#C5A059] transition-colors">
                  Nuestra Filosofía
                </Link>
              </li>
              <li>
                <Link to="/regalos" className="hover:text-[#C5A059] transition-colors">
                  Tarjetas de Regalo
                </Link>
              </li>
              <li>
                <Link to="/preguntas" className="hover:text-[#C5A059] transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Coverage Zones */}
          <div>
            <h4 className="font-serif text-sm font-light italic text-[#C5A059] mb-4 tracking-wider border-b border-white/10 pb-2">
              Zonas Destacadas
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {COVERAGE_ZONES.map((zone) => (
                <li key={zone.id} className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-[#C5A059] shrink-0" />
                  <span>{zone.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hotline */}
          <div>
            <h4 className="font-serif text-sm font-light italic text-[#C5A059] mb-4 tracking-wider border-b border-white/10 pb-2">
              Atención Directa
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white hover:text-[#25D366] transition-colors font-bold bg-[#120E0D] hover:bg-[#120E0D]/90 p-3.5 border border-[#25D366]/40 rounded-sm shadow-md group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center group-hover:bg-[#25D366]/30 transition-colors">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                </div>
                <span>Reservar por WhatsApp</span>
              </a>
              <div className="flex items-start gap-2 text-xs text-gray-400 pt-1">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-200 uppercase tracking-wider text-[10px]">Horario de Citas:</p>
                  <p>Lunes a Domingo: 8:00 – 22:00 hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>contacto@essenya.mx</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Geometric Bar */}
      <div className="bg-[#1E1B18] text-gray-400 py-4 px-8 border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-[0.3em]">
          <span>Ciudad de México — Wellness Concierge</span>
          <div className="flex gap-6 text-[#C5A059] font-bold">
            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a>
            <span>•</span>
            <Link to="/servicios" className="hover:underline">Servicios</Link>
            <span>•</span>
            <Link to="/cobertura" className="hover:underline">CDMX</Link>
          </div>
          <span>© {new Date().getFullYear()} ESSENYA SPA</span>
        </div>
      </div>
    </footer>
  );
};
