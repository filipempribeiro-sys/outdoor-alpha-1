/* OLEN 4.5.0 · CLEAN CHAT FULLSCREEN CORE
   Scope: Chat/Compose fullscreen only.
   This module owns only the fullscreen presentation layer.
   It does not change chat data, AI, Remote, Home, Map, navigation or backend logic.
*/
(()=>{
'use strict';
if(window.__olenChatFullscreen450)return;
window.__olenChatFullscreen450=true;

const CHAT_MODE=()=>document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');
const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>[...r.querySelectorAll(s)];

const ICON_COMPOSE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 3.5H4.75A2.75 2.75 0 0 0 2 6.25v13A2.75 2.75 0 0 0 4.75 22h13A2.75 2.75 0 0 0 20.5 19.25V18"/><path d="M8 16l1.2-4.4 8.45-8.45a2.15 2.15 0 0 1 3.05 3.05l-8.45 8.45L8 16Z"/><path d="m15.9 4.9 3.2 3.2"/></svg>';
const ICON_DOTS='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>';

function ensureStyle(){
  if(qs('#olenChatFullscreen450Style'))return;
  const style=document.createElement('style');
  style.id='olenChatFullscreen450Style';
  style.textContent=`
body.olenChatFs450.alphaChatMode #lifestyleAI,
body.olenChatFs450.alphaComposeMode #lifestyleAI{position:relative!important}

body.olenChatFs450.alphaChatMode #lifestyleAI .aiTopbar.alphaFloatingHeader,
body.olenChatFs450.alphaComposeMode #lifestyleAI .aiTopbar.alphaFloatingHeader{
  position:absolute!important;
  top:calc(env(safe-area-inset-top) + 10px)!important;
  left:12px!important;right:12px!important;
  height:52px!important;min-height:52px!important;
  display:flex!important;align-items:center!important;justify-content:space-between!important;
  z-index:100!important;background:transparent!important;border:0!important;
  padding:0!important;margin:0!important;pointer-events:none!important
}

body.olenChatFs450.alphaChatMode #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu,
body.olenChatFs450.alphaComposeMode #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu{
  display:grid!important;visibility:visible!important;opacity:1!important;
  pointer-events:auto!important;place-items:center!important
}

body.olenChatFs450.alphaChatMode #lifestyleAI .alphaChatActions4324,
body.olenChatFs450.alphaComposeMode #lifestyleAI .alphaChatActions4324,
body.olenChatFs450.alphaChatMode #lifestyleAI .olenChatCapsule440,
body.olenChatFs450.alphaComposeMode #lifestyleAI .olenChatCapsule440{
  display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important
}

body.olenChatFs450.alphaChatMode #lifestyleAI .olenChatCapsule450,
body.olenChatFs450.alphaComposeMode #lifestyleAI .olenChatCapsule450{
  width:126px!important;height:48px!important;min-width:126px!important;min-height:48px!important;
  margin-left:auto!important;padding:0!important;display:flex!important;align-items:center!important;
  justify-content:center!important;gap:0!important;overflow:hidden!important;
  border-radius:999px!important;background:#222325!important;
  border:1px solid rgba(255,255,255,.14)!important;box-shadow:none!important;
  pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:101!important
}

body.olenChatFs450.alphaChatMode #lifestyleAI .olenChatCapsule450>button,
body.olenChatFs450.alphaComposeMode #lifestyleAI .olenChatCapsule450>button{
  appearance:none!important;-webkit-appearance:none!important;
  width:62px!important;height:46px!important;min-width:62px!important;min-height:46px!important;
  flex:0 0 62px!important;margin:0!important;padding:0!important;
  display:grid!important;place-items:center!important;
  border:0!important;border-radius:0!important;background:transparent!important;color:#fff!important;
  box-shadow:none!important;outline:0!important;cursor:pointer!important;
  pointer-events:auto!important;touch-action:manipulation!important
}
body.olenChatFs450.alphaChatMode #lifestyleAI .olenChatCapsule450>button:active,
body.olenChatFs450.alphaComposeMode #lifestyleAI .olenChatCapsule450>button:active{background:rgba(255,255,255,.06)!important}
body.olenChatFs450 #lifestyleAI .olenChatCapsule450 svg{width:27px!important;height:27px!important;display:block!important;pointer-events:none!important}
body.olenChatFs450 #lifestyleAI .olenChatCompose450 svg{fill:none!important;stroke:currentColor!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important}
body.olenChatFs450 #lifestyleAI .olenChatMore450 svg{fill:currentColor!important;stroke:none!important}

body.olenChatFs450.olenSidebarOpen450 #lifestyleAI .olenChatCapsule450,
body.olenChatFs450.olenSidebarOpen450 #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu{
  visibility:hidden!important;opacity:0!important;pointer-events:none!important
}

.alphaChatConvActionScrim4330{position:fixed!important;inset:0!important;z-index:2147483000!important;pointer-events:auto!important}
.alphaChatConvActionMenu4330{position:fixed!important;z-index:2147483001!important;pointer-events:auto!important}

.olenChatMoreScrim450{position:fixed;inset:0;z-index:2147483010;background:transparent;pointer-events:auto}
.olenChatMoreMenu450{
  position:fixed;z-index:2147483011;width:min(260px,calc(100vw - 28px));
  padding:8px;border-radius:20px;background:rgba(31,31,33,.985);color:#f7f7f7;
  border:1px solid rgba(255,255,255,.13);box-shadow:0 18px 50px rgba(0,0,0,.45);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);pointer-events:auto
}
.olenChatMoreTitle450{min-height:44px;display:flex;align-items:center;padding:0 14px;font:700 15px/1.2 system-ui,-apple-system,sans-serif;color:#dce7e3}
`;
  document.head.appendChild(style);
}

function sidebar(){return qs('#aiChatMenu')||qs('.alphaConversationSidebar')||qs('.alphaChatOlenSidebar4330')}
function sidebarOpen(){
  if(!CHAT_MODE())return false;
  const s=sidebar();
  return document.body.classList.contains('alphaChatOlenOpen4330')||!!(s&&(s.classList.contains('show')||s.getAttribute('aria-hidden')==='false'));
}

function closeMore(){
  qs('.olenChatMoreMenu450')?.remove();
  qs('.olenChatMoreScrim450')?.remove();
}

function openMore(anchor){
  closeMore();
  const scrim=document.createElement('div');
  scrim.className='olenChatMoreScrim450';
  scrim.addEventListener('click',closeMore,{once:true});
  document.body.appendChild(scrim);

  const menu=document.createElement('div');
  menu.className='olenChatMoreMenu450';
  menu.setAttribute('role','menu');
  menu.innerHTML='<div class="olenChatMoreTitle450">Mais opções</div>';
  document.body.appendChild(menu);

  const r=anchor.getBoundingClientRect();
  const m=menu.getBoundingClientRect();
  const left=Math.max(14,Math.min(r.right-m.width,innerWidth-m.width-14));
  const below=r.bottom+10;
  const top=below+m.height<=innerHeight-14?below:Math.max(14,r.top-m.height-10);
  menu.style.left=left+'px';
  menu.style.top=top+'px';
}

function startFreshConversation(){
  closeMore();
  if(typeof window.alphaStartFreshConversation==='function'){
    window.alphaStartFreshConversation({focus:true,compose:true});
    return true;
  }
  const native=qs('#lifestyleAI .alphaNewChatBtn');
  if(native){native.click();return true}
  return false;
}

function ensureCapsule(){
  const bar=qs('#lifestyleAI .aiTopbar.alphaFloatingHeader');
  if(!bar)return null;

  let cap=qs('.olenChatCapsule450',bar);
  if(cap)return cap;

  cap=document.createElement('div');
  cap.className='olenChatCapsule450';
  cap.setAttribute('aria-label','Ações da conversa');

  const compose=document.createElement('button');
  compose.type='button';
  compose.className='olenChatCompose450';
  compose.setAttribute('aria-label','Nova conversa');
  compose.title='Nova conversa';
  compose.innerHTML=ICON_COMPOSE;

  const more=document.createElement('button');
  more.type='button';
  more.className='olenChatMore450';
  more.setAttribute('aria-label','Mais opções');
  more.title='Mais opções';
  more.innerHTML=ICON_DOTS;

  compose.onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    startFreshConversation();
  };
  more.onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    if(qs('.olenChatMoreMenu450'))closeMore();
    else openMore(more);
  };

  cap.append(compose,more);
  bar.appendChild(cap);
  return cap;
}

