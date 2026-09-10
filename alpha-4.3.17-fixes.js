/* ALPHA 4.3.17 · FIELD TEST FIX PACK
   Correções não destrutivas sobre a 4.3.16.
   - OLEN no progresso do Chat
   - Spotify Remote persistente no Chat
   - sincronização modo ↔ marcador
   - refresh/resizing do mapa GO e recuperação da rota ativa
   - limpeza segura de loops de snap junto ao GPS
   - detalhes normalizados/deduplicados
   - ratings apenas com proveniência explícita
*/
(()=>{
'use strict';
const VERSION='4.3.17';
const log=(...a)=>console.info('[ALPHA '+VERSION+']',...a);

function safe(fn){try{return fn()}catch(e){console.warn('[ALPHA '+VERSION+']',e);return undefined}}
function $id(id){return document.getElementById(id)}
function visible(el){if(!el)return false;const r=el.getBoundingClientRect();const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0}

/* ============================================================
   1. PERSONA · OLEN NO CHAT
   ============================================================ */
function activePersonaName(){
  if(document.body.classList.contains('alphaChatMode'))return 'OLEN';
  const explicit=document.querySelector('[data-alpha-persona].active,[data-persona].active,#activePersona');
  const n=String(explicit?.dataset?.alphaPersona||explicit?.dataset?.persona||explicit?.textContent||'').trim();
  return n&&n.length<30?n:'ALPHA';
}
function fixPersonaLabels(root=document){
  const persona=activePersonaName();
  root.querySelectorAll?.('.alphaLiveProgressHead span,.aiGeneratingRow span').forEach(el=>{
    const t=String(el.textContent||'').trim();
    if(/^A ALPHA está a trabalhar$/i.test(t)||/^ALPHA está a trabalhar$/i.test(t))el.textContent=persona+' está a trabalhar';
    if(/^A Alpha está a responder$/i.test(t)||/^ALPHA está a responder$/i.test(t))el.textContent=persona+' está a responder';
  });
}

/* ============================================================
   2. RATINGS · NÃO MOSTRAR VALORES SEM FONTE REAL EXPLÍCITA
   ============================================================ */
function verifiedRatingSource(p){
  const src=String(p?.ratingSource||p?.ratingsSource||p?.reviewSource||p?.provider||'').toLowerCase();
  return p?.ratingVerified===true||p?.reviewsVerified===true||/(google places|google_places|tripadvisor|booking\.com|foursquare|yelp)/.test(src);
}
safe(()=>{
  if(typeof alphaPlaceRating==='function'){
    const old=alphaPlaceRating;
    alphaPlaceRating=function(p){return verifiedRatingSource(p)?old(p):null};
  }
  if(typeof alphaPlaceReviews==='function'){
    const old=alphaPlaceReviews;
    alphaPlaceReviews=function(p){return verifiedRatingSource(p)?old(p):null};
  }
});
function hideUnverifiedRenderedRatings(root=document){
  root.querySelectorAll?.('.alphaPlaceRating').forEach(el=>{
    const holder=el.closest('[data-rating-source],[data-rating-verified]');
    if(!holder)el.remove();
  });
}

/* ============================================================
   3. DETALHES · NORMALIZAÇÃO, DEDUPE E SÍNTESE VISUAL
   ============================================================ */
const IMPORTANT_LABELS=new Set(['Estado','Última entrada','Preços','Horários','Transportes','Acessibilidade']);
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/https?:\/\/\S+/g,'').replace(/[^a-z0-9€%:+-]+/g,' ').replace(/\s+/g,' ').trim()}
function scoreLine(s,label=''){
  const x=norm(s);let n=0;
  if(/\bhoje\b|\baberto\b|\bencerrado\b|\bultima entrada\b/.test(x))n+=12;
  if(/\bgratuit|\bentrada livre\b/.test(x))n+=8;
  if(/\badulto\b|\bjovem\b|\bsenior\b|\bfamilia\b/.test(x))n+=4;
  if(/\d{1,2}:\d{2}|\d+[,.]?\d*\s*€/.test(x))n+=4;
  if(IMPORTANT_LABELS.has(label))n+=2;
  n+=Math.min(4,String(s).length/90);
  return n;
}
function dedupeLines(lines,label=''){
  const raw=(lines||[]).map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean);
  const chosen=[];
  raw.sort((a,b)=>scoreLine(b,label)-scoreLine(a,label));
  for(const s of raw){
    const a=norm(s);if(!a)continue;
    const duplicate=chosen.some(old=>{
      const b=norm(old);
      if(a===b)return true;
      if(a.length>28&&b.length>28&&(a.includes(b)||b.includes(a)))return true;
      const ta=new Set(a.split(' ').filter(x=>x.length>2)),tb=new Set(b.split(' ').filter(x=>x.length>2));
      if(!ta.size||!tb.size)return false;
      let same=0;ta.forEach(x=>{if(tb.has(x))same++});
      const sim=same/Math.min(ta.size,tb.size);
      return sim>.84;
    });
    if(!duplicate)chosen.push(s);
  }
  return chosen.sort((a,b)=>raw.indexOf(a)-raw.indexOf(b));
}
function compactSpan(span,label){
  if(!span||span.dataset.alpha4317Done==='1')return;
  const lines=dedupeLines(String(span.innerText||span.textContent||'').split(/\n+/),label);
  if(!lines.length)return;
  const max=label==='Preços'?5:label==='Serviços'||label==='Regras'||label==='Descontos'||label==='Dias/condições gratuitas'?4:4;
  const first=lines.slice(0,max),extra=lines.slice(max);
  span.textContent='';
  first.forEach((s,i)=>{if(i)span.append(document.createElement('br'));span.append(document.createTextNode(s))});
  if(extra.length){
    const details=document.createElement('details');details.className='alpha4317More';
    const sum=document.createElement('summary');sum.textContent='Ver mais ('+extra.length+')';details.append(sum);
    const box=document.createElement('div');box.className='alpha4317MoreBody';
    extra.forEach((s,i)=>{if(i)box.append(document.createElement('br'));box.append(document.createTextNode(s))});details.append(box);span.append(details);
  }
  span.dataset.alpha4317Done='1';
}
function compactPlaceDetails(root=document){
  root.querySelectorAll?.('.alphaPlaceInfoRow').forEach(row=>{
    const label=String(row.querySelector('b')?.textContent||'').trim();
    compactSpan(row.querySelector('span'),label);
  });
  root.querySelectorAll?.('.alphaPlaceHours .alphaHoursList').forEach(list=>{
    if(list.dataset.alpha4317Done==='1')return;
    const rows=[...list.querySelectorAll('.alphaHoursLine')];
    const unique=[];
    rows.forEach(r=>{
      const s=String(r.innerText||'').replace(/\s+/g,' ').trim();
      if(!s)return;
      if(unique.some(u=>{const a=norm(s),b=norm(u.s);return a===b||(a.length>25&&b.length>25&&(a.includes(b)||b.includes(a)))})){r.remove();return}
      unique.push({s,r});
    });
    const todayRows=unique.filter(x=>/\bhoje\b/i.test(x.s));
    if(todayRows.length){
      unique.forEach(x=>{if(!todayRows.includes(x)&&unique.length>4)x.r.style.display='none'});
    }else unique.slice(4).forEach(x=>x.r.style.display='none');
    list.dataset.alpha4317Done='1';
  });
}

