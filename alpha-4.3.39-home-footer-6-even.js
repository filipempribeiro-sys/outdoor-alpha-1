/* ALPHA 4.3.39 · HOME FOOTER 6 EVEN
   Home-only layout correction after removing Spotify.
   Six visible navigation buttons are distributed evenly across the full footer.
*/
(()=>{
'use strict';
if(window.__alphaHomeFooter6Even439)return;
window.__alphaHomeFooter6Even439=true;

const style=document.createElement('style');
style.id='alphaHomeFooter6Even439';
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
  justify-self:stretch!important;
}
`;
document.head.appendChild(style);
console.info('[ALPHA 4.3.39] Home footer distributed across 6 columns');
})();