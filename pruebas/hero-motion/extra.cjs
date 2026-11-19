const path = require('path');
const { startServer, VIEWPORTS, newContext, chromium } = require('./harness.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DOTS = 'main > section button[aria-label^="Ir a diapositiva"]';
const idx = (page) => page.evaluate((sel) => [...document.querySelectorAll(sel)].findIndex((b) => b.getAttribute('aria-current') === 'true'), DOTS);
(async () => {
  const server = await startServer(path.resolve('dist-after'), 4201);
  const browser = await chromium.launch();
  const vp = VIEWPORTS.find((v) => v.name === 'd1440');
  // 1) pestaña oculta
  let ctx = await newContext(browser, vp); let page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4201/', { waitUntil: 'load' }); await page.mouse.move(2, 2);
  await sleep(1000);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await sleep(8500);
  const hiddenIdx = await idx(page);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  const t0 = Date.now();
  await page.waitForFunction((sel) => [...document.querySelectorAll(sel)].findIndex((b) => b.getAttribute('aria-current') === 'true') === 1, DOTS, { timeout: 9000, polling: 50 });
  console.log(hiddenIdx === 0 ? 'PASS' : 'FAIL', 'Pestaña oculta: no avanza en 8.5 s; al volver reanuda con ciclo de', Date.now() - t0, 'ms (idx oculta =', hiddenIdx + ')');
  await ctx.close();
  // 2) foco de teclado dentro del carrusel pausa el autoplay
  ctx = await newContext(browser, vp); page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4201/', { waitUntil: 'load' }); await page.mouse.move(2, 2);
  for (let k = 0; k < 40; k++) { await page.keyboard.press('Tab'); const l = await page.evaluate(() => document.activeElement.getAttribute('aria-label')); if (l === 'Anterior imagen') break; }
  await sleep(8500);
  const focusIdx = await idx(page);
  const lab = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
  console.log(focusIdx === 0 ? 'PASS' : 'FAIL', 'Foco de teclado en el carrusel ("' + lab + '"): autoplay en pausa 8.5 s (idx =', focusIdx + ')');
  await page.evaluate(() => document.activeElement.blur());
  await page.mouse.click(720, 120); // fuera de controles, dentro del Hero (clic de mouse no activa :focus-visible)
  await page.mouse.move(2, 2);
  const t1 = Date.now();
  await page.waitForFunction((sel) => [...document.querySelectorAll(sel)].findIndex((b) => b.getAttribute('aria-current') === 'true') === 1, DOTS, { timeout: 9500, polling: 50 });
  console.log('PASS', 'Al quitar el foco el autoplay reanuda tras', Date.now() - t1, 'ms');
  await ctx.close();
  await browser.close(); server.close();
})();
