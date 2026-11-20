/**
 * Atribución: guarda de dónde llegó cada persona (UTMs y click IDs) y la lleva al portal essenya.app.
 * - Primer contacto (first): cómo conoció la marca. Se conserva 90 días.
 * - Último contacto (last): el anuncio o enlace que la trajo a reservar. Se conserva 90 días.
 * Solo se guarda en el navegador de la persona; no se envía a ningún tercero.
 */

const STORAGE_KEY = 'essenya_attr';
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const;

type Touch = Record<string, string>;
interface Stored {
  first?: Touch;
  last?: Touch;
  ts: number;
}

function readStored(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Stored;
    if (!data.ts || Date.now() - data.ts > TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

/** Lee los parámetros de la URL actual. Si hay alguno, lo registra como último contacto. */
export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const touch: Touch = {};
    for (const key of KEYS) {
      const value = params.get(key);
      if (value) touch[key] = value.slice(0, 100);
    }
    if (Object.keys(touch).length === 0) return;

    const current = readStored();
    const next: Stored = {
      first: current?.first ?? touch,
      last: touch,
      ts: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* sin almacenamiento disponible: el sitio funciona igual */
  }
}

/** Último contacto vigente (o {} si no hay). */
export function getLastTouch(): Touch {
  return readStored()?.last ?? {};
}

/** Agrega a una URL los UTMs guardados y los datos del contexto (servicio, página, id de evento). */
export function decorateUrl(href: string, extra: Record<string, string | undefined> = {}): string {
  const url = new URL(href, window.location.origin);
  const last = getLastTouch();
  for (const [key, value] of Object.entries(last)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  for (const [key, value] of Object.entries(extra)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}
