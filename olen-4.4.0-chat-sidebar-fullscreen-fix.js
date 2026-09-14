/* OLEN 4.4.0 · CHAT FULLSCREEN SIDEBAR HEADER FIX
   Scope: OLEN/Chat fullscreen sidebar only.
   - hides the actual Chat hamburger/menu trigger while the sidebar is open
   - keeps the sidebar OLEN logo/header above any remaining overlays
   - pins the sidebar search button to the top-right of its header
   - uses the shared OLEN UI logo at 60x60px in the chat sidebar only
   No Home/intro/footer/other-tab behavior is changed.
*/
(()=>{
'use strict';
if(window.__olenChatFullscreenSidebarHeaderFix440)return;
window.__olenChatFullscreenSidebarHeaderFix440=true;

const style=document.createElement('style');
style.id='olenChatFullscreenSidebarHeaderFix440Style';
style.textContent=`
/* Exact Chat fullscreen hamburger override.
   Includes #lifestyleAI so it outranks the legacy
   "hamburger never disappears" rule without changing layout. */
body.alphaChatOlenOpen4330.alphaChatMode #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaComposeMode #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu{
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
}

body.alphaChatOlenOpen4330.alphaChatMode #chatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #chatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .chatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .chatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode #aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode #alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaChatMode .alphaMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .menuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .menuBtn,
body.alphaChatOlenOpen4330.alphaChatMode button[aria-label="Abrir menu"],
body.alphaChatOlenOpen4330.alphaComposeMode button[aria-label="Abrir menu"],
body.alphaChatOlenOpen4330.alphaChatMode button[aria-label="Menu"],
body.alphaChatOlenOpen4330.alphaComposeMode button[aria-label="Menu"],
body.alphaChatOlenOpen4330.alphaChatMode button[aria-label="Abrir navegação"],
body.alphaChatOlenOpen4330.alphaComposeMode button[aria-label="Abrir navegação"],
body.alphaChatOlenOpen4330.alphaChatMode button[aria-label="Abrir conversas"],
body.alphaChatOlenOpen4330.alphaComposeMode button[aria-label="Abrir conversas"]{
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
}
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenHead4330,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenHead4330{
  position:relative!important;
  z-index:5!important;
  padding-right:52px!important;
}
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenSearch4330,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenSearch4330{
  position:absolute!important;
  top:0!important;
  right:0!important;
  margin:0!important;
  z-index:7!important;
}
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenBrand4330,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenBrand4330{
  width:60px!important;
  height:60px!important;
  min-width:60px!important;
  visibility:visible!important;
  opacity:1!important;
  z-index:6!important;
  pointer-events:none!important;
}
body.alphaChatMode .alphaChatOlenSidebar4330 .olenChatSidebarUiLogo440,
body.alphaComposeMode .alphaChatOlenSidebar4330 .olenChatSidebarUiLogo440{
  display:block!important;
  width:60px!important;
  height:60px!important;
  min-width:60px!important;
  object-fit:contain!important;
  margin:0!important;
  visibility:visible!important;
  opacity:1!important;
  pointer-events:none!important;
}
`;
document.head.appendChild(style);

const applySidebarLogo=()=>{
  const brand=document.querySelector('.alphaChatOlenSidebar4330 .alphaChatOlenBrand4330');
  if(!brand)return;
  let logo=brand.querySelector('.olenChatSidebarUiLogo440');
  if(!logo){
    logo=document.createElement('img');
    logo.className='olenChatSidebarUiLogo440';
    logo.src='assets/olen-ui.png';
    logo.alt='OLEN';
    logo.width=60;
    logo.height=60;
    brand.replaceChildren(logo);
  }
};

/*
  The legacy index stylesheet contains an !important rule that explicitly keeps
  the hamburger visible.  CSS specificity alone is therefore not trusted here.
  While the Chat sidebar is open we set the three visual properties directly on
  the real button as inline !important declarations.  Inline !important wins
  over every author stylesheet rule.  On close, only the properties written by
  this fix are removed, restoring the original Chat trigger untouched.
*/
const hamburgerSelector='#lifestyleAI .aiChatMenuBtn.alphaFloatingMenu';
const sidebarIsOpen=()=>{
  const body=document.body;
  if(!body)return false;
  const inChat=body.classList.contains('alphaChatMode')||body.classList.contains('alphaComposeMode');
  if(!inChat)return false;
  if(body.classList.contains('alphaChatOlenOpen4330'))return true;
  const side=document.querySelector('#aiChatMenu, .alphaConversationSidebar');
  return !!side && (side.classList.contains('show') || side.getAttribute('aria-hidden')==='false');
};
const syncHamburger=()=>{
  const btn=document.querySelector(hamburgerSelector);
  if(!btn)return;
  if(sidebarIsOpen()){
    btn.style.setProperty('visibility','hidden','important');
    btn.style.setProperty('opacity','0','important');
    btn.style.setProperty('pointer-events','none','important');
    btn.dataset.olenSidebarHidden='1';
  }else if(btn.dataset.olenSidebarHidden==='1'){
    btn.style.removeProperty('visibility');
    btn.style.removeProperty('opacity');
    btn.style.removeProperty('pointer-events');
    delete btn.dataset.olenSidebarHidden;
  }
};
const syncHeader=()=>{
  applySidebarLogo();
  syncHamburger();
};

document.addEventListener('click',()=>requestAnimationFrame(syncHeader),true);
document.addEventListener('touchend',()=>requestAnimationFrame(syncHeader),{capture:true,passive:true});
window.addEventListener('pageshow',()=>requestAnimationFrame(syncHeader),{passive:true});
window.addEventListener('popstate',()=>requestAnimationFrame(syncHeader),{passive:true});

/* Wrap the public Chat sidebar API so open/close synchronise the trigger even
   when the sidebar was opened by swipe instead of by clicking the hamburger. */
const wrapSidebarApi=()=>{
  ['alphaOpenChatOlenSidebar','alphaCloseChatOlenSidebar','alphaToggleChatOlenSidebar'].forEach(name=>{
    const fn=window[name];
    if(typeof fn!=='function'||fn.__olenHamburgerSync440)return;
    const wrapped=function(...args){
      const result=fn.apply(this,args);
      requestAnimationFrame(syncHeader);
      return result;
    };
    wrapped.__olenHamburgerSync440=true;
    window[name]=wrapped;
  });
};

wrapSidebarApi();
setTimeout(()=>{wrapSidebarApi();syncHeader();},0);
setTimeout(()=>{wrapSidebarApi();syncHeader();},120);

console.info('[OLEN 4.4.0] chat fullscreen sidebar header fix active');
})();
