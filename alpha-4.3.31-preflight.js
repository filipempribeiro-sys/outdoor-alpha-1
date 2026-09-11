/* ALPHA 4.3.31 · PREFLIGHT
   Bloqueia apenas timers/observers globais legados conhecidos durante o
   bootstrap. As APIs nativas são restauradas no DOMContentLoaded.
*/
(()=>{
'use strict';
if(window.__alphaPreflight431)return;window.__alphaPreflight431=true;
const NativeMO=window.MutationObserver;
const nativeSetInterval=window.setInterval.bind(window);
let restored=false;
function restore(){if(restored)return;restored=true;if(NativeMO)window.MutationObserver=NativeMO;window.setInterval=nativeSetInterval}
if(NativeMO){
  window.MutationObserver=class AlphaPreflightMutationObserver{
    constructor(cb){this.cb=cb;this.native=new NativeMO(cb)}
    observe(target,opts){const src=String(this.cb||'');const heavy=target===document.documentElement&&!!opts?.subtree&&(/reconcile|\bbind\b/.test(src));if(heavy)return;return this.native.observe(target,opts)}
    disconnect(){return this.native.disconnect()}
    takeRecords(){return this.native.takeRecords()}
  };
}
window.setInterval=function alphaPreflightSetInterval(cb,delay,...args){const src=String(cb||'');const legacy=[700,1200].includes(Number(delay))&&(/reconcile|\bbind\b/.test(src));if(legacy)return -433100;return nativeSetInterval(cb,delay,...args)};
window.alphaRestorePreflight431=restore;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else queueMicrotask(restore);
setTimeout(restore,5000);
console.info('[ALPHA 4.3.31] preflight performance guard ativo');
})();
