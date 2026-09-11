/* ALPHA 4.3.41 · INTERNAL SIDEBAR CLEANUP
   ONLY the internal sidebar used outside Chat (views 3–7):
   - remove Spotify entry
   - rename ONLY the sidebar header ALPHA -> OLSEN
   - keep the first navigation item "Alpha" unchanged
   Chat sidebar is deliberately untouched.
*/
(()=>{
'use strict';
if(window.__alphaInternalSidebarCleanup441)return;
window.__alphaInternalSidebarCleanup441=true;

function apply(){
  const sidebar=document.getElementById('alphaInternalSidebar');
  if(!sidebar)return;

  // Remove Spotify from this internal sidebar only.
  sidebar.querySelectorAll('button').forEach(btn=>{
    const text=String(btn.textContent||'').trim().toLocaleLowerCase('pt-PT');
    const action=String(btn.getAttribute('onclick')||'').toLocaleLowerCase('pt-PT');
    if(text==='spotify'||action.includes('alphaspotifyfooteraction')) btn.remove();
  });

  // Header is the brand area before the navigation list. Do not touch nav buttons.
  const nav=sidebar.querySelector('.alphaInternalNavList');
  const candidates=[...sidebar.querySelectorAll('b,strong,h1,h2,h3,span,div')]
    .filter(el=>!el.closest('button')&&!el.closest('.alphaInternalNavList'))
    .filter(el=>String(el.textContent||'').trim()==='ALPHA');
  const brand=candidates.find(el=>!nav||!nav.contains(el));
  if(brand) brand.textContent='OLSEN';
}

apply();
window.addEventListener('pageshow',()=>requestAnimationFrame(apply),{passive:true});
document.addEventListener('click',e=>{
  if(e.target?.closest?.('[onclick*="alphaOpenInternalSidebar"],[onclick*="alphaToggleInternalSidebar"],.alphaInternalMenuBtn')) requestAnimationFrame(apply);
},true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
setTimeout(apply,100);

console.info('[ALPHA 4.3.41] Internal sidebar: header OLSEN; Alpha navigation item preserved');
})();