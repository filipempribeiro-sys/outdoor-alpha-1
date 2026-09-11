/* ALPHA 4.3.33 · HOME BUTTONS ONLY
   Única alteração: esconder na HOME o burger e o botão Nova conversa.
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
  `;
  document.head.appendChild(style);
})();
