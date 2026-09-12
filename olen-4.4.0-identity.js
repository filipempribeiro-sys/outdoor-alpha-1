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
.alphaChatOlenBrand4330 .alphaSidebarLogo.logo,.top .brand .logo{background-image:url('${UI_LOGO}')!important;background-position:center!important;background-repeat:no-repeat!important;background-size:cover!important}
.alphaChatOlenBrand4330 .alphaSidebarLogo.logo::before,.alphaChatOlenBrand4330 .alphaSidebarLogo.logo::after,.top .brand .logo::before,.top .brand .logo::after{display:none!important;content:none!important}
#alphaInternalSidebar .alphaInternalBrand .olen440-internal-logo{width:44px;height:44px;min-width:44px;border-radius:14px;background:url('${UI_LOGO}') center/cover no-repeat!important;display:block;overflow:hidden}
#alphaInternalSidebar .alphaInternalBrand .olen440-internal-logo>*{visibility:hidden!important}
.olen440-splash-poster{display:block!important;width:min(74vw,360px)!important;height:auto!important;max-height:42vh!important;object-fit:contain!important;margin:0 auto 20px!important;border:0!important;border-radius:0!important;box-shadow:none!important}
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
    brand.querySelectorAll('small').forEach(s=>{if(/alpha|project/i.test(norm(s.textContent))){s.textContent='';s.style.display='none'}});
  }
  document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
    const p=el.getAttribute('placeholder')||'';
    if(/Pergunta à Alpha/i.test(p))el.setAttribute('placeholder',p.replace(/Pergunta à Alpha/gi,'Pergunta à OLEN'));
  });
  document.querySelectorAll('.bottom *').forEach(el=>{if(el.children.length===0&&/^Alpha$/i.test(norm(el.textContent)))el.textContent='OLEN'});
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
  if(first){setLeafText(first,/^Alpha$/i,'OLEN')}
}

function workingText(){
  const root=document.getElementById('lifestyleAI')||document.body;
  setLeafText(root,/^(?:A\s+)?Alpha está a trabalhar(?:\.\.\.|…)?$/i,'OLEN está a trabalhar…');
}

function findSplash(){
  const all=[...document.querySelectorAll('body div,body section,body main')];
  return all.find(el=>{const t=norm(el.textContent);return /Bem-vindo de volta/i.test(t)&&/(?:A iniciar a (?:ALPHA|OLEN)|OUTDOOR LIFESTYLE AI)/i.test(t)})||null;
}

function brandSplash(){
  const splash=findSplash();
  if(!splash||splash.dataset.olen440Splash==='1')return;
  const r=splash.getBoundingClientRect();
  if(r.width<innerWidth*.5||r.height<innerHeight*.3)return;
  const leaves=[...splash.querySelectorAll('*')].filter(el=>el.children.length===0);
  const brandLine=leaves.find(el=>/^(?:ALPHA|OLEN)\s*[·•-]\s*OUTDOOR\s+LIFESTYLE(?:\s+AI|\s*[·•-]\s*EXPERIENCE)?$/i.test(norm(el.textContent)));
  const startLine=leaves.find(el=>/^A iniciar a (?:ALPHA|OLEN)/i.test(norm(el.textContent)));
  const icon=[...splash.querySelectorAll('img,.logo,[class*="logo"],[class*="mark"],[class*="icon"]')].find(el=>{const x=el.getBoundingClientRect();return x.width>=48&&x.height>=48&&x.top<r.top+r.height*.58});
  if(icon)icon.style.display='none';
  if(brandLine){
    const poster=document.createElement('img');
    poster.src=SPLASH_LOGO;
    poster.alt='OLEN — Outdoor • Lifestyle • Experience — Navega à tua medida';
    poster.className='olen440-splash-poster';
    brandLine.before(poster);
    brandLine.style.display='none';
  }else if(icon?.parentElement){
    const poster=document.createElement('img');poster.src=SPLASH_LOGO;poster.alt='OLEN';poster.className='olen440-splash-poster';icon.parentElement.insertBefore(poster,icon.nextSibling);
  }
  if(startLine)startLine.textContent='A iniciar a OLEN…';
  splash.dataset.olen440Splash='1';
}

function apply(){brandHome();brandChatSidebar();brandInternalSidebar();workingText();brandSplash()}
function delayed(){requestAnimationFrame(apply);setTimeout(apply,80);setTimeout(apply,260)}

document.addEventListener('DOMContentLoaded',delayed,{once:true});
window.addEventListener('pageshow',delayed,{passive:true});
document.addEventListener('click',delayed,true);
document.addEventListener('touchend',()=>requestAnimationFrame(apply),{passive:true,capture:true});
apply();setTimeout(apply,120);setTimeout(apply,500);setTimeout(apply,1100);
console.info('[OLEN 4.4.0] Lightweight identity active');
})();
