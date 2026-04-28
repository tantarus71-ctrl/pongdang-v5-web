# CODEX TASK - 2026-04-28 웹 QA 및 ZIP 백업 생성

## 목표

현재 `pongdang_gonjiam_v30A1_audio_stability_final` 안정본을 웹에서 QA하고, ZIP 백업 파일을 생성한다.

이번 작업은 새 기능 개발이 아니다. 코드 수정 없이 확인과 압축만 수행한다.

---

## 기준 폴더

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/
```

웹 실행 파일:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
```

관리자 preview:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
```

확인 페이지:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/qa-aquarium-check.html
```

---

## 절대 금지

- 새 기능 추가 금지
- app.js 수정 금지
- index.html 수정 금지
- data/*.json 수정 금지
- 이미지 삭제 금지
- 관리자 편집/저장 기능 추가 금지
- 배경 경로 변경 금지

---

## 로컬 서버 실행

```powershell
python -m http.server 4830
```

확인 URL:

```text
http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html?cache=final-aquarium-check
http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html?cache=final-aquarium-check
http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/qa-aquarium-check.html?cache=final-aquarium-check
```

---

## 브라우저 QA 항목

### 기본 앱

- 첫 화면 정상 로드
- q88 웃물 낮 배경 표시
- 물고기 표시
- 하단 메뉴 표시
- 상단 존 버튼 표시
- 콘솔 JS 오류 없음
- 이미지 404 없음
- UI가 수족관 레이어에 가려지지 않음

### 콘솔 audit

```js
window.PondangAquariumDepthV1?.audit()
window.PondangFishDepthTuneV1?.audit()
window.PondangUtmulDayQ88Override
```

확인 기준:

- `aqDepthRoot` true
- `aqDepthBack` true
- `aqDepthMid` true
- `aqCreatureBack` true
- `aqCreatureFront` true
- `aqDepthFront` true
- `aqParticleFront` true
- `aqDepthAmbient` true
- fish total 정상
- clickable fish 존재

### 5존 전환

- 웃물
- 여울
- 잔여울
- 깊물
- 물모이

각 존에서 확인:

- 배경 정상
- 분위기 차이 확인
- 레이어 중복 생성 없음
- 물고기 표시 정상
- 콘솔 오류 없음

### 낮/밤 전환

- 낮에서 q88 웃물 배경 표시
- 밤에서 q88이 강제로 덮이지 않음
- 다시 낮으로 돌아오면 q88 재적용
- 밤 조명이 LED처럼 과장되지 않음

### 주요 버튼

- 탐사
- 도감
- 미션
- 카메라
- 음성
- 팝업 닫기
- 낮/밤
- 5존 버튼

---

## 문법 검증

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\utmul-day-q88-override.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\aquarium-layer-depth-v1.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\fish-depth-tune-v1.js
```

JSON parse:

```powershell
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\zones.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\assets_manifest.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\species.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\dex_cards.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\missions.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\audio_scripts.json | ConvertFrom-Json | Out-Null
Get-Content app_assets\pongdang_gonjiam_v30A1_audio_stability_final\data\ui_texts.json | ConvertFrom-Json | Out-Null
```

---

## ZIP 생성

```powershell
New-Item -ItemType Directory -Force -Path dist | Out-Null

Compress-Archive `
  -Path app_assets\pongdang_gonjiam_v30A1_audio_stability_final `
  -DestinationPath dist\pongdang_gonjiam_v30A1_aquarium_depth_final_20260428.zip `
  -Force

Get-Item dist\pongdang_gonjiam_v30A1_aquarium_depth_final_20260428.zip
```

필수 포함:

- index.html
- admin-preview.html
- qa-aquarium-check.html
- src/app.js
- src/data-loader.js
- src/admin-preview.js
- src/utmul-day-q88-override.js
- src/aquarium-layer-depth-v1.js
- src/fish-depth-tune-v1.js
- src/styles/main.css
- src/styles/aquarium-layer-depth-v1.css
- src/styles/aquarium-zone-special-v1.css
- src/styles/fish-depth-tune-v1.css
- data/*.json
- assets/bg/
- assets/bg_optimized/
- assets/fish/

---

## 결과 문서 생성

생성:

```text
docs/STEP_2026-04-28_WEB_QA_AND_ZIP_BACKUP.md
docs/MASTER_APPEND_2026-04-28_WEB_QA_AND_ZIP_BACKUP.md
```

결과 보고 형식:

```text
[웹 QA 및 ZIP 백업 생성 결과]

1. 웹 확인:
- index.html:
- admin-preview.html:
- qa-aquarium-check.html:

2. 콘솔 audit:
- PondangAquariumDepthV1.audit():
- PondangFishDepthTuneV1.audit():

3. 5존 전환:
- 웃물:
- 여울:
- 잔여울:
- 깊물:
- 물모이:

4. 낮/밤:
- 낮:
- 밤:

5. 주요 버튼:
- 탐사:
- 도감:
- 미션:
- 카메라:
- 음성:

6. 검증:
- node --check:
- JSON parse:

7. ZIP:
- 생성 여부:
- 경로:
- 크기:
- 필수 파일 포함 여부:

8. 최종 판정:
- 통과 / 조건부 통과 / 실패

9. 다음 단계:
- ...
```
