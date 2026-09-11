/* ALPHA 4.3.31 · HOME MENU CLEANUP
   Prevent the internal-pages hamburger from surviving a swipe-back to Home.
   Event-driven; no observers or polling.
*/
(()=>{
'use strict';
const $=s=>document.querySelector(s);
function isHome(){
  const b=document.body;
  if(!b)return false;
  if(b.classList.contains('alphaChatMode')||b.classList.contains('alphaComposeMode'))return false;
  if(b.dataset.alphaView==='home')return true;
  const home=$('#home.view.active,#lifestyleAI.view.active,[data-view="home"].active');
  return !!home;
}
function sync(){
  const b=document.body,btn=$('#alphaInternalMenuBtn'),side=$('#alphaInternalSidebar'),scrim=$('#alphaInternalScrim');
  if(!b||!btn)return;
  if(isHome()){
    side?.classList.remove('show');
    scrim?.classList.remove('show');
    btn.style.setProperty('display','none','important');
    btn.style.setProperty('visibility','hidden','important');
    btn.style.setProperty('opacity','0','important');
    btn.style.setProperty('pointer-events','none','important');
  }else{
    btn.style.removeProperty('display');
    btn.style.removeProperty('visibility');
    btn.style.removeProperty('opacity');
    btn.style.removeProperty('pointer-events');
  }
}
/* Navigation/swipe implementations already emit or finish through these browser/UI events. */
for(const ev of ['pageshow','popstate','hashchange','alpha:viewchange','alpha:navigate','alpha:routechange'])window.addEventListener(ev,()=>requestAnimationFrame(sync),{passive:true});
document.addEventListener('click',e=>{
  if(e.target?.closest?.('nav.bottom .nav,.alphaSidebarDock button,#alphaInternalSidebar button,[data-view],[data-route]'))setTimeout(sync,40);
},true);
document.addEventListener('touchend',()=>setTimeout(sync,50),{passive:true});
window.alphaSyncInternalMenu4331=sync;
setTimeout(sync,0);
console.info('[ALPHA 4.3.31] home menu cleanup ativo');
})();
