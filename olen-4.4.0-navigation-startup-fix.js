/* OLEN 4.4.0 · NAVIGATION CONSISTENCY
   Surgical patch only:
   - Chat sidebar state stays event-driven.
   - Android/PWA swipe-back asks the existing Home owner to restore its saved geometry.
   - Never dispatch resize/orientation and never hide the app shell.
   No polling. No MutationObserver.
*/
(()=>{
'use strict';
if(window.__olenNavigationStartupFix440)return;
window.__olenNavigationStartupFix440=true;

const STYLE_ID='olenNavigationStartupFix440Style';
const OPEN='alphaChatOlenOpen4330';

function addStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
body.${OPEN} #aiChatMenu,
body.${OPEN} .alphaConversationSidebar,
body.${OPEN} .alphaChatOlenSidebar4330{z-index:12050!important}
body.${OPEN} .alphaChatOlenSidebar4330 .alphaChatOlenTop4330,
body.${OPEN} .alphaChatOlenSidebar4330 header{position:relative!important;z-index:12060!important}
body.${OPEN} .aiChatMenuBtn,
body.${OPEN} #aiChatMenuBtn,
body.${OPEN} #alphaChatMenuBtn,
body.${OPEN} .alphaFloatingMenu,
body.${OPEN} .alphaChatActions4324,
body.${OPEN} [data-alpha-chat-menu-trigger],
body.${OPEN} [aria-label="Menu"],
body.${OPEN} [aria-label="Abrir menu"]{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
`;
 document.head.appendChild(s);
}

function syncSidebar(){
 if(!document.body?.classList.contains(OPEN))return;
 const sidebar=document.querySelector('.alphaChatOlenSidebar4330,#aiChatMenu,.alphaConversationSidebar');
 if(sidebar)sidebar.style.setProperty('z-index','12050','important');
}

function requestHomeRestore(){
 window.dispatchEvent(new CustomEvent('olen:restore-home-geometry'));
}
function restoreSoon(){
 requestAnimationFrame(requestHomeRestore);
 setTimeout(requestHomeRestore,80);
 setTimeout(requestHomeRestore,220);
 setTimeout(requestHomeRestore,450);
 setTimeout(requestHomeRestore,700);
}

addStyle();
window.addEventListener('popstate',()=>{syncSidebar();restoreSoon()},{passive:true});
window.addEventListener('pageshow',()=>{syncSidebar();restoreSoon()},{passive:true});
window.addEventListener('hashchange',restoreSoon,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncSidebar();restoreSoon()}},{passive:true});
document.addEventListener('click',e=>{
 if(e.target?.closest?.('.bottom .nav,[data-view]'))setTimeout(restoreSoon,0);
},true);

/* Android/PWA back gesture: detect an edge-origin horizontal swipe and only restore the already-saved Home geometry. */
let edgeSwipe=false,startX=0,startY=0;
document.addEventListener('touchstart',e=>{
 if(e.touches?.length!==1){edgeSwipe=false;return}
 const t=e.touches[0];
 edgeSwipe=t.clientX<=46;
 startX=t.clientX;startY=t.clientY;
},{passive:true,capture:true});
document.addEventListener('touchend',e=>{
 if(!edgeSwipe){edgeSwipe=false;return}
 edgeSwipe=false;
 const t=e.changedTouches?.[0];if(!t)return;
 const dx=t.clientX-startX,dy=Math.abs(t.clientY-startY);
 if(dx>=64&&dx>dy*1.25)setTimeout(restoreSoon,20);
},{passive:true,capture:true});

autoInit();
function autoInit(){syncSidebar()}
console.info('[OLEN 4.4.0] navigation consistency active · Home geometry restore only');
})();
