# MASTER 추가 기록 - 2026-04-28 수족관 레이어 1차 QA 및 과밀도 감산

## [2026-04-28 수족관 레이어 1차 QA 및 과밀도 감산]

- 목표:
  곤지암천 5존 특수성을 유지하면서 수족관 입체 레이어의 과밀도를 감산하고 모바일 안정성을 높인다.

- 수정 파일:
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/aquarium-layer-depth-v1.js`
  - `docs/STEP_2026-04-28_AQUARIUM_LAYER_QA_REDUCE_V1.md`
  - `docs/MASTER_APPEND_2026-04-28_AQUARIUM_LAYER_QA_REDUCE_V1.md`

- 구현 내용:
  - 5존별 수초/돌/거품/입자/작은 생물 수량 감산
  - 전경 오브젝트 크기와 opacity 보수화
  - plant sway, bubble drift, dust opacity 축소
  - MutationObserver/클릭 기반 재렌더 debounce 적용
  - 기존 곤지암천 5존 특성은 유지

- 존별 방향:
  - 웃물: 맑고 얕은 느낌 유지, 작은 생물과 거품 감산
  - 여울: 흐름감 유지, 과한 거품과 돌 밀도 감산
  - 잔여울: 수초 특성 유지, 전경 수초 과밀도 감산
  - 깊물: 조용하고 깊은 느낌 유지, 기포/생물 최소화
  - 물모이: 다양성 유지, 생물·수초 밀도 감산

- 건드리지 않은 기능:
  - `src/app.js` 원본 유영 엔진
  - `index.html`
  - 배경 경로
  - q88 배경 적용 구조
  - 어종 추가 시스템
  - 관리자 편집 기능
  - 도감/미션/카메라/GPS
  - 이미지 파일

- 검증:
  - 로컬/Codex에서 `aquarium-layer-depth-v1.js node --check` 필요
  - 브라우저에서 5존 전환, 낮/밤 전환, 물고기 클릭, 하단 메뉴 겹침 여부 확인 필요

- 남은 리스크:
  - 실제 브라우저 눈검수가 필요하다.
  - 전경 수초가 시각적으로 물고기를 과하게 가리는지 확인해야 한다.
  - 실기기 성능 확인은 별도다.

- 다음 단계:
  브라우저 QA 통과 후 `버들치 1종 기준 입체 유영 미세 조정`으로 진행한다.
