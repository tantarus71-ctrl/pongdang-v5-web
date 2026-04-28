# MASTER 추가 기록 - 2026-04-28 data loader + fallback 구조 구현

## [2026-04-28 data loader + fallback 구조 구현]

- 목표:
  관리자 페이지 사전 단계로 외부 JSON을 안전하게 읽고, 실패 시 기존 `app.js` 내부 기본 데이터로 fallback하는 구조를 만든다.

- 수정 파일:
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/zones.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/species.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/dex_cards.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/missions.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/audio_scripts.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/ui_texts.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/assets_manifest.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/data-loader.js`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html`
  - `docs/STEP_2026-04-28_DATA_LOADER_FALLBACK.md`
  - `docs/MASTER_APPEND_2026-04-28_DATA_LOADER_FALLBACK.md`

- 건드리지 않은 기능:
  - 물고기 유영 엔진
  - 음성 재생 핵심 로직
  - 도감 렌더 구조
  - 미션 진행 구조
  - 카메라 저장 구조
  - GPS 권한 처리
  - CSS 레이아웃
  - 배경 이미지
  - 기존 `src/app.js` 내부 기본 데이터

- 검증:
  - `data/*.json` 7개 생성 완료
  - `src/data-loader.js` 생성 완료
  - `index.html`에 `data-loader.js`를 `app.js` 이전 순서로 연결 완료
  - 외부 JSON 로더는 앱 실행을 차단하지 않는 비동기 구조로 작성
  - `window.PondangV30A1DataAudit()` 디버그 진단 함수 노출

- 발견 오류:
  - GitHub 커넥터 호출 중 일시적 내부 인자 오류가 1회 발생했다.
  - `missions.json` 최초 생성 요청이 안전 검사에서 1회 오탐 차단되었다.
  - 문서 생성 시 리소스 경로 오타가 1회 발생했다.

- 해결:
  - 같은 파일 요청을 재시도해 정상 커밋했다.
  - `missions.json` 문구를 단순화해 정상 생성했다.
  - 올바른 GitHub 리소스 경로로 문서를 다시 생성했다.

- 남은 리스크:
  - JSON 데이터는 아직 실제 화면에 적극 반영하지 않는다.
  - 관리자 페이지 UI는 아직 없다.
  - 실기기 모바일 fetch/cache 검증이 필요하다.
  - GitHub Pages 배포 후 상대경로 재확인이 필요하다.
  - 배경 `.jpg` / `.png` 기준 충돌 가능성은 별도 안정화 단계에서 계속 점검해야 한다.

- 다음 단계 제안:
  읽기 전용 관리자 preview UI를 만들되, 저장/수정 기능 없이 `data/*.json` 로드 상태와 fallback 상태만 보여준다.
