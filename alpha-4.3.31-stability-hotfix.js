/* ALPHA 4.3.31m · STABILITY HOTFIX
   Consolidates two regressions introduced by overlapping hotfixes:
   1) internal views 3–7 must use the SAME OLEN conversation sidebar as Chat/Home;
   2) Google Places photo URLs stored as /api/place-photo must be absolute before cards render.
   Event-driven. No MutationObserver. No polling.
*/
(()=>{
'use strict';
if(window.__alphaStability431m)return;window.__alphaStability431m=true;

const BACKEND='https://alpha-ai-backend-m6l3.onrender.com';
const EDGE=36,SWIPE=58,DOM=1.25;
const $=s=>document.querySelector(s);

function absPhoto(v){
  v=String(v||'').trim();
  if(!v)return '';
  if(/^https?:\/\//i.test(v))return v;
  if(/^\/api\/place-photo(?:\?|$)/i.test(v))return BACKEND+v;
  if(/^api\/place-photo(?:\?|$)/i.test(v))return BACKEND+'/'+v;
  return v;
}
function normalizeObject(o,seen=new WeakSet()){
  if(!o||typeof o!=='object'||seen.has(o))return false;
  seen.add(o);let changed=false;
  if(Array.isArray(o)){for(const x of o)changed=normalizeObject(x,seen)||changed;return changed}
  for(const k of ['photo','photoUrl','image','imageUrl','cover','coverUrl','thumbnail','thumbnailUrl']){
    if(typeof o[k]==='string'){
      const n=absPhoto(o[k]);if(n!==o[k]){o[k]=n;changed=true}
    }
  }
  for(const [k,v] of Object.entries(o)){
    if(v&&typeof v==='object')changed=normalizeObject(v,seen)||changed;
  }
  return changed;
}
function migrateSavedConversations(){
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)||'';
      if(!/alpha_.*conversations|alpha_ai_conversations/i.test(key))continue;
      const raw=localStorage.getItem(key);if(!raw||!raw.includes('/api/place-photo'))continue;
      let data;try{data=JSON.parse(raw)}catch{continue}
      if(normalizeObject(data))localStorage.setItem(key,JSON.stringify(data));
    }
  }catch{}
  try{const rows=window.alphaConversations?.();if(Array.isArray(rows))normalizeObject(rows)}catch{}
  try{const c=window.alphaCurrentConversation?.();if(c)normalizeObject(c)}catch{}
}
function internalView(){
  if(document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode'))return false;
  const id=String(document.body?.dataset?.alphaView||'');
  if(id&&id!=='home')return true;
  const active=[...document.querySelectorAll('.view.active,.view.show,.view[aria-hidden="false"]')].find(el=>{
    try{const r=el.getBoundingClientRect();return el.id&&r.width>0&&r.height>0&&getComputedStyle(el).display!=='none'}catch{return false}
  });
  return !!active&&active.id!=='home'&&active.id!=='lifestyleAI';
}
function olenSidebar(){return $('#aiChatMenu')||$('.alphaConversationSidebar')}
function olenOpen(){
  try{window.alphaCloseInternalSidebar?.()}catch{}
  try{if(typeof window.alphaOpenOlenSidebar==='function'){window.alphaOpenOlenSidebar();return true}}catch{}
  const s=olenSidebar();if(!s)return false;
  s.hidden=false;s.removeAttribute('hidden');s.setAttribute('aria-hidden','false');s.classList.add('show');
  document.body.classList.add('alphaSidebarOpen4330','alphaOlenFunctionalOpen10');return true;
}
function olenClose(){try{window.alphaCloseOlenSidebar?.();return}catch{}const s=olenSidebar();if(s){s.setAttribute('aria-hidden','true');s.classList.remove('show')}document.body.classList.remove('alphaSidebarOpen4330','alphaOlenFunctionalOpen10')}
function olenVisible(){const s=olenSidebar();if(!s)return false;try{const r=s.getBoundingClientRect(),cs=getComputedStyle(s);return s.getAttribute('aria-hidden')!=='true'&&cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>40}catch{return false}}
function hideLegacyInternal(){
  const s=$('#alphaInternalSidebar'),sc=$('#alphaInternalScrim');
  if(s){s.classList.remove('show');s.setAttribute('aria-hidden','true')}
  sc?.classList.remove('show');
}
function installCss(){if($('#alphaStability431mStyle'))return;const s=document.createElement('style');s.id='alphaStability431mStyle';s.textContent=`
#alphaInternalSidebar,#alphaInternalScrim{display:none!important;visibility:hidden!important;pointer-events:none!important}
body.alphaOlenFunctionalOpen10 #aiChatMenu,body.alphaSidebarOpen4330 #aiChatMenu{display:block!important;visibility:visible!important;pointer-events:auto!important;z-index:5200!important}
body.alphaOlenFunctionalOpen10 #alphaOlenFunctionalScrim10,body.alphaSidebarOpen4330 #alphaOlenFunctionalScrim10{z-index:5190!important}
`;document.head.appendChild(s)}

/* Normalize future place registrations BEFORE any card renderer sees the URL. */
const reg=window.alphaRegisterPlaceCard;
if(typeof reg==='function')window.alphaRegisterPlaceCard=function(...args){
  for(const a of args)if(a&&typeof a==='object')normalizeObject(a);
  return reg.apply(this,args);
};

/* One sidebar only: own the internal hamburger at window capture level, before document handlers. */
window.addEventListener('click',e=>{
  const b=e.target?.closest?.('#alphaInternalMenuBtn,.aiChatMenuBtn,#aiChatMenuBtn,button[aria-label="Abrir navegação"],button[aria-label="Abrir conversas"]');
  if(!b||!internalView())return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  hideLegacyInternal();olenVisible()?olenClose():olenOpen();
},true);

/* Edge gesture on internal views: right opens OLEN; left while OLEN is open closes it. */
let sx=0,sy=0,tracking=false,startedOpen=false;
window.addEventListener('touchstart',e=>{
  if(e.touches?.length!==1)return;
  const t=e.touches[0];startedOpen=olenVisible();
  const blocked=!!e.target?.closest?.('input,textarea,select,[contenteditable="true"],.maplibregl-map,#realMap,[role="dialog"],.alphaTimePicker,.alphaCalendarEditor');
  if(blocked){tracking=false;return}
  if(startedOpen){sx=t.clientX;sy=t.clientY;tracking=true;return}
  if(!internalView()||t.clientX>EDGE){tracking=false;return}
  sx=t.clientX;sy=t.clientY;tracking=true;
},true);
window.addEventListener('touchend',e=>{
  if(!tracking)return;tracking=false;
  const t=e.changedTouches?.[0];if(!t)return;
  const dx=t.clientX-sx,dy=t.clientY-sy;
  if(Math.abs(dx)<SWIPE||Math.abs(dx)<Math.abs(dy)*DOM)return;
  e.stopPropagation();e.stopImmediatePropagation();
  hideLegacyInternal();
  if(startedOpen&&dx<0)olenClose();else if(!startedOpen&&dx>0)olenOpen();
},true);

/* Retire legacy internal public bridge so old inline calls also open OLEN. */
window.alphaOpenInternalSidebar=olenOpen;
window.alphaCloseInternalSidebar=olenClose;
window.alphaToggleInternalSidebar=e=>{e?.preventDefault?.();hideLegacyInternal();olenVisible()?olenClose():olenOpen()};

migrateSavedConversations();installCss();hideLegacyInternal();
window.addEventListener('pageshow',()=>{migrateSavedConversations();hideLegacyInternal()},{passive:true});
console.info('[ALPHA 4.3.31m] sidebar única OLEN + fotos dos cartões estabilizadas');
})();
