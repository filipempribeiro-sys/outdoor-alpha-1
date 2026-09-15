/* OLEN 5.0 · LIVE
   Consolidated owner prepared from the current 5/5 LIVE/activity behaviour.
   IMPORTANT: intentionally NOT loaded by index.html or sw.js yet.
   Existing reports, GPS tracking and activity engine remain untouched until explicit cutover.
*/
(()=>{
'use strict';
const core=window.OLEN?.core;
if(!core||window.OLEN?.live?.version==='5.0.0')return;
const VERSION='5.0.0';
const state={tracking:false,activity:false,position:null,seconds:0,distance:0,heartRate:null,wearable:false};
function call(name,...args){return typeof window[name]==='function'?core.safe(()=>window[name](...args)):undefined}
function syncFromLegacy(){
  if(window.pos)state.position=window.pos;
  if(typeof window.watchId!=='undefined')state.tracking=window.watchId!==null;
  if(typeof window.activityRunning==='boolean')state.activity=window.activityRunning;
  if(Number.isFinite(window.activitySeconds))state.seconds=window.activitySeconds;
  if(Number.isFinite(window.activityDistance))state.distance=window.activityDistance;
  if(Number.isFinite(window.heartRate))state.heartRate=window.heartRate;
  if(typeof window.wearableConnected==='boolean')state.wearable=window.wearableConnected;
  core.emit('live:state',{...state});
  return {...state};
}
function requestLocation(){call('requestLocation');core.emit('live:gps-request')}
function startTracking(){
  syncFromLegacy();
  if(!state.tracking)call('toggleWatch');
  state.tracking=true;core.emit('live:tracking',{active:true});
}
function stopTracking(){
  syncFromLegacy();
  if(state.tracking)call('toggleWatch');
  state.tracking=false;core.emit('live:tracking',{active:false});
}
function startActivity(){
  syncFromLegacy();
  if(!state.activity)call('toggleActivity');
  state.activity=true;core.emit('live:activity',{active:true});
}
function stopActivity(){
  syncFromLegacy();
  if(state.activity)call('stopActivity');
  state.activity=false;syncFromLegacy();core.emit('live:activity',{active:false});
}
function toggleActivity(){syncFromLegacy();return state.activity?stopActivity():startActivity()}
function toggleWearable(){call('toggleWearable');syncFromLegacy();core.emit('live:wearable',{active:state.wearable,heartRate:state.heartRate})}
function saveReport(){call('saveReport');core.emit('live:reports-changed')}
function validateReport(id,action){call('startReportValidation',id,action)}
function deleteReport(id){call('deleteReport',id);core.emit('live:reports-changed')}
function refreshReports(){call('renderReports');call('renderMapReports');call('checkNearest')}
function currentActivity(){
  if(typeof window.currentActivity==='function')return call('currentActivity');
  return {seconds:state.seconds,distance:state.distance,heartRate:state.heartRate,wearable:state.wearable};
}
function formatDuration(seconds){
  if(typeof window.formatDuration==='function')return call('formatDuration',seconds);
  const sec=Math.max(0,Number(seconds)||0),h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=Math.floor(sec%60);
  return h?String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'):String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
function open(){if(typeof window.go==='function')call('go','report');core.emit('live:open')}
function init(){syncFromLegacy();core.on('map:state',e=>{if(e.detail?.position){state.position=e.detail.position;core.emit('live:position',{position:state.position})}})}
window.OLEN.live=Object.freeze({version:VERSION,init,sync:syncFromLegacy,open,requestLocation,startTracking,stopTracking,startActivity,stopActivity,toggleActivity,toggleWearable,saveReport,validateReport,deleteReport,refreshReports,currentActivity,formatDuration,get state(){return {...state}}});
})();
