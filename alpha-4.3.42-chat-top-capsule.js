/* ALPHA 4.3.42 · CHAT TOP CAPSULE
   Chat only:
   - removes Spotify from the top-right capsule
   - keeps New conversation on the left
   - keeps More (vertical dots) on the right
   - matches the compact single-pill reference, with no internal divider
   Spotify elsewhere is untouched.
*/
(()=>{
'use strict';
if(window.__alphaChatTopCapsule442)return;
window.__alphaChatTopCapsule442=true;

const dotsIcon=()=>'<svg viewBox="0 0 24 24" aria-hidden="true" style="width:27px;height:27px;fill:currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
const isChat=()=>document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');

function ensureStyle(){
  if(document.getElementById('alphaChatTopCapsule442Style'))return;
  const style=document.createElement('style');
  style.id='alphaChatTopCapsule442Style';
  style.textContent=`
body.alphaChatMode #lifestyleAI .alphaChatActions4324,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324{
  width:138px!important;
  min-width:138px!important;
  height:52px!important;
  padding:0!important;
  display:flex!important;
  flex-direction:row!important;
  align-items:center!important;
  justify-content:center!important;
  gap:0!important;
  overflow:hidden!important;
  border-radius:999px!important;
  background:#222325!important;
  border:1px solid rgba(255,255,255,.14)!important;
  box-shadow:none!important;
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn,
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442{
  width:69px!important;
  min-width:69px!important;
  height:52px!important;
  flex:0 0 69px!important;
  margin:0!important;
  padding:0!important;
  display:grid!important;
  place-items:center!important;
  background:transparent!important;
  border:0!important;
  border-left:0!important;
  border-right:0!important;
  border-radius:0!important;
  color:#fff!important;
  box-shadow:none!important;
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn{order:1!important}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442{order:2!important}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn::before,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn::before,
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442::before,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442::before{
  display:none!important;
  content:none!important;
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn svg,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn svg{
  width:27px!important;
  height:27px!important;
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442 svg,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442 svg{
  width:27px!important;
  height:27px!important;
}
`;
  document.head.appendChild(style);
}

function apply(){
  if(!isChat())return;
  ensureStyle();
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
  }

  const newChat=cap.querySelector('.alphaNewChatBtn');
  if(newChat){
    if(newChat.nextElementSibling!==dots)newChat.after(dots);
  }else if(!dots.isConnected){
    cap.appendChild(dots);
  }
}

window.addEventListener('pageshow',()=>requestAnimationFrame(apply),{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(apply),true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
setTimeout(apply,100);
setTimeout(apply,500);

console.info('[ALPHA 4.3.42] Chat capsule matched to compact reference');
})();