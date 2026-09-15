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
if(ROOT.integrationShell?.version==='5.0.0') return;

const VERSION='5.0.0';
const VIEW_SELECTORS=Object.freeze({
  home:'#lifestyleHome',
  chat:'#lifestyleAI',
  map:'#field',
  go:'#field',
  live:'#report',
  account:'#profile'
});

let initialized=false;
let started=false;
let options={};
let disposers=[];
let activeView=null;

function emit(name,payload={}){core.emit(`shell:${name}`,payload)}
function listen(target,type,handler,opts){
  if(!target?.addEventListener) return ()=>{};
  target.addEventListener(type,handler,opts);
  const off=()=>target.removeEventListener(type,handler,opts);
  disposers.push(off);
  return off;
}
function selectorFor(view){return options.views?.[view]||VIEW_SELECTORS[view]||null}
function elementFor(view){const selector=selectorFor(view);return selector?core.qs(selector):null}
function setVisible(el,visible){
  if(!el) return;
  el.hidden=!visible;
  el.setAttribute('aria-hidden',visible?'false':'true');
  el.dataset.olen5Visible=visible?'true':'false';
}
function renderView(view,reason='route'){
  const next=String(view||router.current||'home');
  const unique=new Set(Object.keys(VIEW_SELECTORS).map(elementFor).filter(Boolean));
  unique.forEach(el=>setVisible(el,false));
  const target=elementFor(next);
  setVisible(target,true);
  document.documentElement.dataset.olenView=next;
  document.body?.setAttribute('data-olen-view',next);
  activeView=next;
  emit('view',{view:next,reason,found:!!target});
  return !!target;
}
function clearPresentation(){
  const unique=new Set(Object.keys(VIEW_SELECTORS).map(elementFor).filter(Boolean));
  unique.forEach(el=>{
    el.hidden=false;
    el.removeAttribute('aria-hidden');
    el.removeAttribute('data-olen5-visible');
  });
  document.documentElement.removeAttribute('data-olen-view');
  document.body?.removeAttribute('data-olen-view');
  activeView=null;
}
function navigate(view,reason='shell-navigation'){
  return router.enter(view,{reason});
}
function closestAction(target){return target?.closest?.('[data-olen5-nav],[data-olen5-action]')||null}
function onClick(event){
  const action=closestAction(event.target);
  if(!action) return;
  const view=action.dataset.olen5Nav;
  const command=action.dataset.olen5Action;
  if(view){
    event.preventDefault();
    navigate(view,'shell-control');
    return;
  }
  if(command==='back'){
    event.preventDefault();
    router.back({reason:'shell-control'});
  }else if(command==='chat-new'){
    event.preventDefault();
    ROOT.chat?.startFresh?.({navigate:true,focus:true});
  }else if(command==='chat-sidebar'){
    event.preventDefault();
    ROOT.chat?.toggleSidebar?.();
  }
}
function bindControls(){
  listen(document,'click',onClick);
  const offRoute=core.on('route:change',payload=>renderView(payload?.to||router.current,'route-change'));
  disposers.push(offRoute);
}
function configure(next={}){
  if(started) throw new Error('OLEN 5.0 Integration Shell cannot be reconfigured while started');
  options={...options,...next,views:{...(options.views||{}),...(next.views||{})}};
  emit('configured',{views:{...VIEW_SELECTORS,...(options.views||{})}});
  return ROOT.integrationShell;
}
function init(next={}){
  if(initialized) return ROOT.integrationShell;
  configure(next);
  initialized=true;
  bindControls();
  emit('initialized',{version:VERSION});
  return ROOT.integrationShell;
}
function start(next={}){
  if(started) return ROOT.integrationShell;
  if(!initialized) init(next);
  bootstrap.start({
    initialView:next.initialView||options.initialView||'home',
    replaceHistory:next.replaceHistory??options.replaceHistory??true,
    modules:next.modules||options.modules||{}
  });
  started=true;
  renderView(router.current,'shell-start');
  document.documentElement.dataset.olenRuntime='5.0';
  emit('started',{view:router.current});
  return ROOT.integrationShell;
}
function stop(reason='shell-stop'){
  if(!initialized) return false;
  while(disposers.length){
    const off=disposers.pop();
    try{off?.()}catch{}
  }
  clearPresentation();
  document.documentElement.removeAttribute('data-olen-runtime');
  started=false;
  initialized=false;
  emit('stopped',{reason});
  return true;
}

ROOT.integrationShell=Object.freeze({
  version:VERSION,
  configure,
  init,
  start,
  stop,
  navigate,
  renderView,
  elementFor,
  get initialized(){return initialized;},
  get started(){return started;},
  get activeView(){return activeView;},
  get config(){return {...options,views:{...(options.views||{})}};}
});

core.register('integrationShell',ROOT.integrationShell);

})();