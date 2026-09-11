/* ALPHA 4.3.31c · CALENDAR GOOGLE SYNC
   Google OAuth + real event sync + encrypted persistent grant.
   Adds guests/attendees invitations for Google Calendar events.
*/
(()=>{
'use strict';
if(window.__alphaCalendarGoogle431c)return;window.__alphaCalendarGoogle431c=true;

const BACKEND=(typeof window.alphaBackendUrl==='function'?window.alphaBackendUrl():'https://alpha-ai-backend-m6l3.onrender.com').replace(/\/+$/,'');
const SESSION_KEY='alpha_google_calendar_session_v431';
const GRANT_KEY='alpha_google_calendar_grant_v431b';
const CACHE_KEY='alpha_google_calendar_events_v431';
let googleConnected=false,googleEmail='',lastSyncKey='',syncing=false,lastError='';

const $=id=>document.getElementById(id),pad=n=>String(n).padStart(2,'0');
const isoDate=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const sessionId=(()=>{let s=localStorage.getItem(SESSION_KEY)||'';if(!/^[A-Za-z0-9._:-]{16,160}$/.test(s)){s='gcal_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,12);localStorage.setItem(SESSION_KEY,s)}return s})();
function grant(){return localStorage.getItem(GRANT_KEY)||''}
function saveGrant(v){if(v)localStorage.setItem(GRANT_KEY,String(v))}

function style(){
  if(document.getElementById('alphaCalendarGoogle431Style'))return;
  const s=document.createElement('style');s.id='alphaCalendarGoogle431Style';s.textContent=`
.alphaCalendarProviderRow{scrollbar-width:none;-ms-overflow-style:none}.alphaCalendarProviderRow::-webkit-scrollbar{display:none}
.alphaCalendarProviderRow .a431provider{white-space:nowrap;border:1px solid #294149;border-radius:999px;padding:7px 10px;color:var(--muted);font-size:12px;background:transparent;font:inherit;cursor:pointer}
.alphaCalendarProviderRow .a431provider.ready{color:#dffff2;border-color:#287b62;background:#10352d}.alphaCalendarProviderRow .a431provider.busy{opacity:.7}.alphaCalendarProviderRow .a431provider.error{color:#ffd4d4;border-color:#754848;background:#2b1717}
.alphaCalendarDot.google{background:#68a8ff}.alphaCalendarEvent[data-provider="google"]{border-color:#315b7e}.alphaCalendarEvent[data-provider="google"] .alphaCalendarEventTime{color:#8fc4ff}
#alphaCalGuestsWrap{display:none}.alphaCalGuestHint{font-size:11px;color:var(--muted);margin-top:5px;line-height:1.35}.alphaCalGuestBadge{display:inline-flex;align-items:center;gap:5px;margin-top:6px;padding:5px 8px;border:1px solid #315b7e;border-radius:999px;color:#bcdcff;font-size:11px}
`;
  document.head.appendChild(s);
}
function cachedGoogle(){try{const a=JSON.parse(localStorage.getItem(CACHE_KEY)||'[]');return Array.isArray(a)?a:[]}catch{return[]}}
function saveGoogle(a){localStorage.setItem(CACHE_KEY,JSON.stringify((a||[]).slice(0,500)))}
function googleToAlpha(e){
  const raw=e?.start?.dateTime||e?.start?.date||'',endRaw=e?.end?.dateTime||e?.end?.date||'',allDay=Boolean(e?.allDay||e?.start?.date);let date='',time='',endTime='';
  if(allDay)date=String(raw).slice(0,10);else{const d=new Date(raw);if(Number.isFinite(d.getTime())){date=isoDate(d);time=`${pad(d.getHours())}:${pad(d.getMinutes())}`}const ed=new Date(endRaw);if(Number.isFinite(ed.getTime()))endTime=`${pad(ed.getHours())}:${pad(ed.getMinutes())}`}
  return {id:'gcal:'+String(e.id||''),remoteId:String(e.id||''),title:e.title||'(Sem título)',date,time,endTime,location:e.location||'',notes:e.description||'',provider:'google',htmlLink:e.htmlLink||'',updatedAt:e.updated||'',allDay,attendees:Array.isArray(e.attendees)?e.attendees:[]};
}

const localEventsFn=typeof window.alphaCalendarEvents==='function'?window.alphaCalendarEvents:null;
const localSaveFn=typeof window.alphaCalendarSaveEvents==='function'?window.alphaCalendarSaveEvents:null;
if(localEventsFn)window.alphaCalendarEvents=function(){const local=localEventsFn().filter(e=>e?.provider!=='google'&&!String(e?.id||'').startsWith('gcal:'));const remote=googleConnected?cachedGoogle().map(googleToAlpha).filter(e=>e.date):[];return [...local,...remote]};
if(localSaveFn)window.alphaCalendarSaveEvents=function(a){return localSaveFn((a||[]).filter(e=>e?.provider!=='google'&&!String(e?.id||'').startsWith('gcal:')))};

function providerButton(){
  const row=document.querySelector('.alphaCalendarProviderRow');if(!row)return null;let b=row.querySelector('#alphaGoogleCalendarProvider');
  if(!b){const old=[...row.querySelectorAll('span')].find(x=>/^Google\s*·/i.test(x.textContent||''));b=document.createElement('button');b.type='button';b.id='alphaGoogleCalendarProvider';b.className='a431provider';if(old)old.replaceWith(b);else row.appendChild(b);b.addEventListener('click',()=>googleConnected?syncGoogle(true):connectGoogle())}
  b.classList.toggle('ready',googleConnected);b.classList.remove('busy','error');b.textContent=googleConnected?`Google · ligado${googleEmail?' ✓':''}`:'Google · ligar';b.title=googleConnected?(googleEmail||'Google Calendar ligado'):'Ligar Google Calendar';return b;
}
function setProviderBusy(text){const b=providerButton();if(b){b.classList.add('busy');b.textContent=text}}
function setProviderError(e){lastError=String(e?.message||e||'Erro de sincronização');const b=providerButton();if(b){b.classList.add('error');b.textContent='Google · erro';b.title=lastError}}

async function json(url,opt={}){
  const o={...opt},method=String(o.method||'GET').toUpperCase(),g=grant();let final=url;
  if(g&&(method==='GET'||method==='DELETE')){const u=new URL(url);u.searchParams.set('grant',g);final=u.toString()}
  else if(g&&o.body){try{const b=JSON.parse(o.body);if(b&&typeof b==='object'&&!Array.isArray(b)){b.grant=g;o.body=JSON.stringify(b)}}catch{}}
  const r=await fetch(final,o);const d=await r.json().catch(()=>({}));if(d?.grant)saveGrant(d.grant);
  if(!r.ok||d?.ok===false){const e=new Error(d?.error||`HTTP ${r.status}`);e.code=d?.code||'';e.status=d?.providerStatus||r.status;e.reason=d?.providerReason||'';throw e}return d;
}
function explainError(e){
  const code=String(e?.code||'');if(code==='GOOGLE_CALENDAR_SCOPE')return 'O Google não concedeu a permissão necessária para gerir este evento. Toca em Google e volta a autorizar.';
  if(code==='GOOGLE_CALENDAR_API_DISABLED')return 'A Google Calendar API ainda não está disponível para este cliente. Aguarda alguns minutos e tenta novamente.';
  if(/NOT_CONNECTED|SESSION_EXPIRED|TOKEN/.test(code+' '+String(e?.message||'')))return 'A sessão Google expirou. Liga novamente o Google Calendar.';
  return `Google Calendar: ${String(e?.message||'erro de sincronização')}`;
}

async function status(){try{const d=await json(`${BACKEND}/api/google/calendar/status?sessionId=${encodeURIComponent(sessionId)}`);googleConnected=Boolean(d.connected);googleEmail=String(d.email||'');providerButton();enableGoogleOption();if(googleConnected)await syncGoogle(true)}catch(e){console.warn('[ALPHA Calendar] status',e);setProviderError(e)}}
async function connectGoogle(){try{setProviderBusy('Google · a ligar…');const returnTo=location.href.split('#')[0];const d=await json(`${BACKEND}/api/google/calendar/auth-url?sessionId=${encodeURIComponent(sessionId)}&returnTo=${encodeURIComponent(returnTo)}`);location.href=d.url}catch(e){console.error('[ALPHA Calendar] auth',e);setProviderError(e);window.toast?.('Não foi possível iniciar a ligação ao Google Calendar.')}}
function monthWindow(){const c=window.alphaCalendarCursor instanceof Date?window.alphaCalendarCursor:new Date(),y=c.getFullYear(),m=c.getMonth();return {key:`${y}-${m}`,timeMin:new Date(y,m-1,1,0,0,0).toISOString(),timeMax:new Date(y,m+2,1,0,0,0).toISOString()}}
async function syncGoogle(force=false,retry=true){
  if(!googleConnected||syncing)return;const w=monthWindow();if(!force&&lastSyncKey===w.key)return;syncing=true;setProviderBusy('Google · sincronizar…');
  try{const d=await json(`${BACKEND}/api/google/calendar/events?sessionId=${encodeURIComponent(sessionId)}&timeMin=${encodeURIComponent(w.timeMin)}&timeMax=${encodeURIComponent(w.timeMax)}`);saveGoogle(d.events||[]);lastSyncKey=w.key;lastError='';providerButton();renderNoSync()}
  catch(e){console.warn('[ALPHA Calendar] sync',e.code,e.status,e.reason,e.message);if(retry&&(!e.status||e.status>=500)){syncing=false;await new Promise(r=>setTimeout(r,1200));return syncGoogle(true,false)}if(/NOT_CONNECTED|SESSION_EXPIRED|TOKEN|401/.test(String(e.code||'')+' '+String(e.message||''))){googleConnected=false;saveGoogle([]);providerButton();enableGoogleOption()}else setProviderError(e);window.toast?.(explainError(e))}
  finally{syncing=false}
}

const nativeRender=typeof window.alphaCalendarRender==='function'?window.alphaCalendarRender:null;
function compactGrid(){const grid=$('alphaCalendarGrid');if(!grid)return;const c=window.alphaCalendarCursor instanceof Date?window.alphaCalendarCursor:new Date(),y=c.getFullYear(),m=c.getMonth(),first=new Date(y,m,1),offset=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),needed=Math.ceil((offset+days)/7)*7;[...grid.children].forEach((el,i)=>{if(i>=needed)el.remove()});[...grid.querySelectorAll('.alphaCalendarDay')].forEach(day=>{const iso=day.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];if(!iso)return;const events=window.alphaCalendarEvents?.().filter(e=>e.date===iso)||[],dots=[...day.querySelectorAll('.alphaCalendarDot')];events.slice(0,dots.length).forEach((e,i)=>{if(e.provider==='google')dots[i].classList.add('google')})})}
function tagAgenda(){const agenda=$('alphaCalendarAgenda');if(!agenda)return;[...agenda.querySelectorAll('.alphaCalendarEvent')].forEach(el=>{const id=el.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]||'',e=window.alphaCalendarEvents?.().find(x=>x.id===id);if(e?.provider==='google')el.dataset.provider='google'})}
function renderNoSync(){if(!nativeRender)return;nativeRender();compactGrid();tagAgenda();providerButton();updateCopy()}
if(nativeRender)window.alphaCalendarRender=function(){renderNoSync();syncGoogle(false)};
const nativeMove=window.alphaCalendarMove;if(typeof nativeMove==='function')window.alphaCalendarMove=function(n){lastSyncKey='';nativeMove(n);syncGoogle(true)};
const nativeToday=window.alphaCalendarToday;if(typeof nativeToday==='function')window.alphaCalendarToday=function(){lastSyncKey='';nativeToday();syncGoogle(true)};

function ensureGuestsField(){
  const card=document.querySelector('.alphaCalendarEditorCard');if(!card||$('alphaCalGuests'))return;
  const notes=$('alphaCalNotes');const label=document.createElement('label');label.id='alphaCalGuestsWrap';label.innerHTML='Convidados <input id="alphaCalGuests" type="text" inputmode="email" autocomplete="email" placeholder="nome@exemplo.pt, outro@exemplo.pt"><span class="alphaCalGuestHint">Separa vários emails por vírgulas. O Google envia o convite e as atualizações aos participantes.</span>';
  const notesLabel=notes?.closest('label');if(notesLabel?.parentNode)notesLabel.parentNode.insertBefore(label,notesLabel.nextSibling);else card.appendChild(label);
  const sel=$('alphaCalProvider');sel?.addEventListener('change',toggleGuestsField);toggleGuestsField();
}
function toggleGuestsField(){const w=$('alphaCalGuestsWrap'),sel=$('alphaCalProvider');if(w)w.style.display=(googleConnected&&sel?.value==='google')?'flex':'none'}
function guestEmailsFromEvent(e){return (e?.attendees||[]).map(a=>String(a?.email||'').trim()).filter(Boolean).filter(x=>x.toLowerCase()!==googleEmail.toLowerCase()).join(', ')}
function parseGuests(raw){const seen=new Set(),out=[];for(const x of String(raw||'').split(/[;,\n]+/)){const email=x.trim().toLowerCase();if(!email||!/^\S+@\S+\.\S+$/.test(email)||seen.has(email))continue;seen.add(email);out.push({email})}return out}

function enableGoogleOption(){const sel=$('alphaCalProvider');if(!sel)return;const opt=[...sel.options].find(o=>o.value==='google');if(opt){opt.disabled=!googleConnected;opt.textContent=googleConnected?'Google Calendar':'Google · ligar primeiro'}toggleGuestsField()}
function updateCopy(){const p=document.querySelector('.alphaCalendarHubHead .muted');if(p)p.textContent=googleConnected?'A tua agenda ALPHA com Google Calendar sincronizado.':'A tua agenda na ALPHA. Liga o Google Calendar para veres e gerires os teus eventos num só lugar.'}
function allDayRange(date){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+1);return {start:{date},end:{date:isoDate(d)}}}

const nativeOpen=window.alphaCalendarOpenEditor;
if(typeof nativeOpen==='function')window.alphaCalendarOpenEditor=function(id=''){
  nativeOpen(id);ensureGuestsField();enableGoogleOption();
  const e=window.alphaCalendarEvents?.().find(x=>x.id===id);if($('alphaCalGuests'))$('alphaCalGuests').value=e?.provider==='google'?guestEmailsFromEvent(e):'';toggleGuestsField();
};
const nativeSaveEditor=window.alphaCalendarSaveEditor;
if(typeof nativeSaveEditor==='function')window.alphaCalendarSaveEditor=async function(){
  const sel=$('alphaCalProvider');if(sel?.value!=='google')return nativeSaveEditor();if(!googleConnected)return window.toast?.('Liga primeiro o Google Calendar.');
  const title=$('alphaCalTitle')?.value.trim(),date=$('alphaCalDate')?.value;if(!title||!date)return window.toast?.('Indica o título e a data.');const id=$('alphaCalEventId')?.value||'',time=$('alphaCalTime')?.value||'',endTime=$('alphaCalEndTime')?.value||'';
  const range=time?(()=>{const start=new Date(`${date}T${time}:00`);let end=endTime?new Date(`${date}T${endTime}:00`):new Date(start.getTime()+3600000);if(end<=start)end=new Date(start.getTime()+3600000);const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Lisbon';return {start:{dateTime:start.toISOString(),timeZone:tz},end:{dateTime:end.toISOString(),timeZone:tz}}})():allDayRange(date);
  const attendees=parseGuests($('alphaCalGuests')?.value||'');
  const body={sessionId,title,description:$('alphaCalNotes')?.value.trim()||'',location:$('alphaCalLocation')?.value.trim()||'',attendees,...range};
  try{
    const remoteId=id.startsWith('gcal:')?id.slice(5):'';
    const result=remoteId?await json(`${BACKEND}/api/google/calendar/events/${encodeURIComponent(remoteId)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}):await json(`${BACKEND}/api/google/calendar/events`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    window.alphaCalendarSelectedDate=date;window.alphaCalendarCursor=new Date(date+'T12:00:00');window.alphaCalendarCloseEditor?.();lastSyncKey='';await syncGoogle(true);
    const n=Number(result?.invited||attendees.length||0);window.toast?.(n?`${remoteId?'Evento atualizado':'Evento criado'} no Google Calendar · ${n} convite${n===1?'':'s'} enviado${n===1?'':'s'}.`:(remoteId?'Evento atualizado no Google Calendar.':'Evento criado no Google Calendar.'));
  }catch(e){console.error('[ALPHA Calendar] save google',e);window.toast?.(explainError(e))}
};
const nativeDelete=window.alphaCalendarDeleteCurrent;
if(typeof nativeDelete==='function')window.alphaCalendarDeleteCurrent=async function(){const id=$('alphaCalEventId')?.value||'';if(!id.startsWith('gcal:'))return nativeDelete();try{await json(`${BACKEND}/api/google/calendar/events/${encodeURIComponent(id.slice(5))}?sessionId=${encodeURIComponent(sessionId)}`,{method:'DELETE'});window.alphaCalendarCloseEditor?.();lastSyncKey='';await syncGoogle(true);window.toast?.('Evento eliminado do Google Calendar e convidados notificados.')}catch(e){console.error('[ALPHA Calendar] delete google',e);window.toast?.(explainError(e))}};

function handleReturn(){const u=new URL(location.href),v=u.searchParams.get('alphaGoogleCalendar'),g=u.searchParams.get('alphaGoogleGrant');if(g)saveGrant(g);if(!v&&!g)return;u.searchParams.delete('alphaGoogleCalendar');u.searchParams.delete('alphaGoogleGrant');history.replaceState(null,'',u.pathname+u.search+u.hash);if(v==='connected')window.toast?.('Google Calendar ligado à ALPHA.');else if(v==='denied')window.toast?.('Ligação ao Google Calendar cancelada.');else if(v)window.toast?.('Não foi possível ligar o Google Calendar.')}
async function diagnostic(){try{return await json(`${BACKEND}/api/google/calendar/diagnostic?sessionId=${encodeURIComponent(sessionId)}`)}catch(e){console.warn('[ALPHA Calendar diagnostic]',e.code,e.status,e.reason,e.message);return {ok:false,error:e.message,code:e.code,status:e.status,reason:e.reason}}}
window.alphaGoogleCalendarDiagnostic=diagnostic;
function install(){style();handleReturn();providerButton();ensureGuestsField();enableGoogleOption();renderNoSync();status();console.info('[ALPHA 4.3.31c] Calendar Google guests + persistent frontend sync ativo')}
setTimeout(install,0);
})();