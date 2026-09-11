/* ALPHA 4.3.30 · CHAT SIDEBAR STAGE 3.3 FIX
   Chat sidebar only.
   - keeps sidebar open during search and long-press actions
   - hides the actual visible top-left chat menu trigger while sidebar is open
   - long press: Fixar/Desafixar, Renomear, Eliminar
   - pinned conversation shows green “Afixada” marker
   - Recentes: Mostrar todas / Ver menos
   Event-driven only: no polling / no global MutationObserver.
*/
(()=>{
'use strict';
if(window.__alphaChatSidebarStage33Fix)return;window.__alphaChatSidebarStage33Fix=true;
const META_KEY='alpha_olen_conversation_meta_v4330',HOLD=520,MOVE=12;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON={pin:svg('<path d="m9 3 6 6-2 2 3 4-1 1-4-3-2 2-6-6 6-6Z"/><path d="m8 16-5 5"/>'),edit:svg('<path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>'),trash:svg('<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>')};
function meta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch{return{}}}
function save(m){try{localStorage.setItem(META_KEY,JSON.stringify(m))}catch{}}
function key(row){return row.dataset.convKey||row.dataset.alphaConvKey||row.querySelector('.alphaChatOlenRecentText4330')?.textContent?.replace(/\s*•\s*Afixada\s*$/i,'').trim().slice(0,160)||row.dataset.convId||'conversation'}
function opened(){return document.body.classList.contains('alphaChatOlenOpen4330')}
function sidebar(){return $('.alphaChatOlenSidebar4330')}
function style(){if($('#alphaChatSidebarStage33FixStyle'))return;const s=document.createElement('style');s.id='alphaChatSidebarStage33FixStyle';s.textContent=`
body.alphaChatOlenOpen4330 [data-alpha-chat-menu-trigger="1"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
body.alphaChatOlenOpen4330 .alphaChatActions4324{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
.alphaChatConvActionScrim4330{position:fixed;inset:0;z-index:9800;background:rgba(0,0,0,.14)}
.alphaChatConvActionMenu4330{position:fixed;z-index:9801;min-width:220px;max-width:calc(100vw - 28px);background:rgba(31,31,33,.985);border:1px solid rgba(255,255,255,.13);border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:8px;backdrop-filter:blur(18px)}
.alphaChatConvActionMenu4330 button{width:100%;height:54px;border:0;background:transparent;color:#f7f7f7;display:flex;align-items:center;gap:14px;padding:0 16px;border-radius:14px;text-align:left;font:700 16px/1.2 system-ui}.alphaChatConvActionMenu4330 button:active{background:rgba(255,255,255,.08)}.alphaChatConvActionMenu4330 svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.alphaChatConvActionMenu4330 .danger{color:#ff858c}
.alphaChatOlenRecent4330.alphaPinned4330 .alphaChatOlenRecentText4330:after{content:' • Afixada';font-size:11px;color:#72ddb5;font-weight:800}
`;document.head.appendChild(s)}

const hidden=new Set();
function likelyMenuButton(el){
  if(!(el instanceof HTMLElement)||el.closest('.alphaChatOlenSidebar4330'))return false;
  const r=el.getBoundingClientRect();if(r.width<24||r.height<24||r.width>90||r.height>90||r.left>95||r.top>145)return false;
  const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;
  const label=((el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'')+' '+(el.textContent||'')).toLocaleLowerCase('pt-PT');
  if(/menu|conversas|navega/.test(label))return true;
  const svg=el.querySelector('svg');if(svg){const paths=svg.querySelectorAll('path,line');if(paths.length>=2)return true}
  return false;
}
function hideVisibleMenu(){
  if(!opened())return;
  $$('button,[role="button"]').forEach(el=>{if(!likelyMenuButton(el))return;if(!el.dataset.alphaStage33Display)el.dataset.alphaStage33Display=el.style.display||'';el.dataset.alphaChatMenuTrigger='1';el.style.setProperty('display','none','important');hidden.add(el)});
}
function restoreHidden(){for(const el of hidden){if(!el?.isConnected)continue;el.style.removeProperty('display');const old=el.dataset.alphaStage33Display;if(old)el.style.display=old;delete el.dataset.alphaStage33Display}hidden.clear()}
function forceOpen(){
  const s=$('#aiChatMenu')||$('.alphaConversationSidebar');if(!s)return;
  document.body.classList.add('alphaChatOlenOpen4330');s.hidden=false;s.removeAttribute('hidden');s.setAttribute('aria-hidden','false');s.classList.add('show');hideVisibleMenu();
}
function syncOpenState(){if(opened())hideVisibleMenu();else restoreHidden()}

function closeMenu(){$('.alphaChatConvActionMenu4330')?.remove();$('.alphaChatConvActionScrim4330')?.remove()}
function refreshRecentLabels(){const sh=sidebar();if(!sh)return;const more=sh.querySelector('.alphaChatOlenMore4330');if(!more)return;const rec=[...sh.querySelectorAll('.alphaChatOlenRecents4330>.alphaChatOlenRecent4330')];const expanded=more.dataset.expanded==='1';more.hidden=rec.length<=8;rec.forEach((r,i)=>r.hidden=!expanded&&i>=8);more.textContent=expanded?'Ver menos':'Mostrar todas'}
function pin(row){const m=meta(),k=key(row),on=!m[k]?.pinned;m[k]={...(m[k]||{}),pinned:on};save(m);row.classList.toggle('alphaPinned4330',on);const sh=row.closest('.alphaChatOlenSidebar4330'),pinBox=sh?.querySelector('.alphaChatPinned4330'),rec=sh?.querySelector('.alphaChatOlenRecents4330');if(on&&pinBox)pinBox.prepend(row);else if(!on&&rec)rec.prepend(row);refreshRecentLabels();forceOpen()}
function rename(row){const span=row.querySelector('.alphaChatOlenRecentText4330');if(!span)return;const old=span.textContent.trim(),v=prompt('Renomear conversa',old);if(!v?.trim()||v.trim()===old){forceOpen();return}const m=meta(),k=key(row);m[k]={...(m[k]||{}),name:v.trim()};save(m);row.dataset.convKey=k;span.textContent=v.trim();forceOpen()}
function del(row){const name=row.querySelector('.alphaChatOlenRecentText4330')?.textContent?.trim()||'esta conversa';if(!confirm(`Eliminar "${name}"?`)){forceOpen();return}const m=meta(),k=key(row);m[k]={...(m[k]||{}),deleted:true};save(m);row.remove();refreshRecentLabels();forceOpen()}
function openMenu(row,x,y){closeMenu();forceOpen();const sc=document.createElement('div');sc.className='alphaChatConvActionScrim4330';sc.onclick=()=>{closeMenu();forceOpen()};document.body.appendChild(sc);const m=document.createElement('div');m.className='alphaChatConvActionMenu4330';const k=key(row),pinned=!!meta()[k]?.pinned;m.innerHTML=`<button data-a="pin">${ICON.pin}<span>${pinned?'Desafixar':'Fixar'}</span></button><button data-a="rename">${ICON.edit}<span>Renomear</span></button><button class="danger" data-a="delete">${ICON.trash}<span>Eliminar</span></button>`;document.body.appendChild(m);const w=Math.min(270,innerWidth-28);m.style.width=w+'px';m.style.left=Math.max(14,Math.min(x-w/2,innerWidth-w-14))+'px';m.style.top=Math.max(14,Math.min(y-18,innerHeight-m.offsetHeight-14))+'px';m.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.a;closeMenu();if(a==='pin')pin(row);if(a==='rename')rename(row);if(a==='delete')del(row)})}

