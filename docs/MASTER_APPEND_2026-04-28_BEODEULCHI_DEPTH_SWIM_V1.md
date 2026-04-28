# MASTER 추가 기록 - 2026-04-28 버들치 입체 유영 미세 조정

## [2026-04-28 버들치 1종 기준 입체 유영 미세 조정]

- 목표:
  버들치가 수족관 안쪽/중간/앞쪽 깊이를 가진 것처럼 보이도록 시각 보정을 적용한다.

- 생성/수정 파일:
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/fish-depth-tune-v1.js`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/fish-depth-tune-v1.css`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/aquarium-layer-depth-v1.js`
  - `docs/STEP_2026-04-28_BEODEULCHI_DEPTH_SWIM_V1.md`
  - `docs/MASTER_APPEND_2026-04-28_BEODEULCHI_DEPTH_SWIM_V1.md`

- 구현 내용:
  - fish-root 위치 기준 back/mid/front depth-band 부여
  - 깊이별 opacity/filter/zIndex 보정
  - 밤 모드 물고기 밝기 완화
  - 전경 수초와의 겹침 대비
  - 클릭 가능성 유지
  - `aquarium-layer-depth-v1.js`에서 fish-depth-tune-v1.js 자동 로드

- 건드리지 않은 기능:
  - 기존 `src/app.js` 유영 엔진
  - 어종 추가 시스템
  - 관리자 편집 기능
  - 도감/미션/카메라/GPS 런타임
  - 이미지 파일
  - 배경 경로 구조

- 검증 필요:
  - `fish-depth-tune-v1.js node --check`
  - `aquarium-layer-depth-v1.js node --check`
  - `app.js node --check`
  - `data-loader.js node --check`
  - `admin-preview.js node --check`
  - 브라우저에서 5존 전환, 낮/밤 전환, 물고기 클릭 확인

- 남은 리스크:
  - 실제 fish path 자체는 app.js 기존 유영 엔진 기준이다.
  - 더 자연스러운 회전/3D 전환은 다음 단계에서 보완한다.
  - 새 어종 추가 전 버들치 기준값을 더 세밀하게 조정해야 한다.

- 다음 단계:
  버들치 3D 회전/스케일 곡선 미세 조정 또는 피라미 추가 준비.
