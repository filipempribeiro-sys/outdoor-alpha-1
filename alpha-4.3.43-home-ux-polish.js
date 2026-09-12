/* ALPHA 4.3.43 · HOME UX POLISH
   Home only:
   - Weather widget uses ALPHA/OLEN visual language
   - Home is fixed: no page scroll
   - Chat container is geometrically locked between header and footer
   - Returning from another tab cannot move/shrink the Home container
*/
(()=>{
'use strict';
if(window.__alphaHomeUxPolish443)return;
window.__alphaHomeUxPolish443=true;
const style=document.createElement('style');style.id='alphaHomeUxPolish443';style.textContent=`
body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeather{border:1px solid rgba(92,190,158,.24)!important;background:linear-gradient(145deg,rgba(12,35,38,.96),rgba(10,27,34,.985))!important;color:#eff7f3!important;border-radius:20px!important;box-shadow:0 12px 30px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.025)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}
body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeather:active{transform:scale(.985)!important;background:linear-gradient(145deg,rgba(14,43,39,.98),rgba(10,31,35,.99))!important}
body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherIcon{filter:none!important;color:#72ddb5!important}body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherMain b{color:#f2faf7!important;font-weight:850!important;letter-spacing:-.02em!important}body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherMain small,body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide small{color:#90a9a2!important}body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide{border-left:1px solid rgba(111,210,177,.14)!important}body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide b{color:#dff5ed!important}
body.alphaHomeFixed443{overflow:hidden!important}body.alphaHomeFixed443 #home{overflow:hidden!important;padding:0!important}
body.alphaHomeFixed443 #home>#lifestyleAI{position:fixed!important;top:var(--alpha-home-top443)!important;bottom:var(--alpha-home-bottom443)!important;left:var(--alpha-home-left443)!important;right:var(--alpha-home-right443)!important;width:auto!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important}
`;document.head.appendChild(style);
function isHome(){if(document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode'))return false;const h=document.getElementById('home');return !!h&&(h.classList.contains('active')||document.body.dataset.alphaView==='home')}
function unlock(){document.body.classList.remove('alphaHomeFixed443')}
function fitHome(){if(!isHome()){unlock();return}const body=document.body,card=document.getElementById('lifestyleAI'),weather=document.querySelector('.headerWeather'),footer=document.querySelector('.bottom');if(!card||!weather||!footer)return;/* measure while normal flow is available, then lock geometry */unlock();const cr=card.getBoundingClientRect(),wr=weather.getBoundingClientRect(),fr=footer.getBoundingClientRect();const gap=Math.max(10,Math.round(cr.top-wr.bottom));const top=Math.round(wr.bottom+gap);const bottom=Math.max(0,Math.round(innerHeight-(fr.top-gap)));body.style.setProperty('--alpha-home-top443',top+'px');body.style.setProperty('--alpha-home-bottom443',bottom+'px');body.style.setProperty('--alpha-home-left443',Math.round(cr.left)+'px');body.style.setProperty('--alpha-home-right443',Math.round(innerWidth-cr.right)+'px');body.classList.add('alphaHomeFixed443');if(window.scrollY)window.scrollTo(0,0)}
function refit(){if(!isHome()){unlock();return}requestAnimationFrame(()=>{window.alphaFitShell?.();requestAnimationFrame(fitHome)})}
window.addEventListener('pageshow',refit,{passive:true});window.addEventListener('resize',refit,{passive:true});window.addEventListener('orientationchange',refit,{passive:true});document.addEventListener('click',()=>requestAnimationFrame(()=>{if(isHome())fitHome();else unlock()}),true);setTimeout(refit,100);setTimeout(fitHome,350);
console.info('[ALPHA 4.3.43] Home geometry locked across navigation');
})();