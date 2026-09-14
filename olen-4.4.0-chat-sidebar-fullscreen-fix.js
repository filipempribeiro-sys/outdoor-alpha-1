/* OLEN 4.4.0 · CHAT FULLSCREEN SIDEBAR HEADER FIX
   Scope: OLEN/Chat fullscreen sidebar only.
   - hides the actual Chat hamburger/menu trigger while the sidebar is open
   - keeps the sidebar OLEN logo/header above any remaining overlays
   No Home/intro/footer/other-tab behavior is changed.
*/
(()=>{
'use strict';
if(window.__olenChatFullscreenSidebarHeaderFix440)return;
window.__olenChatFullscreenSidebarHeaderFix440=true;

const style=document.createElement('style');
style.id='olenChatFullscreenSidebarHeaderFix440Style';
style.textContent=`
body.alphaChatOlenOpen4330.alphaChatMode #chatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #chatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .chatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .chatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode #aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode #alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaChatMode .alphaMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .menuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode .menuBtn,
body.alphaChatOlenOpen4330.alphaChatMode button[aria-label="Abrir menu"],
body.alphaChatOlenOpen4330.alphaComposeMode button[aria-label="Abrir menu"],
body.alphaChatOlenOpen4330.alphaChatMode button[aria-label="Menu"],
body.alphaChatOlenOpen4330.alphaComposeMode button[aria-label="Menu"],
body.alphaChatOlenOpen4330.alphaChatMode button[aria-label="Abrir navegação"],
body.alphaChatOlenOpen4330.alphaComposeMode button[aria-label="Abrir navegação"],
body.alphaChatOlenOpen4330.alphaChatMode button[aria-label="Abrir conversas"],
body.alphaChatOlenOpen4330.alphaComposeMode button[aria-label="Abrir conversas"]{
  display:none!important;
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
}
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenHead4330,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenHead4330{
  position:relative!important;
  z-index:5!important;
}
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenBrand4330,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenBrand4330,
body.alphaChatMode .alphaChatOlenSidebar4330 .alphaSidebarLogo.logo,
body.alphaComposeMode .alphaChatOlenSidebar4330 .alphaSidebarLogo.logo{
  visibility:visible!important;
  opacity:1!important;
  z-index:6!important;
  pointer-events:none!important;
}
`;
document.head.appendChild(style);

console.info('[OLEN 4.4.0] chat fullscreen sidebar header fix active');
})();
