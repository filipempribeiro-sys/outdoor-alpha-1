/* ALPHA 4.3.30 · CHAT LONG PRESS ACTIONS
   - Long press em conversas Recentes: Fixar, Renomear, Eliminar
   - Mantém clique normal para abrir conversa
   - Persistência de pin/rename no lado OLEN; eliminação tenta usar ação original existente
*/
(()=>{
'use strict';
const HOLD_MS=520;
const META_KEY='alpha_olen_conversation_meta_v4330';
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICONS={
 pin:svg('<path d="m9 3 6 6-2 2 3 4-1 1-4-3-2 2-6-6 6-6Z"/><path d="m8 16-5 5"/>'),
 edit:svg('<path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>'),
 trash:svg('<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>')
};
function loadMeta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch{return{}}}
function saveMeta(m){try{localStorage.setItem(META_KEY,JSON.stringify(m))}catch{}}
function keyFor(el){return el.dataset.alphaConvKey||el.textContent?.trim().replace(/\s+/g,' ').slice(0,160)||'conversation'}
function ensureStyle(){if(document.getElementById('alphaLongPress4330Style'))return;const s=document.createElement('style');s.id='alphaLongPress4330Style';s.textContent=`
.alphaConvActionScrim4330{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.12)}
.alphaConvActionMenu4330{position:fixed;z-index:9001;min-width:220px;max-width:calc(100vw - 28px);background:rgba(31,31,33,.98);border:1px solid rgba(255,255,255,.13);border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:8px;overflow:hidden;backdrop-filter:blur(18px)}
.alphaConvActionMenu4330 button{width:100%;height:54px;border:0;background:transparent;color:#f7f7f7;display:flex;align-items:center;gap:14px;padding:0 16px;border-radius:14px;text-align:left;font:700 16px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.alphaConvActionMenu4330 button:active{background:rgba(255,255,255,.08)}
.alphaConvActionMenu4330 svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}
.alphaConvActionMenu4330 .danger{color:#ff858c}.alphaOlenRecent.alphaPinned4330 .alphaOlenRecentText:after{content:' • Afixada';font-size:11px;color:#7adfb9;font-weight:700}
`;document.head.append(s)}
function closeMenu(){document.querySelector('.alphaConvActionMenu4330')?.remove();document.querySelector('.alphaConvActionScrim4330')?.remove()}
function originalFor(recent){const idx=Number(recent.dataset.alphaOriginalIndex||recent.dataset.recentIndex||-1);const sidebar=document.querySelector('.alphaConversationSidebar');if(!sidebar||idx<0)return null;const c=[...sidebar.querySelectorAll('button,a,[role="button"]')].filter(el=>!el.closest('.alphaOlenSidebar')&&((el.textContent||'').trim().length>=2));return c[idx]||null}
function tryDeleteOriginal(recent){const orig=originalFor(recent);if(!orig)return false;const row=orig.closest('li,.conversation,.conversationItem,.alphaConversationItem,.alphaConversationRow,[data-conversation-id],div');if(!row)return false;const del=[...row.querySelectorAll('button')].find(b=>/eliminar|apagar|delete|remove/i.test(`${b.getAttribute('aria-label')||''} ${b.title||''}`));if(del){del.click();return true}return false}
function renameRecent(recent){const span=recent.querySelector('.alphaOlenRecentText');if(!span)return;const old=span.textContent.trim();const val=prompt('Renomear conversa',old);if(!val||!val.trim()||val.trim()===old)return;const next=val.trim();const meta=loadMeta();const k=keyFor(recent);meta[k]={...(meta[k]||{}),name:next};saveMeta(meta);span.textContent=next;recent.dataset.alphaConvKey=k;const orig=originalFor(recent);if(orig){const textNode=[...orig.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());if(textNode)textNode.textContent=next;else{const target=orig.querySelector('[data-title],.title,.conversationTitle,span');if(target)target.textContent=next}}
}
function pinRecent(recent){const meta=loadMeta();const k=keyFor(recent);const now=!(meta[k]?.pinned);meta[k]={...(meta[k]||{}),pinned:now};saveMeta(meta);recent.classList.toggle('alphaPinned4330',now);const recents=recent.parentElement;if(recents&&now)recents.prepend(recent)}
function deleteRecent(recent){const name=recent.querySelector('.alphaOlenRecentText')?.textContent?.trim()||'esta conversa';if(!confirm(`Eliminar "${name}"?`))return;const deleted=tryDeleteOriginal(recent);recent.remove();if(!deleted){const meta=loadMeta();const k=keyFor(recent);meta[k]={...(meta[k]||{}),deleted:true};saveMeta(meta)} }
function openMenu(recent,x,y){closeMenu();const scrim=document.createElement('div');scrim.className='alphaConvActionScrim4330';scrim.addEventListener('click',closeMenu);document.body.append(scrim);const m=document.createElement('div');m.className='alphaConvActionMenu4330';m.innerHTML=`<button data-a="pin">${ICONS.pin}<span>Fixar</span></button><button data-a="rename">${ICONS.edit}<span>Renomear</span></button><button data-a="delete" class="danger">${ICONS.trash}<span>Eliminar</span></button>`;document.body.append(m);const w=Math.min(260,window.innerWidth-28);let left=Math.max(14,Math.min(x-w/2,window.innerWidth-w-14));let top=Math.max(14,Math.min(y-20,window.innerHeight-m.offsetHeight-14));m.style.width=w+'px';m.style.left=left+'px';m.style.top=top+'px';m.addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(!b)return;const a=b.dataset.a;closeMenu();if(a==='pin')pinRecent(recent);if(a==='rename')renameRecent(recent);if(a==='delete')deleteRecent(recent)})}
function applyMeta(){const meta=loadMeta();document.querySelectorAll('.alphaOlenRecent').forEach((r,i)=>{if(!r.dataset.alphaOriginalIndex)r.dataset.alphaOriginalIndex=String(i);const span=r.querySelector('.alphaOlenRecentText');if(!span)return;const base=span.textContent.trim();if(!r.dataset.alphaConvKey)r.dataset.alphaConvKey=base;const entry=meta[r.dataset.alphaConvKey];if(entry?.deleted){r.remove();return}if(entry?.name)span.textContent=entry.name;r.classList.toggle('alphaPinned4330',!!entry?.pinned)})}
function bindRecent(r){if(r.dataset.alphaLongpress4330)return;r.dataset.alphaLongpress4330='1';let timer=null,sx=0,sy=0,fired=false;const cancel=()=>{if(timer){clearTimeout(timer);timer=null}};const start=(x,y)=>{fired=false;sx=x;sy=y;cancel();timer=setTimeout(()=>{timer=null;fired=true;navigator.vibrate?.(18);openMenu(r,x,y)},HOLD_MS)};r.addEventListener('touchstart',e=>{if(e.touches.length===1)start(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});r.addEventListener('touchmove',e=>{if(!timer||!e.touches.length)return;if(Math.hypot(e.touches[0].clientX-sx,e.touches[0].clientY-sy)>12)cancel()},{passive:true});r.addEventListener('touchend',e=>{cancel();if(fired){e.preventDefault();e.stopImmediatePropagation();fired=false}},{capture:true});r.addEventListener('touchcancel',cancel,{passive:true});r.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0)start(e.clientX,e.clientY)});r.addEventListener('pointerup',cancel);r.addEventListener('pointerleave',cancel);r.addEventListener('contextmenu',e=>{e.preventDefault();openMenu(r,e.clientX,e.clientY)})}
function reconcile(){ensureStyle();applyMeta();document.querySelectorAll('.alphaOlenRecent').forEach(bindRecent)}
new MutationObserver(()=>requestAnimationFrame(reconcile)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(reconcile,250);setInterval(reconcile,1800);console.info('[ALPHA 4.3.30] conversation long press ativo');
})();
