from PIL import Image, ImageFilter, ImageDraw
import numpy as np
from pathlib import Path

SRC = Path('assets/olen-splash.png')
OUT = Path('assets/olen')
OUT.mkdir(parents=True, exist_ok=True)

src = Image.open(SRC).convert('RGB')

# Every output is a real RGBA PNG. Dark master background is removed and
# transparent margins are trimmed. We keep the original artwork pixels.
def extract(name, box, lo=24, hi=105, pad=8):
    crop = src.crop(box).convert('RGB')
    arr = np.asarray(crop).astype(np.float32)
    # Use luminance/max-channel keying so the black master background becomes alpha.
    mx = arr.max(axis=2)
    alpha = np.clip((mx - lo) / max(1, hi - lo), 0, 1)
    alpha[mx <= lo] = 0
    a = Image.fromarray((alpha * 255).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(0.30))
    rgba = crop.convert('RGBA')
    rgba.putalpha(a)
    bb = rgba.getchannel('A').getbbox()
    if bb:
        rgba = rgba.crop((max(0,bb[0]-pad), max(0,bb[1]-pad), min(rgba.width,bb[2]+pad), min(rgba.height,bb[3]+pad)))
    rgba.save(OUT / name, 'PNG', optimize=True)

# 14 independent OLEN assets for the native Canvas splash.
# Top identity
extract('01-olen-chevron.png', (400, 105, 1135, 690), 55, 135)
extract('02-olen-star.png', (650, 500, 885, 770), 35, 110)
extract('03-olen-symbol.png', (300, 15, 1235, 835), 55, 135)
extract('04-olen-wordmark.png', (235, 815, 1305, 1060), 55, 135)
extract('05-olen-tagline.png', (115, 1060, 1430, 1148), 45, 120)
extract('06-olen-slogan.png', (295, 1150, 1230, 1288), 35, 105)

# Pillar icons
extract('07-olen-icon-explora.png', (350, 1285, 520, 1435), 25, 95)
extract('08-olen-icon-descobre.png', (575, 1285, 755, 1435), 25, 95)
extract('09-olen-icon-vive.png', (805, 1275, 1010, 1440), 25, 95)
extract('10-olen-icon-repete.png', (1010, 1255, 1270, 1445), 25, 95)

# Pillar labels. These are intentionally isolated from the icons so Canvas can
# animate icon and label independently.
extract('11-olen-label-explora.png', (315, 1400, 550, 1535), 20, 85)
extract('12-olen-label-descobre.png', (545, 1400, 790, 1535), 20, 85)
extract('13-olen-label-vive.png', (805, 1400, 1015, 1535), 20, 85)
extract('14-olen-label-repete.png', (1010, 1400, 1285, 1535), 20, 85)

print('Generated:')
for p in sorted(OUT.glob('*.png')):
    im = Image.open(p)
    print(f'{p} {im.size} {im.mode}')
