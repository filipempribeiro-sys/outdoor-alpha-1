const CACHE_NAME="olen-v4.4.0-splash2";
const BASE_PATCH_URL="./alpha-4.3.17-fixes.js?v=4.3.43";
const SPOTIFY_PATCH_URL="./alpha-4.3.22-spotify-global.js?v=4.3.43";
const CALENDAR_GOOGLE_URL="./alpha-4.3.30-calendar-google.js?v=4.3.43";
const CALENDAR_TIME_URL="./alpha-4.3.30-calendar-timepicker.js?v=4.3.43";
const PLACE_EXPERIENCE_URL="./alpha-4.3.30-place-experience.js?v=4.3.43";
const PLACE_CLEANUP_URL="./alpha-4.3.30-place-detail-cleanup.js?v=4.3.43";
const CHAT_SIDEBAR_URL="./alpha-4.3.30-chat-sidebar-stage3.js?v=4.3.43";
const CHAT_SIDEBAR_FIX_URL="./alpha-4.3.30-chat-sidebar-stage3-fix2.js?v=4.3.43";
const CHAT_FOOTER_ICONS_URL="./alpha-4.3.32-chat-footer-icons-only.js?v=4.3.43";
const HOME_BUTTONS_ONLY_URL="./alpha-4.3.33-home-buttons-only.js?v=4.3.43";
const CHAT_FOOTER_IMMEDIATE_URL="./alpha-4.3.34-chat-footer-immediate.js?v=4.3.43";
const CHAT_SIDEBAR_FULL_SCROLL_URL="./alpha-4.3.35-sidebar-full-scroll.js?v=4.3.43";
const CHAT_SIDEBAR_FIXED_ENDS_URL="./alpha-4.3.36-sidebar-fixed-header-footer.js?v=4.3.43";
const CHAT_FOOTER_ICONS_LOCK_URL="./alpha-4.3.37-sidebar-footer-icons-lock.js?v=4.3.43";
const HOME_NO_SPOTIFY_URL="./alpha-4.3.38-home-no-spotify-footer.js?v=4.3.43";
const HOME_FOOTER_SIX_GRID_URL="./alpha-4.3.39-home-footer-six-grid.js?v=4.3.43";
const INTERNAL_SIDEBAR_NO_SPOTIFY_URL="./alpha-4.3.40-internal-sidebar-no-spotify.js?v=4.4.0";
const OLEN_IDENTITY_URL="./olen-4.4.0-identity.js?v=4.4.0";
const SPLASH_POLISH_URL="./olen-4.4.0-splash-polish.js?v=4.4.0-splash2";
const HOME_UX_POLISH_URL="./alpha-4.3.43-home-ux-polish.js?v=4.4.0";

const SHELL=[
  "./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png",
  "./assets/olen-ui.jpg","./assets/olen-splash.jpg","./assets/olen-ui.png","./assets/olen-splash.png",
  "./olen-4.4.0-identity.js","./olen-4.4.0-splash-polish.js",
  "./alpha-4.3.17-fixes.js","./alpha-4.3.22-spotify-global.js",
  "./alpha-4.3.30-calendar-google.js","./alpha-4.3.30-calendar-timepicker.js",
  "./alpha-4.3.30-place-experience.js","./alpha-4.3.30-place-detail-cleanup.js",
  "./alpha-4.3.30-chat-sidebar-stage3.js","./alpha-4.3.30-chat-sidebar-stage3-fix2.js",
  "./alpha-4.3.32-chat-footer-icons-only.js","./alpha-4.3.33-home-buttons-only.js",
  "./alpha-4.3.34-chat-footer-immediate.js","./alpha-4.3.35-sidebar-full-scroll.js",
  "./alpha-4.3.36-sidebar-fixed-header-footer.js","./alpha-4.3.37-sidebar-footer-icons-lock.js",
  "./alpha-4.3.38-home-no-spotify-footer.js","./alpha-4.3.39-home-footer-six-grid.js",
  "./alpha-4.3.40-internal-sidebar-no-spotify.js","./alpha-4.3.43-home-ux-polish.js"
];

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

function rewrittenScriptResponse(response,kind){
  if(!response||!response.ok)return response;
  return response.text().then(js=>{
    if(kind==='base')js=js.replace("const VERSION='4.3.18';","const VERSION='4.3.43';");
    if(kind==='spotify')js=js.replace(/4\.3\.28/g,'4.3.43');
    const headers=new Headers(response.headers);
    headers.delete('content-length');
    headers.set('Cache-Control','no-store');
    return new Response(js,{status:response.status,statusText:response.statusText,headers});
  });
}

