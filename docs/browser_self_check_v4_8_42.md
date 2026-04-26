# 퐁당퐁당 v4.8.42 브라우저 자가 점검 도구 적용 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
대상 실행본: app_assets/index_v4_8_40.html
추가 스크립트: app_assets/v4_8_40/js/pongdang-self-check.js

## 1. 목적

v4.8.42의 목적은 경량 실행본을 실제 브라우저에서 열었을 때, DOM 구조·CSS/JS 경로·이미지 자산·렌더링 결과를 즉시 확인할 수 있도록 자가 점검 도구를 추가하는 것이다.

## 2. 신규 추가 파일

```txt
app_assets/v4_8_40/js/pongdang-self-check.js
```

역할:

- 필수 DOM 요소 존재 여부 확인
- 필수 CSS/JS/SVG 파일 응답 확인
- 구간 버튼 렌더링 수 확인
- 낮물/밤물 버튼 렌더링 수 확인
- 하단 메뉴 렌더링 수 확인
- 물고기 렌더링 수 확인
- 도감 카드 렌더링 수 확인
- 화면 오른쪽 상단에 점검 패널 표시
- 콘솔에 상세 점검 결과 출력

## 3. index_v4_8_40.html 연결

다음 스크립트를 추가했다.

```html
<script src="v4_8_40/js/pongdang-self-check.js" defer></script>
```

현재 title은 다음으로 갱신했다.

```txt
퐁당퐁당 v4.8.42 경량 최적화본
```

## 4. 점검 항목

### 4-1. 필수 DOM

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

### 4-2. 필수 파일 경로

- v4_8_40/css/pongdang-ui.css
- v4_8_40/js/pongdang-data.js
- v4_8_40/js/pongdang-app.js
- assets/fish/beodeulchi/swim.svg
- assets/fish/beodeulchi/card.svg
- assets/fish/beodeulchi/popup.svg

### 4-3. 렌더링 기준

통과 기준:

- 구간 버튼 5개 이상
- 모드 버튼 2개 이상
- 하단 메뉴 4개 이상
- 물고기 1개 이상
- 도감 카드 1개 이상

## 5. 사용 방법

브라우저에서 다음 경로를 연다.

```txt
/app_assets/index_v4_8_40.html
```

화면 오른쪽 상단에 `v4.8.42 점검` 패널이 뜬다.

통과 시:

```txt
전체 1차 점검 통과
```

보정 필요 시:

```txt
보정 필요 항목 있음
```

개발자 콘솔에서도 다음 객체가 출력된다.

```txt
[Pongdang self-check]
```

## 6. 현재 판정

v4.8.42는 `브라우저 자가 점검 도구 적용 완료` 상태다.

실제 화면 접속 후 패널 결과에 따라 v4.8.43에서 보정 작업을 진행한다.

## 7. 다음 단계

v4.8.43 권장 작업:

1. 실제 배포 URL에서 `/app_assets/index_v4_8_40.html` 접속
2. 점검 패널 결과 확인
3. 경로 오류가 있으면 파일 위치 또는 경로 보정
4. DOM 누락이 있으면 HTML 구조 보정
5. 렌더링 수 부족 시 JS 렌더링 함수 보정
6. 통과하면 `index_v4_8_40.html`을 원본 교체 후보로 승격

## 8. 완료 판정

v4.8.42는 `경량 실행본 실제 브라우저 점검 준비 완료`로 처리한다.
