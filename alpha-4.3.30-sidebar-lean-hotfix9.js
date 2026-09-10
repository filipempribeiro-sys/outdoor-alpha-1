/* ALPHA 4.3.30 · OLEN SIDEBAR LEAN HOTFIX 9
   Correção cirúrgica, sem observers nem polling adicionais.
   - Home/vistas internas abrem a mesma .alphaConversationSidebar usada no Chat
   - preserva OLEN + logo correto + pesquisa + secções + footer + long-press existentes
   - Chat fullscreen: swipe da margem esquerda abre; swipe para a esquerda fecha
   - toque no scrim fecha
*/
(()=>{
'use strict';
const EDGE=30,SWIPE=58,DOM=1.35;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const isChat=()=>document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode');
const side=()=>$('.alphaConversationSidebar')||$('#aiChatMenu');
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICONS={
 search:svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>'),
 image:svg('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 3 3 3-4 5 6"/>'),
 library:svg('<path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z"/><path d="M7 8h12M9 4v16"/>'),
 project:svg('<path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>'),
 clock:svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
 pin:svg('<path d="m9 3 6 6-2 2 3 4-1 1-4-3-2 2-6-6 6-6Z"/><path d="m8 16-5 5"/>'),
 chat:svg('<path d="M21 11.5a8.5 8.5 0 0 1-9 8.4A9.8 9.8 0 0 1 7 18.5L3 20l1.5-4A8.5 8.5 0 1 1 21 11.5Z"/>')
};
function style(){if($('#alphaSidebarLean9Style'))return;const s=document.createElement('style');s.id='alphaSidebarLean9Style';s.textContent=`
#alphaOlenLeanScrim9{position:fixed;inset:0;z-index:4990;background:rgba(0,0,0,.34);display:none}
body.alphaOlenLeanOpen9 #alphaOlenLeanScrim9{display:block}
body.alphaOlenLeanOpen9 .alphaConversationSidebar{z-index:5000!important}
body.alphaOlenLeanOpen9 #alphaInternalSidebar,body.alphaOlenLeanOpen9 #alphaInternalScrim{display:none!important}
.alphaOlenHead .alphaOlenBrandLogo{width:39px;height:39px;min-width:39px;border-radius:13px;display:grid;place-items:center;overflow:hidden}
.alphaOlenHead .alphaOlenBrandLogo .logo,.alphaOlenHead .alphaOlenBrandLogo img{width:39px!important;height:39px!important;margin:0!important;object-fit:cover!important;object-position:center!important}
`;document.head.append(s)}
function logoSource(){return $('#alphaInternalSidebar .alphaSidebarBrand .logo,#alphaInternalSidebar .logo,.top .brand .logo,.brand .logo,.logo')}
function originals(s){return [...s.querySelectorAll('button,a,[role="button"]')].filter(el=>{if(el.closest('.alphaOlenSidebar'))return false;const t=(el.textContent||'').trim();return t&&t.length<=120&&!/nova conversa|spotify|premium|perfil|mapa|live|calend|home|alpha|olen/i.test(t)})}
function ensureShell(){const s=side();if(!s)return null;let sh=s.querySelector('.alphaOlenSidebar');if(sh){ensureBrand(sh);return sh}
 const src=originals(s);sh=document.createElement('div');sh.className='alphaOlenSidebar';sh.innerHTML=`<div class="alphaOlenHead"><div class="alphaOlenBrandLogo"></div><div class="alphaOlenName">OLEN</div><button class="alphaOlenSearch" type="button" aria-label="Pesquisar conversas">${ICONS.search}</button></div><div class="alphaOlenSearchBox"><input type="search" placeholder="Pesquisar conversas"></div><div class="alphaOlenNav"><button class="alphaOlenItem" data-kind="images">${ICONS.image}<span>Imagens</span></button><button class="alphaOlenItem" data-kind="library">${ICONS.library}<span>Biblioteca</span></button><button class="alphaOlenItem" data-kind="projects">${ICONS.project}<span>Projetos / Planos</span></button><button class="alphaOlenItem" data-kind="scheduled">${ICONS.clock}<span>Agendados</span></button><button class="alphaOlenItem" data-kind="pinned">${ICONS.pin}<span>Afixados</span></button></div><div class="alphaOlenSep"></div><div class="alphaOlenRecentTitle">Recentes</div><div class="alphaOlenRecents"></div><button class="alphaOlenMore" type="button">Ver todas</button><div class="alphaOlenBottom"><div class="alphaSidebarDock"></div></div>`;
 [...s.children].forEach(n=>n.style.setProperty('display','none','important'));s.append(sh);
 const rec=sh.querySelector('.alphaOlenRecents');src.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.className='alphaOlenRecent';b.dataset.alphaOriginalIndex=String(i);b.innerHTML=ICONS.chat+'<span class="alphaOlenRecentText"></span>';b.querySelector('span').textContent=(o.textContent||'Conversa').trim().replace(/\s+/g,' ');b.hidden=i>=4;b.addEventListener('click',()=>o.click());rec.append(b)});
 const more=sh.querySelector('.alphaOlenMore');let expanded=false;more.hidden=rec.children.length<=4;more.addEventListener('click',()=>{expanded=!expanded;[...rec.children].forEach((b,i)=>b.hidden=!expanded&&i>=4);more.textContent=expanded?'Mostrar menos':'Ver todas'});
 const sb=sh.querySelector('.alphaOlenSearch'),box=sh.querySelector('.alphaOlenSearchBox'),input=box.querySelector('input');sb.addEventListener('click',()=>{box.classList.toggle('show');if(box.classList.contains('show'))setTimeout(()=>input.focus(),20)});input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();[...rec.children].forEach((b,i)=>b.hidden=q?!b.textContent.toLowerCase().includes(q):(!expanded&&i>=4))});
 ensureBrand(sh);return sh}
