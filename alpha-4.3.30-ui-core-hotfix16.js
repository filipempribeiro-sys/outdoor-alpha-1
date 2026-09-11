/* ALPHA 4.3.30 · UI CORE HOTFIX 16
   Consolida interações críticas do Chat/OLEN sem polling:
   - impede os observers globais pesados dos patches antigos de arrancarem
   - impede o setInterval(reconcile,700) legado
   - ⋮ da cápsula tem um único menu funcional
   - lupa OLEN abre/fecha pesquisa de forma idêntica em Home e Chat
   - swipe horizontal com sidebar aberta fecha-a de forma robusta
   Carregado ANTES dos patches Chat antigos para ganhar a delegação capture-phase.
*/
(()=>{
'use strict';

/* ---------------------------------------------------------
   PERFORMANCE GUARD
   Os patches antigos chat-shell/hotfix4 registavam observers sobre
   document.documentElement + subtree + attributes e hotfix4 ainda fazia
   reconcile a cada 700 ms. Intercetamos apenas esses padrões conhecidos
   durante o carregamento síncrono dos patches e restauramos logo a seguir.
   --------------------------------------------------------- */
const NativeMO=window.MutationObserver;
const nativeSetInterval=window.setInterval.bind(window);
if(NativeMO){
  window.MutationObserver=class AlphaLeanMutationObserver{
    constructor(cb){
      this.cb=cb;
      this.native=new NativeMO(cb);
    }
    observe(target,opts){
      const src=String(this.cb||'');
      const heavy=target===document.documentElement&&!!opts?.subtree&&!!opts?.attributes&&/reconcile/.test(src);
      if(heavy)return;
      return this.native.observe(target,opts);
    }
    disconnect(){return this.native.disconnect()}
    takeRecords(){return this.native.takeRecords()}
  };
}
window.setInterval=function alphaLeanSetInterval(cb,delay,...args){
  const legacy=Number(delay)===700&&(cb?.name==='reconcile'||/reconcile/.test(String(cb||'')));
  if(legacy)return -433016;
  return nativeSetInterval(cb,delay,...args);
};
setTimeout(()=>{
  if(NativeMO)window.MutationObserver=NativeMO;
  window.setInterval=nativeSetInterval;
},0);

const $=s=>document.querySelector(s);
const isChat=()=>document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode');
const sidebar=()=>$('#aiChatMenu')||$('.alphaConversationSidebar');
function sidebarVisible(){
  const s=sidebar();if(!s)return false;
  const cs=getComputedStyle(s),r=s.getBoundingClientRect();
  return !s.hidden&&s.getAttribute('aria-hidden')!=='true'&&cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>40&&r.height>80;
}
function closeSidebar(){
  try{if(typeof window.alphaCloseOlenSidebar==='function'){window.alphaCloseOlenSidebar();return}}catch{}
  try{if(typeof window.alphaCloseChatMenu==='function')window.alphaCloseChatMenu()}catch{}
  const s=sidebar();if(s){s.setAttribute('aria-hidden','true');s.classList.remove('show')}
  document.body?.classList.remove('alphaSidebarOpen4330','alphaOlenFunctionalOpen10');
}
function openSidebar(){
  try{if(typeof window.alphaOpenOlenSidebar==='function'){window.alphaOpenOlenSidebar();return}}catch{}
  const b=$('#alphaInternalMenuBtn,.aiChatMenuBtn,#aiChatMenuBtn,button[aria-label="Abrir conversas"],button[aria-label="Abrir navegação"]');
  if(b){b.click();return}
  const s=sidebar();if(s){s.hidden=false;s.setAttribute('aria-hidden','false');s.classList.add('show')}
}

/* ---------------------------------------------------------
   CHAT OVERFLOW MENU — owner único
   --------------------------------------------------------- */
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON={
 info:svg('<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>'),
 share:svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.1M8.7 13.3l6.6 4.1"/>'),
 chats:svg('<path d="M21 11.5a8.5 8.5 0 0 1-9 8.4A9.8 9.8 0 0 1 7 18.5L3 20l1.5-4A8.5 8.5 0 1 1 21 11.5Z"/>'),
 home:svg('<path d="m3 11 9-8 9 8v9h-6v-6H9v6H3v-9Z"/>')
};
function style(){
  if($('#alphaUiCore16Style'))return;
  const s=document.createElement('style');s.id='alphaUiCore16Style';s.textContent=`
.alphaOlenSearchBox.show{display:block!important;visibility:visible!important;opacity:1!important}
.alphaCoreMenuScrim16{position:fixed;inset:0;z-index:9998;background:transparent}
.alphaCoreMenu16{position:fixed;z-index:9999;right:14px;top:calc(env(safe-area-inset-top) + 76px);width:min(300px,calc(100vw - 28px));padding:8px;background:rgba(31,31,33,.985);border:1px solid rgba(255,255,255,.14);border-radius:22px;box-shadow:0 20px 55px rgba(0,0,0,.5);backdrop-filter:blur(18px)}
.alphaCoreMenu16 button{width:100%;height:52px;border:0;background:transparent;color:#f5f7f6;border-radius:14px;display:flex;align-items:center;gap:14px;padding:0 15px;font:700 15px system-ui;text-align:left}
.alphaCoreMenu16 button:active{background:rgba(255,255,255,.08)}
.alphaCoreMenu16 svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
`;document.head.append(s);
}
function closeMenu(){$('.alphaCoreMenu16')?.remove();$('.alphaCoreMenuScrim16')?.remove()}
function openMenu(){
  closeMenu();style();
  const scr=document.createElement('div');scr.className='alphaCoreMenuScrim16';scr.addEventListener('click',closeMenu);document.body.append(scr);
  const m=document.createElement('div');m.className='alphaCoreMenu16';
  m.innerHTML=`<button data-a="status">${ICON.info}<span>Estado da ALPHA</span></button><button data-a="share">${ICON.share}<span>Partilhar</span></button><button data-a="chats">${ICON.chats}<span>Conversas</span></button><button data-a="home">${ICON.home}<span>Home</span></button>`;
  m.addEventListener('click',async e=>{
    const b=e.target.closest('button[data-a]');if(!b)return;
    const a=b.dataset.a;closeMenu();
    if(a==='chats'){openSidebar();return}
    if(a==='home'){if(typeof window.go==='function')window.go('home');else window.alphaInternalNavigate?.('home');return}
    if(a==='share'){try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else await navigator.clipboard?.writeText(location.href)}catch{}return}
    if(a==='status'){try{window.toast?.('ALPHA 4.3.30 · OLEN ativo')}catch{};return}
  });
  document.body.append(m);
}

/* ---------------------------------------------------------
   SIDEBAR SEARCH — mesma lógica em Home e Chat
   --------------------------------------------------------- */
function toggleSearch(btn){
  const sh=btn?.closest('.alphaOlenSidebar');if(!sh)return;
  const box=sh.querySelector('.alphaOlenSearchBox'),input=box?.querySelector('input');if(!box||!input)return;
  const opening=!box.classList.contains('show');
  box.classList.toggle('show',opening);
  btn.setAttribute('aria-expanded',opening?'true':'false');
  if(opening){box.style.setProperty('display','block','important');requestAnimationFrame(()=>input.focus())}
  else{box.style.removeProperty('display');input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))}
}

