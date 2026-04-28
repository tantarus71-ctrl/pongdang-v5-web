# MASTER 추가 기록 - 2026-04-28 읽기 전용 관리자 preview UI 구현

## [2026-04-28 읽기 전용 관리자 preview UI 구현]

- 목표:
  저장/수정/삭제 기능 없는 관리자 preview UI를 별도 페이지로 구현한다.

- 수정 파일:
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/admin-preview.js`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/admin-preview.css`
  - `docs/STEP_2026-04-28_ADMIN_PREVIEW_UI_IMPLEMENTATION.md`
  - `docs/MASTER_APPEND_2026-04-28_ADMIN_PREVIEW_UI_IMPLEMENTATION.md`

- 건드리지 않은 기능:
  - 기존 `index.html`
  - `src/app.js`
  - `src/data-loader.js`
  - `src/styles/main.css`
  - `data/*.json`
  - 물고기 유영
  - 음성
  - 도감
  - 미션
  - 카메라
  - GPS

- 검증:
  - 관리자 preview HTML 별도 생성 완료
  - 관리자 preview JS 별도 생성 완료
  - 관리자 preview CSS 별도 생성 완료
  - 저장/수정/삭제 기능을 넣지 않음
  - 기존 수족관 앱 파일을 수정하지 않음
  - 문서 기록 완료

- 발견 오류:
  - 이번 단계에서는 GitHub 파일 생성 과정에서 신규 오류는 발생하지 않았다.

- 해결:
  - 관리자 UI를 기존 수족관 화면에 삽입하지 않고 별도 페이지로 격리했다.
  - data/*.json 7개를 읽기 전용으로 fetch하는 구조를 구현했다.
  - 상태칩, 경고, 진단 로그, 원본 JSON 보기 구조를 구현했다.

- 남은 리스크:
  - 로컬/실기기에서 `admin-preview.js` node --check 확인이 필요하다.
  - GitHub Pages 배포 후 `admin-preview.html` 직접 접근과 JSON fetch 상대경로를 확인해야 한다.
  - 관리자 편집/저장 기능은 아직 없다.
  - JSON 데이터가 실제 앱 화면에 반영되는 단계는 아직 아니다.
  - 배경 경로 jpg/png 충돌은 별도 안정화 대상이다.

- 다음 단계 제안:
  관리자 preview 확인 후 편집 기능으로 바로 가지 말고, 필드 검증 강화와 자산 경로 검사 강화를 먼저 진행한다.
