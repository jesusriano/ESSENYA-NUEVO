import { WHATSAPP_NUMBER } from '../constants/data';

export interface WhatsAppBookingData {
  serviceName?: string;
  durationMinutes?: number;
  /** Precio del masaje a la duración elegida. */
  servicePriceMXN?: number;
  addOns?: Array<{ name: string; price: number }>;
  totalPriceMXN?: number;
  /** Fecha en formato AAAA-MM-DD. */
  date?: string;
  timeSlot?: string;
  zoneName?: string;
  neighborhood?: string;
  clientName?: string;
  clientPhone?: string;
  notes?: string;
}

const formatMXN = (n: number) => `$${n.toLocaleString('es-MX')}`;

/** "2026-11-26" -> "jueves 26 de noviembre". Se arma con la fecha local para que no cambie de día. */
export function formatBookingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  const texto = new Date(year, month - 1, day).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Texto completo de la solicitud, listo para enviarse por WhatsApp. */
export function buildBookingMessage(data: WhatsAppBookingData): string {
  const lines: string[] = ['🌿 *SOLICITUD DE RESERVA · ESSENYA* 🌿', ''];

  if (data.serviceName) lines.push(`*Masaje:* ${data.serviceName}`);
  if (data.durationMinutes) {
    const precio = data.servicePriceMXN ? ` — ${formatMXN(data.servicePriceMXN)}` : '';
    lines.push(`*Duración:* ${data.durationMinutes} minutos${precio}`);
  }
  if (data.addOns && data.addOns.length > 0) {
    lines.push('*Extras:*');
    data.addOns.forEach((a) => lines.push(`   • ${a.name} — ${formatMXN(a.price)}`));
  }
  if (data.totalPriceMXN) lines.push(`*Total estimado:* ${formatMXN(data.totalPriceMXN)} MXN`);
  lines.push('');
  if (data.date) lines.push(`*Fecha:* ${formatBookingDate(data.date)}`);
  if (data.timeSlot) lines.push(`*Horario:* ${data.timeSlot}`);
  if (data.zoneName) lines.push(`*Zona:* ${data.zoneName}`);
  if (data.neighborhood) lines.push(`*Dirección / colonia:* ${data.neighborhood}`);
  lines.push('');
  if (data.clientName) lines.push(`*Nombre:* ${data.clientName}`);
  if (data.clientPhone) lines.push(`*Teléfono:* ${data.clientPhone}`);
  if (data.notes) lines.push(`*Notas:* ${data.notes}`);
  lines.push('', 'Por favor confirmen disponibilidad de terapeuta. ¡Gracias!');

  return lines.join('\n');
}

/** Enlace de WhatsApp con la solicitud completa. Sin datos, abre un saludo general. */
export function buildWhatsAppUrl(data?: WhatsAppBookingData): string {
  if (!data || Object.keys(data).length === 0) {
    const defaultMsg = encodeURIComponent(
      'Hola ESSENYA, me gustaría recibir más información y solicitar disponibilidad para un masaje a domicilio en CDMX. ✨'
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildBookingMessage(data))}`;
}

/** Mensaje del formulario de contacto (sin reserva). */
export function buildContactUrl(data: { name: string; phone: string; neighborhood?: string; message?: string }): string {
  const lines = [
    'Hola ESSENYA, les escribo desde la página web.',
    '',
    `*Nombre:* ${data.name}`,
    `*Teléfono:* ${data.phone}`,
  ];
  if (data.neighborhood) lines.push(`*Colonia:* ${data.neighborhood}`);
  if (data.message) lines.push(`*Mensaje:* ${data.message}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
