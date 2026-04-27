# 단계별 개발계획서: 물모이 낮 배경 적용

작성일: 2026-04-28

## 1. 기준 안정본 확인

- 기준 버전: v30A-1 audio stability final
- 기준 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 대상 슬롯: 물모이 낮
- 대상 경로: `assets/bg/pool/day.png`

## 2. 이번 단계 목표

- 목표 1개:
  사용자가 올린 `물모이-낮.png`를 물모이 낮 배경으로 적용한다.

## 3. 건드리지 말아야 할 기능

- 버들치 유영 엔진
- 낮/밤 전환 JS 로직
- 하단 메뉴 탐사/도감/미션/카메라
- 음성, GPS, 카메라 저장, 도감, 미션 데이터
- CSS z-index 구조
- 기존 적용 완료된 웃물/여울/잔여울/깊물 배경 및 물모이 저녁 배경

## 4. 적용 정보

- 원본 파일: `C:/Users/tanta/Downloads/물모이-낮.png`
- 원본 크기: 941 x 1672
- 원본 형식: PNG
- 원본 SHA256: `6B7B5F5AD01B8D0E778C314C1B0AF3D2033FF4B147B2A38931F016B051FB8C5C`
- 적용 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/pool/day.png`
- 백업 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/_backup/20260428_000232/pool_day.png`

## 5. 검증 결과

- [x] 기준 index.html 존재 확인
- [x] 기준 src/app.js 존재 확인
- [x] 대상 `assets/bg/pool/day.png` 존재 확인
- [x] 업로드 원본 파일 존재 확인
- [x] 기존 물모이 낮 배경 백업 완료
- [x] 새 이미지 적용 완료
- [x] 적용 후 이미지 크기 확인: 941 x 1672
- [x] 적용 후 SHA256 확인: `6B7B5F5AD01B8D0E778C314C1B0AF3D2033FF4B147B2A38931F016B051FB8C5C`
- [x] `node --check src/app.js` 통과
- [x] 10개 배경 경로 존재 확인
- [x] index.html HEAD 서버 응답 200 확인
- [x] 물모이 낮 배경 HEAD 응답 200 image/png 확인
- [x] 물모이 저녁 배경 HEAD 응답 200 image/png 확인
- [x] `mulmoi.day`가 `assets/bg/pool/day.png`를 참조하는 구조 확인
- [x] `mulmoi.night`가 `assets/bg/pool/night.png`를 참조하는 구조 확인
- [x] `applyZoneVisual()`이 `isNight ? zone.night : zone.day` 구조로 동작하는 것 확인
- [x] `modeBtn`이 낮/밤 전환 이벤트를 유지하는 것 확인

## 6. 발견 오류

- 없음

## 7. 남은 리스크

- 물모이 낮 배경은 수초와 큰 돌이 많아 기존 `.eco-layer`의 plant/stone과 겹치면 화면 가장자리와 하단이 복잡해질 수 있다.
- 실제 화면에서 복잡하면 물모이 존의 `plant` 또는 `stone` 수량을 낮추는 후속 안정화가 필요할 수 있다.

## 8. 다음 단계 제안

- 다음 단계 1개:
  물모이 저녁 배경을 올리면 `assets/bg/pool/night.png`에만 적용하고 같은 방식으로 검증한다.
