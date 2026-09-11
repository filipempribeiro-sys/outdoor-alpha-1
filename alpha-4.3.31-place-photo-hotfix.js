/* ALPHA 4.3.31l · PLACE PHOTO / HERO HOTFIX
   Resolve URLs relativas de Google Places (/api/place-photo) contra o backend ALPHA.
   Corrige hero, galeria e novos cartões sem observers/polling.
*/
(()=>{
'use strict';
if(window.__alphaPlacePhotoHotfix431l)return;window.__alphaPlacePhotoHotfix431l=true;

const BACKEND='https://alpha-ai-backend-m6l3.onrender.com';

function absolutePhoto(u){
  u=String(u||'').trim();
  if(!u)return '';
  if(/^https?:\/\//i.test(u))return u;
  if(/^\/api\/place-photo(?:\?|$)/i.test(u))return BACKEND+u;
  if(/^api\/place-photo(?:\?|$)/i.test(u))return BACKEND+'/'+u;
  return u;
}
function normalizePlace(p){
  if(!p||typeof p!=='object')return p;
  for(const k of ['photo','photoUrl','image','imageUrl']){
    if(typeof p[k]==='string')p[k]=absolutePhoto(p[k]);
  }
  for(const k of ['photos','images']){
    if(Array.isArray(p[k]))p[k]=p[k].map(x=>{
      if(typeof x==='string')return absolutePhoto(x);
      if(x&&typeof x==='object'){
        for(const q of ['url','photo','image','src'])if(typeof x[q]==='string')x[q]=absolutePhoto(x[q]);
      }
      return x;
    });
  }
  return p;
}
function fixDom(){
  const host=document.getElementById('alphaPlaceDetailContent');
  if(!host)return;
  host.querySelectorAll('.a431hero,.a431pic').forEach(el=>{
    const raw=el.style.backgroundImage||'';
    const m=raw.match(/url\(["']?([^"')]+)["']?\)/i);
    if(!m?.[1])return;
    const next=absolutePhoto(m[1]);
    if(next&&next!==m[1])el.style.backgroundImage=`url("${next.replace(/"/g,'%22')}")`;
  });
  host.querySelectorAll('img[src]').forEach(img=>{
    const raw=img.getAttribute('src')||'';
    const next=absolutePhoto(raw);
    if(next&&next!==raw)img.src=next;
  });
}

const reg=window.alphaRegisterPlaceCard;
if(typeof reg==='function')window.alphaRegisterPlaceCard=function(...args){
  if(args.length>1)args[1]=normalizePlace(args[1]);
  else if(args.length===1&&args[0]&&typeof args[0]==='object')args[0]=normalizePlace(args[0]);
  return reg.apply(this,args);
};

const open=window.alphaOpenPlaceDetail;
if(typeof open==='function')window.alphaOpenPlaceDetail=function(...args){
  const r=open.apply(this,args);
  requestAnimationFrame(()=>{fixDom();setTimeout(fixDom,30);setTimeout(fixDom,160)});
  return r;
};

window.alphaNormalizePlacePhoto431l=absolutePhoto;
window.alphaFixPlaceHero431l=fixDom;
window.addEventListener('pageshow',()=>setTimeout(fixDom,80),{passive:true});
setTimeout(fixDom,0);
console.info('[ALPHA 4.3.31l] Place hero/photo URLs corrigidos');
})();
