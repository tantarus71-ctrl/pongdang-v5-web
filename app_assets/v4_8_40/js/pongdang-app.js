// 퐁당퐁당 v4.8.40 경량 앱 모듈
// 한글 주석: 메뉴, 도감, 팝업, 물고기 유영을 HTML에서 분리해 오류 가능성을 낮춘다.

import { ZONES, MENU, FISH } from './pongdang-data.js';

const state = {
  zone: 'upper',
  mode: 'day',
  selectedFish: null,
  raf: null,
  tick: 0
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
  const visible = FISH.filter((fish) => fish.zone === state.zone);
  layer.innerHTML = visible.map((fish) => `
    <button type="button" class="fish" data-fish="${fish.id}" style="left:${fish.x}%;top:${fish.y}%" aria-label="${fish.name} 보기">
      <img src="${fish.img}" alt="${fish.name}" loading="eager" decoding="async">
    </button>
  `).join('');
  $$('.fish', layer).forEach((btn) => {
    btn.addEventListener('click', () => openFish(btn.dataset.fish));
  });
}

function animateFish() {
  const fishes = $$('.fish');
  state.tick += 0.01;
  fishes.forEach((btn, index) => {
    const fish = fishById(btn.dataset.fish);
    const driftX = Math.sin(state.tick * 1.4 + index) * 7;
    const driftY = Math.cos(state.tick * 1.1 + index) * 5;
    const scale = fish.scale + Math.sin(state.tick + index) * 0.04;
    btn.style.transform = `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(${scale})`;
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
