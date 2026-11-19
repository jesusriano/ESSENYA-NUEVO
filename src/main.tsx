import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mide clics a reservar en el Meta Pixel (evento Lead). No cambia la navegación.
document.addEventListener('click', (event) => {
  const link = (event.target as HTMLElement | null)?.closest?.('a[href*="essenya.app/cliente"]');
  if (!link) return;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', { content_name: (link.textContent || '').trim().slice(0, 80) || 'reservar' });
  }
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
