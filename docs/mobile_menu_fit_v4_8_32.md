# 퐁당퐁당 v4.8.32 모바일 메뉴 폭 안정화 명세

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
작업 브랜치: feature/v4.8.32-mobile-menu-fit

## 1. 목적

v4.8.32의 목적은 핸드폰 세로 화면에서 5존 버튼과 하단 메뉴가 겹치거나 밀리지 않게 만드는 것이다.

이번 단계에서는 앱 기능을 추가하지 않는다. 물고기, 배경, 도감, 팝업, 카메라 로직은 건드리지 않는다.

## 2. 현재 기준

현재 저장소에는 `patches/latest.generated.patch.js` 안에 `installMobileMenuFitStyles()`가 이미 존재한다. 따라서 v4.8.32에서는 같은 성격의 CSS를 무작정 추가하지 않고, 기존 패치와 충돌하지 않는 후보 CSS를 별도 파일로 둔다.

## 3. 조정 대상

### 3-1. 상단 안내 카드

대상:

- `.heroCard`
- `.heroLabel`
- `.heroTitle`
- `.heroSub`

목표:

- 높이 축소
- 글자 가독성 유지
- 수족관 영역 침범 최소화

### 3-2. 5존 버튼 바

대상:

- `.aquaControlDock`
- `.zoneBar`
- `.modeBar`
- `.zoneBtn`
- `.modeBtn`

목표:

- 버튼 한 줄 유지
- `물모이` 밀림 방지
- `잔여울` 압축 깨짐 방지
- 가로 스크롤 칩형 유지

### 3-3. 하단 메뉴

대상:

- `.bottomNav`
- `.navBtn`
- `.navEmoji`
- `.navText`

목표:

- 4개 메뉴 한 줄 유지
- 터치 영역 유지
- 글자/이모지 겹침 방지
- 수족관 화면 최대 확보

## 4. 권장 CSS 조정 범위

- `--hero-h`: 48px ~ 58px
- `--dock-h`: 58px ~ 70px
- `--bottom-nav-h`: 64px ~ 76px
- `.zoneBtn font-size`: 10px ~ 11.5px
- `.navText font-size`: 10px ~ 11px
- `.navEmoji font-size`: 18px ~ 21px

## 5. 검증 폭

- 360px: 가장 좁은 안드로이드 기준
- 375px: 구형 iPhone 기준
- 390px: 일반 iPhone 기준
- 412px: 갤럭시 기준
- 430px: 대형 폰 기준

## 6. 완료 기준

1. 360px에서도 하단 메뉴 4개가 겹치지 않는다.
2. 390px에서 `물모이`가 밀리지 않는다.
3. 412px 이상에서 버튼이 지나치게 작아 보이지 않는다.
4. 수족관 영역이 충분히 남는다.
5. 팝업/도감/카메라와 충돌하지 않는다.

## 7. 실제 반영 방식

1. 먼저 `patches/v4_8_32_mobile_menu_fit_candidate.css`를 후보로 만든다.
2. 후보 CSS를 검토한다.
3. 기존 `latest.generated.patch.js`의 `installMobileMenuFitStyles()`와 중복되는 부분을 비교한다.
4. 실제 반영은 한 군데만 한다.
5. 반영 후 `manifest.json`, `project-manifest.json`, 전체 기획서 버전을 v4.8.32로 맞춘다.

## 8. 금지 사항

- 같은 CSS를 HTML과 JS 패치 양쪽에 중복 삽입 금지
- 메뉴 안정화와 물고기 적용 동시 진행 금지
- 메뉴 안정화와 카메라 권한 수정 동시 진행 금지
- 실기기 검증 전 main 병합 금지
