# 2026-04-28 배경 레이어 표시 안정화

## 기준 안정본
- 기준: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final`
- 대상: 존별 낮/저녁 배경 표시 레이어

## 목표
- 각 존 배경이 CSS 상대 경로 문제나 오버레이 레이어 때문에 보이지 않는 문제를 방지한다.
- 메뉴, 팝업, 물고기 클릭 영역과 충돌하지 않게 배경 레이어를 최하단에 고정한다.

## 적용 내용
- `src/app.js`
  - `resolveAssetUrl()` 추가: 배경 이미지를 `document.baseURI` 기준 절대 URL로 변환한다.
  - `applyZoneVisual()`에서 `#bg.style.backgroundImage`를 직접 지정한다.
  - 배경 로더 중복 resolve를 막는 `finish()` 가드를 추가한다.
  - `PondangV30A1Debug.debugBackground()` 추가.
- `src/styles/main.css`
  - `.aquarium`에 `isolation:isolate` 적용.
  - `.bg`에 `pointer-events:none`, `background-repeat:no-repeat`, `opacity:1` 명시.
  - 광선/하이라이트 레이어 투명도를 낮춰 배경을 덮지 않게 조정.

## 검증 체크리스트
- `node --check src/app.js`
- `index.html`, `src/app.js`, 주요 배경 이미지 HTTP 200 확인
- 존 클릭 시 `#bg.dataset.zone` 변경 확인
- 낮/저녁 클릭 시 `#bg.dataset.mode` 변경 확인
- `PondangV30A1Debug.debugBackground()`에서 `computedImage`가 실제 배경 URL인지 확인

## 다음 단계
- 필요 시 이미지 용량은 별도 단계에서 WebP/AVIF 파생본으로 최적화한다.
