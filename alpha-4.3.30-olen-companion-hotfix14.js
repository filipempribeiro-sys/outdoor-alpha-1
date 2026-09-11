/* ALPHA 4.3.30 · OLEN COMPANION HOTFIX 14 — SAFE BRIDGE
   A lógica de personalidade/intenção vive agora no backend.
   Este patch deixa de alterar o texto visível do utilizador.
   Também desfaz em runtime um wrapper antigo, caso ainda esteja carregado.
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
restoreSend();
cleanComposer();
window.addEventListener('pageshow',()=>{restoreSend();cleanComposer()},{passive:true});
document.addEventListener('focusin',e=>{if(e.target?.id==='lifestylePrompt'){restoreSend();cleanComposer()}},true);
console.info('[ALPHA 4.3.30] OLEN companion hotfix14 safe bridge ativo');
})();
