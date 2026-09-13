/* OLEN 4.4.0 · Splash startup guard
   The legacy welcome must never be visible before the native Canvas intro.
   Keep the overlay alive, hide only the legacy inner content, and let Canvas own first paint.
*/
(()=>{
'use strict';
if(window.__olenSplashStartupGuard)return;
window.__olenSplashStartupGuard=true;
const startedAt=performance.now();
let baseHide=null,wrapped=false;

function overlay(){return document.getElementById('alphaWelcomeOverlay')}
function stageAlive(){return !!document.querySelector('#alphaWelcomeOverlay .olen-v107-canvas-stage')}
function suppressLegacy(){
 const ov=overlay();if(!ov)return;
 ov.classList.add('show');
 ov.classList.remove('leaving');
 ov.setAttribute('aria-hidden','false');
 ov.style.setProperty('background','#02090d url("assets/olen-background.png") center/cover no-repeat','important');
 const legacy=ov.querySelector('.alphaWelcomeInner');
 if(legacy){legacy.style.setProperty('visibility','hidden','important');legacy.style.setProperty('opacity','0','important')}
}
function shouldHold(){return performance.now()-startedAt<=16000&&(stageAlive()||!!overlay())}
function installGuard(){
 if(wrapped)return true;
 if(typeof window.alphaHideWelcome!=='function')return false;
 baseHide=window.alphaHideWelcome.bind(window);
 window.alphaHideWelcome=function(){if(shouldHold())return;return baseHide()};
 wrapped=true;return true;
}
function boot(){
 suppressLegacy();
 if(installGuard())return;
 let tries=0;
 const timer=setInterval(()=>{tries++;suppressLegacy();if(installGuard()||tries>=80)clearInterval(timer)},25);
}
boot();
document.addEventListener('DOMContentLoaded',boot,{once:true});
window.addEventListener('pageshow',boot,{passive:true});
console.info('[OLEN 4.4.0] splash guard · legacy welcome suppressed');
})();
