# 새 ChatGPT / Codex 세션 시작 프롬프트

아래 내용을 새 대화나 새 Codex 세션 시작 시 먼저 읽고 작업한다.

```text
너는 Pongdang V5 Web 프로젝트를 이어서 개발한다.

반드시 먼저 읽을 파일:
1. manifest.json
2. project-manifest.json
3. data/development_memory.json
4. docs/PROJECT_LEARNING_SYSTEM.md
5. docs/CHAT_VERSION_INTEGRATION_PLAN.md
6. docs/CODEX_CHATGPT_SYNC.md
7. data/gonjiam_ecosystem_assets_v1.json

현재 기준:
- 저장소: tantarus71-ctrl/pongdang-v5-web
- 기준 브랜치: main
- 배포 브랜치: gh-pages
- 현재 안정 실행 기준: v4.8.30
- 앱 진입점: app_assets/index.html
- 패치 진입점: patches/latest.generated.patch.js
- 로컬 실행: http://127.0.0.1:4830/
- 배포 주소: https://tantarus71-ctrl.github.io/pongdang-v5-web/

작업 원칙:
- 실행 중인 v4.8.30 화면을 깨지 않는다.
- 새 기능은 문서/데이터/후보 패치로 먼저 정리한 뒤 런타임에 반영한다.
- 물고기 확장은 data/fish_catalog_option2.json 기준으로 정규화한다.
- 곤지암천 생태계 에셋 후보는 data/gonjiam_ecosystem_assets_v1.json에서 확인하되, 현장 확인 전에는 확정 출현종으로 단정하지 않는다.
- 모바일 메뉴는 중복 CSS를 만들지 않고 latest.generated.patch.js 안의 한 경로로 통합한다.
- 수정 후 tools/validate-release.ps1을 반드시 통과시킨다.
- 완료 후 tools/record-learning.ps1로 배운 점과 다음 작업을 기록한다.
- 배포는 tools/publish-release.ps1로 main과 gh-pages를 함께 맞춘다.
```
*** Add File: C:\Users\tanta\Documents\Codex\2026-04-25\pongdang-v5-web-github\docs\DECISION_LOG.md
# 기술 결정 로그

## 2026-04-26: 저장소 기반 프로젝트 학습 시스템 채택

- 결정: 모델 자체 학습 대신 저장소 안에 프로젝트 기억 파일을 두고, 모든 ChatGPT/Codex 세션이 이를 읽고 이어받는다.
- 이유: 실제 모델 가중치는 사용자가 직접 업데이트할 수 없지만, 저장소 문서와 JSON 기억은 버전 관리되고 재사용 가능하다.
- 반영 파일:
  - `data/development_memory.json`
  - `docs/PROJECT_LEARNING_SYSTEM.md`
  - `docs/SESSION_START_PROMPT.md`
  - `docs/LEARNING_LOG.md`
  - `tools/record-learning.ps1`

## 2026-04-26: 안정 실행 기준은 v4.8.30으로 유지

- 결정: 새 챗버전의 `v4.8.31~v4.8.35` 자료는 통합하되, 루트 실행 기준은 `v4.8.30`으로 유지한다.
- 이유: 현재 Pages와 로컬 실행에서 검증된 화면을 기준으로 삼아야 다음 확장 작업이 안정적이다.

## 2026-04-26: 물고기 확장은 데이터 초안 후 런타임 반영

- 결정: 버들치와 후속 어종은 `data/fish_catalog_option2.json`에 먼저 정리한다.
- 이유: 런타임 JS 안에 데이터가 흩어지면 중복과 회귀가 쉽게 생긴다.
