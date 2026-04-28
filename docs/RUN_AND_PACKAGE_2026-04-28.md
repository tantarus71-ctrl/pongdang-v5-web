# 퐁당퐁당 곤지암천 v30A-1 실행 및 압축 기준

## 목적

현재 작업본을 사용자가 직접 실행하고, Codex가 전체 프로그램 ZIP을 생성할 수 있게 기준을 고정한다.

## 기준 폴더

`app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`

## 실행 파일

- 앱 실행: `index.html`
- 관리자 preview: `admin-preview.html`
- 수족관 QA 확인: `qa-aquarium-check.html`

## 로컬 실행 기준

저장소 루트에서 로컬 웹 서버를 열고 아래 파일을 브라우저로 확인한다.

- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html`
- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html`
- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/qa-aquarium-check.html`

## 브라우저 콘솔 확인

앱 화면에서 아래 전역 객체가 존재해야 한다.

- `window.PondangAquariumDepthV1`
- `window.PondangFishDepthTuneV1`
- `window.PondangUtmulDayQ88Override`

확인 함수:

- `PondangAquariumDepthV1.audit()`
- `PondangFishDepthTuneV1.audit()`

## ZIP 생성 기준

Codex는 아래 폴더 전체를 압축한다.

`app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`

출력 파일명:

`dist/pongdang_gonjiam_v30A1_aquarium_depth_final_20260428.zip`

## ZIP 필수 포함

- `index.html`
- `admin-preview.html`
- `qa-aquarium-check.html`
- `src/app.js`
- `src/data-loader.js`
- `src/admin-preview.js`
- `src/utmul-day-q88-override.js`
- `src/aquarium-layer-depth-v1.js`
- `src/fish-depth-tune-v1.js`
- `src/styles/main.css`
- `src/styles/aquarium-layer-depth-v1.css`
- `src/styles/aquarium-zone-special-v1.css`
- `src/styles/fish-depth-tune-v1.css`
- `data/`
- `assets/bg/`
- `assets/bg_optimized/`
- `assets/fish/`

## 최종 판정

ZIP을 풀었을 때 `index.html`을 브라우저로 열어 앱이 실행되면 통과다.

QA 확인은 `qa-aquarium-check.html`에서 수행한다.
