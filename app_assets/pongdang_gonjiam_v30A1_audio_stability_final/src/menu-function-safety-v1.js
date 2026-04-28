/* 퐁당퐁당 곤지암천 v30A-1 - 메뉴 기능 안정화 가드 */
(() => {
  'use strict';

  const CSS_ID = 'menuSafetyGuardV1Css';
  const CSS_HREF = './src/styles/menu-safety-guard-v1.css?v=menu-safety-v1';
  const REQUIRED = [
    ['audioBtn', '상단 음성'],
    ['modeBtn', '낮밤 전환'],
    ['fullBtn', '전체화면'],
    ['zoneStrip', '존 선택'],
    ['featurePanel', '기능 패널'],
    ['explorePanel', '탐사 패널'],
    ['dexPanel', '도감 패널'],
    ['missionPanel', '미션 패널'],
    ['cameraPanel', '카메라 패널'],
    ['audioPanel', '음성 패널'],
    ['fishLayer', '물고기 레이어'],
    ['aquarium', '수족관']
  ];

  function loadCssOnce() {
    if (document.getElementById(CSS_ID)) return;
    const link = document.createElement('link');
    link.id = CSS_ID;
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    document.head.appendChild(link);
  }

  function installChip() {
    if (document.getElementById('menuSafetyChip')) return;
    const app = document.getElementById('app');
    if (!app) return;
    const chip = document.createElement('div');
    chip.id = 'menuSafetyChip';
    chip.className = 'menu-safety-chip';
    chip.textContent = '메뉴 클릭 가드';
    app.appendChild(chip);
  }

  function getElementState(id, label) {
    const el = document.getElementById(id);
    if (!el) return { id, label, exists: false };
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      id,
      label,
      exists: true,
      visible: rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden',
      pointerEvents: style.pointerEvents,
      zIndex: style.zIndex,
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
    };
  }

  function auditMenuSafety() {
    const required = REQUIRED.map(([id, label]) => getElementState(id, label));
    const navButtons = Array.from(document.querySelectorAll('.nav-btn')).map((btn) => ({
      menu: btn.dataset.menu || btn.textContent.trim(),
      pointerEvents: window.getComputedStyle(btn).pointerEvents,
      visible: btn.getBoundingClientRect().width > 0 && btn.getBoundingClientRect().height > 0
    }));
    const zoneButtons = Array.from(document.querySelectorAll('.zone-btn')).map((btn) => ({
      text: btn.textContent.trim(),
      active: btn.classList.contains('active'),
      pointerEvents: window.getComputedStyle(btn).pointerEvents,
      visible: btn.getBoundingClientRect().width > 0 && btn.getBoundingClientRect().height > 0
    }));
    const overlayPointers = Array.from(document.querySelectorAll('.aq-depth-root,.aq-depth-layer,.aq-polish-root,.zone-overlay-root,.aq-plant,.aq-stone,.aq-bubble,.aq-creature')).slice(0, 30).map((el) => ({
      className: el.className || el.id,
      pointerEvents: window.getComputedStyle(el).pointerEvents,
      zIndex: window.getComputedStyle(el).zIndex
    }));
    return {
      required,
      navButtons,
      zoneButtons,
      overlayPointerSample: overlayPointers,
      aquariumAudit: window.PondangAquariumDepthV1?.audit ? window.PondangAquariumDepthV1.audit() : null,
      fishAudit: window.PondangFishDepthTuneV1?.audit ? window.PondangFishDepthTuneV1.audit() : null,
      note: '메뉴 클릭 안정화 진단값입니다. overlay pointerEvents는 none이어야 하고 nav/zone 버튼은 auto여야 합니다.'
    };
  }

  function boot() {
    loadCssOnce();
    installChip();
    window.PondangMenuSafetyV1 = { audit: auditMenuSafety };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
