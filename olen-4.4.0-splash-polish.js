/* OLEN 4.4.0 · V10.7 NATIVE CANVAS SPLASH
   Individual approved PNG assets only. No master crop extraction.
   Star follows the optical centreline of the OLEN ring, settles spatially below the chevron,
   and the loading bar uses a heavier 20px progress stroke, tighter welcome spacing, and the full OLEN expansion. */
(()=>{
'use strict';
if(window.__olenV107CanvasSplash)return;
window.__olenV107CanvasSplash=true;

const W=720,H=1280,DUR=12;
const CX=360,CY=300;
const SYMBOL_BOX=390;
const FINAL_STAR_SIZE=27;
const FINAL_STAR_Y=CY+66;
const CHEVRON_W=246,CHEVRON_H=228;
const BAR_X=140,BAR_Y=1080,BAR_W=440;
const V='4.4.0-v107-pillars-planeia-explora-descobre-vive';
const WELCOME_DAY_KEY='olen:lastWelcomeDay';

const ASSETS={
  bg:'assets/olen-background.png',
  ring:'assets/olen/olen-ring.png',
  star:'assets/olen/olen-star.png',
  chevron:'assets/olen/olen-chevron.png',
  olen:'assets/olen/olen-text.png',
  tagline:'assets/olen/olen-tagline.png',
  slogan:'assets/olen/olen-slogan.png',
  icons:[
    'assets/olen/olen-icon-planeia.png',
    'assets/olen/olen-icon-explora.png',
    'assets/olen/olen-icon-descobre.png',
    'assets/olen/olen-icon-vive.png'
  ],
  labels:[
    'assets/olen/olen-text-planeia.png',
    'assets/olen/olen-text-explora.png',
    'assets/olen/olen-text-descobre.png',
    'assets/olen/olen-text-vive.png'
  ]
};

let overlay=null,stage=null,canvas=null,ctx=null;
let running=false,finished=false,ready=false;
let originalHide=null,hideWrapped=false,observer=null;
let raf=0,startAt=0,watchdog=0;
let img={};
let welcomeCopy=null;
let ringTrackRadius=SYMBOL_BOX*.455;

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const fade=(t,a,b)=>b>a?ease((t-a)/(b-a)):(t>=a?1:0);

const style=document.createElement('style');
style.id='olenV107CanvasSplashStyle';
style.textContent=`
#alphaWelcomeOverlay{overflow:hidden!important}
#alphaWelcomeOverlay .olen-v107-canvas-stage{position:absolute;inset:0;z-index:20;display:none;overflow:hidden;background:#02090d url('${ASSETS.bg}') center/cover no-repeat;pointer-events:none}
#alphaWelcomeOverlay.olen-v107-canvas-running .olen-v107-canvas-stage{display:block!important}
#alphaWelcomeOverlay.olen-v107-canvas-running>.alphaWelcomeInner{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
#alphaWelcomeOverlay .olen-v107-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;background:transparent}
`;
document.head.appendChild(style);

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const im=new Image();
    im.onload=()=>resolve(im);
    im.onerror=()=>reject(new Error('Falha a carregar '+src));
    im.src=src+(src.includes('?')?'&':'?')+'v='+V;
  });
}

function alphaTightCanvas(source,threshold=4){
  const c=document.createElement('canvas');c.width=source.width;c.height=source.height;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(source,0,0);
  const d=x.getImageData(0,0,c.width,c.height).data;
  let minX=c.width,minY=c.height,maxX=-1,maxY=-1;
  for(let yy=0;yy<c.height;yy++)for(let xx=0;xx<c.width;xx++){
    if(d[(yy*c.width+xx)*4+3]>threshold){
      if(xx<minX)minX=xx;if(xx>maxX)maxX=xx;if(yy<minY)minY=yy;if(yy>maxY)maxY=yy;
    }
  }
  if(maxX<0)return c;
  const out=document.createElement('canvas');out.width=maxX-minX+1;out.height=maxY-minY+1;
  out.getContext('2d').drawImage(c,minX,minY,out.width,out.height,0,0,out.width,out.height);
  return out;
}

