// 퐁당퐁당 v4.8.40 경량 앱 모듈
// 한글 주석: 메뉴, 도감, 팝업, 물고기 유영을 HTML에서 분리해 오류 가능성을 낮춘다.

import { ZONES, MENU, FISH } from './pongdang-data.js';

const state = {
  zone: 'upper',
  mode: 'day',
  selectedFish: null,
  raf: null,
  tick: 0,
  fishRuntime: new Map(),
  fishViews: new Map()
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function zoneById(id) {
  return ZONES.find((zone) => zone.id === id) || ZONES[0];
}

function fishById(id) {
  return FISH.find((fish) => fish.id === id) || FISH[0];
}

function safeSetText(selector, text) {
  const el = $(selector);
  if (el) el.textContent = text;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fishDepth(fish) {
  return clamp(Number(fish.depth ?? 0.55), 0.15, 0.95);
}

function seededUnit(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

function runtimeForFish(fish, index = 0) {
  const key = fish.instanceKey || fish.id;
  if (!state.fishRuntime.has(key)) {
    const seed = seededUnit(`${fish.id}:${index}`);
    state.fishRuntime.set(key, {
      seed,
      speedJitter: 0.86 + seed * 0.32,
      curvePhase: seed * Math.PI * 2,
      avoidX: 0,
      avoidY: 0
    });
  }
  return state.fishRuntime.get(key);
}

function aquariumFishViews(fishes) {
  return fishes.flatMap((fish) => {
    const instances = Array.isArray(fish.aquariumInstances) && fish.aquariumInstances.length ? fish.aquariumInstances : [{}];
    return instances.map((instance, index) => ({
      ...fish,
      ...instance,
      id: fish.id,
      speciesId: fish.id,
      name: fish.name,
      summary: fish.summary,
      kid: fish.kid,
      teacher: fish.teacher,
      img: fish.img,
      cardImg: fish.cardImg,
      popupImg: fish.popupImg,
      sprites: fish.sprites,
      swim: { ...(fish.swim || {}), ...(instance.swim || {}) },
      instanceKey: `${fish.id}:${instance.instanceId || index}`
    }));
  });
}

function spriteAt(sprite, frame = 0) {
  if (Array.isArray(sprite)) return sprite[Math.abs(frame) % sprite.length] || '';
  return sprite || '';
}

function frameForFish(fish, t) {
  const tailRate = Number(fish.swim?.tailRate ?? 7);
  return Math.floor(t * tailRate) % 3;
}

function getFishSprite(fish, dx, turn, frame = 0) {
  const sprites = fish.sprites || {};
  if (dx >= 0) {
    const sprite = turn > 0.58 ? (sprites.frontRight || sprites.right || fish.img) : (sprites.right || fish.img);
    return spriteAt(sprite, frame) || fish.img;
  }
  const sprite = turn < -0.58 ? (sprites.frontLeft || sprites.left || fish.img) : (sprites.left || fish.img);
  return spriteAt(sprite, frame) || fish.img;
}

function initialFishSprite(fish) {
  return spriteAt(fish.sprites?.right, 1) || fish.img;
}

function applyFishDepth(btn, img, fish) {
  const depth = fishDepth(fish);
  const clarity = 0.72 + depth * 0.28;
  const blur = (1 - depth) * 1.2;
  const shadow = 10 + depth * 16;
  btn.style.zIndex = String(Math.round(depth * 100));
  btn.dataset.depth = depth.toFixed(2);
  img.style.opacity = clarity.toFixed(2);
  img.style.setProperty('filter', `saturate(${(0.86 + depth * 0.22).toFixed(2)}) brightness(${(0.88 + depth * 0.16).toFixed(2)}) blur(${blur.toFixed(2)}px) drop-shadow(0 ${Math.round(shadow * 0.42)}px ${Math.round(shadow)}px rgba(0,0,0,.24))`, 'important');
}

function renderZones() {
  const zoneBar = $('#zoneBar');
  if (!zoneBar) return;
  zoneBar.innerHTML = ZONES.map((zone) => `
    <button type="button" class="chip ${zone.id === state.zone ? 'active' : ''}" data-zone="${zone.id}" aria-label="${zone.name} 보기">
      ${zone.emoji} ${zone.name}
    </button>
  `).join('');
  $$('.chip[data-zone]', zoneBar).forEach((btn) => {
    btn.addEventListener('click', () => {
      state.zone = btn.dataset.zone;
      updateHero();
      renderZones();
      renderFish();
    });
  });
}

function renderModeButtons() {
  const modeBar = $('#modeBar');
  if (!modeBar) return;
  modeBar.innerHTML = `
    <button type="button" class="chip ${state.mode === 'day' ? 'active' : ''}" data-mode="day">☀️ 낮물</button>
    <button type="button" class="chip ${state.mode === 'night' ? 'active' : ''}" data-mode="night">🌙 밤물</button>
  `;
  $$('.chip[data-mode]', modeBar).forEach((btn) => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      document.body.dataset.waterMode = state.mode;
      renderModeButtons();
    });
  });
}