function keepSidebarForInternalAction(target){
  if(!opened())return;const sh=target?.closest?.('.alphaChatOlenSidebar4330');if(!sh)return;
  if(target.closest('.alphaChatOlenRecent4330'))return;
  requestAnimationFrame(()=>{forceOpen();refreshRecentLabels()});
}

document.addEventListener('click',e=>{
  const sh=e.target?.closest?.('.alphaChatOlenSidebar4330');
  if(sh){keepSidebarForInternalAction(e.target);setTimeout(()=>{forceOpen();refreshRecentLabels()},0)}
  else setTimeout(syncOpenState,0);
},true);
document.addEventListener('input',e=>{if(e.target?.closest?.('.alphaChatOlenSearchBox4330'))requestAnimationFrame(forceOpen)},true);
document.addEventListener('focusin',e=>{if(e.target?.closest?.('.alphaChatOlenSidebar4330'))requestAnimationFrame(forceOpen)},true);

let hold=null,sx=0,sy=0,fired=false;
function cancel(){if(hold){clearTimeout(hold);hold=null}}
document.addEventListener('touchstart',e=>{if(e.touches?.length!==1)return;const r=e.target?.closest?.('.alphaChatOlenRecent4330');if(!r)return;fired=false;sx=e.touches[0].clientX;sy=e.touches[0].clientY;cancel();hold=setTimeout(()=>{hold=null;fired=true;navigator.vibrate?.(18);openMenu(r,sx,sy)},HOLD)},{passive:true,capture:true});
document.addEventListener('touchmove',e=>{if(!hold||!e.touches?.length)return;if(Math.hypot(e.touches[0].clientX-sx,e.touches[0].clientY-sy)>MOVE)cancel()},{passive:true,capture:true});
document.addEventListener('touchend',e=>{cancel();if(fired){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();fired=false}setTimeout(syncOpenState,0)},{capture:true});
document.addEventListener('touchcancel',cancel,{passive:true,capture:true});
document.addEventListener('contextmenu',e=>{const r=e.target?.closest?.('.alphaChatOlenRecent4330');if(!r)return;e.preventDefault();openMenu(r,e.clientX,e.clientY)},true);

function fixMoreButton(){const sh=sidebar(),more=sh?.querySelector('.alphaChatOlenMore4330');if(!more||more.dataset.stage33)return;more.dataset.stage33='1';const clone=more.cloneNode(true);clone.dataset.stage33='1';more.replaceWith(clone);clone.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const expanded=clone.dataset.expanded==='1';clone.dataset.expanded=expanded?'0':'1';refreshRecentLabels();forceOpen()})}
function install(){style();fixMoreButton();refreshRecentLabels();syncOpenState()}
window.addEventListener('pageshow',()=>setTimeout(install,80),{passive:true});document.addEventListener('touchend',()=>setTimeout(install,0),{passive:true});document.addEventListener('click',()=>setTimeout(install,0),true);setTimeout(install,100);
console.info('[ALPHA 4.3.30] chat sidebar stage3.3 interaction fix ativo');
})();