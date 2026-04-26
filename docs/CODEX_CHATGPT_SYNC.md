# Codex / ChatGPT 작업 동기화 기준

이 문서는 ChatGPT, Codex, GitHub 저장소가 같은 기준으로 이어서 작업하기 위한 시작 프롬프트입니다.

## 현재 기준

- 저장소: `tantarus71-ctrl/pongdang-v5-web`
- 기준 브랜치: `main`
- 배포 브랜치: `gh-pages`
- 현재 버전: `v4.8.30`
- 앱 파일: `app_assets/index.html`
- 패치 파일: `patches/latest.generated.patch.js`
- 기준 파일: `manifest.json`, `project-manifest.json`, `package_manifest.json`
- 로컬 실행: `run-local-v4830.cmd`
- 검증: `tools/validate-release.ps1`
- 배포: `tools/publish-release.ps1`

## 새 작업을 시작할 때

1. `manifest.json`을 먼저 읽고 현재 버전과 다음 단계를 확인한다.
2. `project-manifest.json`에서 Codex 작업 상태를 확인한다.
3. 기능 수정은 가능한 한 `patches/latest.generated.patch.js` 또는 작은 범위의 HTML 수정으로 처리한다.
4. 이미지/배경/물고기 에셋은 `assets/` 아래 경로를 유지한다.
5. 수정 후 반드시 `tools/validate-release.ps1`을 실행한다.

## 버전을 올릴 때

다음 파일의 버전을 함께 바꾼다.

- `manifest.json`
- `project-manifest.json`
- `package_manifest.json`
- `README.md`
- `app_assets/index.html`의 `<title>` 및 패치 쿼리 문자열

버전 기록은 `completed_step`과 `next_step`에 남긴다.

## 배포할 때

검증 후 아래 스크립트로 `main`과 `gh-pages`를 함께 맞춘다.

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\publish-release.ps1 -CommitMessage "Publish Pongdang vX.Y.Z"
```

## 금지

- GitHub `main`과 `gh-pages`를 서로 다른 버전으로 방치하지 않는다.
- 매니페스트 버전과 실제 HTML 제목을 다르게 두지 않는다.
- 에셋 경로를 바꿀 때 기존 경로 호환성을 확인하지 않고 삭제하지 않는다.
- 검증 없이 배포하지 않는다.
