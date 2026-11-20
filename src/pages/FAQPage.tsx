import { PageHeader } from '../components/common/PageHeader';
import React from 'react';
import { FAQSection } from '../components/home/FAQSection';
import { HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  return (
    <main className="pb-20 min-h-screen bg-[#FDFBF7]">
      <PageHeader
        eyebrow="Centro de Ayuda"
        title={<>Preguntas <i className="font-normal text-[#C5A059]">Frecuentes</i></>}
        text="Todo lo que necesitas saber antes de tu primera sesión de spa a domicilio en Ciudad de México."
      />

      <FAQSection />
    </main>
  );
};
