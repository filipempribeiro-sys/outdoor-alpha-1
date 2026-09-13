/* OLEN 4.4.0 · V10.7 NATIVE CANVAS SPLASH
   Individual approved PNG assets only. No master crop extraction.
   olen-star.png drives the circular reveal before the final OLEN symbol appears. */
(()=>{
'use strict';
if(window.__olenV107CanvasSplash)return;
window.__olenV107CanvasSplash=true;

const W=720,H=1280,DUR=12;
const CX=360,CY=300;
const SYMBOL_BOX=390;
const R=SYMBOL_BOX/2;
const BAR_X=58,BAR_Y=1158,BAR_W=604;
const V='4.4.0-v107-individual-assets-welcome2';
const WELCOME_DAY_KEY='olen:lastWelcomeDay';

const ASSETS={
  bg:'assets/olen-background.png',
  ring:'assets/olen/olen-ring.png',
  star:'assets/olen/olen-star.png',
  symbol:'assets/olen/olen-symbol.png',
  olen:'assets/olen/olen-text.png',
  tagline:'assets/olen/olen-tagline.png',
  slogan:'assets/olen/olen-slogan.png',
  icons:[
    'assets/olen/olen-icon-explora.png',
    'assets/olen/olen-icon-descobre.png',
    'assets/olen/olen-icon-vive.png',
    'assets/olen/olen-icon-repete.png'
  ],
  labels:[
    'assets/olen/olen-text-explora.png',
    'assets/olen/olen-text-descobre.png',
    'assets/olen/olen-text-vive.png',
    'assets/olen/olen-text-repete.png'
  ]
};

let overlay=null,stage=null,canvas=null,ctx=null;
let running=false,finished=false,ready=false;
let originalHide=null,hideWrapped=false,observer=null;
let raf=0,startAt=0,watchdog=0;
let img={};
let welcomeCopy=null;

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
  const size=SYMBOL_BOX;
  ctx.save();
  ctx.globalAlpha=opacity;
  if(prog<.9999){
    const start=Math.PI/2,end=start+Math.PI*2*prog;
    ctx.beginPath();ctx.moveTo(CX,CY);ctx.arc(CX,CY,size*.68,start,end,false);ctx.closePath();ctx.clip();
  }
  drawFit(img.ring,CX,CY,size,size,1,1);
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
  const h=d.getHours();
  if(h<12)return 'Bom dia';
  if(h<20)return 'Boa tarde';
  return 'Boa noite';
}

function resolveWelcomeCopy(){
  const now=new Date(),today=localDayStamp(now),greeting=dayGreeting(now);
  let previous='';
  try{previous=localStorage.getItem(WELCOME_DAY_KEY)||''}catch(_){ }
  const firstToday=previous!==today;
  try{localStorage.setItem(WELCOME_DAY_KEY,today)}catch(_){ }
  return firstToday
    ? {title:`${greeting}, Filipe`,subtitle:'O que queres viver hoje?'}
    : {title:'Bem-vindo de volta, Filipe',subtitle:'O que queres viver agora?'};
}

function drawWelcome(t){
  if(!welcomeCopy)return;
  if(t>=9.78){
    ctx.save();
    ctx.globalAlpha=fade(t,9.78,10.38);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='700 35px "Segoe UI", Arial, Helvetica, sans-serif';
    const g=ctx.createLinearGradient(205,0,515,0);
    g.addColorStop(0,'#f8ffff');g.addColorStop(.52,'#eafffb');g.addColorStop(1,'#8feeff');
    ctx.fillStyle=g;
    ctx.shadowColor='rgba(40,220,235,.18)';ctx.shadowBlur=8;
    ctx.fillText(welcomeCopy.title,W/2,970);
    ctx.restore();
  }
  if(t>=10.08){
    ctx.save();
    ctx.globalAlpha=fade(t,10.08,10.70);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='400 18px "Segoe UI", Arial, Helvetica, sans-serif';
    ctx.fillStyle='rgba(224,241,239,.92)';
    ctx.fillText(welcomeCopy.subtitle,W/2,1014);
    ctx.restore();
  }
}

function drawLoading(t){
  const prog=clamp(t/DUR),fw=Math.round(BAR_W*prog);
  ctx.save();
  ctx.lineCap='round';
  ctx.strokeStyle='rgba(196,244,239,.18)';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(BAR_X,BAR_Y);ctx.lineTo(BAR_X+BAR_W,BAR_Y);ctx.stroke();
  if(fw>0){
    const g=ctx.createLinearGradient(BAR_X,0,BAR_X+BAR_W,0);
    g.addColorStop(0,'#19f29a');g.addColorStop(.48,'#1dd8d8');g.addColorStop(1,'#2498ff');
    ctx.strokeStyle=g;ctx.lineWidth=4;
    ctx.shadowColor='rgba(35,221,236,.50)';ctx.shadowBlur=7;
    ctx.beginPath();ctx.moveTo(BAR_X,BAR_Y);ctx.lineTo(BAR_X+fw,BAR_Y);ctx.stroke();
    ctx.shadowBlur=0;
    drawStarImage(BAR_X+fw,BAR_Y,7.5,1);
  }
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='400 15px "Segoe UI", Arial, Helvetica, sans-serif';
  ctx.fillStyle='rgba(211,235,232,.82)';
  ctx.fillText('A iniciar a OLEN...',W/2,1195);
  ctx.restore();
}

function drawScene(t){
  ctx.clearRect(0,0,W,H);
  const bg=coverRect(img.bg.width,img.bg.height,W,H);
  ctx.drawImage(img.bg,bg.x,bg.y,bg.w,bg.h);
  ctx.fillStyle='rgba(0,0,0,.055)';ctx.fillRect(0,0,W,H);

  /* 0–4.2s: approved OLEN star draws/reveals the approved OLEN ring clockwise. */
  if(t<5.35){
    const prog=clamp(t/4.2),ringAlpha=t<4.95?1:1-fade(t,4.95,5.35);
    drawRingReveal(prog,ringAlpha);
    if(t<=4.2){
      const ang=(90+360*prog)*Math.PI/180;
      drawStarImage(CX+R*Math.cos(ang),CY+R*Math.sin(ang),15,1);
    }
  }

  /* 4.2–5.55s: the same OLEN star flies to centre and grows. */
  if(t>=4.2&&t<=5.55){
    const q=ease((t-4.2)/1.0);
    const sy=(CY+R)*(1-q)+CY*q;
    const size=15*(1-q)+112*q;
    const op=t<5.2?1:1-fade(t,5.2,5.55);
    drawStarImage(CX,sy,size,op);
  }

  /* Final symbol: exact approved PNG, no crop, no reconstruction. */
  if(t>=5.15){
    const op=fade(t,5.15,5.95),sc=1.12-.12*ease((t-5.15)/.8);
    drawFit(img.symbol,CX,CY,SYMBOL_BOX,SYMBOL_BOX,op,sc);
  }

  if(t>=6.0)drawFit(img.olen,360,565,430,150,fade(t,6.0,6.85),1);
  if(t>=6.95)drawFit(img.tagline,360,655,560,68,fade(t,6.95,7.65),1);
  if(t>=7.65)drawFit(img.slogan,360,724,480,88,fade(t,7.65,8.40),1);
  if(t>=8.55)drawPillars(t);

  drawWelcome(t);
  drawLoading(t);
}

function resizeCanvas(){if(!canvas||!stage)return;const rect=stage.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));const sx=canvas.width/W,sy=canvas.height/H,s=Math.max(sx,sy),ox=(canvas.width-W*s)/2,oy=(canvas.height-H*s)/2;ctx.setTransform(s,0,0,s,ox,oy)}
function wrapOriginalHide(){if(hideWrapped||typeof window.alphaHideWelcome!=='function')return;originalHide=window.alphaHideWelcome.bind(window);window.alphaHideWelcome=function(){if(running)return;return originalHide()};hideWrapped=true}
function overlayVisible(){return !!overlay&&overlay.classList.contains('show')&&overlay.getAttribute('aria-hidden')!=='true'}
function finish(){if(finished)return;finished=true;running=false;cancelAnimationFrame(raf);clearTimeout(watchdog);window.removeEventListener('resize',resizeCanvas);if(overlay)overlay.classList.remove('olen-v107-canvas-running');if(stage)stage.remove();if(typeof originalHide==='function')requestAnimationFrame(()=>originalHide());else if(overlay){overlay.classList.add('leaving');setTimeout(()=>{overlay.classList.remove('show','leaving');overlay.setAttribute('aria-hidden','true')},320)}}
function frame(now){if(!running)return;const t=(now-startAt)/1000;drawScene(Math.min(t,DUR));if(t>=DUR){finish();return}raf=requestAnimationFrame(frame)}
function start(){if(!ready||running||finished||!overlayVisible()||!stage)return;wrapOriginalHide();if(!hideWrapped)return;welcomeCopy=resolveWelcomeCopy();running=true;overlay.classList.add('olen-v107-canvas-running');resizeCanvas();window.addEventListener('resize',resizeCanvas,{passive:true});startAt=performance.now();watchdog=setTimeout(finish,13500);raf=requestAnimationFrame(frame)}

