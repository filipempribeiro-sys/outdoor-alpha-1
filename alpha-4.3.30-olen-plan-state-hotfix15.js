/* ALPHA 4.3.30 · OLEN PLAN STATE HOTFIX 15
   Fecha o ciclo seleção -> plano -> OLEN.
   Ao entregar um plano à OLEN, a seleção deixa de ser um rascunho ativo:
   - limpa o draft da conversa
   - esconde o tray "local selecionado / Criar plano"
   - devolve os cartões ao estado "+ Plano"
   - mantém o olenPlan persistido na conversa e marca-o como organizing
   Event-driven; sem polling nem observers adicionais.
*/
(()=>{
'use strict';
const DRAFT='alpha_olen_plan_draft_v1';
const $=s=>document.querySelector(s);
function conv(){try{return window.alphaCurrentConversation?.()||null}catch{return null}}
function draftKey(){const id=conv()?.id||'global';try{return window.userKey?window.userKey(DRAFT+'_'+id):DRAFT+'_'+id}catch{return DRAFT+'_'+id}}
function persist(c){try{if(typeof window.alphaUpsertConversation==='function')window.alphaUpsertConversation(c);else if(typeof window.alphaPersistConversation==='function')window.alphaPersistConversation(c)}catch{}}
function consumeSelection(){
  const c=conv();
  if(c?.conversationState?.olenPlan){
    c.conversationState.olenPlan.status='organizing';
    c.conversationState.olenPlan.updatedAt=new Date().toISOString();
    c.updatedAt=new Date().toISOString();
    persist(c);
  }
  try{localStorage.removeItem(draftKey())}catch{}
  const tray=$('.alphaOlenPlanTray13');
  if(tray){tray.classList.remove('show');const s=tray.querySelector('span');if(s)s.textContent=''}
  document.querySelectorAll('.alphaPlaceCard .alphaOlenSelect13').forEach(b=>{b.classList.remove('on');b.textContent='＋ Plano'});
}
document.addEventListener('click',e=>{
  if(!e.target?.closest?.('.alphaOlenPlanModal13 [data-chat]'))return;
  /* corre depois do handler do hotfix13, que primeiro coloca o pedido no composer */
  setTimeout(consumeSelection,0);
},true);
console.info('[ALPHA 4.3.30] OLEN plan state hotfix15 ativo');
})();
