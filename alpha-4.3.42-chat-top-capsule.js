/* ALPHA 4.3.42 · CHAT TOP CAPSULE
   Chat only:
   - compact single pill
   - no internal divider
   - new compose icon on the left
   - vertical More dots on the right
   Nothing else is changed.
*/
(()=>{
'use strict';
if(window.__alphaChatTopCapsule442)return;
window.__alphaChatTopCapsule442=true;

const isChat=()=>document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode');
const dotsIcon=()=>'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
const composeIcon=()=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.75H4.5A2.5 2.5 0 0 0 2 7.25v12A2.5 2.5 0 0 0 4.5 21h12a2.5 2.5 0 0 0 2.5-2.5V18"/><path d="M8 16l1.2-4.25L17.6 3.35a2.25 2.25 0 0 1 3.18 3.18l-8.4 8.4L8 16Z"/><path d="m15.9 5.05 3.05 3.05"/></svg>';

function ensureStyle(){
  if(document.getElementById('alphaChatTopCapsule442Style'))return;
  const style=document.createElement('style');
  style.id='alphaChatTopCapsule442Style';
  style.textContent=`
body.alphaChatMode #lifestyleAI .alphaChatActions4324,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324{
  width:126px!important;
  min-width:126px!important;
  max-width:126px!important;
  height:48px!important;
  min-height:48px!important;
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
  width:62px!important;
  min-width:62px!important;
  max-width:62px!important;
  height:46px!important;
  min-height:46px!important;
  flex:0 0 62px!important;
  margin:0!important;
  padding:0!important;
  display:grid!important;
  place-items:center!important;
  background:transparent!important;
  border:0!important;
  border-top:0!important;
  border-bottom:0!important;
  border-left:0!important;
  border-right:0!important;
  outline:0!important;
  border-radius:0!important;
  color:#fff!important;
  box-shadow:none!important;
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn::before,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn::before,
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn::after,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaNewChatBtn::after,
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442::before,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442::before,
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442::after,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442::after{
  display:none!important;
  content:none!important;
  border:0!important;
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 svg,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 svg{
  width:27px!important;
  height:27px!important;
  display:block!important;
  fill:none!important;
  stroke:currentColor!important;
  stroke-width:1.9!important;
  stroke-linecap:round!important;
  stroke-linejoin:round!important;
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442 svg,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 .alphaChatMore442 svg{
  fill:currentColor!important;
  stroke:none!important;
}
`;
  document.head.appendChild(style);
}

function forceStyle(el,props){for(const [k,v] of Object.entries(props))el.style.setProperty(k,v,'important')}

function apply(){
  if(!isChat())return;
  ensureStyle();
  const cap=document.querySelector('#lifestyleAI .alphaChatActions4324');
  if(!cap)return;

  cap.querySelectorAll('.alphaChatSpotify4324,.alphaSpotifyToggle4324,[aria-label="Spotify Remote"]').forEach(el=>el.remove());

  const newChat=cap.querySelector('.alphaNewChatBtn')||cap.querySelector('button:not(.alphaChatMore442)')||cap.querySelector('button');
  if(newChat){
    newChat.setAttribute('aria-label','Nova conversa');
    newChat.title='Nova conversa';
    newChat.replaceChildren();
    newChat.innerHTML=composeIcon();
    newChat.dataset.olenComposeIcon='1';
  }

  let dots=cap.querySelector('.alphaChatMore442');
  if(!dots||dots===newChat){
    if(dots===newChat)dots.classList.remove('alphaChatMore442');
    dots=document.createElement('button');
    dots.type='button';
    dots.className='alphaChatMore442';
    dots.setAttribute('aria-label','Mais opções');
    dots.title='Mais opções';
    dots.innerHTML=dotsIcon();
  }
  if(newChat){
    if(newChat.nextElementSibling!==dots)newChat.after(dots);
  }else if(!dots.isConnected){
    cap.appendChild(dots);
  }

  forceStyle(cap,{
    width:'126px','min-width':'126px','max-width':'126px',height:'48px','min-height':'48px',padding:'0',gap:'0',overflow:'hidden','border-radius':'999px',background:'#222325',border:'1px solid rgba(255,255,255,.14)','box-shadow':'none'
  });
  [newChat,dots].filter(Boolean).forEach(btn=>forceStyle(btn,{
    width:'62px','min-width':'62px','max-width':'62px',height:'46px','min-height':'46px',flex:'0 0 62px',margin:'0',padding:'0',background:'transparent',border:'0','border-left':'0','border-right':'0','border-radius':'0','box-shadow':'none',outline:'0'
  }));
}

window.addEventListener('pageshow',()=>requestAnimationFrame(apply),{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(apply),true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
setTimeout(apply,100);
setTimeout(apply,500);

console.info('[ALPHA 4.3.42] Chat capsule compose icon restored');
})();