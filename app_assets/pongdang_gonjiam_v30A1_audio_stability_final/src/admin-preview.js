/* 퐁당퐁당 곤지암천 v30A-1 - 읽기 전용 관리자 preview UI */
(() => {
  'use strict';

  const ADMIN_DATA_ENDPOINTS = {
    zones: './data/zones.json',
    species: './data/species.json',
    dexCards: './data/dex_cards.json',
    missions: './data/missions.json',
    audioScripts: './data/audio_scripts.json',
    uiTexts: './data/ui_texts.json',
    assetsManifest: './data/assets_manifest.json'
  };

  const ADMIN_LABELS = {
    dashboard: '대시보드',
    zones: '존 데이터',
    species: '어종 데이터',
    dexCards: '도감 카드',
    missions: '미션',
    audioScripts: '음성 스크립트',
    uiTexts: 'UI 문구',
    assetsManifest: '자산 경로',
    diagnostics: '진단 로그'
  };

  const ADMIN_STATE = {
    activeTab: 'dashboard',
    loading: false,
    loadedAt: null,
    data: {},
    errors: [],
    loadedKeys: [],
    fallbackKeys: [],
    warnings: []
  };

  const app = document.getElementById('adminPreviewApp');

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatJson(value) {
    try { return escapeHtml(JSON.stringify(value, null, 2)); }
    catch (_) { return escapeHtml(String(value)); }
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function valueText(value) {
    if (Array.isArray(value)) return value.join(', ');
    if (value && typeof value === 'object') return JSON.stringify(value);
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return value ?? '';
  }

  function getPathExtension(path) {
    const text = String(path || '').split('?')[0].split('#')[0];
    const match = text.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : '';
  }

  function addWarning(key, message, level = 'warning') {
    ADMIN_STATE.warnings.push({ key, message, level });
  }

  function validateAdminData(key, json) {
    const warnings = [];
    if (!json || typeof json !== 'object') return { ok: false, status: 'fallback', warnings: ['JSON 객체가 아닙니다.'] };

    const requireArray = (prop, requiredFields) => {
      const items = json[prop];
      if (!Array.isArray(items)) return { ok: false, status: 'fallback', warnings: [`${prop} 배열이 없습니다.`] };
      items.forEach((item, index) => {
        requiredFields.forEach((field) => {
          if (!item || item[field] === undefined || item[field] === '') warnings.push(`${prop}[${index}] ${field} 누락`);
        });
      });
      return { ok: warnings.length === 0, status: warnings.length ? 'check' : 'ok', warnings };
    };

    if (key === 'zones') return requireArray('zones', ['id', 'name']);
    if (key === 'species') return requireArray('species', ['id', 'name']);
    if (key === 'dexCards') return requireArray('cards', ['id', 'name']);
    if (key === 'missions') return requireArray('missions', ['id', 'title']);
    if (key === 'audioScripts') return requireArray('audioScripts', ['id', 'text']);
    if (key === 'uiTexts') {
      if (!json.uiTexts || typeof json.uiTexts !== 'object') return { ok: false, status: 'fallback', warnings: ['uiTexts 객체가 없습니다.'] };
      return { ok: true, status: 'ok', warnings: [] };
    }
    if (key === 'assetsManifest') {
      if (!json.assets || typeof json.assets !== 'object') return { ok: false, status: 'fallback', warnings: ['assets 객체가 없습니다.'] };
      return { ok: true, status: 'ok', warnings: [] };
    }
    return { ok: false, status: 'fallback', warnings: ['알 수 없는 데이터 키입니다.'] };
  }

  async function safeFetchJson(key, path) {
    try {
      const glue = path.includes('?') ? '&' : '?';
      const response = await fetch(`${path}${glue}cache=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const validation = validateAdminData(key, json);
      ADMIN_STATE.data[key] = { json, validation, path };
      if (validation.status === 'fallback') ADMIN_STATE.fallbackKeys.push(key);
      else ADMIN_STATE.loadedKeys.push(key);
      validation.warnings.forEach((message) => addWarning(key, message, validation.status === 'fallback' ? 'danger' : 'warning'));
      return json;
    } catch (error) {
      ADMIN_STATE.errors.push({ key, path, message: error && error.message ? error.message : String(error) });
      ADMIN_STATE.fallbackKeys.push(key);
      ADMIN_STATE.data[key] = { json: null, validation: { ok: false, status: 'fallback', warnings: ['로드 실패'] }, path };
      return null;
    }
  }

  async function loadAllAdminData() {
    ADMIN_STATE.loading = true;
    ADMIN_STATE.errors = [];
    ADMIN_STATE.loadedKeys = [];
    ADMIN_STATE.fallbackKeys = [];
    ADMIN_STATE.warnings = [];
    ADMIN_STATE.data = {};
    renderApp();

    const entries = Object.entries(ADMIN_DATA_ENDPOINTS);
    await Promise.allSettled(entries.map(([key, path]) => safeFetchJson(key, path)));
    collectWarnings();
    ADMIN_STATE.loadedAt = new Date().toLocaleString('ko-KR');
    ADMIN_STATE.loading = false;
    renderApp();
  }

  function collectWarnings() {
    const assets = ADMIN_STATE.data.assetsManifest?.json?.assets;
    asArray(assets?.backgrounds).forEach((item) => {
      const ext = getPathExtension(item.path);
      const fallbackExt = getPathExtension(item.fallbackPath);
      if (ext && fallbackExt && ext !== fallbackExt) addWarning('assetsManifest', `${item.id || 'background'} path(${ext}) / fallbackPath(${fallbackExt}) 확장자 다름`, 'danger');
      if (!item.path) addWarning('assetsManifest', `${item.id || 'background'} path 비어 있음`, 'danger');
    });
    asArray(assets?.fish).forEach((item) => {
      if (!item.path) addWarning('assetsManifest', `${item.id || 'fish'} fish path 비어 있음`, 'danger');
    });

    asArray(ADMIN_STATE.data.audioScripts?.json?.audioScripts).forEach((item) => {
      if (item.audioPath && typeof item.audioPath === 'string') addWarning('audioScripts', `${item.id} audioPath가 설정되어 있습니다. 실제 mp3 파일 존재 확인 필요`, 'warning');
      if (typeof item.fallbackTts !== 'boolean') addWarning('audioScripts', `${item.id} fallbackTts boolean 확인 필요`, 'warning');
    });

    asArray(ADMIN_STATE.data.zones?.json?.zones).forEach((item) => {
      const dayExt = getPathExtension(item.dayBackground || item.day);
      const nightExt = getPathExtension(item.nightBackground || item.night);
      if (dayExt && dayExt !== 'jpg' && dayExt !== 'png') addWarning('zones', `${item.id} 낮 배경 확장자 확인 필요`, 'warning');
      if (nightExt && nightExt !== 'jpg' && nightExt !== 'png') addWarning('zones', `${item.id} 밤 배경 확장자 확인 필요`, 'warning');
    });
  }

  function renderStatusChip(status, label) {
    const map = { ok: '정상', check: '확인 필요', fallback: 'fallback', danger: '위험', info: '정보', loading: '로딩' };
    return `<span class="admin-chip admin-chip-${escapeHtml(status)}">${escapeHtml(label || map[status] || status)}</span>`;
  }

  function renderTable(headers, rows) {
    return `
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(valueText(cell))}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>`;
  }

  function dataStatus(key) {
    if (ADMIN_STATE.loading) return 'loading';
    return ADMIN_STATE.data[key]?.validation?.status || 'fallback';
  }

  function renderReadonlyBanner() {
    return `
      <section class="admin-readonly-banner">
        <strong>읽기 전용 관리자 preview</strong>
        <p>이 화면은 읽기 전용 관리자 preview입니다. 현재 앱 화면은 app.js 내부 기본 데이터를 우선 사용합니다. 외부 JSON은 관리자 기능 준비용으로 로드됩니다. 저장/수정/삭제 기능은 아직 비활성화되어 있습니다.</p>
      </section>`;
  }

  function renderSidebar() {
    return `
      <aside class="admin-sidebar">
        <div class="admin-logo">💧 퐁당 관리자</div>
        <nav class="admin-tabs" aria-label="관리자 preview 메뉴">
          ${Object.entries(ADMIN_LABELS).map(([key, label]) => `
            <button class="admin-tab ${ADMIN_STATE.activeTab === key ? 'active' : ''}" data-tab="${escapeHtml(key)}">
              <span>${escapeHtml(label)}</span>${key !== 'dashboard' && key !== 'diagnostics' ? renderStatusChip(dataStatus(key), '') : ''}
            </button>`).join('')}
        </nav>
      </aside>`;
  }

  function renderDashboard() {
    const total = Object.keys(ADMIN_DATA_ENDPOINTS).length;
    const dangerCount = ADMIN_STATE.warnings.filter((w) => w.level === 'danger').length;
    return `
      <section class="admin-section">
        <h2>대시보드</h2>
        <div class="admin-card-grid">
          <article class="admin-card"><h3>로더 상태</h3><p>${ADMIN_STATE.loading ? '데이터를 불러오는 중입니다.' : '로드 상태 확인 완료'}</p>${renderStatusChip(ADMIN_STATE.loading ? 'loading' : 'info', ADMIN_STATE.loading ? '로딩' : '읽기 전용')}</article>
          <article class="admin-card"><h3>JSON 현황</h3><p>성공 ${ADMIN_STATE.loadedKeys.length} / 전체 ${total}</p>${renderStatusChip(ADMIN_STATE.fallbackKeys.length ? 'check' : 'ok')}</article>
          <article class="admin-card"><h3>Fallback</h3><p>${ADMIN_STATE.fallbackKeys.length}개 항목 fallback</p>${renderStatusChip(ADMIN_STATE.fallbackKeys.length ? 'fallback' : 'ok')}</article>
          <article class="admin-card"><h3>위험 경고</h3><p>${dangerCount}개 위험, ${ADMIN_STATE.warnings.length}개 전체 경고</p>${renderStatusChip(dangerCount ? 'danger' : 'ok')}</article>
          <article class="admin-card"><h3>런타임 기준</h3><p>현재 앱 화면은 app.js 내부 기본 데이터를 우선 사용합니다.</p>${renderStatusChip('info', 'app.js-defaults-first')}</article>
        </div>
        <div class="admin-card admin-wide"><h3>데이터별 상태</h3>${renderTable(['데이터', '경로', '상태'], Object.entries(ADMIN_DATA_ENDPOINTS).map(([key, path]) => [ADMIN_LABELS[key] || key, path, dataStatus(key)]))}</div>
      </section>`;
  }

  function renderZones() {
    const rows = asArray(ADMIN_STATE.data.zones?.json?.zones).map((z) => [z.id, z.name, z.icon, z.description, z.dayBackground || z.day, z.nightBackground || z.night, z.flow, z.light, valueText(z.fishCount)]);
    return renderDataSection('존 데이터', 'data/zones.json', ['id', 'name', 'icon', 'description', 'dayBackground', 'nightBackground', 'flow', 'light', 'fishCount'], rows, 'zones');
  }

  function renderSpecies() {
    const rows = asArray(ADMIN_STATE.data.species?.json?.species).map((s) => [s.id, s.name, s.category, s.layer, s.description, s.habitat, s.feature, s.observePoint]);
    return renderDataSection('어종 데이터', 'data/species.json', ['id', 'name', 'category', 'layer', 'description', 'habitat', 'feature', 'observePoint'], rows, 'species');
  }

  function renderDexCards() {
    const rows = asArray(ADMIN_STATE.data.dexCards?.json?.cards).map((c) => [c.id, c.name, c.type, c.rarity, c.rarityLabel, valueText(c.zones), c.image, c.habitat, c.feature, c.point]);
    return renderDataSection('도감 카드', 'data/dex_cards.json', ['id', 'name', 'type', 'rarity', 'rarityLabel', 'zones', 'image', 'habitat', 'feature', 'point'], rows, 'dexCards');
  }

  function renderMissions() {
    const rows = asArray(ADMIN_STATE.data.missions?.json?.missions).map((m) => [m.id, m.title, m.description, m.zone, m.speciesId, m.requiredCount, m.completeText]);
    return renderDataSection('미션', 'data/missions.json', ['id', 'title', 'description', 'zone', 'speciesId', 'requiredCount', 'completeText'], rows, 'missions');
  }

  function renderAudioScripts() {
    const rows = asArray(ADMIN_STATE.data.audioScripts?.json?.audioScripts).map((a) => [a.id, a.type, a.title, a.emoji, a.text, a.shortText, a.audioPath === null ? 'TTS fallback 정상' : a.audioPath, a.fallbackTts]);
    return renderDataSection('음성 스크립트', 'data/audio_scripts.json', ['id', 'type', 'title', 'emoji', 'text', 'shortText', 'audioPath', 'fallbackTts'], rows, 'audioScripts');
  }

  function renderUiTexts() {
    const obj = ADMIN_STATE.data.uiTexts?.json?.uiTexts || {};
    const rows = Object.entries(obj).map(([key, value]) => [key, value]);
    return renderDataSection('UI 문구', 'data/ui_texts.json', ['key', 'value'], rows, 'uiTexts');
  }

  function renderAssets() {
    const assets = ADMIN_STATE.data.assetsManifest?.json?.assets || {};
    const backgroundRows = asArray(assets.backgrounds).map((b) => [b.id, b.zoneId, b.time, b.path, getPathExtension(b.path), b.fallbackPath, getPathExtension(b.fallbackPath), b.adminEditable]);
    const fishRows = asArray(assets.fish).map((f) => [f.id, f.speciesId, f.usage, f.path, getPathExtension(f.path), f.adminEditable]);
    return `
      <section class="admin-section">
        <h2>자산 경로</h2>
        ${renderPanelStatus('assetsManifest')}
        <div class="admin-warning"><strong>배경 경로 확인:</strong> app.js, index.html preload, assets_manifest.json, 실제 파일 확장자가 모두 일치해야 합니다.</div>
        <article class="admin-card admin-wide"><h3>Backgrounds</h3>${renderTable(['id', 'zoneId', 'time', 'path', 'ext', 'fallbackPath', 'fallbackExt', 'adminEditable'], backgroundRows)}</article>
        <article class="admin-card admin-wide"><h3>Fish</h3>${renderTable(['id', 'speciesId', 'usage', 'path', 'ext', 'adminEditable'], fishRows)}</article>
        ${renderRawJson('assetsManifest')}
      </section>`;
  }

  function renderPanelStatus(key) {
    const entry = ADMIN_STATE.data[key];
    const warnings = entry?.validation?.warnings || [];
    return `<div class="admin-panel-status">${renderStatusChip(dataStatus(key))}<span>${escapeHtml(ADMIN_DATA_ENDPOINTS[key] || '')}</span>${warnings.length ? `<small>${escapeHtml(warnings.join(' / '))}</small>` : ''}</div>`;
  }

  function renderRawJson(key) {
    const entry = ADMIN_STATE.data[key];
    return `<details class="admin-details"><summary>원본 JSON 보기</summary><pre>${formatJson(entry?.json || {})}</pre></details>`;
  }

  function renderDataSection(title, path, headers, rows, key) {
    return `
      <section class="admin-section">
        <h2>${escapeHtml(title)}</h2>
        ${renderPanelStatus(key)}
        <article class="admin-card admin-wide">
          ${rows.length ? renderTable(headers, rows) : `<p class="admin-empty">표시할 데이터가 없습니다.</p>`}
        </article>
        ${renderRawJson(key)}
      </section>`;
  }

  function renderDiagnostics() {
    return `
      <section class="admin-section">
        <h2>진단 로그</h2>
        <div class="admin-card-grid">
          <article class="admin-card"><h3>loadedKeys</h3><p>${escapeHtml(ADMIN_STATE.loadedKeys.join(', ') || '없음')}</p></article>
          <article class="admin-card"><h3>fallbackKeys</h3><p>${escapeHtml(ADMIN_STATE.fallbackKeys.join(', ') || '없음')}</p></article>
          <article class="admin-card"><h3>errors</h3><p>${ADMIN_STATE.errors.length}개</p></article>
          <article class="admin-card"><h3>warnings</h3><p>${ADMIN_STATE.warnings.length}개</p></article>
        </div>
        <details class="admin-details" open><summary>오류 목록</summary><pre>${formatJson(ADMIN_STATE.errors)}</pre></details>
        <details class="admin-details" open><summary>경고 목록</summary><pre>${formatJson(ADMIN_STATE.warnings)}</pre></details>
        <details class="admin-details"><summary>전체 상태 JSON</summary><pre>${formatJson(ADMIN_STATE)}</pre></details>
      </section>`;
  }

  function renderMainContent() {
    const tab = ADMIN_STATE.activeTab;
    if (tab === 'dashboard') return renderDashboard();
    if (tab === 'zones') return renderZones();
    if (tab === 'species') return renderSpecies();
    if (tab === 'dexCards') return renderDexCards();
    if (tab === 'missions') return renderMissions();
    if (tab === 'audioScripts') return renderAudioScripts();
    if (tab === 'uiTexts') return renderUiTexts();
    if (tab === 'assetsManifest') return renderAssets();
    if (tab === 'diagnostics') return renderDiagnostics();
    return renderDashboard();
  }

  function renderApp() {
    if (!app) return;
    app.innerHTML = `
      <div class="admin-shell">
        ${renderSidebar()}
        <main class="admin-main">
          <header class="admin-header">
            <div><h1>퐁당퐁당 관리자 preview</h1><p>v30A-1 · 읽기 전용 · 저장/수정/삭제 비활성</p></div>
            <button class="admin-refresh" id="adminRefresh">다시 불러오기</button>
          </header>
          ${renderReadonlyBanner()}
          ${ADMIN_STATE.warnings.length ? `<section class="admin-warning-list">${ADMIN_STATE.warnings.slice(0, 5).map((w) => `<div class="admin-warning"><strong>${escapeHtml(w.key)}</strong> ${escapeHtml(w.message)}</div>`).join('')}</section>` : ''}
          ${renderMainContent()}
        </main>
      </div>`;

    document.querySelectorAll('[data-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        ADMIN_STATE.activeTab = button.getAttribute('data-tab') || 'dashboard';
        renderApp();
      });
    });
    document.getElementById('adminRefresh')?.addEventListener('click', loadAllAdminData);
  }

  window.PondangAdminPreview = {
    state: ADMIN_STATE,
    reload: loadAllAdminData
  };

  renderApp();
  loadAllAdminData();
})();
