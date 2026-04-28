# MASTER 추가 기록 - 2026-04-28 배경 JSON/manifest 경로 통일

## [2026-04-28 배경 JSON/manifest 경로 통일]

- 목표:
  app.js 기준 JPG 배경 경로에 맞춰 `zones.json`과 `assets_manifest.json`을 5존/10슬롯 기준으로 통일한다.

- 수정 파일:
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/zones.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/assets_manifest.json`
  - `docs/STEP_2026-04-28_BACKGROUND_JSON_MANIFEST_SYNC.md`
  - `docs/MASTER_APPEND_2026-04-28_BACKGROUND_JSON_MANIFEST_SYNC.md`

- 건드리지 않은 기능:
  - `src/app.js`
  - `index.html preload`
  - `src/data-loader.js`
  - `src/admin-preview.js`
  - `src/styles/main.css`
  - `src/styles/admin-preview.css`
  - 원본 이미지
  - optimized 후보
  - 물고기 유영
  - 음성
  - 도감
  - 미션
  - 카메라
  - GPS
  - 관리자 편집/저장 기능

- 검증:
  - `zones.json`을 5존 구조로 구성
  - `assets_manifest.json` backgrounds를 10개 슬롯 구조로 구성
  - active path를 JPG runtime 기준으로 통일
  - fallbackPath를 PNG 원본 후보 기준으로 보존
  - q88 optimized 후보는 아직 active/fallback에 반영하지 않음

- 발견 오류:
  - 기존 `zones.json`이 웃물 1개만 포함하고 PNG 기준이었다.
  - 기존 `assets_manifest.json` backgrounds가 `utmul_day` 1개만 포함하고 PNG active 기준이었다.
  - app.js 기준 JPG 경로와 data JSON 기준이 불일치했다.

- 해결:
  - `zones.json`을 5존 전체 구조로 확장했다.
  - `assets_manifest.json` backgrounds를 10개 슬롯 전체 구조로 확장했다.
  - app.js 기준 JPG path와 data JSON 기준을 통일했다.
  - PNG는 삭제하지 않고 fallbackPath로 보존했다.

- 남은 리스크:
  - q88 optimized 후보는 아직 정식 반영 전이다.
  - PNG fallbackPath는 용량이 크므로 실제 fallback 사용 여부는 별도 판단 필요하다.
  - 관리자 preview에서 path/fallbackPath 확장자 차이에 따른 의도된 경고가 남을 수 있다.
  - GitHub Pages 캐시 확인 필요.

- 다음 단계 제안:
  q88 후보를 preview 전용 테스트 플래그로만 앱 화면에 임시 적용해 품질을 확인한다.
