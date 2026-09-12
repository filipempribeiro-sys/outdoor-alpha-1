/* OLEN 4.4.0 · CINEMATIC BACKGROUND SPLASH */
(()=>{
'use strict';
if(window.__olenSplashPolish440)return;
window.__olenSplashPolish440=true;

const BG='assets/olen-splash-background.png';
const style=document.createElement('style');
style.id='olenSplashPolish440';
style.textContent=`
#alphaWelcomeOverlay{
  background:#02090d url('${BG}') center top/cover no-repeat!important;
  overflow:hidden!important;
}
#alphaWelcomeOverlay::before{
  content:"";
  position:absolute;inset:0;
  pointer-events:none;
  background:linear-gradient(180deg,rgba(0,8,10,.02) 0%,rgba(0,8,10,.04) 47%,rgba(0,8,10,.18) 69%,rgba(0,8,10,.54) 100%);
}
#alphaWelcomeOverlay::after{display:none!important;content:none!important}
#alphaWelcomeOverlay .alphaWelcomeInner{
  position:relative!important;
  z-index:2!important;
  width:100%!important;
  max-width:none!important;
  height:100%!important;
  min-height:100dvh!important;
  padding:0 22px calc(env(safe-area-inset-bottom) + 40px)!important;
  display:block!important;
  text-align:center!important;
}
#alphaWelcomeOverlay .olen440-splash-poster,
#alphaWelcomeOverlay #alphaWelcomeCompass,
#alphaWelcomeOverlay .alphaWelcomeEyebrow{display:none!important}
#alphaWelcomeOverlay #alphaWelcomeTitle{
  position:absolute!important;
  left:50%!important;top:65.2%!important;
  transform:translateX(-50%)!important;
  width:min(92vw,620px)!important;
  margin:0!important;
  color:#fff!important;
  font-size:clamp(32px,7.6vw,48px)!important;
  line-height:1.05!important;
  font-weight:800!important;
  letter-spacing:-.02em!important;
  text-shadow:0 2px 18px rgba(0,0,0,.68),0 0 22px rgba(255,255,255,.06)!important;
}
#alphaWelcomeOverlay #alphaWelcomeSub{
  position:absolute!important;
  left:50%!important;top:71.7%!important;
  transform:translateX(-50%)!important;
  width:min(92vw,700px)!important;
  margin:0!important;
  color:rgba(222,234,233,.72)!important;
  font-size:clamp(18px,4.2vw,28px)!important;
  line-height:1.35!important;
  font-weight:400!important;
  text-shadow:0 2px 14px rgba(0,0,0,.7)!important;
}
#alphaWelcomeOverlay .olen440-loader{
  position:absolute!important;
  left:50%!important;top:79.2%!important;
  transform:translateX(-50%)!important;
  width:min(61vw,430px)!important;
  height:6px!important;
  margin:0!important;
  border-radius:999px!important;
  background:rgba(255,255,255,.10)!important;
  overflow:visible!important;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.025)!important;
}
#alphaWelcomeOverlay .olen440-loaderFill{
  position:absolute;left:0;top:0;bottom:0;width:0;
  border-radius:inherit;
  background:linear-gradient(90deg,#18ed8c 0%,#17e8c8 48%,#22a9ff 100%);
  box-shadow:0 0 12px rgba(18,226,205,.32);
  animation:olen440Load 2.8s cubic-bezier(.22,.7,.22,1) forwards;
}
#alphaWelcomeOverlay .olen440-loaderDot{
  position:absolute;top:50%;left:0;width:18px;height:18px;
  margin:-9px 0 0 -9px;border-radius:50%;
  background:#fff;
  box-shadow:0 0 10px #fff,0 0 22px rgba(0,230,255,.95);
  animation:olen440Dot 2.8s cubic-bezier(.22,.7,.22,1) forwards;
}
#alphaWelcomeOverlay #alphaCompassStatus{
  position:absolute!important;
  left:50%!important;top:82.1%!important;
  transform:translateX(-50%)!important;
  width:min(90vw,620px)!important;
  margin:0!important;
  color:rgba(214,229,227,.76)!important;
  font-size:clamp(17px,4vw,24px)!important;
  line-height:1.25!important;
  text-shadow:0 2px 12px rgba(0,0,0,.72)!important;
}
@keyframes olen440Load{0%{width:0}16%{width:20%}48%{width:57%}76%{width:81%}100%{width:100%}}
@keyframes olen440Dot{0%{left:0}16%{left:20%}48%{left:57%}76%{left:81%}100%{left:100%}}
@media(max-height:760px){
 #alphaWelcomeOverlay #alphaWelcomeTitle{top:63.5%!important;font-size:clamp(28px,7vw,40px)!important}
 #alphaWelcomeOverlay #alphaWelcomeSub{top:70.3%!important;font-size:clamp(16px,4vw,22px)!important}
 #alphaWelcomeOverlay .olen440-loader{top:78.2%!important;width:min(62vw,360px)!important}
 #alphaWelcomeOverlay #alphaCompassStatus{top:81.6%!important;font-size:16px!important}
}
`;
document.head.appendChild(style);

function install(){
  const overlay=document.getElementById('alphaWelcomeOverlay');
  const inner=overlay?.querySelector('.alphaWelcomeInner');
  const status=document.getElementById('alphaCompassStatus');
  if(!overlay||!inner||!status)return;

  inner.querySelectorAll('.olen440-splash-poster').forEach(el=>el.remove());
  if(!inner.querySelector('.olen440-loader')){
    const loader=document.createElement('div');
    loader.className='olen440-loader';
    loader.setAttribute('aria-hidden','true');
    loader.innerHTML='<span class="olen440-loaderFill"></span><span class="olen440-loaderDot"></span>';
    status.before(loader);
  }
  status.textContent='A iniciar a OLEN…';
}

function apply(){requestAnimationFrame(install)}
document.addEventListener('DOMContentLoaded',apply,{once:true});
window.addEventListener('pageshow',apply,{passive:true});
apply();setTimeout(install,80);setTimeout(install,300);
console.info('[OLEN 4.4.0] Cinematic background splash active');
})();
