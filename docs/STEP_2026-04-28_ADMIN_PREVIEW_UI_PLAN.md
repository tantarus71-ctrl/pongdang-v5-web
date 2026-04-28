# STEP 2026-04-28 관리자 preview UI 구성안

## 1. 목적

이번 단계의 목적은 `퐁당퐁당 곤지암천 v5 / v30A-1 audio stability final` 전체 프로그램 구조를 다시 점검하고, 다음 단계에서 구현할 `읽기 전용 관리자 preview UI`의 화면 구성을 확정하는 것이다.

이번 단계에서는 실제 관리자 화면을 구현하지 않는다. 기존 수족관 실행 화면, `app.js`, `data-loader.js`, `main.css`, `data/*.json`은 수정하지 않는다.

관리자 preview UI는 저장/수정/삭제 기능 없이 현재 데이터 로드 상태, fallback 상태, JSON 데이터 미리보기, 누락 필드, 자산 경로 위험을 확인하는 진단용 화면이다.

---

## 2. 전체 프로그램 점검 요약

### 2.1 기준 실행 구조

| 항목 | 기준 |
|---|---|
| 저장소 | `tantarus71-ctrl/pongdang-v5-web` |
| 브랜치 | `main` |
| 기준 실행 폴더 | `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/` |
| 기준 HTML | `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html` |
| 기준 JS | `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js` |
| data loader | `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/data-loader.js` |
| 기준 CSS | `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/main.css` |

### 2.2 현재 실행 진입 흐름

예상 실행 흐름은 다음과 같다.

```text
index.html
→ app_assets/v4837_discovery_card_ux_quality.html
→ app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
```

v30A1 실행 파일 안에서는 다음 순서로 스크립트가 연결되어야 한다.

```html
<script src="./src/data-loader.js?v=30A1-data-loader" defer></script>
<script src="./src/app.js?v=30A1-assetfix" defer></script>
```

`data-loader.js`는 외부 JSON을 비차단 방식으로 읽고, `app.js`는 기존 런타임 기준으로 계속 실행된다.

---

## 3. 현재 data JSON 범위

현재 외부 데이터 초안은 아래 7개다.

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/zones.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/species.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/dex_cards.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/missions.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/audio_scripts.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/ui_texts.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/assets_manifest.json
```

현재 화면은 이 JSON을 직접 반영하지 않는다. 기존 `app.js` 내부 기본 데이터가 우선이다. JSON은 관리자 preview와 향후 관리자 편집 기능을 위한 사전 데이터다.

---

## 4. 발견된 구조 리스크

### 4.1 배경 경로 확장자 충돌 가능성

이전 전체 디버깅에서 `app.js`, `index.html preload`, `assets_manifest.json`, 실제 배경 파일 간 `.jpg` / `.png` 기준이 어긋날 가능성이 확인되었다.

관리자 preview UI에는 반드시 `자산 경로 점검` 메뉴를 넣어야 한다.

경고 문구:

```text
배경 경로는 app.js, index.html preload, assets_manifest.json, 실제 파일 확장자가 모두 일치해야 합니다.
jpg/png 기준이 다르면 배경이 표시되지 않을 수 있습니다.
```

### 4.2 JSON은 아직 앱 화면에 적극 반영되지 않음

현재 `data-loader.js`는 JSON을 읽고 진단 상태를 노출하지만, 기존 앱 화면 데이터와 직접 병합하지 않는다.

따라서 관리자 preview UI에는 다음 안내가 필요하다.

```text
현재 앱 화면은 app.js 내부 기본 데이터를 우선 사용합니다.
외부 JSON은 관리자 기능 준비용으로 로드됩니다.
```

### 4.3 저장 기능 추가 전 안전장치 필요

관리자 preview UI는 읽기 전용으로 시작해야 한다. 저장/수정/삭제 기능은 데이터 검증, 백업, fallback, 실기기 QA가 끝난 뒤 붙인다.

---

## 5. 관리자 preview UI 목적

관리자 preview UI의 목적은 다음과 같다.

1. 외부 JSON 7개가 정상 로드되는지 확인한다.
2. fallback 발생 여부를 확인한다.
3. 각 JSON의 주요 내용을 카드/테이블로 미리 본다.
4. 필수 필드 누락을 확인한다.
5. 이미지/오디오/배경 경로 위험을 표시한다.
6. 향후 편집 기능 추가 전 데이터 구조를 검증한다.
7. 기존 어린이용 수족관 화면과 관리자 진단 화면을 분리한다.

---

## 6. 권장 파일 구조

관리자 preview UI는 기존 수족관 앱 화면 안에 넣지 않는다. 별도 페이지로 분리한다.

권장 구조:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/admin-preview.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/admin-preview.css
```

