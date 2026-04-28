# MASTER 추가 기록 - 2026-04-28 웃물 낮 q88 1슬롯 실제 반영

## [2026-04-28 웃물 낮 q88 1슬롯 실제 반영]

- 목표:
  웃물 낮 배경 1개 슬롯만 optimized q88 후보로 실제 반영한다.

- 수정 파일:
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/utmul-day-q88-override.js`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/zones.json`
  - `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/assets_manifest.json`
  - `docs/STEP_2026-04-28_UTMUL_DAY_Q88_APPLY.md`
  - `docs/MASTER_APPEND_2026-04-28_UTMUL_DAY_Q88_APPLY.md`

- 변경 내용:
  - preload 경로를 q88 후보로 변경했다.
  - `utmul-day-q88-override.js`를 추가해 기존 app.js를 직접 덮어쓰지 않고 웃물 낮 배경만 q88로 적용한다.
  - `zones.json`의 `utmul.dayBackground`를 q88 후보로 변경했다.
  - `assets_manifest.json`의 `utmul_day.path`를 q88 후보로 변경했다.
  - 원본 JPG는 `fallbackPath`로 유지했다.

- 건드리지 않은 기능:
  - 다른 9개 배경
  - q82 후보
  - 원본 이미지
  - 물고기 유영
  - 음성
  - 도감
  - 미션
  - 카메라
  - GPS
  - 관리자 편집/저장 기능

- 검증:
  - GitHub 파일 반영 완료
  - 로컬에서 아래 검증 필요:
    - `app.js node --check`
    - `data-loader.js node --check`
    - `admin-preview.js node --check`
    - `utmul-day-q88-override.js node --check`
    - `zones.json parse`
    - `assets_manifest.json parse`
    - 브라우저 index/admin-preview 확인

- 발견 오류:
  - GitHub 커넥터에서 대형 `app.js` 응답이 중간에서 잘려 전체 파일 직접 수정은 위험하다고 판단했다.

- 해결:
  - `app.js` 직접 수정 대신 별도 override 스크립트를 추가하는 방식으로 런타임 안정성을 우선했다.
  - index preload와 data JSON은 q88 기준으로 맞췄다.

- 롤백:
  - `index.html` preload를 `./assets/bg/upper/day.jpg?v=30A1-assetfix`로 복구
  - `index.html`에서 `utmul-day-q88-override.js` 연결 제거
  - `zones.json`의 `utmul.dayBackground`를 `assets/bg/upper/day.jpg`로 복구
  - `assets_manifest.json`의 `utmul_day.path`를 `assets/bg/upper/day.jpg`로 복구

- 남은 리스크:
  - override 방식이므로 app.js 내부 배경 재설정과 상호작용을 브라우저에서 확인해야 한다.
  - GitHub Pages 캐시 지연 가능성.
  - 실기기 모바일 품질 확인은 별도.

- 다음 단계:
  q88 반영 후 최종 검수를 진행한다.
