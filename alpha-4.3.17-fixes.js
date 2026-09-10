/* ALPHA 4.3.18 · FIELD TEST FIX PACK
   Correções não destrutivas sobre a 4.3.16.
   - OLEN no progresso do Chat
   - Spotify Remote persistente no Chat
   - sincronização modo ↔ marcador
   - mapa GO repaint/resize
   - rota persistida sem auto-retoma após reabrir a app
   - pergunta Retomar / Terminar rota ao regressar ao Mapa/GO
   - limpeza segura de loops de snap junto ao GPS
   - detalhes normalizados/deduplicados
   - ratings apenas com proveniência explícita
   - versão visível sincronizada no arranque dinâmico
*/
(()=>{
'use strict';
const VERSION='4.3.18';
const log=(...a)=>console.info('[ALPHA '+VERSION+']',...a);
function safe(fn){try{return fn()}catch(e){console.warn('[ALPHA '+VERSION+']',e);return undefined}}
function $id(id){return document.getElementById(id)}
function visible(el){if(!el)return false;const r=el.getBoundingClientRect();const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0}

/* PERSONA */
function activePersonaName(){if(document.body.classList.contains('alphaChatMode'))return 'OLEN';const explicit=document.querySelector('[data-alpha-persona].active,[data-persona].active,#activePersona');const n=String(explicit?.dataset?.alphaPersona||explicit?.dataset?.persona||explicit?.textContent||'').trim();return n&&n.length<30?n:'ALPHA'}
function fixPersonaLabels(root=document){const persona=activePersonaName();root.querySelectorAll?.('.alphaLiveProgressHead span,.aiGeneratingRow span').forEach(el=>{const t=String(el.textContent||'').trim();if(/^A ALPHA está a trabalhar$/i.test(t)||/^ALPHA está a trabalhar$/i.test(t))el.textContent=persona+' está a trabalhar';if(/^A Alpha está a responder$/i.test(t)||/^ALPHA está a responder$/i.test(t))el.textContent=persona+' está a responder'})}

/* RATINGS */
function verifiedRatingSource(p){const src=String(p?.ratingSource||p?.ratingsSource||p?.reviewSource||p?.provider||'').toLowerCase();return p?.ratingVerified===true||p?.reviewsVerified===true||/(google places|google_places|tripadvisor|booking\.com|foursquare|yelp)/.test(src)}
safe(()=>{if(typeof alphaPlaceRating==='function'){const old=alphaPlaceRating;alphaPlaceRating=function(p){return verifiedRatingSource(p)?old(p):null}}if(typeof alphaPlaceReviews==='function'){const old=alphaPlaceReviews;alphaPlaceReviews=function(p){return verifiedRatingSource(p)?old(p):null}}});
function hideUnverifiedRenderedRatings(root=document){root.querySelectorAll?.('.alphaPlaceRating').forEach(el=>{const holder=el.closest('[data-rating-source],[data-rating-verified]');if(!holder)el.remove()})}

/* DETALHES */
const IMPORTANT_LABELS=new Set(['Estado','Última entrada','Preços','Horários','Transportes','Acessibilidade']);
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/https?:\/\/\S+/g,'').replace(/[^a-z0-9€%:+-]+/g,' ').replace(/\s+/g,' ').trim()}
function scoreLine(s,label=''){const x=norm(s);let n=0;if(/\bhoje\b|\baberto\b|\bencerrado\b|\bultima entrada\b/.test(x))n+=12;if(/\bgratuit|\bentrada livre\b/.test(x))n+=8;if(/\badulto\b|\bjovem\b|\bsenior\b|\bfamilia\b/.test(x))n+=4;if(/\d{1,2}:\d{2}|\d+[,.]?\d*\s*€/.test(x))n+=4;if(IMPORTANT_LABELS.has(label))n+=2;n+=Math.min(4,String(s).length/90);return n}
function dedupeLines(lines,label=''){const raw=(lines||[]).map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean),chosen=[];raw.sort((a,b)=>scoreLine(b,label)-scoreLine(a,label));for(const s of raw){const a=norm(s);if(!a)continue;const duplicate=chosen.some(old=>{const b=norm(old);if(a===b)return true;if(a.length>28&&b.length>28&&(a.includes(b)||b.includes(a)))return true;const ta=new Set(a.split(' ').filter(x=>x.length>2)),tb=new Set(b.split(' ').filter(x=>x.length>2));if(!ta.size||!tb.size)return false;let same=0;ta.forEach(x=>{if(tb.has(x))same++});return same/Math.min(ta.size,tb.size)>.84});if(!duplicate)chosen.push(s)}return chosen.sort((a,b)=>raw.indexOf(a)-raw.indexOf(b))}
function compactSpan(span,label){if(!span||span.dataset.alpha4318Done==='1')return;const lines=dedupeLines(String(span.innerText||span.textContent||'').split(/\n+/),label);if(!lines.length)return;const max=label==='Preços'?5:4,first=lines.slice(0,max),extra=lines.slice(max);span.textContent='';first.forEach((s,i)=>{if(i)span.append(document.createElement('br'));span.append(document.createTextNode(s))});if(extra.length){const details=document.createElement('details');details.className='alpha4318More';const sum=document.createElement('summary');sum.textContent='Ver mais ('+extra.length+')';details.append(sum);const box=document.createElement('div');box.className='alpha4318MoreBody';extra.forEach((s,i)=>{if(i)box.append(document.createElement('br'));box.append(document.createTextNode(s))});details.append(box);span.append(details)}span.dataset.alpha4318Done='1'}
function compactPlaceDetails(root=document){root.querySelectorAll?.('.alphaPlaceInfoRow').forEach(row=>compactSpan(row.querySelector('span'),String(row.querySelector('b')?.textContent||'').trim()))}

