/* ALPHA 4.3.43 · HOME UX POLISH
   Home only:
   - Weather widget uses ALPHA/OLEN visual language
   - Home fixed with no page scroll
   - Preserve the exact initial Home container geometry across tab changes
   - Do not recalculate from a mutated layout when returning to Home
*/
(()=>{
'use strict';
if(window.__alphaHomeUxPolish443)return;
window.__alphaHomeUxPolish443=true;

let homeGeometry=null;
let viewportKey='';

const style=document.createElement('style');
style.id='alphaHomeUxPolish443';
style.textContent=`
body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeather{
  border:1px solid rgba(92,190,158,.24)!important;
  background:linear-gradient(145deg,rgba(12,35,38,.96),rgba(10,27,34,.985))!important;
  color:#eff7f3!important;border-radius:20px!important;
  box-shadow:0 12px 30px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.025)!important;
  backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important
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
body.alphaHomeFixed443 #home.active>#lifestyleAI,
body.alphaHomeFixed443[data-alpha-view="home"] #home>#lifestyleAI{
  margin-top:0!important;margin-bottom:0!important;
  height:var(--alpha-home-chat-height443)!important;
  min-height:var(--alpha-home-chat-height443)!important;
  max-height:var(--alpha-home-chat-height443)!important
}
`;
document.head.appendChild(style);

function isHome(){
  if(document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode'))return false;
  const home=document.getElementById('home');
  return !!home&&(home.classList.contains('active')||document.body.dataset.alphaView==='home');
}
function key(){return `${innerWidth}x${innerHeight}`}
function clearGeometry(){homeGeometry=null;viewportKey='';document.body.style.removeProperty('--alpha-home-chat-height443')}
function unlock(){document.body.classList.remove('alphaHomeFixed443')}
function captureInitialGeometry(){
  if(!isHome())return;
  const body=document.body,home=document.getElementById('home'),card=document.getElementById('lifestyleAI'),footer=document.querySelector('.bottom');
  if(!home||!card||!footer)return;
  unlock();
  /* Restore the previous commit's sizing logic for the initial Home state. */
  window.alphaFitShell?.();
  requestAnimationFrame(()=>{
    if(!isHome())return;
    const cr=card.getBoundingClientRect(),fr=footer.getBoundingClientRect();
    const gap=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--alpha-shell-gap'))||10;
    const top=cr.top;
    const bottom=fr.top-gap;
    const height=Math.max(260,Math.floor(bottom-top));
    homeGeometry={height};viewportKey=key();
    body.style.setProperty('--alpha-home-chat-height443',height+'px');
    body.classList.add('alphaHomeFixed443');
    if(window.scrollY)window.scrollTo(0,0);
  });
}
function applyStoredGeometry(){
  if(!isHome()){unlock();return}
  if(!homeGeometry||viewportKey!==key()){captureInitialGeometry();return}
  document.body.style.setProperty('--alpha-home-chat-height443',homeGeometry.height+'px');
  document.body.classList.add('alphaHomeFixed443');
  if(window.scrollY)window.scrollTo(0,0);
}
function onHomeReturn(){
  if(!isHome()){unlock();return}
  /* Never measure again after tab navigation: re-use the good first geometry. */
  requestAnimationFrame(applyStoredGeometry);
}

window.addEventListener('pageshow',()=>{if(!homeGeometry)captureInitialGeometry();else onHomeReturn()},{passive:true});
window.addEventListener('resize',()=>{if(key()!==viewportKey){clearGeometry();setTimeout(captureInitialGeometry,40)}},{passive:true});
window.addEventListener('orientationchange',()=>{clearGeometry();setTimeout(captureInitialGeometry,180)},{passive:true});
document.addEventListener('click',()=>setTimeout(onHomeReturn,0),true);
setTimeout(captureInitialGeometry,120);
setTimeout(()=>{if(!homeGeometry)captureInitialGeometry()},380);

console.info('[ALPHA 4.3.43] Initial Home size preserved across navigation');
})();