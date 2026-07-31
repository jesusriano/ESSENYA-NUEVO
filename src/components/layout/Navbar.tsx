import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import essenyaLogo from '../../assets/images/regenerated_image_1785444805870.png';

interface NavbarProps {
  onOpenBookingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBookingModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [explorarOpen, setExplorarOpen] = useState(false);
  const location = useLocation();

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setExplorarOpen(false);
  }, [location.pathname]);

  const explorarLinks = [
    { name: 'Cobertura CDMX', path: '/cobertura' },
    { name: 'Nosotros & Terapeutas', path: '/nosotros' },
    { name: 'Tarjetas de Regalo', path: '/regalos' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-[#1E1914] to-black border-y-2 border-[#C5A059] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={essenyaLogo}
            alt="ESSENYA"
            className="h-12 sm:h-14 w-auto object-contain border-2 border-[#C5A059] rounded-sm transition-transform group-hover:scale-105 shadow-md"
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-serif text-[#C5A059] text-base font-bold tracking-widest leading-none">
              ESSENYA
            </span>
            <span className="text-[9px] text-gray-300 uppercase tracking-widest mt-0.5">
              Bienestar de Lujo
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <Link
            to="/"
            className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors relative py-1 ${
              location.pathname === '/' ? 'text-[#C5A059]' : 'text-gray-200 hover:text-[#C5A059]'
            }`}
          >
            INICIO
            {location.pathname === '/' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]"></span>
            )}
          </Link>

          <Link
            to="/servicios"
            className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors relative py-1 ${
              location.pathname === '/servicios' ? 'text-[#C5A059]' : 'text-gray-200 hover:text-[#C5A059]'
            }`}
          >
            SERVICIOS
            {location.pathname === '/servicios' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]"></span>
            )}
          </Link>

          {/* EXPLORAR Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setExplorarOpen(true)}
            onMouseLeave={() => setExplorarOpen(false)}
          >
            <button
              type="button"
              onClick={() => setExplorarOpen(!explorarOpen)}
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-200 hover:text-[#C5A059] transition-colors py-1 flex items-center gap-1 focus:outline-none"
            >
              EXPLORAR <ChevronDown className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>

            {explorarOpen && (
              <div className="absolute top-full left-0 w-56 bg-[#120E0D] border border-[#C5A059]/40 shadow-2xl py-2 mt-1 animate-in fade-in duration-150">
                {explorarLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setExplorarOpen(false)}
                    className="block px-4 py-2.5 text-[10px] uppercase tracking-widest text-gray-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors font-semibold"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/preguntas"
            className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors relative py-1 ${
              location.pathname === '/preguntas' ? 'text-[#C5A059]' : 'text-gray-200 hover:text-[#C5A059]'
            }`}
          >
            FAQ
            {location.pathname === '/preguntas' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]"></span>
            )}
          </Link>

          <Link
            to="/contacto"
            className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors relative py-1 ${
              location.pathname === '/contacto' ? 'text-[#C5A059]' : 'text-gray-200 hover:text-[#C5A059]'
            }`}
          >
            CONTACTO
            {location.pathname === '/contacto' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]"></span>
            )}
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 rounded-sm shadow-md transition-all transform hover:scale-105"
            title="Contacto por WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            onClick={onOpenBookingModal}
            className="px-5 py-2 bg-gradient-to-r from-[#C5A059] to-[#E3C27E] hover:from-[#D8B46E] hover:to-[#F0D597] text-[#120E0D] text-[10px] font-bold uppercase tracking-[0.18em] rounded-sm shadow-md transition-all cursor-pointer transform hover:scale-105"
          >
            RESERVAR AHORA
          </button>

          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#C5A059] focus:outline-none"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#C5A059]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#120E0D] border-b border-[#C5A059]/40 px-6 pt-4 pb-6 shadow-2xl animate-in slide-in-from-top-2 text-white">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest font-semibold py-2 text-[#C5A059] border-b border-white/10"
            >
              INICIO
            </Link>
            <Link
              to="/servicios"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest font-semibold py-2 text-gray-200 hover:text-[#C5A059]"
            >
              SERVICIOS
            </Link>
            <div className="pl-3 space-y-2 border-l border-[#C5A059]/40">
              {explorarLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[11px] uppercase tracking-wider text-gray-400 hover:text-white py-1"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Link
              to="/preguntas"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest font-semibold py-2 text-gray-200 hover:text-[#C5A059]"
            >
              PREGUNTAS FRECUENTES
            </Link>
            <Link
              to="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest font-semibold py-2 text-gray-200 hover:text-[#C5A059]"
            >
              CONTACTO
            </Link>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-3 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 rounded-sm shadow-md"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>RESERVAR POR WHATSAPP</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#C5A059] to-[#E3C27E] text-[#120E0D] font-bold text-xs uppercase tracking-widest text-center shadow-md rounded-sm"
            >
              FORMULARIO DE RESERVA
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
