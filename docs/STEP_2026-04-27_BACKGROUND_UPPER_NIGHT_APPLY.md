# 단계별 개발계획서: 웃물 저녁 배경 적용

작성일: 2026-04-27

## 1. 기준 안정본 확인

- 기준 버전: v30A-1 audio stability final
- 기준 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 대상 슬롯: 웃물 저녁
- 앱 내부 슬롯: 웃물 night
- 대상 경로: `assets/bg/upper/night.png`

## 2. 이번 단계 목표

- 목표 1개:
  사용자가 올린 `웃물-저녁.png`를 웃물 저녁/night 배경으로 적용한다.

## 3. 건드리지 말아야 할 기능

- 버들치 유영 엔진
- 낮/밤 전환 JS 로직
- 하단 메뉴 탐사/도감/미션/카메라
- 음성, GPS, 카메라 저장, 도감, 미션 데이터
- CSS z-index 구조
- 웃물 낮 배경 및 다른 8개 배경 파일

## 4. 적용 정보

- 원본 파일: `C:/Users/tanta/Downloads/웃물-저녁.png`
- 원본 크기: 941 x 1672
- 원본 형식: PNG
- 원본 SHA256: `829A23F9988A7ABEAE82894A292E6258A41259D2549B45659540AE3EDF31C817`
- 적용 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/upper/night.png`
- 백업 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/_backup/20260427_231409/upper_night.png`

## 5. 검증 결과

- [x] 기준 index.html 존재 확인
- [x] 기준 src/app.js 존재 확인
- [x] 대상 `assets/bg/upper/night.png` 존재 확인
- [x] 업로드 원본 파일 존재 확인
- [x] 기존 웃물 저녁/night 배경 백업 완료
- [x] 새 이미지 적용 완료
- [x] 적용 후 이미지 크기 확인: 941 x 1672
- [x] 적용 후 SHA256 확인: `829A23F9988A7ABEAE82894A292E6258A41259D2549B45659540AE3EDF31C817`
- [x] `node --check src/app.js` 통과
- [x] 10개 배경 경로 존재 확인
- [x] index.html HEAD 서버 응답 200 확인
- [x] 새 웃물 저녁 배경 HEAD 응답 200 확인
- [x] 새 웃물 저녁 배경 Content-Type `image/png` 확인
- [x] 새 웃물 저녁 배경 Content-Length `2177459` 확인
- [x] `utmul.night`가 `assets/bg/upper/night.png`를 참조하는 구조 확인
- [x] `applyZoneVisual()`이 `isNight ? zone.night : zone.day` 구조로 동작하는 것 확인
- [x] `modeBtn`이 낮/밤 전환 이벤트를 유지하는 것 확인

## 6. 발견 오류

- 일부 PowerShell 조회 명령이 출력 대기 중 타임아웃됐다.

## 7. 해결

- 핵심 검증을 더 작은 명령으로 분리했다.
- 파일 해시, 이미지 로드, 10개 배경 경로, 새 배경 HEAD 응답, index HEAD 응답을 각각 재확인했다.

## 8. 남은 리스크

- 새 저녁 배경은 달과 수면 광선이 포함되어 있어 기존 `.godrays` 레이어와 합쳐지면 빛이 강하게 보일 수 있다.
- 실제 화면에서 너무 밝거나 어색하면 웃물 night 상태의 광선/물결 강도만 별도로 낮추는 후속 안정화가 필요하다.

## 9. 다음 단계 제안

- 다음 단계 1개:
  여울 낮 배경을 올리면 `assets/bg/rapid/day.png`에만 적용하고 같은 방식으로 검증한다.