function renderMenu() {
  const nav = $('#bottomNav');
  if (!nav) return;
  nav.innerHTML = MENU.map((item) => `
    <button type="button" class="navBtn" id="${item.buttonId}" data-menu="${item.id}" aria-label="${item.label} · ${item.sub}">
      <span class="navEmoji" aria-hidden="true">${item.emoji}</span>
      <span class="navText">${item.label}</span>
      <span class="navSub">${item.sub}</span>
    </button>
  `).join('');
  $('#openGuide')?.addEventListener('click', () => closePanels());
  $('#openBook')?.addEventListener('click', () => openSheet('bookSheet'));
  $('#openRare')?.addEventListener('click', () => openSheet('rareSheet'));
  $('#openCamera')?.addEventListener('click', () => openSheet('cameraSheet'));
}

function updateHero() {
  const zone = zoneById(state.zone);
  safeSetText('#heroTitle', zone.title);
  safeSetText('#heroSub', zone.desc);
}

function renderFish() {
  const layer = $('#fishLayer');
  if (!layer) return;
  const visible = aquariumFishViews(FISH.filter((fish) => fish.zone === state.zone));
  state.fishRuntime.clear();
  state.fishViews.clear();
  layer.innerHTML = visible.map((fish, index) => `
    <button type="button" class="fish" data-fish="${fish.speciesId}" data-instance="${fish.instanceKey}" data-depth="${fish.depth ?? 0.55}" style="left:${fish.x}%;top:${fish.y}%" aria-label="${fish.name} 보기">
      <img class="fishSprite" src="${initialFishSprite(fish)}" alt="${fish.name}" loading="eager" decoding="async">
      ${fish.sprites?.fins ? `<img class="fishFinLayer" src="${spriteAt(fish.sprites.fins, index)}" alt="" aria-hidden="true" loading="eager" decoding="async">` : ''}
    </button>
  `).join('');
  $$('.fish', layer).forEach((btn, index) => {
    const fish = visible[index] || fishById(btn.dataset.fish);
    state.fishViews.set(btn.dataset.instance || btn.dataset.fish, fish);
    runtimeForFish(fish, index);
    const img = $('.fishSprite', btn);
    if (img) applyFishDepth(btn, img, fish);
    const fin = $('.fishFinLayer', btn);
    if (fin) applyFishDepth(btn, fin, fish);
    btn.addEventListener('click', () => openFish(btn.dataset.fish));
  });
}

