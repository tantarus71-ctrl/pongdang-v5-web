# MASTER 추가 기록 - 2026-04-28 배경 경로 기준 통일 준비

## [2026-04-28 배경 경로 기준 통일 준비]

- 목표:
  app.js, index.html preload, data/zones.json, data/assets_manifest.json, 실제 assets/bg 파일의 배경 경로 기준을 통일하기 전, 관리자 preview의 검증 엔진을 강화하고 향후 추가/수정/삭제 안정 규칙을 확정한다.

- 수정 파일:
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/admin-preview.js`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/admin-preview.css`
  - `docs/STEP_2026-04-28_BACKGROUND_PATH_STANDARDIZATION.md`
  - `docs/MASTER_APPEND_2026-04-28_BACKGROUND_PATH_STANDARDIZATION.md`

- 건드리지 않은 기능:
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
  - 음성
  - 도감
  - 미션
  - 카메라
  - GPS
  - 관리자 편집/저장/삭제 기능

- 검증:
  - 관리자 preview에 필수/권장 필드 검증 강화
  - 자산 path/fallbackPath 확장자 비교 강화
  - zones.json과 assets_manifest.json 배경 경로 비교 강화
  - HEAD 기반 자산 존재 확인 추가
  - audioPath/TTS fallback 검사 강화
  - loading 중 중복 fetch 방지 추가
  - 경고 중복 제거 추가
  - 검증 요약 카드와 경고 목록 UI 추가

- 발견 오류:
  - GitHub 커넥터로 이미지 바이너리 1개는 직접 확인됐으나, 전체 바이너리 파일 목록 확인은 제한적이었다.
  - 따라서 이번 단계에서 실제 배경 10개 슬롯 통일까지 완료했다고 판단하지 않는다.

- 해결:
  - 추측으로 jpg/png를 일괄 변경하지 않고, 관리자 preview가 경로 충돌을 더 정확히 보여주도록 먼저 강화했다.
  - 향후 추가/수정/삭제 규칙을 문서화했다.

- 남은 리스크:
  - 배경 10개 슬롯 실제 파일 존재 전수 확인이 아직 필요하다.
  - 기준 확장자 결정은 실제 파일 목록 확인 후 진행해야 한다.
  - HEAD 검사는 배포/로컬 환경에 따라 unknown 가능하다.
  - GitHub Pages 배포 후 캐시 영향을 확인해야 한다.

- 다음 단계 제안:
  Codex 로컬 파일 시스템에서 assets/bg 10개 슬롯의 jpg/png/webp 실제 존재 여부를 전수 확인한 뒤, app.js / index preload / zones.json / assets_manifest.json 경로를 실제 기준으로 통일한다.
