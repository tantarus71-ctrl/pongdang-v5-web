# 퐁당퐁당 v4.8.43 브라우저 자가 점검 강화 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
대상 실행본: app_assets/index_v4_8_40.html
강화 파일: app_assets/v4_8_40/js/pongdang-self-check.js

## 1. 목적

v4.8.43의 목적은 v4.8.42에서 추가한 브라우저 자가 점검 도구를 더 안정적으로 보강하는 것이다.

브라우저와 정적 호스팅 환경에 따라 HEAD 요청이 실패하거나, 이미지 로딩·레이아웃 겹침 문제가 늦게 나타날 수 있으므로 점검 범위를 확장했다.

## 2. 이번 작업 완료 내역

### 2-1. 자가 점검 스크립트 강화

수정 파일:

```txt
app_assets/v4_8_40/js/pongdang-self-check.js
```

강화 내용:

- v4.8.43 점검 ID로 갱신
- 기존 v4.8.42 점검 패널 자동 제거
- HEAD 실패 시 GET fallback 확인 추가
- 이미지 로드 상태 검사 추가
- 수족관/하단 메뉴 배치 겹침 검사 추가
- 수족관 최소 높이 검사 추가
- 0.5초/1.3초 이중 점검으로 늦은 렌더링 대응
- 콘솔 출력명을 `[Pongdang self-check v4.8.43]`로 변경

### 2-2. HTML 제목 갱신

수정 파일:

```txt
app_assets/index_v4_8_40.html
```

변경 내용:

```txt
퐁당퐁당 v4.8.43 경량 최적화본
```

## 3. v4.8.43 점검 항목

### 3-1. DOM 구조

- #app
- #heroTitle
- #heroSub
- #zoneBar
- #modeBar
- #fishLayer
- #bottomNav
- #bookSheet
- #rareSheet
- #cameraSheet
- #fishModal
- #modalImg

### 3-2. 파일 경로

- v4_8_40/css/pongdang-ui.css
- v4_8_40/js/pongdang-data.js
- v4_8_40/js/pongdang-app.js
- assets/fish/beodeulchi/swim.svg
- assets/fish/beodeulchi/card.svg
- assets/fish/beodeulchi/popup.svg

### 3-3. 렌더링 수

- 구간 버튼 5개 이상
- 모드 버튼 2개 이상
- 하단 메뉴 4개 이상
- 물고기 1개 이상
- 도감 카드 1개 이상

### 3-4. 이미지 로드

브라우저의 `document.images` 기준으로 표시 이미지가 실제 로드됐는지 확인한다.

### 3-5. 배치 안정성

수족관과 하단 메뉴의 위치를 계산해 다음을 확인한다.

- 수족관 최소 높이 확보
- 하단 메뉴와 수족관의 겹침 방지

## 4. 통과 문구

전체 통과 시 패널에 다음 문구가 표시된다.

```txt
전체 1차 점검 통과 · 원본 교체 후보 가능
```

문제 발생 시:

```txt
보정 필요 항목 있음
```

## 5. 테스트 경로

```txt
/app_assets/index_v4_8_40.html
```

## 6. 현재 판정

v4.8.43은 `자가 점검 도구 강화 완료` 상태다.

실제 브라우저에서 점검 패널이 전체 통과를 표시하면, 다음 단계에서 `index_v4_8_40.html`을 원본 교체 후보로 승격할 수 있다.

## 7. 다음 단계

v4.8.44 권장 작업:

1. 실제 배포 URL에서 `/app_assets/index_v4_8_40.html` 접속
2. v4.8.43 점검 패널 확인
3. 전체 통과 여부 확인
4. 모바일 세로형 화면 확인
5. PC 화면 확인
6. 태블릿 화면 확인
7. 통과 시 원본 교체 후보 문서 작성
8. 미통과 시 해당 항목 단위로 보정

## 8. 완료 판정

v4.8.43은 `브라우저 자가 점검 강화 및 경량 실행본 교체 후보 사전 준비 완료`로 처리한다.
