# STEP 2026-04-28 배경 JSON/manifest 경로 통일

## 1. 목적

이번 단계의 목적은 실제 앱 런타임 기준인 `src/app.js`의 JPG 배경 경로에 맞춰 `data/zones.json`과 `data/assets_manifest.json`을 5존/10슬롯 기준으로 통일하는 것이다.

`app.js`와 `index.html preload`는 이미 JPG 기준으로 정상 확인되었으므로 이번 단계에서는 수정하지 않았다.

---

## 2. Codex 실제 파일 조사 결과 요약

10개 배경 슬롯 모두 JPG와 PNG가 함께 존재한다.

| slot | jpg size | png size |
|---|---:|---:|
| upper/day | 415117 | 2327980 |
| upper/night | 340774 | 2177459 |
| rapid/day | 516601 | 2803645 |
| rapid/night | 440474 | 2536474 |
| soft-rapid/day | 402472 | 2395375 |
| soft-rapid/night | 381145 | 2282974 |
| deep/day | 384205 | 2232895 |
| deep/night | 280439 | 1899315 |
| pool/day | 453967 | 2551287 |
| pool/night | 322001 | 2108269 |

---

## 3. JPG를 active runtime 기준으로 선택한 이유

- `app.js`가 이미 JPG 기준을 사용하고 있다.
- `index.html preload`도 `./assets/bg/upper/day.jpg` 기준으로 app.js와 일치한다.
- JPG 파일은 0.27MB~0.49MB 수준으로 PNG보다 훨씬 가볍다.
- PNG 파일은 1.81MB~2.67MB 수준으로 fallback 후보 또는 원본 후보로 보존한다.
- 현재 성능과 안정성 기준에서는 JPG active path가 적합하다.

---

## 4. PNG fallbackPath 보존 이유

PNG는 삭제하지 않고 `fallbackPath`에 보존했다.

이유:

- 기존 작업 기록에서 PNG 적용 이력이 있었다.
- 화질 비교 또는 향후 원본 후보로 사용할 수 있다.
- 삭제보다 active/fallback 분리가 안전하다.
- 관리자 preview에서 active path와 fallbackPath의 상태를 확인할 수 있다.

---

## 5. zones.json 변경 내용

`zones.json`을 1존 구조에서 5존 구조로 확장했다.

5개 존:

- `utmul` / 웃물 / upper
- `yeoul` / 여울 / rapid
- `janyeoul` / 잔여울 / soft-rapid
- `gipmul` / 깊물 / deep
- `mulmoi` / 물모이 / pool

각 존의 `dayBackground`, `nightBackground`는 app.js JPG 경로와 일치시켰다.

---

## 6. assets_manifest.json 변경 내용

`assets.backgrounds`를 1개 항목에서 10개 슬롯으로 확장했다.

10개 항목:

- `utmul_day`
- `utmul_night`
- `yeoul_day`
- `yeoul_night`
- `janyeoul_day`
- `janyeoul_night`
- `gipmul_day`
- `gipmul_night`
- `mulmoi_day`
- `mulmoi_night`

각 항목은 다음 필드를 가진다.

- `id`
- `zoneId`
- `zoneName`
- `time`
- `folder`
- `path`
- `fallbackPath`
- `adminEditable`
- `active`
- `retired`
- `retiredReason`
- `notes`

`path`는 JPG runtime 기준, `fallbackPath`는 PNG 원본 후보 보존 기준이다.

---

## 7. q88 후보를 아직 반영하지 않은 이유

`assets/bg_optimized/upper/day_941_q88.jpg` 후보는 아직 active path 또는 fallbackPath에 반영하지 않았다.

이유:

- q88은 아직 preview 검수 단계의 optimized 후보이다.
- 앱 런타임 기준과 manifest 기준을 먼저 안정화해야 한다.
- q88 정식 반영은 별도 1슬롯 실제 반영 단계에서 처리한다.

---

## 8. 검증 결과

로컬에서 아래 검증이 필요하다.

```powershell
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\zones.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\assets_manifest.json | ConvertFrom-Json | Out-Null
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
```

GitHub 반영 기준으로는 JSON 구조를 유효한 형식으로 작성했고, 앱 런타임 파일은 수정하지 않았다.

---

## 9. 남은 리스크

- q88 optimized 후보는 아직 정식 반영 전이다.
- PNG fallbackPath는 용량이 크므로 실제 fallback 사용 여부는 별도 판단이 필요하다.
- 관리자 preview에서 path/fallbackPath 확장자 차이에 따른 의도된 경고가 남을 수 있다.
- GitHub Pages 캐시 확인이 필요하다.

---

## 10. 다음 단계

다음 단계는 아래 작업이다.

```text
q88 후보를 preview 전용 테스트 플래그로만 앱 화면에 임시 적용해 품질 확인
```

그 후 통과하면 `utmul_day` 1슬롯만 실제 반영을 검토한다.
