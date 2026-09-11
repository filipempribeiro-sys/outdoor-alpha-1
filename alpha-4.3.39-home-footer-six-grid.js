/* ALPHA 4.3.39 · HOME FOOTER 6-COLUMN GRID
   Home-only layout correction after Spotify removal.
   Keeps the 6 remaining buttons evenly distributed across the full footer width.
*/
(()=>{
'use strict';
if(window.__alphaHomeFooterSixGrid439)return;
window.__alphaHomeFooterSixGrid439=true;

const style=document.createElement('style');
style.id='alphaHomeFooterSixGrid439';
style.textContent=`
body:not(.alphaChatMode):not(.alphaComposeMode)[data-alpha-view="home"] .bottom,
body:not(.alphaChatMode):not(.alphaComposeMode):has(#home.active) .bottom{
  --nav-count:6!important;
  grid-template-columns:repeat(6,minmax(0,1fr))!important;
}
body:not(.alphaChatMode):not(.alphaComposeMode)[data-alpha-view="home"] .bottom .nav:not(.hidden),
body:not(.alphaChatMode):not(.alphaComposeMode):has(#home.active) .bottom .nav:not(.hidden){
  width:100%!important;
  min-width:0!important;
}
`;
document.head.appendChild(style);

function sync(){
  const chat=document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');
  const home=document.getElementById('home');
  const onHome=!chat&&(document.body.dataset.alphaView==='home'||home?.classList.contains('active')||home?.classList.contains('show'));
  const bottom=document.querySelector('.bottom');
  if(!bottom)return;
  if(onHome){
    bottom.style.setProperty('--nav-count','6','important');
    bottom.style.setProperty('grid-template-columns','repeat(6,minmax(0,1fr))','important');
  }else{
    bottom.style.removeProperty('--nav-count');
    bottom.style.removeProperty('grid-template-columns');
  }
}
window.addEventListener('pageshow',()=>requestAnimationFrame(sync),{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(sync),true);
document.addEventListener('touchend',()=>requestAnimationFrame(sync),{passive:true,capture:true});
setTimeout(sync,120);
console.info('[ALPHA 4.3.39] Home footer redistributed to 6 equal columns');
})();