/* OLEN 5.0 - REVERSIBLE CUTOVER CONTRACT TESTS
   Deterministic browser-side contract checks. No network/provider/Reality use. */
(function(global){
'use strict';
async function run(){
 const results=[];
 const test=async(name,fn)=>{try{await fn();results.push({name,ok:true})}catch(error){results.push({name,ok:false,error:error?.message||String(error)})}};
 const assert=(condition,message)=>{if(!condition)throw new Error(message||'assertion_failed')};
 await test('Runtime loader exists',()=>assert(global.OLEN5?.runtimeLoader?.version==='5.0.0'));
 await test('Production entry exists',()=>assert(global.OLEN5?.productionEntry?.version==='5.0.0'));
 await test('Loader remains network-agnostic',()=>assert(!global.OLEN5.runtimeLoader.MODULES.some(src=>/^https?:/i.test(src))));
 await test('Legacy adapter is part of runtime',()=>assert(global.OLEN5.runtimeLoader.MODULES.includes('./js/olen-legacy-dom-adapter.js')));
 await test('Integration shell is part of runtime',()=>assert(global.OLEN5.runtimeLoader.MODULES.includes('./js/olen-integration-shell.js')));
 await test('Legacy DOM contract is complete',()=>{const c=global.OLEN5?.legacyDom?.contract?.();assert(c&&c.ready,'legacy_dom_not_ready')});
 await test('Cutover is active',()=>assert(global.OLEN5.runtimeLoader.active&&global.OLEN5.integrationShell?.started,'cutover_not_active'));
 await test('Rollback restores non-active runtime',()=>{const stopped=global.OLEN5.productionEntry.rollback('contract-test');assert(stopped?.ok,'rollback_failed');assert(global.OLEN5.runtimeLoader.active===false,'loader_still_active');assert(global.OLEN5.integrationShell?.started===false,'shell_still_started')});
 const passed=results.filter(r=>r.ok).length;
 return {ok:passed===results.length,score:`${passed}/${results.length}`,passed,total:results.length,results};
}
global.OLEN5=global.OLEN5||{};
global.OLEN5.cutoverContractTest=Object.freeze({run});
})(window);
