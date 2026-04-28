# STEP 2026-04-28 웃물 낮 q88 1슬롯 실제 반영

## 1. 목적

이번 단계의 목적은 웃물 낮 배경 1개 슬롯만 optimized q88 후보로 실제 반영하는 것이다.

대형 `src/app.js`는 GitHub 커넥터 응답이 중간에서 잘릴 수 있어 전체 파일 덮어쓰기를 피했다. 대신 기존 app.js 런타임을 보존하고, 별도 override 스크립트로 웃물 낮 배경만 q88로 적용하는 안전 방식을 사용했다.

---

## 2. 선택 후보

```text
assets/bg_optimized/upper/day_941_q88.jpg
```

원본 롤백 경로:

```text
assets/bg/upper/day.jpg
```

q82 후보는 반영하지 않았다.

---

## 3. 수정 전 경로

| 대상 | 수정 전 |
|---|---|
| preload | `./assets/bg/upper/day.jpg?v=30A1-assetfix` |
| zones.json utmul.dayBackground | `assets/bg/upper/day.jpg` |
| assets_manifest utmul_day.path | `assets/bg/upper/day.jpg` |
| app.js | 원본 직접 수정 없음 |

---

## 4. 수정 후 경로

| 대상 | 수정 후 |
|---|---|
| preload | `./assets/bg_optimized/upper/day_941_q88.jpg?v=30A1-q88-utmul-day` |
| zones.json utmul.dayBackground | `assets/bg_optimized/upper/day_941_q88.jpg` |
| assets_manifest utmul_day.path | `assets/bg_optimized/upper/day_941_q88.jpg` |
| assets_manifest utmul_day.fallbackPath | `assets/bg/upper/day.jpg` |
| 런타임 적용 | `src/utmul-day-q88-override.js`에서 `#bg`에 q88 적용 |

---

## 5. 수정 파일

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/utmul-day-q88-override.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/zones.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/assets_manifest.json
```

문서:

```text
docs/STEP_2026-04-28_UTMUL_DAY_Q88_APPLY.md
docs/MASTER_APPEND_2026-04-28_UTMUL_DAY_Q88_APPLY.md
```

---

## 6. 롤백 경로

문제 발생 시 아래 4곳을 원본 경로 기준으로 되돌린다.

1. `index.html` preload를 `./assets/bg/upper/day.jpg?v=30A1-assetfix`로 복구
2. `index.html`에서 `utmul-day-q88-override.js` script 제거
3. `data/zones.json`의 `utmul.dayBackground`를 `assets/bg/upper/day.jpg`로 복구
4. `data/assets_manifest.json`의 `utmul_day.path`를 `assets/bg/upper/day.jpg`로 복구

원본 롤백 경로:

```text
assets/bg/upper/day.jpg
```

---

## 7. 검증 필요 항목

로컬 또는 Codex에서 아래 검증이 필요하다.

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

- 첫 화면 배경 표시
- preload 404 없음
- 웃물 낮에서 q88 적용
- 밤 전환 시 원본 밤 배경 유지
- 다른 4개 존은 기존 JPG 유지
- 도감/미션/카메라/음성 버튼 정상
- 관리자 preview 자산 검사 정상

---

## 8. 기존 기능 영향

다음 기능은 의도적으로 건드리지 않았다.

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

## 9. 남은 리스크

- `src/app.js` 내부 `ZONES.utmul.day`는 직접 수정하지 않았고, override 스크립트 방식으로 q88을 적용한다.
- app.js 내부 로직이 zone 변경 시 배경을 다시 설정할 수 있어 override 스크립트가 MutationObserver로 재적용한다.
- GitHub Pages 캐시 지연 가능성이 있다.
- 실기기 모바일 품질 확인은 별도다.

---

## 10. 다음 단계 제안

다음 단계는 최종 검수다.

```text
q88 반영 후 최종 검수
```

최종 검수에서 통과하면 같은 방식으로 다른 1개 슬롯 진행 여부를 판단한다.
