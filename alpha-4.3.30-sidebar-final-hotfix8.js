/* ALPHA 4.3.30 · OLEN SIDEBAR FINAL HOTFIX 8
   Objetivo: uma única sidebar, visual e funcionalmente idêntica em Home e Chat.
   - reutiliza o logo correto da sidebar/Home antiga e mostra OLEN
   - elimina diferenças Home vs Chat e esconde a shell legacy
   - mantém Imagens, Biblioteca, Projetos/Planos, Agendados, Afixados e Recentes
   - mantém pesquisa, footer, long-press, dados reais e navegação existentes
   - abre por swipe da margem esquerda no Chat fullscreen e fecha por swipe à esquerda
   - toque no scrim fecha; swipe vertical não é capturado
*/
(()=>{
'use strict';
const VERSION='4.3.30';
const META_KEY='alpha_olen_conversation_meta_v4330';
const EDGE=34;
const SWIPE_MIN=58;
const DOMINANCE=1.35;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICONS={
 search:svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>'),
 image:svg('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 3 3 3-4 5 6"/>'),
 library:svg('<path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z"/><path d="M7 8h12M9 4v16"/>'),
 project:svg('<path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>'),
 clock:svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
 pin:svg('<path d="m9 3 6 6-2 2 3 4-1 1-4-3-2 2-6-6 6-6Z"/><path d="m8 16-5 5"/>'),
 chat:svg('<path d="M21 11.5a8.5 8.5 0 0 1-9 8.4A9.8 9.8 0 0 1 7 18.5L3 20l1.5-4A8.5 8.5 0 1 1 21 11.5Z"/>')
};
function isChatFullscreen(){return !!document.body&&(document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode'))}
function sidebar(){return $('.alphaConversationSidebar')||document.getElementById('aiChatMenu')}
function loadMeta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch{return{}}}
function conversations(){try{if(typeof window.alphaConversations==='function'){const a=window.alphaConversations();return Array.isArray(a)?a:[]}}catch{}return[]}
function activeConversationId(){try{return String(window.alphaActiveConversationId?.()||'')}catch{return''}}
function ensureStyle(){
 if(document.getElementById('alphaSidebarFinal8Style'))return;
 const s=document.createElement('style');s.id='alphaSidebarFinal8Style';s.textContent=`
/* Uma única drawer física em todos os contextos. */
.alphaConversationSidebar{
 display:block!important;position:fixed!important;left:0!important;top:0!important;bottom:0!important;
 width:min(90vw,620px)!important;max-width:620px!important;height:100dvh!important;
 z-index:5000!important;overflow:hidden!important;isolation:isolate!important;
 transform:translate3d(-102%,0,0)!important;transition:transform .22s cubic-bezier(.2,.72,.2,1)!important;
 visibility:visible!important;pointer-events:none!important;will-change:transform!important;
}
.alphaConversationSidebar[aria-hidden="false"],.alphaConversationSidebar.alphaOlenUnifiedOpen{
 transform:translate3d(0,0,0)!important;pointer-events:auto!important;
}
.alphaConversationSidebar>.alphaOlenSidebar{display:flex!important}
.alphaConversationSidebar> :not(.alphaOlenSidebar){display:none!important}
#alphaInternalSidebar,#alphaInternalScrim{transform:translateX(-110%)!important;visibility:hidden!important;pointer-events:none!important}
#alphaOlenUnifiedScrim8{position:fixed;inset:0;z-index:4990;background:rgba(0,0,0,.34);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .18s ease,visibility 0s linear .18s}
body.alphaOlenUnifiedOpen8 #alphaOlenUnifiedScrim8{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .18s ease}
/* Cabeçalho final: exatamente o mesmo em Home e Chat. */
.alphaOlenHead{display:grid!important;grid-template-columns:auto 1fr auto!important;align-items:center!important;gap:12px!important;padding:0 4px 10px!important}
.alphaOlenHead .alphaOlenBrandLogo{width:44px!important;height:44px!important;min-width:44px!important;border-radius:13px!important;overflow:hidden!important;display:grid!important;place-items:center!important;position:relative!important}
.alphaOlenHead .alphaOlenBrandLogo .logo,.alphaOlenHead .alphaOlenBrandLogo .alphaSidebarLogo,.alphaOlenHead .alphaOlenBrandLogo img{width:44px!important;height:44px!important;min-width:44px!important;border-radius:13px!important;margin:0!important;padding:0!important;transform:none!important;object-fit:cover!important;object-position:50% 50%!important}
.alphaOlenHead .alphaOlenBrandLogoFallback{width:44px!important;height:44px!important;border-radius:13px!important;position:relative!important;background:conic-gradient(from 200deg,#39d69b,#68a8ff,#39d69b)!important}
.alphaOlenHead .alphaOlenBrandLogoFallback:after{content:'▲'!important;position:absolute!important;inset:0!important;display:grid!important;place-items:center!important;color:#061014!important;font-weight:900!important}
.alphaOlenName{font-size:25px!important;font-weight:900!important;letter-spacing:.04em!important;min-width:0!important}
.alphaOlenSearch{width:44px!important;height:44px!important;display:grid!important;place-items:center!important;visibility:visible!important;opacity:1!important}
body.alphaOlenUnifiedOpen8 #alphaInternalMenuBtn,body.alphaOlenUnifiedOpen8 .aiChatMenuBtn,body.alphaOlenUnifiedOpen8 #aiChatMenuBtn,body.alphaOlenUnifiedOpen8 button[aria-label="Abrir conversas"],body.alphaOlenUnifiedOpen8 button[aria-label="Abrir navegação"]{opacity:0!important;pointer-events:none!important}
body.alphaOlenUnifiedOpen8 .alphaChatActions4324{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
@media(max-width:390px){.alphaConversationSidebar{width:92vw!important}.alphaOlenName{font-size:23px!important}}
@media(prefers-reduced-motion:reduce){.alphaConversationSidebar,#alphaOlenUnifiedScrim8{transition:none!important}}
`;
 document.head.append(s)
}
function legacyLogoClone(side){
 const selectors=['.alphaSidebarBrand .alphaSidebarLogo.logo','.alphaSidebarBrand .logo','.top .brand .logo','.brand .logo','.logo'];
 for(const sel of selectors){for(const el of $$(sel)){if(el.closest('.alphaOlenSidebar'))continue;if(side&&!side.contains(el)&&sel.startsWith('.alphaSidebar'))continue;const c=el.cloneNode(true);c.removeAttribute('id');c.removeAttribute('style');return c}}
 return null
}
function legacyConversationButtons(side){
 if(!side)return[];
 const preferred=[...side.querySelectorAll('.alphaSidebarConversation')].filter(x=>!x.closest('.alphaOlenSidebar'));
 if(preferred.length)return preferred;
 return [...side.querySelectorAll('button,a,[role="button"]')].filter(el=>{if(el.closest('.alphaOlenSidebar'))return false;const t=(el.textContent||'').trim();if(!t||t.length>140)return false;if(/nova conversa|pesquisar|spotify|premium|perfil|mapa|live|calend|home|alpha|olen/i.test(t))return false;return true})
}
function createShell(side){
 const shell=document.createElement('div');shell.className='alphaOlenSidebar';
 shell.innerHTML=`<div class="alphaOlenHead"><div class="alphaOlenBrandLogo"></div><div class="alphaOlenName">OLEN</div><button class="alphaOlenSearch" type="button" aria-label="Pesquisar conversas">${ICONS.search}</button></div><div class="alphaOlenSearchBox"><input type="search" placeholder="Pesquisar conversas" autocomplete="off"></div><div class="alphaOlenNav"><button class="alphaOlenItem" data-kind="images">${ICONS.image}<span>Imagens</span></button><button class="alphaOlenItem" data-kind="library">${ICONS.library}<span>Biblioteca</span></button><button class="alphaOlenItem" data-kind="projects">${ICONS.project}<span>Projetos / Planos</span></button><button class="alphaOlenItem" data-kind="scheduled">${ICONS.clock}<span>Agendados</span></button><button class="alphaOlenItem" data-kind="pinned">${ICONS.pin}<span>Afixados</span></button></div><div class="alphaOlenSep"></div><div class="alphaOlenRecentTitle">Recentes</div><div class="alphaOlenRecents"></div><button class="alphaOlenMore" type="button">Ver todas</button><div class="alphaOlenBottom"><div class="alphaSidebarDock"></div></div>`;
 side.append(shell);return shell
}
function normalizeBrand(shell,side){
 const head=shell.querySelector('.alphaOlenHead');if(!head)return;
 let holder=head.querySelector('.alphaOlenBrandLogo');
 if(!holder){holder=document.createElement('div');holder.className='alphaOlenBrandLogo';head.prepend(holder)}
 const source=legacyLogoClone(side);
 if(source){const current=holder.firstElementChild;const sig=(source.className||'')+'|'+source.tagName;if(!current||holder.dataset.logoSig!==sig){holder.replaceChildren(source);holder.dataset.logoSig=sig}}
 else if(!holder.firstElementChild)holder.innerHTML='<span class="logo alphaOlenBrandLogoFallback" aria-hidden="true"></span>';
 let name=head.querySelector('.alphaOlenName');if(!name){name=document.createElement('div');name.className='alphaOlenName';holder.after(name)}name.textContent='OLEN';
 let search=head.querySelector('.alphaOlenSearch');if(!search){search=document.createElement('button');search.type='button';search.className='alphaOlenSearch';search.setAttribute('aria-label','Pesquisar conversas');search.innerHTML=ICONS.search;head.append(search)}
}
function bindSearch(shell){
 const btn=shell.querySelector('.alphaOlenSearch'),box=shell.querySelector('.alphaOlenSearchBox'),input=box?.querySelector('input');if(!btn||!box||!input)return;
 if(!btn.dataset.final8){btn.dataset.final8='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();box.classList.toggle('show');if(box.classList.contains('show'))setTimeout(()=>input.focus(),20)})}
 if(!input.dataset.final8){input.dataset.final8='1';input.addEventListener('input',()=>applySearch(shell,input.value))}
}
function applySearch(shell,value){const q=String(value||'').trim().toLocaleLowerCase('pt-PT');shell.querySelectorAll('.alphaOlenRecent').forEach(r=>{r.hidden=!!q&&!String(r.textContent||'').toLocaleLowerCase('pt-PT').includes(q)});const more=shell.querySelector('.alphaOlenMore');if(more&&q)more.hidden=true}
function refreshRecents(shell,side){
 const rec=shell.querySelector('.alphaOlenRecents');if(!rec)return;
 const pin=shell.querySelector('.alphaPinnedList4330');
 [...rec.querySelectorAll('.alphaOlenRecent'),...(pin?[...pin.querySelectorAll('.alphaOlenRecent')]:[])].forEach(x=>x.remove());
 const meta=loadMeta(),active=activeConversationId(),cs=conversations(),legacy=legacyConversationButtons(side);
 const rows=cs.length?cs.map((c,i)=>({id:String(c?.id||''),title:String(c?.title||'Nova experiência').trim(),orig:legacy[i]||null,index:i})):legacy.map((orig,i)=>({id:'',title:String(orig.textContent||'Conversa').trim().replace(/\s+/g,' '),orig,index:i}));
 let visibleCount=0;
 rows.slice(0,40).forEach(r=>{if(!r.title)return;const key=r.title.slice(0,160),m=meta[key]||{};if(m.deleted)return;const b=document.createElement('button');b.type='button';b.className='alphaOlenRecent';b.dataset.alphaConvKey=key;b.dataset.alphaOriginalIndex=String(r.index);if(m.pinned)b.classList.add('alphaPinned4330');b.innerHTML=ICONS.chat+'<span class="alphaOlenRecentText"></span>';b.querySelector('.alphaOlenRecentText').textContent=m.name||r.title;if(r.id&&r.id===active)b.classList.add('active');b.addEventListener('click',e=>{if(e.defaultPrevented)return;closeSidebar();if(r.id&&typeof window.alphaOpenConversation==='function')window.alphaOpenConversation(r.id);else r.orig?.click?.()});rec.append(b);visibleCount++});
 const more=shell.querySelector('.alphaOlenMore');if(more){more.hidden=visibleCount<=8;more.textContent='Ver todas';let expanded=false;if(!more.dataset.final8){more.dataset.final8='1';more.addEventListener('click',()=>{expanded=!expanded;shell.querySelectorAll('.alphaOlenRecents>.alphaOlenRecent').forEach((b,i)=>b.hidden=!expanded&&i>=8);more.textContent=expanded?'Mostrar menos':'Ver todas'})}shell.querySelectorAll('.alphaOlenRecents>.alphaOlenRecent').forEach((b,i)=>b.hidden=i>=8)}
}
function ensureScrim(){let s=document.getElementById('alphaOlenUnifiedScrim8');if(!s){s=document.createElement('div');s.id='alphaOlenUnifiedScrim8';s.setAttribute('aria-hidden','true');s.addEventListener('click',e=>{e.preventDefault();closeSidebar()});document.body.append(s)}return s}
function ensureShell(){
 ensureStyle();const side=sidebar();if(!side)return null;
 let shells=[...side.querySelectorAll(':scope > .alphaOlenSidebar')];let shell=shells.shift();shells.forEach(x=>x.remove());if(!shell)shell=createShell(side);
 [...side.children].forEach(n=>{if(n!==shell)n.style.setProperty('display','none','important')});
 normalizeBrand(shell,side);bindSearch(shell);ensureScrim();return shell
}
function isOpen(){const s=sidebar();return !!s&&s.getAttribute('aria-hidden')==='false'&&s.classList.contains('alphaOlenUnifiedOpen')}
function syncBody(open){document.body?.classList.toggle('alphaOlenUnifiedOpen8',!!open);document.body?.classList.toggle('alphaSidebarOpen4330',!!open);const scr=ensureScrim();scr.setAttribute('aria-hidden',open?'false':'true')}
function openSidebar(){
 const side=sidebar();if(!side)return;const shell=ensureShell();if(!shell)return;
 try{window.alphaRenderChatSidebar?.('')}catch{}
 refreshRecents(shell,side);
 document.getElementById('alphaInternalSidebar')?.classList.remove('show');document.getElementById('alphaInternalScrim')?.classList.remove('show');
 side.hidden=false;side.setAttribute('aria-hidden','false');side.classList.add('show','alphaOlenUnifiedOpen');syncBody(true);
 requestAnimationFrame(()=>{normalizeBrand(shell,side);refreshRecents(shell,side)});
}
function closeSidebar(){const side=sidebar();if(!side)return;side.setAttribute('aria-hidden','true');side.classList.remove('show','alphaOlenUnifiedOpen');syncBody(false);const box=side.querySelector('.alphaOlenSearchBox');box?.classList.remove('show')}
function toggleSidebar(){isOpen()?closeSidebar():openSidebar()}
function installGlobals(){window.alphaOpenOlenSidebar=openSidebar;window.alphaCloseOlenSidebar=closeSidebar;window.alphaToggleOlenSidebar=toggleSidebar;window.alphaToggleChatMenu=e=>{e?.preventDefault?.();e?.stopPropagation?.();toggleSidebar()};window.alphaCloseChatMenu=closeSidebar;window.alphaToggleInternalSidebar=e=>{e?.preventDefault?.();e?.stopPropagation?.();toggleSidebar()};window.alphaCloseInternalSidebar=closeSidebar}
function interceptMenuButtons(){if(document.documentElement.dataset.alphaSidebarFinal8Intercept)return;document.documentElement.dataset.alphaSidebarFinal8Intercept='1';document.addEventListener('click',e=>{const b=e.target?.closest?.('#aiChatMenuBtn,.aiChatMenuBtn,#alphaInternalMenuBtn,button[aria-label="Abrir conversas"],button[aria-label="Abrir navegação"]');if(!b)return;if(b.closest('.alphaOlenSidebar'))return;e.preventDefault();e.stopImmediatePropagation();toggleSidebar()},true)}
let gesture=null;
function resetGesture(){gesture=null}
function onPointerDown(e){if(e.pointerType==='mouse'&&e.button!==0)return;const open=isOpen();if(open){const s=sidebar(),r=s?.getBoundingClientRect();if(!r||e.clientX>r.right+2)return;gesture={mode:'close',id:e.pointerId,x:e.clientX,y:e.clientY,locked:false};return}if(!isChatFullscreen()||e.clientX>EDGE)return;gesture={mode:'open',id:e.pointerId,x:e.clientX,y:e.clientY,locked:false}}
function onPointerMove(e){if(!gesture||e.pointerId!==gesture.id)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y,ax=Math.abs(dx),ay=Math.abs(dy);if(!gesture.locked){if(ax<10&&ay<10)return;if(ay>ax){resetGesture();return}if(ax>ay*DOMINANCE)gesture.locked=true}if(gesture.locked)e.preventDefault()}
function onPointerUp(e){if(!gesture||e.pointerId!==gesture.id)return;const g=gesture;resetGesture();const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.abs(dx)<SWIPE_MIN||Math.abs(dx)<=Math.abs(dy)*DOMINANCE)return;if(g.mode==='open'&&dx>0)openSidebar();if(g.mode==='close'&&dx<0)closeSidebar()}
function installSwipe(){if(document.documentElement.dataset.alphaSidebarFinal8Swipe)return;document.documentElement.dataset.alphaSidebarFinal8Swipe='1';document.addEventListener('pointerdown',onPointerDown,{capture:true,passive:true});document.addEventListener('pointermove',onPointerMove,{capture:true,passive:false});document.addEventListener('pointerup',onPointerUp,{capture:true,passive:true});document.addEventListener('pointercancel',resetGesture,{capture:true,passive:true})}
function reconcile(){ensureStyle();installGlobals();interceptMenuButtons();installSwipe();const side=sidebar();if(!side)return;side.hidden=false;if(!side.hasAttribute('aria-hidden'))side.setAttribute('aria-hidden','true');if(isOpen()){const shell=ensureShell();if(shell)normalizeBrand(shell,side)}else syncBody(false)}
new MutationObserver(()=>requestAnimationFrame(reconcile)).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-hidden']});['pageshow','focus','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(reconcile,40),{passive:true}));setTimeout(reconcile,40);setTimeout(reconcile,250);setTimeout(reconcile,900);console.info('[ALPHA '+VERSION+'] OLEN sidebar final hotfix8 ativo');
})();
