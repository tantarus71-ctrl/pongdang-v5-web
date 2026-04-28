# STEP 2026-04-28 수족관 레이어 구조 감사

## 1. 목적

이번 단계의 목적은 곤지암천 수족관 화면을 본격적으로 고도화하기 전에 현재 수족관 레이어 구조, z-index, 시각 깊이감, 성능 리스크를 점검하는 것이다.

이번 단계에서는 새 어종 추가, 관리자 편집 기능, 이미지 삭제, 배경 교체를 하지 않는다. 먼저 현재 구조를 감사하고 다음 단계의 안전한 수정 범위를 확정한다.

---

## 2. 감사 대상

기준 폴더:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/
```

주요 감사 파일:

```text
src/app.js
src/styles/main.css
index.html
```

---

## 3. 현재 확인된 HTML 레이어 구조

현재 `index.html`의 수족관 내부 기본 DOM 구조는 다음 순서를 가진다.

```html
<main class="aquarium" id="aquarium">
  <div class="bg" id="bg"></div>
  <div class="far-haze"></div>
  <div class="godrays" id="godrays"></div>
  <div class="caustics" id="caustics"></div>
  <div class="eco-layer" id="ecoLayer"></div>
  <div class="particles" id="particles"></div>
  <div class="fish-layer" id="fishLayer"></div>
