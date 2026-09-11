/* ALPHA 4.3.36 · CHAT SIDEBAR FIXED HEADER + FOOTER
   Isolated correction over 4.3.35:
   - header always visible
   - footer always visible
   - only the center content scrolls
   - no visible scrollbars
*/
(()=>{
'use strict';
if(window.__alphaChatSidebarFixedEnds436)return;
window.__alphaChatSidebarFixedEnds436=true;

function prepare(){
  const sh=document.querySelector('.alphaChatOlenSidebar4330');
  if(!sh)return;
  let body=sh.querySelector(':scope > .alphaChatOlenScrollBody436');
  if(!body){
    const head=sh.querySelector(':scope > .alphaChatOlenHead4330');
    const bottom=sh.querySelector(':scope > .alphaChatOlenBottom4330');
    if(!head||!bottom)return;
    body=document.createElement('div');
    body.className='alphaChatOlenScrollBody436';
    let node=head.nextSibling;
    while(node&&node!==bottom){
      const next=node.nextSibling;
      body.appendChild(node);
      node=next;
    }
    sh.insertBefore(body,bottom);
  }
}

const style=document.createElement('style');
style.id='alphaChatSidebarFixedEnds436';
style.textContent=`
body.alphaChatMode .alphaChatOlenSidebar4330,
body.alphaComposeMode .alphaChatOlenSidebar4330{
  overflow:hidden!important;
  display:flex!important;
  flex-direction:column!important;
}
.alphaChatOlenHead4330{
  flex:0 0 auto!important;
  position:relative!important;
  z-index:2;
}
.alphaChatOlenScrollBody436{
  flex:1 1 auto!important;
  min-height:0!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  overscroll-behavior-y:contain;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none!important;
  -ms-overflow-style:none!important;
}
.alphaChatOlenScrollBody436::-webkit-scrollbar{
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
}
.alphaChatOlenBottom4330{
  flex:0 0 auto!important;
  margin-top:0!important;
  position:relative!important;
  z-index:2;
}
`;
document.head.appendChild(style);

prepare();
window.addEventListener('pageshow',()=>requestAnimationFrame(prepare),{passive:true});
document.addEventListener('click',()=>requestAnimationFrame(prepare),true);

console.info('[ALPHA 4.3.36] sidebar fixed header/footer enabled');
})();
