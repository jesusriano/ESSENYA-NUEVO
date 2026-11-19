// Uso: node capture.js <distDir> <puerto> <salidaDir> <reducedMotion: reduce|no-preference>
// Captura el Hero en reposo: 3 tamaños x 5 diapositivas.
const path = require('path');
const fs = require('fs');
const { startServer, VIEWPORTS, newContext, heroSel, chromium } = require('./harness.cjs');

(async () => {
  const [dist, port, out, rm] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const server = await startServer(path.resolve(dist), Number(port));
  const browser = await chromium.launch();
  const consoleErrors = [];
  const rects = {};
  for (const vp of VIEWPORTS) {
    const ctx = await newContext(browser, vp, { reducedMotion: rm });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) consoleErrors.push(`${vp.name}: ${m.text()}`); });
    page.on('pageerror', (e) => consoleErrors.push(`${vp.name} pageerror: ${e.message}`));
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(2, 100); // hover neutro: pausa el autoplay del código actual
    await page.waitForTimeout(1500);
    for (let i = 0; i < 5; i++) {
      await page.click(`button[aria-label="Ir a diapositiva ${i + 1}"]`, { force: true });
      await page.mouse.move(2, 100);
      await page.waitForTimeout(2200); // fin del crossfade + carga de imagen
      await page.waitForFunction(() => Array.from(document.querySelectorAll('main > section img')).every((im) => im.complete || im.loading === 'lazy'));
      const hero = page.locator(heroSel).first();
      const r = await page.evaluate(() => {
        const sec = document.querySelector('main > section'); const s = sec.getBoundingClientRect();
        const vis = (e) => { const c = getComputedStyle(e); return c.display !== 'none' && e.getBoundingClientRect().width > 0; };
        const R = (e) => { const q = e.getBoundingClientRect(); return { x: q.x - s.x, y: q.y - s.y, w: q.width, h: q.height }; };
        const pause = [...document.querySelectorAll('button[aria-label="Pausar carrusel"], button[aria-label="Reanudar carrusel"]')].find(vis);
        const arrows = ['Anterior imagen', 'Siguiente imagen'].map((l) => [...sec.querySelectorAll(`button[aria-label="${l}"]`)].find(vis)).filter(Boolean).map(R);
        return { pause: pause ? R(pause) : null, arrows, h2: R(sec.querySelector('h2')) };
      });
      rects[`${vp.name}_s${i + 1}`] = { ...r, dsf: vp.deviceScaleFactor };
      await hero.screenshot({ path: path.join(out, `${vp.name}_s${i + 1}.png`), animations: 'disabled', caret: 'hide' });
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(out, 'rects.json'), JSON.stringify(rects));
  await browser.close();
  server.close();
  console.log('capturas en', out, '| errores de consola:', consoleErrors.length ? consoleErrors : 'ninguno');
})();
