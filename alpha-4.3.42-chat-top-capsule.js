/* ALPHA 4.3.42 · CHAT TOP CAPSULE
   Chat only:
   - removes Spotify from the top-right capsule
   - adds a three-dot action in its place
   - preserves the existing New conversation button
   Spotify elsewhere is untouched.
*/
(()=>{
'use strict';
if(window.__alphaChatTopCapsule442)return;
window.__alphaChatTopCapsule442=true;

const dotsIcon=()=>'<svg viewBox="0 0 24 24" aria-hidden="true" style="width:27px;height:27px;fill:currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>';
const isChat=()=>document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');

function apply(){
  if(!isChat())return;
  const cap=document.querySelector('#lifestyleAI .alphaChatActions4324');
  if(!cap)return;

  cap.querySelectorAll('.alphaChatSpotify4324,.alphaSpotifyToggle4324,[aria-label="Spotify Remote"]').forEach(el=>el.remove());

  let dots=cap.querySelector('.alphaChatMore442');
  if(!dots){
    dots=document.createElement('button');
    dots.type='button';
    dots.className='alphaChatMore442';
    dots.setAttribute('aria-label','Mais opções');
    dots.title='Mais opções';
    dots.innerHTML=dotsIcon();
    cap.prepend(dots);
  }

  const newChat=cap.querySelector('.alphaNewChatBtn');
  if(newChat&&dots.nextElementSibling!==newChat)cap.insertBefore(dots,newChat);
}

window.addEventListener('pageshow',()=>requestAnimationFrame(apply),{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(apply),true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
setTimeout(apply,100);
setTimeout(apply,500);

console.info('[ALPHA 4.3.42] Chat capsule: three dots + New conversation');
})();