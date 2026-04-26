# 퐁당퐁당 곤지암천 v4.8.31 복구·안정화 점검 리포트

작성 기준: 2026-04-26
기준 저장소: tantarus71-ctrl/pongdang-v5-web
기준 브랜치: main
기준 커밋: f9de6bb6cf2669507e82a29c7d7c0e71a51d533e
기준 앱 파일: app_assets/index.html
확인된 현재 버전: Pongdang4 v4.8.30 Phone Zone Label Fit Test

## 1. 복구 기준 고정

현재 저장소 기준 최신 실행 파일은 `app_assets/index.html`이다. 루트 `index.html`은 `./app_assets/index.html`로 자동 이동하도록 구성되어 있어 외부 시연 진입점은 유지된다.

## 2. 현재 확인된 정상 항목

- 루트 진입 파일 `index.html` 존재
- 앱 본체 `app_assets/index.html` 존재
- `manifest.json` 존재
- `project-manifest.json` 존재
- 버전 기준 `v4.8.30` 일치
- 최신 패키지명 `pongdang4_v4_8_30_phone_zone_label_fit.zip` 기록 존재
- 다음 작업 기준 `v4.8.31 browser-observe phone menu fit` 기록 존재
- 최종 배경 기준 `assets/backgrounds/upper_day_underwater_real_v2.png` 기록 존재

## 3. 즉시 확인된 위험 지점

### 3-1. viewer.html 엔트리 불일치

`manifest.json`과 `project-manifest.json`에는 `viewer.html`이 엔트리로 기록되어 있으나, 현재 저장소 main 기준에서 `viewer.html` 조회가 404로 확인된다.

위험도: 중간
영향: 외부 시연자가 viewer.html 주소를 직접 받았을 경우 열리지 않을 수 있음.
권장 조치: `viewer.html`을 복구하거나, 매니페스트에서 viewer 엔트리를 제거/수정한다.

### 3-2. 직접 코드 덮어쓰기 보류

현재 `app_assets/index.html`은 단일 대형 HTML 파일이다. 네트워크 유실 복구 상황에서는 무리한 직접 덮어쓰기보다 백업 브랜치에서 구조 검증 후 최소 패치하는 방식이 안전하다.

위험도: 높음
영향: 한 번에 수정하면 수족관 배경, 물고기 레이어, 팝업, 카메라 레이어가 동시에 깨질 수 있음.
권장 조치: v4.8.31에서는 화면 간격 미세 조정만 수행하고 기능 추가는 보류한다.

## 4. v4.8.31 최선 진행 순서

1. 현재 main을 기준으로 백업 브랜치를 만든다.
2. `viewer.html` 누락 여부를 먼저 해결한다.
3. 루트 `index.html` → `app_assets/index.html` 이동 구조를 유지한다.
4. 핸드폰 폭 360px, 390px, 412px 기준으로 하단 메뉴와 5존 버튼 줄바꿈을 확인한다.
5. CSS 변수만 최소 조정한다.
6. 물고기 렌더링, 팝업, 카메라 함수는 건드리지 않는다.
7. 수정 후 `manifest.json`과 `project-manifest.json`의 버전을 v4.8.31로 맞춘다.
8. ZIP 패키지명은 `pongdang4_v4_8_31_phone_menu_fit_recovery.zip`로 기록한다.

## 5. 유지해야 할 절대 기준

- 곤지암천 5존 명칭 유지: 웃물 / 여울 / 잔여울 / 깊물 / 물모이
- JOHN CHOI 표기 유지
- 한글 주석 유지
- 모바일 세로형 최우선
- PC/태블릿은 보조 시연 화면으로 안정화
- 단일 기능 단일 함수 원칙
- 중복 함수 추가 금지
- 안정본 백업 후 수정

## 6. 다음 실작업 권장안

최우선 패치는 `viewer.html` 복구다. 내용은 새 기능을 넣지 않고 루트와 동일하게 `app_assets/index.html`로 이동시키는 얇은 진입 파일로 만드는 것이 가장 안전하다.

