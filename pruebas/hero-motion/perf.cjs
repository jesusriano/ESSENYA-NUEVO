// Rendimiento: LCP, CLS, tareas largas y fluidez, antes vs después (móvil 390, CPU 4x, red 4G lenta).
const path = require('path');
const { startServer, VIEWPORTS, newContext, chromium } = require('./harness.cjs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };

(async () => {
  const runs = Number(process.argv[2] || 5);
  const builds = { before: 4131, after: 4132 };
  const servers = {};
  for (const [k, p] of Object.entries(builds)) servers[k] = await startServer(path.resolve(`dist-${k}`), p);
  const browser = await chromium.launch();
  const vp = VIEWPORTS.find((v) => v.name === 'm390');
  const out = {};
  for (const k of ['before', 'after']) {
    const rows = [];
    for (let r = 0; r < runs; r++) {
      const ctx = await newContext(browser, vp);
      const page = await ctx.newPage();
      await ctx.addInitScript(() => {
        window.__perf = { lcp: 0, lcpUrl: '', lcps: [], t0: null, cls: 0, long: 0, frames: [] };
        new PerformanceObserver((l) => { for (const e of l.getEntries()) { const u = (e.url || (e.element && e.element.tagName) || '').split('/').pop(); window.__perf.lcps.push([Math.round(e.startTime), u]); window.__perf.lcp = e.startTime; window.__perf.lcpUrl = u; } }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.long += e.duration; }).observe({ type: 'longtask', buffered: true });
        new MutationObserver(() => { if (window.__perf.t0 === null && document.querySelector('main > section')) window.__perf.t0 = performance.now(); }).observe(document, { childList: true, subtree: true });
        document.addEventListener('DOMContentLoaded', () => {
          let last = performance.now();
          const loop = (t) => { window.__perf.frames.push([t, t - last]); last = t; if (t < 60000) requestAnimationFrame(loop); };
          requestAnimationFrame(loop);
        });
      });
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
      await page.goto(`http://127.0.0.1:${builds[k]}/`, { waitUntil: 'load' });
      await page.mouse.move(195, 330); // sobre el Hero: pausa el autoplay en ambas versiones
      await sleep(11000);
      const p = await page.evaluate(() => window.__perf);
      const t0 = p.t0 || 0;
      const ent = p.frames.filter((f) => f[0] >= t0 && f[0] < t0 + 2500).map((f) => f[1]);
      const steady = p.frames.filter((f) => f[0] >= t0 + 2500 && f[0] < t0 + 9500).map((f) => f[1]);
      const first = p.lcps.find((c) => /hero_spa_slide_bright1/.test(c[1])) || p.lcps[0];
      const finalLcp = p.lcps[p.lcps.length - 1];
      const img = p.lcps.find((c) => /hero_spa_slide_bright1/.test(c[1]));
      rows.push({ lcp: finalLcp[0], imgPaint: img ? img[0] : null, lcpUrl: finalLcp[1], lcpAll: p.lcps, t0, cls: p.cls, long: p.long, entP95: pct(ent, 0.95), entMax: Math.max(...ent), stP95: pct(steady, 0.95), stMax: Math.max(...steady), stSlow: steady.filter((d) => d > 33).length, stN: steady.length });
      await ctx.close();
    }
    out[k] = rows;
  }
  await browser.close();
  Object.values(servers).forEach((s) => s.close());
  const f = (v) => (typeof v === 'number' ? +v.toFixed(2) : v);
  console.log(`Móvil 390×844 · CPU 4× · 4G lenta · ${runs} corridas (mediana)`);
  console.log('métrica'.padEnd(34), 'antes'.padStart(10), 'después'.padStart(10));
  for (const [label, key] of [['LCP final (ms)', 'lcp'], ['CLS', 'cls'], ['Tareas largas totales (ms)', 'long'], ['Fotograma p95, 0–2.5 s tras pintar (ms)', 'entP95'], ['Fotograma máx, 0–2.5 s tras pintar (ms)', 'entMax'], ['Fotograma p95, 2.5–9.5 s (ms)', 'stP95'], ['Fotograma máx, 2.5–9.5 s (ms)', 'stMax'], ['Fotogramas >33 ms, 2.5–9.5 s', 'stSlow'], ['Fotogramas medidos, 2.5–9.5 s', 'stN']]) {
    console.log(label.padEnd(34), String(f(median(out.before.map((r) => r[key])))).padStart(10), String(f(median(out.after.map((r) => r[key])))).padStart(10));
  }
  console.log('LCP elemento:', out.before[0].lcpUrl, '→', out.after[0].lcpUrl);
  console.log('Hero pintado (t0, ms):', out.before.map((r) => Math.round(r.t0)), '→', out.after.map((r) => Math.round(r.t0)));
  console.log('Candidatos LCP (1ª corrida) antes:', JSON.stringify(out.before[0].lcpAll), '\n                             después:', JSON.stringify(out.after[0].lcpAll));
  const sorted = (a) => [...a].sort((x, y) => x - y).map(Math.round);
  console.log('LCP final por corrida (ordenado) antes:', sorted(out.before.map((r) => r.lcp)), '\n                                  después:', sorted(out.after.map((r) => r.lcp)));
  const imgs = (k) => out[k].filter((r) => r.imgPaint !== null).map((r) => r.imgPaint);
  console.log('Corridas en que la foto del Hero fue candidata a LCP: antes', imgs('before').length + '/' + runs, '· después', imgs('after').length + '/' + runs);
  console.log('Momento de pintado de la foto (ms, ordenado) antes:', sorted(imgs('before')), '· después:', sorted(imgs('after')));
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  console.log('LCP final: media antes', Math.round(mean(out.before.map((r) => r.lcp))), '· media después', Math.round(mean(out.after.map((r) => r.lcp))));
})();
