/*
  퐁당퐁당 v4.8.38 실제 반영용 런타임 UI 패치
  목적: 기존 index.html 구조를 직접 파괴하지 않고, 메뉴 이모지/수족관 크기/반응형 배치를 안전하게 적용한다.
  연결 위치: app_assets/index.html의 </body> 직전
  <script src="patches/v4_8_38_apply_responsive_ui.js" defer></script>
*/
(function () {
  'use strict';

  const PATCH_ID = 'v4.8.38-responsive-aquarium-ui-runtime';
  const CSS_HREF = 'patches/v4_8_37_responsive_aquarium_ui.css';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function ensureStylesheet() {
    if (document.querySelector('link[data-pongdang-patch="v4.8.37-responsive-ui"]')) return true;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    link.dataset.pongdangPatch = 'v4.8.37-responsive-ui';
    document.head.appendChild(link);
    return true;
  }

  function setButtonMarkup(id, emoji, label, sub, isPrimary) {
    const btn = document.getElementById(id);
    if (!btn) return false;
    btn.classList.add('navBtn');
    if (isPrimary) btn.classList.add('navBtnPrimary');
    btn.setAttribute('aria-label', sub ? `${label} · ${sub}` : label);
    btn.innerHTML = [
      `<span class="navEmoji" aria-hidden="true">${emoji}</span>`,
      `<span class="navText">${label}</span>`,
      `<span class="navSub">${sub}</span>`
    ].join('');
    return true;
  }

  function upgradeBottomMenu() {
    const nav = document.querySelector('.bottomNav');
    if (!nav) return false;
    nav.dataset.pongdangMenu = 'v4.8.38';
    nav.setAttribute('aria-label', '퐁당퐁당 하단 메뉴');

    setButtonMarkup('openGuide', '🫧', '탐험', '물속보기', true);
    setButtonMarkup('openBook', '🐟', '도감', '친구보기', false);
    setButtonMarkup('openRare', '✨', '반짝', '희귀찾기', false);
    setButtonMarkup('openCamera', '📷', '카메라', '비춰보기', false);
    return true;
  }

  function normalizeZoneLabels() {
    const zoneNames = {
      upper: '웃물',
      riffle: '여울',
      run: '잔여울',
      pool: '깊물',
      confluence: '물모이'
    };
    document.querySelectorAll('[data-zone]').forEach((btn) => {
      const key = btn.dataset.zone;
      if (zoneNames[key]) btn.textContent = zoneNames[key];
    });
    return true;
  }

  function measureAndCalibrate() {
    const root = document.documentElement;
    const hero = document.querySelector('.heroCard');
    const dock = document.querySelector('.aquaControlDock');
    const nav = document.querySelector('.bottomNav');
    const status = document.querySelector('.aquaStatusLine');

    if (hero) root.style.setProperty('--hero-h', Math.ceil(hero.getBoundingClientRect().height) + 'px');
    if (dock) root.style.setProperty('--dock-h', Math.ceil(dock.getBoundingClientRect().height) + 'px');
    if (nav) root.style.setProperty('--bottom-nav-h', Math.ceil(nav.getBoundingClientRect().height) + 'px');
    if (status) root.style.setProperty('--status-h', Math.ceil(status.getBoundingClientRect().height) + 'px');

    document.body.dataset.pongdangViewport = window.innerWidth < 391
      ? 'phone-small'
      : window.innerWidth < 681
        ? 'phone'
        : window.innerWidth < 1024
          ? 'tablet'
          : 'desktop';

    return true;
  }

  function guardLayerPointerEvents() {
    const mode = document.body.dataset.appMode || 'aquarium';
    const nav = document.querySelector('.bottomNav');
    const dock = document.querySelector('.aquaControlDock');
    const fishLayer = document.querySelector('.fishLayer');
    if (mode === 'aquarium') {
      if (nav) nav.style.pointerEvents = 'auto';
      if (dock) dock.style.pointerEvents = 'auto';
      if (fishLayer) fishLayer.style.pointerEvents = 'none';
      document.querySelectorAll('.fishBtn').forEach((btn) => { btn.style.pointerEvents = 'auto'; });
    } else {
      if (nav) nav.style.pointerEvents = 'none';
      if (dock) dock.style.pointerEvents = 'none';
      document.querySelectorAll('.fishBtn').forEach((btn) => { btn.style.pointerEvents = 'none'; });
    }
    return true;
  }

  function installObservers() {
    const run = () => {
      measureAndCalibrate();
      guardLayerPointerEvents();
    };

    window.addEventListener('resize', run, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(run, 120), { passive: true });

    const bodyObserver = new MutationObserver(run);
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-app-mode']
    });

    const nav = document.querySelector('.bottomNav');
    if (nav && window.ResizeObserver) {
      const ro = new ResizeObserver(run);
      ro.observe(nav);
    }
    return true;
  }

  function applyPatch() {
    if (document.documentElement.dataset.pongdangPatchApplied === PATCH_ID) return true;
    document.documentElement.dataset.pongdangPatchApplied = PATCH_ID;

    ensureStylesheet();
    upgradeBottomMenu();
    normalizeZoneLabels();
    measureAndCalibrate();
    guardLayerPointerEvents();
    installObservers();

    setTimeout(measureAndCalibrate, 80);
    setTimeout(measureAndCalibrate, 260);
    setTimeout(measureAndCalibrate, 700);

    console.info('[Pongdang] v4.8.38 responsive UI patch applied');
    return true;
  }

  ready(applyPatch);
})();