초기 접속 경로:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
```

루트 런처에는 아직 연결하지 않는다. 처음에는 개발자/관리자 직접 URL 접근만 허용한다.

---

## 7. 관리자 preview UI 메뉴 구성

### A. 대시보드

목적: 전체 상태 요약.

표시 항목:

- 현재 버전
- 실행 기준 폴더
- data loader 상태
- JSON 전체 로드 성공 수
- fallback 발생 수
- 오류 수
- 마지막 로드 시각
- 현재 런타임 소스: `app.js-defaults-first`
- 저장 기능 비활성 안내

카드:

1. 로더 상태 카드
2. JSON 로드 현황 카드
3. fallback 현황 카드
4. 위험 경고 카드
5. 다음 단계 안내 카드

### B. 존 데이터

대상: `data/zones.json`

표시 항목:

- `id`
- `name`
- `icon`
- `description`
- `dayBackground`
- `nightBackground`
- `flow`
- `light`
- `fishCount`
- 필수 필드 누락 여부
- 배경 경로 확장자 경고

### C. 어종 데이터

대상: `data/species.json`

표시 항목:

- `id`
- `name`
- `category`
- `layer`
- `description`
- `habitat`
- `feature`
- `observePoint`
- 필수 필드 누락 여부

### D. 도감 카드

대상: `data/dex_cards.json`

표시 항목:

- `id`
- `name`
- `type`
- `rarity`
- `rarityLabel`
- `zones`
- `image`
- `habitat`
- `feature`
- `point`
- 이미지 경로 경고

### E. 미션

대상: `data/missions.json`

표시 항목:

- `id`
- `title`
- `description`
- `zone`
- `speciesId`
- `requiredCount`
- `completeText`
- 필수 필드 누락 여부

### F. 음성 스크립트

대상: `data/audio_scripts.json`

표시 항목:

- `id`
- `type`
- `title`
- `emoji`
- `text`
- `shortText`
- `audioPath`
- `fallbackTts`
- `audioPath` null 여부
- 실제 mp3 없을 때 TTS fallback 사용 안내

주의:

```text
실제 mp3 파일이 없으면 audioPath는 null이어야 합니다.
audioPath가 null이면 TTS fallback을 사용합니다.
```

### G. UI 문구

대상: `data/ui_texts.json`

표시 항목:

- `brandTitle`
- `defaultZoneDescription`
- `hint`
- `bottomCardTitle`
- `bottomCardSubtitle`
- `dexTitle`
- `missionTitle`
- `cameraTitle`
- `audioTitle`

### H. 자산 경로

대상: `data/assets_manifest.json`

표시 항목:

- background id
- zoneId
- time
- path
- fallbackPath
- fish id
- speciesId
- usage
- path
- adminEditable
- jpg/png 충돌 가능성
- 실제 파일 존재 여부 확인 가능 여부

### I. 진단 로그

대상: `window.PondangV30A1DataAudit()` 결과.

표시 항목:

- `DATA_LOADER_STATE.errors`
- `loadedKeys`
- `fallbackKeys`
- `attempted`
- `loaded`
- `failed`
- `startedAt`
- `finishedAt`

로그는 접기/펼치기 구조로 설계한다.

---

## 8. 상태칩 기준

| 상태 | 의미 |
|---|---|
| 정상 | JSON 로드 성공 + 필수 필드 있음 |
| 확인 필요 | 로드는 됐지만 일부 선택 필드 누락 |
| fallback | JSON 로드 실패 또는 구조 불일치 |
| 위험 | 경로 충돌, 이미지 경로 의심, audioPath 경로 있음 but 실제 파일 확인 불가 |
| 정보 | 현재 읽기 전용, 저장 기능 없음 |

---

## 9. UX 기준

관리자 preview UI는 관리자가 보는 화면이지만 프로젝트의 수중 톤은 유지한다.

PC 권장 레이아웃:

- 좌측 사이드바 220px
- 우측 콘텐츠 1fr
- 상단 상태바
- 카드형 섹션
- 데이터 테이블
- 상태칩

모바일 권장 레이아웃:

- 상단 타이틀
- 가로 스크롤 탭
- 카드 리스트
- 상태칩
- 접기/펼치기 로그

디자인 톤:

- 어두운 수중 배경
- 반투명 카드
- 높은 가독성
- 작은 데이터는 카드, 긴 데이터는 테이블
- 저장/수정 버튼 없음

---

## 10. 필수 안내 문구

관리자 preview 상단에 반드시 아래 문구를 표시한다.

```text
이 화면은 읽기 전용 관리자 preview입니다.
현재 앱 화면은 app.js 내부 기본 데이터를 우선 사용합니다.
외부 JSON은 관리자 기능 준비용으로 로드됩니다.
저장/수정/삭제 기능은 아직 비활성화되어 있습니다.
```

---

## 11. 구현 시 건드리면 안 되는 파일

다음 단계에서 실제 UI를 만들 때도 아래 파일은 수정하지 않는 것을 원칙으로 한다.

- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js`
- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/main.css`
- 기존 `data/*.json` 내용
- 배경 이미지 파일
- 물고기 이미지 파일
- 루트 `index.html`
- `app_assets/v4837_discovery_card_ux_quality.html`

다음 단계에서 수정 가능한 파일은 원칙적으로 아래 3개 신규 파일만이다.

```text
admin-preview.html
src/admin-preview.js
src/styles/admin-preview.css
```

---

## 12. 다음 단계 구현 프롬프트 요약

다음 단계는 아래 기준으로 진행한다.

```text
읽기 전용 관리자 preview UI를 구현한다.
admin-preview.html, src/admin-preview.js, src/styles/admin-preview.css 3개 신규 파일만 만든다.
기존 index.html, app.js, data-loader.js, main.css, data/*.json은 수정하지 않는다.
관리자 화면은 data/*.json을 직접 fetch해서 읽고, window.PondangV30A1DataAudit가 있으면 함께 표시한다.
저장/수정/삭제 기능은 넣지 않는다.
```

---

## 13. 완료 판정

이번 설계 단계는 다음 조건을 만족하면 완료다.

- 전체 프로그램 구조 점검 완료
- 관리자 preview UI 목적 확정
- 관리자 preview UI 메뉴 구조 확정
- 각 메뉴별 표시 데이터 확정
- 상태칩/경고 문구 기준 확정
- 별도 파일 구조 권장 완료
- 다음 단계가 `읽기 전용 관리자 preview UI 구현`으로 명확히 이어짐