/* ============================================================
   4. NAVEGAÇÃO · MODO ↔ MARCADOR
   ============================================================ */
const MODE_VEHICLE={walk:'arrow',bike:'bike',scooter:'scooter',moto:'moto',car:'car-red'};
function syncVehicleToMode(mode){
  safe(()=>{
    const m=mode||document.querySelector('.navMode.active')?.dataset?.mode||navigationMode||'walk';
    const wanted=MODE_VEHICLE[m]||'arrow';
    if(navVehicleStyle!==wanted){
      navVehicleStyle=wanted;
      localStorage.setItem(userKey(NAV_VEHICLE_KEY),wanted);
    }
    if(typeof renderVehicleUI==='function')renderVehicleUI();
  });
}
document.addEventListener('click',e=>{
  const b=e.target.closest?.('.navMode');
  if(b)setTimeout(()=>syncVehicleToMode(b.dataset.mode),0);
},true);

/* ============================================================
   5. MAPA GO · RESIZE/REPAINT + RESTAURO DA ROTA
   ============================================================ */
let lastMapVisible=false,lastRestore=0;
function refreshGoMap(force=false){
  safe(()=>{
    const host=$id('realMap');if(!host||!visible(host)||typeof map==='undefined'||!map)return;
    if(force||!lastMapVisible){
      map.resize();map.triggerRepaint?.();
      setTimeout(()=>{safe(()=>{map.resize();map.triggerRepaint?.()})},180);
      setTimeout(()=>{safe(()=>{map.resize();map.triggerRepaint?.()})},700);
    }
    const now=Date.now();
    if(now-lastRestore>1200&&typeof restoreActiveRoute==='function'){
      lastRestore=now;restoreActiveRoute();
      if(typeof renderExploreRoute==='function')renderExploreRoute();
      if(typeof updateNavigationOverlay==='function')updateNavigationOverlay();
    }
    lastMapVisible=true;
  });
}
function watchMapVisibility(){
  const host=$id('realMap');const is=visible(host);
  if(is)refreshGoMap(!lastMapVisible);else lastMapVisible=false;
}
window.addEventListener('resize',()=>setTimeout(()=>refreshGoMap(true),80),{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(()=>refreshGoMap(true),240),{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>refreshGoMap(true),120)});
window.addEventListener('pageshow',()=>setTimeout(()=>refreshGoMap(true),120));

/* Se o estilo abriu mas falhou a pintura inicial, um resize deve bastar. Em erros
   consecutivos mantemos o estilo 3D existente; não trocamos o provider e não
   degradamos a navegação que já funciona em ecrã inteiro. */
safe(()=>{
  if(typeof map!=='undefined'&&map){map.on('style.load',()=>refreshGoMap(true));map.on('idle',()=>refreshGoMap(false));}
});

