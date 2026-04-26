# 퐁당퐁당 v4.8.41 경량 실행본 오류 점검 및 경로 보정 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
점검 대상:

- app_assets/index_v4_8_40.html
- app_assets/v4_8_40/css/pongdang-ui.css
- app_assets/v4_8_40/js/pongdang-data.js
- app_assets/v4_8_40/js/pongdang-app.js

## 1. 목적

v4.8.41의 목적은 v4.8.40에서 만든 경량·분산 구조 실행본의 경로 오류와 기본 실행 위험 요소를 점검하고, 즉시 보정하는 것이다.

## 2. 확인된 파일

### 2-1. HTML

```txt
app_assets/index_v4_8_40.html
```

확인 결과:

- CSS 연결 존재
- JS module 연결 존재
- 기본 HTML 구조 정상
- 제목은 v4.8.41 경량 최적화본으로 갱신

### 2-2. CSS

```txt
app_assets/v4_8_40/css/pongdang-ui.css
```

확인 결과:

- 수족관 배치 스타일 존재
- 하단 메뉴 스타일 존재
- 시트/모달 스타일 존재
- 작은 휴대폰/태블릿/PC media query 존재

### 2-3. 데이터 모듈

```txt
app_assets/v4_8_40/js/pongdang-data.js
```

확인 결과:

- ZONES 데이터 존재
- MENU 데이터 존재
- FISH 데이터 존재
- 버들치 이미지 경로가 `assets/...` 기준으로 보정됨

### 2-4. 앱 모듈

```txt
app_assets/v4_8_40/js/pongdang-app.js
```

확인 결과:

- 데이터 모듈 import 존재
- 메뉴 렌더링 함수 존재
- 구간 렌더링 함수 존재
- 도감 렌더링 함수 존재
- 모달 열기/닫기 함수 존재
- 간단한 물고기 유영 애니메이션 존재

## 3. 발견한 오류 및 보정

### 오류 1. 이미지 상대경로 오류 위험

초기 v4.8.40 데이터에서는 어종 이미지 경로가 다음과 같았다.

```js
'../assets/fish/beodeulchi/swim.svg'
```

하지만 `index_v4_8_40.html`은 `app_assets/` 위치에서 실행되므로, 위 경로는 저장소 루트의 `assets/`로 올라가게 된다.

실제 저장소 기준에서는 다음이 맞다.

```js
'assets/fish/beodeulchi/swim.svg'
```

보정 완료:

- `img`
- `cardImg`
- `popupImg`

모두 `assets/...` 기준으로 수정했다.

### 오류 2. 기본 모달 이미지 경로 오류 위험

초기 HTML의 기본 모달 이미지도 다음 형태였다.

```html
src="../assets/fish/beodeulchi/popup.svg"
```

보정 후:

```html
src="assets/fish/beodeulchi/popup.svg"
```

## 4. 현재 판정

v4.8.41 기준으로 경량 실행본의 1차 경로 오류는 보정 완료다.

현재 테스트 경로:

```txt
/app_assets/index_v4_8_40.html
```

현재 구조는 원본 `app_assets/index.html`을 건드리지 않으므로, 테스트 실패 시에도 원본 앱은 보존된다.

## 5. 남은 실제 브라우저 점검 항목

다음 항목은 실제 브라우저에서 확인해야 한다.

- ES module 로드 여부
- CSS 정상 적용 여부
- SVG 이미지 로드 여부
- 하단 메뉴 4개 렌더링 여부
- 구간 버튼 렌더링 여부
- 낮물/밤물 버튼 렌더링 여부
- 버들치 표시 여부
- 버들치 클릭 시 모달 표시 여부
- 도감 클릭 시 카드 표시 여부
- 반짝/카메라 시트 표시 여부
- 작은 휴대폰에서 수족관과 메뉴 겹침 여부
- 태블릿/PC에서 중앙 정렬 여부

## 6. 다음 단계

v4.8.42 권장 작업:

1. 실제 배포 URL에서 `/app_assets/index_v4_8_40.html` 접속
2. 콘솔 오류 확인
3. 모바일 세로 화면 캡처 확인
4. PC 화면 캡처 확인
5. 오류 발생 시 JS/CSS 단위로 분리 보정
6. 안정 확인 후 `index.html` 교체용 후보로 승격

## 7. 완료 판정

v4.8.41은 `경량 실행본 1차 오류 점검 및 이미지 경로 보정 완료` 상태로 처리한다.
