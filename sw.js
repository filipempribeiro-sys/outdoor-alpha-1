const CACHE='alpha1-mobile-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{if(e.request.method==='GET'&&new URL(e.request.url).origin===location.origin){let copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return resp}).catch(()=>caches.match('./index.html')))));
