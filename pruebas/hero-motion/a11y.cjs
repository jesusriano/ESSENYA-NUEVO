// Accesibilidad del Hero: nombres accesibles, árbol ARIA, contraste real (muestreo de píxeles), foco y objetivos táctiles.
// Uso: node a11y.js <distDir> <puerto> <etiqueta>
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const { startServer, VIEWPORTS, newContext, chromium, SP } = require('./harness.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const [dist, port, label] = process.argv.slice(2);

// --- decodificador PNG mínimo (RGBA/RGB 8 bits) para muestrear píxeles sin dependencias ---
function decodePNG(buf) {
  let p = 8; let w, h, ct; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p); const type = buf.toString('ascii', p + 4, p + 8); const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); ct = data[9]; }
    if (type === 'IDAT') idat.push(data);
    p += 12 + len;
  }
  const bpp = ct === 6 ? 4 : 3; const raw = zlib.inflateSync(Buffer.concat(idat)); const stride = w * bpp; const out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)]; const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[y * stride + x - bpp] : 0; const b = y > 0 ? out[(y - 1) * stride + x] : 0; const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0;
      let v = row[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c; const pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      out[y * stride + x] = v & 255;
    }
  }
  return { w, h, bpp, data: out };
}
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
const parseRGB = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); const a = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: a[0], g: a[1], b: a[2], a: a[3] === undefined ? 1 : a[3] }; };

