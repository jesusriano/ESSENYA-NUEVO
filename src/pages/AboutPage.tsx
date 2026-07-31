import React from 'react';
import { ShieldCheck, Award, Heart, CheckCircle2, Sparkles, Users } from 'lucide-react';
import { ExperienceSection } from '../components/home/ExperienceSection';
import { AnimatedImage } from "../components/common/AnimatedImage";

export const AboutPage: React.FC = () => {
  return (
    <main className="pt-28 pb-20 min-h-screen bg-[#FAF4E8]">
      {/* Header */}
      <div className="bg-[#2D2926] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Nuestra Filosofía
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white">
            Sobre <span className="text-white font-normal">ESSENYA</span> <i className="font-normal text-[#C5A059]">Masajes a Domicilio</i>
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Redefiniendo el estándar de la terapia corporal en México a través de la puntualidad, elegancia, higiene rigurosa y calidez humana.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 space-y-16">
        
        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">
              Nuestra Historia
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2D2926]">
              Nacidos para devolver la paz en medio de la ciudad
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Sabemos que la Ciudad de México es vibrante, pero también acelerada. El tráfico, las distancias largas y las agendas apretadas muchas veces nos privan del autocuidado que nuestro cuerpo clama.
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              ESSENYA nació con el objetivo claro de eliminar las barreras entre tú y un estado de paz absoluta. No tienes que desplazarte ni lidiar con tráfico. Llevamos la terapia directamente a la tranquilidad de tu espacio personal.
            </p>
          </div>

          <div className="relative h-80 shadow-lg">
            <AnimatedImage
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
              alt="Terapeuta Essenya"
              className="w-full h-full"
              imageRounded="rounded-none"
              containerRounded="rounded-none"
              maskClassName="bg-[#FFFDF9]"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="bg-[#FFFDF9] p-8 sm:p-10 border border-[#E5D2A0] shadow-xs space-y-6">
          <h3 className="font-serif text-2xl font-light text-[#2D2926] text-center">
            Nuestros 4 Pilares de <i className="font-normal text-[#C5A059]">Excelencia</i>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 bg-[#FAF3E0] p-4 border border-[#E5D2A0] group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#C5A059] cursor-default">
              <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D2926] group-hover:text-[#C5A059] transition-colors">Filtros de Seguridad Estrictos</h4>
                <p className="text-xs text-gray-700 mt-1">
                  Revisión exhaustiva de antecedentes, verificación de documentos oficiales e investigación psicométrica.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#FAF3E0] p-4 border border-[#E5D2A0] group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#C5A059] cursor-default">
              <Award className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D2926] group-hover:text-[#C5A059] transition-colors">Formación Técnica Certificada</h4>
                <p className="text-xs text-gray-700 mt-1">
                  Terapeutas graduadas en anatomía corporal, masoterapia y atención al cliente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#FAF3E0] p-4 border border-[#E5D2A0] group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#C5A059] cursor-default">
              <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D2926] group-hover:text-[#C5A059] transition-colors">Insumos Terapéuticos Certificados</h4>
                <p className="text-xs text-gray-700 mt-1">
                  Blancos esterilizados de alta densidad, aceites botánicos puros y difusores ultrasónicos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#FAF3E0] p-4 border border-[#E5D2A0] group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#C5A059] cursor-default">
              <Heart className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D2926] group-hover:text-[#C5A059] transition-colors">Trato Respetuoso & Humano</h4>
                <p className="text-xs text-gray-700 mt-1">
                  Atención delicada, personalizada, discreta y enfocada en tus objetivos de bienestar.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Equipment & Safety Protocols */}
      <ExperienceSection />
    </main>
  );
};
