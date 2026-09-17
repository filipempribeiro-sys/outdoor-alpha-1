/* OLEN 5.0 - GUARDED PRODUCTION CUTOVER ENTRYPOINT
   Safe bridge between the legacy production page and OLEN 5 runtime.
   Loading this file alone is inert. Cutover requires explicit opt-in through
   ?olen5=1 or localStorage key olen5-production-cutover=1.
   No Render/provider/AI calls are performed here. */
(function(global){
'use strict';
if(global.OLEN5?.productionEntry?.version==='5.0.1')return;

const VERSION='5.0.1';
const LOADER_SRC='./js/olen-runtime-loader.js';
const STORAGE_KEY='olen5-production-cutover';
let bootPromise=null;

function queryEnabled(){try{return new URLSearchParams(global.location.search).get('olen5')==='1'}catch{return false}}
function storageEnabled(){try{return global.localStorage.getItem(STORAGE_KEY)==='1'}catch{return false}}
function enabled(){return queryEnabled()||storageEnabled()}

function loadLoader(){
 if(global.OLEN5?.runtimeLoader)return Promise.resolve(global.OLEN5.runtimeLoader);
 return new Promise((resolve,reject)=>{
  let el=document.querySelector('script[data-olen5-production-loader]');
  const resolveContract=()=>{const loader=global.OLEN5?.runtimeLoader;if(!loader)return reject(new Error('olen5_runtime_loader_contract_missing'));resolve(loader)};
  if(el){
   if(global.OLEN5?.runtimeLoader)return resolve(global.OLEN5.runtimeLoader);
   if(el.dataset.olen5Loaded==='true')return resolveContract();
   el.addEventListener('load',resolveContract,{once:true});
   el.addEventListener('error',()=>reject(new Error('olen5_runtime_loader_failed')),{once:true});
   return;
  }
  el=document.createElement('script');el.src=LOADER_SRC;el.async=false;el.dataset.olen5ProductionLoader='true';
  el.addEventListener('load',()=>{el.dataset.olen5Loaded='true';resolveContract()},{once:true});
  el.addEventListener('error',()=>reject(new Error('olen5_runtime_loader_failed')),{once:true});
  document.head.appendChild(el);
 });
}

async function boot(options={}){
 if(!enabled()&&!options.force)return {ok:true,active:false,reason:'cutover_not_enabled'};
 if(global.OLEN5?.runtimeLoader?.active)return {ok:true,active:true,version:global.OLEN5.runtimeLoader.version,reason:'already_active'};
 if(bootPromise)return bootPromise;
 bootPromise=(async()=>{
  const loader=await loadLoader();
  await loader.activate(options);
  return {ok:true,active:true,version:loader.version};
 })().catch(error=>{
  document.documentElement.dataset.olen5Cutover='refused';
  console.error('[OLEN 5] production cutover refused',error);
  return {ok:false,active:false,reason:error?.message||'cutover_failed'};
 }).finally(()=>{bootPromise=null});
 return bootPromise;
}

function enablePersisted(){try{global.localStorage.setItem(STORAGE_KEY,'1');return true}catch{return false}}
function disablePersisted(){try{global.localStorage.removeItem(STORAGE_KEY);return true}catch{return false}}
function rollback(reason='production-entry-rollback'){
 disablePersisted();bootPromise=null;
 const stopped=global.OLEN5?.runtimeLoader?.deactivate?.(reason)===true;
 document.documentElement.removeAttribute('data-olen5-cutover');document.documentElement.removeAttribute('data-olen5-loaded');
 return {ok:true,stopped};
}

const api=Object.freeze({version:VERSION,STORAGE_KEY,enabled,boot,enablePersisted,disablePersisted,rollback});
global.OLEN5=global.OLEN5||{};global.OLEN5.productionEntry=api;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{void boot()},{once:true});else void boot();
})(window);
