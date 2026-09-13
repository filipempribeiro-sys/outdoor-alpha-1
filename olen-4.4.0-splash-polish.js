/* OLEN 4.4.0 · V10.7 NATIVE CANVAS SPLASH
   Direct browser port of the V10.7 renderer. No MP4 playback.
   Existing welcome remains untouched until all OLEN assets are ready. */
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
let bgImg=null,masterImg=null;
const pieces={};

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
    im.src=src+(src.includes('?')?'&':'?')+'v=4.4.0-v107-canvas';
  });
}

function makePiece(src,box,lo,hi,outw){
  const [x1,y1,x2,y2]=box,w=x2-x1,h=y2-y1;
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(src,x1,y1,w,h,0,0,w,h);
  const id=x.getImageData(0,0,w,h),d=id.data;
  for(let i=0;i<d.length;i+=4){
    const mx=Math.max(d[i],d[i+1],d[i+2]);
    let a=mx<lo?0:clamp((mx-lo)/(hi-lo));
    d[i+3]=Math.round(a*255);
  }
  x.putImageData(id,0,0);
  const out=document.createElement('canvas');
  out.width=outw;out.height=Math.max(1,Math.round(h*outw/w));
  out.getContext('2d').drawImage(c,0,0,out.width,out.height);
  return trimAlpha(out);
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

function preparePieces(){
  pieces.emblem=makePiece(masterImg,[300,15,1235,835],118,188,420);
  pieces.olen=makePiece(masterImg,[235,815,1305,1060],110,178,500);
  pieces.tag=makePiece(masterImg,[115,1060,1430,1148],118,185,560);
  pieces.sig=makePiece(masterImg,[295,1150,1230,1288],85,165,470);
  const boxes=[[365,1312,500,1410],[600,1310,730,1410],[835,1302,985,1415],[1025,1280,1255,1430]];
  pieces.icons=boxes.map(b=>makePiece(masterImg,b,35,115,104));
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
  const pts=[[0,-1.42],[-.18,-.12],[-1.02,0],[-.18,.12],[0,1.42],[.18,.12],[1.02,0],[.18,-.12]];
  const tris=[
    [[0,0],[-.18,-.12],[0,-1.42]],[[0,0],[0,-1.42],[.18,-.12]],[[0,0],[.18,-.12],[1.02,0]],[[0,0],[1.02,0],[.18,.12]],
    [[0,0],[.18,.12],[0,1.42]],[[0,0],[0,1.42],[-.18,.12]],[[0,0],[-.18,.12],[-1.02,0]],[[0,0],[-1.02,0],[-.18,-.12]]
  ];
  const cols=['#e0fffA','#68f2f1','#3ed6ff','#22a6ff','#2dcaf7','#5feee6','#6ef5d3','#b2ffe2'];
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
    if(pass===0){ctx.shadowColor='rgba(55,220,245,.6)';ctx.shadowBlur=8}else{ctx.shadowBlur=0}
    const rr=pass===2?R-4:R;
    for(let j=0;j<steps;j++){
      const q=j/240,a0=(90+360*j/240)*Math.PI/180,a1=(90+360*(j+1)/240+1.7)*Math.PI/180;
      if(pass===0){const c=ringColor(q,alpha);const m=c.match(/\d+/g).map(Number);ctx.strokeStyle=`rgba(${Math.max(0,m[0]-15)},${Math.max(0,m[1]-30)},${Math.max(0,m[2]-18)},${alpha})`}
      else if(pass===1)ctx.strokeStyle=ringColor(q,alpha);
      else ctx.strokeStyle=`rgba(220,255,252,${alpha*.72})`;
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

function drawScene(t){
  ctx.clearRect(0,0,W,H);
  const r=coverRect(bgImg.width,bgImg.height,W,H);
  ctx.drawImage(bgImg,r.x,r.y,r.w,r.h);
  ctx.fillStyle='rgba(0,0,0,.07)';ctx.fillRect(0,0,W,H);

  if(t<5.35){
    const prog=clamp(t/4.2),ringAlpha=t<4.95?1:1-fade(t,4.95,5.35);
    drawRing(prog,ringAlpha);
    if(t<=4.2){const ang=(90+360*prog)*Math.PI/180;drawStar(CX+R*Math.cos(ang),CY+R*Math.sin(ang),12,1)}
  }
  if(t>=4.2&&t<=5.55){
    const q=ease((t-4.2)/1.0),sy=(CY+R)*(1-q)+CY*q,size=11*(1-q)+105*q,op=t<5.2?1:1-fade(t,5.2,5.55);
    drawStar(CX,sy,size,op);
  }
  if(t>=5.15){const op=fade(t,5.15,5.95),sc=1.16-.16*ease((t-5.15)/.8);drawPiece(pieces.emblem,CX,CY,op,sc)}
  if(t>=6.0)drawPiece(pieces.olen,360,565,fade(t,6.0,6.9),1);
  if(t>=7.0)drawPiece(pieces.tag,360,665,fade(t,7.0,7.75),1);
  if(t>=7.8)drawPiece(pieces.sig,360,730,fade(t,7.8,8.55),1);

  if(t>=8.6){
    const labels=['EXPLORA','DESCOBRE','VIVE','REPETE'],centers=[140,287,433,580];
    ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.font='700 13px system-ui, sans-serif';
    pieces.icons.forEach((icon,k)=>{
      const st=8.6+k*.30,op=fade(t,st,st+.28);if(op<=0)return;
      const h=62,w=icon.width*(h/icon.height);ctx.save();ctx.globalAlpha=op;ctx.drawImage(icon,centers[k]-w/2,792,w,h);ctx.fillStyle='rgba(200,246,240,.92)';ctx.fillText(labels[k],centers[k],879);ctx.restore();
    });
  }

  ctx.textAlign='center';ctx.textBaseline='alphabetic';
  if(t>=9.8){ctx.save();ctx.globalAlpha=fade(t,9.8,10.45);ctx.font='700 41px system-ui, sans-serif';ctx.fillStyle='#fff';ctx.fillText('Boa tarde, Filipe',W/2,990);ctx.restore()}
  if(t>=10.1){ctx.save();ctx.globalAlpha=fade(t,10.1,10.8);ctx.font='21px system-ui, sans-serif';ctx.fillStyle='rgb(210,225,222)';ctx.fillText('Bem-vindo de volta · O que queres viver hoje?',W/2,1035);ctx.restore()}

  const prog=clamp(t/DUR);
  ctx.fillStyle='rgba(255,255,255,.19)';roundRect(BAR_X,BAR_Y,BAR_W,4,2);ctx.fill();
  const fw=Math.round(BAR_W*prog);
  if(fw>0){for(let x=0;x<fw;x++){ctx.strokeStyle=ringColor(x/BAR_W,1);ctx.beginPath();ctx.moveTo(BAR_X+x,BAR_Y);ctx.lineTo(BAR_X+x,BAR_Y+4);ctx.stroke()}drawStar(BAR_X+fw,BAR_Y+2,6,1)}
  ctx.font='16px system-ui, sans-serif';ctx.fillStyle='rgba(195,235,225,.9)';ctx.fillText('A iniciar a OLEN...',W/2,1210);
}

function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):(ctx.rect(x,y,w,h))}

function resizeCanvas(){
  if(!canvas||!stage)return;
  const rect=stage.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));
  const sx=canvas.width/W,sy=canvas.height/H,s=Math.max(sx,sy),ox=(canvas.width-W*s)/2,oy=(canvas.height-H*s)/2;
  ctx.setTransform(s,0,0,s,ox,oy);
}

