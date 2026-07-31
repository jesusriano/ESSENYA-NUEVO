import React from 'react';
import { Sparkles, ShieldCheck, Heart, Droplets, Volume2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AnimatedImage } from "../common/AnimatedImage";
import { GUARANTEES } from '../../constants/data';
import massageTableImg from '../../assets/images/portable_massage_table_1_1785444270806.jpg';
import towelsSheetsImg from '../../assets/images/towels_and_sheets_1_1785444281810.jpg';
import oilsImg from '../../assets/images/neutral_scented_oils_1_1785444292576.jpg';

export const ExperienceSection: React.FC = () => {
  const equipmentFeatures = [
    {
      title: 'Camilla Portátil de Masaje',
      description: 'Mesa de masaje profesional acolchada y ergonómica, fácil de instalar en cualquier espacio para tu máxima comodidad.',
      image: massageTableImg
    },
    {
      title: 'Toallas y Sábanas',
      description: 'Sábanas y toallas impecables, suaves al tacto y totalmente esterilizadas para una experiencia higiénica y confortable.',
      image: towelsSheetsImg
    },
    {
      title: 'Aceites Neutros y de Olor',
      description: 'Selección de aceites neutros e hipoalergénicos para pieles delicadas, así como esencias aromáticas para aromaterapia.',
      image: oilsImg
    },
    {
      title: 'Ambientación Acústica & Aromática',
      description: 'Bocina bluetooth de alta fidelidad con listas de reproducción spa relajantes y difusor ultrasónico con bruma aromática.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section className="py-20 bg-[#2D2926] text-[#FDFBF7] relative overflow-hidden border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Estándar 5 Estrellas
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white">
            ¿Qué Llevamos a <i className="font-normal text-[#C5A059]">Tu Espacio?</i>
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xl mx-auto">
            No tienes que preocuparte por nada. Tu terapeuta llega puntualmente con todo el equipamiento profesional para convertir tu espacio en un sanctuary de relajación.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {equipmentFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#23201D] border border-white/10 hover:border-[#C5A059]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="h-44 relative">
                <AnimatedImage
                  src={feat.image}
                  alt={feat.title}
                  className="w-full h-full"
                  imageClassName="grayscale transition-all duration-500 group-hover:grayscale-0"
                  imageRounded="rounded-none"
                  containerRounded="rounded-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#23201D] via-transparent to-transparent"></div>
                </AnimatedImage>
              </div>

              <div className="p-6 space-y-2 flex-1">
                <span className="text-[10px] font-mono text-[#C5A059]">0{idx + 1}</span>
                <h3 className="font-serif font-light text-lg text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Protocol & Verification Highlights */}
        <div className="bg-[#23201D] p-8 sm:p-10 border border-white/10 space-y-8">
          {/* Header on top */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              Garantía de Confianza
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-light italic text-white">
              Seguridad, Rigor y Ética
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tu tranquilidad es fundamental. Todas las terapeutas de nuestro equipo son evaluadas minuciosamente antes de realizar su primer servicio a domicilio.
            </p>
          </div>

          {/* 3 Cards below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1E1B18] p-5 border border-white/10 space-y-1 hover:border-[#C5A059]/40 transition-colors">
              <p className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                Identidad & Antecedentes
              </p>
              <p className="text-xs text-gray-400 leading-relaxed pt-1">
                Verificación oficial de identificación (INE/Pasaporte), comprobante de domicilio y filtro estricto de antecedentes penales.
              </p>
            </div>

            <div className="bg-[#1E1B18] p-5 border border-white/10 space-y-1 hover:border-[#C5A059]/40 transition-colors">
              <p className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                Certificación Técnica
              </p>
              <p className="text-xs text-gray-400 leading-relaxed pt-1">
                Evaluación práctica en fisioterapia, anatomía, biomecánica y dominio de técnicas de masaje profesional.
              </p>
            </div>

            <div className="bg-[#1E1B18] p-5 border border-white/10 space-y-1 hover:border-[#C5A059]/40 transition-colors">
              <p className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                Código de Ética e Higiene
              </p>
              <p className="text-xs text-gray-400 leading-relaxed pt-1">
                Compromiso de conducta profesional, respeto total al espacio del cliente y protocolos de sanitización en cada sesión.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
