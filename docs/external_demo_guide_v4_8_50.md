# 퐁당퐁당 v4.8.50 외부 시연 안내 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
시연 안내 페이지: app_assets/demo_v4_8_50.html
안전 진입점: app_assets/start_v4_8_49.html
후보 실행본: app_assets/index_candidate_v4_8_46.html
검수 매트릭스: app_assets/test_matrix_v4_8_44.html

## 1. 목적

v4.8.50의 목적은 외부 시연자가 쉽게 접속할 수 있는 안내 페이지와 QR 생성 기준 경로를 고정하는 것이다.

## 2. 시연 안내 페이지

```txt
/app_assets/demo_v4_8_50.html
```

이 페이지에는 다음 버튼이 있다.

- 시연 바로 열기
- 후보 실행본 직접 열기
- 검수 매트릭스 확인

## 3. QR 생성 기준 경로

QR 코드는 아래 경로로 만든다.

```txt
/app_assets/start_v4_8_49.html
```

배포 주소 뒤에 위 경로를 붙이면 된다.

예시 형식:

```txt
https://배포주소/app_assets/start_v4_8_49.html
```

## 4. 직접 실행 경로

자가 점검 패널이 없는 후보 실행본은 다음 경로다.

```txt
/app_assets/index_candidate_v4_8_46.html
```

## 5. 검수 경로

핸드폰, 태블릿, PC 화면 비교는 다음 경로에서 한다.

```txt
/app_assets/test_matrix_v4_8_44.html
```

## 6. 외부 시연 순서

1. 배포 주소 확인
2. `/app_assets/start_v4_8_49.html` 경로 붙이기
3. 해당 주소로 QR 코드 생성
4. 현장 시연 전 `/app_assets/test_matrix_v4_8_44.html`에서 화면 확인
5. 외부에는 QR 또는 안전 진입점 주소를 공유

## 7. 현재 판정

v4.8.50은 `외부 시연 안내 페이지 및 QR 기준 경로 준비 완료` 상태다.

기존 `app_assets/index.html`은 여전히 보존한다.

## 8. 다음 단계

v4.8.51 권장 작업:

1. 배포 플랫폼의 실제 도메인 확인
2. 완성된 전체 URL 작성
3. QR 코드 생성
4. 1분 시연 멘트 작성
5. 현장용 체크리스트 작성

## 9. 완료 판정

v4.8.50은 `외부 시연용 링크 체계 정리 완료`로 처리한다.
