/**
 * Seguimiento centralizado de ESSENYA (Meta Pixel + Google Analytics 4 vía GTM/gtag).
 *
 * Un solo lugar define qué significa cada evento. Los componentes solo llaman
 * trackEvent('clave') o ponen data-track="clave" en el elemento; nunca hablan
 * directamente con fbq ni gtag.
 *
 * Los scripts ya están cargados en index.html antes de React, así que las
 * llamadas funcionan desde el primer clic. Si un bloqueador quita el script,
 * las llamadas se ignoran sin romper la página.
 */

import { captureAttribution, decorateUrl } from './attribution';

type Params = Record<string, string | number | boolean | undefined>;

/** Identificador único por evento. El mismo id se envía al píxel y, después, a la conversión del servidor, para no contar dos veces. */
export function newEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

interface EventDef {
  /** Evento estándar de Meta (se envía con fbq('track', …)). */
  meta?: string;
  /** Evento personalizado de Meta (fbq('trackCustom', …)). */
  metaCustom?: string;
  /** Evento de GA4 (gtag('event', …)). */
  ga?: { name: string; params?: Params };
}

/** Catálogo de eventos: la única lista que hay que tocar para agregar uno nuevo. */
export const EVENTS = {
  pageview:          { meta: 'PageView', ga: { name: 'page_view' } },
  clic_reservar:     { meta: 'Lead', ga: { name: 'clic_reservar' } },
  contacto_whatsapp: { meta: 'Contact', ga: { name: 'contact_click', params: { channel: 'whatsapp' } } },
  contacto_telefono: { meta: 'Contact', ga: { name: 'contact_click', params: { channel: 'telefono' } } },
  contacto_correo:   { meta: 'Contact', ga: { name: 'contact_click', params: { channel: 'correo' } } },
  formulario:        { meta: 'Contact', ga: { name: 'generate_lead', params: { channel: 'formulario' } } },
  ver_masaje:        { meta: 'ViewContent', ga: { name: 'view_item' } },
  seleccion_zona:    { metaCustom: 'SeleccionZona', ga: { name: 'select_content', params: { content_type: 'zona' } } },
  seleccion_regalo:  { metaCustom: 'SeleccionRegalo', ga: { name: 'select_content', params: { content_type: 'regalo' } } },
  detalle_servicio:  { ga: { name: 'select_content', params: { content_type: 'servicio' } } },
  filtro_categoria:  { ga: { name: 'select_content', params: { content_type: 'categoria' } } },
  buscador_masaje:   { metaCustom: 'BuscadorMasaje', ga: { name: 'select_content', params: { content_type: 'buscador' } } },
} satisfies Record<string, EventDef>;

export type TrackKey = keyof typeof EVENTS;

const clean = (params: Params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));

function sendMeta(kind: 'track' | 'trackCustom', event: string, params: Params, eventId?: string) {
  try {
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === 'function') fbq(kind, event, clean(params), eventId ? { eventID: eventId } : undefined);
  } catch {
    /* el seguimiento nunca rompe la página */
  }
}

function sendGa(event: string, params: Params) {
  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') gtag('event', event, clean(params));
  } catch {
    /* ignorar */
  }
}

/** Envía un evento del catálogo a Meta y GA4. `label` describe el elemento tocado. */
export function trackEvent(
  key: TrackKey,
  data: { label?: string; category?: string; eventId?: string } = {},
): string {
  const def: EventDef = EVENTS[key];
  const label = data.label?.trim().slice(0, 100) || undefined;
  const eventId = data.eventId ?? newEventId();

  if (def.meta) sendMeta('track', def.meta, { content_name: label, content_category: data.category }, eventId);
  if (def.metaCustom) sendMeta('trackCustom', def.metaCustom, { content_name: label, content_category: data.category }, eventId);
  if (def.ga) sendGa(def.ga.name, { ...def.ga.params, item_name: label, item_category: data.category, event_id: eventId });
  return eventId;
}

/**
 * Listener único de clics para todo el sitio. Cubre:
 * - enlaces a la reserva (essenya.app/cliente) → reserva
 * - enlaces de WhatsApp, teléfono y correo → contacto_*
 * - cualquier elemento con data-track="clave" → su evento del catálogo
 * El texto del elemento se usa como etiqueta, salvo que tenga data-track-label.
 */
export function initTracking(): void {
  captureAttribution();

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target?.closest) return;

    const marked = target.closest<HTMLElement>('[data-track]');
    if (marked && marked.dataset.track && marked.dataset.track in EVENTS) {
      const label = marked.dataset.trackLabel || marked.textContent || '';
      trackEvent(marked.dataset.track as TrackKey, { label });
      return;
    }

    const anchor = target.closest<HTMLAnchorElement>('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    const label = anchor.textContent || '';

    if (href.includes('essenya.app')) {
      // Reserva: se registra el clic, y el enlace lleva UTMs, servicio, página y el id del evento para el portal.
      const service = anchor.closest<HTMLElement>('[data-service]')?.dataset.service;
      const eventId = trackEvent('clic_reservar', { label: label || 'reservar' });
      anchor.href = decorateUrl(href, {
        ess_eid: eventId,
        ess_servicio: service,
        ess_pagina: window.location.pathname,
      });
      return;
    }
    if (href.includes('wa.me') || href.includes('whatsapp')) return trackEvent('contacto_whatsapp', { label });
    if (href.startsWith('tel:')) return trackEvent('contacto_telefono', { label });
    if (href.startsWith('mailto:')) return trackEvent('contacto_correo', { label });
  });
}
