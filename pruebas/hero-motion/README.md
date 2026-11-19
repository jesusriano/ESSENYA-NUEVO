# Pruebas del Hero (Hero Motion)

Pruebas automáticas que se usaron para validar el Hero de la portada: movimiento, carrusel, flechas en móvil,
accesibilidad, rendimiento y que el reposo se vea **idéntico** al diseño original.

> **No forman parte del sitio.** Vite no las compila ni Vercel las usa: son herramientas para quien desarrolla.
> Los archivos son `.cjs` porque el proyecto es de tipo módulo ES (`"type": "module"`).

## Requisitos
- Node 22 y **Playwright con Chromium** instalado (global o en tu máquina). No es dependencia del proyecto.
- Python 3 con `Pillow` y `numpy` (solo para `diff.py`).
- Las dependencias del proyecto instaladas (`bun install`) para poder compilar.

## Preparar los builds
Las pruebas comparan dos versiones compiladas. Se pasan como carpetas (`dist-before` y `dist-after`):

```bash
# "después": la versión actual
bun run build && cp -r dist pruebas/hero-motion/dist-after

# "antes": el diseño original, commit 458283d (Hero sin movimiento)
git worktree add ../essenya-antes 458283d
(cd ../essenya-antes && bun install && bun run build) && cp -r ../essenya-antes/dist pruebas/hero-motion/dist-before
```

## Ejecutar (desde `pruebas/hero-motion/`)
Los scripts bloquean la analítica real (GTM, Google Analytics, Meta Pixel) y sirven `essenya.app` como página vacía:
**nunca envían datos a tus cuentas ni tocan el sitio de reservas.**

| Qué se prueba | Comando |
|---|---|
| Funcionales: autoplay, pausa, teclado, swipe, enlaces, evento `Lead`, reducir movimiento | `node behave.cjs dist-before 4101 before` y luego `node behave.cjs dist-after 4102 after` |
| Pausa con pestaña oculta y con foco de teclado | `node extra.cjs` (usa `dist-after`) |
| Flechas sin tapar el texto, por ancho (280–1440 px) | `node overlap.cjs dist-after 4103 after` |
| Hueco entre flechas y titular (móvil) | `node gap.cjs dist-after 4104` |
| 12 teléfonos y tablets **emulados en Chromium** | `node devices.cjs dist-after 4105 shots/devices` |
| Accesibilidad: nombres, ARIA y contraste real | `node a11y.cjs dist-after 4106 after` |
| Rendimiento antes/después (móvil, CPU 4×, 4G lenta) | `node perf.cjs 10` |
| Compatibilidad de funciones web con la base de `caniuse-lite` | `node caniuse.cjs` |

### Comparación visual (píxel a píxel)
```bash
node capture.cjs dist-before 4111 shots/before no-preference
node capture.cjs dist-after  4112 shots/after  no-preference
# máscaras permitidas: botón de pausa (siempre), flechas en móvil y la línea corregida de la diapositiva 3
MASK_ARROWS=m390 MASK_H2=3 python3 -I diff.py shots/before shots/after
```
El objetivo es **0 píxeles distintos** fuera de las zonas enmascaradas.

## Límites (importante)
- Todo corre en **Chromium**. **No** prueba Safari/WebKit ni Firefox, ni dispositivos reales: la emulación de iPhone,
  Android o iPad solo reproduce tamaño, densidad y tacto, no el motor del navegador.
- Safari tiene un historial de parpadeo con `backdrop-filter` al animar opacidad o transform sobre el mismo elemento.
  Conviene revisar la entrada del Hero en un iPhone real.
- Las métricas de rendimiento usan renderizado por software (sin GPU): son conservadoras y sirven para comparar
  antes/después, no como valores absolutos.

## Resultados de la validación
Ver `resultados-2026-11-19.txt` (36/36 pruebas funcionales, 108/108 comprobaciones en dispositivos emulados,
reposo idéntico al original).

## Archivos que genera cada ejecución
`parity.*.json`, `smooth.*.json`, `results.*.json`, `devices.after.json`, `overlap.*.json`, `a11y.*.json`,
carpetas `shots/`, `video/`, `dist-*/`. Están en el `.gitignore` de esta carpeta.
