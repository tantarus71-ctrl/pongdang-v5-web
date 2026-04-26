# 프로젝트 학습 시스템

이 저장소의 "딥러닝"은 모델 자체를 새로 학습시키는 것이 아니라, 모든 개발 세션의 지식이 저장소 안에 누적되어 다음 ChatGPT/Codex가 즉시 이어받을 수 있게 만드는 운영 방식입니다.

## 목표

- 새 버전이 만들어질 때마다 기술 결정, 실패 원인, 검증 결과, 다음 작업을 기록한다.
- ChatGPT와 Codex가 같은 시작 프롬프트와 같은 기준 문서를 읽는다.
- GitHub `main`과 `gh-pages`가 항상 같은 개발 기억을 공유한다.
- 앱 런타임은 안정적으로 유지하고, 실험은 후보 패치와 문서로 먼저 축적한다.

## 학습 저장소 구조

- `data/development_memory.json`: 기계가 읽는 프로젝트 기억
- `data/gonjiam_ecosystem_assets_v1.json`: 곤지암천형 생태계 후보 자산 계획
- `docs/SESSION_START_PROMPT.md`: 새 ChatGPT/Codex 세션에 붙여 넣는 시작 프롬프트
- `docs/DECISION_LOG.md`: 중요한 기술 결정 기록
- `docs/LEARNING_LOG.md`: 세션별 학습/검증/다음 작업 기록
- `docs/CHAT_VERSION_INTEGRATION_PLAN.md`: 새 챗버전 확장 계획
- `data/fish_catalog_option2.json`: 물고기 데이터 확장 초안
- `tools/record-learning.ps1`: 작업 후 학습 기록을 남기는 스크립트
- `tools/validate-release.ps1`: 저장소 기준과 학습 파일 일관성 검증
- `tools/publish-release.ps1`: 검증 후 `main`과 `gh-pages` 동시 배포

## 개발 세션 시작 절차

1. `docs/SESSION_START_PROMPT.md`를 읽는다.
2. `manifest.json`에서 현재 버전과 다음 단계를 확인한다.
3. `data/development_memory.json`에서 불변 규칙과 최근 학습을 확인한다.
4. `docs/CHAT_VERSION_INTEGRATION_PLAN.md`에서 백로그를 확인한다.
5. `data/gonjiam_ecosystem_assets_v1.json`에서 새 생태계 후보 지식을 확인한다.
6. 현재 앱을 `http://127.0.0.1:4830/`에서 확인한다.

## 개발 중 규칙

1. 기능은 작은 단위로 나눈다.
2. 런타임에 바로 넣기 전에 문서/데이터/후보 패치로 먼저 구조화한다.
3. 기존 `v4.8.30` 실행 화면을 깨지 않는다.
4. 물고기 확장은 `data/fish_catalog_option2.json`에서 먼저 정규화한다.
5. 모바일 레이아웃은 360, 375, 390, 412, 430px 폭 기준으로 확인한다.

## 개발 세션 종료 절차

1. `tools/validate-release.ps1` 실행
2. `tools/record-learning.ps1`로 세션 결과 기록
3. 필요한 경우 `tools/publish-release.ps1`로 GitHub와 Pages 동시 반영
4. 다음 세션이 할 일을 `data/development_memory.json`의 `nextLearningTargets`에 남긴다.

## 중요한 한계

ChatGPT나 Codex의 모델 가중치를 이 저장소가 직접 바꾸지는 않습니다. 대신 이 저장소가 프로젝트 전용 기억 장치가 됩니다. 다음 세션은 이 파일들을 읽고 같은 기준으로 판단하게 됩니다.
