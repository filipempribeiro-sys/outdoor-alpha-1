/* ALPHA 4.3.31d · CALENDAR TIME PICKER
   Replaces the native mobile time picker for ALPHA Calendar with a compact,
   responsive in-app selector. No observers/polling.
*/
(()=>{
'use strict';
if(window.__alphaCalendarTimePicker431d)return;window.__alphaCalendarTimePicker431d=true;

const IDS=['alphaCalTime','alphaCalEndTime'];
let target=null,hour=0,minute=0;
const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');

function addStyle(){
  if($('alphaCalendarTimePicker431dStyle'))return;
  const s=document.createElement('style');s.id='alphaCalendarTimePicker431dStyle';s.textContent=`
.alphaTimeField{cursor:pointer!important;caret-color:transparent!important}
.alphaTimeField::selection{background:transparent}
.alphaTimePicker{position:fixed;inset:0;z-index:3400;display:grid;place-items:end center;padding:18px;background:rgba(0,0,0,.62);backdrop-filter:blur(7px)}
.alphaTimePicker[hidden]{display:none!important}
.alphaTimePickerCard{width:min(430px,100%);background:linear-gradient(180deg,#10262d,#09191f);border:1px solid #315149;border-radius:26px;padding:18px;box-shadow:0 28px 80px rgba(0,0,0,.58);padding-bottom:max(18px,env(safe-area-inset-bottom))}
.alphaTimePickerHead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.alphaTimePickerHead div{min-width:0}.alphaTimePickerEyebrow{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#54e0b2;font-weight:900}.alphaTimePickerTitle{font-size:21px;font-weight:900;margin-top:3px}.alphaTimeClear{border:0;background:transparent;color:#93a9a2;font:inherit;padding:8px 0;cursor:pointer}
.alphaTimeDisplay{display:flex;align-items:center;justify-content:center;gap:7px;font-size:54px;font-weight:900;letter-spacing:-.04em;padding:8px 0 14px}.alphaTimeDisplay span{min-width:78px;text-align:center}.alphaTimeDisplay i{font-style:normal;color:#54e0b2;transform:translateY(-2px)}
.alphaTimeWheels{display:grid;grid-template-columns:1fr 1fr;gap:10px}.alphaTimeWheelWrap{background:#08171c;border:1px solid #294149;border-radius:18px;overflow:hidden}.alphaTimeWheelLabel{text-align:center;color:#93a9a2;font-size:11px;font-weight:800;padding:10px 8px 5px;text-transform:uppercase;letter-spacing:.08em}.alphaTimeWheel{height:190px;overflow-y:auto;scroll-snap-type:y mandatory;scrollbar-width:none;padding:69px 8px}.alphaTimeWheel::-webkit-scrollbar{display:none}.alphaTimeOption{height:52px;width:100%;display:grid;place-items:center;scroll-snap-align:center;border:0;border-radius:13px;background:transparent;color:#9fb2ac;font:800 22px/1 system-ui;cursor:pointer}.alphaTimeOption.active{background:#123b32;color:#effff8;border:1px solid #2f8f70;box-shadow:0 0 0 1px rgba(57,214,155,.12)}
.alphaTimeActions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.alphaTimeActions button{min-height:52px;border-radius:15px;font:850 16px/1 system-ui;cursor:pointer}.alphaTimeCancel{background:#13272e;color:#eff7f3;border:1px solid #31505a}.alphaTimeSet{background:#39d69b;color:#052017;border:1px solid #39d69b}
@media(max-width:390px){.alphaTimePicker{padding:10px}.alphaTimePickerCard{border-radius:22px;padding:15px;padding-bottom:max(15px,env(safe-area-inset-bottom))}.alphaTimeDisplay{font-size:46px}.alphaTimeWheel{height:172px;padding:60px 7px}.alphaTimeOption{height:50px}.alphaTimeActions button{min-height:50px}}
@media(orientation:landscape) and (max-height:560px){.alphaTimePicker{place-items:center;padding:8px}.alphaTimePickerCard{width:min(560px,96vw);display:grid;grid-template-columns:150px 1fr;gap:10px 14px;align-items:center}.alphaTimePickerHead{grid-column:1/-1;margin:0}.alphaTimeDisplay{font-size:42px;padding:0}.alphaTimeDisplay span{min-width:60px}.alphaTimeWheel{height:132px;padding:40px 6px}.alphaTimeOption{height:46px}.alphaTimeActions{grid-column:1/-1;margin-top:2px}}
`;
  document.head.appendChild(s);
}

function build(){
  if($('alphaTimePicker431d'))return;
  const el=document.createElement('div');el.id='alphaTimePicker431d';el.className='alphaTimePicker';el.hidden=true;
  el.innerHTML=`<div class="alphaTimePickerCard" role="dialog" aria-modal="true" aria-labelledby="alphaTimePickerTitle">
    <div class="alphaTimePickerHead"><div><div class="alphaTimePickerEyebrow">CALENDÁRIO · ALPHA</div><div class="alphaTimePickerTitle" id="alphaTimePickerTitle">Definir hora</div></div><button class="alphaTimeClear" id="alphaTimeClear431d" type="button">Limpar</button></div>
    <div class="alphaTimeDisplay"><span id="alphaTimeHour431d">00</span><i>:</i><span id="alphaTimeMinute431d">00</span></div>
    <div class="alphaTimeWheels">
      <div class="alphaTimeWheelWrap"><div class="alphaTimeWheelLabel">Hora</div><div class="alphaTimeWheel" id="alphaTimeHours431d"></div></div>
      <div class="alphaTimeWheelWrap"><div class="alphaTimeWheelLabel">Minutos</div><div class="alphaTimeWheel" id="alphaTimeMinutes431d"></div></div>
    </div>
    <div class="alphaTimeActions"><button class="alphaTimeCancel" id="alphaTimeCancel431d" type="button">Cancelar</button><button class="alphaTimeSet" id="alphaTimeSet431d" type="button">Definir</button></div>
  </div>`;
  document.body.appendChild(el);
  const hh=$('alphaTimeHours431d'),mm=$('alphaTimeMinutes431d');
  hh.innerHTML=Array.from({length:24},(_,i)=>`<button type="button" class="alphaTimeOption" data-hour="${i}">${pad(i)}</button>`).join('');
  mm.innerHTML=Array.from({length:60},(_,i)=>`<button type="button" class="alphaTimeOption" data-minute="${i}">${pad(i)}</button>`).join('');
  hh.addEventListener('click',e=>{const b=e.target.closest('[data-hour]');if(!b)return;hour=Number(b.dataset.hour);refresh(true)});
  mm.addEventListener('click',e=>{const b=e.target.closest('[data-minute]');if(!b)return;minute=Number(b.dataset.minute);refresh(true)});
  $('alphaTimeCancel431d').addEventListener('click',close);
  $('alphaTimeSet431d').addEventListener('click',define);
  $('alphaTimeClear431d').addEventListener('click',()=>{if(target){target.value='';target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}))}close()});
  el.addEventListener('click',e=>{if(e.target===el)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!el.hidden)close()});
}

