/* ALPHA 4.3.40 · INTERNAL SIDEBAR NO SPOTIFY
   Removes Spotify only from the internal sidebar used on views 3–7.
   Chat sidebar is untouched.
*/
(()=>{
'use strict';
if(window.__alphaInternalSidebarNoSpotify440)return;
window.__alphaInternalSidebarNoSpotify440=true;

const style=document.createElement('style');
style.id='alphaInternalSidebarNoSpotify440';
style.textContent=`
#alphaInternalSidebar .alphaInternalNavList button[onclick*="alphaSpotifyFooterAction"]{
  display:none!important;
}
`;
document.head.appendChild(style);

const spotifyBtn=document.querySelector('#alphaInternalSidebar .alphaInternalNavList button[onclick*="alphaSpotifyFooterAction"]');
if(spotifyBtn)spotifyBtn.hidden=true;

console.info('[ALPHA 4.3.40] Spotify removed from internal sidebar only');
})();