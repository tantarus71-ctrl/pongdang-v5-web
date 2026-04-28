# V31-4 v4837 기준 배경 레이어 최소 패치 계획

## 기준 안정본

- HTML 기준: `app_assets/v4837_discovery_card_ux_quality.html`
- 기존 버들치 엔진: `app_assets/v4837_dynamic_beodeulchi_engine.js`
- 현재 `index.html` 진입점은 기존 v4837 후보를 유지한다.

## 핵심 원칙

1. `index.html` 진입점은 아직 교체하지 않는다.
2. 기존 버들치 유영, 클릭, 발견 카드 UX를 새로 만들지 않는다.
3. 기존 `v4837_dynamic_beodeulchi_engine.js` 구조를 유지한다.
4. 낮/밤 배경과 5존 배경은 별도 배경 레이어와 config로 추가한다.
5. 모든 배경, 수초, 입자, 광선 효과 레이어는 `pointer-events: none`을 유지한다.
6. `fishLayer`는 기존 위치와 클릭 구조를 유지한다.
7. 정상 확인 전까지 기존 v4837 파일을 직접 대체하지 않는다.

## 1차 작업 범위

이번 단계는 실제 기능 확장이 아니라 v4837 안정본에 안전하게 붙일 수 있는 최소 패치 기준을 확정한다.

- 5존 낮/밤 배경 config 추가 기준
- 배경 레이어 z-index 기준
- 낮/밤 상태값 분리 기준
- 메뉴 링크 검증 기준
- 기존 버들치 유지 기준
- 검증 체크리스트 문서화

## 5존 매핑

| 존명 | 내부 ID | 낮 배경 | 밤 배경 |
|---|---|---|---|
| 웃물 | upper | `assets/backgrounds/zone-upper/day.webp` | `assets/backgrounds/zone-upper/night.webp` |
| 여울 | rapid | `assets/backgrounds/zone-rapid/day.webp` | `assets/backgrounds/zone-rapid/night.webp` |
| 잔여울 | gentle | `assets/backgrounds/zone-gentle/day.webp` | `assets/backgrounds/zone-gentle/night.webp` |
| 깊물 | deep | `assets/backgrounds/zone-deep/day.webp` | `assets/backgrounds/zone-deep/night.webp` |
| 물모이 | confluence | `assets/backgrounds/zone-confluence/day.webp` | `assets/backgrounds/zone-confluence/night.webp` |

## 상태값 기준

```js
let currentZone = 'upper';
let currentTimeMode = 'day';
```

- 낮/밤 전환은 `currentTimeMode`만 변경한다.
- 존 전환은 `currentZone`만 변경한다.
- 존 전환 시 현재 낮/밤 상태는 유지한다.
- 낮/밤 전환 시 기존 버들치 fish DOM은 재생성하지 않는다.

## 배경 레이어 기준

v4837 HTML의 `.aq` 내부에 아래 구조를 추가하는 방향으로 패치한다.

```html
<div class="v31-bg-base" data-layer="v31-bg-base"></div>
<div class="v31-bg-next" data-layer="v31-bg-next"></div>
<div class="v31-bg-tone" data-layer="v31-bg-tone"></div>
```

권장 z-index:

```css
.v31-bg-base { z-index: 0; }
.v31-bg-next { z-index: 1; }
.v31-bg-tone { z-index: 2; }
.fx { z-index: 3; }
.fishLayer { z-index: 6; }
.card, .dock, .report, .pop, .hint { z-index: 18 이상 기존값 유지; }
```

## CSS 안전 규칙

```css
.v31-bg-base,
.v31-bg-next,
.v31-bg-tone {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}

.v31-bg-next {
  opacity: 0;
  transition: opacity 260ms ease;
}

.v31-bg-next.is-visible {
  opacity: 1;
}
```

## JS 패치 기준

기존 `v4837_dynamic_beodeulchi_engine.js`를 새로 만들지 않고 아래 기능만 보조 패치로 추가한다.

필수 함수:

- `getV31BackgroundPath()`
- `renderV31Background()`
- `setV31TimeMode(mode)`
- `loadV31Zone(zoneId)` 또는 기존 zone button 이벤트에 최소 연결
- `validateV31BackgroundState()`
- `validateV31MenuLinks()`
- `validateV31PointerEvents()`

## 메뉴 링크 검증 기준

기존 dock 메뉴는 아래 4개를 유지한다.

- 탐험 / explore
- 도감 / book
- 친구 / friend
- 보고서 / report

기존 명칭을 억지로 v30 메뉴 구조로 바꾸지 않는다. v4837 안정본에서는 현재 dock 구조를 우선 유지한다.

## 버들치 유지 기준

- 기존 `IMG = ../assets/fish/beodeulchi/beodeulchi_side_right.png?v=16` 구조 유지
- 기존 `fishLayer` 유지
- 기존 `handleFishClick()` 유지
- 기존 `selectSpecies()` 유지
- 기존 발견 카드 UX 유지
- 배경 패치가 fish DOM 클릭을 방해하지 않아야 한다.

## 검증 순서

1. v4837 원본 실행 확인
2. 기존 버들치 표시 확인
3. 기존 버들치 클릭 확인
4. 배경 레이어만 추가
5. 웃물 낮 표시
6. 웃물 밤 표시
7. 여울 낮/밤 표시
8. 잔여울 낮/밤 표시
9. 깊물 낮/밤 표시
10. 물모이 낮/밤 표시
11. dock 메뉴 4개 확인
12. report/검수 버튼 확인
13. 물고기 클릭 유지 확인
14. 모바일 세로형 확인
15. PC 가로형 확인

## 완료 조건

- 기존 v4837 버들치가 사라지지 않는다.
- 낮/밤 전환 시 fish가 재생성되지 않는다.
- 존 전환 시 배경만 정확히 바뀐다.
- 기존 메뉴가 작동한다.
- 수중 효과가 클릭을 막지 않는다.
- index 진입점은 유지한다.
