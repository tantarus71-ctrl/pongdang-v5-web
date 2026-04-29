(() => {
  'use strict';
  const ASSETS = {
    beodeulchi:{dex:'assets/fish_cards/dex/beodeulchi_dex.png',detail:'assets/fish_cards/detail/beodeulchi_detail.png',collector:'assets/cards/collector/card_beodeulchi.png'},
    piramii:{dex:'assets/fish_cards/dex/pirami_dex.png',detail:'assets/fish_cards/detail/pirami_detail.png',collector:'assets/cards/collector/card_pirami.png'},
    siri:{dex:'assets/fish_cards/dex/shiri_dex.png',detail:'assets/fish_cards/detail/shiri_detail.png',collector:'assets/cards/collector/card_shiri.png'},
    gaksi:{dex:'assets/fish_cards/dex/gaksi_bungeo_dex.png',detail:'assets/fish_cards/detail/gaksi_bungeo_detail.png',collector:'assets/cards/collector/card_gaksi_bungeo.png'}
  };
  function idFromText(text){const t=(text||'').toLowerCase(); if(t.includes('피라미')||t.includes('piram'))return 'piramii'; if(t.includes('쉬리')||t.includes('siri'))return 'siri'; if(t.includes('각시')||t.includes('gaksi'))return 'gaksi'; return 'beodeulchi';}
  function probe(src,ok){const im=new Image(); im.onload=()=>ok(src); im.onerror=()=>{}; im.src=src+(src.includes('?')?'&':'?')+'v=v30A1L';}
  function putImage(box,src,cls){if(!box||box.dataset.v30a1lImg==='true')return; probe(src,(real)=>{box.dataset.v30a1lImg='true'; box.innerHTML=''; const img=document.createElement('img'); img.src=real; img.alt='물고기 카드 이미지'; img.className=cls; box.appendChild(img);});}
  function enhanceDex(){document.querySelectorAll('.dex-card').forEach(card=>{const id=idFromText(card.textContent); const box=card.querySelector('.dex-fish-img'); if(ASSETS[id]) putImage(box,ASSETS[id].dex,'v30a1l-dex-img');});}
  function enhanceDetail(){const detail=document.querySelector('.detail-card'); if(detail){const id=idFromText(detail.textContent); const hero=detail.querySelector('#detailHero,.detail-hero'); if(ASSETS[id]) putImage(hero,ASSETS[id].detail,'v30a1l-detail-img');}
    const acquire=document.getElementById('acquireCard'); if(acquire){const id=idFromText(acquire.textContent); const box=acquire.querySelector('#acquireImage,.card-fish-img'); if(ASSETS[id]) putImage(box,ASSETS[id].collector,'v30a1l-acquire-img');}}
  function run(){enhanceDex();enhanceDetail();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
  window.PondangFishCardAssetsV30A1L={run,assets:ASSETS};
})();
