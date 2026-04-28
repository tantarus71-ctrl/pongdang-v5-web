# STEP 2026-04-28 관리자 preview 검증/자산 검사 강화

## 1. 목적

이번 단계의 목적은 읽기 전용 관리자 preview UI의 안정성, 성능, 기능성을 강화하는 것이다.

관리자 preview는 여전히 저장/수정/삭제 기능이 없는 진단 화면이다. 이번 단계에서는 JSON 필드 검증, 자산 경로 검사, audioPath 검사, 중복 fetch 방지, 경고 중복 제거를 강화했다.

---

## 2. 수정 파일

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/admin-preview.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/admin-preview.css
```

문서 기록:

```text
docs/STEP_2026-04-28_ADMIN_VALIDATION_ASSET_CHECK.md
docs/MASTER_APPEND_2026-04-28_ADMIN_VALIDATION_ASSET_CHECK.md
```

---

## 3. 강화한 검증 규칙

각 JSON별 필수 필드와 권장 필드를 분리했다.

- 필수 필드 누락: `danger` / `missing-required`
- 권장 필드 누락: `warning` / `missing-recommended`
- 구조 불일치: `fallback`
- 경로 문제: `path-mismatch`
- 음성 경로 문제: `audio-check`

경고 객체는 아래 형태로 표준화했다.

```js
{
  key: 'assetsManifest',
  level: 'danger' | 'warning' | 'info',
  type: 'missing-required' | 'missing-recommended' | 'path-mismatch' | 'audio-check' | 'structure' | 'readonly',
  message: '표시 문구',
  target: '필드명 또는 항목 id'
}
```

---

## 4. 자산 경로 검사 방식

아래 경로를 검사 대상으로 삼았다.

- `assets_manifest.json`의 `backgrounds[].path`
- `assets_manifest.json`의 `backgrounds[].fallbackPath`
- `assets_manifest.json`의 `fish[].path`
- `dex_cards.json`의 `image`
- `audio_scripts.json`의 `audioPath`가 문자열인 경우

검사 내용:

- 확장자 존재 여부
- jpg/png/webp 계열 여부
- path와 fallbackPath 확장자 불일치
- zones.json 배경 경로와 assets_manifest.json 배경 경로 불일치
- HEAD 요청을 통한 자산 존재 여부 확인

HEAD 결과는 다음으로 분류한다.

- `exists: true`
- `exists: false`
- `exists: unknown`

주의: GitHub Pages, 로컬 파일, 브라우저 정책에 따라 HEAD 확인은 unknown이 될 수 있다. 이 경우 화면이 죽지 않고 “확인 필요”로 표시한다.

---

## 5. audioPath 검사 방식

규칙:

- `audioPath === null`: TTS fallback 정상
- `audioPath === ''`: 확인 필요
- `audioPath`가 문자열: HEAD 검사 대상
- `fallbackTts === false`이고 `audioPath`가 없으면 위험
- `fallbackTts`가 boolean이 아니면 확인 필요

---

## 6. 성능 최적화 내용

- `ADMIN_STATE.loading` 중 다시 불러오기 중복 실행 방지
- loading 중 버튼 disabled 처리
- 데이터 로드 시작 시 1회 렌더
- 데이터 로드 완료 후 1회 렌더
- fetch 완료마다 렌더하지 않음
- 경고 중복 제거 `dedupeWarnings()` 적용
- 자산 HEAD 검사 대상을 30개 이하로 제한
- raw JSON details는 기본 닫힘 유지

---

## 7. UI 강화 내용

대시보드에 검증 요약 카드를 추가했다.

- 필수 필드 오류 수
- 권장 필드 경고 수
- 자산 경로 경고 수
- Audio 경고 수
- HEAD unknown 수

각 데이터 섹션 상단에는 다음 요약을 표시한다.

- 로드 상태
- 필수 필드 문제 수
- 권장 필드 문제 수
- 자산 문제 수
- 원본 경로

진단 로그에는 다음을 표시한다.

- 위험/확인 필요/정보 수
- 로드 실패 수
- HEAD unknown 수
- 경고 목록
- 자산 HEAD 검사 결과
- 오류 목록
- 전체 상태 JSON

---

## 8. 건드리지 않은 파일/기능

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

---

## 9. 검증 기록

GitHub 커넥터를 통해 파일 수정은 완료했다.

로컬/실기기에서 추가 확인이 필요하다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
```

브라우저 확인 경로:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
```

확인 항목:

- 대시보드 표시
- 9개 탭 전환
- 필수/권장 필드 경고 표시
- 자산 경로 검사 표시
- audioPath 검사 표시
- loading 중 다시 불러오기 disabled
- 저장/수정/삭제 기능 없음
- 기존 수족관 앱 영향 없음

---

## 10. 남은 리스크

- 실제 앱 화면에 JSON 반영은 아직 없다.
- 편집/저장 기능은 아직 없다.
- HEAD 검사는 환경에 따라 unknown 가능하다.
- 배경 jpg/png 기준은 다음 단계에서 실제 통일해야 한다.
- 실기기 모바일 QA가 필요하다.

---

## 11. 다음 단계 제안

다음 단계는 편집 기능이 아니다.

권장 다음 단계:

```text
배경 jpg/png 기준 통일 작업
```

배경 기준을 `app.js`, `index.html preload`, `assets_manifest.json`, 실제 파일 기준으로 통일한 뒤 관리자 편집 UI 설계로 넘어간다.
