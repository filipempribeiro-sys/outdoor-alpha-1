/* ALPHA 4.3.27 · GLOBAL CONTROLS + CALENDAR + NATURAL SWIPE
   Base: 4.3.18 stable + Spotify global
   - Home: Spotify apenas no footer; Novo chat no topo direito
   - Chat: cápsula única Spotify + Novo chat
   - Vistas 3–7: Spotify sempre visível no topo direito e alinhado visualmente com Menu
   - Calendário incorporado no footer
   - Swipe LEFT = avançar; Swipe RIGHT = voltar
   - Ordem de navegação por swipe: Home → Mapa/GO → Calendário → LIVE → Premium → Perfil
   - Spotify é controlo global e não entra na sequência de páginas por swipe
*/
(()=>{
'use strict';
const VERSION='4.3.27';
const REMOTE_KEY='alpha_spotify_remote_explicit_v4324';
const $=id=>document.getElementById(id);
const isChat=()=>document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode');
function currentView(){
  const active=[...document.querySelectorAll('.view.active,.view.show,.view[aria-hidden="false"]')].find(el=>{
    const r=el.getBoundingClientRect?.();
    return el.id&&r&&r.width>0&&r.height>0&&getComputedStyle(el).display!=='none';
  });
  if(active?.id)return String(active.id);
  const bodyView=String(document.body?.dataset?.alphaView||'');
  if(bodyView&&bodyView!=='home')return bodyView;
  return String(window.alphaShellView||bodyView||'home');
}
const isHome=()=>!isChat()&&['home','lifestyleAI'].includes(currentView());
function setWanted(v){try{sessionStorage.setItem(REMOTE_KEY,v?'1':'0')}catch{};try{window.alphaSpotifyRemoteWanted=!!v}catch{};try{if(typeof window.alphaSpotifyRememberRemote==='function')window.alphaSpotifyRememberRemote(!!v)}catch{}}
function wanted(){try{return sessionStorage.getItem(REMOTE_KEY)==='1'}catch{return false}}
function remoteEls(){return {root:$('alphaSpotifyGlobal'),box:$('alphaSpotifyOverlay')}}
function remoteVisible(){const {root,box}=remoteEls();return !!root&&!root.hidden&&(!box||!box.hidden)}
async function setRemote(open){const {root,box}=remoteEls();setWanted(open);if(root)root.hidden=!open;if(box)box.hidden=!open;if(open){try{if(typeof window.alphaSpotifyPollGlobal==='function')await window.alphaSpotifyPollGlobal(true)}catch(e){console.warn('[ALPHA '+VERSION+'] poll',e)}try{if(typeof window.alphaSpotifyRefreshGlobal==='function')await window.alphaSpotifyRefreshGlobal(true)}catch{}}syncButtons()}
async function toggleRemote(){await setRemote(!(wanted()&&remoteVisible()))}
window.alphaSpotifyToggleGlobal4327=toggleRemote;window.alphaSpotifyToggleGlobal4326=toggleRemote;window.alphaSpotifyToggleGlobal4325=toggleRemote;window.alphaSpotifyToggleGlobal4324=toggleRemote;window.alphaSpotifyToggleGlobal4323=toggleRemote;window.alphaSpotifyToggleGlobal4322=toggleRemote;
function spotifyIcon(size=27){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:'+size+'px;height:'+size+'px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M7.5 9.2c3.4-1 7.2-.7 10.1.8M8.2 12.3c2.9-.8 6-.5 8.6.7M9 15.2c2.3-.6 4.8-.4 6.8.5"/></svg>'}
function calendarIcon(){return '<span class="alphaNavIcon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg></span><span>Calendário</span>'}
function styles(){if($('alphaSpotify4324Style'))return;const s=document.createElement('style');s.id='alphaSpotify4324Style';s.textContent=`
.alphaChatActions4324{margin-left:auto;display:flex;align-items:center;border:1px solid rgba(255,255,255,.13);background:rgba(29,31,33,.92);border-radius:999px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.22)}
.alphaChatActions4324 button{width:58px!important;height:58px!important;min-width:58px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#fff!important;display:grid!important;place-items:center!important;padding:0!important;margin:0!important;box-shadow:none!important}
.alphaChatActions4324 button+button{border-left:1px solid rgba(255,255,255,.13)!important}
.alphaSpotifyToggle4324.active{color:#66e8b8!important;background:rgba(18,60,48,.94)!important}
.alphaGlobalSpotify4324{position:fixed;z-index:78;width:58px;height:58px;border-radius:50%;border:1px solid rgba(255,255,255,.13);background:rgba(29,31,33,.92);color:#fff;display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.22)}
.alphaGlobalSpotify4324.active{color:#66e8b8;border-color:rgba(85,230,174,.6);background:rgba(18,60,48,.94)}
body.alphaChatMode .alphaGlobalSpotify4324,body.alphaComposeMode .alphaGlobalSpotify4324{display:none!important}
body.alphaChatMode .alphaSpotifyClose,body.alphaComposeMode .alphaSpotifyClose{display:none!important}
.bottom{--nav-count:7!important}
@media(max-width:390px){.alphaChatActions4324 button,.alphaGlobalSpotify4324{width:54px!important;height:54px!important;min-width:54px!important}.bottom .nav{font-size:10px!important}}
`;document.head.append(s)}
function mkSpotifyButton(cls){const b=document.createElement('button');b.type='button';b.className=cls+' alphaSpotifyToggle4324';b.setAttribute('aria-label','Spotify Remote');b.title='Spotify';b.innerHTML=spotifyIcon();b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleRemote()});return b}
function restoreNewChatToBar(){const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');if(!bar)return;const cap=bar.querySelector('.alphaChatActions4324,.alphaChatActions4323,.alphaChatActions4322');const newBtn=cap?.querySelector('.alphaNewChatBtn')||bar.querySelector('.alphaNewChatBtn');if(newBtn&&newBtn.parentElement!==bar)bar.append(newBtn);cap?.remove()}
function ensureChatCapsule(){const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');if(!bar)return;let newBtn=bar.querySelector('.alphaNewChatBtn')||bar.querySelector('.alphaChatActions4323 .alphaNewChatBtn')||bar.querySelector('.alphaChatActions4322 .alphaNewChatBtn');if(!newBtn)return;bar.querySelector('.alphaChatSpotifyTop4320')?.remove();bar.querySelector('.alphaChatActions4322')?.remove();bar.querySelector('.alphaChatActions4323')?.remove();if(!isChat()){restoreNewChatToBar();return}let cap=bar.querySelector('.alphaChatActions4324');if(!cap){cap=document.createElement('div');cap.className='alphaChatActions4324';cap.append(mkSpotifyButton('alphaChatSpotify4324'));bar.append(cap)}if(newBtn.parentElement!==cap)cap.append(newBtn)}
function visibleMenuRect(){
  const candidates=[...document.querySelectorAll('.alphaFloatingMenu,.aiChatMenuBtn,button[aria-label="Abrir conversas"],button[aria-label*="menu" i],button[title*="menu" i]')];
  for(const menu of candidates){
    const r=menu.getBoundingClientRect?.();
    if(r&&r.width>=36&&r.height>=36&&r.top>=0&&r.top<window.innerHeight&&getComputedStyle(menu).display!=='none'&&getComputedStyle(menu).visibility!=='hidden')return r;
  }
  return null;
}
function alignGlobalWithMenu(b){
  if(!b)return;
  const r=visibleMenuRect();
  if(r){
    /* Ajuste ótico: o círculo do Menu tem halo/sombra que começa ~7 CSS px acima da caixa do botão. */
    b.style.top=Math.round(Math.max(0,r.top-7))+'px';
    b.style.right=Math.round(Math.max(12,r.left))+'px';
    b.style.width=Math.round(r.width)+'px';
    b.style.height=Math.round(r.height)+'px';
  }else{
    b.style.top='max(18px, env(safe-area-inset-top))';
    b.style.right='18px';
    b.style.width='58px';
    b.style.height='58px';
  }
}
function ensureGlobalButton(){let b=$('alphaGlobalSpotify4324');['alphaGlobalSpotify4322','alphaGlobalSpotify4323'].forEach(id=>$(id)?.remove());if(!b){b=mkSpotifyButton('alphaGlobalSpotify4324');b.id='alphaGlobalSpotify4324';document.body.append(b)}const view=currentView();const knownInternal=['field','calendarHub','report','premiumInfo','profile','map','mapgo','go','live','premium'];const show=!isChat()&&(knownInternal.includes(view)||!isHome());b.hidden=!show;b.style.display=show?'grid':'none';if(show)alignGlobalWithMenu(b)}
function ensureCalendarFooter(){const nav=document.querySelector('nav.bottom,.bottom');if(!nav)return;let cal=$('calendarNav4324');if(!cal){cal=document.createElement('button');cal.id='calendarNav4324';cal.className='nav';cal.type='button';cal.dataset.alphaIconified='1';cal.dataset.id='calendarHub';cal.setAttribute('aria-label','Calendário');cal.innerHTML=calendarIcon();cal.addEventListener('click',e=>{e.preventDefault();if(typeof window.go==='function')window.go('calendarHub');else if(typeof window.alphaInternalNavigate==='function')window.alphaInternalNavigate('calendarHub');try{window.alphaCalendarRender?.()}catch{}});const spotify=$('spotifyNav');if(spotify&&spotify.parentElement===nav)nav.insertBefore(cal,spotify);else{const premium=$('premiumNav');if(premium&&premium.parentElement===nav)nav.insertBefore(cal,premium);else nav.append(cal)}}}
function syncButtons(){const on=wanted()&&remoteVisible();document.querySelectorAll('.alphaSpotifyToggle4324').forEach(b=>{b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')})}
function interceptLegacySpotify(){document.addEventListener('click',e=>{const b=e.target.closest?.('#spotifyNav,[data-alpha-chat-spotify="1"],button[aria-label="Spotify"],button[aria-label="Spotify Remote"]');if(!b||b.classList.contains('alphaSpotifyToggle4324'))return;e.preventDefault();e.stopImmediatePropagation();toggleRemote()},true)}
function reconcile(){styles();ensureCalendarFooter();ensureChatCapsule();ensureGlobalButton();syncButtons();const {root,box}=remoteEls();if(!wanted()){if(root&&!root.hidden)root.hidden=true;if(box&&!box.hidden)box.hidden=true}}

/* Swipe natural:
   LEFT  = avançar para a próxima página.
   RIGHT = voltar para a página anterior.
   Home --left--> Mapa/GO --left--> Calendário --left--> LIVE --left--> Premium --left--> Perfil
   Spotify não entra na sequência: é um controlo global, não uma página de navegação. */
const SWIPE_ORDER=['home','field','calendarHub','report','premiumInfo','profile'];
const VIEW_ALIASES={map:'field',mapgo:'field',go:'field',live:'report',premium:'premiumInfo',lifestyleAI:'home'};
let sx=0,sy=0,st=0,swipeBlocked=false;
function horizontalScrollable(el){for(let n=el;n&&n!==document.body;n=n.parentElement){const cs=getComputedStyle(n);if((/auto|scroll/.test(cs.overflowX)||n.scrollWidth>n.clientWidth+8)&&n.scrollWidth>n.clientWidth+8)return true}return false}
function blockSwipeTarget(t){return !!t.closest?.('input,textarea,select,[contenteditable="true"],#realMap,.maplibregl-canvas,.photoStrip,.alphaPlacesRail,.alphaSpotifyGlobal,.alphaSpotifyOverlay,.alphaChatActions4324,.alphaConversationSidebar')||horizontalScrollable(t)}
function normalizedView(){let v=currentView();return VIEW_ALIASES[v]||v}
function navigateTo(v){if(v==='home'){if(typeof window.go==='function')window.go('home');return}if(typeof window.go==='function'){window.go(v);if(v==='calendarHub')try{window.alphaCalendarRender?.()}catch{};return}if(typeof window.alphaInternalNavigate==='function'){window.alphaInternalNavigate(v);if(v==='calendarHub')try{window.alphaCalendarRender?.()}catch{}}}
function swipeNavigate(direction){if(isChat())return;const v=normalizedView();let i=SWIPE_ORDER.indexOf(v);if(i<0)i=0;const ni=i+direction;if(ni<0||ni>=SWIPE_ORDER.length)return;navigateTo(SWIPE_ORDER[ni])}
document.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;swipeBlocked=blockSwipeTarget(e.target);sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now()},{passive:true});
document.addEventListener('touchend',e=>{if(swipeBlocked||!e.changedTouches?.length)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy,dt=Date.now()-st;if(dt>700||Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.35)return;swipeNavigate(dx<0?1:-1)},{passive:true});

interceptLegacySpotify();
['pageshow','focus','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(reconcile,80),{passive:true}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(reconcile,80)});
document.addEventListener('click',()=>setTimeout(reconcile,40),true);
setTimeout(reconcile,120);setTimeout(reconcile,500);setTimeout(reconcile,1000);setInterval(reconcile,1200);
function version(){document.querySelector('meta[name="alpha-version"]')?.setAttribute('content',VERSION);const v=$('alphaTestVersion');if(v)v.textContent='v'+VERSION;const s=$('alphaCompassStatus');if(s&&/A iniciar a ALPHA/i.test(s.textContent||''))s.textContent='A iniciar a ALPHA '+VERSION+'…'}setTimeout(version,100);setTimeout(version,700);console.info('[ALPHA '+VERSION+'] SPOTIFY TOP ALIGN + SWIPE ativo');
})();
