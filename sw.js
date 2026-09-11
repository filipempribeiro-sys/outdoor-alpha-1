const CACHE_NAME="project-alpha-v4.3.31-final";

const PREFLIGHT431_URL="./alpha-4.3.31-preflight.js?v=4.3.31-final";
const BASE_PATCH_URL="./alpha-4.3.17-fixes.js?v=4.3.31-final";
const SPOTIFY_PATCH_URL="./alpha-4.3.22-spotify-global.js?v=4.3.31-final";
const CHAT_SHELL_URL="./alpha-4.3.30-chat-shell.js?v=4.3.31-final";
const LONGPRESS_URL="./alpha-4.3.30-chat-longpress.js?v=4.3.31-final";
const DATA6_URL="./alpha-4.3.30-olen-data-hotfix6.js?v=4.3.31-final";
const SIDEBAR10_URL="./alpha-4.3.30-sidebar-functional-hotfix10.js?v=4.3.31-final";
const SEARCH11_URL="./alpha-4.3.30-sidebar-search-hotfix11.js?v=4.3.31-final";
const PLACEHOLDER12_URL="./alpha-4.3.30-olen-placeholder-hotfix12.js?v=4.3.31-final";
const PLAN13_URL="./alpha-4.3.30-olen-plan-builder-hotfix13.js?v=4.3.31-final";
const COMPANION14_URL="./alpha-4.3.30-olen-companion-hotfix14.js?v=4.3.31-final";
const PLACE431_URL="./alpha-4.3.31-place-experience.js?v=4.3.31-final";
const CALENDAR431_URL="./alpha-4.3.31-calendar-google.js?v=4.3.31-final";
const TIMEPICKER431_URL="./alpha-4.3.31-calendar-timepicker.js?v=4.3.31-final";
const OLENCALENDAR431_URL="./alpha-4.3.31-olen-calendar.js?v=4.3.31-final";
const PLACEDETAIL431_URL="./alpha-4.3.31-place-detail-cleanup.js?v=4.3.31-final";
const PLANSHARE431_URL="./alpha-4.3.31-plan-share.js?v=4.3.31-final";
const SIDEBARBASE431_URL="./alpha-4.3.31-sidebar-base.js?v=4.3.31-final";
const MEDIABRIDGE431_URL="./alpha-4.3.31-media-bridge.js?v=4.3.31-final";
const FINALCORE431_URL="./alpha-4.3.31-final-core.js?v=4.3.31-final";

const PATCHES=[
  "alpha-4.3.31-preflight.js",
  "alpha-4.3.17-fixes.js",
  "alpha-4.3.22-spotify-global.js",
  "alpha-4.3.30-chat-shell.js",
  "alpha-4.3.30-chat-longpress.js",
  "alpha-4.3.30-olen-data-hotfix6.js",
  "alpha-4.3.30-sidebar-functional-hotfix10.js",
  "alpha-4.3.30-sidebar-search-hotfix11.js",
  "alpha-4.3.30-olen-placeholder-hotfix12.js",
  "alpha-4.3.30-olen-plan-builder-hotfix13.js",
  "alpha-4.3.30-olen-companion-hotfix14.js",
  "alpha-4.3.31-place-experience.js",
  "alpha-4.3.31-calendar-google.js",
  "alpha-4.3.31-calendar-timepicker.js",
  "alpha-4.3.31-olen-calendar.js",
  "alpha-4.3.31-place-detail-cleanup.js",
  "alpha-4.3.31-plan-share.js",
  "alpha-4.3.31-sidebar-base.js",
  "alpha-4.3.31-media-bridge.js",
  "alpha-4.3.31-final-core.js"
];
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png",...PATCHES.map(x=>"./"+x)];

self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL).catch(()=>{})));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

function rewrittenScriptResponse(response,kind){
  if(!response||!response.ok)return response;
  return response.text().then(js=>{
    if(kind==='base')js=js.replace("const VERSION='4.3.18';","const VERSION='4.3.31';");
    if(kind==='spotify')js=js.replace(/4\.3\.28/g,'4.3.31');
    const h=new Headers(response.headers);h.delete('content-length');h.set('Cache-Control','no-store');
    return new Response(js,{status:response.status,statusText:response.statusText,headers:h});
  });
}

