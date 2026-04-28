/* 퐁당퐁당 곤지암천 v30A-1 - 버들치 1종 입체 유영 미세 조정 */
(() => {
  'use strict';

  const DEPTH_STYLE_ID = 'fishDepthTuneV1Css';
  const DEPTH_STYLE_HREF = './src/styles/fish-depth-tune-v1.css?v=fish-depth-v1-3d';
  const state = { timer: null, lastX: new WeakMap(), direction: new WeakMap() };

  function loadCssOnce() {
    if (document.getElementById(DEPTH_STYLE_ID)) return;
    const link = document.createElement('link');
    link.id = DEPTH_STYLE_ID;
    link.rel = 'stylesheet';
    link.href = DEPTH_STYLE_HREF;
    document.head.appendChild(link);
  }

  function getDepthInfo(rect, viewportHeight, fish) {
    const centerY = rect.top + rect.height * 0.5;
    const centerX = rect.left + rect.width * 0.5;
    const ratioY = centerY / Math.max(1, viewportHeight);
    const ratioX = centerX / Math.max(1, window.innerWidth || document.documentElement.clientWidth || 390);
    const softBias = (ratioX - 0.5) * 0.035;
    const adjusted = ratioY + softBias;
    let band = 'mid';
    if (adjusted < 0.40) band = 'back';
    else if (adjusted > 0.68) band = 'front';
    if (fish.classList.contains('clickable') && band === 'back') band = 'mid';

    const depthScale = band === 'back' ? 0.82 : band === 'front' ? (fish.classList.contains('clickable') ? 1.16 : 1.12) : 1.0;
    const depthOpacity = band === 'back' ? 0.68 : band === 'front' ? 0.96 : 0.86;
    const rotateY = band === 'back' ? '3deg' : band === 'front' ? '-2deg' : '0deg';
    return { band, depthScale, depthOpacity, rotateY, centerX };
  }

  function updateDirection(fish, centerX) {
    const previous = state.lastX.get(fish);
    const currentDirection = state.direction.get(fish) || 'right';
    let nextDirection = currentDirection;
    if (typeof previous === 'number') {
      const delta = centerX - previous;
      if (delta > 1.8) nextDirection = 'right';
      else if (delta < -1.8) nextDirection = 'left';
    }
    state.lastX.set(fish, centerX);
    state.direction.set(fish, nextDirection);
    fish.dataset.swimDirection = nextDirection;
    fish.classList.toggle('fish-going-right', nextDirection === 'right');
    fish.classList.toggle('fish-going-left', nextDirection === 'left');
  }

  function applyDepthToFish(fish, info) {
    fish.dataset.depthBand = info.band;
    fish.classList.toggle('fish-depth-back', info.band === 'back');
    fish.classList.toggle('fish-depth-mid', info.band === 'mid');
    fish.classList.toggle('fish-depth-front', info.band === 'front');
    fish.classList.toggle('fish-click-target', fish.classList.contains('clickable'));
    fish.style.setProperty('--fish-depth-scale', info.depthScale.toFixed(2));
    fish.style.setProperty('--fish-depth-opacity', info.depthOpacity.toFixed(2));
    fish.style.setProperty('--fish-depth-rotate-y', info.rotateY);
    if (info.band === 'back') fish.style.zIndex = '24';
    if (info.band === 'mid') fish.style.zIndex = fish.classList.contains('clickable') ? '41' : '38';
    if (info.band === 'front') fish.style.zIndex = fish.classList.contains('clickable') ? '47' : '44';
  }

  function tuneFishDepth() {
    const fishes = Array.from(document.querySelectorAll('.fish-root'));
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    fishes.forEach((fish) => {
      const rect = fish.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const info = getDepthInfo(rect, vh, fish);
      updateDirection(fish, info.centerX);
      applyDepthToFish(fish, info);
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

  function schedule(delay = 140) {
    window.clearTimeout(state.timer);
    state.timer = window.setTimeout(() => {
      window.requestAnimationFrame(tuneFishDepth);
    }, delay);
  }

  function boot() {
    loadCssOnce();
    installNote();
    schedule(40);
    window.setTimeout(() => schedule(0), 160);
    window.setTimeout(() => schedule(0), 560);
    document.addEventListener('click', () => schedule(90), true);
    window.addEventListener('resize', () => schedule(180), { passive: true });
    const target = document.getElementById('fishLayer') || document.getElementById('app') || document.body;
    const observer = new MutationObserver(() => schedule(180));
    observer.observe(target, { childList: true, subtree: true, attributes: true });
    window.PondangFishDepthTuneV1 = { apply: tuneFishDepth, schedule };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
