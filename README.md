# pongdang-v5-web

퐁당-4 곤지암천 수중 생태 학습 웹/앱 기준 저장소입니다.

## 최신 기준

- 기준 버전: `v4.4.5 object slots created`
- 실행 파일: `index.html`
- 앱 기준 파일: `app_assets/index.html`
- 확인 파일: `00_열어서확인.html`

## 개발 원칙

1. GitHub 저장소를 항상 최신 기준으로 둡니다.
2. 웹 기준본과 `app_assets/index.html`은 동일하게 유지합니다.
3. 새 기능 추가 시 기존 동일 기능 코드는 삭제 또는 비활성화하고, 단일 기능 단일 함수 원칙을 유지합니다.
4. 배경/오브젝트/수초/유리효과 레이어는 `pointer-events:none`을 기본으로 합니다.
5. 물고기 클릭, 메뉴, 팝업, 도감, 카메라/GPS 전환은 충돌하지 않도록 Guard 구조를 유지합니다.

## 다음 단계

- `v4.4.6`: 뒤쪽 수초 1개 제작 후 `BackObjects` 슬롯에만 적용
- 적용 전 `PondangObjectLayerPreflightV444.run()` 또는 해당 Guard audit 실행
