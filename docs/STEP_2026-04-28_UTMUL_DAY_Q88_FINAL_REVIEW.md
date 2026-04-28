# STEP 2026-04-28 웃물 낮 q88 반영 후 최종 검수

## 1. 목적

이번 단계의 목적은 B1 optimized q88 후보를 웃물 낮 1슬롯에 반영한 뒤, GitHub 기준 정적 검수 결과를 기록하는 것이다.

실제 브라우저 실행과 실기기 검수는 이 환경에서 직접 수행하지 않았으며, 로컬/Codex 환경에서 추가 확인이 필요하다.

---

## 2. 검수 대상

- `index.html`
- `src/utmul-day-q88-override.js`
- `data/zones.json`
- `data/assets_manifest.json`

---

## 3. q88 경로 적용 확인

선택 후보:

```text
assets/bg_optimized/upper/day_941_q88.jpg
```

원본 fallback:

```text
assets/bg/upper/day.jpg
```

확인 결과:

| 대상 | 상태 |
|---|---|
| index.html preload | q88 후보 경로 사용 |
| utmul-day-q88-override.js | q88 후보 경로 사용 |
| zones.json utmul.dayBackground | q88 후보 경로 사용 |
| assets_manifest.json utmul_day.path | q88 후보 경로 사용 |
| assets_manifest.json utmul_day.fallbackPath | 원본 jpg 유지 |

---

## 4. zones.json 검수

`zones.json`은 5존 구조를 유지한다.

- `utmul.dayBackground`: `assets/bg_optimized/upper/day_941_q88.jpg`
- `utmul.nightBackground`: `assets/bg/upper/night.jpg`
- 나머지 4개 존은 기존 JPG 경로 유지

---

## 5. assets_manifest.json 검수

`assets_manifest.json`은 backgrounds 10개 슬롯 구조를 유지한다.

`utmul_day`만 q88로 변경되어 있다.

```json
"path": "assets/bg_optimized/upper/day_941_q88.jpg",
"fallbackPath": "assets/bg/upper/day.jpg"
```

나머지 9개 슬롯은 기존 JPG active path와 PNG fallbackPath 구조를 유지한다.

---

## 6. override 스크립트 검수

`src/utmul-day-q88-override.js`는 기존 `app.js`를 직접 수정하지 않고, DOM의 `#bg` 배경 이미지만 웃물 낮 상태에서 q88로 override한다.

특징:

- 밤 모드에서는 적용하지 않음
- 웃물 활성 상태에서만 적용
- zone 변경 또는 DOM 변경 후 재적용 가능
- `window.PondangUtmulDayQ88Override` 진단 객체 노출

---

## 7. 건드리지 않은 기능

- 기존 `src/app.js` 원본
- 다른 9개 배경
- q82 후보
- 원본 이미지
- 물고기 유영
- 음성
- 도감
- 미션
- 카메라
- GPS
- 관리자 편집/저장 기능

---

## 8. 추가 검증 필요

로컬/Codex에서 아래 검증이 필요하다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\utmul-day-q88-override.js
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\zones.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\assets_manifest.json | ConvertFrom-Json | Out-Null
```

브라우저 확인:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
```

확인 항목:

- 첫 화면 q88 배경 표시
- preload 404 없음
- 낮/밤 전환 정상
- 웃물 외 4개 존 전환 정상
- 도감/미션/카메라/음성 버튼 정상
- 관리자 preview 자산 경로 정상

---

## 9. 판정

GitHub 기준 정적 검수: 조건부 통과.

조건부 사유:

- q88 경로 적용은 정적으로 일치한다.
- 다만 실제 브라우저에서 app.js의 배경 재설정과 override 스크립트가 충돌 없이 작동하는지 확인이 필요하다.

---

## 10. 다음 단계

다음 단계는 로컬/Codex 브라우저 확인이다.

브라우저 확인 후 이상이 없으면 다음 1개 슬롯 최적화 후보 선정으로 넘어갈 수 있다.
