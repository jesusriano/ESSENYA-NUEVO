const path = require('path');
const { startServer, newContext, chromium } = require('./harness.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [dist, port] = process.argv.slice(2);
  const server = await startServer(path.resolve(dist), Number(port));
  const browser = await chromium.launch();
  console.log('ancho  hueco mínimo flecha↔texto del titular (px css)');
  for (const w of [280, 300, 320, 340, 360, 375, 390, 412, 430, 480, 540, 600, 639]) {
    const ctx = await newContext(browser, { name: 'x', width: w, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, { reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready); await sleep(700);
    const g = await page.evaluate(() => {
      const sec = document.querySelector('main > section');
      const vis = (e) => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
      const arrows = ['Anterior imagen', 'Siguiente imagen'].map((l) => [...sec.querySelectorAll(`button[aria-label="${l}"]`)].find(vis)).filter(Boolean);
      const lines = [...sec.querySelectorAll('h1 .hero-line-up')].map((e) => { const rg = document.createRange(); rg.selectNodeContents(e); return rg.getBoundingClientRect(); });
      let min = 1e9;
      for (const a of arrows) { const r = a.getBoundingClientRect(); for (const l of lines) { const vOverlap = Math.min(r.bottom, l.bottom) - Math.max(r.top, l.top); if (vOverlap <= 0) continue; const gap = r.left < l.left ? l.left - r.right : r.left - l.right; min = Math.min(min, gap); } }
      return { gap: Math.round(min * 10) / 10, aw: Math.round(arrows[0].getBoundingClientRect().width) };
    });
    console.log(String(w).padStart(5), String(g.gap).padStart(8), `(flecha ${g.aw}px)`);
    await ctx.close();
  }
  await browser.close(); server.close();
})();
