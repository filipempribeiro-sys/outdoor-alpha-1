/* ALPHA 4.3.42 · CHAT CAPSULE: MORE + NEW CHAT
   Chat only.
   Removes Spotify from the top-right Chat capsule and replaces that slot with a 3-dot More button.
   Existing New Chat button remains untouched.
*/
(()=>{
'use strict';
if(window.__alphaChatCapsuleMore442)return;
window.__alphaChatCapsuleMore442=true;

const isChat=()=>document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');

function moreIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:28px;height:28px;fill:currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>'}

function sync(){
 const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');
 if(!bar)return;
 const cap=bar.querySelector('.alphaChatActions4324');
 if(!cap||!isChat())return;
 cap.querySelectorAll('.alphaChatSpotify4324,.alphaSpotifyToggle4324').forEach(b=>b.remove());
 let more=cap.querySelector('.alphaChatMore442');
 if(!more){
   more=document.createElement('button');
   more.type='button';
   more.className='alphaChatMore442';
   more.setAttribute('aria-label','Mais opções');
   more.title='Mais opções';
   more.innerHTML=moreIcon();
   more.addEventListener('click',e=>{
     e.preventDefault();e.stopPropagation();
     const native=document.querySelector('.alphaChatMoreBtn,[data-alpha-chat-more],button[aria-label="Mais opções" i]:not(.alphaChatMore442),button[title="Mais opções" i]:not(.alphaChatMore442)');
     if(native)native.click();
   });
   cap.prepend(more);
 }
}

window.addEventListener('pageshow',()=>requestAnimationFrame(sync),{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(sync),true);
document.addEventListener('touchend',()=>requestAnimationFrame(sync),{passive:true,capture:true});
setTimeout(sync,120);setTimeout(sync,500);
console.info('[ALPHA 4.3.42] Chat capsule: Spotify removed; More button added');
})();