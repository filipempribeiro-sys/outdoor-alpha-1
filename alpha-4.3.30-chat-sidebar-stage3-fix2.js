/* ALPHA 4.3.30 · CHAT SIDEBAR STAGE 3.2 FIX
   Chat sidebar only.
   - hide the exact chat menu trigger while sidebar is open
   - restore long press actions on current stage3 recent rows
   Event-driven: no polling / no global MutationObserver.
*/
(()=>{
'use strict';
if(window.__alphaChatSidebarStage32Fix)return;window.__alphaChatSidebarStage32Fix=true;
const META_KEY='alpha_olen_conversation_meta_v4330',HOLD=520,MOVE=12;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON={pin:svg('<path d="m9 3 6 6-2 2 3 4-1 1-4-3-2 2-6-6 6-6Z"/><path d="m8 16-5 5"/>'),edit:svg('<path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>'),trash:svg('<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>')};
function meta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch{return{}}}
function save(m){try{localStorage.setItem(META_KEY,JSON.stringify(m))}catch{}}
function key(row){return row.dataset.convKey||row.dataset.alphaConvKey||row.querySelector('.alphaChatOlenRecentText4330')?.textContent?.trim().slice(0,160)||row.dataset.convId||'conversation'}
function style(){if($('#alphaChatSidebarStage32FixStyle'))return;const s=document.createElement('style');s.id='alphaChatSidebarStage32FixStyle';s.textContent=`
body.alphaChatOlenOpen4330 [data-alpha-chat-menu-trigger="1"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
body.alphaChatOlenOpen4330 #alphaInternalMenuBtn,body.alphaChatOlenOpen4330 .alphaInternalMenuBtn,body.alphaChatOlenOpen4330 .alphaChatMenuBtn,body.alphaChatOlenOpen4330 .alphaLifestyleMenuBtn{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
.alphaChatConvActionScrim4330{position:fixed;inset:0;z-index:9800;background:rgba(0,0,0,.14)}
.alphaChatConvActionMenu4330{position:fixed;z-index:9801;min-width:220px;max-width:calc(100vw - 28px);background:rgba(31,31,33,.985);border:1px solid rgba(255,255,255,.13);border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:8px;backdrop-filter:blur(18px)}
.alphaChatConvActionMenu4330 button{width:100%;height:54px;border:0;background:transparent;color:#f7f7f7;display:flex;align-items:center;gap:14px;padding:0 16px;border-radius:14px;text-align:left;font:700 16px/1.2 system-ui}
.alphaChatConvActionMenu4330 button:active{background:rgba(255,255,255,.08)}.alphaChatConvActionMenu4330 svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.alphaChatConvActionMenu4330 .danger{color:#ff858c}
.alphaChatOlenRecent4330.alphaPinned4330 .alphaChatOlenRecentText4330:after{content:' • Afixada';font-size:11px;color:#7adfb9;font-weight:700}
`;document.head.appendChild(s)}
function markTrigger(t){const b=t?.closest?.('button,.aiChatMenuBtn,#aiChatMenuBtn,#alphaChatMenuBtn,#alphaInternalMenuBtn');if(!b)return;const lab=((b.getAttribute('aria-label')||'')+' '+(b.title||'')).toLowerCase();if(b.matches('.aiChatMenuBtn,#aiChatMenuBtn,#alphaChatMenuBtn,#alphaInternalMenuBtn,.alphaInternalMenuBtn,.alphaChatMenuBtn,.alphaLifestyleMenuBtn')||/abrir (conversas|navega|menu)/.test(lab)||/menu/.test(lab))b.dataset.alphaChatMenuTrigger='1'}
function closeMenu(){ $('.alphaChatConvActionMenu4330')?.remove();$('.alphaChatConvActionScrim4330')?.remove() }
function pin(row){const m=meta(),k=key(row),on=!m[k]?.pinned;m[k]={...(m[k]||{}),pinned:on};save(m);row.classList.toggle('alphaPinned4330',on);const sh=row.closest('.alphaChatOlenSidebar4330'),pinBox=sh?.querySelector('.alphaChatPinned4330'),rec=sh?.querySelector('.alphaChatOlenRecents4330');if(on&&pinBox)pinBox.prepend(row);else if(!on&&rec)rec.prepend(row)}
function rename(row){const span=row.querySelector('.alphaChatOlenRecentText4330');if(!span)return;const old=span.textContent.trim(),v=prompt('Renomear conversa',old);if(!v?.trim()||v.trim()===old)return;const m=meta(),k=key(row);m[k]={...(m[k]||{}),name:v.trim()};save(m);row.dataset.convKey=k;span.textContent=v.trim()}
function del(row){const name=row.querySelector('.alphaChatOlenRecentText4330')?.textContent?.trim()||'esta conversa';if(!confirm(`Eliminar "${name}"?`))return;const m=meta(),k=key(row);m[k]={...(m[k]||{}),deleted:true};save(m);row.remove()}
function openMenu(row,x,y){closeMenu();const sc=document.createElement('div');sc.className='alphaChatConvActionScrim4330';sc.onclick=closeMenu;document.body.appendChild(sc);const m=document.createElement('div');m.className='alphaChatConvActionMenu4330';const k=key(row),pinned=!!meta()[k]?.pinned;m.innerHTML=`<button data-a="pin">${ICON.pin}<span>${pinned?'Desafixar':'Fixar'}</span></button><button data-a="rename">${ICON.edit}<span>Renomear</span></button><button class="danger" data-a="delete">${ICON.trash}<span>Eliminar</span></button>`;document.body.appendChild(m);const w=Math.min(270,innerWidth-28);m.style.width=w+'px';m.style.left=Math.max(14,Math.min(x-w/2,innerWidth-w-14))+'px';m.style.top=Math.max(14,Math.min(y-18,innerHeight-m.offsetHeight-14))+'px';m.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;closeMenu();if(a==='pin')pin(row);if(a==='rename')rename(row);if(a==='delete')del(row)})}
let hold=null,sx=0,sy=0,row=null,fired=false;
function cancel(){if(hold){clearTimeout(hold);hold=null}}
document.addEventListener('pointerdown',e=>markTrigger(e.target),true);
document.addEventListener('touchstart',e=>{
  markTrigger(e.target);
  if(e.touches?.length!==1)return;const r=e.target?.closest?.('.alphaChatOlenRecent4330');if(!r)return;row=r;fired=false;sx=e.touches[0].clientX;sy=e.touches[0].clientY;cancel();hold=setTimeout(()=>{hold=null;fired=true;navigator.vibrate?.(18);openMenu(r,sx,sy)},HOLD)
},{passive:true,capture:true});
document.addEventListener('touchmove',e=>{if(!hold||!e.touches?.length)return;if(Math.hypot(e.touches[0].clientX-sx,e.touches[0].clientY-sy)>MOVE)cancel()},{passive:true,capture:true});
document.addEventListener('touchend',e=>{cancel();if(fired){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();fired=false}row=null},{capture:true});
document.addEventListener('touchcancel',()=>{cancel();row=null},{passive:true,capture:true});
document.addEventListener('contextmenu',e=>{const r=e.target?.closest?.('.alphaChatOlenRecent4330');if(!r)return;e.preventDefault();openMenu(r,e.clientX,e.clientY)},true);
style();console.info('[ALPHA 4.3.30] chat sidebar stage3.2 fix ativo');
})();