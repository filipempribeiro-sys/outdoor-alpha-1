/* ALPHA 4.3.43 · HOME UX POLISH
   Home only:
   - Weather widget uses ALPHA/OLEN visual language
   - Home is fixed: no page scroll
   - Chat container grows to fill the available height
   - Gap header→container equals gap container→footer
   Chat fullscreen and internal views are untouched.
*/
(()=>{
'use strict';
if(window.__alphaHomeUxPolish443)return;
window.__alphaHomeUxPolish443=true;

const style=document.createElement('style');
style.id='alphaHomeUxPolish443';
style.textContent=`
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeather{
    border:1px solid rgba(92,190,158,.24)!important;
    background:linear-gradient(145deg,rgba(12,35,38,.96),rgba(10,27,34,.985))!important;
    color:#eff7f3!important;border-radius:20px!important;
    box-shadow:0 12px 30px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.025)!important;
    backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;
  }
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeather:active{transform:scale(.985)!important;background:linear-gradient(145deg,rgba(14,43,39,.98),rgba(10,31,35,.99))!important}
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherIcon{filter:none!important;color:#72ddb5!important}
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherMain b{color:#f2faf7!important;font-weight:850!important;letter-spacing:-.02em!important}
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherMain small,
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide small{color:#90a9a2!important}
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide{border-left:1px solid rgba(111,210,177,.14)!important}
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide b{color:#dff5ed!important}

  body.alphaHomeFixed443{overflow:hidden!important}
  body.alphaHomeFixed443 #home{overflow:hidden!important;padding-top:0!important}
  body.alphaHomeFixed443 #home.active > #lifestyleAI,
  body.alphaHomeFixed443[data-alpha-view="home"] #home > #lifestyleAI{
    margin-top:0!important;margin-bottom:0!important;
    height:var(--alpha-home-chat-height443)!important;
    min-height:var(--alpha-home-chat-height443)!important;
    max-height:var(--alpha-home-chat-height443)!important;
  }
`;
document.head.appendChild(style);

function isHome(){
  if(document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode'))return false;
  const home=document.getElementById('home');
  return !!home&&(home.classList.contains('active')||document.body.dataset.alphaView==='home');
}
function fitHome(){
  if(!isHome()){document.body.classList.remove('alphaHomeFixed443');return}
  const body=document.body, home=document.getElementById('home'), card=document.getElementById('lifestyleAI');
  const footer=document.querySelector('.bottom');
  if(!home||!card||!footer)return;
  body.classList.add('alphaHomeFixed443');
  const gap=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--alpha-shell-gap'))||10;
  const cardRect=card.getBoundingClientRect();
  const footerRect=footer.getBoundingClientRect();
  const top=cardRect.top;
  const bottom=footerRect.top-gap;
  /* Target screenshot is ~40 px taller than the current Home card on the same viewport.
     Change only the Home card height; keep every other position/style untouched. */
  const height=Math.max(260,Math.floor(bottom-top)+40);
  body.style.setProperty('--alpha-home-chat-height443',height+'px');
  if(window.scrollY)window.scrollTo(0,0);
}
function refit(){requestAnimationFrame(()=>{window.alphaFitShell?.();requestAnimationFrame(fitHome)})}
window.addEventListener('pageshow',refit,{passive:true});
window.addEventListener('resize',refit,{passive:true});
window.addEventListener('orientationchange',refit,{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(fitHome),true);
setTimeout(refit,100);setTimeout(fitHome,350);

console.info('[ALPHA 4.3.43] Home container extended to target height');
})();

/* ALPHA 4.3.43 · SPOTIFY PLAYLIST OPEN RELIABILITY
   Keeps the existing Spotify flow intact. The only behavioural change is that
   an already-connected Spotify session reserves a browser target during the
   user's tap, so Android does not reject the later open after the async playlist
   build. HTTPS is preferred because Android can hand the link to the Spotify app.
*/
(()=>{
'use strict';
if(window.__alphaSpotifyPlaylistOpen443)return;

let installTries=0;
function install(){
  const originalEnsure=window.alphaEnsureSpotifyPlaylist;
  const originalOpen=window.alphaOpenSpotifyPlaylist;
  if(typeof originalEnsure!=='function'||typeof originalOpen!=='function'){
    if(++installTries<30)setTimeout(install,100);
    return;
  }
  window.__alphaSpotifyPlaylistOpen443=true;

  let knownConnected=false;
  let preparedWindow=null;

  function refreshConnected(){
    try{
      if(typeof window.alphaSpotifyStatus==='function'){
        Promise.resolve(window.alphaSpotifyStatus()).then(s=>{knownConnected=!!s?.connected}).catch(()=>{});
      }
    }catch{}
  }

  function playlistUrl(p){
    if(p?.url)return String(p.url);
    if(p?.id)return 'https://open.spotify.com/playlist/'+encodeURIComponent(String(p.id));
    return '';
  }

  function closePrepared(){
    try{if(preparedWindow&&!preparedWindow.closed)preparedWindow.close()}catch{}
    preparedWindow=null;
  }

  window.alphaOpenSpotifyPlaylist=function(p){
    if(!p)return;
    const url=playlistUrl(p);
    if(url){
      try{
        if(preparedWindow&&!preparedWindow.closed){
          preparedWindow.location.replace(url);
          preparedWindow=null;
          return;
        }
      }catch{preparedWindow=null}
      /* Same-page HTTPS navigation is not subject to async popup blocking and,
         on Android with Spotify installed, can be resolved directly by the app. */
      try{window.location.assign(url);return}catch{}
    }
    return originalOpen.call(this,p);
  };

  window.alphaEnsureSpotifyPlaylist=function(i,opts){
    const options=opts||{};
    const openAfter=options.openAfter!==false;

    if(openAfter&&knownConnected){
      closePrepared();
      try{
        preparedWindow=window.open('about:blank','alphaSpotifyPlaylist');
        if(preparedWindow){
          preparedWindow.document.title='Spotify · ALPHA';
          preparedWindow.document.body.style.cssText='margin:0;background:#071116;color:#eff7f3;font:600 16px system-ui;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px';
          preparedWindow.document.body.textContent='A ALPHA está a criar a tua playlist…';
        }
      }catch{preparedWindow=null}
    }

    let result;
    try{result=originalEnsure.call(this,i,opts)}catch(e){closePrepared();throw e}
    return Promise.resolve(result).then(p=>{
      if(!p)closePrepared();
      else knownConnected=true;
      return p;
    }).catch(e=>{closePrepared();throw e});
  };

  refreshConnected();
  window.addEventListener('focus',refreshConnected,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshConnected()});
  console.info('[ALPHA 4.3.43] Spotify playlist open-after-create fix active');
}
setTimeout(install,0);
})();
