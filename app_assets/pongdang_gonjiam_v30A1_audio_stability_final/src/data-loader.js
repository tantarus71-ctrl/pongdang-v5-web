/* 퐁당퐁당 곤지암천 v30A-1 - 관리자 데이터 JSON 로더 + fallback 진단 전용 */
(() => {
  'use strict';

  /*
    이 파일은 관리자 페이지 사전 준비용 데이터 로더다.
    현재 앱의 기본 런타임 데이터는 src/app.js 내부 데이터를 계속 사용한다.
    외부 JSON 로드가 실패해도 앱 실행은 중단하지 않는다.
  */

  const DATA_ENDPOINTS = {
    zones: 'data/zones.json',
    species: 'data/species.json',
    dexCards: 'data/dex_cards.json',
    missions: 'data/missions.json',
    audioScripts: 'data/audio_scripts.json',
    uiTexts: 'data/ui_texts.json',
    assetsManifest: 'data/assets_manifest.json'
  };

  const DATA_LOADER_STATE = {
    attempted: false,
    loaded: false,
    failed: false,
    errors: [],
    loadedKeys: [],
    fallbackKeys: [],
    startedAt: null,
    finishedAt: null,
    endpoints: DATA_ENDPOINTS
  };

  const EXTERNAL_DATA_BUNDLE = {};

  const nowIso = () => new Date().toISOString();
  const cloneState = () => JSON.parse(JSON.stringify(DATA_LOADER_STATE));

  function recordError(key, message, detail) {
    DATA_LOADER_STATE.errors.push({
      key,
      message,
      detail: detail ? String(detail).slice(0, 240) : '',
      at: nowIso()
    });
  }

  function validateExternalJson(key, json) {
    if (!json || typeof json !== 'object') return false;
    switch (key) {
      case 'zones':
        return Array.isArray(json.zones) && json.zones.every((item) => item && item.id && item.name);
      case 'species':
        return Array.isArray(json.species) && json.species.every((item) => item && item.id && item.name);
      case 'dexCards':
        return Array.isArray(json.cards) && json.cards.every((item) => item && item.id && item.name);
      case 'missions':
        return Array.isArray(json.missions) && json.missions.every((item) => item && item.id && item.title);
      case 'audioScripts':
        return Array.isArray(json.audioScripts) && json.audioScripts.every((item) => item && item.id && item.text && typeof item.fallbackTts === 'boolean');
      case 'uiTexts':
        return !!json.uiTexts && typeof json.uiTexts === 'object';
      case 'assetsManifest':
        return !!json.assets && typeof json.assets === 'object';
      default:
        return false;
    }
  }

  async function safeFetchJson(path, key) {
    try {
      const cacheBust = path.includes('?') ? '&' : '?';
      const response = await fetch(`${path}${cacheBust}cache=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) {
        recordError(key, `HTTP ${response.status}`, path);
        return null;
      }
      const json = await response.json();
      if (!validateExternalJson(key, json)) {
        recordError(key, 'JSON structure validation failed', path);
        return null;
      }
      return json;
    } catch (error) {
      recordError(key, 'JSON fetch or parse failed', error && error.message ? error.message : error);
      return null;
    }
  }

  function mergeExternalDataWithDefaults(bundle) {
    /*
      이번 단계에서는 화면 런타임 데이터에 직접 병합하지 않는다.
      향후 관리자 preview 단계에서 읽기 전용으로 먼저 연결한다.
      기본 데이터 fallback은 src/app.js 내부 데이터를 그대로 사용한다.
    */
    return {
      externalData: bundle,
      fallbackRequired: DATA_LOADER_STATE.fallbackKeys.length > 0,
      runtimeSource: 'app.js-defaults-first'
    };
  }

  async function loadExternalDataBundle() {
    DATA_LOADER_STATE.attempted = true;
    DATA_LOADER_STATE.startedAt = nowIso();
    DATA_LOADER_STATE.finishedAt = null;
    DATA_LOADER_STATE.loaded = false;
    DATA_LOADER_STATE.failed = false;
    DATA_LOADER_STATE.loadedKeys = [];
    DATA_LOADER_STATE.fallbackKeys = [];
    DATA_LOADER_STATE.errors = [];

    const entries = Object.entries(DATA_ENDPOINTS);
    const results = await Promise.allSettled(entries.map(async ([key, path]) => {
      const json = await safeFetchJson(path, key);
      return { key, path, json };
    }));

    results.forEach((result, index) => {
      const [key] = entries[index];
      if (result.status === 'fulfilled' && result.value && result.value.json) {
        EXTERNAL_DATA_BUNDLE[key] = result.value.json;
        DATA_LOADER_STATE.loadedKeys.push(key);
      } else {
        DATA_LOADER_STATE.fallbackKeys.push(key);
        if (result.status === 'rejected') {
          recordError(key, 'Promise rejected', result.reason);
        }
      }
    });

    Object.keys(DATA_ENDPOINTS).forEach((key) => {
      if (!DATA_LOADER_STATE.loadedKeys.includes(key) && !DATA_LOADER_STATE.fallbackKeys.includes(key)) {
        DATA_LOADER_STATE.fallbackKeys.push(key);
      }
    });

    DATA_LOADER_STATE.loaded = DATA_LOADER_STATE.loadedKeys.length > 0;
    DATA_LOADER_STATE.failed = DATA_LOADER_STATE.loadedKeys.length === 0;
    DATA_LOADER_STATE.finishedAt = nowIso();

    window.PondangV30A1RuntimeData = mergeExternalDataWithDefaults(EXTERNAL_DATA_BUNDLE);
    return window.PondangV30A1RuntimeData;
  }

  function getRuntimeData() {
    return {
      state: cloneState(),
      bundle: EXTERNAL_DATA_BUNDLE,
      runtimeSource: 'app.js-defaults-first',
      note: '현재 화면은 기존 app.js 기본 데이터를 우선 사용한다. 외부 JSON은 관리자 preview 준비용으로만 로드된다.'
    };
  }

  function dataAudit() {
    return getRuntimeData();
  }

  function exposeDataAudit() {
    window.PondangV30A1DataLoader = {
      endpoints: DATA_ENDPOINTS,
      state: DATA_LOADER_STATE,
      load: loadExternalDataBundle,
      getRuntimeData,
      audit: dataAudit
    };
    window.PondangV30A1DataAudit = dataAudit;
  }

  function bridgeExistingDebugObject() {
    const debugObject = window.PondangV30A1Debug;
    if (!debugObject || typeof debugObject.audit !== 'function' || debugObject.__dataLoaderBridgeApplied) return false;
    const originalAudit = debugObject.audit.bind(debugObject);
    debugObject.audit = (...args) => {
      const result = originalAudit(...args) || {};
      return Object.assign({}, result, { dataLoader: dataAudit() });
    };
    debugObject.__dataLoaderBridgeApplied = true;
    return true;
  }

  function scheduleDebugBridge() {
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (bridgeExistingDebugObject() || tries > 20) {
        window.clearInterval(timer);
      }
    }, 250);
  }

  exposeDataAudit();

  try {
    loadExternalDataBundle().catch(() => {});
  } catch (_) {
    DATA_LOADER_STATE.failed = true;
    DATA_LOADER_STATE.finishedAt = nowIso();
  }

  scheduleDebugBridge();
})();
