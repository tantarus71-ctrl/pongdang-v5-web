# STEP 2026-04-28 메뉴 기능 안정화 가드 v1

## 1. 목적

수족관 레이어, q88 배경, 곤지암천 5존 특수성 보정, 버들치 depth 보정이 추가된 상태에서도 탐사·도감·미션·카메라·음성·존 전환·낮밤 전환·팝업 기능이 클릭 막힘 없이 동작하도록 메뉴 안전 가드를 추가했다.

이번 단계는 새 기능 개발이 아니라 메뉴 클릭 안정화와 진단 기능 보강이다.

---

## 2. 생성/수정 파일

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/menu-safety-guard-v1.css
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/menu-function-safety-v1.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/utmul-day-q88-override.js
```

---

## 3. 적용 내용

### 3.1 클릭 방해 방지

아래 계열은 `pointer-events:none`으로 고정했다.

- 수족관 depth root
- 수족관 depth layer
- polish root 계열
- zone overlay 계열
- 수초
- 돌
- 거품
- 먼 입자
- 작은 생태 오브젝트

### 3.2 메뉴/패널 클릭 유지

아래 UI 계열은 `pointer-events:auto`를 유지한다.

- topbar
- zone-strip
- bottom-nav
- feature-panel
- explore-panel
- camera-panel
- mission-panel
- dex-panel
- popup
- card-detail
- audio-panel

### 3.3 z-index 보정

UI가 수족관 장식 레이어보다 위에 오도록 z-index를 보정했다.

---

## 4. 진단 기능

브라우저 콘솔에서 아래 명령으로 메뉴 안정화 상태를 확인할 수 있다.

```js
window.PondangMenuSafetyV1?.audit()
```

반환 항목:

- 필수 UI 요소 존재 여부
- 각 UI의 visible 여부
- pointer-events 값
- z-index 값
- nav button 상태
- zone button 상태
- overlay pointer-events 샘플
- aquarium audit 연결 결과
- fish audit 연결 결과

---

## 5. 함께 확인할 audit 명령

```js
window.PondangAquariumDepthV1?.audit()
window.PondangFishDepthTuneV1?.audit()
window.PondangMenuSafetyV1?.audit()
window.PondangUtmulDayQ88Override
```

---

## 6. 건드리지 않은 기능

- app.js 원본 유영 엔진
- 새 어종 추가
- 관리자 편집/저장 기능
- 배경 이미지 파일
- 도감 런타임 구조
- 미션 런타임 구조
- 카메라/GPS 구조
- 데이터 JSON 구조

---

## 7. 검증 필요 항목

로컬 또는 Codex에서 아래를 확인한다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\menu-function-safety-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\utmul-day-q88-override.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\aquarium-layer-depth-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\fish-depth-tune-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
```

브라우저에서 확인:

- 탐사 버튼 클릭
- 도감 버튼 클릭
- 미션 버튼 클릭
- 카메라 버튼 클릭
- 음성 버튼 클릭
- 존 버튼 5개 클릭
- 낮/밤 전환
- 물고기 팝업 열기/닫기
- 카드 상세 열기/닫기

---

## 8. 최종 판정 기준

통과:

- 메뉴 클릭이 모두 가능하다.
- 수족관 오버레이가 클릭을 막지 않는다.
- audit 객체가 모두 반환된다.
- 콘솔 JS 오류가 없다.
- 404 반복 오류가 없다.

조건부 통과:

- 기능은 정상이나 일부 audit 표시값이 보완 필요하다.
- 브라우저 캐시로 새 스크립트 반영이 지연된다.

실패:

- 메뉴 클릭이 막힌다.
- 음성/도감/미션/카메라 중 하나가 JS 오류를 낸다.
- fish clickable이 0이다.
- 수족관 레이어가 UI를 덮는다.

---

## 9. 다음 단계

다음 단계는 `전체 웹 QA 및 실행 ZIP 생성`이다.

QA 통과 후 기준 폴더 전체를 ZIP으로 압축한다.

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/
```

출력 파일:

```text
dist/pongdang_gonjiam_v30A1_aquarium_depth_final_20260428.zip
```
