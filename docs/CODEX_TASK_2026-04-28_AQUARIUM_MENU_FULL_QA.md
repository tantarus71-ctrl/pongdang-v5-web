# CODEX TASK - 2026-04-28 수족관 레이어·메뉴·전체 기능 QA

## 목표

현재 `pongdang_gonjiam_v30A1_audio_stability_final` 작업본의 수족관 레이어, 메뉴, 주요 기능이 오류 없이 안정적으로 작동하는지 전체 점검한다.

이번 작업은 새 기능 개발이 아니다. 현재 적용된 수족관 입체 레이어, q88 배경, 5존 특수성 보정, 버들치 depth 보정, 메뉴 기능이 충돌 없이 동작하는지 확인하고, 문제가 발견될 경우 최소 수정만 수행한다.

---

## 기준 폴더

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/
```

---

## 중점 확인 파일

```text
index.html
admin-preview.html
qa-aquarium-check.html
src/app.js
src/data-loader.js
src/admin-preview.js
src/utmul-day-q88-override.js
src/aquarium-layer-depth-v1.js
src/fish-depth-tune-v1.js
src/styles/main.css
src/styles/aquarium-layer-depth-v1.css
src/styles/aquarium-zone-special-v1.css
src/styles/fish-depth-tune-v1.css
data/zones.json
data/assets_manifest.json
data/species.json
data/dex_cards.json
data/missions.json
data/audio_scripts.json
data/ui_texts.json
```

---

## 절대 금지

- 새 어종 추가 금지
- 관리자 편집/저장 기능 추가 금지
- 전체 구조 대개편 금지
- 이미지 삭제 금지
- 배경 경로 임의 변경 금지
- app.js 대규모 수정 금지
- 기존 q88 / 수족관 레이어 / depth 보정 구조 삭제 금지
- 같은 기능을 중복 코드로 다시 만들기 금지

---

## 허용되는 최소 수정

문제가 확인될 경우 아래 범위의 최소 수정만 허용한다.

- 레이어 z-index 조정
- pointer-events 조정
- 수초/돌/거품/입자 opacity 감산
- 작은 생물 표시 감산
- 중복 렌더 방지
- 메뉴 클릭 막힘 해결
- 낮/밤 전환 후 상태 재적용 보정
- audit 출력 보완
- 콘솔 오류 제거

---

## 1차 정적 검증

아래 명령을 실행한다.

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

## 로컬 서버 실행

```powershell
python -m http.server 4830
```

확인 URL:

```text
http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html?cache=full-qa
http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html?cache=full-qa
http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/qa-aquarium-check.html?cache=full-qa
```

---

## 브라우저 콘솔 audit 확인

앱 화면에서 아래 명령을 실행한다.

```js
window.PondangAquariumDepthV1?.audit()
window.PondangFishDepthTuneV1?.audit()
window.PondangUtmulDayQ88Override
```

확인 기준:

- `PondangAquariumDepthV1.audit()`가 객체를 반환해야 한다.
- `PondangFishDepthTuneV1.audit()`가 객체를 반환해야 한다.
- `PondangUtmulDayQ88Override`가 존재해야 한다.
- `aqDepthRoot`, `aqDepthBack`, `aqDepthMid`, `aqCreatureBack`, `aqCreatureFront`, `aqDepthFront`, `aqParticleFront`, `aqDepthAmbient`가 true여야 한다.
- fish total이 0이면 실패다.
- clickable fish가 0이면 실패다.

---

## 수족관 레이어 QA

확인 항목:

- 첫 화면 정상 로드
- q88 웃물 낮 배경 표시
- 물고기 표시
- 수초/돌/거품/작은 생물이 과밀하지 않음
- 전경 수초가 물고기 클릭을 막지 않음
- UI가 수족관 레이어에 가려지지 않음
- 콘솔 JS 오류 없음
- 이미지 404 없음
- 레이어가 존 전환 시 중복 생성되지 않음

---

## 5존 QA

아래 5존을 모두 확인한다.

- 웃물
- 여울
- 잔여울
- 깊물
- 물모이

존별 기준:

### 웃물

- 맑고 얕은 느낌
- 수초/생물/거품이 과하지 않음
- q88 낮 배경 정상

### 여울

- 흐름감 있음
- 빛/거품이 과하게 번쩍이지 않음
- 돌/자갈 느낌이 살아 있음

### 잔여울

- 수초가 풍부하되 복잡하지 않음
- 전경 수초가 물고기 클릭을 막지 않음

### 깊물

- 깊고 차분함
- 너무 까맣지 않음
- 작은 생물이 과하게 튀지 않음

### 물모이

- 풍성하지만 정신없지 않음
- 수초/돌/입자/생물이 균형 있음

---

## 낮/밤 QA

- 낮 → 밤 → 낮 전환 정상
- 밤에서 q88이 강제로 덮이지 않음
- 다시 낮으로 돌아왔을 때 q88 재적용
- 밤 조명이 LED처럼 과장되지 않음
- 밤에도 UI 가독성 유지

---

## 메뉴/버튼 QA

반드시 아래 메뉴와 버튼을 모두 눌러본다.

- 존 버튼 5개
- 낮/밤 버튼
- 전체화면 버튼
- 음성 버튼
- 탐사 메뉴
- 도감 메뉴
- 미션 메뉴
- 카메라 메뉴
- 팝업 열기/닫기
- 카드 상세 팝업 열기/닫기

확인 기준:

- 클릭 반응 있음
- 패널 열림/닫힘 정상
- 콘솔 오류 없음
- 레이어가 클릭을 막지 않음
- 모바일 폭에서 버튼 겹침 없음

---

## 관리자 preview QA

`admin-preview.html`에서 확인한다.

- 대시보드 표시
- 존 데이터 표시
- 어종 데이터 표시
- 도감 카드 표시
- 미션 표시
- 음성 스크립트 표시
- UI 문구 표시
- 자산 경로 표시
- 진단 로그 표시
- 저장/수정/삭제 버튼 없음
- backgrounds 10개 표시
- `utmul_day.path`가 q88 경로인지 확인
- `utmul_day.fallbackPath`가 원본 jpg인지 확인

---

## 문제 발생 시 수정 기준

문제가 있으면 아래 순서로 처리한다.

1. 문제 유형 분류
2. 원인 파일 확인
3. 최소 수정
4. node --check 재실행
5. 브라우저 재확인
6. 결과 문서 기록

문제 유형 예시:

- 경로 문제
- z-index 문제
- pointer-events 문제
- 중복 렌더 문제
- 메뉴 클릭 막힘
- 낮/밤 상태 재적용 문제
- 레이어 과밀 문제
- audit 미노출 문제

---

## 결과 문서 생성

작업 완료 후 아래 문서를 생성한다.

```text
docs/STEP_2026-04-28_AQUARIUM_MENU_FULL_QA.md
docs/MASTER_APPEND_2026-04-28_AQUARIUM_MENU_FULL_QA.md
```

문서 형식:

```text
[수족관 레이어 / 메뉴 / 전체 기능 QA 결과]

1. 점검 범위
- 확인 파일:
- 실행 페이지:

2. 수족관 상태
- 첫 화면:
- 배경:
- 레이어:
- fish-layer:
- zone 전환:
- 낮/밤:

3. 메뉴/버튼 상태
- 탐사:
- 도감:
- 미션:
- 카메라:
- 음성:
- 존 버튼:
- 팝업 열기/닫기:

4. 콘솔 검증
- JS 오류:
- 404 오류:
- PondangAquariumDepthV1.audit():
- PondangFishDepthTuneV1.audit():
- PondangUtmulDayQ88Override:

5. 수정한 내용
- 파일:
- 수정 이유:
- 수정 요약:

6. 최종 판정
- 통과 / 조건부 통과 / 실패

7. 다음 단계 제안
- ...
```

---

## 최종 목표

이번 작업의 최종 목표는 아래 한 줄이다.

```text
수족관 레이어와 메뉴를 포함한 전체 기본 기능이 오류 없이 안정적으로 동작하는 상태를 만든다.
```
