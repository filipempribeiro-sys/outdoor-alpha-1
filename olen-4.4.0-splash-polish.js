/* OLEN 4.4.0 · V10.7 FINAL VIDEO SPLASH
   Safe integration: the existing welcome remains untouched until the MP4 is ready.
   If video loading/playback fails, the original OLEN welcome continues normally. */
(()=>{
'use strict';
if(window.__olenV107VideoSplash)return;
window.__olenV107VideoSplash=true;

const VIDEO='assets/olen-v10.7-final.mp4';
const BG='assets/olen-splash-background.png';
const READY_TIMEOUT=3000;
const PLAY_WATCHDOG=13500;

let overlay=null;
let stage=null;
let video=null;
let ready=false;
let running=false;
let finished=false;
let observer=null;
let readyTimer=0;
let watchdog=0;
let originalHide=null;
let hideWrapped=false;

const style=document.createElement('style');
style.id='olenV107VideoSplashStyle';
style.textContent=`
#alphaWelcomeOverlay{
  overflow:hidden!important;
}
#alphaWelcomeOverlay .olen-v107-video-stage{
  position:absolute;
  inset:0;
  z-index:20;
  display:none;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  background:#02090d url('${BG}') center/cover no-repeat;
  pointer-events:none;
}
#alphaWelcomeOverlay.olen-v107-video-running .olen-v107-video-stage{
  display:flex!important;
}
#alphaWelcomeOverlay.olen-v107-video-running > .alphaWelcomeInner{
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
}
#alphaWelcomeOverlay .olen-v107-video-stage video{
  display:block;
  width:100%;
  height:100%;
  object-fit:contain;
  object-position:center center;
  background:transparent;
  opacity:0;
  transition:opacity .10s linear;
}
#alphaWelcomeOverlay .olen-v107-video-stage.ready video{
  opacity:1;
}
`;
document.head.appendChild(style);

function restoreOriginalWelcome(){
  running=false;
  clearTimeout(watchdog);
  if(overlay)overlay.classList.remove('olen-v107-video-running');
  if(stage)stage.classList.remove('ready');
  if(video){
    try{video.pause()}catch(_e){}
  }
}

function finishVideo(){
  if(finished)return;
  finished=true;
  restoreOriginalWelcome();
  if(typeof originalHide==='function'){
    requestAnimationFrame(()=>originalHide());
  }else if(overlay){
    overlay.classList.add('leaving');
    setTimeout(()=>{
      overlay.classList.remove('show','leaving');
      overlay.setAttribute('aria-hidden','true');
    },320);
  }
}

function failSafe(){
  /* Never replace the working startup with an error screen. */
  if(running){
    finished=true;
    restoreOriginalWelcome();
    if(typeof originalHide==='function')originalHide();
  }
}

function wrapOriginalHide(){
  if(hideWrapped)return;
  if(typeof window.alphaHideWelcome!=='function')return;
  originalHide=window.alphaHideWelcome.bind(window);
  window.alphaHideWelcome=function(){
    if(running)return;
    return originalHide();
  };
  hideWrapped=true;
}

function overlayIsVisible(){
  return !!overlay && overlay.classList.contains('show') && overlay.getAttribute('aria-hidden')!=='true';
}

async function startVideo(){
  if(!ready||running||finished||!overlayIsVisible()||!video||!stage)return;
  wrapOriginalHide();
  if(!hideWrapped)return;

  try{
    video.currentTime=0;
    video.muted=true;
    video.defaultMuted=true;
    const playPromise=video.play();
    if(playPromise&&typeof playPromise.then==='function')await playPromise;
  }catch(err){
    console.warn('[OLEN 4.4.0] V10.7 video play unavailable; keeping original welcome.',err);
    return;
  }

  /* Only now, after playback really started, hide the original welcome. */
  running=true;
  overlay.classList.add('olen-v107-video-running');
  stage.classList.add('ready');
  clearTimeout(watchdog);
  watchdog=setTimeout(failSafe,PLAY_WATCHDOG);
}

function markReady(){
  if(ready)return;
  ready=true;
  clearTimeout(readyTimer);
  if(overlayIsVisible())startVideo();
}

function buildVideo(){
  if(video||!overlay)return;

  stage=document.createElement('div');
  stage.className='olen-v107-video-stage';
  stage.setAttribute('aria-hidden','true');

  video=document.createElement('video');
  video.className='olen-v107-video';
  video.src=VIDEO;
  video.preload='auto';
  video.autoplay=false;
  video.muted=true;
  video.defaultMuted=true;
  video.playsInline=true;
  video.setAttribute('playsinline','');
  video.setAttribute('webkit-playsinline','');
  video.setAttribute('muted','');
  video.setAttribute('preload','auto');
  video.setAttribute('aria-hidden','true');
  video.controls=false;
  try{video.disablePictureInPicture=true}catch(_e){}

  video.addEventListener('loadeddata',markReady,{once:true});
  video.addEventListener('canplay',markReady,{once:true});
  video.addEventListener('ended',finishVideo);
  video.addEventListener('error',()=>{
    console.warn('[OLEN 4.4.0] V10.7 MP4 failed to load; original welcome preserved.');
    if(running)failSafe();
  });

  stage.appendChild(video);
  overlay.appendChild(stage);

  /* A slow/missing video must never hold the app startup. */
  readyTimer=setTimeout(()=>{
    if(!ready)console.warn('[OLEN 4.4.0] V10.7 MP4 not ready in time; original welcome preserved.');
  },READY_TIMEOUT);

  try{video.load()}catch(_e){}
}

function install(){
  overlay=document.getElementById('alphaWelcomeOverlay');
  if(!overlay)return;

  wrapOriginalHide();
  buildVideo();

  if(!observer){
    observer=new MutationObserver(()=>{
      if(overlayIsVisible()){
        if(ready)startVideo();
      }else if(running){
        restoreOriginalWelcome();
      }
    });
    observer.observe(overlay,{attributes:true,attributeFilter:['class','aria-hidden']});
  }

  if(overlayIsVisible()&&ready)startVideo();
}

function boot(){
  requestAnimationFrame(install);
  setTimeout(install,80);
  setTimeout(install,300);
  setTimeout(install,900);
}

document.addEventListener('DOMContentLoaded',boot,{once:true});
window.addEventListener('pageshow',boot,{passive:true});
boot();
console.info('[OLEN 4.4.0] V10.7 FINAL video splash prepared with fail-safe fallback');
})();
