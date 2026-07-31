import React from 'react';
import { CoverageSection } from '../components/home/CoverageSection';
import { MapPin, ShieldCheck, Clock } from 'lucide-react';

export const CoveragePage: React.FC = () => {
  return (
    <main className="pt-28 pb-20 min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#2D2926] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Zonas Residenciales
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white">
            Cobertura en Ciudad de <i className="font-normal text-[#C5A059]">México</i>
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Llegamos puntualmente a residencias y departamentos privados en Polanco, Lomas, Condesa, Roma, Santa Fe, Interlomas, Coyoacán, San Ángel y Pedregal.
          </p>
        </div>
      </div>

      <CoverageSection />
    </main>
  );
};
