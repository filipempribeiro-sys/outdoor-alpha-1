/* OLEN 4.4.0 · VISIBLE IDENTITY LAYER
   Public branding only. Technical ALPHA internals stay untouched. */
(()=>{
'use strict';
if(window.__olenIdentity440)return;
window.__olenIdentity440=true;

const UI_LOGO='assets/olen-ui.jpg';
const SPLASH_LOGO='assets/olen-splash.jpg';
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();

const style=document.createElement('style');
style.id='olenIdentity440';
style.textContent=`
.olen440-ui-logo{background-image:url('${UI_LOGO}')!important;background-position:center!important;background-repeat:no-repeat!important;background-size:cover!important;color:transparent!important;text-shadow:none!important;overflow:hidden!important}
.olen440-ui-logo::before,.olen440-ui-logo::after{display:none!important;content:none!important}
.alphaChatOlenBrand4330 .alphaSidebarLogo.logo,.top .brand .logo,.legacyAuthBrand .logo,.authWelcomeBrand .logo{background-image:url('${UI_LOGO}')!important;background-position:center!important;background-repeat:no-repeat!important;background-size:cover!important}
.alphaChatOlenBrand4330 .alphaSidebarLogo.logo::before,.alphaChatOlenBrand4330 .alphaSidebarLogo.logo::after,.top .brand .logo::before,.top .brand .logo::after,.legacyAuthBrand .logo::before,.legacyAuthBrand .logo::after,.authWelcomeBrand .logo::before,.authWelcomeBrand .logo::after{display:none!important;content:none!important}
#alphaInternalSidebar .alphaInternalBrand .olen440-internal-logo{width:44px;height:44px;min-width:44px;border-radius:14px;background:url('${UI_LOGO}') center/cover no-repeat!important;display:block;overflow:hidden}
#alphaInternalSidebar .alphaInternalBrand .olen440-internal-logo>*{visibility:hidden!important}
#alphaWelcomeOverlay .olen440-splash-poster{display:block!important;width:min(86vw,440px)!important;height:auto!important;max-height:48vh!important;object-fit:contain!important;margin:0 auto 18px!important;border:0!important;border-radius:0!important;box-shadow:none!important}
`;
document.head.appendChild(style);

function setLeafText(root,re,value){
  if(!root)return;
  root.querySelectorAll('*').forEach(el=>{if(el.children.length===0&&re.test(norm(el.textContent)))el.textContent=value});
}

function brandHome(){
  const brand=document.querySelector('.top .brand');
  if(brand){
    brand.querySelector('.logo')?.classList.add('olen440-ui-logo');
    const b=brand.querySelector('b');
    if(b)b.textContent='OLEN';
    brand.querySelectorAll('small').forEach(s=>{s.style.display='none'});
  }
  document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
    const p=el.getAttribute('placeholder')||'';
    if(/Pergunta à (?:Alpha|OLEN)/i.test(p))el.setAttribute('placeholder','Pergunta à OLEN...');
  });
  document.querySelectorAll('[aria-label],[title]').forEach(el=>{
    for(const attr of ['aria-label','title']){
      const v=el.getAttribute(attr);if(v&&/\bAlpha\b|\bALPHA\b/.test(v))el.setAttribute(attr,v.replace(/PROJECT\s+ALPHA/g,'OLEN').replace(/\bALPHA\b/g,'OLEN').replace(/\bAlpha\b/g,'OLEN'));
    }
  });
  document.querySelectorAll('.bottom *').forEach(el=>{if(el.children.length===0&&/^(?:Alpha|OLEN)$/i.test(norm(el.textContent)))el.textContent='OLEN'});
}

function brandChatSidebar(){
  const side=document.querySelector('.alphaChatOlenSidebar4330');
  if(!side)return;
  const logo=side.querySelector('.alphaChatOlenBrand4330 .alphaSidebarLogo.logo');
  if(logo)logo.classList.add('olen440-ui-logo');
  const name=side.querySelector('.alphaChatOlenName4330');
  if(name)name.textContent='OLEN';
}

