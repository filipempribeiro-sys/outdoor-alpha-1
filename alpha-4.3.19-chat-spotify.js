/* ALPHA 4.3.19 · CHAT SPOTIFY ON-DEMAND
   Mantém o comportamento 4.3.18 nas restantes vistas.
   No Chat, o Spotify Remote só aparece quando o utilizador o chama explicitamente
   pela navegação lateral do Chat.
*/
(()=>{
'use strict';
const VERSION='4.3.19';
const CHAT_REMOTE_KEY='alpha_chat_spotify_remote_explicit_v4319';
let wasChat=false;
const $=id=>document.getElementById(id);
const isChat=()=>document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');
function setExplicit(v){try{sessionStorage.setItem(CHAT_REMOTE_KEY,v?'1':'0')}catch{}}
function explicit(){try{return sessionStorage.getItem(CHAT_REMOTE_KEY)==='1'}catch{return false}}
function hideChatRemote(){
  if(!isChat()||explicit())return;
  try{window.alphaSpotifyRemoteWanted=false}catch{}
  const root=$('alphaSpotifyGlobal'),box=$('alphaSpotifyOverlay');
  if(box)box.hidden=true;
  if(root)root.hidden=true;
}
async function openSpotifyFromChat(){
  setExplicit(true);
  try{
    window.alphaSpotifyRemoteWanted=true;
    if(typeof window.alphaSpotifyRememberRemote==='function')window.alphaSpotifyRememberRemote(true);
    if(typeof window.alphaSpotifyFooterAction==='function')await window.alphaSpotifyFooterAction();
    else {
      const root=$('alphaSpotifyGlobal'),box=$('alphaSpotifyOverlay');
      if(root)root.hidden=false;if(box)box.hidden=false;
      if(typeof window.alphaSpotifyPollGlobal==='function')await window.alphaSpotifyPollGlobal(true);
    }
  }catch(e){
    console.warn('[ALPHA '+VERSION+'] Spotify Chat',e);
    setExplicit(false);
  }
}
window.alphaOpenSpotifyFromChat4319=openSpotifyFromChat;
function spotifyIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M7.5 9.2c3.4-1 7.2-.7 10.1.8M8.2 12.3c2.9-.8 6-.5 8.6.7M9 15.2c2.3-.6 4.8-.4 6.8.5"/></svg>'}
function ensureChatSpotifyNav(){
  const dock=document.querySelector('.alphaConversationSidebar .alphaSidebarDock');
  if(!dock||dock.querySelector('[data-alpha-chat-spotify="1"]'))return;
  const b=document.createElement('button');
  b.type='button';b.dataset.alphaChatSpotify='1';b.dataset.alphaIconified='1';
  b.setAttribute('aria-label','Spotify');b.title='Spotify';b.innerHTML=spotifyIcon();
  b.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();if(typeof window.alphaCloseChatMenu==='function')window.alphaCloseChatMenu();await openSpotifyFromChat()});
  const premium=[...dock.children].find(x=>/premium/i.test(String(x.getAttribute('aria-label')||x.title||'')));
  dock.insertBefore(b,premium||dock.lastElementChild||null);
  dock.style.gridTemplateColumns='repeat(5,1fr)';
}
function syncChatRemotePolicy(){
  const now=isChat();
  if(now&&!wasChat){setExplicit(false);hideChatRemote()}
  wasChat=now;
  if(now)hideChatRemote();
  ensureChatSpotifyNav();
}
document.addEventListener('click',e=>{
  if(e.target.closest?.('.alphaSpotifyClose')){setExplicit(false);setTimeout(hideChatRemote,0)}
},true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(syncChatRemotePolicy,80)});
window.addEventListener('pageshow',()=>setTimeout(syncChatRemotePolicy,80));
window.addEventListener('focus',()=>setTimeout(syncChatRemotePolicy,80));
const mo=new MutationObserver(()=>queueMicrotask(syncChatRemotePolicy));
mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','data-alpha-view']});
setExplicit(false);
setTimeout(syncChatRemotePolicy,120);
setInterval(syncChatRemotePolicy,900);

/* versão visível */
function version(){document.querySelector('meta[name="alpha-version"]')?.setAttribute('content',VERSION);const v=$('alphaTestVersion');if(v)v.textContent='v'+VERSION;const s=$('alphaCompassStatus');if(s&&/A iniciar a ALPHA/i.test(s.textContent||''))s.textContent='A iniciar a ALPHA '+VERSION+'…'}
setTimeout(version,100);setTimeout(version,700);
console.info('[ALPHA '+VERSION+'] CHAT SPOTIFY ON-DEMAND ativo');
})();
