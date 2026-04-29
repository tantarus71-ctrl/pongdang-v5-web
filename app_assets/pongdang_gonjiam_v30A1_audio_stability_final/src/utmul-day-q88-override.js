/* v30A1K safe addon loader: path fix + depth/menu/card guards */
(() => {
  'use strict';
  const bgPath = 'assets/bg/upper/day.jpg';
  const addons = [
    ['link','aq-depth-css','./src/styles/aquarium-layer-depth-v1.css?v=aq-depth-v1'],
    ['link','aq-zone-css','./src/styles/aquarium-zone-special-v1.css?v=aq-zone-special-v1'],
    ['link','menu-safety-css','./src/styles/menu-safety-guard-v1.css?v=menu-safety-v1'],
    ['script','aq-depth-js','./src/aquarium-layer-depth-v1.js?v=aq-depth-v1'],
    ['script','menu-safety-js','./src/menu-function-safety-v1.js?v=menu-safety-v1'],
    ['script','collector-card-js','./src/collector-card-v30a1k.js?v=collector-v30a1k']
  ];
  function add(type,id,url){
    if(document.querySelector('[data-addon-id="'+id+'"]')) return;
    const n=document.createElement(type);
    n.dataset.addonId=id;
    if(type==='link'){n.rel='stylesheet';n.href=url;} else {n.src=url;n.defer=true;}
    document.head.appendChild(n);
  }
  function activeUtmul(){
    const desc=document.getElementById('zoneDesc');
    const active=document.querySelector('.zone-btn.active');
    return (desc&&desc.textContent.includes('웃물'))||(active&&active.textContent.includes('웃물'));
  }
  function isNight(){return document.body.classList.contains('night')||document.getElementById('app')?.classList.contains('night');}
  function applyBg(){
    const bg=document.getElementById('bg');
    if(bg&&activeUtmul()&&!isNight()){
      bg.style.backgroundImage='url("./'+bgPath+'?cache=v30A1K")';
      bg.dataset.optimizedOverride='utmul-day-stable-v30A1K';
    }
  }
  function boot(){
    addons.forEach(a=>add(a[0],a[1],a[2]));
    applyBg();
    setTimeout(applyBg,120);
    setTimeout(applyBg,500);
    document.addEventListener('click',()=>setTimeout(applyBg,80),true);
    window.PondangV30A1KAddon={applyBg,path:bgPath,collector:true,menuSafety:true};
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
