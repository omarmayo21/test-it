#!/usr/bin/env python3
"""Render workspace screenshots as coarse luminance maps + colour statistics,
so the composition can be inspected without an image viewer."""
import sys, glob, os
from PIL import Image

RAMP = " .:-=+*#%@"

def stats(im):
    px = im.convert('RGB')
    w, h = px.size
    small = px.resize((160, 100))
    p = small.load()
    lum_sum = 0; cyan = 0; white = 0; n = 0
    for y in range(100):
        for x in range(160):
            r, g, b = p[x, y]
            l = 0.299*r + 0.587*g + 0.114*b
            lum_sum += l; n += 1
            if g > 90 and b > 90 and r < g - 45 and r < b - 45: cyan += 1
            if l > 175: white += 1
    return lum_sum/n, cyan/n*100, white/n*100

def art(path, cols=104, rows=34):
    im = Image.open(path).convert('RGB')
    W, H = im.size
    small = im.resize((cols, rows), Image.LANCZOS)
    p = small.load()
    out = []
    for y in range(rows):
        line = ''
        for x in range(cols):
            r, g, b = p[x, y]
            l = 0.299*r + 0.587*g + 0.114*b
            cyanish = (g > 70 and b > 70 and r < g - 35 and r < b - 35)
            if cyanish and l > 34:
                line += 'C' if l > 70 else 'c'
            else:
                line += RAMP[min(9, int((l/255) ** 0.62 * 10))]
        out.append(line)
    return W, H, out

for f in sys.argv[1:]:
    files = sorted(glob.glob(f)) if any(c in f for c in '*?') else [f]
    for path in files:
        if not os.path.exists(path):
            print('missing', path); continue
        im = Image.open(path)
        L, C, Wt = stats(im)
        W, H, rows = art(path)
        print('\n' + '═' * 108)
        print(f'  {path}   {W}×{H}   mean-lum {L:5.1f}   cyan {C:4.1f}%   bright(text) {Wt:4.1f}%')
        print('═' * 108)
        for r in rows:
            print('  ' + r)
