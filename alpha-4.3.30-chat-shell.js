/* ALPHA 4.3.30 · CHAT SHELL — DYNAMIC FOOTER + TOP CAPSULE
   Base preservada: rollback-alpha-4.3.29-stable
   - Sidebar Chat: reutiliza a navegação do footer Home e distribui dinamicamente os ícones
   - Topo Chat: cápsula única Spotify + Novo chat + menu vertical
   - Menu vertical abre/fecha a sidebar existente
*/
(()=>{
'use strict';
const VERSION='4.3.30';
const $=id=>document.getElementById(id);
const isChat=()=>document.body?.classList.contains('alphaChatMode')||document.body?.classList.contains('alphaComposeMode');
function iconDots(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>'}
function styles(){if($('alphaChatShell4330Style'))return;const s=document.createElement('style');s.id='alphaChatShell4330Style';s.textContent=`
body.alphaChatMode .alphaChatActions4324,body.alphaComposeMode .alphaChatActions4324{margin-left:auto!important;display:flex!important;align-items:center!important;width:auto!important;max-width:min(190px,48vw)!important;border-radius:999px!important;overflow:hidden!important}
body.alphaChatMode .alphaChatActions4324>button,body.alphaComposeMode .alphaChatActions4324>button{flex:0 0 52px!important;width:52px!important;height:52px!important;min-width:52px!important;border-radius:0!important;margin:0!important}
body.alphaChatMode .alphaChatActions4324>button:first-child,body.alphaComposeMode .alphaChatActions4324>button:first-child{border-radius:999px 0 0 999px!important}
body.alphaChatMode .alphaChatActions4324>button:last-child,body.alphaComposeMode .alphaChatActions4324>button:last-child{border-radius:0 999px 999px 0!important}
.alphaChatMore4330 svg{width:25px;height:25px;fill:currentColor}
.alphaConversationSidebar .alphaSidebarDock{display:grid!important;grid-template-columns:repeat(var(--alpha-chat-nav-count,5),minmax(0,1fr))!important;gap:clamp(2px,1.4vw,7px)!important;width:100%!important;align-items:stretch!important}
.alphaConversationSidebar .alphaSidebarDock>button{min-width:0!important;width:100%!important;max-width:none!important;padding-left:2px!important;padding-right:2px!important}
.alphaConversationSidebar .alphaSidebarDock>button .alphaNavIcon{margin-inline:auto!important}
@media(max-width:390px){body.alphaChatMode .alphaChatActions4324>button,body.alphaComposeMode .alphaChatActions4324>button{flex-basis:48px!important;width:48px!important;height:48px!important;min-width:48px!important}}
`;document.head.append(s)}
function footerButtons(){const nav=document.querySelector('nav.bottom,.bottom');if(!nav)return[];return [...nav.children].filter(b=>b.matches?.('button.nav,.nav')&&!b.hidden&&getComputedStyle(b).display!=='none'&&b.id!=='spotifyNav')}
function cloneFooterToSidebar(){const dock=document.querySelector('.alphaConversationSidebar .alphaSidebarDock');if(!dock)return;const source=footerButtons();if(!source.length)return;const sig=source.map(b=>b.id||b.dataset.id||b.getAttribute('aria-label')||b.title||'nav').join('|');if(dock.dataset.alphaFooterSig===sig)return;dock.dataset.alphaFooterSig=sig;dock.replaceChildren();source.forEach(src=>{const b=document.createElement('button');b.type='button';b.dataset.alphaChatFooterNav='1';b.dataset.alphaIconified='1';b.className=src.className||'nav';b.classList.remove('active');const label=src.getAttribute('aria-label')||src.title||src.textContent?.trim()||'Navegação';b.setAttribute('aria-label',label);b.title=label;b.innerHTML=src.innerHTML;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();try{window.alphaCloseChatMenu?.()}catch{};const id=src.dataset.id||src.id?.replace(/Nav$/,'');if(src.onclick){try{src.click();return}catch{}}if(id&&typeof window.go==='function')window.go(id);else if(id&&typeof window.alphaInternalNavigate==='function')window.alphaInternalNavigate(id)});dock.append(b)});dock.style.setProperty('--alpha-chat-nav-count',String(source.length))}
function toggleExistingMenu(){const sidebar=document.querySelector('.alphaConversationSidebar');if(!sidebar)return;const visible=getComputedStyle(sidebar).display!=='none'&&!sidebar.hidden&&sidebar.getAttribute('aria-hidden')!=='true';if(visible){if(typeof window.alphaCloseChatMenu==='function'){window.alphaCloseChatMenu();return}sidebar.hidden=true;sidebar.setAttribute('aria-hidden','true')}else{const opener=document.querySelector('.aiChatMenuBtn,button[aria-label="Abrir conversas"],button[aria-label*="convers" i]');if(opener){opener.click();return}sidebar.hidden=false;sidebar.setAttribute('aria-hidden','false')}}
function ensureTopCapsule(){const bar=document.querySelector('#lifestyleAI .aiTopbar.alphaFloatingHeader');if(!bar||!isChat())return;const cap=bar.querySelector('.alphaChatActions4324');if(!cap)return;let more=cap.querySelector('.alphaChatMore4330');if(!more){more=document.createElement('button');more.type='button';more.className='alphaChatMore4330';more.setAttribute('aria-label','Menu da conversa');more.title='Menu';more.innerHTML=iconDots();more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleExistingMenu()});cap.append(more)}const spotify=cap.querySelector('.alphaSpotifyToggle4324');const newChat=cap.querySelector('.alphaNewChatBtn');if(spotify&&cap.firstElementChild!==spotify)cap.prepend(spotify);if(newChat&&newChat.nextElementSibling!==more)cap.insertBefore(newChat,more)}
function reconcile(){styles();if(!isChat())return;ensureTopCapsule();cloneFooterToSidebar()}
['pageshow','focus','resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(reconcile,80),{passive:true}));document.addEventListener('click',()=>setTimeout(reconcile,60),true);new MutationObserver(()=>requestAnimationFrame(reconcile)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(reconcile,150);setTimeout(reconcile,600);console.info('[ALPHA '+VERSION+'] CHAT dynamic footer + capsule ativo');
})();
