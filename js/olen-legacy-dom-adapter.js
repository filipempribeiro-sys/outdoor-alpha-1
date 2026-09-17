/* OLEN 5.0 - LEGACY DOM CUTOVER ADAPTER
   Compatibility boundary for the real ALPHA/OLEN 4.x DOM.
   No auto-start. No network. No legacy monkey-patching.
   The adapter resolves existing production owners and translates them to the
   OLEN 5 view contract without creating or replacing legacy DOM nodes. */
(function(global){
'use strict';

const VERSION='5.0.1';
const VIEW_SELECTORS=Object.freeze({
  home:['#lifestyleHome','#home'],
  chat:['#lifestyleAI','#home'],
  map:['#field'],
  go:['#field'],
  live:['#report'],
  account:['#profile']
});
const REQUIRED=Object.freeze(['home','chat','map','live','account']);
const LEGACY_VIEW_MAP=Object.freeze({report:'live',profile:'account'});

function first(selectors,root){
  const scope=root||global.document;
  if(!scope||typeof scope.querySelector!=='function') return null;
  for(const selector of selectors||[]){
    const node=scope.querySelector(selector);
    if(node) return node;
  }
  return null;
}

function normalizeView(view){
  const id=String(view||'').trim().toLowerCase();
  return LEGACY_VIEW_MAP[id]||id;
}

function resolve(view,root){
  const id=normalizeView(view);
  const selectors=VIEW_SELECTORS[id];
  return selectors?first(selectors,root):null;
}

function inventory(root){
  const result={};
  for(const view of Object.keys(VIEW_SELECTORS)){
    const node=resolve(view,root);
    result[view]=Object.freeze({present:!!node,id:node&&node.id?node.id:null,selectors:VIEW_SELECTORS[view].slice()});
  }
  return Object.freeze(result);
}

function ready(root){
  const state=inventory(root);
  return REQUIRED.every(view=>state[view]?.present);
}

function active(root){
  const scope=root||global.document;
  if(!scope) return null;
  const body=scope.body||null;
  const declared=normalizeView(body&&body.dataset?body.dataset.alphaView:'');
  if(declared&&VIEW_SELECTORS[declared]) return declared;
  for(const view of REQUIRED){
    const node=resolve(view,scope);
    if(node&&node.classList&&(node.classList.contains('active')||node.classList.contains('show'))) return view;
  }
  return null;
}

function contract(root){
  return Object.freeze({version:VERSION,ready:ready(root),activeView:active(root),required:REQUIRED.slice(),views:inventory(root)});
}

const api=Object.freeze({VERSION,VIEW_SELECTORS,REQUIRED,normalizeView,resolve,inventory,ready,active,contract});
global.OLEN5=global.OLEN5||{};
global.OLEN5.legacyDom=api;
})(typeof window!=='undefined'?window:globalThis);
