(() => {
  'use strict';
  const CSS_ID = 'collectorCardV30A1KCss';
  const CARD_META = {
    beodeulchi: { code: 'GJ-001', grade: 'LOCAL HERO', gradeClass: 'local', level: 'Lv.3', zones: ['웃물','여울','잔여울'], layer: '중층~상층', point: '맑은 물살을 타고 천천히 움직여요.' },
    piramii: { code: 'GJ-002', grade: 'COMMON', gradeClass: 'common', level: 'Lv.2', zones: ['웃물','여울','물모이'], layer: '상층~중층', point: '햇빛을 받으면 은빛으로 반짝여요.' },
    siri: { code: 'GJ-003', grade: 'RARE', gradeClass: 'rare', level: 'Lv.4', zones: ['여울','깊물'], layer: '바닥 가까이', point: '깨끗한 자갈 주변을 좋아해요.' },
    gaksi: { code: 'GJ-004', grade: 'SPECIAL', gradeClass: 'special', level: 'Lv.4', zones: ['잔여울','물모이'], layer: '수초 주변', point: '수초 사이에서 조심스럽게 보여요.' }
  };
  const CARD_IMAGES = {
    beodeulchi: 'assets/cards/collector/card_beodeulchi.png',
    piramii: 'assets/cards/collector/card_pirami.png',
    siri: 'assets/cards/collector/card_shiri.png',
    gaksi: 'assets/cards/collector/card_gaksi_bungeo.png'
  };
  function css(){
    if(document.getElementById(CSS_ID)) return;
    const s=document.createElement('style');
    s.id=CSS_ID;
    s.textContent=`
      .dex-card.collector-card{border:1px solid rgba(255,255,255,.58)!important;background:linear-gradient(180deg,rgba(255,255,255,.97),rgba(226,247,255,.95))!important;box-shadow:0 16px 34px rgba(0,52,82,.18),inset 0 1px 0 rgba(255,255,255,.88)!important;overflow:hidden;position:relative}
      .dex-card.collector-card:after{content:attr(data-collector-code);position:absolute;right:8px;bottom:8px;padding:3px 6px;border-radius:999px;background:rgba(7,53,75,.82);color:#fff;font-size:9px;font-weight:950}
      .collector-grade{position:absolute;left:8px;top:38px;z-index:3;padding:3px 7px;border-radius:999px;background:linear-gradient(135deg,#ffd56a,#ff9f43);color:#3d2400;font-size:9px;font-weight:1000;box-shadow:0 5px 12px rgba(0,0,0,.18)}
      .collector-grade.rare{background:linear-gradient(135deg,#9d7cff,#54d4ff);color:#fff}.collector-grade.special{background:linear-gradient(135deg,#64f0a2,#14a56b);color:#fff}.collector-grade.local{background:linear-gradient(135deg,#59d7ff,#0b8fc1);color:#fff}
      .collector-level{position:absolute;right:8px;top:38px;z-index:3;padding:3px 7px;border-radius:999px;background:rgba(7,53,75,.88);color:#fff;font-size:9px;font-weight:1000}
      .collector-zone-badges{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-top:5px}.collector-zone-badge{padding:3px 6px;border-radius:999px;background:rgba(11,143,193,.12);border:1px solid rgba(11,143,193,.18);color:#07516c;font-size:9.5px;font-weight:950;line-height:1}
      .collector-card-art{width:100%;height:94px;object-fit:cover;border-radius:16px;display:block;box-shadow:inset 0 1px 0 rgba(255,255,255,.78),0 8px 16px rgba(0,0,0,.08)}
      .collector-detail-art{width:100%;max-height:320px;object-fit:contain;border-radius:22px;display:block;background:linear-gradient(135deg,#e9fbff,#fff6c9)}
      .collector-acquire-art{width:100%;height:148px;object-fit:cover;border-radius:22px;display:block;background:linear-gradient(135deg,#e9fbff,#fff6c9)}
      .detail-card.collector-detail,.card-acquire.collector-acquire{border:1px solid rgba(255,255,255,.72)!important;background:linear-gradient(180deg,rgba(255,255,255,.99),rgba(229,249,255,.97))!important}
      .collector-detail-badges{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 10px}.collector-detail-badges span{border-radius:999px;padding:6px 9px;background:#e9f8fb;border:1px solid rgba(11,112,151,.13);color:#0b5875;font-size:11px;font-weight:950}
      .collector-print-mark{margin-top:8px;color:#47758a;font-size:10px;font-weight:900;letter-spacing:.02em}
      .nav-btn.collector-nav i{width:30px;height:25px;border-radius:11px;background:linear-gradient(135deg,rgba(126,230,255,.18),rgba(255,225,118,.12))}
    `;
    document.head.appendChild(s);
  }
  function guessId(text){
    const t=(text||'').toLowerCase();
    if(t.includes('피라미')||t.includes('piram')) return 'piramii';
    if(t.includes('쉬리')||t.includes('siri')) return 'siri';
    if(t.includes('각시')||t.includes('gaksi')) return 'gaksi';
    return 'beodeulchi';
  }
  function metaFromText(text){ return CARD_META[guessId(text)] || CARD_META.beodeulchi; }
  function imageForText(text){ return CARD_IMAGES[guessId(text)] || CARD_IMAGES.beodeulchi; }
  function badgeNode(meta){
    const box=document.createElement('div');
    box.className='collector-zone-badges';
    meta.zones.forEach(z=>{const b=document.createElement('span');b.className='collector-zone-badge';b.textContent=z+' 획득';box.appendChild(b);});
    return box;
  }
  function tryImg(src,onOk){
    const probe=new Image();
    probe.onload=()=>onOk(src);
    probe.onerror=()=>{};
    probe.src=src + (src.includes('?')?'&':'?') + 'v=v30A1K';
  }
  function installArt(container, src, cls){
    if(!container || container.dataset.collectorArtReady==='true') return;
    tryImg(src, ok=>{
      container.dataset.collectorArtReady='true';
      container.innerHTML='';
      const img=document.createElement('img');
      img.className=cls;
      img.alt='퐁당퐁당 수집 카드 이미지';
      img.src=ok;
      container.appendChild(img);
    });
  }
  function enhanceCards(){
    document.querySelectorAll('.dex-card').forEach(card=>{
      const id=guessId(card.textContent);
      const meta=CARD_META[id];
      if(card.dataset.collectorReady!=='true'){
        card.dataset.collectorReady='true';
        card.dataset.collectorCode=meta.code;
        card.classList.add('collector-card');
        const g=document.createElement('div');g.className='collector-grade '+meta.gradeClass;g.textContent=meta.grade;
        const l=document.createElement('div');l.className='collector-level';l.textContent=meta.level;
        card.appendChild(g);card.appendChild(l);card.appendChild(badgeNode(meta));
      }
      const fishBox=card.querySelector('.dex-fish-img');
      installArt(fishBox,CARD_IMAGES[id],'collector-card-art');
    });
  }
  function enhanceDetail(){
    const detail=document.querySelector('.detail-card');
    if(detail){
      const id=guessId(detail.textContent);
      const meta=CARD_META[id];
      if(detail.dataset.collectorReady!=='true'){
        detail.dataset.collectorReady='true';detail.classList.add('collector-detail');
        const b=document.createElement('div');b.className='collector-detail-badges';
        [meta.code,meta.grade,meta.level,meta.layer].forEach(v=>{const s=document.createElement('span');s.textContent=v;b.appendChild(s);});
        const head=detail.querySelector('.detail-head'); if(head) head.after(b);
        const mark=document.createElement('div');mark.className='collector-print-mark';mark.textContent='PONGDANG COLLECTOR CARD · JOHN CHOI';detail.appendChild(mark);
      }
      const hero=detail.querySelector('#detailHero,.detail-hero');
      installArt(hero,CARD_IMAGES[id],'collector-detail-art');
    }
    const acquire=document.getElementById('acquireCard');
    if(acquire){
      const id=guessId(acquire.textContent);
      if(acquire.dataset.collectorReady!=='true'){
        acquire.dataset.collectorReady='true';acquire.classList.add('collector-acquire');
        const mark=document.createElement('div');mark.className='collector-print-mark';mark.textContent='GJ-001 · LOCAL HERO · JOHN CHOI';acquire.appendChild(mark);
      }
      const box=acquire.querySelector('#acquireImage,.card-fish-img');
      installArt(box,CARD_IMAGES[id],'collector-acquire-art');
    }
  }
  function enhanceNav(){document.querySelectorAll('.nav-btn').forEach(b=>b.classList.add('collector-nav'));}
  function run(){css();enhanceNav();enhanceCards();enhanceDetail();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  const obs=new MutationObserver(()=>run());
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.PondangCollectorCardV30A1K={run,meta:CARD_META,images:CARD_IMAGES};
})();
