from PIL import Image, ImageFilter, ImageDraw
import numpy as np
from pathlib import Path

SRC = Path('assets/olen-splash.png')
OUT = Path('assets/olen')
OUT.mkdir(parents=True, exist_ok=True)
src = Image.open(SRC).convert('RGB')

# RGBA extraction from the approved 1536x1536 OLEN master.
def keyed(crop, lo=45, hi=125):
    arr=np.asarray(crop).astype(np.float32)
    mx=arr.max(axis=2)
    alpha=np.clip((mx-lo)/max(1,hi-lo),0,1)
    alpha[mx<=lo]=0
    a=Image.fromarray((alpha*255).astype(np.uint8),'L').filter(ImageFilter.GaussianBlur(.25))
    out=crop.convert('RGBA'); out.putalpha(a)
    return out

def trim_save(im,name,pad=6):
    bb=im.getchannel('A').getbbox()
    if bb:
        im=im.crop((max(0,bb[0]-pad),max(0,bb[1]-pad),min(im.width,bb[2]+pad),min(im.height,bb[3]+pad)))
    im.save(OUT/name,'PNG',optimize=True)

def extract(name,box,lo=45,hi=125):
    trim_save(keyed(src.crop(box).convert('RGB'),lo,hi),name)

# 14 independent transparent assets. Coordinates match the approved OLEN master.
# Chevron is geometrically masked so neither ring nor centre star leaks into it.
c=keyed(src.crop((390,100,1160,800)).convert('RGB'),55,135)
m=Image.new('L',c.size,0); d=ImageDraw.Draw(m)
d.polygon([(355,20),(65,440),(65,565),(170,565),(385,270),(600,565),(705,565),(705,440)],fill=255)
d.ellipse((270,390,500,650),fill=0)
c.putalpha(Image.fromarray(np.minimum(np.asarray(c.getchannel('A')),np.asarray(m)).astype(np.uint8)))
trim_save(c,'01-olen-chevron.png')

extract('02-olen-star.png',(630,490,925,810),35,105)
extract('03-olen-symbol.png',(300,20,1245,975),70,150)
extract('04-olen-wordmark.png',(190,880,1345,1140),75,150)
extract('05-olen-tagline.png',(90,1135,1445,1200),80,155)
extract('06-olen-slogan.png',(285,1188,1240,1365),55,125)
extract('07-olen-icon-explora.png',(250,1320,445,1445),35,100)
extract('08-olen-icon-descobre.png',(520,1320,735,1445),35,100)
extract('09-olen-icon-vive.png',(800,1310,1000,1445),35,100)
extract('10-olen-icon-repete.png',(1080,1305,1295,1445),35,100)
extract('11-olen-label-explora.png',(245,1438,450,1505),55,120)
extract('12-olen-label-descobre.png',(515,1438,755,1505),55,120)
extract('13-olen-label-vive.png',(795,1438,1010,1505),55,120)
extract('14-olen-label-repete.png',(1070,1438,1305,1505),55,120)

print('Generated 14 OLEN RGBA assets:')
for p in sorted(OUT.glob('*.png')):
    im=Image.open(p)
    print(f'{p.name}: {im.size} {im.mode}')
