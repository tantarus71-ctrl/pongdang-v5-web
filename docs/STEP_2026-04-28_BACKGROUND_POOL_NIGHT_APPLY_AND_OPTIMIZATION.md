# 단계별 개발계획서: 물모이 저녁 배경 적용 및 배경 경량화 전략

작성일: 2026-04-28

## 1. 기준 안정본 확인

- 기준 버전: v30A-1 audio stability final
- 기준 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 대상 슬롯: 물모이 저녁
- 앱 내부 슬롯: 물모이 night
- 대상 경로: `assets/bg/pool/night.png`

## 2. 이번 단계 목표

- 목표 1개:
  사용자가 올린 `물모이-저녁.png`를 물모이 저녁/night 배경으로 적용하고, 10개 배경 독립 적용 상태를 확인한 뒤 퀄리티를 유지하는 경량화 전략을 정리한다.

## 3. 건드리지 말아야 할 기능

- 버들치 유영 엔진
- 낮/밤 전환 JS 로직
- 하단 메뉴 탐사/도감/미션/카메라
- 음성, GPS, 카메라 저장, 도감, 미션 데이터
- CSS z-index 구조
- 기존 적용 완료된 9개 배경 파일

## 4. 적용 정보

- 원본 파일: `C:/Users/tanta/Downloads/물모이-저녁.png`
- 원본 크기: 941 x 1672
- 원본 형식: PNG
- 원본 SHA256: `C4108A9B54FF1D5F995BB7A7A037F01E0C3A567486EB67BD4855538197CDB385`
- 적용 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/pool/night.png`
- 백업 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/_backup/20260428_001144/pool_night.png`

## 5. 검증 결과

- [x] 물모이 낮 상태 재검증 완료
- [x] 기준 index.html 존재 확인
- [x] 기준 src/app.js 존재 확인
- [x] 대상 `assets/bg/pool/night.png` 존재 확인
- [x] 업로드 원본 파일 존재 확인
- [x] 기존 물모이 저녁/night 배경 백업 완료
- [x] 새 이미지 적용 완료
- [x] 적용 후 이미지 크기 확인: 941 x 1672
- [x] 적용 후 SHA256 확인: `C4108A9B54FF1D5F995BB7A7A037F01E0C3A567486EB67BD4855538197CDB385`
- [x] `node --check src/app.js` 통과
- [x] 10개 배경 경로 존재 확인
- [x] 10개 배경 HTTP HEAD 응답 200 image/png 확인
- [x] index.html HEAD 서버 응답 200 확인
- [x] `mulmoi.day`가 `assets/bg/pool/day.png`를 참조하는 구조 확인
- [x] `mulmoi.night`가 `assets/bg/pool/night.png`를 참조하는 구조 확인
- [x] 5개 존의 day/night 경로가 모두 독립 경로인 것 확인
- [x] `applyZoneVisual()`이 `isNight ? zone.night : zone.day` 구조로 동작하는 것 확인
- [x] `modeBtn`이 낮/밤 전환 이벤트를 유지하는 것 확인

## 6. 현재 10개 배경 파일 상태

```text
upper/day.png          2,327,980 bytes
upper/night.png        2,177,459 bytes
rapid/day.png          2,803,645 bytes
rapid/night.png        2,536,474 bytes
soft-rapid/day.png     2,395,375 bytes
soft-rapid/night.png   2,282,974 bytes
deep/day.png           2,232,895 bytes
deep/night.png         1,899,315 bytes
pool/day.png           2,551,287 bytes
pool/night.png         2,108,269 bytes
```

현재 총 배경 용량은 약 23.3MB다.
현재 `preload()`는 모든 zone day/night 배경을 한 번에 프리로드한다.
모바일 첫 화면 기준으로는 현재 존의 낮/밤 2장과 공통 물고기 자산만 먼저 로드하고, 다른 존 배경은 존 진입 직전에 로드하는 방식이 더 안정적이다.

## 7. 퀄리티 유지 경량화 전략

### 1단계: 로딩 구조 최적화

- 초기 로딩:
  - 현재 존 day 배경 1장
  - 현재 존 night 배경 1장
  - 버들치 몸통/꼬리 핵심 프레임
- 지연 로딩:
  - 나머지 존 배경은 zone 버튼 터치 직전 또는 첫 진입 시 로드
  - 도감 상세 이미지는 도감 패널이 열릴 때 로드
- 이 방식은 이미지 품질을 떨어뜨리지 않고 초기 메모리와 네트워크 부하를 줄인다.

### 2단계: 배경 매니페스트 분리

권장 파일:

