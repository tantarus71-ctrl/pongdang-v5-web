/* 퐁당퐁당 곤지암천 v30A-1 - 수족관 레이어·입체감 고도화 1차 */
(() => {
  'use strict';

  const PROFILES = {
    utmul: { label: '웃물', cls: 'aq-zone-utmul', plantBack: 4, plantMid: 6, plantFront: 3, stoneBack: 4, stoneMid: 7, stoneFront: 2, bubbleBack: 5, bubbleFront: 3, dust: 12, creatures: { shrimp: 3, snail: 3, fry: 2, benthic: 0 } },
    yeoul: { label: '여울', cls: 'aq-zone-yeoul', plantBack: 2, plantMid: 4, plantFront: 2, stoneBack: 6, stoneMid: 10, stoneFront: 2, bubbleBack: 7, bubbleFront: 5, dust: 16, creatures: { shrimp: 2, snail: 2, fry: 1, benthic: 0 } },
    janyeoul: { label: '잔여울', cls: 'aq-zone-janyeoul', plantBack: 7, plantMid: 11, plantFront: 5, stoneBack: 3, stoneMid: 7, stoneFront: 2, bubbleBack: 4, bubbleFront: 3, dust: 14, creatures: { shrimp: 3, snail: 3, fry: 2, benthic: 0 } },
    gipmul: { label: '깊물', cls: 'aq-zone-gipmul', plantBack: 3, plantMid: 5, plantFront: 2, stoneBack: 7, stoneMid: 11, stoneFront: 3, bubbleBack: 3, bubbleFront: 2, dust: 10, creatures: { shrimp: 1, snail: 2, fry: 1, benthic: 1 } },
    mulmoi: { label: '물모이', cls: 'aq-zone-mulmoi', plantBack: 6, plantMid: 9, plantFront: 4, stoneBack: 5, stoneMid: 9, stoneFront: 3, bubbleBack: 6, bubbleFront: 4, dust: 18, creatures: { shrimp: 3, snail: 4, fry: 3, benthic: 0 } }
  };

  const ZONE_BY_LABEL = {
    '웃물': 'utmul',
    '여울': 'yeoul',
    '잔여울': 'janyeoul',
    '깊물': 'gipmul',
    '물모이': 'mulmoi'
  };

  const state = { renderedKey: '', busy: false };
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
    const baseHeight = depth === 'front' ? rnd(70, 132) : depth === 'mid' ? rnd(42, 96) : rnd(24, 64);
    const baseWidth = depth === 'front' ? rnd(8, 14) : depth === 'mid' ? rnd(5, 10) : rnd(3, 7);
    setVars(el, {
      '--x': `${rnd(4, 94)}%`,
      '--w': `${baseWidth}px`,
      '--h': `${baseHeight}px`,
      '--tilt': rnd(1.2, 3.8).toFixed(2),
      '--dur': `${rnd(5.8, 11.5).toFixed(2)}s`,
      '--drift': `${rnd(-4, 4).toFixed(1)}px`,
      '--leaf': `${rnd(22, 42).toFixed(1)}deg`,
      '--op': depth === 'front' ? rnd(.56, .75).toFixed(2) : depth === 'back' ? rnd(.28, .45).toFixed(2) : rnd(.46, .68).toFixed(2),
      '--scale': depth === 'front' ? rnd(1.02, 1.18).toFixed(2) : depth === 'back' ? rnd(.72, .88).toFixed(2) : rnd(.9, 1.02).toFixed(2)
    });
    el.style.animationDelay = `-${(index * .47 + rnd(0, 3)).toFixed(2)}s`;
    return el;
  }

  function makeStone(depth) {
    const el = document.createElement('i');
    el.className = `aq-stone ${depth}`;
    const width = depth === 'front' ? rnd(38, 92) : depth === 'mid' ? rnd(28, 74) : rnd(18, 54);
    setVars(el, {
      '--x': `${rnd(2, 92)}%`,
      '--w': `${width}px`,
      '--ratio': rnd(.34, .54).toFixed(2),
      '--op': depth === 'front' ? rnd(.56, .78).toFixed(2) : depth === 'back' ? rnd(.28, .48).toFixed(2) : rnd(.45, .70).toFixed(2),
      '--blur': depth === 'back' ? '.42px' : '0px'
    });
    return el;
  }

  function makeBubble(depth, index) {
    const el = document.createElement('i');
    el.className = `aq-bubble ${depth}`;
    const size = depth === 'front' ? rnd(5, 13) : rnd(2.4, 7);
    setVars(el, {
      '--x': `${rnd(5, 95)}%`,
      '--top': `${rnd(60, 116)}%`,
      '--s': `${size.toFixed(1)}px`,
      '--drift': `${rnd(-28, 28).toFixed(1)}px`,
      '--dur': `${rnd(8, 20).toFixed(2)}s`,
      '--op': depth === 'front' ? rnd(.32, .48).toFixed(2) : rnd(.14, .30).toFixed(2)
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
      '--s': `${rnd(1.2, 3.2).toFixed(1)}px`,
      '--dx': `${rnd(-34, 34).toFixed(1)}px`,
      '--dy': `${rnd(-42, 26).toFixed(1)}px`,
      '--dur': `${rnd(15, 34).toFixed(2)}s`,
      '--op': rnd(.08, .22).toFixed(2)
    });
    el.style.animationDelay = `-${(index * .41 + rnd(0, 8)).toFixed(2)}s`;
    return el;
  }

  function makeCreature(type, depth, index) {
    const el = document.createElement('i');
    const classMap = { shrimp: 'aq-small-shrimp', snail: 'aq-snail', fry: 'aq-small-shadow', benthic: 'aq-benthic' };
    el.className = `aq-creature ${classMap[type] || 'aq-small-shadow'}`;
    const widthMap = { shrimp: [15, 25], snail: [10, 18], fry: [10, 18], benthic: [22, 34] };
    const [minW, maxW] = widthMap[type] || [10, 18];
    const w = rnd(minW, maxW);
    setVars(el, {
      '--x': `${rnd(5, 90)}%`,
      '--b': `${rnd(8, depth === 'front' ? 96 : 70).toFixed(1)}px`,
      '--w': `${w.toFixed(1)}px`,
      '--h': `${(w * rnd(.34, .58)).toFixed(1)}px`,
      '--op': depth === 'front' ? rnd(.46, .66).toFixed(2) : rnd(.26, .45).toFixed(2),
      '--scale': depth === 'front' ? rnd(1, 1.18).toFixed(2) : rnd(.72, .9).toFixed(2),
      '--dur': `${rnd(10, 19).toFixed(2)}s`
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

  function scheduleRender() {
    window.setTimeout(renderLayer, 80);
    window.setTimeout(renderLayer, 420);
  }

  function boot() {
    ensureFishDepthTune();
    scheduleRender();
    document.addEventListener('click', scheduleRender, true);
    const target = document.getElementById('app') || document.body;
    const observer = new MutationObserver(() => scheduleRender());
    observer.observe(target, { childList: true, subtree: true, attributes: true, characterData: true });
    window.PondangAquariumDepthV1 = { render: renderLayer, profiles: PROFILES };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
