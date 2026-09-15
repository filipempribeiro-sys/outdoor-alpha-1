/* OLEN 5.0 · MEDIA
   Consolidated owner prepared from the current 5/5 Spotify/media behaviour.
   IMPORTANT: intentionally NOT loaded by index.html or sw.js yet.
   Existing Spotify runtime remains untouched until explicit cutover.
*/
(()=>{
'use strict';
const core=window.OLEN?.core;
if(!core||window.OLEN?.media?.version==='5.0.0')return;
const VERSION='5.0.0';

function legacy(name,...args){
  const fn=window[name];
  return typeof fn==='function'?core.safe(()=>fn(...args)):undefined;
}

function sessionId(){return legacy('alphaSpotifySessionId')||''}
function status(){return legacy('alphaSpotifyStatus')}
function auth(pending){return legacy('alphaSpotifyAuth',pending)}
function remote(action,playlist=null,button=null){return legacy('alphaSpotifyRemote',action,playlist,button)}
function openPlaylist(playlist){return legacy('alphaOpenSpotifyPlaylist',playlist)}
function ensurePlaylist(messageIndex,options={}){return legacy('alphaEnsureSpotifyPlaylist',messageIndex,options)}
function createPlaylist(conversationId,requestId){return legacy('alphaCreateSpotifyPlaylistForMessage',conversationId,requestId)}
function latestPlaylist(conversation){return legacy('alphaLatestPlaylistForConversation',conversation)}
function latestPlaylistSpec(conversation){return legacy('alphaLatestPlaylistSpecForConversation',conversation)}
function savePending(value){return legacy('alphaSaveSpotifyPending',value)}
function loadPending(){return legacy('alphaLoadSpotifyPending')}

async function connected(){
  try{
    const result=await status();
    return !!result?.connected;
  }catch{return false}
}

async function play(playlist=null,button=null){return remote('play',playlist,button)}
async function pause(button=null){return remote('pause',null,button)}
async function next(button=null){return remote('next',null,button)}
async function previous(button=null){return remote('previous',null,button)}

function init(){
  core.emit('media:ready',{version:VERSION});
}

window.OLEN.media=Object.freeze({
  version:VERSION,
  init,
  sessionId,
  status,
  connected,
  auth,
  remote,
  play,
  pause,
  next,
  previous,
  openPlaylist,
  ensurePlaylist,
  createPlaylist,
  latestPlaylist,
  latestPlaylistSpec,
  savePending,
  loadPending
});
})();
