# MASTER 추가 기록 - 2026-04-28 관리자 preview UI 구성안

## [2026-04-28 관리자 preview UI 구성안]

- 목표:
  전체 프로그램 구조를 재점검하고, 저장 기능 없는 읽기 전용 관리자 preview UI의 화면 구성을 확정한다.

- 수정 파일:
  - `docs/STEP_2026-04-28_ADMIN_PREVIEW_UI_PLAN.md`
  - `docs/MASTER_APPEND_2026-04-28_ADMIN_PREVIEW_UI_PLAN.md`

- 건드리지 않은 기능:
  - `index.html` 실행 구조
  - `src/app.js` 런타임
  - `src/data-loader.js` 로더
  - `src/styles/main.css`
  - `data/*.json`
  - 물고기 유영
  - 음성
  - 도감
  - 미션
  - 카메라
  - GPS

- 검증:
  - 기준 실행 폴더를 `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`로 재확인했다.
  - data loader와 `data/*.json` 7개 구조를 관리자 preview UI의 읽기 대상으로 반영했다.
  - 관리자 preview UI는 별도 페이지 `admin-preview.html`로 분리하는 방향을 확정했다.
  - 저장/수정/삭제 기능은 이번 설계 범위에서 제외했다.

- 발견 오류:
  - 이번 단계에서는 런타임 파일을 수정하지 않았으므로 신규 실행 오류는 발생하지 않았다.
  - 이전 단계에서 남은 배경 `.jpg` / `.png` 기준 충돌 가능성은 관리자 preview의 자산 경로 점검 메뉴에 반영해야 할 리스크로 기록했다.

- 해결:
  - 관리자 화면을 기존 어린이용 수족관 화면 안에 넣지 않고 별도 파일로 분리하는 설계 기준을 확정했다.
  - 대시보드, 존 데이터, 어종 데이터, 도감 카드, 미션, 음성 스크립트, UI 문구, 자산 경로, 진단 로그 메뉴를 확정했다.
  - 상태칩 기준을 정상/확인 필요/fallback/위험/정보로 정리했다.

- 남은 리스크:
  - 관리자 preview UI는 아직 구현하지 않았다.
  - JSON 실시간 화면 반영은 아직 없다.
  - 저장 기능은 아직 없다.
  - 배경 jpg/png 충돌 가능성은 별도 점검 필요하다.
  - 실기기 모바일에서 관리자 preview UI의 가독성은 구현 후 확인해야 한다.

- 다음 단계 제안:
  설계 문서 기준으로 읽기 전용 `admin-preview.html`, `src/admin-preview.js`, `src/styles/admin-preview.css`를 구현한다.
