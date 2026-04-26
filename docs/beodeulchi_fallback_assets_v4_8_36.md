# 퐁당퐁당 v4.8.36 버들치 SVG fallback 자산 적용 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
기준 앱 파일: app_assets/index.html
기준 데이터 파일: data/fish_catalog_option2.json
직전 문서: docs/beodeulchi_asset_check_v4_8_35.md

## 1. 목적

v4.8.36의 목적은 버들치 도감 카드와 팝업 이미지 PNG가 아직 없는 상태에서도 앱 화면이 깨지지 않도록 SVG fallback 자산 기준을 확정하는 것이다.

이번 단계는 최종 PNG 제작 전 안정화 단계다.

## 2. 기존 확인 상태

v4.8.35 기준 확인 결과:

- assets/fish/beodeulchi/left.png 존재
- assets/fish/beodeulchi/right.png 존재
- assets/fish/beodeulchi/front_left.png 존재
- assets/fish/beodeulchi/front_right.png 존재
- assets/fish/beodeulchi/card.png 없음
- assets/fish/beodeulchi/popup.png 없음

추가 확인 결과:

- assets/fish/beodeulchi/card.svg 존재
- assets/fish/beodeulchi/swim.svg 존재
- assets/fish/beodeulchi/popup.svg 신규 추가

## 3. 이번 작업 내역

### 3-1. 신규 추가

- assets/fish/beodeulchi/popup.svg

용도:

- 버들치 상세 팝업용 임시 벡터 이미지
- popup.png 누락 시 이미지 깨짐 방지
- 어린이용 친화형 반입체 버들치 표현

### 3-2. 데이터 파일 수정

수정 파일:

- data/fish_catalog_option2.json

수정 내용:

- status 값을 `planning`에서 `fallback-assets-ready`로 변경
- fallbackVector에 `popup` 경로 추가
- assetPolicy 추가
- 카드/팝업 이미지 표시 우선순위 명시

## 4. 표시 우선순위

### 카드 이미지

1. assets/fish/beodeulchi/card.png
2. assets/fish/beodeulchi/card.svg
3. assets/fish/beodeulchi/front_right.png
4. assets/fish/beodeulchi/right.png

### 팝업 이미지

1. assets/fish/beodeulchi/popup.png
2. assets/fish/beodeulchi/popup.svg
3. assets/fish/beodeulchi/front_right.png
4. assets/fish/beodeulchi/right.png

## 5. 현재 판정

버들치 PNG 최종 자산은 아직 완성되지 않았지만, SVG fallback이 준비되어 도감/팝업 이미지 깨짐 위험은 낮아졌다.

단, app_assets/index.html 런타임 로직은 아직 이 assetPolicy를 직접 읽어 표시하도록 수정하지 않았다.

## 6. 다음 단계

v4.8.37 권장 작업:

1. app_assets/index.html 백업 확인
2. 도감 카드 이미지 경로 로직 점검
3. 팝업 이미지 경로 로직 점검
4. 이미지 로드 실패 시 fallback 순차 적용 함수 추가
5. 기존 함수와 중복 여부 점검
6. 모바일/태블릿/PC 화면에서 카드·팝업 깨짐 여부 확인

## 7. 금지 사항

다음 단계 전까지 금지한다.

- 기존 수조용 4방향 PNG 삭제
- card.svg 삭제
- swim.svg 삭제
- popup.svg 삭제
- 피라미/쉬리/각시붕어 동시 추가
- index.html에 중복 이미지 로더 함수 무분별 삽입

## 8. 완료 판정

v4.8.36은 `버들치 SVG fallback 자산 준비 완료` 상태로 처리한다.

다음 순번:

v4.8.37 — index.html 런타임 fallback 표시 로직 적용
