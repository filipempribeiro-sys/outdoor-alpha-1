/* OLEN 4.4.0 · CHAT FULLSCREEN FIX
   Scope: Chat fullscreen only.
   Authoritative ownership:
   - hamburger/sidebar visibility
   - sidebar OLEN logo
   - top-right action capsule
   - long-press overlay stacking above sidebar
*/
(()=>{
'use strict';
if(window.__olenChatFullscreenSidebarHeaderFix440)return;
window.__olenChatFullscreenSidebarHeaderFix440=true;

const isChat=()=>document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode');
const setImp=(el,prop,val)=>el?.style?.setProperty(prop,val,'important');

const style=document.createElement('style');
style.id='olenChatFullscreenSidebarHeaderFix440Style';
style.textContent=`
body.alphaChatOlenOpen4330.alphaChatMode #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaComposeMode #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu{
  visibility:hidden!important;opacity:0!important;pointer-events:none!important
}
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenHead4330,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenHead4330{
  position:relative!important;z-index:5!important;padding-right:52px!important
}
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenSearch4330,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenSearch4330{
  position:absolute!important;top:0!important;right:0!important;margin:0!important;z-index:7!important
}
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenBrand4330,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenBrand4330{
  width:60px!important;height:60px!important;min-width:60px!important;visibility:visible!important;opacity:1!important;z-index:6!important;pointer-events:none!important
}
body.alphaChatMode .alphaChatOlenSidebar4330 .olenChatSidebarUiLogo440,
body.alphaComposeMode .alphaChatOlenSidebar4330 .olenChatSidebarUiLogo440{
  display:block!important;width:60px!important;height:60px!important;min-width:60px!important;object-fit:contain!important;margin:0!important;visibility:visible!important;opacity:1!important;pointer-events:none!important
}
.alphaChatConvActionScrim4330{
  position:fixed!important;inset:0!important;z-index:2147483000!important;pointer-events:auto!important
}
.alphaChatConvActionMenu4330{
  position:fixed!important;z-index:2147483001!important;pointer-events:auto!important
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324{
  width:126px!important;min-width:126px!important;max-width:126px!important;
  height:48px!important;min-height:48px!important;
  padding:0!important;margin-left:auto!important;gap:0!important;
  display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;
  overflow:hidden!important;border-radius:999px!important;
  background:#222325!important;border:1px solid rgba(255,255,255,.14)!important;box-shadow:none!important
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324>.alphaNewChatBtn,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324>.alphaNewChatBtn,
body.alphaChatMode #lifestyleAI .alphaChatActions4324>.alphaChatMore442,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324>.alphaChatMore442{
  position:static!important;inset:auto!important;transform:none!important;float:none!important;
  width:62px!important;min-width:62px!important;max-width:62px!important;
  height:46px!important;min-height:46px!important;flex:0 0 62px!important;
  margin:0!important;padding:0!important;display:grid!important;place-items:center!important;
  background:transparent!important;border:0!important;border-left:0!important;border-right:0!important;
  border-radius:0!important;box-shadow:none!important;outline:0!important;color:#fff!important
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324>.alphaNewChatBtn::before,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324>.alphaNewChatBtn::before,
body.alphaChatMode #lifestyleAI .alphaChatActions4324>.alphaNewChatBtn::after,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324>.alphaNewChatBtn::after,
body.alphaChatMode #lifestyleAI .alphaChatActions4324>.alphaChatMore442::before,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324>.alphaChatMore442::before,
body.alphaChatMode #lifestyleAI .alphaChatActions4324>.alphaChatMore442::after,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324>.alphaChatMore442::after{
  display:none!important;content:none!important;border:0!important
}
body.alphaChatMode #lifestyleAI .alphaChatActions4324 svg,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324 svg{
  width:27px!important;height:27px!important;display:block!important
}
`;
document.head.appendChild(style);

const applySidebarLogo=()=>{
  const brand=document.querySelector('.alphaChatOlenSidebar4330 .alphaChatOlenBrand4330');
  if(!brand)return;
  let logo=brand.querySelector('.olenChatSidebarUiLogo440');
  if(!logo){
    logo=document.createElement('img');
    logo.className='olenChatSidebarUiLogo440';
    logo.src='assets/olen-ui.png';
    logo.alt='OLEN';
    logo.width=60;
    logo.height=60;
    brand.replaceChildren(logo);
  }
};

const sidebarIsOpen=()=>{
  if(!isChat())return false;
  if(document.body.classList.contains('alphaChatOlenOpen4330'))return true;
  const side=document.querySelector('#aiChatMenu, .alphaConversationSidebar');
  return !!side&&(side.classList.contains('show')||side.getAttribute('aria-hidden')==='false');
};

const syncHamburger=()=>{
  const btn=document.querySelector('#lifestyleAI .aiChatMenuBtn.alphaFloatingMenu');
  if(!btn)return;
  if(sidebarIsOpen()){
    setImp(btn,'visibility','hidden');
    setImp(btn,'opacity','0');
    setImp(btn,'pointer-events','none');
    btn.dataset.olenSidebarHidden='1';
  }else if(btn.dataset.olenSidebarHidden==='1'){
    btn.style.removeProperty('visibility');
    btn.style.removeProperty('opacity');
    btn.style.removeProperty('pointer-events');
    delete btn.dataset.olenSidebarHidden;
  }
};

const composeSvg='<svg class="olenComposeIcon440" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 3.5H4.75A2.75 2.75 0 0 0 2 6.25v13A2.75 2.75 0 0 0 4.75 22h13A2.75 2.75 0 0 0 20.5 19.25V18"/><path d="M8 16l1.2-4.4 8.45-8.45a2.15 2.15 0 0 1 3.05 3.05l-8.45 8.45L8 16Z"/><path d="m15.9 4.9 3.2 3.2"/></svg>';
const dotsSvg='<svg class="olenMoreIcon440" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>';

const bindMore=more=>{
  if(!more||more.dataset.olenMoreBound440==='1')return;
  more.dataset.olenMoreBound440='1';
  more.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    const native=document.querySelector('.alphaChatMoreBtn,[data-alpha-chat-more],button[aria-label="Mais opções" i]:not(.alphaChatMore442),button[title="Mais opções" i]:not(.alphaChatMore442)');
    if(native)native.click();
  });
};

