/* ALPHA 4.3.31 · MEDIA BRIDGE
   Só consulta o backend para cartões reais sem fotografia. Cache local +
   observer limitado ao thread. Enriquece o objeto original e o DOM.
*/
(()=>{
'use strict';
if(window.__alphaMediaBridge431)return;window.__alphaMediaBridge431=true;
const API=String(window.ALPHA_AI_BACKEND_URL||'https://alpha-ai-backend-m6l3.onrender.com').replace(/\/+$/,'');
const CACHE='alpha_place_media_cache_v431';
const pending=new Map();
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],clean=s=>String(s??'').replace(/\s+/g,' ').trim();
function abs(v){v=clean(v);if(!v)return'';if(/^https?:\/\//i.test(v))return v;if(/^\/api\/place-photo(?:\?|$)/i.test(v))return API+v;return''}
function hasPhoto(p){return abs(p?.photo||p?.photoUrl||p?.image||p?.imageUrl||'')}
function cache(){try{return JSON.parse(localStorage.getItem(CACHE)||'{}')||{}}catch{return{}}}
function save(c){try{localStorage.setItem(CACHE,JSON.stringify(c))}catch{}}
function key(name){return clean(name).toLocaleLowerCase('pt-PT')}
function registryPlace(name){const n=key(name);try{if(typeof alphaPlaceCardRegistry!=='undefined'&&alphaPlaceCardRegistry?.values){for(const p of alphaPlaceCardRegistry.values()){const x=key(p?.name);if(x===n||x.includes(n)||n.includes(x))return p}}}catch{}try{for(const m of window.alphaCurrentConversation?.()?.messages||[])for(const p of m?.placeCards||[]){const x=key(p?.name);if(x===n||x.includes(n)||n.includes(x))return p}}catch{}return null}
function apply(p,d){if(!p||!d)return;const u=abs(d.photo);if(u&&!hasPhoto(p))p.photo=u;if(p.rating==null&&d.rating!=null)p.rating=d.rating;if(p.reviews==null&&d.reviews!=null)p.reviews=d.reviews;if(!p.category&&d.category)p.category=d.category;if((p.openNow==null)&&typeof d.openNow==='boolean')p.openNow=d.openNow;if((!Array.isArray(p.openingHours)||!p.openingHours.length)&&Array.isArray(d.openingHours))p.openingHours=d.openingHours;if(!p.maps&&d.maps)p.maps=d.maps;if(!p.website&&d.website)p.website=d.website;if(!Number.isFinite(+p.latitude)&&Number.isFinite(+d.latitude))p.latitude=+d.latitude;if(!Number.isFinite(+p.longitude)&&Number.isFinite(+d.longitude))p.longitude=+d.longitude;p.__alphaGoogleMedia=true}
function paint(card,p){const u=hasPhoto(p);if(!u)return false;let img=card.querySelector(':scope>.alphaPlacePhoto');if(!img){img=document.createElement('img');img.className='alphaPlacePhoto';img.loading='lazy';img.alt=clean(p.name);card.prepend(img)}img.onload=()=>{card.classList.add('has-photo');card.classList.remove('no-photo');img.style.removeProperty('display')};img.onerror=()=>{img.style.display='none'};if(img.getAttribute('src')!==u)img.src=u;card.classList.add('has-photo');card.classList.remove('no-photo');return true}
async function enrich(p){if(!p?.name||hasPhoto(p))return p;const k=key(p.name),c=cache(),old=c[k];if(old&&Date.now()-Number(old.t||0)<86400000){apply(p,old.place);return p}if(pending.has(k)){const d=await pending.get(k);apply(p,d);return p}const u=new URL(API+'/api/place-media');u.searchParams.set('query',clean(p.name));if(Number.isFinite(+p.latitude))u.searchParams.set('lat',String(+p.latitude));if(Number.isFinite(+p.longitude))u.searchParams.set('lon',String(+p.longitude));const task=fetch(u.toString(),{cache:'no-store'}).then(async r=>{if(!r.ok)return null;const d=await r.json().catch(()=>null);return d?.place||null}).catch(()=>null).finally(()=>pending.delete(k));pending.set(k,task);const d=await task;if(d){c[k]={t:Date.now(),place:d};save(c);apply(p,d)}return p}
async function scan(){const cards=$$('.alphaPlaceCard');for(const card of cards){const name=clean(card.querySelector('.alphaPlaceName')?.textContent);if(!name)continue;const p=registryPlace(name);if(!p)continue;if(paint(card,p))continue;await enrich(p);paint(card,p)}try{window.alphaFixPlaceHero431?.()}catch{}}
function watch(){const t=$('#lifestyleThread');if(!t||t.dataset.alphaMediaWatch431)return;if(t.dataset)t.dataset.alphaMediaWatch431='1';let raf=0;new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(scan)}).observe(t,{childList:true,subtree:true})}
document.addEventListener('click',e=>{if(e.target?.closest?.('.alphaPlaceCard'))setTimeout(scan,30)},true);window.addEventListener('pageshow',()=>{watch();setTimeout(scan,100)},{passive:true});setTimeout(()=>{watch();scan()},160);window.alphaScanPlaceMedia431=scan;console.info('[ALPHA 4.3.31] media bridge ativo');
})();
