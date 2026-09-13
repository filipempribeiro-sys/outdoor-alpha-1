/* OLEN 4.4.0 · CHAT FULLSCREEN SIDEBAR HEADER FIX
   Scope: OLEN/Chat fullscreen sidebar only.
   - hides the floating hamburger while the chat sidebar is open
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
body.alphaChatOlenOpen4330.alphaChatMode #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaComposeMode #lifestyleAI .aiChatMenuBtn.alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaChatMode #lifestyleAI .aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #lifestyleAI .aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode #aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #aiChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode #alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaComposeMode #alphaChatMenuBtn,
body.alphaChatOlenOpen4330.alphaChatMode .alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaFloatingMenu,
body.alphaChatOlenOpen4330.alphaChatMode .alphaChatActions4324,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaChatActions4324{
  display:none!important;
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
}
body.alphaChatOlenOpen4330.alphaChatMode #aiChatMenu,
body.alphaChatOlenOpen4330.alphaComposeMode #aiChatMenu,
body.alphaChatOlenOpen4330.alphaChatMode .alphaConversationSidebar,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaConversationSidebar{
  z-index:12050!important;
}
body.alphaChatOlenOpen4330.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenHead4330,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenHead4330{
  position:relative!important;
  z-index:12060!important;
}
body.alphaChatOlenOpen4330.alphaChatMode .alphaChatOlenSidebar4330 .alphaChatOlenBrand4330,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaChatOlenSidebar4330 .alphaChatOlenBrand4330,
body.alphaChatOlenOpen4330.alphaChatMode .alphaChatOlenSidebar4330 .alphaSidebarLogo.logo,
body.alphaChatOlenOpen4330.alphaComposeMode .alphaChatOlenSidebar4330 .alphaSidebarLogo.logo{
  visibility:visible!important;
  opacity:1!important;
  z-index:12061!important;
  pointer-events:none!important;
}
`;
document.head.appendChild(style);
console.info('[OLEN 4.4.0] chat fullscreen sidebar header fix active · strong override');
})();
