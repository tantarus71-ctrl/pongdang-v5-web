// 퐁당퐁당 v4.8.43 경량 실행본 브라우저 자가 점검 도구
// 한글 주석: 실제 브라우저에서 DOM, CSS, JS, 이미지 경로, 렌더링 상태를 더 견고하게 확인한다.

(function () {
  'use strict';

  const CHECK_ID = 'pongdang-v4-8-43-self-check';
  const OLD_CHECK_ID = 'pongdang-v4.8.42-self-check';

  const requiredSelectors = [
    '#app',
    '#heroTitle',
    '#heroSub',
    '#zoneBar',
    '#modeBar',
    '#fishLayer',
    '#bottomNav',
    '#bookSheet',
    '#rareSheet',
    '#cameraSheet',
    '#fishModal',
    '#modalImg'
  ];

  const requiredAssets = [
    'v4_8_40/css/pongdang-ui.css',
    'v4_8_40/js/pongdang-data.js',
    'v4_8_40/js/pongdang-app.js',
    'assets/fish/beodeulchi/swim.svg',
    'assets/fish/beodeulchi/card.svg',
    'assets/fish/beodeulchi/popup.svg'
  ];

  function createPanel() {
    const oldPanel = document.getElementById(OLD_CHECK_ID);
    if (oldPanel) oldPanel.remove();
    if (document.getElementById(CHECK_ID)) return document.getElementById(CHECK_ID);

    const panel = document.createElement('aside');
    panel.id = CHECK_ID;
    panel.setAttribute('aria-live', 'polite');
    panel.style.cssText = [
      'position:fixed',
      'right:10px',
      'top:max(10px,env(safe-area-inset-top))',
      'z-index:9999',
      'max-width:min(92vw,372px)',
      'max-height:min(72vh,520px)',
      'overflow:auto',
      'padding:10px 12px',
      'border-radius:16px',
      'background:rgba(4,31,52,.90)',
      'border:1px solid rgba(180,245,255,.28)',
      'color:#e9fbff',
      'font:800 12px/1.45 system-ui,-apple-system,Noto Sans KR,sans-serif',
      'box-shadow:0 14px 34px rgba(0,0,0,.28)',
      'backdrop-filter:blur(10px)'
    ].join(';');
    document.body.appendChild(panel);
    return panel;
  }

  function row(ok, label, detail) {
    return `<div style="display:flex;gap:7px;align-items:flex-start;margin:4px 0;">
      <span aria-hidden="true">${ok ? '✅' : '⚠️'}</span>
      <span><strong>${label}</strong>${detail ? `<br><small style="opacity:.84">${detail}</small>` : ''}</span>
    </div>`;
  }

  async function fetchOk(path) {
    const cacheBust = `${path}${path.includes('?') ? '&' : '?'}v=${Date.now()}`;
    try {
      const head = await fetch(cacheBust, { method: 'HEAD', cache: 'no-store' });
      if (head.ok) return { ok: true, status: head.status, method: 'HEAD' };
      // 한글 주석: 일부 정적 호스팅은 HEAD 응답을 제한할 수 있어 GET으로 한 번 더 확인한다.
      const get = await fetch(cacheBust, { method: 'GET', cache: 'no-store' });
      return { ok: get.ok, status: get.status, method: 'GET-fallback' };
    } catch (headError) {
      try {
        const get = await fetch(cacheBust, { method: 'GET', cache: 'no-store' });
        return { ok: get.ok, status: get.status, method: 'GET-after-error' };
      } catch (getError) {
        return { ok: false, status: 'fetch-failed', method: 'HEAD/GET', error: String(getError && getError.message ? getError.message : getError) };
      }
    }
  }

  function getRenderedCounts() {
    return {
      zones: document.querySelectorAll('#zoneBar .chip').length,
      modes: document.querySelectorAll('#modeBar .chip').length,
      menu: document.querySelectorAll('#bottomNav .navBtn').length,
      fish: document.querySelectorAll('#fishLayer .fish').length,
      cards: document.querySelectorAll('#cardGrid .card').length
    };
  }

  function getLayoutStatus() {
    const aquarium = document.querySelector('.aquarium');
    const nav = document.querySelector('#bottomNav');
    if (!aquarium || !nav) return { ok: false, detail: '수족관 또는 하단 메뉴 요소 없음' };
    const a = aquarium.getBoundingClientRect();
    const n = nav.getBoundingClientRect();
    const minAquariumHeight = window.innerHeight < 560 ? 120 : 180;
    const gap = n.top - a.bottom;
    const ok = a.height >= minAquariumHeight && gap >= -2;
    return {
      ok,
      detail: `수족관 ${Math.round(a.width)}×${Math.round(a.height)} · 메뉴간격 ${Math.round(gap)}px`
    };
  }

  function getImageStatus() {
    const images = Array.from(document.images).map((img) => ({
      src: img.getAttribute('src') || '',
      ok: img.complete && img.naturalWidth > 0,
      size: `${img.naturalWidth || 0}×${img.naturalHeight || 0}`
    }));
    return {
      ok: images.length > 0 && images.every((img) => img.ok),
      detail: images.length ? images.map((img) => `${img.ok ? 'OK' : 'MISS'} ${img.src} ${img.size}`).join(' / ') : '이미지 없음',
      images
    };
  }

  async function runCheck() {
    const panel = createPanel();
    panel.innerHTML = '<strong>v4.8.43 점검 중...</strong><br><small>DOM·파일·렌더링·이미지·배치를 확인합니다.</small>';

    const domResults = requiredSelectors.map((selector) => ({
      selector,
      ok: Boolean(document.querySelector(selector))
    }));

    const assetResults = [];
    for (const asset of requiredAssets) {
      assetResults.push({ asset, ...(await fetchOk(asset)) });
    }

    const rendered = getRenderedCounts();
    const layout = getLayoutStatus();
    const image = getImageStatus();

    const domOk = domResults.every((item) => item.ok);
    const assetOk = assetResults.every((item) => item.ok);
    const renderOk = rendered.zones >= 5 && rendered.modes >= 2 && rendered.menu >= 4 && rendered.fish >= 1 && rendered.cards >= 1;
    const imageOk = image.ok;
    const layoutOk = layout.ok;
    const allOk = domOk && assetOk && renderOk && imageOk && layoutOk;

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:6px;">
        <strong>v4.8.43 점검</strong>
        <button type="button" id="pdSelfCheckClose" style="border:0;border-radius:999px;background:rgba(255,255,255,.14);color:#fff;font-weight:900;padding:3px 8px;">닫기</button>
      </div>
      ${row(domOk, 'DOM 구조', domOk ? '필수 요소 모두 존재' : domResults.filter((x) => !x.ok).map((x) => x.selector).join(', '))}
      ${row(assetOk, '파일 경로', assetOk ? '필수 CSS/JS/SVG 응답 확인' : assetResults.filter((x) => !x.ok).map((x) => `${x.asset} (${x.status}/${x.method})`).join(', '))}
      ${row(renderOk, '렌더링', `구간 ${rendered.zones} · 모드 ${rendered.modes} · 메뉴 ${rendered.menu} · 물고기 ${rendered.fish} · 카드 ${rendered.cards}`)}
      ${row(imageOk, '이미지 로드', imageOk ? '표시 이미지 로드 정상' : image.detail)}
      ${row(layoutOk, '배치 안정성', layout.detail)}
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.14);color:${allOk ? '#b9ffdf' : '#ffe0a8'};">
        ${allOk ? '전체 1차 점검 통과 · 원본 교체 후보 가능' : '보정 필요 항목 있음'}
      </div>
    `;

    document.getElementById('pdSelfCheckClose')?.addEventListener('click', () => panel.remove());
    console.info('[Pongdang self-check v4.8.43]', { domResults, assetResults, rendered, image, layout, allOk });
    return { domResults, assetResults, rendered, image, layout, allOk };
  }

  function delayedChecks() {
    setTimeout(runCheck, 500);
    setTimeout(runCheck, 1300);
  }

  window.PongdangSelfCheck = { run: runCheck };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', delayedChecks, { once: true });
  } else {
    delayedChecks();
  }
})();
