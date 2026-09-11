/* ALPHA 4.3.37 · CHAT SIDEBAR FOOTER ICONS LOCK
   Keeps the correct semantic footer icons after Stage 3 rebuilds the dock.
   Isolated footer visual fix only; navigation/click behavior stays owned by Stage 3.
*/
(()=>{
'use strict';
if(window.__alphaChatFooterIconsLock437)return;
window.__alphaChatFooterIconsLock437=true;

const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON={
 home:svg('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/>'),
 map:svg('<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>'),
 chat:svg('<path d="M21 11.5a8.5 8.5 0 0 1-9 8.4A9.8 9.8 0 0 1 7 18.5L3 20l1.5-4A8.5 8.5 0 1 1 21 11.5Z"/>'),
 calendar:svg('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/>'),
 live:svg('<path d="M5 4h14v16H5z"/><path d="M8 15l2.5-3 2 2 3.5-5"/><circle cx="17.5" cy="7.5" r="1.5"/>'),
 reports:svg('<path d="M7 3h10a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M9 8h6M9 12h6M9 16h4"/>'),
 profile:svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>')
};
function sourceText(src){return [src?.id,src?.className,src?.getAttribute?.('aria-label'),src?.getAttribute?.('title'),src?.getAttribute?.('data-view'),src?.getAttribute?.('data-tab'),src?.getAttribute?.('data-page'),src?.getAttribute?.('data-route'),src?.getAttribute?.('data-target'),src?.textContent].filter(Boolean).join(' ').toLocaleLowerCase('pt-PT')}
function iconFor(src,i,total){
 const t=sourceText(src);
 if(/home|início|inicio|explorar/.test(t))return ICON.home;
 if(/mapa|\bgo\b|map/.test(t))return ICON.map;
 if(/chat|olen|conversa/.test(t))return ICON.chat;
 if(/calend|agenda/.test(t))return ICON.calendar;
 if(/meus\s*reports|reports\s*guardados|hist[oó]rico/.test(t))return ICON.reports;
 if(/report\s*live|live\s*report|report/.test(t))return ICON.live;
 if(/perfil|profile|conta/.test(t))return ICON.profile;
 const fallback=total>=7?[ICON.home,ICON.map,ICON.chat,ICON.calendar,ICON.live,ICON.reports,ICON.profile]:[ICON.home,ICON.map,ICON.chat,ICON.calendar,ICON.live,ICON.profile];
 return fallback[i]||ICON.home
}
function apply(){
 const dock=document.querySelector('.alphaChatSidebarDock4330');
 if(!dock)return;
 const buttons=[...dock.querySelectorAll('button')];
 const native=[...document.querySelectorAll('.bottom .nav')].filter(n=>!n.closest('.alphaChatOlenSidebar4330')&&!n.classList.contains('hidden'));
 buttons.forEach((b,i)=>{const src=native[i];if(src)b.innerHTML=iconFor(src,i,buttons.length)})
}
function afterStage3(){requestAnimationFrame(()=>requestAnimationFrame(apply))}
document.addEventListener('click',afterStage3,true);
document.addEventListener('touchend',afterStage3,{passive:true,capture:true});
window.addEventListener('pageshow',afterStage3,{passive:true});
setTimeout(apply,160);
console.info('[ALPHA 4.3.37] sidebar footer icons locked');
})();
