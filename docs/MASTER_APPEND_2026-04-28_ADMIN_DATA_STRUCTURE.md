# MASTER 추가 기록 - 2026-04-28 관리자 데이터 구조 사전 설계

이 문서는 `docs/MASTER_개발기획서_상시참조.txt`에 추가할 작업 기록이다. 원본 MASTER 문서가 긴 누적 파일이므로, 이번 작업 기록은 별도 append 문서로 보존한다.

## [2026-04-28 관리자 데이터 구조 사전 설계]

- 목표:
  관리자 페이지를 만들기 전에 `app.js` 내부 데이터 블록을 전수 식별하고, 관리자 수정 가능 데이터와 수정 금지 런타임 로직을 구분한다.

- 수정 파일:
  - `docs/STEP_2026-04-28_ADMIN_DATA_STRUCTURE_PLAN.md`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/_draft/zones.sample.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/_draft/species.sample.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/_draft/dex_cards.sample.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/_draft/missions.sample.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/_draft/audio_scripts.sample.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/_draft/ui_texts.sample.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/_draft/assets_manifest.sample.json`
  - `docs/MASTER_APPEND_2026-04-28_ADMIN_DATA_STRUCTURE.md`

- 건드리지 않은 기능:
  - `index.html` 화면 구조
  - `src/app.js` 런타임 로직
  - `src/styles/main.css` 레이아웃
  - 배경 이미지
  - 물고기 유영 엔진
  - 음성 재생 로직
  - 도감 작동
  - 미션 작동
  - 카메라 작동
  - GPS 권한 처리

- 검증:
  - 실행본 `app.js`는 수정하지 않았다.
  - `_draft` 샘플 JSON 7개를 생성했다.
  - 샘플 파일은 런타임에 연결하지 않았다.
  - 기존 앱 실행 경로와 기능을 건드리지 않았다.

- 발견 오류:
  - 이번 단계에서 런타임 오류는 발생하지 않았다.
  - 다만 이전 전체 디버깅에서 확인된 배경 확장자 `.jpg` / `.png` 기준 충돌 가능성은 별도 안정화 단계에서 계속 확인해야 한다.

- 해결:
  - 관리자 페이지 개발 전 기준 문서를 먼저 생성했다.
  - 실제 런타임 연결 없이 `_draft` 샘플 JSON만 생성해 기존 실행 안정성을 보존했다.

- 남은 리스크:
  - 실제 JSON loader는 아직 구현하지 않았다.
  - 관리자 페이지 UI는 아직 만들지 않았다.
  - JSON 로딩 실패 fallback 구조는 다음 단계에서 구현해야 한다.
  - 관리자 저장 구조와 localStorage/파일 저장 방식은 아직 확정하지 않았다.

- 다음 단계 제안:
  관리자 페이지 UI를 만들기 전에 `data loader + fallback` 구조를 먼저 구현한다.
