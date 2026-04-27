# 단계별 개발계획서: 잔여울 저녁 배경 적용

작성일: 2026-04-27

## 1. 기준 안정본 확인

- 기준 버전: v30A-1 audio stability final
- 기준 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 대상 슬롯: 잔여울 저녁
- 앱 내부 슬롯: 잔여울 night
- 대상 경로: `assets/bg/soft-rapid/night.png`

## 2. 이번 단계 목표

- 목표 1개:
  직전 잔여울 낮 적용 상태를 재검증한 뒤, 사용자가 올린 `잔여울-저녁.png`를 잔여울 저녁/night 배경으로 적용한다.

## 3. 건드리지 말아야 할 기능

- 버들치 유영 엔진
- 낮/밤 전환 JS 로직
- 하단 메뉴 탐사/도감/미션/카메라
- 음성, GPS, 카메라 저장, 도감, 미션 데이터
- CSS z-index 구조
- 기존 적용 완료된 웃물/여울/잔여울 낮 배경 및 다른 4개 배경 파일

## 4. 선행 재검증

- 잔여울 낮 `assets/bg/soft-rapid/day.png`
  - 크기: 941 x 1672
  - SHA256: `6031971578FFDAA680767CC8EEFC0826186A3AEC4F8F3130DD3654BFFF7749F1`
  - HEAD 응답: `200 image/png 2395375`

## 5. 적용 정보

- 원본 파일: `C:/Users/tanta/Downloads/잔여울-저녁.png`
- 원본 크기: 941 x 1672
- 원본 형식: PNG
- 원본 SHA256: `2CD0F1145DCA431FAE0BCF756CF4F2494A29460245F02FFFCA00119A2BBBAC55`
- 적용 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/soft-rapid/night.png`
- 백업 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/_backup/20260427_233534/soft_rapid_night.png`

## 6. 검증 결과

- [x] 잔여울 낮 기존 적용 상태 재검증 완료
- [x] 기준 index.html 존재 확인
- [x] 기준 src/app.js 존재 확인
- [x] 대상 `assets/bg/soft-rapid/night.png` 존재 확인
- [x] 업로드 원본 파일 존재 확인
- [x] 기존 잔여울 저녁/night 배경 백업 완료
- [x] 새 이미지 적용 완료
- [x] 적용 후 이미지 크기 확인: 941 x 1672
- [x] 적용 후 SHA256 확인: `2CD0F1145DCA431FAE0BCF756CF4F2494A29460245F02FFFCA00119A2BBBAC55`
- [x] `node --check src/app.js` 통과
- [x] 10개 배경 경로 존재 확인
- [x] index.html HEAD 서버 응답 200 확인
- [x] 새 잔여울 저녁 배경 HEAD 응답 200 확인
- [x] 새 잔여울 저녁 배경 Content-Type `image/png` 확인
- [x] 새 잔여울 저녁 배경 Content-Length `2282974` 확인
- [x] `janyeoul.night`가 `assets/bg/soft-rapid/night.png`를 참조하는 구조 확인
- [x] `applyZoneVisual()`이 `isNight ? zone.night : zone.day` 구조로 동작하는 것 확인
- [x] `modeBtn`이 낮/밤 전환 이벤트를 유지하는 것 확인

## 7. 발견 오류

- 없음

## 8. 남은 리스크

- 잔여울 저녁 배경은 좌우 수초와 어두운 수심감이 강해 기존 `.eco-layer` 수초와 겹치면 가장자리가 답답해질 수 있다.
- 실제 화면에서 복잡하면 잔여울 night 상태의 수초 수량 또는 입자 밀도만 낮추는 후속 안정화가 필요할 수 있다.

## 9. 다음 단계 제안

- 다음 단계 1개:
  깊물 낮 배경을 올리면 `assets/bg/deep/day.png`에만 적용하고 같은 방식으로 검증한다.
