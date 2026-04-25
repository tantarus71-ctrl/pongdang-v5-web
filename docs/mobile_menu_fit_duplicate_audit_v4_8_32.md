# 퐁당퐁당 v4.8.32 모바일 메뉴 패치 중복 점검

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
작업 브랜치: feature/v4.8.32-mobile-menu-fit
기준 파일: patches/latest.generated.patch.js
후보 파일: patches/v4_8_32_mobile_menu_fit_candidate.css

## 1. 점검 목적

v4.8.32 모바일 메뉴 폭 안정화 작업을 진행하기 전에, 기존 패치 파일에 이미 같은 성격의 CSS가 들어 있는지 확인한다. 같은 CSS를 앱 본체와 패치 파일에 중복 삽입하면 모바일 레이아웃이 예측 불가능하게 흔들릴 수 있다.

## 2. 확인 결과

`patches/latest.generated.patch.js`에는 이미 `installMobileMenuFitStyles()` 함수가 존재한다.

이 함수는 다음을 포함한다.

- `@media (max-width: 680px) and (orientation: portrait)`
- `--hero-h`
- `--dock-h`
- `--bottom-nav-h`
- `.zoneBar`
- `.modeBar`
- `.zoneBtn`
- `.modeBtn`
- `.bottomNav`
- `.navBtn`
- `.navEmoji`
- `.navText`
- `@media (max-width: 390px) and (orientation: portrait)`
- `.zoneBtn[data-zone="confluence"]`

즉, 현재 후보 CSS와 기존 패치의 목적과 적용 범위가 상당 부분 중복된다.

## 3. 판정

현재 단계에서 `app_assets/index.html`에 후보 CSS를 직접 삽입하면 안 된다.

이유:

1. 기존 JS 패치가 이미 모바일 메뉴 폭 조정 CSS를 주입한다.
2. 같은 선택자에 `!important`가 중복 적용될 가능성이 높다.
3. 중복 적용 시 하단 메뉴 높이, 수조 카드 영역, fishLayer 경계가 흔들릴 수 있다.
4. v4.8.32의 목적은 안정화이지 기능 추가가 아니다.

## 4. 권장 진행

가장 안전한 방식은 다음이다.

1. `patches/v4_8_32_mobile_menu_fit_candidate.css`는 후보 파일로 유지한다.
2. 실제 반영은 `latest.generated.patch.js` 안의 기존 `installMobileMenuFitStyles()` 한 곳만 조정한다.
3. 조정 전 현재 앱에서 JS 패치가 실제 로드되는지 확인한다.
4. 로드가 확인되지 않으면 app_assets/index.html에 패치 로드 구조가 있는지 먼저 점검한다.
5. JS 패치가 로드되고 있다면 HTML 본체에는 CSS를 추가하지 않는다.

## 5. 다음 작업

다음 순번은 `latest.generated.patch.js`의 기존 모바일 메뉴 스타일을 v4.8.32 기준으로 최소 조정하는 것이다.

단, 실제 조정 전에는 다음을 확인해야 한다.

- app_assets/index.html에서 latest.generated.patch.js를 호출하는지
- 호출하지 않는다면 후보 CSS는 아무 효과가 없음
- 호출한다면 latest.generated.patch.js만 조정

## 6. 현재 상태

- 앱 본체 app_assets/index.html: 변경 없음
- 후보 CSS: 생성 완료
- 중복 위험: 확인됨
- 실제 반영: 보류
- 다음 작업: 패치 로드 구조 확인