const syncCapsule=()=>{
  if(!isChat())return;
  const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');
  if(!bar)return;

  let cap=bar.querySelector('.alphaChatActions4324');
  const newChat=cap?.querySelector('.alphaNewChatBtn')||bar.querySelector('.alphaNewChatBtn');
  if(!newChat)return;

  if(!cap){
    cap=document.createElement('div');
    cap.className='alphaChatActions4324';
    bar.appendChild(cap);
  }

  cap.querySelectorAll('.alphaChatSpotify4324,.alphaSpotifyToggle4324,[aria-label="Spotify Remote"],[title="Spotify"]').forEach(el=>el.remove());

  newChat.setAttribute('aria-label','Nova conversa');
  newChat.title='Nova conversa';
  if(!newChat.querySelector('.olenComposeIcon440'))newChat.innerHTML=composeSvg;

  const existingMore=[...bar.querySelectorAll('.alphaChatMore442')];
  let more=existingMore[0]||null;
  existingMore.slice(1).forEach(el=>el.remove());
  if(!more){
    more=document.createElement('button');
    more.type='button';
    more.className='alphaChatMore442';
    more.setAttribute('aria-label','Mais opções');
    more.title='Mais opções';
  }
  if(!more.querySelector('.olenMoreIcon440'))more.innerHTML=dotsSvg;
  bindMore(more);

  cap.replaceChildren(newChat,more);

  [newChat,more].forEach(btn=>{
    [['position','static'],['inset','auto'],['transform','none'],['float','none'],['width','62px'],['min-width','62px'],['max-width','62px'],['height','46px'],['min-height','46px'],['flex','0 0 62px'],['margin','0'],['padding','0'],['display','grid'],['place-items','center'],['background','transparent'],['border','0'],['border-left','0'],['border-right','0'],['border-radius','0'],['box-shadow','none'],['outline','0'],['color','#fff']].forEach(([p,v])=>setImp(btn,p,v));
  });

  const nsvg=newChat.querySelector('svg');
  if(nsvg){
    setImp(nsvg,'width','27px');setImp(nsvg,'height','27px');setImp(nsvg,'display','block');
    setImp(nsvg,'fill','none');setImp(nsvg,'stroke','currentColor');setImp(nsvg,'stroke-width','1.9');setImp(nsvg,'stroke-linecap','round');setImp(nsvg,'stroke-linejoin','round');
  }
  const msvg=more.querySelector('svg');
  if(msvg){
    setImp(msvg,'width','27px');setImp(msvg,'height','27px');setImp(msvg,'display','block');
    setImp(msvg,'fill','currentColor');setImp(msvg,'stroke','none');
  }
};

const syncAll=()=>{
  applySidebarLogo();
  syncHamburger();
  syncCapsule();
};

document.addEventListener('click',()=>requestAnimationFrame(syncAll),true);
document.addEventListener('touchend',()=>requestAnimationFrame(syncAll),{capture:true,passive:true});
window.addEventListener('pageshow',()=>requestAnimationFrame(syncAll),{passive:true});
window.addEventListener('popstate',()=>requestAnimationFrame(syncAll),{passive:true});

const wrapSidebarApi=()=>{
  ['alphaOpenChatOlenSidebar','alphaCloseChatOlenSidebar','alphaToggleChatOlenSidebar'].forEach(name=>{
    const fn=window[name];
    if(typeof fn!=='function'||fn.__olenHamburgerSync440)return;
    const wrapped=function(...args){
      const result=fn.apply(this,args);
      requestAnimationFrame(syncAll);
      return result;
    };
    wrapped.__olenHamburgerSync440=true;
    window[name]=wrapped;
  });
};

wrapSidebarApi();
setTimeout(()=>{wrapSidebarApi();syncAll();},0);
setTimeout(()=>{wrapSidebarApi();syncAll();},120);
setTimeout(syncAll,500);

console.info('[OLEN 4.4.0] Chat fullscreen authoritative capsule + long-press overlay active');
})();