/* ALPHA 4.3.30 · OLEN DATA HOTFIX 6
   - Imagens: extrai imagens/fotos reais das conversas/cartões
   - Biblioteca: agrega cartões reais (placeCards) das conversas
   - Projetos / Planos: agrega conversas com estado, cartões ou eventos
   - Agendados: lê alphaCalendarEvents() real / localStorage do utilizador
   - Sem dados inventados: mostra vazio quando não existe conteúdo real
   - Place details: deduplica e compacta horários/preços/campos práticos
   - Attribution: mostra Google Maps apenas quando o cartão veio do Google
*/
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function conversations(){try{if(typeof window.alphaConversations==='function')return window.alphaConversations()||[]}catch{};try{const u=JSON.parse(localStorage.getItem('alpha_auth_user')||'null');const id=u?.id||'guest';const a=JSON.parse(localStorage.getItem('alpha_ai_conversations_v1_'+id)||'[]');return Array.isArray(a)?a:[]}catch{return[]}}
function scheduled(){try{if(typeof window.alphaCalendarEvents==='function')return window.alphaCalendarEvents()||[]}catch{};try{const u=JSON.parse(localStorage.getItem('alpha_auth_user')||'null');const id=u?.id||'guest';const a=JSON.parse(localStorage.getItem('alpha_calendar_events_v1'+id)||'[]');return Array.isArray(a)?a:[]}catch{return[]}}
function allMessages(){return conversations().flatMap(c=>(Array.isArray(c.messages)?c.messages:[]).map((m,i)=>({c,m,i})))}
function cards(){const out=[];for(const {c,m,i} of allMessages()){for(const p of (Array.isArray(m?.placeCards)?m.placeCards:[])){if(p&&p.name)out.push({conversation:c,messageIndex:i,card:p})}}return out}
function imageUrl(x){if(!x||typeof x!=='object')return'';for(const k of ['photo','photoUrl','image','imageUrl','cover','coverUrl','thumbnail','thumbnailUrl','url']){const v=x[k];if(typeof v==='string'&&/^https?:\/\//i.test(v)&&/\.(jpe?g|png|webp|avif)(\?|$)/i.test(v))return v}return''}
function images(){const seen=new Set(),out=[];for(const {c,m} of allMessages()){
  const pools=[];if(Array.isArray(m?.placeCards))pools.push(...m.placeCards);if(Array.isArray(m?.images))pools.push(...m.images);if(Array.isArray(m?.photos))pools.push(...m.photos);if(m?.photo)pools.push(m.photo);if(m?.image)pools.push(m.image);
  for(const x of pools){let url='';let label=c.title||'Experiência';if(typeof x==='string'&&/^https?:\/\//i.test(x))url=x;else if(x&&typeof x==='object'){url=imageUrl(x);label=x.name||x.title||label}if(url&&!seen.has(url)){seen.add(url);out.push({url,label,conversation:c})}}
 }return out}
function plans(){return conversations().filter(c=>{const msgs=Array.isArray(c.messages)?c.messages:[];if(c?.conversationState&&Object.keys(c.conversationState).length)return true;return msgs.some(m=>(Array.isArray(m?.calendarEvents)&&m.calendarEvents.length)||(Array.isArray(m?.placeCards)&&m.placeCards.length)||m?.plan||m?.tripPlan||m?.experiencePlan)})}
function ensureStyle(){if($('#alphaOlenData6Style'))return;const s=document.createElement('style');s.id='alphaOlenData6Style';s.textContent=`
.alphaOlenDataPanel6{display:none;min-height:0;overflow:auto;padding:4px 0 12px;flex:1}.alphaOlenDataPanel6.show{display:block}.alphaOlenDataHead6{display:flex;align-items:center;gap:10px;padding:4px 8px 10px}.alphaOlenDataHead6 button{width:38px;height:38px;border:0;border-radius:12px;background:rgba(255,255,255,.06);color:#fff;font-size:24px}.alphaOlenDataHead6 b{font-size:18px}.alphaOlenDataList6{display:grid;gap:8px;padding:0 6px}.alphaOlenDataCard6{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);border-radius:15px;padding:11px;color:#eef7f3}.alphaOlenDataCard6 b{display:block;font-size:15px;margin-bottom:3px}.alphaOlenDataCard6 small{display:block;color:#93a9a2;line-height:1.35}.alphaOlenDataCard6 button{margin-top:8px;border:0;border-radius:10px;background:#17372f;color:#e7fff5;padding:8px 10px;font-weight:700}.alphaOlenDataGrid6{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:0 6px}.alphaOlenImage6{aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:#0a171c;border:1px solid rgba(255,255,255,.08);position:relative}.alphaOlenImage6 img{width:100%;height:100%;object-fit:cover;display:block}.alphaOlenImage6 span{position:absolute;left:6px;right:6px;bottom:6px;background:rgba(0,0,0,.55);padding:5px 7px;border-radius:8px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.alphaOlenEmpty6{padding:18px 12px;color:#8fa39d;text-align:center;border:1px dashed rgba(255,255,255,.1);border-radius:14px;margin:4px 6px}.alphaOlenSidebar.alphaDataOpen6 .alphaOlenNav,.alphaOlenSidebar.alphaDataOpen6 .alphaOlenSep,.alphaOlenSidebar.alphaDataOpen6 .alphaOlenRecentTitle,.alphaOlenSidebar.alphaDataOpen6 .alphaOlenRecents,.alphaOlenSidebar.alphaDataOpen6 .alphaOlenMore,.alphaOlenSidebar.alphaDataOpen6 .alphaPinnedList4330{display:none!important}
`;document.head.append(s)}
function fmtDate(v){const d=new Date(v);return Number.isFinite(d.getTime())?new Intl.DateTimeFormat('pt-PT',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(d):''}
function openConversation(id){try{window.alphaOpenConversation?.(id);window.alphaCloseChatMenu?.()}catch{}}
function ensurePanel(){const shell=$('.alphaOlenSidebar');if(!shell)return null;let p=shell.querySelector('.alphaOlenDataPanel6');if(!p){p=document.createElement('div');p.className='alphaOlenDataPanel6';const bottom=shell.querySelector('.alphaOlenBottom');shell.insertBefore(p,bottom||null)}return p}
function closePanel(){const shell=$('.alphaOlenSidebar'),p=shell?.querySelector('.alphaOlenDataPanel6');shell?.classList.remove('alphaDataOpen6');p?.classList.remove('show');$$('.alphaOlenItem').forEach(x=>x.classList.remove('active'))}
function render(kind){const shell=$('.alphaOlenSidebar'),p=ensurePanel();if(!shell||!p)return;let title='',html='';
 if(kind==='images'){title='Imagens';const a=images();html=a.length?`<div class="alphaOlenDataGrid6">${a.map(x=>`<div class="alphaOlenImage6"><img src="${esc(x.url)}" alt="${esc(x.label)}" loading="lazy"><span>${esc(x.label)}</span></div>`).join('')}</div>`:`<div class="alphaOlenEmpty6">Ainda não existem imagens guardadas nas experiências ou contributos.</div>`}
 if(kind==='library'){title='Biblioteca';const a=cards();html=a.length?`<div class="alphaOlenDataList6">${a.map(x=>{const p=x.card;const meta=[p.category,p.type,p.location,p.address].filter(Boolean).join(' · ');return `<article class="alphaOlenDataCard6"><b>${esc(p.name)}</b><small>${esc(meta||x.conversation.title||'Cartão ALPHA')}</small><button type="button" data-conv="${esc(x.conversation.id)}">Abrir conversa</button></article>`}).join('')}</div>`:`<div class="alphaOlenEmpty6">Ainda não existem cartões guardados nas conversas.</div>`}
 if(kind==='projects'){title='Projetos / Planos';const a=plans();html=a.length?`<div class="alphaOlenDataList6">${a.map(c=>{const msgs=Array.isArray(c.messages)?c.messages:[];const nCards=msgs.reduce((n,m)=>n+(Array.isArray(m?.placeCards)?m.placeCards.length:0),0);const nEvents=msgs.reduce((n,m)=>n+(Array.isArray(m?.calendarEvents)?m.calendarEvents.length:0),0);const state=c?.conversationState&&typeof c.conversationState==='object'?Object.keys(c.conversationState).length:0;return `<article class="alphaOlenDataCard6"><b>${esc(c.title||'Plano ALPHA')}</b><small>${[nCards?`${nCards} cartões`:null,nEvents?`${nEvents} eventos`:null,state?'contexto persistente':null].filter(Boolean).join(' · ')||'Plano em desenvolvimento'}</small><button type="button" data-conv="${esc(c.id)}">Abrir projeto</button></article>`}).join('')}</div>`:`<div class="alphaOlenEmpty6">Ainda não existem projetos ou planos com conteúdo estruturado.</div>`}
 if(kind==='scheduled'){title='Agendados';const a=scheduled().filter(e=>e&&e.start).sort((a,b)=>new Date(a.start)-new Date(b.start));html=a.length?`<div class="alphaOlenDataList6">${a.map(e=>`<article class="alphaOlenDataCard6"><b>${esc(e.title||'Experiência ALPHA')}</b><small>${esc(fmtDate(e.start))}${e.location?' · '+esc(e.location):''}</small>${e.notes||e.description?`<small>${esc(e.notes||e.description)}</small>`:''}</article>`).join('')}</div>`:`<div class="alphaOlenEmpty6">Não existem eventos ALPHA guardados no calendário deste utilizador.</div>`}
 p.innerHTML=`<div class="alphaOlenDataHead6"><button type="button" aria-label="Voltar">‹</button><b>${esc(title)}</b></div>${html}`;p.querySelector('.alphaOlenDataHead6 button')?.addEventListener('click',closePanel);p.querySelectorAll('[data-conv]').forEach(b=>b.addEventListener('click',()=>openConversation(b.dataset.conv)));shell.classList.add('alphaDataOpen6');p.classList.add('show')}
function bind(){ensureStyle();$$('.alphaOlenItem[data-kind]').forEach(b=>{const k=b.dataset.kind;if(!['images','library','projects','scheduled'].includes(k)||b.dataset.data6)return;b.dataset.data6='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();$$('.alphaOlenItem').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(k)},true)})}

/* PLACE DETAIL NORMALIZER — deliberately no observer/polling. */
const placeSources={google:false,open:false};
function alphaCompactText(v){return String(v??'').replace(/\s+/g,' ').trim()}
function alphaCompareKey(v){return alphaCompactText(v).toLocaleLowerCase('pt-PT').replace(/https?:\/\/\S+/g,'').replace(/\[[^\]]*\]\([^)]*\)/g,'').replace(/[^\p{L}\p{N}€%]+/gu,' ').trim()}
function alphaUniqueValues(value,limit=6){
  const src=Array.isArray(value)?value:(value?[value]:[]),out=[];
  for(const raw of src){
    const s=alphaCompactText(raw);if(!s)continue;
    const k=alphaCompareKey(s);if(!k)continue;
    if(out.some(x=>{const q=alphaCompareKey(x);return q===k||(Math.min(q.length,k.length)>48&&(q.includes(k)||k.includes(q)))}))continue;
    out.push(s);if(out.length>=limit)break;
  }
  return out;
}
function alphaCompactHours(value){
  const src=alphaUniqueValues(value,16),week=[],today=[],other=[];
  for(const s of src){
    if(/^(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)(-feira)?\s*:/i.test(s))week.push(s);
    else if(/^hoje\b/i.test(s))today.push(s);
    else other.push(s);
  }
  return [...week.slice(0,7),...today.slice(0,2),...other.slice(0,2)];
}
function alphaPractical(value){
  const out=[];
  for(const s0 of alphaUniqueValues(value,5)){
    let s=alphaCompactText(s0);
    const menuHits=(s.match(/horários? e preços?|como chegar|aberto para obras|visitas guiadas|roteiros|lojas|cafetarias?|restaurantes?|perguntas frequentes/gi)||[]).length;
    if(menuHits>=3)continue;
    if(s.length>100&&/^\p{Ll}/u.test(s))continue;
    if(s.length>280){const cut=s.slice(0,280);const end=Math.max(cut.lastIndexOf('.'),cut.lastIndexOf(';'));s=(end>90?cut.slice(0,end+1):cut.replace(/\s+\S*$/,'')+'…')}
    if(s)out.push(s);
    if(out.length>=3)break;
  }
  return out;
}
function alphaNormalizePlace(p){
  if(!p||typeof p!=='object')return p;
  const q={...p};
  q.openingHours=alphaCompactHours(q.openingHours);
  q.prices=alphaUniqueValues(q.prices,4);
  q.discounts=alphaUniqueValues(q.discounts,4);
  q.freeEntry=alphaUniqueValues(q.freeEntry,3);
  q.ageBands=alphaUniqueValues(q.ageBands,4);
  q.services=alphaUniqueValues(q.services,5);
  q.rules=alphaUniqueValues(q.rules,5);
  q.accessibility=alphaPractical(q.accessibility);
  q.parking=alphaPractical(q.parking);
  q.publicTransport=alphaPractical(q.publicTransport);
  q.sourceUrls=alphaUniqueValues(q.sourceUrls,24);
  const maps=String(q.maps||'');
  const google=/google\.[^/]+\/maps|maps\.google/i.test(maps)||/^ChI/i.test(String(q.id||''))||q.rating!=null||q.reviews!=null||q.priceLevel;
  if(google)placeSources.google=true;else placeSources.open=true;
  return q;
}
function alphaRefreshAttribution(){
  const bits=[];if(placeSources.google)bits.push('Google Maps');if(placeSources.open)bits.push('OpenStreetMap','Wikidata/Wikimedia');
  const text=bits.length?bits.join(' · '):'OpenStreetMap · Wikidata/Wikimedia';
  document.querySelectorAll('.alphaPlaceAttribution').forEach(x=>x.textContent=text);
}
if(typeof window.alphaRegisterPlaceCard==='function'&&!window.__alphaPlaceNormalizer6){
  window.__alphaPlaceNormalizer6=true;
  const originalRegister=window.alphaRegisterPlaceCard;
  window.alphaRegisterPlaceCard=function(p){const key=originalRegister(alphaNormalizePlace(p));setTimeout(alphaRefreshAttribution,0);return key};
  if(typeof window.alphaOpenPlaceDetail==='function'){
    const originalOpen=window.alphaOpenPlaceDetail;
    window.alphaOpenPlaceDetail=function(key){const r=originalOpen(key);setTimeout(()=>{
      const host=document.getElementById('alphaPlaceDetailContent');
      host?.querySelectorAll('.alphaPlaceModalMeta').forEach(el=>{if(/fontes? usadas? na investigação/i.test(el.textContent||''))el.textContent=(el.textContent||'').replace(/fontes? usadas? na investigação/i,'fontes verificadas')});
    },0);return r};
  }
}

new MutationObserver(()=>requestAnimationFrame(bind)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(bind,180);setInterval(bind,1200);console.info('[ALPHA 4.3.30] OLEN data hotfix6 ativo · place details compactos');
})();
