/* ALPHA 4.3.22 · GLOBAL SPOTIFY REMOTE CONTROL
   - Spotify toggle funcional em Home, Chat e restantes vistas
   - Chat: Spotify + Nova conversa numa única cápsula
   - Restantes vistas: Spotify permanente no topo
   - Remote só abre/fecha por ação explícita do utilizador
   - Sem MutationObserver agressivo
*/
(()=>{
'use strict';
const VERSION='4.3.22';
const REMOTE_KEY='alpha_spotify_remote_explicit_v4322';
const $=id=>document.getElementById(id);
const isChat=()=>document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode');
function setWanted(v){try{sessionStorage.setItem(REMOTE_KEY,v?'1':'0')}catch{};try{window.alphaSpotifyRemoteWanted=!!v}catch{};try{if(typeof window.alphaSpotifyRememberRemote==='function')window.alphaSpotifyRememberRemote(!!v)}catch{}}
function wanted(){try{return sessionStorage.getItem(REMOTE_KEY)==='1'}catch{return false}}
function remoteEls(){return {root:$('alphaSpotifyGlobal'),box:$('alphaSpotifyOverlay')}}
function remoteVisible(){const {root,box}=remoteEls();return !!root&&!root.hidden&&(!box||!box.hidden)}
async function setRemote(open){
  const {root,box}=remoteEls();
  setWanted(open);
  if(root)root.hidden=!open;
  if(box)box.hidden=!open;
  if(open){
    try{if(typeof window.alphaSpotifyPollGlobal==='function')await window.alphaSpotifyPollGlobal(true)}catch(e){console.warn('[ALPHA '+VERSION+'] poll',e)}
    try{if(typeof window.alphaSpotifyRefreshGlobal==='function')await window.alphaSpotifyRefreshGlobal(true)}catch{}
  }
  syncButtons();
}
async function toggleRemote(){await setRemote(!(wanted()&&remoteVisible()))}
window.alphaSpotifyToggleGlobal4322=toggleRemote;

function icon(size=27){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:'+size+'px;height:'+size+'px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M7.5 9.2c3.4-1 7.2-.7 10.1.8M8.2 12.3c2.9-.8 6-.5 8.6.7M9 15.2c2.3-.6 4.8-.4 6.8.5"/></svg>'}
function styles(){if($('alphaSpotify4322Style'))return;const s=document.createElement('style');s.id='alphaSpotify4322Style';s.textContent=`
.alphaChatActions4322{margin-left:auto;display:flex;align-items:center;border:1px solid rgba(255,255,255,.13);background:rgba(29,31,33,.92);border-radius:999px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.22)}
.alphaChatActions4322 button{width:58px!important;height:58px!important;min-width:58px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#fff!important;display:grid!important;place-items:center!important;padding:0!important;margin:0!important;box-shadow:none!important}
.alphaChatActions4322 button+button{border-left:1px solid rgba(255,255,255,.13)!important}
.alphaSpotifyToggle4322.active{color:#66e8b8!important;background:rgba(18,60,48,.94)!important}
.alphaGlobalSpotify4322{position:fixed;top:max(18px,env(safe-area-inset-top));right:18px;z-index:78;width:58px;height:58px;border-radius:50%;border:1px solid rgba(255,255,255,.13);background:rgba(29,31,33,.92);color:#fff;display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.22)}
.alphaGlobalSpotify4322.active{color:#66e8b8;border-color:rgba(85,230,174,.6);background:rgba(18,60,48,.94)}
body.alphaChatMode .alphaGlobalSpotify4322,body.alphaComposeMode .alphaGlobalSpotify4322{display:none!important}
body.alphaChatMode .alphaSpotifyClose,body.alphaComposeMode .alphaSpotifyClose{display:none!important}
@media(max-width:390px){.alphaChatActions4322 button,.alphaGlobalSpotify4322{width:54px!important;height:54px!important;min-width:54px!important}}
`;document.head.append(s)}
function mkSpotifyButton(cls){const b=document.createElement('button');b.type='button';b.className=cls+' alphaSpotifyToggle4322';b.setAttribute('aria-label','Spotify Remote');b.title='Spotify';b.innerHTML=icon();b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleRemote()});return b}
function ensureChatCapsule(){
  const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');
  const newBtn=bar?.querySelector('.alphaNewChatBtn');if(!bar||!newBtn)return;
  bar.querySelector('.alphaChatSpotifyTop4320')?.remove();
  let cap=bar.querySelector('.alphaChatActions4322');
  if(!cap){cap=document.createElement('div');cap.className='alphaChatActions4322';const sp=mkSpotifyButton('alphaChatSpotify4322');cap.append(sp);bar.insertBefore(cap,newBtn);cap.append(newBtn)}
  cap.style.display=isChat()?'flex':'none';
}
function ensureGlobalButton(){let b=$('alphaGlobalSpotify4322');if(!b){b=mkSpotifyButton('alphaGlobalSpotify4322');b.id='alphaGlobalSpotify4322';document.body.append(b)}b.hidden=isChat()}
function syncButtons(){const on=wanted()&&remoteVisible();document.querySelectorAll('.alphaSpotifyToggle4322').forEach(b=>{b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')})}
function interceptLegacySpotify(){
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#spotifyNav,[data-alpha-chat-spotify="1"],button[aria-label="Spotify"],button[aria-label="Spotify Remote"]');
    if(!b||b.classList.contains('alphaSpotifyToggle4322'))return;
    e.preventDefault();e.stopImmediatePropagation();toggleRemote();
  },true)
}
function reconcile(){styles();ensureChatCapsule();ensureGlobalButton();syncButtons();const {root,box}=remoteEls();if(!wanted()){if(root&&!root.hidden)root.hidden=true;if(box&&!box.hidden)box.hidden=true}}
interceptLegacySpotify();
window.addEventListener('pageshow',()=>setTimeout(reconcile,80));window.addEventListener('focus',()=>setTimeout(reconcile,80));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(reconcile,80)});
setTimeout(reconcile,120);setTimeout(reconcile,800);setInterval(reconcile,1800);
function version(){document.querySelector('meta[name="alpha-version"]')?.setAttribute('content',VERSION);const v=$('alphaTestVersion');if(v)v.textContent='v'+VERSION;const s=$('alphaCompassStatus');if(s&&/A iniciar a ALPHA/i.test(s.textContent||''))s.textContent='A iniciar a ALPHA '+VERSION+'…'}
setTimeout(version,100);setTimeout(version,700);console.info('[ALPHA '+VERSION+'] GLOBAL SPOTIFY REMOTE ativo');
})();
