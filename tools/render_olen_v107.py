from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np, math, subprocess, os, sys

W,H=720,1280
FPS=24
DUR=12.0
N=int(FPS*DUR)
BG='assets/olen-background.png'
MASTER='assets/olen-splash.png'
OUT='assets/olen-v10.7-final.mp4'

def cover(im, size):
    sw,sh=im.size; tw,th=size
    s=max(tw/sw, th/sh)
    nw,nh=round(sw*s),round(sh*s)
    im=im.resize((nw,nh),Image.Resampling.LANCZOS)
    x=(nw-tw)//2; y=(nh-th)//2
    return im.crop((x,y,x+tw,y+th))

def clamp(x,a=0,b=1): return max(a,min(b,x))
def ease(x):
    x=clamp(x); return x*x*(3-2*x)
def fade(t,a,b): return ease((t-a)/(b-a)) if b>a else (1 if t>=a else 0)

def make_piece(src, box, lo, hi, outw):
    crop=src.crop(box).convert('RGB')
    arr=np.asarray(crop).astype(np.float32)
    mx=arr.max(axis=2)
    alpha=np.clip((mx-lo)/(hi-lo),0,1)
    alpha[mx<lo]=0
    a=Image.fromarray((alpha*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.45))
    rgba=crop.convert('RGBA'); rgba.putalpha(a)
    scale=outw/rgba.width
    return rgba.resize((outw, max(1,round(rgba.height*scale))), Image.Resampling.LANCZOS)

def alpha_scaled(im, opacity):
    if opacity>=0.999: return im
    out=im.copy(); a=out.getchannel('A').point(lambda p:int(p*opacity)); out.putalpha(a); return out

def paste_center(base, im, cx, cy, opacity=1, scale=1):
    # Centre by the visible artwork, not by transparent crop margins.
    bb=im.getchannel('A').getbbox()
    if bb:
        im=im.crop(bb)
    if scale!=1:
        im=im.resize((max(1,round(im.width*scale)),max(1,round(im.height*scale))),Image.Resampling.LANCZOS)
    im=alpha_scaled(im,opacity)
    base.alpha_composite(im,(round(cx-im.width/2),round(cy-im.height/2)))

bg=cover(Image.open(BG).convert('RGB'),(W,H)).convert('RGBA')
master=Image.open(MASTER).convert('RGB')
astar_src=master.crop((400,130,1130,720)).convert('RGB')
arr=np.asarray(astar_src).astype(np.float32); mx=arr.max(axis=2)
a=np.clip((mx-85)/(175-85),0,1); a[mx<85]=0
yy,xx=np.mgrid[0:a.shape[0],0:a.shape[1]]
a[(yy<85)|(xx<35)|(xx>695)]=0
geom=Image.new('L', astar_src.size, 0); gd=ImageDraw.Draw(geom)
gd.line([(95,430),(365,85),(635,430)], fill=255, width=150, joint='curve')
for px,py in [(95,430),(365,85),(635,430)]: gd.ellipse((px-75,py-75,px+75,py+75),fill=255)
gd.rectangle((285,350,445,575),fill=255)
gd.rectangle((0,455,255,590),fill=0); gd.rectangle((475,455,730,590),fill=0)
gd.rectangle((285,350,445,575),fill=255)
ga=np.asarray(geom).astype(np.float32)/255.0
a=a*ga
astar=astar_src.convert('RGBA'); astar.putalpha(Image.fromarray((a*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.35)))
astar=astar.resize((350,round(astar.height*350/astar.width)),Image.Resampling.LANCZOS)
emblem=make_piece(master,(300,15,1235,835),118,188,420)
olen=make_piece(master,(235,815,1305,1060),110,178,500)
tag=make_piece(master,(115,1060,1430,1148),118,185,560)
sig=make_piece(master,(295,1150,1230,1288),85,165,470)
icon_boxes=[(365,1312,500,1410),(600,1310,730,1410),(835,1302,985,1415),(1025,1280,1255,1430)]
pillar_icons=[make_piece(master,b,35,115,104) for b in icon_boxes]
trimmed=[]
for _im in pillar_icons:
    _bb=_im.getchannel('A').getbbox()
    trimmed.append(_im.crop(_bb) if _bb else _im)
