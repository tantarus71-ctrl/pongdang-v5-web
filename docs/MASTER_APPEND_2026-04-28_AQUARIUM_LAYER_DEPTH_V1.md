# MASTER 추가 기록 - 2026-04-28 수족관 레이어·입체감 고도화 1차

## [2026-04-28 수족관 레이어·입체감 고도화 1차]

- 목표:
  곤지암천 5존 기준의 입체감 있는 프리미엄 수족관 장면을 만들기 위해 후방/중경/전경 보조 레이어, 수초/돌/거품/작은 생태 동물 연출 파일을 추가한다.

- 생성 파일:
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/aquarium-layer-depth-v1.js`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/aquarium-layer-depth-v1.css`
  - `docs/STEP_2026-04-28_AQUARIUM_LAYER_DEPTH_V1.md`
  - `docs/MASTER_APPEND_2026-04-28_AQUARIUM_LAYER_DEPTH_V1.md`

- 구현 내용:
  - 후방/중경/전경 생태 레이어 보조 구조 추가
  - 존별 수초/돌/기포/입자/작은 생물 프로필 추가
  - 야간에서 오브젝트 투명도와 빛 표현이 과하지 않도록 CSS 기준 추가
  - 민물새우, 다슬기, 작은 치어 그림자, 저서생물 느낌의 소형 오브젝트 표현 구조 추가
  - 모바일 성능을 고려해 transform/opacity 중심 애니메이션 사용

- 건드리지 않은 기능:
  - 기존 `src/app.js` 원본
  - 기존 `index.html` 직접 연결 구조
  - 어종 추가 시스템
  - 관리자 편집 기능
  - 도감 런타임 구조
  - 미션 런타임 구조
  - 카메라
  - GPS
  - 배경 파일 삭제/교체 구조

- 특이 사항:
  - GitHub 커넥터 안전 검사로 인해 `utmul-day-q88-override.js` 동적 로더 패치는 차단되었다.
  - 따라서 보조 CSS/JS 파일은 생성했지만, 실제 `index.html` 연결은 Codex 로컬 패치 단계로 분리한다.

- 검증 필요:
  - `aquarium-layer-depth-v1.js node --check`
  - `app.js node --check`
  - `data-loader.js node --check`
  - `admin-preview.js node --check`
  - 브라우저에서 5존/낮밤/UI/물고기 클릭 확인

- 남은 리스크:
  - 아직 `index.html`에 직접 연결되지 않았다.
  - 보조 레이어 밀도가 기존 eco-layer와 겹칠 수 있어 브라우저에서 시각 밀도 조정이 필요할 수 있다.
  - 버들치 유영과 전경 수초의 자연스러운 겹침은 다음 단계에서 미세 조정해야 한다.

- 다음 단계:
  Codex 로컬에서 `index.html`에 `aquarium-layer-depth-v1.css`와 `aquarium-layer-depth-v1.js`를 연결하고 브라우저 검수를 진행한다.
  이후 `버들치 1종 기준 입체 유영 미세 조정`으로 넘어간다.
