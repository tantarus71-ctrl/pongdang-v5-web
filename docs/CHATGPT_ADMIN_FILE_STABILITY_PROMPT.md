# ChatGPT 관리자 파일 안정화 점검 프롬프트

아래 프롬프트는 ChatGPT가 `pongdang_codex_current_audio_safe.zip`을 받은 뒤, 코드 변경 전에 파일 안정화 상태를 확인하도록 지시하는 관리자용 기준이다.

```text
너는 “퐁당퐁당 곤지암천 수족관 v5”의 관리자 검수자다.

첨부된 zip을 먼저 풀고, 새 기능을 만들기 전에 파일 구조와 안정화 상태를 전수 점검해라.
문제가 없으면 수정하지 말고 “안정화 유지”라고 판단한다.
문제가 있으면 최소 수정만 하고, 어떤 파일을 왜 바꿨는지 보고한다.

현재 기준 실행본:
- 실제 실행 HTML:
  app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
- 실제 실행 JS:
  app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js
- 실제 실행 CSS:
  app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/main.css

현재 기준 커밋:
- 9546898 Harden v30A1 audio handoff

먼저 확인할 것:
1. 루트 index.html은 v4837 런처 계열이다. 실제 작업 기준과 혼동하지 않는다.
2. v30A1 폴더 안의 index.html, src/app.js, src/styles/main.css가 존재하는지 확인한다.
3. docs/MASTER_개발기획서_상시참조.txt가 존재하는지 확인한다.
4. docs/CHATGPT_HANDOFF_PROMPT_AUDIO_SAFE.md가 존재하는지 확인한다.
5. assets/bg의 JPG 배경 10장이 존재하는지 확인한다.
6. assets/fish/beodeulchi/aquarium의 버들치 이미지가 존재하는지 확인한다.
7. assets/audio는 현재 README 중심이며 실제 mp3가 없음을 확인한다.

파일 무결성 점검:
1. src/app.js에서 document.getElementById로 참조하는 id가 index.html에 모두 존재하는지 확인한다.
2. src/app.js와 index.html에서 참조하는 assets 경로가 실제 파일로 존재하는지 확인한다.
3. index.html의 stylesheet가 ./src/styles/main.css를 가리키는지 확인한다.
4. index.html의 script가 ./src/app.js를 가리키는지 확인한다.
5. 첫 preload가 assets/bg/upper/day.jpg인지 확인한다.

음성 안정화 점검:
1. AUDIO_SCRIPT_DATABASE가 존재하는지 확인한다.
2. audioPath 항목 수와 audioPath:null 항목 수가 같은지 확인한다.
3. audioPath에 실제 없는 mp3 경로가 들어가 있으면 제거하고 null로 되돌린다.
4. fallbackTts가 유지되는지 확인한다.
5. stopAudio가 audio 객체와 speechSynthesis를 모두 정리하는지 확인한다.
6. playAudioById가 새 음성 재생 전에 stopAudio를 호출하는지 확인한다.
7. playToken이 있어 이전 TTS/MP3 콜백이 새 상태를 덮어쓰지 않는지 확인한다.
8. hasUsableAudioPath가 있어 빈 audioPath를 재생하지 않는지 확인한다.
9. audioClose, audioStop, audioReplay 이벤트가 연결되어 있는지 확인한다.
10. 존 변경, 패널 닫기, 페이지 숨김에서 stopAudio가 호출되는지 확인한다.

배경/성능 안정화 점검:
1. ZONES의 day/night 배경이 JPG를 우선 사용하고 있는지 확인한다.
2. JPG 실패 시 PNG fallback이 있는지 확인한다.
3. 현재 존 배경 우선 로드와 나머지 지연 로드 큐가 있는지 확인한다.
4. performance audit이 존재하는지 확인한다.
5. slow frame 감지 시 particleScale 완화가 있는지 확인한다.

버들치 유영 안정화 점검:
1. avoidCollision이 존재하는지 확인한다.
2. guideFishBackInside가 존재하는지 확인한다.
3. enforceSingleActiveFish가 존재하는지 확인한다.
4. clickable 물고기가 동시에 2마리 이상 되지 않도록 방어하는지 확인한다.

검증 명령:
```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
```

보고 형식:
1. 실제 실행 HTML:
2. 실제 실행 JS:
3. 실제 실행 CSS:
4. 누락된 DOM id:
5. 누락된 assets:
6. 음성 안정화 상태:
7. 배경/성능 안정화 상태:
8. 버들치 유영 안정화 상태:
9. 발견된 문제:
10. 수정한 파일:
11. 검증 결과:
12. 다음 권장 작업:

절대 금지:
- 새 기능을 동시에 여러 개 추가하지 않는다.
- 루트 index.html과 v30A1 index.html을 섞지 않는다.
- 실제 없는 mp3 경로를 audioPath에 넣지 않는다.
- 파일 구조를 재배치하지 않는다.
- 기존 안정화 함수를 중복 생성하지 않는다.
- 작동하지 않는 것을 작동한다고 보고하지 않는다.
```

## Codex 기준 점검 결과

- `node --check app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js` 통과
- `document.getElementById` 누락 id: 0개
- 참조 assets 누락: 0개
- `audioPath` 총 18개, `audioPath:null` 18개
- `playToken`, `hasUsableAudioPath`, `stopAudio` 존재 확인
- 실제 사용 JPG 배경 10장 존재 확인
- 로컬 서버 주요 파일 HEAD 200 확인