function with4331Final(response){
  if(!response||!response.ok)return response;
  const type=String(response.headers.get("content-type")||"").toLowerCase();
  if(!type.includes("text/html"))return response;
  return response.text().then(html=>{
    const urls=[
      PREFLIGHT431_URL,BASE_PATCH_URL,SPOTIFY_PATCH_URL,CHAT_SHELL_URL,LONGPRESS_URL,DATA6_URL,
      SIDEBAR10_URL,SEARCH11_URL,PLACEHOLDER12_URL,PLAN13_URL,COMPANION14_URL,PLACE431_URL,
      CALENDAR431_URL,TIMEPICKER431_URL,OLENCALENDAR431_URL,PLACEDETAIL431_URL,PLANSHARE431_URL,
      SIDEBARBASE431_URL,MEDIABRIDGE431_URL,FINALCORE431_URL
    ];
    const tags=urls.map(u=>'<script src="'+u+'"><\/script>').join('');
    html=html
      .replace(/<script src="\.\/alpha-4\.3\.(?:17-fixes|19-chat-spotify|22-spotify-global|30-[^"]+|31-[^"]+)\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<style id="alphaSpotifyExactAlign4329">[\s\S]*?<\/style>/g,'');
    const alignStyle='<style id="alphaSpotifyExactAlign4329">body:not([data-alpha-view="home"]):not(.alphaChatMode):not(.alphaComposeMode) #alphaGlobalSpotify4324{top:calc(env(safe-area-inset-top) + 10px)!important;right:14px!important;width:50px!important;height:50px!important;min-width:50px!important;min-height:50px!important}@media(max-width:620px){body:not([data-alpha-view="home"]):not(.alphaChatMode):not(.alphaComposeMode) #alphaGlobalSpotify4324{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important}}</style>';
    html=html.includes('</body>')?html.replace('</body>',alignStyle+tags+'</body>'):html+alignStyle+tags;
    html=html
      .replace(/<meta name="alpha-version" content="[^"]*">/,'<meta name="alpha-version" content="4.3.31">')
      .replace(/<title>Project Alpha [^<]*<\/title>/,'<title>Project Alpha 4.3.31 — OLEN Companion</title>')
      .replace(/const APP_VERSION='4\.3\.16'/g,"const APP_VERSION='4.3.31'")
      .replace(/const ALPHA_VISIBLE_VERSION='v4\.3\.16'/g,"const ALPHA_VISIBLE_VERSION='v4.3.31'")
      .replace(/window\.ALPHA_DOMAIN_GATE_BUILD='4\.3\.16-full-system-hardening'/g,"window.ALPHA_DOMAIN_GATE_BUILD='4.3.31-final'")
      .replace(/A iniciar a ALPHA 4\.3\.18…/g,'A iniciar a ALPHA 4.3.31…')
      .replace(/A iniciar a ALPHA 4\.3\.18\.\.\./g,'A iniciar a ALPHA 4.3.31…');
    const h=new Headers(response.headers);h.delete('content-length');h.set('Cache-Control','no-store');h.set('X-Alpha-Patch','4.3.31-final');
    return new Response(html,{status:response.status,statusText:response.statusText,headers:h});
  });
}

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'})
      .then(r=>with4331Final(r))
      .then(r=>{const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put('./index.html',cp)).catch(()=>{});return r})
      .catch(async()=>{const cached=await caches.match('./index.html');return cached?with4331Final(cached):cached}));
    return;
  }
  if(u.origin===location.origin&&u.pathname.endsWith('/alpha-4.3.17-fixes.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>rewrittenScriptResponse(r,'base')).catch(()=>caches.match(e.request)));return;
  }
  if(u.origin===location.origin&&u.pathname.endsWith('/alpha-4.3.22-spotify-global.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>rewrittenScriptResponse(r,'spotify')).catch(()=>caches.match(e.request)));return;
  }
  if(u.origin===location.origin)e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match(e.request)));
});