function ensureSidebarLogo(){
  const brand=qs('.alphaChatOlenSidebar4330 .alphaChatOlenBrand4330');
  if(!brand)return;
  let img=qs('.olenChatSidebarUiLogo450',brand);
  if(img)return;
  img=document.createElement('img');
  img.className='olenChatSidebarUiLogo450';
  img.src='assets/olen-ui.png';
  img.alt='OLEN';
  img.width=60;img.height=60;
  brand.replaceChildren(img);
}

function sync(){
  const chat=CHAT_MODE();
  document.body.classList.toggle('olenChatFs450',chat);
  if(!chat){
    document.body.classList.remove('olenSidebarOpen450');
    closeMore();
    qs('.olenChatCapsule450')?.remove();
    return;
  }

  ensureCapsule();
  ensureSidebarLogo();
  const open=sidebarOpen();
  document.body.classList.toggle('olenSidebarOpen450',open);
  if(open)closeMore();
}

function scheduleSync(){requestAnimationFrame(sync)}

ensureStyle();
sync();

const bodyObserver=new MutationObserver(scheduleSync);
bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});

let observedSidebar=null;
function bindSidebarObserver(){
  const s=sidebar();
  if(!s||s===observedSidebar)return;
  observedSidebar=s;
  const o=new MutationObserver(scheduleSync);
  o.observe(s,{attributes:true,attributeFilter:['class','aria-hidden','hidden']});
}
bindSidebarObserver();

const topbarObserver=new MutationObserver(()=>{if(CHAT_MODE()){bindSidebarObserver();ensureCapsule();scheduleSync()}});
const lifestyle=qs('#lifestyleAI');
if(lifestyle)topbarObserver.observe(lifestyle,{childList:true,subtree:true});

window.addEventListener('pageshow',scheduleSync,{passive:true});
window.addEventListener('popstate',()=>{closeMore();scheduleSync()},{passive:true});
window.addEventListener('pagehide',closeMore,{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMore()});

console.info('[OLEN 4.5.0] clean Chat fullscreen core active');
})();