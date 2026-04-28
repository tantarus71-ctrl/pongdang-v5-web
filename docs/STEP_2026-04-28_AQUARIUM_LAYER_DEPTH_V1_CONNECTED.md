# STEP 2026-04-28 수족관 레이어·입체감 고도화 1차 연결 완료

## 1. 목적

이번 단계의 목적은 이전 단계에서 생성한 수족관 입체 레이어 보조 파일을 실제 실행 HTML에 연결하는 것이다.

이 작업으로 `aquarium-layer-depth-v1.css`와 `aquarium-layer-depth-v1.js`가 실제 앱 실행 흐름에 포함되었다.

---

## 2. 연결된 파일

CSS:

```html
<link rel="stylesheet" href="./src/styles/aquarium-layer-depth-v1.css?v=aq-depth-v1" />
```

JS:

```html
<script src="./src/aquarium-layer-depth-v1.js?v=aq-depth-v1" defer></script>
```

---

## 3. 적용 위치

대상 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
```

CSS는 `main.css` 다음에 연결했다.

JS는 기존 실행 스크립트 뒤에 연결했다.

현재 순서:

```text
main.css
aquarium-layer-depth-v1.css

data-loader.js
app.js
utmul-day-q88-override.js
aquarium-layer-depth-v1.js
```

---

## 4. 변경 범위

수정한 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
```

이미 생성되어 있던 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/aquarium-layer-depth-v1.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/aquarium-layer-depth-v1.css
```

---

## 5. 건드리지 않은 기능

- 기존 `src/app.js` 원본
- 기존 `src/styles/main.css` 원본
- 어종 추가 시스템
- 관리자 편집 기능
- 도감 런타임 구조
- 미션 런타임 구조
- 카메라
- GPS
- 배경 파일 삭제/교체 구조
- q82 후보
- 다른 9개 배경

---

## 6. 기대 효과

연결 후 기대되는 변화:

- 후방/중경/전경 보조 레이어 표시
- 존별 수초/돌/기포/입자 밀도 차이
- 작은 생태 오브젝트 표시
- 야간 투명도 완화
- 수족관 장면의 깊이감 강화

---

## 7. 검증 필요 항목

로컬 또는 Codex 브라우저에서 아래를 확인한다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\aquarium-layer-depth-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
```

브라우저 확인:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
```

확인 항목:

- 첫 화면 정상 표시
- q88 웃물 낮 배경 정상 표시
- 5존 전환 정상
- 낮/밤 전환 정상
- UI 버튼 정상
- 물고기 클릭 정상
- 수초/돌/입자/작은 생물 표시 정상
- 전경 오브젝트가 물고기 클릭을 막지 않음
- 모바일에서 과도한 버벅임 없음

---

## 8. 남은 리스크

- 보조 레이어 밀도가 기존 eco-layer와 겹칠 수 있다.
- 브라우저에서 수초/거품/작은 생물 밀도 조정이 필요할 수 있다.
- 버들치 유영과 전경 수초의 겹침은 다음 단계에서 미세 조정해야 한다.

---

## 9. 다음 단계

다음 단계는 아래 작업이다.

```text
버들치 1종 기준 입체 유영 미세 조정
```

이 단계에서는 물고기 위치, 크기, 흐림, 전경 수초와의 겹침, 클릭 방해 여부를 조정한다.
