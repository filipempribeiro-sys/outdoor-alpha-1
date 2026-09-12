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