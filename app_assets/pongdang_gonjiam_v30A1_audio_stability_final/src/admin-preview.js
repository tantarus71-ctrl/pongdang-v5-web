/* 퐁당퐁당 곤지암천 v30A-1 - 읽기 전용 관리자 preview UI 검증 강화 */
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

  const FIELD_RULES = {
    zones: { arrayKey: 'zones', required: ['id', 'name'], recommended: ['icon', 'description', 'dayBackground', 'nightBackground', 'flow', 'light', 'fishCount'] },
    species: { arrayKey: 'species', required: ['id', 'name'], recommended: ['category', 'layer', 'description', 'habitat', 'feature', 'observePoint'] },
    dexCards: { arrayKey: 'cards', required: ['id', 'name'], recommended: ['type', 'rarity', 'rarityLabel', 'zones', 'image', 'habitat', 'feature', 'point'] },
    missions: { arrayKey: 'missions', required: ['id', 'title'], recommended: ['description', 'zone', 'speciesId', 'requiredCount', 'completeText'] },
    audioScripts: { arrayKey: 'audioScripts', required: ['id', 'text'], recommended: ['type', 'title', 'emoji', 'shortText', 'audioPath', 'fallbackTts'] }
  };

  const ADMIN_STATE = {
    activeTab: 'dashboard',
    loading: false,
    loadedAt: null,
    data: {},
    errors: [],
    loadedKeys: [],
    fallbackKeys: [],
    warnings: [],
    assetChecks: {},
    metrics: {
      requiredIssues: 0,
      recommendedIssues: 0,
      assetIssues: 0,
      audioIssues: 0,
      headUnknown: 0,
      dangerIssues: 0
    }
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

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function isBlank(value) { return value === undefined || value === null || value === ''; }
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

  function normalizePath(path) {
    return String(path || '').trim();
  }

  function addWarning(issue) {
    const normalized = {
      key: issue.key || 'system',
      level: issue.level || 'warning',
      type: issue.type || 'structure',
      message: issue.message || '확인이 필요합니다.',
      target: issue.target || ''
    };
    ADMIN_STATE.warnings.push(normalized);
  }

  function dedupeWarnings() {
    const seen = new Set();
    ADMIN_STATE.warnings = ADMIN_STATE.warnings.filter((item) => {
      const sig = `${item.key}|${item.level}|${item.type}|${item.target}|${item.message}`;
      if (seen.has(sig)) return false;
      seen.add(sig);
      return true;
    });
  }

  function validateArrayData(key, json, rule) {
    const issues = [];
    if (!json || typeof json !== 'object') {
      issues.push({ key, level: 'danger', type: 'structure', message: 'JSON 객체가 아닙니다.', target: key });
      return { ok: false, status: 'fallback', issues };
    }
    const items = json[rule.arrayKey];
    if (!Array.isArray(items)) {
      issues.push({ key, level: 'danger', type: 'missing-required', message: `${rule.arrayKey} 배열이 없습니다.`, target: rule.arrayKey });
      return { ok: false, status: 'fallback', issues };
    }
    items.forEach((item, index) => {
      rule.required.forEach((field) => {
        if (!item || isBlank(item[field])) {
          issues.push({ key, level: 'danger', type: 'missing-required', message: `${rule.arrayKey}[${index}] 필수 필드 ${field} 누락`, target: `${rule.arrayKey}[${index}].${field}` });
        }
      });
      rule.recommended.forEach((field) => {
        if (!item || isBlank(item[field])) {
          issues.push({ key, level: 'warning', type: 'missing-recommended', message: `${rule.arrayKey}[${index}] 권장 필드 ${field} 확인 필요`, target: `${rule.arrayKey}[${index}].${field}` });
        }
      });
    });
    const hasDanger = issues.some((item) => item.level === 'danger');
    const hasWarning = issues.some((item) => item.level === 'warning');
    return { ok: !hasDanger, status: hasDanger ? 'fallback' : (hasWarning ? 'check' : 'ok'), issues };
  }

  function validateObjectData(key, json, objectKey, recommendedFields) {
    const issues = [];
    if (!json || typeof json !== 'object' || !json[objectKey] || typeof json[objectKey] !== 'object') {
      issues.push({ key, level: 'danger', type: 'missing-required', message: `${objectKey} 객체가 없습니다.`, target: objectKey });
      return { ok: false, status: 'fallback', issues };
    }
    recommendedFields.forEach((field) => {
      if (isBlank(json[objectKey][field])) {
        issues.push({ key, level: 'warning', type: 'missing-recommended', message: `${objectKey}.${field} 권장 필드 확인 필요`, target: `${objectKey}.${field}` });
      }
    });
    return { ok: true, status: issues.length ? 'check' : 'ok', issues };
  }

  function validateAdminData(key, json) {
    if (FIELD_RULES[key]) return validateArrayData(key, json, FIELD_RULES[key]);
    if (key === 'uiTexts') return validateObjectData(key, json, 'uiTexts', ['brandTitle', 'defaultZoneDescription', 'hint', 'bottomCardTitle', 'bottomCardSubtitle', 'dexTitle', 'missionTitle', 'cameraTitle', 'audioTitle']);
    if (key === 'assetsManifest') {
      const issues = [];
      if (!json || typeof json !== 'object' || !json.assets || typeof json.assets !== 'object') {
        issues.push({ key, level: 'danger', type: 'missing-required', message: 'assets 객체가 없습니다.', target: 'assets' });
        return { ok: false, status: 'fallback', issues };
      }
      if (!Array.isArray(json.assets.backgrounds)) issues.push({ key, level: 'warning', type: 'missing-recommended', message: 'assets.backgrounds 배열 확인 필요', target: 'assets.backgrounds' });
      if (!Array.isArray(json.assets.fish)) issues.push({ key, level: 'warning', type: 'missing-recommended', message: 'assets.fish 배열 확인 필요', target: 'assets.fish' });
      asArray(json.assets.backgrounds).forEach((item, index) => {
        ['id', 'zoneId', 'time', 'path', 'fallbackPath'].forEach((field) => {
          if (isBlank(item?.[field])) issues.push({ key, level: 'warning', type: 'missing-recommended', message: `backgrounds[${index}] ${field} 확인 필요`, target: `backgrounds[${index}].${field}` });
        });
      });
      asArray(json.assets.fish).forEach((item, index) => {
        ['id', 'speciesId', 'usage', 'path'].forEach((field) => {
          if (isBlank(item?.[field])) issues.push({ key, level: field === 'path' ? 'danger' : 'warning', type: field === 'path' ? 'path-mismatch' : 'missing-recommended', message: `fish[${index}] ${field} 확인 필요`, target: `fish[${index}].${field}` });
        });
      });
      const hasDanger = issues.some((item) => item.level === 'danger');
      return { ok: !hasDanger, status: hasDanger ? 'fallback' : (issues.length ? 'check' : 'ok'), issues };
    }
    return { ok: false, status: 'fallback', issues: [{ key, level: 'danger', type: 'structure', message: '알 수 없는 데이터 키입니다.', target: key }] };
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
      validation.issues.forEach(addWarning);
      return json;
    } catch (error) {
      ADMIN_STATE.errors.push({ key, path, message: error && error.message ? error.message : String(error) });
      ADMIN_STATE.fallbackKeys.push(key);
      ADMIN_STATE.data[key] = { json: null, validation: { ok: false, status: 'fallback', issues: [{ key, level: 'danger', type: 'structure', message: '로드 실패', target: path }] }, path };
      addWarning({ key, level: 'danger', type: 'structure', message: `JSON 로드 실패: ${path}`, target: path });
      return null;
    }
  }

  function collectAssetPathCandidates() {
    const candidates = [];
    const assets = ADMIN_STATE.data.assetsManifest?.json?.assets || {};
    asArray(assets.backgrounds).forEach((item) => {
      if (item.path) candidates.push({ key: 'assetsManifest', target: item.id || item.path, path: item.path, type: 'background' });
      if (item.fallbackPath) candidates.push({ key: 'assetsManifest', target: `${item.id || item.path}:fallback`, path: item.fallbackPath, type: 'background-fallback' });
    });
    asArray(assets.fish).forEach((item) => {
      if (item.path) candidates.push({ key: 'assetsManifest', target: item.id || item.path, path: item.path, type: 'fish' });
    });
    asArray(ADMIN_STATE.data.dexCards?.json?.cards).forEach((item) => {
      if (item.image) candidates.push({ key: 'dexCards', target: item.id || item.image, path: item.image, type: 'dex-image' });
    });
    asArray(ADMIN_STATE.data.audioScripts?.json?.audioScripts).forEach((item) => {
      if (item.audioPath && typeof item.audioPath === 'string') candidates.push({ key: 'audioScripts', target: item.id || item.audioPath, path: item.audioPath, type: 'audio' });
    });
    return candidates.slice(0, 30);
  }

  async function checkAssetExists(candidate) {
    const path = normalizePath(candidate.path);
    if (!path) return { ...candidate, exists: false, status: 'empty' };
    try {
      const glue = path.includes('?') ? '&' : '?';
      const response = await fetch(`${path}${glue}assetCheck=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
      if (response.ok) return { ...candidate, exists: true, status: 'ok', http: response.status };
      return { ...candidate, exists: false, status: 'missing', http: response.status };
    } catch (error) {
      return { ...candidate, exists: 'unknown', status: 'unknown', message: error && error.message ? error.message : String(error) };
    }
  }

  async function runAssetChecks() {
    const candidates = collectAssetPathCandidates();
    const results = await Promise.allSettled(candidates.map(checkAssetExists));
    ADMIN_STATE.assetChecks = {};
    results.forEach((result, index) => {
      const candidate = candidates[index];
      const value = result.status === 'fulfilled' ? result.value : { ...candidate, exists: 'unknown', status: 'unknown' };
      ADMIN_STATE.assetChecks[`${candidate.key}:${candidate.target}:${candidate.path}`] = value;
      if (value.exists === false) addWarning({ key: candidate.key, level: 'danger', type: 'path-mismatch', message: `자산 경로 확인 실패: ${candidate.path}`, target: candidate.target });
      if (value.exists === 'unknown') addWarning({ key: candidate.key, level: 'warning', type: 'path-mismatch', message: `자산 HEAD 확인 불가: ${candidate.path}`, target: candidate.target });
    });
  }

  function compareAssetPaths() {
    const zones = asArray(ADMIN_STATE.data.zones?.json?.zones);
    const backgrounds = asArray(ADMIN_STATE.data.assetsManifest?.json?.assets?.backgrounds);
    backgrounds.forEach((bg) => {
      const zone = zones.find((item) => item.id === bg.zoneId);
      if (!zone) return;
      const zonePath = bg.time === 'night' ? (zone.nightBackground || zone.night) : (zone.dayBackground || zone.day);
      if (zonePath && bg.path && zonePath !== bg.path) {
        addWarning({ key: 'assetsManifest', level: 'danger', type: 'path-mismatch', message: `${bg.zoneId}/${bg.time} 배경 경로가 zones.json과 assets_manifest.json에서 다릅니다.`, target: bg.id || bg.zoneId });
      }
      const zoneExt = getPathExtension(zonePath);
      const bgExt = getPathExtension(bg.path);
      const fallbackExt = getPathExtension(bg.fallbackPath);
      if (zoneExt && bgExt && zoneExt !== bgExt) addWarning({ key: 'assetsManifest', level: 'danger', type: 'path-mismatch', message: `${bg.zoneId}/${bg.time} zones 확장자(${zoneExt})와 manifest 확장자(${bgExt})가 다릅니다.`, target: bg.id || bg.zoneId });
      if (bgExt && fallbackExt && bgExt !== fallbackExt) addWarning({ key: 'assetsManifest', level: 'danger', type: 'path-mismatch', message: `${bg.id || bg.zoneId} path(${bgExt}) / fallbackPath(${fallbackExt}) 확장자가 다릅니다.`, target: bg.id || bg.zoneId });
    });
  }

  function collectWarnings() {
    compareAssetPaths();

    asArray(ADMIN_STATE.data.audioScripts?.json?.audioScripts).forEach((item) => {
      if (item.audioPath === '') addWarning({ key: 'audioScripts', level: 'warning', type: 'audio-check', message: `${item.id} audioPath가 빈 문자열입니다. null 권장`, target: item.id });
      if (item.audioPath && typeof item.audioPath === 'string') addWarning({ key: 'audioScripts', level: 'warning', type: 'audio-check', message: `${item.id} audioPath가 설정되어 있습니다. 실제 mp3 파일 존재 확인 필요`, target: item.id });
      if (item.fallbackTts === false && !item.audioPath) addWarning({ key: 'audioScripts', level: 'danger', type: 'audio-check', message: `${item.id} fallbackTts false인데 audioPath가 없습니다.`, target: item.id });
      if (typeof item.fallbackTts !== 'boolean') addWarning({ key: 'audioScripts', level: 'warning', type: 'audio-check', message: `${item.id} fallbackTts boolean 확인 필요`, target: item.id });
    });

    asArray(ADMIN_STATE.data.zones?.json?.zones).forEach((item) => {
      const dayExt = getPathExtension(item.dayBackground || item.day);
      const nightExt = getPathExtension(item.nightBackground || item.night);
      if (dayExt && !['jpg', 'jpeg', 'png', 'webp'].includes(dayExt)) addWarning({ key: 'zones', level: 'warning', type: 'path-mismatch', message: `${item.id} 낮 배경 확장자 확인 필요`, target: `${item.id}.dayBackground` });
      if (nightExt && !['jpg', 'jpeg', 'png', 'webp'].includes(nightExt)) addWarning({ key: 'zones', level: 'warning', type: 'path-mismatch', message: `${item.id} 밤 배경 확장자 확인 필요`, target: `${item.id}.nightBackground` });
    });

    dedupeWarnings();
    updateMetrics();
  }

  function updateMetrics() {
    ADMIN_STATE.metrics.requiredIssues = ADMIN_STATE.warnings.filter((w) => w.type === 'missing-required').length;
    ADMIN_STATE.metrics.recommendedIssues = ADMIN_STATE.warnings.filter((w) => w.type === 'missing-recommended').length;
    ADMIN_STATE.metrics.assetIssues = ADMIN_STATE.warnings.filter((w) => w.type === 'path-mismatch').length;
    ADMIN_STATE.metrics.audioIssues = ADMIN_STATE.warnings.filter((w) => w.type === 'audio-check').length;
    ADMIN_STATE.metrics.headUnknown = Object.values(ADMIN_STATE.assetChecks).filter((item) => item.exists === 'unknown').length;
    ADMIN_STATE.metrics.dangerIssues = ADMIN_STATE.warnings.filter((w) => w.level === 'danger').length;
  }

  async function loadAllAdminData() {
    if (ADMIN_STATE.loading) return;
    ADMIN_STATE.loading = true;
    ADMIN_STATE.errors = [];
    ADMIN_STATE.loadedKeys = [];
    ADMIN_STATE.fallbackKeys = [];
    ADMIN_STATE.warnings = [];
    ADMIN_STATE.assetChecks = {};
    ADMIN_STATE.data = {};
    updateMetrics();
    renderApp();

    const entries = Object.entries(ADMIN_DATA_ENDPOINTS);
    await Promise.allSettled(entries.map(([key, path]) => safeFetchJson(key, path)));
    collectWarnings();
    await runAssetChecks();
    dedupeWarnings();
    updateMetrics();
    ADMIN_STATE.loadedAt = new Date().toLocaleString('ko-KR');
    ADMIN_STATE.loading = false;
    renderApp();
  }

  function renderStatusChip(status, label) {
    const map = { ok: '정상', check: '확인 필요', fallback: 'fallback', danger: '위험', warning: '확인 필요', info: '정보', loading: '로딩' };
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

  function metricCard(title, value, status, text) {
    return `<article class="admin-metric-card"><h3>${escapeHtml(title)}</h3><strong>${escapeHtml(value)}</strong><p>${escapeHtml(text || '')}</p>${renderStatusChip(status)}</article>`;
  }

  function renderIssueList(limit = 8) {
    const items = ADMIN_STATE.warnings.slice(0, limit);
    if (!items.length) return '<p class="admin-empty">현재 표시할 경고가 없습니다.</p>';
    return `<div class="admin-issue-list">${items.map((item) => `<div class="admin-issue-item admin-issue-${escapeHtml(item.level)}"><b>${escapeHtml(item.key)}</b><span>${escapeHtml(item.message)}</span><small>${escapeHtml(item.type)} · ${escapeHtml(item.target)}</small></div>`).join('')}</div>`;
  }

  function renderDashboard() {
    const total = Object.keys(ADMIN_DATA_ENDPOINTS).length;
    const m = ADMIN_STATE.metrics;
    return `
      <section class="admin-section">
        <h2>대시보드</h2>
        <div class="admin-summary-grid">
          ${metricCard('필수 필드 오류', m.requiredIssues, m.requiredIssues ? 'danger' : 'ok', 'missing-required')}
          ${metricCard('권장 필드 경고', m.recommendedIssues, m.recommendedIssues ? 'check' : 'ok', 'missing-recommended')}
          ${metricCard('자산 경로 경고', m.assetIssues, m.assetIssues ? 'danger' : 'ok', 'path-mismatch')}
          ${metricCard('Audio 경고', m.audioIssues, m.audioIssues ? 'check' : 'ok', 'audio-check')}
          ${metricCard('HEAD unknown', m.headUnknown, m.headUnknown ? 'check' : 'ok', '환경에 따라 unknown 가능')}
        </div>
        <div class="admin-card-grid">
          <article class="admin-card"><h3>로더 상태</h3><p>${ADMIN_STATE.loading ? '데이터를 불러오는 중입니다.' : `마지막 로드: ${ADMIN_STATE.loadedAt || '아직 없음'}`}</p>${renderStatusChip(ADMIN_STATE.loading ? 'loading' : 'info', ADMIN_STATE.loading ? '로딩' : '읽기 전용')}</article>
          <article class="admin-card"><h3>JSON 현황</h3><p>성공 ${ADMIN_STATE.loadedKeys.length} / 전체 ${total}</p>${renderStatusChip(ADMIN_STATE.fallbackKeys.length ? 'check' : 'ok')}</article>
          <article class="admin-card"><h3>Fallback</h3><p>${ADMIN_STATE.fallbackKeys.length}개 항목 fallback</p>${renderStatusChip(ADMIN_STATE.fallbackKeys.length ? 'fallback' : 'ok')}</article>
          <article class="admin-card"><h3>위험 경고</h3><p>${m.dangerIssues}개 위험, ${ADMIN_STATE.warnings.length}개 전체 경고</p>${renderStatusChip(m.dangerIssues ? 'danger' : 'ok')}</article>
          <article class="admin-card"><h3>런타임 기준</h3><p>현재 앱 화면은 app.js 내부 기본 데이터를 우선 사용합니다.</p>${renderStatusChip('info', 'app.js-defaults-first')}</article>
        </div>
        <div class="admin-card admin-wide"><h3>위험도별 경고 목록</h3>${renderIssueList(10)}</div>
        <div class="admin-card admin-wide"><h3>데이터별 상태</h3>${renderTable(['데이터', '경로', '상태'], Object.entries(ADMIN_DATA_ENDPOINTS).map(([key, path]) => [ADMIN_LABELS[key] || key, path, dataStatus(key)]))}</div>
        <div class="admin-warning"><strong>다음 조치:</strong> 다음 단계는 편집 기능이 아니라 필드 검증 기준 확정과 자산 경로 기준 통일입니다. 배경 jpg/png 기준을 먼저 확정한 뒤 편집 기능으로 넘어가야 합니다.</div>
      </section>`;
  }

  function renderZones() {
    const rows = asArray(ADMIN_STATE.data.zones?.json?.zones).map((z) => [z.id, z.name, z.icon, z.description, z.dayBackground || z.day, z.nightBackground || z.night, z.flow, z.light, valueText(z.fishCount)]);
    return renderDataSection('존 데이터', ['id', 'name', 'icon', 'description', 'dayBackground', 'nightBackground', 'flow', 'light', 'fishCount'], rows, 'zones');
  }

  function renderSpecies() {
    const rows = asArray(ADMIN_STATE.data.species?.json?.species).map((s) => [s.id, s.name, s.category, s.layer, s.description, s.habitat, s.feature, s.observePoint]);
    return renderDataSection('어종 데이터', ['id', 'name', 'category', 'layer', 'description', 'habitat', 'feature', 'observePoint'], rows, 'species');
  }

  function renderDexCards() {
    const rows = asArray(ADMIN_STATE.data.dexCards?.json?.cards).map((c) => [c.id, c.name, c.type, c.rarity, c.rarityLabel, valueText(c.zones), c.image, assetStatusForPath(c.image), c.habitat, c.feature, c.point]);
    return renderDataSection('도감 카드', ['id', 'name', 'type', 'rarity', 'rarityLabel', 'zones', 'image', 'HEAD', 'habitat', 'feature', 'point'], rows, 'dexCards');
  }

  function renderMissions() {
    const rows = asArray(ADMIN_STATE.data.missions?.json?.missions).map((m) => [m.id, m.title, m.description, m.zone, m.speciesId, m.requiredCount, m.completeText]);
    return renderDataSection('미션', ['id', 'title', 'description', 'zone', 'speciesId', 'requiredCount', 'completeText'], rows, 'missions');
  }

  function renderAudioScripts() {
    const rows = asArray(ADMIN_STATE.data.audioScripts?.json?.audioScripts).map((a) => [a.id, a.type, a.title, a.emoji, a.text, a.shortText, a.audioPath === null ? 'TTS fallback 정상' : a.audioPath, a.audioPath ? assetStatusForPath(a.audioPath) : 'TTS', a.fallbackTts]);
    return renderDataSection('음성 스크립트', ['id', 'type', 'title', 'emoji', 'text', 'shortText', 'audioPath', 'HEAD', 'fallbackTts'], rows, 'audioScripts');
  }

  function renderUiTexts() {
    const obj = ADMIN_STATE.data.uiTexts?.json?.uiTexts || {};
    const rows = Object.entries(obj).map(([key, value]) => [key, value]);
    return renderDataSection('UI 문구', ['key', 'value'], rows, 'uiTexts');
  }

  function assetStatusForPath(path) {
    if (!path) return 'empty';
    const found = Object.values(ADMIN_STATE.assetChecks).find((item) => item.path === path);
    if (!found) return 'not-checked';
    if (found.exists === true) return 'exists';
    if (found.exists === false) return 'missing';
    return 'unknown';
  }

  function renderAssets() {
    const assets = ADMIN_STATE.data.assetsManifest?.json?.assets || {};
    const backgroundRows = asArray(assets.backgrounds).map((b) => [b.id, b.zoneId, b.time, b.path, getPathExtension(b.path), assetStatusForPath(b.path), b.fallbackPath, getPathExtension(b.fallbackPath), assetStatusForPath(b.fallbackPath), b.adminEditable]);
    const fishRows = asArray(assets.fish).map((f) => [f.id, f.speciesId, f.usage, f.path, getPathExtension(f.path), assetStatusForPath(f.path), f.adminEditable]);
    return `
      <section class="admin-section">
        <h2>자산 경로</h2>
        ${renderPanelStatus('assetsManifest')}
        <div class="admin-warning"><strong>배경 경로 확인:</strong> app.js, index.html preload, assets_manifest.json, 실제 파일 확장자가 모두 일치해야 합니다.</div>
        <article class="admin-card admin-wide"><h3>Backgrounds</h3>${renderTable(['id', 'zoneId', 'time', 'path', 'ext', 'HEAD', 'fallbackPath', 'fallbackExt', 'fallback HEAD', 'adminEditable'], backgroundRows)}</article>
        <article class="admin-card admin-wide"><h3>Fish</h3>${renderTable(['id', 'speciesId', 'usage', 'path', 'ext', 'HEAD', 'adminEditable'], fishRows)}</article>
        ${renderRawJson('assetsManifest')}
      </section>`;
  }

  function renderPanelStatus(key) {
    const entry = ADMIN_STATE.data[key];
    const issues = entry?.validation?.issues || [];
    const required = issues.filter((i) => i.type === 'missing-required').length;
    const recommended = issues.filter((i) => i.type === 'missing-recommended').length;
    const asset = ADMIN_STATE.warnings.filter((i) => i.key === key && i.type === 'path-mismatch').length;
    return `<div class="admin-panel-status">${renderStatusChip(dataStatus(key))}<span>${escapeHtml(ADMIN_DATA_ENDPOINTS[key] || '')}</span><small>필수 ${required} · 권장 ${recommended} · 자산 ${asset}</small></div>`;
  }

  function renderRawJson(key) {
    const entry = ADMIN_STATE.data[key];
    return `<details class="admin-details"><summary>원본 JSON 보기</summary><pre>${formatJson(entry?.json || {})}</pre></details>`;
  }

  function renderDataSection(title, headers, rows, key) {
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
        <div class="admin-summary-grid">
          ${metricCard('위험', ADMIN_STATE.warnings.filter((w) => w.level === 'danger').length, ADMIN_STATE.metrics.dangerIssues ? 'danger' : 'ok', 'danger')}
          ${metricCard('확인 필요', ADMIN_STATE.warnings.filter((w) => w.level === 'warning').length, 'check', 'warning')}
          ${metricCard('정보', ADMIN_STATE.warnings.filter((w) => w.level === 'info').length, 'info', 'info')}
          ${metricCard('로드 실패', ADMIN_STATE.errors.length, ADMIN_STATE.errors.length ? 'fallback' : 'ok', 'errors')}
          ${metricCard('HEAD unknown', ADMIN_STATE.metrics.headUnknown, ADMIN_STATE.metrics.headUnknown ? 'check' : 'ok', 'unknown')}
        </div>
        <details class="admin-details" open><summary>경고 목록</summary><pre>${formatJson(ADMIN_STATE.warnings)}</pre></details>
        <details class="admin-details"><summary>자산 HEAD 검사</summary><pre>${formatJson(ADMIN_STATE.assetChecks)}</pre></details>
        <details class="admin-details"><summary>오류 목록</summary><pre>${formatJson(ADMIN_STATE.errors)}</pre></details>
        <details class="admin-details"><summary>전체 상태 JSON</summary><pre>${formatJson(ADMIN_STATE)}</pre></details>
      </section>`;
  }

  function renderMainContent() {
    try {
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
    } catch (error) {
      return `<section class="admin-section"><article class="admin-card"><h2>섹션 표시 실패</h2><p>${escapeHtml(error && error.message ? error.message : error)}</p></article></section>`;
    }
  }

  function renderApp() {
    if (!app) return;
    app.innerHTML = `
      <div class="admin-shell">
        ${renderSidebar()}
        <main class="admin-main">
          <header class="admin-header">
            <div><h1>퐁당퐁당 관리자 preview</h1><p>v30A-1 · 읽기 전용 · 저장/수정/삭제 비활성</p></div>
            <button class="admin-refresh" id="adminRefresh" ${ADMIN_STATE.loading ? 'disabled' : ''}>${ADMIN_STATE.loading ? '불러오는 중' : '다시 불러오기'}</button>
          </header>
          ${renderReadonlyBanner()}
          ${ADMIN_STATE.warnings.length ? `<section class="admin-warning-list">${ADMIN_STATE.warnings.slice(0, 6).map((w) => `<div class="admin-warning admin-issue-${escapeHtml(w.level)}"><strong>${escapeHtml(w.key)}</strong> ${escapeHtml(w.message)}<small>${escapeHtml(w.type)} · ${escapeHtml(w.target)}</small></div>`).join('')}</section>` : ''}
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

  window.PondangAdminPreview = { state: ADMIN_STATE, reload: loadAllAdminData };
  renderApp();
  loadAllAdminData();
})();
