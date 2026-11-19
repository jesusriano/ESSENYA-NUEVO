// Arnés de pruebas del Hero (fuera del repositorio).
// - Sirve un build estático con fallback SPA.
// - Bloquea TODA la analítica real (GTM, gtag, Meta Pixel) y cualquier host externo.
// - Sirve las fuentes de Google desde caché local para resultados deterministas.
// - Sustituye window.fbq por un registrador para verificar el evento Lead sin enviar nada.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SP = __dirname;
const FONT_DIR = path.join(SP, 'fonts'); // opcional: caché local (fonts.css + .woff2) para capturas deterministas
const HAS_FONT_CACHE = fs.existsSync(path.join(FONT_DIR, 'fonts.css'));

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};

function startServer(dir, port) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(dir, p);
    if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(dir, 'index.html'); // SPA fallback
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

const VIEWPORTS = [
  { name: 'm390', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 't768', width: 768, height: 1024, deviceScaleFactor: 2, isMobile: false, hasTouch: false },
  { name: 'd1440', width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false, hasTouch: false },
];

const blocked = [];
const outbound = []; // intentos de navegación/recursos externos registrados (para auditoría)

async function newContext(browser, vp, opts = {}) {
  const base = opts.device
    ? { ...opts.device }
    : { viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile, hasTouch: vp.hasTouch };
  delete base.defaultBrowserType;
  const ctx = await browser.newContext({
    ...base,
    reducedMotion: opts.reducedMotion || 'no-preference',
    locale: 'es-MX',
    ...(opts.recordVideo ? { recordVideo: opts.recordVideo } : {}),
  });
  const fontCss = HAS_FONT_CACHE ? fs.readFileSync(path.join(FONT_DIR, 'fonts.css'), 'utf8') : null;
  await ctx.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') return route.continue();
    if (url.hostname === 'fonts.googleapis.com') {
      if (!HAS_FONT_CACHE) return route.continue();
      return route.fulfill({ status: 200, contentType: 'text/css', body: fontCss });
    }
    if (url.hostname === 'fonts.gstatic.com') {
      const f = path.join(FONT_DIR, path.basename(url.pathname));
      if (HAS_FONT_CACHE && fs.existsSync(f)) return route.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(f) });
      return route.continue();
    }
    if (url.hostname.endsWith('essenya.app')) {
      // El destino de reserva real nunca se toca: se devuelve una página vacía local.
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub essenya.app</title>' });
    }
    outbound.push(url.hostname);
    return route.abort(); // analítica real, Unsplash, etc.
  });
  // Registrador de fbq: el snippet de index.html hace `if (f.fbq) return;`, así que usa el nuestro.
  await ctx.addInitScript(() => {
    window.__fbq = [];
    window.fbq = function () { window.__fbq.push(Array.from(arguments)); };
    window.__errors = [];
    window.addEventListener('error', (e) => window.__errors.push(String(e.message)));
  });
  return ctx;
}

const heroSel = 'main > section';

// Devuelve las superposiciones de las flechas visibles con texto y controles del Hero (se ejecuta en la página).
const overlapProbe = () => {
  const sec = document.querySelector('main > section');
  const vis = (e) => { const c = getComputedStyle(e); const b = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && b.width > 0; };
  const arrows = ['Anterior imagen', 'Siguiente imagen'].map((l) => [...sec.querySelectorAll(`button[aria-label="${l}"]`)].find(vis)).filter(Boolean).map((e) => ({ l: e.getAttribute('aria-label'), r: e.getBoundingClientRect() }));
  const textRects = [];
  const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode; if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (el.closest('button[aria-label*="imagen"], [aria-hidden="true"]')) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const q of rg.getClientRects()) if (q.width > 1 && q.height > 1) textRects.push({ t: n.textContent.trim().slice(0, 24), r: q });
  }
  const boxes = [...sec.querySelectorAll('a, button[aria-label^="Ir a"], button[aria-label$="carrusel"]')].filter(vis).map((e) => ({ t: (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 24), r: e.getBoundingClientRect() }));
  const pill = sec.querySelector('.rounded-full.inline-flex'); if (pill) boxes.push({ t: 'pill', r: pill.getBoundingClientRect() });
  const inter = (a, b, tol = 0) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left) - tol) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) - tol);
  const hits = [];
  for (const a of arrows) {
    for (const t of textRects) { const ar = inter(a.r, t.r, 1); if (ar > 0) hits.push(`${a.l} ∩ texto "${t.t}"`); }
    for (const b of boxes) { const ar = inter(a.r, b.r, 1); if (ar > 0) hits.push(`${a.l} ∩ control "${b.t}"`); }
  }
  return hits;
};

module.exports = { startServer, VIEWPORTS, newContext, heroSel, overlapProbe, chromium, outbound, SP };
