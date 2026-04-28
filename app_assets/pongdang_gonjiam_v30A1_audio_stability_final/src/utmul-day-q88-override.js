/* 퐁당퐁당 곤지암천 v30A-1 - 웃물 낮 q88 1슬롯 안전 override */
(() => {
  'use strict';

  const Q88_PATH = 'assets/bg_optimized/upper/day_941_q88.jpg';
  const Q88_URL = `./${Q88_PATH}?cache=q88-utmul-day-${Date.now()}`;

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
      chip.textContent = `${chip.textContent} · q88 웃물낮`;
      chip.dataset.q88Marked = 'true';
    }
  }

  function scheduleApply() {
    window.setTimeout(applyQ88IfNeeded, 0);
    window.setTimeout(applyQ88IfNeeded, 120);
    window.setTimeout(applyQ88IfNeeded, 500);
  }

  function boot() {
    installControls();
    scheduleApply();
    document.addEventListener('click', () => window.setTimeout(applyQ88IfNeeded, 80), true);
    const observer = new MutationObserver(() => applyQ88IfNeeded());
    const app = document.getElementById('app') || document.body;
    observer.observe(app, { attributes: true, childList: true, subtree: true, characterData: true });
    window.PondangUtmulDayQ88Override = { apply: applyQ88IfNeeded, path: Q88_PATH };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