function wrapOriginalHide(){
  if(hideWrapped||typeof window.alphaHideWelcome!=='function')return;
  originalHide=window.alphaHideWelcome.bind(window);
  window.alphaHideWelcome=function(){if(running)return;return originalHide()};
  hideWrapped=true;
}
function overlayVisible(){return !!overlay&&overlay.classList.contains('show')&&overlay.getAttribute('aria-hidden')!=='true'}

function finish(){
  if(finished)return;finished=true;running=false;cancelAnimationFrame(raf);clearTimeout(watchdog);
  window.removeEventListener('resize',resizeCanvas);
  if(overlay)overlay.classList.remove('olen-v107-canvas-running');
  if(stage)stage.remove();
  if(typeof originalHide==='function')requestAnimationFrame(()=>originalHide());
  else if(overlay){overlay.classList.add('leaving');setTimeout(()=>{overlay.classList.remove('show','leaving');overlay.setAttribute('aria-hidden','true')},320)}
}

function frame(now){
  if(!running)return;
  const t=(now-startAt)/1000;
  drawScene(Math.min(t,DUR));
  if(t>=DUR){finish();return}
  raf=requestAnimationFrame(frame);
}

function start(){
  if(!ready||running||finished||!overlayVisible()||!stage)return;
  wrapOriginalHide();if(!hideWrapped)return;
  running=true;overlay.classList.add('olen-v107-canvas-running');resizeCanvas();
  window.addEventListener('resize',resizeCanvas,{passive:true});
  startAt=performance.now();watchdog=setTimeout(finish,13500);raf=requestAnimationFrame(frame);
}

async function prepare(){
  try{
    [bgImg,masterImg]=await Promise.all([loadImage(BG),loadImage(MASTER)]);
    preparePieces();ready=true;if(overlayVisible())start();
  }catch(err){console.warn('[OLEN 4.4.0] Canvas splash assets unavailable; preserving original welcome.',err)}
}

function install(){
  overlay=document.getElementById('alphaWelcomeOverlay');if(!overlay)return;
  wrapOriginalHide();
  if(!stage){stage=document.createElement('div');stage.className='olen-v107-canvas-stage';canvas=document.createElement('canvas');canvas.className='olen-v107-canvas';canvas.setAttribute('aria-hidden','true');ctx=canvas.getContext('2d');stage.appendChild(canvas);overlay.appendChild(stage);prepare()}
  if(!observer){observer=new MutationObserver(()=>{if(overlayVisible()){if(ready)start()}else if(running){running=false;cancelAnimationFrame(raf)}});observer.observe(overlay,{attributes:true,attributeFilter:['class','aria-hidden']})}
  if(overlayVisible()&&ready)start();
}

function boot(){requestAnimationFrame(install);setTimeout(install,80);setTimeout(install,300);setTimeout(install,900)}
document.addEventListener('DOMContentLoaded',boot,{once:true});window.addEventListener('pageshow',boot,{passive:true});boot();
console.info('[OLEN 4.4.0] V10.7 native Canvas splash prepared');
})();
