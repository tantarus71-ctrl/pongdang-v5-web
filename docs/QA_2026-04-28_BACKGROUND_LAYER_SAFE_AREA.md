# 2026-04-28 배경/레이어 QA 기록

## 기준 버전
- 대상: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final`
- 기준 URL: `http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html`
- QA 범위: 5개 존 낮/저녁 배경, 광선/물방울/수초/물고기/UI 레이어, 모바일 세로 safe area

## 1. 5개 존 낮/저녁 배경 경로 확인
아래 10개 배경 파일은 로컬 서버 HEAD 요청 기준 모두 `200 image/png` 응답을 확인했다.

| 존 | 낮 | 저녁 |
| --- | --- | --- |
| 웃물 | `assets/bg/upper/day.png` | `assets/bg/upper/night.png` |
| 여울 | `assets/bg/rapid/day.png` | `assets/bg/rapid/night.png` |
| 잔여울 | `assets/bg/soft-rapid/day.png` | `assets/bg/soft-rapid/night.png` |
| 깊물 | `assets/bg/deep/day.png` | `assets/bg/deep/night.png` |
| 물모이 | `assets/bg/pool/day.png` | `assets/bg/pool/night.png` |

추가 확인:
- `index.html`: `200 text/html`
- `src/app.js`: `200 text/javascript`
- `src/styles/main.css`: `200 text/css`
- `node --check src/app.js`: 통과

## 2. 배경 전환 구조 확인
- `applyZoneVisual()`에서 현재 존과 낮/저녁 상태에 따라 `#bg.style.backgroundImage`를 직접 지정한다.
- `#bg.dataset.zone`, `#bg.dataset.mode`, `#bg.dataset.src`로 현재 적용 상태를 기록한다.
- `loadZone(id)`는 존 변경 시 아래 순서로 독립 레이어를 갱신한다.
  1. zone runtime reset
  2. 현재 음성 정지
  3. 현재 zone 교체
  4. day/night 배경 preload
  5. 배경 적용
  6. 생태 레이어 재생성
  7. 물방울/입자 재생성
  8. 물고기 재생성
  9. zone isolation 검증

## 3. 레이어 z-index 확인
현재 구조는 배경이 가장 아래에 있고 UI/팝업은 위로 분리되어 있다.

| 레이어 | z-index | pointer-events | 판정 |
| --- | ---: | --- | --- |
| 실제 배경 `#bg` | 0 | none | 정상 |
| aquarium highlight | 1 | none | 정상 |
| 원거리 안개 `far-haze` | 2 | none | 정상 |
| 광선 `godrays` | 5 | none | 정상 |
| 물결 반사 `caustics` | 7 | none | 정상 |
| 수초/돌 `eco-layer` | 12 | none | 정상 |
| 물방울/입자 `particles` | 30 | none | 정상 |
| 물고기 `fish-layer` | 38 | 기본 none, 클릭 가능 물고기만 auto | 정상 |
| 존/힌트/하단 카드 | 76 | 필요한 곳만 auto | 정상 |
| 상단바 | 80 | 내부 버튼 auto | 정상 |
| 하단 메뉴 | 86 | auto | 정상 |
| 기능 패널 | 118 이상 | show 때 auto | 정상 |
| 팝업/카드/도감/카메라 | 120~430 | show 때 auto | 정상 |
| 토스트 | 500 | none | 정상 |

## 4. 모바일 세로 safe area 계산
`safeRect()` 기준으로 물고기 유영 영역은 상단 UI와 하단 카드/메뉴를 피하도록 제한되어 있다.

| 뷰포트 | 물고기 y 범위 | 하단 카드 시작 | 여유 |
| --- | --- | ---: | ---: |
| 360x740 | 178~533 | 596 | 63px |
| 390x844 | 203~608 | 700 | 92px |
| 430x932 | 224~671 | 788 | 117px |
| 768x1024 | 246~737 | 880 | 143px |

판정:
- 모바일 세로형 기준에서 물고기 기본 유영 영역은 하단 카드/메뉴와 직접 겹치지 않는다.
- 하단 UI 위쪽 최소 여유는 360x740 기준 63px로 확보되어 있다.
- 클릭 가능한 물고기는 중앙권과 전면 depth 조건을 통과해야 하므로 UI 영역 침범 가능성이 낮다.

## 5. 광선/물방울/수초/물고기/UI 충돌 확인
- 광선, caustics, 수초, 물방울은 모두 `pointer-events:none`이라 UI 클릭을 막지 않는다.
- 물방울은 `BUBBLE_PROFILES`로 존별 위치/크기/속도/밀도를 다르게 사용한다.
- 수초/돌은 `buildEcoLayer()`에서 존별 plant/stone 수치로 재생성한다.
- 물고기는 `fish-layer` 전체는 클릭을 막지 않고, 클릭 가능한 전면 물고기만 `pointer-events:auto`가 된다.
- `validateZoneIsolation()`에서 clickable/activeFront가 1마리 이하인지 확인한다.

## 6. 발견된 리스크
1. in-app browser 자동 스크린샷 QA는 OS 권한 오류로 실행하지 못했다.
   - 오류 유형: Node REPL browser-client 실행 시 접근 거부
   - 영향: 실제 픽셀 단위 겹침은 육안 확인 필요
2. Netlify 수동 업로드 환경에서는 ZIP 구조에 따라 CSS/JS가 누락될 수 있다.
   - 대응: 정적 CSS/JS 링크 적용 및 forward-slash ZIP 생성 완료
3. 360px 이하 초소형 기기에서는 상단 존 버튼 텍스트가 빡빡할 수 있다.
   - 현재 `overflow:hidden`, 작은 폰트, grid 5분할로 방어되어 있으나 실제 기기 확인 권장

## 7. 최종 판정
- 코드/서버 응답/레이어 구조 기준: 통과
- 모바일 세로 safe area 계산 기준: 통과
- 실제 화면 육안 QA: 필요

## 8. 실제 화면에서 확인할 항목
1. 웃물 낮/저녁 배경 전환
2. 여울 낮/저녁 배경 전환
3. 잔여울 낮/저녁 배경 전환
4. 깊물 낮/저녁 배경 전환
5. 물모이 낮/저녁 배경 전환
6. 광선이 배경을 지나치게 가리지 않는지
7. 물방울이 UI 버튼 위에서 클릭을 방해하지 않는지
8. 수초/돌이 하단 메뉴를 침범하지 않는지
9. 전면 물고기 클릭 영역이 하단 카드/메뉴와 겹치지 않는지
10. 모바일 세로형에서 상단 존 버튼과 힌트가 겹치지 않는지

## 다음 권장 작업
실제 브라우저 화면에서 5개 존 x 낮/저녁을 클릭하며 `PondangV30A1Debug.audit()` 결과를 함께 확인한다.
