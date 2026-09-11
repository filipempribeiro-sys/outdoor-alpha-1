/* ALPHA 4.3.31f · INTERNAL SIDEBAR RESTORE
   Restores the contextual sidebar on internal views (3–7):
   - hamburger opens it reliably
   - edge swipe right opens it
   - swipe left / scrim / close button closes it
   Event-driven only. No observers, polling or intervals.
*/
(()=>{
'use strict';
if(window.__alphaInternalSidebar431f)return;window.__alphaInternalSidebar431f=true;

const EDGE=34,OPEN_DX=58,CLOSE_DX=52,DOM=1.25;
let sx=0,sy=0,tracking=false,startedOpen=false;
const $=s=>document.querySelector(s);

function eligible(){
  const b=document.body;
  if(!b)return false;
  if(b.dataset.alphaView==='home')return false;
  if(b.classList.contains('alphaChatMode')||b.classList.contains('alphaComposeMode')||b.classList.contains('alphaWelcomeActive'))return false;
  return true;
}
function side(){return $('#alphaInternalSidebar')}
function scrim(){return $('#alphaInternalScrim')}
function isOpen(){return !!side()?.classList.contains('show')}
function open(){
  if(!eligible())return false;
  document.body.classList.remove('alphaSidebarOpen4330','alphaOlenFunctionalOpen10');
  const s=side(),m=scrim();if(!s)return false;
  s.classList.add('show');m?.classList.add('show');
  s.setAttribute('aria-hidden','false');
  $('#alphaInternalMenuBtn')?.setAttribute('aria-expanded','true');
  return true;
}
function close(){
  const s=side(),m=scrim();if(!s)return false;
  s.classList.remove('show');m?.classList.remove('show');
  s.setAttribute('aria-hidden','true');
  $('#alphaInternalMenuBtn')?.setAttribute('aria-expanded','false');
  return true;
}
function toggle(){return isOpen()?close():open()}
function blockedTarget(t){
  return !!t?.closest?.('input,textarea,select,[contenteditable="true"],.maplibregl-map,#realMap,.alphaTimePicker,.alphaCalendarEditor,[role="dialog"]');
}

/* Own the internal hamburger before legacy/sidebar handlers can redirect the click
   to the conversation sidebar, which is intentionally hidden on internal views. */
document.addEventListener('click',e=>{
  const menu=e.target?.closest?.('#alphaInternalMenuBtn');
  if(menu&&eligible()){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();toggle();return;
  }
  if(e.target?.closest?.('#alphaInternalScrim,.alphaInternalClose')){
    if(isOpen()){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();close();
    }
  }
},true);

/* Touch edge gesture: right from the left edge opens; left while open closes. */
document.addEventListener('touchstart',e=>{
  if(e.touches?.length!==1)return;
  const t=e.touches[0];
  startedOpen=isOpen();
  if(startedOpen){sx=t.clientX;sy=t.clientY;tracking=!blockedTarget(e.target);return}
  if(!eligible()||t.clientX>EDGE||blockedTarget(e.target)){tracking=false;return}
  sx=t.clientX;sy=t.clientY;tracking=true;
},{passive:true,capture:true});

document.addEventListener('touchend',e=>{
  if(!tracking)return;tracking=false;
  const t=e.changedTouches?.[0];if(!t)return;
  const dx=t.clientX-sx,dy=t.clientY-sy;
  if(Math.abs(dx)<Math.abs(dy)*DOM)return;
  if(startedOpen&&dx<=-CLOSE_DX){e.preventDefault?.();close();return}
  if(!startedOpen&&dx>=OPEN_DX){e.preventDefault?.();open()}
},{passive:false,capture:true});

/* Keep a public bridge for existing inline handlers without relying on the
   legacy implementation that currently conflicts with the OLEN sidebar. */
window.alphaToggleInternalSidebar=function(e){e?.preventDefault?.();e?.stopPropagation?.();toggle()};
window.alphaOpenInternalSidebar=open;
window.alphaCloseInternalSidebar=close;

console.info('[ALPHA 4.3.31f] Internal sidebar hamburger + swipe restaurados');
})();
