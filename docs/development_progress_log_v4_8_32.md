# 퐁당퐁당 개발 진행 데이터 로그 v4.8.32

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
작업 브랜치: feature/v4.8.32-mobile-menu-fit
기준 브랜치: recovery/v4.8.31-safety-audit
기준 앱 파일: app_assets/index.html

## 1. 현재 진행 위치

현재 진행 위치는 v4.8.32 단계다.

v4.8.31에서 완료된 작업:

1. 저장소 최신본 기준 확인
2. recovery/v4.8.31-safety-audit 브랜치 생성
3. viewer.html 복구
4. manifest.json v4.8.31 정합성 반영
5. project-manifest.json v4.8.31 정합성 반영
6. 복구 리포트 작성
7. 전체 개발 기획서 작성
8. 물고기 디자인 시스템 기준서 작성
9. 전체 개발 기획서에 물고기 디자인 기준 연결

v4.8.32에서 진행할 작업:

1. feature/v4.8.32-mobile-menu-fit 브랜치 생성
2. 진행 데이터 문서화
3. 모바일 메뉴 폭 안정화 명세 작성
4. CSS 후보 패치 작성
5. 앱 본체 직접 수정 전 검증 기준 수립
6. 이후 실제 앱 본체 반영 여부 판단

## 2. v4.8.32 작업 원칙

v4.8.32는 기능 추가 버전이 아니다.

목표는 다음 하나다.

`핸드폰 세로 화면에서 5존 버튼과 하단 메뉴가 밀리거나 겹치지 않게 만드는 것`

허용 수정:

- CSS 변수
- 버튼 padding
- font-size
- gap
- min-height
- max-height
- border-radius
- HTML title 문구

금지 수정:

- 물고기 렌더링 함수
- 배경 레이어 함수
- 팝업/도감 로직
- 카메라 권한 로직
- localStorage 저장 구조
- 어종 데이터 구조
- 물고기 이미지 자산 교체

## 3. 실기기 검증 폭

- 360px
- 375px
- 390px
- 412px
- 430px
- Android Chrome
- iOS Safari
- 태블릿 세로
- PC 브라우저

## 4. 주요 확인 항목

### 4-1. 5존 버튼

- 웃물
- 여울
- 잔여울
- 깊물
- 물모이

확인 기준:

- 물모이 텍스트가 밀리지 않을 것
- 잔여울이 과하게 눌리지 않을 것
- 버튼이 한 줄 칩형 스크롤로 유지될 것
- 세로 폭을 과하게 차지하지 않을 것

### 4-2. 하단 메뉴

- 탐험
- 도감
- 반짝
- 카메라

확인 기준:

- 4개 메뉴가 한 줄 유지
- 아이콘과 글자가 겹치지 않음
- 손가락 터치 면적 유지
- 수족관 면적을 과하게 침범하지 않음

### 4-3. 수족관 영역

확인 기준:

- 중앙 수족관이 작아지지 않을 것
- fishLayer가 메뉴 밑으로 가려지지 않을 것
- 배경 카드 라운드가 깨지지 않을 것

## 5. v4.8.32 산출물

이번 단계 산출물:

1. docs/development_progress_log_v4_8_32.md
2. docs/mobile_menu_fit_v4_8_32.md
3. patches/v4_8_32_mobile_menu_fit_candidate.css

앱 본체 app_assets/index.html은 아직 직접 수정하지 않는다.

## 6. 다음 판단 기준

후보 CSS를 실제 앱 본체에 반영하려면 다음이 먼저 확인되어야 한다.

1. 기존 latest.generated.patch.js가 앱에서 실제 로드되는지 확인
2. latest.generated.patch.js의 기존 mobile menu fit 스타일과 충돌 여부 확인
3. app_assets/index.html 직접 수정이 필요한지 판단
4. 직접 수정 시 전체 파일 백업 후 최소 변경

## 7. 현재 판정

현재 단계는 `v4.8.32 작업 시작 및 후보 패치 준비 단계`다.

앱 본체 변경 전이므로 안정성은 유지된다.
