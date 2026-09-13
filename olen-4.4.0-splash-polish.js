/* OLEN 4.4.0 · V10.7 NATIVE CANVAS SPLASH
   Circle/star/emblem preserved. Lower identity rebuilt cleanly in Canvas.
   No MP4 playback. Existing welcome stays available as fail-safe. */
(()=>{
'use strict';
if(window.__olenV107CanvasSplash)return;
window.__olenV107CanvasSplash=true;

const BG='assets/olen-background.png';
const MASTER='assets/olen-splash.png';
const W=720,H=1280,DUR=12;
const CX=360,CY=300,R=155;
const BAR_X=92,BAR_Y=1170,BAR_W=536;

let overlay=null,stage=null,canvas=null,ctx=null;
let running=false,finished=false,ready=false;
let originalHide=null,hideWrapped=false,observer=null;
let raf=0,startAt=0,watchdog=0;
let bgImg=null,masterImg=null,emblem=null;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const fade=(t,a,b)=>b>a?ease((t-a)/(b-a)):(t>=a?1:0);

const style=document.createElement('style');
style.id='olenV107CanvasSplashStyle';
style.textContent=`
#alphaWelcomeOverlay{overflow:hidden!important}
#alphaWelcomeOverlay .olen-v107-canvas-stage{position:absolute;inset:0;z-index:20;display:none;overflow:hidden;background:#02090d url('${BG}') center/cover no-repeat;pointer-events:none}
#alphaWelcomeOverlay.olen-v107-canvas-running .olen-v107-canvas-stage{display:block!important}
#alphaWelcomeOverlay.olen-v107-canvas-running>.alphaWelcomeInner{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
#alphaWelcomeOverlay .olen-v107-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;background:transparent}
`;
document.head.appendChild(style);

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const im=new Image();
    im.onload=()=>resolve(im);
    im.onerror=reject;
    im.src=src+(src.includes('?')?'&':'?')+'v=4.4.0-v107-native-lower';
  });
}

function trimAlpha(src){
  const x=src.getContext('2d',{willReadFrequently:true});
  const id=x.getImageData(0,0,src.width,src.height),d=id.data;
  let minX=src.width,minY=src.height,maxX=-1,maxY=-1;
  for(let y=0;y<src.height;y++)for(let xx=0;xx<src.width;xx++){
    if(d[(y*src.width+xx)*4+3]>3){minX=Math.min(minX,xx);minY=Math.min(minY,y);maxX=Math.max(maxX,xx);maxY=Math.max(maxY,y)}
  }
  if(maxX<0)return src;
  const out=document.createElement('canvas');out.width=maxX-minX+1;out.height=maxY-minY+1;
  out.getContext('2d').drawImage(src,minX,minY,out.width,out.height,0,0,out.width,out.height);
  return out;
}

function makePiece(src,box,lo,hi,outw){
  const [x1,y1,x2,y2]=box,w=x2-x1,h=y2-y1;
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(src,x1,y1,w,h,0,0,w,h);
  const id=x.getImageData(0,0,w,h),d=id.data;
  for(let i=0;i<d.length;i+=4){
    const mx=Math.max(d[i],d[i+1],d[i+2]);
    d[i+3]=mx<lo?0:Math.round(clamp((mx-lo)/(hi-lo))*255);
  }
  x.putImageData(id,0,0);
  const out=document.createElement('canvas');
  out.width=outw;out.height=Math.max(1,Math.round(h*outw/w));
  out.getContext('2d').drawImage(c,0,0,out.width,out.height);
  return trimAlpha(out);
}

function ringColor(q,a=1){
  let r,g,b;
  if(q<.33){const u=q/.33;r=46;g=204+51*u;b=113+83*u}
  else if(q<.66){const u=(q-.33)/.33;r=31;g=215-17*u;b=196+38*u}
  else{const u=(q-.66)/.34;r=41;g=198-91*u;b=234+21*u}
  return `rgba(${r|0},${g|0},${b|0},${a})`;
}

