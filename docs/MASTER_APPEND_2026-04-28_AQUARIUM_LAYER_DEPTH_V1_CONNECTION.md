# MASTER 추가 기록 - 2026-04-28 수족관 입체 레이어 연결 완료

## [2026-04-28 수족관 레이어·입체감 고도화 1차 연결]

- 목표:
  수족관 입체감 보강 파일을 기존 앱에 안전하게 연결한다.

- 생성 파일:
  - `src/aquarium-layer-depth-v1.js`
  - `src/styles/aquarium-layer-depth-v1.css`

- 수정 파일:
  - `src/utmul-day-q88-override.js`
  - `docs/STEP_2026-04-28_AQUARIUM_LAYER_DEPTH_V1.md`

- 연결 방식:
  - 기존 대형 `src/app.js`는 직접 수정하지 않았다.
  - 기존 `index.html`도 추가로 크게 수정하지 않았다.
  - 이미 앱에 연결된 `utmul-day-q88-override.js`에서 수족관 보강 CSS/JS를 동적으로 로드한다.

- 구현 내용:
  - 후방/중경/전경 보조 레이어 추가
  - 존별 수초, 돌, 기포, 입자 밀도 차이 적용
  - 작은 생태 오브젝트 표현 구조 추가
  - 야간 opacity 완화 기준 추가
  - 모바일 성능을 고려한 transform/opacity 중심 애니메이션 적용

- 건드리지 않은 기능:
  - 어종 추가 시스템
  - 관리자 편집 기능
  - 도감 런타임
  - 미션 런타임
  - 카메라
  - GPS
  - 배경 이미지 삭제/교체 구조

- 검증 필요:
  - `node --check src/aquarium-layer-depth-v1.js`
  - `node --check src/utmul-day-q88-override.js`
  - 브라우저에서 5존 전환, 낮밤 전환, UI 버튼, 물고기 클릭 확인

- 다음 단계:
  브라우저 검수 후 `버들치 1종 기준 입체 유영 미세 조정`으로 진행한다.
