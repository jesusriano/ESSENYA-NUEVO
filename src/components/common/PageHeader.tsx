import React from 'react';
import { motion } from 'motion/react';
import headerImg from '../../assets/images/hero_spa_bg_1785440510469.webp';

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  text: string;
}

/**
 * Encabezado común de las páginas internas: foto de fondo, degradado oscuro y entrada suave.
 * Mismo lenguaje visual que el catálogo de servicios y la portada.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, text }) => (
  <div className="relative isolate overflow-hidden bg-[#120E0D] px-4 pb-20 pt-40 text-center text-[#FDFBF7] sm:px-6 sm:pb-28 sm:pt-48 lg:px-8">
    <img
      src={headerImg}
      alt=""
      aria-hidden="true"
      decoding="async"
      className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#120E0D]/75 via-[#120E0D]/45 to-[#120E0D]" />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 mx-auto max-w-4xl space-y-4"
    >
      <span className="block text-[11px] font-bold uppercase tracking-widest-xl text-[#C5A059]">{eyebrow}</span>
      <h1 className="font-serif text-4xl font-light text-white sm:text-6xl">{title}</h1>
      <div className="mx-auto my-3 h-[1px] w-12 bg-[#C5A059]" />
      <p className="mx-auto max-w-2xl text-sm font-normal leading-relaxed text-gray-200 sm:text-base">{text}</p>
    </motion.div>
  </div>
);
