/* ALPHA 4.3.42 · INTERNAL SIDEBAR + CHAT CAPSULE
   - Internal sidebar: OLSEN + no Spotify
   - Chat capsule: New chat left + vertical ellipsis right
   - Long-press action menu can never survive leaving Chat/sidebar
*/
(()=>{
'use strict';
if(window.__alphaInternalSidebarNoSpotify440)return;
window.__alphaInternalSidebarNoSpotify440=true;

function isChat(){return document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode')}
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
function closeOrphanLongPressMenu(){
  const menu=document.querySelector('.alphaChatConvActionMenu4330');
  const scrim=document.querySelector('.alphaChatConvActionScrim4330');
  if(!menu&&!scrim)return;
  const sidebarOpen=document.body.classList.contains('alphaChatOlenOpen4330');
  if(!isChat()||!sidebarOpen){menu?.remove();scrim?.remove()}
}
function apply(){applyInternal();applyChatCapsule();closeOrphanLongPressMenu()}

/* Run after the legacy Spotify reconciler on the same event/timer cycle. */
function afterLegacy(){setTimeout(apply,0);setTimeout(apply,70)}
apply();
window.addEventListener('pageshow',afterLegacy,{passive:true});
window.addEventListener('popstate',afterLegacy,{passive:true});
window.addEventListener('hashchange',afterLegacy,{passive:true});
document.addEventListener('click',afterLegacy,true);
document.addEventListener('touchend',afterLegacy,{passive:true,capture:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)afterLegacy()});
setTimeout(apply,140);setTimeout(apply,540);setTimeout(apply,1040);
/* Legacy Spotify itself reconciles every 1200 ms; this lightweight correction runs just after it. */
setInterval(apply,1250);

console.info('[ALPHA 4.3.42] Chat capsule locked: New chat + vertical ellipsis; orphan menus auto-close');
})();