function analyseRingTrack(ring){
  try{
    const c=document.createElement('canvas');c.width=ring.width;c.height=ring.height;
    const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(ring,0,0);
    const id=x.getImageData(0,0,c.width,c.height),d=id.data;
    const cx=c.width/2,cy=c.height/2,dist=[];
    for(let yy=0;yy<c.height;yy+=2)for(let xx=0;xx<c.width;xx+=2){
      const a=d[(yy*c.width+xx)*4+3];
      if(a>56)dist.push(Math.hypot(xx+.5-cx,yy+.5-cy));
    }
    if(dist.length<100)return;
    dist.sort((a,b)=>a-b);
    const q=(p)=>dist[Math.min(dist.length-1,Math.max(0,Math.floor((dist.length-1)*p)))];
    const mid=(q(.18)+q(.82))/2;
    const scale=Math.min(SYMBOL_BOX/ring.width,SYMBOL_BOX/ring.height);
    ringTrackRadius=mid*scale;
  }catch(_){ }
}

function coverRect(iw,ih,tw,th){const s=Math.max(tw/iw,th/ih);return{w:iw*s,h:ih*s,x:(tw-iw*s)/2,y:(th-ih*s)/2}}

function drawFit(image,cx,cy,maxW,maxH,opacity=1,scale=1){
  if(!image)return;
  const s=Math.min(maxW/image.width,maxH/image.height)*scale;
  const w=image.width*s,h=image.height*s;
  ctx.save();ctx.globalAlpha=opacity;ctx.drawImage(image,cx-w/2,cy-h/2,w,h);ctx.restore();
}

function drawStarImage(x,y,size,opacity=1){
  drawFit(img.star,x,y,size*2.2,size*2.9,opacity,1);
}

function drawRingReveal(prog,opacity=1){
  prog=clamp(prog);
  ctx.save();ctx.globalAlpha=opacity;
  if(prog<.9999){
    const start=Math.PI/2,end=start+Math.PI*2*prog;
    ctx.beginPath();ctx.moveTo(CX,CY);ctx.arc(CX,CY,SYMBOL_BOX*.56,start,end,false);ctx.closePath();ctx.clip();
  }
  drawFit(img.ring,CX,CY,SYMBOL_BOX,SYMBOL_BOX,1,1);
  ctx.restore();
}

function drawChevronReveal(progress,opacity=1){
  progress=clamp(progress);
  if(progress<=0)return;
  const s=Math.min(CHEVRON_W/img.chevron.width,CHEVRON_H/img.chevron.height);
  const w=img.chevron.width*s,h=img.chevron.height*s;
  const x=CX-w/2,y=CY-h/2;
  ctx.save();ctx.globalAlpha=opacity;
  const revealH=h*progress;
  ctx.beginPath();ctx.rect(x,y+h-revealH,w,revealH);ctx.clip();
  ctx.shadowColor='rgba(50,225,241,.28)';ctx.shadowBlur=8;
  ctx.drawImage(img.chevron,x,y,w,h);
  ctx.restore();
}

function drawPillars(t){
  const centers=[140,287,433,580];
  centers.forEach((x,k)=>{
    const st=8.55+k*.30,op=fade(t,st,st+.30);
    if(op<=0)return;
    drawFit(img.icons[k],x,812,82,74,op,1);
    drawFit(img.labels[k],x,870,118,30,op,1);
  });
}

