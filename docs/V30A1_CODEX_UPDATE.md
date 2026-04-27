# V30A-1 Codex update

음성 안정화 기준을 반영했습니다.

- audioPath null
- TTS fallback
- 중복 재생 방지

## 2026-04-27 Codex 안정화 1차

기준 실행본: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html`

완료한 안정화:

- `v4837_discovery_card_ux_quality.html`을 v30A-1 실행본으로 연결하는 no-cache 런처로 정리했다.
- `index.html`에 `Cache-Control`, `Pragma`, `Expires` 메타와 `PONGDANG_DEV_CACHE`, `PONGDANG_FRESH_URL`을 추가해 CSS/JS/대표 배경 이미지가 매 실행마다 새 쿼리로 로드되게 했다.
- `src/app.js`의 배경, 물고기 몸통/꼬리, 도감 이미지, 획득 카드 이미지 로딩에도 `freshUrl()`을 적용했다.
- 화면 표시 기준의 주요 한글 UI 문자열과 v30A-1 디버그 칩을 정리했다.
- `window.PondangV30A1Debug` 런타임 진단 객체를 추가했다.
  - `PondangV30A1Debug.audit()`로 현재 존, 물고기 수, 클릭 가능 물고기, activeFront, 겹침 후보, safe area 이탈, UI 패널, 음성 상태, 미션/도감 진행을 확인한다.
  - `PondangV30A1Debug.clearRuntimeCache()`로 브라우저 Cache Storage를 비우고 v30A-1 URL을 새 cache 값으로 다시 연다.
  - `PondangV30A1Debug.reloadFresh()`로 저장 데이터는 유지하면서 즉시 새 URL로 재실행한다.
- `node --check` 기준으로 `src/app.js` 문법 검증을 통과했다.
- 로컬 서버 `http://127.0.0.1:4830/app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html` 응답 200을 확인했다.
- 도감 카드 이미지가 존재하지 않는 `ASSETS.sideRight`를 참조하던 오류를 `ASSETS.bodyRight`로 수정했다.
- 향후 구조화 전용 프롬프트와 플로우차트 문서를 `docs/V30A1_STRUCTURE_OPTIMIZATION_PROMPT.md`에 추가했다.

현재 구조 진단:

- v30A-1은 `index.html`, `src/app.js`, `src/styles/main.css`, `assets/` 중심의 정적 앱이다.
- 대부분의 도감, 미션, GPS, 음성, 촬영, 존 전환, 물고기 유영 로직이 `src/app.js` 한 파일에 집중되어 있다.
- 버들치 유영은 이미 5방향 몸통 이미지와 꼬리 프레임을 활용하고, `requestAnimationFrame` 단일 루프에서 depth, clickable, activeFront, collision, render를 갱신한다.
- 다음 단계에서 유지보수성을 올리려면 데이터/엔진/UI/오디오를 파일 단위로 분리하는 것이 좋다.

다음 구조화 계획:

1. `src/data/zones.js`, `src/data/species.js`, `src/data/missions.js`로 정적 데이터를 분리한다.
2. `src/engine/fishMotion.js`에 target, turn, depth, collision, clickable 로직을 모은다.
3. `src/ui/panels.js`, `src/ui/dex.js`, `src/ui/camera.js`, `src/ui/explore.js`로 패널별 이벤트와 렌더링을 분리한다.
4. `src/audio/audioGuide.js`로 TTS, 중복 재생 방지, hidden 상태 정지를 독립시킨다.
5. `src/debug/runtimeAudit.js`를 만들어 현재 `PondangV30A1Debug.audit()`를 상시 품질 점검 도구로 유지한다.
6. 구조 분리 후에도 v30A-1 실행 URL은 `?cache=Date.now()` 방식으로 즉시 반영되게 유지한다.

품질 기준:

- 클릭 가능한 물고기는 항상 1마리 이하.
- activeFront 물고기는 1마리 이하.
- 물고기는 하단 메뉴와 팝업 safe area를 침범하지 않음.
- 뒤쪽 물고기는 작고 흐리며, 앞쪽 물고기는 크고 선명함.
- 방향 전환은 즉시 반전이 아니라 턴 프레임과 감속/재가속을 거침.
- 매 작업 후 `node --check app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js`와 로컬 서버 200 응답을 확인한다.
