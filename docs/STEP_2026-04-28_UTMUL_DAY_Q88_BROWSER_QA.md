# STEP 2026-04-28 웃물 낮 q88 브라우저 QA

## 1. 목적

이번 단계의 목적은 B1 optimized q88 후보가 웃물 낮 1슬롯에 반영된 뒤, 실제 브라우저에서 기존 앱 기능과 충돌 없이 작동하는지 확인하는 것이다.

이번 단계는 새 기능 개발이 아니다. 기존 앱을 실행하고, q88 override와 기존 app.js 배경 전환이 충돌하지 않는지 확인한다.

---

## 2. 기준 실행 파일

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
```

q88 적용 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/utmul-day-q88-override.js
```

q88 후보:

```text
assets/bg_optimized/upper/day_941_q88.jpg
```

원본 fallback:

```text
assets/bg/upper/day.jpg
```

---

## 3. 실행 방법

로컬 서버 실행 예시:

```powershell
cd <repo-root>
python -m http.server 4830
```

브라우저 접속:

```text
http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html?cache=q88-browser-qa
```

관리자 preview:

```text
http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html?cache=q88-browser-qa
```

---

## 4. 사전 문법 검증

아래 명령을 먼저 실행한다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\utmul-day-q88-override.js
```

JSON parse:

```powershell
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\zones.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\assets_manifest.json | ConvertFrom-Json | Out-Null
```

---

## 5. 브라우저 QA 체크리스트

### A. 첫 화면

- [ ] 앱이 정상 로드된다.
- [ ] 첫 화면 배경이 표시된다.
- [ ] 콘솔에 q88 preload 404가 없다.
- [ ] `debugChip`에 q88 웃물낮 표시가 붙는다.
- [ ] 물고기가 표시된다.
- [ ] 하단 메뉴가 겹치지 않는다.

### B. q88 적용 확인

브라우저 콘솔에서 확인:

```js
window.PondangUtmulDayQ88Override
```

예상:

```js
{ apply: ƒ, path: 'assets/bg_optimized/upper/day_941_q88.jpg' }
```

배경 요소 확인:

```js
document.getElementById('bg')?.dataset.optimizedOverride
```

예상:

```text
utmul-day-q88
```

### C. 낮/밤 전환

- [ ] 낮 상태에서 웃물 배경 q88 표시
- [ ] 밤 버튼 클릭 시 웃물 밤 배경 표시
- [ ] 밤 상태에서는 q88이 강제로 덮이지 않는다.
- [ ] 다시 낮으로 돌아왔을 때 q88이 재적용된다.

### D. 5존 전환

- [ ] 웃물 → 여울 전환 정상
- [ ] 여울에서는 q88이 적용되지 않는다.
- [ ] 잔여울에서는 q88이 적용되지 않는다.
- [ ] 깊물에서는 q88이 적용되지 않는다.
- [ ] 물모이에서는 q88이 적용되지 않는다.
- [ ] 다시 웃물 낮으로 돌아오면 q88이 적용된다.

### E. 주요 버튼

- [ ] 탐사 버튼 정상
- [ ] 도감 버튼 정상
- [ ] 미션 버튼 정상
- [ ] 카메라 버튼 정상
- [ ] 음성 버튼 정상
- [ ] 팝업 닫기 정상

### F. 관리자 preview

관리자 preview에서 확인:

- [ ] zones.json 5존 표시
- [ ] assets_manifest backgrounds 10개 표시
- [ ] utmul_day path가 q88로 표시
- [ ] utmul_day fallbackPath가 원본 jpg로 표시
- [ ] 저장/수정/삭제 버튼 없음

---

## 6. 오류 판정 기준

### 통과

- 첫 화면 q88 표시
- 밤/다른 존에서는 q88 미적용
- 다시 웃물 낮으로 돌아오면 q88 재적용
- 콘솔 404 없음
- 주요 버튼 정상
- 관리자 preview 정상

### 조건부 통과

- q88 표시는 정상이나 관리자 preview HEAD unknown이 남음
- GitHub Pages 캐시로 인해 새 파일 반영 지연
- 실기기 미확인

### 실패

- 첫 화면 배경 미표시
- q88 404 발생
- 밤 모드에서도 q88이 덮임
- 다른 존에서도 q88이 덮임
- 주요 버튼 동작 오류
- 콘솔 JS 오류 발생

---

## 7. 오류 발생 시 롤백 기준

문제 발생 시 아래 4가지를 원본으로 되돌린다.

1. `index.html` preload를 원본으로 복구
2. `index.html`에서 `utmul-day-q88-override.js` 연결 제거
3. `zones.json`의 `utmul.dayBackground`를 `assets/bg/upper/day.jpg`로 복구
4. `assets_manifest.json`의 `utmul_day.path`를 `assets/bg/upper/day.jpg`로 복구

원본 경로:

```text
assets/bg/upper/day.jpg
```

---

## 8. QA 결과 기록 형식

```text
[웃물 낮 q88 브라우저 QA 결과]

1. 문법 검증:
- app.js:
- data-loader.js:
- admin-preview.js:
- utmul-day-q88-override.js:
- zones.json parse:
- assets_manifest.json parse:

2. 첫 화면:
- q88 표시:
- 404:
- 콘솔 오류:

3. 낮/밤 전환:
- 낮 q88:
- 밤 원본 night:
- 다시 낮 q88:

4. 5존 전환:
- 여울:
- 잔여울:
- 깊물:
- 물모이:
- 웃물 복귀:

5. 주요 버튼:
- 탐사:
- 도감:
- 미션:
- 카메라:
- 음성:

6. 관리자 preview:
- zones:
- assets_manifest:
- utmul_day path:
- fallbackPath:

7. 최종 판정:
- 통과 / 조건부 통과 / 실패

8. 다음 단계:
- 다음 1개 슬롯 최적화 / 롤백 / 보류
```

---

## 9. 다음 단계

QA 통과 시 다음 단계:

```text
다음 1개 슬롯 최적화 후보 선정
```

QA 실패 시 다음 단계:

```text
q88 override 롤백
```
