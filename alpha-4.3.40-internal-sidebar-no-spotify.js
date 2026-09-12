/* ALPHA 4.3.42 · INTERNAL SIDEBAR + CHAT CAPSULE + LONG PRESS POLISH
   - Internal sidebar: OLSEN + no Spotify
   - Chat capsule: New chat left + vertical ellipsis right
   - Long-press action menu styled to ALPHA/OLEN
   - Long-press menu always closes when context changes
*/
(()=>{
'use strict';
if(window.__alphaInternalSidebarNoSpotify440)return;
window.__alphaInternalSidebarNoSpotify440=true;

function isChat(){return document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode')}
function sidebarOpen(){return document.body.classList.contains('alphaChatOlenOpen4330')}
function applyInternal(){
  const sidebar=document.getElementById('alphaInternalSidebar');
  if(!sidebar)return;
  const brand=sidebar.querySelector('.alphaInternalBrand b');
  if(brand&&brand.textContent.trim()!=='OLSEN')brand.textContent='OLSEN';
  sidebar.querySelectorAll('.alphaInternalNavList button').forEach(btn=>{
    const text=String(btn.textContent||'').trim().toLocaleLowerCase('pt-PT');
    const action=String(btn.getAttribute('onclick')||'').toLocaleLowerCase('pt-PT');
    if(text==='spotify'||action.includes('alphaspotifyfooteraction'))btn.remove();
  });
}
function dotsIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:27px;height:27px;fill:currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>'}
function applyChatCapsule(){
  if(!isChat())return;
  const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');
  if(!bar)return;
  let cap=bar.querySelector('.alphaChatActions4324');
  const newChat=cap?.querySelector('.alphaNewChatBtn')||bar.querySelector('.alphaNewChatBtn');
  if(!newChat)return;
  if(!cap){cap=document.createElement('div');cap.className='alphaChatActions4324';bar.appendChild(cap)}
  let dots=cap.querySelector('.alphaChatMore442');
  if(!dots){
    dots=document.createElement('button');dots.type='button';dots.className='alphaChatMore442';
    dots.setAttribute('aria-label','Mais opções');dots.title='Mais opções';dots.innerHTML=dotsIcon();
  }
  cap.querySelectorAll('.alphaChatSpotify4324,.alphaSpotifyToggle4324,[aria-label="Spotify Remote"],[title="Spotify"]').forEach(el=>el.remove());
  cap.replaceChildren(newChat,dots);
}

function ensureLongPressStyle(){
  if(document.getElementById('alphaLongPressPolish442'))return;
  const style=document.createElement('style');
  style.id='alphaLongPressPolish442';
  style.textContent=`
    .alphaChatConvActionScrim4330{
      position:fixed!important;inset:0!important;z-index:9800!important;
      background:rgba(2,10,13,.46)!important;
      backdrop-filter:blur(3px)!important;
      -webkit-backdrop-filter:blur(3px)!important;
    }
    .alphaChatConvActionMenu4330{
      position:fixed!important;z-index:9801!important;
      min-width:230px!important;max-width:calc(100vw - 28px)!important;
      padding:8px!important;
      background:linear-gradient(180deg,rgba(12,29,34,.985),rgba(8,22,27,.99))!important;
      border:1px solid rgba(108,214,177,.20)!important;
      border-radius:20px!important;
      box-shadow:0 20px 54px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.025)!important;
      backdrop-filter:blur(20px)!important;
      -webkit-backdrop-filter:blur(20px)!important;
      overflow:hidden!important;
    }
    .alphaChatConvActionMenu4330 button{
      width:100%!important;height:52px!important;
      border:0!important;background:transparent!important;
      color:#eaf4f1!important;
      display:flex!important;align-items:center!important;gap:14px!important;
      padding:0 15px!important;border-radius:13px!important;
      text-align:left!important;font:700 15px/1.2 system-ui,-apple-system,sans-serif!important;
      letter-spacing:.01em!important;
    }
    .alphaChatConvActionMenu4330 button+button{margin-top:2px!important}
    .alphaChatConvActionMenu4330 button:active{
      background:rgba(65,167,132,.13)!important;
    }
    .alphaChatConvActionMenu4330 svg{
      width:23px!important;height:23px!important;flex:0 0 23px!important;
      fill:none!important;stroke:#d9ebe5!important;stroke-width:1.8!important;
      stroke-linecap:round!important;stroke-linejoin:round!important;
    }
    .alphaChatConvActionMenu4330 .danger{
      color:#ff7f88!important;
      margin-top:5px!important;
      border-top:1px solid rgba(255,255,255,.055)!important;
      border-radius:0 0 13px 13px!important;
      padding-top:3px!important;
    }
    .alphaChatConvActionMenu4330 .danger svg{stroke:#ff7f88!important}
  `;
  document.head.appendChild(style);
}

function closeLongPressMenu(){
  document.querySelector('.alphaChatConvActionMenu4330')?.remove();
  document.querySelector('.alphaChatConvActionScrim4330')?.remove();
}
function closeOrphanLongPressMenu(){
  if(!isChat()||!sidebarOpen())closeLongPressMenu();
}
function apply(){applyInternal();applyChatCapsule();ensureLongPressStyle();closeOrphanLongPressMenu()}

/* Run after the legacy Spotify reconciler on the same event/timer cycle. */
function afterLegacy(){setTimeout(apply,0);setTimeout(apply,70)}
apply();
window.addEventListener('pageshow',afterLegacy,{passive:true});
window.addEventListener('popstate',()=>{closeLongPressMenu();afterLegacy()},{passive:true});
window.addEventListener('hashchange',()=>{closeLongPressMenu();afterLegacy()},{passive:true});
window.addEventListener('pagehide',closeLongPressMenu,{passive:true});
window.addEventListener('blur',closeLongPressMenu,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)closeLongPressMenu();else afterLegacy()});

/* Any normal interaction outside the action menu dismisses it immediately. */
document.addEventListener('pointerdown',e=>{
  const menu=document.querySelector('.alphaChatConvActionMenu4330');
  if(menu&&!e.target.closest('.alphaChatConvActionMenu4330'))closeLongPressMenu();
},true);
/* After gestures/swipes, validate that Chat/sidebar still owns the menu. */
document.addEventListener('touchend',()=>requestAnimationFrame(closeOrphanLongPressMenu),{passive:true,capture:true});
document.addEventListener('click',afterLegacy,true);

/* If another function closes the Chat sidebar, make menu closure part of that action too. */
['alphaCloseChatOlenSidebar','alphaCloseChatMenu','alphaCloseInternalSidebar'].forEach(name=>{
  const fn=window[name];
  if(typeof fn==='function'&&!fn.__alphaLongPressWrapped442){
    const wrapped=function(...args){closeLongPressMenu();return fn.apply(this,args)};
    wrapped.__alphaLongPressWrapped442=true;
    try{window[name]=wrapped}catch{}
  }
});

setTimeout(apply,140);setTimeout(apply,540);setTimeout(apply,1040);
/* Legacy Spotify reconciles every 1200 ms; correction follows it without observers. */
setInterval(apply,1250);

console.info('[ALPHA 4.3.42] Chat capsule locked + OLEN long-press menu polished and context-safe');
})();