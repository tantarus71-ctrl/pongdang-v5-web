# 퐁당퐁당 v4.8.35 버들치 자산 존재 여부 점검

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
작업 브랜치: feature/v4.8.35-beodeulchi-asset-check
기준 문서: docs/beodeulchi_species_spec_v4_8_34.md

## 1. 목적

v4.8.35의 목적은 버들치 앱 1차 적용 전에 필요한 이미지 자산이 실제 저장소에 존재하는지 확인하는 것이다.

이번 단계에서는 앱 본체를 수정하지 않는다.

## 2. 기준 자산 경로

v4.8.34 기준 객체에서 정한 버들치 이미지 경로는 다음이다.

### 2-1. 수조용 이미지

- assets/fish/beodeulchi/left.png
- assets/fish/beodeulchi/right.png
- assets/fish/beodeulchi/front_left.png
- assets/fish/beodeulchi/front_right.png

### 2-2. 도감/팝업 이미지

- assets/fish/beodeulchi/card.png
- assets/fish/beodeulchi/popup.png

## 3. 직접 조회 결과

| 파일 | 상태 | 판정 |
|---|---:|---|
| assets/fish/beodeulchi/left.png | 존재 | 수조용 좌측 이미지 사용 가능 |
| assets/fish/beodeulchi/right.png | 존재 | 수조용 우측 이미지 사용 가능 |
| assets/fish/beodeulchi/front_left.png | 존재 | 수조용 좌측 3/4 이미지 사용 가능 |
| assets/fish/beodeulchi/front_right.png | 존재 | 수조용 우측 3/4 이미지 사용 가능 |
| assets/fish/beodeulchi/card.png | 없음 | 도감 카드용 자산 누락 |
| assets/fish/beodeulchi/popup.png | 없음 | 팝업용 자산 누락 |

## 4. 현재 판정

버들치 수조용 4방향 이미지는 존재한다. 따라서 수조 유영 기준은 이미 일부 갖춰져 있다.

하지만 도감 카드용 `card.png`와 팝업용 `popup.png`가 누락되어 있다. 이 상태에서 버들치 객체를 도감/팝업까지 그대로 적용하면 이미지 깨짐이 발생할 수 있다.

## 5. 적용 가능 범위

### 가능

- 수조용 버들치 4방향 이미지 기반 동작 점검
- 기존 latest.generated.patch.js 내 beodeulchi viewset 점검
- 버들치 행동 데이터 문서화

### 보류

- 도감 카드 이미지 적용
- 팝업 이미지 적용
- 카드/팝업 UI에 버들치 이미지 표시
- 앱 본체에 fish_database_option2 정식 삽입

## 6. 다음 조치 옵션

### A안. 카드/팝업 자산을 새로 제작 후 적용

가장 정석적인 방식이다.

필요 파일:

- assets/fish/beodeulchi/card.png
- assets/fish/beodeulchi/popup.png

장점:

- 도감/팝업 이미지 깨짐 없음
- 수집형 카드 UX 품질 유지
- 문서 기준과 실제 자산 기준 일치

단점:

- 이미지 제작 필요

### B안. 기존 수조용 이미지를 임시로 카드/팝업에 재사용

예: `right.png` 또는 `front_right.png`를 카드/팝업용으로 임시 사용

장점:

- 빠른 테스트 가능

단점:

- 도감 카드 품질 저하
- 수조용 이미지 비율이 카드와 맞지 않을 수 있음
- 향후 다시 교체 필요

### C안. 도감/팝업 이미지를 텍스트 슬롯으로 먼저 처리

이미지 없이 설명 카드만 먼저 띄우는 방식

장점:

- 이미지 누락으로 앱이 깨지는 것을 방지

단점:

- 어린이 수집형 카드 느낌이 약해짐

## 7. 권장안

권장안은 A안이다.

즉, v4.8.35에서는 앱 본체 적용을 보류하고, 먼저 누락된 카드/팝업 자산을 생성하거나 업로드한 뒤 v4.8.36에서 실제 앱 적용으로 넘어간다.

## 8. 실제 앱 적용 전 필수 조건

버들치를 앱에 안전하게 적용하려면 다음 6개 파일이 모두 있어야 한다.

- left.png
- right.png
- front_left.png
- front_right.png
- card.png
- popup.png

현재 충족 상태:

- 충족: 4개
- 누락: 2개

## 9. 완료 판정

v4.8.35는 `버들치 자산 존재 여부 점검 완료` 상태로 처리한다.

실제 앱 적용은 보류한다.

다음 순번:

v4.8.36 — 버들치 카드/팝업 누락 자산 제작 기준 확정 또는 기존 자산 임시 재사용 여부 결정
