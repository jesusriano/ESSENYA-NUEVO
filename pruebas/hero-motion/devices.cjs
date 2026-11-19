// Emulación de teléfonos y tablets en Chromium (NO es Safari/WebKit ni un dispositivo real).
// Uso: node devices.js <distDir> <puerto> <salidaDir>
const path = require('path');
const fs = require('fs');
const { devices } = require('playwright');
const { startServer, newContext, overlapProbe, chromium, SP } = require('./harness.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const [dist, port, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

const LIST = [
  ['iPhone SE (320×568)', devices['iPhone SE']],
  ['iPhone 14 (390×664)', devices['iPhone 14']],
  ['iPhone 14 Pro Max (430×740)', devices['iPhone 14 Pro Max']],
  ['iPhone 14 horizontal (750×340)', devices['iPhone 14 landscape']],
  ['Pixel 7 (412×839)', devices['Pixel 7']],
  ['Pixel 7 horizontal (863×360)', devices['Pixel 7 landscape']],
  ['Galaxy S9+ (320×658)', devices['Galaxy S9+']],
  ['Galaxy S9+ horizontal (658×320)', devices['Galaxy S9+ landscape']],
  ['Galaxy Z Fold plegado (280×653)', { ...devices['Pixel 7'], viewport: { width: 280, height: 653 }, deviceScaleFactor: 3 }],
  ['iPad Mini (768×1024)', devices['iPad Mini']],
  ['iPad Pro 11 (834×1194)', devices['iPad Pro 11']],
  ['iPad Pro 11 horizontal (1194×834)', devices['iPad Pro 11 landscape']],
];

const DOTS = 'main > section button[aria-label^="Ir a diapositiva"]';
const idx = (page) => page.evaluate((sel) => [...document.querySelectorAll(sel)].findIndex((b) => b.getAttribute('aria-current') === 'true'), DOTS);

(async () => {
  const server = await startServer(path.resolve(dist), Number(port));
  const browser = await chromium.launch();
  const rows = [];
  for (const [name, device] of LIST) {
    const r = { name, checks: [] };
    const ok = (label, pass, detail = '') => r.checks.push({ label, pass, detail });
    const errors = [];
    const ctx = await newContext(browser, null, { device });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) errors.push(m.text().slice(0, 120)); });
    page.on('pageerror', (e) => errors.push('pageerror ' + e.message));
    const cdp = await ctx.newCDPSession(page);
    const swipe = async (x1, y1, x2, y2) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1 }] });
      for (let s = 1; s <= 8; s++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + ((x2 - x1) * s) / 8, y: y1 + ((y2 - y1) * s) / 8 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(200);
    };
    try {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await sleep(1700);
      // captura inicial
      await page.screenshot({ path: path.join(outDir, name.replace(/[^\w]+/g, '_') + '.png') });
      // 1) autoplay sin mouse (táctil): debe avanzar a los ~7 s
      await sleep(5600);
      const i1 = await idx(page);
      ok('Autoplay avanza solo en táctil (~7 s)', i1 === 1, `idx=${i1}`);
      // 2) desbordamiento horizontal
      const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
      ok('Sin desbordamiento horizontal', ov.sw <= ov.iw + 1, `scrollWidth=${ov.sw}, ancho=${ov.iw}`);
      // 3) superposición de flechas en las 5 diapositivas
      const bad = [];
      for (let i = 0; i < 5; i++) {
        await page.locator(DOTS).nth(i).click({ force: true });
        await sleep(1700);
        const hits = await page.evaluate(overlapProbe);
        if (hits.length) bad.push(`s${i + 1}: ${[...new Set(hits)].slice(0, 2).join('; ')}`);
      }
      ok('Flechas sin superponerse con texto ni controles (5 diapositivas)', bad.length === 0, bad.join(' | '));
      // 4) flechas dentro de pantalla y tamaño de los controles
      const geo = await page.evaluate(() => {
        const sec = document.querySelector('main > section');
        const vis = (e) => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
        const ctr = [...sec.querySelectorAll('a, button')].filter(vis).map((e) => { const b = e.getBoundingClientRect(); return { t: (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 22), w: b.width, h: b.height, l: b.left, r: b.right }; });
        const out = ctr.filter((c) => c.l < 0 || c.r > innerWidth).map((c) => c.t);
        const small = ctr.filter((c) => Math.min(c.w, c.h) < 24).map((c) => `${c.t} ${Math.round(c.w)}×${Math.round(c.h)}`);
        return { out, small: [...new Set(small)] };
      });
      ok('Todos los controles dentro del ancho de pantalla', geo.out.length === 0, geo.out.join(', '));
      r.small = geo.small;
      // 5) toque en flecha visible, pausa táctil y swipe (si hay touch)
      await page.reload({ waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready); await sleep(1500);
      if (device.hasTouch) {
        await page.locator('button[aria-label="Siguiente imagen"]:visible').tap();
        await sleep(300);
        const i2 = await idx(page);
        ok('Toque en la flecha "Siguiente" cambia de diapositiva', i2 === 1, `idx=${i2}`);
        const lab = await page.locator('main > section button[aria-label="Reanudar carrusel"]:visible').count();
        ok('Tras navegar a mano el botón muestra "Reanudar"', lab === 1);
        await page.locator('main > section button[aria-label="Reanudar carrusel"]:visible').tap(); await sleep(250);
        ok('Toque en Play vuelve a "Pausar"', (await page.locator('main > section button[aria-label="Pausar carrusel"]:visible').count()) === 1);
        await sleep(1000); /* deja terminar el deslizamiento del bloque tras el cambio de diapositiva */ const h1 = page.locator('main > section h1').first(); await h1.scrollIntoViewIfNeeded();
        const hb = await h1.boundingBox();
        const vw = device.viewport.width; const margin = vw < 640 ? 70 : 110; /* fuera de las flechas */ const y = hb.y + hb.height / 2; const x1 = vw - margin; const x2 = margin;
        await swipe(x1, y, x2, y); const i3 = await idx(page);
        await swipe(x2, y, x1, y); const i4 = await idx(page);
        ok('Swipe izquierda → siguiente, derecha → anterior', i3 === 2 && i4 === 1, `${i3},${i4}`);
      }
    } catch (e) {
      ok('Ejecución de la prueba', false, String(e.message).split('\n')[0]);
    }
    ok('Sin errores de consola', errors.length === 0, errors.join(' | '));
    rows.push(r);
    await ctx.close();
  }
  await browser.close(); server.close();
  fs.writeFileSync(path.join(SP, 'devices.after.json'), JSON.stringify(rows, null, 1));
  let total = 0, fail = 0;
  for (const r of rows) {
    const f = r.checks.filter((c) => !c.pass);
    total += r.checks.length; fail += f.length;
    console.log(`${f.length ? 'FAIL' : 'PASS'}  ${r.name}  (${r.checks.length - f.length}/${r.checks.length})${f.length ? '  → ' + f.map((c) => c.label + ' [' + c.detail + ']').join(' ; ') : ''}`);
    if (r.small && r.small.length) console.log(`        controles <24 px: ${r.small.join(', ')}`);
  }
  console.log(`\n${total - fail}/${total} comprobaciones OK en ${rows.length} dispositivos emulados`);
})();