/* Registado antes dos hotfixes antigos: este listener é o owner das ações. */
document.addEventListener('click',e=>{
  const more=e.target?.closest?.('.alphaChatActions4324 .alphaChatMore4330,.alphaChatMore4330');
  if(more&&isChat()){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openMenu();return;
  }
  const search=e.target?.closest?.('.alphaOlenSidebar .alphaOlenSearch');
  if(search){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();toggleSearch(search);return;
  }
},true);

/* ---------------------------------------------------------
   SWIPE CLOSE — ao abrir, qualquer swipe horizontal deliberado para
   fora da sidebar fecha. Não interfere quando a sidebar está fechada.
   --------------------------------------------------------- */
let gesture=null;
document.addEventListener('touchstart',e=>{
  if(e.touches?.length!==1||!sidebarVisible())return;
  const t=e.touches[0],s=sidebar(),r=s?.getBoundingClientRect();
  if(!r)return;
  const inside=t.clientX>=r.left-2&&t.clientX<=r.right+2;
  const onScrim=!!e.target?.closest?.('#alphaOlenFunctionalScrim10');
  if(inside||onScrim)gesture={x:t.clientX,y:t.clientY};
},{passive:true,capture:true});
document.addEventListener('touchend',e=>{
  if(!gesture)return;const g=gesture;gesture=null;
  const t=e.changedTouches?.[0];if(!t)return;
  const dx=t.clientX-g.x,dy=t.clientY-g.y;
  if(Math.abs(dx)>=52&&Math.abs(dx)>Math.abs(dy)*1.15){closeSidebar()}
},{passive:true,capture:true});

style();
console.info('[ALPHA 4.3.30] UI core hotfix16 ativo');
})();
