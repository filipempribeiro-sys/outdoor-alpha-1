/* ALPHA 4.3.38 · HOME NO SPOTIFY FOOTER
   Isolated Home-only cleanup.
   Spotify remains available in Chat/internal views exactly as before.
*/
(()=>{
'use strict';
if(window.__alphaHomeNoSpotifyFooter438)return;
window.__alphaHomeNoSpotifyFooter438=true;

const style=document.createElement('style');
style.id='alphaHomeNoSpotifyFooter438';
style.textContent=`
  body:not(.alphaChatMode):not(.alphaComposeMode)[data-alpha-view="home"] #spotifyNav,
  body:not(.alphaChatMode):not(.alphaComposeMode) #home.active ~ .bottom #spotifyNav,
  body:not(.alphaChatMode):not(.alphaComposeMode) #home.active .bottom #spotifyNav{
    display:none!important;
  }
`;
document.head.appendChild(style);

function sync(){
  const spotify=document.getElementById('spotifyNav');
  if(!spotify)return;
  const chat=document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');
  const bodyView=String(document.body.dataset.alphaView||'');
  const home=document.getElementById('home');
  const homeActive=home?.classList.contains('active')||home?.classList.contains('show');
  const onHome=!chat&&(bodyView==='home'||(!bodyView&&homeActive));
  spotify.style.setProperty('display',onHome?'none':'','important');
  if(!onHome)spotify.style.removeProperty('display');
}

window.addEventListener('pageshow',()=>requestAnimationFrame(sync),{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(sync),true);
document.addEventListener('touchend',()=>requestAnimationFrame(sync),{passive:true,capture:true});
setTimeout(sync,120);
console.info('[ALPHA 4.3.38] Spotify removed from Home footer only');
})();