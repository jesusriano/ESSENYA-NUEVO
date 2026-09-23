import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, User } from 'lucide-react';
import { FAQS } from '../../constants/data';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Preparación', 'Seguridad', 'Reserva', 'Pagos y Cancelaciones'];

  const filteredFaqs = selectedCategory === 'Todos'
    ? FAQS
    : FAQS.filter((f) => f.category === selectedCategory);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="preguntas" className="py-20 bg-[#FDFBF7] relative border-b border-subtle">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Dudas Frecuentes
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2D2926]">
            Preguntas Frecuentes <i className="font-normal text-[#C5A059]">al Servicio</i>
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
            Queremos que te sientas totalmente tranquilo y cómodo antes de tu primera sesión a domicilio.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-widest font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2D2926] text-white shadow-xs'
                  : 'bg-[#F9F6F2] text-[#2D2926] hover:bg-[#EFEADF] border border-subtle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-subtle overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 text-left font-serif font-light text-lg text-[#2D2926] flex items-center justify-between gap-4 hover:bg-[#F9F6F2] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C5A059] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs text-gray-600 leading-relaxed border-t border-subtle bg-[#F9F6F2]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 text-center bg-[#F9F6F2] p-8 border border-subtle space-y-3">
          <p className="font-serif font-light text-lg text-[#2D2926]">
            ¿Tienes alguna otra duda o requerimiento especial?
          </p>
          <p className="text-xs text-gray-600 leading-relaxed max-w-lg mx-auto">
            Accede a nuestro portal de clientes para consultar detalles, disponibilidad y gestionar tus citas fácilmente.
          </p>
          <a
            href="https://www.essenya.app/cliente"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#120E0D] hover:bg-[#120E0D]/90 text-white hover:text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors shadow-md mt-2 border border-[#C5A059]/40 rounded-sm"
          >
            <User className="w-4 h-4 text-[#C5A059]" />
            Portal Cliente
          </a>
        </div>

      </div>
    </section>
  );
};