/* MODO ↔ MARCADOR */
const MODE_VEHICLE={walk:'arrow',bike:'bike',scooter:'scooter',moto:'moto',car:'car-red'};
function syncVehicleToMode(mode){safe(()=>{const m=mode||document.querySelector('.navMode.active')?.dataset?.mode||navigationMode||'walk',wanted=MODE_VEHICLE[m]||'arrow';if(navVehicleStyle!==wanted){navVehicleStyle=wanted;localStorage.setItem(userKey(NAV_VEHICLE_KEY),wanted)}if(typeof renderVehicleUI==='function')renderVehicleUI()})}
document.addEventListener('click',e=>{const b=e.target.closest?.('.navMode');if(b)setTimeout(()=>syncVehicleToMode(b.dataset.mode),0)},true);

/* MAPA */
let lastMapVisible=false;
function refreshGoMap(force=false){safe(()=>{const host=$id('realMap');if(!host||!visible(host)||typeof map==='undefined'||!map)return;if(force||!lastMapVisible){map.resize();map.triggerRepaint?.();setTimeout(()=>safe(()=>{map.resize();map.triggerRepaint?.()}),180);setTimeout(()=>safe(()=>{map.resize();map.triggerRepaint?.()}),700)}lastMapVisible=true})}
function watchMapVisibility(){const host=$id('realMap'),is=visible(host);if(is)refreshGoMap(!lastMapVisible);else lastMapVisible=false}
window.addEventListener('resize',()=>setTimeout(()=>refreshGoMap(true),80),{passive:true});window.addEventListener('orientationchange',()=>setTimeout(()=>refreshGoMap(true),240),{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>refreshGoMap(true),120)});window.addEventListener('pageshow',()=>setTimeout(()=>refreshGoMap(true),120));safe(()=>{if(typeof map!=='undefined'&&map){map.on('style.load',()=>refreshGoMap(true));map.on('idle',()=>refreshGoMap(false))}});