function drawStar(x,y,size,alpha=1){
  ctx.save();ctx.globalAlpha=alpha;
  ctx.shadowColor='rgba(72,228,255,.55)';ctx.shadowBlur=Math.max(2,size*.55);
  const tris=[
    [[0,0],[-.18,-.12],[0,-1.42]],[[0,0],[0,-1.42],[.18,-.12]],[[0,0],[.18,-.12],[1.02,0]],[[0,0],[1.02,0],[.18,.12]],
    [[0,0],[.18,.12],[0,1.42]],[[0,0],[0,1.42],[-.18,.12]],[[0,0],[-.18,.12],[-1.02,0]],[[0,0],[-1.02,0],[-.18,-.12]]
  ];
  const cols=['#e0fffa','#68f2f1','#3ed6ff','#22a6ff','#2dcaf7','#5feee6','#6ef5d3','#b2ffe2'];
  tris.forEach((tr,i)=>{ctx.beginPath();tr.forEach((p,j)=>{const px=x+p[0]*size,py=y+p[1]*size;j?ctx.lineTo(px,py):ctx.moveTo(px,py)});ctx.closePath();ctx.fillStyle=cols[i];ctx.fill()});
  ctx.shadowBlur=0;ctx.strokeStyle='rgba(238,255,255,.8)';ctx.lineWidth=Math.max(1,size*.055);ctx.beginPath();ctx.moveTo(x,y-size*1.28);ctx.lineTo(x,y+size*1.28);ctx.stroke();
  ctx.strokeStyle='rgba(214,255,252,.65)';ctx.lineWidth=Math.max(1,size*.045);ctx.beginPath();ctx.moveTo(x-size*.88,y);ctx.lineTo(x+size*.88,y);ctx.stroke();
  ctx.restore();
}

