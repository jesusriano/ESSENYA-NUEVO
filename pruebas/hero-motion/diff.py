"""Compara capturas antes/después. Uso: python3 -I diff.py <antes> <despues> [salida_diff]"""
import sys, os, glob
import numpy as np
from PIL import Image

before, after = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else None
if out:
    os.makedirs(out, exist_ok=True)

import json
def load(d):
    f = os.path.join(d, 'rects.json')
    return json.load(open(f)) if os.path.exists(f) else {}
rects_b, rects_a = load(before), load(after)
MASK_ARROWS = os.environ.get('MASK_ARROWS', '')   # p.ej. "m390"
MASK_H2_SLIDES = os.environ.get('MASK_H2', '')    # p.ej. "3" (línea corregida de la errata)
def mask(d, r, k, m):
    x0=int(max(0,(r['x']-m)*k)); y0=int(max(0,(r['y']-m)*k)); x1=int((r['x']+r['w']+m)*k); y1=int((r['y']+r['h']+m)*k)
    d[y0:y1, x0:x1] = 0
rows = []
for f in sorted(glob.glob(os.path.join(before, '*.png'))):
    name = os.path.basename(f)
    g = os.path.join(after, name)
    a = np.asarray(Image.open(f).convert('RGB')).astype(int)
    b = np.asarray(Image.open(g).convert('RGB')).astype(int)
    if a.shape != b.shape:
        rows.append((name, 'TAMAÑO DISTINTO', a.shape, b.shape))
        continue
    d = np.abs(a - b).max(axis=2)
    key = name[:-4]; vpn, sn = key.split('_s')
    ra, rb = rects_a.get(key), rects_b.get(key)
    if ra:
        k = ra['dsf']
        if ra.get('pause'): mask(d, ra['pause'], k, 6)             # botón de pausa (nuevo)
        if vpn in MASK_ARROWS.split(','):
            for r in (ra.get('arrows') or []) + ((rb or {}).get('arrows') or []): mask(d, r, k, 8)  # flechas: posición nueva y antigua
        if sn in MASK_H2_SLIDES.split(','):
            for r in (ra['h2'], (rb or {}).get('h2')):
                if r: mask(d, r, k, 4)                              # texto corregido (errata)
    n0 = int((d > 0).sum())
    n8 = int((d > 8).sum())
    n32 = int((d > 32).sum())
    bbox = None
    if n8:
        ys, xs = np.where(d > 8)
        bbox = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))
    rows.append((name, n0, n8, n32, bbox, round(100 * n8 / d.size, 4)))
    if out and n0:
        heat = np.zeros((*d.shape, 3), dtype=np.uint8)
        heat[..., 0] = np.clip(d * 8, 0, 255)
        base = (b * 0.35).astype(np.uint8)
        comp = np.clip(base + heat, 0, 255).astype(np.uint8)
        Image.fromarray(comp).save(os.path.join(out, name))

print(f"{'archivo':16} {'px>0':>9} {'px>8':>9} {'px>32':>8} {'%>8':>8}  bbox(>8)")
for r in rows:
    if len(r) == 6:
        print(f"{r[0]:16} {r[1]:>9} {r[2]:>9} {r[3]:>8} {r[5]:>8}  {r[4]}")
    else:
        print(r)
