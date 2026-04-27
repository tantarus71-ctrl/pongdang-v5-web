# 단계별 개발계획서: 깊물 낮 배경 적용

작성일: 2026-04-27

## 1. 기준 안정본 확인

- 기준 버전: v30A-1 audio stability final
- 기준 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 대상 슬롯: 깊물 낮
- 대상 경로: `assets/bg/deep/day.png`

## 2. 이번 단계 목표

- 목표 1개:
  사용자가 올린 `깊물-낮.png`를 깊물 낮 배경으로 적용한다.

## 3. 건드리지 말아야 할 기능

- 버들치 유영 엔진
- 낮/밤 전환 JS 로직
- 하단 메뉴 탐사/도감/미션/카메라
- 음성, GPS, 카메라 저장, 도감, 미션 데이터
- CSS z-index 구조
- 기존 적용 완료된 웃물/여울/잔여울 배경 및 다른 3개 배경 파일

## 4. 적용 정보

- 원본 파일: `C:/Users/tanta/Downloads/깊물-낮.png`
- 원본 크기: 941 x 1672
- 원본 형식: PNG
- 원본 SHA256: `C2A5E7AC68FE2E67644837B6A71DDCD22E59FD4E1FDFC35589BA9CBD90E7DC7F`
- 적용 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/deep/day.png`
- 백업 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/_backup/20260427_234518/deep_day.png`

## 5. 검증 결과

- [x] 기준 index.html 존재 확인
- [x] 기준 src/app.js 존재 확인
- [x] 대상 `assets/bg/deep/day.png` 존재 확인
- [x] 업로드 원본 파일 존재 확인
- [x] 기존 깊물 낮 배경 백업 완료
- [x] 새 이미지 적용 완료
- [x] 적용 후 이미지 크기 확인: 941 x 1672
- [x] 적용 후 SHA256 확인: `C2A5E7AC68FE2E67644837B6A71DDCD22E59FD4E1FDFC35589BA9CBD90E7DC7F`
- [x] `node --check src/app.js` 통과
- [x] 10개 배경 경로 존재 확인
- [x] index.html HEAD 서버 응답 200 확인
- [x] 새 깊물 낮 배경 HEAD 응답 200 확인
- [x] 새 깊물 낮 배경 Content-Type `image/png` 확인
- [x] 새 깊물 낮 배경 Content-Length `2232895` 확인
- [x] `gipmul.day`가 `assets/bg/deep/day.png`를 참조하는 구조 확인
- [x] `applyZoneVisual()`이 `isNight ? zone.night : zone.day` 구조로 동작하는 것 확인
- [x] `modeBtn`이 낮/밤 전환 이벤트를 유지하는 것 확인

## 6. 발견 오류

- 없음

## 7. 남은 리스크

- 깊물 낮 배경은 중앙 수심 공간이 넓고 좌우 바위가 강해, 깊물 존의 기존 돌 레이어와 겹치면 하단/측면이 무거워 보일 수 있다.
- 실제 화면에서 답답하면 깊물 존의 `stone` 또는 `plant` 수량을 낮추는 후속 안정화가 필요할 수 있다.

## 8. 다음 단계 제안

- 다음 단계 1개:
  깊물 저녁 배경을 올리면 `assets/bg/deep/night.png`에만 적용하고 같은 방식으로 검증한다.
