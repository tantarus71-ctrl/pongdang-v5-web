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
