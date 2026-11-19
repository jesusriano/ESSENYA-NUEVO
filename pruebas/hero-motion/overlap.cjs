// Superposición de las flechas con el texto y los controles del Hero, por ancho de pantalla y diapositiva.
// Uso: node overlap.js <distDir> <puerto> <etiqueta> [anchos separados por coma]
const path = require('path');
const fs = require('fs');
const { startServer, newContext, chromium, SP } = require('./harness.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const [dist, port, label, widthsArg] = process.argv.slice(2);
const WIDTHS = (widthsArg || '320,360,375,390,412,430,480,540,600,639,640,700,768,820,900,1023,1024,1100,1280,1440').split(',').map(Number);

(async () => {
  const server = await startServer(path.resolve(dist), Number(port));
  const browser = await chromium.launch();
  const rows = [];
  for (const w of WIDTHS) {
    const h = w <= 480 ? 844 : w <= 900 ? 1000 : 900;
    const vp = { name: `w${w}`, width: w, height: h, deviceScaleFactor: 1, isMobile: w <= 480, hasTouch: w <= 480 };
    const ctx = await newContext(browser, vp);
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(2, 120);
    await sleep(1500);
    const perSlide = [];
    for (let i = 0; i < 5; i++) {
      await page.locator('main > section button[aria-label^="Ir a diapositiva"]').nth(i).click({ force: true });
      await page.mouse.move(2, 120);
      await sleep(1900);
      const r = await page.evaluate(() => {
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
          for (const t of textRects) { const ar = inter(a.r, t.r, 1); if (ar > 0) hits.push(`${a.l} ∩ texto "${t.t}" (${Math.round(ar)} px²)`); }
          for (const b of boxes) { const ar = inter(a.r, b.r, 1); if (ar > 0) hits.push(`${a.l} ∩ control "${b.t}" (${Math.round(ar)} px²)`); }
        }
        const sr = sec.getBoundingClientRect();
        return { hits, arrows: arrows.map((a) => ({ l: a.l, x: Math.round(a.r.left), y: Math.round(a.r.top - sr.top), w: Math.round(a.r.width) })), secW: Math.round(sr.width), inView: arrows.every((a) => a.r.left >= 0 && a.r.right <= innerWidth) };
      });
      perSlide.push(r);
    }
    rows.push({ w, perSlide });
    await ctx.close();
  }
  await browser.close(); server.close();
  fs.writeFileSync(path.join(SP, `overlap.${label}.json`), JSON.stringify(rows, null, 1));
  console.log(`Superposición de flechas · ${label}`);
  for (const { w, perSlide } of rows) {
    const bad = perSlide.map((s, i) => (s.hits.length ? `s${i + 1}` : null)).filter(Boolean);
    const all = [...new Set(perSlide.flatMap((s) => s.hits.map((h) => h.replace(/ \(\d+ px²\)/, ''))))];
    const a0 = perSlide[0].arrows.map((a) => `${a.x},${a.y}`).join(' | ');
    const off = perSlide.every((s) => s.inView) ? '' : ' ⚠ fuera de pantalla';
    console.log(`${String(w).padStart(5)} px  ${bad.length ? 'SUPERPONE en ' + bad.join(',') + ' → ' + all.slice(0, 2).join('; ') : 'sin superposición'}   flechas(x,y): ${a0}${off}`);
  }
})();
