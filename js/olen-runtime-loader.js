/* OLEN 5.0 - GUARDED PRODUCTION RUNTIME LOADER
   Loads OLEN 5 modules sequentially against the existing production DOM.
   IMPORTANT: loading is inert by default. Runtime activation requires an
   explicit call to OLEN5.runtimeLoader.activate(). No Render/network calls. */
(function(global){
'use strict';
if(global.OLEN5?.runtimeLoader?.version==='5.0.0')return;

const VERSION='5.0.0';
const MODULES=Object.freeze([
  './js/olen-core.js',
  './js/olen-experience.js',
  './js/olen-context.js',
  './js/olen-entitlement.js',
  './js/olen-mobility.js',
  './js/olen-research.js',
  './js/olen-provider.js',
  './js/olen-router.js',
  './js/olen-bootstrap.js',
  './js/olen-legacy-dom-adapter.js',
  './js/olen-integration-shell.js'
]);

let loadPromise=null;
let loaded=false;
let active=false;

function script(src){
  return new Promise((resolve,reject)=>{
    const existing=document.querySelector(`script[data-olen5-runtime="${src}"]`);
    if(existing){
      if(existing.dataset.loaded==='true')return resolve(src);
      existing.addEventListener('load',()=>resolve(src),{once:true});
      existing.addEventListener('error',()=>reject(new Error('olen5_module_load_failed:'+src)),{once:true});
      return;
    }
    const el=document.createElement('script');
    el.src=src;
    el.async=false;
    el.dataset.olen5Runtime=src;
    el.addEventListener('load',()=>{el.dataset.loaded='true';resolve(src)},{once:true});
    el.addEventListener('error',()=>reject(new Error('olen5_module_load_failed:'+src)),{once:true});
    document.head.appendChild(el);
  });
}

async function load(){
  if(loaded)return api;
  if(loadPromise)return loadPromise;
  loadPromise=(async()=>{
    for(const src of MODULES)await script(src);
    if(!global.OLEN5?.integrationShell||!global.OLEN5?.legacyDom)throw new Error('olen5_runtime_contract_missing');
    loaded=true;
    document.documentElement.dataset.olen5Loaded='true';
    return api;
  })().catch(err=>{loadPromise=null;throw err});
  return loadPromise;
}

async function activate(options={}){
  if(active)return api;
  await load();
  const contract=global.OLEN5.legacyDom.contract();
  if(!contract.ready)throw new Error('olen5_cutover_refused:legacy_dom_not_ready');
  const initialView=options.initialView||({home:'home',chat:'chat',map:'map',report:'live',profile:'account'}[contract.activeView]||'home');
  global.OLEN5.integrationShell.configure({legacyDom:true,initialView});
  global.OLEN5.integrationShell.init();
  global.OLEN5.integrationShell.start({initialView,replaceHistory:options.replaceHistory!==false});
  active=true;
  document.documentElement.dataset.olen5Cutover='active';
  return api;
}

function deactivate(reason='production-cutover-stop'){
  if(!active)return false;
  global.OLEN5?.integrationShell?.stop?.(reason);
  active=false;
  document.documentElement.removeAttribute('data-olen5-cutover');
  return true;
}

const api=Object.freeze({
  version:VERSION,
  MODULES,
  load,
  activate,
  deactivate,
  get loaded(){return loaded;},
  get active(){return active;}
});

global.OLEN5=global.OLEN5||{};
global.OLEN5.runtimeLoader=api;
})(window);