function with440Patch(response){
  if(!response||!response.ok)return response;
  const type=String(response.headers.get("content-type")||"").toLowerCase();
  if(!type.includes("text/html"))return response;
  return response.text().then(html=>{
    const tags=[
      BASE_PATCH_URL,SPOTIFY_PATCH_URL,CALENDAR_GOOGLE_URL,CALENDAR_TIME_URL,
      PLACE_EXPERIENCE_URL,PLACE_CLEANUP_URL,CHAT_SIDEBAR_URL,CHAT_SIDEBAR_FIX_URL,
      CHAT_FOOTER_ICONS_URL,HOME_BUTTONS_ONLY_URL,CHAT_FOOTER_IMMEDIATE_URL,
      CHAT_SIDEBAR_FULL_SCROLL_URL,CHAT_SIDEBAR_FIXED_ENDS_URL,CHAT_FOOTER_ICONS_LOCK_URL,
      HOME_NO_SPOTIFY_URL,HOME_FOOTER_SIX_GRID_URL,INTERNAL_SIDEBAR_NO_SPOTIFY_URL,
      OLEN_IDENTITY_URL,SPLASH_POLISH_URL,HOME_UX_POLISH_URL
    ].map(u=>'<script src="'+u+'"><\/script>').join('');

    const alignStyle='<style id="alphaSpotifyExactAlign4329">body:not([data-alpha-view="home"]):not(.alphaChatMode):not(.alphaComposeMode) #alphaGlobalSpotify4324{top:calc(env(safe-area-inset-top) + 10px)!important;right:14px!important;width:50px!important;height:50px!important;min-width:50px!important;min-height:50px!important}@media(max-width:620px){body:not([data-alpha-view="home"]):not(.alphaChatMode):not(.alphaComposeMode) #alphaGlobalSpotify4324{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important}}</style>';

    html=html
      .replace(/<script src="\.\/alpha-4\.3\.17-fixes\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.19-chat-spotify\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.22-spotify-global\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.30-(?:calendar-google|calendar-timepicker|place-experience|place-detail-cleanup|media-bridge|chat-sidebar-stage3|chat-sidebar-polish|chat-sidebar-stage3-fix2)\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.32-chat-footer-icons-only\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.33-home-buttons-only\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.34-chat-footer-immediate\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.35-sidebar-full-scroll\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.36-sidebar-fixed-header-footer\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.37-sidebar-footer-icons-lock\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.38-home-no-spotify-footer\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.39-home-footer-six-grid\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.40-internal-sidebar-no-spotify\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.41-internal-sidebar-cleanup\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/alpha-4\.3\.43-home-ux-polish\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/olen-4\.4\.0-identity\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<script src="\.\/olen-4\.4\.0-splash-polish\.js\?v=[^"]+"><\/script>/g,'')
      .replace(/<style id="alphaSpotifyExactAlign4329">[\s\S]*?<\/style>/g,'');

    const allTags=alignStyle+tags;
    html=html.includes("</body>")?html.replace("</body>",allTags+"</body>"):html+allTags;

    html=html
      .replace(/<meta name="alpha-version" content="[^"]*">/,'<meta name="alpha-version" content="4.4.0">')
      .replace(/<title>Project Alpha [^<]*<\/title>/,'<title>OLEN 4.4.0 — Outdoor Lifestyle Experience</title>')
      .replace(/const APP_VERSION='4\.3\.16'/g,"const APP_VERSION='4.3.43'")
      .replace(/const ALPHA_VISIBLE_VERSION='v4\.3\.16'/g,"const ALPHA_VISIBLE_VERSION='v4.3.43'")
      .replace(/window\.ALPHA_DOMAIN_GATE_BUILD='4\.3\.16-full-system-hardening'/g,"window.ALPHA_DOMAIN_GATE_BUILD='4.3.43'")
      .replace(/A iniciar a ALPHA(?:\s*4\.3\.(?:18|43))?(?:…|\.\.\.)/g,'A iniciar a OLEN…')
      .replace(/PROJECT\s+ALPHA/g,'OLEN')
      .replace(/\bALPHA\b/g,'OLEN')
      .replace(/\bAlpha\b/g,'OLEN');

    const headers=new Headers(response.headers);
    headers.delete("content-length");
    headers.set("Cache-Control","no-store");
    headers.set("X-OLEN-Patch","4.4.0-splash2");
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  });
}

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);

  if(e.request.mode==="navigate"){
    e.respondWith(
      fetch(e.request,{cache:"no-store"})
        .then(r=>with440Patch(r))
        .then(r=>{const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put("./index.html",cp)).catch(()=>{});return r})
        .catch(async()=>{const cached=await caches.match("./index.html");return cached?with440Patch(cached):cached})
    );
    return;
  }

  if(u.origin===location.origin&&u.pathname.endsWith('/alpha-4.3.17-fixes.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>rewrittenScriptResponse(r,'base')).catch(()=>caches.match(e.request)));
    return;
  }
  if(u.origin===location.origin&&u.pathname.endsWith('/alpha-4.3.22-spotify-global.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>rewrittenScriptResponse(r,'spotify')).catch(()=>caches.match(e.request)));
    return;
  }

  if(u.origin===location.origin){
    e.respondWith(
      fetch(e.request,{cache:"no-store"})
        .then(r=>{const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cp)).catch(()=>{});return r})
        .catch(()=>caches.match(e.request))
    );
  }
});
