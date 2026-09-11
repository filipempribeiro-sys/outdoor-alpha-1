/* ALPHA 4.3.41 · INTERNAL SIDEBAR CLEANUP
   ONLY the internal sidebar used outside Chat (views 3–7):
   - remove Spotify entry
   - rename sidebar header ALPHA -> OLSEN
   Chat sidebar is deliberately untouched.
*/
(()=>{
'use strict';
if(window.__alphaInternalSidebarCleanup441)return;
window.__alphaInternalSidebarCleanup441=true;

function apply(){
  const sidebar=document.getElementById('alphaInternalSidebar');
  if(!sidebar)return;

  const brand=sidebar.querySelector('.alphaInternalBrand b');
  if(brand&&brand.textContent.trim()!=='OLSEN') brand.textContent='OLSEN';

  sidebar.querySelectorAll('.alphaInternalNavList button').forEach(btn=>{
    const text=String(btn.textContent||'').trim().toLocaleLowerCase('pt-PT');
    const action=String(btn.getAttribute('onclick')||'').toLocaleLowerCase('pt-PT');
    if(text==='spotify'||action.includes('alphaspotifyfooteraction')) btn.remove();
  });
}

apply();
window.addEventListener('pageshow',()=>requestAnimationFrame(apply),{passive:true});
document.addEventListener('click',e=>{
  if(e.target?.closest?.('[onclick*="alphaOpenInternalSidebar"],[onclick*="alphaToggleInternalSidebar"],.alphaInternalMenuBtn')){
    requestAnimationFrame(apply);
  }
},true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
setTimeout(apply,100);

console.info('[ALPHA 4.3.41] Internal sidebar: Spotify removed, brand renamed to OLSEN');
})();