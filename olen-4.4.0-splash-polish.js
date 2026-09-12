/* OLEN 4.4.0 · CINEMATIC SPLASH POLISH */
(()=>{
'use strict';
if(window.__olenSplashPolish440)return;
window.__olenSplashPolish440=true;

const style=document.createElement('style');
style.id='olenSplashPolish440';
style.textContent=`
#alphaWelcomeOverlay{
  background:
    radial-gradient(circle at 50% 18%,rgba(0,255,188,.14),transparent 26%),
    radial-gradient(circle at 78% 30%,rgba(0,139,255,.10),transparent 28%),
    linear-gradient(180deg,#07191a 0%,#041114 54%,#02090d 100%)!important;
  overflow:hidden!important;
}
#alphaWelcomeOverlay::before,
#alphaWelcomeOverlay::after{
  content:"";
  position:absolute;
  left:-12vw;right:-12vw;
  height:180px;
  pointer-events:none;
  opacity:.8;
  filter:blur(.2px);
}
#alphaWelcomeOverlay::before{
  top:6vh;
  border-top:2px solid rgba(62,255,196,.72);
  border-radius:50%;
  box-shadow:0 -2px 24px rgba(0,255,188,.22),0 0 52px rgba(0,142,255,.14);
  transform:rotate(-2deg);
}
#alphaWelcomeOverlay::after{
  bottom:-38px;
  background:
    radial-gradient(ellipse at 16% 54%,rgba(0,255,166,.16),transparent 22%),
    radial-gradient(ellipse at 77% 44%,rgba(0,128,255,.19),transparent 28%);
  border-top:1px solid rgba(0,225,255,.26);
  transform:skewY(-4deg);
}
#alphaWelcomeOverlay .alphaWelcomeInner{
  position:relative!important;
  z-index:2!important;
  width:min(92vw,480px)!important;
  max-width:480px!important;
  padding:4vh 18px 5vh!important;
}
#alphaWelcomeOverlay .olen440-splash-poster{
  width:min(72vw,370px)!important;
  max-height:47vh!important;
  object-fit:contain!important;
  margin:0 auto 18px!important;
  filter:drop-shadow(0 0 18px rgba(0,255,188,.18)) drop-shadow(0 0 28px rgba(0,128,255,.10));
}
#alphaWelcomeOverlay .alphaWelcomeTitle{
  color:#f8fbfb!important;
  text-shadow:0 0 18px rgba(255,255,255,.08)!important;
  margin-top:10px!important;
}
#alphaWelcomeOverlay .alphaWelcomeSub{
  color:rgba(223,238,236,.70)!important;
  margin-top:4px!important;
}
#alphaWelcomeOverlay .alphaCompassStatus{
  margin-top:18px!important;
  color:rgba(214,232,229,.72)!important;
  font-size:14px!important;
}
#alphaWelcomeOverlay .olen440-loader{
  width:min(61vw,300px);
  height:5px;
  margin:22px auto 0;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  overflow:visible;
  position:relative;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.025);
}
#alphaWelcomeOverlay .olen440-loaderFill{
  position:absolute;left:0;top:0;bottom:0;width:0;
  border-radius:inherit;
  background:linear-gradient(90deg,#11e88a 0%,#10e7d0 48%,#1ca8ff 100%);
  box-shadow:0 0 14px rgba(18,226,205,.30);
  animation:olen440Load 2.6s cubic-bezier(.22,.7,.22,1) forwards;
}
#alphaWelcomeOverlay .olen440-loaderDot{
  position:absolute;top:50%;left:0;width:11px;height:11px;
  margin:-5.5px 0 0 -5.5px;border-radius:50%;
  background:#fff;
  box-shadow:0 0 9px #fff,0 0 18px rgba(0,230,255,.95);
  animation:olen440Dot 2.6s cubic-bezier(.22,.7,.22,1) forwards;
}
@keyframes olen440Load{0%{width:0}18%{width:24%}55%{width:63%}78%{width:82%}100%{width:100%}}
@keyframes olen440Dot{0%{left:0}18%{left:24%}55%{left:63%}78%{left:82%}100%{left:100%}}
@media(max-height:760px){
  #alphaWelcomeOverlay .alphaWelcomeInner{padding-top:2vh!important;padding-bottom:3vh!important}
  #alphaWelcomeOverlay .olen440-splash-poster{width:min(64vw,300px)!important;max-height:40vh!important;margin-bottom:10px!important}
  #alphaWelcomeOverlay .olen440-loader{margin-top:14px!important}
  #alphaWelcomeOverlay .alphaCompassStatus{margin-top:12px!important}
}
`;
document.head.appendChild(style);

function install(){
  const inner=document.querySelector('#alphaWelcomeOverlay .alphaWelcomeInner');
  const status=document.getElementById('alphaCompassStatus');
  if(!inner||!status)return;
  if(!inner.querySelector('.olen440-loader')){
    const loader=document.createElement('div');
    loader.className='olen440-loader';
    loader.setAttribute('aria-hidden','true');
    loader.innerHTML='<span class="olen440-loaderFill"></span><span class="olen440-loaderDot"></span>';
    status.before(loader);
  }
  if(/A iniciar a OLEN(?:\s*4\.3\.43)?/i.test(status.textContent||''))status.textContent='A iniciar a OLEN…';
}

function apply(){requestAnimationFrame(install)}
document.addEventListener('DOMContentLoaded',apply,{once:true});
window.addEventListener('pageshow',apply,{passive:true});
apply();setTimeout(install,80);setTimeout(install,300);
console.info('[OLEN 4.4.0] Cinematic splash polish active');
})();
