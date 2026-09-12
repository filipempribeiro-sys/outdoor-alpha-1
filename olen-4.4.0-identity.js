/* OLEN 4.4.0 · VISIBLE IDENTITY LAYER
   Keeps ALPHA as an internal codename only. No navigation/gesture/backend changes. */
(()=>{
  'use strict';
  if(window.__olenIdentity440)return;
  window.__olenIdentity440=true;

  const UI_LOGO='assets/olen-ui.jpg';
  const SPLASH_LOGO='assets/olen-splash.jpg';

  const css=document.createElement('style');
  css.id='olenIdentity440';
  css.textContent=`
    .olen440-ui-logo{
      background-image:url('${UI_LOGO}')!important;
      background-position:center!important;
      background-repeat:no-repeat!important;
      background-size:cover!important;
      color:transparent!important;
      text-shadow:none!important;
      overflow:hidden!important;
    }
    .olen440-ui-logo::before,.olen440-ui-logo::after{display:none!important;content:none!important}
    .olen440-splash-art{
      background-image:url('${SPLASH_LOGO}')!important;
      background-position:center!important;
      background-repeat:no-repeat!important;
      background-size:contain!important;
      color:transparent!important;
      text-shadow:none!important;
    }
    .olen440-splash-art::before,.olen440-splash-art::after{display:none!important;content:none!important}
  `;
  document.head.appendChild(css);

  const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
  const visible=el=>{try{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'}catch{return false}};

  function replaceText(root=document){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];let n;
    while((n=walker.nextNode()))nodes.push(n);
    for(const node of nodes){
      const p=node.parentElement;
      if(!p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(p.tagName))continue;
      let t=node.nodeValue||'';
      if(!/alpha/i.test(t))continue;
      t=t.replace(/PROJECT\s+ALPHA/gi,'OLEN')
         .replace(/ALPHA\s*[·•-]\s*OUTDOOR\s+LIFESTYLE\s+AI/gi,'OLEN · OUTDOOR • LIFESTYLE • EXPERIENCE')
         .replace(/A iniciar a ALPHA(?:\s*[\d.]+)?…?/gi,'A iniciar a OLEN…')
         .replace(/Pergunta à Alpha/gi,'Pergunta à OLEN')
         .replace(/A Alpha está a trabalhar/gi,'OLEN está a trabalhar')
         .replace(/Alpha está a trabalhar/gi,'OLEN está a trabalhar');
      if(node.nodeValue!==t)node.nodeValue=t;
    }
    document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
      const p=el.getAttribute('placeholder')||'';
      if(/Pergunta à Alpha/i.test(p))el.setAttribute('placeholder',p.replace(/Pergunta à Alpha/gi,'Pergunta à OLEN'));
    });
  }

  function brandHome(){
    const top=document.querySelector('.top');
    if(!top)return;
    const candidates=[...top.querySelectorAll('.logo,[class*="logo"],.brand,[class*="brand"]')];
    for(const el of candidates){
      const txt=norm(el.textContent);
      if(el.classList.contains('logo')||/project alpha|alpha/i.test(txt)){
        const logo=el.classList.contains('logo')?el:el.querySelector('.logo,[class*="logo"]');
        if(logo)logo.classList.add('olen440-ui-logo');
      }
    }
    [...top.querySelectorAll('*')].forEach(el=>{
      if(el.children.length===0&&/PROJECT\s+ALPHA/i.test(norm(el.textContent)))el.textContent='OLEN';
    });
  }

  function brandSidebars(){
    const scopes=[...document.querySelectorAll('aside,[class*="sidebar"],[class*="drawer"],[id*="sidebar"],[id*="drawer"]')].filter(visible);
    for(const scope of scopes){
      const text=norm(scope.textContent);
      if(!/Nova conversa|Recentes|Projetos|Planos|Biblioteca/i.test(text))continue;
      const header=[...scope.querySelectorAll('header,div')].find(el=>/\bOLEN\b|\bALPHA\b/i.test(norm(el.textContent))&&el.getBoundingClientRect().top<scope.getBoundingClientRect().top+140);
      if(!header)continue;
      const logo=header.querySelector('.logo,[class*="logo"],img');
      if(logo){
        if(logo.tagName==='IMG')logo.src=UI_LOGO;
        else logo.classList.add('olen440-ui-logo');
      }else{
        const mark=document.createElement('span');
        mark.className='olen440-ui-logo';
        mark.setAttribute('aria-hidden','true');
        mark.style.cssText='display:inline-block;width:38px;height:38px;border-radius:12px;flex:0 0 38px;margin-right:10px;';
        const title=[...header.querySelectorAll('*')].find(el=>el.children.length===0&&/\bOLEN\b|\bALPHA\b/i.test(norm(el.textContent)));
        if(title)title.before(mark);else header.prepend(mark);
      }
    }
  }

  function brandSplash(){
    const nodes=[...document.querySelectorAll('body *')].filter(visible);
    const splash=nodes.find(el=>{
      const t=norm(el.textContent);
      return /Bem-vindo de volta/i.test(t)&&/A iniciar a (?:ALPHA|OLEN)|OUTDOOR LIFESTYLE AI/i.test(t);
    });
    if(!splash)return;
    const r=splash.getBoundingClientRect();
    if(r.width<innerWidth*.55||r.height<innerHeight*.35)return;
    const imageCandidates=[...splash.querySelectorAll('img,.logo,[class*="logo"],[class*="mark"],[class*="icon"]')];
    const hero=imageCandidates.find(el=>{const x=el.getBoundingClientRect();return x.width>=48&&x.height>=48&&x.top<r.top+r.height*.55});
    if(hero){
      if(hero.tagName==='IMG')hero.src=SPLASH_LOGO;
      else hero.classList.add('olen440-splash-art');
    }
    [...splash.querySelectorAll('*')].forEach(el=>{
      if(el.children.length)return;
      const t=norm(el.textContent);
      if(/^ALPHA\s*[·•-]\s*OUTDOOR\s+LIFESTYLE\s+AI$/i.test(t))el.textContent='OLEN · OUTDOOR • LIFESTYLE • EXPERIENCE';
      else if(/^A iniciar a ALPHA/i.test(t))el.textContent='A iniciar a OLEN…';
    });
  }

  function footerLabel(){
    document.querySelectorAll('.bottom *').forEach(el=>{
      if(el.children.length===0&&/^Alpha$/i.test(norm(el.textContent)))el.textContent='OLEN';
    });
  }

  let queued=false;
  function apply(){queued=false;replaceText();brandHome();brandSidebars();brandSplash();footerLabel()}
  function queue(){if(queued)return;queued=true;requestAnimationFrame(apply)}
  new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style','placeholder']});
  document.addEventListener('DOMContentLoaded',apply,{once:true});
  window.addEventListener('pageshow',apply,{passive:true});
  apply();setTimeout(apply,80);setTimeout(apply,300);setTimeout(apply,900);
})();