function brandInternalSidebar(){
  const side=document.getElementById('alphaInternalSidebar');
  if(!side)return;
  const brand=side.querySelector('.alphaInternalBrand');
  if(brand){
    const name=brand.querySelector('b');
    if(name)name.textContent='OLEN';
    let mark=brand.querySelector('.olen440-internal-logo');
    if(!mark){
      const candidate=[...brand.children].find(el=>el!==name&&!/^(B|STRONG)$/i.test(el.tagName));
      if(candidate){candidate.classList.add('olen440-internal-logo');mark=candidate}
      else if(name){mark=document.createElement('span');mark.className='olen440-internal-logo';mark.setAttribute('aria-hidden','true');name.before(mark)}
    }
  }
  const first=side.querySelector('.alphaInternalNavList button');
  if(first)setLeafText(first,/^(?:Alpha|OLEN)$/i,'OLEN');
}

function brandAuth(){
  document.querySelectorAll('#authGate .logo').forEach(el=>el.classList.add('olen440-ui-logo'));
}

function brandSplash(){
  const overlay=document.getElementById('alphaWelcomeOverlay');
  const inner=overlay?.querySelector('.alphaWelcomeInner');
  if(!overlay||!inner)return;

  const compass=document.getElementById('alphaWelcomeCompass');
  const eyebrow=inner.querySelector('.alphaWelcomeEyebrow');
  let poster=inner.querySelector('.olen440-splash-poster');
  if(!poster){
    poster=document.createElement('img');
    poster.src=SPLASH_LOGO;
    poster.alt='OLEN — Outdoor • Lifestyle • Experience — Navega à tua medida';
    poster.className='olen440-splash-poster';
    const title=document.getElementById('alphaWelcomeTitle');
    if(title)inner.insertBefore(poster,title);else inner.prepend(poster);
  }
  if(compass)compass.style.display='none';
  if(eyebrow)eyebrow.style.display='none';

  const title=document.getElementById('alphaWelcomeTitle');
  if(title)title.textContent=title.textContent.replace(/\bAlpha\b|\bALPHA\b/g,'OLEN');
  const sub=document.getElementById('alphaWelcomeSub');
  if(sub)sub.textContent=sub.textContent.replace(/\bAlpha\b|\bALPHA\b/g,'OLEN');
  const status=document.getElementById('alphaCompassStatus');
  if(status&&/Alpha|ALPHA|orientar|iniciar/i.test(status.textContent))status.textContent='A iniciar a OLEN…';
}

function publicActiveText(){
  const roots=[document.querySelector('.view.active'),document.getElementById('alphaDecisionOverlay'),document.querySelector('.sharePreview')].filter(Boolean);
  roots.forEach(root=>root.querySelectorAll('*').forEach(el=>{
    if(el.children.length||/^(SCRIPT|STYLE)$/i.test(el.tagName))return;
    const t=el.textContent||'';
    if(/\bAlpha\b|\bALPHA\b/.test(t))el.textContent=t.replace(/PROJECT\s+ALPHA/g,'OLEN').replace(/\bALPHA\b/g,'OLEN').replace(/\bAlpha\b/g,'OLEN');
  }));
}

function apply(){brandHome();brandChatSidebar();brandInternalSidebar();brandAuth();brandSplash();publicActiveText()}
function delayed(){requestAnimationFrame(apply);setTimeout(apply,80);setTimeout(apply,260)}

document.addEventListener('DOMContentLoaded',delayed,{once:true});
window.addEventListener('pageshow',delayed,{passive:true});
document.addEventListener('click',delayed,true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
apply();setTimeout(apply,120);setTimeout(apply,500);setTimeout(apply,1100);
console.info('[OLEN 4.4.0] Exact lightweight identity active');
})();
