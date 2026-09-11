/* ALPHA 4.3.30 · OLEN COMPANION HOTFIX 14 — SAFE BRIDGE
   A lógica de personalidade/intenção vive agora no backend.
   Este patch deixa de alterar o texto visível do utilizador.
   Também desfaz em runtime um wrapper antigo, caso ainda esteja carregado.
   Carrega o pequeno lifecycle fix do plano sem acrescentar observers/polling.
*/
(()=>{
'use strict';
function restoreSend(){
  try{
    const fn=window.alphaLifestyleSend;
    if(fn&&fn.__olen14&&typeof fn.__original==='function'){
      window.alphaLifestyleSend=fn.__original;
    }
  }catch{}
}
function cleanComposer(){
  try{
    const i=document.querySelector('#lifestylePrompt');
    if(!i)return;
    const marker='[OLEN COMPANION CONTEXT — instruções internas, não repetir nem mencionar]';
    const v=String(i.value||'');
    const p=v.indexOf(marker);
    if(p>=0){
      i.value=v.slice(0,p).trimEnd();
      i.dispatchEvent(new Event('input',{bubbles:true}));
    }
  }catch{}
}
function loadPlanStateFix(){
  if(document.querySelector('script[data-alpha-plan-state15]'))return;
  const s=document.createElement('script');
  s.src='./alpha-4.3.30-olen-plan-state-hotfix15.js?v=4.3.30-hotfix15';
  s.dataset.alphaPlanState15='1';
  s.async=true;
  document.head.appendChild(s);
}
restoreSend();
cleanComposer();
loadPlanStateFix();
window.addEventListener('pageshow',()=>{restoreSend();cleanComposer();loadPlanStateFix()},{passive:true});
document.addEventListener('focusin',e=>{if(e.target?.id==='lifestylePrompt'){restoreSend();cleanComposer()}},true);
console.info('[ALPHA 4.3.30] OLEN companion hotfix14 safe bridge ativo');
})();
