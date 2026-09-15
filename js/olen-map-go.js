/* OLEN 5.0 · MAP / GO
   Consolidated owner prepared from the current 5/5 map/navigation behaviour.
   IMPORTANT: intentionally NOT loaded by index.html or sw.js yet.
   Existing map engine and route data remain untouched until explicit cutover.
*/
(()=>{
'use strict';
const core=window.OLEN?.core;
if(!core||window.OLEN?.mapGo?.version==='5.0.0')return;
const VERSION='5.0.0';
const MODES={walk:{label:'A pé',zoom:17,pitch:48,vehicle:'arrow'},bike:{label:'Bicicleta',zoom:16.5,pitch:50,vehicle:'bike'},scooter:{label:'Trotineta',zoom:16.5,pitch:50,vehicle:'scooter'},moto:{label:'Moto',zoom:16.2,pitch:54,vehicle:'moto'},car:{label:'Carro',zoom:16,pitch:55,vehicle:'car-red'}};
const state={mode:'walk',active:false,follow:true,route:null,position:null,remote:false};
function call(name,...args){return typeof window[name]==='function'?core.safe(()=>window[name](...args)):undefined}
function modeMeta(mode=state.mode){return MODES[mode]||MODES.walk}
function syncFromLegacy(){
  if(typeof window.navigationMode==='string'&&MODES[window.navigationMode])state.mode=window.navigationMode;
  if(typeof window.liveNavActive==='boolean')state.active=window.liveNavActive;
  if(typeof window.navFollow==='boolean')state.follow=window.navFollow;
  if(window.exploreRouteGeoJSON)state.route=window.exploreRouteGeoJSON;
  if(window.pos)state.position=window.pos;
  core.emit('map:state',{...state});
  return {...state};
}
function setMode(mode){
  if(!MODES[mode])return false;
  state.mode=mode;
  if(typeof window.setNavigationMode==='function')call('setNavigationMode',mode,null);
  else{
    const label=core.byId('navModeLabel');if(label)label.textContent=modeMeta(mode).label;
    core.qsa('.navMode').forEach(el=>el.classList.toggle('active',el.dataset.mode===mode));
  }
  core.emit('map:mode',{mode,meta:modeMeta(mode)});
  return true;
}
function cycleMode(){const modes=Object.keys(MODES),i=modes.indexOf(state.mode);return setMode(modes[(i+1)%modes.length])}
function startNavigation(){
  if(typeof window.toggleLiveNavigation==='function'&&!state.active)call('toggleLiveNavigation');
  state.active=true;syncFromLegacy();core.emit('map:navigation',{active:true});
}
function stopNavigation(){
  if(typeof window.toggleLiveNavigation==='function'&&state.active)call('toggleLiveNavigation');
  state.active=false;core.emit('map:navigation',{active:false});
}
function follow(on=true){state.follow=!!on;if(on)call('followCurrentPosition');core.emit('map:follow',{follow:state.follow})}
function showRoute(){if(typeof window.showExploreAIRouteOnMap==='function')call('showExploreAIRouteOnMap');else call('renderExploreRoute');syncFromLegacy()}
function fitRoute(){call('fitActiveRoute',false)}
function resize(){const map=window.map;if(map?.resize)core.safe(()=>map.resize());call('updateNavigationOverlay')}
function restore(){call('restoreActiveRoute');syncFromLegacy();core.raf2(resize)}
function setRemote(active){state.remote=!!active;document.body?.classList.toggle('olenRemoteActive500',state.remote);core.emit('map:remote',{active:state.remote})}
function navigatePlace(id){if(typeof window.navigateExplorePlace==='function')call('navigateExplorePlace',id)}
function init(){
  syncFromLegacy();
  core.listen(window,'pageshow',restore,{passive:true});
  core.listen(window,'orientationchange',()=>core.later(resize,140),{passive:true});
  core.listen(window,'resize',()=>core.later(resize,120),{passive:true});
  core.on('remote:state',e=>setRemote(!!e.detail?.active));
  core.later(restore,120);
}
window.OLEN.mapGo=Object.freeze({version:VERSION,init,sync:syncFromLegacy,setMode,cycleMode,startNavigation,stopNavigation,follow,showRoute,fitRoute,resize,restore,setRemote,navigatePlace,get state(){return {...state}},MODES:Object.freeze(MODES)});
})();
