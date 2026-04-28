# 2026-04-28 성능 최적화 QA

## 기준 안정본
- 기준 폴더: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final`
- 이번 단계는 배경 로딩, 이미지 용량, 프레임 저하 완충만 다룬다.
- 메뉴, 팝업, 오디오, 도감, 미션 기능 동작 구조는 변경하지 않는다.

## 적용 목표
1. 배경 이미지 용량 최적화
2. 현재 존 배경만 우선 로드
3. 나머지 배경은 idle 지연 로드
4. 모바일 프레임 저하 시 물방울 입자 수를 자동 완화
5. 배경 전환 중에도 메뉴와 팝업이 느려지지 않게 독립 유지

## 적용 내용
- 실제 사용 중인 10개 존 배경 PNG를 고품질 JPG 품질 92 파생본으로 추가했다.
- 원본 PNG는 삭제하지 않고 fallback으로 유지했다.
- `ZONES`의 배경 경로는 JPG를 우선 사용하도록 변경했다.
- `index.html` 첫 진입 preload는 `upper/day.jpg` 1장만 high priority로 지정했다.
- 앱 시작 시 현재 표시 배경 1장만 즉시 로드한다.
- 반대 시간대와 다른 존 배경은 `requestIdleCallback` 기반 큐에서 한 번에 1장씩 지연 로드한다.
- `PondangV30A1Debug.audit().background`에 loaded/loading/queued/draining/failed 상태가 나오도록 확장했다.
- `PondangV30A1Debug.audit().performance`에 fps, avgDt, slowFrames, optimized, particleScale을 추가했다.
- 180프레임 이후 slow frame 비율이 높으면 물방울 입자 수를 72%로 낮춰 프레임 저하를 완화한다.

## 용량 결과
- 기존 실제 사용 PNG 10장 합계: 23,315,673 bytes
- 최적화 JPG 10장 합계: 3,937,195 bytes
- 절감: 19,378,478 bytes
- 절감률: 약 83.1%

## 검증
- `node --check app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js` 통과
- 로컬 서버에서 실제 사용 JPG 배경 10장 HEAD 요청 200 확인
- JPG 실패 시 같은 경로의 PNG fallback 로드 로직 확인
- `dist/` 산출물은 이번 커밋 대상에서 제외한다.

## 수동 QA 방법
1. 첫 진입에서 웃물 낮 배경이 바로 보이는지 확인한다.
2. 낮/저녁 버튼을 눌러 전환 지연이 과하지 않은지 확인한다.
3. 각 존을 누를 때 배경이 비어 보이지 않는지 확인한다.
4. 메뉴와 팝업을 여러 번 열고 닫아 배경 로딩 중에도 반응이 느리지 않은지 확인한다.
5. 콘솔에서 `PondangV30A1Debug.audit().performance`를 확인한다.

## 다음 단계 제안
- 실제 모바일 기기에서 5개 존을 30초씩 관찰하며 `fps`, `slowFrames`, `particleScale` 값을 기록한다.
