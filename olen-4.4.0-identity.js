/* OLEN 4.4.0 · VISIBLE IDENTITY LAYER
   Public branding only. Technical ALPHA internals stay untouched. */
(()=>{
'use strict';
if(window.__olenIdentity440)return;
window.__olenIdentity440=true;

const UI_LOGO='assets/olen-ui.png';
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();

const style=document.createElement('style');
style.id='olenIdentity440';
style.textContent=`
.olen440-ui-logo{
  background:url('${UI_LOGO}') center/contain no-repeat!important;
  color:transparent!important;
  text-shadow:none!important;
  border:0!important;
  outline:0!important;
  border-radius:0!important;
  box-shadow:none!important;
  padding:0!important;
  overflow:visible!important;
}
.olen440-ui-logo::before,.olen440-ui-logo::after{display:none!important;content:none!important}

/* HOME: direct PNG, exactly like the working Chat sidebar approach */
.top .brand{gap:0!important}
.top .brand .logo{
  width:60px!important;
  height:60px!important;
  min-width:60px!important;
  flex:0 0 60px!important;
  background:none!important;
  border:0!important;
  outline:0!important;
  border-radius:0!important;
  box-shadow:none!important;
  padding:0!important;
  overflow:visible!important;
  display:block!important;
}
.top .brand .logo::before,.top .brand .logo::after{display:none!important;content:none!important}
.top .brand .olen440-home-img{
  display:block!important;
  width:60px!important;
  height:60px!important;
  min-width:60px!important;
  object-fit:contain!important;
  margin:0!important;
  padding:0!important;
  border:0!important;
  outline:0!important;
  box-shadow:none!important;
}
.top .brand>b,.top .brand>strong,.top .brand>div>b,.top .brand>div>strong,.top .brand small{display:none!important}

/* CHAT SIDEBAR HEADER: unchanged */
.alphaChatOlenBrand4330{gap:0!important}
.alphaChatOlenBrand4330 .alphaSidebarLogo.logo,
.alphaChatOlenBrand4330 .olen440-chat-menu-logo{
  width:60px!important;
  height:60px!important;
  min-width:60px!important;
  flex:0 0 60px!important;
  background:url('${UI_LOGO}') center/contain no-repeat!important;
  border:0!important;
  outline:0!important;
  border-radius:0!important;
  box-shadow:none!important;
  padding:0!important;
  overflow:visible!important;
}
.alphaChatOlenBrand4330 .alphaSidebarLogo.logo::before,.alphaChatOlenBrand4330 .alphaSidebarLogo.logo::after{display:none!important;content:none!important}
.alphaChatOlenBrand4330 .olen440-chat-menu-logo svg,.alphaChatOlenBrand4330 .olen440-chat-menu-logo i,.alphaChatOlenBrand4330 .olen440-chat-menu-logo span{display:none!important}
.alphaChatOlenName4330{display:none!important}

/* INTERNAL SIDEBAR HEADER: direct PNG, no legacy container artwork */
#alphaInternalSidebar .alphaInternalBrand{gap:0!important}
#alphaInternalSidebar .alphaInternalBrand .olen440-internal-img{
  display:block!important;
  width:60px!important;
  height:60px!important;
  min-width:60px!important;
  flex:0 0 60px!important;
  object-fit:contain!important;
  margin:0!important;
  padding:0!important;
  border:0!important;
  outline:0!important;
  border-radius:0!important;
  box-shadow:none!important;
}
#alphaInternalSidebar .alphaInternalBrand>b,#alphaInternalSidebar .alphaInternalBrand>strong{display:none!important}

/* auth keeps same artwork without forced frame */
.legacyAuthBrand .logo,.authWelcomeBrand .logo{background:url('${UI_LOGO}') center/contain no-repeat!important;border:0!important;outline:0!important;border-radius:0!important;box-shadow:none!important}
.legacyAuthBrand .logo::before,.legacyAuthBrand .logo::after,.authWelcomeBrand .logo::before,.authWelcomeBrand .logo::after{display:none!important;content:none!important}

@media(max-width:620px){
  .top .brand .logo,.top .brand .olen440-home-img,
  #alphaInternalSidebar .alphaInternalBrand .olen440-internal-img{
    width:60px!important;height:60px!important;min-width:60px!important;
  }
}
`;
document.head.appendChild(style);

function setLeafText(root,re,value){if(!root)return;root.querySelectorAll('*').forEach(el=>{if(el.children.length===0&&re.test(norm(el.textContent)))el.textContent=value})}

function brandHome(){
 const brand=document.querySelector('.top .brand');
 if(brand){
   const host=brand.querySelector('.logo');
   if(host){
     let img=host.querySelector('.olen440-home-img');
     if(!img){
       img=document.createElement('img');
       img.className='olen440-home-img';
       img.src=UI_LOGO;
       img.alt='OLEN';
       img.width=60;
       img.height=60;
       host.replaceChildren(img);
     }
     host.removeAttribute('data-olen-logo');
     host.setAttribute('aria-label','OLEN');
   }
   brand.querySelectorAll('small').forEach(s=>{s.style.display='none'});
   brand.querySelectorAll('b,strong').forEach(el=>{if(/^(?:PROJECT\s+ALPHA|ALPHA|OLEN)$/i.test(norm(el.textContent)))el.style.display='none'});
 }
 document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{const p=el.getAttribute('placeholder')||'';if(/Pergunta à (?:Alpha|OLEN)/i.test(p))el.setAttribute('placeholder','Pergunta à OLEN...')});
 document.querySelectorAll('[aria-label],[title]').forEach(el=>{for(const attr of ['aria-label','title']){const v=el.getAttribute(attr);if(v&&/\bAlpha\b|\bALPHA\b/.test(v))el.setAttribute(attr,v.replace(/PROJECT\s+ALPHA/g,'OLEN').replace(/\bALPHA\b/g,'OLEN').replace(/\bAlpha\b/g,'OLEN'))}});
 document.querySelectorAll('.bottom *').forEach(el=>{if(el.children.length===0&&/^(?:Alpha|OLEN)$/i.test(norm(el.textContent)))el.textContent='OLEN'});
}

function brandChatSidebar(){
 const side=document.querySelector('.alphaChatOlenSidebar4330');if(!side)return;
 const brand=side.querySelector('.alphaChatOlenBrand4330');
 const logo=brand?.querySelector('.alphaSidebarLogo.logo');if(logo)logo.classList.add('olen440-ui-logo');
 const menu=brand?.querySelector('button');if(menu)menu.classList.add('olen440-chat-menu-logo');
 const name=side.querySelector('.alphaChatOlenName4330');if(name){name.textContent='OLEN';name.style.display='none'}
}

function brandInternalSidebar(){
 const side=document.getElementById('alphaInternalSidebar');if(!side)return;
 const brand=side.querySelector('.alphaInternalBrand');
 if(brand){
   let img=brand.querySelector('.olen440-internal-img');
   if(!img){
     img=document.createElement('img');
     img.className='olen440-internal-img';
     img.src=UI_LOGO;
     img.alt='OLEN';
     img.width=60;
     img.height=60;
     brand.replaceChildren(img);
   }
 }
 const first=side.querySelector('.alphaInternalNavList button');if(first)setLeafText(first,/^(?:Alpha|OLEN)$/i,'OLEN');
}

function brandAuth(){document.querySelectorAll('#authGate .logo').forEach(el=>el.classList.add('olen440-ui-logo'))}

function brandSplash(){
 const overlay=document.getElementById('alphaWelcomeOverlay');const inner=overlay?.querySelector('.alphaWelcomeInner');if(!overlay||!inner)return;
 const compass=document.getElementById('alphaWelcomeCompass');const eyebrow=inner.querySelector('.alphaWelcomeEyebrow');
 if(compass)compass.style.display='none';if(eyebrow)eyebrow.style.display='none';
 inner.querySelectorAll('.olen440-splash-poster').forEach(el=>el.remove());
 const title=document.getElementById('alphaWelcomeTitle');if(title)title.textContent=title.textContent.replace(/\bAlpha\b|\bALPHA\b/g,'OLEN');
 const sub=document.getElementById('alphaWelcomeSub');if(sub)sub.textContent=sub.textContent.replace(/\bAlpha\b|\bALPHA\b/g,'OLEN');
 const status=document.getElementById('alphaCompassStatus');if(status&&/Alpha|ALPHA|orientar|iniciar/i.test(status.textContent))status.textContent='A iniciar a OLEN…';
}

function publicActiveText(){const roots=[document.querySelector('.view.active'),document.getElementById('alphaDecisionOverlay'),document.querySelector('.sharePreview')].filter(Boolean);roots.forEach(root=>root.querySelectorAll('*').forEach(el=>{if(el.children.length||/^(SCRIPT|STYLE)$/i.test(el.tagName))return;const t=el.textContent||'';if(/\bAlpha\b|\bALPHA\b/.test(t))el.textContent=t.replace(/PROJECT\s+ALPHA/g,'OLEN').replace(/\bALPHA\b/g,'OLEN').replace(/\bAlpha\b/g,'OLEN')}))}

function apply(){brandHome();brandChatSidebar();brandInternalSidebar();brandAuth();brandSplash();publicActiveText()}
function delayed(){requestAnimationFrame(apply);setTimeout(apply,80);setTimeout(apply,260)}
document.addEventListener('DOMContentLoaded',delayed,{once:true});window.addEventListener('pageshow',delayed,{passive:true});document.addEventListener('click',delayed,true);document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});apply();setTimeout(apply,120);setTimeout(apply,500);setTimeout(apply,1100);
console.info('[OLEN 4.4.0] Direct PNG on Home + internal sidebar active');
})();
