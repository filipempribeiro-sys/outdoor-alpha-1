/* ALPHA 4.3.31 · CHAT SIDEBAR STABILIZATION
   Chat sidebar only.
   - search stays open and usable
   - selecting a Recent/Afixada conversation closes sidebar
   - menu trigger hidden only in Chat, restored before leaving Chat
   - icon-only footer mirrors the real bottom navigation
   - long press: Fixar/Desafixar, Renomear, Eliminar
   - pinned conversation shows green “Afixada” marker
   - Recentes: Mostrar todas / Ver menos
   - conversation scrollbars hidden while scrolling remains enabled
   Event-driven only: no polling / no global MutationObserver.
*/
(()=>{
'use strict';
if(window.__alphaChatSidebar431)return;window.__alphaChatSidebar431=true;
const META_KEY='alpha_olen_conversation_meta_v4330',HOLD=520,MOVE=12;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON={
 pin:svg('<path d="m9 3 6 6-2 2 3 4-1 1-4-3-2 2-6-6 6-6Z"/><path d="m8 16-5 5"/>'),
 edit:svg('<path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>'),
 trash:svg('<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>'),
 home:svg('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>'),
 map:svg('<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>'),
 calendar:svg('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/>'),
 report:svg('<path d="M5 3h11l3 3v15H5V3Z"/><path d="M15 3v4h4M8 12h8M8 16h8M8 8h3"/>'),
 profile:svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>'),
 grid:svg('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>')
};
function meta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch{return{}}}
function save(m){try{localStorage.setItem(META_KEY,JSON.stringify(m))}catch{}}
function key(row){return row.dataset.convKey||row.dataset.alphaConvKey||row.querySelector('.alphaChatOlenRecentText4330')?.textContent?.replace(/\s*•\s*Afixada\s*$/i,'').trim().slice(0,160)||row.dataset.convId||'conversation'}
function isChat(){return document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode')}
function opened(){return document.body.classList.contains('alphaChatOlenOpen4330')}
function sidebar(){return $('.alphaChatOlenSidebar4330')}
function style(){if($('#alphaChatSidebar431Style'))return;const s=document.createElement('style');s.id='alphaChatSidebar431Style';s.textContent=`
body.alphaChatOlenOpen4330.alphaChatMode .aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode #aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode #alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaChatMode .alphaChatActions4324,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaChatActions4324{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
.alphaChatOlenRecents4330,.alphaChatPinned4330{scrollbar-width:none!important;-ms-overflow-style:none!important}
.alphaChatOlenRecents4330::-webkit-scrollbar,.alphaChatPinned4330::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
.alphaChatConvActionScrim4330{position:fixed;inset:0;z-index:9800;background:rgba(0,0,0,.14)}
.alphaChatConvActionMenu4330{position:fixed;z-index:9801;min-width:220px;max-width:calc(100vw - 28px);background:rgba(31,31,33,.985);border:1px solid rgba(255,255,255,.13);border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:8px;backdrop-filter:blur(18px)}
.alphaChatConvActionMenu4330 button{width:100%;height:54px;border:0;background:transparent;color:#f7f7f7;display:flex;align-items:center;gap:14px;padding:0 16px;border-radius:14px;text-align:left;font:700 16px/1.2 system-ui}.alphaChatConvActionMenu4330 button:active{background:rgba(255,255,255,.08)}.alphaChatConvActionMenu4330 svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.alphaChatConvActionMenu4330 .danger{color:#ff858c}
.alphaChatOlenRecent4330.alphaPinned4330 .alphaChatOlenRecentText4330:after{content:' • Afixada';font-size:11px;color:#72ddb5;font-weight:800}
.alphaChatOlenBottom4330{margin-top:auto!important;padding:9px 0 0!important;border-top:1px solid rgba(255,255,255,.08)!important;flex:0 0 auto!important}
.alphaChatSidebarDock4330{display:grid!important;grid-template-columns:repeat(var(--alpha-chat-dock-count,5),minmax(0,1fr));gap:3px;align-items:center;width:100%}
.alphaChatSidebarDock4330 button{min-width:0;width:100%;height:48px;border:0;border-radius:13px;background:transparent;color:#8fa39d;padding:0;display:grid;place-items:center}
.alphaChatSidebarDock4330 button.active{background:#17372f;color:#e7fff5}.alphaChatSidebarDock4330 button:active{background:rgba(255,255,255,.08)}
.alphaChatSidebarDock4330 svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.85;stroke-linecap:round;stroke-linejoin:round}
`;document.head.appendChild(s)}
function forceOpen(){if(!isChat())return;const s=$('#aiChatMenu')||$('.alphaConversationSidebar');if(!s)return;document.body.classList.add('alphaChatOlenOpen4330');s.hidden=false;s.removeAttribute('hidden');s.setAttribute('aria-hidden','false');s.classList.add('show')}
function forceClose(){closeMenu();document.body.classList.remove('alphaChatOlenOpen4330');const s=$('#aiChatMenu')||$('.alphaConversationSidebar');if(s){s.setAttribute('aria-hidden','true');s.classList.remove('show')}}
function closeMenu(){$('.alphaChatConvActionMenu4330')?.remove();$('.alphaChatConvActionScrim4330')?.remove()}
function refreshRecentLabels(){const sh=sidebar();if(!sh)return;const more=sh.querySelector('.alphaChatOlenMore4330');if(!more)return;const rec=[...sh.querySelectorAll('.alphaChatOlenRecents4330>.alphaChatOlenRecent4330')];const expanded=more.dataset.expanded==='1';more.hidden=rec.length<=8;rec.forEach((r,i)=>r.hidden=!expanded&&i>=8);more.textContent=expanded?'Ver menos':'Mostrar todas'}
function pin(row){const m=meta(),k=key(row),on=!m[k]?.pinned;m[k]={...(m[k]||{}),pinned:on};save(m);row.classList.toggle('alphaPinned4330',on);const sh=row.closest('.alphaChatOlenSidebar4330'),pinBox=sh?.querySelector('.alphaChatPinned4330'),rec=sh?.querySelector('.alphaChatOlenRecents4330');if(on&&pinBox)pinBox.prepend(row);else if(!on&&rec)rec.prepend(row);refreshRecentLabels();forceOpen()}
function rename(row){const span=row.querySelector('.alphaChatOlenRecentText4330');if(!span)return;const old=span.textContent.trim(),v=prompt('Renomear conversa',old);if(!v?.trim()||v.trim()===old){forceOpen();return}const m=meta(),k=key(row);m[k]={...(m[k]||{}),name:v.trim()};save(m);row.dataset.convKey=k;span.textContent=v.trim();forceOpen()}
function del(row){const name=row.querySelector('.alphaChatOlenRecentText4330')?.textContent?.trim()||'esta conversa';if(!confirm(`Eliminar "${name}"?`)){forceOpen();return}const m=meta(),k=key(row);m[k]={...(m[k]||{}),deleted:true};save(m);row.remove();refreshRecentLabels();forceOpen()}
function openMenu(row,x,y){closeMenu();forceOpen();const sc=document.createElement('div');sc.className='alphaChatConvActionScrim4330';sc.onclick=()=>{closeMenu();forceOpen()};document.body.appendChild(sc);const m=document.createElement('div');m.className='alphaChatConvActionMenu4330';const k=key(row),pinned=!!meta()[k]?.pinned;m.innerHTML=`<button data-a="pin">${ICON.pin}<span>${pinned?'Desafixar':'Fixar'}</span></button><button data-a="rename">${ICON.edit}<span>Renomear</span></button><button class="danger" data-a="delete">${ICON.trash}<span>Eliminar</span></button>`;document.body.appendChild(m);const w=Math.min(270,innerWidth-28);m.style.width=w+'px';m.style.left=Math.max(14,Math.min(x-w/2,innerWidth-w-14))+'px';m.style.top=Math.max(14,Math.min(y-18,innerHeight-m.offsetHeight-14))+'px';m.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.a;closeMenu();if(a==='pin')pin(row);if(a==='rename')rename(row);if(a==='delete')del(row)})}
function iconFor(src){const t=((src.getAttribute('aria-label')||'')+' '+(src.title||'')+' '+(src.textContent||'')).toLocaleLowerCase('pt-PT');if(/home|início|inicio/.test(t))return ICON.home;if(/mapa|\bgo\b/.test(t))return ICON.map;if(/calend/.test(t))return ICON.calendar;if(/report/.test(t))return ICON.report;if(/perfil|profile/.test(t))return ICON.profile;return ICON.grid}
function ensureFooter(){const sh=sidebar(),bottom=sh?.querySelector('.alphaChatOlenBottom4330');if(!bottom)return;let dock=bottom.querySelector('.alphaChatSidebarDock4330');if(!dock){dock=document.createElement('div');dock.className='alphaChatSidebarDock4330';bottom.replaceChildren(dock)}const native=[...document.querySelectorAll('.bottom .nav')].filter(n=>!n.closest('.alphaChatOlenSidebar4330')&&!n.classList.contains('hidden'));if(!native.length){dock.hidden=true;return}dock.hidden=false;dock.style.setProperty('--alpha-chat-dock-count',String(native.length));dock.replaceChildren();native.forEach((src,i)=>{const b=document.createElement('button');b.type='button';b.dataset.nativeIndex=String(i);b.classList.toggle('active',src.classList.contains('active'));const label=(src.getAttribute('aria-label')||src.textContent||src.title||`Aba ${i+1}`).trim();b.setAttribute('aria-label',label);b.title=label;b.innerHTML=iconFor(src);b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();forceClose();src.click();setTimeout(()=>{document.body.classList.remove('alphaChatOlenOpen4330');if(!isChat())forceClose()},0)});dock.appendChild(b)})}
function toggleSearch(){const sh=sidebar(),box=sh?.querySelector('.alphaChatOlenSearchBox4330'),input=box?.querySelector('input');if(!sh||!box)return;const on=!box.classList.contains('show');box.classList.toggle('show',on);if(on)setTimeout(()=>{forceOpen();input?.focus()},20);else if(input){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))}forceOpen()}
/* Intercept only the search trigger. This prevents older click owners from closing the sidebar. */
document.addEventListener('click',e=>{const search=e.target?.closest?.('.alphaChatOlenSearch4330');if(!search||!opened())return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();toggleSearch()},true);
/* Conversation selection is the only sidebar action that intentionally closes it. */
document.addEventListener('click',e=>{if(!opened())return;const row=e.target?.closest?.('.alphaChatOlenRecent4330');if(row){setTimeout(forceClose,0);return}const dock=e.target?.closest?.('.alphaChatSidebarDock4330');if(dock)return;if(e.target?.closest?.('.alphaChatOlenSidebar4330'))requestAnimationFrame(()=>{forceOpen();refreshRecentLabels();ensureFooter()})},true);
document.addEventListener('input',e=>{if(e.target?.closest?.('.alphaChatOlenSearchBox4330'))requestAnimationFrame(forceOpen)},true);
document.addEventListener('focusin',e=>{if(e.target?.closest?.('.alphaChatOlenSidebar4330'))requestAnimationFrame(forceOpen)},true);
let hold=null,sx=0,sy=0,fired=false;function cancel(){if(hold){clearTimeout(hold);hold=null}}
document.addEventListener('touchstart',e=>{if(e.touches?.length!==1)return;const r=e.target?.closest?.('.alphaChatOlenRecent4330');if(!r)return;fired=false;sx=e.touches[0].clientX;sy=e.touches[0].clientY;cancel();hold=setTimeout(()=>{hold=null;fired=true;navigator.vibrate?.(18);openMenu(r,sx,sy)},HOLD)},{passive:true,capture:true});
document.addEventListener('touchmove',e=>{if(!hold||!e.touches?.length)return;if(Math.hypot(e.touches[0].clientX-sx,e.touches[0].clientY-sy)>MOVE)cancel()},{passive:true,capture:true});
document.addEventListener('touchend',e=>{cancel();if(fired){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();fired=false}},{capture:true});
document.addEventListener('touchcancel',cancel,{passive:true,capture:true});
document.addEventListener('contextmenu',e=>{const r=e.target?.closest?.('.alphaChatOlenRecent4330');if(!r)return;e.preventDefault();openMenu(r,e.clientX,e.clientY)},true);
function fixMoreButton(){const sh=sidebar(),more=sh?.querySelector('.alphaChatOlenMore4330');if(!more||more.dataset.v431)return;const clone=more.cloneNode(true);clone.dataset.v431='1';more.replaceWith(clone);clone.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const expanded=clone.dataset.expanded==='1';clone.dataset.expanded=expanded?'0':'1';refreshRecentLabels();forceOpen()})}
function install(){style();if(!isChat()){forceClose();return}fixMoreButton();refreshRecentLabels();ensureFooter()}
window.addEventListener('pageshow',()=>setTimeout(install,80),{passive:true});
document.addEventListener('click',()=>setTimeout(()=>{if(isChat())install();else forceClose()},0),true);
setTimeout(install,100);
console.info('[ALPHA 4.3.31] chat sidebar stabilized');
})();