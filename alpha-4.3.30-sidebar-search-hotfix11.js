/* ALPHA 4.3.30 · OLEN SIDEBAR CORRECTIONS 11
   Event-driven only.
   - Lupa pesquisa conversas OLEN e nunca cria conversa
   - Hamburger reaparece nas páginas internas
   - Agendados lê exatamente o Calendar Hub local (date/time), além de start
*/
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function shell(){return $('#aiChatMenu .alphaOlenSidebar')||$('.alphaConversationSidebar .alphaOlenSidebar')}
function style(){if($('#alphaSidebarCorrections11Style'))return;const s=document.createElement('style');s.id='alphaSidebarCorrections11Style';s.textContent=`body:not([data-alpha-view="home"]):not(.alphaChatMode):not(.alphaComposeMode):not(.alphaWelcomeActive) #alphaInternalMenuBtn{display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}`;document.head.append(s)}
function filter(sh,q){const low=String(q||'').trim().toLocaleLowerCase('pt-PT');const rows=[...sh.querySelectorAll('.alphaOlenRecent')];rows.forEach(r=>r.hidden=!!low&&!r.textContent.toLocaleLowerCase('pt-PT').includes(low));const more=sh.querySelector('.alphaOlenMore');if(!more)return;if(low){more.hidden=true;return}const rec=[...sh.querySelectorAll('.alphaOlenRecents>.alphaOlenRecent')],expanded=more.dataset.expanded==='1';rec.forEach((r,i)=>r.hidden=!expanded&&i>=8);more.hidden=rec.length<=8}
function calendarEvents(){try{const a=window.alphaCalendarEvents?.();if(Array.isArray(a))return a}catch{}try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k?.startsWith('alpha_calendar_events_v1'))continue;const a=JSON.parse(localStorage.getItem(k)||'[]');if(Array.isArray(a)&&a.length)return a}}catch{}return[]}
function eventDate(e){if(e?.start){const d=new Date(e.start);if(Number.isFinite(d.getTime()))return d}if(e?.date){const d=new Date(`${e.date}T${e.time||'00:00'}:00`);if(Number.isFinite(d.getTime()))return d}return null}
function when(e){const d=eventDate(e);if(!d)return e?.date||'';const o={weekday:'short',day:'2-digit',month:'short'};if(e?.time||e?.start)Object.assign(o,{hour:'2-digit',minute:'2-digit'});try{return new Intl.DateTimeFormat('pt-PT',o).format(d)}catch{return e?.date||e?.start||''}}
function renderScheduled(sh){const p=sh?.querySelector('.alphaOlenPanel10');if(!p)return;const a=calendarEvents().filter(e=>e&&(e.date||e.start)).sort((x,y)=>(eventDate(x)?.getTime()||0)-(eventDate(y)?.getTime()||0));p.innerHTML=`<div class="alphaOlenPanelHead10"><button type="button" data-back-panel aria-label="Voltar">‹</button><b>Agendados</b></div>${a.length?`<div class="alphaOlenPanelList10">${a.map(e=>`<article class="alphaOlenPanelCard10"><b>${esc(e.title||'Experiência OLEN')}</b><small>${esc(when(e))}${e.location?' · '+esc(e.location):''}</small>${e.notes||e.description?`<small>${esc(e.notes||e.description)}</small>`:''}</article>`).join('')}</div>`:`<div class="alphaOlenEmpty10">Não existem eventos agendados.</div>`}`;sh.classList.add('alphaPanelOpen10');p.classList.add('show')}
function restoreMenu(){if(document.body.classList.contains('alphaChatMode')||document.body.classList.contains('alphaComposeMode')||document.body.classList.contains('alphaWelcomeActive')||document.body.dataset.alphaView==='home')return;document.body.classList.remove('alphaSidebarOpen4330','alphaOlenFunctionalOpen10');const b=$('#alphaInternalMenuBtn');if(b){b.style.setProperty('display','grid','important');b.style.setProperty('visibility','visible','important');b.style.setProperty('opacity','1','important');b.style.setProperty('pointer-events','auto','important')}}
style();
/* Este listener é registado depois do functional10, mas o search não é intercetado por ele.
   stopImmediatePropagation impede handlers antigos da lupa de dispararem Nova conversa. */
document.addEventListener('click',e=>{const search=e.target?.closest?.('.alphaOlenSearch');if(search&&search.closest('.alphaOlenSidebar')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const sh=search.closest('.alphaOlenSidebar'),box=sh.querySelector('.alphaOlenSearchBox'),input=box?.querySelector('input');if(!box||!input)return;const opening=!box.classList.contains('show');box.classList.toggle('show',opening);search.setAttribute('aria-expanded',opening?'true':'false');if(opening)setTimeout(()=>input.focus(),0);else{input.value='';filter(sh,'')}return}const nav=e.target?.closest?.('.alphaSidebarDock button,nav.bottom .nav,#alphaInternalSidebar button');if(nav)setTimeout(restoreMenu,50)},true);
document.addEventListener('input',e=>{const input=e.target;if(!input?.closest?.('.alphaOlenSearchBox'))return;const sh=input.closest('.alphaOlenSidebar');if(sh)filter(sh,input.value)},true);
/* functional10 interceta Agendados antes deste ficheiro. Substituímos apenas o botão por um clone
   e retiramos data-kind do clone, evitando o handler antigo e mantendo o resto da sidebar intacto. */
function bindScheduled(){const sh=shell(),old=sh?.querySelector('.alphaOlenItem[data-kind="scheduled"]');if(!old||old.dataset.c11)return;const b=old.cloneNode(true);b.dataset.c11='1';b.dataset.olenSection='scheduled';b.removeAttribute('data-kind');old.replaceWith(b);b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();sh.querySelectorAll('.alphaOlenItem').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderScheduled(sh)},true)}
function bindSearchClean(){const sh=shell(),old=sh?.querySelector('.alphaOlenSearch');if(!old||old.dataset.c11)return;const b=old.cloneNode(true);b.dataset.c11='1';old.replaceWith(b)}
document.addEventListener('click',e=>{if(e.target?.closest?.('#alphaInternalMenuBtn,.aiChatMenuBtn,#aiChatMenuBtn,button[aria-label="Abrir conversas"],button[aria-label="Abrir navegação"]'))setTimeout(()=>{bindSearchClean();bindScheduled()},0)},true);
document.addEventListener('touchend',()=>setTimeout(()=>{bindSearchClean();bindScheduled()},0),{passive:true});
window.addEventListener('pageshow',()=>{setTimeout(()=>{bindSearchClean();bindScheduled();restoreMenu()},80)},{passive:true});
setTimeout(()=>{bindSearchClean();bindScheduled();restoreMenu()},120);
console.info('[ALPHA 4.3.30] OLEN sidebar corrections11 ativo');
})();
