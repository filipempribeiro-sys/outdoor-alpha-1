/* ALPHA 4.3.34 · CHAT SIDEBAR FOOTER IMMEDIATE
   Isolated timing fix only.
   Reuses the existing Stage 3 footer builder; no polling or observers.
*/
(()=>{
'use strict';
if(window.__alphaChatFooterImmediate434)return;
window.__alphaChatFooterImmediate434=true;

const isChat=()=>document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');
const opened=()=>document.body.classList.contains('alphaChatOlenOpen4330');

function refreshFooter(){
  if(!isChat()||!opened())return;
  const sidebar=document.querySelector('.alphaChatOlenSidebar4330');
  if(!sidebar)return;
  /* Stage 3/fix2 already owns creation, icons and click delegation.
     Trigger its existing event-driven refresh path synchronously. */
  sidebar.dispatchEvent(new Event('focusin',{bubbles:true}));
  sidebar.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:false}));
}

function onOpenIntent(e){
  if(!isChat())return;
  const trigger=e.target?.closest?.('.aiChatMenuBtn,#aiChatMenuBtn,#alphaChatMenuBtn,.alphaFloatingMenu,button[aria-label="Abrir conversas"]');
  if(!trigger)return;
  requestAnimationFrame(refreshFooter);
}

document.addEventListener('click',onOpenIntent,true);
document.addEventListener('touchend',()=>requestAnimationFrame(refreshFooter),{passive:true,capture:true});
window.addEventListener('pageshow',()=>requestAnimationFrame(refreshFooter),{passive:true});

console.info('[ALPHA 4.3.34] Chat sidebar footer immediate');
})();
