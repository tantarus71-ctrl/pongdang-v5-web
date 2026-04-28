# 2026-04-28 메뉴 기능 안정화 QA 기록

## 기준 버전
- 대상: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final`
- 범위: 탐사/도감/미션/카메라 버튼, 팝업 동시 노출 방지, 닫기/뒤로가기/Escape 흐름

## 1. 메뉴 버튼 연결 확인
`index.html` 기준 아래 하단 메뉴 버튼 4개가 모두 존재함을 확인했다.

| 메뉴 | HTML 연결 | JS 진입 함수 | 판정 |
| --- | --- | --- | --- |
| 탐사 | `data-menu="explore"` | `openExplorePanel()` | 통과 |
| 도감 | `data-menu="dex"` | `openDexPanel()` | 통과 |
| 미션 | `data-menu="mission"` | `openMissionPanel()` | 통과 |
| 카메라 | `data-menu="camera"` | `openCameraPanel()` | 통과 |

## 2. 적용한 안정화
- `UI_STATE.historyArmed` 추가
- `armOverlayHistory()` / `disarmOverlayHistory()` 추가
- `setActivePanel()` / `setActivePopup()`가 열림 상태를 브라우저 history와 연결하도록 개선
- `syncOverlayHistory()` 추가
- `hasVisibleOverlay()` 추가
- `closeTopOverlay(reason)` 추가
- `installMenuStabilityGuards()` 추가
- `PondangV30A1Debug.menuAudit()` 추가

## 3. 팝업 동시 노출 방지
아래 닫기 함수들이 화면 class와 내부 상태를 함께 정리하도록 보강했다.

- `closeCameraPanels()`
- `closeCaptureDetail()`
- `closeExplorePanels()`
- `closeGpsGuide()`
- `stopAudio({hide:true})`
- `closeDexPanels()`
- `closeMissionPanel()`
- `closeAcquiredCard()`
- `closeFishPopup()`
- `closeFeaturePanel()`
- `closeCardDetailPanel()`
- `closeFloatingPanels()`

판정:
- 메뉴 전환 시 기존 패널/팝업이 남는 위험을 줄였다.
- 닫기 버튼이 class만 제거하고 `activePanel`/`activePopup`을 남기는 문제를 보강했다.

## 4. Escape / 뒤로가기 흐름
`closeTopOverlay()` 우선순위:

1. 음성 패널
2. GPS 안내
3. 캡처 상세
4. 도감 카드 상세
5. 획득 카드
6. 카메라/갤러리
7. 탐사 패널
8. 미션 패널
9. 도감 패널
10. 기능 패널
11. 물고기 팝업

적용:
- `Escape` 키는 capture 단계에서 `closeTopOverlay('escape')`를 먼저 실행한다.
- 모바일 브라우저 뒤로가기는 `popstate`에서 `closeTopOverlay('back')`를 실행한다.
- 패널이 열릴 때 history state를 한 번만 arm해서 뒤로가기가 화면 닫기로 작동할 수 있게 했다.

## 5. 검증 결과
- `node --check src/app.js`: 통과
- 로컬 서버 `index.html`: `200 text/html`
- 로컬 서버 `src/app.js`: `200 text/javascript`
- 정적 연결 확인:
  - `data-menu="explore"`: OK
  - `data-menu="dex"`: OK
  - `data-menu="mission"`: OK
  - `data-menu="camera"`: OK
  - `openExplorePanel`: OK
  - `openDexPanel`: OK
  - `openMissionPanel`: OK
  - `openCameraPanel`: OK
  - `closeTopOverlay`: OK
  - `installMenuStabilityGuards`: OK
  - `menuAudit`: OK
  - `popstate`: OK

## 6. 보류
in-app browser 자동 클릭 QA는 OS 접근 거부로 실행하지 못했다. 실제 화면에서 아래 수동 확인이 필요하다.

1. 탐사 버튼 클릭 → 탐사 패널 표시 → 닫기
2. 도감 버튼 클릭 → 도감 패널 표시 → 카드 상세 열기/닫기
3. 미션 버튼 클릭 → 미션 패널 표시 → 닫기
4. 카메라 버튼 클릭 → 카메라 패널 표시 → 갤러리 표시 → 닫기
5. 각 패널이 열린 상태에서 다른 메뉴를 눌렀을 때 이전 패널이 사라지는지 확인
6. Escape 키로 최상단 팝업부터 닫히는지 확인
7. 모바일 뒤로가기 버튼으로 최상단 팝업부터 닫히는지 확인

## 7. 런타임 확인 명령
브라우저 콘솔에서 아래를 실행하면 현재 메뉴 상태를 볼 수 있다.

```js
PondangV30A1Debug.menuAudit()
```

정상 기준:
- 아무 패널도 없을 때 `visibleCount: 0`
- 메뉴 패널 하나만 열렸을 때 `visibleCount: 1`
- 상세 팝업이 열린 경우 패널 + 상세 팝업이 함께 잡힐 수 있으나, 동시에 두 개의 독립 메뉴 패널이 보이면 안 된다.
