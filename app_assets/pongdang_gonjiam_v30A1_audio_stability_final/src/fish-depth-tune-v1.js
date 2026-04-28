/* 퐁당퐁당 곤지암천 v30A-1 - 버들치 1종 입체 유영 미세 조정 */
(() => {
  'use strict';

  const DEPTH_STYLE_ID = 'fishDepthTuneV1Css';
  const DEPTH_STYLE_HREF = './src/styles/fish-depth-tune-v1.css?v=fish-depth-v1';

  function loadCssOnce() {
    if (document.getElementById(DEPTH_STYLE_ID)) return;
    const link = document.createElement('link');
    link.id = DEPTH_STYLE_ID;
    link.rel = 'stylesheet';
    link.href = DEPTH_STYLE_HREF;
    document.head.appendChild(link);
  }

  function getBand(rect, viewportHeight) {
    const centerY = rect.top + rect.height * 0.5;
    const ratio = centerY / Math.max(1, viewportHeight);
    if (ratio < 0.43) return 'back';
    if (ratio > 0.67) return 'front';
    return 'mid';
  }

  function tuneFishDepth() {
    const fishes = Array.from(document.querySelectorAll('.fish-root'));
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    fishes.forEach((fish) => {
      const rect = fish.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const band = getBand(rect, vh);
      fish.dataset.depthBand = band;
      fish.style.setProperty('--fish-depth-band', band);
      if (band === 'back') fish.style.zIndex = '24';
      if (band === 'mid') fish.style.zIndex = '38';
      if (band === 'front') fish.style.zIndex = '44';
    });
  }

  function installNote() {
    if (document.getElementById('aqFishDepthNote')) return;
    const app = document.getElementById('app');
    if (!app) return;
    const note = document.createElement('div');
    note.id = 'aqFishDepthNote';
    note.className = 'aq-fish-depth-note';
    note.textContent = '버들치 입체 유영 보정';
    app.appendChild(note);
  }

  function schedule() {
    window.requestAnimationFrame(tuneFishDepth);
    window.setTimeout(tuneFishDepth, 120);
    window.setTimeout(tuneFishDepth, 420);
  }

  function boot() {
    loadCssOnce();
    installNote();
    schedule();
    document.addEventListener('click', () => window.setTimeout(tuneFishDepth, 90), true);
    window.addEventListener('resize', schedule, { passive: true });
    const target = document.getElementById('fishLayer') || document.getElementById('app') || document.body;
    const observer = new MutationObserver(schedule);
    observer.observe(target, { childList: true, subtree: true, attributes: true });
    window.PondangFishDepthTuneV1 = { apply: tuneFishDepth };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
