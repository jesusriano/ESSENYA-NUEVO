import React from 'react';
import { Star, Quote, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { AnimatedImage } from "../common/AnimatedImage";
import { REVIEWS } from '../../constants/data';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-[#FDFBF7] relative border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#C5A059] text-[11px] uppercase tracking-widest-xl font-bold block">
            Experiencias Reales CDMX
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2D2926]">
            Lo que Dicen <i className="font-normal text-[#C5A059]">Nuestros Clientes</i>
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-3"></div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
            Más de 10,000 masajes atendidos con una valoración media de 4.9/5 estrellas en Polanco, Lomas, Condesa, Roma, Santa Fe e Interlomas.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#0A0807] p-8 border-2 border-[#C5A059]/80 shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:border-[#C5A059] transition-all relative flex flex-col justify-between overflow-hidden group rounded-sm"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#C5A059]/20 pointer-events-none" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#C5A059]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-[11px] font-bold text-[#C5A059] ml-2 font-mono">{rev.rating}.0</span>
                </div>

                {/* Service Tag */}
                <span className="inline-block px-3 py-1 bg-black/60 text-[#C5A059] text-[9px] uppercase tracking-widest font-semibold border border-[#C5A059]/40">
                  {rev.serviceUsed}
                </span>

                {/* Comment Text */}
                <p className="text-xs text-gray-200 leading-relaxed italic font-serif">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-[#C5A059]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {rev.avatarImage ? (
                    <AnimatedImage
                      src={rev.avatarImage}
                      alt={rev.author}
                      className="w-10 h-10"
                      containerRounded="rounded-full"
                      imageRounded="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-black text-[#C5A059] font-light font-serif flex items-center justify-center text-sm border border-[#C5A059]/60 rounded-full">
                      {rev.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif font-light text-sm text-white flex items-center gap-1.5">
                      {rev.author}
                      {rev.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" title="Cliente Verificado" />
                      )}
                    </h4>
                    <p className="text-[10px] text-[#C5A059] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C5A059]" />
                      {rev.neighborhood}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">{rev.date}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
