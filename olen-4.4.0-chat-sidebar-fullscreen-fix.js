/* OLEN 4.4.0 · CHAT FULLSCREEN FIX
   Scope: Chat fullscreen only.
   Authoritative ownership:
   - hamburger/sidebar visibility
   - sidebar OLEN logo
   - independent top-right OLEN capsule
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

/* Legacy capsule remains in DOM only for rollback/reference; it is no longer the visual owner. */
body.alphaChatMode #lifestyleAI .alphaChatActions4324,
body.alphaComposeMode #lifestyleAI .alphaChatActions4324{
  display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important
}

body.alphaChatMode #lifestyleAI .olenChatCapsule440,
body.alphaComposeMode #lifestyleAI .olenChatCapsule440{
  margin-left:auto!important;
  width:126px!important;min-width:126px!important;max-width:126px!important;
  height:48px!important;min-height:48px!important;
  padding:0!important;gap:0!important;
  display:flex!important;align-items:center!important;justify-content:center!important;
  overflow:hidden!important;border-radius:999px!important;
  background:#222325!important;border:1px solid rgba(255,255,255,.14)!important;
  box-shadow:none!important;position:relative!important;z-index:45!important
}
body.alphaChatMode #lifestyleAI .olenChatCapsule440>button,
body.alphaComposeMode #lifestyleAI .olenChatCapsule440>button{
  position:static!important;inset:auto!important;transform:none!important;float:none!important;
  width:62px!important;min-width:62px!important;max-width:62px!important;
  height:46px!important;min-height:46px!important;flex:0 0 62px!important;
  margin:0!important;padding:0!important;display:grid!important;place-items:center!important;
  background:transparent!important;border:0!important;border-radius:0!important;
  box-shadow:none!important;outline:0!important;color:#fff!important
}
body.alphaChatMode #lifestyleAI .olenChatCapsule440>button:active,
body.alphaComposeMode #lifestyleAI .olenChatCapsule440>button:active{
  background:rgba(255,255,255,.055)!important
}
body.alphaChatMode #lifestyleAI .olenChatCapsule440 svg,
body.alphaComposeMode #lifestyleAI .olenChatCapsule440 svg{
  width:27px!important;height:27px!important;display:block!important
}
body.alphaChatMode #lifestyleAI .olenChatCompose440 svg,
body.alphaComposeMode #lifestyleAI .olenChatCompose440 svg{
  fill:none!important;stroke:currentColor!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important
}
body.alphaChatMode #lifestyleAI .olenChatMore440 svg,
body.alphaComposeMode #lifestyleAI .olenChatMore440 svg{
  fill:currentColor!important;stroke:none!important
}

.olenChatMoreScrim440{
  position:fixed;inset:0;z-index:2147483010;background:transparent
}
.olenChatMoreMenu440{
  position:fixed;z-index:2147483011;
  min-width:220px;max-width:calc(100vw - 28px);
  padding:8px;border-radius:20px;
  background:rgba(31,31,33,.985);
  border:1px solid rgba(255,255,255,.13);
  box-shadow:0 18px 50px rgba(0,0,0,.45);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  color:#f7f7f7
}
.olenChatMoreMenu440 .olenChatMoreTitle440{
  min-height:44px;display:flex;align-items:center;padding:0 14px;
  font:700 15px/1.2 system-ui,-apple-system,sans-serif;color:#dce7e3
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

const composeSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 3.5H4.75A2.75 2.75 0 0 0 2 6.25v13A2.75 2.75 0 0 0 4.75 22h13A2.75 2.75 0 0 0 20.5 19.25V18"/><path d="M8 16l1.2-4.4 8.45-8.45a2.15 2.15 0 0 1 3.05 3.05l-8.45 8.45L8 16Z"/><path d="m15.9 4.9 3.2 3.2"/></svg>';
const dotsSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>';

const closeOwnMoreMenu=()=>{
  document.querySelector('.olenChatMoreMenu440')?.remove();
  document.querySelector('.olenChatMoreScrim440')?.remove();
};

const openOwnMoreMenu=anchor=>{
  closeOwnMoreMenu();
  const scrim=document.createElement('div');
  scrim.className='olenChatMoreScrim440';
  scrim.addEventListener('click',closeOwnMoreMenu,{once:true});
  document.body.appendChild(scrim);

  const menu=document.createElement('div');
  menu.className='olenChatMoreMenu440';
  menu.setAttribute('role','menu');
  menu.innerHTML='<div class="olenChatMoreTitle440">Mais opções</div>';
  document.body.appendChild(menu);

  const r=anchor.getBoundingClientRect();
  const w=Math.min(260,innerWidth-28);
  menu.style.width=w+'px';
  const left=Math.max(14,Math.min(r.right-w,innerWidth-w-14));
  const top=Math.min(innerHeight-menu.offsetHeight-14,r.bottom+10);
  menu.style.left=left+'px';
  menu.style.top=Math.max(14,top)+'px';
};

const ensureOwnCapsule=()=>{
  const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');
  if(!bar)return null;

  let cap=bar.querySelector('.olenChatCapsule440');
  if(!cap){
    cap=document.createElement('div');
    cap.className='olenChatCapsule440';
    cap.setAttribute('aria-label','Ações do Chat');

    const compose=document.createElement('button');
    compose.type='button';
    compose.className='olenChatCompose440';
    compose.setAttribute('aria-label','Nova conversa');
    compose.title='Nova conversa';
    compose.innerHTML=composeSvg;
    compose.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      closeOwnMoreMenu();
      if(typeof window.alphaStartFreshConversation==='function'){
        window.alphaStartFreshConversation({focus:true,compose:true});
      }else{
        document.querySelector('#lifestyleAI .alphaNewChatBtn')?.click();
      }
    });

    const more=document.createElement('button');
    more.type='button';
    more.className='olenChatMore440';
    more.setAttribute('aria-label','Mais opções');
    more.title='Mais opções';
    more.innerHTML=dotsSvg;
    more.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      const open=document.querySelector('.olenChatMoreMenu440');
      if(open)closeOwnMoreMenu();
      else openOwnMoreMenu(more);
    });

    cap.append(compose,more);
    bar.appendChild(cap);
  }
  return cap;
};

const syncCapsule=()=>{
  if(!isChat()){
    closeOwnMoreMenu();
    document.querySelector('.olenChatCapsule440')?.remove();
    return;
  }
  ensureOwnCapsule();
};

const syncAll=()=>{
  applySidebarLogo();
  syncHamburger();
  syncCapsule();
};

document.addEventListener('click',()=>requestAnimationFrame(syncAll),true);
document.addEventListener('touchend',()=>requestAnimationFrame(syncAll),{capture:true,passive:true});
window.addEventListener('pageshow',()=>requestAnimationFrame(syncAll),{passive:true});
window.addEventListener('popstate',()=>{closeOwnMoreMenu();requestAnimationFrame(syncAll)},{passive:true});
window.addEventListener('pagehide',closeOwnMoreMenu,{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOwnMoreMenu()});

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

console.info('[OLEN 4.4.0] independent Chat capsule active');
})();