function localDayStamp(d=new Date()){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function dayGreeting(d=new Date()){
  const h=d.getHours();if(h<12)return 'Bom dia';if(h<20)return 'Boa tarde';return 'Boa noite';
}
function resolveWelcomeCopy(){
  const now=new Date(),today=localDayStamp(now),greeting=dayGreeting(now);let previous='';
  try{previous=localStorage.getItem(WELCOME_DAY_KEY)||''}catch(_){ }
  const firstToday=previous!==today;
  try{localStorage.setItem(WELCOME_DAY_KEY,today)}catch(_){ }
  return firstToday?{title:`${greeting}, Filipe`,subtitle:'O que queres viver hoje?'}:{title:'Bem-vindo de volta, Filipe',subtitle:'O que queres viver agora?'};
}

function drawWelcome(t){
  if(!welcomeCopy)return;
  if(t>=9.78){
    ctx.save();ctx.globalAlpha=fade(t,9.78,10.38);ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='800 37px "Segoe UI", Arial, Helvetica, sans-serif';
    const g=ctx.createLinearGradient(205,0,515,0);g.addColorStop(0,'#ffffff');g.addColorStop(.52,'#f3ffff');g.addColorStop(1,'#9ef4ff');
    ctx.fillStyle=g;ctx.shadowColor='rgba(25,210,235,.30)';ctx.shadowBlur=10;ctx.fillText(welcomeCopy.title,W/2,970);ctx.restore();
  }
  if(t>=10.08){
    ctx.save();ctx.globalAlpha=fade(t,10.08,10.70);ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='600 20px "Segoe UI", Arial, Helvetica, sans-serif';ctx.fillStyle='rgba(238,250,248,.98)';ctx.shadowColor='rgba(0,0,0,.34)';ctx.shadowBlur=4;ctx.fillText(welcomeCopy.subtitle,W/2,1014);ctx.restore();
  }
}

function drawLoading(t){
  const prog=clamp(t/DUR),fw=Math.round(BAR_W*prog);
  ctx.save();ctx.lineCap='round';
  ctx.strokeStyle='rgba(196,244,239,.24)';ctx.lineWidth=10;
  ctx.beginPath();ctx.moveTo(BAR_X,BAR_Y);ctx.lineTo(BAR_X+BAR_W,BAR_Y);ctx.stroke();
  if(fw>0){
    const g=ctx.createLinearGradient(BAR_X,0,BAR_X+BAR_W,0);g.addColorStop(0,'#19f29a');g.addColorStop(.48,'#1dd8d8');g.addColorStop(1,'#2498ff');
    ctx.strokeStyle=g;ctx.lineWidth=20;ctx.shadowColor='rgba(35,221,236,.66)';ctx.shadowBlur=14;
    ctx.beginPath();ctx.moveTo(BAR_X,BAR_Y);ctx.lineTo(BAR_X+fw,BAR_Y);ctx.stroke();ctx.shadowBlur=0;
    drawStarImage(BAR_X+fw,BAR_Y,14,1);
  }
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 16px "Segoe UI", Arial, Helvetica, sans-serif';
  ctx.fillStyle='rgba(230,246,244,.96)';ctx.shadowColor='rgba(0,0,0,.38)';ctx.shadowBlur=4;ctx.fillText('A iniciar a OLEN...',W/2,1122);ctx.restore();
}

function drawScene(t){
  ctx.clearRect(0,0,W,H);
  const bg=coverRect(img.bg.width,img.bg.height,W,H);ctx.drawImage(img.bg,bg.x,bg.y,bg.w,bg.h);
  ctx.fillStyle='rgba(0,0,0,.055)';ctx.fillRect(0,0,W,H);

  const ringProg=clamp(t/4.2);
  drawRingReveal(ringProg,1);
  if(t<=4.2){
    const ang=(90+360*ringProg)*Math.PI/180;
    drawStarImage(CX+ringTrackRadius*Math.cos(ang),CY+ringTrackRadius*Math.sin(ang),15,1);
  }

  if(t>4.2&&t<=5.1){
    const q=ease((t-4.2)/.9);
    const sy=(CY+ringTrackRadius)*(1-q)+CY*q;
    const size=15*(1-q)+112*q;
    drawStarImage(CX,sy,size,1);
  }

  if(t>5.1){
    const q=ease((t-5.1)/.6);
    const size=t<5.7?112*(1-q)+FINAL_STAR_SIZE*q:FINAL_STAR_SIZE;
    const starY=t<5.7?CY*(1-q)+FINAL_STAR_Y*q:FINAL_STAR_Y;
    drawStarImage(CX,starY,size,1);
  }

  if(t>=5.72)drawChevronReveal(fade(t,5.72,6.25),1);

  if(t>=6.0)drawFit(img.olen,360,565,430,150,fade(t,6.0,6.85),1);
  if(t>=6.95){
    ctx.save();ctx.globalAlpha=fade(t,6.95,7.65);ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='700 19px "Segoe UI", Arial, Helvetica, sans-serif';
    const tg=ctx.createLinearGradient(90,0,630,0);tg.addColorStop(0,'#f7ffff');tg.addColorStop(.42,'#7fffe0');tg.addColorStop(1,'#73cfff');
    ctx.fillStyle=tg;ctx.shadowColor='rgba(35,220,235,.24)';ctx.shadowBlur=6;ctx.fillText('OUTDOOR • LIFESTYLE • EXPERIENCE • NAVIGATOR',360,655);ctx.restore();
  }
  if(t>=7.65)drawFit(img.slogan,360,724,480,88,fade(t,7.65,8.40),1);
  if(t>=8.55)drawPillars(t);
  drawWelcome(t);drawLoading(t);
}

function resizeCanvas(){if(!canvas||!stage)return;const rect=stage.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));const sx=canvas.width/W,sy=canvas.height/H,s=Math.max(sx,sy),ox=(canvas.width-W*s)/2,oy=(canvas.height-H*s)/2;ctx.setTransform(s,0,0,s,ox,oy)}
function wrapOriginalHide(){if(hideWrapped||typeof window.alphaHideWelcome!=='function')return;originalHide=window.alphaHideWelcome.bind(window);window.alphaHideWelcome=function(){if(running)return;return originalHide()};hideWrapped=true}
function overlayVisible(){return !!overlay&&overlay.classList.contains('show')&&overlay.getAttribute('aria-hidden')!=='true'}
function finish(){if(finished)return;finished=true;running=false;cancelAnimationFrame(raf);clearTimeout(watchdog);window.removeEventListener('resize',resizeCanvas);if(overlay)overlay.classList.remove('olen-v107-canvas-running');if(stage)stage.remove();if(typeof originalHide==='function')requestAnimationFrame(()=>originalHide());else if(overlay){overlay.classList.add('leaving');setTimeout(()=>{overlay.classList.remove('show','leaving');overlay.setAttribute('aria-hidden','true')},320)}}
function frame(now){if(!running)return;const t=(now-startAt)/1000;drawScene(Math.min(t,DUR));if(t>=DUR){finish();return}raf=requestAnimationFrame(frame)}
function start(){if(!ready||running||finished||!overlayVisible()||!stage)return;wrapOriginalHide();if(!hideWrapped)return;welcomeCopy=resolveWelcomeCopy();running=true;overlay.classList.add('olen-v107-canvas-running');resizeCanvas();window.addEventListener('resize',resizeCanvas,{passive:true});startAt=performance.now();watchdog=setTimeout(finish,13500);raf=requestAnimationFrame(frame)}

