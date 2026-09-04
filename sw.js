const CACHE_NAME="project-alpha-v1.4.21-explore-multi-filter-fix";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{let cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put("./index.html",cp));return r}).catch(()=>caches.match("./index.html")));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>{let cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
  }
});