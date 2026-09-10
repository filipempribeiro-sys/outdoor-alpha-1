const CACHE_NAME="project-alpha-v4.3.17-field-fix-pack";
const PATCH_URL="./alpha-4.3.17-fixes.js?v=4.3.17";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./alpha-4.3.17-fixes.js"];

self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL).catch(()=>{})));
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

function with4317Patch(response){
  if(!response||!response.ok)return response;
  const type=String(response.headers.get("content-type")||"").toLowerCase();
  if(!type.includes("text/html"))return response;
  return response.text().then(html=>{
    if(!html.includes("alpha-4.3.17-fixes.js")){
      const tag='<script src="'+PATCH_URL+'"><\/script>';
      html=html.includes("</body>")?html.replace("</body>",tag+"</body>"):html+tag;
    }
    const headers=new Headers(response.headers);
    headers.delete("content-length");
    headers.set("Cache-Control","no-store");
    headers.set("X-Alpha-Patch","4.3.17");
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  });
}

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);

  if(e.request.mode==="navigate"){
    e.respondWith(
      fetch(e.request,{cache:"no-store"})
        .then(r=>with4317Patch(r))
        .then(r=>{
          const cp=r.clone();
          caches.open(CACHE_NAME).then(c=>c.put("./index.html",cp)).catch(()=>{});
          return r;
        })
        .catch(async()=>{
          const cached=await caches.match("./index.html");
          return cached?with4317Patch(cached):cached;
        })
    );
    return;
  }

  if(u.origin===location.origin){
    e.respondWith(
      fetch(e.request,{cache:"no-store"})
        .then(r=>{
          const cp=r.clone();
          caches.open(CACHE_NAME).then(c=>c.put(e.request,cp)).catch(()=>{});
          return r;
        })
        .catch(()=>caches.match(e.request))
    );
  }
});