async function prepare(){
  try{
    const flat=[ASSETS.bg,ASSETS.ring,ASSETS.star,ASSETS.chevron,ASSETS.olen,ASSETS.tagline,ASSETS.slogan,...ASSETS.icons,...ASSETS.labels];
    const loaded=await Promise.all(flat.map(loadImage));
    let i=0;
    img.bg=loaded[i++];
    img.ring=alphaTightCanvas(loaded[i++],6);
    img.star=alphaTightCanvas(loaded[i++],6);
    img.chevron=alphaTightCanvas(loaded[i++],6);
    img.olen=loaded[i++];img.tagline=loaded[i++];img.slogan=loaded[i++];
    img.icons=loaded.slice(i,i+4);i+=4;img.labels=loaded.slice(i,i+4);
    analyseRingTrack(img.ring);
    ready=true;if(overlayVisible())start();
  }catch(err){console.warn('[OLEN 4.4.0] Individual Canvas assets unavailable; preserving original welcome.',err)}
}

function install(){overlay=document.getElementById('alphaWelcomeOverlay');if(!overlay)return;wrapOriginalHide();if(!stage){stage=document.createElement('div');stage.className='olen-v107-canvas-stage';canvas=document.createElement('canvas');canvas.className='olen-v107-canvas';canvas.setAttribute('aria-hidden','true');ctx=canvas.getContext('2d');stage.appendChild(canvas);overlay.appendChild(stage);prepare()}if(!observer){observer=new MutationObserver(()=>{if(overlayVisible()){if(ready)start()}else if(running){running=false;cancelAnimationFrame(raf)}});observer.observe(overlay,{attributes:true,attributeFilter:['class','aria-hidden']})}if(overlayVisible()&&ready)start()}
function boot(){requestAnimationFrame(install);setTimeout(install,80);setTimeout(install,300);setTimeout(install,900)}
document.addEventListener('DOMContentLoaded',boot,{once:true});window.addEventListener('pageshow',boot,{passive:true});boot();
console.info('[OLEN 4.4.0] V10.7 native Canvas · PLANEA → EXPLORA → DESCOBRE → VIVE · star below chevron · full Navigator tagline · loading 20px');
})();