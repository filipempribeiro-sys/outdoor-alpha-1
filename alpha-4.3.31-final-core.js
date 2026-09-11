/* ALPHA 4.3.31 · FINAL CORE
   Runtime consolidado depois da auditoria profunda.
   - uma única sidebar OLEN em Home/Chat/vistas internas
   - swipe interno sem conflito com navegação horizontal
   - Chat: Spotify + Novo chat + ⋮ funcional
   - Remote acima do conteúdo e sem sobreposição do trigger interno
   - fotos Google/Open nos cartões e detalhes, incluindo dados já persistidos
   - + Plano / Mapa / Ir usam apenas a infraestrutura interna da ALPHA
   - sem polling global; observers apenas em atributos pontuais
*/
(()=>{
'use strict';
if(window.__alphaFinalCore431)return;window.__alphaFinalCore431=true;

const BACKEND=String(window.ALPHA_AI_BACKEND_URL||'https://alpha-ai-backend-m6l3.onrender.com').replace(/\/+$/,'');
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const EDGE=38,SWIPE=58,DOM=1.25;

function isChat(){return document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode')}
function isWelcome(){return document.body?.classList.contains('alphaWelcomeActive')}
function currentView(){
  const body=clean(document.body?.dataset?.alphaView||'');
  if(body)return body;
  try{const a=$$('.view.active,.view.show,.view[aria-hidden="false"]').find(el=>{const r=el.getBoundingClientRect();return el.id&&r.width>0&&r.height>0&&getComputedStyle(el).display!=='none'});if(a?.id)return a.id}catch{}
  return clean(window.alphaShellView||'home')||'home';
}
function internalView(){const v=currentView();return !isWelcome()&&!isChat()&&!['home','lifestyleAI'].includes(v)}
function sidebar(){return $('#aiChatMenu')||$('.alphaConversationSidebar')}
function sideVisible(){const s=sidebar();if(!s)return false;try{const r=s.getBoundingClientRect(),cs=getComputedStyle(s);return s.getAttribute('aria-hidden')!=='true'&&!s.hidden&&cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>40}catch{return false}}
function openSide(){if(isWelcome())return;try{window.alphaOpenOlenSidebar?.();return}catch{}const s=sidebar();if(!s)return;s.hidden=false;s.removeAttribute('hidden');s.setAttribute('aria-hidden','false');s.classList.add('show');document.body.classList.add('alphaSidebarOpen4330','alphaOlenFunctionalOpen10')}
function closeSide(){try{window.alphaCloseOlenSidebar?.();return}catch{}const s=sidebar();if(s){s.setAttribute('aria-hidden','true');s.classList.remove('show')}document.body.classList.remove('alphaSidebarOpen4330','alphaOlenFunctionalOpen10')}
function hideLegacySide(){const s=$('#alphaInternalSidebar'),sc=$('#alphaInternalScrim');if(s){s.classList.remove('show');s.setAttribute('aria-hidden','true')}sc?.classList.remove('show')}

function style(){
  if($('#alphaFinalCore431Style'))return;
  const s=document.createElement('style');s.id='alphaFinalCore431Style';s.textContent=`
#alphaInternalSidebar,#alphaInternalScrim{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
body.alphaOlenFunctionalOpen10 #aiChatMenu,body.alphaSidebarOpen4330 #aiChatMenu,body.alphaOlenFunctionalOpen10 .alphaConversationSidebar,body.alphaSidebarOpen4330 .alphaConversationSidebar{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:9600!important}
#alphaOlenFunctionalScrim10{z-index:9590!important}
#alphaSpotifyGlobal{z-index:9400!important}
.alphaChatActions4324{z-index:900!important}
.alphaFinalChatMenuScrim431{position:fixed;inset:0;z-index:9290;background:transparent}.alphaFinalChatMenu431{position:fixed;right:14px;top:calc(env(safe-area-inset-top) + 76px);z-index:9300;width:min(300px,calc(100vw - 28px));padding:8px;border:1px solid rgba(255,255,255,.14);border-radius:22px;background:rgba(31,31,33,.985);box-shadow:0 20px 55px rgba(0,0,0,.5);backdrop-filter:blur(18px)}
.alphaFinalChatMenu431 button{width:100%;height:52px;border:0;border-radius:14px;background:transparent;color:#f5f7f6;display:flex;align-items:center;gap:14px;padding:0 15px;font:700 15px system-ui;text-align:left}.alphaFinalChatMenu431 button:active{background:rgba(255,255,255,.08)}.alphaFinalChatMenu431 svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.alphaChatMore431Final svg{width:25px;height:25px;fill:currentColor!important;stroke:none!important}
body.alphaRemoteOpen431 #alphaGlobalSpotify4324{visibility:hidden!important;pointer-events:none!important;opacity:0!important}
body.alphaRemoteOpen431 .alphaChatActions4324{z-index:850!important}
.alphaPlaceCard.has-photo>.alphaPlacePhoto{display:block!important;width:100%!important;object-fit:cover!important}
`;
  document.head.append(s);
}

function absolutePhoto(v){
  v=clean(v);if(!v)return'';
  if(/^https?:\/\//i.test(v))return v;
  if(/^\/api\/place-photo(?:\?|$)/i.test(v))return BACKEND+v;
  if(/^api\/place-photo(?:\?|$)/i.test(v))return BACKEND+'/'+v;
  return '';
}
function firstPhoto(p){
  if(!p||typeof p!=='object')return'';
  const pool=[p.photo,p.photoUrl,p.image,p.imageUrl,p.cover,p.coverUrl,p.thumbnail,p.thumbnailUrl,...(Array.isArray(p.photos)?p.photos:[]),...(Array.isArray(p.images)?p.images:[])];
  for(const x of pool){const raw=typeof x==='string'?x:(x?.url||x?.photo||x?.image||x?.src||'');const u=absolutePhoto(raw);if(u)return u}
  return'';
}
function normalizePlace(p){
  if(!p||typeof p!=='object')return p;
  const u=firstPhoto(p);if(u)p.photo=u;
  for(const k of ['photoUrl','image','imageUrl','cover','coverUrl','thumbnail','thumbnailUrl'])if(typeof p[k]==='string'&&p[k]){const n=absolutePhoto(p[k]);if(n)p[k]=n}
  for(const k of ['photos','images'])if(Array.isArray(p[k]))p[k]=p[k].map(x=>{if(typeof x==='string')return absolutePhoto(x)||x;if(x&&typeof x==='object'){const y={...x};for(const q of ['url','photo','image','src'])if(typeof y[q]==='string'){const n=absolutePhoto(y[q]);if(n)y[q]=n}return y}return x});
  return p;
}
function normalizeTree(o,seen=new WeakSet()){
  if(!o||typeof o!=='object'||seen.has(o))return false;seen.add(o);let changed=false;
  if(Array.isArray(o)){for(const x of o)changed=normalizeTree(x,seen)||changed;return changed}
  const before=String(o.photo||'');normalizePlace(o);if(String(o.photo||'')!==before)changed=true;
  for(const v of Object.values(o))if(v&&typeof v==='object')changed=normalizeTree(v,seen)||changed;
  return changed;
}
function migrateStoredPhotos(){
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';if(!/conversation|olen_plan|alpha_ai_/i.test(k))continue;const raw=localStorage.getItem(k);if(!raw||(!raw.includes('/api/place-photo')&&!raw.includes('photoUrl')&&!raw.includes('imageUrl')))continue;let d;try{d=JSON.parse(raw)}catch{continue}if(normalizeTree(d))localStorage.setItem(k,JSON.stringify(d))}}catch{}
  try{const a=window.alphaConversations?.();if(Array.isArray(a))normalizeTree(a)}catch{}
  try{const c=window.alphaCurrentConversation?.();if(c)normalizeTree(c)}catch{}
}
function registryValues(){try{return typeof alphaPlaceCardRegistry!=='undefined'&&alphaPlaceCardRegistry?.values?[...alphaPlaceCardRegistry.values()]:[]}catch{return[]}}
function placeByName(name){const n=clean(name).toLocaleLowerCase('pt-PT');if(!n)return null;for(const p of registryValues()){const x=clean(p?.name).toLocaleLowerCase('pt-PT');if(x===n||x.includes(n)||n.includes(x))return normalizePlace(p)}try{const c=window.alphaCurrentConversation?.();for(const m of c?.messages||[])for(const p of m?.placeCards||[]){const x=clean(p?.name).toLocaleLowerCase('pt-PT');if(x===n||x.includes(n)||n.includes(x))return normalizePlace(p)}}catch{}return null}
function repairCards(){
  $$('.alphaPlaceCard').forEach(card=>{
    const name=clean(card.querySelector('.alphaPlaceName')?.textContent);const p=placeByName(name),u=firstPhoto(p);if(!u)return;
    let img=card.querySelector(':scope>.alphaPlacePhoto');
    if(!img){img=document.createElement('img');img.className='alphaPlacePhoto';img.alt=name;img.loading='lazy';card.insertBefore(img,card.firstChild)}
    if(img.getAttribute('src')!==u)img.src=u;img.style.removeProperty('display');img.onerror=()=>{img.style.display='none';card.classList.remove('has-photo');card.classList.add('no-photo')};img.onload=()=>{img.style.removeProperty('display');card.classList.add('has-photo');card.classList.remove('no-photo')};
    card.classList.add('has-photo');card.classList.remove('no-photo');
  });
}
function repairHero(p){
  const host=$('#alphaPlaceDetailContent');if(!host)return;const u=firstPhoto(p);let hero=host.querySelector('.a431hero');
  if(!u){if(hero&&!hero.style.backgroundImage)hero.remove();return}
  if(!hero){hero=document.createElement('div');hero.className='a431hero';host.prepend(hero)}
  hero.style.backgroundImage=`url("${u.replace(/"/g,'%22')}")`;
}

/* Global photo helper: the original renderer only read p.photo. */
try{window.alphaPlacePhotoUrl=firstPhoto;alphaPlacePhotoUrl=firstPhoto}catch{}
const prevRegister=window.alphaRegisterPlaceCard;
if(typeof prevRegister==='function'&&!prevRegister.__alphaFinal431){
  const wrapped=function(...args){for(const a of args)if(a&&typeof a==='object')normalizePlace(a);const k=prevRegister.apply(this,args);requestAnimationFrame(repairCards);return k};wrapped.__alphaFinal431=true;window.alphaRegisterPlaceCard=wrapped;try{alphaRegisterPlaceCard=wrapped}catch{}
}
const prevRender=window.alphaRenderPlaceCards;
if(typeof prevRender==='function'&&!prevRender.__alphaFinal431){
  const wrapped=function(...args){const h=prevRender.apply(this,args);requestAnimationFrame(repairCards);return h};wrapped.__alphaFinal431=true;window.alphaRenderPlaceCards=wrapped;try{alphaRenderPlaceCards=wrapped}catch{}
}
const prevThread=window.renderAlphaLifestyleThread;
if(typeof prevThread==='function'&&!prevThread.__alphaFinal431){
  const wrapped=function(...args){const r=prevThread.apply(this,args);requestAnimationFrame(repairCards);return r};wrapped.__alphaFinal431=true;window.renderAlphaLifestyleThread=wrapped;try{renderAlphaLifestyleThread=wrapped}catch{}
}
let lastDetailKey='';
const prevOpenDetail=window.alphaOpenPlaceDetail;
if(typeof prevOpenDetail==='function'&&!prevOpenDetail.__alphaFinal431){
  const wrapped=function(key,...rest){lastDetailKey=String(key||'');let p=null;try{p=typeof alphaPlaceCardRegistry!=='undefined'?alphaPlaceCardRegistry.get(key):null}catch{}if(p)normalizePlace(p);const r=prevOpenDetail.call(this,key,...rest);requestAnimationFrame(()=>{repairHero(p||placeByName($('#alphaPlaceDetailContent .a431head h2')?.textContent));setTimeout(()=>repairHero(p||placeByName($('#alphaPlaceDetailContent .a431head h2')?.textContent)),60)});return r};wrapped.__alphaFinal431=true;window.alphaOpenPlaceDetail=wrapped;try{alphaOpenPlaceDetail=wrapped}catch{}
}

function placeFromKey(key){try{const p=typeof alphaPlaceCardRegistry!=='undefined'?alphaPlaceCardRegistry.get(key):null;return p?normalizePlace(p):null}catch{return null}}
function detailPlace(){const p=placeFromKey(lastDetailKey);if(p)return p;return placeByName($('#alphaPlaceDetailContent .a431head h2')?.textContent||$('#alphaPlaceDetailContent h2')?.textContent)}
function showInternalPlace(p,navigate){
  if(!p)return;
  const lat=Number(p.latitude),lon=Number(p.longitude);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)){try{window.toast?.('Este local ainda não tem coordenadas suficientes para o Mapa/GO.')}catch{};return}
  let e=null;try{e=typeof alphaPlaceAsExplore==='function'?alphaPlaceAsExplore(p):null}catch{}
  if(!e){try{window.toast?.('Não foi possível preparar este local no Mapa/GO.')}catch{};return}
  try{window.alphaClosePlaceDetail?.()}catch{}
  if(navigate){try{if(typeof navigateExplorePlace==='function')return navigateExplorePlace(e.id)}catch{}}
  try{if(typeof showOneExploreOnMap==='function')return showOneExploreOnMap(e.id)}catch{}
  try{window.go?.('field')}catch{}
}
function overrideMapFns(){
  const mapFn=function(key){const p=placeFromKey(key);showInternalPlace(p,false)};
  const goFn=function(key){const p=placeFromKey(key);showInternalPlace(p,true)};
  window.alphaShowPlaceOnMap=mapFn;window.alphaNavigatePlace=goFn;try{alphaShowPlaceOnMap=mapFn;alphaNavigatePlace=goFn}catch{}
}
overrideMapFns();

function draftKey(){const id=window.alphaCurrentConversation?.()?.id||'global';try{return window.userKey?window.userKey('alpha_olen_plan_draft_v1_'+id):'alpha_olen_plan_draft_v1_'+id}catch{return'alpha_olen_plan_draft_v1_'+id}}
function planSlim(p){return {id:p?.id||'',name:p?.name||'Local',category:p?.category||'',address:p?.address||'',description:p?.description||'',photo:firstPhoto(p),latitude:Number.isFinite(Number(p?.latitude))?Number(p.latitude):null,longitude:Number.isFinite(Number(p?.longitude))?Number(p.longitude):null,website:p?.website||'',maps:p?.maps||'',openingHours:Array.isArray(p?.openingHours)?p.openingHours.slice(0,14):[],rating:Number.isFinite(Number(p?.rating))?Number(p.rating):null,reviews:Number.isFinite(Number(p?.reviews??p?.userRatingCount))?Number(p.reviews??p.userRatingCount):null,duration:p?.duration||p?.typicalDuration||p?.visitDuration||'',status:p?.status||p?.openNowText||p?.currentStatus||'',occupancy:p?.occupancy||p?.busyness||p?.currentOccupancy||'',freeEntry:Array.isArray(p?.freeEntry)?p.freeEntry.slice(0,5):[]}}
function addDetailToPlan(p){
  if(!p)return;const name=clean(p.name);const card=$$('.alphaPlaceCard').find(c=>clean(c.querySelector('.alphaPlaceName')?.textContent)===name),btn=card?.querySelector('.alphaOlenSelect13');if(btn){btn.click();return}
  let a=[];try{a=JSON.parse(localStorage.getItem(draftKey())||'[]');if(!Array.isArray(a))a=[]}catch{}const x=planSlim(p),sig=v=>[v.id,v.name,v.latitude,v.longitude].join('|');if(!a.some(v=>sig(v)===sig(x)))a.push(x);try{localStorage.setItem(draftKey(),JSON.stringify(a.slice(0,24)))}catch{}try{window.toast?.('Local adicionado ao plano OLEN.')}catch{}
}

const ICON={
 info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/></svg>',
 share:'<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.1M8.7 13.3l6.6 4.1"/></svg>',
 chats:'<svg viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-9 8.4A9.8 9.8 0 0 1 7 18.5L3 20l1.5-4A8.5 8.5 0 1 1 21 11.5Z"/></svg>',
 home:'<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9h-6v-6H9v6H3v-9Z"/></svg>'
};
function closeChatMenu(){$('.alphaFinalChatMenu431')?.remove();$('.alphaFinalChatMenuScrim431')?.remove()}
function openChatMenu(){
  closeChatMenu();const sc=document.createElement('div');sc.className='alphaFinalChatMenuScrim431';sc.onclick=closeChatMenu;document.body.append(sc);const m=document.createElement('div');m.className='alphaFinalChatMenu431';m.innerHTML=`<button data-a="status">${ICON.info}<span>Estado da ALPHA</span></button><button data-a="share">${ICON.share}<span>Partilhar</span></button><button data-a="chats">${ICON.chats}<span>Conversas</span></button><button data-a="home">${ICON.home}<span>Home</span></button>`;m.onclick=async e=>{const b=e.target.closest('button[data-a]');if(!b)return;const a=b.dataset.a;closeChatMenu();if(a==='chats')return openSide();if(a==='home'){try{window.go?.('home')}catch{};return}if(a==='share'){try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else await navigator.clipboard?.writeText(location.href)}catch{};return}try{window.toast?.('ALPHA 4.3.31 · OLEN ativo')}catch{}};document.body.append(m)
}
function ensureChatCapsule(){
  const cap=$('#lifestyleAI .alphaChatActions4324');if(!cap||!isChat())return;
  let more=cap.querySelector('.alphaChatMore431Final,.alphaChatMore4330');
  if(!more){more=document.createElement('button');more.type='button';more.className='alphaChatMore431Final';more.setAttribute('aria-label','Menu');more.title='Menu';more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';cap.append(more)}else{more.classList.add('alphaChatMore431Final');more.setAttribute('aria-label','Menu')}
}
function remoteOpen(){const r=$('#alphaSpotifyGlobal'),b=$('#alphaSpotifyOverlay');return !!r&&!r.hidden&&(!b||!b.hidden)}
function syncRemote(){document.body?.classList.toggle('alphaRemoteOpen431',remoteOpen())}
function alignGlobalSpotify(){const b=$('#alphaGlobalSpotify4324');if(!b||b.hidden)return;const m=$('#alphaInternalMenuBtn,.alphaFloatingMenu,.aiChatMenuBtn');if(!m)return;try{const r=m.getBoundingClientRect();if(r.width>30&&r.height>30){b.style.top=Math.max(8,Math.round(r.top))+'px';b.style.right=Math.max(12,Math.round(innerWidth-r.right))+'px';b.style.width=Math.round(r.width)+'px';b.style.height=Math.round(r.height)+'px'}}catch{}}
function syncUi(){style();hideLegacySide();ensureChatCapsule();repairCards();syncRemote();alignGlobalSpotify()}

window.addEventListener('click',e=>{
  const t=e.target;
  if(internalView()){
    const menu=t?.closest?.('#alphaInternalMenuBtn,.aiChatMenuBtn,#aiChatMenuBtn,button[aria-label="Abrir navegação"],button[aria-label="Abrir conversas"]');
    if(menu){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();hideLegacySide();sideVisible()?closeSide():openSide();return}
  }
  const more=t?.closest?.('.alphaChatMore431Final,.alphaChatMore4330');if(more&&isChat()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openChatMenu();return}
  const plan=t?.closest?.('#alphaPlaceDetailContent [data-native="plan"]');if(plan){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();addDetailToPlan(detailPlace());return}
  const map=t?.closest?.('#alphaPlaceDetailContent [data-native="map"]');if(map){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showInternalPlace(detailPlace(),false);return}
  const go=t?.closest?.('#alphaPlaceDetailContent [data-native="go"]');if(go){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showInternalPlace(detailPlace(),true);return}
  if(t?.closest?.('.alphaSpotifyToggle4324,#spotifyNav,#alphaGlobalSpotify4324,.alphaSpotifyClose,[data-alpha-spotify-close]'))setTimeout(syncRemote,30);
},true);

let gx=0,gy=0,gTrack=false,gOpen=false;
window.addEventListener('touchstart',e=>{
  if(e.touches?.length!==1)return;const t=e.touches[0];gOpen=sideVisible();const blocked=!!e.target?.closest?.('input,textarea,select,[contenteditable="true"],#realMap,.maplibregl-map,[role="dialog"],.alphaTimePicker,.alphaCalendarEditor,.alphaPlacesRail,.photoStrip');if(blocked){gTrack=false;return}if(gOpen){gx=t.clientX;gy=t.clientY;gTrack=true;return}if(internalView()&&t.clientX<=EDGE){gx=t.clientX;gy=t.clientY;gTrack=true;return}gTrack=false;
},true);
window.addEventListener('touchend',e=>{
  if(!gTrack)return;gTrack=false;const t=e.changedTouches?.[0];if(!t)return;const dx=t.clientX-gx,dy=t.clientY-gy;if(Math.abs(dx)<SWIPE||Math.abs(dx)<Math.abs(dy)*DOM)return;e.stopPropagation();e.stopImmediatePropagation();hideLegacySide();if(gOpen&&dx<0)closeSide();else if(!gOpen&&dx>0)openSide();
},true);

try{window.alphaOpenInternalSidebar=openSide;window.alphaCloseInternalSidebar=closeSide;window.alphaToggleInternalSidebar=e=>{e?.preventDefault?.();sideVisible()?closeSide():openSide()}}catch{}

/* Atributos pontuais: mudanças de vista/chat sem observar a árvore inteira. */
if(document.body&&window.MutationObserver){const mo=new MutationObserver(()=>requestAnimationFrame(syncUi));mo.observe(document.body,{attributes:true,attributeFilter:['class','data-alpha-view']})}
const remote=$('#alphaSpotifyGlobal');if(remote&&window.MutationObserver){const mo=new MutationObserver(syncRemote);mo.observe(remote,{attributes:true,attributeFilter:['hidden']})}

migrateStoredPhotos();style();hideLegacySide();overrideMapFns();setTimeout(syncUi,0);setTimeout(syncUi,160);window.addEventListener('pageshow',()=>setTimeout(syncUi,60),{passive:true});window.addEventListener('resize',()=>requestAnimationFrame(alignGlobalSpotify),{passive:true});
console.info('[ALPHA 4.3.31] FINAL CORE ativo · sidebar única · fotos · chat · Mapa/GO');
})();
