const CACHE_NAME="project-alpha-v4.3.18-spotify-remote-layout";
const PATCH_URL="./alpha-4.3.17-fixes.js?v=4.3.18-remote-layout";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./alpha-4.3.17-fixes.js"];

self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL).catch(()=>{})));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
function with4318Patch(response){
  if(!response||!response.ok)return response;
  const type=String(response.headers.get("content-type")||"").toLowerCase();
  if(!type.includes("text/html"))return response;
  return response.text().then(html=>{
    const tag='<script src="'+PATCH_URL+'"><\/script>';
    if(!html.includes(PATCH_URL)){
      html=html.replace(/<script src="\.\/alpha-4\.3\.17-fixes\.js\?v=[^"]+"><\/script>/g,'');
      html=html.includes("</body>")?html.replace("</body>",tag+"</body>"):html+tag;
    }
    html=html.replace(/<meta name="alpha-version" content="[^"]*">/,'<meta name="alpha-version" content="4.3.18">');
    html=html.replace(/<title>Project Alpha [^<]*<\/title>/,'<title>Project Alpha 4.3.18 — Route Resume</title>');
    html=html.replace(/const APP_VERSION='4\.3\.16'/g,"const APP_VERSION='4.3.18'");
    html=html.replace(/const ALPHA_VISIBLE_VERSION='v4\.3\.16'/g,"const ALPHA_VISIBLE_VERSION='v4.3.18'");
    html=html.replace(/window\.ALPHA_DOMAIN_GATE_BUILD='4\.3\.16-full-system-hardening'/g,"window.ALPHA_DOMAIN_GATE_BUILD='4.3.18-route-resume'");
    const headers=new Headers(response.headers);headers.delete("content-length");headers.set("Cache-Control","no-store");headers.set("X-Alpha-Patch","4.3.18-remote-layout");
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  });
}
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;const u=new URL(e.request.url);
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>with4318Patch(r)).then(r=>{const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put("./index.html",cp)).catch(()=>{});return r}).catch(async()=>{const cached=await caches.match("./index.html");return cached?with4318Patch(cached):cached}));return;
  }
  if(u.origin===location.origin)e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match(e.request)));
});