function animateFish() {
  const fishes = $$('.fish');
  state.tick += 0.01;
  fishes.forEach((btn, index) => {
    const fish = state.fishViews.get(btn.dataset.instance || btn.dataset.fish) || fishById(btn.dataset.fish);
    const runtime = runtimeForFish(fish, index);
    const swim = fish.swim || {};
    const depth = fishDepth(fish);
    const phase = Number(swim.phase ?? index);
    const speed = Number(fish.speed ?? 1) * runtime.speedJitter;
    const t = state.tick * speed + phase;
    const idleEvery = Number(swim.idleEvery ?? 9);
    const idleHold = Number(swim.idleHold ?? 1.1);
    const idleWave = ((t + runtime.seed * idleEvery) % idleEvery);
    const idle = idleWave < idleHold ? 0.38 + idleWave / idleHold * 0.24 : 1;
    const xAmp = Number(swim.xAmp ?? 10) * (0.65 + depth * 0.55);
    const yAmp = Number(swim.yAmp ?? 5) * (0.75 + depth * 0.35);
    let avoidX = 0;
    let avoidY = 0;
    const avoidRadius = Number(swim.avoidRadius ?? 120);
    fishes.forEach((other, otherIndex) => {
      if (other === btn) return;
      const ox = Number(other.style.left.replace('%', '')) || 50;
      const oy = Number(other.style.top.replace('%', '')) || 50;
      const sx = Number(btn.style.left.replace('%', '')) || 50;
      const sy = Number(btn.style.top.replace('%', '')) || 50;
      const dxp = sx - ox;
      const dyp = sy - oy;
      const dist = Math.max(0.01, Math.hypot(dxp, dyp));
      const push = Math.max(0, (avoidRadius / 10 - dist)) / (avoidRadius / 10);
      avoidX += (dxp / dist) * push * (otherIndex + 1);
      avoidY += (dyp / dist) * push * (otherIndex + 1);
    });
    runtime.avoidX = runtime.avoidX * 0.88 + avoidX * 0.12;
    runtime.avoidY = runtime.avoidY * 0.88 + avoidY * 0.12;
    const curveX = Math.sin(t * 0.34 + runtime.curvePhase) * xAmp * 0.7;
    const curveY = Math.cos(t * 0.29 + runtime.curvePhase) * yAmp * 0.85;
    const driftX = (Math.sin(t * 1.35) * xAmp + curveX + runtime.avoidX * 10) * idle;
    const driftY = (Math.cos(t * 1.05) * yAmp + Math.sin(t * 2.1) * 2 + curveY + runtime.avoidY * 8) * idle;
    const dx = Math.cos(t * 1.35);
    const turn = Math.sin(t * 0.72);
    const roll = Math.sin(t * 1.9) * Number(swim.roll ?? 2);
    const breathe = Math.sin(t * Number(swim.tailRate ?? 7)) * 0.018 * idle;
    const scale = (fish.scale || 1) * (0.78 + depth * 0.38) + breathe;
    const img = $('.fishSprite', btn);
    if (img) {
      const frame = frameForFish(fish, t);
      const blinkClosed = Math.sin(t * 0.55 + runtime.curvePhase) > 0.992;
      const nextSprite = blinkClosed && fish.sprites?.blinkClosed ? fish.sprites.blinkClosed : getFishSprite(fish, dx, turn, frame);
      if (nextSprite && img.getAttribute('src') !== nextSprite) img.setAttribute('src', nextSprite);
      img.style.transform = `rotate(${(roll * idle).toFixed(2)}deg) scaleX(${(1 + Math.sin(t * 7) * 0.018 * idle).toFixed(3)})`;
    }
    const fin = $('.fishFinLayer', btn);
    if (fin && fish.sprites?.fins) {
      const finFrame = Math.floor(t * 5) % fish.sprites.fins.length;
      const nextFin = spriteAt(fish.sprites.fins, finFrame);
      if (nextFin && fin.getAttribute('src') !== nextFin) fin.setAttribute('src', nextFin);
      fin.style.transform = `rotate(${(Math.sin(t * 5.4) * 2.4 * idle).toFixed(2)}deg)`;
    }
    btn.style.transform = `translate(calc(-50% + ${driftX.toFixed(2)}px), calc(-50% + ${driftY.toFixed(2)}px)) scale(${scale.toFixed(3)})`;
  });
  state.raf = requestAnimationFrame(animateFish);
}

function renderCards() {
  const grid = $('#cardGrid');
  if (!grid) return;
  grid.innerHTML = FISH.map((fish) => `
    <button type="button" class="card" data-fish="${fish.id}">
      <img src="${fish.cardImg}" alt="${fish.name} 카드" loading="lazy" decoding="async">
      <span>
        <span class="cardTitle">${fish.name}</span>
        <span class="cardSub">${fish.summary}</span>
      </span>
    </button>
  `).join('');
  $$('.card', grid).forEach((card) => {
    card.addEventListener('click', () => openFish(card.dataset.fish));
  });
}

function openFish(id) {
  const fish = fishById(id);
  state.selectedFish = id;
  safeSetText('#modalTitle', fish.name);
  safeSetText('#modalSub', fish.summary);
  safeSetText('#modalInfo', fish.kid);
  const img = $('#modalImg');
  if (img) {
    img.src = fish.popupImg || fish.cardImg || fish.img;
    img.alt = fish.name;
  }
  openModal();
}

function openSheet(id) {
  closePanels();
  const sheet = document.getElementById(id);
  if (!sheet) return;
  document.body.dataset.appMode = 'sheet';
  sheet.classList.add('show');
  sheet.setAttribute('aria-hidden', 'false');
}

function closePanels() {
  document.body.dataset.appMode = 'aquarium';
  $$('.sheet.show').forEach((sheet) => {
    sheet.classList.remove('show');
    sheet.setAttribute('aria-hidden', 'true');
  });
  closeModal(false);
}

function openModal() {
  const modal = $('#fishModal');
  if (!modal) return;
  document.body.dataset.appMode = 'modal';
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(resetMode = true) {
  const modal = $('#fishModal');
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  if (resetMode) document.body.dataset.appMode = 'aquarium';
}

function bindCloseButtons() {
  $$('[data-close]').forEach((btn) => btn.addEventListener('click', closePanels));
  $('#closeModal')?.addEventListener('click', () => closeModal(true));
  $('#fishModal')?.addEventListener('click', (event) => {
    if (event.target.id === 'fishModal') closeModal(true);
  });
}

function bindKeyboard() {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePanels();
  });
}

function init() {
  document.body.dataset.appMode = 'aquarium';
  document.body.dataset.waterMode = state.mode;
  renderMenu();
  renderZones();
  renderModeButtons();
  updateHero();
  renderFish();
  renderCards();
  bindCloseButtons();
  bindKeyboard();
  animateFish();
}

init();
