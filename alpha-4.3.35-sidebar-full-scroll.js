/* ALPHA 4.3.35 · CHAT SIDEBAR FULL SCROLL
   Isolated layout behavior only.
   - whole Chat sidebar scrolls as one column
   - nested conversation/panel scroll areas are released
   - scrollbars hidden
   - footer participates in normal document flow
*/
(()=>{
'use strict';
if(window.__alphaChatSidebarFullScroll435)return;
window.__alphaChatSidebarFullScroll435=true;

const style=document.createElement('style');
style.id='alphaChatSidebarFullScroll435';
style.textContent=`
body.alphaChatMode .alphaConversationSidebar,
body.alphaComposeMode .alphaConversationSidebar{
  overflow:hidden!important;
}

body.alphaChatMode .alphaChatOlenSidebar4330,
body.alphaComposeMode .alphaChatOlenSidebar4330{
  overflow-y:auto!important;
  overflow-x:hidden!important;
  overscroll-behavior-y:contain;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none!important;
  -ms-overflow-style:none!important;
}

body.alphaChatMode .alphaChatOlenSidebar4330::-webkit-scrollbar,
body.alphaComposeMode .alphaChatOlenSidebar4330::-webkit-scrollbar{
  display:none!important;
  width:0!important;
  height:0!important;
}

.alphaChatOlenRecents4330,
.alphaChatPinned4330,
.alphaChatOlenPanel4330{
  overflow:visible!important;
  min-height:auto!important;
  max-height:none!important;
  scrollbar-width:none!important;
  -ms-overflow-style:none!important;
}

.alphaChatOlenRecents4330::-webkit-scrollbar,
.alphaChatPinned4330::-webkit-scrollbar,
.alphaChatOlenPanel4330::-webkit-scrollbar{
  display:none!important;
  width:0!important;
  height:0!important;
}

.alphaChatOlenBottom4330{
  margin-top:10px!important;
  flex:0 0 auto!important;
}
`;
document.head.appendChild(style);

console.info('[ALPHA 4.3.35] Chat sidebar full scroll enabled');
})();
