/**
 * Abrir el flujo de reserva desde cualquier parte del sitio.
 * Los botones "Reservar" solo avisan con este evento; un único modal (BookingModal) lo escucha.
 */

export interface BookingRequest {
  /** Masaje ya elegido (id de MASSAGE_SERVICES). */
  serviceId?: string;
  /** 60, 90 o 120. */
  duration?: number;
  /** Extras ya elegidos (ids de ADD_ONS). */
  addOnIds?: string[];
  /** Zona de cobertura ya elegida (id de COVERAGE_ZONES). */
  zoneId?: string;
}

export const BOOKING_EVENT = 'essenya:reservar';

export function abrirReserva(request: BookingRequest = {}): void {
  window.dispatchEvent(new CustomEvent<BookingRequest>(BOOKING_EVENT, { detail: request }));
}
