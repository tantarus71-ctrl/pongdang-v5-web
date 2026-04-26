# Pongdang V5 Web

곤지암천 관찰형 수중 생태 학습 웹앱입니다. 이 저장소의 기준 최신본은 GitHub `main`과 `gh-pages` 브랜치에 함께 유지합니다.

## 현재 기준

- Version: `v4.8.30`
- App entry: `app_assets/index.html`
- Root redirect: `index.html`
- Patch entry: `patches/latest.generated.patch.js`
- Chat/Codex plan: `docs/CHAT_VERSION_INTEGRATION_PLAN.md`
- Fish data draft: `data/fish_catalog_option2.json`
- Public URL: https://tantarus71-ctrl.github.io/pongdang-v5-web/
- Local URL: http://127.0.0.1:4830/

## 작업 원칙

1. `manifest.json`을 저장소의 사람/AI 공통 기준으로 둡니다.
2. `project-manifest.json`은 Codex 작업 상태와 다음 단계를 기록합니다.
3. `package_manifest.json`은 예전 자동화 호환용 별칭으로 유지하되, 버전은 항상 맞춥니다.
4. 새 기능은 기존 수족관 프레임을 보존하고, 패치 또는 작은 단위로 누적합니다.
5. 수정 후에는 `tools/validate-release.ps1`로 구조 검증을 통과시킨 뒤 커밋합니다.
6. 새 챗버전의 아이디어는 먼저 `docs/CHAT_VERSION_INTEGRATION_PLAN.md`와 `data/fish_catalog_option2.json`에 반영한 뒤 런타임으로 옮깁니다.

## 자주 쓰는 명령

로컬 실행:

```powershell
.\run-local-v4830.cmd
```

구조 검증:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\validate-release.ps1
```

검증 후 GitHub와 Pages에 동시 반영:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\publish-release.ps1 -CommitMessage "Publish Pongdang v4.8.31"
```

## ChatGPT / Codex 업데이트 방식

ChatGPT나 Codex에 새 작업을 맡길 때는 `docs/CODEX_CHATGPT_SYNC.md`를 먼저 붙여 넣거나 참조합니다. 그러면 버전, 파일 위치, 검증, 배포 방식이 같은 기준으로 이어집니다.
