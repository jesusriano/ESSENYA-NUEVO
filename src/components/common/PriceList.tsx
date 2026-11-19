import React from 'react';
import { ServicePrice } from '../../types';

/** Formato de pesos mexicanos sin decimales: 1650 -> "$1,650". */
export const formatMXN = (amount: number): string => `$${amount.toLocaleString('es-MX')}`;

interface PriceListProps {
  prices: ServicePrice[];
  /** "dark" para tarjetas sobre foto oscura, "light" para tarjetas blancas. */
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Precios por duración de un masaje (60 / 90 / 120 min), tomados del mismo dato que usa el
 * sistema de reservas, así que nunca difieren de lo que ve el cliente al reservar.
 */
export const PriceList: React.FC<PriceListProps> = ({ prices, variant = 'light', className = '' }) => {
  const dark = variant === 'dark';
  return (
    <dl
      aria-label="Precios por duración"
      className={`grid divide-x overflow-hidden rounded-2xl border ${
        dark ? 'divide-white/15 border-white/20 bg-[#120E0D]/55' : 'divide-[#2D2926]/10 border-[#2D2926]/10 bg-[#F9F6F2]'
      } ${className}`}
      style={{ gridTemplateColumns: `repeat(${prices.length}, minmax(0, 1fr))` }}
    >
      {prices.map((p) => (
        <div key={p.durationMinutes} className="px-2 py-2.5 text-center">
          <dt
            className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
              dark ? 'text-[#E3C27E]' : 'text-[#8A6A24]'
            }`}
          >
            {p.durationMinutes} min
          </dt>
          <dd className={`mt-0.5 font-serif text-lg leading-tight ${dark ? 'text-white' : 'text-[#2D2926]'}`}>
            {formatMXN(p.priceMXN)}
          </dd>
        </div>
      ))}
    </dl>
  );
};