/* ROTA · NÃO AUTO-RETOMAR */
const RESUME_KEY='alpha_route_resume_pending_v4318';
let routeResumeAsked=false;
function storedRoute(){try{const r=JSON.parse(localStorage.getItem(userKey(ACTIVE_ROUTE_KEY))||'null');if(!r||!r.geometry?.coordinates?.length||Date.now()-Number(r.createdAt||0)>172800000)return null;return r}catch{return null}}
function clearRouteMemory(){safe(()=>{localStorage.removeItem(userKey(ACTIVE_ROUTE_KEY));localStorage.removeItem(userKey('alpha_multistop_plan_'));localStorage.removeItem(userKey('alpha_car_journey_'));sessionStorage.removeItem(RESUME_KEY)});safe(()=>{exploreRouteGeoJSON=null;exploreRouteSteps=[];exploreRouteOrdered=[];activeExploreNavTarget=null;liveNavActive=false;navStepIndex=0;if(typeof renderExploreRoute==='function')renderExploreRoute();if(typeof updateLiveNavUI==='function')updateLiveNavUI();if(typeof updateNavigationOverlay==='function')updateNavigationOverlay()})}
function routeDestinationName(r){const stops=Array.isArray(r?.stops)?r.stops:[];return stops.length?String(stops[stops.length-1]?.name||stops[0]?.name||'o destino'):'o destino'}
function dismissResume(){document.getElementById('alphaRouteResume4318')?.remove()}
function finishPreviousRoute(){dismissResume();clearRouteMemory();routeResumeAsked=true;safe(()=>toast('Rota anterior terminada'))}
function resumePreviousRoute(){dismissResume();routeResumeAsked=true;safe(()=>{if(typeof restoreActiveRoute==='function'&&restoreActiveRoute()){const r=storedRoute();const mode=String(r?.summary?.mode||'walk');if(['walk','bike','scooter','moto','car'].includes(mode))navigationMode=mode;syncVehicleToMode(navigationMode);if(typeof renderExploreRoute==='function')renderExploreRoute(0);if(typeof fitActiveRoute==='function')fitActiveRoute(true);if(typeof updateNavigationOverlay==='function')updateNavigationOverlay();refreshGoMap(true);toast('Rota anterior recuperada')}else toast('A rota anterior já não está disponível')})}
function askResumeRoute(){if(routeResumeAsked||document.getElementById('alphaRouteResume4318'))return;const r=storedRoute();if(!r)return;routeResumeAsked=true;const wrap=document.createElement('div');wrap.id='alphaRouteResume4318';wrap.style.cssText='position:fixed;inset:0;z-index:99998;background:rgba(2,10,13,.68);backdrop-filter:blur(8px);display:grid;place-items:center;padding:18px';const card=document.createElement('div');card.style.cssText='width:min(470px,100%);background:linear-gradient(180deg,#0b2324,#091820);border:1px solid #31544d;border-radius:24px;padding:20px;box-shadow:0 24px 70px rgba(0,0,0,.5)';card.innerHTML='<div style="color:#55e6ae;font-size:11px;font-weight:900;letter-spacing:.12em">NAVEGAÇÃO ANTERIOR</div><h2 style="margin:9px 0 7px">Queres continuar a rota?</h2><p style="color:#a9bbb5;line-height:1.45;margin:0 0 16px">Tinhas uma navegação em curso para <b style="color:#fff">'+String(routeDestinationName(r)).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))+'</b>.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:9px"><button id="alphaRouteResumeYes" style="min-height:48px;border:0;border-radius:14px;background:#39d69b;color:#fff;font-weight:900">Retomar</button><button id="alphaRouteResumeNo" style="min-height:48px;border:1px solid #40545a;border-radius:14px;background:#14262c;color:#fff;font-weight:900">Terminar rota</button></div>';wrap.append(card);document.body.append(wrap);card.querySelector('#alphaRouteResumeYes').onclick=resumePreviousRoute;card.querySelector('#alphaRouteResumeNo').onclick=finishPreviousRoute}
function suspendPersistedRouteOnLaunch(){const r=storedRoute();if(!r)return;safe(()=>{exploreRouteGeoJSON=null;exploreRouteSteps=[];exploreRouteOrdered=[];activeExploreNavTarget=null;liveNavActive=false;navStepIndex=0;sessionStorage.setItem(RESUME_KEY,'1');const shell=$id('mapShell');shell?.classList.remove('routeReady','liveNavigating')})}
function mapRequested(){const host=$id('realMap');return !!host&&visible(host)}
function ensureMapRequested(){refreshGoMap(true);if(sessionStorage.getItem(RESUME_KEY)==='1'&&storedRoute())setTimeout(askResumeRoute,160)}
document.addEventListener('click',e=>{const b=e.target.closest?.('button,a');if(!b)return;const t=String(b.textContent||'').trim().toLowerCase();if(t==='mapa'||t.includes('navegação')||t.includes('navegacao')||t==='ir'||t.includes('mapa/go'))setTimeout(ensureMapRequested,100)},true);

