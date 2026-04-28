# ChatGPT 인계 프롬프트 - 퐁당퐁당 곤지암천 v30A1 음성 안정화 기준본

아래 프롬프트를 ChatGPT에 그대로 전달한다.

```text
너는 지금부터 “퐁당퐁당 곤지암천 수족관 v5”의 현재 Codex 작업본을 이어받는 개발자다.

목표는 새로 갈아엎는 것이 아니라, 첨부된 전체 백업 zip을 기준 안정본으로 열고 같은 구조를 유지하면서 필요한 작업만 단계별로 진행하는 것이다.

현재 기준본:
- 저장소/백업명: pongdang-v5-web-github
- 실제 실행 기준 폴더:
  app_assets/pongdang_gonjiam_v30A1_audio_stability_final/
- 실제 실행 HTML:
  app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html
- 실제 실행 JS:
  app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js
- 실제 실행 CSS:
  app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/main.css
- 루트 index.html은 v4837 런처 계열이며, 현재 실작업 기준은 v30A1 폴더다.

현재 버전 판단:
- v30A-1 음성 안정화 final 기준
- 배경/레이어/물방울/버들치 유영/성능 최적화 일부 반영
- v4837 발견 UX 파일은 루트 런처/과거 계열로 남아 있으므로 임의로 섞지 않는다.

절대 금지:
- 파일 구조를 마음대로 재배치하지 않는다.
- 루트 index.html과 v30A1 index.html의 역할을 혼동하지 않는다.
- 기존 안정본을 덮어쓰거나 삭제하지 않는다.
- index.html에 모든 로직을 몰아넣지 않는다.
- 같은 함수와 같은 CSS 역할을 중복 생성하지 않는다.
- 음성 mp3 파일이 실제로 없는데 audioPath에 mp3 경로를 넣지 않는다.
- GPS, 카메라, 다운로드 권한을 자동 요청하지 않는다.
- 여러 기능을 한 번에 수정하지 않는다.

음성 안정화 현재 기준:
- AUDIO_SCRIPT_DATABASE가 src/app.js 안에 있다.
- 모든 audioPath는 현재 null이다.
- 실제 mp3 파일이 없으므로 TTS fallback을 사용한다.
- fallbackTts:true인 스크립트는 speechSynthesis로 읽는다.
- audio_unavailable만 fallbackTts:false이다.
- stopAudio()는 기존 audio 객체와 speechSynthesis를 모두 정리한다.
- playAudioById()는 새 음성을 재생하기 전에 stopAudio()를 호출한다.
- speechSynthesis.cancel()은 stopAudio와 speakText 시작 전에 호출된다.
- audioClose, audioStop, audioReplay 버튼이 연결되어 있다.
- 존 변경, 팝업 닫기, 패널 전환, 페이지 숨김 시 stopAudio가 호출된다.
- playToken 방어가 들어가 있어 이전 TTS/MP3 콜백이 새 재생 상태를 덮어쓰지 않아야 한다.
- hasUsableAudioPath()가 있어 빈 문자열/잘못된 audioPath를 무리하게 mp3로 재생하지 않는다.

작업 전 반드시 확인:
1. 현재 작업 폴더에서 index.html, app_assets, docs, README.md 존재 확인
2. 실제 실행 파일이 app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html인지 확인
3. src/app.js 문법 검사
4. AUDIO_SCRIPT_DATABASE의 audioPath가 모두 null인지 확인
5. audioPath를 추가해야 한다면 먼저 assets/audio에 실제 파일이 있는지 확인
6. 변경 후 node --check app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js 실행
7. docs/MASTER_개발기획서_상시참조.txt에 작업 기록 추가

음성 QA 체크리스트:
1. 음성 버튼을 여러 번 빠르게 눌러도 중복 재생되지 않는가?
2. 다시 듣기 버튼이 마지막 스크립트를 다시 읽는가?
3. 그만 듣기 버튼이 즉시 정지하는가?
4. 닫기 버튼이 패널과 음성을 함께 정리하는가?
5. 존 변경 시 이전 음성이 멈추는가?
6. 도감/미션/카메라/탐사 패널 전환 시 이전 음성이 남지 않는가?
7. 페이지를 숨기거나 다른 탭으로 이동하면 음성이 멈추는가?
8. mp3가 없어도 콘솔에 반복 404 요청이 생기지 않는가?
9. TTS 미지원 기기에서는 안내 문구가 뜨는가?
10. 어린이용 문장이 너무 길거나 어려워지지 않았는가?

작업 방식:
- 한 번에 기능 1개만 수정한다.
- 수정 전 관련 함수와 연결 버튼을 먼저 확인한다.
- 최소 패치로 적용한다.
- 검증 결과를 문서에 남긴다.
- 작동하지 않는 것을 작동한다고 말하지 않는다.

다음 작업 추천:
- 실제 모바일에서 음성 버튼, 다시 듣기, 그만 듣기, 닫기, 존 변경 흐름을 수동 QA한다.
- mp3 음성 파일을 추가할 경우 assets/audio/ 아래에 실제 파일을 먼저 넣고 audioPath를 상대 경로로 연결한다.
- mp3 연결 후에도 TTS fallback은 유지한다.
```

## 백업 파일 권장명

```text
pongdang_codex_current_audio_safe.zip
```

## 기준 검증 명령

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
```
