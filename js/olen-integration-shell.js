/* OLEN 5.0 - INTEGRATION SHELL
   Isolated bridge between the clean OLEN 5.0 owners and the existing DOM.
   No OLEN 4.x calls, no runtime patching and no automatic start.
   Cutover is explicit: configure -> init -> start.
*/
(()=>{
'use strict';

const ROOT=window.OLEN5;
const core=ROOT?.core;
const router=ROOT?.router;
const bootstrap=ROOT?.bootstrap;
if(!core||!router||!bootstrap) throw new Error('OLEN 5.0 Integration Shell requires core, router and bootstrap');
if(ROOT.integrationShell?.version==='5.0.1') return;

const VERSION='5.0.1';
const VIEW_SELECTORS=Object.freeze({home:'#lifestyleHome',chat:'#lifestyleAI',map:'#field',go:'#field',live:'#report',account:'#profile'});
const LEGACY_VIEW_MAP=Object.freeze({home:'home',chat:'chat',map:'map',go:'go',live:'live',account:'account'});
let initialized=false,started=false,options={},disposers=[],activeView=null;
const presentationSnapshot=new Map();

function emit(name,payload={}){core.emit(`shell:${name}`,payload)}
function listen(target,type,handler,opts){if(!target?.addEventListener)return()=>{};target.addEventListener(type,handler,opts);const off=()=>target.removeEventListener(type,handler,opts);disposers.push(off);return off}
function legacyAdapter(){return ROOT?.legacyDom||null}
function selectorFor(view){return options.views?.[view]||VIEW_SELECTORS[view]||null}
function elementFor(view){
 const explicit=options.views?.[view];if(explicit)return core.qs(explicit);
 if(options.legacyDom===true){const resolved=legacyAdapter()?.resolve?.(LEGACY_VIEW_MAP[view]);if(resolved)return resolved}
 const selector=selectorFor(view);return selector?core.qs(selector):null;
}
function presentationElements(){return new Set(Object.keys(VIEW_SELECTORS).map(elementFor).filter(Boolean))}
function remember(el){if(!el||presentationSnapshot.has(el))return;presentationSnapshot.set(el,{hidden:el.hidden,ariaHidden:el.getAttribute('aria-hidden'),olen5Visible:el.getAttribute('data-olen5-visible')})}
function setVisible(el,visible){if(!el)return;remember(el);el.hidden=!visible;el.setAttribute('aria-hidden',visible?'false':'true');el.dataset.olen5Visible=visible?'true':'false'}
function restorePresentation(){
 for(const [el,state] of presentationSnapshot){
  el.hidden=state.hidden;
  if(state.ariaHidden===null)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden',state.ariaHidden);
  if(state.olen5Visible===null)el.removeAttribute('data-olen5-visible');else el.setAttribute('data-olen5-visible',state.olen5Visible);
 }
 presentationSnapshot.clear();
 document.documentElement.removeAttribute('data-olen-view');document.body?.removeAttribute('data-olen-view');activeView=null;
}
function renderView(view,reason='route'){
 const next=String(view||router.current||'home');const unique=presentationElements();unique.forEach(el=>setVisible(el,false));const target=elementFor(next);setVisible(target,true);
 document.documentElement.dataset.olenView=next;document.body?.setAttribute('data-olen-view',next);activeView=next;emit('view',{view:next,reason,found:!!target,legacyDom:options.legacyDom===true});return!!target;
}
function navigate(view,reason='shell-navigation'){return router.enter(view,{reason})}
function closestAction(target){return target?.closest?.('[data-olen5-nav],[data-olen5-action]')||null}
function onClick(event){const action=closestAction(event.target);if(!action)return;const view=action.dataset.olen5Nav,command=action.dataset.olen5Action;if(view){event.preventDefault();navigate(view,'shell-control');return}if(command==='back'){event.preventDefault();router.back({reason:'shell-control'})}else if(command==='chat-new'){event.preventDefault();ROOT.chat?.startFresh?.({navigate:true,focus:true})}else if(command==='chat-sidebar'){event.preventDefault();ROOT.chat?.toggleSidebar?.()}}
function bindControls(){listen(document,'click',onClick);const offRoute=core.on('route:change',payload=>renderView(payload?.to||router.current,'route-change'));disposers.push(offRoute)}
function assertLegacyBoundary(){if(options.legacyDom!==true)return;const adapter=legacyAdapter();if(!adapter)throw new Error('OLEN 5.0 legacy DOM cutover requires olen-legacy-dom-adapter');const state=adapter.contract?.();if(!state?.ready)throw new Error('OLEN 5.0 legacy DOM cutover refused: required production owners are missing')}
function configure(next={}){if(started)throw new Error('OLEN 5.0 Integration Shell cannot be reconfigured while started');options={...options,...next,views:{...(options.views||{}),...(next.views||{})}};emit('configured',{views:{...VIEW_SELECTORS,...(options.views||{})},legacyDom:options.legacyDom===true});return ROOT.integrationShell}
function init(next={}){if(initialized)return ROOT.integrationShell;configure(next);assertLegacyBoundary();initialized=true;bindControls();emit('initialized',{version:VERSION,legacyDom:options.legacyDom===true});return ROOT.integrationShell}
function start(next={}){if(started)return ROOT.integrationShell;if(!initialized)init(next);assertLegacyBoundary();bootstrap.start({initialView:next.initialView||options.initialView||'home',replaceHistory:next.replaceHistory??options.replaceHistory??true,modules:next.modules||options.modules||{}});started=true;renderView(router.current,'shell-start');document.documentElement.dataset.olenRuntime='5.0';emit('started',{view:router.current,legacyDom:options.legacyDom===true});return ROOT.integrationShell}
function stop(reason='shell-stop'){
 if(!initialized&&!started&&!bootstrap.started)return false;
 if(bootstrap.started)bootstrap.destroy();while(disposers.length){const off=disposers.pop();try{off?.()}catch{}}
 restorePresentation();document.documentElement.removeAttribute('data-olen-runtime');started=false;initialized=false;emit('stopped',{reason});return true;
}

ROOT.integrationShell=Object.freeze({version:VERSION,configure,init,start,stop,navigate,renderView,elementFor,get initialized(){return initialized},get started(){return started},get activeView(){return activeView},get config(){return{...options,views:{...(options.views||{})}}}});
core.register('integrationShell',ROOT.integrationShell);
})();