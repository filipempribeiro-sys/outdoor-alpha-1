/* ALPHA 4.3.33 · HOME BUTTONS ONLY
   Única alteração original: esconder na HOME o burger e o botão Nova conversa.
   Acrescento visual: substituir apenas o símbolo do logótipo pelo novo emblema OLEN.
   CHAT/sidebar/footer/navegação/gestos permanecem intocados.
*/
(()=>{
  'use strict';
  if(window.__alphaHomeButtonsOnly433)return;
  window.__alphaHomeButtonsOnly433=true;

  const style=document.createElement('style');
  style.id='alphaHomeButtonsOnly433';
  style.textContent=`
    body:not(.alphaChatMode):not(.alphaComposeMode) #home.active #lifestyleAI > .aiTopbar .aiChatMenuBtn,
    body:not(.alphaChatMode):not(.alphaComposeMode) #home.active #lifestyleAI > .aiTopbar .alphaNewChatBtn{
      display:none!important;
    }

    .brand .logo{
      background:transparent!important;
      border-radius:14px!important;
      overflow:hidden!important;
      display:grid!important;
      place-items:center!important;
      box-shadow:0 0 18px rgba(35,226,191,.16)!important;
    }
    .brand .logo::after{display:none!important;content:none!important}
    .brand .logo svg{width:100%!important;height:100%!important;display:block!important}
  `;
  document.head.appendChild(style);

  const olenLogo=`
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="OLEN">
    <defs>
      <linearGradient id="olenBg" x1="8" y1="8" x2="92" y2="92" gradientUnits="userSpaceOnUse">
        <stop stop-color="#0b2722"/>
        <stop offset=".55" stop-color="#071b20"/>
        <stop offset="1" stop-color="#081224"/>
      </linearGradient>
      <linearGradient id="olenGrad" x1="18" y1="18" x2="84" y2="84" gradientUnits="userSpaceOnUse">
        <stop stop-color="#38efad"/>
        <stop offset=".47" stop-color="#22d9d3"/>
        <stop offset=".78" stop-color="#23a8ff"/>
        <stop offset="1" stop-color="#6757ff"/>
      </linearGradient>
      <linearGradient id="olenA" x1="28" y1="30" x2="74" y2="72" gradientUnits="userSpaceOnUse">
        <stop stop-color="#8fffd8"/>
        <stop offset=".45" stop-color="#25e0ce"/>
        <stop offset="1" stop-color="#2d9cff"/>
      </linearGradient>
      <filter id="olenGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.1" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect x="3" y="3" width="94" height="94" rx="24" fill="url(#olenBg)" stroke="url(#olenGrad)" stroke-width="3"/>
    <circle cx="50" cy="50" r="35.5" fill="none" stroke="url(#olenGrad)" stroke-width="3.3" filter="url(#olenGlow)"/>
    <path d="M27.5 64.5 L47.8 31.5 Q50 28 52.2 31.5 L72.5 64.5" fill="none" stroke="url(#olenA)" stroke-width="12.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#olenGlow)"/>
    <path d="M50 52.5 L52.8 59.7 L60 62.5 L52.8 65.3 L50 72.5 L47.2 65.3 L40 62.5 L47.2 59.7 Z" fill="#7fffe2" filter="url(#olenGlow)"/>
  </svg>`;

  function applyOlenLogo(){
    document.querySelectorAll('.brand .logo').forEach(el=>{
      if(el.dataset.olenLogo==='1')return;
      el.innerHTML=olenLogo;
      el.dataset.olenLogo='1';
      el.setAttribute('aria-label','OLEN');
    });
  }

  applyOlenLogo();
  const mo=new MutationObserver(applyOlenLogo);
  mo.observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(applyOlenLogo,80);
  setTimeout(applyOlenLogo,500);
})();
