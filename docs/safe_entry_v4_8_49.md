# 퐁당퐁당 v4.8.49 안전 진입점 적용 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
기존 원본: app_assets/index.html
교체 후보: app_assets/index_candidate_v4_8_46.html
신규 진입점: app_assets/start_v4_8_49.html

## 1. 목적

v4.8.49의 목적은 기존 `app_assets/index.html`을 직접 교체하지 않고, 검수된 후보 실행본으로 안전하게 진입할 수 있는 별도 시작 파일을 제공하는 것이다.

기존 원본은 그대로 보존한다.

## 2. 추가 파일

```txt
app_assets/start_v4_8_49.html
```

이 파일은 다음 후보 실행본으로 이동한다.

```txt
app_assets/index_candidate_v4_8_46.html
```

## 3. 적용 방식

`start_v4_8_49.html`에는 두 가지 이동 방식을 넣었다.

### 3-1. meta refresh

```html
<meta http-equiv="refresh" content="0; url=index_candidate_v4_8_46.html">
```

### 3-2. JavaScript replace

```js
window.location.replace('index_candidate_v4_8_46.html');
```

meta refresh가 느리거나 막히는 환경에서도 JavaScript로 후보 실행본이 열린다.

## 4. 확인 경로

안전 진입점:

```txt
/app_assets/start_v4_8_49.html
```

후보 실행본 직접 경로:

```txt
/app_assets/index_candidate_v4_8_46.html
```

기존 원본:

```txt
/app_assets/index.html
```

검수 매트릭스:

```txt
/app_assets/test_matrix_v4_8_44.html
```

## 5. 장점

- 기존 원본 index.html을 건드리지 않는다.
- 교체 실패 위험이 없다.
- 외부 시연용 링크로 바로 사용할 수 있다.
- 문제가 생기면 start_v4_8_49.html만 사용하지 않으면 된다.
- 원본은 계속 보존된다.

## 6. 현재 판정

v4.8.49는 `원본 보존형 안전 진입점 생성 완료` 상태다.

## 7. 다음 단계

v4.8.50 권장 작업:

1. `/app_assets/start_v4_8_49.html` 실제 접속 확인
2. 후보 실행본으로 자동 이동되는지 확인
3. 모바일에서 전체 화면 표시 확인
4. PC에서 후보 실행본 표시 확인
5. 외부 시연용 URL로 사용할지 결정
6. 필요 시 QR 코드용 경로로 확정

## 8. 완료 판정

v4.8.49는 `원본 미교체 안전 배포 진입점 준비 완료`로 처리한다.
