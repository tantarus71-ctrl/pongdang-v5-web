/* 퐁당퐁당 곤지암천 v30A-1 - 메뉴 기능 안정화 및 활성화 가드 */
(() => {
  'use strict';

  const CSS_ID = 'menuSafetyGuardV1Css';
  const CSS_HREF = './src/styles/menu-safety-guard-v1.css?v=menu-safety-v1';
  const PANEL_IDS = {
    explore: 'explorePanel',
    dex: 'dexPanel',
    mission: 'missionPanel',
    camera: 'cameraPanel'
  };
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

  const state = { activeMenu: null };
  const $ = (id) => document.getElementById(id);

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
    chip.textContent = '메뉴 활성화';
    app.appendChild(chip);
  }

  function setShown(el, shown) {
    if (!el) return;
    el.classList.toggle('show', Boolean(shown));
    el.setAttribute('aria-hidden', shown ? 'false' : 'true');
  }

  function closeKnownOverlays(exceptId = '') {
    [
      'featurePanel', 'explorePanel', 'dexPanel', 'missionPanel', 'cameraPanel',
      'popup', 'cardDetail', 'captureGallery', 'captureDetail', 'gpsGuide'
    ].forEach((id) => {
      if (id !== exceptId) setShown($(id), false);
    });
    const gpsBackdrop = $('gpsGuideBackdrop');
    if (gpsBackdrop) gpsBackdrop.setAttribute('aria-hidden', 'true');
  }

  function openMenu(menu) {
    const panelId = PANEL_IDS[menu];
    const panel = panelId ? $(panelId) : null;
    state.activeMenu = menu;

    document.querySelectorAll('.nav-btn[data-menu]').forEach((btn) => {
      const active = btn.dataset.menu === menu;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (panel) {
      closeKnownOverlays(panelId);
      setShown(panel, true);
      return;
    }
    closeKnownOverlays('featurePanel');
    setShown($('featurePanel'), true);
  }

  function closeMenu(menu) {
    if (menu && PANEL_IDS[menu]) setShown($(PANEL_IDS[menu]), false);
    else closeKnownOverlays();
    document.querySelectorAll('.nav-btn[data-menu]').forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    state.activeMenu = null;
  }

  function toggleMenu(menu) {
    const panel = PANEL_IDS[menu] ? $(PANEL_IDS[menu]) : $('featurePanel');
    if (state.activeMenu === menu && panel?.classList.contains('show')) closeMenu(menu);
    else openMenu(menu);
  }

  function wireNavButtons() {
    document.querySelectorAll('.nav-btn[data-menu]').forEach((button) => {
      if (button.dataset.menuSafetyReady === 'true') return;
      button.dataset.menuSafetyReady = 'true';
      button.setAttribute('role', 'button');
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', (event) => {
        const menu = button.dataset.menu;
        if (!menu) return;
        event.preventDefault();
        event.stopPropagation();
        toggleMenu(menu);
      }, true);
    });
  }

  function wireCloseButtons() {
    const closeMap = {
      featureClose: () => closeKnownOverlays(),
      exploreClose: () => closeMenu('explore'),
      dexClose: () => closeMenu('dex'),
      missionClose: () => closeMenu('mission'),
      cameraClose: () => closeMenu('camera'),
      closePopup: () => setShown($('popup'), false),
      detailClose: () => setShown($('cardDetail'), false),
      detailClose2: () => setShown($('cardDetail'), false),
      captureGalleryClose: () => setShown($('captureGallery'), false),
      captureDetailClose: () => setShown($('captureDetail'), false),
      captureDetailClose2: () => setShown($('captureDetail'), false),
      gpsGuideClose: () => setShown($('gpsGuide'), false),
      cancelGpsBtn: () => setShown($('gpsGuide'), false)
    };

    Object.entries(closeMap).forEach(([id, handler]) => {
      const el = $(id);
      if (!el || el.dataset.menuSafetyReady === 'true') return;
      el.dataset.menuSafetyReady = 'true';
      el.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        handler();
      }, true);
    });
  }

  function wireFeatureAction() {
    const action = $('featureAction');
    if (!action || action.dataset.menuSafetyReady === 'true') return;
    action.dataset.menuSafetyReady = 'true';
    action.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openMenu(state.activeMenu || 'explore');
    }, true);
  }

  function wirePanelActionButtons() {
    const gps = $('openGpsGuide');
    if (gps && gps.dataset.menuSafetyReady !== 'true') {
      gps.dataset.menuSafetyReady = 'true';
      gps.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setShown($('gpsGuide'), true);
        const backdrop = $('gpsGuideBackdrop');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
      }, true);
    }

    const gallery = $('openCaptureGallery');
    if (gallery && gallery.dataset.menuSafetyReady !== 'true') {
      gallery.dataset.menuSafetyReady = 'true';
      gallery.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setShown($('captureGallery'), true);
      }, true);
    }
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
      active: btn.classList.contains('active'),
      pointerEvents: window.getComputedStyle(btn).pointerEvents,
      visible: btn.getBoundingClientRect().width > 0 && btn.getBoundingClientRect().height > 0
    }));
    const panels = Object.fromEntries(Object.entries(PANEL_IDS).map(([menu, id]) => [menu, {
      id,
      exists: Boolean($(id)),
      shown: Boolean($(id)?.classList.contains('show'))
    }]));
    const overlayPointers = Array.from(document.querySelectorAll('.aq-depth-root,.aq-depth-layer,.aq-polish-root,.zone-overlay-root,.aq-plant,.aq-stone,.aq-bubble,.aq-creature')).slice(0, 30).map((el) => ({
      className: el.className || el.id,
      pointerEvents: window.getComputedStyle(el).pointerEvents,
      zIndex: window.getComputedStyle(el).zIndex
    }));
    return {
      required,
      navButtons,
      panels,
      overlayPointerSample: overlayPointers,
      activeMenu: state.activeMenu,
      note: '메뉴 클릭 안정화 진단값입니다. overlay pointerEvents는 none이어야 하고 nav/zone 버튼은 auto여야 합니다.'
    };
  }

  function boot() {
    loadCssOnce();
    installChip();
    wireNavButtons();
    wireCloseButtons();
    wireFeatureAction();
    wirePanelActionButtons();
    window.PondangMenuSafetyV1 = { openMenu, closeMenu, toggleMenu, audit: auditMenuSafety };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
