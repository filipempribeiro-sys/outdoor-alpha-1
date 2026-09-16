/* =========================================================
   OLEN 5.0 — EXPERIENCE ENGINE FOUNDATION
   =========================================================
   Authority for persistent Experience state shared by
   CHAT · MAPA · GO · LIVE.

   Design rules:
   - An Experience is structured data and does not depend on AI.
   - UI modules consume the same Experience instead of rebuilding it.
   - Updates are explicit, immutable at the public boundary and observable.
   - No network/provider/research calls live in this module.
   - No legacy runtime is modified by loading this file alone.
   ========================================================= */
(function experienceEngineModule(global){
  'use strict';

  const root=global.OLEN5=global.OLEN5||{};
  if(root.experienceEngine)return;

  const VERSION='0.1.0';
  const LIFECYCLE=Object.freeze([
    'IDEA',
    'PLANNING',
    'READY',
    'ACTIVE',
    'COMPLETED',
    'ARCHIVED'
  ]);

  const listeners=new Set();
  const experiences=new Map();
  let activeExperienceId='';

  function clone(value){
    if(value===undefined)return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function nowIso(){
    return new Date().toISOString();
  }

  function cleanString(value){
    return typeof value==='string'?value.trim():'';
  }

  function cleanArray(value){
    return Array.isArray(value)?clone(value):[];
  }

  function cleanObject(value){
    return value&&typeof value==='object'&&!Array.isArray(value)?clone(value):{};
  }

  function makeId(){
    if(global.crypto&&typeof global.crypto.randomUUID==='function'){
      return 'exp_'+global.crypto.randomUUID();
    }
    return 'exp_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
  }

  function normalizeLifecycle(value,fallback='IDEA'){
    const candidate=cleanString(value).toUpperCase();
    return LIFECYCLE.includes(candidate)?candidate:fallback;
  }

  function baseExperience(input={}){
    const createdAt=cleanString(input.createdAt)||nowIso();
    const lifecycle=normalizeLifecycle(input.lifecycle,'IDEA');

    return {
      schemaVersion:1,
      id:cleanString(input.id)||makeId(),
      lifecycle,
      title:cleanString(input.title),
      intent:cleanObject(input.intent),
      time:cleanObject(input.time),
      mobility:{
        habitual:cleanArray(input.mobility?.habitual),
        contextual:cleanArray(input.mobility?.contextual),
        exceptional:cleanArray(input.mobility?.exceptional),
        segments:cleanArray(input.mobility?.segments)
      },
      route:cleanObject(input.route),
      places:cleanArray(input.places),
      participants:cleanArray(input.participants),
      plan:cleanObject(input.plan),
      research:{
        profile:cleanString(input.research?.profile)||'LIGHT',
        facts:cleanArray(input.research?.facts),
        missing:cleanArray(input.research?.missing),
        updatedAt:cleanString(input.research?.updatedAt)
      },
      map:cleanObject(input.map),
      go:cleanObject(input.go),
      live:cleanObject(input.live),
      integrations:cleanObject(input.integrations),
      context:cleanObject(input.context),
      decisions:cleanArray(input.decisions),
      rejected:cleanArray(input.rejected),
      createdAt,
      updatedAt:cleanString(input.updatedAt)||createdAt
    };
  }

  function assertExperience(value){
    if(!value||typeof value!=='object')throw new TypeError('Experience inválida.');
    if(!cleanString(value.id))throw new TypeError('Experience sem id.');
    if(!LIFECYCLE.includes(value.lifecycle))throw new TypeError('Lifecycle inválido.');
    return value;
  }

  function emit(type,experience,meta={}){
    const event=Object.freeze({
      type,
      experience:experience?clone(experience):null,
      activeExperienceId,
      meta:clone(meta),
      at:nowIso()
    });
    listeners.forEach(listener=>{
      try{listener(event)}catch(error){
        console.error('OLEN Experience listener error',error);
      }
    });
  }

  function create(input={},options={}){
    const experience=assertExperience(baseExperience(input));
    if(experiences.has(experience.id))throw new Error('Experience já existe: '+experience.id);
    experiences.set(experience.id,experience);

    if(options.activate!==false){
      activeExperienceId=experience.id;
    }

    emit('experience:created',experience,{activated:activeExperienceId===experience.id});
    return clone(experience);
  }

  function get(id){
    const key=cleanString(id)||activeExperienceId;
    return key&&experiences.has(key)?clone(experiences.get(key)):null;
  }

  function getActive(){
    return get(activeExperienceId);
  }

  function list(){
    return Array.from(experiences.values())
      .map(clone)
      .sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  function update(id,patch={},meta={}){
    const key=cleanString(id)||activeExperienceId;
    if(!key||!experiences.has(key))throw new Error('Experience não encontrada.');
    if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new TypeError('Patch inválido.');

    const current=experiences.get(key);
    const next=baseExperience({
      ...current,
      ...clone(patch),
      id:current.id,
      createdAt:current.createdAt,
      lifecycle:patch.lifecycle===undefined?current.lifecycle:normalizeLifecycle(patch.lifecycle,current.lifecycle),
      mobility:patch.mobility===undefined?current.mobility:{...current.mobility,...cleanObject(patch.mobility)},
      research:patch.research===undefined?current.research:{...current.research,...cleanObject(patch.research)},
      updatedAt:nowIso()
    });

    experiences.set(key,assertExperience(next));
    emit('experience:updated',next,meta);
    return clone(next);
  }

  function transition(id,nextLifecycle,meta={}){
    const target=normalizeLifecycle(nextLifecycle,'');
    if(!target)throw new Error('Lifecycle inválido: '+nextLifecycle);
    const current=get(id);
    if(!current)throw new Error('Experience não encontrada.');
    if(current.lifecycle===target)return current;
    return update(current.id,{lifecycle:target},{...meta,from:current.lifecycle,to:target});
  }

  function activate(id,meta={}){
    const key=cleanString(id);
    if(!key||!experiences.has(key))throw new Error('Experience não encontrada.');
    activeExperienceId=key;
    const experience=experiences.get(key);
    emit('experience:activated',experience,meta);
    return clone(experience);
  }

  function clearActive(meta={}){
    const previous=getActive();
    activeExperienceId='';
    emit('experience:deactivated',previous,meta);
    return previous;
  }

  function remove(id,meta={}){
    const key=cleanString(id);
    if(!key||!experiences.has(key))return false;
    const previous=experiences.get(key);
    experiences.delete(key);
    if(activeExperienceId===key)activeExperienceId='';
    emit('experience:removed',previous,meta);
    return true;
  }

  function importExperience(raw,{activate:shouldActivate=false,replace=false}={}){
    const experience=assertExperience(baseExperience(raw));
    if(experiences.has(experience.id)&&!replace){
      throw new Error('Experience já existe: '+experience.id);
    }
    experiences.set(experience.id,experience);
    if(shouldActivate)activeExperienceId=experience.id;
    emit('experience:imported',experience,{activated:shouldActivate,replace});
    return clone(experience);
  }

  function exportExperience(id){
    return get(id);
  }

  function subscribe(listener){
    if(typeof listener!=='function')throw new TypeError('Listener inválido.');
    listeners.add(listener);
    return ()=>listeners.delete(listener);
  }

  root.experienceEngine=Object.freeze({
    version:VERSION,
    lifecycle:LIFECYCLE,
    create,
    get,
    getActive,
    list,
    update,
    transition,
    activate,
    clearActive,
    remove,
    importExperience,
    exportExperience,
    subscribe
  });
})(window);
