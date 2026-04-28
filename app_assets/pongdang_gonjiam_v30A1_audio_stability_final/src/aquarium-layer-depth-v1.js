/* 퐁당퐁당 곤지암천 v30A-1 - 수족관 레이어·입체감 고도화 1차 */
(() => {
  'use strict';

  /*
    수족관 1차 안정화 기준:
    - 어종 추가 없이 수조 레이어만 보강한다.
    - 존별 특수성은 유지하되 모바일 성능을 위해 수량을 보수적으로 둔다.
    - 전경 오브젝트는 물고기 클릭을 방해하지 않도록 pointer-events:none CSS와 낮은 밀도를 유지한다.
  */
  const PROFILES = {
    utmul: { label: '웃물', cls: 'aq-zone-utmul', plantBack: 3, plantMid: 5, plantFront: 2, stoneBack: 3, stoneMid: 5, stoneFront: 1, bubbleBack: 4, bubbleFront: 2, dust: 9, creatures: { shrimp: 2, snail: 2, fry: 1, benthic: 0 } },
    yeoul: { label: '여울', cls: 'aq-zone-yeoul', plantBack: 2, plantMid: 3, plantFront: 1, stoneBack: 5, stoneMid: 8, stoneFront: 2, bubbleBack: 5, bubbleFront: 3, dust: 12, creatures: { shrimp: 1, snail: 1, fry: 1, benthic: 0 } },
    janyeoul: { label: '잔여울', cls: 'aq-zone-janyeoul', plantBack: 5, plantMid: 8, plantFront: 3, stoneBack: 2, stoneMid: 5, stoneFront: 1, bubbleBack: 3, bubbleFront: 2, dust: 11, creatures: { shrimp: 2, snail: 2, fry: 1, benthic: 0 } },
    gipmul: { label: '깊물', cls: 'aq-zone-gipmul', plantBack: 2, plantMid: 4, plantFront: 1, stoneBack: 5, stoneMid: 8, stoneFront: 2, bubbleBack: 2, bubbleFront: 1, dust: 8, creatures: { shrimp: 1, snail: 1, fry: 0, benthic: 1 } },
    mulmoi: { label: '물모이', cls: 'aq-zone-mulmoi', plantBack: 4, plantMid: 7, plantFront: 3, stoneBack: 4, stoneMid: 7, stoneFront: 2, bubbleBack: 4, bubbleFront: 3, dust: 13, creatures: { shrimp: 2, snail: 3, fry: 2, benthic: 0 } }
  };

  const ZONE_BY_LABEL = {
    '웃물': 'utmul',
    '여울': 'yeoul',
    '잔여울': 'janyeoul',
    '깊물': 'gipmul',
    '물모이': 'mulmoi'
  };

  const state = { renderedKey: '', busy: false, timer: null };
  const rnd = (min, max) => min + Math.random() * (max - min);

  function loadScriptOnce(src, id) {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  }

  function ensureFishDepthTune() {
    loadScriptOnce('./src/fish-depth-tune-v1.js?v=fish-depth-v1', 'fishDepthTuneV1Js');
  }

  function detectZoneId() {
    const activeText = document.querySelector('.zone-btn.active')?.textContent || '';
    const descText = document.getElementById('zoneDesc')?.textContent || '';
    const text = `${activeText} ${descText}`;
    for (const [label, id] of Object.entries(ZONE_BY_LABEL)) {
      if (text.includes(label)) return id;
    }
    return 'utmul';
  }

  function ensureLayer(id, className, parent) {
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement('div');
      node.id = id;
      node.className = className;
      parent.appendChild(node);
    }
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function setVars(el, vars) {
    Object.entries(vars).forEach(([key, value]) => el.style.setProperty(key, String(value)));
  }

  function makePlant(depth, index) {
    const el = document.createElement('i');
    el.className = `aq-plant ${depth}`;
    const baseHeight = depth === 'front' ? rnd(62, 118) : depth === 'mid' ? rnd(38, 88) : rnd(22, 58);
    const baseWidth = depth === 'front' ? rnd(7, 12) : depth === 'mid' ? rnd(5, 9) : rnd(3, 6);
    setVars(el, {
      '--x': `${rnd(4, 94)}%`,
      '--w': `${baseWidth}px`,
      '--h': `${baseHeight}px`,
      '--tilt': rnd(1.0, 3.2).toFixed(2),
      '--dur': `${rnd(6.2, 12.5).toFixed(2)}s`,
      '--drift': `${rnd(-3, 3).toFixed(1)}px`,
      '--leaf': `${rnd(22, 42).toFixed(1)}deg`,
      '--op': depth === 'front' ? rnd(.48, .66).toFixed(2) : depth === 'back' ? rnd(.24, .40).toFixed(2) : rnd(.42, .62).toFixed(2),
      '--scale': depth === 'front' ? rnd(1.0, 1.13).toFixed(2) : depth === 'back' ? rnd(.72, .86).toFixed(2) : rnd(.9, 1.0).toFixed(2)
    });
    el.style.animationDelay = `-${(index * .47 + rnd(0, 3)).toFixed(2)}s`;
    return el;
  }

  function makeStone(depth) {
    const el = document.createElement('i');
    el.className = `aq-stone ${depth}`;
    const width = depth === 'front' ? rnd(34, 78) : depth === 'mid' ? rnd(26, 66) : rnd(18, 48);
    setVars(el, {
      '--x': `${rnd(2, 92)}%`,
      '--w': `${width}px`,
      '--ratio': rnd(.34, .54).toFixed(2),
      '--op': depth === 'front' ? rnd(.48, .68).toFixed(2) : depth === 'back' ? rnd(.25, .42).toFixed(2) : rnd(.40, .62).toFixed(2),
      '--blur': depth === 'back' ? '.38px' : '0px'
    });
    return el;
  }

  function makeBubble(depth, index) {
    const el = document.createElement('i');
    el.className = `aq-bubble ${depth}`;
    const size = depth === 'front' ? rnd(4.6, 10.5) : rnd(2.2, 6.2);
    setVars(el, {
      '--x': `${rnd(5, 95)}%`,
      '--top': `${rnd(62, 116)}%`,
      '--s': `${size.toFixed(1)}px`,
      '--drift': `${rnd(-22, 22).toFixed(1)}px`,
      '--dur': `${rnd(9, 22).toFixed(2)}s`,
      '--op': depth === 'front' ? rnd(.26, .40).toFixed(2) : rnd(.12, .26).toFixed(2)
    });
    el.style.animationDelay = `-${(index * .63 + rnd(0, 5)).toFixed(2)}s`;
    return el;
  }

  function makeDust(index) {
    const el = document.createElement('i');
    el.className = 'aq-dust';
    setVars(el, {
      '--x': `${rnd(2, 98)}%`,
      '--y': `${rnd(15, 88)}%`,
      '--s': `${rnd(1.1, 2.8).toFixed(1)}px`,
      '--dx': `${rnd(-28, 28).toFixed(1)}px`,
      '--dy': `${rnd(-34, 24).toFixed(1)}px`,
      '--dur': `${rnd(17, 36).toFixed(2)}s`,
      '--op': rnd(.07, .18).toFixed(2)
    });
    el.style.animationDelay = `-${(index * .41 + rnd(0, 8)).toFixed(2)}s`;
    return el;
  }

  function makeCreature(type, depth, index) {
    const el = document.createElement('i');
    const classMap = { shrimp: 'aq-small-shrimp', snail: 'aq-snail', fry: 'aq-small-shadow', benthic: 'aq-benthic' };
    el.className = `aq-creature ${classMap[type] || 'aq-small-shadow'}`;
    const widthMap = { shrimp: [13, 21], snail: [9, 16], fry: [8, 14], benthic: [20, 30] };
    const [minW, maxW] = widthMap[type] || [9, 16];
    const w = rnd(minW, maxW);
    setVars(el, {
      '--x': `${rnd(5, 90)}%`,
      '--b': `${rnd(8, depth === 'front' ? 88 : 62).toFixed(1)}px`,
      '--w': `${w.toFixed(1)}px`,
      '--h': `${(w * rnd(.34, .58)).toFixed(1)}px`,
      '--op': depth === 'front' ? rnd(.36, .54).toFixed(2) : rnd(.20, .38).toFixed(2),
      '--scale': depth === 'front' ? rnd(.92, 1.08).toFixed(2) : rnd(.68, .86).toFixed(2),
      '--dur': `${rnd(11, 21).toFixed(2)}s`
    });
    el.style.animationDelay = `-${(index * .77 + rnd(0, 4)).toFixed(2)}s`;
    return el;
  }

  function renderLayer() {
    if (state.busy) return;
    const aquarium = document.getElementById('aquarium');
    if (!aquarium) return;
    const zoneId = detectZoneId();
    const profile = PROFILES[zoneId] || PROFILES.utmul;
    const signature = `${zoneId}:${document.body.classList.contains('night') ? 'night' : 'day'}`;
    if (state.renderedKey === signature && document.getElementById('aqDepthRoot')) return;

    state.busy = true;
    try {
      aquarium.classList.remove('aq-zone-utmul', 'aq-zone-yeoul', 'aq-zone-janyeoul', 'aq-zone-gipmul', 'aq-zone-mulmoi');
      aquarium.classList.add(profile.cls);

      const root = ensureLayer('aqDepthRoot', 'aq-depth-root', aquarium);
      clear(root);

      const back = ensureLayer('aqDepthBack', 'aq-depth-layer aq-depth-back', root);
      const mid = ensureLayer('aqDepthMid', 'aq-depth-layer aq-depth-mid', root);
      const cBack = ensureLayer('aqCreatureBack', 'aq-depth-layer aq-depth-creature-back', root);
      const cFront = ensureLayer('aqCreatureFront', 'aq-depth-layer aq-depth-creature-front', root);
      const front = ensureLayer('aqDepthFront', 'aq-depth-layer aq-depth-front', root);
      const pFront = ensureLayer('aqParticleFront', 'aq-depth-layer aq-depth-particle-front', root);
      const ambient = ensureLayer('aqDepthAmbient', 'aq-depth-layer aq-depth-ambient', root);

      [back, mid, cBack, cFront, front, pFront, ambient].forEach(clear);

      for (let i = 0; i < profile.plantBack; i += 1) back.appendChild(makePlant('back', i));
      for (let i = 0; i < profile.stoneBack; i += 1) back.appendChild(makeStone('back'));
      for (let i = 0; i < profile.plantMid; i += 1) mid.appendChild(makePlant('mid', i));
      for (let i = 0; i < profile.stoneMid; i += 1) mid.appendChild(makeStone('mid'));
      for (let i = 0; i < profile.plantFront; i += 1) front.appendChild(makePlant('front', i));
      for (let i = 0; i < profile.stoneFront; i += 1) front.appendChild(makeStone('front'));
      for (let i = 0; i < profile.bubbleBack; i += 1) back.appendChild(makeBubble('back', i));
      for (let i = 0; i < profile.bubbleFront; i += 1) pFront.appendChild(makeBubble('front', i));
      for (let i = 0; i < profile.dust; i += 1) mid.appendChild(makeDust(i));

      let count = 0;
      Object.entries(profile.creatures).forEach(([type, qty]) => {
        for (let i = 0; i < qty; i += 1) {
          const layer = type === 'fry' || i % 3 === 0 ? cBack : cFront;
          layer.appendChild(makeCreature(type, layer === cFront ? 'front' : 'back', count));
          count += 1;
        }
      });

      state.renderedKey = signature;
      window.setTimeout(() => window.PondangFishDepthTuneV1?.apply?.(), 60);
    } finally {
      state.busy = false;
    }
  }

  function auditAquariumDepth() {
    renderLayer();
    const zoneId = detectZoneId();
    const profile = PROFILES[zoneId] || PROFILES.utmul;
    const ids = ['aqDepthRoot', 'aqDepthBack', 'aqDepthMid', 'aqCreatureBack', 'aqCreatureFront', 'aqDepthFront', 'aqParticleFront', 'aqDepthAmbient'];
    const layers = Object.fromEntries(ids.map((id) => [id, !!document.getElementById(id)]));
    const counts = {
      plants: document.querySelectorAll('.aq-plant').length,
      stones: document.querySelectorAll('.aq-stone').length,
      bubbles: document.querySelectorAll('.aq-bubble').length,
      dust: document.querySelectorAll('.aq-dust').length,
      creatures: document.querySelectorAll('.aq-creature').length,
      creatureBack: document.querySelectorAll('#aqCreatureBack .aq-creature').length,
      creatureFront: document.querySelectorAll('#aqCreatureFront .aq-creature').length,
      fish: document.querySelectorAll('.fish-root').length
    };
    return {
      zoneId,
      zoneLabel: profile.label,
      renderedKey: state.renderedKey,
      expectedProfile: profile,
      layers,
      counts,
      fishAudit: window.PondangFishDepthTuneV1?.audit ? window.PondangFishDepthTuneV1.audit() : null,
      note: '수족관 레이어·입체감 진단값입니다. counts가 과하면 다음 감산 대상입니다.'
    };
  }

  function scheduleRender(delay = 120) {
    window.clearTimeout(state.timer);
    state.timer = window.setTimeout(renderLayer, delay);
  }

  function boot() {
    ensureFishDepthTune();
    scheduleRender(80);
    window.setTimeout(() => scheduleRender(0), 420);
    document.addEventListener('click', () => scheduleRender(120), true);
    const target = document.getElementById('app') || document.body;
    const observer = new MutationObserver(() => scheduleRender(180));
    observer.observe(target, { childList: true, subtree: true, attributes: true, characterData: true });
    window.PondangAquariumDepthV1 = { render: renderLayer, profiles: PROFILES, audit: auditAquariumDepth };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
