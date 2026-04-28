# STEP 2026-04-28 data loader + fallback 구조 구현

## 1. 목적

이번 단계의 목적은 `퐁당퐁당 곤지암천 v5 / v30A-1 audio stability final` 기준본에 외부 JSON 데이터를 안전하게 읽을 수 있는 통로를 추가하는 것이다.

관리자 페이지 UI는 아직 만들지 않는다. 이번 단계에서는 관리자 페이지가 나중에 수정할 수 있는 `data/*.json` 파일을 준비하고, 해당 JSON 로드가 실패해도 기존 `src/app.js` 내부 기본 데이터로 앱이 계속 실행되도록 fallback 구조를 둔다.

---

## 2. 생성한 data JSON 파일

아래 7개 파일을 생성했다.

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/zones.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/species.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/dex_cards.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/missions.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/audio_scripts.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/ui_texts.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/assets_manifest.json
```

현재 이 JSON 파일들은 최소 초안이다. 전체 런타임 데이터를 대체하지 않는다.

---

## 3. 추가한 loader 파일

추가 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/data-loader.js
```

역할:

- `data/*.json` 7개를 비차단 방식으로 로드한다.
- 하나의 JSON이 실패해도 전체 앱 실행을 중단하지 않는다.
- 로드 성공/실패 상태를 `DATA_LOADER_STATE`에 기록한다.
- 기존 앱의 기본 런타임 데이터는 `src/app.js` 내부 기준을 계속 우선한다.
- 디버그 확인용으로 `window.PondangV30A1DataAudit()`을 노출한다.
- 기존 `window.PondangV30A1Debug.audit()`가 있을 경우 `dataLoader` 항목을 조용히 덧붙인다.

---

## 4. index.html 연결

아래 순서로 스크립트를 연결했다.

```html
<script src="./src/data-loader.js?v=30A1-data-loader" defer></script>
<script src="./src/app.js?v=30A1-assetfix" defer></script>
```

`data-loader.js`가 먼저 실행되지만, 앱 실행을 막지 않는다. 기존 `app.js`는 계속 기존 방식으로 실행된다.

---

## 5. fallback 원칙

이번 단계의 fallback 원칙은 다음과 같다.

1. JSON 파일이 없어도 앱 실행을 중단하지 않는다.
2. JSON 문법 오류가 있어도 앱 실행을 중단하지 않는다.
3. JSON 구조가 맞지 않으면 해당 key만 fallback 처리한다.
4. 외부 JSON이 로드되어도 기존 런타임 데이터를 즉시 대체하지 않는다.
5. 현재 화면은 `app.js` 내부 기본 데이터를 우선 사용한다.
6. 외부 JSON은 다음 단계의 읽기 전용 관리자 preview 준비용으로만 사용한다.

---

## 6. 디버그 확인 방법

브라우저 콘솔에서 다음 명령으로 확인한다.

```js
window.PondangV30A1DataAudit?.()
```

또는 기존 debug 객체가 bridge된 경우:

```js
window.PondangV30A1Debug.audit().dataLoader
```

예상 구조:

```js
{
  state: {
    attempted: true,
    loaded: true,
    failed: false,
    loadedKeys: ["zones", "species", "dexCards", "missions", "audioScripts", "uiTexts", "assetsManifest"],
    fallbackKeys: [],
    errors: []
  },
  runtimeSource: "app.js-defaults-first"
}
```

---

## 7. 이번 단계에서 건드리지 않은 기능

- 물고기 유영 엔진
- 음성 재생 핵심 로직
- 도감 렌더 구조
- 미션 진행 구조
- 카메라 저장 구조
- GPS 권한 처리
- CSS 레이아웃
- 배경 이미지
- 기존 `app.js` 내부 기본 데이터

---

## 8. 남은 리스크

- 실제 JSON 데이터는 아직 화면에 적극 반영하지 않는다.
- 관리자 페이지 UI는 아직 없다.
- GitHub Pages 배포 후 상대경로 fetch 동작을 실기기에서 재확인해야 한다.
- 브라우저 캐시와 인앱 브라우저 캐시에서 JSON 갱신 상태를 확인해야 한다.
- 이전 디버깅에서 지적된 배경 `.jpg` / `.png` 기준 충돌 가능성은 별도 안정화 대상이다.

---

## 9. 다음 단계 제안

다음 단계는 관리자 페이지를 바로 편집 가능하게 만드는 것이 아니라, 먼저 읽기 전용 관리자 preview UI를 만든다.

권장 다음 단계:

```text
읽기 전용 관리자 preview UI
```

이 화면에서는 `data/*.json` 로드 상태, JSON 내용 미리보기, fallback 상태, 누락 필드, 이미지 경로를 확인만 한다. 저장 기능은 넣지 않는다.
