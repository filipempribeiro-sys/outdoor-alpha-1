/* ALPHA 4.3.31e · OLEN → CALENDAR BRIDGE
   When the user explicitly asks OLEN to save/add/register an experience in the
   calendar, persist the calendarEvents produced by the AI. Prefer Google
   Calendar when connected; otherwise fall back to the local ALPHA agenda.
   No observers, no polling.
*/
(()=>{
'use strict';
if(window.__alphaOlenCalendar431e)return;window.__alphaOlenCalendar431e=true;

const BACKEND=(typeof window.alphaBackendUrl==='function'?window.alphaBackendUrl():'https://alpha-ai-backend-m6l3.onrender.com').replace(/\/+$/,'');
const SESSION_KEY='alpha_google_calendar_session_v431';
const GRANT_KEY='alpha_google_calendar_grant_v431b';
const DONE_KEY='alpha_olen_calendar_done_v431e';

function explicitCalendarIntent(text){
  const s=String(text||'').toLocaleLowerCase('pt-PT').replace(/\s+/g,' ').trim();
  if(!s)return false;
  const calendar='(?:calend[aá]rio|agenda)';
  const verb='(?:guarda(?:r)?|adiciona(?:r)?|acrescenta(?:r)?|mete(?:r)?|coloca(?:r)?|p[oõ]e|marc(?:a|ar)|agenda(?:r)?|regista(?:r)?|grava(?:r)?)';
  return new RegExp(`\\b${verb}\\b.{0,55}\\b${calendar}\\b`,'i').test(s)
    || new RegExp(`\\b${calendar}\\b.{0,55}\\b${verb}\\b`,'i').test(s)
    || /\b(sim|sim,|ok|okay|faz isso|siga)\b/.test(s)&&/\b(guardar|adicionar|calend[aá]rio)\b/.test(s);
}
function sessionId(){return String(localStorage.getItem(SESSION_KEY)||'').trim()}
function grant(){return String(localStorage.getItem(GRANT_KEY)||'').trim()}
function saveGrant(v){if(v)localStorage.setItem(GRANT_KEY,String(v))}
function loadDone(){try{const a=JSON.parse(localStorage.getItem(DONE_KEY)||'[]');return Array.isArray(a)?a:[]}catch{return[]}}
function rememberDone(key){const a=loadDone().filter(Boolean);if(!a.includes(key))a.push(key);localStorage.setItem(DONE_KEY,JSON.stringify(a.slice(-250)))}
function wasDone(key){return loadDone().includes(key)}
function signature(user,ai,events){return String(ai?.requestId||user?.requestId||'')+'|'+events.map(e=>`${e?.title||''}|${e?.start||''}`).join('||')}

async function api(url,opt={}){
  const o={...opt},g=grant(),method=String(o.method||'GET').toUpperCase();let final=url;
  if(g&&(method==='GET'||method==='DELETE')){const u=new URL(final);u.searchParams.set('grant',g);final=u.toString()}
  else if(g&&o.body){try{const b=JSON.parse(o.body);b.grant=g;o.body=JSON.stringify(b)}catch{}}
  const r=await fetch(final,o);const d=await r.json().catch(()=>({}));if(d?.grant)saveGrant(d.grant);if(!r.ok||d?.ok===false){const e=new Error(d?.error||`HTTP ${r.status}`);e.code=d?.code||'';e.status=r.status;throw e}return d;
}
async function googleConnected(){
  const sid=sessionId();if(!sid)return false;
  try{const d=await api(`${BACKEND}/api/google/calendar/status?sessionId=${encodeURIComponent(sid)}`);return Boolean(d.connected)}catch{return false}
}
function normalizeRange(e){
  const allDay=Boolean(e?.allDay);
  if(allDay){
    const start=String(e?.start||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(start))return null;
    let end=String(e?.end||'').slice(0,10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(end)){const d=new Date(start+'T12:00:00');d.setDate(d.getDate()+1);end=d.toISOString().slice(0,10)}
    return {start:{date:start},end:{date:end}};
  }
  const s=new Date(e?.start||''),en=new Date(e?.end||'');if(!Number.isFinite(s.getTime()))return null;
  const end=Number.isFinite(en.getTime())&&en>s?en:new Date(s.getTime()+3600000);
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Lisbon';
  return {start:{dateTime:s.toISOString(),timeZone:tz},end:{dateTime:end.toISOString(),timeZone:tz}};
}
function promptEmails(text){const seen=new Set(),out=[];for(const m of String(text||'').matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)){const email=m[0].toLowerCase();if(!seen.has(email)){seen.add(email);out.push({email})}}return out}
async function saveToGoogle(events,userText){
  const sid=sessionId();let n=0;const attendees=promptEmails(userText);
  for(const e of events){
    const range=normalizeRange(e);if(!range)continue;
    await api(`${BACKEND}/api/google/calendar/events`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:sid,title:String(e.title||'Experiência · ALPHA'),description:String(e.description||''),location:String(e.location||''),attendees,...range})});n++;
  }
  return n;
}
function saveLocal(events){
  if(typeof window.alphaCalendarImportAIEvents==='function')return Number(window.alphaCalendarImportAIEvents(events)||0);
  return 0;
}
function latestPair(){
  const c=typeof window.alphaCurrentConversation==='function'?window.alphaCurrentConversation():null;if(!c||!Array.isArray(c.messages))return null;
  for(let i=c.messages.length-1;i>=0;i--){const ai=c.messages[i];if(ai?.role!=='ai'||!Array.isArray(ai.calendarEvents)||!ai.calendarEvents.length)continue;for(let j=i-1;j>=0;j--){const user=c.messages[j];if(user?.role==='user'&&(!ai.requestId||!user.requestId||user.requestId===ai.requestId))return {user,ai,events:ai.calendarEvents.filter(e=>e&&e.title&&e.start)}}}
  return null;
}
async function commitExplicitCalendar(){
  const pair=latestPair();if(!pair||!pair.events.length||!explicitCalendarIntent(pair.user?.text))return;
  const sig=signature(pair.user,pair.ai,pair.events);if(!sig||wasDone(sig))return;
  try{
    if(await googleConnected()){
      const n=await saveToGoogle(pair.events,pair.user?.text||'');if(!n)throw new Error('Nenhum evento válido para guardar.');rememberDone(sig);
      window.toast?.(n===1?'OLEN guardou o evento no Google Calendar.':`OLEN guardou ${n} eventos no Google Calendar.`);
      try{window.alphaCalendarRender?.()}catch{}
      return;
    }
    const n=saveLocal(pair.events);rememberDone(sig);
    window.toast?.(n===1?'OLEN guardou o evento na Agenda ALPHA.':n>1?`OLEN guardou ${n} eventos na Agenda ALPHA.`:'O evento já estava guardado na Agenda ALPHA.');
    try{window.alphaCalendarRender?.()}catch{}
  }catch(e){console.error('[ALPHA OLEN Calendar]',e);window.toast?.('Não consegui guardar automaticamente no calendário. Podes usar “Adicionar ao calendário” nesta resposta.');}
}

const nativeSend=window.alphaLifestyleSend;
if(typeof nativeSend==='function'){
  window.alphaLifestyleSend=async function(...args){const out=await nativeSend.apply(this,args);await commitExplicitCalendar();return out};
}
window.alphaOlenSaveLatestToCalendar=commitExplicitCalendar;
console.info('[ALPHA 4.3.31e] OLEN calendar action bridge ativo');
})();