```text
src/loaders/backgroundManifest.js
src/loaders/backgroundLoader.js
```

역할:

- `backgroundManifest.js`: 존별 day/night 원본 경로와 최적화 후보 경로 관리
- `backgroundLoader.js`: 현재 존 우선 로드, 다음 존 미리 로드, 캐시 버전 처리

### 3단계: 무손실/고품질 압축본 생성

원본 PNG는 보존하고, 앱에는 최적화 사본을 사용한다.

권장 구조:

```text
assets/bg-original/
assets/bg/
assets/bg-optimized/
  upper/day.webp
  upper/night.webp
  rapid/day.webp
  rapid/night.webp
  soft-rapid/day.webp
  soft-rapid/night.webp
  deep/day.webp
  deep/night.webp
  pool/day.webp
  pool/night.webp
```

품질 기준:

- WebP quality 88~94
- AVIF quality 55~70 후보 테스트
- 원본 PNG와 비교해 색감, 바닥 자갈, 수초 디테일, 물빛 계조가 무너지면 사용하지 않는다.
- 모바일 세로 화면에서 실제 표시 크기 기준으로 비교한다.

### 4단계: responsive 이미지 후보

모바일 우선 앱이므로 화면 폭별 후보를 둔다.

```text
assets/bg-optimized/upper/day-720.webp
assets/bg-optimized/upper/day-1080.webp
assets/bg-optimized/upper/day-1440.webp
```

권장:

- 720w: 저사양 모바일
- 1080w: 기본 모바일
- 1440w: 태블릿/고해상도

CSS `image-set()` 또는 JS에서 `window.devicePixelRatio`, `innerWidth` 기준으로 선택한다.

### 5단계: 디코딩 부하 완화

- `new Image()` 프리로드 후 가능하면 `img.decode()` 사용
- 존 전환 중에는 배경을 먼저 decode하고, 완료 후 `--bg-img` 교체
- 교체 실패 시 기존 배경 유지
- `requestIdleCallback`이 있으면 다음 존 배경을 idle 시간에 미리 로드

### 6단계: 레이어와 중복 최적화

새 배경은 이미 광선/물결/수초가 강한 편이다.
따라서 이미지 압축보다 먼저 레이어 중복을 줄이는 것이 체감 품질에 좋다.

권장:

- 배경에 광선이 강한 존은 `zone.light`를 낮춘다.
- 바닥 반사가 강한 존은 `zone.caustic`을 낮춘다.
- 수초가 많은 배경은 `zone.plant`를 낮춘다.
- 돌이 많은 배경은 `zone.stone`을 낮춘다.
- 이 조정은 이미지 품질을 깎지 않고 시각 복잡도와 렌더링 DOM 수를 줄인다.

## 8. 최적화 적용 프롬프트

```text
너는 “퐁당퐁당 곤지암천 v30A-1”의 배경 성능 최적화 담당 개발자다.

목표는 10개 배경의 시각 품질을 떨어뜨리지 않으면서 초기 로딩과 메모리 부담을 줄이는 것이다.
이미지 원본은 절대 삭제하지 않는다.
먼저 로딩 구조를 바꾸고, 그 다음 최적화 사본을 실험한다.

작업 순서:
1. 현재 10개 배경 파일과 용량을 기록한다.
2. 원본 백업 폴더를 만든다.
3. backgroundManifest.js를 만들어 존별 day/night 경로를 한 곳에서 관리한다.
4. backgroundLoader.js를 만들어 현재 존 day/night만 우선 로드한다.
5. 나머지 존 배경은 zone 버튼 hover/touch 또는 첫 진입 전에 lazy load한다.
6. WebP/AVIF 최적화 사본은 별도 폴더에 만든다.
7. 원본 PNG와 최적화 사본을 모바일 세로 화면에서 비교한다.
8. 품질 저하가 없을 때만 manifest에서 최적화 사본을 사용한다.
9. modeBtn 낮/밤 전환, 5개 존 전환, 패널/팝업, 물고기 유영을 모두 검증한다.
10. MASTER 개발기획서에 용량 변화, 품질 판단, 회귀 가능 경로를 기록한다.

금지:
- 원본 PNG 삭제 금지
- 한 번에 PNG를 모두 WebP로 교체 금지
- 낮/밤 전환 로직 변경 금지
- 배경 경로를 코드 여러 곳에 흩뿌리기 금지
- 품질 비교 없이 압축본 사용 금지
```

## 9. 다음 단계 제안

- 다음 단계 1개:
  `backgroundManifest.js`와 `backgroundLoader.js`를 추가해, 초기 로딩에서 현재 존 day/night만 우선 로드하도록 구조를 분리한다.