function drawRing(prog,alpha=1){
  prog=clamp(prog);const steps=Math.max(1,Math.floor(240*prog));
  ctx.save();ctx.lineCap='butt';
  for(let pass=0;pass<3;pass++){
    ctx.lineWidth=pass===0?26:pass===1?21:3;
    if(pass===0){ctx.shadowColor='rgba(55,220,245,.6)';ctx.shadowBlur=8}else ctx.shadowBlur=0;
    const rr=pass===2?R-4:R;
    for(let j=0;j<steps;j++){
      const q=j/240,a0=(90+360*j/240)*Math.PI/180,a1=(90+360*(j+1)/240+1.7)*Math.PI/180;
      if(pass===0){const c=ringColor(q,alpha),m=c.match(/\d+/g).map(Number);ctx.strokeStyle=`rgba(${Math.max(0,m[0]-15)},${Math.max(0,m[1]-30)},${Math.max(0,m[2]-18)},${alpha})`}
      else if(pass===1)ctx.strokeStyle=ringColor(q,alpha); else ctx.strokeStyle=`rgba(220,255,252,${alpha*.72})`;
      ctx.beginPath();ctx.arc(CX,CY,rr,a0,a1);ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPiece(img,cx,cy,opacity=1,scale=1){
  const w=img.width*scale,h=img.height*scale;
  ctx.save();ctx.globalAlpha=opacity;ctx.drawImage(img,cx-w/2,cy-h/2,w,h);ctx.restore();
}

function coverRect(iw,ih,tw,th){const s=Math.max(tw/iw,th/ih);return{w:iw*s,h:ih*s,x:(tw-iw*s)/2,y:(th-ih*s)/2}}

function drawGradientText(text,y,size,weight,tracking,alpha=1){
  ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=`${weight} ${size}px Arial, Helvetica, sans-serif`;
  const g=ctx.createLinearGradient(185,0,535,0);g.addColorStop(0,'#f8ffff');g.addColorStop(.42,'#bffff4');g.addColorStop(.72,'#59e8f3');g.addColorStop(1,'#31a9ff');ctx.fillStyle=g;
  if(!tracking){ctx.fillText(text,W/2,y);ctx.restore();return}
  const chars=[...text],widths=chars.map(ch=>ctx.measureText(ch).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(chars.length-1);let x=W/2-total/2;
  chars.forEach((ch,i)=>{ctx.fillText(ch,x+widths[i]/2,y);x+=widths[i]+tracking});ctx.restore();
}

function drawTagline(alpha){
  ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 14px Arial, Helvetica, sans-serif';ctx.fillStyle='rgba(214,247,244,.96)';
  const parts=['OUTDOOR','•','LIFESTYLE','•','EXPERIENCE'];const gaps=[0,18,18,18,0];let widths=parts.map(p=>ctx.measureText(p).width),total=widths.reduce((a,b)=>a+b,0)+gaps.reduce((a,b)=>a+b,0),x=W/2-total/2;
  parts.forEach((p,i)=>{ctx.fillText(p,x+widths[i]/2,647);x+=widths[i]+gaps[i]});ctx.restore();
}

function drawSignature(alpha){
  ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='italic 36px "Segoe Script", "Brush Script MT", cursive';
  const g=ctx.createLinearGradient(210,0,510,0);g.addColorStop(0,'#62f0d0');g.addColorStop(1,'#59cfff');ctx.fillStyle=g;ctx.fillText('Navega à tua medida',W/2,704);
  ctx.strokeStyle='rgba(92,232,222,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(270,726);ctx.quadraticCurveTo(360,736,452,723);ctx.stroke();ctx.restore();
}

function drawPillarIcon(kind,x,y,alpha){
  ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle='#64e8e0';ctx.fillStyle='rgba(100,232,224,.06)';ctx.lineWidth=2.4;ctx.lineJoin='round';ctx.lineCap='round';
  if(kind===0){ctx.beginPath();ctx.moveTo(x-19,y+14);ctx.lineTo(x,y-17);ctx.lineTo(x+19,y+14);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(x-7,y+14);ctx.lineTo(x,y+2);ctx.lineTo(x+7,y+14);ctx.stroke()}
  if(kind===1){for(let i=0;i<3;i++){ctx.beginPath();for(let u=0;u<=1;u+=.05){const xx=x-22+44*u,yy=y-8+i*8+Math.sin(u*Math.PI*2+i*.45)*4;u?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.stroke()}}
  if(kind===2){[[0,-18,-13,4,13,4],[ -17,-7,-27,13,-8,13],[17,-7,8,13,27,13]].forEach(a=>{ctx.beginPath();ctx.moveTo(x+a[0],y+a[1]);ctx.lineTo(x+a[2],y+a[3]);ctx.lineTo(x+a[4],y+a[5]);ctx.closePath();ctx.stroke()});ctx.beginPath();ctx.moveTo(x,y+4);ctx.lineTo(x,y+20);ctx.stroke()}
  if(kind===3){ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.stroke();for(let a=0;a<8;a++){const q=a*Math.PI/4;ctx.beginPath();ctx.moveTo(x+14*Math.cos(q),y+14*Math.sin(q));ctx.lineTo(x+22*Math.cos(q),y+22*Math.sin(q));ctx.stroke()}}
  ctx.restore();
}

function drawPillars(t){
  const labels=['EXPLORA','DESCOBRE','VIVE','REPETE'],centers=[140,287,433,580];
  centers.forEach((x,k)=>{const st=8.6+k*.30,op=fade(t,st,st+.28);if(op<=0)return;drawPillarIcon(k,x,805,op);ctx.save();ctx.globalAlpha=op;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 13px Arial, Helvetica, sans-serif';ctx.fillStyle='rgba(218,250,246,.94)';ctx.fillText(labels[k],x,864);ctx.restore()});
}

function drawScene(t){
  ctx.clearRect(0,0,W,H);const r=coverRect(bgImg.width,bgImg.height,W,H);ctx.drawImage(bgImg,r.x,r.y,r.w,r.h);ctx.fillStyle='rgba(0,0,0,.07)';ctx.fillRect(0,0,W,H);

  if(t<5.35){const prog=clamp(t/4.2),ringAlpha=t<4.95?1:1-fade(t,4.95,5.35);drawRing(prog,ringAlpha);if(t<=4.2){const ang=(90+360*prog)*Math.PI/180;drawStar(CX+R*Math.cos(ang),CY+R*Math.sin(ang),12,1)}}
  if(t>=4.2&&t<=5.55){const q=ease((t-4.2)/1.0),sy=(CY+R)*(1-q)+CY*q,size=11*(1-q)+105*q,op=t<5.2?1:1-fade(t,5.2,5.55);drawStar(CX,sy,size,op)}
  if(t>=5.15){const op=fade(t,5.15,5.95),sc=1.16-.16*ease((t-5.15)/.8);drawPiece(emblem,CX,CY,op,sc)}

  if(t>=6.0)drawGradientText('OLEN',555,86,700,10,fade(t,6.0,6.9));
  if(t>=7.0)drawTagline(fade(t,7.0,7.75));
  if(t>=7.8)drawSignature(fade(t,7.8,8.55));
  if(t>=8.6)drawPillars(t);

  ctx.textAlign='center';ctx.textBaseline='middle';
  if(t>=9.8){ctx.save();ctx.globalAlpha=fade(t,9.8,10.45);ctx.font='700 41px Arial, Helvetica, sans-serif';ctx.fillStyle='#fff';ctx.fillText('Boa tarde, Filipe',W/2,960);ctx.restore()}
  if(t>=10.1){ctx.save();ctx.globalAlpha=fade(t,10.1,10.8);ctx.font='21px Arial, Helvetica, sans-serif';ctx.fillStyle='rgb(210,225,222)';ctx.fillText('Bem-vindo de volta · O que queres viver hoje?',W/2,1015);ctx.restore()}

  const prog=clamp(t/DUR);ctx.fillStyle='rgba(255,255,255,.19)';roundRect(BAR_X,BAR_Y,BAR_W,4,2);ctx.fill();const fw=Math.round(BAR_W*prog);
  if(fw>0){for(let x=0;x<fw;x++){ctx.strokeStyle=ringColor(x/BAR_W,1);ctx.beginPath();ctx.moveTo(BAR_X+x,BAR_Y);ctx.lineTo(BAR_X+x,BAR_Y+4);ctx.stroke()}drawStar(BAR_X+fw,BAR_Y+2,6,1)}
  ctx.font='16px Arial, Helvetica, sans-serif';ctx.fillStyle='rgba(195,235,225,.9)';ctx.fillText('A iniciar a OLEN...',W/2,1205);
}

function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):ctx.rect(x,y,w,h)}

function resizeCanvas(){if(!canvas||!stage)return;const rect=stage.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));const sx=canvas.width/W,sy=canvas.height/H,s=Math.max(sx,sy),ox=(canvas.width-W*s)/2,oy=(canvas.height-H*s)/2;ctx.setTransform(s,0,0,s,ox,oy)}
function wrapOriginalHide(){if(hideWrapped||typeof window.alphaHideWelcome!=='function')return;originalHide=window.alphaHideWelcome.bind(window);window.alphaHideWelcome=function(){if(running)return;return originalHide()};hideWrapped=true}
function overlayVisible(){return !!overlay&&overlay.classList.contains('show')&&overlay.getAttribute('aria-hidden')!=='true'}
function finish(){if(finished)return;finished=true;running=false;cancelAnimationFrame(raf);clearTimeout(watchdog);window.removeEventListener('resize',resizeCanvas);if(overlay)overlay.classList.remove('olen-v107-canvas-running');if(stage)stage.remove();if(typeof originalHide==='function')requestAnimationFrame(()=>originalHide());else if(overlay){overlay.classList.add('leaving');setTimeout(()=>{overlay.classList.remove('show','leaving');overlay.setAttribute('aria-hidden','true')},320)}}
function frame(now){if(!running)return;const t=(now-startAt)/1000;drawScene(Math.min(t,DUR));if(t>=DUR){finish();return}raf=requestAnimationFrame(frame)}
function start(){if(!ready||running||finished||!overlayVisible()||!stage)return;wrapOriginalHide();if(!hideWrapped)return;running=true;overlay.classList.add('olen-v107-canvas-running');resizeCanvas();window.addEventListener('resize',resizeCanvas,{passive:true});startAt=performance.now();watchdog=setTimeout(finish,13500);raf=requestAnimationFrame(frame)}
async function prepare(){try{[bgImg,masterImg]=await Promise.all([loadImage(BG),loadImage(MASTER)]);emblem=makePiece(masterImg,[300,15,1235,835],118,188,420);ready=true;if(overlayVisible())start()}catch(err){console.warn('[OLEN 4.4.0] Canvas splash assets unavailable; preserving original welcome.',err)}}
function install(){overlay=document.getElementById('alphaWelcomeOverlay');if(!overlay)return;wrapOriginalHide();if(!stage){stage=document.createElement('div');stage.className='olen-v107-canvas-stage';canvas=document.createElement('canvas');canvas.className='olen-v107-canvas';canvas.setAttribute('aria-hidden','true');ctx=canvas.getContext('2d');stage.appendChild(canvas);overlay.appendChild(stage);prepare()}if(!observer){observer=new MutationObserver(()=>{if(overlayVisible()){if(ready)start()}else if(running){running=false;cancelAnimationFrame(raf)}});observer.observe(overlay,{attributes:true,attributeFilter:['class','aria-hidden']})}if(overlayVisible()&&ready)start()}
function boot(){requestAnimationFrame(install);setTimeout(install,80);setTimeout(install,300);setTimeout(install,900)}
document.addEventListener('DOMContentLoaded',boot,{once:true});window.addEventListener('pageshow',boot,{passive:true});boot();
console.info('[OLEN 4.4.0] V10.7 native Canvas splash · clean lower identity');
})();
