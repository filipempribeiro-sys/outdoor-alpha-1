/* ALPHA 4.3.33 · HOME BUTTONS ONLY
   Scope: Home controls only.
   - hides the Home burger and New conversation button
   - does NOT inject or replace any OLEN logo artwork
   CHAT/sidebar/footer/navigation/gestures remain untouched.
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
