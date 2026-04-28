# STEP 2026-04-28 버들치 1종 기준 입체 유영 미세 조정

## 1. 목적

이번 단계의 목적은 기존 버들치 1종이 수족관 입체 레이어 안에서 더 자연스럽게 보이도록 보정하는 것이다.

기존 `src/app.js` 유영 엔진은 직접 수정하지 않고, 보조 JS/CSS를 통해 `.fish-root` 요소의 화면상 위치에 따라 깊이감을 부여한다.

---

## 2. 생성/수정 파일

생성되어 있던 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/fish-depth-tune-v1.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/fish-depth-tune-v1.css
```

수정한 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/aquarium-layer-depth-v1.js
```

문서:

```text
docs/STEP_2026-04-28_BEODEULCHI_DEPTH_SWIM_V1.md
docs/MASTER_APPEND_2026-04-28_BEODEULCHI_DEPTH_SWIM_V1.md
```

---

## 3. 적용 방식

`index.html`을 다시 크게 수정하지 않고, 이미 연결된 `aquarium-layer-depth-v1.js`에서 `fish-depth-tune-v1.js`를 자동 로드하도록 보강했다.

자동 로드 대상:

```text
./src/fish-depth-tune-v1.js?v=fish-depth-v1
```

`fish-depth-tune-v1.js`는 다시 아래 CSS를 자동 로드한다.

```text
./src/styles/fish-depth-tune-v1.css?v=fish-depth-v1
```

---

## 4. depth-band 기준

`.fish-root` 요소의 화면상 중심 Y 위치를 기준으로 다음 깊이 band를 부여한다.

```text
back  : 화면 상단/후방
mid   : 화면 중앙
front : 화면 하단/전경
```

기준값:

```text
ratio < 0.43 → back
ratio > 0.67 → front
나머지 → mid
```

각 fish에는 다음 속성이 부여된다.

```html
 data-depth-band="back|mid|front"
```

---

## 5. CSS 보정 내용

`fish-depth-tune-v1.css`에서 깊이별로 다음을 조정한다.

- opacity
- brightness
- saturation
- blur
- drop-shadow
- clickable 강조 정도
- 야간 모드 밝기

깊이별 의도:

| band | 의도 |
|---|---|
| back | 조금 작고 흐릿한 후방 느낌 |
| mid | 기본 중경 느낌 |
| front | 더 선명하고 가까운 전경 느낌 |

---

## 6. JS 보정 내용

`fish-depth-tune-v1.js` 주요 기능:

- CSS 자동 로드
- `.fish-root` 탐색
- `getBoundingClientRect()` 기반 depth-band 계산
- band별 z-index 약보정
- resize/click/DOM 변경 시 재계산
- `window.PondangFishDepthTuneV1` 진단 객체 노출

`aquarium-layer-depth-v1.js`는 레이어 렌더 후 다음 호출을 수행한다.

```js
window.PondangFishDepthTuneV1?.apply?.()
```

---

## 7. 건드리지 않은 기능

- 기존 `src/app.js` 유영 엔진
- 기존 버들치 이미지 파일
- 어종 추가 시스템
- 관리자 편집 기능
- 도감/미션/카메라/GPS 런타임
- 배경 경로 구조
- q88 override 구조

---

## 8. 검증 필요 항목

로컬/Codex에서 아래 검증이 필요하다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\fish-depth-tune-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\aquarium-layer-depth-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
```

브라우저 확인:

- 버들치 표시 정상
- 버들치 클릭 정상
- 가까운 물고기 선명도 증가
- 먼 물고기 흐림/투명도 자연스러움
- 전경 수초가 클릭을 막지 않음
- 밤 모드에서 버들치가 과하게 밝지 않음
- 5존 전환 후 depth-band 재계산

---

## 9. 남은 리스크

- 실제 유영 경로 자체는 여전히 기존 `app.js` 엔진 기준이다.
- 이번 단계는 시각 보정 중심이며, 완전한 3D 회전/스케일 곡선은 다음 단계에서 다룬다.
- 전경 수초와 물고기 겹침 정도는 브라우저에서 시각 확인 후 추가 조정이 필요할 수 있다.

---

## 10. 다음 단계

다음 단계는 아래 작업이다.

```text
버들치 3D 회전/스케일 곡선 미세 조정
```

이후 피라미 추가 준비 또는 어종 추가 시스템 1차 구축으로 넘어간다.