function ensureBrand(sh){const h=sh.querySelector('.alphaOlenHead');if(!h)return;let holder=h.querySelector('.alphaOlenBrandLogo');if(!holder){holder=document.createElement('div');holder.className='alphaOlenBrandLogo';h.prepend(holder)}if(!holder.firstElementChild){const src=logoSource();if(src){const c=src.cloneNode(true);c.removeAttribute('id');holder.append(c)}}const n=h.querySelector('.alphaOlenName');if(n)n.textContent='OLEN'}
function scrim(){let x=$('#alphaOlenLeanScrim9');if(!x){x=document.createElement('div');x.id='alphaOlenLeanScrim9';x.addEventListener('click',close);document.body.append(x)}return x}
function open(){style();const s=side(),sh=ensureShell();if(!s||!sh)return;$('#alphaInternalSidebar')?.classList.remove('show');$('#alphaInternalScrim')?.classList.remove('show');s.hidden=false;s.setAttribute('aria-hidden','false');s.classList.add('show');document.body.classList.add('alphaSidebarOpen4330','alphaOlenLeanOpen9');scrim();ensureBrand(sh)}
function close(){const s=side();if(!s)return;s.setAttribute('aria-hidden','true');s.classList.remove('show');document.body.classList.remove('alphaSidebarOpen4330','alphaOlenLeanOpen9')}
function visible(){const s=side();if(!s)return false;const r=s.getBoundingClientRect(),cs=getComputedStyle(s);return !s.hidden&&s.getAttribute('aria-hidden')!=='true'&&cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>40}
function bindMenu(){document.addEventListener('click',e=>{if(isChat())return;const b=e.target?.closest?.('#alphaInternalMenuBtn,.aiChatMenuBtn,#aiChatMenuBtn,button[aria-label="Abrir conversas"],button[aria-label="Abrir navegação"]');if(!b||b.closest('.alphaOlenSidebar'))return;e.preventDefault();e.stopImmediatePropagation();visible()?close():open()},true)}
let g=null;function start(e){if(e.touches?.length!==1)return;const t=e.touches[0];if(visible()){const r=side()?.getBoundingClientRect();if(r&&t.clientX<=r.right+2)g={m:'c',x:t.clientX,y:t.clientY};return}if(isChat()&&t.clientX<=EDGE)g={m:'o',x:t.clientX,y:t.clientY}}
function end(e){if(!g)return;const z=g;g=null;const t=e.changedTouches?.[0];if(!t)return;const dx=t.clientX-z.x,dy=t.clientY-z.y;if(Math.abs(dx)<SWIPE||Math.abs(dx)<=Math.abs(dy)*DOM)return;if(z.m==='c'&&dx<0)close();if(z.m==='o'&&dx>0){const op=$('.aiChatMenuBtn,#aiChatMenuBtn,button[aria-label="Abrir conversas"]');if(op)op.click();else open()}}
style();scrim();bindMenu();document.addEventListener('touchstart',start,{passive:true});document.addEventListener('touchend',end,{passive:true});window.alphaOpenOlenSidebarLean9=open;window.alphaCloseOlenSidebarLean9=close;console.info('[ALPHA 4.3.30] OLEN sidebar lean hotfix9 ativo');
})();