pillar_icons=trimmed

font_candidates=['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']
font_path=next(p for p in font_candidates if os.path.exists(p))
font_bold=font_path.replace('.ttf','-Bold.ttf') if os.path.exists(font_path.replace('.ttf','-Bold.ttf')) else font_path
fgreet=ImageFont.truetype(font_bold,41)
fsub=ImageFont.truetype(font_path,21)
fload=ImageFont.truetype(font_path,16)

cx,cy=360,300
R=155
bar_x,bar_y,bar_w=92,1170,536

def draw_3d_star(base,x,y,size,alpha=255):
    glow=Image.new('RGBA',(W,H),(0,0,0,0)); gd=ImageDraw.Draw(glow)
    gd.polygon([(x,y-size*1.50),(x+size*0.27,y-size*0.20),(x+size*1.08,y),(x+size*0.25,y+size*0.18),(x,y+size*1.50),(x-size*0.25,y+size*0.18),(x-size*1.08,y),(x-size*0.27,y-size*0.20)], fill=(72,228,255,int(92*alpha/255)))
    glow=glow.filter(ImageFilter.GaussianBlur(max(1,size*.48))); base.alpha_composite(glow)
    d=ImageDraw.Draw(base); A=int(alpha)
    top=(x,y-size*1.42); right=(x+size*1.02,y); bottom=(x,y+size*1.42); left=(x-size*1.02,y)
    nw=(x-size*.18,y-size*.12); ne=(x+size*.18,y-size*.12); se=(x+size*.18,y+size*.12); sw=(x-size*.18,y+size*.12); c=(x,y)
    cols=[(224,255,250,A),(104,242,241,A),(62,214,255,A),(34,166,255,A),(45,202,247,A),(95,238,230,A),(110,245,211,A),(178,255,226,A)]
    polys=[[c,nw,top],[c,top,ne],[c,ne,right],[c,right,se],[c,se,bottom],[c,bottom,sw],[c,sw,left],[c,left,nw]]
    for poly,col in zip(polys,cols): d.polygon(poly,fill=col)
    d.line((x,y-size*1.28,x,y+size*1.28),fill=(238,255,255,int(A*.8)),width=max(1,round(size*.055)))
    d.line((x-size*.88,y,x+size*.88,y),fill=(214,255,252,int(A*.65)),width=max(1,round(size*.045)))

def ring_color(q,alpha):
    if q<.33:
        u=q/.33; return (46,int(204+51*u),int(113+83*u),alpha)
    elif q<.66:
        u=(q-.33)/.33; return (31,int(215-17*u),int(196+38*u),alpha)
    else:
        u=(q-.66)/.34; return (41,int(198-91*u),int(234+21*u),alpha)

def draw_3d_ring_progress(base, prog, alpha=255):
    prog=clamp(prog); steps=max(1,int(240*prog))
    glow=Image.new('RGBA',(W,H),(0,0,0,0)); gd=ImageDraw.Draw(glow)
    for j in range(steps):
        a0=90+(360*j/240); a1=90+(360*(j+1)/240)+1.7; q=j/240; c=ring_color(q,int(105*alpha/255))
        gd.arc((cx-R,cy-R,cx+R,cy+R),start=a0,end=a1,fill=c,width=32)
    glow=glow.filter(ImageFilter.GaussianBlur(8)); base.alpha_composite(glow); d=ImageDraw.Draw(base)
    for j in range(steps):
        a0=90+(360*j/240); a1=90+(360*(j+1)/240)+1.7; q=j/240; c=ring_color(q,alpha)
        under=(max(0,c[0]-15),max(0,c[1]-30),max(0,c[2]-18),alpha)
        d.arc((cx-R,cy-R,cx+R,cy+R),start=a0,end=a1,fill=under,width=26)
        d.arc((cx-R,cy-R,cx+R,cy+R),start=a0,end=a1,fill=c,width=21)
        d.arc((cx-R+4,cy-R+4,cx+R-4,cy+R-4),start=a0,end=a1,fill=(220,255,252,int(alpha*.72)),width=3)

