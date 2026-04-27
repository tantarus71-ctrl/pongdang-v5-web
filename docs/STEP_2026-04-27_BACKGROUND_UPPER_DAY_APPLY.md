# 단계별 개발계획서: 웃물 낮 배경 적용

작성일: 2026-04-27

## 1. 기준 안정본 확인

- 기준 버전: v30A-1 audio stability final
- 기준 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 대상 슬롯: 웃물 낮
- 대상 경로: `assets/bg/upper/day.png`

## 2. 이번 단계 목표

- 목표 1개:
  사용자가 올린 `웃물-낮.png`를 웃물 낮 배경으로 적용한다.

## 3. 건드리지 말아야 할 기능

- 버들치 유영 엔진
- 낮/밤 전환 JS 로직
- 하단 메뉴 탐사/도감/미션/카메라
- 음성, GPS, 카메라 저장, 도감, 미션 데이터
- CSS z-index 구조
- 다른 9개 배경 파일

## 4. 적용 정보

- 원본 파일: `C:/Users/tanta/Downloads/웃물-낮.png`
- 원본 크기: 941 x 1672
- 원본 형식: PNG
- 원본 SHA256: `7C5264252A235049BE0B95D03CA97DFDD738CEC30543314E7D220957143A468A`
- 적용 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/upper/day.png`
- 백업 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/assets/bg/_backup/20260427_230938/upper_day.png`

## 5. 검증 결과

- [x] 기준 index.html 존재 확인
- [x] 기준 src/app.js 존재 확인
- [x] 대상 `assets/bg/upper/day.png` 존재 확인
- [x] 업로드 원본 파일 존재 확인
- [x] 기존 웃물 낮 배경 백업 완료
- [x] 새 이미지 적용 완료
- [x] 적용 후 이미지 크기 확인: 941 x 1672
- [x] 적용 후 SHA256 확인: `7C5264252A235049BE0B95D03CA97DFDD738CEC30543314E7D220957143A468A`
- [x] `node --check src/app.js` 통과
- [x] 10개 배경 경로 존재 확인
- [x] index.html 서버 응답 200 확인
- [x] 새 웃물 낮 배경 HEAD 응답 200 확인
- [x] 새 웃물 낮 배경 Content-Type `image/png` 확인
- [x] 새 웃물 낮 배경 Content-Length `2327980` 확인
- [x] `utmul.day`가 `assets/bg/upper/day.png`를 참조하는 구조 확인
- [x] `applyZoneVisual()` 낮/밤 배경 적용 구조 확인
- [x] `modeBtn` 낮/밤 전환 이벤트 구조 확인

## 6. 발견 오류

- 큰 PNG 본문 응답 확인 중 한 번 타임아웃이 발생했다.

## 7. 해결

- 이미지 파일 자체 로드와 해시는 정상 확인했다.
- 서버 본문 다운로드 대신 HEAD 요청으로 재확인했고 `200 image/png 2327980` 응답을 확인했다.

## 8. 남은 리스크

- 현재 이미지는 밝은 광선과 수면 표현이 강한 편이라 기존 `.godrays`, `.caustics` 레이어와 시각적으로 중복될 수 있다.
- 실제 화면에서 광선이 과하면 다음 단계에서 웃물 존에 한해 광선/물결 레이어 강도를 조정해야 한다.
- 브라우저 화면은 새 cache 값으로 새로고침해야 새 배경이 확실히 보인다.

## 9. 다음 단계 제안

- 다음 단계 1개:
  웃물 저녁 배경을 올리면 `assets/bg/upper/night.png`에만 적용하고 같은 방식으로 검증한다.
