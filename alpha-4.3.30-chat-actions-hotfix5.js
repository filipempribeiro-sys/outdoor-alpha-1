/* ALPHA 4.3.30 · CHAT ACTIONS HOTFIX 5
   - Spotify button in Chat calls the proven 4.3.28 global remote toggle
   - ⋮ opens a dedicated Chat menu, never the sidebar
   - Uses capture-phase delegation to override broken earlier handlers
*/
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICONS={
 status:svg('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
 share:svg('<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>'),
 chat:svg('<path d="M21 11.5a8.5 8.5 0 0 1-9 8.4A9.8 9.8 0 0 1 7 18.5L3 20l1.5-4A8.5 8.5 0 1 1 21 11.5Z"/>'),
 home:svg('<path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4Z"/>')
};
function ensureStyle(){if($('alphaChatActionsHotfix5Style'))return;const s=document.createElement('style');s.id='alphaChatActionsHotfix5Style';s.textContent=`
.alphaChatOverflowScrim5{position:fixed;inset:0;z-index:8998;background:transparent}
.alphaChatOverflow5{position:fixed;top:calc(env(safe-area-inset-top) + 76px);right:14px;z-index:8999;width:min(300px,calc(100vw - 28px));padding:8px;background:rgba(31,31,33,.98);border:1px solid rgba(255,255,255,.13);border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.42);backdrop-filter:blur(18px)}
.alphaChatOverflow5 button{width:100%;height:54px;border:0;background:transparent;color:#f7f7f7;display:flex;align-items:center;gap:14px;padding:0 15px;border-radius:14px;text-align:left;font:700 16px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.alphaChatOverflow5 button:active{background:rgba(255,255,255,.08)}
.alphaChatOverflow5 svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
`;document.head.append(s)}
function closeOverflow(){document.querySelector('.alphaChatOverflow5')?.remove();document.querySelector('.alphaChatOverflowScrim5')?.remove()}
function openOverflow(){closeOverflow();ensureStyle();const scrim=document.createElement('div');scrim.className='alphaChatOverflowScrim5';scrim.addEventListener('click',closeOverflow);document.body.append(scrim);const menu=document.createElement('div');menu.className='alphaChatOverflow5';menu.innerHTML=`<button data-a="status">${ICONS.status}<span>Estado da ALPHA</span></button><button data-a="share">${ICONS.share}<span>Partilhar</span></button><button data-a="conversations">${ICONS.chat}<span>Conversas</span></button><button data-a="home">${ICONS.home}<span>Home</span></button>`;menu.addEventListener('click',async e=>{const b=e.target.closest('button[data-a]');if(!b)return;const a=b.dataset.a;closeOverflow();if(a==='conversations'){document.querySelector('#alphaInternalMenuBtn,.aiChatMenuBtn,button[aria-label="Abrir conversas"]')?.click();return}if(a==='home'){if(typeof window.go==='function')window.go('home');else if(typeof window.alphaInternalNavigate==='function')window.alphaInternalNavigate('home');return}if(a==='share'){try{if(navigator.share)await navigator.share({title:'ALPHA',text:'ALPHA'});else navigator.clipboard?.writeText(location.href)}catch{}return}if(a==='status'){const toast=document.querySelector('.toast');if(toast){toast.textContent='ALPHA 4.3.30 · OLEN ativo';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}else alert('ALPHA 4.3.30 · OLEN ativo')}});document.body.append(menu)}
async function toggleSpotify(){const fn=window.alphaSpotifyToggleGlobal4328||window.alphaSpotifyToggleGlobal4327||window.alphaSpotifyToggleGlobal4326||window.alphaSpotifyToggleGlobal4325||window.alphaSpotifyToggleGlobal4324||window.alphaSpotifyToggleGlobal4323||window.alphaSpotifyToggleGlobal4322;if(typeof fn==='function'){try{await fn();return}catch(e){console.warn('[ALPHA 4.3.30] Spotify toggle fn failed',e)}}const root=$('alphaSpotifyGlobal'),box=$('alphaSpotifyOverlay');if(root){const open=root.hidden;root.hidden=!open;if(box)box.hidden=!open;try{await window.alphaSpotifyPollGlobal?.(true)}catch{}try{await window.alphaSpotifyRefreshGlobal?.(true)}catch{}}}
function isChat(){return document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode')}
document.addEventListener('click',e=>{if(!isChat())return;const spotify=e.target.closest?.('.alphaChatActions4324 .alphaSpotifyToggle4324,.alphaChatSpotify4324');if(spotify){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();toggleSpotify();return}const more=e.target.closest?.('.alphaChatActions4324 .alphaChatMore4330,.alphaChatMore4330');if(more){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openOverflow()}},true);
console.info('[ALPHA 4.3.30] chat actions hotfix5 ativo');
})();
