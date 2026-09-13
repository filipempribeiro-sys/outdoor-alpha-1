/* OLEN 4.4.0 · NAVIGATION + STARTUP CONSISTENCY
   Surgical patch:
   1) Chat sidebar: hamburger is hidden while sidebar is open and sidebar header stays above it.
   2) Home: every return path (swipe/popstate/pageshow) runs the same home geometry refresh.
   3) Startup: hide app shell before first paint; welcome/splash owns first visible frame.
   Event driven only: no polling, no MutationObserver.
*/
(()=>{
'use strict';
if(window.__olenNavigationStartupFix440)return;
window.__olenNavigationStartupFix440=true;

const STYLE_ID='olenNavigationStartupFix440Style';
const OPEN='alphaChatOlenOpen4330';
const HOME_SELECTORS=['#homeView','[data-view="home"]','.homeView','.alphaHome','.alphaHomeView'];

function addStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
html.olenBootPending440 body{background:#050b10!important}
html.olenBootPending440 body>*:not(#alphaWelcomeOverlay){visibility:hidden!important}
html.olenBootPending440 #alphaWelcomeOverlay{visibility:visible!important;opacity:1!important;display:flex!important}
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

function isWelcomeVisible(){
 const w=document.getElementById('alphaWelcomeOverlay');
 if(!w)return false;
 const cs=getComputedStyle(w);
 return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0;
}
function releaseBoot(){
 if(isWelcomeVisible())document.documentElement.classList.remove('olenBootPending440');
}
function armBoot(){
 document.documentElement.classList.add('olenBootPending440');
 addStyle();
 requestAnimationFrame(()=>requestAnimationFrame(releaseBoot));
 setTimeout(releaseBoot,700);
}

function homeActive(){
 if(document.body?.dataset?.alphaView==='home')return true;
 if(document.querySelector('.bottom .nav.active')?.textContent?.toLocaleLowerCase('pt-PT').includes('olen'))return true;
 return HOME_SELECTORS.some(sel=>{const el=document.querySelector(sel);if(!el)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'});
}
function refreshHome(){
 if(!homeActive())return;
 // Reuse the app's own resize/layout owners instead of duplicating geometry.
 window.dispatchEvent(new Event('resize'));
 window.dispatchEvent(new Event('orientationchange'));
 const home=document.querySelector('#homeView,[data-view="home"],.homeView,.alphaHome,.alphaHomeView');
 if(home){
   home.getBoundingClientRect();
   home.dispatchEvent(new CustomEvent('olen:home-visible',{bubbles:true}));
 }
}
function refreshHomeAfterNavigation(){
 requestAnimationFrame(()=>requestAnimationFrame(refreshHome));
 setTimeout(refreshHome,120);
 setTimeout(refreshHome,320);
}

function sidebarOpen(){return document.body?.classList.contains(OPEN)}
function syncSidebar(){
 if(!sidebarOpen())return;
 const sidebar=document.querySelector('.alphaChatOlenSidebar4330,#aiChatMenu,.alphaConversationSidebar');
 if(sidebar){sidebar.style.setProperty('z-index','12050','important')}
}

addStyle();
window.addEventListener('popstate',()=>{syncSidebar();refreshHomeAfterNavigation()},{passive:true});
window.addEventListener('pageshow',()=>{syncSidebar();refreshHomeAfterNavigation();releaseBoot()},{passive:true});
window.addEventListener('hashchange',refreshHomeAfterNavigation,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncSidebar();refreshHomeAfterNavigation()}},{passive:true});
document.addEventListener('click',e=>{
 if(e.target?.closest?.('.bottom .nav,[data-view],.alphaChatOlenSidebar4330'))setTimeout(()=>{syncSidebar();refreshHomeAfterNavigation()},0);
},true);

// On a true document boot this executes before the splash polish has painted.
if(document.readyState==='loading')armBoot();
else{addStyle();syncSidebar();refreshHomeAfterNavigation()}
console.info('[OLEN 4.4.0] navigation/startup consistency active');
})();