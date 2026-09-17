/* OLEN 5.0 guarded production bridge.
   Preserve the existing chat fullscreen runtime first, then load the inert
   OLEN 5 production entrypoint. The entrypoint does not cut over unless the
   explicit OLEN 5 opt-in is present. */
(function(){
'use strict';
function load(src,attrs){
  const s=document.createElement('script');
  s.src=src;
  s.async=false;
  if(attrs)Object.entries(attrs).forEach(([k,v])=>s.dataset[k]=v);
  document.head.appendChild(s);
  return s;
}
const legacy=load('./olen-4.4.0-chat-sidebar-fullscreen-fix-legacy.js?v=451-preserved',{olenLegacyRuntime:'true'});
legacy.addEventListener('load',()=>load('./js/olen-production-entry.js?v=500-cutover',{olen5ProductionEntry:'true'}),{once:true});
legacy.addEventListener('error',()=>console.error('[OLEN] legacy chat runtime failed to load; OLEN 5 cutover not attempted'),{once:true});
})();