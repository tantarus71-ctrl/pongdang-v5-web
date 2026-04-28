/* 퐁당퐁당 곤지암천 v30A-1 - 메뉴 링크 활성화 안전 보강 */
(() => {
  'use strict';

  const PANEL_IDS = {
    explore: 'explorePanel',
    dex: 'dexPanel',
    mission: 'missionPanel',
    camera: 'cameraPanel'
  };

  const FEATURE_COPY = {
    explore: { icon: '🧭', title: '탐사', sub: '곤지암천 5존을 골라 탐사해요' },
    dex: { icon: '🐟', title: '도감', sub: '발견한 물고기 카드를 확인해요' },
    mission: { icon: '🎯', title: '미션', sub: '오늘의 관찰 과제를 확인해요' },
    camera: { icon: '📷', title: '카메라', sub: '관찰 장면을 기록해요' }
  };

  const state = { activeMenu: null };
  const $ = (id) => document.getElementById(id);

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

  function updateFeaturePanel(menu) {
    const copy = FEATURE_COPY[menu] || FEATURE_COPY.explore;
    const icon = $('featureIcon');
    const title = $('featureTitle');
    const sub = $('featureSub');
    const body = $('featureBody');
    const action = $('featureAction');

    if (icon) icon.textContent = copy.icon;
    if (title) title.textContent = copy.title;
    if (sub) sub.textContent = copy.sub;
    if (body && !body.children.length) {
      body.innerHTML = [
        '<div class="feature-row"><em>💧</em><div><b>5존 탐사</b><small>웃물·여울·잔여울·깊물·물모이</small></div></div>',
        '<div class="feature-row"><em>🐟</em><div><b>물고기 관찰</b><small>앞으로 온 물고기를 눌러 자세히 보기</small></div></div>',
        '<div class="feature-row"><em>🔊</em><div><b>설명 듣기</b><small>아이 눈높이 생태 설명</small></div></div>'
      ].join('');
    }
    if (action) action.textContent = `${copy.title} 열기`;
  }

  function openMenu(menu) {
    const panelId = PANEL_IDS[menu];
    const panel = panelId ? $(panelId) : null;
    state.activeMenu = menu;

    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.menu === menu);
      btn.setAttribute('aria-pressed', btn.dataset.menu === menu ? 'true' : 'false');
    });

    if (panel) {
      closeKnownOverlays(panelId);
      setShown(panel, true);
    } else {
      closeKnownOverlays('featurePanel');
      updateFeaturePanel(menu);
      setShown($('featurePanel'), true);
    }
  }

  function closeMenu(menu) {
    if (menu && PANEL_IDS[menu]) setShown($(PANEL_IDS[menu]), false);
    else closeKnownOverlays();
    document.querySelectorAll('.nav-btn').forEach((btn) => {
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
      if (button.dataset.menuGuardReady === 'true') return;
      button.dataset.menuGuardReady = 'true';
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
      if (!el || el.dataset.menuGuardReady === 'true') return;
      el.dataset.menuGuardReady = 'true';
      el.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        handler();
      }, true);
    });
  }

  function wireFeatureAction() {
    const action = $('featureAction');
    if (!action || action.dataset.menuGuardReady === 'true') return;
    action.dataset.menuGuardReady = 'true';
    action.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const menu = state.activeMenu || 'explore';
      if (PANEL_IDS[menu]) openMenu(menu);
    }, true);
  }

  function wirePanelActionButtons() {
    const gps = $('openGpsGuide');
    if (gps && gps.dataset.menuGuardReady !== 'true') {
      gps.dataset.menuGuardReady = 'true';
      gps.addEventListener('click', (event) => {
        event.preventDefault();
        setShown($('gpsGuide'), true);
        const backdrop = $('gpsGuideBackdrop');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
      }, true);
    }

    const gallery = $('openCaptureGallery');
    if (gallery && gallery.dataset.menuGuardReady !== 'true') {
      gallery.dataset.menuGuardReady = 'true';
      gallery.addEventListener('click', (event) => {
        event.preventDefault();
        setShown($('captureGallery'), true);
      }, true);
    }
  }

  function auditMenus() {
    const result = {
      navButtons: Array.from(document.querySelectorAll('.nav-btn[data-menu]')).map((btn) => btn.dataset.menu),
      panels: Object.fromEntries(Object.entries(PANEL_IDS).map(([menu, id]) => [menu, Boolean($(id))])),
      closeButtons: ['featureClose', 'exploreClose', 'dexClose', 'missionClose', 'cameraClose'].reduce((acc, id) => {
        acc[id] = Boolean($(id));
        return acc;
      }, {})
    };
    window.PondangMenuActivationAudit = () => result;
    return result;
  }

  function boot() {
    wireNavButtons();
    wireCloseButtons();
    wireFeatureAction();
    wirePanelActionButtons();
    auditMenus();
    window.PondangMenuGuard = { openMenu, closeMenu, toggleMenu, audit: auditMenus };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
