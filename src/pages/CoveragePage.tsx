import { PageHeader } from '../components/common/PageHeader';
import React from 'react';
import { CoverageSection } from '../components/home/CoverageSection';
import { MapPin, ShieldCheck, Clock } from 'lucide-react';

export const CoveragePage: React.FC = () => {
  return (
    <main className="pb-20 min-h-screen bg-[#FDFBF7]">
      <PageHeader
        eyebrow="Zonas Residenciales"
        title={<>Cobertura en Ciudad de <i className="font-normal text-[#C5A059]">México</i></>}
        text="Tenemos cobertura en la Ciudad de México y su área metropolitana. Llegamos puntualmente a residencias y departamentos privados en Polanco, Lomas, Condesa, Roma, Santa Fe, Interlomas, Coyoacán, San Ángel, Pedregal y Atizapán de Zaragoza (Condado de Sayavedra y Esmeralda)."
      />

      <CoverageSection />
    </main>
  );
};