function refresh(scroll=false){
  $('alphaTimeHour431d').textContent=pad(hour);$('alphaTimeMinute431d').textContent=pad(minute);
  document.querySelectorAll('#alphaTimeHours431d .alphaTimeOption').forEach(x=>x.classList.toggle('active',Number(x.dataset.hour)===hour));
  document.querySelectorAll('#alphaTimeMinutes431d .alphaTimeOption').forEach(x=>x.classList.toggle('active',Number(x.dataset.minute)===minute));
  if(scroll)requestAnimationFrame(()=>{
    document.querySelector(`#alphaTimeHours431d [data-hour="${hour}"]`)?.scrollIntoView({block:'center',behavior:'smooth'});
    document.querySelector(`#alphaTimeMinutes431d [data-minute="${minute}"]`)?.scrollIntoView({block:'center',behavior:'smooth'});
  });
}
function open(input){
  build();target=input;
  const m=String(input.value||'').match(/^(\d{1,2}):(\d{2})$/),now=new Date();
  hour=m?Math.min(23,Number(m[1])):now.getHours();minute=m?Math.min(59,Number(m[2])):now.getMinutes();
  $('alphaTimePickerTitle').textContent=input.id==='alphaCalEndTime'?'Definir hora de fim':'Definir hora';
  $('alphaTimePicker431d').hidden=false;document.body.style.overflow='hidden';refresh(false);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.querySelector(`#alphaTimeHours431d [data-hour="${hour}"]`)?.scrollIntoView({block:'center'});
    document.querySelector(`#alphaTimeMinutes431d [data-minute="${minute}"]`)?.scrollIntoView({block:'center'});
    refresh(false);
  }));
}
function close(){const el=$('alphaTimePicker431d');if(el)el.hidden=true;document.body.style.overflow='';target=null}
function define(){if(!target)return close();target.value=`${pad(hour)}:${pad(minute)}`;target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));close()}

function bindInput(input){
  if(!input||input.dataset.alphaTimePicker431d)return;input.dataset.alphaTimePicker431d='1';
  input.type='text';input.readOnly=true;input.inputMode='none';input.autocomplete='off';input.placeholder='--:--';input.classList.add('alphaTimeField');
  input.setAttribute('aria-haspopup','dialog');
  input.addEventListener('click',e=>{e.preventDefault();input.blur();open(input)});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(input)}});
}
function install(){addStyle();build();IDS.forEach(id=>bindInput($(id)));console.info('[ALPHA 4.3.31d] Calendar ALPHA time picker ativo')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();