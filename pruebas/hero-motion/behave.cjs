// Pruebas de comportamiento del Hero.
// Uso: node behave.js <distDir> <puerto> <before|after>
const fs = require('fs');
const path = require('path');
const { startServer, VIEWPORTS, newContext, chromium, SP } = require('./harness.cjs');

const [dist, port, which] = process.argv.slice(2);
const URL_ = `http://127.0.0.1:${port}/`;
const results = [];
const consoleErrors = [];
const rec = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  →  ' + detail : ''}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fresh(browser, vpName = 'd1440', opts = {}) {
  const vp = VIEWPORTS.find((v) => v.name === vpName);
  const ctx = await newContext(browser, vp, opts);
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) consoleErrors.push(`${vpName}: ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleErrors.push(`${vpName} pageerror: ${e.message}`));
  return { ctx, page };
}

const DOTS = 'main > section button[aria-label^="Ir a diapositiva"]';
const idx = (page) =>
  page.evaluate((sel) => {
    const d = [...document.querySelectorAll(sel)];
    let i = d.findIndex((b) => b.getAttribute('aria-current') === 'true');
    if (i < 0) i = d.findIndex((b) => b.className.includes('w-8'));
    return i;
  }, DOTS);
const label = (page) => page.evaluate(() => document.activeElement && (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim()));

async function test(name, fn) {
  try { await fn(); } catch (e) { rec(name, false, 'EXCEPCIÓN: ' + String(e.message).split('\n')[0]); }
}

(async () => {
  const server = await startServer(path.resolve(dist), Number(port));
  const browser = await chromium.launch();

  // ---------- PARIDAD (antes y después) ----------------------------------------
  await test('Paridad: enlaces, textos y posiciones', async () => {
    const out = { links: null, texts: {}, ctaTop: {} };
    for (const vpName of ['m390', 't768', 'd1440']) {
      const { ctx, page } = await fresh(browser, vpName);
      await page.goto(URL_, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.mouse.move(2, 100);
      if (!out.links) {
        out.links = await page.evaluate(() =>
          [...document.querySelectorAll('main > section a')].map((a) => [a.getAttribute('href'), a.target, a.rel, a.textContent.trim()]),
        );
        out.h1 = await page.evaluate(() => document.querySelector('main > section h1').textContent.replace(/\s+/g, ' ').trim());
        out.badge = await page.evaluate(() => [...document.querySelectorAll('main > section span')].map((s) => s.textContent.trim()).filter((t) => /TERAPEUTAS CERTIFICADAS$/.test(t)));
      }
      out.texts[vpName] = [];
      out.ctaTop[vpName] = [];
      for (let i = 0; i < 5; i++) {
        await page.locator(DOTS).nth(i).click({ force: true });
        await page.mouse.move(2, 100);
        await sleep(1800);
        const snap = await page.evaluate(() => {
          const s = document.querySelector('main > section');
          const pill = s.querySelector('.rounded-full.inline-flex span, div.inline-flex span');
          const h2 = s.querySelector('h2'); const p = s.querySelector('h2 + p');
          const a = [...s.querySelectorAll('a')].find((x) => /Reservar Ahora/.test(x.textContent));
          return { tag: pill && pill.textContent.trim(), h2: h2.textContent.trim(), p: p.textContent.trim(), top: a.getBoundingClientRect().top + window.scrollY };
        });
        out.texts[vpName].push([snap.tag, snap.h2, snap.p]);
        out.ctaTop[vpName].push(snap.top);
      }
      await ctx.close();
    }
    const file = path.join(SP, `parity.${which}.json`);
    fs.writeFileSync(file, JSON.stringify(out, null, 1));
    const jumps = Object.fromEntries(Object.entries(out.ctaTop).map(([k, v]) => [k, +(Math.max(...v) - Math.min(...v)).toFixed(1)]));
    rec(`Salto de texto entre diapositivas (px, top de "Reservar Ahora" entre las 5): ${which}`, true, JSON.stringify(jumps));
    if (which === 'after') {
      const b = JSON.parse(fs.readFileSync(path.join(SP, 'parity.before.json'), 'utf8'));
      rec('Enlaces del Hero idénticos (href/target/rel/texto)', JSON.stringify(b.links) === JSON.stringify(out.links), `${out.links.length} enlaces`);
      rec('Título H1 idéntico', b.h1 === out.h1, out.h1);
      const bt = JSON.stringify(b.texts).split('Sterilizados').join('Esterilizados'); // única diferencia autorizada: la errata
      rec('Textos de las 5 diapositivas idénticos (3 tamaños), salvo la errata corregida', bt === JSON.stringify(out.texts));
      rec('Errata corregida: "Camilla y Blancos Esterilizados" (y ya no existe "Sterilizados")', JSON.stringify(out.texts).includes('Camilla y Blancos Esterilizados') && !JSON.stringify(out.texts).includes('Sterilizados'));
      rec('Badge idéntico', JSON.stringify(b.badge) === JSON.stringify(out.badge));
      const jb = Object.fromEntries(Object.entries(b.ctaTop).map(([k, v]) => [k, +(Math.max(...v) - Math.min(...v)).toFixed(1)]));
      rec('Salto de texto no empeora respecto al original', Object.keys(jb).every((k) => jumps[k] <= jb[k] + 0.5), `antes ${JSON.stringify(jb)} · después ${JSON.stringify(jumps)}`);
    }
  });

  await test(`Enlace "Reservar Ahora" + evento Lead (${which})`, async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' });
    const [popup] = await Promise.all([
      page.waitForEvent('popup', { timeout: 5000 }),
      page.locator('main > section a', { hasText: 'Reservar Ahora' }).click(),
    ]);
    const fb = await page.evaluate(() => window.__fbq.filter((e) => e[1] === 'Lead'));
    rec(`Reservar Ahora abre essenya.app/cliente (${which})`, /essenya\.app\/cliente/.test(popup.url()), popup.url());
    rec(`Evento Lead de Meta Pixel se dispara (${which})`, fb.length === 1 && fb[0][2].content_name === 'Reservar Ahora', JSON.stringify(fb));
    await ctx.close();
  });

  await test(`Suavidad del cambio de texto: desplazamiento máx. por fotograma (${which})`, async () => {
    const res = {}; const stepsRes = {};
    for (const vpName of ['m390', 't768', 'd1440']) {
      const { ctx, page } = await fresh(browser, vpName);
      await page.goto(URL_, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.mouse.move(2, 100);
      await sleep(1600);
      let worst = 0; let steps = 0;
      for (let k = 0; k < 5; k++) {
        await page.evaluate(() => {
          window.__gen = (window.__gen || 0) + 1; const gen = window.__gen; window.__s = [];
          const a = [...document.querySelectorAll('main > section a')].find((x) => /Reservar Ahora/.test(x.textContent));
          const loop = () => { if (window.__gen !== gen) return; window.__s.push([performance.now(), a.getBoundingClientRect().top]); requestAnimationFrame(loop); };
          requestAnimationFrame(loop);
        });
        await sleep(250); // muestras de referencia antes del clic
        await page.locator('button[aria-label="Siguiente imagen"]:visible').click({ force: true });
        await page.mouse.move(2, 100);
        await sleep(1700);
        const s = await page.evaluate(() => { window.__gen += 1; return window.__s; });
        for (let i = 0; i < s.length; i++) {
          let j = i + 1;
          while (j < s.length && s[j][0] - s[i][0] < 30) j++; // ventanas de al menos 30 ms (evita artefactos de callbacks pegados)
          if (j >= s.length) break;
          worst = Math.max(worst, (Math.abs(s[j][1] - s[i][1]) / (s[j][0] - s[i][0])) * 16.7); // px por 16.7 ms
        }
        steps = Math.max(steps, new Set(s.map((v) => Math.round(v[1] * 2) / 2)).size);
      }
      res[vpName] = +worst.toFixed(2); stepsRes[vpName] = steps;
      await ctx.close();
    }
    fs.writeFileSync(path.join(SP, `smooth.${which}.json`), JSON.stringify(res));
    rec(`Velocidad máxima del botón al cambiar de texto, px por 16.7 ms (${which})`, true, JSON.stringify(res) + ' px · posiciones distintas (medio px) vistas: ' + JSON.stringify(stepsRes));
    if (which === 'after') {
      const b = JSON.parse(fs.readFileSync(path.join(SP, 'smooth.before.json'), 'utf8'));
      rec('El brinco desaparece: movimiento progresivo ≤ 1.5 px por 16.7 ms (antes: 11–15 px de golpe)', Object.values(res).every((v) => v <= 1.5) && Object.values(stepsRes).every((n) => n >= 8), `antes ${JSON.stringify(b)} · después ${JSON.stringify(res)}`);
    }
  });

  if (which !== 'after') { await browser.close(); server.close(); return finish(); }

  // ---------- SOLO DESPUÉS ------------------------------------------------------

  await test('Contenido visible aunque las animaciones no se ejecuten', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main > section .hero-rise', { state: 'attached' });
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    const r = await page.evaluate(() => {
      const els = [...document.querySelectorAll('main > section .hero-rise, main > section .hero-fade, main > section .hero-line-up, main > section .hero-glint')];
      const bad = els.filter((e) => { const c = getComputedStyle(e); return c.opacity !== '1' || (c.transform !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(c.transform)); }).map((e) => e.className);
      const veil = getComputedStyle(document.querySelector('.hero-veil')).opacity;
      return { n: els.length, bad, veil };
    });
    rec('Sin animaciones: todos los elementos del Hero visibles (opacidad 1, sin desplazamiento)', r.n >= 11 && r.bad.length === 0 && r.veil === '0', `${r.n} elementos, ${r.bad.length} ocultos, velo=${r.veil}`);
    await ctx.close();
  });

  await test('Enlaces utilizables desde el primer instante', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main > section a[href*="essenya.app/cliente"]', { state: 'attached' });
    const t = await page.evaluate(() => Math.round(performance.now()));
    const props = await page.evaluate(() => [...document.querySelectorAll('main > section a, main > section button')].map((e) => getComputedStyle(e).pointerEvents));
    const [popup] = await Promise.all([
      page.waitForEvent('popup', { timeout: 5000 }),
      page.locator('main > section a', { hasText: 'Reservar Ahora' }).click({ force: true }),
    ]);
    const anim = await page.evaluate(() => document.querySelector('main > section').getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length);
    rec('Clic en "Reservar Ahora" durante la entrada abre el enlace', /essenya\.app\/cliente/.test(popup.url()), `clic a los ~${t} ms de carga, ${anim} animaciones aún en curso`);
    rec('Ningún control con pointer-events:none', props.every((p) => p !== 'none'), `${props.length} controles`);
    await ctx.close();
  });

  await test('Autoplay: 7 s entre diapositivas', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' });
    await page.mouse.move(2, 2);
    await page.evaluate((sel) => {
      window.__ch = []; let last = -1; const t0 = performance.now(); window.__t0 = t0;
      setInterval(() => {
        const d = [...document.querySelectorAll(sel)]; const i = d.findIndex((b) => b.getAttribute('aria-current') === 'true');
        if (i !== last) { window.__ch.push([Math.round(performance.now() - t0), i]); last = i; }
      }, 40);
    }, DOTS);
    await sleep(22500);
    const ch = await page.evaluate(() => window.__ch);
    const deltas = ch.slice(1).map((c, k) => c[0] - ch[k][0]);
    rec('Autoplay avanza cada 7 s (±200 ms)', deltas.length >= 3 && deltas.every((d) => Math.abs(d - 7000) < 200), `cambios en ${JSON.stringify(ch)} · intervalos ${JSON.stringify(deltas)}`);
    await ctx.close();
  });

  await test('Pausa explícita y reanudación', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' }); await page.mouse.move(2, 2);
    const btn = page.locator('button[aria-label="Pausar carrusel"]');
    await btn.click();
    const lab1 = await page.locator('main > section button[aria-label="Reanudar carrusel"]').count();
    await page.mouse.move(2, 2);
    await sleep(8500);
    const i1 = await idx(page);
    const settle = await page.evaluate(() => document.querySelector('.hero-settle').getAnimations().map((a) => a.playState));
    rec('Pausa: el botón cambia a "Reanudar" y no hay cambio de diapositiva en 8.5 s', lab1 === 1 && i1 === 0, `idx=${i1}`);
    rec('Pausa explícita congela el asentamiento de la foto', settle.every((s) => s === 'paused'), JSON.stringify(settle));
    await page.locator('button[aria-label="Reanudar carrusel"]').click(); await page.mouse.move(2, 2);
    const t0 = Date.now();
    await page.waitForFunction((sel) => { const d = [...document.querySelectorAll(sel)]; return d.findIndex((b) => b.getAttribute('aria-current') === 'true') === 1; }, DOTS, { timeout: 9000, polling: 50 });
    const dt = Date.now() - t0;
    rec('Play: reanuda con un ciclo completo de ~7 s', Math.abs(dt - 7000) < 300, `${dt} ms`);
    await ctx.close();
  });

  await test('Navegación manual detiene el autoplay hasta Play', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' }); await page.mouse.move(2, 2);
    await page.click('button[aria-label="Siguiente imagen"]:visible'); await page.mouse.move(2, 2);
    await sleep(400);
    const settle = await page.evaluate(() => [...document.querySelectorAll('.hero-settle')].flatMap((e) => e.getAnimations().map((a) => a.playState)));
    await sleep(8500);
    const i = await idx(page);
    const lab = await page.locator('button[aria-label="Reanudar carrusel"]').count();
    rec('Tras "Siguiente" el autoplay queda detenido (8.5 s sin cambios)', i === 1 && lab === 1, `idx=${i}`);
    rec('Navegar a mano NO congela el asentamiento de la nueva foto (se está ejecutando)', settle.length >= 1 && settle.every((s) => s === 'running'), JSON.stringify(settle));
    await page.click('button[aria-label="Anterior imagen"]:visible'); await page.click('button[aria-label="Ir a diapositiva 4"]');
    rec('Flecha anterior y puntos funcionan', (await idx(page)) === 3);
    await ctx.close();
  });

  await test('Pausa con el mouse encima / reanuda al salir', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' });
    await page.mouse.move(720, 200); // sobre el Hero, lejos de los controles
    await sleep(8500);
    const i1 = await idx(page);
    await page.mouse.move(2, 2); // fuera del Hero (header)
    const t0 = Date.now();
    await page.waitForFunction((sel) => [...document.querySelectorAll(sel)].findIndex((b) => b.getAttribute('aria-current') === 'true') === 1, DOTS, { timeout: 9000, polling: 50 });
    rec('Hover pausa el autoplay (8.5 s) y al salir reanuda ~7 s', i1 === 0 && Math.abs(Date.now() - t0 - 7000) < 300, `idx hover=${i1}, reanuda en ${Date.now() - t0} ms`);
    await ctx.close();
  });

  await test('Pausa con el Hero fuera de pantalla', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' }); await page.mouse.move(2, 2);
    await page.evaluate(() => window.scrollTo(0, 2600));
    await sleep(8500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(600);
    const i1 = await idx(page);
    rec('Fuera de pantalla el autoplay no avanza (8.5 s)', i1 === 0, `idx=${i1}`);
    await ctx.close();
  });

  await test('Teclado: orden de Tab, foco visible y flechas', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' }); await page.mouse.move(2, 2);
    const seq = [];
    let ring = null;
    for (let k = 0; k < 45; k++) {
      await page.keyboard.press('Tab');
      const l = await label(page);
      if (l && /Anterior imagen|Siguiente imagen|Portal Cliente|Reservar Ahora|Ver Servicios|Pausar carrusel|Reanudar carrusel|Ir a diapositiva/.test(l)) {
        seq.push(l);
        if (!ring) ring = await page.evaluate(() => { const c = getComputedStyle(document.activeElement); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.outlineOffset]; });
      }
      if (/Ir a diapositiva 5/.test(l || '')) break;
    }
    const expected = ['Anterior imagen', 'Siguiente imagen', 'Portal Cliente', 'Reservar Ahora', 'Ver Servicios', 'Pausar carrusel', 'Ir a diapositiva 1', 'Ir a diapositiva 2', 'Ir a diapositiva 3', 'Ir a diapositiva 4', 'Ir a diapositiva 5'];
    rec('Orden de Tab del Hero', JSON.stringify(seq) === JSON.stringify(expected), JSON.stringify(seq));
    rec('Anillo de foco visible con teclado (2 px dorado)', ring && ring[0] === 'solid' && ring[1] === '2px' && /197, 160, 89/.test(ring[2]), JSON.stringify(ring));
    // flechas sobre los controles
    await page.focus('button[aria-label="Siguiente imagen"]:visible');
    await page.keyboard.press('ArrowRight'); await sleep(50);
    const a = await idx(page);
    await page.keyboard.press('ArrowRight'); await sleep(50);
    const b = await idx(page);
    await page.keyboard.press('ArrowLeft'); await sleep(50);
    const c = await idx(page);
    rec('Flechas ←/→ cambian de diapositiva desde los controles', a === 1 && b === 2 && c === 1, `${a},${b},${c}`);
    await page.focus('main > section a[href*="essenya.app"] >> nth=1');
    await page.keyboard.press('ArrowRight'); await sleep(50);
    rec('Flechas NO actúan desde los enlaces (no se secuestra el teclado)', (await idx(page)) === 1);
    await ctx.close();
  });

  await test('Swipe en móvil', async () => {
    const { ctx, page } = await fresh(browser, 'm390');
    await page.goto(URL_, { waitUntil: 'load' });
    const cdp = await ctx.newCDPSession(page);
    const swipe = async (x1, y1, x2, y2) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1 }] });
      for (let s = 1; s <= 8; s++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + ((x2 - x1) * s) / 8, y: y1 + ((y2 - y1) * s) / 8 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(150);
    };
    await swipe(300, 215, 100, 215); const a = await idx(page);
    await swipe(100, 215, 300, 215); const b = await idx(page);
    await swipe(250, 215, 220, 215); const c = await idx(page); // corto: no cambia
    const lab = await page.locator('button[aria-label="Reanudar carrusel"]').count();
    rec('Swipe izquierda → siguiente, derecha → anterior, corto → nada', a === 1 && b === 0 && c === 0, `${a},${b},${c}`);
    rec('El swipe detiene el autoplay (botón en "Reanudar")', lab === 1);
    const r = await page.locator('main > section a', { hasText: 'Reservar Ahora' }).boundingBox();
    await swipe(r.x + r.width - 20, r.y + 10, r.x + 20, r.y + 10); const d = await idx(page);
    rec('Un gesto que empieza sobre un botón no cambia de diapositiva', d === 0, `idx=${d}`);
    const y0 = await page.evaluate(() => window.scrollY);
    await swipe(200, 600, 200, 300); const e = await idx(page); const y1 = await page.evaluate(() => window.scrollY);
    rec('Scroll vertical con el dedo sigue funcionando y no cambia la diapositiva', e === 0 && y1 > y0, `idx=${e}, scrollY ${y0}→${y1}`);
    await ctx.close();
  });

  await test('Clics rápidos (transición interrumpida)', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' }); await page.mouse.move(2, 2);
    const next = page.locator('button[aria-label="Siguiente imagen"]:visible');
    let maxImgs = 0;
    for (let k = 0; k < 7; k++) {
      await next.click({ force: true, delay: 10 });
      maxImgs = Math.max(maxImgs, await page.evaluate(() => document.querySelectorAll('main > section:first-child img').length));
      await sleep(110);
    }
    await sleep(1700);
    const imgs = await page.evaluate(() => document.querySelectorAll('main > section:first-child img').length);
    const i = await idx(page);
    const txt = await page.evaluate(() => ({ h2: document.querySelector('main > section h2').textContent, op: getComputedStyle(document.querySelector('main > section h2')).opacity }));
    rec('7 clics rápidos: máx. 3 capas, queda 1, diapositiva final correcta y texto visible', maxImgs <= 3 && imgs === 1 && i === 2 && txt.op === '1', `máx capas=${maxImgs}, capas finales=${imgs}, idx=${i}, h2="${txt.h2}" opacidad=${txt.op}`);
    await ctx.close();
  });

  await test('Reducir movimiento', async () => {
    const { ctx, page } = await fresh(browser, 'd1440', { reducedMotion: 'reduce' });
    await page.goto(URL_, { waitUntil: 'load' }); await page.mouse.move(2, 2);
    await sleep(600);
    const run = await page.evaluate(() => document.querySelector('main > section').getAnimations({ subtree: true }).filter((a) => a.playState === 'running').map((a) => a.animationName || a.transitionProperty));
    const vis = await page.evaluate(() => [...document.querySelectorAll('main > section .hero-rise, main > section .hero-line-up, main > section .hero-fade')].every((e) => getComputedStyle(e).opacity === '1'));
    rec('Sin animaciones en marcha y contenido visible', run.length === 0 && vis, `animaciones=${JSON.stringify(run)}`);
    await sleep(8000);
    rec('Autoplay empieza detenido (8 s sin cambios) con botón "Reanudar"', (await idx(page)) === 0 && (await page.locator('button[aria-label="Reanudar carrusel"]').count()) === 1);
    await page.click('button[aria-label="Siguiente imagen"]:visible'); await sleep(900);
    const t = await page.evaluate(() => ({ i: [...document.querySelectorAll('main > section button[aria-label^="Ir a"]')].findIndex((b) => b.getAttribute('aria-current') === 'true'), op: getComputedStyle(document.querySelector('main > section h2')).opacity, h2: document.querySelector('main > section h2').textContent }));
    rec('La navegación manual funciona con fundidos cortos y el texto cambia', t.i === 1 && t.op === '1' && /Técnicas/.test(t.h2), JSON.stringify(t));
    await ctx.close();
  });

  await test('Hover sobre "Reservar Ahora": elevación y destello', async () => {
    const { ctx, page } = await fresh(browser, 'd1440');
    await page.goto(URL_, { waitUntil: 'load' }); await sleep(2200);
    const a = page.locator('main > section a', { hasText: 'Reservar Ahora' });
    const before = await a.evaluate((e) => ({ img: getComputedStyle(e).backgroundImage, tr: getComputedStyle(e).translate }));
    await a.hover(); await sleep(300);
    const mid = await a.evaluate((e) => ({ img: getComputedStyle(e).backgroundImage.slice(0, 40), pos: getComputedStyle(e).backgroundPosition, tr: getComputedStyle(e).translate }));
    await sleep(600);
    rec('Hover: sube 1 px y aparece el destello (gradiente) con barrido', before.img === 'none' && /linear-gradient/.test(mid.img) && /^0px -1px$/.test(mid.tr), `reposo=${JSON.stringify(before)} hover(300ms)=${JSON.stringify(mid)}`);
    await ctx.close();
  });

  await browser.close();
  server.close();
  finish();
})();

function finish() {
  const fails = results.filter((r) => !r.ok);
  console.log(`\n==== ${which}: ${results.length - fails.length}/${results.length} pruebas OK · errores de consola: ${consoleErrors.length ? JSON.stringify(consoleErrors) : 'ninguno'}`);
  fs.writeFileSync(path.join(SP, `results.${which}.json`), JSON.stringify({ results, consoleErrors }, null, 1));
}
