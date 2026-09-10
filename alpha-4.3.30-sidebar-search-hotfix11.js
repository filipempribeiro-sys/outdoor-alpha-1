/* ALPHA 4.3.30 · OLEN SIDEBAR SEARCH HOTFIX 11
   Event-driven only. No observers, polling or intervals.
   - Lupa abre/fecha pesquisa
   - input pesquisa conversas reais via alphaRenderChatSidebar quando disponível
   - mantém também filtragem visual das linhas OLEN
   - limpar pesquisa restaura lista normal
*/
(()=>{
'use strict';
const $=s=>document.querySelector(s);
function shell(){return $('.alphaConversationSidebar .alphaOlenSidebar')||$('#aiChatMenu .alphaOlenSidebar')}
function applyFilter(sh,q){
  const value=String(q||'').trim();
  try{ if(typeof window.alphaRenderChatSidebar==='function') window.alphaRenderChatSidebar(value); }catch{}
  const low=value.toLocaleLowerCase('pt-PT');
  const rows=[...sh.querySelectorAll('.alphaOlenRecent,.alphaPinned4330')];
  rows.forEach(r=>{r.hidden=!!low&&!r.textContent.toLocaleLowerCase('pt-PT').includes(low)});
  const more=sh.querySelector('.alphaOlenMore');
  if(more){
    if(low) more.hidden=true;
    else {
      const rec=[...sh.querySelectorAll('.alphaOlenRecents>.alphaOlenRecent')];
      const expanded=more.dataset.expanded==='1';
      rec.forEach((r,i)=>r.hidden=!expanded&&i>=8);
      more.hidden=rec.length<=8;
    }
  }
}
function ensureBound(){
  const sh=shell();if(!sh||sh.dataset.search11==='1')return;
  const btn=sh.querySelector('.alphaOlenSearch');
  const box=sh.querySelector('.alphaOlenSearchBox');
  const input=box?.querySelector('input');
  if(!btn||!box||!input)return;
  sh.dataset.search11='1';
  btn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    const opening=!box.classList.contains('show');
    box.classList.toggle('show',opening);
    btn.setAttribute('aria-expanded',opening?'true':'false');
    if(opening){setTimeout(()=>input.focus(),0)}
    else {input.value='';applyFilter(sh,'')}
  },true);
  input.addEventListener('input',()=>applyFilter(sh,input.value),true);
  input.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      e.preventDefault();
      input.value='';applyFilter(sh,'');
      box.classList.remove('show');
      btn.setAttribute('aria-expanded','false');
      btn.focus();
    }
  });
}
// Bind when sidebar is actually opened/clicked; no continuous observation.
document.addEventListener('click',e=>{
  const t=e.target?.closest?.('.alphaConversationSidebar,.aiChatMenuBtn,#aiChatMenuBtn,#alphaInternalMenuBtn,button[aria-label="Abrir conversas"],button[aria-label="Abrir navegação"]');
  if(t)setTimeout(ensureBound,0);
},true);
document.addEventListener('touchend',()=>{if(shell())setTimeout(ensureBound,0)},{passive:true});
setTimeout(ensureBound,120);
console.info('[ALPHA 4.3.30] OLEN sidebar search hotfix11 ativo');
})();
