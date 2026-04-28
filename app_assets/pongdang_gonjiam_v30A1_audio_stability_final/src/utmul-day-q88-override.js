/* 퐁당퐁당 곤지암천 v30A-1 - 웃물 낮 q88 1슬롯 안전 override */
(() => {
  'use strict';

  const Q88_PATH = 'assets/bg_optimized/upper/day_941_q88.jpg';
  const Q88_URL = `./${Q88_PATH}?cache=q88-utmul-day-${Date.now()}`;
  const DEPTH_CSS = './src/styles/aquarium-layer-depth-v1.css?v=aq-depth-v1';
  const DEPTH_JS = './src/aquarium-layer-depth-v1.js?v=aq-depth-v1';

  function loadOnce(tagName, attrs, marker) {
    if (document.querySelector(`[data-loader-marker="${marker}"]`)) return;
    const node = document.createElement(tagName);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    node.dataset.loaderMarker = marker;
    document.head.appendChild(node);
  }

  function installDepthEnhancement() {
    loadOnce('link', { rel: 'stylesheet', href: DEPTH_CSS }, 'aq-depth-css-v1');
    loadOnce('script', { src: DEPTH_JS, defer: 'defer' }, 'aq-depth-js-v1');
  }

  function isNightMode() {
    return document.body.classList.contains('night') || document.documentElement.classList.contains('night') || document.getElementById('app')?.classList.contains('night');
  }

  function isUtmulActive() {
    const zoneDesc = document.getElementById('zoneDesc')?.textContent || '';
    const activeZone = document.querySelector('.zone-btn.active')?.textContent || '';
    return zoneDesc.includes('웃물') || activeZone.includes('웃물');
  }

  function applyQ88IfNeeded() {
    const bg = document.getElementById('bg');
    if (!bg) return;
    if (!isUtmulActive()) return;
    if (isNightMode()) return;
    bg.style.backgroundImage = `url("${Q88_URL}")`;
    bg.dataset.optimizedOverride = 'utmul-day-q88';
  }

  function installControls() {
    const chip = document.getElementById('debugChip');
    if (chip && !chip.dataset.q88Marked) {
      chip.textContent = `${chip.textContent} · q88 웃물낮 · 입체수조`;
      chip.dataset.q88Marked = 'true';
    }
  }

  function scheduleApply() {
    window.setTimeout(applyQ88IfNeeded, 0);
    window.setTimeout(applyQ88IfNeeded, 120);
    window.setTimeout(applyQ88IfNeeded, 500);
  }

  function boot() {
    installDepthEnhancement();
    installControls();
    scheduleApply();
    document.addEventListener('click', () => window.setTimeout(applyQ88IfNeeded, 80), true);
    const observer = new MutationObserver(() => applyQ88IfNeeded());
    const app = document.getElementById('app') || document.body;
    observer.observe(app, { attributes: true, childList: true, subtree: true, characterData: true });
    window.PondangUtmulDayQ88Override = { apply: applyQ88IfNeeded, path: Q88_PATH, depthEnhancement: true };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
