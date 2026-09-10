/* ALPHA 4.3.30 · OLEN PLACEHOLDER HOTFIX 12
   Atualiza apenas a identidade visível do composer: Alpha -> OLEN.
*/
(()=>{
'use strict';
function apply(){
  const nodes=[...document.querySelectorAll('input[placeholder],textarea[placeholder]')];
  for(const el of nodes){
    const p=String(el.getAttribute('placeholder')||'');
    if(/^Pergunta\s+à\s+Alpha(?:\.\.\.|…)?$/i.test(p.trim())){
      el.setAttribute('placeholder','Pergunta à OLEN...');
    }
  }
}
apply();
document.addEventListener('focusin',e=>{
  const el=e.target;
  if(!el?.matches?.('input[placeholder],textarea[placeholder]'))return;
  const p=String(el.getAttribute('placeholder')||'');
  if(/^Pergunta\s+à\s+Alpha(?:\.\.\.|…)?$/i.test(p.trim()))el.setAttribute('placeholder','Pergunta à OLEN...');
},true);
window.addEventListener('pageshow',apply,{passive:true});
console.info('[ALPHA 4.3.30] OLEN placeholder hotfix12 ativo');
})();
