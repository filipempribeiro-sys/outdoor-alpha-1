/* ALPHA 4.3.30 · OLEN LOGO HOTFIX 7
   Corrige apenas o logo do cabeçalho da sidebar:
   - preserva Logo + OLEN + lupa
   - seta/triângulo preto rigorosamente centrado no círculo
*/
(()=>{
'use strict';
function style(){
  if(document.getElementById('alphaOlenLogoHotfix7Style')) return;
  const s=document.createElement('style');
  s.id='alphaOlenLogoHotfix7Style';
  s.textContent=`
.alphaOlenHead .alphaOlenBrandLogo{
  width:44px!important;height:44px!important;min-width:44px!important;
  border-radius:50%!important;overflow:hidden!important;
  position:relative!important;display:grid!important;place-items:center!important;
}
.alphaOlenHead .alphaOlenBrandLogo .logo,
.alphaOlenHead .alphaOlenBrandLogo img{
  width:44px!important;height:44px!important;min-width:44px!important;
  margin:0!important;padding:0!important;border-radius:50%!important;
  object-fit:cover!important;object-position:50% 50%!important;
  transform:none!important;
}
.alphaOlenHead .alphaOlenBrandLogoFallback{
  width:44px!important;height:44px!important;border-radius:50%!important;
  position:relative!important;
  background:conic-gradient(from 200deg,#39d69b,#68a8ff,#39d69b)!important;
}
.alphaOlenHead .alphaOlenBrandLogoFallback:after{
  content:''!important;
  position:absolute!important;
  left:50%!important;top:50%!important;
  width:0!important;height:0!important;
  border-left:10px solid transparent!important;
  border-right:10px solid transparent!important;
  border-bottom:20px solid #061014!important;
  transform:translate(-50%,-50%)!important;
  transform-origin:center!important;
}
`;
  document.head.appendChild(s);
}
function ensureCenteredLogo(){
  style();
  const holder=document.querySelector('.alphaOlenHead .alphaOlenBrandLogo');
  if(!holder) return;
  holder.style.setProperty('display','grid','important');
  holder.style.setProperty('place-items','center','important');
  holder.style.setProperty('position','relative','important');
  const media=holder.querySelector('.logo,img');
  if(media){
    media.style.setProperty('object-position','50% 50%','important');
    media.style.setProperty('transform','none','important');
    media.style.setProperty('margin','0','important');
  }
}
new MutationObserver(()=>requestAnimationFrame(ensureCenteredLogo)).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('pageshow',ensureCenteredLogo,{passive:true});
setTimeout(ensureCenteredLogo,80);setTimeout(ensureCenteredLogo,400);
console.info('[ALPHA 4.3.30] OLEN logo hotfix7 ativo');
})();
