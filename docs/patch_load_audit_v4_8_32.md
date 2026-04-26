# 퐁당퐁당 v4.8.32 패치 로드 구조 점검

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
작업 브랜치: feature/v4.8.32-mobile-menu-fit
대상 파일: app_assets/index.html
패치 파일: patches/latest.generated.patch.js

## 1. 점검 목적

v4.8.32 모바일 메뉴 안정화 작업에서 실제 수정 위치를 결정하기 위해, 앱 본체 `app_assets/index.html`이 `patches/latest.generated.patch.js`를 호출하는지 확인한다.

## 2. 확인 결과

저장소 검색 결과 `app_assets/index.html`에서 `../patches/latest.generated.patch.js` 호출 흔적이 확인되었다.

따라서 현재 구조는 다음으로 판단한다.

- 앱 본체: `app_assets/index.html`
- 후속 보정 패치: `patches/latest.generated.patch.js`
- 모바일 메뉴 관련 기존 함수: `installMobileMenuFitStyles()`

## 3. 판정

v4.8.32에서 모바일 메뉴 폭 조정을 실제 반영할 경우, HTML 본체에 새 CSS를 직접 추가하기보다 기존 `latest.generated.patch.js` 안의 `installMobileMenuFitStyles()`를 수정하는 방식이 가장 안전하다.

단, 현재 `latest.generated.patch.js`에는 이미 다음 항목이 들어 있다.

- 680px 이하 세로 화면 조정
- 390px 이하 초소형 화면 조정
- 5존 버튼 폭 조정
- 물모이 confluence 버튼 최소 폭 조정
- 하단 메뉴 높이 조정
- navEmoji/navText 크기 조정

## 4. 현재 조치

이번 단계에서는 앱 본체를 수정하지 않았다.

생성한 파일:

1. `docs/development_progress_log_v4_8_32.md`
2. `docs/mobile_menu_fit_v4_8_32.md`
3. `patches/v4_8_32_mobile_menu_fit_candidate.css`
4. `docs/mobile_menu_fit_duplicate_audit_v4_8_32.md`
5. `docs/patch_load_audit_v4_8_32.md`

## 5. 다음 조치

v4.8.32의 안전한 다음 조치는 다음 중 하나다.

### A안: 문서 기준 완료 처리

기존 `latest.generated.patch.js`에 이미 v4.8.32와 거의 같은 모바일 메뉴 안정화 CSS가 있으므로, 이번 단계는 문서화와 검증 준비 단계로 마감한다.

### B안: 실제 패치 갱신

`latest.generated.patch.js`의 id/version/generatedAt/description과 일부 CSS만 v4.8.32로 갱신한다.

단, 이 경우 큰 JS 파일을 직접 수정해야 하므로 실기기 검증 전에는 위험도가 있다.

## 6. 권장안

현재 최선은 A안이다.

이유:

1. 기존 모바일 메뉴 패치가 이미 존재한다.
2. 후보 CSS와 기존 패치가 중복된다.
3. 앱 본체를 건드리지 않아 안정성이 유지된다.
4. 다음 단계인 v4.8.33 어종 데이터 추출로 넘어갈 수 있다.

## 7. 현재 판정

v4.8.32는 `모바일 메뉴 폭 안정화 기준 확인 및 후보 패치 문서화 완료` 상태로 처리한다.

다음 순번은 v4.8.33 어종 데이터 추출이다.
