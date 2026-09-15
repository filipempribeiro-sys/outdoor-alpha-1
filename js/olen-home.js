/* OLEN 5.0 · HOME
   Consolidated Home owner prepared from the current 5/5 behaviour.
   IMPORTANT: intentionally NOT loaded by index.html or sw.js yet.
   Runtime remains unchanged until an explicit cutover step.
*/
(()=>{
'use strict';

const core=window.OLEN?.core;
if(!core||window.OLEN?.home?.version==='5.0.0')return;

const VERSION='5.0.0';
const STYLE_ID='olenHome500Style';
const FIXED='olenHomeFixed500';
let stableGeometry=null;
let swipe=null;

function homeElement(){return core.byId('home')}
function footerElement(){return core.qs('.bottom')}
function cardElement(){return core.byId('lifestyleAI')}
function isHome(){
  if(core.isChat())return false;
  const home=homeElement();
  return !!home&&(document.body?.dataset?.alphaView==='home'||home.classList.contains('active')||home.classList.contains('show'));
}

function installStyle(){
  if(core.byId(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
body.${FIXED}{overflow:hidden!important}
body.${FIXED} #home{overflow:hidden!important;padding-top:0!important}
body.${FIXED} #home.active>#lifestyleAI,
body.${FIXED}[data-alpha-view="home"] #home>#lifestyleAI{
  margin-top:0!important;
  margin-bottom:0!important;
  height:var(--olen-home-chat-height)!important;
  min-height:var(--olen-home-chat-height)!important;
  max-height:var(--olen-home-chat-height)!important;
}
body:not(.alphaChatMode):not(.alphaComposeMode)[data-alpha-view="home"] #spotifyNav,
body:not(.alphaChatMode):not(.alphaComposeMode) #home.active ~ .bottom #spotifyNav,
body:not(.alphaChatMode):not(.alphaComposeMode) #home.active .bottom #spotifyNav{display:none!important}
body:not(.alphaChatMode):not(.alphaComposeMode)[data-alpha-view="home"] .bottom,
body:not(.alphaChatMode):not(.alphaComposeMode):has(#home.active) .bottom{
  --nav-count:6!important;
  grid-template-columns:repeat(6,minmax(0,1fr))!important;
}
body:not(.alphaChatMode):not(.alphaComposeMode)[data-alpha-view="home"] .bottom .nav:not(.hidden),
body:not(.alphaChatMode):not(.alphaComposeMode):has(#home.active) .bottom .nav:not(.hidden){
  width:100%!important;min-width:0!important;justify-self:stretch!important
}
body:not(.alphaChatMode):not(.alphaComposeMode) #home.active #lifestyleAI>.aiTopbar .aiChatMenuBtn,
body:not(.alphaChatMode):not(.alphaComposeMode) #home.active #lifestyleAI>.aiTopbar .alphaNewChatBtn{display:none!important}
`;
  document.head.appendChild(style);
}

function clearHomeState(){
  document.body?.classList.remove(FIXED);
  const footer=footerElement();
  footer?.style.removeProperty('--nav-count');
  footer?.style.removeProperty('grid-template-columns');
  core.byId('spotifyNav')?.style.removeProperty('display');
}

function syncFooter(){
  const footer=footerElement();
  const spotify=core.byId('spotifyNav');
  if(!footer)return;
  if(!isHome()){
    footer.style.removeProperty('--nav-count');
    footer.style.removeProperty('grid-template-columns');
    spotify?.style.removeProperty('display');
    return;
  }
  footer.style.setProperty('--nav-count','6','important');
  footer.style.setProperty('grid-template-columns','repeat(6,minmax(0,1fr))','important');
  spotify?.style.setProperty('display','none','important');
}

function applyStableGeometry(){
  if(!stableGeometry||!isHome())return false;
  document.body.classList.add(FIXED);
  document.body.style.setProperty('--olen-home-chat-height',stableGeometry.height+'px');
  document.body.style.setProperty('--olen-home-balanced-gap',stableGeometry.gap+'px');
  if(window.scrollY)window.scrollTo(0,0);
  return true;
}

function measureHome(){
  if(!isHome()){clearHomeState();return false}
  const card=cardElement(),footer=footerElement();
  if(!card||!footer)return false;
  document.body.classList.add(FIXED);
  const rootStyle=getComputedStyle(document.documentElement);
  const cardStyle=getComputedStyle(card);
  const fallbackGap=parseFloat(rootStyle.getPropertyValue('--alpha-shell-gap'))||10;
  const cardMarginTop=parseFloat(cardStyle.marginTop)||0;
  const cardRect=card.getBoundingClientRect();
  const footerRect=footer.getBoundingClientRect();
  const headerRect=core.qs('.top')?.getBoundingClientRect?.();
  const measuredTopGap=headerRect?Math.max(0,Math.round(cardRect.top-headerRect.bottom)):0;
  const designGap=Math.max(16,Math.round(fallbackGap),Math.round(cardMarginTop));
  const balancedGap=Math.max(designGap,measuredTopGap);
  const height=Math.max(260,Math.floor(footerRect.top-balancedGap-cardRect.top));
  document.body.style.setProperty('--olen-home-chat-height',height+'px');
  document.body.style.setProperty('--olen-home-balanced-gap',balancedGap+'px');
  stableGeometry={height,gap:balancedGap};
  if(window.scrollY)window.scrollTo(0,0);
  return true;
}

function refresh(){
  if(!isHome()){clearHomeState();return}
  syncFooter();
  core.raf2(()=>{
    if(typeof window.alphaFitShell==='function')core.safe(()=>window.alphaFitShell());
    if(!applyStableGeometry())measureHome();
    core.emit('home:ready',{geometry:stableGeometry});
  });
}
function resetAndRefresh(){stableGeometry=null;refresh()}
function restore(){
  const run=()=>{syncFooter();if(!applyStableGeometry()&&isHome())measureHome()};
  core.raf2(run);core.later(run,80);core.later(run,220);
}

function touchStart(event){
  if(event.touches?.length!==1){swipe=null;return}
  const t=event.touches[0];
  swipe={x:t.clientX,y:t.clientY,edge:t.clientX<=48};
}
function touchEnd(event){
  const start=swipe;swipe=null;
  if(!start?.edge)return;
  const t=event.changedTouches?.[0];if(!t)return;
  const dx=t.clientX-start.x,dy=Math.abs(t.clientY-start.y);
  if(dx<70||dx<=dy*1.25)return;
  core.later(restore,40);core.later(restore,120);core.later(restore,260);
}

function init(){
  installStyle();
  core.listen(window,'pageshow',restore,{passive:true});
  core.listen(window,'popstate',restore,{passive:true});
  core.listen(window,'hashchange',restore,{passive:true});
  core.listen(window,'resize',resetAndRefresh,{passive:true});
  core.listen(window,'orientationchange',resetAndRefresh,{passive:true});
  if(window.visualViewport)core.listen(window.visualViewport,'resize',()=>{if(!stableGeometry)refresh()},{passive:true});
  core.listen(document,'click',()=>core.raf2(refresh),true);
  core.listen(document,'touchstart',touchStart,{passive:true,capture:true});
  core.listen(document,'touchend',touchEnd,{passive:true,capture:true});
  core.later(refresh,100);core.later(refresh,350);
}

window.OLEN.home=Object.freeze({version:VERSION,init,refresh,restore,isHome,get geometry(){return stableGeometry}});
})();
