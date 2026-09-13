/* OLEN 4.4.0 · Splash startup guard
   Keeps the legacy welcome overlay alive while the native Canvas intro assets are loading.
   The guard becomes transparent as soon as the Canvas stage is removed, so the normal
   alphaHideWelcome flow remains untouched after the intro finishes. */
(()=>{
'use strict';
if(window.__olenSplashStartupGuard)return;
window.__olenSplashStartupGuard=true;

const startedAt=performance.now();
let baseHide=null;
let wrapped=false;
let fallbackTimer=0;

function stageAlive(){
  return !!document.querySelector('#alphaWelcomeOverlay .olen-v107-canvas-stage');
}

function shouldHold(){
  if(performance.now()-startedAt>16000)return false;
  return stageAlive();
}

function installGuard(){
  if(wrapped)return true;
  if(typeof window.alphaHideWelcome!=='function')return false;

  baseHide=window.alphaHideWelcome.bind(window);
  window.alphaHideWelcome=function(){
    if(shouldHold())return;
    return baseHide();
  };
  wrapped=true;

  fallbackTimer=setTimeout(()=>{
    if(!stageAlive()&&typeof baseHide==='function')baseHide();
  },16500);
  return true;
}

function boot(){
  if(installGuard())return;
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(installGuard()||tries>=80)clearInterval(timer);
  },25);
}

boot();
document.addEventListener('DOMContentLoaded',boot,{once:true});
window.addEventListener('pageshow',boot,{passive:true});
})();
