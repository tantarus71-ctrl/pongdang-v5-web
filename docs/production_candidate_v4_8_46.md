# 퐁당퐁당 v4.8.46 원본 교체 후보 실행본 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
신규 후보 파일: app_assets/index_candidate_v4_8_46.html
검수 기준 파일: app_assets/index_v4_8_40.html
기존 원본: app_assets/index.html

## 1. 목적

v4.8.46의 목적은 검수용 자가 점검 패널이 붙은 실행본과 실제 교체 후보 실행본을 분리하는 것이다.

검수용 파일은 계속 유지한다.

```txt
app_assets/index_v4_8_40.html
```

실제 원본 교체 후보는 별도 파일로 생성했다.

```txt
app_assets/index_candidate_v4_8_46.html
```

## 2. 후보 실행본 특징

`index_candidate_v4_8_46.html`은 다음 파일만 연결한다.

```html
<link rel="stylesheet" href="v4_8_40/css/pongdang-ui.css">
<script type="module" src="v4_8_40/js/pongdang-app.js"></script>
```

자가 점검 스크립트는 연결하지 않았다.

제외한 파일:

```txt
v4_8_40/js/pongdang-self-check.js
```

## 3. 구조

후보 실행본은 기존 경량 구조를 그대로 사용한다.

- 상단 안내 카드
- 구간 선택 바
- 낮물/밤물 선택 바
- 수족관 영역
- 하단 메뉴 4개
- 도감 시트
- 반짝 시트
- 카메라 안내 시트
- 물고기 상세 모달

## 4. 확인 경로

검수용 실행본:

```txt
/app_assets/index_v4_8_40.html
```

프로덕션 후보:

```txt
/app_assets/index_candidate_v4_8_46.html
```

기존 원본:

```txt
/app_assets/index.html
```

## 5. 원본 교체 전 조건

다음 순서를 지킨다.

1. 검수용 실행본이 v4.8.45 매트릭스에서 전체 통과
2. 프로덕션 후보를 직접 열어 동일 화면 확인
3. 원본 index.html 백업 생성
4. 후보 파일을 index.html로 교체
5. 교체 후 배포 URL에서 재검수

## 6. 현재 판정

v4.8.46은 `원본 교체 후보 파일 생성 완료` 상태다.

아직 기존 `app_assets/index.html`은 교체하지 않는다.

## 7. 다음 단계

v4.8.47 권장 작업:

1. 기존 `app_assets/index.html` 백업 파일 생성
2. `index_candidate_v4_8_46.html`을 원본 교체 대상으로 확정
3. 실제 교체 전 최종 비교 문서 작성
4. 교체 실행 또는 보류 결정

## 8. 완료 판정

v4.8.46은 `프로덕션 후보 실행본 분리 완료`로 처리한다.
