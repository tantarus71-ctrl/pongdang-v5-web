# MASTER 추가 기록 - 2026-04-28 수족관 레이어 구조 감사

## [2026-04-28 수족관 레이어 구조 감사]

- 목표:
  수족관 레이어·입체감 고도화에 앞서 현재 `index.html`, `src/app.js`, `src/styles/main.css` 기준의 레이어 구조와 한계를 감사한다.

- 생성 파일:
  - `docs/STEP_2026-04-28_AQUARIUM_LAYER_AUDIT.md`
  - `docs/MASTER_APPEND_2026-04-28_AQUARIUM_LAYER_AUDIT.md`

- 감사 대상:
  - `index.html`
  - `src/app.js`
  - `src/styles/main.css`

- 확인된 현재 구조:
  - `bg`
  - `far-haze`
  - `godrays`
  - `caustics`
  - `eco-layer`
  - `particles`
  - `fish-layer`
  - UI 레이어

- 강점:
  - 배경/안개/빛/생태/입자/물고기/UI 기본 골격이 존재한다.
  - `aquarium`에 perspective가 있어 입체 확장 기반이 있다.
  - `ZONES`에 존별 flow, light, caustic, plant, stone, particle, fishCount, behavior 값이 존재한다.
  - UI z-index가 수족관 레이어보다 높다.

- 한계:
  - `eco-layer`가 후방/중경/전경으로 분리되지 않았다.
  - `particles`가 단일 레이어라 후방/전경 입자 차이가 부족하다.
  - 작은 생태 동물 표현 전용 구조가 없다.
  - 전경 수초 레이어가 부족하다.
  - 야간 모드가 존별로 충분히 세분화되지 않았다.
  - fish back/mid/front 변수는 있으나 실제 DOM 활용은 제한적이다.

- 수정하지 않은 기능:
  - app.js 런타임
  - main.css 스타일
  - index.html 구조
  - 어종 추가 시스템
  - 관리자 편집 기능
  - 배경 경로
  - 원본 이미지

- 결론:
  수족관 고도화의 다음 단계는 효과를 무작정 추가하는 것이 아니라 `eco-layer`, `particles`, `fish-layer`의 깊이 구분을 안전하게 보강하는 것이다.

- 다음 단계:
  `수족관 레이어·입체감 고도화 1차 구현`을 진행한다. 구현 범위는 `src/app.js` 생태/입자 생성부와 `src/styles/main.css` 레이어 스타일 보강으로 제한한다.
