/* ALPHA 4.3.20 · CHAT SPOTIFY TOGGLE
   Mantém o comportamento da 4.3.18 nas restantes vistas.
   No Chat:
   - o Spotify Remote NÃO abre automaticamente;
   - existe sempre um botão Spotify junto ao botão Nova conversa;
   - o mesmo Spotify continua disponível na sidebar;
   - tocar no botão Spotify liga/desliga o Remote;
   - o X do Remote deixa de ser mostrado.
*/
(()=>{
'use strict';
const VERSION='4.3.20';
const CHAT_REMOTE_KEY='alpha_chat_spotify_remote_explicit_v4320';
let wasChat=false;
const $=id=>document.getElementById(id);
const isChat=()=>document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');
function setExplicit(v){try{sessionStorage.setItem(CHAT_REMOTE_KEY,v?'1':'0')}catch{}}
function explicit(){try{return sessionStorage.getItem(CHAT_REMOTE_KEY)==='1'}catch{return false}}
function remoteVisible(){const root=$('alphaSpotifyGlobal'),box=$('alphaSpotifyOverlay');return !!root&&!!box&&!root.hidden&&!box.hidden}
function spotifyIcon(size=25){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:'+size+'px;height:'+size+'px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M7.5 9.2c3.4-1 7.2-.7 10.1.8M8.2 12.3c2.9-.8 6-.5 8.6.7M9 15.2c2.3-.6 4.8-.4 6.8.5"/></svg>'}
function hideChatRemote(){
  if(!isChat())return;
  try{window.alphaSpotifyRemoteWanted=false}catch{}
  try{if(typeof window.alphaSpotifyRememberRemote==='function')window.alphaSpotifyRememberRemote(false)}catch{}
  const root=$('alphaSpotifyGlobal'),box=$('alphaSpotifyOverlay');
  if(box)box.hidden=true;
  if(root)root.hidden=true;
  setExplicit(false);
  syncToggleState();
}
async function showChatRemote(){
  if(!isChat())return;
  setExplicit(true);
  try{
    window.alphaSpotifyRemoteWanted=true;
    if(typeof window.alphaSpotifyRememberRemote==='function')window.alphaSpotifyRememberRemote(true);
    const root=$('alphaSpotifyGlobal'),box=$('alphaSpotifyOverlay');
    if(root)root.hidden=false;if(box)box.hidden=false;
    if(typeof window.alphaSpotifyPollGlobal==='function')await window.alphaSpotifyPollGlobal(true);
    syncToggleState();
  }catch(e){
    console.warn('[ALPHA '+VERSION+'] Spotify Chat',e);
    hideChatRemote();
  }
}
async function toggleChatSpotify(){
  if(remoteVisible()&&explicit())hideChatRemote();
  else await showChatRemote();
}
window.alphaToggleChatSpotify4320=toggleChatSpotify;
window.alphaOpenSpotifyFromChat4319=showChatRemote;

function ensureStyle(){
  if($('alphaChatSpotifyStyle4320'))return;
  const st=document.createElement('style');st.id='alphaChatSpotifyStyle4320';st.textContent=`
    body.alphaChatMode .alphaSpotifyClose,body.alphaComposeMode .alphaSpotifyClose{display:none!important}
    .alphaChatSpotifyTop4320{width:58px!important;height:58px!important;min-width:58px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.13)!important;background:rgba(29,31,33,.92)!important;color:#fff!important;display:grid!important;place-items:center!important;padding:0!important;box-shadow:0 8px 24px rgba(0,0,0,.22)!important}
    .alphaChatSpotifyTop4320.active{border-color:rgba(85,230,174,.6)!important;background:rgba(18,60,48,.94)!important;color:#66e8b8!important}
    body.alphaChatMode .aiTopbar.alphaFloatingHeader,body.alphaComposeMode .aiTopbar.alphaFloatingHeader{display:flex!important;align-items:center!important}
    body.alphaChatMode .alphaChatSpotifyTop4320,body.alphaComposeMode .alphaChatSpotifyTop4320{margin-left:auto!important;margin-right:10px!important}
    body.alphaChatMode .alphaNewChatBtn,body.alphaComposeMode .alphaNewChatBtn{margin-left:0!important}
    @media(max-width:390px){.alphaChatSpotifyTop4320{width:54px!important;height:54px!important;min-width:54px!important;margin-right:8px!important}}
  `;document.head.append(st);
}
function ensureTopSpotifyButton(){
  const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');
  const newBtn=bar?.querySelector('.alphaNewChatBtn');
  if(!bar||!newBtn)return;
  let b=bar.querySelector('.alphaChatSpotifyTop4320');
  if(!b){
    b=document.createElement('button');
    b.type='button';b.className='alphaChatSpotifyTop4320';b.setAttribute('aria-label','Spotify Remote');b.title='Spotify';b.innerHTML=spotifyIcon(27);
    b.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();await toggleChatSpotify()});
    bar.insertBefore(b,newBtn);
  }
  b.hidden=!isChat();
}
function ensureChatSpotifyNav(){
  const dock=document.querySelector('.alphaConversationSidebar .alphaSidebarDock');
  if(!dock)return;
  let b=dock.querySelector('[data-alpha-chat-spotify="1"]');
  if(!b){
    b=document.createElement('button');b.type='button';b.dataset.alphaChatSpotify='1';b.dataset.alphaIconified='1';b.setAttribute('aria-label','Spotify');b.title='Spotify';b.innerHTML=spotifyIcon(26);
    b.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();if(typeof window.alphaCloseChatMenu==='function')window.alphaCloseChatMenu();await toggleChatSpotify()});
    const premium=[...dock.children].find(x=>/premium/i.test(String(x.getAttribute('aria-label')||x.title||'')));
    dock.insertBefore(b,premium||dock.lastElementChild||null);
  }
  dock.style.gridTemplateColumns='repeat(5,1fr)';
}
function syncToggleState(){
  const on=isChat()&&explicit()&&remoteVisible();
  document.querySelectorAll('.alphaChatSpotifyTop4320,[data-alpha-chat-spotify="1"]').forEach(b=>{b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')});
}
function syncChatRemotePolicy(){
  ensureStyle();ensureTopSpotifyButton();ensureChatSpotifyNav();
  const now=isChat();
  if(now&&!wasChat){setExplicit(false);hideChatRemote()}
  wasChat=now;
  if(now&&!explicit()&&remoteVisible())hideChatRemote();
  syncToggleState();
}

document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(syncChatRemotePolicy,80)});
window.addEventListener('pageshow',()=>setTimeout(syncChatRemotePolicy,80));
window.addEventListener('focus',()=>setTimeout(syncChatRemotePolicy,80));
const mo=new MutationObserver(()=>queueMicrotask(syncChatRemotePolicy));
mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','data-alpha-view']});
setExplicit(false);
setTimeout(syncChatRemotePolicy,120);
setInterval(syncChatRemotePolicy,900);

function version(){document.querySelector('meta[name="alpha-version"]')?.setAttribute('content',VERSION);const v=$('alphaTestVersion');if(v)v.textContent='v'+VERSION;const s=$('alphaCompassStatus');if(s&&/A iniciar a ALPHA/i.test(s.textContent||''))s.textContent='A iniciar a ALPHA '+VERSION+'…'}
setTimeout(version,100);setTimeout(version,700);
console.info('[ALPHA '+VERSION+'] CHAT SPOTIFY TOGGLE ativo');
})();
