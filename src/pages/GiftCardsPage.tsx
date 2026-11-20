import { PageHeader } from '../components/common/PageHeader';
import React from 'react';
import { GiftCardSection } from '../components/home/GiftCardSection';
import { Gift } from 'lucide-react';

export const GiftCardsPage: React.FC = () => {
  return (
    <main className="pb-20 min-h-screen bg-[#FDFBF7]">
      <PageHeader
        eyebrow="Regalos Inolvidables"
        title={<>Tarjetas de Regalo & <i className="font-normal text-[#C5A059]">Certificados</i></>}
        text="Obsequia momentos de paz y revitalización. Válido para cualquier masaje a domicilio en CDMX durante 12 meses."
      />

      <GiftCardSection />
    </main>
  );
};
