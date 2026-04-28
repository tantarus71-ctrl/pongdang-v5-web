# STEP 2026-04-28 수족관 레이어·입체감 고도화 1차

## 1. 목적

곤지암천 5존 기준의 입체감 있는 프리미엄 수족관 장면을 만들기 위해 후방/중경/전경 레이어, 수초/돌/거품/작은 생물 연출을 보강한다.

이번 단계에서는 어종 추가, 관리자 편집 기능, 배경 파일 삭제, 원본 이미지 변경을 하지 않는다.

---

## 2. 생성 파일

다음 두 파일을 생성했다.

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/aquarium-layer-depth-v1.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/aquarium-layer-depth-v1.css
```

---

## 3. 구현 구조

### CSS

`aquarium-layer-depth-v1.css`에는 다음 계열의 레이어 스타일을 추가했다.

- `aq-depth-back`
- `aq-depth-mid`
- `aq-depth-creature-back`
- `aq-depth-creature-front`
- `aq-depth-front`
- `aq-depth-particle-front`
- `aq-depth-ambient`
- `aq-plant`
- `aq-stone`
- `aq-bubble`
- `aq-dust`
- `aq-creature`

### JS

`aquarium-layer-depth-v1.js`는 기존 `app.js`를 수정하지 않고 수족관 내부에 보조 입체 레이어를 추가한다.

주요 기능:

- 현재 존 감지
- 존별 연출 프로필 적용
- 후방/중경/전경 수초 배치
- 후방/중경/전경 돌 배치
- 작은 거품/입자 배치
- 민물새우, 다슬기, 작은 치어 그림자, 저서생물 느낌의 소형 오브젝트 배치
- 밤/낮 및 존 전환 시 재렌더링

---

## 4. 존별 연출 프로필

각 존은 다음 특성으로 분리된다.

| 존 | 특징 |
|---|---|
| 웃물 | 맑고 밝은 상류, 작은 기포, 새우/다슬기/치어 소수 |
| 여울 | 반짝임과 흐름감, 자갈/돌 강조, 기포 빠름 |
| 잔여울 | 수초 풍부, 숨는 생물 느낌, 전경 수초 강화 |
| 깊물 | 어두운 깊이감, 큰 돌, 저서생물 느낌 1개 |
| 물모이 | 수초/돌/생물 균형, 작은 생물 다양성 |

---

## 5. 성능 고려

- 기존 `app.js` 런타임은 수정하지 않았다.
- 보조 레이어는 기존 수족관 DOM 안에만 추가된다.
- 모든 보조 오브젝트는 `pointer-events:none` 기준이다.
- 애니메이션은 `transform`과 `opacity` 중심이다.
- `prefers-reduced-motion`에서 애니메이션을 줄인다.
- 모바일에서 전경 레이어 투명도를 낮추는 CSS가 포함됐다.

---

## 6. 연결 상태

생성된 파일은 아직 `index.html`에 직접 연결되지 않았다.

동적 로더를 `utmul-day-q88-override.js`에 넣으려 했으나 GitHub 커넥터 안전 검사에 의해 차단되었다. 따라서 다음 단계에서 Codex 로컬 환경에서 아래 두 줄을 `index.html`에 직접 추가하는 방식이 가장 안전하다.

```html
<link rel="stylesheet" href="./src/styles/aquarium-layer-depth-v1.css?v=aq-depth-v1" />
<script src="./src/aquarium-layer-depth-v1.js?v=aq-depth-v1" defer></script>
```

권장 위치:

- CSS: `main.css` 다음
- JS: `utmul-day-q88-override.js` 다음 또는 그 앞. 기존 `app.js` 이후가 안전하다.

---

## 7. 검증 필요 항목

연결 후 아래 검증이 필요하다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\aquarium-layer-depth-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
```

브라우저 확인:

- 첫 화면 정상
- 웃물 낮 q88 정상
- 5존 전환 정상
- 낮/밤 전환 정상
- UI 버튼 정상
- 물고기 클릭 정상
- 수초/돌/입자/작은 생물 표시 정상
- 모바일에서 과도한 버벅임 없음

---

## 8. 남은 리스크

- 현재 단계는 파일 생성까지 완료했고, index 연결은 Codex 로컬 패치가 필요하다.
- 보조 레이어가 기존 `eco-layer`와 시각적으로 겹칠 수 있으므로 브라우저에서 밀도 조정이 필요할 수 있다.
- 버들치 유영과 전경 수초의 겹침 정도는 다음 단계에서 미세 조정한다.

---

## 9. 다음 단계

다음 단계는 `index.html`에 보조 CSS/JS를 직접 연결하고 브라우저에서 수족관 장면을 확인하는 것이다.

그 다음은:

```text
버들치 1종 기준 입체 유영 미세 조정
```
