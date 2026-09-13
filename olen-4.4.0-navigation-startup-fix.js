/* OLEN 4.4.0 · NAVIGATION + STARTUP CONSISTENCY
   Root-cause revision:
   - never dispatch resize/orientation to restore Home (that cleared the stable geometry)
   - request the existing Home owner to reapply its saved geometry
   - detect Android/web swipe-back completion and restore that exact geometry
   - keep chat-sidebar state sync event-driven only
*/
(()=>{
'use strict';
if(window.__olenNavigationStartupFix440)return;
window.__olenNavigationStartupFix440=true;
const OPEN='alphaChatOlenOpen4330';

function isHome(){
 const b=document.body;
 if(!b||b.classList.contains('alphaChatMode')||b.classList.contains('alphaComposeMode'))return false;
 const h=document.getElementById('home');
 return !!h&&(h.classList.contains('active')||b.dataset.alphaView==='home');
}
function restoreHome(){
 if(!isHome())return;
 window.dispatchEvent(new CustomEvent('olen:restore-home-geometry'));
}
function restoreSoon(){
 requestAnimationFrame(()=>requestAnimationFrame(restoreHome));
 setTimeout(restoreHome,80);
 setTimeout(restoreHome,220);
}
function syncSidebar(){
 if(!document.body?.classList.contains(OPEN))return;
 const s=document.querySelector('#aiChatMenu,.alphaConversationSidebar');
 if(s)s.style.setProperty('z-index','12050','important');
}

window.addEventListener('popstate',()=>{syncSidebar();restoreSoon()},{passive:true});
window.addEventListener('pageshow',()=>{syncSidebar();restoreSoon()},{passive:true});
window.addEventListener('hashchange',restoreSoon,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncSidebar();restoreSoon()}},{passive:true});
document.addEventListener('click',e=>{
 if(e.target?.closest?.('.bottom .nav,[data-view]'))setTimeout(restoreSoon,0);
},true);

/* Android/PWA edge swipe can change the app view without the same callback path as the hardware Back. */
let sx=0,sy=0,tracking=false;
document.addEventListener('touchstart',e=>{
 if(e.touches?.length!==1)return;
 const t=e.touches[0];
 tracking=t.clientX<=42;sx=t.clientX;sy=t.clientY;
},{passive:true,capture:true});
document.addEventListener('touchend',e=>{
 if(!tracking){tracking=false;return}
 tracking=false;
 const t=e.changedTouches?.[0];if(!t)return;
 const dx=t.clientX-sx,dy=Math.abs(t.clientY-sy);
 if(dx>=70&&dx>dy*1.35)setTimeout(restoreSoon,30);
},{passive:true,capture:true});

setTimeout(()=>{syncSidebar();restoreSoon()},80);
console.info('[OLEN 4.4.0] navigation consistency · stable Home geometry preserved');
})();
