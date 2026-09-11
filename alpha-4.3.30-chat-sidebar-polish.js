/* ALPHA 4.3.30 · CHAT SIDEBAR POLISH
   Apenas Chat/sidebar OLEN:
   - esconde hamburger + cápsula enquanto a sidebar está aberta
   - repõe long press em Recentes: Fixar, Renomear, Eliminar
   - event-driven, sem polling/intervalos globais
*/
(()=>{
'use strict';
if(window.__alphaChatSidebarPolish4330)return;window.__alphaChatSidebarPolish4330=true;
const HOLD_MS=520,META_KEY='alpha_olen_conversation_meta_v4330';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICONS={pin:svg('<path d="m9 3 6 6-2 2 3 4-1 1-4-3-2 2-6-6 6-6Z"/><path d="m8 16-5 5"/>'),edit:svg('<path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>'),trash:svg('<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>')};
function meta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch{return{}}}
function save(m){try{localStorage.setItem(META_KEY,JSON.stringify(m))}catch{}}
function keyFor(el){return el.dataset.alphaConvKey||el.querySelector('.alphaOlenRecentText')?.textContent?.trim().replace(/\s+/g,' ').slice(0,160)||'conversation'}
function style(){if($('#alphaChatSidebarPolish4330Style'))return;const s=document.createElement('style');s.id='alphaChatSidebarPolish4330Style';s.textContent=`
body.alphaOlenFunctionalOpen10 #aiChatMenuBtn,
body.alphaOlenFunctionalOpen10 .aiChatMenuBtn,
body.alphaOlenFunctionalOpen10 .alphaChatMenuBtn,
body.alphaOlenFunctionalOpen10 button[aria-label="Abrir conversas"],
body.alphaOlenFunctionalOpen10 button[aria-label="Abrir menu"],
body.alphaOlenFunctionalOpen10 .alphaChatActions4324,
body.alphaOlenFunctionalOpen10 #alphaChatActions4324{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
.alphaConvActionScrim4330{position:fixed;inset:0;z-index:9800;background:rgba(0,0,0,.12)}
.alphaConvActionMenu4330{position:fixed;z-index:9801;min-width:220px;max-width:calc(100vw - 28px);background:rgba(31,31,33,.98);border:1px solid rgba(255,255,255,.13);border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:8px;overflow:hidden;backdrop-filter:blur(18px)}
.alphaConvActionMenu4330 button{width:100%;height:54px;border:0;background:transparent;color:#f7f7f7;display:flex;align-items:center;gap:14px;padding:0 16px;border-radius:14px;text-align:left;font:700 16px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}.alphaConvActionMenu4330 button:active{background:rgba(255,255,255,.08)}.alphaConvActionMenu4330 svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}.alphaConvActionMenu4330 .danger{color:#ff858c}.alphaOlenRecent.alphaPinned4330 .alphaOlenRecentText:after{content:' • Afixada';font-size:11px;color:#7adfb9;font-weight:700}
`;document.head.append(s)}
function closeMenu(){$('.alphaConvActionMenu4330')?.remove();$('.alphaConvActionScrim4330')?.remove()}
function originalFor(recent){const idx=Number(recent.dataset.alphaOriginalIndex||recent.dataset.recentIndex||-1),sidebar=$('.alphaConversationSidebar');if(!sidebar||idx<0)return null;const c=[...sidebar.querySelectorAll('button,a,[role="button"]')].filter(el=>!el.closest('.alphaOlenSidebar')&&((el.textContent||'').trim().length>=2));return c[idx]||null}
function tryDeleteOriginal(recent){const orig=originalFor(recent),row=orig?.closest('li,.conversation,.conversationItem,.alphaConversationItem,.alphaConversationRow,[data-conversation-id],div');if(!row)return false;const del=[...row.querySelectorAll('button')].find(b=>/eliminar|apagar|delete|remove/i.test(`${b.getAttribute('aria-label')||''} ${b.title||''}`));if(!del)return false;del.click();return true}
function pinRecent(r){const m=meta(),k=keyFor(r),now=!m[k]?.pinned;m[k]={...(m[k]||{}),pinned:now};save(m);r.classList.toggle('alphaPinned4330',now);const pin=$('.alphaPinnedList4330'),rec=$('.alphaOlenRecents');if(now&&pin)pin.prepend(r);else if(!now&&rec)rec.prepend(r)}
function renameRecent(r){const span=r.querySelector('.alphaOlenRecentText');if(!span)return;const old=span.textContent.trim(),v=prompt('Renomear conversa',old);if(!v?.trim()||v.trim()===old)return;const m=meta(),k=keyFor(r);m[k]={...(m[k]||{}),name:v.trim()};save(m);span.textContent=v.trim()}
function deleteRecent(r){const name=r.querySelector('.alphaOlenRecentText')?.textContent?.trim()||'esta conversa';if(!confirm(`Eliminar "${name}"?`))return;const deleted=tryDeleteOriginal(r),k=keyFor(r);r.remove();if(!deleted){const m=meta();m[k]={...(m[k]||{}),deleted:true};save(m)}}
function openMenu(r,x,y){closeMenu();const sc=document.createElement('div');sc.className='alphaConvActionScrim4330';sc.onclick=closeMenu;document.body.append(sc);const m=document.createElement('div');m.className='alphaConvActionMenu4330';m.innerHTML=`<button data-a="pin">${ICONS.pin}<span>${r.classList.contains('alphaPinned4330')?'Desafixar':'Fixar'}</span></button><button data-a="rename">${ICONS.edit}<span>Renomear</span></button><button data-a="delete" class="danger">${ICONS.trash}<span>Eliminar</span></button>`;document.body.append(m);const w=Math.min(260,innerWidth-28);m.style.width=w+'px';m.style.left=Math.max(14,Math.min(x-w/2,innerWidth-w-14))+'px';m.style.top=Math.max(14,Math.min(y-20,innerHeight-m.offsetHeight-14))+'px';m.onclick=e=>{const b=e.target.closest('button[data-a]');if(!b)return;const a=b.dataset.a;closeMenu();if(a==='pin')pinRecent(r);else if(a==='rename')renameRecent(r);else if(a==='delete')deleteRecent(r)}}
function applyMeta(){const m=meta();$$('.alphaOlenRecent').forEach((r,i)=>{if(!r.dataset.alphaOriginalIndex)r.dataset.alphaOriginalIndex=String(i);const span=r.querySelector('.alphaOlenRecentText');if(!span)return;if(!r.dataset.alphaConvKey)r.dataset.alphaConvKey=span.textContent.trim();const e=m[r.dataset.alphaConvKey];if(e?.deleted){r.remove();return}if(e?.name)span.textContent=e.name;r.classList.toggle('alphaPinned4330',!!e?.pinned)})}
function bind(r){if(r.dataset.alphaLongpress4330)return;r.dataset.alphaLongpress4330='1';let timer=null,sx=0,sy=0,fired=false;const cancel=()=>{if(timer){clearTimeout(timer);timer=null}};const start=(x,y)=>{fired=false;sx=x;sy=y;cancel();timer=setTimeout(()=>{timer=null;fired=true;navigator.vibrate?.(18);openMenu(r,x,y)},HOLD_MS)};r.addEventListener('touchstart',e=>{if(e.touches.length===1)start(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});r.addEventListener('touchmove',e=>{if(!timer||!e.touches.length)return;if(Math.hypot(e.touches[0].clientX-sx,e.touches[0].clientY-sy)>12)cancel()},{passive:true});r.addEventListener('touchend',e=>{cancel();if(fired){e.preventDefault();e.stopImmediatePropagation();fired=false}},{capture:true});r.addEventListener('touchcancel',cancel,{passive:true});r.addEventListener('contextmenu',e=>{e.preventDefault();openMenu(r,e.clientX,e.clientY)})}
function reconcile(){style();applyMeta();$$('.alphaOlenRecent').forEach(bind)}
document.addEventListener('click',e=>{if(e.target?.closest?.('#aiChatMenuBtn,.aiChatMenuBtn,button[aria-label="Abrir conversas"],.alphaOlenRecent,.alphaOlenMore'))setTimeout(reconcile,0)},true);document.addEventListener('touchend',()=>setTimeout(reconcile,0),{passive:true});window.addEventListener('pageshow',()=>setTimeout(reconcile,80),{passive:true});setTimeout(reconcile,120);
console.info('[ALPHA 4.3.30] chat sidebar polish + long press ativo');
})();