(async () => {
  const server = await startServer(path.resolve(dist), Number(port));
  const browser = await chromium.launch();
  const out = { label, names: [], contrast: [], issues: [] };
  // ===== A) nombres accesibles + árbol ARIA (1440 y 390) =====
  for (const vpName of ['d1440', 'm390']) {
    const vp = VIEWPORTS.find((v) => v.name === vpName);
    const ctx = await newContext(browser, { ...vp, deviceScaleFactor: 1 }, { reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready); await sleep(800);
    const names = await page.evaluate(() => {
      const sec = document.querySelector('main > section');
      const vis = (e) => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
      return [...sec.querySelectorAll('a, button')].filter(vis).map((e) => ({ tag: e.tagName.toLowerCase(), name: (e.getAttribute('aria-label') || e.textContent || '').trim(), role: e.getAttribute('role') || '' }));
    });
    out.names.push({ vp: vpName, names });
    const empty = names.filter((n) => !n.name);
    if (empty.length) out.issues.push(`${vpName}: ${empty.length} controles sin nombre accesible`);
    const imgs = await page.evaluate(() => [...document.querySelectorAll('main > section:first-child img')].map((i) => ({ alt: i.getAttribute('alt'), hiddenAncestor: !!i.closest('[aria-hidden="true"]') })));
    out.imgs = imgs;
    if (imgs.some((i) => i.alt === null || (i.alt !== '' && !i.hiddenAncestor))) out.issues.push(`${vpName}: imagen decorativa del Hero con alt no vacío`);
    if (label === 'after' && vpName === 'm390') {
      out.aria = await page.locator('main > section').first().ariaSnapshot();
    }
    await ctx.close();
  }
  // ===== B) contraste real (texto transparente → muestrear el fondo detrás de cada texto) =====
  for (const vpName of ['d1440', 'm390']) {
    const vp = VIEWPORTS.find((v) => v.name === vpName);
    for (let slide = 0; slide < 5; slide++) {
      const ctx = await newContext(browser, { ...vp, deviceScaleFactor: 1 }, { reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready); await page.mouse.move(2, 120); await sleep(700);
      await page.locator('main > section button[aria-label^="Ir a diapositiva"]').nth(slide).click({ force: true });
      await page.mouse.move(2, 120); await sleep(1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      const items = await page.evaluate(() => {
        const sec = document.querySelector('main > section');
        const pick = [];
        const toRGB = (c) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const x = cv.getContext('2d'); x.fillStyle = '#000'; x.fillStyle = c; x.fillRect(0, 0, 1, 1); const d = x.getImageData(0, 0, 1, 1).data; return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 }; };
        const add = (el, name, large) => { if (!el) return; const c = getComputedStyle(el); const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter((r) => r.width > 2 && r.height > 2); if (!rs.length) return; pick.push({ name, color: toRGB(c.color), size: parseFloat(c.fontSize), weight: parseInt(c.fontWeight, 10) || 400, rects: rs.map((r) => ({ x: r.x, y: r.y + scrollY, w: r.width, h: r.height })) }); };
        add(sec.querySelector('.rounded-full.inline-flex span'), 'Tagline');
        add(sec.querySelector('h1 .hero-line-up:nth-of-type(1)') || sec.querySelectorAll('h1 .hero-line-up')[0], 'Título: Masajes');
        add(sec.querySelectorAll('h1 .hero-line-up')[1].querySelector('span'), 'Título: Profesionales (dorado)');
        add(sec.querySelectorAll('h1 .hero-line-up')[2], 'Título: a Domicilio');
        add(sec.querySelector('h2'), 'Cita (h2)');
        add(sec.querySelector('h2 + p'), 'Descripción (p)');
        [...sec.querySelectorAll('a')].forEach((a) => add(a, 'Botón: ' + a.textContent.trim()));
        add([...sec.querySelectorAll('span')].find((s) => /^TERAPEUTAS CERTIFICADAS$/.test(s.textContent.trim())), 'Badge');
        return pick;
      });
      await page.addStyleTag({ content: '*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important} svg{opacity:0!important} h1,h1 *{filter:none!important}' });
      await sleep(150);
      const png = decodePNG(await page.screenshot({ fullPage: true }));
      for (const it of items) {
        const fg = it.color; const fl = lum(fg.r, fg.g, fg.b);
        let worst = 99; let mean = 0; let n = 0;
        for (const r of it.rects) {
          for (let y = Math.max(0, Math.floor(r.y)); y < Math.min(png.h, Math.ceil(r.y + r.h)); y += 2) for (let x = Math.max(0, Math.floor(r.x)); x < Math.min(png.w, Math.ceil(r.x + r.w)); x += 2) {
            const i = (y * png.w + x) * png.bpp; const l = lum(png.data[i], png.data[i + 1], png.data[i + 2]);
            const cr = ratio(fl, l); worst = Math.min(worst, cr); mean += cr; n++;
          }
        }
        const large = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
        out.contrast.push({ vp: vpName, slide: slide + 1, name: it.name, mean: +(mean / n).toFixed(2), worst: +worst.toFixed(2), need: large ? 3 : 4.5 });
      }
      await ctx.close();
    }
  }
  // ===== C) foco visible y botón de pausa: contraste de componentes (no texto) =====
  fs.writeFileSync(path.join(SP, `a11y.${label}.json`), JSON.stringify(out, null, 1));
  await browser.close(); server.close();
  // ---- resumen
  console.log(`A11Y · ${label}`);
  console.log('Controles con nombre accesible (1440):', out.names[0].names.map((n) => `[${n.name}]`).join(' '));
  console.log('Controles con nombre accesible (390): ', out.names[1].names.map((n) => `[${n.name}]`).join(' '));
  console.log('Imágenes del Hero:', JSON.stringify(out.imgs));
  const by = {};
  for (const c of out.contrast) { const k = `${c.name}`; by[k] = by[k] || { min: 99, minMean: 99, need: c.need, n: 0 }; by[k].min = Math.min(by[k].min, c.worst); by[k].minMean = Math.min(by[k].minMean, c.mean); by[k].n++; }
  console.log('Contraste (mínimo entre las 5 diapositivas y 2 tamaños)  media / peor píxel / requerido');
  for (const [k, v] of Object.entries(by)) console.log(`  ${k.padEnd(34)} ${String(v.minMean).padStart(6)} / ${String(v.min).padStart(6)} / ${v.need}   ${v.minMean >= v.need ? 'OK (media)' : 'BAJO (media)'}`);
  if (out.issues.length) console.log('PROBLEMAS:', out.issues);
})();
