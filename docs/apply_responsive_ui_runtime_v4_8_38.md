# 퐁당퐁당 v4.8.38 런타임 UI 적용 패치 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
대상 앱 파일: app_assets/index.html
추가 파일:

- app_assets/patches/v4_8_37_responsive_aquarium_ui.css
- app_assets/patches/v4_8_38_apply_responsive_ui.js

## 1. 목적

v4.8.38의 목적은 index.html 원본 전체를 덮어쓰지 않고도, 수족관 사이즈 최적화와 아이들 눈높이 하단 메뉴 UI를 실제 화면에 적용할 수 있게 하는 것이다.

이번 방식은 안전 우선 방식이다.

- 기존 index.html 구조 보존
- 기존 이벤트 ID 유지
- 기존 openGuide/openBook/openRare/openCamera 동작 유지
- CSS는 외부 파일로 보강
- 메뉴 HTML은 런타임에서 span 구조로 변환
- 수족관/메뉴 높이는 화면 크기 변경 시 재계산

## 2. 신규 추가 파일

```txt
app_assets/patches/v4_8_38_apply_responsive_ui.js
```

역할:

1. v4.8.37 반응형 CSS 자동 로드
2. 하단 메뉴를 이모지 3줄 구조로 변환
3. 구간명 우리말 기준 정리
4. 핸드폰/태블릿/PC viewport 상태 기록
5. 수족관·상단·하단 UI 높이 재측정
6. modal/sheet 상태에서 버튼·물고기 클릭 충돌 방지
7. resize/orientationchange 대응

## 3. index.html 실제 적용 방법

app_assets/index.html의 `</body>` 바로 위에 다음 한 줄을 삽입한다.

```html
<script src="patches/v4_8_38_apply_responsive_ui.js" defer></script>
```

주의:

- 기존 script를 삭제하지 않는다.
- 기존 button id를 변경하지 않는다.
- 기존 bottomNav 구조를 먼저 삭제하지 않는다.
- 이 스크립트는 기존 구조 위에서 보강 적용된다.

## 4. 하단 메뉴 적용 결과

런타임 적용 후 버튼은 다음 구조로 바뀐다.

```html
<span class="navEmoji">🫧</span>
<span class="navText">탐험</span>
<span class="navSub">물속보기</span>
```

메뉴 기준:

| ID | 이모지 | 라벨 | 보조문구 |
|---|---|---|---|
| openGuide | 🫧 | 탐험 | 물속보기 |
| openBook | 🐟 | 도감 | 친구보기 |
| openRare | ✨ | 반짝 | 희귀찾기 |
| openCamera | 📷 | 카메라 | 비춰보기 |

## 5. 수족관 배치 기준

### 작은 휴대폰

- 보조문구 일부 숨김
- 메뉴 4개 한 줄 유지
- 제목 영역 최소화
- 수족관 최소 높이 확보

### 일반 휴대폰

- 수족관 중심
- 하단 메뉴 90px 전후
- 구간/낮밤 칩형 스크롤

### 태블릿

- 넓은 시네마 수족관
- 중앙 정렬
- 메뉴 과대화 방지

### PC

- 수족관 최대폭 1180px
- 메뉴/상단/컨트롤 최대폭 980px
- 전시형 중앙 배치

## 6. 충돌 방지 기준

이 패치는 다음을 변경하지 않는다.

- FISHES 배열
- ZONES 객체
- openBookSafely 함수
- openRareSafely 함수
- openFishSafely 함수
- bindCoreInteractions 함수
- 카메라 기본 이벤트 함수
- 기존 앱 상태 객체

이 패치는 다음만 보강한다.

- CSS 로드
- 하단 메뉴 내부 마크업
- 레이아웃 변수 재측정
- pointer-events 안전 보정

## 7. 다음 단계

v4.8.39 권장 작업:

1. index.html 원본 전체 확보
2. `</body>` 직전 script 한 줄 삽입
3. 실제 브라우저에서 핸드폰/태블릿/PC 확인
4. 메뉴 겹침 여부 확인
5. 수족관 표시 면적 확인
6. 시트/모달 열림 시 메뉴 클릭 차단 확인
7. 최종 안정본 태그 문서 작성

## 8. 완료 판정

v4.8.38은 `런타임 UI 적용 패치 파일 준비 완료` 상태다.

실제 화면 반영은 index.html에 script 한 줄이 삽입된 뒤 완료 판정한다.
