# 퐁당퐁당 v4.8.47 index.html 교체 전 점검 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
기존 원본: app_assets/index.html
교체 후보: app_assets/index_candidate_v4_8_46.html
검수용 실행본: app_assets/index_v4_8_40.html
검수 매트릭스: app_assets/test_matrix_v4_8_44.html

## 1. 목적

v4.8.47의 목적은 기존 단일 대형 `app_assets/index.html`을 바로 교체하기 전에, 교체 후보와 복구 기준을 명확히 남기는 것이다.

## 2. 현재 원본 상태

기존 원본 파일:

```txt
app_assets/index.html
```

파일 제목:

```txt
Pongdang4 v4.8.30 Phone Zone Label Fit Test
```

원본은 HTML, CSS, JavaScript가 한 파일에 들어 있는 대형 단일 파일이다.

도구 출력상 원본 본문이 중간에서 잘릴 정도로 크기 때문에, 전체 내용을 별도 파일로 안전하게 복사하는 방식은 사용하지 않았다.

단, GitHub 커밋 히스토리에는 기존 원본 상태가 남으므로, 교체 후 문제가 생기면 교체 직전 커밋으로 되돌릴 수 있다.

## 3. 교체 후보 상태

교체 후보 파일:

```txt
app_assets/index_candidate_v4_8_46.html
```

후보 파일은 다음 두 파일만 연결한다.

```html
<link rel="stylesheet" href="v4_8_40/css/pongdang-ui.css">
<script type="module" src="v4_8_40/js/pongdang-app.js"></script>
```

후보 파일에는 자가 점검 패널이 포함되지 않는다.

## 4. 아직 교체하지 않은 이유

기존 원본은 기능이 많은 대형 단일 파일이다.

교체 후보는 경량화된 구조지만, 기존 원본의 모든 기능이 완전히 이식되었다고 단정할 수 없다.

따라서 다음 검수 조건을 만족한 뒤에만 실제 `index.html` 교체를 진행한다.

## 5. 교체 전 필수 검수

다음 경로를 확인한다.

```txt
/app_assets/test_matrix_v4_8_44.html
```

상단 상태가 다음으로 표시되어야 한다.

```txt
전체 통과
```

그리고 후보 실행본도 직접 확인한다.

```txt
/app_assets/index_candidate_v4_8_46.html
```

## 6. 교체 전 체크리스트

- 검수 매트릭스 전체 통과
- 후보 실행본 직접 열림
- 수족관 표시 정상
- 하단 메뉴 4개 정상
- 도감 열림 정상
- 물고기 상세 모달 정상
- 이미지 로드 정상
- 모바일 세로형 배치 정상
- 태블릿 배치 정상
- PC 배치 정상

## 7. 다음 단계

v4.8.48에서 다음 중 하나를 선택한다.

1. 검수 통과 시 `index_candidate_v4_8_46.html` 내용을 `index.html`에 반영
2. 미통과 시 CSS/JS/데이터 모듈 단위로 보정

## 8. 현재 판정

v4.8.47은 `index.html 교체 전 기준 고정 완료` 상태다.

아직 기존 `app_assets/index.html`은 교체하지 않았다.
