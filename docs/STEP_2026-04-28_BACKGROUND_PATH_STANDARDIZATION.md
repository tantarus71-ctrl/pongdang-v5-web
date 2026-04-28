# STEP 2026-04-28 배경 경로 기준 통일 준비 및 안정화 규칙

## 1. 목적

이번 단계의 목적은 배경 경로 기준 통일 작업을 위한 사전 안정화와 관리자 preview 검증 강화를 완료하는 것이다.

직전 관리자 preview는 단순 조회 중심이었다. 이번 단계에서는 향후 `app.js`, `index.html preload`, `data/zones.json`, `data/assets_manifest.json`, 실제 `assets/bg` 파일 사이의 jpg/png/webp 기준 충돌을 더 잘 드러내도록 검증 엔진을 강화했다.

이번 단계에서는 실제 배경 이미지 파일을 삭제하지 않았고, 기존 수족관 런타임 파일도 수정하지 않았다.

---

## 2. 수정 파일

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/admin-preview.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/admin-preview.css
```

추가 문서:

```text
docs/STEP_2026-04-28_BACKGROUND_PATH_STANDARDIZATION.md
docs/MASTER_APPEND_2026-04-28_BACKGROUND_PATH_STANDARDIZATION.md
```

---

## 3. 적용 내용

### 3.1 검증 엔진 강화

`admin-preview.js`에 아래 구조를 강화했다.

- JSON별 필수/권장 필드 분리
- 경고 객체 표준화
- 중복 경고 제거
- 자산 경로 후보 수집
- HEAD 기반 자산 존재 확인
- zones.json과 assets_manifest.json 배경 경로 비교
- path/fallbackPath 확장자 비교
- audioPath/TTS fallback 규칙 검사
- loading 중 중복 fetch 방지
- 섹션 렌더링 실패 격리

### 3.2 대시보드 성능/안정성 개선

대시보드에 다음 요약 카드를 추가했다.

- 필수 필드 오류 수
- 권장 필드 경고 수
- 자산 경로 경고 수
- Audio 경고 수
- HEAD unknown 수

### 3.3 CSS 보강

`admin-preview.css`에 아래 스타일을 추가했다.

- `.admin-summary-grid`
- `.admin-metric-card`
- `.admin-issue-list`
- `.admin-issue-item`
- `.admin-issue-danger`
- `.admin-issue-warning`
- `.admin-issue-info`
- `.admin-path-status`
- `.admin-chip-disabled`
- disabled refresh button 스타일

---

## 4. 배경 경로 기준 통일 작업 원칙

다음 실제 단계에서는 아래 10개 배경 슬롯을 기준으로 파일 존재 여부를 먼저 확인한다.

```text
assets/bg/upper/day
assets/bg/upper/night
assets/bg/rapid/day
assets/bg/rapid/night
assets/bg/soft-rapid/day
assets/bg/soft-rapid/night
assets/bg/deep/day
assets/bg/deep/night
assets/bg/pool/day
assets/bg/pool/night
```

각 슬롯별로 `.jpg`, `.jpeg`, `.png`, `.webp` 존재 여부를 확인한 뒤 기준 확장자를 결정한다.

---

## 5. 향후 추가/수정/삭제 규칙

### 5.1 추가 규칙

새 배경 추가 시:

1. `assets/bg/{zoneFolder}/{day|night}.{ext}`에 파일 추가
2. 실제 파일 로드 확인
3. `app.js` ZONES 경로 확인
4. `data/zones.json` 경로 확인
5. `data/assets_manifest.json` path 추가
6. 관리자 preview에서 HEAD 검사
7. 문서 기록

### 5.2 수정 규칙

기존 자산 경로 수정 시:

1. 기존 경로 기록
2. 새 파일 존재 확인
3. app.js / data JSON / assets_manifest 동시 확인
4. 관리자 preview 경고 확인
5. node --check
6. 문서 기록

### 5.3 삭제 규칙

삭제는 직접 하지 않는다.

우선순위:

1. 사용 경로에서 제외
2. assets_manifest에서 active false 또는 retired 표시
3. 백업 폴더로 이동
4. 일정 기간 후 삭제 여부 별도 판단

---

## 6. 건드리지 않은 파일/기능

- 기존 `index.html`
- 루트 `index.html`
- `app_assets/v4837_discovery_card_ux_quality.html`
- `src/app.js`
- `src/data-loader.js`
- `src/styles/main.css`
- `data/*.json`
- 배경 이미지
- 물고기 이미지
- 물고기 유영
- 음성 재생 로직
- 도감/미션/카메라/GPS 런타임
- 관리자 편집/저장/삭제 기능

---

## 7. 검증 필요 항목

로컬 또는 Codex 환경에서 아래 검증이 필요하다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
```

브라우저 확인:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
```

확인할 것:

- 대시보드 표시
- 9개 탭 전환
- 필수/권장 필드 검증 표시
- 자산 경로 HEAD 결과 표시
- path/fallbackPath 확장자 경고 표시
- audioPath 검사 표시
- 저장/수정/삭제 기능 없음

---

## 8. 남은 리스크

- 이번 단계는 배경 파일 실제 통일을 완료한 단계가 아니라, 통일을 위한 관리자 검증 엔진을 강화한 단계다.
- 실제 10개 배경 슬롯 파일 존재 전수 확인은 다음 단계에서 필요하다.
- GitHub 커넥터 환경에서는 바이너리 파일 목록 조회가 제한될 수 있으므로 Codex 로컬 파일 시스템에서 확인하는 것이 더 정확하다.
- HEAD 검사는 배포 환경에 따라 unknown으로 나올 수 있다.
- 배경 jpg/png 기준은 실제 파일 존재 확인 후 확정해야 한다.

---

## 9. 다음 단계 제안

다음 단계는 아래 작업이다.

```text
배경 10개 슬롯 실제 파일 존재 전수 확인 → 기준 확장자 결정 → app.js / index preload / zones.json / assets_manifest.json 경로 통일
```

편집/저장 기능은 이 다음 단계까지 완료된 뒤 설계한다.
