# 단계별 개발계획서: MASTER 작업 규칙 등록

작성일: 2026-04-27

## 1. 기준 안정본 확인

- 기준 버전: v30A-1 audio stability final
- 기준 경로: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 확인 구조:
  - `index.html`
  - `src/`
  - `assets/`
  - `docs/`
- 이번 단계에서는 앱 기능 코드를 수정하지 않는다.

## 2. 이번 단계 목표

- 목표 1개: 향후 모든 개발 작업의 공통 절차를 MASTER 문서로 고정한다.

## 3. 건드리지 말아야 할 기능

- 버들치 유영 엔진
- 도감/미션/카메라/탐사/음성/GPS 메뉴
- 이미지 자산
- CSS 레이아웃
- 캐시 우회 런타임
- 저장 상태

## 4. 기존 구조 분석

- `docs` 폴더는 존재한다.
- `MASTER_개발기획서_상시참조.txt`는 없었다.
- 기존 v30A-1 구조화 문서는 `V30A1_CODEX_UPDATE.md`, `V30A1_STRUCTURE_OPTIMIZATION_PROMPT.md`에 나뉘어 있었다.

## 5. 패치 설계

- 새 파일 추가:
  - `docs/MASTER_개발기획서_상시참조.txt`
  - `docs/STEP_2026-04-27_MASTER_WORKFLOW_RULES.md`
- 앱 런타임 파일은 수정하지 않는다.
- fallback:
  - MASTER 문서가 없으면 새로 생성한다.
  - 기존 앱 안정본은 그대로 둔다.

## 6. 실제 적용

- 사용자 제공 공통 작업 순서, 절대 금지, 오류 발생 시 원칙을 MASTER 문서에 반영했다.
- 단계별 기록 양식을 추가했다.
- 현재 단계 기록을 MASTER 문서 하단에 남겼다.

## 7. 검증 체크리스트

- [x] MASTER 문서 존재 확인
- [x] 단계별 개발계획서 존재 확인
- [x] 앱 런타임 파일 미수정 확인
- [x] 문서에 공통 작업 순서 포함 확인
- [x] 문서에 절대 금지 포함 확인
- [x] 문서에 오류 처리 원칙 포함 확인

## 8. 다음 단계 제안

- 다음 단계 1개:
  v30A-1 구조 최적화 1단계로 `assetManifest` 분리를 진행한다.
