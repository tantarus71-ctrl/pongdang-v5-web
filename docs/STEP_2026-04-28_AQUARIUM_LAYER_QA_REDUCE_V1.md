# STEP 2026-04-28 수족관 레이어 1차 QA 및 과밀도 감산

## 1. 목적

이번 단계의 목적은 곤지암천 5존 특수성을 유지하면서, 수족관 레이어 고도화 1차에서 추가된 수초·돌·거품·작은 생물·먼 입자의 과밀도를 줄이고 모바일 안정성을 높이는 것이다.

새 효과를 추가하지 않고, 이미 생성된 수족관 레이어의 수량과 opacity, 재렌더 주기를 보수적으로 조정했다.

---

## 2. 수정 파일

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/aquarium-layer-depth-v1.js
```

문서:

```text
docs/STEP_2026-04-28_AQUARIUM_LAYER_QA_REDUCE_V1.md
docs/MASTER_APPEND_2026-04-28_AQUARIUM_LAYER_QA_REDUCE_V1.md
```

---

## 3. 감산 원칙

- 곤지암천 5존의 차이는 유지한다.
- 전경 수초와 작은 생물은 과하게 보이지 않게 줄인다.
- 물고기 클릭을 방해하지 않도록 전경 밀도를 낮춘다.
- DOM 수량을 줄여 모바일 성능 부담을 낮춘다.
- MutationObserver 재렌더를 debounce 처리해 중복 렌더링을 줄인다.

---

## 4. 존별 감산 내용

### 웃물

기존보다 수초·돌·생물 밀도를 낮춰 맑고 얕은 느낌을 유지했다.

- plantBack: 4 → 3
- plantMid: 6 → 5
- plantFront: 3 → 2
- stoneBack: 4 → 3
- stoneMid: 7 → 5
- stoneFront: 2 → 1
- bubbleBack: 5 → 4
- bubbleFront: 3 → 2
- dust: 12 → 9
- shrimp: 3 → 2
- snail: 3 → 2
- fry: 2 → 1

### 여울

물살과 반짝임은 유지하되, 기포와 돌의 과밀도를 줄였다.

- plantMid: 4 → 3
- plantFront: 2 → 1
- stoneBack: 6 → 5
- stoneMid: 10 → 8
- bubbleBack: 7 → 5
- bubbleFront: 5 → 3
- dust: 16 → 12
- shrimp: 2 → 1
- snail: 2 → 1

### 잔여울

수초가 많은 특성은 유지하되, 전경 수초와 생물 수를 줄여 화면 혼잡도를 낮췄다.

- plantBack: 7 → 5
- plantMid: 11 → 8
- plantFront: 5 → 3
- stoneMid: 7 → 5
- stoneFront: 2 → 1
- bubbleBack: 4 → 3
- bubbleFront: 3 → 2
- dust: 14 → 11
- shrimp: 3 → 2
- snail: 3 → 2
- fry: 2 → 1

### 깊물

깊고 조용한 느낌을 유지하기 위해 기포와 작은 생물을 더 줄였다.

- plantBack: 3 → 2
- plantMid: 5 → 4
- plantFront: 2 → 1
- stoneBack: 7 → 5
- stoneMid: 11 → 8
- stoneFront: 3 → 2
- bubbleBack: 3 → 2
- bubbleFront: 2 → 1
- dust: 10 → 8
- snail: 2 → 1
- fry: 1 → 0
- benthic: 1 유지

### 물모이

다양성이 느껴지되 과하지 않게 생물과 수초를 감산했다.

- plantBack: 6 → 4
- plantMid: 9 → 7
- plantFront: 4 → 3
- stoneBack: 5 → 4
- stoneMid: 9 → 7
- stoneFront: 3 → 2
- bubbleBack: 6 → 4
- bubbleFront: 4 → 3
- dust: 18 → 13
- shrimp: 3 → 2
- snail: 4 → 3
- fry: 3 → 2

---

## 5. 생성 요소 크기/opacity 감산

수량뿐 아니라 실제 오브젝트 크기와 opacity도 줄였다.

- 전경 수초 height 상한 축소
- 전경 돌 width 상한 축소
- 전경 bubble size 상한 축소
- creature width 범위 축소
- dust opacity 축소
- bubble drift 범위 축소
- plant sway 각도와 drift 축소

---

## 6. 렌더 안정화

기존에는 mutation/click 이후 일정 시간마다 여러 번 렌더 예약이 가능했다.

이번 단계에서 `scheduleRender()`를 debounce 방식으로 변경했다.

```js
function scheduleRender(delay = 120) {
  window.clearTimeout(state.timer);
  state.timer = window.setTimeout(renderLayer, delay);
}
```

효과:

- MutationObserver 중복 호출 완화
- zone 전환 시 중복 렌더 감소
- 모바일 DOM 재생성 부담 감소

---

## 7. 건드리지 않은 기능

- `src/app.js` 원본 유영 엔진
- `index.html`
- 배경 경로
- q88 배경 적용 구조
- 어종 추가 시스템
- 관리자 편집 기능
- 도감/미션/카메라/GPS
- 이미지 파일

---

## 8. 검증 필요 항목

로컬/Codex에서 아래 검증이 필요하다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\aquarium-layer-depth-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\utmul-day-q88-override.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
```

브라우저 확인:

- 첫 화면 정상
- 5존 전환 정상
- 낮/밤 전환 정상
- 물고기 클릭 정상
- 하단 메뉴와 수초 겹침 없음
- 잔여울 수초 과밀 여부
- 깊물 야간 과암 여부
- 여울 거품/빛 과함 여부
- 모바일 버벅임 여부

---

## 9. 남은 리스크

- 실제 브라우저에서 시각 과밀도는 눈검수가 필요하다.
- 전경 수초가 물고기 클릭을 시각적으로 방해할 가능성은 여전히 확인해야 한다.
- 실기기 성능 확인은 아직 별도다.
- 버들치 유영과 수초 겹침의 정밀한 조정은 다음 단계에서 필요하다.

---

## 10. 다음 단계

다음 단계는 아래 작업이다.

```text
버들치 1종 기준 입체 유영 미세 조정
```

단, 그 전에 브라우저에서 수족관 과밀도 QA 결과가 통과되어야 한다.
