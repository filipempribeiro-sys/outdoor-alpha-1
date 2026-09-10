/* ALPHA 4.3.23 · GLOBAL TOP CONTROLS + SWIPE NAV
   Base: 4.3.18 stable + 4.3.22 Spotify logic
   - Home: Spotify apenas no footer; Novo chat volta ao topo direito
   - Chat: cápsula única Spotify + Novo chat
   - Restantes vistas: Spotify global alinhado verticalmente com o botão Menu
   - Swipe horizontal entre vistas principais, sem interferir com mapas, carrosséis ou inputs
   - Remote só abre/fecha por ação explícita do utilizador
*/
(()=>{
'use strict';
const VERSION='4.3.23';
const REMOTE_KEY='alpha_spotify_remote_explicit_v4323';
const $=id=>document.getElementById(id);
const isChat=()=>document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode');
const isHome=()=>!isChat()&&String(window.alphaShellView||'home')==='home';
function setWanted(v){try{sessionStorage.setItem(REMOTE_KEY,v?'1':'0')}catch{};try{window.alphaSpotifyRemoteWanted=!!v}catch{};try{if(typeof window.alphaSpotifyRememberRemote==='function')window.alphaSpotifyRememberRemote(!!v)}catch{}}
function wanted(){try{return sessionStorage.getItem(REMOTE_KEY)==='1'}catch{return false}}
function remoteEls(){return {root:$('alphaSpotifyGlobal'),box:$('alphaSpotifyOverlay')}}
function remoteVisible(){const {root,box}=remoteEls();return !!root&&!root.hidden&&(!box||!box.hidden)}
async function setRemote(open){
  const {root,box}=remoteEls();setWanted(open);
  if(root)root.hidden=!open;if(box)box.hidden=!open;
  if(open){try{if(typeof window.alphaSpotifyPollGlobal==='function')await window.alphaSpotifyPollGlobal(true)}catch(e){console.warn('[ALPHA '+VERSION+'] poll',e)}try{if(typeof window.alphaSpotifyRefreshGlobal==='function')await window.alphaSpotifyRefreshGlobal(true)}catch{}}
  syncButtons();
}
async function toggleRemote(){await setRemote(!(wanted()&&remoteVisible()))}
window.alphaSpotifyToggleGlobal4323=toggleRemote;
window.alphaSpotifyToggleGlobal4322=toggleRemote;
function icon(size=27){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:'+size+'px;height:'+size+'px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M7.5 9.2c3.4-1 7.2-.7 10.1.8M8.2 12.3c2.9-.8 6-.5 8.6.7M9 15.2c2.3-.6 4.8-.4 6.8.5"/></svg>'}
function styles(){if($('alphaSpotify4323Style'))return;const s=document.createElement('style');s.id='alphaSpotify4323Style';s.textContent=`
.alphaChatActions4323{margin-left:auto;display:flex;align-items:center;border:1px solid rgba(255,255,255,.13);background:rgba(29,31,33,.92);border-radius:999px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.22)}
.alphaChatActions4323 button{width:58px!important;height:58px!important;min-width:58px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#fff!important;display:grid!important;place-items:center!important;padding:0!important;margin:0!important;box-shadow:none!important}
.alphaChatActions4323 button+button{border-left:1px solid rgba(255,255,255,.13)!important}
.alphaSpotifyToggle4323.active{color:#66e8b8!important;background:rgba(18,60,48,.94)!important}
.alphaGlobalSpotify4323{position:fixed;z-index:78;width:58px;height:58px;border-radius:50%;border:1px solid rgba(255,255,255,.13);background:rgba(29,31,33,.92);color:#fff;display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.22)}
.alphaGlobalSpotify4323.active{color:#66e8b8;border-color:rgba(85,230,174,.6);background:rgba(18,60,48,.94)}
body.alphaChatMode .alphaGlobalSpotify4323,body.alphaComposeMode .alphaGlobalSpotify4323{display:none!important}
body.alphaChatMode .alphaSpotifyClose,body.alphaComposeMode .alphaSpotifyClose{display:none!important}
@media(max-width:390px){.alphaChatActions4323 button,.alphaGlobalSpotify4323{width:54px!important;height:54px!important;min-width:54px!important}}
`;document.head.append(s)}
function mkSpotifyButton(cls){const b=document.createElement('button');b.type='button';b.className=cls+' alphaSpotifyToggle4323';b.setAttribute('aria-label','Spotify Remote');b.title='Spotify';b.innerHTML=icon();b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleRemote()});return b}
function restoreNewChatToBar(){const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');if(!bar)return;const cap=bar.querySelector('.alphaChatActions4323,.alphaChatActions4322');const newBtn=cap?.querySelector('.alphaNewChatBtn')||bar.querySelector('.alphaNewChatBtn');if(newBtn&&newBtn.parentElement!==bar)bar.append(newBtn);cap?.remove()}
function ensureChatCapsule(){
  const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');if(!bar)return;
  let newBtn=bar.querySelector('.alphaNewChatBtn')||bar.querySelector('.alphaChatActions4322 .alphaNewChatBtn');if(!newBtn)return;
  bar.querySelector('.alphaChatSpotifyTop4320')?.remove();bar.querySelector('.alphaChatActions4322')?.remove();
  if(!isChat()){restoreNewChatToBar();return}
  let cap=bar.querySelector('.alphaChatActions4323');
  if(!cap){cap=document.createElement('div');cap.className='alphaChatActions4323';cap.append(mkSpotifyButton('alphaChatSpotify4323'));bar.append(cap)}
  if(newBtn.parentElement!==cap)cap.append(newBtn);
}
function alignGlobalWithMenu(b){const menu=document.querySelector('#lifestyleAI .alphaFloatingMenu,.alphaFloatingMenu');if(!b||!menu||!menu.getBoundingClientRect)return;const r=menu.getBoundingClientRect();if(r.width<20||r.height<20)return;const right=Math.max(12,window.innerWidth-r.right);b.style.top=Math.round(r.top)+'px';b.style.right=Math.round(right)+'px';b.style.width=Math.round(r.width)+'px';b.style.height=Math.round(r.height)+'px'}
function ensureGlobalButton(){let b=$('alphaGlobalSpotify4323');if(!b){document.getElementById('alphaGlobalSpotify4322')?.remove();b=mkSpotifyButton('alphaGlobalSpotify4323');b.id='alphaGlobalSpotify4323';document.body.append(b)}const show=!isChat()&&!isHome();b.hidden=!show;if(show)alignGlobalWithMenu(b)}
function syncButtons(){const on=wanted()&&remoteVisible();document.querySelectorAll('.alphaSpotifyToggle4323').forEach(b=>{b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')})}
function interceptLegacySpotify(){document.addEventListener('click',e=>{const b=e.target.closest?.('#spotifyNav,[data-alpha-chat-spotify="1"],button[aria-label="Spotify"],button[aria-label="Spotify Remote"]');if(!b||b.classList.contains('alphaSpotifyToggle4323'))return;e.preventDefault();e.stopImmediatePropagation();toggleRemote()},true)}
function reconcile(){styles();ensureChatCapsule();ensureGlobalButton();syncButtons();const {root,box}=remoteEls();if(!wanted()){if(root&&!root.hidden)root.hidden=true;if(box&&!box.hidden)box.hidden=true}}

/* Swipe entre vistas principais.
   Left = próxima vista; Right = vista anterior.
   Ignora zonas onde o gesto horizontal já tem função própria. */
let sx=0,sy=0,st=0,swipeBlocked=false;
function horizontalScrollable(el){for(let n=el;n&&n!==document.body;n=n.parentElement){const cs=getComputedStyle(n);if((/auto|scroll/.test(cs.overflowX)||n.scrollWidth>n.clientWidth+8)&&n.scrollWidth>n.clientWidth+8)return true}return false}
function blockSwipeTarget(t){return !!t.closest?.('input,textarea,select,[contenteditable="true"],#realMap,.maplibregl-canvas,.photoStrip,.alphaPlacesRail,.alphaSpotifyGlobal,.alphaSpotifyOverlay,.alphaChatActions4323,.alphaConversationSidebar')||horizontalScrollable(t)}
function navigableTabs(){return [...document.querySelectorAll('.bottom .nav[data-id]')].filter(b=>{if(b.hidden||getComputedStyle(b).display==='none')return false;return !!b.dataset.id})}
function swipeNavigate(dir){if(isChat())return;const tabs=navigableTabs();if(tabs.length<2)return;let i=tabs.findIndex(b=>b.classList.contains('active'));if(i<0)i=tabs.findIndex(b=>String(b.dataset.id)===String(window.alphaShellView||''));if(i<0)i=0;const ni=i+dir;if(ni<0||ni>=tabs.length)return;tabs[ni].click()}
document.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.target;swipeBlocked=blockSwipeTarget(t);sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now()},{passive:true});
document.addEventListener('touchend',e=>{if(swipeBlocked||!e.changedTouches?.length)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy,dt=Date.now()-st;if(dt>700||Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.35)return;swipeNavigate(dx<0?1:-1)},{passive:true});

interceptLegacySpotify();
window.addEventListener('pageshow',()=>setTimeout(reconcile,80));window.addEventListener('focus',()=>setTimeout(reconcile,80));window.addEventListener('resize',()=>setTimeout(reconcile,80),{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(reconcile,80)});
setTimeout(reconcile,120);setTimeout(reconcile,800);setInterval(reconcile,1800);
function version(){document.querySelector('meta[name="alpha-version"]')?.setAttribute('content',VERSION);const v=$('alphaTestVersion');if(v)v.textContent='v'+VERSION;const s=$('alphaCompassStatus');if(s&&/A iniciar a ALPHA/i.test(s.textContent||''))s.textContent='A iniciar a ALPHA '+VERSION+'…'}
setTimeout(version,100);setTimeout(version,700);console.info('[ALPHA '+VERSION+'] GLOBAL CONTROLS + SWIPE ativo');
})();
