(() => {
  const AS = '../assets/fish/';
  const RIG = `${AS}beodeulchi/`;
  const IMG = `${RIG}beodeulchi_side_right.png?v=16`;
  const aq = document.getElementById('aq');
  const fx = document.getElementById('fx');
  const fl = document.getElementById('fishLayer');
  const hint = document.getElementById('hint');
  const icon = document.getElementById('icon');
  const nameEl = document.getElementById('nm');
  const textEl = document.getElementById('tx');
  const reportText = document.getElementById('rp');
  const report = document.getElementById('report');
  const card = document.querySelector('.card');
  const pop = document.getElementById('pop');
  const zones = [...document.querySelectorAll('.zones button')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const txt = {
    fish: '\uBC84\uB4E4\uCE58',
    zone: '\uC6C3\uBB3C',
    observe: '\uAD00\uCC30',
    newLabel: 'NEW',
    none: '\uC544\uC9C1 \uC5C6\uC74C',
    size: '6~10cm',
    copy: '\uB9D1\uC740 \uC6C3\uBB3C\uACFC \uC5EC\uC6B8\uC758 \uC911\uCE35\uC5D0\uC11C \uC870\uC2EC\uC2A4\uB7FD\uAC8C \uBB34\uB9AC \uC9C0\uC5B4 \uC6C0\uC9C1\uC774\uB294 \uD1A0\uC885 \uCE5C\uAD6C\uC608\uC694.',
    cardCopy: '\uB9D1\uC740 \uC5EC\uC6B8\uC5D0\uC11C \uCC9C\uCC9C\uD788 \uD5E4\uC5C4\uCE58\uB294 \uB300\uD45C \uCE5C\uAD6C\uC608\uC694.',
    habitat: '\uC911\uCE35~\uC0C1\uCE35',
    found: '\uCC3E\uC558\uB2E4!',
    near: '\uAC00\uAE4C\uC774 \uB2E4\uAC00\uC628 \uBC84\uB4E4\uCE58\uB97C \uC870\uC2EC\uD788 \uAD00\uCC30\uD574\uC694.',
    frontHint: '\uC120\uBA85\uD574\uC9C4 \uBC84\uB4E4\uCE58\uB9CC \uB20C\uB7EC\uC11C \uBC1C\uACAC\uD574\uC694.',
    report: '\uBC1C\uACAC\uD55C \uCE5C\uAD6C',
    zoneWait: '\uC774 \uAD6C\uAC04\uC758 \uC5B4\uC885\uC740 \uB2E4\uC74C \uB2E8\uACC4\uC5D0\uC11C \uB530\uB85C \uC124\uC815\uD574\uC694.',
    zoneReady: '\uC5B4\uC885\uC740 \uBCC4\uB3C4\uB85C \uC900\uBE44 \uC911\uC774\uC5D0\uC694.',
    food: '\uAC00\uAE4C\uC774 \uC628 \uCE5C\uAD6C\uB4E4\uC774 \uC870\uC2EC\uC2A4\uB7FD\uAC8C \uBC18\uC751\uD574\uC694.',
    explore: '\uC55E\uCABD\uC73C\uB85C \uCC9C\uCC9C\uD788 \uB2E4\uAC00\uC624\uB294 \uBC84\uB4E4\uCE58\uB97C \uCC3E\uC544\uBD10\uC694.',
    book: '\uB3C4\uAC10 \uCE74\uB4DC\uB85C \uCE5C\uAD6C\uB97C \uBE44\uAD50\uD574\uC694.',
    pass: '\uAC80\uC218 \uD1B5\uACFC',
    needsCheck: '\uC810\uAC80 \uD544\uC694',
  };

  const laneY = [25, 32, 39, 46, 53, 60];
  const school = [];
  const seen = new Set();
  const asset = { loaded: 0, fallback: 0 };
  let activeId = null;
  let lastActiveId = null;
  let nextFrontAt = 0;
  let lastTs = 0;
  let rafId = 0;
  let zone = txt.zone;

  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeTo = (v, target, k, dt) => lerp(v, target, 1 - Math.exp(-k * dt));
  const signOr = (value, fallback) => (Math.abs(value) < 0.001 ? fallback : Math.sign(value));
  const pickPattern = () => {
    const r = Math.random();
    if (r < 0.4) return 'circle';
    if (r < 0.65) return 'ellipse';
    if (r < 0.85) return 'sCurve';
    return 'glide';
  };
  const rigAssets = {
    body: {
      side_right: `${RIG}beodeulchi_side_right.png?v=16`,
      quarter_right: `${RIG}beodeulchi_quarter_right.png?v=16`,
      front_angle: `${RIG}beodeulchi_front_angle.png?v=16`,
      quarter_left: `${RIG}beodeulchi_quarter_left.png?v=16`,
      side_left: `${RIG}beodeulchi_side_left.png?v=16`,
    },
    tail: {
      right: [
        `${RIG}beodeulchi_tail_left.png?v=16`,
        `${RIG}beodeulchi_tail_idle.png?v=16`,
        `${RIG}beodeulchi_tail_right.png?v=16`,
      ],
      left: [
        `${RIG}beodeulchi_tail_left.png?v=16`,
        `${RIG}beodeulchi_tail_idle.png?v=16`,
        `${RIG}beodeulchi_tail_right.png?v=16`,
      ],
    },
    fin: {
      idle: `${RIG}beodeulchi_fin_idle.png?v=16`,
      turn_left: `${RIG}beodeulchi_fin_turn_left.png?v=16`,
      turn_right: `${RIG}beodeulchi_fin_turn_right.png?v=16`,
    },
  };

  function injectEcologyCss() {
    if (document.getElementById('beodeulchi-live-engine-css')) return;
    const s = document.createElement('style');
    s.id = 'beodeulchi-live-engine-css';
    s.textContent = `
      .eco-mote{position:absolute;z-index:4;width:var(--s);height:var(--s);left:var(--x);top:var(--y);border-radius:50%;background:rgba(222,255,238,.42);box-shadow:0 0 8px rgba(190,255,230,.28);opacity:var(--o);pointer-events:none;animation:ecoDrift var(--d) ease-in-out infinite alternate;animation-delay:var(--delay)}
      @keyframes ecoDrift{to{transform:translate(var(--dx),var(--dy));opacity:calc(var(--o) * .55)}}
      .fish{transition:none!important}
      .fish-rig{position:absolute;inset:0;pointer-events:none;transform-origin:50% 50%;transition:none!important}
      .fish-rig img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:none!important}
      .fish-body{z-index:2}
      .fish-tail{z-index:3;opacity:.28;mix-blend-mode:normal}
      .fish-fin{z-index:4;opacity:.5}
      .fish[data-front="true"] img{filter:drop-shadow(0 12px 18px rgba(0,12,18,.55)) drop-shadow(0 0 12px rgba(215,255,235,.24))}
      .fish[data-clickable="true"]::after{content:'';position:absolute;inset:-9px;border-radius:999px;border:1px solid rgba(244,255,202,.28);box-shadow:0 0 18px rgba(244,255,202,.22);pointer-events:none;animation:discoverPulse 1.5s ease-in-out infinite}
      @keyframes discoverPulse{50%{transform:scale(1.07);opacity:.55}100%{transform:scale(1);opacity:1}}
    `;
    document.head.appendChild(s);
  }

  function loadFishAssets() {
    const urls = [
      ...Object.values(rigAssets.body),
      ...rigAssets.tail.right,
      ...rigAssets.tail.left,
      ...Object.values(rigAssets.fin),
    ];
    urls.forEach((src) => {
      const img = new Image();
      img.onload = () => { asset.loaded += 1; };
      img.onerror = () => { asset.fallback += 1; };
      img.src = src;
    });
  }

  function say(text) {
    hint.textContent = text;
    hint.style.opacity = 1;
    clearTimeout(say.t);
    say.t = setTimeout(() => { hint.style.opacity = 0; }, 1700);
  }

  function ecologyLayer() {
    if (fx.dataset.liveReady) return;
    fx.dataset.liveReady = 1;
    for (let i = 0; i < 20; i += 1) {
      const b = document.createElement('i');
      b.className = 'bubble';
      b.style.setProperty('--x', `${4 + Math.random() * 92}%`);
      b.style.setProperty('--s', `${3 + Math.random() * 6}px`);
      b.style.setProperty('--d', `${5 + Math.random() * 7}s`);
      b.style.setProperty('--delay', `${-Math.random() * 8}s`);
      b.style.setProperty('--m', `${Math.random() * 32 - 16}px`);
      fx.appendChild(b);
    }
    for (let i = 0; i < 34; i += 1) {
      const m = document.createElement('i');
      m.className = 'eco-mote';
      m.style.setProperty('--x', `${rnd(2, 98)}%`);
      m.style.setProperty('--y', `${rnd(6, 92)}%`);
      m.style.setProperty('--s', `${rnd(1.2, 3.8)}px`);
      m.style.setProperty('--o', `${rnd(0.18, 0.6).toFixed(2)}`);
      m.style.setProperty('--d', `${rnd(5, 13).toFixed(2)}s`);
      m.style.setProperty('--delay', `${rnd(-10, 0).toFixed(2)}s`);
      m.style.setProperty('--dx', `${rnd(-16, 18).toFixed(1)}px`);
      m.style.setProperty('--dy', `${rnd(-8, 10).toFixed(1)}px`);
      fx.appendChild(m);
    }
  }

  function makeFish(i) {
    const dir = Math.random() > 0.5 ? 1 : -1;
    const depth = rnd(0.4, 0.7);
    const fish = {
      id: `beodeulchi-${i}`,
      el: null,
      img: null,
      bodyEl: null,
      tailEl: null,
      finEl: null,
      bodyFrame: '',
      tailFrame: 0,
      tailSrc: '',
      finFrame: 'idle',
      currentFrame: '',
      x: dir > 0 ? rnd(-24, 35) : rnd(65, 124),
      y: laneY[i % laneY.length] + rnd(-1.2, 1.2),
      baseY: laneY[i % laneY.length],
      lane: i % laneY.length,
      laneBias: (i - 2.5) * 1.35,
      personalSpace: rnd(18, 24),
      facing: dir,
      desiredFacing: dir,
      vx: dir * rnd(2.4, 4.6),
      vy: rnd(-0.35, 0.35),
      targetX: dir > 0 ? rnd(42, 92) : rnd(8, 58),
      targetY: laneY[i % laneY.length] + rnd(-4, 4),
      targetSpeed: rnd(2.4, 5.2),
      targetRefreshAt: performance.now() + rnd(1800, 4200),
      returnUntil: 0,
      pattern: pickPattern(),
      patternUntil: performance.now() + rnd(7000, 15000),
      orbitCx: rnd(28, 72),
      orbitCy: rnd(38, 56),
      orbitRx: rnd(16, 34),
      orbitRy: rnd(7, 18),
      orbitAngle: rnd(0, Math.PI * 2),
      orbitDir: Math.random() > 0.5 ? 1 : -1,
      curveBias: rnd(-1, 1),
      depth,
      targetDepth: depth,
      phase: rnd(0, Math.PI * 2),
      finPhase: rnd(0, Math.PI * 2),
      pauseUntil: 0,
      cooldownUntil: 0,
      avoidY: 0,
      avoidX: 0,
      avoidDepth: 0,
      avoidVx: 0,
      avoidVy: 0,
      overlapCooldownUntil: 0,
      turn: 0,
      turnFrom: dir,
      turnTo: dir,
      turnUntil: 0,
      turnStart: 0,
      turnCooldownUntil: 0,
      flipAt: 0.58,
      turnLean: 0,
      visualX: null,
      visualY: null,
      visualWidth: null,
      visualOpacity: null,
      visualBlur: null,
      visualTilt: 0,
      visualWag: 0,
      visualFlex: 1,
      active: false,
      clickedAwayUntil: 0,
    };
    return fish;
  }

  function resetSchool() {
    cancelAnimationFrame(rafId);
    fl.innerHTML = '';
    school.length = 0;
    activeId = null;
    lastActiveId = null;
    nextFrontAt = performance.now() + 1200;
    for (let i = 0; i < 6; i += 1) {
      const f = makeFish(i);
      const e = document.createElement('button');
      e.type = 'button';
      e.className = 'fish fish-beodeulchi';
      e.dataset.fishId = f.id;
      e.dataset.species = 'beodeulchi';
      e.setAttribute('aria-label', `${txt.fish} ${txt.observe}`);
      e.innerHTML = `<span class="fish-rig"><img class="fish-body" src="${rigAssets.body.side_right}" alt="${txt.fish}" data-asset="beodeulchi-body-v16"><img class="fish-tail" src="${rigAssets.tail.right[1]}" alt="" aria-hidden="true"><img class="fish-fin" src="${rigAssets.fin.idle}" alt="" aria-hidden="true"></span>`;
      f.el = e;
      f.img = e.querySelector('.fish-body');
      f.bodyEl = e.querySelector('.fish-body');
      f.tailEl = e.querySelector('.fish-tail');
      f.finEl = e.querySelector('.fish-fin');
      e.onclick = (ev) => handleFishClick(ev, f);
      fl.appendChild(e);
      school.push(f);
    }
    selectSpecies(false);
    lastTs = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function selectSpecies(discovered = true) {
    if (discovered) seen.add('beodeulchi');
    icon.innerHTML = `<img src="${IMG}" alt="${txt.fish}" data-asset="beodeulchi-body-v16">`;
    const img = icon.querySelector('img');
    img.onload = () => { asset.loaded += 1; };
    img.onerror = () => { asset.fallback += 1; };
    nameEl.innerHTML = `${txt.fish} \u00B7 ${zone}${seen.has('beodeulchi') ? `<span class="badge">${txt.observe}</span>` : `<span class="badge">${txt.newLabel}</span>`}`;
    textEl.textContent = `${txt.size} \u00B7 ${txt.copy}`;
    updateReport();
    if (discovered) showFound();
  }

  function updateReport() {
    const discovered = seen.has('beodeulchi');
    reportText.innerHTML = `${txt.report} ${discovered ? 1 : 0}/1\uC885 \u00B7 ${discovered ? txt.fish : txt.none}<div class="meter"><i class="${discovered ? 'on' : ''}"></i><i></i><i></i><i></i></div>`;
  }

  function showFound() {
    card.classList.remove('is-discovered');
    void card.offsetWidth;
    card.classList.add('is-discovered');
    setTimeout(() => card.classList.remove('is-discovered'), 1250);
    pop.textContent = `${txt.found} ${txt.fish}`;
    pop.classList.remove('show');
    void pop.offsetWidth;
    pop.classList.add('show');
    say(txt.near);
  }

  function releaseActive(f, now) {
    f.active = false;
    f.clickedAwayUntil = now + 2100;
    f.cooldownUntil = now + 5000 + rnd(900, 2800);
    chooseTarget(f, 'retreat');
    activeId = null;
    lastActiveId = f.id;
    nextFrontAt = now + rnd(2700, 5200);
  }

  function chooseTarget(f, mode = 'cruise') {
    const marginX = mode === 'front' ? [28, 72] : [7, 93];
    const middleY = mode === 'front' ? [36, 62] : [28, 68];
    if (mode === 'return') {
      f.targetX = f.x < 50 ? rnd(28, 54) : rnd(46, 72);
      f.targetY = clamp(rnd(34, 60) + f.laneBias * 0.45, 30, 66);
      f.targetDepth = rnd(0.46, 0.7);
      f.targetSpeed = rnd(2.4, 4.4);
      f.targetRefreshAt = performance.now() + rnd(2400, 4200);
      f.returnUntil = performance.now() + 2600;
      return;
    }
    if (mode === 'retreat') {
      f.targetX = f.x + f.facing * rnd(18, 34);
      if (f.targetX > 96) f.targetX = rnd(54, 86);
      if (f.targetX < 4) f.targetX = rnd(14, 46);
      f.targetY = clamp(rnd(32, 62) + f.laneBias * 0.5, 30, 66);
      f.targetDepth = rnd(0.4, 0.58);
      f.targetSpeed = rnd(3.2, 5.2);
      f.targetRefreshAt = performance.now() + rnd(1800, 3600);
      return;
    }
    const now = performance.now();
    if (mode !== 'front' && now > f.patternUntil) {
      f.pattern = pickPattern();
      f.patternUntil = now + rnd(7000, 16000);
      f.orbitCx = rnd(24, 76);
      f.orbitCy = rnd(38, 56);
      f.orbitRx = rnd(15, 34);
      f.orbitRy = rnd(7, 18);
      f.orbitDir = Math.random() > 0.5 ? 1 : -1;
      f.curveBias = rnd(-1, 1);
    }

    if (mode === 'front') {
      f.targetX = rnd(marginX[0], marginX[1]);
      f.targetY = rnd(middleY[0], middleY[1]);
    } else if (f.pattern === 'circle' || f.pattern === 'ellipse') {
      const arc = f.pattern === 'circle' ? rnd(0.52, 0.95) : rnd(0.42, 0.82);
      f.orbitAngle += f.orbitDir * arc;
      const rx = f.pattern === 'circle' ? (f.orbitRx + f.orbitRy) * 0.52 : f.orbitRx;
      const ry = f.pattern === 'circle' ? (f.orbitRx + f.orbitRy) * 0.34 : f.orbitRy;
      f.targetX = f.orbitCx + Math.cos(f.orbitAngle) * rx + rnd(-3.2, 3.2);
      f.targetY = f.orbitCy + Math.sin(f.orbitAngle) * ry + rnd(-2.4, 2.4);
    } else if (f.pattern === 'sCurve') {
      const step = f.facing * rnd(17, 31);
      f.targetX = f.x + step;
      f.targetY = 48 + Math.sin(now * 0.0011 + f.phase + f.curveBias) * rnd(9, 17) + rnd(-3, 3);
    } else {
      f.targetX = f.x + f.facing * rnd(12, 24) + rnd(-4, 4);
      f.targetY = f.y + rnd(-8, 8);
    }

    f.targetX = clamp(f.targetX, marginX[0], marginX[1]);
    f.targetY = clamp(f.targetY + (mode === 'front' ? 0 : f.laneBias * 0.42), middleY[0], middleY[1]);
    f.targetDepth = mode === 'front' ? rnd(0.87, 0.95) : rnd(0.4, 0.74);
    if (mode !== 'front' && (f.pattern === 'circle' || f.pattern === 'ellipse')) {
      f.targetDepth = clamp(0.54 + Math.sin(f.orbitAngle + f.phase) * 0.12 + rnd(-0.04, 0.04), 0.4, 0.74);
    }
    f.targetSpeed = mode === 'front' ? rnd(1.5, 2.9) : rnd(2.0, 4.8);
    f.targetRefreshAt = now + (mode === 'front' ? rnd(1700, 3200) : rnd(1800, 4300));
  }

  function beginTurn(f, desiredFacing, now) {
    if (f.desiredFacing === desiredFacing && f.turn > 0) return;
    if (now < f.turnCooldownUntil) return;
    f.desiredFacing = desiredFacing;
    f.turnFrom = f.facing;
    f.turnTo = desiredFacing;
    f.turnStart = now;
    f.turnUntil = now + rnd(1050, 1550);
    f.turnCooldownUntil = now + 1800;
    f.flipAt = rnd(0.55, 0.65);
    f.turn = 0.01;
  }

  function chooseActive(now) {
    if (activeId || now < nextFrontAt) return;
    const centered = school.filter((f) => f.cooldownUntil < now && f.id !== lastActiveId && f.x > 18 && f.x < 82 && f.y > 28 && f.y < 60);
    const fallback = school.filter((f) => f.cooldownUntil < now && f.x > 12 && f.x < 88);
    const candidates = centered.length ? centered : fallback;
    if (!candidates.length) return;
    const f = candidates[Math.floor(Math.random() * candidates.length)];
    activeId = f.id;
    f.active = true;
    chooseTarget(f, 'front');
    say(txt.frontHint);
  }

  function ripple(ev, e) {
    const lr = fl.getBoundingClientRect();
    const tr = e.getBoundingClientRect();
    const x = ev && ev.clientX ? ev.clientX - lr.left : tr.left + tr.width / 2 - lr.left;
    const y = ev && ev.clientY ? ev.clientY - lr.top : tr.top + tr.height / 2 - lr.top;
    const r = document.createElement('i');
    r.className = 'ripple';
    r.style.left = `${x}px`;
    r.style.top = `${y}px`;
    fl.appendChild(r);
    setTimeout(() => r.remove(), 900);
  }

  function isCentral(f) {
    return f.x > 27 && f.x < 73 && f.y > 28 && f.y < 60;
  }

  function isClickable(f) {
    return f.active && f.depth > 0.84 && isCentral(f);
  }

  function handleFishClick(ev, f) {
    if (!isClickable(f)) return;
    selectSpecies(true);
    ripple(ev, f.el);
    releaseActive(f, performance.now());
  }

  function avoid(dt, now = performance.now()) {
    const pushFish = (f, xDir, yDir, push, activeYield = false) => {
      const laneRestore = clamp((f.baseY + f.laneBias - f.targetY) * 0.08, -1.2, 1.2);
      const xPower = activeYield ? 8.8 : 4.2;
      const yPower = activeYield ? 18 : 8.5;
      f.avoidX += xDir * push * xPower;
      f.avoidY += (yDir * push * yPower) + laneRestore;
      f.avoidDepth -= push * (activeYield ? 0.28 : 0.08);
      f.avoidVx += xDir * push * (activeYield ? 2.8 : 1.25);
      f.avoidVy += yDir * push * (activeYield ? 2.4 : 1.15);
      f.targetSpeed *= activeYield ? 0.94 : 0.975;
      f.overlapCooldownUntil = now + (activeYield ? 1250 : 850);
      f.targetRefreshAt = Math.max(f.targetRefreshAt, now + rnd(650, 1250));
    };

    school.forEach((f) => {
      f.avoidX = 0;
      f.avoidY = 0;
      f.avoidDepth = 0;
      f.avoidVx = 0;
      f.avoidVy = 0;
    });
    for (let i = 0; i < school.length; i += 1) {
      for (let j = i + 1; j < school.length; j += 1) {
        const a = school[i];
        const b = school[j];
        const dx = (a.x - b.x) * 1.45;
        const dy = a.y - b.y;
        const depthGap = Math.abs(a.depth - b.depth);
        const dist = Math.hypot(dx, dy);
        const minDist = Math.max(
          a.personalSpace,
          b.personalSpace,
          17 + (a.depth + b.depth) * 5.6 + (a.active || b.active ? 8 : 0) - Math.min(depthGap * 18, 5),
        );
        if (dist >= minDist) continue;
        const push = clamp((minDist - Math.max(dist, 0.1)) / minDist, 0, 1);
        const aAwayX = a.x <= b.x ? -1 : 1;
        const aAwayY = a.y <= b.y ? -1 : 1;
        const bAwayX = -aAwayX;
        const bAwayY = -aAwayY;
        if (a.active) {
          pushFish(b, bAwayX, bAwayY, push, true);
        } else if (b.active) {
          pushFish(a, aAwayX, aAwayY, push, true);
        } else {
          pushFish(a, aAwayX, aAwayY, push, false);
          pushFish(b, bAwayX, bAwayY, push, false);
        }
      }
    }
    school.forEach((f) => {
      const yMin = f.active ? 36 : 28;
      const yMax = f.active ? 62 : 68;
      f.targetX = clamp(easeTo(f.targetX, f.targetX + f.avoidX, 1.8, dt), 6, 94);
      f.targetY = clamp(easeTo(f.targetY, f.targetY + f.avoidY, 2.1, dt), yMin, yMax);
      f.targetDepth = clamp(f.targetDepth + f.avoidDepth, 0.34, f.active ? 0.96 : 0.74);
      f.vx = clamp(f.vx + f.avoidVx * dt, -7.2, 7.2);
      f.vy = clamp(f.vy + f.avoidVy * dt, -4.8, 4.8);
    });
  }

  function keepInHabitat(f) {
    const outsideSoft = f.x < 2 || f.x > 98 || f.y < 28 || f.y > 68;
    const outsideHard = f.x < -14 || f.x > 114 || f.y < 24 || f.y > 72;
    if (outsideSoft && performance.now() > f.returnUntil) {
      chooseTarget(f, 'return');
    }
    if (outsideHard) {
      f.x = clamp(f.x, -14, 114);
      f.y = clamp(f.y, 26, 70);
      chooseTarget(f, 'return');
    }
    if (f.y < 26) f.y = 26;
    if (f.y > 70) f.y = 70;
  }

  function updateTurnFrame(f) {
    if (f.turn <= 0) {
      return f.facing > 0 ? 'side_right' : 'side_left';
    }
    const seqRightToLeft = ['side_right', 'quarter_right', 'front_angle', 'quarter_left', 'side_left'];
    const seqLeftToRight = ['side_left', 'quarter_left', 'front_angle', 'quarter_right', 'side_right'];
    const seq = f.turnFrom > 0 && f.turnTo < 0 ? seqRightToLeft : seqLeftToRight;
    const idx = clamp(Math.floor(f.turn * seq.length), 0, seq.length - 1);
    return seq[idx];
  }

  function updateTailFrame(f, now) {
    const speedFactor = clamp(Math.abs(f.vx) / 5.5, 0, 1);
    const turnBoost = f.turn > 0 ? 0.38 : 0;
    const rate = 0.0022 + speedFactor * 0.0014 + turnBoost * 0.001;
    const wave = Math.sin(now * rate + f.phase);
    if (wave < -0.28) return 0;
    if (wave > 0.28) return 2;
    return 1;
  }

  function updateFinFrame(f) {
    if (f.turn <= 0) return 'idle';
    return f.turnTo > 0 ? 'turn_right' : 'turn_left';
  }

  function renderFish(f, frame, tailFrame, finFrame, width, opacity, blur, tilt, wag, flex, active, clickable, dt) {
    if (f.bodyFrame !== frame) {
      f.bodyFrame = frame;
      f.currentFrame = frame;
      f.bodyEl.src = rigAssets.body[frame];
    }
    if (f.tailFrame !== tailFrame) {
      f.tailFrame = tailFrame;
    }
    const tailSide = frame.includes('left') ? 'left' : 'right';
    const tailSrc = rigAssets.tail[tailSide][tailFrame];
    if (f.tailSrc !== tailSrc) {
      f.tailSrc = tailSrc;
      f.tailEl.src = tailSrc;
    }
    if (f.finFrame !== finFrame) {
      f.finFrame = finFrame;
      f.finEl.src = rigAssets.fin[finFrame];
    }

    f.visualX = f.visualX === null ? f.x : easeTo(f.visualX, f.x, 8.2, dt);
    f.visualY = f.visualY === null ? f.y : easeTo(f.visualY, f.y, 8.2, dt);
    f.visualWidth = f.visualWidth === null ? width : easeTo(f.visualWidth, width, 5.2, dt);
    f.visualOpacity = f.visualOpacity === null ? opacity : easeTo(f.visualOpacity, opacity, 4.6, dt);
    f.visualBlur = f.visualBlur === null ? blur : easeTo(f.visualBlur, blur, 4.8, dt);
    f.visualTilt = easeTo(f.visualTilt, tilt, 5.5, dt);
    f.visualWag = easeTo(f.visualWag, wag, 6.2, dt);
    f.visualFlex = easeTo(f.visualFlex, flex, 5.4, dt);

    f.el.classList.toggle('is-clickable', clickable);
    f.el.dataset.front = active ? 'true' : 'false';
    f.el.dataset.clickable = clickable ? 'true' : 'false';
    f.el.style.left = `${f.visualX.toFixed(2)}%`;
    f.el.style.top = `${f.visualY.toFixed(2)}%`;
    f.el.style.width = `${f.visualWidth.toFixed(2)}px`;
    f.el.style.opacity = f.visualOpacity.toFixed(3);
    f.el.style.zIndex = String(Math.round(24 + f.depth * 92 + (active ? 70 : 0)));
    f.el.style.pointerEvents = clickable ? 'auto' : 'none';
    f.el.style.filter = `blur(${f.visualBlur.toFixed(2)}px) saturate(${(0.78 + f.depth * 0.48).toFixed(2)}) brightness(${(0.78 + f.depth * 0.35).toFixed(2)})`;
    f.el.style.transform = `translate3d(-50%, -50%, 0) rotate(${f.visualTilt.toFixed(2)}deg) translateY(${f.visualWag.toFixed(2)}px) scaleY(${f.visualFlex.toFixed(3)})`;
  }

  function updateFish(f, dt, now) {
    const active = f.id === activeId;
    f.active = active;

    const dx = f.targetX - f.x;
    const dy = f.targetY - f.y;
    const dist = Math.hypot(dx * 1.45, dy);
    const separating = now < f.overlapCooldownUntil;
    if (!separating && (dist < (active ? 7 : 9) || now > f.targetRefreshAt || (!active && now > f.cooldownUntil && Math.random() < dt * 0.035))) {
      chooseTarget(f, active ? 'front' : 'cruise');
    }
    if (!active && now > f.pauseUntil && Math.random() < dt * 0.11) {
      f.pauseUntil = now + rnd(400, 1200);
    }
    if (f.clickedAwayUntil > now) {
      f.targetDepth = Math.min(f.targetDepth, 0.55);
    }

    f.depth = easeTo(f.depth, f.targetDepth, active ? 1.55 : 0.58, dt);
    const steerX = f.targetX - f.x;
    const steerY = (f.targetY - f.y) * 0.62;
    const steerLen = Math.max(0.001, Math.hypot(steerX, steerY));
    const deadZoneX = active ? 6.2 : 7.5;
    const returning = now < f.returnUntil;
    const hysteresisX = returning ? 5.5 : (active ? 9.5 : 11);
    const desiredFacing = Math.abs(steerX) > hysteresisX ? signOr(steerX, f.facing) : f.facing;
    if (desiredFacing !== f.facing && Math.abs(steerX) > hysteresisX) beginTurn(f, desiredFacing, now);

    if (f.turn > 0) {
      f.turn = clamp((now - f.turnStart) / Math.max(1, f.turnUntil - f.turnStart), 0, 1);
      if (f.turn >= f.flipAt && f.facing !== f.desiredFacing) {
        f.facing = f.desiredFacing;
        f.turnCooldownUntil = now + 1300;
      }
      if (f.turn >= 1) {
        f.facing = f.desiredFacing;
        f.turn = 0;
      }
    }

    const turnSlow = f.turn > 0 ? lerp(1, 0.42, Math.sin(Math.PI * clamp(f.turn, 0, 1))) : 1;
    const hesitate = now < f.pauseUntil ? 0.38 : 1;
    const stream = 1 + Math.sin(now * 0.001 + f.phase) * 0.12;
    const speed = f.targetSpeed * hesitate * stream * turnSlow * (reduce ? 0.25 : 1);
    const forwardNeed = Math.abs(steerX) < deadZoneX ? 0.18 : Math.min(1, Math.abs(steerX) / 22);
    const turningBeforeFlip = f.turn > 0 && f.facing !== f.desiredFacing;
    const forwardSpeed = turningBeforeFlip ? speed * 0.16 : speed * (0.36 + forwardNeed * 0.64);
    const desiredVx = f.facing * forwardSpeed;
    const desiredVy = (steerY / steerLen) * speed * 0.42;
    f.vx = easeTo(f.vx, desiredVx, active ? 0.86 : 0.62, dt);
    f.vy = easeTo(f.vy, desiredVy, active ? 0.72 : 0.54, dt);
    const glideY = Math.sin(now * 0.0012 + f.phase) * (active ? 0.12 : 0.22);
    f.x = lerp(f.x, f.x + f.vx * dt, 0.88);
    f.y = clamp(lerp(f.y, f.y + (f.vy + glideY) * dt, 0.86), active ? 36 : 28, active ? 62 : 68);
    keepInHabitat(f);

    const scale = 0.66 + f.depth * 0.6 + (active ? 0.08 : 0);
    const width = clamp(78 * scale, 56, active ? 148 : 116);
    const blur = Math.max(0, (0.84 - f.depth) * 3.7);
    const opacity = clamp(0.34 + f.depth * 0.78, 0.44, 1);
    const turnLean = f.turn > 0 ? Math.sin(Math.PI * f.turn) * -f.desiredFacing * 5.4 : 0;
    f.turnLean = easeTo(f.turnLean, turnLean, 3.2, dt);
    const tilt = clamp(f.vy * 1.5 + f.turnLean + Math.sin(now * 0.00125 + f.phase) * 0.45, -7, 7);
    const tailTarget = Math.sin(now * (0.0044 + Math.abs(f.vx) * 0.00056) + f.phase) * (active ? 0.62 : 1.08) * (f.turn > 0 ? 1.28 : 1);
    const flexTarget = 1 + Math.sin(now * 0.0032 + f.finPhase) * 0.0035 + (f.turn > 0 ? Math.sin(Math.PI * f.turn) * 0.005 : 0);
    const clickable = isClickable(f);
    renderFish(
      f,
      updateTurnFrame(f),
      updateTailFrame(f, now),
      updateFinFrame(f),
      width,
      opacity,
      blur,
      tilt,
      tailTarget,
      flexTarget,
      active,
      clickable,
      dt,
    );
  }

  function tick(ts) {
    const dt = clamp((ts - lastTs) / 1000, 0.001, 0.045);
    lastTs = ts;
    chooseActive(ts);
    avoid(dt, ts);
    school.forEach((f) => updateFish(f, dt, ts));
    if (!activeId && ts > nextFrontAt + 5600) nextFrontAt = ts + 900;
    rafId = requestAnimationFrame(tick);
  }

  function feed() {
    for (let i = 0; i < 9; i += 1) {
      const food = document.createElement('i');
      food.className = 'food';
      food.style.setProperty('--x', `${38 + Math.random() * 24}%`);
      aq.appendChild(food);
      setTimeout(() => food.remove(), 2400);
    }
    school.forEach((f, i) => {
      setTimeout(() => {
        f.targetSpeed = Math.min(f.targetSpeed + 0.9, 7);
        f.targetDepth = Math.max(f.targetDepth, 0.58);
      }, i * 120);
    });
    say(txt.food);
  }

  function setZone(nextZone) {
    zone = nextZone;
    resetSchool();
    say(`${zone} \uC218\uC871\uAD00\uC744 \uC5F4\uC5C8\uC5B4\uC694.`);
  }

  document.querySelectorAll('.dock button').forEach((b) => {
    b.onclick = () => {
      const mode = b.dataset.m;
      if (mode === 'friend') feed();
      if (mode === 'report') report.classList.toggle('show');
      if (mode === 'explore') say(txt.explore);
      if (mode === 'book') say(txt.book);
    };
  });

  zones.forEach((btn) => {
    btn.onclick = () => {
      zones.forEach((x) => x.classList.remove('on'));
      btn.classList.add('on');
      setZone(btn.textContent.trim());
    };
  });

  document.getElementById('audit').onclick = () => {
    say(window.PondangV5DiscoveryCardUXV4837.audit().ok ? txt.pass : txt.needsCheck);
  };

  window.PondangV5DiscoveryCardUXV4837 = {
    audit() {
      const clickable = [...document.querySelectorAll('.fish')].filter((e) => getComputedStyle(e).pointerEvents === 'auto');
      let overlaps = 0;
      for (let i = 0; i < school.length; i += 1) {
        for (let j = i + 1; j < school.length; j += 1) {
          const a = school[i];
          const b = school[j];
          const depthGap = Math.abs(a.depth - b.depth);
          const visualGap = Math.hypot((a.x - b.x) * 1.45, a.y - b.y);
          const minAuditGap = 13 + (a.depth + b.depth) * 3.6 - Math.min(depthGap * 14, 4);
          if (visualGap < minAuditGap) overlaps += 1;
        }
      }
      const problems = [];
      if (school.length < 3) problems.push('school too small');
      if (clickable.length > 1) problems.push('multiple clickable fish');
      if (clickable.some((e) => e.dataset.fishId !== activeId)) problems.push('background fish is clickable');
      if (overlaps > 0) problems.push('overlap risk');
      return {
        version: 'v4.8.37-rigged-beodeulchi-v16',
        ok: problems.length === 0,
        zone,
        fishCount: school.length,
        activeFront: activeId,
        clickableCount: clickable.length,
        overlapRisk: overlaps,
        assetLoaded: asset.loaded,
        assetFallback: asset.fallback,
        problems,
      };
    },
    run() { return this.audit(); },
    triggerFeeding: feed,
  };

  loadFishAssets();
  injectEcologyCss();
  ecologyLayer();
  resetSchool();
})();
