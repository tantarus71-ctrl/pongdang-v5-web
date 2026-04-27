# 단계별 개발계획서: 배경 로딩 구조 최적화 적용

작성일: 2026-04-28

## 1. 기준 안정본 확인

- 기준 버전: v30A-1 audio stability final
- 기준 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 기준 배경: 5개 존 낮/저녁 10개 배경 적용 완료
- 기준 기능: `modeBtn` 낮/밤 전환, `applyZoneVisual()` 배경 적용, zone 버튼 전환

## 2. 이번 단계 목표

- 목표 1개:
  배경 이미지 품질을 유지하면서 초기 로딩 부하를 줄이도록 배경 로딩 구조를 최적화한다.

## 3. 건드리지 말아야 할 기능

- 배경 이미지 원본 파일
- 버들치 유영 엔진
- 도감, 미션, 카메라, 탐사, GPS, 음성 기능
- CSS z-index 구조
- 낮/밤 전환 로직의 의미
- 5개 존 day/night 경로

## 4. 기존 구조 분석

기존 `preload()`는 다음을 한 번에 로드했다.

- 버들치 몸통/꼬리 자산
- 5개 존의 day/night 배경 10장 전체

현재 배경 10장 총량은 약 23.3MB다.
모바일 첫 화면에서는 웃물 낮/저녁 2장만 우선 필요하므로, 10장을 모두 초기에 로드하는 방식은 초기 네트워크/메모리 부담이 크다.

## 5. 패치 설계

수정 파일:

- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js`
- `docs/STEP_2026-04-28_BACKGROUND_LOADER_OPTIMIZATION_APPLY.md`
- `docs/MASTER_개발기획서_상시참조.txt`

추가한 구조:

- `BACKGROUND_LOAD_STATE`
- `loadBackground(src)`
- `preloadZoneBackgrounds(zoneId)`
- `getBackgroundLoadAudit()`

변경한 흐름:

- 초기 `preload()`는 모든 배경을 로드하지 않고 현재 존 day/night만 로드한다.
- zone 버튼에 `pointerenter`, `focus`를 연결해 해당 존 day/night를 미리 준비한다.
- `loadZone(id)` 진입 시 해당 존 day/night를 다시 한번 안전하게 준비한다.
- `applyZoneVisual()`은 현재 필요한 day 또는 night 배경만 로드 요청한 뒤 `--bg-img`를 적용한다.
- `PondangV30A1Debug.audit()`에 `background` 로딩 상태를 포함한다.

## 6. 검증 결과

- [x] `node --check src/app.js` 통과
- [x] 10개 배경 경로 존재 확인
- [x] 10개 배경 HTTP HEAD 응답 200 image/png 확인
- [x] index.html HEAD 응답 200 확인
- [x] `BACKGROUND_LOAD_STATE` 추가 확인
- [x] `loadBackground()` 추가 확인
- [x] `preloadZoneBackgrounds()` 추가 확인
- [x] `getBackgroundLoadAudit()` 추가 확인
- [x] 초기 `preload()`가 현재 존 day/night만 로드하도록 변경 확인
- [x] zone 버튼 `pointerenter`/`focus`에서 해당 존 배경을 준비하도록 변경 확인
- [x] `loadZone(id)` 진입 시 해당 존 배경을 준비하도록 변경 확인
- [x] `applyZoneVisual()`이 현재 필요한 배경만 로드 요청하도록 변경 확인
- [x] `PondangV30A1Debug.audit().background` 진단 정보 추가 확인

## 7. 발견 오류

- 없음

## 8. 기대 효과

- 초기 배경 로딩 대상이 10장 전체에서 현재 존 2장으로 줄어든다.
- 이미지 품질은 그대로 유지한다.
- 존 전환 전/진입 시 필요한 배경만 준비한다.
- 낮/밤 버튼 클릭 시 필요한 배경이 누락되어도 `applyZoneVisual()`에서 다시 로드 요청한다.
- 디버그 audit로 로딩/실패 상태를 확인할 수 있다.

## 9. 남은 리스크

- 사용자가 zone 버튼을 매우 빠르게 누르면 해당 배경이 로드되는 순간에 짧은 전환 지연이 있을 수 있다.
- 이 경우 다음 단계에서 배경 decode 완료 후 페이드 교체하는 방식으로 보강할 수 있다.
- WebP/AVIF 최적화 사본은 아직 적용하지 않았다. 품질 비교 후 별도 단계에서 진행해야 한다.

## 10. 다음 단계 제안

- 다음 단계 1개:
  배경 전환 페이드와 decode 완료 후 교체를 적용해, 느린 기기에서도 배경 전환이 더 부드럽게 보이게 한다.