/* ============================================================
   6. ROTA · REMOVER APENAS LOOP DE SNAP JUNTO AO PONTO INICIAL
   ============================================================ */
function distM(a,b){
  const R=6371000,p1=a[1]*Math.PI/180,p2=b[1]*Math.PI/180,dp=(b[1]-a[1])*Math.PI/180,dl=(b[0]-a[0])*Math.PI/180;
  const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 2*R*Math.asin(Math.sqrt(h));
}
function trimInitialSnapLoop(){
  safe(()=>{
    if(typeof pos==='undefined'||!pos||typeof exploreRouteGeoJSON==='undefined')return;
    const c=exploreRouteGeoJSON?.coordinates;if(!Array.isArray(c)||c.length<12)return;
    const gps=[Number(pos.longitude),Number(pos.latitude)];if(!gps.every(Number.isFinite))return;
    let travelled=0,lastNear=-1;
    for(let i=1;i<Math.min(c.length,220);i++){
      travelled+=distM(c[i-1],c[i]);
      if(travelled>40&&travelled<650&&distM(c[i],gps)<28)lastNear=i;
    }
    if(lastNear>2){
      const removed=c.slice(0,lastNear+1).reduce((d,p,i,a)=>i?d+distM(a[i-1],p):0,0);
      if(removed>70){
        exploreRouteGeoJSON={...exploreRouteGeoJSON,coordinates:c.slice(lastNear)};
        if(typeof persistActiveRoute==='function')persistActiveRoute({trimmedInitialSnapLoop:true,trimmedMeters:Math.round(removed),mode:(typeof navigationMode!=='undefined'?navigationMode:'walk')});
        if(typeof renderExploreRoute==='function')renderExploreRoute();
        log('loop inicial de snap removido',Math.round(removed)+' m');
      }
    }
  });
}

/* ============================================================
   7. CHAT → NAVEGAÇÃO · NÃO DECLARAR/EXIBIR ROTA SEM RESTAURAR
   ============================================================ */
function ensureActiveRouteWhenMapRequested(){
  safe(()=>{
    if(typeof restoreActiveRoute==='function')restoreActiveRoute();
    refreshGoMap(true);
    setTimeout(trimInitialSnapLoop,350);
  });
}
document.addEventListener('click',e=>{
  const b=e.target.closest?.('button,a');if(!b)return;
  const t=String(b.textContent||'').trim().toLowerCase();
  if(t==='mapa'||t.includes('navegação')||t.includes('navegacao')||t==='ir')setTimeout(ensureActiveRouteWhenMapRequested,80);
},true);

/* ============================================================
   8. SPOTIFY REMOTE · PERSISTÊNCIA REAL ENTRE APP ↔ SPOTIFY ↔ CHAT
   ============================================================ */
const REMOTE_KEY='alpha_spotify_remote_wanted_v2';
function chatMode(){return document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode')}
function remotePersisted(){try{return localStorage.getItem(REMOTE_KEY)!=='0'}catch{return true}}
safe(()=>{
  if(typeof alphaSpotifyRememberRemote==='function'){
    alphaSpotifyRememberRemote=function(open){
      alphaSpotifyRemoteWanted=!!open;
      try{localStorage.setItem(REMOTE_KEY,open?'1':'0');sessionStorage.setItem('alpha_spotify_remote_wanted_v1',open?'1':'0')}catch{}
    };
  }
  if(chatMode()&&remotePersisted())alphaSpotifyRemoteWanted=true;
});
function reviveSpotifyRemote(){
  safe(()=>{
    if(!chatMode())return;
    if(remotePersisted())alphaSpotifyRemoteWanted=true;
    if(typeof alphaSpotifyPollGlobal==='function')alphaSpotifyPollGlobal(true);
    setTimeout(()=>{
      safe(()=>{
        const pb=alphaSpotifyGlobalState?.playback;
        if(pb?.available&&pb?.track&&remotePersisted()){
          const root=$id('alphaSpotifyGlobal'),box=$id('alphaSpotifyOverlay');
          if(root)root.hidden=false;if(box)box.hidden=false;
        }
      });
    },450);
  });
}
window.addEventListener('pageshow',reviveSpotifyRemote);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)reviveSpotifyRemote()});
window.addEventListener('focus',reviveSpotifyRemote);

/* ============================================================
   9. OBSERVADOR DE CONSISTÊNCIA
   ============================================================ */
let scheduled=false;
function reconcile(){scheduled=false;fixPersonaLabels();hideUnverifiedRenderedRatings();compactPlaceDetails();watchMapVisibility();if(chatMode())reviveSpotifyRemote()}
const mo=new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(reconcile)}});
mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});

/* Arranque */
setTimeout(()=>{syncVehicleToMode();reconcile();ensureActiveRouteWhenMapRequested();},120);
setTimeout(()=>{reconcile();refreshGoMap(true);},800);
setInterval(()=>{watchMapVisibility();if(chatMode())fixPersonaLabels();},1600);
log('FIELD TEST FIX PACK ativo');
})();
