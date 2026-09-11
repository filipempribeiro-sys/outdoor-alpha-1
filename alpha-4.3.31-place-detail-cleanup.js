/* ALPHA 4.3.31 · PLACE DETAIL CLEANUP
   Main detail = hero + brief description/notices + free entry/rating + subdetail actions.
   Moves duration/circuit information out of the summary and keeps all long content inside subdetails.
   Also recovers the hero from the originating place card when the detail photo URL is absent/broken.
   Event-driven only; no observer/polling.
*/
(()=>{
'use strict';
if(window.__alphaPlaceDetailCleanup431)return;window.__alphaPlaceDetailCleanup431=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function css(){if(document.getElementById('alphaPlaceDetailCleanup431Style'))return;const s=document.createElement('style');s.id='alphaPlaceDetailCleanup431Style';s.textContent=`
#alphaPlaceDetailContent.alpha431 .a431hero{height:220px!important;min-height:220px!important;background-color:#0b1d19!important;border-radius:0!important;overflow:hidden}
#alphaPlaceDetailContent.alpha431 .a431head{padding:16px 18px 8px!important}
#alphaPlaceDetailContent.alpha431 .a431head h2{font-size:24px!important;line-height:1.15!important}
#alphaPlaceDetailContent.alpha431 .a431facts{gap:8px!important;margin-top:11px!important}
#alphaPlaceDetailContent.alpha431 .a431fact{max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere!important;line-height:1.25!important;padding:7px 11px!important}
#alphaPlaceDetailContent.alpha431 .a431fact.open{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#alphaPlaceDetailContent.alpha431 .a431desc{margin:7px 18px 12px!important;padding:0!important;background:none!important;border-radius:0!important;color:#cbd9d5!important;font-size:13px!important;line-height:1.42!important;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
#alphaPlaceDetailContent.alpha431 .a431notice{margin:5px 18px 12px;padding:10px 12px;border:1px solid rgba(242,193,85,.20);border-radius:16px;background:rgba(242,193,85,.07);color:#e9dfc5;font-size:12px;line-height:1.38;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
#alphaPlaceDetailContent.alpha431 .a431actions{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:9px!important;padding:8px 18px 14px!important}
#alphaPlaceDetailContent.alpha431 .a431actions button{min-height:62px!important;border:1px solid rgba(91,191,151,.20)!important;border-radius:22px!important;background:linear-gradient(145deg,rgba(20,48,42,.92),rgba(15,37,34,.88))!important;color:#eef8f4!important;font-size:12px!important;font-weight:750!important;box-shadow:none!important;padding:9px 5px!important;overflow:hidden!important}
#alphaPlaceDetailContent.alpha431 .a431actions button span{font-family:Arial,sans-serif!important;font-size:18px!important;line-height:1!important;margin-bottom:6px!important;color:#dcebe6!important}
#alphaPlaceDetailContent.alpha431 .a431source{padding-top:5px!important}
#alphaPlaceDetailContent.alpha431 .a431tip{font-size:12px!important;line-height:1.4!important}
@media(max-width:370px){#alphaPlaceDetailContent.alpha431 .a431actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
`;document.head.appendChild(s)}
function bgUrl(el){if(!el)return'';const img=el.querySelector?.('img[src]');if(img?.src)return img.src;for(const n of [el,...(el.querySelectorAll?.('*')||[])]){const b=n.style?.backgroundImage||getComputedStyle(n).backgroundImage||'';const m=b.match(/url\(["']?([^"')]+)["']?\)/i);if(m?.[1]&&m[1]!=='none')return m[1]}return''}
function cardHero(name){if(!name)return'';const cards=[...document.querySelectorAll('.alphaPlaceCard,[data-place-key],.place-card,.alpha-card')];const target=cards.find(c=>(c.textContent||'').includes(name));return bgUrl(target)}
function shortStatus(text){const t=String(text||'').trim();if(!t)return'';if(/^aberto\b/i.test(t))return '● Aberto';if(/^fechado\b/i.test(t))return '● Fechado';if(/^encerra|^fecha\b/i.test(t)){const m=t.match(/(?:encerra|fecha)[^.;]{0,35}/i);return '● '+(m?.[0]||t.slice(0,38))}return t.length<=55?t:''}
function noticeFrom(text){const t=String(text||'').replace(/^●\s*/,'').trim();if(!t)return'';if(/aviso|manuten|obra|encerr|interromp|condicion|acesso|restriç|lotação|indispon/i.test(t)){const parts=t.split(/(?<=[.!?])\s+/);return parts.slice(0,2).join(' ').slice(0,260)}return''}
function clean(){css();const host=document.getElementById('alphaPlaceDetailContent');if(!host?.classList.contains('alpha431'))return;
  const title=(host.querySelector('.a431head h2')?.textContent||'').trim();
  let hero=host.querySelector('.a431hero');
  if(!hero){const u=cardHero(title);if(u){hero=document.createElement('div');hero.className='a431hero';hero.style.backgroundImage=`url("${u.replace(/"/g,'%22')}")`;host.prepend(hero)}}
  else {const inline=hero.style.backgroundImage||'';if(!inline||inline==='none'){const u=cardHero(title);if(u)hero.style.backgroundImage=`url("${u.replace(/"/g,'%22')}")`}}
  const facts=[...host.querySelectorAll('.a431fact')];let warning='';
  for(const f of facts){const t=(f.textContent||'').trim();if(/^⏱|circuito|duração típica/i.test(t)){f.remove();continue}if(f.classList.contains('open')){warning=noticeFrom(t);const sh=shortStatus(t);if(sh)f.textContent=sh;else f.remove()}}
  const desc=host.querySelector('.a431desc');if(desc){let t=(desc.textContent||'').replace(/\s+/g,' ').trim();if(t.length>210)t=t.slice(0,207).replace(/\s+\S*$/,'')+'…';desc.textContent=t}
  if(warning&&!host.querySelector('.a431notice')){const n=document.createElement('div');n.className='a431notice';n.innerHTML='<b>Aviso</b> · '+esc(warning);const factsBox=host.querySelector('.a431facts');(factsBox?.parentElement||host).insertAdjacentElement('afterend',n)}
  /* Duration/circuit belongs in subdetails: if there is no occupancy button, expose a compact Visita subdetail entry by reusing the occupancy panel. */
  const actions=host.querySelector('.a431actions');const hasDuration=facts.some(f=>/^⏱|circuito|duração típica/i.test((f.textContent||'').trim()));
  if(hasDuration&&actions&&!actions.querySelector('[data-a431="occupancy"]')){const b=document.createElement('button');b.type='button';b.dataset.a431='occupancy';b.innerHTML='<span>◷</span>Visita';actions.appendChild(b);b.onclick=()=>{const original=[...host.querySelectorAll('[data-a431="occupancy"]')].find(x=>x!==b);original?.click()}}
}
const original=window.alphaOpenPlaceDetail;if(typeof original==='function')window.alphaOpenPlaceDetail=function(...a){const r=original.apply(this,a);requestAnimationFrame(()=>setTimeout(clean,20));return r};
window.addEventListener('pageshow',()=>setTimeout(clean,30),{passive:true});
setTimeout(clean,0);
console.info('[ALPHA 4.3.31] place detail cleanup ativo');
})();
