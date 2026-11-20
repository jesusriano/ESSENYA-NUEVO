// Envío de eventos a Meta Pixel y Google Analytics (gtag).
// Siempre comprueba que la función exista: si un bloqueador de scripts la quitó, no pasa nada.

type Params = Record<string, string | number | boolean | undefined>;

const clean = (params: Params = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));

/** Evento estándar de Meta Pixel (PageView, Contact, ViewContent, Lead…). */
export function trackMeta(event: string, params?: Params): void {
  try {
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === 'function') fbq('track', event, clean(params));
  } catch {
    /* el seguimiento nunca debe romper la página */
  }
}

/** Evento de Google Analytics 4 (gtag). */
export function trackGa(event: string, params?: Params): void {
  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') gtag('event', event, clean(params));
  } catch {
    /* ignorar */
  }
}
