import sys, glob, re
from PIL import Image
def met(p):
    im=Image.open(p).convert('RGB').resize((160,100)); px=im.load()
    n=0; ls=0.0; cy=0; wh=0
    for y in range(100):
        for x in range(160):
            r,g,b=px[x,y]; l=0.299*r+0.587*g+0.114*b; ls+=l; n+=1
            if g>85 and b>85 and r<g-40 and r<b-40: cy+=1
            if l>175: wh+=1
    return ls/n, cy/n*100, wh/n*100
if sys.argv[1:]:
    files=[]
    for a in sys.argv[1:]:
        files += sorted(glob.glob(a)) if any(c in a for c in '*?') else [a]
    for f in files:
        L,C,W = met(f)
        print(f'{f:34s} lum {L:5.1f}   cyan {C:5.2f}%   bright {W:5.2f}%')