/* SNAP LOOP */
function distM(a,b){const R=6371000,p1=a[1]*Math.PI/180,p2=b[1]*Math.PI/180,dp=(b[1]-a[1])*Math.PI/180,dl=(b[0]-a[0])*Math.PI/180,h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function trimInitialSnapLoop(){safe(()=>{if(typeof pos==='undefined'||!pos||typeof exploreRouteGeoJSON==='undefined')return;const c=exploreRouteGeoJSON?.coordinates;if(!Array.isArray(c)||c.length<12)return;const gps=[Number(pos.longitude),Number(pos.latitude)];if(!gps.every(Number.isFinite))return;let travelled=0,lastNear=-1;for(let i=1;i<Math.min(c.length,220);i++){travelled+=distM(c[i-1],c[i]);if(travelled>40&&travelled<650&&distM(c[i],gps)<28)lastNear=i}if(lastNear>2){const removed=c.slice(0,lastNear+1).reduce((d,p,i,a)=>i?d+distM(a[i-1],p):0,0);if(removed>70){exploreRouteGeoJSON={...exploreRouteGeoJSON,coordinates:c.slice(lastNear)};if(typeof persistActiveRoute==='function')persistActiveRoute({trimmedInitialSnapLoop:true,trimmedMeters:Math.round(removed),mode:(typeof navigationMode!=='undefined'?navigationMode:'walk')});if(typeof renderExploreRoute==='function')renderExploreRoute()}}})}

/* SPOTIFY */
const REMOTE_KEY='alpha_spotify_remote_wanted_v2';function chatMode(){return document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode')}function remotePersisted(){try{return localStorage.getItem(REMOTE_KEY)!=='0'}catch{return true}}
safe(()=>{if(typeof alphaSpotifyRememberRemote==='function')alphaSpotifyRememberRemote=function(open){alphaSpotifyRemoteWanted=!!open;try{localStorage.setItem(REMOTE_KEY,open?'1':'0');sessionStorage.setItem('alpha_spotify_remote_wanted_v1',open?'1':'0')}catch{}};if(chatMode()&&remotePersisted())alphaSpotifyRemoteWanted=true});
function reviveSpotifyRemote(){safe(()=>{if(!chatMode())return;if(remotePersisted())alphaSpotifyRemoteWanted=true;if(typeof alphaSpotifyPollGlobal==='function')alphaSpotifyPollGlobal(true)})}
window.addEventListener('pageshow',reviveSpotifyRemote);document.addEventListener('visibilitychange',()=>{if(!document.hidden)reviveSpotifyRemote()});window.addEventListener('focus',reviveSpotifyRemote);

/* VERSÃO VISÍVEL */
function syncVisibleVersion(){document.querySelector('meta[name="alpha-version"]')?.setAttribute('content',VERSION);const v=$id('alphaTestVersion');if(v)v.textContent='v'+VERSION;const s=$id('alphaCompassStatus');if(s&&/A iniciar a ALPHA/i.test(s.textContent||''))s.textContent='A iniciar a ALPHA '+VERSION+'…'}

let scheduled=false;function reconcile(){scheduled=false;fixPersonaLabels();hideUnverifiedRenderedRatings();compactPlaceDetails();watchMapVisibility();syncVisibleVersion();if(chatMode())reviveSpotifyRemote()}
const mo=new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(reconcile)}});mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});

/* Importante: suspender ANTES de qualquer restauro visual tardio do build base. */
suspendPersistedRouteOnLaunch();
setTimeout(()=>{suspendPersistedRouteOnLaunch();syncVehicleToMode();reconcile()},120);
setTimeout(()=>{suspendPersistedRouteOnLaunch();reconcile();refreshGoMap(true);if(mapRequested()&&sessionStorage.getItem(RESUME_KEY)==='1')askResumeRoute()},800);
setInterval(()=>{watchMapVisibility();if(chatMode())fixPersonaLabels()},1600);
log('FIELD TEST FIX PACK ativo');
})();
