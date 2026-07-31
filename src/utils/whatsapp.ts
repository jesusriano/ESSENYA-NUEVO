import { WHATSAPP_NUMBER } from '../constants/data';

interface WhatsAppBookingData {
  serviceName?: string;
  durationMinutes?: number;
  addOnNames?: string[];
  totalPriceMXN?: number;
  date?: string;
  timeSlot?: string;
  zoneName?: string;
  neighborhood?: string;
  clientName?: string;
  notes?: string;
}

export function buildWhatsAppUrl(data?: WhatsAppBookingData): string {
  if (!data || Object.keys(data).length === 0) {
    const defaultMsg = encodeURIComponent(
      'Hola ESSENYA, me gustaría recibir más información y solicitar disponibilidad para un masaje a domicilio en CDMX. ✨'
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`;
  }

  let text = `🌿 *SOLICITUD DE RESERVA - ESSENYA SPA* 🌿\n\n`;

  if (data.serviceName) {
    text += `*Servicio:* ${data.serviceName}\n`;
  }
  if (data.durationMinutes) {
    text += `*Duración:* ${data.durationMinutes} minutos\n`;
  }
  if (data.addOnNames && data.addOnNames.length > 0) {
    text += `*Complementos:* ${data.addOnNames.join(', ')}\n`;
  }
  if (data.totalPriceMXN) {
    text += `*Inversión estimada:* $${data.totalPriceMXN.toLocaleString('es-MX')} MXN\n`;
  }
  if (data.date) {
    text += `*Fecha deseada:* ${data.date}\n`;
  }
  if (data.timeSlot) {
    text += `*Horario estimado:* ${data.timeSlot}\n`;
  }
  if (data.zoneName) {
    text += `*Zona / Colonia:* ${data.zoneName} ${data.neighborhood ? `(${data.neighborhood})` : ''}\n`;
  }
  if (data.clientName) {
    text += `*Cliente:* ${data.clientName}\n`;
  }
  if (data.notes) {
    text += `*Preferencias:* ${data.notes}\n`;
  }

  text += `\n*Por favor confirmen disponibilidad de terapeuta. ¡Gracias!*`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
