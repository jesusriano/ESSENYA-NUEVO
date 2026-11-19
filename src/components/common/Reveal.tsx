import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Retardo en segundos (para escalonar elementos hermanos). */
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
}

/**
 * Aparición suave al hacer scroll (fundido + subida corta), una sola vez.
 * Respeta "reducir movimiento": en ese caso el contenido se muestra directamente, sin animar.
 */
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 24 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