</main>
```

기본 골격은 이미 존재한다. 다만 후방/중경/전경 생태 오브젝트가 명확히 분리되어 있지 않고, 생태 오브젝트가 `eco-layer` 하나에 집중되어 있다.

---

## 4. 현재 CSS z-index 구조

`main.css`의 현재 주요 z-index 기준은 다음과 같다.

| 레이어 | 현재 z-index | 판정 |
|---|---:|---|
| `.bg` | 0 | 정상 |
| `.far-haze` | 2 | 정상 |
| `.godrays` | 5 | 정상 |
| `.caustics` | 7 | 정상 |
| `.eco-layer` | 12 | 후방/중경/전경 분리 부족 |
| `.particles` | 30 | 물고기 바로 아래, 전후 입자 분리 부족 |
| `.fish-layer` | 38 | 기본 정상 |
| `.topbar` | 80 | UI 우선 정상 |
| `.zone-strip` | 76 | UI 우선 정상 |
| `.bottom-card` | 76 | UI 우선 정상 |
| `.bottom-nav` | 86 | UI 우선 정상 |
| `.popup` | 120 | 정상 |
| `.feature-panel` | 118 | 정상 |
| `.dex-panel` | 122 | 정상 |

CSS root에는 `--z-fish-back`, `--z-fish-mid`, `--z-fish-front` 변수가 있지만, 실제 물고기 레이어 DOM은 `fish-layer` 하나에 집중되어 있어 깊이 레이어 활용이 아직 제한적이다.

---

## 5. 현재 강점

현재 구조의 강점은 다음과 같다.

1. 배경 / 안개 / 빛 / caustics / 생태 / 입자 / 물고기 / UI의 기본 순서가 이미 존재한다.
2. `aquarium`에 perspective가 적용되어 있어 입체감 확장 기반이 있다.
3. `ZONES`에 존별 flow, light, caustic, plant, stone, particle, fishCount, behavior 값이 이미 존재한다.
4. 낮/밤 모드용 CSS 변수가 이미 일부 존재한다.
5. UI z-index가 수조 레이어보다 높게 유지되어 있다.
6. 수초와 입자 애니메이션 기본 구조가 있다.

---

## 6. 현재 한계

현재 구조의 한계는 다음과 같다.

### 6.1 생태 레이어 단일화

현재 수초와 돌은 `.eco-layer` 안에서 처리되는 구조로 보인다. 후방 돌, 중경 수초, 전경 수초가 분리되어 있지 않으면 물고기가 수초 뒤로 들어가는 입체감이 약해진다.

### 6.2 입자 레이어 단일화

`.particles`가 하나의 레이어이며 z-index 30이다. 후방 먼 입자, 중경 작은 기포, 전경 큰 기포가 분리되지 않아 깊이감 표현이 제한된다.

### 6.3 물고기 깊이 레이어 부족

CSS 변수에는 fish back/mid/front 기준이 있지만 실제 DOM 구조는 `.fish-layer` 중심이다. 물고기별 z-depth, scale, opacity, blur 차이를 더 적극적으로 적용할 필요가 있다.

### 6.4 전경 수초/큰 오브젝트 부족

전경 수초가 별도 레이어로 존재하지 않아 물고기가 전경 수초 뒤로 지나가는 느낌이 약하다.

### 6.5 작은 생태 동물 레이어 부재

민물새우, 다슬기, 작은 치어, 민물가재 느낌의 생태 오브젝트를 표현할 전용 구조가 없다. 기존 구조에 바로 넣으면 반복 패턴이나 과도한 DOM이 될 수 있으므로 별도 규칙이 필요하다.

### 6.6 야간 모드 고도화 부족

현재 `.night .bg`, `.night .godrays`, `.night .caustics` 조정은 있으나 존별 야간 차이가 충분히 세분화되어 있지는 않다.

---

## 7. 수족관 레이어 개선 권장 구조

다음 단계에서 권장하는 레이어 구조는 아래와 같다.

```text
0. bg                      : 최후방 배경
1. depth-haze              : 수중 깊이 안개
2. eco-back                : 후방 돌 / 후방 수초
3. particle-back           : 먼 입자 / 잔기포
4. eco-mid                 : 중경 자갈 / 중경 수초
5. creature-back           : 후방 작은 생물
6. fish-layer              : 기존 물고기 레이어
7. creature-front          : 전방 작은 생물
8. eco-front               : 전경 수초 / 큰 잎 / 줄기
9. particle-front          : 전경 큰 기포 / 빛 반사
10. UI                     : topbar / nav / panel / popup
```

최소 구현은 기존 `eco-layer`, `particles`, `fish-layer` 구조를 유지하면서 내부 class를 세분화하는 방향이 안전하다.

---

## 8. 다음 단계 수정 원칙

다음 실제 고도화 단계에서는 아래 원칙을 지켜야 한다.

1. `index.html` 구조를 크게 바꾸지 않는다.
2. `app.js`에서 생태 오브젝트 생성 함수만 최소 수정한다.
3. `main.css`에서 레이어별 class와 z-index를 보강한다.
4. 후방/중경/전경을 CSS class로 구분한다.
5. 생태 동물은 DOM 수를 존별 1~5개 수준으로 제한한다.
6. 모바일에서 particle 수를 과도하게 늘리지 않는다.
7. blur/filter/drop-shadow는 최소화한다.
8. 야간은 새 무거운 레이어 추가보다 기존 변수 조정 중심으로 처리한다.

---

## 9. 존별 개선 방향

### 웃물

- 밝고 맑은 얕은 수조감 유지
- 작은 기포와 짧은 수초 중심
- 민물새우 2~4개, 다슬기 몇 개 정도
- 야간은 푸른 회색과 약한 수면 반사

### 여울

- 입자 흐름 방향성 강화
- caustics를 가장 활발하게
- 수초는 적게, 돌과 자갈 질감 강조
- 야간은 은회색 반사 중심

### 잔여울

- 수초 밀도 강화
- 전경 수초 레이어가 가장 중요
- 작은 생물 숨은 느낌
- 야간은 수초 틈 은은한 반사

### 깊물

- 후방 안개와 어두운 깊이감 강화
- 큰 돌/바위 느낌
- 민물가재 느낌 1개 정도
- 야간은 가장 어둡지만 완전 검정 금지

### 물모이

- 수초/돌/입자/생물이 균형 있게 모이는 구간
- 작은 치어 그림자, 다슬기, 새우 등 소수
- 전경/중경/후경 균형 강조

---

## 10. 성능 리스크

현재 또는 다음 단계에서 주의해야 할 성능 리스크는 다음이다.

1. `.particles` DOM 과다 생성
2. 수초/돌 DOM 과다 생성
3. `drop-shadow`가 물고기 다수에 적용될 때 모바일 부담
4. `MutationObserver` 기반 q88 override와 배경 전환 상호작용
5. 야간 효과를 별도 레이어로 과하게 추가할 경우 FPS 저하
6. 생태 동물 DOM이 많아질 경우 애니메이션 부담

---

## 11. 1차 감사 결론

수족관은 기본 레이어 골격은 존재하지만, 프리미엄 입체 수조로 가기 위해서는 다음이 우선이다.

```text
1. eco-layer 내부를 후방/중경/전경으로 분리
2. particles를 후방/전경 성격으로 분리
3. 전경 수초/큰 잎 레이어 추가
4. 존별 생태 오브젝트 파라미터 추가
5. 작은 생태 동물 소수 배치
6. 야간 존별 톤 조정
7. 물고기 z-depth와 전경 수초 겹침 조정
```

---

## 12. 다음 단계

다음 단계는 아래 작업이다.

```text
수족관 레이어·입체감 고도화 1차 구현
```

단, 구현 범위는 `src/app.js`의 생태/입자/레이어 생성부와 `src/styles/main.css`의 레이어 스타일 보강으로 제한한다.