async function prepare(){
  try{
    const flat=[ASSETS.bg,ASSETS.ring,ASSETS.star,ASSETS.symbol,ASSETS.olen,ASSETS.tagline,ASSETS.slogan,...ASSETS.icons,...ASSETS.labels];
    const loaded=await Promise.all(flat.map(loadImage));
    let i=0;
    img.bg=loaded[i++];img.ring=loaded[i++];img.star=loaded[i++];img.symbol=loaded[i++];img.olen=loaded[i++];img.tagline=loaded[i++];img.slogan=loaded[i++];
    img.icons=loaded.slice(i,i+4);i+=4;img.labels=loaded.slice(i,i+4);
    ready=true;if(overlayVisible())start();
  }catch(err){console.warn('[OLEN 4.4.0] Individual Canvas assets unavailable; preserving original welcome.',err)}
}

function install(){overlay=document.getElementById('alphaWelcomeOverlay');if(!overlay)return;wrapOriginalHide();if(!stage){stage=document.createElement('div');stage.className='olen-v107-canvas-stage';canvas=document.createElement('canvas');canvas.className='olen-v107-canvas';canvas.setAttribute('aria-hidden','true');ctx=canvas.getContext('2d');stage.appendChild(canvas);overlay.appendChild(stage);prepare()}if(!observer){observer=new MutationObserver(()=>{if(overlayVisible()){if(ready)start()}else if(running){running=false;cancelAnimationFrame(raf)}});observer.observe(overlay,{attributes:true,attributeFilter:['class','aria-hidden']})}if(overlayVisible()&&ready)start()}
function boot(){requestAnimationFrame(install);setTimeout(install,80);setTimeout(install,300);setTimeout(install,900)}
document.addEventListener('DOMContentLoaded',boot,{once:true});window.addEventListener('pageshow',boot,{passive:true});boot();
console.info('[OLEN 4.4.0] V10.7 native Canvas · exact ring · contextual welcome · refined loading');
})();