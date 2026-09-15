/* OLEN 5.0 · CORE
   Foundation for the controlled OLEN 5.0 consolidation.
   IMPORTANT: this file is intentionally NOT loaded by index.html or sw.js yet.
   It introduces no runtime behaviour until an explicit cutover step.
*/
(()=>{
'use strict';

if(window.OLEN?.core?.version==='5.0.0')return;

const VERSION='5.0.0';
const ROOT=window.OLEN=window.OLEN||{};
const listeners=new Map();
const cleanups=new Set();

function safe(fn,fallback){
  try{return fn()}
  catch(error){
    console.warn('[OLEN '+VERSION+']',error);
    return fallback;
  }
}

function qs(selector,root=document){return root?.querySelector?.(selector)||null}
function qsa(selector,root=document){return Array.from(root?.querySelectorAll?.(selector)||[])}
function byId(id){return document.getElementById(id)}
function visible(element){
  if(!element)return false;
  const style=getComputedStyle(element);
  const rect=element.getBoundingClientRect();
  return style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity||1)>0&&rect.width>0&&rect.height>0;
}
function norm(value){return String(value??'').replace(/\s+/g,' ').trim()}
function escapeHTML(value){
  return String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
}

function on(type,handler){
  if(typeof handler!=='function')return ()=>{};
  let set=listeners.get(type);
  if(!set){set=new Set();listeners.set(type,set)}
  set.add(handler);
  return ()=>{set.delete(handler);if(!set.size)listeners.delete(type)};
}
function once(type,handler){
  let off=()=>{};
  off=on(type,payload=>{off();handler(payload)});
  return off;
}
function emit(type,payload){
  const set=listeners.get(type);
  if(!set)return;
  [...set].forEach(handler=>safe(()=>handler(payload)));
}

function listen(target,type,handler,options){
  if(!target?.addEventListener||typeof handler!=='function')return ()=>{};
  target.addEventListener(type,handler,options);
  const off=()=>target.removeEventListener(type,handler,options);
  cleanups.add(off);
  return ()=>{cleanups.delete(off);off()};
}

function raf2(fn){
  return requestAnimationFrame(()=>requestAnimationFrame(()=>safe(fn)));
}
function later(fn,delay=0){return setTimeout(()=>safe(fn),delay)}

function storage(area='local'){
  const store=area==='session'?sessionStorage:localStorage;
  return {
    get(key,fallback=null){return safe(()=>store.getItem(key),fallback)},
    set(key,value){return safe(()=>{store.setItem(key,String(value));return true},false)},
    remove(key){return safe(()=>{store.removeItem(key);return true},false)},
    jsonGet(key,fallback=null){return safe(()=>JSON.parse(store.getItem(key)||'null')??fallback,fallback)},
    jsonSet(key,value){return safe(()=>{store.setItem(key,JSON.stringify(value));return true},false)}
  };
}

function currentView(){
  if(document.body?.classList.contains('alphaChatMode'))return 'chat';
  if(document.body?.classList.contains('alphaComposeMode'))return 'compose';
  return String(document.body?.dataset?.alphaView||'home');
}
function isChat(){const view=currentView();return view==='chat'||view==='compose'}
function isHome(){return currentView()==='home'}

function destroy(){
  [...cleanups].forEach(off=>safe(off));
  cleanups.clear();
  listeners.clear();
}

ROOT.core=Object.freeze({
  version:VERSION,
  safe,qs,qsa,byId,visible,norm,escapeHTML,
  on,once,emit,listen,raf2,later,storage,
  currentView,isChat,isHome,destroy
});

})();
