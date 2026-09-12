/* ALPHA 4.3.41 · INTERNAL SIDEBAR CLEANUP
   Internal sidebar used outside Chat (views 3–7).
   Public branding is OLEN; technical ALPHA identifiers remain internal.
*/
(()=>{
'use strict';
if(window.__alphaInternalSidebarCleanup441)return;
window.__alphaInternalSidebarCleanup441=true;

function apply(){
  const sidebar=document.getElementById('alphaInternalSidebar');
  if(!sidebar)return;

  sidebar.querySelectorAll('button').forEach(btn=>{
    const text=String(btn.textContent||'').trim().toLocaleLowerCase('pt-PT');
    const action=String(btn.getAttribute('onclick')||'').toLocaleLowerCase('pt-PT');
    if(text==='spotify'||action.includes('alphaspotifyfooteraction')) btn.remove();
  });

  const brand=sidebar.querySelector('.alphaInternalBrand b');
  if(brand)brand.textContent='OLEN';

  const first=sidebar.querySelector('.alphaInternalNavList button');
  if(first){
    const leaf=[...first.querySelectorAll('*')].find(el=>el.children.length===0&&/^Alpha$/i.test(String(el.textContent||'').trim()));
    if(leaf)leaf.textContent='OLEN';
    else if(/^Alpha$/i.test(String(first.textContent||'').trim()))first.textContent='OLEN';
  }
}

apply();
window.addEventListener('pageshow',()=>requestAnimationFrame(apply),{passive:true});
document.addEventListener('click',e=>{
  if(e.target?.closest?.('[onclick*="alphaOpenInternalSidebar"],[onclick*="alphaToggleInternalSidebar"],.alphaInternalMenuBtn')) requestAnimationFrame(apply);
},true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
setTimeout(apply,100);

console.info('[OLEN 4.4.0] Internal sidebar public branding active');
})();
