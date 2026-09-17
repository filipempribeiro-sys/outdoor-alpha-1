/* OLEN 5.0 - LEGACY DOM CUTOVER ADAPTER
   Compatibility boundary for the real ALPHA/OLEN 4.x DOM.
   No auto-start. No network. No legacy monkey-patching.
   The adapter only describes and resolves existing DOM owners so OLEN 5 can
   cut over deliberately without duplicating the production interface. */
(function(global){
'use strict';

const VERSION='5.0.0';
const VIEW_SELECTORS=Object.freeze({
  home:['#home'],
  chat:['#lifestyleAI','#home'],
  map:['#field'],
  report:['#report'],
  profile:['#profile']
});

function first(selectors,root){
  const scope=root||global.document;
  if(!scope||typeof scope.querySelector!=='function') return null;
  for(const selector of selectors||[]){
    const node=scope.querySelector(selector);
    if(node) return node;
  }
  return null;
}

function resolve(view,root){
  const id=String(view||'').trim().toLowerCase();
  const selectors=VIEW_SELECTORS[id];
  if(!selectors) return null;
  return first(selectors,root);
}

function inventory(root){
  const result={};
  for(const view of Object.keys(VIEW_SELECTORS)){
    const node=resolve(view,root);
    result[view]=Object.freeze({
      present:!!node,
      id:node&&node.id?node.id:null,
      selectors:VIEW_SELECTORS[view].slice()
    });
  }
  return Object.freeze(result);
}

function ready(root){
  const state=inventory(root);
  return Object.keys(VIEW_SELECTORS).every(view=>state[view].present);
}

function active(root){
  const scope=root||global.document;
  if(!scope) return null;
  const body=scope.body||null;
  const declared=body&&body.dataset?String(body.dataset.alphaView||'').trim().toLowerCase():'';
  if(declared&&VIEW_SELECTORS[declared]) return declared;
  for(const view of Object.keys(VIEW_SELECTORS)){
    const node=resolve(view,scope);
    if(node&&node.classList&&(node.classList.contains('active')||node.classList.contains('show'))) return view;
  }
  return null;
}

function contract(root){
  return Object.freeze({
    version:VERSION,
    ready:ready(root),
    activeView:active(root),
    views:inventory(root)
  });
}

const api=Object.freeze({VERSION,VIEW_SELECTORS,resolve,inventory,ready,active,contract});
global.OLEN5=global.OLEN5||{};
global.OLEN5.legacyDom=api;
})(typeof window!=='undefined'?window:globalThis);
