/* ALPHA 4.3.43 · HOME UX POLISH
   Home only:
   - Weather widget uses ALPHA/OLEN visual language
   - Home chat shell uses the same top and bottom gap to the surrounding chrome
   Chat fullscreen and internal views are untouched.
*/
(()=>{
'use strict';
if(window.__alphaHomeUxPolish443)return;
window.__alphaHomeUxPolish443=true;

const style=document.createElement('style');
style.id='alphaHomeUxPolish443';
style.textContent=`
  /* WEATHER · HOME HEADER */
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeather{
    border:1px solid rgba(92,190,158,.24)!important;
    background:linear-gradient(145deg,rgba(12,35,38,.96),rgba(10,27,34,.985))!important;
    color:#eff7f3!important;
    border-radius:20px!important;
    box-shadow:0 12px 30px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.025)!important;
    backdrop-filter:blur(14px)!important;
    -webkit-backdrop-filter:blur(14px)!important;
  }
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeather:active{
    transform:scale(.985)!important;
    background:linear-gradient(145deg,rgba(14,43,39,.98),rgba(10,31,35,.99))!important;
  }
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherIcon{
    filter:none!important;
    color:#72ddb5!important;
  }
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherMain b{
    color:#f2faf7!important;
    font-weight:850!important;
    letter-spacing:-.02em!important;
  }
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherMain small,
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide small{
    color:#90a9a2!important;
  }
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide{
    border-left:1px solid rgba(111,210,177,.14)!important;
  }
  body:not(.alphaChatMode):not(.alphaComposeMode) .headerWeatherSide b{
    color:#dff5ed!important;
  }

  /* HOME CHAT SHELL · same breathing room below header and above footer */
  body:not(.alphaChatMode):not(.alphaComposeMode) #home{
    padding-top:0!important;
  }
  body:not(.alphaChatMode):not(.alphaComposeMode) #home.active > #lifestyleAI,
  body:not(.alphaChatMode):not(.alphaComposeMode)[data-alpha-view="home"] #home > #lifestyleAI{
    margin-top:var(--alpha-shell-gap,10px)!important;
    margin-bottom:var(--alpha-shell-gap,10px)!important;
  }
`;
document.head.appendChild(style);

function refit(){
  if(document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode'))return;
  requestAnimationFrame(()=>window.alphaFitShell?.());
}
window.addEventListener('pageshow',refit,{passive:true});
window.addEventListener('resize',refit,{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(refit),true);
setTimeout(refit,120);

console.info('[ALPHA 4.3.43] Home weather + balanced shell spacing');
})();