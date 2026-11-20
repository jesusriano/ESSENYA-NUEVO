import { trackGa, trackMeta } from './utils/tracking';

// Mide clics en el Meta Pixel y GA4. No cambia la navegación.
// Lead: solo inicio de reserva (essenya.app/cliente). Contact: WhatsApp, teléfono y correo.
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;

  const booking = target?.closest?.('a[href*="essenya.app/cliente"]');
  if (booking) {
    const name = (booking.textContent || '').trim().slice(0, 80) || 'reservar';
    trackMeta('Lead', { content_name: name });
    trackGa('begin_checkout', { item_name: name });
    return;
  }

  const contact = target?.closest?.('a[href*="wa.me"], a[href*="whatsapp"], a[href^="tel:"], a[href^="mailto:"]') as HTMLAnchorElement | null;
  if (contact) {
    const href = contact.getAttribute('href') || '';
    const channel = href.startsWith('tel:') ? 'telefono' : href.startsWith('mailto:') ? 'correo' : 'whatsapp';
    const name = (contact.textContent || '').trim().slice(0, 80) || channel;
    trackMeta('Contact', { content_name: name, content_category: channel });
    trackGa('contact_click', { channel, link_text: name });
  }
});

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