cmd=['ffmpeg','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',OUT]
p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
for fi in range(N):
    t=fi/FPS; frame=bg.copy(); frame.alpha_composite(Image.new('RGBA',(W,H),(0,0,0,18))); d=ImageDraw.Draw(frame)
    if t<5.35:
        prog=clamp(t/4.2); ring_alpha=255 if t<4.95 else int(255*(1-fade(t,4.95,5.35))); draw_3d_ring_progress(frame, prog, ring_alpha)
        if t<=4.2:
            ang=math.radians(90+360*prog); draw_3d_star(frame,cx+R*math.cos(ang),cy+R*math.sin(ang),12)
    if 4.2<=t<=5.55:
        q=ease((t-4.2)/1.0); sy=(cy+R)*(1-q)+cy*q; size=11*(1-q)+105*q; op=1 if t<5.2 else 1-fade(t,5.2,5.55); draw_3d_star(frame,cx,sy,size,int(255*op))
    if t>=5.15:
        op=fade(t,5.15,5.95); sc=1.16-(0.16*ease((t-5.15)/0.8)); paste_center(frame,emblem,cx,cy,op,sc)
    if t>=6.0: paste_center(frame,olen,360,565,fade(t,6.0,6.9),1)
    if t>=7.0: paste_center(frame,tag,360,665,fade(t,7.0,7.75),1)
    if t>=7.8: paste_center(frame,sig,360,730,fade(t,7.8,8.55),1)
    if t>=8.6:
        labels=['EXPLORA','DESCOBRE','VIVE','REPETE']; centers=[140,287,433,580]; flab=ImageFont.truetype(font_bold,13)
        for k,(lab,lx,icon) in enumerate(zip(labels,centers,pillar_icons)):
            st=8.6+k*0.30; lop=fade(t,st,st+0.28)
            if lop>0:
                target_h=62; sc=target_h/icon.height; iw=max(1,round(icon.width*sc)); icon_n=icon.resize((iw,target_h),Image.Resampling.LANCZOS); icon_show=alpha_scaled(icon_n,lop)
                frame.alpha_composite(icon_show,(round(lx-icon_show.width/2),792)); bb=d.textbbox((0,0),lab,font=flab); tw=bb[2]-bb[0]; d.text((lx-tw/2,866),lab,font=flab,fill=(200,246,240,int(235*lop)))
    if t>=9.8:
        op=fade(t,9.8,10.45); txt='Boa tarde, Filipe'; bbox=d.textbbox((0,0),txt,font=fgreet); d.text(((W-(bbox[2]-bbox[0]))/2,950),txt,font=fgreet,fill=(255,255,255,int(255*op)))
    if t>=10.1:
        op=fade(t,10.1,10.8); txt='Bem-vindo de volta · O que queres viver hoje?'; bbox=d.textbbox((0,0),txt,font=fsub); d.text(((W-(bbox[2]-bbox[0]))/2,1005),txt,font=fsub,fill=(210,225,222,int(255*op)))
    prog=clamp(t/12); d.rounded_rectangle((bar_x,bar_y,bar_x+bar_w,bar_y+4),radius=2,fill=(255,255,255,48)); fillw=int(bar_w*prog)
    if fillw>0:
        for x in range(fillw):
            q=x/bar_w; c=ring_color(q,255); d.line((bar_x+x,bar_y,bar_x+x,bar_y+4),fill=c,width=1)
        draw_3d_star(frame,bar_x+fillw,bar_y+2,6)
    label='A iniciar a OLEN...'; bbox=d.textbbox((0,0),label,font=fload); d.text(((W-(bbox[2]-bbox[0]))/2,1193),label,font=fload,fill=(195,235,225,230))
    p.stdin.write(frame.tobytes())
p.stdin.close(); rc=p.wait()
if rc!=0: raise SystemExit(rc)
print(OUT)
