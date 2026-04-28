# MASTER 추가 기록 - 2026-04-28 메뉴 기능 안정화 가드 v1

## [2026-04-28 메뉴 기능 안정화 가드 v1]

- 목표:
  수족관 레이어가 추가된 상태에서도 탐사·도감·미션·카메라·음성·존 전환·낮밤 전환·팝업 기능이 클릭 막힘 없이 동작하도록 안정화한다.

- 생성/수정 파일:
  - `src/styles/menu-safety-guard-v1.css`
  - `src/menu-function-safety-v1.js`
  - `src/utmul-day-q88-override.js`
  - `docs/STEP_2026-04-28_MENU_SAFETY_GUARD_V1.md`
  - `docs/MASTER_APPEND_2026-04-28_MENU_SAFETY_GUARD_V1.md`

- 구현 내용:
  - 수족관 장식/오버레이 레이어 pointer-events none 강제
  - UI/패널/팝업 pointer-events auto 유지
  - 주요 UI z-index 보정
  - `PondangMenuSafetyV1.audit()` 진단 객체 추가
  - 수족관 audit 및 fish audit와 연결

- 건드리지 않은 기능:
  - `src/app.js` 원본 유영 엔진
  - 새 어종 추가
  - 관리자 편집/저장 기능
  - 배경 이미지 파일
  - 도감/미션/카메라/GPS 데이터 구조
  - 기존 q88 배경 경로

- 검증 필요:
  - `menu-function-safety-v1.js node --check`
  - `utmul-day-q88-override.js node --check`
  - `aquarium-layer-depth-v1.js node --check`
  - `fish-depth-tune-v1.js node --check`
  - `app.js node --check`
  - 브라우저에서 탐사/도감/미션/카메라/음성/존/낮밤/팝업 클릭 확인

- 남은 리스크:
  - 실제 브라우저 QA 필요
  - 수족관 오버레이가 시각적으로 과할 경우 감산 필요
  - 모바일 실기기 터치 확인 필요

- 다음 단계:
  전체 웹 QA 및 실행 ZIP 생성을 진행한다.
