# STEP 2026-04-28 수족관 레이어·입체감 고도화 1차

## 1. 목적

곤지암천 5존 기준의 입체감 있는 프리미엄 수족관 장면을 만들기 위해 후방/중경/전경 레이어, 수초/돌/거품/작은 생물 연출을 보강한다.

이번 단계에서는 어종 추가, 관리자 편집 기능, 배경 파일 삭제, 원본 이미지 변경을 하지 않았다.

---

## 2. 생성 및 수정 파일

생성 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/aquarium-layer-depth-v1.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/aquarium-layer-depth-v1.css
```

수정 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/utmul-day-q88-override.js
```

`index.html`과 기존 `src/app.js`는 대규모 수정하지 않았다.

---

## 3. 안정화 방식

기존 `src/app.js`를 직접 수정하지 않고, 이미 앱에 연결된 `utmul-day-q88-override.js`에서 아래 보조 파일을 동적으로 로드한다.

```text
src/styles/aquarium-layer-depth-v1.css
src/aquarium-layer-depth-v1.js
```

이 방식의 장점:

- 기존 앱 런타임을 직접 훼손하지 않음
- 수족관 고도화 레이어를 분리 관리 가능
- 문제가 생기면 `utmul-day-q88-override.js`의 로더 연결을 제거해 롤백 가능
- 기존 `app.js` 대형 파일을 덮어쓰지 않아 안전함

---

## 4. 구현 구조

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

## 5. 레이어 구조

보조 레이어는 기존 `aquarium` 내부에 동적으로 생성된다.

```text
aqDepthBack
  aq-plant back
  aq-stone back
  aq-bubble back

aqDepthMid
  aq-plant mid
  aq-stone mid
  aq-dust

aqCreatureBack
  small creatures back

aqCreatureFront
  small creatures front

aqDepthFront
  aq-plant front
  aq-stone front

aqParticleFront
  aq-bubble front

aqDepthAmbient
  foreground light / soft reflection
```

기존 구조와의 관계:

- 기존 `bg`, `far-haze`, `godrays`, `caustics` 유지
- 기존 `eco-layer`, `particles`, `fish-layer` 유지
- 보조 레이어는 fish 전후로 보이도록 z-index를 나누어 배치
- UI 레이어는 그대로 최상위 유지

---

## 6. 존별 연출 프로필

각 존은 다음 특성으로 분리된다.

| 존 | 특징 |
|---|---|
| 웃물 | 맑고 밝은 상류, 작은 기포, 새우/다슬기/치어 소수 |
| 여울 | 반짝임과 흐름감, 자갈/돌 강조, 기포 빠름 |
| 잔여울 | 수초 풍부, 숨는 생물 느낌, 전경 수초 강화 |
| 깊물 | 어두운 깊이감, 큰 돌, 저서생물 느낌 1개 |
| 물모이 | 수초/돌/생물 균형, 작은 생물 다양성 |

---

## 7. 작은 생태 동물 표현 기준

이미지를 추가하지 않고 CSS 기반 작은 오브젝트로 표현한다.

종류:

```text
aq-small-shrimp
aq-snail
aq-small-shadow
aq-benthic
```

원칙:

- 작고 은근하게 표현
- 물고기보다 시선이 덜 가게 함
- 아이들이 찾아보는 재미 정도만 부여
- pointer-events 없음
- DOM 수량은 존별 제한

---

## 8. 야간 연출 기준

야간은 새 무거운 효과를 추가하지 않고, 기존 오브젝트의 opacity와 ambient 레이어를 줄이는 방식으로 처리한다.

야간 기준:

- 수초 opacity 감소
- 돌 opacity 감소
- 작은 생물 opacity 감소
- 기포와 입자 opacity 감소
- ambient 반사 약화
- 네온/LED 느낌 방지

---

## 9. 성능 고려 사항

- transform / opacity 기반 애니메이션 사용
- pointer-events none 유지
- 각 존별 생태 오브젝트 수 제한
- MutationObserver는 기존 override와 동일 흐름에서 최소 사용
- prefers-reduced-motion 대응
- 모바일 폭에서 전경 효과 opacity 감소
- `app.js` 렌더 루프를 직접 건드리지 않음

---

## 10. 검증 필요 항목

로컬/Codex에서 아래 검증이 필요하다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\utmul-day-q88-override.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\aquarium-layer-depth-v1.js
```

브라우저 확인:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
```

확인 항목:

- 첫 화면 정상
- 웃물 낮 q88 정상
- 5존 전환 정상
- 낮/밤 전환 정상
- UI 버튼 정상
- 물고기 클릭 방해 없음
- 수초/돌/입자/작은 생물 레이어 정상
- 야간 조명 과장 없음
- 모바일 버벅임 과도하지 않음

---

## 11. 남은 리스크

- 실제 브라우저에서 기존 `eco-layer`, `particles`와 보조 레이어가 시각적으로 과밀해질 가능성
- 일부 전경 수초가 물고기 클릭 시각을 방해할 가능성
- 실기기 성능 확인 필요
- 버들치 유영과의 완전한 입체 일체감은 다음 단계에서 미세 조정 필요

---

## 12. 롤백 방법

문제 발생 시 아래 중 하나로 롤백한다.

1. `utmul-day-q88-override.js`에서 `installDepthEnhancement()` 호출 제거
2. 또는 `DEPTH_CSS`, `DEPTH_JS` 로드 부분 제거
3. 생성된 `aquarium-layer-depth-v1.js/css` 파일은 삭제하지 않고 비활성화 상태로 보존

---

## 13. 다음 단계

다음 단계는 아래 작업이다.

```text
버들치 1종 기준 수족관 내 입체 유영 미세 조정
```

이 단계에서 물고기 z-depth, scale, 흐림, 전경 수초와의 겹침을 실제 유영 기준으로 조정한다.
