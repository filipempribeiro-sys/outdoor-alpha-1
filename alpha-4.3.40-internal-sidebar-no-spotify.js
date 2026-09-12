/* ALPHA 4.3.42 · INTERNAL SIDEBAR + CHAT CAPSULE
   Preserves the stable internal sidebar cleanup.
   Chat top-right capsule only:
   - New chat occupies Spotify's former left position
   - vertical three-dots menu occupies New chat's former right position
*/
(()=>{
'use strict';
if(window.__alphaInternalSidebarNoSpotify440)return;
window.__alphaInternalSidebarNoSpotify440=true;

function applyInternal(){
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

function isChat(){return document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode')}
function dotsIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:27px;height:27px;fill:currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>'}
function applyChatCapsule(){
  if(!isChat())return;
  const cap=document.querySelector('#lifestyleAI .alphaChatActions4324');
  if(!cap)return;
  cap.querySelectorAll('.alphaChatSpotify4324,.alphaSpotifyToggle4324,[aria-label="Spotify Remote"]').forEach(el=>el.remove());
  const newChat=cap.querySelector('.alphaNewChatBtn');
  if(!newChat)return;
  let dots=cap.querySelector('.alphaChatMore442');
  if(!dots){
    dots=document.createElement('button');
    dots.type='button';
    dots.className='alphaChatMore442';
    dots.setAttribute('aria-label','Mais opções');
    dots.title='Mais opções';
    dots.innerHTML=dotsIcon();
  }
  // Exact capsule order: New chat on the left, vertical ellipsis on the right.
  cap.replaceChildren(newChat,dots);
}
function apply(){applyInternal();applyChatCapsule()}

apply();
window.addEventListener('pageshow',()=>requestAnimationFrame(apply),{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(apply),true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
setTimeout(apply,100);
setTimeout(apply,500);

console.info('[ALPHA 4.3.42] Chat capsule: New chat left + vertical ellipsis right');
})();