/* OLEN 5.0 - GUARDED PRODUCTION RUNTIME LOADER
   Loads OLEN 5 modules sequentially against the existing production DOM.
   Loading is inert by default. Activation is explicit and transactional.
   No Render/network calls are performed here. */
(function(global){
'use strict';
if(global.OLEN5?.runtimeLoader?.version==='5.0.1')return;

const VERSION='5.0.1';
const MODULES=Object.freeze(['./js/olen-core.js','./js/olen-experience.js','./js/olen-context.js','./js/olen-entitlement.js','./js/olen-mobility.js','./js/olen-research.js','./js/olen-provider.js','./js/olen-router.js','./js/olen-bootstrap.js','./js/olen-legacy-dom-adapter.js','./js/olen-integration-shell.js']);
let loadPromise=null,loaded=false,active=false,activationPromise=null;

function script(src){
 return new Promise((resolve,reject)=>{
  let existing=document.querySelector(`script[data-olen5-runtime="${src}"]`);
  if(existing){
   if(existing.dataset.loaded==='true')return resolve(src);
   if(existing.dataset.failed==='true'){existing.remove();existing=null}
  }
  if(existing){existing.addEventListener('load',()=>resolve(src),{once:true});existing.addEventListener('error',()=>reject(new Error('olen5_module_load_failed:'+src)),{once:true});return}
  const el=document.createElement('script');el.src=src;el.async=false;el.dataset.olen5Runtime=src;
  el.addEventListener('load',()=>{el.dataset.loaded='true';resolve(src)},{once:true});
  el.addEventListener('error',()=>{el.dataset.failed='true';reject(new Error('olen5_module_load_failed:'+src))},{once:true});
  document.head.appendChild(el);
 });
}

async function load(){
 if(loaded)return api;if(loadPromise)return loadPromise;
 loadPromise=(async()=>{for(const src of MODULES)await script(src);if(!global.OLEN5?.integrationShell||!global.OLEN5?.legacyDom)throw new Error('olen5_runtime_contract_missing');loaded=true;document.documentElement.dataset.olen5Loaded='true';return api})()
 .catch(err=>{document.documentElement.dataset.olen5Loaded='failed';throw err})
 .finally(()=>{loadPromise=null});
 return loadPromise;
}

async function activate(options={}){
 if(active)return api;if(activationPromise)return activationPromise;
 activationPromise=(async()=>{
  await load();
  const contract=global.OLEN5.legacyDom.contract();
  if(!contract.ready)throw new Error('olen5_cutover_refused:legacy_dom_not_ready');
  const initialView=options.initialView||({home:'home',chat:'chat',map:'map',go:'go',live:'live',account:'account'}[contract.activeView]||'home');
  const shell=global.OLEN5.integrationShell;
  try{
   shell.configure({legacyDom:true,initialView});shell.init();shell.start({initialView,replaceHistory:options.replaceHistory!==false});
   active=true;document.documentElement.dataset.olen5Cutover='active';return api;
  }catch(error){
   try{shell.stop?.('activation-failed')}catch{}
   active=false;document.documentElement.dataset.olen5Cutover='refused';throw error;
  }
 })().finally(()=>{activationPromise=null});
 return activationPromise;
}

function deactivate(reason='production-cutover-stop'){
 if(!active&&!global.OLEN5?.integrationShell?.started)return false;
 const stopped=global.OLEN5?.integrationShell?.stop?.(reason)===true;
 active=false;document.documentElement.removeAttribute('data-olen5-cutover');return stopped;
}

const api=Object.freeze({version:VERSION,MODULES,load,activate,deactivate,get loaded(){return loaded},get active(){return active}});
global.OLEN5=global.OLEN5||{};global.OLEN5.runtimeLoader=api;
})(window);
